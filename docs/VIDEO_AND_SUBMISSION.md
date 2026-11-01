# 3-minute video & submission checklist

**Event:** Meta Global AI Developer Hackathon 2026 · Indie · **Build for Your World**  
**Repo:** public GitHub + this README + demo video.

---

## Video rules (follow exactly)

- Show **only what we built during the event** — no slides for unbuilt ideas. Future work stays in writing.
- **Understandable in English** — voiceover and/or subtitles/transcript.
- **Opening line (required):** state what existed before the hackathon vs what we built during it.  
  Example: *“Before the hackathon this repo was an empty shell; during the event we built IntentLoop — a session layer on a mock Instagram that turns Meta’s time limit into a visit summary powered by Spark, Voice, SAM, and Image.”*
- **End-to-end working flow** with **live Meta model calls visible** (briefly show Network tab or on-screen model IDs / responses where natural).
- AI-assisted editing is fine; a person presenting is preferred.

---

## Suggested 3-minute beat sheet

| Time | Show | Meta call to highlight |
|------|------|-------------------------|
| 0:00–0:15 | Opening line + Home feed, no overlay | None |
| 0:15–0:35 | DMs → **Inbox · on intent** chip | `POST /api/intent` → Spark |
| 0:35–0:55 | Reels → record → surroundings nudge | `POST /api/segment` → SAM + Spark |
| 0:55–1:15 | Browse tabs; mention 45s demo timer | Client-only timer |
| 1:15–1:45 | Limit sheet → **See visit summary** | `POST /api/exit` → Spark |
| 1:45–2:15 | Optional screenshot / voice / visit card (if consented) | vision / transcribe / card |
| 2:15–2:45 | Profile → Your activity → Today / 7-day | Local history |
| 2:45–3:00 | Close: public repo + what Meta models did | — |

---

## Before you upload

- [ ] Length ≤ 3 minutes  
- [ ] English clear (subtitles OK)  
- [ ] No other company products in UI or narration  
- [ ] Demo uses **this** repository build  
- [ ] Description links **public GitHub** (and Vercel URL when live)  
- [ ] Submit before **4 Nov 2026, 9:00 PM EST**

---

## Primary demo path (matches README)

1. Profile → Your activity → **Start new visit (demo)**  
2. DMs → Reels → Create (optional Share)  
3. Wait for limit (~45s in demo mode)  
4. **See visit summary**  
5. Optional: Reels camera surroundings, persona picker, history  

Manual checklist: [PERSONA_E2E_MANUAL.md](./PERSONA_E2E_MANUAL.md)
