/**
 * Minimal typings for the Web Speech API. TypeScript's DOM library still does
 * not ship them, and only the handful of members used here are declared.
 */
export interface SpeechAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: ((event: SpeechErrorEvent) => void) | null;
  onend: (() => void) | null;
}

export interface SpeechResultEvent {
  resultIndex: number;
  results: ArrayLike<ArrayLike<SpeechAlternative> & { isFinal: boolean }>;
}

export interface SpeechErrorEvent {
  error: string;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

/** Null on Firefox and anywhere else without the API. */
export function getSpeechRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** Human-readable reason, so the UI never shows a bare error code. */
export function describeSpeechError(code: string): string {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "The microphone is blocked. Allow it in your browser and try again.";
    case "no-speech":
      return "I didn't hear anything. Try again a little louder.";
    case "audio-capture":
      return "No microphone found. Check that one is connected.";
    case "network":
      return "Speech recognition needs a connection and it could not reach the service.";
    case "aborted":
      return "Recording stopped.";
    default:
      return "Recording failed. Try again.";
  }
}
