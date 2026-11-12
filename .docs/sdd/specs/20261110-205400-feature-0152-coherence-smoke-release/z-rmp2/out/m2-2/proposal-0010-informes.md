---
id: 20261112-120000-proposal-0010-informes
proposal: 0010
title: Módulo de informes
source: interview
created: 2026-11-12
---

# Propuesta — Módulo de informes

## Por qué

El cliente no tiene forma de saber cuánto se usa cada sala. Quiere un informe de ocupación por sala, poder llevarlo a Excel y que los responsables de cada sala reciban un aviso semanal sin tener que pedirlo. Los detalles los decidió el equipo por delegación del usuario («decide tú»); están marcados abajo como *decisión tomada* para que el cliente los confirme.

## Reglas de negocio

- Ocupación de una sala = horas reservadas / horas disponibles de la semana. *Decisión tomada:* horas disponibles = lun-vie, 08:00-20:00 (12 h/día, 60 h/semana). Ejemplo: sala Norte con una reserva lun 10:00-12:00 → 2 h / 60 h = 3,3 %.
- El informe se calcula por rango de fechas y por sala; una reserva cancelada no cuenta. Ejemplo: Norte con lun 10:00-12:00 reservada y cancelada → 0 h, 0 %.
- Una reserva semanal (`--cada-semana`) cuenta en cada semana que cae dentro del rango. Ejemplo: Sur, mar 09:00-10:00 semanal, rango de 2 semanas → 2 h / 120 h = 1,7 %.
- Exportación a Excel: un `.xlsx` con una fila por sala y columnas sala, horas reservadas, horas disponibles y % de ocupación. *Decisión tomada:* `.xlsx` y no `.csv`, porque el cliente pidió Excel. Ejemplo: Norte 2 h, 60 h, 3,3 % → fila `Norte | 2 | 60 | 3,3 %`.
- Aviso semanal: cada lunes a las 08:00 cada responsable recibe por correo la ocupación de la semana anterior (lun-dom) de **sus** salas. *Decisión tomada:* cada sala tiene un único responsable con su correo. Ejemplo: Ana es responsable de Norte → el lunes 16 recibe Norte del 9 al 15, sin Sur.
- Una sala sin responsable no genera aviso. Ejemplo: Sur sin responsable → no se envía nada y no es un error.

## Capacidades que toca

- `informe-ocupacion` — nueva: cálculo y consulta.
- `exportacion-excel` — nueva: fichero `.xlsx` del informe.
- `aviso-semanal` — nueva: envío programado a responsables.
- `reservas` — responsable de la sala (dato nuevo).

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0011 | Informe de ocupación por sala | — |
| 2 | 0012 | Exportar el informe a Excel | 0011 |
| 3 | 0013 | Aviso semanal de ocupación a los responsables | 0011, 0008 |

## Acta

No aplica: entrevista

## Enmiendas

(ninguna)
