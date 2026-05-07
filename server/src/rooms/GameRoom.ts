// GameRoom — the authoritative server room for one Star Bite Diner game.
// All gameplay state mutations happen here.
//
// LIFECYCLE
//   onCreate   → build initial state, load content, schedule tick loop
//   onJoin     → add a Player to state
//   onMessage  → handle ClientMsg.* messages
//   tick       → 50ms loop: movement, customer cycle, round-end check, lingering cleanup
//   onLeave    → mark player disconnected (allow brief reconnection grace)
//   onDispose  → cleanup
//
// KEY DESIGN NOTE
//   `Player.role` is NOT in shared schema (everyone would see it).
//   We store it in `playerRoles: Map<sessionId, Role>` on the room (server-only),
//   and send `ServerMsg.RoleAssigned` privately to each player at game start.
//   `Player.revealedRole` is set on ejection / game end (legitimate reveal).

import { Room, Client } from "@colyseus/core";
import {
  StarBiteState,
  Player,
  Station,
  TrainingExample,
  LabelSubmission,
  CustomerOrder,
  CustomerStationOutcome,
  Meeting,
  Vote,
  ClientMsg,
  ServerMsg,
  STATIONS,
  STATION_LABELS,
  SPAWN_AREA,
  MIN_PLAYERS,
  MAX_PLAYERS,
  ROUND_DURATION_SEC,
  CUSTOMER_CYCLE_MS,
  FIRST_CUSTOMER_DELAY_MS,
  POISON_COOLDOWN_MS,
  POISON_LINGER_MS,
  NORMAL_SUBMIT_LINGER_MS,
  INITIAL_SATISFACTION,
  SATISFACTION_WIN_THRESHOLD,
  MAX_MEETINGS_PER_ROUND,
  MEETING_DISCUSSION_SEC,
  MEETING_VOTING_SEC,
  RECENT_SUBMISSIONS_TO_SHOW,
  MOVE_SPEED_TILES_PER_SEC,
  MAP_W,
  MAP_H,
  type Role,
  type SetProfilePayload,
  type MovePayload,
  type EnterStationPayload,
  type SubmitLabelPayload,
  type PoisonLabelPayload,
  type FlagSubmissionPayload,
  type RequestNewExamplePayload,
  type CastVotePayload,
  type VoteNowPayload,
  type CurrentExamplePayload,
  type RoleAssignedPayload,
  type CustomerResultPayload,
  type GameEndedPayload,
  type AccuracyAlertPayload,
  type GrillItem,
  type TrashItem,
  type OrderTemplate,
} from "starbite-shared";

import { makeRoomCode } from "../logic/codes.js";
import { assignRoles } from "../logic/roles.js";
import { computeExampleAccuracy, computeStationAccuracy } from "../logic/accuracy.js";
import { pickOrder, rollCustomerOutcome } from "../logic/customer.js";
import { loadContent, type ContentBundle } from "../content/loader.js";
import { logGameResult } from "../stats/index.js";

const TICK_MS = 50;

// Read STARBITE_TEST_* env vars to override gameplay timings. Used by smoke
// tests to exercise the full lifecycle in seconds instead of minutes. When a
// var is unset, we fall back to the constant from /shared.
function envInt(key: string, fallback: number): number {
  const v = process.env[key];
  if (!v) return fallback;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export class GameRoom extends Room<StarBiteState> {
  maxClients = MAX_PLAYERS;

  // server-only state
  private content!: ContentBundle;
  private playerRoles = new Map<string, Role>();
  private nextCustomerAt = 0;
  private nextExampleSerial = 0;
  private nextSubmissionSerial = 0;
  private lastFlagAt = new Map<string, number>(); // sessionId -> ts
  private currentExamplePerPlayer = new Map<string, string>(); // sessionId -> exampleId
  private accuracyHistory = new Map<string, Array<{ at: number; acc: number }>>(); // stationId -> recent samples
  private tickHandle: NodeJS.Timeout | null = null;
  private roundStartedAt = 0;

  // Effective timings (default = constants; overridden by env vars for tests)
  private readonly cfgRoundSec = envInt("STARBITE_TEST_ROUND_SEC", ROUND_DURATION_SEC);
  private readonly cfgCustomerMs = envInt("STARBITE_TEST_CUSTOMER_MS", CUSTOMER_CYCLE_MS);
  private readonly cfgFirstCustomerMs = envInt("STARBITE_TEST_FIRST_CUSTOMER_MS", FIRST_CUSTOMER_DELAY_MS);
  private readonly cfgMeetingDiscSec = envInt("STARBITE_TEST_MEETING_DISC_SEC", MEETING_DISCUSSION_SEC);
  private readonly cfgMeetingVoteSec = envInt("STARBITE_TEST_MEETING_VOTE_SEC", MEETING_VOTING_SEC);

  override async onCreate(options: { code?: string } = {}) {
    this.setState(new StarBiteState());
    // If client passed a code (host generates one when creating), use it; else make our own.
    this.state.code = (options.code ?? makeRoomCode()).toUpperCase().slice(0, 4);
    this.state.satisfaction = INITIAL_SATISFACTION;
    this.state.meetingsRemaining = MAX_MEETINGS_PER_ROUND;
    this.setMetadata({ code: this.state.code });

    // Build the static stations
    for (const def of STATIONS) {
      const s = new Station();
      s.id = def.id;
      s.stationType = def.type;
      s.x = def.x;
      s.y = def.y;
      this.state.stations.set(s.id, s);
    }

    this.content = await loadContent();

    // Wire up client messages
    this.onMessage(ClientMsg.SetProfile, (c, p: SetProfilePayload) => this.handleSetProfile(c, p));
    this.onMessage(ClientMsg.StartGame, (c) => this.handleStartGame(c));
    this.onMessage(ClientMsg.Move, (c, p: MovePayload) => this.handleMove(c, p));
    this.onMessage(ClientMsg.EnterStation, (c, p: EnterStationPayload) => this.handleEnterStation(c, p));
    this.onMessage(ClientMsg.LeaveStation, (c) => this.handleLeaveStation(c));
    this.onMessage(ClientMsg.SubmitLabel, (c, p: SubmitLabelPayload) => this.handleSubmit(c, p, false));
    this.onMessage(ClientMsg.PoisonLabel, (c, p: PoisonLabelPayload) => this.handleSubmit(c, p, true));
    this.onMessage(ClientMsg.FlagSubmission, (c, p: FlagSubmissionPayload) => this.handleFlag(c, p));
    this.onMessage(ClientMsg.RequestNewExample, (c, p: RequestNewExamplePayload) =>
      this.giveExampleToPlayer(c, p.stationId)
    );
    this.onMessage(ClientMsg.CallMeeting, (c) => this.handleCallMeeting(c));
    this.onMessage(ClientMsg.CastVote, (c, p: CastVotePayload) => this.handleCastVote(c, p));
    this.onMessage(ClientMsg.VoteNow, (c, p: VoteNowPayload) => this.handleVoteNow(c, p));
    this.onMessage(ClientMsg.ResetRound, (c) => this.handleResetRound(c));
    this.onMessage(ClientMsg.Chat, (c, p: { text: string }) => {
      // For MVP: simple broadcast. Sky's track can render this.
      this.broadcast("chat", { from: c.sessionId, text: String(p?.text ?? "").slice(0, 200) });
    });

    this.tickHandle = setInterval(() => this.tick(), TICK_MS);
    console.log(`[room ${this.state.code}] created`);
  }

  override onJoin(client: Client) {
    const player = new Player();
    player.sessionId = client.sessionId;
    player.name = `Player ${this.state.players.size + 1}`;
    player.avatarId = this.state.players.size % 6;
    // Spawn in spawn area
    player.x = SPAWN_AREA.x + Math.random() * SPAWN_AREA.w;
    player.y = SPAWN_AREA.y + Math.random() * SPAWN_AREA.h;
    player.tx = player.x;
    player.ty = player.y;
    player.connected = true;
    player.isHost = this.state.players.size === 0;
    this.state.players.set(client.sessionId, player);
    console.log(`[room ${this.state.code}] join ${client.sessionId} (host=${player.isHost})`);
  }

  override async onLeave(client: Client, consented: boolean) {
    const player = this.state.players.get(client.sessionId);
    if (!player) return;
    player.connected = false;

    if (consented || this.state.phase === "lobby") {
      this.removePlayer(client.sessionId);
      return;
    }
    // Allow short reconnect grace
    try {
      await this.allowReconnection(client, 20);
      const p = this.state.players.get(client.sessionId);
      if (p) p.connected = true;
    } catch {
      this.removePlayer(client.sessionId);
    }
  }

  override onDispose() {
    if (this.tickHandle) clearInterval(this.tickHandle);
    console.log(`[room ${this.state.code}] disposed`);
  }

  private removePlayer(sid: string) {
    const p = this.state.players.get(sid);
    if (!p) return;
    const wasHost = p.isHost;
    this.state.players.delete(sid);
    this.playerRoles.delete(sid);
    this.currentExamplePerPlayer.delete(sid);
    if (wasHost) this.reassignHost();
  }

  /**
   * Pick a connected, non-ejected player and make them the host. Clears the
   * isHost flag on everyone else first so we can never end up with two hosts.
   * Skips disconnected players (mid-reconnect grace) — handing host to one
   * would block "Start round" until their grace expired.
   */
  private reassignHost() {
    let next: Player | undefined;
    for (const player of this.state.players.values()) {
      player.isHost = false;
      if (!next && player.connected && player.isAlive) {
        next = player;
      }
    }
    if (next) next.isHost = true;
  }

  // ============================================================
  // Message handlers
  // ============================================================

  private handleSetProfile(client: Client, p: SetProfilePayload) {
    const player = this.state.players.get(client.sessionId);
    if (!player) return;
    if (typeof p?.name === "string") player.name = p.name.slice(0, 20).trim() || player.name;
    if (typeof p?.avatarId === "number") player.avatarId = Math.max(0, Math.min(5, Math.floor(p.avatarId)));
  }

  private handleStartGame(client: Client) {
    const player = this.state.players.get(client.sessionId);
    if (!player?.isHost) {
      this.sendError(client, "not_host", "Only the host can start the game.");
      return;
    }
    if (this.state.phase !== "lobby") return;
    if (this.state.players.size < MIN_PLAYERS) {
      this.sendError(client, "not_enough_players", `Need at least ${MIN_PLAYERS} players.`);
      return;
    }

    // Assign roles privately
    const sids = [...this.state.players.keys()];
    this.playerRoles = assignRoles(sids);

    // Collect saboteur team information for sharing among saboteurs
    const saboteurs = Array.from(this.playerRoles.entries())
      .filter(([_, role]) => role === "saboteur")
      .map(([sessionId, _]) => {
        const player = this.state.players.get(sessionId);
        return player ? { sessionId, name: player.name, avatarId: player.avatarId } : null;
      })
      .filter((p): p is { sessionId: string; name: string; avatarId: number } => p !== null);

    for (const [sid, role] of this.playerRoles) {
      const c = this.clients.find((cl) => cl.sessionId === sid);
      if (c) {
        const payload: RoleAssignedPayload = { role };
        // Include saboteur teammates if this player is a saboteur
        if (role === "saboteur") {
          payload.teammates = saboteurs.filter(s => s.sessionId !== sid);
        }
        c.send(ServerMsg.RoleAssigned, payload);
      }
    }

    this.state.phase = "playing";
    this.roundStartedAt = Date.now();
    this.state.roundEndsAt = this.roundStartedAt + this.cfgRoundSec * 1000;
    this.nextCustomerAt = Date.now() + this.cfgFirstCustomerMs;

    console.log(
      `[room ${this.state.code}] starting with ${sids.length} players, ` +
        `${[...this.playerRoles.values()].filter((r) => r === "saboteur").length} saboteurs`
    );
  }

  private handleResetRound(client: Client) {
    const player = this.state.players.get(client.sessionId);
    if (!player?.isHost) {
      this.sendError(client, "not_host", "Only the host can start a new round.");
      return;
    }
    if (this.state.phase !== "ended") {
      this.sendError(client, "not_ended", "Round has not ended yet.");
      return;
    }
    this.resetRound();
  }

  /**
   * Wipes per-round state and returns the room to the lobby phase. Players,
   * names, and avatars are kept; everything else is cleared. Called when the
   * host clicks "Play again" on the EndScreen.
   */
  private resetRound() {
    // Top-level state
    this.state.phase = "lobby";
    this.state.satisfaction = INITIAL_SATISFACTION;
    this.state.meetingsRemaining = MAX_MEETINGS_PER_ROUND;
    this.state.winner = "";
    this.state.endReason = "";
    this.state.roundEndsAt = 0;
    this.state.activeCustomer = undefined;
    this.state.customers.clear();
    this.state.meeting = undefined;

    // Per-station: clear examples and reset accuracy
    for (const station of this.state.stations.values()) {
      station.examples.clear();
      station.accuracy = 100;
      station.activePlayerCount = 0;
    }

    // Per-player: revive everyone, clear station, hide role, respawn
    for (const player of this.state.players.values()) {
      player.isAlive = true;
      player.currentStation = "";
      player.revealedRole = "";
      player.isLingering = false;
      player.poisonCooldownEndsAt = 0;
      player.x = SPAWN_AREA.x + Math.random() * SPAWN_AREA.w;
      player.y = SPAWN_AREA.y + Math.random() * SPAWN_AREA.h;
      player.tx = player.x;
      player.ty = player.y;
    }

    // Server-only state
    this.playerRoles.clear();
    this.lastFlagAt.clear();
    this.currentExamplePerPlayer.clear();
    this.accuracyHistory.clear();
    this.nextCustomerAt = 0;
    this.roundStartedAt = 0;

    console.log(`[room ${this.state.code}] round reset; back to lobby`);
  }

  private handleMove(client: Client, p: MovePayload) {
    const player = this.state.players.get(client.sessionId);
    if (!player || !player.isAlive) return;
    if (this.state.phase !== "playing") return;
    // Clamp to map bounds
    player.tx = Math.max(0, Math.min(MAP_W - 1, p.tx));
    player.ty = Math.max(0, Math.min(MAP_H - 1, p.ty));
  }

  private handleEnterStation(client: Client, p: EnterStationPayload) {
    const player = this.state.players.get(client.sessionId);
    const station = this.state.stations.get(p.stationId);
    if (!player || !station || !player.isAlive) return;
    if (this.state.phase !== "playing") return;

    // Proximity check: player must be within 1.5 tiles of station's interaction point.
    const dx = player.x - station.x;
    const dy = player.y - station.y;
    if (dx * dx + dy * dy > 2.25) {
      this.sendError(client, "too_far", "Walk closer to the station.");
      return;
    }

    if (player.currentStation) {
      const prev = this.state.stations.get(player.currentStation);
      if (prev) prev.activePlayerCount = Math.max(0, prev.activePlayerCount - 1);
    }
    player.currentStation = station.id;
    station.activePlayerCount += 1;

    // Hand them an example to label (or, if review station, send recent submissions)
    if (station.stationType === "review") {
      // Recent submissions are visible directly via state.stations sync — no extra message needed.
      // (Client reads station.examples and shows last N submissions.)
    } else {
      this.giveExampleToPlayer(client, station.id);
    }
  }

  private handleLeaveStation(client: Client) {
    const player = this.state.players.get(client.sessionId);
    if (!player) return;
    if (player.currentStation) {
      const station = this.state.stations.get(player.currentStation);
      if (station) station.activePlayerCount = Math.max(0, station.activePlayerCount - 1);
    }
    player.currentStation = "";
    this.currentExamplePerPlayer.delete(client.sessionId);
  }

  private handleSubmit(client: Client, p: SubmitLabelPayload | PoisonLabelPayload, isPoison: boolean) {
    const player = this.state.players.get(client.sessionId);
    const station = this.state.stations.get(p.stationId);
    if (!player || !station || !player.isAlive) return;
    if (this.state.phase !== "playing") return;
    if (player.currentStation !== station.id) {
      this.sendError(client, "not_at_station", "You're not at this station.");
      return;
    }

    if (isPoison) {
      const role = this.playerRoles.get(client.sessionId);
      if (role !== "saboteur") {
        this.sendError(client, "not_saboteur", "Only saboteurs can poison labels.");
        return;
      }
      if (Date.now() < player.poisonCooldownEndsAt) {
        this.sendError(client, "cooldown", "Poison ability still on cooldown.");
        return;
      }
    }

    const example = station.examples.find((e) => e.id === p.exampleId);
    if (!example) {
      this.sendError(client, "no_example", "That example doesn't exist anymore.");
      return;
    }

    // Determine ground truth from the content pool
    const groundTruth = this.lookupGroundTruth(station.stationType, example.contentId);
    const validLabels = STATION_LABELS[station.stationType as keyof typeof STATION_LABELS] ?? [];
    if (!validLabels.includes(p.label)) {
      this.sendError(client, "bad_label", "That label isn't valid for this station.");
      return;
    }

    const isCorrect = p.label === groundTruth;

    // Saboteur must actually submit a wrong label to count as poisoning (and pay cooldown)
    if (isPoison && isCorrect) {
      this.sendError(client, "label_was_correct", "Poison failed: you submitted the correct label.");
      return;
    }

    const submission = new LabelSubmission();
    submission.id = `s_${++this.nextSubmissionSerial}`;
    submission.label = p.label;
    submission.isCorrect = isCorrect;
    submission.flagged = false;
    submission.submittedAt = Date.now();
    example.submissions.push(submission);
    example.accuracy = computeExampleAccuracy(example);

    const oldStationAcc = station.accuracy;
    station.accuracy = computeStationAccuracy(station);
    this.recordAccuracySample(station.id, station.accuracy);
    this.maybeAlertAccuracyDrop(station.id, oldStationAcc, station.accuracy);

    // Immediate satisfaction feedback for label submissions
    // Provides responsive feedback while keeping main satisfaction tied to customer outcomes
    if (!isPoison) {
      if (isCorrect) {
        // Small reward for correct submissions
        this.state.satisfaction = Math.max(0, Math.min(100, this.state.satisfaction + 1));
      } else {
        // Small penalty for incorrect submissions
        this.state.satisfaction = Math.max(0, Math.min(100, this.state.satisfaction - 0.5));
      }
    }
    // Poison submissions don't give immediate satisfaction feedback

    // Visual tell: longer linger for poisoners
    player.isLingering = true;
    const lingerMs = isPoison ? POISON_LINGER_MS : NORMAL_SUBMIT_LINGER_MS;
    setTimeout(() => {
      const stillThere = this.state.players.get(client.sessionId);
      if (stillThere) stillThere.isLingering = false;
    }, lingerMs);

    if (isPoison) {
      player.poisonCooldownEndsAt = Date.now() + POISON_COOLDOWN_MS;
      setTimeout(() => {
        const c = this.clients.find((cl) => cl.sessionId === client.sessionId);
        if (c) c.send(ServerMsg.PoisonReady, {});
      }, POISON_COOLDOWN_MS);
    }

    // Hand them the next example
    this.giveExampleToPlayer(client, station.id);
  }

  private handleFlag(client: Client, p: FlagSubmissionPayload) {
    const player = this.state.players.get(client.sessionId);
    if (!player || !player.isAlive) return;
    if (player.currentStation === "" ) return;
    const station = this.state.stations.get(player.currentStation);
    if (!station || station.stationType !== "review") {
      this.sendError(client, "not_at_review", "Flagging happens at Review & Security.");
      return;
    }

    const last = this.lastFlagAt.get(client.sessionId) ?? 0;
    if (Date.now() - last < 8000) {
      this.sendError(client, "flag_cooldown", "Wait a few seconds before flagging again.");
      return;
    }

    // Find the submission across ALL stations (Review can audit any bot)
    let targetExample: TrainingExample | undefined;
    let targetStation: Station | undefined;
    let target: LabelSubmission | undefined;
    for (const s of this.state.stations.values()) {
      for (const ex of s.examples) {
        const sub = ex.submissions.find((sub) => sub.id === p.submissionId);
        if (sub) {
          target = sub;
          targetExample = ex;
          targetStation = s;
          break;
        }
      }
      if (target) break;
    }

    if (!target || !targetExample || !targetStation) {
      this.sendError(client, "no_submission", "That submission no longer exists.");
      return;
    }

    target.flagged = true;
    targetExample.accuracy = computeExampleAccuracy(targetExample);
    const oldAcc = targetStation.accuracy;
    targetStation.accuracy = computeStationAccuracy(targetStation);
    this.recordAccuracySample(targetStation.id, targetStation.accuracy);
    this.maybeAlertAccuracyDrop(targetStation.id, oldAcc, targetStation.accuracy);
    this.lastFlagAt.set(client.sessionId, Date.now());
  }

  private handleCallMeeting(client: Client) {
    const player = this.state.players.get(client.sessionId);
    if (!player?.isAlive) return;
    if (this.state.phase !== "playing") return;
    if (this.state.meetingsRemaining <= 0) {
      this.sendError(client, "no_meetings", "No emergency meetings left this round.");
      return;
    }
    this.state.meetingsRemaining -= 1;
    this.state.phase = "meeting";
    const m = new Meeting();
    m.calledBy = client.sessionId;
    m.phase = "discussion";
    m.endsAt = Date.now() + this.cfgMeetingDiscSec * 1000;
    this.state.meeting = m;
  }

  private handleCastVote(client: Client, p: CastVotePayload) {
    const m = this.state.meeting;
    if (!m || m.phase !== "voting") return;

    // Voter must exist and still be alive (ejected players don't get to vote).
    const voter = this.state.players.get(client.sessionId);
    if (!voter?.isAlive) {
      this.sendError(client, "cant_vote", "You can't vote — you've been ejected.");
      return;
    }

    // Target must be "skip" or a sessionId of a current alive player.
    if (p.target !== "skip") {
      const targetPlayer = this.state.players.get(p.target);
      if (!targetPlayer || !targetPlayer.isAlive) {
        this.sendError(client, "bad_target", "Vote target is not in the round.");
        return;
      }
    }

    const existing = m.votes.find((v) => v.voterSessionId === client.sessionId);
    if (existing) {
      existing.target = p.target;
    } else {
      const v = new Vote();
      v.voterSessionId = client.sessionId;
      v.target = p.target;
      m.votes.push(v);
    }

    // Check if everyone has voted - if so, end voting phase early
    const aliveCount = [...this.state.players.values()].filter(p => p.isAlive).length;
    if (m.votes.length >= aliveCount) {
      // Everyone has voted - immediately process results
      this.processMeetingResults(m);
    }
  }

  private handleVoteNow(client: Client, p: VoteNowPayload) {
    const m = this.state.meeting;
    if (!m || m.phase !== "discussion") return;

    // Only allow alive players to trigger vote now
    const player = this.state.players.get(client.sessionId);
    if (!player?.isAlive) return;

    // Immediately transition to voting phase
    m.phase = "voting";
    m.endsAt = Date.now() + this.cfgMeetingVoteSec * 1000;
    console.log(`[room ${this.state.code}] Player ${player.name} skipped discussion, moving to voting`);
  }

  private processMeetingResults(m: Meeting) {
    // Tally votes
    const tally = new Map<string, number>();
    for (const v of m.votes) {
      tally.set(v.target, (tally.get(v.target) ?? 0) + 1);
    }

    // Find the highest vote count
    let maxVotes = 0;
    for (const count of tally.values()) {
      if (count > maxVotes) maxVotes = count;
    }

    // Find all candidates with the highest vote count
    const winners = [];
    for (const [target, count] of tally) {
      if (count === maxVotes) {
        winners.push(target);
      }
    }

    // Determine result: tie if multiple winners, skip if no votes or skip wins, else eject the winner
    const tie = winners.length > 1;
    const topTarget = winners.length === 1 ? winners[0] : "skip";
    const ejected = tie || topTarget === "skip" ? "" : topTarget;

    m.result = tie || topTarget === "skip" ? "skip" : topTarget;
    m.phase = "results";
    m.endsAt = Date.now() + 5000;

    // Debug logging
    console.log(`[room ${this.state.code}] Vote results: ${JSON.stringify(Object.fromEntries(tally))}, maxVotes=${maxVotes}, winners=[${winners.join(",")}], tie=${tie}, ejected="${ejected}"`);

    if (ejected) {
      const target = this.state.players.get(ejected);
      if (target) {
        target.isAlive = false;
        target.revealedRole = this.playerRoles.get(ejected) ?? "trainer";
        console.log(`[room ${this.state.code}] Ejected player ${target.name} (${ejected}), role: ${target.revealedRole}`);
      } else {
        console.log(`[room ${this.state.code}] ERROR: Could not find player to eject: ${ejected}`);
      }
    } else {
      console.log(`[room ${this.state.code}] No ejection: ${tie ? "tie vote" : "skip vote won"}`);
    }
  }

  // ============================================================
  // Tick loop
  // ============================================================

  private tick() {
    if (this.state.phase === "playing") {
      this.tickMovement();
      this.tickCustomers();
      this.tickRoundEnd();
    } else if (this.state.phase === "meeting") {
      this.tickMeeting();
    }
  }

  private tickMovement() {
    const dt = TICK_MS / 1000;
    const maxStep = MOVE_SPEED_TILES_PER_SEC * dt;
    for (const p of this.state.players.values()) {
      if (!p.isAlive || !p.connected) continue;
      const dx = p.tx - p.x;
      const dy = p.ty - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 0.001) continue;
      if (dist <= maxStep) {
        p.x = p.tx;
        p.y = p.ty;
      } else {
        p.x += (dx / dist) * maxStep;
        p.y += (dy / dist) * maxStep;
      }
    }
  }

  private tickCustomers() {
    if (Date.now() < this.nextCustomerAt) return;
    this.serveCustomer();
    this.nextCustomerAt = Date.now() + this.cfgCustomerMs;
  }

  private tickRoundEnd() {
    if (this.state.satisfaction <= 0) {
      this.endGame("saboteurs", "satisfaction_zero");
      return;
    }
    if (Date.now() >= this.state.roundEndsAt) {
      const aliveSaboteurs = [...this.state.players.entries()].filter(
        ([sid, p]) => p.isAlive && this.playerRoles.get(sid) === "saboteur"
      );
      if (aliveSaboteurs.length === 0) {
        this.endGame("crew", "all_saboteurs_ejected");
      } else if (this.state.satisfaction >= SATISFACTION_WIN_THRESHOLD) {
        this.endGame("crew", "satisfaction_threshold");
      } else {
        this.endGame("saboteurs", "timer_with_saboteurs");
      }
    }
  }

  private tickMeeting() {
    const m = this.state.meeting;
    if (!m) return;
    if (Date.now() < m.endsAt) return;

    if (m.phase === "discussion") {
      m.phase = "voting";
      m.endsAt = Date.now() + this.cfgMeetingVoteSec * 1000;
      return;
    }
    if (m.phase === "voting") {
      // Voting time expired - process results
      this.processMeetingResults(m);
      return;
    }
    // Results phase done — return to playing
    this.state.meeting = undefined;
    this.state.phase = "playing";

    // Check immediate win condition: all saboteurs ejected
    const aliveSaboteurs = [...this.state.players.entries()].filter(
      ([sid, p]) => p.isAlive && this.playerRoles.get(sid) === "saboteur"
    );
    if (aliveSaboteurs.length === 0 && this.playerRoles.size > 0) {
      this.endGame("crew", "all_saboteurs_ejected");
    }
  }

  // ============================================================
  // Helpers
  // ============================================================

  private serveCustomer() {
    const picked = pickOrder(this.content.orders, this.content.customers);
    if (!picked) return;
    const { order, customer } = picked;
    const rolled = rollCustomerOutcome(order, (id) => this.state.stations.get(id));

    const co = new CustomerOrder();
    co.id = `c_${Date.now()}`;
    co.customerName = customer.name ?? order.customerName;
    co.flavorText = order.flavorText;
    for (const r of order.requirements) co.requirementStations.push(r.stationId);
    for (const ps of rolled.perStation) {
      const out = new CustomerStationOutcome();
      out.stationId = ps.stationId;
      out.success = ps.success;
      out.rolledProbability = ps.rolledProbability;
      co.perStation.push(out);
    }
    co.outcome = rolled.outcome;
    co.servedAt = Date.now();

    this.state.activeCustomer = co;
    // Cap recent customer history
    this.state.customers.push(co);
    while (this.state.customers.length > 8) this.state.customers.shift();

    this.state.satisfaction = Math.max(0, Math.min(100, this.state.satisfaction + rolled.satisfactionDelta));

    this.broadcast(ServerMsg.CustomerResult, {
      orderId: co.id,
      customerName: co.customerName,
      outcome: rolled.outcome,
      perStation: rolled.perStation,
    } satisfies CustomerResultPayload);
  }

  private giveExampleToPlayer(client: Client, stationId: string) {
    const station = this.state.stations.get(stationId);
    if (!station || station.stationType === "review") return;

    const pool = station.stationType === "grill" ? this.content.grill : this.content.trash;
    if (pool.length === 0) {
      this.sendError(client, "no_content", "No examples loaded for this station.");
      return;
    }

    // Pick a content item — for MVP, random with avoidance of immediate repeats.
    const previousId = this.currentExamplePerPlayer.get(client.sessionId);
    let attempts = 0;
    let pick: GrillItem | TrashItem;
    do {
      pick = pool[Math.floor(Math.random() * pool.length)];
      attempts++;
    } while (pick.id === previousId && attempts < 5);

    // Create or reuse a TrainingExample for this content item at this station.
    let example = station.examples.find((e) => e.contentId === pick.id);
    if (!example) {
      example = new TrainingExample();
      example.id = `ex_${++this.nextExampleSerial}`;
      example.stationId = station.id;
      example.contentId = pick.id;
      example.emoji = (pick as any).emoji ?? "";
      example.description = (pick as any).description ?? "";
      example.name = (pick as any).name ?? "";
      example.accuracy = -1;
      station.examples.push(example);
      // Cap stored examples per station to avoid unbounded growth
      while (station.examples.length > 40) station.examples.shift();
    }

    this.currentExamplePerPlayer.set(client.sessionId, example.id);

    const stationLabels = STATION_LABELS[station.stationType as keyof typeof STATION_LABELS] ?? [];
    client.send(ServerMsg.CurrentExample, {
      stationId,
      exampleId: example.id,
      contentId: pick.id,
      display: {
        emoji: (pick as any).emoji,
        description: (pick as any).description,
        name: (pick as any).name,
      },
      labelOptions: stationLabels,
    } satisfies CurrentExamplePayload);
  }

  private lookupGroundTruth(stationType: string, contentId: string): string {
    if (stationType === "grill") {
      return this.content.grill.find((g) => g.id === contentId)?.groundTruth ?? "";
    }
    if (stationType === "trash") {
      return this.content.trash.find((t) => t.id === contentId)?.groundTruth ?? "";
    }
    return "";
  }

  private recordAccuracySample(stationId: string, acc: number) {
    const arr = this.accuracyHistory.get(stationId) ?? [];
    arr.push({ at: Date.now(), acc });
    // Keep last 30s
    while (arr.length && arr[0].at < Date.now() - 30_000) arr.shift();
    this.accuracyHistory.set(stationId, arr);
  }

  private maybeAlertAccuracyDrop(stationId: string, oldAcc: number, newAcc: number) {
    // Don't send accuracy alerts during lobby phase, first minute of gameplay, or if game just started
    if (this.state.phase !== "playing") return;
    if (Date.now() - this.roundStartedAt < 60000) return; // No alerts for first minute
    if (oldAcc === 100) return; // Never alert when starting from 100% (fresh game)

    if (oldAcc - newAcc >= 15) {
      // Debug: log accuracy alert details
      const currentDisplayed = this.state.stations.get(stationId)?.accuracy ?? 0;
      console.log(`[room ${this.state.code}] Accuracy alert for ${stationId}: oldAcc=${oldAcc}%, newAcc=${newAcc}%, currentDisplayed=${currentDisplayed}%, drop=${oldAcc - newAcc}%`);

      this.broadcast(ServerMsg.AccuracyAlert, {
        stationId,
        oldAccuracy: oldAcc,
        newAccuracy: newAcc,
      } satisfies AccuracyAlertPayload);
    }
  }

  private endGame(winner: "crew" | "saboteurs", reason: GameEndedPayload["reason"]) {
    if (this.state.phase === "ended") return;
    this.state.phase = "ended";
    this.state.winner = winner;
    this.state.endReason = reason;

    // Reveal all roles
    const roles: GameEndedPayload["roles"] = [];
    for (const [sid, player] of this.state.players) {
      const role = this.playerRoles.get(sid) ?? "trainer";
      player.revealedRole = role;
      roles.push({ sessionId: sid, name: player.name, role });
    }
    this.broadcast(ServerMsg.GameEnded, {
      winner,
      reason,
      finalSatisfaction: this.state.satisfaction,
      roles,
    } satisfies GameEndedPayload);

    // Hand off a record of the round to the stats module (Shreya's track).
    const endedAt = Date.now();
    const customers = [...this.state.customers];
    const finalAccuracies: { [stationId: string]: number } = {};
    for (const [id, station] of this.state.stations) {
      finalAccuracies[id] = station.accuracy;
    }
    logGameResult({
      code: this.state.code,
      startedAt: this.roundStartedAt,
      endedAt,
      durationSec: this.roundStartedAt
        ? Math.round((endedAt - this.roundStartedAt) / 1000)
        : 0,
      winner,
      endReason: reason,
      finalSatisfaction: this.state.satisfaction,
      numPlayers: this.state.players.size,
      numSaboteurs: [...this.playerRoles.values()].filter(
        (r) => r === "saboteur"
      ).length,
      numEjections: [...this.state.players.values()].filter((p) => !p.isAlive)
        .length,
      customersServed: customers.length,
      customersHappy: customers.filter((c) => c.outcome === "happy").length,
      customersConfused: customers.filter((c) => c.outcome === "confused")
        .length,
      customersAngry: customers.filter((c) => c.outcome === "angry").length,
      finalAccuracies,
    });
  }

  private sendError(client: Client, code: string, message: string) {
    client.send(ServerMsg.Error, { code, message });
  }
}
