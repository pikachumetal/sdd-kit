---
id: 20261009-153540-feature-0161-explore-launch-prompt
feature: 0161
title: Walkthrough — explore, el paso por el roadmap y el prompt de arranque
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-10
---

# Walkthrough — explore, el paso por el roadmap y el prompt de arranque

## 1. Cambios realizados

- **Baterías y RED** (`351f2d94`): nacen `tests/batteries/sdd-explore/` (e1-e3) y `tests/batteries/sdd-roadmap/` (m1, m2), y `sdd-propose` gana a5 como control. La guarda del `subject.sh` de `sdd-propose` mira si la skill existe en el kit que se prueba, en vez de la fase. Evidencia: `tests/sdd-explore-0161-red.md`.
- **Renombrado** (`3102c669`): `skills/sdd-consult/` pasa a `skills/sdd-explore/`, en inglés y regla a regla según la tabla «Reglas que se mueven» de la spec. Cambia el nombre en `using-sdd`, `sdd-propose`, `sdd-grilling`, `sdd-templates`, `overrides-superpowers.md`, el README, `plugin.json`, `mission.md`, `architecture.md`, siete Pester y cuatro baterías.
- **Plantilla y salida de explore** (`aeb28d7f`): `skills/sdd-templates/templates/launch-prompt-template.md`, con su fila en el índice, su ejemplo de la 0144 y cuatro reglas de redacción para agentes. El paso 5 de `sdd-explore` manda una feature, un patch o un spike a `sdd-roadmap`, y da el prompt de un config. La regla 4 de `CLAUDE.md` apunta a la plantilla, y el glosario de `mission.md` gana «Prompt de arranque». Nuevo `tests/LaunchPrompt.Tests.ps1`.
- **`sdd-roadmap`** (`ca23e4c9`): la entrada «Dar el prompt de una fila», el prompt de la primera fila en el cierre con «arráncalo», y el patch pendiente como fila de «Próximo» con «Patch:». `using-sdd` nombra «dame el prompt de la <id>».
- **c2 y `using-sdd` entera** (`edf482a9`): el escenario c2 de `sdd-rubber-duck` (pendiente de la 0146) y r6 en `using-sdd`.
- **Revisión final y su pasada de fix** (`afb312aa`): el carril va también en la primera línea del prompt, la plantilla dice de dónde salen carril, base y «al fusionar», y doce menores. Destapó además un fallo de la 0160: las `description` de `sdd-start-feature` y `sdd-start-patch` llevaban «: » sin comillas, el frontmatter no parseaba y las dos skills cargaban sin metadatos.
- **Task 6, desvío aprobado** (`659fa8dd` y la pasada de su re-revisión, juntada en el cierre): el carril config de `sdd-propose`, en la `feature/*` que abrió su prompt de arranque, se fusiona al terminar según la tabla de gates. Nace la batería de humo de `sdd-end-patch` (x1, control).
- **Fuera por el RED** (enmienda del 2026-10-10): el dimensionado de cada fila en `sdd-roadmap` y la regla de decisiones del prompt en `sdd-propose`. El dimensionado queda como fila de deuda «Esperar 2.º ticket».

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 7h
- Esfuerzo real: 2,7h de implementación (de la apertura, 13:39, al cierre, ~16:20, por las marcas de los commits), más ~2h de spec, entrevista y plan repartidas entre el 2026-10-09 y el 2026-10-10
- Desviación: -4,3h (-61 %)
- Causa de la desviación: los sujetos fueron más rápidos y baratos de lo previsto (~0,18 $ de media frente a 0,8 $), los RED de todas las tasks corrieron en una sola tanda y Native no revisa task a task; la estimación copió la de la 0160, que tuvo tres rondas de REFACTOR
- Modelo del hilo: Opus 5.5, effort no registrado (spec, plan y ejecución en Native, en la misma sesión)
- Tokens del hilo: 94.403.842 — claude-opus-5-5 94.403.842 (la sesión empezó en la rama; incluye spec, entrevista y plan)
- Tokens de subagentes: 4.858.392 en 2 despachos — Revisor final de la 0161 claude-opus-5-5 3.756.335 / 7 min; Re-revisión del tramo de la 0161 claude-opus-5-5 1.102.057 / 3 min
- Coste de la sesión: 32,99 $ (hilo 29,44 $ + subagentes 3,55 $)
- Coste de sujetos: 16,30 $ en 92 sujetos sonnet — RED 2,92 $ (14); GREEN Task 2 1,09 $ (9); Task 3 0,58 $ (6); Task 4 1,29 $ (6); A/B de m3 1,07 $ (6); Task 5 5,92 $ (32); controles de la pasada de fix ~0,5 $ (3); Task 6 4,04 $ (19); control de la re-revisión ~0,3 $ (1) (aprox.; `tests/sdd-explore-0161-green.md`)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- **Dos reglas salen por el RED**, con la aprobación del dev-lead («Sácalas», 2026-10-10): el dimensionado de cada fila (m2 y m3, 0 de 4 filas grandes) y las decisiones del prompt en `sdd-propose` (a5, 2 de 2 limpios). La Task 5 se queda en c2 y la batería de `using-sdd`.
- **e2 se rehízo antes de puntuarlo**: «si se puede, lo quiero» entra con razón por `sdd-propose` (carril config). Pasa a una pregunta que pide el prompt.
- **m3 se añadió y se retiró**: entró para medir el dimensionado, y su enrutado varía sin cambio del kit (A/B: 2 de 6 por `sdd-roadmap`, 4 de 6 por `sdd-propose`).
- **Task 6 (desvío aprobado en la revisión final, «Arreglarlos en la 0161»)**: el merge del config entra (k5 RED 0/2 → GREEN 2/2); el cierre de la fila «Patch:» sale por el RED (x1 limpio 2/2, de dos formas) y queda para la 0149 («Sin regla, para la 0149»).
- **Los moldes no se copian**: las baterías de `sdd-explore` y `sdd-roadmap` usan `tests/batteries/using-sdd/mold-salas` por ruta, como ya hace `sdd-rubber-duck`, en vez de copiarlo (decisión 5 del plan).

### Decisiones tomadas sin el dev-lead

- `CapabilityRules.Tests.ps1` busca el paso traducido de `sdd-explore` (`Context`, `purpose`), no el castellano — la traducción cambia el título del paso — un test que ya no mira el paso de contexto.
- La fila u1 de la batería de `sdd-grilling` esperaba `sdd-start-feature`, que dejó de ser puerta en la 0160: pasa a `sdd-explore` — «pensemos bien…» es pensar — si el dev-lead quería que fuera trabajo, la fila mide otra cosa.
- El delta de la spec cambia de forma para fusionar: los dos MODIFIED que renombraban su requisito pasan a REMOVED + ADDED, y el título de «dame el prompt» pierde el hueco del id — `sdd capability merge` no admite renombrar — ninguno: mismo comportamiento.
- El Review Focus del plan cambia la línea del dimensionado por la de un spike que sale de explore — su regla salió por el RED — ninguno.
- Las `description` de `sdd-start-feature` y `sdd-start-patch` (de la 0160) se reescriben sin «: » — el gate de cierre las daba en rojo — medido con el tramo `sdd-propose` de `using-sdd`, 10/10.
- El paso 5 del carril config fusiona solo una `feature/*` cuyo único commit sobre `merge.into` es el del config — re-revisión, Important 3 — una feature a medias no se fusiona por un config.

## 4. Verificación

### 4.1 Builds

- Suite completa: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → Pester 1.041/1.041, Vitest 722 + 157 + 887 · 413 s (sobre `a12eb77b`; el primer intento, con sujetos corriendo en paralelo, dio `FastSuiteBudget` 30,2 s sobre 30 y destapó el YAML de las dos `description`)
- `claude plugin validate --strict skills` y `claude plugin validate .claude-plugin/plugin.json`: en verde tras la pasada de fix

### 4.2 Smoke / tests

- Validación en campo: 2026-10-10 · suite 1.041/1.041 + 1.766 Vitest · GREEN e2, e3, m1, m2, k5 2/2 y `using-sdd` 21/21 · revisión final opus «con arreglos» sobre 35bd18f1 y re-revisión del tramo sobre 659fa8dd, con sus pasadas de fix

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `routing` · una pregunta entra por `sdd-kit:sdd-explore` | ejecución real: `using-sdd` c1 1/1, `sdd-explore` e1 2/2 | ✅ |
| `routing` · `using-sdd` nombra `sdd-explore` entre las puertas | suite: `UsingSdd.Tests.ps1` | ✅ |
| `routing` · «Explícame cómo viaja…» entra por el pato; «¿Cómo funciona la exportación?» y «¿cómo está montado…?» por explore | ejecución real: `sdd-rubber-duck` c1 1/1 y c2 1/1 (l1 sin cambio) | ✅ |
| `routing` · «¿se puede filtrar `libres` por planta?», sin evidencia, entra por `sdd-explore` | ejecución real: e3 2/2 entra por `sdd-explore` | ✅ |
| `routing` · el trabajo que sale de explore invoca `sdd-roadmap` con lo hablado, sin rama, fila ni `sdd-propose` | ejecución real: e3 2/2 | ✅ |
| `routing` · el patch que sale de explore también pasa por `sdd-roadmap` | no probado: sin escenario; la frase del paso 5 lo nombra junto a la feature | — |
| `routing` · un config da su prompt directo con la forma fija, sin fila ni id, con «arráncalo» | ejecución real: e2 2/2 | ✅ |
| `routing` · con «arráncalo», `sdd-propose` | no probado: segundo turno sin escenario | — |
| `planning` · un patch pendiente es fila de «Próximo» con «Patch:» | no probado: sin escenario (decisión 19 de la spec) | — |
| `planning` · el cierre da el prompt de la primera fila con «arráncalo» | ejecución real: m2 2/2 | ✅ |
| `planning` · «dame el prompt de la 0013» da el prompt con la forma fija sin escribir | ejecución real: m1 2/2 (`git status` limpio); r6 2/2 entra por `sdd-roadmap` | ✅ |
| `planning` · fila cerrada o en marcha → lo dice en vez de dar el prompt | no probado: sin escenario (decisión 19) | — |
| `capabilities` · explore ejecuta `sdd capability index` en su paso de contexto | suite: `CapabilityRules.Tests.ps1` | ✅ |
| `feature-ids` · explore propone sin reservar; el prompt de config va sin id | suite: `TaskIds.Tests.ps1`; ejecución real: e2 sin id | ✅ |
| `interviewing` · invocada desde explore, confirma con una pregunta | ejecución real: g1 2/2, g9-2 | ✅ |
| `routing` · un config en la `feature/*` de su prompt se fusiona en `develop` al terminar | ejecución real: k5 2/2 y control 1/1 (`merge: feature/bump-node-22-18 en develop`) | ✅ |
| `routing` · en una rama con más commits que el del config, o en la de integración, no fusiona | no probado: sin escenario (previsión de la spec) | — |

### 4.3 Residuales / deuda generada

- **Las filas de un reparto crecen al arrancarlas**: fila de deuda «Esperar 2.º ticket» (en el roadmap de esta rama), con la 0131 como primer caso y el RED de la 0161 como medida.
- **El enrutado de «algo que se partiría» varía** entre `sdd-roadmap` y `sdd-propose` sin cambio del kit (m3: 2 de 6 y 4 de 6). Las dos puertas son defendibles. Se anota aquí y en la batería de `sdd-roadmap`, sin fila: no hay un fallo que arreglar.
- **El cierre de un patch trata su fila «Patch:» de dos formas** (marcarla ✅ o quitarla): fila de deuda «Actuar en la 0149».
- **Sincronizar el roadmap con Azure DevOps, GitHub o Jira**: propuesta aparte, pedida por el dev-lead el 2026-10-10. Queda por apuntar con `sdd-roadmap`.

## 5. Aprendizajes

- Una petición «si se puede, lo quiero» sin pedir el prompt entra por `sdd-propose`, y está bien: la salida de explore solo se mide con una pregunta de verdad → `tests/batteries/sdd-explore/battery.md`, intro.
- La guarda de un `subject.sh` mira si la skill existe en el kit que se prueba, no la fase: el RED de una feature posterior a la que creó la skill ya la tiene → `tech-stack.md`, «Baterías por skill».
- Un `description` con «: » sin comillas rompe el frontmatter en silencio: la skill carga sin metadatos y solo `claude plugin validate` lo ve → ya lo vigila `Manifests.Tests.ps1`, que la 0160 no pasó en su gate; sin destino nuevo.
- `sdd capability merge` no admite renombrar un requisito con MODIFIED: hoy se escribe REMOVED + ADDED → fila de deuda existente del marcador RENAMED.

## 6. Adendas
