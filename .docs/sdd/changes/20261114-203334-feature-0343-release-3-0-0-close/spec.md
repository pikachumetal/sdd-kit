---
id: 20261114-203334-feature-0343-release-3-0-0-close
feature: 0343
title: Cierre de la 3.0.0, lo que quedó de la 0152 y el corte
mode: full
profile: delegate
status: approved
created: 2026-11-14
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-14
---

# Spec — Cierre de la 3.0.0, lo que quedó de la 0152 y el corte

🦆 La 3.0.0 sale con su batería entera medida sobre el texto que se publica, no sobre uno de hace tres días. Antes se arreglan los seis escenarios que eligió el dev-lead, que fallan en todos sus sujetos o vuelven tras arreglarlos; por ejemplo, en `m1` de `sdd-roadmap` los dos sujetos dan el prompt de una fila con un título sin la forma de la plantilla (`### ✨ 0013 — …` en vez de `### *✨ 0013 — …*`). Cualquier otro rojo no para el corte: queda como fila de bug con su tasa, para que la próxima release sepa por dónde empezar. Después corre el comando del corte, `sdd-end-release` deja la 3.0.0 en `CHANGELOG.md`, y el merge a `main` y la etiqueta los decides tú.

Validación: agente — `validation.mode: field` de este repo: la verificación es la batería, el comando del corte y la suite; el uso real lo hacen los proyectos con los tickets de `sdd-feedback`.

## Capacidades

- Ninguna, porque herramientas y docs: los arreglos llevan cada regla que ya dice la capacidad al paso donde se decide, sin cambiar lo que promete. Si un arreglo cambia una conducta que una capacidad describe, o la capacidad no decide el caso (decisión 9), es un desvío y para (acción update).

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: área sin explorar (el texto de las skills de los seis rojos no lo he leído entero) · tamaño: ~120 líneas en ~12 ficheros (texto de skills, filas de batería, filas de `debt.md`, evidencia y changelog)
- Dominio (opus): si el umbral de la ronda (decisión 3) y la regla de las filas de bug (decisiones 5 y 6) cubren cada rojo del Scope, y si «Está hecho» se puede comprobar con lo que deja la feature (señal: área sin explorar)
- Técnica (sonnet): si la Previsión de coste y el COST_CAP cuadran con la n de cada batería, y si las filas nuevas de humo (decisión 8) son comprobables por máquina con la sintaxis de `battery.mjs verdict` (señal: área sin explorar)
- Mínimo razonable: un revisor sonnet con los siete puntos — deja sin mirar a fondo que la Previsión cuadre con las n y la sintaxis de las filas de máquina
```

1. **Enfoque: A, frente a B y C (ver Approach).** Primero la ronda sobre los seis rojos, después la batería entera sobre el kit ya arreglado, y las filas de bug salen de las dos medidas.
2. **Cada arreglo mueve la regla al paso donde se decide, o sustituye o quita otra.** El saldo de palabras de las skills tocadas, contadas juntas, queda en 0 o menos (`CLAUDE.md`, regla 6; `operations.md`: «Una regla que solo vive en una referencia no se lee»). En `sdd-upgrade` (3 palabras de margen), el arreglo sustituye texto, no añade.
3. **GREEN de la ronda con n = 4 por escenario**, umbral 4/4 (todos los de la ronda tienen umbral n/n). Con n = 2 un sujeto de diferencia no separa dos textos (aprendizaje de la 0342). Un 3/4 cuenta como «no verde».
4. **Una ronda de arreglo y como mucho un REFACTOR por rojo.** Si tras el REFACTOR no sale 4/4, se para de iterar y va a fila de bug con su tasa y su causa leída. Lo pide «sale verde o tiene su fila de bug» del enunciado y pone tope al coste. `u1` se arregla por sus dos filas: U1 (u1-1 no escribe la enmienda ni despacha el revisor) y U1r (u1-2 para antes de que vuelva el revisor), las dos de `sdd-implement`: «dispatch its reviewer, then stop with its findings in ✋».
5. **Toda fila de bug va a `.docs/sdd/steering/debt.md` «Por triar»**, una por skill, con cada escenario, su fila de rúbrica, su tasa como «k de n fallan» y la causa del lector. Cuenta la última fase que midió el escenario en la 0152 (el kit más reciente); las anteriores van entre paréntesis («1 de 2 en w-prp (2 de 2 en z-prp)»), y detrás, la tasa de la batería del corte de la 0343. Los rojos de `interviewer` van a la fila de `sdd-grilling`, y `f2`/`f3`, a la de `using-sdd`. Una por skill y no una por escenario, porque la regla 6 de `CLAUDE.md` («no puede ser que todo genere deuda») pide no inflar la tabla. El triaje lo hace después la sesión de `develop`.
6. **Qué rojo va a fila de bug** (ninguno para el corte, salvo la regresión):
   - todo rojo de la medida final de la 0152 que no está en la ronda, con cualquier tasa: los de 1 de 2 que pide el enunciado, y también los que fallan en todos sus sujetos y el dev-lead no puso en la ronda (`ci2` 2 de 2 de `sdd-archive`, `c2` 2 de 2 de `sdd-verify`, `f6`/`f6b`, `w1` y `s2` 1 de 1) y los de n ≥ 3 (`d1`, `fr1`, `cp1`);
   - todo rojo de la batería del corte que no estaba verde en la 0152, o que no tiene medida previa (la batería `interviewer` y las filas nuevas de la decisión 8);
   - un rojo de la ronda que sale 4/4 y vuelve en la batería del corte, con las dos tasas.
   - **Regresión**: un escenario verde en su última fase de la 0152 que falla en algún sujeto de la batería del corte, con cualquier n. Se relanza a n = 4 sobre el mismo kit: con 0 de 4, verde (era ruido); con 1 de 4, fila de bug; con 2 o más de 4, para como desvío, con su causa. El umbral de parada es más laxo que el 4/4 de la decisión 3 a propósito: la decisión 3 es el listón de los rojos que eligió el dev-lead, y este decide cuándo para el corte; un sujeto de diferencia no separa dos textos (aprendizaje de la 0342).
7. **La batería del corte es cada batería de `tests/batteries/` con su n** (16 baterías, `interviewer` incluida), más `f2` y `f3` de `using-sdd` con `SUPERPOWERS_DIR`, con `PHASE=release-3.0.0` (`operations.md` §Baterías) y `KIT_DIR` de `git archive <sha medido>:dist`. El sha medido es el commit de la rama con la ronda y las filas nuevas commiteadas y `dist/` reconstruido con `moon run kit:build`, el último que toca `skills/` o `includes/` antes del corte; el cambio de versión de `sdd-end-release` va después y no se mide. Los rojos de `sdd-grilling` e `interviewer` siguen la decisión 6: la 0342 los resolvió y no se reabren aquí.
8. **Dos filas de máquina nuevas, con la forma de la fila K de `interviewer`** (la columna es «Falla si…», así que van con `ausente`; la carga vale por `Skill`, por `Read` del `SKILL.md` o por `cat`/`Get-Content` sin recorte):
   - «No carga `add-to-changelog`», en `r4` de `sdd-retro` (el corte con filas en Now);
   - «No carga `sdd-templates`», en `sp1` y `co4` (escriben `spec.md`) y `p2` (escribe `plan.md`) de `sdd-propose`.
   - Cada fila se prueba antes del RED con el `verdict` sobre un `tools.txt` que carga la skill y otro que no. Su RED es la medida final de la 0152 de esos escenarios, releída con la fila nueva: sus `tools.txt` existen (`z-ret/out/r4-1`, `r4-2`; `z-prp/out/sp1-*`, `co4-*`, `p2-*`). No entran en la Previsión aparte: van dentro de la batería del corte.
9. **`g5` se decide por la capacidad `archive`, en sus tres filas** (G5a no corre nada tras el sync, G5b nombra las tareas saltadas, G5c `--verified-at` con el commit de cierre). Se aplican al molde `reservas-gate-base` los requisitos «El cierre integra la base…» y «Con otra rama abierta o la base por delante…» y sus «Límites», según lo que trae la base (solo docs o código), si el gate filtra y si «Suites» declara una suite unitaria. De ahí sale la conducta esperada en cada una de las tres filas. Cada fila que la contradice se reescribe; si la contradice el texto de `closing-suite.md`, se corrige el texto. G5b se arregla siempre por la misma vía: la línea `Gate:` nombra cada tarea del gate, `saltada (<porqué>)` incluido, como manda ya `closing-suite.md`. Si la capacidad no decide el caso del molde, es un `MODIFIED` de `archive` y para como desvío.
10. **Las lecturas en prosa las hace un lector sonnet por batería** (como en la 0152 y la 0342), que escribe su sección literal en `tests/release-3.0.0.md` bajo «Batería del corte (feature 0343)». La evidencia va en la carpeta de esta spec, una subcarpeta corta por fase (`r-rmp`, `r-upg`, `r-arc`, `r-imp` para la ronda; `c-<skill corta>` para el corte), con un `SPEC_DIR` único (la carpeta de la spec), para que `COST_CAP` y `SUBJECT_CAP` cuenten toda la campaña. Antes de la primera tanda, una ruta real de salida se compara con el tope de 140 caracteres de `path-length.test.ts`. `RUNS_DIR` en `.temp/<corto>` del worktree.
11. **El corte, en este orden**:
    - `moon run kit:upstream` antes de la ronda (regla 5).
    - La ronda (a), las filas de la decisión 8 y su RED, y las filas de bug de (b).
    - El sha medido y la batería del corte (c), con sus filas de bug.
    - Primer push de la rama y CI de `ci.yml` de ese commit antes del merge (`CLAUDE.md`, regla 7).
    - La feature se cierra con `sdd-archive` y `sdd merge --push` a `develop`, con la fila 0343 en ✅ y el walkthrough con (a), (b) y (c); después, el ticket de `sdd-feedback` sin commitear y el aviso a la sesión «sdd-kit develop» (`CLAUDE.md`, regla 6).
    - Sobre `develop`, `git diff --stat <sha medido> HEAD -- skills includes` vacío; si sale algo, se mide la batería de cada skill tocada antes de seguir.
    - `node cli/bin/sdd.js lock run -- moon run kit:build kit:skill-size kit:own kit:copies cli:test-slow cli:test-min`.
    - `sdd-end-release` para la 3.0.0, con su parada de merge a `main` y etiqueta: este repo tiene `release.hasRecipient: true` en `sdd-kit.json`, así que `release-flow` mantiene el gate, y el Art. IV deja ese merge y la etiqueta a una persona. Los marcadores «Última revisión» de `.docs/workflow/` ya dicen kit v3.0.0: `workflow-docs.test.ts` no se pone en rojo con el cambio de versión.
    - El resultado del comando del corte va a los registros que escribe `sdd-end-release` y al mensaje final.
    - Un rojo de `kit:upstream` deja sus fuentes para revisar como parte de la release (Art. V) y lo que convenga traer va al roadmap, sin parar.
12. **Precondiciones de la máquina, comprobadas antes de gastar**: `SDD_UPSTREAM_DIR` con los clones de las fuentes (sin ella, el pre-commit para todo commit que toca `skills/` y `kit:upstream` falla) y un clon de superpowers para `SUPERPOWERS_DIR`. Hoy ninguna está en esta máquina: es lo primero que te pido al aprobar.
13. **`COST_CAP` de la campaña: 485 $ y `SUBJECT_CAP` 1.060**, solo sujetos, con la misma fórmula. La Previsión, 333,22 $ ×1,16 (lo que se queda corta según `operations.md`), da 386,5 $; con el 20 % de reserva sobre el techo para lo que destape la revisión final, 386,5 / 0,8 = 483 $, redondeado a 485 $. Los sujetos, ~730 ×1,16 / 0,8 ≈ 1.060. Los lectores, los revisores y los ejes de la revisión final van aparte (~40 $, abajo). Llegar al techo es una parada.
14. **Arreglos posteriores a la batería del corte**: si una parada por regresión acaba en un arreglo, se vuelve a medir la batería de cada skill tocada sobre el sha nuevo, que pasa a ser el sha medido. No se edita `subject.mjs` ni una batería con una tanda en marcha (`operations.md`).
- Política de modelos: revisores de la spec, dominio opus y técnica sonnet; la segunda ronda, un revisor sonnet · sujetos sonnet, por tandas de hasta 5 (`MAX_PARALLEL`), con `run.mjs` · lectores sonnet, uno por batería o lote, hasta 3 en paralelo (`control.maxParallelAgents`) · ejes de la revisión final: Spec opus+high, Código sonnet+high, sin eje de Arquitectura (no cambia la estructura del repo) · al aprobar la spec, esta línea es la confirmación de paralelizar que piden las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

Dominio (opus):

- **Aceptado** — Crítico: el sha medido no es el que se corta, y entre los dos entran merges → decisiones 7 y 11: sha medido fijado y `git diff --stat` vacío sobre `develop` antes del corte.
- **Aceptado** — Crítico: la decisión 9 solo arbitraba G5a, y la capacidad tiene dos ramas → decisión 9 cubre G5a, G5b y G5c, decide por si el molde declara suite unitaria y para si la capacidad no decide.
- **Aceptado** — los rojos que no son 1 de 2 (`ci2`, `c2`, `f6`, `w1`, `s2`, `d1`, `fr1`, `cp1`) no tenían destino, y «seis fallan en todos» era falso → decisión 6 y Scope (b); el 🦆 y el Intent dicen «los seis que eligió el dev-lead».
- **Aceptado** — tasas distintas del mismo escenario en varias fases → decisión 5: cuenta la última fase, las anteriores entre paréntesis.
- **Aceptado** — a la decisión 6 le faltaban los fallos parciales con n ≥ 3, los escenarios sin medida previa y n ≤ 2 → reescrita en «k de n fallan», sin medida previa a bug, relanzamiento a n = 4 antes de parar.
- **Aceptado** — faltaba la parada de merge a `main` y etiqueta (Art. IV, `release-flow`) → decisión 11 y 🦆; el éxito incluye la etiqueta.
- **Aceptado** — el corte va después del cierre y el walkthrough no puede registrarlo → decisión 11: el walkthrough lleva (a)-(c) y el corte va a los registros de `sdd-end-release`.
- **Aceptado** — sin regla para arreglos tras la batería del corte → decisión 14.
- **Aceptado** — `u1` falla también U1 → decisión 4 y Scope (a).
- **Aceptado** — «No entra» chocaba con las filas nuevas → «No entra» exceptúa la decisión 8, que lista los escenarios.

Técnica (sonnet):

- **Aceptado** — Crítico: las filas de humo con `presente` en una columna «Falla si…» daban rojo al sujeto que carga la skill → decisión 8: `ausente`, con la forma de la fila K y probadas con dos `tools.txt`.
- **Aceptado** — el regex de `sdd-templates` no casaba con `\` de Windows ni con `cat` → decisión 8, forma de la fila K (`[\\/]`, `Skill`, `Read`, `cat`/`Get-Content`).
- **Aceptado** — sin lista de escenarios → decisión 8: `sp1`, `co4`, `p2`.
- **Aceptado** — un `SPEC_DIR` por fase partía `COST_CAP` y `SUBJECT_CAP` → decisión 10: un `SPEC_DIR` único con subcarpetas, y `SUBJECT_CAP` 800 en la decisión 13.
- **Aceptado** — los 460 $ no salían de la fórmula → decisión 13 con la cuenta: 485 $.
- **Aceptado** — la Previsión omitía lectores y revisiones → fila aparte en la Previsión, fuera de `COST_CAP`.
- **Aceptado** — el sha medido y `dist/` → decisión 7: `dist/` reconstruido y commiteado en el sha medido, el bump de versión no se mide.
- **Aceptado** — `SDD_UPSTREAM_DIR` y `SUPERPOWERS_DIR` sin nombrar → decisión 12, y hoy faltan las dos.
- **Aceptado** — decisiones del cuerpo fuera de ✋ y rutas largas → decisiones 10 y 11, con subcarpetas cortas y la comprobación de 140 caracteres.
- **Aceptado** — «Topes de palabras» solo lista cinco skills → se completa al leer la causa de cada rojo (nota bajo la tabla) y `sdd-upgrade` sustituye texto (decisión 2).

Segunda ronda (sonnet, siete puntos):

- **Aceptado** — Crítico: la rama «no declara suite» de la decisión 9 contradecía la capacidad (el árbol depende de lo que trae la base y de si el gate filtra) → decisión 9 aplica los dos requisitos de `archive` al molde, sin presuponer la rama.
- **Aceptado** — G5b sin arreglo → decisión 9: se arregla siempre, por la línea `Gate:` de `closing-suite.md`.
- **Aceptado** — regresión sin regla para n ≥ 3 y dos umbrales → decisión 6: relanzamiento a n = 4 con cualquier n, y el umbral distinto del de la decisión 3 justificado.
- **Aceptado** — `SUBJECT_CAP` sin margen → decisión 13: 1.060, con la misma fórmula.
- **Aceptado** — `workflow-docs.test.ts` con el cambio de versión → comprobado: los tres marcadores ya dicen kit v3.0.0 (decisión 11).
- **Aceptado** — faltaban las reglas 6 y 7 de `CLAUDE.md` → decisión 11.
- **Aceptado** — el RED de la decisión 8 daba por hecho los `tools.txt` → comprobado que existen (decisión 8).
- **Aceptado** — el orden de la decisión 11 no tenía la batería → pasos en orden.
- **Aceptado** — la parada de merge y etiqueta frente a `release-flow` → decisión 11: `hasRecipient: true` mantiene el gate.
- **Aceptado** — destino de los rojos de `interviewer` y `f2`/`f3` → decisión 5.

### Decisiones tomadas con el dev-lead

- La 0152 se cerró con sus arreglos y lo pendiente pasó aquí — «la podemos mergear y cerrar de momento, ponernos con grilling, y luego seguir» (2026-11-13)
- Un rojo de 1 de 2 sujetos no para el corte, solo queda como bug con su tasa — prompt de lanzamiento de la 0343 (2026-11-14)
- Los rojos de `sdd-grilling` quedan fuera — «los resolvió la 0342» (prompt de lanzamiento, 2026-11-14)
- Lo entendido al arrancar, confirmado — «si» (2026-11-14)
- Review de la spec con dos revisores, dominio en opus y técnica en sonnet — «dom opus tec sonnet» (2026-11-14)

## Intent

La 3.0.0 se medía con su batería entera en la 0152, pero la medida final es de un kit (bca0e00e y arreglos x-, w-, y-) que ha cambiado después en 15 ficheros de skills. Además, seis escenarios que el dev-lead eligió fallan en todos sus sujetos o vuelven tras arreglarlos. Hay que cortar la versión sabiendo cómo se comporta el texto que se publica. El éxito es:

- el comando del corte en verde con `lock run`;
- `## [3.0.0]` en `CHANGELOG.md` y la etiqueta sobre el merge en `main`, cuando el dev-lead los decida;
- cada rojo de la ronda verde o con su fila de bug y su tasa.

Fracasa aunque corte si un rojo de la medida final se queda sin destino, o si se publica un texto de `skills/` tocado después del sha medido.

## Scope

- Entra:
  - (a) una ronda sobre `m1` y `m3` de `sdd-roadmap`, `v5` de `sdd-upgrade`, `g5` de `sdd-archive` (G5a, G5b, G5c) y `u1` (U1 y U1r) y `h2` (S) de `sdd-implement`: arreglo, GREEN con n = 4 y, si hace falta, un REFACTOR;
  - (b) filas de bug en `debt.md` «Por triar» para los rojos de la medida final de la 0152 que no están en la ronda (`tests/release-3.0.0.md`, lectores z-, x-, w-, y-), con su tasa (decisiones 5 y 6);
  - (c) la batería del corte con la n de cada batería, con las dos filas nuevas de la decisión 8 y `f2`/`f3` de `using-sdd` con `SUPERPOWERS_DIR`; sus rojos siguen las decisiones 5 y 6;
  - (d) `kit:upstream`, el comando del corte con `lock run` y `sdd-end-release` para la 3.0.0 (decisión 11).
- No entra: los rojos de `sdd-grilling` e `interviewer` como trabajo (la 0342; si salen, decisión 6); reescribir filas de rúbrica, salvo las de los rojos de la ronda y las nuevas de la decisión 8; nada de `cli/` salvo lo que pida un rojo del comando del corte.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Filas G5a, G5b o G5c de `g5`, o el texto de `closing-suite.md` §After the sync merge, según la capacidad | `tests/batteries/sdd-archive/battery.md` (G5a-G5c) · `skills/sdd-archive/references/closing-suite.md` | decisión 9 |

- Filas que implementa: 0343 → `ROADMAP.md` (fila 0343, ⏳ → ✅ al cerrar) y el walkthrough de la 0152 §3 y §4.3, que la nombra como destino (evidencia, no se edita) | comprobado con `git grep -n "0343" -- . ':!.docs/sdd/changes' ':!.docs/sdd/specs' ':!.docs/sdd/field-reports' ':!tests/*.md'`

## Approach

- A — ronda sobre los seis rojos, batería del corte sobre el kit arreglado, bugs de las dos medidas — una sola medida entera, sobre el texto que se publica; los bugs llevan dos tasas.
- B — batería entera primero y la ronda después — mide un kit que la ronda cambia: habría que re-medir los tramos tocados, ~30 $ más, y la batería no sería del texto publicado.
- C — re-medir solo los escenarios cuyas skills cambiaron desde bca0e00e — más barato, pero cambiaron 15 ficheros de 12 skills, y las skills se cargan unas a otras: el ahorro es pequeño y deja sin medir el kit entero, que es lo que pide la fila.
- Elegido: A — es la única que mide una sola vez el texto que se publica.

Cada rojo de la ronda parte de la causa que ya leyó su lector en `tests/release-3.0.0.md` (su RED). La campaña la lanza `run.mjs` por tandas, con `SPEC_DIR`, subcarpetas y `RUNS_DIR` como dice la decisión 10.

## Dónde se prueba

- Los seis rojos de la ronda: su batería, `SCENARIOS` del rojo con `N=4` (`battery.mjs run` y lector).
- La batería del corte: `battery.mjs run` de cada batería con su n, y lectura de las filas en prosa.
- Las filas de la decisión 8: `verdict` sobre dos `tools.txt` (uno que carga y otro que no) antes del RED, y después en la batería del corte.
- Saldo de palabras: `cli/test/kit/word-budget.test.ts` y el conteo antes y después de lo tocado.
- El sha medido: `git diff --stat <sha medido> HEAD -- skills includes` vacío en `develop` antes del corte.
- El corte: el comando de la regla 5 con `lock run`, `## [3.0.0]` en `CHANGELOG.md` y, tras la parada del dev-lead, la etiqueta.

## Términos y ADR

- Términos resueltos: sha medido — el commit cuyo `dist/` mide la batería del corte, el último que toca `skills/` o `includes/` antes del corte
- ADR candidatas: ninguna

## Topes de palabras

Medido con el conteo de `word-budget.test.ts` (palabras separadas por espacios, sin `migrations/`) sobre `dist/skills/` de `origin/develop` (5b533b9d). Lo previsto es 0 o menos (decisión 2): ningún tope cambia. Si la causa de un rojo lleva a otra skill o referencia (`sdd-implement-native`, `sdd-templates`), su fila se añade al leer esa causa, con la misma regla.

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-roadmap` (SKILL.md / total) | 2914 / 3222 · 3267 / 3630 | 308 · 363 | sin cambio |
| `sdd-upgrade` | 977 / 980 | 3 | sin cambio |
| `sdd-archive` (SKILL.md / total) | 2879 / 2932 · 9627 / 9904 | 53 · 277 | sin cambio |
| `sdd-implement` (SKILL.md / total) | 2568 / 2633 · 6553 / 6626 | 65 · 73 | sin cambio |
| `sdd-implement-subagent` (SKILL.md / total) | 2910 / 2951 · 8421 / 8462 | 41 · 41 | sin cambio |

## Previsión de coste

Los escenarios sin medida previa llevan el precio medio de su batería (lo dice `plan`): `sdd-implement` 8, `sdd-rubber-duck` 4 y `sdd-verify` 15.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| GREEN `sdd-roadmap` | `SCENARIOS="m1 m3" N=4` → `suma: 8 sujetos · coste previsto: 1.06 $` | 1.06 |
| GREEN `sdd-upgrade` | `SCENARIOS="v5" N=4` → `suma: 4 sujetos · coste previsto: 2.50 $` | 2.50 |
| GREEN `sdd-archive` | `SCENARIOS="g5" N=4` → `suma: 4 sujetos · coste previsto: 2.03 $` | 2.03 |
| GREEN `sdd-implement` | `SCENARIOS="u1 h2" N=4` → `suma: 8 sujetos · coste previsto: 11.71 $` | 11.71 |
| Una tanda de REFACTOR (la ronda entera otra vez) | las cuatro de arriba | 17.30 |
| Batería del corte (16 baterías, n de cada una) | `plan` de cada `battery.md`: interviewer 34 · 7.45; sdd-agent-writing 14 · 1.91; sdd-archive 102 · 46.54; sdd-debugging 7 · 2.11; sdd-explore 7 · 0.89; sdd-feedback 1 · 0.17; sdd-grilling 34 · 8.45; sdd-implement 115 · 58.82; sdd-init 12 · 1.81; sdd-propose 127 · 81.27; sdd-retro 10 · 1.92; sdd-roadmap 35 · 5.80; sdd-rubber-duck 19 · 2.17; sdd-upgrade 25 · 8.55; sdd-verify 60 · 48.93; using-sdd 46 · 7.28 | 284.07 |
| `f2` y `f3` de `using-sdd` con `SUPERPOWERS_DIR` | `SCENARIOS="f2 f3"` → `suma: 2 sujetos · coste previsto: 0.35 $` | 0.35 |
| Relanzamientos de «no cargó», «sin evidencia» y regresiones a n = 4 (~5 % de la batería del corte) | estimado, ~32 sujetos | 14.20 |
| Suma de sujetos (base de `COST_CAP`) | ~730 sujetos | 333.22 |
| Fuera de `COST_CAP`: lectores sonnet (~16), segunda ronda de review y ejes de la revisión final | estimado con la 0342 (35 despachos, 14,99 $) y la 0152 (ejes, 7,98 $) | ~40 |

## Enmiendas

- **2026-11-16 — los rojos de la batería del corte se arreglan antes del corte** (dev-lead, «si haces una pasada infernal salen errores los resolvemos y luego la volvemos a pasar»; aprobado con «ok» al plan de seis pasos). Sustituye la decisión 6 para los rojos de la batería del corte: (1) se leen las fases pendientes; (2) la lista de rojos, cada uno con su skill, qué falla y si el arreglo va en la skill o en la batería, se presenta al dev-lead, que decide qué entra; (3) un arreglo por skill, que cubre todos sus rojos, y los de batería aparte; (4) se relanzan solo esos escenarios a n = 4, umbral 4/4, sin repetir la batería entera; (5) lo que siga rojo se presenta al dev-lead: otro intento o fila de bug; (6) el corte, como en la decisión 11. Los relanzamientos sin arreglo de la decisión 6 se retiran (los de `interviewer` y `sdd-grilling` ya corrieron). La decisión 14 queda sustituida por (4): el riesgo de que un arreglo rompa otro escenario de su skill se acepta. Previsión: ~10 $ de lectores y ~45 $ de relanzamientos (~100 sujetos a 0,44 $), dentro de `COST_CAP`.
- **2026-11-16 — aprobada por el dev-lead el 2026-11-16 («1», tras revisar 7354ce90 y 1c653cb1 en la sesión de develop; el punto 3 queda a un patch de la 3.0.x que devuelve la prueba estricta de una interrogación por mensaje): lo que la enmienda anterior arrastra, con las frases del dev-lead del mismo día.** (1) Su paso (3) abre como trabajo los rojos del corte de `sdd-grilling` e `interviewer` (también `sdd-config`): la línea 3 de «Decisiones tomadas con el dev-lead», la última frase de la decisión 7 y «No entra» valen solo para los rojos de la medida final de la 0152. (2) TP pasa de «carga `sdd-templates`» a «lee su plantilla», también con un `| head -N` que la lee entera (N ≥ 210; la más larga, `plan-template.md`, tiene 205 líneas) («lo ideal es que lea su plantilla… el problema es que no la lea»): sustituye la forma de la decisión 8 para TP y R9. (3) E5 y R1 fallan solo con preguntas de asuntos distintos («me empieza a poner que quieres hacer tal o cual y de esta otra»). (4) Lo que sigue rojo tras el arreglo va a fila de bug si con superpowers fallaría igual, y si no se arregla ahora («si los hiciera con superpowers… ¿fallarían también? si sí, fila en el roadmap; si no, se arreglan ahora»). (5) Sha medido: el último commit de la rama que toca `skills/` o `includes/`, el de los arreglos tras la re-revisión final; lo mide el relanzamiento que aprobó el dev-lead el 2026-11-16 («Relanzar todo»): lo que piden las Confirmaciones de las ADR 0035, 0017, 0032 y 0028, `n7` y los escenarios cuyo texto cambió la pasada de fix, no la batería entera, y la comprobación de la decisión 11 se hace contra él.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-14 | aprobada (opción «Apruebo») |
