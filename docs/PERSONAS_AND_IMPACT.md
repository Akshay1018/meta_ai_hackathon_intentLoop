# Personas — who IntentLoop is for (hackathon + Meta pitch)

**Theme:** Build for Your World · **Product:** session layer **inside** Instagram (mock for hackathon).  
**Not for:** users under 13; parental surveillance; medical/mental-health coaching; “quit social” shame products.

IntentLoop helps people who **already use Instagram** and **already set a daily limit** — it adds **outcome** next to Meta’s **minutes**.

---

## Persona matrix

| Persona | Typical open behavior | What they want | How IntentLoop helps (no quiz on open) | Visit summary might say |
|---------|----------------------|----------------|----------------------------------------|-------------------------|
| **Everyday scroller** | Feed → random DMs → Reels | “I only had 5 minutes” | Honest close when **their** limit hits; Skip always works | “Mostly browsing — no single job” |
| **Companion-scroll** (call on speaker) | Feed while on phone; mindless hops | Not more guilt; just clarity | Same banner grammar as IG; optional summary | “No one task — tabs drifted” |
| **DMs-first** | Opens Messages | Send one reply | Silent **Inbox · on intent**; drift if Reels took over | “Open DMs and send the one reply” |
| **Creator / poster** | **+** Create → Share | Finish the post | **Post · on intent**; Share marks `postedThisVisit` | “You shared a post — main win done” |
| **Reels binger** | Reels tab | “Just a few clips” | Reels intent + high drift vs other goals | “Reels dominated this visit” |
| **Profile checker** | Profile → Your activity | See today’s pattern | **Today** list + future 7-day window | History of summaries |
| **Small business / marketer** | DMs + Create for brand | Reply leads + post promo without losing evening | Outcome per visit: “did I answer customers or only scroll?” | “Posting done; DMs still open” |
| **Influencer / creator pro** | Inbox + Create + analytics habit | Batch replies, ship content, protect deep-work blocks | Limit + summary = **closure** between “work on IG” sessions | “Reply window vs content window” |
| **Busy parent (adult)** | Short check while kids are busy | Stay within **their** 15 min | Same limit sheet they already trust | “Quick check — close when done” |
| **Teen with own limit (16+)** | Mixed tabs | Agency, not lecture | Neutral tone; **never** “addicted” language | Encouraging next action only |

**Under 13 / child accounts:** IntentLoop is **not** positioned as a minor-safety or parental-control product. Meta already provides age-appropriate experiences; we **do not** market to children or infer “on a call / at school” from sensors.

---

## Category tags (for video & submission copy)

Use 2–3 in the demo; don’t claim all at once.

1. **Well-being & time agency** — extends Time spent with **meaning**.  
2. **Creator economy** — inbox + post sessions with closure.  
3. **Everyday productivity** — one job per visit (DMs, post, browse).  
4. **Platform-native** — lives in Your activity + limit banner, not a new app.

---

## Impact line per persona (one sentence each)

- **Scroller:** “Minutes tell me how long; IntentLoop tells me if the visit mattered.”  
- **Creator:** “I opened to post — did I, or did Reels eat the session?”  
- **Marketer:** “DMs are leads; the summary says if I actually worked the inbox.”  
- **Meta:** “Same limit UX — plus **where** the time went and one optional next step.”

---

## Hackathon demo recommendation

**Primary tape:** Companion-scroll → post + Reels → limit → **visit summary** → optional screenshot (Spark) → session card (Muse Image).  
**Secondary B-roll:** Marketer DMs path vs creator post path — two different **Today** rows after two resets.

Link: [HACKATHON_PLAN.md](./HACKATHON_PLAN.md) backlog for “time + where” UI.

**In-app:** Profile → Your activity → **Persona (end-to-end)** picker.  
**Testing:** [PERSONA_E2E_MANUAL.md](./PERSONA_E2E_MANUAL.md) · [PERSONA_E2E_TEST_REPORT.md](./PERSONA_E2E_TEST_REPORT.md) · `npm run test:personas`
