---
id: 20261113-225304-proposal-0010-informes
proposal: 0010
title: Módulo de informes
source: interview
created: 2026-11-13
---

# Propuesta — Módulo de informes

## Por qué

El cliente quiere saber cuánto se usa cada sala. Hoy `salas` solo reserva, cancela y lista salas libres; no hay forma de ver la ocupación, sacarla a una hoja de cálculo ni que los responsables la reciban sin pedirla. Se pide: informe de ocupación por sala, exportación a Excel y un aviso semanal a los responsables. El cliente dejó los detalles a criterio del equipo; las decisiones de abajo las tomó el agente en modo `delegate` y están pendientes de que el cliente las confirme.

## Reglas de negocio

- **Ocupación = horas reservadas / horas disponibles del periodo.** Horario disponible: 08:00-20:00 (12 h) de lunes a viernes. Sala Norte con reservas lun 10:00-12:00 y mar 09:00-11:00 en la semana del 2026-11-09 → 4 h de 60 h = 6,7 %. Una reserva en sábado o fuera de 08:00-20:00 no cuenta ni en el numerador ni en el denominador.
- **El informe cubre un periodo y desglosa por sala.** `salas informe --desde 2026-11-09 --hasta 2026-11-13` → una línea por sala (Norte, Sur) con horas reservadas, horas disponibles y porcentaje; sin periodo, la última semana natural cerrada (lun-dom anterior a hoy).
- **Una reserva semanal cuenta en cada semana en que aplica.** Sur con `--cada-semana` mar 14:00-16:00 desde el 2026-11-03: en el periodo 2026-11-03 a 2026-11-13 suma 2 h × 2 = 4 h.
- **Una reserva cancelada no cuenta.** Norte con lun 10:00-12:00 cancelada el 2026-11-09 → 0 h ese día.
- **Excel: un `.xlsx` con una hoja «Ocupación» y las mismas columnas que el informe.** `salas informe --desde 2026-11-09 --hasta 2026-11-13 --excel ocupacion.xlsx` → fichero con filas `Norte | 4 | 60 | 6,7 %` y `Sur | 0 | 60 | 0,0 %`. Si el fichero ya existe, se sobrescribe.
- **El aviso semanal sale los lunes a las 08:00 con el informe de la semana anterior, a cada responsable de `responsables.json`.** Lunes 2026-11-16, responsable `ana@cliente.com` → correo con asunto «Ocupación de salas, 9-15 nov» y el informe en el cuerpo y el `.xlsx` adjunto. Sin responsables configurados, no envía nada y lo deja en el registro.
- **Los responsables se configuran en `responsables.json` (lista de correos), no por sala.** `{"responsables": ["ana@cliente.com", "luis@cliente.com"]}` → los dos reciben el mismo aviso. El aviso lo lanza el programador del servidor (cron) con `salas aviso-semanal`; la herramienta no queda residente.

## Capacidades que toca

- `ocupacion-informe` — nueva: cálculo y salida por pantalla.
- `ocupacion-excel` — nueva: exportación a `.xlsx`.
- `aviso-semanal` — nueva: envío periódico; usa `src/correo.js` de la 0008.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0011 | Informe de ocupación por sala | — |
| 2 | 0012 | Exportar el informe a Excel | 0011 |
| 3 | 0013 | Aviso semanal a los responsables | 0008, 0012 |

## Acta

No aplica: entrevista.

## Enmiendas

Ninguna todavía.

## Decisiones tomadas por el agente (pendientes de confirmar con el cliente)

Horario 08:00-20:00 lun-vie, semana de referencia lun-dom, formato `.xlsx`, aviso los lunes a las 08:00, destinatarios en `responsables.json` (no por sala), envío por cron y no por proceso residente. Si el cliente cambia alguna, va a «Enmiendas».
