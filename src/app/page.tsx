"use client";

import { useProgress } from "@/components/progress/ProgressProvider";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Landing } from "@/components/dashboard/Landing";

export default function HomePage() {
  const { state, ready } = useProgress();

  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 pt-10 sm:px-6" aria-busy>
        <div className="h-10 w-64 animate-pulse rounded-lg bg-ink/5" />
        <div className="mt-7 h-56 animate-pulse rounded-2xl bg-ink/5" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="h-14 animate-pulse rounded-2xl bg-ink/5" />
          <div className="h-14 animate-pulse rounded-2xl bg-ink/5" />
        </div>
      </div>
    );
  }

  return state.diagnosticDone ? <Dashboard /> : <Landing />;
}
