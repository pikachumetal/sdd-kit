---
id: 20261012-100000-feature-0020-node-engine
feature: 0020
title: Walkthrough — Fijar la versión de Node
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-30
---

# Walkthrough — Fijar la versión de Node

## 1. Cambios realizados

- `package.json`: `engines.node` a `>=22`; `.nvmrc` con `22` (commit 6fa4827, tasks 1 y 2).

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- _Ninguna_

## 4. Verificación

### 4.1 Builds

- Gate: `node --test` → suite: corrió 4/4 · sobre el commit de cierre (el cambio de código es 6fa4827; después solo documentación)
- Revisión final: Spec (opus+high) y Código (sonnet+high) limpias sobre 6fa4827; Arquitectura no (plan). El único commit posterior es documentación (`tasks.md`).

### 4.2 Smoke / tests

- Validación por el agente: 2026-10-30 · `engines.node` y `.nvmrc` leídos en ejecución real (`>=22` y `22`), `node --test` 4/4 verde. Nadie lo ha probado a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `package.json` declara `engines.node` ≥ 22 | ejecución real (`node -e` lee el JSON → `>=22`) | OK |
| `.nvmrc` fija Node 22 | ejecución real (contenido `22`) | OK |
| El código de la app no cambia | suite (`node --test` 4/4); el diff de 6fa4827 solo toca `package.json` y `.nvmrc` | OK |

### 4.3 Residuales / deuda generada

- Ninguno.

## 5. Aprendizajes

- Ninguno que vuelva a los docs vivos (`tech-stack.md` ya dice «Node 22»).

## 6. Adendas

- Sin adendas.
