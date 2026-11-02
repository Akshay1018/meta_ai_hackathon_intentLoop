# 3-minute demo video — script & recording guide

**Judging weights:** Impact 30% · Meta AI 25% · Demo 25% · Technical 20%  
**Rules:** English, ≤3:00, show **only what you built this hackathon**, opening line required, **live Meta calls** visible at least once.

---

## Structure (recommended — not rigid 30s × 6)

Fixed **30 seconds per feature** is easy to edit but feels rushed for the **opening** and **close**. Better:

| Block | Time | Why |
|-------|------|-----|
| Hook + before/after hackathon | 0:00–0:20 | Required opening line |
| Problem (minutes vs outcome) | 0:20–0:35 | Impact |
| Feed first + DMs intent (Spark) | 0:35–1:05 | Meta AI + product |
| Reels + optional record/SAM | 1:05–1:35 | SAM + Spark on screen |
| Limit → **See visit summary** (Spark exit) | 1:35–2:05 | Core demo moment |
| Brief extras + history | 2:05–2:35 | Voice / vision / Image + trust |
| Close (repo, models, “if Instagram shipped this”) | 2:35–3:00 | Judges remember last 30s |

Total **~3:00**. Trim Reels/SAM if you run long; never cut the limit → summary beat.

---

## Word-for-word script (adjust to your voice)

**0:00 — Opening (required)**  
“Before this hackathon, this repo was a mock Instagram shell. During Meta Global AI Developer Hackathon 2026, I built **IntentLoop** — a session layer that adds **outcome** when your **daily limit** hits, powered by **Muse Spark, Voice, SAM, and Image** on the Meta Model API.”

**0:20 — Problem**  
“Instagram already tells you **how long** you stayed. It doesn’t tell you **what this visit was for** — especially when you’re on a call and Reels wins. IntentLoop names the outcome, without a quiz when you open the app.”

**0:35 — Feed + DMs**  
“Home is **feed first**, like today. I open **Messages** — watch the silent **Inbox · on intent** chip. That’s **Muse Spark 1.3** structured JSON, cached once per visit, not a chatbot.”  
*(Optional: flash Network tab → `POST /api/intent` → `muse-spark-1.3`.)*

**1:05 — Reels**  
“I drift to **Reels**. On record, with consent, **SAM 3.1** plus Spark can give one calm surroundings nudge — not a lecture.”  
*(Show toggle + one nudge or manual Check.)*

**1:35 — Limit + summary**  
“Demo timer hits my **daily limit** — same sheet you know: Skip, Remind — plus **See visit summary**. One tap: drift, **time + where**, and an honest outcome line from Spark.”  
*(Network: `POST /api/exit`.)*

**2:05 — Extras + history**  
“Optional: match a screenshot, **Voice Transcribe**, or a **Muse Image** visit card — all opt-in. Summaries sit in **Your activity**, on device.”

**2:35 — Close**  
“IntentLoop is **Meta AI for Instagram**: minutes counted, visits understood. Public repo and live demo in the description. If Meta shipped one feature from this week, I’d want this on the limit sheet. Thanks.”

---

## Recording setup (you on camera, bottom-right)

**Best fit for hackathon rules (“person presenting preferred”):**

| Tool | Use |
|------|-----|
| **OBS Studio** (free) | Screen + webcam PiP bottom-right; record MP4 locally |
| **Screen Studio** (Mac, paid) | Polished cursor + face cam; fast for social clips |
| **Loom** | Quick take + link; less cinematic |
| **QuickTime** screen + **iMovie** | Free; add face cam as overlay |

**Settings:** 1080p, mic close to mouth, phone mock centered, **subtitles** in CapCut / Descript / iMovie (many judges watch muted).

**AI:** Editing (cuts, captions, noise removal) is fine. **Avoid** fully AI-generated presenter-only video — rubric wants **you** and **live product**. B-roll of code (`lib/meta*.ts`, model IDs) for 5–10s is good.

---

## One-session checklist (video + X clips)

1. Profile → Your activity → **Start new visit (demo)**  
2. DMs → Reels → (optional Create share)  
3. Wait for limit (~45s) → **See visit summary**  
4. Re-record **Clip A** (limit → summary) and **Clip B** (DMs chip) for [X_POSTS_MARKETING.md](./X_POSTS_MARKETING.md)  
5. Export **≤3:00** master + **15–45s** teasers  

Submit: video link + public GitHub + live Vercel URL.
