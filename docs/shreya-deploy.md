# Shreya's track — Deployment

Hi Shreya! Quick update from the team: deployment is more time-sensitive than the stats track, so we'd love for you to do this **first**, then come back to stats if you have time after.

The goal: get Star Bite Diner running on the public internet at a real URL like `starbite-yourname.onrender.com` so anyone can play it without cloning the repo. This unblocks the playtest helper running real classroom-style sessions and gets the team a URL to share for the Tuesday demo.

**Estimated time:** 1–2 hours
**Tools:** Web browser. A free [Render](https://render.com) account. The repo on GitHub.

---

## What you're deploying

The game has two halves that both need to be online:

1. **The server** — the Node process that runs Colyseus rooms. Lives at a `wss://` URL. Render calls this a **Web Service**.
2. **The client** — the static HTML/CSS/JS the player loads in their browser. Lives at an `https://` URL. Render calls this a **Static Site**.

The client connects to the server over WebSocket. We'll set an environment variable on the client telling it where the server lives.

```
        Browser
           │
   https://starbite.onrender.com   (Static Site — Render serves the bundled client)
           │
       loads JS, opens WebSocket to:
           │
   wss://starbite-server.onrender.com   (Web Service — your Colyseus server)
```

---

## Branch + git

Work on a branch called **`shreya/deploy`**. From your local clone:

```bash
cd ~/Desktop/gamesfinal
git fetch
git checkout -b shreya/deploy
git push -u origin shreya/deploy
```

You'll mostly be making config changes outside the codebase (in Render's dashboard). The few files you might edit are listed in each step.

---

# Step 1 — Sign up for Render (5 minutes)

1. Go to [render.com](https://render.com) and sign up (free tier — no credit card needed).
2. When it asks, **connect your GitHub account** and grant access to the `haramor/starbite` repo (or the whole org if it asks).
3. From your Render dashboard, you should see "New +" in the top right — that's where you'll create both services.

---

# Step 2 — Deploy the server (Web Service) (20–30 minutes)

In the Render dashboard:

1. Click **New +** → **Web Service**.
2. Pick the `haramor/starbite` repo from the connected list.
3. Fill in the form:
   - **Name:** `starbite-server` (or `starbite-server-yourname` if the name's taken)
   - **Region:** Oregon (US West) — pick whichever is closest to you and your testers
   - **Branch:** `main`
   - **Root Directory:** *(leave blank — we deploy from the repo root)*
   - **Runtime:** **Node**
   - **Build Command:** `npm install && npm run build:shared`
   - **Start Command:** `npm run start:server`
   - **Plan:** **Free** (it's enough)
4. Scroll down to **Advanced** and add an **Environment Variable**:
   - Key: `NODE_VERSION`
   - Value: `20`
5. Click **Create Web Service**.

Render will start building. The build takes **3–5 minutes** the first time (it's installing all npm packages).

### Watch the deploy log

While Render builds, the right side of the page shows a live log. Healthy output:

```
==> Cloning from https://github.com/haramor/starbite
==> Checking out commit ... in branch main
==> Running build command 'npm install && npm run build:shared'
... (npm install output) ...
> starbite-shared@0.1.0 build
> tsc
==> Build successful
==> Deploying...
==> Running 'npm run start:server'
[starbite] listening on http://localhost:10000
==> Your service is live 🎉
```

Render will show your URL at the top — something like `https://starbite-server.onrender.com`. **Copy this URL.** You need it in Step 3.

### Verify the server is live

In your browser, open `https://starbite-server.onrender.com/health`. You should see:

```json
{"ok": true, "ts": 1777558000000}
```

If you see that, the server is up. If you see "Bad Gateway" or a Render error page:
- Check the Logs tab in Render — the error usually points at the cause.
- Most common issue: build timed out or crashed. Re-deploy from the "Manual Deploy" → "Clear cache & deploy" option.
- Tell Hara what the log says.

### About the free tier

Render's free Web Services **sleep after 15 minutes of no traffic**. The first request after a sleep takes ~30 seconds to wake up. That's fine for our team — once a playtest is in progress, the server stays awake. But if you visit the URL after a long pause, expect a 30-second hang on the first load. Tell the team this so they don't panic.

---

# Step 3 — Deploy the client (Static Site) (15 minutes)

Back in the Render dashboard:

1. Click **New +** → **Static Site**.
2. Pick the `haramor/starbite` repo.
3. Fill in the form:
   - **Name:** `starbite` (or `starbite-yourname`)
   - **Branch:** `main`
   - **Root Directory:** *(leave blank)*
   - **Build Command:** `npm install && npm run build:client`
   - **Publish Directory:** `client/dist`
4. Scroll down to **Environment Variables** and add:
   - Key: `VITE_SERVER_URL`
   - Value: `wss://YOUR-SERVER-URL-FROM-STEP-2.onrender.com`

   ⚠️ Important: it's `wss://` not `https://`, no trailing slash. Example: `wss://starbite-server.onrender.com`
5. Click **Create Static Site**.

The build will take 2–3 minutes. When done, Render shows your client URL like `https://starbite.onrender.com`.

### Verify the client is live

Open `https://starbite.onrender.com` in a browser. You should see the Star Bite Diner title screen. Click **Create a room**.

**If a room is created and you see the Lobby with a 4-letter code → it's working.** Send the URL to Hara to confirm she can join from her laptop.

### If it doesn't connect

Open browser devtools → Network tab → reload. Look for a failed `WebSocket` request. Common causes:

- **`VITE_SERVER_URL` is wrong** — re-check the value in Render's env vars. Must be `wss://` not `https://`.
- **CORS error** — the server needs to allow the static site's origin. If you see this, edit `server/src/index.ts` and just below `app.use(express.json());` add:
  ```ts
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
  });
  ```
  Commit and push to `shreya/deploy`. Then in Render's Web Service dashboard, hit "Manual Deploy" to re-deploy. Wait 3 min.
- **Server is asleep** — open the server URL once to wake it, wait 30 sec, retry the client.

---

# Step 4 — Set environment variables for free-tier wake-ups (10 minutes)

Render free-tier services sleep after 15 minutes. To make playtests smoother, we want the server to wake up fast and stay awake during a session.

### Option A (easy, free): UptimeRobot

[uptimerobot.com](https://uptimerobot.com) is a free service that pings your URL every 5 minutes, keeping it warm.

1. Sign up (free, no credit card).
2. **Add Monitor** → HTTP(s) Monitor.
3. URL: `https://starbite-server.onrender.com/health`
4. Monitoring Interval: 5 minutes.
5. Save.

Now your server gets pinged every 5 minutes, never goes to sleep, and is always ready for a playtest. (This is technically against Render's free-tier ToS in spirit, but they don't enforce it for low-volume cases. For our class project it's fine.)

### Option B (skip it): just accept the 30-second wake-up

If the team is okay with the first-visit-of-the-day taking 30 seconds, skip uptimerobot. Just tell the team "if it looks frozen on first load, give it 30 seconds."

---

# Step 5 — Tell the team (5 minutes)

Once both URLs work end-to-end:

1. Send Hara and Sky:
   - **Player URL:** `https://starbite.onrender.com` (whatever Render gave you for the static site)
   - **Server URL:** `https://starbite-server.onrender.com` (in case anyone needs to debug)
   - **Stats URL** (once the stats track is built): `https://starbite-server.onrender.com/stats`
2. Add the Player URL to the README. Open `README.md` and add at the very top:
   ```markdown
   **🎮 Play it: https://starbite.onrender.com**
   ```
   Commit and push to your branch:
   ```bash
   git add README.md
   git commit -m "add live URL to README"
   git push
   ```
3. Send the Player URL to Helper 4 (the playtest lead) so they can run the external playtest from anywhere.

---

# Step 6 (optional) — Custom domain (~30 min, only if you want)

If the team wants a memorable URL like `starbite.haramor.com` instead of `starbite.onrender.com`:

1. You need a domain registered somewhere (Namecheap, Cloudflare, Google Domains).
2. In Render's static site → Settings → Custom Domains → Add `starbite.yourdomain.com`.
3. Render gives you a CNAME record. Add it at your domain registrar.
4. Wait 5–60 min for DNS propagation.

This is genuinely optional. Render's URL works fine.

---

# What "done" looks like

Minimum:
- Server is live at a public `wss://...onrender.com` URL
- Client is live at a public `https://...onrender.com` URL
- Hara, Sky, and you can all create rooms / join them from your own laptops via the public URL
- The URL is in the README
- Helper 4 has the URL for external playtest

That's a complete, ship-ready deployment. The team can run the Tuesday classroom demo from any laptop with this URL.

---

# Troubleshooting cheatsheet

**The build fails on Render with "command not found":**
- Check `NODE_VERSION` env var is set to `20`.

**Server says "Bad Gateway" but Render shows it as live:**
- Server is sleeping. Visit `https://your-server.onrender.com/health` to wake it. Wait 30 sec.

**Client loads but doesn't show the title screen:**
- Open devtools → Console. The error usually says what's missing. Most likely `VITE_SERVER_URL` is unset.

**"Network error" when clicking Create Room:**
- WebSocket connection is failing. Check `VITE_SERVER_URL` is `wss://` (not `https://`).
- Try the server's `/health` URL directly — if that fails, the server is the problem, not the client.

**Server logs say "Cannot read properties of undefined" or some weird crash:**
- Tell Hara. That's a code-level issue, not a deploy issue.

**You changed something in the repo and want to redeploy:**
- Render auto-deploys from `main` after any merge. For your `shreya/deploy` branch, you need to either merge to main or change the Render service's branch to `shreya/deploy` temporarily.

---

## Then come back to the stats track

Once deployment is done, switch back to **`/docs/shreya-kickoff.md`** for the stats / game history track. That's the second thing you're owning. With deployment done, the team can ALSO use the live `/stats` page to show off in the demo — "look, every round we've played in real classrooms, recorded right here."

If you get stuck, message Hara. Have fun — you're going to be the person who makes this thing actually playable for everyone outside our laptops.
