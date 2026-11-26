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

- Spike: no toca `src/`. Deja `medidas/medir-libres.mjs` (copia literal de `freeRooms` con 1.000 reservas) y `medidas/o1-libres.txt` (`ac86b5f`), y `research.md` con la recomendación (`4b7dbc0`).
- Sin «ADR candidata» en la spec.

## 3. Desviaciones del plan

- Task 2 no produjo `medidas/o2-memoria.txt` (el plan lo pedía): `--memoria` no se corrió, así que O2 queda `no medido`. O3 lo simuló el agente (4 s), no una persona: `no medido con una persona`, como admite la spec.

### Decisiones tomadas sin el dev-lead

- _Ninguna_

## 4. Verificación

### 4.1 Builds

- Sin código de `src/` ni tests tocados: la rama solo cambia `.docs/` y `ROADMAP.md`, así que no corre suite ni gate.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-22 · O1 medido en `medidas/o1-libres.txt`; O2 y O3 sin medir, como dice `research.md` · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre el commit de cierre (juntada en el cierre); después solo hubo documentación.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| O1 — `libres` con 1.000 reservas en < 1.000 comparaciones | ejecución real (verificado por el agente): 10 repeticiones en `medidas/o1-libres.txt` | no cumple tal como se definió: 2000 comparaciones en cada una |
| O2 — memoria < 50 MB con 1.000 reservas | no probado | no medido |
| O3 — un recepcionista encuentra la sala libre en < 10 s | no probado con una persona; simulado por el agente (4 s) | no medido con una persona |

### 4.3 Residuales / deuda generada

- O2 y O3 sin medir: la recomendación se apoya solo en O1. Los dos pasan a la decisión de la 0014 con ese hueco declarado en `research.md`.

## 5. Aprendizajes

- La app no deja sembrar reservas: medir `libres` exige una copia literal de la función; no hay documento vivo al que volcarlo → sin destino (queda en `medidas/medir-libres.mjs`).

Retro: documento o skill desmentido → corregido en su documento (`tasks.md`: Task 2 `done` sin la evidencia de O2 que pedía el plan)

## 6. Adendas

_Ninguna_
