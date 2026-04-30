# Helper Task 1 — Label content writer

Hi! Thanks for helping with **Star Bite Diner**, our AI literacy game. Your job is to write the **data the bots learn from**. The whole game depends on this content being clear and unambiguous, so you have one of the most important jobs on the team. There's no real coding involved — you'll be writing examples and short customer orders.

**Estimated time:** 3–5 hours total
**Tools you need:** A web browser. That's it.

---

## What is the game?

Star Bite Diner is a multiplayer game (5–10 players, ages 9–13) about training AI bots in a space restaurant. Players label examples to teach the bots how to do their jobs. Some players are secretly **saboteurs** giving wrong labels.

There are 3 stations in the game:
- **🔥 Grill Bot** — players decide if a burger is `rare` or `done`
- **🗑️ Trash Sorter** — players decide if an item goes in `recycle`, `compost`, or `landfill`
- **🔍 Review & Security** — players audit recent labels and remove suspicious ones

Every 30 seconds, a customer walks up and orders something. The bots try to fulfill the order based on what they've been trained on. **The accuracy of each bot depends on the labels you write.**

---

## What you're delivering

Three files in the GitHub repo. You're going to add more entries to each:

1. **`content/grill.json`** — burger patty examples (binary: `rare` or `done`)
2. **`content/trash.json`** — trash items (3 categories: `recycle`, `compost`, `landfill`)
3. **`content/orders.json`** — customer orders that combine the two

There are **starter examples already in those files** (12 burgers, 15 trash items, 7 orders). You'll add more so we have at least 40 of each.

---

# The Golden Rule

> **Every example you write must be 100% unambiguous.** A reasonable 9-year-old looking at it must give the right answer with no debate.

If you find yourself writing "well, it depends" or "could be either" — **delete it and try again**. We can add ambiguous examples in v2 of the game. For now, every example needs an obvious correct answer.

This matters because the game teaches kids that **bad data poisons the model**. If a "correct" example is actually ambiguous, kids will second-guess themselves and not trust the system.

---

# A 60-second crash course on the file format (JSON)

The files you'll edit are **JSON** files. JSON is just a way to write a list of items in a structured format. You don't need to learn JSON deeply — just these 4 rules:

**Rule 1.** The whole file is wrapped in `[` and `]` (square brackets):
```json
[
  ... your entries go here ...
]
```

**Rule 2.** Each entry is wrapped in `{` and `}` (curly braces) and looks like this:
```json
{ "id": "g_013", "emoji": "🍔", "description": "Your text", "groundTruth": "rare" }
```

**Rule 3.** Entries are separated by commas. Every entry except the LAST one needs a comma after the closing `}`.

```json
[
  { "id": "g_013", ... },     ← comma after }
  { "id": "g_014", ... },     ← comma after }
  { "id": "g_015", ... }      ← NO comma after the last one
]
```

**Rule 4.** Text values go in `"double quotes"`. Numbers don't need quotes. The keys (`"id"`, `"emoji"`, etc.) ALWAYS need double quotes.

That's it. If you mess up a comma, the file will still go in but it'll be broken. **There's a free tool that catches mistakes:** [jsonlint.com](https://jsonlint.com) — paste your file content there and it'll point out any mistakes in plain English.

---

# 📋 File 1: `grill.json` — burger patties

**Goal: 40 entries total.** There are 12 already; add ~28 more.

### Format for each entry (copy this template and edit the parts in brackets)

```json
{ "id": "g_013", "emoji": "🍔", "description": "[your sensory description]", "groundTruth": "[rare OR done]" }
```

### Field rules

- **`id`** — sequential `g_013`, `g_014`, ... (the existing file ends at `g_012`, so start at `g_013`). All lowercase, no spaces.
- **`emoji`** — always `🍔` (or `🥩` for variety, your call)
- **`description`** — 6 to 14 words. Sensory cues: color, firmness, sear, temperature, time on grill. Like a real chef's notes.
- **`groundTruth`** — exactly the word `rare` or the word `done`. (Lowercase, in double quotes.)

### Good descriptions ✅

- "Pale, raw pink throughout, no sear marks at all" → rare
- "Crispy dark crust on both sides, no pink remaining, smells smoky" → done
- "Limp and floppy, blood pooling on the plate" → rare
- "Patty holds shape firmly, deep brown color, piping hot" → done
- "Just placed on the grill, no color change yet" → rare
- "Patty looks scared, still mooing" → rare *(funny ones are encouraged)*

### Bad descriptions ❌ (do NOT write these)

- "A burger" — too vague
- "Medium-rare with a pink center" — ambiguous (medium-rare isn't "rare" or "done" in our binary)
- "Pink in the middle, brown on the outside" — could be either, depends on how pink
- "Cooked some" — no useful detail
- "It's cooked" — doesn't help anyone tell the difference

### Mix it up

- Roughly 50/50 rare vs. done
- Vary your vocabulary across entries (don't write "pink" 20 times)
- Throw in a few funny ones — kids respond to humor

---

# 🗑️ File 2: `trash.json` — trash items

**Goal: 40 entries total.** There are 15 already; add ~25 more.

### Format for each entry

```json
{ "id": "t_016", "name": "[short item name]", "emoji": "[fitting emoji]", "groundTruth": "[recycle OR compost OR landfill]" }
```

### Field rules

- **`id`** — sequential `t_016`, `t_017`, ... (the existing file ends at `t_015`)
- **`name`** — short, kid-recognizable label (under 25 characters)
- **`emoji`** — pick a fitting one. If you don't know what to use, search [emojipedia.org](https://emojipedia.org) for the item name and copy from there.
- **`groundTruth`** — exactly the word `recycle`, `compost`, or `landfill`

### Quick reference (real-world rules)

- **recycle** → clean paper, cardboard, glass, metal, hard plastics with the recycling symbol
  - Examples: water bottle, soda can, glass jar, newspaper, cardboard box, tin foil, milk jug
- **compost** → food scraps, plant waste, used napkins, coffee grounds, eggshells
  - Examples: banana peel, apple core, lettuce leaves, used napkin, coffee grounds, eggshells, bread crust
- **landfill** → styrofoam, chip bags, used gum, plastic straws, broken ceramics, plastic candy wrappers
  - Examples: styrofoam cup, chip bag, plastic straw, candy wrapper, used chewing gum

### ⚠️ Watch out for tricky ones — skip these

For v1 of the game, **avoid items that have ambiguous answers**:

- ❌ Greasy pizza box (some places recycle, some don't)
- ❌ Plastic shopping bags (depends on region)
- ❌ Paper coffee cups with wax/plastic lining
- ❌ Aluminum foil with food residue
- ❌ Anything with batteries (special disposal)

If you're not 100% sure, skip it. Only use items where ALL adults would agree on the answer.

### Mix it up

- Roughly 1/3 in each category (recycle / compost / landfill)
- Include kid-recognizable items (juice box, lunch wrapper, school papers, etc.)
- Avoid brand names (e.g., "Pepsi can" — just write "soda can")

---

# 🍽️ File 3: `orders.json` — customer orders

**Goal: 20 entries total.** There are 7 already; add ~13 more.

Each order is a recipe of "what the bots need to get right." The game randomly picks one every 30 seconds.

### Format for each entry

```json
{
  "id": "o_008",
  "customerName": "Borp the Smug",
  "flavorText": "Rare burger, please compost the apple core.",
  "requirements": [
    { "stationId": "grill", "expectedValue": "rare" },
    { "stationId": "trash", "expectedValue": "compost" }
  ]
}
```

### Field rules

- **`id`** — sequential `o_008`, `o_009`, ...
- **`customerName`** — invent fun space-y names. See "name ideas" below.
- **`flavorText`** — 1 sentence the customer says when they walk up. **Funny is good.** Keep under 15 words.
- **`requirements`** — an array (list) of station requirements. Each one is:
  - **`stationId`** — `"grill"` or `"trash"` only
  - **`expectedValue`** — what the bot should produce:
    - For grill: `"rare"` or `"done"`
    - For trash: `"recycle"`, `"compost"`, or `"landfill"`

### Single-station vs. two-station orders

**Single-station order** — only one requirement. Quicker, easier wins.

```json
{
  "id": "o_009",
  "customerName": "Pip-3",
  "flavorText": "Just a done burger, hold the planet-destruction.",
  "requirements": [
    { "stationId": "grill", "expectedValue": "done" }
  ]
}
```

**Two-station order** — both grill and trash requirements. More interesting.

```json
{
  "id": "o_008",
  "customerName": "Borp the Smug",
  "flavorText": "Rare burger, please compost the apple core.",
  "requirements": [
    { "stationId": "grill", "expectedValue": "rare" },
    { "stationId": "trash", "expectedValue": "compost" }
  ]
}
```

### Mix of order types (aim for this ratio)

- ~30% single-station orders (just grill OR just trash)
- ~70% two-station orders (one of each)

### Customer name ideas

- **Sci-fi names:** Captain Zorp, Pip-3, Bleep-9, Glorbax the Mighty, Empress Astra
- **Mashup names:** Lord Snorf McGoo, Doctor Pickle, Sir Pickleton, Greg from Mars, Uncle Cosmos
- **Cute alien names:** Bibblo, Squishy Steve, The Fluffening, Babs the Blob, Wuzz, Floof

Avoid:
- Real human names (one of your classmates might feel singled out)
- Anything mean or political
- Names over 20 characters (UI gets cramped)

### Good orders ✅

- "Rare burger and compost my apple core, please" — clear, two stations
- "Just a done burger, hold the planet-destruction" — single station, fun voice
- "RECYCLE THIS CAN OR I WILL CRY VERY LOUDLY" — fun voice, single station
- "First time here! What's a 'compost'?" — silly, single station

### Don't ❌

- Use stations that don't exist (we only have grill and trash — no `clean`, no `review`)
- Use values that don't exist (no "medium" — only "rare" and "done"; no "garbage" — only "landfill")
- Make orders impossible to fulfill
- Repeat the same flavor text twice

---

# Tips for working efficiently

- **Knock out 10 entries at a time, then take a break.** Don't try to do all 40 burgers in one sitting — your judgment gets fuzzy.
- **Keep this doc open in another tab** while working so you can refer to the rules.
- **When stuck on what to write,** describe your real lunch from yesterday. Real food works great.
- **Don't sweat being clever every time.** Plain, clear examples are better than confusingly clever ones. Funny is bonus, not required.
- **Draft in a Google Doc first** if JSON syntax is making you nervous. Write your entries one per line in the format shown above, get them all good, THEN paste them into the GitHub file as a batch.

---

# 🚀 How to commit your work to GitHub

You'll edit each file directly in your web browser using GitHub's editor. No terminal, no apps, no setup — just clicks. Here's the exact step-by-step.

### One-time setup (only the first time)

1. Make sure Hara has added you as a collaborator on the repo. You should have an email invite at the email address you gave her. Click **Accept invitation** in that email.
2. Go to **github.com** and sign in.
3. Visit `https://github.com/haramor/starbite`. You should be able to see the files. If it says "404 Not Found," your invitation didn't go through — message Hara.

### Editing one of the JSON files (do this 3 times — once per file)

We'll use **`grill.json`** as the example. The same steps work for `trash.json` and `orders.json`.

#### 1. Navigate to the file

Open this URL in your browser:
```
https://github.com/haramor/starbite/blob/main/content/grill.json
```

You'll see the contents of the file with line numbers down the left side.

#### 2. Click the pencil icon

Near the top right of the file viewer, there's a row of icons. Look for the **pencil ✏️ icon** (it says "Edit this file" when you hover). Click it.

You're now in GitHub's web editor. The file is shown as a big text box you can edit.

#### 3. Add your entries

The file currently looks like this:
```json
[
  { "id": "g_001", "emoji": "🍔", ... },
  ... more entries ...
  { "id": "g_012", "emoji": "🍔", "description": "Crusty, dark on the outside, fully heated inside", "groundTruth": "done" }
]
```

Notice: the **last entry (`g_012`) does NOT have a comma after `}`**. The very last `]` closes the file.

You'll add your entries between `g_012` and the closing `]`. **First, add a comma after `g_012`** (because it's no longer the last entry). Then add your entries, one per line, separated by commas. Make sure your VERY LAST entry does not have a comma.

Example of what it'll look like after your edits (with 3 new entries):

```json
[
  { "id": "g_001", "emoji": "🍔", ... },
  ...
  { "id": "g_012", "emoji": "🍔", "description": "Crusty, dark on the outside, fully heated inside", "groundTruth": "done" },
  { "id": "g_013", "emoji": "🍔", "description": "Pale and raw, pink in the middle", "groundTruth": "rare" },
  { "id": "g_014", "emoji": "🍔", "description": "Charred edges, fully cooked through", "groundTruth": "done" },
  { "id": "g_015", "emoji": "🍔", "description": "Cool middle, surface barely seared", "groundTruth": "rare" }
]
```

Notice how `g_012`, `g_013`, `g_014` all have commas, but `g_015` (the new last one) does not.

#### 4. Validate before you commit

Before saving, copy the ENTIRE contents of the file (Cmd-A then Cmd-C on Mac, Ctrl-A then Ctrl-C on Windows). Open [jsonlint.com](https://jsonlint.com) in another tab. Paste your content. Click **Validate JSON**.

- ✅ If it says "Valid JSON" — go back to GitHub and continue.
- ❌ If it shows an error — read the error message. Most common is a missing comma or extra comma. Fix it in GitHub's editor, copy the file again, re-validate. Repeat until valid.

#### 5. Commit your changes

Scroll down past the file editor. You'll see a section titled **Commit changes**.

- In the first text field, write a short message like: **"Add 28 more burger examples"** or whatever describes what you did.
- Leave the optional description blank (or add notes if you want).
- Make sure **"Commit directly to the `main` branch"** is selected.
- Click the green **Commit changes** button.

That's it. Your changes are saved and live. You can verify by going back to `https://github.com/haramor/starbite/blob/main/content/grill.json` — your new entries should be visible.

#### 6. Repeat for the other files

Do the same process for:
- `https://github.com/haramor/starbite/blob/main/content/trash.json`
- `https://github.com/haramor/starbite/blob/main/content/orders.json`

### After you commit all 3 files

Send Hara a message: "Done with content! All 3 files committed."

She'll pull the changes into the running game and verify everything works. If she finds an entry that's accidentally ambiguous or has a typo, she'll either fix it directly or ping you with a question.

---

# Common questions

**"What if I don't know if something is rare or done?"**
Skip it. Only write entries where you're 100% sure.

**"Can I look up answers online?"**
Yes! For trash sorting especially, [Earth911.com](https://earth911.com) and your local city's recycling guide are great sources.

**"GitHub looks scary. What if I break something?"**
You can't really break it. Every change you make is recorded and reversible. If something goes wrong, Hara can restore the previous version with one click. Don't be afraid to commit.

**"What if jsonlint says I have an error and I can't figure out what's wrong?"**
Take a screenshot of the error message, paste your file content into a Google Doc, and send both to Hara with the words "JSON error help." She or her Claude can spot the issue in 10 seconds.

**"My emoji isn't showing up, what do I do?"**
Open emojipedia.org in another tab, search for the emoji you want, copy it from there, paste it into the file. Some keyboards don't have all emoji available.

**"I finished early! What can I do to help more?"**
Two great options:
1. Add MORE entries to each file (60 per file is even better than 40 — variety is good).
2. Write a "v2 ideas" doc with intentionally ambiguous examples we could add later. Examples like: "Pink center but a charred outside" → genuinely ambiguous. We'll use these for advanced rounds in v2.

**"I'm worried it's not good enough."**
Don't be. Wrong-is-better-than-missing. Commit what you have. Hara/Claude can do a quick polish pass on individual entries if needed.

---

You're great. Have fun. The kids playing this game will be picking up training data **you wrote** — that's the whole point of the game's pedagogy. Your work is what teaches them.
