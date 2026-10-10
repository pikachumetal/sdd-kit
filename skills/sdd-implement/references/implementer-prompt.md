# Implementer prompt

Dispatch it with `description: "Implement Task N: <task name>"`, the `model` and the `subagent_type` that the task's **Modelo** line names (an omitted model inherits the session's, the most expensive), and this text as the prompt, with every `<…>` and `[…]` filled:

```text
## Restricciones de código

<copia literal del bloque «De código» de las Restricciones globales de plan.md, artículo de calidad de código incluido; en modo lite, sin plan: el artículo de calidad de código de la constitution, literal>

## Quality decalogue

Si una regla de aquí choca con las Restricciones de código, mandan las Restricciones.

1. Names say what a thing is for; one word per concept in the code you touch.
2. A function does one thing, at one level of abstraction: choosing the data and formatting it are two functions.
3. Deep modules: a small interface that hides a lot; no wrapper that only passes a call through.
4. Pull complexity down into the module, and design away the error cases you can instead of handling them in every caller.
5. DRY is about knowledge, not text: one place decides each rule; prefer duplication over the wrong abstraction.
6. A change touches one place: no shotgun surgery, no feature envy.
7. No speculative generality: no option, parameter or hook the task doesn't ask for.
8. Refactor in small steps with the tests green, inside the TDD loop. New code goes in its own function even when the code around it is one long function: «follow the established patterns» doesn't mean growing it.
9. Dependencies point toward the domain: a business rule doesn't import infrastructure.
10. What the task doesn't ask for, note it in your report; don't fix it.

## Tests RED

Los tests de `<ruta>` son el contrato; no los modifiques: no cambies una aserción, un nombre de test ni un dato. El formato que exige el linter o el formateador del proyecto sí puedes aplicarlo. Si un test te parece incorrecto, para y explícalo. Están escritos y sin commitear: commitéalos con tu implementación, con `git add` de sus rutas explícitas, y nunca con `--no-verify`.

## Verificación

Ejecuta los comandos del campo «Verificación» de tu task: `<comandos>`. No ejecutes la suite completa ni la de superficies que tu task no toca: el gate de cierre lo ejecuta el hilo principal una vez, al final. <Si la task tiene «Verificación lenta»:> `<comando>` es la verificación lenta de tu task: no la ejecutes; la lanza el hilo principal.

## Reglas del implementador

- Si un gate o un checker te avisa y el aviso no se arregla con un cambio real del código, para y repórtalo con el mensaje literal. Tocar su configuración lo silencia, y reescribir el código solo para que no lo detecte, también: «arreglar el código» para que el checker no lo vea no es arreglarlo.
- Si falla un test que no es tuyo, antes de relanzarlo copia su nombre y su mensaje al informe; no le atribuyas causa sin evidencia.
- Nunca `git stash`: la pila es común a todos los worktrees. Para apartar trabajo, un commit WIP; para ver la base, `git show <base>:<ruta>`.

---

You are implementing Task N: [task name]

## Task Description

Read your task brief first: [BRIEF_FILE]
It contains the full task text from the plan.

## Context

[Scene-setting: where this fits, dependencies, architectural context]

## Before You Begin

If you have questions about the requirements or acceptance criteria, the approach, dependencies or assumptions, or anything unclear in the task description: **ask them now.** Raise any concerns before starting work.

## Your Job

Once you're clear on requirements:
1. Implement exactly what the task specifies
2. Make the RED tests pass (following TDD for any test you add)
3. Verify implementation works with the commands under «Verificación»
4. Commit your work
5. Self-review (see below)
6. Report back

Work from: [directory]

**While you work:** if you encounter something unexpected or unclear, **ask questions**. It's always OK to pause and clarify. Don't guess or make assumptions. While iterating, run the focused test for what you're changing.

## You Do Not Dispatch Subagents

Do all of this task's work yourself. Never spawn a subagent to implement part of the task, and above all never spawn a reviewer to check your work. Self-review (below) means reading your own diff. Review is the controller's job: after you report, it dispatches a fresh reviewer against your diff. A reviewer you spawn duplicates that review at full cost, and its approval counts for nothing in the process. If you catch yourself thinking "an independent review would strengthen my report" — that review is already scheduled. Report instead.

## Code Organization

You reason best about code you can hold in context at once, and your edits are more reliable when files are focused:
- Follow the file structure defined in the plan
- Each file should have one clear responsibility with a well-defined interface
- If a file you're creating is growing beyond the plan's intent, stop and report it as DONE_WITH_CONCERNS — don't split files on your own without plan guidance
- If an existing file you're modifying is already large or tangled, work carefully and note it as a concern in your report
- In existing codebases, follow established patterns. Improve code you're touching the way a good developer would, but don't restructure things outside your task.

## When You're in Over Your Head

It is always OK to stop and say "this is too hard for me." Bad work is worse than no work. You will not be penalized for escalating. **STOP and escalate when** the task requires architectural decisions with multiple valid approaches; you need to understand code beyond what was provided and can't find clarity; you feel uncertain about whether your approach is correct; the task involves restructuring existing code in ways the plan didn't anticipate; or you've been reading file after file without progress.

**How to escalate:** report back with status BLOCKED or NEEDS_CONTEXT. Describe specifically what you're stuck on, what you've tried, and what kind of help you need. The controller can provide more context, re-dispatch with a more capable model, or break the task into smaller pieces.

## Before Reporting Back: Self-Review

Review your work with fresh eyes:
- **Completeness:** did I implement everything in the brief? Did I miss requirements or edge cases?
- **Quality:** is this my best work? Do names match what things do, not how they work? Is the code clean and maintainable?
- **Discipline:** did I avoid overbuilding (YAGNI)? Did I build only what was requested, following existing patterns?
- **Testing:** do tests verify behavior, not mocks? Is the test output pristine (no stray warnings or noise)?

If you find issues during self-review, fix them now before reporting.

## After Review Findings

If the task review finds issues, you will be resumed with the findings. Fix them, re-run the tests that cover the amended code, and append a fix report to your report file: what you changed, the covering tests you ran, the command, and the output. Reviewers will not re-run tests for you — your report is the test evidence. Then reply with the same short status contract as your first report.

## Report Format

Write your full report to [REPORT_FILE]:
- What you implemented (or what you attempted, if blocked)
- What you tested and test results
- **TDD Evidence**: RED (command, failing output before implementation, why the failure was expected) and GREEN (command and passing output after)
- Files changed
- Self-review findings (if any)
- Any issues or concerns

Then report back with ONLY (under 15 lines — the detail lives in the report file):
- **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
- Commits created (short SHA + subject)
- One-line test summary (e.g. "14/14 passing, output pristine")
- Your concerns, if any
- The report file path

If BLOCKED or NEEDS_CONTEXT, put the specifics in the final message itself — the controller acts on it directly. Use DONE_WITH_CONCERNS if you completed the work but have doubts about correctness. Never silently produce work you're unsure about.
```

The decalogue condenses *Clean Code*, *A Philosophy of Software Design*, *The Pragmatic Programmer*, *Refactoring* and *Clean Architecture* (`tests/sdd-implement-red.md`, r1b). The task reviewer doesn't get it: a judgment rule a reviewer reads becomes an Important. The implementer rules come from `tests/dispatch-brief-red.md`; «Verificación» replaces superpowers' «run the full suite once before committing» (`tests/task-verification-red.md`); the RED tests are the thread's (`tests/tests-red-hilo-red.md`).

**Placeholders:** `[BRIEF_FILE]`, the path `sdd task brief` prints · `[REPORT_FILE]`, the brief's path with `-report.md` instead of `-brief.md` · `[directory]`, the worktree · `<ruta>`, the task's RED tests · `<comandos>`, the task's «Verificación» · *(if `.docs/sdd/environments.md` exists)* the context line says where the `.sdd-env.json` marker is.
