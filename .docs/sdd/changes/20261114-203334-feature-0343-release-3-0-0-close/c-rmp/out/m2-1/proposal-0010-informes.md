---
id: 20261114-231021-proposal-0010-informes
proposal: 0010
title: Módulo de informes de ocupación
source: interview
created: 2026-11-14
---

# Propuesta — Módulo de informes de ocupación

## Por qué

El cliente quiere saber cuánto se usa cada sala, llevarse esos datos a Excel y que los responsables reciban un resumen cada semana sin pedirlo. Hoy `src/app.js` solo lista salas libres y reserva o cancela: no hay ningún informe. El cliente delegó los detalles («decide tú»); las decisiones de abajo son del agente y quedan abiertas a enmienda.

## Reglas de negocio

- Ocupación de una sala en una semana = horas reservadas ÷ horas disponibles. La semana es de lunes a viernes, de 08:00 a 20:00 (60 h por sala). Ejemplo: Norte con una reserva lun 10:00-12:00 → 2 h ÷ 60 h = 3,3 %; Sur sin reservas → 0 %.
- El informe cubre la semana indicada (lunes de inicio); sin indicarla, la semana natural anterior. Ejemplo: se pide el viernes 2026-11-13 sin fecha → informe del 2026-11-02 al 2026-11-06.
- Una reserva semanal (`--cada-semana`) cuenta en todas las semanas. Ejemplo: Norte lun 10:00-12:00 semanal → 2 h en cada semana consultada.
- El Excel es un `.xlsx` real, una fila por sala (sala, horas reservadas, horas disponibles, % de ocupación) y una fila de total. Ejemplo: `informe --xlsx ocupacion.xlsx` con Norte 2 h y Sur 0 h → dos filas de sala más el total (2 h de 120 h, 1,7 %).
- El aviso semanal se envía los lunes a las 08:00 a los responsables de cada sala, con el informe de la semana anterior. Ejemplo: lunes 2026-11-09 → correo a los responsables de Norte y de Sur con la semana del 2026-11-02 al 2026-11-06; cada responsable recibe solo las salas que tiene asignadas.
- Los responsables y sus salas se declaran en un fichero de configuración del proyecto (sala → lista de correos). Ejemplo: `{"Norte": ["ana@ejemplo.com"]}` → Ana recibe Norte y no Sur. Una sala sin responsable no genera envío y se avisa por consola.
- El envío lo lanza un planificador externo del servidor (cron) con el comando de informe, no un proceso residente, porque la app es una CLI sin demonio.

## Capacidades que toca

- `informe-ocupacion` — nueva: cálculo y comando del informe.
- `exportar-excel` — nueva: salida `.xlsx` del informe.
- `aviso-semanal` — nueva: envío periódico a responsables; reutiliza el correo de la 0008.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0011 | Informe de ocupación por sala | — |
| 2 | 0012 | Exportar el informe a Excel | 0011 |
| 3 | 0013 | Aviso semanal a los responsables | 0011, 0012, 0008 |

## Acta

No aplica: entrevista

## Enmiendas

