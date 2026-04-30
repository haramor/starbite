// Bottom-right pop-up that animates customer outcomes as they happen.
// Enhanced with delightful animations, emoji bounces, shakes, and sound effects.

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
  const [iconsRevealed, setIconsRevealed] = useState<string[]>([]);

  useEffect(() => {
    const last = events[events.length - 1];
    if (!last) return;

    setActive(last);
    setIconsRevealed([]);

    // Play sound effect based on outcome
    // TODO: Implement sound effects when Helper 5 provides files
    // if (last.outcome === 'happy') playSound('sfx_customer_happy.mp3');
    // if (last.outcome === 'angry') playSound('sfx_customer_angry.mp3');
    // if (last.outcome === 'confused') playSound('sfx_customer_confused.mp3');

    // Animate icons in sequence with delays (dice roll effect)
    last.perStation.forEach((_, index) => {
      setTimeout(() => {
        setIconsRevealed((prev) => [...prev, `${index}`]);
      }, 800 + index * 300); // Start after 800ms, then 300ms between each
    });

    // Hide after total duration
    const totalDuration = 5000 + last.perStation.length * 300;
    const hideTimeout = setTimeout(() => setActive(null), totalDuration);
    return () => clearTimeout(hideTimeout);
  }, [events]);

  if (!active) return null;

  // Determine panel animation class
  const panelAnimation = active.outcome === 'angry'
    ? 'animate-[shakeAngry_0.6s_ease-in-out_2]'
    : '';

  // Determine emoji animation class
  const emojiAnimation = active.outcome === 'happy'
    ? 'animate-[bounceHappy_1s_ease-in-out_infinite]'
    : active.outcome === 'angry'
    ? 'animate-pulse'
    : '';

  return (
    <div
      className={`absolute bottom-8 right-8 bg-diner-panel/95 border-4 ${
        OUTCOME_COLOR[active.outcome]
      } rounded-2xl px-5 py-4 shadow-2xl w-[320px] z-20 animate-[slideInFromRight_0.5s_ease-out] ${panelAnimation}`}
    >
      {/* Header with huge bouncy emoji */}
      <div className="flex items-center gap-4">
        <div className={`text-7xl ${emojiAnimation}`}>
          {OUTCOME_EMOJI[active.outcome]}
        </div>
        <div className="flex-1">
          <div className="text-xs opacity-60 uppercase tracking-wider font-bold">
            {active.customerName}
          </div>
          <div className="text-lg font-bold capitalize text-white">
            {active.outcome}!
          </div>
        </div>
      </div>

      {/* Station outcomes with sequential animation */}
      <div className="mt-4 space-y-2">
        {active.perStation.map((ps, index) => {
          const isRevealed = iconsRevealed.includes(`${index}`);
          return (
            <div key={ps.stationId} className="text-sm flex items-center gap-3">
              <span
                className={`text-xl transition-all duration-300 ${
                  isRevealed
                    ? 'animate-[iconReveal_0.4s_ease-out] opacity-100'
                    : 'opacity-0'
                }`}
              >
                {ps.success ? "✅" : "❌"}
              </span>
              <span className="capitalize flex-1 font-medium">
                {ps.stationId}
              </span>
              <span className="opacity-70 text-xs font-mono">
                {Math.round(ps.rolledProbability * 100)}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Success glow effect for happy outcomes */}
      {active.outcome === 'happy' && (
        <div className="absolute inset-0 rounded-2xl animate-[pulseGlow_2s_infinite] pointer-events-none" />
      )}
    </div>
  );
}
