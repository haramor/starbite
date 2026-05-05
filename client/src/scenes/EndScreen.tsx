// End-of-round screen. Shows winner, station accuracy summary, customer timeline,
// staggered role reveal, and "Play again" (host) / waiting message (others).

import { useEffect, useState } from "react";
import { useGameStore, useStarBiteState } from "../store/game.js";
import { ClientMsg, STATIONS } from "starbite-shared";

const REASON_TEXT: Record<string, string> = {
  satisfaction_threshold: "Customer satisfaction held above the win threshold.",
  satisfaction_zero: "Customer satisfaction hit zero.",
  all_saboteurs_ejected: "All saboteurs were ejected.",
  timer_with_saboteurs: "Time ran out with saboteurs still active.",
};

const AVATAR_EMOJI = ["🧑", "👧", "👦", "🧒", "👩", "🧑‍🚀"];
const STATION_EMOJI: Record<string, string> = {
  grill: "🔥",
  trash: "🗑️",
  review: "🔍",
};
const OUTCOME_EMOJI: Record<string, string> = {
  happy: "😋",
  confused: "😕",
  angry: "😡",
};
const OUTCOME_COLOR: Record<string, string> = {
  happy: "bg-diner-good/30 border-diner-good",
  confused: "bg-diner-warm/30 border-diner-warm",
  angry: "bg-diner-bad/30 border-diner-bad",
};

export function EndScreen() {
  const state = useStarBiteState();
  const end = useGameStore((s) => s.endGame);
  const room = useGameStore((s) => s.room);
  const mySessionId = useGameStore((s) => s.mySessionId);

  // Reveal players one at a time on a 250ms cadence.
  const [revealedCount, setRevealedCount] = useState(0);
  const totalRoles = end?.roles?.length ?? 0;
  useEffect(() => {
    setRevealedCount(0);
    if (totalRoles === 0) return;
    const interval = setInterval(() => {
      setRevealedCount((n) => {
        if (n >= totalRoles) {
          clearInterval(interval);
          return n;
        }
        return n + 1;
      });
    }, 250);
    return () => clearInterval(interval);
  }, [totalRoles]);

  if (!state) return null;
  const winner = end?.winner ?? state.winner;
  const reason = end?.reason ?? state.endReason;
  const me = state.players.get(mySessionId);
  const isHost = !!me?.isHost;
  const finalSatisfaction = end?.finalSatisfaction ?? state.satisfaction;

  function playAgain() {
    // Clear client state FIRST to prevent any alerts from showing
    const store = useGameStore.getState();
    store.setEndGame(null);
    store.setMyRole(null);
    store.setCurrentExample(null);
    store.setPoisonReady(true);
    // Clear arrays by replacing with empty arrays - use proper Zustand updates
    store.pushAccuracyAlert = () => {}; // Temporarily disable accuracy alerts
    (store as any).customerEvents = [];
    (store as any).accuracyAlerts = [];
    (store as any).errors = [];
    (store as any).chat = [];

    // Small delay before sending reset to ensure client state is clean
    setTimeout(() => {
      room?.send(ClientMsg.ResetRound, {});
      // Re-enable accuracy alerts after 5 seconds
      setTimeout(() => {
        store.pushAccuracyAlert = (a: any) =>
          useGameStore.setState((s: any) => ({
            accuracyAlerts: [...s.accuracyAlerts.slice(-4), a]
          }));
      }, 5000);
    }, 100);
  }

  // Sort roles for stable reveal order (saboteurs last for dramatic effect)
  const orderedRoles = [...(end?.roles ?? [])].sort((a, b) => {
    if (a.role !== b.role) return a.role === "saboteur" ? 1 : -1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="h-full w-full bg-diner-bg text-white overflow-auto">
      <div className="min-h-full w-full flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-3xl space-y-6">
          {/* Winner banner */}
          <div className="text-center">
            <div className="text-xs opacity-60 font-display uppercase tracking-widest">
              Round over
            </div>
            <div
              className={`text-6xl font-display mt-3 animate-pulse ${
                winner === "crew" ? "text-diner-good" : "text-diner-bad"
              }`}
            >
              {winner === "crew" ? "CREW WINS" : "SABOTEURS WIN"}
            </div>
            <div className="text-sm opacity-70 mt-3">
              {REASON_TEXT[reason] ?? reason}
            </div>
            <div className="text-sm opacity-70 mt-1">
              Final satisfaction:{" "}
              <span className="font-bold">{finalSatisfaction}%</span>
            </div>
          </div>

          {/* Station accuracy summary — useful for the teacher debrief */}
          <div className="bg-diner-panel rounded-2xl p-5">
            <div className="text-sm opacity-70 mb-3">Final bot accuracy</div>
            <div className="space-y-2">
              {STATIONS.filter((s) => s.type !== "review").map((s) => {
                const acc = state.stations.get(s.id)?.accuracy ?? 100;
                const color =
                  acc >= 80
                    ? "bg-diner-good"
                    : acc >= 50
                      ? "bg-diner-warm"
                      : "bg-diner-bad";
                return (
                  <div key={s.id} className="flex items-center gap-3">
                    <span className="text-xl w-8 text-center">
                      {STATION_EMOJI[s.type]}
                    </span>
                    <span className="text-sm w-32 truncate">{s.label}</span>
                    <div className="flex-1 h-3 bg-black/40 rounded">
                      <div
                        className={`h-full ${color} rounded transition-all duration-700`}
                        style={{ width: `${acc}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold w-12 text-right tabular-nums">
                      {acc}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer timeline */}
          {state.customers.length > 0 && (
            <div className="bg-diner-panel rounded-2xl p-5">
              <div className="text-sm opacity-70 mb-3">
                Customers served ({state.customers.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {[...state.customers].map((c, i) => (
                  <div
                    key={`${c.id}-${i}`}
                    title={`${c.customerName}: ${c.outcome}`}
                    className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg border-2 ${
                      OUTCOME_COLOR[c.outcome] ?? "bg-white/10 border-white/20"
                    }`}
                  >
                    <span className="text-xl">
                      {OUTCOME_EMOJI[c.outcome] ?? "❓"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-3 text-xs opacity-60">
                <span>
                  😋 {state.customers.filter((c) => c.outcome === "happy").length}{" "}
                  happy
                </span>
                <span>
                  😕{" "}
                  {state.customers.filter((c) => c.outcome === "confused").length}{" "}
                  confused
                </span>
                <span>
                  😡 {state.customers.filter((c) => c.outcome === "angry").length}{" "}
                  angry
                </span>
              </div>
            </div>
          )}

          {/* Role reveal — staggered */}
          <div className="bg-diner-panel rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm opacity-70">Roles revealed</div>
              <div className="text-xs opacity-50">
                {revealedCount} / {totalRoles}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 min-h-[120px]">
              {orderedRoles.map((r, i) => {
                const visible = i < revealedCount;
                const player = state.players.get(r.sessionId);
                const isSab = r.role === "saboteur";
                return (
                  <div
                    key={r.sessionId}
                    className={`flex items-center gap-3 rounded-lg p-3 transition-all duration-500 ${
                      visible
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 -translate-y-2 scale-95"
                    } ${
                      isSab
                        ? "bg-diner-bad/20 border border-diner-bad/50 shadow-[0_0_20px_rgba(239,71,105,0.3)]"
                        : "bg-diner-bg border border-white/5"
                    }`}
                  >
                    <span className="text-2xl">
                      {AVATAR_EMOJI[player?.avatarId ?? 0] ?? "🧑"}
                    </span>
                    <span className="flex-1 truncate font-medium">{r.name}</span>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${
                        isSab
                          ? "bg-diner-bad text-white"
                          : "bg-diner-good/30 text-diner-good"
                      }`}
                    >
                      {isSab ? "🦹 saboteur" : "trainer"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Play again / waiting message */}
          {isHost ? (
            <button
              onClick={playAgain}
              className="w-full bg-diner-warm hover:brightness-110 text-black font-bold py-4 rounded-xl text-lg shadow-lg"
            >
              Play again
            </button>
          ) : (
            <div className="text-center text-sm opacity-60 py-3">
              Waiting for the host to start a new round…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
