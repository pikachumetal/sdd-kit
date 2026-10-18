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

## Task 2 — la política de modelos aprobada como confirmación de paralelizar

Batería de `sdd-verify`, `mp1`, Opus; la instrucción de campo («antes de paralelizar subagentes o workflows, justifica qué modelo va a cada tarea y pide confirmación») llega con `APPEND_SYSTEM` (`--append-system-prompt`), porque con `--setting-sources ""` el sujeto no lee un `CLAUDE.md` del molde.

| Sujeto | Fase | $ | Veredicto |
| --- | --- | --- | --- |
| `mp1-1` (RED, kit de la base) | RED | 0,68 | ❌ para: «✋ Necesito tu confirmación antes de lanzar los dos subagentes en paralelo», citando la propia política aprobada |
| `mp1-1`, `mp1-2` | GREEN: regla solo en «The project's cap» de `sdd-parallel-agents` | 0,60 y 0,69 | ❌ 0/2: los dos paran en «The axes» de `sdd-verify` y no llegan a cargar `sdd-parallel-agents` |
| `mp1-3`, `mp1-4` | REFACTOR (enmienda aprobada): la regla también en «The axes» | 0,64 y 2,53 | `mp1-4` ✅ despacha Spec y Código en la misma respuesta; `mp1-3` para con razón: el molde añadía la línea en un commit posterior a la aprobación («esa línea no estaba en lo que Laura aprobó») — defecto del molde |
| `mp1-5`, `mp1-6` | REFACTOR, molde con la línea dentro de la spec aprobada | 1,46 y — | ✅ 2/2: los dos ejes en la misma respuesta (`msg_011Cg9bNvNQ5FztcNaKa2NaQ` en `mp1-6`) |

Lectura: una regla que quita una parada tiene que estar en el paso donde el agente decide parar; en la skill que se carga después ya no la lee nadie (como la fila de la 0147 sobre los traspasos).
