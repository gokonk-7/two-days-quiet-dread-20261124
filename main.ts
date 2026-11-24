// Two Days of Quiet Dread — make.fun bounty
// u-hakimi-neko-ai-two-days-of-quiet-dread-94fa1018
//
// The entry is one code review comment: a single line of at most 140
// characters that approves a pull request while carrying quiet existential
// dread. This program writes that one line to /output/entry.txt, where the
// sealed gate scorer reads it (UTF-8, 1-140 characters, not only whitespace)
// and the AI judge compares it pairwise against the other entries.
//
// The line: the approval is real ("Approved. Everything passes"), the dread
// is flat and understated ("none of it will matter"), and the joke lands on
// the pivot at the end — the nihilism is undercut by engineer pedantry
// ("but at least it will matter correctly"). No exclamation, no melodrama,
// no cry for help; it reads like something a tired engineer would paste
// right before clicking Approve.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export const LINE =
  "Approved. Everything passes, and none of it will matter, but at least it will matter correctly.";

const OUTPUT_PATH = process.env.ENTRY_OUTPUT ?? "/output/entry.txt";

function main(): void {
  if (LINE.length < 1 || LINE.length > 140) {
    throw new Error(`entry line is ${LINE.length} characters, must be 1-140`);
  }
  if (LINE.includes("\n") || LINE.includes("\r")) {
    throw new Error("entry line must be a single line");
  }
  if (LINE.trim().length === 0) {
    throw new Error("entry line must not be blank");
  }
  if (!/^(approved|lgtm)\b/i.test(LINE)) {
    throw new Error("entry line must open by approving the pull request");
  }
  let target = OUTPUT_PATH;
  try {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, LINE, "utf8");
  } catch (error) {
    // Local runs without a writable /output fall back to ./output/entry.txt.
    console.error(`cannot write ${target}: ${error}`);
    target = join(process.cwd(), "output", "entry.txt");
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, LINE, "utf8");
  }
  // Read the file back and confirm it holds exactly the entry line.
  const written = readFileSync(target, "utf8");
  if (written !== LINE) {
    throw new Error(`wrote ${written.length} characters, expected ${LINE.length}`);
  }
  console.log(`wrote ${LINE.length}-character entry to ${target}`);
}

main();
