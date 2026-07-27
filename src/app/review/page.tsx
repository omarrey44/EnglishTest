"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, RefreshCw } from "lucide-react";
import { useProgress } from "@/components/progress/ProgressProvider";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { TOPIC_MAP } from "@/data/topics";

export default function ReviewPage() {
  const { state, ready } = useProgress();

  if (!ready) return <Loading label="Loading your mistakes…" />;

  const open = state.mistakes.filter((m) => !m.resolved);
  const resolved = state.mistakes.filter((m) => m.resolved);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-6 pb-16 sm:px-6 sm:pt-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Dashboard
      </Link>

      <h1 className="mt-6 font-display text-4xl leading-none sm:text-5xl">Review my mistakes</h1>
      <p className="mt-3 text-muted">
        Every mistake stays here until you answer a different question on the same rule.
      </p>

      {open.length > 0 ? (
        <ButtonLink href="/practice?mode=mistakes" size="lg" className="mt-6">
          <RefreshCw className="size-4" />
          Practice these rules again
        </ButtonLink>
      ) : null}

      {open.length === 0 ? (
        <Card className="mt-8 flex items-start gap-3 p-6">
          <CheckCircle2 className="mt-0.5 size-5 text-success" />
          <div>
            <p className="font-medium">No open mistakes.</p>
            <p className="mt-1 text-sm text-muted">
              {resolved.length > 0
                ? "You already fixed every rule you got wrong. Run a Smart Practice session to keep going."
                : "Answer some questions and anything you miss will show up here with an explanation."}
            </p>
          </div>
        </Card>
      ) : (
        <ul className="mt-8 space-y-3">
          {open.map((mistake, i) => (
            <li key={`${mistake.questionId}-${i}`}>
              <Card className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-semibold tracking-[0.1em] text-muted uppercase">
                    {TOPIC_MAP[mistake.topic].name}
                  </p>
                  <Badge className="border-danger/20 bg-danger/10 text-danger">Needs a retry</Badge>
                </div>
                <p className="mt-3 font-display text-xl leading-snug">{mistake.question}</p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-line bg-surface-2 p-3.5">
                    <p className="text-xs font-medium tracking-[0.06em] text-muted uppercase">
                      You answered
                    </p>
                    <p className="mt-1.5 text-danger line-through">
                      {mistake.userAnswer.trim() || "—"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-line bg-surface-2 p-3.5">
                    <p className="text-xs font-medium tracking-[0.06em] text-muted uppercase">
                      Correct
                    </p>
                    <p className="mt-1.5 font-semibold">{mistake.correctAnswer}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-medium tracking-[0.06em] text-muted uppercase">Why</p>
                  <p className="mt-1.5 text-sm text-muted">{mistake.explanation}</p>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {resolved.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-2xl">Fixed</h2>
          <p className="mt-2 text-sm text-muted">
            You answered a different question on these rules correctly.
          </p>
          <ul className="mt-4 space-y-2">
            {resolved.slice(0, 12).map((mistake, i) => (
              <li
                key={`${mistake.questionId}-fixed-${i}`}
                className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3.5"
              >
                <CheckCircle2 className="size-4 shrink-0 text-success" />
                <span className="min-w-0 flex-1 truncate text-sm">{mistake.question}</span>
                <span className="shrink-0 text-xs text-muted">
                  {TOPIC_MAP[mistake.topic].short}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
