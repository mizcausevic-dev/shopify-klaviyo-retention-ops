import { readFileSync } from "node:fs";
import { buildRetentionSummary, type RetentionInput } from "./index.js";

const path = process.argv[2] ?? "fixtures/retention-ledger.json";
const input = JSON.parse(readFileSync(path, "utf8")) as RetentionInput;
console.log(JSON.stringify(buildRetentionSummary(input), null, 2));
