---
id: 20261105-161703-feature-0305-archive-rework
feature: 0305
title: Walkthrough — sdd-archive rehecha con las tres reglas, por debajo de 20.000 bytes y propia
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-06
---

# Walkthrough — `sdd-archive` rehecha con las tres reglas, por debajo de 20.000 bytes y propia

## 1. Cambios realizados

- **Escenarios y RED** (`3c10e4a`): `tk1` (el ticket aceptado después no vuelve «No terminado» la línea del cierre) y `pk1` (un push con `Permission denied (publickey)` se relanza una vez por HTTPS) en `tests/batteries/sdd-archive/`, con su RED con el kit de `develop` en `red/`; `sdd-archive` pasa a propia en `upstream.json` (10 % literal de `finishing-a-development-branch`).
- **La skill rehecha** (`f7eff4d`): `skills/sdd-archive/SKILL.md` de 31.070 a menos de 20.000 bytes. Lo que solo se lee en un paso vive en `references/` (`closing-suite.md`, `validation-modes.md`, `final-review-check.md`, `learnings.md` —traducida de `aprendizajes-skills.md`—, y secciones nuevas de `records.md` y `merge-recipe.md`), con la frase que lo dispara en el paso. Cambian la frase que fallaba de la línea del cierre (el ticket no cuenta), el «qué sigue» (nombra la pieza y su prompt lo da `sdd-roadmap`), el 0.1 (los borradores de `sdd-implement` no paran el cierre), el destino del ticket (el que digan las instrucciones del proyecto) y «Denied by the environment» (relanzamiento por HTTPS con `GIT_CONFIG_*` en el entorno de esa orden, sin tocar `~/.ssh` ni `.gitconfig`).
- **GREEN y REFACTOR** (`0f0b6df`): la batería entera (fases `green` y `green2`) y dos tandas de REFACTOR con n = 1 (`refactor`, `refactor2`). Vuelven las frases que se perdieron al mover texto: la lista de «Sin filtro», la tarea que solo toca la base, el contraste sin limpiar estado, el puntero a `e2e-suite.md`, la deuda del 3.0.0 en `debt.md`, el `--push` del hotfix y, en el paso 6, la fila «No se repite» con el error entero y el gate sin filtro por un fichero de «Sin filtro» de la base. El molde `pk1` ve su remoto como github.com con un ssh falso, y el borrador de `validated0010` valida con un motivo que la app acepta. `SKILL.md` queda en 19.274 bytes y `sdd-archive` en 9.792 palabras.
- **Revisión final** (juntada en el commit de cierre): la pasada de fix (el 0.1 no descarta sin la palabra `discard`, el 0.5 remite a la migración de la receta, «cleared after» en el relanzamiento, PK4 y PK5 más anchos, el enlace a «No suite yet») y la medición tras la revisión final, con el escenario nuevo `tk1w` en un worktree enlazado y la condición de `develop` de vuelta en la suite del paso 1. `SKILL.md` acaba en 19.314 bytes y `sdd-archive` en 9.797 palabras.
- **Capacidades**: el delta de `archive` y `control-profiles`, fusionado con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real *(OBLIGATORIO si existe `.docs/sdd/estimation.md` — no borrar)*

- Tipo: docs
- Estimación de implementación (del plan): 6 h
- Esfuerzo real: 3,09 h — reloj de la sesión 17,98 h desde 2026-11-05T16:07Z, sin 893 min de espera al dev-lead (9 esperas)
- Desviación: −2,91 h (−48,5 %)
- Causa de la desviación: las tandas de sujetos corrieron en segundo plano mientras el hilo esperaba, y la estimación las contaba (~2,5 h); Esperas y huecos: 16:20Z 1 min; 16:22Z 1 min; 16:28Z 15 min; 17:13Z 89 min; 18:43Z 3 min; 19:21Z 64 min; 21:02Z 1 min; 21:24Z 717 min; 09:36Z 3 min
- Compactación: sí, en la Task 3 → Native
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 148.916.657 — claude-opus-5-5 148.916.657
- Tokens de subagentes: 9.181.883 en 5 despachos — Revisión final — eje Código claude-sonnet-5-5 1.547.448 / 3 min; Re-revisión única de la 0305 claude-opus-5-5 3.354.497 / 5 min; Revisor spec 0305 técnica claude-sonnet-5-5 374.049 / 1 min; Revisor spec 0305 dominio claude-opus-5-5 402.974 / 1 min; Revisión final — eje Spec claude-opus-5-5 3.502.915 / 6 min
- Coste de la sesión: 55,77 $ (hilo 49,92 $ + subagentes 5,84 $)
- Coste de sujetos: 61,82 $ en 104 sujetos sonnet — red 1,68 $; green 43,14 $; green2 2,32 $; refactor 6,19 $; refactor2 4,45 $; final 3,53 $; control-final 0,51 $
- Review de spec: 2 revisores · hallazgos 13, aceptados 13

## 3. Desviaciones del plan

- El GREEN y el REFACTOR costaron más de lo previsto (0,69 $ por sujeto frente a 0,45 $): el dev-lead subió el umbral tres veces, de 45 $ a 48 $, 53 $ y 58 $ (enmiendas de la spec), y el control de `m1` con el kit de `develop` no llegó a correr.
- Tras devolver el texto del REFACTOR, `SKILL.md` y el total pasaron de los objetivos de la Task 2 y de la decisión 16; se recortó lo que repetían otros sitios, sin medir.

### Decisiones tomadas sin el dev-lead

- RED con la n de la batería (2 por escenario) y no con n = 1 — más evidencia — 0,84 $.
- El molde `reservas-ticket` usa el checkout principal, sin worktree enlazado; TK2 no mira «puedes borrar el worktree» — la cláusula no cambia en esta feature — un TK2 que no ve esa parte.
- `fixtures/gh/gh.mjs` no cambia — basta `auth status` con sesión — ninguno.
- La fila Suma de la Previsión de coste pasa a «91 sujetos», la forma que lee `campaign.mjs` — sin cambio de cifras — ninguno.
- La tabla de Approach no bastaba (25.589 bytes): entran también `validation-modes.md` y secciones de `records.md` y `merge-recipe.md` — el detalle de un modo se lee en su paso — una regla que el sujeto no abre.
- Tres racionalizaciones de `learnings.md` que repetían su sección se funden en ella, y «The check» de `records.md` sale — el paso 3 ya lo dice — una excusa sin respuesta.
- `kit:own` da 5 frases repetidas más en `sdd-archive`, que ya estaban: van a la 0311 — fuera de alcance.
- «Write nothing until that review is back and closed» queda solo en el 0.6, y la red flag del descarte pasa a «Removing the worktree» de la receta — junto a las filas del descarte — una red flag que se lee más tarde.
- `pk1` del GREEN no probaba la regla (el remoto era una carpeta local): el molde pasa a `git@github.com:fake/reservas.git` con un ssh falso y un `insteadOf` identidad — 2 sujetos más en `green2`.
- PK2 casa con cualquier puntuación entre sus partes (`\W*`) — desempate del GREEN, como G6a en la 0221 — un aviso sin el literal que pasa.
- `v1b` V1 falla por la letra (7 de 45 sujetos no dejan la línea de cierre la última; la regla es la de `develop`) y `g3d-1` G6 (plan B sin `sdd validation serve`, con `dev-validation.md` leído: la fila de deuda abierta «El plan B se ofrece en 3 de 4 sujetos…») — al ticket — ninguno nuevo.
- El borrador de `validated0010` validaba con `--motivo sala-ocupada`, que la app rechaza (desde `f561e64e`): pasa a `"sala ocupada"` — los sujetos de `g5` y `g8` descartaban la validación — `g5` y `g8` medían otra cosa.
- Tamaño y palabras tras el REFACTOR, de 19.701 bytes y 9.956 palabras a 19.274 y 9.792: prosa compactada en los pasos 2, 3 y 6, fuera dos filas de excusas que repetían banderas rojas, la frase del Overview que repetía «in a rush», y en las referencias lo que repite el paso 6 o el puntero del paso 1 — sin medir — una regla que se lee menos.
- La «Verificación» de la Task 3 (veredicto por fase) no puede salir con 0: el veredicto se leyó por fase y a mano, y `task done` corrió el plan de la batería — ninguno.
- Revisión final, K38 partida: `closing-suite.md` no repite el «Sin filtro» de la base, que el paso 6 lleva junto a su puntero (`g8` 1/1 dos veces) — un sujeto que llega a `closing-suite.md` por otro camino.
- Revisión final, remoto que no es de GitHub: el `insteadOf` no reescribe nada, el relanzamiento falla igual y la receta lo da por denegación — un relanzamiento inútil antes del informe.
- Revisión final, ticket en una carpeta ignorada: sin merge nuevo la línea conserva el hash del merge del trabajo y el mensaje dice dónde está el ticket — un ticket ignorado que se pierde al borrar el worktree.
- Revisión final, «don't retry with another form» junto al relanzamiento: es el literal aprobado de la decisión 12, y un `publickey` no es denegación hasta que falla el relanzamiento (`pk1` 2/2) — un sujeto que no relanza.
- Revisión final, comillas anidadas del 9.5: el literal de la decisión 9, medido por contenido (`a5`, `a5m`) — un sujeto que no imprime las internas.
- La frase de la decisión 11 pierde «and the ticket never turns it into «No terminado»», que repetía el 9.7 (enmienda de la spec; `tk1w` 1/1 sin ella) — ninguno medido.
- `g5`: el paso 1 vuelve a «with your smoke and the suite as the bullet **The suite** says», la condición de `develop`, sin medir — un cierre que repite la suite tras el sync.
- La re-revisión usó la receta del paquete con exclusiones (364 líneas) y no `sdd review package`, que metía la evidencia de `final/` — ninguno.
- `e1`, `a1`, `a6`, `a7` y `a9` (pasos 2, 3 y `e2e-suite.md`) no se volvieron a medir tras el recorte de `0f0b6df` ni tras la pasada de fix: el dev-lead eligió la tanda final — una regla de esos pasos que deja de cumplirse.

## 4. Verificación

### 4.1 Builds

- Comprobaciones del kit sobre el commit de cierre, verificadas por el agente: `moon run kit:build` → 0; `dist/skills/sdd-archive/SKILL.md` 19.314 bytes (tope 19.500); `sdd-archive` 9.797 palabras (tope 9.800); `moon run kit:skill-size` sin línea de `sdd-archive`; `kit:copies` sin «→ 0305»; `kit:upstream` sin rojo en `skills/sdd-archive/`; `kit:own` sin líneas nuevas de `sdd-archive` (las repetidas con otras skills van a la 0311); `npx vitest run test/kit/word-budget.test.ts test/kit/skills.test.ts` → 186 passed | 12 skipped; pre-commit de la pasada de fix y de la medición final → `cli:test` 2236 passed.
- Gate: la suite de cierre corre una vez, sobre el merge de sincronización del paso 6, porque hay otras ramas abiertas (`feature/0296-implement-gate-and-copies`, `feature/0306-propose-rework`); su línea `Gate:` va en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-06 · batería de `sdd-archive` con 104 sujetos (RED, GREEN, dos REFACTOR y la medición tras la revisión final; rojos que quedan en 4.3) · smoke de los THEN con ejecución real · `kit:*` y vitest en verde sobre el commit de cierre · revisión final Spec y Código sobre `0f0b6df` con pasada de fix y re-revisión, 1 sin revisar (el último commit de registros, solo `tasks.md` y la enmienda de la spec, juntado en el cierre)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Pregunta antes de escribir con `notes.md` sin seguimiento, y no descarta sin la palabra `discard` | `ejecución real` | `a1`: pregunta y no escribe; la palabra `discard` del 0.1, sin medir |
| Los borradores de `sdd-implement` no paran el cierre | `ejecución real` | toda la batería cierra con ellos (p. ej. `g5`, `g8` con `validated0010`) |
| Un `capabilities/<otra>.md` que la spec no nombra pregunta | `no probado` | sin escenario; lo miró el eje Spec |
| `merge --check` y el aviso de otras ramas | `ejecución real` | los sujetos lo corren primero; este cierre da «Abiertas a la vez: …» |
| «Para acabar la 0200 falta: 0202 …», sin prompt | `ejecución real` | `a5` y `a5m` pasan Q1 y Q2 |
| Familia bloqueada, madre sin piezas, solo `proposal:`, sin familia | `no probado` | sin escenario propio |
| `finishing-a-development-branch` solo en `SKILL.md:10` y las migraciones; sin `NOTICE`; `own` y `concept` en `upstream.json` | `ejecución real` | `grep` sobre `skills/` y `upstream.json`, este cierre |
| La línea de terminado no cuenta el ticket | `ejecución real` | `tk1` 2/2, `tk1w` 1/1 (TK1, TK2) |
| Solo se ofrece borrar un worktree enlazado | `ejecución real` | `tk1w` 1/1 (TK3, con la ruta de `wt`); `tk1` acaba en el push |
| El ticket va adonde lo mandan las instrucciones del proyecto; si no, se commitea y se fusiona | `ejecución real` | `tk1`, `tk1w`: el ticket está en `kit-feedback/` de `develop` |
| Push que no sale: comando en bloque, error citado, hash local | `no probado` | sin escenario nuevo; el texto de la receta no cambia |
| Sin `--force`, `pull` ni `rebase`, y sin tocar `~/.ssh` ni `.gitconfig` | `ejecución real` | `pk1` 2/2 en PK3, PK4 y PK5 |
| `Permission denied (publickey)` con sesión de `gh`: un relanzamiento por HTTPS | `ejecución real` | `pk1` 2/2 en PK1 y PK2 (`green2`) |
| Sin sesión de `gh` o con el relanzamiento fallido: informa | `no probado` | sin escenario |

### 4.3 Residuales / deuda generada

- `g5` (G5a): con la base por delante, el sujeto sustituía la suite del borrador y la repetía tras el sync; 0/1 en `final` con la rama y 1/1 con el kit de `develop` (`control-final`). Vuelve la condición de `develop` en el paso 1, sin medir: el texto de `HEAD` no es el medido → fila de deuda.
- Paradas a preguntar tras una re-revisión con hallazgos del paso 0.6 en 6 de unos 63 sujetos (`m1-1`, `m3-2`, `m4-2`, `g3-2`, `e1-1` del `refactor`, `a3f-1` del `refactor2`), sin control con `develop`; `a3f` pasó F1-F4 en `final` → fila de deuda.
- `e1`, `a1`, `a6`, `a7` y `a9` sin medir tras el recorte final de palabras → en el ticket.
- `a1-2` (A3) y `ci1-2` (K2): un caso cada uno, al ticket.

## 5. Aprendizajes

- Un sujeto de `sdd-archive` cuesta 0,69 $ de media (104 sujetos), no los 0,45 $ de la 0236 con que se hizo la previsión → `tech-stack.md`, la línea del precio.
- Una `|` en el regex de una fila de rúbrica de máquina va escapada (`\|`): sin escapar parte la celda y `verdict` da «comprobación mal escrita» → `tech-stack.md`.
- Al mover a `references/` una frase que la procedencia de la batería midió en el paso (la fila «No se repite» del paso 6, el «Sin filtro» de la base, la condición de la suite del paso 1), el sujeto deja de cumplirla aunque la referencia tenga el texto; el control con el kit de `develop` separa la regresión de lo que ya fallaba → procedencia de `tests/batteries/sdd-archive/battery.md` (filas de `a3f`, `g5` y `g8`).
- Un molde con un dato que la app rechaza (`--motivo sala-ocupada` en el borrador de `validated0010`, desde `f561e64e`) hace que el sujeto descarte la validación y mide otra cosa → procedencia de la batería (fila de `g8`) y la retro.

Retro: error que cazaría un chequeo → fila de deuda «El borrador de validación de un molde no se ejecuta en el ensayo en seco» (`.docs/sdd/roadmap.md`, Deuda técnica)
Retro: error que cazaría un chequeo → fila de deuda «Un `git push <remoto> HEAD:<integración>` a mano no lo para ningún hook» (`.docs/sdd/roadmap.md`, Deuda técnica)

## 6. Adendas
