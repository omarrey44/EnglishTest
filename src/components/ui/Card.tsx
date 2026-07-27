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
      className={cn("index flex items-center gap-2 text-muted", className)}
      style={tone ? { color: tone } : undefined}
    >
      <span
        aria-hidden
        className="inline-block size-1.5 shrink-0 rounded-full bg-current opacity-80"
      />
      {children}
    </p>
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
