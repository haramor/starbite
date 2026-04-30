# Deploy guide

> **Status:** Sky is owning this. Anyone with the repo + a Render account can do it — the architecture is now a single web service driven by a `render.yaml` blueprint, so there are no env vars to coordinate or two services to wire together.

**Estimated time:** ~15 minutes end-to-end.

---

## Architecture (one service)

```
                     Browser
                        │
                        │  HTTPS + WSS
                        ▼
   ┌──────────────────────────────────────────────┐
   │ Single Render Web Service                    │
   │  - Express serves /assets, index.html        │
   │  - Express serves /stats, /stats/games       │
   │  - Colyseus runs on the same port (WSS)      │
   └──────────────────────────────────────────────┘
```

The server now serves the built React bundle as static files in production. The client connects to the WebSocket on the same origin (no CORS, no `VITE_SERVER_URL` to set). Everything ships as a single Render service driven by `render.yaml` at the repo root.

---

## The 5 steps

### 1. Sign in to Render

[render.com](https://render.com) → free tier, GitHub login, no credit card.

### 2. Connect the repo

In the Render dashboard, link your GitHub account if you haven't, and grant access to `haramor/starbite`.

### 3. Create the blueprint

- Top-right **New +** → **Blueprint**
- Pick `haramor/starbite` from the list
- Render reads `render.yaml` and shows a preview: one service called `starbite` (Node, free tier, Oregon)
- Click **Apply**

That's it. No fields to fill, no env vars to set.

### 4. Wait for the build

- Render will run `npm install && npm run build` (about 3–5 min on first deploy)
- Then `npm run start:server` boots
- A green status indicator means it's live

### 5. Verify

Render gives you a URL like `https://starbite.onrender.com`. Open it:

- The Star Bite Diner title screen should load.
- Click **Create a room** → join with a 4-letter code in another tab → it works.
- Visit `/stats` → the stats page loads (empty until you play a round).
- Visit `/health` → returns `{"ok": true, "ts": ...}`.

If anything's off, click into the service → Logs tab → grep for `ERROR` or `EADDRINUSE` and ping Hara.

---

## Telling the team

Once it's live, share the URL with everyone:

- **Player URL** to share for playtests + the Tuesday demo: `https://starbite.onrender.com` (whatever Render gave you)
- **Stats** for the teacher/debrief: `https://starbite.onrender.com/stats`

Add the URL to the top of `README.md` so it's easy to find:
```markdown
**🎮 Play it: https://starbite.onrender.com**
```
Commit + push.

Tell Helper 4 they can start running external playtests.

---

## Optional: keep the server warm

Render's free tier puts services to sleep after 15 minutes of inactivity. The first request after a sleep takes ~30 seconds to wake the service. For the Tuesday demo, this is fine — once the round starts, the server stays warm.

If you want to skip the cold-start delay before a planned playtest:

- Sign up at [uptimerobot.com](https://uptimerobot.com) (free, no card)
- **Add Monitor** → HTTP(s) → URL: `https://starbite.onrender.com/health` → check every 5 minutes
- Save

Now the server gets pinged every 5 min and never sleeps.

(Skip if you don't care about the 30s wake-up.)

---

## When you push code, Render auto-deploys

Render auto-builds on every push to `main`. So Hara/Sky merging a branch into `main` triggers a fresh deploy in a few minutes. No manual action needed after the first setup.

---

## Troubleshooting

**Build fails with "command not found":** confirm `NODE_VERSION=20` is set in the env vars (it should be from the blueprint, but worth checking).

**Page loads but says "Connecting…" forever:** open devtools → Network tab. The WebSocket should be `wss://your-url.onrender.com`. If it's `ws://localhost:2567`, the build picked up dev settings — re-deploy from "Manual Deploy → Clear cache & deploy."

**Page is stuck on a loading spinner:** Render is probably waking up. Wait 30 seconds.

**Anything else:** Logs tab in Render. Then ping Hara with the relevant log lines.
