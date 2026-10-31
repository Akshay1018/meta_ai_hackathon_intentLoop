# Persona E2E test report

**Date:** 2026-11-01  
**Objective:** IntentLoop adds **outcome** on top of Meta’s **minutes** — each persona gets silent intent, honest limit close, Spark visit summary, and optional Meta tools (vision, voice, Muse) without shame or quiz-on-open.

## Coverage vs `PERSONAS_AND_IMPACT.md`

| Persona | In-app picker | Persona intent (Spark/fixture) | Persona exit brief | 7-day history | Meta tools wired |
|---------|---------------|--------------------------------|--------------------|---------------|------------------|
| Everyday scroller | Yes | Yes | Yes | Yes (shared) | Spark intent + exit |
| Companion-scroll | Yes | Yes (no fake DM goals) | Yes | Yes | Spark intent + exit |
| DMs-first | Yes | Yes | Yes | Yes | + Voice follow-up |
| Creator / poster | Yes | Yes | Yes | Yes | + Vision, visit card |
| Reels binger | Yes | Yes | Yes | Yes | Spark intent + exit |
| Profile checker | Yes | Yes | Yes | **Today + Last 7 days** | Spark intent + exit |
| Marketer | Yes | Yes | Yes | Yes | Vision, voice, card |
| Influencer pro | Yes | Yes | Yes | Yes | Voice, visit card |
| Busy parent | Yes | Yes | Yes | Yes | Limit + exit |
| Teen agency (16+) | Yes | Yes (no shame copy) | Yes | Yes | Voice optional |

## Automated tests (2 scenarios × 10 personas = 20)

**Unit / fixture logic:** `npx tsx --test lib/personas.test.ts` — **32 tests, all pass**  
**API (server on :3000):** `npm run test:personas` — **20/20 pass** (fixture mode)

### Scenario results

| Persona | Scenario A | Scenario B |
|---------|------------|------------|
| Everyday scroller | Feed → DMs → Reels hop — “mostly browsing” | Feed only — short scroll |
| Companion-scroll | Feed only — “no one task” | Feed → Reels — light drift, no fake job |
| DMs-first | DMs → Reels — high drift, reply CTA | DMs only — low drift |
| Creator-poster | Posted → Reels — win + drift | Posted clean — close |
| Reels binger | Reels only — dominated | Reels → DMs |
| Profile checker | Profile + feed — 7-day copy | Profile only |
| Marketer | Post + DMs — “posting done; DMs open” | DMs without post — promo CTA |
| Influencer pro | Batch DMs | Posted + DMs |
| Busy parent | Quick home | Home + hops — still “quick check” |
| Teen agency | Mixed tabs — encouraging | Reels only — no shame words |

## Manual E2E

See **[PERSONA_E2E_MANUAL.md](./PERSONA_E2E_MANUAL.md)** for step-by-step flows (real 45s demo timer, live Spark when `MODEL_API_KEY` is set).

## How to re-run

```bash
npm run dev:clean          # http://localhost:3000
npm test                   # includes lib/personas.test.ts
npm run test:personas      # unit + API persona matrix
```

**Note:** Do not run `npm run build` while `next dev` is running — it can break CSS until you `dev:clean` again.
