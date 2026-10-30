# The dev's validation

For `validation.mode` `manual` or missing, in a feature or a patch (step 1 of `sdd-archive`, step 7 of `sdd-start-feature`). Form and order: [validation-template.md](../../sdd-templates/templates/validation-template.md). With `validation.mode: field` or `Validación: agente` none of this runs.

## 1. The script

Each step is a numbered action in the app with the scenarios' data and its expected result with the literal that comes out —«Debe cancelarse con normalidad» or «sin error» gives the person nothing to compare. In this order:

1. **The report's steps first**, literal and in their order: the symptom of `patch.md` or the ticket. «I check `libres 10:00-12:00`, it says «Sur»; then `cancelar mie 10:00` says «cancelada mie 10:00»» opens the script with `node src/app.js libres 10:00-12:00` → «Sur» and `node src/app.js cancelar mie 10:00` → «no hay reserva mie 10:00».
2. Then one step per line «Se prueba en la aplicación» of the tasks; without it, one per THEN of the spec.

**Run every step yourself before presenting it**, as the person will: same command, request or clicks, same data. Use your own access —the agent's user of «Acceso a la aplicación» in `operations.md`— and leave data you didn't create untouched: after a step that writes, put the data back, or say what state the person starts from. A step you added that fails when you run it leaves the script («reserve Wednesday and cancel it» in an app that keeps no bookings between processes). A THEN you can't observe (a screen with no detector, a `Se valida en:`) stays, marked `no ensayado: <motivo>`, with the check you did make.

## 2. The environment

The script opens with it. With `validation.startEnvironment: true` in `.docs/sdd/sdd-kit.local.json` it must be up: if nothing you started answers (a closing gate that doesn't raise it), raise it with `env:setup` of `## Entornos` in `operations.md` if the section exists, otherwise «Arrancar»; check it answers, and open with its URL or port and the command that stops it. Without the key, or `false`, stop what you started (`sdd-implement`, «Processes you start») and open with how to start it. With no command declared, say so. An app you also run from the CLI still has one if «Arrancar» declares it.

## 3. Hands off

From the message that presents the script until the person answers, launch nothing against the environment and leave nothing running against it: no batch, suite, `env-up`, `env-down`, probe or data write. A batch asked for «while I test» runs **before** you present —wait for its result— or **after** the answer; say which and why. Still fine: the environment raised and checked before presenting, the `sdd validation serve` server, and reading or re-injecting the panel.

## 4. The panel line

The validation message carries one of these two lines, before the script; pick one, never both:

```text
Panel: Chrome sobre <url de la app>
Panel: plan B en http://127.0.0.1:<port>/
```

Without the Chrome tools it's the second, CLI apps included: launch `sdd validation serve` (§6) before presenting. «Sin panel» is not an option; only if that command fails, the line is `Panel: no arrancó: <su error>`.

## 5. The panel in Chrome

With the `claude-in-chrome` tools and a browser from `list_connected_browsers`, the person marks the steps on [validation-panel.js](validation-panel.js), over their app:

- `sddValidationPanel.mount(<id>, [{id, title}])` mounts validation `<id>` (the feature's or patch's id), keeping that `<id>`'s saved marks; another `<id>` starts from zero; `mount(<id>)` restores them.
- `read()` returns `[{id, title, status, comment, markedAt}]`, `status` `pending | ok | ko`; `clear()` removes its `localStorage` keys, all prefixed `sdd-validation-`.

Open the app, inject the file with `javascript_tool` and mount the steps, each `title` «action → expected result». Then the four rules of feature 0162:

1. `read_network_requests` right after injecting: the network log starts at the first call.
2. `read_console_messages` with `clear: true` when injecting, so old errors aren't attached to a KO.
3. On «listo», or when the person says the panel is gone, re-inject before reading: `eval(localStorage.getItem('sdd-validation-panel-src')); sddValidationPanel.mount('<id>')`.
4. Say, when presenting and with a KO, that the screenshot is from reading time, not the KO's, and that the network log has no time.

If injecting fails (a CSP blocking `eval`, another origin after an SSO), go to plan B and say why. The script also goes in text.

## 6. Plan B

No Chrome tools, no connected browser, or injection failing: `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" validation serve --steps <steps.json> --out .temp/validation/<id>.json` in the background, `steps.json` being the script's `[{id, title}]`. Before launching it, if `.temp/` isn't in the project's `.gitignore`, say so and propose adding it. Give the URL it prints (`panel: http://127.0.0.1:<port>/`). Say what this page loses: it doesn't see the app, so no console, network or screenshot of a KO; the person tells the error in the comment. On «listo», read the `--out` file and stop the server by its PID.

## 7. The record

- All `ok` and «listo»: `Validado: <fecha> · panel: <n>/<n> OK · «listo»`, then `clear()`.
- A `ko`: «No funciona», with its comment and, in Chrome, the console and network read and a screenshot; then `clear()`: the retest starts clean.
- A `pending` step isn't OK: ask. If the person won't test it now, deferred validation ([control-profiles.md](../../sdd-start-feature/references/control-profiles.md)) applies to those steps.
- What the person says in the chat wins over a mark: record their phrase.

## Common Rationalizations

| Excuse | Reality |
| --- | --- |
| "They're in a rush: the batch runs in the background while they test" | It restarts the server or writes their data: «La tanda usa el servidor del puerto 4650 y lo para al acabar», a RED subject. Before presenting, or after the answer. |
| "My E2E covered it" | Run the exact steps the person will type. |
| "The key is set, but I didn't start anything" | That's its case: start it (§2). |
| "No Chrome, or it's a CLI app: they paste the results" | Plan B: `sdd validation serve`, and the `Panel:` line says so. |
| "It runs from the CLI: no environment to start" | «Arrancar» declares one: start it, check it, give its port. |
