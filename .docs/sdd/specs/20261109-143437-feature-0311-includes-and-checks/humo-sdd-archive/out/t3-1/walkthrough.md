---
id: 20261012-100000-feature-0020-node-engine
feature: 0020
title: Walkthrough — Fijar la versión de Node
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-09
---

# Walkthrough — Fijar la versión de Node

## 1. Cambios realizados

- `package.json`: `engines.node` fijado a `>=22` (commit d7ed5ac).
- `.nvmrc`: nuevo, con `22` (commit d7ed5ac).
- Sin cambios en el código de la app.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- _Ninguna_ (`sdd ledger rulings`: «Sin rulings»).

## 4. Verificación

### 4.1 Builds

- `node --test` entero: 4/4 en verde, 0 fallos, sobre el commit de cierre. Lo ejecuté yo.
- Gate: `node --test` → 4/4 · sobre el commit de cierre. Sin gate de herramienta declarado; `package.json` es de «Sin filtro» y la suite corre entera.
- Revisión final: Spec (opus+high) y Código (sonnet+high) limpias sobre d7ed5ac; Arquitectura no (plan). Re-revisión del único commit posterior (solo `tasks.md`, 8 líneas), opus+high, limpia.

### 4.2 Smoke / tests

- Validación por el agente: 2026-11-09 · `Validación: agente` en la spec; suite 4/4 · smoke 1/1 THEN con ejecución real (`engines.node=>=22`, `.nvmrc=22`) · revisión final y re-revisión limpias. Nada reportado por el usuario.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `package.json` declara `engines.node` `>=22` y `.nvmrc` contiene `22` | ejecución real: un script de Node lee los dos ficheros e imprime `engines.node=>=22 .nvmrc=22` (exit 0); `.nvmrc` es `22\n` | verificado por el agente |

### 4.3 Residuales / deuda generada

- Ninguna.

## 5. Aprendizajes

- Node 22 queda fijado en `engines` y `.nvmrc`, no solo declarado en prosa → `tech-stack.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
