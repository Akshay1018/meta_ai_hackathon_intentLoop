# Manual persona E2E — how to test like a real IG user

**Setup (once):**

1. `npm run dev:clean` → open http://localhost:3000  
2. Profile → **Your activity**  
3. Turn on **IntentLoop** and **Demo: 15 min → 45 seconds** (unless you want real 15 min).  
4. Under **Optional features**, enable the tools listed for each persona (Privacy section).  
5. For each run: pick persona → **Start persona visit** → follow the script → wait for the **daily limit** sheet → **See visit summary**.

After summary, check **Today** and **Last 7 days** on Your activity. Use **Start new visit (demo)** between scenarios.

---

## 1. Everyday scroller

**Meta tools:** Spark intent (tab chip), Spark exit brief.

**Scenario A — “5 minutes became a hop tour”**

1. Persona: **Everyday scroller** → Start persona visit (lands on Home).  
2. Home → DMs tab → Reels tab.  
3. Limit sheet → **See visit summary**.  
4. Expect: drift ~mid; copy about **mostly browsing / no single job**; next step mentions reply or close.

**Scenario B — feed only**

1. Start persona visit → stay on Home ~45s.  
2. Summary → expect **short scroll / feed** tone; low drift.

---

## 2. Companion-scroll (call on speaker)

**Meta tools:** Spark intent + exit (no invented DM goal on Home-only).

**Scenario A — feed only**

1. **Companion-scroll** → Home only until limit.  
2. Summary → **no one task**, no “open DMs” unless you opened DMs.

**Scenario B — light Reels drift**

1. Home → Reels → summary.  
2. Expect neutral drift; **no pressure to finish a fake job**.

---

## 3. DMs-first

**Meta tools:** Spark intent (**Inbox · on intent**), exit, optional **Voice**.

**Scenario A — Reels hijack**

1. **DMs-first** → opens DMs → switch to Reels.  
2. Summary → Reels in **happened**; **Open DMs and send the one reply**.  
3. Expand **Say what you still wanted** → allow voice → say “mountain reels” → confirm navigation to Reels (Voice + Spark).

**Scenario B — on intent**

1. DMs only (no Reels) → summary → low drift; inbox-focused copy.

---

## 4. Creator / poster

**Meta tools:** Spark intent on Create, exit, **Match screenshot** (Spark vision), **Visit card** (Muse).

**Scenario A — post then drift**

1. **Creator / poster** → Create → **Share** (toast: shared to feed).  
2. Reels → limit → summary → **main win = post**; Reels mentioned if you drifted.  
3. **Match screenshot** (pizza image) → **View post** → `/?post=p1`.  
4. **Private visit card** → allow → generate card (Muse).

**Scenario B — clean post**

1. Create → Share → Home → summary → **close / posting done** without heavy drift.

---

## 5. Reels binger

**Meta tools:** Spark on Reels tab, exit.

**Scenario A — Reels only**

1. **Reels binger** → stay on Reels → summary → **Reels dominated**; high drift.

**Scenario B — Reels then DMs**

1. Reels → DMs → summary still Reels-led; next step may mention DMs.

---

## 6. Profile checker

**Meta tools:** Spark on profile; **Today + Last 7 days** history (IndexedDB on device).

**Scenario A — activity first**

1. **Profile checker** → starts on Your activity → Home → summary.  
2. Copy mentions **activity / 7 days**.  
3. Confirm summary row under **Today** and **Last 7 days** with persona label.

**Scenario B — profile only**

1. Profile tab only → summary → nudge to open Your activity.

---

## 7. Small business / marketer

**Meta tools:** Spark intent (leads + promo), exit, voice, vision, visit card.

**Scenario A — post + inbox**

1. **Marketer** → DMs → Create → Share → summary → **posting done; DMs still open**.

**Scenario B — inbox without post**

1. DMs → Home → summary → **ship promo** next action.  
2. Voice: “find Ria on the feed” → Search navigation.

---

## 8. Influencer / creator pro

**Meta tools:** Batch DMs copy, exit, voice, visit card.

**Scenario A — reply window**

1. **Influencer pro** → DMs → Create (no share) → summary → reply vs content window.

**Scenario B — ship content**

1. DMs → Create → Share → summary → content shipped; inbox may remain.

---

## 9. Busy parent (adult)

**Meta tools:** Limit sheet (same grammar as IG), Spark exit.

**Scenario A — quick check**

1. **Busy parent** → Home only → limit → **Skip** or **See visit summary**.  
2. Summary → **quick check** within your limit; **close when done**.

**Scenario B — accidental hops**

1. Home → DMs → Reels → still framed as a **short check**, not shame.

---

## 10. Teen with own limit (16+)

**Meta tools:** Spark intent + exit; optional voice. **Never** “addicted” language.

**Scenario A — mixed tabs**

1. **Teen agency** → Home → Reels → DMs → summary → **encouraging** tone; your choice to close or one small step.

**Scenario B — Reels only**

1. Reels only → summary → **close whenever you want**; scan copy for shame words (should be none).

---

## What “good” feels like for a customer

- **Open IG:** no quiz — just the familiar feed (or persona entry tab).  
- **Silent intent chip** on task tabs (DMs, Create, Reels, Profile) reflects *why* you opened.  
- **Same limit banner** you already trust → optional **visit summary** with drift bar and path.  
- **Optional tools** only after consent — screenshot, voice, visit card — each maps to a Meta model.  
- **Your activity** shows **outcome history**, not just minutes.

For judges / video: run **Companion-scroll** (primary tape) then **Marketer** vs **Creator** back-to-back — two different **Today** rows after two **Start persona visit** runs.
