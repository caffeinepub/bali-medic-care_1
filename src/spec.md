# Specification

## Summary
**Goal:** Expand the Team Management “Patient Details” card to display all available fields from the selected PatientSubmission, including questionnaire responses, with robust fallback for older submissions.

**Planned changes:**
- Update the /team “Patient Details” view to render all key PatientSubmission fields (IDs/status, personal info, demographics, timestamps, detailed info, scoring/summary, and optional fields like feedback code/notes/additional info) using structured fields when present.
- Add fallback logic to extract best-available patient details from `detailedInfo.context` when structured fields (especially `personalInfo`) are missing, without breaking the page.
- Render `responsesSectionA` and `responsesSectionB` in readable sections (e.g., table/definition list) showing scoreType (or “N/A”), answer text, answer score, and feedbackText when present, including an English empty state when no responses exist.
- Ensure all labels in the expanded Patient Details view are in English.

**User-visible outcome:** On /team, selecting a submission shows a comprehensive, English-labeled Patient Details panel with all available submission fields and clearly formatted Section A/B questionnaire responses, with graceful display for older/incomplete submissions.
