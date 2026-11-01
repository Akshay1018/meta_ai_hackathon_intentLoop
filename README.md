# IntentLoop

**Outcome for your Instagram visit — not just minutes.**

IntentLoop is a **session layer** we built for the **Meta Global AI Developer Hackathon 2026** (Indie · **Build for Your World**). It sits **inside a faithful mock of Instagram** in this repo: feed first, familiar tabs, and the same *kind* of daily-limit moment people already know — then adds a **visit summary**, optional evidence, and (in a Reels record demo) **surroundings awareness** when you choose it.

This is **not** a change to Meta’s production apps. It is a **working prototype** that shows how time limits could close with **meaning**, using **Meta Model API** models on real routes.

**Live demo:** _Deploy URL will be added after Vercel setup._  
**3-minute video:** see [Video & submission checklist](docs/VIDEO_AND_SUBMISSION.md).

<p align="center">
  <img src="docs/readme/screenshots/01-home-feed.jpg" alt="Mock Instagram home — stories and feed, no IntentLoop overlay on open" width="320" />
</p>
<p align="center"><em>Feed first: no quiz, no overlay on cold open.</em></p>

---

## Table of contents

- [Why IntentLoop](#why-intentloop)
- [The gap Instagram leaves today](#the-gap-instagram-leaves-today)
- [How IntentLoop helps](#how-intentloop-helps)
- [Who it is for (personas)](#who-it-is-for-personas)
- [What we built](#what-we-built)
- [Meta AI tools — where and why](#meta-ai-tools--where-and-why)
- [Real situations we designed for](#real-situations-we-designed-for)
- [Trust, consent, and data](#trust-consent-and-data)
- [Screenshots by feature](#screenshots-by-feature)
- [Architecture](#architecture)
- [Run locally](#run-locally)
- [Tests and credits](#tests-and-credits)
- [Documentation](#documentation)
- [License](#license)

---

## Why IntentLoop

People open Instagram for a **job**: reply to a DM, post a photo, check one story, unwind for five minutes. The app is excellent at keeping you engaged. Meta also gives **Time spent** and **daily limits** (15, 30, 45 minutes, and custom) — that answers **how long** you stayed.

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

IntentLoop **does not replace** Meta’s controls. In this repo it **mock**s the shell and adds the **summary layer** judges can click through.

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

## Real situations we designed for

### Companion-scroll / no clear objective

You’re on a speakerphone or with friends, Instagram is open, and tabs blur together. IntentLoop does **not** detect the call. It uses the **same limit banner** you already understand and, if you want, a **visit summary** that describes drift without lecturing.

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
