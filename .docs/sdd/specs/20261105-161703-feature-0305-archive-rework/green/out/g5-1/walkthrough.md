---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-05
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro); fuera de la lista o sin `--motivo` responde `motivo no válido: …` — `src/app.js`, `test/cancel.test.js`, commit 0f67de6.
- Comando `canceladas`: lista `<sala> <día> — <motivo>` de las reservas canceladas — `src/app.js`, `test/cancel.test.js`, commit 9aaa317.
- Capacidad `bookings` creada con los dos requisitos del delta (`.docs/sdd/capabilities/bookings.md`).

## 3. Desviaciones del plan

- _Ninguna_ en el código: dos tasks, Native, como el plan.

### Decisiones tomadas sin el dev-lead

- Task 2 — `node --test --test-concurrency=1` en el gate, para esquivar una carrera de los tests sobre el almacén en memoria; workaround hasta aislar el almacén por test; coste si está mal: la suite tarda el doble. **No está aplicado en el repo**: ni `gate.json`, ni `scripts/gate.mjs`, ni la constitution lo llevan (la re-revisión del cierre lo señaló y `git grep concurrency` solo lo encuentra en `tasks.md`). Por eso no se escribió en `tech-stack.md` ni tiene fila de deuda como workaround; queda dicho aquí para que el dev-lead decida si se aplica o se descarta.

## 4. Verificación

### 4.1 Builds

- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 5/5 (5 passed, 0 failed) · rooms:test: saltada (sus inputs no cambian) · 1 s · configuración: la del gate · sobre el commit de cierre (el cierre junta el commit de `tasks.md`, solo documentación, sin código nuevo desde la Task 2).

### 4.2 Smoke / tests

Validación en campo: 2026-11-05 · smoke por THEN con ejecución real (`node src/app.js …`) y suite en verde; revisión final Spec y Código limpias sobre 9aaa317; re-revisión del tramo posterior (solo `tasks.md`) con dos hallazgos Important de registro, tratados en el cierre. No probado: `canceladas` en una segunda invocación de la CLI (ver 4.3).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` (con `--motivo "porque sí"`) |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (un solo proceso: `run('cancelar',…)` y `run('canceladas',[])`) + suite | `Norte lun — sala ocupada` |

El registro de campo previo del borrador citaba `--motivo sala-ocupada`, que no es un valor de la lista; el smoke de arriba lo sustituye.

### 4.3 Residuales / deuda generada

- `canceladas` solo ve lo cancelado en el mismo proceso: el almacén está en memoria y cada `node src/app.js …` empieza vacío. Fuera de scope de la 0010; lo cubre la fila 0014 «Motivo guardado» del roadmap.
- Los tests de `test/cancel.test.js` dependen del orden: `canceladas enseña sala, día y motivo` usa el estado que deja el primer test. Deuda nueva, fila en el roadmap.

## 5. Aprendizajes

- La lista de motivos es cerrada y vive en `src/app.js` (`reasons`); su comportamiento observable queda en la capacidad `bookings` → `capabilities/bookings.md`.
- Un ruling de «gate con concurrencia 1» sin aplicar en el repo no es un workaround registrado: no va a `tech-stack.md` hasta que exista → sin destino (decisión del dev-lead).

Retro: sin señales

## 6. Adendas

- _Ninguna_
