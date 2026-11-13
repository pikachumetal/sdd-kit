# Closing the review

**Sort the findings before you act on any of them.** The reviewer's severity labels are advice; the gate is yours. Its «Declined to judge» list is yours too: every line there is a ruling you make and ledger, exactly like a plan conflict — `Final: Ruling: <behavior the reviewer set aside> — <what a reasonable person using this software gets, and why that stands or why it is now a finding> — <cost if wrong>`. Re-grade first, inside each axis, by effect: the spec is a vision document, and a finding's grade is what a reasonable person using this software gets if it ships, not whether the spec names the input that triggers it — a reviewer who set a finding at Minor because the spec was silent has graded the spec, not the effect. Then:

- **Critical and Important** enter the fix pass.
- A **«no verificado»**: verify it yourself before the validation, or adjudicate it with `Final: Ruling:`.
- **Minor**, with `"review": {"minors": "fix"}` in `sdd-kit.json`, enters the fix pass with them, without asking, and its ledger line is the one of «Native» below. Any other value, or no key, it goes to the ledger as `Final: minor (deferred): <one-liner>` and to your final message under «Deferred minors»: deferred Minors never enter the fix pass, and never become rulings — a ruling is a decision about a conflict, not a note that you declined a polish suggestion.

**Native:** fix the Critical and Important findings of every axis, and the Minor ones with `review.minors: fix`, yourself — you are the implementer here — in ONE pass. Each fix is verified by TDD —write the test that reproduces the finding, watch it fail, make it pass, then run the whole suite— or, when no test can reproduce it (a Minor: a name, a wording), by the whole suite alone, and goes to the ledger as `Final: fixed <finding> — <test name> RED→GREEN, suite <N>/<N>` or, without a test, `Final: fixed <finding> — suite <N>/<N>`. A suite that is not green after the pass means the pass is not over. A finding you decide not to fix is a ruling — `Final: Ruling: <finding> — <why the code stands> — <cost if wrong>` — and reaches the user in the rulings list. There is no second fix pass.

**SDD:** if the final review returns findings, dispatch ONE fix subagent with the complete findings list of every axis — not one fixer per finding. Per-finding fixers each rebuild context and re-run suites; a real session's final-review fix wave cost more than all its tasks combined. Its scoped re-review is the single re-review below: don't dispatch another for the fix wave. There is no second fix wave.

In both, the reproduce-before-fixing rule of the [fix loop](../../sdd-implement-subagent/references/fix-loop.md) applies.

**The single re-review.** In the turn you commit the fix pass, before the validation or the closing, dispatch ONE re-review in the background, with its silence watch: `sdd-kit:effort-high` + `opus`; the header of [encargo-revision.md](encargo-revision.md) and [re-review-prompt.md](../../sdd-implement-subagent/re-review-prompt.md), filled as its first paragraph says; over `sdd review package <plan> <last reviewed> HEAD`, in its own detached worktree at `HEAD`. It covers `<last reviewed>..HEAD`; a later commit goes as «A re-review never opens another» says. Write `Re-revisión: <last reviewed>..<head>, sdd-kit:effort-high + opus, <verdict>` in `tasks.md`. A `Re-revisión:` line already in `tasks.md` means it went out: never dispatch another. If, since the last reviewed sha, you only have commits you review in the thread (`sdd-implement`, «Every commit of yours»), don't dispatch it.

**What it leaves open:**

- **A Critical, or an Important the fix pass brought in (its lines, or the re-review says so), is never adjudicated.** Fix it yourself: the test that reproduces it fails first, then the whole suite. It reaches ✋ as `sin revisar: <sha> — <what it fixes>`. If fixing it changes the spec, it is a deviation: stop (`sdd-implement`, «Deviations and rulings»).
- Any other Important or Minor: adjudicate it with `Final: Ruling: <finding> — <why it stands or waits> — <cost if wrong>`, and it reaches ✋ in the presentation and walkthrough.

**A re-review never opens another.** A commit after it —a fix the validation asked for— is reviewed in the thread if `sdd-implement`'s «Every commit of yours» allows it (`revisado en el hilo: <sha> · <files> · <n> líneas`); any other goes to ✋ as `sin revisar: <sha> — <what it changes>`, in any profile and with any `validation.mode`. If no re-review went out yet (a clean review, no fixes), that commit opens it, and it is the only one. While a `sin revisar` or a «no verificado» is unresolved, neither the `Validación en campo:` line nor the walkthrough says the review was clean: they say how many are left («…, 1 sin revisar»).

| Excuse | Reality |
| --- | --- |
| "The commit after the re-review isn't covered: it needs its own re-review" | That is how a feature chained three re-reviews. It goes to ✋ as `sin revisar`; a re-review never opens another. |
| "This re-review is small: a cheap model is enough" | The single re-review is the closing's only fresh eyes on the fix pass: `sdd-kit:effort-high` + `opus`. |

**The last reviewed sha.**
<!-- kit: incluye last-reviewed-sha -->
A `Revisión final:` line in the 2.x format (`Revisión final: sdd-kit:effort-high + opus, <verdict>, sobre <sha>`, without axes) counts as the final review, and the range starts at its `sobre`, with the fix pass inside.

**`tasks.md`.** When the axes return, write `Revisión final: Spec opus+high, <verdict> · Código sonnet+high, <verdict> · Arquitectura <opus+high, <verdict> | no (plan)>, sobre <sha corto>`, with the `HEAD` they reviewed (without `tasks.md`, in the validation's presentation). A raised axis reads `Arquitectura opus+high, <verdict> (subido: <reason>)`, and a check an axis couldn't make adds `, <n> sin verificar` to its verdict. After the fix pass, `Pasada de fix: <sha corto>, <n> hallazgos RED→GREEN`. At most one `Re-revisión:` line.
