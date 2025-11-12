---
title: Adminflow / Admin Event Processing Flow
slug: admin-event-flow
version: 1.0.0
status: draft
lastUpdated: 2025-11-10
audience: [developers, admins, ai]
owners: [platform-team]
tags: [flow, admin, processing, moderation]
summary: Administrative caseworker workflow for reviewing, assigning departments, updating status and handling documents.
i18n:
  defaultLocale: da-DK
  keysNamespace: docs.flows.adminEvent
---

# FLOW for admin users managing event applications

1. Admin login via AD (OIDC authentication) on /admin route
2. After login admin is redirected to the admin dashboard with list of "All Events" ( sorted by newest submitted on top )
3. Admin can click on any event to view details and edit the event application
4. Admin can assign the event to any department ( Byliv og drift /  Klima og miljø / Byggeri og arkitektur ) , Byliv og drift is default and cannot be removed
5. Admin for each department can review and change the status for their part of the event application
6. Admin can upload 1 or more PDF approval documents when approving the event application
7. Admin must write a note when rejecting the event application; user is notified by email

Notes
- Departments cannot reject in v1. Rejection is a global decision only and cannot be reversed.
- Department statuses contribute to the global review status. See docs/02-architecture/event-status-and-validation.md.
