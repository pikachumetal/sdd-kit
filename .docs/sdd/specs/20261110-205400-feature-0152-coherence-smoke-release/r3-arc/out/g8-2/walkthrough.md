---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-11
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …» (e75954d).
- `src/app.js`: comando `canceladas`, que lista las reservas canceladas con su motivo (c6e8fdb).
- `test/cancel.test.js`: pruebas de ambos comportamientos (e75954d, c6e8fdb).
- `capabilities/bookings.md`: capacidad nueva con los dos requisitos de la spec, fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_ en el código. La spec y el plan se cumplieron tal cual.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. **No llegó a aplicarse**: `gate.json` y el gate del plan siguen sin el flag y la suite pasa igual. Detectado por la re-revisión del cierre; queda en `tasks.md` y en una fila de «Por triar» de `debt.md`.

## 4. Verificación

### 4.1 Builds

- Suite del gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 0,5 s.
- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 5/5 · rooms:test: saltada (no la toca la rama) · 0,5 s · configuración: la del gate · sobre el commit de cierre

### 4.2 Smoke / tests

Verificado por el agente (no hay validación reportada por el dev-lead más allá de la orden de cerrar).

- Validación en campo: 2026-11-11 · smoke 4/4 THEN con ejecución real · suite del gate verde (bookings:test 5/5) · revisión final Spec y Código limpias sobre c6e8fdb · re-revisión del cierre con 2 Important, corregidos en el registro (ver 3). Sin `no probado` entre los THEN.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | ✅ |
| Un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real, con `--motivo "porque sí"` | ✅ |
| Sin `--motivo` responde lo mismo | ejecución real, `cancelar Norte lun` | ✅ |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real en un solo proceso (`run('cancelar', …)` y luego `run('canceladas', [])` sobre `src/app.js`); no por la CLI, ver 4.3 | ✅ |

### 4.3 Residuales / deuda generada

- Por la CLI, `canceladas` en un proceso nuevo no muestra nada: el almacén de reservas vive en memoria y el motivo no sobrevive al proceso. Está fuera del alcance de esta spec; lo cubre la fila 0014 «Motivo guardado» del roadmap.
- Workaround del gate sin aplicar → fila en `debt.md` (ver 3).

## 5. Aprendizajes

- Un ruling que dice cambiar el gate hay que comprobarlo en `gate.json`: el de la Task 2 se anotó sin aplicarse → fila de deuda en `debt.md`.
- Comportamiento nuevo (motivo al cancelar, listado de canceladas) → `capabilities/bookings.md`.
- Sin convención nueva ni cambio de estructura: `constitution.md` y `architecture.md` no cambian.

Retro: documento o skill desmentido → corregido en el propio documento: el ruling de `tasks.md` decía que el gate llevaba `--test-concurrency=1` y `gate.json` lo desmentía; ahora dice «no aplicado» y la deuda tiene su fila (`.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md`)

## 6. Adendas

- _Ninguna._
