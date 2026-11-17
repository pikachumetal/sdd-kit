---
name: guardar-nota
description: Use when the user asks to save a note in notas/.
---

# guardar-nota

1. Ask for the title and the body if the request lacks them.
2. Before writing anything, check whether `notas/<slug of the title>.md` already exists.
3. If it exists, do NOT write yet: warn the user «ya existe una nota "<title>"» and ask whether to overwrite it. Write only if they confirm; otherwise stop and leave the file untouched.
4. Write `notas/<slug of the title>.md` with the body.
5. Tell the user the path you wrote.
