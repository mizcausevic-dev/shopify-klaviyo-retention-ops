import { readFileSync } from "node:fs";

const html = readFileSync("site/index.html", "utf8");
const required = [
  "<title>Shopify Klaviyo Retention Ops</title>",
  "Retention leakage becomes visible before discounts erase margin.",
  "first-purchase-no-second-order",
  "vip-repeat-buyers"
];
const missing = required.filter((marker) => !html.includes(marker));
if (missing.length > 0) {
  throw new Error(`Smoke check missing: ${missing.join(", ")}`);
}
console.log("smoke ok");
