"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Flame, LayoutDashboard, LibraryBig, Menu, Trophy } from "lucide-react";
import { useProgress } from "@/components/progress/ProgressProvider";
import { AccountMenu, GuestBadge } from "@/components/auth/AccountMenu";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/practice?mode=smart", label: "Practice", icon: BookOpen },
  { href: "/exam", label: "Simulator", icon: Trophy },
  { href: "/learn", label: "Topics", icon: LibraryBig },
] as const;

export function AppHeader({ compact = false }: { compact?: boolean }) {
  const { state } = useProgress();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/88 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center gap-6 px-5 sm:px-8 lg:px-12">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="English Exam Trainer">
          <span className="grid size-10 place-items-center rounded-xl bg-accent text-white shadow-[0_8px_20px_rgba(19,86,232,.22)]">
            <BookOpen className="size-5" strokeWidth={2.2} />
          </span>
          <span className="hidden font-display text-xl font-semibold tracking-[-0.025em] text-ink sm:inline">
            English Exam Trainer
          </span>
        </Link>

        {!compact ? (
          <nav className="mx-auto hidden h-full items-center gap-1 lg:flex" aria-label="Main navigation">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href.split("?")[0] ? "page" : undefined}
                className={`group relative inline-flex h-full items-center gap-2 px-4 text-sm font-medium transition-colors hover:text-ink ${
                  pathname === href.split("?")[0] ? "text-ink" : "text-muted"
                }`}
              >
                <Icon className={`size-4 transition-colors group-hover:text-accent ${pathname === href.split("?")[0] ? "text-accent" : "text-muted"}`} />
                {label}
                <span className={`absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-accent transition-transform group-hover:scale-x-100 ${
                  pathname === href.split("?")[0] ? "scale-x-100" : "scale-x-0"
                }`} />
              </Link>
            ))}
          </nav>
        ) : (
          <span className="mx-auto" />
        )}

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden min-h-10 items-center gap-2 rounded-full bg-orange-50 px-4 text-xs font-semibold text-warning sm:flex">
            <Flame className="size-4" />
            {state.streak} day streak
          </span>
          <span className="grid min-h-10 min-w-10 place-items-center rounded-full border border-line bg-surface text-xs font-bold text-accent">
            {state.xp}
            <span className="sr-only">experience points</span>
          </span>
          <GuestBadge />
          <AccountMenu />
          {!compact ? (
            <details className="relative lg:hidden">
              <summary className="grid min-h-11 min-w-11 cursor-pointer list-none place-items-center rounded-full border border-line bg-white">
                <Menu className="size-5" />
                <span className="sr-only">Open menu</span>
              </summary>
              <nav className="absolute right-0 mt-3 w-52 rounded-2xl border border-line bg-white p-2 shadow-card">
                {NAV.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    aria-current={pathname === href.split("?")[0] ? "page" : undefined}
                    className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm hover:bg-surface-2 ${
                      pathname === href.split("?")[0] ? "bg-blue-50 font-semibold text-accent" : ""
                    }`}
                  >
                    <Icon className="size-4 text-accent" />
                    {label}
                  </Link>
                ))}
              </nav>
            </details>
          ) : null}
        </div>
      </div>
    </header>
  );
}
