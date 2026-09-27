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
XX

## Enmiendas

- 2026-09-25 — Tarifa: solo por sala (Norte 40 €/h, Sur 25 €/h) → por sala y franja; las horas de 8:00 a 14:00 cuestan un 20 % más (Norte 48 €/h, Sur 30 €/h) y el resto sigue al precio base. Ejemplo: Acme reserva Norte de 13:00 a 15:00 → 13-14 h a 48 € + 14-15 h a 40 € = 88 €; Sur de 9:00 a 10:00 → 30 €. Una reserva que cruza el límite se factura por horas, cada hora con su tarifa. La franja es [8:00, 14:00): las 14:00 ya no llevan recargo. Pedido por el cliente — re-parte: nueva 0024 (0021 está ✅ y no se reabre).
- 2026-09-25 — Factura: mensual (el día 1, reservas del mes anterior) → quincenal. El día 1 cubre las reservas del 16 al último día del mes anterior; el día 16 cubre las del 1 al 15 del mes en curso. Ejemplo: factura del 16 de septiembre de Acme con Norte 13-15 el 3 de septiembre y Sur 9-10 el 10 de septiembre → 88 € + 30 € = 118 €. Sustituye el ejemplo mensual de 170 € (que no incluye recargo). Pedido por el cliente — re-parte: 0022 (pendiente), ahora tras 0024.
- 2026-09-25 — Impago: sin cambio; los 30 días se cuentan desde la fecha de emisión de cada factura quincenal (decisión tomada sin dev-lead, a validar). 0023 sigue tras 0022.
- 2026-09-25 — Decisiones tomadas sin nadie a quien preguntar: (a) el recargo se calcula por hora reservada, no por hora de inicio; (b) fechas de emisión fijas 1 y 16 aunque sean festivo o fin de semana; (c) 0022 no se emite hasta que exista 0024, para no facturar con tarifa vieja.
