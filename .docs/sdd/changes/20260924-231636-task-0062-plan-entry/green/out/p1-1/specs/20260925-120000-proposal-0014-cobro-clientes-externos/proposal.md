---
id: 20260925-120000-proposal-0014-cobro-clientes-externos
proposal: 0014
title: Cobro a clientes externos
source: interview
created: 2026-09-25
---

# Propuesta — Cobro a clientes externos

## Por qué

Los clientes externos alquilan salas y hoy no se les cobra: `salas` solo registra el uso. Se quiere una tarifa por hora distinta en cada sala, una factura mensual por cliente con las reservas del mes y que quien no paga en 30 días no pueda reservar más.

## Reglas de negocio

Petición original: tarifa por hora por sala, factura mensual por cliente, bloqueo a los 30 días sin pagar. El resto son decisiones tomadas al planificar (nadie a quien preguntar); están marcadas con «(decidido)» y se enmiendan si el negocio dice otra cosa.

- Cliente externo (decidido): las reservas del equipo de oficina no se cobran. Solo las reservas hechas con `--cliente <id>` generan cobro. Ejemplo: `salas reservar Norte 10-12 --cliente acme` → cobrable a `acme`; `salas reservar Norte 10-12` → interna, 0 €.
- Tarifa por sala: cada sala tiene su tarifa en €/hora. Ejemplo: Norte 20 €/h, Sur 35 €/h → reservar Sur 10-12 son 2 h × 35 = 70 €.
- Importes (decidido): en céntimos enteros, EUR, sin IVA (el IVA queda fuera de esta propuesta). Ejemplo: 20 €/h → 2000 céntimos/h.
- Tarifa congelada (decidido): la reserva guarda la tarifa vigente al reservar; cambiar la tarifa no afecta a reservas ya hechas. Ejemplo: Norte 20 €/h, `acme` reserva 10-12 el 3 oct; el 5 oct Norte pasa a 25 €/h → esa reserva sigue costando 40 €; una reserva nueva 10-12 cuesta 50 €.
- Sala sin tarifa (decidido): no se puede reservar para un cliente externo. Ejemplo: Este sin tarifa, `salas reservar Este 10-12 --cliente acme` → error «la sala Este no tiene tarifa».
- Factura mensual: una por cliente y mes natural, con las reservas de ese mes (por fecha de la reserva, no de creación), una línea por reserva. Ejemplo: `acme` en octubre reserva Norte 2 h a 20 €/h (3 oct) y Sur 1 h a 35 €/h (9 oct) → factura de octubre: 2 líneas, total 40 € + 35 € = 75 €.
- Reservas canceladas (decidido): no se facturan. Ejemplo: `acme` cancela la de Sur del 9 oct → factura de octubre: 1 línea, 40 €.
- Mes sin reservas (decidido): no se emite factura. Ejemplo: `beta` sin reservas en octubre → no hay factura de `beta` de octubre.
- Emisión y numeración (decidido): se emite con `salas facturar <mes>` (manual; sin cron), es idempotente y su número es `FAC-<yyyyMM>-<cliente>`. Ejemplo: `salas facturar 2026-10` dos veces → una sola `FAC-202610-acme`.
- Vencimiento (decidido): 30 días naturales desde la emisión; la factura se marca pagada con `salas pagar <número>`. Ejemplo: emitida el 2026-11-02 → vence el 2026-12-02.
- Bloqueo por impago: un cliente con alguna factura sin pagar pasado su vencimiento no puede reservar. Las reservas ya hechas se mantienen y se siguen facturando. Ejemplo: `FAC-202610-acme` emitida el 2026-11-02, vence el 2026-12-02 → el 2026-12-02 `acme` aún puede reservar; el 2026-12-03 `salas reservar Norte 10-12 --cliente acme` → error «cliente bloqueado por impago: FAC-202610-acme».
- Desbloqueo (decidido): al pagar (`salas pagar`) la última factura vencida, el cliente puede reservar de nuevo en el acto. Ejemplo: `acme` bloqueado, `salas pagar FAC-202610-acme` → puede reservar.
- Persistencia (decidido): ficheros CSV en `data/`, como `usage.csv`.

## Capacidades que toca

- `client-billing` — nueva: clientes, reservas cobrables, tarifas congeladas.
- `room-rates` — nueva: tarifa por sala.
- `invoicing` — nueva: facturas mensuales, pago y vencimiento.
- `booking` — bloqueo de clientes morosos y sala sin tarifa al reservar.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0015 | Clientes externos y reservas a su nombre (`--cliente`) | — |
| 2 | 0016 | Tarifa por hora de cada sala, congelada en la reserva | — |
| 3 | 0017 | Factura mensual por cliente (`salas facturar <mes>`) | 0015, 0016 |
| 4 | 0018 | Pago de facturas (`salas pagar`) y vencimiento a 30 días | 0017 |
| 5 | 0019 | Bloqueo de reservas por impago | 0018 |

0015 y 0016 son independientes y pueden hacerse en paralelo por dos personas: tocan ficheros distintos.

## Acta

No aplica: entrevista.

## Enmiendas

_Ninguna._
