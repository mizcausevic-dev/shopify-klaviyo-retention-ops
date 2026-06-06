create or replace view commerce.retention_segment_risk as
with scored as (
  select
    segment_id,
    owner,
    shopify_revenue_at_risk,
    klaviyo_flow_gap_days,
    repeat_purchase_decay,
    discount_leak_percent,
    deliverability_risk,
    inventory_mismatch_count,
    least(
      100,
      shopify_revenue_at_risk * 0.00012
        + klaviyo_flow_gap_days * 0.85
        + repeat_purchase_decay * 1.05
        + discount_leak_percent * 2
        + deliverability_risk * 0.9
        + inventory_mismatch_count * 3.8
    ) as retention_risk_score
  from commerce.raw_retention_segments
)
select
  segment_id,
  owner,
  shopify_revenue_at_risk,
  klaviyo_flow_gap_days,
  repeat_purchase_decay,
  discount_leak_percent,
  deliverability_risk,
  inventory_mismatch_count,
  retention_risk_score,
  case
    when retention_risk_score >= 72 then 'recover'
    when retention_risk_score >= 38 then 'watch'
    else 'healthy'
  end as retention_posture
from scored;

create or replace view commerce.board_retention_posture as
select
  retention_posture,
  count(*) as segment_count,
  sum(shopify_revenue_at_risk) as revenue_at_risk,
  avg(retention_risk_score) as average_retention_risk
from commerce.retention_segment_risk
group by retention_posture;
