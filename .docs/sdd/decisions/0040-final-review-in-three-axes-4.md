---
status: superseded by 0043
date: 2026-11-19
rutas:
  - skills/sdd-verify/**
  - skills/sdd-implement/**
  - skills/sdd-archive/SKILL.md
  - skills/sdd-propose/references/control-profiles.md
  - skills/sdd-plan-writing/**
  - skills/sdd-templates/templates/plan-template.md
---

# La revisión final sale en ejes y se cierra una vez, con el plan en `sdd-plan-writing`

## Contexto y problema

La [ADR 0028](0028-final-review-in-three-axes-3.md) decide que la revisión final sale en ejes y se cierra una vez, y sus `rutas` nombran `skills/sdd-propose/references/plan-writing.md`, que la feature 0359 lleva a la skill de fase `sdd-plan-writing`. Desde entonces `sdd decision index --files` ya no ofrece la 0028 a quien toca cómo se escribe el plan, y una ADR no se edita.

## Opciones consideradas

- Editar las `rutas` de la 0028: rompe la regla de que una ADR solo cambia su `status`.
- Una ADR nueva con la misma decisión y las `rutas` de hoy, que sustituye a la 0028 (elegida).

## Decisión

Se mantiene la decisión de la 0028, entera: la revisión final sale en ejes y en paralelo desde `sdd-verify` —Spec en Opus, Código en Sonnet, y Arquitectura en Opus solo si el plan dice que el cambio cruza una frontera—, todos con effort high, y el cierre es único: una pasada de fix y una sola re-revisión. Esta ADR sustituye a la 0028 (dev-lead, 2026-11-19: «1», a «ADR nuevas»).

### Consecuencias

- `sdd decision index --files` vuelve a ofrecer la decisión a quien toca `skills/sdd-plan-writing/`.
- La 0028 queda como historia, con `status: superseded by 0040`.

### Confirmación

La batería de `sdd-verify` (`f1`-`f4`, `c1`-`c5`) y la fila `AX` de la de `sdd-propose`; `cli/test/kit/decision-routes.test.ts` exige que cada glob de una ADR vigente case con algún fichero del repo.
