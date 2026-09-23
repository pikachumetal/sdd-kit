---
id: 20260923-191212-task-0044-commit-per-milestone
task: 0044
title: Un commit por hito — apertura, cada task y cierre
mode: full
profile: delegate
status: approved
created: 2026-09-23
author: Claude (Opus 5.5) con el dev-lead
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-23
---

# Spec — Un commit por hito: apertura, cada task y cierre

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: capacidad nueva (`commit-history`), MODIFIED (`task-flow` «Los tests de la spec preceden al implementador»)
- Técnica: si la receta de juntar (§ Approach) choca con el `BASE..HEAD` que registra `subagent-driven-development` (señal: MODIFIED)
- Mínimo razonable: ninguna — deja sin cubrir una lectura ajena de la interacción con superpowers, que el GREEN ejercita de todos modos
```

No cuento «contrato público»: la forma de la historia es una convención de los proyectos, no un formato que lea otro módulo. Ningún script del kit lee los mensajes ni el número de commits.

1. **Capacidad nueva `commit-history`** (la historia de la rama de una task o de un patch). Ahí van los requisitos de forma. El de los tests RED sigue en `task-flow` como MODIFIED. — Hoy ninguna capacidad habla de commits, y la regla vale igual para tasks y para patches.
2. **Qué contiene cada hito:**
   - La **apertura** lleva spec, hallazgos de la review de spec, `plan.md` y `tasks.md`; en lite, solo la spec.
   - **Cada task del plan** lleva sus tests RED, su implementación, los arreglos de su revisión y su evidencia. En este repo, la evidencia es la de la campaña de sujetos.
   - El **cierre** lleva la documentación de cierre y, además, los arreglos de la revisión final de rama y los de la validación del usuario.

   En lite, la implementación es un solo hito. — Con la revisión final dentro del cierre, la rama tiene exactamente 2 + N commits. La alternativa era un commit `fix` suelto, y es justo lo que hoy «no se entiende en el git».
3. **El patch queda en dos commits**:
   - **fix**: código, tests y `patch.md`.
   - **cierre**: `patch.md` con el hash del fix y el tiempo, más changelog, roadmap y estimation-log.

   — `patch.md` apunta el hash del fix, y un commit no puede contener su propio hash. Sustituye al «pueden ir en commits separados» de `sdd-end-patch` paso 2.
4. **El hash de la task N se escribe en `tasks.md` en el commit del hito siguiente.** Ese hito es la task N+1 o, para la última task, el cierre. — Es el mismo motivo que en el patch. El cierre (`sdd-end-task` paso 6) ya repasa todos los hashes.
5. **Receta sin script**: `git reset --soft <base>` y un `git commit`. La base es el commit anterior al hito:
   - en la apertura, el `merge-base` con la rama de integración;
   - en una task, el BASE que el hilo apuntó antes de despachar;
   - en el cierre, el commit de la última task.

   Con un solo commit en el rango no se hace nada. — Son dos comandos y no hay decisión que automatizar. Un script con Pester va contra lo que la 0045 quiere podar.
6. **Dos guardas, y ante cualquiera de las dos no se junta**:
   - el rango contiene un merge (`git rev-list --merges <base>..HEAD` no vacío);
   - el rango tiene commits ya publicados en un remoto (`git branch -r --contains <primer commit del rango>` no vacío).

   Nunca se hace push forzado. El walkthrough (o `patch.md`) dice qué hito quedó sin juntar y por qué. — Juntar a través de un merge de `develop` mete los cambios de `develop` en el commit del hito, y reescribir lo publicado obliga a un push forzado. Los merges de sincronización siguen fuera de alcance: la guarda solo evita estropearlos.
7. **Los tests RED se escriben y no se commitean antes del despacho.** Van en el commit de la task, con `git add` de rutas explícitas, y nunca con `--no-verify`. El hilo guarda una copia fuera del repo y, al volver el implementador, compara el test commiteado con esa copia; un cambio que no sea de formato va al revisor de la task. — Es la pieza que la 0044 absorbe de la 0007. Con el juntado, el commit previo de los RED ya no aporta nada a la historia, y con un `pre-commit` que exige la suite en verde no se puede hacer (tickets 0002 §1 y 0042). La copia sustituye la prueba que daba ese commit: que el test es el del hilo.
8. **Momento de cada juntado**:
   - apertura: justo antes del primer despacho;
   - task: cuando su revisión (y su re-revisión) queda limpia, antes de despachar la siguiente o la revisión final;
   - cierre: tras la documentación de `sdd-end-task` y antes del merge del paso 10.
9. **Dónde vive la regla**:
   - la forma, en la constitution Art. IV (lo que el kit fija a los proyectos), y el Art. VI dice que este repo la sigue;
   - la receta y las guardas, en `skills/sdd-start-task/references/commit-milestones.md`;
   - una frase con enlace en el punto de uso: `sdd-start-task` pasos 5 y 6, `sdd-end-task`, `sdd-start-patch` y `sdd-end-patch`;
   - `overrides-superpowers.md` gana una fila, porque sustituye el «Frequent commits» de `writing-plans` en la historia final;
   - `plan-template.md` quita «y commiteados antes de despachar» y el «Step 4: Commit» por paso.

   — El Art. IV dice que cambiar una convención suya es un cambio mayor, con revisión de las skills afectadas. Las que commitean son las cuatro de task y patch. Los commits del carril release (reserva de ids, cierre) quedan fuera.
10. **Esta task ya se ejecuta con la forma nueva** (apertura, tasks y cierre juntados). — Es dogfooding, y la historia de la propia 0044 sirve de ejemplo real.
11. **Campaña (Art. I proporcional), previsión**:
    - **RED, a coste cero, desde el archivo**: la rama de la 0040 (13 commits, `489944a^1..489944a^2`), el patch 0043 (ticket separado del cierre) y el ticket de la 0042 (RED frente al `pre-commit`).
    - **GREEN**: 5 escenarios (apertura, task, cierre, patch y guarda) × 2 sujetos Sonnet = 10 sujetos, ~10 $ y ~75 min.
    - **Techo con una tanda de REFACTOR**: 14 sujetos, ~14 $ y ~1 h 45 min. Si se supera, paro y decides tú.

    — La guarda del merge no tiene RED: el riesgo lo crea la propia guidance del juntado, así que solo se mide en el GREEN. Mínimo defendible: 1 sujeto por escenario (5 sujetos, ~5 $). Deja sin repetir cada conducta, y la constitution pide la campaña completa para una conducta nueva.
12. **Política de modelos**:
    - implementador de las ediciones de skills: Sonnet, effort medio;
    - revisores de task y revisor final: Sonnet, effort medio;
    - sujetos de campaña: Sonnet, como fija `tech-stack.md`.

    Nada de `fable` ni de `opus xhigh`. — Son ediciones de texto escritas desde la spec. El criterio es «gama media como suelo».

### Decisiones tomadas con el dev-lead

- Forma: un commit de apertura (spec, plan y tasks), uno por task (implementación, tests y arreglos) y uno de cierre (documentación de cierre) — consulta del 2026-09-23
- Commits intermedios permitidos mientras la revisión los necesite; al quedar limpia la revisión de cada hito, `git reset --soft <base>` y un único commit, sin nada interactivo — consulta del 2026-09-23
- El hash de `tasks.md`, `patch.md` y el walkthrough es el del commit ya juntado — consulta del 2026-09-23
- Squash al fusionar, descartado: deja sin rama los hashes de los artefactos — consulta del 2026-09-23
- Fuera de alcance: los merges de sincronización con `develop` a mitad de rama — consulta del 2026-09-23
- Absorbe de la 0007 los tests RED frente a un `pre-commit` que exige la suite en verde — consulta del 2026-09-23
- Task full con perfil `delegate` y la fila 0044 como enunciado — «Full + delegate (Recomendado)», 2026-09-23

## Intent

Hoy la rama de una task acumula un commit por cada paso del flujo: spec, hallazgos de la review, plan, cada task, cada ronda de fix, la evidencia y el cierre. La de la 0040 tuvo 13. Quien lee el git no distingue qué es qué («yo en el git no veo eso, veo el plan solo, test solos»). Se quiere que la historia de una rama cuente sus hitos: apertura, una por task y cierre. Los commits intermedios siguen existiendo mientras la revisión de superpowers trabaja por rangos, y los hashes de los artefactos apuntan a commits que sobreviven al merge.

## Scope

- Entra: la forma de la historia de una rama de task (full y lite) y de patch; la receta de juntar y sus dos guardas; el hash en `tasks.md` y `patch.md`; los tests RED sin commit previo al despacho; la constitution Art. IV y Art. VI; `commit-milestones.md` nuevo; `sdd-start-task` (pasos 5 y 6), `overrides-superpowers.md`, `plan-template.md`, `tasks-template.md`, `encargo-revision.md` (contrato del RED), `sdd-end-task`, `sdd-start-patch` y `sdd-end-patch`; evidencia RED y GREEN en `tests/`.
- No entra:
  - los merges de sincronización con `develop` a mitad de rama (la guarda solo evita juntar a través de ellos);
  - squash al fusionar;
  - los commits del carril release;
  - el formato del mensaje, que sigue siendo el del proyecto;
  - cómo se integran en la rama las tasks en paralelo con worktree propio;
  - un script de juntado;
  - el resto de la fila 0007 (calidad de los RED, refactors, fidelidad de los moldes).

## Approach

La regla es de forma, así que va como receta y contrato (Art. II), no como prohibición. Durante un hito todo sigue igual: `subagent-driven-development` commitea y revisa por rangos. Al quedar limpia la revisión del hito, el hilo junta el rango con `reset --soft` sobre la base del hito y un único commit, salvo que salte una guarda. El hash del commit juntado pasa a los artefactos en el hito siguiente. Los tests RED dejan de commitearse antes del despacho: se commitean con la implementación, y la copia del hilo sustituye la prueba de autoría que daba aquel commit.

## Delta de comportamiento

### Capacidad: `commit-history`

**ADDED — La apertura de una task queda en un commit**
- GIVEN una task con la spec aprobada y, en full, `plan.md` y `tasks.md` escritos, con uno o más commits desde el `merge-base` con la rama de integración
- WHEN el hilo va a despachar la primera task (en lite, a empezar la implementación)
- THEN desde el `merge-base` la rama tiene un solo commit, con spec, hallazgos de la review de spec, `plan.md` y `tasks.md` (en lite, solo la spec)

**ADDED — Cada task del plan queda en un commit**
- GIVEN la revisión de la task N limpia (y su re-revisión, si la hubo) con uno o más commits desde el BASE que el hilo apuntó antes de despacharla
- WHEN el hilo va a despachar la task siguiente o la revisión final de rama
- THEN desde ese BASE la rama tiene un solo commit, con los tests RED, la implementación, los arreglos de la revisión y la evidencia de la task
- AND el hash que `tasks.md` apunta para la task N es el de ese commit, escrito en el commit del hito siguiente

**ADDED — El cierre de una task queda en un commit**
- GIVEN las tasks juntadas, la revisión final de rama hecha, el trabajo validado y la documentación de `sdd-end-task` escrita
- WHEN el hilo va a hacer el merge del cierre
- THEN desde el commit de la última task la rama tiene un solo commit, con la documentación de cierre y los arreglos de la revisión final y de la validación
- AND una rama sin merges de sincronización tiene 2 + N commits desde el `merge-base`, con N tasks en el plan (3 en lite)

**ADDED — El patch queda en dos commits**
- GIVEN un patch con el fix verificado
- WHEN se cierra con `sdd-end-patch`
- THEN la rama tiene dos commits desde el `merge-base`: el fix (código, tests y `patch.md`) y el cierre (`patch.md` con el hash del fix y el tiempo, más changelog, roadmap y estimation-log si existen)
- AND el `commit:` de `patch.md` es el hash del commit del fix

**ADDED — No se junta a través de un merge ni lo ya publicado**
- GIVEN el rango de un hito que contiene un commit de merge, o un commit ya publicado en un remoto
- WHEN llega el momento de juntar ese hito
- THEN no se junta y no se hace push forzado
- AND el walkthrough (o `patch.md`) dice qué hito quedó sin juntar y por qué

### Capacidad: `task-flow`

**MODIFIED — Los tests de la spec preceden al implementador** (antes: «existen y están commiteados antes del primer encargo»)
- GIVEN una task cuya implementación se despacha a un subagente
- WHEN el hilo principal prepara el despacho
- THEN los tests que codifican los escenarios de la task existen antes del primer encargo, escritos por el hilo, uno por THEN, en RED, sin commitear
- AND el encargo del implementador nombra su ruta como contrato: no los modifica; si uno le parece incorrecto, para y lo explica; los commitea con su implementación con `git add` de rutas explícitas y nunca con `--no-verify`
- AND el hilo guarda una copia fuera del repo antes del despacho y, al volver el implementador, la compara con el test commiteado; un cambio que no sea de formato va al revisor de la task

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-23 | aprobada: «apruebo la spec» |
