// End-to-end smoke test for Star Bite Diner.
// Spins up 5 colyseus.js clients and exercises the full game lifecycle:
// lobby → playing → customer cycle → meeting/vote/ejection → round end → stats.
//
// Run:    node scripts/smoke-test.mjs
// Requires server running on localhost:2567. For fast runs, set:
//   STARBITE_TEST_ROUND_SEC=20
//   STARBITE_TEST_FIRST_CUSTOMER_MS=3000
//   STARBITE_TEST_CUSTOMER_MS=3000
//   STARBITE_TEST_MEETING_DISC_SEC=2
//   STARBITE_TEST_MEETING_VOTE_SEC=2

import { Client } from "colyseus.js";

const URL = process.env.STARBITE_URL ?? "ws://localhost:2567";
const HEALTH_URL = URL.replace(/^ws/, "http") + "/health";
const STATS_URL = URL.replace(/^ws/, "http") + "/stats/games";
const NUM_PLAYERS = 5;
const ROOM_CODE = `T${Math.floor(Math.random() * 900 + 100)}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let pass = 0;
let fail = 0;
function check(label, cond, detail) {
  if (cond) {
    console.log(`  ✓ ${label}`);
    pass++;
  } else {
    console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
    fail++;
  }
}

// suppress noisy "onMessage() not registered for ..." warnings in colyseus.js
function silenceUnregistered(room) {
  for (const t of [
    "accuracy_alert",
    "customer_result",
    "current_example",
    "role_assigned",
    "poison_ready",
    "error",
    "chat",
    "game_ended",
  ]) {
    room.onMessage(t, () => {});
  }
}

async function main() {
  console.log(`\n[1] HEALTH CHECK`);
  const health = await fetch(HEALTH_URL).then((r) => r.json());
  check("server is up (/health responds)", health.ok === true);

  // Snapshot stats so we can verify a NEW record arrives later (server may have
  // accumulated records from prior runs)
  const statsBefore = await fetch(STATS_URL).then((r) => r.json());
  const recordsBefore = statsBefore.games.length;

  console.log(`\n[2] CONNECTING ${NUM_PLAYERS} CLIENTS (room ${ROOM_CODE})`);
  const host = new Client(URL);
  const hostRoom = await host.create("starbite", { code: ROOM_CODE });
  silenceUnregistered(hostRoom);

  const joiners = [];
  for (let i = 0; i < NUM_PLAYERS - 1; i++) {
    const c = new Client(URL);
    const r = await c.join("starbite", { code: ROOM_CODE });
    silenceUnregistered(r);
    joiners.push({ client: c, room: r });
    await sleep(40);
  }
  await sleep(800);
  check(`host sees ${NUM_PLAYERS} players`, hostRoom.state.players.size === NUM_PLAYERS);
  check(`phase is lobby`, hostRoom.state.phase === "lobby");
  let hostFlags = 0;
  for (const p of hostRoom.state.players.values()) if (p.isHost) hostFlags++;
  check(`exactly 1 host flag`, hostFlags === 1);

  console.log(`\n[3] STARTING ROUND`);
  // Wire role-assignment listeners on every client BEFORE starting
  const roles = new Map();
  hostRoom.onMessage("role_assigned", (msg) => roles.set(hostRoom.sessionId, msg.role));
  for (const j of joiners) {
    j.room.onMessage("role_assigned", (msg) => roles.set(j.room.sessionId, msg.role));
  }
  // Wire game-ended listener
  let gameEnded = null;
  hostRoom.onMessage("game_ended", (msg) => {
    gameEnded = msg;
  });

  hostRoom.send("start_game", {});
  await sleep(800);
  check(`phase=playing`, hostRoom.state.phase === "playing");
  check(`all ${NUM_PLAYERS} got a role`, roles.size === NUM_PLAYERS);
  check(`saboteur count is 2 (5p rule)`, [...roles.values()].filter((r) => r === "saboteur").length === 2);

  console.log(`\n[4] CUSTOMER CYCLE (waiting up to 6s for first customer)`);
  const satisfactionBefore = hostRoom.state.satisfaction;
  let waited = 0;
  while (waited < 6000) {
    if (hostRoom.state.activeCustomer && hostRoom.state.customers.length > 0) break;
    await sleep(200);
    waited += 200;
  }
  check(`a customer arrived`, !!hostRoom.state.activeCustomer);
  check(`customers history has at least 1 entry`, hostRoom.state.customers.length >= 1);
  if (hostRoom.state.activeCustomer) {
    const c = hostRoom.state.activeCustomer;
    check(
      `customer has an outcome (happy/confused/angry)`,
      ["happy", "confused", "angry"].includes(c.outcome)
    );
    console.log(
      `    customer ${c.customerName}: ${c.outcome} (satisfaction ${satisfactionBefore}→${hostRoom.state.satisfaction})`
    );
  }

  console.log(`\n[5] MEETING + VOTE + EJECTION`);
  // Pick a target (any joiner)
  const target = joiners[0].room.sessionId;
  const targetName = hostRoom.state.players.get(target)?.name ?? target;

  joiners[1].room.send("call_meeting", {});
  await sleep(400);
  check(`phase=meeting`, hostRoom.state.phase === "meeting");
  check(`meeting object exists`, !!hostRoom.state.meeting);
  check(
    `meeting starts in discussion phase`,
    hostRoom.state.meeting?.phase === "discussion"
  );

  // Wait through discussion phase (default test = 2s) into voting
  await sleep(2400);
  check(
    `meeting transitions to voting`,
    hostRoom.state.meeting?.phase === "voting"
  );

  // Everyone votes for target
  hostRoom.send("cast_vote", { target });
  for (const j of joiners) j.room.send("cast_vote", { target });
  await sleep(500);
  check(
    `votes registered`,
    hostRoom.state.meeting?.votes?.length === NUM_PLAYERS
  );

  // Wait through voting phase + results
  await sleep(2700);
  const ejected = hostRoom.state.players.get(target);
  check(`target is no longer alive`, ejected?.isAlive === false);
  check(
    `target's role is revealed`,
    ejected?.revealedRole === "trainer" || ejected?.revealedRole === "saboteur"
  );
  console.log(`    ejected ${targetName} (was a ${ejected?.revealedRole})`);

  // Wait briefly for results phase to end and game to either resume or end (if all saboteurs ejected)
  await sleep(5500);
  check(
    `phase is playing or ended after meeting resolves`,
    hostRoom.state.phase === "playing" || hostRoom.state.phase === "ended"
  );

  console.log(`\n[6] WAITING FOR ROUND END (up to 30s)`);
  let roundWaited = 0;
  while (roundWaited < 30000) {
    if (hostRoom.state.phase === "ended") break;
    await sleep(500);
    roundWaited += 500;
  }
  check(`phase=ended`, hostRoom.state.phase === "ended");
  check(`game_ended message received`, gameEnded !== null);
  if (gameEnded) {
    check(`winner is crew or saboteurs`, ["crew", "saboteurs"].includes(gameEnded.winner));
    check(`final satisfaction is a number`, typeof gameEnded.finalSatisfaction === "number");
    check(`role reveal includes all ${NUM_PLAYERS} players`, gameEnded.roles?.length === NUM_PLAYERS);
    console.log(
      `    ${gameEnded.winner} won (${gameEnded.reason}); satisfaction=${gameEnded.finalSatisfaction}`
    );
  }

  console.log(`\n[7] STATS PERSISTENCE`);
  await sleep(300);
  const statsAfter = await fetch(STATS_URL).then((r) => r.json());
  check(
    `stats endpoint has +1 record`,
    statsAfter.games.length === recordsBefore + 1,
    `before=${recordsBefore}, after=${statsAfter.games.length}`
  );
  if (statsAfter.games.length > recordsBefore) {
    const r = statsAfter.games[0]; // newest first
    check(`new record has the right room code`, r.code === ROOM_CODE);
    check(`record has numPlayers=${NUM_PLAYERS}`, r.numPlayers === NUM_PLAYERS);
    check(`record has finalAccuracies for stations`, !!r.finalAccuracies && Object.keys(r.finalAccuracies).length >= 2);
    check(`record durationSec is positive`, r.durationSec > 0);
  }

  console.log(`\n[8] RESET ROUND (host clicks "Play again")`);
  // Host calls reset_round; should wipe per-round state and return to lobby.
  hostRoom.send("reset_round", {});
  await sleep(600);
  check(`phase=lobby after reset`, hostRoom.state.phase === "lobby");
  check(`satisfaction reset to 100`, hostRoom.state.satisfaction === 100);
  check(`meetingsRemaining reset to 2`, hostRoom.state.meetingsRemaining === 2);
  check(`winner cleared`, hostRoom.state.winner === "");
  check(`customers cleared`, hostRoom.state.customers.length === 0);
  check(`activeCustomer cleared`, !hostRoom.state.activeCustomer);
  check(`meeting cleared`, !hostRoom.state.meeting);
  // All players revived
  let aliveCount = 0;
  let withRevealedRole = 0;
  for (const p of hostRoom.state.players.values()) {
    if (p.isAlive) aliveCount++;
    if (p.revealedRole) withRevealedRole++;
  }
  check(`all ${NUM_PLAYERS} players revived`, aliveCount === NUM_PLAYERS);
  check(`no revealed roles after reset`, withRevealedRole === 0);
  // Stations cleared
  let totalExamples = 0;
  for (const s of hostRoom.state.stations.values()) {
    totalExamples += s.examples.length;
  }
  check(`all station examples cleared`, totalExamples === 0);
  // exactly 1 host (invariant should still hold)
  let hostFlagsAfter = 0;
  for (const p of hostRoom.state.players.values()) if (p.isHost) hostFlagsAfter++;
  check(`exactly 1 host after reset`, hostFlagsAfter === 1);

  console.log(`\n[9] PLAY ANOTHER ROUND (verify reset is fully clean)`);
  // Wire up a fresh role-assignment listener (the previous one is still attached but in a stale closure)
  const roles2 = new Map();
  hostRoom.onMessage("role_assigned", (msg) => roles2.set(hostRoom.sessionId, msg.role));
  for (const j of joiners) {
    j.room.onMessage("role_assigned", (msg) => roles2.set(j.room.sessionId, msg.role));
  }
  hostRoom.send("start_game", {});
  await sleep(800);
  check(`second round phase=playing`, hostRoom.state.phase === "playing");
  check(`second round assigned ${NUM_PLAYERS} roles`, roles2.size === NUM_PLAYERS);

  console.log(`\n[10] CLEANUP`);
  await hostRoom.leave(true);
  for (const j of joiners) await j.room.leave(true);
  await sleep(300);

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("\n✗ smoke test crashed:", err.message);
  console.error(err.stack);
  process.exit(2);
});
