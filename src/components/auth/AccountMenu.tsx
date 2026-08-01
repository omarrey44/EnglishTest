"use client";

import { CloudOff, LogOut } from "lucide-react";
import { useSession } from "@/components/auth/SessionProvider";
import { signOut } from "@/app/auth/actions";
import { usernameFromEmail } from "@/lib/auth/username";

export function AccountMenu() {
  const { user, ready } = useSession();

  if (!ready) {
    return (
      <span className="ink-load h-10 w-24 rounded-full" aria-hidden />
    );
  }

  const label = user
    ? (typeof user.user_metadata?.username === "string" ? user.user_metadata.username : null) ??
      usernameFromEmail(user.email) ??
      "Account"
    : "Guest";

  return (
    <form action={signOut}>
      <button
        type="submit"
        aria-label={user ? `Sign out ${label}` : "Exit guest mode"}
        className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-danger/20 bg-white px-3.5 text-xs font-semibold text-danger transition-colors hover:border-danger/35 hover:bg-danger/8"
      >
        <LogOut className="size-4" />
        <span>Sign out</span>
      </button>
    </form>
  );
}

/** Small marker for guests, so nobody loses work by assuming it is synced. */
export function GuestBadge() {
  const { user, ready } = useSession();
  if (!ready || user) return null;

  return (
    <span
      title="Progress is stored in this browser only"
      className="hidden min-h-10 items-center gap-2 rounded-full border border-line bg-surface px-3.5 text-xs font-semibold text-muted md:inline-flex"
    >
      <CloudOff className="size-4" />
      Guest
    </span>
  );
}
