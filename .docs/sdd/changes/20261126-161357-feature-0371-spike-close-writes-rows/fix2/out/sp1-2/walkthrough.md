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

Validación en campo: 2026-11-22 · O1 medido en `medidas/o1-libres.txt`; O2 y O3 sin medir, como dice `research.md`

## 1. Cambios realizados

- Spike sin cambios de código en `src/`: la app no deja sembrar reservas, así que se midió una copia literal de `freeRooms` con `medidas/medir-libres.mjs` (commit 2e5b292, Task 1).
- `research.md` con las filas de O1, O2 y O3, el aguante y la recomendación (commit 4e123f6, Task 2).
- Resultado: O1 no cumple tal como se definió (2000 comparaciones en las 10 repeticiones, contra < 1.000); O2 no medido (no se corrió `--memoria`); O3 no medido con una persona (lo simulé yo: 4 s, no cuenta). Recomendación: no seguir con las reservas en memoria.
- Capacidades: ninguna, porque investigación.

## 3. Desviaciones del plan

- La Task 2 pedía `medidas/o2-memoria.txt`, de `node medidas/medir-libres.mjs --memoria`; no existe, porque la medida de memoria no se corrió. La fila O2 de `research.md` dice `no medido`.

### Decisiones tomadas sin el dev-lead

- _Ninguna_

## 4. Verificación

### 4.1 Builds

- Sin build ni suite: el spike no toca código de `src/`. Gate: no aplica.

### 4.2 Smoke / tests

Validación en campo: 2026-11-22 · O1 medido en `medidas/o1-libres.txt`; O2 y O3 sin medir, como dice `research.md`

| THEN (objetivo) | Evidencia | Resultado |
| --- | --- | --- |
| O1 — `libres` con 1.000 reservas en < 1.000 comparaciones | ejecución real (`medidas/o1-libres.txt`, verificado por el agente) | no cumple: 2000 en las 10 repeticiones |
| O2 — memoria < 50 MB con 1.000 reservas | no probado | no medido |
| O3 — un recepcionista encuentra la sala libre en < 10 s | no probado | no medido con una persona (simulación del agente: 4 s, no vale) |

### 4.3 Residuales / deuda generada

- O2 y O3 quedan sin medir; la decisión de la 0014 se apoya solo en O1.
- Dos piezas salen a filas del roadmap: 0031 (índice de reservas por sala en `libres`) y 0032 (caché de `libres` por día).

## 5. Aprendizajes

- _Ninguno_ que cambie un doc vivo: el spike no cambia comportamiento, convención ni estructura.

Retro: sin señales

## 6. Adendas

_Ninguna_
