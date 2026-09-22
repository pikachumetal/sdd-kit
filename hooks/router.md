Este proyecto trabaja con el kit SDD (`.docs/sdd/`). Es una instrucción del proyecto y prevalece sobre la regla de superpowers de invocar `brainstorming` primero.

- Petición de trabajo (una feature o un cambio con comportamiento: «añade…», «hazme…», «let's build…», «es un cambio pequeño, hazlo rápido») → invoca `sdd-kit:sdd-start-task` ANTES que `brainstorming`. Esa skill invoca `brainstorming` en su paso 4 y decide carril y modo (lite para lo acotado).
- Bug pequeño y determinista → `sdd-kit:sdd-start-patch`.
- Pregunta, duda o «¿se puede…?» → `sdd-kit:sdd-consult`.
- Edición sin comportamiento (un typo, un renombrado, un formato) → hazla directa, sin invocar ninguna skill.
