---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them. An empty title, or a request that says it has none, lacks it: ask for the title and write nothing until the user gives it — never a placeholder name such as `nota.md` or `sin-titulo.md`.
2. Write `notas/<slug of the title>.md` with the body.
3. Tell the user the path you wrote.
