"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { TopicId } from "@/types/question";
import { LESSONS } from "@/data/lessons";
import { TOPIC_MAP } from "@/data/topics";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { SegmentBar } from "@/components/ui/ProgressBar";
import { useProgress } from "@/components/progress/ProgressProvider";
import { getTopicProgress } from "@/lib/adaptiveLearning";
import { MASTERY_LABEL, MASTERY_TONE } from "@/lib/scoring";
import { EdSoundTrainer } from "./EdSoundTrainer";
import { questionsByTopic } from "@/data/questions";

export function TopicLesson({ topic }: { topic: TopicId }) {
  const { state, ready } = useProgress();
  const meta = TOPIC_MAP[topic];
  const lesson = LESSONS[topic];
  const progress = getTopicProgress(state).find((p) => p.topic === topic)!;
  const available = questionsByTopic(topic).length;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-6 pb-16 sm:px-6 sm:pt-10">
      <Link
        href="/learn"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        All lessons
      </Link>

      <header className="mt-6">
        <p
          className="text-xs font-semibold tracking-[0.14em] uppercase"
          style={{ color: meta.accent }}
        >
          {meta.spanishName}
        </p>
        <h1 className="mt-3 font-display text-4xl leading-none sm:text-5xl">{meta.name}</h1>
        <p className="mt-4 max-w-xl text-lg text-muted">{lesson.intro}</p>
      </header>

      <Card className="mt-7 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.1em] text-muted uppercase">
              Your score
            </p>
            <p className="tabular mt-1.5 text-2xl font-semibold">
              {ready && progress.attempted > 0 ? `${progress.accuracy}%` : "—"}
              <span className="ml-2 text-sm font-normal text-muted">
                {progress.correct}/{progress.attempted} correct
              </span>
            </p>
          </div>
          <Badge className={MASTERY_TONE[progress.level]}>{MASTERY_LABEL[progress.level]}</Badge>
        </div>
        <div className="mt-4">
          <SegmentBar
            value={progress.accuracy}
            tone={
              progress.level === "mastered"
                ? "success"
                : progress.level === "good"
                  ? "accent"
                  : progress.level === "practice"
                    ? "warning"
                    : "danger"
            }
          />
        </div>
        <ButtonLink
          href={`/practice?mode=topic&topic=${topic}`}
          size="lg"
          fullWidth
          className="mt-5"
        >
          Practice {meta.short} · {Math.min(10, available)} questions
          <ArrowRight className="size-4" />
        </ButtonLink>
      </Card>

      {topic === "edPronunciation" ? (
        <section className="mt-10">
          <h2 className="font-display text-2xl">ED Sound Trainer</h2>
          <p className="mt-2 text-muted">The three sounds, and how to choose between them.</p>
          <div className="mt-5">
            <EdSoundTrainer />
          </div>
        </section>
      ) : null}

      <div className="mt-10 space-y-8">
        {lesson.sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-display text-2xl">{section.title}</h2>
            {section.body ? <p className="mt-2 text-muted">{section.body}</p> : null}

            {section.bullets ? (
              <ul className="mt-4 space-y-2">
                {section.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="rounded-xl border border-line bg-surface px-4 py-3 text-[0.98rem]"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : null}

            {section.examples ? (
              <ul className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
                {section.examples.map((example) => (
                  <li
                    key={example.left + example.right}
                    className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-4 py-3.5"
                  >
                    <span className="min-w-[8rem] font-medium">{example.left}</span>
                    <span className="text-muted">{example.right}</span>
                    {example.note ? (
                      <span className="text-xs text-muted/80 italic">{example.note}</span>
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
        className="mt-12"
      >
        Practice this topic now
        <ArrowRight className="size-4" />
      </ButtonLink>
    </div>
  );
}
