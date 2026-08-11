// Run with: node src/lib/speak.test.ts
import assert from "node:assert/strict";
import { toSentences } from "./speak.ts";

// The whole point of chunking: a long passage must become several pieces.
assert.deepEqual(toSentences("One. Two! Three?"), ["One.", "Two!", "Three?"]);

// Punctuation stays with its sentence, so the voice keeps the intonation.
assert.deepEqual(toSentences("Hello there. How are you?"), ["Hello there.", "How are you?"]);

// A passage with no final stop must still come back whole
assert.deepEqual(toSentences("No final stop here"), ["No final stop here"]);

// Extra whitespace and newlines must not create empty utterances
assert.deepEqual(toSentences("First.   \n  Second."), ["First.", "Second."]);

// Empty input must not queue anything
assert.deepEqual(toSentences(""), []);
assert.deepEqual(toSentences("   "), []);

// A real passage from the app chunks into speakable pieces
const passage =
  "Last Saturday I woke up early and started my day slowly. First, I cleaned my room and washed all the windows. After that, I cooked breakfast for my family and we talked for almost an hour.";
const chunks = toSentences(passage);
assert.equal(chunks.length, 3);
assert.ok(chunks.every((c) => c.length < 120), "each chunk stays short enough for Chrome");

console.log("speak: all checks passed");
