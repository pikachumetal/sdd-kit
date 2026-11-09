---
kit_version: 2.3.4
lane: patch
id: 20261109-141454-patch-0324-debt-keeps-only-live
task: 0324
mode:
date: 2026-11-09
---

# Ticket para el kit — patch 0324: la deuda guarda solo lo vivo

## Contexto

- Carril y modo: patch (petición cerrada), perfil `delegate`, `validation.mode: field`
- Skills del kit usadas: `using-sdd`, `sdd-propose`, `sdd-implement` (`patch-flow.md`), `sdd-agent-writing`, `sdd-tdd`, `sdd-archive`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio repo del kit (skills en Markdown y CLI en TypeScript con Vitest)
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet 5.5 (`effort-medium`), el revisor del patch; los sujetos de la campaña, Sonnet
- Coste en reloj: 0,32 h frente a 2,07 h estimadas (2 h más 0,07 h del gate de cierre)
- Coste en tokens: 23.682.824 del hilo más 706.783 del revisor; 8,96 $, más 1,77 $ en 6 sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La búsqueda de lo retirado en un patch no abarca todo el repo, y se escapó una mención en `.docs/workflow/`

- **Qué pasó**: el patch retira la sección «Descartadas» de `debt.md`. Busqué sus usos con `git grep` limitado a `skills/` y `cli/src/`, y lo dejé así en `patch.md` §3. El revisor encontró un Important: `.docs/workflow/usage-guide.md:193` seguía diciendo que lo caducado «pasa a «Descartadas»». Los moldes de deuda de cuatro baterías también llevaban la sección; los encontró el GREEN de `m3`, cuyo sujeto la marcó como forma heredada.
- **Fuente**: el commit `d96f6d08` (el fix con el arreglo del Important y los moldes) y `patch.md` §4 de `.docs/sdd/specs/20261109-134853-patch-0324-debt-keeps-only-live/` (respuesta al revisor); `.docs/sdd/specs/20261109-134853-patch-0324-debt-keeps-only-live/green/out/m3-1.texts.txt` («`debt.md` tiene una sección «Descartadas» que no está en la plantilla»).
- **Dónde en el kit**: `skills/sdd-implement/references/patch-flow.md` paso 4 («In a removal, search each removed symbol (handler, key, text) and leave in §4 that it has no other uses»), frente a `skills/sdd-propose/references/coherence-pass.md` «What is retired or changes form», que en una spec pide `git grep` en todo el repo, fuera de las carpetas de evidencia.
- **Por qué el kit no lo evitó**: el paso 4 de `patch-flow.md` no dice dónde se busca, y elegí el alcance yo. La regla completa existe, pero solo para la spec (`coherence-pass.md`), y un patch no pasa por ella.
- **Coste**: un Important en la revisión y una ronda de arreglo antes del commit del fix, unos 10 min; además, un gate de 118 s corrió sobre el árbol anterior a ese arreglo y hubo que repetirlo en el cierre (141 s). La causa del gate repetido la respalda `patch.md` §4.
- **Propuesta**: en el paso 4 de `patch-flow.md`, sustituir «search each removed symbol» por «search each removed symbol with `git grep` in the whole repo, outside the evidence folders», sin añadir otra frase.
- **Verificada**: sí — contrastado con `skills/sdd-implement/references/patch-flow.md:16` y `skills/sdd-propose/references/coherence-pass.md:7`.
- **Criterio de aceptación**: GIVEN un patch de retirada cuyo literal aparece en `.docs/workflow/usage-guide.md` y en un molde de `tests/batteries/` WHEN el sujeto llega al paso 4 de `patch-flow.md` THEN `patch.md` §4 nombra las dos rutas, o las cambia, antes del revisor.

## Lo que hice por iniciativa propia

- `sdd-end-release` no tiene batería. El humo lo armé copiando el `subject.mjs` del frente `b` de la feature 0177, que ya medía la caducidad, con `debt.md` en la forma nueva para RED y GREEN. Dio RED ❌ y GREEN ✅ con un sujeto en cada uno, por 0,42 $ en total (0,23 $ y 0,19 $, según los totales por fase que imprime `run.mjs`) (`tests/debt-keeps-only-live-0324.md`). Funcionó: reutilizar el molde de otra campaña ahorra escribir uno.
- En los moldes de deuda de las baterías `sdd-roadmap`, `sdd-debugging`, `sdd-archive` y `sdd-retro` quité la sección vacía, y en el de `sdd-retro`, la columna. Así siguen en la forma de la plantilla y no siembran un fallo de forma heredada en otros escenarios.

## Funcionó, no tocar

- `battery.mjs plan` con `N=1` dio la previsión por escenario: 0,16 $ para `m3` y 0,57 $ para `v1`. Lo gastado en `m3`, RED y GREEN, fue 0,40 $, y la campaña entera, 1,77 $, dentro de la Suma de 3,13 $.
- `sdd capability merge` fusionó ocho requisitos y dos entradas de «Reglas de la capacidad» en cinco capacidades, sin tocar nada a mano.
- El revisor único de Sonnet del patch encontró el Important del hallazgo 1 en 2 min.

## Menores

- `run.mjs` avisa «sin previsión legible en `<SPEC_DIR>/spec.md`» en un patch, cuya previsión vive en `patch.md` §4; el techo cayó en `SUBJECT_CAP` — `tests/headless/campaign.mjs` (`readConfig`)
