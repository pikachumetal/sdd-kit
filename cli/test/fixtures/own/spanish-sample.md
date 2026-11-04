# Muestra del castellano en las skills

Cada línea bajo `## es` es prosa en castellano; cada una bajo `## en`, una línea en inglés que no debe dar rojo. Las líneas salen del kit del 2026-11-04 (feature 0304), y las cortas, los títulos y las celdas están a propósito.

## es

# Perfiles de control y gates
## Perfiles
## Precedencia
## Restricciones de código
## Revisor final
## Verificación
## Paso 4 — Aprendizajes
# Aprendizajes a docs vivos — detalle
# Migración a v2.3.1 — sin cambios en el proyecto
## Nombrado de carpetas de spec
## Módulos por predicado observable (no preguntes: observa el proyecto)
- **`pair`** — para en todos los gates de la tabla.
- **`delegate`** *(default)* — para en la spec, los desvíos y la validación; sin gate en el plan.
1. `profile:` en el frontmatter de `spec.md` — la feature. Omitido, hereda.
2. `control.profile` en `.docs/sdd/sdd-kit.local.json` — la persona. Fuera de git: ver la sección siguiente.
- `.docs/sdd/sdd-kit.json` declara `"version": "2.3.1"` y conserva el resto de sus claves.
- Antes del commit de la migración, `git status --short` solo lista `.docs/sdd/sdd-kit.json`.
- `<slug>`: kebab-case corto descriptivo.
`<yyyyMMdd-HHmmss>-(feature|patch|proposal)-<id>-<slug>`, todo en UTC:
| Si existe… | Entonces… |
| `.docs/sdd/estimation.md` | Bloque "Estimación y esfuerzo" obligatorio en `plan.md`, y tiempo real obligatorio en `walkthrough.md` |
**Escribe**: `sdd-kit.json` → `version`, `channel`, `updated`.
Cuánto para el agente lo elige el usuario con un perfil.

## en

5. **Prepare a release** — «prepara la release N», «qué entra en la siguiente entrega».
7. **Triage** — «tria el ticket», «triaje de la deuda», or the rows of «Por triar» in `debt.md`.
Against `sdd-propose` the verb decides: doing it now («añade», «hazme», «arréglalo») is `sdd-propose`; leaving it noted («apunta», «organízalo», «planifica», «no lo arranques») is this skill.
| Preparing a release | `## Release <N>` with «Ficheros que toca» |
| Now and Next | «Próximo» |
Write everything the user reads in their language. Adapted from `writing-for-agents` by Matt Pocock and `writing-skills` of superpowers (MIT, see `NOTICE`).
Open with `Ahora: <qué haces>` and a counter like «van 7 de 15».
A counter («van 7 de 15») or a step number alone doesn't tell the user where they are (`tests/fewer-stops-red.md`, s1).
The ticket says what failed «(ticket de la task 0057)».
# sdd-propose
## Overview
## Red flags — STOP and go back to the gate
## Is it really a patch?
| Rationalization | Reality |
| --- | --- |
- **spike** — an investigation that must leave its evidence: a table of measurements, a measured threshold.
- Spanish literal in a link: see [la guía de uso](../usage-guide.md) for the flow.
The release goes to `develop` with `sdd merge --push`, and the dev-lead cuts it.
Forked from `dispatching-parallel-agents` of superpowers (MIT, see `NOTICE`); the text is the source's.
Each test uses a Wondel table, a MADR heading and an OpenSpec delta.
| 3.0.0 | 2.x |
- `ids.mode`: `sequence` or `tracker`; with `tracker`, the id is `0000` when there is no ticket.
## Checklist (one todo per step)
