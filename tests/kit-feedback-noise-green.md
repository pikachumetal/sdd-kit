# GREEN — tickets de `sdd-feedback` con menos ruido (feature 0050)

Mismos escenarios y molde que el [RED](kit-feedback-noise-red.md), con la skill y la plantilla editadas de la rama (copia del working tree sobre `18001d0b`), 2026-10-01. Salidas en [green/out/](../.docs/sdd/specs/20261001-125120-feature-0050-feedback-less-noise/green/out/) y [refactor/out/](../.docs/sdd/specs/20261001-125120-feature-0050-feedback-less-noise/refactor/out/).

## Gasto

- GREEN: 4 sujetos, 0,86 $.
- REFACTOR: 2 sujetos de reserva, 0,73 $.
- Campaña entera, con el RED: 10 sujetos y 2,53 $, dentro de la previsión (10 sujetos, ~8 $; techo 12 $ y 2 h).

## Resultados del GREEN

| Medida (decisión de la spec) | RED | n1-1 | n1-2 | l1-1 | l1-2 |
| --- | --- | --- | --- | --- | --- |
| 1. Ticket mínimo en un cierre limpio | 0/2 | — | — | ✅ 54 palabras | ✅ 82 palabras, con una línea de menores |
| 2. Menores en su lista, una línea | 0/2 | ❌ mete en «Menores» el campo inventado (~20 min) porque su cifra va «sin respaldo» | ✅ | — | — |
| 3. «Verificada» en cada propuesta | 0/2 | ✅ | ✅ | — | — |
| 3. El fallo citado con comando, shell y línea de error | 0/2 | ✅ | — no cita el fallo (ver 5) | — | — |
| 4. La causa del coste, respaldada o «sin respaldo» | 0/2 | ✅ cita el walkthrough y marca «sin respaldo» la frase del dev-lead | ✅ | — | — |
| 5. Sin «Errores míos»; lo que el kit pudo evitar, como hallazgo | 0/4 | ✅ | ❌ omite el `task-done` desde PowerShell, que la regla del paso 6 cubría | ✅ | ✅ |
| 5. El fallo de shell sin relación con el kit no va | — | ✅ | ✅ | — | — |
| 6. Un ticket por feature | 1/2 | ✅ | ✅ | — | — |
| 7. Ejecuta el lint de docs y el ticket pasa | 0/4 lo ejecutan | ✅ | ✅ | ✅ | ✅ |
| Control: carpeta y nombre | 4/4 | ✅ | ✅ | ✅ | ✅ |
| Control: privacidad | 4/4 | ✅ | ✅ | ✅ | ✅ |
| Control: criterio de aceptación por hallazgo | 2/2 | ✅ | ✅ | — | — |
| Control: iniciativa propia en su sección | 4/4 | ✅ | ✅ | ✅ | ✅ |

Dos huecos de 1 de 2, los dos en la frontera entre reglas:

- **n1-1** contó como menor un coste de ~20 min, porque el walkthrough no lo respaldaba. Leyó «sin respaldo» como coste que no cuenta.
- **n1-2** dejó fuera el `task-done` desde PowerShell. La regla decía «si ninguna regla del kit lo cubriría, o es del harness o del shell, no va al ticket», y lo leyó como fallo del shell aunque la regla del kit lo cubría.

## REFACTOR

Dos frases en las reglas de `SKILL.md`:

- «Un fallo del shell o del harness que una regla del kit cubre también es hallazgo; solo el que ninguna regla del kit cubriría no va al ticket.»
- En «Menores»: «Cuenta el coste que viste en la sesión, aunque su causa vaya «sin respaldo».»

| Medida | n1-1 | n1-2 |
| --- | --- | --- |
| El campo inventado (~20 min), como hallazgo y no como menor | ✅ hallazgo 3 | ✅ hallazgo 3 |
| El `task-done` desde PowerShell, como hallazgo con comando, shell y error | ✅ hallazgo 2 | ✅ hallazgo 2 |
| El `git commit -F -` (shell, sin regla del kit) no va | ✅ | ✅ |
| Las demás medidas del GREEN (verificada, coste, menores, un ticket, lint, privacidad) | ✅ | ✅ |

Los dos dicen en el hallazgo 2 que la regla ya estaba escrita, y lo marcan como verificado contra `skills/sdd-start-feature/SKILL.md:48`.

## Lo que queda

- **Tope de palabras**: `SKILL.md` queda en 589 palabras frente al tope de ~500 que fijó la decisión 9 (eran 337). El REFACTOR sumó 32 palabras. Recortar sin un A/B (Art. I) arriesga las dos fronteras que acaba de cerrar, así que queda como dato para la batería de la 0120.
- **Salida del entorno del sujeto**: l1-2 apunta como menor el aviso de migraciones pendientes de su propia sesión headless. Lo saca del entorno del sujeto, no del molde, y no es conducta de la skill.

## Pasada de fix de la revisión final

La revisión final (Opus, effort high, sobre `d0a5d3d4`) dio «Sí, con dos arreglos», con dos Important:

- **La plantilla conservaba la frase de errores que el REFACTOR corrigió en la skill.** Se alinea con la skill. `KitFeedback.Tests.ps1` gana la aserción, que falla contra la plantilla anterior al fix y pasa con la nueva.
- **El tope de palabras de la decisión 9 se superaba sin enmienda.** Enmienda aprobada por el dev-lead: el tope pasa a ~650. `SKILL.md` queda en 611 palabras.

Minor aplicados:

- «Sin inventar fricciones» en la ayuda del ticket mínimo.
- El predicado de cierre limpio cubre «sin estimación» y la lista de la decisión 1 (ruling, desvío, paso rodeado, decisión sin paso).
- El ejemplo de «Qué pasó» va partido por debajo de 200 caracteres.
- Pester protege las siete reglas nuevas de la skill y la frase positiva de la oferta.

Queda diferido un Minor: los menores mal clasificados de las salidas del GREEN (una atribución «sin respaldo» como menor). Es ruido residual, para la batería de la 0120.

Control con la plantilla alineada (enmienda del dev-lead: 12 sujetos, [fix/out/](../.docs/sdd/specs/20261001-125120-feature-0050-feedback-less-noise/fix/out/)), 2 sujetos y 0,57 $:

| Medida | n1-1 | l1-1 |
| --- | --- | --- |
| Ticket mínimo en el cierre limpio | — | ✅ 52 palabras, `lint ok` |
| `task-done` desde PowerShell y campo inventado (~20 min), como hallazgos | ✅ hallazgos 2 y 3 | — |
| `git commit -F -` fuera del ticket | ✅ | — |
| Menores en una línea, los dos de ~3 y ~5 min | ✅ | — |
| «Verificada», coste respaldado o «sin respaldo», lint, un ticket por feature, privacidad | ✅ | ✅ |

Residual: n1-1 escribe «sin verificar (contrastado con `…:48`)», y contrastar con `fichero:línea` es justo lo que la regla llama verificada. Lo marca de menos, no de más. Queda como dato para la 0120.

Campaña total: 12 sujetos y 3,09 $.
