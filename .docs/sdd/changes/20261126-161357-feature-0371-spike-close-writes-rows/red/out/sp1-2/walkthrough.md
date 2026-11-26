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

- Spike sin código de producto: `medidas/medir-libres.mjs` mide una copia literal de `freeRooms` de `src/app.js` y `medidas/o1-libres.txt` guarda la salida (576f1dd).
- `research.md` con las medidas, la recomendación y lo que sale (8bc6c6f).
- Capacidades: ninguna, porque investigación.

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- _Ninguna_

## 4. Verificación

### 4.1 Builds

- Sin build ni suite: el spike no cambia `src/`.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-22 · O1 medido en `medidas/o1-libres.txt`; O2 y O3 sin medir, como dice `research.md`. Revisión final: Spec (opus+high) y Código (sonnet+high) limpias, sobre 6f348a5; lo posterior es solo documentación.

| Objetivo | Evidencia | Resultado |
| --- | --- | --- |
| O1 — `libres` con 1.000 reservas en < 1.000 comparaciones | ejecución real (verificado por el agente, 10 repeticiones) | No cumple tal como se definió: 2000 comparaciones en todas |
| O2 — memoria < 50 MB con 1.000 reservas | no probado | No medido: no se corrió `--memoria` |
| O3 — recepcionista encuentra la sala libre en < 10 s | no probado | No medido con una persona (la simulación del agente, 4 s, no cuenta) |

### 4.3 Residuales / deuda generada

- O2 y O3 siguen sin medir; la decisión de la 0014 se apoya solo en O1.
- Las dos mejoras de `libres` pasan al roadmap: 0031 (índice por sala) y 0032 (caché por día).

## 5. Aprendizajes

- La app no deja sembrar reservas, así que se mide una copia literal de la función: hay que repetir la medida si `freeRooms` cambia → `research.md`, sin doc vivo que lo recoja.

Retro: sin señales

## 6. Adendas

_Ninguna._
