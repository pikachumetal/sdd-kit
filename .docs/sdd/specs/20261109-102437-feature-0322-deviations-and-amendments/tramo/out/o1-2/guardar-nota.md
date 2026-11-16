---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Write `notas/<slug of the title>.md` with the body.
3. Reply with this template, in the user's language, filling every slot:

   > Nota guardada en `<path written in step 2>`.

   The reply is not complete while `<path written in step 2>` is empty.
