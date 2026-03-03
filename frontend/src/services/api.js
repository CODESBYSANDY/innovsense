const BASE_URL = "http://127.0.0.1:8000";

export async function getAlerts() {
  const res = await fetch(`${BASE_URL}/alerts/`);
  return res.json();
}

export async function getDashboardStats() {
  const res = await fetch(`${BASE_URL}/dashboard/stats`);
  return res.json();
}

export async function ackAlert(id) {
  return fetch(`${BASE_URL}/alerts/ack/${id}`, { method: "PUT" });
}

export async function resolveAlert(id) {
  return fetch(`${BASE_URL}/alerts/resolve/${id}`, { method: "PUT" });
}

export async function getAISuggestion(alertType) {
  const res = await fetch(`${BASE_URL}/alerts/ai-suggest/${alertType}`);
  return res.json();
}