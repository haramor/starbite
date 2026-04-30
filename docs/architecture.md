# Architecture

A short tour of how Star Bite Diner is wired up.

## The big picture

```
┌─────────────────────┐                    ┌──────────────────────┐
│   Player browser    │                    │   Colyseus server    │
│  (React + Vite)     │  ── WebSocket ──▶  │   (Node + Colyseus)  │
│                     │  ◀── Schema sync ── │                      │
│  - Title / Lobby    │                    │  - GameRoom          │
│  - Game (map, HUD)  │  ── ClientMsg.* ──▶ │  - tick loop (50ms)  │
│  - Station modal    │  ◀── ServerMsg.* ── │  - content loader    │
│  - Meeting / End    │                    │  - role assignment   │
└─────────────────────┘                    └──────────────────────┘
        ▲                                              ▲
        │                                              │
        │  imports types + constants                   │
        │           ┌──────────────────┐               │
        └──────────▶│   /shared/src    │◀──────────────┘
                    │  protocol.ts     │
                    │  schema.ts       │
                    │  constants.ts    │
                    │  content-types.ts│
                    └──────────────────┘
```

**Authoritative server.** All gameplay rules run server-side. The client is presentation + input. This means a malicious client can't cheat by submitting fake labels or moving through walls — the server validates everything.

**Schema-based state sync.** The server holds an instance of `StarBiteState` (defined in `/shared/src/schema.ts`). Colyseus computes binary deltas and pushes them to clients automatically. Clients receive a synced mirror of that state via `room.onStateChange`.

**One-shot messages.** Some events aren't appropriate for shared state — a private "your secret role" message, an "alert banner!" trigger, etc. Those are sent via `room.send(name, payload)` and `room.onMessage(name, handler)`. All names live in `ServerMsg` and `ClientMsg` enums in `/shared/src/protocol.ts`.

## File map

```
shared/src/
├── constants.ts        Tuning values: round length, satisfaction thresholds, station
│                       definitions, saboteur counts, map size. Both sides import.
├── content-types.ts    Type definitions for /content/*.json (GrillItem, TrashItem,
│                       OrderTemplate, CustomerProfile).
├── protocol.ts         Network messages (ClientMsg, ServerMsg) and their payload
│                       interfaces. THE source-of-truth contract.
├── schema.ts           Colyseus state schema (Player, Station, TrainingExample,
│                       LabelSubmission, CustomerOrder, Meeting, StarBiteState root).
└── index.ts            Barrel exports for ergonomic imports.

server/src/
├── index.ts            Boots Express + Colyseus + monitor, defines "starbite" room.
├── rooms/
│   └── GameRoom.ts     The main game class. onCreate, onJoin, onLeave, message
│                       handlers, and the tick loop.
├── logic/
│   ├── codes.ts        Generates 4-letter room codes.
│   ├── roles.ts        Assigns saboteurs at game start.
│   ├── accuracy.ts     Pure functions for the probabilistic accuracy model.
│   └── customer.ts     Picks an order, rolls outcomes per station, computes
│                       satisfaction delta.
└── content/
    └── loader.ts       Reads /content/*.json into memory at server start.

client/src/
├── main.tsx            React root.
├── App.tsx             Scene router based on state.phase.
├── styles/global.css   Tailwind imports + a few custom classes.
├── store/
│   └── game.ts         Zustand store. Holds the room handle, state mirror, and
│                       transient UI state (current example, role, alerts, errors).
├── net/
│   └── client.ts       Wraps colyseus.js Client. Connects, joins/creates rooms,
│                       wires server messages into the store.
├── scenes/
│   ├── Title.tsx       Pre-room screen. Create or join.
│   ├── Lobby.tsx       Waiting room. Avatar + name pick. Host starts.
│   ├── Game.tsx        Main play view. Composes HUD, Map, StationModal,
│                       CustomerTicker, AlertBanner, ChatPanel.
│   ├── Meeting.tsx     Discussion → voting → results UI.
│   └── EndScreen.tsx   Winner reveal + role reveal.
└── components/
    ├── Map.tsx         Top-down tile map with stations and players.
    ├── HUD.tsx         Top bar: satisfaction, timer, accuracies, meeting button.
    ├── StationModal.tsx        Modal that opens at a station; routes to the
    │                           right mini-game.
    ├── AlertBanner.tsx Pop-up when station accuracy drops sharply.
    ├── ChatPanel.tsx   Floating chat.
    ├── customer/
    │   └── CustomerTicker.tsx  Animated customer outcome reveal.
    └── stations/
        ├── GrillStation.tsx    Binary labeler.
        ├── TrashStation.tsx    3-class labeler.
        └── ReviewStation.tsx   Audit / flag UI.

content/
├── grill.json          Patty examples + ground truth.
├── trash.json          Trash items + ground truth.
├── orders.json         Customer order templates.
└── customers.json      Customer profiles for visual variety.
```

## Game state flow (one round)

1. **Player connects → joins room.** `wireRoom` in `client/src/net/client.ts` subscribes to state + messages.
2. **Lobby phase.** State is `phase: "lobby"`. Players set names, host clicks Start.
3. **Game starts.**
   - Server runs `assignRoles()` → each saboteur receives `ServerMsg.RoleAssigned` privately.
   - State flips to `phase: "playing"`. Round timer set.
   - First customer is scheduled for `FIRST_CUSTOMER_DELAY_MS` from now.
4. **Tick loop runs every 50ms** server-side:
   - **Movement** — each player's `(x, y)` interpolates toward `(tx, ty)` (the move target).
   - **Customer cycle** — when `Date.now() >= nextCustomerAt`, server picks an order, rolls each requirement against the relevant station's accuracy, sets `state.activeCustomer`, broadcasts `ServerMsg.CustomerResult`.
   - **Round-end check** — satisfaction ≤0 → saboteurs win; timer 0 with all saboteurs ejected → crew wins; timer 0 with satisfaction ≥85 → crew; otherwise saboteurs.
5. **A player walks into a station** (proximity check passes, presses click).
   - Server marks `player.currentStation = stationId`.
   - For grill/trash: server picks a content item, creates or reuses a `TrainingExample`, sends `ServerMsg.CurrentExample` to that player only.
   - For review: nothing extra — client reads `state.stations` and renders recent submissions directly.
6. **Player submits a label.**
   - Server validates: at station, valid label option, example exists.
   - Creates a `LabelSubmission`, appends to the example, recomputes example + station accuracy.
   - If accuracy dropped sharply, broadcasts `AccuracyAlert`.
   - Sends a fresh `CurrentExample` to that player.
7. **Saboteur "poisons":** same path but with `ClientMsg.PoisonLabel` — server enforces role + cooldown, requires the label to actually be wrong, sets `poisonCooldownEndsAt`, sets a longer `isLingering` window.
8. **Player flags at Review:** server finds the submission across all stations, sets `flagged=true`, recomputes accuracy. (Submission is removed from training data effectively because `computeExampleAccuracy` filters out flagged.)
9. **Meeting:** any alive player calls one. Phase → `"meeting"`. After discussion timer → voting timer → results → eject (if any) → back to `"playing"`.
10. **End:** state.phase = `"ended"`, all roles revealed, `ServerMsg.GameEnded` broadcast.

## The probabilistic accuracy model (the pedagogy carrier)

This is the math doing the pedagogical heavy lifting:

- Each `LabelSubmission` is either correct (100%) or wrong (0%).
- A flagged submission is excluded from accuracy calculations.
- `example.accuracy = mean(non-flagged submissions for that example)`. (-1 if no labels yet.)
- `station.accuracy = mean(example accuracies)`. 100 if no examples have been labeled yet (UI default).
- For a customer, each station independently rolls `random() < (accuracy/100)` for success.
- Customer outcome = how many stations succeeded:
  - all succeeded → happy (+4 satisfaction)
  - exactly 1 failed (in a multi-station order) → confused (-6)
  - 2+ failed (or single-station fail) → angry (-14)

Implementation: `server/src/logic/accuracy.ts` and `server/src/logic/customer.ts`.

**Why this works as a teaching tool:** kids see in real time how the bots' performance is mathematical, not magical. A bot trained on 90% good data will *probably* serve customers right. Lots of bad data means lots of angry customers. Removing one bad label doesn't fix a tanked model — but neither does adding one good label fix a tanked model. They feel the math.

## Roles are NOT in shared schema

Important security/privacy note: a player's role (trainer or saboteur) is stored server-side in `GameRoom.playerRoles: Map<sessionId, Role>`, NOT in `Player.role`. Why? Because anything in the schema is visible to all clients (Colyseus can't selectively sync per-client). If a hacker opened devtools and dumped `room.state.players`, they'd see everyone's role.

Roles are sent privately via `ServerMsg.RoleAssigned` once per game per player. The only public role info is `Player.revealedRole`, which is set by the server when:
- A player is ejected (their role is revealed to all)
- The game ends (all roles revealed)

## Adding a new client message (workflow)

1. Add it to `ClientMsg` and add a payload interface in `shared/src/protocol.ts`.
2. Add the entry to `ClientPayloadMap`.
3. Run `npm run typecheck` from root — should still pass.
4. Add a handler in `GameRoom.ts` (`this.onMessage(ClientMsg.YourNew, …)`).
5. From the client: `room.send(ClientMsg.YourNew, payload)`.
6. Commit shared/server/client together (don't split across PRs).

## Adding a new server-broadcast message

1. Add to `ServerMsg` + payload interface in `protocol.ts`.
2. Add a handler in `client/src/net/client.ts` `wireRoom()`.
3. Push the relevant data into the Zustand store.
4. Render it in a component.
5. Server-side: `this.broadcast(ServerMsg.YourNew, payload)` (or `client.send(...)` for targeted).

## Local dev tips

- **Two terminals:** `npm run dev:server` + `npm run dev:client`.
- **Multiple players locally:** open multiple browser windows or different browsers (Chrome + Firefox + Safari) — they each get a fresh sessionId.
- **Inspect state:** `http://localhost:2567/colyseus` shows live rooms and their state.
- **Reset a room:** kill and re-run the server. Rooms are in-memory.
- **Testing role-specific UI:** add a temporary `setMyRole("saboteur")` in `App.tsx` to force a role on yourself for visual work.

## Performance notes (for now, mostly fine)

- Tick is 50ms (20 Hz) — handles up to ~20 players easily.
- Schema deltas are small; full state sync happens once per join.
- Station examples cap at 40 each to avoid unbounded growth.
- Recent customer history caps at 8.

If we ever need to optimize: switch movement to use `client.send` event-style rather than polling-style (player pushes intent only on key change).

## Future-version ideas (not for MVP)

- 5 stations instead of 3 (Clean Bot, Order Matcher)
- Animated customer arrivals (a customer sprite walks across the map)
- Saboteur teams that can identify each other (different game mode)
- Replay system that lets a teacher rewind a round
- Score system tracking per-player good labels for a leaderboard
- Difficulty modes (more saboteurs, faster customer cycle, ambiguous content items)
