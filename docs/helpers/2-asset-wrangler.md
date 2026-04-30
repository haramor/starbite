# Helper Task 2 — Asset wrangler

Hi! Thanks for helping with **Star Bite Diner**. Your job: find and organize all the visual assets we need so the game looks like a polished cartoon space diner instead of colored boxes.

**Estimated time:** 2–3 hours
**Tools:** a web browser, a file manager, and patience for naming files correctly

---

## What is the game?

Star Bite Diner is a 5-to-10-player web game about training AI bots in a space diner. Players walk around a top-down 2D map, label data at training stations, and try to spot saboteurs giving wrong labels. The current version of the game uses **emoji and colored shapes** as placeholders — you're going to replace them with real sprite art.

---

## Where to get the art

**Use [Kenney.nl](https://kenney.nl/assets) — all assets are CC0 (public domain), free, no attribution required.**

Specifically download these packs:
1. **[Toy Town](https://kenney.nl/assets/toy-town)** — top-down tile pieces (floor, walls, counters, props). Use the 2D / orthographic versions.
2. **[Top-down Robots](https://kenney.nl/assets/top-down-robot)** — robot sprites for our 3 bots
3. **[UI Pack (RPG Expansion)](https://kenney.nl/assets/ui-pack-rpg-expansion)** — buttons, panels, progress bars
4. **[Sci-Fi RTS](https://kenney.nl/assets/sci-fi-rts)** OR **[Alien UFO Pack](https://kenney.nl/assets/alien-ufo-pack)** — for alien customers
5. **[Toon Characters 1](https://kenney.nl/assets/toon-characters-1)** OR similar character pack — for player avatars

If a pack is missing what we need, **substitute freely** — anything from kenney.nl is fine. The vibe we want: **polished, cartoony, slightly retro-futuristic, friendly**. Avoid grim/dark sprites.

---

## What you need to deliver

A folder of correctly-named PNG files placed at:
```
/client/public/assets/
```

Inside that folder, the structure should be:

```
client/public/assets/
├── tiles/
│   ├── tile_floor.png            (a 64×64 floor tile that tiles seamlessly)
│   ├── tile_floor_alt.png        (a 2nd floor tile for variety)
│   ├── tile_wall.png             (top-edge wall piece)
│   └── tile_counter.png          (counter / bar surface)
│
├── stations/
│   ├── station_grill.png         (~150x100 grill prop, top-down)
│   ├── station_trash.png         (~150x100 trash sorter prop)
│   └── station_review.png        (~150x100 review/computer prop)
│
├── bots/
│   ├── bot_grill.png             (chef hat robot, top-down, ~64×64)
│   ├── bot_trash.png             (sorting robot, top-down)
│   └── bot_review.png            (camera/computer robot, top-down)
│
├── characters/
│   ├── char_1.png   ...   char_6.png    (six different child/adult avatars, top-down, 64×64)
│
├── customers/
│   ├── customer_1.png   ...   customer_5.png    (five distinct alien/space customers, ~64×64)
│
└── ui/
    ├── panel_bg.png              (rounded panel background, supports 9-slice — Kenney UI Pack has these)
    ├── button_up.png
    ├── button_down.png
    ├── meter_bar_bg.png
    ├── meter_bar_fill.png
    └── icon_alert.png            (warning triangle for the alert banner)
```

---

## Naming rules (please follow exactly!)

- All lowercase
- Use underscores `_`, not dashes or spaces
- `.png` only (not `.jpg`, not `.svg`)
- Match the exact filenames listed above — if you rename anything, the code won't find it

If a Kenney sprite is named `robotBlueGrey_face1.png`, **copy it and rename your copy** to e.g. `bot_grill.png`. Don't move the original out of the pack folder; you might need its variants later.

---

## Sizing

- **Tiles:** 64×64 pixels (Kenney's defaults). All tiles must be the same size.
- **Characters and bots:** roughly 64×64. They sit on top of the tile grid.
- **Customers:** ~64×64, can be slightly bigger if it's a big alien.
- **Stations:** wider — usually ~150×100 to cover 3×2 tiles.
- **UI elements:** whatever the Kenney UI Pack provides; don't resize.

If something is way bigger or smaller, **resize it in Preview / GIMP / Photoshop / Photopea** to match. Keep it square pixels (don't squish).

---

## Manifest file

Once everything's in place, create one more file:

**`client/public/assets/manifest.json`**
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

This lets the code (and the rest of the team) verify everything's in place.

---

## Quality bar

**Good:**
- 6 visibly different character sprites (different hair, skin, clothes — diverse cast)
- 3 robots with clear personality differences (chef hat, mop, magnifying glass / camera)
- 5 customers that look like distinct aliens / space creatures
- Tiles tile cleanly (no obvious seams when placed next to each other)
- Stations look like the thing they represent at a glance

**Avoid:**
- Photorealistic / dark / scary art
- Anything not from Kenney or another CC0 source (we need clean licensing)
- Mixing 8-bit pixel art with smooth cartoon — pick one consistent style
- File sizes over 200KB per sprite (not a hard limit, just a sanity check)

---

## Where to put your work

If you have GitHub access:
- Clone the [`starbite` repo](https://github.com/haramor/starbite)
- Drop the files into `client/public/assets/` (creating that folder)
- Commit and push: `git add client/public/assets && git commit -m "add art assets" && git push`

If you don't have GitHub access:
- Zip the `assets/` folder and send to **Hara**, she'll commit it.

---

## Credit / license

In a `client/public/assets/CREDITS.md` file (you can write this), list:
```
Art assets sourced from Kenney.nl (CC0 - public domain).
Asset packs used:
- Toy Town
- Top-down Robots
- UI Pack (RPG Expansion)
- [whatever else you used]
```

That's it! Have fun digging through Kenney — it's a treasure trove.
