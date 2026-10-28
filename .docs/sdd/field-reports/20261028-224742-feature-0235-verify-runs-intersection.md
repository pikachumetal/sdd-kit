---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: feature
id: 20261028-224742-feature-0235-verify-runs-intersection
task: 0235
mode: full
date: 2026-10-28
---

# Ticket para el kit — feature 0235: `sdd merge --verify` corre solo lo que se cruza y sin shell

## Contexto

- Carril y modo: feature full, perfil `delegate`, `validation.mode: field`, ejecución Native
- Skills del kit usadas: `sdd-propose`, `sdd-grilling`, `sdd-parallel-agents`, `sdd-start-feature`, `sdd-implement`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-archive`, `sdd-feedback`
- Proyecto: el propio kit (CLI en TypeScript sobre Node, moon, Vitest, baterías de sujetos)
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 (revisor de dominio de la spec, ejes Spec y Arquitectura, re-revisión), Sonnet 5.5 (revisor técnico de la spec, eje Código, sujetos de la batería)
- Coste en reloj: 2,36 h frente a 5 h estimadas
- Coste en tokens: hilo 87.210.716, subagentes 8.299.822 en 6 despachos; 32,08 $ de sesión y 1,31 $ de sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La pasada de fix en Native arregló a medias un hallazgo, y su test solo miraba el síntoma

- **Qué pasó**: el hallazgo «un target tras las opciones (`moon run --affected --base develop :test`) no corre nada y no avisa» (ejes Spec y Código) se arregló marcándolo como `blocker`. El test nuevo (`refuses to cross a target after the options`) solo comprobaba `blocker`, no qué se corría después. La re-revisión vio que el fallback seguía sin el target, y que el arreglo había roto los gates con una opción con valor (`--concurrency 2` → `moon run :test --affected --concurrency --base <sha>`). Hizo falta un commit más tras la re-revisión, que queda `sin revisar`.
- **Fuente**: `tasks.md` de la feature, líneas `Re-revisión:` y `Final: fixed tras la re-revisión`; `walkthrough.md` §3
- **Dónde en el kit**: `skills/sdd-verify/SKILL.md` «Closing the review», párrafo **Native** (línea 233: «Each fix is verified by TDD: write the test that reproduces the finding…»)
- **Por qué el kit no lo evitó**: «the test that reproduces the finding» no dice que el test afirme la conducta que el hallazgo echa en falta (lo que corre), y un test que fija la señal intermedia (`blocker`) pasa con un arreglo incompleto. La regla existía; el test que escribí reproducía el síntoma, no el efecto.
- **Coste**: re-revisión con 2 Important abiertos, ~25 min de arreglo y una suite de `test/merge` (~10 min) más, y un commit `sin revisar` en el cierre (`walkthrough.md` §3)
- **Propuesta**: en la pasada de fix, el test de cada hallazgo afirma el efecto que nombra el hallazgo (la salida, lo que se ejecuta, el fichero), no una variable interna del arreglo; y un test por cada forma vecina de la entrada que el arreglo toca (aquí: opción con valor).
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un hallazgo «X corre nada sin avisar» en una revisión final Native WHEN el hilo escribe su test de la pasada de fix THEN el test afirma lo que se ejecuta (el argv o el fichero que deja), y un sujeto que solo afirma una bandera interna sale rojo en la batería de `sdd-verify`

### 2. Un `sdd task done` en rojo por el entorno deja la task en varios commits sin juntar

- **Qué pasó**: la Task 2 hizo su commit y `sdd task done` falló dos veces por el entorno de los tests lentos (el `PATH` restringido heredando `MSYSTEM` de Git Bash; el `afterAll` que pasó de 10 s). Cada arreglo fue un commit nuevo tras el de la task; cuando la task quedó `complete`, la Task 3 ya estaba encima y juntarlos exigía `rebase -i`, que la receta prohíbe. La rama quedó con 2 + N + 2 commits.
- **Fuente**: `git log --oneline origin/develop..HEAD` antes del merge (`df9da2e`, `1f16c68`, `7dbd57c` de la Task 2); `walkthrough.md` §3
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md` Native loop, paso 4 «Close, in this order» (línea 106: «A failing run records nothing; the task is not complete.») y `skills/sdd-start-feature/references/commit-milestones.md`, fila «Task N»
- **Por qué el kit no lo evitó**: el paso dice que la task no está completa, pero no qué hacer con el arreglo: el juntado de la fila «Task N» es «antes de `sdd task done`», y el arreglo llega después del primero.
- **Coste**: historia fuera de la forma 2 + N (sin coste en reloj medido); ~10 min de diagnóstico del `MSYSTEM` (sin respaldo)
- **Propuesta**: tras un `sdd task done` en rojo, el arreglo se junta en el commit de la task (`git reset --soft <BASE>` y un commit) antes de relanzarlo, mientras no haya otra task encima.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una task con su commit y `sdd task done` en rojo WHEN el hilo arregla y relanza THEN `git rev-list --count <BASE>..HEAD` es 1 al registrarse la línea `complete`

### 3. Un conflicto del merge de sincronización solo en una fila de deuda vuelve a parar el cierre

- **Qué pasó**: `sdd merge --sync` dio `base: conflicto en .docs/sdd/roadmap.md.`: la rama añadía un prefijo «parcial» a una fila de deuda que el triaje de otra feature había cambiado en `develop` (su «Destino»), más dos filas nuevas al lado. La resolución sin pérdida era evidente; la receta manda que la resuelva una persona, y el cierre paró a preguntar.
- **Fuente**: salida de `node cli/bin/sdd.js merge --sync --project-root <worktree>`; `skills/sdd-archive/references/merge-recipe.md:10`
- **Dónde en el kit**: `skills/sdd-archive/references/merge-recipe.md` «Integrated base», viñeta `base: conflicto en <files>.`
- **Por qué el kit no lo evitó**: la regla existe y se aplicó; es la pregunta abierta de la fila 0236 («un `base: conflicto en` solo de `.docs/` que junta dos añadidos sin contradicción»): este es un tercer caso.
- **Coste**: una parada al dev-lead en un perfil `delegate` (sin respaldo de minutos)
- **Propuesta**: lo decide la 0236; con este caso, un prefijo de cierre (`**[Feature <id> …]**`) sobre una fila que la base cambió es un añadido sin contradicción.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una fila de deuda con el prefijo de cierre en la rama y su «Destino» cambiado en la base WHEN `sdd merge --sync` THEN la fila queda con el prefijo y el «Destino» de la base, sin conflicto

## Lo que hice por iniciativa propia

- Durante la spec, un workspace de moon de dos proyectos en el scratchpad para comprobar que `moon query tasks --affected` respeta `MOON_BASE`: destapó que moon se cuelga con el stdin abierto, y el plan lo fijó antes de escribir código. Funcionó.
- Copiar el ledger al scratchpad antes de borrar el workspace del plan, para escribir el walkthrough. Funcionó.

## Funcionó, no tocar

- Los dos revisores de la spec (dominio Opus, técnica Sonnet) encontraron 4 Críticos antes de aprobar: el rango de la base, el contraste, las `deps` de moon y sus opciones.
- El Art. II en la batería: el GREEN parafraseó el aviso, y pasar el paso a un bloque de contrato lo arregló en una tanda.
- `validation.mode: field`: el cierre siguió sin parar a pedir validación.

## Menores

- La primera campaña falló sin lanzar sujetos por no pasar `SUPERPOWERS_DIR`, y el GREEN por un `SUBJECT_CAP` que ya había gastado el RED (son comunes a todas las fases) — `.docs/sdd/tech-stack.md` «Baterías por skill» (estaba escrito)
- `docs-claims.test.ts` leía como opciones de `sdd merge` el valor entre comillas de `--verify` en un requisito; arreglado en la feature — `cli/test/docs-claims.test.ts`
