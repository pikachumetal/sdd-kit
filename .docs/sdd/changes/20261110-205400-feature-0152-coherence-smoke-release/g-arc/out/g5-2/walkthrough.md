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

- `cancelar <sala> <día> --motivo <motivo>`: el motivo es obligatorio y de la lista cerrada (cambio de planes, sala ocupada, otro); fuera de ella, o sin `--motivo`, responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` (Task 1, 44e246c).
- Comando `canceladas`: lista cada reserva cancelada con su motivo. `src/app.js`, `test/cancel.test.js` (Task 2, 2b788f1).
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), fusionada del delta de la spec con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance: dos tasks, Native, como decía el plan.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- Suite de la rama: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 1 s, sobre el commit de cierre (el cierre junta el último commit de documentación, sin cambio de código desde 2b788f1).
- La base (`develop`) trae un commit por delante (fa5922e, un test de `rooms`): el gate de cierre corre una vez sobre el merge de sync, y su `Gate:` y su sha van en el mensaje final, porque este fichero ya está en el commit de cierre.

### 4.2 Smoke

Verificado por el agente en el cierre (2026-11-12), con ejecución real:

| THEN | Evidencia | Comando y salida |
| --- | --- | --- |
| Cancelar con motivo | ejecución real | `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» |
| Motivo fuera de la lista | ejecución real | `node src/app.js cancelar Norte lun --motivo "por si acaso"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin motivo | ejecución real | `node src/app.js cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Listado de canceladas | ejecución real | `node --input-type=module -e "const { run } = await import('./src/app.js'); run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']); console.log(run('canceladas', []))"` → «Norte lun — sala ocupada» |

Validación en campo: 2026-11-12 · smoke 4/4 THEN con ejecución real, rehecho en el cierre · revisión final Spec y Código, limpias sobre 2b788f1 (el commit posterior solo toca `tasks.md`) · suite de cierre sobre el merge de sync, en el mensaje final · no probado: nada

### 4.3 Residuales / deuda generada

- Los tests de `test/cancel.test.js` dependen del orden (el de `canceladas` usa la cancelación del primero): fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- Un comportamiento observable nuevo (motivo de cancelación y su listado) → `.docs/sdd/capabilities/bookings.md`, creada del delta de la spec. Ninguna convención ni cambio estructural: `constitution.md` y `architecture.md` quedan como estaban.

Retro: sin señales

## 6. Adendas

- _Ninguna_
