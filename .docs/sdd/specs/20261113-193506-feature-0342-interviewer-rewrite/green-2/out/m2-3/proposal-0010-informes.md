---
id: 20261114-100000-proposal-0010-informes
proposal: 0010
title: Módulo de informes
source: interview
created: 2026-11-14
---

# Propuesta — Módulo de informes

## Por qué

El cliente quiere saber cuánto se usan las salas. Hoy solo hay `libres` (qué sala está libre en una franja) y nadie puede ver la ocupación acumulada, llevársela a una hoja de cálculo ni enterarse sin pedirlo. Se quiere un informe de ocupación por sala, exportable a Excel, y un aviso semanal por correo a los responsables.

Los detalles los decidió el agente por delegación («decide tú»): están marcados como *supuesto* y se confirman con el cliente al arrancar la feature que los usa.

## Reglas de negocio

- Horario de apertura *(supuesto)*: lunes a viernes, 08:00-20:00, es decir 60 h disponibles por sala y semana: sala Norte con una reserva lun 10:00-12:00 → 2 h reservadas de 60 h.
- Ocupación de una sala = horas reservadas / horas disponibles de la semana, en % con un decimal: Norte, 2 h de 60 h → 3,3 %; Sur, sin reservas → 0,0 %.
- El informe lista todas las salas, también las que no tienen reservas: con las reservas actuales el informe da `Norte 3,3 %` y `Sur 0,0 %`.
- Una reserva semanal (`--cada-semana`) cuenta en cada semana: Norte con una reserva semanal mar 14:00-16:00 y la de lun → 4 h de 60 h → 6,7 %.
- Una reserva cancelada no cuenta: cancelar lun 10:00-12:00 en Norte → Norte vuelve a 0,0 %.
- El periodo del informe es una semana natural, lunes a domingo; por defecto, la última semana completa.
- La exportación a Excel es un fichero `.xlsx` (no un CSV) con una fila por sala y las columnas `Sala`, `Horas reservadas`, `Horas disponibles`, `Ocupación (%)`: para el caso de arriba, `Norte | 2 | 60 | 3,3` y `Sur | 0 | 60 | 0,0`.
- El aviso semanal sale los lunes a las 08:00 *(supuesto)* con la ocupación de la semana anterior y el `.xlsx` adjunto: el lunes 16 de noviembre llega el informe del 9 al 15.
- Los destinatarios son una lista de correos de responsables en la configuración *(supuesto: no hay un concepto de «responsable» en el producto)*: con `ana@x.com` y `luis@x.com` en la lista, cada uno recibe el mismo correo.
- El aviso lo lanza un programador externo (cron del servidor) llamando a un comando; la herramienta no queda residente.

## Capacidades que toca

Ninguna existe todavía en `capabilities/`: las nuevas se nombran al declararlas en cada feature.

- `informes` — cálculo del informe de ocupación (feature 0011).
- `exportacion-informes` — fichero Excel (feature 0012).
- `aviso-semanal` — envío periódico a los responsables (feature 0013).

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0011 | Informe de ocupación por sala | — |
| 2 | 0012 | Exportar el informe a Excel | 0011 |
| 3 | 0013 | Aviso semanal a los responsables | 0011, 0012, 0008 |

## Acta

No aplica: entrevista.

## Enmiendas

