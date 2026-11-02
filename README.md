# IntentLoop · Meta AI for Instagram — **outcome** when your daily limit hits

## Instagram counts the minutes. IntentLoop names the outcome.

*Time limits tell you **how long**. A **visit summary** tells you **what the visit was for** — and whether it matched why you opened the app.*

IntentLoop is a **session layer** built for the **Meta Global AI Developer Hackathon 2026** (Indie · **Build for Your World**). In this repo it lives **inside a faithful mock of Instagram**: **feed first**, the **daily limit sheet** you already recognize — plus one extra row, **See visit summary**, powered by **Meta Model API** (Spark, Voice, SAM, Image).

**If Instagram shipped this:** users would keep today’s **Time spent** and **15 / 30 / 45 minute** reminders, and optionally gain **outcome** at the same moment — no new app, no quiz on open, history in **Your activity**. Same trust, clearer closure.

This prototype is **not** production Instagram. It is **working code** judges can run locally to see how **minutes + outcome** could feel native.

**Live demo:** [https://meta-ai-hackathon-intent-loop.vercel.app/](https://meta-ai-hackathon-intent-loop.vercel.app/)  
**3-minute video:** [Video & submission checklist](docs/VIDEO_AND_SUBMISSION.md).

<p align="center">
  <img src="docs/readme/screenshots/00-daily-limit-banner.png" alt="Mock Instagram Reels with the daily limit sheet: Skip, Remind me in 1 or 2 hours, and See visit summary" width="320" />
</p>
<p align="center"><em><strong>You’re at your daily limit</strong> — same sheet on Feed or Reels, with <strong>See visit summary</strong> as the IntentLoop door.</em></p>

---

## Meta AI tools — where and why

We use **specialized models for specialized jobs** — structured JSON and media routes, not one chat box.

| Feature / use case | Meta model (default ID) | Route | Where in the app | Why this model |
|--------------------|-------------------------|-------|------------------|----------------|
| Silent intent line | **Muse Spark 1.3** `muse-spark-1.3` | `POST /api/intent` | DMs, Create header chip | Strict **JSON** IntentCard; cached once per surface per visit |
| Visit summary | **Muse Spark 1.3** | `POST /api/exit` | Limit sheet → **See visit summary** | ExitBrief schema: drift, happened, next_action |
| Screenshot vs intent | **Muse Spark 1.3** (vision) | `POST /api/vision` | Brief → **Match a screenshot** | Compares **your** photo to why you opened |
| Voice recap | **Muse Voice Transcribe** `muse-voice-transcribe-1.0` | `POST /api/transcribe` | Brief → **Say what you still wanted** | Short WAV → text on device flow |
| Voice → next step | **Muse Spark 1.3** | `POST /api/voice-follow-up` | After transcribe | Routes to Search / Reels in mock UI |
| Recording surroundings | **SAM 3.1** `sam-3.1` + **Spark** (same request) | `POST /api/segment` | Reels → camera → alerts | SAM for segmentation signal; Spark reads frame for plain nudge |
| Visit memento | **Muse Image** `muse-image-1.0` | `POST /api/card` | Brief → **Create visit card** | Visual close users can keep locally |

**Not in the in-app loop:** Muse Code / Wonder (how we authored the repo). **Deferred:** Baseten Spark Open fallback, PWA.

API base: `https://api.meta.ai/v1` — see [Meta Model API](https://dev.meta.ai/docs/overview). Configure via `.env.local` ([`.env.example`](.env.example)).

---

## Table of contents

- [Meta AI tools — where and why](#meta-ai-tools--where-and-why)
- [A day you recognize](#a-day-you-recognize)
- [Why IntentLoop](#why-intentloop)
- [The gap Instagram leaves today](#the-gap-instagram-leaves-today)
- [If Meta shipped this](#if-meta-shipped-this)
- [How IntentLoop helps](#how-intentloop-helps)
- [Who it is for (personas)](#who-it-is-for-personas)
- [What we built](#what-we-built)
- [Real situations we designed for](#real-situations-we-designed-for)
- [Trust, consent, and data](#trust-consent-and-data)
- [Screenshots by feature](#screenshots-by-feature)
- [Architecture](#architecture)
- [Run locally](#run-locally)
- [Tests and credits](#tests-and-credits)
- [Documentation](#documentation)
- [License](#license)

---

## A day you recognize

You’re on a **video call** or in a **group chat on speaker**. Instagram is open on your lap. You tell yourself you’ll check **one DM** — then Stories, then Reels. The call ends and you realize you never sent that reply.

Today, when your **daily limit** pops up, you can **Skip** and keep scrolling. You still might not know:

- **Why did I open Instagram this time?**
- **Did I do that one thing?**
- **Where did the visit go** — Messages, Feed, or Reels?

IntentLoop adds **See visit summary** on that **same bottom sheet**. One tap → **visit summary**: a plain **outcome** line, **drift**, **time + where**, and an optional **next step** (for example, “Open DMs”). No lecture. **Skip** still works.

We do **not** listen to your call or detect that you’re on speaker. We use the **tabs you open** and **time on each surface** — the same kind of signals you’d expect from **Time spent** — then close the loop when **your limit** hits.

<p align="center">
  <img src="docs/readme/screenshots/02-dms-intent-chip.png" alt="DMs with silent Inbox on intent chip" width="320" />
</p>
<p align="center"><em>You opened for Messages — IntentLoop keeps a silent <strong>intent</strong> line while you browse.</em></p>

---

## Why IntentLoop

People open Instagram for a **job**: reply to a DM, post a photo, check one story, unwind for five minutes. The app is excellent at keeping you engaged. Meta already gives **Time spent** and **daily limits** (15, 30, 45 minutes, and custom) — that answers **how long** you stayed.

It does not, by itself, answer:

- **What was this visit for?**
- **Did I do the thing I opened for?**
- **Where did the minutes go** (Feed vs Reels vs Messages)?
- **Optional:** Is there something in my **environment** worth a calm nudge while I’m **recording** (with my consent)?

**Objective:** Extend the limit moment people already trust with one **honest visit summary**, stored in **Profile → Your activity**, powered by **structured Meta AI** — not a generic chatbot on launch.

**Psychology (plain language):** Autopilot scrolling — especially when the phone is out during a call or with friends — feels fine in the moment. Closure matters: a **neutral** line about the visit beats shame or a raw minute count.

---

## The gap Instagram leaves today

| What exists today (real Instagram) | What is missing for “outcome” |
|-----------------------------------|-----------------------------|
| Daily time reminders / limits | A structured **summary of the visit** tied to that limit |
| Time spent totals | **Which surfaces** absorbed the visit (Feed, Reels, DMs, …) in plain language |
| Skip / Remind later on the banner | Optional **next step** (“Open DMs”, “Close — post is done”) |
| — | Optional **evidence** you choose (screenshot, voice) compared to why you opened |
| — | In our **demo only**: Reels record + **surroundings check** with consent |

IntentLoop **does not replace** Meta’s controls. In this repo it **mocks** the shell and adds the **outcome layer** judges can click through.

---

## If Meta shipped this

| For people | What would feel different |
|------------|---------------------------|
| **Daily limit users** | Same banner grammar; optional **visit summary** instead of only “time’s up” |
| **DMs / Create openers** | Quiet **intent** line; summary says if Reels **drifted** the visit |
| **Companion-scroll** | Neutral closure after a fuzzy visit — not guilt, not more minutes |
| **Creators** | “Did I post?” answered in the **summary** when they shared |
| **Privacy-minded users** | Summaries on **device**; extras (photo, voice, camera) **opt-in** |

Built **during the hackathon (Oct 26 – Nov 4, 2026)** as a **public prototype**, not a promise of a Meta roadmap.

---

## How IntentLoop helps

```text
Open mock IG (feed first)
  → browse DMs / Reels / Create / Profile (local tab + dwell tracking)
  → silent IntentCard on DMs & Create when needed (Spark, cached per visit)
  → your limit sheet (Skip · Remind · See visit summary)
  → Visit summary: drift, one honest paragraph, time-on-tabs
  → optional: screenshot · voice · visit card · recording surroundings note
  → history in Your activity (Today + 7 days on device)
```

<p align="center">
  <img src="docs/readme/screenshots/11-visit-summary.png" alt="Visit summary with drift, time on tabs, and happened line" width="320" />
</p>
<p align="center"><em>Visit summary: drift, time + where, one plain-language line.</em></p>

---

## Who it is for (personas)

In **Profile → Your activity** you can pick a **persona** to tune demo copy and intent lines. Personas describe **real situations**; the app does **not** spy on calls, location, or other apps.

| Persona | Situation | What IntentLoop adds in this repo |
|---------|-----------|-----------------------------------|
| **Everyday scroller** | “Just five minutes” | Summary when limit hits; Skip always works |
| **Companion-scroll** | Phone out during a **call or with friends**, easy drift | Same limit UX; neutral summary — **no call detection** |
| **DMs-first** | Opened Messages to reply | **Inbox · on intent** chip; summary nudges back to DMs if Reels won |
| **Creator / poster** | Came to share a post | Tracks **posted this visit**; summary leads with the win |
| **Reels binger** | “A few clips” | High drift vs other goals; path line shows Reels time |
| **Profile checker** | Wants pattern over days | **Today** + **Last 7 days** on device |
| **Marketer / influencer / parent / teen (16+)** | Work or bounded personal use | Outcome + tone rules (no “addiction” language) |

<p align="center">
  <img src="docs/readme/screenshots/08-persona-picker.png" alt="Persona picker — DMs-first selected" width="320" />
</p>

Full matrix: [Personas & impact](docs/PERSONAS_AND_IMPACT.md).

---

## What we built

| Area | Shipped in this repo |
|------|----------------------|
| Mock Instagram | Home, Search, Reels, Shop, Profile, DMs, Create |
| Session layer | Limit timer (45s demo or minutes), limit sheet, visit summary sheet |
| Intent | Spark **IntentCard** on **DMs & Create** (session cache) |
| Exit | Spark **ExitBrief** on **See visit summary** |
| Time + where | Dwell by tab in summary and activity (refresh on demand) |
| History | Today list + IndexedDB **7-day** summaries |
| Personas | 10 personas + **Start persona visit** |
| Brief extras | Screenshot match, voice note, Muse Image visit card (each behind consent) |
| Reels record mock | Mac camera, auto/manual **surroundings** (SAM + Spark), Reels-only alert toggle |
| Search | Prefill `?q=` from vision / voice follow-up (mock results UI) |

Built **during the hackathon window (Oct 26 – Nov 4, 2026)**. All product code in this repository is event work.

---

## Real situations we designed for

### On a call, scrolling with no clear outcome

**Your day:** Speakerphone or group call; Instagram open; you drift through Feed and Reels.  
**IntentLoop:** When **your daily limit** hits, tap **See visit summary**. You get **why the visit looked like** (for example, “You opened for messages but Reels showed up”) and **time + where** — so you know if you still owe yourself that DM. Choose **Companion-scroll** in **Your activity** to tune demo copy for this story.

### Companion-scroll / no single objective

Tabs blur together; there was no one “job.” The **visit summary** still gives a **neutral outcome line** and drift — closure without shame. **No call detection**; no extra sensors.

### DMs intent, Reels wins

<p align="center">
  <img src="docs/readme/screenshots/02-dms-intent-chip.png" alt="DMs inbox with Inbox on intent chip" width="320" />
</p>

Spark sets a silent goal; dwell + exit summary describe whether Messages or Reels dominated.

### Recording a reel — surroundings (demo)

With **consent**, the Reels **record** mock turns on your **Mac camera**. **Surroundings alerts** (toggle on that screen) run SAM + Spark on frames; you can get a nudge if another phone appears in view. Nothing is posted to the feed.

<p align="center">
  <img src="docs/readme/screenshots/04-reels-surroundings.png" alt="Surroundings nudge while recording — another phone in frame" width="320" />
</p>

Recording surroundings can also appear under **Recording surroundings** on the visit summary when IntentLoop is on.

### “I meant to save that post”

On the summary sheet, optionally **match a screenshot** (Spark vision) or **say what you still wanted** (Voice + Spark routing).

<p align="center">
  <img src="docs/readme/screenshots/12-visit-summary-extras.png" alt="Summary incomplete — screenshot and voice options" width="320" />
</p>

### Private visit card

Optional **Muse Image** background + on-device composited card — memento only, not shared to feed.

<p align="center">
  <img src="docs/readme/screenshots/13-visit-card.png" alt="Private visit card with drift and happened line" width="320" />
</p>

---

## Trust, consent, and data

- Summaries, dwell, and history stay **on this device** (sessionStorage / IndexedDB).
- We do **not** ask for your real Instagram password or read real DMs.
- **Photo, voice, surroundings, visit card** run only when you enable them in **Your activity** and trigger them in flow.

<p align="center">
  <img src="docs/readme/screenshots/07-privacy-consent.png" alt="Privacy copy and optional feature toggles" width="320" />
</p>

**API usage:** No Meta polling while idle on Home. Intent calls happen when you open **DMs/Create** (first time per visit, then cache). Exit runs when you tap **See visit summary**. Reels surroundings can repeat while the **record** preview is active and alerts are on — leave that page or turn alerts off to stop.

---

## Screenshots by feature

| Topic | Image |
|-------|--------|
| Feed first (no overlay on open) | ![Home feed](docs/readme/screenshots/01-home-feed.jpg) |
| Daily limit on Reels + **See visit summary** | ![Limit banner on Reels](docs/readme/screenshots/00-daily-limit-banner.png) |
| Reels tab | ![Reels](docs/readme/screenshots/03-reels.png) |
| Profile → Your activity | ![Activity timer and time + where](docs/readme/screenshots/06-activity-time-where.png) |
| Today history | ![Today](docs/readme/screenshots/09-history-today.png) |
| Last 7 days | ![7-day history](docs/readme/screenshots/10-history-7d.png) |
| Profile grid | ![Profile](docs/readme/screenshots/05-profile.jpg) |
| Reels record (before camera) | ![Camera off state](docs/readme/screenshots/14-reels-record-camera-off.png) |

---

## Architecture

```text
┌─────────────────────────────────────────┐
│  Mock IG UI (app/(ig)/)                  │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  Session layer (components/intentloop/)  │
│  timer · tracker · brief · consent       │
└──────────────────┬──────────────────────┘
                   │ POST /api/*
┌──────────────────▼──────────────────────┐
│  Meta Model API (lib/meta*.ts)           │
└─────────────────────────────────────────┘
```

---

## Run locally

**Requirements:** Node 20+, npm, `MODEL_API_KEY` in `.env.local` for live Meta (optional fixtures for UI-only).

```bash
git clone <your-public-repo-url>
cd hackathon/meta_ai_hackathon_intentLoop
npm install
cp .env.example .env.local   # add MODEL_API_KEY
npm run dev:clean
```

Open [http://localhost:3000](http://localhost:3000).

**Judge / demo path (45s):**

1. **Profile → Your activity** → IntentLoop **on** → **Start new visit (demo)**  
2. **DMs → Reels → Create** (optional Share)  
3. Wait for limit sheet (~45s in demo mode)  
4. **See visit summary**  
5. Optional: Reels → camera → surroundings; persona picker; check **Today** / **7 days**

If CSS or chunks break: stop port 3000, run `npm run dev:clean`, hard-refresh.  
Route smoke (server up): `npm run smoke:routes`

**Public demo (Vercel):** set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` so `/api/*` is rate-limited per IP (~150 AI calls/hour — enough for several full judge runs). Users see a plain **Try again** message with retry timing; optional `RATE_LIMIT_BYPASS_SECRET` for submission notes only.

**UI without spending credits:**

```bash
INTENTLOOP_FIXTURE=1 NEXT_PUBLIC_INTENTLOOP_FIXTURE=1 npm run dev:clean
```

---

## Tests and credits

```bash
npm test                    # unit tests — no Meta billing
npm run test:summary-flow   # local API smoke (fixtures if no key)
npm run test:personas       # persona fixtures
npm run test:meta-live      # light live Meta smoke — uses key
```

Do not run live Meta scripts in a loop. See [Hackathon rules](docs/HACKATHON_RULES_AND_JUDGING.md) for credit hygiene.

---

## Documentation

| Doc | Purpose |
|-----|---------|
| [HACKATHON_PLAN.md](docs/HACKATHON_PLAN.md) | Product arc + video storyboard |
| [HACKATHON_RULES_AND_JUDGING.md](docs/HACKATHON_RULES_AND_JUDGING.md) | Rules and rubric |
| [PERSONAS_AND_IMPACT.md](docs/PERSONAS_AND_IMPACT.md) | Persona matrix |
| [VIDEO_AND_SUBMISSION.md](docs/VIDEO_AND_SUBMISSION.md) | 3-min video checklist |
| [PERSONA_E2E_MANUAL.md](docs/PERSONA_E2E_MANUAL.md) | Manual E2E |
| [BACKLOG_REMAINING.md](docs/BACKLOG_REMAINING.md) | Ship backlog (Vercel, rate limit, …) |

---

## License

MIT — submission uses a **public** repository. Never commit `.env.local` or API keys.
