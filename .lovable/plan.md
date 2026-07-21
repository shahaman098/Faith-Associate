# Mosque MBA Admissions CRM — V1 Plan (final)

All four blocking issues fixed: Closed removed, deterministic duplicates, qualification token rules, payment-mark restricted. Plus the two cleanups (payment statuses, audit log).

## Status model

**pipeline_stage**: New Enquiry → Contacted → Awaiting Qualification → Qualification Submitted → Awaiting Interview Booking → Interview Booked → Interview Completed → Awaiting Payment → Enrolled → Dormant
_(Closed removed. Rejection lives in decision_status.)_

**decision_status**: Pending, Approved, On Hold, Rejected, Need More Info

**payment_status**: Not Sent, Sent, Paid, Overdue
_(Reminder Sent removed; tracked via `reminder_count` + `last_reminder_sent_at`.)_

## Permissions matrix

| Action                                                             | Admin | Reviewer | Staff |
| ------------------------------------------------------------------ | ----- | -------- | ----- |
| Manage users, roles, courses, templates, automations               | ✓     | —        | —     |
| View all contacts/applications                                     | ✓     | ✓        | ✓     |
| Create/edit contacts, applications, notes, tasks, meetings         | ✓     | ✓        | ✓     |
| Send templated emails, move pipeline_stage, mark booking confirmed | ✓     | ✓        | ✓     |
| **Set decision_status**                                            | ✓     | ✓        | —     |
| **Mark payment Paid**                                              | ✓     | ✓        | —     |
| Delete records, view audit log                                     | ✓     | —        | —     |

Roles in `user_roles` with `has_role()` security-definer; RLS enforces matrix.

## Lead intake (hardened)

- Hosted form `/enquire` and public API `/api/enquiries`
- Zod validation, rate limit, **honeypot field**, origin allow-list, optional shared-secret header

**Deterministic duplicate handling**: email is the primary contact match key.

- Same email + **open application for the same course** in a non-terminal stage → do **not** create a new application; set `is_possible_duplicate = true`, log `repeat_enquiry` activity, require staff review
- Same email + **no open application for that course** → create new application under the existing contact
- Terminal stages = Enrolled, Dormant

## Qualification flow

Form at `/qualify/{token}` (magic link in brochure email). Staff can also manually mark complete.

**Token rules**: long random unguessable string; expires after 30 days; reusable until submission; invalidated immediately on successful submission; expired/invalid tokens show a support-contact page.

## Booking

Staff send booking URL (Calendly or any), then manually mark booking confirmed in CRM. Stored: `booking_url_sent_at`, `booking_confirmed_at`, `scheduled_for`.

## Notes

Stored as `activities` rows with `type = 'note'` + `body`. "Add note" composer on each contact/application detail page.

## Automations (with caps)

| #   | Trigger                                    | Action                                                                                                                                | Cap                                |
| --- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| 1   | Enquiry submitted                          | Create contact + application, notify Sir Shaukat / Anika / Shazia, send acknowledgement + brochure + qualify link, create review task | —                                  |
| 2   | No qualification after 2 days              | Reminder + notify Sir Shaukat                                                                                                         | **3** then → Dormant + manual task |
| 3   | Qualification submitted                    | Auto-advance stage                                                                                                                    | —                                  |
| 4   | Booking link sent, no booking after 2 days | Reminder                                                                                                                              | **3** then → Dormant + manual task |
| 5   | Staff marks booking confirmed              | → Interview Booked                                                                                                                    | —                                  |
| 6   | decision_status = Approved                 | → Awaiting Payment, send payment email                                                                                                | —                                  |
| 7   | decision_status = On Hold                  | Log reason, follow-up task                                                                                                            | —                                  |
| 8   | decision_status = Rejected                 | Optional rejection email                                                                                                              | —                                  |
| 9   | decision_status = Need More Info           | Send request email                                                                                                                    | —                                  |
| 10  | Payment unpaid 2 days after Sent           | Reminder + notify Sir Shaukat                                                                                                         | **3** then → Overdue + manual task |
| 11  | Reviewer/Admin marks Paid                  | → Enrolled, send welcome email                                                                                                        | —                                  |

Every run logged to `automation_runs`.

## Notifications

- **In-app**: `notifications` table + bell icon with unread count, polled on load and every 60s
- **Email**: only critical events (intake, reminder fired, decision set, payment received)

## Audit log

`audit_logs` table — immutable, admin-only. Records: deletes, role changes, template edits, automation toggles, manual stage overrides. Distinct from `activities` (user-facing timeline) and `automation_runs` (system execution log).

## Report metric formulas

| Report                        | Formula                                                                             |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| Enquiry volume                | count(applications) by created_at bucket                                            |
| Source breakdown              | count(applications) grouped by contacts.source                                      |
| Qualification completion rate | applications with qualification_submitted_at ÷ applications where qualify link sent |
| Interview booking rate        | applications with booking_confirmed_at ÷ applications where booking link sent       |
| Approval rate                 | decision_status = Approved ÷ applications with stage ≥ Interview Completed          |
| Payment conversion rate       | payment_status = Paid ÷ decision_status = Approved                                  |
| Enrolment rate                | stage = Enrolled ÷ total applications                                               |
| No-response drop-off          | applications moved to Dormant ÷ total applications                                  |
| Avg time enquiry→enrolment    | mean(enrolled_at − created_at) for enrolled                                         |
| Per-staff follow-up activity  | count(activities) by created_by within range                                        |

## Data model (key fields)

- **applications**: `pipeline_stage`, `decision_status`, `payment_status`, `qualification_token`, `qualification_token_expires_at`, `qualification_submitted_at`, `booking_url_sent_at`, `booking_confirmed_at`, `scheduled_for`, `decision_reason`, `is_possible_duplicate`, `reminder_count`, `last_reminder_sent_at`
- **activities**: type ∈ {note, repeat_enquiry, email_sent, reminder_sent, stage_changed, decision_set, payment_marked, automation_run, ...}
- **notifications**: user_id, type, title, body, link, read_at
- **automation_runs**: automation_key, application_id, outcome, payload, created_at
- **audit_logs**: actor_id, entity, entity_id, action, before, after, created_at

## Pages

Login · Dashboard · Contacts (list+detail) · Applications (list+detail) · Pipeline board · Tasks · Meetings · Payments · Email templates · Automations (toggles + run log) · Reports · Admin (users, roles, courses, audit log) · Public `/enquire` · Public `/qualify/{token}`

## Build order

1. Cloud + auth + roles (matrix) + courses
2. Schema + RLS + contacts/applications CRUD + notes-as-activities + audit_logs
3. `/enquire` + `/api/enquiries` (honeypot, Zod, rate limit, deterministic dedupe) + intake automation
4. Pipeline board, application detail (3 status dimensions), manual stage moves, timeline
5. `/qualify/{token}` (token rules) + manual-complete fallback
6. Tasks, meetings (manual confirm), payments (Reviewer/Admin only mark Paid)
7. Email domain + templates + send pipeline + in-app notifications
8. Scheduled reminders with caps + Dormant/Overdue fallbacks
9. Dashboard + reports (locked formulas)
10. Admin (users, roles, template editor, automation toggles, audit log viewer)

## Out of scope for V1

Scholarship branch, document uploads, WhatsApp, Stripe / payment gateway, Calendly webhook, LMS, advanced segmentation, drag-and-drop automation builder, full inbox sync, real-time notifications, CAPTCHA.
