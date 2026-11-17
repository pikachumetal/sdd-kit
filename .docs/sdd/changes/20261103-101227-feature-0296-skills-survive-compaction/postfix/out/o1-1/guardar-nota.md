---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Write `notas/<slug of the title>.md` with the body.
3. Reply with this template, in the user's language, filling every slot:

   ```
   Note saved at `<path you wrote in step 2>`.
   ```

   A reply without the path in the slot is not done.
