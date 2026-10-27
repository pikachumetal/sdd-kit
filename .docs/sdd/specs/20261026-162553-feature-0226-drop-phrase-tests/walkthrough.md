---
id: 20261026-162553-feature-0226-drop-phrase-tests
feature: 0226
title: Walkthrough — Frases fuera y anatomía a Vitest
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-26
---

# Walkthrough — Frases fuera y anatomía a Vitest

## 1. Cambios realizados

- **Tests** (`99054c44`, pasada de fix `60917106`, enmienda `87066629` y el cierre): 57 de los 67 `tests/*.Tests.ps1` salen del repo; quedan los 10 de conducta (`HeadlessLauncher`, `Battery`, `SubjectOutputPrivacy`, `UpstreamWatch`, `Clear-GitEnv`, `Hook`, `DenyKillHook`, `KitSessionSource`, `TempDir`, `FastSuiteBudget`). Entran en `cli/test/kit/` `word-budget`, `path-length`, `skills` (carga, enlaces, `references/`, `@`, índice de plantillas, superpowers del README, manifests, skills invocadas, `NOTICE`, proyectos reales), `agents`, `workflow-docs`, `migration-init-parity`, `roadmap-template` y `manifests.slow`, con el ayudante `kit-files.ts`.
- **moon**: `cli/moon.yml` toma el repo entero como `testInputs` (`/**/*`), por la enmienda del 2026-10-26.
- **Docs** (`2ab881a9` y la pasada de fix): rutas nuevas en la constitution (Art. I), `architecture.md`, `tech-stack.md` (estado y gate de cierre), `README.md`, el `CLAUDE.md` del repo, `sdd-upgrade` y `spec-template.md`; filas 0224, 0227 y B21 del roadmap; [ADR 0019](../../decisions/0019-skills-not-tested-by-phrases.md).
- **Capacidades**: `migration` (tres requisitos), `roadmap`, `feature-flow` y la regla «Límites» de `archive`, por el delta de la spec.
- ADR: las skills no se prueban por sus frases — alternativa descartada: portar las frases a Vitest o quedarse solo con las frases de contrato (criterio de la 0045) → decisions/0019-skills-not-tested-by-phrases.md

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 2 h
- Esfuerzo real: 1,47 h — reloj de la sesión 2,03 h desde 2026-10-26T16:19Z, sin 33 min de espera al dev-lead (7 esperas)
- Desviación: −0,53 h (−26 %)
- Causa de la desviación: dentro de ±30 %
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature)
- Tokens del hilo: 46.677.266 — claude-opus-5-5 46.677.266
- Tokens de subagentes: 9.597.931 en 3 despachos — Final review — Spec axis claude-opus-5-5 5.231.537 / 6 min; Final review — Code axis claude-sonnet-5-5 1.491.821 / 2 min; Re-review final 0226 claude-opus-5-5 2.874.573 / 4 min
- Coste de la sesión: 20,49 $ (hilo 15,68 $ + subagentes 4,81 $)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- **Enmienda 2026-10-26** (aprobada por el dev-lead en su gate): `testInputs` pasa de la lista de la decisión 3 a `/**/*`. Con la lista, una ruta de 144 caracteres en `.agents/` dejaba `cli:test` en caché y en verde (reproducido tras la revisión final). La Task 1 queda afectada por enmienda → Task 3.
- La pasada de fix recortó lo que la Task 2 había añadido a `tech-stack.md` y `architecture.md`, que pasaban de su tope nominal, y quitó del árbol de `architecture.md` la mención de `cli/test/kit/`.

### Decisiones tomadas sin el dev-lead

- Task 1: el patrón de skill entre comillas invertidas es `sdd-*`, `using-sdd` y `add-to-changelog`, no `(sdd|using)-*` del plan — `using-git-worktrees` sale entre comillas en la procedencia de sdd-worktrees y no es una invocación — si es incorrecto: un `using-*` del kit inventado no se detectaría (hoy solo existe using-sdd)
- Task 1: path-length no pasa `-c core.quotepath=off` — gitSync ya pone core.quotePath=false — si es incorrecto: ninguno
- Task 1: la Verificación espera `Test Files  7 passed (7)`, no 8 — el plan contó kit-files.ts, que no es un test — si es incorrecto: ninguno
- Task 1: el RED de cada fichero es un mutante sobre el árbol — no hay copia RED que comparar: el test se escribe en este hilo y es lo que cambia — si es incorrecto: un test se ajustó al código sin verse fallar; lo cubre el mutante de cada fichero
- Task 2: la fila B21 de la deuda también nombraba `tests/WordBudget.Tests.ps1` y se reescribe con la ruta nueva, aunque la spec solo listaba 0224 y 0227 — es una fila pendiente que apunta al fichero que se borra — si es incorrecto: una línea del roadmap
- Final: `argument-hint` y `user-invocable` no se portan — no impiden cargar la skill: solo cambian el menú de comandos — si es incorrecto: una skill de arranque sin pista de argumentos en el menú
- Final: la regla «Límites» de `archive` sigue diciendo dónde aparecen los nombres retirados — es la regla, no su test; la retirada se comprobó una vez — si es incorrecto: un nombre retirado sin comillas reaparece sin aviso
- Final: `tech-stack.md:58` y `:247` siguen citando Pester borrados — son aprendizajes fechados, fuera del Scope — si es incorrecto: dos rutas históricas muertas
- Final: la decisión 11 de la spec lista 0001 y 0002 entre las ADR de frase; se corrige en la ADR 0019, no en la spec — la spec es el registro de lo aprobado — si es incorrecto: una lista inexacta en la spec
- Final: la rama `.cmd` de `manifests` no se ha ejecutado (aquí `claude` es `.exe`); su elección del ejecutable sí tiene test — sin shim en esta máquina — si es incorrecto: en una máquina con npm el lanzamiento por el shell fallaría
- Final: `architecture.md:74-76` nombra `word-budget.test.ts` sin la carpeta y el árbol no menciona `cli/test/kit/` — la tabla dice qué fichero acota cada documento y cabe en su tope; la carpeta la dicen `CLAUDE.md` y `tech-stack.md` — si es incorrecto: hay que buscar una vez dónde vive
- Final: la fila 0045 está en «Próximo», no en «Backlog»: lleva el prefijo de saldada y su estado pasa a ✅ — su trabajo (inventario y poda de los Pester) lo hace esta feature — si es incorrecto: una fila cerrada que el dev-lead quería abierta

✋ sin revisar: juntada en el cierre — tras la re-revisión, `manifests` elige el `claude` con extensión que lista `where` (el Important que dejó la re-revisión, RED→GREEN con `en Windows salta el shim sin extensión y elige el .cmd`), la lista de superpowers del README vuelve a excluir las migraciones, y la ADR 0019 corrige la cita de la 0014.

## 4. Verificación

### 4.1 Builds

- Línea base (antes de la Task 1): `moon run kit:test kit:test-headless cli:typecheck cli:test-min --affected --base develop` → verde, solo `kit:test` (1345 pasados), 1 min 37 s.
- Suite completa: `moon run kit:test kit:test-headless cli:typecheck cli:test-min --affected --base develop` → verde sobre `87066629`: `kit:test-headless` 81 pasados (21 min 19 s), `kit:test` 92 pasados (4 min 48 s), `cli:test-min` 87 ficheros, 1715 pasados y 12 saltados (20 min 13 s), `cli:typecheck` en caché · 46 min 24 s · configuración: la del gate.
- Tras el commit sin revisar: `vitest run test/kit` → 8 ficheros, 219 pasados y 12 saltados; `sdd decision check` → `Decisiones válidas`.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-26 · RED por mutante en los 9 ficheros nuevos, ruta de 144 caracteres en `.agents/` que para `cli:test`, caché que ya no salta `cli:test` tras tocar solo `.docs/workflow/`, smoke de `git grep` sin Pester retirados en `skills/` y `capabilities/`, suite del gate verde sobre `87066629` · revisión final Spec y Código sobre `2ab881a9`, re-revisión con 1 Important y 4 Minor, arreglados en un commit sin revisar

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `migration`: `migration-init-parity.test.ts` sigue en verde con `v2.0.0.md` y `v2.3.0.md` (tres requisitos) | ejecución real | verde; un token inventado en `v2.3.0.md` lo pone en rojo |
| `roadmap`: los mensajes los fijan los tests de `cli/test/roadmap/` | suite | `cli:test-min` verde |
| `feature-flow`: la spec mide el margen con `word-budget.test.ts` como ejemplo | no probado | solo cambia la ruta del ejemplo; la conducta del agente no cambia |
| `archive` «Límites»: el tope de `sdd-archive` vive en `word-budget.test.ts` | ejecución real | tope bajado a 100 → `mide 3941 y el tope es 125` |
| Intent: `tests/` solo con los 10 Pester de conducta | ejecución real | `ls tests/*.Tests.ps1` → 10 |
| Intent: un tope, una ruta de 140 o un enlace roto de `.docs/workflow/` siguen parando el commit | ejecución real | mutantes de tope, de ruta sin versionar en `tests/` y en `.agents/`, de enlace roto y de marcador de `usage-guide.md`, todos en rojo |
| Intent: moon no da `cli:test` por bueno desde la caché | ejecución real | `cached` → tocar solo `.docs/workflow/usage-guide.md` → corre (8 s); con `/**/*`, una ruta en `.agents/` → corre y falla |
| Decisión 6: toda skill invocada existe, sin listas | ejecución real | `sdd-end-feature` y `sdd-kit:ghost-agent` en una skill → rojo; `sdd-kit:effort-<…>` no cuenta |
| Decisión 7: referencias a los Pester borrados | ejecución real | `git grep` en `skills/`: 2 líneas antes, ninguna después; en `capabilities/` tras fusionar: ninguna |

### 4.3 Residuales / deuda generada

- Ninguno nuevo.

## 5. Aprendizajes

- Un test que mira todo el repo dentro de una tarea de moon con caché necesita que sus `inputs` cubran todo lo que mira: con una lista parcial, moon da el test por bueno sin correrlo → `tech-stack.md` §Testing («Gate de cierre»), ya escrito por la enmienda.
- En Windows, `where claude` lista antes el shim sin extensión de npm, que no arranca fuera de bash → comentario de `cli/test/kit/manifests.slow.test.ts`, junto al código que lo resuelve.
- Revisión de skills: `.claude/skills/` del repo tiene `skill-creator`, `writing-for-agents` y `writing-skills`, ajenas a este cambio → no aplica.

## 6. Adendas
