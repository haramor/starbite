# Helper Task 3 — Classroom materials

Hi! Thanks for helping with **Star Bite Diner**. Your job is to write the materials a real teacher would use to run this game in a real classroom. **This is graded as part of the final project**, so it matters as much as the code does.

**Estimated time:** 4 hours
**Tools:** Google Docs / Slides, or a Markdown editor. Final delivery is 3 documents.

---

## What is the game (90-second version)?

Star Bite Diner is a multiplayer game (5–10 players) for grades 4–8 about training AI bots in a space restaurant. Players label data at training stations to teach the bots how to do their jobs. Some players are secret saboteurs who give wrong labels. The game teaches:

- AI learns from examples (training data)
- Bad data leads to bad outputs (data poisoning)
- A small amount of bad data hurts a model — but lots of good data overpowers it
- Auditing data is a real skill
- Models reflect their training, not "intelligence"

**Crucially: none of these terms appear in the game itself.** Students learn intuitively through play. Vocabulary gets attached afterward by you (the teacher) in the debrief.

For more depth, read [`/docs/architecture.md`](../architecture.md) in the repo or ask Hara.

---

## What you're delivering

### Deliverable 1: Pre-game teacher script (1 page, ~5 min talking time)

**File:** `docs/teacher/01-pregame-script.md`
**Format:** Markdown or Google Doc

The teacher reads / paraphrases this **before students play**. It sets up the premise without giving away the AI literacy framing.

**Structure:**
- **Hook (1 paragraph):** "Imagine you're running a restaurant where the cooks are robots — and the robots have never made food before. Your team has to teach them by example. But what if some of you on the team were trying to ruin the lessons?"
- **Rules summary (5–6 bullets):**
  - Players are split between Trainers and Saboteurs (saboteurs work in secret)
  - You walk around to training stations and give labels — like "this burger is rare" or "this banana peel goes in compost"
  - Every 30 seconds a customer comes in; if the bots got things right, customer satisfaction goes up
  - Saboteurs give wrong labels on purpose to lower satisfaction
  - You can call meetings to vote out who you think is a saboteur
  - Crew wins if satisfaction stays high, OR if all saboteurs are voted out. Saboteurs win if satisfaction crashes.
- **Setup steps (4–5 bullets):** how to get into the game (room code, name, avatar)
- **Two priming questions** to ask the class before play starts:
  - "What do you think happens if you teach the robot wrong information?"
  - "If some people on your team are trying to mess things up, how would you figure out who they are?"

**Tone:** energetic, no jargon. Words like "AI," "model," "training data," "machine learning" should NOT appear yet. They come in the debrief.

---

### Deliverable 2: Debrief slide deck (6–8 slides, ~10–15 min)

**File:** `docs/teacher/02-debrief-deck.{pptx,key,pdf}` and a copy as `docs/teacher/02-debrief-outline.md`
**Format:** Google Slides or Keynote, exported to PDF; plus a Markdown outline of the same content

This is what the teacher walks the class through **after the round ends**. The goal: connect what just happened in the game to real AI concepts.

**Suggested slide order (you can adjust):**

**Slide 1 — Title: "What just happened?"**
A welcome / transition slide. "Let's talk about what we just did."

**Slide 2 — "Robots learn from examples"**
Frame the takeaway: "When you labeled a burger as 'rare,' the bot remembered. When someone gave wrong labels, the bot got worse. That's how real AI works — it learns from examples we give it."
Real-world hook: "ChatGPT was trained on examples. So was the AI in your phone's camera. So was the AI that recommends YouTube videos."

**Slide 3 — Discussion: "What did wrong labels look like?"**
Discussion prompts:
- "How could you tell when something was off?"
- "Did one wrong label ruin everything? Or was it more about the pattern over time?"

**Slide 4 — "Bad data ≠ broken AI"**
Key insight: the bot wasn't dumb. It was reflecting what it was taught.
"In real life, AI can give bad answers because the EXAMPLES it learned from were bad — not because the AI is stupid."

**Slide 5 — Discussion: "Where do you think real AI gets its examples from?"**
Open question. Let students brainstorm.
Then reveal: from people. From the internet. From things people typed and labeled. **Sometimes from sloppy or biased sources.**

**Slide 6 — "Auditing the data" — the Review station**
Reflect on the Review & Security station: someone has to look at training data and decide what's good. **This is a real job.** Real ML teams audit datasets.

**Slide 7 — Vocabulary**
Now name what we just learned. Put 5–7 vocabulary words students should add to their AI vocabulary:
- **Training data** — the examples we give an AI to learn from
- **Label** — the "answer" attached to an example (e.g., "this is a banana peel; it's compost")
- **Model** — what the AI builds from training data; it's how it makes decisions
- **Data poisoning** — putting bad examples in on purpose, to make the AI worse
- **Dataset auditing** — checking the training data for problems
- **Ground truth** — the actual right answer, against which we judge the AI's output
- **Probabilistic** — the AI doesn't always get it right; it has odds, like a weighted coin flip

**Slide 8 — "Where does this matter in your life?"**
Closing prompt: "What's an AI you use that might have been trained on bad examples? How would you 'audit' it?"
Examples to seed if students are quiet: face filters that don't work on darker skin, autocomplete that suggests biased words, image generators that get certain kinds of people wrong.

---

### Deliverable 3: Student-facing rules card (1 page, printable)

**File:** `docs/teacher/03-rules-card.{pdf,md}`
**Format:** A 1-page PDF (US Letter, landscape preferred) plus a Markdown source

Designed to be printed and handed out. The student reads this to understand how to play.

**Sections:**
- **Title:** Star Bite Diner — Quick rules
- **Your job:** "Train the diner's robots by giving correct labels. But beware — some of you are SABOTEURS, secretly giving wrong labels."
- **What to do at each station:** 1 line per station
  - 🔥 **Grill Bot:** Look at the patty and tell the bot if it's `rare` or `done`.
  - 🗑️ **Trash Sorter:** Look at the item and pick: `recycle`, `compost`, or `landfill`.
  - 🔍 **Review & Security:** Look at recent labels — if any look wrong, hit the 🚩 flag.
- **Win conditions:** "Crew wins if customer satisfaction stays above 85% OR all saboteurs are voted out. Saboteurs win if satisfaction crashes."
- **The key skill:** "Watch the data, not the people."
- **Visual:** include simple icons or a tiny screenshot if you can.

---

## Tone guide

- Warm, friendly, slightly silly. This is for 9–13-year-olds.
- No condescension ("Listen here, kids!") — speak to them like capable people.
- No jargon in the pre-game material. Save "training data" / "model" / "data poisoning" for the debrief.
- The bot is **never** the enemy. It's the team's trainee. "We're responsible for what we teach it."

---

## Quality bar

A good debrief deck:
- Doesn't lecture for 15 minutes — leaves room for student discussion on at least 2 slides
- Connects gameplay moments back to real-world AI students actually use
- Frames mistakes as data problems, not "stupid AI"
- Includes at least one moment where students get to share their own opinion

A bad debrief deck:
- Is just a wall of text definitions
- Uses scary "AI is dangerous" framing
- Talks down to students
- Drops jargon without grounding it in what just happened in the game

---

## Where to put your work

Create the folder `docs/teacher/` in the [starbite repo](https://github.com/haramor/starbite) and drop your 3 deliverables there. Or send to **Hara**, she'll commit them.

If you're doing the slide deck in Google Slides, export a PDF version and drop both the PDF and a link to the live deck in `02-debrief-deck-link.md`.

---

## Reference material

- The full game design doc Hara will share with you separately
- The discussion questions from the original design doc:
  - What happened when the bot got bad labels?
  - How did you figure out who was giving wrong data?
  - Did one wrong label ruin everything, or did enough good labels help?
  - In real life, where do you think AI gets its examples from?
  - What if the "saboteurs" weren't people — what if it was just sloppy data, or outdated data?
  - Can you think of AI you use that might have been trained on bad examples?
  - How would you "audit" AI you use in your life?

Use those as the spine of the debrief deck.

Thank you — this is the part of the project that makes it actually a *learning* game and not just a fun party game.
