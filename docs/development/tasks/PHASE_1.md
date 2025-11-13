# Phase 1 – Data Model & API (Milestone M1)

Scope lines: CHECKLIST.md:23-59
Blocked by: Phase 0 (tooling)

## Schema (Drizzle + migrations + seeds)
- [x] `user` (l37) - ✅ server/database/schema/user.ts
- [x] `department` (l38) - ✅ server/database/schema/department.ts
- [x] `event_application` (l39) - ✅ server/database/schema/event-application.ts
- [x] `event_artifact` (l40) - ✅ server/database/schema/event-artifact.ts
- [x] `event_document` (l41) - ✅ server/database/schema/event-document.ts
- [x] `event_sound_info` (l42) - ✅ server/database/schema/event-sound-info.ts
- [x] `event_waste_info` (l43) - ✅ server/database/schema/event-waste-info.ts
- [x] `event_food_info` (l44) - ✅ server/database/schema/event-food-info.ts
- [x] `event_safety_info` (l45) - ✅ server/database/schema/event-safety-info.ts
- [x] `event_access_info` (l46) - ✅ server/database/schema/event-access-info.ts
- [x] `event_status_history` (l47) - ✅ server/database/schema/event-status-history.ts
- [x] `department_event_status` (l48) - ✅ server/database/schema/department-event-status.ts
- [x] `event_audit_log` (l49) - ✅ server/database/schema/event-audit-log.ts
- [x] `location_preset` (l50) - ✅ server/database/schema/location-preset.ts
- [x] `event_type_tag` + link table (l51) - ✅ server/database/schema/event-type-tag.ts + event-type-tag-link.ts
- [x] Seeds: departments, type tags, location presets (l52) - ✅ server/database/seed.ts

## Zod Schemas
- [x] Event create/update (l55) - ✅ shared/schemas/event.ts (createEventSchema, updateEventSchema, saveDraftEventSchema)
- [x] Artifacts CRUD (l56) - ✅ shared/schemas/artifact.ts
- [x] Documents upload metadata (l57) - ✅ shared/schemas/document.ts
- [x] Per-info tables (sound/waste/food/safety/access) (l58) - ✅ shared/schemas/event-info.ts
- [x] Department status update (l59) - ✅ shared/schemas/department-status.ts

## tRPC Routers
- [x] `user` (me, myEvents) (l62) - ✅ server/trpc/routers/user.ts
- [x] `events` (create, update, saveDraft, submit, get/byId, listMine) (l63) - ✅ server/trpc/routers/events.ts
- [x] `artifacts` (list, create, update, delete) (l64) - ✅ server/trpc/routers/artifacts.ts
- [x] `documents` (upload, list, delete) (l65) - ✅ server/trpc/routers/documents.ts
- [x] `admin` (listAll, byId, updateStatus, setDepartmentStatus, audit log) (l66) - ✅ server/trpc/routers/admin.ts

## Implementation Notes
- Add `reviewStatus` enum on `EventApplication`: unprocessed | in_review | partially_approved | approved | rejected.
- Department status enum on `DepartmentEventStatus`: pending | in_review | approved. Keep `rejected` only for historical/reference, not in v1 UI.
- Zod: conditional rules for Step 2 (recurring interval required only when recurring = true) and custom address rule (hide planner; require exactly one plan PDF).
- i18n: add keys for validation messages (missing interval, required plan upload for custom address, BR18 acknowledge required).

## Other
- [x] Computed summary completion % endpoint (l69) - ✅ Part of event schema (summaryCompletionPct column)
- [x] Audit log writer utility (l70) - ✅ Integrated into tRPC routers (admin/events)

## Acceptance Criteria
- All entities + endpoints functional with validation (l72)
