---
id: 20261009-153540-feature-0161-explore-launch-prompt
title: Tasks — explore, el paso por el roadmap y el prompt de arranque
spec: ./spec.md
plan: ./plan.md
created: 2026-10-10
---

# Tasks — explore, el paso por el roadmap y el prompt de arranque (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0161-explore-launch-prompt`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Baterías de `sdd-explore` y `sdd-roadmap`, a5, y RED | done | `351f2d94` | salen dos reglas por RED limpio (enmienda del 2026-10-10) |
| 2 | `sdd-consult` pasa a `sdd-explore`, sin reglas nuevas | done | `3102c669` | |
| 3 | Plantilla del prompt de arranque y salida de explore | done | `aeb28d7f` | |
| 4 | `sdd-roadmap`: «dame el prompt», patch como fila y prompt en el cierre | done | `ca23e4c9` | m3 retirado tras el A/B |
| 5 | c2 de `sdd-rubber-duck` y batería entera de `using-sdd` | done | `edf482a9` | sin la regla de `sdd-propose` (salió por el RED) |
| 6 | Task 6 — enmienda 2026-10-10: el config se fusiona | done | `659fa8dd` | la regla del cierre del patch salió por el RED (x1 limpio) |

## Verificación por task

- [x] Task 1 — `bash -n` de los tres `subject.sh`; `battery.mjs plan`; Pester de baterías (20/20)
- [x] Task 2 — Pester de nombres (316/316); controles e1, g1, g9, k1, c1
- [x] Task 3 — `LaunchPrompt`, `Skills`, `WordBudget`; GREEN e2, e3; control e1
- [x] Task 4 — `LaunchPrompt`, `PlanEntry`, `UsingSdd`, `WordBudget`; GREEN m1, m2; A/B de m3
- [x] Task 5 — `WordBudget`, `UsingSdd`; c1, c2; `using-sdd` entera 21/21
- [x] Task 6 — RED k5 (rojo) y x1 (limpio); GREEN k5 2/2; tramo `sdd-propose` de `using-sdd` 10/10
- [x] Task 6 — RED k5 y x1; GREEN k5; tramo `sdd-propose` de `using-sdd`

## Revisión

Revisión final: sdd-kit:effort-high + opus, con arreglos (0 Critical, 6 Important, 12 Minor), sobre 35bd18f1
Pasada de fix: afb312aa, 4 Important arreglados en el hilo (1, 4, 5, 6) y los 12 Minor; 2 Important (2, 3) como desvío aprobado → Task 6
Re-revisión: afb312aa..659fa8dd, sdd-kit:effort-high + opus, con arreglos (0 Critical, 6 Important)
Pasada de fix: juntada en el cierre, 6 Important y los Minor; control k5 1/1
Re-revisión: 3aca3c08..003c2fe1, sdd-kit:effort-high + opus, limpia (regex de `LaunchPrompt.Tests.ps1` tolerante a CRLF, que el pre-commit del merge daba en rojo)

## Rulings

- `CapabilityRules.Tests.ps1` busca el paso traducido de `sdd-explore` (`Context`, `purpose`).
- La fila u1 de la batería de `sdd-grilling` espera `sdd-explore`: `sdd-start-feature` dejó de ser puerta en la 0160.
- El delta de la spec pasa de MODIFIED con renombrado a REMOVED + ADDED para que `sdd capability merge` lo fusione.
- El Review Focus del plan cambia la línea del dimensionado por la de un spike.
- Las `description` de `sdd-start-feature` y `sdd-start-patch` (de la 0160) llevaban «: » sin comillas: el YAML no parseaba. Se reescriben sin «: » en la pasada de fix.

## Fixes adicionales

- Las `description` de `sdd-start-feature` y `sdd-start-patch`: fallo de la 0160 que destapó el gate de cierre (`Manifests.Tests.ps1`), arreglado en la pasada de fix y medido con el tramo `sdd-propose` de `using-sdd`.
