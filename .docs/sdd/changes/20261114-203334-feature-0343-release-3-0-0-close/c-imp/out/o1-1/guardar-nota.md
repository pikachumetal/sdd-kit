---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Write `notas/<slug of the title>.md` with the body.
3. Reply to the user with this template, with the slot filled with the path from step 2; a reply without the path is incomplete:

   ```
   Nota guardada en `<path written in step 2>`.
   ```
