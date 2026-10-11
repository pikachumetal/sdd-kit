# Writing the spec

Adapted from superpowers 7.0.0 `brainstorming` (MIT, see NOTICE).

You build what you believe the user wants, and that belief is usually thinner than it feels. The interview finds out what they want and why; when you know the why, you make the hundred decisions they never mention the way they would. Ask with `sdd-grilling`: one decision per turn, the recommended option first. This file turns the answers into `spec.md`, traced from `spec-template.md` of `sdd-templates`: the template says what each section holds, this file says how you get there.

## What the spec covers

Write it so a builder could plan from it without going back to the user:

- **Intent**: what happens today, why it matters, what success looks like.
- **Scope**: «Entra» and «No entra», the goals and the non-goals.
- **Approach**: the parts of the how the user decided, as they decided them. What's left to the builder belongs to the plan.
- **✋ Decisiones que he tomado yo**: every value that didn't come from the interview or the roadmap, even if it's also in a THEN. A default the user never heard is one they couldn't reject.
- **Decisiones tomadas con el dev-lead**: what the user decided, with their literal phrase.

Approval covers what you showed. A description you haven't written isn't approved, and choosing a scope («solo valida X») approves nothing.

## Starting right away

Never offer to skip the questions. If the user asks to start right away («empieza ya», «hazlo sin más preguntas», «no preguntes más»), stop asking: write the spec with what there is, put its gaps in ✋, and it goes through its gate as any other. Choosing a scope is not asking to start. Asking to start doesn't approve the spec: in the kit, skipping the questions removes neither the spec nor its gate (`tests/superpowers-700-red.md`).
