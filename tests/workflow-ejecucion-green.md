# Evidencia GREEN — política de ejecución y modelos (2026-09-08)

Mismos escenarios que [`workflow-ejecucion-red.md`](workflow-ejecucion-red.md), con la guidance escrita en el commit `0bbb74f` (+ `96dc2a7`): `sdd-start-task` con `subagent-driven-development` como default y traspaso obligatorio de las "Restricciones globales"; `plan-template` con campos `Modelo` (modelo + effort) y `Ejecución`; `sdd-end-task` con code-review condicionado al camino en línea. Sonnet, fixture "Cobra" (variante con la restricción JSDoc **no inferible del código**), estado verificado en disco. Run `wf_636f8f91-b04`, 12 agentes.

## Veredicto por fallo del RED

### F3 — El cierre no pedía code-review → **REPARADO (1/1)**

`t-et` (skill editada) invocó `superpowers:requesting-code-review` y después `finishing-a-development-branch`; `c-et` (control `426aa45`) no invocó review. El ticket estaba implementado **en línea** (copia de `r1a`), que es exactamente la condición del paso nuevo. El resto del Definition of Done es idéntico en los dos brazos: walkthrough, tres filas en `estimation-log.md`, sin merge a `develop`.

### F4 — El ejecutor no recibía las Restricciones globales → **REPARADO en lo medible (2/2)**

| | RED (`r4b`, `r4c`) | GREEN (`g1a`, `g1b`) |
| --- | --- | --- |
| Bloques JSDoc en funciones nuevas | **0 / 0** | **3 / 3** |
| Ficheros de test nuevos | 0 / 0 | 0 / 0 |
| Tests | 7–8 en verde | 11 / 13 en verde |

`g1b` lo declara: *"las «Restricciones globales» del plan aplicadas a cada una (JSDoc en castellano, céntimos como entero, todos los tests en `tests/invoice.test.js`, sin dependencias nuevas)"*. La guidance del paso 6 las convirtió en algo que el ejecutor busca, no en un párrafo que ignora.

**Matiz que impide el ✅ completo**: en el RED el ejecutor estaba **aislado** (solo veía su task). En el GREEN los sujetos vieron el plan entero porque no llegaron a despachar (ver F1). Lo medido es "el orquestador lee y aplica las restricciones"; el traspaso al subagente aislado queda sin medir aquí.

### F1 — Nadie delegaba → **NO MEDIBLE con este método**

Los dos sujetos leyeron el default nuevo, intentaron aplicarlo y se toparon con el harness: *"este entorno de subagente no expone ninguna herramienta de despacho de subagentes (lo he comprobado por ToolSearch, sin resultados)"* (`g1a`). Ambos documentaron la desviación en `tasks.md` —`g1a`: *"el plan no declara ejecución en línea para ninguna task, por lo que el default del kit (`subagent-driven-development`) aplica. Este entorno de trabajo no expone una herramienta de despacho…"*— y ejecutaron en línea conservando la disciplina.

Lo que sí demuestra: **la skill gobierna la intención** — 2/2 entendieron que el default es delegar y trataron la ejecución en línea como excepción a justificar. Es la inversión simétrica del F1 del RED, donde 2/2 obedecían el default anterior.

### F2 — El modelo no se elegía → **NO MEDIBLE con este método**

Sin despacho no hay modelo ni effort que declarar. Ninguno de los dos runs menciona modelo (`grep` sobre el informe: 0 coincidencias). No es fallo de la guidance: es consecuencia de F1.

## Limitación de método (a `roadmap.md` T9)

**Un subagente de workflow no puede despachar subagentes.** Cualquier guidance cuyo efecto sea *despachar* —default de ejecución, modelo y effort del despacho, traspaso al ejecutor aislado— no se puede validar con sujetos-subagente. Se suma a la limitación ya registrada en T9 ("no sabemos montar un entorno sin una skill").

**GREEN real de F1, F2 y F4: dogfooding.** La siguiente task del kit se ejecuta con el default nuevo, desde la sesión principal, con el dev-lead como testigo: cuenta como evidencia por el Art. VII, y tiene lo que ningún subagente puede dar — un humano que ve el despacho y el modelo declarado en el `plan.md`. Hasta entonces, F1, F2 y F4-traspaso quedan en **"escrito, no verificado"**, y así se registra en el roadmap.

## No-regresión

Los A/B de las dos skills editadas están en [`sdd-start-task-ab.md`](sdd-start-task-ab.md) §T3 y [`sdd-end-task-ab.md`](sdd-end-task-ab.md) §T3: 4/4 y 1/1 escenarios sin degradación.

## Recorte confirmado

El TDD siguió ocurriendo sin nombrarlo: `g1a` invocó `superpowers:test-driven-development` por su cuenta, `g1b` hizo RED→GREEN en las tres tasks. La decisión del RED de **no escribir** esa guidance se sostiene.
