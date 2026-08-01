"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { TopicProgress } from "@/types/progress";
import { SegmentBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { TopicNumber } from "@/components/ui/Card";
import { TopicIcon } from "@/components/ui/TopicIcon";
import { MASTERY_LABEL, MASTERY_TONE } from "@/lib/scoring";
import { TOPIC_MAP, TOPIC_IDS } from "@/data/topics";

const TONE_BY_LEVEL = {
  weak: "danger",
  practice: "warning",
  good: "accent",
  mastered: "success",
  new: "accent",
} as const;

export function SkillCard({ progress }: { progress: TopicProgress }) {
  const topic = TOPIC_MAP[progress.topic];
  const number = String(TOPIC_IDS.indexOf(progress.topic) + 1).padStart(2, "0");

  return (
    <Link
      href={`/learn/${progress.topic}`}
      className="press-soft group relative flex h-full min-h-[240px] flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white p-4 hover:border-accent/30 sm:p-5"
    >
      {/* Topic ink, printed down the spine of the card. */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: `linear-gradient(90deg, ${topic.accent}, color-mix(in srgb, ${topic.accent} 25%, white))` }}
      />

      <div>
        <div className="flex items-start justify-between gap-3">
          <span
            className="grid size-12 shrink-0 place-items-center rounded-2xl border"
            style={{
              color: topic.accent,
              borderColor: `color-mix(in srgb, ${topic.accent} 16%, white)`,
              background: `color-mix(in srgb, ${topic.accent} 10%, white)`,
            }}
          >
            <TopicIcon topic={progress.topic} className="size-5" />
          </span>
          <TopicNumber value={number} tone={topic.accent} />
        </div>

        <div className="mt-3.5 min-w-0">
          <p className="text-[1.02rem] leading-tight font-semibold tracking-[-0.015em]">
            {topic.name}
          </p>
          <p className="mt-1 text-xs text-muted italic">{topic.spanishName}</p>
        </div>
      </div>

      <div className="mt-5">
        <SegmentBar value={progress.accuracy} tone={TONE_BY_LEVEL[progress.level]} />
        <div className="mt-3 flex items-baseline justify-between gap-2">
          <span className="tabular font-display text-2xl leading-none tracking-[-0.02em]">
            {progress.attempted === 0 ? "—" : `${progress.accuracy}%`}
          </span>
          <Badge className={MASTERY_TONE[progress.level]}>
            {MASTERY_LABEL[progress.level]}
          </Badge>
        </div>
        <span className="mt-3 flex min-h-10 items-center justify-center gap-2 rounded-xl bg-surface-2 text-xs font-bold text-ink transition-colors group-hover:bg-blue-50 group-hover:text-accent">
          Continue <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export function SkillsGrid({ items }: { items: TopicProgress[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {items.map((item, i) => (
        <div
          key={item.topic}
          className="rise"
          style={{ "--d": `${i * 45}ms` } as React.CSSProperties}
        >
          <SkillCard progress={item} />
        </div>
      ))}
    </div>
  );
}
