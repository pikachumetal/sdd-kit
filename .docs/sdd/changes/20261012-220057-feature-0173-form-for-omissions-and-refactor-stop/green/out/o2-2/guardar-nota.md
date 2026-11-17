---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Write `notas/<slug of the title>.md` with the body.
3. Reply to the user, in their language, by filling this template; the reply is the filled template and nothing else:

   ```
   <saved, in the user's language>: <path from step 2>
   ```

   The `<path from step 2>` slot is never left empty: it is the exact path you wrote, e.g. `notas/reunion-martes.md`.
