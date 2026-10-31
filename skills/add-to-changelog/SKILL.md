---
name: add-to-changelog
description: Use when an entry goes into the project's changelog — invoked by the cut of sdd-end-release with `CHANGELOG.md` at the root, by sdd-archive with `.docs/sdd/changelog.md` (2.x), or when the user asks to bring the changelog up to date.
---

# add-to-changelog

## Overview

The changelog is the project's **technical** record (Keep a Changelog 1.1.0), *backward-looking*. The roadmap is *forward-looking*: touching one doesn't replace the other. Talk to the user in their language. Entries follow the changelog's language; in an empty one, the user's.

## Entry format (contract)

Each entry is **one line**, exactly:

```markdown
- **<id>** — <what changed, one sentence>. → [ref](.docs/sdd/changes/<folder>/)
```

- `<id>`: the ticket or module (`Ticket 217`, `M4`).
- The sentence is for a technical reader; cause, evidence and decisions live in the linked folder.
- `→ [ref](…)` points to the change's folder, relative to the changelog (`specs/` for older ones, and from `.docs/sdd/changelog.md` without `.docs/sdd/`). A change without a folder goes **without a link**: never make up a path.

## Where it goes

Under the active section: `## [Unreleased]` by default. If the changelog uses `## [Bn] — en curso`, the unit is the **bundle**: find that section, don't invent SemVer. In its category, in Keep a Changelog order (create only those with entries):

| Change | Category |
| --- | --- |
| New functionality; a patch's closed request that adds what the user can do | Added |
| Behavior, dependency or version that changes; a patch's presentation adjustment or closed request that changes it | Changed |
| Marked to disappear | Deprecated |
| Removed | Removed |
| A failure fixed | Fixed |
| Vulnerability | Security |

## Common mistakes

| Mistake | Correct |
| --- | --- |
| Several lines with cause and detail | One sentence + link |
| A made-up link | No link |
| Cutting a version (`[0.2.0]`) when adding the entry | Cutting is the user's decision, run by `sdd-end-release` |
| Recording deferred debt here | It goes to the debt |
