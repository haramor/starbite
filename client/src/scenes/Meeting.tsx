// Emergency meeting screen. Three phases: discussion (chat-only) → voting → results.

import { useEffect, useState } from "react";
import { useGameStore, useStarBiteState } from "../store/game.js";
import { ClientMsg } from "starbite-shared";
import { ChatPanel } from "../components/ChatPanel.js";

const AVATAR_EMOJI = ["🧑", "👧", "👦", "🧒", "👩", "🧑‍🚀"];

export function Meeting() {
  const room = useGameStore((s) => s.room);
  const state = useStarBiteState();
  const mySessionId = useGameStore((s) => s.mySessionId);

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, []);

  if (!state || !state.meeting) return null;
  const m = state.meeting;
  const remaining = Math.max(0, Math.round((m.endsAt - now) / 1000));
  const me = state.players.get(mySessionId);
  const myVote = m.votes.find((v) => v.voterSessionId === mySessionId)?.target;

  function vote(target: string) {
    room?.send(ClientMsg.CastVote, { target });
  }

  // Vote tally per candidate
  const tally = new Map<string, number>();
  for (const v of m.votes) tally.set(v.target, (tally.get(v.target) ?? 0) + 1);

  // Set of session ids that have already voted (used for "X has voted" indicators)
  const votedSet = new Set(m.votes.map((v) => v.voterSessionId));
  const aliveCount = [...state.players.values()].filter((p) => p.isAlive).length;
  const callerName = state.players.get(m.calledBy)?.name ?? "Someone";

  return (
    <div className="h-full w-full bg-diner-bg/95 backdrop-blur flex flex-col items-center justify-center p-8 text-white">
      <div className="w-full max-w-3xl space-y-6">
        <div className="text-center">
          <div className="text-xs opacity-60 font-display uppercase tracking-widest">
            Emergency Meeting
          </div>
          <div className="text-3xl font-display mt-2 capitalize">{m.phase}</div>
          <div className="text-diner-warm font-display text-2xl mt-2">
            {remaining}s
          </div>
        </div>

        {/* Called-by banner — visible during discussion + voting (not results) */}
        {m.phase !== "results" && (
          <div className="bg-diner-bad/20 border border-diner-bad/50 rounded-xl px-4 py-2 text-sm flex items-center justify-center gap-2">
            <span className="text-lg">🚨</span>
            <span>
              <span className="font-bold">{callerName}</span> called this meeting.
            </span>
          </div>
        )}

        {m.phase === "discussion" && (
          <div className="bg-diner-panel rounded-2xl p-6 text-center">
            <div className="text-sm opacity-80">
              Discuss what you've seen. Use the chat. Voting opens when the timer
              ends.
            </div>
          </div>
        )}

        {m.phase === "voting" && (
          <>
            {me?.isAlive ? (
              <div className="bg-diner-panel rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm opacity-70">
                    Vote to eject — or skip if you're not sure.
                  </div>
                  <div className="text-xs opacity-60">
                    {votedSet.size} of {aliveCount} voted
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[...state.players.values()]
                    .filter((p) => p.isAlive)
                    .map((p) => {
                      const votes = tally.get(p.sessionId) ?? 0;
                      const selected = myVote === p.sessionId;
                      const hasVoted = votedSet.has(p.sessionId);
                      return (
                        <button
                          key={p.sessionId}
                          onClick={() => vote(p.sessionId)}
                          className={`flex items-center gap-3 rounded-lg p-3 transition ${
                            selected
                              ? "bg-diner-bad ring-2 ring-white"
                              : "bg-diner-bg hover:brightness-125"
                          }`}
                        >
                          <span className="text-xl">
                            {AVATAR_EMOJI[p.avatarId] ?? "🧑"}
                          </span>
                          <span className="flex-1 text-left truncate">
                            {p.name}
                          </span>
                          {hasVoted && (
                            <span
                              className="text-xs text-diner-good"
                              title="This player has cast a vote"
                            >
                              ✓
                            </span>
                          )}
                          {votes > 0 && (
                            <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                              {votes}
                            </span>
                          )}
                        </button>
                      );
                    })}
                </div>
                <button
                  onClick={() => vote("skip")}
                  className={`w-full mt-3 rounded-lg p-3 ${
                    myVote === "skip"
                      ? "bg-diner-warm text-black"
                      : "bg-diner-bg hover:brightness-125"
                  }`}
                >
                  Skip vote
                </button>
              </div>
            ) : (
              <div className="bg-diner-panel rounded-2xl p-6 text-center text-sm opacity-70">
                You've been ejected. You can watch but not vote.
              </div>
            )}

            {/* Voting-status panel: who has and hasn't voted yet */}
            <div className="bg-diner-panel/60 rounded-xl px-4 py-3">
              <div className="text-xs opacity-60 mb-2 uppercase tracking-wider">
                Voting status
              </div>
              <div className="flex flex-wrap gap-2">
                {[...state.players.values()]
                  .filter((p) => p.isAlive)
                  .map((p) => {
                    const voted = votedSet.has(p.sessionId);
                    return (
                      <div
                        key={p.sessionId}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ${
                          voted
                            ? "bg-diner-good/20 text-diner-good"
                            : "bg-white/5 text-white/50"
                        }`}
                      >
                        <span>{AVATAR_EMOJI[p.avatarId] ?? "🧑"}</span>
                        <span>{p.name}</span>
                        <span className="font-bold">
                          {voted ? "✓" : "…"}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </>
        )}

        {m.phase === "results" && <ResultsReveal />}
      </div>

      {/* Chat panel always visible during meeting */}
      <ChatPanel />
    </div>
  );
}

// Big dramatic reveal of the meeting's outcome. We animate the reveal in
// stages: name first, then role.
function ResultsReveal() {
  const state = useStarBiteState();
  const m = state?.meeting;
  const [stage, setStage] = useState(0);

  useEffect(() => {
    setStage(0);
    const t1 = setTimeout(() => setStage(1), 600);  // name fades in
    const t2 = setTimeout(() => setStage(2), 1900); // role reveals
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [m?.result]);

  if (!state || !m) return null;
  const isSkip = m.result === "skip" || m.result === "";
  const ejected = isSkip ? null : state.players.get(m.result);

  if (isSkip) {
    return (
      <div className="bg-diner-panel rounded-2xl p-10 text-center">
        <div className="text-5xl mb-4">🤷</div>
        <div className="text-2xl font-display">No one was ejected.</div>
        <div className="text-sm opacity-60 mt-2">
          The crew couldn't agree. Back to work.
        </div>
      </div>
    );
  }

  if (!ejected) return null;

  const isSaboteur = ejected.revealedRole === "saboteur";
  const roleColor = isSaboteur ? "text-diner-bad" : "text-diner-good";
  const roleBg = isSaboteur ? "bg-diner-bad/20 border-diner-bad" : "bg-diner-good/20 border-diner-good";

  return (
    <div
      className={`rounded-2xl p-10 text-center border-4 ${roleBg} transition-all duration-300`}
    >
      <div
        className={`text-6xl mb-4 transition-all duration-500 ${
          stage >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"
        }`}
      >
        {AVATAR_EMOJI[ejected.avatarId] ?? "🧑"}
      </div>
      <div
        className={`text-3xl font-display transition-all duration-500 ${
          stage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {ejected.name}
      </div>
      <div className="text-sm opacity-60 mt-1">has been ejected.</div>

      <div
        className={`mt-6 transition-all duration-500 ${
          stage >= 2 ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        <div className="text-xs opacity-60 uppercase tracking-widest">
          They were a
        </div>
        <div className={`text-4xl font-display mt-2 ${roleColor}`}>
          {(ejected.revealedRole ?? "trainer").toUpperCase()}
        </div>
      </div>
    </div>
  );
}
