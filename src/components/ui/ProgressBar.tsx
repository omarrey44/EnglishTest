"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

const FILLS = {
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  ink: "bg-ink",
} as const;

/**
 * A ruled meter: hard edges, a printed border, and tick marks every 10% so a
 * score can be read off the bar the way you read a ruler.
 */
export function ProgressBar({
  value,
  className,
  tone = "accent",
  height = "h-2",
  label,
  ticks = false,
}: {
  value: number;
  className?: string;
  tone?: keyof typeof FILLS;
  height?: string;
  label?: string;
  ticks?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-full border border-blue-100 bg-blue-50",
          height,
        )}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <motion.div
          className={cn("h-full rounded-full bg-gradient-to-r from-[#14a9ef] to-[#1740df]", tone !== "accent" && FILLS[tone])}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 140, damping: 22 }}
        />
      </div>
      {ticks ? (
        <div aria-hidden className="mt-1 flex justify-between">
          {Array.from({ length: 11 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "w-px bg-line",
                i % 5 === 0 ? "h-2" : "h-1",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** Chunky 10-segment bar used on the skill cards — one block per point. */
export function SegmentBar({
  value,
  tone = "accent",
  segments = 10,
}: {
  value: number;
  tone?: "accent" | "success" | "warning" | "danger";
  segments?: number;
}) {
  const filled = Math.round((Math.max(0, Math.min(100, value)) / 100) * segments);

  return (
    <div className="flex gap-[3px]" aria-hidden>
      {Array.from({ length: segments }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-2 flex-1 rounded-[2px] border transition-colors",
            i < filled
              ? cn(FILLS[tone], "border-transparent")
              : "border-line bg-transparent",
          )}
        />
      ))}
    </div>
  );
}
