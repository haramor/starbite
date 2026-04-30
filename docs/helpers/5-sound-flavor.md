# Helper Task 5 — Sound effects

> ## ✅ Flavor text DONE — ⚠️ SFX still need a human
>
> Customer names + flavor lines + robot voice lines were written by Hara's Claude on 2026-04-30 to `/content/flavor.md`. **No action required for the writing piece.**
>
> What's left is downloading the actual sound files.

---

## What you're delivering (~1.5 hours)

12 short sound effects in `client/public/sounds/`. Use **[Kenney Audio Packs](https://kenney.nl/assets/category:Audio)** — CC0, free, no signup, no attribution required.

---

## Step 1 — Download the audio packs

Open each link and click the big purple **Download** button. Each pack downloads as a ZIP file.

1. **[Interface Sounds](https://kenney.nl/assets/interface-sounds)** — clicks, beeps, alerts (most of our SFX)
2. **[UI Audio](https://kenney.nl/assets/ui-audio)** — more UI sounds
3. **[Sci-Fi Sounds](https://kenney.nl/assets/sci-fi-sounds)** — alien customer sounds + meeting alarm
4. **[Casino Audio](https://kenney.nl/assets/casino-audio)** — happy/win chimes for satisfied customers

**Unzip each one** (double-click on Mac, right-click → Extract All on Windows) into a folder on your Desktop called `starbite-audio-source/`.

---

## Step 2 — Pick the 12 sounds

Make a destination folder on your Desktop: `starbite-audio-final/`. Copy ONE sound from a source pack for each row below, **rename to the exact filename**, and save it in the destination folder.

| Filename | Game moment | What to look for |
| --- | --- | --- |
| `sfx_click.mp3` | Any UI button press | Soft click — "click" or "tick" in interface-sounds |
| `sfx_label_correct.mp3` | Player submits correct label | Cheerful chime / "ding!" — UI Audio or Casino |
| `sfx_label_wrong.mp3` | Wrong label submitted | "Wah-wah" / low buzz — interface-sounds "error" |
| `sfx_flag.mp3` | Flagging at Review | Satisfying "thunk" / stamp |
| `sfx_customer_happy.mp3` | Happy customer outcome | Bright "yum!" / chime — Casino |
| `sfx_customer_confused.mp3` | Confused customer | Rising "huh?" / questioning chime |
| `sfx_customer_angry.mp3` | Angry customer | Grumpy alien sound or table thump — Sci-Fi |
| `sfx_alert.mp3` | Accuracy drop banner | Quick "alert!" beep |
| `sfx_meeting.mp3` | Emergency meeting called | Klaxon / siren (under 3s, NOT scary) |
| `sfx_eject.mp3` | Player ejected | "Whoosh" / pop |
| `sfx_win.mp3` | Crew wins | Triumphant fanfare (~3s) — Casino "jackpot" |
| `sfx_lose.mp3` | Saboteurs win | Sad-trumpet / "wah wah waaaa" |

### How to preview sounds

- **Mac:** select the file in Finder → press **space bar** → it plays
- **Windows:** double-click the file → opens in default player

### How to rename a file

- **Mac:** click file once → press Enter → type new name (including `.mp3`) → press Enter again
- **Windows:** right-click → **Rename** → type new name including `.mp3`

### What if a file is `.ogg` or `.wav`?

Both work fine in browsers. Easiest: convert to `.mp3` at [online-audio-converter.com](https://online-audio-converter.com) (free, no signup) — upload, click MP3, click Convert, download.

### Quality check

- Each file should be under 3 seconds (under 5 for win/lose)
- Cartoonish / friendly, not scary
- Roughly the same volume as the others (skip the extra-loud ones)

---

## Step 3 — Upload to GitHub

### One-time setup
1. Make sure Hara has added you as a collaborator on `github.com/haramor/starbite`
2. Sign in to GitHub

### Create the sounds folder (first time only)
1. Go to `https://github.com/haramor/starbite/tree/main/client/public`
2. If `sounds/` already exists, skip to "Upload files." If not:
   - Click **Add file** → **Create new file**
   - Type filename: `sounds/.gitkeep` (the `/` makes it a folder)
   - Leave content empty
   - Scroll down → **Commit changes** → **Commit changes**

### Upload your 12 files
1. Navigate to `https://github.com/haramor/starbite/tree/main/client/public/sounds`
2. Click **Add file** → **Upload files**
3. Drag all 12 sound files into the drop zone
4. Wait for the green checkmarks
5. Commit message: **"Add sound effects"**
6. Click **Commit changes**

### Add a credits file
Still in the `sounds/` folder:
1. Click **Add file** → **Create new file**
2. Name: `CREDITS.md`
3. Paste:
   ```markdown
   # Audio credits

   All sounds are sourced from Kenney.nl (CC0 - public domain).

   Asset packs used:
   - Interface Sounds — https://kenney.nl/assets/interface-sounds
   - UI Audio — https://kenney.nl/assets/ui-audio
   - Sci-Fi Sounds — https://kenney.nl/assets/sci-fi-sounds
   - Casino Audio — https://kenney.nl/assets/casino-audio
   ```
4. Commit changes.

Tell Hara: "Sound effects uploaded."

---

## Optional bonus: background music

A loopable, mellow, retro-futuristic-jazz instrumental for the lobby. Find one at [Kenney Music Jingles](https://kenney.nl/assets/music-jingles) or [freesound.org](https://freesound.org) (filter by CC0). Save as `bgm_lobby.mp3` in the same folder. Under 60 seconds, loops cleanly.

Skip this if you're short on time. The game works fine without music.
