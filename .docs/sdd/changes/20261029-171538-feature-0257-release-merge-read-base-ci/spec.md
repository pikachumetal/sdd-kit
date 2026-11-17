---
id: 20261029-171538-feature-0257-release-merge-read-base-ci
feature: 0257
parent: 0236
proposal: 0234
title: La release y el merge leen la CI de la base
mode: full
profile: delegate
status: approved
created: 2026-10-29
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-29
---

# Spec — La release y el merge leen la CI de la base

🦆 Hoy, en un proyecto con CI, el cierre fusiona en `develop` aunque su CI esté en rojo, y `sdd-end-release` corta la versión sin mirar si la suite completa pasó sobre lo que publica. Con el cambio, antes de `sdd merge` el cierre lee el último resultado de la CI de `develop`: si es `failure` en `3c4d5e6`, dice «CI de develop en rojo en `3c4d5e6`», no fusiona y lo que arregla `develop` es un patch; si `gh` no responde, lo avisa y fusiona. Y la release 3.1.0 sobre `9f8e7d6` se corta sin correr nada si la CI dio verde en `9f8e7d6`; si su último verde es de `1a2b3c4`, corre antes la suite completa. En este repo, la mitad de `develop` de la regla 7 de `CLAUDE.md` pasa a la skill.

## Capacidades

- Modificadas: `archive` — el cierre lee la CI de la base antes del merge y no fusiona sobre un rojo
- Modificadas: `control-profiles` — la política de merge en `delegate` y `unattended` tiene esa excepción
- Modificadas: `release-flow` — el corte exige la suite completa en verde sobre su sha, o el último verde de la CI en ese sha

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED (un requisito de `control-profiles`) · tamaño: ~40 líneas en 4 ficheros
- Mínimo razonable: ninguna — deja sin mirar si el AND nuevo de «El merge a develop sigue la política declarada» choca con otro requisito de `control-profiles`; lo cubre el repaso de coherencia
```

1. **Qué rojo para el merge**: solo `conclusion` `failure` en la salida de la orden de «CI de la base». Un run en curso (`conclusion` vacía), `cancelled` o `success` no paran: el merge sigue, y el run siguiente lo verá la CI. Leer «el último terminado» exigiría cambiar la orden que declara el proyecto.
2. **Dónde se lee**: al principio del paso 7 de `sdd-archive` («Merge»), antes de `sdd merge`, en los dos carriles; no en el paso 6 (`--sync`), porque lo que importa es la base en el momento de fusionar. La receta, en una sección nueva «The base's CI» de `merge-recipe.md`; el paso 7 la nombra en una frase. Un hotfix no la lee: fusiona en la rama estable, y la CI declarada es la de la rama de integración.
3. **Literales**: rojo → `CI de <merge.into> en rojo en <headSha>` (el de la enmienda, con la rama por nombre); sin respuesta → `CI de <merge.into> sin respuesta: <primera línea del error>; sigo sin leerla`. Con `sin orden de lectura` o `ninguna`, no se lee ni se avisa.
4. **Con el rojo**: busca el `headSha` y el nombre del workflow en la deuda, como «Fails without the branch» de la receta; sin fila que lo nombre, abre una en «Por triar» (en 2.x, «Deuda técnica») con el `headSha`; y el cierre queda «No terminado», con el rojo en «lo pendiente». No pregunta si fusionar igualmente: la enmienda dice «para», y fusionar sobre un rojo es lo que se quiere evitar.
5. **El sha que corta la release** es el `HEAD` de `merge.into` cuando arranca el corte, tras `git fetch`: los commits del corte (changelog sellado, roadmap, notas, bump) vienen después y no cambian el código que se publica.
6. **Qué es la suite completa**: todas las suites de «Suites» de `operations.md` §Testing (`tech-stack.md` §Testing en 2.x), sin `--affected` ni filtro de nivel. Un rojo para el corte: lo arregla un patch, y el corte vuelve a empezar.
7. **Con la CI**: si el último run es de ese sha y da `success`, no corre nada; `failure` en ese sha → no corta, como el punto 6; otro sha o un run sin terminar → corre la suite completa. Va en el «Gate de entrada» de `sdd-end-release`, no en el paso 5: un corte que no puede acabar no debe sellar el changelog.
8. **En este repo**: la CI de `ci.yml` no corre `cli:test-slow`, así que la regla 5 de `CLAUDE.md` (los lentos al cortar) se queda como está. La regla 7 pierde la mitad de `develop` y conserva la de la rama (push y esperar el run de `ci.yml` de ese commit), que es solo de este repo.
9. **Prueba (Art. I)**: batería nueva `tests/base-ci-red.md` / `tests/base-ci-green.md`, molde con un `gh` falso en el `PATH` que imprime el JSON del caso. Cuatro escenarios, n = 2: `c1` CI de `develop` con `failure` → no fusiona y dice el literal; `c2` `gh` sale con error → avisa y fusiona; `r1` último verde en otro sha → corre la suite antes de cortar; `r2` `success` en el sha → no corre nada.
10. **Previsión de coste**: RED 8 sujetos (4 de `sdd-archive` a ~0,70 $, el precio de `tech-stack.md`; 4 de `sdd-end-release` a ~0,50 $, sin precio medido en `tech-stack.md`, estimado de su rango de 0,3–2,5 $) ≈ 4,8 $; GREEN, lo mismo ≈ 4,8 $; una tanda de REFACTOR de 4 sujetos ≈ 2,4 $; controles: `c2` y `r2` hacen de control de no regresión, sin sujetos aparte. Suma ≈ 12 $; con el 20 % de reserva, techo 14,5 $. ~1,5 h de campaña.
11. **Una pieza entra, otra sale**: sale la mitad de `develop` de la regla 7 de `CLAUDE.md` (~45 palabras); entran ~150 palabras en `sdd-archive` y ~90 en `sdd-end-release`, dentro de sus topes (tabla de abajo).
- Delta probado con `sdd capability merge` sobre una copia de `.docs/sdd` (2026-10-29): añadido «Antes del merge, el cierre lee la CI de la base y no fusiona sobre un rojo» en `archive`; sustituido «El merge a develop sigue la política declarada» en `control-profiles`; añadido «El corte exige la suite completa en verde sobre su sha, o el último verde de la CI en ese sha» en `release-flow`.
- Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high · sujetos Sonnet, por tandas · en paralelo hasta `control.maxParallelAgents`.

### Decisiones tomadas con el dev-lead

- Carril feature, perfil `delegate`, y al fusionar `sdd merge --push` — «Arranca la 0257 con sdd-propose, carril feature … Perfil delegate. Al fusionar, `sdd merge --push`.»
- Partida de la 0236 — «Partir en A y B» (2026-10-29)
- Con CI declarada, el cierre lee su último resultado en la rama de integración antes del merge; si el comando no responde, avisa y sigue; un rojo de la CI se arregla con un patch y una fila de deuda — literal del prompt de arranque
- En este repo lo hace hoy a mano la regla 7 de `CLAUDE.md`; la skill recoge esa regla, no la duplica — literal
- Ficheros: `skills/sdd-end-release/SKILL.md`, `skills/sdd-archive/SKILL.md`, `skills/sdd-archive/references/merge-recipe.md`; tamaño S — literal

## Intent

Hoy, en un proyecto con «CI de la base» declarada (lo añadió la 0236), nada del kit la lee: el cierre fusiona sobre una `develop` en rojo y la release corta sin la suite completa, que desde la 0236 ya no corre en cada cierre. En este repo, la regla 7 de `CLAUDE.md` lo hace a mano. El éxito: ningún merge del kit cae sobre un `failure` de la CI de la base que el cierre pudo leer, y ninguna release se corta sin un verde de la suite completa sobre su sha. El fracaso, aunque funcione: que un `gh` ausente o sin sesión pare los cierres, o que la release corra la suite cuando la CI ya la dio en verde en ese sha.

## Scope

- Entra: la lectura de la CI antes del merge en `sdd-archive` y su receta; el gate de la suite completa o la CI en `sdd-end-release`; la regla 7 de `CLAUDE.md` sin la mitad de `develop`; la batería `tests/base-ci-*`.
- No entra: la CI de la rama del cambio (sigue en la regla 7, solo de este repo); el hotfix; la lectura en `sdd merge` (CLI); esperar a un run en curso; `sdd-upgrade` y la plantilla, que ya tienen el campo (0236).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| La mitad de `develop` de la regla 7 («Si la de `develop` da `conclusion` `failure`, no fusiones encima… Si `gh` no responde, avísalo y sigue») | `CLAUDE.md`, regla 7 | sale; la hace el paso 7 de `sdd-archive` con la orden de `tech-stack.md` (decisión 8) |
| «aplica la política sin preguntar: fusiona en `merge.into`» | `capabilities/control-profiles.md:134` | delta, `MODIFIED` «El merge a develop sigue la política declarada» |
| «lo que la base mueva entre la sincronización y el merge … lo verá la CI (0257)» | spec de la 0236, decisión 14 | se queda: la spec es inmutable y lo que dice se cumple |

- Filas que implementa: 0257 → `roadmap.md` (fila a `✅` al cerrar) y la spec de la 0236 (decisiones 1 y 14, inmutable); deuda que salda en parte: «El cierre de un proyecto corre la suite entera, y la repite» (`roadmap.md:593`, «queda: la suite completa a la release o a la CI, en la 0257») — buscado `0257` en `skills/`, `capabilities/`, `.docs/sdd/*.md` y `CLAUDE.md`.

## Approach

`merge-recipe.md` gana la sección «The base's CI»: con «CI de la base» declarada con su orden, la corre antes de `sdd merge` y lee `conclusion` y `headSha` (decisiones 1, 3 y 4). El paso 7 de `sdd-archive` la nombra. El «Gate de entrada» de `sdd-end-release` gana la frase de la suite completa o la CI sobre el sha que corta (decisiones 5-7) y su red flag.

## Dónde se prueba

- El merge ante la CI de la base: sujetos de `sdd-archive` sobre un molde listo para el paso 7, con un `gh` falso en el `PATH` (`tests/base-ci-*`, `c1`, `c2`), como `tests/merge-close-*`.
- El corte ante la CI: sujetos de `sdd-end-release` sobre un molde con `[Unreleased]` lleno y el mismo `gh` falso (`r1`, `r2`), como `tests/sdd-end-release-*`.
- Los topes: `cli/test/kit/word-budget.test.ts`.

## Términos y ADR

- Términos resueltos: ninguno.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `archive`

#### ADDED — Antes del merge, el cierre lee la CI de la base y no fusiona sobre un rojo

- GIVEN un proyecto cuyo §Testing declara «CI de la base» con la orden que lee su último resultado, y esa orden da `conclusion` `failure` y `headSha` `3c4d5e6` en `develop`
- WHEN el cierre de una feature o de un patch llega al merge
- THEN no ejecuta `sdd merge`, dice `CI de develop en rojo en 3c4d5e6`, busca el rojo en la deuda y, sin fila que lo nombre, abre una con ese sha; el cierre queda «No terminado»
- AND si la orden da `success`, una `conclusion` vacía (run en curso) o `cancelled`, fusiona como siempre
- AND si la orden no responde (sin `gh`, sin sesión, error de red), dice `CI de develop sin respuesta: <primera línea del error>; sigo sin leerla` y fusiona
- AND con «CI de la base» `ninguna` o `sin orden de lectura`, no lee nada ni avisa
- AND un hotfix no la lee

### Capacidad: `control-profiles`

#### MODIFIED — El merge a develop sigue la política declarada

- GIVEN una feature o un patch validados (o diferidos) y un bloque `merge` completo (`into`, `noFf`, `removeWorktree`) en `sdd-kit.json`
- WHEN el agente llega al paso del merge de `sdd-archive`
- THEN en `delegate` y `unattended` aplica la política sin preguntar: fusiona en `merge.into`, con `--no-ff` si `merge.noFf` es `true`; en `pair` la presenta y espera
- AND con el bloque ausente o incompleto pregunta como hoy; nunca fusiona a `main` ni etiqueta salvo en un hotfix con la frase del dev-lead en `--order`
- AND el bloque autoriza el merge, no la validación: en `pair` y `delegate`, la validación de `sdd-archive` para con el smoke y la pregunta de validación antes de tocar nada
- AND en cualquier perfil, con la CI de la base en `failure` no fusiona («Antes del merge, el cierre lee la CI de la base y no fusiona sobre un rojo», en `archive`)

### Capacidad: `release-flow`

#### ADDED — El corte exige la suite completa en verde sobre su sha, o el último verde de la CI en ese sha

- GIVEN la release 3.1.0 que se corta sobre `9f8e7d6`, el `HEAD` de `develop` al arrancar el corte, y la CI de la base con su último verde en `1a2b3c4`
- WHEN `sdd-end-release` pasa su gate de entrada
- THEN corre todas las suites de §Testing, sin `--affected`, antes de sellar el changelog
- AND si la CI dio `success` en `9f8e7d6`, no corre nada
- AND si la CI dio `failure` en `9f8e7d6`, o la suite completa sale en rojo, no corta: lo arregla un patch, y el corte vuelve a empezar
- AND sin «CI de la base», o con `ninguna`, corre siempre la suite completa

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-archive` `SKILL.md` | 4572 / 4900 | 328 | sin cambio (+~30) |
| `sdd-archive` total | 9505 / 10000 | 495 | sin cambio (+~150) |
| `sdd-end-release` `SKILL.md` | 1855 / 2375 | 520 | sin cambio (+~90) |
| `sdd-end-release` total | 2420 / 3125 | 705 | sin cambio (+~90) |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-29 | aprobada (opción «Apruebo») |
