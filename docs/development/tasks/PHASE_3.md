# Phase 3 – Map Grid Planner (Deferred, executes after Phase 8 once customer feedback lands)

Scope lines: CHECKLIST.md:105-114
Blocked by: Phase 1 artifact schema; Phase 2 step integration
Open Item: Location preset image final paths (l222)

## Tasks
Visual refs: use Step 3 visuals for context — `docs/Images/flow/praktiske-forhold-og-sikkerhed/tom.png`, `udfyldt.png`; artifact icon example: `docs/Images/flow/praktiske-forhold-og-sikkerhed/Construction Site 1.svg`
- [ ] Static background image load based on selected location preset (l121)
- [ ] Sidebar artifact palette (stage, booth, facility, other) (l122)
- [ ] Drag & drop placement (free form, no snap) (l123)
- [ ] Artifact visual (30% opacity box + centered icon) (l124)
- [ ] Rotation handle (top-right) (l125)
- [ ] Resize handle (bottom-right) (l126)
- [ ] Info handle (top-left) opening modal (l127)
- [ ] Modal: type, size, rotation, coordinates, remove (l128)
- [ ] Persist create/update/delete via artifacts API (l129)
- [ ] Integration into Step 3.3 (when user chooses not to upload plan). Note: hidden when Step 2 uses "egen adresse" (custom); require single plan PDF instead. (l130)

## Acceptance Criteria
- Fully interactive planner with persistence (l132)
