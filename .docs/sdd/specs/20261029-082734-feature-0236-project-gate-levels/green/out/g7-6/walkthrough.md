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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva; `canceladas` lista las canceladas con su motivo. Commits de las tasks 1 y 2 (juntados en `755ceca`).
- `test/cancel.test.js`: pruebas de ambos comandos.
- `package.json`: script `cancelar` (`node src/app.js cancelar`), añadido tras la revisión final; lo cubre la re-revisión.
- Capacidad `bookings` creada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_ en alcance. Sin `.docs/sdd/estimation.md` no hay sección de tiempo.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Nota del cierre: ese flag no está en `gate.json` ni en la suite que corrí; la carrera pasa a la deuda técnica.
- Re-revisión despachada como `general-purpose` + `opus`, porque `sdd-kit:effort-high` no existía en la sesión — coste si está mal: el revisor no lleva el effort alto del kit.

## 4. Verificación

### 4.1 Builds

- Gate: `node scripts/gate.mjs run bookings:test rooms:test` → bookings:test: corrió 5/5 · rooms:test: corrió 1/1 (sin filtro: cambia el build) · unit: `node --test test/app.test.js` corrió 2/2 · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · suite unit 2/2 y gate 6/6 en verde, smoke de 4 THEN con ejecución real, revisión final Spec (opus) y Código (sonnet) limpia sobre 755ceca, re-revisión de lo posterior limpia. El dev-lead no ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista («viaje») → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` → el mismo «motivo no válido…» | ejecución real | ok |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real | ok |
| `npm run cancelar` | no probado (solo se leyó que el destino existe; con npm los argumentos van tras `--`) | — |

### 4.3 Residuales / deuda generada

- Los tests comparten el almacén en memoria y corren con una carrera: pasa a la deuda técnica del roadmap.

## 5. Aprendizajes

- El motivo se valida contra una lista cerrada → `capabilities/bookings.md`.
- Revisión de skills: el proyecto no tiene `.claude/skills/`; ningún patrón reutilizable. No aplica.
- Documentos vivos nuevos: `capabilities/bookings.md` no existía: creado por el merge de la capacidad.

## 6. Adendas

