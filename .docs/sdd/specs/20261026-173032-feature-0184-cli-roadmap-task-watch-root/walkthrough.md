---
id: 20261026-173032-feature-0184-cli-roadmap-task-watch-root
feature: 0184
title: Walkthrough — CLI: columnas del roadmap, task start lite, vigía reanudado y raíz del proyecto
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-26
---

# Walkthrough — CLI: columnas del roadmap, task start lite, vigía reanudado y raíz del proyecto

## 1. Cambios realizados

- **`sdd roadmap check`** (`cli/src/roadmap/tables.ts`, `warnings.ts`; Task 1). Cada fila de una tabla se compara con su cabecera y, si no casan, da `línea <n>: la fila tiene <X> celdas y la cabecera <Y>`, en `roadmap.md`, `ROADMAP.md` y `debt.md`. En el roadmap 2.x, una fila ⏳ «Absorbida → <ids>» o una de deuda «Actuar → <ids>» sin saldar avisa `apunta a <ids>, ya ✅: sáldala` cuando todas sus ids están ✅. El check nuevo encontró cinco filas del `roadmap.md` del repo con `|` sin escapar dentro de un código; quedan escapadas con `\|`.
- **`sdd task start` y `task brief` con spec lite** (`cli/src/tasks/brief.ts`; Task 2). Con `mode: lite` en el frontmatter, el brief es la spec entera.
- **Vigía** (`cli/src/watch/events.ts`; Task 3). `isFinished` no cuenta un `end_turn` si después hay un mensaje `user`, que es lo que escribe la reanudación con `SendMessage`.
- **`--project-root`** (`cli/src/cli/args.ts`, `layout.ts` y los `verbs.ts` de roadmap, capabilities, decisions, estimation, init, upgrade y session; Task 4). Vale en todos los verbos que sitúan el proyecto:
  - Equivale a `--path <raíz>/.docs/sdd` en los verbos de documentos.
  - Es alias de `--root`, y de `--path` en `session tokens`.
  - Con las dos opciones a la vez, sale con 2.
  - Un `--path` o un `--root` desconocidos dicen dónde va la raíz.
- **`sdd merge` en rojo** (`cli/src/merge/verify.ts`, `attempt.ts`; Task 5). Antes de la cola de 20 líneas saca `tests fallidos:` y las líneas de test fallido: el `[-]` de Pester y el `FAIL` y el `×` de Vitest, también con el prefijo de moon.
- **Pasada de fix** (juntada en el commit de cierre). Tests por el camino real del hook y de `--verify`, de `ROADMAP.md` y de «Absorbida» sin flecha; los tests de `--project-root` ya pueden fallar. `docsFolder` pasa a `layout.ts`, `SHOWN_LINES` se comparte y `mode: lite-x` no cuenta como lite.
- Commits: `8f78f33f` (apertura), `3ec9e6cf`, `e39eebd8`, `41fbd711`, `926fa5be`, `03ff781c` (tasks) y el de cierre, con la pasada de fix.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 3h
- Esfuerzo real: 1,37 h — reloj de la sesión 1,38 h desde 2026-10-26T17:25Z, sin 1 min de espera al dev-lead (1 espera)
- Desviación: −1,63 h (−54 %)
- Causa de la desviación: las cinco tasks eran pequeñas e independientes, cada una con un solo módulo y tests que ya tenían su molde. La revisión final y el gate corrieron en segundo plano mientras se escribían los borradores. La estimación contó cada task como si llevara su propia investigación.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature)
- Tokens del hilo: 34.783.216 — claude-opus-5-5 34.783.216
- Tokens de subagentes: 4.322.115 en 3 despachos — Re-review final 0184 fix pass claude-opus-5-5 604.608 / 2 min; Final review — Code axis claude-sonnet-5-5 1.726.950 / 3 min; Final review — Spec axis claude-opus-5-5 1.990.557 / 5 min
- Coste de la sesión: 14,96 $ (hilo 12,05 $ + subagentes 2,91 $)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La Task 5 no añadió test en `attempt.test.ts`. La revisión final pidió tests por el camino real, y van en `failures.slow.test.ts`, el sitio que ya prueba el hook y `--verify` en rojo.
- La pasada de fix tocó ficheros que el plan no listaba: `cli/src/cli/layout.ts` y `cli/test/roadmap/now-next-later.test.ts`.

### Decisiones tomadas sin el dev-lead

- Task 1: «rejects a different release header» espera también las dos filas de 5 celdas bajo la cabecera de 4. Motivo: son ciertas y el THEN no dice «solo». Coste si está mal: filtrar las filas cuando la cabecera no es la de la plantilla.
- Task 1: cinco filas del `roadmap.md` del repo tenían `|` sin escapar dentro de un código; quedan escapadas con `\|` en el commit de la task. Coste si está mal: ninguno, el texto se lee igual.
- Task 1: hay un aviso real en `roadmap.md:332` (la deuda «Actuar → 0214», con la 0214 ✅). No lo salda esta feature porque la fila es de otra; va al ticket. Coste si está mal: una fila más por saldar.
- Baseline: el único rojo del gate fue el test de tiempo del conjunto rápido (78,58 s), con Vitest corriendo a la vez. Lo achaqué a la carga y repetí el gate sin ella: 1345/1345. Coste si está mal: el pre-commit es lento en `develop` y va a deuda.
- Task 4: el fixture de los tests de `--project-root` gana `specs/.gitkeep`, porque `estimation log` sale con 1 sin `specs/` ni `changes/`. Coste si está mal: ninguno, solo cambia el fixture.
- Task 5: dejé `attempt.ts` sin test propio. La revisión final lo rebatió y la pasada de fix añadió los dos tests lentos.
- Final: `falta la opción --path` no nombra `--project-root`. No lo cambio porque la spec no fija ese texto y cambiarlo sería un freno de alcance. Coste si está mal: una llamada fallida más antes de leer la ayuda.
- Final: un año dentro de la negrita anula el aviso. Se queda así porque la convención deja la fecha fuera de la negrita. Coste si está mal: una fila sin saldar que no avisa.
- Final: con una spec lite, `TASK_NUMBER` se ignora sin avisar, como dice la decisión 4 de la spec. Coste si está mal: un brief llamado `task-7` con la spec entera.
- Final: `FAILED_TEST` casa «1920 × 1080», no casa con colores ANSI y en Vitest saca duplicados FAIL y ×. Se queda así: el efecto es cosmético en un merge que ya está en rojo. Coste si está mal: líneas de más, o ninguna con color forzado.
- Final: lo que los revisores dejaron fuera (orden de los mensajes, «2 × 3», propuesta sin flecha, celda vacía al final, pista en verbos nuevos, carrera del vigía, roadmaps de usuarios con `|` en un código) se queda como está: la spec lo fija o lo deja fuera. Coste si está mal: un pre-commit rojo en un proyecto hasta que escape la fila.
- Final: en la re-revisión, `if (log !== '') rmSync(log)` del test nuevo de `--verify` deja el `.log` en `tmpdir` si el patrón no casa. Se queda porque no hay segunda pasada de fix y el test ya exige el mensaje. Coste si está mal: un `.log` huérfano.

## 4. Verificación

### 4.1 Builds

- Suite completa: `moon run kit:test kit:test-headless cli:typecheck cli:test-min --affected --base develop` → `cli:test-min` 1527/1527 (80 ficheros) · `kit:test` 1345 pasados, 0 fallos, 12 saltados · `cli:typecheck` verde · `kit:test-headless` saltado por `--affected` · 14 min 11 s · configuración: la del gate · sobre la pasada de fix (juntada en el cierre), con los borradores de capacidades en el árbol.
- Baseline (sobre `8f78f33f`): 1344/1345, con el rojo de tiempo descrito en las decisiones.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-26 · suite 1527/1527 y 1345/1345 · smoke 9/12 THEN con ejecución real, 3 con suite · revisión final Spec y Código sobre 03ff781c, pasada de fix juntada en el cierre, re-revisión limpia (1 Minor adjudicado)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| roadmap: fila `. \|\| ✅ \|` da «la fila tiene 4 celdas y la cabecera 3» | ejecución real (`roadmap check --project-root` sobre un roadmap de prueba: líneas 8 y 26, código 1) | ✓ |
| roadmap: `\|` sin escapar en un código da el mismo error; `\|` escapado no | ejecución real (línea 26) · suite (`does not count an escaped pipe inside code`) | ✓ |
| roadmap: lo mismo en `ROADMAP.md` y `debt.md` | suite (`flags a ROADMAP.md row…`, `flags a debt.md row…`) | ✓ |
| roadmap: avisos `apunta a 0149, ya ✅: sáldala` y `Roadmap válido` con código 0 | ejecución real (líneas 7 y 24, código 0) · repo: `roadmap.md:332` | ✓ |
| roadmap: ni la fila saldada ni la 🧪 avisan | suite (`does not warn of a settled or deferred pointer`) | ✓ |
| control-profiles: hook en rojo con `tests fallidos:` antes de la cola | ejecución real de `sdd merge` en el test lento (`con el hook en rojo nombra…`), RED por mutación | ✓ |
| control-profiles: `--verify` en rojo con `tests fallidos:`; sin líneas fallidas, el mensaje de siempre | ejecución real en el test lento · suite (`keeps the plain tail…`) | ✓ |
| cli: `task start <spec lite> 1` da `brief:` y `base:` con código 0 | ejecución real (spec lite de `20260909-100606-task-0000-skills-validation`) | ✓ |
| cli: sin `mode: lite`, «task 1 not found» | suite (`keeps the not-found error without mode lite`) | ✓ |
| cli: el vigía no da `TERMINADO:` tras un `user` posterior al `end_turn` | suite (`no da por terminado un subagente reanudado…`, sobre la CLI con `--once`) | ✓ |
| cli: `--project-root` = `--path`, `--root` o el `--path` de `session tokens` | ejecución real (`capability index --project-root .` igual que `--path .docs/sdd`) · suite por familia | ✓ |
| cli: dos opciones a la vez y `merge --path .` salen con 2 y el mensaje | ejecución real (`--path y --project-root no van juntas`, `--root y --project-root no van juntas`, `opción desconocida: «--path»; la raíz del proyecto va en --project-root`) | ✓ |

### 4.3 Residuales / deuda generada

- El test de anatomía que rechaza `$` tras `(?m)` sin `\r?` no se escribe aquí: queda para la 0225, al portar los Pester a `cli/test/kit/` (la fila de deuda se salda en parcial).
- En `roadmap.md:332`, la deuda «Actuar → 0214» sigue sin saldar con la 0214 ✅. Lo saca el aviso nuevo y va al ticket.

## 5. Aprendizajes

- Un check que empieza a comparar celdas por fila saca filas rotas del propio repo (5 aquí). El commit que lo introduce tiene que arreglarlas, o el pre-commit lo bloquea. → ya está en el riesgo del plan; no es regla nueva.
- Un test de tiempo del pre-commit falla si otro Vitest corre a la vez en la misma máquina. → `tech-stack.md` ya lo cubre con el cerrojo de suites (patch 0218), pero ese cerrojo no lo coge un `pnpm exec vitest` lanzado a mano. Va al ticket del kit, sin regla nueva.

## 6. Adendas
