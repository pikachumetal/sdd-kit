---
kit_version: 2.3.4
lane: feature
id: 20261108-131801-feature-0319-roadmap-check-file-overlap
task: 0319
mode: full
date: 2026-11-08
---

# Ticket para el kit — feature 0319: `sdd roadmap check` avisa de dos filas abiertas que tocan los mismos ficheros sin «tras»

## Contexto

- Carril y modo: feature full, perfil delegate, validación en campo
- Skills del kit usadas: sdd-propose, sdd-grilling (no se invocó: perfil delegate, todo a ✋), sdd-parallel-agents, sdd-implement, sdd-implement-native, sdd-worktrees, sdd-tdd, sdd-verify, add-to-changelog, sdd-archive, sdd-retro, sdd-feedback
- Proyecto: el propio kit (CLI en TypeScript + skills en Markdown), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet 5.5 (dos revisores de spec, eje Código), Opus 5.5 (eje Spec, re-revisión)
- Coste en reloj: 0,86 h frente a 1,5 h estimadas
- Coste en tokens: 34.495.980 del hilo + 3.002.792 de subagentes; 15,53 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El gate de cierre pasó del tope de 5 min por carga de otras sesiones, y ninguna regla dice cómo contrastar un rojo de tiempo

- **Qué pasó**: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` sobre el commit de cierre tardó 588 s; `kit:test-headless` sola, 9 min 34 s, con 6 `moon.exe` y 20 `node.exe` de otras sesiones en marcha. Repetida sola justo después: 151 s, 448/448. La línea base de la misma tarea en un worktree separado había tardado 4 min 18 s con las tres tareas.
- **Fuente**: salida del gate guardada en el scratchpad («`kit:test-headless (9m 34s 776ms…)`», «`exit 0 · 588 s`»); la repetición («`exit 0 · 151 s`», «`Tests  448 passed (448)`»); `Get-CimInstance Win32_Process` → `moon.exe 6`, `node.exe 20`; `.docs/sdd/tech-stack.md` §Testing, «Tope del gate de cierre: 5 min por pasada… Hasta que cierre la 0238, `kit:test-headless` es lo único que puede pasarlo»; la fila 0238 del roadmap está ✅.
- **Dónde en el kit**: `skills/sdd-archive/references/closing-suite.md` y `skills/sdd-archive/references/merge-recipe.md` («A red suite»): el contraste es para un test que falla, no para una pasada verde que pasa del tope; la regla del tope vive en `tech-stack.md` del repo, y su excepción caducó con la 0238.
- **Por qué el kit no lo evitó**: «Una pasada que pasa del tope es rojo y abre una fila de deuda» no distingue carga de la máquina de lentitud de la rama, y «A red suite» no tiene un caso para el tiempo; lo decidí con un ruling (repetir la tarea sola).
- **Coste**: ~10 min de espera del gate más 2,5 min de la repetición (salida de los dos comandos citados).
- **Propuesta**: en `tech-stack.md` §Testing, o en «A red suite» de `merge-recipe.md`: una pasada verde que pasa del tope se repite sola la tarea que lo pasó; si sola queda dentro del tope, el rojo es de carga y va al ticket con las dos medidas, sin fila de deuda.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un gate verde de 588 s con `kit:test-headless` en 9 min 34 s y 6 `moon.exe` de otras sesiones WHEN el cierre aplica la regla THEN repite `kit:test-headless` sola, registra las dos duraciones y fusiona si la repetición queda en el tope, sin abrir fila de deuda.

### 2. La «Verificación» del plan no copió el `--test-timeout 120000` de los tests lentos y `sdd task done` dio rojo dos veces

- **Qué pasó**: la Task 1 declaró `npx vitest run test/roadmap/`; `test/roadmap/` incluye `publish.slow.test.ts`, `publish-failures.slow.test.ts` y `cut.slow.test.ts`. `sdd task done` dio rojo dos veces: 17 y 18 tests con `Error: Test timed out in 5000ms.`, todos de esos ficheros; con `--test-timeout 120000`, 191/191.
- **Fuente**: `.docs/sdd/tech-stack.md` §Testing, «Verificación de una task: `npx vitest run <sus ficheros de test>` desde `cli/`, con `--test-timeout 120000` si alguno es `*.slow.test.ts`»; salida de `sdd task done` («`Tests  17 failed | 174 passed (191)`», luego «`Tests  191 passed (191)`»).
- **Dónde en el kit**: `skills/sdd-propose/references/plan-writing.md` y el campo «Verificación» de `skills/sdd-templates/templates/plan-template.md`; `sdd task done` (`cli/src/`), que acepta el comando tal cual.
- **Por qué el kit no lo evitó**: la regla existía en `tech-stack.md` y no la apliqué al escribir el plan; la plantilla pide copiar los comandos de §Testing pero no el tope de los lentos.
- **Coste**: ~3 min, dos pasadas de 64 s y 67 s más la lectura del log (salida de `sdd task done`).
- **Propuesta**: que `sdd task done` avise, o falle antes de correr, cuando el comando de Vitest incluye una carpeta o un fichero con `*.slow.test.ts` y no lleva `--test-timeout`; es más barato que otra línea en la plantilla.
- **Verificada**: sí — reproducido con `node ../dist/cli/bin/sdd.js task done … -- npx vitest run test/roadmap/` en PowerShell desde `cli/`.
- **Criterio de aceptación**: GIVEN `sdd task done <plan> 1 <base> -- npx vitest run test/roadmap/` con `*.slow.test.ts` dentro WHEN corre THEN avisa de que falta `--test-timeout 120000` antes de lanzar los tests.

### 3. Escribí en la spec un recuento de un molde que no había medido

- **Qué pasó**: la primera versión de la spec decía que `mold-salas-3-nofamily` daría 3 avisos; mi borrador de medida solo leía la forma 2.x, y ese molde es 3.0.0. El revisor técnico de la spec lo midió en 9; con el borrador corregido, 9 (y 14 en `mold-salas-3-family`).
- **Fuente**: hallazgo T1 de la review de spec, en `spec.md` de la 0319, «Hallazgos de la review»; salida del borrador corregido.
- **Dónde en el kit**: `skills/sdd-propose/references/coherence-pass.md` («each count of a check it fixes against what running it gives… one that can't run before the gate goes to ✋ as `sin medir`»).
- **Por qué el kit no lo evitó**: la regla existía y la petición la repetía («No escribas una cifra que no hayas medido»); conté a ojo la parte que el borrador no cubría en vez de marcarla `sin medir`.
- **Coste**: un hallazgo de la review y una re-medición, ~3 min (spec de la 0319).
- **Propuesta**: ninguna nueva; un solo caso. Si se repite, que el repaso de coherencia pida citar el comando que dio cada recuento de la spec.
- **Verificada**: sí — contrastado con `skills/sdd-propose/references/coherence-pass.md`.
- **Criterio de aceptación**: GIVEN una spec que fija el recuento de avisos de un fichero que el borrador no lee WHEN se hace el repaso de coherencia THEN la cifra va con su comando o como `sin medir` en ✋.

## Lo que hice por iniciativa propia

- Antes de fijar «antes de» y la cadena de «tras», medí con un borrador en el scratchpad las cuatro variantes (con o sin «antes de», directa o transitiva) sobre el roadmap real: las cuatro daban 6 avisos, y eso decidió que entraran sin ruido. Funcionó: la review de spec pidió la cadena y ya estaba medida.
- Comprobé la ADR 0011 corriendo `overlap.test.ts` y `dist.test.ts` con el Node 22.18.0 de proto, porque el eje Spec lo dejó «no verificado» y `cli:test-min` no va en el gate: 63/63.

## Funcionó, no tocar

- La petición traía «córrelo sobre un borrador antes de fijar la cifra»: la cifra de develop (6) no se movió en toda la sesión.
- Los dos revisores de spec en Sonnet sacaron 19 hallazgos sin un Crítico y casi sin solape entre lentes.
- La re-revisión única en Opus verificó los 13 hallazgos de la pasada contra el diff en 2 min.

## Menores

- `sdd task done … -- npx --prefix cli vitest run --root cli test/roadmap/` lanzado desde la raíz no carga `cli/vitest.config.ts` y los lentos vencen a 5 s; desde `cli/` sí — no localizado.
- `sdd capability check` avisa de que el requisito nuevo tiene 2.804 caracteres (aconseja 500), y la review de spec había pedido un AND por cada rama: las dos reglas tiran en sentidos opuestos — `skills/sdd-propose/references/review-spec.md` frente al aviso de `sdd capability check`.
- Dos números de línea mal contados en tests nuevos de la pasada de fix, corregidos antes del GREEN — no localizado.
