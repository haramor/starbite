// Top-down map. Renders floor tiles, stations, and players.
// MVP version uses colored divs / emoji — Helper 2 will replace with sprite assets.

import { useEffect, useRef } from "react";
import {
  MAP_W,
  MAP_H,
  TILE_PX,
  STATIONS,
  type StarBiteState,
} from "starbite-shared";

interface Props {
  state: StarBiteState;
  mySessionId: string;
  onTileClick: (tx: number, ty: number) => void;
  onStationClick: (stationId: string) => void;
}

const AVATAR_EMOJI = ["🧑", "👧", "👦", "🧒", "👩", "🧑‍🚀"];
const STATION_EMOJI: Record<string, string> = {
  grill: "🔥",
  trash: "🗑️",
  review: "🔍",
};

export function GameMap({ state, mySessionId, onTileClick, onStationClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const players = [...state.players.values()];

  function handleClick(e: React.MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const tx = Math.floor(x / TILE_PX);
    const ty = Math.floor(y / TILE_PX);
    if (tx < 0 || tx >= MAP_W || ty < 0 || ty >= MAP_H) return;
    onTileClick(tx, ty);
  }

  return (
    <div
      ref={containerRef}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#2a3473] rounded-lg shadow-2xl overflow-hidden"
      style={{
        width: MAP_W * TILE_PX,
        height: MAP_H * TILE_PX,
      }}
      onClick={handleClick}
    >
      {/* Tile grid - lightly stippled background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: `${TILE_PX}px ${TILE_PX}px`,
        }}
      />

      {/* Stations */}
      {STATIONS.map((s) => {
        const live = state.stations.get(s.id);
        const acc = live?.accuracy ?? 100;
        return (
          <button
            key={s.id}
            onClick={(e) => {
              e.stopPropagation();
              onStationClick(s.id);
            }}
            className="absolute bg-diner-panel border-2 border-white/30 rounded-xl flex flex-col items-center justify-center hover:border-diner-warm transition cursor-pointer"
            style={{
              left: s.footprint.x * TILE_PX,
              top: s.footprint.y * TILE_PX,
              width: s.footprint.w * TILE_PX,
              height: s.footprint.h * TILE_PX,
            }}
          >
            <div className="text-3xl">{STATION_EMOJI[s.type]}</div>
            <div className="text-[10px] uppercase tracking-wider mt-1 opacity-80">
              {s.label}
            </div>
            <div className="text-[10px] opacity-60">{acc}%</div>
          </button>
        );
      })}

      {/* Players */}
      {players.map((p) => {
        const isMe = p.sessionId === mySessionId;
        return (
          <div
            key={p.sessionId}
            className={`absolute pointer-events-none transition-[left,top] duration-100 ease-linear ${
              !p.isAlive ? "opacity-30 grayscale" : ""
            }`}
            style={{
              left: p.x * TILE_PX - TILE_PX / 2,
              top: p.y * TILE_PX - TILE_PX / 2,
              width: TILE_PX,
              height: TILE_PX,
            }}
          >
            {/* Lingering tell — expanding ring around the player while they're
                submitting a label. Triggers on every label (briefly) but
                lingers ~4x longer when a saboteur poisons. Watching for who
                lingers at stations is the core social-deduction signal. */}
            {p.isLingering && (
              <>
                <div
                  className="absolute inset-0 rounded-full border-2 border-diner-warm animate-ping"
                  style={{ animationDuration: "0.9s" }}
                />
                <div className="absolute inset-2 rounded-full bg-diner-warm/20" />
              </>
            )}

            <div className="flex flex-col items-center relative">
              <div
                className={`text-3xl transition-transform ${
                  isMe ? "drop-shadow-[0_0_8px_rgba(255,209,102,0.9)]" : ""
                } ${p.isLingering ? "scale-110" : ""}`}
              >
                {AVATAR_EMOJI[p.avatarId] ?? "🧑"}
              </div>
              <div
                className={`text-[10px] px-1 rounded ${
                  isMe ? "bg-diner-warm text-black font-bold" : "bg-black/50"
                }`}
              >
                {p.name}
              </div>
            </div>

            {p.isLingering && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-diner-warm text-black text-xs font-bold rounded-full px-2 py-0.5 shadow-lg animate-bounce">
                ✏️
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
