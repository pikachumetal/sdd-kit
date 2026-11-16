---
id: 20261112-120000-proposal-0010-informes
proposal: 0010
title: Módulo de informes
source: interview
created: 2026-11-12
---

# Propuesta — Módulo de informes

## Por qué

El cliente quiere saber cuánto se usa cada sala sin contar reservas a mano. Hoy `salas` solo reserva, cancela y lista salas libres. Se pide un informe de ocupación por sala, poder exportarlo a Excel y que los responsables reciban un aviso semanal con él. El cliente delegó los detalles («decide tú»): las decisiones de abajo las tomó el agente y quedan a confirmar con el cliente.

## Reglas de negocio

- Ocupación de una sala = horas reservadas ÷ horas disponibles de la semana. Horas disponibles: lunes a viernes, 08:00–20:00, 12 h al día, 60 h por semana. Ejemplo: Norte con `lun 10:00-12:00` → 2 h ÷ 60 h = 3,3 %; Sur sin reservas → 0,0 %.
- El periodo del informe es la semana: las reservas guardan el día de la semana (`lun`), no una fecha. Ejemplo: `salas informe` con las reservas anteriores → `Norte 2 h de 60 h (3,3 %)` y `Sur 0 h de 60 h (0,0 %)`.
- La exportación es un `.xlsx` real, con una fila por sala y las columnas Sala, Horas reservadas, Horas disponibles y Ocupación (%). Sin dependencias externas (operations.md). Ejemplo: `salas informe --xlsx informe.xlsx` → `informe.xlsx` con la fila `Norte | 2 | 60 | 3,3` y `Sur | 0 | 60 | 0,0`.
- Los responsables son una lista de correos en `responsables.json`, en la raíz. Ejemplo: `["ana@cliente.com", "luis@cliente.com"]` → los dos reciben el aviso; con la lista vacía no se envía nada y el comando lo dice.
- El aviso semanal es un comando, `salas informe-semanal`, que envía el informe de la semana por correo a cada responsable; la periodicidad la da el programador del servidor (cron), no la aplicación. Ejemplo: cron del lunes 08:00 ejecuta `salas informe-semanal` → un correo por responsable con el informe de la semana, sala por sala.

## Capacidades que toca

- `informes` — nueva: ocupación por sala, exportación y aviso semanal.
- `correo` — se apoya en la de la fila 0008 (avisos por correo), sin cambiarla.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0011 | Informe de ocupación por sala | — |
| 2 | 0012 | Exportar el informe a Excel | 0011 |
| 3 | 0013 | Aviso semanal a los responsables | 0012, 0008 |

## Acta

No aplica: entrevista.

## Enmiendas

