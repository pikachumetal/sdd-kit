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

- `package.json`: `engines.node` `>=22` (7e71b31).
- `.nvmrc`: contiene `22` (7e71b31).

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

_Ninguna_

## 4. Verificación

### 4.1 Builds

- `node --test`: 4/4 pasan, sobre 941b90b. No hay `operations.md` ni gate declarado; el cambio toca `package.json`, pero no hay tareas de build que correr sin filtro.
- Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 7e71b31. `HEAD` solo añadió documentación (`tasks.md`) desde entonces: sin re-revisión.

### 4.2 Smoke / tests

- Validación por el agente: 2026-11-12 · la spec declara `Validación: agente`; smoke con ejecución real (abajo) y `node --test` 4/4. Nadie más ha probado nada.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `package.json` declara `engines.node` `>=22` | ejecución real: `node -e "require('./package.json').engines.node"` → `>=22` | OK |
| `.nvmrc` contiene `22` | ejecución real: `cat .nvmrc` → `22` | OK |

### 4.3 Residuales / deuda generada

- Ninguno.

## 5. Aprendizajes

- Ninguno que vaya a un doc vivo.

Retro: sin señales

## 6. Adendas

- _Ninguna_
