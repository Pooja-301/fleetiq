/**
 * FleetIQ — Python ML Service Bridge (Phase 3 Integration)
 *
 * Connects Node.js backend to the Python ML Microservice (FastAPI / Flask)
 * running at http://localhost:5000/predict.
 *
 * If the Python service is unavailable or errors out, it gracefully returns null
 * so the backend falls back to the Phase 2 rule-based engine automatically.
 */

'use strict';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000/predict';
const TIMEOUT_MS = 2500;

/**
 * predictVehicleRiskWithML(vehicle)
 *
 * Formats vehicle data and queries Python ML service.
 * @param {Object} vehicle Plain vehicle object
 * @returns {Promise<Object|null>} ML prediction result or null if offline
 */
async function predictVehicleRiskWithML(vehicle) {
  try {
    const getCompScore = (key) =>
      vehicle.components?.find((c) => c.key === key)?.score ?? 70;

    // Calculate days since last service
    let daysSinceLastService = 60;
    if (vehicle.lastService) {
      const diffMs = Date.now() - new Date(vehicle.lastService).getTime();
      daysSinceLastService = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
    }

    const isOverdue = vehicle.nextMaintenanceIn?.toLowerCase().includes('overdue') ? 1 : 0;

    const payload = {
      mileage: vehicle.mileage || 0,
      avgDailyKm: vehicle.avgDailyKm || 200,
      engineScore: getCompScore('engine'),
      brakesScore: getCompScore('brakes'),
      tyresScore: getCompScore('tyres'),
      batteryScore: getCompScore('battery'),
      daysSinceLastService,
      isOverdue,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(ML_SERVICE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      riskScore: data.riskScore ?? Math.round((data.riskProbability || 0) * 100),
      riskProbability: data.riskProbability ?? (data.riskScore ? data.riskScore / 100 : 0.5),
      riskLevel: data.riskLevel ?? (data.riskScore >= 60 ? 'high' : data.riskScore >= 30 ? 'medium' : 'low'),
      featureImportance: data.featureImportance || [],
      aiExplanation: data.aiExplanation || null,
      aiRecommendation: data.aiRecommendation || null,
      isMLModel: true,
      modelVersion: data.modelVersion || 'randomforest-v1.0',
    };
  } catch (err) {
    // Python service is offline/unreachable — silent fallback
    return null;
  }
}

module.exports = { predictVehicleRiskWithML };
