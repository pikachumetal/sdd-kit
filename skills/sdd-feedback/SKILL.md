---
name: sdd-feedback
description: Use when closing a feature or a patch — sdd-end-feature and sdd-end-patch offer it — or when the user asks for the ticket, the report or the improvement feedback of the kit about the session («el ticket del kit», «el feedback de mejora»).
---

# sdd-feedback

## Overview

The ticket is what this session learned about the kit, written for the agent who will maintain it. It is lost when the context is cleared, so it is written in the same session. **The ticket is written in Spanish**, with the template's section names as they are; what you say to the user, in their language.

## Checklist (create a todo per step)

1. **Versions** — read `.docs/sdd/sdd-kit.json` (kit version and `ids.mode`) and the installed superpowers version. A version from the user's notes or from memory doesn't replace that reading.
2. **Walk the session** — kit skills and steps that ran, gates, detours, decisions nothing backed. Not the project's code.
3. **Template** — trace `kit-feedback-template.md` from the `sdd-templates` skill. Clean close —no finding above a minor and the clock within the estimate's ceiling, or no estimate— → the template's **minimal ticket**: header and three lines, plus the minors. A ruling, a deviation from the plan, a step worked around or a decision no step covered is already a finding.
4. **Save** — in `.docs/sdd/kit-feedback/<yyyyMMdd-HHmmss>-(feature|patch)-<id>-<slug>.md`, UTC timestamp, id and slug as in the spec folders. One ticket per feature or patch: only this one's own is extended; if the session wrote another's, its own is born and that one is left alone. If the folder doesn't exist, create it and say **once** that it can be git-ignored; do **not** edit `.gitignore`.
5. **Privacy pass** — before saving, reread the whole ticket looking for proper names and data of the project's domain.
6. **Lint** — run the project's docs lint on the ticket (the one in `tech-stack.md`, its docs gate or its pre-commit) and fix it until it passes, before the close commits it. With no docs lint, say so in one line.

## Rules

- **Privacy**: never client, project, product or people names, nor code or business rules. If a finding isn't understood without a datum from the domain, replace it with a generic descriptor («una regla de cálculo de precios», «el interlocutor del cliente»); the finding is never omitted for privacy.
- **Every finding carries its acceptance criterion** — a GIVEN/WHEN/THEN scenario or the RED that fails today and would pass with the proposal. Without it it isn't a finding, it's a complaint.
- **Every proposal says whether it is verified** (`sí — <cómo>` or `sin verificar`). A cited execution failure carries the exact command, the shell and the error line.
- **Every version, figure or quote in "Qué pasó" comes from a file or a command named in "Fuente"; one you remember and haven't checked doesn't go in: check it or drop it** (`tests/sdd-feedback-0150-red.md`, fb1). It holds for the header too. "Fuente" names kit metadata or files (`.docs/sdd/sdd-kit.json`, a plugin's version, a skill) or a command; a datum from a project file goes with a generic descriptor, like the rest of the ticket.
- **A cost cause is backed** with the spec, the walkthrough or a commit. A user's phrase, even the dev-lead's, doesn't back it: figure and cause go «sin respaldo».
- **A mistake of yours** that a rule, a step or a template of the kit could have avoided is a finding with that path, also if the rule existed and you didn't apply it: it is a rule that didn't hold. A shell or harness failure that a kit rule covers is also a finding; only one that no kit rule would cover doesn't go in the ticket.
- **Minors**: under ~10 min and once in the session → a line in «Menores». If it repeated or cost more, it's a finding. Count the cost you saw in the session, even if its cause goes «sin respaldo».
- **Own initiative goes in its own section**, not diluted in another finding: it is a candidate for a new kit rule.
- **The finding's path is the kit's** (`skills/<skill>/SKILL.md` step N, a template, a reference), never a project file. If it can't be located, say so.
