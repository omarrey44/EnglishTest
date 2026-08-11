// Run with: node src/lib/readingScore.test.ts
import assert from "node:assert/strict";
import { scoreReading } from "./readingScore.ts";

const missed = (target: string, said: string) =>
  scoreReading(target, said)
    .words.filter((w) => !w.ok)
    .map((w) => w.word);

// Perfect read
{
  const s = scoreReading("I worked at a small studio.", "I worked at a small studio");
  assert.equal(s.accuracy, 100);
  assert.equal(s.matched, 6);
}

// Punctuation and case must not count against the reader
assert.equal(scoreReading("Later, in 2014, we married.", "later in 2014 we married").accuracy, 100);

// A skipped word must cost exactly one word, not everything after it.
// This is what index-by-index comparison would get wrong.
assert.deepEqual(missed("I did not go to the party", "I did go to the party"), ["not"]);

// Same for a skip near the start
assert.deepEqual(missed("She bought some fresh bread", "bought some fresh bread"), ["She"]);

// Extra words the reader adds should not break the alignment either
assert.deepEqual(missed("We need a lot of beds", "we need um a lot of beds"), []);

// A repeated word (stumbling) still reads as correct
assert.deepEqual(missed("How much furniture", "how how much furniture"), []);

// Genuinely wrong word is the only one marked
assert.deepEqual(missed("I would like some coffee", "I would like some tea"), ["coffee"]);

// Nothing said at all
{
  const s = scoreReading("Anything at all", "");
  assert.equal(s.accuracy, 0);
  assert.equal(s.matched, 0);
  assert.equal(s.total, 3);
}

// Empty passage must not divide by zero
assert.equal(scoreReading("", "hello").accuracy, 0);

// Word order matters: reversed input should not score full marks
assert.ok(scoreReading("the cat sat on the mat", "mat the on sat cat the").accuracy < 100);

console.log("readingScore: all checks passed");
