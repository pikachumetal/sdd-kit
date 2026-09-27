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
| 2 | 0022 — Factura mensual | ⏳ |
| 3 | 0023 — Bloqueo por impago | ⏳ |
