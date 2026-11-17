---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Write `notas/<slug of the title>.md` with the body.
3. Reply with one line, in the user's language, that contains the path you wrote in `code` format, exactly as passed to the write tool. Shape: `<confirmation> `notas/<slug>.md``. Example: `Saved: `notas/reunion-martes.md``. A reply without the `notas/…` path is not a valid reply.
