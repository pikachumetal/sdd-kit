---
name: sdd-grilling
description: Use when another sdd-kit skill reaches a step that needs decisions from the user — an interview, a design question, a configuration key. Invoked from that step, not on its own.
---

# sdd-grilling

## Overview

Write everything the user reads, announcements included, in their language. Your caller says what the interview covers and when it stops. Inspired by `grilling` by Matt Pocock and superpowers `brainstorming` (MIT).

Grill relentlessly until nothing is left silently assumed: every assumption becomes a question or a «decided by me» entry with its reason, never something the user agreed to; what they didn't answer stays pending. First the decision that reshapes most others; one depending on an open decision waits.

## One decision per turn

End each turn with exactly one decision: one question mark in the message. «Three things, together in one question» is three; a question after ➡️ or «also tell me…» is a second one. Also if asked for everything at once. Skip what the request says or delegates, or the project shows.

## Look it up before asking

If a decision depends on a fact that changes with versions or time (a tool's behavior in the project's version, its docs, a license), look it up first: the repo, the session's documentation MCP within the user's limits, then `WebSearch` or `WebFetch`. Cite the source. If it needs a web search, use a subagent and keep asking what doesn't depend on it. «I remember it, haven't checked» or trying another version than the project's means you skipped this. «Unverified» only when the session has neither the MCP nor the web.

## Shape of a question

Before you propose anything, think wide privately: several ideas, drop the weak ones, including any that fight what the user has told you about why.

A design decision (an alternative needs over a line to explain its cost) goes in text:

```text
❓ **<title>**
<what you found, with sources>
1️⃣ **<recommended>** <what happens, what it costs>
… from 1 to N, as the decision has
<N>️⃣ **<other>** <what happens, what it costs>
➡️ **I recommend 1️⃣**, because <a fact, cost or evidence from this case>. In exchange, <its cost>.
```

- The decision sets the count: one defensible path: say it, confirm it; 🔀 marks a mix defensible alone. A habitual mix is filler, like one you say «I don't think you want».
- «They're the defaults» or «it's simpler» is not a reason. With no reason to prefer one, say «tie, it depends on X» and ask X.
- A decision about what the product's user sees or does gets a scene with data per alternative: `reservar Norte` → `Norte ocupada; en espera (1.º)`. Tell limits by their effect, not their cause.
- For how a screen looks or feels, show it instead of asking: if the screen exists, on the running app with what `§Frontend` declares (the live detector, or a screenshot of the current screen next to the variant); if it doesn't, or without `§Frontend`, an Artifact with the options. Without the app or the Artifact tool, describe each option's scene in text and say why you can't show it. «I haven't started the app» is not a reason: start it as `§Frontend` says, and stop what you started.
- **A flow** (states, a process) or a structure easier to see than read (a timeline, a map) is drawn before asking, never a list or a table: a diagram skill if the session has one (`archify` preferred), else an Artifact; without either, an ASCII or Mermaid block, saying why it isn't drawn.
- Icons mark only this question's alternatives; name earlier ones. If the user answers with an icon this question doesn't have, ask which one they meant.
- An operational decision (options clear in one line: approve, continue) goes in numbered prose, recommended first, ending the turn.

## Discovery

What only the user knows (who uses it, what problem it solves) is asked open: no recommendation, hypothesis or example menu («por ejemplo…»). A fact you found (`roles.ts` has `clinic_admin`): show it with its source and a question that ends at it, with no examples. A user's word under _Evitar_ in «Terminology» of `PRODUCT.md`, or fitting two of its terms: name them and ask which they mean.

## Answers

- **Challenge once.** If an answer contradicts a fact or you see something better, say so once, with argument and alternative. If the user keeps it, it's their decision: record it in their words and go on as asked, even if it repeats what exists.
- **«Decide for me»**: decide method and technical questions with your reason; keep asking only what is the user's (scope, level, money). Discovery stays **pending**: proposing «small clinics with paper agendas» for approval is inventing it.
- **Rejected to clarify** («no, wait, explain»): explain in prose, with one case and its data, no options or recommendation; their answer closes it.
- **No user present**: follow the caller's no-user rule; else don't ask, decide method, leave the rest pending.

## Ending

Stop where the caller says; otherwise, when each user decision is answered or pending (they said they don't know, or left it unanswered once asked). Return: decided by the user, decided by me (with reason), pending. The caller's gate is the confirmation.
