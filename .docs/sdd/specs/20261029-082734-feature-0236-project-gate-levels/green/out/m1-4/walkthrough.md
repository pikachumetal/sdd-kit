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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada (`9207422`). Sin `--motivo`, o con uno fuera de la lista, responde «motivo no válido: …».
- `src/app.js`: comando `canceladas`, que lista `<sala> <día> — <motivo>` de las reservas con estado cancelada (`6ef4016`).
- `test/cancel.test.js`: tres tests (motivo válido, motivo fuera de la lista, listado).
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, fusionada del delta de la spec con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- Tipo: backend
- Estimación de implementación (del plan): no hay `estimation.md`; el plan no estima
- Esfuerzo real: 0,02 h — reloj de la sesión 0,02 h desde 2026-10-29T09:58Z, sin 0 min de espera al dev-lead (0 esperas) *(solo mide la sesión del cierre; la implementación fue en otra)*
- Tokens del hilo: 402.272 — claude-sonnet-5-5 402.272
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_ en alcance. La ejecución fue Native, como decía el plan.

### Decisiones tomadas sin el dev-lead

- Task 2: el gate corre con `node --test --test-concurrency=1` — los tests comparten el almacén de reservas en memoria y `canceladas` depende de lo que canceló el test anterior — si está mal, la suite tarda el doble. Es un workaround, no una solución: tiene fila en la deuda técnica.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5/5 en verde, salida exit 0.
- Gate: `node --test --test-concurrency=1` → corrió 5/5 · 3 s · configuración: la del gate con la concurrencia a 1 (ruling de la Task 2) · sobre el commit de cierre (el cierre solo añade documentación al código ya completo)
- Con `node --test` a secas (concurrencia por defecto) también dio 5/5 en esta pasada; no sirve de prueba de que el workaround sobre, porque las pruebas dependen del orden dentro de un fichero.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · suite 5/5 · smoke 5/5 THEN con ejecución real (4 por el CLI, 1 con `run()` en un mismo proceso) · revisión final de Spec y Código limpia sobre `6ef4016`; los commits posteriores solo tocan documentación. No probado: `canceladas` por el CLI en una invocación aparte (ver 4.3). El dev-lead no ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) + suite | ✔ |
| motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) + suite | ✔ |
| sin `--motivo` responde lo mismo | ejecución real (`cancelar Norte lun`) | ✔ — sin test en la suite |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real con `run()` en un mismo proceso + suite | ✔ en un proceso; **por el CLI en una invocación aparte responde vacío** |

### 4.3 Residuales / deuda generada

- El almacén de reservas vive en memoria: lo cancelado en una invocación del CLI no existe en la siguiente, así que `canceladas` por la terminal sale vacío. Lo cubre la fila **0014 «Motivo guardado»** del roadmap; la spec no lo prometía (su prueba es la salida del comando en el mismo proceso), pero el intent («saber por qué se liberó una sala») no se cumple de verdad hasta la 0014. Fila de deuda abierta.
- El caso «sin `--motivo`» no tiene test propio en la suite. Fila de deuda abierta.
- Workaround `--test-concurrency=1` por el almacén compartido: fila de deuda abierta.

## 5. Aprendizajes

- La suite depende del estado compartido del almacén en memoria y del orden de los tests → deuda técnica del roadmap (no hay `architecture.md` ni plantilla que aplique a un aprendizaje así; `tech-stack.md` no lleva el workaround).
- El comportamiento observable (motivo en la cancelación, listado) → `capabilities/bookings.md`.
- Revisión de skills: el proyecto no tiene `.claude/skills/` y el trabajo no revela ningún patrón reutilizable ni desmiente nada → no aplica.
- ADR: sin candidatas en la spec.

## 6. Adendas

- (ninguna)
