---
name: sdd-grilling
description: Use when another sdd-kit skill reaches a step that needs decisions from the user — an interview, a design question, a configuration key. Invoked from that step, not on its own.
---

# sdd-grilling

## Overview

How the kit asks the user for decisions. Talk to the user in their language. Adapted from `grilling` by Matt Pocock (MIT, see `NOTICE`).

Ask next the open decision that reshapes the most others. Facts are your job; decisions are the user's.

## One decision per turn

End each turn with exactly one decision. «Three things, together in one question» is three. «Also tell me…» after the question is a second one. If the user asks for everything at once, do that for this session. Don't ask what the request already says or delegates, or what the project shows.

## Look it up before asking

If a decision depends on a fact that changes with versions or time (how a tool behaves in the project's version, what its docs recommend, what a license requires), look it up first: the repo, the session's documentation MCP within the user's call limits, then the web. Cite the source. «I remember it but haven't checked» means you skipped this. If you can't look it up, say so and mark it unverified.

## Shape of a question

A design decision (an alternative needs more than one line to understand its cost) goes in text:

```text
❓ **<title>**
<what you found, with sources>
🅰️ **<recommended>** <what happens, what it costs>
🅱️ **<other>** <what happens, what it costs>
➡️ **I recommend 🅰️**, because <a fact, cost or evidence from this case>. In exchange, <its cost>.
```

- Three or more: 1️⃣ 2️⃣ 3️⃣; a defensible mix: 🔀. Offer every alternative you would defend, and none you wouldn't.
- «They're the defaults» or «it's simpler» is not a reason. With no reason to prefer one, say «tie, it depends on X» and ask X.
- A decision about what the product's user sees or does gets a scene with data per alternative: `reservar Norte lun 10:00-12:00` → `Norte ocupada; te apunto en espera (1.º)`. Tell limits by their effect, not their cause. How a screen looks or feels: offer a sketch or throwaway prototype instead of asking.
- Icons mark only this question's alternatives; name earlier ones.
- An operational decision (each option clear in one line: approve, continue) goes with `AskUserQuestion`, recommended first.

## Discovery

What only the user knows (who uses it, what problem it solves) is asked open: no recommendation, hypothesis or menu of examples. If you found a fact (`roles.ts` has `clinic_admin`), show it with its source and ask to confirm.

## Answers

- **Challenge once.** If an answer contradicts a fact or you see something better, say so once, with the argument and the alternative. If the user keeps it, accept it.
- **«Decide for me»**: decide method and technical questions with your reason; keep asking only what is the user's (scope, level, money, per `control-profiles`). Discovery stays **pending**: proposing «small clinics with paper agendas» for approval is inventing it.
- **Rejected to clarify** («no, wait, explain»): explain in prose. Their answer closes it; don't re-present it with options.
- **No user present**: don't ask; decide method, leave the rest pending.

## Ending

Stop when no decision is left. Return three lists to the caller, in the user's language: decided by the user, decided by me (with reason), pending. The caller's gate is the confirmation; from `sdd-consult`, confirm with one question.
