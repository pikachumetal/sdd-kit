---
id: 20261101-175419-feature-0163-spike-lane
title: Tasks — Carril spike
spec: ./spec.md
plan: ./plan.md
created: 2026-11-01
---

# Tasks — Carril spike (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0163-spike-lane`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Plantillas y `sdd-propose` | done | a4c44190 | |
| 2 | `sdd-implement` | done | b831a670 | |
| 3 | `sdd-verify` y `sdd-archive` | done | 90486b63 | |

Revisión final: Spec opus+high, 9 Important y 8 Minor · Código sonnet+high, 2 Important y 4 Minor · Arquitectura no (plan), sobre 90486b63
Pasada de fix: juntada en el cierre, 27 hallazgos, medidos con sujetos
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 1 Important abierto adjudicado y 2 Important arreglados sin revisar

## Rulings

- Baseline: Ruling: corre en este árbol, sin worktree desanclado — el árbol está limpio y sin RED aún; el pre-commit de apertura ya corrió cli — si fuera erróneo, repetir ~3 min.
- Baseline: Ruling: flaky en test/watch/loop.test.ts (timeout 5 s en suite entera, 3/3 solo; pasó al reintentar el commit) — fila de deuda al cerrar — coste si no: otro reintento.
- Task 1: Ruling: RED de sp2 y sp3 corre junto al de T1 (mismo montaje) — ahorra una tanda — si no: nada.
- Task 2: Ruling: sp3 limpio y sin caso de campo: n = 2, sale de lo que se arregla; no se escribe «production code never» en sdd-implement; sigue como control; el hueco §5 y el eje Spec lo cubren — si es erróneo, una línea más.
- Task 1: Ruling: añado el escenario k2p, porque k2 para en el gate de la spec y no llega al plan — la cláusula del plan se observa aparte — coste si erróneo: 1 $.
- Task 2: Ruling: sdd-implement solo gana una frase, no el párrafo del plan: sp1 y sp2 salieron 2/2 sin él — si en campo se salta, el párrafo vuelve con su RED.
- Task 3: Ruling: sv1 RED limpio 3/3 con caso de campo: sale de lo que se arregla; spec-reviewer-prompt.md no cambia; sv1 control 1/1 — si en campo falla, el bloque vuelve con su RED.
- Final: Ruling: Review Focus 1 sin frase nueva: sp1 con O4 medido con otra carga da `no medido` con la plantilla — coste si erróneo: una cláusula.
- Final: Ruling: M5 (Native aunque execution diga otra cosa) queda sin medir, y M8 sin ADR: decisión 8 aprobada — coste si erróneo: una tanda y una ADR.
- Final: Ruling: «Es lo único que el dev-lead…», el enlace a la tabla de gates y «(el criterio…)» siguen fuera de plan-template: orientan, no ordenan; sí vuelve «Sin tamaño fijo en horas» — coste: 18 palabras.
- Final: Ruling: la racionalización «It's only a version bump» sigue fuera: using-sdd lleva la misma fila — coste: una fila.
