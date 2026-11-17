---
id: 20261012-100000-feature-0020-node-engine
feature: 0020
title: Walkthrough — Fijar la versión de Node
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-12
---

# Walkthrough — Fijar la versión de Node

## 1. Cambios realizados

- `package.json`: `engines.node` `>=22` (commit 34c74ff).
- `.nvmrc`: contiene `22` (commit 34c74ff).
- El código de la app no se toca, como dice el Scope.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- _Ninguna_

## 4. Verificación

### 4.1 Builds

- Sin `operations.md` ni suites declaradas, y `package.json` sin `scripts`: no hay suite ni gate que correr. Gate: ninguno declarado.
- Revisión final: Spec y Código limpias sobre 34c74ff; desde entonces `HEAD` solo añade la línea de revisión en `tasks.md` (docs), sin re-revisión.

### 4.2 Smoke / tests

- Validación por el agente: 2026-11-12 · smoke ejecutado por el agente sobre 7e067e8 (el cierre solo añade docs), según `Validación: agente` de la spec; nadie lo ha probado además del agente.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `package.json` declara `engines.node` `>=22` | ejecución real: `node -e "require('./package.json').engines.node"` → `>=22` | ok |
| `.nvmrc` contiene `22` | ejecución real: `cat .nvmrc` → `22` | ok |

### 4.3 Residuales / deuda generada

- Ninguno.

## 5. Aprendizajes

- Ninguno que cambie un doc vivo: `architecture.md` ya dice Node 22 y no hay capacidad afectada (spec: «Capacidades: Ninguna»).

Retro: sin señales

## 6. Adendas

- _Ninguna_
