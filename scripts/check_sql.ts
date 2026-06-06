import { readFileSync } from "node:fs";

const sql = readFileSync("sql/retention_risk_views.sql", "utf8");
const required = ["commerce.retention_segment_risk", "commerce.board_retention_posture", "retention_risk_score", "retention_posture", "raw_retention_segments"];
const missing = required.filter((marker) => !sql.includes(marker));
if (missing.length > 0) {
  throw new Error(`SQL contract missing: ${missing.join(", ")}`);
}
console.log("sql contract ok");
