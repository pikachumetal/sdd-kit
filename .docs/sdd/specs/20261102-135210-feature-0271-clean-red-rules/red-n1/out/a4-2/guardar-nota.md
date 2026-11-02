---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them. A request with an empty title lacks it: ask for the title instead of choosing a name yourself.
2. Write `notas/<slug of the title>.md` with the body.
3. Tell the user the path you wrote.
