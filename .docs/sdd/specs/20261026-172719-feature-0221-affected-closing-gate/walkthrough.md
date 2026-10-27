---
id: 20261026-172719-feature-0221-affected-closing-gate
feature: 0221
title: Walkthrough — El gate de cierre corre solo lo afectado
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-27
---

# Walkthrough — El gate de cierre corre solo lo afectado

## 1. Cambios realizados

- **Línea `Gate:` por tarea** (`5e981f9`): `skills/sdd-verify/SKILL.md` gana la fila «Filtered gate passes» de «Common Failures» y la receta de la línea (`<tarea>: corrió <N>/<M>` con los tests en verde sobre el total, `<tarea>: saltada (<porqué de la herramienta>)`, la tarea cuya definición cambia corre sin filtro). La aplican el carril config de `skills/sdd-propose/SKILL.md` (paso 4) y el 4.1 de `skills/sdd-templates/templates/walkthrough-template.md`.
- **El cierre repite solo lo afectado y corre una sola suite** (`72d50b1`): `skills/sdd-archive/SKILL.md` pasos 1 y 6 y `references/merge-recipe.md` («The suite again», «No suite yet»); `skills/sdd-start-feature/SKILL.md` paso 7.
- **Línea base con gate filtrado** (`5f6aa4a`): `skills/sdd-worktrees/SKILL.md` Step 3, «Report» y Quick Reference.
- **Pruebas** (`6cbea7c`): gate de juguete con los flags de moon (`tests/batteries/sdd-archive/fixtures/gate/gate.mjs`), moldes `reservas-gate-base`, `reservas-gate-open`, `reservas-gate-plan` (batería de `sdd-archive`) y `reservas-filtro` (batería de `sdd-propose`), escenarios `g5`, `g6`, `w2` y `k6`; evidencia en `tests/affected-gate-red.md` y `tests/affected-gate-green.md`.
- **Capacidades**: `archive` (un requisito sustituido por otro de título nuevo, uno añadido y «Límites»), `feature-flow` (dos requisitos) y `verification` (uno añadido), fusionadas con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 4,5 h
- Esfuerzo real: 2,45 h — reloj de la sesión 19,54 h desde 2026-10-26T17:21Z, sin 1025 min de espera al dev-lead (6 esperas)
- Desviación: −2,05 h (−46 %)
- Causa de la desviación: sin medir. El reloj descuenta 1025 min en 6 esperas, entre ellas la noche del cuelgue del PC y las tandas de sujetos en segundo plano entre turnos; no separé cuántos de esos minutos fueron trabajo en segundo plano
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 67.665.174 — claude-opus-5-5 67.665.174
- Tokens de subagentes: 5.418.474 en 3 despachos — Final review — Spec axis claude-opus-5-5 2.662.192 / 5 min; Re-review final 0221 claude-opus-5-5 1.693.499 / 3 min; Final review — Code axis claude-sonnet-5-5 1.062.783 / 2 min
- Coste de la sesión: 26,91 $ (hilo 23,40 $ + subagentes 3,51 $)
- Coste de sujetos: 9,42 $ en 24 sujetos sonnet — RED 1,24 $ (más 1,28 $ de una tanda descartada); GREEN, REFACTOR, control y final 6,90 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La tarea `docs:check` del molde no se hizo: el Review Focus 1 no tenía sujeto.
- El RED se lanzó con `run.sh` (n = 1) en lugar de `battery.sh` (n = 2).
- Una tanda RED (4 sujetos, 1,28 $) se descartó: la copia del kit no llevaba `cli/`.
- `g5` y `g6` necesitaron una tanda de REFACTOR y `g5` un sujeto de control, aprobados por el dev-lead por encima del coste previsto.
- Enmienda de la spec, aprobada: `Validación en campo:` no lleva el sha del merge de sincronización (el walkthrough se commitea antes del sync).

### Decisiones tomadas sin el dev-lead

- Task 1: Ruling: k5 y el molde reservas-gate ya existían en la batería de sdd-propose — uso k6 y reservas-filtro — coste si es erróneo: un renombrado
- Task 1: Ruling: sin la tarea docs:check del plan — el Review Focus 1 no tiene sujeto y la tarea solo complicaba el molde — coste si es erróneo: un sujeto más si se quiere medir
- Task 1: Ruling: g6 usa develop_rooms_test en lugar de develop_advances — develop_advances reescribía src/rooms.js con el mismo contenido y la base solo traía docs — coste si es erróneo: ninguno
- Task 1: Ruling: el RED se lanza con run.sh (SUBJECT=1) en lugar de battery.sh, que corre n=2 — coste si es erróneo: ninguno
- Task 1: Ruling: primer RED inválido (copia del kit sin cli/, 4 sujetos, 1,28 $) — se relanza con cli y hooks en la copia — coste: 1,28 $ perdidos
- Task 3: Ruling: sin los controles a3, a3n y w1 — con la tanda RED descartada (1,28 $) superarían los 6 $ previstos; el texto conserva literal la rama sin filtro que miden — coste si es erróneo: una regresión de a3 que nadie mide hasta la batería de release
- Task 3: Ruling: recuperación tras caída del PC — se retoma con el GREEN de g5/g6/w2 ya en disco; se perdieron la Pester completa y la repetición de cli:test-min en la rama
- Task 3: Ruling: dev-lead aprueba otra tanda de g5 y g6 (~1,6 $, total ~7,1 $) y la enmienda de Validación en campo — opción «Apruebo»
- Baseline: Ruling: línea base en rojo — test/merge/hotfix.slow.test.ts «Error: Hook timed out in 10000ms.» (afterAll de helpers.ts:15) con 1497/1497; contraste en develop desanclado verde (79/79, 1497/1497, 10 min); repetido en la rama, hotfix.slow verde y otro rojo: registries.slow.test.ts «fatal: not a git repository» (fila de deuda de la 0204, parcial). Veredicto: no es de la rama; fila de intermitentes del afterAll al cerrar — coste si es erróneo: un rojo real de la rama tapado (la rama solo toca texto de skills y baterías)
- Task 3: Ruling: g5 1/2 en REFACTOR (g5-2 leyó «salvo A o B o C»); arreglo de precedencia en el paso 1 y un sujeto de control aprobado por el dev-lead (~0,5 $)
- Task 3: Ruling: las salidas GREEN de w2 entraron en el commit de la Task 3 (la carpeta green/ entera) — coste: ninguno
- Final: Ruling: dev-lead aprueba las dos enmiendas y la medición mínima (g5, k6, a3n; n=1, ~1,4 $)
- Final: pasada de fix de la revisión final sin preguntar (8 Important de texto y 11 Minor, `review.minors: fix`); la re-revisión dejó 3 Minor de texto, arreglados sin revisar en el commit de cierre — coste si es erróneo: un puntero de skill mal escrito hasta la próxima revisión

## 4. Verificación

### 4.1 Builds

- Línea base (`sdd-worktrees`, con la regla nueva): `moon run kit:test cli:typecheck cli:test-min` (sin `--affected`: en la rama recién abierta el gate filtrado no corría nada) → `cli:test-min` 1497/1497 con `Error: Hook timed out in 10000ms.` en el `afterAll` de `test/merge/hotfix.slow.test.ts`; contraste en `develop` desanclado 79/79 y 1497/1497 en 10 min; repetido en la rama, `hotfix.slow` en verde y otro rojo de carga (`registries.slow.test.ts`, `fatal: not a git repository`, fila de deuda de la 0204). Veredicto: no es de la rama.
- Gate de cierre: con otra rama abierta y la base 19 commits por delante, corre una sola vez en el paso 6 sobre el merge de sincronización; su línea `Gate:` y su sha van en el mensaje final.
- Pre-commit (`moon run cli:typecheck cli:test kit:test-fast kit:roadmap`) en verde en cada commit de la rama.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-27 · verificación del agente: smoke por THEN con sujetos headless (24 sujetos Sonnet, tablas en `tests/affected-gate-red.md` y `tests/affected-gate-green.md`), revisión final Spec y Código sobre 5f6aa4a con pasada de fix y re-revisión, 1 sin revisar (4 líneas de texto, juntadas en el cierre) · la suite corre sobre el merge de sincronización (paso 6)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| archive: tras el sync, el gate con `--base <sha de la validación>` corre lo que trae la base y no lo demás | ejecución real (g5 final) | ✅ `rooms:test` corrió, `bookings:test` saltada |
| archive: la línea `Gate:` del sync en el mensaje final | ejecución real (g5 final, control) | ✅ |
| archive: `--verified-at` con el sha del merge de sincronización | ejecución real (g5 final) | ✅ |
| archive: base de solo docs → no corre nada | no probado | sin sujeto (el molde con fila del roadmap chocaba en `--sync`); la guarda es la de `merge-recipe.md` |
| archive: gate sin filtro → la regla de antes | no probado | sin control `a3` (ruling de coste) |
| archive: suite única con otra rama abierta o base por delante | ejecución real (g6 refactor 2/2) | ✅; sin re-medir sobre el texto final |
| archive: sin otra rama y con la base al día, la suite en la validación | ejecución real (a3n final) | ✅ |
| archive: en `manual`, guion igual y suite tras el sync | no probado | sin sujeto |
| feature-flow: el gate se repite solo con lo que trae la base | ejecución real (g5) | ✅ |
| feature-flow: línea base filtrada → tareas del Scope sin filtro, la otra saltada | ejecución real (w2 2/2) | ✅ |
| feature-flow: Scope que ninguna tarea lee → todas saltadas y lista | no probado | sin sujeto (enmienda aprobada) |
| verification: la tarea de definición cambiada corre sin filtro y sustituye a su `saltada` | ejecución real (k6 final) | ✅ |
| verification: la línea literal, nunca `→ verde` | ejecución real (k6 2/2 y final) | ✅ |
| verification: la misma forma en 4.1, `patch.md` §4 y la línea base | ejecución real (g5, w2) · no probado (`patch.md`) | ✅ · sin sujeto de patch |

### 4.3 Residuales / deuda generada

- Fila de intermitentes: `afterAll` de `test/merge/hotfix.slow.test.ts` que agota los 10 s con la máquina cargada (abierta en el roadmap).
- g6 y w1 sin re-medir sobre el texto final, y los «no probado» de 4.2: riesgo aceptado por el dev-lead (2026-10-27).

## 5. Aprendizajes

- La copia del kit para los sujetos lleva `cli/` y `hooks/` además de `skills/` y `.claude-plugin/`: sin `cli/`, los sujetos no pueden ejecutar `sdd merge` y la tanda no mide nada → `tech-stack.md`, «Entrega de la skill al sujeto»
- Un gate filtrado por base no corre nada en una rama recién abierta y sale con 0: medido con moon 2.6.0 → `tech-stack.md` §Testing, junto al gate de cierre
- Revisión de skills: las únicas skills que cambian son las de esta feature (`sdd-archive`, `sdd-start-feature`, `sdd-verify`, `sdd-propose`, `sdd-worktrees`, `sdd-templates`); `.claude/skills/` del repo no tiene ninguna que repita estas reglas

## 6. Adendas
