---
id: 20260923-100000-feature-0012-franja
feature: 0012
title: Walkthrough — Validar el formato de la franja
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-29
---

# Walkthrough — Validar el formato de la franja

## 1. Cambios realizados

- `src/slots.js`: constante `SLOT = /^\d{2}-\d{2}$/`; `reserve(room, slot)` y `free(slot)` lanzan «Franja no válida: usa HH-HH, p. ej. 10-12» si la franja no casa.
- Task 1 (`0d7919f`): validación al reservar, con `tests/slot-format.test.js`.
- Task 2 (`04d2f47`): validación al consultar libres, con `tests/free-format.test.js`.
- Cierre (un commit, desde `04d2f47`): mensaje literal de la franja en `free` (hallazgo Important de la revisión final), nota de formato en `slots.js` y registro de la revisión en `tasks.md`.

## 2. Tiempo y coste: estimado vs real

Sin `.docs/sdd/estimation.md` en el proyecto: no hay estimación ni log que rellenar. Medición de la sesión (`Measure-SessionTokens.ps1`):

- Tokens del hilo: 329.045 — claude-sonnet-5-5 329.045 (solo cuenta el cierre en esta sesión; lo anterior no consta en los transcripts leídos)
- Tokens de subagentes: no aplica (las revisiones no constan como subagentes en esta sesión)
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)

## 3. Desviaciones del plan

- _Ninguna_ en el código: se ejecutó en Native, las dos tasks como estaban en el plan.

### Decisiones tomadas sin el dev-lead

- No crear `capabilities/booking.md` ni tocar la spec aprobada — la spec pone su delta bajo la capacidad `booking`, pero no tiene bloque «## Capacidades» ni la declara en «Decisiones que he tomado yo», y el slug de una capacidad nueva lo aprueba el dev-lead; el cierre no la crea por su cuenta — coste si está mal: el comportamiento nuevo queda solo en la spec hasta que se cree la capacidad (fila en la deuda técnica del roadmap).

## 4. Verificación

### 4.1 Builds

- `node --test` → 3 tests, 3 pass, 0 fail · 0,2 s (suite completa; la del proyecto, `constitution.md` Art. II).

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-29 · «He probado `salas reservar Norte 1012` y `salas libres 1012`: los dos dan el error de la franja. Vale, funciona.»

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Reservar con franja que no casa con `HH-HH` falla con «Franja no válida: usa HH-HH, p. ej. 10-12» | suite (`slot-format.test.js`) · ejecución real de `reserve('Norte','1012')` con node: lanza ese mensaje · reportado por el dev-lead con `salas reservar Norte 1012` | OK |
| Consultar libres con franja que no casa falla con el mismo mensaje | suite (`free-format.test.js`) · ejecución real de `free('1012')`: mismo mensaje · reportado por el dev-lead con `salas libres 1012` | OK |
| (Contraste) franja válida `10-12` sigue funcionando | ejecución real: `reserve('Norte','10-12')` → `{room, slot}`; `free('10-12')` → `[]` | OK |

Verificado por mí: la suite y las cuatro llamadas a las funciones con node. Reportado por el dev-lead: las dos órdenes de la CLI (`salas …`); el repo no trae un ejecutable `salas` que yo haya lanzado.

Revisión: final de rama con `sdd-kit:effort-high` + opus, Needs fixes (1 Important) → arreglado en la pasada de fix → re-revisión `922be6b..82cf298` limpia. El commit posterior (una línea en `tasks.md`) lo revisé en el hilo.

### 4.3 Residuales / deuda generada

- La capacidad `booking` no existe en `capabilities/`: fila en la deuda técnica del roadmap.
- El regex solo valida el formato: `99-99` pasa. La spec pide «casa con `HH-HH`», así que no es un fallo; queda dicho por si el dev-lead quiere validar el rango de horas.
- El comentario «Franja HH-HH de dos horas.» de `slots.js` no lo garantiza el regex (`10-13` pasa): impreciso, no funcional.

## 5. Aprendizajes

- Convenciones, arquitectura y versiones: nada nuevo → `constitution.md` sin cambios (no existen `architecture.md` ni `tech-stack.md`; ningún aprendizaje estructural que volcar).
- Comportamiento observable (validación de la franja) → `capabilities/booking.md` **pendiente**: ver «Decisiones tomadas sin el dev-lead» y la deuda del roadmap.
- Skills: el proyecto no tiene `.claude/skills/` (mirado); esta feature no revela un patrón reutilizable.

## 6. Adendas

_Ninguna._
