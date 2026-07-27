import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "index inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1",
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * A ledger cell. The value is the loud part; the label is set in the small
 * mono index type used everywhere else in the workbook.
 */
export function StatTile({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-white/72 p-3.5 sm:p-4">
      <div className="index flex items-center gap-1.5 text-muted">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <p className="tabular mt-2.5 font-display text-[1.5rem] leading-none tracking-[-0.025em]">
        {value}
      </p>
      {hint ? <p className="mt-1.5 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
