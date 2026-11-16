---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-21
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js` (f73118e, 44a3698): `cancelar` exige `--motivo` con un valor de la lista cerrada (cambio de planes, sala ocupada, otro); lo guarda con la reserva cancelada. Comando nuevo `canceladas`, que lista `<sala> <día> — <motivo>`.
- `test/cancel.test.js` (f73118e, 44a3698): tres tests unitarios nuevos. El test «cancelar sin reserva lo dice» se sustituyó por los de motivo, así que la rama «sin reserva» de `cancelar` ya no tiene test unitario.
- `e2e/cancel.e2e.mjs` (f73118e, 44a3698): tres specs nuevos o cambiados (con su motivo, motivo fuera de la lista, la cancelada sale en `canceladas`).
- Capacidad `bookings` creada con la delta de la spec.

## 3. Desviaciones del plan

- _Ninguna_. La 3. Validación final del plan dice `node --test`; se pasó el gate de `operations.md`.

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. No está aplicado en `operations.md` (el gate sigue siendo `node --test test/`); queda como fila de deuda.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test test/ && node e2e/run.mjs` → unit 5/5 · E2E 7/7 · 48,1 s de E2E · configuración: la del gate (traza `on`, sin `E2E_TRACE`) · sha 31b14ca
- Entorno de la suite: `node scripts/env-up.mjs` · `curl http://localhost:4377/health` → `ok`, levantado en esta sesión y parado al acabar con `env-down`
- E2E: 48,1 s de 0,5 min — pasa el presupuesto (ya pasaba sin la rama, con 6 s por paso): fila de deuda en el roadmap
- Tanda: 3 specs cambiados ×3 + 2 más de `e2e/cancel.e2e.mjs` ×1 = 11 ejecuciones · ~1,5 min estimados, 1,4 min reales (84,3 s). Resultado 11/11 verdes, sin inestabilidad. Con la pasada del gate, cada spec cambiado ha corrido 4 veces seguidas en verde.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-21 · suite unit 5/5 y E2E 7/7 · smoke 4/4 THEN con ejecución real · tanda E2E 11/11 · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 44a3698; el commit posterior (31b14ca) solo toca `tasks.md`

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real + suite (unit y E2E) | ok |
| un motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite (unit y E2E) | ok |
| sin `--motivo` → el mismo «motivo no válido…» | ejecución real (ninguna suite lo cubre) | ok |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real + suite | ok |

### 4.3 Residuales / deuda generada

- Los tests unitarios comparten el almacén en memoria y dependen del orden → fila de deuda.
- La suite E2E pasa de su presupuesto (48,1 s de 0,5 min) → fila de deuda.
- Sin test para «sin `--motivo`» ni para «cancelar sin reserva» (este último lo tenía antes de la 0010).
- La fila 0014 («Motivo guardado») pide guardar el motivo en el almacén; la 0010 ya lo guarda en la reserva en memoria. Falta decidir si la 0014 sigue haciendo falta.

## 5. Aprendizajes

- El almacén en memoria compartido por los tests obliga a un orden: queda en la deuda del roadmap. No hay `architecture.md` ni skills en el proyecto, y ningún otro aprendizaje necesita destino.

## 6. Adendas

- Sin adendas.
