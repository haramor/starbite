// Network protocol — message names and payload types.
// THE source of truth between client and server. Both Hara's and Sky's
// Claude sessions code against this file. If you change a message, you must
// update both server handler and client sender in the same commit.

// ============================================================
// CLIENT → SERVER MESSAGES
// ============================================================
// Sent via room.send(MessageType, payload) from the client.
// Handlers live in server/src/rooms/GameRoom.ts.

export const ClientMsg = {
  /** Set display name + avatar. Sent once after joining, before game starts. */
  SetProfile: "set_profile",
  /** Host clicks "Start" in lobby. Server validates min players and assigns roles. */
  StartGame: "start_game",
  /** Continuous movement input. Server clamps to map bounds and validates speed. */
  Move: "move",
  /** Player walked into a station's interaction zone and pressed E. */
  EnterStation: "enter_station",
  /** Player walked away or pressed Esc. */
  LeaveStation: "leave_station",
  /** Submit a label for the current example at a station. */
  SubmitLabel: "submit_label",
  /** Saboteur intentionally submits a wrong label. Server enforces cooldown. */
  PoisonLabel: "poison_label",
  /** At Review station: mark a previous submission as suspicious. Removes it from the model. */
  FlagSubmission: "flag_submission",
  /** At a labeling station: ask for the next example to label. */
  RequestNewExample: "request_new_example",
  /** Anyone can call an emergency meeting (limited per round). */
  CallMeeting: "call_meeting",
  /** During a meeting's voting phase. */
  CastVote: "cast_vote",
  /** Player indicates they're ready to move from discussion to voting phase. */
  ReadyToVote: "ready_to_vote",
  /** Player confirms their final vote choice during voting phase. */
  SubmitVote: "submit_vote",
  /** Player wants to quit/leave the current meeting. */
  QuitDiscussion: "quit_discussion",
  /** Lobby chat / in-meeting chat. */
  Chat: "chat",
  /** Host clicks "Play again" on the EndScreen — wipe per-round state, return to lobby. */
  ResetRound: "reset_round",
} as const;

export type ClientMsg = (typeof ClientMsg)[keyof typeof ClientMsg];

export interface SetProfilePayload {
  name: string;
  avatarId: number;
}

export interface MovePayload {
  // Tile-space target. Server moves the player toward this each tick.
  tx: number;
  ty: number;
}

export interface EnterStationPayload {
  stationId: string;
}

export interface SubmitLabelPayload {
  stationId: string;
  exampleId: string;          // matches the example currently showing in the player's UI
  label: string;              // one of STATION_LABELS[stationType]
}

export interface PoisonLabelPayload {
  stationId: string;
  exampleId: string;
  label: string;              // intentionally wrong; server verifies it's actually wrong
}

export interface FlagSubmissionPayload {
  submissionId: string;
}

export interface RequestNewExamplePayload {
  stationId: string;
}

export interface CastVotePayload {
  // sessionId of player you're voting to eject, or "skip"
  target: string;
}

export interface ReadyToVotePayload {
  // empty — just a signal that player is ready to move to voting
}

export interface SubmitVotePayload {
  // sessionId of player you're voting to eject, or "skip"
  target: string;
}

export interface QuitDiscussionPayload {
  // empty — player wants to leave the meeting
}

export interface ChatPayload {
  text: string;
}

// ============================================================
// SERVER → CLIENT MESSAGES (one-shot — most state is via Schema sync)
// ============================================================

export const ServerMsg = {
  /** Sent privately to each player at game start. Contains their secret role. */
  RoleAssigned: "role_assigned",
  /** Sent privately when a player enters a station — gives them an example to label. */
  CurrentExample: "current_example",
  /** Banner trigger — accuracy at a station dropped sharply. */
  AccuracyAlert: "accuracy_alert",
  /** Customer cycle outcome — drives client animation. */
  CustomerResult: "customer_result",
  /** Game ended. */
  GameEnded: "game_ended",
  /** Generic error feedback for the client. */
  Error: "error",
  /** Saboteur cooldown finished. */
  PoisonReady: "poison_ready",
} as const;

export type ServerMsg = (typeof ServerMsg)[keyof typeof ServerMsg];

export type Role = "trainer" | "saboteur";
export type Phase = "lobby" | "playing" | "meeting" | "ended";

export interface RoleAssignedPayload {
  role: Role;
}

// What a player sees when they're at a station and need to label an example.
// `groundTruth` is OMITTED — client doesn't know the answer (that's the whole point).
export interface CurrentExamplePayload {
  stationId: string;
  exampleId: string;
  contentId: string;
  // The renderable item (emoji + description, or imageUrl). Comes straight from /content/*.json.
  display: {
    emoji?: string;
    description?: string;
    name?: string;
    imageUrl?: string;
  };
  // Available label choices for this station type.
  labelOptions: string[];
}

export interface AccuracyAlertPayload {
  stationId: string;
  oldAccuracy: number;
  newAccuracy: number;
}

export interface CustomerResultPayload {
  orderId: string;
  customerName: string;
  outcome: "happy" | "confused" | "angry";
  // Per-station: did the bot get it right for this customer?
  perStation: Array<{ stationId: string; success: boolean; rolledProbability: number }>;
}

export interface GameEndedPayload {
  winner: "crew" | "saboteurs";
  reason: "satisfaction_threshold" | "satisfaction_zero" | "all_saboteurs_ejected" | "timer_with_saboteurs";
  finalSatisfaction: number;
  // Reveal all roles
  roles: Array<{ sessionId: string; name: string; role: Role }>;
}

export interface ErrorPayload {
  code: string;
  message: string;
}

export interface PoisonReadyPayload {
  // empty — just a signal
}

// ============================================================
// Helper: payload type lookup keyed by message name
// ============================================================
// Lets server handlers use: room.onMessage<ClientPayload<typeof ClientMsg.SubmitLabel>>(...)
// (Not strictly required, but helps prevent typo-payloads.)

export interface ClientPayloadMap {
  [ClientMsg.SetProfile]: SetProfilePayload;
  [ClientMsg.StartGame]: Record<string, never>;
  [ClientMsg.Move]: MovePayload;
  [ClientMsg.EnterStation]: EnterStationPayload;
  [ClientMsg.LeaveStation]: Record<string, never>;
  [ClientMsg.SubmitLabel]: SubmitLabelPayload;
  [ClientMsg.PoisonLabel]: PoisonLabelPayload;
  [ClientMsg.FlagSubmission]: FlagSubmissionPayload;
  [ClientMsg.RequestNewExample]: RequestNewExamplePayload;
  [ClientMsg.CallMeeting]: Record<string, never>;
  [ClientMsg.CastVote]: CastVotePayload;
  [ClientMsg.ReadyToVote]: ReadyToVotePayload;
  [ClientMsg.SubmitVote]: SubmitVotePayload;
  [ClientMsg.QuitDiscussion]: QuitDiscussionPayload;
  [ClientMsg.Chat]: ChatPayload;
  [ClientMsg.ResetRound]: Record<string, never>;
}

export interface ServerPayloadMap {
  [ServerMsg.RoleAssigned]: RoleAssignedPayload;
  [ServerMsg.CurrentExample]: CurrentExamplePayload;
  [ServerMsg.AccuracyAlert]: AccuracyAlertPayload;
  [ServerMsg.CustomerResult]: CustomerResultPayload;
  [ServerMsg.GameEnded]: GameEndedPayload;
  [ServerMsg.Error]: ErrorPayload;
  [ServerMsg.PoisonReady]: PoisonReadyPayload;
}
