/**
 * FleetIQ — Rule-Based Risk Engine (Phase 2)
 *
 * Transparent, explainable scoring — every rule is a plain English condition
 * that an engineer or judge can read and verify directly.
 *
 * Score range: 0–100  (higher = more risk)
 * Bands: low < 30 | medium 30–59 | high >= 60
 */

'use strict';

// ─── Rule Weights ────────────────────────────────────────────────────────────
const WEIGHTS = {
  engine:      0.28,   // Engine health has highest single-component impact
  brakes:      0.25,   // Safety-critical; weighted heavily
  tyres:       0.17,   // Important but replaceable quickly
  battery:     0.10,   // Lower weight — rarely causes on-road breakdown
  mileage:     0.08,   // Long-life vehicles accumulate hidden wear
  overdue:     0.12,   // Missed service window compounds all other risks
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Convert a component health score (0–100, higher = healthier)
 * to a risk contribution (0–100, higher = riskier).
 */
function invertHealth(score) {
  return Math.max(0, Math.min(100, 100 - score));
}

/**
 * Clamp a value to [0, 100].
 */
function clamp(v) {
  return Math.max(0, Math.min(100, v));
}

/**
 * Parse a nextMaintenanceIn string and return a risk score.
 * "Overdue" → 100, "In N days" → scales from 0 (>60 days) to 80 (<3 days).
 */
function maintenanceDueScore(nextMaintenanceIn = '') {
  const str = nextMaintenanceIn.toLowerCase();
  if (str.includes('overdue')) return 100;
  const match = str.match(/in\s+(\d+)\s+day/);
  if (match) {
    const days = parseInt(match[1], 10);
    if (days <= 3)  return 80;
    if (days <= 7)  return 55;
    if (days <= 14) return 35;
    if (days <= 30) return 15;
    return 0;
  }
  return 0; // unknown / not parseable → neutral
}

/**
 * Mileage risk: vehicles over 400 000 km accumulate structural fatigue.
 * Scales linearly from 0 (at 0 km) to 100 (at 600 000 km), capped at 100.
 */
function mileageRiskScore(mileage = 0) {
  return clamp((mileage / 600_000) * 100);
}

// ─── Core Scorer ─────────────────────────────────────────────────────────────

/**
 * scoreVehicle(vehicle) → { riskScore, riskLevel, breakdown, computedAt }
 *
 * @param {Object} vehicle  A plain vehicle object (matches Mongoose model shape)
 * @returns {Object}
 */
function scoreVehicle(vehicle) {
  const getComp = (key) =>
    vehicle.components?.find((c) => c.key === key)?.score ?? 50;

  // Raw risk contributions per dimension (0–100 each)
  const raw = {
    engine:  invertHealth(getComp('engine')),
    brakes:  invertHealth(getComp('brakes')),
    tyres:   invertHealth(getComp('tyres')),
    battery: invertHealth(getComp('battery')),
    mileage: mileageRiskScore(vehicle.mileage),
    overdue: maintenanceDueScore(vehicle.nextMaintenanceIn),
  };

  // Weighted sum → final risk score
  const riskScore = Math.round(
    Object.entries(WEIGHTS).reduce((sum, [key, w]) => sum + raw[key] * w, 0)
  );

  // Band classification
  const riskLevel =
    riskScore >= 60 ? 'high' :
    riskScore >= 30 ? 'medium' : 'low';

  // Breakdown: each dimension with its contribution to the total
  const breakdown = Object.entries(WEIGHTS).map(([key, weight]) => ({
    dimension:    key,
    rawScore:     Math.round(raw[key]),
    weight,
    contribution: Math.round(raw[key] * weight),
    label:        dimensionLabel(key, raw[key], vehicle),
  }));

  return {
    riskScore,
    riskLevel,
    breakdown,
    computedAt: new Date().toISOString(),
    engineVersion: 'rule-v1.0',
  };
}

// ─── Human Labels ─────────────────────────────────────────────────────────────

function dimensionLabel(key, rawScore, vehicle) {
  const severity = rawScore >= 70 ? '[HIGH]' : rawScore >= 40 ? '[MODERATE]' : '[OK]';
  switch (key) {
    case 'engine':
      return `Engine health ${100 - Math.round(rawScore)}% ${severity}`;
    case 'brakes':
      return `Brake health ${100 - Math.round(rawScore)}% ${severity}`;
    case 'tyres':
      return `Tyre health ${100 - Math.round(rawScore)}% ${severity}`;
    case 'battery':
      return `Battery health ${100 - Math.round(rawScore)}% ${severity}`;
    case 'mileage':
      return `Odometer ${(vehicle.mileage || 0).toLocaleString('en-IN')} km ${severity}`;
    case 'overdue':
      return `Maintenance: ${vehicle.nextMaintenanceIn || 'unknown'} ${severity}`;
    default:
      return key;
  }
}

module.exports = { scoreVehicle };
