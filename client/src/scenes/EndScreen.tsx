// End-of-round screen. Shows winner, reveals roles.

import { useGameStore } from "../store/game.js";

const REASON_TEXT: Record<string, string> = {
  satisfaction_threshold: "Customer satisfaction held above the win threshold.",
  satisfaction_zero: "Customer satisfaction hit zero.",
  all_saboteurs_ejected: "All saboteurs were ejected.",
  timer_with_saboteurs: "Time ran out with saboteurs still active.",
};

export function EndScreen() {
  const state = useGameStore((s) => s.state);
  const end = useGameStore((s) => s.endGame);
  if (!state) return null;

  const winner = end?.winner ?? state.winner;
  const reason = end?.reason ?? state.endReason;

  return (
    <div className="h-full w-full bg-diner-bg text-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <div className="text-xs opacity-60 font-display uppercase tracking-widest">
            Round over
          </div>
          <div
            className={`text-5xl font-display mt-3 ${
              winner === "crew" ? "text-diner-good" : "text-diner-bad"
            }`}
          >
            {winner === "crew" ? "CREW WINS" : "SABOTEURS WIN"}
          </div>
          <div className="text-sm opacity-70 mt-3">{REASON_TEXT[reason] ?? reason}</div>
          <div className="text-sm opacity-70 mt-1">
            Final satisfaction: {end?.finalSatisfaction ?? state.satisfaction}%
          </div>
        </div>

        <div className="bg-diner-panel rounded-2xl p-5">
          <div className="text-sm opacity-70 mb-3">Roles revealed</div>
          <div className="grid grid-cols-2 gap-2">
            {(end?.roles ?? []).map((r) => (
              <div
                key={r.sessionId}
                className={`flex items-center gap-3 rounded-lg p-3 ${
                  r.role === "saboteur"
                    ? "bg-diner-bad/20 border border-diner-bad/50"
                    : "bg-diner-bg"
                }`}
              >
                <span className="flex-1 truncate">{r.name}</span>
                <span
                  className={`text-xs font-bold uppercase ${
                    r.role === "saboteur" ? "text-diner-bad" : "text-diner-good"
                  }`}
                >
                  {r.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full bg-diner-warm hover:brightness-110 text-black font-bold py-3 rounded-xl"
        >
          New round
        </button>
      </div>
    </div>
  );
}
