# Phase 1 – Data Model & API (Milestone M1)

Scope lines: CHECKLIST.md:23-59
Blocked by: Phase 0 (tooling)

## Schema (Drizzle + migrations + seeds)
- [ ] `user` (l37)
- [ ] `department` (l38)
- [ ] `event_application` (l39)
- [ ] `event_artifact` (l40)
- [ ] `event_document` (l41)
- [ ] `event_sound_info` (l42)
- [ ] `event_waste_info` (l43)
- [ ] `event_food_info` (l44)
- [ ] `event_safety_info` (l45)
- [ ] `event_access_info` (l46)
- [ ] `event_status_history` (l47)
- [ ] `department_event_status` (l48)
- [ ] `event_audit_log` (l49)
- [ ] `location_preset` (l50)
- [ ] `event_type_tag` + link table (l51)
- [ ] Seeds: departments, type tags, location presets (l52)

## Zod Schemas
- [ ] Event create/update (l55)
- [ ] Artifacts CRUD (l56)
- [ ] Documents upload metadata (l57)
- [ ] Per-info tables (sound/waste/food/safety/access) (l58)
- [ ] Department status update (l59)

## tRPC Routers
- [ ] `user` (me, myEvents) (l62)
- [ ] `events` (create, update, saveDraft, submit, get/byId, listMine) (l63)
- [ ] `artifacts` (list, create, update, delete) (l64)
- [ ] `documents` (upload, list, delete) (l65)
- [ ] `admin` (listAll, byId, updateStatus, setDepartmentStatus, audit log) (l66)

## Implementation Notes
- Add `reviewStatus` enum on `EventApplication`: unprocessed | in_review | partially_approved | approved | rejected.
- Department status enum on `DepartmentEventStatus`: pending | in_review | approved. Keep `rejected` only for historical/reference, not in v1 UI.
- Zod: conditional rules for Step 2 (recurring interval required only when recurring = true) and custom address rule (hide planner; require exactly one plan PDF).
- i18n: add keys for validation messages (missing interval, required plan upload for custom address, BR18 acknowledge required).

## Other
- [ ] Computed summary completion % endpoint (l69)
- [ ] Audit log writer utility (l70)

## Acceptance Criteria
- All entities + endpoints functional with validation (l72)
