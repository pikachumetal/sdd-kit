---
status: accepted
date: 2026-11-10
rutas:
  - skills/sdd-propose/**
  - skills/sdd-archive/**
  - skills/sdd-implement/references/commit-milestones.md
---

# Convenciones de artefactos, ids, merge y ramas, con las skills de la 3.0.0

## Contexto y problema

La [ADR 0005](0005-artifact-and-branch-conventions.md) fija las convenciones de artefactos, ids, merge y ramas que el kit impone a los proyectos, y sus `rutas` nombran `sdd-start-feature`, `sdd-end-feature`, `sdd-start-patch`, `sdd-end-patch` y `sdd-templates/scripts/`. La 0149, la 0186 y la 0206 retiraron esas skills y esa carpeta: `sdd-propose` abre todo cambio, `sdd-archive` cierra feature y patch, y la receta de los commits vive en `sdd-implement`. Desde entonces `sdd decision index --files` ya no ofrece la 0005 a quien toca esas skills, y una ADR no se edita.

## Opciones consideradas

- Dejar las `rutas` viejas como historia: la decisión sigue en vigor, pero nadie la recibe al tocar las skills que la aplican.
- Una ADR nueva con la misma decisión y las `rutas` de la 3.0.0, que sustituye a la 0005.

## Decisión

Se mantiene la decisión de la 0005, entera: el kit fija `.docs/sdd/` como raíz, el naming de carpetas, los ids por modo, la ubicación de los artefactos de release, los módulos por predicado observable, la política de merge declarada en `sdd-kit.json` y la forma de la historia de las ramas, y cambiar cualquiera es un cambio mayor. Desde la 3.0.0 lo aplican `sdd-propose` (carpetas, ids y ramas), `sdd-archive` (merge y cierre) y la receta de `commit-milestones.md` de `sdd-implement` (la historia), y lo que leen las personas va a la raíz del proyecto ([ADR 0012](0012-documents-by-reader.md)). Esta ADR sustituye a la 0005 (dev-lead, 2026-11-10: «vale así», a «ADR nuevas»).

### Consecuencias

- `sdd decision index --files` vuelve a ofrecer la decisión a quien toca `sdd-propose`, `sdd-archive` o la receta de commits.
- La 0005 queda como historia, con `status: superseded by 0027`.

### Confirmación

`cli/test/ids/` (ids por modo), `cli/test/merge/` (la política de merge) y la batería de `sdd-propose` (carpetas y ramas); `cli/test/kit/decision-routes.test.ts` exige que cada glob de una ADR vigente case con algún fichero del repo.
