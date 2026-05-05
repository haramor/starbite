// Game scene — the main play view.
// Composes: Map, HUD, station modal (when at a station), customer ticker, alerts.
//
// Hara's track: Map / movement / station-modal-open logic / meeting trigger
// Sky's track: HUD widgets / station mini-game UIs / customer animations / alert banner

import { useEffect, useRef, useState } from "react";
import { useGameStore, useStarBiteState } from "../store/game.js";
import { ClientMsg, MAP_W, MAP_H, type Player } from "starbite-shared";
import { GameMap } from "../components/Map.js";
import { HUD } from "../components/HUD.js";
import { StationModal } from "../components/StationModal.js";
import { CustomerTicker } from "../components/customer/CustomerTicker.js";
import { AlertBanner } from "../components/AlertBanner.js";
import { ChatPanel } from "../components/ChatPanel.js";
import { HowToPlayModal } from "../components/HowToPlayModal.js";

// How many tiles ahead of the player we project the move target while a key
// is held. Reduced from 4 to 1.5 for finer control and less overshoot.
const MOVE_LOOKAHEAD_TILES = 1.5;
// Re-send the move target this often while keys are held.
// Reduced from 120ms to 60ms for more responsive movement.
const MOVE_INPUT_INTERVAL_MS = 60;

const MOVE_KEYS = new Set([
  "w", "a", "s", "d",
  "arrowup", "arrowdown", "arrowleft", "arrowright",
]);

export function Game() {
  const room = useGameStore((s) => s.room);
  const state = useStarBiteState();
  const mySessionId = useGameStore((s) => s.mySessionId);
  const myRole = useGameStore((s) => s.myRole);
  const me = state?.players.get(mySessionId);
  const moveSentRef = useRef<{ tx: number; ty: number } | null>(null);
  // Set when the player clicks a station from far away. The input loop
  // watches their position and fires EnterStation once they're close enough.
  const pendingEnterRef = useRef<string | null>(null);
  const [showHowTo, setShowHowTo] = useState(false);

  // Throttled move-target sender — skips redundant sends when target hasn't moved.
  // Reduced threshold from 0.05 to 0.02 for more responsive movement updates.
  function sendMoveTo(tx: number, ty: number) {
    if (
      moveSentRef.current &&
      Math.abs(moveSentRef.current.tx - tx) < 0.02 &&
      Math.abs(moveSentRef.current.ty - ty) < 0.02
    )
      return;
    moveSentRef.current = { tx, ty };
    room?.send(ClientMsg.Move, { tx, ty });
  }

  function handleStationClick(stationId: string) {
    if (!room) return;
    const station = room.state.stations.get(stationId);
    if (!station) return;
    const meNow = room.state.players.get(room.sessionId);
    if (!meNow) return;

    const dx = meNow.x - station.x;
    const dy = meNow.y - station.y;
    if (dx * dx + dy * dy <= 2.0) {
      // Already close enough — enter immediately.
      room.send(ClientMsg.EnterStation, { stationId });
      pendingEnterRef.current = null;
    } else {
      // Walk there, then auto-enter when proximate.
      pendingEnterRef.current = stationId;
      sendMoveTo(station.x, station.y);
    }
  }

  // Smooth held-key movement. We track which direction keys are currently
  // held, and on a fast interval (120ms) we re-aim the move target a few
  // tiles ahead in the held direction. The server interpolates toward the
  // target between updates, so the player walks continuously while keys are
  // held and stops when they're released.
  useEffect(() => {
    if (!room) return;
    const held = new Set<string>();

    function onKeyDown(e: KeyboardEvent) {
      const k = e.key.toLowerCase();
      if (!MOVE_KEYS.has(k)) return;
      // Don't capture keystrokes that came from inputs (chat, name field, etc.).
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      held.add(k);
      e.preventDefault();
    }
    function onKeyUp(e: KeyboardEvent) {
      const wasHeld = held.has(e.key.toLowerCase());
      held.delete(e.key.toLowerCase());

      // If we just released a movement key and no keys are held anymore,
      // send current position as target to stop overshoot
      if (wasHeld && held.size === 0 && room) {
        const meNow = room.state.players.get(room.sessionId);
        if (meNow && meNow.isAlive && !meNow.currentStation) {
          sendMoveTo(meNow.x, meNow.y);
        }
      }
    }
    function onBlur() {
      // If the window loses focus, drop all held keys so the player doesn't
      // get stuck walking when the user alt-tabs.
      held.clear();
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);

    const interval = setInterval(() => {
      // Read the player's current position FRESH each tick (refs are out of date)
      const meNow = room.state.players.get(room.sessionId);
      if (!meNow || !meNow.isAlive) return;

      // Pending click-to-enter-station: fire EnterStation once we're proximate.
      // Held keys cancel the pending intent (player changed their mind).
      if (pendingEnterRef.current) {
        if (held.size > 0) {
          pendingEnterRef.current = null;
        } else {
          const station = room.state.stations.get(pendingEnterRef.current);
          if (!station) {
            pendingEnterRef.current = null;
          } else {
            const dx2 = meNow.x - station.x;
            const dy2 = meNow.y - station.y;
            if (dx2 * dx2 + dy2 * dy2 <= 2.0) {
              room.send(ClientMsg.EnterStation, {
                stationId: pendingEnterRef.current,
              });
              pendingEnterRef.current = null;
            }
          }
        }
      }

      if (held.size === 0) return;
      if (meNow.currentStation) return;

      let dx = 0;
      let dy = 0;
      if (held.has("w") || held.has("arrowup")) dy -= 1;
      if (held.has("s") || held.has("arrowdown")) dy += 1;
      if (held.has("a") || held.has("arrowleft")) dx -= 1;
      if (held.has("d") || held.has("arrowright")) dx += 1;
      if (dx === 0 && dy === 0) return;

      // Normalize so diagonal isn't faster than orthogonal
      const len = Math.sqrt(dx * dx + dy * dy);
      const nx = dx / len;
      const ny = dy / len;

      const tx = Math.max(0, Math.min(MAP_W - 1, meNow.x + nx * MOVE_LOOKAHEAD_TILES));
      const ty = Math.max(0, Math.min(MAP_H - 1, meNow.y + ny * MOVE_LOOKAHEAD_TILES));
      sendMoveTo(tx, ty);
    }, MOVE_INPUT_INTERVAL_MS);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.sessionId]);

  if (!state || !room || !me) return null;

  const atStation = me.currentStation && state.stations.get(me.currentStation);

  return (
    <div className="h-full w-full bg-diner-bg text-white relative overflow-hidden">
      <HUD />
      <AlertBanner />
      <CustomerTicker />

      <GameMap
        state={state}
        mySessionId={mySessionId}
        onTileClick={(tx, ty) => {
          // Walking to an arbitrary tile cancels any pending station entry.
          pendingEnterRef.current = null;
          sendMoveTo(tx, ty);
        }}
        onStationClick={handleStationClick}
      />

      {atStation && (
        <StationModal
          stationId={me.currentStation}
          onClose={() => room.send(ClientMsg.LeaveStation, {})}
          isSaboteur={myRole === "saboteur"}
        />
      )}

      <ChatPanel />

      {/* Saboteur HUD — role badge + poison cooldown countdown */}
      {myRole === "saboteur" && me && <SaboteurHUD me={me} />}

      {/* "?" help button — re-opens the HowToPlay modal */}
      <button
        onClick={() => setShowHowTo(true)}
        className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-diner-panel/90 hover:bg-diner-panel text-white text-sm font-bold shadow"
        title="How to play"
      >
        ?
      </button>

      {showHowTo && <HowToPlayModal onClose={() => setShowHowTo(false)} />}

      <div className="absolute bottom-2 left-2 text-xs opacity-40">
        WASD / arrows to move · click stations to enter
      </div>
    </div>
  );
}

function SaboteurHUD({ me }: { me: Player }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, []);

  const remainingMs = Math.max(0, me.poisonCooldownEndsAt - now);
  const ready = remainingMs <= 0;
  const remainingSec = Math.ceil(remainingMs / 1000);

  return (
    <div className="absolute top-20 right-4 bg-diner-bad/90 text-white px-3 py-2 rounded-lg shadow-lg flex flex-col items-end gap-1 min-w-[150px] z-30">
      <div className="text-xs font-bold tracking-wider">🦹 SABOTEUR</div>
      <div className="flex items-center gap-2 text-[11px]">
        {ready ? (
          <span className="text-diner-good font-bold">☠ Poison ready</span>
        ) : (
          <>
            <span className="opacity-80">Cooldown:</span>
            <span className="font-bold tabular-nums">{remainingSec}s</span>
          </>
        )}
      </div>
    </div>
  );
}
