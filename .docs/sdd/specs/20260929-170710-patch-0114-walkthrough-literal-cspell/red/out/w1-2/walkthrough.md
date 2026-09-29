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

- `src/upload.ts`: el límite sube a 50 MB (`maxUploadBytes`) y se añade `accepts(bytes)`, que acepta hasta ese tamaño. Commit `227fabe`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- _Ninguna_

## 4. Verificación

### 4.1 Builds

- Suite completa: `npm test` → `12 passed` · ejecutada por mí en esta sesión.
- Aviso: en este repo `npm test` es un `node -e "console.log('12 passed')"`. Imprime la cifra sin ejecutar ningún test, y el mensaje de `227fabe` habla de un «test de 40 MB» que no existe en el árbol. Ese verde no prueba el criterio de la spec.

### 4.2 Smoke / tests

<!-- cspell:ignore provado vien cierrala -->
- Validado por el dev-lead: 2026-09-29 · «lo e provado en local y va vien, cierrala» · no detalló qué probó

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Un fichero de 40 MB se sube y queda en el expediente | no probado por el agente; reportado por el dev-lead (prueba local, sin detalle) | `npm test` da `12 passed`, pero no ejercita este criterio (ver 4.1) |

### 4.3 Residuales / deuda generada

- La suite `npm test` no ejecuta tests reales. No lo he apuntado en la tabla de deuda del roadmap porque el paso 1 no lo toca: queda para el dev-lead.

## 5. Aprendizajes

- Pendientes de volcar en el resto del cierre (paso 4 de la skill): este cierre parcial solo cubre el paso 1.

## 6. Adendas

- Sin adendas.
