---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-11
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`, `test/cancel.test.js` — `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; `canceladas` lista «sala día — motivo». Task 1 en `379407c`, Task 2 en `a1df28b`.
- `package.json` — script `cancelar` (`node src/app.js cancelar`), fuera del plan (ver 3).
- `.docs/sdd/capabilities/bookings.md` — creada con los dos requisitos del delta (no existía: la spec declaraba `bookings` como nueva).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- El script `cancelar` de `package.json` no estaba en los ficheros del plan: no añade conducta (llama al punto de entrada que ya prueban los tests), pero el camino de npm no tiene test.

### Decisiones tomadas sin el dev-lead

- Script `cancelar` de `package.json` fuera del plan — no cambia la conducta de la spec; hay que usarlo como `npm run cancelar -- <sala> <día> --motivo <motivo>`, porque sin `--` npm se queda `--motivo` — coste si está mal: quien lo lance sin `--` ve «motivo no válido».
- Corregí en el cierre el ruling de la Task 2: anotaba `--test-concurrency=1` en el gate, pero `gate.json` no lo lleva ni hace falta (`node --test` aísla cada fichero en su proceso). Lo real es una dependencia de orden entre dos tests de `test/cancel.test.js` sobre el almacén en memoria compartido — coste si está mal: reordenar o filtrar esos tests deja en rojo el de `canceladas`.

## 4. Verificación

### 4.1 Builds

- `node --test test/app.test.js` → 2/2. `node scripts/gate.mjs run bookings:test rooms:test --base develop` → exit 0.
- Gate: `node --test test/app.test.js` · `node scripts/gate.mjs run bookings:test rooms:test --base develop` → bookings:test: corrió 5/5 (sin filtro: cambia el build) · rooms:test: corrió 1/1 (sin filtro: cambia el build) · configuración: la del gate · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 2/2 y gate 6/6 · smoke 3/3 THEN con ejecución real · revisión final Spec y Código limpia sobre a1df28b; re-revisión de lo posterior a la revisión final (juntada en el cierre) con 1 Important (el ruling de la Task 2, corregido en el cierre) y 2 Minor adjudicados · verificado por el agente, el dev-lead no ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js` y `npm run cancelar -- …`) | ok |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real en un mismo proceso (`run('cancelar')` y `run('canceladas')`); por la CLI en un proceso aparte sale vacío, porque el almacén es en memoria | ok en proceso; no probado entre procesos |

### 4.3 Residuales / deuda generada

- Los tests de `test/cancel.test.js` dependen del orden (`canceladas` solo pasa tras `cancelar`) → fila «Por triar» de `debt.md`.
- El motivo no sobrevive al proceso: lo cubre la fila 0014 «Motivo guardado» del roadmap.

## 5. Aprendizajes

- Las comprobaciones de la CLI por procesos separados no ven el estado de otro: mientras el almacén sea en memoria, el listado de canceladas solo se prueba dentro de un proceso → `debt.md` («Por triar») y roadmap 0014.

Retro: documento o skill desmentido → corregido en el mismo documento: `tasks.md` decía que el gate llevaba `--test-concurrency=1` (no lo lleva) y citaba `a1df28b` para la Task 1 (era `379407c`) (`.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md`)

## 6. Adendas

- (ninguna)
