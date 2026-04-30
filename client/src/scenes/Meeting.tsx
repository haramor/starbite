// Emergency meeting screen. Two phases: discussion (chat-only) → voting → result.
// HARA: this is your file. Build out the voting UI: vote tally bars, "voted" indicators
// next to each player, animated ejection result.

import { useEffect, useState } from "react";
import { useGameStore } from "../store/game.js";
import { ClientMsg } from "starbite-shared";

export function Meeting() {
  const room = useGameStore((s) => s.room);
  const state = useGameStore((s) => s.state);
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

  const tally = new Map<string, number>();
  for (const v of m.votes) tally.set(v.target, (tally.get(v.target) ?? 0) + 1);

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

        {m.phase === "discussion" && (
          <div className="bg-diner-panel rounded-2xl p-6 text-center">
            <div className="text-sm opacity-80">
              Discuss what you've seen. Use the chat. Voting opens when the timer
              ends.
            </div>
          </div>
        )}

        {m.phase === "voting" && me?.isAlive && (
          <div className="bg-diner-panel rounded-2xl p-6">
            <div className="text-sm opacity-70 mb-3">
              Vote to eject — or skip if you're not sure.
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[...state.players.values()]
                .filter((p) => p.isAlive)
                .map((p) => {
                  const votes = tally.get(p.sessionId) ?? 0;
                  const selected = myVote === p.sessionId;
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
                        {["🧑", "👧", "👦", "🧒", "👩", "🧑‍🚀"][p.avatarId] ??
                          "🧑"}
                      </span>
                      <span className="flex-1 text-left truncate">{p.name}</span>
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
        )}

        {m.phase === "results" && (
          <div className="bg-diner-panel rounded-2xl p-6 text-center">
            {m.result === "skip" || m.result === "" ? (
              <div className="text-lg opacity-80">Nobody was ejected.</div>
            ) : (
              <div>
                <div className="text-sm opacity-60">Ejected:</div>
                <div className="text-2xl font-bold mt-1">
                  {state.players.get(m.result)?.name ?? "Unknown"}
                </div>
                <div className="mt-3 text-sm opacity-80">
                  They were a{" "}
                  <span className="font-bold capitalize">
                    {state.players.get(m.result)?.revealedRole}
                  </span>
                  .
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
