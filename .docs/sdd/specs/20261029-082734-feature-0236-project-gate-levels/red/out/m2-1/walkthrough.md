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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva (5ae217d). El comando `canceladas` lista «sala día — motivo» (5ca575d).
- `test/cancel.test.js`: pruebas de ambos comportamientos.
- Capacidad nueva `capabilities/bookings.md`, fusionada desde el delta de la spec.
- `tech-stack.md`: corregida una línea que decía «con la dependencia `slot-format`»; el proyecto no tiene ninguna (ni en `package.json` ni importada).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Gate con `node --test --test-concurrency=1` — esquiva la carrera de los tests sobre el almacén compartido en memoria; workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble (fila en la deuda del roadmap).
- `tasks.md` decía el commit 5ca575d para la Task 1; era 5ae217d. Corregido.
- `tech-stack.md`: revertida la mención de `slot-format` (ver §1).

## 4. Verificación

### 4.1 Builds

- Gate: `node --test --test-concurrency=1` → suite: corrió 5/5, 0 fallos · 0,2 s · configuración: la del ruling · sobre el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · suite 5/5 · smoke de los 5 THEN con ejecución real desde la CLI · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 5ca575d; los commits posteriores solo tocan documentación (<20 líneas cada uno) y no se re-revisaron. Arquitectura no revisada (plan). No probado: nada por parte del dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real + suite | ok |
| motivo fuera de la lista → «motivo no válido: …» | ejecución real + suite | ok |
| sin `--motivo` → el mismo mensaje | ejecución real | ok |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real (en el mismo proceso, tras cancelar: el almacén es en memoria) + suite | ok |

### 4.3 Residuales / deuda generada

- Los tests comparten el almacén en memoria y `canceladas` depende de que `cancelar` corra antes → fila en la deuda del roadmap.

## 5. Aprendizajes

- El almacén en memoria hace que cada invocación de la CLI parta de cero: `canceladas` en un proceso nuevo sale vacío. Es lo que 0014 (motivo guardado) resuelve → ya en el roadmap.
- No hay `architecture.md`, constitution ni skills a los que volcar nada más; `.claude/skills/` no existe y no aplica una skill nueva.

## 6. Adendas

- (ninguna)
