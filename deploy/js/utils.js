import { TEAM_FLAG_CODES } from "./constants.js";

export function formatRs(n) {
  const hasDecimal = Math.abs(n % 1) > 0.001;
  return "₹" + n.toLocaleString("en-IN", {
    minimumFractionDigits: hasDecimal ? 2 : 0,
    maximumFractionDigits: 2
  });
}

export function getTeamFlagUrl(teamName) {
  const code = TEAM_FLAG_CODES[teamName];
  return code ? `https://flagcdn.com/24x18/${code}.png` : "";
}

export function getTeamFlagBackgroundUrl(teamName) {
  const code = TEAM_FLAG_CODES[teamName];
  return code ? `https://flagcdn.com/w320/${code}.png` : "";
}

export function getTeamLabelHtml(teamName) {
  if (!teamName || teamName === "Pending" || teamName === "-") return teamName || "-";
  const flagUrl = getTeamFlagUrl(teamName);
  if (!flagUrl) return teamName;
  return `<span class="team-with-flag"><img class="team-flag" src="${flagUrl}" alt="${teamName} flag" />${teamName}</span>`;
}

export function getFixtureLabelHtml(home, away) {
  return `<span class="team-pair">${getTeamLabelHtml(home)} <span class="vs">vs</span> ${getTeamLabelHtml(away)}</span>`;
}

export function getInitials(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  if (parts.length === 1) {
    const word = parts[0];
    return word.slice(0, 2).toUpperCase().padEnd(2, word[0] || "?");
  }
  return "??";
}

export function getParticipantFanCountry(name, participantMeta) {
  return (participantMeta[name] || {}).fanCountry || "";
}

export function createParticipantLabel(name, participantMeta, sizeClass = "sm", layout = "stacked") {
  const wrap = document.createElement("span");
  wrap.className = layout === "inline" ? "name-with-avatar inline" : "name-with-avatar";

  const initials = document.createElement("span");
  initials.className = `avatar fallback ${sizeClass}`;
  initials.setAttribute("aria-hidden", "true");
  initials.textContent = getInitials(name);
  wrap.appendChild(initials);

  const text = document.createElement("span");
  text.textContent = name;
  wrap.appendChild(text);
  return wrap;
}

export function nextMatchId(fixtures) {
  if (!fixtures.length) return 1;
  return Math.max(...fixtures.map(f => Number(f.id) || 0)) + 1;
}

export function setStatus(el, message, type = "") {
  if (!el) return;
  el.textContent = message;
  el.className = "status-bar" + (type ? ` ${type}` : "");
}
