# Star Bite Diner — for the next Claude

A multiplayer AI-literacy game for grades 4–8. Class final project. **Tuesday May 5, 2026 = demo deadline.**

If you're a new session opened by Hara, read this whole file first. It points at everything else and warns you about the non-obvious gotchas.

---

## Where to look first

| Question | File |
| --- | --- |
| What is this game / what does the design call for? | `README.md` (top-level overview) + the original design brief Hara has |
| How is the codebase structured? Where does state flow? | `docs/architecture.md` |
| How do I deploy it? | `docs/deploy.md` (5-step Render blueprint flow) |
| What's the team status? Who owns what? | `docs/helpers/README.md` (status dashboard) |
| What bugs / concerns were already triaged? | `docs/code-review.md` |
| Sky's track | `docs/sky-kickoff.md` |
| Shreya's track | `docs/shreya-kickoff.md` |

---

## Run + test commands

```bash
# install everything (first time only)
npm install

# run server + client (each in its own terminal)
npm run dev:server     # Colyseus on :2567
npm run dev:client     # Vite on :5173

# typecheck all 3 workspaces
npm run typecheck

# end-to-end smoke test (server must be running first)
node scripts/smoke-test.mjs

# fast smoke with shortened timers (~25s instead of 6+ min)
STARBITE_TEST_ROUND_SEC=20 \
STARBITE_TEST_FIRST_CUSTOMER_MS=3000 \
STARBITE_TEST_CUSTOMER_MS=3000 \
STARBITE_TEST_MEETING_DISC_SEC=2 \
STARBITE_TEST_MEETING_VOTE_SEC=2 \
npm run dev:server &
sleep 5
node scripts/smoke-test.mjs

# production build
npm run build

# production-style local server (also serves client/dist statically)
npm run start:server
```

The smoke test exercises 41 assertions across the full lifecycle (lobby → playing → customer cycle → meeting/vote/eject → round end → stats logged → reset round → second round). Last known good: **41/41 passing**.

---

## Stack at a glance

- **Server:** Node 20 + Colyseus 0.16 + Express + TypeScript (run via `tsx`)
- **Client:** React 18 + Vite + Tailwind + Zustand + colyseus.js + @dnd-kit
- **Shared:** TS package compiled with `tsc` to `shared/dist/` — both server and client import from there
- **Deploy:** single Render web service driven by `render.yaml`. Server serves `client/dist/` statically in production, so one origin handles both WebSocket and HTML/JS.

---

## Non-obvious gotchas (read before you change things)

### 1. `shared/` must be pre-built before `tsx` can run the server

esbuild emits TC39-standard decorators even when `experimentalDecorators: true`, which breaks `@colyseus/schema`. Workaround: `shared/` is compiled with `tsc` to `shared/dist/`, and server/client import the JS output. The `predev` and `prestart` hooks rebuild `shared/` automatically — don't remove them.

### 2. React state-sync uses a tick counter

Colyseus mutates `room.state` in place, so a Zustand selector returning `s.state` always sees the same reference and doesn't re-render. Solution: every component reads state via `useStarBiteState()` from `client/src/store/game.ts`. The hook subscribes to `stateTick` (bumped on every `onStateChange`) which forces re-renders, then returns the live state.

**Don't use `useGameStore((s) => s.state)` directly in render paths.** It compiles, the smoke test passes, but the UI goes stale.

### 3. Player roles are NOT in the shared schema

`Player.role` would be visible to all clients via Colyseus state sync — kids could open devtools and see who's a saboteur. Roles are stored in `GameRoom.playerRoles: Map<sessionId, Role>` (server-only) and sent privately via `ServerMsg.RoleAssigned`. The schema has `Player.revealedRole`, set only on legitimate reveals (ejection or game end).

### 4. WebSocket URL derivation has three modes

`client/src/net/client.ts`:
1. `VITE_SERVER_URL` set → use it (escape hatch for split deployments)
2. `import.meta.env.DEV` true → `ws://localhost:2567`
3. Production → derive from `window.location` (same origin)

This is what enables the single-service deploy. Don't break it.

### 5. Stats data path is relative to cwd, not source

npm workspaces cwd into the package dir before running scripts, so `process.cwd()` is `/<repo>/server` when the server boots. The data path is `resolve(process.cwd(), "data", "games.jsonl")` — NOT `resolve(process.cwd(), "server", "data", ...)`. Don't add a `server/` prefix; you'll create `server/server/data/`.

### 6. Branch ownership

| Branch | Owner | Files they edit |
| --- | --- | --- |
| `hara/world` | Hara | server/, scenes/Lobby/Game/Meeting/EndScreen, components/Map, store/, net/ |
| `sky/stations` | Sky (`spulling23`) | components/stations/*, components/customer/*, HUD, AlertBanner, ChatPanel |
| `shreya/track` | Shreya | server/src/stats/ only |

Cross-edits cause merge conflicts. The shared contract is `shared/src/*.ts` — **never change without coordinating both halves in one commit.**

---

## Status as of last session (Thursday April 30 evening)

### Coding tracks: ✅ All shipped to `main`

- Hara's track (World & Roles): all 4 phases shipped — smooth movement, lobby role preview, play-again, urgency timer, meeting polish, end-screen polish, saboteur HUD
- Sky's track (Stations & Loop): drag-and-drop trash, cooking-themed grill, animated alerts, customer animations all merged
- Shreya's Phase 2 (stats): file-backed JSONL, full `/stats` HTML dashboard

### Bug fixes shipped

- Host reassignment skipped disconnected/ejected players (reported by Sky)
- React state sync (different tabs showed different state — reported by Sky, fixed via `useStarBiteState` hook)
- Vote validation (server now checks voter alive + target alive-or-skip)
- Click-station-from-far-away no longer errors — auto-walks then enters

### Critical path for Tuesday

1. **Sky's Render deploy** — in progress as of last session. `render.yaml` is at repo root, `docs/deploy.md` has the 5-step flow. **Single-service architecture** (verified working). Sky was about to merge her branch into main and run the blueprint.
2. **Helper 4 playtest** — Sunday (internal) + Monday (external). Needs deploy URL to run external playtest.
3. **Helper 3 PDFs** — Markdown sources at `docs/teacher/*.md` are done; needs someone to paste into Google Slides/Docs and export to PDF.

### Helpers status (full table in `docs/helpers/README.md`)

- ✅ Helper 1 (label content) — done. 40 grill, 40 trash, 20 orders.
- 📋 Helper 2 (Kenney art assets) — open
- ⚠️ Helper 3 (classroom materials) — Markdown done; PDFs pending
- 📋 Helper 4 (playtest) — needs deploy URL
- ⚠️ Helper 5 (sound + flavor) — flavor done; SFX pending

---

## Scheduled check-in agent

A one-time remote agent fires **Sunday May 3 at 9 AM Eastern** to assess project state and write a status report. Routine ID: `trig_01EjkvUYfto4aYaEEM9maTkP`. Manage at: https://claude.ai/code/routines/

Requires GitHub access for the repo. If `/web-setup` or the GitHub App hasn't been configured, the agent will fail to clone — Hara needs to set this up before Sunday.

---

## When you (next Claude) re-open this session

Quickstart:

1. Read this file (you're here).
2. `git pull origin main` — get the latest.
3. `npm install` if `node_modules/` is missing.
4. `git log --oneline -10` to see what changed since Thursday.
5. Check branches: `git branch -r` and `git log main..origin/sky/stations --oneline` etc.
6. Run `npm run typecheck` to verify the build is healthy.
7. Run the smoke test to verify gameplay logic still works.
8. Ask Hara what she's working on / what changed.

If smoke is failing or typecheck is broken, that's your first job. The repo was healthy as of Thursday evening.

---

## Conventions

- Use **Edit** to modify files, not `sed`. Use **Write** to create files, not `echo > file`.
- TypeScript strict mode everywhere. Avoid `any` — leave `// TODO: type this` if needed.
- No `console.log` in committed code.
- Comments only when WHY is non-obvious. Don't comment what the code already says.
- Tailwind for styles. Color tokens are defined in `client/tailwind.config.js`: `bg-diner-bg`, `text-diner-warm`, etc.
- Commit messages are imperative and short. Co-authoring with Claude is fine in commit footer.
- Shared protocol changes require server + client edits in the same commit.

---

## What NOT to touch unless coordinated

- `shared/src/*.ts` (the contract — both halves depend on it)
- `render.yaml` and the deploy plumbing in `server/src/index.ts` (Sky verified it works end-to-end)
- The smoke test (`scripts/smoke-test.mjs`) — extend it but don't break the existing assertions

If you have to change one of these, run the smoke test before and after.
