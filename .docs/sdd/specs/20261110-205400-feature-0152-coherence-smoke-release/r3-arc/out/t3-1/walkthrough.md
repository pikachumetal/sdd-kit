---
id: 20261012-100000-feature-0020-node-engine
feature: 0020
title: Walkthrough — Fijar la versión de Node
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-11
---

# Walkthrough — Fijar la versión de Node

## 1. Cambios realizados

- `package.json`: `engines.node` declara `>=22` (Task 1, `0068755`).
- `.nvmrc`: contiene `22` (Task 2, `0068755`).
- El código de la app no se toca, como dice el scope.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- _Ninguna_

## 4. Verificación

### 4.1 Builds

- `node --test` entero: 4 tests, 4 pasan, 0 fallan, sobre el commit de cierre (el cierre solo añade documentación a `0068755`).
- Gate: `node --test` → 4/4 · 104 ms · configuración: la del proyecto · sobre el commit de cierre
- Revisión final: Spec (opus, effort high) y Código (sonnet, effort high), limpias sobre `0068755`; re-revisión del único commit posterior (solo `tasks.md`, 8 líneas) limpia.

### 4.2 Smoke / tests

Validación por el agente: 2026-11-11 · la spec declara `Validación: agente`; verificado por el agente con ejecución real: `engines` leído de `package.json` = `{"node":">=22"}` y `.nvmrc` = `22`; suite 4/4. Nadie más lo ha probado.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `package.json` declara `engines.node` `>=22` | ejecución real | `{"node":">=22"}` |
| `.nvmrc` contiene `22` | ejecución real | `"22\n"` |

### 4.3 Residuales / deuda generada

- Ninguno.

## 5. Aprendizajes

- Sin aprendizajes nuevos: Node 22 ya figura en `architecture.md`, y el proyecto no tiene `operations.md` al que subir la versión.

Retro: sin señales

## 6. Adendas

- _Ninguna_
