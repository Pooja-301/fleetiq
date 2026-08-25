/**
 * FleetIQ API client — talks to the Express backend at :8080
 * All functions return plain objects (or throw on network/HTTP errors).
 */

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options);
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

/**
 * POST /api/copilot/chat
 * Natural language fleet queries
 */
export function askCopilot(message) {
  return apiFetch('/api/copilot/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
}

/**
 * POST /api/vehicles/:id/simulate
 * What-If Counterfactual Simulation
 */
export function simulateVehicleRisk(id, params = {}) {
  return apiFetch(`/api/vehicles/${encodeURIComponent(id)}/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
}
