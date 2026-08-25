const Vehicle = require('../models/Vehicle');

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
