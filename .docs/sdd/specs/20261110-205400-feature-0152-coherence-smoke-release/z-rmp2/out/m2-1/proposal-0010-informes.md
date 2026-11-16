---
id: 20261112-120000-proposal-0010-informes
proposal: 0010
title: Módulo de informes
source: interview
created: 2026-11-12
---

# Propuesta — Módulo de informes

## Por qué

El cliente quiere saber cuánto se usan las salas, sacar esos datos a Excel y que los responsables reciban un aviso semanal. Hoy solo se puede reservar, cancelar y consultar salas libres; no hay forma de ver la ocupación. Los detalles los decidió el agente por delegación («decide tú»), así que el cliente debe confirmarlos.

## Reglas de negocio

- Ocupación de una sala en un periodo = horas reservadas ÷ horas ofertadas, con horario ofertado de 08:00 a 20:00, lunes a viernes (12 h/día): sala Norte con 6 h reservadas en una semana de 5 días (60 h ofertadas) → 10 %.
- El informe se pide por periodo (`--desde`, `--hasta`, ambos incluidos) y por defecto cubre la última semana natural cerrada: hoy jueves 12-nov-2026 → del lunes 2-nov al domingo 8-nov.
- Una reserva semanal (`--cada-semana`) cuenta en cada semana en la que cae: reserva semanal de 2 h en Sur, periodo de 2 semanas → 4 h.
- Una reserva cancelada no cuenta: reserva Norte lun 10:00-12:00 cancelada → 0 h.
- Excel: un fichero `.xlsx` con una hoja y una fila por sala (sala, horas reservadas, horas ofertadas, % ocupación) más una fila de total; nombre `ocupacion-<desde>_<hasta>.xlsx`.
- Aviso semanal: cada lunes a las 08:00 se envía a cada responsable un correo con la ocupación de la semana anterior; el `.xlsx` va adjunto. Responsables: lista de correos en la configuración (`responsables`). Lista vacía → no se envía nada y se registra el motivo.

## Capacidades que toca

- `informes-ocupacion` — nueva: cálculo del informe.
- `informes-excel` — nueva: exportación a `.xlsx`.
- `informes-aviso-semanal` — nueva: envío programado.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0011 | Informe de ocupación por sala | — |
| 2 | 0012 | Exportar el informe a Excel | 0011 |
| 3 | 0013 | Aviso semanal a los responsables | 0012, 0008 |

## Acta

No aplica: entrevista.

## Enmiendas

Ninguna.
