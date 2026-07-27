"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Question, TopicId } from "@/types/question";
import type { TopicStat } from "@/types/progress";
import { Button } from "@/components/ui/Button";
import { MultipleChoice, SoundChoice } from "./MultipleChoice";
import { TextAnswer } from "./TextAnswer";
import { WordOrder } from "./WordOrder";
import { Feedback } from "./Feedback";
import { useProgress } from "@/components/progress/ProgressProvider";
import { isAnswerCorrect, accuracyOf, scoreOutOfTen } from "@/lib/scoring";
import { pickFollowUpQuestion } from "@/lib/adaptiveLearning";
import { TOPIC_MAP } from "@/data/topics";
import { cn } from "@/lib/cn";

export interface AnsweredQuestion {
  question: Question;
  userAnswer: string;
  correct: boolean;
}

export interface SessionSummary {
  total: number;
  correct: number;
  accuracy: number;
  score: number;
  byTopic: Partial<Record<TopicId, TopicStat>>;
  answers: AnsweredQuestion[];
}

export type SessionMode = "practice" | "diagnostic" | "exam";

const MAX_FOLLOW_UPS = 4;

/** A punch card: one tick per question, punched as you answer. */
function PunchStrip({
  total,
  done,
  color,
  label,
}: {
  total: number;
  done: number;
  color?: string;
  label: string;
}) {
  return (
    <div
      className="flex gap-[2px]"
      role="progressbar"
      aria-label={label}
      aria-valuenow={done}
      aria-valuemin={0}
      aria-valuemax={total}
    >
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 flex-1 rounded-[1px] transition-colors duration-300",
            i >= done && "bg-ink/12",
          )}
          style={i < done ? { background: color ?? "var(--accent)" } : undefined}
        />
      ))}
    </div>
  );
}

export function SessionRunner({
  questions,
  mode,
  title,
  onFinish,
  exitHref = "/",
}: {
  questions: Question[];
  mode: SessionMode;
  title: string;
  onFinish: (summary: SessionSummary) => void;
  exitHref?: string;
}) {
  const router = useRouter();
  const { state, answer: recordAnswer, perfectLesson } = useProgress();

  const [queue, setQueue] = useState<Question[]>(questions);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [picked, setPicked] = useState<number[]>([]);
  const [checked, setChecked] = useState<{
    correct: boolean;
    userAnswer: string;
    xpGained: number;
    streak: number;
    masteredTopicName: string | null;
  } | null>(null);

  const answersRef = useRef<AnsweredQuestion[]>([]);
  const followUpsRef = useRef(0);
  const feedbackRef = useRef<HTMLDivElement>(null);

  const question = queue[index];
  const total = queue.length;
  const showFeedback = mode !== "exam" && checked !== null;

  const composedAnswer = useMemo(() => {
    if (!question) return "";
    if (question.type === "word-order") {
      return picked.map((i) => question.words?.[i] ?? "").join(" ");
    }
    return value;
  }, [question, picked, value]);

  const canCheck = useMemo(() => {
    if (!question) return false;
    if (question.type === "word-order") {
      return picked.length === (question.words?.length ?? 0);
    }
    return composedAnswer.trim().length > 0;
  }, [question, picked, composedAnswer]);

  const finish = useCallback(() => {
    const answers = answersRef.current;
    const correct = answers.filter((a) => a.correct).length;
    const byTopic: Partial<Record<TopicId, TopicStat>> = {};
    for (const a of answers) {
      const stat = byTopic[a.question.topic] ?? { attempted: 0, correct: 0 };
      byTopic[a.question.topic] = {
        attempted: stat.attempted + 1,
        correct: stat.correct + (a.correct ? 1 : 0),
      };
    }
    const accuracy = accuracyOf(correct, answers.length);
    if (mode !== "exam" && answers.length > 0 && correct === answers.length) {
      perfectLesson();
    }
    onFinish({
      total: answers.length,
      correct,
      accuracy,
      score: scoreOutOfTen(accuracy),
      byTopic,
      answers,
    });
  }, [mode, onFinish, perfectLesson]);

  const goNext = useCallback(() => {
    setChecked(null);
    setValue("");
    setPicked([]);
    if (index + 1 >= queue.length) {
      finish();
    } else {
      setIndex((i) => i + 1);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [index, queue.length, finish]);

  const scheduleFollowUp = useCallback(
    (failed: Question) => {
      if (followUpsRef.current >= MAX_FOLLOW_UPS) return;
      const seen = [
        ...queue.map((q) => q.id),
        ...answersRef.current.map((a) => a.question.id),
      ];
      const follow = pickFollowUpQuestion(failed.subtopic, failed.topic, seen);
      if (!follow) return;
      followUpsRef.current += 1;
      // Never right after the mistake: 3–6 questions later, so the student has
      // to remember the rule instead of copying the answer they just read.
      const gap = 3 + Math.floor(Math.random() * 4);
      setQueue((prev) => {
        const at = Math.min(index + gap, prev.length);
        const next = [...prev];
        next.splice(at, 0, follow);
        return next;
      });
    },
    [index, queue],
  );

  const handleCheck = useCallback(() => {
    if (!question || !canCheck || checked) return;
    const userAnswer = composedAnswer;
    const correct = isAnswerCorrect(question, userAnswer);
    const outcome = recordAnswer(question, userAnswer, correct);
    answersRef.current = [...answersRef.current, { question, userAnswer, correct }];

    if (!correct && mode !== "exam") scheduleFollowUp(question);

    if (mode === "exam") {
      // No feedback during the exam simulator.
      setValue("");
      setPicked([]);
      if (index + 1 >= queue.length) {
        finish();
      } else {
        setIndex((i) => i + 1);
        if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    setChecked({
      correct,
      userAnswer,
      xpGained: outcome.xpGained,
      streak: outcome.state.streak,
      masteredTopicName: outcome.masteredTopic ? TOPIC_MAP[outcome.masteredTopic].name : null,
    });
    requestAnimationFrame(() => {
      feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }, [
    question,
    canCheck,
    checked,
    composedAnswer,
    recordAnswer,
    mode,
    scheduleFollowUp,
    index,
    queue.length,
    finish,
  ]);

  if (!question) return null;

  const status = checked ? (checked.correct ? "correct" : "wrong") : "idle";
  const accent = TOPIC_MAP[question.topic]?.accent;
  const done = index + (checked ? 1 : 0);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-5 pb-8 sm:px-8">
      <header className="sticky top-0 z-10 -mx-5 border-b border-line bg-white/90 px-5 pt-4 pb-3 shadow-[0_8px_30px_rgba(29,43,81,.05)] backdrop-blur-md sm:-mx-8 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push(exitHref)}
            className="index inline-flex items-center gap-1.5 text-muted transition-colors hover:text-ink"
          >
            <X className="size-3.5" />
            Exit
          </button>

          <p className="index tabular text-ink">
            <span style={mode === "exam" ? undefined : { color: accent }}>
              Q.{String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-muted"> / {String(total).padStart(2, "0")}</span>
          </p>

          {mode === "exam" ? (
            <span className="index text-muted">Exam</span>
          ) : (
            <span
              className={
                state.streak > 0
                  ? "index tabular inline-flex items-center gap-1 text-warning"
                  : "index tabular inline-flex items-center gap-1 text-muted/60"
              }
            >
              <Flame className="size-3.5" />
              {state.streak}
            </span>
          )}
        </div>

        <div className="mt-3">
          <PunchStrip
            total={total}
            done={done}
            color={mode === "exam" ? "var(--ink)" : accent}
            label={`${title} progress`}
          />
        </div>
      </header>

      <main className="flex flex-1 flex-col justify-start pt-8 sm:justify-center sm:pt-10 sm:pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id + String(index)}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col rounded-3xl border border-line bg-white p-5 shadow-card sm:flex-none sm:p-8"
          >
            <div className="flex items-center gap-3">
              <p className="index flex items-center gap-2" style={{ color: accent }}>
                <span
                  aria-hidden
                  className="inline-block h-2.5 w-0.5 shrink-0 bg-current opacity-70"
                />
                {question.label}
              </p>
              <span aria-hidden className="leader" />
            </div>

            <h1 className="mt-3 text-sm font-medium text-muted">{question.instruction}</h1>

            <p className="mt-4 font-display text-[1.9rem] leading-[1.12] tracking-[-0.02em] sm:text-[2.4rem]">
              {question.question}
            </p>

            <div className="mt-8">
              {question.type === "pronunciation" ? (
                <SoundChoice
                  options={question.options ?? []}
                  value={value}
                  onSelect={setValue}
                  disabled={!!checked}
                  correctAnswer={question.correctAnswer}
                  revealed={showFeedback}
                />
              ) : question.type === "multiple-choice" ? (
                <MultipleChoice
                  options={question.options ?? []}
                  value={value}
                  onSelect={setValue}
                  disabled={!!checked}
                  correctAnswer={question.correctAnswer}
                  revealed={showFeedback}
                />
              ) : question.type === "word-order" ? (
                <WordOrder
                  words={question.words ?? []}
                  picked={picked}
                  onPick={(i) => setPicked((p) => [...p, i])}
                  onUnpick={(pos) => setPicked((p) => p.filter((_, idx) => idx !== pos))}
                  onReset={() => setPicked([])}
                  disabled={!!checked}
                  status={status}
                />
              ) : (
                <TextAnswer
                  value={value}
                  onChange={setValue}
                  onSubmit={handleCheck}
                  disabled={!!checked}
                  status={status}
                  placeholder={
                    question.type === "error-detection"
                      ? "Write the corrected sentence"
                      : question.type === "transformation"
                        ? "Write the new sentence"
                        : "Type your answer"
                  }
                />
              )}
            </div>

            <div ref={feedbackRef} className="mt-6">
              <AnimatePresence>
                {showFeedback && checked ? (
                  <Feedback
                    question={question}
                    userAnswer={checked.userAnswer}
                    correct={checked.correct}
                    xpGained={checked.xpGained}
                    streak={checked.streak}
                    masteredTopicName={checked.masteredTopicName}
                    onContinue={goNext}
                    isLast={index + 1 >= queue.length}
                  />
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {!showFeedback ? (
        <div className="sticky bottom-0 -mx-5 mt-6 bg-gradient-to-t from-paper via-paper to-transparent px-5 pt-5 pb-[max(1rem,env(safe-area-inset-bottom))] sm:-mx-8 sm:px-8">
          <Button size="lg" fullWidth onClick={handleCheck} disabled={!canCheck}>
            {mode === "exam"
              ? index + 1 >= total
                ? "Finish exam"
                : "Next question"
              : "Check Answer"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
