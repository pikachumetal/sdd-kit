---
id: 20260925-120000-proposal-0014-salas-libres-acme
proposal: 0014
title: Mejoras de `salas libres` pedidas por Acme
source: meeting
created: 2026-09-25
---

# Propuesta — Mejoras de `salas libres` pedidas por Acme

## Por qué

`salas libres` solo enseña las salas libres (y, con la 0013, su aforo). Acme quiere decidir más rápido dónde reunirse: saber si la sala tiene proyector y ver primero las salas más grandes.

## Reglas de negocio

- Proyector visible: `salas libres 10-12` con Norte (aforo 8, con proyector) y Sur (aforo 4, sin proyector) libres → Norte se lista con `proyector: sí` y Sur con `proyector: no`.
- Orden por aforo descendente: con Sur (4), Norte (8) y Este (6) libres → el listado sale Norte (8), Este (6), Sur (4).
- Empate de aforo: Este (6) y Oeste (6) libres → se desempata por nombre de sala, Este antes que Oeste (decisión propia, no pedida por Acme).
- Solo se ordena y se muestra lo libre: una sala reservada en la franja no aparece, tenga el aforo que tenga.

## Capacidades que toca

- `room-availability` — listado de `salas libres`: columna de proyector y orden por aforo.
- `room-catalog` — dato nuevo por sala: si tiene proyector (junto al aforo que introduce la 0013).

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0015 | Mostrar si la sala tiene proyector en `salas libres` | 0013 |
| 2 | 0016 | Ordenar `salas libres` por aforo, de mayor a menor | 0013 |

## Acta

2026-09-25 · Acme (asistentes no indicados en las notas)

Notas de la reunión con Acme de hoy: en `salas libres` quieren ver, además del aforo, si la sala tiene proyector; y que `salas libres` ordene por aforo, de mayor a menor.

## Enmiendas

Ninguna.

Decisiones tomadas sin consultar (nadie disponible): qué salas tienen proyector es un dato que hay que pedir a Acme (no consta en el código); desempate por nombre; las dos features dependen de la 0013 (en marcha, no se toca) y son independientes entre sí.
