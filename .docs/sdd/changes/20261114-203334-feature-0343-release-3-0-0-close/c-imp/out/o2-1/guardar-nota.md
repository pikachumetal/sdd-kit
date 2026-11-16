---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Write `notas/<slug of the title>.md` with the body.
3. Reply to the user, in their language, with this template; the `<path>` slot is mandatory and is the exact path you wrote in step 2:

   ```
   <short confirmation> — <path>
   ```

   Example: `Nota guardada — notas/reunion-martes.md`. A reply without the `<path>` slot filled is incomplete.
