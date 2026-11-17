---
id: 20261114-203334-feature-0343-release-3-0-0-close
feature: 0343
title: Walkthrough — Cierre de la 3.0.0, lo que quedó de la 0152 y el corte
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-16
---

# Walkthrough — Cierre de la 3.0.0, lo que quedó de la 0152 y el corte

## 1. Cambios realizados

- **Filas de humo** (`2e7feef2`): R9 «No carga `add-to-changelog`» en `r4` de `sdd-retro` y TP «No carga `sdd-templates`» en `sp1`, `co4` y `p2` de `sdd-propose`, con la forma de la fila K de `interviewer`. RED sobre la medida final de la 0152: R9 2/2; TP `sp1` 2/2, `p2` 2/2, `co4` 0/2. `kit:upstream`: «Fuentes al día: 46 entradas».
- **(a) Ronda de los seis rojos** (`54dba826`, `3a09a236`), cada regla al paso donde se decide, GREEN a n = 4 y como mucho un REFACTOR:
  - `m1` (`sdd-roadmap`): la forma literal del título del prompt sube a la entrada 1 → 4/4 tras el REFACTOR.
  - `m3` (`sdd-roadmap`): el triaje corre `sdd roadmap check` antes de proponer y la «Causa» va en los estados → 3/4, a fila de bug; verde en el corte y en `f6-rmp`.
  - `v5` (`sdd-upgrade`): la fila «Patches» de `v3.0.0.md` lleva a Now el patch aunque su fila de deuda diga `saldada` → V16 4/4, V19 1 de 4; verde tras el arreglo posterior.
  - `g5` (`sdd-archive`): el paso 6 decide con los diffs, antes de correr nada, qué corre tras el merge de sincronización → G5a y G5b 4/4, G5c 1 de 4 a fila de bug; 0 de 2 en el corte y en `f6-arc`.
  - `u1` (`sdd-implement`): «How you stop» lleva el revisor del desvío (sonnet, `effort-medium`, siete puntos de `review-spec.md`) en primer plano, una vez escrita la corrección, y para con sus hallazgos en el ✋; la frase duplicada sale de `includes/deviation.md` → 4/4 tras el REFACTOR.
  - `h2` (`sdd-implement-subagent`, `fix-loop.md`): con un Minor el código queda como se revisó → 1 de 4 a fila de bug; el REFACTOR no mejoró y no se queda; verde en el corte.
- **(c) Batería del corte** sobre `3a09a236` (`KIT_DIR` de `git archive 3a09a236:dist`): las 16 baterías con su n, más `f2` y `f3` de `using-sdd` con `SUPERPOWERS_DIR`; lecturas `c-lectura-a.md` … `c-lectura-k.md`.
- **Enmienda del 2026-11-16 — arreglar los rojos del corte antes de cortar** (`ad53b120`, `517d4a85`): un arreglo por skill en `sdd-implement`, `sdd-implement-native`, `sdd-propose`, `sdd-archive`, `sdd-rubber-duck`, `sdd-init`, `sdd-end-release`, `sdd-roadmap`, `sdd-upgrade`, `sdd-verify`, `sdd-grilling` y `sdd-config`, más la línea ADR de la plantilla del walkthrough; filas de batería a su letra. Relanzados los arreglados a n = 4 (`f4-*`, `f5-*`); la frase de lite de la clasificación de `sdd-propose` se revierte en `517d4a85` por la regresión de `fp`. Saldo de palabras: −120.
- **Revisión final y lo que trajo** (`21f26e1e`, `7354ce90`, `1c653cb1`): `sdd-grilling` instala Playwright fuera del proyecto; el paso 6 de `sdd-archive` solo deja de correr la suite con la de la validación ya corrida; frases añadidas junto a la que fallaba fundidas o quitadas (`closing-suite.md`, `dev-validation.md`, `closing-the-review.md`); triaje de `sdd-roadmap` con la forma completa de la CLI; TP exige leer la plantilla entera (`head -N` con N ≥ 210). Relanzamiento sobre el sha medido `7354ce90` de lo que piden las ADR 0035, 0017, 0032 y 0028 y de lo que tocó la pasada (fases `f6-*`, `f7*`).
- **(b) Filas de bug** (`be3b79ea`, `1c653cb1`): una por skill en `debt.md` «Por triar» (10), con la tasa de la última medida y, entre paréntesis, las anteriores; `tests/release-3.0.0.md` con la sección «Batería del corte (feature 0343)», los relanzamientos y las lecturas literales (decisión 10); `rojos.md` con el destino de cada rojo.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 8h (más 1 h de revisión y 1,5 h de cierre)
- Esfuerzo real: ~9,4 h, aproximado — esta sesión (PC), medida: 0,88 h — reloj de la sesión 3,70 h desde 2026-11-16T16:58Z, sin 169 min de espera al dev-lead (5 esperas); las sesiones del portátil (2026-11-14 a 16), sin transcripts en esta máquina: ~8,5 h, aproximado con las marcas de los commits y el ledger
- Desviación: −1,1 h (−10 %) sobre 10,5 h
- Causa de la desviación: dentro del 30 %; esperas y huecos de esta sesión: 17:19Z 53 min; 18:16Z 3 min; 18:20Z 46 min; 19:06Z 27 min; 19:34Z 40 min
- Compactación: no en esta sesión; traspaso de máquina tras `be3b79ea`
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 28.587.824 — claude-opus-5-5 28.587.824 (solo esta sesión)
- Tokens de subagentes: 33.206.359 en 6 despachos — Final review — Spec axis claude-opus-5-5 9.526.965 / 11 min; Lector f6 archive init roadmap retro implement claude-sonnet-5-5 7.872.430 / 6 min; Final review — Code axis claude-sonnet-5-5 3.152.368 / 4 min; Lector f6 verify grilling claude-sonnet-5-5 6.984.924 / 6 min; Re-review final 0343 fix pass claude-opus-5-5 3.496.239 / 6 min; Lector f6 interviewer claude-sonnet-5-5 2.173.433 / 4 min (solo esta sesión; los lectores y revisores del portátil, sin medir aquí)
- Coste de la sesión: 23,51 $ (hilo 9,98 $ + subagentes 13,53 $), solo esta sesión
- Coste de sujetos: 384,89 $ en 943 sujetos sonnet — corte y relanzamientos de la enmienda 351,24 $ (851); relanzamiento tras la revisión final y A/B 33,65 $ (92)
- Review de spec: 2 revisores y segunda ronda · hallazgos 30, aceptados 30

## 3. Desviaciones del plan

- **Enmienda de la spec del 2026-11-16, aprobada por el dev-lead** («si haces una pasada infernal salen errores los resolvemos y luego la volvemos a pasar»; «ok» al plan de seis pasos): los rojos de la batería del corte se arreglan antes de cortar y se relanzan solo los arreglados a n = 4. Sustituye la decisión 6 para el corte y la 14.
- **Enmienda `sin aprobar` del 2026-11-16** (aplica las frases del dev-lead de ese día): reabre como trabajo los rojos de `sdd-grilling`, `interviewer` y `sdd-config`; TP vale con leer la plantilla entera; E5 y R1 fallan solo con asuntos distintos; lo que superpowers no fallaría se arregla ahora; el sha medido es `7354ce90`, medido por el relanzamiento que aprobó el dev-lead («Relanzar todo (~34 $)»).
- El cierre no se aplasta: su rango (`7cd4598a`..) ya estaba en `origin` por el traspaso de máquina, y aplastarlo pediría un push forzado; quedan la pasada de fix, los arreglos tras la re-revisión, el relanzamiento y el commit de cierre por separado.
- Paradas por cuota de 5 h (2026-11-15) y por coste (2026-11-16); `MAX_PARALLEL=2` desde la segunda (dev-lead, «si pon 2»). Traspaso del portátil al PC tras `be3b79ea`.
- sin revisar: `7354ce90` — la viñeta de adjudicar de `closing-the-review.md`, TP a N ≥ 210 y la enmienda sin aprobar (después de la re-revisión); `1c653cb1` — evidencia del relanzamiento, `debt.md` una fila por skill y lecturas literales en `release-3.0.0.md` (solo registros, más de 20 líneas). Y el arreglo del CI de la rama: `selectEvidencePath` de `cli/test/kit/privacy.ts` solo miraba `.docs/sdd/changes/`, y el control de privacidad del pre-commit no revisaba la evidencia de `.docs/sdd/changes/`; `subject-output-privacy.slow.test.ts` (en `cli:test-min` del CI) rojo con 34957 de 40701 rutas, verde 25/25 con `(specs|changes)`.

### Decisiones tomadas sin el dev-lead

- Línea base = el pre-commit del commit de apertura `5506bd65` en vez de `sdd-worktrees` — ya en el worktree y con el gate corrido — un rojo previo se atribuiría a la feature.
- Sin `sdd-tdd` — ninguna task escribe código; el RED es una batería — si una task tocaba `cli/`, se cargaba entonces.
- `co4` 0/2 en TP no se arregla en la ronda — fila nueva sin medida previa, decisión 6 — una carga sin arreglar.
- `kit:upstream` y las variables de las fuentes, pendientes del dev-lead al empezar; resuelto con los clones en `C:\code\sdd-kit\upstream` — sin coste.
- `SUPERPOWERS_DIR` en el HEAD de `main` de superpowers, no en una etiqueta — lo que verán los proyectos al instalar — algo sin publicar compite en `f2`/`f3`.
- M3 pierde «no cita el changelog como fuente» — la skill no tiene esa regla — una fila menos exigente.
- Saldo de palabras de las Tasks 2 y 3 compensado quitando punteros de evidencia y la regla de desvío repetida (saldo −1) — no cambian reglas — un puntero perdido.
- Los rojos de `sdd-grilling` de la 0152 no van a fila — la 0342 los cerró — si seguía alguno, salía en `c-grl`.
- Sin REFACTOR para `v5` ni `g5` — fallos de otra fila o de un paso saltado — eran de la skill y quedaban en rojo.
- La lectura del REFACTOR de `m1`/`m3`, por grep del hilo — solo dos cláusulas cambiaron — otra cláusula rota sin ver.
- El lateral de `h2` (Minor de task sin `minor (deferred)`) a la fila de `sdd-implement` — no es fila de la rúbrica — una conducta sin medir.
- `fix-loop.md` vuelve al texto del GREEN — el REFACTOR no mejoró — `h2` medido en `r2-imp` con un texto que no se publica.
- TP es fila nueva: `p2`, `sp1`, `co4` a fila con su tasa, sin relanzar — decisión 6 — una carga sin arreglar.
- `co2p` 2/2 en la 0152 → posible regresión, relanzado; quedó suelto de un sujeto — un rojo de un sujeto que no es fila.
- Los 17 rojos que siguen tras el arreglo son reglas propias del kit → filas de bug (criterio del dev-lead) — una regla de superpowers mal leída.
- E5/R1 más laxas que «one question mark» de `sdd-grilling` — la skill pide lo estricto y D2 solo deja de puntuar el mismo asunto — un sujeto que junta dos del mismo asunto no se ve.
- Filas reescritas a su letra (E1, C7, PL1, PT1, CO6, V19, M5, R3, R9) — D3-D8 delegadas por el dev-lead, cada una en `rojos.md` — un rojo real que pasa a verde.
- Regla nueva de `cr3` en `plan-writing.md` — la restricción «nunca se suma una regla nueva» es del plan, no de la spec; la re-revisión dice que no se sostiene — una regla más en una referencia.
- Forma literal del título en la entrada 1 de `sdd-roadmap` — fue el arreglo de `m1`, 4/4 — dos sitios con la misma forma.
- `sdd-rubber-duck` sin «the term and its effect are one idea» — sustituida por «never in the next one»; `w1` sigue rojo — la colisión con «una idea por frase» sigue.
- +12 palabras en `migrations/v3.0.0.md` — fuera del conteo — ninguno.
- La frase añadida de `closing-the-review.md`, las filas agrupadas de `debt.md`, las lecturas enlazadas y TP con N ≥ 100 quedaron primero como rulings; la re-revisión dijo que no se sostenían y se arreglaron en `7354ce90` y `1c653cb1`.
- `g2` K no es regresión — con el kit del corte falla 3 de 4 (`f7b-int`) — si lo era, la fila la esconde.
- `n7` N7a no es regresión — con el kit del corte falla 3 de 4 (`f7b-ini`) — si lo era, la fila la esconde.

## 4. Verificación

### 4.1 Builds

- `moon run kit:build kit:own kit:copies` → «Skills al día: 127 ficheros», «Copias al día: 31 ficheros»; `word-budget.test.ts` 77/77 tras cada pasada.
- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 763/763 · cli:typecheck: corrió, sin errores · cli:test: corrió 2500/2512 (12 omitidos) · 124 s · configuración: la del gate · sobre 1c653cb1 (el commit de cierre solo añade registros)
- Tanda: 943 sujetos sonnet en las fases `r-*`, `r2-*`, `c-*`, `c4-*`, `f4-*`, `f5-*`, `f6-*`, `f7*`, `MAX_PARALLEL` 5 y después 2.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-16 · gate 763/763 · typecheck · 2500/2512 sobre 1c653cb1 · batería del corte sobre `3a09a236` y relanzamientos de lo arreglado sobre `ad53b120`, `517d4a85` y el sha medido `7354ce90` (943 sujetos, 384,89 $), cada rojo con su destino · revisión final Spec y Código sobre `7cd4598a`, pasada de fix y re-revisión, 2 sin revisar (`7354ce90`, `1c653cb1`)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Cada rojo de la ronda verde o con su fila de bug y su tasa | ejecución real: GREEN y REFACTOR a n = 4 (`r-*`, `r2-*`), `debt.md` | `m1`, `u1` verdes; `v5` verde tras el arreglo; `m3`, `g5`, `h2` con fila |
| La batería del corte mide el texto que se publica | ejecución real: `c-*` sobre `3a09a236`, relanzamientos `f4-*`/`f5-*` y `f6-*` sobre `7354ce90` | el sha medido es el último que toca `skills/`; lo de después son registros |
| Las filas nuevas de la decisión 8 son comprobables por máquina | ejecución real: `verdict` sobre un `tools.txt` que carga y otro que no (TP y R9), y `head -100`/`head -250` para TP | pasa |
| Ningún rojo de la medida final se queda sin destino | ejecución real: `rojos.md`, `debt.md` (10 filas), sección de `release-3.0.0.md` | pasa |
| Lo que piden las Confirmaciones de las ADR 0035, 0017, 0032 y 0028 | ejecución real: `f6-int`, `f6-ini`, `f6-arc`, `f6-ver` con lector | igual o mejor; `f2` Xa 1/2 suelto |
| Saldo de palabras ≤ 0 y ningún tope cambia | suite: `word-budget.test.ts` 77/77 | pasa |
| `kit:upstream` antes de la ronda | ejecución real | «Fuentes al día: 46 entradas» |
| El corte (comando de la regla 5, `## [3.0.0]`, etiqueta) | no probado: va después del merge, en `develop`, con `sdd-end-release` | — |

### 4.3 Residuales / deuda generada

- Diez filas de bug en `debt.md` «Por triar» (2026-11-16): `sdd-propose`, `sdd-archive`, `sdd-implement`, `sdd-verify`, `sdd-rubber-duck`, `sdd-end-release`, `sdd-roadmap`, `sdd-init`, `sdd-grilling` y `sdd-config`.
- Sueltos de un sujeto, sin arreglo ni fila: L tras un fallo de herramienta en `a4`, `a9`, `t3`, `m3` de archive, `v1`, `mp1`, `u2`, `g1`, `c10`; `x1`, `co2p`, `c3`, `g2` de `sdd-upgrade`, `f6`, `f2` Xa.

## 5. Aprendizajes

- Un verde de n = 2 no es la línea base de una regresión: `g2` y `n7` parecían regresiones y con el kit del corte fallaban igual → `steering/operations.md`, «Cómo se testean las skills».

Retro: error que cazaría un chequeo → ticket del kit: `sdd review comments` no ve un comentario que cita una feature por su id («(corte de la 0343)» en `subject.mjs`), y ningún test rechaza una fila entre la cabecera y el separador de una tabla de `battery.md`
Retro: documento o skill desmentido → ticket del kit: `sdd session tokens` solo lee los transcripts de la máquina; una feature traspasada entre máquinas queda con el tiempo y los tokens aproximados a mano

## 6. Adendas

- _Ninguna_
