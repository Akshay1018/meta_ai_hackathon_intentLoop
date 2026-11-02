# IntentLoop — remaining backlog (after summary page pass)

Work through **one item at a time** with the user. Order is suggested priority for production + hackathon.

## Product & UX

- [x] **7-day visit history** — IndexedDB list in Your activity (with Today)
- [x] **Time + where UI** — dwell tracking + bar/legend in visit summary and Your activity
- [x] **Persona picker in app** — all 10 personas in Your activity
- [x] **Browse-only / companion-scroll copy** — persona + Spark hints; fixture exit
- [x] **SAM on Live / recording surface** — `/reels/record` + Check surroundings → `/api/segment`
- [x] **Search prefill** — `?q=` from vision + voice actions (mock results list)

## Ship & hackathon

- [x] **README** — architecture, model IDs, judging section, “built during hackathon”
- [x] **Rate limit** on `/api/*` (Upstash + UI copy) — set `UPSTASH_*` on Vercel before sharing widely
- [ ] **Vercel deploy** (env vars + live URL in README)
- [ ] **3-minute video** — storyboard in `HACKATHON_PLAN.md` §9
- [ ] **PWA polish** — manifest, install hint (nice-to-have)
- [ ] **Baseten Spark Open fallback** — optional partner path

## Quality

- [ ] **Facebook adapter** — cut unless needed for submission
- [x] **E2E checklist** — `docs/PERSONA_E2E_MANUAL.md` + `npm run test:personas`

## Done (summary page pass)

- [x] Horizontal drift bar
- [x] Visit path line (tabs · elapsed)
- [x] “Summary incomplete?” collapsed; auto-expand drift ≥ 40%; “Not quite right?”
- [x] Match a screenshot / Say what you still wanted (open loops)
- [x] Private visit card (separate memento section)
- [x] Unit tests + `npm run test:summary-flow`
