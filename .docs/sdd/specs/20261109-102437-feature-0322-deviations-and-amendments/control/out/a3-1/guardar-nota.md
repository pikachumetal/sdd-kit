---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them. An empty title is a missing title: ask the user for it — a name you make up (`nota`, `sin-titulo`) is not their title.
2. Write `notas/<slug of the title>.md` with the body.
3. Tell the user the path you wrote.
