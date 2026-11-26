---
id: 20261120-090000-feature-0030-libres-load
feature: 0030
title: Walkthrough — ¿Aguanta `libres` 1.000 reservas?
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-26
---

# Walkthrough — ¿Aguanta `libres` 1.000 reservas?

## 1. Cambios realizados

- Spike: no toca `src/`. Deja `medidas/medir-libres.mjs` (copia literal de `freeRooms` con un contador en su predicado, porque la app no deja sembrar reservas) y `medidas/o1-libres.txt` — Task 1, `38ce2db`.
- `research.md` con la pregunta, los tres objetivos, la recomendación y lo que sale — Task 2, `c7593b8`.
- Resultado: O1 no cumple (2000 comparaciones con 1.000 reservas, en las 10 repeticiones); O2 y O3 sin medir. Recomendación: no seguir con las reservas en memoria.
- Capacidades: ninguna, porque investigación. ADR: ninguna candidata en la spec.
- Salen dos filas del roadmap, `0031` (índice de reservas por sala) y `0032` (caché por día), con `parent: 0030`.

## 3. Desviaciones del plan

- Task 2 estaba planeada con `medidas/o2-memoria.txt` (`node medidas/medir-libres.mjs --memoria`) como evidencia de O2, y ese fichero no existe: O2 no se midió. La tarea consta `done` porque `research.md` se escribió, no porque O2 tenga medida.
- O3 no lo midió una persona: `research.md` dice «lo simulé yo: 4 s». Cuenta como `no medido con una persona`, como prevé la spec.

### Decisiones tomadas sin el dev-lead

- _Ninguna_

## 4. Verificación

### 4.1 Builds

- No hay código de producto que construir ni suite que correr: el spike solo añade `medidas/` y documentos. `node medidas/medir-libres.mjs` produjo `medidas/o1-libres.txt` (10 repeticiones, 2000 comparaciones cada una).
- Revisión final: Spec (Opus, effort high) limpia · Código (Sonnet, effort high) limpia, sobre `8690514`; `HEAD` solo avanzó con `40c3884`, de documentación, y se revisó en el hilo.

### 4.2 Smoke / tests

Validación en campo: 2026-11-22 · O1 medido en `medidas/o1-libres.txt`; O2 y O3 sin medir, como dice `research.md`

| Objetivo | Evidencia | Resultado |
| --- | --- | --- |
| O1 — `libres` con 1.000 reservas en < 1.000 comparaciones | ejecución real (verificado por el agente) · `medidas/o1-libres.txt` | no cumple: 2000 comparaciones en las 10 repeticiones |
| O2 — memoria < 50 MB con 1.000 reservas | no probado | no medido: no se corrió `--memoria` |
| O3 — un recepcionista encuentra la sala libre en < 10 s | no probado con una persona | no medido con una persona; simulado por el agente: 4 s, sin valor como medida |

### 4.3 Residuales / deuda generada

- O2 y O3 sin medir: fila en «Por triar» de `debt.md`.
- Las dos mejoras de `research.md` §5 pasan a las filas `0031` y `0032`.

## 5. Aprendizajes

- Con el predicado actual, `libres` recorre todas las reservas por cada sala (salas × reservas = 2000 comparaciones con 1.000 reservas), y las reservas viven en memoria dentro de `src/app.js` → `steering/architecture.md` y filas `0031`, `0032`.
- La app no deja sembrar reservas, así que cualquier medida de carga necesita una copia de la función o una vía de siembra → fila `0031` (ahí se decide si se añade).

Retro: error que cazaría un chequeo → ticket del kit: la Task 2 del spike quedó `done` sin el `medidas/o2-memoria.txt` que su plan declara como evidencia, y ningún chequeo del cierre lo cruza con el plan

## 6. Adendas

_Ninguna._
