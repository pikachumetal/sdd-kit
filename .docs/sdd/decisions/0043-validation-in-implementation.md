---
status: superseded by 0044
date: 2026-11-24
rutas:
  - skills/sdd-validate/**
  - skills/sdd-implement/**
  - skills/sdd-archive/SKILL.md
  - skills/sdd-verify/**
  - skills/sdd-propose/references/control-profiles.md
  - skills/sdd-plan-writing/**
  - skills/sdd-templates/templates/plan-template.md
---

# La validación es parte de la implementación: `sdd-validate` entre `sdd-implement` y `sdd-archive`

## Contexto y problema

La decisión 5 de la spec de la feature 0149 metió la validación en el tronco del cierre, y `64a86577c` (0206) la llevó al paso 1 de `sdd-archive`. Los arreglos que la validación provoca llegaban así después de la revisión final, sin revisar, y se fusionaban: en 17 sesiones de feature v3 de un proyecto consumidor (2026-11-17 a 2026-11-24), 10,8 ediciones de código por sesión en el cierre (0760: 80; 0759: 29; 0695: 21), frente a 6,8 de la pasada de arreglos de la revisión final. La regla viva de `feature-flow` ya decía que no se invoca `sdd-archive` hasta que el dev-lead valida; las skills se habían desviado.

El dev-lead decidió el 2026-11-24 que la validación es parte de la implementación y que sus arreglos no son del cierre: «si encontramos fallos en la validacion no es parte del cierrre, la validacione s parte de la implementracion», y «no tienes que pasar a sdd-archive hasta que yo haya validado la tarea».

## Opciones consideradas

- La validación al final de `sdd-implement`: el `SKILL.md` de `sdd-implement` y las baterías de `sdd-implement` y `sdd-archive` crecen, y los escenarios de la validación necesitan los moldes de «la 0010 con las tasks acabadas», que solo viven en el sujeto de `sdd-archive`.
- La validación en `sdd-archive`, y que un fallo devuelva el trabajo a `sdd-implement`: `sdd-archive` sigue teniendo una parada con el dev-lead y un paso que puede editar código.
- Una skill nueva entre las dos, `sdd-validate` (elegida, pedida por el dev-lead al ver crecer las baterías: «separar en un paso, si no valida devuelve el control a implement»).

## Decisión

`sdd-implement` invoca `sdd-validate` al acabar la última task, y `sdd-archive` solo cierra con la validación registrada. El orden de `sdd-validate` es el gate de cierre filtrado por lo afectado (entero solo con un fichero de «Sin filtro»), el agente que recorre el guion de pruebas entero, la revisión final sobre lo ya validado y la validación del dev-lead («la repsuesta es 1», dev-lead, 2026-11-24). Un fallo de cualquiera vuelve a `sdd-implement` como una task con su test, y cada vuelta corre solo lo que toca el arreglo: los tests que fallaron o nacen, el gate con `--base <sha del último verde>`, los pasos del guion que toca y, si la vuelta es posterior a la revisión final, una sola revisión de su diff.

Se mantiene la decisión de la 0040, entera: la revisión final sale en ejes y en paralelo desde `sdd-verify` —Spec en Opus, Código en Sonnet, y Arquitectura en Opus solo si el plan dice que el cambio cruza una frontera—, todos con effort high, y el cierre es único: una pasada de fix y una sola re-revisión. Cambia solo cuándo sale: tras el gate y el guion recorrido, no justo tras el commit de la última task, para que lo que el guion arregla entre en la revisión. Esta ADR sustituye a la 0040. Un hotfix y un spike no pasan por `sdd-validate`: validan en el paso 1 de `sdd-archive`, como hasta ahora.

### Consecuencias

- `sdd-archive` deja de validar: su paso 1 comprueba el registro, y sin él devuelve el trabajo a `sdd-validate`; un rojo de la rama tras el commit de cierre vuelve a `sdd-implement`.
- `sdd-validate` es la skill 29 y lleva las dos referencias de validación que eran de `sdd-archive`; el kit dice que el agente recorre el guion y el proyecto pone con qué herramienta.
- Cada vuelta de la validación cuesta más que un arreglo sin revisar, y menos que el defecto que mide la fila 0362.
- La 0040 queda como historia, con `status: superseded by 0043`.

### Confirmación

La batería de `sdd-validate` (`vf1`-`vf7` y los diez escenarios que vienen de `sdd-archive`) y `av1` y `av2` de la de `sdd-archive`; `cli/test/kit/validation-project-neutral.test.ts` exige que la skill no nombre una herramienta ni un proyecto; `git grep -nE "first step is the validation|sdd-archive \(validation\)" -- skills` no devuelve nada; y `cli/test/kit/decision-routes.test.ts` exige que cada glob de una ADR vigente case con algún fichero del repo.
