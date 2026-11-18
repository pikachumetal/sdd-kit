# The dev's validation

For `validation.mode` `manual` or missing, in a feature or a patch (step 1 of `sdd-archive`). Form and order: [validation-template.md](../../sdd-templates/templates/validation-template.md). With `validation.mode: field` or `Validación: agente` none of this runs.

## 1. The script

Each step is a numbered action in the app with the scenarios' data and its expected result with the literal that comes out —«Debe cancelarse con normalidad» or «sin error» gives the person nothing to compare. In this order:

1. **The report's steps first**, literal and in their order: the symptom of `patch.md` or the ticket. «I check `libres 10:00-12:00`, it says «Sur»; then `cancelar mie 10:00` says «cancelada mie 10:00»» opens the script with `node src/app.js libres 10:00-12:00` → «Sur» and `node src/app.js cancelar mie 10:00` → «no hay reserva mie 10:00».
2. Then one step per line «Se prueba en la aplicación» of the tasks; without it, one per THEN of the spec.

**Run every step yourself before presenting it**, as the person will: same command, request or clicks, same data. Use your own access —the agent's user of «Acceso a la aplicación» in `operations.md`— and leave data you didn't create untouched: after a step that writes, put the data back, or say what state the person starts from. A step you added that fails when you run it leaves the script. A THEN you can't observe (a screen with no detector, a `Se valida en:`) stays, marked `no ensayado: <motivo>`, with the check you did make.

## 2. The environment

The script opens with it. With `validation.startEnvironment: true` in `.docs/sdd/sdd-kit.local.json` it must be up: if nothing you started answers (a closing gate that doesn't raise it), raise it with `env:setup` of `## Entornos` in `operations.md` if the section exists, otherwise «Arrancar»; check it answers, and open with its URL or port and the command that stops it. Without the key, or `false`, stop what you started (`sdd-implement`, «Processes you start») and open with how to start it. With no command declared, say so. An app you also run from the CLI still has one if «Arrancar» declares it.

## 3. Hands off

From the message that presents the script until the person answers, launch nothing against the environment and leave nothing running against it: no batch, suite, `env-up`, `env-down`, probe or data write. A batch asked for «while I test» runs **before** you present —wait for its result— or **after** the answer; say which and why. Still fine: the environment raised and checked before presenting.

## 4. The record

The script ends with «Si alguno de estos pasos no sale como digo, dime el número del paso y qué ves.»

- «validado», «sí» or what they tried and that it works: `Validado: <fecha> · «<frase literal>»`.
- A failing step: «No funciona», with its number and what they see; the retest starts after the fix.
- A step they won't test now: deferred validation ([control-profiles.md](../../sdd-propose/references/control-profiles.md)) applies to it.

## Common Rationalizations

| Excuse | Reality |
| --- | --- |
| "They're in a rush: the batch runs in the background while they test" | It restarts the server or writes their data: «La tanda usa el servidor del puerto 4650 y lo para al acabar», a RED subject. Before presenting, or after the answer. |
| "My E2E covered it" | Run the exact steps the person will type. |
| "The key is set, but I didn't start anything" | That's its case: start it (§2). |
| "It runs from the CLI: no environment to start" | «Arrancar» declares one: start it, check it, give its port. |
