// Zustand store for client-side game state.
// Holds: the Colyseus room handle, the live state mirror, transient UI flags,
// and one-shot server messages (current example, role, alerts).
//
// IMPORTANT — Colyseus mutates `room.state` IN PLACE. The same object reference
// always comes out of the store, so a Zustand selector returning `s.state`
// would never re-render React on state changes. We bump `stateTick` on every
// onStateChange so subscribers can opt into re-rendering. Use the
// `useStarBiteState()` hook below — it subscribes to the tick and returns
// the live state. Don't use `useGameStore(s => s.state)` directly in render
// paths or you'll see stale UI.

import { create } from "zustand";
import type { Room } from "colyseus.js";
import type {
  StarBiteState,
  Role,
  CurrentExamplePayload,
  CustomerResultPayload,
  AccuracyAlertPayload,
  GameEndedPayload,
} from "starbite-shared";

interface ChatMsg {
  from: string;
  text: string;
  at: number;
}

export interface GameStore {
  room: Room<StarBiteState> | null;
  state: StarBiteState | null;
  /** Bumped on every Colyseus onStateChange to force React re-renders. */
  stateTick: number;
  myRole: Role | null;
  mySessionId: string;
  // For saboteurs: list of other saboteurs on their team
  saboteurTeammates: Array<{ sessionId: string; name: string; avatarId: number }> | null;
  // The example currently shown to the player at their station, if any.
  currentExample: CurrentExamplePayload | null;
  poisonReady: boolean;
  // Recent customer animation queue
  customerEvents: CustomerResultPayload[];
  accuracyAlerts: AccuracyAlertPayload[];
  endGame: GameEndedPayload | null;
  errors: Array<{ code: string; message: string; at: number }>;
  chat: ChatMsg[];

  setRoom: (r: Room<StarBiteState> | null) => void;
  setState: (s: StarBiteState | null) => void;
  bumpStateTick: () => void;
  setMyRole: (r: Role | null) => void;
  setMySessionId: (id: string) => void;
  setSaboteurTeammates: (teammates: Array<{ sessionId: string; name: string; avatarId: number }> | null) => void;
  setCurrentExample: (e: CurrentExamplePayload | null) => void;
  setPoisonReady: (b: boolean) => void;
  pushCustomerEvent: (e: CustomerResultPayload) => void;
  pushAccuracyAlert: (a: AccuracyAlertPayload) => void;
  setEndGame: (e: GameEndedPayload | null) => void;
  pushError: (code: string, message: string) => void;
  pushChat: (msg: ChatMsg) => void;
  clearChat: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  room: null,
  state: null,
  stateTick: 0,
  myRole: null,
  mySessionId: "",
  saboteurTeammates: null,
  currentExample: null,
  poisonReady: true,
  customerEvents: [],
  accuracyAlerts: [],
  endGame: null,
  errors: [],
  chat: [],

  setRoom: (room) => set({ room }),
  setState: (state) => set((s) => ({ state, stateTick: s.stateTick + 1 })),
  bumpStateTick: () => set((s) => ({ stateTick: s.stateTick + 1 })),
  setMyRole: (myRole) => set({ myRole }),
  setMySessionId: (mySessionId) => set({ mySessionId }),
  setSaboteurTeammates: (saboteurTeammates) => set({ saboteurTeammates }),
  setCurrentExample: (currentExample) => set({ currentExample }),
  setPoisonReady: (poisonReady) => set({ poisonReady }),
  pushCustomerEvent: (e) =>
    set((s) => ({ customerEvents: [...s.customerEvents.slice(-9), e] })),
  pushAccuracyAlert: (a) =>
    set((s) => ({ accuracyAlerts: [...s.accuracyAlerts.slice(-4), a] })),
  setEndGame: (endGame) => set({ endGame }),
  pushError: (code, message) =>
    set((s) => ({
      errors: [...s.errors.slice(-9), { code, message, at: Date.now() }],
    })),
  pushChat: (msg) => set((s) => ({ chat: [...s.chat.slice(-29), msg] })),
  clearChat: () => set({ chat: [] }),
}));

/**
 * Hook that returns the live Colyseus state and re-renders on every change.
 *
 * Use this everywhere instead of `useGameStore((s) => s.state)`. The reason:
 * Colyseus mutates the same StarBiteState instance over time, so subscribing
 * to `.state` directly never sees a "new" reference and Zustand skips the
 * re-render. We piggyback on `stateTick` (bumped every onStateChange) to
 * force the re-render, then read state by reference.
 */
export function useStarBiteState() {
  // Subscribing to stateTick is what forces re-renders.
  useGameStore((s) => s.stateTick);
  return useGameStore((s) => s.state);
}
