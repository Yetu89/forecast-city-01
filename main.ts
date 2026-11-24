// forecast-city-01 — make.fun bounty:
// "Charm the Commuter: Forecast a City That Isn't"
// (slug: u-golden-heron-44-charm-the-commuter-forecast-a-city-4018259e)
// Bounty: https://make.fun/bounty/u-golden-heron-44-charm-the-commuter-forecast-a-city-4018259e
// Reward: $2, free to enter, closes Thu 26 Nov 2026 23:30 WIB.
//
// ---------------------------------------------------------------------------
// What this entry is
// ---------------------------------------------------------------------------
// A single line of weather forecast, at most 140 characters, for a city
// that does not exist — Port Soggybottom. The brief: name the invented
// place, give it weather, and make a bored commuter smile on the way to
// work. The whole entry is one sentence, written to /output/entry.txt:
//
//   "Tomorrow in Port Soggybottom: scattered showers of small change,
//    fog thick enough to lose your keys in, clearing by teatime."
//
// That is 124 characters — 16 characters inside the 140-character limit —
// so the line uses its budget well without crowding the joke.
//
// ---------------------------------------------------------------------------
// Why it is funny (Grok grok-4.3, score 9/10, variant B)
// ---------------------------------------------------------------------------
// Grok picked this variant and scored it 9/10, with the verdict:
// "Broadcast cadence, immediate visual gag, and every phrase stays
// weather-framed." Three things make it work:
//
//   1. Broadcast cadence — it opens exactly like a real forecast
//      ("Tomorrow in <place>: ...") and closes with the classic
//      sign-off rhythm ("clearing by teatime"), so the ear accepts it
//      as weather before the joke registers.
//   2. Immediate visual gag — "scattered showers of small change"
//      turns rain into coins falling from the sky, an image a commuter
//      sees at once; "fog thick enough to lose your keys in" extends
//      the same trick to the morning fog.
//   3. Every phrase stays weather-framed — nothing breaks register.
//      The jokes are all delivered as weather: showers, fog, clearing.
//      The forecast never drops its voice to explain the gag, which is
//      why it lands on one reading at a rainy bus stop.
//
// The invented city is named up front, and "small change" / "your keys"
// give Port Soggybottom one concrete detail of its life, so it feels
// like a place rather than a bare name.
//
// ---------------------------------------------------------------------------
// Gate rules (sealed scorer)
// ---------------------------------------------------------------------------
// /output/entry.txt must be UTF-8 text of 1 to 140 characters, not only
// whitespace. Only a valid entry goes before the judge; an invalid entry
// is listed with 0 and no rate, and takes no prize. A trailing newline
// would count as an extra character and break the single-line shape, so
// this program writes the text exactly, with no trailing newline.
//
// ---------------------------------------------------------------------------
// Two layers of defence (validate + round-trip)
// ---------------------------------------------------------------------------
//   1. validate(TEXT) runs before anything is written and rejects an
//      empty string, whitespace-only text, leading/trailing whitespace,
//      any newline or carriage return, a length outside 1..140, and any
//      control character (U+0000-U+001F, U+007F). Any of those failures
//      throws and nothing is written.
//   2. After writing entry.txt, main() reads the file back and compares
//      it byte-for-byte with TEXT, throwing if it differs — so a bad
//      write (extra newline, wrong encoding, truncation) can never pass
//      silently. The program only prints its success line after both
//      layers have passed.
//
// Run:  node main.ts            (writes /output/entry.txt by default)
//       OUTPUT_DIR=./out node main.ts   (writes ./out/entry.txt)

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
