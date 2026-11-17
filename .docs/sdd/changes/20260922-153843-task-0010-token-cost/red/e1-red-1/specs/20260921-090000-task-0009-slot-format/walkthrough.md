---
id: 20260921-090000-task-0009-slot-format
task: 0009
title: Walkthrough — Validar el formato de la franja horaria
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-22
---

# Walkthrough — Validar el formato de la franja horaria

## 1. Cambios realizados

- `src/slots.js` (nuevo) — `isValidSlot`, regex `HH:MM-HH:MM` con horas 00–23 y minutos 00–59.
- `src/app.js` — `libres` y `reservar` validan la franja con `isValidSlot` antes de consultar o reservar; mensaje de error único.
- `test/app.test.js` — tests de rechazo para `libres` y `reservar` y para la hora 24.
- Commit: `8a737fb` — feat: validar el formato de la franja horaria.

## 2. Tiempo: estimado vs real

- Tipo: backend
- Estimación de implementación (del plan): 1,5h
- Esfuerzo real: 0,47h (28 min: 13 min implementador + 7 min revisor de task + 8 min revisor final de rama)
- Desviación: -1,03h (-69%)
- Causa de la desviación: alcance muy acotado y sin ambigüedad (un fichero nuevo, una regex, un mensaje) — la estimación de 1,5h reservaba margen para incertidumbre que no apareció.
- Review de spec: sin review (así consta en `spec.md`)

## 3. Desviaciones del plan

- _Ninguna._

### Decisiones tomadas sin el dev-lead

- _Ninguna._

## 4. Verificación

### 4.1 Builds

- `node --test` → 6/6 pass (incluye las 2 pruebas nuevas de esta task).

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-22 · probó `node src/app.js libres 10-12` (mensaje de error) y `node src/app.js libres 10:00-12:00` (`Sur`); confirma que funciona.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node src/app.js libres 10-12` | mensaje de error ✔ (verificado por el agente en smoke del plan y por el dev-lead) |
| 2 | `node src/app.js libres 24:00-24:30` | mensaje de error ✔ (verificado por el agente) |
| 3 | `node src/app.js reservar Norte 9:00-11:00` | mensaje de error ✔ (verificado por el agente) |
| 4 | `node src/app.js libres 10:00-12:00` | `Sur` ✔ (verificado por el agente y por el dev-lead) |

### 4.3 Residuales / deuda generada

- El delta de comportamiento de esta task ("Una franja mal formada se rechaza") está escrito bajo el encabezado `### Capacidad: room-booking` en `spec.md`, pero esa spec no declaró la creación de la capacidad en «Decisiones que he tomado yo» (regla 2 de `capability-template.md`: solo la spec que la declara ahí la crea, nunca `sdd-end-task` por su cuenta). No existe `.docs/sdd/capabilities/`, así que no hay dónde fusionar el delta sin inventar esa declaración. No se crea la capacidad en este cierre; queda como deuda técnica en el roadmap para que la próxima spec que toque `room-booking` la declare explícitamente y arrastre este delta.

## 5. Aprendizajes

- `app.js` deja de ser el único fichero de código: el parseo de franjas vive en `src/slots.js`, `app.js` solo enruta comandos. Un comando nuevo que reciba una franja debe importar `isValidSlot`, no repetir la regex. → `architecture.md` (creado desde plantilla en este cierre, no existía).

## 6. Adendas

- _Ninguna._
