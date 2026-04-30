// Trash Sorter station — 3-class classification (recycle / compost / landfill).
// Drag-and-drop interface using @dnd-kit/core.

import { useGameStore } from "../../store/game.js";
import { ClientMsg } from "starbite-shared";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  DragEndEvent,
} from "@dnd-kit/core";
import { useState } from "react";

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

// Draggable trash item component
function DraggableTrashItem({ example }: { example: any }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: "trash-item",
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`bg-diner-bg rounded-xl p-6 text-center cursor-grab active:cursor-grabbing transition-transform ${
        isDragging ? "opacity-50 scale-95" : "hover:scale-105"
      }`}
    >
      <div className="text-7xl mb-3">{example.display.emoji ?? "📦"}</div>
      <div className="text-base font-bold">
        {example.display.name ?? "Item"}
      </div>
    </div>
  );
}

// Droppable bin component
function DroppableBin({ label, emoji, color }: { label: string; emoji: string; color: string }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `bin-${label}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${color} hover:brightness-110 text-white font-bold py-8 rounded-xl text-sm capitalize flex flex-col items-center gap-3 transition-all min-h-[120px] ${
        isOver ? "ring-4 ring-white scale-105 brightness-125" : ""
      }`}
    >
      <span className="text-4xl">{emoji}</span>
      <span className="text-lg">{label}</span>
      {isOver && <span className="text-xs opacity-80">Drop here!</span>}
    </div>
  );
}

export function TrashStation({ isSaboteur }: Props) {
  const room = useGameStore((s) => s.room);
  const example = useGameStore((s) => s.currentExample);
  const poisonReady = useGameStore((s) => s.poisonReady);
  const setPoisonReady = useGameStore((s) => s.setPoisonReady);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

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

  function handleDragStart() {
    setDraggedItem("trash-item");
  }

  function handleDragEnd(event: DragEndEvent) {
    const { over } = event;
    setDraggedItem(null);

    if (over?.id && typeof over.id === "string" && over.id.startsWith("bin-")) {
      const label = over.id.replace("bin-", "");
      submit(label, false); // Normal submission on drop
    }
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="space-y-5">
        {/* Draggable trash item */}
        <DraggableTrashItem example={example} />

        <div className="text-sm opacity-70 text-center">
          Drag the item into the correct bin
        </div>

        {/* Droppable bins */}
        <div className="grid grid-cols-3 gap-4">
          {example.labelOptions.map((label) => (
            <DroppableBin
              key={label}
              label={label}
              emoji={BIN_EMOJI[label] ?? "🗑️"}
              color={BIN_COLOR[label] ?? "bg-diner-mid"}
            />
          ))}
        </div>

        {/* Saboteur poison buttons */}
        {isSaboteur && (
          <div className="border-t border-white/10 pt-4 mt-4">
            <div className="text-xs text-diner-bad font-bold mb-2">
              🦹 SABOTEUR ABILITY
            </div>
            <div className="text-xs opacity-70 mb-3">
              Click to send to the WRONG bin and poison the training data.
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

        {/* Drag overlay for visual feedback */}
        <DragOverlay>
          {draggedItem ? (
            <div className="bg-diner-bg rounded-xl p-6 text-center opacity-80 rotate-3">
              <div className="text-7xl mb-3">{example.display.emoji ?? "📦"}</div>
              <div className="text-base font-bold">
                {example.display.name ?? "Item"}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
