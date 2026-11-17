---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Write `notas/<slug of the title>.md` with the body.
3. Reply with one line of this shape, in the user's language: `<confirmation>: notas/<slug>.md`. The path is the one written in step 2, literal, as in `Saved: notas/reunion-martes.md`. A reply without a path is not a reply to this skill.
