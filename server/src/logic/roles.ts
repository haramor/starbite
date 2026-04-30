// Saboteur assignment. Run once at game start.

import { SABOTEUR_COUNTS, type Role } from "starbite-shared";

/**
 * Returns a map of sessionId → role given the current playerlist.
 * Saboteur count is determined by total players (per design doc table).
 */
export function assignRoles(sessionIds: string[]): Map<string, Role> {
  const result = new Map<string, Role>();
  const n = sessionIds.length;
  const numSaboteurs = SABOTEUR_COUNTS[n] ?? Math.max(1, Math.floor(n / 3));

  // Fisher-Yates shuffle to pick which players become saboteurs
  const shuffled = [...sessionIds];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const saboteurSet = new Set(shuffled.slice(0, numSaboteurs));

  for (const sid of sessionIds) {
    result.set(sid, saboteurSet.has(sid) ? "saboteur" : "trainer");
  }
  return result;
}
