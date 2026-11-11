---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-11
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 0553974 | revisión limpia |
| 2 | Listado de canceladas | done | de44cde | revisión limpia |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js`
- [x] Task 2 — `node --test test/cancel.test.js`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Task 0: Ruling: plan sin línea «Modelo» por task — sonnet + sdd-kit:effort-medium para implementadores y revisores (texto en prosa, suelo medio) — coste si me equivoco: una ronda de fix
- Task 1: Ruling: el motivo se valida antes de buscar la reserva — así los THEN de motivo inválido no dependen del orden de los tests con estado compartido; la spec no fija el orden — si es otro, cambia la salida de «cancelar <sala sin reserva> sin motivo»
- Task 1: Ruling: los 2 tests existentes de `cancelar` quedan sustituidos/ajustados al nuevo contrato (con --motivo): los contradice la spec aprobada, no es una enmienda — coste: ninguno, es su Scope
- Task 0: Ruling: spec «Decisiones» numera 1 y 3 (falta la 2) — errata cosmética, sin efecto en el comportamiento; se anota para el dev-lead
- Task 0: Ruling: `sdd-kit.json` dice execution native; manda el plan (Ejecución: subagent)
- Task 1: Ruling: minor del revisor (CRLF = aviso de autocrlf de git, sin cambio; readReason con flag antes de posicionales fuera de spec) — no se actúa — coste: ninguno
- Final: Ruling: Code Important «test de canceladas depende del estado del primer test» — por efecto solo molesta a quien filtre por nombre; el gate entero pasa; la causa es el estado en memoria de app.js y arreglarlo exige exportar un reset solo para tests, API no pedida por la spec; la 0014 (almacén de reservas) lo resuelve de forma natural — coste si me equivoco: un falso rojo al ejecutar ese test suelto
- Final: Ruling: Code Important / Spec Minor «canceladas sin canceladas devuelve cadena vacía» — la spec es muda y un mensaje nuevo sería un THEN nuevo (desviación, no se añade sin el dev-lead); llega a ✋ para decidir — coste si me equivoco: una línea en blanco en un caso vacío
- Final: minor (deferred): readReason con --motivo antes de los posicionales lee mal sala y día (fuera de la sintaxis de la spec)
- Final: minor (deferred): CANCEL_REASONS declarada entre funciones; literales de estado repetidos ('cancelled' en dos funciones)
- Final: minor (deferred): test/cancel.test.js pasó de CRLF a LF al escribir los RED (diff de fichero entero, sin cambio de contenido más allá de la spec)
- Final: minor (deferred): faltan tests de «ya cancelada no se cancela otra vez» y de que anular no deja motivo
- Final: minor (deferred): spec dice «Modificadas: bookings» pero la delta es solo ADDED y no hay capabilities/ — al archivar, tratar bookings como capacidad nueva o corregir la línea
- Final: Ruling (declined to judge, Spec): persistencia entre invocaciones de la CLI — el estado en memoria es previo a esta feature (reservar y cancelar ya eran así) y verificado: `canceladas` en otro proceso sale vacío; la 0014 «Motivo guardado» del roadmap lo cubre — coste si me equivoco: el rastro no sobrevive entre comandos hasta la 0014; va a ✋
- Final: Ruling (declined to judge, Spec): regla de 24 h de PRODUCT.md, orden del listado y mayúsculas del motivo — fuera del Scope; el orden es el de inserción y la lista cerrada exige coincidencia exacta — coste: ninguno ahora
- Final: Ruling (declined to judge, Code): conformidad con la spec, ubicación del estado y reescritura del test «cancelar una reserva activa» — lo primero es del eje Spec, lo segundo de arquitectura (no sale) y lo tercero ya está en el Ruling 2 de la Task 1 — coste: ninguno

## Revisión

Revisión final: Spec opus+high, Sí · Código sonnet+high, con arreglos (2 Important adjudicados) · Arquitectura no (plan), sobre de44cde
