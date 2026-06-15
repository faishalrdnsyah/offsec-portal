/* ============== Offensive Sec — shared shell builder ==============
   Each page sets <body data-page="..."> and includes this file.
   It builds the sidebar + topbar dynamically and handles theme/nav. */

(function () {
  const ROUTES = {
    'home':               'offsec-home.html',
    'dashboard':          'offsec-dashboard.html',
    'projects':           'offsec-projects.html',
    'project-detail':     'offsec-project-detail.html',
    'project-create':     'offsec-project-create.html',
    'findings':                'offsec-findings.html',
    'finding-detail':          'offsec-finding-detail.html',
    'finding-create':          'offsec-finding-create.html',
    'form-requirement':        'offsec-form-requirement.html',
    'form-requirement-detail': 'offsec-form-requirement-detail.html',
    'form-requirement-create': 'offsec-form-requirement-create.html',
    'risk':               'offsec-risk-acceptance.html',
    'risk-create':        'offsec-create-risk-acceptance.html',
    'master-application': '#',
    'master-customer':    '#',
    'master-vapt-task':   '#',
    'master-checklist':   '#',
    'user-management':    'offsec-users.html',
    'user-detail':        'offsec-user-detail.html',
    'user-create':        'offsec-user-create.html',
    'app-setting':        'offsec-app-setting.html',
    'settings':           '#',
    'switch':             'index.html',
  };

  const PAGE_INFO = {
    'home':            { t: 'Home', s: 'Quick actions & recent activity' },
    'dashboard':       { t: 'Vulnerability Assessment & Penetration Testing', s: 'Findings Overview · Cross-application' },
    'projects':        { t: 'Projects', s: 'All security engagements' },
    'project-detail':  { t: 'Project Detail', s: 'Engagement overview & status' },
    'project-create':  { t: 'New Project', s: 'Create a security engagement' },
    'findings':        { t: 'Finding', s: 'All security findings across applications' },
    'finding-detail':  { t: 'Finding Detail', s: 'Vulnerability overview & remediation' },
    'finding-create':          { t: 'New Finding', s: 'Log a vulnerability discovered during VAPT' },
    'form-requirement':        { t: 'Form & Requirement', s: 'Assessment forms and client requirements' },
    'form-requirement-detail': { t: 'Form & Requirement Detail', s: 'Form overview and linked requirements' },
    'form-requirement-create': { t: 'New Form & Requirement', s: 'Create an assessment form or requirement' },
    'risk':            { t: 'Risk Acceptance', s: 'Pending approvals · 3 open' },
    'risk-create':     { t: 'Request Risk Acceptance', s: 'Submit a new risk acceptance request' },
    'master-application': { t: 'Master Data · Application', s: 'Manage applications under assessment' },
    'master-customer': { t: 'Master Data · Customer', s: 'Manage customer organizations' },
    'master-vapt-task':{ t: 'Master Data · VAPT Task', s: 'Define standard VAPT task templates' },
    'master-checklist':{ t: 'Master Data · Checklist', s: 'Assessment checklists & methodologies' },
    'user-management': { t: 'User Management', s: 'Roles, permissions, and team members' },
    'user-detail':     { t: 'User Detail', s: 'Profile, permissions, and recent activity' },
    'user-create':     { t: 'New User', s: 'Provision a portal account' },
    'app-setting':     { t: 'Application Setting', s: 'System-wide application configuration' },
    'settings':        { t: 'Settings', s: 'System configuration' },
  };

  // Which sidebar item should be active for a given page id
  const NAV_ACTIVE = {
    'project-detail': 'projects',
    'project-create': 'projects',
    'finding-detail':          'findings',
    'finding-create':          'findings',
    'form-requirement-detail': 'form-requirement',
    'form-requirement-create': 'form-requirement',
    'user-detail':    'user-management',
    'user-create':    'user-management',
    'risk-create':    'risk',
  };

  const BRAND_LOGO = '<img src="logo.svg" alt="Offensive Sec" style="width:100%; height:100%; object-fit:contain; display:block;"/>';

  // ============== Theme persistence ==============
  function applyTheme(t)   { document.documentElement.setAttribute('data-theme',   t || 'dark'); }
  function applyDensity(d) { document.documentElement.setAttribute('data-density', d || 'comfortable'); }
  // Read saved state ASAP (before DOMContentLoaded) to avoid flash
  try {
    const t = localStorage.getItem('ofsec.theme');   if (t) applyTheme(t);   else applyTheme('dark');
    const d = localStorage.getItem('ofsec.density'); if (d) applyDensity(d); else applyDensity('comfortable');
  } catch (e) { applyTheme('dark'); applyDensity('comfortable'); }

  window.ofsec = {
    setTheme(t)   { applyTheme(t);   try { localStorage.setItem('ofsec.theme',   t); } catch (e) {} },
    setDensity(d) { applyDensity(d); try { localStorage.setItem('ofsec.density', d); } catch (e) {} },
  };

  // ============== Sidebar markup ==============
  function mountSidebar(pageId) {
    const navActive = NAV_ACTIVE[pageId] || pageId;
    const masterIds = ['master-application','master-customer','master-vapt-task','master-checklist'];
    const masterOpen = masterIds.includes(navActive);

    const link = (id, icon, label, extra = '') => {
      const isActive = navActive === id;
      const href = ROUTES[id] || '#';
      return `<a class="side-link ${isActive ? 'active' : ''}" href="${href}" data-nav="${id}">
        <span class="material-symbols-outlined">${icon}</span>
        <span class="side-label">${label}</span>
        ${extra}
      </a>`;
    };

    const subLink = (id, label) => {
      const isActive = navActive === id;
      return `<a class="side-link ${isActive ? 'active' : ''}" href="${ROUTES[id] || '#'}" data-nav="${id}">
        <span class="dot-mark"></span><span class="side-label">${label}</span>
      </a>`;
    };

    const aside = document.querySelector('aside[data-shell="sidebar"]');
    if (!aside) return;
    aside.className = 'rail';
    aside.innerHTML = `
      <div class="rail-brand">
        <div class="brand-mark">${BRAND_LOGO}</div>
        <div class="rail-brand-text">
          <div class="n">Offensive Sec</div>
          <div class="v">v2.4 · TEAM</div>
        </div>
      </div>
      <nav class="flex-1 overflow-y-auto" style="padding: 0 10px 12px;">
        <div class="rail-section-label">Workspace</div>
        ${link('home',       'home',       'Home')}
        ${link('dashboard',  'dashboard',  'Dashboard')}
        ${link('projects',   'folder_open','Projects')}
        ${link('findings',         'bug_report',   'Finding')}
        ${link('form-requirement', 'assignment',    'Form & Requirement')}
        ${link('risk',       'policy',     'Risk Acceptance', '<span class="side-badge">3</span>')}

        <button class="side-link ${masterOpen ? 'open' : ''}" id="master-toggle" type="button">
          <span class="material-symbols-outlined">database</span>
          <span class="side-label">Master Data</span>
          <span class="material-symbols-outlined side-chev">chevron_right</span>
        </button>
        <div id="master-sub" class="rail-sub ${masterOpen ? '' : 'closed'}">
          ${subLink('master-application','Application')}
          ${subLink('master-customer',   'Customer')}
          ${subLink('master-vapt-task',  'VAPT Task')}
          ${subLink('master-checklist',  'Checklist')}
        </div>

        ${link('user-management','manage_accounts','User Management')}
        ${link('app-setting',    'tune',           'Application Setting')}
      </nav>

      <div style="border-top:1px solid var(--border); padding: 10px; display:flex; flex-direction:column; gap:2px;">
        <button class="side-link" id="rail-collapse" type="button" title="Collapse sidebar">
          <span class="material-symbols-outlined" id="rail-collapse-icon">chevron_left</span>
          <span class="side-label">Collapse</span>
        </button>
        ${link('switch',   'swap_horiz', 'Switch Portal')}
        ${link('settings', 'settings',   'Settings')}
      </div>
    `;

    // Master submenu toggle
    document.getElementById('master-toggle').addEventListener('click', () => {
      const root = document.documentElement;
      const shell = document.querySelector('.shell');
      if (shell && shell.classList.contains('rail-collapsed')) {
        shell.classList.remove('rail-collapsed');
        document.getElementById('rail-collapse-icon').textContent = 'chevron_left';
        return;
      }
      const btn = document.getElementById('master-toggle');
      const sub = document.getElementById('master-sub');
      const isOpen = btn.classList.toggle('open');
      sub.classList.toggle('closed', !isOpen);
    });

    // Sidebar collapse
    document.getElementById('rail-collapse').addEventListener('click', () => {
      const shell = document.querySelector('.shell');
      const collapsed = shell.classList.toggle('rail-collapsed');
      document.getElementById('rail-collapse-icon').textContent = collapsed ? 'chevron_right' : 'chevron_left';
    });

    // Disable routes that go to '#'
    aside.querySelectorAll('a[data-nav]').forEach(a => {
      if (a.getAttribute('href') === '#') {
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const id = a.dataset.nav;
          const info = PAGE_INFO[id] || { t: id };
          alert(`"${info.t}" — coming soon.`);
        });
      }
    });
  }

  // ============== Topbar markup ==============
  function mountTopbar(pageId, opts = {}) {
    const tb = document.querySelector('header[data-shell="topbar"]');
    if (!tb) return;
    const info = PAGE_INFO[pageId] || { t: '', s: '' };
    const title = opts.title || info.t;
    const sub   = opts.sub   || info.s;
    tb.className = 'topbar';
    tb.innerHTML = `
      <div class="flex items-center" style="gap: 14px; min-width: 0;">
        <a class="tb-btn" href="../offensive-security-portal-presentation.html" title="Back to Presentation" style="text-decoration:none;">
          <span class="material-symbols-outlined">arrow_back</span>
        </a>
        <button class="tb-btn" id="rail-collapse-top" title="Toggle sidebar">
          <span class="material-symbols-outlined">menu</span>
        </button>
        <div>
          <h1 style="font-size: 17px; font-weight: 800; letter-spacing: -0.01em; margin: 0; color: var(--text); line-height: 1.2">${title}</h1>
          <p style="font-size: 12px; color: var(--text-muted); margin: 2px 0 0;">${sub}</p>
        </div>
      </div>
      <div class="flex items-center" style="gap: 8px;">
        <div style="text-align: right; font-size: 11.5px; color: var(--text-muted); margin-right: 6px; line-height: 1.25">
          Last refresh<br/>
          <strong class="mono" style="color: var(--text); font-weight: 700;">25-May-26 · 10:00</strong>
        </div>
        <button class="tb-btn" title="Notifications">
          <span class="material-symbols-outlined">notifications</span>
          <span class="notif-dot"></span>
        </button>
        <button class="tb-btn" id="chat-toggle" title="AI Assistant (⌘K)">
          <span class="material-symbols-outlined">smart_toy</span>
        </button>
        <button class="tb-btn" title="Profile" style="background: linear-gradient(135deg, var(--primary), #7c1d1d); color: #fff; font-weight: 700; font-size: 12px;">AR</button>
      </div>
    `;
    document.getElementById('rail-collapse-top').addEventListener('click', () => {
      const shell = document.querySelector('.shell');
      const collapsed = shell.classList.toggle('rail-collapsed');
      const ic = document.getElementById('rail-collapse-icon');
      if (ic) ic.textContent = collapsed ? 'chevron_right' : 'chevron_left';
    });
  }

  // ============== AI Chat panel ==============
  const STARTERS = [
    { icon: 'trending_up', text: 'What are the top 3 critical findings this month?' },
    { icon: 'lightbulb',   text: 'Suggest remediation for the SQL Injection on BSI - Infra' },
    { icon: 'summarize',   text: 'Summarize unresolved HIGH findings older than 30 days' },
    { icon: 'show_chart',  text: 'How is our remediation rate trending vs last quarter?' },
  ];
  const REPLIES = [
    "Looking at your dashboard, **3 HIGH-severity findings** are currently open: SQL Injection on `/api/v2/users` (BSI - Infra), Stored XSS on KTB - HRIS profile bio, and IDOR on MMKSI - D-Net Interface. The oldest has been open 14 days.",
    "For the SQL Injection on BSI - Infra: (1) replace string concatenation with parameterized queries, (2) add input validation at the API gateway, (3) enable WAF rule OWASP-942. Work item #114201 is assigned to Sarah Park — I can draft a remediation task if you'd like.",
    "Your remediation rate is **82.52%**, up from 76.8% last quarter. Mean time to remediation has improved from 6.4 days to 4.2 days. The biggest win was BSI - Infra closing 79 items via the Q1 patch cycle.",
    "I found **194 overdue findings**. The top contributor is BSI - Infra (103 open items), most of which are LOW severity (192). Want me to generate an action plan grouped by assignee?",
  ];

  let chatMessages = [{
    role: 'bot',
    text: "Hi! I'm your Offensive Sec AI assistant. I can help you analyze findings, suggest remediations, and generate reports. What would you like to explore?",
    time: '10:00',
  }];
  let chatOpen = false;

  function fmtText(t) {
    return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code style="font-family:JetBrains Mono,monospace; background:rgba(0,0,0,0.18); padding:1px 5px; border-radius:3px; font-size:0.9em">$1</code>');
  }

  function renderChat(isTyping) {
    const body = document.getElementById('shell-chat-body');
    if (!body) return;
    let html = chatMessages.map(m => `
      <div class="chat-msg ${m.role}">
        <div class="chat-bubble">${fmtText(m.text)}</div>
        <div class="chat-time">${m.time}</div>
      </div>
    `).join('');
    if (isTyping) {
      html += `<div class="chat-msg bot"><div class="chat-bubble chat-typing"><span></span><span></span><span></span></div></div>`;
    }
    if (chatMessages.length === 1 && !isTyping) {
      html += `<div style="display:flex; flex-direction:column; gap:6px; padding:8px 0">
        <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:var(--text-faint); padding:4px 4px 2px">Suggested</div>
        ${STARTERS.map((p, i) => `<button class="chat-suggest-chip" data-starter="${i}">
          <span class="material-symbols-outlined ico">${p.icon}</span>${p.text}
        </button>`).join('')}
      </div>`;
    }
    body.innerHTML = html;
    body.querySelectorAll('[data-starter]').forEach(btn => {
      btn.addEventListener('click', () => sendChat(STARTERS[+btn.dataset.starter].text));
    });
    body.scrollTop = body.scrollHeight;
  }

  function sendChat(text) {
    const t = (text || '').trim();
    if (!t) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    chatMessages.push({ role: 'user', text: t, time });
    const input = document.getElementById('shell-chat-input');
    if (input) { input.value = ''; input.style.height = 'auto'; }
    document.getElementById('shell-chat-send').disabled = true;
    renderChat(true);
    setTimeout(() => {
      const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)];
      chatMessages.push({ role: 'bot', text: reply, time });
      renderChat(false);
    }, 1100 + Math.random() * 700);
  }

  function toggleChat(force) {
    chatOpen = typeof force === 'boolean' ? force : !chatOpen;
    const panel = document.getElementById('shell-chat-panel');
    const btn = document.getElementById('chat-toggle');
    if (panel) panel.classList.toggle('open', chatOpen);
    if (btn) btn.classList.toggle('active', chatOpen);
    if (chatOpen) setTimeout(() => document.getElementById('shell-chat-input')?.focus(), 280);
  }

  function mountChat() {
    // Find the main column (sibling of sidebar, contains topbar + main)
    const sidebar = document.querySelector('aside[data-shell="sidebar"]');
    if (!sidebar) return;
    const mainCol = sidebar.nextElementSibling;
    if (!mainCol) return;
    // Ensure the main column is positioning context (it already should be)
    if (getComputedStyle(mainCol).position === 'static') mainCol.style.position = 'relative';

    const panel = document.createElement('aside');
    panel.id = 'shell-chat-panel';
    panel.className = 'chat-panel';
    panel.innerHTML = `
      <div class="chat-head">
        <div class="flex items-center" style="gap: 10px;">
          <div class="chat-head-avatar">
            <span class="material-symbols-outlined ms-fill" style="font-size: 19px">smart_toy</span>
          </div>
          <div style="line-height: 1.2;">
            <div style="font-weight: 700; font-size: 13.5px; color: var(--text);">Offensive Sec AI</div>
            <div style="font-size: 11px; color: var(--text-muted);">Online · Powered by AI</div>
          </div>
        </div>
        <div class="flex" style="gap: 4px;">
          <button class="tb-btn" id="shell-chat-new" title="New chat">
            <span class="material-symbols-outlined">edit_square</span>
          </button>
          <button class="tb-btn" id="shell-chat-close" title="Close">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>
      <div id="shell-chat-body" class="flex-1 overflow-y-auto flex flex-col" style="gap: 12px; padding: 16px;"></div>
      <div style="border-top: 1px solid var(--border); padding: 12px 14px; background: var(--surface);">
        <div class="chat-input-wrap">
          <textarea id="shell-chat-input" class="chat-input" rows="1" placeholder="Ask anything about your findings…"></textarea>
          <button id="shell-chat-send" class="chat-send" disabled>
            <span class="material-symbols-outlined" style="font-size: 18px">arrow_upward</span>
          </button>
        </div>
        <div style="text-align: center; font-size: 10.5px; color: var(--text-faint); margin-top: 6px;">
          AI responses may be inaccurate · <span class="mono">⌘+K</span> to toggle
        </div>
      </div>
    `;
    mainCol.appendChild(panel);

    // Bind controls
    document.getElementById('chat-toggle')?.addEventListener('click', () => toggleChat());
    document.getElementById('shell-chat-close').addEventListener('click', () => toggleChat(false));
    document.getElementById('shell-chat-new').addEventListener('click', () => {
      chatMessages = [chatMessages[0]];
      renderChat(false);
    });
    const input = document.getElementById('shell-chat-input');
    const sendBtn = document.getElementById('shell-chat-send');
    input.addEventListener('input', (e) => {
      sendBtn.disabled = !e.target.value.trim();
      e.target.style.height = 'auto';
      e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(input.value); }
    });
    sendBtn.addEventListener('click', () => sendChat(input.value));

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); toggleChat(); }
      if (e.key === 'Escape' && chatOpen) toggleChat(false);
    });

    renderChat(false);
  }

  // ============== Boot ==============
  document.addEventListener('DOMContentLoaded', () => {
    const pageId = document.body.dataset.page || 'dashboard';
    mountSidebar(pageId);
    mountTopbar(pageId, {
      title: document.body.dataset.title,
      sub:   document.body.dataset.sub,
    });
    mountChat();
  });
})();
