---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Write `notas/<slug of the title>.md` with the body.
3. Reply to the user, in their language, by filling this template; a reply with `<path>` empty is not sent:

   ```
   <one-line confirmation> — <path>
   ```

   `<path>` is the exact path you passed to the write in step 2 (for example `notas/reunion-martes.md`).
