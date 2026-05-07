// Colyseus client wrapper. Exposes connect/joinRoom/createRoom + wires up
// server messages into the Zustand store.

import { Client, Room } from "colyseus.js";
import {
  ServerMsg,
  type StarBiteState,
  type RoleAssignedPayload,
  type CurrentExamplePayload,
  type AccuracyAlertPayload,
  type CustomerResultPayload,
  type GameEndedPayload,
  type ErrorPayload,
} from "starbite-shared";
import { useGameStore } from "../store/game.js";

// WebSocket URL derivation:
//  1. If VITE_SERVER_URL is explicitly set, use it (escape hatch for split deployments).
//  2. In `vite dev` (DEV=true), default to local server on :2567.
//  3. In production builds, derive from the page's own origin — works automatically
//     for the single-service deploy where the same server hosts both API and HTML.
const SERVER_URL = (() => {
  const override = import.meta.env.VITE_SERVER_URL as string | undefined;
  if (override) return override;
  if (import.meta.env.DEV) return "ws://localhost:2567";
  // Production: same origin as the page
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${window.location.host}`;
})();

let client: Client | null = null;

export function getClient(): Client {
  if (!client) client = new Client(SERVER_URL);
  return client;
}

// Generate a 4-letter room code on the client for host-created rooms.
// Same alphabet as the server fallback.
function makeRoomCode(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ";
  let s = "";
  for (let i = 0; i < 4; i++) {
    s += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return s;
}

function wireRoom(room: Room<StarBiteState>) {
  const store = useGameStore.getState();
  store.setRoom(room);
  store.setMySessionId(room.sessionId);

  room.onStateChange((state) => {
    useGameStore.getState().setState(state);
  });

  room.onMessage(ServerMsg.RoleAssigned, (msg: RoleAssignedPayload) => {
    useGameStore.getState().setMyRole(msg.role);
    useGameStore.getState().setSaboteurTeammates(msg.teammates || null);
  });

  room.onMessage(ServerMsg.CurrentExample, (msg: CurrentExamplePayload) => {
    useGameStore.getState().setCurrentExample(msg);
  });

  room.onMessage(ServerMsg.AccuracyAlert, (msg: AccuracyAlertPayload) => {
    useGameStore.getState().pushAccuracyAlert(msg);
  });

  room.onMessage(ServerMsg.CustomerResult, (msg: CustomerResultPayload) => {
    useGameStore.getState().pushCustomerEvent(msg);
  });

  room.onMessage(ServerMsg.GameEnded, (msg: GameEndedPayload) => {
    useGameStore.getState().setEndGame(msg);
  });

  room.onMessage(ServerMsg.Error, (msg: ErrorPayload) => {
    useGameStore.getState().pushError(msg.code, msg.message);
  });

  room.onMessage(ServerMsg.PoisonReady, () => {
    useGameStore.getState().setPoisonReady(true);
  });

  room.onMessage("chat", (msg: { from: string; text: string }) => {
    useGameStore
      .getState()
      .pushChat({ from: msg.from, text: msg.text, at: Date.now() });
  });

  room.onLeave(() => {
    useGameStore.getState().setRoom(null);
    useGameStore.getState().setState(null);
    useGameStore.getState().clearChat();
  });

  return room;
}

export async function createRoom(): Promise<Room<StarBiteState>> {
  const code = makeRoomCode();
  const room = await getClient().create<StarBiteState>("starbite", { code });
  return wireRoom(room);
}

export async function joinRoomByCode(code: string): Promise<Room<StarBiteState>> {
  const room = await getClient().join<StarBiteState>("starbite", {
    code: code.toUpperCase(),
  });
  return wireRoom(room);
}
