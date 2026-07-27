"use client";

import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Tap-to-order builder, set like a compositor's tray of movable type. Works
 * with a mouse and with touch, and never depends on hover or on a drag
 * gesture that is awkward on phones.
 */
export function WordOrder({
  words,
  picked,
  onPick,
  onUnpick,
  onReset,
  disabled,
  status,
}: {
  words: string[];
  picked: number[];
  onPick: (index: number) => void;
  onUnpick: (position: number) => void;
  onReset: () => void;
  disabled?: boolean;
  status?: "idle" | "correct" | "wrong";
}) {
  const used = new Set(picked);

  return (
    <div className="flex flex-col gap-5">
      {/* The composing stick: where the sentence is built. */}
      <div
        className={cn(
          "min-h-24 rounded-lg border-2 border-dashed p-3 transition-colors",
          status === "correct" && "border-success bg-success/8",
          status === "wrong" && "border-danger bg-danger/8",
          (!status || status === "idle") && "border-line bg-surface-2",
        )}
      >
        {picked.length === 0 ? (
          <p className="index px-1 py-6 text-muted">Tap the words below to build the sentence</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {picked.map((wordIndex, position) => (
              <motion.button
                key={`${wordIndex}-${position}`}
                type="button"
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                disabled={disabled}
                onClick={() => onUnpick(position)}
                className="press-soft rounded-[5px] border-2 border-ink/25 bg-surface px-3 py-2 text-[1.02rem] font-medium disabled:opacity-80"
              >
                {words[wordIndex]}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {words.map((word, i) =>
          used.has(i) ? (
            <span
              key={`${word}-${i}`}
              className="rounded-[5px] border-2 border-dashed border-line px-3 py-2 text-[1.02rem] text-transparent select-none"
              aria-hidden
            >
              {word}
            </span>
          ) : (
            <button
              key={`${word}-${i}`}
              type="button"
              disabled={disabled}
              onClick={() => onPick(i)}
              className="press-soft rounded-[5px] border-2 border-line bg-surface px-3 py-2 text-[1.02rem] hover:border-ink/35 disabled:opacity-50"
            >
              {word}
            </button>
          ),
        )}
      </div>

      {picked.length > 0 && !disabled ? (
        <button
          type="button"
          onClick={onReset}
          className="index inline-flex w-fit items-center gap-1.5 text-muted transition-colors hover:text-ink"
        >
          <RotateCcw className="size-3" />
          Start over
        </button>
      ) : null}
    </div>
  );
}
