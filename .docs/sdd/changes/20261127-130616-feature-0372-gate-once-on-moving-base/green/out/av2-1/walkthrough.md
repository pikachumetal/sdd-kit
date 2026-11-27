---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-27
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- Cancelar con motivo (`src/app.js`, `test/cancel.test.js`, f09c031): `cancelar <sala> <día> --motivo <motivo>` acepta solo cambio de planes, sala ocupada u otro; fuera de la lista, o sin `--motivo`, responde «motivo no válido: …».
- Listado de canceladas (`src/app.js`, `test/cancel.test.js`, 04e0924): el comando `canceladas` lista cada reserva cancelada con su motivo; sin canceladas avisa (test añadido en la revisión final).
- Capacidad nueva `bookings` en `.docs/sdd/capabilities/bookings.md`, fusionada desde el delta de la spec.
- Sin «ADR candidata» en la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (apuntado en «Por triar» de la deuda)

## 4. Verificación

### 4.1 Builds

- Suite completa: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 1 s, sobre el commit de cierre

### 4.2 Smoke / tests

- Verificado por el agente (ejecución real, en la tabla). Reportado por el dev-lead: nada más que su validación en campo.

Validación en campo: 2026-10-26 · smoke con una fila por THEN (4.2) y suite en verde sobre el commit de cierre; revisión final Spec y Código limpia sobre el commit de cierre

| THEN | Evidencia | Comando y salida |
| --- | --- | --- |
| Cancelar con motivo | ejecución real | `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» |
| Motivo fuera de la lista | ejecución real | `node src/app.js cancelar Norte lun --motivo "por si acaso"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin motivo | ejecución real | `node src/app.js cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Listado de canceladas | ejecución real | `node --input-type=module -e "const { run } = await import('./src/app.js'); run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']); console.log(run('canceladas', []))"` → «Norte lun — sala ocupada» |

### 4.3 Residuales / deuda generada

- Los tests de `cancel.test.js` dependen del orden (ver ruling de la Task 2): fila en «Por triar» de `debt.md`.
- Las reservas viven en memoria hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso (ya en el Approach de la spec).

## 5. Aprendizajes

- Ningún aprendizaje nuevo para los docs vivos: el comportamiento observable va a `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
