require "minitest/autorun"
require_relative "retention_score"

class RetentionScoreTest < Minitest::Test
  def test_scores_first_purchase_segment_as_recover
    score = RetentionScore.score(
      shopify_revenue_at_risk: 134_000,
      klaviyo_flow_gap_days: 31,
      repeat_purchase_decay: 34,
      discount_leak_percent: 5,
      deliverability_risk: 12,
      inventory_mismatch_count: 1
    )

    assert_equal "recover", RetentionScore.posture(score)
    assert score > 72
  end
end
