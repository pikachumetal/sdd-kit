---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-16
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — `src/app.js`, `test/cancel.test.js` (87f302e).
- `canceladas` lista las reservas canceladas como «<sala> <día> — <motivo>» — `src/app.js`, `test/cancel.test.js` (19e7e81).
- La capacidad `bookings` nace con los dos requisitos del delta (`capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ respecto a lo que enseña el producto. La puerta del plan era `node --test`; la ejecución usó `node --test --test-concurrency=1` (ruling de abajo).
- Cierre: la fila de la Task 1 en `tasks.md` citaba 19e7e81; su commit real es 87f302e, corregido.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Pasa a la tabla de deuda del roadmap.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test --test-concurrency=1` → 5/5 pasan, 0 fallos · 0,2 s · sobre el árbol del cierre (sin cambios de código desde 19e7e81).
- Revisión final (`tasks.md`): Spec (opus, high) limpia · Código (sonnet, high) limpia · Arquitectura no (plan), sobre 19e7e81. Después de ese commit solo entraron commits de documentación (`tasks.md`, la fila de la 0009 en el roadmap, una línea de `spec.md`), sin código: no hubo re-revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-16 · suite 5/5 · smoke de los 5 THEN con ejecución real por la CLI (`node src/app.js …`) y por `run` en un mismo proceso para el listado · revisión final Spec y Código limpia sobre 19e7e81. Lo que no he probado, lo dice la tabla.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | suite + ejecución real | ok |
| Motivo fuera de la lista («me aburro») responde «motivo no válido: cambio de planes, sala ocupada, otro» | suite + ejecución real | ok |
| Sin `--motivo` responde lo mismo | ejecución real (la suite no lo cubre) | ok |
| `canceladas` tras cancelar responde «Norte lun — sala ocupada» | suite + ejecución real en un mismo proceso | ok |
| `canceladas` en un proceso nuevo, sin cancelar antes | ejecución real | línea vacía; el almacén es en memoria y no persiste entre procesos (lo cubre la 0014) |

### 4.3 Residuales / deuda generada

- Falta un test de «sin `--motivo`» en `test/cancel.test.js`: el THEN solo está probado a mano.
- El test de `canceladas` depende del orden del test anterior y los tests comparten el almacén: fila en la deuda del roadmap, con el workaround `--test-concurrency=1`.
- Que el motivo sobreviva entre ejecuciones es la 0014; el informe por sala es la 0012. Fuera de scope aquí.

## 5. Aprendizajes

- La capacidad `bookings` y sus dos requisitos → `capabilities/bookings.md` (fusionado con `sdd capability merge`; `capability check` válido).
- El workaround de la concurrencia de tests → fila de deuda en el roadmap. No lo escribo en `tech-stack.md`: allí no hay sección de pruebas y un workaround no es una decisión.
- Revisión de skills: no existe `.claude/skills/` en el proyecto y la feature no revela ningún patrón reutilizable: no aplica.
- ADR: la spec no declara ninguna candidata.

## 6. Adendas

