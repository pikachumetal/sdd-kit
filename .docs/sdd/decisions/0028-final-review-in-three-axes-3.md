---
status: accepted
date: 2026-11-10
rutas:
  - skills/sdd-verify/**
  - skills/sdd-implement/**
  - skills/sdd-archive/SKILL.md
  - skills/sdd-propose/references/control-profiles.md
  - skills/sdd-propose/references/plan-writing.md
  - skills/sdd-templates/templates/plan-template.md
---

# La revisión final sale en ejes y se cierra una vez, con las skills de la 3.0.0

## Contexto y problema

La [ADR 0015](0015-final-review-in-three-axes.md) decide que la revisión final sale en ejes y se cierra una vez, y sus `rutas` nombran `sdd-start-feature/SKILL.md`, sus `references/` y `sdd-end-feature/SKILL.md`, que la 0149 y la 0186 retiraron: los perfiles de control y los hitos de commit pasaron a `sdd-propose` y a `sdd-implement`, y el cierre a `sdd-archive`. Desde entonces `sdd decision index --files` ya no ofrece la 0015 a quien toca esos ficheros, y una ADR no se edita. Su «Confirmación» citaba un test de Pester que la 0228 portó a Vitest.

## Opciones consideradas

- Dejar las `rutas` viejas como historia.
- Una ADR nueva con la misma decisión y las `rutas` de la 3.0.0, que sustituye a la 0015.

## Decisión

Se mantiene la decisión de la 0015, entera: la revisión final sale en ejes y en paralelo desde `sdd-verify` —Spec en Opus, Código en Sonnet, y Arquitectura en Opus solo si el plan dice que el cambio cruza una frontera—, todos con effort high, y el cierre es único: una pasada de fix y una sola re-revisión. Esta ADR sustituye a la 0015 (dev-lead, 2026-11-10: «vale así», a «ADR nuevas»).

### Consecuencias

- `sdd decision index --files` vuelve a ofrecer la decisión a quien toca los perfiles de control, el plan o el cierre.
- La 0015 queda como historia, con `status: superseded by 0028`.

### Confirmación

La batería de `sdd-verify` (`f1`-`f4`, `c1`-`c5`) mide el despacho, lo que ve cada eje y el cierre; `cli/test/kit/decision-routes.test.ts` exige que cada glob de una ADR vigente case con algún fichero del repo.
