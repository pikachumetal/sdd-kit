# GREEN — el test de títulos nace en verde, solo encoge y lee `playwright test --list` (feature 0282)

Mismo lanzador que el [RED](e2e-titles-ratchet-red.md), con el texto de la feature. Sujetos Sonnet; las salidas llevan títulos de producto de clientes y no se versionan. Sondas: [`red/probes.mjs`](../.docs/sdd/specs/20261101-171153-feature-0282-e2e-titles-ratchet/red/probes.mjs), que imprime solo salida y si nombra el título sonda.

## La guía

| Escenario | Qué dejó | Resultado |
| --- | --- | --- |
| `a1-1`: document-manager, primer texto | El bloque con 70 títulos, sin test | ❌ la regla describía el test y dejaba «añádelo» al final |
| `a1-2`: tras poner «Missing, write it» en la primera frase | `src/e2e-titles/e2e-titles.test.ts`, 70 títulos, con `E2E_SLOW=1` y las 2 configs | ✅ nace en verde |
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
| Spec que lanza al cargar | salida 1, con el error | salida 1, con el error |
| Spec heredada borrada | salida 1 | salida 1 |

En `a1-2` el test se corrió con una config mínima de Vitest: el `test-setup.ts` global de la suite real necesita migraciones del backend, que la copia no lleva. Borrar la única spec de una config sale en rojo con `No tests found` de Playwright, sin nombrar el título: es la salida distinta de 0 de la regla.

## La init y la migración

| Escenario | Qué dejó | Resultado |
| --- | --- | --- |
| `m1-1`: paso 2 con E2E, y «sí» en el segundo turno | La tabla ofrece el test; `src/e2eTitles.test.ts` y 70 títulos en «Títulos heredados» | ✅ nace en verde; sondas abajo |
| `i1-1`: init con E2E, hasta `## Testing` | Ofrece el test con el «sí» | ✅ lo ofrece, sin escribir nada, como pedía la prueba |
| `n2-1`: paso 2 con restos de `e2e` en `package.json` | Dice que no lo ofrece y pregunta si hay suite | Inválido: el mismo molde |
| `n2-3`: paso 2 sin E2E, molde limpio | Tabla sin campos E2E | ✅ no pide nada; a la pregunta de la prueba («lo que ofreces») contesta que nada |

Init sin E2E: sin sujeto, como avisó el plan; la fila lleva el predicado «With E2E tests».

Sondas sobre el test de `m1-1`: sin cambios, salida 0; test nuevo, bucle y `@slow`, salida 1, nombrados; spec que lanza al cargar, salida 1, con el error; spec heredada borrada, salida 1.

Coste: RED 0,71 $, GREEN 3,35 $, 13 sujetos en total, dos de ellos más que los previstos por el molde inválido. Previsto: 7,2 $ y 12 sujetos.
