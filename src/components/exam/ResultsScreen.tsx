"use client";

import { motion } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";
import type { SessionSummary } from "@/components/questions/SessionRunner";
import { Card } from "@/components/ui/Card";
import { StatTile, Badge } from "@/components/ui/Badge";
import { ButtonLink, Button } from "@/components/ui/Button";
import { SegmentBar } from "@/components/ui/ProgressBar";
import { MASTERY_LABEL, MASTERY_TONE, accuracyOf, examVerdict, masteryLevel } from "@/lib/scoring";
import { TOPIC_MAP } from "@/data/topics";
import type { TopicId } from "@/types/question";

export function ResultsScreen({
  summary,
  title,
  onRetry,
  retryLabel = "Try again",
}: {
  summary: SessionSummary;
  title: string;
  onRetry?: () => void;
  retryLabel?: string;
}) {
  const verdict = examVerdict(summary.accuracy);
  const topics = (Object.keys(summary.byTopic) as TopicId[])
    .map((topic) => {
      const stat = summary.byTopic[topic]!;
      const accuracy = accuracyOf(stat.correct, stat.attempted);
      return { topic, ...stat, accuracy, level: masteryLevel(accuracy, stat.attempted) };
    })
    .sort((a, b) => a.accuracy - b.accuracy);

  const wrongAnswers = summary.answers.filter((a) => !a.correct);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-8 pb-16 sm:px-6 sm:pt-12">
      <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">{title}</p>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="mt-4 p-6 sm:p-8">
          <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
            Final score
          </p>
          <p className="tabular mt-3 font-display text-7xl leading-none sm:text-8xl">
            {summary.score.toFixed(1)}
            <span className="text-3xl text-muted"> / 10</span>
          </p>
          <p className="tabular mt-3 text-lg text-muted">{summary.accuracy}%</p>
          <p className="mt-6 font-display text-3xl">{verdict.title}</p>
          <p className="mt-2 max-w-lg text-muted">{verdict.message}</p>

          <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile label="Correct" value={summary.correct} />
            <StatTile label="Incorrect" value={summary.total - summary.correct} />
            <StatTile label="Accuracy" value={`${summary.accuracy}%`} />
            <StatTile label="Score" value={`${summary.score.toFixed(1)} / 10`} />
          </div>
        </Card>
      </motion.div>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Topics to review</h2>
        <ul className="mt-4 space-y-2.5">
          {topics.map((t) => (
            <li
              key={t.topic}
              className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate font-medium">{TOPIC_MAP[t.topic].name}</p>
                  <span className="tabular text-sm font-semibold">{t.accuracy}%</span>
                </div>
                <div className="mt-2.5">
                  <SegmentBar
                    value={t.accuracy}
                    tone={
                      t.level === "mastered"
                        ? "success"
                        : t.level === "good"
                          ? "accent"
                          : t.level === "practice"
                            ? "warning"
                            : "danger"
                    }
                  />
                </div>
              </div>
              <Badge className={MASTERY_TONE[t.level]}>{MASTERY_LABEL[t.level]}</Badge>
            </li>
          ))}
        </ul>
      </section>

      {wrongAnswers.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-display text-2xl">What went wrong</h2>
          <ul className="mt-4 space-y-3">
            {wrongAnswers.map((a, i) => (
              <li key={`${a.question.id}-${i}`} className="rounded-xl border border-line bg-surface p-4">
                <p className="text-xs font-semibold tracking-[0.1em] text-muted uppercase">
                  {TOPIC_MAP[a.question.topic].name}
                </p>
                <p className="mt-2 font-medium">{a.question.question}</p>
                <p className="mt-3 text-sm text-muted">
                  You answered:{" "}
                  <span className="text-danger line-through">{a.userAnswer.trim() || "—"}</span>
                </p>
                <p className="mt-1 text-sm text-muted">
                  Correct: <span className="font-semibold text-ink">{a.question.correctAnswer}</span>
                </p>
                <p className="mt-3 text-sm text-muted">{a.question.explanation}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/practice?mode=plan" size="lg" variant="accent" className="flex-1">
          Get Me to 10/10
          <ArrowRight className="size-4" />
        </ButtonLink>
        {onRetry ? (
          <Button size="lg" variant="secondary" onClick={onRetry} className="flex-1">
            <RotateCcw className="size-4" />
            {retryLabel}
          </Button>
        ) : null}
        <ButtonLink href="/" size="lg" variant="secondary" className="flex-1">
          Back to dashboard
        </ButtonLink>
      </div>
    </div>
  );
}
