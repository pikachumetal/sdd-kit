---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-29
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (Task 1, `4a30344`): `cancelar <sala> <día> --motivo <motivo>` en `src/app.js`; la lista es cerrada (cambio de planes, sala ocupada, otro) y un motivo fuera de ella, o ausente, responde «motivo no válido: …». Tests en `test/cancel.test.js`.
- **Listado de canceladas** (Task 2, `009d76b`): comando `canceladas` en `src/app.js`, una línea «<sala> <día> — <motivo>» por reserva cancelada.
- Capacidad `bookings` creada con los dos requisitos de la spec (`capability merge`).

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. Sin `estimation.md` en el proyecto, no hay sección de tiempo.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria (workaround hasta aislar el almacén por test) — coste si es erróneo: la suite tarda el doble. **No está en el árbol**: ni `gate.json` ni `package.json` llevan el flag (`gate.json` no cambia desde `c489d32`), y la suite corre en verde sin él; el ruling no llegó al código. No añado fila de deuda por un workaround que no existe; si la carrera reaparece, esa es la deuda a abrir.

## 4. Verificación

### 4.1 Builds

- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió (5 pasan, 0 fallan) · rooms:test: saltada (no la toca la rama) · duración no registrada · configuración: la del gate · sobre 867e993

### 4.2 Smoke / tests

Validación en campo: 2026-10-29 · verificación del agente: suite en verde sobre 867e993 (bookings:test 5/5) y smoke por `node src/app.js` con ejecución real de los THEN de `cancelar`; el THEN de `canceladas` solo por suite (`no probado` a mano: cada invocación del CLI es un proceso nuevo y el almacén es en memoria, así que `canceladas` suelto responde vacío; lo cubre 0014, «Motivo guardado»). Revisión final de Spec y Código sobre 009d76b, limpia. El borrador anterior citaba `--motivo sala-ocupada`, que responde «motivo no válido»; sustituido por la ejecución real de abajo.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista (`vacaciones`) → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` → el mismo mensaje | ejecución real | ok |
| `canceladas` tras cancelar con «sala ocupada» → «Norte lun — sala ocupada» | suite (`test/cancel.test.js`) | ok · no probado a mano |

### 4.3 Residuales / deuda generada

- El motivo no sobrevive entre invocaciones del CLI (almacén en memoria): ya en el roadmap como 0014.
- Revisión final: `867e993` (solo `tasks.md`) se sumó tras la revisada `009d76b`; es documentación, bajo el umbral, sin re-revisión.

## 5. Aprendizajes

- Ninguno que no esté ya en la spec. Skills: el proyecto no tiene `.claude/skills/` (mirado); no aplica.

## 6. Adendas

- _Ninguna_
