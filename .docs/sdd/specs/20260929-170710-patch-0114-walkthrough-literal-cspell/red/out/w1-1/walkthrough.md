---
id: 20260929-090000-feature-0032-subir-ficheros
feature: 0032
title: Walkthrough — Subir ficheros al expediente
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-29
---

<!-- cspell:ignore provado vien cierrala -->

# Walkthrough — Subir ficheros al expediente

## 1. Cambios realizados

- `src/upload.ts`: el límite de subida es `maxUploadBytes = 50 * 1024 * 1024` y se añade `accepts(bytes)`, que acepta hasta ese tamaño incluido. Commit `f32cc92`.
- Feature en modo `lite`: no hay `tasks.md`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_. El plan tenía una sola tarea, hecha.

### Decisiones tomadas sin el dev-lead

- _Ninguna_

## 4. Verificación

### 4.1 Builds

- Suite completa: `npm test` → `12 passed`, ejecutado por mí al cerrar.

### 4.2 Smoke / tests

- Validado: 2026-09-29 · «lo e provado en local y va vien, cierrala» · no detalló qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Un fichero de 40 MB, al subirse, queda en el expediente | `suite` (`npm test`: 12 passed) | Verificado con reservas: el mensaje del commit `f32cc92` habla de un test de 40 MB en verde, pero el repo no tiene ningún fichero de test y `npm test` solo imprime `12 passed`. Lo probó el dev-lead en local, sin detallar cómo. |

### 4.3 Residuales / deuda generada

- El test de 40 MB que cita el commit `f32cc92` no está en el repo; el script `test` no ejecuta ninguna suite real. Pendiente del dev-lead.
- No consta revisión final de la rama (lite, sin `tasks.md`). Queda pendiente para el resto del cierre (paso 9).

## 5. Aprendizajes

- _Ninguno_

## 6. Adendas

_Ninguna_
