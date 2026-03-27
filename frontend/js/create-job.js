/* ============================================================
   create-job.js — UC 6.1 Create Job Requirement form logic
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

document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  populateSidebarUser();

  const form = document.getElementById('create-job-form');
  const submitBtn = document.getElementById('submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous field errors
    document.querySelectorAll('.error-field').forEach(el => el.classList.remove('error-field'));
    document.querySelectorAll('.field-error').forEach(el => el.remove());

    const payload = {
      date:                    document.getElementById('date').value,
      company_name:            document.getElementById('company_name').value.trim(),
      job_title:               document.getElementById('job_title').value.trim(),
      num_candidates_required: parseInt(document.getElementById('num_candidates_required').value, 10),
      experience:              document.getElementById('experience').value.trim() || null,
      budgeted_package:        document.getElementById('budgeted_package').value.trim() || null,
      assigned_recruiter_name: document.getElementById('assigned_recruiter_name').value.trim() || null,
    };

    // Basic client-side validation
    let hasError = false;
    ['date', 'company_name', 'job_title', 'num_candidates_required'].forEach(id => {
      const el = document.getElementById(id);
      if (!el.value.trim()) {
        el.classList.add('error-field');
        const err = document.createElement('span');
        err.className = 'field-error';
        err.textContent = 'This field is required.';
        el.parentElement.appendChild(err);
        hasError = true;
      }
    });
    if (hasError) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving…';

    try {
      const res = await apiFetch('/api/jobs', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res.status === 'success') {
        showToast('Job requirement created successfully!', 'success');
        form.reset();
      } else {
        showToast(res.message || 'Failed to create job.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'An unexpected error occurred.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '💾 Save Job Requirement';
    }
  });

  // Reset button
  document.getElementById('reset-btn').addEventListener('click', () => {
    form.reset();
    document.querySelectorAll('.error-field').forEach(el => el.classList.remove('error-field'));
    document.querySelectorAll('.field-error').forEach(el => el.remove());
  });
});
