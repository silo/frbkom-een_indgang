---
title: Projektoversigt / Project Overview
slug: project-overview
version: 1.0.0
status: stable
lastUpdated: 2025-11-10
audience: [developers, stakeholders, ai]
owners: [platform-team]
tags: [overview, events, nuxt]
summary: High-level purpose, user types, and core features of the Frederiksberg event application.
i18n:
  defaultLocale: da-DK
  keysNamespace: docs.project.overview
---

# Project Overview

This is a **Nuxt 4 application** for public event planning in **Frederiksberg Municipality, Denmark**. The application enables citizens and businesses to apply for public event permits through a comprehensive multi-step form with visual planning capabilities using drag-and-drop artifacts on location maps.

## Core Features

- **Event Creation & Management**: Users can create, edit, and submit event applications through a dynamic multi-step flow
- **Visual Planning**: Drag-and-drop functionality for placing artifacts (stages, booths, facilities) on event location maps using a custom grid planner
- **Role-Based Access**: Regular users (citizens/businesses) can create and manage events; Admins (caseworkers) can review, edit, and approve/decline events
- **Danish Authentication**: Secure MitID (OIDC) authentication via Nets eID Broker for both users and admins
- **Interactive Maps**: Custom map grid planner with static image backgrounds for visual event planning
- **Draft Management**: Drafts saved on explicit user action ("Save as Draft" or "Next"); includes version history for event applications
- **Admin Workflow**: Comprehensive admin dashboard with event review, editing, status management, and audit logging

## User Types

### 1. Regular Users (Citizens and Business Owners)

- Login via MitID (OIDC authentication)
- Auto-created in database if first-time login
- Can create, edit, and submit event applications
- Can save drafts at any step via explicit actions ("Save as Draft" or "Next"); no background auto-save
- View their own events (submitted, ongoing/draft, accepted, declined)
- Business users share events under same CVR (company identification number)

### 2. Admins (Caseworkers)

- Login via AD (OIDC authentication) - uses /admin route
- Manually activated as admin in database (developer sets checkbox)
- Review and process event applications
- Send email notifications to applicants
- Upload PDF documents
