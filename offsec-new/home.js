/* ============== Home page logic ============== */

// ---------- Toast ----------
let toastTimer = null;
function toast(msg, kind = 'info', ms = 2200) {
  const el = document.getElementById('toast');
  const colors = { success: 'var(--accent)', error: 'var(--sev-high)', info: 'var(--info)' };
  const icons  = { success: 'check_circle', error: 'error', info: 'info' };
  el.innerHTML = `<span class="material-symbols-outlined ms-fill" style="font-size:18px; color:${colors[kind]}">${icons[kind]}</span>${msg}`;
  el.style.opacity = '1';
  el.style.transform = 'translateX(-50%) translateY(0)';
  el.style.pointerEvents = 'auto';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-50%) translateY(20px)';
    el.style.pointerEvents = 'none';
  }, ms);
}

// ---------- People / projects ----------
const PEOPLE = ['Abu Rizal Mahdi', 'Sarah Park', 'John Lee', 'Budi', 'Nur Hasbullah M.'];
const ME = 'Abu Rizal Mahdi';
const PROJECT_OPTIONS = [
  'Northstar Bank Core Infra VA — Q2',
  'Wahana Motorindo Microsite Pentest',
  'Trimatra Auto HRIS Mobile Pentest',
  'Wahana Motorindo VTS Web Audit',
  'Trimatra Auto D-Net Interface VAPT',
];

// ---------- KPI strip (from real findings) ----------
function renderKpis() {
  const open = FINDINGS.filter(f => f.status === 'Open');
  const crit = open.filter(f => f.cvss >= 9.0).length;
  const high = open.filter(f => f.cvss >= 7.0 && f.cvss < 9.0).length;
  document.getElementById('kpi-open').textContent = open.length;
  document.getElementById('kpi-open-sub').textContent = `${crit} critical · ${high} high`;
}

// ---------- Priority (overdue) findings ----------
function sevPill(c) {
  return c >= 9 ? 'critical' : c >= 7 ? 'high' : c >= 4 ? 'medium' : c >= 0.1 ? 'low' : 'info';
}
const PRIORITY = [
  { id: 'FND-1042', overdue: '3d', tone: 'rgba(185,28,28,0.06)', border: 'rgba(185,28,28,0.18)', ico: 'error',   icoColor: 'var(--sev-critical)' },
  { id: 'FND-1035', overdue: '2d', tone: 'rgba(185,28,28,0.05)', border: 'rgba(185,28,28,0.15)', ico: 'error',   icoColor: 'var(--sev-critical)' },
  { id: 'FND-1031', overdue: '1d', tone: 'rgba(220,38,38,0.05)', border: 'rgba(220,38,38,0.14)', ico: 'warning', icoColor: 'var(--sev-high)' },
];
function renderPriority() {
  const wrap = document.getElementById('overdue-list');
  wrap.innerHTML = PRIORITY.map(p => {
    const f = FINDINGS.find(x => x.id === p.id);
    if (!f) return '';
    const sev = sevPill(f.cvss);
    return `
      <a class="hover-row find-card" href="offsec-finding-detail.html?id=${f.id}" style="text-decoration:none; display:flex; gap: 12px; padding: 12px; border-radius: 10px; background: ${p.tone}; border: 1px solid ${p.border};">
        <span class="material-symbols-outlined ms-fill" style="color: ${p.icoColor}; margin-top: 2px;">${p.ico}</span>
        <div style="flex:1; min-width: 0;">
          <div style="display:flex; align-items:center; gap: 6px; flex-wrap: wrap;">
            <span class="sev sev-${sev}">${sev.toUpperCase()} ${f.cvss.toFixed(1)}</span>
            <span class="mono" style="font-size:10.5px; color: var(--text-faint)">${f.category}</span>
          </div>
          <div style="font-weight: 600; font-size: 13px; color: var(--text); margin-top: 5px; line-height:1.35;">${f.title}</div>
          <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 3px;">${f.place} · ${f.application} · <span style="color: var(--primary); font-weight:600">${p.overdue} overdue</span></div>
        </div>
        <span class="material-symbols-outlined" style="color: var(--text-faint); font-size:18px; align-self:center;">chevron_right</span>
      </a>`;
  }).join('');
}

// ---------- Tasks ----------
const STATUS_PILL = { 'To Do': 'pill-todo', 'In Progress': 'pill-progress', 'In Review': 'pill-review', 'Done': 'pill-done' };
let tasks = [
  { id: 1, desc: 'Triage critical SQLi on Northstar Bank - Infra (FND-1042)',         proj: 'Northstar Bank Core Infra VA — Q2',   pic: 'Abu Rizal Mahdi',  due: '2026-05-27', st: 'In Progress' },
  { id: 2, desc: 'Re-test default Tomcat manager creds on Wahana Motorindo - VTS',     proj: 'Wahana Motorindo VTS Web Audit',      pic: 'Abu Rizal Mahdi',  due: '2026-05-29', st: 'To Do' },
  { id: 3, desc: 'Draft RA narrative — Trimatra Auto HRIS hard-coded API key',        proj: 'Trimatra Auto HRIS Mobile Pentest',  pic: 'Abu Rizal Mahdi',  due: '2026-05-25', st: 'In Review' },
  { id: 4, desc: 'Verify SSRF remediation on Trimatra Auto - D-Net webhook',          proj: 'Trimatra Auto D-Net Interface VAPT', pic: 'Budi',             due: '2026-06-03', st: 'To Do' },
  { id: 5, desc: 'Finalize Wahana Motorindo Microsite Pentest report',                 proj: 'Wahana Motorindo Microsite Pentest',  pic: 'Sarah Park',       due: '2026-04-30', st: 'Done' },
];
let nextId = 6;
let filter = 'all';

function fmt(d) {
  if (!d) return '—';
  const dt = new Date(d), today = new Date();
  const days = Math.round((dt - today) / 86400000);
  const str = dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  if (days < 0) return `${str} · ${Math.abs(days)}d ago`;
  if (days === 0) return `${str} · today`;
  if (days < 7) return `${str} · in ${days}d`;
  return str;
}
function isOverdue(d, st) { if (!d || st === 'Done') return false; return new Date(d) < new Date(new Date().toDateString()); }
function initials(name) { return name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase(); }

function renderTasks() {
  const filtered = tasks.filter(t => {
    if (filter === 'mine') return t.pic === ME;
    if (filter === 'overdue') return isOverdue(t.due, t.st);
    return true;
  });
  const overdueCount = tasks.filter(t => isOverdue(t.due, t.st)).length;
  const active = tasks.filter(t => t.st !== 'Done').length;
  document.getElementById('task-meta').textContent = `${tasks.length} tasks · ${overdueCount} overdue · ${active} active`;

  const body = document.getElementById('tasks');
  const empty = document.getElementById('task-empty');
  if (!filtered.length) { body.innerHTML = ''; empty.style.display = 'flex'; return; }
  empty.style.display = 'none';
  body.innerHTML = filtered.map(t => `
    <tr>
      <td><input type="checkbox" ${t.st === 'Done' ? 'checked' : ''} onchange="toggleDone(${t.id})" style="accent-color: var(--primary); width:15px; height:15px;"/></td>
      <td><div style="font-weight: 600; color: var(--text); font-size:13px; ${t.st === 'Done' ? 'text-decoration: line-through; color: var(--text-muted)' : ''}">${t.desc}</div></td>
      <td><div style="font-size: 12px; color: var(--text-muted)">${t.proj}</div></td>
      <td>
        <div style="display:flex; align-items:center; gap: 7px;">
          <span style="width:24px; height:24px; border-radius:50%; background: ${t.pic === ME ? 'var(--primary)' : 'var(--surface-2)'}; color:${t.pic === ME ? '#fff' : 'var(--text-muted)'}; border:${t.pic === ME ? '0' : '1px solid var(--border)'}; font-size:9.5px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0;">${initials(t.pic)}</span>
          <span style="font-size: 12px; color: var(--text-muted)">${t.pic}</span>
        </div>
      </td>
      <td><span class="mono" style="font-size:12px; color: ${isOverdue(t.due, t.st) ? 'var(--primary)' : 'var(--text-muted)'}; font-weight: ${isOverdue(t.due, t.st) ? '600' : '400'}">${fmt(t.due)}</span></td>
      <td><span class="pill ${STATUS_PILL[t.st]}"><span class="dot"></span>${t.st}</span></td>
      <td><button onclick="delTask(${t.id})" style="background:transparent; border:0; color: var(--text-faint); cursor:pointer; padding: 4px; display:flex;" title="Delete"><span class="material-symbols-outlined" style="font-size: 16px">delete</span></button></td>
    </tr>
  `).join('');
}
function toggleDone(id) {
  const t = tasks.find(t => t.id === id);
  if (t) { t.st = t.st === 'Done' ? 'To Do' : 'Done'; renderTasks(); toast(`Task ${t.st === 'Done' ? 'completed' : 'reopened'}`, 'success', 1500); }
}
function delTask(id) {
  const t = tasks.find(t => t.id === id);
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
  toast(`Deleted "${(t?.desc || '').slice(0, 30)}…"`, 'info');
}

// ---------- Task modal ----------
function openTask() {
  // populate selects
  const proj = document.getElementById('t-proj');
  const pic = document.getElementById('t-pic');
  proj.innerHTML = PROJECT_OPTIONS.map(p => `<option>${p}</option>`).join('');
  pic.innerHTML = PEOPLE.map(p => `<option ${p === ME ? 'selected' : ''}>${p}</option>`).join('');
  document.getElementById('task-modal').style.display = 'flex';
  setTimeout(() => document.getElementById('t-desc').focus(), 50);
}
function closeTask() { document.getElementById('task-modal').style.display = 'none'; }
function addTask() {
  const desc = document.getElementById('t-desc').value.trim();
  if (!desc) { toast('Task description is required', 'error'); return; }
  tasks.unshift({
    id: nextId++, desc,
    proj: document.getElementById('t-proj').value,
    pic: document.getElementById('t-pic').value,
    due: document.getElementById('t-due').value,
    st: document.getElementById('t-st').value,
  });
  document.getElementById('t-desc').value = '';
  document.getElementById('t-due').value = '';
  renderTasks(); closeTask(); toast('Task added', 'success');
}

// ---------- Filter tabs ----------
document.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => {
  filter = b.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(x => {
    const on = x === b;
    x.classList.toggle('on', on);
    x.style.background = on ? 'var(--surface)' : 'transparent';
    x.style.color = on ? 'var(--text)' : 'var(--text-muted)';
    x.style.border = '0';
  });
  renderTasks();
}));

// ---------- Greeting by time ----------
function greet() {
  const h = new Date().getHours();
  const part = h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening';
  document.getElementById('greeting').textContent = `Good ${part}, Abu Rizal.`;
}

// expose handlers used by inline onclick
Object.assign(window, { toast, openTask, closeTask, addTask, toggleDone, delTask });

document.addEventListener('DOMContentLoaded', () => {
  greet();
  renderKpis();
  renderPriority();
  renderTasks();
  // initialise filter tab styles
  document.querySelectorAll('[data-filter]').forEach(x => {
    const on = x.classList.contains('on');
    x.style.background = on ? 'var(--surface)' : 'transparent';
    x.style.color = on ? 'var(--text)' : 'var(--text-muted)';
    x.style.border = '0';
  });
});
