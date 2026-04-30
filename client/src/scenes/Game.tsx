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

// How many tiles ahead of the player we project the move target while a key
// is held. Server interpolates toward the target each tick; we re-aim every
// few frames so the player keeps walking as long as the key is held.
const MOVE_LOOKAHEAD_TILES = 4;
// Re-send the move target this often while keys are held.
const MOVE_INPUT_INTERVAL_MS = 120;

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

  // Throttled move-target sender — skips redundant sends when target hasn't moved.
  function sendMoveTo(tx: number, ty: number) {
    if (
      moveSentRef.current &&
      Math.abs(moveSentRef.current.tx - tx) < 0.05 &&
      Math.abs(moveSentRef.current.ty - ty) < 0.05
    )
      return;
    moveSentRef.current = { tx, ty };
    room?.send(ClientMsg.Move, { tx, ty });
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
      held.delete(e.key.toLowerCase());
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
      if (held.size === 0) return;
      // Read the player's current position FRESH each tick (refs are out of date)
      const meNow = room.state.players.get(room.sessionId);
      if (!meNow || !meNow.isAlive || meNow.currentStation) return;

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
        onTileClick={(tx, ty) => sendMoveTo(tx, ty)}
        onStationClick={(stationId) =>
          room.send(ClientMsg.EnterStation, { stationId })
        }
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
    <div className="absolute top-20 right-4 bg-diner-bad/90 text-white px-3 py-2 rounded-lg shadow-lg flex flex-col items-end gap-1 min-w-[150px]">
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
