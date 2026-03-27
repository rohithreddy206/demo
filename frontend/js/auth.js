/* ============================================================
   auth.js — Mock login / logout + sessionStorage session helpers
   ============================================================ */

/** Persist user session data to sessionStorage. */
function setSession(name, role) {
  sessionStorage.setItem('rp_name', name);
  sessionStorage.setItem('rp_role', role);
}

/** Retrieve the current session or null if not logged in. */
function getSession() {
  const name = sessionStorage.getItem('rp_name');
  const role = sessionStorage.getItem('rp_role');
  if (!name || !role) return null;
  return { name, role };
}

/** Guard: redirect to login if no active session. */
function requireAuth() {
  if (!getSession()) {
    window.location.replace('index.html');
  }
}

/** Clear session and return to login page. */
function logout() {
  sessionStorage.removeItem('rp_name');
  sessionStorage.removeItem('rp_role');
  window.location.replace('index.html');
}

/** Populate the sidebar user name and role badge from session. */
function populateSidebarUser() {
  const session = getSession();
  if (!session) return;
  const nameEl = document.getElementById('sidebar-user-name');
  const roleEl = document.getElementById('sidebar-user-role');
  if (nameEl) nameEl.textContent = session.name;
  if (roleEl) {
    roleEl.textContent = session.role;
  }
}

/* ── Login form handler (index.html only) ── */
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorEl  = document.getElementById('login-error');
    const submitBtn = document.getElementById('login-btn');

    errorEl.classList.remove('visible');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in…';

    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (res.status === 'success') {
        setSession(res.data.name, res.data.role);
        window.location.replace('dashboard.html');
      } else {
        errorEl.textContent = res.message || 'Login failed.';
        errorEl.classList.add('visible');
      }
    } catch (err) {
      errorEl.textContent = err.message || 'Unable to reach the server. Is the backend running?';
      errorEl.classList.add('visible');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    }
  });
}

/* ── Logout button (all protected pages) ── */
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}
