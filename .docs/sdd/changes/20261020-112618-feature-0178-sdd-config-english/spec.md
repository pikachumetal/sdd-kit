---
id: 20261020-112618-feature-0178-sdd-config-english
feature: 0178
parent: 0150
proposal: 0131
title: sdd-config en inglés, con la tabla pricing y la clave review.minors
mode: full
profile: delegate
status: approved
created: 2026-10-20
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-20
---

# Spec — sdd-config en inglés, con la tabla pricing y la clave review.minors

🦆 Hoy un proyecto nuevo cierra cada feature con «Coste de la sesión: sin precio», porque nadie le propone la tabla de precios; y cuando el dev-lead quiere que los Minor de la revisión final se arreglen, tiene que decirlo en cada feature. Con este cambio, `sdd-config` (y la init, que la invoca) propone la tabla con los precios de la página oficial de Anthropic y su fecha —p. ej. `claude-sonnet-5-5`: 2 / 2,5 / 4 / 0,2 / 10 $ por millón, leída el 2026-10-20—, y pregunta si los Minor van a la pasada de fix (`review.minors: fix`) o se difieren (`defer`, lo de hoy). Con `fix`, la revisión final los arregla en su única pasada sin preguntar y el ledger los apunta como arreglados, no como `minor (deferred)`. Este repo queda con `fix`. La skill se reescribe en inglés.

## Capacidades

- Modificadas: `configuration` — `sdd-config` cataloga y propone `pricing` y `review.minors`, y las escribe en `sdd-kit.json`
- Modificadas: `verification` — con `review.minors: fix`, los Minor de la revisión final entran en la pasada de fix
- Modificadas: `onboarding` — la entrevista de la init pregunta también `review.minors` y la tabla `pricing` (enmienda del 2026-10-20)

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: MODIFIED (2: escritura de claves, cierre de la revisión), contrato público (dos claves nuevas de `sdd-kit.json`) · tamaño: 3 tasks, ~5 ficheros de skill
- Mínimo razonable: ninguna — deja sin segunda lectura el texto de las dos filas nuevas del catálogo y la frase de `sdd-verify`; los cubren los humos y la batería

1. **Numeración del catálogo**: las dos preguntas nuevas son la 9 (`review.minors`) y la 10 (`pricing`); la 8 sigue siendo `validation.startEnvironment`. Renumerar rompería las citas a «la pregunta 7» de `v2.3.0.md` y de la capacidad.
2. **Quién las pregunta**: una init las hace con las de proyecto: «de la 1 a la 7, la 9 y la 10». Así un proyecto nuevo tiene precios desde su primer cierre, que es lo que pide la fila de deuda. `skills/sdd-init/SKILL.md` gana las dos en su lista del paso de claves.
3. **Sin migración**: ningún `migrations/` las pregunta. Sin las claves rige lo de hoy (`defer` y «sin precio»), así que no rompen nada; un proyecto existente las ve como «falta» al invocar `sdd-config`.
4. **Pregunta 9**, literal: «When the final review returns Minor findings, do they enter the fix pass (`fix`) or go to the ledger as deferred (`defer`)?» Recomendada `defer`, porque un Minor no cambia lo que recibe quien usa el producto y cada arreglo alarga la pasada; `fix` si el equipo los quiere cerrados en cada feature. «No sé»: nada, y rige `defer`. Va a `sdd-kit.json`.
5. **Pregunta 10**, la tabla `pricing`. La recomendada es «sí», con la tabla propuesta en la propia pregunta:
   - una fila por modelo vigente de Opus, Sonnet y Haiku que lista la página oficial, con su id de API (`claude-sonnet-5-5`, el que traen las transcripciones) y las cinco columnas que lee `sdd session`: `input`, `cacheWrite5m`, `cacheWrite1h`, `cacheRead` y `output`, en dólares por millón;
   - `pricing.source`: `https://platform.claude.com/docs/en/about-claude/pricing` (comprobada hoy: tiene esas cinco columnas) y `pricing.updated`: la fecha en que el agente la leyó.
   - Si el agente no puede leer la página en la sesión, no recomienda nada ni inventa precios: lo dice, y la clave queda sin escribir.
   - «No» o «no sé»: nada, y el cierre sigue con «sin precio».
6. **Poner al día la tabla**: con `pricing` escrita, la tabla de `sdd-config` enseña su fecha y sus modelos. No se vuelve a preguntar salvo que el usuario lo pida; entonces relee la fuente, actualiza y añade filas, y conserva las de modelos que la página ya no lista, porque sesiones viejas aún los nombran.
7. **Cierre de la revisión con `fix`** (`sdd-verify`, «Closing the review»): lee `review.minors` de `sdd-kit.json`.
   - Con `fix`, los Minor entran en la única pasada de fix con los Critical y los Important. En Native, con la misma verificación: `Final: fixed <finding> — <test> RED→GREEN, suite <N>/<N>`.
   - Un Minor que ningún test reproduce (un nombre, una redacción) se verifica con la suite en verde: `Final: fixed <finding> — suite <N>/<N>`. En SDD, van en la lista completa del subagente de fix.
   - No se escribe `minor (deferred)` y no salen en «Deferred minors».
   - Sin la clave o con `defer`: como hoy.
8. **Los Minor por task no cambian**: los que la revisión por task de `sdd-implement` apunta como `Task <N>: minor (deferred)` siguen igual. La clave habla de la revisión final, como el ticket; la revisión final ya repasa esa lista y, con `fix`, lo que reporte como Minor entra en la pasada.
9. **Sin cambios en la CLI**: `sdd ledger rulings` sigue listando las líneas `minor (deferred)`; con `fix` no se escriben. El menor del ticket (un Minor diferido que se arregló después a mano) solo pasa con `defer` y una decisión suelta del dev-lead, y queda fuera.
10. **Contrato**: la tabla «Claves de sdd-kit.json» de `control-profiles.md` gana dos filas: `review.minors` (`fix` \| `defer`, solo en `sdd-kit.json`, default `"defer"`) y `pricing` (objeto, solo en `sdd-kit.json`, sin default: sin ella, «sin precio»).
11. **Este repo**: `"review": {"minors": "fix"}` en `.docs/sdd/sdd-kit.json`. El cuerpo de su commit cita la frase del dev-lead y la fecha, como con `validation.mode`.
12. **Traducción** (Art. III): `sdd-config` se reescribe en inglés sobre su estructura actual (Overview, Steps, Catalog y las cuatro notas). La `description` pasa a inglés y conserva literales las frases del usuario entre comillas. Las preguntas al usuario salen en su idioma: la skill lo dice, como `sdd-propose`. «Lo que se retira o cambia de forma» lista lo que cambia de forma.
13. **Pester**: `SddConfig.Tests.ps1` pasa a buscar las frases en inglés y diez filas. La fuente única de la entrevista se mantiene: las preguntas en inglés solo están en `sdd-config`.
14. **Previsión de coste** (Art. I), sujetos Sonnet headless:

    | Paso nuevo o cambiado | Escenario | RED | GREEN |
    | --- | --- | --- | --- |
    | `sdd-config`: propone `pricing` con fuente y fecha, y control de lo traducido | `cf1` (humo, molde `salas` sin `pricing` ni `review`: «revisa la configuración del kit y ponla al día»; la 9 se contesta antes, para que el turno llegue a la 10) | 1 | 1 |
    | `sdd-config`: pregunta `review.minors` con `defer` recomendada | `cf2` (humo, molde `salas` con `pricing` y sin `review`, la misma petición) | 1 | 1 |
    | `sdd-verify`: con `fix`, el Minor entra en la pasada y no queda diferido | `c1f` (molde `reservas` de `c1` con `"review":{"minors":"fix"}`) | 1 | 2 |
    | `sdd-verify`: sin la clave, como hoy | `c1` (control) | — | 2 |
    | `using-sdd`: la `description` de una puerta cambia (regla de la feature 0117) | batería entera (24 escenarios) | — | ~30 |
    | `sdd-init`: la lista del paso de claves | `n4` (humo, control) | — | 1 |
    | Catálogo, contrato y fuente única | Pester | — | — |

    Total: ~41 sujetos, ~2,5 h y ~30 $ (0,75 $ por sujeto, como en la 0185). Techo: 55 sujetos (enmienda del 2026-10-20) o 40 $; si se supera, paro y decides tú. La batería entera de `using-sdd` son ~22 $ de esos 30. La opción mínima es solo `s1`, la puerta de `sdd-config` (2 sujetos): deja sin medir que la `description` nueva robe peticiones de otras puertas.
- `sdd capability merge` sobre una copia de `.docs/sdd`: dos «añadido» en `configuration`, «sustituido» en `configuration` y en `verification`, sin rechazos (salida 0)
- Política de modelos: sin revisores de spec · revisión final: Spec opus+high, Código sonnet+high, Arquitectura no · sujetos Sonnet headless, por tandas · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

Del prompt de arranque (2026-10-20):

- `sdd-config` en inglés — «sdd-config en inglés (Art. III)»
- `pricing` — «pricing es clave de proyecto en sdd-kit.json; sdd-config la propone con la fuente oficial de precios y su fecha; sin ella, sdd session sigue dando «sin precio». Requisito en la capacidad configuration»
- `review.minors` — «Clave review.minors: fix | defer en sdd-kit.json, defer por defecto. Con fix, los Minor de la revisión final entran en la pasada de fix sin preguntar (sdd-verify, «Closing the review», hoy «Minors never enter the fix pass») y el ledger no los deja como «minor (deferred)»»
- Este repo — «Este repo queda con review.minors: fix (dev-lead: punto 2 de la spec de la 0202 y enmienda «Sí, todos» de la 0204)»
- Cierre — «Perfil delegate. Al fusionar, `sdd merge --push`»

## Intent

Hoy `sdd-config` no conoce la tabla `pricing`. Un proyecto nuevo cierra con «sin precio» hasta que alguien la escribe a mano, y la de un proyecto existente se queda atrás con cada modelo nuevo (filas de deuda de la 0068 y del ticket de la 0099). Además `sdd-verify` difiere siempre los Minor de la revisión final, y el dev-lead lo corrigió a mano dos features seguidas (0202 y 0204), con una pregunta y una enmienda cada vez. El éxito:
- una init o un `sdd-config` deja la tabla con fuente y fecha;
- con `review.minors: fix`, una revisión final con Minor los arregla sin preguntar y el ledger no los da por diferidos;
- `sdd-config` queda en inglés sin perder ninguna regla.

Fracasaría si el agente inventara precios sin leer la fuente, o si un proyecto sin la clave dejara de diferir los Minor.

## Scope

- Entra:
  - `skills/sdd-config/SKILL.md`, reescrita en inglés, con las preguntas 9 y 10.
  - `skills/sdd-verify/SKILL.md`, «Closing the review».
  - `skills/sdd-init/SKILL.md`, la lista del paso de claves.
  - `skills/sdd-start-feature/references/control-profiles.md`, la tabla «Claves de sdd-kit.json».
  - `.docs/sdd/sdd-kit.json` de este repo: `review.minors: fix`.
  - Pester: `SddConfig.Tests.ps1` y `WordBudget.Tests.ps1`, si suben los topes.
  - Las evidencias de los humos y de las baterías en `tests/`: `c1f` en la batería de `sdd-verify`.
  - El README: la fila de `sdd-config`, si su texto cambia.
- No entra:
  - Una migración que pregunte las claves nuevas (decisión 3).
  - Los Minor por task de `sdd-implement` (decisión 8).
  - Cambios en la CLI (decisión 9).
  - Avisar de una tabla `pricing` vieja sin que nadie invoque `sdd-config`.
  - Traducir `using-sdd`, cuya fila de `sdd-config` no cambia.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «Minors never enter the fix pass» pasa a depender de `review.minors` | `skills/sdd-verify/SKILL.md:228`; `capabilities/verification.md:88`; `tests/batteries/sdd-verify/battery.md:57` (C1) | delta `MODIFIED` de `verification`; C1 no cambia (su molde no tiene la clave) y `c1f` es fila nueva |
| El catálogo pasa de ocho preguntas a diez | `skills/sdd-config/SKILL.md`; `tests/SddConfig.Tests.ps1:30` («el catálogo tiene ocho preguntas») | Scope (Pester) |
| «hacen de la 1 a la 7» → «de la 1 a la 7, la 9 y la 10», en inglés | `skills/sdd-config/SKILL.md:33`; `tests/SddConfig.Tests.ps1:62` | Scope (Pester) |
| Frases en castellano de `sdd-config` que fija Pester: `description: Usar `, «frase literal y la fecha van al cuerpo del commit…», «antes de la primera pregunta», «init o una migración, no escribes: devuelves las respuestas», «no se commitea», «¿Con qué perfil de control trabajáis» | `tests/SddConfig.Tests.ps1:23-71, 77` | Scope (Pester, a sus frases en inglés) |
| La lista de preguntas del paso de claves de la init | `skills/sdd-init/SKILL.md:53` | decisión 2 |
| Tabla «Claves de sdd-kit.json» | `skills/sdd-start-feature/references/control-profiles.md:211-225` | decisión 10 |
| `#catálogo`, ancla del enlace al catálogo | `skills/sdd-start-feature/references/control-profiles.md:236` | pasa a `#catalog`, con el encabezado en inglés |
| `## Pasos` / `## Catálogo` y sus encabezados en castellano | `skills/sdd-config/SKILL.md`; `tests/SddConfig.Tests.ps1:11` (regex `## Catálogo`) | Scope (Pester) |
| Regla «Dónde viven los datos» de `configuration` cita «el catálogo de preguntas, en `skills/sdd-config/SKILL.md`» | `capabilities/configuration.md` | sin cambio: el sitio sigue siendo ese |

- Filas que implementa:
  - la 0178 del roadmap (`.docs/sdd/roadmap.md:42`);
  - la de deuda «`sdd-config` no pregunta la tabla `pricing`» (`roadmap.md:254`), saldada;
  - «Menores de cierre de la feature 0060 del template» (`roadmap.md:212`): queda saldada, porque la 0149 y la 0191 cerraron sus otras dos partes;
  - «El dev-lead mete los Minor de la revisión final en la pasada de fix…» (`roadmap.md:96`), saldada.
  - Fuera del roadmap solo las nombran walkthroughs (0149, 0191) y tickets, que son artefactos de evento y no se editan. Comprobado buscando `0178`, `pricing` y `Minor de la revisión final` en `skills/`, `capabilities/` y los documentos de anclaje.

## Approach

- `sdd-config` se traduce sobre su estructura actual y gana dos filas de catálogo; su resto de reglas no cambia.
- `review.minors` se lee donde se decide, en «Closing the review» de `sdd-verify`, con una frase condicionada a la clave (predicado observable, Art. II). La pasada sigue siendo una.
- La tabla `pricing` usa la forma que ya lee `sdd session` (capacidad `estimation`); no cambia código.

## Dónde se prueba

- Proponer `pricing` con su fuente y su fecha, preguntar `review.minors`, y que la traducción no pierda la tabla ni los avisos: humos `cf1` y `cf2`, sujetos headless sobre el molde `salas`, como `tests/sdd-config-green.md`.
- `review.minors: fix` en el cierre de la revisión: escenario `c1f` de la batería de `sdd-verify`, con `c1` como control.
- Enrutado a `sdd-config` con la `description` nueva: batería entera de `using-sdd`.
- La init sigue arrancando con la lista nueva: `n4` de la batería de `sdd-init`.
- Catálogo (diez filas en su orden, ficheros), contrato y fuente única: Pester, `SddConfig.Tests.ps1`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `configuration`

**ADDED — `sdd-config` propone la tabla de precios con su fuente y su fecha**
- GIVEN el proyecto `salas` con un `sdd-kit.json` sin la clave `pricing`
- WHEN el usuario pide «revisa la configuración del kit y ponla al día», o una init llega a las claves del kit
- THEN la tabla de `sdd-config` enseña `pricing` como «falta» y que el cierre da «sin precio»
- AND su pregunta va sola en su turno, con «sí» recomendada y la tabla propuesta en la pregunta: una fila por modelo vigente de Opus, Sonnet y Haiku de `https://platform.claude.com/docs/en/about-claude/pricing`, con su id de API y `input`, `cacheWrite5m`, `cacheWrite1h`, `cacheRead` y `output` en dólares por millón (`claude-sonnet-5-5`: 2 / 2,5 / 4 / 0,2 / 10)
- AND con «sí» escribe en `sdd-kit.json` `pricing.usdPerMillionTokens`, `pricing.source` con esa página y `pricing.updated` con la fecha en que la leyó
- AND si el agente no puede leer la página en la sesión, no inventa precios ni recomienda: lo dice y la clave queda sin escribir
- AND con «no» o «no sé» no escribe nada, y el cierre sigue con «sin precio»
- AND con `pricing` ya escrita, la tabla enseña su `updated` y sus modelos, y no la vuelve a preguntar salvo que el usuario lo pida; entonces relee la fuente, actualiza y añade filas, y conserva las de modelos que la página ya no lista

**ADDED — `sdd-config` pregunta qué se hace con los Minor de la revisión final**
- GIVEN el proyecto `salas` con un `sdd-kit.json` sin la clave `review.minors`
- WHEN el usuario pide «revisa la configuración del kit y ponla al día», o una init llega a las claves del kit
- THEN la tabla de `sdd-config` enseña `review.minors` como «falta» y que rige `defer`
- AND su pregunta va sola en su turno, con `defer` recomendada primero y su motivo: un Minor no cambia lo que recibe quien usa el producto, y cada arreglo alarga la pasada de fix
- AND con «`fix`» o «`defer`» escribe `review.minors` en `sdd-kit.json`; con «no sé» no escribe nada y rige `defer`

**MODIFIED — `sdd-config` escribe solo lo respondido, en el fichero que toca** (antes: "una clave de política (`ids`, `merge`, frenos de `control`, `validation.mode`) va a `sdd-kit.json`")
- GIVEN una respuesta del usuario a una pregunta de `sdd-config`
- WHEN la escribe
- REMOVED THEN una clave de política (`ids`, `merge`, frenos de `control`, `validation.mode`) va a `sdd-kit.json`; `validation.startEnvironment` va a `sdd-kit.local.json`; `control.profile` y `execution` van donde el usuario diga (invocada por una init o por la migración, siempre a `sdd-kit.json`)
- THEN una clave de política (`ids`, `merge`, frenos de `control`, `validation.mode`, `review.minors`, `pricing`) va a `sdd-kit.json`; `validation.startEnvironment` va a `sdd-kit.local.json`; `control.profile` y `execution` van donde el usuario diga (invocada por una init o por la migración, siempre a `sdd-kit.json`)
- AND «no sé» no escribe la clave y rige su default; lo que no se preguntó no se escribe
- AND invocada por una init o por una migración no escribe: devuelve las respuestas y quien la invocó las escribe en `sdd-kit.json`, en su paso de estructura o de marcador (enmienda del 2026-09-25)
- AND sin usuario no escribe nada: las preguntas quedan como pendientes explícitas en el informe de quien la invocó

### Capacidad: `onboarding`

**MODIFIED — La entrevista fija las claves de control** (antes: "método de ejecución (`auto`) y quién valida (`manual`; …)")
- GIVEN una init con el usuario presente
- WHEN la entrevista llega a las claves del kit
- REMOVED THEN el agente invoca `sdd-config`, que hace en turnos distintos las preguntas de su catálogo, cada una con su opción recomendada y su motivo: modo de ids, perfil (`delegate`), política de merge (rama de integración, `--no-ff`, el worktree lo borra una persona), push de la rama de integración tras el merge («sí» con git-flow), frenos (3 agentes; 8 y 20 minutos), método de ejecución (`auto`) y quién valida (`manual`; `field` solo sin pantalla ni uso que el dev-lead pueda probar al cerrar)
- THEN el agente invoca `sdd-config`, que hace en turnos distintos las preguntas de su catálogo, cada una con su opción recomendada y su motivo: modo de ids, perfil (`delegate`), política de merge (rama de integración, `--no-ff`, el worktree lo borra una persona), push de la rama de integración tras el merge («sí» con git-flow), frenos (3 agentes; 8 y 20 minutos), método de ejecución (`auto`), quién valida (`manual`; `field` solo sin pantalla ni uso que el dev-lead pueda probar al cerrar), qué se hace con los Minor de la revisión final (`defer`) y la tabla de precios («sí», con la tabla leída de la página oficial de precios de Anthropic)
- AND `sdd init --config` guarda solo lo que el usuario responde y `--finish` lo sube a `sdd-kit.json`: «no sé» no escribe la clave y rige su default, y un «no» a la política de merge deja `merge` sin declarar
- AND si la rama de integración es la estable, la pregunta de merge no se hace y `merge` queda sin declarar; sin `merge` declarado, la de push tampoco se hace
- AND la pregunta de push recomienda «sí» solo si la convención de ramas es git-flow; con otra convención se hace sin opción recomendada
- AND la init no pregunta las preferencias personales: el resumen de cierre dice que se fijan con `sdd-config`

### Capacidad: `verification`

**MODIFIED — La revisión se cierra una vez** (antes: "y el Minor va al ledger como `Final: minor (deferred): <una línea>`")
- GIVEN la revisión final sobre `a1b2c3d`, con 1 Important del eje Código y 1 Minor del eje Spec
- WHEN el hilo la procesa, con cualquier método
- REMOVED THEN el Important entra en una sola pasada de fix (en Native, el hilo con TDD; en SDD, un subagente con todos los hallazgos de todos los ejes), y el Minor va al ledger como `Final: minor (deferred): <una línea>`
- THEN el Important entra en una sola pasada de fix (en Native, el hilo con TDD; en SDD, un subagente con todos los hallazgos de todos los ejes), y el Minor, sin `review.minors` en `sdd-kit.json` o con `defer`, va al ledger como `Final: minor (deferred): <una línea>`
- AND con `"review": {"minors": "fix"}` en `sdd-kit.json`, el Minor entra en esa misma pasada sin preguntar, y el ledger lo apunta como `Final: fixed <hallazgo> — <test> RED→GREEN, suite <N>/<N>` (si ningún test lo reproduce, `Final: fixed <hallazgo> — suite <N>/<N>`), nunca como `minor (deferred)`
- AND justo antes de presentar la validación (con `validation.mode: field`, antes de pasar al cierre), despacha una sola re-revisión con `sdd-kit:effort-high` + `opus`, con la cabecera de `encargo-revision.md` y `re-review-prompt.md`, los hallazgos abiertos de todos los ejes y el «What to Check» de los ejes que salieron, sobre el paquete `sdd review package <plan> a1b2c3d HEAD`; apunta `Re-revisión: a1b2c3d..<head>, sdd-kit:effort-high + opus, <veredicto>`
- AND en SDD la fix wave no lleva otra re-revisión: es esta
- AND un Important que la re-revisión deja abierto, el hilo lo adjudica con `Final: Ruling:` y llega a ✋ en la presentación y en el walkthrough, sin otra pasada de fix ni otra re-revisión
- AND si desde `a1b2c3d` solo hay commits que se revisan en el hilo, no despacha re-revisión

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-config` | 1.316 / 1.400 | 84 | 1.450 (la traducción ahorra; las dos filas añaden ~170) |
| `sdd-verify` (SKILL.md / total) | 2.932 / 2.990 · 8.845 / 9.020 | 58 · 175 | 3.060 / sin cambio (la frase de `fix`, ~70) |
| `sdd-init` | 2.355 / 2.400 | 45 | sin cambio (~10) |
| `sdd-start-feature` (total, con `control-profiles.md`) | 11.346 / 11.464 | 118 | sin cambio (~30) |
| Kit entero | 87.532 / 87.600 | 68 | 87.800 (neto previsto ~+200) |

Medido con `wc -w`; el test parte por espacios igual.

## Enmiendas

- 2026-10-20 — delta `MODIFIED` de `onboarding` («La entrevista fija las claves de control»): la init pregunta también `review.minors` y `pricing`, como ya decía la decisión 2, y el requisito vivo enumeraba sus preguntas sin ellas — revisión final, eje Spec (Important, `unrequested`) — aprobada: «Apruebo (Recomendada)»

- 2026-10-20 — techo de la previsión de coste de 50 a 55 sujetos (decisión 14): el RED de `c1f` necesitó n = 2 y dos tandas de REFACTOR, y la batería entera de `using-sdd` son 34 sujetos, uno por encima del techo; en dólares sigue por debajo de 40 $ — Task 3 — aprobada: «Sube el techo a 55 (Recomendada)»

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-20 | aprobada (opción «Apruebo») |
