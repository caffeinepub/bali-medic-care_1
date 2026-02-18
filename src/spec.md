# Specification

## Summary
**Goal:** Fix patient registration form submissions so they reliably save in the backend, return a real server-assigned submission id, and ensure the medical team dashboard can retrieve and display the new records.

**Planned changes:**
- Backend: Update the public patient submission endpoint to succeed even when no default clinic config exists, and persist submissions with a unique non-zero backend-generated id that is returned to the client.
- Frontend: Use the backend-returned submission id in the submission flow (no assumptions like id=0), keep navigating to `/success` on success, and keep the existing English failure toast while logging detailed backend error/trap reasons to the browser console on failure.
- Dashboard regression check: Ensure the medical team dashboard data flow can fetch and list newly submitted patient records and that selecting a record navigates to `/team` with the correct non-zero `submissionId`.

**User-visible outcome:** Patients can submit the registration form without errors and be taken to the success page; if a submission fails, they still see the same English toast while developers can inspect detailed console errors. Medical team users can open the dashboard and see newly submitted patients listed and open their details using the correct submission id.
