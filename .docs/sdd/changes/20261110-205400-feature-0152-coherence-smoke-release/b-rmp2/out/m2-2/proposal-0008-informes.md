---
id: 20261111-100000-proposal-0008-informes
proposal: 0008
title: Módulo de informes de ocupación
source: interview
created: 2026-11-11
---

# Propuesta — Módulo de informes de ocupación

## Por qué

El cliente quiere saber cuánto se usa cada sala: un informe de ocupación por sala, poder llevárselo a Excel y que los responsables reciban un aviso semanal con el resultado. Hoy la herramienta solo dice qué salas están libres en una franja (`libres`) y no hay ningún resumen. La petición llegó sin detalles y se decidió por delegación («decide tú los detalles»): las decisiones tomadas están abajo y varias son supuestos a confirmar con el cliente.

## Reglas de negocio

- Ocupación de una sala en una semana = horas reservadas ÷ horas disponibles, en porcentaje con un decimal. Ejemplo: sala Norte con reservas lun 10:00-12:00 y mié 09:00-13:00 (6 h) sobre 60 h disponibles → 10,0 %.
- Horas disponibles: lunes a viernes, 08:00-20:00 (12 h/día, 60 h/semana). **Supuesto: el horario real del coworking no está en el código ni en la documentación; confirmar con el cliente.** Ejemplo: una reserva sábado 10:00-12:00 no cuenta ni en horas reservadas ni en disponibles.
- Una reserva semanal (`--cada-semana`) cuenta en cada semana del periodo. Ejemplo: reserva de Sur los martes 15:00-17:00 → 2 h en cada una de las 4 semanas de un informe de 4 semanas.
- El periodo por defecto es la semana natural (lunes a domingo) en curso; el informe acepta una semana concreta. Ejemplo: `ocupacion --semana 2026-11-09` → semana del 9 al 15 de noviembre.
- Una fila por sala, todas las salas aunque tengan 0 reservas. Ejemplo: Sur sin reservas → `Sur · 0 h · 0,0 %`.
- Exportación a Excel: un único `.xlsx` con una hoja «Ocupación» y las columnas Sala, Semana (fecha del lunes), Horas reservadas, Horas disponibles, Ocupación (%). Sin dependencias externas (el stack no las admite): el `.xlsx` se escribe a mano (OOXML dentro de un zip sin comprimir). Ejemplo: `ocupacion --semana 2026-11-09 --xlsx informe.xlsx` crea `informe.xlsx` con 2 filas de datos (Norte y Sur).
- Aviso semanal: cada lunes se envía a los responsables el informe de la semana anterior. Los responsables se leen de un fichero de configuración (lista de correos), no del código. Ejemplo: lunes 2026-11-16 → informe de la semana 2026-11-09 a los correos del fichero; con la lista vacía no se envía nada y se avisa por la salida.
- La programación del lunes la hace el planificador del sistema (cron / tareas programadas) llamando a un comando; la aplicación no se queda en ejecución. Ejemplo: `ocupacion --aviso` ejecutado a mano un miércoles envía igualmente el informe de la semana anterior.

## Capacidades que toca

- `ocupacion-informe` — nueva: cálculo y salida por pantalla.
- `ocupacion-excel` — nueva: exportación a `.xlsx`.
- `ocupacion-aviso` — nueva: aviso semanal a responsables.
- Las reservas existentes (`reservar`, `libres`, `cancelar`) se leen, no cambian.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0009 | Informe de ocupación por sala (comando `ocupacion`) | — |
| 2 | 0010 | Exportar el informe a Excel (`--xlsx`) | 0009 |
| 3 | 0011 | Aviso semanal a los responsables | 0009, 1 |

## Acta

No aplica: entrevista.

## Enmiendas

- 2026-11-11 — Decisiones delegadas por el usuario («decide tú los detalles»): horario 08:00-20:00 L-V, semana natural, `.xlsx` sin dependencias, responsables en fichero, programación por el planificador del sistema, aviso tras los avisos por correo de la fila 1 — pedido por el usuario, a confirmar con el cliente — re-parte: ninguna (alta inicial).
