---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them. A request with no title, or an empty one, lacks it: ask for the title before writing anything; never write a placeholder name such as `nota` or `sin-titulo`.
2. Write `notas/<slug of the title>.md` with the body.
3. Tell the user the path you wrote.
