---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: feature
id: 20261102-125142-feature-0285-load-test-timeouts
task: 0285
mode: lite
date: 2026-11-02
---

# Ticket para el kit — feature 0285: topes de 20 s por fichero en `cli:test`, sin editar `sdd-worktrees`

## Contexto

- Carril y modo: pedida como patch, subió a feature lite en la pregunta de carril; Native, perfil `delegate`, `validation.mode: field`
- Skills del kit usadas: `sdd-propose`, `sdd-rubber-duck`, `sdd-implement`, `sdd-tdd`, `sdd-worktrees`, `sdd-verify`, `sdd-archive`, `sdd-retro`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 (eje Spec), Sonnet 5.5 (eje Código y sujetos)
- Coste en reloj: 0,60 h de esfuerzo frente a 0,75 h estimadas (walkthrough §2)
- Coste en tokens: 5,47 $ de sesión al medir el cierre, más 0,73 $ de 2 sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Un criterio de hecho copiado de un ticket sin verificar pasaba ya antes del cambio

- **Qué pasó**: la fila y la petición fijaban «con CPU cerca del 80 % no da `Test timed out in 5000ms`». Con quemadores, sin arreglo, 5 pasadas a CPU media de 64-98 % dieron 0 timeouts. El fallo solo salió con 8 suites a la vez: 3 de 8. Cumplir el criterio literal no habría arreglado nada.
- **Fuente**: walkthrough de la 0285 §4.2; `.docs/sdd/field-reports/20261101-191017-feature-0182-doc-citing-comments.md` §2, «Verificada: sin verificar»; fila 0285 de `.docs/sdd/roadmap.md`.
- **Dónde en el kit**: `skills/sdd-roadmap/SKILL.md`, triaje de un ticket; `skills/sdd-templates/templates/launch-prompt-template.md`.
- **Por qué el kit no lo evitó**: el criterio de aceptación de un hallazgo `sin verificar` pasa a la fila con la misma fuerza que uno verificado, y el «hecho cuando» del prompt lo hereda.
- **Coste**: ~15 min de medidas y una decisión más en la spec. Un solo caso.
- **Propuesta**: sustituir texto en el triaje: el GIVEN de una fila que viene de un hallazgo `sin verificar` lleva `sin reproducir`, y el arranque lo reproduce antes de aceptarlo como criterio.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un ticket con un criterio `sin verificar` · WHEN `sdd-roadmap` lo tría a una fila · THEN el GIVEN de la fila dice `sin reproducir`.

### 2. Escribí en la evidencia del RED un hecho que no leí, y la evidencia sostenía una decisión de la spec

- **Qué pasó**: `tests/baseline-commit-0285-red.md` decía que `w4-2` corrió la línea base en un worktree desanclado. La corrió en el worktree de la rama, sin invocar `sdd-worktrees`. Solo miré la línea de `tools.txt` del commit y de la orden, recortada a 170 caracteres. Lo cazó el eje Spec. El veredicto `Wc` seguía en pie, pero solo `w4-1` midió el Step 3, y la decisión de no editarlo se aprobó con «los dos sujetos».
- **Fuente**: `.docs/sdd/specs/20261102-120757-feature-0285-load-test-timeouts/red/out/w4-2.tools.txt` línea 108; `w4-2.texts.txt`.
- **Dónde en el kit**: `tests/headless/battery.mjs`, `verdict`; `.docs/sdd/tech-stack.md`, «Baterías por skill», «Antes de leer una puerta, la primera línea de `state.txt`».
- **Por qué el kit no lo evitó**: la regla existía a medias: el veredicto de una fila en prosa lo lee el hilo, sin control de que el sujeto cargó la skill que se mide. `w4` no pasa de `sdd-implement`, y `battery.mjs verdict` dio «verde».
- **Coste**: una pasada de fix y un hallazgo Important. La aprobación de la spec se dio con una evidencia más débil de lo que decía.
- **Propuesta**: que una fila pueda declarar la skill que tiene que cargar el sujeto, y `verdict` dé «sin evidencia» si no aparece en `tools.txt`.
- **Verificada**: sí — contrastado con `w4-2.tools.txt`, sin ninguna llamada a `sdd-worktrees`.
- **Criterio de aceptación**: GIVEN `w4-2` sin `sdd-worktrees` en `tools.txt` · WHEN `battery.mjs verdict` con esa fila · THEN sale «sin evidencia» y no «verde».

### 3. Un sujeto en un worktree enlazado se salta `sdd-worktrees` entero, y con él la línea base desanclada

- **Qué pasó**: `w4-2` dijo «ya estábamos en un worktree aislado, así que no invoqué `sdd-worktrees`» y corrió la línea base en el árbol de la rama.
- **Fuente**: `.docs/sdd/specs/20261102-120757-feature-0285-load-test-timeouts/red/out/w4-2.texts.txt`.
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, Setup, paso 1.
- **Por qué el kit no lo evitó**: el nombre del paso, «Worktree», se lee como crear un worktree; la línea base va dentro. Es un solo caso.
- **Coste**: ninguno aquí, porque el sujeto no tenía RED a medio escribir.
- **Propuesta**: sustituir el rótulo del paso por «Worktree y línea base».
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un sujeto ya en un worktree enlazado · WHEN prepara la implementación · THEN corre la línea base en un worktree desanclado (fila `Wb`).

### 4. Un rojo de otra clase en `watch/loop`, sin causa

- **Qué pasó**: 1 de 48 suites dio `expected 'TERMINADO: node -e setTimeout(()=>{},…' to be 'TERMINADO: node -e setTimeout(()=>{},…'` en «con -- lanza el comando y termina con él, sin SILENCIO». El informe JSON de Vitest trunca el valor, y no sé el código de salida. No se repitió en 3 rondas más, ni con 3.000 hijos, 150 a la vez, todos con 0. Tampoco lo atribuyo a `sdd watch`.
- **Fuente**: walkthrough de la 0285 §4.3; `cli/test/watch/loop.test.ts`; `cli/src/tasks/command.ts`, `startToLog`.
- **Dónde en el kit**: no localizado en una skill; `cli/test/watch/loop.test.ts`.
- **Por qué el kit no lo evitó**: no aplica.
- **Coste**: un contraste de ~5 min. Si vuelve, un commit reintentado.
- **Propuesta**: si sale un segundo caso, que la aserción compare el código con una expresión que enseñe el valor recibido entero.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN el test en rojo por un código distinto de 0 · WHEN se lee su salida · THEN el mensaje nombra el código.

## Lo que hice por iniciativa propia

- Dos arneses de medida en el scratchpad: quemadores que sujetan la CPU a un objetivo, con calentamiento previo, y N suites a la vez. Sin calentar, la primera medida quedó en un 64 % de media, porque la suite dura 11 s. Se borraron al cerrar; si este tipo de medida se repite, conviene versionarlos.
- Dos mutantes para probar lo que el arreglo no debía esconder: un test de 6 s fuera de los ficheros con tope, y `watch.ts` sin `stop()`.

## Funcionó, no tocar

- «Si esto pide sujetos, dilo al clasificar» en la petición y la pregunta de carril: el patch subió a lite en una sola parada.
- El Art. I frenó una frase pedida por el dev-lead: el RED limpio la sacó de la spec, y él lo aprobó.
- La regla de `tech-stack.md` de reproducir el frente antes de presentar la spec evitó diseñar sobre la CPU.
- El eje Spec encontró una afirmación falsa en la evidencia.

## Menores

- `RUNS_DIR` en el scratchpad falla por longitud (179 caracteres, máximo 100), y el error da la salida: una vuelta — `tests/headless/lib.mjs`.
- `Select-String` sobre siete ficheros no encontró `spawn`, y escribí en un borrador de la spec que cuatro no lanzaban procesos; llegaban a `git` por los verbos. Lo corregí antes del gate — `skills/sdd-propose/SKILL.md`, repaso de coherencia.
- `sdd workspace` con un `spec.md` da la carpeta `.temp/sdd/spec`, sin el id, y dos lites a la vez en un worktree la compartirían — `cli/src`, verbo `workspace`.
- El gate cuenta los tests de `kit:test-headless`, y no los leí al escribir la línea `Gate:` — `skills/sdd-verify/SKILL.md`, «The `Gate:` line».
