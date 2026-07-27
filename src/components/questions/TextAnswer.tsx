"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

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
        "w-full rounded-xl border bg-surface px-4 py-4 text-lg outline-none transition-colors",
        "placeholder:text-muted/60 disabled:opacity-100",
        status === "correct" && "border-success bg-success/8",
        status === "wrong" && "border-danger bg-danger/8",
        (!status || status === "idle") && "border-line focus:border-accent",
      )}
    />
  );
}
