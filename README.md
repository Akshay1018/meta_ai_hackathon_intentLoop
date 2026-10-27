# IntentLoop

**Meta Global AI Developer Hackathon 2026** · Indie track · Theme: **Build for Your World**

**Product vision:** a layer **inside** Instagram / Facebook (portable to any social app). **No question on open** — feed first. Intent is inferred from **DMs, Create, Reels, Profile**. The interrupt matches Instagram’s own **user-set time-limit bottom banner** (Skip / Remind later). History lives in **Profile → Your activity**.

**Hackathon:** IG-faithful mock + Meta Model API engine (we cannot patch the real native app). Meta counts **time**. IntentLoop adds **outcome**.

```text
Speak or type intent → Muse Spark IntentCard → session
  → optional screenshot (Spark vision) / walking photo (SAM 3.1)
  → ExitBrief + one next action → Muse Image session card
```

**Built during the hackathon (Oct 26 – Nov 4, 2026).** All product code in this repository is new work for the event.

## Docs

- **[End-to-end plan](docs/HACKATHON_PLAN.md)** — problem, users, judging, Meta model map, architecture, video, submission copy

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

## Status

Folder structure is in place. Routes are stubs until we implement step by step.

## License

MIT (hackathon: repository must stay **public**).
