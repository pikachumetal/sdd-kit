# Writing the spec

Inspired by superpowers `brainstorming` (MIT).

You build what you believe the user wants, and that belief is usually thinner than it feels. The interview finds out what they want and why; when you know the why, you make the hundred decisions they never mention the way they would. Ask with `sdd-grilling`. This file turns the answers into `spec.md`, traced from `spec-template.md` of `sdd-templates`: the template says what each section holds, this file says how you get there.

## What the spec covers

If neither the user nor the project says why they want it, ask that first, even if you can guess: open, «what will you do with it?», not «a spreadsheet, a colleague, a backup?». Then cover goals, non-goals, and anti-goals (what would make this a failure even if it technically works) as territory, not a script: anchor them in a concrete moment («what would make you wince if I got it wrong?»). What the user says goes to Intent; what they left unanswered, to ✋ marked «pendiente».

Write it so a builder could plan from it without going back to the user:

- **Intent**: what happens today, why it matters, what success looks like, measurable where it can be, and the anti-goals.
- **Scope**: «Entra» and «No entra», the goals and the non-goals.
- **Approach**: the approaches of «Approaches» below, what each costs, the one chosen and why, then the parts of the how it fixes.- **✋ Decisiones que he tomado yo**: every value that didn't come from the interview or the roadmap, even if it's also in a THEN. A default the user never heard is one they couldn't reject.
- **Decisiones tomadas con el dev-lead**: what the user decided, with their literal phrase.

Three things the spec carries when they apply:

- **A new capability**: if the delta creates one in `capabilities/`, declare it in the decisions with its name in English kebab-case: the slug is a file name, even if the content is in Spanish.
- **`§Frontend`**: if the feature changes what is seen and `operations.md` has no `§Frontend` —or lacks the Access and the app asks for login—, «Decisiones que he tomado yo» carries the `§Frontend` proposal with its fields filled: impeccable as detector, Playwright and the access visible in the code ([frontend-verification.md](../../sdd-implement/references/frontend-verification.md)); when the spec is approved, write it in `operations.md`. With `Detector: ninguno` already written, don't propose it again.
- **`Se valida en:`**: if a THEN depends on the integration branch, the git history, the remote or an environment the branch doesn't reproduce —a «no changes compared to `develop`» that the feature branch, which always changes something, can't give—, write under its scenario `Se valida en:` with `worktree con la base al día` or `validación post-merge con fecha`, also if the scenarios aren't in a capability delta: from the branch it can't be observed, and step 1 of `sdd-archive` prepares that environment.

Approval covers what you showed. A description you haven't written isn't approved, and choosing a scope («solo valida X») approves nothing.

## Approaches

Once you understand what the user wants, and before the sections or `spec.md`, put the ways of building it in a message of its own, also when the request already fixes what to build («decidido con el dev-lead: …»): what was decided is the what, and the how is still open: the two or three that remain after dropping the weak ones, grounded in what the project does, each with what it trades off, and the one you recommend with its reason. In `pair`, ask which way they want to go and wait. In `delegate` there is no such message, because nobody chooses: the approaches, with what each trades off and why you chose one, go to the spec's Approach, and «✋ Decisiones que he tomado yo» only names the chosen and the discarded ones («Enfoque: A, frente a B y C (ver Approach)»); the spec's stop approves them. With one sensible way, the message, or in `delegate` the Approach, says so and why the others don't fit. The approach chosen, in the message or in the ✋, is the spec's central decision.

## Design by sections

In a full feature with **4 or more tasks foreseen**, after the approaches, close the interview by presenting the design in sections before you write `spec.md`: one section per message, each as long as it needs (a few sentences up to ~250 words); only what the user said goes in as theirs: anything you filled in goes in as your proposal, with your reason; each ends with «¿va bien?». Each section opens with what changes for whoever uses the product, in plain words and with an example with data, and its question is about that: «al exportar, cada factura sale con su vencimiento: `F-2026-014 · vence 30/11`», not «añado `dueDate` a `InvoiceDto` y lo mapeo en `ExportService`». Code names, files and internal flags go after it, only if needed (the short mode of `sdd-rubber-duck`): a «sí» to a section nobody understood approves nothing. What the user corrects goes into the spec before you write it. The count is the tasks foreseen for the feature you're specifying, made when you enter this step: a lite or a patch that moved up counts here, and after a split, the piece counts, not the whole.

The sections are interview turns, inside the spec's stop, not a new stop of the profile: they apply in `pair`; in `delegate` they go to the spec's ✋ and its stop approves them. No sections with 3 tasks or fewer, in lite, in a spike, with the spec approved by delegation, in `unattended`, or once the user asks to start right away; in the last three there's no approaches message either, and the approaches go to the spec's Approach and what you'd have asked to ✋. The sections don't replace the gate: the spec is approved the same way.

## Starting right away

Never offer to skip the questions. If the user asks to start right away («empieza ya», «hazlo sin más preguntas», «no preguntes más»), stop asking: write the spec with what there is, put its gaps in ✋, and it goes through its gate as any other. Choosing a scope is not asking to start. Asking to start doesn't approve the spec: in the kit, skipping the questions removes neither the spec nor its gate.
