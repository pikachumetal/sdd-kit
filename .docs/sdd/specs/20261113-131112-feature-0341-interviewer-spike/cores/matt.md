---
name: sdd-grilling
description: Use when another sdd-kit skill reaches a step that needs decisions from the user — an interview, a design question, a configuration key. Invoked from that step, not on its own.
---

# sdd-grilling

Write everything the user reads, skill announcements included, in their language.

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree one question at a time. The **frontier** is every decision whose prerequisites are already settled: the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask one question from the frontier per turn and give your recommended answer. Then wait for the user's answer before the next question.

Word each question so "yes" accepts your recommended answer.

Each answer the user gives reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next question. A question whose answer depends on another question still open belongs to a _later_ turn, not this one.

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), don't ask the user for anything you could look up yourself. The _decisions_ are the user's: put each to them and wait.

The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. Do not act on it until the user confirms you have reached a shared understanding.

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
