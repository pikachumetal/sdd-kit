---
id: 20261112-100000-proposal-0010-informes-ocupacion
proposal: 0010
title: Módulo de informes de ocupación
source: interview
created: 2026-11-12
---

# Propuesta — Módulo de informes de ocupación

## Por qué

El cliente quiere saber cuánto se usa cada sala, llevarse esos datos a Excel y que los responsables de las salas reciban un resumen cada semana sin pedirlo. Hoy `salas` solo lista salas libres y reserva o cancela: no hay forma de medir la ocupación.

El cliente dijo «decide tú los detalles»: las decisiones de abajo las tomó el agente (perfil `delegate`) y quedan aquí para que el cliente las corrija con una enmienda.

## Reglas de negocio

- **Ocupación de una sala en un periodo** = horas reservadas ÷ horas disponibles × 100, redondeado a un entero. Horario disponible: 08:00-20:00 de lunes a viernes (12 h/día, 60 h/semana). Ejemplo: Norte con reservas lun 10:00-12:00 (2 h) y mié 09:00-13:00 (4 h) en la semana del 9 al 13 de noviembre → 6 h ÷ 60 h = **10 %**.
- **Una reserva semanal** (`--cada-semana`) cuenta en cada semana del periodo en que está vigente, y una cancelada de un día concreto no cuenta ese día. Ejemplo: Sur con una reserva semanal mar 16:00-18:00 y un periodo de dos semanas → 4 h; si se cancela la del mar 18 → 2 h.
- **El informe cubre un periodo** dado como `--desde` y `--hasta` (fechas AAAA-MM-DD, ambas incluidas); sin ellos, la semana natural anterior (lunes a viernes). Ejemplo: ejecutado el jueves 12-11-2026 sin opciones → del 2026-11-02 al 2026-11-06.
- **Sin reservas la ocupación es 0 %**, y la sala aparece igualmente en el informe. Ejemplo: Sur sin reservas en la semana → `Sur: 0 h de 60 h (0 %)`.
- **Salida en texto** (una línea por sala, ordenadas por ocupación descendente): `salas informe --desde 2026-11-02 --hasta 2026-11-06` → `Norte: 6 h de 60 h (10 %)` y `Sur: 0 h de 60 h (0 %)`.
- **La exportación a Excel es un `.xlsx` real**, no un CSV: hoja «Ocupación» con las columnas Sala, Horas reservadas, Horas disponibles, Ocupación (%), y los mismos datos que el informe de texto. Ejemplo: `salas informe --excel ocupacion.xlsx` con el caso anterior → dos filas de datos: (Norte, 6, 60, 10) y (Sur, 0, 60, 0). Si el fichero ya existe, se sobrescribe.
- **Cada sala tiene un responsable con un correo**, que se guarda en `salas.config.json` (`"responsables": {"Norte": "ana@coworking.example"}`). Una sala sin responsable no recibe aviso y se anota en la salida del comando. Ejemplo: Sur sin entrada → `Sur: sin responsable, no se avisa`.
- **El aviso semanal** lo envía el comando `salas aviso-semanal`, que cada responsable recibe con el informe de **sus** salas de la semana anterior (el mismo texto que `salas informe`). Ejemplo: Ana, responsable de Norte, recibe «Norte: 6 h de 60 h (10 %)» y nada de Sur.
- **El envío es semanal porque lo lanza el servidor, no el programa**: `salas` no queda residente; el cron o el temporizador del servidor del cliente ejecuta `salas aviso-semanal` los lunes a las 08:00. Se ejecuta dos veces el mismo lunes → se envía dos veces (sin memoria de envíos).

## Capacidades que toca

- `informe-ocupacion` — nueva: cálculo de la ocupación y comando `salas informe`.
- `exportacion-excel` — nueva: `--excel <fichero>` sobre el informe.
- `aviso-semanal` — nueva: responsables por sala y comando `salas aviso-semanal`; reutiliza el envío de correo de la 0008.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0011 | Informe de ocupación por sala | — |
| 2 | 0012 | Exportar el informe a Excel | 0011 |
| 3 | 0013 | Aviso semanal a los responsables | 0011, 0008 |

## Acta

No aplica: entrevista.

## Enmiendas

- 2026-11-12 — Decisiones delegadas por el cliente («decide tú los detalles»): horario 08:00-20:00 de lunes a viernes, `.xlsx` real, responsables en `salas.config.json`, lanzamiento por cron del servidor, sin memoria de envíos. Para cambiar alguna, añadir aquí una enmienda con su ejemplo con datos.
