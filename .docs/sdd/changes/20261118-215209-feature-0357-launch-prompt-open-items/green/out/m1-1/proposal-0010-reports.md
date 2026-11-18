---
id: 20261001-090000-proposal-0010-reports
proposal: 0010
title: Informes de uso de las salas
source: interview
created: 2026-10-01
---

# Propuesta — Informes de uso de las salas

## Por qué

Los responsables de cada planta no saben qué salas se usan ni cuándo, y reservan de más por si acaso.

## Reglas de negocio

- **Ocupación por sala**: horas reservadas entre horas disponibles en el mes. Norte, 40 h de 160 h en marzo → 25 %.
- **Exportar a Excel**: una hoja por sala con una fila por reserva (día, franja, quién).
- **Aviso semanal**: los lunes a las 9:00 cada responsable recibe las reservas de su planta de la semana. Lunes 6 → reservas del 6 al 10.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0011 | Ocupación por sala | — |
| 2 | 0012 | Exportar a Excel | 0011 |
| 3 | 0013 | Aviso semanal a los responsables | 0012 |

## Enmiendas

- 2026-10-03 — Aviso semanal: a las 9:00 → a las 8:00 — pedido por el cliente
