---
id: 20261028-221856-patch-0012-invalid-slot
task: 0012
title: Patch — franja no válida en libres
type: patch
solution: dev-lead
status: done
created: 2026-10-28
branch: feature/0012-slot-format
commit: pendiente
---

# Patch 0012 — franja no válida en libres

## Capacidades

Ninguna, porque ninguna capacidad describe `libres` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

Fila 0012 del roadmap: `libres 25:00-26:00` responde con la lista de salas; debe responder «franja no válida: usa HH:MM-HH:MM».

Medido sobre la base (`5dbb970`): `node src/app.js libres 25:00-26:00` imprime `Norte, Sur`. Coincide con lo reportado.

## 2. Solución fijada (petición cerrada)

- Frase literal, del dev-lead (fila 0012 del roadmap): «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»».
- Comprobado lo que da por existente: el comando `libres` existe (`run`, `src/app.js`) y no valida su argumento: `freeRooms(slot)` solo compara `b.slot === slot`, así que una franja que no es ninguna reserva deja libres todas las salas.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` comprueba que la franja sea `HH:MM-HH:MM` con horas 00-23 y minutos 00-59; si no, responde «franja no válida: usa HH:MM-HH:MM». Test de regresión con `25:00-26:00`.
- **Decisiones**:
  - «Válida» = horas de reloj, 00-23 y minutos 00-59, en ambos extremos; no se exige que el inicio sea anterior al fin — sin el dev-lead (lectura mía de «usa HH:MM-HH:MM»: la fila solo da el caso `25:00`; el dev-lead puede vetarla).
  - `libres` sin franja queda como estaba (lista las salas), porque la fila no lo toca — sin el dev-lead (no se cambia nada).

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node src/app.js libres 25:00-26:00` → «franja no válida: usa HH:MM-HH:MM» (antes `Norte, Sur`) | ✅ agente |
| 2 | RED: el test nuevo falló con `Norte, Sur` antes del fix; después, verde | ✅ agente |
| 3 | `libres 10:00-12:00` sigue dando `Sur` | ✅ agente |

Gate: `node --test && node scripts/lint.mjs` → node --test: corrió 5/5 · lint: sin hallazgos

## 5. Tiempo (ligero)

- Estimación: 0,5 h (sin duración del gate de cierre: el patch 0007 no la registró)
- Inicio: 2026-10-28T22:18Z
- Esfuerzo real: 0,04 h — reloj de la sesión 0,04 h desde 2026-10-28T22:16Z, sin 0 min de espera al dev-lead (0 esperas)
- Coste de sujetos: no aplica
