---
id: 20260929-161500-feature-0012-franja
feature: 0012
title: Walkthrough — Validar el formato de la franja
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-29
---

# Walkthrough — Validar el formato de la franja

## 1. Cambios realizados

- `src/slots.js`: `reserve` y `free` lanzan «Franja no válida: usa HH-HH, p. ej. 10-12» si la franja no casa con `/^\d{2}-\d{2}$/` (Task 1, `f89d818`; Task 2, `619a332`).
- Revisión final de rama: 1 hallazgo Important (el mensaje de `free` no era el literal de la spec), arreglado en la pasada de fix. Los arreglos y la documentación de cierre se juntaron en el commit de cierre.
- `.docs/sdd/capabilities/booking.md`: capacidad nueva con los dos requisitos ADDED de la spec.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en el código: dos tasks, un commit cada una, como en el plan.

### Decisiones tomadas sin el dev-lead

- Creé `capabilities/booking.md` en el cierre — la spec aprobada tiene su delta bajo «Capacidad: `booking`», pero no la declara en «Decisiones que he tomado yo» y la capacidad no existía; sin ella los ADDED no tenían destino — si el slug o la partición no son los del dev-lead, se renombra o se reparte en una feature aparte.
- Añadí a `spec.md` el bloque «## Capacidades» (`Nuevas: booking`) — `Test-Capabilities.ps1 -Artifact` falla sin él; no toqué ni el delta ni las aprobaciones — coste: una spec aprobada con un bloque que el dev-lead no vio.
- Marqué la fila 0012 del roadmap con `✅` en la celda «Tarea» — su tabla no tiene columna de estado y las cabeceras son literales — si prefiere quitar la fila o añadir la columna, es un cambio de una línea.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test` → 3 tests, 3 pass, 0 fail · 0,12 s (verificado por mí).

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-29 · «He probado `salas reservar Norte 1012` y `salas libres 1012`: los dos dan el error de la franja. Vale, funciona.»

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Reservar con franja que no casa con `HH-HH` falla con «Franja no válida: usa HH-HH, p. ej. 10-12» | ejecución real: `reserve('Norte','1012')` desde node → ese mensaje literal; suite `tests/slot-format.test.js`; el dev-lead lo probó con `salas reservar Norte 1012` | verificado por mí y reportado por el dev-lead |
| Consultar libres con franja inválida falla con el mismo mensaje | ejecución real: `free('1012')` desde node → mismo mensaje literal; el dev-lead lo probó con `salas libres 1012`. La suite (`tests/free-format.test.js`) solo comprueba `/Franja no válida/`, no el mensaje entero | verificado por mí y reportado por el dev-lead |

El repositorio no trae el ejecutable `salas`: mi comprobación fue sobre las funciones exportadas; el uso por la CLI es lo que reporta el dev-lead.

### 4.3 Residuales / deuda generada

- El test de `free` solo exige `/Franja no válida/`; un mensaje distinto tras ese prefijo pasaría la suite (es lo que dejó pasar el hallazgo de la revisión final). No lo cambié: fuera del alcance del cierre.

## 5. Aprendizajes

- Comportamiento observable nuevo (validación de la franja) → `capabilities/booking.md`.
- Sin aprendizajes de convención, estructura o herramientas: `constitution.md` no cambia y el proyecto no tiene `architecture.md` ni `tech-stack.md`.
- Revisión de skills: el proyecto no tiene `.claude/skills/`; nada que actualizar.

## 6. Adendas

_Ninguna._
