# IntentLoop

**Meta Global AI Developer Hackathon 2026** · Indie track · Theme: **Build for Your World**

**Product vision:** a layer **inside** Instagram / Facebook (portable to any social app). **No question on open** — feed first. Intent is inferred from **DMs, Create, Reels, Profile**. The interrupt matches Instagram’s own **user-set time-limit bottom banner** (Skip / Remind later). History lives in **Profile → Your activity**.

**Hackathon:** IG-faithful mock + Meta Model API engine (we cannot patch the real native app). Meta counts **time**. IntentLoop adds **outcome**.

```text
Feed first → tap DMs / Reels / Create / Profile → Muse Spark IntentCard (silent, cached)
  → your limit banner → See visit summary → ExitBrief
  → optional: screenshot (Spark vision), walk photo (SAM 3.1), voice note (WAV), session card (Muse Image)
```

**Built during the hackathon (Oct 26 – Nov 4, 2026).** All product code in this repository is new work for the event.

## Docs

- **[End-to-end plan](docs/HACKATHON_PLAN.md)** — product, architecture, video  
- **[Rules & judging](docs/HACKATHON_RULES_AND_JUDGING.md)** — read before every implementation step  
- **[Personas & impact](docs/PERSONAS_AND_IMPACT.md)** — who it’s for (demo + submission copy)

## Meta models (golden path)

| Model | Job |
|-------|-----|
| Muse Spark 1.3 | Structured IntentCard, check-in, ExitBrief, screenshot understanding |
| Muse Voice Transcribe | Spoken intent and recap |
| SAM 3.1 | Scene objects for walk-and-scroll nudge |
| Muse Image | Visual session card |
| Muse Code | How the app is implemented |

Inference: [Meta Model API](https://dev.meta.ai/docs/overview) `https://api.meta.ai/v1`

## Secrets (local only)

```bash
cp .env.example .env.local
```

Edit **`.env.local`** (gitignored). Fill `MODEL_API_KEY` and `BASETEN_API_KEY`. Never commit keys or paste them in chat.

Committed template: `.env.example`.

## Folder layout

```text
app/(ig)/          mock Instagram screens (Home, Reels, DMs, Create, Profile, activity)
app/api/           intent, exit, transcribe, vision, segment, card
components/ig/     Instagram chrome
components/intentloop/
lib/               Meta client, schemas, session
mock/              feed, dms, reels, profile JSON
docs/              HACKATHON_PLAN.md
```

## Run locally (step 1)

```bash
cd hackathon/meta_ai_hackathon_intentLoop
npm install
npm run dev
```

If you see **`Cannot find module './887.js'`** (or any `./NNN.js`), unstyled pages, or **ChunkLoadError**:

1. Stop **all** servers on port 3000 (do not run `npm run start` and `npm run dev` at the same time).
2. Run **`npm run dev:clean`** (deletes `.next` and starts dev).
3. Hard-refresh the browser (or use a new incognito window).

Verify routes: **`npm run smoke:routes`** (server must already be up).

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). You should see a phone-sized **Home** (stories + feed) with **no overlay**. A green dot above the phone means `MODEL_API_KEY` is set in `.env.local` (the key is never printed).

## Status

**Vertical slice:** Intent on **DMs / Reels / Create** (Spark, cached) · IG-style Reels + Create · activity · limit · **ExitBrief** on **See visit summary** · **Today** history · brief extras (vision / SAM / voice / Muse Image).

```bash
npm test                    # fixtures + timer math — no Meta credits
npm run test:meta-live      # light live Meta smoke (uses MODEL_API_KEY)
npm run test:meta-live:heavy  # more Spark + 3× Muse Image (billing check)
INTENTLOOP_FIXTURE=1 npm run dev   # UI without Spark
```

### Quick manual E2E (live Meta)

1. **Profile → Your activity** — IntentLoop on, **45s demo** timer, **Start new visit (demo)**.  
2. Visit **DMs → Reels → Create** (optional **Share**), then wait for the limit sheet.  
3. **See visit summary** — ExitBrief + optional extras on the sheet.  
4. Back to activity — confirm **Today** lists the summary.

## License

MIT (hackathon: repository must stay **public**).
