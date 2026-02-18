# Specification

## Summary
**Goal:** Make patient registration fully public (no login) while keeping medical team areas protected behind Internet Identity with medical-team-specific messaging.

**Planned changes:**
- Ensure patient-facing routes (`/` and `/success`) never trigger authentication prompts, redirects, or access-denied states.
- Update patient-facing navigation/header so it does not imply patients must log in (hide or relabel any login UI to clearly apply only to medical team members on patient pages).
- Confirm patient form submission flows work end-to-end for anonymous (not authenticated) users.
- Keep medical team routes (`/dashboard`, `/team`, `/exam-success`) protected by Internet Identity login.
- Update protected-route access screens and call-to-action text to clearly state login is for medical team members only.

**User-visible outcome:** Patients can register and see success screens without any login prompts, while medical team members must log in via Internet Identity to access dashboard/team/exam-success areas with clear medical-team-only messaging.
