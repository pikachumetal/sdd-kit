---
id: 20261103-101227-feature-0296-skills-survive-compaction
title: Tasks — sdd-implement partida en una puerta propia y dos copias de superpowers
spec: ./spec.md
plan: ./plan.md
created: 2026-11-05
---

# Tasks — sdd-implement partida en una puerta propia y dos copias de superpowers (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0296-implement-gate-and-copies`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`). Una task cerrada que cambia por una enmienda no se reabre: lleva en «Notas» `afectada por enmienda <fecha> → Task N`, y la Task N nueva hace el trabajo; si la enmienda solo cambia la task en curso, sigue en ella con la nota.

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | `sdd-implement-native`, copia anotada de `executing-plans` | done | eabcfa67 | |
| 2 | `sdd-implement-subagent`, copia anotada de `subagent-driven-development` | done | a86fdd94 | |
| 3 | La puerta `sdd-implement`, propia | done | 2b0c3ad9 | |
| 4 | El freno de la spec y la parada sobre una copia | done | f684b98b | frase del freno de la spec no escrita: su RED salió limpio 3 de 3 |
| 5 | Humos, enrutado y documentos | done | 2f493209 | |

Revisión final: Spec opus+high, con arreglos, 4 sin verificar · Código sonnet+high, con arreglos · Arquitectura no (plan), sobre 2f493209
Pasada de fix: juntada en el cierre, 15 hallazgos (S5 RED→GREEN; los demás, de texto, con las comprobaciones kit:* y los sujetos)
Re-revisión: 2f493209..juntada en el cierre, sdd-kit:effort-high + opus, 15 de 15 addressed; 1 Important nuevo de la pasada (porqué de la unidad 12 recortado en la pasada), arreglado en el hilo: sin revisar

## Verificación por task

- [ ] Task 1 — `pnpm --dir cli exec vitest run test/kit/skills.test.ts test/kit/notices.test.ts test/kit/word-budget.test.ts test/kit/dist.test.ts`
- [ ] Task 2 — los mismos cuatro
- [ ] Task 3 — los cuatro más `test/kit/skills-readers.test.ts`
- [ ] Task 4 — `test/kit/skills.test.ts test/kit/dist.test.ts`
- [ ] Task 5 — `test/kit/skills.test.ts test/kit/workflow-docs.test.ts test/kit/word-budget.test.ts`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| Task 1: docs-claims.test.ts mira las líneas de marca | el test lee skills/ con las marcas, que citan los scripts que sustituyen y no viajan a dist/ | arreglado en la task: salta las líneas de marca con WHOLE_LINE_MARK, como skills.test.ts | (este commit) |

## Rulings

- Pre-flight: Ruling: en la Task 1, `-native` enlaza el decálogo en `../sdd-implement/references/implementer-prompt.md#quality-decalogue`, que existe; la Task 2, al mover el prompt, cambia ese enlace a `../sdd-implement-subagent/implementer-prompt.md` (ya está en sus «Ficheros») — un enlace que no resuelve rompe `skills.test.ts` en la Task 1 — si me equivoco: un enlace que cambiar en la Task 2.
- Task 1: Ruling: el pre-commit rechaza la copia porque cli/test/docs-claims.test.ts («skills and capabilities do not name retired scripts») busca task-start, task-done, sdd-workspace, review-package y PLAN_FILE también en las líneas de marca, que cita lo que sustituyen y el build quita de dist/ — el test salta las líneas enteras de marca con WHOLE_LINE_MARK de build/dist.ts, como ya hace skills.test.ts con superpowers:; acortar las citas sería reescribir para que el checker no lo vea — si me equivoco: un nombre retirado dentro de una marca no lo ve el test, pero no llega al agente. Primer fix descubierto (tasks.md, Fixes adicionales).
- Task 1: minor (deferred): SKILL.md:257-259 usa sustituye con contenido vacío para quitar «(see the per-platform references in ../using-superpowers/references/)»; la forma del repo es quita.
- Task 1: minor (deferred): SKILL.md:238-239 y :269 conservan «They chose inline execution» y «Tell your human partner so when they choose inline», texto de la fuente que no casa con la elección por la línea Ejecución.
- Task 1: minor (deferred): SKILL.md:238-241, «Execute all tasks from the plan without stopping» queda un párrafo antes de la lista cerrada que añade la parada de pair.
- Task 1: minor (deferred): SKILL.md:250, la marca de las paradas lleva 0296 y provenance.md da e7ddf254 a la unidad 5 (texto nuevo: defendible; al walkthrough).
- Task 2: Ruling: references/final-review.md conserva el 31 % porque se sustituyó entero lo de la revisión; solo contradice al kit su primer párrafo (despachar code-reviewer.md en el modelo más capaz, el script review-package), mientras que el segundo (una sola tanda de fix, una re-revisión acotada, adjudicar como en el breaker, sin segunda tanda) dice lo mismo que sdd-verify — se conserva ese párrafo con sustituciones puntuales (verbo, «the four things» por las paradas de SKILL.md, finishing-a-development-branch por sdd-archive), y si así llega al 50 %, final-review.md sigue copia con su Finish (decisión 5, salida principal) y el Finish sale de SKILL.md — si me equivoco: un párrafo de la fuente que repite a sdd-verify en otra skill.
- Task 2: Ruling: SKILL.md de -subagent ocupa 21.274 bytes; las filas 25, 36, 60 y 74 del anexo ponen en las copias dos reglas que son solo del kit y valen para los dos métodos (tasks.md antes de la primera task; comparar la copia RED con el test commiteado), y la decisión 6 de la spec manda que lo solo del kit viva una vez en la puerta — manda la decisión 6: salen de las dos copias y las escribe la Task 3 en «Before each task» de la puerta (hoy siguen en la puerta entera); el squash (unidad 98) se queda en -subagent; nada de quita del digraph — si me equivoco: dos reglas que el anexo ponía en las copias viven en la puerta, a un paso de donde se usan.
- Task 2: minor (deferred): tests/batteries/sdd-implement/compose.mjs:2, el comentario de cabecera dice «el fork de sdd-implement» y la línea 22 lee sdd-implement-subagent.
- Task 2: minor (deferred): #quality-decalogue (sdd-implement-native/SKILL.md y la remisión del prompt) apunta a un título dentro de la valla del encargo, que no es un ancla Markdown; el agente lee el fichero entero.
- Task 2: minor (deferred): implementer-prompt.md, autorrevisión de la fuente «Did I follow TDD if required?» sin el «(sdd-tdd)» que llevaba el kit.
- Task 2: minor (deferred): references/final-review.md, el párrafo de la tanda de fix de la fuente queda junto al bloque de sdd-verify, que también despacha la re-revisión única: que la revisión final mire si se lee como doble despacho.
- Task 2: minor (deferred): references/resuming.md conserva la ruta .superpowers/sdd/progress.md de la fuente (informe del implementador).
- Task 2: minor (deferred): tope de -native en word-budget.test.ts en 3.085 con 2.978 medidas tras la Task 2: se ajusta en la Task 5.
- Ruling: la base movió (0307 fusionada en develop: reescribe sdd-verify y encargo-revision.md, que la Task 2 tocó; la fila 0296 no cambia; upstream.json añade una línea en otra región) — merge de develop en la rama (6ece930f) antes de la Task 3, tomando la versión de develop en los dos ficheros en conflicto y volviendo a aplicar solo las rutas de la Task 2, también en closing-the-review.md:15; la resolución entra en la revisión de la Task 3 (git show --remerge-diff en .temp/sdd/plan/merge-6ece930f-remerge.diff) — si me equivoco: un enlace de sdd-verify a un prompt viejo, que skills.test.ts habría dado en rojo (pasa: 824 tests).
- Ruling: las decisiones 18 y 21 de la spec citan skills/sdd-verify/SKILL.md:308 y :298, y tras la 0307 esas dos reglas viven en skills/sdd-verify/references/closing-the-review.md:27 y :19, con el mismo texto — la decisión no cambia, solo la línea; el walkthrough cita las nuevas — si me equivoco: nada, la regla sigue en sdd-verify.
- Task 3: Ruling: kit:own dio en skills/sdd-implement/ una absoluta con excepción en references/patch-flow.md:11 («presentation only… except») y en «Every commit of yours» («Never… except»); el Step 3 de la Task 3 pide kit:own sin líneas en skills/sdd-implement*/ salvo las repetidas con otra fila, así que reescribirlas es trabajo del plan, no un fix descubierto, aunque el Scope diga patch-flow.md «sin cambios» — se reescriben a «an adjustment of the presentation» y «No commit … other than», con la misma regla — si me equivoco: dos frases que la revisión final compara con su texto anterior.
- Task 3: Ruling: tests/batteries/sdd-propose/battery.md:161 no cita ningún título traducido (habla del paso 4 de sdd-propose): no cambia; la única cita viva que cambia es control-profiles.md:80.
- Task 3: Ruling: la verificación lenta de SDD queda en «Before each task» de la puerta, que es donde se lee al despachar.
- Task 3: Ruling: skills/sdd-verify/SKILL.md:139 («completion contract» de sdd-implement) y tests/batteries/sdd-verify/battery.md:120 (la fila «I'll fix the minors too») citan reglas que ahora viven en sdd-implement-native — es el mismo caso que las rutas de sdd-verify:163 del Scope: la Task 5 las cambia a sdd-implement-native, sin otra edición de esos ficheros — si me equivoco: dos citas a la skill equivocada.
- Task 3: minor (deferred): references/patch-flow.md:11 «an adjustment of the presentation» ya no es la etiqueta literal del árbol de sdd-propose: mirar si sdd-propose cita la vieja.
- Task 3: minor (deferred): «Every commit of yours», «No commit is presented or closed unreviewed other than…» cambia una palabra de sentido frente a «Never… except»; la regla se conserva.
- Task 3: minor (deferred): Method sin «never fabricate a dispatch» — no se perdió: vive en sdd-implement-native/SKILL.md:47.
- Task 4: Ruling: el RED de fr1 sale limpio 3 de 3 con la puerta de la Task 3 (los tres paran con 915 y 300, sin esquivar el freno; tests/sdd-implement-0296-red.md) — por la decisión 10 de la spec y el punto «Entra, si el RED lo exhibe» del Scope, la frase del freno de la spec no se escribe, control-profiles.md:54 y :85 no cambian y el ADDED «Un freno que fija la spec es un freno de alcance» no se fusiona; la fila de deuda del freno queda abierta con esta evidencia: el caso de campo vino de una sesión larga y los sujetos arrancan en limpio — si me equivoco: el freno de la spec se sigue esquivando en sesiones largas, y la fila lo recoge.
- Task 4: Ruling: la frase de cp1 sube SKILL.md de 2606 a 2653 palabras; CLAUDE.md regla 6 manda que el arreglo de un ticket deje el saldo igual o menor — el implementador compensa las 47 en otros pasos de la puerta, sin quitar reglas, antes del GREEN (para que el GREEN mida el texto final) — si me equivoco: un recorte que la revisión de la task ve.
- Task 4: REFACTOR 1 de cp1: falla a medias (1 sujeto, 0,22 $): el ✋ abre con «Copia: 81f5686 — …» con el commit correcto, pero «qué cambió» repite la cita de la marca y no lo que hizo el commit (sacar el encargo del recuadro sangrado), porque no lo leyó. Ruling: segunda tanda de REFACTOR, dentro de la previsión (3,59 $ de 17,5 $; el Art. I para al superarla): el hueco dice de dónde sale «qué cambió» (leído en git show <sha7>); si falla, paro para el dev-lead.
- Task 4: GREEN con el contrato de salida: cp1 2 de 2 (0,44 $; sujetos en total 4,26 $). Ruling: cp1-1 pone la línea Copia: exacta al principio del mensaje y no abriendo el ✋ — el contenido es el del contrato y precede a la parada; cuenta como pasa — si me equivoco: un sitio de la línea que la rúbrica no fija.
- Task 4: minor (deferred): cp1-1 escribe la línea Copia: antes del 🦆, no como primera línea del ✋.
- Task 4: minor (deferred): SKILL.md:16, «Its sdd <verb>» queda sin antecedente claro tras el recorte de «so a patch has no ledger…».
- Task 4: minor (deferred): SKILL.md:60, la frase del caso k3 pierde «in its place in spec.md»; la regla vive en §Desvío de control-profiles.md (lo recupera el enlace de la ronda 1).
- Task 4: minor (deferred): SKILL.md:39, sale el porqué de «with or without a remote» (otro worktree commitea a la rama local); la regla queda.
- Task 4: minor (deferred): GREEN con contrato 2 de 2 con reservas: cp1-1 pone Copia: antes del 🦆, cp1-2 no ejecutó el comando; la rúbrica no fija la posición.
- Task 4: minor (deferred): spec.md:273-274, la previsión de coste sigue contando fr1 x3 RED y x2 GREEN; es previsión, la real va al walkthrough.
- Task 4: minor (deferred): SKILL.md:16, sale «first thing,» de la viñeta Patch (compensa el enlace); «implement nothing from here» cubre el orden.
- Task 5: Ruling: g1 y d1 corren en opus, el modelo de su fila de la batería, y no en sonnet como decía la decisión 15 de la spec («como la batería»): manda la fila — si me equivoco: ~1,5 $ más.
- Task 5: h2 repetido: W 1 de 2 (h2-2 la dice al despachar la Task 1; A, S y L pasan); humos 6,05 $. Ruling: no se toca el texto en esta task — la regla está en el Setup de -subagent; antes estaba también en el Overview de la puerta, y la decisión del anexo (unidad 3) la juntó con su paso — riesgo para el eje Spec de la revisión final y para el ticket — si me equivoco: 1 de cada 2 sesiones SDD no anuncia el workspace.
- Task 5: minor (deferred): h2, fila W 1 de 2 tras juntar el anuncio del workspace en el Setup de las copias.
- Task 5: minor (deferred): skills/sdd-tdd/SKILL.md:77 dice que los RED los escribe «el hilo (sdd-implement)», y las description de sdd-tdd y sdd-worktrees dicen «Use when sdd-implement…»; la regla vive en las copias (al ticket: fuera del alcance de la task).
- Final: Ruling: Important S7 del eje Spec — los recortes de la Task 4 quitan frases que no se mueven a otro sitio, contra «se mueve texto, no se quita»; la regla 6 del CLAUDE.md (saldo de palabras igual o menor en el arreglo de un ticket) obligaba a recortar, y ninguna regla se pierde («in its place» vuelve por el enlace a §Desvío) — se queda; el walkthrough lo lista para que lo confirme el dev-lead — si me equivoco: seis porqués menos en la puerta.
- Final: Ruling: Minor S13 — las ramas del ADDED con marca de tarea y sin commit no tienen escenario; medirlas pide un molde nuevo y no cambia el texto — van al walkthrough como no probadas — si me equivoco: una rama que falla sin que se vea.
- Final: Ruling: Minor S14 — patch-flow.md:11 parafrasea el nodo del árbol de sdd-propose; la regla es la misma y sdd-propose se reescribe en la 0306 — se queda — si me equivoco: una etiqueta que no casa literal.
- Final: Ruling: Minor C5 — steps.rt1 repite dos líneas de steps.u1: dos usos, por debajo de la regla de tres — se queda — si me equivoco: una línea que cambiar en dos sitios.
- Final: Ruling: Minor C6 — sdd-implement-subagent/SKILL.md con 301 bytes de margen: no es un defecto, es un aviso para la próxima edición — al ticket — si me equivoco: el próximo retoque da FALLA y obliga a bajar un bloque a references/.
- Final: Ruling: los «no verificado» del eje Spec — kit:copies, kit:own, kit:upstream y kit:skill-size se corren en la pasada de fix y antes de la validación; o1 (ADR 0014) y la compactación quedan como en la spec (por lectura / sin escenario).
- Final: Ruling: el anuncio «Workspace del plan» en SDD sale 0 de 2 también con el kit de develop (9d03a521, antes de la 0296; 4,42 $): no es regresión de la 0296 — el THEN del MODIFIED «El workspace del plan se anuncia» queda en el walkthrough como no cumplido, con la causa anterior a la feature, y va una fila de deuda con la evidencia (h2 1 de 8 en total, rt1 2 de 5); la frase del Overview (pasada de fix, juntada en el cierre) se queda — si me equivoco: el dev-lead sigue sin ver dónde está el workspace en SDD, como antes.
- Final: Ruling: Minor de la re-revisión — sdd-implement-native/SKILL.md:59 «The plan's Ejecución line chose inline» es inexacto en lite sin plan (lo elige sdd-implement); la línea :46 ya lo dice bien — se queda, tras la re-revisión no hay otra pasada — si me equivoco: una frase inexacta en lite.
- Final: Ruling: Minor de la re-revisión — tests/batteries/sdd-implement/subject.mjs:71-72,80, comentarios y mensaje de formRules que dicen «del kit que se prueba» cuando lee las reglas del repo — se queda; al ticket — si me equivoco: un comentario que engaña al que mida un kit viejo.
- Final: Ruling: observaciones fuera del alcance de la re-revisión (sdd-implement-native:260 «committed» antes del commit, siblingLinks sin anclas ni mayúsculas, compose.mjs:25 con una ruta de respaldo vieja) — al ticket.
