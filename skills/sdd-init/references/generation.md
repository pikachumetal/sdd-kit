# Generating the anchor documents — detail

## Order and gate

One document per turn, each presented before it is written and recorded with `sdd init --approved <path>` after its «sí»:

1. `PRODUCT.md` — who uses it and with which roles, what problem it solves (with code: what the system does TODAY), what it is and what it leaves out, and the glossary in `## Terminology`.
2. `.docs/sdd/steering/constitution.md` — what is non-negotiable; with code, the observed conventions AS PROPOSALS plus the golden rules below; «Reglas de producto» with the five rules by name, each answered, `pendiente` or `no aplica` (a rule that differs by capability, listed by capability inside its entry); the reference project in «Convenciones».
3. `.docs/sdd/steering/operations.md` — `## Comandos`, `## Testing` with the template's fields, `## Frontend` only with an interface, `## Entornos` only with worktrees whose environment needs more than installing dependencies (with code: the environment scripts found are a contract to harvest).
4. `.docs/sdd/steering/architecture.md` — the real structure (with code) or the agreed one; the stack and its open decisions, each also as a Next row.
5. `ROADMAP.md` — modules as rows (each citing its `sources/` section if it comes from a functional brief), open decisions in Next.
6. `.docs/sdd/steering/debt.md` — with code only: the inventory's debt and blocked dependencies in «Por triar».
7. `.docs/sdd/steering/estimation.md` — traced with its calibration empty.
8. `CHANGELOG.md` — only if the interview said yes: `## [Unreleased]` and no entries.
9. `CLAUDE.md` — pointers plus 3-5 critical rules; with a previous one, the diff against it.

Each document traces its template of `sdd-templates`, listed in [structure.md](structure.md).

## Golden rules for a project with code

They go to the constitution: backward compatibility by default; respect the existing pattern even if it isn't ideal; zero opportunistic refactoring; massive migrations only with a written justification.
