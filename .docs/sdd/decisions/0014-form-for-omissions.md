---
status: accepted
date: 2026-10-13
rutas:
  - skills/**/SKILL.md
  - skills/**/references/**
---

# Un elemento omitido se arregla con un hueco en la plantilla

## Contexto y problema

La ADR 0003 da una forma de guía para tres fallos: de disciplina, de forma y condicional. No dice qué hacer cuando el agente cumple pero se deja una pieza de lo que produce. En la feature 0166, `sdd-worktrees` debía decir la ruta del worktree y 3 de 3 sujetos dieron solo la rama; el hilo hizo dos rondas de REFACTOR en prosa («Report with … the full path», «Write that line … with the real path»), las dos 0/3, y el THEN acabó enmendado (~35 min). La tabla «Match the Form to the Failure» de `writing-skills` de superpowers (igual de la 6.3.0 a la 7.0.0) tiene esa cuarta fila: «Omits a required element → REQUIRED field or slot in the template they fill in», con la prosa junto a la plantilla como forma mala.

En la feature 0173, el escenario `o1` de la batería de `sdd-implement` lo midió con el Art. II de tres filas: 3 de 4 sujetos escribieron la ronda en prosa. Uno de ellos leyó el artículo, clasificó el fallo como «de forma» y escribió una receta («one line that carries the path…») en vez de la línea de la respuesta con su hueco.

## Opciones consideradas

- Dejar el caso en la fila «de forma» (receta o contrato).
- Una fila propia para el elemento omitido, con el hueco en la plantilla como forma.

## Decisión

Un elemento omitido (cumple, pero falta una pieza de algo que ya produce) se arregla con un hueco obligatorio en la plantilla que el agente rellena, no con un recordatorio en prosa junto a ella. Es la fila de `writing-skills` que el Art. II no traía (Art. IX: trae algo de otro kit).

### Consecuencias

- El Art. II pasa a cuatro filas y el tope de la constitution en `WordBudget.Tests.ps1`, a 2.230 palabras.
- La regla de parada del REFACTOR que la 0173 también midió no entra: con el Art. II leído, la segunda ronda ya cambia de forma (`o2`, 2/2).

### Confirmación

El escenario `o1` de la batería de `sdd-implement`, con la rúbrica `O1`.
