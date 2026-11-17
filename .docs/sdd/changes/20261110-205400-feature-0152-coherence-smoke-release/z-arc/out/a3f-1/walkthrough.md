---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-12
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>`: el motivo es de una lista cerrada (cambio de planes, sala ocupada, otro); uno fuera de la lista, o sin `--motivo`, responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` — 8b78571.
- `canceladas`: lista «sala día — motivo» de las reservas canceladas. `src/app.js`, `test/cancel.test.js` — 967002a.
- Capacidad `bookings` creada al fusionar el delta de la spec (`.docs/sdd/capabilities/bookings.md`).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (deuda en «Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` entera: 6/6 en verde sobre el commit de cierre (sin cambios de código desde d78baae). Su primera pasada salió 5/6: ver 4.3.
- Gate: `node --test` → corrió 6/6 · sobre el commit de cierre. El proyecto no declara «Suites» ni gate propio (sin `operations.md`).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 6/6 (tras la pasada roja de `ids.test.js`, ver 4.3) · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpias sobre 967002a; lo posterior es solo `tasks.md`. Lo reportado por el dev-lead: nada.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| un motivo fuera de la lista (`cancelar Sur mar --motivo "me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` (`cancelar Norte lun`) responde lo mismo | ejecución real | ok |
| `canceladas` tras cancelar Norte lun con «sala ocupada» responde «Norte lun — sala ocupada» | ejecución real (`run` en un mismo proceso) | ok |

### 4.3 Residuales / deuda generada

- `test/ids.test.js` (de c04c778, ya en `develop`, no de esta rama) falló en la primera pasada: `TypeError [Error]: Cannot read properties of undefined (reading 'trim')`. Depende de un fichero `ids-store` en el directorio común de git: sin él falla y lo crea; con él pasa. Contraste: el fichero solo, en la rama y en un worktree desacoplado de `develop`, y la suite entera en ambos: en verde (6/6 y 5/5). Sin limpiar el estado no se repite; fila en «Por triar».
- Cada `node src/app.js …` es un proceso nuevo y el almacén es en memoria: `canceladas` en una invocación aparte no ve la cancelación de otra. Lo cubre la 0014 «Motivo guardado» (ya en el roadmap).
- El test de `canceladas` depende del primero (ruling de la Task 2): fila en «Por triar».

## 5. Aprendizajes

- Un test que lee el estado que dejó una pasada anterior solo falla la primera vez en un clon limpio: se ve en el primer `node --test` de un worktree nuevo → deuda (`debt.md`, «Por triar»).

Retro: sin señales
