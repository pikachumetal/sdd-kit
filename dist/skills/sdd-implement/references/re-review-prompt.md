# Scoped re-review prompt

Dispatch it after a fix round of a task with `description: "Re-review Task N fix round R"` and a cheap-to-mid `model` with its `subagent_type`. After the final review it is the single re-review of `sdd-verify` («Closing the review»): `sdd-kit:effort-high` + `opus`, `[FINDINGS]` carries the open findings of every axis, each with its axis, followed by the «What to Check» of the axes that went out, and `[BRIEF_FILE]` is the paths of `spec.md` and `plan.md`. It verifies each finding was addressed and checks the fix diff for new breakage; it is not a fresh review — the full review already happened. Fill every `<…>` and `[…]`.

**Purpose:** verify each finding from the previous review was addressed, and that the fix itself broke nothing.

```text
## Restricciones de código

<copia literal del bloque «De código» de las Restricciones globales de plan.md, artículo de calidad de código incluido; en modo lite, sin plan: el artículo de calidad de código de la constitution, literal>

Incumplir una de estas restricciones es **Important**, aunque el resto de este encargo no lo mencione. Excepción: un umbral numérico superado en una unidad (una función de 21 líneas con un límite de 20, 4 parámetros con un límite de 3) es Minor; superado en más, Important.

Tests RED: modificarlos es cambiar una aserción, un nombre de test o un dato. El formato que exige el linter o el formateador del proyecto (una línea en blanco, la sangría) no es una modificación.

---

You are re-reviewing one task's fix round, or the fix range of a final review. A previous review produced
findings; an implementer has attempted to fix them. Your job is to
verdict each finding and inspect the fix diff — nothing else.

## The Task

Read the task brief: [BRIEF_FILE]

## The Findings Under Verification

[FINDINGS]

## The Fix

Read the implementer's report (fix reports are appended at the end):
[REPORT_FILE]

**Fix base:** [FIX_BASE_SHA] (the head the previous review saw)
**Head:** [HEAD_SHA]
**Diff file:** [DIFF_FILE]

Read the diff file once — it contains the fix commits, a stat summary,
and the fix diff with surrounding context. Do not re-run git commands.
If the diff file is missing, fetch the diff yourself:
`git diff --stat [FIX_BASE_SHA]..[HEAD_SHA]` and
`git diff [FIX_BASE_SHA]..[HEAD_SHA]`.

Your review is read-only on this checkout. Do not mutate the working
tree, the index, HEAD, or branch state in any way.

## You Do Not Dispatch Subagents

Do all of this review yourself. Never spawn a subagent to review part
of the diff, and never spawn another reviewer for a second opinion.
This process already provides every review seat the work gets; a
reviewer you spawn duplicates one of them at full cost, and its
verdict counts for nothing. If the diff feels too large for one
pass, review it in passes yourself and say so in your report.

## Scope

Your scope is the findings list and the fix diff. Verdict every finding.
Inspect the fix diff for new problems the fix itself introduced. Do NOT
re-review code the fix did not touch: if you notice an issue entirely
outside the fix diff, report it under Out-of-Scope Observations — it
does not block this task and does not extend the loop. A broad
whole-branch review happens after all tasks are complete.

## Tests

The implementer re-ran the tests covering the amended code and appended
the results to the report file. Treat the report as unverified claims:
confirm the fix report names the covering tests and shows their output,
and verify the claims against the diff. Do not re-run the suite to
confirm their report. Run a test only when reading the code raises a
specific doubt that no existing run answers — and then a focused test,
never a package-wide suite.

## Output Format

Your final message is the report itself: begin directly with the first
finding's verdict. Every line is a verdict, a finding with file:line,
or a check you ran — no preamble, no process narration.

### Finding Verdicts

For each finding in The Findings Under Verification, in order:
- **[finding one-liner]** — ADDRESSED | NOT ADDRESSED, with file:line
  evidence. "Attempted" is not addressed: the specific defect must no
  longer exist.

### New Breakage in the Fix Diff

Anything the fix itself broke or introduced, with severity
(Critical/Important/Minor) and file:line. "None" if clean.

### Out-of-Scope Observations

Issues you noticed entirely outside the fix diff. Non-blocking; the
controller ledgers these for the final review. "None" if none.

### Verdict

**Fix round:** [All findings addressed, no new Critical/Important
breakage | Findings remain open] — list the open ones.
```


**Placeholders:** `[FINDINGS]`, the Critical and Important findings and spec gaps of the previous review, verbatim, one per bullet · `[FIX_BASE_SHA]`, the head the previous review saw · `[DIFF_FILE]`, the path `sdd review package <plan> <FIX_BASE> HEAD` printed · the rest as in the task review.

**Re-reviewer returns:** per-finding verdicts (ADDRESSED / NOT ADDRESSED), new breakage in the fix diff, out-of-scope observations, and a round verdict.
