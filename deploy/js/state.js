import { CONFIG } from "./config.js";
import {
  DEFAULT_FIXTURES,
  DEFAULT_PARTICIPANTS,
  DEFAULT_PARTICIPANT_META
} from "./constants.js";

export function createDefaultState() {
  const participants = [...DEFAULT_PARTICIPANTS];
  const fixtures = DEFAULT_FIXTURES.map(f => ({ ...f }));
  const participantMeta = JSON.parse(JSON.stringify(DEFAULT_PARTICIPANT_META));

  const matches = fixtures.map(f => ({
    id: f.id,
    result: "",
    predictions: Object.fromEntries(participants.map(p => [p, ""]))
  }));

  return {
    participants,
    fixtures,
    participantMeta,
    matches,
    betPerMatch: CONFIG.DEFAULT_BET_PER_MATCH,
    updatedAt: new Date().toISOString()
  };
}

function normalizeState(raw) {
  const base = createDefaultState();
  if (!raw || typeof raw !== "object") return base;

  const fixtures = Array.isArray(raw.fixtures) && raw.fixtures.length
    ? raw.fixtures.map(f => ({
        id: Number(f.id),
        timeIST: String(f.timeIST || ""),
        home: String(f.home || "").trim(),
        away: String(f.away || "").trim()
      }))
    : base.fixtures;

  const participants = Array.isArray(raw.participants)
    ? Array.from(new Set(raw.participants.map(p => String(p || "").trim()).filter(Boolean)))
    : base.participants;

  const participantMeta = {
    ...base.participantMeta,
    ...(raw.participantMeta && typeof raw.participantMeta === "object" ? raw.participantMeta : {})
  };

  const existingMatches = Array.isArray(raw.matches) ? raw.matches : [];
  const matches = fixtures.map(f => {
    const existing = existingMatches.find(m => Number(m.id) === Number(f.id));
    const predictions = { ...(existing?.predictions || {}) };
    participants.forEach(name => {
      if (!(name in predictions)) predictions[name] = "";
    });
    Object.keys(predictions).forEach(name => {
      if (!participants.includes(name)) delete predictions[name];
    });
    return {
      id: f.id,
      result: existing?.result || "",
      predictions
    };
  });

  return {
    participants,
    fixtures,
    participantMeta,
    matches,
    betPerMatch: Number(raw.betPerMatch) > 0 ? Math.floor(Number(raw.betPerMatch)) : CONFIG.DEFAULT_BET_PER_MATCH,
    updatedAt: raw.updatedAt || new Date().toISOString()
  };
}

export function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEY);
    if (!raw) return null;
    return normalizeState(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveToLocalStorage(state) {
  const payload = { ...state, updatedAt: new Date().toISOString() };
  localStorage.setItem(CONFIG.LOCAL_STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

export async function loadBundledData() {
  const response = await fetch("data/contest-data.json", { cache: "no-store" });
  if (!response.ok) throw new Error("Could not load bundled contest data.");
  return normalizeState(await response.json());
}

export async function fetchRemoteData() {
  if (!CONFIG.DATA_API_URL) return null;
  const response = await fetch(CONFIG.DATA_API_URL, { cache: "no-store" });
  if (!response.ok) throw new Error(`Remote data fetch failed (${response.status}).`);
  return normalizeState(await response.json());
}

export async function saveRemoteData(state) {
  if (!CONFIG.DATA_API_URL) {
    throw new Error("DATA_API_URL is not configured in js/config.js");
  }

  const payload = { ...state, updatedAt: new Date().toISOString() };
  const headers = { "Content-Type": "application/json" };

  const secret = sessionStorage.getItem("contest_admin_secret") || CONFIG.ADMIN_SECRET;
  if (secret) headers.Authorization = `Bearer ${secret}`;

  const response = await fetch(CONFIG.DATA_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  if (response.status === 401) {
    throw new Error("Unauthorized — enter the admin password when prompted.");
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Save failed (${response.status}).`);
  }

  return payload;
}

export function getAdminSecret() {
  return sessionStorage.getItem("contest_admin_secret") || CONFIG.ADMIN_SECRET || "";
}

export function setAdminSecret(secret) {
  if (secret) sessionStorage.setItem("contest_admin_secret", secret);
  else sessionStorage.removeItem("contest_admin_secret");
}

export async function loadContestData({ preferRemote = true, allowLocalFallback = false } = {}) {
  if (preferRemote && CONFIG.DATA_API_URL) {
    try {
      const remote = await fetchRemoteData();
      if (remote) return remote;
    } catch (err) {
      if (!allowLocalFallback) throw err;
    }
  }

  if (allowLocalFallback) {
    const local = loadFromLocalStorage();
    if (local) return local;
  }

  try {
    return await loadBundledData();
  } catch {
    return createDefaultState();
  }
}
