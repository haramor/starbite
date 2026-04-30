# Helper Task 4 — Playtest lead + lobby/title UX

Hi! Thanks for helping with **Star Bite Diner**. Your job is two-part: **(A) run organized playtests of the game and capture useful feedback**, and **(B) design what the title screen and lobby look like aesthetically** so the team knows what to polish toward.

**Estimated time:** 4–6 hours total, spread across 2 days
**Tools you need:** A web browser. Optionally Figma (free) for the design part. A Google Doc for the playtest log. Your phone for photo/video.

---

## What is the game?

A 5-to-10-player web game (ages 9–13) about training AI bots in a space restaurant. Players label data, customers come, satisfaction goes up or down. Some players are secret saboteurs. **Round length: 6 minutes.** We'll be testing internally first, then ideally with classmates and (if we can manage it) actual middle schoolers.

---

# Part A — Playtest lead (most of your time)

Run **at least 2 playtests** during the build week. Your job: organize them, run them well, and turn what you observe into actionable bugs/feedback for the coders.

## Schedule

### Playtest 1 — Internal (Day 3, Sunday May 3)

- **Who:** the build team. Hara + Sky + the other helpers + you = ~6 people.
- **Where:** in person if you can, otherwise everyone on Discord/Zoom while logged in to the game on their own laptop
- **How long:** plan for 60 minutes total — 5 min setup, 6 min round, 10 min discussion, repeat 2 more times
- **Goal:** find game-breaking bugs and obvious confusion points before public testing

### Playtest 2 — External (Day 4, Monday May 4)

- **Who:** find 5–6 other students with no context. Friends, classmates, anyone in the program
- **Where:** same — in person or all on a call
- **How long:** 60–90 min
- **Goal:** see how the game lands for someone with NO context. Do the rules teach themselves? Does the AI literacy come through?

---

## Step-by-step: how to run a session

### Before the session (15 min, the day before)

1. Confirm with everyone the time + who's joining + that they have a laptop.
2. Confirm with Hara the live URL is working — visit it yourself and try to create a room.
3. Open a fresh Google Doc titled "Star Bite playtest log — [Session 1, internal]" or similar. Share with Hara + Sky + Shreya with edit access.
4. Set up the doc with this header (copy this in):

```
# Star Bite Playtest Log
- Session: Internal #1
- Date:
- Time:
- # players:
- Run by: [your name]
- Game version: live URL [...] / commit [...]

## Schedule
- 0:00 — setup
- 0:05 — round 1 starts
- 0:11 — round 1 ends + discussion
- 0:25 — round 2 starts
- ...

## Bugs found
(see template below)

## Observations
(see template below)

## Quotes
(see template below)
```

### During setup (5 min)

- [ ] Everyone has the URL (`https://starbite.onrender.com` or whatever Hara shared)
- [ ] One person creates a room and reads the 4-letter code aloud
- [ ] Everyone joins, sets their name, picks an avatar
- [ ] Once you have ≥5 people in the lobby, host clicks Start
- [ ] **Don't tell people any rules beyond "label things, watch the satisfaction meter"** — we want to see if the game teaches itself

### During play (6 min) — your job is to OBSERVE, not play

While the round is happening, you're taking notes. **You can play if you have to** to fill the 5-player minimum, but ideally you sit out and watch.

Watch all 5 players' screens (if in person, walk between them; if on a call, ask everyone to share their screen briefly). Note:

- **Confusion** — "what do I do here?" "how do I label?" "where's the meeting button?"
- **Frustration** — players bouncing off something repeatedly, sighing, asking the same thing
- **Cheering moments** — when does it click? When do players get excited or laugh?
- **Saboteur behavior** — were saboteurs successful? Were they obvious?
- **Catching saboteurs** — did the crew identify them? How? What clues did they use?

Take **timestamped notes** like:
```
0:30 — Aimee asks "how do I get into the grill?" — confusion about clicking station
1:15 — Lillia laughed when alien customer said "RECYCLE THIS CAN OR I WILL CRY"
2:40 — Sky (saboteur) submitted poison label, no one noticed
3:50 — Raia called emergency meeting because trash accuracy dropped, this worked!
5:20 — round ended; saboteurs won
```

### After the round — discussion (10 min, every time)

Run these 6 questions in order. **Take notes on what people say — especially exact quotes.**

1. "What did you understand the game was teaching by the end?" *(test if pedagogy landed)*
2. "When were you confused?"
3. "What was the most fun part?"
4. "What was the most annoying part?"
5. "If you were a saboteur — was it fun? What would make it more fun?"
6. "Did you learn anything about AI you didn't know before?"

If someone gives a short answer, **ask "why?" twice**:
- "I didn't like X" → "why?" → "because Y" → "but why does Y feel that way?"

This is how you find the REAL issue. Surface complaints rarely point at the actual problem.

---

## Bug report format

When you spot something, log it in your Google Doc using this template:

```
## Bug #1: Stations don't update for second player

- **Severity:** breaks game / annoying / minor / nitpick
- **What happened:** When 3 players were at the grill at the same time, the
  example didn't update for one of them — they stayed on the same patty
  for 30 seconds.
- **Steps to reproduce:** 3+ players at one station, all submit labels at
  ~the same moment.
- **Player(s) affected:** Sky, also Aimee
- **Screenshot/recording:** [link if you grabbed one — see "Screen recording" below]
- **My guess at fix:** server might not be sending the next example?
  (Don't worry if this is wrong — coders will figure it out.)
```

### How to take a screenshot

- **Mac:** Cmd + Shift + 4 → drag to select area → file saves to your Desktop
- **Windows:** Windows key + Shift + S → drag to select → paste into your Google Doc

### How to record a quick video

If a bug is hard to describe in words, a 5-second video clip helps a ton.

- **Mac:** Cmd + Shift + 5 → "Record Selected Portion" → drag to select area → click Record → stop with Esc
- **Windows:** Windows key + G (opens Game Bar) → click Record button → stop when done
- **Both:** [Loom](https://loom.com) is a free browser extension that's even easier — click the icon, record, get a sharable link instantly

Paste the screenshot or video link directly into your Google Doc.

---

## Observation format (for non-bug things)

Some things aren't bugs but are worth recording:

```
## Observation #3: Players don't understand the satisfaction meter

- **What I saw:** 3 out of 5 players couldn't say what the bar at the top
  meant when I asked. They knew it went down but not why.
- **Why it matters:** if they don't connect the satisfaction bar to bot
  performance, the pedagogy doesn't land.
- **Suggested fix:** add a tiny "?" tooltip on hover that says "Bots serving
  customers correctly raises this. Wrong answers lower it."
```

---

## Quote tracking

Quote real things people said. These are gold for your assignment writeup AND for the team to internalize what works.

```
## Quotes

> "OH MY GOD they fed the bot the wrong thing!" — Aimee, round 2, when she
  realized what data poisoning was

> "Wait, this is actually how AI gets messed up?" — random external tester,
  during the debrief
```

---

## What Hara and Sky need from you most

### By end of day Sunday (Day 3)

Send Hara + Sky a short Slack/text/Discord message with:

- **Top 3 bugs** that break or seriously degrade the game (so they can fix Monday morning)
- **Top 3 confusion points** (UI text changes, missing tooltips, etc.)
- **Top 1 thing that's actually working great** (so we don't accidentally remove it)

Format example:

```
PLAYTEST 1 SUMMARY (5 players, internal)

🚨 Top 3 bugs to fix:
1. Stations don't update for 2nd+ player at same station
2. "Call meeting" button greys out after one use even though we should have 2
3. Customer ticker animation lingers, blocks accuracy bar

😕 Top 3 confusion points:
1. Players don't realize they need to walk close to the station before clicking
2. The "poison" button isn't obvious enough — saboteurs missed it
3. Satisfaction meter doesn't say what it means

✅ What's working:
- Customer reactions are HILARIOUS — got laughs every time
```

### By end of day Monday (Day 4)

Add a final paragraph for the assignment writeup:

```
External playtest — 6 players who hadn't seen the game before.

Without prompting, X out of 6 players described the game as "training AI" or
something similar by the end of the round. X out of 6 connected "data poisoning"
to the saboteurs. X out of 6 named at least one real-world AI that might have
been trained on bad examples (during debrief).

The most successful pedagogical moments were [...].
The most confused moments were [...].
```

This goes into the team's grade-able writeup. **Be honest** — if the pedagogy didn't fully land, that's not a failure of your work, it's data for v2.

---

# Part B — Title / lobby aesthetic (~1.5 hours)

The current title screen and lobby work but look like default HTML. You're going to design what they should look like aesthetically so the team has a polished target.

## What you're delivering

You have 3 options. **Pick whichever feels easiest** — they're all valid.

### Option 1 — Figma frames (preferred if you've used Figma before)

- 2 frames at 1280×800 each:
  1. **Title screen** — logo, "Create room" / "Join with code" buttons, vibe art
  2. **Lobby screen** — room code displayed, players gathered, "Start" button
- Use real Kenney art if you want (Helper 2 is collecting it), or placeholder shapes — the point is showing the **layout, color, mood, typography**
- Share the Figma link with Hara

### Option 2 — Hand-sketched / digital sketch

- 2 paper or iPad sketches showing the same layouts
- Snap a clear photo / scan, drop into Google Drive, share link

### Option 3 — Pinterest mood board + 1 sketch

- Collect 8–12 reference images on Pinterest (search: "retro futuristic diner," "space cafe interior cartoon," "Among Us lobby UI," "Overcooked title screen," "1950s diner illustration")
- Plus one quick sketch showing how those references should combine into our title screen

## Figma walkthrough (if you go with Option 1)

If you've never used Figma before, here's the absolute fastest path:

1. Go to [figma.com](https://figma.com) and sign up (free).
2. Click **+ Design file** to start a new project.
3. Press **F** on your keyboard, then click and drag in the canvas to create a frame. You'll see size presets in the right panel — pick **Desktop** or set custom dimensions to 1280×800.
4. Build your design using:
   - **R** for rectangles (panels, buttons)
   - **T** for text
   - **Drag and drop** images directly from your computer onto the canvas to add them
5. Use the right-side panel to set colors / fonts / etc.
6. Make 2 frames total — title screen and lobby.
7. Click **Share** in the top right → set link permission to "Anyone with the link can view"
8. Copy the link and send to Hara

You don't need to be a Figma expert. **Bad-but-clear is better than nothing.** Boxes, labels, and rough placement is enough.

## What to think about (regardless of option)

- **Color palette:** the current placeholder uses dark navy + pink-warm + yellow. You can keep that or propose something else, but stick to a **6-color** palette max. Save the hex codes.
- **Logo / wordmark:** "STAR BITE DINER" — could be neon-sign style, 50s-diner-menu style, pixel-art-arcade style, etc. Pick a vibe.
- **Player avatars:** how big are they on the lobby screen? Are they showing off their selected character? Showing names?
- **Empty-state friendly:** what does the lobby look like when only 2 people are in it? It should still feel inviting, not lonely.

## Reference images to start with

Search these on Pinterest, save the ones you like:

- "retro futuristic diner" → for the overall vibe
- "Overcooked title screen" → for friendly cartoon game UI
- "Among Us lobby" → for game-lobby layout patterns
- "Cyberpunk diner pixel art" → for color inspiration
- "1950s diner menu typography" → for the wordmark
- "Star Trek Voyager mess hall" → for retro-futuristic interior

Don't agonize. Pick what feels fun.

---

# Tips for being a great playtest lead

- **Don't help players.** Even if you see them struggling, just observe. Their struggle is the data. (Exception: if they literally can't continue because of a real bug, then yes, intervene.)
- **Don't argue with feedback.** If someone says "this is confusing," they're right (for them). Write it down. Even if it's not confusing to you.
- **Time everything.** How long until the first label was submitted? How long until the first meeting? These numbers matter for tuning.
- **Ask "why" twice.** Surface complaints rarely point at the real issue.
- **Run the same questions every session.** Comparable data is more useful than 50 different questions across 2 sessions.

---

# 🚀 How to deliver your work to GitHub

You'll be sharing 3 things with the team:

1. **Playtest log Google Doc** — share with Hara + Sky + Shreya by adding their emails as editors
2. **Bug summary message** — text/Slack/Discord at end of each session (no GitHub needed)
3. **Title/lobby design** — Figma link OR Drive folder, shared with Hara

For the design specifically, if you want to commit it to the repo:

### Uploading design references to GitHub

1. Make sure Hara has added you as a collaborator. You should have an email invite from GitHub.
2. Go to `https://github.com/haramor/starbite/tree/main/docs`
3. Click **Add file** → **Create new file**
4. In the filename box, type **exactly**: `design/title-mockup.md`
5. Paste in this template (replace placeholders):

```markdown
# Title screen + lobby design

Designed by [your name], [date].

## Figma link
[Your Figma share URL]

## Color palette
- Background: #0F1133
- Panel: #1A1F4D
- Accent: #FF7EB3
- ...

## Reference images
[Pinterest board link or Google Drive folder of references]

## Notes for the team
- [Any specific things you want them to know]
```

6. Scroll down, type commit message **"Add title/lobby design mockups"**, click **Commit changes**.

If you have actual image files (screenshots of your Figma design, sketch photos), you can also upload those:

- Navigate to `https://github.com/haramor/starbite/tree/main/docs/design`
- Click **Add file** → **Upload files**
- Drag and drop your images
- Commit

Then the team has a permanent record of the design vision in the repo.

---

# Common questions

**"What if I can't get 5 people for the internal playtest?"**
Run with whoever you can get. 4 players is below minimum but the game might still work (depending on how Hara's coded the saboteur ratios — ask). 3 players is too few. Reschedule for the next day.

**"What if external playtesters can't make it?"**
Even ONE external tester is more useful than zero. Recruit aggressively — text, Slack, knock on doors. Someone in the dorm next door is fine.

**"What if a session totally falls apart (server crashes, someone drops, etc.)?"**
Note what happened, end the session, message Hara what broke. That's data too — "the server crashed when the 6th player joined" is a critical bug.

**"How detailed should my notes be?"**
Try to fill at least one screen of Google Doc per session. Quotes count. Timestamped observations count. Don't worry about sentence quality — bullet points are fine.

**"What if Hara hasn't finished features by playtest 1?"**
Test what's working. Note what's missing as "missing" in your bug list. Helps the coders prioritize.

**"I'm intimidated by Figma."**
Skip it. Pinterest mood board + a paper sketch is a totally fine version of Part B. The point is to communicate the vision, not to deliver pixel-perfect work.

---

You're the team's eyes on whether this thing actually works. Have fun — and don't be afraid to deliver hard feedback. Hara and Sky want it.
