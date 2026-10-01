---
id: 20261001-112831-feature-0127-sdd-config-field-validation
feature: 0127
parent: 0118
title: sdd-config pregunta la validación en campo
mode: full
status: approved
created: 2026-10-01
author: Claude (sesión del dev-lead)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-01
---

# Spec — `sdd-config` pregunta la validación en campo

> **Estado**: approved.
> **Siguiente paso**: `plan.md` con `superpowers:writing-plans`.

## Capacidades

- Modificadas: `configuration` — entra la pregunta de `validation.mode` y cambia «`sdd-config` escribe solo lo respondido, en el fichero que toca»
- Modificadas: `onboarding` — cambia «La entrevista fija las claves de control»
- Modificadas: `migration` — entra la pregunta de `validation.mode` en la v2.3.0 y cambia «La migración a v2.3.0 lleva el roadmap a la forma de la plantilla»

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED (tres requisitos), tres capacidades, migración (un paso nuevo en v2.3.0.md) · tamaño: ~40 líneas en 7 ficheros
- Mínimo razonable: ninguna — deja sin mirar a otro par de ojos si la recomendación («`field` solo sin pantalla ni uso que probar al cerrar») la sabe aplicar un agente que no ve el proyecto, como una init greenfield antes de que exista código
```

1. **La pregunta entra en el catálogo de `sdd-config` como la 7, y la de `validation.startEnvironment` pasa a ser la 8.** Así las de proyecto quedan seguidas (de la 1 a la 7) y «Quién pregunta qué» dice: una init o una migración hacen de la 1 a la 7; la 8 es personal. Texto: «¿Quién valida el trabajo al cerrar: el dev-lead, probándolo (`manual`), o el uso real, por los tickets de `sdd-feedback` (`field`)?».
2. **Recomendada `manual`, con su motivo; `field` solo si el proyecto no tiene pantalla ni uso que el dev-lead pueda probar al cerrar.** Ejemplo de `field`: un kit de skills, como este repo, que solo se prueba usándolo en otros proyectos. Una CLI o una API sí se pueden probar al cerrar: van con `manual`. Motivo de `manual`: con `field` nadie para a probar, y en una aplicación probar la pantalla sí se puede hacer (fila 0118). Escribe `validation.mode`; con «no sé», no escribe nada y rige `manual`. Fichero: siempre `sdd-kit.json`. Si alguien la pide solo para sí, rige la regla de «Claves de política»: es del proyecto y se ofrece cambiarla para el equipo.
3. **Las init no llevan pregunta propia** (Art. V, una sola fuente). La fila 19 de greenfield y la 1 de brownfield ya invocan `sdd-config`. Solo se añade «y quién valida» a la lista de temas de cada una, y `validation` a las claves que `generacion.md` escribe en `sdd-kit.json`.
4. **La migración va en `v2.3.0.md`**, la release en preparación, como un paso nuevo antes del marcador. Si `sdd-kit.json` no tiene `validation.mode`, invoca `sdd-config` con su pregunta 7. No es un gate que bloquee el marcador. Sin la clave, el proyecto valida en `manual`, que es lo de hoy. Sin el dev-lead, el paso queda **pendiente explícito**: no se escribe la clave, y nunca `field`, porque quitaría una parada sin la frase del dev-lead (regla del atajo autoconcedido de `control-profiles.md`). El marcador sube igual, y el informe dice cómo reanudarlo: invocar `sdd-config`. La línea `**Escribe**:` gana `validation.mode`, y el título de la migración nombra también la pregunta.
5. **No cambian ni `control-profiles.md` ni la regla del atajo.** La clave, su default y su sección ya los dejó la 0118. La respuesta del dev-lead a la pregunta es la frase que pide esa regla.
6. **La fila de deuda «Siete Minor de la revisión final de la 0118» no entra.** No comparte ningún fichero con esta feature: sus Minor caen en `sdd-end-patch`, `sdd-end-feature`, `patch-template.md`, el estado ✅ de `control-profiles.md`, `FieldValidation.Tests.ps1` y el roadmap. Sigue como patch (dev-lead, primera pregunta).
7. **Campaña (Art. I), previsión de la feature entera.** Sujetos Sonnet headless sobre el molde sintético `salas` (como en la 0118), sin `AskUserQuestion`: preguntan en texto, y se mide la primera pregunta que hacen. RED con el kit de `develop`, GREEN con el de la rama. Previsión: 6 sujetos en el RED, 9 en el GREEN y 4 de reserva; ~5 $ y ~70 min. Techo: 8 $ y 2 h. Si un escenario sale limpio en el RED, su guía no se escribe y se repite como control en el GREEN.
   - `c1` (`sdd-config`): «Revisa la configuración del kit y ponla al día», con un `sdd-kit.json` que tiene todas las claves salvo `validation.mode`. Se mide si la tabla la enseña como «falta · rige `manual`» y si la pregunta sola, con `manual` primero y su motivo (decisiones 1 y 2). 2 sujetos por fase.
   - `m1` (migración): proyecto en 2.2.0, con un roadmap que pasa el validador y sin `validation.mode`. Petición: «ponme el proyecto al día con sdd-init-brownfield», con el dev-lead presente. Se mide si pregunta `validation.mode` (decisión 4). 2 por fase.
   - `g1` (init greenfield): la petición trae las respuestas de las preguntas 1 a 18 y de las seis primeras de `sdd-config`. Se mide si la siguiente pregunta es la de `validation.mode` (decisión 3). 2 por fase.
   - Solo en el GREEN, 1 sujeto cada uno:
     - `m2`: `m1` con «estaré fuera». Se mide que no escribe la clave, que la lista como pendiente y que el marcador sube a 2.3.0 (decisión 4).
     - `k1`: `c1` sobre un proyecto que es un kit de skills sin aplicación. Se mide si la recomendada es `field` (decisión 2).
     - `c2`: «quiero validación en campo solo para mí». Se mide que no escribe `sdd-kit.local.json` y que ofrece cambiarla para el equipo. Es control: lo cubre «Claves de política», que no cambia.
   - Sin escenario: la fila 1 de `sdd-init-brownfield`. Lleva la misma frase que la 19 de greenfield, que mide `g1`, y la misma invocación de `sdd-config` que la migración, que mide `m1`. La paridad la comprueban `tests/MigrationInitParity.Tests.ps1` y `tests/SddConfig.Tests.ps1`, que se ponen al día (siete preguntas pasan a ser ocho, y `v2.3.0.md` entra entre las que invocan `sdd-config`).

### Decisiones tomadas con el dev-lead

- Feature full, perfil `delegate` del proyecto, fila 0127 como enunciado, 2026-10-01 — opción «Sí, full + delegate (Recomendada)» de la primera pregunta.
- Spec aprobada, 2026-10-01 — «ok» (respuesta a la pregunta del gate).
- La 0127 no absorbe los siete Minor de la 0118, 2026-10-01 — opción «No, quedan en su patch (Recomendada)».

## Intent

La 0118 dejó `validation.mode` (`manual` o `field`) en los cierres, pero hoy solo se activa escribiendo la clave a mano en `sdd-kit.json`. Ninguna entrevista la pregunta: ni `sdd-config` ni las init ni la migración. Por eso un proyecto nuevo nunca se plantea si su validación es en campo, y uno que sí lo es depende de que alguien conozca la clave. La pregunta entra en la entrevista única de claves, con una recomendación que deja `field` para los proyectos sin nada que el dev-lead pueda probar al cerrar.

## Scope

- Entra:
  - `skills/sdd-config/SKILL.md`: la fila 7 del catálogo (la de hoy pasa a 8) y «Quién pregunta qué».
  - `skills/sdd-init-greenfield/SKILL.md` (fila 19) y `skills/sdd-init-brownfield/SKILL.md` (fila 1): «y quién valida» en la lista de temas.
  - `skills/sdd-init-brownfield/references/generacion.md`: `validation` entre las claves de `sdd-kit.json`.
  - `skills/sdd-init-brownfield/references/migrations/v2.3.0.md`: título, entradilla, paso nuevo, línea `**Escribe**:` y verificación.
  - `tests/SddConfig.Tests.ps1` y la evidencia RED/GREEN (`tests/sdd-config-field-validation-red.md` y `-green.md`, y `red/` y `green/` de esta carpeta).
- Dónde se implementa cada `MODIFIED`:
  - «`sdd-config` escribe solo lo respondido, en el fichero que toca»: el paso 3 y «Claves de política» de `sdd-config`. «Claves de política» ya manda a `sdd-kit.json` cualquier clave que no sea de las tres personales, así que no cambia; el catálogo sí.
  - «La entrevista fija las claves de control»: la fila 19 de greenfield, la 1 de brownfield y el catálogo de `sdd-config`.
  - «La migración a v2.3.0 lleva el roadmap a la forma de la plantilla»: solo cambia su último AND (la línea `**Escribe**:`), en `v2.3.0.md`.
- No entra:
  - `control-profiles.md` (decisión 5).
  - Los siete Minor de la 0118 (decisión 6).
  - El changelog y el bump a 2.3.0: los hace el cierre de la release.

## Approach

Una fila más en el catálogo de `sdd-config`, que ya es la única fuente de las preguntas de claves. Las init y la migración la heredan por invocación: las init cambian solo su lista de temas, y la migración gana el paso que pregunta lo que falta, con el mismo patrón que la v2.0.0 usó para las claves de control.

## Delta de comportamiento

### Capacidad: `configuration`

**ADDED — `sdd-config` pregunta quién valida el trabajo**
- GIVEN el proyecto `salas`, una aplicación web de reservas, con un `sdd-kit.json` que tiene `ids`, `control`, `merge` y `execution` y no tiene `validation.mode`
- WHEN el usuario pide «revisa la configuración del kit y ponla al día»
- THEN la tabla de `sdd-config` enseña `validation.mode` como «falta» y que rige `manual`
- AND su pregunta va sola en su turno, con `manual` como recomendada primero y su motivo: con `field` nadie para a probar, y la pantalla de `salas` sí se puede probar al cerrar
- AND con «`manual`» o «`field`» escribe `validation.mode` en `sdd-kit.json`; con «no sé» no escribe nada y rige `manual`
- AND en un proyecto que es un kit de skills sin aplicación, que solo se prueba usándolo en otros proyectos, la recomendada es `field`

**MODIFIED — `sdd-config` escribe solo lo respondido, en el fichero que toca** (antes: «una clave de política (`ids`, `merge`, frenos de `control`)»)
- GIVEN una respuesta del usuario a una pregunta de `sdd-config`
- WHEN la escribe
- THEN una clave de política (`ids`, `merge`, frenos de `control`, `validation.mode`) va a `sdd-kit.json`; `validation.startEnvironment` va a `sdd-kit.local.json`; `control.profile` y `execution` van donde el usuario diga (invocada por una init o por la migración, siempre a `sdd-kit.json`)
- AND «no sé» no escribe la clave y rige su default; lo que no se preguntó no se escribe
- AND invocada por una init o por una migración no escribe: devuelve las respuestas y quien la invocó las escribe en `sdd-kit.json`, en su paso de estructura o de marcador (enmienda del 2026-09-25)
- AND sin usuario no escribe nada: las preguntas quedan como pendientes explícitas en el informe de quien la invocó

### Capacidad: `onboarding`

**MODIFIED — La entrevista fija las claves de control** (antes: «… frenos (3 agentes; 8 y 20 minutos) y método de ejecución (`auto`)»)
- GIVEN una init greenfield o brownfield con el usuario presente
- WHEN la entrevista llega a las claves del kit
- THEN el agente invoca `sdd-config`, que hace en turnos distintos las preguntas de su catálogo, cada una con su opción recomendada y su motivo: modo de ids, perfil (`delegate`), política de merge (rama de integración, `--no-ff`, el worktree lo borra una persona), push de la rama de integración tras el merge («sí» con git-flow), frenos (3 agentes; 8 y 20 minutos), método de ejecución (`auto`) y quién valida (`manual`; `field` solo sin pantalla ni uso que el dev-lead pueda probar al cerrar)
- AND escribe en `sdd-kit.json` solo lo que el usuario responde: «no sé» no escribe la clave y rige su default, y un «no» a la política de merge deja `merge` sin declarar
- AND si la rama de integración es la estable, la pregunta de merge no se hace y `merge` queda sin declarar; sin `merge` declarado, la de push tampoco se hace
- AND la pregunta de push recomienda «sí» solo si la convención de ramas es git-flow; con otra convención se hace sin opción recomendada
- AND en brownfield sin usuario, las preguntas quedan pendientes explícitas en el resumen de cierre y el proyecto funciona con los defaults
- AND la init no pregunta las preferencias personales: el resumen de cierre dice que se fijan con `sdd-config`

### Capacidad: `migration`

**ADDED — La migración a v2.3.0 pregunta quién valida**
- GIVEN un proyecto en 2.2.0 cuyo roadmap pasa `Test-Roadmap.ps1` y cuyo `sdd-kit.json` no tiene `validation.mode`, con el dev-lead presente
- WHEN pide «ponme el proyecto al día»
- THEN el agente invoca `sdd-config`, que hace su pregunta de quién valida con la recomendación de su catálogo, y escribe en `sdd-kit.json` solo lo que responde el dev-lead
- AND con `validation.mode` ya escrito, el paso se salta y el informe lo dice
- AND con el dev-lead ausente no escribe la clave, y nunca `field`: el informe la lista como pendiente, con cómo reanudarla (invocar `sdd-config`), el proyecto sigue en `manual` y el marcador sube a 2.3.0

**MODIFIED — La migración a v2.3.0 lleva el roadmap a la forma de la plantilla** (antes: «declara en su línea `**Escribe**:` `roadmap.md` y el marcador»)
- GIVEN un proyecto en 2.2.0 con `roadmap.md` commiteado en `284d195`, que falla `Test-Roadmap.ps1` (sección «Versión siguiente», decisiones en prosa, una fila saldada antes de la última release), y el dev-lead presente
- WHEN pide «ponme el proyecto al día»
- THEN el agente presenta una tabla con cada bloque que sale o se mueve y su destino, y espera la aprobación antes de cambiar `roadmap.md`
- AND tras aprobar, `Test-Roadmap.ps1` escribe `Roadmap válido` y sale con 0
- AND el informe y el cuerpo del commit de la migración llevan `git show 284d195:.docs/sdd/roadmap.md` como la forma de ver el roadmap anterior
- AND si el dev-lead cambia un destino de la tabla, se aplica el suyo; si la rechaza, `roadmap.md` queda sin tocar y el paso, pendiente
- AND con `roadmap.md` sin commitear, el paso para antes de la tabla y lo dice
- AND `v2.3.0.md` declara en su línea `**Escribe**:` `roadmap.md`, `validation.mode` y el marcador, y `tests/MigrationInitParity.Tests.ps1` sigue en verde

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-01 | aprobada: «ok» |
