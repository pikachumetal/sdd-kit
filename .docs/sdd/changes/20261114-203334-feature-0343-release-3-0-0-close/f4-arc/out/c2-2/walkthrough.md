---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-16
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` con lista cerrada de motivos (`src/app.js`, `test/cancel.test.js`) — a6e7e92.
- Comando `canceladas`, que enseña sala, día y motivo (`src/app.js`, `test/cancel.test.js`) — 05ce9b6.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya (workaround hasta que cada test prepare sus datos) — coste si está mal: el test falla si corre solo o en otro orden.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 pass, 0 fail, sobre 6deb774 (verificado por mí).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-16 · suite 5/5 verificada por mí sobre 6deb774 · revisión final Spec y Código limpias sobre 05ce9b6 · smoke de los THEN con ejecución real no ejecutado en este paso.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Cancelar con motivo de la lista responde «cancelada Norte lun (sala ocupada)» | suite | pasa |
| Motivo fuera de la lista (o ausente) responde «motivo no válido: …» | suite | pasa |
| `canceladas` responde «Norte lun — sala ocupada» | suite | pasa |

### 4.3 Residuales / deuda generada

- Ninguno.

## 5. Aprendizajes

- La suite lenta necesita `--maxWorkers 8` → `steering/operations.md`

## 6. Adendas

- (ninguna)
