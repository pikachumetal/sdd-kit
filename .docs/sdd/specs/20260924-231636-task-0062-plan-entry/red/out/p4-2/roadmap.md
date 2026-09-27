# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0012 | Validar el formato de la franja al reservar (`10-12`, no `1012`) | ⏸️ aparcada: descartada por Acme (2026-09-25), su calendario ya valida la franja |
| 0013 | Aforo de cada sala en `salas libres` | ⏳ |

## Release 1.3.0

Estado: **en preparación**. Scope decidido sin el usuario tras la reunión con Acme (2026-09-25); sin fecha comprometida y con 🔒 abiertos en 0017.

| id | Task | Origen | Ficheros que toca | Estado |
| --- | --- | --- | --- | --- |
| 0014 | Exportar las reservas a CSV (`salas exportar`). Es lo primero que Acme quiere ver | reunión Acme 2026-09-25 | `src/` (módulo nuevo `export.js`), `data/usage.csv` (lectura) | ⏳ |
| 0015 | Franja mínima de 30 minutos (hoy `10-12`, solo horas enteras). El formato nuevo se decide en su spec; afecta a `informe` y a la deuda de franjas límite | reunión Acme 2026-09-25 | `src/slots.js`, `src/report.js`, `tests/slots.test.js` | ⏳ |
| 0016 | Guardar los asistentes (email) de cada reserva. Prerrequisito de 0017: hoy `reserve` no los recoge | reunión Acme 2026-09-25 | `src/slots.js`, `tests/slots.test.js` | ⏳ |
| 0017 | Avisar por email a los asistentes al cancelar una reserva. Va tras 0016. 🔒 falta el canal de envío (SMTP o servicio) y sus credenciales: las decide/aporta el cliente o la oficina | reunión Acme 2026-09-25 | `src/` (módulo nuevo `notify.js`), `src/slots.js` | ⏳ |

Orden: 0014 primero (petición explícita del cliente), 0015 y 0016 independientes entre sí, 0017 al final. 0014 exporta la franja tal como esté guardada: si 0015 cambia el formato, 0014 se revisa en 0015.

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
