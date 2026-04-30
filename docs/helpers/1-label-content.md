# Helper Task 1 — Label content writer

> ## ✅ DONE
>
> Hara's Claude completed this on 2026-04-30. **No action required.**
>
> Delivered:
> - `/content/grill.json` — 40 unambiguous burger patty entries (rare/done)
> - `/content/trash.json` — 40 trash items (recycle/compost/landfill)
> - `/content/orders.json` — 20 customer order templates (single + two-station)

---

## If you'd like to extend it (optional, very welcome)

More content = more variety per round. The bots feel less repetitive when they have 60+ training examples instead of 40. If you want to add to any of the three files:

### What to add

- **`grill.json`** — more patty descriptions. 6–14 word sensory cues. `groundTruth` is exactly `"rare"` or `"done"`.
- **`trash.json`** — more items. `groundTruth` is exactly `"recycle"`, `"compost"`, or `"landfill"`. Skip ambiguous items (greasy pizza box, plastic bags, etc.).
- **`orders.json`** — more customer orders. Mix single-station (~30%) and two-station (~70%). Customer names should be space-y / silly / kid-friendly (no real human names).

### Format reminder

Each entry follows the existing pattern in the file. Use [jsonlint.com](https://jsonlint.com) to validate before committing. The LAST entry in the file array does NOT have a trailing comma; every other entry does.

### How to commit

1. Go to the file on GitHub (e.g., `https://github.com/haramor/starbite/blob/main/content/grill.json`)
2. Click the pencil ✏️ icon (top right of file viewer)
3. Add your entries before the closing `]`
4. Validate at jsonlint.com
5. Commit message: "Add N more grill entries" → green Commit changes button

That's it. The Golden Rule still applies: **every example must be 100% unambiguous.** When in doubt, skip it.
