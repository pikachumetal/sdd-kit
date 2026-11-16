---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: feature
id: 20261028-140711-feature-0237-lint-clean-kit-markdown
task: 0237
mode: full
date: 2026-10-28
---

# Ticket para el kit — feature 0237: el markdown del kit pasa markdownlint

## Contexto

- Carril y modo: feature full, perfil `delegate`, validación en campo
- Skills del kit usadas: sdd-propose, sdd-grilling (no hizo falta preguntar: el prompt traía las decisiones), sdd-parallel-agents, sdd-start-feature, sdd-implement (Native), sdd-worktrees, sdd-tdd, sdd-verify, sdd-archive, add-to-changelog, sdd-feedback
- Proyecto: el propio kit (CLI en TypeScript con Vitest, skills en markdown), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: review de spec, dominio Opus y técnica Sonnet; revisión final, Spec Opus y Código Sonnet; re-revisión Opus
- Coste en reloj: 1,20 h de esfuerzo real frente a 1,5 h estimadas; reloj de la sesión 2,11 h
- Coste en tokens: hilo 31.166.000, subagentes 5.072.183 en 5 despachos; 15,06 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. `kit:test` sale en verde sin correr ningún test

- **Qué pasó**: en el gate de cierre sobre el merge de sincronización, `kit:test` tardó 18 min 30 s (casi todo esperando el cerrojo de suites de otros tres worktrees) y escribió `System.Management.Automation.RuntimeException: No test files were found and no scriptblocks were provided.`, y moon la dio por completada. La rama de integración ya no tiene ningún `*.Tests.ps1`: se pasaron a Vitest. Con `-PassThru`, `Invoke-Pester` lanza la excepción, `$result` queda nulo y `exit ($result.FailedCount + $result.FailedContainersCount)` sale con 0. La línea base de esta misma sesión también corrió `kit:test` en verde.
- **Fuente**: salida del gate en el scratchpad (`moon run kit:test kit:test-headless cli:typecheck cli:test-min --affected --base develop`, PowerShell 7) → `kit:test | System.Management.Automation.RuntimeException: No test files were found…` y `Tasks: 3 completed (1 cached)`; `git ls-tree -r --name-only origin/develop | Select-String '\.Tests\.ps1$'` → 0; `git log --diff-filter=D -- '*.Tests.ps1'` → `c4659b10 test(kit): el lanzador de sujetos y las baterías pasan a Vitest`; `tests/Invoke-KitTests.ps1:12-14`.
- **Dónde en el kit**: `tests/Invoke-KitTests.ps1` (líneas 12-14) y la tarea `kit:test` de moon, que el gate de cierre de `.docs/sdd/tech-stack.md` (§Testing, «Gate de cierre») nombra; también la usa la línea base de `skills/sdd-worktrees/SKILL.md` paso 3.
- **Por qué el kit no lo evitó**: el script supone que siempre hay ficheros de Pester y deduce el código de salida de un objeto que, sin ficheros, no existe; el gate sigue nombrando una tarea que ya no prueba nada, y la línea `Gate:` de `sdd-verify` acepta «corrió» sin contar tests.
- **Coste**: 18 min 30 s de reloj del gate en `kit:test` (walkthrough de la 0237, §4.1, y la salida citada), y un verde falso en la línea base y en el cierre.
- **Propuesta**: o se quita `kit:test` del gate de cierre (y del pre-commit si lo lleva `kit:test-fast`) ahora que no hay Pester, o `Invoke-KitTests.ps1` sale con un código distinto de 0 si `$result` es nulo o `TotalCount` es 0.
- **Verificada**: sí — reproducido en el gate de cierre de esta sesión (PowerShell 7, Pester 6.2.0).
- **Criterio de aceptación**: GIVEN `tests/` sin ningún `*.Tests.ps1` WHEN `moon run kit:test` THEN sale con un código distinto de 0 y dice que no hay tests, o la tarea ya no está en el «Gate de cierre».

### 2. La «Verificación» de una task nombra suites enteras que esperan el cerrojo de otros worktrees

- **Qué pasó**: el plan puso como «Verificación» de cada task `moon run cli:typecheck cli:test-min` (y `kit:test` en la Task 2), como manda la plantilla: los comandos de las superficies. `cli:test-min` es la CLI entera (~24 min) y va con `sdd lock run`. La de la Task 1 esperó al cerrojo de la línea base y tardó 23 min 54 s; mientras tanto el hilo siguió con las Tasks 2 y 3 y la verificación corrió con esas ediciones en el árbol. La de la Task 2, ya ceñida a `vitest run test/capability test/kit`, dejó un `bash` de una batería de `test/kit` colgado quemando CPU, y lo avisó otra sesión. Se acabó verificando con `vitest run test/capability` y dos ficheros de `test/kit`, por ruling.
- **Fuente**: ledger del plan (líneas `Task 1: complete … Time: 23m 54s 832ms` y los rulings de las Tasks 1, 2 y 3, copiados en `tasks.md` §Rulings y en el walkthrough §3 de la 0237); mensaje de la sesión de la 0228 con el PID del `bash` colgado.
- **Dónde en el kit**: `skills/sdd-propose/references/plan-writing.md` y el campo «Verificación» de `skills/sdd-templates/templates/plan-template.md`.
- **Por qué el kit no lo evitó**: la plantilla pide «los comandos de esas superficies y ninguno más», pero en este repo la superficie «tooling» solo tiene tareas de moon que corren la suite entera bajo el cerrojo común; no dice que la verificación de una task va con los ficheros de test que toca, ni que una tarea con cerrojo bloquea el bucle de tasks mientras otro worktree lo tiene.
- **Coste**: ~24 min de espera en la Task 1 y ~10 min de la verificación colgada de la Task 2, más cuatro rulings para reconducirlo (walkthrough §3 de la 0237).
- **Propuesta**: que la «Verificación» de una task nombre los ficheros de test que toca (`npx vitest run <ficheros>` en este repo) y deje las tareas de moon con cerrojo para el gate de cierre; en `tech-stack.md` §Testing, una línea «Verificación de una task» con la forma.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un plan de una feature de la CLI WHEN se escribe la «Verificación» de una task THEN nombra `vitest run` con los ficheros de test de la task, no `cli:test-min` ni `kit:test`.

### 3. La rúbrica de review de spec dio «ninguna» y la review encontró una regla real que faltaba

- **Qué pasó**: con dos señales (contrato público y MODIFIED), la rúbrica de `review-spec.md` dio «ninguna». El dev-lead la pidió igual en el gate («has hehco dom opus / tec sonnet»). Los dos revisores dieron 20 hallazgos y se aceptaron 17, entre ellos que la forma nueva produce MD024 (dos `#### Reglas de la capacidad` en una misma spec), que la spec negaba sin medir. Se confirmó con markdownlint 0.38.0 y cambió la forma del encabezado de reglas.
- **Fuente**: spec de la 0237, «✋ Decisiones» (bloque de review y «Hallazgos de la review»); `npx --yes markdownlint-cli2@0.18.1` en el scratchpad → `spec.md:41 MD024/no-duplicate-heading`.
- **Dónde en el kit**: `skills/sdd-start-feature/references/review-spec.md` §1 y §2.
- **Por qué el kit no lo evitó**: la señal «contrato público» pesa como cualquier otra, y un formato de fichero que escriben las plantillas y leen todos los proyectos (un formato de artefacto del kit) cambia el contrato de todos ellos; con dos señales no llega a proponer revisor.
- **Coste**: un turno de gate extra y 499.686 tokens de revisores (367.156 Opus + 132.530 Sonnet, walkthrough §2 de la 0237); sin la review, la plantilla habría salido con MD024 en toda spec con dos capacidades.
- **Propuesta**: que el cambio de un formato que escriben las plantillas del kit (marca del delta, cabecera de un artefacto) proponga como mínimo un revisor técnico, aunque tenga menos de 4 señales. Es el primer caso: va a «Esperar 2.º ticket».
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una spec del kit que cambia la forma del delta de `spec-template.md` con 2 señales WHEN se aplica la rúbrica THEN propone un revisor técnico.

## Lo que hice por iniciativa propia

- Medí con `npx markdownlint-cli2@0.18.1` en el scratchpad antes de fijar el alcance, y le rebatí al dev-lead la letra de «reglas por defecto»: MD013 rechaza cualquier párrafo de una spec. Funcionó: el alcance quedó en todas las reglas salvo MD013 y MD033, medido.
- Separé los commits de las Tasks 2 y 3, que compartían `merge.test.ts`, reponiendo la copia RED de cada task antes de commitear. Funcionó, con ruling.
- Paré por su PID los `bash` huérfanos de mi verificación cuando otra sesión avisó, y le contesté.

## Funcionó, no tocar

- `sdd capability merge` sobre la propia spec, ya escrita con `####`, como prueba real de la feature, y la prueba del delta en una copia de `.docs/sdd` antes del gate.
- La validación en campo: smoke por THEN con ejecución real de la CLI, sin parar a pedir validación.
- `sdd merge --sync` y después `sdd merge --push --verified-at`, que avisó del commit ajeno de `develop` que salía con el push.

## Menores

- `sdd task done` apunta en el ledger la última línea de la salida, que con Vitest es el consejo `learn more: https://vitest.dev/guide/improving-performance…` y con moon `Time: …`, no el resumen `Tests  N passed` — `cli/src/tasks/` (verbo `task done`).
- Para probar en una copia el delta de una spec que ya usa la forma nueva, hubo que pasarlo a negrita, porque la CLI de antes de la Task 1 no lee `####` — `skills/sdd-propose/SKILL.md` paso 4 (repaso de coherencia).
- El plan se contradecía: la restricción global decía que solo cambiaba un test existente, y el paso 1 de la Task 2 mandaba cambiar otro; lo marcaron los dos ejes y se resolvió con un ruling — `skills/sdd-propose/references/plan-writing.md`, «Self-review».
