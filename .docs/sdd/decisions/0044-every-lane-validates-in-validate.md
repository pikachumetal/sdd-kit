---
status: accepted
date: 2026-11-25
rutas:
  - skills/sdd-validate/**
  - skills/sdd-implement/**
  - skills/sdd-archive/SKILL.md
  - skills/sdd-verify/**
  - skills/sdd-propose/references/control-profiles.md
  - skills/sdd-plan-writing/**
  - skills/sdd-templates/templates/plan-template.md
---

# Feature, lite, patch, hotfix y spike validan en `sdd-validate`; el cierre no valida ninguno

## Contexto y problema

La ADR 0043 sacó la validación de `sdd-archive` a `sdd-validate` para feature, lite y patch, pero dejó el hotfix y el spike validando en el paso 1 de `sdd-archive`, sin bucle de vuelta: era la decisión 17 de la spec de la 0362, tomada por el agente y pendiente del dev-lead. Un fallo que aparecía al validarlos no tenía task ni test, y el cierre conservaba una rama que validaba. El dev-lead lo cerró el 2026-11-25: «vale pues hay que arreglarlo joder», y «en sdd-archive, solo se tiene que cerrar tocar documentacion no codigo».

## Opciones consideradas

- El hotfix y el spike en el paso 1 de `sdd-archive`, como decía la 0043 (descartada: el cierre valida y no tiene vuelta).
- Una sección «Hotfix y spike» en `validation-modes.md` que nombre «Order» (descartada: los pasos 1 a 3 del spike quedan en una referencia que se lee en el paso 4, después de haberlos corrido).
- Una línea por carril en «Order» de `sdd-validate`, junto a la del patch, y la vuelta del spike en «A failure goes back» (elegida: la regla vive en el paso donde se decide).

## Decisión

`sdd-implement` invoca `sdd-validate` al acabar la última task o el fix, en todos los carriles que implementan, y `sdd-archive` solo comprueba la línea de validación registrada. El orden de `sdd-validate` es el gate de cierre filtrado por lo afectado (entero solo con un fichero de «Sin filtro»), el agente que recorre el guion de pruebas entero, la revisión final sobre lo ya validado y la validación del dev-lead. Un fallo de cualquiera vuelve a `sdd-implement` como una task con su test, y cada vuelta corre solo lo que toca el arreglo: los tests que fallaron o nacen, el gate con `--base <sha del último verde>`, los pasos del guion que toca y, si la vuelta es posterior a la revisión final, una sola revisión de su diff.

Un patch y un hotfix no llevan revisión final. Un spike corre el gate solo si la rama cambia un fichero commiteado fuera de su carpeta de `changes/`, contrasta cada fila de `research.md` con su evidencia en lugar del guion, lleva solo el eje Spec y registra su validación en el borrador del walkthrough. Su vuelta lleva «Evidencia» en vez de test, y solo vuelve una fila que no se sostiene: `no cumple` y `no medido con una persona` son resultados.

Se mantiene la decisión de la 0040, entera: la revisión final sale en ejes y en paralelo desde `sdd-verify` —Spec en Opus, Código en Sonnet, y Arquitectura en Opus solo si el plan dice que el cambio cruza una frontera—, todos con effort high, y el cierre es único: una pasada de fix y una sola re-revisión, tras el gate y el guion recorrido. Esta ADR sustituye a la 0043.

### Consecuencias

- `sdd-archive` no tiene ninguna rama de validación: su paso 1 comprueba el registro, y sin él devuelve el trabajo a `sdd-validate`, también en un hotfix o un spike. El pre-check 5 del hotfix y su fusión a la rama estable siguen en el cierre.
- `sdd-validate` crece ~110 palabras; su tope sube a 765 y 1847.
- La 0043 queda como historia, con `status: superseded by 0044`.

### Confirmación

La batería de `sdd-validate` (`vf1`-`vf9` y los diez escenarios que vienen de `sdd-archive`), y `a4`, `av1` y `av2` de la de `sdd-archive`; `cli/test/kit/validation-project-neutral.test.ts` exige que la skill no nombre una herramienta ni un proyecto; `git grep -nE "first step is the validation|sdd-archive \(validation\)|Hotfix only:. and a spike" -- skills` no devuelve nada; y `cli/test/kit/decision-routes.test.ts` exige que cada glob de una ADR vigente case con algún fichero del repo.
