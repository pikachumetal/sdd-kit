---
id: 20261105-161645-feature-0306-propose-rework
feature: 0306
title: Walkthrough — sdd-propose rehecha, con sus references/ como copia o propia
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-06
---

# Walkthrough — sdd-propose rehecha, con sus references/ como copia o propia

## 1. Cambios realizados

- **Rúbrica de review** (`skills/sdd-propose/references/review-spec.md`, en inglés): decide cuántos revisores, no si hay review. Dos en full; uno con un Scope pequeño sin contrato ni `MODIFIED`; uno en Sonnet en lite; una segunda ronda en Sonnet tras un Crítico aceptado o la decisión central reescrita. El patch despacha un revisor Sonnet antes del commit del fix (`skills/sdd-implement/references/patch-flow.md`). Task 1, `8f6357c1`; ADR 0024.
- **`spec-writing.md` y `plan-writing.md` propias** (`concept` de superpowers `brainstorming` y `writing-plans` 7.0.2 en `upstream.json`; `skills/sdd-propose/NOTICE` borrado). Los enfoques van en un mensaje propio en `pair` y al ✋ en `delegate`; lo rellenado va como propuesta con su motivo. Task 2, `e285544c`, y enmienda del 2026-11-05 en la Task 6, `55360eb7`.
- **`control-profiles.md`, `modo-lite.md` y `nombrado.md` en inglés**, con anclas nuevas (`#silence-watch`, `#field-validation`, `#who-validates`, `#sdd-kitjson-keys`) y los enlaces de `sdd-config`, `sdd-implement`, `sdd-verify`, `sdd-archive` y `CLAUDE.md` cambiados. Task 3, `5a688d75`.
- **`SKILL.md` por debajo de 20.000 bytes**: de 33.332 a 19.949. Bajan a `references/` el carril config (`config-lane.md`), el árbol del patch (`patch-lane.md`) y el repaso de coherencia (`coherence-pass.md`, con `git grep` en todo el repo, cada forma del literal, cada caso real contra su THEN y cada recuento). Task 4, `b783a4f5`.
- **Batería de `sdd-propose`**: escenarios `rv1`, `rv2`, `rv3`, `lr1`, `rr1`, `pr1`, `pb-p`, `co7` y `co8`, filas NR, NR-B y PR1-A, y la procedencia de las reglas movidas. Task 5, `99eedb9a`, y REFACTOR del idioma en el Overview del `SKILL.md`.
- **Revisión final y enmienda del 2026-11-06**: pasada de fix, la enmienda de la decisión 17 (tres textos salen como duplicados y dos se sustituyen en su paso) y los Minor de la re-revisión, juntados en el commit de cierre.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 4 h
- Esfuerzo real: 16,05 h — reloj de la sesión 20,82 h desde 2026-11-05T16:08Z, sin 287 min de espera al dev-lead (14 esperas)
- Desviación: +12,05 h (+301 %)
- Causa de la desviación: 287 min de las 14 esperas de `Esperas y huecos` (la mayor, 82 min a las 19:03Z), ya fuera del esfuerzo; el reloj incluye además el corte de la sesión de la noche (de ~22:26Z, cuando se cortó la batería de control, a ~09:22Z), que la línea no cuenta como hueco: sin medir con la herramienta, unas 11 h. El resto, sin medir por tramos: la batería entera de control (~60 min de sujetos y su lectura) y la revisión final con su enmienda.
- Compactación: sí, en la Task 5 → Native (no quedaba ninguna después)
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 152.871.559 — claude-opus-5-5 152.871.559
- Tokens de subagentes: 40.922.304 en 14 despachos — Final review — Code axis claude-sonnet-5-5 8.241.014 / 6 min; Review enmienda 0306 — segunda ronda claude-sonnet-5-5 813.515 / 2 min; Leer prosa, tercio A claude-sonnet-5-5 5.009.669 / 4 min; Revisor de spec: técnica claude-sonnet-5-5 1.510.265 / 2 min; Leer prosa, tercio C claude-sonnet-5-5 6.269.817 / 5 min; Revisor de spec: dominio claude-opus-5-5 398.885 / 1 min; Re-review final 0306 claude-opus-5-5 1.435.557 / 3 min; Review enmienda 0306 — dominio claude-opus-5-5 1.629.731 / 3 min; Revisor enmienda 0306: técnica claude-sonnet-5-5 537.739 / 1 min; Final review — Spec axis claude-opus-5-5 9.588.424 / 10 min; Segunda ronda enmienda 0306 claude-sonnet-5-5 429.202 / 1 min; Revisor enmienda 0306: dominio claude-opus-5-5 346.146 / 1 min; Review enmienda 0306 — técnica claude-sonnet-5-5 574.687 / 1 min; Leer prosa, tercio B claude-sonnet-5-5 4.137.653 / 4 min
- Coste de la sesión: 64,38 $ (hilo 47,04 $ + subagentes 17,34 $)
- Coste de sujetos: 107,44 $ en 171 sujetos sonnet — control 71,43 $; green-t24 10,61 $; refactor-l 10,11 $; green-t1 7,10 $; refactor2-t4 2,35 $; refactor-t4 2,26 $; control-fix 1,86 $; control-using 1,49 $; control-verify 0,24 $
- Review de spec: 2 revisores · hallazgos de la spec y de sus tres enmiendas en la spec, todos respondidos (aceptados salvo el Crítico de la segunda ronda del 2026-11-06, rechazado en parte)

## 3. Desviaciones del plan

- La previsión de sujetos (57,50 $) se quedó corta: el dev-lead la amplió dos veces en la Task 5 (2026-11-06, «2» a la batería entera con 2 sujetos y «1» al REFACTOR del idioma). Precio real: ~0,57 $ por sujeto en la batería entera, ~1 $ en los escenarios con revisores.
- Tres enmiendas de la spec: dos del 2026-11-05 (los recuentos del repaso y los enfoques al ✋ en `delegate`, Task 6) y una del 2026-11-06 (decisión 17), cada una revisada por dominio y técnica y aprobada en su parada.
- Las fixtures de `rv2` y `lr1` se rehicieron en la Task 5: el repaso de coherencia nuevo las paraba antes de la review.
- La medición tras la revisión final no corrió: sin presupuesto, y la pasada de fix devuelve sobre todo frases de `develop`.

### Decisiones tomadas sin el dev-lead

- Task 1: Ruling: `rv3` pasa la instrucción «Antes de paralelizar subagentes, pide confirmación con el modelo de cada uno» por `APPEND_SYSTEM` y no por el `CLAUDE.md` del molde — `tests/headless/lib.mjs:427-433` lanza con `--setting-sources ''`, así que el `CLAUDE.md` del molde no llega — si es erróneo: un escenario que no mide la pregunta, visible en su `texts.txt`.
- Task 1: Ruling: la frase del paso 4 de SKILL.md «Spec review level *(full mode)*» pasa en esta task a «Spec review *(full and lite)* … it decides how many reviewers», y no en la Task 4 — sin ella, lr1 no llega a review-spec.md y su GREEN mediría la Task 4 — si es erróneo: la Task 4 la reescribe igual.
- Task 2: Ruling: kit:own da nueva la repetición «reason weighs four factors by name with no numeric threshold» entre plan-writing.md:33 y sdd-implement/SKILL.md:26, porque plan-writing.md pasa a propia — es una frase repetida con la skill de otra fila (0296), que la spec deja a la 0311 — si es erróneo: una línea más de kit:own en el cierre de la 3.0.0.
- Task 3: Ruling: traducidas, control-profiles.md y nombrado.md pasan a compararse en inglés con sdd-implement, sdd-archive y sdd-verify, y kit:own da 9 repeticiones nuevas con skills de otras filas (0296, 0305, 0307) — van a la 0311, como dice el Scope; se cuentan en el ticket — si es erróneo: la 0311 tiene 17 frases en vez de 8.
- Task 3: Ruling: el ancla de review-spec.md:53 (#silence-watch) va en el commit de la Task 1, que reescribe ese fichero entero — si es erróneo: ninguno, es una palabra.
- Task 1: Ruling: la fila PR1 de battery.md decía «A antes de B» al revés — battery.mjs falla si A va antes de B — corregida a «git commit antes de Agent»; veredicto recalculado sin sujetos: pr1 2/2 — si es erróneo: un verde falso en pr1, visible en sus tools.txt.
- Task 1: Ruling: rv1 1/2 y rr1 1/2 se repiten en la tanda de REFACTOR con el kit de las Tasks 2-4 (rv1-1 leyó el control-profiles.md viejo; rr1-2 necesita la segunda ronda en el paso 4) — si es erróneo: la Task 4 cierra con dos escenarios sin verde, que la Task 5 ve.
- Task 1: Ruling: el trabajo de las Tasks 2-4 se escribió mientras corría el GREEN de la Task 1; cada task se commitea por rutas, y SKILL.md (su línea de la Task 1 incluida) y dist/ van en el commit de la Task 4 — si es erróneo: commits intermedios con dist/ por detrás de skills/, que el pre-commit no ve porque mira el disco.
- Task 2: Ruling: spec-writing.md y plan-writing.md van en el commit de la Task 2 con lo que reciben del SKILL.md en la Task 4 (§Frontend, Se valida en:, la capacidad nueva, el gate del plan en pair y el gate de cierre); los escenarios pb y pb-p van en el commit de la Task 4, con battery.md — si es erróneo: entre los dos commits esas reglas están en dos sitios.
- Task 3: Ruling: nombrado.md va en el commit de la Task 3 con las red flags de ids que recibe del SKILL.md en la Task 4 — si es erróneo: entre los dos commits esas red flags están en dos sitios.
- Task 4: Ruling: REFACTOR 1 de los enfoques — pb-2 y pb-p-1 pasaron a las secciones sin el mensaje de enfoques porque la petición traía «decidido con el dev-lead»; la frase de spec-writing.md que lo decide dice que eso fija el qué y no el cómo, y «Design by sections» empieza tras ese mensaje — si es erróneo: la tanda de REFACTOR sigue en rojo y lo decide el dev-lead (Art. I).
- Task 4: Ruling: REFACTOR 2 de los enfoques — en delegate, pb salta el mensaje de enfoques 2 de 2 con la regla solo en spec-writing.md; sube al paso 4 del SKILL.md, y para caber salen la racionalización «Try it quickly» y la red flag del alcance elegido, que dicen lo mismo que el paso 2 y el gate — si es erróneo: un control de explore o del gate en rojo en la Task 5.
- Task 4: Ruling: las dos enmiendas del 2026-11-05, aprobadas (opción «Apruebo las dos»), tocan ficheros de tasks cerradas (review-spec.md y upstream.json de la Task 1-2, spec-writing.md de la Task 2): van a una Task 6 nueva, Tras: Task 4, que se ejecuta antes de la Task 5 para que la batería entera de control mida el texto final; lo que cae en ficheros de la Task 4 en curso (SKILL.md, coherence-pass.md, battery.md) va en su commit — si es erróneo: la Task 5 mediría texto sin enmendar.
- Task 5: Ruling: coste por sujeto medido ~0,57 $, no los 0,36 $ de la 0281 — la batería entera con 2 sujetos sube el total a ~94 $; el dev-lead elige la opción 2 (2026-11-06, «2»), COST_CAP=96 — si es erróneo: ninguno, es la decisión de dinero del dev-lead (Art. I).
- Task 5: Ruling: la primera tanda se cortó al cerrarse la sesión (35 sujetos guardados); se reanuda con un lanzador del scratchpad que llama a runCampaign sin refuseSavedLabels, y runCampaign salta las etiquetas guardadas — si es erróneo: un sujeto repetido, visible por su etiqueta.
- Task 5: Ruling: c1-1 sale rojo por el medidor — la petición es el slash /sdd-kit:sdd-propose, que el harness expande sin llamada a Skill, y firstSkill da sdd-kit:sdd-grilling; leída la fila C1, el sujeto toma la fila 0010 de la rama como enunciado: pasa — si es erróneo: un rojo real de Gate 1 tapado, visible en c1-1.texts.txt.
- Task 5: Ruling: rv2-2 y lr1-1 rojos por fixture — el repaso de coherencia nuevo (git grep, merge sobre copia) vio que spec-0018-small.md apuntaba a docs/guia.md, la capacidad guide y la fila 0018, que el molde no tiene, y que spec-0019-lite.md cambiaba la firma de libres y suponía un responsable de sala inexistente; el sujeto paró, que es lo correcto. Fixtures rehechas (0018: guía y fila montadas en subject.mjs, guide en Nuevas; 0019: libres sin franja, carpeta free-without-slot, rooms en Nuevas), merge verde sobre copia del molde, y rv2 y lr1 repetidos en PHASE=control-fix (dev-lead, 2026-11-06, «1») — si es erróneo: un rojo real de la rúbrica de review tapado, visible en control/out/rv2-2 y lr1-1.
- Task 5: Ruling: L Idioma rojo de esta feature (7 de 160 sujetos con líneas de transición en inglés; 0 de ~700 en las campañas anteriores desde el 31 de octubre) — REFACTOR de la frase del Overview de SKILL.md («skill announcements and the one-line notes between tool calls included, also while the reference you follow is in English»), sustituida en su sitio (Art. IX), 19.671 bytes; repetidos h1 pl2 g1b co6 f1 y v1 (dev-lead, 2026-11-06, «1») — si es erróneo: la deriva sigue y la ve la 0311.
- Task 5: Ruling: co6 2/2 pese al lector — listar «El resumen va al final» al renumerar no es la confusión de CO6 (precedente de la 0281); sin atribuir y al ticket: k3-1, p1-2, l1, pl2-1, adr-c-1, co2-1, f1-2 — si es erróneo: un rojo de esta feature sin REFACTOR, visible en control/out.
- Task 5: Ruling: la fixture nueva de lr1 lleva una regla de negocio y no un rol, que la línea del Review Focus nombra — el molde no tiene roles y un rol inventado hace que el repaso de coherencia pare antes de la review (lr1-1 de control); review-spec.md pide Opus con «business rules, roles or the flow», así que la regla mide la misma frase — si es erróneo: la combinación lite + rol queda sin escenario propio.
- Final: Ruling: rv1 lleva la spec-0011-review.md de 4 señales y ~60 líneas, no la de 2 señales y ~120 líneas que describe la spec — el caso de pocas señales en full se ve en g1 y g1b (dos señales, dos revisores, 4 de 4) — si es erróneo: un escenario más para la 0311.
- Final: Ruling: config-lane.md y coherence-pass.md dicen «run as sdd-propose's SKILL.md runs the CLI» — el paso 1 del SKILL.md trae la forma entera (`node ".../cli/bin/sdd.js" capability index`) y sp1 y k5 la usan — si es erróneo: un sujeto que escribe `sdd` a secas.
- Final: Ruling: el encargo de review-spec.md añade «in the user's language» — es la regla del Overview, que vale para el informe del revisor que lee el usuario — si es erróneo: ninguno.
- Final: Ruling: .docs/sdd/capabilities/verification.md:33 nombra «Vigía de silencio» — es el nombre del concepto en castellano de una capacidad en castellano, no el título literal; el enlace es de las skills, que sí cambian a «Silence watch» — si es erróneo: un lector que busca el título en castellano en control-profiles.md.
- Final: Ruling: g1 y g1b despachan revisores — la petición «sin review» describe el estado de la fixture y la rúbrica nueva no admite «sin review» en full sin la frase del dev-lead; «sin review» lo miden NR y NR-B — si es erróneo: g1 cuesta ~4 agentes más por tanda.
- Final: Ruling: enmienda 2026-11-06 de la decisión 17, aprobada (dev-lead, «1», opción «Apruebo») tras dos revisores (dominio Opus, técnica Sonnet) y segunda ronda Sonnet — tres textos salen como duplicados y dos se sustituyen en la frase de su paso; SKILL.md 19.950 bytes; «pruébalo rápido» sin medir en esta batería — si es erróneo: la 0311 lo mide.

## 4. Verificación

### 4.1 Builds

- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 400/400 · cli:typecheck: corrió sin errores · cli:test: corrió 2237/2249 (12 saltados) · 1 min 43 s · configuración: la del gate · sobre el commit de cierre (el árbol de la pasada, con solo `tasks.md` sin commitear)
- `moon run kit:build kit:skill-size`: `sdd-propose` sin FALLA (19.949 bytes); las FALLA de `sdd-archive`, `sdd-implement`, `sdd-roadmap` y `sdd-verify` son de otras filas.
- `moon run kit:copies`: ninguna línea «→ 0306». `moon run kit:own`: 13 líneas en `skills/sdd-propose/`, todas repetidas con la skill de otra fila (van a la 0311).
- `sdd capability merge` y `sdd capability check` sobre `.docs/sdd`: 8 requisitos sustituidos y la regla «Límites»; «Capacidades válidas: 23». `sdd decision check`: «Decisiones válidas».

### 4.2 Smoke / tests

- Validación en campo: 2026-11-06 · suite 2237/2249 y 400/400 · batería de control con el kit final (107 sujetos de `sdd-propose`, 10 de `using-sdd`, 2 de `sdd-verify`) y REFACTOR del idioma 10/10 · revisión final Spec y Código sobre `99eedb9a`, pasada de fix y re-revisión con los Important resueltos, Minor arreglados y revisados en el hilo · no probado: «pruébalo rápido» en `sdd-propose` y la medición tras la revisión final

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| La rúbrica da dos revisores en full sin preguntar; uno con Scope pequeño; uno en Sonnet en lite; uno con paralelismo restringido y spec delegada; pregunta con modelos y coste sin delegar | ejecución real: `rv1`, `rv2`, `lr1`, `rv3` (batería, `green-t24/`, `control-fix/`) | 2/2 cada uno |
| Spike y config sin review; «sin review» del dev-lead se aplica y se registra | ejecución real: `k1`, `k2`, `s1` (filas NR y NR-B sobre `control/`) | 2/2 |
| Cada hallazgo entra en la spec; segunda ronda tras un Crítico aceptado | ejecución real: `rr1` (`green-t24/`) | 2/2 |
| El revisor de dominio en Opus con reglas o roles; Sonnet en lite y patch; `sdd-kit:effort-medium` | ejecución real: `rv1` (`model=opus`), `lr1` (sin Opus), `pr1` | 2/2 |
| Los enfoques en un mensaje propio en `pair`; al ✋ en `delegate`; secciones con ejemplo con datos | ejecución real: `pb-p` y `pb` (`control/`) | 2/2 |
| El repaso de coherencia: cada `MODIFIED`, lo retirado con `git grep`, cada caso real contra su THEN, cada recuento, `capability merge` sobre copia | ejecución real: `co7`, `co8` (`green-t24/`), `co1`-`co6`, `sp1`, `t1` (`control/`) | 2/2 (co1, co2, co3, co5: 1/1) |
| El patch sigue en `sdd-implement` con un revisor Sonnet antes del commit del fix | ejecución real: `pr1` (filas PR1, PR1-A, PR1-B, PR1-C) | 2/2 |
| Dos revisores con `sdd-parallel-agents`; la política de modelos confirma | ejecución real: `sr1`, `sp1` (`control/`) | 1/1 y 2/2 |
| Límites: `SKILL.md` por debajo de 20.000 bytes | suite: `kit:skill-size` | 19.949 bytes |

### 4.3 Residuales / deuda generada

- Siete fallos de control sin atribuir (un sujeto cada uno; `l1`, los dos): `k3-1` (K1), `p1-2` (P3), `l1` (L1), `pl2` (PL2, la fixture no guarda dueño de reserva), `adr-c-1` (ADR-C), `co2-1` (CO2) y `f1-2` (F1-C) → ticket, para la 0311.
- `battery.mjs run` no reanuda una tanda cortada: rechaza las etiquetas guardadas, y `runCampaign` las salta → ticket.
- `firstSkill` del medidor da rojo con una petición slash, que el harness expande sin llamar a `Skill` (`c1`) → ticket.
- 9 repeticiones nuevas de `kit:own` con skills de otras filas, por la traducción → la 0311, como dice el Scope.

## 5. Aprendizajes

- Un sujeto de `sdd-propose` cuesta ~0,57 $ de media en la batería entera, y ~1 $ en los escenarios que despachan revisores o hacen la entrevista entera; la previsión con los 0,36 $ de la 0281 se quedó a la mitad → `tech-stack.md` («Entrega de la skill al sujeto»).
- Las fixtures de una batería pasan el repaso de coherencia antes de gastar sujetos: con `git grep` y `capability merge` sobre una copia del molde, dos fixtures que apuntaban a lo que el molde no tiene dieron dos rojos → `tech-stack.md` («Sujetos headless»).
- Con las references en inglés, el sujeto suelta líneas de transición en inglés (7 de 160; 0 de ~700 antes) → la frase de idioma del Overview de `skills/sdd-propose/SKILL.md` y la procedencia de `tests/batteries/sdd-propose/battery.md`.

Retro: documento o skill desmentido → la previsión de sujetos de la spec usaba los 0,36 $ por sujeto de la 0281 y la batería entera salió a ~0,57 $: el precio medido de `sdd-propose` queda junto al de `sdd-archive` (`.docs/sdd/tech-stack.md`)
Retro: error que cazaría un chequeo → ticket del kit: `tests/headless/battery.mjs` da rojo a `c1` porque `firstSkill` busca `>>> Skill:` y una petición slash carga la skill sin esa llamada; el veredicto no mide lo que el escenario pide
Retro: error que cazaría un chequeo → ticket del kit: `battery.mjs run` rechaza las etiquetas ya guardadas, así que una tanda cortada al cerrarse la sesión no se reanuda sin un lanzador a mano que llame a `runCampaign`

## 6. Adendas
