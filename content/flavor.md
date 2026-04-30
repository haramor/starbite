# Star Bite Diner — flavor text

Names + voice lines for customers and the three robots. Used as raw material for the random-customer system, future tooltip text, and any "robot speaks" UI.

---

## Customer names (50)

### Sci-fi sounding
- Captain Zorp
- Pip-3
- Bleep-9
- Glorbax the Mighty
- Empress Astra
- Lord Snorf
- Borp the Smug
- Wuzz of Tau Ceti
- Captain Sundae
- Commander Gleep
- Lieutenant Squink
- Vexillon
- Flarn-7
- Ensign Wibble
- Madame Vex

### Mashup / silly
- Greg from Mars
- Lord Snorf McGoo
- Doctor Pickle
- Sir Pickleton
- Uncle Cosmos
- Empress Spaghetti
- Aunt Nebula
- Professor Wubbles
- Cheese Lord
- Mister Goop
- Mayor Spork
- The Honorable Cluck
- Auntie Quasar
- Granny Stardust

### Cute alien
- Bibblo
- Squishy Steve
- The Fluffening
- Babs the Blob
- Wuzz
- Floof
- Bork
- Snoot
- Doopy
- Mim
- Tippletop
- Yarn the Smaller
- Glub
- Snerf

### Title style
- Captain Sundae
- Madame Vex
- Lord Snerfgardle
- Duchess Pringle
- Ambassador Bingbong
- Lady Custard
- Sir Reginald the Damp
- Princess Asparagus
- High Priestess Wobble

---

## Customer flavor lines (35)

Each is one line under 12 words. Fits any order-type unless noted otherwise.

### Polite
- "I'd like a rare burger and please compost my apple core."
- "May I have a done burger? Recycle the wrapper, kindly."
- "Hello! Just one done burger today. Thank you so much."
- "Would you toss this banana peel? Compost, I believe."
- "If you wouldn't mind, rare burger and compost the eggshells."

### Excited
- "BURGER FULLY COOKED! Earth biology is so weird!"
- "RECYCLE THIS CAN OR I WILL CRY VERY LOUDLY."
- "I love this place! Done burger and compost my apple, woo!"
- "Best place in the galaxy! Rare patty, recycle the box!"
- "FIRST TIME HERE — what is a 'compost' please??"

### Tired / chill
- "Done burger, please. I have a blob to feed."
- "Just done burger. I am tired and have many tentacles."
- "Rare patty please. The plastic straw goes... uh... somewhere."
- "Whatever's quickest. Done burger. Toss this paper."
- "It's been a long shift. Rare burger. Compost the carrot peels."

### Demanding / dramatic
- "I will perish without a done burger and recycled jar IMMEDIATELY."
- "RARE. BURGER. NOW. And compost this banana peel."
- "Recycle this can like your life depends on it."
- "Empress Spaghetti demands a done burger and a recycled bottle."
- "If this is overcooked I will SCREAM in seventeen languages."

### Confused / first-timer
- "Wait, do you cook burgers here? Rare please."
- "I'm new to Earth food. Done burger? And this goes... in compost?"
- "Sorry, what's 'rare' mean again? I'll just have one."
- "Quick question: is a banana peel garbage? Oh — compost. Got it."
- "I think I want a burger. Yes. Done. And recycle this can."

### Playful / silly
- "Patty fully cooked! I have a date with a black hole."
- "Rare burger. The styrofoam goes to landfill, like my hopes."
- "Done burger! I am collecting Earth experiences for my scrapbook."
- "Compost this banana peel. The peel feels things, you know?"
- "Recycle this jar! It contained the tears of my arch-nemesis."

### Tiny / single-station
- "Just toss this chip bag, no burger today."
- "Compost these tea leaves please."
- "Recycle this newspaper."
- "Done burger! That's it!"
- "Rare burger. Hold the lecture about cooking it more."

---

## Robot voice lines

Lines our 3 bots could "say." Use as tooltip text, alert banners, end-of-round flavor, or future speech-bubble features.

### 🔥 Grill Bot

#### When given a correct label
- "OH YES, beautiful!"
- "[chef's kiss noise]"
- "Got it, boss!"
- "Sizzle level: optimal!"
- "Patty status: yes."
- "Mmmmmm, yes, that's a good patty."
- "Filing this under 'I know now.'"
- "Beep boop chef hat happy!"

#### When given a wrong label (revealed when customer reacts)
- "Wait. That can't be right."
- "Did I... mess up?"
- "I learned a lie!"
- "My circuits are confused."
- "That patty did NOT taste right."
- "Hmm. The customer was unhappy. Why?"
- "Filing complaint with my own brain."
- "OH NO. OH NO NO NO."

#### When idle (nobody's at the station)
- "Hello? Anybody there?"
- "I'm so ready to learn!"
- "Sizzle sizzle sizzle... beep."
- "Burger? I love burger."
- "Anyone want to teach me cooking?"
- "Standing by. Cooking nothing. Sad."
- "Patty? Hello? Patty?"

### 🗑️ Trash Sorter

#### When given a correct label
- "Excellent. Filed correctly."
- "Beep! Sorted!"
- "I am a filing fiend!"
- "Beautiful. Just beautiful."
- "Bin choice: confirmed!"
- "[satisfied click]"
- "I am the fastest sorter in the cosmos."

#### When given a wrong label
- "Hmm. Was that... compost?"
- "Wait, that can't be right."
- "Compost? Recycle? Landfill? AAAAAAAAA"
- "I am questioning everything I know."
- "Oh dear, I think I sorted that wrong."
- "Bin chaos. BIN CHAOS."
- "This goes against my training!"

#### When idle
- "I love bins. So many bins."
- "Eagerly awaiting trash!"
- "Sorting ennui has set in."
- "Anyone got a banana peel for me?"
- "BIN. BIN. BIN. BIN."
- "Tutorial: bin 1 = compost. Probably."

### 🔍 Review Bot

#### When given a flag (a label was removed)
- "Filed away. The bots will not learn from it."
- "Suspicious label removed. Good catch!"
- "Audit complete. Better data now."
- "[nodding noise]"
- "Excellent attention to detail."

#### When you arrive at the station
- "Welcome, auditor."
- "What suspicious data shall we examine today?"
- "Trust no label. Verify everything."
- "Welcome to the most important station."
- "What are we cleaning up today?"

#### When idle
- "Audit pending. Audit always pending."
- "Let me know if you spot anything."
- "Vigilance is a virtue."
- "I have eight magnifying glasses and nothing to do."
- "Patiently watching, like a librarian."
- "Currently auditing the void."

---

## Notes

- The customer names + flavor lines should ideally be merged into `customers.json` and `orders.json` over time. For now this is the human-readable raw list.
- Robot voice lines are not yet wired into the game. Future feature: speech bubbles above bots when something significant happens.
- Tone: warm, silly, never mean, no jargon. The bots are friends, not adversaries.
