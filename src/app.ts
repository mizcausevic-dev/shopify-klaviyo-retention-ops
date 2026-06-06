import express from "express";
import { readFileSync } from "node:fs";
import { buildRetentionSummary, type RetentionInput } from "./index.js";

export function renderPage(input: RetentionInput): string {
  const summary = buildRetentionSummary(input);
  const cards = summary.findings
    .map(
      (segment) => `<article class="segment ${segment.posture}"><span>${segment.posture}</span><h3>${segment.segmentId}</h3><p>${segment.boardNarrative}</p><dl><div><dt>Risk</dt><dd>${segment.retentionRiskScore}</dd></div><div><dt>Revenue</dt><dd>$${segment.shopifyRevenueAtRisk}</dd></div><div><dt>Gap</dt><dd>${segment.klaviyoFlowGapDays}d</dd></div></dl><strong>${segment.nextAction}</strong></article>`
    )
    .join("");

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Shopify Klaviyo Retention Ops</title><meta name="description" content="Shopify and Klaviyo retention operations surface for margin leaks, cohort decay, lifecycle gaps, and offer sequencing."/><style>:root{--bg:#050812;--panel:#0d1727;--text:#f4f1ea;--muted:#a8b3c7;--cyan:#25d7ef;--pink:#ff72b6;--green:#58f0b3;--line:rgba(37,215,239,.24)}*{box-sizing:border-box}body{margin:0;font-family:"Segoe UI",sans-serif;color:var(--text);background:radial-gradient(circle at 86% 14%,rgba(255,114,182,.14),transparent 31rem),radial-gradient(circle at 12% 22%,rgba(88,240,179,.13),transparent 34rem),var(--bg)}main{width:min(1180px,calc(100% - 40px));margin:0 auto;padding:56px 0}.hero{border:1px solid var(--line);border-radius:28px;padding:clamp(28px,5vw,64px);background:linear-gradient(135deg,rgba(13,23,39,.96),rgba(8,11,24,.92))}.kicker{color:var(--green);font-family:Consolas,monospace;font-size:.78rem;letter-spacing:.18em;text-transform:uppercase}h1{max-width:1030px;margin:18px 0;font-size:clamp(3rem,7.8vw,6.55rem);line-height:.92;letter-spacing:-.075em}.lede{max-width:810px;color:var(--muted);font-size:1.24rem;line-height:1.7}.metrics,.grid{display:grid;gap:16px}.metrics{grid-template-columns:repeat(4,1fr);margin-top:34px}.metric,.segment{background:rgba(13,23,39,.9);border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:22px}.metric small,dt{color:var(--muted);text-transform:uppercase;letter-spacing:.12em;font-size:.75rem}.metric b{display:block;margin-top:10px;font-size:2rem}.grid{grid-template-columns:repeat(3,1fr);margin-top:22px}.segment{min-height:340px}.segment span{color:var(--cyan);font-family:Consolas,monospace;text-transform:uppercase;letter-spacing:.14em;font-size:.76rem}.segment.recover{border-color:rgba(255,114,182,.45)}.segment.watch{border-color:rgba(255,209,102,.38)}h3{font-size:1.42rem;margin:12px 0 10px}p{color:var(--muted);line-height:1.6}dl{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:18px 0}dd{margin:5px 0 0;font-size:1.1rem;font-weight:800}strong{color:var(--text)}footer{margin-top:34px;color:var(--muted);font-family:Consolas,monospace}@media(max-width:900px){.metrics,.grid,dl{grid-template-columns:1fr}}</style></head><body><main><section class="hero"><div class="kicker">E-commerce / Ruby + TypeScript + SQL</div><h1>Retention leakage becomes visible before discounts erase margin.</h1><p class="lede">Shopify Klaviyo Retention Ops turns revenue exposure, lifecycle gaps, cohort decay, discount leakage, deliverability risk, and inventory mismatch into one revenue-safe operating surface.</p><div class="metrics"><div class="metric"><small>Aggregate risk</small><b>${summary.aggregateRetentionRisk}</b></div><div class="metric"><small>Recover segments</small><b>${summary.recoverSegments}</b></div><div class="metric"><small>Revenue at risk</small><b>$${summary.revenueAtRisk}</b></div><div class="metric"><small>Segments tracked</small><b>${summary.findings.length}</b></div></div></section><section class="grid">${cards}</section><footer>Primary recommendation: ${summary.primaryRecommendation}</footer></main></body></html>`;
}

export function createApp() {
  const app = express();
  const input = JSON.parse(readFileSync("fixtures/retention-ledger.json", "utf8")) as RetentionInput;
  app.get("/", (_req, res) => res.type("html").send(renderPage(input)));
  app.get("/api/retention", (_req, res) => res.json(buildRetentionSummary(input)));
  return app;
}

if (process.argv[1]?.endsWith("app.js")) {
  createApp().listen(4173, () => console.log("shopify-klaviyo-retention-ops listening on http://localhost:4173"));
}
