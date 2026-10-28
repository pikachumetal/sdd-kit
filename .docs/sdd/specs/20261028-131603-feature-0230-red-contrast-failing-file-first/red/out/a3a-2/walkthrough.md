---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-28
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y responde `cancelada <sala> <día> (<motivo>)`; sin motivo o con uno fuera de la lista responde `motivo no válido: …` (`src/app.js`, c09b571).
- `canceladas` lista las reservas canceladas como `<sala> <día> — <motivo>` (`src/app.js`, a1121d2).
- Capacidad nueva `bookings` fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_ en los ficheros ni en las tasks. El gate del plan (`node --test`) se cerró con el gate filtrado del proyecto (`gate.json`).

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. **Nota del cierre:** el repo no lleva esa opción en ninguna parte (ni `gate.json` ni `tech-stack.md`); el ruling quedó solo en `tasks.md`, y el rojo que sí apareció en el cierre es otro (ver 4.1).

## 4. Verificación

### 4.1 Builds

- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 5/6 (1 fallo) · rooms:test: saltada (sus entradas `src/rooms.js` y `test/rooms.test.js` no cambian respecto a `develop`) · sobre 850c10a. **Rojo**, contrastado:
  - Mismo comando de `bookings:test` (`node --test test/app.test.js test/cancel.test.js test/store.test.js`) en `develop` (0d634e2), sin limpiar estado: 5/5 verde.
  - Otra vez en la rama (850c10a): 6/6 verde.
  - «No se repite»: flaky. Causa visible en `test/store.test.js`: la primera ejecución sin `store-lock` en el git-common-dir lanza `EBUSY: resource busy or locked, open 'data/bookings.json'`. La salida guardada del gate solo trae los recuentos, no esa línea; la copio del `throw` del test. Fila de deuda abierta en el roadmap.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-28 · verificación del agente: 4/4 THEN con ejecución real (comandos de abajo) · suite en la rama 6/6 tras un primer rojo flaky contrastado en `develop` · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre a1121d2; HEAD solo añadió `tasks.md` (documentación), sin re-revisión · no probado: Arquitectura (el plan no la pide), el dev-lead no ha probado a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real + suite | ok |
| Motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) + suite | ok |
| Sin `--motivo` → la misma respuesta | ejecución real; la suite no lo cubre | ok |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real, en un solo proceso | ok |

### 4.3 Residuales / deuda generada

- El almacén es en memoria: `canceladas` en un proceso aparte de `cancelar` sale vacío. Es lo que pide la 0014 (motivo guardado).
- Test flaky de `store.test.js`: fila en la deuda técnica del roadmap.
- Falta un test para «sin `--motivo`» en `test/cancel.test.js`; solo lo cubre el smoke.

## 5. Aprendizajes

- Comportamiento observable → `capabilities/bookings.md` (creada por el merge del delta).
- Revisión de skills: el proyecto no tiene `.claude/skills/`; la feature no revela un patrón reutilizable ni desmiente ninguna skill — no aplica.
- Sin cambio estructural ni convención nueva: no hay nada para `architecture.md` ni `constitution.md`.

## 6. Adendas

- (ninguna)
