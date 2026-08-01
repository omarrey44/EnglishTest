"use client";

import { Dashboard } from "@/components/dashboard/Dashboard";
import { Landing } from "@/components/dashboard/Landing";
import { useProgress } from "@/components/progress/ProgressProvider";

export function HomeContent() {
  const { state, ready } = useProgress();

  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-5xl px-5 pt-12 sm:px-8" aria-busy>
        <div className="ink-load h-3 w-32 rounded-[2px]" />
        <div className="ink-load mt-5 h-11 w-72 rounded-[3px]" />
        <div className="ink-load mt-9 h-64 rounded-xl" />
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          <div className="ink-load h-16 rounded-xl" />
          <div className="ink-load h-16 rounded-xl" />
        </div>
      </div>
    );
  }

  return state.diagnosticDone ? <Dashboard /> : <Landing />;
}

