// Star Bite Diner - Game constants
// All gameplay tuning values live here. Both server and client read from this file.

export const ROUND_DURATION_SEC = 360;            // 6 minutes
export const CUSTOMER_CYCLE_MS = 30_000;          // every 30s a customer is served
export const FIRST_CUSTOMER_DELAY_MS = 25_000;    // grace period at game start
export const POISON_COOLDOWN_MS = 12_000;
export const POISON_LINGER_MS = 1_000;            // visual tell duration
export const NORMAL_SUBMIT_LINGER_MS = 250;       // slight delay even on correct labels (so saboteurs don't have to fake)

export const INITIAL_SATISFACTION = 100;
export const SATISFACTION_WIN_THRESHOLD = 85;     // crew wins if >= this when timer ends
export const SATISFACTION_HAPPY_GAIN = 4;
export const SATISFACTION_CONFUSED_LOSS = -6;
export const SATISFACTION_ANGRY_LOSS = -14;

export const MAX_MEETINGS_PER_ROUND = 2;
export const MEETING_DISCUSSION_SEC = 60; // 1 minute discussion
export const MEETING_VOTING_SEC = 30;

export const FLAG_COOLDOWN_MS = 8_000;            // per-player cooldown on flagging at Review
export const RECENT_SUBMISSIONS_TO_SHOW = 10;     // at Review station

export const MIN_PLAYERS = 5;
export const MAX_PLAYERS = 10;

// Saboteur count by total player count (per design doc)
export const SABOTEUR_COUNTS: Record<number, number> = {
  5: 2,
  6: 2,
  7: 3,
  8: 3,
  9: 3,
  10: 4,
};

// Map dimensions in tiles. Each tile = 48px on screen.
export const TILE_PX = 48;
export const MAP_W = 24;
export const MAP_H = 14;

// Movement: tile-based, server-authoritative. Player picks tile to walk to, server interpolates.
export const MOVE_SPEED_TILES_PER_SEC = 4.0;

// Station definitions. Position in tile coordinates.
// Station type maps to which content pool / mini-game UI to use.
export type StationType = "grill" | "trash" | "review";

export interface StationDef {
  id: string;
  type: StationType;
  label: string;
  // tile coords of the interaction point
  x: number;
  y: number;
  // tile coords of the visual "footprint" (so map renderer can draw the counter)
  footprint: { x: number; y: number; w: number; h: number };
}

export const STATIONS: StationDef[] = [
  {
    id: "grill",
    type: "grill",
    label: "Grill Bot",
    x: 5,
    y: 4,
    footprint: { x: 4, y: 3, w: 3, h: 2 },
  },
  {
    id: "trash",
    type: "trash",
    label: "Trash Sorter",
    x: 18,
    y: 4,
    footprint: { x: 17, y: 3, w: 3, h: 2 },
  },
  {
    id: "review",
    type: "review",
    label: "Review & Security",
    x: 12,
    y: 10,
    footprint: { x: 11, y: 9, w: 3, h: 2 },
  },
];

// Spawn area for new players (they appear here when game starts)
export const SPAWN_AREA = { x: 11, y: 6, w: 2, h: 2 };

// Possible label values per station type. Used for validation + UI rendering.
export const STATION_LABELS: Record<StationType, string[]> = {
  grill: ["rare", "done"],                          // binary
  trash: ["recycle", "compost", "landfill"],        // 3-class
  review: [],                                       // review has no labels — it's an audit station
};

// Accuracy alert: trigger banner when station accuracy drops by this much in a 10s window
export const ACCURACY_ALERT_DROP = 15;

// Customer outcome thresholds based on overall fulfillment probability roll
// outcome = "happy" if all stations succeed, "confused" if 1 fails, "angry" if 2+ fail
// (The exact rule is in server logic; this is just the constant table.)
export const CUSTOMER_OUTCOME = {
  HAPPY: "happy",
  CONFUSED: "confused",
  ANGRY: "angry",
} as const;

export type CustomerOutcome = (typeof CUSTOMER_OUTCOME)[keyof typeof CUSTOMER_OUTCOME];
