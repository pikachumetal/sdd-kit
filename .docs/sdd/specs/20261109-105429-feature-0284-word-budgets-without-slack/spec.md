---
id: 20261109-105429-feature-0284-word-budgets-without-slack
feature: 0284
title: Los topes de palabras vuelven a mandar, sin el margen del 25 %
mode: full
profile: delegate
status: approved
created: 2026-11-09
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-09
---

# Spec — Los topes de palabras vuelven a mandar, sin el margen del 25 %

🦆 Hoy el control de tamaño de las skills deja pasar un 25 % por encima de cada límite: una skill con 3.692 palabras y límite 3.600 salía bien, aunque su spec prometía no crecer. Desde esta feature, ese caso sale en rojo y el aviso dice las dos cifras. Al quitar el margen, ocho skills, el kit entero y cuatro documentos quedan por encima de su límite. Cada límite sube a lo que mide hoy, con su motivo, y no se recorta ningún texto. Desde ahí, crecer una sola palabra en el kit pide una decisión escrita en una spec.

Validación: agente — solo cambia un test del kit, sus cifras, una línea de `CLAUDE.md` y una regla de una capacidad: lo que se observa es el test en rojo o en verde, y eso lo mide el agente; el repo valida en campo (`validation.mode: field`).

## Capacidades

- Modificadas: `archive` — «Límites»: el tope de palabras de `sdd-archive` pasa de 3.920 y 8.000 a lo que mide hoy.
- El test sin margen es herramienta del kit: ninguna capacidad lo describe (la constitution, Art. I, solo dice dónde viven los topes), y su comportamiento se prueba en el propio test.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor con los siete puntos — señales: ninguna de la rúbrica (la de `archive` es una entrada de «Reglas de la capacidad», no un requisito con escenario; sin contrato público ni datos) · tamaño: ~45 líneas en 4 ficheros
- Dominio y técnica (sonnet): si cada tope nuevo de «Topes de palabras» tiene su motivo y coincide con lo medido; si quitar el margen deja algún rojo que la spec no cubra (anclas, kit entero); si la regla 6 de `CLAUDE.md` reescrita sustituye la frase y no añade otra (señal: ninguna; tamaño)
- Mínimo razonable: sin revisión — deja sin leer si algún tope sube sin motivo o si la nueva regla 6 choca con la ADR 0014
```

1. **Enfoque: A, subir cada tope que se pasa a lo que mide el texto, frente a B (recortar las skills propias con su batería) y C (un margen menor, del 2 %, como factor del test)** (ver Approach). Es la decisión central.
2. **Los topes nuevos son lo medido, exacto, sin el 2 % de la plantilla.** El requisito «La spec mide el margen de palabras de lo que edita» de `feature-flow` pone el 2 % en los ficheros que la spec edita, para la pasada de fix de su revisión final; esta spec no edita el texto de ninguna skill ni de ningún documento con tope, así que no lo cambia, y la próxima feature que los edite pone su 2 %. En las copias es además la ADR 0022 (regla 1) y la decisión del dev-lead: «el tope sube a lo que mide el texto».
3. **El kit entero también queda en lo medido, 103.372.** Con él exacto, una skill que crece dentro de su propio tope pone el kit en rojo: es el caso del ticket de la 0276 (+92 en `sdd-roadmap` con «sin cambio») cazado aunque esa skill tuviera holgura, y es la regla «una pieza entra, otra sale» de la constitution. Coste: toda feature que suma palabras toca dos cifras, la de su skill y la del kit.
4. **No bajo los topes holgados** (`sdd-propose`, `SKILL.md` 3.157 de 5.250; `sdd-archive`, `SKILL.md` 2.891 de 3.920; `sdd-implement-subagent`, total 8.496 de 9.000…). El alcance de la fila es lo que se pasa, y con el kit entero exacto (decisión 3) la holgura de una skill ya no deja crecer el kit sin decisión. Bajarlos son cifras, sin sujetos: si lo quieres, dilo en el gate.
5. **Los cuatro documentos de anclaje también suben a lo medido**: `constitution.md` 2.250, `mission.md` 1.808, `architecture.md` 2.253, `tech-stack.md` 23.181. Pasaron del tope nominal con commits que cabían en el margen (cada uno, en la tabla «Topes de palabras»). No son skills y recortarlos no pide batería, pero la constitution y `mission.md` los escribe el dev-lead (tabla de `architecture.md`), y recortar su texto es decisión suya, no de esta fila; `architecture.md` y `tech-stack.md` los migra la 0198 a la forma 3.0.0, y `tech-stack.md` pasa en 3.518 palabras: recortarlo es reescribirlo. Consecuencia: `tech-stack.md` queda en su tope, y el próximo cierre que vuelque un aprendizaje sigue el requisito «Un aprendizaje cuyo destino no cabe tiene salida» de `archive`: sale la pieza más vieja que ya vive en otro sitio. Este cierre también.
6. **`sdd-templates` cuenta por el conjunto, no por plantilla.** Topes por plantilla serían 25 cifras más, y una regla que pasa a una plantilla (ADR 0014) seguiría poniendo en rojo la suya. La regla 6 de `CLAUDE.md` cuenta el saldo sobre las skills que toca el arreglo, juntas, y el kit entero exacto (decisión 3) lo comprueba solo: una skill puede crecer si otra baja lo mismo, y el kit no se mueve. `sdd-templates` sigue con un tope para el conjunto, que sube a 16.999. La regla 6 cambia así, sustituyendo la frase y sin añadir otra (ADR 0022, regla 3):
   - Antes: «…mueve la regla al paso donde se decide, o sustituye o quita otra, y el saldo de palabras de la skill queda igual o baja, porque…»
   - Después: «…mueve la regla al paso donde se decide, o sustituye o quita otra, y el saldo de palabras de las skills que toca, contadas juntas, queda igual o baja (una regla que pasa de una skill a su plantilla, como pide la ADR 0014, no alarga), porque…»
   `CLAUDE.md` es la guía de sesión de este repo, no una skill: el Art. I no le pide batería, y se prueba en el primer cierre que la aplique (validación en campo).
7. **El GIVEN de la fila es un test del ayudante del test**: `expectWithin(3692, 3600)` lanza con `mide 3692 y el tope es 3600`. Sustituye al de la línea 106, que probaba el redondeo del margen; `roundHalfToEven` sale con él, porque solo lo usaba `budgetWithSlack`.
8. **Las cifras se miden sobre la base `3b179f84`**; si `develop` trae antes del cierre una rama que cambia lo que mide una skill o el kit (la 0322 toca `sdd-implement` y `sdd-verify`), el tope de esa skill y el del kit se vuelven a medir tras el merge de sincronización, y la cifra nueva va como enmienda con el id de la rama que la trajo, sin parar. Es una regla que apruebas con la spec, para cualquier skill: lo que sube ya lo decidió la spec de esa rama, y aquí solo se copia su medida. Si la 0322 fusiona después que esta, su sincronización le dará rojo en cualquier palabra que sume, y se lo aviso a la sesión `develop` al cerrar.
9. **Sin sujetos: 0 $.** Ninguna skill cambia de texto, así que el Art. I no pide prueba; la tabla «Previsión de coste» no aplica.
10. **Ejecución**: dos tasks; Native, que decide el plan.
- Política de modelos: revisor de la spec, uno, Sonnet (`sdd-kit:effort-medium`) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

Un revisor, Sonnet con effort medium: seis Importantes y cuatro Menores, ningún Crítico; sin segunda ronda (ni Crítico aceptado ni decisión central reescrita).

- **Rechazado** — Importante 1 · un `MODIFIED` de `feature-flow` sin declarar, porque la tabla no pone el 2 % → el requisito lo pide en los ficheros que la spec edita, y esta no edita el texto de ninguno; la decisión 2 lo dice ahora así.
- **Rechazado** — Importante 2 · el test sin margen no tiene requisito con escenario en una capacidad → es herramienta del kit, que ninguna capacidad describe; lo prueba el propio test (decisión 7). «Capacidades» lo dice.
- **Aceptado** — Importante 3 · los tres anclas suben con un motivo que solo explica `tech-stack.md` → la decisión 5 y la tabla dan el motivo de cada uno, con el commit que lo pasó (medido con `git show <sha>:<fichero> | wc -w`). No se recortan la constitution ni `mission.md`: su texto es del dev-lead.
- **Aceptado** — Importante 4 · el motivo de `sdd-templates` no se puede verificar → la fila cita la tabla de la 0309: ya medía 16.792 antes de ella.
- **Aceptado** — Importante 5 · la decisión 8 sube topes sin parar, y la frase del dev-lead solo cubre `sdd-implement` → la decisión 8 se presenta como regla que se aprueba con la spec, para cualquier skill, y nombra el aviso a la sesión `develop` sobre la 0322.
- **Aceptado** — Importante 6 · la regla 6 de `CLAUDE.md` sin su texto → la decisión 6 lleva el antes y el después; lo de que una skill crezca si otra baja es lo que se quiere, y lo vigila el kit entero.
- **Aceptado** — Menor 7 · la búsqueda de restos no incluye «margen del 25» → añadida en «Filas que implementa».
- **Rechazado** — Menor 8 · corregir `architecture.md:83` sobre `estimation.md` → fuera de alcance; queda en el ticket.
- **Aceptado** — Menor 9 · la regla 6 cambia la conducta de quien cierra sin prueba → la decisión 6 dice que `CLAUDE.md` no es una skill y se prueba en el primer cierre que la aplique.
- **Rechazado** — Menor 10 · la línea «Mínimo razonable: sin revisión» → es la forma de la rúbrica: dice qué deja sin cubrir el mínimo, y este revisor lo cubrió.

### Decisiones tomadas con el dev-lead

- Medir al arrancar, con el test sin el factor, antes de fijar cifras; las de la fila (2026-11-01) no sirven — «Las cifras de la fila … son del 2026-11-01, antes de las reescrituras: no sirven. Mide al arrancar, con el test sin el factor, antes de fijar ninguna cifra en la spec»
- Lo que viene de un fork sube a lo que mide — «Lo que viene de un fork sigue la ADR 0013: el tope sube a lo que mide el texto»
- Subir antes que recortar con sujetos — «Subir un tope es más barato que recortar con sujetos: recorta solo donde el texto sobra de verdad»
- `sdd-implement` no se recorta — «Si sdd-implement pasa de su tope, sube el tope con su motivo; no la recortes»

## Intent

Hoy `cli/test/kit/word-budget.test.ts` multiplica cada tope por 1,25: `sdd-roadmap` siguió en verde con 3.692 palabras contra 3.600 mientras su spec prometía «sin cambio», y lo cazó la revisión final: una pasada de fix y 2,78 $ (ticket de la 0276 §1). Medido hoy sin el factor, 8 skills, el kit entero y los cuatro documentos de anclaje pasan de su tope nominal. El éxito: el test compara contra la cifra de la tabla, sin margen; una skill con 3.692 palabras y tope 3.600 sale en rojo con las dos cifras; y cada tope que sube lleva su motivo en esta spec. Fracasaría si quitar el margen dejara el pre-commit en rojo para la siguiente rama, o si un tope subiera sin motivo escrito.

## Scope

- Entra: `cli/test/kit/word-budget.test.ts` — fuera `slack`, `budgetWithSlack`, `roundHalfToEven` y el test «aplica el margen redondeando al par»; entra el test del GIVEN (decisión 7); los topes de la tabla «Topes de palabras».
- Entra: `CLAUDE.md`, regla 6 — la frase «el saldo de palabras de la skill queda igual o baja» pasa a contar las skills que toca el arreglo juntas (decisión 6).
- Entra: `.docs/sdd/capabilities/archive.md`, «Límites», por el delta (lo fusiona el cierre).
- No entra: recortar texto de ninguna skill (decisión 1); bajar topes holgados (decisión 4); las frases repetidas entre skills, que `kit:own` da hoy en rojo: 0311; `sdd-implement` y `encargo-revision.md`: 0322; `architecture.md:83` dice que `estimation.md` tiene tope de palabras y el test no lo mide: un solo caso, se queda en el ticket.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `const slack = 1.25` y su comentario «Margen del 25 % … hasta la limpieza de la v3» | `cli/test/kit/word-budget.test.ts:11-12` | Scope: sale |
| `budgetWithSlack` | `word-budget.test.ts:59-61`, `:74`, `:106` | Scope: sale; `expectWithin` compara con el tope |
| `roundHalfToEven` y su comentario | `word-budget.test.ts:51-57` | Scope: sale, sin otro uso (`git grep roundHalfToEven`: solo ese fichero) |
| test «aplica el margen redondeando al par» | `word-budget.test.ts:105-107` | Scope: lo sustituye el del GIVEN (decisión 7) |
| «el saldo de palabras de la skill queda igual o baja» | `CLAUDE.md`, regla 6 | Scope: decisión 6 |
| `sdd-archive`, `SKILL.md` 3.920 y total 8.000 | `capabilities/archive.md:265` | delta, «Reglas de la capacidad» |

- Filas que implementa: 0284 → `roadmap.md:160` (la fila), `:202` (B21, «pasa a la fila 0284»), `:711` (deuda «El margen del 25 % deja pasar lo que una spec promete no subir», que salda) y `:133`, `:141`, `:158`, `:159`, `:163`, `:164`, que la nombran en su «antes de» o «tras»: los marca el cierre (`sdd-archive`). Comprobado con `git grep -n "0284\|margen del 25" -- .docs/sdd/roadmap.md`. `slack`, `budgetWithSlack` y «margen del 25» no aparecen fuera del test y del roadmap (`git grep -n -E "slack|budgetWithSlack|margen del 25|1,25"`, sin carpetas de evidencia).

## Approach

- **A. Subir cada tope que se pasa a lo que mide** — una cifra por tope en el test, cada una con su motivo en la tabla; sin sujetos, 0 $. Cuesta que los topes de 8 skills, del kit y de cuatro documentos crecen: 103.372 palabras en el kit, 14.044 más que el tope nominal de hoy.
- **B. Recortar las skills propias que se pasan** (`sdd-init` +148, `sdd-end-release` +20, `sdd-archive` +1.794, `sdd-templates` +1.279) y subir solo las copias — cada recorte es una edición con RED/GREEN de su batería (Art. I): `N=1 node tests/headless/battery.mjs plan tests/batteries/sdd-init/battery.md` → `suma: 7 sujetos · coste previsto: 1.18 $`, y la de `sdd-archive` → `suma: 51 sujetos · coste previsto: 26.93 $`; `sdd-end-release` y `sdd-templates` no tienen batería en `tests/batteries/`. Las cuatro acaban de reescribirse con su batería (0305, 0309, 0310), y ninguna tiene texto que sobre de verdad: `sdd-init/SKILL.md` es una tabla de entrevista y una checklist sin repeticiones dentro de la skill, y lo repetido entre skills es de la 0311.
- **C. Un margen menor como factor** (1,02) — un cambio de una línea, pero es el mismo fallo en pequeño: un factor que nadie lee en la tabla deja pasar lo que la spec promete no subir. El 2 % de la plantilla va en la cifra que aprueba el gate, no en el test.
- **Elegido: A** — es la vía que el dev-lead marca («Subir un tope es más barato que recortar con sujetos: recorta solo donde el texto sobra de verdad»), y en las copias la única que permite la ADR 0022 sin un A/B.

Cómo: `expectWithin(measured, budget)` compara con `budget` y su mensaje, `mide <medido> y el tope es <tope>: recorta, o sube el tope con la decisión del dev-lead escrita en la spec`, no cambia. Los topes que no se pasan no se tocan.

## Dónde se prueba

- Sin margen, una skill por encima de su tope sale en rojo con las dos cifras: `word-budget.test.ts`, el test del GIVEN (decisión 7), RED con el margen y GREEN sin él.
- Cada skill, el kit y los documentos de anclaje caben en su tope nuevo: `word-budget.test.ts` entero, dentro de `moon run cli:test`.
- Sin rojos nuevos en las comprobaciones del kit: `moon run kit:build kit:copies kit:own kit:skill-size`, contra el baseline de `3b179f84` (hoy `kit:own` sale en rojo con 24 frases repetidas, que son de la 0311; `kit:copies` y `kit:skill-size`, en verde).

## Términos y ADR

- Términos resueltos: **tope nominal** — la cifra de la tabla del test, la única que compara desde esta feature; se evita «tope efectivo».
- ADR candidatas: ninguna — quitar un margen provisional que la fila B21 ya preveía no sorprende sin contexto.

## Delta de comportamiento

### Capacidad: `archive`

#### Reglas de la capacidad — archive

- **Límites**: tope de palabras de `sdd-archive`, `SKILL.md` 3.920 y total 9.794 (`cli/test/kit/word-budget.test.ts`); el gate de cierre corre una vez por árbol: en la validación o, con otra rama abierta o la base por delante, solo sobre el merge de sincronización; corre enteras las suites unitarias y `pendiente` de «Suites», y el gate por lo afectado, o entero si la rama toca un fichero de «Sin filtro»; tras un rojo corren los tests que fallaron, los que no llegaron a correr y el gate con `--base <sha rojo>`, y con un arreglo solo de docs, solo los tests que fallaron; tras el merge de sincronización se repiten solo las tareas que tocan la rama y la base a la vez: con un gate filtrado, las que selecciona contra `<merge.into>` y también contra el sha de la última suite en verde; sin filtro, el gate entero si la base trae cambios fuera de `.docs/` que no sean `*.md`; si la base trae un fichero de «Sin filtro», el gate entero; el informe de rojo lleva las últimas 20 líneas; una suite E2E que pasa de su «Presupuesto E2E», o sin presupuesto, una suite de más de 10 minutos, va a la deuda del proyecto; un sha citado es una cadena de 7 a 40 caracteres hexadecimales; los nombres `finishing-a-development-branch`, `sdd-end-feature` y `sdd-end-patch` solo aparecen en `skills/` en la línea de procedencia de `skills/sdd-archive/SKILL.md` y en las migraciones de versiones pasadas (v0.4.0, v2.0.0, v3.0.0)

## Topes de palabras

Medido el 2026-11-09 sobre `3b179f84`, con el conteo de `word-budget.test.ts` (`split(/\s+/)`, frontmatter incluido, `dist/skills/` sin migraciones; los anclas, en `.docs/sdd/`), tras `moon run kit:build`. «Tope» es el nominal. Solo las filas que se pasan; las demás no cambian.

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-agent-writing`, total | 8.949 / 8.760 | −189 | 8.949 — copia de mattpocock/skills y superpowers (`upstream.json`): ADR 0022, regla 1 |
| `sdd-archive`, total | 9.794 / 8.000 | −1.794 | 9.794 — la 0305 lo dejó en ≤ 9.800 por su decisión 16, aprobada, con batería; el exceso son sus `references/` propias |
| `sdd-debugging`, total | 3.407 / 3.400 | −7 | 3.407 — copia de `systematic-debugging`: ADR 0022, regla 1 |
| `sdd-end-release`, `SKILL.md` | 1.920 / 1.900 | −20 | 1.920 — la 0310 la reescribió con su batería y midió el exceso como previo; sin texto que sobre |
| `sdd-init`, `SKILL.md` | 2.648 / 2.500 | −148 | 2.648 — ídem 0310 |
| `sdd-init`, total | 3.193 / 3.100 | −93 | 3.193 — ídem 0310 |
| `sdd-templates`, total | 16.999 / 15.720 | −1.279 | 16.999 — ya medía 16.792 antes de la 0309, que la dejó «sin cambio» con el margen (borrador 16.886, su tabla «Topes de palabras»); el resto, de ramas fusionadas después. Cuenta por el conjunto (decisión 6) |
| `sdd-verify`, total | 9.577 / 9.120 | −457 | 9.577 — copias de superpowers reescritas en la 0307: ADR 0022, regla 1 |
| `sdd-worktrees`, `SKILL.md` y total | 1.431 / 1.300 | −131 | 1.431 y 1.431 — copia de `using-git-worktrees`: ADR 0022, regla 1 |
| Kit entero | 103.372 / 89.328 | −14.044 | 103.372 — la suma de lo medido (decisión 3) |
| `constitution.md` | 2.250 / 2.236 | −14 | 2.250 — texto del dev-lead; pasó el tope en `63d27d13` (+18, `dist/` y la ADR 0023 en el Art. VIII) (decisión 5) |
| `mission.md` | 1.808 / 1.700 | −108 | 1.808 — texto del dev-lead; lo pasaron `686ba9fb` (+9, `sdd-retro`), `e3e544b6` (+85, glosario) y `8f6357c1` (+22, rúbrica de review) (decisión 5) |
| `architecture.md` | 2.253 / 1.900 | −353 | 2.253 — lo migra la 0198 (decisión 5) |
| `tech-stack.md` | 23.181 / 19.663 | −3.518 | 23.181 — lo migra la 0198; recortarlo es reescribirlo (decisión 5) |

## Previsión de coste

No aplica: ninguna skill cambia de texto (decisión 9). Suma: 0 sujetos, 0 $.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-09 | aprobada (opción «Apruebo») |
