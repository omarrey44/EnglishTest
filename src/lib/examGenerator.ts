import type { Question, TopicId } from "@/types/question";
import { questionsByTopic } from "@/data/questions";
import { TOPIC_IDS } from "@/data/topics";
import { shuffle } from "./adaptiveLearning";

/**
 * Relative weight of each topic in the diagnostic. The diagnostic covers at most
 * MAX_DIAGNOSTIC_TOPICS topics, so these are shares of DIAGNOSTIC_LENGTH, not counts.
 */
const DIAGNOSTIC_WEIGHTS: Record<TopicId, number> = {
  ordinals: 1,
  weather: 1,
  dates: 1,
  years: 1,
  andBut: 1,
  pastVerbs: 1,
  irregularVerbs: 2,
  pastNegative: 1,
  edSpelling: 1,
  edPronunciation: 1,
  wasWere: 2,
  whQuestions: 1,
  sequenceWords: 1,
  clothes: 1,
  countable: 1,
  quantifiers: 2,
  wouldLike: 1,
  partsOfSpeech: 1,
  intensifiers: 1,
  thereIsAre: 1,
  presentContinuous: 2,
  toInfinitive: 1,
  presentVsContinuous: 2,
  haveTo: 1,
  should: 1,
};

/** Exam simulator distribution (30 questions, every topic covered). */
const EXAM_WEIGHTS: Record<TopicId, number> = {
  ordinals: 1,
  weather: 1,
  dates: 1,
  years: 1,
  andBut: 1,
  pastVerbs: 1,
  irregularVerbs: 2,
  pastNegative: 1,
  edSpelling: 1,
  edPronunciation: 1,
  wasWere: 1,
  whQuestions: 1,
  sequenceWords: 1,
  clothes: 1,
  countable: 1,
  quantifiers: 2,
  wouldLike: 1,
  partsOfSpeech: 1,
  intensifiers: 1,
  thereIsAre: 1,
  presentContinuous: 2,
  toInfinitive: 1,
  presentVsContinuous: 2,
  haveTo: 2,
  should: 1,
};

function draw(topic: TopicId, count: number, used: Set<string>): Question[] {
  const pool = shuffle(questionsByTopic(topic)).filter((q) => !used.has(q.id));
  // Mix difficulties: easy first, then harder ones.
  const byDifficulty = [
    ...pool.filter((q) => q.difficulty === 1),
    ...pool.filter((q) => q.difficulty === 2),
    ...pool.filter((q) => q.difficulty === 3),
  ];
  const picked: Question[] = [];
  // Fractional step spreads picks across the whole pool, so hard questions are
  // reached even when count is close to the pool size.
  const step = Math.max(1, byDifficulty.length / Math.max(count, 1));
  for (let i = 0; picked.length < count && i < byDifficulty.length; i += step) {
    const q = byDifficulty[Math.floor(i)];
    if (!used.has(q.id)) {
      picked.push(q);
      used.add(q.id);
    }
  }
  for (const q of byDifficulty) {
    if (picked.length >= count) break;
    if (!used.has(q.id)) {
      picked.push(q);
      used.add(q.id);
    }
  }
  return picked;
}

/** The full length of each session when every topic is selected. */
export const EXAM_LENGTH = Object.values(EXAM_WEIGHTS).reduce((a, b) => a + b, 0);
export const DIAGNOSTIC_LENGTH = 20;

/** The diagnostic is meant to stay short, so it only covers so many topics. */
export const MAX_DIAGNOSTIC_TOPICS = 10;

/**
 * Splits `total` questions across `topics` in proportion to their weight, never
 * asking a topic for more questions than it actually has. Returns the real
 * total too, which is smaller than `total` when the selection is narrow.
 */
function distribute(
  topics: TopicId[],
  total: number,
  weights: Record<TopicId, number>,
): { counts: Map<TopicId, number>; total: number } {
  const available = new Map(topics.map((t) => [t, questionsByTopic(t).length]));
  const capacity = topics.reduce((sum, t) => sum + available.get(t)!, 0);
  const target = Math.min(total, capacity);
  const weightSum = topics.reduce((sum, t) => sum + weights[t], 0);

  const counts = new Map<TopicId, number>();
  let assigned = 0;
  for (const topic of topics) {
    const share = Math.floor((weights[topic] / weightSum) * target);
    const count = Math.min(available.get(topic)!, share);
    counts.set(topic, count);
    assigned += count;
  }

  // Hand out what rounding left over, one at a time, to topics with room left.
  for (let i = 0; assigned < target && i < topics.length * 64; i += 1) {
    const topic = topics[i % topics.length];
    if (counts.get(topic)! < available.get(topic)!) {
      counts.set(topic, counts.get(topic)! + 1);
      assigned += 1;
    }
  }

  return { counts, total: assigned };
}

function pick(
  topics: TopicId[],
  total: number,
  weights: Record<TopicId, number>,
): Question[] {
  const { counts } = distribute(topics, total, weights);
  const used = new Set<string>();
  return topics.flatMap((topic) => draw(topic, counts.get(topic)!, used));
}

/** How many questions an exam limited to these topics would actually have. */
export function examLengthFor(topics: TopicId[]): number {
  const selected = topics.length > 0 ? topics : TOPIC_IDS;
  return distribute(selected, EXAM_LENGTH, EXAM_WEIGHTS).total;
}

/** How many questions a diagnostic limited to these topics would have. */
export function diagnosticLengthFor(topics: TopicId[]): number {
  const selected = topics.length > 0 ? topics : defaultDiagnosticTopics();
  return distribute(selected, DIAGNOSTIC_LENGTH, DIAGNOSTIC_WEIGHTS).total;
}

/** The topics the diagnostic starts with — the first ten, in course order. */
export function defaultDiagnosticTopics(): TopicId[] {
  return TOPIC_IDS.slice(0, MAX_DIAGNOSTIC_TOPICS);
}

/**
 * Questions ordered from easy to hard. Pass a subset of topics to find your
 * level on just those; the default is the first ten topics.
 */
export function generateDiagnostic(topics: TopicId[] = defaultDiagnosticTopics()): Question[] {
  const selected = topics.length > 0 ? topics : defaultDiagnosticTopics();
  const questions = pick(selected, DIAGNOSTIC_LENGTH, DIAGNOSTIC_WEIGHTS);
  return shuffle(questions).sort((a, b) => a.difficulty - b.difficulty);
}

/**
 * Mixed questions with no feedback during the exam. Pass a subset of topics to
 * sit a shorter exam on just those; the default is every topic.
 */
export function generateExam(topics: TopicId[] = TOPIC_IDS): Question[] {
  const selected = topics.length > 0 ? topics : TOPIC_IDS;
  return shuffle(pick(selected, EXAM_LENGTH, EXAM_WEIGHTS));
}
