---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Write `notas/<slug of the title>.md` with the body.
3. End your reply with the full path of the file you wrote, in backticks, in the user's language. A reply that confirms the save without the path is incomplete. Example: «Guardada en `notas/reunion-martes.md`».
