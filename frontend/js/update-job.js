/* ============================================================
   update-job.js — UC 6.2 Search & Update Job Requirement
   ============================================================ */

/** Show a toast notification. */
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

let lastSearchParams = {};

/** Render the search results table. */
function renderTable(jobs) {
  const tbody = document.getElementById('results-tbody');
  const countEl = document.getElementById('results-count');
  const noData = document.getElementById('no-data');
  const tableWrapper = document.getElementById('table-wrapper');

  countEl.textContent = `${jobs.length} record(s)`;

  if (jobs.length === 0) {
    tableWrapper.style.display = 'none';
    noData.style.display = 'block';
    return;
  }

  noData.style.display = 'none';
  tableWrapper.style.display = 'block';

  tbody.innerHTML = jobs.map(job => `
    <tr>
      <td>${job.date}</td>
      <td>${escHtml(job.company_name)}</td>
      <td>${escHtml(job.job_title)}</td>
      <td>${job.num_candidates_required}</td>
      <td>${escHtml(job.experience || '—')}</td>
      <td>${escHtml(job.budgeted_package || '—')}</td>
      <td>
        <button class="btn-edit" data-id="${job.id}"
          data-title="${escAttr(job.job_title)}"
          data-candidates="${job.num_candidates_required}"
          data-experience="${escAttr(job.experience || '')}"
          data-package="${escAttr(job.budgeted_package || '')}">
          ✏️ Edit
        </button>
      </td>
    </tr>
  `).join('');

  // Attach edit handlers
  tbody.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => openEditPanel(btn.dataset));
  });
}

/** HTML-escape a string for text content. */
function escHtml(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(str));
  return d.innerHTML;
}

/** HTML-escape a string for attribute values. */
function escAttr(str) {
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** Pre-fill and reveal the edit panel for a given job row. */
function openEditPanel(data) {
  document.getElementById('edit-job-id').value = data.id;
  document.getElementById('edit-job-title').value = data.title;
  document.getElementById('edit-num-candidates').value = data.candidates;
  document.getElementById('edit-experience').value = data.experience;
  document.getElementById('edit-package').value = data.package;

  const panel = document.getElementById('edit-panel');
  panel.classList.add('visible');
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** Close the edit panel. */
function closeEditPanel() {
  document.getElementById('edit-panel').classList.remove('visible');
}

document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  populateSidebarUser();

  /* ── Search form ── */
  const searchForm = document.getElementById('search-form');
  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const date    = document.getElementById('search-date').value;
    const company = document.getElementById('search-company').value.trim();

    lastSearchParams = { date, company };

    let query = [];
    if (date)    query.push(`date=${encodeURIComponent(date)}`);
    if (company) query.push(`company=${encodeURIComponent(company)}`);
    const qs = query.length ? `?${query.join('&')}` : '';

    const searchBtn = document.getElementById('search-btn');
    searchBtn.disabled = true;
    searchBtn.textContent = 'Searching…';

    try {
      const res = await apiFetch(`/api/jobs${qs}`);
      if (res.status === 'success') {
        renderTable(res.data);
        closeEditPanel();
        document.getElementById('results-section').style.display = 'block';
      } else {
        showToast(res.message || 'Search failed.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Unable to reach the server.', 'error');
    } finally {
      searchBtn.disabled = false;
      searchBtn.innerHTML = '🔍 Search';
    }
  });

  /* ── Search reset ── */
  document.getElementById('search-reset-btn').addEventListener('click', () => {
    searchForm.reset();
    document.getElementById('results-section').style.display = 'none';
    closeEditPanel();
  });

  /* ── Close edit panel ── */
  document.getElementById('close-edit-btn').addEventListener('click', closeEditPanel);

  /* ── Edit form save ── */
  const editForm = document.getElementById('edit-form');
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-job-id').value;

    const payload = {
      job_title:               document.getElementById('edit-job-title').value.trim(),
      num_candidates_required: parseInt(document.getElementById('edit-num-candidates').value, 10),
      experience:              document.getElementById('edit-experience').value.trim() || null,
      budgeted_package:        document.getElementById('edit-package').value.trim() || null,
    };

    const saveBtn = document.getElementById('save-btn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving…';

    try {
      const res = await apiFetch(`/api/jobs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      if (res.status === 'success') {
        showToast('Job requirement updated successfully!', 'success');
        closeEditPanel();
        // Re-run last search to refresh the table
        searchForm.dispatchEvent(new Event('submit'));
      } else {
        showToast(res.message || 'Update failed.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'An unexpected error occurred.', 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = '💾 Save Changes';
    }
  });
});
