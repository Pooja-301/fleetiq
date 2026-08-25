/**
 * FleetIQ — Explanation Engine (Phase 4-lite)
 *
 * Takes a riskEngine breakdown and generates human-readable explanation
 * drivers + recommendation — matching the exact shape the frontend expects
 * (explanation.drivers[], explanation.summary, recommendation.*).
 *
 * This is rule-based narrative generation — no LLM needed for Phase 2/4-lite.
 * Swap generateSummary() and generateRecommendation() with LLM calls in Phase 4.
 */

'use strict';

// ─── Explanation Driver Builder ───────────────────────────────────────────────

/**
 * Convert a riskEngine breakdown into explanation.drivers[]
 * matching the frontend's { label, weight, direction } shape.
 */
function buildDrivers(breakdown) {
  return breakdown
    .filter((d) => d.contribution > 0)
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 5)
    .map((d) => ({
      label:     d.label,
      weight:    parseFloat((d.contribution / 100).toFixed(2)),
      direction: d.rawScore >= 50 ? 'increases' : 'decreases',
    }));
}

// ─── Summary Templates ────────────────────────────────────────────────────────

function generateSummary(vehicle, riskScore, breakdown) {
  const topRisk = [...breakdown].sort((a, b) => b.contribution - a.contribution)[0];
  const level   = riskScore >= 60 ? 'high' : riskScore >= 30 ? 'moderate' : 'low';

  const intros = {
    high:     `This vehicle has a high failure probability (risk score ${riskScore}/100).`,
    moderate: `This vehicle carries moderate risk (risk score ${riskScore}/100).`,
    low:      `This vehicle is in good health (risk score ${riskScore}/100).`,
  };

  const topLabel = topRisk?.dimension ?? 'overall condition';
  const topDetail = topRisk?.rawScore >= 70
    ? `The most significant driver is ${topLabel} — immediate attention may be required.`
    : topRisk?.rawScore >= 40
    ? `The leading factor is ${topLabel}, which is trending but not yet critical.`
    : `No single factor is dominant — vehicle is generally well-maintained.`;

  const overdueNote = vehicle.nextMaintenanceIn?.toLowerCase().includes('overdue')
    ? ' Overdue maintenance compounds all component risks significantly.'
    : '';

  return `${intros[level]} ${topDetail}${overdueNote}`;
}

// ─── Recommendation Templates ─────────────────────────────────────────────────

function generateRecommendation(vehicle, riskScore, breakdown) {
  const overdue = vehicle.nextMaintenanceIn?.toLowerCase().includes('overdue');
  const criticalComponents = breakdown
    .filter((d) => ['engine', 'brakes', 'tyres', 'battery'].includes(d.dimension) && d.rawScore >= 70)
    .map((d) => d.dimension);

  if (riskScore >= 60) {
    // HIGH risk
    const steps = [
      overdue ? `Complete the overdue ${vehicle.nextMaintenance ? 'service inspection' : 'maintenance'} immediately` : null,
      criticalComponents.includes('engine')  ? 'Run full engine diagnostics and coolant system check' : null,
      criticalComponents.includes('brakes')  ? 'Inspect and replace brake components before next trip' : null,
      criticalComponents.includes('tyres')   ? 'Measure tread depth on all tyres — replace if below threshold' : null,
      criticalComponents.includes('battery') ? 'Load-test battery and replace if below 70% capacity' : null,
      `Return vehicle to service only after sign-off from ${vehicle.depot || 'depot'} workshop`,
    ].filter(Boolean);

    return {
      action:            'Remove from rotation — urgent workshop inspection required',
      window:            'Within 24 hours',
      priority:          'immediate',
      estimatedCost:     estimateCost(vehicle, riskScore),
      estimatedDowntime: '2–3 days',
      rationale:         `Risk score of ${riskScore}/100 places this vehicle in the highest priority band. Deferring increases breakdown probability on active routes.`,
      steps,
    };
  }

  if (riskScore >= 30) {
    // MEDIUM risk
    const nextDate = vehicle.nextMaintenance
      ? new Date(vehicle.nextMaintenance).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : 'next scheduled date';

    const steps = [
      `Address flagged components at the ${nextDate} service`,
      criticalComponents.includes('tyres')   ? 'Rotate or replace tyres showing abnormal wear' : null,
      criticalComponents.includes('brakes')  ? 'Inspect brake pads — replace if below safety threshold' : null,
      criticalComponents.includes('battery') ? 'Monitor battery — replace if slow-crank events recur' : null,
      'Log telemetry weekly until next service visit',
    ].filter(Boolean);

    return {
      action:            'Monitor closely and address at next scheduled service',
      window:            `By ${nextDate}`,
      priority:          'high',
      estimatedCost:     estimateCost(vehicle, riskScore),
      estimatedDowntime: 'Under 1 day',
      rationale:         `Risk score of ${riskScore}/100 indicates developing issues. No immediate route change required but proactive action at the next service window will prevent escalation.`,
      steps,
    };
  }

  // LOW risk
  return {
    action:            'Continue standard maintenance calendar',
    window:            vehicle.nextMaintenanceIn
      ? `Next service ${vehicle.nextMaintenanceIn.replace(/^In\s+/i, 'in ')}`
      : 'Next scheduled service',
    priority:          'planned',
    estimatedCost:     estimateCost(vehicle, riskScore),
    estimatedDowntime: 'Under 4 hours',
    rationale:         `Risk score of ${riskScore}/100 — all subsystems within acceptable limits. No condition-based intervention indicated.`,
    steps:             ['Keep the next scheduled service slot', 'Continue routine telemetry monitoring'],
  };
}

// ─── Cost Estimator ───────────────────────────────────────────────────────────

function estimateCost(vehicle, riskScore) {
  // Very rough base by vehicle type
  const baseCost = {
    'Heavy Truck':    60000,
    'Rigid Truck':    35000,
    'Light Truck':    18000,
    'Mini Truck':     12000,
    'Utility Pickup': 14000,
  }[vehicle.type] ?? 25000;

  // Scale by risk severity
  const multiplier = riskScore >= 60 ? 1.6 : riskScore >= 30 ? 1.1 : 0.5;
  return Math.round(baseCost * multiplier / 100) * 100;
}

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * buildExplanation(vehicle, scoreResult) → { explanation, recommendation }
 *
 * Returns objects matching the frontend's expected shape exactly.
 */
function buildExplanation(vehicle, scoreResult) {
  const { riskScore, breakdown } = scoreResult;

  const explanation = {
    summary:       generateSummary(vehicle, riskScore, breakdown),
    drivers:       buildDrivers(breakdown),
    confidence:    Math.min(0.95, 0.60 + riskScore / 300),
    modelVersion:  'rule-v1.0',
    evaluatedAt:   new Date().toISOString(),
  };

  const recommendation = generateRecommendation(vehicle, riskScore, breakdown);

  return { explanation, recommendation };
}

module.exports = { buildExplanation };
