"use client";

import { Check } from "lucide-react";
import type { TopicId } from "@/types/question";
import { Eyebrow } from "@/components/ui/Card";
import { TOPICS, TOPIC_IDS } from "@/data/topics";
import { cn } from "@/lib/cn";

/**
 * Chips for choosing which topics a session covers. When `max` is set the
 * remaining chips are disabled once the limit is reached, rather than silently
 * dropping an earlier choice.
 */
export function TopicPicker({
  selected,
  onChange,
  max,
  title = "Topics in this session",
  hint,
}: {
  selected: TopicId[];
  onChange: (topics: TopicId[]) => void;
  max?: number;
  title?: string;
  hint?: string;
}) {
  const limit = max ?? TOPIC_IDS.length;
  const atLimit = selected.length >= limit;
  const allSelected = selected.length === limit;

  const toggle = (topic: TopicId) => {
    if (selected.includes(topic)) {
      onChange(selected.filter((t) => t !== topic));
      return;
    }
    if (atLimit) return;
    // Keep the canonical course order rather than the order they were tapped.
    onChange(TOPIC_IDS.filter((t) => t === topic || selected.includes(t)));
  };

  return (
    <section>
      <div className="flex flex-wrap items-center gap-3">
        <Eyebrow>{title}</Eyebrow>
        <span aria-hidden className="leader" />
        <div className="flex shrink-0 items-center gap-3">
          <span className="index tabular text-muted">
            {selected.length} of {limit}
          </span>
          <button
            type="button"
            onClick={() => onChange(allSelected ? [] : TOPIC_IDS.slice(0, limit))}
            className="index text-accent underline underline-offset-4 hover:text-ink"
          >
            {allSelected ? "Clear all" : `Select ${limit}`}
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {TOPICS.map((topic) => {
          const on = selected.includes(topic.id);
          const blocked = !on && atLimit;
          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => toggle(topic.id)}
              aria-pressed={on}
              disabled={blocked}
              title={blocked ? `Deselect one first — the limit is ${limit}` : undefined}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
                on && "border-transparent text-white",
                !on && !blocked && "border-line bg-surface text-muted hover:border-accent/40 hover:text-ink",
                blocked && "cursor-not-allowed border-line bg-surface text-muted/45",
              )}
              style={on ? { background: topic.accent } : undefined}
            >
              {on ? (
                <Check className="size-3.5" />
              ) : (
                <span
                  aria-hidden
                  className="size-2 rounded-full"
                  style={{ background: topic.accent, opacity: blocked ? 0.35 : 1 }}
                />
              )}
              {topic.short}
            </button>
          );
        })}
      </div>

      {hint ? <p className="mt-3 text-sm text-muted">{hint}</p> : null}
    </section>
  );
}
