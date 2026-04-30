// Title / connection screen. Shown before joining a room.
// Lets you create a new room (you become host) or join one by code.

import { useState } from "react";
import { createRoom, joinRoomByCode } from "../net/client.js";

export function Title() {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    setBusy(true);
    setError(null);
    try {
      await createRoom();
    } catch (e: any) {
      setError(e?.message ?? "Failed to create room.");
    } finally {
      setBusy(false);
    }
  }

  async function handleJoin() {
    if (code.length !== 4) {
      setError("Room code is 4 letters.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await joinRoomByCode(code);
    } catch (e: any) {
      setError(e?.message ?? "Couldn't join. Check the code.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="h-full w-full flex items-center justify-center bg-diner-bg text-white">
      <div className="bg-diner-panel rounded-2xl p-10 shadow-2xl w-[420px] text-center space-y-6">
        <div>
          <div className="text-diner-warm text-xs font-display tracking-widest">
            STAR BITE
          </div>
          <div className="text-4xl font-display mt-2">DINER</div>
          <div className="text-xs mt-3 opacity-70">
            Train the bots. Spot the saboteurs.
          </div>
        </div>

        <button
          disabled={busy}
          onClick={handleCreate}
          className="w-full bg-diner-accent hover:brightness-110 disabled:opacity-50 text-black font-bold py-3 rounded-xl"
        >
          Create a room
        </button>

        <div className="text-xs opacity-60">— or —</div>

        <div className="space-y-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 4))}
            placeholder="ROOM CODE"
            className="w-full text-center font-display text-xl bg-diner-bg border border-white/20 rounded-xl py-3 tracking-widest"
          />
          <button
            disabled={busy}
            onClick={handleJoin}
            className="w-full bg-diner-mid hover:brightness-110 disabled:opacity-50 font-bold py-3 rounded-xl"
          >
            Join
          </button>
        </div>

        {error && <div className="text-diner-bad text-sm">{error}</div>}
      </div>
    </div>
  );
}
