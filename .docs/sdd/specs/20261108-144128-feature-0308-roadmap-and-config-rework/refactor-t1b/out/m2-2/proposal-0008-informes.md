---
id: 20261108-120000-proposal-0008-informes
proposal: 0008
title: Módulo de informes de ocupación
source: interview
created: 2026-11-08
---

# Propuesta — Módulo de informes de ocupación

## Por qué

El cliente no ve cuánto se usa cada sala: hoy solo hay `libres` y `reservar`. Quiere un informe de ocupación por sala, poder llevárselo a Excel y que los responsables reciban un resumen semanal sin tener que pedirlo. Los detalles los decidió el desarrollador ("decide tú"); quedan registrados abajo para poder enmendarlos.

## Reglas de negocio

- Ocupación de una sala = horas reservadas / horas disponibles del periodo, en %. Horario disponible: 08:00-20:00, lunes a viernes (60 h/semana). Ejemplo: Norte con reservas lun 10:00-12:00 y mié 09:00-11:00 en la semana → 4 h / 60 h = 6,7 %.
- El informe se pide por periodo (semana ISO por defecto) y lista todas las salas, también las de 0 %. Ejemplo: `informe --semana 2026-W45` con Norte 4 h y Sur sin reservas → Norte 6,7 %, Sur 0,0 %.
- Una reserva semanal (`--cada-semana`) cuenta en cada semana en que está vigente. Ejemplo: reserva semanal de Sur los lun 10:00-12:00 → 2 h en cada semana del informe.
- Exportar a Excel genera un `.xlsx` con una fila por sala (sala, horas reservadas, horas disponibles, % ocupación). Ejemplo: `informe --semana 2026-W45 --xlsx informe.xlsx` → fichero con filas Norte 4 / 60 / 6,7 % y Sur 0 / 60 / 0,0 %. Decisión: se escribe con un generador mínimo propio, porque la tech-stack prohíbe dependencias externas; si el cliente prefiere una librería, se enmienda.
- El aviso semanal se envía los lunes a las 08:00 con el informe de la semana anterior, a cada responsable de la lista configurada. Ejemplo: lunes 2026-11-09 08:00 → correo con la semana 2026-W45 a los responsables configurados. Sin responsables configurados no se envía nada y no es un error.
- El aviso reutiliza el envío de correo de la fila 1 (avisos por correo antes de la reserva); no se crea un segundo canal.

## Capacidades que toca

- `occupancy-report` — nueva: cálculo y salida por consola del informe.
- `report-export` — nueva: exportación a .xlsx.
- `weekly-report-notice` — nueva: aviso semanal a responsables.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0009 | Informe de ocupación por sala (comando `informe`) | — |
| 2 | 0010 | Exportar el informe a Excel (.xlsx) | 0009 |
| 3 | 0011 | Aviso semanal del informe a los responsables | 0009, 1 |

## Acta

No aplica: entrevista.

## Enmiendas

