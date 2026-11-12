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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde «cancelada Norte lun (sala ocupada)»; fuera de la lista o sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro» (`f697955`).
- `src/app.js`: comando `canceladas`, que lista «sala día — motivo» de las reservas canceladas (`fe348a0`).
- `test/cancel.test.js`: los tres casos de arriba.
- `capabilities/bookings.md`: creada por el merge del delta de la spec (dos requisitos ADDED).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, para esquivar una carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Al cierre, `node --test` sin la opción pasó 3/3: la carrera no se reproduce; fila en «Por triar» de `debt.md`.
- Re-revisión: el Important «el ruling relaja el gate de la constitución» lo adjudiqué como no-relajación (sigue corriendo la suite entera, en serie); se corrigió la falta real, la fila de deuda del workaround.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5/5 en verde, 166 ms, sobre el commit de cierre (el cierre no toca código; su salida entera está en el scratchpad de la sesión). `node --test` sin la opción, 3 pasadas, 5/5.
- Gate: `node --test --test-concurrency=1` → suite: corrió 5/5 · sobre el commit de cierre. El proyecto no declara `operations.md` ni «Suites».

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 5/5 · smoke 5/5 THEN con ejecución real (la CLI de `src/app.js`, la salida de cada THEN sacada de la propia app) · revisión final Spec y Código limpias sobre `fe348a0`, re-revisión de lo posterior a la Task 2 con 1 Minor corregido y 1 Important adjudicado. No lo ha validado el dev-lead: lo verificó el agente.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | ✅ |
| Motivo fuera de la lista (`--motivo "me aburro"`) → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ✅ |
| Sin `--motivo` → el mismo mensaje | ejecución real | ✅ |
| `canceladas` tras cancelar Norte lun con «sala ocupada» → «Norte lun — sala ocupada» | ejecución real (un solo proceso: el almacén es en memoria) | ✅ |
| El listado enseña el motivo (mismo requisito, vía `test/cancel.test.js`) | suite | ✅ |

### 4.3 Residuales / deuda generada

- Workaround `--test-concurrency=1` sin carrera reproducible: «Por triar» de `debt.md`.
- Saldada en `debt.md`: «El motivo de cancelar no se valida» (entera). «Los motivos no se traducen» queda reescrita a lo que falta: el inglés.

## 5. Aprendizajes

- Un workaround del gate necesita su fila de deuda en el mismo cierre → `steering/debt.md`.
- Comportamiento observable nuevo (motivo al cancelar, listado de canceladas) → `capabilities/bookings.md`.

Retro: error que cazaría un chequeo → ticket del kit: `tasks.md` aceptó dos tasks con el mismo commit (`fe348a0` en la 1 y la 2) y solo la re-revisión lo cazó; un chequeo del CLI que compare cada sha con la task lo vería

## 6. Adendas

- _Ninguna_
