---
id: 20260925-110657-proposal-0014-reunion-acme
proposal: 0014
title: Reunión con Acme (2026-09-25)
source: meeting
created: 2026-09-25
---

# Propuesta — Reunión con Acme (2026-09-25)

## Por qué

Acme alquila salas como cliente externo. En la reunión pidió poder sacar sus reservas en CSV (lo primero que quiere ver), avisar por email a los asistentes al cancelar y una franja mínima de 30 minutos. Descartó validar el formato de la franja (0012): lo hace su calendario.

## Reglas de negocio

- Exportación CSV: `salas exportar <mes>` escribe `mes,sala,franja,estado` con una fila por reserva (canceladas incluidas, con `estado=cancelada`). Ej.: reservas `A 10-12` activa y `B 14-15` cancelada en 2026-09 → `2026-09,A,10-12,activa` y `2026-09,B,14-15,cancelada`.
- Franja mínima de 30 minutos: la duración de una reserva es ≥ 30 min. Ej.: `10:00-10:30` → aceptada; `10:00-10:15` → rechazada con error. `10-12` sigue siendo válida.
- Aviso al cancelar: al cancelar una reserva se envía un email a cada asistente. Ej.: reserva `A 10-12` con asistentes `ana@acme.com, luis@acme.com`, `salas cancelar A 10-12` → 2 emails, uno por dirección. Sin asistentes, no se envía nada.
- Asistentes: `salas reservar <sala> <franja> --asistentes a@x,b@y` (opcional) guarda las direcciones con la reserva. Ej.: la reserva anterior guarda 2 direcciones.

## Capacidades que toca

- `booking-export` — nueva: exportación CSV.
- `booking-slots` — duración mínima de franja.
- `booking-cancellation` — aviso a los asistentes; `booking` gana el dato de asistentes.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0015 | Exportar reservas a CSV | — |
| 2 | 0016 | Franja mínima de 30 minutos | — |
| 3 | 0017 | Email a los asistentes al cancelar (incluye captar asistentes al reservar) | — |

## Acta

2026-09-25 · Acme (asistentes no indicados en las notas)

1) Lo de validar la franja (0012) ya no lo quieren, lo hace su calendario; 2) quieren poder exportar las reservas a CSV, y es lo primero que quieren ver; 3) al cancelar una reserva, que se avise por email a los asistentes; 4) la franja mínima pasa a ser de 30 minutos.

## Enmiendas

Ninguna.
