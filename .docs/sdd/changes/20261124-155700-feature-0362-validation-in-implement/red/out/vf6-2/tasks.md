---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | b08e031 | |
| 2 | Listado de canceladas | done | c735109 | |


Final: Eje Arquitectura: sin línea en el plan (decidido al despachar) · señales en el diff: ninguna (sin módulo nuevo, sin dependencia: package.json no cambia; el motivo es un campo en memoria de la reserva, sin esquema ni contrato entre módulos) → no sale

Revisión final: Spec opus+high, con arreglos (2 Important) · Código sonnet+high, con arreglos (2 Important) · Arquitectura no (plan), sobre e642d12
Final: fixed falta el test de «sin --motivo» (Spec 1) — test «cancelar sin --motivo responde motivo no válido» RED→GREEN (mutación: motivo por defecto lo hace fallar), suite 10/10
Final: fixed cobertura perdida de «sin reserva» (Spec 2, Código 2) — test «cancelar sin reserva lo dice», suite 10/10
Final: fixed el test de `canceladas` dependía del orden (Código 1, Spec 3) — `canceladas` solo falló con --test-name-pattern (RED) y pasa con `resetBookings()` en beforeEach (GREEN), suite 10/10
Final: fixed motivo inválido sobre una reserva real (Spec 4) — test «…deja la reserva activa», suite 10/10
Final: minor (deferred): `canceladas` sin canceladas imprime una línea vacía (Spec 5, Código 4)
Final: minor (deferred): parseo frágil de `reasonOf` si falta el día (Código 3)
Final: minor (deferred): cadenas de estado sueltas 'active'/'cancelled'/'voided' y `if` por comando en `run` (Código 5, 6)
Final: minor (deferred): el delta del spec etiqueta ADDED un cambio que es MODIFIED (Spec 6)
Final: Ruling: la superficie nueva `resetBookings` en src/app.js solo la usan los tests — hace falta para aislar el estado en memoria hasta la 0014 — coste si es erróneo: una exportación de más que la 0014 retira
Final: Ruling: el Ruling de la Task 2 queda superado por el arreglo: cada test prepara sus datos
Pasada de fix: f48b8a6, 4 hallazgos RED→GREEN
Re-revisión: e642d12..791937e, sdd-kit:effort-high + opus, todo atendido, sin roturas nuevas
sin revisar: 6f38cf1 — añade `engines` (node >=22) a package.json
Gate: `node scripts/gate.mjs run bookings:test rooms:test` → bookings:test: corrió 9/9 (sin filtro: cambia el build) · rooms:test: corrió 1/1 (sin filtro: cambia el build) · `node --test` → 10/10
Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 9/9 · rooms:test: saltada (`gate.mjs task rooms:test`: sus inputs src/rooms.js y test/rooms.test.js no están entre los ficheros cambiados) · `node --test` → 10/10

## Rulings

- (superado por el pase de fix de la revisión final) Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
