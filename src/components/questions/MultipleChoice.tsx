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
              "flex min-h-14 w-full items-center gap-3.5 rounded-lg border-2 px-4 py-3 text-left disabled:cursor-default",
              !revealed && "press-soft",
              selected && !revealed && "border-accent bg-accent/10",
              !selected &&
                !revealed &&
                "border-line bg-surface hover:border-ink/35",
              isCorrect && "border-success bg-success/10",
              isWrongPick && "border-danger bg-danger/10",
              revealed && !isCorrect && !isWrongPick && "border-line bg-surface opacity-45",
            )}
          >
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-[4px] border-2 font-mono text-xs font-semibold",
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
              "phonetic flex min-h-24 flex-col items-center justify-center rounded-lg border-2 text-xl disabled:cursor-default sm:text-2xl",
              !revealed && "press-soft",
              selected && !revealed && "border-accent bg-accent/10 text-accent",
              !selected && !revealed && "border-line bg-surface hover:border-ink/35",
              isCorrect && "border-success bg-success/10 text-success",
              isWrongPick && "border-danger bg-danger/10 text-danger",
              revealed && !isCorrect && !isWrongPick && "border-line opacity-40",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
