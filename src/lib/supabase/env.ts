/**
 * Supabase is optional: without the keys the app still runs, just in guest
 * mode with progress kept in localStorage. Every entry point checks this
 * rather than throwing, so a missing .env.local degrades instead of breaking.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
}
