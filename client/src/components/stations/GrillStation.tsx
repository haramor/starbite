// Grill Bot training station — binary classifier with cooking-themed visual design.
// Enhanced with temperature gauge aesthetics and cooking animations.

import { useState } from "react";
import { useGameStore } from "../../store/game.js";
import { ClientMsg } from "starbite-shared";

interface Props {
  isSaboteur: boolean;
}

// Cooking-themed styling for labels
const COOKING_CONFIG = {
  rare: {
    emoji: "🥩",
    color: "from-red-600 to-pink-500",
    borderColor: "border-red-500/30",
    hoverColor: "hover:from-red-500 hover:to-pink-400",
    textColor: "text-red-100",
    icon: "🌡️",
    temp: "120°F",
    description: "Cool and pink inside"
  },
  done: {
    emoji: "🔥",
    color: "from-orange-600 to-amber-600",
    borderColor: "border-orange-500/30",
    hoverColor: "hover:from-orange-500 hover:to-amber-500",
    textColor: "text-orange-100",
    icon: "♨️",
    temp: "160°F",
    description: "Hot and fully cooked"
  }
};

function CookingButton({
  label,
  onSubmit,
  isSubmitting
}: {
  label: string;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const config = COOKING_CONFIG[label as keyof typeof COOKING_CONFIG];
  const [isPressed, setIsPressed] = useState(false);

  if (!config) return null;

  return (
    <button
      disabled={isSubmitting}
      onClick={() => {
        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 200);
        onSubmit();
      }}
      className={`
        relative overflow-hidden rounded-2xl border-2 ${config.borderColor}
        bg-gradient-to-br ${config.color} ${config.hoverColor}
        ${config.textColor} font-bold text-lg
        transition-all duration-200 transform
        hover:scale-105 hover:shadow-xl active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        px-6 py-6 min-h-[120px] flex flex-col items-center justify-center gap-3
        ${isPressed ? 'animate-pulse scale-95' : ''}
        ${isSubmitting ? 'opacity-75' : ''}
      `}
    >
      {/* Temperature indicator */}
      <div className="flex items-center gap-2 text-sm opacity-90">
        <span className="text-xl">{config.icon}</span>
        <span className="font-mono">{config.temp}</span>
      </div>

      {/* Main label */}
      <div className="text-2xl font-bold capitalize flex items-center gap-2">
        <span className="text-3xl">{config.emoji}</span>
        {label}
      </div>

      {/* Description */}
      <div className="text-xs opacity-80 text-center leading-tight">
        {config.description}
      </div>

      {/* Sizzle effect */}
      {isPressed && (
        <div className="absolute inset-0 bg-white/20 rounded-2xl animate-ping"></div>
      )}
    </button>
  );
}

export function GrillStation({ isSaboteur }: Props) {
  const room = useGameStore((s) => s.room);
  const example = useGameStore((s) => s.currentExample);
  const poisonReady = useGameStore((s) => s.poisonReady);
  const setPoisonReady = useGameStore((s) => s.setPoisonReady);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!example) {
    return (
      <div className="text-center py-12 opacity-60">
        <div className="text-6xl mb-4">🔥</div>
        <div className="text-lg">Grill is heating up...</div>
        <div className="text-sm opacity-70">Waiting for the next patty</div>
      </div>
    );
  }

  function submit(label: string, poison: boolean) {
    if (!example || isSubmitting) return;

    setIsSubmitting(true);
    if (poison) setPoisonReady(false);

    room?.send(poison ? ClientMsg.PoisonLabel : ClientMsg.SubmitLabel, {
      stationId: "grill",
      exampleId: example.exampleId,
      label,
    });

    // Reset submitting state after animation
    setTimeout(() => setIsSubmitting(false), 1000);
  }

  return (
    <div className="space-y-6 max-w-md mx-auto">
      {/* Patty Display */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 text-center border-2 border-gray-600/50 shadow-2xl">
        <div className="mb-4">
          <div className="text-8xl mb-3 animate-pulse">{example.display.emoji ?? "🍔"}</div>
          <div className="text-lg font-bold text-orange-200 mb-2">
            Fresh Patty on the Grill
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4 border border-orange-500/20">
          <div className="text-sm text-orange-300 font-medium">
            {example.display.description ?? example.display.name ?? "Cooking..."}
          </div>
        </div>
      </div>

      {/* Instruction */}
      <div className="text-center">
        <div className="text-lg font-bold text-orange-200 mb-1">
          🔥 How is this patty cooked?
        </div>
        <div className="text-sm opacity-70">
          Help the Grill Bot learn to judge doneness
        </div>
      </div>

      {/* Cooking Options */}
      <div className="grid grid-cols-2 gap-4">
        {example.labelOptions.map((label) => (
          <CookingButton
            key={label}
            label={label}
            onSubmit={() => submit(label, false)}
            isSubmitting={isSubmitting}
          />
        ))}
      </div>

      {/* Saboteur Section */}
      {isSaboteur && (
        <div className="border-t-2 border-red-500/20 pt-6 mt-6 bg-red-900/10 rounded-lg p-4">
          <div className="text-center mb-4">
            <div className="text-red-400 font-bold text-sm mb-1">
              🦹 SABOTEUR ABILITY
            </div>
            <div className="text-xs text-red-300 opacity-80">
              Mislead the Grill Bot with wrong temperature readings!
              {!poisonReady && " (Equipment cooling down...)"}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {example.labelOptions.map((label) => {
              const config = COOKING_CONFIG[label as keyof typeof COOKING_CONFIG];
              return (
                <button
                  key={label}
                  disabled={!poisonReady || isSubmitting}
                  onClick={() => submit(label, true)}
                  className={`
                    bg-red-900/50 hover:bg-red-800/60 disabled:opacity-30
                    disabled:cursor-not-allowed border border-red-500/50
                    text-red-200 text-sm py-3 rounded-xl transition-all
                    hover:scale-105 active:scale-95 font-medium
                    flex items-center justify-center gap-2
                  `}
                >
                  <span className="text-lg">{config?.emoji}</span>
                  <span>Fake: {label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Visual feedback overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-orange-500/20 flex items-center justify-center pointer-events-none z-50">
          <div className="bg-orange-600 text-white px-6 py-3 rounded-full text-lg font-bold animate-bounce">
            🔥 Analyzing patty...
          </div>
        </div>
      )}
    </div>
  );
}
