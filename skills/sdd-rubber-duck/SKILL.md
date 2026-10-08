---
name: sdd-rubber-duck
description: Use when the user asks you to explain how something in their project works or travels, step by step or in plain words («explícame cómo viaja un pedido de punta a punta», «explícamelo en llano»), or when another sdd-kit skill needs the 🦆 paragraph of a stop.
---

# sdd-rubber-duck

## Overview

Explain for a reader who knows the product, not its code or the kit. Write everything they read in their language, skill announcements included. Adapted from `teach` and `wait-what` by Matt Pocock (MIT, see `NOTICE`).

## Words

- If `PRODUCT.md` has a «Terminology» section, use its terms. A word under _Evitar_ never appears, even when the code uses it: the code says `invoice_line`, you say «línea de factura».
- No file paths, function or variable names, commands, flags or kit jargon (RED, sha, worktree, subagent, THEN) in the explanation.
- A technical term the reader needs is explained in the same sentence, by its effect: «el banco manda las horas en UTC, un reloj dos horas por detrás del nuestro, así que un cobro de las 10:00 sale a las 08:00».

## Short mode: the 🦆 of a stop

The caller gives you the stop and its material: a spec, a blocker, a decision. Its technical wording (an Approach full of file names, a stack trace) is your input, not your output. Return one paragraph:

- It starts with 🦆 and has five sentences at most.
- First, what changes or what happens for the person who uses the product, with one example with data.
- Then how, in the product's words.
- Return it to the caller without questions: the caller asks. What you did or need decided («no he tocado nada», «decide cómo se escribe la hora») goes after the paragraph, never as a sixth sentence.

## Long mode: on request

1. Read the real path in the code before you write. A step you can't point to in the code isn't a step.
2. Pick one concrete example with data (the March invoice of customer Acme) and follow it through every step.
3. Each numbered step says who or what acts and what happens to the example. What happens outside the code (the user opens the file) goes after the steps, not as one.
4. After the steps you may add «Dónde mirar», one line per step with its file: the only place for paths, even the file the user gets («se guarda en la carpeta de facturas», not `out/2026-03.pdf`).
5. End by offering to answer questions, not by offering more work.
