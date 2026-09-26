# Project Scope — Neighborhood Lending Library

## Summary

A PWA that lets small groups (families, apartment complexes, friend groups) list items they're willing to lend and coordinate borrowing through a shared calendar. The core architectural twist: an item is owned by a *person*, not a group, and the owner chooses which group(s) can see and borrow it — with one shared calendar preventing double-booking across all of them.

## v1 Scope (in for the demo)

These are the features required to hit the target demo path: **create a group → list an item → someone reserves it → a conflicting reservation attempt gets denied → the owner preempts an existing reservation → a reminder fires.**

- **Auth & accounts** — basic user signup/login
- **Groups** — create a group, join a group via invite/code, multi-group membership
- **Item catalog** — list an item (name, description, photo), attach visibility to one or more groups
- **Shared reservation calendar** — book an item for a date range
- **Overlap prevention** — enforced at the database level via `tstzrange` + GiST exclusion constraint, not just app logic
- **Reservation state machine** — requested → approved → picked up → returned / cancelled
- **Owner priority** — owner can preempt an existing reservation with notice
- **Notifications (stub → real)** — pickup reminders, overdue nudges, auto-expiring unclaimed reservations
- **Cross-group authorization** — a user in Group A can never see Group B's private data
- **Testing** — Playwright E2E for the core demo path; property-based tests proving no overlapping reservation can ever exist across randomized scenarios
- **PWA packaging** — installable, responsive, works reasonably offline for viewing (not necessarily offline reservations)

## Stretch / Cut for Later

These are explicitly **out of v1** so they don't quietly eat time from the core path above. Revisit only if the core demo is solid early.

- Real SMS notifications via Twilio (Web Push or an in-app notification stub is enough for v1)
- Rich photo handling (multiple photos per item, image editing/cropping)
- Advanced search/filtering of the item catalog
- Row-level security in Postgres (v1 can enforce authorization in the app layer; RLS is a hardening pass, not a launch requirement)
- Waitlists for a reserved item
- In-app messaging between owner and borrower
- Admin/moderation tooling for group owners

## Semester Timeline

| Week | Focus | Key Tasks | Milestone | Hours |
|---|---|---|---|---|
| 1 | Brainstorming | Idea generation, direction-finding | — | 3 (done) |
| 2 | Idea Proposal + setup | Stakeholder interviews (2–3 people); finalize idea scope; set up Next.js + Postgres repo, CI, deploy pipeline skeleton | Submit Idea Proposal | 11 |
| 3 | Requirements & design | Synthesize stakeholder feedback; sketch wireframes for group/item/reservation flows; design DB schema (users, groups, memberships, items, reservations) | — | 9 |
| 4 | Auth & groups | User accounts/auth; group creation & join flow; group-scoped membership model; basic access control | — | 9 |
| 5 | Item catalog | Item CRUD (name, photo, description); attach item visibility to one or more groups; group-scoped item listing views | Submit Initial Requirements Specification | 9 |
| 6 | Reservation engine, pt. 1 | Date-range picker UI; tstzrange schema design; GiST exclusion constraint so Postgres itself rejects overlapping bookings | — | 11 |
| 7 | Reservation engine, pt. 2 | Reservation state machine (requested → approved → picked up → returned/cancelled); concurrency test — simulate two simultaneous reservation attempts and confirm only one wins | — | 10 |
| 8 | Owner priority | Preemption logic (owner can reclaim, with notice policy); notification stub for affected borrower; begin prototype demo script | — | 9 |
| 9 | Prototype | Polish end-to-end demo path: create group → list item → reserve → conflict denial → owner preemption | Submit Project Prototype | 10 |
| 10 | Background jobs | Job queue setup; pickup reminders, overdue nudges, auto-expire unclaimed reservations; idempotency so jobs can't double-send | — | 9 |
| 11 | Multi-group hardening | Refine cross-group visibility rules; authorization audit (can a user in Group A ever see Group B's data?); consider row-level security | Submit Final Requirements Specification | 9 |
| 12 | Mobile/PWA polish | Installable PWA config; offline viewing of schedule; responsive layout pass; real notification delivery (push or SMS) | — | 9 |
| 13 | Testing | Property-based tests asserting "no two overlapping reservations ever exist" across randomized scenarios; Playwright E2E for core flows; bug triage | — | 10 |
| 14 | Wrap-up | Final bug fixes; deployment cleanup; demo rehearsal; reflection document | Project Demo + Reflection | 8 |

## Notes

- Anything not explicitly listed under v1 above is assumed out of scope unless a stakeholder interview in Week 3 surfaces a hard requirement — in which case, add it here with a note on what it displaces.
- The GiST exclusion constraint (Week 6) is the architectural core of the project; if time gets tight later in the semester, protect this over polish items like PWA offline support or SMS delivery.