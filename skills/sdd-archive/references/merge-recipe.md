# Merge recipe

Used by the integrated-base and merge steps of `sdd-archive`, once the merge policy has said the change merges: the agent applies it (complete `merge` block, profile `delegate` or `unattended`) or the user asked for it. The destination is `merge.into`, with `--no-ff` if `merge.noFf` is `true`; `Hotfix only:` the stable branch, with the dev-lead's words. What the CLI does isn't repeated here: this says what each output means and what you do next.

## Integrated base

After the closing commit, in the change's worktree: `sdd merge --sync --project-root "<worktree>"`, the sync merge, which stays the branch's last commit. It fetches `<remote>/<merge.into>` (without a remote, the local `merge.into`) and resolves as the merge does: `estimation-log.md` regenerated with `sdd estimation log`, the registers (`.docs/sdd/changelog.md`, `.docs/sdd/roadmap.md`; in 3.0.0, `ROADMAP.md`, `CHANGELOG.md` and `.docs/sdd/steering/debt.md`) joined by id, hunks where both sides only add joined —two requirements added at the end of a capability too—, and what `mergiraf`, if installed, solves. The commit goes through the hook; never `--no-verify`.

- `base: al día: …`: there's nothing to integrate: no sync merge, no second suite, and the merge carries `--verified-at <sha of the validation's suite>`.
- `base: conflicto en <files>.`: the script ran `git merge --abort`; quote it; the close stays «No terminado» for a person.
- **The suite again**: only if, since the sha of the validation's suite, something changed outside `.docs/` that isn't `*.md` (`git diff --quiet <sha> HEAD -- . ':!.docs' ':!*.md'` fails), the same predicate as `--verified-at`. Then run the full suite (E2E included if the project declares them) on the sync merge, and the merge carries `--verified-at <sha of the sync merge>`. If only docs changed, don't run it, and pass the validation's sha.

`--sync` never touches the destination.

## A red suite

A red from the suite you ran is contrasted by hand: the same command in a detached temporary worktree of `<remote>/<merge.into>` (`git worktree add --detach <parent of the worktrees>/base-<id> <remote>/<merge.into>`), removed when done with `git worktree remove`.

- **Passes without the branch**: the red is the branch's. Go back to it, fix with a failing test first, and run the suite again.
- **Fails without the branch too**: write `base: en rojo: el mismo comando también falla sin la rama`. Before opening the failing test, search the first error lines (the test file, the error's name) in the project's debt (`.docs/sdd/steering/debt.md`, or «Deuda técnica» of the 2.x roadmap). A row that names it: quote it. None: open one in «Por triar» (in 2.x, in «Deuda técnica») with the evidence. Then stop with the red report and ask whether to merge anyway: that's the dev-lead's call.

A red from `sdd merge --verify` brings its own `base:` line (`base: en rojo: …` or `base: en verde: el rojo lo trae la rama`), and the same rule follows.

**The red report**, in one block: the command, its exit code, the log's path, its last 20 lines, the base's verdict (the `base:` line) and the destination's state, read with `git rev-parse --short <merge.into>`: «`<merge.into>` sin tocar en `<hash>`».

## The merge is a script

```text
sdd merge --project-root "<worktree>" [--push] [--verify "<merge gate>"] [--verified-at <sha>]
```

Under one lock per repo, the script integrates the destination's remote into the local destination (resolving as `--sync` does), merges in the destination's clean checkout or in a temporary `merge-<id>` worktree beside the others, runs `--verify` on the result and pushes the destination by its name. The change's worktree stays on its branch; `merge.removeWorktree` decides it.

- **`--verify`**: the merge gate of `tech-stack.md` §Testing (`operations.md` in 3.0.0); with a fast set, the fast one; with one suite, that one. Skipped if a `pre-merge-commit` hook already runs it.
- **`--verified-at`**: as in «Integrated base». The script writes `verificación: omitida: desde <sha> solo cambian docs` when it skips.

## Its outputs

| Output | Means | You do |
| --- | --- | --- |
| `destino: listo: …` | `--check` found the destination clean | go on |
| `destino sacado: …` | the destination's checkout has someone else's uncommitted changes | stop before writing: quote it with its `Salidas:`; no `stash`, `reset` or commit of what isn't yours |
| `cerrojo: …` | another close holds the lock past `--lock-timeout` | quote it; a person decides |
| `base: conflicto en <files>.` | integrating the destination's remote (or, with `--sync`, into the branch) leaves a conflict nothing resolved | «No terminado»: a person resolves |
| `merge: conflicto en <files>.` | the change conflicts with the destination | the same; the sync merge above should have caught it |
| `mergiraf: resuelto <file>` | `mergiraf` solved a conflict the kit's rules didn't | nothing: `--verify` runs on the result |
| `registros: dos filas distintas con el id …` | two different rows with one id, both kept | quote it in the final message for the dev-lead |
| `verificación: …` + `base: …` | `--verify` red | «A red suite» |
| `bloqueado: '<file>' lo tiene abierto <process>` | a process holds a file the gate needs | close it and run the script again |
| `push: '<into>' avanzó en '<remote>'; integro y reintento (n/3)` | another session published meanwhile | nothing: the script retries |
| `push: '<into>' sigue moviéndose en '<remote>' tras 3 intentos; …` | the remote kept moving | run the script once more in a while |
| `push: no se pudo publicar …` | rejected for another reason (credentials, server hook) | quote it; never `--force`, `pull` or `rebase` |
| `push: no hecho: sin remoto` | no remote | the final message quotes it |

After any failure the destination is as it was: nothing pushed, the temporary worktree removed, the lock free. The report quotes the message literally, the destination's hash and what's left. Never redo it by hand.

`capability check --artifact` prints the failures of the artifact and of the capabilities its delta touches; those decide the exit code, and you fix them. The others come out apart as someone else's, don't change the exit code and go to the final message as the dev-lead's: don't edit those capabilities.

## Push

The script pushes with `--push`: only the destination, by its name, to its remote; never the change's branch. First rule that applies:

1. Profile `pair`: presented with the merge; `--push` only if the user confirms.
2. Words of the user in this session confirming the push («súbelo», «publícalo»): `--push`.
3. `merge.push: true` (profile `delegate` or `unattended`): `--push`, without asking.
4. `merge.push` missing or `false`: no `--push`, and the final message says «push: no hecho: `merge.push` no lo autoriza».

`Hotfix only:` the stable branch and its tag go out only if the dev-lead's words ask to publish; `merge.push` isn't enough.

## Hotfix

`Hotfix only:` a `hotfix/*` branch merges into the stable branch only with words of the dev-lead that ask for it (Art. IV), used literally in `--order`:

```text
git fetch
sdd merge --check --into <stable> --project-root "<worktree>"
sdd merge --branch <branch> --into <stable> --tag <version> --order "<their words>" [--push]
```

The script fetches the remote's `release/*` itself and decides the way back with them before touching anything. Under one lock it merges into the stable branch, tags, merges the same branch into the integration branch (or the open `release/*`) and pushes everything atomically. `vuelta: conflicto en <files>; se deshacen …` means the script undid it all: the close stays «No terminado», and a person ports the fix to the integration branch and runs the hotfix again.

## Denied by the environment

The policy authorizes the merge and the environment denies it (the harness's classifier, a hook). Don't retry with another tool or another form of the command: a person unblocks it. The final report gives the **command**, literal, in a code block; the **denial's text**, quoted; the destination's **hash**, untouched (`git rev-parse --short <destination>`; if it changed when you look again, another session merged meanwhile: say so); and that the rest of the close is done, with only the merge left.
