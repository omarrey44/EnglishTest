"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { TopicProgress } from "@/types/progress";
import { SegmentBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { MASTERY_LABEL, MASTERY_TONE } from "@/lib/scoring";
import { TOPIC_MAP } from "@/data/topics";

const TONE_BY_LEVEL = {
  weak: "danger",
  practice: "warning",
  good: "accent",
  mastered: "success",
  new: "accent",
} as const;

export function SkillCard({ progress }: { progress: TopicProgress }) {
  const topic = TOPIC_MAP[progress.topic];

  return (
    <Link
      href={`/learn/${progress.topic}`}
      className="group flex flex-col justify-between rounded-2xl border border-line bg-surface p-4 shadow-card transition-colors hover:border-ink/25 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="leading-tight font-medium">{topic.name}</p>
          <p className="mt-1 text-xs text-muted">{topic.spanishName}</p>
        </div>
        <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
      </div>

      <div className="mt-5">
        <SegmentBar value={progress.accuracy} tone={TONE_BY_LEVEL[progress.level]} />
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="tabular text-lg font-semibold">
            {progress.attempted === 0 ? "—" : `${progress.accuracy}%`}
          </span>
          <Badge className={MASTERY_TONE[progress.level]}>
            {MASTERY_LABEL[progress.level]}
          </Badge>
        </div>
      </div>
    </Link>
  );
}

export function SkillsGrid({ items }: { items: TopicProgress[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <SkillCard key={item.topic} progress={item} />
      ))}
    </div>
  );
}
