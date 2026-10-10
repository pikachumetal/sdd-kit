---
name: sdd-grilling
description: Use when another sdd-kit skill reaches a step that needs decisions from the user — an interview, a design question, a configuration key. Invoked from that step, not on its own.
---

# sdd-grilling

## Overview

Write everything the user reads, skill announcements included, in their language. Adapted from `grilling` by Matt Pocock (MIT, see `NOTICE`).

Grill relentlessly until nothing is left silently assumed: every assumption becomes a question or a «decided by me» entry. Ask next the decision that reshapes most others; one that depends on a decision still open waits. Facts are your job; decisions are the user's.

## One decision per turn

End each turn with exactly one decision. «Three things, together in one question» is three; a question after ➡️ or «also tell me…» is a second one. If the user asks for everything at once, do so this session. Skip what the request says or delegates, or the project shows.

## Look it up before asking

If a decision depends on a fact that changes with versions or time (a tool's behavior in the project's version, its docs, a license), look it up first: the repo, the session's documentation MCP within the user's call limits, then the web. Cite the source. If it needs a web search, use a subagent and keep asking what doesn't depend on it. «I remember it, haven't checked» or trying another version than the project's means you skipped this. «Unverified» only when the session has neither the MCP nor the web.

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

- The decision sets the count: one defensible path: say it, confirm it; 🔀 marks a mix defensible alone. A habitual mix is filler, like one you say «I don't think you want».
- «They're the defaults» or «it's simpler» is not a reason. With no reason to prefer one, say «tie, it depends on X» and ask X.
- A decision about what the product's user sees or does gets a scene with data per alternative: `reservar Norte` → `Norte ocupada; en espera (1.º)`. Tell limits by their effect, not their cause. For how a screen looks or feels, offer a sketch instead of asking.
- Icons mark only this question's alternatives; name earlier ones. If the user answers with an icon this question doesn't have, ask which one they meant.
- An operational decision (options clear in one line: approve, continue) goes with `AskUserQuestion`, recommended first.

## Discovery

What only the user knows (who uses it, what problem it solves) is asked open: no recommendation, hypothesis or example menu. A fact you found (`roles.ts` has `clinic_admin`): show it with its source and ask to confirm.

## Answers

- **Challenge once.** If an answer contradicts a fact or you see something better, say so once, with argument and alternative. If the user keeps it, accept it.
- **«Decide for me»**: decide method and technical questions with your reason; keep asking only what is the user's (scope, level, money). Discovery stays **pending**: proposing «small clinics with paper agendas» for approval is inventing it.
- **Rejected to clarify** («no, wait, explain»): explain in prose. Their answer closes it; don't re-present it with options.
- **No user present**: follow the caller's no-user rule; else don't ask, decide method, leave the rest pending.

## Ending

Stop when no decision is left. Return to the caller: decided by the user, decided by me (with reason), pending. The caller's gate is the confirmation; from `sdd-explore`, confirm with one question.
