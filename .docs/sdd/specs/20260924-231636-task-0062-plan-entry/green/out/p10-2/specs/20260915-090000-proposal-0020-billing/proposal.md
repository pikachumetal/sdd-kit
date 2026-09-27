---
id: 20260915-090000-proposal-0020-billing
proposal: 0020
title: Facturación a clientes externos
created: 2026-09-15
---

# Propuesta — Facturación a clientes externos

## Por qué

Desde este año alquilamos salas a clientes externos y hoy se factura a mano en una hoja de cálculo.

## Reglas de negocio

- Tarifa por hora distinta para cada sala: Norte 40 €/h, Sur 25 €/h.
- Factura mensual: el día 1 se emite una factura por cliente con las reservas del mes anterior. Cliente Acme con 3 h en Norte y 2 h en Sur en agosto → factura del 1 de septiembre por 170 €.
- Impago: una factura sin pagar a los 30 días bloquea nuevas reservas del cliente.

## Capacidades que toca

`booking` (bloqueo por impago) y una nueva, `billing`.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0021 | Tarifa por sala | — |
| 2 | 0024 | Recargo por franja horaria (enmienda 2026-09-25) | 0021 |
| 3 | 0022 | Factura mensual (pasa a quincenal por la enmienda 2026-09-25) | 0024 |
| 4 | 0023 | Bloqueo por impago | 0022 |

## Enmiendas

- 2026-09-25 — Facturación: mensual el día 1 → quincenal los días 1 y 16. La del 16 cubre las reservas del 1 al 15 del mismo mes; la del 1 cubre las del 16 al último día del mes anterior. Ejemplo: Acme reserva Norte 10-13 el 5 de septiembre y Sur 15-17 el 20 de septiembre → factura del 16 de septiembre con la primera; factura del 1 de octubre con la segunda. Una reserva del día 16 cae en la factura del 1 del mes siguiente — pedido por el cliente — re-parte: 0022 (pasa a quincenal).
- 2026-09-25 — Tarifa: solo por sala → por sala y franja; de 8 a 14 h es un 20 % más cara (franja [8, 14): las 8:00 entran, las 14:00 no; una reserva que cruza el límite se calcula hora a hora). Ejemplo: Norte 10-13 → 3 h × 48 € = 144 €; Sur 15-17 → 2 h × 25 € = 50 €; Acme en un mismo período con ambas → 194 € (antes, 3 h × 40 + 2 h × 25 = 170 €); Sur 13-15 → 1 h × 30 € + 1 h × 25 € = 55 €. Aplica a todas las salas, incluida la tarifa de Sur. Lo pagado en facturas ya emitidas no se recalcula — pedido por el cliente — re-parte: nueva 0024 tras 0021 (0021 está cerrada y no se reabre), 0022 pasa a ir tras 0024. Decisiones tomadas sin consultar por indicación del usuario («decide tú lo que falte»): límites de la franja, prorrateo por hora, sin recálculo de facturas emitidas, reserva del día 16 en la factura del 1 siguiente, impago a 30 días sin cambios.
