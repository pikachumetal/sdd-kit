---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-28
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde «cancelada <sala> <día> (<motivo>)»; sin motivo o fuera de la lista responde «motivo no válido: …». Comando nuevo `canceladas`. Commits c42859d (Task 1) y 0dd9c8c (Task 2).
- `test/cancel.test.js`: tres tests (motivo válido, motivo fuera de la lista, listado de canceladas).
- Capacidad `bookings` creada con `sdd capability merge` desde el delta de la spec.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.
- Review de spec: no (decisión 3 de la spec: dos señales, MODIFIED y datos) · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- Ninguna en el código. El plan pedía como gate de cierre `node --test`; se usó el gate de la constitución (`node scripts/gate.mjs run bookings:test rooms:test --affected --base develop`).

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` «en el gate», para esquivar una carrera de los tests sobre el almacén en memoria (Task 2, `## Rulings` de `tasks.md`) — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. **No está aplicado**: `gate.json` no lo lleva y ningún commit de la rama lo toca, así que el gate corre sin él. Tampoco hay constancia de la carrera: cada fichero de test corre en su propio proceso. Queda como deuda.

## 4. Verificación

### 4.1 Builds

- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 1/2 · rooms:test: saltada (sus inputs no los toca la rama) · ~1 s · configuración: la del gate · sobre el commit de cierre.
- La primera pasada del gate salió en rojo (`bookings:test (5 passed, 1 failed)`); el gate imprime solo recuentos y no guardé el test que falló. Contraste: la tarea entera y cada fichero por separado en la rama, y en un worktree desacoplado de `develop` (5 pasadas de la tarea entera y cada fichero) en verde; 46 ejecuciones más de la tarea en la rama (6 + 40) y 3 pasadas del gate, también en verde. «No se repite»: fila de tests inestables en la deuda, sin línea de error porque no se capturó.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-28 · verificación del agente: suite `bookings:test` 6/6 (tras una pasada roja que no se repite, ver 4.1) · smoke 4/4 THEN con ejecución real (`run` de `src/app.js` en un solo proceso, porque el almacén es en memoria) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 0dd9c8c; el único commit posterior solo toca `tasks.md`. Arquitectura no revisada (el plan lo descartó).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real + suite | ok |
| motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | ok |
| sin `--motivo` responde lo mismo | ejecución real (sin test propio) | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real + suite | ok |

### 4.3 Residuales / deuda generada

- Pasada roja del gate sin identificar, que no se repite: fila en la deuda técnica.
- Workaround `--test-concurrency=1` declarado y no aplicado: fila en la deuda técnica.
- El gate no imprime el error de un test que falla: fila en la deuda técnica.
- `canceladas` solo lo prueba un test que depende de que `cancelar` haya corrido antes en el mismo fichero, y «sin `--motivo`» no tiene test propio: fila en la deuda técnica.
- Fuera de scope: anulaciones del responsable de sala (0011), informe (0012), motivo guardado en el almacén (0014).

## 5. Aprendizajes

- Un rojo del gate hay que poder leerlo: el gate solo imprime recuentos, así que la salida del test se guarda aparte desde la primera pasada → deuda técnica (fila del gate), sin documento vivo que lo recoja.
- Un ruling que dice «en el gate» tiene que dejar el cambio en `gate.json`, o no es un ruling sino una intención → deuda técnica.
- Ningún aprendizaje de estructura ni de convención nuevo: no hay `architecture.md` que tocar y la constitución ya cubre el flujo.
- Revisión de skills: el proyecto no tiene `.claude/skills/`; no aplica, ninguna skill afirma nada que esta feature desmienta.

## 6. Adendas

- (ninguna)
