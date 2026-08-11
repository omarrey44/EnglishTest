"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Mic,
  RotateCcw,
  Square,
  TriangleAlert,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Card";
import { SegmentBar } from "@/components/ui/ProgressBar";
import { READINGS, type ReadingLength } from "@/data/readings";
import { scoreReading, type ReadingScore } from "@/lib/readingScore";
import {
  describeSpeechError,
  getSpeechRecognition,
  isInsecureOrigin,
  type SpeechRecognitionLike,
} from "@/lib/speechRecognition";
import { canSpeak, speak, stopSpeaking } from "@/lib/speak";
import { cn } from "@/lib/cn";

type Phase = "idle" | "listening" | "scored";

/** Browser support never changes while the page is open, so nothing to watch. */
const neverChanges = () => () => {};

const CATEGORIES: { id: ReadingLength; label: string; hint: string }[] = [
  { id: "long", label: "Long texts", hint: "A full story to read through, about a minute out loud." },
  { id: "short", label: "Short drills", hint: "Two or three sentences on a single rule." },
];

export function ReadAloud() {
  const [category, setCategory] = useState<ReadingLength>("long");
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState<ReadingScore | null>(null);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  // The server has no window, so it assumes support and the client corrects it
  // on hydration. That way an unsupported browser is told once, not flashed.
  const supported = useSyncExternalStore(
    neverChanges,
    () => getSpeechRecognition() !== null,
    () => true,
  );

  // Caught separately: the API is present here, it just fails on record.
  const insecure = useSyncExternalStore(neverChanges, isInsecureOrigin, () => false);

  const [speaking, setSpeaking] = useState(false);
  const canHear = useSyncExternalStore(neverChanges, canSpeak, () => true);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  /** Everything finalised so far, kept across restarts. */
  const heardRef = useRef("");
  /** True once the reader presses Stop, so onend knows not to listen again. */
  const doneRef = useRef(false);
  /** True when we threw the session away — onend must not score a stale read. */
  const cancelledRef = useRef(false);
  const retriesRef = useRef(0);

  const passages = READINGS.filter((r) => r.length === category);
  const reading = passages[index];

  // Never leave the microphone open behind us.
  useEffect(() => {
    return () => {
      doneRef.current = true;
      cancelledRef.current = true;
      recognitionRef.current?.abort();
      stopSpeaking();
    };
  }, []);

  /** Never let the voice and the microphone run at the same time. */
  const toggleSpeak = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    speak(reading.text, () => setSpeaking(false));
  };

  const reset = () => {
    doneRef.current = true;
    cancelledRef.current = true;
    recognitionRef.current?.abort();
    stopSpeaking();
    setSpeaking(false);
    recognitionRef.current = null;
    heardRef.current = "";
    setPhase("idle");
    setScore(null);
    setTranscript("");
    setError(null);
  };

  const go = (next: number) => {
    reset();
    setIndex(next);
  };

  /**
   * One utterance at a time, restarted until the reader presses Stop.
   *
   * `continuous` looks like the obvious setting for a passage, but Chrome ends
   * the stream on its own after a short silence or about a minute, so a reader
   * gets cut off mid-paragraph and sometimes sees a network error instead.
   * Short requests recover on their own and have no time limit in practice.
   */
  const listen = () => {
    const Recognition = getSpeechRecognition();
    if (!Recognition) return;

    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = 0; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result.isFinal) heardRef.current += `${result[0].transcript} `;
        else interim += `${result[0].transcript} `;
      }
      setTranscript(`${heardRef.current}${interim}`.trim());
    };

    recognition.onerror = (event) => {
      // Our own stop() raises "aborted"; a pause raises "no-speech". Neither is
      // worth showing, and onend restarts after both.
      if (event.error === "aborted" || event.error === "no-speech") return;

      // A flaky speech backend is common. Let onend retry a few times before
      // giving up and telling the reader.
      if (event.error === "network" && retriesRef.current < 3) {
        retriesRef.current += 1;
        return;
      }

      setError(describeSpeechError(event.error));
      doneRef.current = true;
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      if (cancelledRef.current) return;
      if (!doneRef.current) {
        listen();
        return;
      }
      setScore(scoreReading(reading.text, heardRef.current));
      setPhase("scored");
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const start = () => {
    if (!getSpeechRecognition()) return;

    // The voice would end up in the transcript.
    stopSpeaking();
    setSpeaking(false);

    heardRef.current = "";
    doneRef.current = false;
    cancelledRef.current = false;
    retriesRef.current = 0;
    setScore(null);
    setTranscript("");
    setError(null);
    setPhase("listening");
    listen();
  };

  const stop = () => {
    doneRef.current = true;
    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.stop();
    } else {
      // Between restarts there is nothing running, so score what we have.
      setScore(scoreReading(reading.text, heardRef.current));
      setPhase("scored");
    }
  };

  const tone =
    score === null
      ? "accent"
      : score.accuracy >= 90
        ? "success"
        : score.accuracy >= 70
          ? "warning"
          : "danger";

  return (
    <div className="mt-8 rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
      {/* ---- Category ---------------------------------------------------- */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const on = c.id === category;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              onClick={() => {
                reset();
                setCategory(c.id);
                setIndex(0);
              }}
              className={cn(
                "min-h-10 rounded-full border px-4 text-sm font-semibold transition-colors",
                on
                  ? "border-transparent bg-accent text-white"
                  : "border-line bg-surface text-muted hover:border-accent/40 hover:text-ink",
              )}
            >
              {c.label}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-muted">
        {CATEGORIES.find((c) => c.id === category)?.hint}
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <Eyebrow>{reading.focus}</Eyebrow>
        <span aria-hidden className="leader" />
        <span className="index text-muted">
          {index + 1} of {passages.length}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-[2rem] leading-none tracking-[-0.03em]">
          {reading.title}
        </h2>

        {canHear ? (
          <button
            type="button"
            onClick={toggleSpeak}
            aria-label={speaking ? "Stop the recording" : "Hear the passage read aloud"}
            className={cn(
              "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
              speaking
                ? "border-accent bg-accent text-white"
                : "border-line bg-surface text-ink hover:border-accent/40 hover:text-accent",
            )}
          >
            {speaking ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            {speaking ? "Stop" : "Listen"}
          </button>
        ) : null}
      </div>

      {/* ---- The passage ---------------------------------------------- */}
      <p className="mt-6 text-[1.35rem] leading-[1.9] tracking-[-0.01em] sm:text-[1.5rem]">
        {score
          ? score.words.map((w, i) => (
              <span
                key={`${w.word}-${i}`}
                className={cn(
                  "rounded px-1 py-0.5",
                  w.ok ? "text-ink" : "bg-danger/12 font-semibold text-danger",
                )}
              >
                {w.word}{" "}
              </span>
            ))
          : reading.text}
      </p>

      {!supported ? (
        <p className="mt-6 flex gap-3 rounded-xl border border-warning/30 bg-warning/8 p-4 text-sm leading-relaxed text-ink-soft">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" />
          This browser cannot listen. Reading practice needs Chrome, Edge or Safari — Firefox
          does not support speech recognition.
        </p>
      ) : insecure ? (
        <p className="mt-6 flex gap-3 rounded-xl border border-warning/30 bg-warning/8 p-4 text-sm leading-relaxed text-ink-soft">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" />
          The microphone only works over a secure connection. Open this page on{" "}
          <strong>localhost</strong> or over <strong>https</strong> — a plain address like
          http://192.168.1.5:3000 will fail the moment you press record.
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="mt-6 rounded-xl border border-danger/25 bg-danger/8 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      ) : null}

      {/* ---- Result ---------------------------------------------------- */}
      {score ? (
        <div className="mt-7 rounded-2xl border border-line bg-surface-2 p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Eyebrow>
                {score.matched} of {score.total} words came through
              </Eyebrow>
              <p className="tabular mt-2 font-display text-[2.75rem] leading-none tracking-[-0.04em]">
                {score.accuracy}%
              </p>
            </div>
            <Badge
              className={
                score.accuracy >= 90
                  ? "border-success/25 bg-success/10 text-success"
                  : score.accuracy >= 70
                    ? "border-warning/25 bg-warning/10 text-warning"
                    : "border-danger/25 bg-danger/10 text-danger"
              }
            >
              {score.accuracy >= 90 ? "Clear" : score.accuracy >= 70 ? "Almost" : "Try again"}
            </Badge>
          </div>

          <div className="mt-4">
            <SegmentBar value={score.accuracy} tone={tone} />
          </div>

          {transcript ? (
            <div className="mt-5">
              <p className="index text-muted">What I heard</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft italic">{transcript}</p>
            </div>
          ) : null}

          <p className="mt-5 text-xs leading-relaxed text-muted">
            This checks the words, not the accent. A word in red means it did not come through —
            usually too quiet, too fast, or a different word.
          </p>
        </div>
      ) : null}

      {/* ---- Controls --------------------------------------------------- */}
      <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
        {phase === "listening" ? (
          <Button size="lg" variant="danger" className="flex-1" onClick={stop}>
            <Square className="size-4" />
            Stop and check
          </Button>
        ) : (
          <Button size="lg" className="flex-1" onClick={start} disabled={!supported || insecure}>
            <Mic className="size-4" />
            {score ? "Read it again" : "Start reading"}
          </Button>
        )}

        {score ? (
          <Button size="lg" variant="secondary" onClick={reset}>
            <RotateCcw className="size-4" />
            Clear
          </Button>
        ) : null}
      </div>

      {phase === "listening" ? (
        <p className="index mt-4 flex items-center gap-2 text-danger">
          <span className="size-2 animate-pulse rounded-full bg-danger" />
          Listening — take your time, then press stop
        </p>
      ) : null}

      {/* ---- Passage navigation ----------------------------------------- */}
      <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-5">
        <Button
          size="sm"
          variant="secondary"
          disabled={index === 0}
          onClick={() => go(index - 1)}
        >
          <ArrowLeft className="size-4" />
          Previous
        </Button>
        <span className="index text-muted">Level {reading.level}</span>
        <Button
          size="sm"
          variant="secondary"
          disabled={index === passages.length - 1}
          onClick={() => go(index + 1)}
        >
          Next
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
