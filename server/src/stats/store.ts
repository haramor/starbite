// Persistence layer for game records.
//
// SHREYA — this file is yours. Right now it just holds records in memory and
// they vanish when the server restarts. Step 3 of /docs/shreya-kickoff.md
// walks you through swapping this for a real append-only file on disk.

import type { GameRecord } from "./types.js";

// In-memory store — replace with a file-backed store in step 3.
const records: GameRecord[] = [];

/**
 * Append one game record to the store.
 *
 * SHREYA — Step 3 says: instead of just pushing to the array, also append a
 * line to /server/data/games.jsonl. The function should still keep the
 * in-memory array for fast reads.
 */
export function appendRecord(record: GameRecord): void {
  records.push(record);
}

/**
 * Return the most recent N records, newest first.
 *
 * SHREYA — Step 4: when the server starts, this should also load any existing
 * records from games.jsonl back into memory so refreshing the server doesn't
 * lose history.
 */
export function getRecentRecords(limit = 50): GameRecord[] {
  return records.slice(-limit).reverse();
}

/**
 * SHREYA — Step 4: implement this. It should be called once at server start.
 * Read /server/data/games.jsonl line by line, parse each as a GameRecord,
 * and push them all into the `records` array. If the file doesn't exist yet,
 * just create the directory and treat it as empty.
 */
export function loadFromDisk(): void {
  // TODO: SHREYA - implement
}
