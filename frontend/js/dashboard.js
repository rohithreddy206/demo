/* ============================================================
   dashboard.js — Fetch and render dashboard stats from API
   ============================================================ */

/** Show a toast notification (reusable across pages). */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${type === 'success' ? '✓' : '✕'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('animationend', () => toast.remove());
  }, 3000);
}

document.addEventListener('DOMContentLoaded', async () => {
  requireAuth();
  populateSidebarUser();

  const session = getSession();
  const greetingEl = document.getElementById('greeting-name');
  if (greetingEl) greetingEl.textContent = session.name;

  const countEl = document.getElementById('total-jobs-count');
  const candsEl = document.getElementById('total-candidates-count');
  const intsEl  = document.getElementById('total-interviews-count');
  const offsEl  = document.getElementById('total-offers-count');

  try {
    const res = await apiFetch('/api/dashboard/stats');
    if (res.status === 'success') {
      if (countEl) { countEl.textContent = res.data.total_jobs; countEl.classList.remove('loading'); }
      if (candsEl) { candsEl.textContent = res.data.total_candidates; candsEl.classList.remove('loading'); }
      if (intsEl)  { intsEl.textContent = res.data.total_interviews; intsEl.classList.remove('loading'); }
      if (offsEl)  { offsEl.textContent = res.data.total_offers; offsEl.classList.remove('loading'); }
    }
  } catch (err) {
    if (countEl) countEl.textContent = 'Error';
    if (candsEl) candsEl.textContent = 'Error';
    if (intsEl) intsEl.textContent = 'Error';
    if (offsEl) offsEl.textContent = 'Error';
    showToast('Could not load stats: ' + err.message, 'error');
  }
});
