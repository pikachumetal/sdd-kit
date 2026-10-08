---
id: 20261008-151724-feature-0144-docs-structure
title: Tasks — Documentos de la 3.0.0: estructura nueva, plantillas y rutas de la CLI
spec: ./spec.md
plan: ./plan.md
created: 2026-10-08
---

# Tasks — Documentos de la 3.0.0 (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0144-docs-and-migration`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Rutas de la CLI para la estructura 3.0.0 y la 2.x | done | `a8e9d61` | |
| 2 | Sustantivo `decision`: `check` e `index` | done | `815153f` | Las 11 ADR del repo pasan `decision check` sin cambios |
| 3 | Plantillas de la 3.0.0 e índice de `sdd-templates`, con su humo | done | `4523e14` | Humo 2/2, 0,41 $; topes de `sdd-templates` y del kit suspendidos (enmienda) |
| 4 | Constitution y ADR 0012 | done | `750d9cb` | |

## Verificación por task

- [x] Task 1 — `tsc --noEmit` y Vitest de `layout`, `roadmap`, `estimation` e `ids`
- [x] Task 2 — `tsc --noEmit`, Vitest de `decisions`, `cli` y `docs-claims`, y `sdd decision check` sobre el repo
- [x] Task 3 — Pester de `AnchorTemplates`, `WordBudget` y `FrontendVerification`; Vitest de `decisions` y `docs-claims`; humo h1 y h2
- [x] Task 4 — Pester de `WordBudget` y `sdd decision check` sobre el repo

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

Revisión final: sdd-kit:effort-high + opus, With fixes (0 Critical, 3 Important, 8 Minor), sobre 750d9cb
Pasada de fix: juntada en el cierre, 3 hallazgos RED→GREEN

## Rulings

- Task 1: Ruling: layout.test.ts — dos aserciones con regex de separador mal escapado ([\/] no casaba con \ en Windows) pasan a ruta exacta con join() — es un fallo del propio test, la aserción queda más estricta — coste si mal: ninguno.
- Task 1: Ruling: test/estimation/fixtures.test.ts «falla con mensaje si no hay specs» cambia el mensaje esperado al de la spec («dice qué carpetas buscó»: changes/ ni specs/ bajo .docs/sdd ni docs/sdd) — lo pide el MODIFIED de estimation — coste si mal: un mensaje.
- Task 1: Ruling: el resumen de ayuda de `roadmap publish` y su error de ruta nombran los documentos de la raíz — consecuencia del MODIFIED de release-flow — coste si mal: texto.
- Task 3: Ruling: la fixture cli/test/fixtures/decisions/adr-template.md de la Task 2 se borra y check.test.ts lee la plantilla real de sdd-templates — lo decía el plan — coste si mal: ninguno.
- Task 3: Ruling: Get-Section de AnchorTemplates.Tests.ps1 usaba "$(.*?)" dentro de comillas dobles (subexpresión de PowerShell); arreglado antes de escribir las plantillas, copia RED actualizada — fallo del propio test — coste si mal: ninguno.
- Task 3: Ruling: desvío aprobado por el dev-lead («Puedes quitar los topes hasta que acabemos las 3? o minimo hasta qu elimpiemos?»): suspendidos en WordBudget.Tests.ps1 los topes de sdd-templates (SKILL.md y total) y del kit entero; el agente acotó la suspensión a esos tres, la 0157 los restaura (fila del roadmap) — enmienda en la spec — coste si mal: crecimiento sin vigilar de sdd-templates hasta la 0157.
- Task 3: Ruling: la evidencia del humo va en <spec>/humo/ (como la 0143) y no en ./green/ como decía el plan — es humo, no GREEN — coste si mal: una ruta.
- Task 3: Ruling: el README pasa de «Las 21 plantillas canónicas» a 24 — Skills.Tests.ps1 lo compara con el número de ficheros — coste si mal: ninguno.
- Task cierre: Ruling: «Reglas de la capacidad» de estimation completadas con las cuatro entradas que faltaban (de requisitos vivos), porque capability check exige las cinco — enmienda en la spec sin comportamiento nuevo — coste si mal: texto de reglas.
- Final: Ruling: con los dos roadmaps, el aviso de `roadmap check` sale por stdout con el resto de líneas, no por stderr como decía la decisión 3 — es como `roadmap check` da todos sus avisos y el literal del ADDED de roadmap se cumple — coste si mal: un consumidor que separe stderr no lo ve.
- Final: Ruling: declinados por el revisor (log 2.x tras migrar, addedCommits con la misma carpeta en changes/ y specs/, --files con ./ o absoluto, comillas en status/date, comentarios YAML y ## en bloques de código, forma de ROADMAP.md, rutas 2.x en skills, suspensión de topes) — todos fuera del alcance por la spec (0150, 0157, 0152) o por sus reglas de sintaxis; ninguno pasa a hallazgo — coste si mal: un caso raro de ADR mal leído.
- Final: minor (deferred): layout.test `projectRoot(join(root,'.',...))` no prueba una ruta relativa al cwd
- Final: minor (deferred): la tabla de verbos de sdd-templates sigue diciendo «ficheros de .docs/sdd/» en roadmap publish y `roadmap.md` en roadmap check
- Final: minor (deferred): architecture.md no nombra layout.ts (no cabía en su tope; lo cubre la ADR 0012)
- Final: minor (deferred): adr-template no dice que `./` delante tampoco se admite en rutas
- Final: minor (deferred): decision index escribe `.docs/sdd/decisions/` a mano; con --path docs/sdd sale una ruta falsa
- Final: minor (deferred): check.test.ts lleva el BOM como carácter invisible en vez de \uFEFF
- Final: minor (deferred): WordBudget.Tests.ps1 deja código inalcanzable tras el return de la suspensión (se va con la 0157)
