# Helper Task 3 — Classroom materials

Hi! Thanks for helping with **Star Bite Diner**. Your job is to write the materials a real teacher would use to run this game in a real classroom — a pre-game intro, a debrief slide deck, and a one-page rules card. **This is graded as part of the final project**, so it's just as important as the code.

**Estimated time:** 4 hours
**Tools you need:** A web browser. Google Docs and Google Slides (free with any Google account). That's it.

---

## What is the game (90-second version)

Star Bite Diner is a multiplayer game (5–10 players, ages 9–13) about training AI bots in a space restaurant. Players label data at training stations to teach the bots how to do their jobs. Some players are secret saboteurs who give wrong labels.

The game teaches:
- AI learns from examples (training data)
- Bad data leads to bad outputs (data poisoning)
- A small amount of bad data hurts a model — but lots of good data overpowers it
- Auditing data is a real skill
- Models reflect their training, not "intelligence"

**Crucially: none of these terms appear in the game itself.** Students learn intuitively through play. Vocabulary gets attached afterward by the teacher (you're scripting them) in the debrief.

For more depth, read [`/docs/architecture.md`](../architecture.md) in the repo. The game design brief Hara has is also a good reference.

---

## What you're delivering

Three documents, all in a folder called **`docs/teacher/`** in the GitHub repo:

1. **`01-pregame-script.md`** — a 1-page teacher script for setting up the game (5 min talking time)
2. **`02-debrief-deck.pdf`** + **`02-debrief-outline.md`** — a 6–8 slide deck for the post-game discussion (10–15 min), plus a Markdown outline of the same content
3. **`03-rules-card.pdf`** + **`03-rules-card.md`** — a 1-page student-facing rules card

Don't worry about the GitHub upload yet — instructions are at the bottom of this doc. Focus on the writing first.

---

# 📜 Deliverable 1 — Pre-game teacher script (~1 hour)

A short script the teacher reads/paraphrases **before students play**. Sets up the premise without giving away the AI literacy framing.

### Use this exact structure (you can edit the wording)

I've written a complete starter version below. **Your job is to take this, polish the wording, customize the tone for your audience, and shorten/lengthen as needed.** You can keep large chunks if you like them.

```markdown
# Star Bite Diner — Teacher pre-game script (~5 min)

## Hook (read aloud, 60 seconds)

"Imagine you're running a restaurant — but every cook in your kitchen is a robot.
And the robots have never made food before. They don't know what 'rare' means.
They don't know which trash goes in compost. They don't know anything yet.

It's your job — and the rest of your crew — to teach them. By giving them
examples. Lots of them.

But here's the catch: some people on your team are SECRETLY saboteurs.
They look exactly like everyone else. They go to the same training stations.
They give labels just like you do. But they're trying to teach the robots WRONG
on purpose, to ruin the restaurant.

Your job is to train the bots fast and well, while figuring out who's helping
and who's secretly sabotaging. The robots are only as good as the examples
you give them. Train carefully."

## Quick rules (talk through, 2 minutes)

Cover these in order. Don't read them as a list — paraphrase, in any order:

- **Roles.** Most of you are TRAINERS. Some of you are SABOTEURS. You'll find
  out which when the round starts. Don't tell anyone your role.
- **Stations.** There are 3 stations on the map. Walk up to one and start labeling.
  - Grill Bot wants to know: rare or done?
  - Trash Sorter wants to know: recycle, compost, or landfill?
  - Review Station lets you LOOK at what's been labeled — and flag anything
    suspicious to remove it from the bot's training.
- **Customers.** Every 30 seconds, a customer walks up. The bots try to fill the
  order based on what you've taught them. If the bots got it right — happy customer.
  Wrong — angry customer. The team has a SATISFACTION meter at the top.
- **Saboteurs.** They give wrong labels on purpose. They have a small visual
  tell — they linger a moment longer at the station when they poison data —
  but it's subtle.
- **Meetings.** You can call up to 2 emergency meetings per round. Discuss what
  you've seen. Vote to eject anyone you think is sabotaging.
- **Winning.** Crew wins if satisfaction stays above 85% when time runs out,
  OR you successfully eject all saboteurs. Saboteurs win if satisfaction
  hits 0% or time runs out with at least one saboteur still in.

## Setup (last 1 minute)

- "Get on starbite.onrender.com on your laptop. Don't log in yet."
- "We need a host — [pick someone]. They'll click Create Room. We'll all use
  their 4-letter code."
- "Pick a fun name and avatar. Don't pick something that gives away your real
  name — saboteurs use that against you."
- "When everyone's in, the host clicks Start. The round is 6 minutes."

## Two priming questions (ask before starting — let students answer briefly)

1. "What do you think happens if you teach the robot wrong information?"
2. "If some people on your team are trying to mess things up, how do you
   figure out who they are? What clues might you look for?"

(Don't tell them the answer. Just let the questions sit. They'll find out.)
```

### What to change in the starter

- **Tone:** match how you'd actually talk to 9-to-13-year-olds. The version above is fine but feel free to make it warmer / more energetic.
- **Length:** total reading time should be ~5 min. Cut anything that drags.
- **Examples:** if any of the language is too abstract, add a concrete example.
- **No jargon:** confirm none of these words appear: AI, model, machine learning, training data, dataset, ground truth. They come ONLY in the debrief.

---

# 🎬 Deliverable 2 — Debrief slide deck (~2 hours)

Walks the class through what just happened in the game and connects it to real AI concepts. **This is the moment the pedagogy lands.**

### How to make it

1. Go to [Google Slides](https://slides.google.com) and click **+ Blank** to start a new presentation.
2. Title it **"Star Bite Diner — Debrief"**.
3. Build the 8 slides described below.
4. When done, **File → Download → PDF Document**. You'll save the PDF as `02-debrief-deck.pdf` and upload it to GitHub.
5. Also save the slide content as a Markdown outline (`02-debrief-outline.md`). I'll show you the format.

### Tips for design

- **Keep it visual.** Each slide should have one big idea, with images/icons rather than walls of text.
- **Free icons:** [thenounproject.com](https://thenounproject.com) (free with attribution) or just emoji
- **Free stock photos:** [pexels.com](https://pexels.com), [unsplash.com](https://unsplash.com)
- **Match the game's vibe:** dark blues + warm yellows, friendly. (You can copy the palette from the game's title screen — open `https://starbite.onrender.com` once it's deployed.)
- **Don't overthink design.** Default Google Slides "Simple Light" or "Simple Dark" theme is fine.

### The 8 slides — full content for each

#### Slide 1 — Title

- Big text: **"What just happened?"**
- Subtitle: **"Let's talk about what we just did."**
- Visual: a screenshot of the Star Bite Diner game (the lobby or the map view) — Hara can grab one for you, or take one yourself
- Speaker notes (in Slide 1's notes section): "Pause for a moment. Let students just sit with the round before diving in."

#### Slide 2 — "Robots learn from examples"

- Title: **"Robots learn from examples"**
- Body (3 short bullets):
  - When you labeled a burger as 'rare,' the bot remembered.
  - When someone gave wrong labels, the bot got worse.
  - **That's how real AI works.**
- Bottom: **"ChatGPT, your phone's camera, YouTube's recommendations — they all learned from examples that real people gave them."**
- Visual: a comparison between (a) the game's labeling UI, and (b) a screenshot of any real AI tool

#### Slide 3 — Discussion

- Title: **"What did wrong labels look like?"**
- Two bullet questions, large text:
  - "How could you tell when something was off?"
  - "Did one wrong label ruin everything? Or was it more about the pattern over time?"
- Speaker notes: "This is a discussion slide. Wait for at least 3 student responses before moving on. Don't rush this."

#### Slide 4 — "Bad data ≠ broken AI"

- Title: **"The bot wasn't dumb. It was reflecting what it was taught."**
- Subhead: **"In real life, AI gives bad answers because the examples it learned from were bad — not because the AI itself is stupid."**
- Visual: split image. Left: a happy bot with good labels. Right: a confused bot with mixed labels. Caption: "Same bot, different teachers."

#### Slide 5 — Discussion

- Title: **"Where do you think real AI gets its examples from?"**
- Body: leave mostly blank — invite student responses
- Speaker notes for the teacher (write these in Slide 5's notes section):
  - Let students brainstorm 1–2 minutes
  - Reveal answers: from people. From the internet. From things people typed and labeled. Sometimes from sloppy or biased sources.
  - Follow-up: "If the examples were sloppy or biased — what would happen to the AI?"

#### Slide 6 — "Auditing the data" — the Review station

- Title: **"Someone has to look at the data."**
- Body:
  - The Review station in the game? **That's a real job.**
  - Real ML teams audit datasets for problems before training the model.
  - It's not always fun. It's not glamorous. **But it's how AI doesn't go off the rails.**
- Visual: a screenshot of the Review & Security station UI

#### Slide 7 — Vocabulary

- Title: **"Now let's name what we just learned."**
- Body: a clean list of vocabulary words students should now add to their AI vocabulary. Include a short definition for each:
  - **Training data** — the examples we give an AI to learn from
  - **Label** — the answer attached to an example (like "this is a banana peel; it's compost")
  - **Model** — what the AI builds from training data; how it makes decisions
  - **Data poisoning** — putting bad examples in on purpose, to make the AI worse
  - **Dataset auditing** — checking the training data for problems
  - **Ground truth** — the actual right answer, against which we judge the AI
  - **Probabilistic** — the AI doesn't always get it right; it has odds, like a weighted coin flip
- Tip: put each term in a colored card / box so the slide doesn't look like a wall of text

#### Slide 8 — "Where does this matter?"

- Title: **"What's an AI you use that might have been trained on bad examples?"**
- Body: open question, blank space for student responses
- Speaker notes (for the teacher):
  - Let students share 2–3 examples
  - Seeds if students are quiet:
    - Face filters that don't work on darker skin
    - Autocomplete that suggests biased words
    - Image generators that get certain kinds of people wrong
    - Voice assistants that don't understand certain accents
  - Closing thought: "How would you 'audit' an AI you use? What would you check?"

### Save the slide content as a Markdown outline

Open Google Docs, paste in this template, and fill in your final slide text. Save as `02-debrief-outline.md`:

```markdown
# Star Bite Diner — Debrief deck outline

## Slide 1: What just happened?
[your title text]
[your subtitle text]
Speaker notes: [...]

## Slide 2: Robots learn from examples
[your bullets]
Speaker notes: [...]

(... continue for all 8 slides ...)
```

This Markdown version is the human-readable backup of your slide content — useful if someone needs to edit the deck without Google access.

---

# 📇 Deliverable 3 — Student rules card (~1 hour)

A 1-page printable card that students can hold while playing, summarizing the rules.

### How to make it

1. Open Google Docs (NOT Slides — Docs is better for one-page printable layouts).
2. **File → Page setup → Landscape orientation → US Letter**.
3. Build the layout described below.
4. **File → Download → PDF Document**. Save as `03-rules-card.pdf`.
5. Also save the Markdown source as `03-rules-card.md`.

### Required sections (in this order, with this exact tone)

#### Top banner

- Big colorful title: **"STAR BITE DINER — Quick rules"**

#### Section 1: "Your job"

```
Train the diner's robots by giving correct labels.
But beware — some of you are SABOTEURS, secretly giving wrong labels.
```

#### Section 2: "What to do at each station"

A 3-row visual table:

```
🔥 GRILL BOT      | Look at the patty. Tell the bot: rare or done?
🗑️ TRASH SORTER  | Look at the item. Pick: recycle, compost, or landfill.
🔍 REVIEW & SECURITY | Look at recent labels. Spot anything wrong? Hit the 🚩 flag button.
```

Format this as a real table or as 3 boxes side-by-side. Use the emoji icons.

#### Section 3: "Win conditions"

```
✅ CREW WINS if customer satisfaction stays above 85% when time runs out,
   OR all saboteurs are voted out.

❌ SABOTEURS WIN if satisfaction crashes to 0%, or time runs out with at
   least one saboteur still active.
```

#### Section 4: "The key skill"

A pull-quote in larger font:

> **"Watch the data, not the people."**
>
> The Review station is where you spot bad labels. Look at what the bots are
> being taught. If a label looks wrong, flag it. Saboteurs blend in. The data doesn't.

#### Section 5: "How to play"

A quick numbered list:

1. Use WASD or arrow keys to move
2. Walk up to a station and click it to enter
3. Make your label choice (or drag the item)
4. Click "Leave" when done — keep moving!
5. Call an emergency meeting if you have a hunch (limited per round)

#### Footer

Tiny text: "Star Bite Diner — designed by [your team's names] for [course name], 2026"

### Tips for layout

- Use a single page — don't go to 2.
- Use color sparingly: 1 accent color is enough.
- Make the section headers bold and slightly larger than body text.
- Print preview before downloading: **File → Print → see how it looks**. If text gets cut off, shrink fonts.

---

# Tone guide (applies to all 3 deliverables)

- **Warm, friendly, slightly silly.** This is for 9-to-13-year-olds, not a corporate training.
- **No condescension** ("Listen here, kids!") — speak to them like capable people.
- **No jargon in the pre-game material or rules card.** Save AI / model / training data / data poisoning for the debrief deck.
- **The bot is never the enemy.** It's the team's trainee. "We're responsible for what we teach it."
- **Saboteurs are goofy mischief, not threatening.** No scary language.

---

# Quality bar

A good debrief deck:
- Doesn't lecture for 15 minutes — leaves room for student discussion on at least 2 slides
- Connects gameplay moments back to real-world AI students actually use
- Frames mistakes as data problems, not "stupid AI"
- Includes at least one moment where students share their own opinions

A bad debrief deck:
- Is just a wall of text definitions
- Uses scary "AI is dangerous" framing
- Talks down to students
- Drops jargon without grounding it in what just happened in the game

---

# 🚀 How to upload your work to GitHub

You'll upload your finished documents to the project repo using GitHub's website. No coding tools — just clicks.

### One-time setup (only the first time)

1. Make sure Hara has added you as a collaborator. You should have an email invite. Click **Accept invitation**.
2. Go to **github.com** and sign in.
3. Visit `https://github.com/haramor/starbite`. You should see all the project files. If 404, message Hara.

### Step-by-step upload

#### 1. Create the teacher folder

We need a folder at `docs/teacher/`. It probably doesn't exist yet — that's fine. Here's how to create it:

- Go to `https://github.com/haramor/starbite/tree/main/docs`
- Click **Add file** → **Create new file**
- In the filename box at the top, type **exactly**: `teacher/.gitkeep`
  - The `/` makes GitHub treat the part before as a folder name
  - `.gitkeep` is just a placeholder so the folder isn't empty
- Leave the file content empty
- Scroll down, click **Commit changes** → **Commit changes**

The folder now exists at `docs/teacher/`.

#### 2. Upload your 5 files

- Navigate to `https://github.com/haramor/starbite/tree/main/docs/teacher`
- Click **Add file** → **Upload files**
- Drag and drop your 5 files into the drop zone:
  1. `01-pregame-script.md` (export from Google Docs as Markdown, or copy-paste into a `.md` file using a text editor)
  2. `02-debrief-deck.pdf` (the exported PDF from Google Slides)
  3. `02-debrief-outline.md` (the Markdown outline)
  4. `03-rules-card.pdf` (the exported PDF from Google Docs)
  5. `03-rules-card.md` (the Markdown source)
- Wait for the files to finish uploading (small green checkmarks appear next to each)
- Below the drop zone, type a commit message: **"Add teacher classroom materials"**
- Make sure **"Commit directly to the main branch"** is selected
- Click the green **Commit changes** button

#### How to export from Google Docs as Markdown

Google Docs doesn't have a built-in Markdown export, but here's the easiest workaround:

1. **Option A:** Open the doc → File → Download → Plain text (.txt). Open the .txt file. Copy/paste contents into a new file in any text editor. Save as `01-pregame-script.md` (just change the extension to `.md`).
2. **Option B:** Use the free [Docs to Markdown](https://workspace.google.com/marketplace/app/docs_to_markdown/700168918607) Google Workspace add-on if you've used it before.

#### 3. Verify

Go to `https://github.com/haramor/starbite/tree/main/docs/teacher` and confirm all 5 files are visible.

#### 4. Tell the team

Send Hara a message: "Classroom materials are up at `docs/teacher/`. Pre-game script, debrief deck (PDF + outline), rules card (PDF + Markdown). Ready to be tested in playtest."

---

# Common questions

**"Can I use someone else's slide deck as inspiration?"**
Yes — search YouTube for "AI literacy classroom" and watch a few classroom videos. Don't copy directly, but borrow ideas. Cite anything you adapt heavily.

**"What if I want to add more slides than 8?"**
Up to ~10 slides total is fine. More than that and the debrief drags past 15 min. Cut anything that's not essential.

**"My deck is going to be used in a real classroom — should I include curriculum standards?"**
Optional but nice. Add a single line at the bottom of slide 1 like: "Aligned with [your state/district] standards on AI literacy [insert standard code]." Look up your local standards if you want to be thorough.

**"What if the team's deployed game URL has changed when teachers actually use this?"**
Use a placeholder like `[live game URL]` in the script and rules card. Hara will fill in the real URL right before delivery.

**"I'm worried I won't finish in 4 hours."**
Prioritize in this order:
1. Pre-game script (1 hr) — must-have
2. Rules card (1 hr) — must-have
3. Debrief deck (2 hr) — must-have for grading

If you're truly out of time on the debrief deck, **at minimum deliver the Markdown outline (no slides)** — that's grade-able as a teaching plan even without the visual deck.

---

You're great. The pedagogy of this entire project lives in your work. The kids will play and have fun, but they LEARN because of how you frame what they just experienced. That's huge.
