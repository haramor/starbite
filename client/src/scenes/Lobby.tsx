// Lobby — players see each other, set name + avatar, host starts the game.

import { useState, useEffect } from "react";
import { useGameStore, useStarBiteState } from "../store/game.js";
import { ClientMsg, MIN_PLAYERS, SABOTEUR_COUNTS } from "starbite-shared";
import { HowToPlayModal, hasSeenHowTo } from "../components/HowToPlayModal.js";

export function Lobby() {
  const room = useGameStore((s) => s.room);
  const state = useStarBiteState();
  const mySessionId = useGameStore((s) => s.mySessionId);

  const me = state?.players.get(mySessionId);
  const [name, setName] = useState(me?.name ?? "");
  const [avatarId, setAvatarId] = useState(me?.avatarId ?? 0);
  const [showHowTo, setShowHowTo] = useState(() => !hasSeenHowTo());

  useEffect(() => {
    if (me && !name) setName(me.name);
  }, [me, name]);

  if (!state || !room) return null;

  const players = [...state.players.values()];
  const canStart = me?.isHost && players.length >= MIN_PLAYERS;

  // Preview of role distribution if this many players started the round.
  const sabPreview = SABOTEUR_COUNTS[players.length] ?? Math.max(1, Math.floor(players.length / 3));
  const trainerPreview = players.length - sabPreview;

  function commitProfile() {
    room?.send(ClientMsg.SetProfile, { name, avatarId });
  }

  function startGame() {
    room?.send(ClientMsg.StartGame, {});
  }

  return (
    <div className="h-full w-full bg-diner-bg text-white flex flex-col items-center p-6 overflow-auto">
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs opacity-60 font-display">ROOM CODE</div>
            <div className="font-display text-3xl text-diner-warm tracking-widest">
              {state.code}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-60">
              {players.length}/{10} players · need {MIN_PLAYERS}+
            </div>
          </div>
        </div>

        {players.length >= MIN_PLAYERS && (
          <div className="bg-diner-panel/60 rounded-xl px-4 py-3 text-sm flex items-center justify-center gap-2">
            <span className="opacity-60">This round will have</span>
            <span className="font-bold text-diner-good">{trainerPreview} trainers</span>
            <span className="opacity-60">and</span>
            <span className="font-bold text-diner-bad">{sabPreview} saboteurs</span>
            <span className="opacity-60">— hidden among them.</span>
          </div>
        )}

        <div className="bg-diner-panel rounded-2xl p-5">
          <div className="text-sm opacity-70 mb-3">You</div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onClick={() => {
                    setAvatarId(i);
                    room?.send(ClientMsg.SetProfile, { name, avatarId: i });
                  }}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-2xl transition ${
                    avatarId === i
                      ? "bg-diner-accent ring-2 ring-white"
                      : "bg-diner-bg hover:brightness-110"
                  }`}
                >
                  {["🧑", "👧", "👦", "🧒", "👩", "🧑‍🚀"][i]}
                </button>
              ))}
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 20))}
              onBlur={commitProfile}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitProfile();
              }}
              placeholder="Your name"
              className="flex-1 bg-diner-bg border border-white/20 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div className="bg-diner-panel rounded-2xl p-5">
          <div className="text-sm opacity-70 mb-3">Crew</div>
          <div className="grid grid-cols-2 gap-2">
            {players.map((p) => (
              <div
                key={p.sessionId}
                className="flex items-center gap-3 bg-diner-bg rounded-lg p-3"
              >
                <span className="text-2xl">
                  {["🧑", "👧", "👦", "🧒", "👩", "🧑‍🚀"][p.avatarId] ?? "🧑"}
                </span>
                <span className="flex-1 truncate">{p.name}</span>
                {p.isHost && (
                  <span className="text-xs bg-diner-warm text-black px-2 py-0.5 rounded-full font-bold">
                    HOST
                  </span>
                )}
                {!p.connected && (
                  <span className="text-xs opacity-50">disconnected</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {me?.isHost ? (
          <button
            disabled={!canStart}
            onClick={startGame}
            className="w-full bg-diner-good hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl text-lg"
          >
            {players.length < MIN_PLAYERS
              ? `Waiting for ${MIN_PLAYERS - players.length} more…`
              : "Start round"}
          </button>
        ) : (
          <div className="text-center opacity-60 text-sm">
            Waiting for host to start the round…
          </div>
        )}

        <button
          onClick={() => setShowHowTo(true)}
          className="w-full text-xs opacity-60 hover:opacity-100 underline"
        >
          How to play
        </button>
      </div>

      {showHowTo && <HowToPlayModal onClose={() => setShowHowTo(false)} />}
    </div>
  );
}
