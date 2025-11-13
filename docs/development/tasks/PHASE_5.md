# Phase 5 – Admin Workflow (Milestone M5)

Scope lines: CHECKLIST.md:130-141
Blocked by: Phases 1-4 (data, user flow, planner, auth)
Depends on Phase 6 (email templates) for final triggers

## Tasks
Visual refs: Dashboard `docs/Images/admin/overblik.png`, Detail `docs/Images/admin/detaljeside.png`, Approve modal `docs/Images/admin/detaljeside/godkend-ansøgning.png`
- [ ] Admin dashboard (list all events, newest submitted first) (l136)
- [ ] Filter/search (basic) (l137)
- [ ] Event detail view (read + edit) (l139)
- [ ] Department assignment UI (Byliv og drift fixed + add others) (l140)
- [ ] Per-department status update (pending/in_review/approved) (l141)
- [ ] Global review status transitions (Ubehandlet → Under behandling → Delvist godkendt → Godkendt | Afvist) [Afvist terminal; requires note]
- [ ] Approve flow: upload approval PDFs (one or more) (l143)
- [ ] Reject flow: mandatory note + email trigger (l144)
- [ ] Audit log display (paginated) (l145)
- [ ] Email triggers wired to status changes (l147)

## Acceptance Criteria
- Admin can process and finalize applications end-to-end (l148)
