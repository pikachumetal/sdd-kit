# Control profiles and gates

How much the agent stops is chosen by the user with a profile. Each gate of the table says what it does in each one. Contract of tasks 0005, 0006, 0012, 0021 and 0022: don't duplicate it, link it.

## Profiles

- **`pair`** — stops at every gate of the table.
- **`delegate`** *(default)* — stops at the spec, the deviations and the validation; no gate at the plan.
- **`unattended`** — stops at no point until the release ends; the merge to `main`, the tag and every outward action (a push other than the integration branch's after the closing's merge, which follows `merge.push`; a PR; a publish) are a person's call.

The start (`sdd-propose`) says the current profile and which level it comes from: in feature and spike it announces it, with the phrase to change it for that feature; in patch, lite and config, in the lane question.

## Precedence

1. `profile:` in the frontmatter of `spec.md` — the feature. Omitted, it inherits.
2. `control.profile` in `.docs/sdd/sdd-kit.local.json` — the person. Outside git: see the next section.
3. `Perfil de control: <perfil>` right under the heading of the release's section in the roadmap (in `ROADMAP.md`, between `## Now` and its table).
4. `control.profile` in `sdd-kit.json` — the project. Default `"delegate"`.

The first that exists rules, top to bottom: feature over person, person over release, release over project. When you confirm the current profile, say which level it comes from.

## sdd-kit.local.json

`.docs/sdd/sdd-kit.local.json` keeps how each person works, without changing what stays in git: it's in `.gitignore` and isn't committed. Every skill that resolves the current profile or `execution` reads it —`sdd-propose` (the start and the plan), `sdd-archive` (the merge and the push depend on the profile) and `sdd-config`— even if it doesn't show when listing the folder: always look for it next to `sdd-kit.json`.

It takes no keys other than these three:

- `control.profile`: `pair` | `delegate` | `unattended`, with the precedence above.
- `execution`: `auto` | `native` | `subagent`. Precedence: the method the dev-lead names for the feature → `sdd-kit.local.json` → `sdd-kit.json`, with no release level. An `execution: auto` in local counts too: it overrides the project's `native` or `subagent`, and the handoff recommends the method.
- `validation.startEnvironment`: boolean, default `false`. With `true`, the person wants the environment started before the validation's test script.

Everything else —`merge`, `ids`, `release`, the brakes of `control`, any test level or floor, an unknown key or a person's name— belongs to the project or doesn't exist: it isn't applied, the next level of the precedence rules, and you warn once per key, with this literal line:

```text
Aviso: se ignora <clave> de sdd-kit.local.json: solo admite control.profile, execution y validation.startEnvironment; lo demás es del proyecto y va en sdd-kit.json.
```

An admitted key with a value outside its type is ignored the same way, with:

```text
Aviso: se ignora <clave> de sdd-kit.local.json: <valor> no es un valor admitido.
```

The name of whoever works isn't kept in any kit file: if needed, it comes from `git config user.name`. The keys are written by `sdd-config`.

**Profile change mid-feature**: a delegated approval («ve tú solo hasta el smoke», said in `pair`) changes the feature's profile. Write `profile:` in the frontmatter and a row in «Aprobaciones»: the date and, in «Estado», `perfil → <perfil>: «<frase literal>»`. Without that literal phrase the profile doesn't change: it's the rule of the self-granted shortcut ([sdd-kit.json keys](#sdd-kitjson-keys)).

## Gates by profile

| Point | `pair` | `delegate` | `unattended` |
| --- | --- | --- | --- |
| Start (lane, mode, profile, statement from the branch) | asks in patch, lite and config, and if splitting applies; announces in feature and spike | same as `pair` | decides and records: lite goes as full |
| Spec review | the rubric of `review-spec.md` decides how many reviewers and dispatches them without asking; one question only if the user's instructions ask to confirm before parallelizing and the spec isn't delegated | same as `pair` | decides and records, never fewer reviewers than the rubric gives |
| Spec | stops with fixed options in prose, except the spec delegated at the start: the agent approves it and records the phrase | same as `pair` | the agent approves it with the decisions recorded |
| Plan | stops: one question approves the plan and chooses the method, with the handoff's recommendation first; with `execution` fixed, it only approves | no gate: checks scenario → task, writes the method the handoff recommends (or the one fixed in `execution`) and goes on | same as `delegate` |
| After each task | stops | goes on | goes on |
| Deviation (change to the approved spec) | stops · `## Enmiendas` | stops · `## Enmiendas` | the most conservative option, amendment not approved; if it blocks, `⏸️ aparcada` |
| Scope brake (see «Scope brakes») | stops | stops | conservative option, amendment not approved |
| Leaving the plan | ruling + «✋ Me salí del plan en…» | ruling + «✋ Me salí del plan en…» | ruling + report |
| Validation (closing of feature and patch) | stops | stops | deferred to the release's smoke (🧪) · with `validation.mode: field` or [`Validación: agente`](#who-validates), in all three: doesn't stop |
| Merge to develop (closing of feature and patch) | presents the policy and waits | applies the full `merge` block; without it, asks | same as `delegate` |
| Push of the integration branch after the closing's merge | presents the push with the merge and waits | with `merge.push: true`, does it; without it, doesn't | same as `delegate` |
| Merge to main, tag, any other push, PR, publish | person | person | person |

More:
- The route «Merge y tag sin segunda ronda cuando la decisión ya está tomada» of `release-flow` isn't repealed: there a person already took the decision.
- In `unattended`, an interview question with no answer in the project's documents parks the feature, and when the release ends there is a single report.

## Deviation

<!-- kit: incluye deviation -->

A ruling that falls in a scope brake (see «Scope brakes») is treated as a deviation. Its 🦆 comes from `sdd-rubber-duck` in short mode.

The **update action**, besides the above:
- With the approval: commit the spec. The new task for a closed task, not «Task 1 — enmienda», carries its `Tras`; it reopens none and rewrites none of their commits, the history keeps one commit per task, it goes through `sdd task start` and `sdd task done` like any other, and its commit enters the review that applies. If it only changes the task in progress, the work stays in it, with the amendment's note. Without this form, 1 of 2 subjects put the change to a closed task into the task in progress, and neither stopped with 🦆 or ✋.
- If the amendment adds files, before asking for approval the entry names the open features of the roadmap (⏳, 🔄, ⏸️, 🧪) that declare any of those files in the `**Toca:**` of their row's brief (`ROADMAP.md`) or says «solape no comprobable: el roadmap no declara ficheros» if the roadmap doesn't declare it. With the approval, the `**Toca:**` or the feature's row adds those files.

**Ruling** (doesn't change the spec):
- The agent doesn't stop: it decides, records the ruling (what it decided, why, what it costs if wrong) and goes on.
- Every commit of the main thread —including an improvised fix to dodge a vetoed file— enters the review scope of the task in progress; if none is open and the final review hasn't gone out yet, the final branch review's; and if it went out, even if it hasn't come back, the single re-review of the range `<último revisado>..HEAD` (see the fix pass bullet), before the validation or, if that was already presented, before the closing; if that re-review already went out, it doesn't open another: it goes to ✋ as `sin revisar: <sha> — <qué cambia>` («Closing the review» of `sdd-verify`). A fix without its own commit, or mixed unmarked among the other decisions, doesn't go through review.
- What a thread commit changes decides its review: a commit under 20 lines (added plus deleted, `git diff --numstat`; in a merge, those of `git show --remerge-diff`) in which everything that changes is documentation or comments —files under `.docs/`, `*.md` of any path and code comment lines— dispatches no reviewer: the thread reads the diff and notes it in «✋ Me salí del plan en…» as `revisado en el hilo: <sha> · <ficheros> · <n> líneas`. A range with only such commits doesn't open the re-review either. What changes decides, not the folder: a package's README, a campaign's notes next to its tests or a function's comment are read in the thread. Two things aren't documentation even if they look like it, and dispatch: an `.md` an agent or a program reads as instructions or as a template (a skill, an agent, a template), and a comment a tool interprets (`eslint-disable`, `@ts-ignore`, `# noqa`). Any other line in the commit —code, configuration, a spell-checker dictionary— dispatches too. Without this rule, 2 of 2 subjects dispatched an Opus reviewer for a merge that only resolved a roadmap row; with the rule tied to the path, 4 of 4 dispatched it for 15 lines of a guide, a comment and a test table (`tests/re-review-exception-red.md`, a1 and a2).
- The fix pass of the final review itself enters that re-review, with both methods, together with the thread's later commits. The thread notes it in `tasks.md` (without it, in the validation's presentation) as `Pasada de fix: <sha corto>, <n> hallazgos RED→GREEN`, and «The hash in the artifacts» of [commit-milestones.md](../../sdd-implement/references/commit-milestones.md) says how a squash rewrites it.
<!-- kit: incluye last-reviewed-sha -->
With a `Revisión final:` line in the 2.x format, without axes, likewise.
- The validation's presentation —and with `validation.mode: field`, the message the closing is invoked with— follows [validation-template.md](../../sdd-templates/templates/validation-template.md): it opens with the 🦆 and «✋ Me salí del plan en…».

## Scope brakes

Four situations that don't change the spec's letter and are still treated as a deviation: in `pair` and `delegate` their row of the table stops like «Deviation»'s; in `unattended` it goes on with the conservative option and doesn't park, because none of the four blocks the feature. No new roadmap state. If the answer changes the spec's text, it's applied with the update action of «Deviation»; if not, it only goes into `## Enmiendas`.

### 3rd discovered fix

Trigger: the feature's 3rd discovered fix, and every third after (6th, 9th…). Count the rows of «Fixes adicionales» in `tasks.md` or, without `tasks.md`, the fix rulings recorded — count everything recorded, whether it's fixed or deferred. It counts work discovered outside the plan (a defect of earlier code, scope nobody asked for); a review finding on the code the task itself just wrote doesn't count: it's its fix loop.

- `pair` and `delegate`: before fixing or deferring it, the agent stops and asks with three options: go on in this feature, defer to another feature (row in the roadmap) or split the feature. The answer goes into `## Enmiendas`.
- `unattended`: defers it to a new roadmap row, records it as an unapproved amendment and goes on.

### Observable output

Trigger: an execution decision the spec doesn't fix and that changes the observable output — what whoever uses the product sees or receives: an API's or a CLI's response, a UI's text or flow, the generated files, the public names (commands, fields, routes). An internal name, the structure, the implementation order or undoing a regression of the task itself (it returns the output to what it was) stay rulings; example: choosing between two internal ways of computing an invoice surcharge doesn't trigger the brake, changing the field the invoice shows the client does.

- `pair` and `delegate`: the agent stops and asks with its options before dispatching. It doesn't record it as a ruling; the answer goes into `## Enmiendas`.
- `unattended`: chooses the option that leaves the output as the spec describes it or, if the spec is silent, as it is today. Records it as an unapproved amendment.

### Row changed in the base

Trigger: before dispatching each task of the plan, `git diff $(git merge-base HEAD <integration>) <integration> -- ROADMAP.md`, looking for the row of the feature in progress. Always compared: without a remote the base moves anyway, because another worktree commits to the local branch; with a remote, `git fetch` first and `origin/<integration>` is compared too. If it changed, it's a possible deviation.

- `pair` and `delegate`: present the change and stop.
- `unattended`: goes on with the approved spec and records the new row as an unapproved amendment.

### Task's file changed in the base

Trigger: the cross of step 1 of «Before each task» of `sdd-implement`, before dispatching each task and writing its RED tests: an undeclared overlap, or lines the plan doesn't let you tell, is a possible deviation.

- `pair` and `delegate`: name the files, the base commits that touch them (`git log --oneline $(git merge-base HEAD <integration>)..<integration> -- <file>`) and the ranges («la base cambia las líneas A–B; la task toca C») and stop.
- `unattended`: goes on with the approved spec and records it as an unapproved amendment.

## Who validates

The line `Validación: dev-lead | agente` of the spec or of `patch.md`; without it, `dev-lead`. With `agente`, no script and no wait: `Validación por el agente: <fecha> · <evidencia>` and ✅. With `field`, `Validación en campo:` rules. `agente` doesn't hold if only the agent approved it (a delegated spec without a phrase that names it, `unattended`, a patch without the dev-lead's phrase). If something visible to the user appears while implementing, it goes back to `dev-lead` as a deviation.

## Deferred validation

Deferring counts only with the three conditions at once:
1. The user is present and has the work in front of them (not away without an answer).
2. They say, in their own words, that they'll test later.
3. They name a trigger with an owner: a feature, a release or a use with an owner.

With the three, the agent doesn't refuse to close nor invent a new state — the form is this, and only this:
- Walkthrough: `Validación diferida: <fecha> · «<frase literal>» · disparador: <feature, release o uso con dueño>`
- Roadmap: `🧪 validación diferida a <disparador>` (not ✅)
- Patch: the same line in `patch.md` §4, under the table, and the row of the roadmap's patch table starts with `🧪 validación diferida a <disparador> — `

If the trigger is missing or vague («diferida», «se prueba en uso») and the first two hold, don't ask again: pin the nearest use yourself, with whoever defers as owner, and write it like this: `disparador: <uso más próximo>, a cargo de <quien difiere>` (e.g. «la primera exportación del informe mensual, a cargo del dev-lead»). Say it in the closing message so they can correct it. With that the third condition holds.

The validation message offers to defer with a concrete trigger the agent chooses, with an owner: «Diferir: lo pruebo en <uso más próximo>, a cargo de <quien valida>». Accepting it is the literal phrase (second condition) and the trigger (third): you don't ask again. Without it, 0 of 2 subjects proposed it.

Without the first two there is no deferral: the feature stays EN ESPERA with the smoke documented.

In `unattended` the trigger is always the release's smoke: the three conditions aren't needed, the profile already fixes it.

When the user validates what was deferred, the agent adds a dated addendum to the walkthrough (in a patch, to `patch.md` §4) with only what they say they tested, and moves the row to ✅ (in a patch, removes the 🧪 prefix).

## Field validation

With `"validation": {"mode": "field"}` in `.docs/sdd/sdd-kit.json`, the project's human validation is real use: failures arrive as `sdd-feedback` tickets and open a new row. It's a team decision, written in the project's file; in `sdd-kit.local.json` it's ignored with a warning, and a value other than `manual` or `field` counts as `manual`, also with a warning: «`validation.mode: <valor>` no admitido en `sdd-kit.json`: rige `manual`». Without the key, or with `manual`, the usual one.

In the field, in all three profiles, the closing's validation (the validation of `sdd-archive`) doesn't stop: you don't ask what the user tested, don't offer to defer, don't write a test script and go on with the closing.
<!-- kit: incluye field-validation-defined -->
What doesn't change is the agent's verification: the final review and its closing (`sdd-verify`), a smoke with one row per THEN, visual verification and suite, same as in `manual`. The `Validación en campo:` line carries the axes and doesn't say «limpia» while a `sin revisar` or a «no verificado» remains: it says how many remain. A decision the final review leaves to the user is still asked on its own, in its turn.

Form, and only this:
- Walkthrough (in a patch, `patch.md` §4, under the table): `Validación en campo: <fecha> · <verificación del agente>`, with the evidence you ran (e.g. `Validación en campo: 2026-10-06 · suite 412/412 · smoke 5/5 THEN con ejecución real · revisión final Spec y Código sobre a1b2c3d, re-revisión limpia`). A THEN or a visual verification `no probado` go as they are, with their reason: the line doesn't count them as verified.
- Roadmap: ✅, without 🧪. The patch's row in «Patches» carries no 🧪 prefix nor a row in the release's table.

If the user, even so, says what they tested, you record `Validado` with their phrase: when there is human validation, it rules.

## unattended

- The agent approves the spec, with the decisions recorded in «Decisiones que he tomado yo».
- If an interview question has no answer in the project's documents, the feature stays `⏸️ aparcada: <pregunta>` in the roadmap and the agent goes on with the release's next feature.
- When the release ends, a single report: closed features, decisions, unapproved amendments and parked features.
- The cap of agents in parallel isn't this capability's: [sdd-parallel-agents](../../sdd-parallel-agents/SKILL.md) applies it, reading `control.maxParallelAgents`. Nor are the retries by failure type: task 0022 defines them. The silence watch is: [Silence watch](#silence-watch).

## Silence watch

A background subagent can hang with no error: the subagent tool has no timeout and the harness only warns when it ends. The watch is `sdd watch subagent`, and it reads the thresholds itself from `control.silence` in `sdd-kit.json`: don't write them in the command.

**When it's launched.** In the same turn as each dispatch —implementer, task reviewer, fix wave, re-review, final reviewer, spec reviewer—, with the shell tool in the background (`run_in_background`):

```text
sdd watch subagent --description "<la description del despacho, literal>"
```

A slow verification is launched in the background by its own watch, `sdd watch command -- <command…>`: it saves the output in the file its `salida:` line names and ends with the command. `sdd watch command --path <output file>` is for a command already running. Each dispatch carries a different `description`: the watch finds the transcript by it.

**What to do with what it returns.** The watch ends with a single notification; its first line says which:

| First line | What you do |
| --- | --- |
| `TERMINADO:` | Nothing: the subagent's result arrives on its own; a command's, in the file of its `salida:` line. |
| `SIN TRANSCRIPT:` | Tell the user, in your next message, that the silence watch doesn't work in this session. Don't replace it with something else. |
| `SILENCIO:` | It's a hang. Go on below. |

When you receive a subagent's result, or the notice that a command watched with `--path` ended, stop its watch if it's still running: that watch doesn't know when its command ends, and would give `SILENCIO:` on one already finished.

**On a `SILENCIO:`**, in this order, without waiting for the user to ask:

1. Stop the subagent (`TaskStop`) and its watch.
2. If the warning says `petición de permiso pendiente`, don't relaunch it: in your next message tell the user which tool was waiting for permission. In `unattended`, the feature is also `⏸️ aparcada: permiso pendiente de <herramienta>` at once.
3. If not, and it's the first hang of that brief, relaunch it once with the same brief and a new watch. If it was an implementer and it left uncommitted changes, the relaunched brief lists them (`git status --short`) and tells it to start from them or discard them with a reason; don't delete them yourself.
4. If it's the second hang of the same brief: in `pair` and `delegate`, stop and ask the user how to go on, without relaunching it; in `unattended`, the feature is `⏸️ aparcada: cuelgue repetido del <tipo>` and you go on with the release's next one.
5. In your next message, tell the user what hung, with the warning's lines, and what you did.
6. Record the ruling in `tasks.md` (in Native, in the ledger too): `Cuelgue: <tipo de subagente o comando>, <herramienta> sin respuesta, <minutos> min, <relanzado | no relanzado: permiso | parado: segundo cuelgue>`.

A hung slow verification follows the same steps, with its process instead of the subagent: the one its watch launched with `--` is already stopped.

| Rationalization | Reality |
| --- | --- |
| "Between 15 and 30 minutes is normal for a review" | Without looking, it's a guess: that's how 26 min were lost with a reviewer that had been stalled for 25. What its transcript doesn't write isn't working. |
| "I'll set up a `sleep` loop with a reasonable threshold" | The threshold is the project's, not yours: an agent chose 300 s when the project had fixed another. Launch the script, which reads it. |
| "I'll relaunch it again, third time lucky" | A second hang of the same brief is repeating without progress: stop and ask, or park in `unattended`. |

## Roadmap states

Closed set:

| State | Means |
| --- | --- |
| `⏳` | pending |
| `🔄 en curso` | feature open |
| `⏸️ aparcada: <motivo>` | stopped, with the reason written |
| `🧪 validación diferida a <disparador>` | verified by the agent, validation pending with a known trigger |
| `✅` | closed and validated |

«EN ESPERA» isn't a roadmap state: it's the feature in progress waiting for the user's answer.

## sdd-kit.json keys

| Key | Type | Default |
| --- | --- | --- |
| `control.profile` | `pair` \| `delegate` \| `unattended` | `"delegate"` |
| `control.maxParallelAgents` | integer | `3` |
| `control.silence.betweenStepsMinutes` | integer | `8` |
| `control.silence.longCommandMinutes` | integer | `20` |
| `merge.into` | string (target branch) | — |
| `merge.noFf` | boolean | — |
| `merge.removeWorktree` | boolean | — |
| `merge.push` | boolean | `false` |
| `execution` | `auto` \| `native` \| `subagent` | `"auto"` |
| `validation.startEnvironment` | boolean (only in `sdd-kit.local.json`) | `false` |
| `validation.mode` | `manual` \| `field` (only in `sdd-kit.json`) | `"manual"` |
| `review.minors` | `fix` \| `defer` (only in `sdd-kit.json`) | `"defer"` |
| `pricing` | object: `source`, `updated`, `usdPerMillionTokens` (only in `sdd-kit.json`) | — (without it, the closing gives «sin precio») |

`execution` chooses the plans' execution method. With `auto`, the handoff of `plan-writing.md` of `sdd-propose` recommends one per plan and the agent writes it in the header as `Ejecución: <native | subagent>, porque <motivo del plan>`; with `native` or `subagent`, the method is given and isn't asked in any profile: the header says `Ejecución: <valor>, fijado en <fichero>` —`sdd-kit.json` or `sdd-kit.local.json`, the one that fixes it—, even if the handoff recommends the other. It has no release level (precedence in «sdd-kit.local.json»): the method stays written in each feature's plan, and a method the dev-lead names for a concrete feature counts as given.

`merge` has no default: if the block or any of its three fields (`into`, `noFf`, `removeWorktree`) is missing, the closing's branch step (the merge of `sdd-archive`) asks as today — a policy nobody declared whole isn't applied. `merge.push` is optional and doesn't count for the full block: absent, the closing doesn't push.

`control.maxParallelAgents` is only declared here: [sdd-parallel-agents](../../sdd-parallel-agents/SKILL.md) applies its behavior. `control.silence.*` are read by the watch: [Silence watch](#silence-watch).

**The rule of the self-granted shortcut**: the agent never writes, without the user's literal phrase, a `profile`, a `control.*`, a `merge` or a `validation.mode` that removes a stop. When the user asks for it, the phrase and the date go in a row of «Aprobaciones» (or in the commit, if the change is in `sdd-kit.json`). In `sdd-kit.local.json`, which isn't committed, the user's answer to `sdd-config` is enough.

## Questions for the keys

The questions that fix these keys, with their recommendation and the file each answer goes to, live only in `sdd-config` ([catalog](../../sdd-config/SKILL.md#catalog)). The inits and the migrations invoke it instead of carrying their list.
