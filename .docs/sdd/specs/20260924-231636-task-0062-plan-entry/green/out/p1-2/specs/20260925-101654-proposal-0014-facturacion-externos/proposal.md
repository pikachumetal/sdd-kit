---
id: 20260925-101654-proposal-0014-facturacion-externos
proposal: 0014
title: Facturación a clientes externos
source: interview
created: 2026-09-25
---

# Propuesta — Facturación a clientes externos

## Por qué

Clientes externos alquilan salas y hoy no se les cobra: no hay tarifa, ni factura, ni control de impagos. Se quiere una tarifa por hora distinta en cada sala, una factura mensual por cliente con las reservas del mes y bloquear nuevas reservas a quien no paga en 30 días.

Nadie del negocio estaba disponible: las reglas marcadas «(decidido)» son supuestos del equipo técnico, para confirmar con el negocio antes de facturar en real. Cambiarlas va a «Enmiendas».

## Reglas de negocio

- Cliente externo (decidido): las reservas del equipo de oficina no se facturan; solo las de un cliente externo, identificado por id y nombre. Ejemplo: reserva de Norte 10-12 a nombre del cliente «Acme» → facturable; la misma reserva sin cliente (oficina) → no aparece en ninguna factura.
- Tarifa por sala: cada sala tiene su tarifa en €/hora. Ejemplo: Norte 30 €/h, Sur 20 €/h; Acme reserva Norte 2 h y Sur 1,5 h → 60 € + 30 € = 90 €.
- Tarifa congelada al reservar (decidido): la reserva guarda la tarifa vigente al crearla; un cambio posterior no afecta a reservas ya hechas. Ejemplo: Norte 30 €/h, Acme reserva Norte 2 h el 3 de octubre; el 10 de octubre Norte pasa a 35 €/h → esa reserva sigue costando 60 €.
- Sala sin tarifa (decidido): no se puede reservar para un cliente externo. Ejemplo: sala Este sin tarifa, Acme intenta reservar Este 10-12 → error «sala sin tarifa».
- Factura mensual: una por cliente y mes natural, con todas las reservas del cliente cuya fecha cae en ese mes y su importe; total = suma de líneas. Ejemplo: Acme en octubre, Norte 2 h a 30 y Sur 1,5 h a 20 → 2 líneas, total 90 €; en noviembre sin reservas → no se emite factura.
- Reservas canceladas (decidido): no se facturan. Ejemplo: Acme cancela Norte 2 h antes de fin de mes → no está en la factura de octubre.
- Sin IVA ni impuestos (decidido): los importes son base imponible; el IVA queda fuera de esta propuesta.
- Emisión (decidido): la factura se genera con `salas facturar <mes>` (p. ej. `2026-10`) y es idempotente: repetir el comando no crea otra factura ni cambia una ya emitida. Cada factura tiene fecha de emisión y número único.
- Vencimiento: una factura vence a los 30 días naturales de su emisión. Ejemplo: emitida el 1 de noviembre → vence el 1 de diciembre.
- Pago (decidido): se registra a mano con `salas pagar <factura>`, con fecha de pago; sin pasarela de pago.
- Bloqueo por impago: un cliente con alguna factura sin pagar pasados 30 días desde su emisión no puede reservar. Ejemplo: factura emitida el 1 de noviembre sin pagar → el 1 de diciembre aún reserva; el 2 de diciembre `salas reservar` le responde error «cliente con factura vencida». Al pagarla, reserva de nuevo.
- Bloqueo solo afecta a reservas nuevas (decidido): las ya hechas se mantienen y se pueden cancelar.

## Capacidades que toca

- `external-clients` — nueva: alta de clientes y reservas a su nombre.
- `room-rates` — nueva: tarifa por hora de cada sala.
- `monthly-invoicing` — nueva: factura mensual por cliente.
- `invoice-payments` — nueva: registro de pago y vencimiento.
- `booking-block` — nueva: bloqueo de reservas por impago.
- `room-booking` — existente (`reservar`, `cancelar`): reciben cliente y tarifa; `informe` no cambia.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0015 | Clientes externos y reservas a su nombre | — |
| 2 | 0016 | Tarifa por hora por sala (congelada en la reserva) | 0015 |
| 3 | 0017 | Factura mensual por cliente (`salas facturar`) | 0016 |
| 4 | 0018 | Registro de pago y vencimiento a 30 días | 0017 |
| 5 | 0019 | Bloqueo de reservas por factura vencida | 0018 |

## Acta

No aplica: entrevista.

## Enmiendas

_Ninguna._
