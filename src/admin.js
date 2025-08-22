const root = document.getElementById('root');
root.innerHTML = `
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; background:#0B0F13; color:#FAF0E6; margin:0; padding:24px; }
    .card { background:#11151A; border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:16px; max-width:960px; margin:0 auto; }
    h1 { margin:0 0 12px 0; font-size:20px; }
    input[type=password] { width: 260px; padding:10px 12px; border-radius:8px; border:1px solid rgba(255,255,255,0.2); background:#0F1216; color:#FAF0E6; }
    button { padding:10px 14px; border-radius:8px; border:0; cursor:pointer; background:#FF4E6A; color:#fff; font-weight:800; }
    table { width:100%; border-collapse: collapse; margin-top: 12px; font-size: 14px; }
    th, td { text-align:left; padding:8px; border-bottom:1px solid rgba(255,255,255,0.08); }
    .row { display:flex; align-items:center; gap:8px; }
    .top { display:flex; justify-content: space-between; align-items:center; gap:12px; }
    a.link { color:#ff5c98; text-decoration:none; }
  </style>
  <div class="card">
    <div class="top">
      <h1>Waitlist Admin</h1>
      <div class="row">
        <input id="pw" type="password" placeholder="Admin password" />
        <button id="login">Enter</button>
        <a id="export" class="link" href="#">Export CSV</a>
      </div>
    </div>
    <div id="status"></div>
    <table id="table" style="display:none">
      <thead><tr><th>Phone</th><th>Email</th><th>Source</th><th>Date</th></tr></thead>
      <tbody></tbody>
    </table>
  </div>
`;

const pwInput = document.getElementById('pw');
const loginBtn = document.getElementById('login');
const statusEl = document.getElementById('status');
const table = document.getElementById('table');
const tbody = table.querySelector('tbody');
const exportLink = document.getElementById('export');

async function fetchList(password) {
  statusEl.textContent = 'Loading…';
  const res = await fetch('/api/waitlist', { headers: { 'x-admin-password': password } });
  if (!res.ok) {
    statusEl.textContent = 'Unauthorized or error.';
    table.style.display = 'none';
    return;
  }
  const data = await res.json();
  tbody.innerHTML = '';
  for (const row of data.entries) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${row.phone || ''}</td><td>${row.email || ''}</td><td>${row.source || ''}</td><td>${new Date(row.created_at).toLocaleString()}</td>`;
    tbody.appendChild(tr);
  }
  table.style.display = '';
  statusEl.textContent = `${data.entries.length} entries`;
}

loginBtn.addEventListener('click', () => {
  const pw = pwInput.value.trim();
  if (!pw) return;
  localStorage.setItem('admin_pw', pw);
  fetchList(pw);
});

exportLink.addEventListener('click', (e) => {
  e.preventDefault();
  const pw = localStorage.getItem('admin_pw') || pwInput.value.trim();
  if (!pw) return;
  const url = new URL(location.origin + '/api/waitlist');
  url.searchParams.set('format', 'csv');
  fetch(url, { headers: { 'x-admin-password': pw } })
    .then(r => r.blob())
    .then(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'waitlist.csv';
      a.click();
    });
});

// Auto-try stored password
const saved = localStorage.getItem('admin_pw');
if (saved) fetchList(saved);


