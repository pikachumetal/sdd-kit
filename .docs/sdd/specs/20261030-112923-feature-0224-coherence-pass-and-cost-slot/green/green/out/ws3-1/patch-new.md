---
id: 20261030-122942-patch-0012-slot-format
task: 0012
title: Patch — Franja no válida en libres
type: patch
solution: ticket
status: done
created: 2026-10-30
branch: feature/0012-slot-format
commit: pendiente
---

# Patch 0012 — Franja no válida en libres

## Capacidades

Ninguna, porque ninguna capacidad describe `libres` (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

`libres 25:00-26:00` lista las salas («Norte, Sur») en lugar de rechazar la franja. Medido en `src/app.js:29`: `freeRooms(params[0])` compara el texto con las reservas sin validar su formato.

## 2. Solución fijada

Fila 0012 del roadmap (ticket): «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»». Lo que da por existente, comprobado: el comando `libres` existe (`src/app.js:29`, `test/app.test.js`).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida que la franja sea `HH:MM-HH:MM` con horas 00–23 y minutos 00–59; si no, responde `franja no válida: usa HH:MM-HH:MM`.
- **Decisiones**:
  - El texto del mensaje es el literal de la fila — ticket
  - «HH:MM» se lee como hora de reloj (00–23, 00–59), que es lo que hace inválida la `25:00` del ejemplo — ticket
  - Fuera de alcance, sin cambiar: `libres` sin argumento, y franjas con fin anterior o igual al inicio — ticket (la fila solo fija el formato)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `libres 25:00-26:00` → «franja no válida: usa HH:MM-HH:MM» (test RED→GREEN; CLI comprobada); `libres 10:00-12:00` sigue dando «Sur» | ✅ |

Gate: `node --test && node scripts/lint.mjs` → corrió 5/5 · lint sin hallazgos (diff: 2 ficheros, 3 líneas de código).

## 5. Tiempo (ligero)

- Estimación: 0,3h (estimada por el agente al abrir, antes del fix; sin estimación en la pregunta del carril)
- Inicio: 2026-10-30T12:29Z
- Esfuerzo real: 0,03 h — reloj de la sesión 0,03 h desde 2026-10-30T12:28Z, sin 0 min de espera al dev-lead (0 esperas)
- Coste de sujetos: no aplica
