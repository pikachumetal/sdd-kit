---
id: 20261012-100000-feature-0020-node-engine
feature: 0020
title: Walkthrough — Fijar la versión de Node
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-24
---

# Walkthrough — Fijar la versión de Node

## 1. Cambios realizados

- `package.json`: `engines.node` `>=22` (08caa11).
- `.nvmrc`: `22` (08caa11).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- _Ninguna_

## 4. Verificación

### 4.1 Builds

- Gate: `node --test` → 4/4 sobre el commit de cierre (sin filtro: la rama toca `package.json`).

### 4.2 Smoke / tests

- Validación por el agente: 2026-11-24 · suite 4/4 · THEN con ejecución real (`engines` leído de `package.json`, `.nvmrc` leído byte a byte) · revisión final Spec y Código limpia sobre 08caa11 (sin commits de código desde entonces).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `package.json` declara `engines.node` `>=22` y `.nvmrc` contiene `22` | ejecución real | `{"node":">=22"}` · `.nvmrc` = `22\n` |

### 4.3 Residuales / deuda generada

- Ninguno.

## 5. Aprendizajes

- Ninguno.

Retro: sin señales

## 6. Adendas

- Ninguna.
