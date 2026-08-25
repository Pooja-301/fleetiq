const Vehicle = require('../models/Vehicle');
const { scoreVehicle }             = require('../lib/riskEngine');
const { buildExplanation }         = require('../lib/explainEngine');
const { predictVehicleRiskWithML } = require('../lib/mlService');

/**
 * GET /api/vehicles
 * Return all vehicles. Optional `risk` query filters by riskLevel (low|medium|high).
 */
exports.getVehicles = async (req, res, next) => {
  try {
    const filter = {};
    const risk = typeof req.query.risk === 'string' ? req.query.risk.toLowerCase() : '';
    if (risk && ['low', 'medium', 'high'].includes(risk)) {
      filter.riskLevel = risk;
    }

    const vehicles = await Vehicle.find(filter).sort({ id: 1 });
    res.json(vehicles);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/vehicles/:id
 * Return one vehicle by fleet ID (e.g. FL-1042), not Mongo _id.
 */
exports.getVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({ id: req.params.id });
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    return res.json(vehicle);
  } catch (err) {
    return next(err);
  }
};

/**
 * GET /api/vehicles/:id/risk
 * Predicts risk via Python ML Microservice (Phase 3) if available,
 * or gracefully falls back to Rule-Based Risk Engine (Phase 2).
 */
exports.getVehicleRisk = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({ id: req.params.id });
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const plain = vehicle.toObject();

    // 1. Try Python ML Service (Phase 3 & 4)
    const mlResult = await predictVehicleRiskWithML(plain);

    if (mlResult) {
      const fallbackExpl = buildExplanation(plain, mlResult);
      return res.json({
        vehicleId:       vehicle.id,
        vehicleName:     vehicle.name,
        riskScore:       mlResult.riskScore,
        riskLevel:       mlResult.riskLevel,
        riskProbability: mlResult.riskProbability,
        featureImportance: mlResult.featureImportance,
        explanation:     mlResult.aiExplanation ? {
          summary:       mlResult.aiExplanation,
          drivers:       fallbackExpl.explanation.drivers,
          confidence:    0.92,
          modelVersion:  mlResult.modelVersion,
          evaluatedAt:   new Date().toISOString(),
        } : fallbackExpl.explanation,
        recommendation:  mlResult.aiRecommendation ? {
          ...fallbackExpl.recommendation,
          action: mlResult.aiRecommendation,
        } : fallbackExpl.recommendation,
        computedAt:      new Date().toISOString(),
        engineVersion:   mlResult.modelVersion,
        isMLModel:       true,
      });
    }

    // 2. Fallback to Rule-based Scoring Engine (Phase 2)
    const scoreResult = scoreVehicle(plain);
    const { explanation, recommendation } = buildExplanation(plain, scoreResult);

    return res.json({
      vehicleId:       vehicle.id,
      vehicleName:     vehicle.name,
      riskScore:       scoreResult.riskScore,
      riskLevel:       scoreResult.riskLevel,
      riskProbability: parseFloat((scoreResult.riskScore / 100).toFixed(2)),
      breakdown:       scoreResult.breakdown,
      explanation,
      recommendation,
      computedAt:      scoreResult.computedAt,
      engineVersion:   scoreResult.engineVersion,
      isMLModel:       false,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * GET /api/vehicles/risk/all
 * Returns fleet-wide risk summaries for all vehicles.
 */
exports.getAllRiskScores = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({}).sort({ id: 1 });

    const scores = vehicles.map((v) => {
      const plain = v.toObject();
      const { riskScore, riskLevel } = scoreVehicle(plain);
      return {
        vehicleId:   v.id,
        vehicleName: v.name,
        depot:       v.depot,
        riskScore,
        riskLevel,
        riskProbability: parseFloat((riskScore / 100).toFixed(2)),
      };
    });

    const summary = {
      total:   scores.length,
      high:    scores.filter((s) => s.riskLevel === 'high').length,
      medium:  scores.filter((s) => s.riskLevel === 'medium').length,
      low:     scores.filter((s) => s.riskLevel === 'low').length,
      avgRisk: scores.length ? Math.round(scores.reduce((a, s) => a + s.riskScore, 0) / scores.length) : 0,
    };

    return res.json({ summary, vehicles: scores, computedAt: new Date().toISOString() });
  } catch (err) {
    return next(err);
  }
};
