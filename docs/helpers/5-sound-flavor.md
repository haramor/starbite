# Helper Task 5 — Sound + flavor text

Hi! Thanks for helping with **Star Bite Diner**. Your job is the polish layer that turns a technically-working game into something that *feels* alive: **sound effects + character/customer/order voice.**

**Estimated time:** 2–3 hours
**Tools:** a browser, a download manager, and a fun imagination

---

## What is the game?

Star Bite Diner is a 5-to-10-player web game about training AI bots in a space diner. Players label data at training stations to train the bots. Some players are saboteurs giving wrong labels. Customers come in every 30 seconds and react to how well the bots did.

Right now the game is **silent** and the customers / robots / orders all have placeholder names. You're going to fix both.

---

## Part A — Sound effects (~1.5 hours)

We need ~12 short sound effects. Use **[Kenney Audio Packs](https://kenney.nl/assets/category:Audio)** (CC0, free, no attribution required) — specifically these are great:
- [Interface Sounds](https://kenney.nl/assets/interface-sounds)
- [UI Audio](https://kenney.nl/assets/ui-audio)
- [Casino Audio](https://kenney.nl/assets/casino-audio) (good for happy customer / chime sounds)
- [Sci-Fi Sounds](https://kenney.nl/assets/sci-fi-sounds)
- [Voiceover Pack: Fighter](https://kenney.nl/assets/voiceover-pack-fighter) — for goofy customer reactions

If Kenney doesn't have what you need, alternatives:
- [Freesound.org](https://freesound.org) — filter by CC0 license
- [Pixabay Sound Effects](https://pixabay.com/sound-effects/) — free for commercial use

### Sound list (deliver as 12 .mp3 or .ogg files)

| Filename                  | Description                                       | Trigger |
| ------------------------- | ------------------------------------------------- | ------- |
| `sfx_click.mp3`           | Soft button click                                 | Any UI button press |
| `sfx_label_correct.mp3`   | Cheerful chime — "ding!"                          | Player submits a correct label |
| `sfx_label_wrong.mp3`     | Brief "wah-wah" or low buzz                       | Player submits a wrong label (and saboteur poison) |
| `sfx_flag.mp3`            | A satisfying "thunk" / stamp                      | Flagging a submission at Review |
| `sfx_customer_happy.mp3`  | Happy alien noise / "yum!"                        | Customer outcome: happy |
| `sfx_customer_confused.mp3`| Confused murmur / "huh?"                         | Customer outcome: confused |
| `sfx_customer_angry.mp3`  | Grumpy alien sound / table thump                  | Customer outcome: angry |
| `sfx_alert.mp3`           | Quick "alert!" beep                               | Accuracy drop banner appears |
| `sfx_meeting.mp3`         | Klaxon / siren (short, NOT scary)                 | Emergency meeting called |
| `sfx_eject.mp3`           | "Whoosh" / pop                                    | Player ejected at end of meeting |
| `sfx_win.mp3`             | Triumphant fanfare (~3s)                          | Crew wins |
| `sfx_lose.mp3`            | Sad-trumpet / "wah wah waaaa"                     | Saboteurs win |

**File requirements:**
- **Format:** `.mp3` or `.ogg`
- **Duration:** under 3 seconds for SFX, under 5 for win/lose
- **Volume:** normalized (not weirdly louder than each other)
- **Vibe:** cartoonish, friendly, not scary. The meeting siren especially should feel goofy, not threatening.

**Where to put them:**
```
/client/public/sounds/
├── sfx_click.mp3
├── sfx_label_correct.mp3
├── ... (etc)
```

If you don't have repo access, zip the folder and send to Hara.

### Bonus: background music (optional, only if you have time)

A loopable, mellow, retro-futuristic-jazz instrumental for the lobby. <60 seconds, loops cleanly. Save as `bgm_lobby.mp3`. Kenney's [Music Jingles](https://kenney.nl/assets/music-jingles) or [Freesound's "lounge"](https://freesound.org/search/?q=lounge+loop) tag is a place to start.

---

## Part B — Flavor text (~1 hour)

The game needs personality. Right now customer names are bland and orders all sound the same. Help us make the diner feel like a real silly space restaurant.

### Deliverable: 3 lists, in any format (Google Doc, plain text, JSON if you're comfortable)

#### List 1: Customer names (40+ names)

Mix of styles. Aim for funny, kid-friendly, never mean. Examples:
- **Sci-fi style:** Captain Zorp, Pip-3, Bleep-9, Glorbax the Mighty
- **Mashup style:** Lord Snorf McGoo, Empress Spaghetti, Greg from Mars
- **Cute alien:** Bibblo, Squishy Steve, The Fluffening, Doctor Pickle

**Avoid:**
- Real human names (we don't want any kid to feel singled out)
- Anything resembling slurs / bad words / political figures
- Names over 20 characters (UI gets cramped)

#### List 2: Customer flavor lines (25+ short lines, max 12 words each)

These play when a customer walks up to order. Variety matters; the customer's personality should come through in 1 line.

Examples:
- "I'd like a rare burger and please compost my apple core."
- "Burger fully cooked! Earth biology is so weird."
- "Oh dear, just a done patty please. My tentacles are tired."
- "RECYCLE THIS CAN OR I WILL CRY VERY LOUDLY."
- "Hi! First time here. What's a 'compost'?"

These will get matched up with order requirements — write them generically enough that they fit any order, OR make them in pairs (one for "rare + compost" orders, one for "done + recycle" orders, etc.).

#### List 3: Robot / station personality bits (~10 of each)

Short flavor lines our bots could "say" when something happens. Think of it like Pixar movie sidekick lines — silly, brief.

For each of the 3 bots (**Grill Bot**, **Trash Sorter**, **Review Bot**), write 5–10 short lines (under 10 words each) for:
- When given a correct label: "OH YES, beautiful!" / "[chef's kiss]" / "Got it, boss!"
- When given a wrong label (after the fact, like in customer feedback): "Wait. That can't be right." / "I learned a lie!"
- When idle: "Hello? Anybody there?" / "I'm so ready to learn!"

These lines might be used for tooltips, alert banners, or future "robot speech bubble" features.

---

## Where to put your work

- **Sound files:** in `/client/public/sounds/` in the [starbite repo](https://github.com/haramor/starbite). If you don't have repo access, zip the folder and send to Hara.
- **Flavor text:** create `/content/flavor.md` (or `flavor.json` if you're up for it) in the same repo. Or just send to Hara as a Google Doc — she/Claude will format it.

---

## A note on tone

This game is for kids learning that AI is a tool people make, with all the messiness that involves. The vibe should be:
- **Warm and silly**, not cynical
- **Encouraging**, not stressful
- **The robot is your friend**, never the enemy
- **Sabotage is goofy mischief**, not menace

When in doubt: would this make a 10-year-old laugh? If yes, ship it. If it would make them feel bad, drop it.

Have fun! This is the part of the project that takes it from "working" to "delightful."
