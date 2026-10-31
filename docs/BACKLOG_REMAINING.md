# IntentLoop — remaining backlog (after summary page pass)

Work through **one item at a time** with the user. Order is suggested priority for production + hackathon.

## Product & UX

- [ ] **7-day visit history** — IndexedDB (or extend localStorage), list in Your activity
- [ ] **Time + where UI** — optional bar chart or table (minutes per surface) alongside path line
- [ ] **Persona picker in app** — demo presets (DMs-first, Create+Share, companion-scroll) for video
- [ ] **Browse-only / companion-scroll copy** — Spark prompts so brief doesn’t invent fake DM goals
- [ ] **SAM on Live / recording surface** — mock “Go Live” or Reels camera; wire `/api/segment` there only
- [x] **Search prefill** — `?q=` from vision + voice actions (mock results list)

## Ship & hackathon

- [ ] **README** — architecture, model IDs, judging section, “built during hackathon”
- [ ] **Vercel deploy** + **rate limit** on `/api/*` (protect `MODEL_API_KEY`)
- [ ] **3-minute video** — storyboard in `HACKATHON_PLAN.md` §9
- [ ] **PWA polish** — manifest, install hint (nice-to-have)
- [ ] **Baseten Spark Open fallback** — optional partner path

## Quality

- [ ] **Facebook adapter** — cut unless needed for submission
- [ ] **E2E checklist** — second persona run documented in README

## Done (summary page pass)

- [x] Horizontal drift bar
- [x] Visit path line (tabs · elapsed)
- [x] “Summary incomplete?” collapsed; auto-expand drift ≥ 40%; “Not quite right?”
- [x] Match a screenshot / Say what you still wanted (open loops)
- [x] Private visit card (separate memento section)
- [x] Unit tests + `npm run test:summary-flow`
