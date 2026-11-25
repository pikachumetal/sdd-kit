# The suite of the close

Step 6 of `sdd-archive`; the gate itself runs in `sdd-validate`. With E2E fields in `operations.md` §Testing («Flujos core», «Entorno de la suite»…), first read [e2e-suite.md](e2e-suite.md): every pass that counts follows its steps. Every run saves its whole output to a file in the session's scratchpad before any `tail`, `grep` or `Select-String`: a red is read from that file.

## Before the close

The closing gate already ran, once, at the end of the tasks, in `sdd-validate` (a hotfix or a spike runs it in step 1 of `sdd-archive`): its sha is in the validation record (the closing commit moves `HEAD`, not that). Don't run it again, whatever the base did: step 6 repeats only what the base brought.

## With «Camino crítico»

Here, before the suite, even one on the sync merge:

1. «Tests de feature» once; a red is a fix pass.
2. The check; decide by prefix, not exit code. Stop and name it, deleting nothing, on `sin-base:`, a prefix other than `fuera:`, `ya-en-base:`, `lista-tocada:`, `fila-nueva:` or `freno-modificado:`, a non-zero exit with no known prefix, a `cubre` suite missing from «Suites», or `critical-path.md` missing or empty («`Camino crítico` declarado sin `critical-path.md`: no borro nada.»).
3. A row proposed («Dónde se prueba», `patch.md` §4): ask «¿Pegas en `critical-path.md` la fila `<fila>`? Si no, el cierre borra `<test>`.». No answer: the close waits; in `unattended`, delete it and log row and task sha as debt. Never write it.
4. Delete only `fuera:` tests of `integración` or `E2E` suites, finding each file in `git diff --name-only <merge-base>` by its path's end (two matches: stop, name both); remove that test (the file, if empty). In the closing commit, with the 4.1 «Tests de feature» line.
5. The suite on the deleted tree: non-zero is red. A fix pass restarts at 1.

The final message (after the sync merge, if any): «La base trae `<cuántos>` tests fuera de la lista (`ya-en-base:`): `<test>`[, …]. Recomiendo un patch que los borre; decide el dev-lead.» (ten at most), and the `lista-tocada:`, `fila-nueva:` and `freno-modificado:` lines; no debt row.

## What runs

«Suites» is in `operations.md` §Testing.
<!-- kit: incluye suites-before-gate -->
If the branch touches a file of «Sin filtro» —without the field, the list of «Running a gate» of `sdd-verify`: manifests, lockfiles, `.moon/**` and build and runner configs (`package.json`, `pnpm-lock.yaml`, `*.csproj`, `tsconfig*.json`, `vitest.config.*`…)—, run the gate without `--affected`, every task of the line with `(sin filtro: cambia el build)`, also the ones the filter would have run. After a red, «Running a gate» of `sdd-verify`.

Each run is recorded with the `Gate:` line of `sdd-verify`, one entry per task, `<tarea>: saltada (<porqué>)` too: it names every command that ran before the arrow, the unit suites first: `` Gate: `<suite unitaria>` · `<gate>` → <suite>: corrió <N>/<M> · <tarea>: corrió <N>/<M> (sin filtro: cambia el build) ``.

## After the sync merge

- **What the base brought**: nothing runs if the base only brought `.docs/` or `*.md` and you resolved no conflict (`git diff --quiet <sha> HEAD -- . ':!.docs' ':!*.md'` holds). Otherwise the unit suites run whole, as above, and, without a file of «Sin filtro» from the base, the gate runs where it crosses the branch: before running, compare each task's inputs (`moon task <name>`, or the gate's own) with `git diff --name-only` from `<merge.into>` (the branch) and from `<sha of the closing gate's run>` (the base), and run only the tasks both select. Any other goes in the line as `saltada (solo la toca la base)`, or `saltada (la base no toca sus inputs)` if the base didn't touch its inputs. A gate that doesn't filter runs whole.
- The merge carries `--verified-at` with the sha of that run, or of the closing gate's run if nothing ran. «The closing gate's sha», here and in the final message, is the closing commit's when the close squashed the closing gate's run into it (a fix pass or a draft after the last task): the same code, still reachable; never the last task's.

## In the walkthrough

«4.1 Builds» gives the `Gate:` line of the closing gate's run, its duration, configuration (the gate's, or what you added) and sha, or «sobre el commit de cierre» if step 5 squashes that sha, and then `--verified-at` carries the closing commit's. A run after the sync merge goes in the final message, because the walkthrough is in the closing commit.
