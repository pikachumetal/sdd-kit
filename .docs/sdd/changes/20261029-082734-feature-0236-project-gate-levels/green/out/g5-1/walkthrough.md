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

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — `src/app.js`, `test/cancel.test.js` (515af72).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas — `src/app.js`, `test/cancel.test.js` (ba5233d).
- Capacidad `bookings` creada con los dos requisitos (`capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

- `.docs/sdd/estimation.md` no existe en el proyecto: sin bloque de estimación.

## 3. Desviaciones del plan

- _Ninguna_ en alcance. La spec decía «Sin review de spec» y el plan, dos tasks Native; así se hizo.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. **Ojo:** el ruling quedó solo apuntado en `tasks.md`; `gate.json` no lleva ese flag (`bookings:test` sigue siendo `node --test test/app.test.js test/cancel.test.js`) y la suite pasa sin él. Queda como fila de deuda.

## 4. Verificación

### 4.1 Builds

- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 5 pasados, 0 fallidos · rooms:test: saltada (no la afecta el cambio) · 1 s · configuración: la del gate · sobre el commit de cierre (el árbol de código es el de ba5233d; lo posterior es documentación).
- Revisión final: Spec (opus, high) y Código (sonnet, high) limpias sobre ba5233d; Arquitectura no (lo dice el plan). Lo que cambió después hasta HEAD es `tasks.md` (17 líneas de documentación): sin re-revisión.

### 4.2 Smoke / tests

Validación en campo: 2026-10-29 · suite en verde sobre el commit de cierre (5/5 de `bookings:test`) y smoke del agente con ejecución real de los 5 THEN/AND de la spec; el listado se probó en un solo proceso porque el almacén es en memoria y `node src/app.js canceladas` en un proceso aparte arranca vacío.

Corrección del borrador previo: la línea de campo anterior citaba `--motivo sala-ocupada`; ese valor no está en la lista y el comando responde «motivo no válido»: no era un smoke de la spec. Reemplazado por los de la tabla.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) + suite | ✅ |
| Motivo fuera de la lista («me aburro») → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | ✅ |
| Sin `--motivo` → el mismo mensaje | ejecución real (sin test en la suite) | ✅ |
| `canceladas` tras cancelar con «sala ocupada» → «Norte lun — sala ocupada» | ejecución real en un solo proceso + suite | ✅ |

### 4.3 Residuales / deuda generada

- Los motivos no se persisten: viven en memoria. Lo cubre la fila 0014 del roadmap, no esta feature.
- Deuda: carrera de los tests sobre el almacén compartido en memoria (workaround del ruling de la Task 2, no aplicado en `gate.json`) → fila en la deuda técnica del roadmap.
- «Sin `--motivo`» no tiene test en `test/cancel.test.js`; solo smoke.

## 5. Aprendizajes

- Los tests comparten el almacén en memoria y dependen del orden → deuda técnica del roadmap (aislar el almacén por test).
- Skills del proyecto: no hay `.claude/skills/`; miré y no aplica, el trabajo no revela patrón reutilizable.
- Comportamiento observable → `capabilities/bookings.md` (fusionado con `sdd capability merge`).
- Sin ADR: la spec no declaraba candidatas.

## 6. Adendas

- _Ninguna_
