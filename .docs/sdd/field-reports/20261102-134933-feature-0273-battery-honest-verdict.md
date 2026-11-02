---
kit_version: 2.3.4
lane: feature
id: 20261102-134933-feature-0273-battery-honest-verdict
task: 0273
mode: full
date: 2026-11-02
---

# Ticket para el kit — feature 0273: battery.mjs dice lo que de verdad comprobó

## Contexto

- Carril y modo: feature full
- Skills del kit usadas: sdd-propose, sdd-implement, sdd-worktrees, sdd-tdd, sdd-verify, sdd-parallel-agents, sdd-archive, sdd-retro, add-to-changelog, sdd-feedback
- Proyecto: el propio kit, Node y Vitest
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 (eje Spec y re-revisión), Sonnet 5.5 (eje Código)
- Coste en reloj: 0,53 h frente a 1,5 h estimadas
- Coste en tokens: 9,35 $ (`sdd session tokens`, a falta del tramo del merge y este ticket)

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Una enmienda se marcó `sin aprobar` sin cumplir la excepción

- **Qué pasó**: la pasada de fix cambió la decisión 1 de la spec aprobada (nombrar todos los ids de una celda «Fila») y la commiteé marcada `sin aprobar`, como si aplicara literal una decisión del dev-lead. La frase estaba en el encargo, no en «Decisiones tomadas con el dev-lead». Lo cazó la re-revisión, y hubo una parada que no tocaba al final sino en la pasada.
- **Fuente**: `walkthrough.md` de la feature, §3; `skills/sdd-propose/references/control-profiles.md:71`.
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Deviations and rulings»; `skills/sdd-verify/SKILL.md`, «Closing the review».
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué. Está en `sdd-implement`, y en la pasada de fix el hilo seguía «Closing the review», que solo nombra la desviación para lo que deja abierto la re-revisión.
- **Coste**: una parada del dev-lead y un Important de la re-revisión.
- **Propuesta**: mover la frase «un hallazgo cuyo arreglo cambia una decisión de la spec es un desvío: para» a la pasada de fix de «Closing the review», sustituyendo a la mención de «What it leaves open».
- **Verificada**: sí — contrastado con `skills/sdd-verify/SKILL.md`, «Closing the review».
- **Criterio de aceptación**: GIVEN un hallazgo Minor cuyo arreglo cambia un literal de una decisión aprobada WHEN el hilo hace la pasada de fix en `delegate` THEN para antes de commitearlo, con 🦆 y ✋.

### 2. El plan se dejó un test que el Scope de la spec nombraba

- **Qué pasó**: `run.test.ts` estaba en el Scope y en «Dónde se prueba», pero no en §1.1 ni en los «Ficheros» de ninguna task; el eje Spec lo dio como Important.
- **Fuente**: `spec.md` y `plan.md` de la feature; `walkthrough.md` §3.
- **Dónde en el kit**: `skills/sdd-propose/references/plan-writing.md`, «Self-review», punto 1.
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué con detalle: mi §4 apuntó a las tasks sin contrastar «Dónde se prueba» con sus ficheros.
- **Coste**: un Important y un test en la pasada de fix.
- **Propuesta**: en el punto 1, sustituir «the task and the test» por «the task, the test and the file «Dónde se prueba» names».
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una spec cuyo «Dónde se prueba» nombra un fichero de test WHEN se escribe el plan THEN ese fichero está en los «Ficheros» de una task.

## Lo que hice por iniciativa propia

- Un humo con `battery.mjs run` y `run.mjs` de verdad, sobre una batería de juguete con un sujeto en node y `DRY_RUN=1`: dio las líneas literales que la tabla de THEN pide con `ejecución real`, sin gastar en sujetos.

## Funcionó, no tocar

- La tabla de «Dónde se prueba» más la lectura del eje Spec sobre las celdas reales de las rúbricas.
- La re-revisión en Opus: cazó el hallazgo 1.

## Menores

- `moon run cli:typecheck` salió bien dos veces con el mismo hash y el pre-commit dio `TS7006` sobre el mismo test; causa sin investigar — `moon.yml` de `cli`
- `sdd capability merge` sin delta da `Sin delta que fusionar`, y la spec lo apunta sin más: bien, pero «Capacidades: Ninguna» ya lo dice — `skills/sdd-propose/SKILL.md` paso 4
