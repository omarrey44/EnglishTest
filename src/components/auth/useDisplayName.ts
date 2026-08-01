"use client";

import { useSession } from "@/components/auth/SessionProvider";
import { usernameFromEmail } from "@/lib/auth/username";

export interface DisplayName {
  /** The username to show, or null while loading or in guest mode. */
  name: string | null;
  isGuest: boolean;
  ready: boolean;
}

/**
 * The name to greet someone by. Prefers the username captured at sign-up and
 * falls back to unwrapping the synthetic address, so accounts created before
 * that metadata existed still show something sensible.
 */
export function useDisplayName(): DisplayName {
  const { user, ready } = useSession();

  if (!ready) return { name: null, isGuest: false, ready: false };
  if (!user) return { name: null, isGuest: true, ready: true };

  const fromMetadata =
    typeof user.user_metadata?.username === "string" ? user.user_metadata.username : null;

  return {
    name: fromMetadata ?? usernameFromEmail(user.email) ?? "Account",
    isGuest: false,
    ready: true,
  };
}
