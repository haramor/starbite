// Stats / game history module.
// Owned by Shreya. The main game calls into this from two places:
//
//   1. server/src/index.ts calls mountStatsRoutes(app) at startup to attach
//      the /stats and /stats/games endpoints to the Express app.
//
//   2. server/src/rooms/GameRoom.ts calls logGameResult(record) inside its
//      endGame() method, every time a round ends.
//
// SHREYA — see /docs/shreya-kickoff.md for the full walkthrough.

export type { GameRecord } from "./types.js";
export { mountStatsRoutes } from "./routes.js";
export { appendRecord, getRecentRecords, loadFromDisk } from "./store.js";

import type { GameRecord } from "./types.js";
import { appendRecord } from "./store.js";

/**
 * Called by GameRoom when a round ends. Don't change the signature without
 * updating GameRoom.endGame() — the contract here is intentionally small.
 */
export function logGameResult(record: GameRecord): void {
  console.log(
    `[stats] game ${record.code} ended: ${record.winner} wins (${record.endReason}), ` +
      `${record.durationSec}s, satisfaction=${record.finalSatisfaction}, ` +
      `players=${record.numPlayers}, saboteurs=${record.numSaboteurs}`
  );
  appendRecord(record);
}
