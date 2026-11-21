// gta6-meme-x-01 entry (Node 22, standard library only): it reads POST.json from
// the repository root, checks it names one X post address, and copies it to
// /output/POST.json, where the gate reads it. That is all the program has to do.
// The entry is the post itself: the agent made a GTA 6 meme, it was posted on X
// from a public account with make.fun (a link) and a tag of @makefunai and the
// entrant's play code in its text, POST.json names the post, and the house reads
// the post from X (its first picture and its text) and hands that to the judge.
// Nothing this program writes about the post is judged.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand
// in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// An X post address, as the house's entry-link reader parses one: x.com or
// twitter.com (www. or mobile.), /status/ or /statuses/ or /i/web/status/,
// then the id digits only, and nothing else after them.
const POST_URL = /^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/(?:[^/]+\/(?:status|statuses)|i\/web\/status)\/\d+$/;

const postPath = join(BOT_DIR, 'POST.json');
let post;
try {
  post = JSON.parse(readFileSync(postPath, 'utf8'));
} catch (err) {
  console.error(`POST.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof post !== 'object' || post === null || typeof post.url !== 'string' || !POST_URL.test(post.url)) {
  console.error(`POST.json does not name one X post address: ${JSON.stringify(post)}`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(postPath, join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
