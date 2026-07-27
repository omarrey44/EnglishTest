import type { TopicId, TopicMeta } from "@/types/question";

export const TOPICS: TopicMeta[] = [
  {
    id: "ordinals",
    name: "Ordinal Numbers",
    spanishName: "Números ordinales",
    short: "Ordinals",
    description: "1st to 31st — the numbers you need for dates.",
    icon: "Hash",
    accent: "#0F6E5C",
  },
  {
    id: "weather",
    name: "Weather Vocabulary",
    spanishName: "Vocabulario del clima",
    short: "Weather",
    description: "Sunny, cloudy, windy, freezing — and how to ask about it.",
    icon: "CloudSun",
    accent: "#2563A8",
  },
  {
    id: "dates",
    name: "American Dates",
    spanishName: "Fechas en inglés americano",
    short: "Dates",
    description: "Month + ordinal day + year: December 23rd, 1994.",
    icon: "CalendarDays",
    accent: "#B4632A",
  },
  {
    id: "years",
    name: "Saying Years",
    spanishName: "Cómo decir los años",
    short: "Years",
    description: "1994 → nineteen ninety-four. 2005 → two thousand five.",
    icon: "Clock",
    accent: "#6B4EA8",
  },
  {
    id: "andBut",
    name: "And / But",
    spanishName: "Conectores and y but",
    short: "And / But",
    description: "Adding ideas vs. contrasting them.",
    icon: "GitMerge",
    accent: "#A03A5E",
  },
  {
    id: "pastVerbs",
    name: "Regular Past Verbs",
    spanishName: "Verbos regulares en pasado",
    short: "Past Verbs",
    description: "Using regular verbs in the past simple.",
    icon: "Rewind",
    accent: "#1F6F8B",
  },
  {
    id: "edSpelling",
    name: "-ed Spelling Rules",
    spanishName: "Reglas para escribir -ed",
    short: "-ed Spelling",
    description: "-ed, -d, -ied and double consonant + -ed.",
    icon: "PenLine",
    accent: "#7A5C1E",
  },
  {
    id: "edPronunciation",
    name: "-ed Pronunciation",
    spanishName: "Pronunciación de -ed",
    short: "-ed Sound",
    description: "The three sounds: /ɪd/, /t/ and /d/.",
    icon: "AudioLines",
    accent: "#0E7490",
  },
  {
    id: "wasWere",
    name: "Was / Were",
    spanishName: "Was y were",
    short: "Was / Were",
    description: "Statements, negatives, questions and short answers.",
    icon: "ToggleLeft",
    accent: "#3F5DA8",
  },
  {
    id: "whQuestions",
    name: "WH Questions",
    spanishName: "Preguntas WH",
    short: "WH Questions",
    description: "What, where, when, who, why and how.",
    icon: "HelpCircle",
    accent: "#8A4B1F",
  },
];

export const TOPIC_MAP: Record<TopicId, TopicMeta> = TOPICS.reduce(
  (acc, t) => {
    acc[t.id] = t;
    return acc;
  },
  {} as Record<TopicId, TopicMeta>,
);

export const TOPIC_IDS: TopicId[] = TOPICS.map((t) => t.id);

export function topicName(id: TopicId): string {
  return TOPIC_MAP[id]?.name ?? id;
}
