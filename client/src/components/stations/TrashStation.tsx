// Trash Sorter station — 3-class classification (recycle / compost / landfill).
// SKY: same shape as GrillStation. Drag-and-drop into 3 bins would be a great upgrade.

import { useGameStore } from "../../store/game.js";
import { ClientMsg } from "starbite-shared";

interface Props {
  isSaboteur: boolean;
}

const BIN_COLOR: Record<string, string> = {
  recycle: "bg-blue-500",
  compost: "bg-green-600",
  landfill: "bg-stone-600",
};
const BIN_EMOJI: Record<string, string> = {
  recycle: "♻️",
  compost: "🌱",
  landfill: "🗑️",
};

export function TrashStation({ isSaboteur }: Props) {
  const room = useGameStore((s) => s.room);
  const example = useGameStore((s) => s.currentExample);
  const poisonReady = useGameStore((s) => s.poisonReady);
  const setPoisonReady = useGameStore((s) => s.setPoisonReady);

  if (!example) {
    return (
      <div className="text-center py-8 opacity-60">Waiting for the next item…</div>
    );
  }

  function submit(label: string, poison: boolean) {
    if (!example) return;
    if (poison) setPoisonReady(false);
    room?.send(poison ? ClientMsg.PoisonLabel : ClientMsg.SubmitLabel, {
      stationId: "trash",
      exampleId: example.exampleId,
      label,
    });
  }

  return (
    <div className="space-y-5">
      <div className="bg-diner-bg rounded-xl p-6 text-center">
        <div className="text-7xl mb-3">{example.display.emoji ?? "📦"}</div>
        <div className="text-base font-bold">
          {example.display.name ?? "Item"}
        </div>
      </div>

      <div className="text-sm opacity-70 text-center">
        Which bin does this go in?
      </div>

      <div className="grid grid-cols-3 gap-3">
        {example.labelOptions.map((label) => (
          <button
            key={label}
            onClick={() => submit(label, false)}
            className={`${
              BIN_COLOR[label] ?? "bg-diner-mid"
            } hover:brightness-110 text-white font-bold py-5 rounded-xl text-sm capitalize flex flex-col items-center gap-2`}
          >
            <span className="text-3xl">{BIN_EMOJI[label] ?? "🗑️"}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {isSaboteur && (
        <div className="border-t border-white/10 pt-4 mt-4">
          <div className="text-xs text-diner-bad font-bold mb-2">
            🦹 SABOTEUR ABILITY
          </div>
          <div className="text-xs opacity-70 mb-3">
            Send it to the WRONG bin to poison the training data.
            {!poisonReady && " (cooldown)"}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {example.labelOptions.map((label) => (
              <button
                key={label}
                disabled={!poisonReady}
                onClick={() => submit(label, true)}
                className="bg-diner-bad/30 hover:bg-diner-bad/50 disabled:opacity-30 disabled:cursor-not-allowed text-xs py-2 rounded-lg capitalize border border-diner-bad/50"
              >
                Poison: {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
