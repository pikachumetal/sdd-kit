---
id: 20261109-143437-feature-0311-includes-and-checks
feature: 0311
proposal: 0301
title: Una sola fuente por regla en las skills, y las comprobaciones del corte en el pre-commit y la CI
mode: full
profile: delegate
status: approved
created: 2026-11-09
author: Claude (Opus 5.5) con Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-09
---

# Spec — Una sola fuente por regla en las skills, y las comprobaciones del corte en el pre-commit y la CI

🦆 Hoy el corte de la 3.0.0 tiene un rojo: 23 frases del kit están escritas a mano en dos skills o más, y cuando una cambia, la otra se queda vieja (la definición de desvío ya lo está: `control-profiles.md` no dice que la enmienda pase por un revisor y `sdd-implement` sí). Con esta feature cada una de esas reglas se escribe una vez: o en `includes/`, que el build copia en cada skill que la necesita, o en el paso donde se decide, con las demás apuntando a él. Por ejemplo, «Write everything the user reads in the language of their message…» deja de estar en 15 skills con tres redacciones y pasa a una sola, la que la 0306 midió 10 de 10. Además, `kit:own`, `kit:copies` y `kit:skill-size` pasan a correr en cada commit y en la CI: un commit que vuelve a pegar una frase en dos skills no entra. Y se cierran dos huecos de campo: el cierre mide el tope de palabras de la base antes de escribir un aprendizaje, y el aviso de `kit:own` recuerda releer los pasos que nombran una regla antes de quitar su copia.

Validación: agente — `validation.mode: field` en `.docs/sdd/sdd-kit.json`: el cierre es la verificación registrada (Vitest, humo de las baterías contra el control de `develop`, el commit parado por el pre-commit y el run de la CI), y el uso real llega por los tickets de `sdd-feedback` (`CLAUDE.md`, regla 3).

## Capacidades

- Modificadas: `kit-distribution` — dos requisitos nuevos (una copia incluye dentro de un bloque del kit; las comprobaciones corren en el commit y en la CI); el aviso de la frase repetida pide releer los pasos; `kit:own` y `kit:skill-size` leen la fuente sin reconstruir `dist/`; las tres comprobaciones corren en el pre-commit y en la CI.
- Modificadas: `verification` — las secciones fijas del encargo de los ejes, en inglés («Code constraints», «How to review»).
- Modificadas: `feature-flow` — el encargo del implementador lleva el decálogo tras «Code constraints».
- Modificadas: `archive` — el aprendizaje se mide contra el tope de la rama de integración antes de escribirlo.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: MODIFIED (cinco requisitos en kit-distribution, verification, feature-flow y archive), tres capacidades o más, contrato público (la gramática de la fuente anotada, que leen el build, kit:copies y kit:own) · tamaño: ~700 líneas en ~50 ficheros
- Dominio (opus): si cada uno de los 21 destinos de la tabla del Approach deja la regla al alcance del paso que la aplica (el fallo de la 0310), si la inclusión `deviation` conserva cada rama de las dos definiciones de hoy y el revisor de la 0322, y si la frase nueva de `learnings.md` cubre los dos casos de campo (señal: MODIFIED)
- Técnica (sonnet): si los THEN de la inclusión en una copia se pueden comprobar con `kit:copies` tal como lee bloques hoy, si el pre-commit sin `kit:build` deja ver un `dist/` viejo, la CI con los clones de las fuentes, y la tabla de topes y la previsión de coste (señal: contrato público + MODIFIED)
- Mínimo razonable: un revisor con los siete puntos — deja sin la lectura técnica de la gramática de la copia y del pre-commit, que es donde un error para todos los commits
```

1. **Enfoque: inclusiones también en las copias, dentro de un bloque del kit, frente a quitar la frase de las copias o que `kit:own` no cuente lo incluido (ver Approach).** Es la decisión central: 4 de las 15 inclusiones caen también en una copia, en 8 sitios (la frase de idioma en `sdd-debugging`, `sdd-parallel-agents`, `sdd-tdd`, `sdd-verify` y `sdd-worktrees`; las suites antes del gate en `sdd-verify`; la deuda de un rojo de la base en `sdd-worktrees`; el effort no disponible en `sdd-parallel-agents`), y hoy una copia no admite inclusiones (decisión 4 de la 0304: «no toco su gramática»). Se cambia esa decisión.
2. **El destino de cada frase es el de la tabla del Approach**: 15 inclusiones nuevas en `includes/` (las filas 17 y 19 comparten `deviation`) y 4 frases que salen de un sitio y quedan solo en el paso que las decide (filas 12, 13, 14 y 16), más la celda de la tabla de `control-profiles.md` que deja de repetir los frenos de alcance (fila 18). Cada una se escribe tras releer, en la skill que pierde la copia, cada paso que nombra la regla por su posición (decisión del encargo; fila de deuda «Quitar la copia de una regla deja un paso que ya no llega a ella»).
3. **La regla de releer los pasos va en el aviso de `kit:own`, no en `sdd-agent-writing`.** El aviso de la frase repetida pasa a ser «déjala en un solo sitio, en includes/ si la necesitan varias skills; antes de quitar una copia, relee cada paso que la nombra por su posición: su orden tiene que dejar aplicarla». Es el momento en que se decide quitar la copia, el pre-commit lo enseña en cada commit que la crea, y no alarga ninguna skill (`CLAUDE.md`, regla 6). `sdd-agent-writing` es copia de mattpocock: escribirla allí sería sustituir su «single source of truth» con una frase más larga, y la leería quien escribe una skill, no quien deduplica. Deja sin cubrir quitar una copia que `kit:own` no ve (una paráfrasis, como en la 0306): lo sigue viendo la revisión final.
4. **`kit:own` y `kit:skill-size` leen la fuente con las inclusiones expandidas y pierden `deps: ['~:build']` en `moon.yml`.** Con `kit:build` dentro del pre-commit, el build reescribe `dist/` en disco y `dist.test.ts` pasa aunque el commit lleve un `dist/` viejo. `kit:own` ya lee `skills/` y `includes/` (`tests/own/kit-text.ts`); `kit:skill-size` lee hoy `dist/skills/*/SKILL.md` y pasa a `renderLines` de `build/dist.ts`, que da lo mismo que el build. Sus avisos siguen nombrando `dist/skills/<skill>/<fichero>:<línea>`: la ruta y la línea de la salida del build, donde cae el texto, también si `dist/` aún no está reconstruido; `<línea>` es la de `renderLines`, que es la que tendrá `dist/`.
5. **`kit:copies` en el pre-commit solo corre si el commit toca `skills/`, `includes/` o `upstream.json`** (`git diff --cached --name-only` en `.githooks/pre-commit`, como el control de lo que el commit lleva del patch 0176): necesita `SDD_UPSTREAM_DIR`, y sin la variable da `Falta SDD_UPSTREAM_DIR: la carpeta con los clones de las fuentes vigiladas.` y sale con 1 (medido hoy). Así los commits de ticket y triaje de la sesión `develop` (regla 6), que solo tocan `.docs/`, no lo necesitan. Si un clon no tiene el tag que pide `upstream.json`, el commit que toca `skills/` se para con el aviso que ya da `kit:copies` (`<fuente>: falta <versión> en el clon <ruta>`), hasta un `git fetch --tags` en ese clon. `CLAUDE.md` pide la variable junto a `core.hooksPath`, una vez por máquina. `kit:own` y `kit:skill-size` no necesitan nada y corren en cada commit. En la CI, un paso clona entero (con sus tags) cada `repo` de las `sources` de `upstream.json` en `$RUNNER_TEMP/upstream` y exporta la variable. `kit:copies` ya encuentra cada clon por su `remote.origin.url` (`findClones` de `tests/upstream/clones.ts`), no por el nombre de la carpeta: no cambia. Un clon que falla para el job antes de la suite, y se relanza como dice `tech-stack.md` («CI de la base»).
6. **Las secciones fijas del encargo se traducen así**: `## Restricciones de código` → `## Code constraints`, `## Cómo revisar` → `## How to review`, y su texto en castellano dentro de los bloques (la cabecera de `encargo-revision.md`, «Cómo revisar», el cuerpo de «Review Focus», la frase «Revisas `<sha>` como si fuera el último commit…», «Si una regla de aquí choca con las Restricciones de código, mandan las Restricciones» de `implementer-prompt.md`) pasa a inglés con el mismo sentido. Los nombres de la plantilla del proyecto que el bloque cita, «De código», «De proceso» y «Restricciones globales», se quedan en castellano: son literales de `plan-template.md`. En las copias va con marca `sustituye`.
7. **La frase nueva de `learnings.md`**, que sustituye el primer párrafo de «A destination at its word cap»: «Before writing a learning into a document with a word cap, `git fetch` and measure the document as the closing's sync merge will leave it (`origin/<integration>`'s version with the branch's changes) plus the learning, against the cap on `origin/<integration>` (`git show origin/<integration>:<the file that sets the cap>`), not the branch's. If it doesn't fit, a rule of a skill with a battery (`tests/batteries/<skill>/`) goes to that battery's provenance; otherwise the oldest piece that already lives elsewhere leaves and the learning enters, without asking: its other home keeps it.» El resto del párrafo («With no such piece, ask…») no cambia. Casos de campo: [ticket de la feature 0322](../../field-reports/20261109-131031-feature-0322-deviations-and-amendments.md) §5 (el pre-commit del merge de sincronización: «mide 23301 y el tope es 23181», con el tope de la rama aún con margen), que reproduce `c2`; y el [del patch 0294](../../field-reports/20261109-124833-patch-0294-rule-form-after-failed-green.md) (la constitution en 2.250 de 2.250 en la propia rama: el borrador perdió una definición para caber), que ya cubre la salida «the oldest piece… leaves» y no cambia.
8. **Las inclusiones no llevan enlaces relativos**: una misma línea cae en ficheros a profundidades distintas (`sdd-implement/SKILL.md` y `sdd-propose/references/control-profiles.md`), y el enlace se rompería en uno. Nombran el fichero y su skill en código (`` `frontend-verification.md` of `sdd-implement` ``); el enlace, si el paso lo necesita, se queda en la línea de la skill junto a la inclusión.
9. **La frase de idioma entra solo en las 15 skills que `kit:own` marca** (las 13 del Overview más `sdd-explore` y `sdd-roadmap`). `sdd-retro`, `sdd-grilling`, `sdd-rubber-duck`, `sdd-agent-writing` y `add-to-changelog` conservan la suya: no la repiten en 10 palabras seguidas, y medirla en ellas sería otra campaña.
10. **⚠ Topes de palabras, para que lo decidas tú.** `word-budget.test.ts` cuenta `dist/` con las inclusiones expandidas (medido): una inclusión no ahorra palabras, y la frase de idioma suma +19 en 13 skills y +10 en `sdd-templates` (+257). Las salidas de las filas 12-18, la unión de las dos definiciones de desvío y la traducción restan; la suma de la columna «Previsto» de la tabla da −85 en el kit. Propongo: el **total del kit** (`kitBudget`, hoy 103.372 con 103.338 medidas) **no sube**, y el saldo de las skills tocadas, contadas juntas, queda igual o baja (`CLAUDE.md`, regla 6). Durante la implementación suben, con la fórmula de `feature-flow` (lo medido más lo previsto más un 2 %, mínimo 20 palabras), solo los topes de las 8 skills de la tabla que no caben, con la cifra de su columna «Tope propuesto»; al cierre, cada tope tocado baja a su medida exacta (como desde la 0284). El margen previsto del kit es 34 + 85 = 119 palabras y se mide al cerrar cada task. Como la frase de idioma suma +257 con certeza y las salidas son estimación, el plan pone primero las salidas y la inclusión `deviation` y la frase de idioma en la última task de texto, para que `word-budget.test.ts` no se ponga rojo entre tasks. Si, con todo hecho, el kit pasa de 103.372, es un desvío: paro y decides tú entre recortar o subir `kitBudget`.
11. **Las filas 0152 y 0198**: la orden de corte de la 0152 y de la regla 5 de `CLAUDE.md` gana `kit:copies` (`… kit:build kit:skill-size kit:own kit:copies cli:test-slow cli:test-min`), y la 0152 pierde «sale de la 0311» si ya no aplica. La 0198 migra `.docs/sdd/` sin tocar `skills/`: el pre-commit nuevo solo le pide `SDD_UPSTREAM_DIR`; si al releerla nada más la cambia, no se toca, y el walkthrough lo dice.
12. **⚠ `CLAUDE.md` cambia en dos líneas**: la de `core.hooksPath` pide también `SDD_UPSTREAM_DIR` una vez por máquina (decisión 5), y la orden de la regla 5 gana `kit:copies` tras `kit:own`; nada más de la regla 5 cambia. Está en la lista de ficheros de la fila 0311.
13. **`tech-stack.md` está en su tope exacto (23.181 de 23.181)**: el punto «Herramientas del repo», el de «Conjunto rápido» y el de «CI de la base» se reescriben sin crecer, y lo que dicen hoy de `kit:copies`, `kit:own` y `kit:skill-size` fuera de hooks («hasta la 0311», «hasta que quepan todas las skills») sale.
14. **Medida (Art. I)**: humo con N=1 por batería en los pasos que cambian (tabla de «Previsión de coste»), y control con el kit de `develop` solo del escenario que salga rojo. La frase de `learnings.md` es guidance nueva y lleva un escenario nuevo de `sdd-archive`, `c2` (un aprendizaje para `tech-stack.md` con margen en la rama y tope exacto en `origin/develop`): RED con n=2 y el kit de `develop`, y GREEN con n=2. Va en el Scope como «si el RED lo exhibe»: con un RED limpio la frase no se escribe, el MODIFIED de `archive` («Un aprendizaje cuyo destino no cabe tiene salida») sale del delta con un `Ruling:`, y la fila de deuda queda abierta con lo medido. Su regla de Límites (el tope sin cifras) se queda: no depende del RED.
15. **Las filas de rúbrica que nombran «Restricciones de código»** (`h2` de `sdd-implement`, `f1` de `sdd-verify`) y `compose-axis.mjs` de `sdd-verify` pasan a «Code constraints» / «How to review»; el control con `develop` da rojo en esas filas por diseño, y no cuenta como regresión.
16. **Al unir dos redacciones, la inclusión toma la más corta que conserva cada condición de las dos**; lo que solo dice una se queda en esa skill junto a la inclusión. La de idioma toma la de `sdd-propose` (decisión del roadmap).
17. **La inclusión `deviation` reemplaza el punto «Deviation» de «Deviations and rulings» de `sdd-implement` y el primer párrafo y el primer y el tercer punto de la acción update de §Deviation de `control-profiles.md`.** El punto «Rulings» de `sdd-implement` conserva su primera frase («The scope brakes and the deviations below are not rulings, and they stop»); la definición del ruling pasa a la inclusión. Ramas → destino: la definición (requisito, THEN, Scope, «No entra», «Dónde se prueba») · el Scope «si el RED lo exhibe» con RED limpio a n = 3 · el ruling (un fichero de «NO se tocan», otro orden, un fix del hilo) · en `pair` y `delegate`, la corrección en su sitio y su línea de «Enmiendas» sin commitear · el revisor `sonnet` (`sdd-kit:effort-medium`) con los siete puntos si cambia el delta · parar con 🦆 y ✋ y esperar · aprobada, lo que toca una task cerrada va a una task nueva al final y `tasks.md` marca la cerrada · `unattended`, la opción conservadora `sin aprobar`, y aparcar si bloquea · la ronda de REFACTOR o de fix que añade o cambia un THEN o un AND es desvío · el AND que aplica literal una línea de «Decisiones tomadas con el dev-lead», `sin aprobar` y nombrado en ✋ → **en la inclusión**. El detalle de la aprobación (`sdd task start` y `sdd task done` de la task nueva, la task en curso, la evidencia `u1`) y los ficheros añadidos con su solape en el roadmap → **se quedan en `control-profiles.md` §Deviation**. La respuesta a un freno de alcance que cambia la spec → **se queda en `control-profiles.md` §Scope brakes**. El umbral de 20 líneas sin revisor es de «Every commit of yours» de `sdd-implement` → **no se toca**.
18. **Las comprobaciones del pre-commit miden el árbol de trabajo, no el índice**, como `cli:test` hoy (`tech-stack.md`, «Conjunto rápido»): un `dist/` viejo staged con uno bueno sin stagear pasa, igual que antes de esta feature. `kit:skill-size` usa `renderLines` de `build/dist.ts`, la misma función con la que el build escribe `dist/`, así que mide los mismos bytes; `kit:own` ya la usa (`tests/own/kit-text.ts`).
19. **Una inclusión en una copia `pending` vale en cualquier sitio**: la copia entera cuenta como texto del kit (decisión 5 de la 0304). Hoy no hay ninguna copia `pending` (`kit:copies` da «Copias al día: 31 ficheros»).
- Política de modelos: revisores de la spec, dominio en `opus` y técnica en `sonnet`, con `sdd-kit:effort-medium` · ejes de la revisión final: Spec `opus`+high, Código `sonnet`+high, sin eje Arquitectura (texto de skills y herramientas del repo, sin capas) · sujetos de las baterías en `sonnet`, por tandas · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar que piden tus instrucciones; lo que no nombra se confirma aparte
- Repaso de coherencia: `sdd capability merge` sobre una copia de `.docs/sdd` aplica el delta entero (5 requisitos modificados, 2 añadidos y 2 reglas de `kit-distribution`, 1 y 1 de `verification`, 1 de `feature-flow`, 1 y 1 de `archive`: 14 líneas), sin rechazos, también tras las dos rondas de review. Medido hoy: `node tests/own/check.ts` da 23 líneas; `kit:copies` sin `SDD_UPSTREAM_DIR` da su aviso y sale con 1; `kit:skill-size` y `kit:copies` (con la variable) en verde. `sin medir`: el saldo exacto de palabras, que sale del borrador de cada task.

### Hallazgos de la review

Dominio (opus):

- **Aceptado** — D1 (Crítico): el MODIFIED de `verification` perdía el último AND, el de `Política de modelos:` → copiado sin cambios al final del bloque. Abre la segunda ronda.
- **Rechazado** — D2 (Crítico): la fila 16 sería un MODIFIED sin declarar de `control-profiles` → la excepción de los tres registros ya está en `control-profiles.md:113`; la fila la sube al paso que aplica el cruce sin cambiar la conducta. Que el requisito de la capacidad no la nombre es un hueco de antes, fuera de esta feature. La fila dice ahora «sube… sin cambiar», no «gana». Las filas 17 a 19 tampoco cambian conducta: unen dos textos que la capacidad ya describe juntos (con el revisor).
- **Aceptado** — D3: la inclusión `deviation` no decía en qué sección cae ni qué ramas conserva → decisión 17, rama por rama.
- **Rechazado** — D4: al quitar la frase de `encargo-revision.md`, SDD se quedaría sin la regla → `sdd-verify` «Final review» la dice para los dos métodos («in Native, the last task's; in SDD, the squashed one…»); citado en la fila 12.
- **Aceptado** — D5: la frase de `learnings.md` medía la rama, no lo que deja el merge, y no nombraba los casos → decisión 7 mide la versión de la base con los cambios de la rama más el aprendizaje, y nombra 0322 §5 (lo reproduce `c2`) y 0294.
- **Aceptado** — D6: el GIVEN de `archive` subía el tope en la rama y usaba la cifra real → cifras inventadas (900, 950 en la rama, 920 en la base, 40 de aprendizaje), y la base lo bajó.
- **Aceptado** — D7: con un RED limpio, el MODIFIED de `archive` quedaría aprobado → «si el RED lo exhibe» en el Scope; sale del delta con un `Ruling:` (decisión 14).
- **Aceptado** — D8: topes sin cifra → columna «Tope propuesto» con la fórmula de `feature-flow` en las 9 skills que no caben.
- **Aceptado** — D9: el pre-commit pararía los commits de `.docs/` sin `SDD_UPSTREAM_DIR` → `kit:copies` solo si el commit toca `skills/`, `includes/` o `upstream.json`; el clon sin el tag, dicho (decisión 5 y delta).
- **Rechazado** — D10: (a) el cambio de método a mitad del plan se quedaría sin los factores → no los usa: es la regla fija de compactación de `sdd-implement`, citada en la fila 14; (b) las Reglas del delta no declaran las cinco → la plantilla pide solo las entradas que cambian.

Técnica (sonnet):

- **Aceptado** — T1: los bordes del bloque con una inclusión → AND con la segunda línea, antes de `fin` y tras la línea en blanco; la inclusión no abre ni cierra bloque.
- **Aceptado** — T2: inclusión dentro de una valla de una copia → `kit:copies` da el aviso del build.
- **Aceptado en parte** — T3: el pre-commit mide el árbol, no el índice → dicho en la decisión 18; es como hoy con `cli:test`. Rechazado el test byte a byte: `kit:skill-size` usa `renderLines`, la misma función con la que escribe el build.
- **Aceptado en parte** — T4: el paso de la CI → clon entero con tags, sin `--filter`; `kit:copies` encuentra el clon por `remote.origin.url`; un clon que falla para el job antes de la suite (decisión 5). La ejecución real es el run de la rama.
- **Aceptado** — T5: lo mismo que D9.
- **Aceptado** — T6: las dos cuentas de topes no cuadraban → la tabla suma −85 y la decisión 10 la cita.
- **Aceptado** — T7: `sdd-implement-subagent` con 0 → −10 por la traducción; en `sdd-verify`, dicho que la incluye.
- **Aceptado** — T8: el THEN de `archive` no salía con sus números → ver D6; `git fetch` antes de medir.
- **Aceptado** — T9: decisiones del cuerpo fuera de ✋ → decisiones 16, 17 y 19.
- **Rechazado** — T10: `inputs` de moon para `own` y `skill-size` → las dos van con `cache: false` en `moon.yml` y corren siempre; `renderLines` ya es la API que comparten el build y `kit:own`.

Segunda ronda (sonnet, siete puntos), sin Críticos:

- **Aceptado** — S1: el +257 de idioma es seguro y las salidas no; entre tasks, `word-budget.test.ts` se pondría rojo → el plan pone las salidas y `deviation` primero y el idioma en la última task de texto; si con todo hecho el kit pasa de 103.372, es un desvío (decisión 10).
- **Aceptado** — S2: dos criterios para «no cabe» → uno solo, medido + previsto > tope; `sdd-upgrade` queda sin cambio (980 justo), y quedan 8 skills que suben.
- **Aceptado** — S3: faltaba cada paso con su escenario → tabla «Cada paso que cambia, con su escenario» en «Previsión de coste».
- **Aceptado** — S4: los AND sobre copias y sobre el pre-commit colgaban de GIVEN que no los ejercen → dos ADDED, «Una copia incluye dentro de un bloque del kit» y «Las comprobaciones de las skills corren en el commit y en la CI», con su GIVEN y su WHEN.
- **Aceptado en parte** — S5: el clon sin tag y la CI sin THEN, `$RUNNER_TEMP/upstream` sin declarar, una frase rota → los AND están en el ADDED del commit, la ruta en «Dónde viven los datos» y la frase reescrita. Encontrar el clon por `remote.origin.url` no es contrato nuevo: ya lo hace `findClones` de `tests/upstream/clones.ts`.
- **Aceptado** — S6: el GIVEN de `archive` decía que la base midió a 920 → «bajó el tope a 920 sin tocar el contenido».
- **Aceptado** — S7: la decisión 12 era condicional → la regla 5 solo gana `kit:copies`.
- **Aceptado** — S8: faltaba «De proceso» en «Idioma de los nombres» → añadido.
- **Aceptado** — S9: `architecture.md` en su tope sin «sin crecer» → añadido al Scope.
- **Aceptado** — S10: el aviso nombra `dist/` sin `dist/` reconstruido → la decisión 4 dice que nombra la ruta y la línea de la salida del build, la de `renderLines`.

### Decisiones tomadas con el dev-lead

- Las frases que `kit:own` da repetidas entre skills pasan a `includes/` — revisión del roadmap, 2026-11-05: «si»
- El bloque literal del encargo de los ejes se traduce a la vez en los seis encargos, hasta que `grep -rn "Restricciones de código" skills/` no devuelva nada — 2026-11-05: «ok, escríbelo así»
- Antes de quitar la copia de una regla, se releen los pasos que la nombran por su posición — 2026-11-09: «si»
- Las frases de «Deviations and rulings» y la receta del paquete salieron a la 0322 — 2026-11-09: «si, y saca la feature aparte»
- El corte de la release es de la 0152 — 2026-11-09: «ok»
- Arranque de esta feature con el perfil `delegate`, el alcance, las decisiones y el «está hecho cuando» del prompt de la sesión de coordinación «sdd-kit develop», a petición del dev-lead (2026-11-09)

## Intent

Hoy `node tests/own/check.ts` da 23 líneas: reglas escritas a mano en dos skills o más, con redacciones que ya divergen (la definición de desvío de `control-profiles.md` no lleva el revisor de la enmienda que `sdd-implement` sí; la frase de idioma tiene tres versiones en 15 skills). Es el único rojo del corte de la 3.0.0, y nada impide que vuelva: `kit:own`, `kit:copies` y `kit:skill-size` solo corren a mano. El éxito: `node tests/own/check.ts` da `Skills al día`, `grep -rn "Restricciones de código" skills/` no devuelve nada, un commit con una frase repetida entre dos skills lo para el pre-commit, la CI corre las tres comprobaciones, la orden de corte de la regla 5 sale en verde, y las baterías de las skills tocadas no tienen rojos nuevos contra el control con el kit de `develop`. Sería un fracaso, aunque `kit:own` salga en verde, que un paso deje de llegar a la regla que se le quitó (como en la 0310), o que la frase de idioma vuelva a soltar líneas en inglés donde hoy no.

## Scope

- Entra: la inclusión dentro de un bloque del kit de una copia (build, `kit:copies` y `kit:own`), con sus tests.
- Entra: las 21 filas de la tabla del Approach, con sus 15 ficheros de `includes/`.
- Entra: la inclusión `deviation`, una sola definición del desvío y la acción update, con el revisor de la enmienda (decisión 15 de la spec de la 0322), en `skills/sdd-implement/SKILL.md` y en `skills/sdd-propose/references/control-profiles.md`.
- Entra: la traducción de las secciones fijas del encargo (decisión 6) en `skills/sdd-verify/references/encargo-revision.md`, `skills/sdd-verify/references/{spec,code,architecture}-reviewer-prompt.md`, `skills/sdd-implement-subagent/{implementer,task-reviewer,re-review}-prompt.md`, `skills/sdd-implement/SKILL.md` (red flag) y `skills/sdd-implement-native/SKILL.md` si la nombra; en `.docs/sdd/capabilities/verification.md` y `feature-flow.md` (delta); en `tests/batteries/sdd-implement/battery.md` (`h2`), `tests/batteries/sdd-verify/battery.md` (`f1`) y `tests/batteries/sdd-verify/compose-axis.mjs`.
- Entra, si el RED lo exhibe: la frase de «A destination at its word cap» de `skills/sdd-archive/references/learnings.md` (decisión 7) y el MODIFIED de `archive` «Un aprendizaje cuyo destino no cabe tiene salida»; el escenario `c2` de la batería de `sdd-archive` entra siempre (decisión 14).
- Entra: el aviso nuevo de `kit:own` (decisión 3) en `tests/own/repeated.ts`.
- Entra: `kit:own` y `kit:skill-size` sin `kit:build` (decisión 4): `moon.yml`, `tests/skill-size/check.ts`.
- Entra: `kit:own` y `kit:skill-size` en `.githooks/pre-commit` en cada commit, y `kit:copies` en los que tocan `skills/`, `includes/` o `upstream.json`; las tres en `.github/workflows/ci.yml`, con los clones de las fuentes (decisión 5).
- Entra: los topes de `cli/test/kit/word-budget.test.ts` (decisión 10).
- Entra: `.docs/sdd/tech-stack.md` (decisión 13), `CLAUDE.md` (decisión 12), las filas 0152 y 0198 de `roadmap.md` (decisión 11), y `architecture.md` si su línea de `includes/` («una regla que necesitan dos skills propias») deja de ser cierta, sin crecer: está en su tope exacto (2.253 de 2.253).
- No entra: el corte de la release (0152) ni la migración de este repo (0198).
- No entra: las frases repetidas que `kit:own` no marca (paráfrasis, rachas de menos de 10 palabras), ni la frase de idioma de las skills de la decisión 9.
- No entra: reescribir `sdd-agent-writing` (decisión 3).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `## Restricciones de código` → `## Code constraints` | `skills/sdd-verify/references/encargo-revision.md:6`, `spec-reviewer-prompt.md:17`, `code-reviewer-prompt.md:17`, `architecture-reviewer-prompt.md:17`; `skills/sdd-implement-subagent/implementer-prompt.md:23`, `re-review-prompt.md:23`, `task-reviewer-prompt.md:23` | Scope (decisión 6) |
| «Restricciones de código» citado en prosa | `skills/sdd-implement/SKILL.md:78`, `implementer-prompt.md:31`, `task-reviewer-prompt.md:42` y `:214`, `code-reviewer-prompt.md:110` y `:122`, `architecture-reviewer-prompt.md:98`, `encargo-revision.md:80` | Scope (decisión 6) |
| «Restricciones de código» en las capacidades | `verification.md:28`, `feature-flow.md:532` | delta, `MODIFIED` |
| «Restricciones de código» en baterías | `tests/batteries/sdd-implement/battery.md:123` (`h2`), `tests/batteries/sdd-verify/battery.md:86` (`f1`) | Scope (decisión 15) |
| `## Cómo revisar` → `## How to review` | `encargo-revision.md:59` y `:66`, `spec-reviewer-prompt.md:32`, `code-reviewer-prompt.md:44`, `architecture-reviewer-prompt.md:32`, `tests/batteries/sdd-verify/compose-axis.mjs:27` | Scope (decisión 6) |
| `## Restricciones de código` como ejemplo de prosa en castellano | `kit-distribution.md:219`, `cli/test/kit/own.test.ts:247`, `cli/test/fixtures/own/spanish-sample.md:10` | se queda: es un ejemplo de línea en castellano que `kit:own` marca, no el encargo |
| Aviso «déjala en un solo sitio, en includes/ si la necesitan varias propias» | `tests/own/repeated.ts:8`, `cli/test/kit/own.test.ts:15`, `kit-distribution.md:193` | Scope y delta, `MODIFIED` (decisión 3) |
| Aviso «una inclusión es solo de las propias, y <fichero> es una copia» | `tests/own/check.ts:22`, `cli/test/kit/own.test.ts:214-215`, `kit-distribution.md:187` | delta, `MODIFIED`: sale; una inclusión fuera de un bloque del kit de una copia la avisa `kit:copies` |
| `kit:copies` contra `incluye` dentro de un bloque | `tests/copies/annotated.ts` (`parseMark`), `kit-distribution.md:186` | delta, `MODIFIED` |
| «primero reconstruye `dist/` con `kit:build`» y `deps: ['~:build']` | `kit-distribution.md:228`, `moon.yml` (`own`, `skill-size`) | delta, `MODIFIED` (decisión 4) |
| «no corre en el pre-commit ni en la CI» y los comentarios «Fuera del pre-commit y de la CI» | `kit-distribution.md:230`, `moon.yml` (`skill-size`, `copies`, `own`), `tech-stack.md:6` | delta, `MODIFIED`; Scope |
| Orden del pre-commit `moon run cli:typecheck cli:test kit:roadmap` | `.githooks/pre-commit:11`, `tech-stack.md:8` | Scope |
| Orden de la CI `kit:test-headless cli:typecheck cli:test-min` | `.github/workflows/ci.yml`, `tech-stack.md:37` | Scope |
| Orden de corte sin `kit:copies` | `CLAUDE.md` regla 5, `roadmap.md` fila 0152 | Scope (decisión 11) |
| «en el pre-commit y la CI desde la 0311» | `.docs/sdd/decisions/0022-three-rules-for-kit-text.md:46` | se queda: es lo que esta feature cumple; la ADR no se edita |
| Tope de `sdd-archive` escrito en la capacidad (3.920 y 9.794) | `archive.md:265` | delta, Reglas `MODIFIED`: pasa a nombrar `word-budget.test.ts` sin cifras, que esta feature cambia |
| Frase de idioma de 11 palabras (y la de 20 de `sdd-templates`) | Overview de los 15 `SKILL.md` de la decisión 9 | Scope: inclusión `user-language` |
| Definición de desvío y acción update de `control-profiles.md` §Deviation | `control-profiles.md:71-74` | Scope: inclusión `deviation`; la sección conserva lo que la inclusión no dice |
| Lista de frenos de alcance en la tabla de gates | `control-profiles.md:58` | Scope (fila 18) |
| «Trigger» del cruce con la base | `control-profiles.md:113` | Scope (fila 16) |
| «Its reason weighs four factors…» | `skills/sdd-implement/SKILL.md:20` | Scope (fila 14) |

- Filas que implementa: 0311 → `roadmap.md:157` (la fila), `roadmap.md:162-163` (0198 y 0152 la nombran en su «tras»), `tech-stack.md:6` («hasta la 0311»), ADR 0022 (sin cambio); «Quitar la copia de una regla deja un paso que ya no llega a ella» → `roadmap.md:254`; «Un aprendizaje en un documento en su tope rompe el `sdd merge --sync`» → `roadmap.md:255`. Las tres las cierra `sdd-archive`. Comprobado con `git grep -n "0311"` fuera de `specs/`, `field-reports/` y `tests/*.md`.

## Approach

- (A) **Inclusiones también en las copias, dentro de un bloque del kit** — `kit:copies` lee `<!-- kit: incluye <nombre> -->` como una línea más del bloque abierto en vez de como una marca; fuera de un bloque es un rojo de `kit:copies`. Cuesta un cambio en `tests/copies/annotated.ts` y en `tests/own/check.ts`, con sus tests, y deshace la decisión 4 de la 0304. A cambio, cada regla tiene una sola fuente aunque la necesiten una propia y una copia.
- (B) **Quitar la frase de las copias** y dejarla solo en las propias que las invocan — no cuesta código, pero la frase de idioma desaparece de `sdd-tdd`, `sdd-debugging`, `sdd-worktrees`, `sdd-parallel-agents` y `sdd-verify`, que en Native hablan con el usuario desde el hilo; la 0306 midió que la frase importa en la skill que se está siguiendo (7 de 160 sujetos de control con líneas en inglés). Pediría un A/B por skill.
- (C) **Que `kit:own` no cuente lo que entra por una inclusión** — una línea en `canPair`, pero la regla seguiría en `includes/` y en cinco copias: seis fuentes de la misma regla con un detector en verde.
- Elegido: (A). Es el único que deja una fuente por regla sin quitar texto medido.

Lo que fija el enfoque:

- La línea de la inclusión va sola, dentro del bloque de la marca del kit que ya lleva la frase (en `sdd-tdd`, el de `<!-- kit: 0312 -->`); si la frase compartía línea con otra («Forked from…»), se parten en dos líneas del mismo párrafo.
- Una inclusión en una copia `pending` vale en cualquier sitio: la copia entera cuenta como texto del kit.
- Lo que entra por una inclusión no es texto del kit de ninguna skill que la incluye, propia o copia, y no se empareja; escrito a mano en otra skill, sí.

Destino de cada racha que da `kit:own` hoy (líneas de `dist/`):

| # | Racha | Sitios | Destino |
| --- | --- | --- | --- |
| 1 | «write everything the user reads in the language of their» y «… in their language skill announcements» | Overview de `sdd-archive`, `sdd-debugging`, `sdd-end-release`, `sdd-implement`, `sdd-init`, `sdd-parallel-agents`, `sdd-propose`, `sdd-tdd`, `sdd-templates`, `sdd-upgrade`, `sdd-verify`, `sdd-worktrees`, `using-sdd`, `sdd-explore`, `sdd-roadmap` | inclusión `user-language`, con la frase de `sdd-propose` (0306) |
| 2 | «the literals of the project's documents stay as written here» | `sdd-end-release`, `sdd-retro` | inclusión `document-literals` |
| 3 | «a decision about what the user sees or can do» | `sdd-archive` cláusula de escalado, `patch-flow.md` paso 3 | inclusión `patch-lane-exit` |
| 4 | «command is the gate's or one of the tasks the gate runs» | `closing-suite.md`, `sdd-verify` «Running a gate» paso 1 | inclusión `suites-before-gate` |
| 5 | «if the line says «juntada en el cierre», the closing commit» | `final-review-check.md` paso 2, `control-profiles.md` (la re-revisión), `closing-the-review.md` «The last reviewed sha» | inclusión `last-reviewed-sha` |
| 6 | «in the project's debt (… «Deuda técnica» of the 2.x roadmap)» | `merge-recipe.md`, `sdd-worktrees` «If tests fail» | inclusión `base-red-debt` |
| 7 | «… you fix in the roadmap, never in the validator» y «the «Roadmap en la forma de la plantilla» step of» | `records.md`, `sdd-roadmap` paso 5 | inclusión `roadmap-check-failures` |
| 8 | «the same with any sha of the range that …» | `records.md`, `commit-milestones.md` | inclusión `squash-cited-shas` |
| 9 | «el kit no define ese valor, no voy a suponer» | `validation-modes.md`, `control-profiles.md` §Field validation | inclusión `field-validation-defined` |
| 10 | «or «composición no medida» or «no probado» with its reason» | `validation-modes.md`, `sdd-implement` «In `pair`» | inclusión `visual-evidence` |
| 11 | «end with «si prefieres hacerlo en esta sesión, di "arráncalo"»» | `sdd-explore` (Config), `sdd-roadmap` paso 7 | inclusión `start-here-offer` |
| 12 | «… out in the background as soon as the last task's commit exists» | `sdd-implement-native` Finish, `encargo-revision.md` | sale de `encargo-revision.md`, que se lee al componer el encargo, después de decidir cuándo sale: queda el porqué del worktree desanclado. La regla la siguen dando, para los dos métodos, `sdd-verify` «Final review» («Dispatch it in the background as soon as the last task's commit exists —in Native, the last task's; in SDD, the squashed one…») y Finish de `sdd-implement-native` |
| 13 | «the «What to Check» of the axes that went out» | `re-review-prompt.md` (cómo se rellena), `closing-the-review.md` «The single re-review» | sale de `closing-the-review.md`: el hilo rellena la plantilla con ella abierta, y su primer párrafo lo dice |
| 14 | «reason weighs four factors by name, with no numeric threshold» | `sdd-implement` (método), `plan-writing.md` | sale de `sdd-implement`: la razón se escribe en `plan-writing.md`, y `sdd-implement` solo lee la línea `Ejecución`. El cambio de método a mitad del plan no usa los factores: es la regla fija de `sdd-implement` «After a compaction in Native with two or more tasks without their `complete` line, invoke `sdd-implement-subagent`» |
| 15 | «effort: no disponible en este harness, hereda el de la sesión» | `sdd-implement` «Effort», `sdd-parallel-agents` | inclusión `effort-unavailable` |
| 16 | «other lines, or an overlap the spec declares with file and region» | `sdd-implement` paso 1, `control-profiles.md` «Task's file changed in the base» | se queda en el paso 1 de `sdd-implement`, que se aplica antes de cada task; la excepción de los tres registros compartidos (`roadmap.md`, `changelog.md`, `estimation-log.md`), que hoy solo está en `control-profiles.md:113`, sube a ese paso sin cambiar, y `control-profiles.md` remite a él |
| 17 | «the spec (a file under «NO se tocan», another order, a fix …)» | `sdd-implement` «Rulings», `control-profiles.md` §Deviation | inclusión `deviation` (qué rama va dentro y cuál se queda: decisión 17) |
| 18 | «observable output, the feature's row or the task's lines changed in the base» | `sdd-implement` «Scope brakes», tabla de gates de `control-profiles.md` | sale de la celda de la tabla, que remite a §Scope brakes, justo debajo |
| 19 | «the approved spec (a requirement, a THEN, the Scope, a …)» | `sdd-implement` «Deviation», `control-profiles.md` §Deviation | inclusión `deviation` |
| 20 | «you're about to edit code and the plan isn't approved» | red flags de `sdd-propose` y `sdd-implement` | inclusión `unapproved-plan-flag` |
| 21 | «and without commits of its own against the integration branch» | `patch-flow.md` paso 2, `nombrado.md` | inclusión `slug-branch-rename` |

Donde dos redacciones difieren, la inclusión toma la más corta que conserva cada condición de las dos; lo que solo dice una, se queda en esa skill junto a la inclusión. Las cinco salidas (filas 12, 13, 14, 16 y 18) se escriben después de releer el paso que pierde la frase y los que lo nombran por su posición, y la evidencia de esa relectura va al walkthrough.

## Dónde se prueba

- La inclusión en una copia: `cli/test/kit/copies.test.ts` (dentro de un bloque `add` y de uno `sustituye`, fuera de un bloque), `cli/test/kit/dist.test.ts` (el build la expande en una copia) y `cli/test/kit/own.test.ts` (una racha que entra por inclusión en una copia y en una propia no da rojo; escrita a mano en otra, sí), como los casos de inclusión de la 0304.
- El aviso nuevo de la frase repetida: `cli/test/kit/own.test.ts`, con el literal.
- `kit:own` y `kit:skill-size` sin `dist/`: `own.test.ts` y `skill-size.test.ts`, con un repo temporal sin `dist/` y una inclusión.
- Ninguna frase repetida: `node tests/own/check.ts` → `Skills al día: <n> ficheros.`, ejecución real.
- La traducción: `grep -rn "Restricciones de código" skills/` sin salida, ejecución real.
- El pre-commit: un commit en un worktree de prueba con la misma frase de 10 palabras en dos skills propias, parado por el hook con la línea de `kit:own`, ejecución real; sin `SDD_UPSTREAM_DIR`, un commit que toca `skills/` parado con su aviso y uno que solo toca `.docs/` aceptado.
- La inclusión en una copia, en sus bordes (segunda línea del bloque, antes de `fin`, tras la línea en blanco que lo cierra, dentro de una valla): casos de `cli/test/kit/copies.test.ts`.
- La CI: el run de `ci.yml` del commit empujado de la rama, verde, con `kit:copies`, `kit:own` y `kit:skill-size` en su log (`gh run view`).
- La orden de corte: `node cli/bin/sdd.js lock run -- moon run kit:build kit:skill-size kit:own kit:copies cli:test-slow cli:test-min` en verde.
- Las skills tocadas: humo N=1 de las baterías (tabla de «Previsión de coste»), con la fila L (idioma) en todos; un rojo se contrasta con el mismo escenario y el kit de `develop`.
- La frase de `learnings.md`: escenario `c2` nuevo de `tests/batteries/sdd-archive/battery.md`, RED con el kit de `develop` y GREEN, n=2.
- Los topes: `cli/test/kit/word-budget.test.ts`, y el saldo de las skills tocadas con la medida de `word-budget` en la rama contra `develop`.

## Términos y ADR

- Términos resueltos: **inclusión** — un fichero de `includes/` que el build pone en el sitio de su marca, en una propia o dentro de un bloque del kit de una copia (se evita «partial» y «snippet») · **salida** — una frase que deja de estar en una skill y queda solo en el paso que la decide.
- ADR candidatas: una copia admite inclusiones dentro de un bloque del kit — alternativa descartada: quitar el texto del kit de las copias (B) o no contar lo incluido (C). Deshace la decisión 4 de la 0304, que no tiene ADR propia; la escribe el cierre si la revisión final no la descarta.

## Delta de comportamiento

### Capacidad: `kit-distribution`

#### MODIFIED — Una inclusión se escribe una vez y el build la expande

- GIVEN `includes/user-language.md` con «Write everything the user reads in the language of their message.» y `skills/example-a/SKILL.md` con la línea `<!-- kit: incluye user-language -->` en su texto y una `<!-- kit: 0186 -->` más abajo
- WHEN se ejecuta `moon run kit:build`
- THEN `dist/skills/example-a/SKILL.md` lleva el contenido de `includes/user-language.md` en el sitio de la inclusión, sin la otra marca, y lo demás byte a byte
- AND `dist/` no tiene `includes/`
- AND una inclusión cuyo fichero no existe para el build con `skills/example-a/SKILL.md:<línea>: la inclusión user-language no existe: crea includes/user-language.md`, y `dist/` no cambia
- AND un `includes/<nombre>.md` con una línea `<!-- kit: … -->` para el build con `includes/<nombre>.md: una inclusión no lleva marcas del kit`
- REMOVED AND en la fuente anotada de una copia, `kit:copies` da `<fichero>:<línea>: marca del kit sin tarea o con un campo desconocido: incluye user-language`
- REMOVED AND en cualquier copia, `pending` incluida, `kit:own` da `<fichero>:<línea>: una inclusión es solo de las propias, y <fichero> es una copia`
- AND en una copia, la inclusión sigue «Una copia incluye dentro de un bloque del kit»

#### ADDED — Una copia incluye dentro de un bloque del kit

- GIVEN `includes/user-language.md` y la fuente anotada de `skills/sdd-tdd/SKILL.md`, copia sin `pending`, con `<!-- kit: 0312 -->` seguida de `<!-- kit: incluye user-language -->` y de la línea «Forked from `test-driven-development` of superpowers…», en el mismo párrafo
- WHEN corren `moon run kit:copies` y `moon run kit:build`
- THEN `kit:copies` no da rojo por la inclusión, que es una línea del bloque, y `dist/skills/sdd-tdd/SKILL.md` lleva el contenido de `includes/user-language.md` en su sitio
- AND la inclusión no abre ni cierra un bloque: los bordes son los de «La marca del kit se escribe con su gramática». Justo antes del `fin` de un bloque es del bloque y no da rojo; tras la línea en blanco que cierra un bloque sin `fin`, está fuera
- AND fuera de un bloque `add` o `sustituye`, `kit:copies` da `<fichero>:<línea>: una inclusión en una copia va dentro de un bloque del kit`
- AND dentro de una valla de código de la copia, `kit:copies` da `<fichero>:<línea>: una inclusión va en el texto, fuera de un bloque de código`, el mismo aviso que el build
- AND en una copia `pending`, una inclusión vale en cualquier sitio del texto
- AND lo que entra por la inclusión no es texto del kit de la copia: no lo compara con su original, y no se empareja con lo mismo incluido en otra skill

#### MODIFIED — Una frase del kit repetida en otra skill da rojo

- GIVEN `skills/example-a/SKILL.md` y `skills/example-b/SKILL.md`, propias, cada una con «Write everything the user reads in their language, skill announcements included.»
- WHEN corre `moon run kit:own`
- THEN da `dist/skills/example-a/SKILL.md:<línea> y dist/skills/example-b/SKILL.md:<línea> repiten «write everything the user reads in their language skill announcements»: déjala en un solo sitio, en includes/ si la necesitan varias skills; antes de quitar una copia, relee cada paso que la nombra por su posición: su orden tiene que dejar aplicarla`
- AND una palabra es `[\p{L}\p{N}'’-]+`, en minúsculas; repetida es una racha de 10 palabras seguidas en dos carpetas distintas de `dist/skills/`, fuera del frontmatter, de los bloques de código y del código en línea
- AND la racha no cruza una línea en blanco, un elemento de lista, un título ni una celda de tabla, y sí las líneas partidas de un mismo párrafo
- AND una racha de 12 palabras da una sola línea; dos rachas separadas en la misma pareja dan dos
- AND con la misma racha en tres skills, la línea nombra los tres sitios, ordenados por ruta
- AND dos copias anotadas que comparten una racha, en su original o en sus bloques del kit, no dan rojo; el bloque del kit de una copia que repite una propia sí lo da
- REMOVED AND la racha que entra por `<!-- kit: incluye user-language -->` en dos propias no da rojo; la misma racha escrita a mano en una tercera sí
- AND la racha que entra por `<!-- kit: incluye user-language -->` en dos skills, propias o copias, no da rojo; la misma racha escrita a mano en una tercera, propia o en un bloque del kit de una copia, sí
- AND una racha repetida entre el `SKILL.md` de una skill y sus `references/`, o dentro de `sdd-templates/templates/` o de `sdd-upgrade/references/migrations/`, no da rojo
- AND una copia con `pending` cuenta entera como texto del kit

#### MODIFIED — Lo que dice kit:own

- REMOVED GIVEN el kit con rojos de las cuatro clases (repetida, absoluta con excepción, castellano e inclusión en una copia)
- GIVEN el kit con rojos de las tres clases (repetida, absoluta con excepción y castellano)
- WHEN corre `moon run kit:own`
- REMOVED THEN primero reconstruye `dist/` con `kit:build`, y escribe una línea por rojo y sale con código 1
- THEN lee `skills/` y `includes/` con las inclusiones expandidas, sin reconstruir `dist/`, escribe una línea por rojo y sale con código 1
- REMOVED AND sin ningún rojo escribe `Skills al día: <n> ficheros.`, con `<n>` los `.md` de `dist/skills/` y de `includes/` que mira, y sale con 0
- AND sin ningún rojo escribe `Skills al día: <n> ficheros.`, con `<n>` los `.md` de `skills/` y de `includes/` que mira, y sale con 0
- REMOVED AND no corre en el pre-commit ni en la CI
- AND corre en el pre-commit y en la CI, y un rojo para el commit

#### MODIFIED — Ninguna skill ni ninguna fase pasa de su tamaño

- REMOVED GIVEN `dist/skills/example-a/SKILL.md` de 20.000 bytes
- GIVEN `skills/example-a/SKILL.md`, que sale del build con 20.000 bytes
- WHEN corre `moon run kit:skill-size`
- THEN da `FALLA: dist/skills/example-a/SKILL.md ocupa 20000 bytes (límite: menos de 20000)` y sale con código 1
- AND mide cada `SKILL.md` de `skills/` con sus marcas quitadas y sus inclusiones expandidas, como sale del build, sin reconstruir `dist/`
- AND con una skill `lead` de 20.000 caracteres que manda invocar cinco skills de 19.000 (`a`, `b`, `c`, `d`, `e`), da `FALLA: la fase de lead (a, b, c, d, e) suma 115000 caracteres (límite: 100000)`
- AND cada skill de la fase cuenta como mín(caracteres, 20.000), y una fase de 100.000 exactos pasa
- AND manda invocar una skill del kit entre comillas invertidas, con o sin `sdd-kit:`, precedida de «invoke», «load» o «**REQUIRED SUB-SKILL:**», o seguida en la misma frase y sin otro código en medio de «with `Skill`» o «with the `Skill` tool»; en «closing in `example-b`: invoke `example-c` with `Skill`» cuenta `example-c` y no `example-b`
- AND una skill nombrada sin ninguna de esas formas, o dentro de un bloque de código, no cuenta, y solo cuentan las invocaciones directas, no las de las skills invocadas
- AND sin rojos escribe `OK: todos los SKILL.md ocupan menos de 20000 bytes` y `OK: ninguna fase pasa de 100000 caracteres (la mayor, <skill>: <n>)`, y sale con 0
- AND corre en el pre-commit y en la CI, y un rojo para el commit

#### MODIFIED — Lo que dice kit:copies de cada copia

- GIVEN `upstream.json` con una copia anotada y `skills/sdd-debugging/SKILL.md` con `pending: "0312"`
- WHEN corre `moon run kit:copies`
- THEN escribe una línea por rojo
- AND un rojo dentro de un bloque con `arregla: 0307` acaba en ` → 0307`
- AND la copia con `pending` da solo `skills/sdd-debugging/SKILL.md: sin anotar → 0312`
- AND con algún rojo sale con código 1; sin ninguno, escribe `Copias al día: <n> ficheros.`, con `<n>` las copias sin `pending`, y sale con 0
- AND cuándo corre en el pre-commit y en la CI lo dice «Las comprobaciones de las skills corren en el commit y en la CI»

#### ADDED — Las comprobaciones de las skills corren en el commit y en la CI

- GIVEN un clon con `core.hooksPath` en `.githooks`, `SDD_UPSTREAM_DIR` sin definir, y staged un cambio a `skills/example-a/SKILL.md` que escribe a mano «Write everything the user reads in their language, skill announcements included.», ya escrita en `skills/example-b/SKILL.md`, propia
- WHEN se ejecuta `git commit`
- THEN el pre-commit corre `kit:own` y `kit:skill-size` además de `cli:typecheck`, `cli:test` y `kit:roadmap`, y `kit:copies` porque el commit toca `skills/`; el commit no entra, y la salida lleva la línea «… repiten «write everything the user reads in their language skill announcements»: …» de `kit:own` y `Falta SDD_UPSTREAM_DIR: la carpeta con los clones de las fuentes vigiladas.` de `kit:copies`
- AND un commit staged que solo toca `.docs/` no corre `kit:copies` (lo decide `git diff --cached --name-only`: `skills/`, `includes/` o `upstream.json`) y entra sin la variable
- AND con la variable y un clon sin el tag que pide `upstream.json`, un commit que toca `skills/` no entra, con `<fuente>: falta <versión> en el clon <ruta>`
- AND en cada push a `develop`, `feature/**` y `patch/**`, la CI clona cada `repo` de las `sources` de `upstream.json` con sus tags en `$RUNNER_TEMP/upstream`, exporta `SDD_UPSTREAM_DIR` y corre `kit:copies`, `kit:own` y `kit:skill-size` junto a su suite; un rojo de cualquiera deja el run en `failure`

#### Reglas de la capacidad — kit-distribution

- **Dónde viven los datos**: la versión de cada fuente de terceros, solo en `upstream.json`, en la raíz del repo, que no viaja, y en los avisos que salen de él; nunca en el texto de una skill. También vive allí si cada fichero de `skills/` es copia o propia (`own`) y qué ficheros de la carpeta de una copia no se copian (`notCopied`). La versión del plugin, solo en `.claude-plugin/plugin.json` de la raíz; `dist/.claude-plugin/plugin.json` es su copia generada. Lo que viaja, en `dist/`, generado desde `skills/` y la lista blanca. Qué frase de una copia es del kit, solo en las marcas de su fuente anotada en `skills/`. Una regla que necesitan dos skills, solo en `includes/<nombre>.md`, en la raíz, que no viaja: el build la pone en cada skill que la incluye; una copia la incluye dentro de un bloque del kit. Los clones de las fuentes que lee `kit:copies`, en la carpeta de `SDD_UPSTREAM_DIR`, fuera del repo; en la CI, `$RUNNER_TEMP/upstream`.
- **Regla ante conflicto**: manda la fuente (`skills/`, `includes/`, `upstream.json`), y `dist/` y los avisos se regeneran; nunca se edita `dist/` a mano. Entre una copia y su original manda el original en su tag: una diferencia sin marca es un rojo de la copia, nunca del original. Entre una inclusión y el mismo texto escrito a mano en otra skill manda la inclusión: el rojo es de la skill que lo escribe a mano.

### Capacidad: `verification`

#### MODIFIED — La revisión final sale en ejes, en paralelo

- GIVEN un plan con `Ejecución: native`, todas sus tasks completas en el ledger, `Eje Arquitectura: no — solo texto de skills` y el commit `a1b2c3d` de su última task
- WHEN el hilo despacha la revisión final
- THEN con `sdd-parallel-agents` y en segundo plano salen dos revisores sobre `a1b2c3d`: el eje Spec con `sdd-kit:effort-high` + `opus` y el eje Código con `sdd-kit:effort-high` + `sonnet`, cada uno con su vigía de silencio
- REMOVED AND el encargo de cada eje lleva la cabecera de `encargo-revision.md` («Restricciones de código»), su sección «Cómo revisar» y el encargo de su eje de `sdd-verify`
- AND el encargo de cada eje lleva la cabecera de `encargo-revision.md` («Code constraints»), su sección «How to review» y el encargo de su eje de `sdd-verify`
- AND el eje Spec recibe además las rutas de `spec.md` y `plan.md`, la sección `## Review Focus` del plan literal, la lista de ADR `accepted` de `sdd decision index --files <ficheros del diff>`, la salida de `sdd capability index` y el puntero a las líneas `Ruling:` y `minor (deferred)` del ledger; el eje Código, el paquete, «Flujos core», «Retries» y «Timeouts» de `operations.md` §Testing, literales, o `sin E2E declarados`, y la salida de `sdd review comments` en el worktree del revisor; el eje Arquitectura, el paquete y `architecture.md`
- AND con `Eje Arquitectura: sí — <frontera>` sale además el eje Arquitectura, con `sdd-kit:effort-high` + `opus`
- AND con `control.maxParallelAgents: 2` y tres ejes, salen dos y el tercero cuando vuelve uno
- AND los ejes trabajan en el mismo worktree desanclado `review-<id>-a1b2c3d`
- AND un eje colgado se relanza solo, una vez, como dice «Vigía de silencio», y los demás siguen
- AND el hilo recibe los informes por eje y no fusiona ni reordena hallazgos de un eje con los de otro
- AND en `delegate`, si la spec aprobada lleva la línea `Política de modelos:` con esos ejes y las instrucciones del usuario piden confirmar antes de paralelizar, los despacha sin preguntar; un eje que la línea no nombra (el Arquitectura que sube el hilo) se confirma

#### Reglas de la capacidad — verification

- **Idioma de los nombres**: los encargos de los ejes en inglés, como sus fuentes, también sus secciones fijas (`## Code constraints`, `## How to review`, `## Review Focus`); los nombres que citan de la plantilla del plan («De código», «De proceso», «Restricciones globales»), como en la plantilla; los nombres de skill y de fichero en inglés kebab-case.

### Capacidad: `feature-flow`

#### MODIFIED — El encargo del implementador lleva el decálogo de calidad

- GIVEN un plan con el bloque «De código» en sus Restricciones globales
- WHEN se despacha el implementador de una task, o el hilo prepara la ejecución en Native
- REMOVED THEN el encargo lleva, tras «Restricciones de código», la sección `## Quality decalogue` con las diez reglas y la frase de que, si una choca con las Restricciones de código, mandan las Restricciones
- THEN el encargo lleva, tras `## Code constraints`, la sección `## Quality decalogue` con las diez reglas y la frase de que, si una choca con las Code constraints, mandan las constraints
- AND en Native el hilo la lee una vez, al preparar la ejecución
- AND el encargo del revisor de task y el del re-revisor no la llevan

### Capacidad: `archive`

#### MODIFIED — Un aprendizaje cuyo destino no cabe tiene salida

- REMOVED GIVEN el cierre de una feature con el aprendizaje «la suite lenta necesita `--maxWorkers 8`», cuyo destino `tech-stack.md` está en su tope de palabras, y un pre-commit que lo comprueba
- GIVEN el cierre de una feature con un aprendizaje de 40 palabras («la suite lenta necesita `--maxWorkers 8`…») para `tech-stack.md`, que mide 900 palabras en la rama y en `origin/develop`; el tope es 950 en la rama y 920 en `origin/develop`, porque otra feature bajó el tope a 920 sin tocar el contenido después de abrirse la rama; y un pre-commit que lo comprueba
- WHEN se vuelca el aprendizaje
- REMOVED THEN sale de ese documento la pieza más vieja que ya vive en otro sitio, y el aprendizaje entra
- THEN antes de escribirlo, tras `git fetch`, mide el documento como lo dejará el merge de sincronización (el de `origin/develop` con los cambios de la rama) más el aprendizaje, 940 palabras, contra el tope de `origin/develop`, 920, y no contra el de la rama
- AND como no cabe, sale de ese documento la pieza más vieja que ya vive en otro sitio, y el aprendizaje entra
- AND una regla de una skill con batería (`tests/batteries/<skill>/`) va a la procedencia de esa batería
- AND si no hay pieza que salga, pregunta; en `unattended`, va a «Por triar» de la deuda
- REMOVED AND el tope no sube y el commit no se salta el hook
- AND el tope no sube, y ni el commit del cierre ni el del merge de sincronización se saltan el hook
- AND §5 del walkthrough dice dónde fue el aprendizaje

#### Reglas de la capacidad — archive

- **Límites**: tope de palabras de `sdd-archive`, el de `cli/test/kit/word-budget.test.ts`; el gate de cierre corre una vez por árbol: en la validación o, con otra rama abierta o la base por delante, solo sobre el merge de sincronización; corre enteras las suites unitarias y `pendiente` de «Suites», y el gate por lo afectado, o entero si la rama toca un fichero de «Sin filtro»; tras un rojo corren los tests que fallaron, los que no llegaron a correr y el gate con `--base <sha rojo>`, y con un arreglo solo de docs, solo los tests que fallaron; tras el merge de sincronización se repiten solo las tareas que tocan la rama y la base a la vez: con un gate filtrado, las que selecciona contra `<merge.into>` y también contra el sha de la última suite en verde; sin filtro, el gate entero si la base trae cambios fuera de `.docs/` que no sean `*.md`; si la base trae un fichero de «Sin filtro», el gate entero; el informe de rojo lleva las últimas 20 líneas; una suite E2E que pasa de su «Presupuesto E2E», o sin presupuesto, una suite de más de 10 minutos, va a la deuda del proyecto; un sha citado es una cadena de 7 a 40 caracteres hexadecimales; los nombres `finishing-a-development-branch`, `sdd-end-feature` y `sdd-end-patch` solo aparecen en `skills/` en la línea de procedencia de `skills/sdd-archive/SKILL.md` y en las migraciones de versiones pasadas (v0.4.0, v2.0.0, v3.0.0)

## Topes de palabras

Medido con el conteo de `word-budget.test.ts` sobre `dist/` de la rama (igual a `develop`) el 2026-11-09. «Previsto» es la estimación sobre la tabla del Approach y la traducción; la frase de idioma está medida (+19, y +10 en `sdd-templates`). «Tope propuesto» es el de la implementación, con la fórmula de `feature-flow` (medido + previsto + 2 %, mínimo 20) solo donde medido + previsto pasa del tope, un criterio para todas las filas; al cierre, cada tope tocado baja a su medida exacta, y `kitBudget` no sube (decisión 10). Suma de «Previsto» por skill (total): +215 −300 = −85.

| Fichero | Medido / tope | Margen | Previsto | Tope propuesto (SKILL.md · total) |
| --- | --- | --- | --- | --- |
| `sdd-archive` (SKILL.md · total) | 2.891 / 3.920 · 9.794 / 9.794 | 1.029 · 0 | +19 · +20 | sin cambio · 10.010 |
| `sdd-implement` | 2.607 / 2.658 · 6.566 / 6.657 | 51 · 91 | −20 · −25 | sin cambio |
| `sdd-propose` | 3.157 / 5.250 · 14.041 / 14.200 | 2.093 · 159 | +0 · −240 | sin cambio |
| `sdd-verify` | 2.586 / 3.060 · 9.576 / 9.577 | 474 · 1 | +19 · −25 (con la traducción) | sin cambio |
| `sdd-roadmap` | 3.191 / 3.600 · 3.599 / 3.600 | 409 · 1 | +14 · +14 | sin cambio · 3.685 |
| `sdd-explore` | 1.037 / 1.100 · 1.037 / 1.100 | 63 · 63 | +19 · +19 | sin cambio |
| `sdd-init` | 2.648 / 2.648 · 3.193 / 3.193 | 0 · 0 | +19 · +19 | 2.720 · 3.276 |
| `sdd-upgrade` | 961 / 980 · 961 / 980 | 19 · 19 | +19 · +19 | sin cambio (980 cabe justo) |
| `sdd-templates` | 1.595 / 1.700 · 16.959 / 16.999 | 105 · 40 | +10 · +10 | sin cambio |
| `using-sdd` | 540 / 570 · 540 / 570 | 30 · 30 | +19 · +19 | sin cambio |
| `sdd-end-release` | 1.910 / 1.920 · 2.108 / 2.500 | 10 · 392 | +19 · +19 | 1.968 · sin cambio |
| `sdd-debugging` | 1.662 / 1.700 · 3.407 / 3.407 | 38 · 0 | +19 · +19 | sin cambio · 3.495 |
| `sdd-tdd` | 1.704 / 1.750 · 4.017 / 4.030 | 46 · 13 | +19 · +19 | sin cambio · 4.117 |
| `sdd-worktrees` | 1.431 / 1.431 · 1.431 / 1.431 | 0 · 0 | +19 · +19 | 1.479 · 1.479 |
| `sdd-parallel-agents` | 1.137 / 1.150 · 1.137 / 1.150 | 13 · 13 | +19 · +19 | 1.179 · 1.179 |
| `sdd-retro` | 622 / 700 · 622 / 700 | 78 · 78 | 0 · 0 | sin cambio |
| `sdd-implement-native` | 2.990 / 3.038 · 2.990 / 3.038 | 48 · 48 | 0 · 0 | sin cambio |
| `sdd-implement-subagent` | 2.951 / 2.991 · 8.496 / 9.000 | 40 · 504 | 0 · −10 (la traducción en tres plantillas) | sin cambio |
| Kit (`kitBudget`) | 103.338 / 103.372 | 34 | −85 (medido con todo el texto: +173) | sale (enmienda del 2026-11-09) |
| `tech-stack.md` | 23.181 / 23.181 | 0 | 0 | sin cambio |
| `architecture.md` | 2.253 / 2.253 | 0 | 0 | sin cambio |

## Previsión de coste

Salida de `node tests/headless/battery.mjs plan` con `N=1` para el humo; el escenario `c2` no existe y va al precio medio de los 6 de `sdd-archive` de la primera fila (3,12 $ / 6 = 0,52 $).

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| Humo `sdd-archive` | `SCENARIOS="a2 a3r a8 c1 g6 t3" N=1` → `suma: 6 sujetos · coste previsto: 3.12 $` | 3,12 |
| Humo `sdd-implement` | `SCENARIOS="u1 k2 k3 b1 h2 pt1 n1 t2 w1 h1" N=1` → `suma: 10 sujetos · coste previsto: 6.24 $ · sin precio medido: n1 (a 0.51 $, la media de los escenarios medidos)` | 6,24 |
| Humo `sdd-propose` | `SCENARIOS="f1 id1 s1 c1" N=1` → `suma: 4 sujetos · coste previsto: 3.12 $` | 3,12 |
| Humo `sdd-verify` | `SCENARIOS="f1 c1 c6 c8 t1" N=1` → `suma: 5 sujetos · coste previsto: 3.43 $ · sin precio medido: t1 (a 0.71 $, la media de los escenarios medidos)` | 3,43 |
| Humo `sdd-roadmap` | `SCENARIOS="m1 m5" N=1` → `suma: 2 sujetos · coste previsto: 0.30 $` | 0,30 |
| Humo `sdd-explore` | `SCENARIOS="e1 e2" N=1` → `suma: 2 sujetos · coste previsto: 0.23 $` | 0,23 |
| Humo `sdd-upgrade` | `SCENARIOS="o1" N=1` → `suma: 1 sujetos · coste previsto: 0.22 $` | 0,22 |
| Humo `sdd-init` | `SCENARIOS="n1" N=1` → `suma: 1 sujetos · coste previsto: 0.14 $` | 0,14 |
| Humo `using-sdd` | `SCENARIOS="v1" N=1` → `suma: 1 sujetos · coste previsto: 0.14 $` | 0,14 |
| Humo `sdd-retro` | `SCENARIOS="r1" N=1` → `suma: 1 sujetos · coste previsto: 0.19 $` | 0,19 |
| Humo `sdd-debugging` | `SCENARIOS="d1" N=1` → `suma: 1 sujetos · coste previsto: 0.12 $` | 0,12 |
| RED `c2` (`sdd-archive`, kit de `develop`) | 2 sujetos, sin medida previa: 2 × 0,52 $ | 1,04 |
| GREEN `c2` | 2 sujetos: 2 × 0,52 $ | 1,04 |
| Controles con el kit de `develop` | hasta un tercio del humo, ~12 sujetos, a la media del humo (17,25 $ / 34) | 6,09 |
| Una tanda de REFACTOR | ~6 sujetos de los escenarios rojos | 3,04 |
| Medición tras la revisión final | ~4 sujetos de los escenarios que toque la pasada de fix | 2,03 |
| Suma | 60 sujetos | 30,49 |

Cada paso que cambia, con su escenario (Art. I):

| Fila / cambio | Escenario del humo, o por qué no se mide |
| --- | --- |
| 1 `user-language` | fila L de todos los escenarios de la tabla de arriba |
| 2 `document-literals` | `r1` de `sdd-retro`; en `sdd-end-release`, no medido: no tiene batería, y la frase no cambia de texto |
| 3 `patch-lane-exit` | `a2` de `sdd-archive`, `pt1` de `sdd-implement` |
| 4 `suites-before-gate` | `g6` de `sdd-archive`, `t1` de `sdd-verify` |
| 5 `last-reviewed-sha` | `c8` de `sdd-verify`, `a8` de `sdd-archive` |
| 6 `base-red-debt` | `a3r` de `sdd-archive`; en `sdd-worktrees`, no medido: `w1` no lleva un rojo de la base, y la frase no cambia de texto |
| 7 `roadmap-check-failures` | `m5` de `sdd-roadmap`; en `records.md`, los cierres `a2` y `a8`, que corren `roadmap check` |
| 8 `squash-cited-shas` | `a8` de `sdd-archive` |
| 9 `field-validation-defined` | `t3` de `sdd-archive` |
| 10 `visual-evidence` | no medido: ningún escenario del humo tiene pantalla, y las dos redacciones se unen sin cambiar condición |
| 11 `start-here-offer` | `e2` de `sdd-explore`, `m1` de `sdd-roadmap` |
| 12 salida de `encargo-revision.md` | `f1` de `sdd-verify`, `h1` de `sdd-implement` |
| 13 salida de `closing-the-review.md` | `c8` de `sdd-verify` |
| 14 salida de los cuatro factores | `n1` y `h1` de `sdd-implement` |
| 15 `effort-unavailable` | no medido: el harness de los sujetos expone los tipos `sdd-kit:effort-*`, y la frase no cambia de texto |
| 16 cruce con la base | `b1` de `sdd-implement` |
| 17 y 19 `deviation` | `u1`, `k2` y `k3` de `sdd-implement`, `c6` de `sdd-verify` |
| 18 celda de la tabla de gates | no medido: la lista sigue entera en «Scope brakes» de `sdd-implement` y en §Scope brakes, justo debajo de la tabla |
| 20 `unapproved-plan-flag` | `f1` de `sdd-propose` |
| 21 `slug-branch-rename` | `pt1` de `sdd-implement`, `id1` de `sdd-propose` |
| Traducción del encargo | `h2` de `sdd-implement`, `f1` de `sdd-verify` |
| `learnings.md` | `c2` de `sdd-archive` (RED y GREEN) |
| Control de `develop`, `sdd-init`, `sdd-upgrade`, `using-sdd`, `sdd-debugging` | `n1`, `o1`, `v1`, `d1`: solo la frase de idioma |

`sdd-end-release`, `sdd-tdd`, `sdd-templates`, `sdd-worktrees`, `sdd-parallel-agents`, `sdd-implement-native` y `sdd-implement-subagent` no tienen batería: los miden los escenarios que las cargan (`t2`, `w1`, `h1` y `h2` de `sdd-implement`; `f1` de `sdd-verify`); `sdd-end-release` y `sdd-templates` solo cambian la frase de idioma, que mide la fila L en las demás (`sin medir` propio).

## Enmiendas

- 2026-11-09 — `kitBudget` y su test «el kit entero cabe en su presupuesto» salen de `word-budget.test.ts`; quedan los topes por skill (`SKILL.md` y total), y los de las skills tocadas bajan a su medida exacta al cierre. El total de las skills tocadas sube 173 palabras en vez de bajar 85 — una inclusión no ahorra palabras (`word-budget.test.ts` cuenta `dist/`), las salidas y la unión de redacciones restaron 84, no las ~340 previstas, y la frase de idioma suma 257; el kit medía 103.511 con `kitBudget` en 103.372. Un total del kit no mide nada que cargue un agente: al arrancar solo se cargan `name` y `description`, el `SKILL.md` al invocar la skill y sus ficheros al leerlos, y la guía de Anthropic solo pone límites por skill ([Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)) — Task 5 — aprobada: «quitamops, solo haz una busqueda por internet a ver si nos d ala razon en quitarlo»

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-09 | aprobada (opción «Apruebo») |
