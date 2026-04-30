// End-to-end smoke test for Star Bite Diner.
// Connects 5 clients, joins the same room, starts the game, verifies phase
// transition, label submission, and stats logging.
//
// Run:    node scripts/smoke-test.mjs
// Requires the server already running on localhost:2567.

import { Client } from "colyseus.js";

const URL = process.env.STARBITE_URL ?? "ws://localhost:2567";
const HEALTH_URL = URL.replace(/^ws/, "http") + "/health";
const STATS_URL = URL.replace(/^ws/, "http") + "/stats/games";
const NUM_PLAYERS = 5;
const ROOM_CODE = "TEST";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let pass = 0;
let fail = 0;
function check(label, cond) {
  if (cond) {
    console.log(`  ✓ ${label}`);
    pass++;
  } else {
    console.log(`  ✗ ${label}`);
    fail++;
  }
}

async function main() {
  console.log(`\n› Pinging ${HEALTH_URL}`);
  const health = await fetch(HEALTH_URL).then((r) => r.json());
  check("server is up (/health responds)", health.ok === true);

  console.log(`\n› Creating host + ${NUM_PLAYERS - 1} joiners`);
  const host = new Client(URL);
  const hostRoom = await host.create("starbite", { code: ROOM_CODE });
  check("host created room", hostRoom.sessionId.length > 0);

  const joiners = [];
  for (let i = 0; i < NUM_PLAYERS - 1; i++) {
    const c = new Client(URL);
    const r = await c.join("starbite", { code: ROOM_CODE });
    joiners.push({ client: c, room: r });
    await sleep(50);
  }
  check(`${NUM_PLAYERS - 1} joiners connected`, joiners.length === NUM_PLAYERS - 1);

  console.log(`\n› Waiting for state sync`);
  await sleep(800);

  // Confirm players are visible in state. Schema sync might lag slightly.
  const playerCount = hostRoom.state.players.size;
  check(`host sees ${NUM_PLAYERS} players`, playerCount === NUM_PLAYERS);
  check(`room code matches`, hostRoom.state.code === ROOM_CODE);
  check(`phase is lobby`, hostRoom.state.phase === "lobby");

  let hostFlagsInState = 0;
  for (const p of hostRoom.state.players.values()) {
    if (p.isHost) hostFlagsInState++;
  }
  check(`exactly 1 host flag set`, hostFlagsInState === 1);

  console.log(`\n› Setting profiles`);
  hostRoom.send("set_profile", { name: "Host", avatarId: 0 });
  for (let i = 0; i < joiners.length; i++) {
    joiners[i].room.send("set_profile", { name: `P${i + 2}`, avatarId: i + 1 });
  }
  await sleep(400);

  // Wire role-assignment listeners on every client BEFORE starting
  const roles = new Map();
  hostRoom.onMessage("role_assigned", (msg) => roles.set(hostRoom.sessionId, msg.role));
  for (const j of joiners) {
    j.room.onMessage("role_assigned", (msg) => roles.set(j.room.sessionId, msg.role));
  }

  console.log(`\n› Host starts the round`);
  hostRoom.send("start_game", {});
  await sleep(1000);

  check(`phase is now playing`, hostRoom.state.phase === "playing");
  check(`all ${NUM_PLAYERS} players got a role`, roles.size === NUM_PLAYERS);
  const sabCount = [...roles.values()].filter((r) => r === "saboteur").length;
  const trainCount = [...roles.values()].filter((r) => r === "trainer").length;
  check(
    `saboteur count is 2 (5-player rule), got ${sabCount}`,
    sabCount === 2
  );
  check(
    `trainer count is 3, got ${trainCount}`,
    trainCount === 3
  );

  console.log(`\n› Host walks to grill, enters station, labels one example`);
  let currentExample = null;
  hostRoom.onMessage("current_example", (msg) => {
    currentExample = msg;
  });

  // Walk to grill at tile (5, 4)
  hostRoom.send("move", { tx: 5, ty: 4 });
  // Wait for movement (server speed = 4 tiles/sec, distance from spawn ~5 tiles)
  await sleep(2500);

  hostRoom.send("enter_station", { stationId: "grill" });
  await sleep(500);

  check(`got a current_example after entering station`, currentExample !== null);

  if (currentExample) {
    const grillBefore = hostRoom.state.stations.get("grill");
    const accBefore = grillBefore?.accuracy;

    hostRoom.send("submit_label", {
      stationId: "grill",
      exampleId: currentExample.exampleId,
      label: "rare", // gamble — half the time it'll be wrong
    });
    await sleep(500);

    const grillAfter = hostRoom.state.stations.get("grill");
    check(
      `grill station has at least 1 example after submit`,
      (grillAfter?.examples?.length ?? 0) >= 1
    );
    check(
      `grill accuracy is a valid percentage`,
      typeof grillAfter?.accuracy === "number" &&
        grillAfter.accuracy >= 0 &&
        grillAfter.accuracy <= 100
    );
    console.log(
      `    accuracy: ${accBefore} → ${grillAfter?.accuracy} (examples: ${grillAfter?.examples?.length})`
    );
  }

  console.log(`\n› Disconnecting all clients`);
  await hostRoom.leave(true);
  for (const j of joiners) await j.room.leave(true);
  await sleep(500);

  console.log(`\n› Hitting stats endpoint`);
  const stats = await fetch(STATS_URL).then((r) => r.json());
  check(`stats endpoint responds with games array`, Array.isArray(stats.games));

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("\n✗ smoke test crashed:", err.message);
  console.error(err.stack);
  process.exit(2);
});
