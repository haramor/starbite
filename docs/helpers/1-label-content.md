# Helper Task 1 — Label content writer

Hi! Thanks for helping with **Star Bite Diner**, our AI literacy game. Your job is the most important non-coding job on the team: you're going to write the data the bots learn from. The whole game depends on this content being clear and unambiguous.

**Estimated time:** 3–5 hours
**Tools:** any text editor (VS Code, Notepad, even Google Docs — but you'll paste into JSON files at the end)

---

## What is the game?

Star Bite Diner is a multiplayer game (5–10 players) about training AI bots in a space restaurant. Players label examples to teach the bots how to do their jobs. Some players are secretly **saboteurs** who try to give wrong labels.

There are **3 stations** in the game. Two of them need labeled training examples (Grill, Trash Sorter), and the third station (Review) audits what's been labeled. Customers come in every 30 seconds and order things; the bots try to fulfill the order based on what they've been trained on. **The accuracy of each bot is determined by the labels you write.**

---

## What you're making

You'll fill in **3 JSON files** in the `/content/` folder:

1. **`grill.json`** — patty examples (binary: `rare` or `done`)
2. **`trash.json`** — trash items (3-class: `recycle`, `compost`, `landfill`)
3. **`orders.json`** — customer order templates

There are **starter examples already in those files**. Your job: get each file to **at least 40 entries** (more is better), with the same format and style.

---

## The Golden Rule

> **Every example must be 100% unambiguous.** A reasonable 9-year-old looking at it must give the right answer with no debate.

If you find yourself writing "well, it depends" or "could be either" — **delete it and try again**. We can add ambiguous examples in v2 of the game. For now, every example needs an obvious correct answer.

This matters because: the game teaches kids that **bad data poisons the model**. If a "correct" example is actually ambiguous, kids will second-guess themselves and not trust the system.

---

## File 1: `grill.json` — burger patties

**Goal: 40 examples total.** Already started; add ~28 more.

**Format (one entry per line, in a JSON array):**
```json
{ "id": "g_013", "emoji": "🍔", "description": "Bright pink center, soft to the touch, just placed on the grill", "groundTruth": "rare" }
```

**Rules:**
- `id` — sequential `g_013`, `g_014`, ... (no gaps)
- `emoji` — always `🍔` (or `🥩` if you want some variation)
- `description` — 6–14 words. Sensory cues: color, firmness, sear, temperature, time on grill. Like a real chef's notes.
- `groundTruth` — exactly `"rare"` or `"done"`. No other values.

**Good descriptions:**
- "Pale, raw pink throughout, no sear marks at all" → rare
- "Crispy dark crust, no pink remaining, smells smoky" → done
- "Limp and floppy, blood pooling on the plate" → rare

**Bad descriptions (do NOT write these):**
- "A burger" — too vague.
- "Medium-rare with a pink center" — ambiguous (medium-rare isn't "rare" or "done").
- "Pink in the middle, brown on the outside" — could be either; depends.
- "Cooked some" — no useful detail.

**Mix it up:** roughly 50/50 rare vs. done. Vary your vocabulary across entries (don't reuse "pink" 20 times). Add some funny ones like "Patty looks scared, still mooing" → rare.

---

## File 2: `trash.json` — trash items

**Goal: 40 examples total.** Already started; add ~25 more.

**Format:**
```json
{ "id": "t_016", "name": "Used pizza box (clean half)", "emoji": "🍕", "groundTruth": "recycle" }
```

**Rules:**
- `id` — sequential `t_016`, `t_017`, ...
- `name` — short label, kid-recognizable
- `emoji` — pick a fitting emoji (search [emojipedia.org](https://emojipedia.org))
- `groundTruth` — exactly `"recycle"`, `"compost"`, or `"landfill"`

**Quick reference (use real-world recycling rules):**
- **recycle** → clean paper, cardboard, glass, metal, hard plastics with recycling symbol
- **compost** → food scraps, plant waste, used napkins, coffee grounds, eggshells
- **landfill** → styrofoam, chip bags, used gum, plastic straws, broken ceramics, soiled paper

**⚠️ Watch out for tricky ones (skip these for v1):**
- Greasy pizza box (some places recycle, some don't) — already in file as landfill, fine
- Plastic bags (depends on region) — skip
- Paper cups with wax/plastic lining — skip
- Broken glass — skip (too sharp for a kids' game theme too)

**Good entries:**
- Cardboard cereal box → recycle
- Apple core → compost
- Plastic candy wrapper → landfill

**Aim for variety:** roughly 1/3 in each category. Include some kid-relatable items (juice box, lunch wrapper, etc.).

---

## File 3: `orders.json` — customer orders

**Goal: 20 orders total.** Already started; add ~13 more.

Each order is a recipe of "what the bots need to get right." The game randomly picks one every 30 seconds.

**Format:**
```json
{
  "id": "o_008",
  "customerName": "Borp the Smug",
  "flavorText": "I'll have a rare burger and please compost my apple core.",
  "requirements": [
    { "stationId": "grill", "expectedValue": "rare" },
    { "stationId": "trash", "expectedValue": "compost" }
  ]
}
```

**Rules:**
- `id` — sequential `o_008`, `o_009`, ...
- `customerName` — invent fun space-y names: Captain Zorp, Pip-3, Madame Vex, Lord Snorf, etc.
- `flavorText` — 1 sentence the customer says when they walk up. Funny is good. Keep it under 15 words.
- `requirements` — array of station + expected value. Allowed:
  - `stationId` is `"grill"` or `"trash"`
  - `expectedValue` for grill: `"rare"` or `"done"`
  - `expectedValue` for trash: `"recycle"`, `"compost"`, or `"landfill"`

**Mix of order types (aim for this ratio):**
- ~30% single-station orders (just grill OR just trash) — quicker, easier wins
- ~70% two-station orders (one of each) — more interesting

**Good orders:**
- "Rare burger and compost my apple core" — clear, two stations
- "Just a done burger, hold the planet-destruction" — single station, fun voice
- "Recycle this can like your life depends on it" — single station, fun voice

**Don't:**
- Use stations that don't exist (we only have grill and trash)
- Use values that don't exist (no "medium" — only "rare" and "done")
- Make orders impossible to fulfill

---

## Format gotchas

- **JSON is strict.** Every `{ }` needs a closing `}`. Every list of items needs commas between, but **no comma after the last item**. Every key must be in `"double quotes"`.
- **Test it before delivering:** paste your final file into [jsonlint.com](https://jsonlint.com) — if it says "valid JSON," you're good.
- If you'd rather work in a spreadsheet, do that, then I (or Claude) can convert it. But the cleanest delivery is the JSON file directly.

---

## Where to put your work

When done, send the 3 finished files to **Hara**, who will commit them to the repo. Or if you have GitHub access, you can edit the files directly in the `/content/` folder of the `starbite` repo.

---

## Questions / when stuck

- Ground truth feels ambiguous? **Skip the example.** Better 35 great examples than 50 mediocre ones.
- Don't know what value to use? Default to: grill = "done", trash = "landfill".
- Stuck on funny names? Try: rhyming, sci-fi mashups (Spork-9, Orbital Greg), or food-related (Sir Pickleton).

You're great. Have fun. The kids will be picking up training data **you wrote** to learn how AI works.
