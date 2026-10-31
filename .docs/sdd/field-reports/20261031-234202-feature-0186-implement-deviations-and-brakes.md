---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: feature
id: 20261031-234202-feature-0186-implement-deviations-and-brakes
task: 0186
mode: full
date: 2026-10-31
---

# Ticket para el kit — feature 0186: freno por regiones, `tasks.md` por CLI y oferta con su número; dos frentes dieron la vuelta

## Contexto

- Carril y modo: feature full, perfil `delegate`
- Skills del kit usadas: `sdd-propose`, `sdd-start-feature`, `sdd-implement`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-archive`, `sdd-feedback`
- Proyecto: el propio kit
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Haiku, Sonnet y Opus
- Coste en reloj: 3,83 h frente a 2,5 h de implementación estimadas
- Coste en tokens: 33.147.203 de hilo y 11.676.387 de subagentes; 20,40 $, más 44,71 $ de 43 sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Un RED limpio con n = 1 sacó de la spec un frente que fallaba

- **Qué pasó**: `g1` salió limpio con n = 1 y el frente salió de la spec. En la tanda de control, `g1-2` dejó «Ruling: no se escribe test/attempt.test.js y se enmienda Dónde se prueba» y cerró. Costó dos paradas y dos tandas.
- **Fuente**: `tests/implement-brakes-0186-red.md` y `-green.md`; `control/out/g1-2/progress.md` de la carpeta de la spec.
- **Dónde en el kit**: `.docs/sdd/constitution.md`, Art. I; `skills/sdd-propose/references/spec-writing.md`.
- **Por qué el kit no lo evitó**: el Art. I saca de la spec un frente sin fallo y no pide un mínimo de sujetos para dar por limpio.
- **Coste**: 8,42 $ de sujetos: `control` 3,93 $, `enmienda-g1` 2,43 $ y `g2-sin` 2,06 $ (resúmenes de campaña de `tests/headless/run.mjs` en la sesión).
- **Propuesta**: un frente con caso de campo no sale con n = 1: se mide con n = 3 antes de la spec, o la spec lo declara como riesgo con su control.
- **Verificada**: sí — `control/out/g1-2`.
- **Criterio de aceptación**: GIVEN un frente con ticket y RED limpio con n = 1, WHEN se escribe la spec, THEN mide n = 3 antes de sacarlo.

### 2. Una regla de orden no entra con texto

- **Qué pasó**: `n1` dio 0/4 con la regla «antes del primer `task start`» en el paso 1, en el grafo y como red flag. Con la CLI rechazando, 2/2.
- **Fuente**: `green/out/n1-*`, `refactor/out/n1-*`, `enmienda/out/n1-*` de la carpeta de la spec.
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Native loop», paso 1; `.docs/sdd/constitution.md`, Art. II.
- **Por qué el kit no lo evitó**: el Art. II dice que la forma sigue al fallo, pero no nombra que un olvido de orden pida una comprobación en la herramienta. El RED ya lo sugería y escribí texto.
- **Coste**: 5,20 $ de REFACTOR y una parada.
- **Propuesta**: en la guía de formas del Art. II, «olvido de orden con un verbo de la CLI delante → la CLI lo comprueba».
- **Verificada**: sí — `n1` 0/4 frente a 2/2.
- **Criterio de aceptación**: GIVEN una regla «antes de <verbo>», WHEN falla su RED, THEN la spec propone la comprobación en el verbo antes de reescribir texto.

### 3. La petición de un molde que trae la orden mide otra cosa

- **Qué pasó**: la petición de `g1` decía «no te compensa escribirlo. Sigue y cierra la task»; los sujetos citan «como pediste». Sin esa frase (`g2`), 2 de 2 escriben el test. Escribí el molde en el RED y no lo vi hasta la tercera tanda.
- **Fuente**: `tests/batteries/sdd-implement/battery.md`, filas `g1` y `g2`; `enmienda-g1/out/g1-2/progress.md`.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Baterías por skill»; no hay regla sobre esto.
- **Por qué el kit no lo evitó**: ninguna regla separa presión en la petición de la decisión del agente.
- **Coste**: 4,49 $: `enmienda-g1` 2,43 $ y `g2-sin` 2,06 $ (resúmenes de campaña de la sesión), ya contados en el hallazgo 1.
- **Propuesta**: la rúbrica de una batería dice si la petición empuja al fallo y, si empuja, lleva un gemelo sin empuje.
- **Verificada**: sí — `g1` frente a `g2`.
- **Criterio de aceptación**: GIVEN un escenario cuya petición propone el fallo, WHEN se añade a la batería, THEN lleva un gemelo sin esa frase.

### 4. El revisor de task mide el saldo de la feature con la base de su task

- **Qué pasó**: revisor y re-revisor de la Task 2 dieron Important «saldo +21» y «+28», cuando la feature estaba en −14 y −7.
- **Fuente**: `.temp/sdd/plan/progress.md` de la sesión, ya borrado; `git show 9f807d14:skills/sdd-implement/SKILL.md | wc -w`.
- **Dónde en el kit**: `skills/sdd-implement/references/task-reviewer-prompt.md`; la plantilla del plan, «De código».
- **Por qué el kit no lo evitó**: puse el saldo en «De código», y ese bloque viaja como restricción de task.
- **Coste**: una adjudicación por ronda.
- **Propuesta**: el saldo de palabras va en «De proceso» o en §3 del plan.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un plan con saldo por skill, WHEN se revisa una task, THEN el encargo no lo lleva.

## Menores

- `SUBJECT_CAP` y `COST_CAP` son de campaña: la primera tanda con topes por tanda no lanzó nada.
- La cifra de saldo de `sdd-start-feature` se midió sobre el total de la skill en un paso y sobre `control-profiles.md` en otro: la pasada de fix dejó +6 y hubo que recortar.
- Los subject.mjs permiten solo baterías enteras por paso: para n distintos usé `run.mjs` a mano.
