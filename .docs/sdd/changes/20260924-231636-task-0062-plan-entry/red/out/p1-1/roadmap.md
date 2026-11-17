# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0012 | Validar el formato de la franja al reservar (`10-12`, no `1012`) | ⏳ |
| 0013 | Aforo de cada sala en `salas libres` | ⏳ |
| 0014 | Clientes externos: `reservar` recibe cliente y fecha; el equipo interno no factura. Base de las cuatro siguientes | ⏳ |
| 0015 | Tarifa por hora distinta por sala (`data/tarifas.csv`) y coste de cada reserva | ⏳ (tras 0014) |
| 0016 | `salas facturar <cliente> <mes>`: una factura mensual por cliente con las reservas del mes | ⏳ (tras 0014, 0015) |
| 0017 | `salas pagar <factura>`: estado de factura pendiente/pagada | ⏳ (tras 0016) |
| 0018 | Bloquear `reservar` al cliente con una factura impagada a más de 30 días | ⏳ (tras 0017) |

### Cobro a clientes externos (0014–0018): decisiones ya tomadas

Sin interlocutor disponible; el dev-lead puede revertirlas al aprobar cada spec.

- Orden fijo: 0014, 0015, 0016, 0017, 0018. 0015 solo depende de la sala, pero 0016 necesita ambas.
- Hoy una reserva no guarda cliente ni fecha; 0014 lo añade. Solo los clientes externos se facturan.
- Moneda EUR; tarifa por hora por sala, sin tramos ni descuentos. Las horas se cobran tal cual (1,5 h = 1,5 × tarifa).
- La factura se emite bajo demanda y congela precios: un cambio de tarifa posterior no la altera. No incluye reservas canceladas.
- Plazo de pago: 30 días naturales desde la emisión. Pasado el plazo, el cliente no puede reservar hasta pagar; pagar levanta el bloqueo. Las reservas ya hechas se mantienen.
- Fuera de alcance: IVA, envío de facturas, pagos parciales, recordatorios de impago.
- Cada task lleva su spec y plan al arrancarla con `sdd-start-task`; no se crean ramas ni carpetas hasta entonces.

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
