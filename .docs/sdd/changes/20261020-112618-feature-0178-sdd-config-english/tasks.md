---
id: 20261020-112618-feature-0178-sdd-config-english
title: Tasks — sdd-config en inglés, con la tabla pricing y la clave review.minors
spec: ./spec.md
plan: ./plan.md
created: 2026-10-20
---

# Tasks — sdd-config en inglés, con la tabla pricing y la clave review.minors (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0178-sdd-config-english`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | `sdd-config` en inglés con `review.minors` y `pricing` | done | 900f5af1 | `cf1` necesitó una ronda de forma; dos Pester más leían el catálogo en castellano (rulings) |
| 2 | `review.minors: fix` en el cierre de la revisión final | done | cda11f85 | dos tandas de REFACTOR: la regla tenía que estar también en `sdd-implement` |
| 3 | Enrutado con la `description` nueva y `review.minors: fix` en este repo | done | d2ca1622 | techo de sujetos 50 → 55 (enmienda aprobada) |

## Verificación por task

- [x] Task 1 — Pester de `sdd-config`, contrato y topes en verde; humos `cf1` y `cf2` 1/1 y `n4` de `sdd-init` 1/1
- [x] Task 2 — `c1f` 2/2 tras dos tandas de REFACTOR y `c1` 1/1 de control
- [x] Task 3 — batería de `using-sdd` 24/24; `review.minors` = `fix` en `sdd-kit.json`

Revisión final: Spec opus+high, with fixes (3 Important, 5 Minor) · Código sonnet+high, with fixes (1 Important, 4 Minor) · Arquitectura no (plan), sobre d2ca1622
Pasada de fix: juntada en el cierre, 3 Important y 7 Minor (review.minors: fix), 6 con test RED→GREEN, Pester 261/261; enmienda de onboarding aprobada
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, todos ADDRESSED, 4 Minor nuevos adjudicados (2 arreglados en el cierre, sin revisar)

## Rulings

- Pre-flight: Ruling: la racionalización «I'll fix the minors too while I'm in there» de sdd-implement (Native loop) habla de arreglar Minor durante una task, no de la revisión final; se queda — la clave de la spec es de la revisión final (decisión 8) — coste si me equivoco: un sujeto con `fix` que dude al ver esa fila
- Task 1: Ruling: los topes aprobados en la spec suponían que la traducción ahorraba palabras; medido sin recortar, sdd-config daba 1.528. Ajusté la redacción sin quitar ninguna instrucción hasta 1.449 (tope 1.450) — coste si me equivoco: una frase más seca que la de antes
- Task 1: Ruling: NativeAdapt.Tests.ps1 y NativeDefault.Tests.ps1 también fijan la pregunta 6 de sdd-config en castellano (la spec solo listaba SddConfig.Tests.ps1); pasan a sus frases en inglés, el Scope ya cubría «Pester» — coste si me equivoco: ninguno
- Setup: Ruling: línea base del gate con cli:test 1078/1078 y cli:typecheck en verde; kit:test 1332 verdes y 2 rojos causados por la reescritura de sdd-config, que corría a la vez (NativeAdapt, NativeDefault); cli:test-slow y cli:test-min no corrieron por ese rojo; sin cambios en cli/, corren en el gate final — coste si me equivoco: un rojo de la base que se vería solo en el gate final
- Task 1: Ruling: GREEN ronda 1 de cf1 0/1 en forma (enseñó pricing como falta y preguntó «¿la escribo?» sin leer la página ni enseñar la tabla); fallo de forma (Art. II): la fila 10 pasa a «Before asking, read <página> and put the proposed table in the question»; ronda 2 1/1 (leyó la página, tabla con tres modelos, fuente y fecha) — coste si me equivoco: ninguno, es la letra de la spec
- Task 2: Ruling: GREEN c1f 1/2 — c1f-2 cerró la revisión desde sdd-implement sin cargar sdd-verify y siguió su fila «I'll fix the minors too… Ledger them; the user decides»; la fila pasa a «…unless `review.minors: fix` asks. Otherwise ledger them.», con las mismas palabras (tope 9.483); revoca el ruling del pre-flight — coste si me equivoco: un fichero fuera del Scope de la spec, sin cambiar ningún THEN
- Task 2: Ruling: la rúbrica C1f no distinguía el Minor de la revisión final de uno que abre la re-revisión («What it leaves open», fuera de esta spec, también en el RED); pasa a nombrar el Minor del eje Spec — coste si me equivoco: un fallo de la re-revisión que la rúbrica ya no mira
- Task 2: Ruling: REFACTOR ronda 1 c1f 1/2: c1f-2 sigue sin cargar sdd-verify ni leer sdd-kit.json, y copia el ejemplo de sdd-implement «minors → ledger as deferred»; el ejemplo pasa a «sdd-kit.json has no review.minors: minors → ledger as deferred», mismas palabras del tope — coste si me equivoco: ninguno
Final: Ruling: Código m1 — literales en castellano («falta», «sin precio», la pregunta de a quién aplica) dentro de una skill en inglés que dice «Talk to the user in their language»: son lo que ve el usuario y la ADR 0004 los admite; no se traducen — coste si me equivoco: un usuario en otro idioma ve tres literales en castellano
Final: Ruling: Código m4 — la condición review.minors: fix vive en sdd-verify y en dos sitios de sdd-implement: es la cura medida del GREEN 1/2 (el cierre se hace desde sdd-implement sin cargar sdd-verify), y los tres sitios los fija ahora Pester — coste si me equivoco: tres frases que actualizar juntas
Final: Ruling: Spec M8 — el control c1 corrió con n = 1 sobre el kit final; se relanza con n = 2 junto a c1f tras esta pasada — coste si me equivoco: ninguno
Final: Ruling: Spec (declined) — con fix, los Minor que abre la re-revisión siguen saliendo como `minor (deferred)` en vez de `Ruling:` (sdd-verify:240): conducta previa, también en el RED; va a una fila de deuda — coste si me equivoco: un ledger que lista como diferido lo que debía ser ruling
Final: Ruling: re-revisión con el paquete de la receta de encargo-revision.md (sin las salidas de sujetos de la carpeta de la feature) en vez de sdd review package, que pesaba 187 KB con fix-verify/out — el diff de spec y plan sí va — coste si me equivoco: el revisor no ve las salidas de los sujetos de control
Final: Ruling: re-revisión Minor 1 — plan.md decía que la rúbrica C1f pide la línea `Final: fixed` «en cualquiera de las dos formas»; pasa a «una línea `Final: fixed` del Minor», que es lo que mide — commit tras la re-revisión, documentación revisada en el hilo — coste si me equivoco: ninguno
Final: Ruling: re-revisión Minor 2 — la fila de sdd-implement colgaba el «unless» de «costs»; pasa a «Minor fixes cost a test, fix and suite run: only the final review's `review.minors: fix` asks them; else ledger them.», mismas palabras del tope — commit tras la re-revisión, sin revisar (instrucciones de agente) — coste si me equivoco: una frase sin segunda lectura
Final: Ruling: re-revisión Minor 3 — «with its prices» en la fila 10 (antes «five»): la columna «Writes» fija las cinco claves; no se toca para no pasar del tope — coste si me equivoco: una pregunta que no dice cuántos precios lleva cada fila
Final: Ruling: re-revisión Minor 4 — el título del Describe nuevo de SddConfig y el test duplicado de «init does 1 to 7, 9 and 10»: no cambian lo que mide la suite; se quedan — coste si me equivoco: un test redundante
