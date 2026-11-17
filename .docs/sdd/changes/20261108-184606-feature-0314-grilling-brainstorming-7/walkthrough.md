---
id: 20261108-184606-feature-0314-grilling-brainstorming-7
feature: 0314
title: Walkthrough — sdd-grilling con brainstorming de superpowers 7.0.2 y grilling de mattpocock v1.3.2
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-09
---

# Walkthrough — sdd-grilling con brainstorming de superpowers 7.0.2 y grilling de mattpocock v1.3.2

## 1. Cambios realizados

- **RED de las cuatro sustituciones** (`451d5c91`): escenarios `p1`, `p2` y `p3`, filas W1-W5 y molde `salas-csv` en la batería de `sdd-grilling`. Con el kit de `develop`, solo falla W1 (2 de 2: «¿Adónde va el CSV?» sin preguntar para qué). W2 (0 de 6), W3 (0 de 8, y 0 de 22 salidas guardadas) y W4 (0 de 2, re-medida con la fila 2 corregida) salen limpias: la (1), la (3) y la (4) no entran.
- **El porqué primero** (`23775f1d`): en `skills/sdd-grilling/SKILL.md`, «Ask next the decision that reshapes most others…» pasa a «If neither the user nor the project says why they want it, ask that first, even if you can guess: open, «what will you do with it?», not «a spreadsheet, a colleague, a backup?». Then the decision that reshapes most others…». W1 2 de 2 tras dos rondas de REFACTOR, y 1 de 1 con el texto final tras la revisión. 872 palabras, con el tope de 900.
- **Las dos fuentes al día**: en `upstream.json`, superpowers `v7.0.2` (con la nota «…desde v7.0.2, también la de preguntar primero el porqué») y mattpocock `v1.3.2`; avisos regenerados. `kit:upstream` ya no da rojo en `sdd-grilling`.
- **Batería**: `TURN2` de `g3` y `g6` contesta el porqué, porque el primer turno lo pregunta ahora.
- **Capacidad `interviewing`**: el GIVEN de «Una decisión por turno» lleva «con el porqué ya dicho», y entra «El porqué va primero».

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2,5 h
- Esfuerzo real: 1,73 h — reloj de la sesión 14,50 h desde 2026-11-08T18:40Z, sin 767 min de espera al dev-lead (4 esperas)
- Desviación: -0,77 h (-31 %)
- Causa de la desviación: Esperas y huecos: 18:49Z 7 min; 19:08Z 129 min; 21:27Z 1 min; 22:19Z 630 min. Las tandas de la batería corrieron en segundo plano y parte de su espera cae en esos huecos: cuánto, sin medir; el esfuerzo real se queda corto en esa parte.
- Compactación: sí, antes del plan (en la spec) → Native, con las dos tasks después en la misma sesión (ruling del plan, decisión 2)
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 52.989.912 — claude-opus-5-5 52.989.912
- Tokens de subagentes: 3.935.247 en 6 despachos — Revisor de spec, dominio claude-opus-5-5 202.017 / 1 min; Final review — Spec axis claude-opus-5-5 1.338.990 / 3 min; Revisor de spec, segunda ronda claude-sonnet-5-5 218.359 / 2 min; Revisor de spec, técnica claude-sonnet-5-5 126.004 / 1 min; Final review — Code axis claude-sonnet-5-5 364.629 / 1 min; Re-revisión única 0314 claude-opus-5-5 1.685.248 / 3 min
- Coste de la sesión: 25,32 $ (hilo 21,55 $ + subagentes 3,77 $)
- Coste de sujetos: 10,13 $ en 47 sujetos sonnet — RED 1,21 $; `red2` 0,38 $; GREEN 1,22 $; batería entera 4,41 $; REFACTOR 1 y controles con `develop` 1,63 $; REFACTOR 2, `g3` y `g6` 0,85 $; medición tras la revisión 0,43 $
- Review de spec: 2 revisores · hallazgos 17, aceptados 16; segunda ronda, 1 revisor · hallazgos 10, aceptados 10 (2 en parte)

## 3. Desviaciones del plan

- **Enmienda del 2026-11-08** (aprobada: «1»): RED limpio en la (1) y la (3); la (4) se re-midió porque la fila 2 del molde («solo las reservas desde hoy») chocaba con las reservas sin fecha, y salió limpia. Salen del delta tres ADDED y la línea `REMOVED`.
- **Enmienda del 2026-11-09** (aprobada: «1»): previsión de 44 a 47 sujetos para una segunda ronda de REFACTOR con contraejemplo literal, tras W1 en 1 de 2 en GREEN y en la primera ronda (menú de ejemplos de respuesta).

### Decisiones tomadas sin el dev-lead

- el roadmap del molde salas tiene CRLF en el checkout de Windows; salas-csv inserta la fila 2 con el fin de línea que encuentre y falla si no está la fila 1 — si es errónea, ninguno: el seco lo comprobó
- molds.test.ts no construye moldes de sdd-grilling; esa comprobación de la Verificación no aplica — si es errónea, salas-csv sin test automático (el seco lo cubre)
- la verificación de vitest corre con pnpm exec vitest en vez de npx vitest (MODULE_NOT_FOUND con npx en worktrees, ledger de la 0297) — si es errónea, ninguno: mismo binario
- W5 1/6 en RED y en GREEN — mismo fallo y misma tasa con el kit de hoy, y la (1) que lo tocaba no entra: no es regresión — si es errónea, la frase del porqué empuja a rellenar el para qué en la nota
- REFACTOR de forma (Art. II): «ask that first, open, even if you can guess» → «ask that first, even if you can guess: open, with no options or example answers», en la misma frase; aplica el THEN aprobado («sin alternativas, recomendación, hipótesis ni ejemplos»), no lo cambia — si es errónea, la frase gana 4 palabras sin efecto
- control con N=1 no lanzó p1-p3 (sin tools.txt; el lanzador no los arrancó): los cubren GREEN y REFACTOR a n=2 — si es errónea, ninguno: miden lo mismo con más sujetos
- COST_CAP es acumulado de la campaña (SPEC_DIR), no por tanda — el control con COST_CAP=6 dejó sin lanzar p1-p3 y la primera tanda de REFACTOR/control-dev no lanzó nada; se relanza con COST_CAP=13, el techo de la spec — si es errónea, ninguno: el techo es el aprobado
- g3 (y g6) con TURN2 «sí, adelante: feature full con delegate» ya no llegan a una decisión de diseño: el turno 1 acaba ahora en el porqué y TURN2 no lo contesta (g3-1 del control escribe la spec sin pregunta de diseño; R6 sin medir). TURN2 pasa a llevar el porqué; g3 y g6 se repiten con el kit del REFACTOR — si es errónea, la batería cambia un turno de prueba que medía otra cosa
- Spec Important 2 y Código Minor 2 — el contraejemplo de la (2) repite en Overview el «sin menú» de «Discovery» — se queda: el texto y su sitio los aprobó el dev-lead en la enmienda 2026-11-09 («un contraejemplo literal dentro de la misma frase»); moverlo a «Discovery» cambia el Approach aprobado y pide re-medir p1, g2, g5 y g8 fuera de la previsión — si es errónea, la regla del menú vive en dos sitios y quien edite uno puede olvidar el otro (va al ticket)
- Spec Minor 3 y Código Minor 3 — p2 y p3 sin medir con el texto final — la medición tras la revisión va a g8 ×2 (Important 1) y p1 ×1 (W1 con el texto final), los 3 sujetos que quedan de la previsión; la condición «If neither … says why» no cambia de sentido desde GREEN, donde p2 y p3 dieron W2 4/4 y en REFACTOR 1 4/4 — si es errónea, el AND «no lo pregunta si ya está» queda sin medir con el texto final
- Spec Minor 8 — p1-2 de REFACTOR 2 pasa W1 «en el límite» (facetas, no respuestas) — pasa tal como está escrita W1; p1 se mide otra vez con el texto final — si es errónea, W1 es 1/2 y no 2/2
- Código, declinado: la skill crece ~28 palabras — es una sincronización con la fuente (Art. IX), no un arreglo de ticket; 872 < 900 — ninguno
- Código, declinado: seguir brainstorming 7.0.2 literal, (1)(3)(4) fuera, coste y tamaño de muestra, W5 y p3 sin sdd-grilling, roadmap — del eje Spec, de la spec o del proceso, y la evidencia los registra — ninguno
- Spec, declinado: kit 2.3.4 frente a 3.0.0 del molde (g7, p1-2) — previo, falla igual con develop — si es errónea, ruido que tapa g7 en todas las campañas (va al ticket)
- Spec, declinado: R1 del turno 1 de g8 con REFACTOR 1 y R1 de g8 previo; calidad de subject.mjs; mensajes de commit — previos o de otro eje — ninguno
- Spec «no verificado»: palabras, kit:upstream, kit:own, kit:skill-size, kit:copies, notices/word-budget/dist — verificados en el hilo en esta sesión (ledger de la Task 2) y se repiten tras la pasada de fix — ninguno
- Spec Important 1 (g8 R5 rojo con la rama, verde con develop) — no es regresión: R5 falla en las 2 sesiones en que sdd-init no carga sdd-grilling (control g8-1 GREEN, post g8-1 final) y pasa en las 3 que la carga (develop, REFACTOR 1, post g8-2 final); el texto de la rama no llega a los sujetos que fallan — si es errónea, la frase empeora el descubrimiento en sdd-init (2 sujetos más con carga lo descartarían)
- Minor nuevo «Final: fixed Código Minor 1 sin salida de tests» — tras la pasada de fix corrieron pnpm exec vitest run test/kit/word-budget.test.ts test/kit/dist.test.ts → Test Files 2 passed (2), Tests 98 passed (98), y el pre-commit de la pasada de fix (juntada en el cierre) cli:test → 86 files, 2350 passed | 13 skipped; 873 palabras con wc del hilo, 872 con el split del test — si es errónea, ninguno: la salida está aquí

## 4. Verificación

### 4.1 Builds

- `moon run kit:notices` y `kit:build` (el diff de los avisos, solo las dos filas de `sdd-grilling`); `kit:copies` → «Copias al día: 31 ficheros.»; `kit:own` → las 26 líneas de la línea base, ninguna de `sdd-grilling`; `kit:skill-size` → solo la FALLA previa de `sdd-roadmap` (21680 bytes); `kit:upstream` → solo la entrada de `cli/src/tasks/` (0313); `pnpm exec vitest run` de notices, word-budget y dist → Test Files 3 passed (3), Tests 114 passed (114), y tras la pasada de fix word-budget y dist → 98 passed (98); pre-commit `cli:test` de la pasada de fix (juntada en el cierre) → Test Files 86 passed (86), Tests 2350 passed | 13 skipped. `sdd-grilling`: 872 palabras, con el tope de 900.
- Línea base, en un worktree desligado en `4284ad1e`: `moon run kit:test-headless cli:typecheck cli:test` verde (cli:test 2350; kit:test-headless 448).
- Gate: corre una vez tras `sdd merge --sync`, porque hay tres ramas abiertas a la vez (0308, 0309, 0313); su línea y su sha van en el mensaje final del cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-09 · smoke 3/3 THEN con ejecución real (batería de `sdd-grilling`, Sonnet: `p1` W1 2/2 con REFACTOR 2 y 1/1 con el texto final; `p2` y `p3` W2 8/8; `g3` R1 con el `TURN2` nuevo) · no regresión con el kit de `develop` (`g7`, `u1` y `g8` iguales; R5 de `g8` falla solo sin cargar `sdd-grilling`) · fuentes y avisos como dice 4.1 · revisión final Spec y Código sobre `23775f1d`, pasada de fix (juntada en el cierre) y re-revisión limpia · gate tras la sync, en el mensaje final

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| MODIFIED «Una decisión por turno»: con el porqué ya dicho, el turno acaba con una sola decisión | ejecución real: `g3` con el `TURN2` que da el porqué, kit de REFACTOR 2 (`control-r2/out/g3-1`); `p2` y `p3` (`green/`, `refactor/`) | pasa: «¿Qué pasa cuando Norte se libera?», una sola decisión; `p2` y `p3`, una sola decisión de diseño |
| ADDED «El porqué va primero», THEN: sin porqué, la primera pregunta es para qué lo quiere, abierta | ejecución real: `p1`, `refactor2/out/` (2) y `post-p1/out/` (1) | 3/3: «¿Qué vas a hacer con el CSV?», sin menú de respuestas |
| ADDED, AND: con el porqué en la petición o en la fila del roadmap, no lo pregunta | ejecución real: `p2` (en la petición) y `p3` (en la fila 2), `green/` y `refactor/` | 8/8: ninguno pregunta el porqué; con REFACTOR 2 sin medir en `p2` y `p3` (ruling) |

### 4.3 Residuales / deuda generada

- `sdd-init` y `sdd-propose` no siempre cargan `sdd-grilling`: en 4 de los sujetos de esta campaña (`g8` ×2, `p3` ×2) la pregunta salió sin la skill, y con la forma equivocada (R5 o R2). Es previo a la rama y va al ticket.
- La regla del menú de respuestas vive en dos sitios, la frase del porqué y «Discovery» (ruling de la revisión final). Va al ticket.

## 5. Aprendizajes

- `COST_CAP` cuenta toda la campaña del `SPEC_DIR`, no la tanda: el control con `COST_CAP=6` dejó sin lanzar `p1`-`p3`, y la primera tanda de REFACTOR no lanzó ningún sujeto. Es el segundo caso: la 0297 ya lo tuvo con `PHASE=red2`. `tech-stack.md` ya lo dice (`COST_CAP` común a todas las fases): la regla existía y no la apliqué → ticket del kit.
- Un molde que fija una decisión en el roadmap tiene que buscarse antes un hecho del proyecto que choque con ella: «solo las reservas desde hoy» chocaba con las reservas sin fecha, y el escenario midió «Rebatir una vez» en vez de «no reabrir». → `tech-stack.md`, bullet del molde que contiene el dato.
- Una frase que cambia el primer turno deja sin sentido los `TURN2` que daban por hecho otro primer turno (`g3` y `g6`): tras un cambio de orden, los turnos fijos de la batería se releen. → `tech-stack.md`, bullet de los fallos de varios turnos.
- Decir «sin ejemplos» no quitó el menú de respuestas en una de cada dos; el contraejemplo literal, sí (fallo de forma, Art. II). → procedencia de la batería de `sdd-grilling`.
- Retro: error que cazaría un chequeo → ticket del kit: `battery.mjs run` sale sin lanzar ningún sujeto cuando fases anteriores ya gastaron el `COST_CAP`, y solo lo dice «techo alcanzado» en el log de la tanda (control con `COST_CAP=6` sin `p1`-`p3`, REFACTOR 1 sin sujetos; segundo caso tras la 0297)
- Retro: documento o skill desmentido → corregido en la spec (decisión 11, enmienda 2026-11-08): daba por hecho que ningún hecho del molde chocaba con «desde hoy»
- Retro: documento o skill desmentido → ticket del kit: `sdd-init` y `sdd-propose` dicen que preguntan con `sdd-grilling`, y en 4 sesiones de esta campaña no la cargaron (`g8` ×2, `p3` ×2), con la pregunta en la forma equivocada (fila de deuda «La invocación de `sdd-grilling` no carga siempre»)
