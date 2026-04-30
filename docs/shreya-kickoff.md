# Shreya's track

> ## ✅ Phase 2 (Stats) COMPLETED — 2026-04-30
>
> Hara's Claude implemented Phase 2 ahead of you. What's done:
> - **`server/src/stats/store.ts`** — file-backed JSONL persistence at `server/data/games.jsonl`. Records survive server restarts.
> - **`server/src/stats/routes.ts`** — full HTML dashboard at `/stats` with summary tiles (rounds played, crew win rate, avg satisfaction, avg round length) + sortable game-by-game table. Auto-refreshes every 5s.
> - **Smoke test verified.** Records persist, `/stats/games` returns valid JSON, page renders.

> ## ➡️ Phase 1 (Deploy) is now Sky's
>
> Sky volunteered to take this. The deploy is now a **5-step blueprint flow** (~15 min) thanks to a `render.yaml` at the repo root + a unified single-service architecture. Full instructions: **[`/docs/deploy.md`](./deploy.md)**.
>
> If Sky needs to hand it off or you want to do it yourself, just follow that doc.

---

## So what's left for you?

Honestly, not much that's blocking. Both phases of your original track are done. Three optional ways to help if you have bandwidth:

### Option A — Add bonus features to the stats page (~1–2 hr)

The current `/stats` page is functional but minimal. Anything from Step 2.4 of the original kickoff would be a real polish win, in priority order:

1. **Sortable columns.** Click a header to sort the table by that column. Vanilla JS, no library.
2. **Per-game detail page.** Click a row → modal/expand showing everything in the record (per-station accuracies as a chart, customer outcomes timeline, etc.).
3. **Filter by player count.** Small `<select>` above the table.
4. **Charts.** Win-rate over time, average satisfaction over time. Use [Chart.js](https://www.chartjs.org/) — one `<script>` tag, no build step.
5. **Date grouping.** Group games by day with "Today", "Yesterday" headers.

All of these live in `server/src/stats/routes.ts` (the inline HTML). You can edit and `npm run dev:server` to iterate locally, then commit.

### Option B — Track more stats (~1 hr)

Anything else interesting you want to record? Edit `server/src/stats/types.ts` to add a field, ask Hara to populate it in `GameRoom.endGame()`, then render it on the page.

Suggestions:
- Number of emergency meetings called per round
- Total flags placed at Review
- Per-player labels submitted (the most active labeler wins a "Most Diligent" badge?)
- Average accuracy across the whole round (vs. just the final accuracy)

### Option C — Help with playtest or assets

Helper 2 (assets) or Helper 4 (playtest) could use a hand. See `/docs/helpers/README.md` for status.

---

## Working with the codebase

Same as before:

```bash
git fetch
git checkout shreya/track   # or `git checkout -b shreya/track` first time
git pull origin main
```

Then:
```bash
npm install
npm run dev:server     # leave this running
npm run dev:client     # in another terminal
```

Visit `http://localhost:5173` to play, `http://localhost:2567/stats` to see the stats page.

When you're done with a unit of work:
```bash
git add server/src/stats/
git commit -m "describe your change"
git push
```

Hara merges your branch in when it's ready.

---

## Reference: where stuff lives

```
server/src/stats/
├── types.ts        ← shape of a GameRecord (extend this for new fields)
├── store.ts        ← file-backed persistence (probably don't need to touch)
├── routes.ts       ← /stats and /stats/games endpoints (THIS is where the
│                     HTML page lives — it's a const string at the bottom)
└── index.ts        ← entry point + logGameResult function
```

If you need to add fields that come from gameplay, ask Hara — she'll add the populate step in `GameRoom.endGame()`.
