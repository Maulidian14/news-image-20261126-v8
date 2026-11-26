// Build script (run in the agent session, NOT in the grading sandbox):
// screenshots page.html at 1024x1024 with the system Chromium and writes entry.png.
// The entrypoint main.ts only copies the shipped entry.png, so grading needs no browser.
import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const page = join(here, "page.html");
const out = join(here, "entry.png");
const chrome = "/home/hatch/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome";

if (!existsSync(chrome)) throw new Error("chromium not found at " + chrome);
execFileSync(chrome, [
  "--headless", "--disable-gpu", "--no-sandbox",
  "--screenshot=" + out, "--window-size=1024,1024", "--hide-scrollbars",
  "--force-device-scale-factor=1",
  "file://" + page,
], { stdio: "inherit", timeout: 120000 });

const size = statSync(out).size;
if (size > 1048576) throw new Error("entry.png over 1 MiB: " + size);
console.log("entry.png:", size, "bytes");
