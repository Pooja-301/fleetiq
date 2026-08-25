/**
 * FleetIQ — What-If Risk Simulation Engine (Component 1)
 *
 * Runs counterfactual "what-if" scenarios over vehicle telemetry
 * without modifying the underlying MongoDB database record.
 */

'use strict';

const { scoreVehicle } = require('./riskEngine');

/**
 * simulateWhatIf(vehicle, params)
 *
 * @param {Object} vehicle - Original vehicle object from database
 * @param {Object} params - Simulation parameters
 *   @param {Array<string>} params.repairedComponents - ['engine', 'brakes', 'tyres', 'battery']
 *   @param {number} params.deferDays - Extra days to defer maintenance (0 to 30)
 *   @param {number} params.dailyKmAdjustment - Adjustment to avg daily km (-200 to +300)
 * @returns {Object} Simulation results with baseline vs simulated deltas and ROI
 */
function simulateWhatIf(vehicle, params = {}) {
  const {
    repairedComponents = [],
    deferDays = 0,
    dailyKmAdjustment = 0,
  } = params;

  // 1. Calculate Baseline
  const baselineScoreResult = scoreVehicle(vehicle);
  const baselineRiskScore = baselineScoreResult.riskScore;
  const baselineRiskLevel = baselineScoreResult.riskLevel;
  const baselineHealth = Math.max(1, 100 - baselineRiskScore);

  // Planned repair cost vs emergency on-road breakdown penalty (2.5x)
  const basePlannedCost = vehicle.recommendation?.estimatedCost || 45000;
  const emergencyBreakdownCost = Math.round(basePlannedCost * 2.6);
  const baselineExpectedExposure = Math.round((baselineRiskScore / 100) * emergencyBreakdownCost + (basePlannedCost * 0.4));

  // 2. Clone vehicle and apply simulated what-if modifications
  const simulatedVehicle = JSON.parse(JSON.stringify(vehicle));

  // A. Apply simulated component repairs (boost repaired components to 95% health)
  if (simulatedVehicle.components && Array.isArray(simulatedVehicle.components)) {
    simulatedVehicle.components = simulatedVehicle.components.map((c) => {
      if (repairedComponents.includes(c.key)) {
        return {
          ...c,
          score: 95,
          status: 'good',
          detail: `Simulated fresh replacement / overhaul (100% restored)`,
        };
      }
      return c;
    });
  }

  // B. Apply maintenance window deferral
  const originalOverdue = (vehicle.nextMaintenanceIn || '').toLowerCase().includes('overdue');
  if (deferDays > 0 || originalOverdue) {
    const extraOverdueDays = deferDays + (originalOverdue ? 5 : 0);
    simulatedVehicle.nextMaintenanceIn = `Overdue by ${extraOverdueDays} days`;
  } else if (repairedComponents.length > 0 && deferDays === 0) {
    simulatedVehicle.nextMaintenanceIn = `In 90 days (Fresh service window)`;
  }

  // C. Apply route load / daily km adjustment
  const currentDailyKm = vehicle.avgDailyKm || 200;
  const simulatedDailyKm = Math.max(50, currentDailyKm + dailyKmAdjustment);
  simulatedVehicle.avgDailyKm = simulatedDailyKm;
  simulatedVehicle.mileage = Math.round(vehicle.mileage + (dailyKmAdjustment > 0 ? dailyKmAdjustment * 30 : 0));

  // 3. Compute Simulated Risk Score
  const simScoreResult = scoreVehicle(simulatedVehicle);
  const simRiskScore = simScoreResult.riskScore;
  const simRiskLevel = simScoreResult.riskLevel;
  const simHealth = Math.max(1, 100 - simRiskScore);

  // 4. Compute Simulated Financial Exposure & Savings
  let simulatedRepairCost = 0;
  repairedComponents.forEach((comp) => {
    if (comp === 'engine') simulatedRepairCost += 42000;
    if (comp === 'brakes') simulatedRepairCost += 18000;
    if (comp === 'tyres') simulatedRepairCost += 22000;
    if (comp === 'battery') simulatedRepairCost += 9000;
  });

  const simExpectedExposure = Math.round((simRiskScore / 100) * emergencyBreakdownCost + simulatedRepairCost);
  const netFinancialBenefit = baselineExpectedExposure - simExpectedExposure;

  // 5. Generate Simulation Narrative
  let narrative = '';
  const riskDelta = simRiskScore - baselineRiskScore;

  if (riskDelta <= -20) {
    narrative = `Simulated intervention successfully reduces failure probability from ${baselineRiskScore}% to ${simRiskScore}% (▼ ${Math.abs(riskDelta)}% risk reduction). Net estimated breakdown savings: ₹${Math.max(0, netFinancialBenefit).toLocaleString('en-IN')}.`;
  } else if (riskDelta >= 15) {
    narrative = `Warning: Deferring service or increasing duty cycle escalates failure risk from ${baselineRiskScore}% to ${simRiskScore}% (▲ +${riskDelta}% increase). Expected emergency breakdown exposure rises to ₹${simExpectedExposure.toLocaleString('en-IN')}.`;
  } else {
    narrative = `Simulated adjustments result in a minor risk variation (${baselineRiskScore}% → ${simRiskScore}%). Vehicle remains in ${simRiskLevel.toUpperCase()} risk band.`;
  }

  return {
    baseline: {
      riskScore: baselineRiskScore,
      riskLevel: baselineRiskLevel,
      healthScore: baselineHealth,
      expectedExposure: baselineExpectedExposure,
      downtime: baselineRiskScore >= 60 ? '2–3 days planned (or 7 days unexpected)' : 'Under 4 hours',
    },
    simulated: {
      riskScore: simRiskScore,
      riskLevel: simRiskLevel,
      healthScore: simHealth,
      expectedExposure: simExpectedExposure,
      downtime: simRiskScore >= 60 ? '2–3 days' : simRiskScore >= 30 ? '1 day' : 'Under 4 hours',
      breakdown: simScoreResult.breakdown,
    },
    delta: {
      riskDelta,
      healthDelta: simHealth - baselineHealth,
      netFinancialBenefit,
      repairedComponentsCount: repairedComponents.length,
      deferDaysApplied: deferDays,
    },
    narrative,
    computedAt: new Date().toISOString(),
  };
}

module.exports = { simulateWhatIf };
