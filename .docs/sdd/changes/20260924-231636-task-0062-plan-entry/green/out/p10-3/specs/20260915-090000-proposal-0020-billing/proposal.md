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

- Tarifa base por hora distinta para cada sala: Norte 40 €/h, Sur 25 €/h.
- Recargo horario: las horas de 8 a 14 h (8 incluida, 14 excluida) cuestan un 20 % más, en todas las salas (Norte 48 €/h, Sur 30 €/h). Una reserva que cruza el límite se factura hora a hora: `13-15` en Norte = 1 h a 48 € + 1 h a 40 € = 88 €.
- Factura quincenal: los días 1 y 16 se emite una factura por cliente. La del día 1 cubre del 16 al último día del mes anterior; la del día 16 cubre del 1 al 15 del mes en curso. Una reserva pertenece al periodo de su fecha. Cliente Acme, del 1 al 15 de septiembre: Norte `10-13` (3 h a 48 €) y Sur `15-17` (2 h a 25 €) → factura del 16 de septiembre por 194 €.
- Impago: una factura sin pagar a los 30 días desde su emisión bloquea nuevas reservas del cliente.

## Capacidades que toca

`booking` (bloqueo por impago) y una nueva, `billing`.

## Reparto

| Orden | Feature | Estado |
| --- | --- | --- |
| 1 | 0021 — Tarifa por sala | ✅ |
| 2 | 0024 — Recargo 8–14 h (+20 %) | ⏳ |
| 3 | 0022 — Factura quincenal (1 y 16) | ⏳ |
| 4 | 0023 — Bloqueo por impago | ⏳ |

## Cambios

- 2026-09-25 — el cliente cambia la facturación de mensual a quincenal (1 y 16) y añade el recargo del 20 % de 8 a 14 h. Decisiones tomadas sin consulta: límites de la franja (8 incl., 14 excl.), prorrateo hora a hora en reservas que cruzan el límite, recargo en todas las salas, reserva asignada por su fecha, plazo de impago contado desde la emisión de cada factura quincenal. Nueva feature 0024 antes de 0022; 0021 se mantiene ✅ (sigue siendo correcta como tarifa base).
