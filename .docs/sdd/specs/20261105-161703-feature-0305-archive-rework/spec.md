---
id: 20261105-161703-feature-0305-archive-rework
feature: 0305
proposal: 0301
title: sdd-archive rehecha con las tres reglas, por debajo de 20.000 bytes y propia
mode: full
profile: delegate
status: approved
created: 2026-11-05
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-05
---

# Spec — `sdd-archive` rehecha con las tres reglas, por debajo de 20.000 bytes y propia

🦆 Hoy, tras compactar, Claude Code vuelve a adjuntar `sdd-archive` cortada a 20.000 caracteres, y lo que hay detrás (el merge, el mensaje final, la línea «Terminado») se pierde: la skill ocupa 31.070 bytes. Al acabar, ocupa menos de 20.000 y lo que solo se lee en un paso vive en su `references/`, con la frase que lo dispara en el paso. Además el cierre deja de decir «No terminado. Falta el ticket» cuando el trabajo ya está fusionado: con la 0303 fusionada y el ticket por escribir, la última línea es «**Terminado.** feature/0303-… fusionada en develop (abc1234) · push: hecho a origin/develop · puedes borrar el worktree …». Y nombra la pieza siguiente sin escribir su prompt: «Recomiendo 0306…; su prompt lo da `sdd-roadmap`: «dame el prompt de la 0306»».

Validación: agente — es texto que lee el agente, y lo que se observa entero son `kit:skill-size`, `kit:copies`, `kit:own`, `kit:upstream`, la suite y la batería de `sdd-archive`; el repo valida en campo (`validation.mode: field`).

## Capacidades

- Modificadas: `archive` — «El cierre comprueba el árbol, el destino y las otras ramas antes de escribir» (los borradores de `sdd-implement` no paran el cierre), «Al cerrar una pieza de una familia, el cierre dice qué falta» (sin prompt), «El kit no invoca `finishing-a-development-branch`» (sin `NOTICE`) y las reglas «Dónde viven los datos», «Avisos» y «Límites»
- Modificadas: `control-profiles` — «El cierre acaba con una línea de terminado» (el ticket no cuenta), «Un push que no sale se informa y no se fuerza» (`Permission denied (publickey)`) y las reglas «Avisos» y «Regla ante conflicto»

## ✋ Decisiones que he tomado yo — valida estas

Review de spec: dos revisores, por decisión del dev-lead («haz revision dom opus tec sonnet»); la rúbrica proponía ninguna — señales: `MODIFIED` (requisitos y reglas de `archive` y `control-profiles`) · tamaño: ~450 líneas en 12 ficheros
- Dominio (Opus, effort medium): si los `MODIFIED` dejan vivas reglas que dicen lo contrario (la de no reintentar un push denegado, los «Avisos» con el literal viejo) y qué prohíbe el permiso nuevo de los borradores (señal: `MODIFIED`)
- Técnica (Sonnet, effort medium): si cada comportamiento nuevo tiene escenario en la batería, `dist/` y las comprobaciones `kit:*`, y los topes de palabras (señal: `MODIFIED`)

Prueba del delta: la línea al final de «Hallazgos de la review».

1. **`sdd-archive` es propia, no copia**: con `keptShare` de `tests/copies/annotated.ts` (frases de 6 palabras), `SKILL.md` conserva el 10 % de `finishing-a-development-branch` en v7.0.2, y `merge-recipe.md` y `records.md` el 0 %; el límite de `kit-distribution` es el 50 %. En `upstream.json` sale la entrada `copy` con `pending: "0305"`, entra `skills/sdd-archive/` en `own` y una entrada `concept` (superpowers, `v7.0.2`, `skills/finishing-a-development-branch/SKILL.md` → `skills/sdd-archive/SKILL.md`, con la nota que hoy enlaza el anexo de la 0149). `moon run kit:notices` quita `skills/sdd-archive/NOTICE` y cambia su fila de `THIRD_PARTY_NOTICES.md` a «concepto». La línea del Overview «The merge step forks `finishing-a-development-branch` of superpowers (MIT, see `NOTICE`).» pasa a «Inspired by `finishing-a-development-branch` of superpowers (MIT).», la forma de `sdd-grilling`. La propuesta 0301 decía 13 %; lo medido hoy es 10 %. El anexo de procedencia que enlaza la nota vive en `.docs/sdd/specs/20261016-105021-feature-0149-archive/spec.md` («Anexo — regla retirada → dónde vive ahora»), fuera de `skills/`: no se toca, y sigue siendo la tabla «regla de la fuente → dónde vive ahora» de la ADR 0022.
2. **Las filas de racionalizaciones que siguen literales de la fuente se reescriben** con la misma regla y otras palabras: un `own` no lleva líneas literales de 70 caracteres o más de una fuente, y `kit:upstream` lo da en rojo («reescríbela o pasa el fichero a copia»). Son las de «Tests passed earlier this session», «'Yeah, get rid of it'», «The PR is up» y «Removal refused»; el plan las confirma con `kit:upstream`.
3. **`SKILL.md` baja de 31.070 a menos de 20.000 bytes, con 500 de margen como mínimo** para la pasada de fix de la revisión final (objetivo ≤ 19.500), moviendo a `references/` lo que solo se lee en un paso, según la tabla de Approach. Cada paso que pierde texto conserva la frase que lo dispara, como «First thing in this step: read …»: una regla que solo vive en una referencia no se lee (`tech-stack.md`, feature 0146; 0/2 frente a 3/3).
4. **Tres `references/` nuevas**: `final-review-check.md` (el 0.6), `closing-suite.md` (cuándo corre la suite y qué corre tras el merge de sincronización: la viñeta «The suite» del paso 1 y las del paso 6) y `learnings.md`, que sustituye a `aprendizajes-skills.md` traducida y junta con ella el detalle de los aprendizajes del paso 3. El nombre en inglés kebab-case lo pide el Art. III; `aprendizajes-skills.md` solo lo nombran `SKILL.md:39` y evidencias de `tests/*.md`, que no se tocan.
5. **Repetidas dentro de la skill, a un solo sitio** (ADR 0022, regla 3):
   - K27, el merge de un hotfix, en el paso 7 y en `merge-recipe.md` «Hotfix»: queda en la receta, y el paso 7 la nombra.
   - K29, los literales de «qué falta en la familia», en el paso 9.5 y en `records.md`: quedan en el paso 9.5 y `records.md` se queda solo con cómo se calcula la familia. Va así y no al revés porque la batería lo midió: con el literal en `records.md`, 0/2 literal; en el mensaje final de `SKILL.md`, 1/2 exacto y 1/2 casi (`battery.md`, procedencia de «Qué sigue»).
   - La parte de K28 que vive dos veces en la skill, el contraste de un rojo del paso 6 y «A red suite» de `merge-recipe.md`: queda en la receta.
   - Lo que el paso 6 dice y la receta repite en «Integrated base» («The suite again», «No suite yet»): queda en `closing-suite.md`.
6. **K26, K30 y la parte de K28 que comparte con otras skills se quedan para la 0311**: su otro sitio es `sdd-verify` (fila 0307), `sdd-worktrees` o `sdd-debugging`, como las frases que `kit:own` da repetidas con una skill de otra fila.
7. **Las frases que fallan, sustituidas** (ADR 0022, regla 3), con estos textos o los que dé el plan con la misma regla:
   - K25, `SKILL.md:89`: «Without it the change waits, except with `field` or `Validación: agente`; …» → «Step 1 says who validates in each mode; with `manual`, the change waits for it, and «lo pruebo mañana» with an owned trigger is a deferred validation (🧪).»
   - K25, `SKILL.md:96`: «in `delegate` validation stops, except with `field` or `Validación: agente`.» → «who validates is step 1's mode, and with `manual` in `delegate` the close waits for the user.»
   - K38, `SKILL.md:51`: «no run without the filter for it, unless it is a file of «Sin filtro».» → «the filter decides it like the rest, and a file of «Sin filtro» from the base runs the gate whole.»
   - `kit:own`, `SKILL.md:39`: «a setting that dodges a defect instead of fixing it» → «a setting that dodges a defect without fixing it».
   - `kit:own`, `SKILL.md:56`: «Never into `main`, never a tag, except `Hotfix only:`.» → «Into `main` and with a tag, a hotfix alone merges ([recipe](references/merge-recipe.md#hotfix)).»
8. **El 0.1 y `:26` en una frase**, con los borradores por ruta (los «Closing drafts» de `sdd-implement`): «`git status --porcelain` in the worktree: the drafts `sdd-implement` leaves uncommitted —the change folder's `walkthrough.md`, the `capabilities/` files named in the spec's «Capacidades» and, in 2.x, `.docs/sdd/changelog.md`— are where the close starts, and it completes them with the verification, the time and what the review changed, without rewriting them; any other path stops the close with «Hay cambios sin commitear: `<ficheros>`. ¿Los commiteo en la rama, los descarto o paro?», and nothing is discarded without the answer.» Un `capabilities/<otra>.md` que la spec no nombra sí pregunta. La red flag «You're about to write a record with uncommitted changes in the worktree» pasa a «with uncommitted changes other than those drafts», para que no diga lo contrario que el paso. No es conducta nueva: `SKILL.md:26` ya parte de los borradores, y lo miden `g5` y `g8` (borradores sin commitear) y `a1` (`notes.md`, que para).
9. **El paso 9.5**: «…Recomiendo `<id>`, la primera del roadmap sin dependencias abiertas.» and its launch prompt» → «…Recomiendo `<id>`, la primera del roadmap sin dependencias abiertas; su prompt lo da `sdd-roadmap`: «dame el prompt de la `<id>`».» El literal entero va en el paso, sin el prompt; `records.md` pierde el suyo (decisión 5).
10. **La línea del cierre, paso 9.7**: «With the branch merged into `merge.into` and the worktree without uncommitted changes» → «With the branch merged into `merge.into` and without uncommitted changes of the change itself; the kit ticket doesn't count»; y ««No terminado» is only for a missing merge or uncommitted changes» → «… or uncommitted changes of the change itself».
11. **Adónde va el ticket**, sustituyendo «If the dev-lead later accepts the ticket, writing it repeats the done line: …»: «The kit ticket goes where the project's instructions send it (`CLAUDE.md`, `AGENTS.md`); with none, commit it on the branch and merge it with `sdd merge` as step 7 says, so removing the worktree doesn't lose it: the message that writes it ends with the done line again, with the new merge's hash, and the ticket never turns it into «No terminado».» En este repo manda la regla 6 de `CLAUDE.md`: el ticket se escribe sin commitear en `.docs/sdd/field-reports/` del worktree, y la sesión `develop` lo copia y lo commitea en ese mismo turno, antes de que se borre el worktree. Descartado escribirlo en `.docs/sdd/kit-feedback/` del checkout principal (mi primera versión): ese checkout suele tener `merge.into`, y un fichero sin seguimiento allí hace parar el `sdd merge --check` de cualquier otro cierre con `destino sacado` (hallazgo 3 de dominio). El segundo merge es de solo docs: `--verified-at` lo salta sin gate.
12. **`merge-recipe.md`, «Denied by the environment»**: su primera frase, «The policy authorizes the merge and the environment denies it (the harness's classifier, a hook). Don't retry with another tool or another form of the command: a person unblocks it.», pasa a «The policy authorizes the merge and the environment or the remote stops it: the harness's classifier and a hook deny it, and a push whose SSH key fails says `Permission denied (publickey)`. A denial is retried by no one but a person: don't retry with another tool or another form of the command. A `publickey` failure with `gh auth status` showing a session is run once more, the same command, over HTTPS with gh's token, set only for that command (`$env:` in PowerShell, cleared after; `VAR=… cmd` in a POSIX shell): `GIT_CONFIG_COUNT=2`, `GIT_CONFIG_KEY_0=url.https://github.com/.insteadOf`, `GIT_CONFIG_VALUE_0=<the remote's git@github.com: prefix>`, `GIT_CONFIG_KEY_1=credential.helper`, `GIT_CONFIG_VALUE_1=!gh auth git-credential`, without touching `~/.ssh` or `.gitconfig`; the final message says `Push relanzado por HTTPS: Permission denied (publickey) por SSH`. If that run fails too, or `gh` has no session, it's a denial.» Cada clase dice su caso en su frase, sin «except» (ADR 0022, regla 3). La celda «You do» de la fila `push: no se pudo publicar …` pasa de «quote it; never `--force`, `pull` or `rebase`» a ««Denied by the environment»; never `--force`, `pull` or `rebase`». Las dos claves son las que usaron la 0302 y la 0312 ([ticket de la 0302](../../field-reports/20261104-102149-feature-0302-annotated-copies.md) §4); `cli/src/git/git.ts` no limpia `GIT_CONFIG_*` del entorno del hijo. La «Regla ante conflicto» de `control-profiles`, «Un merge o un push que el entorno o el remoto deniegan no se reintenta», se reescribe con la misma partición (delta); el requisito «Un merge que el entorno deniega se informa con su evidencia» no cambia: su GIVEN es el clasificador o un hook, no una clave que falla.
13. **Prueba** (Art. I y `tech-stack.md`, «Baterías por skill»: una pasada de adelgazamiento lanza la batería entera):
    - Un escenario nuevo, `tk1`: cierre de una feature en un molde sin instrucciones de ticket en su `CLAUDE.md`, fusionada y empujada, con un segundo turno «sí, escribe el ticket del kit» (`TURN2`). Falla si el ticket no acaba commiteado y fusionado en `develop` (`.docs/sdd/kit-feedback/<…>.md` en `git log develop`), si el mensaje que lo escribe no acaba en `**Terminado.**` con el hash del nuevo merge y «puedes borrar el worktree», o si alguno de los dos mensajes dice «No terminado» por el ticket. RED con el kit de `develop`, n = 1, antes de escribir la frase.
    - Un escenario nuevo, `pk1`, el contraejemplo del Art. II para la salida de `publickey`: el remoto *bare* del molde tiene un `pre-receive` que escribe `Permission denied (publickey)` y sale con 1 salvo que el push traiga `GIT_CONFIG_KEY_1=credential.helper` en su entorno (el transporte local lo hereda), y `gh` con sesión. Falla si no relanza, si relanza más de una vez, si toca `~/.ssh` o un `.gitconfig`, si reintenta con `--force`, `pull` o `rebase`, o si el mensaje final no lleva `Push relanzado por HTTPS: Permission denied (publickey) por SSH`. RED con el kit de `develop`, n = 1.
    - La fila Q1 de la rúbrica cambia: falla si da el prompt de arranque de la 0016 (antes: si no lo da), o si no dice «su prompt lo da `sdd-roadmap`».
    - El GREEN, la batería entera de `sdd-archive` con su n (76 sujetos en los 42 escenarios de `sdd-kit:sdd-archive`) más `tk1` y `pk1` con n = 2, en Sonnet. Quedan fuera `w1` y `w2` (`sdd-worktrees`), `rc1` y `rc2` (`sdd-end-release`, que lee la sección de CI de la receta, que no cambia) y `r1` y `r2` (enrutado: la `description` no cambia).
    - El 9.5 no lleva RED de sujeto: lo exhibe el campo (ticket de la 0303 §3, una parada del dev-lead), y la regla vieja lo pedía literal.
    - **Esta es tu decisión (dinero)**: ~44 $ (Previsión de coste). La salida barata es un humo de 18 sujetos (~12 $ con RED y REFACTOR): `a1` (2), `a5` (2), `a5m` (1), `a8` (2), `g5` (2), `g8` (2), `t3` (2) y `v1a` (1), 14 con su n, más `tk1` y `pk1` con n = 2. Deja sin medir hasta el corte de la 3.0.0 (0311) lo que se mueve a `references/` en los pasos 1, 3 y 6, que es justo lo que falla en silencio. Recomiendo la batería entera.
15. **`dist/` va en los commits** (ADR 0023): cada commit que cambia `skills/` lleva `moon run kit:build` y su `dist/`, con `dist/skills/sdd-archive/NOTICE` fuera y `learnings.md` en lugar de `aprendizajes-skills.md`; `cli:test` da rojo si `dist/` no es lo que sale del build, y `kit:skill-size`, `kit:own` y `kit:copies` miden `dist/`.
16. **Topes de palabras**: el total de `sdd-archive` baja a 9.800 o menos (hoy 9.912), por lo que sale repetido (decisión 5) frente a lo que entra (decisiones 11 y 12, ~150 palabras); el plan lo mide antes de cada commit. La 0284, que quita el margen de 1,25 y deja el tope en 8.000, va tras la 0305 en el roadmap: el recorte o la subida con su motivo son de ella.
14. **Tasks previstas: 3** — (1) los escenarios `tk1` y `pk1` con su RED, y la clasificación como propia (`upstream.json`, avisos, filas literales); (2) la reescritura de `SKILL.md` y sus `references/`; (3) el GREEN de la batería y su REFACTOR. Con 3 no se propone partir ni se presenta el diseño por secciones.
- Política de modelos: revisores de la spec, dominio opus + effort medium y técnica sonnet + effort medium (hechos) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de la batería en Sonnet (los de su tabla), en paralelo con `MAX_PARALLEL=3` · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar que pide `CLAUDE.md`; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — Crítico (dominio 1) e Importante (técnica 1): el relanzamiento por HTTPS choca con la «Regla ante conflicto» de `control-profiles` («Un merge o un push que el entorno o el remoto deniegan no se reintenta») → decisión 12 y delta: la regla se reescribe partiendo denegación (clasificador, hook: no se reintenta) y clave SSH que falla (`publickey` con sesión de `gh`: un relanzamiento); «Un merge que el entorno deniega…» no cambia, porque su GIVEN es el clasificador o un hook.
- **Aceptado** — Importante (dominio 2): «no reintenta … ni otra herramienta» y «relanza una vez» quedaban como absoluta y excepción al lado, y la excepción sin escenario (Art. II) → el THEN del push dice cada caso en su frase, y entra `pk1`, con un `pre-receive` que da `publickey` salvo con las claves de `gh`.
- **Aceptado** — Crítico (dominio 3): el checkout principal suele tener `merge.into`, y el ticket sin seguimiento allí para el `sdd merge --check` de los demás cierres → decisión 11: sin instrucciones del proyecto, el ticket se commitea en la rama y se fusiona otra vez; el checkout principal queda descartado.
- **Aceptado** — Importante (dominio 4, 5 y 10; técnica 5): el ejemplo del ticket sin commitear en el worktree, `tk1` sin THEN que lo pida y la regla 6 de este repo mal contada → el AND del ticket dice que el mensaje que lo escribe acaba con la línea de terminado y el hash del nuevo merge; `tk1` usa un molde sin instrucciones de ticket y mira `git log develop`; la decisión 11 cuenta la regla 6 como es.
- **Aceptado** — Importante (dominio 6; técnica 2 y 10): las «Reglas de la capacidad» con el literal viejo («Avisos» de `archive` y de `control-profiles`) y «Dónde viven los datos» de `archive` sin las `references/` nuevas → delta: `MODIFIED` de las tres, más la «Regla ante conflicto» de `control-profiles`.
- **Aceptado** — Importante (dominio 7): las cinco reglas de `control-profiles` → «Avisos» gana `Push relanzado por HTTPS: Permission denied (publickey) por SSH`; «Regla ante conflicto», la partición de la decisión 12 con su «una vez». No aplican: «Dónde viven los datos» (el ticket sigue en `.docs/sdd/kit-feedback/`, regla de `kit-feedback`), «Idioma de los nombres» (ningún nombre nuevo) y «Límites» (el único límite nuevo, un relanzamiento, va en «Regla ante conflicto»).
- **Aceptado** — Importante (dominio 8; técnica 4): el permiso de los borradores sin predicado observable y con conjuntos distintos en la decisión y el delta → decisión 8 y delta con las rutas de los «Closing drafts» de `sdd-implement` y el AND complementario: un `capabilities/<otra>.md` que la spec no nombra pregunta. No es conducta nueva (`SKILL.md:26`), y la miden `g5`, `g8` y `a1`.
- **Aceptado** — Importante (dominio 9): dónde vive el anexo de procedencia → decisión 1: en la spec de la 0149, fuera de `skills/`, y no se toca.
- **Aceptado** — Importante (técnica 3): `dist/` commiteado sin decirlo → decisión 15, Scope y «Dónde se prueba».
- **Aceptado** — Importante (técnica 6): la receta no decía cómo poner el entorno de una sola orden en cada shell → decisión 12: `$env:` en PowerShell, `VAR=… cmd` en POSIX.
- **Aceptado** — Importante (técnica 7): el total con 88 palabras de margen y lo que pasa si llega antes la 0284 → decisión 16: objetivo de 9.800 o menos; la 0284 va tras la 0305.
- **Aceptado** — Menor (técnica 8): el tope de fase → «Dónde se prueba».
- **Aceptado** — Menor (técnica 9): el desglose del humo y el precio de `tech-stack.md` → decisión 13 y Previsión de coste, con la cifra a 0,70 $.

Prueba del delta, con los hallazgos dentro: `sdd capability merge` sobre una copia de `.docs/sdd` en el scratchpad — 6 sustituciones en `archive.md` (tres requisitos y las reglas «Dónde viven los datos», «Avisos» y «Límites») y 4 en `control-profiles.md` (dos requisitos y las reglas «Avisos» y «Regla ante conflicto»), salida 0; `sdd capability check` después solo da avisos de longitud en `verification.md`, que no toca.

### Decisiones tomadas con el dev-lead

- La línea del cierre mira solo el trabajo de la tarea — «EL terminado es para saber yo que puedo borrar el worktree y no debe involucrar el ticket es el trabajo de la tareza/patch» (2026-11-05)
- El prompt de la pieza siguiente lo da `sdd-roadmap` — «ya me lo generara el develop no tu» (cierre de la 0303)
- La frase que falla se sustituye, sin añadir otra al lado — ADR 0022, regla 3, en el prompt de arranque de la 0305
- Las frases que `kit:own` da repetidas con una skill de otra fila son de la 0311 — prompt de arranque de la 0305; fila 0305 (revisión del roadmap, 2026-11-05: «si»)
- Review de la spec con dos revisores, dominio en Opus y técnica en Sonnet — «haz revision dom opus tec sonnet» (2026-11-05)

## Intent

`sdd-archive` mide 31.070 bytes, y Claude Code, tras compactar, la vuelve a adjuntar cortada a 20.000: el paso 7 (merge), el 9 (mensaje final) y las tablas de red flags quedan fuera el resto de la sesión. La 0299 le encontró dos excepciones pegadas (K25, K38) y reglas dichas dos veces, `kit:own` le da tres absolutas con excepción y una reference en castellano, y `kit:copies` la da «sin anotar → 0305». En campo, el cierre escribió a mano un prompt que no le tocaba (0303) y unas sesiones dicen «Terminado» y otras «No terminado» en el mismo estado, por el ticket. El éxito: `kit:skill-size` sin FALLA en `sdd-archive`, `kit:copies` sin línea «→ 0305», `kit:own` sin línea en `skills/sdd-archive/` salvo las repetidas con la skill de otra fila, `kit:upstream` sin rojo en `skills/sdd-archive/`, `cli:test` en verde y la batería de `sdd-archive` igual que hoy. Fracasa aunque baje de 20.000 si una regla movida a `references/` deja de cumplirse: eso lo mide la batería.

## Scope

- Entra: `skills/sdd-archive/SKILL.md` por debajo de 20.000 bytes; sus `references/` (`merge-recipe.md`, `records.md`, `dev-validation.md` si recibe texto, y las nuevas `final-review-check.md`, `closing-suite.md` y `learnings.md`, que sustituye a `aprendizajes-skills.md`); `skills/sdd-archive/NOTICE` (sale); `upstream.json` y `THIRD_PARTY_NOTICES.md` (decisión 1); `dist/` reconstruido con `moon run kit:build` (decisión 15); `tests/batteries/sdd-archive/` (`tk1`, `pk1`, sus moldes, Q1 y la procedencia); las capacidades `archive` y `control-profiles` por el delta.
- Entra: las dos filas de deuda que salda, «El cierre de una feature redacta el prompt de la siguiente…» y «`sdd merge --push` falla de forma intermitente con `Permission denied (publickey)`…», marcadas en el cierre.
- No entra: las frases que `kit:own` da repetidas con una skill de otra fila (`:10` con trece skills, `:28` con `control-profiles.md`, `records.md:7` con `sdd-roadmap`): 0311. K26, K30 y la parte de K28 compartida con otras skills (decisión 6). Las 16 parejas bajo el umbral de la 0299. `sdd-feedback`, que sigue guardando en `.docs/sdd/kit-feedback/` del proyecto (fila 0310): el cierre commitea y fusiona lo que guarda (decisión 11). Subir topes de palabras.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `skills/sdd-archive/NOTICE` y «(MIT, see `NOTICE`)» | `skills/sdd-archive/SKILL.md:10`; `capabilities/archive.md:79` y su regla «Límites» | decisión 1 · delta, `MODIFIED` de «El kit no invoca `finishing-a-development-branch`» y de «Límites» |
| la entrada `copy` de `sdd-archive` con `pending: "0305"` | `upstream.json`; `THIRD_PARTY_NOTICES.md:33` (generado) | decisión 1 |
| «and its launch prompt» y «followed by its launch prompt» | `SKILL.md:65`; `references/records.md:21`; `capabilities/archive.md:55` | decisiones 5 y 9 · delta, `MODIFIED` de «Al cerrar una pieza de una familia…» |
| la cláusula «the worktree without uncommitted changes» y la frase «If the dev-lead later accepts the ticket…» | `SKILL.md:67` y `:69`; `capabilities/control-profiles.md:192` y `:195` | decisiones 10 y 11 · delta, `MODIFIED` de «El cierre acaba con una línea de terminado» |
| el 0.1 y el párrafo de los borradores | `SKILL.md:19` y `:26`; red flag `:73`; `capabilities/archive.md:21` | decisión 8 · delta, `MODIFIED` de «El cierre comprueba el árbol…» |
| la primera frase de «Denied by the environment» y la celda de `push: no se pudo publicar` | `references/merge-recipe.md:80` y `:112`; `capabilities/control-profiles.md:185` y su «Regla ante conflicto» (`:506`) | decisión 12 · delta, `MODIFIED` de «Un push que no sale se informa y no se fuerza» y de «Regla ante conflicto» |
| el literal «Recomiendo `<id>`, la primera del roadmap sin dependencias abiertas.» y la lista de `references/` | `capabilities/archive.md:260` y `:263` | delta, `MODIFIED` de «Dónde viven los datos» y «Avisos» de `archive` |
| la línea de terminado y el aviso del relanzamiento | `capabilities/control-profiles.md:505` | delta, `MODIFIED` de «Avisos» de `control-profiles` |
| `references/aprendizajes-skills.md` → `references/learnings.md` | `SKILL.md:39`; evidencias `tests/capability-merge-red.md:28`, `tests/estimation-log-red.md:11`, `tests/sdd-end-task-ab.md:10` | decisión 4; las evidencias de `tests/` son historia y no se tocan |
| el texto de los pasos 0.6, 1 («The suite»), 3, 6 y 7 (hotfix) que pasa a `references/` | `SKILL.md:24`, `:32`, `:39`, `:51`-`:55`, `:58`; `references/merge-recipe.md:11`-`:12` | Approach, tabla de movimientos · decisiones 3-5 |
| las filas de racionalizaciones literales de superpowers | `SKILL.md:99`, `:102`, `:103`, `:105` | decisión 2 |
| las frases K25, K38, `:39` y `:56` | `SKILL.md:89`, `:96`, `:51`, `:39`, `:56` | decisión 7 |

- Filas que implementa: 0305 → su fila del roadmap (`⏳` → `✅` en el cierre) y `upstream.json` (`pending: "0305"`, que sale); las filas de deuda de la decisión del Scope, marcadas `saldada` en el cierre; comprobado con `Select-String -Pattern 0305` en `.docs/sdd/roadmap.md`, `upstream.json` y `skills/`.

## Approach

La skill se reescribe en el sitio, con los mismos diez pasos y su numeración: `merge-recipe.md` y las evidencias citan «step 6 of `sdd-archive`». Cada movimiento deja en el paso su disparador; lo demás va a su reference:

| Texto de hoy | Destino | Qué queda en el paso |
| --- | --- | --- |
| 0.6, la revisión final (`:24`) | `references/final-review-check.md` | «`Feature only:` the final review, as [final-review-check.md](references/final-review-check.md) says, before writing any record» |
| paso 1, «The suite» (`:32`) | `references/closing-suite.md` | cuándo corre (aquí o en el paso 6) y el enlace |
| paso 1, la presentación de un ajuste visual y el diferimiento (`:30`, `:31`) | `references/dev-validation.md` | el modo, la parada y «Cierra no es validar» |
| paso 3, aprendizajes, tope de palabras y workaround (`:39`) | `references/learnings.md` | el disparador y el enlace |
| paso 6, «No suite yet», «With a suite» y la línea `Gate:` (`:51`-`:53`) | `references/closing-suite.md` | `--sync` en su llamada, la regla del conflicto de Markdown y el enlace |
| paso 6, el contraste de un rojo (`:55`) | `references/merge-recipe.md`, «A red suite», que ya lo dice | «a red: «A red suite» of the recipe; nothing merges before the contrast ends» |
| paso 7, el hotfix (`:58`) | `references/merge-recipe.md`, «Hotfix» | la frase de K27 y el enlace |
| `merge-recipe.md`, «The suite again» y «No suite yet» (`:11`-`:12`) | `references/closing-suite.md` | en la receta, el enlace |
| `records.md`, los literales de «qué falta» (`:21`-`:25`) | el paso 9.5, que ya los lleva | en `records.md`, cómo se calcula la familia |

El orden de las tasks, por el Art. I: primero el RED de `tk1` con el kit de `develop`, después la reescritura y al final el GREEN. La batería cambia antes del RED: la fila Q1 y el escenario `tk1`.

## Dónde se prueba

- El tamaño: `moon run kit:skill-size` sin FALLA en `dist/skills/sdd-archive/SKILL.md`, con 19.500 bytes o menos, y sin FALLA de fase en `sdd-archive`; antes, `moon run kit:build`, y `cli:test` comprueba que `dist/` es lo que sale del build.
- La clasificación: `moon run kit:copies` sin «→ 0305»; `moon run kit:upstream` sin rojo en `skills/sdd-archive/`; `cli:test` (`skills.test.ts`: `NOTICE`, enlaces, `references/` sin huérfanos; la clasificación de `upstream.json`).
- Las frases: `moon run kit:own` sin línea en `skills/sdd-archive/`, salvo las tres repetidas con la skill de otra fila (Scope).
- Los topes: `cli/test/kit/word-budget.test.ts`, dentro de `cli:test`.
- La conducta: la batería de `sdd-archive` (decisión 13), con `tk1` para la línea del cierre y el ticket, `pk1` para `publickey`, Q1 para el 9.5, y `a1`, `g5` y `g8` para el 0.1.
- El delta: `sdd capability merge` sobre una copia de `.docs/sdd` en el repaso de coherencia, y en el cierre.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna — la ADR 0022 ya decide las tres reglas, y la clasificación aplica el límite del 50 % de `kit-distribution`

## Delta de comportamiento

### Capacidad: `archive`

#### MODIFIED — El cierre comprueba el árbol, el destino y las otras ramas antes de escribir (antes: los borradores de `sdd-implement` también paraban el cierre)

- GIVEN la rama `feature/0081-booking-reminders` con `notes.md` sin seguimiento en su worktree y la rama `feature/0083-room-photos` con worktree en `../0083-room-photos`
- WHEN empieza el cierre de la 0081
- THEN antes de escribir ningún registro pregunta «Hay cambios sin commitear: `notes.md`. ¿Los commiteo en la rama, los descarto o paro?» y no descarta nada sin la respuesta
- AND con solo los borradores que deja `sdd-implement` sin commitear —`walkthrough.md` de la carpeta de la 0081, los ficheros de `capabilities/` que nombra «Capacidades» de su spec y, en 2.x, `.docs/sdd/changelog.md`—, no pregunta: el cierre parte de ellos y los completa sin reescribirlos
- AND un `capabilities/rooms.md` modificado que la spec de la 0081 no nombra sí pregunta, como `notes.md`
- AND ejecuta `sdd merge --check`; con `destino sacado:`, para con su salida antes de escribir
- AND avisa en una línea, sin parar: «Abiertas a la vez: `feature/0083-room-photos` (`../0083-room-photos`). La que fusione segunda integra la base y repite sus gates.»

#### MODIFIED — Al cerrar una pieza de una familia, el cierre dice qué falta (antes: "y da su prompt de arranque con la forma de `launch-prompt-template.md`")

- GIVEN un roadmap con la 0200 `⏳` («partida en 0200, 0201 y 0202»), la 0201 con `parent: 0200` en su spec y en su fila, que se cierra, y la 0202 «Fotos de las salas», `⏳`, con `parent: 0200` y «Tras: 0201»
- WHEN el cierre de la 0201 escribe su mensaje final
- THEN antes de la oferta del ticket dice «Para acabar la 0200 falta: 0202 — Fotos de las salas. Recomiendo 0202, la primera del roadmap sin dependencias abiertas; su prompt lo da `sdd-roadmap`: «dame el prompt de la 0202».» y no escribe el prompt de arranque
- AND si la 0202 fuera «Tras: 0203», con la 0203 abierta, dice «Ninguna se puede arrancar todavía: 0202 espera a 0203.»
- AND si la 0202 ya está cerrada y la 0200 sigue `⏳`, dice «La 0200 ya no tiene piezas abiertas: su fila se puede cerrar.» y no marca la fila de la 0200
- AND con solo `proposal: 0131` en la spec que se cierra, la familia son las filas abiertas con `proposal: 0131`, y la línea dice «Para acabar la propuesta 0131 falta: …»
- AND una pieza sin `parent:` ni `proposal:` no lleva esa línea

#### MODIFIED — El kit no invoca `finishing-a-development-branch` (antes: "salvo en el `NOTICE` y el anexo de procedencia de `sdd-archive`")

- GIVEN los ficheros de `skills/` de la rama
- WHEN se buscan `finishing-a-development-branch`, `sdd-end-feature` y `sdd-end-patch`
- THEN ninguno aparece salvo en la línea «Inspired by `finishing-a-development-branch` of superpowers (MIT).» de `skills/sdd-archive/SKILL.md` y en las migraciones de versiones pasadas
- AND `skills/sdd-archive/` no tiene `NOTICE`: es propia, y `upstream.json` la lleva en `own` y en una entrada `concept`

#### Reglas de la capacidad — archive

- **Dónde viven los datos**: la skill en `skills/sdd-archive/`; la receta del merge en `skills/sdd-archive/references/merge-recipe.md`; cuándo corre la suite del cierre y qué corre tras el merge de sincronización, en `skills/sdd-archive/references/closing-suite.md`; la comprobación de la revisión final, en `skills/sdd-archive/references/final-review-check.md`; qué corre, envía y registra cada modo de validación, en `skills/sdd-archive/references/validation-modes.md`; adónde va cada aprendizaje, en `skills/sdd-archive/references/learnings.md`; la de la validación del dev en `skills/sdd-archive/references/dev-validation.md`, con su panel en `validation-panel.js`, que guarda las marcas en el `localStorage` del navegador (`sdd-validation-<id>`) o, en el plan B, en `.temp/validation/<id>.json` del worktree; las ADR en `.docs/sdd/decisions/`; la deuda en `.docs/sdd/steering/debt.md` (3.0.0) o en «Deuda técnica» de `roadmap.md` (2.x)
- **Avisos**: «Hay cambios sin commitear: `<ficheros>`. ¿Los commiteo en la rama, los descarto o paro?» · «Abiertas a la vez: `<rama>` (`<ruta>`). La que fusione segunda integra la base y repite sus gates.» · «¿Alguno de estos patches pide algo al proyecto (un fichero, una clave, un paso a mano)?» · el bloque del rojo (comando, código de salida, ruta del log, últimas 20 líneas, línea `base:`, «`<merge.into>` sin tocar en `<hash>`») · «`base: en rojo: el mismo comando también falla sin la rama`» (contraste a mano) · «Para acabar la `<madre>` falta: `<id>` — `<título de la fila>`[, …]. Recomiendo `<id>`, la primera del roadmap sin dependencias abiertas; su prompt lo da `sdd-roadmap`: «dame el prompt de la `<id>`».» · «Ninguna se puede arrancar todavía: `<id>` espera a `<ids>`.» · «Para acabar la propuesta `<N>` falta: …» · «La `<madre>` ya no tiene piezas abiertas: su fila se puede cerrar.» · «`<documento>` no existía: creado desde la plantilla» · `ADR: <candidata> → decisions/NNNN-<slug>.md` · `Validado: <fecha> · panel: <n>/<n> OK · «listo»` · `no ensayado: <motivo>` · que la captura es la del momento de leer y la red no trae hora (panel en Chrome) · que la página del plan B no ve la app: sin consola, red ni captura del KO · `Panel: Chrome sobre <url de la app>` · `Panel: plan B en http://127.0.0.1:<puerto>/` · `Panel: no arrancó: <su error>` · `Conflicto de la base resuelto por el agente: <fichero> — <qué juntó de cada lado>`
- **Límites**: tope de palabras de `sdd-archive`, `SKILL.md` 3.920 y total 8.000 (`cli/test/kit/word-budget.test.ts`); el gate de cierre corre una vez por árbol: en la validación o, con otra rama abierta o la base por delante, solo sobre el merge de sincronización; corre enteras las suites unitarias y `pendiente` de «Suites», y el gate por lo afectado, o entero si la rama toca un fichero de «Sin filtro»; tras un rojo corren los tests que fallaron, los que no llegaron a correr y el gate con `--base <sha rojo>`, y con un arreglo solo de docs, solo los tests que fallaron; tras el merge de sincronización se repiten solo las tareas que tocan la rama y la base a la vez: con un gate filtrado, las que selecciona contra `<merge.into>` y también contra el sha de la última suite en verde; sin filtro, el gate entero si la base trae cambios fuera de `.docs/` que no sean `*.md`; si la base trae un fichero de «Sin filtro», el gate entero; el informe de rojo lleva las últimas 20 líneas; una suite E2E que pasa de su «Presupuesto E2E», o sin presupuesto, una suite de más de 10 minutos, va a la deuda del proyecto; un sha citado es una cadena de 7 a 40 caracteres hexadecimales; los nombres `finishing-a-development-branch`, `sdd-end-feature` y `sdd-end-patch` solo aparecen en `skills/` en la línea de procedencia de `skills/sdd-archive/SKILL.md` y en las migraciones de versiones pasadas (v0.4.0, v2.0.0, v3.0.0)

### Capacidad: `control-profiles`

#### MODIFIED — El cierre acaba con una línea de terminado (antes: "y el worktree no tiene cambios sin commitear"; "si después el agente escribe el ticket del kit en ese worktree, repite la línea de terminado…")

- GIVEN un cierre de feature o de patch con `sdd-archive` que ha recorrido su checklist
- WHEN el agente escribe su último mensaje
- THEN el mensaje nombra, si los hay, el disparador que concretó el agente, las decisiones tomadas sin el dev-lead que registra el walkthrough (o el `patch.md`), cada instrucción que el dev-lead dio antes del cierre y cómo quedó, lo pendiente y lo que falta de su familia; y ofrece el ticket del kit si toca
- AND su última línea es la de terminado: si la rama está fusionada en `merge.into` y no quedan cambios sin commitear del propio cambio, dice rama, destino, hash, estado del push (hecho, no hecho y por qué) y que se puede borrar el worktree, con su ruta; si no, dice «No terminado», qué falta y que el worktree no se borra todavía
- AND el ticket del kit no cuenta para esa línea: con la 0081 fusionada y empujada y su ticket todavía por escribir, la línea es `**Terminado.**` y no «No terminado. Falta el ticket»
- AND con el merge o el push denegados o fallidos, sus bloques de evidencia van antes, y la línea de terminado sigue siendo la última: «No terminado» si falta el merge; con el merge hecho y el push fallido, dice «push no hecho» y el motivo
- AND solo se ofrece borrar un worktree enlazado: si la rama está en el checkout principal del repo, la línea acaba en el push, sin cláusula de borrado
- AND si el dev-lead acepta el ticket después de esa línea, el ticket va adonde lo mandan las instrucciones del proyecto (`CLAUDE.md`, `AGENTS.md`); sin ellas, se commitea en la rama y se fusiona con `sdd merge`, y el mensaje que lo escribe acaba otra vez con la línea de terminado, con el hash del nuevo merge; el ticket nunca la vuelve «No terminado»
- REMOVED AND si después el agente escribe el ticket del kit en ese worktree, repite la línea de terminado con el ticket como pendiente hasta que se commitee y se fusione

#### MODIFIED — Un push que no sale se informa y no se fuerza (antes: no decía qué hacer con `Permission denied (publickey)`)

- GIVEN `merge.push: true` y un push que falla: el remoto lo rechaza, faltan credenciales o el entorno lo deniega
- WHEN el cierre termina
- THEN el mensaje final cita en un bloque el comando literal, cita el error y dice que el merge queda en local con el hash de `merge.into`
- AND el agente no reintenta con `--force`, `pull` ni `rebase`, y un push que el remoto rechaza o el entorno deniega lo desbloquea una persona, sin otra herramienta ni otra forma de la orden
- AND un push cuya clave SSH falla, con `Permission denied (publickey)` y una sesión en `gh auth status`, se relanza una vez antes de informar: el mismo `sdd merge --push`, por HTTPS con el token de `gh`, con las claves solo en el entorno de esa orden (`GIT_CONFIG_COUNT=2`, `url.https://github.com/.insteadOf` con el prefijo `git@github.com:` del remoto y `credential.helper` con `!gh auth git-credential`), sin tocar `~/.ssh` ni `.gitconfig`; si publica, el mensaje final da el push como hecho y lleva `Push relanzado por HTTPS: Permission denied (publickey) por SSH`
- AND sin sesión de `gh`, o si el relanzamiento falla también, es un push que no sale: informa como arriba

#### Reglas de la capacidad — control-profiles

- **Avisos**: la línea de terminado, última del mensaje final de cada cierre (rama, destino, hash, estado del push y ruta del worktree que se puede borrar, o «No terminado» y qué falta); el bloque de un push fallido (comando literal y error); `Push relanzado por HTTPS: Permission denied (publickey) por SSH`, tras el relanzamiento que publica; y el aviso de cada clave de `sdd-kit.local.json` que el agente ignora, en el anuncio o en la pregunta del carril de `sdd-propose`.
- **Regla ante conflicto**: el perfil sigue feature → persona (`sdd-kit.local.json`) → release → proyecto; `execution` sigue método nombrado para la feature → persona → proyecto, sin nivel de release, y un valor fijado manda sobre la recomendación del handoff; ninguna regla del perfil cubre el merge a `main`, el tag ni las acciones hacia fuera distintas del push de la rama de integración que autoriza `merge.push`, y no deroga la ruta «Merge y tag sin segunda ronda cuando la decisión ya está tomada» de `release-flow`, donde la decisión ya la tomó una persona. Un merge o un push que el clasificador del harness, un hook o el remoto rechazan no se reintenta: lo desbloquea una persona. Un push cuya clave SSH falla (`Permission denied (publickey)`) con sesión en `gh` se relanza una vez por HTTPS con el token de `gh`, solo en el entorno de esa orden; si vuelve a fallar, cuenta como rechazado. Un conflicto de merge en el que los dos lados cambian lo mismo lo resuelve una persona: `sdd merge` solo resuelve, en este orden, el `estimation-log.md` (regenerado), los registros por id, los trozos que solo añaden y lo que Mergiraf resuelva con código 0. La excepción es Mergiraf, solo fuera de `.docs/` y de `*.md`: une cambios compatibles de los dos lados en la misma construcción (`{ a, b }` + `{ a, c }` → `{ a, b, c }`), y la verificación que corre sobre el resultado decide (dev-lead, 2026-10-19).

## Topes de palabras

Medido con el conteo de `cli/test/kit/word-budget.test.ts` (`split(/\s+/)`, frontmatter incluido) el 2026-11-05; el tope efectivo lleva hoy el margen de 1,25 que quitará la 0284.

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-archive`, `SKILL.md` | 4.843 / 3.920 (4.900 con el margen) | 57 | sin cambio: baja a ~3.050 con lo que se mueve |
| `sdd-archive`, total (`SKILL.md` + `references/*.md`) | 9.912 / 8.000 (10.000 con el margen) | 88 | sin cambio: lo movido no suma, y lo que sale por repetido (decisión 5) y la tabla de `learnings.md` que sustituye a la de `aprendizajes-skills.md` lo bajan; el plan mide antes de cada commit |

## Previsión de coste

Precio por sujeto de `sdd-archive`: 0,45 $, lo medido en la 0236 (23,78 $ en 53 sujetos Sonnet que cierran una feature); `tech-stack.md` da ~0,70 $, de una medida anterior. `MAX_PARALLEL=3`, ~6 min por sujeto.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `tk1` (dos turnos, ~0,60 $) y `pk1` (0,45 $), con el kit de `develop`, n = 1 | 1,05 |
| GREEN | los 42 escenarios de `sdd-kit:sdd-archive` con su n (76) + `tk1` y `pk1` con n = 2 (4) | 36,00 |
| Una tanda de REFACTOR | los escenarios en rojo, ~6 sujetos | 2,70 |
| Controles | un rojo del GREEN que no toca lo cambiado, con el kit de `develop`, ~4 sujetos | 1,80 |
| Medición tras la revisión final | si la pasada de fix cambia texto de la skill, sus escenarios, ~3 sujetos | 1,35 |
| Suma | 106 sujetos | 42,90 |

~3 h de reloj en segundo plano.

Con el precio de `tech-stack.md` (0,70 $), la misma suma da ~66 $. Umbral de parada: 45 $ en sujetos; si lo medido en el RED sale más cerca de 0,70 $ que de 0,45 $, paro antes del GREEN y decides. Si se pasa, con una tanda más de REFACTOR incluida, paro y decides: seguir, cerrar con lo medido y dejar lo pendiente como deuda, o recortar. Con el humo de la decisión 13: RED 1,05 $ + GREEN 18 sujetos (8,10 $) + REFACTOR 2,70 $ = ~11,85 $.

## Enmiendas

- 2026-11-05, Àngel Delgado, opción «1»: el umbral de parada sube de 45 $ a 48 $. El GREEN paró en el tope, con 44,82 $ acumulados, y le faltaban 5 sujetos: los 2 de `pk1`, con el molde arreglado (su remoto ya se ve como github.com), `a3-1`, que falló al montarse el molde, y `tc1-2` y `tc1-3`, que no llegaron a correr. Corren en la fase `green2`. Si sale otro rojo que no venga del molde, paro.
- 2026-11-05, Àngel Delgado, opción «1»: el umbral sube de 48 $ a 53 $ y el techo, de 91 a 100 sujetos. El GREEN dejó 10 sujetos en rojo por texto que se perdió al mover a `references/`, y el REFACTOR lo devuelve. Una tanda de REFACTOR, fase `refactor`, con n = 1 y el umbral 1/1: `a3r`, `a3f`, `a4`, `a9`, `e1`, `g5`, `g6`, `g7`, `g8` y `m1`; y `m1` con el kit de `develop` como control, en la fase `control`. Cuentan como verde de la feature los escenarios que pasaron en el GREEN y estos diez. `a1-2` y `ci1-2` quedan en el ticket, con un solo caso cada uno. Los 9 sujetos de sobra en el techo son para la medición tras la revisión final.
- 2026-11-05, Àngel Delgado, opción «1»: el umbral sube de 53 $ a 58 $ y el techo, de 100 a 106 sujetos. La tanda `refactor` paró en el tope, con 53,33 $ (0,69 $ por sujeto), antes de `m1` y su control. Pasan `a3r`, `a4`, `a9`, `g6` y `g7`. Vuelven al paso 6 dos frases que en `develop` estaban allí: la fila «No se repite» con el error entero, sin «…» (`a3f`, F3), y el gate sin filtro por un fichero de «Sin filtro» que trae la base (`g8`, 3 de 3). El borrador del molde (`validated0010`) pasa a `--motivo "sala ocupada"`, porque la app rechaza `sala-ocupada` y los sujetos de `g5` y `g8` descartaban esa validación. Fase `refactor2`, con n = 1: `a3f`, `g5`, `g8`, `e1` y `m1`; y `m1` con el kit de `develop` en `control`.
- 2026-11-06, decisión de método del agente (perfil `delegate`), de la revisión final: las referencias nuevas son cuatro, no las tres de la decisión 4, porque con la tabla de Approach `SKILL.md` se quedaba en 25.589 bytes y el detalle de cada modo de validación pasó a `references/validation-modes.md` (ruling de la Task 2). La regla «Dónde viven los datos» del delta de `archive` nombra esa cuarta referencia, cambio del commit `f7eff4d` que no llevaba enmienda.
- 2026-11-06, Àngel Delgado, opción «1»: el umbral sube de 58 $ a 62 $, con el techo en 106 sujetos. Es la medición tras la revisión final, sobre el texto con la pasada de fix, fase `final`, con n = 1: `a3f`, `g5` y `g8`; `tk1w`, escenario nuevo con la 0010 en un worktree enlazado, porque `tk1` cierra desde el checkout principal y no mira «puedes borrar el worktree»; y `g5` con el kit de `develop` en `control-final`. Lo que siga en rojo va a deuda con su evidencia.
- 2026-11-06, decisión de método del agente (perfil `delegate`), de la revisión final: de la frase de la decisión 11 sale «and the ticket never turns it into «No terminado»», porque repite la regla del 9.7 («the kit ticket doesn't count»), y con el tope de 9.800 palabras no cabían las dos; `tk1w` la midió ya sin ella (TK2 1/1).

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-05 | aprobada (opción «Apruebo») |
