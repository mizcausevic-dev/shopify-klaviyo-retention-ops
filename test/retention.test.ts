import { describe, expect, it } from "vitest";
import fixture from "../fixtures/retention-ledger.json" with { type: "json" };
import { buildRetentionSummary, postureFor, scoreSegment } from "../src/index.js";

describe("shopify klaviyo retention ops", () => {
  it("prioritizes the first-purchase no-second-order segment", () => {
    const summary = buildRetentionSummary(fixture);
    expect(summary.findings[0].segmentId).toBe("first-purchase-no-second-order");
    expect(summary.findings[0].posture).toBe("recover");
    expect(summary.recoverSegments).toBe(2);
  });

  it("scores deterministic retention posture", () => {
    expect(postureFor(72)).toBe("recover");
    expect(postureFor(38)).toBe("watch");
    expect(postureFor(12)).toBe("healthy");
    expect(scoreSegment(fixture.segments[2])).toBeLessThan(scoreSegment(fixture.segments[1]));
  });
});
