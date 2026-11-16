---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-11
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`, `test/cancel.test.js`: `cancelar <sala> <día> --motivo <motivo>` con la lista cerrada (cambio de planes, sala ocupada, otro); sin motivo o fuera de la lista responde «motivo no válido: …» (6770fb1).
- `src/app.js`, `test/cancel.test.js`: comando `canceladas`, que lista «sala día — motivo» (42fa1c4).
- `e2e/cancel.e2e.mjs`: tres tests nuevos o cambiados (42fa1c4 y 6770fb1).
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, fusionada con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el ruling de `--test-concurrency=1` queda corregido en `tasks.md`: esa opción no la aplica ningún gate y el problema no era una carrera sino una dependencia de orden entre tests — coste si está mal: el workaround se creyó real y no lo era.
- Cierre: no arreglo la dependencia de orden de `canceladas enseña sala, día y motivo`; es un cambio de código posterior a la revisión final y la spec no lo pide. Deuda en «Por triar» — coste si está mal: el test falla si se filtra o se reordena.
- Cierre: corregí en `tasks.md` el commit de la Task 1 (6770fb1, no 42fa1c4).

## 4. Verificación

### 4.1 Builds

- Gate: `node --test test/` · `node --test test/ && node e2e/run.mjs` → unitarios 5/5 · E2E 7/7 · 48,2 s · configuración: la del gate (traza completa, sin variables ni opciones añadidas) · sobre el commit de cierre (el cierre junta el último commit, solo documentación).
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:55375/health` → `ok`, levantado en esta sesión antes de cada pasada y parado después.
- E2E: 48,2 s de 0,5 min (pasa del presupuesto: deuda en 4.3).
- Tanda: `# Tanda: 3 tests cambiados de e2e/cancel.e2e.mjs ×3 + los 2 demás de ese fichero ×1 = 11 ejecuciones · ~1,4 min (7,7 s de media × 11 ÷ 1 worker); free.e2e.mjs no lo toca la rama` — 11/11 verdes, 84,3 s reales (1,4 min).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · gate sobre el commit de cierre (unitarios 5/5, E2E 7/7) · tanda E2E 11/11 · smoke 4/4 THEN con ejecución real contra el servidor levantado en esta sesión · revisión final Spec y Código limpias sobre 42fa1c4 · re-revisión de 42fa1c4 a HEAD con 2 hallazgos (1 Important adjudicado, 1 Minor corregido, ver §3).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| un motivo fuera de la lista («me aburro») responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | ok |

### 4.3 Residuales / deuda generada

- `canceladas enseña sala, día y motivo` depende del orden de los tests: ejecutado solo falla. Fila en «Por triar» de `debt.md`.
- Suite E2E: 48,2 s de 0,5 min de presupuesto — deuda del proyecto, fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- Un ruling sobre el gate hay que contrastarlo con el gate declarado: este citaba una opción que nadie aplicaba → corregido en `tasks.md`.

Retro: error que cazaría un chequeo → fila en «Por triar» de la deuda, con el chequeo propuesto (que cada test unitario pase solo); no lo creo aquí porque es código posterior a la revisión final (`.docs/sdd/steering/debt.md`)

## 6. Adendas

- _Ninguna_
