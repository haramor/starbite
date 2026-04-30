// Top HUD. Customer satisfaction meter (the team's "health"), round timer,
// per-station accuracy summary, and meeting button.

import { useEffect, useState } from "react";
import { useGameStore, useStarBiteState } from "../store/game.js";
import { ClientMsg, STATIONS, SATISFACTION_WIN_THRESHOLD } from "starbite-shared";

const STATION_EMOJI: Record<string, string> = {
  grill: "🔥",
  trash: "🗑️",
  review: "🔍",
};

export function HUD() {
  const room = useGameStore((s) => s.room);
  const state = useStarBiteState();

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, []);

  if (!state) return null;

  const remaining = Math.max(0, Math.round((state.roundEndsAt - now) / 1000));
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  const sat = state.satisfaction;
  const satColor =
    sat >= SATISFACTION_WIN_THRESHOLD
      ? "bg-diner-good"
      : sat >= 50
        ? "bg-diner-warm"
        : "bg-diner-bad";

  function callMeeting() {
    room?.send(ClientMsg.CallMeeting, {});
  }

  return (
    <div className="absolute top-0 left-0 right-0 p-4 z-20 pointer-events-none">
      <div className="flex items-start justify-between gap-4">
        <div className="bg-diner-panel/90 backdrop-blur rounded-xl px-4 py-3 pointer-events-auto shadow-lg w-[420px]">
          <div className="flex items-center justify-between text-xs opacity-70 mb-1">
            <span>Customer satisfaction</span>
            <span>{sat}%</span>
          </div>
          <div className="h-3 bg-black/40 rounded-full overflow-hidden">
            <div
              className={`h-full ${satColor} transition-all duration-300`}
              style={{ width: `${sat}%` }}
            />
            <div
              className="h-full border-r-2 border-white/40 -mt-3"
              style={{ width: `${SATISFACTION_WIN_THRESHOLD}%` }}
            />
          </div>
          <div className="text-[10px] opacity-50 mt-1">
            Win threshold: {SATISFACTION_WIN_THRESHOLD}%
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 pointer-events-auto">
          <div
            className={`rounded-xl px-4 py-2 font-display text-xl ${
              remaining > 0 && remaining <= 30
                ? "bg-diner-bad text-white animate-pulse"
                : "bg-diner-panel/90 text-white"
            }`}
          >
            {mins}:{secs.toString().padStart(2, "0")}
          </div>
          <button
            disabled={state.meetingsRemaining <= 0}
            onClick={callMeeting}
            className="bg-diner-bad/90 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow"
          >
            🚨 Call meeting ({state.meetingsRemaining})
          </button>
        </div>

        <div className="bg-diner-panel/90 rounded-xl px-4 py-3 pointer-events-auto shadow-lg w-[260px]">
          <div className="text-xs opacity-70 mb-2">Bot accuracy</div>
          <div className="space-y-2">
            {STATIONS.map((s) => {
              const acc = state.stations.get(s.id)?.accuracy ?? 100;
              if (s.type === "review") return null; // review has no model
              const color =
                acc >= 80
                  ? "bg-diner-good"
                  : acc >= 50
                    ? "bg-diner-warm"
                    : "bg-diner-bad";
              return (
                <div key={s.id} className="flex items-center gap-2">
                  <span className="w-6 text-center">{STATION_EMOJI[s.type]}</span>
                  <span className="text-xs flex-1 truncate">{s.label}</span>
                  <div className="w-20 h-2 bg-black/40 rounded">
                    <div
                      className={`h-full ${color} rounded transition-all`}
                      style={{ width: `${acc}%` }}
                    />
                  </div>
                  <span className="text-xs w-10 text-right tabular-nums">
                    {acc}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
