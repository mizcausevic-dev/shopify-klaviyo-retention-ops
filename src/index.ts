export interface RetentionSegment {
  segmentId: string;
  owner: string;
  shopifyRevenueAtRisk: number;
  klaviyoFlowGapDays: number;
  repeatPurchaseDecay: number;
  discountLeakPercent: number;
  deliverabilityRisk: number;
  inventoryMismatchCount: number;
  nextAction: string;
}

export interface RetentionInput {
  estate: string;
  segments: RetentionSegment[];
}

export interface RetentionFinding extends RetentionSegment {
  retentionRiskScore: number;
  posture: "recover" | "watch" | "healthy";
  boardNarrative: string;
}

export interface RetentionSummary {
  estate: string;
  aggregateRetentionRisk: number;
  recoverSegments: number;
  revenueAtRisk: number;
  findings: RetentionFinding[];
  primaryRecommendation: string;
}

const clamp = (value: number) => Math.max(0, Math.min(100, value));

export function scoreSegment(segment: RetentionSegment): number {
  const raw =
    segment.shopifyRevenueAtRisk * 0.00012 +
    segment.klaviyoFlowGapDays * 0.85 +
    segment.repeatPurchaseDecay * 1.05 +
    segment.discountLeakPercent * 2 +
    segment.deliverabilityRisk * 0.9 +
    segment.inventoryMismatchCount * 3.8;
  return Number(clamp(raw).toFixed(2));
}

export function postureFor(score: number): RetentionFinding["posture"] {
  if (score >= 72) return "recover";
  if (score >= 38) return "watch";
  return "healthy";
}

export function buildRetentionSummary(input: RetentionInput): RetentionSummary {
  const findings = input.segments
    .map((segment) => {
      const retentionRiskScore = scoreSegment(segment);
      const posture = postureFor(retentionRiskScore);
      return {
        ...segment,
        retentionRiskScore,
        posture,
        boardNarrative: `${segment.segmentId} is ${posture} because Shopify revenue exposure, Klaviyo flow gaps, repeat decay, discount leakage, and deliverability risk resolve into a ${retentionRiskScore} retention risk score.`
      };
    })
    .sort((a, b) => b.retentionRiskScore - a.retentionRiskScore);

  const aggregateRetentionRisk = Number(
    (findings.reduce((total, segment) => total + segment.retentionRiskScore, 0) / Math.max(1, findings.length)).toFixed(2)
  );
  const recoverSegments = findings.filter((segment) => segment.posture === "recover").length;
  const revenueAtRisk = findings.reduce((total, segment) => total + segment.shopifyRevenueAtRisk, 0);
  const primaryRecommendation = findings[0]?.nextAction ?? "No retention segments were supplied.";
  return { estate: input.estate, aggregateRetentionRisk, recoverSegments, revenueAtRisk, findings, primaryRecommendation };
}
