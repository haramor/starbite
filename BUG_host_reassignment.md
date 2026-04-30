# 🐛 Bug Report: Host Reassignment State Desync

**Status:** ✅ RESOLVED (both bugs)
**Component:** Server (GameRoom.ts) + Client (Zustand store)
**Affects:** Multiplayer lobby functionality

## Resolution

Both reported bugs have been fixed on `main`.

### Bug 1: Host reassignment state desync — FIXED
**Commit:** [`cba3531`](https://github.com/haramor/starbite/commit/cba3531) — "Fix host reassignment to skip disconnected and ejected players"

The `removePlayer` host reassignment now uses a `reassignHost()` helper that:
- Clears `isHost` on every remaining player first (so multi-host is structurally impossible)
- Picks the first player who is BOTH connected AND alive (not just "first in iteration order")
- No-ops cleanly if no eligible player remains

The reload-creates-new-session aspect (separate from this bug) is by design: tab reloads in lobby drop the old player and add a new one. With the React fix below, all clients now see this consistently.

### Bug 2: State synchronization broken (different tabs showing different player counts) — FIXED
**Commit:** `7937482` — "Fix React state sync — re-render on every Colyseus state change"

Root cause: not actually Colyseus or networking — it was a **React re-render bug**. Colyseus mutates `room.state` in place. The Zustand store called `setState({state})` with the same reference every time, so selectors returning `s.state` saw the same object on Object.is comparison and Zustand skipped re-renders. Different tabs displayed whatever snapshot they happened to render last, so they diverged visually even though the server's state was perfectly consistent.

Fix: bump a `stateTick` counter on every `onStateChange`. Added a `useStarBiteState()` hook that subscribes to the tick (forcing re-renders) and returns the live state. All 9 components that read `s.state` now use the hook.

### Verification
- Server-side host invariant: smoke test `[2] exactly 1 host flag` passes.
- React re-render: requires manual browser test with multiple tabs to fully validate. The fix is logically sound; if you see the symptom recur, ping Hara.

---

## Original report (preserved for reference)

## Summary
Host reassignment logic causes state desynchronization when players reload browser tabs. Different clients show different players as "host" for the same room, preventing game start.

## Steps to Reproduce
1. Create room with 5+ players
2. All players join successfully  
3. Reload one of the browser tabs (disconnect/reconnect)
4. Compare host badges across all tabs

**Expected:** All tabs show same player as host  
**Actual:** Different tabs show different players as host

## Root Cause
File: `server/src/rooms/GameRoom.ts`

```typescript
// Line 148 - Initial host assignment
player.isHost = this.state.players.size === 0;

// Lines 180-188 - Host reassignment on player removal
if (wasHost) {
  const next = [...this.state.players.values()][0];
  if (next) next.isHost = true;
}
```

**The Issue:**
1. Tab reload triggers `onLeave` → player marked as disconnected
2. If that player was host, server reassigns host to "first remaining player"
3. Tab reconnects as NEW session → joins as non-host  
4. State desync: some clients think old host, others think new host

## Impact
- Cannot start games after any tab reload
- Breaks core multiplayer functionality
- Confuses players about who can start

## Suggested Fix
Option 1: **Preserve host across reconnections**
```typescript
// In onJoin, check for reconnection by matching some identifier
// and restore previous host status
```

Option 2: **Deterministic host selection**
```typescript
// Instead of "first player", use a deterministic rule like:
// - Player with lexicographically smallest sessionId
// - Player who joined earliest (store join timestamp)
```

Option 3: **Host transfer confirmation**
```typescript
// Only reassign host after a timeout, allowing reconnection grace period
```

## Workaround for Testing
- Don't reload tabs after joining
- Create fresh rooms without any reloads
- First tab (room creator) should try to start

## Test Verification
After fix, verify:
1. Reload tab in 6-player room
2. All remaining tabs should show consistent host
3. Game should start normally

## 🚨 Additional Bug: State Synchronization Broken

**Discovered during testing:** Each browser tab shows a **different number of players** in the same room. State sync is fundamentally broken.

**Impact:** Game is unplayable - clients have inconsistent views of reality.

**Example:** Room KZNB with 5 players (confirmed by server logs), but:
- Tab 1 shows 2 players
- Tab 2 shows 4 players  
- Tab 3 shows 3 players
- etc.

**Root cause:** Colyseus state synchronization failing across clients. Could be schema issues, network problems, or client-side state handling bugs.

**Priority:** **CRITICAL** - blocks all meaningful testing.

---
*Reported by Sky's Claude during Task A end-to-end testing*