# GREEN — el test de títulos nace en verde, solo encoge y lee `playwright test --list` (feature 0282)

Mismo lanzador que el [RED](e2e-titles-ratchet-red.md), con el texto de la feature. Sujetos Sonnet; las salidas llevan títulos de producto de clientes y no se versionan. Sondas: [`red/probes.mjs`](../.docs/sdd/specs/20261101-171153-feature-0282-e2e-titles-ratchet/red/probes.mjs), que imprime solo salida y si nombra el título sonda.

## La guía

| Escenario | Qué dejó | Resultado |
| --- | --- | --- |
| `a1-1`: document-manager, primer texto | El bloque con 70 títulos, sin test | ❌ la regla describía el test y dejaba «añádelo» al final |
| `a1-2`: tras poner «Missing, write it» en la primera frase | `src/e2e-titles/e2e-titles.test.ts`, 70 títulos, con `E2E_SLOW=1` y las 2 configs | ✅ nace en verde |
| `a2-1`: OdySIF, sin `appsettings.local.json` | `e2e/titles.unit.spec.ts`, 18 títulos en 3 configs; movió a perezosa la lectura al cargar | ✅ nace en verde. Con el primer texto: la regla no cambió en lo que este sujeto siguió |
| `n1-1`: molde sin E2E, con restos de `e2e` en `package.json` y README | Sin test | Inválido: el molde aún nombraba E2E, y el sujeto dijo que había que declarar la lista |
| `n1-2`: molde sin E2E limpio | Sin test; dice que no es un E2E y que la guía no lo pide | ✅ no lo pide ni lo crea. Nombra de pasada que la lista no existe |

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
