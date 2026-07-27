"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Question, TopicId } from "@/types/question";
import type { TopicStat } from "@/types/progress";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { MultipleChoice, SoundChoice } from "./MultipleChoice";
import { TextAnswer } from "./TextAnswer";
import { WordOrder } from "./WordOrder";
import { Feedback } from "./Feedback";
import { useProgress } from "@/components/progress/ProgressProvider";
import { isAnswerCorrect, accuracyOf, scoreOutOfTen } from "@/lib/scoring";
import { pickFollowUpQuestion } from "@/lib/adaptiveLearning";
import { TOPIC_MAP } from "@/data/topics";

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

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 pb-8 sm:px-6">
      <header className="sticky top-0 z-10 -mx-4 bg-paper/85 px-4 pt-4 pb-3 backdrop-blur-sm sm:-mx-6 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push(exitHref)}
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
          >
            <X className="size-4" />
            Exit
          </button>
          <p className="tabular text-sm font-medium text-muted">
            Question {index + 1} of {total}
          </p>
          {mode === "exam" ? (
            <span className="text-xs font-medium tracking-[0.08em] text-muted uppercase">
              Exam
            </span>
          ) : (
            <span
              className={
                state.streak > 0
                  ? "inline-flex items-center gap-1 text-sm font-semibold text-warning"
                  : "inline-flex items-center gap-1 text-sm text-muted/60"
              }
            >
              <Flame className="size-4" />
              <span className="tabular">{state.streak}</span>
            </span>
          )}
        </div>
        <ProgressBar
          value={((index + (checked ? 1 : 0)) / total) * 100}
          className="mt-3"
          tone={mode === "exam" ? "ink" : "accent"}
          label={`${title} progress`}
        />
      </header>

      <main className="flex flex-1 flex-col justify-start pt-6 sm:justify-center sm:pt-10 sm:pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id + String(index)}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-none"
          >
            <p
              className="text-xs font-semibold tracking-[0.14em] uppercase"
              style={{ color: accent }}
            >
              {question.label}
            </p>
            <h1 className="mt-2 text-sm font-medium text-muted">{question.instruction}</h1>
            <p className="mt-4 font-display text-[1.75rem] leading-[1.2] sm:text-[2.1rem]">
              {question.question}
            </p>

            <div className="mt-7">
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
        <div className="sticky bottom-0 -mx-4 mt-6 bg-gradient-to-t from-paper via-paper to-transparent px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:-mx-6 sm:px-6">
          <Button size="lg" fullWidth onClick={handleCheck} disabled={!canCheck}>
            {mode === "exam" ? (index + 1 >= total ? "Finish exam" : "Next question") : "Check Answer"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
