---
id: 20261029-171538-feature-0257-release-merge-read-base-ci
feature: 0257
title: Walkthrough — La release y el merge leen la CI de la base
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-29
---

# Walkthrough — La release y el merge leen la CI de la base

## 1. Cambios realizados

- **`sdd-archive`** (`620beec2`; pasada de fix en `ea7e29d2`): `references/merge-recipe.md` gana «The base's CI». Con «CI de la base» declarada y su orden, el cierre la corre antes de presentar o ejecutar `sdd merge`. Con `failure`, no fusiona en ningún perfil, escribe `CI de <merge.into> en rojo en <headSha>`, busca el rojo en la deuda (o abre su fila) y queda «No terminado». Con cualquier otro resultado, sigue la política de merge. Si la orden no responde, escribe `CI de <merge.into> sin respuesta: <first line of the error, whole>; sigo sin leerla` y sigue. El paso 7 la nombra en una frase, y una red flag nueva la cubre, salvo en el hotfix.
- **`sdd-end-release`** (`9e9cee61`; pasada de fix en `ea7e29d2` y arreglo de la re-revisión en `f1df0e9d`): el «Gate de entrada» exige la suite completa en verde sobre el `HEAD` local de `merge.into`, o el `success` de la CI en ese sha. La orden de la CI se corre tal cual, en una llamada sin otra orden detrás, y su `headSha` se lee antes de lanzar ninguna suite. Lleva una red flag y una racionalización («corro la suite igualmente»).
- **`CLAUDE.md`**: la regla 7 conserva solo la CI de la rama; la de `develop` la lee `sdd-archive`.
- **Batería de `sdd-archive`**: moldes `reservas-ci-red`, `reservas-ci-down`, `reservas-release-ci` y `reservas-release-ci-old`, con un `gh` falso en el `PATH` (`fixtures/gh/gh.mjs`), y escenarios `ci1`, `ci2`, `rc1` y `rc2`, con las filas K1-K6 de la rúbrica. Evidencia en `tests/base-ci-red.md` y `tests/base-ci-green.md`.
- **Capacidades**: `archive` gana «Antes del merge, el cierre lee la CI de la base y no fusiona sobre un rojo»; `release-flow`, «El corte exige la suite completa en verde sobre su sha, o el último verde de la CI en ese sha»; `control-profiles` sustituye «El merge a develop sigue la política declarada», con la excepción de la CI.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2,5h
- Esfuerzo real: 0,84 h — reloj de la sesión 0,95 h desde 2026-10-29T16:12Z, sin 7 min de espera al dev-lead (1 espera)
- Desviación: −1,66 h (−66 %)
- Causa de la desviación (obligatoria si |desviación| > 30%): el plan sumó en serie las tandas de sujetos (~1 h); corrieron en segundo plano mientras el hilo escribía los textos y los borradores.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 28.745.324 — claude-opus-5-5 28.745.324
- Tokens de subagentes: 4.674.644 en 3 despachos — Final review — Code axis claude-sonnet-5-5 1.317.047 / 2 min; Final review — Spec axis claude-opus-5-5 2.098.347 / 5 min; Re-review final 0257 claude-opus-5-5 1.259.250 / 3 min
- Coste de la sesión: 13,11 $ (hilo 10,05 $ + subagentes 3,06 $)
- Coste de sujetos: 8,56 $ en 32 sujetos sonnet — RED 1,34 $; GREEN 1,25 $; REFACTOR 2,33 $; REFACTOR 2 0,59 $; REFACTOR 3 0,58 $; pasada de fix 2,47 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- Cuatro rondas de REFACTOR en vez de una. Los sujetos parafraseaban los literales, leían la CI con otra orden de `gh` o la lanzaban en la misma llamada que la suite. La tercera ronda se dio por buena con un 1/2 mal puntuado, y lo cazó el eje Spec de la revisión final.

### Decisiones tomadas sin el dev-lead

- sin revisar: f1df0e9d — devuelve el sha del corte de `sdd-end-release` al `HEAD` local de `merge.into` (decisión 5 de la spec), que la pasada de fix había cambiado a `<remoto>/<merge.into>`; Important de la re-revisión.
- Sin escenarios para el hotfix, el `failure` en el corte y la release sin CI — el «Dónde se prueba» aprobado no los promete y el texto los cubre; los moldes sin CI de la batería hacen de control del «sin CI» del merge — coste si está mal: un camino sin medir llega a campo.
- `ci2`: la primera línea del error sale entera en 1 de 2 sujetos tras la pasada de fix — el marco literal sale 2/2 y el merge sigue; no hay segunda pasada — coste si está mal: el dev no ve «gh auth login» en el aviso.

## 4. Verificación

### 4.1 Builds

- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 247/247 · cli:test: corrió 1664/1676 (12 saltados) · cli:typecheck: saltada (sin cambios en sus inputs frente a develop) · 1 min 44 s · configuración: la del gate · sobre `f1df0e9d` (el cierre solo añade docs)
- Pre-commit de cada commit de la rama: `kit:roadmap` → `Roadmap válido` · `cli:test` → 1664 passed | 12 skipped.
- CI de la base: `develop` en `success` sobre `1aa1105f`; la de la rama, `success` sobre `9e9cee61` y la pasada de fix.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · gate de cierre en verde · batería de `sdd-archive` `ci1`, `ci2`, `rc1` y `rc2` con n = 2 sobre el texto final (salvo el último arreglo, de una frase) · revisión final Spec opus+high (With fixes) y Código sonnet+high (Yes) sobre 9e9cee61, pasada de fix y re-revisión: 9/9 resueltos, 1 sin revisar

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `archive`: con `failure`, no fusiona, escribe el literal, abre la deuda y queda «No terminado» | ejecución real (`ci1`, pasada de fix) | 2/2 |
| `archive`: con `success`, `cancelled` o vacía, sigue la política de merge | no probado | texto de la receta |
| `archive`: sin respuesta, avisa con el literal y fusiona | ejecución real (`ci2`, pasada de fix) | marco 2/2; error entero 1/2 |
| `archive`: con `ninguna` o `sin orden de lectura`, no lee nada | ejecución real (moldes de la batería sin CI) | control |
| `archive`: el hotfix no la lee | no probado | texto |
| `control-profiles`: con `failure` no fusiona en ningún perfil | ejecución real (`ci1`, perfil `delegate`) | 2/2 |
| `release-flow`: el último verde en otro sha → corre la suite antes de sellar | ejecución real (`rc1`, pasada de fix) | 2/2 |
| `release-flow`: `success` en el sha → no corre nada | ejecución real (`rc2`, pasada de fix) | 2/2 |
| `release-flow`: `failure` en el sha o la suite en rojo → no corta | no probado | texto |
| `release-flow`: sin CI → corre siempre la suite | no probado | texto |

### 4.3 Residuales / deuda generada

- Ninguna fila nueva: los caminos sin escenario y el error recortado de `ci2` quedan en las decisiones de arriba, con su coste.

## 5. Aprendizajes

- Puntuar una rúbrica fila por fila incluye leer la línea de `tools.txt` entera: un `grep` cortado a 140 caracteres escondió el `node --test` que seguía al `gh` en la misma llamada (`rc2-2` de REFACTOR 3). Ya lo dice `tech-stack.md` («Cada sujeto se califica con la rúbrica escrita, literal, y fila por fila»): la regla existía y no la apliqué.
