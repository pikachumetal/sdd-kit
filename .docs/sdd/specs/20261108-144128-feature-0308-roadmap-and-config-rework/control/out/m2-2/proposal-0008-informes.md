---
id: 20261108-120000-proposal-0008-informes
proposal: 0008
title: Módulo de informes
source: interview
created: 2026-11-08
---

# Propuesta — Módulo de informes

## Por qué

El cliente pide un módulo de informes: ocupación por sala, exportación a Excel y un aviso semanal a los responsables. Hoy solo se puede consultar qué salas están libres en una franja (`libres`); no hay forma de ver cuánto se usa cada sala ni de sacar los datos de la herramienta. Dijo «decide tú los detalles»: las decisiones de abajo las tomó el agente (perfil `delegate`) y se pueden enmendar.

## Reglas de negocio

- **Ocupación de una sala** = horas reservadas ÷ horas disponibles del periodo, en %. Horario disponible: 08:00-20:00, de lunes a viernes (12 h/día). Ejemplo: sala Norte con una reserva lun 10:00-12:00 en la semana del 2 al 6 de noviembre → 2 h ÷ 60 h = 3,3 %.
- **Periodo del informe**: por defecto la semana natural anterior (lunes a domingo); se puede dar `--desde` y `--hasta`. Ejemplo: `informe` ejecutado el lunes 9 de noviembre → periodo 2 al 8 de noviembre.
- **El informe lista todas las salas**, también las sin reservas. Ejemplo: Sur sin reservas en esa semana → `Sur 0 h / 60 h 0,0 %`.
- **Exportación**: fichero CSV en UTF-8 con BOM y `;` como separador, que Excel abre directamente. Columnas: `sala;horas_reservadas;horas_disponibles;ocupacion_pct`. Ejemplo: `Norte;2;60;3,3`. Se elige CSV y no `.xlsx` porque la herramienta no usa dependencias externas (tech-stack).
- **Aviso semanal**: el comando `aviso-semanal` genera el informe de la semana anterior y lo envía a cada dirección de `responsables.json`. Lo lanza el planificador del servidor (cron) los lunes a las 08:00; la herramienta no se queda residente. Ejemplo: `responsables.json` = `["ana@cowork.example"]` → un envío a Ana con el informe en el cuerpo y el CSV adjunto.
- **Sin responsables configurados**, el aviso no falla ni envía nada: avisa por la salida estándar. Ejemplo: `responsables.json` vacío → `sin responsables: no se envía nada`.

## Capacidades que toca

- `room-occupancy-report` — nueva: cálculo e impresión de la ocupación por sala.
- `report-export` — nueva: exportación del informe a CSV para Excel.
- `weekly-report-notice` — nueva: envío semanal a los responsables.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0009 | Informe de ocupación por sala | — |
| 2 | 0010 | Exportar el informe a Excel (CSV) | 0009 |
| 3 | 0011 | Aviso semanal a los responsables | 0010 |

## Acta

No aplica: entrevista.

## Enmiendas

Decisiones por delegación, a confirmar con el cliente: (1) CSV en vez de `.xlsx`; (2) horario 08:00-20:00 L-V como base de la ocupación; (3) lista de responsables en un fichero, sin gestión por comando; (4) planificación externa (cron). Preguntas abiertas: cómo se envía el correo (la fila 1 de «Próximo», avisos por correo, también lo necesita: quien llegue primero define el canal) y si «responsables» son varias personas por sala o una lista única (se asume una lista única).
