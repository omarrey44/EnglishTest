"use client";

import { CheckCircle2, RefreshCw } from "lucide-react";
import { useProgress } from "@/components/progress/ProgressProvider";
import { Badge } from "@/components/ui/Badge";
import { Eyebrow, SectionTitle } from "@/components/ui/Card";
import { BackLink, ButtonLink } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { TOPIC_MAP } from "@/data/topics";
import { AppHeader } from "@/components/dashboard/AppHeader";

export default function ReviewPage() {
  const { state, ready } = useProgress();

  if (!ready) return <Loading label="Loading your mistakes…" />;

  const open = state.mistakes.filter((m) => !m.resolved);
  const resolved = state.mistakes.filter((m) => m.resolved);

  return (
    <>
    <AppHeader />
    <div className="mx-auto w-full max-w-4xl px-5 pt-8 pb-16 sm:px-8 sm:pt-12">
      <BackLink href="/">Dashboard</BackLink>

      <header className="mt-8 rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
        <div className="flex items-center gap-4">
          <Eyebrow>{open.length} open</Eyebrow>
          <span aria-hidden className="leader" />
          <span className="index text-muted">{resolved.length} fixed</span>
        </div>
        <h1 className="mt-3 font-display text-[2.75rem] leading-[0.9] tracking-[-0.03em] sm:text-[3.5rem]">
          Errata
        </h1>
        <p className="mt-4 max-w-xl leading-relaxed text-muted">
          Every mistake stays here until you answer a different question on the same rule.
        </p>
      </header>

      {open.length > 0 ? (
        <ButtonLink href="/practice?mode=mistakes" size="lg" className="mt-7">
          <RefreshCw className="size-4" />
          Practice these rules again
        </ButtonLink>
      ) : null}

      {open.length === 0 ? (
        <div className="mt-8 flex items-start gap-4 rounded-xl border-2 border-success/40 bg-success/8 p-6">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
          <div>
            <p className="font-display text-2xl tracking-[-0.015em] text-success">
              No open mistakes.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {resolved.length > 0
                ? "You already fixed every rule you got wrong. Run a Smart Practice session to keep going."
                : "Answer some questions and anything you miss will show up here with an explanation."}
            </p>
          </div>
        </div>
      ) : (
        <ul className="mt-10 space-y-2.5">
          {open.map((mistake, i) => (
            <li
              key={`${mistake.questionId}-${i}`}
              className="rise plate rounded-2xl border border-line bg-surface p-5"
              style={{ "--d": `${i * 40}ms` } as React.CSSProperties}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="index tabular text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Eyebrow tone={TOPIC_MAP[mistake.topic].accent}>
                  {TOPIC_MAP[mistake.topic].name}
                </Eyebrow>
                <span aria-hidden className="leader" />
                <Badge className="border-danger/25 bg-danger/10 text-danger">Needs a retry</Badge>
              </div>

              <p className="mt-4 font-display text-xl leading-snug tracking-[-0.015em]">
                {mistake.question}
              </p>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                <div className="rounded-lg border border-danger/25 bg-danger/8 p-3.5">
                  <p className="index text-danger/80">You answered</p>
                  <p className="mt-1.5 text-danger line-through decoration-danger/50">
                    {mistake.userAnswer.trim() || "—"}
                  </p>
                </div>
                <div className="rounded-lg border border-success/25 bg-success/8 p-3.5">
                  <p className="index text-success/80">Correct</p>
                  <p className="mt-1.5 font-semibold">{mistake.correctAnswer}</p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted">{mistake.explanation}</p>
            </li>
          ))}
        </ul>
      )}

      {resolved.length > 0 ? (
        <section className="mt-14">
          <SectionTitle index={`Fixed · ${resolved.length}`} title="Rules you repaired" />
          <ul>
            {resolved.slice(0, 12).map((mistake, i) => (
              <li
                key={`${mistake.questionId}-fixed-${i}`}
                className="flex items-center gap-3 border-b border-line py-3 first:border-t"
              >
                <CheckCircle2 className="size-4 shrink-0 text-success" />
                <span className="min-w-0 flex-1 truncate text-sm">{mistake.question}</span>
                <span aria-hidden className="leader" />
                <span className="index shrink-0 text-muted">
                  {TOPIC_MAP[mistake.topic].short}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
    </>
  );
}
