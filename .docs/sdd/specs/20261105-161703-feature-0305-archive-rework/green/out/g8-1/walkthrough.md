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

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada. Sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` — `6ee4375`.
- `canceladas` lista las reservas canceladas como «<sala> <día> — <motivo>». `src/app.js`, `test/cancel.test.js` — `a7297dd`.
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), con los dos requisitos de la spec, fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_ en el código. El plan pedía como gate `node --test`; el gate de cierre real es el de la constitution (`node scripts/gate.mjs run bookings:test rooms:test --affected --base develop`) y es el que se ejecutó.

### Decisiones tomadas sin el dev-lead

- Task 2: no se aplica `--test-concurrency=1` (el Ruling original lo daba «en el gate», pero no consta en `gate.json` ni en `scripts/gate.mjs`, y no arreglaría nada: cada fichero corre en su proceso). El acoplamiento real es de orden: el test de `canceladas` depende de que el de `cancelar` haya cancelado antes la reserva de Norte lun sobre el almacén en memoria — se deja así y va a la deuda — coste si es erróneo: un test que falla si se reordena.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test` · `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 5/5 · rooms:test: saltada (sus inputs no cambian) · 1 s · configuración: la del gate · sobre el commit de cierre.
- Suite unitaria completa `node --test`: 6/6 en verde, ejecutada por mí sobre el mismo código (el commit de cierre solo cambia documentación).

### 4.2 Smoke / tests

Validación en campo: 2026-11-05 · suite 6/6 y gate en verde · smoke de los 5 THEN con ejecución real (ver tabla) · revisión final Spec y Código limpia sobre a7297dd, re-revisión (Spec opus, `sdd-kit:effort-high`) con 1 Important y 1 Minor documentales, corregidos en el cierre.

Verificado por mí; el dev-lead no aportó prueba propia. El borrador previo citaba `--motivo sala-ocupada`: la CLI lo rechaza («motivo no válido»), el motivo válido es «sala ocupada», y la tabla recoge lo que realmente se ejecutó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (CLI) | «cancelada Norte lun (sala ocupada)» |
| Motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (CLI, con `--motivo inventado` y con `sala-ocupada`) | «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin `--motivo` → la misma respuesta | ejecución real (CLI, `cancelar Norte lun`) | «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` tras cancelar con «sala ocupada» → «Norte lun — sala ocupada» | ejecución real, en un solo proceso (`run('cancelar', …)` y luego `run('canceladas', [])` de `src/app.js`) | «Norte lun — sala ocupada» |
| Mismo THEN, desde la CLI en dos invocaciones | ejecución real | **no se cumple**: `canceladas` imprime vacío, porque el almacén es en memoria y no sobrevive al proceso |

### 4.3 Residuales / deuda generada

- Dos invocaciones de la CLI no comparten estado: tras `cancelar`, un `canceladas` aparte no ve nada. Lo cubre la fila 0014 «Motivo guardado» del roadmap; hasta entonces el listado solo se ve dentro de un mismo proceso. No es un fallo de este cambio (la spec nunca pedía persistencia), pero hay que saberlo al validar a mano.
- Deuda: `test/cancel.test.js` acopla el test de `canceladas` al de `cancelar` por orden, sobre el almacén en memoria. Fila nueva en «Deuda técnica» del roadmap.
- Sin test, aunque el código lo cumple: «sin `--motivo`» (`spec.md`), y el motivo inválido se prueba con una reserva inexistente (`Sur mar`), no con una existente. Observaciones de la re-revisión, fuera del alcance de este cambio.

## 5. Aprendizajes

- Comportamiento observable nuevo (motivo obligatorio, listado de canceladas) → `.docs/sdd/capabilities/bookings.md`, creada por el delta de la spec.
- Un Ruling que cita una configuración «en el gate» se comprueba contra `gate.json` antes de cerrar: este no estaba aplicado → corregido en `tasks.md`; sin destino estructural.

Retro: documento o skill desmentido → corregido en el propio documento: el Ruling de la Task 2 (`tasks.md`) y la línea de validación del borrador (`walkthrough.md`)
