---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-01
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …». Commit 9c8d692.
- `src/app.js`: comando `canceladas`, que lista «sala día — motivo». Commit 45bb640.
- `test/cancel.test.js`: tests de ambos comandos.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, fusionada con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Fila en «Por triar» de la deuda.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, ejecutado por el agente en el cierre.
- Gate: `node --test` → suite: corrió 5/5 · sobre 7cb0688 (HEAD tras la revisión final; desde 45bb640 solo cambió `tasks.md`).
- Revisión final: Spec (opus, high) limpia · Código (sonnet, high) limpia · Arquitectura no (plan), sobre 45bb640.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-01 · suite 5/5 · smoke con ejecución real de la CLI en 3 de los 4 THEN; el listado de `canceladas`, solo en un mismo proceso; revisión final de Spec y Código limpia sobre 45bb640. El dev-lead no ha probado nada a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real + suite | `node src/app.js …` devuelve exactamente eso |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`cancelar Sur mar --motivo xyz`) + suite | devuelve exactamente eso |
| sin `--motivo` responde lo mismo | ejecución real (`cancelar Norte lun`) | devuelve exactamente eso; sin test en la suite |
| `canceladas` responde «Norte lun — sala ocupada» | suite + ejecución real en un mismo proceso (`run('cancelar')` y luego `run('canceladas')`) | correcto en un proceso. Desde la CLI, `canceladas` en un proceso nuevo responde vacío: las reservas viven solo en memoria. Es anterior a esta feature y no cambia con ella |

### 4.3 Residuales / deuda generada

- Las reservas no persisten entre ejecuciones de la CLI, así que `cancelar` y `canceladas` solo se ven juntos dentro de un proceso. Anterior a la 0010; a «Por triar».
- Los tests comparten el almacén en memoria y `canceladas` depende de que `cancelar` corra antes (de ahí el workaround del gate). A «Por triar».
- Sin test del `cancelar` sin `--motivo`; cubierto solo por el smoke. A «Por triar».
- Los motivos siguen sin traducirse al inglés: la fila de deuda queda, reescrita a lo que falta.

## 5. Aprendizajes

- El comportamiento observable (motivo obligatorio y listado) → `.docs/sdd/capabilities/bookings.md`.
- El workaround de concurrencia se queda en la deuda, no en `tech-stack.md`: allí no se ha escrito.
- Sin cambio estructural, sin convención nueva y sin ADR. El proyecto no tiene `.claude/skills/`; reviso que no hay ahí ningún patrón que justifique crear la primera: no aplica.

## 6. Adendas

