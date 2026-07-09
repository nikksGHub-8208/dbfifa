import { CONFIG } from "./config.js";

export function getBetPerMatch(state) {
  const value = Number(state.betPerMatch);
  if (!Number.isFinite(value) || value <= 0) return CONFIG.DEFAULT_BET_PER_MATCH;
  return Math.floor(value);
}

export function computePayouts(state) {
  const fixtures = state.fixtures || [];
  const betPerMatch = getBetPerMatch(state);
  const stakePerParticipant = betPerMatch * fixtures.length;

  const participantStats = Object.fromEntries(
    state.participants.map(name => [name, { name, correct: 0, won: 0, net: -stakePerParticipant }])
  );

  const matchStats = fixtures.map(f => {
    const match = state.matches.find(m => m.id === f.id) || { result: "", predictions: {} };
    const pool = state.participants.length * betPerMatch;
    const result = match.result || "";
    let winners = [];
    let payoutPerWinner = 0;

    if (result) {
      winners = state.participants.filter(name => match.predictions[name] === result);
      payoutPerWinner = winners.length ? pool / winners.length : 0;
      winners.forEach(name => {
        participantStats[name].correct += 1;
        participantStats[name].won += payoutPerWinner;
        participantStats[name].net += payoutPerWinner;
      });
    }

    return {
      id: f.id,
      home: f.home,
      away: f.away,
      result: result || "Pending",
      winners,
      pool,
      payoutPerWinner
    };
  });

  return {
    betPerMatch,
    stakePerParticipant,
    matchStats,
    participantStats: Object.values(participantStats).sort((a, b) => b.won - a.won)
  };
}

export function getMatchState(state, id) {
  return state.matches.find(m => m.id === id);
}

export function getMatchDef(state, id) {
  return state.fixtures.find(f => f.id === id);
}
