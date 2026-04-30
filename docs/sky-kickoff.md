# Sky's Claude Code kickoff

**You are Sky's Claude Code session.** Read this entire file before doing anything else. It will catch you up on a multi-day game build that's already in progress.

---

## What you're working on

Sky and her teammate Hara are building **Star Bite Diner**, a multiplayer learning game for grades 4–8 about training AI by labeling examples. It's their final project for "Designing Games for Learning." Deadline: **Tuesday May 5, 2026**. Today is roughly **Thursday May 1, 2026** — depends on when you're reading this.

The game has already been scaffolded by another Claude Code session (Hara's). The architecture is set, the network protocol is locked, the server is half-built, and the client has working scenes. **Your job is to flesh out Sky's track of work.**

**You are not allowed to change the network protocol.** That's the one rule you cannot break. Hara's Claude is coding against the same `/shared/src/protocol.ts` and `/shared/src/schema.ts`. If you change those files, Hara's track breaks. If a message you need is missing, **ask Sky** and she'll coordinate with Hara before you change anything in `/shared/`.

---

## Read these files first (in order)

1. **`/README.md`** — project overview, run commands
2. **`/docs/architecture.md`** — system diagram, where state flows, how things connect
3. **`/shared/src/constants.ts`** — gameplay tuning values you'll reference often
4. **`/shared/src/protocol.ts`** — every message between client and server. Memorize this.
5. **`/shared/src/schema.ts`** — the shared world state Colyseus syncs
6. **`/server/src/rooms/GameRoom.ts`** — server logic. Know the message handlers but you mostly won't edit this.
7. **`/client/src/App.tsx`** and the scenes under `/client/src/scenes/` — current client structure
8. **`/client/src/store/game.ts`** — Zustand store, the client-side state mirror

If you read those 8 files, you'll have a complete mental model.

---

## The stack

- **Language:** TypeScript everywhere
- **Server:** Node 20+ + Colyseus 0.16 (authoritative multiplayer rooms) + Express
- **Client:** React 18 + Vite + Tailwind + Zustand (state mgmt) + colyseus.js (network) + @dnd-kit (drag-and-drop)
- **Repo layout:** monorepo with npm workspaces. `/server`, `/client`, `/shared`, `/content`, `/docs`.

### Run it locally
From the repo root:
```bash
npm install
npm run dev:server     # starts Colyseus on :2567
# in another terminal:
npm run dev:client     # starts Vite on :5173
```
Open `http://localhost:5173` in 2+ browser windows to test multiplayer locally.

Colyseus monitor: `http://localhost:2567/colyseus` — peek at room state during dev.

---

## Sky's track: "Stations & Loop"

You own **anything related to mini-games, customer interaction, and player feedback**. Specifically:

### Files Sky is responsible for
- `client/src/components/stations/GrillStation.tsx` — already exists, polish + improve
- `client/src/components/stations/TrashStation.tsx` — already exists, add drag-and-drop
- `client/src/components/stations/ReviewStation.tsx` — already exists, improve readability
- `client/src/components/customer/CustomerTicker.tsx` — already exists, make it delightful
- `client/src/components/HUD.tsx` — already exists, tune for clarity
- `client/src/components/AlertBanner.tsx` — already exists, polish

Plus any new components under `client/src/components/customer/` or `client/src/components/stations/` if you split things.

### Files Hara is responsible for (DO NOT EDIT WITHOUT TALKING TO SKY)
- Any file in `/server/`
- `client/src/scenes/Game.tsx` (orchestrates everything — coordinate before changing)
- `client/src/scenes/Lobby.tsx`
- `client/src/scenes/Meeting.tsx`
- `client/src/scenes/EndScreen.tsx`
- `client/src/components/Map.tsx`
- `client/src/components/StationModal.tsx`
- `client/src/net/client.ts`

If you absolutely need to change one of Hara's files (say, to wire in a new component), have Sky text Hara to coordinate. Better to add a new file than to edit an existing one.

### Files NOBODY edits without consensus
- `/shared/src/*.ts` — the contract. Changing this breaks the other half.

---

## Branch + commit hygiene

- Sky works on a branch called **`sky/stations`** off `main`.
- Before you start coding each session, **`git pull origin main`** to get Hara's latest.
- Commit small and often. Push at least every 2 hours of work.
- Commit messages: short imperative — "polish trash station drag-and-drop", "add customer happy animation"
- **Don't merge to main yourself** — Sky and Hara will sync at end-of-day to merge both branches together.

---

## Your first 3 tasks (do them in order)

### Task A — Get the game running locally and play through it (~15 min)
- `npm install` from repo root
- Run server + client (commands above)
- Open 5 browser windows, create a room in window 1, join with the room code in the others
- Set names, start the game (need ≥5 players)
- Walk around with WASD, click stations, label things
- **Confirm it works end-to-end before you change anything.** If something is broken, tell Sky immediately — that's a Hara problem.

### Task B — Drag-and-drop on Trash Station (~45 min)
The current TrashStation is button-based. Replace with drag-and-drop using `@dnd-kit/core` (already installed):
- The trash item appears in a "draggable" zone at the top of the modal
- 3 bins (recycle/compost/landfill) appear below as drop targets
- Player drags the item into a bin → that triggers the same `submitLabel` message currently triggered by buttons
- Saboteur poison-mode should still work — maybe a separate "Poison drop" button below, or a long-press
- The dragged item snaps back if dropped outside a bin

Reference: [@dnd-kit docs](https://dndkit.com/) — they have a quickstart with exactly this pattern.

**Don't change** the network message contract — keep using `ClientMsg.SubmitLabel` and `ClientMsg.PoisonLabel`.

### Task C — Customer animation polish (~45 min)
The current `CustomerTicker.tsx` is functional but bland. Make it satisfying:
- Slide-in animation from the right
- Customer emoji is huge and bouncy (especially happy ones)
- For "angry," shake the panel
- For each per-station outcome, animate the ✅ / ❌ icons in sequence with brief delays (like dice rolls)
- Sound effects (helper 5 is providing these — check `/client/public/sounds/` for `sfx_customer_happy.mp3`, etc.; if those don't exist yet, leave a `// TODO: play sound` comment)

Use Tailwind animations + `@keyframes` in `/client/src/styles/global.css` for anything custom.

---

## After those 3, ask Sky what's next

Likely options in priority order:
1. Polish HUD readability (per-station accuracy bars, satisfaction meter)
2. Improve ReviewStation layout — make it skim-able at a glance
3. Add "your last 3 labels" memory at each station (helps players self-correct)
4. Sound integration (once Helper 5 delivers files)
5. Customer arrival animation (a customer sprite walks up before the result)

Sky knows the game design priorities; let her direct.

---

## Things to know about Colyseus state

The server holds an authoritative `StarBiteState`. Clients receive automatic delta updates. From client code:

```ts
import { useGameStore } from "../store/game.js";
const state = useGameStore((s) => s.state);
// state.satisfaction, state.players (MapSchema), state.stations (MapSchema), etc.
```

`MapSchema` and `ArraySchema` work like Map/Array but they're Colyseus-aware. Iterate with `[...state.players.values()]`.

**Reactivity caveat:** Zustand re-renders the store-using component when `setState` is called in `net/client.ts`. The `onStateChange` listener in `wireRoom` does this every time the server pushes an update. If you find a component not re-rendering when state changes, it's because `state` is the same object reference — not a Zustand bug. Workaround: subscribe to `state.satisfaction` directly:

```ts
const satisfaction = useGameStore((s) => s.state?.satisfaction ?? 0);
```

That subscribes to a primitive, which Zustand handles cleanly.

---

## Things you're allowed to do without asking

- Add new files under `client/src/components/`
- Add new Zustand store fields (in `client/src/store/game.ts`) for client-only UI state
- Add CSS / Tailwind classes
- Install new client-side npm packages (animations, etc.) — but check size first
- Ship visual polish, micro-interactions, animations

## Things you are NOT allowed to do without asking

- Change `/shared/src/*.ts`
- Change network message names or payloads
- Change Hara's listed files (above)
- Add new server-side code
- Restructure folder layout

If you think you need any of those, ask Sky. She'll either give you the go-ahead or coordinate with Hara.

---

## Style guide

- Match the existing code style — TypeScript strict, named exports, Tailwind classes, no inline styles unless dynamic
- Use the color tokens defined in `client/tailwind.config.js`: `bg-diner-bg`, `text-diner-warm`, `border-diner-good`, etc.
- Comments: only when the *why* is non-obvious. Don't comment what the code already says.
- No `any` types. If you need one, leave a `// TODO: type this` comment.
- No `console.log` in committed code — use them while debugging, then remove.

---

## When you're stuck

In order:
1. Re-read this file
2. Read `/docs/architecture.md`
3. Tell Sky what you tried and what didn't work — she'll coordinate

Sky has limited context for the codebase, so when explaining a problem to her, **be concrete**: "I added X to file Y, expected Z, but got W." Not "it's not working."

---

## The vision

Star Bite Diner is supposed to feel **warm, silly, and inviting**. Not slick. Not scary. Imagine Pixar art direction meets Among Us meets a 50s milkshake bar. The bots are friendly. The saboteurs are goofy mischief, not menace. **Mistakes are framed as "the bot got confused," not "you failed."**

Your animations and feedback loops are what carry that tone. Make it feel like the game is rooting for the player.

Have fun. Make Sky look brilliant.

— Hara's Claude (the one that scaffolded this)
