---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 03e7595 | |
| 2 | Listado de canceladas | done | 03e7595 | |


Revisión final: Spec opus+high, Ready to merge (1 Minor) · Código sonnet+high, con arreglos (1 Important) · Arquitectura no (plan), sobre 03e7595
Pasada de fix: 39105d2, 2 hallazgos RED→GREEN
Re-revisión: 03e7595..39105d2, sdd-kit:effort-high + opus, hallazgos resueltos, 1 Minor nuevo adjudicado

## Rulings

Final: Ruling: re-revisión — el test 'canceladas' cancela Norte lun en el estado compartido del módulo, así que solo pasa si corre antes que 'cancelar con un motivo de la lista' (la dependencia de orden cambió de sitio, no se quitó) — el orden del fichero es fijo y node:test ejecuta en orden de declaración; quitarla del todo pide un reset de estado exportado en src/app.js, que es API nueva fuera del alcance de la spec — coste si me equivoco: si alguien reordena los tests, falla uno con «sin reserva Norte lun»
Final: minor (deferred): THEN «sin --motivo responde “motivo no válido…”» (spec.md:54) sin test propio en test/cancel.test.js
Final: minor (deferred): ningún test comprueba que cancelar con espacios alrededor acabe bien y muestre «(sala ocupada)» sin espacio; el test de recorte solo lo prueba de forma indirecta («sin reserva Sur mar»)
Final: minor (deferred): mi commit 39105d2 pasó src/app.js de CRLF a LF (ruido de 48 líneas en el diff; el cambio real es la línea 16)
