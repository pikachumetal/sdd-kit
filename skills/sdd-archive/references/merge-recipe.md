# Merge recipe

Used by the integrated-base and merge steps of `sdd-archive`, once the merge policy of step 7 says the change merges. What the CLI does isn't repeated here: this says what each output means and what you do next.

## Integrated base

After the closing commit, in the change's worktree: `sdd merge --sync --project-root "<worktree>"`, the sync merge, which stays the branch's last commit. It fetches `<remote>/<merge.into>` (without a remote, the local `merge.into`) and resolves as the merge does: `estimation-log.md` regenerated with `sdd estimation log`, the registers (`ROADMAP.md`, `CHANGELOG.md` and `.docs/sdd/steering/debt.md`) joined by id, hunks where both sides only add joined —two requirements added at the end of a capability too—, and what `mergiraf`, if installed, solves. The commit goes through the hook; never `--no-verify`.

- `base: al día: …`: there's nothing to integrate: no sync merge, no second suite, and the merge carries `--verified-at <sha of the validation's suite>` (if the validation deferred it: «No suite yet» of [closing-suite.md](closing-suite.md#after-the-sync-merge)).
- `base: conflicto en <files>.`: the sync merge stays half-done in the worktree, with the registers already joined by id; `<files>` are the only ones left in conflict. If every file is Markdown and in each hunk both sides only add, or touch different rows or cells of a list or table, and neither changes what the other wrote —two additions to one line, a closing prefix on a row whose «Destino» the base changed—, the agent resolves it, in any profile: keep both, commit the merge through the hook, repeat the gate and name it with the line of step 6 of `sdd-archive`. If both rewrite one phrase, one hunk sets a value two ways, one side contradicts the other, any file isn't Markdown, or you doubt, resolve nothing: quote it; the close stays «No terminado» for a person, who resolves those files and commits the merge, or runs `git merge --abort`.

`--sync` never touches the destination.

## A red suite

A red is contrasted by hand, from the saved output:

1. Create a detached temporary worktree of `<remote>/<merge.into>` (`git worktree add --detach <parent of the worktrees>/base-<id> <remote>/<merge.into>`), removed when done with `git worktree remove`, and prepare it as Step 2 of `sdd-worktrees` says (dependencies; `env:setup` with `## Entornos`) before running anything in it: a fresh worktree without them fails on a missing module, not on the test.
2. Run the failing file alone, with the project's runner (`vitest run <file>`, `node --test <file>`), not the gate nor its whole task: on the branch and in that worktree at once, in the background in the same turn. A red with no file to name (a build, a lint) runs its task as is, without `--affected`.
3. Read both results:

- **Passes without the branch, red on the branch**: it's the branch's; fix it with a failing test first and go back to the gate as «Running a gate» of `sdd-verify` says: the tests that failed and what the fix affects, not the whole suite.
- **No se repite**: green in both. If the saved error line is a timeout or a machine resource (a busy port, a locked file, a full disk, git's temporary objects), that explains the red: open a debt row of flaky tests, placed as below and with what step 6 lists; go on, in any profile. If it isn't, first run the red task whole in both, without `--affected` (in the base's worktree it selects nothing), and read it the same way: two green passes of the file alone don't make it flaky, since the red can come from another file of its task.
- **Fails without the branch** (on the branch too, or only there): write `base: en rojo: el mismo comando también falla sin la rama`.
<!-- kit: incluye base-red-debt -->
Stop with the red report and ask whether to merge anyway.

A red from `sdd merge --verify` brings its own `base:` line (`base: en rojo: …` or `base: en verde: el rojo lo trae la rama`), and the same rule follows.

**The red report**, in one block: the command, its exit code (`código <n>`), the log's path, its last 20 lines, the base's verdict (the `base:` line) and the destination's state, read with `git rev-parse --short <merge.into>`: «`<merge.into>` sin tocar en `<hash>`».

## The base's CI

Before `sdd merge` (not before `--sync`), if «CI de la base» of `operations.md` §Testing declares a pipeline with the command that reads its last result, run it and read `conclusion` and `headSha`:

- `failure`: don't run `sdd merge`. Write this line, literal, in the final message: `CI de <merge.into> en rojo en <headSha>`; search the `headSha` and the workflow's name in the project's debt as «Fails without the branch» says, and with no row that names them open one with the `headSha`. The close stays «No terminado», with the red in what's pending: what fixes `<merge.into>` is a patch.
- Any other result (`success`, `cancelled`, the empty `conclusion` of a run in progress, no runs): go on with the merge policy.
- The command fails (no `gh`, no session, no network): write this line, literal, in the final message: `CI de <merge.into> sin respuesta: <first line of the error, whole>; sigo sin leerla`, and go on with the merge policy.

With `ninguna` or `sin orden de lectura`, nothing is read or said. A hotfix doesn't read it: the CI is the integration branch's.

## The merge is a script

```text
sdd merge --project-root "<worktree>" [--push] [--verify "<merge gate>"] [--verified-at <sha>]
```

With `--verify`, the script integrates the destination (remote and local) into the change's branch in its worktree, resolving as `--sync` does, and runs `--verify` there, without the lock. Then, under one lock per repo, it integrates the destination's remote into the local destination, merges in the destination's clean checkout or in a temporary `merge-<id>` worktree beside the others and pushes the destination by its name. If the destination changed meanwhile outside docs, it integrates and verifies what crosses again, up to 3 times. Without `--verify`, everything happens under the lock. The change's worktree stays on its branch; `merge.removeWorktree` decides it.

- **`--verify`**: the merge gate of `operations.md` §Testing; with a fast set, the fast one; with one suite, that one. Skipped if a `pre-merge-commit` hook already runs it. The script launches it as arguments, without a shell: a gate that chains commands (`&&`, `;`, a pipe) exits 2, and becomes a moon task or a `package.json` script. With a `moon run … --affected` gate it runs only what crosses, the tasks the branch touches whose inputs the base also touched, and its `verificación: corre …` and `verificación: <tarea>: saltada (…)` lines go in the `Gate:` line.
- **`--verified-at`**: as in «Integrated base». The script writes `verificación: omitida: desde <sha> solo cambian docs` when it skips.

## Its outputs

| Output | Means | You do |
| --- | --- | --- |
| `destino: listo: …` | `--check` found the destination clean | go on |
| `destino sacado: …` | the destination's checkout has someone else's uncommitted changes | stop before writing: quote it with its `Salidas:`; no `stash`, `reset` or commit of what isn't yours |
| `cerrojo: …` | another close holds the lock past `--lock-timeout` | quote it; a person decides |
| `base: conflicto en <files>.` | integrating the destination's remote (or, with `--sync`, into the branch) leaves a conflict nothing resolved | «Integrated base» |
| `merge: conflicto en <files>.` | the change conflicts with the destination | the same; the sync merge above should have caught it |
| `mergiraf: resuelto <file>` | `mergiraf` solved a conflict the kit's rules didn't | nothing: `--verify` runs on the result |
| `registros: dos filas distintas con el id …` | two different rows with one id, both kept | quote it in the final message for the dev-lead |
| `base: integrada '<ref>' en '<branch>': <hash>` | with `--verify`, the destination (remote or local) came into the change's branch before verifying | nothing: the commit stays on the branch |
| `base: '<branch>' tiene cambios sin commitear; …` | with `--verify`, the change's worktree has uncommitted changes; nothing was locked | commit them and run the script again |
| `--verify corre en el worktree de la rama; …` (exit 2) | `--branch` names a branch that isn't checked out in `--project-root`; nothing was locked | run it from the branch's worktree |
| `--verify: el gate encadena comandos con …` (exit 2) | the gate chains or redirects commands; nothing was locked | make it a moon task or a `package.json` script, and run the script again |
| `verificación: corre …` · `verificación: <tarea>: saltada (…)` | the crossing of a `moon run … --affected` gate | copy them into the `Gate:` line |
| `verificación: sin cruce: …` | the gate can't be crossed (a target or option the script doesn't cross, or `moon query` failed): it runs what the branch touches | quote it in the `Gate:` line |
| `verificación: no se encuentra '<program>' en el PATH` | the gate's program isn't on the `PATH` | fix the gate or the machine, and run the script again |
| `verificación: …` + `base: …` | `--verify` red | «A red suite» |
| `bloqueado: '<file>' lo tiene abierto <process>` | a process holds a file the gate needs | close it and run the script again |
| `push: también publica <n> commit(s) de '<into>' que no son de <branch>:` + `- <hash> <subject>` lines | the destination had local commits not yet published, and they went out with the change | quote them in the final message: the dev-lead sees what went out besides the change |
| `merge: '<into>' cambió durante la verificación; integro y verifico lo que se cruza (n/3)` | another session merged while `--verify` ran | nothing: the script retries |
| `merge: '<into>' sigue cambiando tras 3 intentos; …` | the destination kept changing | run the script once more in a while |
| `push: '<into>' avanzó en '<remote>'; integro y reintento (n/3)` | another session published meanwhile | nothing: the script retries |
| `push: '<into>' sigue moviéndose en '<remote>' tras 3 intentos; …` | the remote kept moving | run the script once more in a while |
| `push: no se pudo publicar …` | rejected for another reason (credentials, server hook) | «Denied by the environment»; never `--force`, `pull` or `rebase` |
| `push: no hecho: sin remoto` | no remote | the final message quotes it |

After any failure the destination is as it was: nothing pushed, the temporary worktree removed, the lock free; with `--verify`, the change's branch is back at its commit too. The report quotes the message literally, the destination's hash and what's left. Never redo it by hand.

`capability check --artifact` prints the failures of the artifact and of the capabilities its delta touches; those decide the exit code, and you fix them. The others come out apart as someone else's, don't change the exit code and go to the final message as the dev-lead's: don't edit those capabilities.

## Push

The script pushes with `--push`: only the destination, by its name, to its remote; never the change's branch. First rule that applies:

1. Profile `pair`: presented with the merge; `--push` only if the user confirms.
2. Words of the user in this session confirming the push («súbelo», «publícalo»): `--push`.
3. `merge.push: true` (profile `delegate` or `unattended`): `--push`, without asking.
4. `merge.push` missing or `false`: no `--push`, and the final message says «push: no hecho: `merge.push` no lo autoriza».

`Hotfix only:` the stable branch and its tag go out only with words of the dev-lead that ask to publish, and then with `--push` even if you see no remote: the script answers `push: no hecho: sin remoto`. `merge.push` isn't enough.

## Hotfix

`Hotfix only:` a `hotfix/*` branch merges into the stable branch only with words of the dev-lead that ask for it (Art. IV), used literally in `--order`:

```text
git fetch
sdd merge --check --into <stable> --project-root "<worktree>"
sdd merge --branch <branch> --into <stable> --tag <version> --order "<their words>" [--push]
```

With a yes to the pre-check's question («¿Alguno de estos patches pide algo al proyecto…?»), list `skills/sdd-upgrade/references/migrations/` in the repo: if it exists, write the step in `v<version>.md` there before tagging, whatever the project is; if it doesn't, the final message lists the step as pending for the dev-lead.

The script fetches the remote's `release/*` itself and decides the way back with them before touching anything. Under one lock it merges into the stable branch, tags, merges the same branch into the integration branch (or the open `release/*`) and pushes everything atomically. `vuelta: conflicto en <files>; se deshacen …` means the script undid it all: the close stays «No terminado», and a person ports the fix to the integration branch and runs the hotfix again.

## Denied by the environment

The policy authorizes the merge and the environment or the remote stops it: the harness's classifier and a hook deny it, and a push whose SSH key fails says `Permission denied (publickey)`. A denial is retried by no one but a person: don't retry with another tool or another form of the command. A `publickey` failure with `gh auth status` showing a session is run once more, the same command, over HTTPS with gh's token, set for that command alone (`$env:` in PowerShell, cleared after; `VAR=… cmd` in POSIX): `GIT_CONFIG_COUNT=2`, `GIT_CONFIG_KEY_0=url.https://github.com/.insteadOf`, `GIT_CONFIG_VALUE_0=<the remote's git@github.com: prefix>`, `GIT_CONFIG_KEY_1=credential.helper`, `GIT_CONFIG_VALUE_1=!gh auth git-credential`, without touching `~/.ssh` or `.gitconfig`. If that run fails too, or `gh` has no session, it's a denial. The final report of a denial gives the **command**, literal, in a code block; the **denial's text**, quoted; the destination's **hash**, untouched (`git rev-parse --short <destination>`; if it changed when you look again, another session merged meanwhile: say so); and that the rest of the close is done, with only the merge left.

## Removing the worktree

With `merge.removeWorktree: true`, remove a linked, clean worktree from outside it (`git worktree remove <ruta>`); if git refuses, show the files and ask, never `--force`. Before discarding work, list what would be deleted and wait for the typed word `discard`.

## Common Rationalizations

| Excuse | Reality |
| --- | --- |
| "They obviously want it merged" | Integration is the merge policy's or the dev-lead's decision, never a guess. |
| "They seem done with this — I'll offer to discard it" | Discard happens only when the dev-lead asks for it, in those words. |
| "«Yeah, get rid of it» confirms the discard" | Deletion waits for the typed word `discard`; any other phrase is not it. |
| "The PR is open: the worktree is just clutter" | Review feedback is fixed in that worktree; it stays until the work merges. |
| "This other worktree looks stale — I'll clean it too" | Clean up only this change's worktree. Everything else belongs to someone else. |
| "Git refused the removal; `--force` finishes the job" | Git refuses because some files live nowhere else, and `--force` deletes them for good: show them and ask. |
| "The merged-result failure is probably flaky" | A failing merged result stops the merge until step 6's contrast ends; flaky is only green on the branch and the base, with its debt row. |
| "The base branch is obviously main" | The destination is `merge.into`; `main` only for a hotfix, with the dev-lead's words. |
| "The push was rejected — force-push will fix it" | A rejected push means the remote moved: `sdd merge` integrates and retries, and never forces. |
| "It's trivial and urgent: I merge and go" | Urgency is the first cause of broken merges. Merge only if the user decided it or the `merge` block declares it. |
