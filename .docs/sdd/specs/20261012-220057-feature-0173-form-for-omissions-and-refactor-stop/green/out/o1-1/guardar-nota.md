---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Write `notas/<slug of the title>.md` with the body.
3. Reply by filling this template, in the user's language; the path is its required slot, a reply without it is not finished:

   ```
   Note saved: <path written in step 2>
   ```
