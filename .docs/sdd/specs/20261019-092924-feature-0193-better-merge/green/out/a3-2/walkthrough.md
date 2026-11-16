---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-19
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde `cancelada <sala> <día> (<motivo>)`; un motivo fuera de la lista o sin `--motivo` responde `motivo no válido: …`. `src/app.js`, `test/cancel.test.js` — 189ffe6.
- `canceladas` lista las reservas canceladas como `<sala> <día> — <motivo>`. `src/app.js`, `test/cancel.test.js` — 4007125.
- Capacidad `bookings` creada con los dos requisitos del delta (`capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

El proyecto no tiene `estimation.md`: no hay estimación que comparar.

- Tokens del hilo: 680.016 — claude-sonnet-5-5 680.016
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Esfuerzo real: 0,02 h — reloj de la sesión 0,02 h desde 2026-10-19T10:42Z, sin 0 min de espera al dev-lead (1 espera) *(solo mide la sesión del cierre)*
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar una carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. En el cierre la suite también pasa sin la opción (`node --test`, 5/5), así que la carrera no se reprodujo; queda en deuda.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test` → 5/5 en verde, 92 ms, sobre el árbol de 174cf70 (código idéntico al de 4007125; el commit posterior solo toca `tasks.md`). Con `--test-concurrency=1` también 5/5, 167 ms.
- Revisión final: Spec (opus+high) limpia y Código (sonnet+high) limpia, sobre 4007125; Arquitectura no (lo dice el plan). Sin re-revisión: el commit posterior es solo documentación.

### 4.2 Smoke / tests

Validación en campo: 2026-10-19 · suite 5/5 · smoke 4/4 THEN con ejecución real (un solo proceso, porque el almacén vive en memoria) · revisión final Spec y Código sobre 4007125, limpia

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real + suite | ok |
| Motivo fuera de la lista («me aburro») → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | ok |
| Sin `--motivo` → el mismo «motivo no válido: …» | ejecución real | ok (sin test en la suite) |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real + suite | ok |

### 4.3 Residuales / deuda generada

- Carrera entre tests por el almacén compartido en memoria, sin reproducir: fila en la deuda del roadmap.
- El THEN «sin `--motivo`» no tiene test en `test/cancel.test.js`: solo lo cubre el smoke.

## 5. Aprendizajes

- El motivo se guarda con la reserva en memoria; la 0014 («Motivo guardado») pide guardarlo en el almacén de reservas → roadmap 0014: revisar su alcance a la vista de esto.
- Skills: el proyecto no tiene `.claude/skills/` (comprobado); no aplica.
- Sin aprendizajes estructurales: el proyecto no tiene `architecture.md` y ninguno lo pide.

## 6. Adendas

- (ninguna)
