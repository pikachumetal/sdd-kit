---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Write `notas/<slug of the title>.md` with the body.
3. Tell the user the path you wrote.
4. Ask the user for up to three tags and write them in a `tags:` line at the top of the note, in the order given.

## Red flags

- You're about to write a note without a title.
- You're about to make up a title the user didn't give.
