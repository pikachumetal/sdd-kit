---
id: 20261105-161645-feature-0306-propose-rework
title: Tasks — sdd-propose rehecha, con sus references/ como copia o propia
spec: ./spec.md
plan: ./plan.md
created: 2026-11-05
---

# Tasks — sdd-propose rehecha, con sus references/ como copia o propia (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0306-propose-rework`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`). Una task cerrada que cambia por una enmienda no se reabre: lleva en «Notas» `afectada por enmienda <fecha> → Task N`, y la Task N nueva hace el trabajo; si la enmienda solo cambia la task en curso, sigue en ella con la nota.

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | La rúbrica de review en inglés, con dos revisores por defecto, el de lite y patch, y la segunda ronda | done | 8f6357c1 | afectada por enmienda 2026-11-05 → Task 6 |
| 2 | `spec-writing.md` y `plan-writing.md` propias, con las frases de `brainstorming` 7.0.2 y las secciones al ✋ en `delegate` | done | e285544c | afectada por enmienda 2026-11-05 → Task 6 |
| 3 | `control-profiles.md`, `modo-lite.md` y `nombrado.md` en inglés | done | 5a688d75 | |
| 4 | `SKILL.md` por debajo de 20.000 bytes, con el repaso de coherencia nuevo | done | b783a4f5 | con lo de la enmienda 2026-11-05 que cae en sus ficheros |
| 5 | Batería entera de control, REFACTOR y evidencia | done | 99eedb9a | REFACTOR del idioma en el Overview del `SKILL.md`; fixtures de `rv2` y `lr1` rehechas |
| 6 | Task 6 — enmienda 2026-11-05: los recuentos del repaso y los enfoques al ✋ en `delegate` | done | 55360eb7 | |

## Verificación por task

- [x] Task 1 — los comandos de su campo «Verificación» del plan
- [x] Task 2 — los comandos de su campo «Verificación» del plan
- [x] Task 3 — los comandos de su campo «Verificación» del plan
- [x] Task 4 — los comandos de su campo «Verificación» del plan
- [x] Task 5 — los comandos de su campo «Verificación» del plan, más la lenta

Revisión final: Spec opus+high, with fixes (3 Important, 10 Minor) · Código sonnet+high, with fixes (1 Important, 6 Minor) · Arquitectura no (plan), sobre 99eedb9a
Pasada de fix: juntada en el cierre, 11 hallazgos (4 Important con su comprobación RED→GREEN estructural o de batería recalculada; 7 Minor), y la enmienda 2026-11-06 aplicada
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, todos los Important resueltos; 5 Minor abiertos, arreglados después
revisado en el hilo: juntado en el cierre · battery.md, spec.md, SKILL.md · 21 líneas

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| spec-template.md:42 decía «(modo full; …)» para la propuesta de review (revisión final, eje Código) | la rúbrica nueva revisa también lite y la plantilla es de sdd-templates, fuera del Scope | «(modos full y lite; …)» | (pasada de fix) |

## Rulings

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
