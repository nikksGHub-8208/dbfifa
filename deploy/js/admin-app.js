import { CONFIG } from "./config.js";
import {
  createDefaultState,
  loadContestData,
  saveRemoteData,
  saveToLocalStorage,
  getAdminSecret,
  setAdminSecret
} from "./state.js";
import { getBetPerMatch } from "./compute.js";
import {
  renderSummary,
  renderParticipantsChips,
  renderFixtures,
  renderPayoutTables,
  renderMatchList,
  getDataSourceLabel
} from "./render.js";
import { nextMatchId, setStatus } from "./utils.js";
import { initCollapsible, getOpenFixtureIds, restoreOpenFixtures } from "./collapsible.js";

const elements = {
  betSummary: document.getElementById("betSummary"),
  betAmountInput: document.getElementById("betAmountInput"),
  kpiParticipants: document.getElementById("kpiParticipants"),
  kpiPool: document.getElementById("kpiPool"),
  kpiDone: document.getElementById("kpiDone"),
  netStakeHeader: document.getElementById("netStakeHeader"),
  participantsChips: document.getElementById("participantsChips"),
  fixtures: document.getElementById("fixtures"),
  matchPayoutBody: document.querySelector("#matchPayoutTable tbody"),
  contestantBody: document.querySelector("#contestantTable tbody"),
  matchList: document.getElementById("matchList"),
  statusBar: document.getElementById("statusBar"),
  participantInput: document.getElementById("participantInput"),
  fanCountryInput: document.getElementById("fanCountryInput"),
  matchIdInput: document.getElementById("matchIdInput"),
  matchTimeInput: document.getElementById("matchTimeInput"),
  matchHomeInput: document.getElementById("matchHomeInput"),
  matchAwayInput: document.getElementById("matchAwayInput"),
  saveBtn: document.getElementById("saveBtn"),
  reloadBtn: document.getElementById("reloadBtn")
};

let state = null;
let saving = false;

function renderFixturesSection() {
  const openIds = getOpenFixtureIds();
  renderFixtures(state, elements.fixtures, {
    editable: true,
    onResultChange: (matchId, value) => {
      const match = state.matches.find(m => m.id === matchId);
      if (match) match.result = value;
      renderFixturesSection();
      renderPayoutTables(state, elements);
    },
    onPredictionChange: (matchId, name, value) => {
      const match = state.matches.find(m => m.id === matchId);
      if (match) {
        if (!match.predictions) match.predictions = {};
        match.predictions[name] = value;
      }
      renderPayoutTables(state, elements);
    }
  });
  restoreOpenFixtures(openIds);
}

function render() {
  const betPerMatch = getBetPerMatch(state);
  if (elements.betAmountInput) elements.betAmountInput.value = betPerMatch;

  renderSummary(state, elements);
  renderParticipantsChips(state, elements.participantsChips, {
    editable: true,
    onRemove: removeParticipant
  });
  renderFixturesSection();
  renderPayoutTables(state, elements);
  renderMatchList(state, elements.matchList, { onRemove: removeMatch });
}

async function persistState() {
  if (saving) return;
  saving = true;
  if (elements.saveBtn) elements.saveBtn.disabled = true;
  setStatus(elements.statusBar, "Saving…");

  try {
    if (CONFIG.DATA_API_URL) {
      if (!getAdminSecret()) {
        const entered = prompt("Admin password (set CONTEST_ADMIN_SECRET in Netlify):");
        if (entered) setAdminSecret(entered.trim());
      }
      state = await saveRemoteData(state);
      saveToLocalStorage(state);
      setStatus(elements.statusBar, "Saved successfully.", "success");
    } else {
      state = saveToLocalStorage(state);
      setStatus(
        elements.statusBar,
        "Saved locally. Configure DATA_API_URL in js/config.js to sync with Google Drive.",
        "success"
      );
    }
  } catch (err) {
    state = saveToLocalStorage(state);
    setStatus(
      elements.statusBar,
      `Remote save failed (${err.message}). Data saved to browser localStorage as fallback.`,
      "error"
    );
  } finally {
    saving = false;
    if (elements.saveBtn) elements.saveBtn.disabled = false;
  }
}

function addParticipant() {
  const name = elements.participantInput.value.trim();
  if (!name) return;
  if (state.participants.includes(name)) {
    alert("Participant already exists.");
    return;
  }

  state.participants.push(name);
  state.participantMeta[name] = {
    fanCountry: elements.fanCountryInput.value.trim()
  };

  state.matches.forEach(m => {
    if (!m.predictions) m.predictions = {};
    m.predictions[name] = "";
  });

  elements.participantInput.value = "";
  elements.fanCountryInput.value = "";
  render();
}

function removeParticipant(name) {
  if (!confirm(`Remove participant "${name}"?`)) return;
  state.participants = state.participants.filter(p => p !== name);
  delete state.participantMeta[name];
  state.matches.forEach(m => {
    if (m.predictions) delete m.predictions[name];
  });
  render();
}

function addMatch() {
  const home = elements.matchHomeInput.value.trim();
  const away = elements.matchAwayInput.value.trim();
  const timeIST = elements.matchTimeInput.value.trim();
  if (!home || !away) {
    alert("Home and away teams are required.");
    return;
  }

  const id = Number(elements.matchIdInput.value) || nextMatchId(state.fixtures);
  if (state.fixtures.some(f => Number(f.id) === id)) {
    alert(`Match id ${id} already exists.`);
    return;
  }

  state.fixtures.push({ id, timeIST, home, away });
  state.matches.push({
    id,
    result: "",
    predictions: Object.fromEntries(state.participants.map(p => [p, ""]))
  });

  elements.matchIdInput.value = "";
  elements.matchTimeInput.value = "";
  elements.matchHomeInput.value = "";
  elements.matchAwayInput.value = "";
  render();
}

function removeMatch(id) {
  const fixture = state.fixtures.find(f => f.id === id);
  if (!fixture) return;
  if (!confirm(`Remove match ${id}: ${fixture.home} vs ${fixture.away}?`)) return;

  state.fixtures = state.fixtures.filter(f => f.id !== id);
  state.matches = state.matches.filter(m => m.id !== id);
  render();
}

async function reloadData() {
  setStatus(elements.statusBar, "Reloading data…");
  try {
    state = await loadContestData({ preferRemote: true, allowLocalFallback: true });
    render();
    setStatus(elements.statusBar, `Reloaded from ${getDataSourceLabel()}.`, "success");
  } catch (err) {
    setStatus(elements.statusBar, `Reload failed: ${err.message}`, "error");
  }
}

function bindEvents() {
  document.getElementById("addParticipantBtn").addEventListener("click", addParticipant);
  elements.participantInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addParticipant();
    }
  });

  document.getElementById("addMatchBtn").addEventListener("click", addMatch);
  elements.saveBtn.addEventListener("click", persistState);
  elements.reloadBtn.addEventListener("click", reloadData);

  elements.betAmountInput.addEventListener("change", (e) => {
    const parsed = Math.floor(Number(e.target.value));
    state.betPerMatch = Number.isFinite(parsed) && parsed > 0 ? parsed : CONFIG.DEFAULT_BET_PER_MATCH;
    render();
  });

  document.getElementById("resetBtn").addEventListener("click", async () => {
    if (!confirm("Reset all participants, matches, predictions and results to defaults?")) return;
    state = createDefaultState();
    await persistState();
    render();
  });
}

async function init() {
  initCollapsible();
  setStatus(elements.statusBar, "Loading admin data…");
  bindEvents();

  try {
    state = await loadContestData({ preferRemote: true, allowLocalFallback: true });
    setStatus(
      elements.statusBar,
      CONFIG.DATA_API_URL
        ? `Connected to ${getDataSourceLabel()}. Changes are saved when you click Save.`
        : "No Google Drive URL configured — using local data. Set DATA_API_URL in js/config.js.",
      CONFIG.DATA_API_URL ? "success" : ""
    );
    render();
  } catch (err) {
    setStatus(elements.statusBar, `Failed to load: ${err.message}`, "error");
  }
}

init();
