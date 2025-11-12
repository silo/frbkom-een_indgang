# Cross-Cutting Items

Scope lines: CHECKLIST.md:195-199

## Tasks
- [ ] All fields required (Steps 1–4); free navigation allowed; summary accessible while incomplete; submit gated (100% valid)
- [ ] Summary shows per-step completion %; clicking a group navigates to step; fields show error states (no deep links)
- [ ] Standardize date inputs on @vuepic/vue-datepicker
- [ ] Construction type multi-select values: tribune, scene, storskaerme, andet (UI: Tribune, Scene, Storskærme, Andet)
- [ ] Implement static OSM map component for frontpage list + detail (address → static map, no interaction)
- [ ] Enforce Step 2 custom address rule: if location=custom, hide planner and require single plan upload (PDF)
- [ ] Review status lifecycle implemented: unprocessed → in_review → partially_approved → approved | rejected (terminal)
- [ ] Locale file coverage >= 100% of UI strings (l195)
- [ ] Error handling standardized (user-friendly messages) (l196)
- [ ] Zod schemas kept in sync with DB changes (l197)
- [ ] Audit log entries for create/update/status/document actions (l198)
- [ ] Security baseline: HTTPS (prod), CSRF/state/nonce, no secrets in logs (l199)
