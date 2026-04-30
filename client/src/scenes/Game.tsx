// Game scene — the main play view.
// Composes: Map, HUD, station modal (when at a station), customer ticker, alerts.
//
// Hara's track: Map / movement / station-modal-open logic / meeting trigger
// Sky's track: HUD widgets / station mini-game UIs / customer animations / alert banner

import { useEffect, useRef } from "react";
import { useGameStore, useStarBiteState } from "../store/game.js";
import { ClientMsg, type Player } from "starbite-shared";
import { GameMap } from "../components/Map.js";
import { HUD } from "../components/HUD.js";
import { StationModal } from "../components/StationModal.js";
import { CustomerTicker } from "../components/customer/CustomerTicker.js";
import { AlertBanner } from "../components/AlertBanner.js";
import { ChatPanel } from "../components/ChatPanel.js";

export function Game() {
  const room = useGameStore((s) => s.room);
  const state = useStarBiteState();
  const mySessionId = useGameStore((s) => s.mySessionId);
  const myRole = useGameStore((s) => s.myRole);
  const me = state?.players.get(mySessionId);
  const moveSentRef = useRef<{ tx: number; ty: number } | null>(null);

  // Throttled move-target sender
  function sendMoveTo(tx: number, ty: number) {
    if (
      moveSentRef.current &&
      Math.abs(moveSentRef.current.tx - tx) < 0.1 &&
      Math.abs(moveSentRef.current.ty - ty) < 0.1
    )
      return;
    moveSentRef.current = { tx, ty };
    room?.send(ClientMsg.Move, { tx, ty });
  }

  // Keyboard input for movement (WASD/arrows nudge target by 1 tile)
  useEffect(() => {
    if (!me) return;
    function onKey(e: KeyboardEvent) {
      if (!me) return;
      if (me.currentStation) return; // no movement while in station modal
      let dx = 0;
      let dy = 0;
      if (e.key === "w" || e.key === "ArrowUp") dy = -1;
      if (e.key === "s" || e.key === "ArrowDown") dy = 1;
      if (e.key === "a" || e.key === "ArrowLeft") dx = -1;
      if (e.key === "d" || e.key === "ArrowRight") dx = 1;
      if (dx === 0 && dy === 0) return;
      e.preventDefault();
      sendMoveTo(me.tx + dx, me.ty + dy);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me?.sessionId, me?.tx, me?.ty, me?.currentStation]);

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

      {/* Saboteur HUD info */}
      {myRole === "saboteur" && (
        <div className="absolute top-20 right-4 bg-diner-bad/90 text-white text-xs px-3 py-2 rounded-lg font-bold shadow-lg">
          🦹 SABOTEUR
        </div>
      )}

      <div className="absolute bottom-2 left-2 text-xs opacity-40">
        WASD / arrows to move · click stations to enter
      </div>
    </div>
  );
}
