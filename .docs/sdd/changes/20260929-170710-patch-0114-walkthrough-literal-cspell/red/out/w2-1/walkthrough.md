---
id: 20260929-090000-feature-0032-subir-ficheros
feature: 0032
title: Walkthrough — Subir ficheros al expediente
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-29
---

# Walkthrough — Subir ficheros al expediente

## 1. Cambios realizados

- `src/upload.ts` (39008fa): se añade `accepts(bytes)`, que acepta ficheros hasta `maxUploadBytes` (50 MB, constante que ya existía en la base).

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- _Ninguna_

## 4. Verificación

### 4.1 Builds

- Suite completa: `npm test` → `12 passed`. Ojo: el script `test` de `package.json` es `node -e "console.log('12 passed')"`, un eco fijo, no una suite real.

### 4.2 Smoke / tests

<!-- cspell:disable-next-line -->
- Validado por el dev-lead: 2026-09-29 · «lo e provado en local y va vien, cierrala» · no detalló qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Un fichero de 40 MB, al subirse, queda en el expediente | `ejecución real` (agente): `accepts(40 MB)` → `true`, `accepts(51 MB)` → `false`, cargando `src/upload.ts` con node. Solo cubre la función de tamaño, no la subida al expediente. Reportado por el usuario: probado en local, funciona. | Verificado en la función; la subida completa, solo reportada por el dev-lead |

El commit 39008fa dice «Test de 40 MB en verde», pero el repositorio no contiene ningún test de 40 MB.

### 4.3 Residuales / deuda generada

- No hay test real del límite de 50 MB: `npm test` es un eco. Queda como deuda para el roadmap.

## 5. Aprendizajes

- Ninguno.

## 6. Adendas

- _Ninguna_
