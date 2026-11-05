# Review brief — mandatory header

The briefs of **each axis of the final review**, of its **fix pass** in SDD and of its **re-review** start like this, before the axis brief ([`sdd-verify`](../SKILL.md), «Final review»). Those of the task reviewer and the re-reviewer already carry it inside: [task-reviewer-prompt.md](../../sdd-implement/references/task-reviewer-prompt.md) and [re-review-prompt.md](../../sdd-implement/references/re-review-prompt.md) of `sdd-implement`.

```markdown
## Restricciones de código

<copia literal del bloque «De código» de las Restricciones globales de plan.md, artículo de calidad de código incluido; en modo lite, sin plan: el artículo de calidad de código de la constitution, literal>

Incumplir una de estas restricciones es **Important**, aunque la plantilla de abajo no lo mencione. Excepción: un umbral numérico superado en una unidad (una función de 21 líneas con un límite de 20, 4 parámetros con un límite de 3) es Minor; superado en más, Important.

Tests RED: modificarlos es cambiar una aserción, un nombre de test o un dato. El formato que exige el linter o el formateador del proyecto (una línea en blanco, la sangría) no es una modificación.

---

<el encargo del eje a partir de aquí>
```

Why this way: superpowers' templates have a slot for constraints only in the task reviewer's; the final reviewer's and the re-review's don't, and a reviewer without the constraints approves what they forbid (T7: comments that repeated the code). Measured: `tests/gates-reviews-green.md`, E3.

No block travels other than «De código». The «De proceso» one (model policy, execution method, commit attribution) is for whoever dispatches: superpowers' `task-reviewer-prompt.md` keeps that slot for what the spec demands, «not process rules», and a reviewer who reads them audits them. With the whole block and «every breach is Important», 2 of 2 reviewers returned «Needs fixes» on a correct diff: for the blank line the linter demanded in a RED test, for a 21-line function and for the dispatch method (`tests/proportional-review-red.md`, R1).

## Final reviewer («Revisor final»)

Each axis is dispatched with the type and model of the «Final review» table of `sdd-verify` —Spec and Architecture with `subagent_type: sdd-kit:effort-high` + `model: opus`, Code with `subagent_type: sdd-kit:effort-high` + `model: sonnet`—, also in Native, where the thread dispatches them. Measured: `tests/native-adapt-red.md`. Like every dispatch, it carries its silence watch, also in the re-review: [Vigía de silencio](../../sdd-propose/references/control-profiles.md#vigía-de-silencio).

It goes out in the background as soon as the last task's commit exists, and the thread keeps working and committing while it reviews. That is why the axes don't work in the thread's tree, but in a worktree detached at the sha it reviews, `review-<id>-<sha corto>`, next to the repo's other worktrees:

```bash
SHA=$(git rev-parse --short HEAD)
REVIEW_DIR="$(dirname "$(git rev-parse --show-toplevel)")/review-<id>-$SHA"
git worktree add --detach "$REVIEW_DIR" "$SHA"
```

The package recipe runs inside `$REVIEW_DIR`, and the brief names that directory as the only one it works in, with this sentence: «Revisas `<sha>` como si fuera el último commit: trabaja solo en `<REVIEW_DIR>`, y no mires ramas ni commits posteriores (`git log` sin `--all` ni nombres de rama)». When every axis has returned, the thread removes it with `git worktree remove "$REVIEW_DIR"`. The re-review of a range `<a>..<b>` is anchored the same way, at `<b>`. Measured: ticket of feature 0027 of document-manager, §2, and `tests/closing-off-critical-path-red.md`, c1.

The thread prepares the package with this recipe, not with `sdd review package`, in both methods. `sdd review package` cuts the range from the start's base and admits no exclusions: the reviewer always reads the campaigns' evidence and, if the branch merged the integration branch, other features' work too (9 MB against 179 KB in feature 0070, 730 KB against 78 KB in 0058). In Git Bash, with `<integración>` the constitution's integration branch (`develop` if it fixes no other):

```bash
cd "$(git rev-parse --show-toplevel)"
MERGE_BASE=$(git merge-base HEAD <integración> $(git rev-parse -q --verify origin/<integración>))
EXCLUDE=(':(exclude,glob).docs/sdd/specs/**/red/**' ':(exclude,glob).docs/sdd/specs/**/green/**' ':(exclude,glob).docs/sdd/specs/<carpeta de la feature>/**')
WORKSPACE="$(sdd workspace "<plan>")"
OUT="$WORKSPACE/review-final-$(git rev-parse --short HEAD).diff"
{
  echo "# Review package: ${MERGE_BASE}..HEAD"; echo
  echo "## Commits"; git log --oneline "${MERGE_BASE}..HEAD"; echo
  echo "## Files changed"; git diff --stat "$MERGE_BASE" HEAD -- . "${EXCLUDE[@]}"; echo
  echo "## Ficheros borrados"; git diff --name-only --diff-filter=D "$MERGE_BASE" HEAD -- . "${EXCLUDE[@]}"; echo
  echo "## Diff"; git diff -U10 --diff-filter=d "$MERGE_BASE" HEAD -- . "${EXCLUDE[@]}"
} > "$OUT" && echo "$OUT"
```

The merge-base is computed at review time, also if the branch merged the base midway: the start's base drags in what the merge brought. With a remote, `git fetch` first: if the branch merged `origin/<integración>` and the local one is behind, the local base brings back other features' work; without a remote, `rev-parse` prints nothing and the local one stays. If the two have diverged, git picks a single base: sync them first. Don't use `git diff <integración> HEAD`: if the integration branch moved after the merge, it brings its new commits in reverse. In lite mode, without a plan, `<plan>` is `spec.md`. `<carpeta de la feature>` is the name of the spec's folder in `.docs/sdd/specs/`: the spec and the plan reach the Spec axis by their path, in its brief. Deleted files go by name only. With them, the reviewer's first `Read` failed on size (its field ticket, §3). If the project's tech-stack declares other evidence folders, add them to `EXCLUDE` in the same form. Without the recipe, 2 of 2 subjects put the spec's 400 lines of `red/out/` into the package, and one wrote it inside the spec's folder (`tests/final-review-package-red.md`).

After the header and before the axis brief:

```markdown
## Cómo revisar

Lee el paquete de review `<ruta del paquete que imprime la receta>` en tramos de 400 líneas con `offset` y `limit`: tiene los commits, el resumen, los ficheros borrados por nombre y el diff del resto de la rama, sin la carpeta de la spec. No rehagas el diff con git. No ejecutes la suite, el build ni el lint: la evidencia de tests la traen los informes de cada task, y la suite completa la ejecuta el hilo principal. Si crees que falta una verificación pesada, recomiéndala en tu informe.
```

With the header and without this section, 2 of 2 final reviewers redid the diff and ran the suite and the lint (`tests/proportional-review-red.md`, R2).

In the Spec axis brief, if the plan has `## Review Focus`, this section goes after «Cómo revisar»:

```markdown
## Review Focus

<copia literal de la sección `## Review Focus` del plan: todas sus líneas, enteras>

Comprueba cada línea a propósito: la entrada, el comportamiento esperado y el test o la verificación que la fija. Una línea sin test ni verificación nombrada, o cuyo código no da ese comportamiento, es un hallazgo.
```

It is what superpowers' `executing-plans` asked for («the plan's Review Focus section verbatim»), and pointing at the plan isn't enough: with the pointer («the plan has a Review Focus section, check it»), 1 of 2 briefs on Opus went out without its lines (`tests/plan-review-focus-red.md`).

## Implementer brief

It lives in [implementer-prompt.md](../../sdd-implement/references/implementer-prompt.md) of `sdd-implement`, with the same «Restricciones de código» section and, besides, the contract of the RED tests, the task's «Verificación» and the implementer's rules.
