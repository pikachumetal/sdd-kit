---
id: 20261108-171619-proposal-0008-informes
proposal: 0008
title: Módulo de informes
source: interview
created: 2026-11-08
---

# Propuesta — Módulo de informes

## Por qué

El cliente quiere saber cuánto se usa cada sala, llevarse ese dato a Excel y que los responsables lo reciban sin pedirlo. Hoy `src/app.js` solo reserva, cancela y lista salas libres: no hay ningún informe. El usuario delegó los detalles («decide tú»); las decisiones de abajo las tomó el agente y quedan para revisar en «Enmiendas» si alguna no encaja.

## Reglas de negocio

- **Ocupación = horas reservadas / horas disponibles.** La semana disponible va de lunes a viernes, de 08:00 a 20:00 (60 h por sala). Sala Norte con una sola reserva `lun 10:00-12:00` en una semana → 2 h / 60 h = 3,3 %. Sala Sur sin reservas → 0,0 %.
- **Una reserva semanal (`--cada-semana`) cuenta en cada semana del periodo.** Norte con `lun 10:00-12:00` semanal, periodo de 4 semanas → 8 h / 240 h = 3,3 %.
- **Periodo por defecto: la semana natural anterior (lunes a domingo).** `ocupacion` ejecutado el lunes 2026-11-09 informa del 2026-11-02 al 2026-11-08. Con `--desde 2026-11-01 --hasta 2026-11-30` informa de ese rango.
- **El informe sale una fila por sala, ordenadas de más a menos ocupada.** Norte 3,3 % y Sur 0,0 % → Norte primero.
- **La exportación a Excel es un CSV que Excel abre sin asistente:** UTF-8 con BOM, separador `;`, coma decimal. Columnas `sala;horas_reservadas;horas_disponibles;ocupacion_pct`. Fila de ejemplo: `Norte;2;60;3,3`.
- **El aviso semanal sale los lunes con el informe de la semana anterior** y lo recibe cada responsable de sala, solo con las salas que tiene asignadas. Responsable `ana@coworking.test` de Norte → recibe la fila de Norte y no la de Sur.
- **Los responsables salen de un fichero `responsables.json` en la raíz** (`{"Norte": ["ana@coworking.test"], "Sur": []}`). Una sala sin responsables no genera envío y se anota en la salida del comando.
- **El aviso lo lanza el comando `informe-semanal`; la programación semanal la pone el servidor** (cron del servidor propio), porque la herramienta es una CLI sin proceso residente.

## Capacidades que toca

- `occupancy-report` — nueva: cálculo de ocupación por sala y periodo.
- `report-export` — nueva: salida CSV para Excel.
- `weekly-report-notice` — nueva: envío semanal a los responsables; reutiliza el envío de correo de la fila 1.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0009 | Informe de ocupación por sala (`ocupacion`) | — |
| 2 | 0010 | Exportar el informe a Excel (CSV con `--exportar`) | 0009 |
| 3 | 0011 | Aviso semanal a los responsables (`informe-semanal`) | 0009, 1 |

Fuera del reparto, en el Backlog: 0012, `.xlsx` real (decisión pendiente, abajo).

## Decisiones tomadas por el agente (a revisar)

- **CSV en vez de `.xlsx`.** `tech-stack.md` dice «Node 22, sin dependencias externas»; un `.xlsx` real exige una librería o escribir el zip a mano. El CSV con BOM y `;` abre en Excel con doble clic. Si el cliente exige `.xlsx`, hace falta cambiar el tech-stack: va al Backlog (0012), no se decide aquí.
- **Horario disponible 08:00-20:00, lun-vie.** El código no tiene horario de apertura; es un supuesto que el cliente debe confirmar.
- **El aviso espera a la fila 1** («Avisos por correo antes de la reserva») para no construir dos envíos de correo distintos. Si la fila 1 se retrasa, 0011 puede arrancar antes con su propio envío: se decide entonces, con una enmienda.

## Acta

No aplica: entrevista.

## Enmiendas

Sin enmiendas.
