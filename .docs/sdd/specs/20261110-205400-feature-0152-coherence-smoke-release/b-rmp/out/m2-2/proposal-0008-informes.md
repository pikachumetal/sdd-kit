---
id: 20261110-100000-proposal-0008-informes
proposal: 0008
title: Módulo de informes de ocupación
source: interview
created: 2026-11-10
---

# Propuesta — Módulo de informes de ocupación

## Por qué

El cliente pide un módulo de informes: ocupación por sala, exportación a Excel y un aviso semanal a los responsables. Hoy `salas` solo reserva, cancela y lista salas libres; no hay forma de saber cuánto se usa cada sala. El cliente dejó los detalles a criterio del desarrollo («decide tú»): las decisiones de abajo las tomó el agente en delegación y están abiertas a enmienda.

## Reglas de negocio

- Horario de referencia: 08:00-20:00 de lunes a viernes, 12 h al día y 60 h por semana y sala; es una constante del informe, no un ajuste. Ejemplo: la sala Norte tiene 60 h disponibles en la semana del 9 al 13 de noviembre.
- Ocupación = horas reservadas / horas disponibles × 100, con un decimal. Ejemplo: Norte con una reserva lun 10:00-12:00 → 2 h de 60 h → 3,3 %; Sur sin reservas → 0 h de 60 h → 0,0 %.
- Una reserva semanal (`--cada-semana`) cuenta en cada semana que cae dentro del periodo. Ejemplo: Norte lun 10:00-12:00 semanal, periodo de 4 semanas → 8 h de 240 h → 3,3 %.
- Una reserva cancelada no cuenta. Ejemplo: Norte lun 10:00-12:00 cancelada → 0 h → 0,0 %.
- El periodo por defecto es la última semana natural cerrada (lunes a domingo); se puede pasar otro con `--desde` y `--hasta`. Ejemplo: hoy miércoles 2026-11-11 → informe del 2026-11-02 al 2026-11-08.
- La exportación a Excel es un CSV que Excel abre sin asistente: UTF-8 con BOM, separador `;`, decimal con coma, cabecera `sala;horas reservadas;horas disponibles;ocupación %`. Ejemplo de línea: `Norte;2;60;3,3`. Un `.xlsx` real exigiría una dependencia o escribir el zip a mano, y el stack es Node sin dependencias; si el cliente lo exige queda como fila de Backlog.
- El aviso semanal lo lanza el cron del servidor, no el programa: `salas aviso-semanal` imprime y envía el informe de la última semana cerrada, y se programa los lunes a las 08:00. Ejemplo: lunes 2026-11-09 08:00 → informe del 2026-11-02 al 2026-11-08.
- Cada sala tiene un responsable (un correo) en `responsables.json`, y recibe solo el informe de su sala. Ejemplo: `{"Norte": "ana@cliente.com"}` → Ana recibe la línea de Norte y no la de Sur. Una sala sin responsable no se avisa y el comando lo dice por la salida de error.
- El aviso depende del envío de correo de la fila 1 («Avisos por correo antes de la reserva»): no se monta un segundo mecanismo de correo.

## Capacidades que toca

- `informes-ocupacion` — nueva: cálculo y listado por sala y periodo.
- `exportacion-informes` — nueva: salida CSV para Excel.
- `aviso-semanal` — nueva: envío periódico a los responsables.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0009 | Informe de ocupación por sala (`salas informe`) | — |
| 2 | 0010 | Exportar el informe a CSV para Excel | 0009 |
| 3 | 0011 | Aviso semanal a los responsables | 0009, 1 |

## Acta

No aplica: entrevista.

## Enmiendas

Sin enmiendas.
