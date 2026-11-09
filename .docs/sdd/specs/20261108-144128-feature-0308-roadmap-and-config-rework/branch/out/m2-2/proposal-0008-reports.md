---
id: 20261108-100000-proposal-0008-reports
proposal: 0008
title: Módulo de informes
source: interview
created: 2026-11-08
---

# Propuesta — Módulo de informes

## Por qué

El cliente quiere ver cuánto se usa cada sala, llevarse los datos a Excel y que los responsables reciban un resumen semanal sin pedirlo. Hoy `src/app.js` solo reserva, cancela y lista salas libres: no hay ningún informe. El cliente delegó los detalles ("decide tú"); las decisiones de abajo las tomó el agente y están para que el usuario las corrija con una enmienda.

## Reglas de negocio

- Ocupación de una sala = minutos reservados / minutos disponibles en el periodo, en %. Horario disponible: 08:00-20:00, lunes a viernes (12 h × 5 días = 3600 min por semana). Ejemplo: sala Norte con reservas 10:00-12:00 y 14:00-15:00 el lunes, nada más → 180 / 3600 = 5 %.
- El periodo por defecto es la semana natural lunes-domingo anterior a hoy. Ejemplo: hoy jueves 12-nov-2026 → informe del 2 al 8 de noviembre. Con `--desde` y `--hasta` se elige otro rango.
- Una reserva semanal (`--cada-semana`) cuenta en cada semana que cae dentro del periodo. Ejemplo: Sur lunes 10:00-11:00 semanal, periodo de 2 semanas → 120 min.
- Una reserva cancelada no cuenta. Ejemplo: Norte lunes 10:00-12:00 cancelada → 0 min.
- Los informes salen por la línea de comandos: `informe ocupacion`, `informe ocupacion --excel <ruta>`, `informe aviso`. Ejemplo: `informe ocupacion` imprime `Norte 5 % · Sur 0 %`.
- El Excel es un `.xlsx` real, generado sin dependencias (el stack no admite paquetes externos: usa `node:zlib` y escribe el zip a mano). Una hoja "Ocupación", una fila por sala: sala, minutos reservados, minutos disponibles, % ocupación. Ejemplo: fila `Norte | 180 | 3600 | 5`.
- Los responsables se declaran en `responsables.json` junto a `src/app.js`, sala → contacto. Ejemplo: `{"Norte": "ana@coworking.example"}`. Una sala sin responsable no recibe aviso, y el aviso lo dice.
- El aviso semanal es un texto por responsable con la ocupación de sus salas en la semana anterior. Lo genera `informe aviso` (salida estándar, un bloque por responsable); la programación semanal es un cron del servidor: la herramienta no lleva planificador propio. Ejemplo: `informe aviso` con el JSON de arriba → `Para ana@coworking.example: Norte 5 % la semana del 2 al 8 de noviembre`.
- El envío real por correo no entra aquí: lo trae la fila 1 (avisos por correo). Cuando exista, el aviso lo reutiliza en una enmienda.

## Capacidades que toca

- `occupancy-report` — nueva: cálculo y comando de ocupación por sala.
- `report-excel-export` — nueva: exportación a `.xlsx`.
- `weekly-manager-notice` — nueva: responsables y texto del aviso semanal.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0009 | Informe de ocupación por sala | — |
| 2 | 0010 | Exportar el informe a Excel (.xlsx) | 0009 |
| 3 | 0011 | Aviso semanal a los responsables | 0009 |

## Acta

No aplica: entrevista.

## Enmiendas

Ninguna todavía.
