# Validation by mode

Step 1 of `sdd-archive`.

## With `validation.mode: field`

You run your smoke —one row per THEN— and the suite only if «In the validation» of [closing-suite.md](closing-suite.md#in-the-validation) leaves it here (another open branch or a base ahead leaves it for step 6), and record `Validación en campo: <fecha> · <verificación del agente>` with the evidence you ran and what is `no probado` as is. Then send the message of [validation-template.md](../../sdd-templates/templates/validation-template.md) without its script; its first two lines, literal: `🦆 <what changes, with an example with data>` and `**✋ Me salí del plan en…**`, with the rulings or «nada». If the user does say what they tried, the line is `Validado` with their words.
«El kit no define ese valor, no voy a suponer qué significa» doesn't hold: this section defines it.

## With `Validación: agente`

Smoke, suite, that same message without its script, then `Validación por el agente: <fecha> · <evidencia>`.

## With `manual`

The script is composed and rehearsed as [dev-validation.md](dev-validation.md) says. `Patch only:` what there is, is the smoke of `patch.md` §4; in a visual adjustment, each screenshot's path, which is what the user looks at to validate, and the detector's output or its warning, with a line proposing `## Frontend` if `operations.md` lacks it.

A deferred validation has its three conditions at once: present with the work in front of them, their words that they'll try it later, a trigger with an owner; in `unattended` the trigger is always the release smoke. A missing or vague trigger: don't ask again; make the nearest use concrete, with whoever defers as owner, and say it in the final message ([deferred validation](../../sdd-propose/references/control-profiles.md)). Accepting the message's `Diferir:` line is the phrase and the trigger: don't ask again.

## The smoke, in every mode

One row per THEN (spike: per objective), its evidence `suite`, `ejecución real` or `no probado`. A THEN seen in an interface (screen, HTTP response, CLI output, a file the change produces) counts as verified only with `ejecución real`, and a failure THEN (an error, a rejection) is provoked with the input that fails: «the test covers it» is `suite` (`tests/closing-verification-red.md`). A THEN with `Se valida en:`: prepare that environment (the worktree with the base up to date), and the script uses it.
With «Verificación visual», the message carries what §5 of `frontend-verification.md` of `sdd-implement` lists, or «composición no medida» or «no probado» with its reason.

## The record

In the walkthrough (`Patch only:` under the table of `patch.md` §4): `Validado: <fecha> · «<frase literal>»` (with `· no detalló qué probó` for a bare «validado» or «sí»), `Validación diferida: <fecha> · «<frase literal>» · disparador: <…>`, `Validación en campo: …` or `Validación por el agente: …`.
