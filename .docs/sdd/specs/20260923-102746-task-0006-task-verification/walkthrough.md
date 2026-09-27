---
id: 20260923-152000-task-0006-task-verification
task: 0006
title: Walkthrough — Verificación por task: qué se ejecuta y qué cuesta
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-23
---

# Walkthrough — Verificación por task: qué se ejecuta y qué cuesta

## 1. Cambios realizados

- **RED del paso 6** (`75074db`): molde `red/f6`/`red/f6b` + `red/subject6.sh`, 4 sujetos headless (2×E2, 2×E3) contra el kit de `develop` sin tocar. Veredicto en `tests/task-verification-red.md`.
- **Plantilla del plan** (`00ce715`): `skills/sdd-templates/templates/plan-template.md` y `tasks-template.md` ganan los campos `Superficies`, `Verificación`, `Verificación visual`, `Verificación lenta` por task; el gate completo se saca del bloque «De código» (que viaja a cada implementador) y pasa a §3, una vez.
- **Paso 6, encargo y override** (`ec584a8`): `skills/sdd-start-task/references/encargo-revision.md` gana la sección `## Verificación` en el encargo del implementador; `overrides-superpowers.md` documenta que sustituye el «run the full suite once before committing» de `implementer-prompt.md`; `SKILL.md` (paso 6) dice quién lanza la verificación lenta (el hilo, en segundo plano, mientras revisa) y quién mira la UI (el hilo, en navegador real, o «no probado» en `tasks.md` sin navegador), con red flags y racionalizaciones nuevas.
- **GREEN** (`ef86615`): 6 sujetos headless (2×E1, 2×E2, 2×E3) contra el kit con las Tasks 2 y 3 ya aplicadas. Veredicto en `tests/task-verification-green.md`.
- **Fix de la revisión final** (`2e6c8f8`): `tasks-template.md` se había editado en la Task 2 sin su propio ancla RED→GREEN (Art. I); añadido `Describe 'Plantilla de tasks'` a `tests/TaskVerification.Tests.ps1`, con el rojo retroactivo documentado en `tasks.md`.
- Registro vivo completo, con commit hash por task, en [`tasks.md`](tasks.md).

## 2. Tiempo y coste: estimado vs real

- Tipo: docs (skills del kit)
- Estimación de implementación (del plan): 3h
- Esfuerzo real: ≈2h de reloj del hilo (commits entre 14:03 y 15:16, más las esperas de las dos campañas de sujetos) — aproximado: la sesión cruzó un cambio de entorno a mitad (otra task en otro worktree se coló y volvió) que no permite un reloj exacto de inicio.
- Desviación: −1h (−33%)
- Causa de la desviación: el «buena noticia» que el plan preveía en su tabla de riesgos se cumplió en parte — el frente «el encargo no lleva `:test` ni `backend:test`» ya pasaba 2/2 sin cambios, así que la Task 3 no tuvo que escribir guidance para él, y las Tasks 2–3 (en línea, prosa) fueron más rápidas que las dos campañas de sujetos.
- Modelo del hilo: Sonnet 5
- Tokens del hilo: no medido
- Tokens de subagentes: 201233 en 2 despachos — revisor final Sonnet 136581 tokens / ~5,6 min; re-revisor (fix wave) Sonnet 64652 tokens / ~1,1 min
- Coste de sujetos: ≈20,93 $ en 9 sujetos capturados (10 lanzados) — RED: e2-2 1,82 $, e3-1 1,65 $, e3-2 3,42 $ (e2-1 sin coste capturado, el sujeto se cortó a mitad y no llegó a escribir su `result.json`); GREEN: g-e1-1 1,06 $, g-e1-2 0,63 $, g-e2-1 3,51 $, g-e2-2 4,89 $, g-e3-1 2,52 $, g-e3-2 1,42 $. Pasa el techo de 18 $ aprobado por el dev-lead para la campaña (avisado antes de lanzar el GREEN; el dev-lead dijo que siguiera).
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La Task 1 (RED) tuvo un sujeto adicional inconcluso: `e2-2` se bloqueó en el pre-flight scan por un permiso `Write` denegado sobre la ruta POSIX que imprime `sdd-workspace` en modo headless (sin usuario que apruebe). No cuenta para el veredicto RED (nunca llegó a despachar). Anotado como candidato a fila de roadmap propia, no como recorte de esta task.
- El sujeto `e2-1` del RED se cortó a mitad de sesión (sin nodo `result` en su stream) por el cruce de entorno de esta misma conversación con otra task en otro worktree. Se recuperó capturando manualmente su estado final (`git log`/`git status`) tras confirmar que ya había pasado por las medidas relevantes antes del corte.

### Decisiones tomadas sin el dev-lead

- **No relanzar el frente «el hilo lanza la verificación lenta en segundo plano» con dos sujetos nuevos**, pese a cerrar solo 1/2 en el GREEN — es variabilidad de adherencia a una instrucción de varios pasos en un turno largo (el mismo párrafo de `SKILL.md` funcionó en el sujeto que acertó, `g-e2-2`), no un vacío de texto; relanzar no lo habría corregido y la campaña ya había pasado el techo aprobado. Coste si está mal: el frente sigue con adherencia parcial y una task real podría cerrarse sin haber lanzado su verificación lenta — mitigado con la fila de deuda en `roadmap.md`.
- **Aceptar `e2-1` (RED) como dato válido pese al corte**: sus dos medidas relevantes (el encargo no prohíbe `backend:test`; el hilo nunca lo lanza) ya habían ocurrido antes del punto de corte, verificado por `shim.log` y el `jsonl`. Coste si está mal: una medida RED contaminada por una interrupción externa a la conducta medida — mitigado citando file:line/hora exacta de cada evidencia en `tests/task-verification-red.md`.
- **Fix del Important de la revisión final en el mismo hilo, no vía subagente**: la Task 2/3/4 de esta task ya se ejecutaron en línea (decisión 2 del plan); despachar un subagente para un ancla de una línea habría sido más caro que el propio fix. Coste si está mal: ninguno detectado — la re-revisión acotada confirmó "all findings addressed".

## 4. Verificación

### 4.1 Builds

- `Invoke-Pester ./tests` tras cada commit (vía pre-commit del repo): 358 → 361 → 362 passed, 0 failed, en las sucesivas tasks.
- `Invoke-Pester ./tests` final, tras el fix de la revisión final: **362 passed, 0 failed, 6 skipped**.

### 4.2 Smoke / tests

Validación diferida: 2026-09-23 · «ya sabes lo de siempre, prueba en el uso, si esta acabado merge, push feedback y dime cuando cierro el worktree» · disparador: el próximo uso real del paso 6 de `sdd-start-task` (una task o patch que despache implementadores con los campos `Superficies`/`Verificación` ya en su plan).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED del paso 6 (4 sujetos, kit sin tocar) | 1 frente ya pasaba 2/2 (recortado de la Task 3); 3 fallaban — ver `tests/task-verification-red.md` |
| 2 | `Invoke-Pester tests/TaskVerification.Tests.ps1` en rojo antes de editar `plan-template.md` | 5 fallos, cada uno por su aserción |
| 3 | `Invoke-Pester tests/TaskVerification.Tests.ps1` en verde tras editar `plan-template.md`/`tasks-template.md` | 5/5 |
| 4 | `Invoke-Pester tests/TaskVerification.Tests.ps1` (bloque «Despacho») en rojo antes de editar `SKILL.md`/`encargo-revision.md`/`overrides-superpowers.md` | 3 fallos |
| 5 | `Invoke-Pester tests/TaskVerification.Tests.ps1` + `tests/Skills.Tests.ps1` en verde tras editar | 123/123 |
| 6 | GREEN del paso 6 (6 sujetos, kit con Tasks 2–3 aplicadas) | 3 de 4 frentes 2/2; 1 de 4, 1/2 (ver §3) — `tests/task-verification-green.md` |
| 7 | Revisión final de rama (Sonnet, diff sin `red/`/`green/`) | 1 Important (`tasks-template.md` sin ancla propia) — corregido |
| 8 | Re-revisión acotada del fix | All findings addressed |
| 9 | Gate de cierre, `Invoke-Pester ./tests` | 362/0 |

### 4.3 Residuales / deuda generada

- **La verificación lenta no siempre la lanza el hilo principal** (Medio) — fila nueva en `roadmap.md`, tabla de deuda técnica.
- **`e2-2` bloqueado en pre-flight por un permiso `Write` denegado sobre ruta POSIX en modo headless** — candidato a fila de roadmap propia, señalado en `tests/task-verification-red.md`; no se abre fila ahora porque solo hay un caso y el propio ledger de la task ya lo documenta con su evidencia (`out6/e2-2.state.txt`, `out6/e2-2/result.json`).

## 5. Aprendizajes

- Los cuatro escenarios ADDED del delta de la spec → fusionados en [`capabilities/task-flow.md`](../../../capabilities/task-flow.md) (Cada task del plan verifica solo sus superficies · El gate de cierre se ejecuta una vez · Una task que cambia la UI se mira en un navegador · Una verificación de más de 10 minutos la lanza el hilo principal en segundo plano), con su fila en «Historial».
- Las tres piezas de la guía nueva (plantilla, encargo, paso 6) → ya volcadas directamente en `skills/sdd-templates/templates/plan-template.md`, `skills/sdd-start-task/references/encargo-revision.md`, `references/overrides-superpowers.md` y `SKILL.md` — son el propio entregable de la task, no un aprendizaje aparte que reubicar.
- «Un texto de guía correcto no garantiza adherencia 2/2 en un turno largo» → `roadmap.md`, tabla de deuda técnica (fila «La verificación lenta no siempre la lanza el hilo principal»).
- `.claude/skills/` de este proyecto: no existe — revisado mirando, no por omisión (paso 5 del cierre). No aplica.

## 6. Adendas

- _Ninguna._
