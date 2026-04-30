// Review & Security — the audit station.
// Enhanced readability with station grouping, color coding, and improved scanning layout.

import { useGameStore, useStarBiteState } from "../../store/game.js";
import { ClientMsg, RECENT_SUBMISSIONS_TO_SHOW } from "starbite-shared";

// Station-specific styling for quick visual identification
const STATION_CONFIG: Record<string, { emoji: string; color: string; bg: string; name: string }> = {
  grill: { emoji: "🔥", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", name: "Grill Bot" },
  trash: { emoji: "🗑️", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", name: "Trash Sorter" },
  review: { emoji: "🔍", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", name: "Review" }
};

type SubmissionItem = {
  submissionId: string;
  stationId: string;
  stationType: string;
  label: string;
  flagged: boolean;
  submittedAt: number;
  exampleEmoji: string;
  exampleDescription: string;
  exampleName: string;
};

function SubmissionCard({ submission, onFlag }: { submission: SubmissionItem; onFlag: (id: string) => void }) {
  const config = STATION_CONFIG[submission.stationType] || STATION_CONFIG.review;
  const timeAgo = Math.floor((Date.now() - submission.submittedAt) / 1000);
  const timeText = timeAgo < 60 ? `${timeAgo}s` : `${Math.floor(timeAgo / 60)}m`;

  return (
    <div
      className={`relative border rounded-xl p-4 transition-all ${config.bg} border ${
        submission.flagged
          ? "opacity-40 bg-red-500/5 border-red-500/30"
          : "hover:bg-white/5 hover:border-white/10"
      }`}
    >
      {/* Flagged overlay */}
      {submission.flagged && (
        <div className="absolute inset-0 bg-red-500/10 rounded-xl flex items-center justify-center pointer-events-none">
          <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            🚩 FLAGGED
          </div>
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Item visual */}
        <div className="flex flex-col items-center gap-1 min-w-0">
          <div className="text-3xl">{submission.exampleEmoji ?? "❓"}</div>
          <div className="text-xs opacity-50">{timeText}</div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium line-clamp-2 mb-2">
            {submission.exampleDescription || submission.exampleName || "Unknown item"}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs opacity-60">Labeled as:</span>
              <span className={`font-bold capitalize text-sm px-3 py-1 rounded-full bg-white/15 ${config.color}`}>
                {submission.label}
              </span>
            </div>

            <button
              disabled={submission.flagged}
              onClick={() => onFlag(submission.submissionId)}
              className={`text-xs font-bold px-3 py-2 rounded-lg transition-all ${
                submission.flagged
                  ? "opacity-30 cursor-not-allowed"
                  : "bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-100"
              }`}
            >
              {submission.flagged ? "🚩 Flagged" : "🚩 Flag"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReviewStation() {
  const room = useGameStore((s) => s.room);
  const state = useStarBiteState();

  if (!state) return null;

  // Collect submissions and group by station type
  const allSubmissions: SubmissionItem[] = [];
  for (const station of state.stations.values()) {
    for (const ex of station.examples) {
      for (const sub of ex.submissions) {
        allSubmissions.push({
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

  // Sort by timestamp and take recent
  allSubmissions.sort((a, b) => b.submittedAt - a.submittedAt);
  const recentSubmissions = allSubmissions.slice(0, RECENT_SUBMISSIONS_TO_SHOW);

  // Group by station type for better scanning
  const groupedByStation = recentSubmissions.reduce((groups, submission) => {
    const key = submission.stationType;
    if (!groups[key]) groups[key] = [];
    groups[key].push(submission);
    return groups;
  }, {} as Record<string, SubmissionItem[]>);

  function flag(submissionId: string) {
    room?.send(ClientMsg.FlagSubmission, { submissionId });
  }

  const flaggedCount = recentSubmissions.filter(s => s.flagged).length;

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">🔍 Training Data Audit</h3>
          <div className="text-xs opacity-60">
            {recentSubmissions.length} recent • {flaggedCount} flagged
          </div>
        </div>
        <div className="text-sm opacity-70 bg-diner-bg/50 rounded-lg p-3">
          <span className="font-medium">Inspect what the bots are learning.</span> Flag anything that looks wrong — flagged labels are removed from training data.
        </div>
      </div>

      {/* No data state */}
      {recentSubmissions.length === 0 && (
        <div className="text-center py-12 opacity-50">
          <div className="text-4xl mb-2">📋</div>
          <div className="text-sm">No training examples yet.</div>
          <div className="text-xs opacity-70">Have your crew label some items to see data here.</div>
        </div>
      )}

      {/* Grouped submissions */}
      {Object.entries(groupedByStation).map(([stationType, submissions]) => {
        const config = STATION_CONFIG[stationType] || STATION_CONFIG.review;
        const stationFlagged = submissions.filter(s => s.flagged).length;

        return (
          <div key={stationType} className="space-y-3">
            {/* Station header */}
            <div className={`flex items-center justify-between p-3 rounded-lg border ${config.bg} border`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{config.emoji}</span>
                <div>
                  <div className={`font-bold ${config.color}`}>
                    {config.name}
                  </div>
                  <div className="text-xs opacity-60">
                    {submissions.length} recent label{submissions.length !== 1 ? 's' : ''}
                    {stationFlagged > 0 && ` • ${stationFlagged} flagged`}
                  </div>
                </div>
              </div>
              <div className={`text-sm font-mono ${config.color} opacity-80`}>
                {Math.round(((submissions.length - stationFlagged) / submissions.length) * 100) || 0}% clean
              </div>
            </div>

            {/* Station submissions */}
            <div className="grid gap-2">
              {submissions.map(submission => (
                <SubmissionCard
                  key={submission.submissionId}
                  submission={submission}
                  onFlag={flag}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
