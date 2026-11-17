---
id: 20261114-100000-proposal-0010-informes
proposal: 0010
title: Módulo de informes
source: interview
created: 2026-11-14
---

# Propuesta — Módulo de informes

## Por qué

El cliente no sabe hoy cuánto se usa cada sala: solo puede consultar las libres en una franja. Quiere un informe de ocupación por sala, poder sacarlo a Excel y que los responsables reciban un aviso semanal. El cliente delegó los detalles («decide tú»): las decisiones de abajo las tomó el agente al planificar y están pendientes de que el cliente las confirme.

## Reglas de negocio

- Ocupación = horas reservadas ÷ horas disponibles del periodo. Las horas disponibles son la jornada de 08:00 a 20:00, de lunes a viernes (12 h/día, 60 h/semana): la sala Norte con una reserva lun 10:00-12:00 en la semana del 16 al 20 de noviembre → 2 h ÷ 60 h = 3,3 %.
- Una reserva semanal (`--cada-semana`) cuenta en cada semana del periodo en que está vigente: la sala Sur con una semanal mar 09:00-11:00 y un informe del 3 al 23 de noviembre (3 semanas) → 6 h ÷ 180 h = 3,3 %.
- Una reserva cancelada no cuenta: Norte con lun 10:00-12:00 cancelada → 0 h, 0 %.
- El informe cubre un periodo `--desde AAAA-MM-DD --hasta AAAA-MM-DD`; sin ellos, la semana natural anterior: ejecutado el lunes 23 de noviembre → del 16 al 22 de noviembre.
- El informe lista todas las salas, también las sin reservas: Sur sin reservas → «Sur 0,0 %».
- La exportación a Excel es un `.xlsx` con una fila por sala (sala, horas reservadas, horas disponibles, % ocupación) y el periodo en la primera fila: `informe --xlsx ocupacion.xlsx` crea el fichero con las filas Norte y Sur.
- Cada sala tiene un responsable con un correo. El aviso semanal sale los lunes a las 08:00 y lleva, para cada responsable, la ocupación de la semana anterior de **sus** salas: Ana, responsable de Norte, recibe solo la línea de Norte; una sala sin responsable no genera aviso.
- El aviso semanal reutiliza el envío de `src/correo.js` de la 0008; por eso va tras ella.

## Capacidades que toca

- `informes` — nueva: cálculo de ocupación, exportación y aviso (nombre por confirmar al declararla con `capability-template.md`).

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0011 | Informe de ocupación por sala | — |
| 2 | 0012 | Exportar el informe a Excel | 0011 |
| 3 | 0013 | Aviso semanal de ocupación a los responsables | 0012, 0008 |

## Acta

No aplica: entrevista.

## Enmiendas

