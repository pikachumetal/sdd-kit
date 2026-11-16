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

- `cancelar <sala> <día> --motivo <motivo>`: el motivo ha de ser uno de la lista cerrada (cambio de planes, sala ocupada, otro); fuera de ella, o sin `--motivo`, responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` — e0a470b.
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas. `src/app.js`, `test/cancel.test.js` — 36e1866.
- Capacidad nueva `bookings`, fusionada con `sdd capability merge` en `.docs/sdd/capabilities/bookings.md`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en la deuda).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde.
- Gate: `node --test` → suite: corrió 5/5 · configuración: la del gate · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 5 THEN: 4 con ejecución real, 1 con ejecución real solo en un proceso · revisión final Spec y Código sobre 36e1866, re-revisión limpia (0 sin revisar).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | ok |
| Motivo fuera de la lista («me aburro») responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | ok |
| Sin `--motivo` responde lo mismo | ejecución real (sin test: ver 4.3) | ok |
| `canceladas` tras cancelar responde «Norte lun — sala ocupada» | ejecución real en un mismo proceso + suite | ok en un proceso; ver 4.3 |

### 4.3 Residuales / deuda generada

- «Sin `--motivo`» no tiene test propio: lo cubre el código y el smoke, pero un cambio futuro podría romperlo sin que la suite avise. Lo señaló la re-revisión (fuera de su alcance) y la revisión final no lo vio. Fila en «Por triar» de la deuda.
- `node src/app.js canceladas` en un proceso aparte responde vacío: las reservas viven en memoria y el motivo no se guarda entre ejecuciones. Lo cubre la 0014 (Motivo guardado). Fila en la deuda.
- Los tests de `canceladas` dependen del orden (ver el ruling de 3). Fila en la deuda.

## 5. Aprendizajes

- Un THEN que se ve por la salida de la CLI hay que probarlo en un proceso aparte: `canceladas` pasaba en la suite y salía vacío en la CLI real → `.docs/sdd/steering/debt.md` (la 0014 lo arregla).

Retro: documento o skill desmentido → ticket del kit: `final-review-check.md` (punto 3) manda lanzar la re-revisión ante un commit de menos de 20 líneas solo de documentación, y `closing-the-review.md` dice que con solo commits así, revisados en el hilo, no se lance.

## 6. Adendas

- (ninguna)
