"use client";

import { cn } from "@/lib/cn";

const LETTERS = ["A", "B", "C", "D", "E"];

export function MultipleChoice({
  options,
  value,
  onSelect,
  disabled,
  correctAnswer,
  revealed,
}: {
  options: string[];
  value: string;
  onSelect: (option: string) => void;
  disabled?: boolean;
  correctAnswer?: string;
  revealed?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((option, i) => {
        const selected = value === option;
        const isCorrect = revealed && correctAnswer === option;
        const isWrongPick = revealed && selected && correctAnswer !== option;

        return (
          <button
            key={option}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(option)}
            aria-pressed={selected}
            className={cn(
              "flex min-h-14 w-full items-center gap-3.5 rounded-xl border px-4 py-3 text-left transition-colors",
              "disabled:cursor-default",
              selected && !revealed && "border-accent bg-accent/8",
              !selected && !revealed && "border-line bg-surface hover:border-ink/25 hover:bg-surface-2",
              isCorrect && "border-success bg-success/10",
              isWrongPick && "border-danger bg-danger/10",
              revealed && !isCorrect && !isWrongPick && "border-line bg-surface opacity-60",
            )}
          >
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-md border text-xs font-semibold",
                selected && !revealed && "border-accent bg-accent text-accent-ink",
                isCorrect && "border-success bg-success text-white",
                isWrongPick && "border-danger bg-danger text-white",
                !selected && !isCorrect && "border-line text-muted",
              )}
            >
              {LETTERS[i] ?? i + 1}
            </span>
            <span className="text-[1.02rem] leading-snug">{option}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Three big phonetic tiles for the -ed sound questions. */
export function SoundChoice({
  options,
  value,
  onSelect,
  disabled,
  correctAnswer,
  revealed,
}: {
  options: string[];
  value: string;
  onSelect: (option: string) => void;
  disabled?: boolean;
  correctAnswer?: string;
  revealed?: boolean;
}) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {options.map((option) => {
        const selected = value === option;
        const isCorrect = revealed && correctAnswer === option;
        const isWrongPick = revealed && selected && correctAnswer !== option;
        return (
          <button
            key={option}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(option)}
            aria-pressed={selected}
            className={cn(
              "phonetic flex min-h-20 flex-col items-center justify-center rounded-xl border text-xl transition-colors sm:text-2xl",
              selected && !revealed && "border-accent bg-accent/8 text-ink",
              !selected && !revealed && "border-line bg-surface hover:border-ink/25 hover:bg-surface-2",
              isCorrect && "border-success bg-success/10 text-success",
              isWrongPick && "border-danger bg-danger/10 text-danger",
              revealed && !isCorrect && !isWrongPick && "border-line opacity-50",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
