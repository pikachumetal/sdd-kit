---
name: sdd-tdd
description: Use when sdd-implement or an implementer brief reaches code to write or a test to add, to keep it test-first. Invoked from there; not the entry of a change (that is sdd-propose).
---

# sdd-tdd

## Overview

Write the test first, watch it fail, write the least code that makes it pass. Write everything the user reads in the language of their message. Forked from `test-driven-development` of superpowers 7.0.0 (MIT, see `NOTICE`).

**Core principle:** if you didn't watch the test fail, you don't know whether it tests the right thing.

It governs every new behavior, bug fix and refactor in a task of the plan. **Violating the letter of these rules is violating their spirit.**

## The Iron Law

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

Wrote code before its test? Delete it and start over from the test. Don't keep it as a reference, don't adapt it while you write the test, don't look at it: delete means delete.

## Exceptions

Only the kit's lanes skip the cycle: a **config** change runs its gate instead (`sdd-propose`), and a **spike** task carries «Evidencia» instead of RED tests. Anything else you think is an exception —generated code, a prototype— is a question: the thread stops as at a deviation; an implementer returns `NEEDS_CONTEXT`.

## Who writes the RED

In the kit the RED tests encode the spec's THEN and are written **before the task's code**, by the thread (`sdd-implement`). If they reached you already written —you are the implementer, or the thread after writing them—, they are the contract: you don't change an assertion, a test name or a datum.

## The cycle

1. **RED** — one minimal test per behavior, with a name that says the behavior, against real code (a mock only where the dependency is slow or external). Before writing or changing any test, read [writing-good-tests.md](references/writing-good-tests.md).
2. **Verify RED — never skip it, also for a RED you received.** Run it before touching the code it covers, and read why it fails:
   - it fails because the behavior is missing → go on;
   - it errors (typo, import, syntax) → fix the error and run it again until it fails for the right reason; a compile or import error on the symbol the task creates is the right failure;
   - it passes → it tests behavior that already exists: a finding about the test. Fix the test you wrote; a test you received, report it (`DONE_WITH_CONCERNS` with the green output) and don't write code to «make it pass».
   Keep the command and the failing output: the report's «TDD Evidence» asks for them.
3. **GREEN** — the simplest code that passes. Nothing the test doesn't ask for.
4. **Verify GREEN** — run the task's «Verificación» commands: they pass, and the output is clean (no errors, no warnings). A failing test → fix the code, not the test. The full suite is the closing gate, run once by the thread: not yours in a task.
5. **REFACTOR** — only with everything green: remove duplication, improve names, extract a function. Run the «Verificación» again after each step; no new behavior here.
6. Next behavior → next failing test.

A bug found on the way: reproduce it with a failing test, then fix it under this cycle. If you can't explain the failure, use `sdd-debugging` before touching the code.

## Red flags — STOP and start over from the test

- Code exists before its test.
- A test passes the first time you run it.
- You can't say why a test fails.
- «I already tested it by hand».
- «I keep it as a reference» or «I adapt what I wrote».
