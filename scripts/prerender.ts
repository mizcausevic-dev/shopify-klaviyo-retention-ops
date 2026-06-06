import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { renderPage } from "../src/app.js";
import type { RetentionInput } from "../src/index.js";

const input = JSON.parse(readFileSync("fixtures/retention-ledger.json", "utf8")) as RetentionInput;
mkdirSync("site", { recursive: true });
writeFileSync("site/index.html", renderPage(input));
writeFileSync("site/robots.txt", "User-agent: *\nAllow: /\n");
