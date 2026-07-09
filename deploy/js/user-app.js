import { loadContestData } from "./state.js";
import {
  renderSummary,
  renderParticipantsChips,
  renderFixtures,
  renderPayoutTables,
  getDataSourceLabel
} from "./render.js";
import { setStatus } from "./utils.js";
import { initCollapsible, getOpenFixtureIds, restoreOpenFixtures } from "./collapsible.js";

const elements = {
  betSummary: document.getElementById("betSummary"),
  kpiParticipants: document.getElementById("kpiParticipants"),
  kpiPool: document.getElementById("kpiPool"),
  kpiDone: document.getElementById("kpiDone"),
  netStakeHeader: document.getElementById("netStakeHeader"),
  participantsChips: document.getElementById("participantsChips"),
  fixtures: document.getElementById("fixtures"),
  matchPayoutBody: document.querySelector("#matchPayoutTable tbody"),
  contestantBody: document.querySelector("#contestantTable tbody"),
  statusBar: document.getElementById("statusBar"),
  lastUpdated: document.getElementById("lastUpdated")
};

let state = null;

function render() {
  const openFixtures = getOpenFixtureIds();
  renderSummary(state, elements);
  renderParticipantsChips(state, elements.participantsChips, { editable: false });
  renderFixtures(state, elements.fixtures, { editable: false });
  renderPayoutTables(state, elements);
  restoreOpenFixtures(openFixtures);

  if (elements.lastUpdated && state.updatedAt) {
    const when = new Date(state.updatedAt);
    elements.lastUpdated.textContent = Number.isNaN(when.getTime())
      ? ""
      : `Last updated: ${when.toLocaleString("en-IN")}`;
  }
}

async function init() {
  initCollapsible();
  setStatus(elements.statusBar, "Loading contest data…");

  try {
    state = await loadContestData({ preferRemote: true, allowLocalFallback: false });
    setStatus(elements.statusBar, `Data source: ${getDataSourceLabel()}`, "success");
    render();
  } catch (err) {
    setStatus(elements.statusBar, `Failed to load data: ${err.message}`, "error");
  }
}

init();

// Refresh every 60 seconds so users see admin updates
setInterval(async () => {
  try {
    const fresh = await loadContestData({ preferRemote: true, allowLocalFallback: false });
    state = fresh;
    render();
  } catch {
    // Keep showing last loaded data
  }
}, 60000);
