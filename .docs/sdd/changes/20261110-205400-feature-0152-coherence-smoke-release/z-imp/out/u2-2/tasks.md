---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-10-08
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | a0f26cb | afectada por enmienda 2026-11-12 → Task 3 |
| 2 | Listado de canceladas | done | 496ff11 | sin «quién»: lo añade la Task 3 |
| 3 | Enmienda 2026-11-12: cancelar guarda quién cancela (`--por`) | done | d139f86 | |

Revisión final: Spec opus+high, con arreglos (2 importantes, 3 menores) · Código sonnet+high, con arreglos (3 importantes, 6 menores) · Arquitectura no (plan), sobre 1afe24d
Pasada de fix: 05fa558, 3 hallazgos (1 RED→GREEN, 2 de cobertura sin RED)
Re-revisión: 1afe24d..05fa558, sdd-kit:effort-high + opus, aceptada

## Rulings

- Task 3: Ruling: la Task 3 va tras la Task 2 y su test en test/cancel-por.test.js (estado en memoria, la única reserva ya se cancela en la Task 1) — si falla, depende del orden de ficheros
- Task 3: Ruling: --por opcional; sin él canceladas omite el campo — conserva los tests de la Task 1 — el dev-lead puede preferir obligatorio
- Final: Ruling: Eje Arquitectura no — el diff no cruza ninguna de las cuatro señales — si falla, un límite entre módulos pasa sin mirar
- Final: Ruling: tests de cancel.test.js dependen del orden y del estado en memoria — cada fichero corre en su proceso con node --test y un reinicio exigiría exportar una función solo para tests — si falla, un test nuevo mal ordenado da un falso rojo
- Final: Ruling: --por sin valor se ignora sin error — un error nuevo sería un AND nuevo en la spec (desviación) y la spec calla — se guarda el listado sin «quién» sin avisar
- Final: Ruling: enmienda sin firma en Aprobaciones — la firma es del dev-lead, no mía — merge sin la firma formal; va a ✋
- Final: Ruling: persistencia entre ejecuciones (reviewer Spec, «Declined») — la app entera es en memoria y la spec no pide persistencia; pero desde la terminal `canceladas` tras `cancelar` en otra ejecución sale vacío — la feature solo se ve en un mismo proceso; va a ✋
- Final: Ruling: argumentos mal formados, orden de validación motivo/reserva y «Reserva a nombre de quien la pide» de PRODUCT.md (Spec, «Declined») — la spec no los fija y ya eran así — comportamiento sorpresa en entradas raras
- Final: Ruling: --por obligatorio, sitio del parseo, formato de la línea 73 y carpeta de la spec (Código, «Declined») — son del eje Spec, Arquitectura o del formateador — nada
- Final: minor (deferred): «Dónde se prueba» de la spec no nombra test/cancel-por.test.js (editar la spec es desviación)
- Final: minor (deferred): canceladas sin canceladas imprime una línea vacía
- Final: minor (deferred): cancelBooking con 4 parámetros posicionales; mejor { reason, by }
- Final: minor (deferred): plantilla anidada de cancelledList y línea larga del despacho de cancelar
- Final: minor (deferred): un test con dos acciones en cancel-por.test.js; booking.by queda undefined sin --por
- Final: minor (deferred): al ledger le falta la línea de la Task 1 (se hizo antes de abrirlo)
- Final: Ruling: test/cancel-opciones.test.js, fichero nuevo fuera del plan — el estado es en memoria y Norte lun ya está cancelada en los otros dos ficheros — si node --test cambiara a un proceso común, fallaría por orden
