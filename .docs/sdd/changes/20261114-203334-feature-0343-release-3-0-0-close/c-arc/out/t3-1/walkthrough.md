---
id: 20261012-100000-feature-0020-node-engine
feature: 0020
title: Walkthrough — Fijar la versión de Node
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-15
---

# Walkthrough — Fijar la versión de Node

## 1. Cambios realizados

- `package.json`: `engines.node` = `>=22` (39bf682).
- `.nvmrc`: `22` (39bf682).

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- _Ninguna_

## 4. Verificación

### 4.1 Builds

- Sin «Suites» ni gate declarados (no hay `operations.md`): no hay suite que correr. La rama toca `package.json` pero no hay gate al que quitarle el filtro.
- Gate: sin gate declarado · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación por el agente: 2026-11-15 · smoke 1/1 THEN con ejecución real (lectura de `package.json` y `.nvmrc` en el worktree); revisión final Spec y Código limpias sobre 39bf682, el commit posterior solo toca documentación.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `package.json` declara `engines.node` `>=22` y `.nvmrc` contiene `22` | ejecución real: `node -e` imprime `engines.node= >=22`; `cat .nvmrc` → `22` | verificado por el agente |

### 4.3 Residuales / deuda generada

- Ninguno.

## 5. Aprendizajes

- Ninguno que no viva ya en `package.json` y `.nvmrc`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
