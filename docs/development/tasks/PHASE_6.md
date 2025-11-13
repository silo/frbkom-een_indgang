# Phase 6 – Submission, Emails, Documents (Milestone M6)

Scope lines: CHECKLIST.md:145-161
Blocked by: Phases 1-2, 4-5 (data model, user flow, auth, admin status changes)
Open Items: SendGrid sender + template IDs; Final approved/rejected email copy

## Documents
- [ ] PDF upload component (<=5MB, MIME check) (l154)
- [ ] Store binary in Postgres (bytea) (l155)
- [ ] List + delete interface (respect access rules) (l156)

## Emails (SendGrid)
- [ ] Submission confirmation template (l159)
- [ ] Review status approved template (with attachments list summary) (l160)
- [ ] Review status rejected template (includes admin note) (l161)
- [ ] Hook events to email service (l162)

## User Events Page
- [ ] “My Events” list (draft/submitted + review badges: Ubehandlet/Under behandling/Delvist godkendt/Godkendt/Afvist) (l165)
- [ ] Link to resume draft editing (l166)

## Acceptance Criteria
- Document handling & notifications functional (l169)
