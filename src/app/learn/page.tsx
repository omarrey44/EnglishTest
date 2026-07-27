"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useProgress } from "@/components/progress/ProgressProvider";
import { getTopicProgress } from "@/lib/adaptiveLearning";
import { Badge } from "@/components/ui/Badge";
import { SegmentBar } from "@/components/ui/ProgressBar";
import { MASTERY_LABEL, MASTERY_TONE } from "@/lib/scoring";
import { TOPIC_MAP } from "@/data/topics";
import { LESSONS } from "@/data/lessons";

export default function LearnIndexPage() {
  const { state } = useProgress();
  const topics = getTopicProgress(state);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-6 pb-16 sm:px-6 sm:pt-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Dashboard
      </Link>

      <h1 className="mt-6 font-display text-4xl leading-none sm:text-5xl">Lessons</h1>
      <p className="mt-3 max-w-xl text-muted">
        Every rule the exam covers, with examples and a practice set at the end of each page.
      </p>

      <ul className="mt-8 space-y-3">
        {topics.map((progress) => {
          const meta = TOPIC_MAP[progress.topic];
          return (
            <li key={progress.topic}>
              <Link
                href={`/learn/${progress.topic}`}
                className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-ink/25"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{meta.name}</p>
                    <Badge className={MASTERY_TONE[progress.level]}>
                      {MASTERY_LABEL[progress.level]}
                    </Badge>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted">
                    {LESSONS[progress.topic].intro}
                  </p>
                  <div className="mt-3 max-w-xs">
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
                <ChevronRight className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
