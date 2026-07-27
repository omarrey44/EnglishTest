import type { Question, TopicId } from "@/types/question";
import type { MasteryLevel, ProgressState, TopicProgress } from "@/types/progress";
import { QUESTIONS, questionsByTopic } from "@/data/questions";
import { TOPIC_IDS } from "@/data/topics";
import { accuracyOf, masteryLevel } from "./scoring";

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function getTopicProgress(state: ProgressState): TopicProgress[] {
  return TOPIC_IDS.map((topic) => {
    const stat = state.topicStats[topic] ?? { attempted: 0, correct: 0 };
    const accuracy = accuracyOf(stat.correct, stat.attempted);
    return {
      topic,
      attempted: stat.attempted,
      correct: stat.correct,
      accuracy,
      level: masteryLevel(accuracy, stat.attempted),
    };
  });
}

/** Overall exam readiness: average of the ten topic accuracies (untouched topics count as 0). */
export function getReadiness(state: ProgressState): number {
  const progress = getTopicProgress(state);
  const total = progress.reduce((sum, p) => sum + (p.attempted > 0 ? p.accuracy : 0), 0);
  return Math.round(total / progress.length);
}

export function topicsByLevel(state: ProgressState, levels: MasteryLevel[]): TopicId[] {
  return getTopicProgress(state)
    .filter((p) => levels.includes(p.level))
    .map((p) => p.topic);
}

function isFresh(q: Question, used: Set<string>, recent: string[]): boolean {
  return !used.has(q.id) && !recent.includes(q.id);
}

/** Take `count` questions from a topic list, avoiding repeats where possible. */
function drawFrom(
  topics: TopicId[],
  count: number,
  used: Set<string>,
  recent: string[],
): Question[] {
  if (count <= 0 || topics.length === 0) return [];
  const pool = shuffle(topics.flatMap((t) => questionsByTopic(t)));
  const picked: Question[] = [];

  for (const q of pool) {
    if (picked.length >= count) break;
    if (isFresh(q, used, recent)) {
      picked.push(q);
      used.add(q.id);
    }
  }
  // Second pass: allow recently seen questions if the pool was too small.
  if (picked.length < count) {
    for (const q of pool) {
      if (picked.length >= count) break;
      if (!used.has(q.id)) {
        picked.push(q);
        used.add(q.id);
      }
    }
  }
  return picked;
}

/**
 * Smart Practice: 50% weak topics, 30% intermediate, 20% mastered,
 * so old knowledge stays fresh while weaknesses get most of the attention.
 */
export function buildSmartPractice(state: ProgressState, count = 15): Question[] {
  const used = new Set<string>();
  const recent = state.recentQuestionIds.slice(0, 12);

  const weak = topicsByLevel(state, ["weak", "new"]);
  const middle = topicsByLevel(state, ["practice", "good"]);
  const strong = topicsByLevel(state, ["mastered"]);

  const weakCount = Math.round(count * 0.5);
  const middleCount = Math.round(count * 0.3);
  const strongCount = count - weakCount - middleCount;

  const picked = [
    ...drawFrom(weak, weakCount, used, recent),
    ...drawFrom(middle, middleCount, used, recent),
    ...drawFrom(strong, strongCount, used, recent),
  ];

  // If some buckets were empty, fill the rest from every topic.
  if (picked.length < count) {
    picked.push(...drawFrom(TOPIC_IDS, count - picked.length, used, recent));
  }
  return shuffle(picked).slice(0, count);
}

export interface PlanEntry {
  topic: TopicId;
  count: number;
  accuracy: number;
  level: MasteryLevel;
}

export interface PersonalizedPlan {
  entries: PlanEntry[];
  questions: Question[];
  total: number;
}

/**
 * "Get me to 10/10": weight every topic by how far it is from mastery
 * and build a session that spends the most questions on the biggest gaps.
 */
export function buildPersonalizedPlan(state: ProgressState, count = 15): PersonalizedPlan {
  const progress = getTopicProgress(state);
  const weights = progress.map((p) => {
    const gap = Math.max(100 - (p.attempted > 0 ? p.accuracy : 0), 5);
    // Never-practiced topics matter, but a failed topic matters more.
    const weight = p.attempted === 0 ? gap * 0.6 : gap;
    return { ...p, weight };
  });

  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0) || 1;
  const entries: PlanEntry[] = weights
    .map((w) => ({
      topic: w.topic,
      accuracy: w.attempted > 0 ? w.accuracy : 0,
      level: w.level,
      count: Math.floor((w.weight / totalWeight) * count),
    }))
    .filter((e) => e.count > 0)
    .sort((a, b) => b.count - a.count || a.accuracy - b.accuracy);

  // Distribute leftovers to the weakest topics.
  let assigned = entries.reduce((sum, e) => sum + e.count, 0);
  let i = 0;
  while (assigned < count && entries.length > 0) {
    entries[i % entries.length].count += 1;
    assigned += 1;
    i += 1;
  }

  const used = new Set<string>();
  const recent = state.recentQuestionIds.slice(0, 8);
  const questions = entries.flatMap((entry) =>
    drawFrom([entry.topic], entry.count, used, recent),
  );

  return { entries, questions: shuffle(questions), total: questions.length };
}

export function buildTopicSession(topic: TopicId, count = 10, state?: ProgressState): Question[] {
  const used = new Set<string>();
  const recent = state?.recentQuestionIds.slice(0, 6) ?? [];
  return drawFrom([topic], count, used, recent);
}

/**
 * Adaptive repetition: after a mistake we never show the same question again
 * right away — we look for a DIFFERENT question that tests the same rule.
 */
export function pickFollowUpQuestion(
  subtopic: string,
  topic: TopicId,
  excludeIds: string[],
): Question | null {
  const exclude = new Set(excludeIds);
  const sameRule = shuffle(
    QUESTIONS.filter((q) => q.subtopic === subtopic && !exclude.has(q.id)),
  );
  if (sameRule.length > 0) return sameRule[0];

  const sameTopic = shuffle(QUESTIONS.filter((q) => q.topic === topic && !exclude.has(q.id)));
  return sameTopic[0] ?? null;
}

/** Distance (in questions) before a failed rule comes back. */
export function followUpDelay(): number {
  return 3 + Math.floor(Math.random() * 4); // 3–6 questions later
}

/**
 * Builds a session out of the rules the student got wrong, always using a
 * DIFFERENT question than the one that was failed.
 */
export function buildMistakeSession(state: ProgressState, count = 10): Question[] {
  const open = state.mistakes.filter((m) => !m.resolved);
  const picked: Question[] = [];
  const used = new Set<string>();

  for (const mistake of open) {
    if (picked.length >= count) break;
    const exclude = [mistake.questionId, ...picked.map((q) => q.id)];
    const follow = pickFollowUpQuestion(mistake.subtopic, mistake.topic, exclude);
    if (follow && !used.has(follow.id)) {
      picked.push(follow);
      used.add(follow.id);
    }
  }

  // Then repeat the original questions so the exact item is checked too.
  for (const mistake of open) {
    if (picked.length >= count) break;
    const original = QUESTIONS.find((q) => q.id === mistake.questionId);
    if (original && !used.has(original.id)) {
      picked.push(original);
      used.add(original.id);
    }
  }

  return shuffle(picked);
}

export function weakConceptSummary(state: ProgressState): { topic: TopicId; subtopic: string; failures: number }[] {
  return [...state.weakConcepts]
    .sort((a, b) => b.failures - a.failures)
    .map(({ topic, subtopic, failures }) => ({ topic, subtopic, failures }));
}
