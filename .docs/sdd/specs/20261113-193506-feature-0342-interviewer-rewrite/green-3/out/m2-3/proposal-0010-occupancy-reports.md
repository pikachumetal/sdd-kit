---
id: 20261114-100000-proposal-0010-occupancy-reports
proposal: 0010
title: Módulo de informes de ocupación
source: interview
created: 2026-11-14
---

# Propuesta — Módulo de informes de ocupación

## Por qué

El cliente quiere saber cuánto se usa cada sala, llevarse ese dato a Excel y que los responsables lo reciban sin pedirlo. Hoy solo existen `libres` y las reservas; no hay ningún informe. El cliente delegó los detalles («decide tú»): las decisiones de abajo las tomó el agente y quedan a revisión del cliente.

## Reglas de negocio

- **Ocupación semanal por sala** = horas reservadas / horas disponibles de la semana. Horas disponibles: lunes a viernes, 08:00-20:00, es decir 60 h por sala. Ejemplo: Norte con una reserva el lunes 10:00-12:00 → 2 h / 60 h = 3,3 %; Sur sin reservas → 0 %.
- **El informe cubre una semana natural (lunes a domingo)**; sin indicarla, la última semana completa. Ejemplo: el miércoles 2026-11-18 sin parámetros → semana del 2026-11-09 al 2026-11-15. Una reserva en sábado o domingo no cuenta como hora disponible ni reservada.
- **Una reserva semanal (`--cada-semana`) cuenta en cada semana** en que está vigente. Ejemplo: Norte lunes 10:00-12:00 semanal → 3,3 % en cada semana.
- **Exportación a Excel** en formato `.xlsx`, una hoja con una fila por sala y las columnas Sala, Horas reservadas, Horas disponibles, Ocupación (%). Ejemplo: `informe --xlsx ocupacion.xlsx` con el caso anterior → filas `Norte | 2 | 60 | 3,3` y `Sur | 0 | 60 | 0`.
- **Aviso semanal**: cada sala tiene un responsable con su correo; cada lunes a las 08:00 recibe un correo con la ocupación de su(s) sala(s) de la semana anterior y el `.xlsx` adjunto. Ejemplo: Ana es responsable de Norte → el lunes 2026-11-16 08:00 recibe «Norte: 3,3 % (2 h de 60 h)» con el adjunto de la semana 09-15 nov. Una sala sin responsable no genera aviso y se anota en el log.
- **Un fallo de envío no se reintenta en silencio**: queda en el log con sala y responsable, y el resto de avisos se envían. Ejemplo: falla el de Ana → el de Luis sale y el log dice «aviso Norte → ana: error».

## Capacidades que toca

- `room-occupancy` — nueva: cálculo y comando del informe.
- `report-export` — nueva: exportación a `.xlsx`.
- `weekly-occupancy-notice` — nueva: responsables por sala y aviso semanal.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0011 | Informe de ocupación por sala | — |
| 2 | 0012 | Exportar el informe a Excel | 0011 |
| 3 | 0013 | Aviso semanal a los responsables | 0012, 0008 |

## Acta

No aplica: entrevista.

## Enmiendas

- Ninguna.
