"use client";

import { CloudOff, LogOut, UserRound } from "lucide-react";
import { signOut } from "@/app/auth/actions";
import { useDisplayName } from "@/components/auth/useDisplayName";

export function AccountMenu() {
  const { name, isGuest, ready } = useDisplayName();

  if (!ready) {
    return <span className="ink-load h-10 w-24 rounded-full" aria-hidden />;
  }

  return (
    <div className="flex items-center gap-2">
      {name ? (
        <span
          className="inline-flex min-h-10 max-w-[11rem] items-center gap-2 rounded-full border border-line bg-surface px-3.5 text-xs font-semibold text-ink"
          title={`Signed in as ${name}`}
        >
          <UserRound className="size-4 shrink-0 text-accent" />
          <span className="truncate">{name}</span>
        </span>
      ) : null}

      <form action={signOut}>
        <button
          type="submit"
          aria-label={isGuest ? "Exit guest mode" : `Sign out ${name}`}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-danger/20 bg-white px-3.5 text-xs font-semibold text-danger transition-colors hover:border-danger/35 hover:bg-danger/8"
        >
          <LogOut className="size-4" />
          {/* The name beside it already says who is signed in. */}
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </form>
    </div>
  );
}

/** Small marker for guests, so nobody loses work by assuming it is synced. */
export function GuestBadge() {
  const { isGuest, ready } = useDisplayName();
  if (!ready || !isGuest) return null;

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
