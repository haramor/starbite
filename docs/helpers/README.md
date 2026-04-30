# Helper tasks — status & assignments

Quick-glance overview of who's doing what. **Last updated: 2026-04-30.**

---

## Status legend

- ✅ **DONE** — completed, no further action
- ⚠️ **PARTIAL** — some work done, some left
- 📋 **OPEN** — needs a human, hasn't started
- ⏳ **WAITING** — assigned but not yet started

---

## Helper tasks

| # | Task | Status | What's left | Doc | Estimated time left |
| --- | --- | --- | --- | --- | --- |
| 1 | Label content (game data) | ✅ DONE | — (optional: add MORE entries) | [`1-label-content.md`](./1-label-content.md) | 0 |
| 2 | Asset wrangler (Kenney sprites) | 📋 OPEN | All of it | [`2-asset-wrangler.md`](./2-asset-wrangler.md) | 2–3 hr |
| 3 | Classroom materials | ⚠️ PARTIAL | PDF exports of debrief deck + rules card (~1.5 hr) | [`3-classroom-materials.md`](./3-classroom-materials.md) | ~1.5 hr |
| 4 | Playtest lead + lobby UX | 📋 OPEN | All of it (needs real humans) | [`4-playtest-lead.md`](./4-playtest-lead.md) | 4–6 hr |
| 5 | Sound + flavor | ⚠️ PARTIAL | SFX downloads only (flavor text done) | [`5-sound-flavor.md`](./5-sound-flavor.md) | ~1.5 hr |

## Coding tracks

| Track | Status | What's left | Doc |
| --- | --- | --- | --- |
| Hara — World & Roles | ✅ DONE (all 4 phases) | — | (no doc; works on `hara/world` branch) |
| Sky — Stations & Loop | ⏳ WAITING | Whatever Sky's Claude works through | [`../sky-kickoff.md`](../sky-kickoff.md) |
| Shreya — Deploy + Stats | ⚠️ PARTIAL | Phase 1 (Render deploy) only | [`../shreya-kickoff.md`](../shreya-kickoff.md) |

---

## Suggested assignments (5 helpers)

You have 5 helpers (Lillia, Shreya, Raia, Ellis, Aimee). Three tasks need a human; that's flexible, you can have one person take a small task and another help with the bigger ones. **Suggested split:**

| Helper | Task | Why |
| --- | --- | --- |
| 1 helper | Helper 2 — Asset wrangler | Self-contained, ~2–3 hr, fun (Kenney sprite hunting) |
| 1 helper | Helper 3 — PDF exports | Quick (~1.5 hr), needs design eye |
| 1 helper | Helper 4 — Playtest lead | Ongoing, runs sessions Sun + Mon |
| 1 helper | Helper 5 — SFX downloads | ~1.5 hr, similar vibe to Helper 2 |
| 1 helper | Backup / extra polish | Could add more `grill.json`/`trash.json` entries, or run more playtests with Helper 4, or design a logo |

---

## What to send each helper

Just paste them the URL to their doc:

- Helper 2: `https://github.com/haramor/starbite/blob/main/docs/helpers/2-asset-wrangler.md`
- Helper 3 (PDFs): `https://github.com/haramor/starbite/blob/main/docs/helpers/3-classroom-materials.md`
- Helper 4: `https://github.com/haramor/starbite/blob/main/docs/helpers/4-playtest-lead.md`
- Helper 5 (SFX): `https://github.com/haramor/starbite/blob/main/docs/helpers/5-sound-flavor.md`

The doc tells them everything: what to do, where to find assets, how to commit to GitHub. They don't need to read this index — that's for **you** to track progress.

---

## Critical-path watchlist

Things that block other things if they slip:

1. **Shreya — Phase 1 deploy** — without a public URL, Helper 4's external playtest can't happen and the Tuesday demo has nothing to share. Highest priority.
2. **Helper 4 — Playtest** (Sunday + Monday) — needs the URL from Shreya. Catches real bugs before Tuesday.
3. **Helper 3 — PDF exports** — graded artifact for the assignment. Needs to land before Tuesday.

Helper 2 (assets) and Helper 5 (SFX) are visual/audio polish — nice but not blocking.

---

## When everything's done, this file should look like this

| All rows ✅ DONE except possibly Helper 4 (which is ongoing through Monday) |

Update the Status column as helpers finish. (Hara/Claude can do this when each PR comes in.)
