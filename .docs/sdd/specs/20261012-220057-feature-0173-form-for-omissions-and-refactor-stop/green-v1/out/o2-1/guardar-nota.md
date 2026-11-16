---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Write `notas/<slug of the title>.md` with the body.
3. Reply with one line, in the user's language, that contains the path you wrote, copied literally from step 2 (`notas/<slug>.md`). Example: `Guardada en notas/ideas-de-viaje.md`. A reply that doesn't contain that path string is not the reply of this step.
