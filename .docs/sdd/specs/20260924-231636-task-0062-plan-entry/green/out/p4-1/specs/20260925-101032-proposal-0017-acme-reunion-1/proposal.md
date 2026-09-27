---
id: 20260925-101032-proposal-0017-acme-reunion-1
proposal: 0017
title: Cambios pedidos por Acme en la reunión del 2026-09-25
source: meeting
created: 2026-09-25
---

# Propuesta — Cambios pedidos por Acme en la reunión del 2026-09-25

## Por qué

Acme ya gestiona la validez de las franjas con su calendario, así que `salas` no debe validarlas. Piden ver primero la exportación de reservas a CSV, que se avise a los asistentes al cancelar y que la franja mínima baje a 30 minutos.

## Reglas de negocio

- Sin validación de formato de franja (descarta la 0012): `salas reservar Norte 1012` → se acepta tal cual, sin error de formato; la validez la comprueba el calendario de Acme.
- Exportación a CSV con cabecera `room,slot,attendees` y una fila por reserva activa: reservas Norte `10:00-10:30` (ana@acme.com, luis@acme.com) y Sur `11:00-12:00` (sin asistentes) → `Norte,10:00-10:30,ana@acme.com;luis@acme.com` y `Sur,11:00-12:00,`. Las canceladas no salen.
- Al cancelar se envía un email a cada asistente de la reserva: cancelar Norte `10:00-10:30` con asistentes ana@acme.com y luis@acme.com → 2 emails, uno a cada uno; reserva sin asistentes → 0 emails.
- Franja mínima de 30 minutos: `10:00-10:30` → válida; `10:00-10:15` → rechazada por menor de 30 minutos. El formato de horas enteras (`10-12`) sigue valiendo.

## Capacidades que toca

- `csv-export` — nueva.
- `cancellation-notification` — nueva.
- `slot-rules` — franja mínima de 30 minutos.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0014 | Exportar reservas a CSV | — |
| 2 | 0015 | Email a los asistentes al cancelar | — |
| 3 | 0016 | Franja mínima de 30 minutos | — |

Decisiones tomadas sin consulta (no había a quién preguntar), a revisar con Acme:

- Comando de exportación: `salas exportar <mes>`, a stdout, por analogía con `informe <mes>`. Solo reservas activas.
- Las reservas hoy no guardan asistentes: 0015 los añade a `reservar` (`--asistentes a@x,b@y`, opcional). Sin asistentes, no hay email.
- 0014 incluye la columna `attendees` aunque hasta 0015 saldrá vacía.
- Franja de 30 minutos: se admite `HH:MM-HH:MM` con múltiplos de 30 min además de horas enteras.
- 0014 va primero por petición del cliente; 0015 y 0016 quedan tras la 0013, ya pendiente.

## Acta

2026-09-25 · Reunión con el cliente Acme (asistentes no indicados en las notas).

1) lo de validar la franja (0012) ya no lo quieren, lo hace su calendario; 2) quieren poder exportar las reservas a CSV, y es lo primero que quieren ver; 3) al cancelar una reserva, que se avise por email a los asistentes; 4) la franja mínima pasa a ser de 30 minutos.

## Enmiendas

Ninguna.
