"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "accent" | "danger";
type Size = "sm" | "md" | "lg";

/** Everything except `ghost` sits on a hard offset shadow and can be pressed. */
const VARIANTS: Record<Variant, string> = {
  primary:
    "press border border-[#0751d5] bg-gradient-to-br from-[#075ee8] to-[#1530a0] text-white disabled:border-accent/20 disabled:bg-accent/30 disabled:text-white/70",
  accent:
    "press border border-accent bg-accent text-accent-ink disabled:border-accent/25 disabled:bg-accent/25",
  secondary:
    "press-soft border border-line bg-surface text-ink hover:border-accent/30 disabled:opacity-45",
  ghost:
    "border border-transparent bg-transparent text-muted transition-colors hover:bg-surface-2 hover:text-ink",
  danger: "press border border-danger bg-danger text-white",
};

const SIZES: Record<Size, string> = {
  sm: "min-h-10 px-4 text-sm rounded-xl",
  md: "min-h-11 px-5 text-[0.95rem] rounded-xl",
  lg: "min-h-14 px-6 text-base rounded-2xl",
};

const BASE =
  "inline-flex items-center justify-center gap-2 font-semibold tracking-[-0.01em] select-none disabled:cursor-not-allowed";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  ...props
}: CommonProps & ComponentProps<"button">) {
  return (
    <button
      className={cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && "w-full", className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && "w-full", className)}
      {...props}
    >
      {children}
    </Link>
  );
}

/**
 * Text link styled as a workbook cross-reference: mono, underlined on the
 * baseline, with an arrow that steps forward on hover.
 */
export function TextLink({
  className,
  children,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "group index inline-flex items-center gap-1.5 text-accent underline decoration-accent/35 decoration-1 underline-offset-4 transition-colors hover:decoration-accent",
        className,
      )}
      {...props}
    >
      {children}
      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}
