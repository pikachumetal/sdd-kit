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

- `src/slots.js` (nuevo): `isValidSlot`, regex `HH:MM-HH:MM` con horas 00–23 y minutos 00–59.
- `src/app.js`: `libres` y `reservar` validan la franja antes de consultar o reservar; mensaje único de error.
- `test/app.test.js`: casos de franja mal formada en `libres`, en `reservar` y la hora 24.
- Commit: `f73d50c` — feat: validar el formato de la franja horaria.

## 2. Tiempo y coste: estimado vs real

- Tipo: backend
- Estimación de implementación (del plan): 1,5h
- Esfuerzo real: 0,5h (aproximado — suma de los tiempos de los despachos, sin reloj de hilo separado)
- Desviación: -1h (-67%)
- Causa de la desviación (>30%): validación de un solo formato con una regex y un fichero nuevo pequeño; sin casos límite adicionales al smoke previsto en el plan.
- Modelo del hilo: Sonnet
- Tokens del hilo: no medido
- Tokens de subagentes: 473k en 3 despachos — implementador Sonnet high 214k / 13 min; revisor de task Sonnet medium 128k / 7 min; revisor final Sonnet medium 131k / 8 min
- Coste de sujetos: 1,85 $ en 4 sujetos Sonnet — mensajes de error comprobados con la CLI 1,85 $
- Review de spec: sin review — señales: ninguna

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- _Ninguna_

## 4. Verificación

### 4.1 Builds

- `node --test` → 6/6 verde (verificado por el agente, 2026-09-22).

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-22 · probó `node src/app.js libres 10-12` (mensaje de error) y `node src/app.js libres 10:00-12:00` (`Sur`).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node src/app.js libres 10-12` | Mensaje de error — validado por el dev-lead |
| 2 | `node src/app.js libres 10:00-12:00` | `Sur` — validado por el dev-lead |
| 3 | `node src/app.js libres 24:00-24:30` | Mensaje de error — smoke del plan |
| 4 | `node src/app.js reservar Norte 9:00-11:00` | Mensaje de error — smoke del plan |
| 5 | `node --test` | 6/6 — verificado por el agente |

### 4.3 Residuales / deuda generada

- El delta de esta spec apunta a una capacidad `room-booking` que no está declarada en "Decisiones que he tomado yo — valida estas": no se crea `capabilities/room-booking.md` sin esa declaración (regla anti-proliferación de `capability-template.md`). Queda como fila de deuda en el roadmap.

## 5. Aprendizajes

- `src/slots.js` nace como módulo propio para el parseo de franjas; `app.js` pasa a enrutar solo. Comandos futuros que reciban una franja deben importar `isValidSlot` en vez de repetir la regex → `architecture.md` (documento creado desde la plantilla en este cierre, no existía).

## 6. Adendas

