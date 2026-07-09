const STORAGE_KEY = "fifa_collapsible_sections_v1";

function persistSectionState() {
  const saved = {};
  document.querySelectorAll("details.collapsible-card[data-section]").forEach(card => {
    saved[card.dataset.section] = card.open;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}

function restoreSectionState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    document.querySelectorAll("details.collapsible-card[data-section]").forEach(card => {
      const id = card.dataset.section;
      if (id in saved) card.open = saved[id];
    });
  } catch {
    // ignore
  }
}

export function setAllSections(open) {
  document.querySelectorAll("details.collapsible-card").forEach(card => {
    card.open = open;
  });
  persistSectionState();
}

export function setAllFixtures(open) {
  document.querySelectorAll("details.fixture").forEach(fixture => {
    fixture.open = open;
  });
}

export function initCollapsible() {
  restoreSectionState();

  document.querySelectorAll("details.collapsible-card[data-section]").forEach(card => {
    card.addEventListener("toggle", persistSectionState);
  });

  document.getElementById("expandAllBtn")?.addEventListener("click", () => {
    setAllSections(true);
    setAllFixtures(true);
  });

  document.getElementById("collapseAllBtn")?.addEventListener("click", () => {
    setAllSections(false);
    setAllFixtures(false);
  });

  document.querySelectorAll("[data-action='expand-fixtures']").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      setAllFixtures(true);
    });
  });

  document.querySelectorAll("[data-action='collapse-fixtures']").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      setAllFixtures(false);
    });
  });
}

export function getOpenFixtureIds() {
  return new Set(
    [...document.querySelectorAll("details.fixture[open]")].map(d => d.dataset.matchId)
  );
}

export function restoreOpenFixtures(openIds) {
  if (!openIds?.size) return;
  document.querySelectorAll("details.fixture").forEach(d => {
    if (openIds.has(d.dataset.matchId)) d.open = true;
  });
}
