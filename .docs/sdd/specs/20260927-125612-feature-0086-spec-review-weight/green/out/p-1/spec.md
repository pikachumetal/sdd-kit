---
id: 20260926-090000-feature-0010-front-desk-payments
feature: 0010
title: Cobros en recepción
mode: full
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

1. Capacidad nueva `payments` — el cobro tiene reglas propias (quién cobra, cuándo se anula) que no son de la reserva.
2. Rol nuevo «gestor de cobros»: registra y anula cobros — la recepción los consulta, no los registra.
3. El pago se guarda en una columna nueva `paid_at` de `bookings` (migración `db/002-paid-at.sql`, nula para las reservas ya existentes).
4. El portal recibe un campo nuevo `paid` (booleano) en `GET /api/bookings`.
5. Un cobro se anula el mismo día; al día siguiente, solo con un abono.

## Intent

Hoy los cobros se apuntan en una libreta en el mostrador, y al cerrar la caja no cuadran con las reservas. Registrar el cobro en la reserva deja la caja cuadrada y le dice al cliente, en el portal, qué tiene pendiente.

## Scope

- Entra: registrar y anular un cobro (`src/payments.js`, nuevo); el rol gestor de cobros (`src/roles.js`, nuevo); la columna `paid_at` (`db/002-paid-at.sql`); el campo `paid` del portal (`src/api.js`); el aviso de pendiente en el buscador del mostrador (`src/search.js`); el cierre de caja del día (`src/cash.js`, nuevo).
- No entra: abonos; pagos en el portal; facturación.

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

### Capacidad: `bookings`

**MODIFIED — Búsqueda por cliente**
- GIVEN reservas de varios clientes, alguna sin pagar
- WHEN el recepcionista escribe parte del nombre del cliente
- THEN ve las reservas cuyo cliente contiene ese texto, sin distinguir mayúsculas, y las no pagadas llevan «Pendiente de cobro»

**MODIFIED — El portal del cliente lista sus reservas**
- GIVEN un cliente con reservas, alguna pagada
- WHEN el portal pide `GET /api/bookings`
- THEN recibe cada reserva con `code`, `customer`, `day`, `start` y `paid`

## Enmiendas

## Decisiones tomadas con el dev-lead

- 2026-09-27: <git-user> aprueba la spec por delegación («apruebo la spec por delegación, nos vemos en la validación»); no revisa el detalle ahora, valida el trabajo en el paso 7.
- Review de spec: ninguna (repaso de coherencia hecho por el agente; delta acotado a dos capacidades, sin revisor externo).

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | <git-user> | 2026-09-27 | aprobada (delegada) |
