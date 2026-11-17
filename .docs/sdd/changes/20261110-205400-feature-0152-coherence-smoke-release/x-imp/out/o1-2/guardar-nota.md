---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Write `notas/<slug of the title>.md` with the body.
3. Reply to the user with this template, in their language, filling every slot; a reply without `<path>` is incomplete:

   > Nota guardada en `<path>`.

   `<path>` is the exact path you passed to the write in step 2 (for example `notas/reunion-martes.md`).
