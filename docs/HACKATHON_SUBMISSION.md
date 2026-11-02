# Meta Global AI Developer Hackathon 2026 — requirements & what we shipped

**Track:** Indie · **Theme:** [Build for Your World](https://cerebralvalley.ai/e/meta-ai-developer-hackathon)  
**Product:** **IntentLoop** — Meta AI session layer for Instagram (mock UI + live Meta Model API)  
**Repo:** [github.com/Akshay1018/meta_ai_hackathon_intentLoop](https://github.com/Akshay1018/meta_ai_hackathon_intentLoop)  
**Live demo:** [meta-ai-hackathon-intent-loop.vercel.app](https://meta-ai-hackathon-intent-loop.vercel.app/)

---

## What the event required

| Requirement | How IntentLoop meets it |
|-------------|-------------------------|
| **Public repository** | This repo; no secrets in git |
| **Built during the hackathon window** (Oct 26 – Nov 4, 2026) | All product code in this repo is event work; video states before vs during |
| **Use Meta Model API / open-weight Muse** | Spark, Voice Transcribe, SAM 3.1, Muse Image on `https://api.meta.ai/v1` |
| **Theme: Build for Your World** | Real behavior — opening Instagram with a job, drifting, wanting closure at the **daily limit** you already use |
| **3-minute demo video** | See [VIDEO_AND_SUBMISSION.md](./VIDEO_AND_SUBMISSION.md) · script [VIDEO_SCRIPT_3MIN.md](./VIDEO_SCRIPT_3MIN.md) |
| **Submit by Nov 4, 2026, 9:00 PM EST** | [Submission portal](https://cerebralvalley.ai/e/meta-ai-developer-hackathon/hackathon/submit) |

**Out of scope (organizer bans):** medical/mental-health advisor, generic chatbot, basic RAG toy, etc. IntentLoop is a **structured session layer**, not a chat UI on launch.

---

## What we built (submission summary)

IntentLoop extends the Instagram-style **daily limit sheet** with **See visit summary** — one tap for **outcome** (what the visit was for, drift vs intent, **time + where**), powered by **Muse Spark** structured JSON. Optional evidence uses **Spark vision**, **Muse Voice Transcribe**, **SAM 3.1** (Reels record surroundings, opt-in), and **Muse Image** (private visit card). **Feed first** — no quiz on open. History in **Your activity** (device-local). Public demo is **rate-limited** (Upstash) to protect the Meta API key.

Full product walkthrough: [README](../README.md).

---

## Official Meta AI links

Same list as [HACKATHON_PLAN.md §16](./HACKATHON_PLAN.md#16-links-official):

- [Meta Model API overview](https://dev.meta.ai/docs/overview)
- [Quickstart](https://dev.meta.ai/docs/quickstart)
- [Models](https://dev.meta.ai/docs/models)
- [Structured output](https://dev.meta.ai/docs/structured-output)
- [Cookbook](https://github.com/meta-models/meta-model-cookbook)
- [Muse Spark](https://dev.meta.ai/models/muse-spark)
- [SAM 3.1](https://dev.meta.ai/models/sam-3-1)
- [Hackathon submit](https://cerebralvalley.ai/e/meta-ai-developer-hackathon/hackathon/submit)
