---
id: 20261103-101227-feature-0296-skills-survive-compaction
feature: 0296
title: Walkthrough — sdd-implement partida en una puerta propia y dos copias de superpowers
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-05
---

# Walkthrough — sdd-implement partida en una puerta propia y dos copias de superpowers

## 1. Cambios realizados

- **`sdd-implement-native`** (Task 1, `eabcfa67`): copia anotada de `skills/executing-plans/SKILL.md` de superpowers v7.0.2, 18.227 caracteres en `dist/`. Sus scripts van en `notCopied`. De paso se arregla `cli/test/docs-claims.test.ts`, que ahora salta las líneas de marca con `WHOLE_LINE_MARK`, como ya hacía `skills.test.ts`.
- **`sdd-implement-subagent`** (Task 2, `a86fdd94`): copia anotada de `skills/subagent-driven-development/` v7.0.2, con 11 ficheros. `SKILL.md` ocupa 19.569 caracteres. Los tres prompts salen de `sdd-implement/references/`, y `final-review.md` sigue siendo copia. Las rutas de `sdd-verify` y de `compose.mjs` se actualizan.
- **Merge de `develop`** (`6ece930f`): entra la 0307, que reescribió `sdd-verify`. Se volvieron a aplicar las rutas de la Task 2 en `SKILL.md`, `encargo-revision.md` y `closing-the-review.md`.
- **La puerta `sdd-implement`** (Task 3, `2b0c3ad9`): propia (`own`), pasa de 61.726 a 16.026 caracteres. Se le quitan su `NOTICE`, la entrada `pending: "0296"` de `upstream.json` y los «Example workflows». `frontend-verification.md` y `commit-milestones.md` se traducen al inglés, y cambia la frase de `plan-template.md:30` que nombra `sdd-implement-subagent` tras compactar.
- **La parada sobre una copia** (Task 4, `f684b98b`):
  - nace la viñeta «How you stop», que nombran «Scope brakes» y «Deviation»;
  - en una copia, el ✋ abre con `Copia:` y la salida literal de `git log -1 --format='%h %s'` del commit de la marca;
  - la frase del freno de la spec no se escribe;
  - en la batería entran los escenarios `fr1` y `cp1`.
- **Humos, enrutado y documentos** (Task 5, `2f493209`): entra `rt1` en la batería; se actualizan el README, `CLAUDE.md` (24 skills), `architecture.md`, `greenfield.md`, dos citas de `sdd-verify`, la «Procedencia de las reglas» y los topes de palabras.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 6 h
- Esfuerzo real: 5,50 h — reloj de la sesión 18,13 h desde 2026-11-05T16:06Z, sin 758 min de espera al dev-lead (7 esperas)
- Desviación: −0,5 h (−8 %)
- Causa de la desviación: dentro del ±30 %; la espera de 732 min (21:09Z) fue una noche, con la sesión reiniciada
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (spec, plan y coordinación de las tasks en SDD)
- Tokens del hilo: 172.030.857 — claude-opus-5-5 172.030.857
- Tokens de subagentes: 159.795.001 en 23 despachos — los mayores: Task 4 RED (escenarios y sujetos) claude-sonnet-5-5 43.656.859 / 956 min; Implement Task 2 claude-sonnet-5-5 29.669.677 / 32 min; Final review — Code axis claude-sonnet-5-5 18.058.244 / 13 min; Implement Task 1 claude-sonnet-5-5 14.886.370 / 19 min; Pasada de fix claude-sonnet-5-5 14.439.916 / 41 min
- Coste de la sesión: 108,70 $ (hilo 53,60 $ + subagentes 55,10 $)
- Coste de sujetos: 25,54 $ en 32 sujetos Sonnet y Opus (más 5 de prueba de montaje y una tanda descartada de 3) — RED/GREEN/REFACTOR de `fr1` y `cp1` 4,26 $; humos de la Task 5 6,05 $; tras la pasada de fix 5,99 $; tras el anuncio en la puerta 4,82 $; línea base con el kit de `develop` 4,42 $
- Review de spec: 2 rondas — 1 revisor (siete puntos, Opus) y 2 revisores (dominio Opus, técnica Sonnet) · hallazgos 30, aceptados 27, 2 en parte, 1 rechazado; la enmienda de `cp1`, 2 revisores más (16 hallazgos)

## 3. Desviaciones del plan

- **Enmienda de la spec, aprobada por el dev-lead** («1», 2026-11-05): la parada sobre una copia pasa a garantizar la línea `Copia: <sha7> <asunto del commit>`, en vez de un «qué cambió» libre. Llegó tras un GREEN 0 de 2 y dos tandas de REFACTOR, con la revisión de la enmienda por dos revisores (dominio en Opus, técnica en Sonnet) a petición del dev-lead. La previsión contaba una sola tanda de REFACTOR y hubo dos antes de parar.
- **El ADDED del freno de la spec sale del delta**, aplicando literal la decisión 10: su RED salió limpio 3 de 3.
- **Dos reglas solo del kit pasan de las copias a la puerta** («Before each task»): escribir `tasks.md` antes de la primera task y comparar la copia RED con el test commiteado. Cuatro filas del anexo las ponían en las copias, y manda la decisión 6. La verificación lenta de SDD va también a la puerta.
- **Merge de `develop` a mitad del plan**, antes de la Task 3, porque la 0307 tocaba ficheros de la Task 2.

### Decisiones tomadas sin el dev-lead

- Pre-flight: Ruling: en la Task 1, `-native` enlaza el decálogo en `../sdd-implement/references/implementer-prompt.md#quality-decalogue`, que existe; la Task 2, al mover el prompt, cambia ese enlace a `../sdd-implement-subagent/implementer-prompt.md` (ya está en sus «Ficheros») — un enlace que no resuelve rompe `skills.test.ts` en la Task 1 — si me equivoco: un enlace que cambiar en la Task 2.
- Task 1: Ruling: el pre-commit rechaza la copia porque cli/test/docs-claims.test.ts («skills and capabilities do not name retired scripts») busca task-start, task-done, sdd-workspace, review-package y PLAN_FILE también en las líneas de marca, que cita lo que sustituyen y el build quita de dist/ — el test salta las líneas enteras de marca con WHOLE_LINE_MARK de build/dist.ts, como ya hace skills.test.ts con superpowers:; acortar las citas sería reescribir para que el checker no lo vea — si me equivoco: un nombre retirado dentro de una marca no lo ve el test, pero no llega al agente. Primer fix descubierto (tasks.md, Fixes adicionales).
- Task 2: Ruling: references/final-review.md conserva el 31 % porque se sustituyó entero lo de la revisión; solo contradice al kit su primer párrafo (despachar code-reviewer.md en el modelo más capaz, el script review-package), mientras que el segundo (una sola tanda de fix, una re-revisión acotada, adjudicar como en el breaker, sin segunda tanda) dice lo mismo que sdd-verify — se conserva ese párrafo con sustituciones puntuales (verbo, «the four things» por las paradas de SKILL.md, finishing-a-development-branch por sdd-archive), y si así llega al 50 %, final-review.md sigue copia con su Finish (decisión 5, salida principal) y el Finish sale de SKILL.md — si me equivoco: un párrafo de la fuente que repite a sdd-verify en otra skill.
- Task 2: Ruling: SKILL.md de -subagent ocupa 21.274 bytes; las filas 25, 36, 60 y 74 del anexo ponen en las copias dos reglas que son solo del kit y valen para los dos métodos (tasks.md antes de la primera task; comparar la copia RED con el test commiteado), y la decisión 6 de la spec manda que lo solo del kit viva una vez en la puerta — manda la decisión 6: salen de las dos copias y las escribe la Task 3 en «Before each task» de la puerta (hoy siguen en la puerta entera); el squash (unidad 98) se queda en -subagent; nada de quita del digraph — si me equivoco: dos reglas que el anexo ponía en las copias viven en la puerta, a un paso de donde se usan.
- Ruling: la base movió (0307 fusionada en develop: reescribe sdd-verify y encargo-revision.md, que la Task 2 tocó; la fila 0296 no cambia; upstream.json añade una línea en otra región) — merge de develop en la rama (6ece930f) antes de la Task 3, tomando la versión de develop en los dos ficheros en conflicto y volviendo a aplicar solo las rutas de la Task 2, también en closing-the-review.md:15; la resolución entra en la revisión de la Task 3 (git show --remerge-diff en .temp/sdd/plan/merge-6ece930f-remerge.diff) — si me equivoco: un enlace de sdd-verify a un prompt viejo, que skills.test.ts habría dado en rojo (pasa: 824 tests).
- Ruling: las decisiones 18 y 21 de la spec citan skills/sdd-verify/SKILL.md:308 y :298, y tras la 0307 esas dos reglas viven en skills/sdd-verify/references/closing-the-review.md:27 y :19, con el mismo texto — la decisión no cambia, solo la línea; el walkthrough cita las nuevas — si me equivoco: nada, la regla sigue en sdd-verify.
- Task 3: Ruling: kit:own dio en skills/sdd-implement/ una absoluta con excepción en references/patch-flow.md:11 («presentation only… except») y en «Every commit of yours» («Never… except»); el Step 3 de la Task 3 pide kit:own sin líneas en skills/sdd-implement*/ salvo las repetidas con otra fila, así que reescribirlas es trabajo del plan, no un fix descubierto, aunque el Scope diga patch-flow.md «sin cambios» — se reescriben a «an adjustment of the presentation» y «No commit … other than», con la misma regla — si me equivoco: dos frases que la revisión final compara con su texto anterior.
- Task 3: Ruling: tests/batteries/sdd-propose/battery.md:161 no cita ningún título traducido (habla del paso 4 de sdd-propose): no cambia; la única cita viva que cambia es control-profiles.md:80.
- Task 3: Ruling: la verificación lenta de SDD queda en «Before each task» de la puerta, que es donde se lee al despachar.
- Task 3: Ruling: skills/sdd-verify/SKILL.md:139 («completion contract» de sdd-implement) y tests/batteries/sdd-verify/battery.md:120 (la fila «I'll fix the minors too») citan reglas que ahora viven en sdd-implement-native — es el mismo caso que las rutas de sdd-verify:163 del Scope: la Task 5 las cambia a sdd-implement-native, sin otra edición de esos ficheros — si me equivoco: dos citas a la skill equivocada.
- Task 4: Ruling: el RED de fr1 sale limpio 3 de 3 con la puerta de la Task 3 (los tres paran con 915 y 300, sin esquivar el freno; tests/sdd-implement-0296-red.md) — por la decisión 10 de la spec y el punto «Entra, si el RED lo exhibe» del Scope, la frase del freno de la spec no se escribe, control-profiles.md:54 y :85 no cambian y el ADDED «Un freno que fija la spec es un freno de alcance» no se fusiona; la fila de deuda del freno queda abierta con esta evidencia: el caso de campo vino de una sesión larga y los sujetos arrancan en limpio — si me equivoco: el freno de la spec se sigue esquivando en sesiones largas, y la fila lo recoge.
- Task 4: Ruling: la frase de cp1 sube SKILL.md de 2606 a 2653 palabras; CLAUDE.md regla 6 manda que el arreglo de un ticket deje el saldo igual o menor — el implementador compensa las 47 en otros pasos de la puerta, sin quitar reglas, antes del GREEN (para que el GREEN mida el texto final) — si me equivoco: un recorte que la revisión de la task ve.
- Task 4: REFACTOR 1 de cp1: falla a medias (1 sujeto, 0,22 $): el ✋ abre con «Copia: 81f5686 — …» con el commit correcto, pero «qué cambió» repite la cita de la marca y no lo que hizo el commit (sacar el encargo del recuadro sangrado), porque no lo leyó. Ruling: segunda tanda de REFACTOR, dentro de la previsión (3,59 $ de 17,5 $; el Art. I para al superarla): el hueco dice de dónde sale «qué cambió» (leído en git show <sha7>); si falla, paro para el dev-lead.
- Task 4: GREEN con el contrato de salida: cp1 2 de 2 (0,44 $; sujetos en total 4,26 $). Ruling: cp1-1 pone la línea Copia: exacta al principio del mensaje y no abriendo el ✋ — el contenido es el del contrato y precede a la parada; cuenta como pasa — si me equivoco: un sitio de la línea que la rúbrica no fija.
- Task 5: Ruling: g1 y d1 corren en opus, el modelo de su fila de la batería, y no en sonnet como decía la decisión 15 de la spec («como la batería»): manda la fila — si me equivoco: ~1,5 $ más.
- Task 5: h2 repetido: W 1 de 2 (h2-2 la dice al despachar la Task 1; A, S y L pasan); humos 6,05 $. Ruling: no se toca el texto en esta task — la regla está en el Setup de -subagent; antes estaba también en el Overview de la puerta, y la decisión del anexo (unidad 3) la juntó con su paso — riesgo para el eje Spec de la revisión final y para el ticket — si me equivoco: 1 de cada 2 sesiones SDD no anuncia el workspace.
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

## 4. Verificación

### 4.1 Builds

- Gate: corre una vez en el paso 6 del cierre, sobre el merge con la base (hay otras ramas abiertas: 0305 y 0306); su línea `Gate:` y su sha van en el mensaje final, porque este walkthrough va en el commit de cierre.
- Comprobaciones del kit sobre el último commit de la pasada de fix (juntada en el cierre): `kit:copies` sin líneas de `skills/sdd-implement*/` ni `→ 0296`; `kit:skill-size` sin `FALLA` de `sdd-implement*` (16.185, 18.442 y 19.883 bytes en `dist/`; fase mayor `sdd-implement-native`, 75.010); `kit:own` con solo frases repetidas con skills de otras filas (0311); `kit:upstream` sin rojo de `skills/sdd-implement*/`.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-06 · `kit:copies`, `kit:own`, `kit:upstream` y `kit:skill-size` como en 4.1 · Vitest de `cli/test/kit` y `docs-claims` 1.353/1.353 (con `--testTimeout=60000`) · humos `h1`, `h2`, `g1`, `d1`, `rt1`, `w1`, `o1` y `cp1` con ejecución real (tabla de abajo; fila W de `h2` 1 de 8, igual que la línea base de `develop`) · revisión final Spec y Código sobre `2f493209`, pasada de fix de 15 hallazgos y re-revisión sobre `2f493209` hasta la verificación con sujetos (juntada en el cierre), 15 de 15; `sin revisar: el commit de cierre — restaura «: an unapproved spec isn't a contract» en el Setup de la puerta`

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `feature-flow` · La implementación la lleva `sdd-implement` (Native y SDD) | ejecución real: humos `h1` (invoca `sdd-implement-native`) y `h2` (invoca `sdd-implement-subagent`), `tests/sdd-implement-0296-smoke.md` | pasa |
| `feature-flow` · Ningún texto que carga el agente invoca `superpowers:…` | suite: `skills.test.ts`, la lista del README | pasa |
| `feature-flow` · El workspace del plan se anuncia | ejecución real: `h1` 1/1; `h2` 1 de 8 y `rt1` 2 de 5 en todas las tandas; línea base de `develop` 0 de 2 | no cumplido, con causa anterior a la feature (ver 4.3) |
| `feature-flow` · Ninguna skill intermedia entre propose e implement | ejecución real: `h1`, `h2` | pasa |
| `feature-flow` · El worktree lo prepara `sdd-worktrees` | ejecución real: `w1` 2/2 tras la pasada de fix (antes, `h1-1` y `h2-2` no lo invocaban) | pasa |
| `feature-flow` · Tras compactar, las skills vuelven enteras | `moon run kit:skill-size`: sin `FALLA` de `sdd-implement*`; fase mayor `sdd-implement-native`, 75.010 | pasa |
| `control-profiles` · Tras una compactación, lo que queda va con SDD | por lectura: Method de la puerta y `plan-template.md:30` (la batería no simula una compactación) | no probado con sujetos |
| `control-profiles` · La parada sobre una copia abre con el commit del kit | ejecución real: `cp1` RED 3/3 fallan y GREEN con el contrato 2/2, `tests/sdd-implement-0296-green.md` | pasa |

Medida de la decisión 17, en caracteres y con cada skill contada como mín(caracteres, 20.000), en `dist/` de `f684b98b`: puerta 16.026 + `sdd-implement-subagent` 19.569 + `sdd-worktrees` 9.156 + `sdd-tdd` 10.985 + `sdd-debugging` 10.884 + `sdd-verify` 16.642 + `sdd-rubber-duck` 3.365 = 86.627, por debajo de 100.000.

### 4.3 Residuales / deuda generada

- **El freno que fija la spec** (`fr1`): su RED salió limpio 3 de 3 en sujetos recién arrancados. La fila de deuda queda abierta con esa evidencia, porque el caso de campo vino de una sesión larga.
- **«Qué cambió de la fuente»** en la parada sobre una copia: el asunto del commit lo dice cuando está bien escrito. El commit real de la 0148 (`baad233e feat(sdd-verify): los encargos de los tres ejes`) no dice que quitó la sangría. Va al «queda» de la fila de la 0317.
- **El anuncio `Workspace del plan` en SDD** sale 1 de 2 (`h2`). Antes estaba dos veces (Overview y Setup de la puerta) y ahora una, en el Setup de la copia.
- **Commitear por ruta en Native** (`h1`, fila A): no hay regla para el hilo, ni antes ni después de partir la skill. Es un hueco anterior del kit.

## 5. Aprendizajes

- Un test que busca literales en `skills/` lee también las citas de las marcas: salta las líneas de marca con `WHOLE_LINE_MARK` → `tech-stack.md`, «Contenido y build».
- Antes de llamar regresión a una fila de humo que falla tras reescribir una skill, se mide con el kit de `develop` → `tech-stack.md`, la misma entrada.
- Un hueco que el agente rellena con un dato de otro sitio pide la salida literal del comando que lo da, no una descripción libre → `architecture.md`, «Anatomía de una skill del kit».
- Una pieza del kit que el anexo lleva a una copia pero solo es del kit va a la puerta (decisión 6), y un fichero de la fuente que contradice al kit y no llega al 50 % se deja de copiar y se remite a su gemelo de la otra copia → esta spec, «Enmiendas»; para la 0305 y la 0306, que parten skills igual, en el ticket.

Retro: error que cazaría un chequeo → arreglado en la propia rama: `docs-claims.test.ts` salta las líneas de marca y `skills.test.ts` comprueba los enlaces `../` y a los `.md` de la raíz de la skill (`cli/test/docs-claims.test.ts`, `cli/test/kit/skills.test.ts`)
Retro: error que cazaría un chequeo → ticket del kit: el techo de sujetos del lanzador (`tests/headless/`) cuenta por carpeta de la spec, y el agente que corría la batería lo saltó cambiando de `SPEC_DIR` sin preguntar; el lanzador no lo ve
Retro: corrección repetida → ticket del kit: `skills/sdd-propose/references/review-spec.md` da «ninguna» con 2 señales, el dev-lead pidió dos revisores en paralelo y salieron 20 hallazgos más (séptimo caso de la fila de deuda de la rúbrica, que arregla la 0306)
Retro: documento o skill desmentido → la fila W de `h2` en `tests/batteries/sdd-implement/battery.md` («workspace anunciado», umbral 1/1) no se cumple ni con el kit de `develop` (0 de 2): fila de deuda nueva en `roadmap.md`, «Por triar»

## 6. Adendas
