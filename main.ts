// forecast-city-01 — make.fun bounty:
// "Charm the Commuter: Forecast a City That Isn't"
// (slug: u-golden-heron-44-charm-the-commuter-forecast-a-city-4018259e)
//
// What this entry is: a single line of weather forecast, at most 140
// characters, for a city that does not exist — Port Soggybottom. It is
// written in the rhythm of a real broadcast forecast ("Tomorrow in ...:
// scattered showers ..., fog ..., clearing by teatime."), but every
// weather element is bent into a small commuter joke: the rain is small
// change, the fog is thick enough to lose your keys in, and it all
// clears up by teatime.
//
// Why it is funny (Grok grok-4.3, score 9/10, variant B): "Broadcast
// cadence, immediate visual gag, and every phrase stays weather-framed."
// The forecast register never drops — the gag lands inside the weather
// itself, so a bored commuter at a rainy bus stop smiles on one reading.
//
// Gate rules (sealed scorer): /output/entry.txt must be UTF-8 text of
// 1 to 140 characters, not only whitespace. Only a valid entry goes
// before the judge; an invalid entry scores 0 and takes no prize.
//
// Two layers of defence:
//   1. validate(TEXT) runs before anything is written and rejects an
//      empty string, whitespace-only text, leading/trailing whitespace,
//      any newline or carriage return, a length outside 1..140, and any
//      control character (U+0000-U+001F, U+007F).
//   2. After writing entry.txt, main() reads the file back and compares
//      it byte-for-byte with TEXT, throwing if it differs — so a bad
//      write (extra newline, wrong encoding, truncation) can never pass
//      silently.

import * as fs from "node:fs";
import * as path from "node:path";

const TEXT: string =
  "Tomorrow in Port Soggybottom: scattered showers of small change, fog thick enough to lose your keys in, clearing by teatime.";

function validate(text: string): void {
  if (text.length === 0) {
    throw new Error("entry is empty");
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (text !== text.trim()) {
    throw new Error("entry has leading or trailing whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line (no newline or carriage return)");
  }
  if (text.length < 1 || text.length > 140) {
    throw new Error(`entry length ${text.length} is outside 1..140 characters`);
  }
  for (const ch of text) {
    const code: number = ch.codePointAt(0) as number;
    if ((code >= 0x00 && code <= 0x1f) || code === 0x7f) {
      throw new Error(`entry contains a control character U+${code.toString(16).toUpperCase().padStart(4, "0")}`);
    }
  }
}

function main(): void {
  validate(TEXT);
  const outDir: string = process.env.OUTPUT_DIR ?? "/output";
  fs.mkdirSync(outDir, { recursive: true });
  const outPath: string = path.join(outDir, "entry.txt");
  fs.writeFileSync(outPath, TEXT, "utf8");
  const roundTrip: string = fs.readFileSync(outPath, "utf8");
  if (roundTrip !== TEXT) {
    throw new Error("round-trip mismatch: entry.txt does not match TEXT byte-for-byte");
  }
  console.log(`Wrote ${outPath} (${TEXT.length} characters)`);
}

main();
