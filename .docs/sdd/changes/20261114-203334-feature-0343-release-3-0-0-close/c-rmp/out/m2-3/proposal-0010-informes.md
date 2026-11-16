---
id: 20261114-120000-proposal-0010-informes
proposal: 0010
title: Módulo de informes
source: interview
created: 2026-11-14
---

# Propuesta — Módulo de informes

## Por qué

El cliente quiere saber cuánto se usa cada sala, poder llevarse el dato a Excel y que los responsables reciban un aviso semanal sin tener que pedirlo. Hoy `salas` solo reserva, cancela y lista salas libres: no hay forma de ver la ocupación.

Decisiones tomadas por delegación («decide tú», 2026-11-14), todas por confirmar con el cliente antes de arrancar la 0011:

- Ventana de disponibilidad: lunes a viernes, 08:00–20:00 (60 h por sala y semana), como constante en el código.
- Las reservas guardan el día de la semana (`lun`…`vie`), no una fecha: el informe es de «la semana actual» y no admite histórico. Un histórico exigiría guardar fechas, que queda fuera de esta propuesta.
- «Excel» se entrega como CSV (UTF-8 con BOM, separador `;`), que Excel en castellano abre con doble clic. Un `.xlsx` real exige una dependencia y la constitution declara «sin dependencias externas»; si el cliente exige `.xlsx`, hay que decidir esa excepción aparte.
- El aviso semanal es un comando (`informe semanal`) que ejecuta el planificador del servidor (cron) los lunes a las 08:00; la app no lleva planificador propio.
- Los responsables y sus salas viven en `responsables.json` (sala → correo), no en código. El aviso va al responsable de cada sala con la ocupación de sus salas en el cuerpo del correo, sin adjunto.
- El envío usa `src/correo.js` de la 0008, de la que depende.

## Reglas de negocio

- Ocupación de una sala = horas reservadas ÷ horas disponibles de la semana, en porcentaje con un decimal: Norte con una reserva lun 10:00-12:00 → 2 h ÷ 60 h = 3,3 %; Sur sin reservas → 0,0 %.
- Una reserva cuenta por la duración de su franja: Sur con lun 09:00-10:30 y mar 14:00-15:00 → 1,5 h + 1 h = 2,5 h → 4,2 %.
- Una reserva fuera de la ventana cuenta solo en su parte dentro: Norte con vie 19:00-21:00 → 1 h dentro de la ventana → 1,7 % (1 h ÷ 60 h).
- La exportación lleva una fila por sala con las columnas `sala;horas_reservadas;horas_disponibles;ocupacion`: `Norte;2;60;3,3 %`.
- El aviso lo recibe el responsable de cada sala, solo con sus salas: Ana (Norte) recibe «Norte: 3,3 %»; Luis (Sur) recibe «Sur: 0,0 %». Una sala sin responsable en `responsables.json` no se avisa y el comando lo indica en su salida.
- Un responsable con varias salas recibe un solo correo con una línea por sala.

## Capacidades que toca

- `occupancy-report` — nueva: cálculo y consulta de la ocupación por sala.
- `report-export` — nueva: exportación del informe a CSV para Excel.
- `weekly-notice` — nueva: aviso semanal por correo a los responsables.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0011 | Informe de ocupación por sala | — |
| 2 | 0012 | Exportar el informe a Excel | 0011 |
| 3 | 0013 | Aviso semanal a los responsables | 0011, 0012, 0008 |

## Acta

No aplica: entrevista.

## Enmiendas

Sin enmiendas.
