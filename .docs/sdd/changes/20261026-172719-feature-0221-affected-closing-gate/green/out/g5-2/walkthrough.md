---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-26
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o fuera de la lista responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` — ad5eaa4.
- `canceladas` lista las reservas canceladas con su motivo («Norte lun — sala ocupada»). `src/app.js`, `test/cancel.test.js` — 023bb98.
- Capacidad nueva `bookings` fusionada desde la spec (`capabilities/bookings.md`), entrada de changelog y fila 0010 del roadmap en ✅.

## 3. Desviaciones del plan

- _Ninguna_ en alcance. La Validación final del plan pedía `node --test`; el gate de cierre del proyecto es el de la constitution (`node scripts/gate.mjs run bookings:test rooms:test --affected --base develop`) y es el que se ha corrido.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. (Ojo: ese flag no está hoy en `gate.json`; ver 4.3.)

## 4. Verificación

### 4.1 Builds

- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop`. La corrida en verde de la rama (1 s) está anotada por el hilo de implementación; `develop` avanzó un commit (0015, test de `rooms`) después, así que el cierre lo corre una vez más sobre la rama integrada con la base y esa es la que da el resultado final del cierre (mensaje final).

### 4.2 Smoke / tests

Validación en campo: 2026-10-26 · smoke de los 3 THEN con ejecución real (4 casos) sobre 023bb98 (el código no cambia después) · revisión final Spec y Código (opus+high, sonnet+high), limpia · no probado: el flujo cancelar→canceladas por la CLI de un solo proceso (el almacén es en memoria y cada invocación arranca vacía; se encadenó importando `run`).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real + suite | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | ok |
| sin `--motivo` → el mismo mensaje | ejecución real | ok (sin test en la suite) |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real + suite | ok |

Corrección al borrador: decía haber probado `cancelar Norte lun --motivo sala-ocupada`; ese comando devuelve «motivo no válido» (el motivo se escribe «sala ocupada»), así que no valía como evidencia y se ha sustituido por la tabla.

### 4.3 Residuales / deuda generada

- Carrera de los tests sobre el almacén en memoria compartido, esquivada con un ruling que no está en `gate.json` — fila nueva en la deuda del roadmap.
- «sin `--motivo`» no tiene test en `test/cancel.test.js`; cubierto solo por ejecución real.

## 5. Aprendizajes

- El almacén en memoria compartido entre tests provoca carreras si el runner paraleliza → deuda del roadmap (no hay `architecture.md` ni skills en `.claude/skills/` donde volcarlo; `architecture.md` no existe: no se crea porque el aprendizaje es una deuda, no una decisión estructural).
- Skills: el proyecto no tiene `.claude/skills/`; no aplica.

## 6. Adendas

- _Ninguna_
