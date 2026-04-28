/* ═══════════════════════════════════════════════════════════════
   Lagos Ethereum Hub — api.js
   All HTTP calls to the backend. No UI code here.
   ═══════════════════════════════════════════════════════════════ */

'use strict';

const API = (() => {

  // ── Internal: make an authenticated request ─────────────────
  async function request(method, path, body = null) {
    const token = localStorage.getItem(CONFIG.TOKEN_KEY);
    const opts = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
    };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(CONFIG.API_URL + path, opts);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const err = new Error(data.error || 'Request failed (' + res.status + ')');
      err.status = res.status;
      err.data   = data;
      throw err;
    }
    return data;
  }

  const get    = (path)        => request('GET',    path);
  const post   = (path, body)  => request('POST',   path, body);
  const patch  = (path, body)  => request('PATCH',  path, body);
  const del    = (path)        => request('DELETE', path);

  // ── Auth ─────────────────────────────────────────────────────
  async function login(email, password) {
    const data = await post('/auth/login', { email, password });
    localStorage.setItem(CONFIG.TOKEN_KEY, data.token);
    localStorage.setItem(CONFIG.ADMIN_KEY, JSON.stringify(data.admin));
    return data;
  }

  async function logout() {
    try { await post('/auth/logout'); } catch(e) {}
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.ADMIN_KEY);
  }

  function getStoredAdmin() {
    try { return JSON.parse(localStorage.getItem(CONFIG.ADMIN_KEY)); } catch(e) { return null; }
  }

  function isLoggedIn() {
    return !!localStorage.getItem(CONFIG.TOKEN_KEY);
  }

  // ── Members ──────────────────────────────────────────────────
  function getMembers(params = {}) {
    const qs = new URLSearchParams(Object.entries(params).filter(([,v]) => v !== '' && v !== null && v !== undefined));
    return get('/members' + (qs.toString() ? '?' + qs : ''));
  }

  function getMember(id)               { return get('/members/' + id); }
  function createMember(data)          { return post('/members', data); }
  function approveMember(id)           { return patch('/members/' + id + '/approve'); }
  function rejectMember(id, reason)    { return patch('/members/' + id + '/reject', { reason }); }
  function deleteMember(id)            { return del('/members/' + id); }

  // ── Check-in ─────────────────────────────────────────────────
  function checkin(member_id)          { return post('/checkin', { member_id }); }

  // ── Attendance ───────────────────────────────────────────────
  function getAttendance(params = {}) {
    const qs = new URLSearchParams(Object.entries(params).filter(([,v]) => v !== '' && v !== null && v !== undefined));
    return get('/attendance' + (qs.toString() ? '?' + qs : ''));
  }

  // ── Stats ────────────────────────────────────────────────────
  function getStats() { return get('/stats'); }

  // ── Export helpers ────────────────────────────────────────────
  async function exportMembers() {
    const { data } = await getMembers({ limit: 9999 });
    return data;
  }
  async function exportLogs() {
    const { data } = await getAttendance({ limit: 99999 });
    return data;
  }

  return {
    login, logout, getStoredAdmin, isLoggedIn,
    getMembers, getMember, createMember, approveMember, rejectMember, deleteMember,
    checkin,
    getAttendance,
    getStats,
    exportMembers, exportLogs,
  };
})();
