// Colyseus state schema. THIS IS THE SHARED WORLD STATE.
// Server mutates these objects; clients receive automatic delta sync via colyseus.js.
// Do NOT put secrets here (e.g., a player's role). Anything in this schema is visible to all clients.
//
// Usage:
//   server: new StarBiteState() and mutate it in GameRoom
//   client: room.state is auto-populated and reactive (subscribe via room.state.listen / onStateChange)
//
// Colyseus 0.16 / @colyseus/schema 3.x syntax.

import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

// ---------------------------------------------------------------
// Player
// ---------------------------------------------------------------

export class Player extends Schema {
  @type("string") sessionId: string = "";
  @type("string") name: string = "";
  @type("uint8") avatarId: number = 0;
  @type("number") x: number = 0;                    // tile coords (can be fractional during interpolation)
  @type("number") y: number = 0;
  @type("number") tx: number = 0;                   // server's current move target
  @type("number") ty: number = 0;
  @type("boolean") isAlive: boolean = true;         // false after ejection
  @type("string") currentStation: string = "";      // "" if walking the floor
  @type("boolean") isLingering: boolean = false;    // visual tell — saboteur poisoning, OR brief on every submit
  @type("number") poisonCooldownEndsAt: number = 0; // unix ms; relevant for saboteurs only, 0 = ready
  @type("boolean") connected: boolean = true;
  @type("boolean") isHost: boolean = false;
  // Revealed only when player is ejected OR game ends. "" otherwise.
  @type("string") revealedRole: string = "";
}

// ---------------------------------------------------------------
// Training data
// ---------------------------------------------------------------

export class LabelSubmission extends Schema {
  @type("string") id: string = "";
  @type("string") label: string = "";              // "rare" | "compost" | etc.
  @type("boolean") isCorrect: boolean = true;      // server-computed against ground truth
  @type("boolean") flagged: boolean = false;       // removed from training data if true
  @type("number") submittedAt: number = 0;         // unix ms
}

export class TrainingExample extends Schema {
  @type("string") id: string = "";
  @type("string") stationId: string = "";
  @type("string") contentId: string = "";          // ref into /content/*.json
  // Renderable display copied from content for client convenience (so clients
  // don't need to also load the content JSON).
  @type("string") emoji: string = "";
  @type("string") description: string = "";
  @type("string") name: string = "";
  @type([LabelSubmission]) submissions = new ArraySchema<LabelSubmission>();
  // Cached: server recomputes after each submission. -1 if no labels yet.
  @type("number") accuracy: number = -1;
}

export class Station extends Schema {
  @type("string") id: string = "";
  @type("string") stationType: string = "";        // "grill" | "trash" | "review"
  @type("number") x: number = 0;                   // tile coords
  @type("number") y: number = 0;
  @type([TrainingExample]) examples = new ArraySchema<TrainingExample>();
  // Aggregate accuracy across all examples (0–100). Updates after each submit.
  // 100 by default until the first label is submitted (model has no data → assume best-case for UI).
  @type("number") accuracy: number = 100;
  // Number of currently-occupying players (for cooldown / capacity feedback).
  @type("uint8") activePlayerCount: number = 0;
}

// ---------------------------------------------------------------
// Customer cycle
// ---------------------------------------------------------------

export class CustomerStationOutcome extends Schema {
  @type("string") stationId: string = "";
  @type("boolean") success: boolean = false;
  @type("number") rolledProbability: number = 0;
}

export class CustomerOrder extends Schema {
  @type("string") id: string = "";
  @type("string") customerName: string = "";
  @type("string") flavorText: string = "";
  @type(["string"]) requirementStations = new ArraySchema<string>(); // stationIds involved
  @type("string") outcome: string = "";            // "happy" | "confused" | "angry" | ""
  @type([CustomerStationOutcome]) perStation = new ArraySchema<CustomerStationOutcome>();
  @type("number") servedAt: number = 0;
}

// ---------------------------------------------------------------
// Meeting / voting
// ---------------------------------------------------------------

export class Vote extends Schema {
  @type("string") voterSessionId: string = "";
  @type("string") target: string = "";             // sessionId or "skip"
}

export class Meeting extends Schema {
  @type("string") calledBy: string = "";
  @type("string") phase: string = "discussion";    // "discussion" | "voting" | "results"
  @type("number") endsAt: number = 0;              // unix ms
  @type([Vote]) votes = new ArraySchema<Vote>();
  @type("string") result: string = "";             // sessionId of ejected player, or "skip", or ""
  @type(["string"]) readyToVote = new ArraySchema<string>(); // sessionIds of players ready to move to voting
  @type(["string"]) submittedVotes = new ArraySchema<string>(); // sessionIds of players who confirmed their vote
}

// ---------------------------------------------------------------
// Root state
// ---------------------------------------------------------------

export class StarBiteState extends Schema {
  @type("string") code: string = "";               // 4-letter room code
  @type("string") phase: string = "lobby";         // "lobby" | "playing" | "meeting" | "ended"
  @type("number") roundEndsAt: number = 0;         // unix ms
  @type("number") satisfaction: number = 100;      // 0..100
  @type("uint8") meetingsRemaining: number = 2;
  @type("string") winner: string = "";             // "crew" | "saboteurs" | ""
  @type("string") endReason: string = "";

  @type({ map: Player }) players = new MapSchema<Player>();
  @type({ map: Station }) stations = new MapSchema<Station>();
  // Recent customers (most recent at end). Capped on server side.
  @type([CustomerOrder]) customers = new ArraySchema<CustomerOrder>();
  @type(CustomerOrder) activeCustomer: CustomerOrder | undefined;
  @type(Meeting) meeting: Meeting | undefined;
}
