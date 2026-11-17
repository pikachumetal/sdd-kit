---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-05
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>`: el motivo es obligatorio y de una lista cerrada (cambio de planes, sala ocupada, otro); se guarda con la reserva cancelada. `src/app.js`, `test/cancel.test.js` — commit 399d4aa.
- `canceladas`: lista las reservas canceladas con su motivo (`Norte lun — sala ocupada`). `src/app.js`, `test/cancel.test.js` — commit c7d8a85.
- Capacidad `bookings` creada en `.docs/sdd/capabilities/bookings.md` con los dos requisitos del delta.

## 3. Desviaciones del plan

- _Ninguna_ en el código. En el registro, la re-revisión del cierre encontró dos errores que se corrigieron en `tasks.md`: la fila de la task 1 citaba el commit de la task 2, y el Ruling afirmaba un cambio en el gate que no existe.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — coste si es erróneo: la suite tarda el doble. **No está aplicado**: `gate.json` sigue con `node --test <ficheros>`. Queda como deuda en el roadmap, no como decisión en vigor.

## 4. Verificación

### 4.1 Builds

- Suite del cierre: la base (`develop`) lleva 2 commits que la rama no tiene, así que la suite corre una vez sobre la fusión de sincronización (`sdd merge --sync`), con el gate de la constitution (`node scripts/gate.mjs run bookings:test rooms:test --affected --base develop`). Su línea `Gate:` y su sha van en el mensaje final del cierre, porque este fichero va dentro del commit de cierre.
- Revisión final: Spec y Código limpias sobre c7d8a85. Re-revisión del tramo posterior (solo `tasks.md`, `opus`): con dos hallazgos de registro, corregidos en el cierre (§3).

### 4.2 Smoke / tests

Validación en campo: 2026-11-05 · smoke de 4 THEN con ejecución real, corrido por el agente en la rama (`node src/app.js …` y, para el listado, `run()` importado en un solo proceso); revisión final Spec y Código sobre c7d8a85 y re-revisión del cierre; suite sobre la fusión de sincronización (ver el mensaje final). El smoke del borrador anterior usaba `--motivo sala-ocupada`, que la lista rechaza: se repitió con «sala ocupada».

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| Un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `--motivo xx` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| Sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | cancelar y listar en un mismo proceso → `Norte lun — sala ocupada` |

### 4.3 Residuales / deuda generada

- El almacén de reservas es un array en memoria: lanzado como dos comandos de CLI separados, `canceladas` sale vacío después de `cancelar`. Es el comportamiento previo a esta feature y lo cubre la fila 0014 («Motivo guardado»); aquí el listado solo se verificó en un proceso.
- Los tests comparten el almacén en memoria y el Ruling de la task 2 apunta a una carrera entre ellos: fila de deuda «Tests con almacén compartido» en el roadmap.

## 5. Aprendizajes

- Un workaround que el Ruling da por aplicado debe comprobarse contra el fichero que dice tocar antes de anotarlo → `tasks.md` (corregido) y deuda del roadmap; no se escribe en `tech-stack.md` porque no está en vigor.

Retro: documento o skill desmentido → corregido en el propio documento (`tasks.md`: el Ruling decía aplicado un flag que `gate.json` no tiene)

## 6. Adendas

- _Ninguna._
