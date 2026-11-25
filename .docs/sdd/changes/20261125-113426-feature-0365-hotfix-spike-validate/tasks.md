---
id: 20261125-113426-feature-0365-hotfix-spike-validate
title: Tasks — El hotfix y el spike también validan en sdd-validate
---

# Tasks — El hotfix y el spike también validan en sdd-validate (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Los escenarios `vf8` y `vf9`, en rojo sobre las skills de hoy | done | 041a175 | vf8 RED limpio (control) |
| 2 | El spike valida su evidencia en `sdd-validate` | done | ac32382 | vf9 GREEN 2/2 |
| 3 | El hotfix valida como un patch y el cierre deja de validar | done | | vf8 GREEN 2/2; controles vf9 vf5 vf1 a4 |

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura no (plan), sobre 32060ca
Pasada de fix: e08d609ac, 9 hallazgos (fix de skill y molde; vf9 relanzado 1/2)
Re-revisión: 32060ca..e08d609, sdd-kit:effort-high + opus, quedan hallazgos (vf9 1/2 frente al 2/2 del Intent; paso a sdd-archive del spike sin observar)

| 4 | enmienda 2026-11-25: registro del spike en el walkthrough y molde | done | | vuelta de sdd-validate |
Revisión del diff de la vuelta (Task 4, d39944a): sdd-kit:effort-high + sonnet, 5 Minor: 1 arreglado (nota en el RED), 4 adjudicados

## Rulings

- Task 1: Ruling: vf8 sale limpio en RED (2/2: los sujetos ya pasan por sdd-validate porque el paso 7 de patch-flow.md nombra primero sdd-validate) — vf8 queda como control y la Task 3 lo mide igual — coste si es erróneo: el arreglo de patch-flow.md no tiene RED de conducta, solo el git grep
- Task 1: Ruling: el primer RED de vf9 corrió con medir-libres.mjs como esqueleto; los sujetos lo vieron y reabrieron O1, que no mide la regla — molde rehecho con una cuenta de comparaciones determinista que el molde ejecuta, salidas retiradas y RED relanzado — coste si es erróneo: 1,2 dólares perdidos
- Task 2: Ruling: kit:own rechazó «only … instead of» en las dos frases nuevas; reescritas sin cambiar su contenido («1 when…», «with no script», «the Spec axis alone», «not a test, and what fails is…») y distintas del literal de la spec y del plan — vf9 corre otra vez como control (N=1) en la tanda de la Task 3 — coste si es erróneo: el GREEN medido es del texto anterior hasta ese control
- Final: Ruling: Spec Minor 3 y Código Minor 3 (vf8 limpio en RED, sin guarda en cli/test/kit contra la frase vieja) — la ADR 0019 dice que las skills no se prueban por sus frases; el git grep del criterio de hecho basta — coste si es erróneo: la frase puede volver sin que falle un test
- Final: Ruling: Código Minor 5 (molde en specs/) — resuelto con el Important 1 del eje Spec
- Final: Ruling: Declined (Spec) spike en manual sin guion, «Smoke, suite» del modo agente en un spike, «new task at the end of the plan» en un patch — heredados de la 0362, fuera del delta — coste si es erróneo: un spike manual presenta un mensaje sin guion
- Final: Ruling: vf9 tras el fix 1/2 (vf9-1 registra en tasks.md y no en el borrador del walkthrough; un segundo caso tras el del GREEN) — el paso 5 de «Order» ya dice «in the draft walkthrough»; sin segunda pasada de fix, va al ticket — coste si es erróneo: un spike llega a sdd-archive con la validación en tasks.md y archive lo devuelve — superado: la Task 4 lo resolvió (vf9 2/2)
- Final: Ruling: el molde reservas-spike tiene dos defectos (Validación: agente frente a O3 de persona; medir-libres.mjs mide un modelo) que hacen parar a los sujetos antes de sdd-archive — se quedan: arreglarlos es otra tanda y otra pasada; va al ticket — coste si es erróneo: el paso a sdd-archive del spike sigue sin observarse — superado: la Task 4 arregló los dos
- Final: Ruling: diff Task 4 Minor 1 («never tasks.md» frente al Re-revisión: que va a tasks.md) — el «5» acota la frase al registro y vf9 lo siguió 1/1 donde llegó; tocarlo deja la skill en su tope y abre un commit sin revisar — coste si es erróneo: un sujeto duda dónde va Re-revisión:
- Final: Ruling: diff Task 4 Minor 2 (margen de 3 palabras en SKILL.md) — es el tope aprobado; el próximo cambio de la skill lo sube con su spec — coste si es erróneo: ninguno
- Final: Ruling: diff Task 4 Minor 3 y 4 (O3 «sin ella» y umbral de O1 igual a n en el molde) — vf9 2/2 con este molde, sin paradas por O3 ni reaperturas de O1 — coste si es erróneo: un sujeto futuro duda por el molde
