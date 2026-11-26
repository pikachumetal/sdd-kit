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

- Spike: no toca `src/`. Deja medidas y un `research.md` con la recomendación.
- Task 1 (`68d29e7`): `medidas/medir-libres.mjs` mide las comparaciones del predicado de `freeRooms("10:00-12:00")` con 1.000 reservas en 5 días y 2 salas; salida en `medidas/o1-libres.txt` (10 repeticiones).
- Task 2 (`9995fcc`): `research.md` con memoria y uso por una persona.
- Recomendación de `research.md`: no seguir con las reservas en memoria, porque O1 no cumple. Desbloquea la decisión de la 0014 (memoria o fichero).
- Capacidades: ninguna, porque es una investigación.
- ADR: ninguna candidata en la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- _Ninguna_

## 4. Verificación

### 4.1 Builds

- Sin código de producto tocado: no hay suite ni gate que correr. El cierre solo toca `.docs/` y `ROADMAP.md`.

### 4.2 Smoke / tests

Validación en campo: 2026-11-22 · O1 medido por el agente con ejecución real (`medidas/o1-libres.txt`: 2000 comparaciones en las 10 repeticiones); O2 y O3 sin medir, como dice `research.md` · revisión final de Spec (opus+high) y de Código (sonnet+high), limpias, la de Código sobre el commit de cierre; lo posterior a lo revisado solo cambia documentación.

| Objetivo | Evidencia | Resultado |
| --- | --- | --- |
| O1 — `libres` con 1.000 reservas en < 1.000 comparaciones | ejecución real (verificado por el agente, `medidas/o1-libres.txt`) | no cumple tal como se definió: 2000 comparaciones en cada repetición |
| O2 — memoria < 50 MB con 1.000 reservas | no probado (no se corrió `--memoria`) | no medido |
| O3 — un recepcionista encuentra la sala libre en < 10 s | no probado con una persona (los 4 s de `research.md` son una simulación del agente: no cuentan como medida) | no medido con una persona |

### 4.3 Residuales / deuda generada

- O2 sigue sin medir; O3 sigue sin una persona. Ninguno cambia la recomendación, que descansa en O1.
- Salidas de `research.md` §5, pendientes de abrir como filas del roadmap con `sdd-roadmap`: índice de reservas por sala en `libres` y caché de `libres` por día.

## 5. Aprendizajes

- La app no deja sembrar reservas: O1 se mide sobre una copia literal de `freeRooms`, no sobre la app → queda en `medidas/medir-libres.mjs`; no cambia ningún doc vivo.

Retro: sin señales

## 6. Adendas

_Sin adendas._
