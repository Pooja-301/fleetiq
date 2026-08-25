const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, enum: ['engine', 'brakes', 'tyres', 'battery'] },
    label: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    status: { type: String, required: true, enum: ['good', 'monitor', 'attention', 'critical'] },
    detail: { type: String, default: '' },
  },
  { _id: false },
);

const maintenanceRecordSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, required: true },
    workshop: { type: String, default: '' },
    cost: { type: Number, default: 0 },
    odometer: { type: Number, default: 0 },
    status: { type: String, required: true, enum: ['completed', 'scheduled', 'overdue'] },
    notes: { type: String, default: '' },
  },
  { _id: false },
);

const alertSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    vehicleId: { type: String, required: true },
    vehicleName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    severity: { type: String, required: true, enum: ['critical', 'warning', 'info'] },
    category: { type: String, required: true, enum: ['component', 'overdue', 'telemetry', 'compliance'] },
    raisedAt: { type: Date, required: true },
  },
  { _id: false },
);

const explanationDriverSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    weight: { type: Number, required: true },
    direction: { type: String, required: true, enum: ['increases', 'decreases'] },
  },
  { _id: false },
);

const vehicleSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    plate: { type: String, required: true },
    depot: { type: String, required: true },
    driver: { type: String, default: '' },
    healthScore: { type: Number, required: true, min: 0, max: 100 },
    riskLevel: { type: String, required: true, enum: ['low', 'medium', 'high'], index: true },
    riskProbability: { type: Number, required: true, min: 0, max: 1 },
    mileage: { type: Number, required: true, min: 0 },
    avgDailyKm: { type: Number, default: 0 },
    lastService: { type: Date },
    nextMaintenance: { type: Date },
    nextMaintenanceIn: { type: String, default: '' },
    inServiceSince: { type: Date },
    fuelEfficiency: { type: Number, default: 0 },
    utilisation: { type: Number, default: 0, min: 0, max: 100 },
    components: { type: [componentSchema], default: [] },
    history: { type: [maintenanceRecordSchema], default: [] },
    alerts: { type: [alertSchema], default: [] },
    explanation: {
      summary: { type: String, default: '' },
      drivers: { type: [explanationDriverSchema], default: [] },
      confidence: { type: Number, default: 0 },
      modelVersion: { type: String, default: '' },
      evaluatedAt: { type: Date },
    },
    recommendation: {
      action: { type: String, default: '' },
      window: { type: String, default: '' },
      priority: { type: String, enum: ['immediate', 'high', 'planned'] },
      estimatedCost: { type: Number, default: 0 },
      estimatedDowntime: { type: String, default: '' },
      rationale: { type: String, default: '' },
      steps: { type: [String], default: [] },
    },
  },
  { id: false },
);

vehicleSchema.set('toJSON', {
  versionKey: false,
  transform(_doc, ret) {
    delete ret._id;
    return ret;
  },
});

vehicleSchema.set('toObject', {
  versionKey: false,
  transform(_doc, ret) {
    delete ret._id;
    return ret;
  },
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
