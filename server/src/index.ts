// Star Bite Diner server entry point.
// Boots a Colyseus server with the StarBite room. Also serves the Colyseus monitor
// at /colyseus for debugging (don't expose this in real production).

import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { monitor } from "@colyseus/monitor";
import express from "express";
import { createServer } from "http";
import { GameRoom } from "./rooms/GameRoom.js";

const PORT = Number(process.env.PORT ?? 2567);

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

// Colyseus monitor — handy during dev, lets you peek at rooms/state
app.use("/colyseus", monitor());

const httpServer = createServer(app);

const gameServer = new Server({
  transport: new WebSocketTransport({ server: httpServer }),
});

gameServer.define("starbite", GameRoom).filterBy(["code"]);

httpServer.listen(PORT, () => {
  console.log(`[starbite] listening on http://localhost:${PORT}`);
  console.log(`[starbite] monitor: http://localhost:${PORT}/colyseus`);
});
