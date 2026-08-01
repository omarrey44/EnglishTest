"use client";

import Link from "next/link";
import { CloudOff, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { useSession } from "@/components/auth/SessionProvider";
import { signOut } from "@/app/auth/actions";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/**
 * Shows who is signed in, or offers to sign in. Guests keep using the app —
 * the badge just makes it clear their progress lives in this browser only.
 */
export function AccountMenu() {
  const { user, ready } = useSession();

  // Nothing to offer when accounts are not set up on this deployment.
  if (!isSupabaseConfigured()) return null;

  // Render the guest state until the check finishes; it is the safer default
  // and avoids a layout jump.
  if (!ready || !user) {
    return (
      <Link
        href="/login"
        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-white px-3.5 text-xs font-semibold text-ink transition-colors hover:border-accent/40 hover:text-accent"
      >
        <LogIn className="size-4 text-accent" />
        <span className="hidden sm:inline">Sign in</span>
        <span className="sr-only sm:hidden">Sign in</span>
      </Link>
    );
  }

  const label = user.email ?? "Account";

  return (
    <details className="relative">
      <summary className="inline-flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-full border border-line bg-white px-3.5 text-xs font-semibold text-ink transition-colors hover:border-accent/40">
        <span className="grid size-6 place-items-center rounded-full bg-blue-50 text-accent">
          <UserIcon className="size-3.5" />
        </span>
        <span className="hidden max-w-[10rem] truncate sm:inline">{label}</span>
        <span className="sr-only sm:hidden">Account</span>
      </summary>

      <div className="absolute right-0 z-50 mt-3 w-64 rounded-2xl border border-line bg-white p-3 shadow-card">
        <p className="index text-muted">Signed in as</p>
        <p className="mt-1 truncate text-sm font-semibold">{label}</p>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          Your progress is saved to this account, on every device.
        </p>

        <form action={signOut} className="mt-3">
          <button
            type="submit"
            className="flex min-h-10 w-full items-center gap-2 rounded-xl px-3 text-sm font-medium text-danger transition-colors hover:bg-danger/8"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </form>
      </div>
    </details>
  );
}

/** Small marker for guests, so nobody loses work by assuming it is synced. */
export function GuestBadge() {
  const { user, ready } = useSession();
  if (!isSupabaseConfigured() || !ready || user) return null;

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
