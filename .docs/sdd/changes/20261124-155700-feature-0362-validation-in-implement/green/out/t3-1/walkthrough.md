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

- `package.json`: `engines.node` `>=22` (016f644).
- `.nvmrc`: `22` (016f644).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- _Ninguna_

## 4. Verificación

### 4.1 Builds

- Gate: `node --test` → 4/4 pasan (sin filtro: la rama toca `package.json`) · sobre 97d924d (016f644 es el último commit de código; después solo hay docs).

### 4.2 Smoke / tests

- Validación por el agente: 2026-11-24 · `node --test` 4/4 · smoke 1/1 THEN con ejecución real (`engines.node` leído de `package.json` = `>=22`; `.nvmrc` = `22`, sin salto de línea) · revisión final Spec y Código limpias, sobre 016f644 (sin re-revisión: no hubo pasada de fix).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `package.json` declara `engines.node` `>=22` y `.nvmrc` contiene `22` | ejecución real | `engines.node= >=22`; `.nvmrc` = `22` |

### 4.3 Residuales / deuda generada

- Ninguno.

## 5. Aprendizajes

- Ninguno.

Retro: sin señales

## 6. Adendas

- Ninguna.
