"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "accent" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-ink text-paper hover:bg-ink/90 active:bg-ink/80 disabled:bg-ink/30 shadow-sm",
  accent:
    "bg-accent text-accent-ink hover:opacity-90 active:opacity-80 disabled:opacity-40 shadow-sm",
  secondary:
    "bg-surface text-ink border border-line hover:border-ink/30 hover:bg-surface-2 active:bg-line/40",
  ghost: "bg-transparent text-muted hover:text-ink hover:bg-ink/5",
  danger: "bg-danger text-white hover:opacity-90 active:opacity-80",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm rounded-lg",
  md: "h-11 px-5 text-[0.95rem] rounded-xl",
  lg: "h-14 px-6 text-base rounded-2xl",
};

const BASE =
  "inline-flex items-center justify-center gap-2 font-medium tracking-[-0.01em] transition-[background,color,border,opacity,transform] duration-150 select-none disabled:cursor-not-allowed active:scale-[0.99]";

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
