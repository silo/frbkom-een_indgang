# Phase 2 – User Application Flow (Milestone M2)

Scope lines: CHECKLIST.md:63-101
Blocked by: Phase 1 (API)
Planner embed placeholder acceptable early; full planner deferred to final phase (Phase 3 – run after customer feedback)

## Shared
- [x] Multi-step container component (state + step navigation) (l78)
- [x] Draft persistence only on explicit actions (l79)
- [x] Progress/completion % indicator per step (l80)
- [x] Validation integration (client + server Zod) (l81)

## Step 1 Kontaktoplysninger
Visual refs: `docs/Images/flow/kontaktoplysninger.png`, `docs/Images/flow/kontaktoplysninger/fejl.png`
- [x] CVR/CPR, Name, Phone, Email, Commercial (Ja/Nej) (l84)
- [x] Kontaktperson (Name, Phone) (l86)

## Step 2 Eventoplysninger
- [x] Enforce custom address rule ("egen adresse" hides planner; require single plan PDF) (rule)
- [x] Recurring interval limited to dagligt|ugentligt|månedligt (v1) (rule)
Visual refs: `docs/Images/flow/eventoplysninger/tom.png`, `docs/Images/flow/eventoplysninger/udfyldt.png`
- [x] Start/End datetime pickers (l88)
- [x] Location selector (preset vs "egen adresse" w/ autocomplete) (l89)
- [x] Event type tag multi-select badges (l90)
- [x] Title, Purpose, Attendance range dropdown (l91)
- [x] Optional PDF upload (relevant info) (l92)
- [x] Setup/Teardown dates (l93)
- [x] Recurring yes/no + interval dropdown (l95)

## Step 3 Praktiske forhold og sikkerhed
Visual refs: `docs/Images/flow/praktiske-forhold-og-sikkerhed/tom.png`, `docs/Images/flow/praktiske-forhold-og-sikkerhed/udfyldt.png`, `docs/Images/flow/praktiske-forhold-og-sikkerhed/fejl.png`, banner: `docs/Images/flow/praktiske-forhold-og-sikkerhed/Info banner.png`, icons: `docs/Images/flow/praktiske-forhold-og-sikkerhed/Construction Site 1.svg`, `docs/Images/flow/praktiske-forhold-og-sikkerhed/Coat of Arms.png`
- [x] Simultaneous persons dropdown (l97)
- [x] Temporary constructions yes/no + description + certificate upload (l98)
- [x] BR18 bilag 11 acknowledgment (radio) (l99)
- [x] Other considerations textarea (l100)
- [x] Arrangementsplan choice (upload vs embedded planner) except when "egen adresse" (upload only; planner hidden) (l101)
- [x] Sound section (has sound, description, responsible name/phone) (l103)

## Step 4 Tilladelser og drift
Visual refs: `docs/Images/flow/tilladelser-og-drift/tom.png`, `docs/Images/flow/tilladelser-og-drift/udfyldt.png`
- [x] Blockage required yes/no + description (l105)
- [x] Police permission yes/no + PDF upload (l106)
- [x] Waste handling yes/no + description (l107)
- [x] Food/drinks yes/no + description (l108)

## Step 5 Summary & Submission
Visual refs: `docs/Images/flow/opsummering-og-bekræftelse.png`, `docs/Images/flow/opsummering-og-bekræftelse/fejl.png`, `docs/Images/flow/bekræftelse.png`
- [x] Read-only grouped summaries (Steps 1–4) (l111)
- [x] Missing/invalid step indicators (l112)
- [x] Percentage complete indicator (overall + step) + disable submit until 100% valid (l113)
- [x] Submit final (status -> submitted) + email trigger (l115)

## Acceptance Criteria
- End-to-end draft → submit flow operational (l116)
