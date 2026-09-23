---
id: 20260923-220402-task-0026-superpowers-641
task: 0026
title: Compatibilidad con superpowers 6.4.1 y ruta del workspace en Windows
mode: full
status: approved
created: 2026-09-24
author: Claude (Opus 5.5), dev-lead Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-24
---

# Spec — Compatibilidad con superpowers 6.4.1 y ruta del workspace en Windows

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: **ninguna**. Señales: dos filas nuevas en una tabla de overrides, sin capacidad nueva, sin `MODIFIED` y sin código ejecutable. Toda la spec sale de evidencia ya medida (`red/sondas.md` y `red/out/`). Una lente adversarial buscaría si alguno de los frentes que doy por «no aplica» esconde un fallo. Esos frentes van al roadmap como posibles falsos negativos, con su evidencia. La opción mínima deja sin cubrir que otra persona relea la clasificación de los frentes.

1. **Recorte del 2026-09-23 aplicado tal cual.** Entran la compatibilidad con 6.4.1 y la ruta POSIX de `sdd-workspace`. El anuncio del workspace, la cosecha de los `Ruling:`, la «Recuperación» y los commits por ruta vuelven a la fila 0026 de la versión siguiente.
2. **Veredicto por frente**, medido antes de la spec. Los frentes deterministas se midieron leyendo el texto de superpowers o ejecutando sus scripts, sin sujetos. Los de conducta, con evidencia de campañas previas o con sujetos:

   | Frente | Evidencia | Veredicto |
   | --- | --- | --- |
   | (a) Execution Handoff de `writing-plans` y HARD-GATE de `brainstorming` (revisar el plan y elegir método) | 0006 `g-e1-1`, 6.4.1 en `delegate`: pregunta el método y **recomienda «Nativo»** contra el Art. IV. Falla 1 de 2 | **Override**: fila nueva |
   | (b) Sección «Review Focus» | Necesita `plan-template.md`, que toca la 0031 | **Decisión aplazada** a después de la 0031, en la versión siguiente. Sin override |
   | (c) «Declined to judge» de `code-reviewer.md` | RED `r-d-1` y `r-d-2`: 2 de 2 sacan las tres líneas al dev-lead en la validación. `r-d-1` cita el freno «salida observable». Nada se pierde | **No aplica**: sin fallo no hay guía (Art. I). Al roadmap como posible falso negativo |
   | (d) Ejecución «Native» de `executing-plans` | El kit no invoca `executing-plans` (0 apariciones en `skills/`). La única puerta es el handoff de (a) | **No aplica**. La cierra la fila de (a) |
   | (e) «Establish Shared Understanding» de `brainstorming` | RED `r-v-2` y `r-v-3`: 2 de 2 escriben lo entendido antes de la spec, pero junto a una pregunta de alcance legítima: el molde no tiene cómo cambiar el estado de una reserva. No se ve una parada solo para confirmar | **No aplica** por ahora. Al roadmap como posible falso negativo: falta un molde sin hueco de alcance |
   | (f) Verde de `test-driven-development` = suite entera | 0006 `g-e2-1` y `g-e2-2`, con 6.4.1: 2 de 2 implementadores no lanzan la suite con la `## Verificación` del kit | **No aplica**: el encargo ya gana. Posible falso negativo: no se sabe si cargaron TDD |
   | Art. V: override de la clasificación de `brainstorming` | `r-v-2` y `r-v-3` invocan `brainstorming` 6.4.1 y van hacia `spec.md`, no hacia «no spec file». Ninguno llega a escribirla: paran antes en la pregunta de alcance | **Se mantiene sin cambios**. Re-test parcial, con ese límite escrito en la evidencia |
   | Art. V: herencia de «Restricciones globales» | Sonda: `task-brief` 6.4.1 saca un brief sin ninguna línea de «Restricciones globales». Prompts de superpowers sin cambios en ese punto | **Se mantiene**: el hueco sigue |
   | Ruta de `sdd-workspace` en Windows (ticket 0006 §2) | Sonda: imprime `/tmp/claude/…` o `/d/code/…`. `cygpath -w` da la forma Windows | **Override**: fila nueva |

3. **Dónde va cada override**: las dos filas nuevas van en `overrides-superpowers.md`, la tabla que el paso 4 y el paso 6 ya enlazan. No cambio ningún paso de `SKILL.md`: el paso 5 no lo toca nadie en paralelo, pero la fila basta, y cambiar el paso sería otra conducta que medir.
4. **Método de ejecución**: la fila de (a) dice que el handoff no se ofrece. El método ya lo fija el kit (Art. IV: `subagent-driven-development` por defecto y la ejecución en línea por task en `Ejecución`). La revisión del plan sigue la tabla de gates. El HARD-GATE de `brainstorming` («reviews the written implementation plan and selects its execution method») queda cubierto por la misma fila.
5. **Forma de la ruta**: la fila del workspace dice que se convierte con `cygpath -w` la ruta que imprimen `sdd-workspace` y `task-brief`, antes del primer `Write` o `Read`. Solo aplica en Windows, cuando la ruta empieza por `/`. Predicado observable, Art. II.
6. **Validada la 6.4.1** en README:149 y en «Referencias de vigilancia», con la fecha del GREEN. Solo cambia esa frase del README. La 0031 toca otra, la línea 72, así que no hay conflicto de hunk.
7. **Campaña (Art. I)**: previsión y techo comunes al RED previo y al GREEN, declarados en el chat antes del primer sujeto: **unos 10 sujetos, unos 12 $ y unas 2,5 h; techo 16 $**. El RED previo ha gastado 5 sujetos y 1,74 $: `r-v-1` no vale (permiso de `PowerShell` denegado) y se relanzó como `r-v-3`. GREEN previsto: 4 sujetos, handoff ×2 y workspace ×2. El techo no se toca.
8. **Ficheros y paralelo con la 0031 y la 0053**. Toco:
   - `skills/sdd-start-task/references/overrides-superpowers.md`
   - `README.md`, solo la línea 149
   - `.docs/sdd/roadmap.md` (fila 0026, «Referencias de vigilancia» y deuda)
   - `.docs/sdd/changelog.md`
   - `tests/superpowers-641-red.md` y `tests/superpowers-641-green.md`, nuevos
   - la carpeta de esta spec

   No toco `plan-template.md`, `review-spec.md`, la constitution, `SKILL.md` de `sdd-start-task` (ningún paso), `sdd-start-patch`, `sdd-end-patch` ni `encargo-revision.md`. Cruce con la base: la 0031 toca `README.md` en otro hunk. La 0053 fusiona al cerrar en `capabilities/control-profiles.md` y `task-flow.md`, igual que esta, con requisitos distintos. `roadmap.md` y `changelog.md` son registros compartidos por todas las tasks.
9. **Capacidades**: ninguna nueva. Las dos conductas van como `ADDED` a `control-profiles` (handoff) y `task-flow` (workspace).

## Intent

superpowers 6.4.1 está instalado y el README declara validada la 6.3.0. El Art. V no deja cortar la 2.0.0 sin repasarla. De los seis cambios de 6.4.1 que tocan skills que el kit invoca, uno ya rompe un contrato del kit. En `delegate`, `writing-plans` pregunta el método de ejecución y recomienda el contrario al del kit. Aparte, en Windows la ruta del workspace de `subagent-driven-development` llega en forma POSIX, y un sujeto sin nadie que apruebe permisos se quedó bloqueado. Se quiere que el kit declare validada la 6.4.1 con cada frente decidido y medido.

## Scope

- Entra: fila de override del Execution Handoff y del HARD-GATE architectural; fila de la ruta del workspace en Windows; README y «Referencias de vigilancia» con la 6.4.1 validada; evidencia RED/GREEN; frentes sin override registrados en el roadmap.
- No entra: «Review Focus» en `plan-template.md` (tras la 0031, versión siguiente); el anuncio del workspace, la cosecha de `Ruling:`, la sección «Recuperación» y los commits por ruta (versión siguiente); cambios en pasos de `SKILL.md`; guía para (c), (e) y (f), que no fallan.

## Approach

Dos filas nuevas en la tabla de overrides, cada una con el texto de superpowers al que responde y la evidencia que la justifica. GREEN con los mismos escenarios del RED: `h` (el guion de la 0006 E1) y `w` (el paso 6 hasta el ledger) sobre el molde de la task 0006. Con el GREEN limpio, la 6.4.1 queda validada en README y roadmap. Los frentes sin override se registran con su evidencia para que la versión siguiente no los vuelva a medir desde cero.

## Delta de comportamiento

### Capacidad: `control-profiles`

**ADDED — El plan no pregunta el método de ejecución**
- GIVEN una task en modo full con la spec aprobada y superpowers ≥ 6.4.1, cuyo `writing-plans` cierra con un Execution Handoff
- WHEN el agente guarda el plan
- THEN no pregunta el método de ejecución ni ofrece «Native»: aplica `subagent-driven-development`, salvo las tasks que el plan declara en línea en `Ejecución`
- AND la revisión del plan sigue la tabla de gates del perfil vigente: en `delegate` y `unattended` no para; en `pair` para a aprobar el plan, sin preguntar el método

### Capacidad: `task-flow`

**ADDED — En Windows, el workspace de ejecución se usa en su ruta Windows**
- GIVEN Windows y la ruta que imprimen `sdd-workspace` o `task-brief` de superpowers en forma POSIX (empieza por `/`, por ejemplo `/tmp/claude/…` o `/d/code/…`)
- WHEN el agente va a escribir o leer por primera vez en ese workspace (el ledger, un brief, un informe)
- THEN usa la ruta que da `cygpath -w`, y el `Write` no pide un permiso que un sujeto sin usuario no puede conceder

## Enmiendas

- 2026-09-24 — La decisión 8 añade `skills/sdd-start-task/references/encargo-revision.md` a los ficheros que toco: una sección «Rutas del workspace en Windows» que remite a la fila de overrides. — En el GREEN, `g-w-2` no abrió `overrides-superpowers.md` (el paso 6 solo la enlaza al pie), su primer `Write` fue a `C:\tmp\…` y quedó denegado. Los dos sujetos leyeron `encargo-revision.md`, que el paso 6 sí enlaza donde se usa. Ni la 0031 ni la 0053 tocan ese fichero. — aprobada: «Puntero en encargo-revision (Recomendado)»

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-24 | aprobada: «si» |
