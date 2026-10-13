---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Write `notas/<slug of the title>.md` with the body.
3. Finish with a reply that states the exact path you wrote (for example `notas/reunion-martes.md`). A bare "saved" is not enough: the user must be able to read where the note is.
