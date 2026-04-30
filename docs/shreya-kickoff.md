# Shreya's track — Deployment + Stats

Hi Shreya! Welcome to the team. You've got your own siloed module of the project that doesn't touch the rest of the code, so you can move at your own pace without blocking Hara or Sky.

Your work splits into two phases:

- **Phase 1 (do first):** Deploy the game to the public internet so anyone can play it at a real URL. This unblocks the playtest helper running real classroom-style sessions and gives the team a URL to share for the Tuesday demo.
- **Phase 2 (after Phase 1):** Build the stats / game history service. When a round ends, your code records what happened, and a teacher can pull up `/stats` in their browser to see results across rounds.

Phase 1 is the more time-sensitive piece. Phase 2 is genuinely useful but if you only get Phase 1 done, the team has what it needs.

---

## Branch + git

Work on a single branch called **`shreya/track`** for everything. From your local clone:

```bash
cd ~/Desktop/gamesfinal           # wherever you cloned the repo
git fetch
git checkout -b shreya/track
git push -u origin shreya/track
```

Before each work session:

```bash
git pull origin main              # bring in the team's latest
```

Commit and push as you finish each step:

```bash
git add <whatever-you-changed>
git commit -m "phase 1 step 2: deploy server to render"
git push
```

Don't merge to `main` yourself — Hara will pull your branch in once your stuff is solid.

---

## Quickstart — get the game running locally first

Before you deploy, make sure the game runs on your machine. From the repo root:

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

Open `http://localhost:5173` in 5 browser tabs. In one tab, click **Create a room**. Read the 4-letter code at the top, type it into the other 4 tabs and click **Join**. Pick names, hit **Start round**.

Once that works locally, you're ready for Phase 1.

---

# 🚀 Phase 1 — Deployment (1–2 hours)

The goal: get Star Bite Diner running at a public URL like `starbite.onrender.com` so anyone can play without cloning the repo.

## What you're deploying

The game has two halves that both need to be online:

1. **The server** — the Node process that runs Colyseus rooms. Lives at a `wss://` URL. Render calls this a **Web Service**.
2. **The client** — the static HTML/CSS/JS the player loads in their browser. Lives at an `https://` URL. Render calls this a **Static Site**.

The client connects to the server over WebSocket. We'll set an environment variable on the client telling it where the server lives.

```
        Browser
           │
   https://starbite.onrender.com   (Static Site — Render serves the bundled client)
           │
       loads JS, opens WebSocket to:
           │
   wss://starbite-server.onrender.com   (Web Service — your Colyseus server)
```

---

## Step 1.1 — Sign up for Render (5 minutes)

1. Go to [render.com](https://render.com) and sign up (free tier — no credit card needed).
2. When it asks, **connect your GitHub account** and grant access to the `haramor/starbite` repo (or the whole org if it asks).
3. From your Render dashboard, you should see "New +" in the top right — that's where you'll create both services.

---

## Step 1.2 — Deploy the server (Web Service) (20–30 minutes)

In the Render dashboard:

1. Click **New +** → **Web Service**.
2. Pick the `haramor/starbite` repo from the connected list.
3. Fill in the form:
   - **Name:** `starbite-server` (or `starbite-server-yourname` if the name's taken)
   - **Region:** Oregon (US West) — pick whichever is closest to you and your testers
   - **Branch:** `main`
   - **Root Directory:** *(leave blank — we deploy from the repo root)*
   - **Runtime:** **Node**
   - **Build Command:** `npm install && npm run build:shared`
   - **Start Command:** `npm run start:server`
   - **Plan:** **Free** (it's enough)
4. Scroll down to **Advanced** and add an **Environment Variable**:
   - Key: `NODE_VERSION`
   - Value: `20`
5. Click **Create Web Service**.

Render will start building. The build takes **3–5 minutes** the first time (it's installing all npm packages).

### Watch the deploy log

While Render builds, the right side of the page shows a live log. Healthy output:

```
==> Cloning from https://github.com/haramor/starbite
==> Checking out commit ... in branch main
==> Running build command 'npm install && npm run build:shared'
... (npm install output) ...
> starbite-shared@0.1.0 build
> tsc
==> Build successful
==> Deploying...
==> Running 'npm run start:server'
[starbite] listening on http://localhost:10000
==> Your service is live 🎉
```

Render will show your URL at the top — something like `https://starbite-server.onrender.com`. **Copy this URL.** You need it in Step 1.3.

### Verify the server is live

In your browser, open `https://starbite-server.onrender.com/health`. You should see:

```json
{"ok": true, "ts": 1777558000000}
```

If you see that, the server is up. If you see "Bad Gateway" or a Render error page:
- Check the Logs tab in Render — the error usually points at the cause.
- Most common issue: build timed out or crashed. Re-deploy from the "Manual Deploy" → "Clear cache & deploy" option.
- Tell Hara what the log says.

### About the free tier

Render's free Web Services **sleep after 15 minutes of no traffic**. The first request after a sleep takes ~30 seconds to wake up. That's fine for our team — once a playtest is in progress, the server stays awake. But if you visit the URL after a long pause, expect a 30-second hang on the first load. Tell the team this so they don't panic.

---

## Step 1.3 — Deploy the client (Static Site) (15 minutes)

Back in the Render dashboard:

1. Click **New +** → **Static Site**.
2. Pick the `haramor/starbite` repo.
3. Fill in the form:
   - **Name:** `starbite` (or `starbite-yourname`)
   - **Branch:** `main`
   - **Root Directory:** *(leave blank)*
   - **Build Command:** `npm install && npm run build:client`
   - **Publish Directory:** `client/dist`
4. Scroll down to **Environment Variables** and add:
   - Key: `VITE_SERVER_URL`
   - Value: `wss://YOUR-SERVER-URL-FROM-STEP-1.2.onrender.com`

   ⚠️ Important: it's `wss://` not `https://`, no trailing slash. Example: `wss://starbite-server.onrender.com`
5. Click **Create Static Site**.

The build will take 2–3 minutes. When done, Render shows your client URL like `https://starbite.onrender.com`.

### Verify the client is live

Open `https://starbite.onrender.com` in a browser. You should see the Star Bite Diner title screen. Click **Create a room**.

**If a room is created and you see the Lobby with a 4-letter code → it's working.** Send the URL to Hara to confirm she can join from her laptop.

### If it doesn't connect

Open browser devtools → Network tab → reload. Look for a failed `WebSocket` request. Common causes:

- **`VITE_SERVER_URL` is wrong** — re-check the value in Render's env vars. Must be `wss://` not `https://`.
- **CORS error** — the server needs to allow the static site's origin. If you see this, edit `server/src/index.ts` and just below `app.use(express.json());` add:
  ```ts
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
  });
  ```
  Commit and push to `shreya/track`. Then in Render's Web Service dashboard, hit "Manual Deploy" to re-deploy. Wait 3 min.
- **Server is asleep** — open the server URL once to wake it, wait 30 sec, retry the client.

---

## Step 1.4 — Keep the server awake (10 minutes, optional but recommended)

Render free-tier services sleep after 15 minutes. To make playtests smoother, we want the server to wake up fast and stay awake during a session.

[uptimerobot.com](https://uptimerobot.com) is a free service that pings your URL every 5 minutes, keeping it warm.

1. Sign up (free, no credit card).
2. **Add Monitor** → HTTP(s) Monitor.
3. URL: `https://starbite-server.onrender.com/health`
4. Monitoring Interval: 5 minutes.
5. Save.

Now your server gets pinged every 5 minutes, never goes to sleep, and is always ready for a playtest.

If you skip this, just tell the team "if it looks frozen on first load, give it 30 seconds."

---

## Step 1.5 — Tell the team (5 minutes)

Once both URLs work end-to-end:

1. Send Hara and Sky:
   - **Player URL:** `https://starbite.onrender.com` (whatever Render gave you for the static site)
   - **Server URL:** `https://starbite-server.onrender.com` (in case anyone needs to debug)
2. Add the Player URL to the README. Open `README.md` and add at the very top:
   ```markdown
   **🎮 Play it: https://starbite.onrender.com**
   ```
   Commit and push to your branch:
   ```bash
   git add README.md
   git commit -m "phase 1: add live URL to README"
   git push
   ```
3. Send the Player URL to Helper 4 (the playtest lead) so they can run the external playtest from anywhere.

**Phase 1 is done.** Take a break, then come back for Phase 2.

---

## Phase 1 done = ready to ship

What you've built so far:
- Server is live at a public `wss://...onrender.com` URL
- Client is live at a public `https://...onrender.com` URL
- Hara, Sky, and you can all create rooms / join them from your own laptops via the public URL
- The URL is in the README
- Helper 4 has the URL for external playtest

That alone is a complete, ship-ready prototype. The team can run the Tuesday classroom demo from any laptop with this URL.

---

# 📊 Phase 2 — Stats & game history (2–3 hours)

Now you'll build the second half of your track: a stats service that records every game and shows results on a friendly web page. When deployment is also done (Phase 1), the team will have a live `https://starbite-server.onrender.com/stats` URL to show off in the demo — "look, every round we've played in real classrooms, recorded right here."

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

## Files you own

```
server/src/stats/
├── types.ts        ← the shape of a GameRecord (already done; you can extend it)
├── store.ts        ← saves records (in-memory now; you make it file-backed)
├── routes.ts       ← /stats/games and /stats endpoints (you upgrade the page)
└── index.ts        ← entry point that the rest of the server calls into
```

You **only edit files inside `server/src/stats/`** (and `.gitignore` once). The rest of the codebase calls into your module at two specific places:

- `server/src/index.ts` calls `mountStatsRoutes(app)` and `loadFromDisk()` at server startup
- `server/src/rooms/GameRoom.ts` calls `logGameResult(record)` every time a round ends

If you find you need to change something outside your folder, ask Hara.

---

## Step 2.1 — Confirm the hooks fire (10 minutes)

Run the server locally:

```bash
npm run dev:server
```

In another terminal, run the client:

```bash
npm run dev:client
```

Open `http://localhost:5173`, play a quick round (5 tabs, vote each other out fast).

In your terminal where the server is running, you should see something like:

```
[stats] game STAR ended: crew wins (satisfaction_threshold), 240s, satisfaction=88, players=5, saboteurs=2
```

**That's the hook firing.** The game is calling your `logGameResult()` function. Your job is to do something useful with the data.

If you don't see that line, something's wrong — message Hara.

Also try opening `http://localhost:2567/stats` in your browser. You'll see the stub page. Open `http://localhost:2567/stats/games` and you'll see `{"count":0,"games":[]}`. That's because the records vanish when the server restarts — the next step fixes that.

---

## Step 2.2 — Persist records to disk (45 minutes)

**Goal:** when a game ends, append its record to a file at `server/data/games.jsonl`. (`.jsonl` = "JSON Lines" — one JSON object per line. Easy to append to and read back.)

### Edit `server/src/stats/store.ts`

Replace the file with this:

```ts
import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { GameRecord } from "./types.js";

// Path to the on-disk store. Resolved relative to where node was launched.
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

Now play a quick round. When it ends, check:

```bash
cat server/data/games.jsonl
```

You should see one line of JSON. **That's a real game saved to disk.**

Restart the server again. You should now see:

```
[stats] loaded 1 game records from disk
```

And `curl http://localhost:2567/stats/games` should now return your record.

### Important: the data folder is already gitignored

`.gitignore` already has `server/data/` in it (added in Phase 1's initial scaffolding). Just confirm by running `git status` after a game — `server/data/games.jsonl` should NOT show up as a change. If it does, add it to `.gitignore` yourself.

### Commit your work

```bash
git add server/src/stats/store.ts
git commit -m "phase 2 step 2: persist game records to games.jsonl"
git push
```

---

## Step 2.3 — Build a real stats page (1.5 hours)

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
git commit -m "phase 2 step 3: real stats page with summary tiles and game table"
git push
```

### Push the live deployment

Since Phase 1 is done, your live server at `https://starbite-server.onrender.com/stats` will auto-deploy when Hara merges your branch into `main`. Until then, only your local server has the new page.

---

## Step 2.4 — Polish & extend (whenever you have time)

You've got a working stats service. Anything below is bonus — pick whatever sounds fun.

### Easy extensions (~30 min each)

- **Sortable columns.** Add click-to-sort to the table headers.
- **A "delete all" button** that wipes the file. Add a route `POST /stats/clear` that deletes `games.jsonl`. Useful for the team to reset between demos.
- **Filter by player count.** Add a small `<select>` above the table that filters games by 5-player, 6-player, etc.
- **Show date grouping.** Group games by day with a header like "Today", "Yesterday".

### Medium extensions (~1 hour each)

- **Per-game detail page.** When the user clicks on a row, show a detail view with everything the record contains.
- **Charts.** Use [Chart.js](https://www.chartjs.org/) (one `<script>` tag, no build step) to add a "win rate over time" or "average satisfaction over time" chart.
- **Track more data.** Want to know how many emergency meetings were called, or how many flags were placed at Review? Edit `types.ts` to add the field, then ask Hara to populate it in `endGame()`.

### Harder extensions (~half a day each)

- **Per-player stats.** Add a `players` array to GameRecord with each player's name, role, and whether they were ejected.
- **Round timeline.** Capture key events (label submissions, flags, meetings, ejections) with timestamps. Show them on a horizontal timeline.

When you add fields, follow this pattern:
1. Edit `types.ts` to add the field
2. If it comes from gameplay, ask Hara to populate it in `GameRoom.endGame()`
3. Use it in `routes.ts` to render

---

# 🛟 Tips for getting unstuck (both phases)

## Phase 1 (deployment)

**Build fails on Render with "command not found":**
- Check `NODE_VERSION` env var is set to `20`.

**Server says "Bad Gateway" but Render shows it as live:**
- Server is sleeping. Visit `https://your-server.onrender.com/health` to wake it. Wait 30 sec.

**Client loads but doesn't show the title screen:**
- Open devtools → Console. The error usually says what's missing. Most likely `VITE_SERVER_URL` is unset.

**"Network error" when clicking Create Room:**
- WebSocket connection is failing. Check `VITE_SERVER_URL` is `wss://` (not `https://`).
- Try the server's `/health` URL directly — if that fails, the server is the problem, not the client.

**You changed something in the repo and want to redeploy:**
- Render auto-deploys from `main` after any merge. If you push to `shreya/track`, it won't deploy until Hara merges into `main` — OR you can change the Render service's branch to `shreya/track` temporarily.

## Phase 2 (stats)

**Server won't start after you edit something:**
- Look at the error message in the terminal carefully — usually points at the line.
- Restore the file from git if needed: `git checkout server/src/stats/store.ts`

**Page is blank or shows "No games played yet" forever:**
- Open browser devtools → Network tab. Reload the page. Look for the `/stats/games` request. Click it, look at the response.
- Open `server/data/games.jsonl` in a text editor — is there content? If the file is empty, the hook isn't firing. Confirm with Hara.

**TypeScript complains about types:**
- Read past the first line of the error. "Property X does not exist on type Y" means you misspelled something.
- Run `npm run typecheck --workspace=server` to see all type errors at once.

**Hard-refresh the browser** (Cmd-Shift-R) when you see stale content — the cached old version might still be loaded.

**You're stuck in any way:**
- Take a screenshot of the terminal or browser, send to Hara with one sentence describing what you tried.

---

# What "done" looks like

**Minimum (Phase 1 only):**
- Public Player URL works (e.g., `https://starbite.onrender.com`)
- Hara, Sky, and you can join games via that URL
- Player URL is in the README
- Helper 4 has the URL for external playtest

**Full track (Phase 1 + Phase 2):**
- Everything above, PLUS
- Game records persist to `games.jsonl`
- They survive a server restart
- `/stats` shows a real, readable summary

**Stretch (Phase 1 + Phase 2 + bonus):**
- Anything from Step 2.4

You're owning two pieces the rest of the team isn't going to touch. When this lands, the team will be able to share a URL with anyone, AND a teacher running the game in a real classroom will have a real history page they can use in the debrief. Both are real, useful contributions.

If you get stuck, message Hara. Have fun.
