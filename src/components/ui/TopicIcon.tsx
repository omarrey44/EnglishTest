import {
  AudioLines,
  Boxes,
  CalendarDays,
  ClipboardCheck,
  Clock,
  CloudSun,
  Gauge,
  GitMerge,
  Handshake,
  Hash,
  HelpCircle,
  Hourglass,
  House,
  Lightbulb,
  ListOrdered,
  MinusCircle,
  MoveRight,
  PenLine,
  Repeat,
  Rewind,
  Scale,
  Shirt,
  Shuffle,
  Tags,
  ToggleLeft,
  type LucideIcon,
} from "lucide-react";
import type { TopicId } from "@/types/question";

/**
 * Keyed by topic id, not by position, so reordering TOPICS cannot shuffle the
 * icons. Being a Record<TopicId, …> also means a new topic will not compile
 * until it has an icon here.
 */
const TOPIC_ICONS: Record<TopicId, LucideIcon> = {
  ordinals: Hash,
  weather: CloudSun,
  dates: CalendarDays,
  years: Clock,
  andBut: GitMerge,
  pastVerbs: Rewind,
  irregularVerbs: Shuffle,
  pastNegative: MinusCircle,
  edSpelling: PenLine,
  edPronunciation: AudioLines,
  wasWere: ToggleLeft,
  whQuestions: HelpCircle,
  sequenceWords: ListOrdered,
  clothes: Shirt,
  countable: Boxes,
  quantifiers: Scale,
  wouldLike: Handshake,
  partsOfSpeech: Tags,
  intensifiers: Gauge,
  thereIsAre: House,
  presentContinuous: Hourglass,
  toInfinitive: MoveRight,
  presentVsContinuous: Repeat,
  haveTo: ClipboardCheck,
  should: Lightbulb,
};

export function TopicIcon({ topic, className }: { topic: TopicId; className?: string }) {
  const Icon = TOPIC_ICONS[topic];
  return <Icon className={className} />;
}
