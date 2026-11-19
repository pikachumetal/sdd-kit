---
name: sdd-spec-writing
description: Use when sdd-propose hands off a feature, a lite or a spike, to interview the user and write spec.md, then hand it to sdd-spec-approval. Invoked from there; not the entry of a change (that is sdd-propose).
---

<!-- kit: 0359 · sustituye: «# Brainstorming» -->
# sdd-spec-writing
<!-- kit: incluye user-language -->
<!-- kit: incluye phase-notice -->
Forked from `brainstorming` of superpowers (MIT, see `NOTICE`); the text is the source's, changed only where the kit works differently.

You are very good at building. You build what you believe your human
partner wants, and that belief is usually thinner than it feels. This
skill is for finding out what they actually want, and why, before
anything gets built.

People often haven't finished working out what they want. Good questions
help them think it through. When you understand the why, you make the
hundred decisions they never mention the way they would have made them.

## First: What Do You Actually Know?

Before you reply, ask yourself: what do I know about what they want, and
why?

<!-- kit: 0359 · sustituye: «- **Everything that matters…Start the conversation.» -->
`sdd-propose` already classified this as a feature, a lite or a spike: there's no quick task to just do. Sort what the change needs into three piles, named in the user's language when you show them («contestado», «menor», «del dev-lead»):

- **answered**: the request, its «Decisiones ya tomadas», the roadmap row or the project say it, and nothing contradicts it. Use it; don't ask.
- **minor**: a sensible builder would settle it without changing what gets built (a name, a file, the order of the tasks, an approach the project decides). Decide it with the project; if it shows in the spec, it goes to ✋.
- **the dev-lead's**: only they can answer it, and the answer changes the spec, the approach or the tasks: the why first, open, even if you can guess («what will you do with it?», not «a spreadsheet, a colleague, a backup?»); then the done criterion, the goals, non-goals and anti-goals; a contradiction between the request and the project, and whatever the request asks you to ask. Ask it in `pair` and in `delegate`: the profile isn't a «decide for me».

Every point under «Abierto» of a launch prompt goes to the dev-lead's pile, a method one too: its proposal isn't a decision, and «it's method, and in `delegate` I decide it» doesn't take it out, because the prompt left it open for the dev-lead. «The technique imposes it» doesn't take a point out of the dev-lead's pile either when it changes what the user sees: an approach fixed in the request that orders the days with `sort()` puts `jue` before `lun`, and that order is theirs. Each point you don't ask carries one line of why that names where it comes from: the prompt's line, the file or the rule; «it's technical» or «the project decides it» without saying where is no reason. What the user says goes to Intent; what they leave unanswered or can't answer, to ✋ marked «pendiente», even the value you chose.
<!-- kit: fin -->

Before you start implementing, you must, in order:

1. Lay out the approaches in a message of their own, and have your
   human partner pick one (see Lay out the approaches).
<!-- kit: 0359 · sustituye: «Write the design doc, short or full (see Size the Work).» -->
2. Write `spec.md` (see The Written Design), and invoke `sdd-spec-approval` with `Skill` in the same turn: its coherence pass, its review and the gate.
<!-- kit: fin -->
3. Get their approval of that doc.
<!-- kit: 0359 · sustituye: «Invoke the superpowers:writing-plans skill.» -->
4. Once approved, `sdd-spec-approval` hands off: to `sdd-plan-writing` in full and spike, to `sdd-implement` in lite.

<!-- kit: 0359 · sustituye: «If nothing is open…a spike they said yes to (see Spike to…opted out of…questions.» -->
With nothing in the dev-lead's pile, step 1 and the short design go in your first message, and step 3 is still the gate after `spec.md` (see Your First Message).
<!-- kit: fin -->

## Look Before You Ask

In an existing project, or when they've given you context (a spec, a plan,
a handoff, files they pointed at, earlier conversation), dig in before your
first message. Read what they referred to and the code or material it
connects to, and keep reading until you can explain how the relevant
parts work today and what this change would touch. Never ask what the
project or their context already answers, or reopen what they've
already decided.

## Your First Message

<!-- kit: 0359 -->
Before your first question, invoke `sdd-grilling` with `Skill`: every question follows it. Your first message after classifying is the understanding note («what I understood, correct me») and the three piles, in one message; the piles aren't repeated later. ⛔ No `spec.md` until this message has gone out and the turn has ended, also with the dev-lead's pile empty: then it ends in the short design to confirm. Only nobody to answer (below) skips it; «my pile is empty, so I write the spec» is the failure this message exists for.

Move the work forward, with one of these:

- **They've already said what they want** (a spec, a plan, a detailed
  request): aim for about 200 words for the whole message. Echo their
  request back in your own words, so they can see whether you've got its
  shape: what they want, who it's for, and why, as far as they've said.
  Add what you found that bears on it: how the relevant parts work today
  and what the change would touch. If you found something they may not
  have considered that would change what they're asking for or how it
  has to be built, like a constraint, a conflict, or a cheaper path, say
  so plainly. How to build it comes later, once you understand what they
  want (see Lay out the approaches). End with one line inviting
<!-- kit: 0359 -->
  corrections. Then the three piles, each point outside the dev-lead's
  with its line of why; the dev-lead's points are named, not asked, and
  the turn's one question mark is the question below. Then, if they haven't told you why they want it,
  even if you can guess, ask about that: one open question in their own
  terms, with nothing to pick from. If they have told you, and their request
<!-- kit: fin -->
  and the project leave open something whose answer would change what
  gets built, ask about the one that would change it most; when its
  choices can be named, sketch each concretely, with what it trades off
<!-- kit: 0359 · sustituye: «pick.…go on to the plan.» -->
  and which you'd pick; a point of «Abierto» is asked quoting its
  proposal as the prompt's, not as decided. If the dev-lead's pile is
  empty, end with the short design itself (the approach chosen in one
  line, why the others don't fit, and the design in a few lines) and ask
  them to confirm it; in `pair`, this message is also the approaches
  message: it carries them whole and asks which. Their confirmation covers
  the approach and the design, not the spec: write `spec.md` with them,
  and it goes through its gate.
<!-- kit: fin -->
  Specs are often incomplete, so confirm before you build on one.
- **They haven't:** one open question, in their own terms, about the
  biggest thing their request leaves unsettled. Say why you're asking:
  what the answer would change about what you build. For "a website for
  my bakery": "If it's mostly for people deciding whether to stop by,
  I'd lead with hours and what's in the case today; taking orders is a
  different site. What do you want someone to do when they land on it?"

<!-- kit: 0359 · sustituye: «How the message ends depends…through the normal workflow.» -->
The message ends with the first question of the dev-lead's pile, or with the short design to confirm; never with an offer to skip the questions. With nobody to answer —the spec approved by delegation, «empieza ya», or `unattended`— there's no piles message and no stop: what the dev-lead's pile holds goes to ✋ marked «pendiente», each point with its why, or the feature is parked in `unattended`.
<!-- kit: fin -->

<!-- kit: 0359 -->
In a feature or a spike, your first message —this one or, with nobody to answer, the first you write— opens with the announcement of `sdd-propose`, when it hasn't gone out yet:
<!-- kit: incluye announcement -->
<!-- kit: fin -->

That's the whole message.

## The Conversation

Ask a question only when the answer would change what gets built and
neither the request nor the project answers it. Otherwise, state your
call and your reason as a proposal they can correct, and move the work
forward. Process steps are always your calls: writing things up, where
files go, looking further, how to show something. Do them and say so.
<!-- kit: 0359 · sustituye: «one at a time.» -->
Ask with `sdd-grilling`. Use plain language, pitched just a little above where
<!-- kit: fin -->
your human partner is. Match their vocabulary; never use process jargon.
You never need to quote this skill to your human partner.

Be clear and concise. Lead with what matters. Avoid jargon. When you
report what you found, give them the most important findings and offer
the rest.

**Get them describing.** Until you know why they want it, ask open
questions, with no example answers attached. Their own words carry
<!-- kit: 0359 · sustituye: «Once you know why,…something concrete.» -->
intent that your options can't. How each question is asked —one per turn, the options with what each trades off and your pick— and what stays pending are `sdd-grilling`'s rules.

**How it gets made.** Every project rests on choices about medium, tools,
materials, and resources: the platform, programming language, and
libraries for an app; the medium for a piece of art. Read from how they
talk which of those choices they want to make. Someone who raises the how
or asks about trade-offs wants the options with your pick. Someone who
talks about outcomes is handing you the how: make those calls and state
each in a line. When there's existing work, build on what it already
uses. Any choice you make goes in the design as your call, never as
something they agreed to.

**Ground to cover.** This is territory, not a script. Never read these
out as questions:

- what kind of thing this is, and what makes it special
- why now, and what success looks like to them
- goals, non-goals, and anti-goals (what would make this a failure even
  if it technically works)
- prior art: what they've seen elsewhere, loved or hated
- current state: what exists now, what they've tried
- the details they care about

<!-- kit: 0359 -->
Anchor them in a concrete moment: «what would make you wince if I got it wrong?».

**Make every question specific** to their project and what they've told
you. Ask Socratically, the way a sharp colleague would: build each
question on their last answer or on something you found, so it helps
them think through a consequence or a case they may have missed
("Voting closes before the meeting, and two members joined this month.
Does someone who joins mid-round get a vote?"). When the reason isn't
already plain, say what you're hoping to learn or what the answer would
change. A proposal they can correct, plus your reason for it, often
beats a question.

**Do recon.** Once you have a bit of grounding and looking further
would help, go look: deeper into their codebase or project, their own
files and data, or the web. Say what you looked for and what you found.

**Lay out the approaches.** Once you understand what they want, and
before you write anything up, put the ways of building it in a message
<!-- kit: 0359 · sustituye: «own.» -->
of its own, also when the request already fixes what to build («decidido con el dev-lead: …»): what was decided is the what, and the how is still open. Come up with several real alternatives and drop the weak
<!-- kit: fin -->
ones, including any that work against why they want it and any the
existing work rules out. Sketch the two or three that remain concretely
enough to picture, grounded in what the project actually does, with what
each trades off. Recommend one and say why, then ask which way they want
<!-- kit: 0359 · sustituye: «go; if they've…pick instead.» -->
to go, and wait. In `delegate`, no such message: the approaches, with what each trades off and why you chose one, go to the spec's Approach, and «✋ Decisiones que he tomado yo» only names the chosen and the discarded ones («Enfoque: A, frente a B y C (ver Approach)»); the spec's stop approves them. The approach chosen is the spec's central decision. When there's genuinely one sensible way, say so in that
<!-- kit: fin -->
message and explain why the others don't fit; the design comes in the
next one. This is for how it gets built; for what they want, get them
describing first.

<!-- kit: 0359 · sustituye: «Offer the visual companion…they can click.» -->
**Show, don't tell.** Whenever seeing would help more than reading,
sketch it in text: a few lines of what they'd see. How to show the rest —a scene with data, a screen, a flow— is `sdd-grilling`'s rule.

<!-- kit: 0359 · sustituye: «Agentic work is waterfall,…back into the conversation.» -->
**Spike to feel things out.** A quick throwaway build is often the cheapest way to learn what
they want or whether something works. In the kit that's the spike lane: `sdd-propose` classifies it, and its spec carries the question and the measured evidence, with no production code.

## Play It Back

<!-- kit: 0359 · sustituye: «Play back as you go.…through the whole conversation; the last chunk covers whatever is left.» -->
In a full feature with **4 or more tasks foreseen**, after the approaches, close the interview by presenting the design in sections before you write `spec.md`: one section per message, each as long as it needs (a few sentences up to ~250 words). The count is the tasks foreseen for the feature you're specifying, made when you enter this skill: a lite or a patch that moved up counts here, and after a split, the piece counts, not the whole.
<!-- kit: fin -->

Only what they said goes in as theirs. Anything you filled in goes in
as your proposal, with your reason. End each chunk by asking what's wrong
<!-- kit: 0359 · sustituye: «or missing.» -->
or missing: each section ends with «¿va bien?».
<!-- kit: fin -->

<!-- kit: 0359 · sustituye: «Before you send a chunk,…put a mockup next to the description.» -->
Each section opens with what changes for whoever uses the product, in plain words and with an example with data, and its question is about that: «al exportar, cada factura sale con su vencimiento: `F-2026-014 · vence 30/11`», not «añado `dueDate` a `InvoiceDto` y lo mapeo en `ExportService`». Code names, files and internal flags go after it, only if needed (the short mode of `sdd-rubber-duck`): a «sí» to a section nobody understood approves nothing. What the user corrects goes into the spec before you write it.

The sections are interview turns, inside the spec's stop, not a new stop of the profile: they apply in `pair`; in `delegate` they go to the spec's ✋ and its stop approves them. No sections with 3 tasks or fewer, in lite, in a spike, with the spec approved by delegation, in `unattended`, or once the user asks to start right away; in the last three there's no approaches message either, and the approaches go to the spec's Approach and what you'd have asked to ✋ marked «pendiente». The sections don't replace the gate: the spec is approved the same way.
<!-- kit: fin -->

## Size the Work

<!-- kit: 0359 · sustituye: «Once you understand…written design (below) |» -->
Splitting was `sdd-propose`'s question; the lane sets the size.
<!-- kit: fin -->

Short or full, the design doc has an **Approaches** part: the two or
three ways you considered building it, what each trades off, which one
they picked, and why. They pick in the conversation, before you write
the doc.

If it grows mid-task, stop, say so, and step up a size.

<!-- kit: 0359 · sustituye: «projects,…one at a time.» -->
If this is really several independent features, say so: splitting goes back to `sdd-propose`'s question, with their own roadmap rows.

## The Written Design

Write a plain document a talented builder in the domain could plan
from without going back to your human partner. Cover:

<!-- kit: 0359 · sustituye: «- intent and the why…what's left to the builder» -->
- **Intent**: what happens today, why it matters, what success looks like, measurable where it can be, and the anti-goals.
- **Scope**: «Entra» and «No entra», the goals and the non-goals.
- **Approach**: the approaches, what each costs, the one chosen and why, then the parts of the how it fixes.
- **✋ Decisiones que he tomado yo**: every value that didn't come from the interview or the roadmap, even if it's also in a THEN. A default the user never heard is one they couldn't reject.
- **Decisiones tomadas con el dev-lead**: what the user decided, with their literal phrase.
<!-- kit: fin -->

<!-- kit: 0359 · sustituye: «For a small change,…the builder check.» -->
What the spec carries when it applies —a new capability with its English kebab-case name, the `§Frontend` proposal, `Se valida en:`— is in the help blocks of `spec-template.md`.
<!-- kit: fin -->

<!-- kit: 0359 · sustituye: «**Where it goes:**…override both.» -->
**Where it goes:** create the folder with the id `sdd-propose` reserved (naming and predicate modules in [nombrado.md](../sdd-propose/references/nombrado.md)) and `spec.md` traced from `spec-template.md` of the `sdd-templates` skill, with `mode: full | lite | spike` in the frontmatter.

<!-- kit: 0359 · sustituye: «**Builder check** (for a project):…read the document as that builder yourself.» -->
**Then the approval**: with `spec.md` written, invoke `sdd-spec-approval` with `Skill`, in the same turn. ⛔ No gate, review or plan of your own: they are its. It runs the coherence pass, invokes `sdd-spec-review`, folds in its findings and takes the spec through its gate.

<HARD-GATE>
<!-- kit: 0359 · sustituye: «your human partner…for a project.» -->
Nothing gets built until the user approves `spec.md` at the gate of `sdd-spec-approval`.
<!-- kit: fin -->
Building includes writing product code, scaffolding, installing
dependencies, creating projects, and invoking an implementation skill.
Reading and exploring are fine.

<!-- kit: 0359 · sustituye: «Two exceptions.…superpowers:writing-plans» -->
Asking to start right away doesn't remove the gate (see Starting right away). After the approval, `sdd-spec-approval` hands off to the plan or to `sdd-implement`, and no other skill.
<!-- kit: fin -->
</HARD-GATE>

## Red Flags

| Thought | Reality |
|---------|---------|
| "I'll offer a menu of what they might want" | Options steer. Ask them to describe it first. |
| "I'll fill in sensible defaults" | Good. Say them out loud. A default they never heard is one they couldn't reject. |
| "I've answered their questions, so I'll write the doc" | Lay out the approaches first, in a message of their own (or, when nothing was open from the start, in your first message's short design). |
| "I should explain the process first" | Ask your question. The process shows itself. |
| "They said 'sounds good' to the idea" | Approval covers what you showed them. A design doc you haven't written isn't approved. |
<!-- kit: 0359 · sustituye: «"The spike works,…Back through the gate. |» -->
| "My pile is empty: nothing to show, I'll write the spec" | The piles go in your first message whatever they hold; with the dev-lead's empty, it ends in the short design to confirm. `spec.md` before that message is the failure. |
| "I'll document the decision in the spec instead of waiting" | A question of the dev-lead's pile waits for the answer; what goes to ✋ unanswered is marked «pendiente». |

<!-- kit: 0359 · sustituye: «## Visual Companion…before starting the server.» -->
## Starting right away

Never offer to skip the questions. If the user asks to start right away («empieza ya», «hazlo sin más preguntas», «no preguntes más»), stop asking: write the spec with what there is, put its gaps in ✋ marked «pendiente», and it goes through its gate. Choosing a scope is not asking to start. Asking to start doesn't approve the spec: in the kit, skipping the questions removes neither the spec nor its gate.
<!-- kit: fin -->
