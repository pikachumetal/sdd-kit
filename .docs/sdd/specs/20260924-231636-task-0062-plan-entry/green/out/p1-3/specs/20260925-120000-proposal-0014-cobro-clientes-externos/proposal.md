---
id: 20260925-120000-proposal-0014-cobro-clientes-externos
proposal: 0014
title: Cobro a clientes externos
source: interview
created: 2026-09-25
---

# Propuesta — Cobro a clientes externos

## Por qué

Los clientes externos alquilan salas y hoy no se les cobra. Se quiere tarifa por hora distinta en cada sala, una factura mensual por cliente con las reservas del mes y bloquear nuevas reservas a quien no pague en 30 días. Hoy una reserva no guarda cliente ni fecha (`data/usage.csv` solo tiene `room,duration`), así que primero hay que registrarlos.

No había nadie a quien preguntar: las decisiones marcadas «(decisión)» las tomó quien planificó, en `2026-09-25`, y se pueden enmendar.

## Reglas de negocio

- (decisión) Solo los clientes externos pagan. Las reservas del equipo de oficina no llevan cliente ni tarifa: `salas reservar Norte 10-12` sigue igual; `salas reservar Norte 10-12 --cliente acme` es una reserva de cliente.
- Tarifa por hora por sala, en euros: Norte 20 €/h, Sur 15 €/h. Reserva de Acme en Norte de 2 h → 40 €.
- (decisión) La tarifa se congela al reservar: Acme reserva Sur 2 h a 15 €/h el 3 de marzo; el 10 de marzo Sur pasa a 18 €/h → esa reserva sigue costando 30 €; una reserva nueva del 11 de marzo costaría 36 €. Una sala sin tarifa no admite reserva de cliente.
- Una factura por cliente y mes natural con todas sus reservas del mes. Acme en marzo: Norte 2 h (40 €) + Sur 1,5 h (22,50 €) → factura de 62,50 €. Un mes sin reservas de cliente no genera factura.
- (decisión) Una reserva cancelada no se factura (igual que en el `informe`, patch 0011): Acme reserva Norte 2 h y la cancela → 0 €.
- (decisión) La reserva pertenece al mes de su fecha, no al de su creación: reserva hecha el 28 de febrero para el 2 de marzo → factura de marzo.
- (decisión) Facturar un mes es idempotente y solo con el mes cerrado: `salas facturar 2026-03` el 1 de abril crea las facturas; repetirlo no duplica. No se factura el mes en curso.
- (decisión) Vence a los 30 días naturales de la emisión: emitida el 1 de abril → vence el 1 de mayo. Se paga completa con `salas pagar <factura>`; no hay pagos parciales.
- Bloqueo: cliente con una factura sin pagar pasados 30 días no puede reservar. Acme, factura emitida el 1 de abril sin pagar, el 2 de mayo → `salas reservar Norte 10-12 --cliente acme` falla con mensaje que nombra la factura; el 1 de mayo aún puede.
- (decisión) Pagar desbloquea al instante: Acme paga el 5 de mayo → puede reservar ese mismo día. El bloqueo no afecta a reservas ya hechas ni a otros clientes.
- (decisión) Sin IVA, sin descuentos y una sola moneda (EUR): el total es horas × tarifa, redondeado a céntimos.

## Capacidades que toca

- `booking` — la reserva guarda fecha y cliente opcional.
- `client-rates` — nueva: tarifa por hora de cada sala.
- `invoicing` — nueva: factura mensual, vencimiento y pago.
- `client-blocking` — nueva: bloqueo por impago.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0015 | Reservas con cliente y fecha | — |
| 2 | 0016 | Tarifa por hora por sala | 0015 |
| 3 | 0017 | Factura mensual por cliente | 0016 |
| 4 | 0018 | Pago de facturas | 0017 |
| 5 | 0019 | Bloqueo por impago a 30 días | 0018 |

## Acta

No aplica: entrevista.

## Enmiendas

Ninguna.
