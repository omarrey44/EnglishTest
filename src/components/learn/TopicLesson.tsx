"use client";

import { ArrowRight } from "lucide-react";
import type { TopicId } from "@/types/question";
import { LESSONS } from "@/data/lessons";
import { TOPIC_MAP, TOPIC_IDS } from "@/data/topics";
import { Badge } from "@/components/ui/Badge";
import { Eyebrow } from "@/components/ui/Card";
import { BackLink, ButtonLink } from "@/components/ui/Button";
import { SegmentBar } from "@/components/ui/ProgressBar";
import { useProgress } from "@/components/progress/ProgressProvider";
import { getTopicProgress } from "@/lib/adaptiveLearning";
import { MASTERY_LABEL, MASTERY_TONE } from "@/lib/scoring";
import { EdSoundTrainer } from "./EdSoundTrainer";
import { questionsByTopic } from "@/data/questions";
import { AppHeader } from "@/components/dashboard/AppHeader";

export function TopicLesson({ topic }: { topic: TopicId }) {
  const { state, ready } = useProgress();
  const meta = TOPIC_MAP[topic];
  const lesson = LESSONS[topic];
  const progress = getTopicProgress(state).find((p) => p.topic === topic)!;
  const available = questionsByTopic(topic).length;
  const chapter = String(TOPIC_IDS.indexOf(topic) + 1).padStart(2, "0");

  const tone =
    progress.level === "mastered"
      ? "success"
      : progress.level === "good"
        ? "accent"
        : progress.level === "practice"
          ? "warning"
          : "danger";

  return (
    <>
    <AppHeader />
    <div className="mx-auto w-full max-w-4xl px-5 pt-8 pb-16 sm:px-8 sm:pt-12">
      <BackLink href="/learn">All lessons</BackLink>

      {/* ---- Chapter head -------------------------------------------------- */}
      <header className="mt-8 rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
        <div className="flex items-center gap-4">
          <Eyebrow tone={meta.accent}>
            Chapter {chapter} of {TOPIC_IDS.length}
          </Eyebrow>
          <span aria-hidden className="leader" />
          <span className="index text-muted italic">{meta.spanishName}</span>
        </div>

        <h1
          className="mt-4 border-b pb-5 font-display text-[2.75rem] leading-[0.9] tracking-[-0.03em] sm:text-[3.5rem]"
          style={{ borderColor: meta.accent }}
        >
          {meta.name}
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">{lesson.intro}</p>
      </header>

      {/* ---- Your score ---------------------------------------------------- */}
      <section className="mt-6 rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>
              {progress.attempted === 0
                ? "Not practiced yet"
                : progress.level === "mastered"
                  ? "Mastered — stay above 95%"
                  : progress.accuracy >= 95
                    ? // Accurate already, but mastery also needs a real sample.
                      `Answer ${4 - progress.attempted} more to lock in mastery`
                    : `${95 - progress.accuracy} points from mastered`}
            </Eyebrow>
            <p className="tabular mt-2.5 font-display text-[3rem] leading-none tracking-[-0.04em]">
              {ready && progress.attempted > 0 ? `${progress.accuracy}%` : "—"}
            </p>
            <p className="index mt-2 text-muted">
              {progress.correct} of {progress.attempted} correct
            </p>
          </div>
          <Badge className={MASTERY_TONE[progress.level]}>
            {MASTERY_LABEL[progress.level]}
          </Badge>
        </div>

        <div className="mt-5">
          <SegmentBar value={progress.accuracy} tone={tone} />
        </div>

        <ButtonLink
          href={`/practice?mode=topic&topic=${topic}`}
          size="lg"
          fullWidth
          className="mt-6"
        >
          Practice {meta.short} · {Math.min(10, available)} questions
          <ArrowRight className="size-4" />
        </ButtonLink>
      </section>

      {topic === "edPronunciation" ? (
        <section className="mt-14">
          <div className="flex items-baseline gap-3 border-b-2 border-ink pb-2.5">
            <h2 className="font-display text-2xl tracking-[-0.015em]">ED Sound Trainer</h2>
            <span aria-hidden className="leader" />
          </div>
          <p className="mt-3 text-muted">The three sounds, and how to choose between them.</p>
          <div className="mt-6">
            <EdSoundTrainer />
          </div>
        </section>
      ) : null}

      {/* ---- Lesson body ---------------------------------------------------- */}
      <div className="mt-14 space-y-12">
        {lesson.sections.map((section, i) => (
          <section key={section.title}>
            <div className="flex items-baseline gap-3 border-b-2 border-ink pb-2.5">
              <span className="index tabular text-muted">
                {chapter}.{i + 1}
              </span>
              <h2 className="font-display text-2xl tracking-[-0.015em]">{section.title}</h2>
              <span aria-hidden className="leader" />
            </div>

            {section.body ? (
              <p className="mt-4 leading-relaxed text-ink-soft">{section.body}</p>
            ) : null}

            {section.bullets ? (
              <ul className="mt-5 space-y-2">
                {section.bullets.map((bullet) => (
                  <li
                    key={bullet}
                  className="flex gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-[0.98rem] leading-relaxed shadow-[0_6px_20px_rgba(29,43,81,.04)]"
                  >
                    <span
                      aria-hidden
                      className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: meta.accent }}
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {section.examples ? (
              <ul className="mt-5 overflow-hidden rounded-xl border border-line bg-surface">
                {section.examples.map((example) => (
                  <li
                    key={example.left + example.right}
                    className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-line px-4 py-3.5 last:border-b-0"
                  >
                    <span className="min-w-[7.5rem] font-semibold tracking-[-0.01em]">
                      {example.left}
                    </span>
                    <span aria-hidden className="leader" />
                    <span className="text-ink-soft">{example.right}</span>
                    {example.note ? (
                      <span className="index w-full text-muted">{example.note}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      <ButtonLink
        href={`/practice?mode=topic&topic=${topic}`}
        size="lg"
        fullWidth
        variant="accent"
        className="mt-14"
      >
        Practice this topic now
        <ArrowRight className="size-4" />
      </ButtonLink>
    </div>
    </>
  );
}
