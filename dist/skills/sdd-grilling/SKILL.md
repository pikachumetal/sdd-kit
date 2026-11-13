---
name: sdd-grilling
description: Use when another sdd-kit skill reaches a step that needs decisions from the user — an interview, a design question, a configuration key. Invoked from that step, not on its own.
---

# sdd-grilling

## Overview

Write everything the user reads, announcements included, in their language. The skill that invokes you says what its interview covers and when it stops. Inspired by `grilling` by Matt Pocock and superpowers `brainstorming` (MIT).

## Posture

Look first, decide what is method, and ask only what is left. Before each question, read what answers it: the request, its roadmap row, the project's documents and code. A method or technical question that a fact of this case settles, you decide, with that fact; one with several defensible paths is asked. Ask the user what only they know or own: who it is for, what for, scope, level and money. First the decision that reshapes most others; one depending on an open decision waits.

Every choice you make goes in as your call, never as something the user agreed to: «decided by me», with its reason. An assumption is labeled as one; what the user didn't answer stays pending.

## One decision per turn

Each turn ends with exactly one decision: one question mark in the message. Three things in one question are three («¿qué haces, y qué te falta?» is two); a question after ➡️ is a second one. Also when asked for all at once.

## Look it up

A fact that changes with versions or time (a tool's behavior, docs, a license): check the repo, the session's documentation MCP within the user's limits, then `WebSearch` or `WebFetch`, and cite the URL. Comparing with a tool the project lacks, or another version than the one here, needs the web: search before your first question, and the question cites the URL. «Unverified» only without MCP and web.

## Shape of a question

Think wide privately; drop the weak ideas and those that fight the user's why.

A design decision (an alternative needs over a line for its cost) goes in text:

```text
❓ **<title>**
<what you found, with sources>
1️⃣ **<recommended>** <what happens, what it costs>
… from 1 to N, as the decision has
<N>️⃣ **<other>** <what happens, what it costs>
➡️ **I recommend 1️⃣**, because <a fact, cost or evidence from this case>. In exchange, <its cost>.
```

- The decision sets the count: one defensible path is decided if it's method, else said and confirmed; 🔀 marks a mix you'd defend alone.
- The reason is a fact, cost or evidence from this case; with none, say «tie, it depends on X» and ask X.
- What the product's user sees or does gets a scene with data per alternative: `reservar Norte` → `Norte ocupada; en espera (1.º)`; a limit, by its effect.
- How a screen looks is shown, not described: an existing one on the app, which you start as `§Frontend` declares (live detector, or a screenshot next to the variant) and stop by PID or port; a new one, or without `§Frontend`, an Artifact; with neither, each option's scene in text and why.
- A flow or a structure easier to see than read is drawn before asking: a diagram skill (`archify` preferred), else an Artifact, else ASCII or Mermaid saying why.
- Icons mark only this question's alternatives; an answer with a foreign icon gets asked which they meant.
- An operational decision (approve, continue) goes in numbered prose, recommended first, ending the turn.

## What only the user knows

Ask it open: one sentence, one case to tell, and the question mark ends it, with no recommendation, hypothesis or examples: «¿qué pasó la última vez que lo echaste en falta?». A fact you found goes with its source and a question that ends at it: «`roles.ts` tiene `clinic_admin`: ¿es quien lo usa?». A word under _Evitar_ in «Terminology» of `PRODUCT.md`, or fitting two of its terms: name them and ask which.

## Answers

- **Challenge once**, with argument and alternative, an answer that contradicts a fact or has a better option. If the user keeps it, it's their decision: record it with their words and go on with what they asked, as asked, also when it repeats what exists.
- **«Decide for me»**: decide method with your reason; keep asking what is theirs. Discovery stays pending.
- **Rejected to clarify** («no, wait, explain»): explain in prose, with one case and its data, no options or recommendation; their answer closes it.
- **No user present**: the caller's rule; without one, decide method and leave the rest pending.

## Ending

Stop where the caller says; otherwise, when each user decision is answered or pending (they said they don't know, or left it unanswered once asked). Return: decided by the user, decided by me (with reason), pending. The caller's gate is the confirmation.
