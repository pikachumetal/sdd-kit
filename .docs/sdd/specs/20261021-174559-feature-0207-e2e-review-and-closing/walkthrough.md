---
id: 20261021-174559-feature-0207-e2e-review-and-closing
feature: 0207
title: Walkthrough — E2E en la revisión y el cierre
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-21
---

# Walkthrough — E2E en la revisión y el cierre

## 1. Cambios realizados

- **Apertura**: spec, plan y RED previo con 6 sujetos (`f5` en la batería de `sdd-verify`; `e1` y `e2` en la de `sdd-archive`, con los moldes `hojas` y `reservas-e2e`).
- **Task 1 — restos de la 0180** (`60f73e47`):
  - la fila «Testing» de `migrations/v3.0.0.md` nombra los seis campos E2E, con «Entorno de la suite» y «Datos» en `pendiente` si no hay de dónde sacarlos;
  - V13 los mide todos;
  - la tabla de racionalizaciones de `writing-e2e.md` declara `test.fixme` con su título y la anotación de la issue.
- **Task 2 — el eje Código y los E2E** (`7e1523a1`): el encargo lleva `## E2E del proyecto` con «Flujos core», «Retries» y «Timeouts» de `operations.md`, o `sin E2E declarados`. Con esos campos, son Important:
  - un E2E nuevo sin flujo core;
  - un retry o un timeout subido sin su motivo;
  - una espera a un estado interno entre dos acciones del usuario.
- **Task 3 — la suite E2E del cierre** (`6fa6d47a`): `sdd-archive/references/e2e-suite.md`, en cinco pasos:
  - el entorno, levantado y comprobado por la sesión;
  - el gate tal cual;
  - un fallo de conexión vuelve al entorno;
  - el presupuesto, con su fila de deuda;
  - la tanda, acotada contra `merge.into` y anunciada con la línea `Tanda:`.

  El 4.1 del walkthrough gana la configuración, el entorno, `E2E: <duración> de <Presupuesto E2E>` y la tanda.
- **Pasada de fix de la revisión final** (juntada en el cierre), de los dos ejes:
  - la configuración del 4.1 también sin E2E;
  - `pendiente` con el umbral de 10 min;
  - la forma `no aplica` del entorno;
  - el puerto ocupado por un proceso ajeno: para y pregunta;
  - «Flujos core» vacío no dispara la primera regla;
  - la rúbrica X de `f1` mide el bloque E2E;
  - el runner del molde falla sin tests;
  - la enmienda del anuncio de la tanda.
- Evidencia: [tests/e2e-closing-red.md](../../../../tests/e2e-closing-red.md) y [tests/e2e-closing-green.md](../../../../tests/e2e-closing-green.md).

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 3h
- Esfuerzo real: 1,58 h — reloj de la sesión 2,41 h desde 2026-10-21T17:25Z, sin 50 min de espera al dev-lead (4 esperas)
- Desviación: −1,42 h (−47 %)
- Causa de la desviación: las tasks fueron texto corto y los sujetos corrieron en segundo plano mientras se escribía la task siguiente; la estimación contaba las esperas de las tandas como tiempo del hilo. Las dos vueltas de REFACTOR de `e2` y la revisión final cupieron en ese solape.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature)
- Tokens del hilo: 64.997.189 — claude-opus-5-5 64.997.189
- Tokens de subagentes: 6.359.094 en 3 despachos — Re-review final 0207 claude-opus-5-5 1.984.764 / 3 min; Final review — Code axis claude-sonnet-5-5 1.044.290 / 2 min; Final review — Spec axis claude-opus-5-5 3.330.040 / 4 min
- Coste de la sesión: 23,92 $ (hilo 19,97 $ + subagentes 3,96 $)
- Coste de sujetos: 8,29 $ en 21 sujetos Sonnet — RED previo 2,48 $; GREEN 3,54 $ (`v3`, `f5`, `f4`, `e1`, `e2`, `a3r`, `a1`); REFACTOR 1 de `e2` 1,12 $; REFACTOR 2 de `e2` 1,15 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- **Dos REFACTOR de `e2`**:
  - el primero, sin cambiar la spec: la línea fija `Tanda:` y «la rama» contra `merge.into`;
  - el segundo, con enmienda: el hueco del 4.1 y el techo de 22 sujetos («Sube a 22, una vuelta más (Recomendada)»).
- **El anuncio de la tanda antes de lanzarla sale 0 de 2**, y queda como deuda (enmienda de la revisión final, con la opción literal del dev-lead).
- **La Task 2 se preparó mientras corría el sujeto de la Task 1**; los commits van en orden 1, 2, 3.

### Decisiones tomadas sin el dev-lead

- Task 2: Ruling: se commitea antes que la Task 1, que espera a su sujeto v3; las tasks no comparten interfaces — coste si es erróneo: ninguno, el orden no cambia el diff. Ruling: WordBudget.Tests.ps1 va entero en el commit de la Task 3 (los cuatro topes): el pre-commit mide el working tree — coste: el commit de cada task no lleva su tope.
- Task 2: Ruling: corregido — v3 acabó antes del commit, el orden queda 1, 2, 3.
- Task 1: Ruling: el primer intento de commit cayó en cli:test con 10 rojos con el gate del baseline corriendo a la vez; cli:test solo, verde; reintento verde — coste: ninguno
- Baseline: Ruling: gate de cierre en rojo solo en cli:test-min, 3/1419 (mergiraf, cleanup, hotfix .slow: «fatal: failed to write commit object»), corrido a la vez que sujetos y commits; kit 1351/1351, cli 1122/1122; la rama no toca cli/; deuda «Dos tests lentos ajenos…» (fallos de git con la máquina cargada); se repite en la validación con la máquina libre — coste si es erróneo: un rojo de la rama que pasa por carga
- Task 3: Ruling: dos REFACTOR de e2 (la línea fija Tanda: y el «contra merge.into»; después el hueco del 4.1 por enmienda aprobada); el anuncio antes de lanzar queda 0/2 y va a una fila de deuda en el cierre — coste si es erróneo: una tanda larga se lanza sin que el dev-lead vea antes cuánto tarda (el alcance sí queda acotado)
- Final: Ruling: Spec I3 nadie provoca ERR_CONNECTION_REFUSED — sin sujetos (21 de 22); el paso 3 queda «no probado» en el 4.2 — coste si es erróneo: un agente que mira el código ante un rechazo de conexión, como en la 0223
- Final: Ruling: Spec I4 (parte) a3r no carga e2e-suite.md (su molde no declara E2E): la frontera «rojo de conexión frente a otro rojo» con E2E queda «no probado» — coste: un TimeoutError que dispara un env-up innecesario
- Final: Ruling: Spec I7 «recién vaciado» de la pieza (i) — lo cubre la regla de datos de la 0180 («Datos»: cada test crea y borra lo suyo; un test que solo pasa con el entorno vacío depende de otro) y «Entorno de la suite» es el comando del proyecto, que vacía si lo necesita — coste: un proyecto cuyo env:up no vacía y cuyos tests comparten datos
- Final: Ruling: Spec minor fila «The README trick…» en la tabla, contra la decisión 2 — es el contraejemplo que pide la ADR 0003 a la excepción «what you added and why» — coste: una fila sin RED propio
- Final: Ruling: Código m1 «configuración: solo con E2E» — rechazado: el MODIFIED de la spec la pide en toda feature (eje Spec I2) — coste: ninguno
- Final: Ruling: Código m7 duplicación en los fixtures — son moldes de batería, autocontenidos por escenario — coste: tocar cuatro ficheros si cambia el formato de e2e/config.json
- Final: Ruling: Código m8 comentarios de cabecera en subject.sh — convención del fichero (todas sus funciones la llevan) — coste: ninguno
- Final: Ruling: Código m10 repetición de test.fixme en writing-e2e.md — la forma con argumentos en la tabla la pidió la revisión final de la 0180 — coste: unas 10 palabras
- Final: Ruling: re-revisión, Important nuevo (guidance de la pasada sin prueba) — enmienda aprobada, «Mantener con enmienda (Recomendada)»: no medido, a deuda — coste: dos frases sin evidencia de conducta hasta la 0152
- Final: Ruling: re-revisión, Minor «Tanda: Tanda:» de la plantilla, test redundante de ArchiveSkill — se quedan: el hueco remite a la línea literal; el test duplica un prefijo — coste: lectura algo torpe

## 4. Verificación

### 4.1 Builds

- Baseline al arrancar (`moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`, con sujetos y commits a la vez): kit 1351/1351, cli 1122/1122, `cli:test-min` 3/1419 en rojo («fatal: failed to write commit object»).
- Suite completa: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → kit 1354/1354, cli 1124/1124, `cli:test-min` 9 en rojo de 1419 (siete ficheros de `test/merge/*.slow`: «unknown error occurred while reading the configuration files», «cannot use .git/info/exclude», «'origin' does not appear to be a git repository» en `Z:\TEMP\sdd-merge-*`), `cli:test-slow` saltada por moon tras el rojo · 17 min 16 s · configuración: la del gate · sobre la pasada de fix (juntada en el cierre). La rama no toca `cli/`.
- **Suite del cierre, en verde**: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → kit 1354/1354, cli 1124/1124, slow 295/295, min 1419/1419 · 14 min 38 s · configuración: la del gate, con `%TEMP%` de vuelta en el NVMe `C:` (el dev-lead lo había movido ese día a `Z:`, un disco mecánico WD Green, por los temporales de Claude) · sobre `582da606`. Los rojos de las pasadas anteriores eran de ese disco.
- `base: en rojo: el mismo comando también falla sin la rama` — `moon run cli:test-min` en un worktree desanclado de `origin/develop` (`a7f9afb6`): 2 en rojo de 1417 (`lock-and-base`, `hotfix`), 13 min 27 s. Fila de deuda «Dos tests lentos ajenos fallan con la suite entera y pasan solos» (parcial desde la 0204: «los fallos sueltos de git con la máquina cargada»).

### 4.2 Smoke / tests

- Validación en campo: 2026-10-21 · revisión final Spec y Código sobre `6fa6d47a`, pasada de fix y re-revisión (juntadas en el cierre; la re-revisión, 1 Important nuevo resuelto por enmienda y 3 Minor adjudicados) · 21 sujetos (RED, GREEN y dos REFACTOR) · gate de cierre en verde sobre `582da606` tras volver `%TEMP%` al NVMe (4.1).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| verification · el eje Código recibe el paquete y los campos E2E, o `sin E2E declarados` | suite (`VerifySkill.Tests.ps1`) y ejecución real (`f5`, `f4`: el encargo compuesto lo lleva) | pasa |
| verification · los tests sin flujo core, Important | ejecución real (`f5` ×2) | pasa |
| verification · los timeouts subidos sin motivo, Important | ejecución real (`f5` ×2) | pasa |
| verification · la espera a `savedStatus`, Important | ejecución real (`f5` ×2) | pasa |
| verification · con `sin E2E declarados`, ninguno | ejecución real (`f4` ×2) | pasa |
| archive · `env-up` y `/health` antes de la primera pasada | ejecución real (`e1` ×2) | pasa |
| archive · el gate literal, sin `E2E_TRACE` | ejecución real (`e1` ×2) | pasa |
| archive · ante `ERR_CONNECTION_REFUSED`, el entorno antes del código | ningún sujeto provocó el rechazo (el servidor ajeno respondía; ruling) | no probado |
| archive · `E2E: 48 s de 0,5 min` en el 4.1 y la fila de deuda | ejecución real (`e1` ×2: 48,7 s y 49,7 s) | pasa |
| archive · con `pendiente`, la duración sin deuda | ningún molde con `pendiente` | no probado |
| archive · la tanda, estimación y alcance antes de lanzarla | ejecución real (`e2`, dos REFACTOR: alcance 2/2; anuncio previo 0/2) | pasa en parte (enmienda, deuda) |
| archive · no repite `free.e2e.mjs` | ejecución real (`e2` REFACTOR ×4) | pasa |
| archive · no edita `src/` ni `e2e/` con la tanda en marcha | ejecución real (`e2`: ningún `Edit` entre el lanzamiento y el fin) | pasa |
| archive · el 4.1 repite la línea `Tanda:` | ejecución real (`e2` REFACTOR 2 ×2) | pasa |
| archive · el 4.1 con la configuración | ejecución real (`e1` ×2) y suite (`ArchiveSkill`, `ClosingVerification`); sin E2E, `a1` no la escribió antes de la pasada de fix | pasa con E2E; sin E2E, solo suite |
| archive · el 4.1 con el entorno y el E2E frente al presupuesto | ejecución real (`e1` ×2) | pasa |
| archive · 4.3 con la suite sobre su presupuesto o los 10 min | suite (`ClosingVerification.Tests.ps1`) | pasa |
| migration · los seis campos, con «Entorno de la suite» y «Datos» | ejecución real (`v3` ×1) | pasa |

### 4.3 Residuales / deuda generada

- El anuncio de la tanda antes de lanzarla: 0 de 2 tras dos REFACTOR → fila de deuda.
- Las excepciones de `e2e-suite.md` sin escenario: el rechazo de conexión, `no aplica` y un `TimeoutError` con los campos E2E → misma fila, como variante de molde pendiente (`reservas-e2e` con un `env-up` que no libera el puerto y un rojo que no es de conexión).
- Tercer y cuarto caso de la deuda de los fallos sueltos de git con la máquina cargada («Dos tests lentos ajenos…»): 3 de 1419 en el baseline, 9 en la suite del cierre y 2 sin la rama, cada vez en tests distintos de `test/merge/*.slow`.

## 5. Aprendizajes

- Una línea que el agente tiene que escribir en un mensaje antes de una acción no sale en un sujeto headless aunque la referencia la fije (0 de 4 en dos vueltas); la misma línea como hueco de una plantilla, 2 de 2. El momento «antes de» no lo garantiza la plantilla → `tech-stack.md`, «Sujetos headless».
- Un `tar` en segundo plano seguido de `&&` y `&` deja el kit de los sujetos a medias, y la guarda de `subject_init` lo para con «sin la skill using-sdd»: la copia del kit va en primer plano, antes de lanzar → `tech-stack.md`, «Sujetos headless».

## 6. Adendas
