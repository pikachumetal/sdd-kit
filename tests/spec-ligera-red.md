# Evidencia RED — spec ligera y `funcional/` (2026-09-08)

Baseline de la task [spec-ligera-funcional](../.docs/sdd/specs/20260908-150513-task-0000-spec-ligera-funcional/spec.md) (T5). Sonnet, fixture desechable "Bookline-fn", 6 runs en tres tandas (`wf_cdc5467c-357`, `wf_b1edd106-dcd`, y E4 por `Agent`). Estado verificado en disco.

## Fixture

Bookline con **`funcional/pedidos.md`** en el formato de la plantilla nueva (dos requisitos con título estable y escenarios), y una task `0000-filtro-estado` con **`spec.md` en formato ligero** (`mode: lite`, tres decisiones a validar, delta con un `ADDED` y un `MODIFIED (antes: …)` sobre "Listado paginado de pedidos"), implementada, con tests en verde y sin `walkthrough.md`. Molde sin `.git`.

| Copia | Montaje |
| --- | --- |
| `e1`, `e1b`, `e1c` | rama `feature/0000-filtro-estado`; `sdd-end-task` vigente (`48c0f4a`, sin paso de fusión) |
| `e2` | `develop`; `sdd-consult` vigente |
| `e3` | brownfield: sin `.docs/sdd/`, `CLAUDE.md` monolítico; `sdd-init-brownfield` vigente |
| `e4` | sin la task ni la implementación; **sin skill**, solo la plantilla `spec-template.md` nueva a mano |

## Resultado — verificado en disco

### E1 (×3) — ¿`sdd-end-task` fusiona el delta sin un paso que lo nombre? → **SÍ, 3/3: el paso NO se escribe**

| | `e1` | `e1b` | `e1c` |
| --- | --- | --- | --- |
| Requisitos en `funcional/pedidos.md` (partida: 2) | **3** | **3** | **3** |
| `ADDED` "Filtro por estado" presente | ✅ | ✅ | ✅ |
| Texto anterior del `MODIFIED` eliminado | ✅ | ✅ | ✅ |
| Texto nuevo ("`total` cuenta solo los filtrados") presente | ✅ | ✅ | ✅ |
| Ficheros de capacidad creados de más | 0 | 0 | 0 |
| Sección Historial añadida | no | ✅ | ✅ |

Los tres ejecutaron además el Definition of Done completo (walkthrough distinguiendo verificado de reportado, `estimation-log.md` creado, roadmap, `finishing-a-development-branch` con merge dejado al dev-lead). Dos de tres (`e1`, `e1b`) invocaron `requesting-code-review` en el paso 9 y **detectaron y corrigieron** una duplicación real de `STATUSES` que contradecía el Approach de la spec; `e1c` la registró como deuda sin tocar código.

`e1b` en sus palabras: *"Fusionado el delta de comportamiento de la spec en `.docs/sdd/funcional/pedidos.md`: ADDED 'Filtro por estado en el listado', MODIFIED 'Listado paginado de pedidos', con entrada en su Historial"*.

**Por qué ocurre sin guidance**: el paso 4 de `sdd-end-task` ya dice "cada aprendizaje del walkthrough se vuelca donde vive", el rename (`48c0f4a`) deja `funcional/` en la lista de documentos de anclaje de `sdd-start-task` —no en `aprendizajes-skills.md`, que en el momento del RED no lo citaba y se añadió después por coherencia (Art. IV)—, y el delta de la spec ligera está escrito **en la forma exacta** del fichero de capacidad: `ADDED`/`MODIFIED (antes: …)` con título estable. El agente no tiene que interpretar nada — solo mover bloques. La plantilla hace el trabajo que el paso habría hecho.

Consecuencia (Art. I): **el paso "Fusionar el delta en `funcional/`" previsto en el plan (Task 3 Step 2) no se escribe.** Es el mismo desenlace que tuvo la skill `sdd-env` en T4: el disparador no es una instrucción en la skill, es que el artefacto exista y esté bien formado.

### E2 — ¿`sdd-consult` lee la capacidad? → **SÍ: guidance no reclamada**

`e2` leyó `funcional/pedidos.md`, la spec y el código; **detectó que la capacidad estaba desfasada** respecto al código (la fixture lo está a propósito: `e2` parte del estado previo a la fusión), respondió correctamente desde el código citando la spec aprobada, y **propuso** actualizar `funcional/pedidos.md` sin ejecutarlo: *"te la propongo, no la ejecuto"*. Cero ficheros tocados. Es mejor que lo que el requisito pedía: anclar solo en la capacidad habría dado una respuesta incorrecta con la capacidad desfasada.

### E3 — ¿brownfield vuelca o crea `funcional.md`? → **NO: guidance no reclamada**

Siete documentos generados, ni `funcional.md` ni `funcional/`. El rename ya dice "NO se crea ni se vuelca" en `references/generacion.md` (`48c0f4a`), y el baseline lo cumple.

### E4 — ¿la plantilla basta como receta de forma? → **SÍ (Art. II)**

Sin ninguna skill, con la plantilla nueva a mano, el agente escribió una spec de **68 líneas** con: 5 decisiones a validar arriba (`mode: lite` elegido y justificado, parámetro `status` alineado con `isValidStatus` del contrato, estado inválido → lista vacía con total 0), Intent/Scope/Approach, delta bajo `### Capacidad: pedidos` — la capacidad **existente**, sin crear ninguna — con `ADDED` y escenarios `GIVEN/WHEN/THEN/AND` completos, bloque de estimación por ser lite, aprobaciones. No tocó `funcional/`.

Matiz de juicio, no de forma: modeló "el total refleja los filtrados" como `ADDED` en vez de `MODIFIED` del listado paginado. Ambas lecturas son defendibles; la plantilla ofrece las dos recetas y el agente eligió una.

## Conclusión — qué guidance queda respaldada

| Guidance candidata | Veredicto |
| --- | --- |
| Paso de fusión en `sdd-end-task` | **NO se escribe** (E1 3/3) |
| Lectura de `funcional/<capacidad>` en `sdd-consult` | **NO se escribe** más allá del rename (E2) |
| No volcado en `sdd-init-brownfield` | **NO se escribe** más allá del rename (E3) |
| Forma de la spec ligera | **la plantilla es la receta** (E4); nada en las skills |
| Rename `funcional.md` → `funcional/` en siete sitios + paso 4 de `sdd-start-task` presentando primero las decisiones | **escrito en todo caso** (`48c0f4a`): convención (Art. IV) y forma del gate, no guidance de conducta |

**Lo que T5 cambia de verdad son dos plantillas y una convención**, no las skills. Las skills solo necesitaban saber que `funcional/` existe. El A/B de no-regresión mide que ese rename no movió nada más.
