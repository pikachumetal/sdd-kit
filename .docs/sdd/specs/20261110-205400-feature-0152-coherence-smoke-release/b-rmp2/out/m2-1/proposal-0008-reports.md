---
id: 20261111-100931-proposal-0008-reports
proposal: 0008
title: Módulo de informes
source: interview
created: 2026-11-11
---

# Propuesta — Módulo de informes

## Por qué

El cliente no sabe cuánto se usa cada sala. Pide un informe de ocupación por sala, poder llevárselo a Excel y que los responsables reciban un aviso semanal. El cliente delegó los detalles («decide tú»); lo decidido queda abajo y se corrige con una enmienda si no es lo que quería.

## Reglas de negocio

- **Ocupación**: horas reservadas ÷ horas disponibles de la semana, en %, con un decimal. Disponibles: lunes a viernes, 08:00–20:00 (60 h por sala). Ejemplo: sala Norte con una reserva lun 10:00-12:00 → 2 h / 60 h = 3,3 %; sala Sur sin reservas → 0,0 %.
- **Reserva semanal** (`--cada-semana`): cuenta en todas las semanas. Ejemplo: Norte con lun 10:00-12:00 semanal, informe de cualquier semana → 3,3 %.
- **Franja fuera de horario** (p. ej. 19:00-21:00): solo cuenta la parte dentro de 08:00-20:00 → 1 h. Ejemplo: Sur, mar 19:00-21:00 → 1 h / 60 h = 1,7 %.
- **Informe**: una fila por sala con sala, horas reservadas, horas disponibles y % de ocupación, más la semana que cubre. Comando `informe [--semana AAAA-Www]`; sin semana, la actual. Ejemplo: `informe` con los datos de arriba → `Norte 2 h / 60 h 3,3 %` y `Sur 0 h / 60 h 0,0 %`.
- **Exportación a Excel**: fichero CSV en UTF-8 con BOM y separador `;`, que Excel en castellano abre sin asistente; sin dependencias (el stack no las admite). Ejemplo: `informe --exportar salas.csv` → fichero con cabecera `sala;horas_reservadas;horas_disponibles;ocupacion_pct` y `Norte;2;60;3,3`. Un `.xlsx` real exigiría una dependencia o escribir el ZIP a mano: decisión de producto por confirmar.
- **Aviso semanal**: el comando `aviso-semanal` compone el informe de la semana que acaba y lo envía a los responsables de cada sala (lista de responsables por sala en un fichero de configuración, sin gestión en la app). No hay planificador en la app: lo lanza el planificador del sistema (cron o Tareas programadas) los lunes. Ejemplo: Norte, responsable ana@ejemplo.com → ana recibe solo la fila de Norte; una sala sin responsable no envía nada y se avisa por consola.
- **Canal**: el aviso reutiliza el envío de correo de la fila 1 («Avisos por correo antes de la reserva»), para no construir dos.

## Capacidades que toca

- `informes` — nueva: ocupación por sala, exportación y aviso semanal.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0009 | Informe de ocupación por sala | — |
| 2 | 0010 | Exportar el informe a Excel (CSV) | 0009 |
| 3 | 0011 | Aviso semanal a los responsables | 0009, 1 |

## Acta

No aplica: entrevista.

## Enmiendas

