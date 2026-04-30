// Star Bite Diner server entry point.
//
// In dev:    serves only the API + WebSocket on :2567. Vite serves the client
//            on :5173 and connects via VITE_SERVER_URL=ws://localhost:2567.
//
// In prod:   ALSO serves the built client bundle as static files. So the
//            single deployed Render service handles both the WebSocket and
//            the HTML/JS/CSS — same origin, no CORS, no env-var coordination.

import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { monitor } from "@colyseus/monitor";
import express from "express";
import { createServer } from "http";
import path from "node:path";
import { existsSync } from "node:fs";
import { GameRoom } from "./rooms/GameRoom.js";
import { mountStatsRoutes, loadFromDisk } from "./stats/index.js";

const PORT = Number(process.env.PORT ?? 2567);

const app = express();
app.use(express.json());

// Permissive CORS — fine for a classroom-deployed game. If we ever need to
// lock this down, restrict the origin in production.
app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  next();
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

// Colyseus monitor — handy during dev. (Safe to leave in prod for a class
// project; would lock down with auth in real production.)
app.use("/colyseus", monitor());

// Stats / game history routes (owned by /server/src/stats/)
loadFromDisk();
mountStatsRoutes(app);

// Static client serving — only kicks in when the built client exists.
// process.cwd() is /<repo>/src/server on Render, so we need "../../client/dist"
const CLIENT_DIST = path.resolve(process.cwd(), "..", "..", "client", "dist");
if (existsSync(CLIENT_DIST)) {
  console.log(`[starbite] serving client bundle from ${CLIENT_DIST}`);
  app.use(express.static(CLIENT_DIST));
  // SPA fallback: any request that doesn't match an API/static route
  // (and isn't /health, /colyseus, /stats, or a file with extension) gets
  // index.html so the React router-equivalent works.
  app.get(/^\/(?!health$|colyseus|stats|assets)(?!.*\.[a-z0-9]+$).*/, (_req, res) => {
    res.sendFile(path.join(CLIENT_DIST, "index.html"));
  });
} else {
  console.log(`[starbite] no client bundle at ${CLIENT_DIST} (dev mode — vite is serving the client separately)`);
}

const httpServer = createServer(app);

const gameServer = new Server({
  transport: new WebSocketTransport({ server: httpServer }),
});

gameServer.define("starbite", GameRoom).filterBy(["code"]);

httpServer.listen(PORT, () => {
  console.log(`[starbite] listening on http://localhost:${PORT}`);
  console.log(`[starbite] monitor: http://localhost:${PORT}/colyseus`);
});
