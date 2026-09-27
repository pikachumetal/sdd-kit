# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0012 | Validar el formato de la franja al reservar (`10-12`, no `1012`) | ⏳ |
| 0013 | Aforo de cada sala en `salas libres` | ⏳ |
| 0014 | Cobro externos 1/5 — Reservas persistentes con cliente y fecha (`salas reservar <sala> <franja> [--cliente X]`); hoy `reserve` no guarda nada. Tras 0012 (toca el mismo comando) | ⏳ |
| 0015 | Cobro externos 2/5 — Tarifa €/hora por sala en `data/rates.csv` y precio de una reserva (horas × tarifa). Independiente, en paralelo con 0014 | ⏳ |
| 0016 | Cobro externos 3/5 — `salas facturar <mes>`: una factura por cliente con sus reservas del mes. Necesita 0014 y 0015 | ⏳ |
| 0017 | Cobro externos 4/5 — Estado de la factura y `salas pagar <factura>`. Necesita 0016 | ⏳ |
| 0018 | Cobro externos 5/5 — Bloqueo: `reservar` rechaza al cliente con factura impagada a los 30 días. Necesita 0017 | ⏳ |

### Cobro a clientes externos — decisiones comunes (0014–0018)

Tomadas sin dev-lead disponible; revisables en la spec de cada task.

- Cliente externo = reserva con `--cliente`. Sin cliente = equipo de oficina: no se factura ni se bloquea.
- Moneda EUR, tarifa por hora y por sala. La tarifa se congela en la reserva al crearla: cambiar `rates.csv` no altera reservas ya hechas ni facturas emitidas.
- Sin tarifa para una sala, reservar con cliente falla (no se reserva gratis por descuido).
- Factura: mes natural, número `AAAA-MM-<cliente>`, sin IVA ni impuestos (fuera de alcance), una por cliente y mes; refacturar un mes no duplica.
- Cancelar una reserva antes de facturar la excluye; una reserva ya facturada no se cancela.
- «30 días» = 30 días naturales desde la fecha de emisión de la factura. Vencida = impagada pasado ese plazo.
- Bloqueo por cliente (cualquier factura vencida impagada); se levanta al pagarla. Sin recargos ni prórrogas.
- Fuera de alcance: pasarela de pago, envío de facturas por email, PDF, recordatorios de cobro.

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| — | Recordatorio el día antes de una reserva | equipo de oficina |
| — | Reservas recurrentes (cada lunes) | equipo de oficina |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |
| `src/slots.js` no tiene tests de franjas límite (`00-24`) | bajo | task |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-12 | 0011 | `informe` contaba dos veces las reservas canceladas |

## Releases cerradas

### v1.2.0 — 2026-09-10
Informe de uso por sala.
