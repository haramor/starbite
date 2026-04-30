// Grill Bot training station — binary classifier (rare vs done).
// SKY: this is your file. Polish the visuals, add drag-and-drop or animations,
// add a "your last 5 labels" section, etc. The core submit/poison flow works.

import { useGameStore } from "../../store/game.js";
import { ClientMsg } from "starbite-shared";

interface Props {
  isSaboteur: boolean;
}

export function GrillStation({ isSaboteur }: Props) {
  const room = useGameStore((s) => s.room);
  const example = useGameStore((s) => s.currentExample);
  const poisonReady = useGameStore((s) => s.poisonReady);
  const setPoisonReady = useGameStore((s) => s.setPoisonReady);

  if (!example) {
    return (
      <div className="text-center py-8 opacity-60">
        Waiting for the next example…
      </div>
    );
  }

  function submit(label: string, poison: boolean) {
    if (!example) return;
    if (poison) setPoisonReady(false);
    room?.send(poison ? ClientMsg.PoisonLabel : ClientMsg.SubmitLabel, {
      stationId: "grill",
      exampleId: example.exampleId,
      label,
    });
  }

  return (
    <div className="space-y-5">
      <div className="bg-diner-bg rounded-xl p-6 text-center">
        <div className="text-7xl mb-3">{example.display.emoji ?? "🍔"}</div>
        <div className="text-sm opacity-80">
          {example.display.description ?? example.display.name ?? "Patty"}
        </div>
      </div>

      <div className="text-sm opacity-70 text-center">
        Tell the Grill Bot: how is this patty cooked?
      </div>

      <div className="grid grid-cols-2 gap-3">
        {example.labelOptions.map((label) => (
          <button
            key={label}
            onClick={() => submit(label, false)}
            className="bg-diner-mid hover:brightness-110 text-white font-bold py-4 rounded-xl text-lg capitalize"
          >
            {label}
          </button>
        ))}
      </div>

      {isSaboteur && (
        <div className="border-t border-white/10 pt-4 mt-4">
          <div className="text-xs text-diner-bad font-bold mb-2">
            🦹 SABOTEUR ABILITY
          </div>
          <div className="text-xs opacity-70 mb-3">
            Submit the WRONG label to poison training data.
            {!poisonReady && " (cooldown)"}
          </div>
          <div className="grid grid-cols-2 gap-2">
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
