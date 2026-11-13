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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda en la reserva cancelada y responde «cancelada Norte lun (sala ocupada)»; un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro». Comando nuevo `canceladas`, que lista «sala día — motivo». Commits: 58a0a88 (las dos tasks).
- `test/cancel.test.js`: tres tests (motivo válido, motivo fuera de la lista, listado).
- `capabilities/bookings.md`: capacidad nueva, fusionada con `sdd capability merge` desde el delta de la spec.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1`, para esquivar la carrera de los tests sobre el almacén compartido en memoria; workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. En el cierre no he podido reproducir la carrera: `node --test` y `node --test --test-concurrency=1` pasan 5/5 las dos. Va a deuda («Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5, exit 0. `node --test --test-concurrency=1` → 5/5, exit 0.
- Gate: `node --test` · `node --test --test-concurrency=1` → suite: corrió 5/5 · duración 0,1 s y 0,15 s · configuración: la del plan (§3) y el ruling de la Task 2 · sobre el commit de cierre
- No hay `operations.md` ni «Suites» declaradas: solo corre el gate del plan.

### 4.2 Smoke / tests

Validación en campo: 2026-11-11 · suite 5/5 · smoke 5/5 THEN con ejecución real (el último en un solo proceso: entre procesos de la CLI el listado sale vacío, lo cubre la 0014) · revisión final Spec y Código limpia sobre 58a0a88; el commit posterior, de 17 líneas solo en `tasks.md`, revisado en el hilo, sin re-revisión

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Norte lun --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real, en un solo proceso | `cancelar` y `canceladas` en el mismo proceso → `Norte lun — sala ocupada`; como dos invocaciones de la CLI, `canceladas` sale vacío |
| el motivo fuera de la lista se rechaza (test) | suite | `cancelar con un motivo fuera de la lista` |

### 4.3 Residuales / deuda generada

- El almacén vive en memoria: `canceladas` en otra invocación de la CLI no ve lo cancelado antes. Lo cubre la 0014 (Motivo guardado), ya en el roadmap.
- Workaround del gate (`--test-concurrency=1`) sin carrera reproducida, y los tests de `cancel.test.js` comparten el almacén (`canceladas` depende de la cancelación del test anterior): fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- Cancelar pide un motivo y `canceladas` lo enseña → `capabilities/bookings.md` (fusionada con `sdd capability merge`)
- Un workaround del gate sin carrera reproducida → fila en «Por triar» de `debt.md`; no hay `operations.md` donde apuntarlo

Retro: error que cazaría un chequeo → un chequeo: aislar el almacén por test, que quita el workaround y el acoplamiento entre tests; queda como fila en «Por triar» (.docs/sdd/steering/debt.md)
Retro: documento o skill desmentido → ticket del kit: `final-review-check.md` (punto 3) manda despachar la re-revisión para un commit de menos de 20 líneas solo de documentación, y `closing-the-review.md` y «Every commit of yours» de `sdd-implement` dicen que ese commit se revisa en el hilo y no se despacha

## 6. Adendas

- (ninguna)
