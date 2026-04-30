// Persistence layer for game records.
//
// Records are appended to /server/data/games.jsonl (one JSON object per line).
// On server start, loadFromDisk() reads that file back into the in-memory
// cache so /stats keeps showing history across restarts.

import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { GameRecord } from "./types.js";

// Path to the on-disk store. npm workspaces cwd into the package dir before
// running scripts, so process.cwd() is /<repo>/server when this server is
// launched via `npm run dev:server` or `npm run start:server`. Don't add a
// redundant "server/" prefix here — that nested it under server/server/.
const DATA_FILE = resolve(process.cwd(), "data", "games.jsonl");

// In-memory cache. Populated from disk at startup, appended to as new records
// arrive. Keeps reads fast — we don't re-parse the file on every /stats hit.
const records: GameRecord[] = [];

export function appendRecord(record: GameRecord): void {
  const dir = dirname(DATA_FILE);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  appendFileSync(DATA_FILE, JSON.stringify(record) + "\n", "utf8");
  records.push(record);
}

export function getRecentRecords(limit = 50): GameRecord[] {
  return records.slice(-limit).reverse();
}

export function loadFromDisk(): void {
  if (!existsSync(DATA_FILE)) {
    console.log(`[stats] no games.jsonl yet; starting fresh`);
    return;
  }
  const text = readFileSync(DATA_FILE, "utf8");
  let loaded = 0;
  let skipped = 0;
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const record = JSON.parse(trimmed) as GameRecord;
      records.push(record);
      loaded++;
    } catch {
      console.warn(`[stats] skipping malformed line: ${trimmed.slice(0, 60)}…`);
      skipped++;
    }
  }
  console.log(`[stats] loaded ${loaded} game records from disk${skipped > 0 ? ` (${skipped} skipped)` : ""}`);
}
