---
id: 20260927-124940-feature-0032-final-review-scope
feature: 0032
title: Encargo del revisor final — paquete con la base actual y sin evidencia
mode: lite
status: approved
created: 2026-09-27
author: Claude (Opus 5.5) con Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-27
---

# Spec — Encargo del revisor final: paquete con la base actual y sin evidencia

> **Estado**: approved.
> **Siguiente paso**: modo lite → implementación directa tras la aprobación.

## Capacidades

- Modificadas: `task-flow` — cómo se prepara el paquete del revisor final, qué no reporta un revisor sobre la atribución y con qué modelo escribe el plan al revisor final.

## Decisiones que he tomado yo — valida estas

Sin review de spec: la rúbrica de `review-spec.md` es solo para el modo full. He hecho yo el repaso de coherencia; lo que corregí va al final de este bloque.

1. **El paquete lo construye el hilo con una receta del kit, no con `review-package`**, siempre y no solo cuando la rama integró la de integración. La base es `git merge-base HEAD <integración>` en el momento de la revisión, y se excluyen `red/` y `green/` de la spec. Sin merge sale el mismo rango que hoy, así que una sola receta cubre los dos casos y no hace falta el condicional del ticket 0070. *Por qué*: `review-package` corta `BASE..HEAD` con la base del arranque (en `executing-plans` 6.4.2, «the commit the branch started from») y no admite exclusiones. Siete tickets (0014, 0021, 0031, 0044, 0055, 0058 y 0070) acabaron haciéndolo a mano: 9 MB frente a 179 KB, 730 KB frente a 78 KB, 670 KB frente a 65 KB.
2. **La base es el merge-base, no `git diff <integración> HEAD`** como proponía el ticket 0070. Si `develop` avanza después del merge, el diff contra su punta mete al revés los commits nuevos de `develop`. El merge-base con la rama integrada da solo lo de la rama en los dos casos. Los tickets 0070 §2 y 0058 §3 son el mismo fallo.
3. **Receta en texto, sin script nuevo del kit.** Son cuatro órdenes de git en Git Bash, el mismo shell que `review-package`, con el formato de su paquete (commits, ficheros, diff `-U10`). Un script pediría Pester y portabilidad para algo que se copia de un bloque. Si el GREEN muestra que los sujetos no copian la receta bien, pasa a script en otra feature.
4. **La receta aplica a los dos métodos, Native y SDD**, porque la sección «Revisor final» de `encargo-revision.md` ya cubre los dos. El revisor de task y la re-revisión siguen con `review-package` y su `BASE` por task, porque su rango no arrastra merges.
5. **En lite, `PLAN_FILE` es `spec.md`**. Solo lo usa `sdd-workspace` para saber dónde escribir el paquete (ticket 0046 §3).
6. **La frase del trailer va en la cabecera común**, dentro del bloque que llega a todo revisor, porque el falso Important lo marcó un revisor de task (ticket 0044 §2).
7. **El techo del revisor final va en el campo `Modelo` de `plan-template.md`**: «el revisor final de rama no sigue esta política: va con `sdd-kit:effort-high` + `opus`». Es donde quien escribe el plan aplica la política de subagentes (ticket 0058 §1).
8. **Campaña (Art. I), previsión de toda la campaña**: 10 sujetos en Sonnet, ~60 min y ~6 $, con techo de 10 $. Si lo supero, paro y decides tú.
   - E1, paquete en lite: fixture de una feature lite que integró `develop` tras su primer commit, con otra feature dentro y la carpeta `red/` en la spec. 2 sujetos RED y 2 GREEN, porque es una conducta nueva.
   - E3, trailer: un revisor de task ante un commit Sonnet con el trailer de Opus. 1 RED y 1 GREEN, porque es un cambio de redacción.
   - E4, techo en el plan: el paso 5 en `delegate` con un plan Native de una task. 2 RED y 2 GREEN: la 0058 midió 1 de 2.
   - Filas de control en el GREEN: el despacho del revisor final con `effort-high` + `opus` y la cabecera (E1), y que el revisor lee el paquete sin rehacer el diff ni ejecutar la suite (E3).
   - Pasos que el agente sigue y que cambian: la receta del paquete y el `PLAN_FILE` en lite (E1), la frase del trailer (E3), el campo `Modelo` (E4) y la fila de `overrides-superpowers.md`, que es índice, se mide dentro de E1. No toco nada de `migrations/`.
9. **Sin `Se valida en:`**: el escenario del merge depende del historial de git, pero la fixture lo reproduce en un repo de prueba y no necesita la base del kit al día.
10. **Partición y release** (la partición la decidiste tú; la release la he puesto yo): de la fila 0032 salen la 0085 (después de la revisión final) y la 0086 (review de la spec), con `parent: 0032`, en paralelo en sus worktrees. Cada una crea su fila en «Versión siguiente» (2.0.1), porque desde el corte todo lo nuevo va ahí. Al cerrar, la 0032 recorta su fila a lo que entrega y enlaza la 0085 y la 0086. «En línea, la revisión va antes del smoke» ya lo dice el paso 7, así que no entra en ninguna.

Repaso de coherencia. Corregí una cosa: la primera redacción decía «`git diff <integración> HEAD`» en el Approach y «merge-base» en la decisión 1. Dejé el merge-base en los dos sitios y en el THEN.

### Decisiones tomadas con el dev-lead

- Toda la fila, partida en tres y en paralelo — «pero se pueden hacer en paralelo? si es asi, me das el prompt de lo que no vas a hacer y lanzo otros worktree» (2026-09-27), tras elegir «Toda la fila» y preguntar por el orden.
- Modo lite — «Lite (Recomendada)» (2026-09-27).
- Parar en la spec, perfil `delegate` del proyecto — «Sí, paras en la spec (Recomendada)» (2026-09-27).
- Aprobación de la spec — «sigue», respuesta a «¿Apruebas la spec?» (2026-09-27).

## Intent

El revisor final lee un paquete que hace hoy `review-package` de superpowers. Ese paquete corta el rango desde el commit de arranque de la rama y mete la evidencia de las campañas. Si la rama integró `develop`, el revisor lee también el trabajo de otras features: hasta 9 MB y cinco millones de tokens de Opus. Siete tickets lo han rehecho a mano. Además, un revisor tomó el trailer de atribución por el modelo del implementador, en lite no se sabe qué `PLAN_FILE` pasar, y el plan puede escribir al revisor final por debajo del techo. Se quiere que el paquete salga bien a la primera y que el encargo y el plan no provoquen esos tres errores.

## Scope

- Entra: la receta del paquete en «Revisor final» de `skills/sdd-start-feature/references/encargo-revision.md`, con el merge-base actual, las exclusiones de `red/` y `green/` y `PLAN_FILE` = `spec.md` en lite. También «Cómo revisar», que apunta al paquete nuevo, la frase del trailer en la cabecera común y la fila de `executing-plans`/SDD en `references/overrides-superpowers.md` (el final no usa `review-package`). En `skills/sdd-templates/templates/plan-template.md`, el campo `Modelo`. Además, la evidencia en `tests/final-review-package-red.md` y `-green.md`, el delta de `task-flow`, la entrada del changelog y, al cerrar, el recorte de la fila 0032.
- No entra: lo de la 0085 (re-revisión de `<revisión final>..HEAD`, docs de menos de ~20 líneas en el hilo, reproducir antes de arreglar) ni lo de la 0086 (rúbrica, un revisor con los siete puntos, `MODIFIED` en el repaso). Tampoco un script del kit para el paquete, `tech-stack.md:133` (sigue como aprendizaje), el paquete del revisor de task y de la re-revisión, ni migración: no cambia `.docs/sdd/` de los proyectos.

## Approach

En «Revisor final», antes de «Cómo revisar», va un bloque «Paquete» con la receta en Git Bash. `MERGE_BASE=$(git merge-base HEAD <integración>)` con la rama de integración de la constitution, las dos exclusiones `':(exclude,glob).docs/sdd/specs/**/red/**'` y `…/green/**`, y la salida en `$(bash <ruta de sdd-workspace> <PLAN_FILE>)/review-final-<head7>.diff`, con las secciones Commits, Files changed y Diff (`-U10`). Detrás va una línea con el porqué medido y otra que dice que en lite `PLAN_FILE` es `spec.md`. «Cómo revisar» pasa a nombrar «la ruta del paquete». En la cabecera común entra la frase: «El trailer `Co-Authored-By` de los commits es la atribución de la sesión, no el modelo que escribió el diff: no lo reportes». La fila de overrides dice que el revisor final lee el paquete del kit. El campo `Modelo` del plan gana la frase del techo. Primero el RED con la guía vigente, después la edición y el GREEN.

## Delta de comportamiento

### Capacidad: `task-flow`

**ADDED — El paquete del revisor final sale del merge-base actual y sin evidencia**
- GIVEN una feature lite, sin `plan.md`, que tras su primer commit integró `develop` con un merge que trae los commits de otra feature (`skills/otra/SKILL.md`), y con `.docs/sdd/specs/<carpeta>/red/out.jsonl` en su rama
- WHEN el hilo prepara el paquete del revisor final
- THEN la sección de diff del paquete no contiene `skills/otra/SKILL.md` ni ningún fichero bajo `red/` o `green/`
- AND la sección de commits lista solo los de la feature y el merge
- AND el paquete se genera a la primera, con `spec.md` como `PLAN_FILE`

**ADDED — El trailer de atribución no es un hallazgo**
- GIVEN un commit de un implementador despachado con `model: sonnet` que lleva `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
- WHEN un revisor de task lo revisa con la cabecera de `encargo-revision.md`
- THEN no reporta el trailer ni el modelo del implementador como hallazgo

**ADDED — El plan escribe al revisor final con el techo del kit**
- GIVEN una spec aprobada en `delegate` y un plan Native de una sola task pequeña
- WHEN el agente escribe `plan.md`
- THEN el revisor final aparece como `sdd-kit:effort-high` + `opus`, o no aparece

### Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec: 0,75 h
- Estimación de implementación: 2,5 h (campaña de 10 sujetos incluida)
- Base de la estimación: cuatro ediciones de texto en dos ficheros, con la fixture de git como mayor incertidumbre. Referencia: los patches 0080 y 0082, de campaña parecida.
- Confianza: media

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-27 | aprobada: «sigue», respuesta a «¿Apruebas la spec?» |
