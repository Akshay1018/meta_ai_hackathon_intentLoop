# Hackathon rules & judging — read before every implementation step

Use this file as a gate. If a change would violate a row below, do not ship it.

**Event:** Meta Global AI Developer Hackathon 2026 · **Indie** · Theme: **Build for Your World**  
**Submit:** public repo + 3-minute video by **4 Nov 2026, 9:00 PM EST**  
**Product:** IntentLoop lives **inside** a mock Instagram. **No quiz on open.** Infer intent from tabs. Interrupt = user-set limit banner (Skip / Remind / See brief).

---

## Hard rules (disqualification)

| Rule | What we do |
|------|------------|
| **Public repo** | Keep GitHub public; no `.env.local` in git |
| **New work this event** | Only code in this repo from the hackathon window; video says so |
| **Demo = what we built here** | Judges must see features from **this** week, not other products |
| **Must use Meta models** | Real calls to **Meta Model API** and/or **open weights** (Baseten `muse-spark-open-1026`) |
| **No rights we don’t have** | Mock feed only — no scraping Instagram/Facebook |
| **Banned project types** | No medical/mental-health advisor, basic RAG toy, generic chatbot, nutrition/personality/sports coach, politics |
| **Team** | Solo OK |

---

## Judging (build to this)

**Stage 1 — pass/fail:** theme fit + **reasonably used Meta Model API / open-weight Muse** + not banned.

**Official Stage 2 rubric (0–10, then weighted):**

| Category | Weight | What we optimize |
|----------|--------|------------------|
| **Impact** | **30%** | Real people on IG/FB; outcome vs minutes; could Meta ship this? Theme: Build for Your World |
| **Use of Meta AI tooling** | **25%** | Spark structured JSON, Voice, SAM, Image — not a single chat wrapper |
| **Technical depth & execution** | **20%** | Cache, fail-open DMs, schemas, no key leaks |
| **Demo** | **25%** | 3-min video; live product; feed first |

**Stage 3:** top 5 per track — judges watch **video** live with the same weights.

**Implication:** a model that never changes the UI is a wrapper. Every Meta model we add must **show up on screen**.

**Credits:** cache IntentCards per surface/session; `INTENTLOOP_FIXTURE=1` for UI tests; **one** live Spark call per surface until cache clears. Do not hammer APIs in `npm test`.

---

## Where Meta models belong (IntentLoop)

| Model | When the user sees it | Status |
|-------|------------------------|--------|
| **Muse Spark 1.3** (`MODEL_API_KEY` → `https://api.meta.ai/v1`) | IntentCard on **DMs** (cached); **ExitBrief** on See brief | **Live: Steps 2–4 — intent + exit (2 Spark calls max per demo run)** |
| **Muse Voice Transcribe** | Mic on the **brief sheet**, not on open | Later |
| **SAM 3.1** | Optional walk photo on brief | Later |
| **Muse Image** | Session card on brief | Later |
| **Muse Code / Wonder** | How we write code in the terminal (`ANTHROPIC_*`) — **not** the in-app loop | Dev only unless we show it in the video |
| **Baseten Spark Open 1026** | Fallback if Meta API errors | Later |
| **Modal** | Optional function using secret `intentloop-key` | Later |

**App env:** `.env.local` → `MODEL_API_KEY`. Never log keys.

---

## UX rules (product, not Meta legal)

- Home / Stories / feed **first** — no overlay on cold open  
- Intent from **DMs / Create / Reels / Profile**, not a typed quiz  
- Banner matches IG: Skip · Remind 1h · Remind 2h · See brief  
- History in **Profile → Your activity**  
- No other company names in UI or video  

---

## Implementation checklist (copy into each step)

- [ ] Does this step call a Meta model, or is it still chrome? If chrome-only, say so in the recap.  
- [ ] If it calls a model: which ID, which route, what appears in the UI?  
- [ ] No scrape, no medical claims, no launch modal.  
- [ ] Keys stay in `.env.local` / Modal secret.  
- [ ] Demo timer (45s) exists before we record video.

---

## Submission questions (fill as we actually use tools)

1. Describe use of Meta products  
2. Why Meta’s models matter to this solution  
3. Feedback on Meta products  
4. Feedback on partner tech (Baseten / Modal / Fireworks)

Drafts live in `HACKATHON_PLAN.md` §4 — update after real calls succeed.
