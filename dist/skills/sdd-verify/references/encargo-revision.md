# Review brief — mandatory header

The briefs of **each axis of the final review**, of its **fix pass** in SDD and of its **re-review** start like this, before the axis brief ([`sdd-verify`](../SKILL.md), «Final review»). Those of the task reviewer and the re-reviewer already carry it inside: [task-reviewer-prompt.md](../../sdd-implement-subagent/task-reviewer-prompt.md) and [re-review-prompt.md](../../sdd-implement-subagent/re-review-prompt.md) of `sdd-implement-subagent`.

```markdown
## Code constraints

<literal copy of the «De código» block of plan.md's Restricciones globales, the code quality article included; in lite mode, without a plan: the constitution's code quality article, literal>

Breaking one of these constraints is **Important**, even if the template below doesn't mention it. A numeric threshold exceeded by one unit (a 21-line function with a limit of 20, 4 parameters with a limit of 3) is Minor; exceeded by more, Important.

Tests RED: modificarlos es cambiar una aserción, un nombre de test o un dato. El formato que exige el linter o el formateador del proyecto (una línea en blanco, la sangría) no es una modificación.

---

<el encargo del eje a partir de aquí>
```

Why this way: superpowers' templates have a slot for constraints only in the task reviewer's; the final reviewer's and the re-review's don't, and a reviewer without the constraints approves what they forbid (T7: comments that repeated the code). Measured: `tests/gates-reviews-green.md`, E3.

No block travels other than «De código». The «De proceso» one (model policy, execution method, commit attribution) is for whoever dispatches: superpowers' `task-reviewer-prompt.md` keeps that slot for what the spec demands, «not process rules», and a reviewer who reads them audits them. With the whole block and «every breach is Important», 2 of 2 reviewers returned «Needs fixes» on a correct diff: for the blank line the linter demanded in a RED test, for a 21-line function and for the dispatch method (`tests/proportional-review-red.md`, R1).

## Final reviewer («Revisor final»)

Each axis is dispatched with the type and model of the «Final review» table of `sdd-verify` —Spec and Architecture with `subagent_type: sdd-kit:effort-high` + `model: opus`, Code with `subagent_type: sdd-kit:effort-high` + `model: sonnet`—, also in Native, where the thread dispatches them. Measured: `tests/native-adapt-red.md`. Like every dispatch, it carries its silence watch, also in the re-review: [Silence watch](../../sdd-propose/references/control-profiles.md#silence-watch).

The thread keeps working and committing while the axes review. That is why they don't work in the thread's tree, but in a worktree detached at the sha they review, `review-<id>-<sha corto>`, next to the repo's other worktrees:

```bash
SHA=$(git rev-parse --short HEAD)
REVIEW_DIR="$(dirname "$(git rev-parse --show-toplevel)")/review-<id>-$SHA"
git worktree add --detach "$REVIEW_DIR" "$SHA"
```

The package recipe runs inside `$REVIEW_DIR`, and the brief names that directory as the only one it works in, with this sentence: «You review `<sha>` as if it were the last commit: work only in `<REVIEW_DIR>`, and don't look at later branches or commits (`git log` without `--all` or branch names)». When every axis has returned, the thread removes it with `git worktree remove "$REVIEW_DIR"`. The re-review of a range `<a>..<b>` is anchored the same way, at `<b>`. Measured: ticket of feature 0027 of document-manager, §2, and `tests/closing-off-critical-path-red.md`, c1.

The thread prepares the package with this recipe, not with `sdd review package`, in both methods. `sdd review package` cuts the range from the start's base and admits no exclusions: the reviewer always reads the campaigns' evidence and, if the branch merged the integration branch, other features' work too (9 MB against 179 KB in feature 0070, 730 KB against 78 KB in 0058). In Git Bash, with `<integración>` the constitution's integration branch (`develop` if it fixes no other):

```bash
cd "$(git rev-parse --show-toplevel)"
MERGE_BASE=$(git merge-base HEAD <integración> $(git rev-parse -q --verify origin/<integración>))
EXCLUDE=(':(exclude,glob).docs/sdd/specs/**/red/**' ':(exclude,glob).docs/sdd/specs/**/green/**' ':(exclude,glob).docs/sdd/specs/<carpeta de la feature>/**')
WORKSPACE="$(sdd workspace -C "<worktree de la feature>" "<plan>")"
OUT="$WORKSPACE/review-final-$(git rev-parse --short HEAD).diff"
{
  echo "# Review package: ${MERGE_BASE}..HEAD"; echo
  echo "## Commits"; git log --oneline "${MERGE_BASE}..HEAD"; echo
  echo "## Files changed"; git diff --stat "$MERGE_BASE" HEAD -- . "${EXCLUDE[@]}"; echo
  echo "## Ficheros borrados"; git diff --name-only --diff-filter=D "$MERGE_BASE" HEAD -- . "${EXCLUDE[@]}"; echo
  echo "## Diff"; git diff -U10 --diff-filter=d "$MERGE_BASE" HEAD -- . "${EXCLUDE[@]}"
} > "$OUT" && echo "$OUT"
```

The merge-base is computed at review time, also if the branch merged the base midway: the start's base drags in what the merge brought. With a remote, `git fetch` first: if the branch merged `origin/<integración>` and the local one is behind, the local base brings back other features' work; without a remote, `rev-parse` prints nothing and the local one stays. If the two have diverged, git picks a single base: sync them first. Don't use `git diff <integración> HEAD`: if the integration branch moved after the merge, it brings its new commits in reverse. In lite mode, `<plan>` is `spec.md`. `<carpeta de la feature>` names the spec's folder in `.docs/sdd/specs/`: the spec and the plan reach the Spec axis by their path, in its brief. Deleted files go by name only. With them, the reviewer's first `Read` failed on size (its field ticket, §3). If the project's tech-stack declares other evidence folders, add them to `EXCLUDE` in the same form. Without the recipe, 2 of 2 subjects put the spec's 400 lines of `red/out/` into the package, and one wrote it inside the spec's folder (`tests/final-review-package-red.md`).

After the header and before the axis brief:

```markdown
## How to review

Read the review package `<path of the package the recipe prints>` in 400-line chunks with `offset` and `limit`: it has the commits, the summary, the deleted files by name and the diff of the rest of the branch, without the spec's folder. Don't redo the diff with git. Don't run the suite, the build or the lint: the task reports bring the test evidence, and the main thread runs the whole suite. If you think a heavy verification is missing, recommend it in your report.
```

With the header and without this section, 2 of 2 final reviewers redid the diff and ran the suite and the lint (`tests/proportional-review-red.md`, R2).

In the Spec axis brief, if the plan has `## Review Focus`, this section goes after «How to review»:

```markdown
## Review Focus

<literal copy of the plan's `## Review Focus` section: all its lines, whole>

Check each line on purpose: the input, the expected behavior and the test or verification that pins it. A line without a named test or verification, or whose code doesn't give that behavior, is a finding.
```

It is what superpowers' `executing-plans` asked for («the plan's Review Focus section verbatim»), and pointing at the plan isn't enough: with the pointer («the plan has a Review Focus section, check it»), 1 of 2 briefs on Opus went out without its lines (`tests/plan-review-focus-red.md`).

## Implementer brief

It lives in [implementer-prompt.md](../../sdd-implement-subagent/implementer-prompt.md) of `sdd-implement-subagent`, with the same «Code constraints» section and, besides, the contract of the RED tests, the task's «Verificación» and the implementer's rules.
