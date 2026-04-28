/* ═══════════════════════════════════════════════════════════════
   Lagos Ethereum Hub v3 — app.js
   UI logic only. All API calls go through api.js
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ── State ─────────────────────────────────────────────────────
const TODAY         = new Date().toISOString().split('T')[0];
let selectedType    = 'Co-working';
let previewMode     = 'members';
let qrTarget        = null;
let html5Scanner    = null;
let cameraActive    = false;
let lastScannedId   = '';
let lastScanTime    = 0;
let toastTimer      = null;
let pendingInterval = null;

// ── DOM ───────────────────────────────────────────────────────
const $  = id => document.getElementById(id);
const on = (id, ev, fn) => { const el=$(id); if(el) el.addEventListener(ev, fn); };

// ── Formatters ────────────────────────────────────────────────
function initials(n)  { return (n||'').split(' ').map(p=>p[0]||'').join('').toUpperCase().slice(0,2); }
function fmtDate(s)   { if(!s) return '—'; try { return new Date(s+'T00:00').toLocaleDateString('en-NG',{day:'numeric',month:'short',year:'numeric'}); } catch(e){return s;} }
function fmtTime(s)   { if(!s) return '—'; try { return new Date(s).toLocaleTimeString('en-NG',{hour:'2-digit',minute:'2-digit'}); } catch(e){return '—';} }
function fmtDT(s)     { if(!s) return '—'; try { const d=new Date(s); return d.toLocaleDateString('en-NG',{day:'numeric',month:'short'})+' '+d.toLocaleTimeString('en-NG',{hour:'2-digit',minute:'2-digit'}); } catch(e){return s;} }
function avClass(t)   { return 'av '+(t==='Training'?'av-tr':'av-co'); }
function bdgClass(t)  { return 'badge '+(t==='Training'?'badge-tr':'badge-co'); }
function statusBadge(s){ return `<span class="badge badge-${s}">${s}</span>`; }

// ── Toast ─────────────────────────────────────────────────────
function toast(msg, type='ok') {
  const el=$('toast');
  el.textContent=msg;
  el.className='show toast-'+type;
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>el.classList.remove('show'),4000);
}

// ── API status banner ─────────────────────────────────────────
function setBanner(selector, live, msg) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.className = 'fb-banner ' + (live?'live':'offline');
  el.innerHTML = `<div class="fb-dot"></div>${msg || (live ? 'Connected to API' : 'Cannot reach API — check config.js')}`;
}

// ══════════════════════════════════════════════════════════════
// BOOT & AUTH
// ══════════════════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  // Date display
  const td=$('topdate');
  if(td) td.textContent=new Date().toLocaleDateString('en-NG',{weekday:'long',day:'numeric',month:'long',year:'numeric'});

  // Attendance
  const ld=$('log-date');
  if(ld){ ld.value=TODAY; ld.addEventListener('change',renderAttendance); }

  on('lsearch','input',renderAttendance);
  on('ltype','change',renderAttendance);
  on('msearch','input',renderMembers);
  on('mtype','change',renderMembers);
  on('mstatus','change',renderMembers);
  on('login-pass','keydown', e=>{ if(e.key==='Enter') doLogin(); });

  document.querySelectorAll('.preview-tab').forEach(btn =>
    btn.addEventListener('click', ()=>setPreviewTab(btn.dataset.mode))
  );

  // Check if already logged in
  if (API.isLoggedIn()) {
    const admin = API.getStoredAdmin();
    if (admin) { bootApp(admin); return; }
  }
  showLogin();
});

function showLogin() {
  $('login-screen').style.display = 'flex';
  $('app-shell').style.display    = 'none';
}

function bootApp(admin) {
  $('login-screen').style.display = 'none';
  $('app-shell').style.display    = 'flex';
  $('admin-name').textContent     = admin.name || admin.email;
  startPendingPoll();
  goPage('dashboard', $('nav-dashboard'));
}

async function doLogin() {
  const email = ($('login-email').value||'').trim();
  const pass  = ($('login-pass').value||'').trim();
  const btn   = $('login-btn');
  const errEl = $('login-err');
  errEl.style.display='none';
  if (!email||!pass) { errEl.textContent='Please enter your email and password.'; errEl.style.display='block'; return; }
  btn.innerHTML='<span class="spinner"></span> Signing in…'; btn.disabled=true;
  try {
    const { admin } = await API.login(email, pass);
    btn.innerHTML='Sign in'; btn.disabled=false;
    bootApp(admin);
  } catch(e) {
    errEl.textContent = e.status===401 ? 'Invalid email or password.' : 'Login error: '+e.message;
    errEl.style.display='block';
    btn.innerHTML='Sign in'; btn.disabled=false;
  }
}

async function doLogout() {
  stopCamera();
  clearInterval(pendingInterval);
  await API.logout();
  showLogin();
}

// Poll for pending count every 30s
function startPendingPoll() {
  updatePendingBadge();
  pendingInterval = setInterval(updatePendingBadge, 30000);
}
async function updatePendingBadge() {
  try {
    const { data } = await API.getMembers({ status:'pending', limit:1 });
    // We need total — use stats
    const stats = await API.getStats();
    const count = stats.pending_members || 0;
    const badge = $('pending-badge');
    if (badge) { badge.textContent=count||''; badge.style.display=count?'inline-flex':'none'; }
  } catch(e) {}
}

// ══════════════════════════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════════════════════════
function goPage(id, btn) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.remove('active'));
  const page=$('page-'+id);
  if(page) page.classList.add('active');
  if(btn)  btn.classList.add('active');
  if(id!=='checkin') stopCamera();
  ({
    dashboard:  renderDashboard,
    approvals:  renderApprovals,
    checkin:    initCheckin,
    members:    renderMembers,
    attendance: renderAttendance,
    export:     renderExport,
  })[id]?.();
}

// ══════════════════════════════════════════════════════════════
// REGISTER
// ══════════════════════════════════════════════════════════════
function openReg() {
  pickType('Co-working');
  ['rf','rl','re','rp'].forEach(id=>{ const el=$(id); if(el) el.value=''; });
  $('reg-err').style.display='none';
  $('reg-modal').classList.add('open');
  setTimeout(()=>{ $('rf')?.focus(); },120);
}
function closeReg() { $('reg-modal').classList.remove('open'); }
function pickType(t) {
  selectedType=t;
  $('pill-co').className='type-pill'+(t==='Co-working'?' cowork':'');
  $('pill-tr').className='type-pill'+(t==='Training'?' training':'');
}

async function submitReg() {
  const fn=($('rf').value||'').trim(), ln=($('rl').value||'').trim();
  const em=($('re').value||'').trim(), ph=($('rp').value||'').trim();
  const errEl=$('reg-err');
  errEl.style.display='none';
  if(!fn||!ln||!em) { errEl.textContent='Please fill in all required fields.'; errEl.style.display='block'; return; }
  if(!/\S+@\S+\.\S+/.test(em)) { errEl.textContent='Please enter a valid email address.'; errEl.style.display='block'; return; }

  const btn=$('reg-submit');
  btn.innerHTML='<span class="spinner"></span>'; btn.disabled=true;

  try {
    const member = await API.createMember({ first_name:fn, last_name:ln, email:em, phone:ph, type:selectedType });
    closeReg();
    toast(fn+' '+ln+' submitted for approval! ID: '+member.id, 'ok');
    updatePendingBadge();
    renderDashboard();
  } catch(e) {
    errEl.textContent = e.status===409 ? 'A member with this email already exists.' : 'Error: '+e.message;
    errEl.style.display='block';
  } finally {
    btn.innerHTML='Register & submit for approval'; btn.disabled=false;
  }
}

// ══════════════════════════════════════════════════════════════
// ADMIN APPROVAL
// ══════════════════════════════════════════════════════════════
async function renderApprovals() {
  const container=$('approvals-list');
  if(!container) return;
  container.innerHTML='<div class="empty">Loading…</div>';
  setBanner('.banner-approvals', true, 'Live from API');

  try {
    const { data, total } = await API.getMembers({ status:'pending', limit:100 });
    $('approvals-count').textContent = total ? total+' pending' : '0 pending';

    if(!data.length) {
      container.innerHTML='<div class="empty" style="padding:2rem">✓ No pending approvals. All registrations are reviewed.</div>';
      return;
    }

    container.innerHTML = data.map(m => `
      <div class="approval-card urgent" id="acard-${m.id}">
        <div class="${avClass(m.type)}" style="width:44px;height:44px;font-size:14px">${initials(m.name)}</div>
        <div class="approval-info">
          <div class="approval-name">${m.name}</div>
          <div class="approval-meta">
            ${m.email} · ${m.phone||'no phone'}<br>
            <span class="${bdgClass(m.type)}">${m.type}</span>
            <span style="font-size:11px;color:var(--text3);margin-left:4px">Submitted ${fmtDate(m.registered_on)}</span>
          </div>
        </div>
        <div class="approval-actions">
          <button class="btn btn-green btn-xs" onclick="approveMember('${m.id}','${m.name}')">✓ Approve</button>
          <button class="btn btn-ghost btn-xs" onclick="openRejectModal('${m.id}','${m.name}')">✗ Reject</button>
          <button class="btn btn-blue btn-xs" onclick="viewDetail('${m.id}')">View</button>
        </div>
      </div>`).join('');
  } catch(e) {
    container.innerHTML=`<div class="empty">API error: ${e.message}<br><small>Check your API_URL in config.js</small></div>`;
    setBanner('.banner-approvals', false);
  }
}

async function approveMember(id, name) {
  const btn = document.querySelector(`#acard-${id} .btn-green`);
  if(btn) { btn.innerHTML='<span class="spinner"></span>'; btn.disabled=true; }
  try {
    await API.approveMember(id);
    toast(name+' approved! QR code is now active.', 'good');
    // Remove card with animation
    const card=$('acard-'+id);
    if(card){ card.style.opacity='0'; card.style.transition='opacity .3s'; setTimeout(()=>card.remove(),300); }
    updatePendingBadge();
    renderDashboard();
    // Show QR for newly approved member
    const member = await API.getMember(id);
    showQr(member);
  } catch(e) {
    toast('Approve error: '+e.message,'err');
    if(btn){ btn.innerHTML='✓ Approve'; btn.disabled=false; }
  }
}

function openRejectModal(id, name) {
  $('reject-name').textContent=name;
  $('reject-reason').value='';
  $('reject-modal').classList.add('open');
  $('reject-modal').dataset.memberId=id;
  $('reject-modal').dataset.memberName=name;
}
function closeRejectModal() { $('reject-modal').classList.remove('open'); }

async function submitReject() {
  const id     = $('reject-modal').dataset.memberId;
  const name   = $('reject-modal').dataset.memberName;
  const reason = ($('reject-reason').value||'').trim();
  const btn    = $('reject-submit');
  btn.innerHTML='<span class="spinner"></span>'; btn.disabled=true;
  try {
    await API.rejectMember(id, reason);
    closeRejectModal();
    toast(name+' registration rejected.', 'warn');
    renderApprovals();
    updatePendingBadge();
    renderDashboard();
  } catch(e) {
    toast('Reject error: '+e.message,'err');
  } finally {
    btn.innerHTML='Confirm rejection'; btn.disabled=false;
  }
}

// ══════════════════════════════════════════════════════════════
// QR CHECK-IN — Camera only
// ══════════════════════════════════════════════════════════════
function initCheckin() {
  renderCiLog();
}

async function startCamera() {
  if (cameraActive) { stopCamera(); return; }

  const readerEl = $('qr-reader');
  readerEl.style.display='block';
  readerEl.innerHTML='';

  const btn=$('camera-btn');
  btn.innerHTML='<span class="spinner"></span> Starting camera…';
  btn.disabled=true;
  btn.className='btn btn-red btn-sm';

  if(typeof Html5Qrcode==='undefined') {
    toast('QR scanner library not loaded. Check internet connection.','err');
    resetCameraBtn(); return;
  }

  try {
    html5Scanner = new Html5Qrcode('qr-reader');
    const cameras = await Html5Qrcode.getCameras();
    if(!cameras.length) { toast('No camera found on this device.','err'); resetCameraBtn(); return; }

    // Prefer back / environment camera for phones; fallback to first
    const cam = cameras.find(c=>/back|environment|rear/i.test(c.label)) || cameras[0];

    await html5Scanner.start(
      cam.id,
      { fps: CONFIG.SCAN_FPS, qrbox: { width: CONFIG.SCAN_BOX_SIZE, height: CONFIG.SCAN_BOX_SIZE } },
      onQrSuccess,
      () => {} // suppress per-frame errors
    );

    cameraActive=true;
    btn.innerHTML='⏹ Stop camera';
    btn.disabled=false;
    $('camera-hint').textContent='Camera active — point at a member QR code';

  } catch(e) {
    toast('Camera error: '+e.message,'err');
    resetCameraBtn();
    readerEl.style.display='none';
  }
}

async function stopCamera() {
  if(html5Scanner) { try { await html5Scanner.stop(); html5Scanner.clear(); } catch(e){} html5Scanner=null; }
  cameraActive=false;
  const el=$('qr-reader'); if(el) { el.style.display='none'; el.innerHTML=''; }
  resetCameraBtn();
  const hint=$('camera-hint');
  if(hint) hint.textContent='Tap button to start the camera scanner';
}

function resetCameraBtn() {
  const btn=$('camera-btn');
  if(!btn) return;
  btn.innerHTML='📷 Start camera scanner';
  btn.disabled=false;
  btn.className='btn btn-blue btn-sm';
}

// Called by html5-qrcode on a successful decode
async function onQrSuccess(decodedText) {
  const id = decodedText.trim().toUpperCase();
  const now = Date.now();
  if(id===lastScannedId && now-lastScanTime < CONFIG.SCAN_DEBOUNCE_MS) return;
  lastScannedId=id; lastScanTime=now;
  await processCheckin(id);
}

async function processCheckin(memberId) {
  setScanResult('loading', null, 'Looking up '+memberId+'…');
  try {
    const result = await API.checkin(memberId);

    if(result.status==='checked_in') {
      const m=result.member;
      setScanResult('ok', m, `Visit #${result.log.visit_num} · ${m.type} · ${fmtDT(result.log.time)}`);
      toast(`✓ ${m.name} checked in! Visit #${result.log.visit_num}`, 'good');
      renderCiLog();
      renderDashboard();

    } else if(result.status==='already_checked_in') {
      const m=result.member;
      setScanResult('warn', m, `Already checked in today at ${fmtTime(result.checked_in_at)}`);
      toast(m.name+' already checked in today.', 'warn');

    } else if(result.status==='not_approved') {
      setScanResult('err', null, `Registration ${result.member_status} — cannot check in. Please see the admin.`);
      toast('Member not approved for check-in.', 'warn');
    }
  } catch(e) {
    if(e.status===404) {
      setScanResult('err', null, `QR code "${memberId}" not found in the system.`);
      toast('Unknown QR code: '+memberId, 'err');
    } else {
      setScanResult('err', null, 'API error: '+e.message);
      toast('Check-in error: '+e.message, 'err');
    }
  }
}

function setScanResult(type, member, message) {
  const box=$('scan-result'); if(!box) return;
  if(type==='loading') {
    box.innerHTML=`<div class="ci-result" style="background:var(--blue-50);border:1px solid var(--blue-100)"><span class="spinner" style="border-color:var(--blue-200);border-top-color:var(--blue-600)"></span>&nbsp; ${message}</div>`;
    return;
  }
  const cfg={
    ok:   {bg:'var(--green-lt)', border:'#a9dfbf', text:'var(--green-dk)', icon:'✓'},
    warn: {bg:'var(--amber-lt)', border:'#f9e4b7', text:'var(--amber-dk)', icon:'⚠'},
    err:  {bg:'var(--red-lt)',   border:'#f5c6c2', text:'var(--red-dk)',   icon:'✗'},
  }[type];
  box.innerHTML=`
    <div class="ci-result ${type}" style="background:${cfg.bg};border-color:${cfg.border}">
      ${member
        ? `<div class="${avClass(member.type)}" style="width:44px;height:44px;font-size:14px">${initials(member.name)}</div>
           <div style="flex:1"><div style="font-weight:700;color:${cfg.text};font-size:15px">${member.name}</div>
           <div style="font-size:13px;color:${cfg.text}">${message}</div></div>`
        : `<div style="font-size:26px;color:${cfg.text}">${cfg.icon}</div>
           <div style="font-size:13px;color:${cfg.text}">${message}</div>`
      }
      ${type==='ok'?`<div style="font-size:30px;color:var(--green)">✓</div>`:''}
    </div>`;
}

// Today's check-in log
async function renderCiLog() {
  const el=$('ci-log'), cnt=$('ci-page-count');
  if(!el) return;
  try {
    const { data, total } = await API.getAttendance({ date:TODAY, limit:100 });
    if(cnt) cnt.textContent=total?total+' today':'';
    el.innerHTML=data.length
      ? data.map(l=>`
          <div class="ci-log-item">
            <div class="row-person">
              <div class="${avClass(l.type)}" style="width:30px;height:30px;font-size:11px">${initials(l.name)}</div>
              <div><div style="font-size:13px;font-weight:600">${l.name}</div>
              <div style="font-size:11px;color:var(--text2)">${l.type}</div></div>
            </div>
            <div style="text-align:right">
              <div style="font-size:12px;font-family:var(--fm);color:var(--text2)">${fmtTime(l.time)}</div>
              <div style="font-size:11px;color:var(--text3)">Visit #${l.visit_num}</div>
            </div>
          </div>`).join('')
      : '<div class="empty">No check-ins yet today.<br>Start the camera and scan a member QR.</div>';
  } catch(e) {
    el.innerHTML=`<div class="empty">API error: ${e.message}</div>`;
  }
}

// ══════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════
async function renderDashboard() {
  setBanner('.banner-dashboard', true, 'Live from API');
  try {
    const [stats, todayRes, recentRes] = await Promise.all([
      API.getStats(),
      API.getAttendance({ date:TODAY, limit:8 }),
      API.getMembers({ limit:6 }),
    ]);

    $('metrics').innerHTML=[
      {lbl:'Approved members', val:stats.approved_members,  cls:''},
      {lbl:'Checked in today', val:stats.checkins_today,    cls:'hi'},
      {lbl:'Pending approval', val:stats.pending_members,   cls:'warn'},
      {lbl:'Co-working',       val:stats.coworking_members, cls:'blue'},
    ].map(m=>`<div class="metric ${m.cls}"><div class="metric-num">${m.val}</div><div class="metric-lbl">${m.lbl}</div></div>`).join('');

    const sub=$('dash-sub');
    if(sub) sub.textContent=new Date().toLocaleDateString('en-NG',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
    const cnt=$('ci-today-count');
    if(cnt) cnt.textContent=stats.checkins_today?stats.checkins_today+' today':'';

    $('dash-today').innerHTML=todayRes.data.length
      ? todayRes.data.map(l=>`
          <div class="feed-item">
            <div class="row-person">
              <div class="${avClass(l.type)}" style="width:30px;height:30px;font-size:11px">${initials(l.name)}</div>
              <div><div style="font-size:13px;font-weight:600">${l.name}</div>
              <div style="font-size:11px;color:var(--text2)">${l.type}</div></div>
            </div>
            <span style="font-size:12px;color:var(--text2);font-family:var(--fm)">${fmtTime(l.time)}</span>
          </div>`).join('')
      : '<div class="empty">No check-ins yet today.</div>';

    $('dash-recent').innerHTML=recentRes.data.length
      ? recentRes.data.map(m=>`
          <div class="feed-item">
            <div class="row-person">
              <div class="${avClass(m.type)}">${initials(m.name)}</div>
              <div><div style="font-size:13px;font-weight:600">${m.name}</div>
              <div style="font-size:11px;color:var(--text2)">${fmtDate(m.registered_on)}</div></div>
            </div>
            <div style="display:flex;gap:5px;align-items:center">
              <span class="${bdgClass(m.type)}">${m.type}</span>
              ${statusBadge(m.status)}
            </div>
          </div>`).join('')
      : '<div class="empty">No members registered yet.</div>';

  } catch(e) {
    setBanner('.banner-dashboard', false);
    $('metrics').innerHTML='<div style="grid-column:1/-1" class="empty">Cannot reach API: '+e.message+'<br><small>Edit API_URL in config.js</small></div>';
  }
}

// ══════════════════════════════════════════════════════════════
// MEMBERS
// ══════════════════════════════════════════════════════════════
async function renderMembers() {
  const tbody=$('mtbody'); if(!tbody) return;
  tbody.innerHTML='<tr><td colspan="8" class="empty">Loading…</td></tr>';
  try {
    const { data, total } = await API.getMembers({
      search: $('msearch')?.value||'',
      type:   $('mtype')?.value||'',
      status: $('mstatus')?.value||'',
      limit:  200,
    });
    const sub=$('members-sub');
    if(sub) sub.textContent=total+' member'+(total!==1?'s':'');
    tbody.innerHTML=data.length
      ? data.map(m=>`<tr>
          <td><div class="row-person">
            <div class="${avClass(m.type)}">${initials(m.name)}</div>
            <div><div style="font-weight:600">${m.name}</div>
            <div style="font-size:11px;color:var(--text2)">${m.email}</div></div>
          </div></td>
          <td><span class="mono">${m.id}</span></td>
          <td><span class="${bdgClass(m.type)}">${m.type}</span></td>
          <td>${statusBadge(m.status)}</td>
          <td>${fmtDate(m.registered_on)}</td>
          <td style="font-family:var(--fm);font-weight:600">${m.visits||0}</td>
          <td>${fmtDate(m.last_seen)}</td>
          <td><div style="display:flex;gap:5px;flex-wrap:wrap">
            ${m.status==='approved'?`<button class="btn btn-ghost btn-xs" onclick="viewDetail('${m.id}')">Detail</button><button class="btn btn-ghost btn-xs" onclick="showQrById('${m.id}')">QR</button>`:''}
            ${m.status==='pending'?`<button class="btn btn-green btn-xs" onclick="approveMember('${m.id}','${m.name}')">Approve</button>`:''}
            <button class="btn btn-danger" onclick="deleteMemberUI('${m.id}','${m.name}')">Delete</button>
          </div></td>
        </tr>`).join('')
      : `<tr><td colspan="8" class="empty">${total===0?'No members yet.':'No results match your filters.'}</td></tr>`;
  } catch(e) {
    tbody.innerHTML=`<tr><td colspan="8" class="empty">API error: ${e.message}</td></tr>`;
  }
}

async function deleteMemberUI(id, name) {
  if(!confirm('Delete '+name+' and all their attendance records?')) return;
  try {
    await API.deleteMember(id);
    toast(name+' deleted.', 'warn');
    renderMembers(); renderDashboard(); updatePendingBadge();
  } catch(e) { toast('Delete error: '+e.message,'err'); }
}

async function viewDetail(id) {
  try {
    const m = await API.getMember(id);
    $('detail-content').innerHTML=`
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px">
        <div class="${avClass(m.type)}" style="width:52px;height:52px;font-size:16px">${initials(m.name)}</div>
        <div><div style="font-size:18px;font-weight:800;color:var(--blue-800)">${m.name}</div>
        <div style="display:flex;gap:6px;margin-top:4px"><span class="${bdgClass(m.type)}">${m.type}</span>${statusBadge(m.status)}</div></div>
      </div>
      ${[
        ['Member ID',   `<span class="mono">${m.id}</span>`],
        ['Email',       m.email],
        ['Phone',       m.phone||'—'],
        ['Registered',  fmtDate(m.registered_on)],
        ['Approved by', m.approved_by||'—'],
        ['Approved on', fmtDT(m.approved_at)],
        ['Total visits',`<span style="font-family:var(--fm);font-weight:700">${m.visits||0}</span>`],
        ['Last seen',   fmtDate(m.last_seen)],
      ].map(([l,v])=>`<div class="detail-row"><span class="detail-label">${l}</span><span class="detail-value">${v}</span></div>`).join('')}`;
    $('detail-qr-btn').onclick=()=>{ closeDetailModal(); showQr(m); };
    $('detail-modal').classList.add('open');
  } catch(e) { toast('Error loading member: '+e.message,'err'); }
}
function closeDetailModal() { $('detail-modal').classList.remove('open'); }

async function showQrById(id) {
  try { const m=await API.getMember(id); showQr(m); } catch(e) { toast('Error: '+e.message,'err'); }
}

// ══════════════════════════════════════════════════════════════
// QR CODE
// ══════════════════════════════════════════════════════════════
function showQr(member) {
  qrTarget=member;
  $('qm-name').textContent  = member.name;
  $('qm-id').textContent    = member.id;
  $('qm-email').textContent = member.email;
  $('qm-badge').innerHTML   = `<span class="${bdgClass(member.type)}">${member.type}</span>`;
  $('qm-status').innerHTML  = statusBadge(member.status);
  drawQr(member.id, member.type);
  $('qr-modal').classList.add('open');
}
function closeQr() { $('qr-modal').classList.remove('open'); }
function saveQr() {
  if(!qrTarget) return;
  const a=document.createElement('a');
  a.href=$('qr-canvas').toDataURL('image/png');
  a.download=qrTarget.id+'-qr.png'; a.click();
  toast('QR saved as '+qrTarget.id+'-qr.png');
}

function drawQr(id, type) {
  const canvas=$('qr-canvas'); if(!canvas) return;
  const ctx=canvas.getContext('2d');
  const size=200, cs=Math.floor(size/14);
  ctx.clearRect(0,0,size,size);
  const isTr=type==='Training';
  const fg=isTr?'#7a4e0a':'#0d3b5e';
  const bg=isTr?'#fef3dc':'#eaf4fb';
  ctx.fillStyle=bg; ctx.fillRect(0,0,size,size);
  let seed=0;
  for(let i=0;i<id.length;i++) seed=((seed<<5)-seed+id.charCodeAt(i))|0;
  function rng(s){ const x=Math.sin(s+Math.abs(seed))*43758.5453; return x-Math.floor(x); }
  ctx.fillStyle=fg;
  const cols=14, rows=14;
  for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){
    const inTL=r<3&&c<3, inTR=r<3&&c>=cols-3, inBL=r>=rows-3&&c<3;
    if(inTL||inTR||inBL){
      const or=r<3?0:rows-3, oc=c<3?0:cols-3, dr=r-or, dc=c-oc;
      if(dr===0||dr===2||dc===0||dc===2||(dr===1&&dc===1)) ctx.fillRect(c*cs,r*cs,cs,cs);
    } else if(rng(r*cols+c)>0.44){ ctx.fillRect(c*cs+1,r*cs+1,cs-2,cs-2); }
  }
  ctx.fillStyle=fg;
  ctx.font='bold 8px "JetBrains Mono",monospace';
  ctx.textAlign='center'; ctx.textBaseline='bottom';
  ctx.fillText(id+' · LAGOS ETH HUB', size/2, size-2);
}

// ══════════════════════════════════════════════════════════════
// ATTENDANCE
// ══════════════════════════════════════════════════════════════
async function renderAttendance() {
  const tbody=$('ltbody'); if(!tbody) return;
  tbody.innerHTML='<tr><td colspan="6" class="empty">Loading…</td></tr>';
  try {
    const { data } = await API.getAttendance({
      date:   $('log-date')?.value||'',
      search: $('lsearch')?.value||'',
      type:   $('ltype')?.value||'',
      limit:  500,
    });
    tbody.innerHTML=data.length
      ? data.map(l=>`<tr>
          <td><div class="row-person">
            <div class="${avClass(l.type)}" style="width:28px;height:28px;font-size:11px">${initials(l.name)}</div>
            <span style="font-weight:600">${l.name}</span>
          </div></td>
          <td><span class="mono">${l.member_id}</span></td>
          <td><span class="${bdgClass(l.type)}">${l.type}</span></td>
          <td>${fmtDate(l.date)}</td>
          <td style="font-family:var(--fm)">${fmtTime(l.time)}</td>
          <td style="font-family:var(--fm);font-weight:600">${l.visit_num}</td>
        </tr>`).join('')
      : '<tr><td colspan="6" class="empty">No attendance records found.</td></tr>';
  } catch(e) {
    tbody.innerHTML=`<tr><td colspan="6" class="empty">API error: ${e.message}</td></tr>`;
  }
}

// ══════════════════════════════════════════════════════════════
// EXPORT
// ══════════════════════════════════════════════════════════════
async function renderExport() {
  try {
    const stats=await API.getStats();
    $('exp-member-count').textContent=stats.total_members+' records';
    $('exp-log-count').textContent=(stats.checkins_this_month||0)+' this month';
    renderPreview();
  } catch(e) {}
}

async function dlMembers() {
  try {
    const data=await API.exportMembers();
    const rows=[['ID','Name','Email','Phone','Type','Status','Registered','Visits','Last Seen','Approved By'],
      ...data.map(m=>[m.id,m.name,m.email,m.phone||'',m.type,m.status,m.registered_on,m.visits||0,m.last_seen||'',m.approved_by||''])];
    dlFile(toCSV(rows),'lec-members.csv','text/csv');
    toast('Members CSV downloaded');
  } catch(e){ toast('Export error: '+e.message,'err'); }
}
async function dlLogs() {
  try {
    const data=await API.exportLogs();
    const rows=[['Member ID','Name','Type','Date','Time','Visit #'],
      ...data.map(l=>[l.member_id,l.name,l.type,l.date,fmtTime(l.time),l.visit_num])];
    dlFile(toCSV(rows),'lec-attendance.csv','text/csv');
    toast('Attendance CSV downloaded');
  } catch(e){ toast('Export error: '+e.message,'err'); }
}
async function copyMembers() {
  try {
    const data=await API.exportMembers();
    const rows=[['ID','Name','Email','Phone','Type','Status','Registered','Visits'],
      ...data.map(m=>[m.id,m.name,m.email,m.phone||'',m.type,m.status,m.registered_on,m.visits||0])];
    await navigator.clipboard.writeText(toTSV(rows));
    toast('Copied — paste into Google Sheets (Ctrl+V)');
  } catch(e){ toast('Copy failed. Use Download CSV.','err'); }
}
async function copyLogs() {
  try {
    const data=await API.exportLogs();
    const rows=[['Member ID','Name','Type','Date','Time','Visit #'],
      ...data.map(l=>[l.member_id,l.name,l.type,l.date,fmtTime(l.time),l.visit_num])];
    await navigator.clipboard.writeText(toTSV(rows));
    toast('Copied — paste into Google Sheets (Ctrl+V)');
  } catch(e){ toast('Copy failed. Use Download CSV.','err'); }
}

async function renderPreview() {
  const isM=previewMode==='members';
  try {
    const data=isM ? (await API.getMembers({limit:8})).data : (await API.getAttendance({limit:8})).data;
    const head=isM?['ID','Name','Email','Type','Status','Registered','Visits']:['Member ID','Name','Type','Date','Time','Visit #'];
    const rows=data.map(x=>isM?[x.id,x.name,x.email,x.type,x.status,x.registered_on,x.visits||0]:[x.member_id,x.name,x.type,x.date,fmtTime(x.time),x.visit_num]);
    $('prev-head').innerHTML='<tr>'+head.map(h=>`<th>${h}</th>`).join('')+'</tr>';
    $('prev-body').innerHTML=rows.length?rows.map(r=>'<tr>'+r.map(c=>`<td>${c}</td>`).join('')+'</tr>').join(''):`<tr><td colspan="${head.length}" class="empty">No data yet.</td></tr>`;
  } catch(e) {
    $('prev-body').innerHTML=`<tr><td colspan="7" class="empty">API error: ${e.message}</td></tr>`;
  }
}
function setPreviewTab(mode) {
  previewMode=mode;
  document.querySelectorAll('.preview-tab').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
  renderPreview();
}

// ── File utils ────────────────────────────────────────────────
function toCSV(rows){ return rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n'); }
function toTSV(rows){ return rows.map(r=>r.join('\t')).join('\n'); }
function dlFile(content,name,mime){
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([content],{type:mime}));
  a.download=name; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
