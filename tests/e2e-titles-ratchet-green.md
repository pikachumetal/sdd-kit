# GREEN — el test de títulos nace en verde, solo encoge y lee `playwright test --list` (feature 0282)

Mismo lanzador que el [RED](e2e-titles-ratchet-red.md), con el texto de la feature. Sujetos Sonnet; las salidas llevan títulos de producto de clientes y no se versionan. Sondas: [`red/probes.mjs`](../.docs/sdd/specs/20261101-171153-feature-0282-e2e-titles-ratchet/red/probes.mjs), que imprime solo salida y si nombra el título sonda.

## La guía

| Escenario | Qué dejó | Resultado |
| --- | --- | --- |
| `a1-1`: document-manager, primer texto | El bloque con 70 títulos, sin test | ❌ la regla describía el test y dejaba «añádelo» al final |
| `a1-2`: tras poner «Missing, write it» en la primera frase | Test con 70 títulos, con `E2E_SLOW=1`, solo de la config por defecto | ⚠️ nace en verde, pero sin los 15 de audit. Lo cazó la revisión final; esta fila decía antes «las 2 configs», sin comprobarlo |
| `a1-4`: con «every `playwright*.config.*` (glob them…)» | 85 títulos de las 2 configs | ✅ nace en verde; el error de Playwright no sale al rojo |
| `a1-6`: con «from the JSON's `errors`» | 85 títulos de las 2 configs, y lee `errors` | ✅ nace en verde |
| `a1-7`: con el texto final («A core line's title follows its last `·`. A non-zero exit doesn't throw…») | 85 títulos de las 2 configs | ✅ nace en verde; todas las sondas abajo |
| `a3-5`: una task con un título nuevo | 85 títulos en heredados, sin el nuevo; el test queda en rojo y el título va al dev-lead | ✅ no lo cuela |
| `a2-1`: OdySIF, sin `appsettings.local.json` | `e2e/titles.unit.spec.ts`, 18 títulos en 3 configs; movió a perezosa la lectura al cargar | ✅ nace en verde. Con el primer texto: la regla no cambió en lo que este sujeto siguió |
| `n1-1`, `n1-2`: molde con restos de `e2e` en `package.json` y README | Sin test | Inválidos: el molde aún nombraba E2E, y un sujeto dijo que había que declarar la lista |
| `n1-3`: molde sin E2E limpio | Sin test; dice que no es un E2E y que la guía no lo pide | ✅ no lo pide ni lo crea |

Sondas a mano, sobre el test de cada sujeto, en su copia:

| Sonda | `a1-2` | `a2-1` |
| --- | --- | --- |
| Sin cambios | salida 0 | salida 0 |
| `test(...)` nuevo | salida 1, nombrado | salida 1, nombrado |
| Título dinámico en bucle | salida 1, nombra los dos | salida 1, nombra los dos |
| `@slow` nuevo | salida 1, nombrado | salida 1, nombrado |
| Spec que lanza al cargar | salida 1, nombrado el error | salida 1, nombrado el error |
| Spec heredada borrada | salida 1, nombrado | salida 1 |

En `a1-2` el test se corrió con una config mínima de Vitest: el `test-setup.ts` global de la suite real necesita migraciones del backend, que la copia no lleva. Borrar la única spec de una config sale en rojo con `No tests found` de Playwright, sin nombrar el título: es la salida distinta de 0 de la regla.

Sondas ampliadas tras la revisión final (`red/probes.mjs`). 85 = 70 de la config por defecto + 19 distintos de audit − 4 que comparten; el verde de «sin cambios» sobre audit, con 34 tests en 2 `projects`, es el caso de un test en dos `projects`:

| Sonda | `a1-4` | `a1-6` | `a1-7`, texto final |
| --- | --- | --- | --- |
| Sin cambios | salida 0 | salida 0 | salida 0 |
| Test nuevo, bucle y `@slow` | salida 1, nombrados | salida 1, nombrados | salida 1, nombrados |
| Test nuevo en la config secundaria | salida 1, nombrado | salida 1, nombrado | salida 1, nombrado |
| Heredado con su test | salida 0 | salida 0 | salida 0 |
| Heredado sin su test | salida 1, nombrado | salida 1, nombrado | salida 1, nombrado |
| Título nuevo en «Flujos core» | no comparable: la sonda aún no usaba la forma de la plantilla | ídem | salida 0, con la forma de la plantilla |
| Spec que lanza al cargar | salida 1, sin el mensaje | salida 1, `Command failed` | salida 1, con el mensaje |

Las configs de OdySIF (`a11y`, `prod`, `smoke`) y las dos de document-manager casan con el glob. Una config con otro nombre queda fuera: no hay ninguna en estas dos suites.

## La init y la migración

| Escenario | Qué dejó | Resultado |
| --- | --- | --- |
| `m1-1`: paso 2 con E2E, y «sí» en el segundo turno | La tabla ofrece el test; `src/e2eTitles.test.ts` y 70 títulos en «Títulos heredados» | ✅ nace en verde; sondas abajo |
| `m1-4`: tras la pasada de fix | 91 líneas en el bloque; lista las 2 configs con el glob | ✅ propone también «Sin filtro» |
| `i1-1`: init con E2E, hasta `## Testing` | Ofrece el test con el «sí» | ✅ lo ofrece, sin escribir nada, como pedía la prueba |
| `n2-1`: paso 2 con restos de `e2e` en `package.json` | Dice que no lo ofrece y pregunta si hay suite | Inválido: el mismo molde |
| `n2-3`: paso 2 sin E2E, molde limpio | Tabla sin campos E2E | ✅ no pide nada; a la pregunta de la prueba («lo que ofreces») contesta que nada |

Sin sujeto: la init sin E2E (la fila lleva el predicado «With E2E tests») y la rama del «sí» de la init, que escribe el test: la instrucción es la misma regla 1 que `m1` y `a1` siguen.

`m1-4` corrió antes del último retoque de la regla 1, y sus sondas son las de `m1-1`, de una sola config.

Sondas sobre el test de `m1-1`: sin cambios, salida 0; test nuevo, bucle y `@slow`, salida 1, nombrados; spec que lanza al cargar, salida 1, sin el mensaje de la spec: su test no saca el error del JSON de Playwright; spec heredada borrada, salida 1.

Coste: RED 0,71 $, GREEN 5,95 $, 18 sujetos en total, con los de la pasada de fix y los dos del molde inválido. Previsto: 7,2 $ y 12 sujetos; se quedó por debajo en dinero.
