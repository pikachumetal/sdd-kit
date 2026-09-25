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
| 2 | 0024 — Recargo horario (8–14 h, +20 %) | ⏳ |
| 3 | 0022 — Factura quincenal (antes mensual) | ⏳ |
| 4 | 0023 — Bloqueo por impago | ⏳ |

## Enmiendas

### 2026-09-25 — el cliente cambia facturación y tarifa

Decisiones delegadas («no hay nadie a quien preguntar»); revisables por el usuario.

- **Factura**: de mensual a quincenal. Antes: el día 1, reservas del mes anterior. Ahora: el día 1 cubre del 16 al último día del mes anterior; el día 16 cubre del 1 al 15 del mes en curso. Una reserva cuenta en el periodo de su fecha de inicio.
- **Tarifa**: ya no es solo por sala. Las horas entre las 8:00 y las 14:00 valen un 20 % más. Se aplica por hora reservada: una hora cuyo inicio está en [8:00, 14:00) lleva recargo; el resto, no. Una reserva 13–15 h son una hora con recargo y otra sin.
- Ejemplo (Acme, 1–15 de septiembre, factura del 16): 3 h en Norte de 10 a 13 h → 3 × 40 × 1,2 = 144 €; 2 h en Sur de 15 a 17 h → 2 × 25 = 50 €. Total 194 €. (El ejemplo mensual anterior, 170 €, era sin recargo.)
- Impacto en el reparto: 0021 (✅) no se toca; el recargo entra como fila nueva 0024 «tras 0021» y 0022 pasa a ir tras 0024. 0023 sin cambios. Se asume que el plazo de 30 días de impago no cambia.
