---
id: 20261114-100000-proposal-0013-informes
proposal: 0013
title: Módulo de informes
source: interview
created: 2026-11-14
---

# Propuesta — Módulo de informes

## Por qué

El cliente quiere saber cuánto se usa cada sala, sacar esos datos a Excel y que los responsables de cada sala reciban un resumen sin tener que pedirlo. Hoy solo se puede ver qué salas están libres en una franja (`libres`). El cliente dejó los detalles a nuestro criterio: las decisiones de abajo las tomó el agente (perfil delegate) y se confirman o corrigen por «Enmiendas».

## Reglas de negocio

- Ocupación de una sala en una semana = horas reservadas / horas disponibles. Horas disponibles: lun–vie de 08:00 a 20:00, es decir 60 h por sala y semana. Ejemplo: Norte con una sola reserva lun 10:00-12:00 → 2 h / 60 h = 3,3 %; Sur sin reservas → 0 h / 60 h = 0,0 %.
- El informe cubre una semana natural (lun–dom); sin indicarla, la última semana completa. Ejemplo: hoy sábado 14-11-2026, `informe` → semana del 2026-11-02 al 2026-11-08; `informe --semana 2026-W44` → semana del 2026-10-26 al 2026-11-01.
- Una reserva fuera de 08:00–20:00 cuenta solo la parte dentro de la ventana. Ejemplo: Sur lun 19:00-21:00 → 1 h reservada (19:00-20:00).
- La exportación es un `.xlsx` real, una fila por sala, con las columnas Sala, Horas reservadas, Horas disponibles, Ocupación (%). Ejemplo: `informe --semana 2026-W44 --excel informe.xlsx` → fichero con 2 filas: `Norte, 2, 60, 3,3` y `Sur, 0, 60, 0,0`.
- El aviso semanal lo recibe el responsable de cada sala, solo con los datos de su sala, los lunes a las 08:00 con la semana anterior. Ejemplo: lunes 2026-11-09 → el responsable de Norte recibe «Norte: 2 h de 60 h (3,3 %) — semana 2026-W45»; el de Sur recibe el suyo.
- Los responsables se configuran por sala en un fichero del proyecto; una sala sin responsable no genera aviso y el comando lo dice. Ejemplo: Sur sin responsable → «Sur: sin responsable, aviso omitido» y el de Norte se envía igual.
- El aviso es un comando (`avisar-semanal`) que lanza el planificador del servidor (cron); la herramienta no deja un proceso residente. Ejemplo: `0 8 * * 1 salas avisar-semanal`.

## Capacidades que toca

- `informe-ocupacion` — nueva: cálculo y salida por consola
- `informe-excel` — nueva: exportación a .xlsx
- `aviso-semanal` — nueva: envío a responsables

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0010 | Informe de ocupación por sala | — |
| 2 | 0011 | Exportar el informe a Excel | 0010 |
| 3 | 0012 | Aviso semanal a los responsables | 0008, 0010, 0011 |

## Acta

No aplica: entrevista.

## Enmiendas

- Sin enmiendas.
