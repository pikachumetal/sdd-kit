---
id: 20261113-225444-proposal-0010-informes
proposal: 0010
title: Módulo de informes
source: interview
created: 2026-11-13
---

# Propuesta — Módulo de informes

## Por qué

El cliente quiere saber cuánto se usa cada sala y llevarse ese dato a Excel, y que los responsables de las salas reciban un resumen cada semana sin tener que pedirlo. Hoy `src/app.js` solo lista salas libres y reserva o cancela: no hay ningún informe.

Los detalles los dejó a nuestro criterio («decide tú»); las decisiones que se tomaron están marcadas **(decisión propia)** para que el cliente las confirme o las enmiende.

## Reglas de negocio

- **Ocupación de una sala** = horas reservadas ÷ horas disponibles de la semana, en %, con un decimal. **(decisión propia)** Horas disponibles: lunes a viernes, 08:00-20:00, es decir 60 h por sala y semana. Ejemplo: Norte tiene una reserva el lunes 10:00-12:00 → 2 h de 60 h → 3,3 %; Sur no tiene reservas → 0,0 %.
- **El informe cubre todas las salas**, una línea por sala, ordenadas por nombre. Ejemplo: con las salas Norte y Sur, el informe tiene dos líneas: `Norte 3,3 %` y `Sur 0,0 %`.
- **Una reserva semanal cuenta una vez por semana** (las reservas guardan día de la semana, no fecha). **(decisión propia)** El informe es de la «semana tipo»: no hay histórico por fechas. Ejemplo: Norte con `lun 10:00-12:00` repetida cada semana → 3,3 % en cualquier semana.
- **Exportar a Excel** genera un `.xlsx` con las columnas `Sala`, `Horas reservadas`, `Horas disponibles`, `Ocupación (%)`, una fila por sala. **(decisión propia)** Ejemplo: fila `Norte | 2 | 60 | 3,3` y fila `Sur | 0 | 60 | 0,0`.
- **Aviso semanal**: cada lunes a las 08:00 se envía por correo a los responsables de cada sala la ocupación de **su** sala. **(decisión propia)** Los responsables salen de una configuración sala → direcciones, no de las reservas. Ejemplo: responsable de Norte `ana@example.com` recibe «Norte: 3,3 % (2 h de 60 h)» y no ve la línea de Sur; una sala sin responsable configurado no envía nada y queda registrada en el log.

## Capacidades que toca

- `informes-ocupacion` — nueva: cálculo y listado de la ocupación por sala.
- `informes-exportacion` — nueva: salida a `.xlsx`.
- `informes-aviso-semanal` — nueva: envío semanal a responsables.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0011 | Informe de ocupación por sala | — |
| 2 | 0012 | Exportar el informe a Excel | 0011 |
| 3 | 0013 | Aviso semanal a los responsables | 0008, 0011, 0012 |

## Acta

No aplica: entrevista.

## Enmiendas

