// Review & Security — the audit station.
// Shows recent submissions across all stations. Players inspect the data
// itself (no player attribution). Flag suspicious submissions to remove them.
//
// SKY: this is the trickiest one to make readable. Polish the layout.
// Show the example + the submitted label clearly. Don't reveal "isCorrect" —
// the player has to use their own judgment about whether the label looks right.

import { useGameStore, useStarBiteState } from "../../store/game.js";
import { ClientMsg, RECENT_SUBMISSIONS_TO_SHOW } from "starbite-shared";

export function ReviewStation() {
  const room = useGameStore((s) => s.room);
  const state = useStarBiteState();
  if (!state) return null;

  // Collect last N submissions across all stations, newest first
  const all: Array<{
    submissionId: string;
    stationId: string;
    stationType: string;
    label: string;
    flagged: boolean;
    submittedAt: number;
    exampleEmoji: string;
    exampleDescription: string;
    exampleName: string;
  }> = [];
  for (const station of state.stations.values()) {
    for (const ex of station.examples) {
      for (const sub of ex.submissions) {
        all.push({
          submissionId: sub.id,
          stationId: station.id,
          stationType: station.stationType,
          label: sub.label,
          flagged: sub.flagged,
          submittedAt: sub.submittedAt,
          exampleEmoji: ex.emoji,
          exampleDescription: ex.description,
          exampleName: ex.name,
        });
      }
    }
  }
  all.sort((a, b) => b.submittedAt - a.submittedAt);
  const recent = all.slice(0, RECENT_SUBMISSIONS_TO_SHOW);

  function flag(submissionId: string) {
    room?.send(ClientMsg.FlagSubmission, { submissionId });
  }

  return (
    <div className="space-y-3">
      <div className="text-sm opacity-70">
        Inspect what the bots are learning. Flag anything that looks wrong —
        flagged labels are removed from the training data.
      </div>

      {recent.length === 0 && (
        <div className="text-center py-8 opacity-50 text-sm">
          No training examples yet. Have your crew label some.
        </div>
      )}

      <div className="space-y-2">
        {recent.map((s) => (
          <div
            key={s.submissionId}
            className={`flex items-center gap-3 bg-diner-bg rounded-lg p-3 ${
              s.flagged ? "opacity-50 line-through" : ""
            }`}
          >
            <div className="text-2xl">{s.exampleEmoji ?? "❓"}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs opacity-60 uppercase tracking-wider">
                {s.stationId}
              </div>
              <div className="text-sm truncate">
                {s.exampleDescription || s.exampleName || "—"}
              </div>
              <div className="text-xs mt-1">
                Labeled as:{" "}
                <span className="font-bold capitalize bg-white/10 px-2 py-0.5 rounded">
                  {s.label}
                </span>
              </div>
            </div>
            <button
              disabled={s.flagged}
              onClick={() => flag(s.submissionId)}
              className="bg-diner-bad/80 hover:brightness-110 disabled:opacity-30 text-xs font-bold px-3 py-2 rounded"
            >
              🚩 Flag
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
