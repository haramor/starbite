// Types for the stats / game history module.
// One GameRecord is written every time a round ends.

export interface GameRecord {
  /** 4-letter room code, e.g. "STAR". */
  code: string;
  /** Unix ms when the round started. */
  startedAt: number;
  /** Unix ms when the round ended. */
  endedAt: number;
  /** How long the round actually lasted, in seconds. */
  durationSec: number;
  /** Who won. */
  winner: "crew" | "saboteurs";
  /** Why it ended (see GameEndedPayload reasons in shared/protocol.ts). */
  endReason: string;
  /** Final customer satisfaction percentage at end of round. */
  finalSatisfaction: number;
  /** How many people were in the round. */
  numPlayers: number;
  /** How many of those were saboteurs. */
  numSaboteurs: number;
  /** How many players were voted out before the round ended. */
  numEjections: number;
  /** How many customer cycles ran during the round. */
  customersServed: number;
  /** How many of those customers were happy. */
  customersHappy: number;
  /** How many were confused. */
  customersConfused: number;
  /** How many were angry. */
  customersAngry: number;
  /** Final accuracy percentage per station, e.g. { grill: 75, trash: 90, review: 100 }. */
  finalAccuracies: { [stationId: string]: number };
}
