---
id: 20261012-100000-feature-0020-node-engine
feature: 0020
title: Walkthrough — Fijar la versión de Node
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-05
---

# Walkthrough — Fijar la versión de Node

## 1. Cambios realizados

- `package.json`: `engines.node` `>=22` (Task 1, b66784c).
- `.nvmrc`: `22` (Task 2, b66784c).
- Sin cambios de código de la app.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- _Ninguna_

## 4. Verificación

### 4.1 Builds

- `node --test` → 4/4 en verde, sobre el commit de cierre (el cierre solo añade documentación a lo revisado).
- Gate: `node --test` → suite unitaria: corrió 4/4 · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación por el agente: 2026-11-05 · `Validación: agente` en la spec; suite 4/4 · smoke 1/1 THEN con ejecución real · revisión final Spec y Código limpia sobre b66784c, re-revisión del único commit posterior (solo `tasks.md`) limpia. Nada reportado por el dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `package.json` declara `engines.node` `>=22` y `.nvmrc` contiene `22` | ejecución real | `node -e "require('./package.json').engines.node"` → `>=22`; `cat -A .nvmrc` → `22$` |

### 4.3 Residuales / deuda generada

- Ninguno.

## 5. Aprendizajes

- Node 22 ya constaba en `tech-stack.md`; no hay aprendizaje nuevo que volcar.

Retro: sin señales

## 6. Adendas

- _Ninguna_
