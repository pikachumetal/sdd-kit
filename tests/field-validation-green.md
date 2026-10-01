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
