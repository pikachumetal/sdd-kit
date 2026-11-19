---
name: sdd-plan-writing
description: Use when sdd-spec-approval hands off an approved full or spike spec, or sdd-propose resumes one without plan.md, to write plan.md and hand it to sdd-implement. Invoked from there; not the entry of a change (that is sdd-propose).
---

# sdd-plan-writing

## Overview

Write implementation plans for an engineer who has not seen this codebase or this spec. Assume they write idiomatic code in the project's language once they know the exact interface and the exact test, and that they will make a reasonable choice wherever the plan leaves one open. What they cannot know is what you decided: which files, which names and signatures, which values from the spec, which tests prove each task. Document those. Give them the whole plan as bite-sized tasks. DRY. YAGNI. TDD. Frequent commits.

Write everything the user reads in the language of their message —announcements, notes between tool calls, after a failed one too—, also while the reference you follow is in English.
**Phase notice** — every time you move to another step or phase, your message opens with a plain line: `Ahora: <qué haces, dicho sin número de paso>. Queda: <lo que falta hasta la próxima parada del usuario>, ~<minutos>`, and `, ~<dólares>` if the step launches subagents or subjects; a counter («van 7 de 15») doesn't replace it.
Forked from `writing-plans` of superpowers (MIT, see `NOTICE`); the text is the source's, changed only where the kit works differently. Only after the spec is approved: open with the phase notice.

**Context:** trace the plan from `plan-template.md` of `sdd-templates`: the template fixes the form of each field (header, «Restricciones globales», Review Focus, the task's blocks, what a step contains); this skill is the process. The worktree comes later, from `sdd-implement`.

**Save the plan to:** `plan.md` in the spec's folder, `.docs/sdd/changes/<task-folder>/`; never `docs/superpowers/` or a loose plan.

## Scope Check

If the spec covers multiple independent subsystems, it should have been broken into sub-project specs during brainstorming. If it wasn't, suggest breaking this into separate plans — one per subsystem. Each plan should produce working, testable software on its own.

## File Structure

Before defining tasks, map out which files will be created or modified and what each one is responsible for. This is where decomposition decisions get locked in.

In the kit, that map is §1.1 of the template.

- Design units with clear boundaries and well-defined interfaces. Each file should have one clear responsibility.
- You reason best about code you can hold in context at once, and your edits are more reliable when files are focused. Prefer smaller, focused files over large ones that do too much.
- Files that change together should live together. Split by responsibility, not by technical layer.
- In existing codebases, follow established patterns. If the codebase uses large files, don't unilaterally restructure - but if a file you're modifying has grown unwieldy, including a split in the plan is reasonable.

This structure informs the task decomposition. Each task should produce self-contained changes that make sense independently.

## Task Right-Sizing

A task is the smallest unit that carries its own test cycle and is worth a
fresh reviewer's gate. When drawing task boundaries: fold setup,
configuration, scaffolding, and documentation steps into the task whose
deliverable needs them; split only where a reviewer could meaningfully
reject one task while approving its neighbor. Each task ends with an
independently testable deliverable.

## Step Granularity

**Each step is one action with a checkable result:**
- "Write the failing test" - step
- "Run it to make sure it fails" - step
- "Implement the minimal code to make the test pass" - step
- "Run the tests and make sure they pass" - step
- "Commit" - step

## Plan Document Header

**Every plan starts with the header of `plan-template.md`; its core is this:**

```markdown
# Plan de implementación — <título de la spec>

**Ejecución**: <native | subagent>, porque <motivo del plan>

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries]

**Spec:** [path to the spec/design doc this plan implements — the plan
argues from the spec, so the spec travels with it; executors read both]

## Restricciones globales

[The spec's project-wide requirements — version floors, dependency limits,
naming and copy rules, platform requirements — one line each, with exact
values copied verbatim from the spec. Every task's requirements implicitly
include this section.]

## Review Focus

[The five input classes or failure modes the spec implies but no task's
tests exercise that are most likely to bite a person using this software
— one line each, naming the input or condition and the behavior a
reasonable person would expect, most likely first. The spec is a vision
document: it says what the software must do, not everything it will
meet, and its silence on an input is not permission for that input to
break the program. Write the list here, once, with the spec in front of
you. Then, for each line, add the test that pins it to the task that
owns the code, in that task's own step style.]

---
```

## Task Structure

Each task carries the blocks of the task in `plan-template.md` —`Tras`, `Modelo`, `Tests RED` (or `Evidencia` in a spike), surfaces, `Verificación`, `Interfaces`, `Ficheros` and the steps—, and travels alone: what `sdd task brief` extracts is its text, so it copies the signatures, tables and texts it needs and doesn't point at another section.

## What a Step Contains

A step is done when the implementer can write exactly one reasonable thing
from it. That is the whole requirement: unambiguous, not complete. Each kind
of step carries what makes it unambiguous and nothing more:

- **A test step:** the test's name and its assertions, as code, with the
  spec's exact values in them.
- **A code step:** the exact signature (name, parameters, return type), the
  file it lives in, and the specific values the spec pins. The implementer
  writes the body. A body appears only for an algorithm the signature and
  tests do not determine, or for exact copy the spec fixes.
- **A verification step:** the command to run and the output that means it
  passed.
- **A reference to another task:** that task's Interfaces block says what
  to use; the plan does not repeat that task's code.

A plan is the set of decisions the implementer cannot make alone. A plan
longer than the code it describes has written the code instead. Lines that
decide nothing ("TBD", "handle edge cases", "add appropriate validation",
"write tests for the above", a type or function no task defines) are the
opposite failure, and the self-review catches both.

## Self-Review

After writing the complete plan, look at the spec with fresh eyes and check the plan against it. This is a checklist you run yourself — not a subagent dispatch.

**1. Spec coverage:** each clause of each THEN —the THEN and every AND— points to the task and the test or measurement row that observes it (§4 of the template), and so does each row of the spec's «regla retirada → dónde vive ahora» table. A task whose test only reads what was written doesn't cover «has asked…». A clause without a task gets one; one nothing can observe says so in the plan's decisions, before execution. A ✓ over a folder or mold holds once you listed it whole, hidden entries included.

**2. Step scan:** Every step must let the implementer write exactly one reasonable thing, and no step may carry more than that: a line that decides nothing is a gap, a function body the signature and tests already determine is a transcript. Fix both.

**3. Type consistency:** Do the types, method signatures, and property names you used in later tasks match what you defined in earlier tasks? A function called `clearLayers()` in Task 3 but `clearFullLayers()` in Task 7 is a bug.

**4. Review Focus:** For each input class or failure mode the spec implies, is there a task whose tests exercise it? The five uncovered ones most likely to bite a person go in the Review Focus section, and each line there gets its test added to the owning task. An empty section means you checked and found none, not that you skipped the check.

**5. Proportion:** Compare the plan's length to the spec's. A plan several times longer than the spec it implements is a transcript of the program, not a plan. If code blocks are most of the document, replace bodies with signatures, test names and assertions, and check that each step is still unambiguous.

If you find issues, fix them inline. No need to re-review — just fix and move on. If you find a spec requirement with no task, add the task.

## Execution Handoff

After self-reviewing the plan, recommend a method for the whole plan and write it in the header's `Ejecución` line as `<native | subagent>, porque <reason from the plan>`. The reason weighs four factors by name, with no numeric threshold: how much the tasks depend on each other's interfaces, how many there are, what an error reaching the branch costs, and whether the plan fits one context. The two methods:

- **Subagent-driven** - A fresh subagent implements each task and a fresh reviewer checks it before the next one starts, then a whole-branch review at the end. Most thorough; costs a fresh context per task and per review.
- **Native** - the session implements every task, then the final review of `sdd-verify` checks the whole branch in axes. Cheapest and fastest; no independent review until the end. Runs well with a mid-tier session model, since the plan carries the design.

**The architecture axis.** Under `Ejecución`, write `Eje Arquitectura: sí — <frontier>` or `no — <reason>`: `sí` when the plan's files add a module, a dependency in a manifest (`package.json`, `*.csproj`, `go.mod`…), a contract between modules or data, judged against `architecture.md`. The final review of `sdd-verify` dispatches that axis only with `sí`, and can only raise it.

If the method is already given —`execution: native` or `subagent` in `.docs/sdd/sdd-kit.local.json` or `sdd-kit.json`, or one the dev-lead named for this feature—, don't ask it in any profile: the line says `<valor>, fijado en <fichero>` with the file that fixes it, even if the template only names `sdd-kit.json` and even if you'd recommend the other. An `auto` in `sdd-kit.local.json` overrides the project's `native` or `subagent`: you recommend, and the line carries the `auto` form (precedence in [control-profiles.md](../sdd-propose/references/control-profiles.md)). A spike is always Native, whatever `execution` says. Then `sdd-implement` runs the plan with that method.

**Where you stop is the profile's.** In `delegate` and `unattended` there is no gate: check that each scenario of the spec has its task, note it in the plan, write the method and go on. In `pair`, like the spec, no code is touched without an approved plan: one question approves the plan and chooses the method at once, with these options: «Apruebo, con <método recomendado> (Recomendada)», «Apruebo, con <el otro método>» and «Cambios»; with `execution` fixed (`native` or `subagent` that no `auto` in `sdd-kit.local.json` overrides), or a method the dev-lead already named for the feature, only «Apruebo» and «Cambios». If the recommended or fixed method is Native, add the Task 1 stop of the announcement in `sdd-propose` as a third option, not the recommended one, under its conditions and with its reason, saying how many tasks remain; if they choose it, put the opening in its commit and stop as that announcement says.

**The closing gate.** §3 copies the closing gate literally from `operations.md` §Testing `Gate de cierre`; without it, the constitution's; with none, `no declarado`, noted in the plan's decisions, never a command you made up. With Native, the `Ejecución` line also carries the template's method-change sentence, literal: after compaction, the session rereads the plan and the ledger, not this skill.

**Commits.** Frequent commits are fine while a milestone is open; when its review is clean they're squashed into one ([commit-milestones.md](../sdd-implement/references/commit-milestones.md)): the history is the opening, one per task and the closing. Before writing the first task's RED tests, put the opening in a commit (in Native, before its `sdd task start`).

**Hand-off.** Once the plan is written, first thing: the phase notice, then invoke `sdd-implement` with `Skill`; implement nothing from here, and validation and closing live in `sdd-archive`. In `delegate` and `unattended` the plan is not a stop: invoke it in the same turn you write the plan, unless the dev-lead chose to stop before Task 1; it reads `mode` and `profile` from the frontmatter of `spec.md`, the plan's `Ejecución` line and the branch.

## Red flags — STOP

- You're writing `plan.md` and the spec has no explicit approval from the user.
- You're about to edit code and the plan isn't approved.
- In `delegate`, you wrote the plan and are about to end the turn without invoking `sdd-implement`.
