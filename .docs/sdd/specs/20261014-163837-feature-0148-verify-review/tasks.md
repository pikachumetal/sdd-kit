---
id: 20261014-163837-feature-0148-verify-review
title: Tasks — verify: sdd-verify, revisión final en tres ejes con un solo cierre
spec: ./spec.md
plan: ./plan.md
created: 2026-10-14
---

# Tasks — verify: `sdd-verify`, revisión final en tres ejes con un solo cierre (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0148-verify-review`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`). Una task cerrada que cambia por una enmienda no se reabre: lleva en «Notas» `afectada por enmienda <fecha> → Task N`, y la Task N nueva hace el trabajo; si la enmienda solo cambia la task en curso, sigue en ella con la nota.

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | `sdd-verify` nace: la evidencia antes de afirmar | done | 02afa007 | |
| 2 | La revisión final sale por ejes, y el plan declara el eje Arquitectura | done | 649f1a99 | dos rondas de REFACTOR en `f2` |
| 3 | Los encargos de los tres ejes | done | baad233e | una ronda de REFACTOR en `f4` |
| 4 | El cierre único de la revisión | done | 1d89f543 | enmienda 2026-10-14 (formato 2.x); una ronda de REFACTOR en `c1` y `c2` |
| 5 | El revisor de la spec, la ADR, la constitution y los humos | done | 0bf5e6d1 | el punto del revisor de la spec no se escribe: RED limpio en `s1` y `s1b` (Art. I) |

## Verificación por task

- [x] Task 1 — Pester (`VerifySkill`, `WordBudget`, `Skills`, `ImplementSkill`) y `v1`
- [x] Task 2 — Pester (los que leen `encargo-revision.md`, `SessionModel`, `ImplementSkill`, `WordBudget`, `Skills`), `f1`, `f2` y `p`
- [x] Task 3 — Pester (`VerifySkill`, `WordBudget`, `Skills`), `f3` y `f4`
- [x] Task 4 — Pester (`VerifySkill`, `WordBudget`, `Skills`, `ClosingOffCriticalPath`, `SilenceWatch`) y `c1`-`c5`
- [x] Task 5 — Pester, `decision check`, `s1`, `h1` y `h2`

Revisión final: Spec opus+high, 4 Important, 10 Minor, 5 sin verificar · Código sonnet+high, 3 Important, 8 Minor · Arquitectura opus+high, 3 Important, 9 Minor (subido: `skills/sdd-verify/` es un módulo nuevo y `Revisión final:` un contrato entre skills), sobre 0bf5e6d

Pasada de fix: juntada en el cierre, 8 hallazgos RED→GREEN

Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 9/9 resueltos, 3 Minor adjudicados

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Task 4: Ruling: README.md entra en los ficheros de la Task 4 — `Skills.Tests.ps1` exige que su lista de `superpowers:*` coincida con las skills, y la Task 4 quita `superpowers:requesting-code-review` — coste si se equivoca: ninguno, el Pester lo caza.
- Task 1: Ruling: la batería de sdd-verify reutiliza el molde y las fixtures de sdd-implement (IMPL=../sdd-implement) en vez de copiarlos — un solo molde para la app de reservas — coste si se equivoca: un cambio del molde de sdd-implement mueve también esta batería.
- Task 1: Ruling: v1 entra por sdd-implement («Invoca la skill sdd-kit:sdd-implement y sigue»), como t2 y k1 de su batería, no por el paso 6 de sdd-start-feature — el traspaso ya lo mide la batería de sdd-implement — coste si se equivoca: un sujeto más si hace falta medir el traspaso.
- Task 1: Ruling: el «Example» de requesting-code-review se escribe en la Task 2, cuando existen los ejes que nombra — coste si se equivoca: ninguno, el anexo lo lista como «kit distinto».
- Task 1: Ruling: contraste de la fuente con las paradas del kit (decisión 20 de la spec): «Before merge to main» → el cierre único antes del merge a la integración (el merge a main es de una persona); «Fix Important issues before proceeding» → una pasada de fix y el cierre; «Proceed with unfixed Important issues» → acotado al cierre único; «BASE_SHA=HEAD~1» → la receta del paquete — coste si se equivoca: una frase de la fuente que choque y no se vea hasta un humo.
- Task 1: Ruling: quité la fila «The user already tested it by hand» de Rationalization Prevention que escribí sin RED — guía nueva sin fallo medido (Art. I) — coste si se equivoca: ninguno, vuelve si el RED de v1 muestra el fallo.
- Task 1: Ruling: la base completa (moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min) salió con 14 timeouts en 4 ficheros lentos de la CLI (merge, cerrojo, ids, roadmap publish) mientras corrían en paralelo los sujetos de v1 y dos pre-commits; solos, los 4 ficheros pasan 66/66 en 497 s — la feature no toca cli/ — coste si se equivoca: una regresión de la CLI que asome en el gate de la validación final, que corre sin nada en paralelo.
- Task 2: Ruling: el escenario del plan en la batería de sdd-propose se llama ax (no p): p1-p3 ya existen en esa batería — coste si se equivoca: ninguno.
- Task 2: Ruling: los Pester que fijaban en sdd-implement las reglas de la revisión final (ClosingOffCriticalPath, FinalReviewPackage, NativeAdapt) leen ahora sdd-verify, con las mismas aserciones; el de la plantilla del plan busca «revisión final de rama no sigue esta política» — las reglas se movieron, no cambiaron — coste si se equivoca: ninguno, el texto que fijan es el mismo.
- Task 2: Ruling: los nodos de los dos grafos de sdd-implement (texto de la fuente, 0175) pasan a «sdd-verify: final review in axes» y «sdd-verify: closing of the review» — kit distinto: la revisión vive en sdd-verify — coste si se equivoca: ninguno.
- Task 2: Ruling: el párrafo «Every dispatch … silence watch» se queda en sdd-implement, en la sección nueva «After the last task»: vale para implementadores y revisores, no solo para la revisión final — coste si se equivoca: ninguno.
- Task 2: Ruling: PostFinalReview.Tests.ps1 fijaba en sdd-implement las líneas `Revisión final:` y `Pasada de fix:`; ahora las lee en sdd-verify, con las mismas aserciones — coste si se equivoca: ninguno.
- Task 2: Ruling: rúbrica X de f1 desempatada — el molde no tenía ADR, así que «la lista de sdd decision index» no se podía llevar; cuentan los dos sujetos, que ejecutaron el índice; f1 2/2 — coste si se equivoca: un hilo que no pase una lista no vacía, que ahora mide f2 con la ADR 0003 en el molde.
- Task 2: Ruling: REFACTOR 1 de la Task 2 — f2 1/2: f2-2 leyó «no» en el plan y no miró el diff (Art. II, elemento omitido) → hueco obligatorio en el ledger antes del primer despacho: `Final: Eje Arquitectura: <sí | no> en el plan · señales en el diff: <…> → <sale | no sale>`; el molde de f1 y f2 gana la ADR 0003 — coste si se equivoca: una línea más de ledger por revisión.
- Task 2: Ruling: REFACTOR 2 de la Task 2 — f2 1/2 otra vez: f2-1 escribió el hueco con «ninguna» viendo package.json en la lista de ficheros sin leer su diff, y subió el eje tarde, cuando el eje Spec avisó; la ronda cambia de forma (tech-stack, regla de parada del REFACTOR): paso literal `git diff "$MERGE_BASE" HEAD -- <manifest>` por cada manifest del diff — coste si se equivoca: una lectura de diff por manifest.
- Task 3: Ruling: f3 GREEN 2/2 (los cinco fallos con su tipo de hueco y su origen, y lo no verificado listado); f4 GREEN 1/2: f4-2 marcó Important la función de 26 líneas con las filas de longitud, que «De código» (≤ 30) desmiente → REFACTOR 1 de la Task 3 (fallo de disciplina, Art. II): contraejemplo con otras cifras (40 y 35) junto a «The repo overrides» — coste si se equivoca: una frase más en el encargo del eje Código.
- Task 3: Ruling: f4 REFACTOR 1 2/2. El Pester de los «Quick Diagnostic» (VerifySkill, Slow) se escribió con los encargos ya hechos: compara con el clone de Wondel y habría fallado antes del Step 4, cuando los encargos no traían las tablas — coste si se equivoca: ninguno.
- Task 4: Ruling: los Pester que fijaban la regla vieja (PostFinalReview: «La pasada de fix de la propia revisión final no abre la re-revisión», «tampoco entra», el formato `Revisión final: <tipo> + <modelo>`; ClosingOffCriticalPath y PostFinalReview: «en la re-revisión del tramo»; NativeAdapt: la línea de tasks.md) pasan a la regla nueva de la spec (MODIFIED de control-profiles y de feature-flow) — coste si se equivoca: ninguno, son los requisitos aprobados.
- Task 4: Ruling: GREEN por la rúbrica: c1 1/2 (c1-2 mandó la re-revisión con effort-low + sonnet, como pide «Models» de sdd-implement para las re-revisiones pequeñas, y sin el Minor en el ledger); c2 0/2 (los dos despacharon otra re-revisión con `Re-revisión:` ya en tasks.md: el paso 7 no lo prohibía); c3 2/2; c4 0/2 contra la letra (re-revisaron desde el `sobre`); c5 2/2 — dev-lead, 2026-10-14: enmienda del formato 2.x aprobada («Desde su «sobre» (Recomendada)», c4 pasa a 2/2) y seguir pese a pasar la previsión de sujetos («Sigo con todo (Recomendada)») — REFACTOR 1 de la Task 4: prohibición y racionalizaciones en el paso 7 y en «Closing the review» (Art. II, disciplina), y la excepción en «Models» de sdd-implement — coste si se equivoca: dos frases y dos filas.
- Task 4: Ruling: el test del paso 9 de PostFinalReview ya no exige `Pasada de fix:` en el paso: con la enmienda del 2026-10-14 el último revisado no pasa por ella — coste si se equivoca: ninguno.
- Task 4: Ruling: REFACTOR 1 de la Task 4: c1 2/2 y c2 2/2. Coste acumulado de la campaña: 44 sujetos, 29,71 $.
- Task 5: Ruling: menores de la 0175 — «Are names clear and accurate (match what things do, not how they work)?» vuelve a implementer-prompt.md; los ejemplos «(multi-file coordination, pattern matching, debugging)» y «the most capable available model, not the session default» vuelven a «Models» de sdd-implement, y «the final whole-branch review is one of these» pasa a «los ejes toman los modelos de sdd-verify» (kit distinto); «in Native, they chose it» → «the plan's `Ejecución` line chose it»; «the most capable model» junto a opus salió con «Final review»; las filas de procedencia de sdd-rubber-duck vuelven a su tabla — coste si se equivoca: ninguno, texto de la fuente.
- Task 5: Ruling: el punto 8 de review-spec.md (decisiones del dev-lead) no se escribe: RED R 2/2 en s1 y s1b con el texto de develop (los dos lo marcan Crítico); el Art. I prohíbe guía sin fallo en la línea base; el requisito ADDED de feature-flow se cumple y queda medido; enmienda en la spec «sin aprobar: la impone el Art. I», para el dev-lead en el cierre — coste si se equivoca: un caso de campo más sutil que los dos de la batería, que se mediría con su ticket.
- Task 5: Ruling: NativeAdapt fijaba la frase vieja del Art. IV («va con Opus y effort high… el techo por defecto»); ahora fija la nueva («Spec y Arquitectura en Opus, Código en Sonnet, con effort high») — coste si se equivoca: ninguno.
- Task 5: Ruling: h1 y h2 GREEN 1/1 en la puerta; h2 llega a despachar (fila de deuda del humo SDD) y saca los ejes; h1 invoca sdd-verify. Las filas A (git add -A en h1 y h2) y W (h1 no anuncia el workspace) fallan por reglas que la 0148 no toca: van al triaje de la deuda (fila 124) — coste si se equivoca: ninguno para esta feature.
- Final: Ruling: Eje Arquitectura (sin línea) → sí — skills/sdd-verify/ es un módulo nuevo y Revisión final: un contrato entre skills — coste si se equivoca: una revisión opus de más
- Final: Ruling: [Código] declinado «sdd-verify y los encargos cumplen la spec y la ADR 0013» — lo juzgó el eje Spec (fork entero, QD 50/50) — coste si se equivoca: ninguno
- Final: Ruling: [Código] declinado «<verdict> en la skill frente a <veredicto> en la spec; corchetes anidados en Arquitectura <opus+high, <verdict> | no (plan)>» — la skill va en inglés (Art. III) y la línea que escribe el agente es la misma; la alternativa entre corchetes se lee sin ambigüedad — coste si se equivoca: un agente copia el marcador en inglés en tasks.md
- Final: Ruling: [Código] declinado «los topes de WordBudget con la decisión del dev-lead en la spec» — la aprobación de la spec (2026-10-14) fija los topes «a lo que midan», y el eje Spec lo confirmó — coste si se equivoca: ninguno
- Final: Ruling: [Código] declinado «fronteras sdd-implement/sdd-verify/sdd-start-feature» — lo juzgó el eje Arquitectura — coste si se equivoca: ninguno
- Final: Ruling: [Código] declinado «fallos sembrados en app-f3/app-f4/app-v1» — son la carga de los escenarios — coste si se equivoca: ninguno
- Final: Ruling: [Código] declinado «no ejecutó la suite» — la corre el hilo en la pasada de fix y en el gate de la validación — coste si se equivoca: ninguno
- Final: Ruling: [Arquitectura] declinado «redacción y anatomía de cada frase de las skills» — la mide la batería (ADR 0002) y Skills.Tests fija la anatomía; ningún eje lee la prosa frase a frase — coste si se equivoca: una frase confusa que la batería no cubre llega como ticket de campo
- Final: Ruling: [Arquitectura] declinado «THEN implementados y veredictos RED/GREEN» — lo juzgó el eje Spec — coste si se equivoca: ninguno
- Final: Ruling: [Arquitectura] declinado «modelo de cada eje» — lo fijan la propuesta 0131 y la ADR 0015 — coste si se equivoca: ninguno
- Final: Ruling: [Arquitectura] declinado «ediciones del roadmap y de la propuesta (0182, 0163)» — decisiones del dev-lead (partir en tres) — coste si se equivoca: ninguno
- Final: Ruling: [Arquitectura] declinado «filas de Clean Architecture sobre BD, framework y Main» — no aplican a un kit de Markdown; la CLI no se toca — coste si se equivoca: ninguno
- Final: Ruling: [Arquitectura] declinado «status de la ADR 0006 por sustitución parcial» — la 0006 sigue accepted; donde chocan manda la 0015, más reciente, y con sus rutas ampliadas (Important 1) sale junto a la 0006 — coste si se equivoca: un revisor que lee solo la 0006
- Final: Ruling: [Arquitectura] declinado «tope total del kit» — suspendido hasta la 0157 — coste si se equivoca: ninguno
- Final: Ruling: [Spec] declinado «filas de deuda saldadas sin marcar» — se marcan en el paso 8 de sdd-end-feature — coste si se equivoca: ninguno
- Final: Ruling: [Spec] declinado «capabilities/verification.md no existe» — el delta se fusiona en el cierre (borrador hecho, capability check pasa) — coste si se equivoca: ninguno
- Final: Ruling: [Spec] declinado «calidad de subject.sh, compose-*.mjs y fixtures» y «fronteras de sdd-verify» — los juzgaron los ejes Código y Arquitectura — coste si se equivoca: ninguno
- Final: Ruling: [Spec] declinado «orden Finish → paso 7 frente a la re-revisión» — coherente con el grafo y c1 2/2 — coste si se equivoca: ninguno
- Final: Ruling: [Spec] sin verificar «Pester, Confirmaciones de las ADR, decision check, kit:upstream» — los corre el hilo en la pasada de fix y en el gate de la validación — coste si se equivoca: ninguno
- Final: Ruling: [Spec] sin verificar «veredictos de las baterías» — los calificó el hilo en cada task contra su rúbrica, con la línea en el ledger — coste si se equivoca: un veredicto mal calificado sin segunda lectura
- Final: minor (deferred): [Código] tres Pester con nombre «sdd-implement …» que leen sdd-verify (ClosingOffCriticalPath, FinalReviewPackage, NativeAdapt)
- Final: minor (deferred): [Código] ClosingOffCriticalPath repite Get-Content en línea; Get-Reference fijado a sdd-start-feature
- Final: minor (deferred): [Código] compose-axis.mjs: fencedAfter con end -1 recorta el último carácter del code-reviewer.md legado
- Final: minor (deferred): [Código] compose-spec-review.mjs: un marcador que cambia deja el .replace sin efecto y sin error
- Final: minor (deferred): [Código] topes de WordBudget clavados al recuento (decisión de la spec: «a lo que midan»)
- Final: minor (deferred): [Código] ficheros nuevos sin salto de línea final
- Final: minor (deferred): [Código] la variable de bucle ledger comparte nombre con la función ledger() en subject.sh
- Final: minor (deferred): [Código] comentario de escenario en tests/batteries/sdd-propose/subject.sh
- Final: minor (deferred): [Arquitectura] la señal «datos» del eje Arquitectura no se define (sdd-verify frente a plan-writing y plan-template)
- Final: minor (deferred): [Arquitectura] faltan las formas del ruling y de tasks.md para un eje decidido al despachar sin línea en el plan
- Final: minor (deferred): [Arquitectura] la re-revisión única llevaría «Restricciones de código» dos veces; «Cómo revisar» dice «sin la carpeta de la spec», que no vale para sdd review package
- Final: minor (deferred): [Arquitectura] tope de paralelo en ventana (sdd-verify) frente a lotes (sdd-parallel-agents)
- Final: minor (deferred): [Arquitectura] el encargo del eje Código no sabe si sale el de Arquitectura, y conserva «vision document» y «outside the plan or spec»
- Final: minor (deferred): [Arquitectura] solo el encargo del eje Spec produce «sin verificar»
- Final: minor (deferred): [Arquitectura] ciclo sdd-implement ↔ sdd-verify; re-review-prompt.md con dos políticas de modelo
- Final: minor (deferred): [Arquitectura] la batería de sdd-verify comparte el molde de sdd-implement; ningún escenario ejercita el encargo de Arquitectura
- Final: minor (deferred): [Spec] Review Focus línea 1: «el Spec primero» con tope 1 no está escrito
- Final: minor (deferred): [Spec] sdd-verify:241 adjudica un Minor residual con Ruling, contra :229 y la decisión 6
- Final: minor (deferred): [Spec] Art. IV pierde «del principio 5» (tope de constitution.md a 2236 exacto)
- Final: minor (deferred): [Spec] las líneas Final: fixed y minor (deferred) no llevan el eje (decisión 13)
- Final: minor (deferred): [Spec] enmienda del punto 8: el RED da Crítico y el ADDED pide Importante → al dev-lead en el cierre
- Final: minor (deferred): [Spec] el paquete no se lee en tramos de 400 líneas por las filas largas del roadmap (deuda previa, feature 0115)
- Final: minor (deferred): [Spec] sdd-start-feature:24 abre con «la revisión final limpia»
- Final: minor (deferred): [Spec] sdd-implement:24 y :27 dicen «one reviewer at the end»
- Final: minor (deferred): [Spec] walkthrough-template cambió su ejemplo sin escenario de batería
- Final: minor (deferred): [Spec] tests/batteries/sdd-rubber-duck/battery.md:72 dice «abajo» y la fila queda arriba
- Final: Ruling: topes a cero de margen — sdd-verify condensa «Act on feedback» de 4 viñetas a 2 (remite a Closing the review, sin perder regla) y queda en 8800/8800; sdd-end-feature quita «con cualquier método» del paso 9 (4518/4518); el ejemplo de control-profiles.md se iguala al de walkthrough-template sin «en 96 s» (11464/11464) — sin subir topes — coste si se equivoca: una regla que solo decía la viñeta quitada
- Final: Ruling: el self-review §4 del plan marcaba ✓ la línea 3 del Review Focus sin escenario — ahora la cubre f3n; el plan no se reescribe — coste si se equivoca: ninguno
- Final: Ruling: [re-revisión] Minor «la línea Pasada de fix: se sale del literal» — al juntar el cierre se reescribe con el literal, `Pasada de fix: juntada en el cierre, 8 hallazgos RED→GREEN`; el noveno (f3n, RED limpio) va en el walkthrough — coste si se equivoca: ninguno
- Final: Ruling: [re-revisión] Minor «el ledger de Código decía suite pendiente» — completado con su línea de suite — coste si se equivoca: ninguno
- Final: Ruling: [re-revisión] Minor «f3n con n = 1 y una spec que cita la ADR 0003» — se queda así: lo medido es que la falta de ADR en la lista no da «no verificado», y el sujeto lo cumple aunque juzgue contra la ADR que cita la spec; un segundo sujeto cuesta ~0,5 $ y no cambia la regla — coste si se equivoca: un fallo en campo que reabre el escenario con n = 2
- Final: Ruling: [re-revisión] fuera de alcance «el ejemplo de sdd-verify:208 sin --path» — es narración entre corchetes, y la frase de «The axes» y la tabla dan la orden entera; sdd-verify está a 8800/8800 — coste si se equivoca: un agente copia el ejemplo y la CLI le pide --path
- Final: Ruling: [re-revisión] fuera de alcance «What Was Implemented del encargo de Código sin fila» — la fila del anexo nombra también el encargo de Código, en el commit de cierre (documentación bajo .docs/, revisada en el hilo) — coste si se equivoca: ninguno
