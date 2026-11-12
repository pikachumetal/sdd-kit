# Writing the plan

Inspired by superpowers `writing-plans` (MIT).

Open with the phase notice. Write `plan.md` for an engineer who hasn't seen this codebase or this spec. Assume they write idiomatic code once they know the exact interface and the exact test, and that they make a reasonable choice wherever the plan leaves one open. What they can't know is what you decided: which files, which names and signatures, which values from the spec, which tests prove each task. That is the plan. Trace it from `plan-template.md` of `sdd-templates`: the template fixes the form of each field (header, «Restricciones globales», Review Focus, the task's blocks, what a step contains); this file is the process. DRY, YAGNI, TDD.

## File structure first

Before the tasks, fill §1.1 with each file you create or modify and what it's responsible for: that's where the decomposition is decided. One clear responsibility per file; focused files over large ones, because you reason best about what fits in context. Files that change together live together: split by responsibility, not by technical layer. In an existing codebase, follow its patterns; split a file you modify only if it has grown unwieldy, and say so in the plan.

## Task right-sizing

A task is the smallest unit that carries its own test cycle and is worth a fresh reviewer's gate. Fold setup, configuration, scaffolding and documentation into the task whose deliverable needs them; split only where a reviewer could reject one task and approve its neighbor. Each task ends with something testable on its own.

## Step granularity

Each step is one action with a checkable result: write the failing test; run it and see it fail; implement the minimum; run it and see it pass; commit. A step is done when the implementer can write exactly one reasonable thing from it: unambiguous, not complete. A line that decides nothing («TBD», «handle edge cases», a type no task defines) is a gap; a body the signature and the tests already determine is a transcript.

## Self-review

With the plan written, look at the spec with fresh eyes, yourself, not with a subagent:

1. **Spec coverage**: each clause of each THEN —the THEN and every AND— points to the task and the test or measurement row that observes it (§4 of the template), and so does each row of the spec's «regla retirada → dónde vive ahora» table. A task whose test only reads what was written doesn't cover «has asked…». A clause without a task gets one; one nothing can observe says so in the plan's decisions, before execution.
2. **Step scan**: no gap, no transcript (above).
3. **Type consistency**: the names, signatures and types a later task uses are the ones an earlier task produced: `clearLayers()` in Task 3 and `clearFullLayers()` in Task 7 is a bug.
4. **Review Focus**: for each input or failure the spec implies, a task's tests exercise it; the most likely to bite a person, untested, go to the Review Focus with the test that pins them in the owning task. «ninguna: comprobado» means you checked.
5. **Proportion**: a plan several times longer than its spec is a transcript of the program; replace bodies with signatures, test names and asserts.

Fix what you find in place; no second review.

## Execution handoff

Recommend a method for the whole plan and write it in the header's `Ejecución` line as `<native | subagent>, porque <reason from the plan>`. The reason weighs four factors by name, with no numeric threshold: how much the tasks depend on each other's interfaces, how many there are, what an error reaching the branch costs, and whether the plan fits one context.

- **Native**: the session implements every task, then the final review of `sdd-verify` checks the whole branch in axes. Cheapest and fastest; no independent review until the end. Runs well on a mid-tier session (Sonnet, effort medium), because the plan carries the design.
- **SDD** (`subagent`): a fresh implementer per task and a fresh reviewer after each, then the whole-branch review. Most thorough; a fresh context per task and per review.

**The architecture axis.** Under `Ejecución`, write `Eje Arquitectura: sí — <frontier>` or `no — <reason>`: `sí` when the plan's files add a module, a dependency in a manifest (`package.json`, `*.csproj`, `go.mod`…), a contract between modules or data, judged against `architecture.md`. The final review of `sdd-verify` dispatches that axis only with `sí`, and can only raise it.

If the method is already given —`execution: native` or `subagent` in `.docs/sdd/sdd-kit.local.json` or `sdd-kit.json`, or one the dev-lead named for this feature—, don't ask it in any profile: the line says `<valor>, fijado en <fichero>` with the file that fixes it, even if the template only names `sdd-kit.json` and even if you'd recommend the other. An `auto` in `sdd-kit.local.json` overrides the project's `native` or `subagent`: you recommend, and the line carries the `auto` form (precedence in [control-profiles.md](control-profiles.md)). A spike is always Native, whatever `execution` says. Then `sdd-implement` runs the plan with that method.

**Where you stop is the profile's.** In `delegate` and `unattended` there is no gate: check that each scenario of the spec has its task, note it in the plan, write the method and go on. In `pair`, like the spec, no code is touched without an approved plan: one question approves the plan and chooses the method at once, with these options: «Apruebo, con <método recomendado> (Recomendada)», «Apruebo, con <el otro método>» and «Cambios»; with `execution` fixed (`native` or `subagent` that no `auto` in `sdd-kit.local.json` overrides), or a method the dev-lead already named for the feature, only «Apruebo» and «Cambios». If the recommended or fixed method is Native and the session runs on the most capable model with more than one task, add, not as the recommended one, «Apruebo, con Native, y paras antes de la Task 1 para que baje la sesión a gama media (quedan <n> tasks)», with the reason of the announcement in `sdd-propose`; if they choose it, put the opening in its commit and end the turn saying the change (`/model`, Sonnet with effort medium) and that they say «sigue» when ready.

## The closing gate

§3 copies the closing gate literally from `operations.md` §Testing `Gate de cierre`; without it, the constitution's; with none, `no declarado`, noted in the plan's decisions, never a command you made up. With Native, the `Ejecución` line also carries the template's method-change sentence, literal: after compaction, the session rereads the plan and the ledger, not this skill.

## Commits

Frequent commits are fine while a milestone is open; when its review is clean they're squashed into one ([commit-milestones.md](../../sdd-implement/references/commit-milestones.md)): the history is the opening, one per task and the closing.
