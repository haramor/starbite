// Modal that opens when a player enters a station.
// Routes to the correct mini-game based on station type.

import { useStarBiteState } from "../store/game.js";
import { GrillStation } from "./stations/GrillStation.js";
import { TrashStation } from "./stations/TrashStation.js";
import { ReviewStation } from "./stations/ReviewStation.js";

interface Props {
  stationId: string;
  isSaboteur: boolean;
  onClose: () => void;
}

export function StationModal({ stationId, isSaboteur, onClose }: Props) {
  const state = useStarBiteState();
  const station = state?.stations.get(stationId);
  if (!station) return null;

  return (
    <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-diner-panel rounded-2xl shadow-2xl w-[640px] max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <div className="text-xs opacity-60 uppercase tracking-wider">
              {station.stationType}
            </div>
            <div className="text-xl font-display">{station.id.toUpperCase()}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm opacity-70">
              Accuracy: <span className="font-bold">{station.accuracy}%</span>
            </div>
            <button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg text-sm"
            >
              Leave
            </button>
          </div>
        </div>

        <div className="p-5">
          {station.stationType === "grill" && (
            <GrillStation isSaboteur={isSaboteur} />
          )}
          {station.stationType === "trash" && (
            <TrashStation isSaboteur={isSaboteur} />
          )}
          {station.stationType === "review" && <ReviewStation />}
        </div>
      </div>
    </div>
  );
}
