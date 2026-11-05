---
id: 20261105-161645-feature-0306-propose-rework
feature: 0306
proposal: 0301
title: sdd-propose rehecha, con sus references/ como copia o propia
mode: full
profile: delegate
status: approved
created: 2026-11-05
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-05
---

# Spec — sdd-propose rehecha, con sus references/ como copia o propia

🦆 Hoy, al arrancar una feature, el agente lee una `sdd-propose` de 33.332 bytes: tras compactar, Claude Code la corta a 20.000 y lo que queda detrás se pierde el resto de la sesión. Con esta feature cabe entera: lo que solo se lee en un paso (el carril config, el árbol del patch, el repaso de coherencia) pasa a su `references/`, con la orden de leerlo lo primero en ese paso. Cambian cuatro conductas: toda spec full lleva dos revisores (uno si el delta es pequeño y no toca un contrato), una lite o un patch llevan uno en Sonnet, y un Crítico aceptado pide una segunda ronda. En `delegate`, el diseño por secciones va al ✋ de la spec en vez de pararte tres veces. Y el repaso de coherencia busca con `git grep` en todo el repo y corre cada caso real que la spec cita contra su THEN.

Validación: agente — `validation.mode: field` en `.docs/sdd/sdd-kit.json` (regla 3 de `CLAUDE.md`): cierro con la verificación propia (tests, `kit:*`, batería) registrada como «Validación en campo», y el uso real llega por los tickets de `sdd-feedback`.

## Capacidades

- Modificadas: `feature-flow` — la review de spec (cuántos revisores, de qué modelo y la segunda ronda), el diseño por secciones en `delegate`, el repaso de coherencia y el revisor del patch.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: MODIFIED (cinco requisitos de `feature-flow`), área no explorada (`control-profiles.md` entero) · tamaño: ~900 líneas en 15 ficheros
- Dominio (opus): si los MODIFIED de «La spec propone su propio nivel de review» y «Una feature grande devuelve el diseño por secciones» dejan alguna parada nueva que la regla 3 de `CLAUDE.md` no permite en `delegate`, y si la tabla «Regla que sale del SKILL.md → dónde vive ahora» deja una regla sin destino (señal: MODIFIED de reglas del flujo)
- Técnica (sonnet): si el Scope nombra cada fichero que lee un literal que cambia (`compose-spec-review.mjs`, las anclas `#vigía-de-silencio` y `#validación-en-campo`), si `upstream.json` queda válido sin la copia `pending` y si los 20.000 bytes caben con las referencias que se crean (señal: área no explorada)
- Mínimo razonable: un revisor de siete puntos — deja sin la segunda lectura la tabla de reglas movidas, que es donde un recorte pierde una regla sin que nadie lo vea
```

1. **Las dos references que se anotaban pasan a propias.** `spec-writing.md` conserva el 1 % de `skills/brainstorming/SKILL.md` de superpowers v7.0.2 y `plan-writing.md` el 7 % de `skills/writing-plans/SKILL.md` v7.0.2, medido con `keptShare` de `tests/copies/annotated.ts` contra el tag `v7.0.2` (`git show v7.0.2:<ruta>` del clon de `SDD_UPSTREAM_DIR`); por debajo del 50 %, `kit:copies` dice «es propia: pásala a own». De `v7.0.0` a `v7.0.2`, `writing-plans` no cambia y `brainstorming` cambia 215 líneas (`git diff --stat v7.0.0 v7.0.2`): de ese cambio entran las dos frases de la decisión 2; lo demás (la oferta de empezar ya, el visual companion, el tamaño del documento) ya lo cubren `sdd-grilling` y la spec del kit, y lo revisa la 0314. Las dos van a `own` y cada fuente queda como entrada `concept` en `upstream.json`, en `v7.0.2`, como `sdd-grilling` (`build/sources.ts:49-53`); sale la entrada `copy` con `pending: "0306"`. Sin copias en la skill, `skills/sdd-propose/NOTICE` sobra: lo borra y regenera `THIRD_PARTY_NOTICES.md` `moon run kit:notices` (`removeOrphanNotices` de `build/notices.ts`), en el mismo commit que cambia «Adapted from superpowers … (MIT, see NOTICE)» por «Inspired by superpowers `brainstorming` (MIT)» y «… `writing-plans` (MIT)», como `sdd-grilling`; si no, `cli/test/kit/notices.test.ts` y el «see NOTICE sin NOTICE» del build salen en rojo. Descartado copiar `brainstorming` entero con marcas `sustituye`: el agente leería 14.874 bytes de una fuente que pregunta de otra forma que `sdd-grilling`.
2. **Las dos frases de `brainstorming` 7.0.2 entran sustituyendo.** «marking what you're guessing as your guess» (`spec-writing.md:24`) sale y entra «Anything you filled in goes in as your proposal, with your reason». Los enfoques se dicen en un mensaje propio, antes de las secciones y de `spec.md`: dos o tres maneras de construirlo, con lo que cuesta cada una y la que recomiendas. En `pair` el dev-lead elige; en `delegate` sigues con la tuya y lo dices en el mismo mensaje, sin parar (regla 3 de `CLAUDE.md`). Con un solo camino sensato, el mensaje lo dice y explica por qué no valen los otros.
3. **La rúbrica decide cuántos revisores sin preguntar.** En full, dos (dominio y técnica). Si el Scope cambia menos de ~50 líneas y el delta no toca un contrato público ni lleva `MODIFIED`, uno de siete puntos. El de dominio, o el revisor único de full, va en Opus si la spec toca reglas de negocio, roles o reglas del flujo, y en Sonnet si no; el técnico, siempre en Sonnet. En lite y en patch, Sonnet aunque la spec toque roles: es la frase del dev-lead («levantar uno en sonnet»), y gana a la regla del modelo. Un spike no lleva review: no tiene delta ni Scope que revisar, y su salida es evidencia que se mide (hoy tampoco la lleva: la rúbrica es «*(full mode)*»); config, tampoco, porque no tiene spec. En `unattended`, nunca menos de lo que da la rúbrica. Si el dev-lead pide en la petición «sin review» u otro nivel, se aplica y su frase literal va a «Decisiones tomadas con el dev-lead»: el nivel es suyo (regla 3 de `CLAUDE.md`). Sale la pregunta de activar la review («Proponer no es activar») y sale «Con un nivel de «ninguna», sigue siendo ninguna». El bloque de la review sigue abriendo el ✋, como registro. Queda una sola pregunta: si las instrucciones del usuario piden confirmar antes de paralelizar y la spec no va delegada, una pregunta con los dos revisores, sus modelos y su coste antes de despacharlos. En `delegate` es una parada de dinero, de las que la regla 3 de `CLAUDE.md` deja al dev-lead, y la piden sus propias instrucciones. Con la spec delegada, un revisor de siete puntos sin preguntar, como hoy.
4. **La segunda ronda** relee la spec corregida una sola vez, con un revisor nuevo de siete puntos en Sonnet, si se aceptó un Crítico o se reescribió la decisión central. La decisión central es la que fija el enfoque elegido en el mensaje de los enfoques (decisión 2) o, sin ese mensaje, la que el Intent pone como condición de éxito. Vale en full y en lite; en el patch, no: su revisor lee el arreglo ya hecho, antes de su commit. Un Crítico de la segunda ronda va al gate como hallazgo, aceptado o rechazado con motivo, sin tercera ronda; después, el gate.
5. **El revisor del patch va en `sdd-implement/references/patch-flow.md`, paso 5, no en `sdd-propose`.** La fila pide ponerlo «en el paso donde hoy se confirma el patch», y allí (paso 2 de `sdd-propose`) aún no hay `patch.md`: la causa raíz la escribe el paso 1 de `patch-flow.md` y `patch.md` el paso 3. Antes del commit del fix, un revisor (`sdd-kit:effort-medium`, `model: sonnet`) lee `patch.md` y el diff: causa raíz, arreglo y su test; cada hallazgo se responde en §4 de `patch.md`, arreglado o rechazado con su motivo. Sustituye «don't dispatch any axis or reviewer (dev-lead, 2026-10-21: «Solo la verificación»)» y la red flag «You're about to dispatch a reviewer «to be safe»». Es un fichero de la fila 0296, en curso: dos frases, que la 0296 hereda al reescribir `patch-flow.md`.
6. **Lo que sale del `SKILL.md`** (tabla en el Approach): el carril config a `references/config-lane.md`; el árbol «Is it really a patch?» con sus dos predicados a `references/patch-lane.md`; el repaso de coherencia a `references/coherence-pass.md`; la propuesta de `§Frontend` y `Se valida en:` a `spec-writing.md`; la pregunta del gate del plan en `pair` a `plan-writing.md`. Medido con `wc -c`, eso son ~9.800 bytes y deja el `SKILL.md` en ~24.500: hacen falta ~5.500 más, de cuatro sitios. El anuncio del paso 2 (`:53`, 1.522 bytes) repite el bloque del aviso de fase (K15) y se queda en una línea que lo nombra. La oferta de gama media se escribe una vez, en el gate de la spec, y el bloque del aviso de fase y el paso 5 la nombran. Las red flags y las racionalizaciones de patch y de ids van a `patch-lane.md` y `nombrado.md` (la lista, en la decisión 17). Y el detalle de la estimación del patch (`:54`) va a `patch-lane.md`. El `SKILL.md` resultante se mide con `kit:skill-size` al cerrar cada task que lo edita, no al final. Cada paso que pierde un bloque abre con «First thing …: read `references/<x>.md`» y conserva las condiciones que deciden: es la forma que midió 4/4 y 2/2 (`tech-stack.md`, «Un traspaso a otra skill es lo primero del paso» y `architecture.md`, «Un paso que resume una regla de una referencia lleva todas las condiciones que deciden»). Descartado partir `sdd-propose` en dos skills: cada skill suma su `description` a todas las sesiones (`architecture.md`, «Ficheros auxiliares»).
7. **Las repeticiones de la 0299 se quedan en un sitio.** K15: el anuncio y la oferta de gama media viven en el bloque del aviso de fase y en el gate de la spec; los pasos 2, 4 y 5 los nombran sin repetirlos. K17: la regla de los dos tests vive en el paso 2 y el ejemplo de `facturas` en `patch-lane.md`. K18: la fila de la rama vive en la Gate 1. K21: el ✋ exhaustivo, en `spec-writing.md`. K23 y K24, en `control-profiles.md`: una vez cada una. K16 («**Removal** is the exception»): el predicado del ajuste de presentación se reescribe con la retirada como su segundo caso, sin la frase de excepción.
8. **Las dos excepciones que da `kit:own` en `SKILL.md`** (`:21`, «only» … «unless»; `:64`, «never» … «except») se reescriben con su caso dentro de la regla.
9. **Las cuatro references en castellano se traducen al inglés**: `control-profiles.md`, `review-spec.md`, `modo-lite.md` y `nombrado.md`. Sus nombres de fichero se quedan: renombrarlos toca enlaces de otras cuatro skills y las `rutas` de la ADR 0018, y la fila no lo pide. Un literal que el agente escribe para el proyecto o para el usuario (`Aviso: se ignora <clave> de sdd-kit.local.json: …`, `Perfil de control: <perfil>`, `Validación en campo: …`) sigue en castellano, en un bloque `text`, como dice `tech-stack.md`, «Traducir una skill con `kit:own` delante». Una restricción con salvedad se escribe «no X other than Y».
10. **Las anclas de los títulos traducidos** cambian donde se enlazan: `#vigía-de-silencio` en `sdd-config/SKILL.md:28`, `sdd-implement/SKILL.md:316`, `sdd-verify/SKILL.md:242`, `sdd-verify/references/encargo-revision.md:25` y `review-spec.md:51`; `#validación-en-campo` en `sdd-archive/SKILL.md:28` y en la regla 3 de `CLAUDE.md`. Solo el ancla, ni una palabra más, en ficheros de las filas 0296, 0305, 0307 y 0308. Las anclas internas de `control-profiles.md` (`#quién-valida` en `:56`, `#vigía-de-silencio` en `:158` y `:235`) cambian dentro de su traducción; las comprueba `cli/test/kit/skills.test.ts`.
11. **`tests/batteries/sdd-verify/compose-spec-review.mjs`** lee el encargo del revisor de `review-spec.md` por seis literales en castellano (`> Eres un revisor adversarial`, `<dominio|técnica>`, `` `<ruta spec.md>` ``, `` `<capacidades tocadas de capabilities/>` ``, `[lente técnica: …]` y « Con dos revisores, termina con la frontera de tu lente.»): pasan a sus literales en inglés en la task que traduce `review-spec.md`, y `s1` de `sdd-verify` lo comprueba. Los fixtures `review-spec-c1.md` y `-c9.md` de `tests/batteries/sdd-verify/` no cambian: son el informe del eje Spec de la revisión final, otro fichero con el mismo nombre en el workspace del sujeto.
12. **El repaso de coherencia** sustituye «search each name and each id in `capabilities/`, the project's documents and, in a skills kit, `skills/`» por «search each name and each id in the whole repo with `git grep`, except the evidence folders, with each form of the literal (the string and its bare value), and run each real case the spec cites (a file:line, a sha) against the THEN that should catch it», en la misma frase. Las carpetas de evidencia, nombradas: `.docs/sdd/specs/`, `.docs/sdd/field-reports/` y, en un kit de skills, `tests/*.md`.
13. **Diseño por secciones en esta spec**: prevé 5 tasks y el perfil es `delegate`, así que las secciones van a este ✋ (la regla que la propia spec escribe, aprobada por el dev-lead el 2026-11-05): son los puntos 1 a 12. Los enfoques, en el mensaje anterior a la spec, con mi elección (decisión 2).
14. **5 tasks, sin partir**: las cinco tocan el texto de `sdd-propose` y su batería, sin migración ni otra superficie (paso 2, umbral de partir).
15. **Prueba (Art. I).** Edición de una skill de propose que adelgaza: batería entera (`tech-stack.md`, «Baterías por skill»). El RED es estructural en los diez frentes, leído con fichero y línea, sin sujetos: el texto de hoy dice lo contrario de lo que se mide (`review-spec.md:20`, «Por defecto, ninguna»; `:3`, «En modo lite no se aplica»; `:64`, «Después, el gate»; `patch-flow.md:19`; `spec-writing.md:24` y `:26`; `SKILL.md:62`). GREEN y REFACTOR con diez escenarios nuevos o cambiados (`rv1`, `rv2`, `rv3`, `lr1`, `rr1`, `pr1`, `pb` en `delegate` y su gemelo `pb-p` en `pair`, `co7` y `co8`), y los demás como control; el mapa de cada cláusula, en «Dónde se prueba».
16. **Repaso de coherencia hecho con la regla nueva** (`git grep` en todo el repo, salvo evidencia): añadió al Scope `.docs/sdd/mission.md:54` (el glosario decía «ninguno por defecto» y «Nunca en lite») y dejó sin cambio `walkthrough-template.md:35`, con su motivo en la tabla. `sdd capability merge` sobre una copia, tras incorporar la review: «feature-flow.md: sustituido» en los ocho requisitos y «regla «Límites» sustituida», sin rechazos.
17. **Red flags y racionalizaciones que salen del `SKILL.md`**, cada una al fichero de su carril y sin cambiar de texto. A `patch-lane.md`: la red flag «You're about to open as a patch a request that doesn't fix the solution…» y las racionalizaciones «It's simple / the client expects it today», «Operations already knows the cause», «I've been asked for a patch and it's small» y «The ticket proposes the fix». A `nombrado.md`: las red flags «The folder says `feature-` but the content is a `patch.md`…», «In `sequence` without a roadmap row, you created the folder before the branch…» y «In `sequence`, you created the folder without running `sdd id claim`…», y la racionalización «Without a ticket the id is `0000`…». A `config-lane.md`: la red flag «You're about to edit a dependency, CI or a setting without asking…». La racionalización «The rubric says no review: the spec is ready for the gate» se sustituye por «The reviewers will read it, so the coherence pass can wait» → «The pass is yours and goes before dispatching them…», con el caso que la creó (`tests/proportional-review-red.md`, R3). Las demás se quedan: la de la fila de la rama (K18) también, porque la Gate 1 dice la regla y la tabla su racionalización medida (`tests/control-profiles-red.md`, E1).
18. **Los topes de palabras no se tocan** (`cli/test/kit/word-budget.test.ts`, `'sdd-propose': { skillMd: 5250, total: 14200 }`): hoy el `SKILL.md` mide 5.301 y pasa solo por el margen del 25 %, que quita la 0284; tras esta feature, ~3.200.
19. **La batería de `sdd-propose` cambia sin tocar `ws3`**: `cli/test/kit/headless/battery.test.ts:352-367` lee el `battery.md` real y busca la fila `ws3`, con «setup-lockfile» y su umbral; `cli:test` lo corre tras editar la batería.
- Política de modelos: revisores de la spec dominio opus + técnica sonnet, effort medium · segunda ronda, si la hay, sonnet · ejes de la revisión final Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de la batería sonnet, en tandas · en paralelo hasta `control.maxParallelAgents` (3).

### Hallazgos de la review

Dos revisores (dominio en Opus, técnica en Sonnet, effort medium): 20 hallazgos (10 de cada lente; D6 y T4 dicen lo mismo), ningún Crítico, todos aceptados. La decisión central (el enfoque) no se reescribe: sin segunda ronda.

- **Aceptado** — D1 · la lectura de `patch-lane.md` estaba atada a la pregunta del carril, que no existe con «patch: …» en la petición ni en `unattended` → la tabla del Approach dice «Before you classify a change as patch, asked or not, read `references/patch-lane.md`».
- **Aceptado** — D2 · dos frases del repaso sin destino («In `delegate`, ✋ carries the `Política de modelos:` line» y «Say what you correct…») y `SKILL.md:106` → las dos a `coherence-pass.md`, y `:106` a `patch-lane.md`, en la tabla del Approach.
- **Aceptado** — D3 · «La política de modelos…» y «Dos revisores de spec se despachan…» daban por posible «ninguno» o «aceptada» → dos `MODIFIED` más en el delta.
- **Aceptado** — D4 · la pregunta de confirmar los dos revisores para en `delegate` sin decir por qué la regla 3 de `CLAUDE.md` la admite → decisión 3: es una parada de dinero, pedida por las instrucciones del dev-lead.
- **Aceptado** — D5 · conflicto de modelo en una lite que toca roles → decisión 3 y el `MODIFIED` del effort: en lite y en patch, Sonnet siempre.
- **Aceptado** — D6 y T4 · faltaban spike, config, `unattended` y la petición «sin review» → decisión 3 y dos AND en el `MODIFIED` del nivel.
- **Aceptado** — D7 · «decisión central» sin criterio, y la segunda ronda sin alcance ni final → decisión 4 y el `MODIFIED` de la review adversarial: la central es la del enfoque, vale en full y lite, y un Crítico de la segunda ronda va al gate sin tercera.
- **Aceptado** — D8 · los topes nuevos sin regla de la capacidad → «Reglas de la capacidad — feature-flow», «Límites», con el valor vigente más los dos topes.
- **Aceptado** — D9 · «el delta» frente a «el Scope» en el umbral de ~50 líneas → «el Scope», en la decisión 3.
- **Aceptado** — D10 · ejemplos con ficheros reales del kit en una capacidad de ejemplos inventados → `config.json` y `test/config.test.js`; `src/invoice.js:42` y un importe cero.
- **Aceptado** — T1 · el `NOTICE` y `THIRD_PARTY_NOTICES.md` los regenera `kit:notices`, no el build → decisión 1, Scope y «Dónde se prueba».
- **Aceptado** — T2 · lo que movía la tabla dejaba ~24.500 bytes → decisión 6: cuatro sitios más (~5.500 bytes) y `kit:skill-size` al cerrar cada task.
- **Aceptado** — T3 · sin mapa de THEN a escenario → tabla en «Dónde se prueba», con `rv3` nuevo.
- **Aceptado** — T5 · tres anclas internas de `control-profiles.md` → decisión 10.
- **Aceptado** — T6 · seis literales en `compose-spec-review.mjs`, y dos fixtures con el mismo nombre → decisión 11 y una fila en «Lo que se retira…».
- **Aceptado** — T7 · contra qué tag se midió y qué cambió de 7.0.0 a 7.0.2 → decisión 1.
- **Aceptado** — T8 · qué racionalizaciones salen y el tope de palabras, fuera del ✋ → decisiones 17 y 18.
- **Aceptado** — T9 · `battery.test.ts` lee la fila `ws3` → decisión 19 y «Dónde se prueba».
- **Aceptado** — T10 · `commit-history.md:13` y `control-profiles.md:31` sin fila → dos filas «sin cambio» con su motivo.

### Decisiones tomadas con el dev-lead

- Las cuatro sustituciones del alcance (rúbrica, repaso de coherencia, secciones en `delegate`, frases de `brainstorming` 7.0.2) son las de sus filas de deuda, con sus frases — prompt de arranque de la 0306, 2026-11-05
- Dos revisores por defecto en full, uno en lite y en patch, y la segunda ronda tras un Crítico — «lite y patch minimo tendriamos que levantar uno en sonnet» y «si» (2026-11-04)
- En `delegate`, las secciones del diseño van al ✋ de la spec y su parada las aprueba — «si» (2026-11-05)
- La frase que falla se sustituye, sin añadir otra al lado (ADR 0022, regla 3) — prompt de arranque
- Al traducir una restricción con salvedad, «no X other than Y»; antes de cambiar un título, buscarlo en `cli/` y `tests/` — prompt de arranque
- Si al arrancarla pasa de 5 tasks, se parte con `sdd-propose` — prompt de arranque
- Las frases que `kit:own` da repetidas con una skill de otra fila son de la 0311; el triaje de `sdd-roadmap`, de la 0308 — prompt de arranque
- Perfil `delegate`; al fusionar, `sdd merge --push` — prompt de arranque

## Intent

`dist/skills/sdd-propose/SKILL.md` ocupa 33.332 bytes, y `kit:skill-size` lo da en FALLA (tope: menos de 20.000): tras compactar, Claude Code vuelve a adjuntar la skill cortada a 20.000 caracteres y pierde lo que queda detrás. Sus `references/` mezclan dos que `kit:copies` da «sin anotar → 0306» con cuatro en castellano que `kit:own` da en rojo. Y cuatro filas de deuda la apuntan: la rúbrica que dio «ninguna» en seis features seguidas (0302, 0312, 0304, 0316, 0315 y antes la 0237 y la 0029) y cada vez el revisor encontró Críticos o Important; el repaso de coherencia que solo busca en tres carpetas; las secciones del diseño, que pararon seis veces al dev-lead en la 0304; y el triaje que fija una solución sin probarla contra el caso real. El éxito: `moon run kit:skill-size` sin FALLA en `sdd-propose`, `moon run kit:copies` sin ninguna línea «→ 0306», `moon run kit:own` sin líneas en `skills/sdd-propose/` salvo las repetidas con la skill de otra fila, y `cli:test` en verde. Fracasaría aunque los cuatro pasen si una regla que hoy está en el `SKILL.md` deja de aplicarse por haber bajado a una reference que el agente no abre: eso lo mide la batería entera.

## Scope

- Entra: `skills/sdd-propose/SKILL.md`, por debajo de 20.000 bytes, con las decisiones 6, 7, 8 y 12.
- Entra: `skills/sdd-propose/references/` nuevas: `config-lane.md`, `patch-lane.md` y `coherence-pass.md`.
- Entra: `skills/sdd-propose/references/spec-writing.md` y `plan-writing.md`, propias (decisiones 1 y 2), con la sustitución de `spec-writing.md:26` («they apply in `pair` and in `delegate`» → «they apply in `pair`; in `delegate` they go to the spec's ✋ and its stop approves them») y lo que reciben del `SKILL.md` (decisión 6).
- Entra: `skills/sdd-propose/references/review-spec.md`, en inglés, con la rúbrica nueva (decisiones 3 y 4).
- Entra: `skills/sdd-propose/references/control-profiles.md`, `modo-lite.md` y `nombrado.md`, en inglés (decisión 9), con K23 y K24.
- Entra: `skills/sdd-propose/NOTICE`, borrado; `upstream.json`: la copia `pending: "0306"` sale, entran dos `concept` y los cinco ficheros nuevos o pasados a propia en `own`; `THIRD_PARTY_NOTICES.md` y el `NOTICE`, con `moon run kit:notices` (decisión 1).
- Entra: `skills/sdd-implement/references/patch-flow.md`, paso 5 y su red flag (decisión 5).
- Entra: las anclas de la decisión 10 (`skills/sdd-config/SKILL.md`, `skills/sdd-implement/SKILL.md`, `skills/sdd-verify/SKILL.md`, `skills/sdd-verify/references/encargo-revision.md`, `skills/sdd-archive/SKILL.md`, `CLAUDE.md`).
- Entra: `tests/batteries/sdd-verify/compose-spec-review.mjs` (decisión 11).
- Entra: `.docs/sdd/mission.md`, la entrada «Nivel de review» del glosario.
- Entra: `tests/batteries/sdd-propose/battery.md` y `subject.mjs`: los escenarios de la decisión 15, la fila PB (en `delegate`, las secciones van al ✋), las filas de la rúbrica de review y la «Procedencia de las reglas» con las reglas que cambian de sitio; la evidencia en `tests/sdd-propose-0306-green.md`.
- Entra: `dist/`, reconstruido con `moon run kit:build`.
- No entra: las frases que `kit:own` da repetidas con una skill de otra fila (`SKILL.md:11` con trece skills, `:60` con `sdd-templates`, `:113` con `sdd-implement`; `control-profiles.md:145` con `sdd-archive`): 0311.
- No entra: el triaje de `sdd-roadmap` (la parte 0308 de la fila del triaje).
- No entra: renombrar `modo-lite.md` y `nombrado.md` (decisión 9), ni las alternativas en el `## Approach` de `spec-template.md`, que son de la 0309.
- No entra: el resto de `patch-flow.md` y de `sdd-implement`, de la 0296.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Rúbrica «Por defecto, ninguna. 0–3 señales no proponen review» y «Con un nivel de «ninguna», sigue siendo ninguna» | `skills/sdd-propose/references/review-spec.md:20` y `:23`; `.docs/sdd/capabilities/feature-flow.md:29-34`; `SKILL.md:61` y la racionalización «The rubric says no review» (`SKILL.md:132`) | delta `MODIFIED` «La spec propone su propio nivel de review por complejidad»; Scope (`review-spec.md`, `SKILL.md`) |
| Glosario «Nivel de review»: «sin · un revisor … · dos revisores», «ninguno por defecto; el usuario acepta o cambia», «Nunca en lite» | `.docs/sdd/mission.md:54` | Scope: la entrada pasa a «uno o dos revisores, decidido por la rúbrica; en lite, uno» |
| Opción `no` de la línea «Review de spec:» | `skills/sdd-templates/templates/walkthrough-template.md:35`; `feature-flow.md:100-104` | sin cambio: sigue valiendo para las specs anteriores y no contradice la regla nueva; la forma de las plantillas es de la 0309 |
| La review en lite y la delegada | `.docs/sdd/capabilities/commit-history.md:13` («en lite, solo la spec»); `.docs/sdd/capabilities/control-profiles.md:31` («decide él la review de spec y la registra») | sin cambio: los hallazgos de la review de una lite van en la spec, y con la spec delegada el agente sigue decidiendo y registrando el nivel |
| Ejemplo `revisores de la spec ninguno` y «review de dos revisores aceptada» | `feature-flow.md:603` y `:628` | delta `MODIFIED` de «Dos revisores de spec se despachan con `sdd-parallel-agents`» y de «La política de modelos de la spec vale como confirmación de paralelizar» |
| «Proponer no es activar» y la pregunta de activar la review | `review-spec.md:25` y `:47`; `feature-flow.md:218-226` («WHEN el agente pregunta la review») | delta `MODIFIED` «El revisor de spec se despacha con su effort»; Scope |
| «En modo lite no se aplica» | `review-spec.md:3`; `feature-flow.md:34` («en modo lite no se propone»); `SKILL.md:61` («*(full mode)*») | delta `MODIFIED` del nivel de review; Scope |
| «Después, el gate» (sin segunda ronda) | `review-spec.md:64`; `feature-flow.md:35-41` | delta `MODIFIED` «La review adversarial tensa la spec antes del gate» |
| «A patch has no final review: … don't dispatch any axis or reviewer» y la red flag «to be safe» | `skills/sdd-implement/references/patch-flow.md:19` y `:31`; `feature-flow.md:721-727` | delta `MODIFIED` «Un patch sigue en `sdd-implement`, con verificación y sin revisión final»; Scope (decisión 5) |
| «they apply in `pair` and in `delegate`» | `skills/sdd-propose/references/spec-writing.md:26`; `feature-flow.md:555-565` | delta `MODIFIED` «Una feature grande devuelve el diseño por secciones antes de la spec» |
| «marking what you're guessing as your guess» | `spec-writing.md:24` | Scope (decisión 2) |
| Lista de carpetas del repaso de coherencia | `SKILL.md:62`; `feature-flow.md:155` | delta `MODIFIED` «La spec se repasa antes del gate»; Scope (decisión 12) |
| Bloques que salen del `SKILL.md`: «Config lane», «Is it really a patch?», repaso de coherencia, `§Frontend`, `Se valida en:`, gate del plan en `pair` | `SKILL.md:60` (`§Frontend`, `Se valida en:`), `:62` (repaso), `:66` (gate del plan en `pair`), `:69-77` («Config lane»), `:79-106` («Is it really a patch?»); ancla `../../sdd-propose/SKILL.md#is-it-really-a-patch` en `patch-flow.md:3`; `[Config lane](#config-lane)` en `SKILL.md:45` | Scope: el ancla de `patch-flow.md:3` pasa a `../../sdd-propose/references/patch-lane.md`; las internas, al fichero nuevo |
| Títulos de `control-profiles.md` traducidos (anclas `#vigía-de-silencio`, `#validación-en-campo`) | decisión 10, siete sitios | Scope (decisión 10) |
| Encargo del revisor en castellano | `review-spec.md:60`; `tests/batteries/sdd-verify/compose-spec-review.mjs:8-15`; `tests/batteries/sdd-verify/fixtures/review-spec-c1.md` y `-c9.md` | Scope (decisión 11); los dos fixtures, sin cambio: son otro fichero con el mismo nombre |
| `skills/sdd-propose/NOTICE` y «Adapted from … see NOTICE» | `spec-writing.md:3`, `plan-writing.md:3`; `upstream.json:355-368`; `THIRD_PARTY_NOTICES.md` (generado) | Scope (decisión 1) |
| Entrada `copy` con `pending: "0306"` | `upstream.json:367`; fila 0312 del roadmap («`kit:upstream` solo da rojo en las entradas de … 0306 …») | Scope; la fila 0312 está cerrada (✅) y no se toca |

- Filas que implementa: 0306 → `.docs/sdd/roadmap.md:143` y `upstream.json:367` (Scope). Las filas de deuda «El repaso de coherencia busca lo que se retira solo en…» (`roadmap.md:716`), «La rúbrica de review de spec da «ninguna»…» (`:717`), «En `delegate`, el diseño por secciones para al dev-lead…» (`:725`) y la parte `sdd-propose` de «El triaje fija en la fila una solución…» (`:726`), y la (c) de «Menores de los tickets de la 0228 y la 0237» (`:651`), que remite a la de la rúbrica: las salda el cierre. Comprobado con `git grep -n 0306 -- . ":!.docs/sdd/specs" ":!.docs/sdd/field-reports" ":!tests/*.md"`: solo el roadmap y `upstream.json`.

## Approach

El enfoque elegido (decisión 2, en el mensaje anterior): bajar a `references/` los bloques que solo se leen en un paso, con la orden de leerlos lo primero en ese paso, y quitar las repeticiones. Descartados partir la skill en dos y comprimir la prosa sin mover nada (no llega: el árbol del patch y el repaso de coherencia solos pasan de 6.000 bytes).

| Regla que sale del `SKILL.md` | Dónde vive ahora | Lo que queda en el paso |
| --- | --- | --- |
| Config lane, pasos 1-5 | `references/config-lane.md` | paso 2, carril config: la definición y «With the lane confirmed, first thing: read `references/config-lane.md`» |
| Is it really a patch?: árbol, solución fijada, predicado del ajuste y de la retirada, «That the reporter "believes they know the cause"…» (`:106`); la estimación del patch (`:54`); sus red flags y racionalizaciones (decisión 17) | `references/patch-lane.md` | paso 2, carril patch: las tres clases, la regla de un test y «Before you classify a change as patch, asked or not, read `references/patch-lane.md`» |
| Red flags y racionalización de ids y carpetas (decisión 17) | `references/nombrado.md` | paso 3 ya lo enlaza |
| Repaso de coherencia: cuatro comprobaciones, literales, `MODIFIED`, lo que se retira, pasos numerados, `capability merge`, «In `delegate`, ✋ carries the `Política de modelos:` line», «Say what you correct in «Decisiones que he tomado yo»» | `references/coherence-pass.md` | paso 4: «Coherence pass, in both modes, before dispatching the review and before the gate: first thing, read `references/coherence-pass.md`» |
| Propuesta de `§Frontend`; `Se valida en:`; capacidad nueva en kebab-case | `references/spec-writing.md` | nada: el paso 4 ya abre con leer `spec-writing.md` |
| ✋ exhaustivo (K21) | `references/spec-writing.md` | el gate cita «✋ Decisiones que he tomado yo — valida estas» |
| Gate del plan en `pair`: opciones con el método y la de gama media | `references/plan-writing.md`, «Execution handoff» | paso 5: «only `pair` stops», con el enlace |
| Anuncio y oferta de gama media repetidos (K15) | el bloque del aviso de fase y el gate de la spec | pasos 2 y 5 los nombran |
| Ejemplo de `facturas` (K17) | `references/patch-lane.md` | paso 2: la regla de los dos tests |
| Fila de la rama como enunciado, en el paso 2 (K18) | Gate 1 | nada |
| Racionalizaciones que repiten un paso | se quitan si su paso ya dice la regla; las que nombran una conducta medida se quedan | — |

`review-spec.md` se reescribe en inglés con las secciones de hoy: señales, nivel, despacho, hallazgos; el nivel sigue saliendo de las señales y del tamaño, pero nunca da «ninguna». `control-profiles.md` se traduce sección a sección, conservando la tabla de gates y sus filas.

## Dónde se prueba

- Tamaño, copias, propias: `moon run kit:skill-size`, `moon run kit:copies` y `moon run kit:own`, como en la 0304 y la 0315.
- Enlaces, anclas, `references/` huérfanos y `NOTICE`: `cli/test/kit/skills.test.ts` y `cli/test/kit/notices.test.ts` en `cli:test`; la fila `ws3` de la batería, `cli/test/kit/headless/battery.test.ts`.
- `upstream.json` y los avisos: `moon run kit:notices` (borra el `NOTICE` y regenera `THIRD_PARTY_NOTICES.md`), `moon run kit:build` (falla con un `see NOTICE` sin `NOTICE`) y `moon run kit:upstream` en las dos entradas `concept`.
- Conducta del agente: `tests/batteries/sdd-propose/` con `battery.mjs run`, los escenarios nuevos y la batería entera como control; `s1` de `tests/batteries/sdd-verify/` para `compose-spec-review.mjs`; los escenarios del árbol del patch de `tests/batteries/using-sdd/` (`p1`, `v1`, `c1w`, `pc1`, `bt1`, `c2`).
- El delta: `sdd capability merge` sobre una copia de `.docs/sdd` fuera del repo.

Cada THEN y AND del delta, con lo que lo observa (`battery.md` de `sdd-propose` salvo que diga otra; los escenarios nuevos, en la decisión 15):

| Cláusula | Escenario o test |
| --- | --- |
| Nivel: dos revisores en full, sin preguntar si se hace; el bloque abre el ✋ y cita esta spec; el de dominio en Opus por roles | `rv1` (spec con 2 señales, roles y ~120 líneas: dos `Agent`, ninguna pregunta de activar, el de dominio con `model: opus`) |
| Nivel: un revisor con un Scope de menos de ~50 líneas sin contrato ni `MODIFIED`; dos si toca un contrato | `rv2` (dos líneas en `docs/guia.md` y un `ADDED`: un `Agent`) y `rv1` como contraste |
| Una pregunta con los dos revisores, sus modelos y su coste si las instrucciones piden confirmar y la spec no va delegada; uno sin preguntar si va delegada | `rv3` (molde con esa instrucción en su `CLAUDE.md`), y la delegada leída en `review-spec.md` (regla sin cambio desde `tests/spec-review-weight-red.md`, p) |
| Cuatro señales y delta grande siguen en dos; ninguna línea genérica | `r1` (control, la 0011) |
| `unattended`, nunca menos que la rúbrica; lite, uno en Sonnet aunque toque roles | `lr1` (lite que toca un rol: un `Agent` con `model: sonnet`); `unattended`, leído en `review-spec.md` |
| Spike y config sin review; «sin review» en la petición se aplica y se registra | `k2` y `k1` con `tools: /Agent/` ausente; `s1` y `g1` («Sin review»), con la frase en «Decisiones tomadas con el dev-lead» |
| Hallazgos aceptados o rechazados antes del gate; lentes disjuntas; revisor único con los siete puntos | `sr1` (control) |
| Segunda ronda tras un Crítico aceptado, una vez, en Sonnet; sin tercera ronda | `rr1` (spec escrita con los hallazgos de la primera ronda, uno Crítico aceptado: un `Agent` nuevo con `model: sonnet` antes del gate) |
| Sin Crítico ni decisión central reescrita, no hay segunda ronda | `sr1` (control: tras incorporar, va al gate sin otro `Agent`) |
| Modelo del revisor: Opus por roles, Sonnet si no, sin preguntarlo; el técnico, Sonnet; cada despacho con `subagent_type` | `rv1` y `rv2` (`tools`) |
| Enfoques en un mensaje propio; en `pair` espera, en `delegate` dice su elección y sigue; secciones en `pair`, al ✋ en `delegate`; lo rellenado, como propuesta con motivo | `pb-p` (`pair`: el mensaje de los enfoques acaba en pregunta, sin `spec-new.md`) y `pb` (`delegate`: enfoques con la elección, sin parar, y `spec-new.md` con las secciones en el ✋) |
| Repaso: `git grep` en todo el repo, cada forma del literal | `co7` (molde con el literal en `test/config.test.js` y su valor suelto) |
| Repaso: cada caso real contra su THEN | `co8` (spec que cita `src/invoice.js:42` y un THEN que no lo atrapa) |
| Repaso: contradicciones, `MODIFIED` fuera de la spec, pasos numerados, ids, `capability merge` | `t1`, `co1` a `co6` y `sp1` (control) |
| Patch: un revisor en Sonnet antes del commit del fix; §4 responde cada hallazgo | `pr1` (el flujo de `d1` hasta el commit: un `Agent` con `model: sonnet` antes del `git commit`, y §4 de `patch.md` con la respuesta) |
| Dos revisores con `sdd-parallel-agents`; la política de modelos confirma | `sr1` y `sp1` (control) |

## Términos y ADR

- Términos resueltos: **segunda ronda** — la relectura única de la spec corregida por un revisor nuevo tras un Crítico aceptado o la decisión central reescrita; se evita «re-review», que en `sdd-verify` es otra cosa.
- ADR candidatas: la review de spec deja de ser opcional en full, lite y patch, y la rúbrica solo decide cuántos revisores — alternativa descartada: la rúbrica de señales que proponía «ninguna» por defecto (la de hoy, desde la feature 0040).

## Delta de comportamiento

### Capacidad: `feature-flow`

#### MODIFIED — La spec propone su propio nivel de review por complejidad (antes: "por defecto no hay review")

- GIVEN una spec en modo full recién redactada
- WHEN el agente cuenta las señales de la rúbrica
- THEN la review lleva dos revisores, dominio y técnica, y el agente no pregunta si se hace: el bloque de la review abre el ✋ con el nivel, las señales, el tamaño, qué comprobaría cada lente en esta spec y la opción mínima con lo que deja sin cubrir
- AND si el Scope cambia menos de ~50 líneas (texto y código) y el delta no toca un contrato público ni lleva un `MODIFIED`, el nivel baja a un revisor con los siete puntos, nunca a ninguno: con dos líneas en `docs/guia.md` y un `ADDED`, un revisor; con dos líneas en `db/002-site.sql` y `src/api.js` que cambian un contrato público, dos
- AND si el nivel es dos revisores, la spec va aprobada por delegación (la opción o la frase «apruebo la spec por delegación») y las instrucciones del usuario piden confirmar antes de paralelizar, el agente despacha un revisor con los siete puntos sin preguntar, y la segunda lente queda en la línea del mínimo
- AND si el nivel es dos revisores, la spec no va delegada y las instrucciones del usuario piden confirmar antes de paralelizar, el agente pregunta una sola vez, antes de despacharlos, con los dos revisores, el modelo de cada uno y su coste
- AND con 4 señales o más y un delta grande (seis ficheros, uno de ellos una migración), sin esa restricción, siguen siendo dos revisores
- AND ninguna de esas líneas es genérica: cita un requisito, una sección o un valor de esta spec
- AND en `unattended` el agente decide y lo registra, nunca con menos revisores de los que da la rúbrica; en modo lite, un revisor con los siete puntos en Sonnet
- AND un spike no lleva review, y un cambio de config, tampoco, porque no tiene spec
- AND si la petición o el prompt de arranque piden «sin review» u otro nivel, el agente lo aplica y escribe la frase literal en «Decisiones tomadas con el dev-lead»
- REMOVED THEN por defecto no hay review; con 4 señales o más, o contrato público + datos, el agente la recomienda **antes** de presentar la spec, en una sola pregunta con el nivel, las señales, el tamaño, qué comprobaría cada lente en esta spec, la opción mínima con lo que deja sin cubrir y el modelo del revisor de dominio
- REMOVED AND si el Scope cambia menos de ~50 líneas (texto y código), el nivel baja de dos revisores a uno con los siete puntos, nunca a ninguno: con contrato público + datos y dos líneas en `db/002-site.sql` y `src/api.js`, un revisor
- REMOVED AND si el nivel sería dos revisores, la spec va aprobada por delegación (la opción o la frase «apruebo la spec por delegación») y las instrucciones del usuario piden confirmar antes de paralelizar, el agente despacha un revisor con los siete puntos sin preguntar, y la segunda lente queda en la línea del mínimo; con un nivel de «ninguna» no despacha ninguno
- REMOVED AND en `unattended` el agente decide y lo registra; en modo lite no se propone

#### MODIFIED — La review adversarial tensa la spec antes del gate (antes: "Después, el gate")

- GIVEN un nivel de review decidido por la rúbrica
- WHEN el agente despacha el revisor con la spec, la constitution, la mission y las capacidades tocadas
- THEN cada hallazgo aparece en «Decisiones a validar» como aceptado (con el cambio en la spec) o rechazado con motivo, antes de pedir la aprobación
- AND con dos revisores cada lente recibe puntos disjuntos y el encargo le prohíbe reportar lo que pertenece al punto de la otra
- AND con un revisor la lente única recibe todos los puntos
- AND si se aceptó un Crítico o se reescribió la decisión central —la que fija el enfoque elegido o, sin mensaje de enfoques, la que el Intent pone como condición de éxito—, un revisor nuevo con los siete puntos, en Sonnet, relee la spec corregida una sola vez, en full y en lite, y sus hallazgos se incorporan igual; después, el gate
- AND sin un Crítico aceptado ni la decisión central reescrita, no hay segunda ronda; y un Crítico de la segunda ronda va al gate aceptado o rechazado con motivo, sin tercera ronda
- REMOVED GIVEN un nivel de review activado por el usuario o, en `unattended`, decidido y registrado por el agente

#### MODIFIED — El revisor de spec se despacha con su effort (antes: "WHEN el agente pregunta la review")

- GIVEN una spec de permisos por rol del gestor de cobros, con review de uno o dos revisores
- WHEN el agente despacha la review
- THEN el revisor de dominio va en Opus porque la spec toca roles; para «renombrar una columna del listado», en Sonnet; sin preguntarlo
- AND con un solo revisor de siete puntos en full, su modelo se elige igual, porque incluye la lente de dominio; en lite y en el revisor del patch, Sonnet, aunque la spec o el patch toquen roles
- AND si la petición o el prompt de arranque dicen «revisor de dominio en Opus», lo aplica
- AND cada despacho lleva `subagent_type: sdd-kit:effort-medium` y el modelo elegido; el revisor técnico, siempre `model: sonnet`
- REMOVED WHEN el agente pregunta la review
- REMOVED THEN las opciones llevan el modelo del revisor de dominio, y la recomendada es Opus porque la spec toca roles; para «renombrar una columna del listado», la recomendada es Sonnet
- REMOVED AND si la petición o el prompt de arranque dicen «revisor de dominio en Opus», no lo pregunta y lo aplica
- REMOVED AND sin esa pregunta (spec aprobada por delegación, `unattended`), el revisor de dominio va en Sonnet

#### MODIFIED — Una feature grande devuelve el diseño por secciones antes de la spec (antes: "valen en `pair` y en `delegate`")

- GIVEN la feature 0012 en `pair`, con 5 tasks previstas en el recuento del paso 2 y la entrevista cerrada
- WHEN el agente va a escribir `spec.md`
- THEN antes dice los enfoques en un mensaje propio —dos o tres maneras de construirlo, con lo que cuesta cada una y la que recomienda— y, elegido uno, presenta el diseño por secciones, una por mensaje, y pregunta «¿va bien?» tras cada una
- AND lo que el usuario corrige en una sección entra en la spec antes de escribirla
- AND lo que el agente rellenó sin que el usuario lo dijera va en la sección como su propuesta, con su motivo
- AND el recuento es el de la feature que se especifica, hecho al entrar en el paso de spec: un lite o un patch que suben a full cuentan ahí, y tras partir cuenta la pieza
- AND con 2 tasks previstas, en lite o en spike, escribe la spec sin secciones y la presenta en el gate
- AND en `delegate`, el mensaje de los enfoques dice cuál sigue sin esperar respuesta, y las secciones van a «✋ Decisiones que he tomado yo»: la parada de la spec las aprueba, sin un turno por sección
- AND con la spec aprobada por delegación o en `unattended` no presenta secciones: lo que habría preguntado va a «✋ Decisiones que he tomado yo»; si el usuario pide empezar ya, tampoco
- AND cada sección abre con lo que cambia para quien usa el producto, con un ejemplo con datos («`informes --sala Norte` enseña las cuatro vistas solo de Norte»), y la pregunta es sobre eso; un nombre de código (`active`, `rooms`, `src/app.js`) no abre ninguna sección y, si hace falta, va detrás
- REMOVED GIVEN la feature 0012 en `delegate`, con 5 tasks previstas en el recuento del paso 2 y la entrevista cerrada
- REMOVED THEN antes presenta el diseño por secciones, una por mensaje, y pregunta «¿va bien?» tras cada una
- REMOVED AND las secciones son turnos de la entrevista dentro de la parada de la spec, no una parada nueva del perfil: valen en `pair` y en `delegate`

#### MODIFIED — La spec se repasa antes del gate (antes: "busca su nombre en `capabilities/`, en los documentos del proyecto y, en un kit de skills, en `skills/`")

- GIVEN una spec redactada en la que un mismo literal (una expresión, un fichero, un umbral) aparece en una decisión y en un escenario que se contradicen
- WHEN el agente termina el paso 4, con o sin review de spec
- THEN corrige la contradicción, o la señala, antes de pedir la aprobación
- AND para cada `MODIFIED` busca en el código dónde se implementa lo que cambia y lista en el Scope cada fichero que lo implementa, o dice por qué queda fuera: con «Búsqueda por cliente» en `src/search.js` y en `src/phone.js` y un Scope que solo nombra el primero, el Scope pasa a nombrar los dos
- AND lo que cambió aparece en «Decisiones que he tomado yo»
- AND si la spec retira algo o cambia la forma o el sitio de un documento (un literal de plantilla incluido: una etiqueta, un encabezado, una línea fija), busca en todo el repo con `git grep`, salvo las carpetas de evidencia, cada forma del literal —la cadena y su valor suelto—, y escribe cada resultado en «Lo que se retira o cambia de forma», con su destino: el delta, el Scope o una decisión con su motivo; con `"base": "."` pasado a `"./out"` en `config.json`, el `toBe('.')` de `test/config.test.js` sale en esa sección, aunque no esté en `capabilities/`, en los documentos ni en `skills/`
- AND con la etiqueta `- Real:` pasada a `- Esfuerzo real:` en `patch-template.md` y dos requisitos de `estimation` que la nombran, los dos van al delta como `MODIFIED`
- AND cada caso real que la spec cita (un `fichero:línea`, un sha) se pasa por el THEN que lo debe atrapar: con un THEN que solo rechaza importes negativos y un caso citado, `src/invoice.js:42`, que es un importe cero, el agente cambia el THEN o lo señala antes del gate
- AND al retirar algo con pasos numerados busca también esos pasos: con una skill retirada cuyo «paso 3» citan dos requisitos sin nombrarla, los dos salen en esa sección con su destino
- AND la misma sección lleva cada id de fila que la spec implementa con los ficheros que la nombran («la define la 0009» en `docs/config.md` → Scope), o «nada: comprobado con `git grep -n 0009`», y no se borra con los bloques de ayuda
- AND antes del gate ejecuta `sdd capability merge --path <copia> --artifact <spec.md>` sobre una copia de `.docs/sdd` fuera del repo, corrige en la spec lo que rechace y escribe la línea del resultado en «Decisiones que he tomado yo»; la `capabilities/` del repo no cambia
- REMOVED AND si la spec retira algo o cambia la forma o el sitio de un documento (un literal de plantilla incluido: una etiqueta, un encabezado, una línea fija), busca su nombre en `capabilities/`, en los documentos del proyecto y, en un kit de skills, en `skills/`, y escribe cada resultado en «Lo que se retira o cambia de forma», con su destino: el delta, el Scope o una decisión con su motivo; con la etiqueta `- Real:` pasada a `- Esfuerzo real:` en `patch-template.md` y dos requisitos de `estimation` que la nombran, los dos van al delta como `MODIFIED`
- REMOVED AND la misma sección lleva cada id de fila que la spec implementa con los ficheros que la nombran («la define la 0009» en `docs/config.md` → Scope), o «nada: comprobado con `grep -rn 0009 capabilities/ skills/`», y no se borra con los bloques de ayuda

#### MODIFIED — Un patch sigue en `sdd-implement`, con verificación y sin revisión final (antes: "no se despacha ningún eje de la revisión final")

- GIVEN el patch 0031, confirmado en `sdd-propose`: si cancelo Norte el martes, que no tengo reservado, me quita la del lunes
- WHEN `sdd-propose` lo entrega
- THEN invoca `sdd-implement`, que lee lo primero `references/patch-flow.md` y sigue su flujo: causa raíz, `patch.md`, fix mínimo y commit; ni el Setup ni los bucles de tasks aplican
- AND antes de decir que está arreglado, §4 de `patch.md` lleva el comando del test y su salida leída en esta sesión, como dice la «Gate Function» de `sdd-verify`
- AND antes del commit del fix, un revisor en Sonnet lee `patch.md` y el diff —la causa raíz, el arreglo y su test— y §4 responde cada hallazgo: arreglado, o rechazado con su motivo
- AND no se despacha ningún eje de la revisión final, y sigue en `sdd-archive`

#### MODIFIED — Dos revisores de spec se despachan con `sdd-parallel-agents` (antes: "con 4 señales, review de dos revisores aceptada")

- GIVEN la spec de permisos por rol del gestor de cobros, con dos revisores por la rúbrica y `control.maxParallelAgents: 3`
- WHEN el agente despacha la review
- THEN invoca `sdd-parallel-agents` y despacha los dos revisores en la misma respuesta, cada uno con su lente
- AND cada despacho lleva `model` y `subagent_type: sdd-kit:effort-medium`, como dice «El revisor de spec se despacha con su effort»
- AND nunca hay a la vez más agentes que `control.maxParallelAgents` (3 si falta); con más, se despachan por tandas
- AND dos tasks independientes del plan no se despachan con `sdd-parallel-agents`: las ejecuta `sdd-implement` una detrás de otra
- REMOVED GIVEN la spec de permisos por rol del gestor de cobros, con 4 señales, review de dos revisores aceptada y `control.maxParallelAgents: 3`

#### MODIFIED — La política de modelos de la spec vale como confirmación de paralelizar (antes: "revisores de la spec ninguno")

- GIVEN una feature en `delegate`, con la spec aprobada y la línea `Política de modelos: revisores de la spec dominio opus + técnica sonnet · ejes de la revisión final Spec opus+high, Código sonnet+high · en paralelo hasta control.maxParallelAgents`, y unas instrucciones del usuario que piden confirmar antes de paralelizar
- WHEN el hilo va a despachar los ejes de la revisión final con `sdd-parallel-agents`
- THEN los despacha en la misma respuesta sin preguntar, porque la aprobación de la spec fue esa confirmación
- AND un modelo o un despacho que la línea no nombra se confirma como piden las instrucciones
- AND en `delegate` la spec sin esa línea no pasa el repaso de coherencia
- REMOVED GIVEN una feature en `delegate`, con la spec aprobada y la línea `Política de modelos: revisores de la spec ninguno · ejes de la revisión final Spec opus+high, Código sonnet+high · en paralelo hasta control.maxParallelAgents`, y unas instrucciones del usuario que piden confirmar antes de paralelizar

#### Reglas de la capacidad — feature-flow

- **Límites**: detector en dos viewports (por defecto `1280x800` y `390x844`), sin tope de rondas; como máximo 3 rondas de arreglo de composición; la sesión se rehace una vez por ejecución; el diseño por secciones, desde 4 tasks previstas, con secciones de unas frases a ~250 palabras; el tope de palabras propuesto en una spec es lo medido más lo previsto más un 2 %, con un mínimo de 20 palabras; la review de spec, dos revisores en full, uno con un Scope de menos de ~50 líneas sin contrato público ni `MODIFIED`, uno en lite y uno en patch; la segunda ronda, una sola vez.

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-propose` (`SKILL.md`) | 5.301 / 5.250 (6.562 con el margen del 25 % de hoy) | 1.261 con el margen | sin cambio: baja a ~3.200 |
| `sdd-propose` (total) | 13.887 / 14.200 | 313 | sin cambio: la traducción acorta lo que suben las tres references nuevas |
| `sdd-implement` (total, por `patch-flow.md`) | medido al implementar | — | sin cambio: dos frases sustituidas |

## Previsión de coste

Precio por sujeto: 0,36 $, el medido en la batería de `sdd-propose` en la 0281 (10,54 $ en 29 sujetos Sonnet, walkthrough de la 0281); un sujeto de patch que llega al commit, ~0,70 $ (`tech-stack.md`, «Entrega de la skill al sujeto»); uno de `using-sdd`, 0,15 $ (0116).

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 0: estructural, leído con fichero y línea (decisión 15) | 0 |
| GREEN | 10 escenarios × 2 (`sdd-propose`): 18 a 0,36 $ y `pr1` × 2 a 0,70 $ | 7,88 |
| Una tanda de REFACTOR | los mismos 20 | 7,88 |
| Controles | batería entera de `sdd-propose` sin los nuevos, ~99 sujetos a 0,36 $; 12 de `using-sdd` a 0,15 $; `s1` de `sdd-verify` × 1 a 0,70 $ | 38,14 |
| Medición tras la revisión final | 1 sujeto de control por escenario afectado, ~10 a 0,36 $ | 3,60 |
| Suma | | 57,50 |

Sin los sujetos: los dos revisores de esta spec (~2,5 $) y la segunda ronda, si la hay (~0,5 $). El mínimo defendible: controles solo de los tramos cuyos pasos pierden texto (`ceremony`, `config`, `control`, `gate`, `sections`, `coherence*`, `spec-review`, `plan*`), ~70 sujetos, ~25 $ de controles y ~45 $ en total; deja sin medir `ids`, `setup`, `adr`, `estimate` y `debugging`, que la batería de antes del corte de la 3.0.0 (0311) mide igual.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-05 | aprobada (opción «Apruebo») |
