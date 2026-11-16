---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-05
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (`c1eb339`, Task 1): `src/app.js` guarda la lista cerrada de motivos (`cambio de planes`, `sala ocupada`, `otro`); `cancelar <sala> <día> --motivo <motivo>` guarda el motivo en la reserva y responde «cancelada Norte lun (sala ocupada)». Un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro» y no cancela. `test/cancel.test.js` sustituye los dos tests de `cancelar` por los del motivo.
- **Listado de canceladas** (`b6119cb`, Task 2): comando `canceladas` en `src/app.js`, una línea «Norte lun — sala ocupada» por reserva cancelada.
- Registro: `spec.md`, `plan.md`, `tasks.md` y este walkthrough; la capacidad `bookings` nace en `capabilities/bookings.md` con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.
- Review de spec: no (dos señales: MODIFIED, datos; decisión 3 de la spec) · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_ en lo que el usuario ve: la spec se implementó tal cual.
- `tasks.md` anotaba `b6119cb` como commit de las dos tasks; la Task 1 es `c1eb339`. Corregido en el cierre.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. **En el cierre** el flag no está en la rama: `gate.json`, `package.json` y `scripts/` no cambian respecto de `develop`, y el gate corre en verde sin él. Lo que sí queda es la dependencia entre tests (el de `canceladas` solo pasa tras el de `cancelar`), que va a la deuda técnica del roadmap.
- Spec, decisión 3: sin review de spec por dos señales (MODIFIED, datos).

## 4. Verificación

### 4.1 Builds

- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 5/5 · rooms:test: saltada (la rama no toca sus inputs) · 0,7 s · configuración: la del gate · sobre el commit de cierre (el código es el de `b6119cb`)
- Suite completa de apoyo: `node --test` → 6/6.

### 4.2 Smoke / tests

Validación en campo: 2026-11-05 · suite 5/5 del gate (6/6 con `node --test`) · smoke 3/3 THEN con ejecución real · revisión final Spec y Código limpia sobre `b6119cb`; el commit de `tasks.md` posterior (17 líneas, solo documentación) revisado en el hilo, sin re-revisión · 0 sin revisar

Verificado por el agente; el dev-lead no ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| Un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | `node src/app.js cancelar Norte lun --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| Sin `--motivo` responde lo mismo | ejecución real | `node src/app.js cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada`, en el mismo proceso que la cancelación (el almacén es en memoria y no sobrevive entre invocaciones de la CLI) |

Sin probar: nada de la spec. La falta de `--motivo` no tiene test propio (la fila 3 es solo ejecución real).

### 4.3 Residuales / deuda generada

- Los tests de `cancel.test.js` comparten el almacén en memoria: `canceladas` depende de que antes corra `cancelar`. → deuda técnica del roadmap.
- La spec cambió los dos tests de `cancelar`; el de «sin reserva» ya no existe. El código sigue respondiendo `sin reserva Sur mar` (ejecución real con un motivo válido), pero ningún test lo fija. → deuda técnica del roadmap.
- Una CLI sin estado no puede mostrar `canceladas` tras una `cancelar` anterior: es el almacén en memoria de la base, y lo cubre la fila 0014 («Motivo guardado»).

## 5. Aprendizajes

- Nada nuevo para `constitution.md` ni `tech-stack.md`: no hay `architecture.md` y no hay cambio estructural. El comportamiento nuevo vive en `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- Ninguna.
