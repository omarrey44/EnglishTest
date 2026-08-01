"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { getBrowserSupabase } from "@/lib/supabase/client";

interface SessionValue {
  /** Null while signed out, or when Supabase is not configured (guest mode). */
  user: User | null;
  /** Null when Supabase is not configured. */
  supabase: SupabaseClient | null;
  /** False until the first auth check finishes; avoids a signed-out flash. */
  ready: boolean;
}

const SessionContext = createContext<SessionValue>({
  user: null,
  supabase: null,
  ready: true,
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => getBrowserSupabase(), []);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(!supabase);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;

    // getUser() revalidates against the server, unlike getSession() which
    // trusts whatever is in the cookie.
    supabase.auth.getUser().then(({ data }) => {
      if (cancelled) return;
      setUser(data.user);
      setReady(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setReady(true);
    });

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  const value = useMemo(() => ({ user, supabase, ready }), [user, supabase, ready]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  return useContext(SessionContext);
}
