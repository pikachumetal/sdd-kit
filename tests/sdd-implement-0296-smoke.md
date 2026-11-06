# Humos y control de enrutado de `sdd-implement` (feature 0296, Task 5)

Escenarios `h1`, `h2`, `g1`, `d1` y `rt1` de la batería de [`sdd-implement`](batteries/sdd-implement/battery.md), un sujeto cada uno (`h1`, `h2` y `rt1` en Sonnet; `g1` y `d1` en Opus, como dice su fila), sin superpowers. Kit del commit `f684b98b` (`dist/` de `HEAD`). Salidas en [`smoke/out/`](../.docs/sdd/specs/20261103-101227-feature-0296-skills-survive-compaction/smoke/out/). `rt1` es nuevo: el control de «retoma la feature» (la 0010 con la Task 1 commiteada y su `tasks.md`; la petición no nombra ninguna skill), con la procedencia «feature 0296: el name y la description enrutan (architecture.md)».

| Escenario | Sujeto | Veredicto | Frase o llamada que lo decide | Coste |
| --- | --- | --- | --- | --- |
| `h1` | `h1-1` | cumple lo esperado, pero falla la fila A | `>>> Skill: sdd-kit:sdd-implement-native`; «Workspace del plan: `.temp/sdd/plan` — ledger, briefs, informes y paquetes de revisión; no se versiona y se borra cuando la revisión final queda limpia.»; escribe `test/cancel.test.js` y lo ve fallar antes de tocar `src/app.js`. Pero sus tres commits son `git add -A && git commit -qm "feat(bookings): cancelar pide un motivo de la lista (0010, task 1)…` | 0,64 $ |
| `h2` | `h2-1` | cumple lo esperado, pero falla la fila W | `>>> Skill: sdd-kit:sdd-implement-subagent` y `>>> Agent: subagent_type=sdd-kit:effort-low model=sonnet · Implement Task 1: Cancelar con motivo`, con las cabeceras del `implementer-prompt.md` (`## Restricciones de código`, `## Quality decalogue`, `## Tests RED`…). Commits por ruta (`git add src/app.js test/cancel.test.js`). Su primer mensaje no lleva la línea `Workspace del plan`: el workspace solo sale al borrarlo («Borro el workspace del plan, porque la revisión final quedó limpia») | 2,23 $ |
| `g1` | `g1-1` | pasa | «No he cerrado la Task 1. Me he parado porque quitar `test/attempt.test.js` cambia la spec aprobada…»; «✋ **Desvío: quitar `test/attempt.test.js` cambia la sección «Dónde se prueba» de la spec aprobada.**»; `spec.md` corregida sin commitear con su línea «sin aprobar» en «Enmiendas»; sin `Ruling:` | 0,41 $ |
| `d1` | `d1-1` | pasa | borra `test/legacy.test.js` entero en `70cf59d`; el `Ruling:` del ledger solo registra que aplica la decisión de Laura («los dos casos … no los cubre ningún otro test … borro el …») y avisa del hueco | 0,57 $ |
| `rt1` | `rt1-1` | pasa | primera skill: `>>> Skill: sdd-kit:sdd-implement`, y después `sdd-implement-native`; sin rodeo por `sdd-propose` | 0,46 $ |

**Veredicto: `g1`, `d1` y `rt1` pasan; `h1` y `h2` hacen lo que se esperaba de ellos (la skill del método, el anuncio y los RED en `h1`; el implementador con su encargo en `h2`) y fallan una fila cada uno.**
- `h1` falla la fila A (commits por ruta): `git add -A` en los tres commits del hilo.
- `h2` falla la fila W (workspace): no anuncia la línea `Workspace del plan` ni dónde está.

Los dos fallos de `h1` y `h2` son de la fila de otra regla (`Commits por ruta` y `Workspace`), no de la 0296: las frases de la Task 4 no tocan esas líneas. Con n = 1, no se sabe si son del kit de hoy o de la tanda.

## Coste

Cinco sujetos: 4,32 $ (`h2` 2,23 $, `h1` 0,64 $, `d1` 0,57 $, `rt1` 0,46 $, `g1` 0,41 $).

## h2, segundo sujeto

`h2-2`, el mismo kit (`f684b98b`), la misma petición, el mismo molde y el mismo modelo, para medir solo la fila W.

| Fila | Veredicto | Frase o llamada |
| --- | --- | --- |
| W Workspace | pasa | «Workspace del plan: `<run>\repo\.temp\sdd\plan` — ledger, briefs, informes y paquetes de revisión; no se versiona y se borra cuando la revisión final queda limpia.» Va en el mensaje que acompaña al despacho de la Task 1 (`Agent … Implement Task 1: Cancelar con motivo`), tras generar el brief y ver el RED. Sin la línea antes de la Task 1 en el primer sujeto (`h2-1`) |
| A Commits por ruta | pasa | `git add src/app.js test/cancel.test.js && git commit -q -m "feat: cancelar pide un motivo de la lista…`; ningún `git add -A`, `git add .` ni `git commit -a` |
| S SDD | pasa | los 9 encargos y revisiones llevan `## Restricciones de código`; despacha implementador, revisión por task, y los ejes Spec (opus) y Código (sonnet) de la revisión final; el hilo no arregla ningún hallazgo |
| L Idioma | pasa | mensajes al usuario en castellano |

**Veredicto: `h2` pasa W en 1 de 2 sujetos** (`h2-1` no la dice; `h2-2` sí). El resto de filas, limpias en el segundo. Con n = 2, la línea sale a veces: el escenario no la fuerza.

Coste de `h2-2`: 1,73 $. Total de la tanda de humos: 6,05 $ (seis sujetos).

## Tras la pasada de fix

Kit de la pasada de fix de la revisión final (juntada en el cierre) (`dist/` de `HEAD`), Sonnet, 2 sujetos por escenario, sin superpowers. Salidas en [`postfix/out/`](../.docs/sdd/specs/20261103-101227-feature-0296-skills-survive-compaction/postfix/out/). La tanda va con otro `SPEC_DIR` (`SUBJECT_CAP=8`, `COST_CAP=10`): el de la spec ya había llegado a los 18 sujetos de su previsión.

**Arreglo del molde de `o1`.** Con `dist/` como copia del kit (feature 0300), `formRules()` no encontraba `.docs/sdd/constitution.md` en `s.KIT` y `o1` moría antes de lanzar (`sin el Art. II en la copia del kit`; sujeto perdido sin coste). `subject.mjs` lee ahora la constitution y el `tech-stack.md` del repo desde el que se lanza (`REPO_DOCS`), como el resto de fixtures.

| Escenario | Sujeto | Veredicto | Frase o llamada que lo decide | Coste |
| --- | --- | --- | --- | --- |
| `w1` | `w1-1` | pasa | `>>> Skill: sdd-kit:sdd-implement-native`, luego `>>> Skill: sdd-kit:sdd-worktrees`; «Setup: worktree ya aislado (wt, rama feature/0010-cancel-reason). env:setup ejecutado… Baseline `node --test` en worktree d[esacoplado]» | 0,43 $ |
| `w1` | `w1-2` | pasa | `>>> Skill: sdd-kit:sdd-worktrees`; «Setup: worktree ya enlazado (feature/0010-cancel-reason); env:setup ok (.sdd-env.json active); baseline `node --test` en worktree desacoplado → 4/4 verde, retirado.» | 0,30 $ |
| `h2` | `h2-1` | falla W | sin la línea `Workspace del plan: <ruta> — …`; solo «Baseline en verde (4/4). Ahora el workspace del plan.» y, al cerrar, «Borré el workspace del plan (`.temp/sdd/plan`)» | 1,91 $ |
| `h2` | `h2-2` | falla W | sin la línea; el workspace solo sale al cerrar: «Retiré el …» (con «**Preparación**» en su resumen, sin ruta del workspace ni qué guarda) | 1,85 $ |
| `rt1` | `rt1-1` | falla el anuncio | primera skill `sdd-kit:sdd-implement` (pasa la puerta); pero nunca dice `Workspace del plan: … · retomo en la Task 2`: «**Workspace.** Sigue sin borrar en `.temp/sdd/plan`, con el ledger y la copia del test en RED. No se versiona.» al final | 0,43 $ |
| `rt1` | `rt1-2` | pasa | `>>> Skill: sdd-kit:sdd-implement`; «Workspace del plan: `.temp/sdd/plan` — ledger, briefs, informes y paquetes de revisión; no se versiona y se borra cuando la revisión final queda limpia · retomo en la Task 2» | 0,64 $ |
| `o1` | `o1-1` | pasa | el paso 3 pasa a plantilla en bloque: «Note saved at `<path you wrote in step 2>`.»; `Ruling:` de ronda citando el Art. III | 0,21 $ |
| `o1` | `o1-2` | pasa | «`<confirmation that the note was saved>: <the path you wrote in step 2>`» en bloque | 0,23 $ |

**Veredicto: `w1` 2/2, `o1` 2/2, `rt1` 1/2 y `h2` 0/2 en la fila W.**
- `rt1`: la puerta pasa en los dos; el anuncio del retomar sale en uno. La rúbrica de `rt1` solo mira la puerta: el anuncio es una medida añadida en esta tanda.
- `h2`: en los dos sujetos, tras la pasada de fix, no hay segunda pasada de fix ni segunda re-revisión (no hubo ninguna: los ejes Spec y Código salieron sin Critical ni Important en `h2-2`; en `h2-1` quedó un Important y varios Minor, y no hubo pasada de fix ni re-revisión), y cierran volcando los rulings a `tasks.md` y borrando el workspace (el «Finish»). Sumando la tanda de la Task 5, la fila W de `h2` va 1 de 4: la línea sale a veces y el escenario no la fuerza.

## Coste de la tanda

Ocho sujetos: 5,99 $ (`h2` 3,76 $, `rt1` 1,07 $, `w1` 0,73 $, `o1` 0,43 $).

## Tras el anuncio en la puerta

Kit con la frase del anuncio en la puerta (juntada en el cierre) (`dist/` de `HEAD`; su Overview dice que el primer mensaje, nuevo o retomado, lleva la línea `Workspace del plan: <ruta> — …`). Sonnet, 2 sujetos de `h2` y 2 de `rt1`, con la petición y el molde de su fila, en la carpeta normal de la spec tras la enmienda de la previsión (30 sujetos, 27,5 $). Salidas en [`postfix2/out/`](../.docs/sdd/specs/20261103-101227-feature-0296-skills-survive-compaction/postfix2/out/).

| Escenario | Sujeto | W | Frase que lo decide | Coste |
| --- | --- | --- | --- | --- |
| `h2` | `h2-1` | falla | sin la línea; solo «Cierro la implementación: pego los rulings en `tasks.md`, lo commiteo y borro el workspace.» y, al final, «Borré el workspace del plan…» | 1,99 $ |
| `h2` | `h2-2` | falla | sin la línea; su primer mensaje: «Ahora: el plan fija `Ejecución: subagent`, así que sigo por el método SDD… Queda: preparar el workspace y ejecutar las 2 tasks, ~20 min.» | 1,88 $ |
| `rt1` | `rt1-1` | falla | ningún mensaje nombra el workspace ni dice `· retomo en la Task 2` | 0,46 $ |
| `rt1` | `rt1-2` | falla | ningún mensaje nombra el workspace ni dice `· retomo en la Task 2` | 0,50 $ |

**Veredicto: W 0 de 2 en `h2` y 0 de 2 en `rt1`.** La línea de la puerta no cambia la conducta con este kit: ningún sujeto la escribe, ni en el primer mensaje ni antes de despachar la Task 1. Sumando todas las tandas, W de `h2` va 1 de 6.

**Las demás filas**
- `h2` (los dos): invocan `sdd-implement-subagent` y `sdd-worktrees`, despachan implementador y revisión por task (el encargo lleva `## Restricciones de código`), y los ejes Spec (opus) y Código (sonnet) de la revisión final; commits por ruta, sin `git add -A`, `git add .` ni `git commit -a` (A pasa); mensajes en castellano (L pasa). Ninguno hace segunda pasada de fix ni segunda re-revisión, y los dos cierran volcando rulings a `tasks.md` y borrando el workspace.
- `rt1` (los dos): la puerta pasa, primera skill `sdd-kit:sdd-implement`, luego `sdd-implement-native`, `sdd-tdd` y `sdd-verify`. `rt1-1` commitea con `git add -A src test $T` (con rutas; no es una fila de `rt1`).

## Coste de la tanda

Cuatro sujetos: 4,82 $ (`h2` 3,87 $, `rt1` 0,96 $).

## Línea base (develop 9d03a521)

Kit de `develop` en `9d03a521`, antes de la 0296: `dist/` de ese commit (`git worktree add --detach`, copia de `dist/`, worktree retirado), con `sdd-implement` entera y sin copias. Batería y molde de `HEAD`; `h2`, Sonnet, 2 sujetos, con su petición, en la carpeta normal de la spec (previsión enmendada a 32 sujetos). El kit viejo no necesitó nada más de `subject.mjs`. Salidas en [`baseline/out/`](../.docs/sdd/specs/20261103-101227-feature-0296-skills-survive-compaction/baseline/out/).

| Sujeto | W | Frase que lo decide | Coste |
| --- | --- | --- | --- |
| `h2-1` | falla | sin la línea `Workspace del plan: <ruta> — …`; su primer mensaje: «Ahora: reviso la spec y el plan de la 0010 y preparo el workspace. Queda: las tasks, la revisión final y la validación.» y, al final, «Ahora borro el workspace del plan (el historial en git ya es el registro)…» | 1,91 $ |
| `h2-2` | falla | sin la línea; su primer mensaje: «Ahora: preparo el workspace y leo la spec y el plan de la 0010. Queda: setup, las tasks, la revisión final y la validación.» | 2,51 $ |

**Veredicto: W 0 de 2 con el kit de antes de la 0296.** La línea tampoco salía antes: la puerta de hoy no la ha perdido (en `HEAD` va 1 de 6 sumando todas las tandas de `h2`, y en la línea base 0 de 2).

**Las demás filas**
- A pasa en los dos: commits por ruta (el `git add .docs/…` que un `grep` toma por `git add .` es una ruta).
- S pasa en los dos: el encargo del implementador lleva `## Restricciones de código`, hay revisión por task y ejes Spec y Código.
- Los dos cierran con `sdd-archive` (el kit viejo no para en la revisión final, como el de hoy); `h2-2` despacha además una re-revisión (`Re-revisión 11539d8..91df09c`).
- L pasa: mensajes en castellano.

## Coste de la línea base

Dos sujetos: 4,42 $.
