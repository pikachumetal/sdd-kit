# Learnings to living docs

Step 3 of `sdd-archive`, `Feature only:`. Each learning of the walkthrough goes where it lives: the walkthrough is a dead record for the next tasks.

## Where each one goes

| Learning | Destination |
| --- | --- |
| A new convention | `steering/constitution.md` |
| A structural change | `steering/architecture.md` |
| A version or a tool | `steering/operations.md` |
| A change of observable behavior | the spec's delta, merged into `capabilities/<capability>.md` with `sdd capability merge` (step 3 of `SKILL.md`) |

An anchor document says where the technical piece is and links the capability. A behavior value (a time, a limit, a quota, a warning) lives in `capabilities/` and nowhere else, even if the plan asks to document it: two copies diverge at the first `MODIFIED`.

## A destination that doesn't exist

An `architecture.md` postponed at init, for example: create it from its template in `sdd-templates` (`architecture-template.md`, `constitution-template.md`, `operations-template.md`), put the learning there and say it in the close's final report: «`<documento>` no existía: creado desde la plantilla». Never move it in silence to another document that exists: in `tests/postponed-anchor-red.md`, 0 of 4 agents warned, three put it in another anchor document and one created the anchor with an invented form. A destination with no template isn't invented: say it in the report and add a debt row. «It shows in the code» doesn't tell the next feature where new things go.

## A destination at its word cap

Before writing a learning into a document with a word cap, `git fetch` and measure the document as the closing's sync merge will leave it (`origin/<integration>`'s version with the branch's changes) plus the learning, against the cap on `origin/<integration>` (`git show origin/<integration>:<the file that sets the cap>`), not the branch's. If it doesn't fit, a rule of a skill with a battery (`tests/batteries/<skill>/`) goes to that battery's provenance; otherwise the oldest piece that already lives elsewhere leaves and the learning enters, without asking: its other home keeps it. With no such piece, ask (`unattended`: «Por triar» of the debt). The cap doesn't rise, and §5 of the walkthrough says where the learning went.

## A workaround

A workaround you write into `operations.md` —a setting that dodges a defect without fixing it— gets its own debt row too, with a link to the line: a workaround recorded as a decision never reaches the debt.
