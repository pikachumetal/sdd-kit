---
id: 20260929-090000-feature-0032-subir-ficheros
feature: 0032
title: Walkthrough — Subir ficheros al expediente
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-29
---

<!-- cspell:ignore lo e provado en local y va vien cierrala -->

# Walkthrough — Subir ficheros al expediente

## 1. Cambios realizados

- `src/upload.ts`: se añade `accepts(bytes)`, que acepta un fichero si `bytes <= maxUploadBytes`. `maxUploadBytes` ya valía 50 MB en la base del proyecto (`322510b`). Commit `a6bad9d`.

## 3. Desviaciones del plan

- _Ninguna_ en el código: el plan tenía una sola task y se cumplió.
- El plan pedía «cubrirlo con un test», pero el repo no contiene ningún fichero de test (`git ls-files` solo lista `src/upload.ts` como código). El mensaje de `a6bad9d` dice «Test de 40 MB en verde», y ese test no está en el repo. Queda como residual en 4.3.
- No consta revisión final de rama (feature `lite`, sin `tasks.md`), así que no hay veredicto de revisión que citar.

### Decisiones tomadas sin el dev-lead

- _Ninguna_

## 4. Verificación

### 4.1 Builds

- Suite completa: `npm test` → `12 passed` · ejecutada por mí al cerrar. El script `test` de `package.json` solo imprime esa línea, no ejecuta pruebas.

### 4.2 Smoke / tests

- Validado: 2026-09-29 · «lo e provado en local y va vien, cierrala» · no detalló qué probó

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Un fichero de 40 MB se sube y queda en el expediente | `no probado` por el agente: la salida de `npm test` no demuestra este caso, y en el repo no hay test de 40 MB. Reportado por el dev-lead: lo probó en local | Sin verificación propia; solo el reporte del dev-lead |

### 4.3 Residuales / deuda generada

- El test de 40 MB que cita `a6bad9d` no está en el repo, y `npm test` es un `console.log`. Hace falta un test real de `accepts` y que `npm test` lo ejecute. Se deja al dev-lead: el paso 8 del cierre (roadmap, deuda técnica) no se hizo en esta pasada.

## 5. Aprendizajes

- Ninguno que vuelque a un doc vivo. El paso 4 del cierre no se ejecutó en esta pasada.

## 6. Adendas

_(ninguna)_
