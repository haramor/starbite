// HTTP routes for the stats module.
//
// SHREYA — this is your file. Right now there are 2 stub routes:
//   GET /stats/games  → returns recent games as JSON
//   GET /stats        → returns an HTML page summarizing recent games
//
// Both stubs work but are bare-bones. Steps 4 and 5 of /docs/shreya-kickoff.md
// walk you through making them useful.

import type { Express } from "express";
import { getRecentRecords } from "./store.js";

export function mountStatsRoutes(app: Express): void {
  // ----------------------------------------------------------------
  // JSON endpoint — used by the page (and anyone curling the server)
  // ----------------------------------------------------------------
  app.get("/stats/games", (_req, res) => {
    const games = getRecentRecords(50);
    res.json({ count: games.length, games });
  });

  // ----------------------------------------------------------------
  // HTML page — what a teacher visits in the browser
  // SHREYA — Step 5: replace this stub with the real stats page.
  // ----------------------------------------------------------------
  app.get("/stats", (_req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Star Bite Diner — Stats</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 40px auto; padding: 0 20px; color: #222; }
    h1 { margin-bottom: 4px; }
    p.note { color: #666; }
    pre { background: #f4f4f4; padding: 12px; border-radius: 6px; overflow: auto; }
  </style>
</head>
<body>
  <h1>Star Bite Diner — game history</h1>
  <p class="note">This is the stub page. Replace it (Step 5 of the kickoff doc) with a real, readable summary of recent games.</p>
  <p>The live JSON feed is at <a href="/stats/games">/stats/games</a>.</p>
</body>
</html>`);
  });
}
