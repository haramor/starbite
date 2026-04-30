# Shreya's track — Stats & game history

Hi Shreya! You've got your own siloed module of the project: **the stats / game history service.** When the team plays a round, your code records what happened. A teacher running this in a classroom can pull up `/stats` in their browser to see how every round went, which is genuinely useful for the debrief.

Your work doesn't touch the rest of the game — you can move at your own pace without blocking Hara or Sky.

---

## What you're building

When a round of Star Bite Diner ends, the main game already calls a function called `logGameResult()` and hands it a record like:

```json
{
  "code": "STAR",
  "startedAt": 1714521900000,
  "endedAt": 1714522260000,
  "durationSec": 360,
  "winner": "crew",
  "endReason": "satisfaction_threshold",
  "finalSatisfaction": 88,
  "numPlayers": 7,
  "numSaboteurs": 3,
  "numEjections": 2,
  "customersServed": 12,
  "customersHappy": 9,
  "customersConfused": 2,
  "customersAngry": 1,
  "finalAccuracies": { "grill": 92, "trash": 75, "review": 100 }
}
```

You're going to do three things with these records:

1. **Save them** to a file on disk so they survive a server restart.
2. **Expose them** through a simple JSON endpoint at `/stats/games`.
3. **Show them** on a friendly web page at `/stats` that a teacher can open in a browser.

Most of this is already scaffolded — you'll be filling in the pieces marked `TODO: SHREYA`.

---

## Files you own

```
server/src/stats/
├── types.ts        ← the shape of a GameRecord (already done; you can extend it)
├── store.ts        ← saves records (in-memory now; you make it file-backed)
├── routes.ts       ← /stats/games and /stats endpoints (you upgrade the page)
└── index.ts        ← entry point that the rest of the server calls into

docs/shreya-kickoff.md  ← this file
```

You **only edit files inside `server/src/stats/`**. The rest of the codebase calls into your module at two specific places:

- `server/src/index.ts` calls `mountStatsRoutes(app)` and `loadFromDisk()` at server startup
- `server/src/rooms/GameRoom.ts` calls `logGameResult(record)` every time a round ends

If you find you need to change something outside your folder, ask Hara — usually it means there's a way to do it inside your folder.

---

## Branch + git

You'll work on a branch called **`shreya/stats`**. Before you start each session:

```bash
cd ~/Desktop/gamesfinal           # wherever you cloned the repo
git fetch
git checkout shreya/stats         # first time: git checkout -b shreya/stats
git pull origin main              # bring in the team's latest
```

When you finish a step, commit and push:

```bash
git add server/src/stats/
git commit -m "step 3: persist records to disk"
git push -u origin shreya/stats
```

Don't merge to `main` yourself — Hara will pull your branch in once your stuff is solid.

---

## Quickstart — get the game running locally

From the repo root:

```bash
npm install                     # first time only; takes ~1 minute
npm run dev:server              # leave this running in one terminal
```

In a second terminal:

```bash
npm run dev:client              # leave this running too
```

You should see:
- Server: `[starbite] listening on http://localhost:2567`
- Client: `Local: http://localhost:5173/`

Open **`http://localhost:5173`** in 5 browser tabs (different windows works too). In one tab, click **Create a room**. Read the 4-letter code at the top, type it into the other 4 tabs and click **Join**. Pick names, hit **Start round**.

Play for a minute or two, then call meetings to vote each other out until satisfaction crashes — that ends the game.

In your terminal where the server is running, you should see something like:

```
[stats] game STAR ended: crew wins (satisfaction_threshold), 240s, satisfaction=88, players=5, saboteurs=2
```

**That's the hook firing.** The game is calling your `logGameResult()` function. Your job is to do something useful with the data.

If you don't see that line, something's wrong — message Hara.

Also try opening `http://localhost:2567/stats` in your browser. You'll see the stub page. Open `http://localhost:2567/stats/games` and you'll see `{"count":0,"games":[]}`. That's because the records vanish when the server restarts — your first task is to fix that.

---

# Step 1 — Read the existing files (15 minutes)

Open these 4 files and skim them. Don't change anything yet. The goal is to understand what's already there.

- `server/src/stats/types.ts` — defines the `GameRecord` type
- `server/src/stats/store.ts` — saves records in a plain array (in memory)
- `server/src/stats/routes.ts` — defines `/stats/games` and `/stats`
- `server/src/stats/index.ts` — the entry point that ties everything together

Notice:
- `appendRecord(record)` just pushes to an array
- `loadFromDisk()` is empty (a stub)
- The `/stats` route returns a placeholder HTML page

---

# Step 2 — Persist records to disk (45 minutes)

**Goal:** when a game ends, append its record to a file at `server/data/games.jsonl`. (`.jsonl` = "JSON Lines" — one JSON object per line. Easy to append to and read back.)

### Edit `server/src/stats/store.ts`

Replace the file with this:

```ts
import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { GameRecord } from "./types.js";

// Path to the on-disk store. Resolved relative to the repo root.
// __dirname when compiled is /server/dist/stats; so going up 3 lands at the repo root.
const DATA_FILE = resolve(process.cwd(), "server", "data", "games.jsonl");

// In-memory cache. Populated from disk at startup, appended to as new
// records arrive. We keep this so reads are fast — we don't re-parse the
// file every time someone hits /stats/games.
const records: GameRecord[] = [];

export function appendRecord(record: GameRecord): void {
  // Make sure the data directory exists.
  const dir = dirname(DATA_FILE);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  // Append one line of JSON to the file.
  appendFileSync(DATA_FILE, JSON.stringify(record) + "\n", "utf8");
  // Also keep it in memory.
  records.push(record);
}

export function getRecentRecords(limit = 50): GameRecord[] {
  return records.slice(-limit).reverse();
}

export function loadFromDisk(): void {
  if (!existsSync(DATA_FILE)) {
    return;
  }
  const text = readFileSync(DATA_FILE, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const record = JSON.parse(trimmed) as GameRecord;
      records.push(record);
    } catch (err) {
      console.warn("[stats] skipping malformed line:", trimmed);
    }
  }
  console.log(`[stats] loaded ${records.length} game records from disk`);
}
```

### Test it

In the terminal running the server, restart it (Ctrl-C then `npm run dev:server` again). When it starts, it should print:

```
[stats] loaded 0 game records from disk
```

Now play a quick round (use 5 browser tabs, run a fast round). When it ends, check:

```bash
cat server/data/games.jsonl
```

You should see one line of JSON. **That's a real game saved to disk.**

Restart the server again. You should now see:

```
[stats] loaded 1 game records from disk
```

And `curl http://localhost:2567/stats/games` should now return your record.

### Commit your work

```bash
git add server/src/stats/store.ts
git commit -m "step 2: persist game records to games.jsonl"
git push
```

You also need to make sure the `data/` folder isn't committed. Open `.gitignore` at the repo root and confirm there's a line:

```
node_modules/
dist/
```

Then add a new line:

```
server/data/
```

```bash
git add .gitignore
git commit -m "ignore server/data folder"
git push
```

---

# Step 3 — Build a real stats page (1.5 hours)

**Goal:** `http://localhost:2567/stats` should show a clean table of recent games with satisfying readability.

### Edit `server/src/stats/routes.ts`

Replace the entire file:

```ts
import type { Express } from "express";
import { getRecentRecords } from "./store.js";

export function mountStatsRoutes(app: Express): void {
  // JSON feed
  app.get("/stats/games", (_req, res) => {
    const games = getRecentRecords(50);
    res.json({ count: games.length, games });
  });

  // HTML page — what a teacher visits in a browser
  app.get("/stats", (_req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(STATS_PAGE_HTML);
  });
}

// All-in-one HTML page. The page does its own fetch from /stats/games.
const STATS_PAGE_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Star Bite Diner — game history</title>
  <style>
    :root {
      --bg: #0f1133;
      --panel: #1a1f4d;
      --good: #06d6a0;
      --bad: #ef476f;
      --warm: #ffd166;
      --text: #f6f7ff;
      --muted: #9aa0c7;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: system-ui, -apple-system, sans-serif;
      min-height: 100vh;
    }
    .wrap { max-width: 960px; margin: 0 auto; padding: 40px 20px; }
    h1 { margin: 0; font-size: 28px; }
    .sub { color: var(--muted); margin-top: 4px; }
    .summary {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin: 28px 0;
    }
    .stat {
      background: var(--panel);
      padding: 16px;
      border-radius: 12px;
    }
    .stat .label { color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
    .stat .value { font-size: 26px; font-weight: 700; margin-top: 6px; }
    table { width: 100%; border-collapse: collapse; background: var(--panel); border-radius: 12px; overflow: hidden; }
    th, td { padding: 12px 14px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; }
    th { background: rgba(0,0,0,0.2); color: var(--muted); font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }
    tr:last-child td { border-bottom: none; }
    .pill { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
    .pill.crew { background: var(--good); color: #003a23; }
    .pill.saboteurs { background: var(--bad); color: #4a0014; }
    .empty { padding: 60px 20px; text-align: center; color: var(--muted); background: var(--panel); border-radius: 12px; }
    .acc-bars { display: flex; gap: 6px; }
    .acc-bar { font-size: 11px; padding: 2px 6px; background: rgba(255,255,255,0.08); border-radius: 4px; }
    @media (max-width: 700px) {
      .summary { grid-template-columns: repeat(2, 1fr); }
      table { font-size: 12px; }
      th, td { padding: 8px 10px; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Star Bite Diner — game history</h1>
    <div class="sub">A record of every round that's been played on this server.</div>

    <div id="summary" class="summary"></div>
    <div id="content"></div>
  </div>

  <script>
    function fmtDate(ts) {
      const d = new Date(ts);
      return d.toLocaleString();
    }

    function pct(n) {
      return Math.round(n) + '%';
    }

    async function load() {
      const res = await fetch('/stats/games');
      const data = await res.json();
      const games = data.games;
      const summary = document.getElementById('summary');
      const content = document.getElementById('content');

      if (games.length === 0) {
        summary.innerHTML = '';
        content.innerHTML = '<div class="empty">No games played yet. Play a round to see results here.</div>';
        return;
      }

      const total = games.length;
      const crewWins = games.filter(g => g.winner === 'crew').length;
      const winRate = Math.round((crewWins / total) * 100);
      const avgSat = Math.round(games.reduce((a, g) => a + g.finalSatisfaction, 0) / total);
      const avgDur = Math.round(games.reduce((a, g) => a + g.durationSec, 0) / total);

      summary.innerHTML = [
        '<div class="stat"><div class="label">Rounds played</div><div class="value">' + total + '</div></div>',
        '<div class="stat"><div class="label">Crew win rate</div><div class="value">' + winRate + '%</div></div>',
        '<div class="stat"><div class="label">Avg satisfaction</div><div class="value">' + avgSat + '%</div></div>',
        '<div class="stat"><div class="label">Avg round length</div><div class="value">' + avgDur + 's</div></div>',
      ].join('');

      const rows = games.map(function(g) {
        const accBars = Object.entries(g.finalAccuracies || {})
          .map(function(entry) { return '<span class="acc-bar">' + entry[0] + ' ' + pct(entry[1]) + '</span>'; })
          .join('');
        return '<tr>' +
          '<td>' + fmtDate(g.endedAt) + '</td>' +
          '<td>' + g.code + '</td>' +
          '<td>' + g.numPlayers + '</td>' +
          '<td>' + g.numSaboteurs + '</td>' +
          '<td><span class="pill ' + g.winner + '">' + g.winner + '</span></td>' +
          '<td>' + pct(g.finalSatisfaction) + '</td>' +
          '<td>' + g.durationSec + 's</td>' +
          '<td>' + g.customersHappy + '/' + g.customersServed + '</td>' +
          '<td><div class="acc-bars">' + accBars + '</div></td>' +
        '</tr>';
      }).join('');

      content.innerHTML =
        '<table>' +
          '<thead><tr>' +
            '<th>When</th>' +
            '<th>Code</th>' +
            '<th>Players</th>' +
            '<th>Saboteurs</th>' +
            '<th>Winner</th>' +
            '<th>Satisfaction</th>' +
            '<th>Duration</th>' +
            '<th>Happy / Total</th>' +
            '<th>Final accuracies</th>' +
          '</tr></thead>' +
          '<tbody>' + rows + '</tbody>' +
        '</table>';
    }

    load();
    setInterval(load, 5000);  // auto-refresh every 5 seconds
  </script>
</body>
</html>`;
```

### Test it

Restart the server. Open `http://localhost:2567/stats` in a browser.

If you've played a few rounds, you'll see a real summary. If you haven't, you'll see "No games played yet" — go play a round, refresh, and you'll see a row appear.

**Important:** the page auto-refreshes every 5 seconds. So if you finish a round and have the page open, it'll show the new game within 5 seconds without you reloading.

### Commit your work

```bash
git add server/src/stats/routes.ts
git commit -m "step 3: real stats page with summary tiles and game table"
git push
```

---

# Step 4 — Polish & extend (whenever you have time)

You've got a working stats service. Anything below is bonus — pick whatever sounds fun.

### Easy extensions (~30 min each)

- **Sortable columns.** Add click-to-sort to the table headers (search "vanilla js sortable table" — there are many small libraries or you can write it yourself in ~20 lines).
- **A "delete all" button** that wipes the file. Add a route `POST /stats/clear` that deletes `games.jsonl`. Useful for the team to reset between demos.
- **Filter by player count.** Add a small `<select>` above the table that filters games by 5-player, 6-player, etc.
- **Show date grouping.** Group games by day with a header like "Today", "Yesterday".

### Medium extensions (~1 hour each)

- **Per-game detail page.** When the user clicks on a row, show a detail view with everything the record contains, including the per-station accuracies as a chart.
- **Charts.** Use [Chart.js](https://www.chartjs.org/) (one `<script>` tag, no build step) to add a "win rate over time" or "average satisfaction over time" chart.
- **Track more data.** Want to know how many emergency meetings were called, or how many flags were placed at Review? Edit `types.ts` to add the field, then ask Hara to populate it in `endGame()`.

### Hard extensions (~half a day each)

- **Per-player stats.** Add a `players` array to GameRecord with each player's name, role, and whether they were ejected. Build a "leaderboard" or "best detectives" page.
- **Round timeline.** Capture key events (label submissions, flags, meetings, ejections) with timestamps. Show them on a horizontal timeline.

When you add fields, follow this pattern:
1. Edit `types.ts` to add the field
2. If it comes from gameplay, ask Hara to populate it in `GameRoom.endGame()`
3. Use it in `routes.ts` to render

---

# Tips for getting unstuck

**Server won't start after you edit something:**
- Look at the error message in the terminal carefully
- Common cause: a missing comma or a missing `}`. The error usually points to the line.
- Restore the file from git if needed: `git checkout server/src/stats/store.ts`

**Page is blank or shows "No games played yet" forever:**
- Open browser devtools → Network tab. Reload the page. Look for the `/stats/games` request. Click it, look at the response. If it's a 500 error, the server logged the cause.
- Open `server/data/games.jsonl` in a text editor — is there content? If the file is empty, the hook isn't firing. Confirm with Hara that her side is calling `logGameResult`.

**TypeScript complains about types:**
- The errors are usually self-explanatory if you read past the first line. "Property X does not exist on type Y" means you misspelled something.
- Run `npm run typecheck --workspace=server` to see all type errors at once.

**Git complains:**
- `git status` — what's modified
- `git diff` — what changed
- If you're stuck, take a screenshot of the terminal and send to Hara.

**You see something weird on the page that you didn't write:**
- Hard-refresh the browser (Cmd-Shift-R) — the cached old version might still be loaded.

---

## What "done" looks like

Minimum: Steps 1–3 work and are pushed to the `shreya/stats` branch.
- Records persist to `games.jsonl`
- They survive a server restart
- `/stats` shows a real, readable summary

That alone is a complete, useful contribution. Anything from Step 4 is bonus polish.

You're owning a piece of the project the rest of the team isn't going to touch — when this lands, the teacher running the game in a real classroom will be able to look back at every round and use it in their debrief. That's a real piece of pedagogy.

If you get stuck, message Hara. Have fun.
