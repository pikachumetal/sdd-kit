---
id: 20261114-120000-proposal-0010-informes
proposal: 0010
title: Módulo de informes
source: interview
created: 2026-11-14
---

# Propuesta — Módulo de informes

## Por qué

El cliente quiere saber cuánto se usa cada sala, llevarse esos datos a Excel y que los responsables reciban un aviso semanal sin pedirlo. Hoy la herramienta solo reserva, cancela y lista salas libres; no hay ninguna vista agregada. El cliente no concretó detalles y delegó la decisión: lo decidido abajo lo tomó el agente (3 de ellas, marcadas con «Decidido por el agente», son las que más conviene confirmar).

## Reglas de negocio

- Horario disponible (Decidido por el agente): lunes a viernes, 08:00-20:00, 12 h al día y 60 h por sala y semana. Ejemplo: la sala Sur, sin reservas → 0 h ocupadas de 60 h disponibles.
- Ocupación de una sala = horas reservadas ÷ horas disponibles, en %, con un decimal. Ejemplo: Norte tiene una reserva el lun 10:00-12:00 → 2 h ÷ 60 h = 3,3 %; Sur → 0,0 %.
- Una reserva fuera del horario solo cuenta lo que cae dentro. Ejemplo: reserva vie 19:00-21:00 → cuenta 1 h.
- El informe lista las salas por nombre, de la A a la Z. Ejemplo: `Norte: 3,3 %` y después `Sur: 0,0 %`.
- Sin filtro por fecha en esta propuesta: las reservas guardan el día de la semana, no una fecha, así que el informe cubre la semana tipo. Ejemplo: `salas informe ocupacion` siempre da el mismo resultado hasta que cambien las reservas.
- Excel (Decidido por el agente): se exporta un `.xlsx` real, sin añadir dependencias, porque `operations.md` fija «sin dependencias externas». Si el cliente prefiere CSV, o se acepta una dependencia, esta regla se enmienda. Ejemplo: `salas informe ocupacion --excel informe.xlsx` crea la hoja «Ocupación» con la cabecera `Sala | Horas ocupadas | Horas disponibles | Ocupación (%)` y la fila `Norte | 2 | 60 | 3,3`, con números en celdas numéricas.
- Aviso semanal (Decidido por el agente): lo dispara el planificador del servidor, los lunes a las 08:00, con `salas informe enviar`. La herramienta no queda residente. Ejemplo: con `responsables.json` = `["ana@coworking.test"]`, el lunes llega un correo a Ana con asunto «Ocupación semanal de salas» y las líneas `Norte: 3,3 %` y `Sur: 0,0 %`.
- Sin responsables no se envía nada y el comando falla con un mensaje claro. Ejemplo: `responsables.json` = `[]` → `salas informe enviar` sale con código 1 y dice «no hay responsables».

## Capacidades que toca

- `occupancy-report` — nueva: cálculo y salida del informe de ocupación, y su exportación a Excel (nombre propuesto; lo aprueba el dev-lead al declararla en la spec de la 0011).
- `weekly-notice` — nueva: aviso semanal a responsables (nombre propuesto; lo declara la spec de la 0013). Enlaza con `occupancy-report` sin duplicar sus reglas.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0011 | Informe de ocupación por sala | — |
| 2 | 0012 | Exportar el informe a Excel | 0011 |
| 3 | 0013 | Aviso semanal a los responsables | 0008, 0011, 0012 |

## Acta

No aplica: entrevista.

## Enmiendas

(sin enmiendas)
