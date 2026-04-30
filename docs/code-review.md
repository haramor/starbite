# Code review — pre-Tuesday pass

Snapshot of code-review findings as of 2026-04-30. Done by Hara's Claude as a sanity check before the Tuesday demo.

---

## 🚨 Critical (fix before Tuesday)

### 1. Vote validation is too loose — FIXED

`handleCastVote` accepted any vote without validating the voter or the target:
- Ejected players (`isAlive=false`) could keep voting after meetings carried over
- A malicious or buggy client could vote for a sessionId that wasn't in the room or wasn't a candidate

**Fix landed:** server now checks `player.isAlive` AND validates that `target` is either `"skip"` or a sessionId of a currently-alive player.

### 2. Clicking a station from far away → "too_far" error — FIXED

The server's proximity check (1.5 tile radius) is correct, but the client immediately sent `EnterStation` on click, regardless of player position. From across the map → instant error toast.

**Fix landed:** clicking a station now (a) walks the player to the station's interaction point, (b) sets a `pendingEnterStation` intent, (c) when the player arrives within proximity, the input loop fires `EnterStation` automatically. Behaves like every other top-down game's "click to interact."

---

## ⚠️ Important — flagged but deferring (low risk for the demo)

### 3. setTimeout cleanup on dispose

`handleSubmit` schedules two unkeepable timers (lingering reset + poison-ready ping). When `onDispose` fires (room emptied / server restart), these timers aren't cancelled. They'll fire on a state object with no listeners. Memory leak per timeout, but resolves on GC since callbacks just no-op when player isn't found.

**Severity:** very low. Defer.

### 4. Connection-drop UX

If the WebSocket disconnects mid-game, `room.onLeave` clears state and the UI routes back to the Title screen with no message. Confusing for a player who didn't initiate the disconnect.

**Fix would be:** show a toast "Disconnected — [Reconnect]" with a button that re-joins the same room code. Adds ~30 min of work + needs server reconnection logic.

**Severity:** medium for actual classroom use, low for the Tuesday demo. Defer for now; flag as a known issue.

### 5. Game continues with sub-min players

If 3 of 5 players leave mid-round, the round keeps going with 2 players. Saboteur ratios get weird. No safety net.

**Fix would be:** if `players.size` drops below `MIN_PLAYERS` mid-round, end the game with reason "lost players."

**Severity:** low. Players who stay can still finish (server logic still works). Flagged for v2.

### 6. No rate limiting on Move messages

A malicious client could spam `move` messages. Server clamps to map bounds and the tick loop interpolates safely, but it's CPU work. For 5–10 player classroom rooms, not an issue.

---

## 🐛 Minor / cosmetic

- **Title screen "Failed to create room" error** has no retry button — user has to click again
- **Lobby chat panel** is collapsed by default, doesn't auto-open during meetings (Sky's UX)
- **EndScreen "Play again" button** is host-only; non-hosts see "Waiting…" but no way to leave the room. Could add a "Leave" button.
- **Saboteur HUD overlaps with HUD** at narrow widths (~600px). Mobile layout untested.
- **Avatar count is hardcoded to 6** — `["🧑", "👧", "👦", "🧒", "👩", "🧑‍🚀"]` — duplicated across files. Should be a shared constant.

---

## 👍 Architecture observations (positive)

The codebase has held up well under the iterations. Notable:

- **Clean separation of concerns** — `shared` defines the contract; `server` is authoritative; `client` is presentation. Both halves typecheck against the same source of truth.
- **Role privacy handled correctly** — `playerRoles` is server-only; the schema only exposes `revealedRole`, set on legitimate reveal events (ejection, game end). A malicious client opening devtools would NOT see other players' roles.
- **Probabilistic accuracy model** is implemented exactly as the design doc specifies. The math holds up under inspection.
- **Schema decorator approach** is the standard Colyseus 0.16 pattern. Pre-compiling shared with `tsc` (rather than hot-loading via tsx) was the right call to avoid esbuild's TC39-decorator emit bug.
- **React state-sync fix** (`useStarBiteState` hook with `stateTick`) is the right idiom for Colyseus's in-place mutation pattern. Documented thoroughly in `store/game.ts`.
- **Smoke test coverage** is genuinely good for an MVP — 41 assertions across the full lifecycle including round-end and stats persistence. Catches the kinds of regressions you'd want it to catch.
- **Reset-round / play-again** correctly clears all per-round state. Verified in smoke test.

---

## Test coverage

- ✅ Server protocol exercised end-to-end via smoke test
- ✅ Stats persistence verified across server restart
- ❌ React UI not auto-tested (no jest/playwright); requires manual browser test
- ❌ Disconnection edge cases not tested
- ❌ Malicious-client cases not tested

For a class final project, this is plenty. The smoke test is the regression net.

---

## Suggested follow-ups (post-Tuesday)

1. **Reconnection flow.** Save the room code in `sessionStorage`. If a tab reloads, auto-rejoin. If the server briefly drops, retry with backoff.
2. **Per-player score tracking.** End screen could show "Best detective" / "Most flagged labels" / "Survived all meetings." Light gamification for replayability.
3. **Difficulty modes.** Faster customer cycle, more saboteurs, or ambiguous content for advanced rounds.
4. **Mobile layout pass.** Right now everything assumes >= 1024px width. Phones and small Chromebooks would clip.
5. **Optional anonymized telemetry.** A teacher running 3 rounds could see "across all rounds, the trash bot was the bottleneck" — would inform v2 content.
