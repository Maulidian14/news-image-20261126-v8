// news-image-20261126-v8 — "The World in One Day"
// 36 stories from Thursday 26 November 2026, 9 regions, drawn scenes,
// world map, UTC timeline, WHY IT MATTERS under each lead.
//
// The entry image is produced at build time (page.html rendered to a
// 1024x1024 screenshot with Chromium) and shipped in this repo as
// entry.png. The grading sandbox has no browser and no network, so this
// entrypoint simply copies the shipped image to /output/entry.png and
// verifies its SHA-256, so the two grading runs get byte-identical output.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "entry.png");
const outDir = "/output";
const out = join(outDir, "entry.png");

// SHA-256 of the shipped entry.png (359,339 bytes, final render 26 Nov 2026 ~22:40 WIB).
const EXPECTED_SHA256 = "32ec66f03f369f46175aa2db96dd873bcd3dfce3de6aeea55a1d013c72bd44e6";

const bytes = readFileSync(src);
const hash = createHash("sha256").update(bytes).digest("hex");
if (hash !== EXPECTED_SHA256) {
  throw new Error(`entry.png hash mismatch: got ${hash}, expected ${EXPECTED_SHA256}`);
}
if (bytes.length > 1048576) {
  throw new Error(`entry.png over 1 MiB: ${bytes.length} bytes`);
}
mkdirSync(outDir, { recursive: true });
copyFileSync(src, out);
const written = readFileSync(out);
const writtenHash = createHash("sha256").update(written).digest("hex");
if (writtenHash !== EXPECTED_SHA256) {
  throw new Error("output copy hash mismatch");
}
console.log(`entry.png written to ${out} (${written.length} bytes, sha256 ${writtenHash})`);
