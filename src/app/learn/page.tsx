"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useProgress } from "@/components/progress/ProgressProvider";
import { getTopicProgress } from "@/lib/adaptiveLearning";
import { Badge } from "@/components/ui/Badge";
import { Eyebrow, TopicNumber } from "@/components/ui/Card";
import { SegmentBar } from "@/components/ui/ProgressBar";
import { MASTERY_LABEL, MASTERY_TONE } from "@/lib/scoring";
import { TOPIC_MAP } from "@/data/topics";
import { LESSONS } from "@/data/lessons";
import { AppHeader } from "@/components/dashboard/AppHeader";
import { BackLink } from "@/components/ui/Button";
import { useDisplayName } from "@/components/auth/useDisplayName";

export default function LearnIndexPage() {
  const { state } = useProgress();
  const { name } = useDisplayName();
  const topics = getTopicProgress(state);

  return (
    <>
    <AppHeader />
    <div className="mx-auto w-full max-w-5xl px-5 pt-8 pb-16 sm:px-8 sm:pt-12">
      <BackLink href="/">Dashboard</BackLink>

      <header className="mt-8 rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
        <Eyebrow>Every rule the exam asks about, in {topics.length} chapters</Eyebrow>
        <h1 className="mt-3 font-display text-[2.75rem] leading-[0.9] tracking-[-0.03em] sm:text-[3.5rem]">
          {name ? (
            <>
              Your lessons,
              <br />
              <span className="italic text-accent">{name}</span>
            </>
          ) : (
            "Lessons"
          )}
        </h1>
        <p className="mt-4 max-w-xl leading-relaxed text-muted">
          Every rule the exam covers, with examples and a practice set at the end of each page.
        </p>
      </header>

      <ul className="mt-6 grid gap-3 md:grid-cols-2">
        {topics.map((progress, i) => {
          const meta = TOPIC_MAP[progress.topic];
          return (
            <li
              key={progress.topic}
              className="rise"
              style={{ "--d": `${i * 40}ms` } as React.CSSProperties}
            >
              <Link
                href={`/learn/${progress.topic}`}
                className="press-soft group flex h-full items-start gap-4 rounded-2xl border border-line bg-white p-5 transition-colors hover:border-accent/30"
              >
                <TopicNumber
                  value={String(i + 1).padStart(2, "0")}
                  tone={meta.accent}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <p className="font-semibold tracking-[-0.01em]">{meta.name}</p>
                    <span className="text-sm text-muted italic">{meta.spanishName}</span>
                    <Badge className={MASTERY_TONE[progress.level]}>
                      {MASTERY_LABEL[progress.level]}
                    </Badge>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                    {LESSONS[progress.topic].intro}
                  </p>
                  <div className="mt-3.5 max-w-xs">
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
                </div>

                <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
    </>
  );
}
