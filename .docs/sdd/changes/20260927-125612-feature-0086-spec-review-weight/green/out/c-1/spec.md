---
id: 20260926-090000-feature-0010-front-desk-payments
feature: 0010
title: Cobros en recepción
mode: full
status: draft
created: 2026-09-26
author: agente
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Cobros en recepción

## Capacidades

- Nuevas: `payments` — el cobro de una reserva en recepción y quién puede registrarlo
- Modificadas: `bookings` — la búsqueda y el portal muestran si la reserva está pagada

Review de spec propuesta: un revisor, los siete puntos (paralelismo restringido + spec delegada) — señales: capacidad nueva (`payments`), contrato público (`GET /api/bookings` añade `paid`, lo consume el portal), MODIFIED (dos requisitos de `bookings`), datos/migración (columna `paid_at`, `db/002-paid-at.sql`), reglas de visibilidad (rol «gestor de cobros»: registra y anula, la recepción solo consulta) · tamaño: ~90 líneas en 6 ficheros
- Dominio+técnica (un revisor, los siete puntos): si «gestor de cobros» declara también qué NO puede hacer o ver la recepción; si `paid_at` y `paid` quedan consistentes entre migración, API y capacidad; si la búsqueda por cliente tiene más de una entrada en el código
- Mínimo razonable: ninguno — con 5 señales, bajar a cero revisores deja sin mirar el complemento del rol nuevo, el hueco que no se ve hasta que alguien accede a lo que no debía

1. Capacidad nueva `payments` — el cobro tiene reglas propias (quién cobra, cuándo se anula) que no son de la reserva.
2. Rol nuevo «gestor de cobros»: registra y anula cobros — la recepción los consulta, no los registra.
3. El pago se guarda en una columna nueva `paid_at` de `bookings` (migración `db/002-paid-at.sql`, nula para las reservas ya existentes).
4. El portal recibe un campo nuevo `paid` (booleano) en `GET /api/bookings`.
5. Un cobro se anula el mismo día; al día siguiente, solo con un abono.
6. La búsqueda por cliente tiene dos entradas en el código: `src/search.js` (buscador del mostrador, la que toca esta feature) y `src/phone.js` (ficha de llamada, capacidad de teléfono, no tocada aquí) — mismo filtro, «Pendiente de cobro» solo en la del mostrador.
7. `paid_at` viaja como cualquier otra columna de `bookings`: si una reserva se importa a la otra sede, su `paid_at` se copia igual que `code` o `customer` — no hay regla especial de sede para el cobro.
8. La recepción ve la etiqueta «Pendiente de cobro» en la búsqueda, pero no ve el importe ni la hora del cobro ni el cierre de caja: esas pantallas son solo del gestor de cobros.
9. El cierre de caja es una consulta en el momento (no un registro que se guarda); no hay «cierre ya emitido» que una anulación del mismo día pueda descuadrar — la siguiente consulta ya sale con el total correcto.
10. «Gestor de cobros» es un rol aditivo: se asigna a un recepcionista ya existente, no lo sustituye. El alta se hace a mano (fuera de esta feature, sin pantalla de administración).
11. «Solo con un abono» es un texto informativo: esta feature no implementa abonos, ninguna lógica de abono ni pantalla asociada — solo señala que la anulación pasado el día no está disponible aquí.

### Hallazgos de la review

- **Rechazado** — MODIFIED en «Búsqueda por cliente» y en «El portal…» debería ser ADDED porque el GIVEN/WHEN/THEN base no cambia → MODIFIED es el rótulo correcto: ambos son requisitos ya existentes en `bookings.md` cuyo THEN se amplía (una cláusula más en el mismo THEN); ADDED se reserva a requisitos que no existían.
- **Aceptado** — «Solo con un abono» referencia un concepto (abono) que no está definido en ningún sitio y que está fuera de alcance → decisión 11: el texto es informativo, sin lógica de abono detrás.
- **Aceptado** — `paid_at` no dice en qué sede vive ni si viaja en la importación entre sedes, chocando con la regla de producto de la constitution → decisión 7.
- **Aceptado** — el rol «gestor de cobros» no dice qué NO ve ni NO puede hacer la recepción → decisión 8.
- **Aceptado** — no se dice si el cierre de caja es inmutable y qué pasa si se anula un cobro tras cerrarlo → decisión 9 y THEN añadido en «El cierre de caja suma los cobros del día».
- **Aceptado** — no se dice si «gestor de cobros» es aditivo o excluyente respecto a «recepcionista», ni cómo se asigna → decisión 10 y línea nueva en Scope («No entra»).
- **Rechazado** — mismo argumento que el primer hallazgo, aplicado a «El portal del cliente lista sus reservas» → mismo motivo: MODIFIED correcto para un requisito existente que amplía su THEN.
- **Aceptado** — Scope no aclaraba que el portal es solo lectura del estado de cobro → línea añadida en Intent.

## Intent

Hoy los cobros se apuntan en una libreta en el mostrador, y al cerrar la caja no cuadran con las reservas. Registrar el cobro en la reserva deja la caja cuadrada y le dice al cliente, en el portal, qué tiene pendiente (el portal solo lee el estado; no se paga desde ahí).

## Scope

- Entra: registrar y anular un cobro (`src/payments.js`, nuevo); el rol gestor de cobros (`src/roles.js`, nuevo); la columna `paid_at` (`db/002-paid-at.sql`); el campo `paid` del portal (`src/api.js`); el aviso de pendiente en el buscador del mostrador (`src/search.js`); el cierre de caja del día (`src/cash.js`, nuevo).
- No entra: abonos; pagos en el portal; facturación; el aviso de pendiente en la ficha de llamada (`src/phone.js` — capacidad de teléfono, no se toca en esta feature); pantalla de administración de roles (el alta de «gestor de cobros» se hace a mano).

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
- AND es una consulta en el momento, no un registro guardado: si se anula un cobro de hoy después de haber cerrado caja, la siguiente consulta ya sale con el total sin ese cobro

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

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
