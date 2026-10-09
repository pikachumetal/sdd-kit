---
id: 20261009-115120-patch-0164-cli-merge-help-guard
task: 0164
title: Patch — salvaguardas de la CLI sdd: --help en todos los verbos, merge sin argumentos y task done sin commits
type: patch
solution: dev-lead
status: done
created: 2026-10-09
branch: patch/0164-cli-merge-help-guard
commit: d3f3ba17
---

# Patch 0164 — salvaguardas de la CLI sdd: --help en todos los verbos, merge sin argumentos y task done sin commits

## Capacidades

- Modificadas: `cli` — cada verbo admite `--help`; `sdd merge` sin argumentos no fusiona; `sdd task done` no registra una task sin commits en su rango

## 1. Síntoma

Ticket de la feature 0146 (`field-reports/20261009-100956-feature-0146-propose-spec-and-plan.md`), filas de deuda del roadmap que lo citan:

- §4: «para ver la ayuda ejecuté `node cli/bin/sdd.js merge` desde el worktree de la feature. Fusionó `feature/0146-entry-explore-propose` en `develop` (`da5a6dcd`) sin `--push`, en lugar de imprimir el uso. El resto de verbos rechaza `--help` con «opción desconocida».»
- §5: commit rechazado por el pre-commit y, en la misma orden, «Task 5: complete (commits 7f987c2..7f987c2…)».

Medido en `develop` (`c69e2b25`): `node cli/bin/sdd.js id next --help` → «opción desconocida: «--help»», salida 2. `merge` no se ejecutó sin argumentos para no fusionar; el código lo confirma: `mergeVerb.run` toma `projectRoot: '.'` por defecto y llama a `mergeBranch` sin ninguna guarda. `finishTask` no compara la base con `HEAD`.

## 2. Solución fijada

Dev-lead, 2026-10-09: «1) todos los verbos admiten --help e imprimen su uso; 2) `sdd merge` sin argumentos imprime el uso y sale con código distinto de 0 sin fusionar; 3) `sdd task done` se niega a registrar una task si HEAD sigue en su base, con el mensaje «sin commits en el rango: ¿falló el pre-commit?», y sale con código distinto de 0. Un test de Vitest por cada caso en cli/test/.»

Lo que da por existente, comprobado: los verbos `merge` y `task done` y el despacho de `run` en `cli/src/main.ts`, que solo atendía `--help` como primer argumento.

## 3. Fix

- **Fichero(s)**:
  - `cli/src/main.ts`
  - `cli/src/merge/verbs.ts`
  - `cli/src/tasks/done.ts`
  - `cli/src/tasks/verbs.ts`, `cli/src/decisions/verbs.ts`, `cli/src/roadmap/verbs.ts`
  - `cli/test/cli.test.ts`, `cli/test/merge/usage.test.ts`, `cli/test/tasks/native.slow.test.ts`, `cli/test/tasks/executing.slow.test.ts`
- **Cambio**: `run` atiende `--help` en cualquier posición antes de `--` y no ejecuta el verbo: imprime su uso, generado de sus opciones y sus posicionales, y su resumen. `sdd merge` sin opciones lanza un error de uso (salida 2). `finishTask` compara `BASE^{commit}` con `HEAD` antes de ejecutar los tests y, si coinciden, falla con `Task <N> NOT recorded: sin commits en el rango: ¿falló el pre-commit?` (salida 1).
- **Decisiones**:
  - El uso se genera de `options` y `positionals` del verbo, y los `positionals` pasan a nombres legibles (`PLAN_FILE TASK_NUMBER BASE -- TEST_COMMAND [ARGS...]`, los del mensaje de uso que ya tenían los verbos de task); hasta ahora solo se usaban para permitir posicionales — sin el dev-lead
  - `sdd <sustantivo> --help` lista los verbos de ese sustantivo, y un `--help` tras `--` es del comando de `task done`, no de la CLI — sin el dev-lead
  - «Sin argumentos» es sin opciones: `merge` no admite posicionales. El error dice `sdd merge necesita al menos una opción; para fusionar el worktree actual, --project-root .` y le sigue el uso; ningún llamador del kit lo invoca sin `--project-root` — sin el dev-lead
  - `task done` comprueba el rango antes de ejecutar los tests, para no gastarlos en una task que no se va a registrar — sin el dev-lead
  - Los tests de `task done` que usaban la base como `HEAD` hacen un commit encima de la base — sin el dev-lead

Ninguna decisión cambia lo que el usuario puede hacer más allá de lo fijado: son del cómo.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED `cli.test.ts`: `capability index --help` imprime uso y resumen sin ejecutar; cada verbo de `VERBS` sale con 0 y `uso: sdd <verbo>` | ❌ antes: salida 2 · ✅ ahora |
| 2 | RED `merge/usage.test.ts`: `run(['merge'])` con `mergeBranch` simulado | ❌ antes: salida 0 · ✅ ahora: salida 2, uso en stderr, `mergeBranch` sin llamar |
| 3 | RED `native.slow.test.ts`: `task done` con `BASE` = `HEAD` | ❌ antes: salida 0 y ledger escrito · ✅ ahora: salida 1, el mensaje, sin ejecutar el comando ni escribir `progress.md` |
| 4 | smoke: `sdd merge`, `sdd merge --help`, `sdd id next --help`, `sdd task done --help`, `sdd task --help` | ✅ uso impreso; `sdd merge` sale con 2 |
| 5 | `moon run cli:typecheck cli:test cli:test-slow` | ✅ typecheck · 717/717 rápidos · 157/157 lentos (uno ajustado: asumía base = `HEAD`) |

Los casos los verificó el agente.

Validación en campo: 2026-10-09 · RED/GREEN de los tres casos · cli:test 717/717 · cli:test-slow 157/157 · smoke 5/5

## 5. Tiempo (ligero)

- Real: 0,5h

## 6. Delta de capacidad

### Capacidad: `cli`

**ADDED — Cada verbo enseña su uso con `--help` sin ejecutarse**
- GIVEN la CLI
- WHEN se ejecuta `node sdd.js <sustantivo> <verbo> --help` (o `node sdd.js merge --help`, `node sdd.js workspace --help`) con cualquier verbo registrado
- THEN escribe `uso: sdd <sustantivo> <verbo>` con sus opciones y argumentos y su línea de ayuda, sale con 0 y no ejecuta el verbo
- AND `node sdd.js <sustantivo> --help` lista los verbos de ese sustantivo
- AND un `--help` detrás de `--` en `sdd task done` es del comando de tests, no de la CLI

**ADDED — `sdd merge` sin argumentos no fusiona**
- GIVEN un worktree con una rama por fusionar
- WHEN se ejecuta `node sdd.js merge` sin ninguna opción
- THEN escribe en stderr que necesita al menos una opción y el uso de `sdd merge`, sale con 2 y no fusiona

**ADDED — `sdd task done` no registra una task sin commits**
- GIVEN un plan y `HEAD` en el mismo commit que la `BASE` de la task, por ejemplo porque el pre-commit rechazó su commit
- WHEN se ejecuta `node sdd.js task done <plan> <n> <base> -- <comando>`
- THEN escribe en stderr `Task <n> NOT recorded: sin commits en el rango: ¿falló el pre-commit?`, sale con 1, no ejecuta el comando y no escribe en el ledger
