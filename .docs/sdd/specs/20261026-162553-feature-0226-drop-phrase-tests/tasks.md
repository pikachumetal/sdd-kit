---
id: 20261026-162553-feature-0226-drop-phrase-tests
title: Tasks — Frases fuera y anatomía a Vitest
spec: ./spec.md
plan: ./plan.md
created: 2026-10-26
---

# Tasks — Frases fuera y anatomía a Vitest (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0226-drop-phrase-tests`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Lo útil a Vitest y los 57 Pester fuera | done | `99054c44` | RED por mutante en cada fichero nuevo |
| 2 | Las rutas nuevas en skills y documentos, y la ADR 0019 | done | `2ab881a9` | smoke de `git grep`: dos líneas antes, ninguna después |
| 3 | Enmienda 2026-10-26: `testInputs` a `/**/*` | done | (este commit) | la Task 1 queda afectada por enmienda 2026-10-26 → Task 3 |

## Verificación por task

- [x] Task 1 — `vitest run test/kit --exclude "**/*.slow.test.ts"` → 7 ficheros, 215 pasados y 12 saltados; `manifests.slow.test.ts` → 3 pasados; `moon run kit:test-fast` → 44 pasados, 0 fallos
- [x] Task 2 — smoke sin salida; `sdd decision check` → `Decisiones válidas`; `sdd roadmap check` → `Roadmap válido`
- [x] Task 3 — `moon run cli:test` con una ruta de 144 caracteres sin versionar en `.agents/` → corre y falla `path-length`; sin ella, verde. La pasada `cached` anterior en el log es de un intento cuyo script de edición falló sin aplicar nada

## Fixes adicionales

Ninguno.

## Revisión

- Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura no (plan), sobre 2ab881a9
- Pasada de fix: 60917106, 2 hallazgos RED→GREEN (privacidad sin mayúsculas; enmienda de testInputs con su ruta de 144 en .agents/) y el resto de Important y Minor con la suite de test/kit
- Re-revisión: 2ab881a9..87066629, sdd-kit:effort-high + opus, quedan hallazgos (1 Important nuevo y 4 Minor)
- sin revisar: juntada en el cierre — manifests elige el claude con extensión que lista where (el Important nuevo, RED→GREEN), y los 4 Minor

## Rulings

- Task 1: Ruling: el patrón de skill entre comillas invertidas es `sdd-*`, `using-sdd` y `add-to-changelog`, no `(sdd|using)-*` del plan — `using-git-worktrees` sale entre comillas en la procedencia de sdd-worktrees y no es una invocación — si es incorrecto: un `using-*` del kit inventado no se detectaría (hoy solo existe using-sdd)
- Task 1: Ruling: path-length no pasa `-c core.quotepath=off` — gitSync ya pone core.quotePath=false — si es incorrecto: ninguno
- Task 1: Ruling: la Verificación espera `Test Files  7 passed (7)`, no 8 — el plan contó kit-files.ts, que no es un test — si es incorrecto: ninguno
- Task 1: Ruling: el RED de cada fichero es un mutante sobre el árbol (no hay copia RED que comparar: el test se escribe en este hilo y es lo que cambia) — salidas en red-task1.log, al walkthrough — si es incorrecto: un test se ajustó al código sin verse fallar; lo cubre el mutante de cada fichero
- Task 2: Ruling: la fila B21 de la deuda también nombraba tests/WordBudget.Tests.ps1 ($script:Slack) y se reescribe con la ruta nueva, aunque la spec solo listaba 0224 y 0227 — es una fila pendiente que apunta al fichero que se borra — si es incorrecto: una línea del roadmap
- Final: Ruling: argument-hint y user-invocable no se portan (Spec Minor 1) — no impiden cargar la skill: solo cambian el menú de comandos — si es incorrecto: una skill de arranque sin pista de argumentos en el menú
- Final: Ruling: la regla «Límites» de archive sigue diciendo dónde aparecen los nombres retirados (Spec Minor 7) — es la regla, no su test; la retirada se comprobó una vez — si es incorrecto: un nombre retirado sin comillas reaparece sin aviso
- Final: Ruling: tech-stack.md:58 y :247 siguen citando Pester borrados (Código, declinado) — son aprendizajes fechados, fuera del Scope — si es incorrecto: dos rutas históricas muertas
- Final: Ruling: la decisión 11 de la spec lista 0001 y 0002 entre las ADR de frase; se corrige en la ADR 0019, no en la spec — la spec es el registro de lo aprobado — si es incorrecto: una lista inexacta en la spec
- Final: Ruling: la rama .cmd de manifests no se ha ejecutado (aquí claude es .exe) — sin shim en esta máquina — si es incorrecto: en una máquina con npm el test fallaría en vez de saltarse
- Final: Ruling: architecture.md:74-76 nombra word-budget.test.ts sin la carpeta y el árbol no menciona cli/test/kit/ (fuera de alcance de la re-revisión) — la tabla dice qué fichero acota cada documento y cabe en su tope; la carpeta la dicen CLAUDE.md y tech-stack.md — si es incorrecto: hay que buscar una vez dónde vive
- Final: Ruling: la fila 0045 está en Próximo, no en Backlog: lleva el prefijo de saldada y su estado pasa a ✅ — su trabajo (inventario y poda de los Pester) lo hace esta feature — si es incorrecto: una fila cerrada que el dev-lead quería abierta
