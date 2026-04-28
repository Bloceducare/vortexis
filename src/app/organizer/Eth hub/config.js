/* ═══════════════════════════════════════════════════════════════
   Lagos Ethereum Hub — config.js
   Set your API base URL here before deploying.
   ═══════════════════════════════════════════════════════════════ */

const CONFIG = {
  // ── Your backend REST API base URL ───────────────────────────
  // Examples:
  //   "https://api.lagosethhub.org/v1"
  //   "https://lagos-eth-hub.onrender.com/v1"
  //   "http://localhost:3000/v1"   ← for local development
  API_URL: "https://your-api-url.com/v1",

  // ── App display name ──────────────────────────────────────────
  HUB_NAME: "Lagos Ethereum Hub",

  // ── QR scanner settings ───────────────────────────────────────
  SCAN_FPS: 10,              // frames per second for QR detection
  SCAN_BOX_SIZE: 250,        // pixel size of the scanning area
  SCAN_DEBOUNCE_MS: 3000,    // ignore same ID re-scan within this window

  // ── Token storage key ─────────────────────────────────────────
  TOKEN_KEY: "lec_hub_token",
  ADMIN_KEY: "lec_hub_admin",
};

// Freeze config to prevent accidental mutation
Object.freeze(CONFIG);
