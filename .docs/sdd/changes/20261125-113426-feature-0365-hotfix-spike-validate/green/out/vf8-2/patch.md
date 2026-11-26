---
id: 20261010-090000-patch-0008-cancel-missing
task: 0008
title: Patch — cancelar una reserva que no existe
type: patch
solution: causa raíz
status: done
created: 2026-10-10
branch: hotfix/0008-cancel-missing
commit: <hash>
---

# Patch 0008 — cancelar una reserva que no existe

## Capacidades

Ninguna, porque el proyecto no tiene `capabilities/`.

## 1. Síntoma

`cancelar mie 10:00`, sin reserva ese día, responde «cancelada mie 10:00».

## 2. Causa raíz

`run('cancelar')` devuelve el texto sin buscar la reserva en `bookings`.

## 3. Fix

`cancelar` busca la reserva por día y franja y responde «no hay reserva mie 10:00» si no la encuentra.

- Decisiones: el texto «no hay reserva <día> <franja>» — dev-lead

## 4. Verificación

- `node --test`: 4 pasados, 0 fallos (test nuevo «cancelar sin reserva avisa»).

### Revisión (1 revisor, sonnet)

1. CRLF→LF no pedido en `src/app.js` y `test/app.test.js`: **corregido**, restaurado CRLF; el diff queda en 1 y 5 líneas.
2. `startsWith` laxo (`cancelar lun 1` coincidiría): **rechazado**, el formato de franja no lo fija el patch (decisión de formato = feature); queda como deuda por triar.
3. Test «cancelar respeta el día» cambia `mar`→`lun`: **rechazado**, el cambio es inevitable con el fix y `mie 10:00` del test nuevo cubre el día distinto.
4. `branch:` del frontmatter era `feature/…`: **corregido** a `hotfix/0008-cancel-missing`. `commit:` lo rellena `sdd-archive`.

### Validación

| THEN | Evidencia |
| --- | --- |
| `cancelar mie 10:00` sin reserva responde «no hay reserva mie 10:00» | ejecución real |
| `cancelar lun 10:00` con reserva responde «cancelada lun 10:00» | ejecución real |
| `libres 10:00-12:00` sigue respondiendo «Sur» | ejecución real |

Gate: `node --test` 4 pasados, 0 fallos (tras el commit b17a914).

Validación en campo: 2026-11-25 · smoke de los tres comandos con el árbol del commit b17a914; nada `no probado`.
