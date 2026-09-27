---
id: 20260925-110000-proposal-0014-salas-libres-proyector-orden
proposal: 0014
title: Salas libres con proyector y ordenadas por aforo
source: meeting
created: 2026-09-25
---

# Propuesta — Salas libres con proyector y ordenadas por aforo

## Por qué

`salas libres` hoy solo lista salas. Acme quiere elegir sala de un vistazo: ver si tiene proyector (además del aforo, que ya cubre la 0013) y que las más grandes salgan primero.

## Reglas de negocio

- Proyector visible: `salas libres 10-12` con Norte (aforo 8, con proyector) y Sur (aforo 4, sin proyector) libres → la línea de Norte indica proyector «sí» y la de Sur «no».
- Orden por aforo descendente: Sur (4), Norte (8) y Este (6) libres → salida Norte (8), Este (6), Sur (4).
- Empate de aforo (decisión tomada sin consultar, nadie disponible): las salas con el mismo aforo se ordenan por nombre ascendente. Ejemplo: Oeste (6) y Este (6) → Este, Oeste.
- Sala sin dato de proyector (decisión tomada sin consultar): se muestra como «no». Ejemplo: sala Sur sin campo de proyector → «no».
- Dónde vive el dato (decisión tomada sin consultar): junto al aforo, en `src/capacity.js` (hoy `{ Norte: 8, Sur: 4 }`), sin fichero nuevo; la 0015 fija el formato exacto.

## Capacidades que toca

- `room-availability` — salida de `salas libres` (columna proyector y orden). Aún no existe en `capabilities/`; cada feature la crea o fusiona al cerrar.

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
