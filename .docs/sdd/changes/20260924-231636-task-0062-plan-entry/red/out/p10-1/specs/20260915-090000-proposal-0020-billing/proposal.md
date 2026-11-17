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
- Recargo de franja (cambio del cliente, 2026-09-25): de 8:00 a 14:00 la hora cuesta un 20 % más (Norte 48 €/h, Sur 30 €/h). Una reserva a caballo del límite se cobra por horas: `13-15` en Norte → 48 + 40 = 88 €.
- Factura quincenal (cambio del cliente, 2026-09-25; antes mensual): los días 1 y 16 se emite una factura por cliente. La del 1 cubre del 16 al fin del mes anterior; la del 16, del 1 al 15. Cliente Acme con 3 h en Norte y 2 h en Sur (todas fuera de 8-14 h) del 1 al 15 de agosto → factura del 16 de agosto por 170 €.
- Impago: una factura sin pagar a los 30 días de su emisión bloquea nuevas reservas del cliente.

## Capacidades que toca

`booking` (bloqueo por impago) y una nueva, `billing`.

## Reparto

| Orden | Feature | Estado |
| --- | --- | --- |
| 1 | 0021 — Tarifa por sala | ✅ |
| 2 | 0024 — Recargo de franja horaria | ⏳ |
| 3 | 0022 — Factura quincenal | ⏳ |
| 4 | 0023 — Bloqueo por impago | ⏳ |
