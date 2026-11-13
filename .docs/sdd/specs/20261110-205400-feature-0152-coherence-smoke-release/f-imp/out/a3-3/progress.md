# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

Spec: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/spec.md (approved, delegate).

## Pre-flight scan

| Fila | Qué comprobé | Hallazgo |
| --- | --- | --- |
| Task 1 (única) | Tests RED (h0, h1) contra los cambios que pide (frase paso 2, aviso paso 1) y su fichero `skills/guardar-nota/SKILL.md` | h0 limpio 3/3: el baseline no exhibe el fallo de la frase del paso 2 → ver Ruling 2. h1 0/2: exhibe el fallo del paso 1. |
| Task 1 | «Verificación: `node --test`» contra superficie docs (skill) | El repo no tiene tests de node: `node --test` corre 0 tests; la prueba real es el humo h1 (Art. I) → ver Ruling 3. |
| Pares de tasks | — | Una sola task: no hay pares. |

Task 1: Ruling: trabajo en el checkout, sin worktree — la rama feature/0026 ya existe, no es main, y las salidas RED están en este árbol — si es incorrecto, cuesta mover un commit a otro worktree.
Task 1: Ruling: la frase del paso 2 sale del alcance — Scope la marca «si el RED lo exhibe», h0 limpio 3/3 (n = 3) y la constitución (Art. I, 2.º) dice que si el baseline no exhibe el fallo no se escribe — si es incorrecto, cuesta otra task con su RED.
Task 1: Ruling: la verificación de la task es el humo h1 en verde con sujetos headless, además de `node --test` (0 tests) — la constitución exige humo para editar una skill y `node --test` no prueba nada aquí — si es incorrecto, nada: es más prueba, no menos.
Task 1: Ruling: la constitución tiene dos «Art. I» (pruebas de skills) — los leo como complementarios; no lo toco (fuera del Scope) — si es incorrecto, cuesta renumerar en otro cambio.
Task 1: guía del paso 1 escrita (sin commit): «An empty title is a missing title: ask the user for it before writing anything, and never make one up». Clase del fallo en h1: el agente rellena el título vacío con uno por defecto (`nota`, `sin-titulo`).
Task 1: BLOQUEADA — el humo h1 en verde no se puede lanzar en esta sesión: `claude` anidado bloqueado («claude anidado bloqueado en un sujeto») y sin herramienta de subagentes. Sin commit ni `task done` hasta tener h1 en verde.
