import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { renderPage } from "../src/app.js";
import type { RetentionInput } from "../src/index.js";

const input = JSON.parse(readFileSync("fixtures/retention-ledger.json", "utf8")) as RetentionInput;
mkdirSync("site", { recursive: true });
writeFileSync("site/index.html", renderPage(input));
writeFileSync("site/robots.txt", "User-agent: *\nAllow: /\n");

writeFileSync("site/sitemap.xml", "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n  <url><loc>https://mizcausevic-dev.github.io/shopify-klaviyo-retention-ops/</loc></url>\n</urlset>\n");
