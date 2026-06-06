module RetentionScore
  module_function

  def score(segment)
    raw =
      segment.fetch(:shopify_revenue_at_risk) * 0.00012 +
      segment.fetch(:klaviyo_flow_gap_days) * 0.85 +
      segment.fetch(:repeat_purchase_decay) * 1.05 +
      segment.fetch(:discount_leak_percent) * 2 +
      segment.fetch(:deliverability_risk) * 0.9 +
      segment.fetch(:inventory_mismatch_count) * 3.8

    [[raw, 0].max, 100].min.round(2)
  end

  def posture(score)
    return "recover" if score >= 72
    return "watch" if score >= 38

    "healthy"
  end
end
