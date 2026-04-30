// Bottom-right pop-up that animates customer outcomes as they happen.
// SKY: make this delightful — emoji animations, color flashes, satisfying sounds.

import { useEffect, useState } from "react";
import { useGameStore } from "../../store/game.js";
import type { CustomerResultPayload } from "starbite-shared";

const OUTCOME_EMOJI: Record<string, string> = {
  happy: "😋",
  confused: "😕",
  angry: "😡",
};

const OUTCOME_COLOR: Record<string, string> = {
  happy: "border-diner-good",
  confused: "border-diner-warm",
  angry: "border-diner-bad",
};

export function CustomerTicker() {
  const events = useGameStore((s) => s.customerEvents);
  const [active, setActive] = useState<CustomerResultPayload | null>(null);

  useEffect(() => {
    const last = events[events.length - 1];
    if (!last) return;
    setActive(last);
    const t = setTimeout(() => setActive(null), 4500);
    return () => clearTimeout(t);
  }, [events]);

  if (!active) return null;

  return (
    <div
      className={`absolute bottom-8 right-8 bg-diner-panel/95 border-4 ${
        OUTCOME_COLOR[active.outcome]
      } rounded-2xl px-5 py-4 shadow-2xl w-[300px] z-20 animate-[fadeIn_0.3s]`}
    >
      <div className="flex items-center gap-3">
        <div className="text-5xl">{OUTCOME_EMOJI[active.outcome]}</div>
        <div className="flex-1">
          <div className="text-xs opacity-60 uppercase tracking-wider">
            {active.customerName}
          </div>
          <div className="text-sm font-bold capitalize">{active.outcome}</div>
        </div>
      </div>
      <div className="mt-3 space-y-1">
        {active.perStation.map((ps) => (
          <div key={ps.stationId} className="text-xs flex items-center gap-2">
            <span>{ps.success ? "✅" : "❌"}</span>
            <span className="capitalize flex-1">{ps.stationId}</span>
            <span className="opacity-50">
              {Math.round(ps.rolledProbability * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
