---
kit_version: 3.0.5
lane: feature
id: 20261126-204807-feature-0371-spike-close-writes-rows
task: 0371
mode: lite
date: 2026-11-26
---

# Ticket para el kit — feature 0371: el cierre de un spike escribe las filas de su `research.md` §5

## Contexto

- Carril y modo: feature lite, perfil `delegate`, `validation.mode: field`, `ids.mode: sequence`
- Skills del kit usadas: sdd-propose, sdd-spec-writing, sdd-grilling, sdd-spec-approval, sdd-spec-review, sdd-rubber-duck, sdd-implement, sdd-implement-native, sdd-worktrees, sdd-tdd, sdd-validate, sdd-verify, sdd-parallel-agents, sdd-archive, sdd-retro, sdd-feedback
- Proyecto: el propio kit (skills en Markdown, CLI en Node, baterías con sujetos headless)
- Modelo del hilo: Opus 5.5, effort no registrado
- Modelos de los subagentes: sonnet (review de spec, eje Código, sujetos), opus (eje Spec, re-revisión)
- Coste en reloj: 1,16 h frente a 3 h estimadas
- Coste en tokens: hilo 47.337.635; subagentes 2.797.071 en 5 despachos; sesión 19,05 $; sujetos 5,15 $ en 12

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. «moves to each of those rows» deja «Externo» copiado en la fila del spike en 1 de 2 sujetos

- **Qué pasó**: tras la revisión final, la viñeta de `mode: spike` se midió dos veces con `sp1` N=2. Con «… and the spike's «Externo» becomes `—`», los dos sujetos vaciaron «Externo» también en las filas nuevas (SP3 0/2). Con «The spike's «Externo» moves to each of those rows», `sp1-1` dejó `#412` en las filas nuevas y en la del spike (SP3 1/2). El REFACTOR, con «moves to those rows», había medido 2/2. El dev-lead cerró con SP3 1/2 y la copia va a deuda.
- **Fuente**: `tests/sdd-archive-0371.md` (secciones REFACTOR y «Pasada de fix»); `.docs/sdd/changes/20261126-161357-feature-0371-spike-close-writes-rows/fix/out/` y `fix2/out/sp1-1.state.txt`; `.temp/sdd/spec/fix-run.txt` y `fix2-run.txt` (`fix: 2 sujetos · 0.83 $`, `fix2: 2 sujetos · 0.79 $`)
- **Dónde en el kit**: `skills/sdd-archive/references/records.md` §Roadmap, viñeta de `mode: spike`
- **Por qué el kit no lo evitó**: la regla describe un movimiento (dos escrituras en dos celdas) con un solo verbo; con n = 2 la varianza entre redacciones no se distingue del efecto
- **Coste**: 1,62 $ de sujetos en dos tandas y dos paradas del dev-lead por coste (walkthrough de la 0371 §3; enmienda de la previsión en la spec)
- **Propuesta**: escribir el movimiento como dos pasos con su valor literal en el orden en que se editan («the new rows' «Externo» is the spike's; then the spike's is `—`»), recortando en otro sitio para el saldo, y medir con n = 3
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN el molde `reservas-spike-rows` WHEN `sp1` corre con N=3 THEN SP3 pasa 3/3 (la 0030 con «Externo» `—`, las dos nuevas con `#412`)

### 2. Los informes de los ejes de la revisión final no quedan en el workspace

- **Qué pasó**: la sesión se compactó entre la pasada de fix y la re-revisión. El encargo de la re-revisión pide los hallazgos abiertos de cada eje, literales; no estaban en ningún fichero y salieron del transcript de la sesión con `grep` y un script de Node.
- **Fuente**: `.temp/sdd/spec/` (sin ningún informe de eje; sí `review-final-21369fe51.diff`); walkthrough de la 0371 §5, línea `Retro:`
- **Dónde en el kit**: `skills/sdd-verify/references/closing-the-review.md`, «The single re-review»; `skills/sdd-implement-subagent/re-review-prompt.md`, `[FINDINGS]`
- **Por qué el kit no lo evitó**: el kit guarda el paquete de la revisión en el workspace, pero no los informes; el ledger solo lleva los rulings
- **Coste**: ~5 min y tres llamadas de búsqueda (sin respaldo en commit)
- **Propuesta**: al volver cada eje, guardar su informe en `<workspace>/review-<eje>-<sha>.md`, y que el encargo de la re-revisión cite esas rutas en `[FINDINGS]`
- **Verificada**: sí — contrastado con `skills/sdd-verify/references/closing-the-review.md` (solo pide `Final: Ruling:` y `minor (deferred)` en el ledger)
- **Criterio de aceptación**: GIVEN una revisión final con hallazgos y una compactación antes de la re-revisión WHEN el hilo arma `[FINDINGS]` THEN lo lee de los ficheros del workspace, sin buscar en el transcript

### 3. La previsión de coste de una spec lite no reserva la medición de la pasada de fix

- **Qué pasó**: la previsión fijaba 10 sujetos y 4,35 $, con una tanda de REFACTOR y una fila «Medición tras la revisión final». La pasada de fix gastó esa tanda, falló SP3 y el lanzador se negó a la siguiente («techo de 10 sujetos de la previsión … alcanzado»): parada, enmienda de la spec a 12 sujetos y 5,22 $, y otra parada al acabar la tanda extra.
- **Fuente**: `spec.md` de la 0371, tabla de previsión y «Enmiendas»; salida de `node tests/headless/battery.mjs run` con `PHASE=fix2`
- **Dónde en el kit**: Art. I de la constitution del kit (previsión con una tanda de REFACTOR incluida); `skills/sdd-templates/templates/spec-template.md`, previsión de coste
- **Por qué el kit no lo evitó**: la tanda de REFACTOR incluida la gasta el GREEN; la medición tras la revisión final no tiene holgura si el fix falla una vez
- **Coste**: dos paradas del dev-lead y una enmienda de la spec (spec de la 0371, «Enmiendas»)
- **Propuesta**: la previsión de un cambio medido con sujetos reserva una tanda de holgura tras la medición de la revisión final, o la regla deja repetir esa medición una vez sin enmienda
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una pasada de fix cuya primera medición falla WHEN el hilo lanza la segunda THEN el lanzador no la para por techo y la previsión ya la contaba

## Lo que hice por iniciativa propia

- Guardé la salida de cada `battery.mjs run` en el workspace (`<fase>-run.txt`); sirvió para corregir las líneas de tanda de la evidencia, que había copiado con la etiqueta equivocada.

## Funcionó, no tocar

- El techo de sujetos del lanzador: paró dos veces exactamente donde la previsión decía.
- `roadmap check` compara estados por prefijo: `✅ → 0031, 0032` pasa sin cambiar la CLI.
- La re-revisión única en opus encontró un recorte no pedido en la pasada de fix (`records.md`, viñeta del `roadmap check`).

## Menores

- Copié la línea de tanda de la evidencia de la primera fila que imprime el lanzador (`red: 2 sujetos · 0.81 $`) en vez de la de la fase; lo vieron el eje Código y la re-revisión — `tests/headless/battery.mjs` (imprime todas las fases acumuladas, la nueva no destacada)
- `molds.test.ts` > `vf6` rojo una vez bajo carga en el gate, verde al repetir — a «Por triar»
- `capability check` avisa de 638 caracteres en el requisito nuevo de `spike` (máximo aconsejado 500) — `skills/sdd-spec-writing`, sin aviso al escribir el delta
