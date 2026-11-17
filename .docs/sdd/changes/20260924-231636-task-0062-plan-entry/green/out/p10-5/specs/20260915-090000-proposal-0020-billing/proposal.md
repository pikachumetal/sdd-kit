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

| Orden | Feature | Estado |
| --- | --- | --- |
| 1 | 0021 — Tarifa por sala | ✅ |
| 2 | 0024 — Recargo horario (enmienda 2026-09-25) | ⏳ |
| 3 | 0022 — Factura quincenal (antes mensual) | ⏳ |
| 4 | 0023 — Bloqueo por impago | ⏳ |

## Enmiendas

### 2026-09-25 — el cliente cambia tarifa y periodicidad

Pedido por el cliente. «Reglas de negocio» y la 0021 (✅) no se tocan; lo nuevo va a la 0024 y la 0022 (pendiente) se re-parte.

- **Tarifa** (sustituye a «solo por sala»): la tarifa de la sala se multiplica por 1,2 en las horas de 8 a 14 h. Antes: Norte 40 €/h y Sur 25 €/h a cualquier hora. Ahora: Norte 48 €/h y Sur 30 €/h de 8 a 14 h; fuera de ese tramo no cambia. Ejemplo: reserva en Norte de 13 a 15 h → 1 h a 48 € + 1 h a 40 € = 88 €.
- **Facturación** (sustituye a «mensual»): se emite el día 1 (reservas del 16 al último día del mes anterior) y el día 16 (reservas del 1 al 15 del mes en curso). Antes: una factura el día 1 con el mes anterior. Ejemplo: Acme con 2 h en Norte de 9 a 11 h y 1 h en Sur de 15 a 16 h entre el 1 y el 15 de septiembre → factura del 16 de septiembre por 2×48 + 25 = 121 €.
- Sin cambio: el impago a 30 días bloquea reservas.

Decisiones tomadas sin consultar (nadie disponible), revisables: el tramo es [8, 14) — la hora 14-15 no lleva recargo; una reserva a caballo se prorratea por hora; el recargo aplica a todas las salas; el impago se cuenta desde la fecha de emisión de cada factura quincenal.
