/**
 * Static Netlify Drop config — no server API (drag-and-drop deploy).
 * Admin saves to this browser only (localStorage).
 * For shared storage across devices, deploy via Git + Netlify Functions instead.
 */
export const CONFIG = {
  DATA_API_URL: "",
  LOCAL_STORAGE_KEY: "fifaContestRound32_lsg_v1",
  DEFAULT_BET_PER_MATCH: 20,
  ADMIN_SECRET: ""
};
