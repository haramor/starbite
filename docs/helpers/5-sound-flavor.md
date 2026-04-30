# Helper Task 5 — Sound + flavor text

> ## ⚠️ PARTIALLY COMPLETED — 2026-04-30
>
> **Flavor text (Part B) is done.** Delivered to `/content/flavor.md`:
> - 50 customer names (sci-fi, mashup, cute alien, title-style)
> - 35 customer flavor lines (polite, excited, tired, demanding, confused, playful)
> - Robot voice lines for all 3 bots × 3 situations (correct, wrong, idle)
>
> **Sound effects (Part A) still need a human.** I can't download/preview audio files reliably. If you can do Part A, the existing instructions below still apply — just skip Part B.

---

Hi! Thanks for helping with **Star Bite Diner**. Your job is the polish layer that turns a technically-working game into something that *feels* alive: **sound effects + character/customer/order voice.**

**Estimated time:** 2–3 hours
**Tools you need:** A web browser, basic file management (downloading and unzipping). No audio editing or coding required.

---

## What is the game?

A 5-to-10-player web game (ages 9–13) about training AI bots in a space diner. Players label data at training stations to train the bots. Some players are saboteurs giving wrong labels. Customers come in every 30 seconds and react to how well the bots did.

Right now the game is **silent** and the customers / robots / orders all have placeholder names. You're going to fix both.

---

# Part A — Sound effects (~1.5 hours)

The game needs ~12 short sound effects. We'll use **Kenney audio packs** — same as Helper 2 used for art. CC0 (public domain), free, no signup, no attribution required.

## Step 1 — Download the audio packs

Open each link below in a new tab. Each one downloads as a ZIP file.

### Required packs

1. **[Interface Sounds](https://kenney.nl/assets/interface-sounds)** — clicks, beeps, chimes, alerts. Most of our SFX come from here.
2. **[UI Audio](https://kenney.nl/assets/ui-audio)** — more UI sounds (overlap with above; pick whichever has the better sound for each)
3. **[Sci-Fi Sounds](https://kenney.nl/assets/sci-fi-sounds)** — for alien customer reactions and the meeting alarm
4. **[Casino Audio](https://kenney.nl/assets/casino-audio)** — has GREAT happy/win chimes for satisfied customers

### How to download a pack

1. Open the link.
2. Scroll past the description.
3. Click the big purple **Download** button. A ZIP file downloads.
4. In your Downloads folder, double-click the ZIP to unzip it.
   - On Mac: it creates a folder.
   - On Windows: right-click → "Extract All" → choose where to extract.

### Where to put them

Make a folder on your Desktop called `starbite-audio-source/` and put all 4 unzipped folders inside:

```
Desktop/
└── starbite-audio-source/
    ├── kenney_interface-sounds/
    ├── kenney_ui-audio/
    ├── kenney_sci-fi-sounds/
    └── kenney_casino-audio/
```

These are just for browsing — you'll pick a few from each.

## Step 2 — Pick the 12 sounds you need

For each row in the table below, browse the source pack's audio files (you can preview them by double-clicking each file — it'll play in your default audio player), pick one that fits, and **make a copy** with the new name.

Your destination folder is `starbite-audio-final/` on your Desktop.

```
Desktop/
└── starbite-audio-final/
    ├── sfx_click.mp3
    ├── sfx_label_correct.mp3
    └── ... (etc)
```

### The full sound list

| Filename                  | What plays it (game moment)                       | What to look for in source packs |
| ------------------------- | ------------------------------------------------- | -------------------------------- |
| `sfx_click.mp3`           | Any UI button press                               | Soft click — "click" or "tick" in interface-sounds |
| `sfx_label_correct.mp3`   | Player submits a correct label                    | Cheerful chime, "ding!" — UI Audio or Casino |
| `sfx_label_wrong.mp3`     | Wrong label submitted                             | Brief "wah-wah" or low buzz — interface-sounds "error" |
| `sfx_flag.mp3`            | Flagging at Review                                | Satisfying "thunk" or stamp — UI Audio |
| `sfx_customer_happy.mp3`  | Happy customer outcome                            | Bright "yum!" / chime — Casino Audio's win sounds |
| `sfx_customer_confused.mp3`| Confused customer                                 | Rising "huh?" or 3-note questioning chime |
| `sfx_customer_angry.mp3`  | Angry customer                                    | Grumpy alien sound or table thump — Sci-Fi |
| `sfx_alert.mp3`           | Accuracy drop banner appears                      | Quick "alert!" beep — interface-sounds |
| `sfx_meeting.mp3`         | Emergency meeting called                          | Klaxon / siren (3 sec max, NOT scary) — Sci-Fi |
| `sfx_eject.mp3`           | Player ejected at end of meeting                  | "Whoosh" / pop — UI Audio |
| `sfx_win.mp3`             | Crew wins at end of round                         | Triumphant fanfare (~3s) — Casino "jackpot" sounds |
| `sfx_lose.mp3`            | Saboteurs win                                     | Sad-trumpet / "wah wah waaaa"  — interface-sounds |

### How to preview an audio file

- **Mac:** select the file in Finder → press space bar → it plays. Press space again to stop.
- **Windows:** double-click the file → opens in default player → close player when done.

### How to rename a file

- **Mac:** click the file once, press Enter, type the new name (including `.mp3`), press Enter again.
- **Windows:** right-click → "Rename" → type new name including `.mp3`.

Each file you copy from the source packs needs to be renamed to **exactly** the name in the table. Lowercase, underscores not dashes, ends in `.mp3`.

### What if a sound is `.ogg` or `.wav` instead of `.mp3`?

Both `.ogg` and `.wav` are fine — the browser plays them. Just rename the extension to match the source. For example, if you find `sfx_meeting.ogg`, the code can use it as long as you tell Hara the extension. Easier: convert to `.mp3` using [online-audio-converter.com](https://online-audio-converter.com) (free, no signup):

1. Go to [online-audio-converter.com](https://online-audio-converter.com)
2. Click **Open files**, pick your audio file
3. Click the **mp3** format button
4. Click **Convert**
5. Click **Download** when ready
6. Rename to match the expected name

## Step 3 — Volume normalization (optional but nice)

If some of your SFX are way louder than others, the game's audio mix will be jarring. The fix: free online tool [www.online-volume-normalizer.com](https://www.online-volume-normalizer.com) (free, no signup).

For each sound:
1. Upload it
2. Set target loudness to **-16 LUFS** (just leave the default if unsure)
3. Download

Or skip this step entirely. It's a polish thing — the game works without it.

## Step 4 — Quality check

Listen to each of your 12 final files in order. Ask yourself:
- Is it under 3 seconds (under 5 for win/lose)? ✅
- Is it cartoonish / friendly, not scary / harsh? ✅
- Is it the right vibe for what triggers it? ✅

If any sound feels off, swap it for a different one from the source packs. **Don't overthink** — pick the first one that works, save iteration for later.

## Step 5 — Bonus (optional): background music

Want to make the lobby feel like a real diner? Find a loopable, mellow, retro-futuristic-jazz instrumental.

- Source: [Kenney Music Jingles](https://kenney.nl/assets/music-jingles) or search [freesound.org](https://freesound.org) for "lounge loop" filtered by CC0 license
- Save as **`bgm_lobby.mp3`**
- Under 60 seconds, loops cleanly (no obvious "end" — sounds the same throughout)

---

# Part B — Flavor text (~1 hour)

The game needs personality. Right now customer names are bland and orders all sound the same. You're going to write the diner's voice.

You'll deliver **3 lists** in a Google Doc or similar. Format is flexible — just be clear.

## List 1: Customer names (40+ names)

Mix of styles. Aim for funny, kid-friendly, never mean. Examples:

- **Sci-fi style:** Captain Zorp, Pip-3, Bleep-9, Glorbax the Mighty, Lord Snorf
- **Mashup style:** Empress Spaghetti, Greg from Mars, Doctor Pickle, Sir Pickleton
- **Cute alien:** Bibblo, Squishy Steve, The Fluffening, Doctor Pickle, Wuzz, Floof
- **Title style:** Madame Vex, Captain Sundae, Professor Wubbles, Cheese Lord

Avoid:
- Real human names (we don't want any kid feeling singled out)
- Anything mean / political / weird in any language
- Names over 20 characters (UI gets cramped)

### Format

A Google Doc list with one name per line:

```
Captain Zorp
Pip-3
Bleep-9
Glorbax the Mighty
Lord Snorf McGoo
Empress Spaghetti
Greg from Mars
Madame Vex
... (40 more)
```

Goal: 40+ names. **Aim for 60 if you can** — variety makes the game feel deeper.

## List 2: Customer flavor lines (25+ short lines)

These play when a customer walks up to order. Variety matters; the customer's personality should come through in 1 line.

### Format

A Google Doc list with one line per row:

```
"I'd like a rare burger and please compost my apple core."
"Burger fully cooked! Earth biology is so weird."
"Oh dear, just a done patty please. My tentacles are tired."
"RECYCLE THIS CAN OR I WILL CRY VERY LOUDLY."
"Hi! First time here. What's a 'compost'?"
"Done burger, please. I have a blob to feed."
... (20 more)
```

Each line should be:
- Under 12 words (UI gets cramped)
- Reference food, trash, or both (since those are the stations)
- Have personality — funny, weird, polite, demanding, confused, curious

These lines will get matched up with order types in the game. Don't worry about which line goes with which order — the team will pair them.

## List 3: Robot / station personality bits (~10 of each)

Short flavor lines our 3 bots could "say." Think Pixar movie sidekick energy — silly, brief.

For each of the 3 bots — **Grill Bot**, **Trash Sorter**, **Review Bot** — write 5–10 short lines (under 10 words each) for these 3 contexts:

### Format

```
## Grill Bot

Got a correct label:
- "OH YES, beautiful!"
- "[chef's kiss]"
- "Got it, boss!"
- "Sizzle level: optimal!"
- "Patty status: yes."

Got a wrong label (revealed when customer reacts):
- "Wait. That can't be right."
- "Did I... mess up?"
- "I learned a lie!"
- "My circuits are confused."
- "That patty did NOT taste right."

Idle (nobody's at the station):
- "Hello? Anybody there?"
- "I'm so ready to learn!"
- "Sizzle sizzle sizzle... beep."
- "Burger? I love burger."

## Trash Sorter

(same 3 sections, 5–10 lines each)

## Review Bot

(same 3 sections, 5–10 lines each)
```

These might get used as tooltips, alert banners, end-screen flavor, or future "robot speech bubble" features. The team will pick which lines go where.

---

# Tips

- **Read your customer lines OUT LOUD.** If they sound dumb, they ARE dumb. Edit them.
- **Don't agonize over sound choice.** First-pick is usually fine. You can always swap one out later.
- **Listen on speakers and headphones.** A sound that's perfect on AirPods might be too quiet through laptop speakers. Test both if you can.
- **Reference real games for tone.** If you've played Overcooked or Cooking Mama, that's the audio energy we want — chimes, clicks, satisfying feedback. Not ominous, not aggressive.

---

# 🚀 How to upload your work to GitHub

You'll be uploading 2 things:
1. The 12 sound files (and optional `bgm_lobby.mp3`) into `client/public/sounds/`
2. The flavor text as a single Markdown file at `content/flavor.md`

### One-time setup (only the first time)

1. Make sure Hara has added you as a collaborator. You should have an email invite. Click **Accept invitation**.
2. Go to **github.com** and sign in.
3. Visit `https://github.com/haramor/starbite`. You should see all the project files. If 404, message Hara.

## Uploading sounds

### 1. Create the sounds folder

Go to `https://github.com/haramor/starbite/tree/main/client/public`. You'll see a folder listing.

If `sounds/` already exists, skip to step 2.

If it doesn't, you need to create it:
- Click **Add file** → **Create new file**
- In the filename box, type **exactly**: `sounds/.gitkeep`
- Leave the file content empty
- Scroll down, click **Commit changes** → **Commit changes**

The folder now exists.

### 2. Upload your sound files

- Navigate to `https://github.com/haramor/starbite/tree/main/client/public/sounds`
- Click **Add file** → **Upload files**
- Drag and drop all 12 (or 13 with bgm) sound files into the drop zone
- Wait for them to finish uploading (small green checkmarks appear)
- Below the drop zone, type a commit message: **"Add sound effects"**
- Click the green **Commit changes** button

### 3. Add a credits file

We need to credit Kenney. Still in the `sounds/` folder:

- Click **Add file** → **Create new file**
- Name it: **`CREDITS.md`**
- Paste in this content:

```markdown
# Audio credits

All sounds are sourced from Kenney.nl (CC0 - public domain, no attribution required).

Asset packs used:
- Interface Sounds — https://kenney.nl/assets/interface-sounds
- UI Audio — https://kenney.nl/assets/ui-audio
- Sci-Fi Sounds — https://kenney.nl/assets/sci-fi-sounds
- Casino Audio — https://kenney.nl/assets/casino-audio
[Add Music Jingles if you used the bgm]
```

- Commit changes (default commit message is fine).

## Uploading flavor text

The flavor text lives at `content/flavor.md`. It probably doesn't exist yet.

### 1. Create the file

- Go to `https://github.com/haramor/starbite/tree/main/content`
- Click **Add file** → **Create new file**
- Name it: **`flavor.md`**
- In the editor, paste your flavor content. Use this template:

```markdown
# Star Bite Diner — flavor text

Sourced and written by [your name], [date].

## Customer names

- Captain Zorp
- Pip-3
- Bleep-9
- Glorbax the Mighty
... (your full list)

## Customer flavor lines

- "I'd like a rare burger and please compost my apple core."
- "Burger fully cooked! Earth biology is so weird."
... (your full list)

## Grill Bot lines

### Correct label
- "OH YES, beautiful!"
- "[chef's kiss]"
... (5-10 lines)

### Wrong label
- "Wait. That can't be right."
... (5-10 lines)

### Idle
- "Hello? Anybody there?"
... (5-10 lines)

## Trash Sorter lines

### Correct label
... (same structure)

### Wrong label
...

### Idle
...

## Review Bot lines

### Correct label
... (same structure)

### Wrong label
...

### Idle
...
```

- Scroll down, type commit message **"Add flavor text and customer/robot voice lines"**
- Click **Commit changes**

### 2. Verify

Visit `https://github.com/haramor/starbite/blob/main/content/flavor.md` and confirm your content is there.

## Tell the team

Send Hara a message: "Sound effects uploaded to `client/public/sounds/`. Flavor text at `content/flavor.md`. All 12 SFX present plus credits."

---

# Common questions

**"What if I can't find a sound that exactly fits?"**
Get the closest one. We can swap individual sounds later — the system is built so any one of them is replaceable. Don't agonize.

**"What if Kenney's audio is too noisy / too clean / wrong vibe?"**
Try [freesound.org](https://freesound.org) — filter to CC0 license. Search for the type of sound (e.g., "alien yum", "siren cartoon"). Download the same way.

**"My audio file plays but it sounds quiet on the website."**
Skip volume normalization for now — the team can tune levels in code later. If a sound is dramatically louder/quieter than the others, swap for a different one.

**"I don't know how to write 40 customer names."**
Two cheats:
- Get ChatGPT or Claude to brainstorm 100 silly alien customer names. Pick your favorite 40.
- Look at any sci-fi book/show character list for inspiration.

**"Should I worry about copyright?"**
No, as long as everything is from Kenney or another CC0 source. CC0 means you can use it however you want forever, no attribution required (we're crediting them anyway because that's nice).

**"What if Hara hasn't added me as a collaborator yet?"**
Message her. You can do all the prep work (Steps 1–4 of Part A and all of Part B) without GitHub access; you just can't upload at the end without it.

**"I finished early! What can I do to help more?"**
- Add background music (the bonus item in Step 5)
- Find or write 30 MORE customer flavor lines (variety is great)
- Look at the helper 2 (asset wrangler) doc and see if they need help finding any visuals

---

You're great. The vibe of this entire game depends on the audio + voice you bring. A perfect-looking game with no sound feels dead. Yours brings it to life.
