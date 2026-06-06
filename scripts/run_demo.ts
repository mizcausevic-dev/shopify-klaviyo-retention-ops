import { readFileSync } from "node:fs";
import { buildRetentionSummary, type RetentionInput } from "../src/index.js";

const input = JSON.parse(readFileSync("fixtures/retention-ledger.json", "utf8")) as RetentionInput;
const summary = buildRetentionSummary(input);
console.log(`estate=${summary.estate}`);
console.log(`risk=${summary.aggregateRetentionRisk}`);
console.log(`recover=${summary.recoverSegments}`);
console.log(`recommendation=${summary.primaryRecommendation}`);
