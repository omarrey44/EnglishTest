import type { Question, TopicId } from "@/types/question";
import type { ExamResult, ProgressState, TopicStat } from "@/types/progress";
import { XP, accuracyOf, masteryLevel } from "./scoring";
import { followUpDelay } from "./adaptiveLearning";

export interface AnswerOutcome {
  state: ProgressState;
  xpGained: number;
  masteredTopic: TopicId | null;
}

/** Applies one answer to the progress state and returns the new state + XP earned. */
export function applyAnswer(
  state: ProgressState,
  question: Question,
  userAnswer: string,
  correct: boolean,
): AnswerOutcome {
  const prevStat: TopicStat = state.topicStats[question.topic] ?? { attempted: 0, correct: 0 };
  const stat: TopicStat = {
    attempted: prevStat.attempted + 1,
    correct: prevStat.correct + (correct ? 1 : 0),
  };

  const streak = correct ? state.streak + 1 : 0;
  const questionsAnswered = state.questionsAnswered + 1;

  let xpGained = 0;
  if (correct) {
    xpGained += XP.correct;
    if (streak >= XP.streakBonusFrom) xpGained += XP.streakBonus;
  }

  // Mastery check (needs a meaningful sample so one lucky answer is not enough).
  const accuracy = accuracyOf(stat.correct, stat.attempted);
  const level = masteryLevel(accuracy, stat.attempted);
  let masteredTopic: TopicId | null = null;
  let masteredTopics = state.masteredTopics;
  if (
    correct &&
    level === "mastered" &&
    stat.attempted >= 5 &&
    !state.masteredTopics.includes(question.topic)
  ) {
    masteredTopic = question.topic;
    masteredTopics = [...state.masteredTopics, question.topic];
    xpGained += XP.masterTopic;
  } else if (!correct && level !== "mastered" && state.masteredTopics.includes(question.topic)) {
    masteredTopics = state.masteredTopics.filter((t) => t !== question.topic);
  }

  // Weak concepts: schedule the failed rule to come back in 3–6 questions.
  let weakConcepts = state.weakConcepts;
  if (correct) {
    weakConcepts = weakConcepts.filter(
      (c) => !(c.subtopic === question.subtopic && questionsAnswered >= c.dueAt),
    );
  } else {
    const existing = weakConcepts.find((c) => c.subtopic === question.subtopic);
    weakConcepts = existing
      ? weakConcepts.map((c) =>
          c.subtopic === question.subtopic
            ? { ...c, failures: c.failures + 1, dueAt: questionsAnswered + followUpDelay() }
            : c,
        )
      : [
          ...weakConcepts,
          {
            topic: question.topic,
            subtopic: question.subtopic,
            failures: 1,
            dueAt: questionsAnswered + followUpDelay(),
          },
        ];
  }

  // Mistake log.
  let mistakes = state.mistakes;
  if (correct) {
    mistakes = mistakes.map((m) =>
      m.subtopic === question.subtopic && !m.resolved ? { ...m, resolved: true } : m,
    );
  } else {
    mistakes = [
      {
        questionId: question.id,
        topic: question.topic,
        subtopic: question.subtopic,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        at: Date.now(),
        resolved: false,
      },
      ...mistakes.filter((m) => m.questionId !== question.id),
    ].slice(0, 60);
  }

  return {
    xpGained,
    masteredTopic,
    state: {
      ...state,
      updatedAt: Date.now(),
      xp: state.xp + xpGained,
      streak,
      bestStreak: Math.max(state.bestStreak, streak),
      questionsAnswered,
      correctAnswers: state.correctAnswers + (correct ? 1 : 0),
      topicStats: { ...state.topicStats, [question.topic]: stat },
      masteredTopics,
      weakConcepts,
      mistakes,
      recentQuestionIds: [question.id, ...state.recentQuestionIds].slice(0, 40),
    },
  };
}

export function applyPerfectLesson(state: ProgressState): ProgressState {
  return { ...state, xp: state.xp + XP.perfectLesson, updatedAt: Date.now() };
}

export function markDiagnosticDone(state: ProgressState): ProgressState {
  return { ...state, diagnosticDone: true, updatedAt: Date.now() };
}

export function recordExamResult(
  state: ProgressState,
  result: Omit<ExamResult, "id" | "at">,
): ProgressState {
  const entry: ExamResult = {
    ...result,
    id: `exam-${Date.now()}`,
    at: Date.now(),
  };
  return {
    ...state,
    examResults: [entry, ...state.examResults].slice(0, 20),
    updatedAt: Date.now(),
  };
}
