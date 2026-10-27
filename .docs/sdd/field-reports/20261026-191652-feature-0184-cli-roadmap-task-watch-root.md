---
kit_version: 2.3.4
superpowers_version: 7.0.1 (en la caché de plugins también 6.4.2 y 7.0.0)
lane: feature
id: 20261026-191652-feature-0184-cli-roadmap-task-watch-root
task: 0184
mode: full
date: 2026-10-26
---

# Ticket para el kit — feature 0184: seis arreglos de la CLI; un ruling contra «Dónde se prueba» y un baseline rojo por carga propia

## Contexto

- Carril y modo: feature full, perfil `delegate`, `validation.mode: field`
- Skills del kit usadas: `sdd-propose`, `sdd-grilling`, `sdd-start-feature`, `sdd-implement` (Native), `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-archive`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit (CLI en TypeScript sobre Node, Vitest y Pester, moon); una persona
- Modelo del hilo: claude-opus-5-5
- Modelos de los subagentes: claude-opus-5-5 (eje Spec y re-revisión), claude-sonnet-5-5 (eje Código)
- Coste en reloj: 1,37 h frente a 3 h estimadas
- Coste en tokens: hilo 34.783.216, subagentes 4.322.115 en 3 despachos; 14,96 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El baseline del gate de cierre salió rojo porque el hilo corría Vitest a la vez

- **Qué pasó**: lancé en segundo plano el baseline de `sdd-worktrees`, `moon run kit:test kit:test-headless cli:typecheck cli:test-min --affected --base develop`. Mientras corría, empecé la Task 1 y ejecuté `pnpm exec vitest run test/roadmap` en el mismo worktree. El gate acabó con `Tests Passed: 1344, Failed: 1`. El fallo fue `[-] Conjunto rápido del pre-commit.tarda menos del umbral y, si no, nombra el fichero que hay que marcar con Slow 78.58s`, con `kit:test` en 19 min 26 s. Las pruebas lentas de `publish` que lancé a la vez dieron `Test timed out in 5000ms`. Repetido sin carga al final, el mismo gate dio 1345 pasados y 0 fallos, en 14 min 11 s.
- **Fuente**: los logs del baseline y del gate final, en el scratchpad de la sesión; el walkthrough de la feature 0184, §3 («Baseline: Ruling…») y §4.1.
- **Dónde en el kit**: `skills/sdd-worktrees/SKILL.md`, «Step 3: Verify Clean Baseline», y `skills/sdd-implement/SKILL.md`, «Native loop», paso 1. El cerrojo de suites del patch 0218 (`sdd lock run`) solo lo cogen las tareas de moon, no un `pnpm exec vitest` lanzado a mano.
- **Por qué el kit no lo evitó**: `sdd-worktrees` pide el baseline, pero no dice que se espere en primer plano ni que no se corran tests a la vez. La «Verificación» de una task se escribe como `pnpm --dir cli exec vitest run …`, sin `sdd lock run` delante.
- **Coste**: un baseline de ~19 min que no sirvió de veredicto y un ruling para explicarlo (walkthrough 0184 §3). El gate se repitió entero al final (14 min), aunque esa repetición la pedía igualmente la validación.
- **Propuesta**: en `sdd-worktrees` paso 3, «el baseline termina antes de la Task 1: no lances tests del worktree mientras corre». O en `plan-template.md`, que la «Verificación» de una task con Vitest o Pester vaya tras `sdd lock run --`.
- **Verificada**: sin verificar (la causa por carga se infiere de que pasó sin carga, no se aisló).
- **Criterio de aceptación**: GIVEN el baseline de `sdd-worktrees` en segundo plano · WHEN el hilo va a correr la «Verificación» de la Task 1 · THEN espera al baseline (o la «Verificación» espera el cerrojo de suites con «Esperando el cerrojo de suites…»).

### 2. Ruling que cambió «Dónde se prueba» en vez de parar como desvío

- **Qué pasó**: «Dónde se prueba» de la spec decía «Tests fallidos del merge: `cli/test/merge/attempt.test.ts` y `verify.test.ts`». En la Task 5 lo resolví con un ruling: «sin test en attempt.test.ts — … lo cubren failureReport y las pruebas lentas de merge». El eje Spec lo sacó como Important: ningún test fijaba `tests fallidos:` en el camino real del hook ni en el de `--verify`. La pasada de fix añadió dos tests lentos en `failures.slow.test.ts`.
- **Fuente**: el ledger de la sesión (`Task 5: Ruling: sin test en attempt.test.ts…`); `tasks.md` de la feature 0184, «Rulings»; spec 0184, «Dónde se prueba».
- **Dónde en el kit**: `skills/sdd-templates/templates/spec-template.md`, «Dónde se prueba» («Cambiarla durante la implementación es un desvío»), frente a `skills/sdd-implement/SKILL.md`, «Deviations and rulings».
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué. `sdd-implement` define el desvío como «a requirement, a THEN, the Scope, a «No entra» or «Dónde se prueba»», pero el ruling que tomé tenía forma de decisión de plan («the plan is wrong»), y el bucle Native no me hizo contrastarlo con «Dónde se prueba».
- **Coste**: un Important en la revisión final y su arreglo en la pasada de fix, ~10 min con la mutación RED.
- **Propuesta**: en `sdd-implement`, «Native loop», paso 2, rama «The plan is wrong»: antes de anotar un ruling que quita o mueve un test, compararlo con la línea de «Dónde se prueba» de ese comportamiento. Si la cambia, es desvío, no ruling.
- **Verificada**: sí — contrastado con `skills/sdd-implement/SKILL.md` («Deviations and rulings», viñeta «Deviation») y con la plantilla de spec.
- **Criterio de aceptación**: GIVEN una spec cuyo «Dónde se prueba» nombra `attempt.test.ts` · WHEN el hilo en Native decide no escribir ese test · THEN para con la acción update (o mueve el test a otro fichero de la misma superficie y lo apunta como enmienda), no deja un `Ruling:`.

## Lo que hice por iniciativa propia

- No presenté el diseño por secciones (`skills/sdd-propose/references/spec-writing.md`, «Design by sections», con 4 o más tasks). Lo dejé en la spec por la regla 3 del `CLAUDE.md` del repo («Decides tú lo de método, sin preguntas intermedias»), y lo dije en ✋ (decisión 12). La spec se aprobó a la primera. El kit no dice cuál de las dos manda: candidato a una línea en `spec-writing.md` sobre `delegate` con «sin preguntas intermedias».
- Para que el RED del fix Important no fuera solo de cobertura, revertí a mano las dos líneas de producción, vi fallar los tests nuevos y restauré. Funcionó, y nada del kit lo pide para un test que llega después del código.

## Funcionó, no tocar

- Con la línea `Política de modelos:` del ✋ aprobada, los dos ejes salieron en paralelo sin volver a preguntar.
- `review.minors: fix` metió 9 Minor en la única pasada de fix, y la re-revisión única la cerró sin abrir otra.
- La recuperación tras un cuelgue de la máquina entre el `git reset --soft` del squash y el commit de cierre. El índice seguía staged y `git diff --cached fb4a8259 -- cli` vacío confirmó el contenido. Se repitió el commit sin perder nada.

## Menores

- El aviso nuevo de `sdd roadmap check` sale en el roadmap del repo: `roadmap.md: aviso: línea 332: apunta a 0214, ya ✅: sáldala`. Es una fila de deuda «Actuar → 0214» que el cierre de la 0214 no saldó. Hay que saldarla en el triaje. — `skills/sdd-archive/references/records.md`
- En PowerShell, un prefijo de saldada con backticks escrito entre comillas dobles perdió los backticks (el backtick es el escape de PowerShell). Se arregló con comillas simples. — no localizado
- Tras el cuelgue, la sesión retomada cargó las skills de la caché del plugin, no de la rama; lo avisó el hook `SessionStart`, y seguí el texto de la rama. — `.claude/hooks/Test-KitSessionSource.ps1`
