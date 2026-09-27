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

Review de spec propuesta: un revisor (siete puntos) — señales: capacidad nueva (`payments`), contrato público (`GET /api/bookings` lo consume el portal), MODIFIED (dos requisitos de `bookings`), datos/migración (`paid_at`, `db/002-paid-at.sql`), área no explorada (código de `src/` no leído hasta este repaso), rol nuevo con regla de visibilidad (gestor de cobros registra/anula, recepción solo consulta) · tamaño: ~40 líneas de spec y 6 ficheros de código (3 nuevos, 3 modificados)
- Dominio: si el rol «gestor de cobros» declara también qué NO puede hacer y qué pasa con una reserva importada de otra sede (señal: rol nuevo + MODIFIED)
- Técnica: si el campo `paid` del portal queda definido para las reservas antiguas (`paid_at` nulo) y si el contrato existente se rompe al añadirlo (señal: contrato público + datos)
- Mínimo razonable: ninguno — con seis señales, contrato público y datos a la vez, bajar a cero review deja sin cubrir el hueco de visibilidad del rol nuevo
- Paralelismo restringido: la spec va aprobada por delegación y las instrucciones del usuario piden confirmar antes de paralelizar → decido un revisor con los siete puntos, sin preguntar ni despachar dos

1. Capacidad nueva `payments` — el cobro tiene reglas propias (quién cobra, cuándo se anula) que no son de la reserva.
2. Rol nuevo «gestor de cobros»: registra y anula cobros — la recepción los consulta, no los registra. La recepción conserva el resto de su acceso (buscar y ver reservas); lo único que pierde es registrar o anular un cobro. El gestor de cobros no gana acceso a nada de recepción que no tuviera ya.
3. El pago se guarda en una columna nueva `paid_at` de `bookings` (migración `db/002-paid-at.sql`, nula para las reservas ya existentes). Una reserva importada de otra sede llega también con `paid_at` nulo: el pago se registra en la sede que atiende al cliente, no viaja con la importación.
4. El portal recibe un campo nuevo `paid` (booleano) en `GET /api/bookings`: `true` si `paid_at` tiene valor, `false` si es nulo (incluidas las reservas ya existentes). Es un campo aditivo — no cambia ni quita ninguno de los que ya recibía el portal.
5. Un cobro se anula el mismo día; al día siguiente, solo con un abono. «Mismo día» es la fecha natural del servidor: las dos sedes están en el mismo huso horario, no hay conversión que hacer.
6. El cierre de caja es una consulta, no un estado: cerrarla no bloquea nuevos cobros ni anulaciones, y repetirla el mismo día sencillamente vuelve a sumar los cobros del día.

### Hallazgos de la review

1. **Aceptado** — el MODIFIED de "Búsqueda por cliente" sustituye el THEN vigente sin declararlo como tal → añadido "(antes: ...)" al título del MODIFIED en el delta, con la cláusula que cambia.
2. **Aceptado** — no se aclaraba qué pasa con `paid_at` en una reserva importada de otra sede → decisión 3 ampliada: llega con `paid_at` nulo, no viaja con la importación.
3. **Aceptado (parcial)** — "mismo día" no definía qué es "hoy" → decisión 5 ampliada: fecha natural del servidor, mismo huso en las dos sedes. Rechazo la parte de "no verificable sin huso horario": la misión describe dos sedes de un mismo centro sin indicio de zonas horarias distintas.
4. **Aceptado** — el rol «gestor de cobros» solo se describía por lo que hace → decisión 2 ampliada con lo que no cambia para recepción y lo que no gana el gestor de cobros.
5. **Aceptado** — faltaba la sección «Reglas de la capacidad» para los nombres nuevos (`paid_at`, «Pendiente de cobro», «Solo con un abono», cierre de caja, `paid`) → añadida en el delta de `payments`.
6. **Rechazado** — la anulación "mismo día / con abono al día siguiente" ya está en la decisión 5, precisamente para que el dev-lead la valide; no es un hecho consumado sin marcar, es el mecanismo normal de esta sección.
7. **Aceptado** — el Intent prometía "decirle al cliente qué tiene pendiente" en el portal y el Scope solo cubría el aviso del mostrador → añadido a "No entra" que el portal solo expone el booleano, sin texto ni diseño del aviso.
8. **Rechazado** — `paid` es un campo añadido, no sustituye ni renombra ninguno de los que ya recibía el portal: no rompe a los consumidores actuales.
9. **Aceptado** — no se decía si el cierre de caja bloquea cobros posteriores o qué pasa si se repite → decisión 6 nueva: es una consulta, no un estado, se puede repetir sin efecto.
10. **Aceptado** — no se decía qué valor de `paid` reciben las reservas antiguas → decisión 4 ampliada: `false` cuando `paid_at` es nulo.

### Decisiones tomadas con el dev-lead

- Aprobación de la spec por delegación — «apruebo la spec por delegación, nos vemos en la validación»

## Intent

Hoy los cobros se apuntan en una libreta en el mostrador, y al cerrar la caja no cuadran con las reservas. Registrar el cobro en la reserva deja la caja cuadrada y le dice al cliente, en el portal, qué tiene pendiente.

## Scope

- Entra: registrar y anular un cobro (`src/payments.js`, nuevo); el rol gestor de cobros (`src/roles.js`, nuevo); la columna `paid_at` (`db/002-paid-at.sql`); el campo `paid` del portal (`src/api.js`); el aviso de pendiente en el buscador del mostrador (`src/search.js`); el cierre de caja del día (`src/cash.js`, nuevo).
- No entra: abonos; pagos en el portal; facturación; el texto o diseño con que el portal muestra `paid` al cliente (vive fuera de este repo).

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
- AND cerrar la caja no cambia el estado de los cobros ni bloquea nuevos cobros o anulaciones: se puede repetir el mismo día y vuelve a sumar los cobros del día

**Reglas de la capacidad**
- **Dónde viven los datos**: el pago vive en `paid_at` de la propia reserva (`bookings`), no en una tabla aparte; una reserva importada de otra sede llega con `paid_at` nulo.
- **Idioma de los nombres**: castellano en los avisos visibles («Pendiente de cobro», «Solo con un abono»); inglés en el código (`paidAt`, `paid`).
- **Límites**: un cobro solo se anula el mismo día natural del servidor (las dos sedes comparten huso horario); pasado ese día, no hay forma de anular sin un abono (fuera de esta feature).
- **Avisos**: «Pendiente de cobro» en el buscador del mostrador para una reserva sin pagar; «Solo con un abono» al intentar anular un cobro de un día anterior.
- **Regla ante conflicto**: no aplica — no hay dos acciones que compitan por el mismo cobro en esta feature.

### Capacidad: `bookings`

**MODIFIED — Búsqueda por cliente** (antes: "ve las reservas cuyo cliente contiene ese texto, sin distinguir mayúsculas")
- GIVEN reservas de varios clientes, alguna sin pagar
- WHEN el recepcionista escribe parte del nombre del cliente
- THEN ve las reservas cuyo cliente contiene ese texto, sin distinguir mayúsculas, y las no pagadas llevan «Pendiente de cobro»

**MODIFIED — El portal del cliente lista sus reservas** (antes: "recibe cada reserva con `code`, `customer`, `day` y `start`")
- GIVEN un cliente con reservas, alguna pagada y alguna anterior a esta feature (sin `paid_at`)
- WHEN el portal pide `GET /api/bookings`
- THEN recibe cada reserva con `code`, `customer`, `day`, `start` y `paid`: `true` si tiene `paid_at`, `false` si no lo tiene

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | <git-user> | 2026-09-27 | aprobada por delegación — «apruebo la spec por delegación, nos vemos en la validación» |
