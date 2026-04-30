# Helper Task 2 — Asset wrangler

Hi! Thanks for helping with **Star Bite Diner**. Your job: find and organize all the visual assets we need so the game looks like a polished cartoon space diner instead of placeholder colored boxes and emoji.

**Estimated time:** 2–3 hours
**Tools you need:** A web browser, a file manager (Finder on Mac, File Explorer on Windows), basic familiarity with downloading and unzipping files.

---

## What is the game?

Star Bite Diner is a 5-to-10-player web game (ages 9–13) about training AI bots in a space diner. Players walk around a top-down 2D map, label data at training stations, and try to spot saboteurs giving wrong labels. The current version of the game uses **emoji and colored shapes** as placeholders — you're going to replace them with real sprite art.

Vibe we're going for: **polished, cartoony, slightly retro-futuristic, friendly**. Think Among Us meets Overcooked meets a 50s milkshake bar. Avoid grim/dark sprites or anything scary.

---

## Where to get the art

**[Kenney.nl](https://kenney.nl/assets)** — all assets there are CC0 (public domain), 100% free, no attribution required, no signup needed. This is the only site you should use unless you can't find what you need.

If you absolutely can't find something on Kenney, alternatives that work:
- [OpenGameArt.org](https://opengameart.org) — filter by CC0 license
- [Itch.io free game assets](https://itch.io/game-assets/free)

But for this task, **Kenney has everything we need** — just stick with that.

---

# Step 1 — Download the right Kenney packs (~30 min)

You'll download these packs as ZIP files. Each one contains hundreds of sprites; you'll only use a few from each.

### Required packs (download all 5)

1. **[Toy Town](https://kenney.nl/assets/toy-town)** — top-down tile pieces (floor, walls, counters, props). For the map.
2. **[Top-down Robots](https://kenney.nl/assets/top-down-robot)** — robot sprites. For our 3 bots.
3. **[UI Pack (RPG Expansion)](https://kenney.nl/assets/ui-pack-rpg-expansion)** — buttons, panels, progress bars.
4. **[Toon Characters 1](https://kenney.nl/assets/toon-characters-1)** — character sprites for player avatars.
5. **[Alien UFO Pack](https://kenney.nl/assets/alien-ufo-pack)** OR **[Sci-Fi RTS](https://kenney.nl/assets/sci-fi-rts)** — for alien customers.

### How to download a pack

I'll use Toy Town as the example. The same steps work for all 5.

1. Open the link above (or go to `https://kenney.nl/assets/toy-town`).
2. Scroll down past the description and the screenshots.
3. You'll see a big purple **Download** button. Click it.
4. A ZIP file downloads to your computer (probably `~/Downloads/` on Mac or `C:\Users\you\Downloads\` on Windows).
5. Find the file in your Downloads folder. Double-click it to unzip.
   - On Mac: it'll create a folder with the same name.
   - On Windows: right-click → "Extract All" → choose where to extract.

You now have a folder full of sprite images. Repeat for all 5 packs.

### Where to put the unzipped folders (temporarily)

Create a folder on your Desktop called `starbite-art-source/` and put all 5 unzipped folders inside it:

```
Desktop/
└── starbite-art-source/
    ├── kenney_toy-town/
    ├── kenney_top-down-robot/
    ├── kenney_ui-pack-rpg-expansion/
    ├── kenney_toon-characters-1/
    └── kenney_alien-ufo-pack/
```

These are just for browsing — you'll pick a few sprites from each and copy them (renamed) into the project later.

---

# Step 2 — Pick the sprites we need (~45 min)

For each item below, browse the relevant Kenney pack, pick ONE sprite that fits, and **make a copy** of it (don't move the original — leave the source folders intact in case you change your mind).

Your destination folder will be `starbite-assets-final/` on your Desktop:

```
Desktop/
└── starbite-assets-final/
    ├── tiles/
    ├── stations/
    ├── bots/
    ├── characters/
    ├── customers/
    └── ui/
```

Create those subfolders before you start copying.

### Tiles (4 sprites needed) — from `kenney_toy-town/`

The Toy Town pack has lots of tiles. Look for ones that look like a top-down floor, viewed from above.

| You need | What to look for | Save it as |
| --- | --- | --- |
| Main floor tile | A patterned floor (checkered, tile, wood) — must look the same on all 4 sides so it tiles cleanly | `tiles/tile_floor.png` |
| Alt floor tile | A second floor tile in a different color/pattern, for variety | `tiles/tile_floor_alt.png` |
| Wall tile | A wall edge / counter front | `tiles/tile_wall.png` |
| Counter top | A flat counter surface tile | `tiles/tile_counter.png` |

**How to tell if a tile "tiles cleanly":** if you imagine 4 copies of it placed in a 2×2 grid, the seams between them shouldn't be obvious. Avoid tiles with a single big feature (like a flowerpot dead center) — those don't tile.

### Stations (3 sprites) — from `kenney_toy-town/`

These are the visual props players walk up to. Each should be ~150×100 pixels (covers a 3×2 tile area).

| You need | What to look for | Save it as |
| --- | --- | --- |
| Grill station | Anything that reads as a kitchen counter / cooktop. A grill, stove, or oven sprite. | `stations/station_grill.png` |
| Trash station | A trash can, recycling bin, or sorting machine | `stations/station_trash.png` |
| Review station | A computer, terminal, or monitor — represents the audit station | `stations/station_review.png` |

If the Toy Town sprites are too small, you can resize them up (see "How to resize" in the Tips section).

### Bots (3 sprites) — from `kenney_top-down-robot/`

Pick 3 distinctly different robots from the pack — different colors, different shapes, different "personalities."

| You need | Personality vibe | Save it as |
| --- | --- | --- |
| Grill bot | A chef-y robot — maybe a robot with a hat or chef colors | `bots/bot_grill.png` |
| Trash bot | A sorting robot — maybe a bin-shaped or claw-equipped robot | `bots/bot_trash.png` |
| Review bot | An inspection robot — maybe one with a magnifying glass / camera / "eye" feature | `bots/bot_review.png` |

Don't sweat which robot becomes which — the personality difference is more important than precise matching. Just pick 3 robots that look different from each other.

### Characters (6 sprites) — from `kenney_toon-characters-1/`

Pick 6 distinctly different child/young avatar sprites. **Variety matters** — different hair colors, skin tones, clothes. Diverse cast. The pack has plenty.

Save as `characters/char_1.png`, `characters/char_2.png`, ... up to `characters/char_6.png`.

### Customers (5 sprites) — from `kenney_alien-ufo-pack/` or `kenney_sci-fi-rts/`

Pick 5 distinctly different alien / space creature sprites. These are the customers who walk up to order food.

Save as `customers/customer_1.png`, ... `customers/customer_5.png`.

### UI elements (6 sprites) — from `kenney_ui-pack-rpg-expansion/`

This pack has buttons, panels, bars — pick the ones that look "diner / cozy / friendly" rather than "fantasy RPG."

| You need | What to look for | Save it as |
| --- | --- | --- |
| Panel background | A rounded rectangular panel, slightly translucent or solid color | `ui/panel_bg.png` |
| Button (default) | A normal button, maybe rounded | `ui/button_up.png` |
| Button (pressed) | The same button style but slightly darker / inset (the "pressed" version) | `ui/button_down.png` |
| Progress bar background | An empty bar — usually dark or gray | `ui/meter_bar_bg.png` |
| Progress bar fill | The filled portion — usually colored | `ui/meter_bar_fill.png` |
| Alert icon | A warning triangle or alert symbol | `ui/icon_alert.png` |

---

# Step 3 — Rename and verify (~30 min)

The names in the table above are exact. The code looks for these specific filenames. **If you rename a file differently, the code won't find it.**

Double-check before moving on:
- All filenames are **all lowercase**
- All filenames use **underscores `_`**, not dashes or spaces
- All files end in **`.png`** (not `.jpg`, `.svg`, or `.PNG`)

### How to rename a file

**On Mac:**
- Click the file once to select it
- Press Enter (the filename becomes editable)
- Type the new name including `.png`
- Press Enter again to confirm

**On Windows:**
- Right-click the file → "Rename"
- Type the new name including `.png`
- Press Enter

If your file is `.jpg` instead of `.png`, see "Convert JPG to PNG" in the Tips section.

### How to verify your folder

After renaming, your final folder should look like this:

```
starbite-assets-final/
├── tiles/
│   ├── tile_floor.png
│   ├── tile_floor_alt.png
│   ├── tile_wall.png
│   └── tile_counter.png
├── stations/
│   ├── station_grill.png
│   ├── station_trash.png
│   └── station_review.png
├── bots/
│   ├── bot_grill.png
│   ├── bot_trash.png
│   └── bot_review.png
├── characters/
│   ├── char_1.png
│   ├── char_2.png
│   ├── char_3.png
│   ├── char_4.png
│   ├── char_5.png
│   └── char_6.png
├── customers/
│   ├── customer_1.png
│   ├── customer_2.png
│   ├── customer_3.png
│   ├── customer_4.png
│   └── customer_5.png
└── ui/
    ├── panel_bg.png
    ├── button_up.png
    ├── button_down.png
    ├── meter_bar_bg.png
    ├── meter_bar_fill.png
    └── icon_alert.png
```

That's **24 files total**. Count them. If it's not 24, something's missing.

---

# Step 4 — Make a manifest file

Create one more file inside `starbite-assets-final/` called **`manifest.json`**. Open any text editor (TextEdit on Mac, Notepad on Windows, or even Google Docs — but make sure it's plain text). Paste this content:

```json
{
  "version": 1,
  "created": "2026-04-30",
  "tiles":      ["tile_floor.png", "tile_floor_alt.png", "tile_wall.png", "tile_counter.png"],
  "stations":   ["station_grill.png", "station_trash.png", "station_review.png"],
  "bots":       ["bot_grill.png", "bot_trash.png", "bot_review.png"],
  "characters": ["char_1.png", "char_2.png", "char_3.png", "char_4.png", "char_5.png", "char_6.png"],
  "customers":  ["customer_1.png", "customer_2.png", "customer_3.png", "customer_4.png", "customer_5.png"],
  "ui":         ["panel_bg.png", "button_up.png", "button_down.png", "meter_bar_bg.png", "meter_bar_fill.png", "icon_alert.png"]
}
```

Save it as `manifest.json` (make sure the extension is `.json`, NOT `.txt`).

This is just a list of your files so the team can verify everything's in place.

---

# Step 5 — Make a credits file

Create another text file in `starbite-assets-final/` called **`CREDITS.md`**. Paste this:

```markdown
# Asset credits

All visual assets are sourced from Kenney.nl (CC0 - public domain, no attribution required).

Asset packs used:
- Toy Town — https://kenney.nl/assets/toy-town
- Top-down Robots — https://kenney.nl/assets/top-down-robot
- UI Pack (RPG Expansion) — https://kenney.nl/assets/ui-pack-rpg-expansion
- Toon Characters 1 — https://kenney.nl/assets/toon-characters-1
- Alien UFO Pack — https://kenney.nl/assets/alien-ufo-pack
```

Update the list to match what you actually used.

---

# 🚀 How to upload your assets to GitHub

Now you'll upload your `starbite-assets-final/` folder to the project repo using GitHub's website. No coding tools needed — just clicks and drag-and-drop.

### One-time setup (only the first time)

1. Make sure Hara has added you as a collaborator on the repo. You should have an email invite. Click **Accept invitation**.
2. Go to **github.com** and sign in.
3. Visit `https://github.com/haramor/starbite`. You should be able to see all the project files. If it says "404 Not Found," your invitation didn't go through — message Hara.

### Step-by-step upload

#### 1. Navigate to the right folder

Go to:
```
https://github.com/haramor/starbite/tree/main/client/public
```

You'll see a folder listing. There may or may not be an `assets/` folder yet — both are fine.

#### 2. Click "Add file" → "Upload files"

Near the top right of the file listing, you'll see an **Add file** button. Click it. From the dropdown, click **Upload files**.

#### 3. Drag your files in

GitHub shows a drop zone that says **"Drag files here to add them"**.

Now this is the important part — GitHub doesn't preserve folder structure perfectly when you drag a folder, so we'll do it carefully:

**Option A (easiest, if your browser supports folder drop):**
- Drag your entire `starbite-assets-final/` folder from Finder/Explorer onto the drop zone
- GitHub will upload all files inside subfolders, preserving structure
- Skip to step 4

**Option B (if Option A doesn't work):**
- You'll need to upload each subfolder separately. It's tedious but works.
- For each subfolder (`tiles/`, `stations/`, `bots/`, etc.), do this:
  1. In the GitHub URL bar, navigate first: `https://github.com/haramor/starbite/tree/main/client/public/assets/tiles` (Add file → Create new file → type `tiles/.gitkeep` and commit, to make the folder exist)
  2. Then go into that folder, click Add file → Upload files, drag in the contents of just that subfolder
  3. Repeat for each subfolder

If Option B feels confusing, just use Option A — it works in Chrome, Firefox, and Safari for most people.

#### 4. Add a commit message

Below the drop zone, you'll see a **commit message** text box. Type something like:

```
Add Kenney art assets for v1
```

Make sure **"Commit directly to the `main` branch"** is selected.

#### 5. Click "Commit changes"

The big green button. Click it. GitHub will spend a few seconds processing the upload (might take longer if you have lots of files), then you'll be back at the file listing with all your assets visible.

#### 6. Verify

Navigate to:
```
https://github.com/haramor/starbite/tree/main/client/public/assets
```

You should see your folders (`tiles/`, `stations/`, etc.). Click into each to confirm your files are there.

#### 7. Tell the team

Send Hara a message: "Assets uploaded to `client/public/assets/`. All 24 files plus manifest and credits."

---

# Tips for getting unstuck

### How to resize an image

If a sprite is too small or too big, resize it before uploading.

**Easiest tool: [Photopea.com](https://photopea.com)** (free, browser-based, no signup, looks like Photoshop)
1. Go to photopea.com
2. File → Open → pick your image
3. Image → Image Size → set new width/height (keep "Constrain Proportions" checked)
4. File → Export As → PNG → Save

**On Mac (built-in):**
1. Right-click the image → Open With → Preview
2. Tools → Adjust Size → enter new dimensions
3. File → Save

**On Windows (built-in):**
1. Open the image in Paint
2. Resize button → enter new dimensions
3. File → Save As → PNG

### Convert JPG to PNG

Same tools (Photopea / Preview / Paint). Just choose **Save As → PNG** instead of JPG.

### File is too small (looks blurry when scaled up)

Skip it and pick a different sprite from the same pack — Kenney usually has multiple sizes available.

### Can't find a sprite that matches what we need

Get the closest one. Don't agonize. We can swap individual sprites later if they don't work.

### One of the Kenney packs is missing a category we need

Browse [kenney.nl/assets](https://kenney.nl/assets) — there are 100+ free packs. Search for the keyword (e.g., "robot," "kitchen") and pick from any pack. Add a note in `CREDITS.md`.

### My upload to GitHub failed / timed out

GitHub web has a per-file size limit and a per-upload count limit. If you have lots of files:
- Try uploading folder-by-folder (one subfolder at a time)
- Or compress your images first (Photopea → File → Export As → PNG → reduce quality slider)

### "I uploaded but it's all in one folder, not in subfolders"

This happens with some browsers. Don't panic. Go into the wrongly-flat folder, select all files at once (or one at a time), and use GitHub's **Move file** option (in the file's three-dot menu) to relocate them. Tedious but works. Or message Hara — she can fix it with one git command.

---

# Quality bar

**Good ✅:**
- 6 visibly different character sprites (different hair, skin, clothes — diverse cast)
- 3 robots with clear personality differences
- 5 customers that look like distinct aliens / space creatures
- Tiles tile cleanly (no obvious seams when placed next to each other)
- Stations look like the thing they represent at a glance
- All filenames match the expected names exactly

**Avoid ❌:**
- Photorealistic / dark / scary art
- Anything not from Kenney or another CC0 source (we need clean licensing)
- Mixing 8-bit pixel art with smooth cartoon — pick one consistent style across the whole game
- File sizes over 200KB per sprite (not a hard limit, just a sanity check)

---

# Common questions

**"What if Hara hasn't added me as a collaborator yet?"**
Message her. You can do all the prep work (Steps 1–5) without GitHub access; you just can't upload at the end without it.

**"What if I commit and the game doesn't show my art?"**
The game team will need to write some code to USE the art (currently the game uses emoji placeholders). Don't worry about that — Hara/Sky handle that part. Once you've uploaded, your job is done.

**"What if I'm done and want to do more?"**
Two options:
1. Find or make a sound-effect-free background music loop for the lobby. Save as `client/public/sounds/bgm_lobby.mp3`. Helper 5 may also be doing this — coordinate with them.
2. Design a logo/wordmark for "Star Bite Diner." Use [Photopea](https://photopea.com) or just sketch one on paper. Save in `client/public/assets/logo.png`.

**"How do I send Hara a message?"**
However you've been communicating already — Slack, Discord, text, email, whatever. The team is set up however your group set it up.

---

You're great. Have fun digging through Kenney — it's a treasure trove. The whole game's vibe depends on the visual choices you make.
