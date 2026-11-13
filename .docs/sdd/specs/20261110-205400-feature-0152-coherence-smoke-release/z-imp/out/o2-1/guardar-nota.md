---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Write `notas/<slug of the title>.md` with the body.
3. Reply to the user with this template, in the user's language, filling every slot — a reply with an empty slot is not sent:

   ```
   Nota guardada en: <path you wrote in step 2, e.g. notas/reunion-lunes.md>
   ```
