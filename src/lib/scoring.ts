import type { Question } from "@/types/question";
import type { MasteryLevel } from "@/types/progress";

/** XP rewards. */
export const XP = {
  correct: 10,
  streakBonus: 5,
  /** Streak length needed before the bonus starts applying. */
  streakBonusFrom: 3,
  masterTopic: 50,
  perfectLesson: 100,
};

const SMART_QUOTES = /[‘’ʼ]/g;
const STRIP = /[.,!?;:"¡¿()]/g;

/** Lowercase, remove punctuation and collapse spaces so answers compare fairly. */
export function normalizeAnswer(value: string): string {
  return value
    .replace(SMART_QUOTES, "'")
    .replace(/[-–—]/g, " ")
    .replace(STRIP, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function stripApostrophes(value: string): string {
  return value.replace(/'/g, "");
}

function variants(value: string): string[] {
  const base = normalizeAnswer(value);
  return [base, stripApostrophes(base)];
}

export function isAnswerCorrect(question: Question, answer: string): boolean {
  if (!answer.trim()) return false;
  const given = variants(answer);
  const accepted = [question.correctAnswer, ...(question.acceptedAnswers ?? [])];
  return accepted.some((valid) => {
    const opts = variants(valid);
    return given.some((g) => opts.includes(g));
  });
}

export function accuracyOf(correct: number, attempted: number): number {
  if (attempted <= 0) return 0;
  return Math.round((correct / attempted) * 100);
}

export function masteryLevel(accuracy: number, attempted: number): MasteryLevel {
  if (attempted === 0) return "new";
  if (accuracy < 70) return "weak";
  if (accuracy < 85) return "practice";
  // A topic is only "mastered" with a meaningful sample — one lucky answer
  // should never look like mastery.
  if (accuracy < 95 || attempted < 4) return "good";
  return "mastered";
}

export const MASTERY_LABEL: Record<MasteryLevel, string> = {
  new: "Not started",
  weak: "Weak",
  practice: "Needs practice",
  good: "Good",
  mastered: "Mastered",
};

export const MASTERY_TONE: Record<MasteryLevel, string> = {
  new: "text-muted bg-ink/5 border-ink/10",
  weak: "text-danger bg-danger/10 border-danger/20",
  practice: "text-warning bg-warning/10 border-warning/25",
  good: "text-accent bg-accent/10 border-accent/20",
  mastered: "text-success bg-success/10 border-success/20",
};

/** Score out of 10, rounded to one decimal. */
export function scoreOutOfTen(accuracy: number): number {
  return Math.round(accuracy) / 10;
}

export function readinessLabel(readiness: number): string {
  if (readiness >= 95) return "Exam ready";
  if (readiness >= 85) return "Almost ready!";
  if (readiness >= 70) return "Getting close";
  if (readiness >= 50) return "Keep going";
  if (readiness > 0) return "Just starting";
  return "Take the diagnostic";
}

export function examVerdict(accuracy: number): { title: string; message: string } {
  if (accuracy >= 95)
    return {
      title: "Outstanding!",
      message: "That is a 10/10 performance. Keep this level and the exam is yours.",
    };
  if (accuracy >= 85)
    return {
      title: "Excellent!",
      message: "You're ready for the exam. Polish the weak topics below to reach 10/10.",
    };
  if (accuracy >= 70)
    return {
      title: "Good work.",
      message: "You're above 7/10. Focus on the topics below and take the exam again.",
    };
  return {
    title: "Not there yet.",
    message: "Use Smart Practice on your weak topics, then try the simulator again.",
  };
}
