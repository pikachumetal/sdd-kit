# GREEN — validación en campo como modo del proyecto (feature 0118)

Mismos escenarios y molde que el [RED](field-validation-red.md), con la copia del kit de este worktree tras cada task. Salidas en `green/out/` de la [carpeta de la spec](../.docs/sdd/specs/20260930-211302-feature-0118-field-validation-mode/). Sonnet headless, `delegate`, sin `AskUserQuestion`.

## Task 1 — `control-profiles.md`, paso 7 de `sdd-start-feature` y plantillas

3 sujetos, 0,48 $.

| # | Conducta | Resultado |
| --- | --- | --- |
| F1–F4 en `f1` (`f1a-1`, `f1a-2`) | Con `field`, sigue sin parar y registra la validación en campo | ❌ 0/2: los dos entraron directos por `sdd-end-feature` («Sigue con la feature 0030 donde la dejaste… revisión final limpia») y pararon en su paso 0, que en ese momento no tenía la regla. El paso 7 no se leyó. Se re-mide tras la Task 2 |
| D1, control | `d1`: adenda en el walkthrough de la 0022 con solo lo que dijo el dev-lead, y `validaciones pendientes: 0022, 0025` → `0025` | ✅ 1/1 |
| D2, control | `d1`: la 0025 intacta | ✅ 1/1 |

El sujeto de `d1` dijo «No encontré en el kit un procedimiento escrito para cerrar una validación diferida después de la release. Lo resolví con la forma del walkthrough y de la línea `validaciones pendientes:`». Es la misma fuente que en el RED.

## Task 2 — pasos 0, 1 y 8 de `sdd-end-feature`

5 sujetos, 1,38 $.

| # | Conducta | f1-1 | f1-2 | f2-1 | f2-2 |
| --- | --- | --- | --- | --- | --- |
| F1 | No para a pedir la validación y cierra | ✅ | ✅ | ✅ | ✅ |
| F2 | Walkthrough con `Validación en campo: <fecha> · <verificación>` | ✅ | ✅ | ✅ | ✅ |
| F3 | Fila de la 0030 en ✅, sin 🧪, y `Roadmap válido` | ✅ | ✅ | ✅ | ✅ |
| F4 | Sin guion de pruebas | ✅ | ✅ | ✅ | ✅ |
| C1 | Smoke propio: suite 3/3 y los dos THEN con ejecución real | ✅ | ✅ | ✅ | ✅ |
| C2 | Lo no probado va en la línea (la pantalla, fuera del scope) | ✅ | ✅ | — | ✅ |
| C3 | Sin merge ni push, como pide la petición | ✅ | ✅ | ✅ | ✅ |

Líneas escritas, por ejemplo:

- f1-1: `Validación en campo: 2026-09-30 · suite 3/3 · smoke 2/2 THEN con ejecución real · revisión final sdd-kit:effort-high + opus limpia sobre df890aa, sin hallazgos. No probado: la pantalla (fuera de scope).`
- f2-2: `Validación en campo: 2026-09-30 · suite 3/3 · smoke 2/2 THEN con ejecución real · revisión final opus limpia sobre 2f17766 (según el dev-lead). Lo no probado: la pantalla, que queda fuera del scope.`
- f2-1, en su informe: «`validation.mode` es `field` en `sdd-kit.json`, así que no te he pedido validación ni guion de pruebas. Lo verifiqué yo».

Control sin la clave (`f2m-1`, conducta del RED que la guía bordea): ✅ 1/1, para en el paso 0, presenta su smoke y su guion y pide la validación; la fila sigue `🔄 en curso`.

## Task 3 — paso 0 de `sdd-end-patch`

3 sujetos, 0,66 $.

| # | Conducta | p1-1 | p1-2 |
| --- | --- | --- | --- |
| F1 | No para a pedir la validación y cierra | ✅ | ✅ |
| F2 | `patch.md` §4 con `Validación en campo: <fecha> · <verificación>` | ✅ | ✅ |
| F3 | Fila de «Patches» sin 🧪 y sin fila en `## Release 1.4`; `Roadmap válido` | ✅ | ✅ (con un `✅` de prefijo en la descripción, que la plantilla no pide y el validador acepta) |
| F4 | Sin guion de pruebas | ✅ | ✅ |
| C1 | Smoke propio de §4 ejecutado (`npm test` 1/1 y `rooms` → `['Norte', 'Sur']`) | ✅ | ✅ |
| C3 | Sin merge ni push | ✅ | ✅ |

Líneas escritas:

- p1-1: `Validación en campo: 2026-10-01 · npm test 1/1 · smoke 1/1 caso con ejecución real (`rooms` → `[ 'Norte', 'Sur' ]`)`
- p1-2: `Validación en campo: 2026-10-06 · npm test 1/1 · smoke 1/1 caso con ejecución real (`rooms` devuelve `['Norte', 'Sur']`)` — y en su informe: «no he parado ni preguntado nada. He ejecutado yo el smoke».

Control sin la clave (`p1m-1`): ✅ 1/1, para en el paso 0 con su guion y no escribe nada.

Control tras el retoque de redacción del paso 0 («sigues con el paso 1.» → «sigues con el cierre sin parar», que cortaba la sección de `FrontendVerification.Tests.ps1`), en `refactor/out/`: ✅ 1/1, `p1-1` cierra en campo con `Validación en campo: 2026-10-06 · npm test 1/1 · smoke 1/1 caso con ejecución real` y la fila sin 🧪.

## Pasada de fix de la revisión final

Revisión final `sdd-kit:effort-high` + opus sobre `4ebd7ef0`: 0 Critical, 4 Important, 7 Minor diferidos. Los Important, cada uno con su test estático en RED (`tests/FieldValidation.Tests.ps1`, Describe `la validación en campo sin contradicciones ni huecos`, 5 tests: 5 en rojo antes del arreglo, 15/15 después):

1. Frases que decían que la validación para siempre («no se quita nunca», «la validación para siempre», «con el usuario ausente, la feature espera»): ahora exceptúan `validation.mode: field`.
2. Los pasos resumían la regla sin dos condiciones: el usuario que, aun en campo, dice qué probó (se registra `Validado`) y un valor distinto de `manual` o `field` (cuenta como `manual`, con el aviso literal «`validation.mode: <valor>` no admitido en `sdd-kit.json`: rige `manual`»).
3. `validation.mode` entra en la regla del atajo autoconcedido (enmienda E1 de la spec, pendiente del dev-lead).
4. El paso 7 en campo decía «sin la clave, lo que sigue» y dejaba fuera las reglas de verificación: ahora «lo que sigue vale en los dos modos, salvo el guion, la pregunta de validación y la espera».

Controles (Art. I), en `fix/out/`, 3 sujetos y 0,77 $:

| Escenario | Conducta | Resultado |
| --- | --- | --- |
| `f3` (nuevo: «Usa sdd-start-feature: sigue con la feature 0030 desde el paso 7», con una decisión de producto de la revisión final) | Entra por el paso 7, no pide la validación ni da guion, pregunta sola la decisión y deja el cierre en campo para después de la respuesta | ✅ 1/1: «No te pido guion ni validación, y esa validación se registra en campo… Cuando me contestes, aplico lo que decidas e invoco `sdd-end-feature`» |
| `f2` | Cierra en campo, con la línea y ✅ | ✅ 1/1 |
| `p1` | Cierra el patch en campo, con la línea y sin 🧪 | ✅ 1/1 |
## Coste total de la campaña

RED 7 sujetos y 1,10 $; GREEN 11 sujetos y 2,52 $ (incluida la primera ronda de `f1`); REFACTOR 1 sujeto y 0,25 $; pasada de fix 3 sujetos y 0,77 $. 22 sujetos y 4,64 $, dentro de la previsión (20 + 4 de reserva, ~10 $) y del techo (14 $).
