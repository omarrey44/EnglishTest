"use client";

import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import type { SessionSummary } from "@/components/questions/SessionRunner";
import { StatTile, Badge } from "@/components/ui/Badge";
import { Eyebrow, SectionTitle } from "@/components/ui/Card";
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
  const passing = summary.accuracy >= 85;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pt-8 pb-16 sm:px-8 sm:pt-12">
      <div className="flex items-center gap-4 border-b-2 border-ink pb-3">
        <Eyebrow>{title}</Eyebrow>
        <span aria-hidden className="leader" />
      </div>

      {/* ---- The grade ---------------------------------------------------- */}
      <section className="rise relative mt-8 rounded-xl border-2 border-ink bg-surface p-6 sm:p-9">
        <div
          className={`stamped absolute -top-4 right-5 -rotate-[5deg] rounded-[5px] border-[2.5px] bg-paper px-3 py-1.5 sm:right-8 ${
            passing ? "border-success text-success" : "border-warning text-warning"
          }`}
          style={{ "--d": "260ms" } as React.CSSProperties}
        >
          <span className="index text-[0.8rem]">{passing ? "Exam ready" : "Keep going"}</span>
        </div>

        <Eyebrow>
          {summary.correct} of {summary.total} right, on the exam&apos;s 10-point scale
        </Eyebrow>
        <p className="tabular mt-4 font-display text-[6rem] leading-[0.76] tracking-[-0.05em] sm:text-[8rem]">
          {summary.score.toFixed(1)}
          <span className="text-[0.3em] tracking-[-0.02em] text-muted">/10</span>
        </p>

        <div className="mt-7 max-w-lg">
          <h1 className="font-display text-3xl tracking-[-0.02em]">{verdict.title}</h1>
          <p className="mt-2.5 leading-relaxed text-muted">{verdict.message}</p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          <StatTile label="Correct" value={summary.correct} />
          <StatTile label="Incorrect" value={summary.total - summary.correct} />
          <StatTile label="Accuracy" value={`${summary.accuracy}%`} />
          <StatTile label="Answered" value={summary.total} />
        </div>
      </section>

      {/* ---- Topic breakdown ---------------------------------------------- */}
      <section className="mt-14">
        <SectionTitle index="Weakest first" title="Topics to review" />
        <ul>
          {topics.map((t, i) => (
            <li
              key={t.topic}
              className="rise flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-line py-4 first:border-t"
              style={{ "--d": `${i * 40}ms` } as React.CSSProperties}
            >
              <span className="index tabular w-6 shrink-0 text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1 truncate font-medium">
                {TOPIC_MAP[t.topic].name}
              </span>
              <span className="tabular font-display text-xl leading-none tracking-[-0.02em]">
                {t.accuracy}%
              </span>
              <Badge className={MASTERY_TONE[t.level]}>{MASTERY_LABEL[t.level]}</Badge>
              <div className="w-full">
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
            </li>
          ))}
        </ul>
      </section>

      {/* ---- Errata --------------------------------------------------------- */}
      {wrongAnswers.length > 0 ? (
        <section className="mt-14">
          <SectionTitle
            index={`${wrongAnswers.length} to fix before the exam`}
            title="What went wrong"
            hint="Read the rule, then practice the same rule on a different question."
          />
          <ul className="space-y-2.5">
            {wrongAnswers.map((a, i) => (
              <li
                key={`${a.question.id}-${i}`}
                className="plate rounded-xl border-2 border-line bg-surface p-5"
              >
                <div className="flex items-center gap-3">
                  <Eyebrow tone={TOPIC_MAP[a.question.topic].accent}>
                    {TOPIC_MAP[a.question.topic].name}
                  </Eyebrow>
                  <span aria-hidden className="leader" />
                  <span className="index tabular text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <p className="mt-3 font-display text-xl leading-snug tracking-[-0.015em]">
                  {a.question.question}
                </p>

                <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  <div className="rounded-lg border border-danger/25 bg-danger/8 p-3.5">
                    <p className="index text-danger/80">You answered</p>
                    <p className="mt-1.5 text-danger line-through decoration-danger/50">
                      {a.userAnswer.trim() || "—"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-success/25 bg-success/8 p-3.5">
                    <p className="index text-success/80">Correct</p>
                    <p className="mt-1.5 font-semibold">{a.question.correctAnswer}</p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {a.question.explanation}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-14 flex flex-col gap-2.5 sm:flex-row">
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
          <ArrowLeft className="size-4" />
          Dashboard
        </ButtonLink>
      </div>
    </div>
  );
}
