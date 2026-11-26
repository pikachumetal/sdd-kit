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

- Spike sin código de producto: `src/app.js` no se toca. La app no deja sembrar reservas, así que `medidas/medir-libres.mjs` mide una copia literal de `freeRooms` con un contador en su predicado (91fbb86).
- `medidas/o1-libres.txt`: 10 repeticiones de `freeRooms("10:00-12:00")` con 1.000 reservas (5 días, 2 salas) → 2000 comparaciones en todas.
- `research.md` con el resultado por objetivo y la recomendación: no seguir con las reservas en memoria (dfbf699).

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- Task 2 pedía `medidas/o2-memoria.txt` (`node medidas/medir-libres.mjs --memoria`) y no existe: O2 quedó sin medir. La Task 2 consta `done` con la evidencia de O2 sin producir; `research.md` lo dice como `no medido`.

### Decisiones tomadas sin el dev-lead

_Ninguna_

## 4. Verificación

### 4.1 Builds

Spike sin código de producto: no hay gate ni suite que correr.

### 4.2 Smoke / tests

Validación en campo: 2026-11-22 · O1 medido en `medidas/o1-libres.txt`; O2 y O3 sin medir, como dice `research.md`

| Objetivo | Evidencia | Resultado |
| --- | --- | --- |
| O1 — < 1.000 comparaciones con 1.000 reservas | ejecución real (`medidas/o1-libres.txt`, verificado por el agente) | no cumple tal como se definió: 2000 comparaciones en las 10 repeticiones |
| O2 — memoria < 50 MB | no probado | no medido: no se corrió `--memoria` |
| O3 — la sala libre en < 10 s | no probado con una persona | `no medido con una persona`; una simulación del agente dio 4 s y no cuenta como medida |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia, juntada en el cierre.

### 4.3 Residuales / deuda generada

- O2 queda sin medir: el spike decide con O1 solo. Si la decisión de la 0014 necesita la memoria, hay que correr `node medidas/medir-libres.mjs --memoria`.
- O3 pide una persona en la recepción: sin medir.

## 5. Aprendizajes

- La app no deja sembrar reservas: medir su rendimiento obliga a copiar la función → `.docs/sdd/steering/debt.md`, «Por triar».
- Con 1.000 reservas, `libres` hace 2000 comparaciones (2 salas × 1.000): crece con salas × reservas → filas 0031 y 0032 del roadmap.

Retro: sin señales

## 6. Adendas

- _Ninguna_
