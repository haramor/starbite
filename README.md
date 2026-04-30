# Star Bite Diner

A cooperative social-deduction game about training AI by labeling examples — for grades 4–8. **Final project for Designing Games for Learning.**

> Train the bots. Spot the saboteurs. Don't let customer satisfaction crash.

---

## Quickstart

Requires **Node 20+** and **npm 10+**.

```bash
npm install
npm run dev:server     # Colyseus on http://localhost:2567
npm run dev:client     # Vite on http://localhost:5173
```

Open `http://localhost:5173` in two or more browser windows. Create a room in one, share the 4-letter room code, join in the others. Need ≥5 players to start a round.

Colyseus monitor (peek at room state during dev): `http://localhost:2567/colyseus`

---

## Repo layout

```
starbite/
├── shared/      Source-of-truth: protocol + state schema + constants. Imported by both server and client.
├── server/      Colyseus authoritative game server. All gameplay rules live here.
├── client/      React + Vite client. Players' browser tab.
├── content/     JSON content the server loads at startup (training data, customer orders).
└── docs/        Architecture notes + helper task specs.
```

The repo is an **npm workspaces** monorepo. Run commands from the root.

### Workspace commands
```bash
npm run dev            # both server + client (best in 2 terminals via dev:* scripts)
npm run dev:server
npm run dev:client
npm run typecheck      # type-check all workspaces
npm run build          # production build
```

---

## How to contribute (build week)

| Person | Track | Files they own |
| --- | --- | --- |
| **Hara** | World & Roles | server/ (except /stats/), client lobby+game+meeting+endscreen+map+stationmodal scenes, net/, store/ |
| **Sky** | Stations & Loop | client/src/components/stations/*, customer/*, HUD, AlertBanner, ChatPanel |
| **Shreya** | Deployment + stats | Render setup — see `/docs/shreya-deploy.md` (do first), then `/docs/shreya-kickoff.md` |
| Helpers (×5) | Content + assets + classroom + playtest + audio | see `/docs/helpers/` |

**The contract:** `/shared/src/*.ts` is sacred. Don't change it without coordinating with the other coder, because both client and server depend on it.

**Branches:**
- Hara: `hara/world`
- Sky: `sky/stations`
- Shreya: `shreya/stats`
- Merge to `main` end-of-day Day 1 and Day 2.

---

## Game design (high-level)

5–10 players join a room. The host starts a 6-minute round. Players are secretly assigned roles:
- **Trainers** (most players) — submit correct labels at training stations to teach the bots
- **Saboteurs** (2–4 depending on player count) — secretly submit wrong labels to poison training data

Three stations:
- 🔥 **Grill Bot** — binary classifier (rare vs. done)
- 🗑️ **Trash Sorter** — 3-class (recycle / compost / landfill)
- 🔍 **Review & Security** — audit recent labels and flag suspicious ones (removes them from training data)

Every 30 seconds a customer arrives with an order. The bots try to fulfill it; success is **probabilistic** based on each station's current accuracy. A happy customer raises team satisfaction; an angry one drops it hard.

**Win conditions:**
- **Crew wins** if satisfaction ≥85% when the timer ends, or all saboteurs are voted out.
- **Saboteurs win** if satisfaction hits 0% or the timer ends with saboteurs still active.

Players can call up to 2 emergency meetings per round to discuss + vote.

For the full design doc and pedagogy, see the original design brief Hara has.

---

## Pedagogy (what the game teaches)

By playing the game (no jargon used during play), students experience:

- AI learns from examples — labels become behavior
- Bad data poisons a model — but enough good data overwhelms the bad
- A model isn't smart or dumb — it's a mirror of its training
- Auditing data is a real skill (the Review station is exactly this)
- Bad data has many sources: mistakes, ambiguity, sabotage — the downstream effect is the same
- AI is probabilistic — outcomes are odds, not certainties

A teacher debrief afterward attaches vocabulary: *training data, model accuracy, data poisoning, dataset auditing, ground truth, probabilistic.*

See `/docs/teacher/` (filled in by Helper 3) for classroom materials.

---

## Deployment (Tuesday demo)

Target host: [Render free tier](https://render.com).
- One **Web Service** for the Colyseus server (Node)
- One **Static Site** for the React client
- Set `VITE_SERVER_URL` env var on the client to the deployed server's `wss://` URL

Detailed deploy steps: `/docs/deploy.md` (write this on Day 4).

---

## Credits

Built by **Hara Moraitaki**, **Sky Pulling**, and team helpers Lillia, Shreya, Raia, Ellis, Aimee.
For: MIT/Harvard 9.s916 / 6.s041 (or whatever course is correct — update this!).
Art: [Kenney.nl](https://kenney.nl) (CC0).
Sound: see `/client/public/sounds/CREDITS.md`.
