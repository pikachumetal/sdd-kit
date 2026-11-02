---
id: 20261102-192226-patch-0295-rubric-text-row
task: 0295
title: Patch — una fila de rúbrica `text:` comprueba lo que el sujeto dice
type: patch
solution: dev-lead
status: done
created: 2026-11-02
branch: patch/0295-rubric-text-row
commit: 
---

# Patch 0295 — Una fila de rúbrica `text:` comprueba lo que el sujeto dice

Validación: agente, «Perfil delegate» — `validation.mode: field`: el uso real lo validan los tickets.

## Capacidades

- Ninguna, porque ninguna capacidad describe las filas de rúbrica de `battery.mjs`

## 1. Síntoma

Ticket de la feature 0291 §1: «califiqué la fila `C10` a mano con `grep -n "🦆\|✋"` en Git Bash. El 🦆 no coincide nunca […]. Di RED 1/3 cuando era 3/3 limpio». Costó una parada a destiempo y 8,81 $ de sujetos.

## 2. Solución fijada

Del dev-lead, en la petición: «una fila de rúbrica `text: /<regex>/` en `battery.mjs` comprueba con Node el `texts.txt` del sujeto, también con emoji». «Sigue la forma y el veredicto de `file:` que dejó la 0273» y «una fila `text:` cuenta como comprobada por máquina en la línea de veredicto».

Lo que da por existente, comprobado: `fileCheck` y `compileCheck` en `tests/headless/battery.mjs`, y `extract.mjs` deja `<salida>/<etiqueta>.texts.txt` (`cli/test/kit/headless/lib.test.ts`).

## 3. Fix

- **Fichero(s)**: `tests/headless/battery.mjs`, `cli/test/kit/headless/battery.test.ts`, `tests/batteries/sdd-verify/battery.md`, `.docs/sdd/tech-stack.md`.
- **Cambio**: `compileCheck` reconoce `` `text: /<regex>/` `` con la comprobación de `file:` sobre `<salida>/<etiqueta>.texts.txt`. La batería de `sdd-verify` gana la fila del 🦆 de `c10`, y su aviso de contar con Node remite a ella.
- **Decisiones**:
  - La regex de `text:` compila con las banderas `mu`, para que `\u{1F986}` y una clase con emoji funcionen — ticket
  - Sin `texts.txt` la fila falla, igual que `file:` sin su fichero — dev-lead
  - La fila se llama `C10D` y mira solo el 🦆; `C10` sigue en prosa con el resto de la conducta — sin el dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `npx vitest run test/kit/headless/battery.test.ts`, antes del fix | ❌ 11 rojos de 89: `text:` caía como prosa (`puerta verde`) y no se rechazaba mal escrita |
| 2 | GREEN: el mismo comando | ✅ 89/89: `text: /🦆/`, `\u{1F986}` y `[🦆✋]` pasan con 🦆 y dan rojo sin él; sin `texts.txt`, rojo; con CRLF, casa; una fila en prosa sigue dando `puerta verde · sin leer` · suite |
| 3 | `battery.mjs verdict` con `C10D` sobre `red/out` de la 0291, las salidas reales | ✅ `c10 · 3/3 · umbral 3/3 · puerta verde · sin leer: C10, L`: el 3/3 que el `grep` dio como 1/3 · ejecución real |

Los casos los verificó el agente.

## 5. Tiempo (ligero)

- Estimación: 0,4 h + 0,07 h del gate de cierre (4 min, patch 0286)
- Inicio: 2026-11-02T19:22Z
