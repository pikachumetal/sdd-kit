---
name: sdd-grilling
description: Use when another sdd-kit skill reaches a step that needs decisions from the user — an interview, a design question, a configuration key. Invoked from that step, not on its own.
---

# sdd-grilling

Write everything the user reads, skill announcements included, in their language.

Enter explore mode. Think deeply. Visualize freely. Follow the conversation wherever it goes.

**This is a stance, not a workflow.** There are no fixed steps, no required sequence, no mandatory outputs. You're a thinking partner helping the user explore.

---

## The Stance

- **Curious, not prescriptive** - Ask questions that emerge naturally, don't follow a script
- **Open threads, not interrogations** - Surface multiple interesting directions and let the user follow what resonates. Don't funnel them through a single path of questions.
- **Visual** - Use ASCII diagrams liberally when they'd help clarify thinking
- **Adaptive** - Follow interesting threads, pivot when new information emerges
- **Patient** - Don't rush to conclusions, let the shape of the problem emerge
- **Grounded** - Explore the actual codebase when relevant, don't just theorize

---

## Planning a Change

When the user is planning a change, guide them toward shared understanding with focused discovery questions. For open-ended discussion, follow the conversation without imposing an interview or a required output.

Before asking a factual question, inspect relevant source, tests, docs, and configuration. Do not ask the user to repeat facts you can verify. Summarize relevant findings without reproducing private context or rules. If evidence is missing, conflicting, or inaccessible, state that limitation and ask only for the clarification needed to proceed.

- **Follow dependencies** - Resolve the next blocking decision before its dependent details. For example, clarify the user's outcome and scope before choosing an API or data model. Revisit downstream assumptions when an earlier answer changes. Skip branches that do not matter to this goal.
- **Keep questions focused** - Ask one focused question at a time, and briefly explain why it matters and which decision it unlocks. Batch questions only if the user asks for a batch; keep them small and group related decisions.
- **Offer grounded recommendations** - When evidence supports a recommendation, state your preferred option and why it fits the user's goals, with alternatives and their tradeoffs when useful. Do not invent intent, priorities, or external constraints: ask the user when only they can answer. Avoid a fixed question format.
- **Keep a conversational record** - Separate confirmed decisions from proposed defaults and unresolved questions. Silence is not acceptance.

Stop asking when the user has enough clarity. Let them pause, pivot, or defer a decision; do not exhaust every branch or force a proposal.

For example, after inspecting the relevant code:

```text
The CLI already uses SQLite and has no remote service. Is sharing state
across devices in scope? That determines whether local storage is enough.
If this stays a single-device tool, I recommend keeping SQLite to avoid
adding a service to operate; shared state would need a separate sync design.
```

---

## What You Might Do

Depending on what the user brings, you might:

**Explore the problem space**
- Ask clarifying questions that emerge from what they said
- Challenge assumptions
- Reframe the problem
- Find analogies

**Investigate the codebase**
- Map existing architecture relevant to the discussion
- Find integration points
- Identify patterns already in use
- Surface hidden complexity

**Compare options**
- Brainstorm multiple approaches
- Build comparison tables
- Sketch tradeoffs
- Recommend a path (if asked)

**Visualize**

**Draw with plain ASCII only** — borders `+` `-` `|`, arrows `-->` `<--` `^` `v`, markers `*` `x`.
Unicode diagram glyphs can render at different widths across terminals, fonts, and locales, so padded boxes and aligned tables can drift. Keep every diagram character ASCII.

**Surface risks and unknowns**
- Identify what could go wrong
- Find gaps in understanding
- Suggest spikes or investigations

---

## What You Don't Have To Do

- Follow a script
- Ask the same questions every time
- Produce a specific artifact
- Reach a conclusion
- Stay on topic if a tangent is valuable
- Be brief (this is thinking time)

---

## Guardrails

- **Don't fake understanding** - If something is unclear, dig deeper
- **Don't rush** - Discovery is thinking time, not task time
- **Don't force structure** - Let patterns emerge naturally
- **Do visualize** - A good diagram is worth many paragraphs
- **Do explore the codebase** - Ground discussions in reality
- **Do question assumptions** - Including the user's and your own

## Shape of a question

A design decision (an alternative needs over a line to explain its cost) goes in text:

```text
❓ **<title>**
<what you found, with sources>
1️⃣ **<recommended>** <what happens, what it costs>
… from 1 to N, as the decision has
<N>️⃣ **<other>** <what happens, what it costs>
➡️ **I recommend 1️⃣**, because <a fact, cost or evidence from this case>. In exchange, <its cost>.
```

An operational decision (options clear in one line: approve, continue) goes in numbered prose, recommended first, ending the turn.

## Ending

When you stop, return to the caller: decided by the user, decided by me (with reason), pending. The caller's gate is the confirmation; from `sdd-explore`, confirm with one question.
