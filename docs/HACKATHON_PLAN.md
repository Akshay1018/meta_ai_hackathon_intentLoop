# IntentLoop — End-to-end hackathon plan

**Repo:** public (required). Solo / indie track.  
**Theme:** **Build for Your World**  
**Window:** Oct 26 – Nov 4, 2026 · submit by **Nov 4, 9:00 PM EST**  
**Hard rule:** This product is **not** a company SaaS, not a work-delivery tool, not a leadership dashboard. No other product names, screens, or copy from other businesses. Daily-life attention and social-session agency only.

This document is the source of truth for **what we build, why, which Meta products we use, how we get judged, and how we submit.**

---

## 0. What is IntentLoop (plain language)

**IntentLoop** is a **session layer inside Instagram (and later Facebook / other social apps)** that answers a question the apps do not answer today:

> Did this visit do the job I came for — or did I only spend minutes?

It is **not** a new social network, **not** a quiz when you open Instagram, **not** a blocker, parental lock, therapist, or “quit Instagram” product.

It is the missing **close of the loop** on a visit you already take:

1. You open Instagram and see **Stories / feed / Reels immediately** (same as now).  
2. **Where you tap** is treated as the job (DMs → reply, **+** → post, Reels → browse, Profile → you). You do not type a goal.  
3. You use the app normally.  
4. When **your own daily limit** hits (the 15-minute banner you already set), or you leave a task like DMs, you get the **same kind of bottom sheet you already know**: Skip · Remind in 1 hour · Remind in 2 hours · **See whether you did the thing**.  
5. If you tap that last option, you get a short **ExitBrief**: what the visit actually was, and **one** next action (e.g. open messages).  
6. If you want the story later, it lives in **Profile → Your activity** — next to Time spent — because you already go there.

**One brain, many doors:** same IntentCard + ExitBrief for Instagram, Facebook, or another app. Hosts plug it into **Your activity + the limit banner**, not a new front door.

**Hackathon:** we cannot change the real Instagram binary. We **prototype** that layer in an Instagram-faithful mock with **mock feed/DMs/Reels** so it *feels* native. The product we argue for is still “inside IG.”

**Definition:** Instagram’s time limit **with a brain** — time limits count **minutes**; IntentLoop names **outcome**. Silent intent, familiar interrupt, optional brief, honest about browsing.

### For whom

People who **still want Instagram** but often leave feeling they **didn’t do the one thing** they had in mind: everyday adults; people who **already set a 15-minute limit**; creators who open to **post** or **answer DMs**; parents/busy people who already visit **Profile**. Not for: quit-social, teen locks, medical coaches, people who want IntentLoop **off**.

### Real time (during this visit)

| Moment | What happens | What you feel |
|--------|----------------|----------------|
| Open | Feed/Stories. **Zero UI.** | Same Instagram |
| Tap DMs / + / Reels | Spark infers IntentCard | Almost nothing |
| Your 15 min | Bottom sheet like today’s limit | Choice you already know |
| Skip / Remind | Banner gone | Same as now |
| See brief | Drift + two lines + one action | Closure |
| Next open | Feed first | No recap in your face |
| Profile | Your activity: today’s loop | Pull, not push |

No private-feed scrape. Screenshot / walk photo only if **you** attach them on the brief.

### Impact and use cases

**Impact:** visits have an **ending**; Skip always works; Meta gets well-being that isn’t only a clock. We **do not** claim to cure addiction or treat mental health — only **clarity at the end of a session they already limited**.

**Use cases:** (1) DMs then Reels → send the reply. (2) Post then scroll → posting is done. (3) Browse-only + limit → honest “you were browsing.” (4) Profile check of today. (5) Same banner on Facebook later.

---

## 1. What we are building

### Product vision (what Meta would ship — you are right)

IntentLoop is **not** “another social network” and **not** a forever-separate Instagram competitor.

It is a **session layer inside** Instagram / Facebook (portable to other social apps). It must **not** steal the first seconds of open.

**End-user rule (locked):** Instagram open = Stories / Feed / Reels **immediately**. No quiz. No 5-second tax. Users already tolerate **one** interruption pattern: a **bottom banner they configured themselves** (daily limit → Skip / Remind in 1h / 2h). IntentLoop copies **that** grammar, not a launch modal.

```text
Open Instagram → feed/stories at once (zero IntentLoop UI)
        ↓
Where they tap IS the intent (silent IntentCard)
  DMs → reply/inbox · + Create → post · Reels → browse · Profile → self/activity
        ↓
They use the app normally
        ↓
Natural pause: user-set time limit (same as today’s 15-min banner)
  OR leaving DMs / after posting / opening Profile → Your activity
        ↓
Bottom sheet (skippable): ExitBrief + one action
  Skip · Remind later · See brief
```

**Integration:** one engine + adapters (`instagram` | `facebook` | `generic`). Meta already owns **Your activity**, daily limits, and tab bar. IntentLoop **plugs into those**, it does not invent a new front door.

That is the **impact story** for judges and for Meta.

### Hackathon reality (what we can legally build in 10 days)

We **cannot** put code inside the real Instagram or Facebook iOS/Android apps. We are not Meta. There is **no public API** that runs a custom UI every time a user opens the native Instagram app. Scraping or injecting into the official app would violate policy and can get the project **disqualified**.

So we **prototype the native feature** inside a **high-fidelity Instagram-like shell** (tabs: Home, Reels, +, DMs, Profile — **Your activity** + daily limit in settings). Judges must feel real IG habits, not a launch quiz.

| Layer | What it is |
|--------|------------|
| **Vision** | Built **into** Instagram/Facebook (and portable); uses **Your activity** + user-set time limit |
| **Hackathon demo** | Interactive **IG-faithful mock** (feed first). Optional later: overlay on public `instagram.com` **without** scraping private data |
| **Engine** | Same APIs — `app: "instagram" \| "facebook" \| "other"`; intent from **surface**, not a question |

**Not:** OAuth. **Not:** reading the private feed. **Not:** blocking first paint.

### One sentence

**IntentLoop** infers why you’re in Instagram from **where you went**, lives in **Profile / Your activity** and the **same skippable bottom banner as daily time limits**, and closes with an ExitBrief — never a question on open.

```text
Silent IntentCard (from tab: DMs / Create / Reels / Profile)
        ↓
Muse Spark structures it (no user typing required)
        ↓
User-set limit or leaving a task surface
        ↓
Bottom sheet (Skip / Remind later / Brief) → ExitBrief
        ↓
Optional: screenshot (Spark vision), walk photo (SAM), session card (Muse Image)
        ↓
Profile → Your activity: today’s loops (pull, not push)
```

---

## 2. Why we are building it (problem, not sermon)

### The problem people actually live

They open Instagram to **reply to one message**, **check a school story**, or **post once**. Twenty minutes later they leave with:

- the message unsent  
- a drained brain  
- no idea whether the session “worked”

Break reminders and weekly time dashboards answer **how long**. They do not answer **did I get what I came for?**

Distraction is not a character flaw. It is a **missing loop** between intention and closure.

### Impact (human)

| Before | After |
|--------|--------|
| Open app → drift → guilt | Open feed instantly; **after their own 15-min limit** (or leaving DMs): Skip / Remind / Brief |
| “I wasted time” | “You opened DMs to reply; Reels took over. **Send the reply now.**” |
| Timers that only count minutes | Same banner **plus outcome** — they already opted into the interrupt |

### Value + outcome (what users get)

1. **Zero tax on open** — first thing they see is still Stories/Feed/Reels.  
2. **Clarity without a quiz** — tapping DMs / + / Profile already says the job.  
3. **Agency** — they set the limit in settings (like today); Skip always works.  
4. **Closure** — ExitBrief in a familiar bottom sheet, one action.  
5. **A home they already visit** — Profile → Your activity (daily).  
6. **Privacy** — no feed scrape; optional user-picked screenshot.

### Who adapts this (users)

Adults who **keep using** Meta-family apps:

- purposeful scroller (DMs, events, hobbies)  
- creator / freelancer (inbox + one post)  
- busy parent (short windows)  
- well-being-aware user (tried timers; still empty)

**Not:** people who want to quit social media; teen parental controls; medical/mental-health diagnosis (banned category).

### How they adopt it

**If Meta shipped it:** user turns IntentLoop on once under **Settings → Your activity** (next to daily time limit). After that, Instagram behaves as today until **their** limit (or a task surface they leave). Zero extra app.

**In the hackathon prototype:**

1. Open mock Instagram → **Home/Stories immediately**.  
2. Settings: daily limit **15 min** (user-set) + IntentLoop on.  
3. Tap **DMs** → silent intent `reply`; tiny non-blocking chip in inbox header (optional).  
4. After 15 min (or leaving DMs): **bottom banner** like IG’s real one: Skip · Remind 1h · See brief.  
5. Profile → **Your activity**: today’s IntentCards / ExitBriefs.  
6. Optional: screenshot / walk photo from the brief sheet.

Judges see **real IG habits**, not a popup on launch.

---

## 3. Judging process — how we win Stage 1, 2, 3

Official stages from the participant guide:

### Stage 1 — Pass / fail (do not die here)

Must be **obvious in README, video, and code**:

| Gate | How IntentLoop passes |
|------|------------------------|
| Fits a theme | **Build for Your World** — firsthand: opening social apps with a purpose and drifting |
| Used Meta models **during the event** | Live calls to **Meta Model API** (`https://api.meta.ai/v1`) |
| New work only | Empty repo → all commits during hackathon; video says “built Oct 26–Nov 4” |
| Not banned | No medical advice, no RAG-for-RAG, no generic chatbot, no politics |
| Public repo + 3-min video | GitHub public; YouTube/Drive unlisted with access |

**Indie track extra (from event page):** creativity, technical ambition, **whether it works**.

Cerebral Valley also cites **technical skill, execution, real-world potential**.

The detailed 0–10 table was not in the paste. We treat Stage 2 as scoring **all of the following** (standard for this event + indie criteria). Every feature we ship must map to at least one row.

| Likely criterion | How we score high |
|------------------|-------------------|
| **Theme fit** | First 15s of video: problem in daily life, not a toy demo |
| **Meta model usage (depth, not a wrapper)** | **≥3 Meta models in the golden path**, each doing a job a generic chatbot cannot |
| **Technical ambition** | Structured JSON schemas, voice in, vision evidence, SAM geometry, image out — one product loop |
| **It works** | Live demo, no fake JSON; loading/error states; fallback if a model is down |
| **Originality** | Outcome vs time; not another “AI wellness coach” (banned-adjacent) — we **never diagnose mood** |
| **Impact / real-world potential** | Clear user, clear adoption (PWA beside Instagram), Meta-ecosystem story |
| **Craft / demo** | 3-minute video judges can rank in Stage 3 without running the app |

### Stage 3 — Top 5 per track, live video

Video **is** the product for most judges. Script in §10.

---

## 4. Meta products — what we use and why (submission-ready)

Judges must **see** Meta in the architecture, not a footnote.

### 4.1 Must use (golden path)

| Product | Model ID | Role in IntentLoop | Why Meta (not a generic LLM) |
|---------|----------|--------------------|------------------------------|
| **Meta Model API** | Base `https://api.meta.ai/v1` | All hosted inference | Required Stage 1 |
| **Muse Spark 1.3** | `muse-spark-1.3` | IntentCard + check-in coach + ExitBrief via **structured output** (`text.format` / `json_schema`) | Native structured decoding, 1M context, **image understanding** of screenshots, reasoning effort |
| **Muse Voice Transcribe** | `muse-voice-transcribe-1.0` | Speak intent and speak recap (file and/or realtime WS) | Dedicated ASR, endpointing, 25 languages — Spark 1.3 audio is **documented as degraded** |
| **SAM 3.1** | `sam-3.1` | Optional **Walk mode**: photo/video → masks for `phone`, `car`, `crosswalk`, `person` → Spark turns geometry into **one safety/attention nudge** | Pixel masks + tracking; not a captioner |
| **Muse Image** | `muse-image-1.0` | Generate **session card** from ExitBrief (visual memory of the loop) | Same auth; multi-turn edits if we refine the card |
| **Muse Code** | CLI `muse` | **How we write the app** during the hackathon | Required story: “coded with Muse Code on Spark” |

Use **Standard** `muse-spark-1.3` (content not used for training) unless credits force contributor IDs — document the choice.

### 4.2 Should use (ambition, if time)

| Product | Use |
|---------|-----|
| **Muse Spark image understanding** | User uploads IG screenshot → Spark extracts *what they actually did* vs intent (evidence, not scraping) |
| **Search grounding** | Optional: “one next action” includes a cited how-to (e.g. mute Reels) — only if it stays non-medical |
| **Muse Spark Open via Baseten** | `meta-models/muse-spark-open-1026` (**hackathon ID, not muse-spark-open**) as **fallback** or dual-path so partner form is honest |
| **Modal** | Deploy serverless endpoint or GPU sandbox if we self-host a small piece; or host the API proxy |

### 4.3 Do not over-use (keep the demo tight)

| Skip unless extra day | Why |
|-----------------------|-----|
| Muse Wonder | Overkill for structured session JSON; Spark is the latency/cost model for the loop |
| Muse Glimmer on-device | Hardware/setup risk in 10 days |
| Computer-use agent | Out of scope; not daily-life social intent |
| Fine-tuning Spark Open | Not needed for MVP |

### 4.4 Why Meta’s models are important to the solution (draft for submission)

> IntentLoop is not a chatbot. It is a **closed loop** that needs (1) **constrained JSON** so IntentCard and ExitBrief never break the UI, (2) **speech-to-text** so a 5-second intent is actually 5 seconds on a phone, (3) **vision** so users can prove what they did without giving us their Instagram password, (4) **segmentation** so “scrolling while walking” is a **scene**, not a lecture, and (5) **image generation** so the session ends as something they can *see*. Those five jobs map to Muse Spark structured output + image understanding, Muse Voice Transcribe, SAM 3.1, and Muse Image — all on Meta Model API, built with Muse Code. A generic text LLM would force brittle parsing, skip voice, skip masks, and skip the visual close. Meta’s stack is the product, not a vendor swap.

### 4.5 Describe your use of Meta products (draft)

> We call **Meta Model API** (`POST /v1/responses` and Chat Completions where required for `json_schema`) with **Muse Spark 1.3** to emit IntentCard, check-in copy, and ExitBrief under JSON Schema. **Muse Voice Transcribe** (`POST /v1/asr/transcribe` and optional realtime WebSocket) captures spoken intent and recap. Users may attach a screenshot; Spark **image understanding** compares it to the IntentCard. **SAM 3.1** segments walking-scene photos for a single attention nudge. **Muse Image** renders a session card from the ExitBrief. We implement the app with **Muse Code** against this repo. Optional: **Muse Spark Open (`muse-spark-open-1026`)** on **Baseten** as an open-weight fallback.

### 4.6 Partner technologies (draft — fill after we actually use them)

Request credits day 1:

- Baseten $100 + 2M TPM (form in participant guide)  
- Modal $100 (first 1,000)  
- Fireworks $25 (select teams)

**Feedback template (honest after use):** latency, JSON schema reliability, ASR languages, SAM mask quality, credit onboarding, Discord support.

---

## 5. What we will **not** build (anti-projects + ethics)

- Medical / mental-health advisor, mood diagnosis, therapy  
- “AI for education” chatbot, nutrition coach, personality analyzer  
- Basic RAG over PDFs  
- Scraping Instagram/Facebook (ToS + banned risk)  
- Blocking other people’s cameras or stealth surveillance  
- Fake “connected to Instagram” OAuth  

Well-being framing: **agency and closure**, not clinical claims.

---

## 6. Product spec (MVP that looks extraordinary)

### UX placement (locked — end-user, not a launch quiz)

**Never on cold open.** First paint = Stories/Feed. Asking “what are you here to do?” trains Skip and fights why people open IG.

**Where intent comes from (use cases, not a form):**

| User goes here | Silent intent (Spark fills IntentCard) | What we show |
|----------------|----------------------------------------|--------------|
| **Home / Stories** | `browse` | Nothing |
| **Reels** | `browse_reels` (high-drift) | Nothing until **their** time limit |
| **DMs** | `reply_inbox` | Optional **header chip** (not a modal): “Inbox · on intent” |
| **+ Create / Reel post** | `post` | Optional **one line in composer** (composer is already slow; never block Share) |
| **Profile** | `self` | **Hub** — they already open this daily |
| **Profile → Your activity / Time spent** | settings | Daily limit **they set** (15 min) + IntentLoop on/off — same place as today’s reminder |
| **Bottom banner** (after limit, like real IG) | — | Skip · Remind 1h · Remind 2h · **See brief** |

**Voice:** not every open. Optional **once from Your activity** (“today’s focus”) or mic on the **brief** sheet.

**Adapter:** `instagram` | `facebook` | `generic` — demo IG fully; Facebook = same bottom sheet + activity page.

### Screens (hackathon IG-faithful mock)

1. **Home** — feed/stories, no overlay  
2. **DMs** — list + optional chip  
3. **Create** — composer, optional non-blocking line  
4. **Profile → Your activity** — limit, history, today’s outcome (pull)  
5. **Limit bottom sheet** — IG-identical actions + ExitBrief when they choose See brief  
6. **Evidence (optional)** from that sheet — screenshot / walk photo  

### Look and feel (Instagram-native, not a new brand)

IntentLoop should feel like **Instagram’s own time-spent sheet**, not a third-party widget.

| Token | Match Instagram |
|--------|-----------------|
| Motion | Sheet **slides up from the bottom**; dimmed feed behind; grab handle |
| Type | IG system: bold title, regular body, no long paragraphs |
| Actions | Full-width rows or stacked buttons: **Skip** (quiet) · **Remind in 1 hour** · **Remind in 2 hours** · **See brief** (one clearer row, not screaming CTA) |
| Chip | Tiny, in the **DM header** — grey pill, 12px, like “Requests” / filters — not a badge that pulses |
| Composer line | One muted sentence **under** the caption box, dismissible × |
| Profile | Same list style as **Your activity** (Time spent, Limits, Notifications) + one extra row: **Session briefs** |
| Dark/light | Follows IG theme |
| Never | Full-screen takeover on launch, red “warning”, streak gamification, shame copy |

**Copy tone:** same register as IG’s limit: factual, skippable, no lecture.

### Worked examples (end-to-end)

#### Example 1 — “I opened DMs, I ended in Reels” (hero)

**Who:** You. Daily limit already **15 minutes** (set once under Your activity, like today).

| Step | What you see | What you don’t |
|------|----------------|----------------|
| Open Instagram | Stories row + feed. **Identical to today.** | No sheet, no “what are you here to do?” |
| Tap paper-plane (DMs) | Normal inbox. Top: small grey chip **Inbox · on intent** (optional; can be off in settings). | No popup, no mic |
| Behind the glass | Spark writes IntentCard `surface: dms`, `goal: Reply in DMs`, `max_minutes: 15` | You never fill a form |
| You wander to Reels | Full-screen Reels, as today | Chip gone; no nag |
| Minute 15 | **Bottom sheet** (same family as IG’s “You’ve reached your daily limit”): handle, title **15 minutes today**, body **You started in messages.** Three familiar actions: Skip · Remind in 1 hour · Remind in 2 hours. Fourth: **See whether you did the thing** | Not a blocking quiz; Skip = IG as usual |
| Tap See brief | Sheet grows: **Drift 72** as a quiet number (not a health score). Two lines: *You opened messages to reply. Most of the time was Reels.* One button: **Open messages**. Optional: **Add a screenshot** / **I’m walking** (SAM) | No diagnosis, no “you’re addicted” |
| Open messages | Back in DMs; brief dismissed | — |
| Later, Profile → Your activity | Row **Today:** Reply in DMs · drifted · 15 min | Pull-only; nothing pushed on next open |

**Feel:** the interrupt you already trained yourself to accept, plus one extra choice that answers *did I do the job?*

#### Example 2 — Creator posting a Reel (slow path, still no launch tax)

**Who:** Freelancer. Opens IG to **post**, not to scroll.

| Step | What you see | What you don’t |
|------|----------------|----------------|
| Open app | Feed/Stories first | No intent modal |
| Tap **+** | Normal camera / New reel flow | — |
| Caption screen | Under caption, muted line: **Posting · that’s the session** with × to hide. Spark IntentCard `surface: create`, `goal: Post` | Does not block **Share** |
| Share | Post goes out as today | No extra confirm |
| If they stay and scroll after posting | Same 15-min (or their) limit banner later: *You came to post. That’s done. Rest is extra.* **See brief** → next action **Close Instagram** | We don’t celebrate with confetti |
| Profile → Your activity | **Posted · on intent** (low drift) | — |

**Feel:** Create is already intentional; we **label** the session, we don’t interview them. Share stays one tap.

#### Example 3 — Parent, 15-min limit, never opened DMs (browse-only)

**Who:** Opens IG for a mental break. Limit 15 min. Never taps DMs.

| Step | What you see | What you don’t |
|------|----------------|----------------|
| Open | Stories + feed immediately | Any question |
| Stories then Reels | Normal | Silent IntentCard `browse` / `browse_reels` |
| Minute 15 | **Exact IG limit chrome** they know: You’ve used Instagram for 15 minutes. Skip · 1 hour · 2 hours. Extra row only because IntentLoop is on: **See today’s brief** | A different-looking brand sheet |
| Skip | Banner gone; they continue (same as now) | Punishment |
| See brief | *You were browsing. That’s allowed. Your limit is up.* Next action **Remind me tomorrow in Your activity** or **Close**. Optional walk photo if they were scrolling on the street (SAM: phone + road) | Shame, “you wasted time” |
| Next open | Feed first again | Recap of last night |

**Feel:** If they only wanted to browse, IntentLoop **doesn’t invent a fake DM goal**. Brief is honest: browsing + limit. Value is **closure they opted into**, not a productivity lecture.

---

### Structured contracts (Spark must emit)

**IntentCard**

```json
{
  "goal": "Reply in DMs",
  "app": "instagram",
  "surface": "dms",
  "source": "inferred",
  "success": "Message sent or drafted",
  "max_minutes": 15,
  "avoid": "Reels",
  "check_in_prompt": "Still on replies, or did Reels take over?"
}
```

**ExitBrief**

```json
{
  "drift": 72,
  "happened": "Opened to reply; spent most of the time on Reels.",
  "next_action": "Open DMs and send the one reply, then close the app.",
  "tone": "neutral"
}
```

`tone` enum: `neutral` | `encouraging` — never shaming. `drift` 0 = fully on intent, 100 = fully off.

### Real-time (what “real time” means in 10 days)

- Tab change → Spark IntentCard in the background (no UI wait).  
- User-set limit → **same bottom banner as IG**, then ExitBrief if they tap See brief.  
- Optional voice on the **brief** sheet (ASR).  
- SAM when they attach a walking still from that sheet — not a live 30-fps pipeline.

### Tech stack (ship-fast, indie)

| Layer | Choice |
|-------|--------|
| App | Next.js (App Router) + TypeScript, mobile CSS, PWA |
| API | Next.js Route Handlers — **keys never in the browser** |
| Meta | OpenAI SDK `baseURL: https://api.meta.ai/v1` |
| State | Client session + IndexedDB |
| Deploy | Vercel (or Modal if we put inference proxy there) |
| Build agent | Muse Code |

No backend database for MVP (privacy + speed).

---

## 7. Architecture

```text
[Phone PWA]
    |  intent audio / text / image
    v
[Next.js /api/*]  ← MODEL_API_KEY
    |-- POST /api/intent      → Spark structured IntentCard
    |-- POST /api/transcribe  → Voice Transcribe
    |-- POST /api/checkin     → Spark (short coach, 1 question)
    |-- POST /api/exit        → Spark ExitBrief (+ optional image in)
    |-- POST /api/segment     → SAM 3.1 boxes/masks
    |-- POST /api/card        → Muse Image
    v
[UI] IG mock (feed first) → DMs/Create/Profile → limit banner → ExitBrief + card
```

Every route logs **model id + request id** (no user PII) so the README can show **proof of Meta usage**.

---

## 8. Day-by-day (commits = evidence of “built during hackathon”)

| When | Outcome |
|------|---------|
| **D0 (now–kickoff)** | This plan, repo hygiene, `.env.example`, request Baseten/Modal credits, install Muse Code, get `MODEL_API_KEY` |
| **D1** | Spark `/api/intent` from `surface`; IG Home mock **with no overlay** |
| **D2** | Tabs DMs / Reels / Profile; silent IntentCard on navigation |
| **D3** | Your activity + user-set 15-min limit; IG-style bottom banner |
| **D4** | ExitBrief in that banner path; Skip / Remind |
| **D5** | Screenshot → Spark vision evidence |
| **D6** | SAM walk-mode still + one nudge |
| **D7** | Muse Image session card; PWA polish |
| **D8** | Record 3-min video; README judging section; partner fallback if ready |
| **D9** | Bug bash, second scenario, accessibility |
| **Nov 4** | Submit **before 9 PM EST** (aim 6 PM EST / 3:30 AM IST Nov 5 — **submit evening of Nov 4 IST+** with buffer: **Nov 4 6:30 AM IST is already 9 PM previous day EST** — **critical:** 9 PM EST Nov 4 = **6:30 AM IST Nov 5**. Work backwards: freeze code **Nov 4 morning IST**, video **Nov 4 afternoon IST**, submit **Nov 4 night IST well before 6:30 AM Nov 5**. |

Timezone check: **9:00 PM EST Nov 4 = 6:30 AM IST Nov 5.** Plan submission **Nov 4 11:59 PM IST** (1:29 PM EST Nov 4) — **hours of buffer**.

---

## 9. 3-minute video storyboard (primary judging artifact)

| Time | On screen | Voice |
|------|-----------|--------|
| 0:00–0:25 | Real IG habit: open → feed instantly | “I don’t want a quiz on open. I want Stories first — like today.” |
| 0:25–0:45 | Tap DMs; chip only | “Tapping DMs *is* the intent. Spark writes the IntentCard. I didn’t type.” |
| 0:45–1:10 | Settings → Your activity, 15 min | “Same place I already set my daily limit.” |
| 1:10–1:40 | Bottom banner after 15 min | “Skip, remind in 1 hour — **or** see whether I did the thing.” |
| 1:40–2:10 | ExitBrief + optional screenshot | Spark vision: Reels vs DMs; one action: send the reply |
| 2:10–2:30 | Walk photo | SAM; one nudge — not a lecture |
| 2:30–3:00 | Profile activity + architecture | Muse Spark, Voice, SAM, Image, Muse Code. Portable to any social app. |

Show **code filename + model id** on screen once. No other company products.

---

## 10. Submission answers (keep updated as we build)

**Repo:** public URL  
**Video:** 3 minutes, unlisted, anyone-with-link  
**Theme:** Build for Your World  

See §4.4–4.6 for Meta-use, why Meta models, Meta product feedback, partner feedback.

---

## 11. Definition of done (extraordinary, not bloated)

**Must:**

- [ ] Live Spark structured IntentCard + ExitBrief  
- [ ] Voice in (Transcribe)  
- [ ] One vision path (screenshot **or** SAM) — **prefer both if D5–D6 hold**  
- [ ] Muse Image card  
- [ ] Works on a phone in the video  
- [ ] README: architecture, model IDs, “built during hackathon”  
- [ ] Public repo, no secrets  

**Nice:** Baseten Spark Open fallback, PWA install, history charts.

**Cut if late:** search grounding, realtime WS ASR (file upload is enough), multi-user accounts.

---

## 12. Meta for Meta (ecosystem story — video last 15s)

IntentLoop is a **companion**, not a competitor to Instagram. It makes **Meta AI / future Live AI** more useful: the assistant finally knows **this session’s goal**. Revenue for Meta is **trust, glasses/Live AI usefulness, Model API usage, optional premium session history** — not more mindless inventory.

---

## 13. Implementation plan (start → finish)

**Status:** plan locked for UX. Implement only after this section is followed. All code is **new during the hackathon**. Public repo.

### 13.1 Why a mock Instagram (not live Meta feeds)

There is **no public API** to inject UI into native Instagram or to stream a user’s real feed/DMs for a hackathon. Scraping would violate policy and risk **disqualification**.

We build an **IG-faithful phone shell** (390×844) with **static mock data** (stories, posts, reels, DM threads, profile). IntentLoop **sits on that shell** exactly as it would on real IG: feed first, infer from tabs, limit banner, Your activity.

Judges must **see it is a prototype of a native feature**, not “we cloned Instagram as the product.” Caption in README and video: *Mock surface so IntentLoop can live where the user actually is.*

### 13.2 What judges score (build to this)

| Stage | Bar | How we prove it |
|-------|-----|-----------------|
| **1 pass/fail** | Theme + **Meta Model API / open weights used** + new work + public repo + 3-min video + not banned | Live `api.meta.ai` calls; commit dates; no medical chatbot |
| **2 (0–10)** | Indie: **creativity, technical ambition, it works** | ≥3 Meta models on the golden path; structured JSON; phone demo |
| **3 finals** | Same rubric on **video** | Storyboard §9 + §14; model IDs on screen once |

**Do not** ship a wrapper chatbot. Every Meta model must **change the UI**.

### 13.3 Tools (stack)

| Role | Tool |
|------|------|
| App UI | Next.js App Router, TypeScript, CSS (IG-like, mobile-first) |
| Mock data | `src/mock/` JSON (posts, reels, threads, user) |
| Session | React state + IndexedDB (`limitMinutes`, IntentLoop on, history) |
| Backend | Next.js Route Handlers only — **no separate DB** |
| Secrets | `MODEL_API_KEY` server-only |
| Meta hosted | OpenAI SDK `baseURL: https://api.meta.ai/v1` |
| Coding | **Muse Code** (`muse`) |
| Hosting | Vercel |
| Optional partner | Baseten `meta-models/muse-spark-open-1026`; Modal deploy |
| Video | Phone screen record **or** desktop + iPhone frame; iMovie / CapCut; YouTube unlisted |

**Meta models on the golden path**

| API | Model | When in the product |
|-----|--------|---------------------|
| Responses / Chat Completions + JSON Schema | `muse-spark-1.3` | IntentCard on tab change; ExitBrief; screenshot understanding |
| `POST /v1/asr/transcribe` | `muse-voice-transcribe-1.0` | Optional mic **on the brief sheet** (not on open) |
| `sam-3.1` | SAM 3.1 | Walk still → masks → one nudge in brief |
| `muse-image-1.0` | Muse Image | Session card on ExitBrief |
| Muse Code | — | How the repo is written |

Use **Standard** Spark (`muse-spark-1.3`) unless credits require contributor IDs — document in README.

### 13.4 Repo layout (target)

```text
app/
  (ig)/                 # mock Instagram chrome
    page.tsx            # Home feed + stories
    reels/page.tsx
    dms/page.tsx
    create/page.tsx
    profile/page.tsx
    profile/activity/page.tsx
  api/intent/route.ts
  api/exit/route.ts
  api/transcribe/route.ts
  api/segment/route.ts
  api/card/route.ts
  api/vision/route.ts   # screenshot → Spark
components/
  ig/                   # TabBar, Stories, FeedCard, LimitSheet, BriefSheet, DmChip
  intentloop/           # uses API, never blocks Home
lib/
  meta.ts               # OpenAI client → api.meta.ai
  schemas.ts            # IntentCard, ExitBrief JSON Schema
  session.ts            # local session + surfaces
mock/
  feed.json  dms.json  reels.json  profile.json
docs/HACKATHON_PLAN.md
.env.example            # MODEL_API_KEY=
```

### 13.5 UI to build (pixel intent)

1. **Shell** — bottom tabs: Home, Reels, +, DMs, Profile. Status bar + IG-like icons.  
2. **Home** — stories row + 3–5 mock posts (royalty-free / generated placeholders). **No overlay.**  
3. **Reels** — vertical mock clips (poster images + captions).  
4. **DMs** — thread list; optional header chip `Inbox · on intent`.  
5. **Create** — caption field; muted line *Posting · that’s the session* + ×; Share works.  
6. **Profile** — avatar, grid of mock posts; link **Your activity**.  
7. **Your activity** — Time spent, **Daily limit** (default 15, editable), IntentLoop on/off, list of today’s briefs.  
8. **Limit sheet** — handle, dim backdrop, Skip / 1h / 2h / See brief.  
9. **Brief sheet** — drift, two lines, one action button, optional attach screenshot / walk photo, Muse Image card.  
10. **Demo speed** — settings **Demo: 15 min → 45 seconds** so the video does not wait a quarter hour.

Look: white/black like IG, **no separate IntentLoop brand color** on Home.

### 13.6 Backend (API contracts)

All routes: POST JSON, return JSON, log `model` + `id`.

| Route | Input | Meta call | Output |
|-------|--------|-----------|--------|
| `/api/intent` | `{ app, surface }` e.g. `dms` | Spark **structured** IntentCard | IntentCard |
| `/api/exit` | `{ intent, surfacesVisited[], elapsedSec, recap? }` | Spark structured ExitBrief | ExitBrief |
| `/api/vision` | `{ intent, imageBase64 }` | Spark **image understanding** | `{ happened, vs_intent }` |
| `/api/transcribe` | audio file | Voice Transcribe | `{ text }` |
| `/api/segment` | image + prompt `phone, car, crosswalk, person` | SAM 3.1 | boxes/masks summary |
| `/api/card` | ExitBrief text | Muse Image | image URL or base64 |

Client: on tab change → `/api/intent` (no spinner on Home). On See brief → `/api/exit` (and vision/segment if files). Timer from Your activity `max_minutes` (or demo compact).

**Errors:** if Spark is down, brief shows a static honest fallback *Limit reached. Brief unavailable.* — app still “works” for Stage 1; video uses a **live** successful call.

### 13.7 Step-by-step (do in this order)

**Prep (hours 0–4)**  
1. `MODEL_API_KEY` from Meta dashboard; `.env.local` gitignored.  
2. Install Muse Code; request Baseten/Modal credits.  
3. `create-next-app` in this repo; TypeScript; deploy empty Vercel.  
4. Curl Spark hello + JSON Schema so we know the key works.

**Vertical slice (must work before polish)**  
5. Mock Home + TabBar.  
6. `/api/intent` + navigate DMs → persist IntentCard.  
7. Your activity: 15 min + **demo 45s**.  
8. Limit sheet Skip / Remind / See brief.  
9. `/api/exit` → Brief sheet.  
10. Record a 20s test clip of this path (insurance).

**Ambition (judging)**  
11. Create + Profile activity history (IndexedDB).  
12. `/api/transcribe` on brief mic.  
13. `/api/vision` screenshot.  
14. `/api/segment` walk photo.  
15. `/api/card` Muse Image.  
16. Facebook-chrome toggle **or** copy: “same engine, other app” in activity — one extra adapter screen if time.  
17. README: architecture, model IDs, “built Oct 26–Nov 4”, how to run.  
18. Freeze UI → **video (§14)** → submit.

**Cut last if late:** Facebook adapter, realtime ASR WS, Baseten fallback, PWA install prompt.

### 13.8 Demo data (what “realtime feed” means in the mock)

- 4 stories (initials + color), 5 feed posts (name, time, image, likes).  
- 3 Reels posters.  
- 4 DM threads (one unread).  
- Profile grid 9 tiles.  
All **fake names** (not real celebrities, not stolen IG content). Images: unsplash-license or Muse Image-generated **assets we own**.

---

## 14. Video plan (primary judging artifact)

**Hard rules:** 3 minutes max; **only features built this week**; judges must see **Meta models**; phone-shaped UI; **no other company products**; public/unlisted link.

### 14.1 Goal of the tape

In 180 seconds a tired judge must believe: (1) this is a real IG habit, (2) we didn’t tax open, (3) Meta models are the product, (4) it **works**.

### 14.2 Setup

- Record **the deployed Vercel URL** on iPhone Safari (or Chrome device mode 390×844).  
- **Demo timer 45s** on.  
- Quiet room; one take of golden path + B-roll of code.  
- Backup: QuickTime iPhone + Mac.  
- Script printed; do not improvise legal/medical claims.

### 14.3 Shot list (edit to 3:00)

| Time | Shot | Picture | Voice (approx.) |
|------|------|---------|------------------|
| 0:00–0:12 | Title | IntentLoop · Build for Your World · Indie | “Social apps count minutes. They don’t ask if you did the thing you opened for.” |
| 0:12–0:28 | Home | **Feed first**, stories | “No quiz on open. Stories first — like Instagram today.” |
| 0:28–0:42 | DMs | Inbox + tiny chip | “I tap messages. That *is* the intent. Muse Spark writes an IntentCard. I didn’t type.” |
| 0:42–0:55 | Reels | Full-screen mock reel | “Then I drift. No nag. That’s how people actually use it.” |
| 0:55–1:12 | Activity | Daily limit 15 / demo 45s | “Same place I already set my limit. IntentLoop is a sibling of Time spent.” |
| 1:12–1:32 | Banner | Skip / 1h / 2h / See brief | “The interrupt I already know — plus one extra row.” |
| 1:32–1:55 | Brief | Drift + action Open messages | “ExitBrief from Spark. One action. Skip would have been fine too.” |
| 1:55–2:12 | Vision | Attach screenshot | “Optional: Spark looks at a screenshot I chose. No feed scrape.” |
| 2:12–2:25 | SAM | Walk still + mask overlay | “SAM 3.1: phone in a street scene. One nudge, not a lecture.” |
| 2:25–2:38 | Image | Muse Image card | “Session card so the loop is something I can see.” |
| 2:38–2:52 | Code | `lib/meta.ts` + `muse-spark-1.3` | “Meta Model API. Muse Code. Public repo. Built this hackathon.” |
| 2:52–3:00 | End card | URL + theme | “IntentLoop: time limits with a brain. Inside the app you already use.” |

**B-roll (2–3s each, overlay):** Voice Transcribe waveform; JSON IntentCard; SAM boxes.

### 14.4 What must appear on screen once

- `muse-spark-1.3`  
- `muse-voice-transcribe-1.0`  
- `sam-3.1`  
- `muse-image-1.0`  
- `https://api.meta.ai/v1`

### 14.5 Edit / publish

1. Cut dead air; captions for noisy judges.  
2. No stock “AI brain” clips.  
3. YouTube **Unlisted** or Drive “anyone with link.” Test in incognito.  
4. First 5s must work **muted** (title + feed).  
5. Export 1080p, ≤3:00.

### 14.6 Video failure modes

| Risk | Mitigation |
|------|------------|
| API timeout live | Pre-record golden path the night before; still show code + one live retry in backup take |
| Looks like a fake IG clone-as-product | Narration: “Mock surface so the layer can sit where users live.” |
| Looks like a chatbot | Never show a blank chat thread as the hero |

---

## 15. Submission checklist

- [ ] Public GitHub, no `.env`  
- [ ] README: run locally, model table, built-during-hackathon  
- [ ] Live Vercel URL  
- [ ] 3-min video link  
- [ ] Answers: Meta product use, why Meta models, Meta feedback, partner feedback (§4)  
- [ ] Representative = you (solo)  
- [ ] Submit **before Nov 4 9:00 PM EST** (target **Nov 4 11:59 PM IST**)

---

## 16. Links (official)

- Overview: https://dev.meta.ai/docs/overview  
- Quickstart: https://dev.meta.ai/docs/quickstart  
- Models: https://dev.meta.ai/docs/models  
- Structured output: https://dev.meta.ai/docs/structured-output  
- Cookbook: https://github.com/meta-models/meta-model-cookbook  
- Spark: https://dev.meta.ai/models/muse-spark  
- SAM 3.1: https://dev.meta.ai/models/sam-3-1  
- Submit: https://cerebralvalley.ai/e/meta-ai-developer-hackathon/hackathon/submit  

---

*Build the loop. Show the models. Ship something that works on a phone in three minutes.*
