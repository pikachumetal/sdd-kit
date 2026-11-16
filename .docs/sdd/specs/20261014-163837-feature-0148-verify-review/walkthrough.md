---
id: 20261014-163837-feature-0148-verify-review
feature: 0148
title: Walkthrough — verify: sdd-verify, revisión final en tres ejes con un solo cierre
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-15
---

# Walkthrough — verify: `sdd-verify`, revisión final en tres ejes con un solo cierre

## 1. Cambios realizados

- **`sdd-verify` nace** (`02afa007`): fork de `verification-before-completion` y `requesting-code-review` de superpowers 7.0.0 (MIT, `NOTICE`) con el texto de la fuente, cambiado solo donde el kit trabaja distinto (anexo de la spec). El contrato de cierre de `sdd-implement` lo invoca en lugar de `superpowers:verification-before-completion`. La batería `tests/batteries/sdd-verify/` nace con `v1`, sobre el molde de reservas de `sdd-implement`.
- **La revisión final sale por ejes** (`649f1a99`): `## Final review` en `sdd-verify`, con los ejes en paralelo vía `sdd-parallel-agents` dentro de `maxParallelAgents`: Spec `opus`, Código `sonnet` y Arquitectura `opus`, los tres con `sdd-kit:effort-high`. `encargo-revision.md` pasa de `sdd-start-feature` a `sdd-verify`. El plan declara `Eje Arquitectura: sí | no` (`plan-template.md`, `plan-writing.md`), y el hilo solo lo sube, con un hueco obligatorio en el ledger y el paso literal `git diff "$MERGE_BASE" HEAD -- <manifest>`. Sale «Final review» de `sdd-implement`, que gana «After the last task». Escenarios `f1`, `f2` y `ax` (este en la batería de `sdd-propose`).
- **Los encargos de los tres ejes** (`baad233e`): `spec-reviewer-prompt.md` (delta de capacidades con el `REMOVED` al revés, capacidades sin declarar, Confirmación de las ADR, decisiones del dev-lead cubiertas enteras, tipo de hueco, «no verificado», de OpenSpec 1.14.1 y del concepto de `converge`), `code-reviewer-prompt.md` (los «Quick Diagnostic» de *Clean Code*, *Refactoring*, *A Philosophy of Software Design* y *The Pragmatic Programmer* de Wondel 1.8.0, literales, con «the repo overrides» y «always a judgement call» de mattpocock v1.3.1) y `architecture-reviewer-prompt.md` (el de *Clean Architecture*). `THIRD_PARTY_NOTICES.md` gana la fila de Wondel. Escenarios `f3` y `f4`.
- **La revisión se cierra una vez** (`1d89f543`): `## Closing the review`: una pasada de fix, una sola re-revisión `opus` + `effort-high` justo antes de la validación, lo residual a ✋, un Critical residual que no se adjudica y una re-revisión que nunca abre otra; el formato 2.x de `tasks.md` cuenta desde su `sobre`. `sdd-start-feature` (paso 7), `control-profiles.md` y el paso 9 de `sdd-end-feature` siguen la regla; `sdd-end-feature` deja de invocar `superpowers:requesting-code-review`. Escenarios `c1`–`c5`.
- **ADR, constitution, menores y humos** (`0bf5e6d1`): ADR 0015 («La revisión final sale en ejes y se cierra una vez») y el Art. IV con los ejes; vuelven los menores de la 0175 a `sdd-implement`; `spec-0010.md` gana «sin `--motivo` responde lo mismo»; humos `h1` y `h2` (este llega a despachar). El README pasa a 2 skills de superpowers invocadas.
- **Pasada de fix de la revisión final** (`e950e885`): los nueve Important de los tres ejes (sección 4.1).

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 5 h
- Esfuerzo real: ~5,5 h — reloj del hilo por las marcas de los commits y del ledger: de la apertura (`24de052d`, 19:14) a la pausa del dev-lead (23:52), 4,6 h, y de la vuelta (08:20) al cierre (~09:15), 0,9 h; sin la spec ni el plan, de antes de la apertura, ni la noche.
- Desviación: +0,5 h (+10 %)
- Causa de la desviación: no obligatoria (≤ 30 %); la sumaron las dos rondas de REFACTOR de `f2` y el gate, que destapó dos fallos que la revisión no ve porque no ejecuta la suite.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature)
- Tokens del hilo: 258.057.015 — claude-opus-5-5 258.057.015 (sin lo de antes de crear la rama)
- Tokens de subagentes: 20.795.888 en 6 despachos — Final re-review 0148 claude-opus-5-5 2.083.472 / 3 min; Final review — Code axis claude-sonnet-5-5 1.427.332 / 2 min; Revisor spec 0148 técnica claude-sonnet-5-5 314.118 / 2 min; Revisor spec 0148 dominio claude-opus-5-5 390.900 / 2 min; Final review — Architecture axis claude-opus-5-5 6.593.126 / 7 min; Final review — Spec axis claude-opus-5-5 9.986.940 / 9 min
- Coste de la sesión: 92,34 $ (hilo 81,63 $ + subagentes 10,71 $)
- Coste de sujetos: 32,74 $ en 49 sujetos (`sonnet`, salvo `f3` y `f3n` en `opus`) — RED 5,22 $ (12, `red/`); GREEN 19,80 $ (26, `green/`); REFACTOR 4,54 $ (8, `refactor/`); REFACTOR 2 de `f2` 2,70 $ (2, `refactor2/`); `f3n` de la pasada de fix 0,48 $ (1, `fix/`)
- Review de spec: 2 revisores · hallazgos 19, aceptados 15 y 3 en parte

## 3. Desviaciones del plan

- La Task 5 no escribe el punto 8 de `review-spec.md` (las decisiones del dev-lead): el revisor de la spec de `develop` ya marca Crítico la decisión cubierta a medias en `s1` y `s1b` (RED 2 de 2), y el Art. I prohíbe escribir guía sin un fallo en la línea base. Enmienda aprobada en el cierre (dev-lead, 2026-10-15: «Apruebo la enmienda (Recomendada)»): el THEN del ADDED pasa a «Importante o Crítico».
- El tramo de la re-revisión con una línea `Revisión final:` en el formato 2.x empieza en su `sobre`, no en `Pasada de fix:` (enmienda del 2026-10-14, aprobada: «Desde su «sobre» (Recomendada)»).
- El escenario del plan en la batería de `sdd-propose` se llama `ax`, no `p`: `p1`–`p3` ya existían.

### Decisiones tomadas sin el dev-lead

> Lista completa en `## Rulings` de `tasks.md` (`sdd ledger rulings`). Aquí, las que cambian lo que el dev-lead ve.

- La batería de `sdd-verify` reutiliza el molde y los fixtures de `sdd-implement` en vez de copiarlos — un solo molde para la app de reservas — coste si se equivoca: un cambio del molde rompe las dos baterías a la vez.
- `f2` necesitó dos rondas de REFACTOR: con el hueco en el ledger solo, un sujeto lo rellenó con «ninguna» viendo `package.json` en la lista sin leer su diff; el paso literal `git diff -- <manifest>` lo cerró 2/2 — coste si se equivoca: ninguno; queda medido.
- Los Pester que fijaban en `sdd-implement` las reglas de la revisión final leen ahora `sdd-verify`, con las mismas aserciones; los que fijaban la regla vieja del cierre (la pasada de fix fuera de la re-revisión, el formato `Revisión final: <tipo> + <modelo>`) fijan la nueva — coste si se equivoca: ninguno.
- En esta feature el eje Arquitectura salió sin línea en el plan (escrito antes de que el kit la llevara): módulo nuevo `skills/sdd-verify/` y la línea `Revisión final:` como contrato entre skills — coste si se equivoca: una revisión `opus` de más.
- La base completa de la Task 1 dio 14 timeouts en tests lentos de la CLI con sujetos corriendo a la vez; solos, 66/66; el gate se repitió sin nada en paralelo en el cierre — coste si se equivoca: ninguno, el gate final pasa.
- Pasada de fix: los topes de palabras estaban a cero de margen; se condensó en cada skill en vez de subirlos («Act on feedback» de `sdd-verify` a dos viñetas que remiten a «Closing the review»; «con cualquier método» del paso 9 de `sdd-end-feature`; el ejemplo de la línea de campo de `control-profiles.md` igualado al de `walkthrough-template.md`) — coste si se equivoca: una regla que solo decía la viñeta quitada.
- `h1` y `h2` fallan las filas A (`git add -A`) y W (`h1` no anuncia el workspace) por reglas que la 0148 no toca: al triaje de la deuda — coste si se equivoca: ninguno para esta feature.

## 4. Verificación

### 4.1 Builds

- Suite completa: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`, sin nada en paralelo, sobre el estado del cierre → Pester 1.251/1.251 (con los Slow), Vitest 846/846, lentos 156/156, Node mínimo 1.023/1.023 · 3 min 55 s. La primera pasada falló en dos tests que la revisión no podía ver: `docs-claims` leía `capability index>` en el marcador de `spec-reviewer-prompt.md` y el Slow de los «Quick Diagnostic» leía `git show` sin UTF-8 bajo moon; los dos, RED→GREEN tras la re-revisión (✋ abajo).
- `node cli/bin/sdd.js decision check --path .docs/sdd` → «Decisiones válidas»; `capability check` de la spec → pasa; `moon run kit:upstream` → falla: OpenSpec publicó la v1.14.2 (vista: 1.14.1), con un cambio en la comprobación de los `REMOVED` que afecta al eje Spec → fila de deuda nueva
- Revisión final: Spec `opus`+high, Código `sonnet`+high y Arquitectura `opus`+high (subido) sobre `0bf5e6d`, los tres «With fixes»: 0 Critical, 10 Important (uno del eje Código bajado a Minor por su efecto), 27 Minor diferidos. Pasada de fix (`e950e885`): 9 hallazgos, 8 RED→GREEN (5 con Pester, 3 con comprobación ad hoc: `axis_brief` de 30 a 10 líneas, duplicados de 3 a 1 y montajes en seco de los 12 escenarios idénticos antes y después; las filas del anexo) y 1 con RED limpio (`f3n`: el eje Spec no cuenta la falta de ADR como «no verificado»; no se escribe guía, queda como regresión).
- Re-revisión: `sdd-kit:effort-high` + opus sobre `0bf5e6d..74336eb` (la pasada de fix y su `tasks.md`): 9/9 resueltos, sin roturas Critical ni Important; 3 Minor y 2 observaciones fuera de alcance, adjudicados con su ruling (una, la fila del anexo de «What Was Implemented» del encargo de Código, se corrige en el cierre).

### 4.2 Smoke / tests

- Validación en campo: 2026-10-15 · suite 1.251/1.251 · smoke 28/28 THEN con ejecución real o suite · revisión final Spec, Código y Arquitectura sobre 0bf5e6d, re-revisión limpia, 1 sin revisar

✋ Me salí del plan en:

- sin revisar: juntado en el cierre — tras la re-revisión, el marcador de `capability index` del encargo del eje Spec lleva `--path .docs/sdd` (y `compose-axis.mjs`, que lo rellena), el Slow de los «Quick Diagnostic» fija UTF-8 al leer `git show`, y `sdd-verify` recorta 2 palabras para caber en su tope; los dos tests, RED→GREEN, y el gate entero en verde.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `verification`: no se afirma un estado sin la evidencia de esta sesión | ejecución real (`v1` GREEN 2/2) | ✅ |
| … el kit no invoca `verification-before-completion` ni `requesting-code-review` | suite (`VerifySkill`, «ningún fichero de skills/ invoca…») · ejecución real (`h1` invoca `sdd-verify`) | ✅ |
| … la revisión final sale en ejes, en paralelo, cada uno con su vigía | ejecución real (`f1` 2/2; y la revisión final de esta feature) | ✅ |
| … el eje Arquitectura lo declara el plan y el hilo solo lo sube | ejecución real (`f2` REFACTOR 2 2/2; tope de 2 agentes respetado) | ✅ |
| … el eje Spec contrasta el diff con el delta (el `REMOVED` vivo, Critical `contradicts`) | ejecución real (`f3` 2/2) | ✅ |
| … el eje Spec comprueba que cada decisión del dev-lead tiene regla entera | ejecución real (`f3` 2/2, «en las dos vías») | ✅ |
| … la Confirmación de las ADR que cubren el diff | ejecución real (`f3` 2/2 con la 0003; `f3n` sin ADR que cubra el diff) | ✅ |
| … una comprobación no verificada no cuenta como limpia, y el hilo la verifica o la adjudica | ejecución real (`f3` 2/2 lista lo no verificado) · suite (Pester de la pasada de fix) | ✅ |
| … el eje Código revisa con los cinco libros bajo el estándar del proyecto | ejecución real (`f4` REFACTOR 2/2) | ✅ |
| … la revisión se cierra una vez | ejecución real (`c1` REFACTOR 2/2; y el cierre de esta feature) | ✅ |
| … un Critical que deja la re-revisión no se adjudica | ejecución real (`c5` 2/2) | ✅ |
| … una re-revisión nunca abre otra | ejecución real (`c2` REFACTOR 2/2) | ✅ |
| … `tasks.md` registra cada eje | suite (`PostFinalReview`) · ejecución real (`tasks.md` de esta feature) | ✅ |
| … el revisor final revisa el paquete sin ejecutar la suite | ejecución real (los tres ejes de esta feature: ninguno la ejecutó) | ✅ |
| … sale en segundo plano con el commit de la última task | ejecución real (`f1` 2/2; esta feature) | ✅ |
| … trabaja aislado en el sha que revisa | suite (`ClosingOffCriticalPath`) · ejecución real (`review-0148-0bf5e6d1` y `review-0148-74336eb`) | ✅ |
| … el paquete sale del merge-base y sin evidencia | suite (`FinalReviewPackage`) · ejecución real (paquete de 3.720 líneas, sin `red/` ni `green/`) | ✅ |
| … el paquete deja fuera los borrados y la carpeta de la feature | suite (`FinalReviewPackage`) · ejecución real (mismo paquete) | ✅ |
| … el plan escribe la revisión final con sus ejes | ejecución real (`ax` 2/2) | ✅ |
| … el cierre no repite la revisión final | ejecución real (`c3` 2/2, `c4` 2/2 con la enmienda) | ✅ |
| `feature-flow`: el artículo de calidad viaja a los ejes | suite (`VerifySkill`, el bloque en los tres encargos) · ejecución real (`f1` 2/2) | ✅ |
| … el Review Focus viaja al eje Spec | suite (`PlanReviewFocus`) · ejecución real (`f3`) | ✅ |
| … el trabajo se valida antes de cerrar, tras el cierre de la revisión | suite (`ClosingVerification`, `FieldValidation`) | ✅ |
| … lo cambiado tras la validación se separa de lo validado | ejecución real (`c2`, `c3`) | ✅ |
| … con Native, el plan registra el modelo recomendado (literal nuevo) | ejecución real (`ax` 2/2) · suite (`SessionModel`) | ✅ |
| … el revisor de la spec comprueba las decisiones del dev-lead | ejecución real (`s1`, `s1b` RED 2/2 con el texto de `develop`, los dos «Crítico») | ✅ (THEN «Importante o Crítico», enmienda aprobada) |
| `control-profiles`: salir del plan es un ruling visible; la pasada de fix entra en la única re-revisión | suite (`ControlProfiles`) · ejecución real (`c1`) | ✅ |
| … con `validation.mode: field`, la validación es en campo y la línea lleva los ejes | ejecución real (`c5` 2/2; este cierre) · suite (`FieldValidation`, `VerifySkill`) | ✅ |

### 4.3 Residuales / deuda generada

- 27 Minor de la revisión final, diferidos (ledger, `Final: minor (deferred)`): los que cambian una regla, en la fila de deuda «Menores de la revisión final de la 0148».
- OpenSpec 1.14.2 busca un `REMOVED` por su cuerpo, no por su título: fila de deuda nueva, para la revisión de fuentes de la release 3.0.0.
- `h1` y `h2`: `git add -A` y el anuncio del workspace, casos nuevos en sus filas de deuda.
- El paquete de la revisión final no se lee en tramos de 400 líneas por las filas largas del roadmap: segundo caso en la fila de la 0115.

## 5. Aprendizajes

- Un hueco obligatorio en el ledger no basta si el dato que pide se puede «ver» sin leerlo: un sujeto rellenó «ninguna» con `package.json` en la lista de ficheros. Lo cerró el paso literal con la orden (`git diff -- <manifest>`) → `sdd-verify` y la procedencia de su batería (fila del eje Arquitectura); confirma la fila «Elemento omitido» del Art. II: el hueco lleva la orden que lo rellena.
- Con los topes de palabras al recuento exacto, la pasada de fix no tiene margen: se condensó para no subirlos → caso nuevo en la fila de deuda «La previsión no mide el margen de palabras de lo que se edita».
- La base completa da timeouts en los tests lentos de la CLI con sujetos corriendo a la vez → `tech-stack.md`: «Con una campaña de sujetos en marcha, el hilo no commitea ni corre la base».
- La revisión final no ejecuta la suite, así que no ve un test que solo corre en el gate (`cli:test-min`, los Slow): los dos fallos los destapó el gate del cierre → confirma que el gate va en la validación, después de la revisión (paso 7 de `sdd-start-feature`); sin cambio de regla.
- Revisión de skills: se miró `.claude/skills/` (`skill-creator`, `writing-for-agents`, `writing-skills`); nada que llevar: lo aprendido del hueco del ledger vive en `sdd-verify` y en la procedencia de su batería.
