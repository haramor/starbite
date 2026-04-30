# Helper Task 4 — Playtest lead + lobby/title UX

Hi! Thanks for helping with **Star Bite Diner**. Your job is two-part: **(A) run organized playtests of the game and capture useful feedback**, and **(B) design what the title screen and lobby look like aesthetically** so we don't ship plain HTML.

**Estimated time:** 4–6 hours total, spread across 2 days

---

## What is the game?

A 5-to-10-player web game about training AI bots in a space restaurant. Players label data, customers come, satisfaction goes up or down. Some players are secret saboteurs. **Round length: 6 minutes**. Target ages: 9–13 (we'll be testing with grad school kids first, then ideally with real middle schoolers if we can swing it).

---

## Part A — Playtest lead (most of your time)

You're going to run **at least 2 playtests** during the build week. Your job is to organize them, run them well, and turn what you observe into actionable bugs/feedback for the coders.

### Playtest 1 — Internal (Day 3, Sunday May 3)
- **Who:** the build team. Hara + Sky + the other helpers + you = 6 people.
- **Where:** in person if you can, otherwise everyone on Discord/Zoom while logged in to the game on their own laptop
- **How long:** plan for 60 minutes total — 5 min setup, 6 min round, 10 min discussion, repeat 2 more times
- **Goal:** find game-breaking bugs and obvious confusion points before public testing.

### Playtest 2 — External (Day 4, Monday May 4)
- **Who:** find 5–6 other students (your friends, anyone in the program, Hara's classmates)
- **Where:** same — in person or all on a call
- **How long:** 60–90 min
- **Goal:** see how the game lands for someone with NO context. Are the rules clear? Does the pedagogy come through?

### How to run a session

**Setup checklist (5 min):**
- [ ] Everyone has the URL (Hara will share)
- [ ] One person creates a room and shares the 4-letter code
- [ ] Everyone joins, sets their name, picks an avatar
- [ ] Once you have ≥5 people in the lobby, host clicks Start
- [ ] **Don't tell people any rules beyond "label things, watch the satisfaction meter"** — we want to see if the game teaches itself

**During play (6 min):**
Just… observe. Take notes in real time. Especially watch for:
- **Confusion** — "what do I do here?" "how do I label?" "where's the meeting button?"
- **Frustration** — players bouncing off something repeatedly
- **Cheering moments** — when does it click? When do players get excited?
- **Saboteur behavior** — were saboteurs successful? Were they obvious?
- **Catching saboteurs** — did the crew identify them? How?

**After the round (10 min discussion, every time):**
Run these questions:
1. "What did you understand the game was teaching by the end?" (test if pedagogy landed)
2. "When were you confused?"
3. "What was the most fun part?"
4. "What was the most annoying part?"
5. "If you were a saboteur — was it fun? What would make it more fun?"
6. "Did you learn anything about AI you didn't know before?"

### Bug report format

Make a Google Doc called **"Star Bite playtest log"** and share with Hara + Sky. Every time you spot something, log it like this:

```
## Bug #1
- **Severity:** breaks game / annoying / minor / nitpick
- **What happened:** "When 3 players were at the grill at the same time, the example didn't update for one of them"
- **Steps to reproduce:** if you can repro it
- **Player(s) affected:** "Sky, also Aimee"
- **Screenshot/recording:** [link if you grabbed one]
```

### What HARA AND SKY need from you most

By **end of day Sunday**, send Hara + Sky a list of:
- **Top 3 bugs** that break or seriously degrade the game (so they can fix Monday morning)
- **Top 3 confusion points** (UI text changes, missing tooltips, etc.)
- **Top 1 thing that's actually working great** (so we don't accidentally remove it)

By **end of day Monday**, send them:
- A short paragraph: "Here's what the external testers seemed to learn vs. what they didn't" — this goes into the assignment writeup.

---

## Part B — Title / lobby aesthetic (~1.5 hours)

The current title screen and lobby work but look default-HTML-ugly. You're going to design what they should look like.

### Goal

A **mood board / style frame** that captures the vibe of Star Bite Diner: "cozy retro-futuristic space diner. Star Trek meets a 1950s milkshake bar. Warm, silly, inviting. Cartoony 2D, not photorealistic."

### What to deliver

**Option 1 — Figma frames (preferred)**
- 2 frames at 1280×800:
  1. Title screen (logo, "create room" / "join with code" buttons, vibe art)
  2. Lobby screen (room code displayed, players gathered, "start" button)
- Use real Kenney art if you want (Helper 2 is collecting it), or placeholder colored shapes — the point is showing the **layout, color, mood, typography**
- Share the Figma link with Hara

**Option 2 — Hand-sketched / digital sketch**
- 2 paper or iPad sketches showing the same layouts
- Photo or scan, drop into Google Drive, share link

**Option 3 — Pinterest mood board + 1 sketch**
- Collect 8–12 reference images on Pinterest (search: "retro futuristic diner," "space cafe interior cartoon," "Among Us lobby UI," "Overcooked title screen")
- Plus one sketch showing how those references should combine into our title screen

### What to think about

- **Color palette:** the current placeholder uses dark navy + pink-warm + yellow. You can keep that or propose something else, but stick to a **6-color** palette max.
- **Logo / wordmark:** "STAR BITE DINER" — could be neon-sign style, or 50s-diner-menu style, or pixel-art-arcade style. Pick a vibe.
- **Player avatars:** how big are they on the lobby screen? Are they showing off their selected character? Showing names?
- **Empty-state friendly:** what does the lobby look like when only 2 people are in it? It should still feel inviting, not lonely.

### Don't sweat

- Whether your design is "implementable" — that's Hara/Sky's problem. Your job is the vision.
- Pixel-perfect alignment — sketches are fine.
- Original art — you can mock up with anything (Kenney sprites, free icons, screenshots from other games marked "reference only").

---

## Where to put your work

- **Playtest log:** Google Doc, shared with Hara and Sky.
- **Title/lobby design:** Figma link OR Drive folder of images, shared with Hara.

---

## Tips for being a great playtest lead

- **Don't help players.** Even if you see them struggling, just observe. Their struggle is the data.
- **Don't argue with feedback.** If someone says "this is confusing," they're right (for them). Write it down.
- **Time everything.** How long until the first label was submitted? How long until the first meeting? These numbers matter.
- **Ask "why" twice.** "I didn't like X" → "why?" → "because Y" → "but why does Y feel that way?" You'll find the real issue.

You're the team's eyes on whether this thing actually works. Have fun — and don't be afraid to deliver hard feedback. Hara and Sky want it.
