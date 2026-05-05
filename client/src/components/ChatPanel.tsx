// Lightweight in-game chat. Mostly for meetings, but available throughout.
// Floats in bottom-left.

import { useState } from "react";
import { useGameStore, useStarBiteState } from "../store/game.js";
import { ClientMsg } from "starbite-shared";

export function ChatPanel() {
  const room = useGameStore((s) => s.room);
  const chat = useGameStore((s) => s.chat);
  const state = useStarBiteState();
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  // Auto-open chat during meeting discussion phase
  const isDiscussion = state?.meeting?.phase === "discussion";
  const shouldBeOpen = open || isDiscussion;

  function nameFor(sid: string) {
    return state?.players.get(sid)?.name ?? sid.slice(0, 4);
  }

  function send() {
    if (!text.trim()) return;
    room?.send(ClientMsg.Chat, { text: text.trim() });
    setText("");
  }

  if (!shouldBeOpen) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="absolute bottom-8 left-8 bg-diner-panel/90 hover:brightness-110 rounded-full px-4 py-2 text-xs shadow"
      >
        💬 chat {chat.length > 0 && <span className="ml-1 bg-diner-bad rounded-full px-1.5 py-0.5 text-[10px]">{chat.length}</span>}
      </button>
    );
  }

  return (
    <div className="absolute bottom-8 left-8 w-[280px] bg-diner-panel/95 rounded-xl shadow-2xl flex flex-col z-20">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <div className="text-xs opacity-70">Chat {isDiscussion && <span className="text-diner-warm">• Discussion Mode</span>}</div>
        {!isDiscussion && (
          <button
            onClick={() => setOpen(false)}
            className="text-xs opacity-60 hover:opacity-100"
          >
            —
          </button>
        )}
      </div>
      <div className="h-32 overflow-auto p-3 space-y-1 text-xs">
        {chat.map((m, i) => (
          <div key={i}>
            <span className="opacity-60">{nameFor(m.from)}:</span> {m.text}
          </div>
        ))}
      </div>
      <div className="flex border-t border-white/10">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
          placeholder="Say something…"
        />
        <button
          onClick={send}
          className="px-3 text-xs bg-diner-mid hover:brightness-110"
        >
          send
        </button>
      </div>
    </div>
  );
}
