# Sondas deterministas — superpowers 6.3.0 → 6.4.1 (2026-09-23)

Frentes que se miden leyendo el texto de superpowers o ejecutando sus scripts, sin sujetos de conducta. Rutas relativas a `~/.claude/plugins/cache/claude-plugins-official/superpowers/<versión>/`.

## Herencia de «Restricciones globales» (Art. V, `tests/plan-template-*`)

- `diff 6.3.0 6.4.1` de `implementer-prompt.md`, `task-reviewer-prompt.md` y `re-review-prompt.md`: ninguna línea nueva sobre restricciones globales.
- `scripts/task-brief`: el único cambio es invocar `sdd-workspace` con `bash` (#2040). La extracción sigue siendo el texto de la task.
- Ejecución: `task-brief` 6.4.1 sobre el `plan.md` del molde de la task 0006 (con `## Restricciones globales` en la línea 27) genera un brief de 19 líneas de la Task 1 con **0** apariciones de «Restricciones globales», «De código» o «Sin comentarios».
- `subagent-driven-development/SKILL.md:271` sigue diciendo que el subagente necesita «the global constraints». Es el mismo hueco que documentó `tests/plan-template-herencia-ab.md`.

**Veredicto**: el override del kit (paso 6, `encargo-revision.md`) sigue siendo necesario y válido con 6.4.1.

## Ruta de `sdd-workspace` en Windows (ticket 0006 §2)

- `scripts/sdd-workspace` 6.4.1 termina con `CDPATH= cd -- "$dir" && pwd`: imprime la ruta de Git Bash.
- Ejecución en Git Bash sobre un repo del scratchpad: `/tmp/claude/D--code--…/scratchpad/probe-ws/.superpowers/sdd/plan`. Sobre este worktree: `/d/code/.worktrees/sdd-kit/0026/.superpowers/sdd/roadmap`.
- `task-brief` hereda la forma: «wrote /tmp/claude/…/.superpowers/sdd/plan/task-1-brief.md».
- `cygpath -w` da la forma Windows: `/tmp/claude/x/.superpowers/sdd/plan` → `C:\Users\pikac\AppData\Local\Temp\claude\x\.superpowers\sdd\plan`.

**Veredicto**: reproducido. La ruta que ve el agente es POSIX, y el `Write` de Claude Code en Windows la resuelve contra la unidad actual (`\tmp\claude\…`), fuera del directorio con permiso: el sujeto del ticket 0006 quedó bloqueado 1 de 2 veces.

## (d) Ejecución «Native» de `executing-plans`

- `grep -rn "executing-plans" skills/` del kit: 0 apariciones. La lista de skills invocadas del README (7) no la incluye.
- En el kit, la ejecución en línea es una task que el plan declara en `Ejecución`; la hace el hilo sin invocar `executing-plans`.
- La única puerta a «Native» es el Execution Handoff de `writing-plans` (frente a).

**Veredicto**: no aplica mientras el handoff no se ofrezca. Lo cubre la fila del frente (a).

## (f) El verde de `test-driven-development` como la suite entera

- `test-driven-development/SKILL.md` 6.4.1 añade (líneas 185-194): «"Other tests" means the project's suite… run the project's test command… even when your task named only one test file».
- Evidencia de conducta ya medida con 6.4.1 instalado: `tests/task-verification-green.md` (task 0006, 2026-09-23), g-e2-1 y g-e2-2. Con la sección `## Verificación` de `encargo-revision.md` («no ejecutes… la suite completa»), 2 de 2 implementadores no lanzaron `backend:test`. Que era 6.4.1 lo prueba el g-e1-1 de esa misma campaña, que cita literal el handoff nuevo («Subagente por task» / «Nativo»).

**Veredicto**: no aplica. El encargo del kit ya gana a la frase de TDD. Queda como posible falso negativo: los streams de la 0006 no se conservaron, y no se puede comprobar que los implementadores cargaran `test-driven-development`.

## (a) Execution Handoff de `writing-plans` y HARD-GATE de `brainstorming`

- `writing-plans/SKILL.md:167-193` 6.4.1: tras guardar el plan, pide revisarlo y **elegir método** («Subagent-driven» o «Native», con recomendación).
- `brainstorming/SKILL.md` 6.4.1, HARD-GATE, vía architectural: «reviews the written implementation plan and selects its execution method».
- Conducta ya medida con 6.4.1: `.docs/sdd/specs/20260923-102746-task-0006-task-verification/green/out/g-e1-1/result.json`, perfil `delegate`, spec aprobada. El sujeto cierra con «¿Qué approach de ejecución prefieres?» y **recomienda «Nativo»** frente al default del kit (Art. IV). g-e1-2 no ofrece método, pero pide aprobar el plan. Los dos tenían en la petición «Escribe el plan.md y para ahí».

**Veredicto**: falla 1 de 2 (ofrece y recomienda el método contrario al Art. IV).
