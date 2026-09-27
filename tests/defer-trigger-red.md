# RED — la opción «Diferir» de la validación trae su disparador (patch 0080)

Paso 0 de `sdd-end-patch` con el kit de `develop` (`6682b41`, tras la 0036). Lanzador de referencia (`tests/headless/run.sh`) con [`red/subject.sh`](../.docs/sdd/specs/20260927-085723-patch-0080-defer-trigger/red/subject.sh), sujetos Sonnet headless, 2026-09-27. Molde: el patch 0011 del molde de la task 0009, en la rama `feature/0011` y perfil `delegate` con bloque `merge`. Primer turno: «Cierra el patch 0011.». Segundo turno, con `--resume` sobre la misma sesión: «Diferir», sin texto. El sujeto no tiene `AskUserQuestion`, así que la pregunta de validación sale en texto. Salidas en [`red/out/`](../.docs/sdd/specs/20260927-085723-patch-0080-defer-trigger/red/out/).

Criterio: (a) la opción de diferir de la pregunta nombra un disparador con dueño; (b) tras «Diferir» sin texto, `patch.md` §4 queda con una línea `Validación diferida:` completa, sin otro turno.

| Sujeto | (a) Opción de diferir en la pregunta | (b) Línea en §4, sin otro turno |
| --- | --- | --- |
| [d-1](../.docs/sdd/specs/20260927-085723-patch-0080-defer-trigger/red/out/d-1.texts.txt) | ❌ no la ofrece: pide «¿Qué has probado tú del fix?» | ✅ `Validación diferida: 2026-09-27 · «Diferir» · disparador: el próximo uso de `salas cancelar`, a cargo del dev-lead` |
| [d-2](../.docs/sdd/specs/20260927-085723-patch-0080-defer-trigger/red/out/d-2.texts.txt) | ❌ «o dime si prefieres diferir la validación (con motivo y disparador)» | ✅ `Validación diferida: 2026-09-27 · «Diferir» · disparador: el primer uso real de `cancelar` sin hora, a cargo de Àngel Delgado` |

**(a) falla 0/2; (b) pasa 2/2.** El turno de más que predice la fila 0080 no se reproduce sin `AskUserQuestion`: los dos sujetos concretan el disparador con la regla del disparador vago de `control-profiles.md` (patch 0037) y lo dicen en el mensaje final. Lo que sí se reproduce es la causa del ticket del patch 0078 §1: la opción de diferir no lleva disparador, y d-2 se lo pide al usuario. Con `AskUserQuestion`, esa petición es el turno de más del 0078. El patch sigue con el fallo medido (a), y (b) queda como control de no regresión (paso 1 de `sdd-start-patch`: «si reproduce un fallo distinto […] el patch sigue con el fallo medido»).

Límite: no se midió con `AskUserQuestion`, que headless no puede contestar.

Coste: 2,49 $ (d-1: 0,42 + 0,86 $; d-2: 0,43 + 0,78 $). `run.sh` dijo 1,64 $, porque `spent()` lee solo el último `RESULTADO` de cada sujeto y con `--resume` hay dos, uno por turno.
