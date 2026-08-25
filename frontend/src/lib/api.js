/**
 * FleetIQ API client — talks to the Express backend at :8080
 * All functions return plain objects (or throw on network/HTTP errors).
 */

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

async function apiFetch(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API ${path} → ${res.status}: ${text}`);
  }
  return res.json();
}

/** GET /api/vehicles */
export function fetchVehicles(riskFilter) {
  const qs = riskFilter ? `?risk=${riskFilter}` : '';
  return apiFetch(`/api/vehicles${qs}`);
}

/** GET /api/vehicles/:id */
export function fetchVehicle(id) {
  return apiFetch(`/api/vehicles/${encodeURIComponent(id)}`);
}

/**
 * GET /api/vehicles/:id/risk
 * Returns live risk score + explanation + recommendation from the rule engine.
 */
export function fetchVehicleRisk(id) {
  return apiFetch(`/api/vehicles/${encodeURIComponent(id)}/risk`);
}

/** GET /api/vehicles/risk/all — fleet-wide risk summary */
export function fetchAllRiskScores() {
  return apiFetch('/api/vehicles/risk/all');
}
