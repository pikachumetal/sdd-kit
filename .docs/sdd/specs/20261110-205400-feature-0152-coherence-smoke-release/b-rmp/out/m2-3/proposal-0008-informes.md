---
id: 20261110-223000-proposal-0008-informes
proposal: 0008
title: Módulo de informes
source: interview
created: 2026-11-10
---

# Propuesta — Módulo de informes

## Por qué

El cliente pide un módulo de informes: la ocupación por sala, exportarla a Excel y un aviso semanal a los responsables. Hoy `salas` solo reserva, libera y cancela; no hay forma de ver cuánto se usa cada sala. Los detalles los delegó el cliente («decide tú»), así que las decisiones de abajo son del agente y quedan abiertas a enmienda.

## Reglas de negocio

- Ocupación de una sala = horas reservadas ÷ horas disponibles del periodo, en %, con un decimal. Ejemplo: sala Norte, semana del 2026-11-09 al 2026-11-13, horario 08:00-20:00 (12 h × 5 días = 60 h), reservas de 10:00-12:00 el lunes y 10:00-12:00 el martes (4 h) → 6,7 %.
- Periodo por defecto: la semana natural (lunes a viernes) anterior a hoy; `--desde` y `--hasta` lo cambian. Ejemplo: hoy martes 2026-11-17, `informe` sin opciones → periodo 2026-11-09 a 2026-11-13.
- Una reserva semanal (`--cada-semana`) cuenta en cada semana en la que cae dentro del periodo. Ejemplo: Norte lunes 10:00-12:00 semanal, periodo de 2 semanas → 4 h reservadas.
- Una reserva cancelada no cuenta. Ejemplo: Norte martes 10:00-12:00 cancelada → 0 h ese día.
- La exportación es un `.xlsx` válido con una fila por sala (sala, horas reservadas, horas disponibles, % de ocupación) y los mismos números que el informe de pantalla. Ejemplo: el informe del primer ejemplo exporta la fila `Norte | 4 | 60 | 6,7`.
- El aviso semanal lo envía el comando `aviso-semanal`, que lanza el programador de tareas del servidor (la herramienta no tiene proceso residente); manda a cada responsable el informe de la semana anterior. Ejemplo: lunes 2026-11-16 a las 08:00 se ejecuta `salas aviso-semanal` → un correo por responsable con la tabla del 2026-11-09 al 2026-11-13.
- Los responsables son una lista de correos en configuración. Sin lista, el comando falla con un mensaje claro y no envía nada. Ejemplo: lista vacía → `aviso-semanal` termina con error «sin responsables configurados».

## Decisiones tomadas por el agente (delegadas por el cliente)

- **Horario disponible**: 08:00-20:00, lunes a viernes, constante configurable. El código hoy no define horario de salas; sin él no hay denominador. A confirmar con el cliente.
- **Excel**: `.xlsx` real, escrito a mano con `node:zlib` (zip sin compresión), porque la pila no admite dependencias externas (`tech-stack.md`). Alternativa descartada: CSV, que Excel abre pero no es Excel.
- **«Responsables»**: la misión describe un solo usuario, sin roles. Se modelan como lista de correos en configuración, no como usuarios con rol.
- **Envío**: el aviso reutiliza el envío de correo de la fila 1 («Avisos por correo antes de la reserva»), para no tener dos emisores; por eso va tras ella.
- **Persistencia**: hoy las reservas viven en memoria (`src/app.js`); un informe de una semana pasada necesita que existan. 0009 declara en su spec si necesita persistir o lo da por resuelto.

## Capacidades que toca

- `informes` — nueva: ocupación por sala y periodo.
- `exportacion` — nueva: salida `.xlsx` del informe.
- `avisos` — nueva o ampliada por la fila 1: aviso semanal a responsables.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0009 | Informe de ocupación por sala (`informe`) | — |
| 2 | 0010 | Exportar el informe a Excel (`--xlsx`) | 0009 |
| 3 | 0011 | Aviso semanal de ocupación a los responsables (`aviso-semanal`) | 0009, 1 |

## Acta

No aplica: entrevista.

## Enmiendas

Ninguna.
