# The suite of the close

Steps 1 and 6 of `sdd-archive`. Every run saves its whole output to a file in the session's scratchpad before any `tail`, `grep` or `Select-String`: a red is read from that file.

## In the validation

If the suite already ran for this close (the validation names its sha; the closing commit moves `HEAD`, not that), don't run it again, whatever the base did: step 6 repeats only what the base brought (`tests/affected-gate-red.md`, g5). If it hasn't run, with another branch open (item 3 of step 0) or the base ahead (`git rev-list --count HEAD..<remote>/<merge.into>` > 0 after `git fetch`), step 6 runs it once (g6); otherwise run the closing gate here.

## What runs

A branch that only touches `.docs/` or `*.md` runs nothing. Otherwise each suite of «Suites» with level `unitario` or `pendiente` (a suite without a level counts as `pendiente`) runs whole, with its command, before the gate, unless its command is the gate's or one of the tasks the gate runs.
If the branch touches a file of «Sin filtro» —without the field, the list of «Running a gate» of `sdd-verify`: manifests, lockfiles, `.moon/**` and build and runner configs (`package.json`, `pnpm-lock.yaml`, `*.csproj`, `tsconfig*.json`, `vitest.config.*`…)—, run the gate without `--affected`, every task of the line with `(sin filtro: cambia el build)`, also the ones the filter would have run. After a red, «Running a gate» of `sdd-verify`.

Each run is recorded with the `Gate:` line of `sdd-verify`, one entry per task, `<tarea>: saltada (<porqué>)` too: it names every command that ran before the arrow, the unit suites first: `` Gate: `<suite unitaria>` · `<gate>` → <suite>: corrió <N>/<M> · <tarea>: corrió <N>/<M> (sin filtro: cambia el build) `` (`tests/affected-gate-red.md`, g5).

## After the sync merge

- **No suite yet** (step 1 left it for here): the closing gate runs once, on the sync merge (on `HEAD` if `--sync` said `base: al día`), as «Running a gate» of `sdd-verify` says, and it is the validation's suite: the validation record says it ran on the sync merge (or on `HEAD`), and its sha goes in `--verified-at` and the final message. What only the base touched passed the close that brought it: the filter decides it like the rest.
- **With a suite**: nothing runs if the base only brought `.docs/` or `*.md` and you resolved no conflict (`git diff --quiet <sha> HEAD -- . ':!.docs' ':!*.md'` holds). Otherwise the unit suites run whole, as above, and, without a file of «Sin filtro» from the base, the gate runs where it crosses the branch: with `--affected --base <ref>`, the tasks selected by both `--base <merge.into>` (the branch) and `--base <sha of the validation's suite>` (the base). A task that only one of the two selects doesn't run, nor does a gate pass with only that one: it goes in the line as `saltada (solo la toca la base)`, or `saltada (la base no toca sus inputs)` if the base didn't touch its inputs. A gate that doesn't filter runs whole.
- The merge carries `--verified-at` with the sha of that run, or of the validation's suite if nothing ran. «The validation's sha», here and in the final message, is the closing commit's when the close squashed the validation's suite into it (a fix pass or a draft after the last task): the same code, still reachable; never the last task's.

## In the walkthrough

«4.1 Builds» gives the `Gate:` line of the validation's run, its duration, configuration (the gate's, or what you added) and sha, or «sobre el commit de cierre» if step 5 squashes that sha, and then `--verified-at` carries the closing commit's. A run after the sync merge goes in the final message, because the walkthrough is in the closing commit.
