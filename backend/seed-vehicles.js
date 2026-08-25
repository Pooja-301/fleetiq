/**
 * Seed the Vehicle collection with the same 8 mock vehicles used by the frontend.
 *
 * Usage (from the backend folder):
 *   node seed-vehicles.js
 *   npm run seed:vehicles
 */
const path = require('node:path');
const { pathToFileURL } = require('node:url');
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

async function loadMockVehicles() {
  const fleetDataPath = path.join(__dirname, '..', 'frontend', 'src', 'lib', 'fleet-data.js');
  const mod = await import(pathToFileURL(fleetDataPath).href);
  if (!Array.isArray(mod.vehicles) || mod.vehicles.length === 0) {
    throw new Error('frontend/src/lib/fleet-data.js did not export a vehicles array');
  }
  return mod.vehicles;
}

async function seed() {
  loadEnv();

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Check backend/.env or backend/.env.example');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const vehicles = await loadMockVehicles();

  await Vehicle.deleteMany({ id: { $in: vehicles.map((v) => v.id) } });
  await Vehicle.insertMany(vehicles);

  console.log(`Seeded ${vehicles.length} vehicles: ${vehicles.map((v) => v.id).join(', ')}`);
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
