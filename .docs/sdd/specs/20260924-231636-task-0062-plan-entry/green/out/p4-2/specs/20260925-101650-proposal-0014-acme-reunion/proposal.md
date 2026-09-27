---
id: 20260925-101650-proposal-0014-acme-reunion
proposal: 0014
title: Peticiones de Acme (reunión del 2026-09-25)
source: meeting
created: 2026-09-25
---

# Propuesta — Peticiones de Acme (reunión del 2026-09-25)

## Por qué

Acme alquila salas y pide tres cambios: exportar las reservas a CSV (lo primero que quieren ver), avisar por email a los asistentes cuando se cancela una reserva y una franja mínima de 30 minutos. Su calendario ya valida el formato de la franja, así que la 0012 ya no hace falta.

## Reglas de negocio

- Exportar a CSV: `salas exportar <mes>` escribe una fila por reserva con las columnas `sala,inicio,fin,estado`. Ejemplo: la reserva de Norte de 10:00 a 11:30 el 2026-10-03, cancelada → `Norte,2026-10-03 10:00,2026-10-03 11:30,cancelada`. Las canceladas se incluyen con su estado.
- Aviso de cancelación: al cancelar una reserva se envía un email a cada asistente. Ejemplo: reserva de Sur con asistentes `ana@acme.com` y `luis@acme.com`; se cancela → salen 2 emails, uno a cada dirección, con sala y franja. Una reserva sin asistentes se cancela sin enviar nada.
- Los asistentes se indican al reservar (`--asistentes ana@acme.com,luis@acme.com`), porque hoy `reserve(room, slot)` no los guarda y sin ellos no hay a quién avisar. Opcional: sin `--asistentes` la reserva funciona igual.
- Franja mínima de 30 minutos: `10:00-10:30` se acepta; `10:00-10:15` se rechaza con error. Ejemplo: `salas reservar Norte 10:00-10:15` → error «la franja mínima es de 30 minutos».
- Validar el formato de la franja (`10-12`, no `1012`) deja de ser responsabilidad de la app: lo hace el calendario del cliente.

## Capacidades que toca

- `booking-export` — nueva: exportación de reservas a CSV.
- `cancellation-notice` — nueva: email a los asistentes al cancelar; incluye guardar los asistentes al reservar.
- `slot-rules` — franja mínima de 30 minutos.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0015 | Exportar reservas a CSV | — |
| 2 | 0016 | Email a los asistentes al cancelar | — |
| 3 | 0017 | Franja mínima de 30 minutos | — |

## Acta

2026-09-25 · Acme (cliente) y el equipo de desarrollo; asistentes concretos no anotados.

1) lo de validar la franja (0012) ya no lo quieren, lo hace su calendario; 2) quieren poder exportar las reservas a CSV, y es lo primero que quieren ver; 3) al cancelar una reserva, que se avise por email a los asistentes; 4) la franja mínima pasa a ser de 30 minutos.

Decisiones tomadas sin el cliente (nadie a quien preguntar; a confirmar con Acme): columnas y nombre del comando del CSV, captura de asistentes con `--asistentes` opcional, texto del error, y que la franja mínima la aplica la app aunque el formato lo valide su calendario.

## Enmiendas

Ninguna.
