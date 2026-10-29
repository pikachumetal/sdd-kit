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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde `cancelada <sala> <día> (<motivo>)`; sin motivo o con uno fuera de la lista responde `motivo no válido: …`. Comando nuevo `canceladas`, que lista `<sala> <día> — <motivo>`. Commits e5a1ba2 (cancelar) y 660debb (listado).
- `test/cancel.test.js`: tres pruebas (motivo válido, motivo fuera de la lista, listado).
- Capacidad `bookings`: creada al fusionar el delta de la spec.

## 3. Desviaciones del plan

- _Ninguna_ respecto a la spec.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria (workaround hasta aislar el almacén por test) — coste si es erróneo: la suite tarda el doble. **No aplicada:** `gate.json` no se tocó en la rama (`bookings:test` sigue siendo `node --test test/app.test.js test/cancel.test.js`), así que el ruling de `tasks.md` describe una decisión que no llegó al código. El riesgo de carrera sigue abierto y pasa a la deuda del roadmap.

## 4. Verificación

### 4.1 Builds

- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde · 1 s · configuración: la del gate · sobre el commit de cierre
- Tras integrar la base (`develop` trae `package-lock.json`, un fichero de «Sin filtro»), el gate se repite entero en el paso de la base integrada; su línea `Gate:` va en el mensaje final del cierre, porque este walkthrough ya está en el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-26 · smoke por THEN y suite en verde sobre el commit de cierre. Corrección del cierre (2026-10-29): la línea original probaba `--motivo sala-ocupada`, que la lista no admite y responde `motivo no válido`; el smoke del cierre usa el motivo con espacio, `"sala ocupada"`, y es el de la tabla.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js cancelar …`) · suite | ✅ |
| Motivo fuera de la lista (`"me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real · suite | ✅ |
| Sin `--motivo` responde lo mismo | ejecución real | ✅ (sin prueba en la suite) |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real en un solo proceso (`cancelar` + `canceladas`, porque el almacén es en memoria y no sobrevive entre invocaciones de la CLI) · suite | ✅ |

### 4.3 Residuales / deuda generada

- El THEN «sin `--motivo`» no tiene prueba en `test/cancel.test.js`: solo lo cubre la ejecución real. A la deuda del roadmap.
- Carrera de tests sobre el almacén compartido en memoria (ver «Decisiones»): a la deuda del roadmap.
- Fuera de scope, a 0011: anulaciones del responsable de sala.

## 5. Aprendizajes

- El almacén de reservas es en memoria: la CLI no permite smokear `canceladas` tras `cancelar` en procesos distintos → `tech-stack.md`.

## 6. Adendas

- Revisión final: Spec (opus+high) y Código (sonnet+high) limpias sobre 660debb; el commit posterior solo añade `tasks.md` (documentación, menos de 20 líneas), sin re-revisión.
