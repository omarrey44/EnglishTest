import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProgressState } from "@/types/progress";
import { migrate, type ProgressStorage } from "@/lib/storage";

/** A save is queued rather than sent per answer; this is the trailing delay. */
const SAVE_DEBOUNCE_MS = 900;

/**
 * Progress kept in the `progress` table, one row per user, guarded by RLS.
 *
 * The session runner saves after every single answer, so writes are debounced
 * and flushed when the tab is hidden — otherwise a 20-question diagnostic
 * would mean 20 round trips.
 */
export function createSupabaseProgressStorage(
  supabase: SupabaseClient,
  userId: string,
): ProgressStorage & { flush: () => Promise<void> } {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pending: ProgressState | null = null;
  let inFlight: Promise<void> = Promise.resolve();

  async function write(state: ProgressState): Promise<void> {
    const { error } = await supabase
      .from("progress")
      .upsert({ user_id: userId, state, updated_at: new Date().toISOString() });
    if (error) {
      // Keep the app usable: the state is still in memory and the next save
      // will try again with the newer snapshot.
      console.error("Could not save progress:", error.message);
    }
  }

  async function flush(): Promise<void> {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    const state = pending;
    pending = null;
    if (state) {
      inFlight = write(state);
    }
    await inFlight;
  }

  return {
    async load() {
      const { data, error } = await supabase
        .from("progress")
        .select("state")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Could not load progress:", error.message);
        return null;
      }
      if (!data?.state) return null;

      return migrate(data.state as Partial<ProgressState>);
    },

    async save(state) {
      pending = { ...state, updatedAt: Date.now() };
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => void flush(), SAVE_DEBOUNCE_MS);
    },

    async clear() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      pending = null;
      const { error } = await supabase.from("progress").delete().eq("user_id", userId);
      if (error) console.error("Could not clear progress:", error.message);
    },

    flush,
  };
}
