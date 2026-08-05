/* ============================================
   CYBER THREAT AWARENESS PORTAL - SCRIPT.JS
   All API integrations and UI logic
   ============================================ */

const API_BASE = 'http://localhost:8080/api';

/* ── Utility Helpers ─────────────────────────── */

function getUser() {
  const u = localStorage.getItem('ctap_user');
  return u ? JSON.parse(u) : null;
}

function setUser(data) {
  localStorage.setItem('ctap_user', JSON.stringify(data));
}

function clearUser() {
  localStorage.removeItem('ctap_user');
}

function requireAuth() {
  if (!getUser()) {
    window.location.href = 'index.html';
  }
}

function showAlert(id, msg, type = 'error') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = '';
  el.className = `cyber-alert ${type} show`;
  const icon = type === 'error' ? '⚠' : '✓';
  el.innerHTML = `<span>${icon}</span> ${msg}`;
  setTimeout(() => el.classList.remove('show'), 5000);
}

function setLoading(btnId, loading, text = '') {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = loading;
  if (loading) {
    btn.dataset.orig = btn.innerHTML;
    btn.innerHTML = `<span class="cyber-spinner" style="width:18px;height:18px;border-width:2px;"></span> Processing...`;
  } else {
    btn.innerHTML = text || btn.dataset.orig;
  }
}

/* ── ✅ FIXED apiFetch: uses endpoint param correctly ── */
async function apiFetch(endpoint, options = {}) {
  const user = getUser();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (user?.token) headers['Authorization'] = `Bearer ${user.token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || `Error ${res.status}`);
  return data;
}

/* ── Navbar user info ────────────────────────── */
function initNavbar() {
  const user = getUser();
  const nameEl = document.getElementById('nav-user-name');
  const logoutBtn = document.getElementById('nav-logout');
  if (nameEl && user) nameEl.textContent = user.name || user.email || 'Agent';
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
}

/* ── AUTH: Login ─────────────────────────────── */
async function login(e) {
  e.preventDefault();
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    showAlert('login-alert', 'Please fill in all fields.', 'error');
    return;
  }

  setLoading('login-btn', true);
  try {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    setUser({ ...data, email });
    window.location.href = 'dashboard.html';
  } catch (err) {
    showAlert('login-alert', err.message || 'Login failed. Check credentials.', 'error');
  } finally {
    setLoading('login-btn', false);
  }
}

/* ── AUTH: Register ──────────────────────────── */
async function register(e) {
  e.preventDefault();
  const name     = document.getElementById('reg-name').value.trim();
  const email    = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirm  = document.getElementById('reg-confirm').value;

  if (!name || !email || !password) {
    showAlert('reg-alert', 'All fields are required.', 'error');
    return;
  }
  if (password !== confirm) {
    showAlert('reg-alert', 'Passwords do not match.', 'error');
    return;
  }
  if (password.length < 6) {
    showAlert('reg-alert', 'Password must be at least 6 characters.', 'error');
    return;
  }

  setLoading('reg-btn', true);
  try {
    await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    showAlert('reg-alert', 'Account created! Redirecting to login...', 'success');
    setTimeout(() => window.location.href = 'index.html', 1500);
  } catch (err) {
    showAlert('reg-alert', err.message || 'Registration failed.', 'error');
  } finally {
    setLoading('reg-btn', false);
  }
}

/* ── AUTH: Logout ────────────────────────────── */
function logout() {
  clearUser();
  window.location.href = 'index.html';
}

/* ── DASHBOARD ───────────────────────────────── */
function initDashboard() {
  requireAuth();
  const user = getUser();
  const greetEl = document.getElementById('dash-greeting');
  if (greetEl) greetEl.textContent = `Welcome back, ${user?.name || 'Agent'}`;
  initNavbar();
}

/* ── THREAT DETECTION ────────────────────────── */
async function detectThreat() {
  const input = document.getElementById('detect-input')?.value?.trim();
  if (!input) {
    showAlert('detect-alert', 'Enter a URL or message to analyze.', 'error');
    return;
  }

  const resultBox = document.getElementById('result-box');
  const scanBar   = document.getElementById('scan-bar');
  const panel     = document.querySelector('.detect-panel');

  if (resultBox) { resultBox.className = 'result-box'; resultBox.innerHTML = ''; }
  if (scanBar)   { scanBar.style.display = 'block'; panel?.classList.add('scanning'); }

  setLoading('detect-btn', true);
  try {
    const data = await apiFetch('/detect', {
      method: 'POST',
      body: JSON.stringify({ content: input, url: input, message: input })
    });

    if (scanBar) { scanBar.style.display = 'none'; panel?.classList.remove('scanning'); }

    const isSafe   = data.safe !== false && !/danger|malicious|phishing|threat/i.test(data.result || '');
    const status   = data.result || (isSafe ? 'SAFE' : 'DANGEROUS');
    const reason   = data.reason || data.details || data.message || 'Analysis complete.';
    const cssClass = isSafe ? 'safe' : 'danger';
    const icon     = isSafe ? '🛡' : '⚠';

    if (resultBox) {
      resultBox.className = `result-box ${cssClass}`;
      resultBox.innerHTML = `
        <div class="result-badge">${icon} ${status}</div>
        <div class="result-reason">${reason}</div>
      `;
    }
  } catch (err) {
    if (scanBar) { scanBar.style.display = 'none'; panel?.classList.remove('scanning'); }
    showAlert('detect-alert', err.message || 'Detection failed. Try again.', 'error');
  } finally {
    setLoading('detect-btn', false);
  }
}

/* ── THREATS LIST ────────────────────────────── */
async function loadThreats() {
  requireAuth();
  initNavbar();
  const container = document.getElementById('threats-container');
  const loadEl    = document.getElementById('threats-loading');
  if (!container) return;

  try {
    const threats = await apiFetch('/threats');
    if (loadEl) loadEl.style.display = 'none';

    if (!threats || threats.length === 0) {
      container.innerHTML = `<div class="col-12 text-center text-muted-c mono py-5">No threats found in database.</div>`;
      return;
    }

    container.innerHTML = threats.map(t => renderThreatCard(t)).join('');
  } catch (err) {
    if (loadEl) loadEl.style.display = 'none';
    container.innerHTML = `<div class="col-12"><div class="cyber-alert error show"><span>⚠</span> ${err.message || 'Failed to load threats.'}</div></div>`;
  }
}

function renderThreatCard(t) {
  const severity = t.severity || t.level || 'high';
  const sev      = severity.toLowerCase();
  const sevClass = sev === 'low' ? 'severity-low' : sev === 'medium' ? 'severity-medium' : 'severity-high';
  const sevDot   = sev === 'low' ? '🟢' : sev === 'medium' ? '🟡' : '🔴';

  const prevention = t.prevention || t.preventionTips || '';
  const prevLines  = Array.isArray(prevention) ? prevention : prevention.split(/[.;\n]/).filter(l => l.trim());
  const prevHtml   = prevLines.slice(0, 4).map(l => `<li>${l.trim()}</li>`).join('');

  return `
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="threat-card h-100">
        <span class="severity-badge ${sevClass}">${sevDot} ${severity.toUpperCase()}</span>
        <h5>${t.title || t.name || 'Unknown Threat'}</h5>
        <p class="desc-text">${t.description || 'No description available.'}</p>
        ${prevHtml ? `
        <div class="prevention-list">
          <h6>🛡 Prevention</h6>
          <ul>${prevHtml}</ul>
        </div>` : ''}
      </div>
    </div>`;
}

/* ── QUIZ ─────────────────────────────────────── */
let quizState = {
  questions: [],
  current: 0,
  answers: [],
  score: 0
};

/*   hits correct endpoint /quiz_question/getQuiz */
async function loadQuiz() {
  requireAuth();
  initNavbar();

  const quizArea = document.getElementById('quiz-area');
  const loadEl   = document.getElementById('quiz-loading');

  try {
    const data = await apiFetch('/quiz_question/getQuiz');

    const questions = data.map(q => ({
      id: q.id,
      question: q.question,
      options: [q.optionA, q.optionB, q.optionC, q.optionD],
      correctAnswer: q.correctAnswer  // "A", "B", "C", or "D"
    }));

    if (loadEl) loadEl.style.display = 'none';

    quizState = { questions, current: 0, answers: [], score: 0 };
    renderQuestion();

  } catch (err) {
    if (loadEl) loadEl.style.display = 'none';
    if (quizArea) quizArea.innerHTML = `<div class="cyber-alert error show"><span>⚠</span> ${err.message || 'Failed to load quiz.'}</div>`;
  }
}

function renderQuestion() {
  const { questions, current } = quizState;
  const q = questions[current];
  if (!q) return;

  const options  = q.options || [];
  const progress = Math.round((current / questions.length) * 100);

  const quizArea = document.getElementById('quiz-area');
  if (!quizArea) return;

  quizArea.innerHTML = `
    <div class="quiz-progress">
      <div class="progress-bar-wrap">
        <div class="progress-bar-fill" style="width:${progress}%"></div>
      </div>
      <span class="progress-label">${current + 1} / ${questions.length}</span>
    </div>
    <div class="question-card">
      <div class="question-num">Question ${current + 1}</div>
      <div class="question-text">${q.question}</div>
      <div id="options-container">
        ${options.map((opt, i) => `
          <button class="option-btn" onclick="selectOption(${i})" data-index="${i}">
            <span class="mono" style="color:var(--accent-blue);margin-right:0.5rem;">${String.fromCharCode(65 + i)}.</span>
            ${opt || ''}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function selectOption(idx) {
  const { questions, current } = quizState;
  const q = questions[current];

  const correctIdx = q.correctAnswer.charCodeAt(0) - 65; // 'A'->0, 'B'->1, etc.

  // Visual feedback: highlight correct and wrong
  const btns = document.querySelectorAll('.option-btn');
  btns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correctIdx) btn.style.borderColor = 'var(--accent-green)';
    if (i === idx && idx !== correctIdx) btn.style.borderColor = '#e74c3c';
  });

  const selectedAnswer = q.options[idx];

  quizState.answers.push({
    questionId: q.id,
    answer: selectedAnswer
  });

  if (idx === correctIdx) {
    quizState.score++;
  }

  // Move to next question after short delay so user sees feedback
  setTimeout(() => {
    quizState.current++;
    if (quizState.current < questions.length) {
      renderQuestion();
    } else {
      submitQuiz();
    }
  }, 700);
}

async function submitQuiz() {
  const quizArea = document.getElementById('quiz-area');
  if (!quizArea) return;

  quizArea.innerHTML = `<div class="loading-overlay"><div class="cyber-spinner"></div> Submitting answers...</div>`;

  let finalScore = quizState.score;
  let serverMsg  = '';

  try {
    const user = getUser();

    //  Build answers payload: { "questionId": "selectedOptionText" }
    const answersPayload = {};
    quizState.answers.forEach(a => {
      answersPayload[String(a.questionId)] = a.answer;
    });

    const result = await apiFetch('/quiz_question/submit', {
      method: 'POST',
      body: JSON.stringify({
        userEmail: user?.email || 'guest@portal.com',
        answers: answersPayload
      })
    });

    // Server returns { score, message }
    finalScore = result.score ?? finalScore;
    serverMsg  = result.message || '';

  } catch (err) {
    // Fall back to client-side score silently
    console.warn('Server submission failed, using client score:', err.message);
  }

  const total = quizState.questions.length;
  const pct   = Math.round((finalScore / total) * 100);
  const grade = pct >= 80 ? { label: 'Excellent',      color: 'var(--accent-green)'  }
      : pct >= 60 ? { label: 'Good',            color: 'var(--accent-blue)'   }
          :              { label: 'Keep Practicing', color: 'var(--accent-yellow)' };

  quizArea.innerHTML = `
    <div class="score-screen">
      <div class="score-circle">
        <div class="score-num">${finalScore}</div>
        <div class="score-total">out of ${total}</div>
      </div>
      <div class="score-title" style="color:${grade.color}">${grade.label}</div>
      <p class="text-muted-c mono" style="font-size:0.9rem;margin-bottom:0.5rem;">
        You scored <strong style="color:${grade.color}">${pct}%</strong>
      </p>
      ${serverMsg ? `<p class="text-muted-c" style="font-size:0.85rem;margin-bottom:1.5rem;">${serverMsg}</p>` : '<div style="margin-bottom:1.5rem"></div>'}
      <button class="btn-cyber" style="max-width:220px;margin:0 auto;" onclick="retakeQuiz()">↺ Retake Quiz</button>
    </div>`;
}

function retakeQuiz() {
  quizState = { questions: quizState.questions, current: 0, answers: [], score: 0 };
  renderQuestion();
}

/* ── URL Checker (standalone) ────────────────── */
async function checkUrl() {
  const url = document.getElementById('urlInput')?.value?.trim();
  if (!url) return;

  try {
    const data = await apiFetch('/detect', {
      method: 'POST',
      body: JSON.stringify({ url })
    });
    const resultEl = document.getElementById('result');
    if (resultEl) resultEl.innerText = 'Result: ' + (data.result || 'Unknown');
  } catch (err) {
    const resultEl = document.getElementById('result');
    if (resultEl) resultEl.innerText = 'Error: ' + err.message;
  }
}

/* ── Page Init ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;

  if (page === 'login') {
    document.getElementById('login-form')?.addEventListener('submit', login);
  }
  if (page === 'register') {
    document.getElementById('reg-form')?.addEventListener('submit', register);
  }
  if (page === 'dashboard') {
    initDashboard();
  }
  if (page === 'detect') {
    requireAuth();
    initNavbar();
    document.getElementById('detect-btn')?.addEventListener('click', detectThreat);
    document.getElementById('detect-input')?.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); detectThreat(); }
    });
  }
  if (page === 'threats') {
    loadThreats();
  }
  if (page === 'quiz') {
    loadQuiz();
  }
});

/* ==========================================
   FILE SCANNER
========================================== */

async function scanFile() {

    const fileInput = document.getElementById("fileInput");

    if (!fileInput || fileInput.files.length === 0) {
        alert("Please select a file.");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {

        const response = await fetch("http://localhost:8080/api/filescanner/scan", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        console.log(result);

        if (result.safe) {

            document.getElementById("scanStatus").innerHTML = "SAFE";
            document.getElementById("scanMessage").innerHTML = result.message;
            document.getElementById("malicious").innerHTML = result.malicious;
            document.getElementById("suspicious").innerHTML = result.suspicious;

        } else {

            document.getElementById("scanStatus").innerHTML = "DANGEROUS";
            document.getElementById("scanMessage").innerHTML = result.message;
            document.getElementById("malicious").innerHTML = result.malicious;
            document.getElementById("suspicious").innerHTML = result.suspicious;

        }

    }
    catch(error){

        console.log(error);

        alert("Unable to scan file");

    }

}