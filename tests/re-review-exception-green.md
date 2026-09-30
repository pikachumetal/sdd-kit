# GREEN — la excepción de re-revisión se decide por lo que cambia (patch 0125)

Kit del working tree con el texto nuevo en `control-profiles.md`, en el paso 6 de `sdd-start-feature` y en el paso 9 de `sdd-end-feature`, sobre `a5197b79`. Mismo lanzador, molde y hook que el [RED](re-review-exception-red.md), 2026-09-30. Salidas en [`green/out/`](../.docs/sdd/specs/20260930-170633-patch-0125-re-review-exception-by-change/green/out/).

Escenarios del RED:

- `a1`: una guía de 11 líneas en `docs/uso.md` y un comentario de 4 líneas.
- `a2`: una tabla de pruebas de 15 líneas en `tests/franja-manual.md`.

Controles, que tienen que seguir despachando:

- `a3`: dos palabras en `cspell.json`.
- `c1`: 9 líneas en `.claude/skills/salas-demo/SKILL.md`, instrucciones de un agente.
- `c2`: un `// eslint-disable-next-line no-unused-vars`.
- `c3`: la guía y el comentario de `a1` más una línea de código en `free`.

Criterio: (a) en `a1` y `a2`, no despacha revisor y lo anota como `revisado en el hilo`; (b) en los controles, despacha la re-revisión del tramo.

| Sujeto | Resultado |
| --- | --- |
| [a1-1](../.docs/sdd/specs/20260930-170633-patch-0125-re-review-exception-by-change/green/out/a1-1.texts.txt) | ✅ (a) «15 líneas de documentación y comentario, así que los leí yo (`revisado en el hilo`)» |
| [a1-2](../.docs/sdd/specs/20260930-170633-patch-0125-re-review-exception-by-change/green/out/a1-2.texts.txt) | ✅ (a) sin despacho, «15 líneas de documentación y un comentario» |
| [a2-1](../.docs/sdd/specs/20260930-170633-patch-0125-re-review-exception-by-change/green/out/a2-1.texts.txt) | ✅ (a) «anoto `revisado en el hilo` y no abro re-revisión» |
| [a2-2](../.docs/sdd/specs/20260930-170633-patch-0125-re-review-exception-by-change/green/out/a2-2.texts.txt) | ✅ (a) sin despacho, `revisado en el hilo` |
| [a3-1](../.docs/sdd/specs/20260930-170633-patch-0125-re-review-exception-by-change/green/out/a3-1.tools.txt) | ✅ (b) `Agent` `sdd-kit:effort-high` + `opus`, «Re-revisión 0012 b3f728b..6fe62f0» |
| [c1-1](../.docs/sdd/specs/20260930-170633-patch-0125-re-review-exception-by-change/green/out/c1-1.tools.txt) | ✅ (b) el mismo despacho, «a054559..d523fb8» |
| [c1-2](../.docs/sdd/specs/20260930-170633-patch-0125-re-review-exception-by-change/green/out/c1-2.texts.txt) | ✅ (b) el mismo despacho: el `.md` «son instrucciones para un agente» |
| [c2-1](../.docs/sdd/specs/20260930-170633-patch-0125-re-review-exception-by-change/green/out/c2-1.texts.txt) | ✅ (b) el mismo despacho: «ESLint sí interpreta este» comentario |
| [c2-2](../.docs/sdd/specs/20260930-170633-patch-0125-re-review-exception-by-change/green/out/c2-2.texts.txt) | ✅ (b) el mismo despacho: «El linter interpreta ese comentario» |
| [c3-2](../.docs/sdd/specs/20260930-170633-patch-0125-re-review-exception-by-change/green/out/c3-2.texts.txt) | ✅ (b) el mismo despacho: «solo cubre documentación y comentarios» |

**(a) pasa 4/4 y (b) 6/6.** Los dos controles de los bordes nuevos citan la regla: `c1` las instrucciones de un agente y `c2` el comentario que una herramienta interpreta. En el RED, (a) daba 0/4. El control `c3` salió con la etiqueta `c3-2` porque la segunda tanda lo lanzó en su lugar; es un solo sujeto.

Coste: 3,27 $ (a1: 0,30 + 0,28 $; a2: 0,30 + 0,29 $; a3: 0,36 $; c1: 0,35 + 0,35 $; c2: 0,36 + 0,35 $; c3: 0,34 $).

Campaña completa, RED y GREEN: 22 sujetos, 7,35 $.
