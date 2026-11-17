---
id: 20260926-090000-feature-0010-front-desk-payments
feature: 0010
title: Cobros en recepción
mode: full
profile: delegate
status: approved
created: 2026-09-26
author: agente
approvers:
  - role: dev-lead
    name: <git-user>
    approved_at: 2026-09-27
---

# Spec — Cobros en recepción

## Capacidades

- Nuevas: `payments` — el cobro de una reserva en recepción y quién puede registrarlo
- Modificadas: `bookings` — la búsqueda y el portal muestran si la reserva está pagada

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (los siete puntos) — señales: capacidad nueva (`payments`), contrato público (`GET /api/bookings` añade `paid`, lo consume el portal), MODIFIED (dos requisitos de `bookings`), datos (columna `paid_at`, migración `db/002-paid-at.sql`), rol nuevo con reglas de permiso (`gestor de cobros` registra y anula, recepción solo consulta) · tamaño: ~90 líneas en 6 ficheros
- Un revisor, sin paralelizar: la spec va aprobada por delegación y las instrucciones del usuario piden confirmar antes de despachar dos agentes; con 5 señales tocaría recomendar dos revisores, pero la regla de spec delegada baja a uno con los siete puntos, sin preguntar.
- Mínimo razonable: ningún revisor — deja sin mirar el complemento del rol nuevo (qué le queda prohibido a recepción) y si `paid_at` necesita valor por defecto para las reservas ya existentes.

1. Capacidad nueva `payments` — el cobro tiene reglas propias (quién cobra, cuándo se anula) que no son de la reserva.
2. Rol nuevo «gestor de cobros»: registra y anula cobros — la recepción los consulta, no los registra.
3. El pago se guarda en una columna nueva `paid_at` de `bookings` (migración `db/002-paid-at.sql`, nula para las reservas ya existentes).
4. El portal recibe un campo nuevo `paid` (booleano) en `GET /api/bookings`.
5. Un cobro se anula el mismo día; al día siguiente, solo con un abono.
6. `src/phone.js` (`lookupCaller`) filtra reservas por cliente igual que `search.js`, pero es la ficha de llamada, no el buscador del mostrador: lo dejo fuera del Scope con su motivo, no lo sumo al `MODIFIED` de «Búsqueda por cliente».

### Hallazgos de la review

1. **Aceptado** — Crítico · el mensaje «Solo con un abono» cita un mecanismo excluido del Scope como si lo resolviera → añadida «Reglas de la capacidad: `payments`»: el corte es informativo, el abono no se implementa en esta iteración.
2. **Aceptado** — Crítico · «Código de reserva» (capabilities/bookings.md) no se menciona en el delta → añadida línea «Sin cambios — Código de reserva» en la capacidad `bookings`.
3. **Aceptado** — Importante · rol «gestor de cobros» sin su complemento (qué tiene prohibido) → añadida regla: no hereda el resto de funciones de recepción; recepción sin el rol consulta pero no registra ni anula.
4. **Aceptado** — Importante · sin escenario para reservas con `paid_at` nulo tras la migración → añadida regla de derivación en «Reglas de la capacidad: `payments`»: cuentan como no pagadas.
5. **Aceptado** — Importante · tipo y derivación de `paid` sin especificar → cubierto por la misma regla de derivación del punto 4.
6. **Aceptado** — Menor · consumidores de `GET /api/bookings` sin confirmar → añadida línea en Scope: el único consumidor documentado es el portal.
7. **Aceptado** — Menor · cobro sobre una reserva importada (`MAD-R-0042`) sin decidir en qué sede queda → añadida regla: se registra en la sede que cobra; la sincronización entre sedes queda fuera de esta iteración.

### Decisiones tomadas con el dev-lead

- Aprobación de la spec por delegación — «apruebo la spec por delegación, nos vemos en la validación» (elegida en la primera pregunta de `sdd-start-feature`, paso 2).
- Nivel de review de spec — decidido y registrado por el agente, sin preguntar: la spec va delegada y las instrucciones del usuario piden confirmar antes de despachar varios subagentes; con 5 señales tocaba recomendar dos revisores, la regla de spec delegada + paralelismo restringido baja a uno con los siete puntos.

## Intent

Hoy los cobros se apuntan en una libreta en el mostrador, y al cerrar la caja no cuadran con las reservas. Registrar el cobro en la reserva deja la caja cuadrada y le dice al cliente, en el portal, qué tiene pendiente.

## Scope

- Entra: registrar y anular un cobro (`src/payments.js`, nuevo); el rol gestor de cobros (`src/roles.js`, nuevo); la columna `paid_at` (`db/002-paid-at.sql`); el campo `paid` del portal (`src/api.js`); el aviso de pendiente en el buscador del mostrador (`src/search.js`); el cierre de caja del día (`src/cash.js`, nuevo).
- No entra: abonos; pagos en el portal; facturación; el aviso de pendiente en la ficha de llamada (`src/phone.js`, `lookupCaller`) — filtra por cliente igual que `search.js`, pero identifica a quien llama, no resuelve cobros.
- El único consumidor documentado de `GET /api/bookings` es el portal del cliente (no hay otro en `tech-stack.md`).

## Approach

El cobro es un registro sobre la reserva; el cierre de caja suma los cobros del día.

## Delta de comportamiento

### Capacidad: `payments`

**ADDED — El gestor de cobros registra un cobro**
- GIVEN una reserva sin pagar
- WHEN el gestor de cobros registra el cobro
- THEN la reserva queda pagada con la hora del cobro

**ADDED — Un cobro se anula el mismo día**
- GIVEN una reserva pagada hoy
- WHEN el gestor de cobros anula el cobro
- THEN la reserva vuelve a quedar sin pagar
- AND un cobro de un día anterior no se puede anular: la pantalla dice «Solo con un abono»

**ADDED — El cierre de caja suma los cobros del día**
- GIVEN cobros registrados hoy
- WHEN el gestor de cobros cierra la caja
- THEN ve el total del día y el número de cobros

### Reglas de la capacidad: `payments`

- `paid` se deriva de `paid_at`: `paid = (paid_at != null)`. Una reserva migrada con `paid_at` nulo cuenta como no pagada, igual que una reserva nueva sin cobro.
- Corte de anulación: el día natural del cobro (hora del servidor). Pasado ese día la anulación queda bloqueada; el mensaje «Solo con un abono» es informativo — el abono no se implementa en esta iteración (ver Scope).
- Gestor de cobros: solo registra y anula cobros. No hereda el resto de funciones de recepción (buscador, ficha de llamada) más allá de consultar si una reserva está pagada. Recepción sin el rol consulta el estado de pago pero no registra ni anula un cobro.
- Reserva importada de otra sede (`MAD-R-0042`): el cobro se registra en la sede donde se cobra. La sincronización de cobros entre sedes queda fuera de esta iteración.

### Capacidad: `bookings`

**Sin cambios — Código de reserva**: el delta no la toca.

**MODIFIED — Búsqueda por cliente**
- GIVEN reservas de varios clientes, alguna sin pagar
- WHEN el recepcionista escribe parte del nombre del cliente
- THEN ve las reservas cuyo cliente contiene ese texto, sin distinguir mayúsculas, y las no pagadas llevan «Pendiente de cobro»

**MODIFIED — El portal del cliente lista sus reservas**
- GIVEN un cliente con reservas, alguna pagada
- WHEN el portal pide `GET /api/bookings`
- THEN recibe cada reserva con `code`, `customer`, `day`, `start` y `paid`

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | <git-user> | 2026-09-27 | aprobada por delegación: «apruebo la spec por delegación, nos vemos en la validación» |
