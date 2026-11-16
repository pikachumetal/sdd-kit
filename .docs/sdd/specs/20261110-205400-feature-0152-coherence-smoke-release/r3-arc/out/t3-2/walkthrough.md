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

- `package.json`: `engines.node` pasa a `>=22` (commit 6a4fae9, task 1).
- `.nvmrc`: nuevo, contiene `22` (commit 6a4fae9, task 2).
- Nada fuera de esos dos ficheros: el código de la app no se toca.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- _Ninguna_

## 4. Verificación

### 4.1 Builds

- `node --test` entero: 4 tests, 4 pasan, 0 fallan.
- Gate: `node --test` → suite: corrió 4/4 · sin filtro: la rama toca `package.json` y el proyecto no declara tareas filtrables · configuración: la del gate de la constitución · sobre el commit de cierre.
- Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 6a4fae9. Re-revisión del único commit posterior (solo `tasks.md`), limpia.

### 4.2 Smoke / tests

Validación por el agente: 2026-11-11 · suite 4/4 · smoke 2/2 con ejecución real (`engines.node` leído de `package.json` en `HEAD` y `.nvmrc` con `od -c`) · revisión final Spec y Código sobre 6a4fae9 y re-revisión limpia. Lo verificó el agente; ninguna parte es reportada por una persona.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `package.json` declara `engines.node` `>=22` | ejecución real: `JSON.parse(...).engines.node` → `>=22` | ok |
| `.nvmrc` contiene `22` | ejecución real: `od -c` → `2 2 \n` | ok |

### 4.3 Residuales / deuda generada

- Ninguno.

## 5. Aprendizajes

- Sin aprendizajes nuevos: `architecture.md` ya dice «Node 22», y el cambio de comportamiento observable es nulo (spec sin capacidades).

Retro: sin señales

## 6. Adendas

- _Ninguna_
