"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Not a boxed form field: a ruled writing line, the way the answer would be
 * written on the real exam paper.
 */
export function TextAnswer({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder,
  status,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
  status?: "idle" | "correct" | "wrong";
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && window.matchMedia("(min-width: 768px)").matches) {
      ref.current?.focus();
    }
  }, [disabled]);

  return (
    <div className="relative">
      <input
        ref={ref}
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        enterKeyHint="done"
        disabled={disabled}
        value={value}
        placeholder={placeholder ?? "Type your answer"}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !disabled) {
            e.preventDefault();
            onSubmit();
          }
        }}
        className={cn(
          "w-full border-b-[3px] bg-transparent px-1 pt-2 pb-3 font-display text-[1.6rem] leading-snug tracking-[-0.015em] outline-none transition-colors sm:text-[1.85rem]",
          "placeholder:font-sans placeholder:text-base placeholder:tracking-normal placeholder:text-muted/55 disabled:opacity-100",
          status === "correct" && "border-success text-success",
          status === "wrong" && "border-danger text-danger",
          (!status || status === "idle") && "border-ink/25 focus:border-accent",
        )}
      />
      {/* Margin tick, so the writing line reads as part of the ruled page. */}
      <span
        aria-hidden
        className={cn(
          "absolute -bottom-[3px] left-0 h-2.5 w-[3px]",
          status === "correct" && "bg-success",
          status === "wrong" && "bg-danger",
          (!status || status === "idle") && "bg-ink/25",
        )}
      />
    </div>
  );
}
