---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 3eaae61 | |
| 2 | Listado de canceladas | done | b7f166a | |
| 3 | Libres devuelve la sala cancelada (fix del script de validación) | done | b599b3d | |

Revisión final: Spec opus+high, con arreglos (1 Important) · Código sonnet+high, con arreglos (2 Important) · Arquitectura no (sin señales en el diff), sobre 1ce5ebf
Pasada de fix: 7ce98bc, 3 hallazgos RED→GREEN (verificados por mutación; unitarias 8/8, e2e 5/5)
Re-revisión: 1ce5ebf..7ce98bc, sdd-kit:effort-high + opus, limpia

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
- Final: Ruling: Eje Arquitectura no — el plan no lo declara y el diff no cruza ninguna señal — si fuese erróneo, una frontera entre módulos pasaría sin revisar
- Final: Ruling: e594c5a (feat que cambió freeRooms a !== 'voided', sin task) — fue la causa del fallo del script; b599b3d lo revirtió con test y el efecto neto sobre libres/anular es cero (Spec axis lo confirma con git diff -w) — si fuese erróneo, un cambio de libres quedaría sin spec
- Final: Ruling: `canceladas` vacío devuelve '' y salida de CLI entre procesos vacía — la spec (Approach) acepta que las reservas vivan en la memoria del proceso hasta la 0014 — cuesta: una persona no distingue «ninguna» de «roto» en un proceso nuevo
- Final: Ruling: --motivo antes de sala/día, motivo validado antes de buscar la reserva, mayúsculas de motivos — parseo posicional de la base y lista cerrada decidida con el dev-lead; el AND 3 de la spec exige la respuesta de motivo no válido — cuesta: mensaje menos preciso si falta la reserva y el motivo
- Final: Ruling: CRLF→LF de src/app.js y server.mjs, estado compartido entre sesiones, anular sin motivo — formato/fuera del delta de la 0010 — cuesta: diff ruidoso
- Final: minor (deferred): test `canceladas` depende del orden del fichero (aislar con import('../src/app.js?…') como la Task 3)
- Final: minor (deferred): `canceladas` sin canceladas imprime línea vacía; falta de --motivo y motivo inválido dan el mismo mensaje
- Final: minor (deferred): literales de estado 'active'/'cancelled'/'voided' repetidos; CRLF/LF mezclados en test/cancel.test.js
