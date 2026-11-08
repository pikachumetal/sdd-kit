---
id: 20261108-120000-proposal-0008-informes
proposal: 0008
title: Módulo de informes
source: interview
created: 2026-11-08
---

# Propuesta — Módulo de informes

## Por qué

El cliente quiere saber cuánto se usa cada sala y que los responsables lo reciban sin pedirlo. Hoy `salas` solo reserva, cancela y lista salas libres: no hay forma de ver la ocupación ni de sacar los datos de la terminal. Pidió tres cosas: informe de ocupación por sala, exportación a Excel y un aviso semanal a los responsables. «Decide tú los detalles»: las decisiones de abajo las tomó el agente (perfil `delegate`) y quedan para que el cliente las confirme o las enmiende.

## Reglas de negocio

- Ocupación de una sala = horas reservadas ÷ horas disponibles de la semana. Horas disponibles: lunes a viernes, 08:00–18:00, es decir 50 h por sala. Ejemplo: sala Norte con reservas lun 10:00-12:00 y mié 09:00-13:00 → 6 h ÷ 50 h = 12 %.
- El informe cubre una semana natural (lunes a domingo); sin argumento, la semana en curso. Ejemplo: `informe` ejecutado el miércoles 2026-11-11 → semana del 2026-11-09 al 2026-11-15.
- Una sala sin reservas aparece con 0 %, no se omite. Ejemplo: Sur sin reservas → `Sur  0 h  0 %`.
- Las reservas semanales recurrentes (`--cada-semana`) cuentan en cada semana a la que afectan. Ejemplo: reserva semanal de Sur los lunes 09:00-10:00 → 1 h en cada semana.
- La exportación genera un CSV que Excel abre directamente: UTF-8 con BOM, separador `;` y coma decimal. Ejemplo: `Norte;6;12,0` en la fila de Norte, tras la cabecera `sala;horas;ocupacion_pct`.
- El aviso semanal se emite los lunes e incluye el informe de la semana anterior, una vez por responsable y solo con las salas que tiene a su cargo. Ejemplo: Ana es responsable de Norte; el lunes 2026-11-16 recibe el informe de Norte de la semana 09–15 de noviembre.
- La relación sala → responsable (correo) se define en un fichero de configuración, `responsables.json`. Ejemplo: `{"Norte": ["ana@empresa.com"], "Sur": ["luis@empresa.com"]}`.

## Capacidades que toca

- `occupancy-report` — nueva: cálculo y salida por terminal del informe de ocupación.
- `report-export` — nueva: exportación del informe a CSV para Excel.
- `weekly-report-notice` — nueva: aviso semanal por correo a los responsables.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0009 | Informe de ocupación por sala (`salas informe [semana]`) | — |
| 2 | 0010 | Exportar el informe a CSV para Excel (`salas informe --csv`) | 0009 |
| 3 | 0011 | Aviso semanal por correo a los responsables | 0009 y el ítem 1 de Próximo (avisos por correo) |

Fuera del reparto, en Backlog: 0012 (.xlsx nativo).

## Acta

No aplica: entrevista.

## Enmiendas

Decisiones tomadas por el agente por delegación («decide tú los detalles»), pendientes de confirmar con el cliente:

- 2026-11-08 — Formato Excel: CSV con BOM y `;` en vez de .xlsx real, porque el stack es «Node 22, sin dependencias externas» (`tech-stack.md`) y un .xlsx exige una librería o escribir el ZIP a mano. El .xlsx nativo queda en Backlog (0012) y necesita una decisión sobre añadir dependencia — pedido por el cliente («exportar a Excel»), decidido por el agente.
- 2026-11-08 — Horario base 08:00–18:00 de lunes a viernes: el proyecto no define horario de apertura; el cliente debe confirmarlo o dar el real.
- 2026-11-08 — El aviso depende del canal de correo del ítem 1 de Próximo («Avisos por correo antes de la reserva»): la app es de terminal y no tiene envío de correo. La planificación (cada lunes) la hace un cron externo que ejecuta el comando; la app no lleva planificador.
- 2026-11-08 — «Responsables» no existe como concepto en la app: se resuelve con `responsables.json` (sala → correos), sin usuarios ni roles.
