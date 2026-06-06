# Architecture

The retention surface has three proof lanes:

1. TypeScript builds the executive-facing scorecard and static page.
2. Ruby validates the retention segment scoring shape.
3. SQL exposes segment risk and board-retention posture views.

The public page is generated from `fixtures/retention-ledger.json` by `scripts/prerender.ts`.
