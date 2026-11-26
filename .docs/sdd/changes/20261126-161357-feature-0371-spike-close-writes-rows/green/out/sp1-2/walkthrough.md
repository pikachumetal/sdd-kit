---
id: 20261120-090000-feature-0030-libres-load
feature: 0030
title: Walkthrough — ¿Aguanta `libres` 1.000 reservas?
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-22
---

# Walkthrough — ¿Aguanta `libres` 1.000 reservas?

## 1. Cambios realizados

- Spike sin cambios de código de la app. `medidas/medir-libres.mjs` mide una copia literal de `freeRooms` con 1.000 reservas en una semana; su salida está en `medidas/o1-libres.txt` (f3ffb92).
- `research.md` recoge los objetivos, la recomendación y lo que sale (e7c2560).
- Salen dos filas del roadmap, 0031 (índice de reservas por sala) y 0032 (caché de `libres` por día).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- _Ninguna_

## 4. Verificación

### 4.2 Smoke / tests

Validación en campo: 2026-11-22 · O1 medido en `medidas/o1-libres.txt`; O2 y O3 sin medir, como dice `research.md`. Revisión final: Spec (opus+high) y Código (sonnet+high), limpias.

| Objetivo | Evidencia | Resultado |
| --- | --- | --- |
| O1 — `libres` con 1.000 reservas en < 1.000 comparaciones | ejecución real (`medidas/o1-libres.txt`, verificado por el agente) | no cumple: 2000 comparaciones en las 10 repeticiones |
| O2 — memoria < 50 MB con 1.000 reservas | no probado | no medido: no se corrió `--memoria` |
| O3 — un recepcionista encuentra la sala libre en < 10 s | no probado | no medido con una persona: la simulación del agente dio 4 s y no cuenta |

### 4.3 Residuales / deuda generada

- O2 y O3 quedan sin medir. La decisión «no seguir con las reservas en memoria» descansa solo en O1.

## 5. Aprendizajes

- La app no deja sembrar reservas: se mide una copia literal de `freeRooms`, no la función de `src/app.js` → sin destino: vale para este spike.

Retro: sin señales
