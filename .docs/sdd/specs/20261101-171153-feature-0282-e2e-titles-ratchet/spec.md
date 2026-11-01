---
id: 20261101-171153-feature-0282-e2e-titles-ratchet
feature: 0282
title: El test de títulos E2E se adopta con ratchet y lee playwright test --list
mode: full
profile: delegate
status: approved
created: 2026-11-01
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-01
---

# Spec — El test de títulos E2E se adopta con ratchet y lee `playwright test --list`

🦆 Hoy, añadir el test de títulos a una suite con 70 tests deja la rama en rojo hasta decidir los 70. Con esto, el test nace en verde: los 70 títulos de hoy quedan apuntados como heredados. Si mañana alguien añade un test 71, sale en rojo y lo nombra; si borra uno de los 70, también, hasta que quite su línea, así que la lista solo encoge. Los títulos los da Playwright, también los que se montan en un bucle, que hoy no se ven. Al inicializar o migrar un proyecto con E2E se ofrece el test; a uno sin E2E no se le pide nada.

Validación: agente — `validation.mode: field`: tests, smoke y RED/GREEN registrados; el uso real lo hacen los proyectos a través de sus tickets.

## Capacidades

- Modificadas: `feature-flow` — «Un test del proyecto compara los títulos E2E con Flujos core»: ratchet, fuente de los títulos y lista sin declarar
- Modificadas: `migration` — nuevo requisito «La migración a v3.0.0 ofrece el test de títulos E2E»
- Modificadas: `onboarding` — nuevo requisito «La init ofrece el test de títulos E2E»

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `MODIFIED` (1 requisito de `feature-flow`) · tamaño: ~20 líneas en 4 ficheros. Queda el repaso de coherencia.

1. **`--list` sirve; el listado va con `--reporter=json`**, que da el `describe › título` sin parsear texto. Medido abajo: la salida de texto lleva línea y columna, que cambian en cada edición.
2. **Se lista cada config de Playwright del proyecto**, no solo `playwright.config.ts`: document-manager tiene 2, y mirar solo la primera deja fuera sus 34 tests de audit; OdySIF tiene 3 y ninguna se llama así.
3. **Se lista con el entorno que apaga los filtros de la config** (`grep`, `grepInvert`): con `grepInvert: /@slow/`, document-manager esconde 5 de 70 tests, y un test `@slow` nuevo pasaría sin verse. `testIgnore` se respeta: lo que ignora no es E2E.
4. **Un código de salida distinto de 0 es rojo con el error de Playwright**, nunca una lista vacía: una spec que lanza al cargar deja `Total: 0 tests` (medido), y el test diría que han desaparecido todos los heredados. Es el caso real de la config smoke de OdySIF sin `appsettings.local.json`: `smokeEnvironment()` se llama al cargar el fichero. La guía dice que esa lectura se mueve a una fixture o que el test le da al listado lo que necesita; el sujeto de OdySIF lo prueba.
5. **La clave es `describe › título`, sin fichero**: mover un fichero no es un título nuevo, y la ruta del JSON cambia de separador por sistema (`..\e2e\auth.setup.ts`). Contra: un título repetido en otro fichero no sale en rojo; en las dos suites, 0 repetidos dentro de una config salvo los mismos tests en dos `projects`, que deben contar como uno.
6. **Renombrar un heredado es un título nuevo**, y va al ✋ como cualquier otro: si renombrar valiera, el ratchet no encogería. Borrar un test sí quita su línea sin preguntar.
7. **«Títulos heredados» va dentro del campo «Flujos core»**, no como séptimo campo: así el texto «Los seis campos» y el paso que lleva el campo literal al eje Código no cambian, y un título heredado que el revisor ve en el diff está en la lista. `code-reviewer-prompt.md` no cambia. Coste: 70-100 líneas más en `operations.md` en una suite grande.
8. **Con «Flujos core» sin declarar o `pendiente` también se adopta**: el campo queda `pendiente` y todo título va a heredados. El criterio de hecho lo pide, y cambia el «con la lista `pendiente` no se pide» de la 0278 (delta). Sin E2E sigue sin pedirse.
9. **El test le pone un timeout propio de 30 s**: cada config tarda ~3 s, y con el default de 5 s de Vitest ya cae con dos configs.
10. **Lo que escriben los sujetos sobre las copias reales no se versiona**, contra la costumbre de `tech-stack.md`: son títulos de producto de clientes. La evidencia lleva recuentos, rojos y verdes, sin títulos; el test del sujeto se versiona solo si no los lleva.
11. **La init y la migración ofrecen el test en su paso de `## Testing`**, con su «sí» en el gate de esa tabla o en la entrevista; con «no», el campo queda como hoy y la regla 1 lo volverá a pedir al tocar un E2E. Ninguna pregunta nueva para un proyecto sin E2E.
- Política de modelos: revisores de la spec: ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, sin eje Arquitectura (solo texto de skills) · otros despachos en paralelo: sujetos Sonnet, por tandas · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Bloque «Títulos heredados», que nace en verde y solo encoge; `playwright test --list` como fuente; la init y la migración ofrecen el test; contras asumidos: colar un título nuevo como heredado solo se ve en el diff, y el ratchet no recorta la suite — «ok adelante» (2026-11-01, prompt de arranque)
- Saldo de palabras igual o menor en cada skill y plantilla editada — prompt de arranque

## Intent

Con el texto de la 0278, adoptar el test en una suite sin limpiar deja en rojo una rama que no iba de eso, y como solo lo pide la guía al tocar un E2E puede no llegar nunca. Además, el test que dejó el sujeto lee con regex, y 8 de 106 tests reales no tienen título literal. El éxito: sobre una copia de una suite real, el test nace en verde, y sale en rojo nombrando el título con un `test(...)` nuevo o de título dinámico y al borrar un heredado. Fracasaría si el test da verde con la lista vacía o sin ver un título que Playwright sí corre.

### Medidas (copias en el scratchpad, `--ignore-scripts`, sin navegadores ni entorno)

| Config | Tests | `--list` (`npx`, 3 pasadas) | Salida |
| --- | --- | --- | --- |
| document-manager, por defecto | 65 | 4,7 / 3,1 / 2,6 s | 0 |
| ídem con `E2E_SLOW=1` | 70 | 2,7 / 2,5 / 3,0 s | 0 |
| document-manager, audit (2 `projects`) | 34, 19 títulos distintos | 2,6 / 2,5 / 2,3 s | 0 |
| OdySIF, a11y | 12 | 2,4 / 2,3 / 2,1 s | 0 |
| OdySIF, prod | 4 | 2,2 / 1,9 / 2,3 s | 0 |
| OdySIF, smoke sin `appsettings.local.json` | 0 | 2,8 / 2,9 / 3,5 s | 1 |
| OdySIF, smoke con un fichero de relleno | 2 | no cronometrado | 0 |
| document-manager con una spec que lanza al cargar | 0 | no cronometrado | 1 |

`--list` no arranca `globalSetup`, `webServer` ni navegador: la config por defecto de document-manager tiene `globalSetup` y salió con 0 sin entorno, y la a11y de OdySIF tiene `webServer` con un build y tardó 2 s. El recuento dinámico coincide con el código: los títulos de bucle salen expandidos, uno por tema o por usuario. La medida es en Windows y en esta máquina; en Linux no se ha medido.

## Scope

- Entra: `skills/sdd-tdd/references/writing-e2e.md` regla 1; `skills/sdd-templates/templates/operations-template.md` «Flujos core»; `skills/sdd-init/SKILL.md`, fila «How it is tested»; `skills/sdd-upgrade/references/migrations/v3.0.0.md` paso 2, su «Escribe» y su verificación de `git status`; evidencia en `tests/`.
- No entra: recortar las suites de los proyectos, título a título; prohibir la sonda: el agente usa Playwright todo lo que necesite mientras trabaja; un verbo de CLI para el test: lo escribe cada proyecto, porque su runner y su suite son suyos; `code-reviewer-prompt.md`, `frontend-verification.md` y `e2e-suite.md` (decisión 7).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Forma del campo «Flujos core»: gana el bloque «Títulos heredados» | `operations-template.md:27`; lo nombran por el campo `e2e-suite.md:3`, `code-reviewer-prompt.md:18,81`, `sdd-verify/SKILL.md:197`, `writing-e2e.md:13,15`, `v3.0.0.md:41` y `verification.md:29` | Plantilla, guía y migración en el Scope; los demás no cambian, porque leen el campo entero (decisión 7) |
| «con la lista `pendiente` o sin E2E, no se pide ese test» | `capabilities/feature-flow.md:741`; `writing-e2e.md:15` («not `pendiente`») | delta, `MODIFIED`; guía en el Scope |
| «compara cada título de `test(...)` de los ficheros E2E» (lectura de ficheros) | `writing-e2e.md:15`, `operations-template.md:27` | Scope |
| Decisión de la 0278 «la init y la migración no ofrecen el test» | `patch.md` de la 0278 §3, ticket §1 | Artefactos de evento: no se reescriben; esta spec la sustituye |

- Filas que implementa: 0282 → `roadmap.md:126` (la marca el cierre) y las listas «tras» de `roadmap.md:127-128`, que siguen igual; nada en `skills/`, `cli/` ni `capabilities/`: comprobado con `git grep -n 0282`.
- Una pieza entra, otra sale: el texto nuevo lo pagan recortes dentro de cada fichero; la lista de lo que paga, en §Topes de palabras.

## Approach

La regla 1 pasa a decir, en este orden: qué lanza el test (`playwright test --list --reporter=json`, una vez por config, con los filtros apagados, sin levantar nada), cuándo sale en rojo (título en ninguna de las dos listas; heredado que ya no existe; salida distinta de 0), cómo nace (al faltar, con el primer E2E que se toca, se rellena «Títulos heredados» con todos los títulos de hoy) y qué no se hace (añadir una línea a heredados). Sigue viviendo en una suite que el cierre corre entera y sigue siendo el proyecto quien la escribe.

## Dónde se prueba

- El test nace en verde y sus rojos: un sujeto sobre una copia de document-manager y otro sobre una de OdySIF, y las cuatro sondas corridas a mano sobre el test que dejen (`test(...)` nuevo, título dinámico en bucle, heredado borrado, spec que lanza al cargar), como la 0278.
- La oferta de la migración: un sujeto con el paso 2 de `v3.0.0.md` sobre una copia con E2E, hasta su gate.
- La oferta de la init: un sujeto con `sdd-init` sobre una copia con E2E, hasta la fila de Testing.
- Sin E2E, ninguna petición: un sujeto de cada camino (guía y migración o init) sobre el molde sin E2E de la 0278.
- Saldo: `word-budget`, `skills`, `path-length` y `operations-gate-fields` de `cli/test/kit/`.

## Términos y ADR

- Términos resueltos: «Títulos heredados» — los títulos que la suite ya tenía al adoptar el test; ratchet — la lista solo encoge.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `feature-flow`

#### MODIFIED — Un test del proyecto compara los títulos E2E con Flujos core

- GIVEN un proyecto con «Flujos core» declarados en `operations.md` §Testing y un `test(...)` cuyo título no está en la lista
- WHEN una task toca un E2E siguiendo la guía de `sdd-tdd`
- THEN deja un test en una suite que el cierre corre entera, que sale en rojo y nombra ese título
- AND con el título en la lista sale en verde
- REMOVED AND con la lista `pendiente` o sin E2E, no se pide ese test
- AND sin E2E, no se pide ese test

#### ADDED — El test de títulos E2E nace en verde y su lista de heredados solo encoge

- GIVEN una suite con 70 tests en 2 configs de Playwright, sin el test de títulos y con «Flujos core» sin declarar
- WHEN una task toca un E2E siguiendo la guía de `sdd-tdd`
- THEN `operations.md` lleva todos sus títulos en «Títulos heredados» y el test sale en verde
- AND con un `test('exporta a PDF')` nuevo, sale en rojo y nombra `exporta a PDF`
- AND con un bucle nuevo sobre `claro` y `oscuro` cuyo `test(...)` tiene de título una plantilla `pinta en ${t}`, sale en rojo y nombra `pinta en claro` y `pinta en oscuro`
- AND al borrar un test heredado, sale en rojo y nombra su título hasta que se quita su línea
- AND el título nuevo es propuesta para el ✋: la task no añade su línea a «Títulos heredados»

#### ADDED — El test de títulos lee los títulos que corre Playwright

- GIVEN una config con `grepInvert: /@slow/` que esconde 5 de 70 tests, y otra config con 34 tests en 2 `projects`
- WHEN corre el test de títulos
- THEN compara los 70 títulos de la primera y los 19 distintos de la segunda, salidos de `playwright test --list`
- AND sin arrancar servidor, `globalSetup` ni navegador
- AND si `--list` sale con un código distinto de 0, el test sale en rojo con el error de Playwright, no con una lista vacía

### Capacidad: `migration`

#### ADDED — La migración a v3.0.0 ofrece el test de títulos E2E

- GIVEN un proyecto 2.x con `playwright.config.ts` y `e2e/booking.spec.ts`, sin «Flujos core»
- WHEN aplica el paso 2 de `migrations/v3.0.0.md`
- THEN la tabla ofrece el test de títulos, con «Títulos heredados» salidos de `playwright test --list`
- AND con el «sí», `operations.md` lleva el bloque, el test queda en una suite que el cierre corre entera y sale en verde
- AND en un proyecto sin E2E la tabla no lo nombra

### Capacidad: `onboarding`

#### ADDED — La init ofrece el test de títulos E2E

- GIVEN un proyecto con código, `playwright.config.ts` y tests E2E
- WHEN `sdd-init` llega a la fila de Testing
- THEN ofrece el test de títulos, y con el «sí» deja «Títulos heredados» salidos de `playwright test --list` y el test en verde
- AND en un proyecto sin E2E no lo nombra

## Topes de palabras

Saldo igual o menor en cada fichero (prompt de arranque): no se sube ningún tope. El conteo es el de `word-budget.test.ts`; `v3.0.0.md` es una migración, sin tope propio, pero entra en el saldo pedido. Previsto: unas 110 palabras más en la guía, 25 en la plantilla, 25 en la init y 40 en la migración.

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-tdd` (`writing-e2e.md`: 1002) | 4029 / 5038 | 1009 | sin cambio |
| `sdd-templates` (`operations-template.md`: 1143) | 16408 / 19650 | 3242 | sin cambio |
| `sdd-init` (`SKILL.md`: 2662) | 3259 / 3875 | 616 | sin cambio |

Lo que lo paga, cada uno en su fichero (la cifra final, en el walkthrough):

- `writing-e2e.md`: las filas «The helper already types…» y «Retries: 2…» de la tabla final, que repiten las reglas 4, 6 y 7; el resto de la regla 1 que la nueva sustituye; y la cita «Fix a shared helper» si aún falta.
- `operations-template.md`: la frase de «Flujos core» que la nueva sustituye, y lo que repita el bloque de ayuda de la línea 25.
- `sdd-init/SKILL.md`: en la misma fila, «it is the command, not its result» y lo que repita a la plantilla.
- `v3.0.0.md`: en la misma celda, «propuestos igual: los seis:» y las repeticiones de la fila de la init a la que ya remite.

Ninguno quita una instrucción: si un recorte la quitara, lleva su RED (Art. I).

## Previsión de coste

0,6 $ por sujeto: la 0278 midió 0,20-0,24 $ con un molde pequeño (`tests/e2e-core-flow-titles-green.md`); una suite real y un paso de init o migración dan más lectura, y el triple es supuesto mío. Pasos nuevos o cambiados: regla 1 (`a1`, `a2`), «Flujos core» (los mismos), fila de la init (`i1`), paso 2 de la migración (`m1`), sin E2E (`n1`, `n2`).

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 3: `a1` document-manager, `m1` y `i1` con el texto de hoy | 1,8 |
| GREEN | 6: `a1`, `a2` OdySIF, `m1`, `i1`, `n1` guía sin E2E, `n2` migración sin E2E | 3,6 |
| Una tanda de REFACTOR | 2: `a1`, `a2` | 1,2 |
| Controles | 0: sondas a mano sobre el test del sujeto, sin modelo | 0 |
| Medición tras la revisión final | 1: `a1`, solo si la pasada de fix toca la regla 1 | 0,6 |
| Suma | 12 | 7,2 |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-01 | aprobada (opción «Apruebo») |
