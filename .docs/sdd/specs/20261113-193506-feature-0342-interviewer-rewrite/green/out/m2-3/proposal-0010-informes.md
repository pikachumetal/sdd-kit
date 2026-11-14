---
id: 20261113-120000-proposal-0010-informes
proposal: 0010
title: Módulo de informes
source: interview
created: 2026-11-13
---

# Propuesta — Módulo de informes

## Por qué

El cliente quiere saber cuánto se usa cada sala, sacar esos datos a Excel y que los responsables reciban un aviso cada semana sin tener que pedirlo. Hoy solo se puede reservar, cancelar y listar salas libres. El cliente dejó los detalles a nuestro criterio: las decisiones de abajo las tomó el desarrollador (delegadas) y conviene confirmarlas con el cliente antes de la feature 0013.

## Reglas de negocio

- **Ocupación por sala y semana** = horas reservadas ÷ horas disponibles de la semana. La semana va de lunes a viernes, de 08:00 a 20:00 (60 h por sala). Ejemplo: Norte con una sola reserva, lun 10:00-12:00 → 2 h / 60 h = 3,3 %; Sur sin reservas → 0 %.
- **Una reserva semanal cuenta en cada semana** en que está activa. Ejemplo: Sur reservada «cada semana» los mié 09:00-10:00 → 1 h / 60 h = 1,7 % en cualquier semana.
- **Una reserva cancelada no cuenta.** Ejemplo: Norte reservó lun 10:00-12:00 y la canceló → Norte 0 %.
- **El informe es de una semana completa**; sin indicarla, la última semana terminada. Ejemplo: se pide el viernes 13-nov sin semana → informe del 2 al 6 de nov.
- **El Excel es un `.xlsx` con una hoja y una fila por sala**: Sala, Horas reservadas, Horas disponibles, Ocupación (%). Ejemplo: Norte 2 / 60 / 3,3; Sur 0 / 60 / 0,0.
- **El aviso semanal lo recibe cada responsable de una lista en un fichero de configuración**, los lunes, con la ocupación de la semana anterior en el cuerpo. Ejemplo: lunes 16-nov, responsables ana@ejemplo.com y luis@ejemplo.com → cada uno recibe el correo «Ocupación 9–13 nov: Norte 3,3 %, Sur 0,0 %».
- **El envío usa el mismo mecanismo de correo que los avisos de la 0008.** La periodicidad la da una tarea programada (cron) del servidor, no el programa.

## Capacidades que toca

- `ocupacion-de-salas` — nueva: el cálculo y el comando.
- `exportacion-excel` — nueva: el fichero `.xlsx`.
- `aviso-semanal` — nueva: lista de responsables y envío.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0011 | Ocupación por sala | — |
| 2 | 0012 | Exportar la ocupación a Excel | 0011 |
| 3 | 0013 | Aviso semanal a los responsables | 0012, 0008 |

## Acta

No aplica: entrevista.

## Enmiendas

Ninguna.
