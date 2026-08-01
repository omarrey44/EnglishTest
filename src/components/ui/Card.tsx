import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}) {
  return (
    <Tag className={cn("plate rounded-2xl border border-line bg-surface", className)}>
      {children}
    </Tag>
  );
}

/**
 * A mono index label with a leading tick mark — the small print of the
 * workbook. Used above every block instead of a plain uppercase caption.
 */
export function Eyebrow({
  children,
  className,
  tone,
}: {
  children: ReactNode;
  className?: string;
  /** Overrides the colour of the tick and the text (topic accents). */
  tone?: string;
}) {
  return (
    <p
      className={cn(
        "index inline-flex min-h-7 w-fit max-w-full items-center gap-2 rounded-full border border-current/15 bg-white/75 px-2.5 py-1 text-ink-soft shadow-[0_4px_14px_rgba(29,43,81,.06)] backdrop-blur-sm",
        className,
      )}
      style={tone ? { color: tone } : undefined}
    >
      <span
        aria-hidden
        className="grid size-4 shrink-0 place-items-center rounded-full bg-current/10"
      >
        <span className="size-1.5 rounded-full bg-current" />
      </span>
      <span className="min-w-0">{children}</span>
    </p>
  );
}

/** A compact chapter tab for topic cards. Decorative because the title names the topic. */
export function TopicNumber({
  value,
  tone,
  className,
}: {
  value: string;
  tone: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex min-h-12 min-w-[3.25rem] shrink-0 flex-col items-center justify-center rounded-xl border px-2 py-1.5 shadow-[0_6px_16px_rgba(29,43,81,.07)]",
        className,
      )}
      style={{
        color: tone,
        borderColor: `color-mix(in srgb, ${tone} 22%, white)`,
        background: `linear-gradient(145deg, color-mix(in srgb, ${tone} 13%, white), color-mix(in srgb, ${tone} 4%, white))`,
      }}
    >
      <span className="font-mono text-[0.5rem] font-bold leading-none tracking-[0.13em] uppercase opacity-70">
        Topic
      </span>
      <span className="tabular mt-0.5 font-display text-[1.45rem] leading-none tracking-[-0.04em]">
        {value}
      </span>
    </span>
  );
}

export function SectionTitle({
  title,
  hint,
  action,
  index,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
  /** Optional mono index printed above the title, e.g. "SECTION 02". */
  index?: string;
}) {
  return (
    <div className="mb-5">
      {index ? <Eyebrow className="mb-2.5">{index}</Eyebrow> : null}
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-display text-[1.9rem] leading-none tracking-[-0.025em] sm:text-[2.35rem]">
          {title}
        </h2>
        <span aria-hidden className="leader" />
        {action}
      </div>
      {hint ? <p className="mt-2.5 max-w-xl text-sm text-muted">{hint}</p> : null}
    </div>
  );
}
