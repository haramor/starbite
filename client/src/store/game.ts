// Zustand store for client-side game state.
// Holds: the Colyseus room handle, the live state mirror, transient UI flags,
// and one-shot server messages (current example, role, alerts).

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
  myRole: Role | null;
  mySessionId: string;
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
  setMyRole: (r: Role | null) => void;
  setMySessionId: (id: string) => void;
  setCurrentExample: (e: CurrentExamplePayload | null) => void;
  setPoisonReady: (b: boolean) => void;
  pushCustomerEvent: (e: CustomerResultPayload) => void;
  pushAccuracyAlert: (a: AccuracyAlertPayload) => void;
  setEndGame: (e: GameEndedPayload | null) => void;
  pushError: (code: string, message: string) => void;
  pushChat: (msg: ChatMsg) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  room: null,
  state: null,
  myRole: null,
  mySessionId: "",
  currentExample: null,
  poisonReady: true,
  customerEvents: [],
  accuracyAlerts: [],
  endGame: null,
  errors: [],
  chat: [],

  setRoom: (room) => set({ room }),
  setState: (state) => set({ state }),
  setMyRole: (myRole) => set({ myRole }),
  setMySessionId: (mySessionId) => set({ mySessionId }),
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
}));
