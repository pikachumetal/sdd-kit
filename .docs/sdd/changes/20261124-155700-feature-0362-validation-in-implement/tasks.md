---
id: 20261124-155700-feature-0362-validation-in-implement
title: Tasks — La validación vuelve al final de sdd-implement
spec: ./spec.md
plan: ./plan.md
created: 2026-11-24
---

# Tasks — La validación vuelve al final de `sdd-implement` (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0362-validation-in-implement`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Batería nueva de `sdd-validate`: escenarios, moldes y los que se mueven | done | aa65156 | |
| 2 | Batería de `sdd-archive`: sin validación, con `Validado:` y la reentrada | done | d124e1a | |
| 3 | RED: los escenarios nuevos exhiben el fallo con el texto vigente | done | 2dad1e4 | vf6 es control (la regla ya existe); coste del RED 17,91 $ frente a 12,8 $ |
| 4 | `sdd-validate`: la skill nueva | done | — | |
| 5 | `sdd-implement` y sus métodos: el pase a `sdd-validate` | pending | — | |
| 6 | `sdd-archive` y los textos que nombran la validación | pending | — | |
| 7 | ADR, topes, docs del flujo y enmiendas de redacción | pending | — | |
| 8 | GREEN, REFACTOR y controles | pending | — | |

## Rulings

- Pre-flight: cada task fija en su commit el tope de palabras de la skill que engorda (T4 la entrada nueva de `sdd-validate`, T6 `sdd-archive`), con el valor de la spec; T7 lo ajusta a lo medido + 2 %.
