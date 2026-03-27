/* ============================================================
   api.js — Central fetch helper (base URL + unified error handling)
   ============================================================ */

const API_BASE = 'http://127.0.0.1:8000';

/**
 * Perform an authenticated fetch and return the parsed JSON envelope.
 * @param {string} path  - API path (e.g. "/api/jobs")
 * @param {object} opts  - Standard fetch options
 * @returns {Promise<{status,data,message}>}
 */
async function apiFetch(path, opts = {}) {
  const defaults = {
    headers: { 'Content-Type': 'application/json' },
  };
  const merged = { ...defaults, ...opts, headers: { ...defaults.headers, ...(opts.headers || {}) } };
  const res = await fetch(`${API_BASE}${path}`, merged);
  const json = await res.json();
  if (!res.ok) {
    const msg = json.detail || json.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return json;
}
