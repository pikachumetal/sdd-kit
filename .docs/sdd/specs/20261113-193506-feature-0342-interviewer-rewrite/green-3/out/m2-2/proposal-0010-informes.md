---
id: 20261114-173405-proposal-0010-informes
proposal: 0010
title: Módulo de informes
source: interview
created: 2026-11-14
---

# Propuesta — Módulo de informes

## Por qué

El cliente pide un módulo de informes: ver la ocupación de cada sala, sacarla a Excel y que los responsables reciban un aviso semanal. Hoy `salas` solo reserva, cancela y lista salas libres; no hay forma de saber cuánto se usa cada sala.

Los detalles los decidió el agente por delegación («decide tú»): el cliente no estaba para preguntar. Cada decisión lleva su porqué y se puede enmendar (ver «Enmiendas») si el cliente piensa otra cosa.

## Reglas de negocio

- **Ocupación de una sala** = horas reservadas ÷ horas abiertas de la semana, en %, con un decimal. Horario abierto: lunes a viernes, 08:00–20:00 (60 h por sala y semana). Decisión supuesta: el repo no define horario; va en una constante para cambiarla en un sitio. Ejemplo: la reserva `Norte lun 10:00-12:00` son 2 h → Norte 2 ÷ 60 = 3,3 %; Sur sin reservas → 0,0 %.
- **El informe lista todas las salas**, también las de 0 %. Ejemplo: con las salas Norte y Sur y solo una reserva en Norte, salen dos líneas: `Norte 3,3 %` y `Sur 0,0 %`.
- **Las reservas semanales (`--cada-semana`) cuentan en cada semana.** Ejemplo: `Sur mié 09:00-11:00` semanal suma 2 h a Sur en todas las semanas → 3,3 %.
- **La exportación es un `.xlsx`** (Excel de verdad, no CSV), con una fila por sala y las columnas `Sala`, `Horas reservadas`, `Horas abiertas`, `Ocupación (%)`. Ejemplo: Norte → `Norte | 2 | 60 | 3,3`. Entra una dependencia nueva para escribir `.xlsx`; la elige la feature al diseñarla.
- **El aviso semanal sale los lunes a las 08:00** con la ocupación de la semana anterior, por correo. Se dispara con un comando (`salas aviso-semanal`) que lanza el cron del servidor: no hay proceso residente. Ejemplo: lunes 2026-11-16 08:00 → correo con la ocupación del 9 al 13 de noviembre.
- **Los responsables son una lista de correos en un fichero de configuración.** Cada uno recibe el mismo correo con todas las salas. Decisión supuesta: no existe el concepto de «responsable de una sala»; si el cliente lo quiere por sala, es una enmienda. Ejemplo: `responsables: [ana@x.com, luis@x.com]` → dos destinatarios, un correo con Norte y Sur.
- **Sin responsables configurados, el aviso no falla ni envía**: sale con código 0 y dice «sin responsables». Ejemplo: lista vacía → ningún correo, mensaje en la salida.

## Capacidades que toca

- `informes` — nueva: cálculo de ocupación, exportación y aviso. `.docs/sdd/capabilities/` está vacío; la primera feature declara la capacidad.
- `avisos-correo` — la 0008 crea el envío de correo (`src/correo.js`); el aviso semanal lo reutiliza.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0011 | Informe de ocupación por sala | — |
| 2 | 0012 | Exportar el informe a Excel | 0011 |
| 3 | 0013 | Aviso semanal a los responsables | 0011, 0012, 0008 |

## Acta

No aplica: entrevista.

## Enmiendas

- Sin enmiendas.
