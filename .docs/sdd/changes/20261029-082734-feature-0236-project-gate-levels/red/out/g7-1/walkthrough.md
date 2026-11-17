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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` con la lista cerrada (cambio de planes, sala ocupada, otro) y comando `canceladas` (436d874, 6b421de).
- `test/cancel.test.js`: tests de ambos comportamientos.
- `package.json`: script `cancelar` (juntado en el cierre).
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, fusionada con `sdd capability merge`.

## 2. Tiempo y coste

No hay `.docs/sdd/estimation.md`: sin estimado. Medido con `sdd session tokens`:

- Tokens del hilo: 965.023 — claude-sonnet-5-5 965.023
- Tokens de subagentes: 79.656 en 1 despacho — Re-revisión final 0010 claude-opus-5-5 79.656 / 0 min
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Esfuerzo real: 0,05 h — reloj de la sesión del cierre desde 2026-10-29T09:05Z; no cuenta la implementación, que fue en otra sesión.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. El script `cancelar` de `package.json` no estaba en el plan.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. **No coincide con la realidad:** `gate.json` no lleva esa opción y la suite pasa 5/5 sin ella; el ruling no se aplicó. Va a deuda.
- Re-revisión despachada como `general-purpose` + `opus`, porque el tipo `sdd-kit:effort-high` no existía en la sesión (cargaba el kit 2.3.4; el proyecto pide el 3.0.0) — coste si es erróneo: un revisor sin el effort alto del kit.

## 4. Verificación

### 4.1 Builds

- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 5/5 · rooms:test: saltada (no toca sus inputs) · configuración: la del gate · sobre el commit de cierre.
- Revisión final: Spec (opus+high) y Código (sonnet+high) limpias sobre 6b421de. Re-revisión del tramo posterior (solo `package.json`): limpia.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · verificado por el agente: suite 5/5 · smoke por ejecución real de 3 THEN de 4 · revisión final Spec y Código sobre 6b421de, re-revisión limpia. El dev-lead no probó nada en esta sesión.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "porque sí"`) | ok |
| sin `--motivo` → el mismo mensaje | ejecución real | ok |
| `canceladas` → «Norte lun — sala ocupada» | suite (`test/cancel.test.js`); `no probado` por CLI | por CLI sale vacío: ver 4.3 |

### 4.3 Residuales / deuda generada

- `canceladas` como proceso aparte no ve las cancelaciones de otra invocación: el almacén es memoria. Lo cubre la 0014. Fila de deuda en el roadmap.
- Los tests de `cancel.test.js` comparten estado: `canceladas` depende del `cancelar` del test anterior. Fila de deuda en el roadmap.
- `roadmap check` falla en dos líneas que no escribí (cabecera de «Deuda técnica», línea 22, y «v0.3.0», línea 36): es el paso «Roadmap en la forma de la plantilla» de la migración v2.3.0.

## 5. Aprendizajes

- La lista de motivos es regla de `bookings` → `capabilities/bookings.md`.
- Un ruling que declara un cambio de configuración hay que comprobarlo contra el fichero antes de cerrar → fila de deuda del roadmap (no hay doc vivo donde quepa).
- Revisión de skills: no aplica; no existe `.claude/skills/` en el proyecto y el trabajo no reveló un patrón reutilizable.
- ADR: ninguna candidata en la spec.

## 6. Adendas

