# Inventario de castellano en skills/ — contrato de mínimo del RED

Lo midió la sesión `develop` en `3d326c3e`, el 2026-11-04, y lo envió a esta feature. Tiene 21 ficheros, no los 23 de su primer mensaje: las migraciones son 13, y los `*-reviewer-prompt.md` ya no tienen títulos en castellano tras la 0312. `## Restricciones de código` está en `encargo-revision.md`.

`kit:own` tiene que dar como mínimo estos ficheros. Cada fichero de más se revisa a mano: entra aquí si tiene castellano de verdad, y si es un falso positivo se arregla la heurística.

Formato: ruta · líneas marcadas / líneas con texto.

| Fichero | Marcadas / con texto |
| --- | --- |
| `skills/sdd-archive/references/aprendizajes-skills.md` | 2/4 |
| `skills/sdd-implement/references/commit-milestones.md` | 20/27 |
| `skills/sdd-implement/references/frontend-verification.md` | 41/48 |
| `skills/sdd-propose/references/control-profiles.md` | 110/159 |
| `skills/sdd-propose/references/modo-lite.md` | 5/9 |
| `skills/sdd-propose/references/nombrado.md` | 9/14 |
| `skills/sdd-propose/references/review-spec.md` | 24/32 |
| `skills/sdd-upgrade/references/migrations/v0.2.0.md` | 3/7 |
| `skills/sdd-upgrade/references/migrations/v0.4.0.md` | 2/8 |
| `skills/sdd-upgrade/references/migrations/v1.0.0.md` | 9/15 |
| `skills/sdd-upgrade/references/migrations/v1.1.0.md` | 6/15 |
| `skills/sdd-upgrade/references/migrations/v2.0.0.md` | 51/70 |
| `skills/sdd-upgrade/references/migrations/v2.1.0.md` | 5/7 |
| `skills/sdd-upgrade/references/migrations/v2.2.0.md` | 5/7 |
| `skills/sdd-upgrade/references/migrations/v2.3.0.md` | 24/28 |
| `skills/sdd-upgrade/references/migrations/v2.3.1.md` | 5/7 |
| `skills/sdd-upgrade/references/migrations/v2.3.2.md` | 5/7 |
| `skills/sdd-upgrade/references/migrations/v2.3.3.md` | 5/7 |
| `skills/sdd-upgrade/references/migrations/v2.3.4.md` | 5/7 |
| `skills/sdd-upgrade/references/migrations/v3.0.0.md` | 84/123 |
| `skills/sdd-verify/references/encargo-revision.md` | 15/16 |

## La heurística de develop

- Recorre todos los `.md` de `skills/` salvo `skills/sdd-templates/templates/`.
- Salta los bloques de código con ``` o ~~~, las líneas en blanco y las líneas `---`.
- En cada línea quita las citas «…», el código en línea, los destinos de enlace `](…)` y lo que va entre comillas dobles.
- Cuenta palabras gramaticales de dos listas. ES: que de del la las los el en y para por con una se es su sus al lo como más cuando sin antes después cada también hay está son pero este esta ese esa qué cómo solo ya entre hasta donde sobre tras paso lee leer hace va van sigue siguen. EN: the of and to in is it that for on with as be by this are or not an if when each before after what from which its you your does do has have.
- Una línea cuenta como castellano si tiene es ≥ 3 y es > 2·en. Un título (`#`) cuenta con es ≥ 1, en = 0 y una tilde, una ñ o «de/del/la/las/los/el/y/en».
- Un fichero entra si tiene al menos una línea marcada.
- Su límite: el suelo de 3 palabras se deja las líneas cortas en castellano de un fichero en inglés, como «(ticket de la task 0057)» o un título de una o dos palabras.
