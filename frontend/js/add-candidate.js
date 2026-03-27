/* ============================================================
   add-candidate.js — UC 6.3 Candidate Registration
   Fields: candidate_id, full_name, phone_number, email,
           current_location, recruiter_name,
           current_company, total_experience, relevant_experience,
           highest_education, skills,
           current_ctc, expected_ctc, notice_period,
           reason_for_job_change, resume (file)
   ============================================================ */

'use strict';

/* ── Toast ── */
function showToast(msg, type = 'success') {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-icon">${type === 'success' ? '✅' : '❌'}</span>${msg}`;
  c.appendChild(t);
  setTimeout(() => { t.classList.add('fade-out'); t.addEventListener('animationend', () => t.remove()); }, 3500);
}

/* ── Step state ── */
let currentStep = 1;
const TOTAL_STEPS = 3;
const skillSet = new Set();

/* ── Progress ── */
function updateProgress(step) {
  const pct = Math.round((step / TOTAL_STEPS) * 100);
  document.getElementById('progress-fill').style.width = `${pct}%`;
  document.getElementById('step-indicator').textContent = `Step ${step} of ${TOTAL_STEPS}`;
  document.querySelectorAll('.progress-step').forEach(el => {
    const s = parseInt(el.dataset.step);
    el.classList.toggle('active', s === step);
    el.classList.toggle('done',   s < step);
  });
  document.querySelectorAll('.progress-connector').forEach((conn, i) => {
    conn.classList.toggle('done', i < step - 1);
  });
}

function goToStep(step) {
  document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
  document.getElementById(`step-${step}`).classList.add('active');
  currentStep = step;
  updateProgress(step);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Validation ── */
function clearErr(id) {
  const e = document.getElementById(`err-${id}`);
  const i = document.getElementById(id);
  if (e) e.textContent = '';
  if (i) i.classList.remove('error-field');
}

function setErr(id, msg) {
  const e = document.getElementById(`err-${id}`);
  const i = document.getElementById(id);
  if (e) e.textContent = msg;
  if (i) i.classList.add('error-field');
  return false;
}

function validateStep(step) {
  let ok = true;

  if (step === 1) {
    const required = ['candidate_id', 'full_name', 'phone_number', 'email', 'current_location', 'recruiter_name'];
    required.forEach(id => {
      clearErr(id);
      const v = (document.getElementById(id)?.value || '').trim();
      if (!v) { setErr(id, 'This field is required.'); ok = false; return; }
      if (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        setErr(id, 'Enter a valid email address.'); ok = false;
      }
      if (id === 'phone_number' && !/^[+\d][\d\s-]{6,}$/.test(v)) {
        setErr(id, 'Enter a valid phone number.'); ok = false;
      }
    });
  }

  if (step === 2) {
    ['total_experience', 'highest_education'].forEach(id => {
      clearErr(id);
      if (!(document.getElementById(id)?.value || '').trim()) {
        setErr(id, 'Please select an option.'); ok = false;
      }
    });
    clearErr('skills');
    if (skillSet.size === 0) {
      document.getElementById('err-skills').textContent = 'Add at least one skill.';
      ok = false;
    }
  }

  if (step === 3) {
    ['current_ctc', 'notice_period'].forEach(id => {
      clearErr(id);
      if (!(document.getElementById(id)?.value || '').trim()) {
        setErr(id, 'This field is required.'); ok = false;
      }
    });
  }

  return ok;
}

/* ── Navigation ── */
document.querySelectorAll('.btn-next').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!validateStep(currentStep)) { showToast('Please fix the highlighted fields.', 'error'); return; }
    const next = parseInt(btn.dataset.next);
    if (next === 3) buildReview();
    goToStep(next);
  });
});

document.querySelectorAll('.btn-prev').forEach(btn => {
  btn.addEventListener('click', () => goToStep(parseInt(btn.dataset.prev)));
});

/* ── Skills tag input ── */
const skillInput    = document.getElementById('skill-input');
const skillTagsEl   = document.getElementById('skill-tags');
const skillsHidden  = document.getElementById('skills_hidden');
const skillsContainer = document.getElementById('skills-container');

skillsContainer.addEventListener('click', () => skillInput.focus());

function addSkill(raw) {
  const skill = raw.trim().replace(/,+$/, '').trim();
  if (!skill || skillSet.has(skill.toLowerCase())) return;
  skillSet.add(skill.toLowerCase());
  const tag = document.createElement('span');
  tag.className = 'skill-tag';
  tag.innerHTML = `${skill} <span class="tag-remove">✕</span>`;
  tag.title = 'Click to remove';
  tag.addEventListener('click', () => { skillSet.delete(skill.toLowerCase()); tag.remove(); syncSkills(); });
  skillTagsEl.appendChild(tag);
  syncSkills();
}

function syncSkills() { skillsHidden.value = [...skillSet].join(','); }

skillInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    if (skillInput.value.trim()) { addSkill(skillInput.value); skillInput.value = ''; }
  }
  if (e.key === 'Backspace' && !skillInput.value) {
    const tags = skillTagsEl.querySelectorAll('.skill-tag');
    if (tags.length) tags[tags.length - 1].click();
  }
});
skillInput.addEventListener('blur', () => {
  if (skillInput.value.trim()) { addSkill(skillInput.value); skillInput.value = ''; }
});

/* ── CTC comparison ── */
const ctcCurrentEl  = document.getElementById('current_ctc');
const ctcExpectedEl = document.getElementById('expected_ctc');
const ctcCompare    = document.getElementById('ctc-compare');

function updateCTC() {
  const cur = parseFloat(ctcCurrentEl.value);
  const exp = parseFloat(ctcExpectedEl.value);
  if (!isNaN(cur) && cur > 0) {
    ctcCompare.style.display = 'flex';
    document.getElementById('ctc-current-display').textContent  = `₹ ${cur.toFixed(1)} LPA`;
    if (!isNaN(exp) && exp > 0) {
      document.getElementById('ctc-expected-display').textContent = `₹ ${exp.toFixed(1)} LPA`;
      const h = (((exp - cur) / cur) * 100).toFixed(1);
      document.getElementById('ctc-hike-display').textContent = `${h >= 0 ? '+' : ''}${h}%`;
    } else {
      document.getElementById('ctc-expected-display').textContent = '—';
      document.getElementById('ctc-hike-display').textContent = '—';
    }
  } else { ctcCompare.style.display = 'none'; }
}
ctcCurrentEl.addEventListener('input', updateCTC);
ctcExpectedEl.addEventListener('input', updateCTC);

/* ── Resume upload ── */
const uploadZone   = document.getElementById('upload-zone');
const resumeInput  = document.getElementById('resume_file');
const filePreview  = document.getElementById('file-preview');
const removeBtn    = document.getElementById('remove-file');

document.getElementById('upload-trigger').addEventListener('click', e => { e.stopPropagation(); resumeInput.click(); });
uploadZone.addEventListener('click', () => resumeInput.click());
uploadZone.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') resumeInput.click(); });
uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop', e => { e.preventDefault(); uploadZone.classList.remove('drag-over'); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); });
resumeInput.addEventListener('change', () => { if (resumeInput.files[0]) handleFile(resumeInput.files[0]); });
removeBtn.addEventListener('click', () => { resumeInput.value = ''; filePreview.style.display = 'none'; uploadZone.style.display = ''; });

function handleFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (!['pdf','doc','docx'].includes(ext)) { showToast('Only PDF, DOC, or DOCX files allowed.', 'error'); return; }
  if (file.size > 5 * 1024 * 1024)       { showToast('File must be under 5 MB.', 'error'); return; }
  document.getElementById('file-icon').textContent = ext === 'pdf' ? '📕' : '📘';
  document.getElementById('file-name').textContent = file.name;
  document.getElementById('file-size').textContent = fmtSize(file.size);
  uploadZone.style.display = 'none';
  filePreview.style.display = 'flex';
}

function fmtSize(b) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

/* ── Review summary ── */
function val(id) { return (document.getElementById(id)?.value || '').trim() || '—'; }

function buildReview() {
  const rows = [
    { k: 'Candidate ID',  v: val('candidate_id') },
    { k: 'Full Name',     v: val('full_name') },
    { k: 'Phone',         v: val('phone_number') },
    { k: 'Email',         v: val('email') },
    { k: 'Location',      v: val('current_location') },
    { k: 'Recruiter',     v: val('recruiter_name') },
    { k: 'Company',       v: val('current_company') },
    { k: 'Experience',    v: document.getElementById('total_experience')?.selectedOptions[0]?.text || '—' },
    { k: 'Education',     v: document.getElementById('highest_education')?.selectedOptions[0]?.text || '—' },
    { k: 'Skills',        v: [...skillSet].join(', ') || '—' },
    { k: 'Current CTC',   v: val('current_ctc') !== '—' ? `₹ ${val('current_ctc')} LPA` : '—' },
    { k: 'Expected CTC',  v: val('expected_ctc') !== '—' ? `₹ ${val('expected_ctc')} LPA` : '—' },
    { k: 'Notice Period', v: document.getElementById('notice_period')?.selectedOptions[0]?.text || '—' },
  ];
  document.getElementById('review-grid').innerHTML = rows.map(r => `
    <div class="review-item">
      <span class="review-key">${r.k}</span>
      <span class="review-val${r.v === '—' ? ' empty' : ''}">${r.v}</span>
    </div>`).join('');
}

/* ── Submit ── */
document.getElementById('candidate-form').addEventListener('submit', async e => {
  e.preventDefault();
  if (!validateStep(3)) { showToast('Please complete all required fields.', 'error'); return; }

  const btn  = document.getElementById('submit-btn');
  const text = document.getElementById('submit-text');
  const spin = document.getElementById('submit-spinner');
  btn.disabled = true; text.style.display = 'none'; spin.style.display = 'inline-block';

  try {
    const fd = new FormData(document.getElementById('candidate-form'));
    fd.set('skills', skillsHidden.value);

    const res = await fetch(`${API_BASE}/api/candidates`, { method: 'POST', body: fd });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j.detail || j.message || `HTTP ${res.status}`);
    }
    showToast('Candidate profile saved successfully! 🎉', 'success');
    setTimeout(() => window.location.href = 'dashboard.html', 1800);
  } catch (err) {
    showToast(err.message || 'Something went wrong.', 'error');
    btn.disabled = false; text.style.display = 'inline'; spin.style.display = 'none';
  }
});

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => updateProgress(1));
