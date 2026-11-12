---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-12
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js` (fa34fa3, 6fa0f10): lista cerrada de motivos (`cambio de planes`, `sala ocupada`, `otro`); `cancelar <sala> <día> --motivo <motivo>` rechaza con «motivo no válido: …» un motivo fuera de la lista o ausente, y guarda el motivo en la reserva cancelada; comando `canceladas`, que lista «<sala> <día> — <motivo>».
- `test/cancel.test.js` (fa34fa3, 6fa0f10): tests de cancelar con motivo, con motivo fuera de la lista y del listado.
- Capacidad `bookings` creada desde el delta de la spec (`capabilities/bookings.md`).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- Suite completa: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 1 s, sobre el commit de cierre

### 4.2 Smoke

| THEN | Evidencia | Comando y salida |
| --- | --- | --- |
| Cancelar con motivo | ejecución real | `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» |
| Motivo fuera de la lista | ejecución real | `node src/app.js cancelar Norte lun --motivo "por si acaso"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin motivo | ejecución real | `node src/app.js cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Listado de canceladas | ejecución real | `node --input-type=module -e "const { run } = await import('./src/app.js'); run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']); console.log(run('canceladas', []))"` → «Norte lun — sala ocupada» |

Validación en campo: 2026-10-26 · smoke con una fila por THEN (4.2) y suite en verde sobre el commit de cierre · revisión final Spec y Código limpias sobre 6fa0f10

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests (ruling de la Task 2): fila en «Por triar» de `.docs/sdd/steering/debt.md`.

## 5. Aprendizajes

- La lista de motivos de cancelación es cerrada y `canceladas` los enseña → `capabilities/bookings.md` (delta de la spec, fusionado con `sdd capability merge`).
- Un test que reutiliza el estado de otro es frágil: cada test prepara sus datos → fila en «Por triar» de `.docs/sdd/steering/debt.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
