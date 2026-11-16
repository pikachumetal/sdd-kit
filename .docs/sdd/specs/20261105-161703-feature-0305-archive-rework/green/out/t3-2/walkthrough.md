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

- `package.json`: `engines.node` = `>=22` (Task 1, `c4948ba`).
- `.nvmrc`: contiene `22` (Task 2, `c4948ba`).
- Sin cambios en `src/` ni en `test/`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- _Ninguna_

## 4. Verificación

### 4.1 Builds

- `node --test test/` → 4/4 pasan, 0 fallos (Node v26.10.0 local), sobre `f205c39`.
- Revisión final: Spec (opus+high) limpia · Código (sonnet+high) limpia · Arquitectura no (plan), sobre `c4948ba`. El único commit posterior, `f205c39` (8 líneas, solo `.docs/`: el `tasks.md`), `revisado en el hilo`.

### 4.2 Smoke / tests

- Validación por el agente: 2026-11-05 · verificado por mí con ejecución real, nada reportado por el usuario: `engines` y `.nvmrc` leídos de los ficheros del árbol y suite 4/4. La spec declara `Validación: agente`: no hay nada que una persona observe.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `package.json` declara `engines.node` `>=22` | ejecución real: `require('./package.json').engines` → `{"node":">=22"}` | ✔ |
| `.nvmrc` contiene `22` | ejecución real: `od -c .nvmrc` → `2 2` | ✔ |

### 4.3 Residuales / deuda generada

- Ninguna.
- No probado: que `engines` rechace un Node < 22 al instalar (no hay dependencias ni `engine-strict`); la spec solo pide que lo declare.

## 5. Aprendizajes

- Ninguno que vuelva a un doc vivo: `tech-stack.md` ya decía «Node 22».

Retro: sin señales

## 6. Adendas

- _Ninguna_
