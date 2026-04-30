// HTTP routes for the stats module.
//   GET /stats/games  → JSON feed of recent games (used by the page)
//   GET /stats        → HTML dashboard for teachers / debriefs

import type { Express } from "express";
import { getRecentRecords } from "./store.js";

export function mountStatsRoutes(app: Express): void {
  app.get("/stats/games", (_req, res) => {
    const games = getRecentRecords(50);
    res.json({ count: games.length, games });
  });

  app.get("/stats", (_req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(STATS_PAGE_HTML);
  });
}

// All-in-one HTML page. Self-fetches /stats/games every 5s for live updates.
// Inlined here so it ships with the server bundle and works on every deploy
// without a separate static-file pipeline.
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
      font-family: system-ui, -apple-system, Segoe UI, sans-serif;
      min-height: 100vh;
    }
    .wrap { max-width: 1080px; margin: 0 auto; padding: 40px 20px 60px; }
    h1 { margin: 0; font-size: 28px; }
    .sub { color: var(--muted); margin-top: 6px; font-size: 14px; }
    .summary {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin: 28px 0;
    }
    .stat {
      background: var(--panel);
      padding: 18px;
      border-radius: 14px;
    }
    .stat .label {
      color: var(--muted);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .stat .value { font-size: 28px; font-weight: 700; margin-top: 6px; }
    table {
      width: 100%;
      border-collapse: collapse;
      background: var(--panel);
      border-radius: 14px;
      overflow: hidden;
    }
    th, td {
      padding: 12px 14px;
      text-align: left;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      font-size: 14px;
    }
    th {
      background: rgba(0,0,0,0.2);
      color: var(--muted);
      font-weight: 600;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.06em;
    }
    tr:last-child td { border-bottom: none; }
    .pill {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .pill.crew { background: var(--good); color: #003a23; }
    .pill.saboteurs { background: var(--bad); color: #4a0014; }
    .empty {
      padding: 60px 20px;
      text-align: center;
      color: var(--muted);
      background: var(--panel);
      border-radius: 14px;
    }
    .acc-bars { display: flex; gap: 6px; flex-wrap: wrap; }
    .acc-bar {
      font-size: 11px;
      padding: 3px 8px;
      background: rgba(255,255,255,0.08);
      border-radius: 6px;
    }
    .footer { margin-top: 28px; color: var(--muted); font-size: 12px; text-align: center; }
    @media (max-width: 720px) {
      .summary { grid-template-columns: repeat(2, 1fr); }
      table { font-size: 12px; }
      th, td { padding: 8px 10px; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Star Bite Diner — game history</h1>
    <div class="sub">A record of every round that's been played on this server. Auto-refreshes every 5 seconds.</div>

    <div id="summary" class="summary"></div>
    <div id="content"></div>
    <div class="footer">Star Bite Diner · stats served from <code>/stats/games</code></div>
  </div>

  <script>
    function fmtDate(ts) {
      const d = new Date(ts);
      return d.toLocaleString();
    }
    function pct(n) {
      return Math.round(n) + '%';
    }
    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      })[c]);
    }

    async function load() {
      let data;
      try {
        const res = await fetch('/stats/games');
        data = await res.json();
      } catch (err) {
        document.getElementById('content').innerHTML =
          '<div class="empty">Could not reach the server.</div>';
        return;
      }
      const games = data.games || [];
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
          .map(function(entry) {
            return '<span class="acc-bar">' + escapeHtml(entry[0]) + ' ' + pct(entry[1]) + '</span>';
          })
          .join('');
        return '<tr>' +
          '<td>' + fmtDate(g.endedAt) + '</td>' +
          '<td><code>' + escapeHtml(g.code) + '</code></td>' +
          '<td>' + g.numPlayers + '</td>' +
          '<td>' + g.numSaboteurs + '</td>' +
          '<td><span class="pill ' + g.winner + '">' + escapeHtml(g.winner) + '</span></td>' +
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
    setInterval(load, 5000);
  </script>
</body>
</html>`;
