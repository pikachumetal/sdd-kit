---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-12
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 0d7912c | |
| 2 | Listado de canceladas | done | c421846 | |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js` → 2/2 pass (ledger)
- [x] Task 2 — `node --test test/cancel.test.js` → 3/3 pass (ledger)

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura no (plan), sobre c421846
Pasada de fix: juntada en el cierre, 3 hallazgos RED→GREEN
Re-revisión: c421846..juntada en el cierre, sdd-kit:effort-high + opus, limpia (3/3 resueltos, sin roturas)

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Final: Ruling: tasks.md no se escribió antes de la Task 1 (dos tasks) — lo escribo ahora como borrador sin commit y entra con el cierre — si está mal, el registro vivo de la ejecución solo lo dan el ledger y git log, que coinciden
- Final: Ruling: no verificado del eje Spec, ¿el test borrado era la regresión del patch 0007? — verificado en el hilo: en 971c128 el único test de cancelar sin reserva era `cancelar sin reserva lo dice` (Sur mar) y vuelve en el cierre con motivo válido — si está mal, el caso misma sala otro día del 0007 sigue sin test propio, como ya estaba en la base
- Final: Ruling: --motivo antes de sala y día responde «sin reserva --motivo otro» — la spec fija la forma `cancelar <sala> <día> --motivo <motivo>` y la app lee por posición en todos sus comandos; el orden libre es del parser de la CLI — si está mal, un usuario que ponga la opción primero recibe un mensaje confuso
- Final: Ruling: cancelar dos veces la misma reserva responde «sin reserva» — findBooking solo busca activas, comportamiento previo a la 0010 y razonable — si está mal, el mensaje no distingue «ya cancelada»
- Final: Ruling: el motivo vive en memoria y `canceladas` en otra invocación de la CLI sale vacío — es el modelo de datos que la app ya tenía (reservas en memoria) y la persistencia es la 0014 del roadmap — si el dev-lead esperaba ver canceladas entre invocaciones, la feature no se nota en uso real hasta la 0014; va a la validación
- Final: Ruling: motivo inválido sobre una reserva que no existe responde «motivo no válido» antes que «sin reserva» — la spec no fija el orden y validar la entrada antes de buscar es defendible — si está mal, el usuario corrige el motivo y después descubre que no había reserva
- Final: Ruling: el eje Código declinó juzgar si cambiar los tests viejos de cancel.test.js tocaba tests RED — los tests de la base no eran RED de esta feature; la 0010 cambia la salida de `cancelar`, así que su THEN los reescribe — si está mal, se perdió cobertura previa, ya devuelta en el cierre
- Final: minor (deferred): el motivo inválido se comprueba antes que la reserva, un orden sin test (src/app.js:20)
- Final: minor (deferred): `canceladas` sin ninguna cancelada imprime una línea vacía; mejor «sin canceladas» (src/app.js:36)
- Final: minor (deferred): `--motivo sala ocupada` sin comillas se lee como «sala» y se rechaza sin pista de citar (src/app.js:16)
- Final: minor (deferred): cadena filter/map/join de ~110 caracteres en una línea en cancelledList (src/app.js:36)
- Final: minor (deferred): voidBooking no toca booking.reason; inocuo porque nada lo lee en anuladas (src/app.js:31)
- Final: minor (deferred): la lista «Decisiones que he tomado yo» de la spec salta del 1 al 3 (spec.md:26)
- Final: minor (deferred): el test de canceladas descarta el retorno de su cancelación de preparación y sigue compartiendo estado de módulo; src/app.js no tiene reset (test/cancel.test.js:22) — de la re-revisión
