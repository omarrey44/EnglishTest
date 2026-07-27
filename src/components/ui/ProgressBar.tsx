"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export function ProgressBar({
  value,
  className,
  tone = "accent",
  height = "h-2",
  label,
}: {
  value: number;
  className?: string;
  tone?: "accent" | "success" | "warning" | "danger" | "ink";
  height?: string;
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const fill = {
    accent: "bg-accent",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
    ink: "bg-ink",
  }[tone];

  return (
    <div
      className={cn("w-full overflow-hidden rounded-full bg-ink/8", height, className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <motion.div
        className={cn("h-full rounded-full", fill)}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 140, damping: 22 }}
      />
    </div>
  );
}

/** Chunky 10-segment bar used on the skill cards. */
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
  const fill = {
    accent: "bg-accent",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
  }[tone];

  return (
    <div className="flex gap-1" aria-hidden>
      {Array.from({ length: segments }).map((_, i) => (
        <span
          key={i}
          className={cn("h-1.5 flex-1 rounded-full", i < filled ? fill : "bg-ink/10")}
        />
      ))}
    </div>
  );
}
