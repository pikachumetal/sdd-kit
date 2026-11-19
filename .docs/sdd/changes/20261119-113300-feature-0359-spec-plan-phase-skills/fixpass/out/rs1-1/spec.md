---
id: 20261008-110000-feature-0011-void-others
feature: 0011
title: Anular reservas de otros
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: null
---

# Spec — Anular reservas de otros

🦆 Hoy cualquiera puede anular cualquier reserva y no queda rastro de quién lo hizo. Con este cambio, solo el responsable de sala anula; si lo intenta un cliente, ve «solo el responsable de sala puede anular» y la reserva sigue en pie. Quien pide la anulación dice quién es, escribiendo «responsable» o «cliente» al final de la orden, porque la aplicación no tiene usuarios. Una reserva anulada libera la sala, y un nuevo listado de anuladas muestra cada una con quién la anuló. Como las reservas viven solo en memoria, desde la terminal el listado saldrá siempre vacío; solo se puede comprobar en las pruebas.

## Capacidades

- Nuevas: `reservas` — anular reservas (solo el responsable de sala, sobre reservas de cualquiera) y listar las anuladas con `anuladas`, diciendo quién anuló.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: capacidad nueva (`reservas`), reglas de visibilidad o permiso (solo el responsable anula), contrato público (salida de `anular` y comando nuevo `anuladas`) · tamaño: ~60 líneas en 3 ficheros
- Dominio (opus): qué no puede hacer el cliente y qué ve en `anuladas`, y si anular libera la sala (señal: permiso)
- Técnica (sonnet): que cada THEN de los escenarios de `anular` sea observable y que el orden de validación esté fijado (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`, escrito tras los argumentos de posición (`anular Norte lun --como responsable`): la app no tiene usuarios. `responsable` abrevia «responsable de sala».
2. `reservas` es capacidad nueva: `.docs/sdd/capabilities/` no existe, así que ningún fichero describe hoy las reservas; sus escenarios van como `ADDED`. El nombre va en castellano (constitución, punto 4; `PRODUCT.md` dice «Reserva»).
3. `anuladas` **no existe hoy** (`run` solo conoce `libres`, `reservar`, `cancelar` y `anular`, `src/app.js:27-32`): es comando nuevo y no hay formato previo que proteger. Lo fijo yo: una línea por reserva anulada, en el orden en que se anuló (hoy solo hay una reserva que anular, así que el orden no se puede probar), `<sala> <día> — anulada por <rol>`; sin ninguna, `sin anuladas`.
4. Orden de validación de `anular`: primero el rol (`rol no válido: use --como cliente|responsable`), luego el permiso (`solo el responsable de sala puede anular`), luego la existencia (`sin reserva <sala> <día>`, el mensaje que ya usa `cancelar`). Sin `--como`, o con otro valor, no anula: hoy `anular` sin flag anula y este cambio lo cierra a propósito. No hay tests de `anular` hoy (`test/` solo tiene `app.test.js` y `cancel.test.js`), así que no hay nada que migrar.
5. El rol es global, no «responsable de cada sala» como dice el brief del roadmap 0011: sin usuarios no hay a quién asignar una sala. Si hace falta por sala, es otra feature.
6. Una reserva anulada deja de estar activa: `libres` la vuelve a dar por libre, sin tocar el código de `libres` (ya filtra por `active`), y anular una reserva ya anulada o ya cancelada responde `sin reserva`. Una reserva se identifica por sala y día, como en `cancelar` (la franja no entra).
7. `anuladas` lo ve cualquiera, sin `--como`: lo prohibido al cliente es anular, no consultar. **Valida esta**: si el cliente no debe ver quién anuló, hace falta `--como` también en `anuladas`.
8. Las cinco reglas de las reservas anuladas: el dato vive en memoria (como las reservas; no sobrevive entre ejecuciones de `node src/app.js`, así que `anular` y `anuladas` en dos procesos distintos no se ven, y por eso se prueba por `run`) · nombres en castellano · sin límites · sin avisos · conflicto: gana la primera anulación, la segunda responde `sin reserva`.
9. «Quién anuló» hoy solo puede valer `responsable`, porque solo él anula; se guarda igualmente porque el brief lo pide y deja el listado listo para más roles.
10. Términos: `PRODUCT.md` define «Anulación» como la del responsable y «Cancelación» como la del cliente: `cancelar` no se toca ni se menciona en los mensajes.
11. Cambio incompatible, a la vista: la salida de éxito de `anular` no cambia (`anulada <sala> <día>`), pero sin `--como` ya no anula (decisión 4). Aunque la capacidad `reservas` es nueva, ese comportamiento previo de `anular` queda sustituido, no añadido.
12. **Valida esta**: por el dato en memoria (decisión 8), desde la terminal `anular` siempre responde `sin reserva` y `anuladas` siempre `sin anuladas` mientras no haya persistencia. La feature solo es observable por `run`, en los tests. Persistir las reservas queda fuera; si lo quieres dentro, es otra feature.
13. Dato nuevo: la reserva anulada pasa a `status: 'voided'` (ya lo escribe `voidBooking`), con `voidedBy` (el rol); el orden de anulación es el de la lista. `cancelar` deja `cancelled`, así que no aparece nunca en `anuladas`. Para aislar los tests entre sí, `src/app.js` exporta `resetBookings()`, que restaura las reservas de partida; es API nueva y va en el Scope.
14. `--como` solo lo lee `anular`: `libres`, `reservar` y `cancelar` ignoran el flag y no cambian. El responsable no tiene otros permisos que el cliente fuera de anular.

Fusión del delta sobre una copia de `.docs/sdd` (repetida tras plegar la review): `reservas.md: añadido` en los 9 escenarios, sin rechazos. `.docs/sdd/capabilities/` del repo sin tocar.
Política de modelos: sin cambios respecto a `sdd-kit.json` (`execution: native`, la sesión implementa todas las tasks).

### Hallazgos de la review

- **Aceptado** — Crítico (dominio): anular afecta a `libres` sin decirlo → decisión 6 y escenario que lo observa; `libres` sigue fuera del Scope porque su código no cambia.
- **Aceptado** — Crítico (técnica): THEN no observable («queda anulada», «sigue activa») → ahora se observan con `anuladas` y `libres`.
- **Aceptado** — Crítico (técnica): faltan inexistente y doble anulación → escenarios y decisiones 4 y 6.
- **Aceptado** — Importante: nombre `bookings` → `reservas`; cinco reglas → decisión 8; orden de validación y sintaxis del flag → decisiones 1 y 4; orden de `anuladas` y su vacío → decisión 3; Intent ampliado; «Dónde se prueba» cubre `anuladas`; datos solo en memoria → decisión 8; sin tests previos de `anular` → decisión 4.
- Segunda ronda (sonnet, sin Críticos, sin tercera):
  - **Aceptado** — Importante: `libres` sin franja en el GIVEN → los GIVEN la fijan; dos tests compartiendo estado → decisión 13 (`resetBookings()`, en el Scope); cambio incompatible oculto → decisión 11; CLI sin persistencia → decisión 12; escenario con tres casos → partido en escenarios sueltos, con «ya cancelada»; dato nuevo del modelo → decisión 13; rol inválido sobre reserva inexistente → escenario; roles y alcance de `--como` → decisión 14; «Ana» → «un cliente».
  - **Rechazado** — Menor: reserva anulada y vuelta a reservar → hoy no hay forma de crear una reserva (`reservar` no guarda nada), así que `anuladas` refleja el estado actual y el caso no puede darse.
- **Rechazado** — Crítico (dominio): el cliente no debe ver quién anuló → el brief y el Intent no lo piden; queda como decisión 7 para que la valides tú.
- **Rechazado** — Importante: «quién anuló» no aporta → decisión 9, lo pide el brief.
- **Rechazado** — Importante: falta la franja → decisión 6, el modelo identifica por sala y día como `cancelar`.
- **Rechazado** — Menor: que el mensaje del cliente remita a `cancelar` → decisión 10.

## Intent

Hoy cualquiera anula cualquier reserva, sin que quede constancia. El responsable de sala debe poder anular las de otros, el cliente no, y se debe poder listar lo anulado con quién lo hizo. Para eso `anular` exige un rol y se añade el comando `anuladas`.

## Scope

- Entra: `anular` con `--como`, y el comando nuevo `anuladas` con quién anuló. Ficheros: `src/app.js` (`voidBooking`, `run` —líneas 20-31— y el nuevo `resetBookings()`) y `test/anular.test.js` (nuevo; cada test llama antes a `resetBookings()`).
- No entra: `cancelar` (`src/app.js:13`, `test/cancel.test.js`), `libres` y `reservar` (su código no cambia), `README.md` (no documenta comandos).

## Dónde se prueba

- `anular` y `anuladas`: por `run('anular', …)` y `run('anuladas', [])`, en `test/anular.test.js`, como `test/cancel.test.js`. Cada escenario del delta, un test.

## Delta de comportamiento

### Capacidad: `reservas`

**ADDED — El responsable anula una reserva**
- GIVEN el estado de partida (tras `resetBookings()`): una sola reserva, Norte del lun en la franja 10:00-12:00, de un cliente, activa; Sur sin reservas; `libres` mira la franja y no el día, como hoy
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun`
- AND `anuladas` responde `Norte lun — anulada por responsable`
- AND `libres 10:00-12:00` responde `Norte, Sur`

**ADDED — El cliente no anula**
- GIVEN el estado de partida
- WHEN `anular Norte lun --como cliente`
- THEN responde `solo el responsable de sala puede anular`
- AND `anuladas` responde `sin anuladas`
- AND `libres 10:00-12:00` responde `Sur`

**ADDED — El rol es obligatorio**
- GIVEN el estado de partida
- WHEN `anular Norte lun`
- THEN responde `rol no válido: use --como cliente|responsable`
- AND `anuladas` responde `sin anuladas`

**ADDED — El rol ha de ser uno de los dos**
- GIVEN el estado de partida
- WHEN `anular Sur mar --como jefe` (reserva inexistente y rol inválido)
- THEN responde `rol no válido: use --como cliente|responsable` (el rol va antes que la existencia)

**ADDED — El permiso va antes que la existencia**
- GIVEN el estado de partida
- WHEN `anular Sur mar --como cliente`
- THEN responde `solo el responsable de sala puede anular`

**ADDED — Anular una reserva inexistente**
- GIVEN el estado de partida
- WHEN `anular Sur mar --como responsable`
- THEN responde `sin reserva Sur mar`

**ADDED — Anular dos veces**
- GIVEN Norte lun ya anulada con `--como responsable`
- WHEN `anular Norte lun --como responsable`
- THEN responde `sin reserva Norte lun`
- AND `anuladas` sigue respondiendo una sola línea, `Norte lun — anulada por responsable`

**ADDED — Anular una reserva ya cancelada**
- GIVEN Norte lun cancelada con `cancelar Norte lun`
- WHEN `anular Norte lun --como responsable`
- THEN responde `sin reserva Norte lun`
- AND `anuladas` responde `sin anuladas`

**ADDED — Listar sin anuladas**
- GIVEN el estado de partida
- WHEN `anuladas`
- THEN responde `sin anuladas`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
