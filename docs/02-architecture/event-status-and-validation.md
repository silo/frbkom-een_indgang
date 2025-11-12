---
title: Event Status & Validation
slug: event-status-and-validation
version: 0.1.0
status: draft
lastUpdated: 2025-11-12
audience: [developers, ai]
owners: [platform-team]
tags: [status, validation, ux, rules]
i18n:
  defaultLocale: da-DK
  keysNamespace: docs.architecture.statusValidation
---

# Event Status & Validation (v1)

Documentation is written in English. All user-facing labels are Danish.

This document specifies the event review status lifecycle, field validation rules across steps, recurrence and construction type options, summary/submit gating, and the static OpenStreetMap component requirement.

## Event Review Status (Global)

These statuses are visible to users in Danish and stored with internal English keys. Department-level statuses remain separate (see Data Model).

| UI (da-DK) | Internal key | Meaning | Allowed next |
| --- | --- | --- | --- |
| Ubehandlet | unprocessed | Newly submitted; not yet picked up by any department | under_behandling, afvist |
| Under behandling | in_review | Under active review by at least one department | delvist_godkendt, godkendt, afvist |
| Delvist godkendt | partially_approved | Some departments approved; others pending or in review | godkendt, afvist |
| Godkendt | approved | Approved by all departments | — (terminal) |
| Afvist | rejected | Rejected for all departments (single global decision) | — (terminal, irreversible) |

Notes
- “Delvist godkendt” indicates mixed departmental decisions; global status transitions to “Godkendt” only once all departments are approved.
- “Afvist” is global-only. Departments do not set “afvist” individually in v1; they contact the applicant before declining their part. Once global status is “Afvist”, it cannot transition back.

## Department Status (Reference)

Department statuses are tracked per department to drive the global state:
- pending
- in_review
- approved
- declined (not used in v1; kept for completeness and history)

Global status derivation (guidance)
- unprocessed → event has status=submitted and all department statuses=pending
- in_review → at least one department is in_review, none rejected
- partially_approved → some approved, at least one pending or in_review
- approved → all departments approved
- rejected → explicitly set at global level (department “declined” is not used in v1)

## Validation Overview

- All fields are required across Steps 1–4.
- Free navigation between steps is allowed at any time.
- Summary page (Step 5) is accessible even when incomplete; submit remains disabled until 100% completion and valid data.
- Step completion percentages: computed as (valid required fields in step / total required in step) × 100. No special styling thresholds in v1.
- From Summary, clicking a step navigates to that step; fields with issues are shown in error state. No deep links to individual fields in v1.

## Field Validation (by Step)

### Step 1 – Kontaktoplysninger
- CPR/CVR: required. CPR format: 10 digits; CVR format: 8 digits. Exactly one of CPR (private) or CVR (business) as applicable; validate based on identity type.
- Name: required, min 2 characters.
- Phone: required, E.164 or local DK format, min 8 digits.
- Email: required, valid email format.
- Commercial (Ja/Nej): required boolean.
- Kontaktperson (Name, Phone): both required if different from main applicant.

### Step 2 – Eventoplysninger
- Title: required, min 3 characters.
- Purpose: required, min 10 characters.
- Attendance range: required; one of: 0–50, 51–200, 201–500, 501–1000, 1001–5000, 5001+.
- Start/End datetime: required; end > start; use @vuepic/vue-datepicker for inputs.
- Setup/Teardown (optional): if provided, must be within [start, end] window and setupStart <= setupEnd.
- Location selector: required; preset vs “egen adresse” (custom address with autocomplete). If custom, address text required.
- Event type tags: required; at least one tag.
- Recurring: radio yes/no (required). If yes, show interval dropdown with dagligt|ugentligt|månedligt; interval is required.
- Optional PDF upload (relevant info): if uploaded, must be PDF <= size limit (define in implementation).

New rule – Custom address
- If the user chooses “egen adresse” (custom), hide the map planner entirely.
- Require exactly one “plan” upload (PDF) as the arrangements plan; no choice between planner/upload in this case.

### Step 3 – Praktiske forhold og sikkerhed
- Simultaneous persons (range): required; same enum set as attendance range.
- Temporary constructions: required yes/no.
  - If yes: require construction type multi-select and description; accept optional certificate upload (PDF) if applicable.
  - Construction type multi-select values (UI): Tribune, Scene, Storskærme, Andet. Internal values: tribune, scene, storskaerme, andet. “Andet” does not trigger extra fields.
- BR18 bilag 11 acknowledgment: required (radio yes/no); must be “yes” to proceed.
- Other considerations: required text (can be short; min 3 chars).
- Arrangementsplan:
  - If location is preset: user may choose embedded planner OR upload a plan (PDF). At least one is required.
  - If location is custom (“egen adresse”): planner is hidden; required single plan upload (PDF).

### Step 4 – Tilladelser og drift
- Blockage required: required yes/no. If yes, blockage description: required text.
- Police permission applied: required yes/no. If yes, PDF upload (police approval): required and must be PDF.
- Waste handling: required yes/no. If yes, description: required text.
- Food/drinks: required yes/no. If yes, description: required text.

### Step 5 – Opsummering og bekræftelse
- Read-only grouped summaries (Steps 1–4).
- Show per-step completion percentage and list of missing/invalid fields per group (no deep links to field level).
- Submit button disabled until all required fields across Steps 1–4 are valid. On submit, global status transitions to “Ubehandlet” (internal: unprocessed) and event “status” remains submitted.

## Recurrence Rules
- UI: Radio (Har tilbagevendende arrangement? Ja/Nej). If Ja, render a dropdown with: dagligt | ugentligt | månedligt.
- Validation: interval required when recurring = true. No “yearly” option in v1.

## Date Inputs
- Library: @vuepic/vue-datepicker. Use consistent date/time format (da-DK) and ensure keyboard accessibility.

## Construction Types
- UI values: Tribune, Scene, Storskærme, Andet.
- Internal values: tribune, scene, storskaerme, andet.
- Validation: required when temporary constructions = yes; at least one selection.

## Static OpenStreetMap Component
- Purpose: Display-only map on the user front page (earlier submissions) and event detail view.
- Behavior: Takes an address string from the submission and renders a static, non-interactive map. No drag/zoom or marker edits.
- Proposed component: `components/OsmStaticMap.vue`
  - Props: `address: string` (required), `width?: number|string`, `height?: number|string`, `zoom?: number` (default sensible value), `alt?: string`.
  - Emits: none. Render-only.
  - Implementation: geocode address and render a static map image/tiles. Respect OSM tile usage policies and caching.

## Implementation Checklist
- Data model: add `reviewStatus` enum to `EventApplication` with values: unprocessed, in_review, partially_approved, approved, rejected. Keep `status` for draft/submission lifecycle.
- Department status: use pending/in_review/approved; do not present “declined” in UI in v1.
- Step 2 custom address rule: enforce planner hidden + required single plan upload.
- Recurrence: limit interval to daily/weekly/monthly and only show when recurring=true.
- Date inputs: standardize on @vuepic/vue-datepicker.
- Construction types: implement multi-select with the four options; internal values without diacritics.
- Summary: accessible while incomplete; show per-step %; disable submit until complete.

Open questions for later refinement
- File size/type constraints for uploads (plan, certificates, police approval) – finalize limits.
- Exact error messaging copy (da-DK) to be added in i18n files.
