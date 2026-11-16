# Release notes and the smoke line

## Release notes

Only with `release.hasRecipient: true`, at `.docs/sdd/releases/vX.Y.Z/release-notes.md`, tracing `release-notes-template.md` of `sdd-templates`, distilled from the sealed changelog into an **outcome for the user**, not an engineering deliverable. **Forbidden**: feature ids, commit scopes, jargon.

## The smoke line

**Smoke**: what runs on the integrated branch before the close to check that what's delivered works (the suite plus real use: start, install, invoke). **Finding**: a defect of the delivered behavior that this smoke detects, fixed in the release or not; what already came out in a feature's walkthrough doesn't count.

The number of the line is never made up. The line reads the «small release, smoke per stretch» pattern without opening anything: in the team's retros, a big release with a single smoke gave 9 findings; three short ones, 3 · 0 · 0.
