---
id: 20260922-141616-task-0020-init-control-keys
task: 0020
parent: 0012
title: Claves de control en las entrevistas de las init
mode: full
status: approved
created: 2026-09-22
author: Claude (hilo principal)
approvers:
  - role: dev-lead
    name: dev-lead
    approved_at: 2026-09-22
---

# Spec — Claves de control en las entrevistas de las init

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED (un requisito de `onboarding` y uno de `migration`)
- Mínimo razonable: ninguna — deja sin mirar la redacción de las tres preguntas, que el GREEN pone a prueba con sujetos
```

1. **Los dos frentes se reproducen y entran los dos** ([RED previo](../../../../tests/init-control-keys-red.md), 9,83 $):
   - **F1**: las init no preguntan las claves de control. No hay ninguna mención en las dos init fuera de `migrations/`. En conducta, 0 de 2 sujetos de brownfield las preguntaron, y tampoco los 5 sujetos de greenfield del GREEN de la 0012. Agravante: brownfield escribe `"version": "1.2.0"` en `sdd-kit.json`, así que la migración v1.2.0, que es la que pregunta esas claves, no se le aplica nunca.
   - **F2**: la entrevista de brownfield pregunta por lotes. 2 de 2 sujetos juntaron ids y changelog en el turno 1 y la segunda respuesta se perdió. Además, uno pidió aprobar los cinco documentos de una vez. La fila de deuda pasa a esta task.
2. **Las preguntas viven en un solo sitio.** Van en un bloque nuevo, «Preguntas de las claves de control», de `sdd-start-task/references/control-profiles.md`, con la pregunta, la opción recomendada, el motivo y la clave que escribe cada una. Greenfield, brownfield y la migración v1.2.0 lo enlazan, no lo copian. Así las tres preguntan lo mismo y de la misma forma, y no se abren tres copias que diverjan.
3. **Son tres preguntas, cada una en su turno:**
   - **Perfil de control.** Recomendado: `delegate`. Motivo: para en la spec, en los desvíos y en la validación, y se ahorra el gate del plan; con menos paradas, la 0.6.0 cerró tres tasks en un día.
   - **Política de merge**, como una sola propuesta completa: fusionar a la rama de integración con `--no-ff`, y el worktree lo borra una persona. Motivo del `--no-ff`: el merge deja la task en un commit que se revierte de una vez. Motivo del borrado a mano: borrar es irreversible si quedan cambios sin commit. «Sí» escribe el bloque `merge` entero; «no» o «no sé» no escriben nada, y el cierre de task pregunta como hoy.
   - **Frenos.** Hasta 3 agentes en paralelo, y aviso tras 8 minutos de silencio entre pasos o tras 20 en un comando largo. Recomendado: los defaults. «Sí» o unos números propios escriben los tres valores; «no sé» no escribe nada y rigen los defaults.
4. **Sin rama de integración no se pregunta el merge.** Si la integración va directa a la rama estable (sin `develop`), `merge` queda sin declarar. El Art. IV dice que el merge a la rama estable lo decide siempre una persona.
5. **La respuesta a la entrevista es la frase del usuario.** Escribir `control.*` o `merge` con lo que el usuario contesta no es concederse el atajo: es anotar su respuesta. No se añade un registro aparte.
6. **La migración v1.2.0 se alinea con la init.** Pregunta también los frenos y deja el gate único: hace las mismas tres preguntas, una por turno, y salta las claves que ya estén. Cambia un requisito que añadió la 0008. Se puede porque la 1.2.0 aún no se ha publicado (`plugin.json` sigue en 1.1.0).
7. **Dónde van en cada entrevista.** En greenfield, las tres preguntas van al final de la lista (18–20), detrás de la de worktrees, porque la rama de integración sale de la pregunta de ramas (15). En brownfield van tras la pregunta de ids y antes de la constitution, y la rama de integración se propone con la que se ve en el repo.
8. **La receta de brownfield es la de greenfield (Art. II, fallo de forma).** El paso 3 lleva la lista numerada de sus preguntas (ids, changelog, cliente, las tres claves), y cada turno termina con una sola pregunta o con un solo documento para aprobar. No se vuelve una entrevista completa como la de greenfield: brownfield sigue deduciendo del código.
9. **Brownfield sin usuario.** Las tres claves quedan pendientes explícitas en el resumen de cierre, igual que los documentos «PENDIENTES DE REVISIÓN». El proyecto funciona con los defaults, y el cierre de task pregunta el merge. Greenfield no cambia: sin usuario ya espera en la primera pregunta.
10. **Capacidades**: se amplían `onboarding` y `migration`, sin capacidad nueva.

### Decisiones tomadas con el dev-lead

- Carril y perfil: task full en `delegate` — opción «Task full, delegate (Recommended)» en la primera pregunta.
- Presupuesto del RED previo: entrevista completa — opción «16 turnos, ~13 $» (gastado: 9,83 $).
- La 0020 va antes que la 0019 — «es lo que necesita la entrega de hoy; la 0019 integrará después».

## Intent

La 0008 definió las claves de control (`control.profile`, `merge`, `control.maxParallelAgents`, `control.silence.*`), pero solo la migración v1.2.0 pregunta por ellas, y solo por el perfil y el merge. Un proyecto que nace con `sdd-init-greenfield` o `sdd-init-brownfield` se queda sin ellas y lo marcan ya como v1.2.0, así que nadie se las preguntará. Además, la entrevista de brownfield junta preguntas y pierde respuestas. Lo que se quiere: que las dos init y la migración hagan las mismas preguntas, una por turno, con opción recomendada y motivo, y guarden la respuesta en `sdd-kit.json`.

## Scope

- Entra: el bloque de preguntas en `control-profiles.md`; las preguntas 18–20 de greenfield y la escritura de las claves en su paso de estructura; la lista numerada del paso 3 de brownfield (con las tres claves) y la escritura en `generacion.md`; el paso 2 de `migrations/v1.2.0.md` con los frenos y una pregunta por turno; el árbol de `estructura.md` y el marcador de `generacion.md` con los campos nuevos de `sdd-kit.json`.
- No entra: la conducta de los frenos (task 0022); cambiar los defaults; el resto de la entrevista de brownfield (orden de documentos, inventario); lo que crean las init (task 0019); comprobar las claves con un hook.

## Approach

Una fuente, tres consumidores. Las preguntas y sus recomendaciones se escriben una sola vez en `control-profiles.md`, que ya es la fuente de las claves y de los gates. Las dos init y la migración las enlazan en el punto de uso y aplican la regla que ya tiene greenfield: una pregunta por turno. En brownfield, esa regla se escribe como receta: una lista numerada y un documento por gate. RED: el previo a la spec cubre F1 y F2 en brownfield, y los streams de la 0012 cubren F1 en greenfield sin coste. GREEN con los mismos escenarios, más uno de migración.

## Delta de comportamiento

### Capacidad: `onboarding`

**MODIFIED — La entrevista hace una sola pregunta por turno** (antes: «GIVEN una init greenfield en su entrevista»)

- GIVEN una init greenfield o brownfield en su entrevista
- WHEN el agente pregunta al usuario o le presenta un documento
- THEN cada turno termina con una única pregunta de la lista de la entrevista, o con un único documento para aprobar
- AND convención de ramas, worktrees y entorno del worktree son preguntas distintas, en turnos distintos

**ADDED — La entrevista fija las claves de control**

- GIVEN una init greenfield o brownfield con el usuario presente
- WHEN la entrevista llega a las claves de control
- THEN el agente hace, en turnos distintos, las tres preguntas del bloque de `control-profiles.md`, cada una con su opción recomendada y su motivo: perfil (`delegate`), política de merge (rama de integración, `--no-ff`, el worktree lo borra una persona) y frenos (3 agentes; 8 y 20 minutos)
- AND escribe en `sdd-kit.json` solo lo que el usuario responde: «no sé» no escribe la clave y rige su default, y un «no» a la política de merge deja `merge` sin declarar
- AND si la rama de integración es la estable, la pregunta de merge no se hace y `merge` queda sin declarar
- AND en brownfield sin usuario, las tres quedan pendientes explícitas en el resumen de cierre y el proyecto funciona con los defaults

### Capacidad: `migration`

**MODIFIED — La migración a v1.2.0 pregunta las claves de control que faltan** (antes: «un solo gate pregunta al dev-lead el perfil (recomendado `delegate`) y la política de merge a `develop`»)

- GIVEN un proyecto cuyo `sdd-kit.json` no tiene `control.profile`, un bloque `merge` completo o las claves de frenos (`control.maxParallelAgents`, `control.silence.*`)
- WHEN se aplica `migrations/v1.2.0.md`
- THEN el agente hace, una por turno, las preguntas del bloque de `control-profiles.md` que corresponden a lo que falta, las mismas que hace la init, y escribe solo lo que responde; lo que ya estaba no se pregunta
- AND sin dev-lead, el paso queda pendiente explícito: el proyecto funciona con los defaults y con el paso 10 del cierre preguntando el merge, y el informe dice cómo reanudarlo

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | dev-lead | 2026-09-22 | aprobada: «si» |
