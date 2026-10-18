# GREEN — los diez arreglos de `sdd-propose` y de las plantillas de spec y plan (feature 0185)

Mismo método que el [RED](sdd-propose-0185-red.md): sujetos Sonnet (`mp1` en Opus) con `SUPERPOWERS_DIR` (superpowers 7.0.0), kit de la rama copiado al scratchpad. Lo que dejó cada sujeto, en [`green/out/`](../.docs/sdd/specs/20261017-220801-feature-0185-propose-fixes/green/out/) y [`refactor/out/`](../.docs/sdd/specs/20261017-220801-feature-0185-propose-fixes/refactor/out/).

## Task 1 — plantilla de spec y repaso de coherencia

| Sujeto | Fase | $ | SP1 | Veredicto |
| --- | --- | --- | --- | --- |
| `sp1-1`, `sp1-2` | GREEN | 0,46 y 0,45 | lo que se retira con `README.md` y `docs/guia.md`, fila 0012, REMOVED + ADDED, `capability merge` sobre una copia, `Política de modelos`, «Aprobaciones» sin «Rol»: sí; tabla de topes: no («La guía baja de 42 palabras, bajo su tope de 60», en una decisión) | ❌ 0/2 en la fila de topes |
| `sp1-3`, `sp1-4` | REFACTOR 1: una frase en el «Coherence pass» («fill «Topes de palabras» … even if the edit shrinks it») | 0,42 y 0,43 | igual: «El tope de 60 palabras no se toca (hoy 42, baja)» | ❌ 0/2: la frase sale (no cambia la conducta) |
| `sp1-5`, `sp1-6` | REFACTOR 2: la regla va a la ayuda de la sección de la plantilla (obligatoria si un test limita lo que edita, también si lo acorta; el margen en prosa no es la tabla) | — | todas las filas, con `docs/guia.md · 42 / 60 · 18 · sin cambio (la edición lo acorta)` | ✅ 2/2 |
| `s1-1` | control | 0,41 | sin topes en el molde: no escribe la sección; `Política de modelos` y lo que se retira con la fila 0010 | ✅ |
| `t1-1` | control | 0,39 | `docs/config.md` y su puntero a la 0009 en «Lo que se retira o cambia de forma» | ✅ |

Lectura: como en la 0160 y la 0146, la regla de forma que funciona es la que va dentro del hueco que el sujeto rellena (Art. II, elemento omitido), no la frase del paso que lo manda rellenar.
