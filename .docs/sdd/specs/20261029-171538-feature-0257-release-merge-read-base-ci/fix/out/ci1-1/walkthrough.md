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

- `src/app.js` (c166f31): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …».
- `src/app.js` (75c7c1b): comando `canceladas`, que lista las reservas canceladas como «<sala> <día> — <motivo>».
- `test/cancel.test.js` (c166f31, 75c7c1b): tres tests, uno por comportamiento probado en la suite.
- Capacidad `bookings` creada con el delta de la spec (`capabilities/bookings.md`).

## 3. Desviaciones del plan

- _Ninguna_ en el alcance: las dos tasks salieron como el plan. Solo el gate se ejecutó con una bandera más (ver el ruling).

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` en vez de `node --test` — para esquivar una carrera de los tests sobre el almacén compartido en memoria, workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Al cerrar, `node --test` sin la bandera también pasa 5/5, así que la carrera no se reprodujo; queda como deuda (fila en el roadmap).

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5 tests, 5 pass, 0 fail, 0,66 s (ejecución real, en esta sesión). `node --test` sin la bandera, el comando del gate de `constitution.md` y del CI de la base: 5/5, exit 0.
- Gate: `node --test` → suite única: corrió 5/5 · 0,7 s · configuración: la del gate, más `--test-concurrency=1` del ruling · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 75c7c1b, Arquitectura no (plan); 8f31cf1 solo cambia `tasks.md`, sin re-revisión. No probado por el dev-lead: lo verificó el agente.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | suite · ejecución real | ok |
| motivo fuera de la lista («me aburro») responde «motivo no válido: cambio de planes, sala ocupada, otro» | suite · ejecución real | ok |
| sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (sin test en la suite) | ok |
| `canceladas` responde «Norte lun — sala ocupada» | suite · ejecución real | ok |

### 4.3 Residuales / deuda generada

- Workaround `--test-concurrency=1` del ruling de la Task 2: fila en la deuda técnica del roadmap.
- Los tests de `canceladas` dependen del estado que deja el test de cancelar (almacén compartido, orden de ejecución): fila en la deuda técnica del roadmap.
- El THEN «sin `--motivo`» no tiene test en `test/cancel.test.js`, solo smoke: fila en la deuda técnica del roadmap.

## 5. Aprendizajes

- Los tests comparten el almacén en memoria de `src/app.js`: cada test debería partir de un almacén propio → deuda técnica del roadmap (no hay `architecture.md` ni plantilla de destino para una convención de tests; no se inventa).
- La lista de motivos es un comportamiento observable → `capabilities/bookings.md` (no se copia a `tech-stack.md`).
- Revisión de skills: no aplica — `.claude/skills/` no existe en el proyecto y el trabajo no reveló un patrón reutilizable ni desmintió ninguna skill.

## 6. Adendas

- _(ninguna)_
