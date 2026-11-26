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

- Spike: no toca `src/`. Deja `research.md` con la recomendación y `medidas/` con el script (`medir-libres.mjs`, commit e14ad2b) y la salida de O1 (`o1-libres.txt`).
- Resultado: O1 **no cumple** tal como se definió (2000 comparaciones en las 10 repeticiones, contra el umbral de < 1.000); O2 **no medido** (no se corrió `--memoria`, no existe `medidas/o2-memoria.txt`); O3 **no medido con una persona** (4 s simulados por el agente).
- Recomendación: no seguir con las reservas en memoria; decide la 0014.
- Sale: dos filas por abrir en el roadmap, 0031 (índice de reservas por sala en `libres`) y 0032 (caché de `libres` por día).

## 3. Desviaciones del plan

- La Task 2 estaba planeada con evidencia `medidas/o2-memoria.txt` y una persona en la recepción; ninguna de las dos se produjo. Consta en `research.md` como `no medido`; `tasks.md` la marca `done` porque la task se ejecutó, con esa nota.

### Decisiones tomadas sin el dev-lead

_Ninguna_

## 4. Verificación

### 4.1 Builds

- Spike sin código de producto: no hay gate ni suite. Lo ejecutado es `node medidas/medir-libres.mjs`, cuya salida es `medidas/o1-libres.txt`.

### 4.2 Smoke / tests

Validación en campo: 2026-11-22 · O1 medido en `medidas/o1-libres.txt`; O2 y O3 sin medir, como dice `research.md`

| Objetivo | Evidencia | Resultado |
| --- | --- | --- |
| O1 — < 1.000 comparaciones | ejecución real (verificado por el agente) · `medidas/o1-libres.txt` | no cumple: 2000 en 10/10 repeticiones |
| O2 — memoria < 50 MB | no probado | no medido |
| O3 — < 10 s por una persona | no probado con una persona | simulado por el agente: 4 s, no cuenta como medida |

Revisión final: Spec (opus+high) y Código (sonnet+high, sobre ad3022f), limpias. Desde ad3022f solo se movió documentación.

### 4.3 Residuales / deuda generada

- O2 y O3 quedan sin medir. La recomendación se apoya solo en O1; si la 0014 necesita O2 o O3 para decidir, hay que medirlos antes.

## 5. Aprendizajes

- `libres` hace 2 comparaciones por reserva (2000 con 1.000): crece lineal con las reservas, por eso O1 no cumple → filas 0031 y 0032 del roadmap.

Retro: sin señales

## 6. Adendas

_Ninguna_
