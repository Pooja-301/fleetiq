/**
 * FleetIQ — Full Dataset MongoDB Seeder
 * Reads `ml-service/fleet_telemetry_dataset.csv` (2,500 records)
 * and seeds the MongoDB `fleetiq.vehicles` collection with full rich metadata.
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Vehicle = require('./models/Vehicle');

function loadEnv() {
  try {
    process.loadEnvFile(path.join(__dirname, '.env'));
  } catch (err) {
    if (!(err && err.code === 'ENOENT')) {
      console.error('Error loading .env:', err);
    }
  }
}

const DEPOTS = [
  'Pune Central',
  'Ahmedabad North',
  'Bengaluru South',
  'Chennai West',
  'Delhi East',
  'Hyderabad Central',
  'Jaipur Depot',
  'Gurugram Hub',
  'Mumbai North',
  'Kolkata Port'
];

const DRIVERS = [
  'Rakesh Nair',
  'Imran Shaikh',
  'Sunil Gowda',
  'Karthik Raman',
  'Vikram Singh',
  'Anil Kumar',
  'Mahesh Yadav',
  'Deepak Verma',
  'Amit Sharma',
  'Rajesh Patil',
  'Sanjay Deshmukh',
  'Praveen Reddy',
  'Manish Tiwari',
  'Arun Joshi',
  'Suresh Choudhary'
];

const MODEL_NAMES = {
  'Heavy Truck': ['Volvo FH16 Tractor', 'Tata Prima 3718', 'BharatBenz 3528C', 'Scania G410'],
  'Rigid Truck': ['Ashok Leyland 1920', 'BharatBenz 1617R', 'Tata Signa 2823', 'Eicher Pro 6028'],
  'Light Truck': ['Mahindra Furio 7', 'Eicher Pro 2110', 'Tata Ultra T.7', 'Ashok Leyland Partner'],
  'Mini Truck': ['Tata Ace Gold', 'Mahindra Bolero Maxi', 'Maruti Super Carry'],
  'Utility Pickup': ['Isuzu D-Max Utility', 'Mahindra Bolero Camper', 'Tata Yodha Pickup']
};

const STATE_CODES = ['MH 12', 'GJ 05', 'KA 03', 'TN 09', 'DL 01', 'TS 07', 'RJ 14', 'HR 26', 'WB 02'];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function compStatus(score) {
  return score >= 85 ? 'good' : score >= 70 ? 'monitor' : score >= 50 ? 'attention' : 'critical';
}

async function seedDatabase() {
  loadEnv();
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fleetiq';
  console.log(`Connecting to MongoDB at: ${uri}`);
  await mongoose.connect(uri);

  const csvPath = path.join(__dirname, '..', 'ml-service', 'fleet_telemetry_dataset.csv');
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV not found at: ${csvPath}`);
  }

  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.trim().split('\n');
  const header = lines[0].split(',');
  const dataRows = lines.slice(1);

  console.log(`Parsing ${dataRows.length} vehicle records from CSV...`);

  const vehicles = dataRows.map((line, idx) => {
    const cols = line.split(',');
    const id = cols[0];
    const type = cols[1];
    const mileage = parseInt(cols[2], 10);
    const avgDailyKm = parseInt(cols[3], 10);
    const engineHealth = parseFloat(cols[4]);
    const brakesHealth = parseFloat(cols[5]);
    const tyresHealth = parseFloat(cols[6]);
    const batteryHealth = parseFloat(cols[7]);
    const coolantTemp = parseFloat(cols[8]);
    const vibration = parseFloat(cols[9]);
    const brakePadMm = parseFloat(cols[10]);
    const daysSinceService = parseInt(cols[11], 10);
    const isOverdue = parseInt(cols[12], 10);
    const riskScore = parseInt(cols[13], 10);

    const modelsList = MODEL_NAMES[type] || ['Commercial Fleet Unit'];
    const name = pick(modelsList);
    const stateCode = pick(STATE_CODES);
    const plate = `${stateCode} ${String.fromCharCode(65 + randInt(0, 25))}${String.fromCharCode(65 + randInt(0, 25))} ${randInt(1000, 9999)}`;
    const depot = pick(DEPOTS);
    const driver = pick(DRIVERS);

    const healthScore = Math.max(1, 100 - riskScore);
    const riskLevel = riskScore >= 60 ? 'high' : riskScore >= 30 ? 'medium' : 'low';
    const riskProbability = parseFloat((riskScore / 100).toFixed(2));

    const nextMaintenanceIn = isOverdue
      ? `Overdue by ${randInt(2, 14)} days`
      : `In ${randInt(3, 75)} days`;

    const lastServiceDate = new Date(Date.now() - daysSinceService * 24 * 60 * 60 * 1000);
    const nextServiceDate = isOverdue
      ? new Date(Date.now() - randInt(2, 14) * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + randInt(5, 60) * 24 * 60 * 60 * 1000);

    const components = [
      {
        key: 'engine',
        label: 'Engine',
        score: Math.round(engineHealth),
        status: compStatus(engineHealth),
        detail: engineHealth < 70 ? `Coolant temp ${coolantTemp}°C, vibration ${vibration}g` : 'Telemetry within normal parameters'
      },
      {
        key: 'brakes',
        label: 'Brakes',
        score: Math.round(brakesHealth),
        status: compStatus(brakesHealth),
        detail: brakesHealth < 70 ? `Pad thickness ${brakePadMm} mm (threshold 4.0 mm)` : 'Pad thickness within safety limit'
      },
      {
        key: 'tyres',
        label: 'Tyres',
        score: Math.round(tyresHealth),
        status: compStatus(tyresHealth),
        detail: tyresHealth < 70 ? 'Uneven tread wear detected on drive axle' : 'Even tread wear across positions'
      },
      {
        key: 'battery',
        label: 'Battery',
        score: Math.round(batteryHealth),
        status: compStatus(batteryHealth),
        detail: batteryHealth < 70 ? 'Cranking voltage dip logged during cold start' : 'Alternator output & voltage normal'
      }
    ];

    const alerts = [];
    if (engineHealth < 50) {
      alerts.push({
        id: `AL-${4000 + idx}`,
        vehicleId: id,
        vehicleName: name,
        title: 'Engine overheating trend detected',
        description: `Coolant temperature exceeded threshold (${coolantTemp}°C).`,
        severity: 'critical',
        category: 'component',
        raisedAt: new Date(Date.now() - randInt(1, 48) * 3600 * 1000)
      });
    }
    if (isOverdue) {
      alerts.push({
        id: `AL-${5000 + idx}`,
        vehicleId: id,
        vehicleName: name,
        title: 'Scheduled maintenance interval overdue',
        description: `Vehicle is ${nextMaintenanceIn} and currently in active rotation.`,
        severity: 'critical',
        category: 'overdue',
        raisedAt: new Date(Date.now() - randInt(12, 96) * 3600 * 1000)
      });
    }

    const history = [
      {
        id: `SR-${80000 + idx}`,
        date: lastServiceDate,
        type: pick(['Scheduled Service A', 'Scheduled Service B', 'Brake Pad Replacement', 'Oil & Filter Change']),
        workshop: `${depot} Workshop`,
        cost: randInt(12000, 55000),
        odometer: Math.max(10000, mileage - randInt(5000, 25000)),
        status: 'completed',
        notes: 'Subsystem inspection completed.'
      }
    ];

    const recommendation = {
      action: riskLevel === 'high'
        ? 'Remove from rotation and schedule immediate workshop inspection'
        : riskLevel === 'medium'
        ? 'Inspect flagged subsystems at the next scheduled bay visit'
        : 'Continue standard maintenance calendar',
      window: isOverdue ? 'Within 24 hours' : nextMaintenanceIn,
      priority: riskLevel === 'high' ? 'immediate' : riskLevel === 'medium' ? 'high' : 'planned',
      estimatedCost: riskLevel === 'high' ? randInt(65000, 110000) : riskLevel === 'medium' ? randInt(25000, 50000) : randInt(8000, 18000),
      estimatedDowntime: riskLevel === 'high' ? '2–3 days' : riskLevel === 'medium' ? '1–2 days' : 'Under 4 hours',
      rationale: `Composite risk score of ${riskScore}/100 indicates ${riskLevel} probability of on-road failure.`,
      steps: [
        'Run full telemetry diagnostics in depot bay',
        'Inspect brake pads and cooling system pressure',
        'Verify sensor baselines before dispatch'
      ]
    };

    return {
      id,
      name,
      type,
      plate,
      depot,
      driver,
      healthScore,
      riskLevel,
      riskProbability,
      mileage,
      avgDailyKm,
      lastService: lastServiceDate,
      nextMaintenance: nextServiceDate,
      nextMaintenanceIn,
      inServiceSince: new Date(Date.now() - randInt(365, 1800) * 24 * 60 * 60 * 1000),
      fuelEfficiency: parseFloat((rand(3.2, 9.5)).toFixed(1)),
      utilisation: randInt(55, 95),
      components,
      history,
      alerts,
      recommendation
    };
  });

  console.log(`Clearing existing vehicles...`);
  await Vehicle.deleteMany({});

  console.log(`Inserting ${vehicles.length} vehicles into MongoDB...`);
  await Vehicle.insertMany(vehicles);

  console.log(`✅ Successfully seeded ${vehicles.length} vehicles into MongoDB!`);
  await mongoose.disconnect();
}

seedDatabase().catch(async (err) => {
  console.error('Seeding failed:', err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
