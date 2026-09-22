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
- `src/app.js` — `libres` y `reservar` validan la franja antes de consultar o reservar; mensaje único de error.
- `test/app.test.js` — tests de la validación.
- Commit: `b31e271` — feat: validar el formato de la franja horaria.

## 2. Tiempo y coste: estimado vs real

- Tipo: backend
- Estimación de implementación (del plan): 1,5h
- Esfuerzo real: ~0,5h (aproximado) — no hay reloj propio del hilo distinto de la orquestación; se aproxima sumando la duración de los despachos (implementador 13 min + revisor de task 7 min + revisor final 8 min = 28 min), asumiendo que la orquestación del hilo no añade tiempo significativo por encima de esos despachos.
- Desviación: -1h (-67%)
- Causa de la desviación: la task se ejecutó íntegramente por subagentes (implementador + revisor); el 1,5h estimado asumía trabajo manual de un desarrollador, no despachos en paralelo/secuencial de alta capacidad.
- Modelo del hilo: Sonnet
- Tokens del hilo: no medido
- Tokens de subagentes: 473k en 3 despachos — implementador Sonnet high 214k / 13 min; revisor de task Sonnet medium 128k / 7 min; revisor final Sonnet medium 131k / 8 min.
- Coste de sujetos: 1,85 $ en 4 sujetos (`claude -p --model sonnet`) — prueba de mensajes de error con usuarios headless.
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- Ninguna.

### Decisiones tomadas sin el dev-lead

- Ninguna.

## 4. Verificación

### 4.1 Builds

- `node --test` — verde (6/6), según `review.md`.

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-22 · probó `node src/app.js libres 10-12` (mensaje de error) y `node src/app.js libres 10:00-12:00` (`Sur`).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node src/app.js libres 10-12` | Mensaje de error ✔ (verificado por el dev-lead) |
| 2 | `node src/app.js libres 24:00-24:30` | Mensaje de error ✔ (smoke del agente) |
| 3 | `node src/app.js reservar Norte 9:00-11:00` | Mensaje de error ✔ (smoke del agente) |
| 4 | `node src/app.js libres 10:00-12:00` | `Sur` ✔ (verificado por el dev-lead) |

### 4.3 Residuales / deuda generada

- Ninguna. Queda fuera de scope validar que el inicio sea anterior al fin (ya recogido así en la spec).

## 5. Aprendizajes

- `src/app.js` deja de ser el único fichero de código: el parseo de franjas vive en `src/slots.js`, reutilizable por la task 0008 → `architecture.md` (creado desde plantilla, no existía) y enlazado desde `tech-stack.md`.

## 6. Adendas

- _Ninguna._
