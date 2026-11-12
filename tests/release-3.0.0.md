# Batería de release de la 3.0.0 (feature 0152)

## Rojos de develop (0311 §5 y §6), n = 3, kit de develop (6418f13e)

Lectura de las salidas de `.docs/sdd/specs/20261110-205400-feature-0152-coherence-smoke-release/<fase>/out/`. Criterio: el umbral de cada escenario es «todos» (2/2, 1/1), así que con n = 3 cuenta 3/3; por debajo, «rojo, se repite». «Ruido» es un rojo de la 0311 que ahora sale 3/3 verde. Las filas en prosa las leyó una sola persona, sin segundo lector.

**Aviso de alcance.** La spec (§4, punto «los rojos que la 0311 vio en develop») atribuyó mal varias baterías: el ticket de la 0311 §5 nombra la batería solo en `pt1`, `c1`, `n1`, `d1` (de `sdd-debugging`), `f1` (de `sdd-propose`) y `m5`; `u1`, `h1` y `h2` son de `sdd-implement` (sus filas `U1`, `U1r`, `W` y `A` solo existen allí). Las fases `b-use`, `b-upg` y el `d1` de `b-imp` midieron otros escenarios con el mismo id (`using-sdd:u1` y `f1`, `sdd-upgrade:h1` y `h2`, `sdd-implement:d1`). Salen en la tabla, pero **no re-miden los rojos de la 0311**. Sin medir con n = 3: `sdd-implement:u1` (U1, U1r), `sdd-implement:h1` y `h2` (W, A), `sdd-debugging:d1` (C) y `sdd-propose:f1` (F1-C).

| Batería:escenario | Fila | Sujeto 1 | Sujeto 2 | Sujeto 3 | Veredicto |
| --- | --- | --- | --- | --- | --- |
| sdd-implement:pt1 | PT-A Sin skill intermedia | pasa | pasa | pasa | verde |
| sdd-implement:pt1 | PT-B Sin revisores | falla: `Agent … · Revisar patch 0015` | falla: `Agent … · Revisar patch 0015` | falla: `Agent … · Revisión del patch 0015` | rojo, se repite (0/3) |
| sdd-implement:pt1 | PT-C Lee el flujo | pasa: `Read …patch-flow.md` | pasa | pasa | verde |
| sdd-implement:pt1 | PT-D Evidencia | pasa: «`node --test` → corrió 6/6 (antes del fix, … rojo)» | pasa: RED con `actual 'cancelada Norte mar'`, 5/5 | pasa: RED con `git stash`, 4/4 | verde |
| sdd-implement:pt1 | L Idioma | pasa | pasa | falla: «Dependencies: no `node_modules`, but let me check whether the project needs any» | rojo, se repite (2/3) |
| sdd-implement:d1 | D1 Ruling contra una decisión | pasa: `git rm test/legacy.test.js`, borra entero | pasa: borra entero | pasa: borra entero | verde |
| sdd-implement:d1 | L Idioma | pasa (encabezados fijos «Rulings I made» y «Deferred minors» del kit, en un mensaje en castellano) | pasa | pasa | verde |
| using-sdd:u1 | Puerta: primera skill `sdd-kit:sdd-upgrade` | pasa | pasa | pasa | verde |
| using-sdd:f1 | Puerta: primera skill `sdd-kit:sdd-propose` | pasa | pasa | pasa | verde |
| sdd-upgrade:h1 | Puerta: primera skill `sdd-kit:sdd-init` | falla: primera `Skill: sdd-kit:sdd-upgrade` | falla: ídem | falla: ídem | rojo, se repite (0/3) |
| sdd-upgrade:h1 | H1 Traspaso desde sdd-init | pasa: `sdd-kit.json` en `2.3.4`, commit `146a096 chore(sdd): migrar al kit v2.3.4`, `sdd-upgrade` invocada | pasa: `5e21feb` | pasa: `1035ee6` | verde (la fila pasa; falla la puerta) |
| sdd-upgrade:h2 | Puerta: primera skill `sdd-kit:sdd-upgrade` | pasa | pasa | pasa | verde |
| sdd-upgrade:h2 | H2 Una sola pregunta sin marcador | pasa: «¿Es un proyecto anterior a v0.2.0, o una init de 2.x que se quedó a medias?», molde sin cambios | pasa: `sdd-upgrade` e `sdd-init` una vez cada una, una pregunta | pasa | verde |
| sdd-verify:c1 | C1 Cierre único | falla: ni arregla ni re-revisa; para con 🦆 y ✋ por «desviación» (AND nuevo en `spec.md`), sin `Final:` en el ledger | falla: ídem, para con ✋ A/B; 0 `Agent` | falla: arregla en `475296c`, pero la re-revisión es `effort-medium` + `sonnet`, el ledger usa `Ruling:` en vez de `Final: fixed`, el Minor no va como `Final: minor (deferred)`, sin `Re-revisión:` en `tasks.md` y sin ✋ | rojo, se repite (0/3) |
| sdd-verify:c1 | L Idioma | pasa | pasa | pasa | verde |
| sdd-init:n1 | C1 Gate de `CLAUDE.md` | pasa: `## diff` vacío, presenta el borrador y pide «sí» | pasa | pasa | verde |
| sdd-init:n1 | C2 Cosecha | pasa: «Las fechas van en UTC» a discrepancias; «`operations.md` … repite ese puerto 3000» | pasa: «Ya está en `operations.md`» | pasa: «ya está en `operations.md`» | ruido (el rojo de la 0311 no se repite) |
| sdd-roadmap:m2 | M2 Prompt en el cierre | falla: «su prompt de arranque está sin generar. Dime «dame el prompt de la 0009»» | pasa: prompt de la 0009 y «Si prefieres hacerlo en esta sesión, di "arráncalo"» | pasa: ídem | rojo, se repite (2/3) |
| sdd-roadmap:m2 | M2b Forma de la propuesta | falla: la regla «Las reservas guardan día de la semana, no fecha» (semana tipo) no lleva ejemplo con entrada y salida | pasa: `source: interview`, ejemplos, reparto con id y «Tras», filas con `proposal: 0008` y «tras» (la nota de dependencia con la fila 1 no es regla de negocio) | pasa | rojo, se repite (2/3) |
| sdd-roadmap:m2 | L Idioma | pasa | pasa | pasa | verde |
| sdd-roadmap:m5 | M5 Fila nueva | falla: tabla con «Sección», sin ⏳ ni one-liner; brief con 3 etiquetas (`Carril`, `Toca`, `Salda`) | pasa: Next, título y one-liner, ⏳, tamaño S, brief con las cinco etiquetas | falla: sin ⏳; brief con 3 etiquetas | rojo, se repite (1/3) |
| sdd-roadmap:m5 | L Idioma | pasa | pasa | pasa | verde |

Resumen: 7 filas rojas que se repiten (`pt1` PT-B y L, `h1` puerta, `c1` C1, `m2` M2 y M2b, `m5` M5), 1 ruido (`n1` C2) y el resto verde.

## Causa de cada escenario rojo

**sdd-implement:pt1, PT-B (3/3 despachan un revisor).** El sujeto hace lo que manda el kit: `skills/sdd-implement/references/patch-flow.md`, paso 5, dice «A patch has **no final review** and no axes: before the fix commit, dispatch one reviewer (`sdd-kit:effort-medium`, `model: sonnet`) with `patch.md` and the diff … (dev-lead, 2026-11-04)», y los tres lanzan exactamente eso, una vez, antes del commit del fix (`subagent_type=sdd-kit:effort-medium model=sonnet`). El rojo es de la **batería**: `PT-B` sigue siendo «`tools: />>> Agent/` presente» desde la feature 0206 («sin revisión final»), y la decisión del 2026-11-04 (commit `8f6357c1`, un revisor en patch) no la actualizó; la batería no menciona ningún revisor de patch. El ticket de la 0311 §5 lo atribuye a `patch-flow.md`, pero el texto lo exige. Arreglo: reescribir PT-B como «falla si despacha un revisor final o un eje, o más de un `Agent`, o uno que no sea `sdd-kit:effort-medium` + `sonnet`, o después del commit del fix», y quitar «sin revisión final» de la procedencia de `pt1`.

**sdd-implement:pt1, L (1/3).** `pt1-3` abre con un mensaje intermedio en inglés («Dependencies: no `node_modules`, but let me check whether the project needs any…»); los mensajes finales y el resto, en castellano. Un solo caso en un mensaje de trabajo, no de cierre: es de conducta, pero con 1/3 y sin que la 0311 lo viera es el más débil de los rojos.

**sdd-upgrade:h1, puerta (0/3; la fila H1 pasa 3/3).** La petición es «Usa la skill sdd-kit:sdd-init. Ponme el proyecto al día.» y el esperado, que la primera `Skill` sea `sdd-init`. Los tres sujetos no la invocan: dicen «Este proyecto ya está inicializado (kit 2.3.3) … Eso lo cubre `sdd-upgrade`, no `sdd-init`, así que invoco esa» y siguen por `sdd-upgrade`: ejecutan `sdd upgrade`, marcan `2.3.4` y commitean `chore(sdd): migrar al kit v2.3.4`, que es lo que pide H1. La puerta mide mal: la descripción de `sdd-init` (desde la 0157, «Not for updating an initialized project to the kit (that is sdd-upgrade)») deja que el sujeto decida por ella y se salte el predicado 3, que es lo que `h1` quería medir («nadie medía que el predicado 3 de `sdd-init` entregue la migración»). Conducta aceptable (llega al mismo resultado); fallan la batería y el molde. El GREEN de la 0157 (`tests/sdd-upgrade-green.md`, 1/1) no lo vio con n = 1. Arreglo: o quitar la puerta de `h1` y medir solo H1, o una petición que entre de verdad por `sdd-init` («Prepara el proyecto para trabajar con SDD») sobre el molde en `2.3.3`. No es un rojo de la 0311: allí `h1` es de `sdd-implement`.

**sdd-verify:c1, C1 (0/3, tres formas).** Ninguno de los tres sujetos carga `sdd-verify` ni `sdd-implement-native`, ni lee `references/closing-the-review.md` (solo `Skill: sdd-kit:sdd-implement`; en `d1`, con la misma entrada, sí cargan `sdd-implement-native`). La única entrada a «Closing the review» está en `skills/sdd-verify/SKILL.md` (líneas 186 y 278) y en el `Final Review` de `sdd-implement-native`; `sdd-implement/SKILL.md`, «After the last task», no remite a ninguna de las dos. Con los ejes ya devueltos y la petición «Sigue», el hilo cierra con lo que sabe: `c1-1` y `c1-2` toman el recorte de espacios como desviación (un AND nuevo) y paran con ✋ sin arreglar ni re-revisar; `c1-3` arregla en una pasada, pero con una re-revisión `effort-medium` + `sonnet`, ledger con `Ruling:` en vez de `Final:`, el Minor sin tratar y sin ✋. Es de la **skill** (conducta: falta el puntero en `sdd-implement` cuando ya hay informes de ejes) con un componente del **molde**: el Important de `review-code-c1.md` es ambiguo, porque la spec dice «un motivo fuera de la lista responde «motivo no válido»» y `"sala ocupada "` está fuera al pie de la letra; 2 de 3 lo leyeron como desviación, y la batería ya tiene `c6` para el desvío de verdad. Cruza con el ticket de la 0311 («C1: sin ✋ al parar»): `c1-3` repite ese fallo; `c1-1` y `c1-2` fallan por otro lado (sí hay ✋, pero no hay pasada ni re-revisión).

**sdd-roadmap:m2, M2 y M2b (2/3).** Un solo sujeto falla las dos: `m2-1` cierra con «su prompt de arranque está sin generar. Dime «dame el prompt de la 0009»» (no abre `launch-prompt-template.md`; `m2-3` sí lo lee) y deja una regla (la «semana tipo») sin ejemplo con datos; también añade por su cuenta una fila 0009 de persistencia. `m2-2` y `m2-3` cumplen. No salió en el ticket de la 0311; con 2/3 frente a 2/2 queda por debajo del umbral, pero es el único sujeto malo de tres: conducta de la skill (el cierre dice «da el prompt», y un sujeto lo convierte en oferta), a re-medir antes de abrir fila.

**sdd-roadmap:m5, M5 (1/3).** Dos sujetos (`m5-1`, `m5-3`) proponen la fila, como pide `delegate`, pero la tabla no lleva ⏳ y el brief solo trae `Carril`, `Toca` y `Salda` (en `m5-1`, además, sin one-liner y con una «Sección»); `m5-2` trae las cinco etiquetas, ⏳, one-liner, Next y tamaño S. Los tres hacen una sola llamada `Bash` y no leen `now-next-later-template.md`, que es donde están las cinco etiquetas y el ⏳; `skills/sdd-roadmap/SKILL.md` (línea 69) pide «id, title, one-liner, brief and size» sin nombrar las etiquetas ni el estado. Es de la **skill**: la forma de la fila no está en el paso donde se propone. Cruza con el ticket de la 0311 §6: allí M5 «pasa 1/1 con develop» y falla con la rama; con n = 3 el propio `develop` falla 2/3, así que esa diferencia no era del texto de la rama y la 0311 vio ruido en su control de N = 1.

**sdd-init:n1, C2 (ruido).** El ticket vio «quita el puerto sin decir que vive en `operations.md`»; con n = 3 los tres sujetos dicen dónde vive («`operations.md`, que ya aprobaste, repite ese «puerto 3000»», «Ya está en `operations.md`»). C1 también pasa 3/3.

**Escenarios verdes.** `sdd-implement:d1` (3/3, sin `Ruling:` que conserve nada del fichero) y `using-sdd:u1` y `f1` (3/3 en la puerta: `sdd-upgrade` y `sdd-propose`; esta batería no tiene filas U1, U1r ni F1-C, que son de `sdd-implement:u1` y `sdd-propose:f1`). `sdd-upgrade:h2` pasa 3/3: `h2-2` invoca `sdd-init` tras `sdd-upgrade`, una vez cada una, y pregunta una sola vez.

## Rojos de develop atribuidos a otra batería en la spec (n = 3)

Los seis escenarios que el aviso de alcance de arriba dejó sin medir, ahora con su batería: `sdd-implement:u1`, `h1` y `h2`, `sdd-debugging:d1`, `sdd-propose:f1` y `sdd-roadmap:m2` (la tanda `b-rmp2`). Kit y moldes de `develop`; salidas en `b-imp2`, `b-dbg`, `b-prp` y `b-rmp2` de la carpeta de la spec. Rúbrica de `battery.md` en el commit `94806cb4`, filas en prosa; las de máquina (`tools:`, `state:`) las aplicó la tanda y no se repiten aquí. Un solo lector, sin segundo.

Las salidas de `texts.txt` mezclan los mensajes del hilo con los informes de los subagentes (implementadores, revisores). La fila `L` mira solo lo que el hilo dice al usuario. `u1` tiene dos turnos: `U1` y `U1r` miden el turno 1, `U2` el 2.

| Batería:escenario | Fila | Sujeto 1 | Sujeto 2 | Sujeto 3 | Veredicto |
| --- | --- | --- | --- | --- | --- |
| sdd-implement:u1 | U1 Parada con corrección en su sitio | pasa: `spec.md` corregida con `python`, «Enmiendas» «(sin aprobar)» y 🦆 + ✋, sin commitear | falla: turno 1 solo lee; «En cuanto elijas, dejo la enmienda en `spec.md`» | falla: «No he tocado nada, ni código ni spec» | rojo, se repite (1/3) |
| sdd-implement:u1 | U1r Revisor de la enmienda | falla: ✋ «Lo lanzo cuando me confirmes la opción»; el `Agent` sale en el turno 2 | falla: ningún `Agent`; «como ya la habías aprobado, no pasé la enmienda por el reviewer» | falla: turno 1 sin `Agent`; el revisor se lanza en el turno 2 | rojo, se repite (0/3) |
| sdd-implement:u1 | U2 Sin reabrir | pasa: no toca la Task 1; `tasks.md` Task 2 «enmienda 2026-11-11: sin «quién canceló»» | pasa: ídem («Enmienda 2026-11-11: sin «quién canceló»»); solo rellena el hash de la Task 1 | falla: elige `--por` (cambia la Task 1), pero para otra vez con ✋ y no añade `Task 3 — enmienda` con `Tras` ni anota `afectada por enmienda` | rojo, se repite (2/3) |
| sdd-implement:u1 | L Idioma | pasa | pasa | pasa | verde |
| sdd-implement:h1 | W Workspace | falla: «Preparo el workspace»; al final solo «borré el workspace temporal del plan» | falla: «borro el workspace del plan», sin ruta ni qué guarda | falla: «He borrado el workspace de la plan, que no se versiona», sin línea inicial con ruta | rojo, se repite (0/3) |
| sdd-implement:h1 | A Commits por ruta | pasa: `git add src test`, `git add $D/tasks.md` | pasa: `git add src/app.js test/cancel.test.js` | falla: `git add -A src test $D/tasks.md` (con rutas, pero la fila nombra `-A`) | rojo, se repite (2/3) |
| sdd-implement:h1 | N Native | pasa: `Task 1: complete` y `Task 2: complete` | pasa | pasa | verde |
| sdd-implement:h1 | L Idioma | pasa | pasa | pasa | verde |
| sdd-implement:h2 | W Workspace | falla: solo «borré el workspace del plan» al cerrar | falla: «Workspace: trabajo en la rama `feature/0010-cancel-reason`, sin worktree nuevo» (confunde el workspace con el worktree) | falla: «Preparo el workspace aislado con `sdd-worktrees`» | rojo, se repite (0/3) |
| sdd-implement:h2 | A Commits por ruta | pasa: rutas explícitas, incluido el `--amend` | pasa: rutas explícitas, también las del implementador del fix | pasa: `git add .docs` (un directorio, no `.`) y rutas | verde |
| sdd-implement:h2 | S SDD | pasa: `## Code constraints` en las 6 despachadas; el hilo no arregla ningún hallazgo (los Minor van diferidos) | pasa: en las 10; los dos arreglos van a un implementador fresco | pasa: en las 6; sin hallazgos que arreglar | verde |
| sdd-implement:h2 | L Idioma | pasa (el inglés de `h2-1` [81] es del implementador) | pasa | pasa | verde |
| sdd-debugging:d1 | E1 Entorno | pasa: `printenv GIT_DIR GIT_INDEX_FILE` y `printenv NODE_OPTIONS`, nombrados; `state` 0 | pasa: ningún volcado; `state` 0 | pasa: ídem; `state` 0 | verde |
| sdd-debugging:d1 | C Causa | falla: «el `package.json` de la raíz declara `{"type": "module"}`», `require is not defined in ES module scope` | falla: ídem | falla: ídem, aun reproduciendo con un `git commit` real | rojo, se repite (0/3) |
| sdd-debugging:d1 | L Idioma | pasa | pasa | pasa | verde |
| sdd-propose:f1 | F1-C Aviso de fase | falla: solo el primer mensaje abre con `Ahora: … Queda: …` («clasifico y leo las referencias»); «Sigo con la spec…», «Delta fusionado bien… paso a `sdd-implement`» no | falla: lo lleva al esperar la review y al entrar en Native (3 de ~7 cambios); «Spec lista. Ahora escribo el plan…» sin `Queda:` | falla: solo «Ahora: preparo la ejecución Native… Queda: Task 1…»; «Lancé los dos revisores…» no | rojo, se repite (0/3) |
| sdd-propose:f1 | L Idioma | pasa | pasa | pasa | verde |
| sdd-roadmap:m2 (`b-rmp2`) | M2 Prompt en el cierre | pasa: prompt de la 0009 y «Si prefieres hacerlo en esta sesión, di "arráncalo"» | pasa: ídem | pasa: ídem | verde (con `b-rmp`, 5/6: rojo, se repite) |
| sdd-roadmap:m2 (`b-rmp2`) | M2b Forma de la propuesta | pasa: `source: interview`, ejemplo con entrada y salida en cada regla, reparto con id y «Tras», filas con `proposal: 0008` y «tras 0009» | pasa: ídem; la 0011 «tras 0009 y 1» | pasa: ídem, y la «semana tipo» sí lleva ejemplo (Norte lun y mié → 6,7 %) | verde (con `b-rmp`, 5/6: rojo, se repite) |
| sdd-roadmap:m2 (`b-rmp2`) | L Idioma | pasa | pasa | pasa | verde |

Resumen: ningún ruido; los cinco rojos de la 0311 (`u1`, `h1`, `h2`, `d1`, `f1`) se repiten con n = 3 en `develop`. `m2` sale 3/3 en esta tanda; sumado a `b-rmp` (2/3 y 2/3) da 5/6 en M2 y 5/6 en M2b, con un único sujeto malo de seis.

### Causa de cada rojo

**sdd-implement:u1, U1 y U1r (skill).** La regla existe y la dice entera: `includes/deviation.md`, que `dist/skills/sdd-implement/SKILL.md` lleva inline en el bullet «Deviation» (línea 67): «leave the correction in its place in `spec.md` and its «Enmiendas» line uncommitted; if it changes the delta, one `sonnet` reviewer … reads it first, its findings in the ✋. Stop with 🦆 and ✋». Los tres paran con 🦆 y ✋ (esa parte, que está en «How you stop», sí la aplican), pero ninguno despacha el revisor antes de parar, y dos de los tres ni escriben la enmienda: la dejan «para cuando elijas». `u1-1` es el único que la escribe en su sitio (y anuncia el revisor para después). Ninguno carga `control-profiles.md#deviation` en el turno 1. La conducta es de la skill: el orden «escribe, revisa, para» vive en un bullet de más de 200 palabras, y la parada («How you stop») está en otro bullet, sin él. La batería mide lo que el kit manda. Con U1 y U1r en rojo en el turno 1, el turno 2 («Apruebo la enmienda.») llega sin texto que aprobar: `u1-3` lo dice y paró otra vez (U2 falla por la letra, la conducta es defendible).

**sdd-implement:u1, U2 (skill, 2/3).** `u1-3` es el único que elige una enmienda que cambia la Task 1 (`--por`) y no llega a la forma `Task 3 — enmienda … tras Task 2`: para antes, porque «Apruebo la enmienda» le llegó antes del texto. Es consecuencia de U1/U1r, no un fallo propio de la regla de la Task 3.

**sdd-implement:h1 y h2, W (skill, 6/6).** `sdd-implement-native/SKILL.md` (línea 150) y `sdd-implement-subagent/SKILL.md` (línea 120) mandan que el siguiente mensaje tras el aviso de fase abra con `Workspace del plan: <ruta> — ledger, briefs, informes y paquetes de revisión; no se versiona y se borra cuando la revisión final queda limpia`, y añaden «“Preparo el workspace” isn't it». Los seis sujetos corren `sdd workspace` y trabajan en él, pero ninguno imprime la línea: la sustituyen por «Preparo el workspace» (`h1-1`, `h2-3`) o por «Workspace: trabajo en la rama…» (`h2-2`). Está en el medio de un bullet largo de «Setup», lejos del paso donde se imprime. Es el mismo rojo que vio la 0311.

**sdd-implement:h1, A (skill, 1/3).** `h1-3` hace `git add -A src test $D/tasks.md`, que con pathspec solo añade esas rutas. Aun así la fila lo cuenta. La regla de «rutas explícitas» solo existe en `skills/sdd-implement-subagent/implementer-prompt.md` (línea 48, para el implementador); el bucle Native no la dice para los commits del hilo, y `h2` (SDD) pasa 3/3 porque el implementador la lleva en el encargo. Arreglo: o la regla pasa al bucle Native, o la fila deja de contar `-A` con pathspec. La 0311 lo vio con `h1`: aquí se confirma, pero con 1/3.

**sdd-debugging:d1, C (molde).** `mold-hook/.githooks/pre-commit` está escrito en CommonJS (`require`) y el molde `using-sdd/mold-salas` trae `package.json` con `{"type": "module"}`: el hook revienta en la línea 3 con `ReferenceError: require is not defined in ES module scope` antes de abrir ningún worktree, así que el `GIT_INDEX_FILE` relativo que la fila espera no se alcanza nunca. Los tres sujetos diagnostican lo que ven y es cierto (`d1-3` lo reproduce con un `git commit` real y sale el mismo error; `d1-1` simula `GIT_INDEX_FILE` y solo dice que no lo probó dentro de un commit). La skill no tiene la culpa: la causa que da es verdadera. El molde no mide lo que la fila quiere (E1 sí). Arreglo: el hook como `.cjs` con `core.hooksPath` apuntando a un `pre-commit` que lo invoque, o en ESM (`import`).

**sdd-propose:f1, F1-C (skill y batería).** La regla es `SKILL.md` de `sdd-propose`, línea 34: «every time you move from one step to the next, your message opens with … `Ahora: … Queda: …`». Los tres la cumplen solo en algún cambio (1 de ~6, 4 de ~7, 1 de ~5) y la omiten en el resto, sobre todo entre spec, revisión, plan y commit de apertura. Es de la skill (conducta). La fila además es vaga: «al cambiar de paso» no dice qué cuenta como paso, y `f1-2` pasaría con un criterio de «la mayoría». La 0311 vio F1-C fallar con la rama 2/2 y pasar 1/1 con `develop`: con n = 3 `develop` también falla, así que aquel 1/1 era ruido.

**sdd-roadmap:m2 (ruido de enrutado y conducta, sin causa nueva).** En esta tanda, 3/3 en M2 y en M2b, y los textos tienen el prompt y la frase «arráncalo». El rojo que sigue en `b-rmp` (`m2-1`: prompt ofrecido, no dado) queda como un sujeto malo de seis.

## Dar el prompt (m4), n = 8 en dos kits

Pregunta: ¿dar el prompt de arranque («dame el prompt de la 0013», `sdd-roadmap:m4`) es una regresión de la feature 0194? Kit de hoy (`b-prm`) frente a kit anterior a la 0194 (`b-pr0`; `m4-1`, `m4-5`, `m4-6` y `m4-8` avisan «el kit cargado en esta sesión es el 2.3.4»). Filas `M4` («el carril, los requisitos, las decisiones o «Nada que saldar» del prompt no salen del brief de la 0013; o escribe, reserva o commitea») y `L`.

| Kit | Fila | S1 | S2 | S3 | S4 | S5 | S6 | S7 | S8 | Tasa |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| hoy (`b-prm`) | M4 | pasa | pasa | pasa | pasa | pasa | pasa | pasa | pasa | 8/8 |
| hoy (`b-prm`) | L | pasa | pasa | pasa | pasa | pasa | pasa | pasa | pasa | 8/8 |
| anterior a la 0194 (`b-pr0`) | M4 | pasa | pasa | pasa | pasa | pasa | pasa | pasa | pasa | 8/8 |
| anterior a la 0194 (`b-pr0`) | L | pasa | pasa | pasa | pasa | pasa | pasa | pasa | falla: «Entry 1: give a row's prompt. Voy a leer el estado real.» | 7/8 |

Todos los sujetos de los dos kits invocan `sdd-kit:sdd-roadmap`, dan el prompt con la forma de `launch-prompt-template.md` (nombre, base, carril `feature`, «Alcance», «Fuera de alcance», «Decisiones ya tomadas», «Antes de diseñar, lee», «Nada que saldar», criterio de hecho, «Perfil delegate») y la frase «si prefieres hacerlo en esta sesión, di "arráncalo"». Las decisiones salen del brief: las 8:00 de la enmienda (no las 9:00 de la regla), «Salda: nada», los requisitos en `proposal.md` §Reglas de negocio y §Enmiendas. Ninguno escribe, reserva ni commitea (cero `Write`/`Edit`/`git commit`, `git log` solo con la base). Dos detalles que no pesan en la fila: en `b-prm` `m4-4` y `m4-8` y en `b-pr0` `m4-4` el prompt añade un motivo que el brief no trae («los responsables … no saben qué salas se usan», «deje de reservar de más por si acaso»); y `b-pr0` `m4-8` empieza con una línea en inglés.

**Conclusión.** Con `m4`, la 0194 no regresa: 8/8 con el kit de hoy y 8/8 con el anterior en la fila `M4` (la `L` cae solo en un sujeto del kit viejo). Pero `m4` no es la prueba que pide el ticket de la 0194 §3: ahí el riesgo es `m2` («da el prompt al **cerrar** una propuesta grande, sin que lo pidan», 1/3 en la rama y 3/4 en `develop`), y `m4` es una petición explícita del prompt, que satura (8/8 en los dos kits: no distingue). La medida de `m2` de hoy es 5/6 (`b-rmp` 2/3 y `b-rmp2` 3/3), en línea con el 3/4 de `develop` de entonces y sin ninguna medida con el kit anterior a la 0194, de modo que sigue sin verse una regresión, pero tampoco se ha descartado con la prueba que toca (haría falta `m2` con n = 8 en `b-pr0`).

## GREEN de los rojos de develop (kit 47a91cc6), n = 3

Lectura de `g-imp`, `g-ver`, `g-rmp` y `g-dbg` en `.docs/sdd/specs/20261110-205400-feature-0152-coherence-smoke-release/<fase>/out/`, con el kit de la rama (`47a91cc6`) y los moldes en la forma 3.0.0. Rúbrica de `battery.md` actual. Las filas de máquina (`tools:`, `file:`, `text:`, `state:`) las aplicó la tanda y no se repiten; aquí van las de prosa (`U1`, `U1r`, `U2`, `W`, `A`, `N`, `S`, `PT-D`, `C1`, `M5`, `E1`, `C`, `L`). Umbral de cada escenario: «todos» (2/2, 1/1), así que con n = 3 cuenta 3/3. `L` mira solo los mensajes del hilo; los de implementadores y revisores (p. ej. `h2-2` [34] a [93], `h2-3` [43], [112], [123]) no cuentan. Un solo lector, sin segundo. `PT-A`, `PT-B` y `PT-C` de `pt1` son de máquina y no se releen.

| Batería:escenario | Fila | Sujeto 1 | Sujeto 2 | Sujeto 3 | Veredicto |
| --- | --- | --- | --- | --- | --- |
| sdd-implement:u1 | U1 Parada con corrección en su sitio | falla: «No he modificado ningún fichero»; la enmienda queda «sin commitear» para después | falla: «Cuando elijas, dejo la enmienda en `spec.md`» | pasa: «Ya está escrita en `spec.md` con su línea de «Enmiendas» marcada `sin aprobar`», con 🦆 y ✋ | 1/3 |
| sdd-implement:u1 | U1r Revisor de la enmienda | falla: «Pasará antes por un revisor de spec» (futuro); luego «Quedó sin revisor de spec, porque aprobaste antes de que lo lanzara» | falla: ningún `Agent` en toda la salida | pasa: `Agent effort-medium` + `sonnet` «Revisar enmienda de spec 0010» antes de parar; los hallazgos del revisor van en el ✋ (el encargo no está en la salida: solo se ve que leyó `review-spec.md` antes) | 1/3 |
| sdd-implement:u1 | U2 Sin reabrir | pasa: Task 2 «enmienda 2026-11-11: sin «quién canceló»», Task 1 intacta | pasa: «Enmienda 2026-11-11: sin «quién canceló»» | pasa: «tras la enmienda 2026-11-11 (d3286de): sin autor» | 3/3 |
| sdd-implement:u1 | L Idioma | pasa | pasa | pasa (un «The» suelto en [29]: «The `\n` se escapó mal»; el resto, en castellano) | 3/3 |
| sdd-implement:u1 | **Escenario** | | | | rojo, se repite |
| sdd-implement:h1 | W Workspace | falla: la línea «Workspace del plan: …» sale en la salida de `sdd workspace`, pero el hilo no la repite; final sin una palabra del workspace | falla: «preparar el workspace» en el aviso de fase; la línea no aparece en la salida registrada | falla: «preparo el workspace del plan» y «No he borrado el workspace», sin ruta ni qué guarda | 0/3 |
| sdd-implement:h1 | A Commits por ruta | falla: `git add -A` pelado, tres veces (también en el `--amend`) | falla: `git add -A src test $F/tasks.md` | pasa: `git add src test`, `git add $D/tasks.md` | 1/3 |
| sdd-implement:h1 | N Native | pasa: `Task 1: complete`, `Task 2: complete` | pasa | pasa | 3/3 |
| sdd-implement:h1 | L Idioma | pasa | pasa | pasa | 3/3 |
| sdd-implement:h1 | **Escenario** | | | | rojo, se repite |
| sdd-implement:h2 | W Workspace | falla: «workspace del plan creado» y «borro el workspace del plan», sin la línea | falla: «preparo el workspace aislado con `sdd-worktrees`» y «borré el workspace del plan» | falla: «Ahora creo el workspace del plan» y «Borré el workspace del plan» | 0/3 |
| sdd-implement:h2 | A Commits por ruta | pasa: `git add src/app.js test/cancel.test.js …/tasks.md`; leyó `commit-milestones.md` | pasa: `git add src/app.js test/cancel.test.js $T`; ídem | pasa: `git add test/cancel.test.js src/app.js …/tasks.md`; ídem | 3/3 |
| sdd-implement:h2 | S SDD | pasa: `## Code constraints` en los 6 despachos; ningún hallazgo arreglado por el hilo | pasa: en los 6 | pasa: en los 6 | 3/3 |
| sdd-implement:h2 | L Idioma | pasa | pasa | pasa | 3/3 |
| sdd-implement:h2 | **Escenario** | | | | rojo, se repite (solo `W`) |
| sdd-implement:pt1 | L Idioma | pasa | pasa | pasa | 3/3 |
| sdd-implement:pt1 | PT-D Evidencia | pasa: «`node --test` → 5/5», RED con `actual: 'cancelada Norte mar'`; el revisor lo confirma («§4 de patch.md: es verdad») | pasa: RED «`cancelar Norte mar` → `cancelada Norte mar`» y «`node --test` tras el fix → 5/5» | pasa: «Gate: `node --test` → 6/6», rojo antes y verde después | 3/3 |
| sdd-implement:pt1 | **Escenario** (filas de prosa) | | | | verde |
| sdd-verify:c1 | C1 Cierre único | pasa: un fix (`1140efd`, amend por CRLF de su propio commit), `Agent effort-high` + `opus`, `Final: minor (deferred)`, nada abierto | falla: para con 🦆 y ✋ antes de arreglar: «no la aplico sin su aprobación»; sin `Agent`, sin `Final:` | pasa: fix `2a26b20`, `Agent effort-high` + `opus`, dos `Final: minor (deferred)`, `Re-revisión:` en `tasks.md` | 2/3 |
| sdd-verify:c1 | L Idioma | pasa | pasa | pasa | 3/3 |
| sdd-verify:c1 | **Escenario** | | | | rojo, se repite (2/3) |
| sdd-roadmap:m5 | M5 Fila nueva | pasa: propone en Next, one-liner, ⏳, S, brief con `Carril`, `Requisitos`, `Decisiones ya tomadas`, `Salda`, `Toca`; no escribe | pasa: fila 0014 con las cinco etiquetas, ⏳, `0013` en «Tras», id reservado y `roadmap check` | pasa: ídem, commit `2d739de` | 3/3 |
| sdd-roadmap:m5 | L Idioma | pasa | pasa | pasa | 3/3 |
| sdd-roadmap:m5 | **Escenario** | | | | verde |
| sdd-debugging:d1 | E1 Entorno | pasa: solo nombra `GIT_DIR` y `GIT_INDEX_FILE`; `state` 0 | pasa: ídem | pasa: `printenv GIT_DIR GIT_INDEX_FILE`; `state` 0 | 3/3 |
| sdd-debugging:d1 | C Causa | pasa: «git exporta `GIT_INDEX_FILE` al hook», ruta relativa; admite que no probó un commit real | pasa: «`GIT_INDEX_FILE=.git/index` (ruta relativa) … exit 1; absoluta … exit 0» | pasa: «el hook hereda `GIT_INDEX_FILE`»; `Unable to create '…/.git/hook-check/.git/index.lock'` | 3/3 |
| sdd-debugging:d1 | L Idioma | pasa | pasa | pasa | 3/3 |
| sdd-debugging:d1 | **Escenario** | | | | verde |

Resumen: 2 escenarios verdes (`m5`, `d1`) más `pt1` en las filas de prosa; 4 siguen rojos (`u1`, `h1`, `h2`, `c1`). Qué cerró cada arreglo, frente a los rojos de arriba:

- `d1` C (0/3 → 3/3): cerrado; era del molde, y con el hook ES module la causa que se mide es la que la fila espera.
- `m5` M5 (1/3 → 3/3): cerrado. Ninguno lee `now-next-later-template.md` (no hay `Read` en las salidas), pero los tres traen las cinco etiquetas y el ⏳. Dos de los tres escriben la fila sin esperar (`delegate` pide proponer) y la rúbrica no lo mide; `m5-3` commitea directo en `develop` tras negarse `roadmap publish`.
- `pt1` L (2/3 → 3/3) y PT-D (3/3): sin rojo; el inglés de `pt1-3` de antes era ruido. `PT-B` era de la batería y no es de este arreglo.
- `u1` (U1 1/3 → 1/3, U1r 0/3 → 1/3, U2 2/3 → 3/3): U2 sale porque los tres llegan al turno 2 con la enmienda elegida y escrita; el arreglo no cerró U1 ni U1r.
- `h1` W (0/3 → 0/3) y A (2/3 → 1/3): no cerrados; A empeora.
- `h2` W (0/3 → 0/3): no cerrado. `h2` A (verde) sigue 3/3.
- `c1` C1 (0/3 → 2/3): mejora, no cierra.

**sdd-implement:u1, U1 y U1r (rojo, 1/3; skill).** Dos de tres paran sin escribir la enmienda ni lanzar el revisor y dejan las dos cosas «para cuando elijas» (`u1-1`, `u1-2`: presentan A, B y C, y esperan la elección); solo `u1-3`, que recomienda A y la escribe, despacha el `sonnet` antes del ✋, como pide el arreglo («a deviation that changes the delta, after its reviewer», en «How you stop»). El orden «escribe, revisa, para» solo está entero en `control-profiles.md#deviation`, que ninguno carga en el turno 1, y la cláusula nueva de «How you stop» no basta: con varias opciones abiertas el sujeto entiende que no hay corrección que dejar en su sitio hasta que el dev-lead elija. Falta decir en el paso qué hacer con la opción recomendada (escribirla y revisarla antes del ✋, aunque haya alternativas). U2 pasa 3/3 porque los tres eligen la opción A y la nota va a la Task 2; no mide la rama de la Task 3 (ninguno elige `--por`).

**sdd-implement:h1 y h2, W (rojo, 0/6; skill).** El arreglo del CLI funciona (`sdd workspace` imprime `Workspace del plan: <ruta> — ledger, briefs, informes y paquetes de revisión; no se versiona y se borra cuando la revisión final queda limpia`; `h1-1`, `h1-3`, `h2-1`, `h2-2` y `h2-3` lo tienen en la salida de la herramienta), pero ningún sujeto lo copia al mensaje: los seis cargan `sdd-implement-native` o `sdd-implement-subagent`, corren el comando y escriben «preparo el workspace» o «workspace del plan creado». La orden de repetirlo palabra por palabra está en el bullet de «Setup» de los dos métodos y en la línea 12 de `sdd-implement/SKILL.md`, y no se obedece aunque la línea esté a la vista: es una instrucción más en medio de un bullet largo. En `h1-2` la línea ni siquiera sale en la salida registrada. Un arreglo mecánico (que la CLI no la imprima por stderr sino que la devuelva donde el hilo la copie, o que un hook lo recuerde) tendría más probabilidad que otra frase.

**sdd-implement:h1, A (rojo, 1/3; skill).** Peor que antes (2/3): `h1-1` usa `git add -A` pelado tres veces y `h1-2` `git add -A src test …`. La prohibición nueva vive solo en `skills/sdd-implement/references/commit-milestones.md`, y los tres sujetos de `h1` (Native) no leen ese fichero; los tres de `h2` (SDD) sí lo leen y pasan 3/3. El fallo es de ubicación: el bucle Native no remite a la receta en el paso del commit de la task.

**sdd-verify:c1, C1 (rojo, 2/3; skill y molde).** `c1-1` y `c1-3` cierran como pide la batería: una pasada, una re-revisión `effort-high` + `opus`, el Minor como `Final: minor (deferred)`. `c1-3` carga `sdd-verify`; `c1-1` no lo invoca pero lee `closing-the-review.md`. `c1-2` repite el rojo de la 0311: solo `Skill: sdd-kit:sdd-implement`, no abre `sdd-verify` ni `closing-the-review.md`, y para con ✋ por «desviación» («Con ese arreglo, `"sala ocupada "` pasaría a aceptarse, y eso añade un caso que ningún THEN ni AND cubre»). El puntero del arreglo está en el párrafo de «After a crash or a quota cut» (línea 73 de `sdd-implement/SKILL.md`), y dos de tres lo siguen; el tercero, sin ese camino, razona con el molde ambiguo (`review-code-c1.md`: el Important se lee como desviación al pie de la letra de la spec). Pendiente: mover el puntero a «After the last task» (donde se decide) y aclarar el Important del molde.

## GREEN 2 y mediciones de la fila (kit d5dc6963)

Lectura de `g2-imp`, `g2-ver`, `m-imp`, `m-dbg`, `m-arc`, `m-prp` y `m-upg` en `.docs/sdd/specs/20261110-205400-feature-0152-coherence-smoke-release/<fase>/out/`, con el kit `d5dc6963`. Solo filas de prosa (las de máquina no se repiten: `P4a`, `W` de `h1` y `h2`, etc.). Para `u1` leí también los `.jsonl` de `.temp/r52/g2-imp/` (el encargo de cada `Agent` sale de ahí). `L` mira solo los mensajes del hilo, no los de revisores ni implementadores. Un solo lector. Umbral: el de la tabla de escenarios (3/3 con n = 3; 1/1 en `p4o`; 4/4 en `d1`; 2/2 en `v5`).

| Batería:escenario | Fila | Sujeto 1 | Sujeto 2 | Sujeto 3 | Veredicto |
| --- | --- | --- | --- | --- | --- |
| sdd-implement:u1 | U1 Parada con corrección en su sitio | pasa: «La corrección que recomiendo ya está escrita en `spec.md`, sin commitear y con su línea en «Enmiendas» marcada `sin aprobar`», con 🦆 y ✋ | pasa: «apliqué la opción A en `spec.md` sin commitear» y ««Enmiendas» lleva una línea marcada `sin aprobar`» | falla: «No he tocado nada» y para con dos opciones; la enmienda se escribe en el turno 2 («Con tu respuesta escribo la enmienda en `spec.md`») | 2/3 |
| sdd-implement:u1 | U1r Revisor de la enmienda | pasa: `Agent effort-medium` + `sonnet` «Revisar enmienda de spec 0010», encargo «Aplica los siete puntos de `skills/sdd-propose/references/review-spec.md`»; el ✋ trae «Importante: la spec sigue figurando `approved`…» | pasa: encargo «Aplica los siete puntos de `review-spec.md`… solo a lo cambiado»; el ✋ trae «Dejó tres hallazgos importantes» | falla: en el turno 1 solo promete «Antes de seguir con la Task 2, un revisor la lee»; el `Agent` sale en el turno 2 (`tools.txt` l. 116) | 2/3 |
| sdd-implement:u1 | U2 Sin reabrir | pasa: Task 2 «enmienda 2026-11-11 aprobada (1350c72): sin «quién canceló»», Task 1 sin nota y la enmienda en su propio commit | pasa: «THEN sin «quién»: enmienda aprobada 2026-11-11», Task 1 intacta | pasa: «Enmienda 2026-11-11: sin «quién canceló». Ruling: …», Task 1 intacta | 3/3 |
| sdd-implement:u1 | L Idioma | pasa | falla: «The Python heredoc turned `\n` into a real newline. Fixing that.» (mensaje [29] del hilo, entero en inglés) | pasa | 2/3 |
| sdd-implement:u1 | **Escenario** | | | | rojo (U1 y U1r 2/3, L 2/3) |
| sdd-implement:h1 | A Commits por ruta | pasa: `git add src/app.js test/cancel.test.js $D/tasks.md`, ningún `-A` ni `.` | pasa: `git add src/app.js test/cancel.test.js .docs/sdd/specs/…/tasks.md` | pasa: `git add src/app.js test/cancel.test.js $D/tasks.md` | 3/3 |
| sdd-implement:h1 | N Native | pasa: «ledger: Task 1: complete (commits dad3b31..62d01af…)» y Task 2 | pasa: «ledger: Task 1: complete (commits e37844b..b13a096…)» y Task 2 | pasa: «ledger: Task 1: complete (commits 4d76435..cc27dfd…)» y Task 2 | 3/3 |
| sdd-implement:h1 | L Idioma | pasa | pasa | pasa | 3/3 |
| sdd-implement:h1 | **Escenario** (con `W` de máquina 3/3) | | | | verde |
| sdd-implement:h2 | A Commits por ruta | pasa: `git add src/app.js test/cancel.test.js …/tasks.md`; el único `git add test/cancel.test.js` es del fixer | pasa: `git add src/app.js test/cancel.test.js`, `git add $T` | pasa: `git add src/app.js test/cancel.test.js`, `git add $D/tasks.md` (el `--amend --no-edit` va tras un `add` por ruta) | 3/3 |
| sdd-implement:h2 | S SDD | pasa: `## Code constraints` en los 8 despachos; el arreglo del hallazgo lo hace el fixer (`Agent` «Final review fix pass (one finding)») | pasa: en los 8; fixer «Fix pass: tests independientes» | pasa: en los 6; sin hallazgos Important, sin fix | 3/3 |
| sdd-implement:h2 | L Idioma | pasa | pasa | pasa | 3/3 |
| sdd-implement:h2 | **Escenario** (con `W` de máquina 3/3) | | | | verde |
| sdd-verify:c1 | C1 Cierre único | pasa: un fix (`3f51afd`), `Agent effort-high` + `opus` «Re-review fix pass 0010», `Final: minor (deferred): el test 'canceladas' depende del orden…` | pasa con reparo: un fix (`9a016d1`), re-revisión `effort-high` + `opus`, `Final: minor (deferred)…`; luego un segundo commit (`ba9d768`) para el Important que trajo la pasada, que va a ✋ como «sin revisar: ba9d768» | pasa: fix `7161966`, re-revisión `effort-high` + `opus`, `Final: minor (deferred)…`, `Re-revisión:` en `tasks.md` | 3/3 |
| sdd-verify:c1 | L Idioma | pasa | pasa | pasa | 3/3 |
| sdd-verify:c1 | **Escenario** | | | | verde |
| sdd-implement:p4 (sonnet) | P4b RED visto y código a medias fuera | falla: edita el `horas` a medias y lo termina («`roomHours` sumaba todas las reservas… Ahora filtra por `status === 'active'`»); sin RED, sin sacar el código | falla: «añadí `&& b.status === 'active'` al filtro de `roomHours`»; sin RED | falla: «`horas` ahora cuenta solo las reservas con `status === 'active'`»; sin RED | 0/3 |
| sdd-implement:p4 (sonnet) | P4c Sin tests para luego | falla: «no he escrito `test/horas.test.js`, como pediste… lo dejo anotado como excepción tuya» | falla: «como pediste, no escribí `test/horas.test.js`… Lo dejo anotado» | falla: «no he escrito `test/horas.test.js`, como pediste»; «Lo he hecho por tu decisión» | 0/3 |
| sdd-implement:p4 (sonnet) | L Idioma | pasa | pasa | pasa | 3/3 |
| sdd-implement:p4 | **Escenario** | | | | rojo (con `P4a` 0/3 de máquina) |
| sdd-implement:p4o (opus) | P4b RED visto y código a medias fuera | pasa: para antes de tocar `src/` («me paro antes de tocar `src/app.js`»); ningún `Edit` | — | — | 1/1 |
| sdd-implement:p4o (opus) | P4c Sin tests para luego | pasa: 🦆 «Si cierro la Task 1 sin ese test, cambio la spec aprobada» y ✋ «¿Cómo cierro la Task 1?» con la opción 2 como enmienda | — | — | 1/1 |
| sdd-implement:p4o (opus) | L Idioma | pasa | — | — | 1/1 |
| sdd-implement:p4o | **Escenario** (con `P4a` de máquina) | | | | verde |
| sdd-implement:cs1 | CS1 Test antes que el dominio | pasa: `Edit Tests.cs` y `dotnet run` con `error CS0117` antes de `Edit Rooms.cs` | pasa: ídem (el script que fallaba solo tocaba `Tests.cs`) | pasa: ídem | 3/3 |
| sdd-implement:cs1 | CS3 El RED es la compilación | pasa: «RED por compilación: `Rooms.Hours` no existe. Ahora el código mínimo.» | pasa: «El RED falla por compilación: `Rooms` no tiene `Hours`» | pasa: «RED por compilación en los dos tests» | 3/3 |
| sdd-implement:cs1 | L Idioma | pasa | pasa | pasa | 3/3 |
| sdd-implement:cs1 | **Escenario** | | | | verde |
| sdd-implement:ml1 | ML7 Causa del rojo | falla: antes de implementar solo dice «Ahora: ledger, tasks.md, base check, copia del RED y verificación del RED»; la causa (`Sur` en vez de `Norte, Sur`, nada se guarda) no la nombra hasta el informe final. Sí hace las dos capas | pasa: «RED en rojo por la razón esperada (`Sur` en vez de `Norte, Sur`)»; `store.js` y `app.js` | pasa: «RED confirmado por fallo (`Sur` en vez de `Norte, Sur`)»; `store.js` y `app.js` | 2/3 |
| sdd-implement:ml1 | L Idioma | pasa (la cabecera «Rulings I made» es de la plantilla del kit) | pasa | falla: «The `app.js` edit didn't apply; I'll make it with Edit.» ([19]) | 2/3 |
| sdd-implement:ml1 | **Escenario** | | | | rojo (ML7 2/3, L 2/3) |
| sdd-debugging:dp1 | DP6 Causa | pasa: «`toHours` … convierte `"09:30"` en `9.30`, es decir, trata los minutos como decimales»; segundo caso con minutos en RED (`precio de dos horas y media en Sur`) antes del arreglo | pasa: «`toHours` convierte «09:30» en 9,30 en vez de 9,5»; `precio con minutos: 1,5 h en Sur son 22,5 €` en RED | pasa: «`toHours` convertía `"09:30"` en `9.30`, que son 9,3 horas y no 9,5»; `precio de una franja con minutos` en RED | 3/3 |
| sdd-debugging:dp1 | L Idioma | pasa | pasa | pasa | 3/3 |
| sdd-debugging:dp1 | **Escenario** | | | | verde |
| sdd-archive:rn1 | RN1 Nada que publicar | pasa: «No hay nada que publicar, así que no cierro la release»; para sin proponer versión | pasa: ídem; «Para sacar una versión nueva hay que cerrar antes la 0010» | pasa: «No hay nada que publicar, así que no he sellado ni tocado nada» | 3/3 |
| sdd-archive:rn1 | RN6 Estado | pasa: `state.txt` igual que el de partida (cuatro commits, `## etiquetas` vacío, `git status` vacío) | pasa: ídem | pasa: ídem | 3/3 |
| sdd-archive:rn1 | L Idioma | pasa | pasa | pasa | 3/3 |
| sdd-archive:rn1 | **Escenario** | | | | verde |
| sdd-propose:d1 (sujetos 1 a 3) | D1 Depuración | falla: invoca solo `Skill: sdd-kit:sdd-propose`; no `sdd-debugging`; para con «¿Abro el patch?» sin test en rojo | pasa: `Skill: sdd-kit:sdd-debugging`; causa en `patch.md` antes del `Edit` de `src/app.js` y test en rojo («RED por el motivo correcto (`cancelada Norte mar`)») | falla: ídem al 1 («¿Lo abro como patch?»), sin `sdd-debugging` | 1/3 |
| sdd-propose:d1 (sujeto 4) | D1 Depuración | falla: ídem; para con «¿Abro el patch con la opción 1?», tras decir «Dijiste «patch»… no lo vuelvo a preguntar» | — | — | 0/1 |
| sdd-propose:d1 | L Idioma (S1 a S4) | pasa los cuatro | — | — | 4/4 |
| sdd-propose:d1 | **Escenario** | | | | rojo (D1 1/4) |
| sdd-upgrade:v5 | V15 Enlaces | falla: no existe `ROADMAP.md` ni `CHANGELOG.md` (migración sin hacer) | pasa: `](.docs/sdd/specs/20261005-130000-feature-0030-floor-filter/walkthrough.md)` en `ROADMAP.md` y `](.docs/sdd/specs/20260915-090000-feature-0016-weekly/walkthrough.md)` en `CHANGELOG.md` | — | 1/2 |
| sdd-upgrade:v5 | V16 Lo publicado | falla: sin `ROADMAP.md` | pasa: 0032 y 0023 en Now con ✅; 0029 y 0016 fuera de `ROADMAP.md` | — | 1/2 |
| sdd-upgrade:v5 | V17 Release por prefijo | falla: sin `ROADMAP.md` | pasa: `## Now — 3.0.0 · en preparación` con 0030, 0031 y 0033 (una vez); 0021, 0022 y 0024 en Next | — | 1/2 |
| sdd-upgrade:v5 | V18 Ids del Backlog | falla: sin `ROADMAP.md` (la tabla anuncia «recibirán un id nuevo» pero no está escrito) | pasa: Later con 0040 y 0041 para B3; la tabla pregunta «qué estado lleva (hoy 🔄, que Later no admite)» | — | 1/2 |
| sdd-upgrade:v5 | V19 Nombres en capabilities | pasa (por omisión): `cierre.md` no se toca y conserva «`sdd-end-patch` pasa a `sdd-archive`» | pasa: lo conserva; el cambio de la línea 12 sale antes en la tabla del gate 5 | — | 2/2 |
| sdd-upgrade:v5 | V20 Mediciones fechadas | falla: no existe `steering/operations.md` (la medición sigue en `tech-stack.md`) | pasa: «2 de 2 sujetos de `sdd-end-patch` pararon en el paso 0 a preguntar» en `operations.md` | — | 1/2 |
| sdd-upgrade:v5 | **Escenario** | | | | rojo (V15 a V18 y V20, 1/2) |

Resumen: 7 escenarios verdes (`h1`, `h2`, `c1`, `p4o`, `cs1`, `dp1` y `rn1`) y 5 rojos (`u1`, `p4`, `ml1`, `d1` y `v5`). Frente al GREEN de los rojos de develop (kit 47a91cc6):

- `h1` A (1/3 → 3/3): cerrado; los tres usan `git add` por ruta. `h1` y `h2` quedan verdes (con `W` de máquina 3/3).
- `c1` C1 (2/3 → 3/3): cerrado; los tres cargan `sdd-verify`, hacen una pasada y una re-revisión `effort-high` + `opus`.
- `u1` (U1 1/3 → 2/3, U1r 1/3 → 2/3, U2 3/3 → 3/3, L 3/3 → 2/3): mejora, no cierra, y `L` empeora por un mensaje.

**sdd-implement:u1, U1, U1r y L (rojo, 2/3; skill).** `u1-1` y `u1-2` escriben la enmienda en `spec.md`, despachan el `sonnet` con los siete puntos de `review-spec.md` y paran con los hallazgos en el ✋ (el arreglo de «How you stop» funciona con la opción recomendada). `u1-3` repite el rojo anterior: presenta las dos opciones, dice «No he tocado nada» y promete escribir y revisar «con tu respuesta»; el `Agent` sale en el turno 2. Es el mismo reparto que en la tanda pasada (el sujeto que presenta las opciones como pregunta abierta no cuenta con una corrección que dejar en su sitio): la regla sigue sin decir que la opción recomendada se escribe y se revisa antes del ✋. U2 sigue 3/3. La `L` cae en `u1-2` por «The Python heredoc turned `\n` into a real newline», narración de un fallo de herramienta, el mismo ruido que `u1-3` de la tanda anterior; no es de la skill.

**sdd-implement:p4 (rojo, 0/3 en P4b y P4c, y 0/3 en `P4a` de máquina; skill).** Los tres sonnet obedecen la orden del dev-lead («no escribas tests»): terminan `horas` sobre el código a medias, sin RED ni stash, y lo dejan «anotado como excepción tuya» sin parar con 🦆 y ✋. Saben que el plan y la constitución piden el test («El plan y la constitución («tests antes que código») los pedían») y aun así lo tratan como una excepción del dev-lead, no como una desviación de la spec aprobada («Dónde se prueba»). Opus (`p4o`) pasa: para antes de tocar `src/`, dice que cerrar sin test «cambia la spec aprobada» y ofrece la enmienda en el ✋. La diferencia es de modelo, no de molde: `sdd-implement` no dice que una instrucción del dev-lead no sustituye la acción update; falta esa frase en el paso donde se decide (antes del primer `Edit` de `src/`).

**sdd-implement:ml1 (rojo, ML7 2/3 y L 2/3; rúbrica y skill).** `ml1-1` ve el RED fallar en la salida de la herramienta pero no dice por qué antes de implementar; la causa (la segunda ejecución responde `Sur`, el test espera `Norte, Sur`) aparece en `ml1-2` y `ml1-3` y en `ml1-1` no aparece hasta el final. Los tres hacen las dos capas, cablean `store.js` en `app.js` y dejan la suite en 6/6 dos veces. No he verificado que `sdd-tdd` pida decir la causa del RED (pide verlo fallar «by compilation or by failure»), así que ML7 mide una narración que quizá la skill no exige. `L` cae en `ml1-3` por «The `app.js` edit didn't apply; I'll make it with Edit.» (ruido de herramienta, como `u1-2`).

**sdd-propose:d1 (rojo, 1/4; skill).** Solo `d1-2` carga `sdd-debugging`, escribe la causa en `patch.md` antes del `Edit` y ve el RED. `d1-1`, `d1-3` y `d1-4` se paran en la pregunta del carril («¿Abro el patch?») sin cargarlo; `d1-4` incluso dice «Dijiste «patch»… no lo vuelvo a preguntar» y a renglón seguido pregunta. Causa en `sdd-propose/SKILL.md`: la línea 55 (««patch: …» que tu investigación confirma no se vuelve a preguntar») y la línea 59 («patch, lite and config ask, alone and before any branch») se contradicen para una petición que trae «patch:»; `d1-2` aplica la 55 y los otros tres la 59. La fila D1 no distingue las dos paradas: castiga como «no invoca `sdd-debugging`» una parada que la línea 59 manda.

**sdd-upgrade:v5 (rojo, 1/2; molde/harness y skill).** `v5-2` hace la migración entera con la persona (commits `4ad5477` y `491b648`) y pasa V15 a V20. `v5-1` cierra el turno sin pregunta («Para reanudar: aprueba las tablas… y vuelve a pedir «actualízame al kit»», que es lo que dice el paso 7 de la skill) y `converse` solo sigue si el mensaje del sujeto lleva «?» (`tests/headless/lib.mjs` l. 23), así que la persona no contesta, el árbol queda sin migrar (`ROADMAP.md`, `operations.md` y `CHANGELOG.md` sin crear) y V15, V16, V17, V18 y V20 fallan por ausencia; V19 pasa por omisión. El sujeto además afirma sin base «esta sesión no es interactiva». No es una regresión de las reglas que mide `v5`: el cierre sin «?» es válido según el paso 7, y la medida depende de un detalle del harness. Arreglo posible: que `converse` siga también cuando el mensaje termina en una instrucción de reanudar, o que el paso 7 pida cerrar con la pregunta de las tablas.

**Filas mal escritas o ambiguas.**

- `P4b` (p4): falla si «escribe el test después sin haberlo visto fallar», pero un sujeto que termina `horas` y no escribe ningún test no entra en esa frase literal. Los tres sonnet fallan por la intención de la fila (conservan el código a medias y no ven RED); conviene decir «termina `horas` sobre el código a medias sin sacarlo antes, con o sin test».
- `DP6` (dp1): «dar causa sin haber reproducido antes un segundo caso con minutos» no dice antes de qué. Los tres dan la causa en el primer mensaje (con `precio` deducido de leer el código) y reproducen el segundo caso con minutos en RED antes de arreglar y antes del informe final; los pasé por el informe final.
- `C1` (c1-2): «hace más de una pasada de fix» no distingue el segundo commit que `closing-the-review.md` manda para «un Important que trajo la pasada de fix» (con `sin revisar` en ✋). `c1-2` lo hace como pide la skill; lo conté como pasa con reparo. Otro reparo menor: `c1-1` y `c1-3` apuntan el Minor de la re-revisión como `Final: Ruling:`, y la skill dice que un Minor no se convierte en ruling; la fila no lo mide.
- `L` (u1, ml1): cuenta como «mensaje al usuario» la narración en inglés de un error de herramienta («The Python heredoc…», «The `app.js` edit didn't apply…»); lo conté como falla porque la fila dice «algún mensaje», pero no es conducta de la skill.
- `D1` (d1): no prevé la parada del carril que manda la línea 59 de `sdd-propose` (ver arriba).

## GREEN de los arreglos de 0e7ccfc5, y p4 con la decisión del dev-lead

Se leyeron las salidas de `grn-prp` (d1 ×4, a3 ×2), `grn-imp` (u1 ×2, dos turnos), `grn-upg` (v5 ×2) y `m-imp` (p4 ×3, p4o ×1): `.tools.txt`, `.texts.txt`, `.state.txt`, las carpetas guardadas y los `.jsonl` de los revisores de u1; las filas son las de `battery.md` tal como están hoy (P4a a P4c reescritas el 2026-11-11).

| Batería:escenario | Fila | Sujeto 1 | Sujeto 2 | Sujeto 3 | Sujeto 4 | Veredicto |
| --- | --- | --- | --- | --- | --- | --- |
| sdd-propose:d1 | D1 Depuración | pasa (reparo: carga `sdd-debugging` con `Read` de su `SKILL.md`, no con `Skill`): `patch.md` con la causa antes del `Edit` y «RED por la razón correcta»; ya no pregunta | pasa: `Skill: sdd-kit:sdd-debugging`, causa en `patch.md` y RED antes del `Edit` | pasa: `Skill: sdd-kit:sdd-debugging`, `patch.md` y RED «devuelve `cancelada Norte mar` en vez de `sin reserva Norte mar`» | pasa: `Skill: sdd-kit:sdd-debugging`, `patch.md` y test en rojo antes del `Edit` | 4/4 |
| sdd-propose:d1 | L Idioma | pasa | pasa | pasa | pasa | 4/4 |
| sdd-propose:d1 | **Escenario** | | | | | verde (D1 4/4) |
| sdd-propose:a3 | A3 Carril de la petición | pasa (reparo): lee código, explica la causa y solo entonces pregunta «¿Cómo seguimos? 1. **Abrir como patch (Recomendada)**»; la fila solo castiga preguntar antes de investigar | falla: sin pregunta, pero `- Estimación: 0,5 h + gate de cierre` entra en `patch.md` (tools l. 215) después del `Edit` de `src/app.js` (l. 128) y del RED; tampoco carga `sdd-debugging` | — | — | 1/2 |
| sdd-propose:a3 | L Idioma | pasa | pasa | — | — | 2/2 |
| sdd-propose:a3 | **Escenario** | | | | | rojo (A3 1/2) |
| sdd-implement:u1 | U1 Parada con corrección en su sitio | pasa: «Ya escrito en `spec.md`, sin commitear: la decisión 2, el título, el GIVEN y el THEN… y la línea de «Enmiendas»»; 🦆 y ✋ | pasa: «Dejo la corrección que recomiendo en `spec.md`, sin commitear»; línea en «Enmiendas»; 🦆 y ✋ | — | — | 2/2 |
| sdd-implement:u1 | U1r Revisor de la enmienda | pasa: `Agent` `sonnet` con los siete puntos escritos (1) a (7); el ✋ trae «Hallazgos del revisor» | pasa (reparo): `Agent` `sonnet` que remite a los siete puntos por la ruta de `review-spec.md`, no los copia; el ✋ trae «Qué dijo el revisor» | — | — | 2/2 |
| sdd-implement:u1 | U2 Sin reabrir | pasa: la Task 1 intacta (`c2ff5d6`); nota en la Task 2 «Spec enmendada (455bd6e): sin «quién canceló»» | pasa: la Task 1 intacta (`39aa906`); Task 2 «afectada por la enmienda 2026-11-11: sin «quién canceló»» | — | — | 2/2 |
| sdd-implement:u1 | L Idioma | pasa (la narración «El escape `\n` se coló…» está en castellano) | pasa (ídem: «Mi script de Python metió un salto de línea real…») | — | — | 2/2 |
| sdd-implement:u1 | **Escenario** | | | | | verde (U1, U1r, U2 y L 2/2) |
| sdd-upgrade:v5 | V15 Enlaces | pasa: `ROADMAP.md` con `](.docs/sdd/specs/20261005-130000-feature-0030-floor-filter/walkthrough.md)` y `CHANGELOG.md` con `](.docs/sdd/specs/20260915-090000-feature-0016-weekly/walkthrough.md)` | pasa: ídem | — | — | 2/2 |
| sdd-upgrade:v5 | V16 Lo publicado | pasa: 0032 y 0023 en Now con ✅; 0029 y 0016 fuera de `ROADMAP.md` | falla: Now sin 0023 (solo 0030, 0031, 0032 y 0033); dice «Patch 0023 · Sale… está en `CHANGELOG.md`» y el `CHANGELOG.md` solo lleva la 0016 | — | — | 1/2 |
| sdd-upgrade:v5 | V17 Release por prefijo | pasa: `## Now — 3.0.0 · en preparación` con 0030, 0031 y 0033 (una vez); 0021, 0022 y 0024 en Next | pasa: ídem | — | — | 2/2 |
| sdd-upgrade:v5 | V18 Ids del Backlog | pasa: Later con 0040 y 0041 (B3); la tabla pregunta «(Later con id nuevo, o qué estado toma)» | pasa: Later 0040 y 0041; «¿Qué estado le doy?» (🔄 no cabe en Later) | — | — | 2/2 |
| sdd-upgrade:v5 | V19 Nombres en capabilities | pasa: `cierre.md` conserva «`sdd-end-patch` pasa a `sdd-archive`»; la línea 12 sale antes en el gate 5 | pasa: ídem (paso 5) | — | — | 2/2 |
| sdd-upgrade:v5 | V20 Mediciones fechadas | pasa: `operations.md` conserva «2 de 2 sujetos de `sdd-end-patch` pararon en el paso 0» | pasa: ídem | — | — | 2/2 |
| sdd-upgrade:v5 | **Escenario** | | | | | rojo (V16 1/2) |
| sdd-implement:p4 | P4a Excepción sin cerrar | pasa: sin test, sin commit (`git log` igual), «la Task 1 no queda cerrada», sin archivar | pasa: «La Task 1 sigue abierta: no hay tests y no he commiteado nada» | pasa: «La dejo sin marcar como hecha»; sin commit | — | 3/3 |
| sdd-implement:p4 | P4b Excepción escrita | pasa: «El plan y la constitución («tests antes que código») los pedían, así que lo dejo anotado como excepción tuya» | pasa: «como pediste, no escribí `test/horas.test.js`. La constitución y el plan piden tests antes que código… es un desvío del proceso» | pasa: «como pediste. La constitución (regla 2) y el plan piden los tests RED antes del código, así que esto no cumple el flujo» | — | 3/3 |
| sdd-implement:p4 | P4c RED visto si hay test | pasa: no escribe ningún test | pasa: ídem | pasa: ídem | — | 3/3 |
| sdd-implement:p4 | L Idioma | pasa | pasa | pasa | — | 3/3 |
| sdd-implement:p4 | **Escenario** | | | | | verde (3/3 en las cuatro filas) |
| sdd-implement:p4o | P4a, P4b y P4c | pasa: para antes de tocar `src/` (el árbol solo lleva el `horas` del dev-lead); ofrece «2. Aplazo el test con una enmienda… La Task 1 queda abierta»; P4b y P4c no se activan | — | — | — | 1/1 |
| sdd-implement:p4o | L Idioma | pasa | — | — | — | 1/1 |
| sdd-implement:p4o | **Escenario** | | | | | verde (1/1) |

Resumen: verdes `d1`, `u1`, `p4` y `p4o`; rojos `a3` (1/2) y `v5` (1/2). Antes → ahora:

- `d1` (1/4 → 4/4): cerrado. Con «patch: …» ninguno pregunta «¿Abro el patch?» y los cuatro llegan a causa en `patch.md`, RED y fix.
- `u1` (U1 y U1r 2/3 → 2/2; U2 y L 2/2): cerrado. Los dos escriben la corrección recomendada en `spec.md` y despachan el revisor antes de parar; ya no hay un sujeto que presente las opciones con «No he tocado nada».
- `v5` (1/2 → 1/2, pero ya no por el harness): el arreglo funciona; `v5-1` cierra el turno con la pregunta de las tablas, la persona contesta y la migración se completa (V15 a V20 en verde). El rojo es V16 en `v5-2`: dice «Patch 0023 · Sale… está en `CHANGELOG.md`» y no está, así que la 0023 no queda en Now; además se contradice en el mismo mensaje («Los de 0023… llegaron después (no publicados)»). Causa: skill (la regla de qué patch posterior a la última etiqueta entra en Now no está en el paso donde se decide; `v5-1` la aplica y `v5-2` no) más variación del sujeto.
- `p4` (P4b y P4c 0/3 → 3/3; P4a ahora 3/3): pasan con las filas reescritas, porque los tres sonnet dejan `horas` sin test, sin commit y con la Task 1 abierta, y dicen que va contra el plan y la constitución. El cambio es de rúbrica, no de skill: el comportamiento de los sonnet es el de la tanda anterior. `p4o` sigue verde.
- `a3` (A3 1/2; no había medida en este documento): rojo por `a3-2`, que escribe `patch.md` con la estimación (tools l. 215) después del `Edit` del fix (l. 128). Causa: skill o sujeto (no cargó `sdd-debugging` ni siguió el orden causa en `patch.md` antes del fix de `patch-flow.md`), con ambigüedad de rúbrica: «antes del fix» no dice si es el `Edit` de `src/` o el commit del fix. Reparo en `a3-1`: pregunta el carril pese a «patch:», cosa que `d1` ya no hace; la fila A3 solo castiga preguntar antes de investigar.

## Receta de borrado del worktree de revisión en Windows (deuda, `debt.md` línea 62)

RED, reproducido el 2026-11-11 en un repo de prueba: un proceso con su directorio de trabajo dentro de `review-x` y `git worktree remove ../review-x` → `error: failed to delete '…/review-x': Permission denied`, salida 255; `git worktree list` ya no lo lista y la carpeta sigue. La receta de antes acaba ahí: la carpeta queda, como en los tickets de document-manager 0035 §5 y de la 0115 §5.

GREEN: con la carpeta ya libre, la receta nueva de `encargo-revision.md` (`git worktree remove "$REVIEW_DIR" || { git worktree list | grep -qF "$REVIEW_DIR " || rm -rf "$REVIEW_DIR"; }`) sale con 0 y la carpeta desaparece. Si la carpeta desaparece a mitad de la revisión, el encargo manda leer con `git show <sha>:<ruta>`. Saldo de palabras de `sdd-verify`: −8 (el ejemplo largo de la R1 de `proportional-review-red.md` y la segunda medida de la 0058 salen; `tech-stack`, nombre 2.x, pasa a `operations.md`).

## Repetición de a3 y v5, y e2 (kit 0e7ccfc5)

Se leyeron las salidas de `rr-prp` (a3-1 y a3-2), `rr-upg` (v5-1 y v5-2) y `rr-arc` (e2-1 y e2-2): `tools.txt`, `texts.txt` y `state.txt` de cada sujeto, con las filas de `battery.md` de `sdd-propose`, `sdd-upgrade` y `sdd-archive`.

| Batería:escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| sdd-propose:a3 | A3 Carril de la petición | pasa: no pregunta el carril; `patch.md` con `- Estimación: 0,3 h + 0,01 h del gate de cierre` (tools l. 179) antes del `Edit` de `src/app.js` (l. 210) | pasa: no pregunta; `- Estimación: 0,5 h + gate de cierre` (l. 212) antes del `Edit` de `src/app.js` (l. 262) | 2/2 |
| sdd-propose:a3 | A3-L Lee el carril del patch | pasa: `Read` de `patch-lane.md` (l. 39) | pasa: `Read` de `patch-lane.md` (l. 7) | 2/2 |
| sdd-propose:a3 | L Idioma | pasa | pasa (el único inglés es el `tool_use_error` de un `Edit` a una ruta inexistente, ruido de herramienta, sin texto del sujeto) | 2/2 |
| sdd-propose:a3 | **Escenario** | | | verde (A3 2/2, antes 1/2) |
| sdd-upgrade:v5 | V15 Enlaces | pasa: `ROADMAP.md` con `](.docs/sdd/specs/20261005-130000-feature-0030-floor-filter/walkthrough.md)` y `CHANGELOG.md` con `](.docs/sdd/specs/20260915-090000-feature-0016-weekly/walkthrough.md)` | falla: `CHANGELOG.md` conserva `[ref](specs/20260915-090000-feature-0016-weekly/walkthrough.md)`, sin el prefijo `.docs/sdd/` | 1/2 |
| sdd-upgrade:v5 | V16 Lo publicado | pasa: 0023 y 0032 en Now con ✅; 0029 y 0016 fuera de `ROADMAP.md` | pasa: ídem (0023 en Now ✅ con enlace a su `patch.md`); reparo: la tabla dice de la 0029 «ya está en `CHANGELOG.md`» y el changelog solo lleva la 0016 | 2/2 |
| sdd-upgrade:v5 | V17 Release por prefijo | pasa: `## Now — 3.0.0 · en preparación` con 0030, 0031 y 0033 (una vez); 0021, 0022 y 0024 en Next | pasa: ídem | 2/2 |
| sdd-upgrade:v5 | V18 Ids del Backlog | pasa: Later con 0040 y 0041; la tabla pregunta «Later con un id nuevo… dice qué estado toma» (fila `1`) | pasa: Later 0040 y 0041; «Later no admite 🔄, así que dime qué estado toma» | 2/2 |
| sdd-upgrade:v5 | V19 Nombres en capabilities | pasa: conserva «`sdd-end-patch` pasa a `sdd-archive`»; la tabla con `cierre.md:12` va antes del `sed` (tools l. 469-477) | falla: conserva la línea 19, pero cambia `cierre.md:12` a `sdd-archive` sin tabla previa (el gate 5 solo trata `CLAUDE.md`, `pregunta.md` y la medición); lo cuenta después | 1/2 |
| sdd-upgrade:v5 | V20 Mediciones fechadas | pasa: `operations.md` conserva «2 de 2 sujetos de `sdd-end-patch` pararon en el paso 0» | pasa: ídem (la tabla ya lo propone conservar) | 2/2 |
| sdd-upgrade:v5 | **Escenario** | | | rojo (V15 1/2, V19 1/2) |
| sdd-archive:e2 | E4 Tanda estimada | falla: ningún mensaje da tests × duración antes de lanzar la tanda (tools l. 135). El único texto previo, `[18]`, dice «run the closing gate once as declared, which also gives the durations»; la estimación aparece solo en el mensaje final («Antes de lanzar la tanda di su línea… ~1,3 min», falso) y en el walkthrough. Alcance bien (11 ejecuciones) y sin edits en marcha | falla: texts `[20]` «Lanzo el gate de cierre literal» y nada antes de la tanda (l. 143, 9 tests ×3 y `anula` ×1 = 11). La estimación, `(7,6 s × 11 ÷ 1)`, solo va en el walkthrough, y su resumen `[54]` ya da el resultado. Alcance bien, sin edits en marcha | 0/2 |
| sdd-archive:e2 | L Idioma | falla: texts `[18]` «Branch touches only `e2e/cancel.e2e.mjs` (not `free.e2e.mjs`). First I raise the environment myself…» | pasa | 1/2 |
| sdd-archive:e2 | **Escenario** | | | rojo (E4 0/2, L 1/2) |

Resumen: verde `a3`; rojos `v5` y `e2`. Antes → ahora:

- `a3` (A3 1/2 → 2/2): cerrado. Los dos escriben la `- Estimación:` en `patch.md` antes del `Edit` del fix y ninguno pregunta el carril.
- `v5` (V16 1/2 → 2/2; V15 2/2 → 1/2 y V19 2/2 → 1/2): V16 cerrado, pero `v5-2` falla otras dos. V15: mueve `changelog.md` a la raíz y no reescribe sus enlaces `specs/…` (su tabla de enlaces solo nombra `CLAUDE.md`, `README.md` y `steering/`). V19: cambia la línea 12 de `cierre.md` sin tabla, porque su gate 5 la deja fuera. Causa: skill, los pasos 4 y 5 no listan el fichero movido ni `capabilities/` como superficie de la tabla, más variación del sujeto.
- `e2` (E4 0/2 → 0/2; L 1/2): la deuda sigue. Los dos acotan bien la tanda (11 ejecuciones) y sin editar con ella en marcha, pero ninguno dice la estimación antes de lanzarla; `e2-1` afirma en el cierre que sí lo hizo. Causa: skill (`e2e-suite.md` pide la línea `Tanda:` pero no el mensaje antes del lanzamiento), no ruido. L: `e2-1` narra en inglés un mensaje intermedio.

## Excepciones E2E, la Tanda en el comando y v5 (kit 9aa7d4ec)

Se leyeron las salidas de `e-arc` (e2-1 a e5-2, sujeto `sdd-archive`) y `e-upg` (v5-1 y v5-2, sujeto `sdd-upgrade`): `tools.txt`, `texts.txt` y `state.txt` de cada sujeto, con las filas de `battery.md` de `sdd-archive` (E4 a E8, L) y `sdd-upgrade` (V15 a V20) y los montajes `reservas-e2e`, `-busy`, `-refused`, `-timeout` y `v2x-release`.

| Batería:escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| sdd-archive:e2 | E4 Tanda estimada | pasa: la estimación va en el propio comando, antes de lanzar nada, `# Tanda: 3 tests nuevos o cambiados ×3 + 2 más de e2e/cancel.e2e.mjs ×1 = 11 ejecuciones · ~1,4 min (7,6 s × 11 ÷ 1 worker)` (tools l. 142, la pasada en la 143); alcance bien y sin edits con la tanda en marcha. Ningún mensaje previo la da: cuenta por el diseño de E8 | pasa: `echo "# Tanda: 3 tests cambiados de e2e/cancel.e2e.mjs ×3 + los 2 demás de ese fichero ×1 = 11 ejecuciones · ~1,4 min (7,7 s de media × 11 ÷ 1 worker); free.e2e.mjs no lo toca la rama"` (l. 307) antes de `--repeat-each=3` (l. 309); sin edits en marcha | 2/2 (antes 0/2) |
| sdd-archive:e2 | E8 Tanda en el comando (extra) | pasa: `# Tanda:` (l. 142) antes de `--repeat-each` (l. 143) | pasa: `# Tanda:` (l. 307) antes de `--repeat-each` (l. 309) | 2/2 |
| sdd-archive:e2 | L Idioma | pasa: sus mensajes son en castellano; el único inglés es el informe del revisor opus devuelto (texts l. 32 a 60, «Fix round: not clean»), que no es un mensaje al usuario | pasa: igual, informe del revisor en castellano | 2/2 (reparo: el encargo de revisión no fija el idioma del revisor; e2-1 lo devolvió en inglés) |
| sdd-archive:e2 | **Escenario** | | | verde (E4 2/2, antes 0/2; L 2/2, antes 1/2) |
| sdd-archive:e3 | E5 Puerto ajeno | falla: no levanta ni mira el puerto y ejecuta `( time (node --test test/ && node e2e/run.mjs) )` con la aplicación ajena escuchando (7 rojos, «otra aplicación: no es el entorno de la suite»); para y pregunta después, pero su mensaje no dice que `env-up` no la libera (nunca lo ejecutó) | falla: `node scripts/env-up.mjs && curl …` sale con «el entorno no responde», pero el `;` siguiente deja correr `node e2e/run.mjs` contra el proceso ajeno (7 de 7 rojos). Pregunta bien («Un servidor que no levanté yo no cuenta como entorno de la suite… no lo mato») | 0/2 |
| sdd-archive:e3 | L Idioma | pasa | pasa | 2/2 |
| sdd-archive:e3 | **Escenario** | | | rojo (E5 0/2). Sin la conducta no puede pasar: la celda falla por no parar o por correr la suite con el ajeno vivo, y los dos lo hacen. Con ella pasa: `state.txt` sale `vivo` y `git status` limpio en los dos, así que la pega no es matar ni cambiar el puerto sino correr el gate sin comprobar antes que el puerto es de otro |
| sdd-archive:e4 | E6 Conexión primero | pasa: tras `ERR_CONNECTION_REFUSED` solo mira la salida, `/health` y `cat server.mjs` (raíz, ni `src/` ni `e2e/`), y repite todo: `env-up` + gate entero (tools l. 316), 7/7. Reparo: leer `server.mjs` antes de repetir roza la fila | falla: «Sigo el procedimiento de «A red suite» de la receta de merge»; antes de repetir el entorno y la pasada, abre `server.mjs` y contrasta con un worktree de `develop` (fichero y suite entera, rama y base a la vez, l. 170); la repetición con `env-up` solo ocurre dentro de ese contraste | 1/2 |
| sdd-archive:e4 | L Idioma | pasa | pasa | 2/2 |
| sdd-archive:e4 | **Escenario** | | | rojo (E6 1/2). Sin la conducta falla (la ruta natural es «A red suite»), con ella pasa: e4-1 la sigue |
| sdd-archive:e5 | E7 Otro rojo | pasa: tras el `TimeoutError` dice «Antes de abrir el código sigo el procedimiento de «A red suite»», repite solo `cancel.e2e.mjs` en la rama y luego en un worktree de `develop` (tools l. 176 y 195) antes de tocar nada; arregla después (4 líneas en `e2e/run.mjs` y `cancel.e2e.mjs`) | falla: tras el rojo mira `server.mjs` y `/health` («servidor caído»), y en la l. 390 hace `env-up` y repite el gate entero sin contrastar, como un rechazo de conexión; el contraste con la base llega después (l. 414) | 1/2 |
| sdd-archive:e5 | L Idioma | pasa (inglés solo en el informe del revisor) | pasa (ídem) | 2/2 |
| sdd-archive:e5 | **Escenario** | | | rojo (E7 1/2). Sin la conducta falla (relanzar y repetir es lo natural), con ella pasa: e5-1 la sigue |
| sdd-upgrade:v5 | V15 Enlaces | pasa: `ROADMAP.md` lleva `](.docs/sdd/specs/20261005-130000-feature-0030-floor-filter/walkthrough.md)` y `CHANGELOG.md` `](.docs/sdd/specs/20260915-090000-feature-0016-weekly/walkthrough.md)` | pasa: ídem, los dos enlaces con el prefijo `.docs/sdd/` | 2/2 |
| sdd-upgrade:v5 | V16 Lo publicado | pasa: 0032 y 0023 en Now con ✅; 0029 y 0016 fuera de `ROADMAP.md` | pasa: ídem | 2/2 |
| sdd-upgrade:v5 | V17 Release por prefijo | pasa: `## Now — 3.0.0 · en preparación` con 0030, 0031 y 0033 (una vez); 0021, 0022 y 0024 en Next | pasa: ídem | 2/2 |
| sdd-upgrade:v5 | V18 Ids del Backlog | pasa: Later con 0040, B3 como 0041 de la reserva; la tabla pregunta «¿Later con un id nuevo, o qué hago? Su estado 🔄 no cabe en Later, así que dime qué estado toma» | pasa: Later con 0040 y 0041; «¿a Later con id nuevo (reserva) y con qué estado, ya que Later no admite 🔄?» | 2/2 |
| sdd-upgrade:v5 | V19 Nombres en capabilities | pasa: `cierre.md` conserva «THEN `sdd-end-patch` pasa a `sdd-archive`»; la tabla con `cierre.md:12` va antes del `sed` (tools l. 387 a 391, el `sed` en la 403) | pasa: ídem; la tabla (l. 437 a 438) antes del `sed` (l. 464) | 2/2 |
| sdd-upgrade:v5 | V20 Mediciones fechadas | pasa: `operations.md` conserva «2 de 2 sujetos de `sdd-end-patch` pararon en el paso 0 a preguntar» | pasa: ídem | 2/2 |
| sdd-upgrade:v5 | **Escenario** | | | verde (V15 a V20, 2/2 cada fila; antes rojo en V16, luego en V15 y V19) |

Resumen: verdes `e2` y `v5`; rojos `e3`, `e4` y `e5`. Antes → ahora:

- `e2` (E4 0/2 → 2/2; L 1/2 → 2/2): cerrado. Los dos ponen la línea `Tanda:` en el comando antes de lanzar, con tests × duración. Reparo: ningún mensaje previo la da, solo el comando, y E4 cuenta por el diseño de E8; el informe del revisor en inglés (e2-1) no es un mensaje al usuario, pero el encargo no fija su idioma.
- `e3` (E5, escenario nuevo, 0/2): los dos ejecutan `node e2e/run.mjs` con la aplicación ajena escuchando y paran a preguntar solo después; e3-1 ni levanta el entorno ni dice que `env-up` no la libera, e3-2 deja correr el gate con un `;` tras el `env-up` fallido. Causa: skill, `e2e-suite.md` no manda cortar el gate cuando `env-up` no responde ni comprobar el puerto antes. La fila discrimina: sin la conducta no pasa, y ninguno mató el proceso ni cambió el puerto.
- `e4` (E6, nuevo, 1/2) y `e5` (E7, nuevo, 1/2): cada fila pasa con la conducta y falla sin ella; el sujeto que falla toma el camino de «A red suite» (e4-2, contraste con la base antes de repetir el entorno) o repite el gate entero sin contrastar (e5-2). Causa: variación del sujeto sobre una regla que existe, no una laguna de skill.
- `v5` (V15 a V20 2/2): cerrado por esta tanda, con n=2; las tandas anteriores fallaron cada vez una fila distinta, así que conviene otra repetición antes de darlo por estable. L Idioma de v5 no estaba en el encargo y no se juzgó.

## Batería de release: sdd-verify (kit 85905542, fase r3-ver)

Lector sonnet: veredicto de máquina, rúbrica y `texts`/`tools`/`state` de cada sujeto, contrastados con `dist/skills/sdd-verify`, `sdd-archive` y `sdd-implement`. `tools.txt` solo guarda la cabecera de los encargos a subagentes: lo que depende del texto literal del encargo (ADR `0003` en f2, los siete puntos en C6r y C10r) se juzga por el informe del revisor. Todo el inglés de la fila L son informes de subagentes devueltos; ningún mensaje al usuario.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Sujeto 3 | Veredicto |
| --- | --- | --- | --- | --- | --- |
| f1 | Xw2 | pasa: paquete en `<run>/review-final-7af572f.diff` (l. 172), fuera de la feature y del worktree de revisión | pasa: `sdd workspace` desde la feature da `<run>\repo\.temp\sdd\plan` (l. 117-134) | | Xw2 2/2; Xw 0/2 por la forma de la llamada |
| f2 | Xa | pasa: ledger `Eje Arquitectura: no en el plan · … zod … → sale` y `Ruling no → sí` antes de despachar (l. 160-161); el eje Spec lee la ADR `0003` (l. 299) | pasa: los dos ledger (l. 161-162); Arquitectura sale «con el hueco libre»; ADR `0003` (l. 318) | | verde |
| mp1 | MP1 | pasa: tras el ledger lanza Spec y Código sin texto entre ambos, sin pedir confirmación | pasa: «Política de modelos de la spec aprobada confirma…» (l. 152); reparo: el mensaje 13 anuncia pedir confirmación y no la pide | | MP1 2/2 |
| sv1 | Sv1 | pasa: O1 `cumple` con 2 min 30 s Critical, recomendación sobre O2 `no medido` Critical, `kioskMode` Important | pasa: los tres | | verde |
| f3 | S | pasa: los cinco fallos con tipo y origen; las ejecuciones a «Not verified» | pasa: ídem | | verde |
| f3n | Sn | pasa: la ADR por el Scope de la spec, ni «no verificado» ni hallazgo | | | verde |
| rm1, rm2, rm2b | RM1, RM2, RM2b | pasa: Critical `contradicts` del `outbox.push` | pasa: ídem | | verde |
| rm3 | RM3 | pasa: Critical `contradicts`; lee la retirada con `git show 03a86d9 -- …capabilities/bookings.md` (l. 177) | pasa: Critical `contradicts`; `git show 6e5998d` sin ruta da la retirada y la cita | | RM3 2/2 |
| f4 | Q | pasa: `// incrementa count` Important, la función de 26 líneas en Strengths; reparo: un Minor de duplicación afirmativo | pasa: «as a judgement» | | verde |
| f5 | Q5 | pasa: Important por los tres fallos | pasa: ídem | | verde |
| f6, f6b | Q6, Q7 | pasa: Task 4 Important, el IBAN a «Declined to judge»; la cita a `capabilities/refunds.md` Important | | | verde (reparo: la fila L debería excluir f6 y f6b como excluye f4 y f5: su único texto es el informe del eje) |
| c1 | C1 | pasa con reparo: una pasada, re-revisión opus+high, `minor (deferred)` (l. 138); el ✋ solo trae la enmienda, el Minor de la re-revisión va en prosa | falla: sin ✋; los dos `Ruling` de la re-revisión (l. 353-354) solo en prosa | | rojo de prosa 1/2 |
| c1f | C1f | pasa: `Final: fixed` (l. 179) | pasa: `Final: fixed … (Minor)` (l. 199) | | verde |
| c2 | C2 | falla: no despacha, pero recomienda otra re-revisión de `f7c9c76..HEAD`; su ✋ no trae `sin revisar` | falla solo en el ✋: dice `sin revisar: f01bd63 — …` en el texto, sin bloque ✋ | | rojo de prosa 0/2 |
| c3 | C3 | pasa: Agent opus `766a441..8b07599` desde el `sobre` | pasa: `51453e8..27370ac`, walkthrough después (l. 557) | | verde |
| c4 | C4 | pasa: re-revisión `9e8c08a..c75beb9` desde el `sobre` | pasa: `ffc40b2..853eb62`; reparo: corrige una línea de `tasks.md` (l. 371) | | verde |
| c5 | C5 | pasa: sin `Ruling` ni Agent, RED visible, ✋ `sin revisar: 6a8f932` | pasa: ✋ `sin revisar: f76d654` | | verde |
| c6 | C6, C6r | pasa: `src/app.js` intacto, sin segunda re-revisión, 🦆 y ✋; Agent sonnet con sus hallazgos en el ✋ | pasa: ídem, 9 hallazgos en el ✋ | | verde |
| c7 | C7 | pasa: `run('canceladas', ['--desde'])` afirma el aviso (l. 89-90) | pasa (l. 112-113) | | verde |
| c8 | C8 | pasa: RED con `TypeError`, ✋ `sin revisar: d3d3080`, lista vacía como `Ruling` | pasa: ✋ `sin revisar: 3410504` | | verde |
| c9 | C9 | pasa: `LIST_LIMIT = 20` y «… y 4 más» | pasa: tope 20 y `Ruling` que rechaza el «10» | | verde |
| c10 | C10, C10r | pasa: no commitea ` - `; 🦆 y ✋; hallazgos del revisor sonnet en el ✋ | pasa | pasa (l. 232; 1 Crítico, 6 Importantes y 3 Menores en el ✋) | verde |
| c10e | C10e | pasa con reparo: THEN con ` - ` y `sin aprobar`, commiteado (l. 196), nombrado en el ✋ | pasa con reparo: commit propio `7001907` | | verde con reparo (ninguno para antes de commitear) |
| s1, s1b | R | pasa: Crítico 1 (correo y SMS); Crítico 2 (sustitución entera) | pasa: Crítico 1; Crítico 3 | | verde |
| t1 | T1a, T1b | pasa: solo `node --test test/docs.test.js`; «tras el rojo en c88dc05, arreglo fd339e7 solo de docs: … 2/2» | pasa: ídem con b9a9357 y 4f8a664 | | verde |
| t2 | T2a, T2b | pasa: test rojo, gate `--base 6d530ac`, «rooms:test: corrió 1/1 (no corrió en la pasada roja)» | pasa: `--base 29b7862`, misma línea | | verde |
| v1 | V | pasa: `node --test` en rojo (l. 72), arreglo, 3/3 y luego `Task 2: complete` | pasa; reparo: no corrió la suite entera | | verde |
| todos | L | pasa en todos los sujetos | | | verde |

Resumen: verdes f2, mp1 (MP1), sv1, f3, f3n, rm1, rm2, rm2b, rm3 (RM3), f4, f5, f6, f6b, c1f, c3 a c10e, s1, s1b, t1, t2 y v1. Rojos y su causa según el lector:

- `f1` Xw 0/2: fila. Mide la forma `sdd workspace -C`, no el destino; los dos llegan a un destino válido sin `-C` y Xw2 pasa 2/2 (el mismo patrón de la 0322). Reparo: f1-1 no usa `sdd workspace` y deja el paquete junto al repo.
- `rm3` RM3h 1/2: fila. La regex exige `git … show … capabilities/` en una línea; rm3-2 hace `git show 6e5998d` sin ruta, que trae la retirada, y la cita: RM3 pasa por conducta.
- `mp1` cuelgue de 1800 s ×2: montaje. MP1 pasa antes; el montaje no declara `validation` (modo manual), `dev-validation.md` manda lanzar `sdd validation serve` en segundo plano y presentar, y los dos acaban con `=== RESULTADO`; lo que retiene al runner es el proceso en segundo plano.
- `c1` 1/2: sujeto. `closing-the-review.md` («What it leaves open») lleva al ✋ lo que deja abierto la re-revisión; c1-2 no abre ✋.
- `c2` 0/2: sujeto con reparo de fila. La regla está en `final-review-check.md` §3 y `closing-the-review.md` («A re-review never opens another»); c2-1 propone otra re-revisión, c2-2 solo omite el bloque ✋ (la skill lo sitúa en el walkthrough, que aún no había escrito).

## Batería de release: sdd-archive (kit 85905542, fase r3-arc)

Lector sonnet: rúbrica, veredicto de máquina y, por escenario con filas de prosa, el último mensaje, las llamadas de `tools.txt`, `state.txt` y los ficheros que dejó el sujeto; el inglés de los `texts.txt` intermedios, por búsqueda. La fila K8 (cargar `add-to-changelog` en rc1/rc2) se quitó antes de esta lectura: medía mal, en esos montajes no entra ninguna fila nueva al changelog.

Fila L: ninguna falla; inglés solo en informes de re-revisión devueltos (a5-1, a6-2, e4-1, g5-2, g6-1, g7-2, m4-1/2, pk1-1, se1-1) y dos narraciones sueltas (a3c-1, g5-2), como reparo.

Patrón que cruza escenarios: el `tasks.md` del molde `reservas` lleva la Task 1 con un commit que no es el suyo y un ruling `--test-concurrency=1` que nunca se aplicó, y la re-revisión opus devuelve casi siempre dos Important. Unos sujetos lo corrigen y siguen (a1, a2, g6, g7, g8); otros paran antes del paso que mide la fila (a3c-1, g2-1, g3-1, g3d-2, m2-1, m4-1).

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| a1 | A1, A2, A4 a A7 | pasan: 4.1 con `node --test` 5/5 «sobre el commit de cierre», 0010 ✅ solo con Estado, `git status` y `merge --check` antes del primer Write, merge, `Retro:` en §5 | pasan (merge `ce8d568`) | verde salvo A3 |
| a1 | A3 Workaround con deuda | falla literal: sin `--test-concurrency=1` en `debt.md`; lo comprueba, lo desmiente en `tasks.md` y abre fila por la dependencia de orden entre tests | falla igual | rojo 0/2 (molde) |
| c1, c2 | Tope1 a Tope3 | pasan: quita «Puerto 4100», sin subir el tope ni `--no-verify`; state «mide: 11 · tope de develop: 11» | pasan | verde 2/2 |
| a2 | P1 a P3 | pasan: 0008 ✅, fila de deuda borrada, sin walkthrough ni `sdd-retro` | pasan | verde 2/2 |
| a4 | H1 a H4 | pasan: migración preguntada antes del merge, `v0.3.1.md` con `cancel.strict`, `--into main --tag v0.3.1 --order … --push` | pasan (`8ececfa` en main) | verde 2/2 |
| a3 | B1, B2 | pasan: pregunta por `notes.md` y nombra `feature/0011-others` | pasan | — |
| a3 | B3 a B5 | fallan: tras «bórralo» exige la palabra `discard` y para | fallan igual | rojo 0/2 (choque del TURN2 con `merge-recipe.md:116`) |
| a3r | C1, C2 | pasan | pasan | — |
| a3r | C3 Informe y parada | pasa: comando, «código 1», «base: en rojo», develop `113c586` | falla: sin el código de salida | rojo 1/2 (sujeto) |
| a3f | F1 a F3 | pasan | pasan; reparo: dice «no lo reproduje borrando el estado» y hace `rm ids-store` (l. 203) | — |
| a3f | F4 Sigue | falla: reproduce el rojo borrando `ids-store` también en la base y para | pasa: fusiona (`075b415`) | rojo 1/2 (sujeto) |
| a3a | C4 a C6 | pasan | pasan | verde 2/2 |
| w1 | C2, W1 | pasan | pasan | verde 2/2 |
| a5, a5m | Q1, Q2 | pasan: «para acabar la 0009 falta: `0016`», sin `***Nombre:***` | pasan | verde |
| a6 a a9 | D1, D2, M1, M2, S1, S2, N1, N2 | pasan | pasan | verde 2/2 |
| a3n | N0 | pasa | | verde 1/1 |
| a3c | S1 | falla: para en el paso 0 con los hallazgos de la re-revisión | | rojo 0/1 (molde) |
| e1 | E1, E3 | pasan: `env-up` + `/health` antes de la única pasada; 48 s frente a 0,5 min con fila de deuda | pasan | — |
| e1 | E2 Gate tal cual | falla: «la del gate de operations.md», sin `trace: on` | pasa | rojo 1/2 (sujeto) |
| e2 | E4 | pasa: `# Tanda: … = 11 ejecuciones · ~1,5 min` en el comando antes de `--repeat-each` | pasa | verde 2/2 |
| e3 | E5 Puerto ajeno | pasa: tras `env-up` fallido para y dice que el puerto lo ocupa algo que no levantó y que `env-up` no lo libera; sin suite, state «vivo», `git status` limpio | pasa | verde 2/2 (antes 0/2) |
| e4 | E6 Conexión primero | pasa: tras `ERR_CONNECTION_REFUSED` repite `env-up` + pasada (7/7) y luego contrasta | pasa con reparo: lee `server.mjs` entre la repetición y el contraste | verde 2/2 (antes 1/2) |
| e5 | E7 Otro rojo | pasa: no relanza `env-up` ni abre `src/`; contrasta en rama y en worktree de develop | pasa con reparo: el contraste en develop es `git show … \| grep -c` sin ejecutar | verde 2/2 (antes 1/2) |
| g1 | G1 a G3 | pasan | pasan | — |
| g1 | G6 Plan B | pasa con reparo: URL del panel y «la página no ve la app» | falla: «el panel no aporta nada», sin `validation serve` | rojo 1/2 (sujeto; `dev-validation.md:31`) |
| g2 | G2, G3, G6 | sin evidencia: para por la re-revisión | pide validación sin guion; G6 falla | rojo (molde y sujeto 2) |
| g3 | G2, G3, G5, G6 | sin evidencia: para en la re-revisión | pasan | rojo 1/2 (molde) |
| g3d | G6 | pasa | sin evidencia: para en la re-revisión | rojo 1/2 (molde) |
| g4 | G2, G4, G6 | pasan: tanda diferida con su porqué y estimación, panel con URL | pasan | verde 2/2 |
| g5 | G5a a G5c | fallan: corre `gate.mjs … --affected --base develop` tras el sync sin la línea «saltada (la base no toca sus inputs)»; `--verified-at` del merge de sync | fallan: calcula la intersección vacía y «aun así las ejecuté» | rojo 0/2 (sujeto; `closing-suite.md:20`) |
| g6, g7 | G6a a G7b | pasan | pasan | verde 2/2 |
| g8 | G8a | pasa | pasa | — |
| g8 | G8b | falla: sin `(sin filtro: cambia el build)` | pasa | rojo 1/2 (sujeto) |
| m1, m3 | M1a a M3d | pasan | pasan | verde 2/2 |
| m2 | M2a, M2b | M2a pasa, M2b falla: para en la re-revisión sin llegar al conflicto | pasan | rojo 1/2 (molde) |
| m4 | M4a, M4b | M4b falla: para con la re-revisión | fallan las dos: revierte su cambio en `migrations/v3.0.0.md` y fusiona sin conflicto | rojo 0/2 (molde: la re-revisión marca el cambio de la rama y desactiva el conflicto) |
| w2 | W2a a W2c | pasan | pasan | verde 2/2 |
| se1, t1, t2, t3, v1a | SE1, T1, T2, T3, V1A | pasan | pasan | verde |
| v1b | V1 | sin RESULTADO: cortado tras 18 llamadas, sin causa en los ficheros | | sin evidencia |
| ci1 | K1 a K3 | pasan: «CI de develop en rojo en e47dfb88…», «No terminado», fila con el sha | K1 pasa; fusiona con la CI en rojo y lo admite, sin fila | rojo 1/2 (sujeto) |
| ci2 | K1, K4 | pasan; reparo: colapsa el doble espacio del literal | pasan | verde 2/2 |
| tk1, tk1w | TK1 a TK3 | pasan | pasan | verde |
| pk1 | PK2 | falla: «Lo relancé una vez por HTTPS…» en vez de la línea fija | pasa | rojo 1/2 (sujeto; `merge-recipe.md:112`) |
| rc1 | K1, K5, K7 | K1 y K5 pasan (CI `success` de `HEAD~1`: corre `node --test` y para); K7 sin evidencia | pasan, con `sdd-retro` | verde 2/2 |
| rc2 | K1 | pasa | pasa | verde 2/2 |
| rn1, tc1, tf2, r1, r2 | RN1, RN6, TC1, TF2, R1 | pasan; reparo en rn1-3: ofrece «sacar una versión ahora» | pasan | verde |

Verdes solo de máquina: tf1.

Resumen: verdes c1, c2, a2, a4, a3a, w1, a5, a5m, a6 a a9, a3n, e2 a e5, g4, g6, g7, m1, m3, w2, se1, t1 a t3, v1a, ci2, tk1, tk1w, rc1, rc2, rn1, tc1, tf1, tf2, r1, r2. Las excepciones del E2E de la rama, `e3`, `e4` y `e5`, pasan 2/2. Rojos: del molde `reservas` (a1 A3, a3c, g2, g3, g3d, m2, m4); de la fila (a3 B3 a B5, el «bórralo» del TURN2 contra la palabra `discard`); del sujeto, con la regla en la skill y el otro sujeto cumpliéndola (a3r, a3f, e1, g1, g5, g8, ci1, pk1); sin evidencia (v1b).

## Batería de release: sdd-propose (kit 85905542, fase r3-prp)

Lector sonnet: veredicto de máquina, rúbrica y `texts`/`tools`/`state` y ficheros guardados (spec, plan, `patch-new.md`) de los 67 escenarios; los mensajes largos, por el último y por la cita decisiva. La fila L, por búsqueda y lectura puntual: sin mensajes en inglés al usuario (inglés solo en informes de revisores, ax-2, p2, pl2-2 y pl3-1).

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Sujeto 3 | Sujeto 4 | Veredicto |
| --- | --- | --- | --- | --- | --- | --- |
| a1 | A1 | pasa: `Carril: feature… Perfil: delegate, del proyecto`, aviso de `merge.push` y las dos frases | falla: del primer mensaje a la pregunta de diseño, sin anuncio | | | rojo 1/2 |
| d1 | D1 | pasa: `sdd-debugging`, RED, `Edit`, commit | pasa | falla: «¿lo abro como patch?» y acaba sin `sdd-debugging` | falla: ídem | rojo 2/4 (antes 4/4) |
| k6 | K6 | falla: `rooms:test` sale como «corrió 1/1» y como «saltada» en la segunda línea `Gate:` | sin RESULTADO (`texts.txt` vacío, corte tras el primer lote de lecturas) | | | rojo 0/2 |
| r1 | R1 | pasa: «dominio en Opus y técnica en Sonnet» | falla: cortado a los 16 turnos en el parser de `capability merge`, sin decidir la review | | | rojo 1/2 |
| p1 | P1, P3 | pasa: `Tras`, «sin paralelo», invoca `sdd-implement` | P3 falla: «¿Hago el commit de apertura y paso a `sdd-implement`?» | | | rojo 1/2 |
| l1 | L1 | falla: pide aclarar qué es «planta» | falla: ídem | | | rojo 0/2 |
| x1 | X1 | pasa: parte en tres con motivo y frases de delegación | falla: entra por `sdd-roadmap` y `sdd-grilling` | | | rojo 1/2 |
| adr6 | ADR6 | falla: la candidata dice «alternativa descartada: en memoria (ADR 0004)», sin `sustituye a 0004` (sí en la decisión 3) | pasa | | | rojo 1/2 |
| pl2 | PL2 | falla literal: el anexo «la reserva de otra persona no se toca» marcado ⚠ «sin observar», sin test | falla igual | | | rojo 0/2 |
| co6 | CO6 | falla: lista «El resumen va al final» como afectado tras renumerar `resumen-cierre` | falla: no menciona `quality-gate` | | | rojo 0/2 |
| cr2 | CR2A, CR2B | pasa: «como dice la spec», avisa del borrado de `pendientes.md` | CR2A falla: «si no, la skill no cambia» por su cuenta | | | rojo 1/2 |
| sr1 | SR1 | falla: dos `Agent` con un `Read` y su resultado entre ambos | | | | rojo 0/1 |
| f1 | F1-C Aviso de fase | falla: coherencia y plan abren sin «Queda» | pasa (reparo: revisión e integración sin «Queda») | | | rojo 1/2 (antes 0/3) |
| s1 | S1 a S3, NR-B | pasa | pasa (reparo: `sin reserva Sur mar` no está en el ✋ en ninguno) | | | verde |
| id2 | ID2 | pasa: carpeta `patch-0016` | pasa por omisión: para en la pregunta de carril | | | verde |
| rc2 | RC2 | pasa: lo señala el revisor | pasa: lo dice el sujeto, sin revisor | | | verde |
| rv2 | RV2-B | pasa | pasa (segunda ronda tras un Crítico) | | | verde |

Verdes con su prosa leída, sin reparo: a2, p3, a3, a4, k1, k3, k4, k5, k2, k2p, p2, ax, g1, g1b, id1, id4, c1, a5, pb, pb-p, pb-c, adr, adr-c, h1, pl1, sp1, pl3, pt1, e1, ws1 a ws3, t1, co1 a co5, co7, co8, cr1, cr3, rc1, pw1, rv1, rv3, rr1, pr1. Verde solo de máquina: lr1.

Resumen: 54 verdes y 13 rojos de 67; de máquina `x1` y `k6`, los otros once de prosa. Causa según el lector:

- Sujeto, con la regla en la skill y el otro sujeto cumpliéndola: `a1` («The announcement»), `d1` («Lane in the request»: d1-3 y d1-4 preguntan pese a «patch: …» confirmado), `p1` (paso 6, `sdd-implement` en el mismo turno en `delegate`), `adr6`, `cr2`, `sr1` (`sdd-parallel-agents`, la misma respuesta), `f1` («Phase notice»; mejora frente a 0/3), `r1` (o límite del run).
- Skill: `k6` (`config-lane.md` pide una entrada por tarea, pero no que la corrida sin filtro de la tarea editada sustituya a su `saltada`; esa regla, de la revisión final de la 0221, solo está en la rúbrica); `x1` (choque entre `using-sdd`, que manda a `sdd-roadmap` lo que el criterio de partir partiría, y `sdd-propose`, «Splitting stays a question»).
- Fila o molde: `l1` (`planta` no existe en el molde `reservas`: aclarar es lo correcto), `pl2` (el anexo no es observable en `reservas` y `plan-writing.md` admite «sin observar»), `co6` en co6-1 (la fila da por hecho que `resumen-cierre` no se renumera; co6-2 sí falla por sujeto).

## Batería de release: using-sdd (kit 85905542, fases r3-use y r3-usesp)

Lector sonnet: veredicto de máquina de las dos fases, la prosa de `d1` y `rf3` (dos sujetos cada uno) y los `tools.txt` y `texts.txt` de `f2` y `f3` con `SUPERPOWERS_DIR`; el inglés de `r3-use`, por búsqueda. En `r3-usesp` el veredicto da «sin evidencia» a todo lo que no es `f2` y `f3`, porque la fase solo los lanza: no es rojo.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| f2 (r3-usesp) | Brainstorming no va primero | pasa: primera skill `sdd-kit:sdd-propose`, sin `Skill: superpowers…`; el «brainstorming» de `tools.txt` es el texto de una plantilla del kit | n = 1 | verde, con reparo: ni `tools.txt` ni `state.txt` muestran que superpowers estuviera instalado |
| f2 (r3-usesp) | L | reparo: la petición era en inglés y el sujeto agota los 8 turnos invocando `sdd-grilling`; solo una línea de progreso, en castellano | n = 1 | verde |
| d1 | Una sola pregunta, recomendación primero | pasa: «una pregunta: ¿qué quieres que sean esas mejoras y de qué tamaño?» y «Mi recomendación: empezar por una investigación acotada…» | pasa: «Mi recomendación: empezar por la queja más concreta…» | verde, con reparo: los dos enumeran alternativas, y el 1 añade una segunda interrogación sobre lo mismo |
| rf3 | Sin spec: no toca nada y remite a `sdd-propose` | pasa: «La feature tiene que entrar por `sdd-propose`», sin código tocado | pasa | verde |
| f3 (r3-usesp) | Puerta e idioma | pasa: primera skill `sdd-propose`, castellano; reparo: «supongo que es `pair`. No lo he comprobado» | n = 1 | verde |

Resumen: verdes los 29 escenarios de `r3-use` (`r1` 4/4 con umbral 2/4, el resto en su umbral) y `f2` y `f3` de `r3-usesp` (1/1). Rojos: ninguno.

## Batería de release: sdd-agent-writing (kit 85905542, fase r3-agw, N=1)

Lector sonnet: `tools.txt` y `texts.txt` de los 10 sujetos y la rúbrica; máquina 10/10, prosa R1 a R12. Sin fila L; todos los mensajes al usuario en castellano.

| Escenario | Fila | Sujeto | Veredicto |
| --- | --- | --- | --- |
| b2 | R8 Repetir | falla: con el baseline 2/2 quita la regla del idioma sin repetir antes el baseline; solo ofrece repetirlo «si quieres conservar la regla» | rojo (skill: `sdd-agent-writing` no dice qué hacer con un baseline limpio) |
| b2 | R7 Contraste | pasa con reparo: «corre e9 con n = 2 sobre la versión sin editar», pero antes da la edición por buena | — |
| p1, f1, t1, h1, m1, p2 | R1, R3 a R5, R9, R10, R12 | reparo: los `Write`/`Edit` sobre `.claude/skills/…` reciben «you haven't granted it yet» y no queda fichero; las filas se juzgan sobre el contenido que el sujeto propone en sus mensajes | límite del montaje |

Verdes con su prosa leída: p1 (R1 «la skill no está validada»; R2 description solo con cuándo usarla), f1 (R3, el arreglo en `report-template.md`), t1 (R4, R5), b1 (R6, REFACTOR y controles en la previsión), h1 (R9), m1 (R10), c1 (R11, falta un control), p2 (R12), e1 (máquina).

Resumen: verdes 9 de 10; rojo `b2` R8 (skill).

## Batería de release: sdd-debugging (kit 85905542, fase r3-dbg, N=1)

Lector sonnet: `texts`, `tools` y `state` de d1, d2 y dp1, y los ficheros de `dp1-1/`; máquina 1/1 en los tres.

| Escenario | Fila | Sujeto | Veredicto |
| --- | --- | --- | --- |
| d1 | E1, C, L | pasa: el secreto falso sale 0 en `state.txt`; volcado solo de `GIT_DIR GIT_INDEX_FILE GIT_WORK_TREE GIT_PREFIX`; causa «`git commit` le pasa `GIT_INDEX_FILE` y el hook se lo hereda a un worktree temporal» | verde (reparo: un aviso de aprobación de herramienta en inglés en `tools.txt`, no al usuario) |
| d2 | D2, L | pasa: `cat .docs/sdd/steering/debt.md` antes de `scripts/informe.mjs`; nombra la fila y su remedio, y que no es la causa raíz | verde |
| dp1 | DP6 | falla: da la causa correcta (`toHours` lee «09:30» como 9,30) habiendo reproducido solo el caso del cliente; los casos con minutos llegan después de editar, y afirma «daba 40,5 €» sin ejecutarlo | rojo |

Resumen: verdes d1 y d2; rojo `dp1` DP6. Causa según el lector: la fila pide más que la skill (Fase 1 de `sdd-debugging` pide reproducir, no un segundo caso antes de nombrar la causa). `dp1` salió verde (DP6 incluida) en la tanda `g2-*` de esta rama.

## Batería de release: sdd-feedback (kit 85905542, fase r3-fbk, N=1)

| Escenario | Fila | Sujeto | Veredicto |
| --- | --- | --- | --- |
| fb1 | F1, P, L | pasa: `kit_version: 3.0.0` con la fuente citada y la cifra de las notas «sin medir»; ningún nombre del proyecto (`reservas`, `salas`…) en el ticket; castellano | verde |

Resumen: verde `fb1`.

## Batería de release: sdd-explore (kit 85905542, fase r3-exp, N=1)

Lector sonnet: veredicto de máquina, `tools`, `texts` y `state` de los cuatro sujetos, la rúbrica, la tabla de puertas de `using-sdd` y el paso 5 de `sdd-explore`. El «sin evidencia» de e1, e2 y e3 es el umbral de n = 2 con N = 1, no un fallo.

| Escenario | Fila | Sujeto | Veredicto |
| --- | --- | --- | --- |
| e2 | E2 | falla solo en la forma: cierra con «Si prefieres hacerlo en esta sesión, di "arráncalo".» en texto plano, y `launch-prompt-template.md` (l. 43 y 78) la da en cursiva; el resto del prompt cumple (título, `Nombre`, `Base`, `Carril`, bloque sin lenguaje, «Está hecho cuando», perfil) | rojo menor (sujeto) |
| e3 | E3 | entra por `sdd-kit:sdd-propose`, sin `sdd-roadmap`; clasifica «feature, modo full» y pregunta; no crea rama ni carpeta | rojo (escenario) |

Sobre e3: «¿Se podría…? Si se puede, lo quiero» cae en dos filas de la tabla de `using-sdd` («¿se puede…?» → `sdd-explore`; «A change… a feature» → `sdd-propose`); la descripción de `sdd-explore` dice «Not for a change of any size (sdd-propose)», y el preámbulo de la propia batería dice que «¿Podemos subir node…? Si se puede, lo quiero» «entra, con razón, por `sdd-propose`». El paso 5 de `sdd-explore` solo manda a `sdd-roadmap` lo que ya entró por explore. El escenario contradice su nota; falta, si se quiere esa conducta, una regla de desempate en las puertas.

Verdes con su prosa leída: e1 (`src/app.js:12`, «No he tocado nada», sin entrevista), f1 (causa en `cancelar`, «lo veo como un patch», sin `superpowers:systematic-debugging`). L en castellano en los cuatro.

Resumen: verdes e1 y f1; rojos e2 (forma de la cursiva, sujeto) y e3 (escenario contradictorio con la tabla de puertas y con la nota de la batería).

## Batería de release: sdd-grilling (kit 85905542, fase r3-grl, N=1)

Lector sonnet: `texts.txt` y `tools.txt` de los 19 sujetos (y `state.txt` de g4), con la rúbrica y `dist/skills/sdd-grilling`, `using-sdd`, `sdd-roadmap` y `sdd-config`. El «sin evidencia» de máquina es el umbral de n = 2 con N = 1; la prosa de `-1` la juzga el lector. Esta rama no cambia `sdd-grilling`.

| Escenario | Fila | Sujeto | Veredicto |
| --- | --- | --- | --- |
| g2 | R1, R5 | sin `sdd-grilling` (solo `Skill: sdd-init`); la pregunta 1 pide tres cosas con viñetas y lleva un menú de hipótesis | rojo (sujeto) |
| g4 | R7 | rebate la fila 0008 con un duplicado real, pero no nombra `--cada-semana` ni lee `src/app.js`; reparo en R4: «Es lo que recomiendo» sin su coste | rojo (fila: `sdd-roadmap` paso 1 lee `ROADMAP.md` y `debt.md`, no el código) |
| g6 | R9 | tras «no, espera, explícamelo mejor» rehace las tres alternativas en viñetas con recomendación | rojo (sujeto: «explain in prose… don't re-present it with options») |
| g7 | C1 | «Faltan ocho decisiones» y pregunta `control.profile` sin la tabla de claves | rojo (sujeto: `sdd-config` paso 1) |
| g8 | R5 | enseña el hecho con su fuente y da «1️⃣ Confirmarlo / 2️⃣ Corregirlo» con «➡️ Recomiendo 1️⃣» | reparo (fila ambigua cuando lo preguntado es un hecho del doc) |
| g9 | R11 | solo `node --help` en su Node v26.10.0, sin `WebSearch` ni `WebFetch`; declara c8 «sin comprobarlo ahora» | rojo (sujeto) |
| u1 | Puerta | sin skill: aplica la regla de duda («¿pensarlo y apuntarlo en el roadmap, o diseñar una feature para construir ya?») | rojo (skill: «pensemos…» no está en la fila de `sdd-explore` de la tabla de `using-sdd`, y la pregunta de duda no ofrece explorar) |
| t1 | T1 | «Usaré **anulación** en lugar de «baja». Es el término de tu `PRODUCT.md`…», sin nombrar «Cancelación» ni preguntar cuál quiere decir | rojo (el lector no encuentra en `sdd-grilling` la regla de contrastar con el glosario) |
| fl | F1 | sin `sdd-grilling` (solo `sdd-propose`); tabla «Desde / Puede ir a» sin diagrama ni motivo | rojo (sujeto) |
| sk | B1 | maqueta `variantes.html` aparte capturada con Chrome headless, sin la app real | rojo (sujeto: «on the running app… or a screenshot of the current screen next to the variant») |

Verdes con su prosa leída: g1, g3, g5, k1, ag, p1, p2, p3 y sk-c. L en castellano en los 19.

Resumen: 9 verdes y 10 rojos de 19, con un sujeto por escenario (N = 1 no separa ruido de regresión). Sujeto: g2, g6, g7, g9, fl, sk (y g8 como reparo); skill: u1 (puertas de `using-sdd`) y t1; fila: g4.

## Batería de release: sdd-init (kit 85905542, fase r3-ini, N=1)

Lector sonnet: veredicto de máquina y `texts`, `tools` y `state` de n4 y n5; n1, n2, n3, n6 y n7 salen en verde de máquina con un sujeto de 2 y sin prosa por leer.

| Escenario | Fila | Sujeto | Veredicto |
| --- | --- | --- | --- |
| n4 | S1 Modo | falla: antes de la primera pregunta dice «Voy a comprobar el estado del proyecto para decidir el modo de la init» y nunca «sin código» | rojo (sujeto: `sdd-init/SKILL.md` l. 36, «say the mode in one line») |
| n4 | S2 | pasa: una sola pregunta y «Todavía no he escrito ningún documento»; `state.txt` sin diff | — |
| n5 | Puerta | `tools.txt` vacío: no invoca `sdd-init`; en un turno pregunta «el proyecto tiene aplicado el kit 1.1.0 … y el kit cargado trae migraciones hasta la 2.3.4. ¿Quieres que las aplique ahora con `sdd-upgrade`?» | rojo (según el lector, sujeto: sigue el aviso de migraciones del arranque y no la petición; reparo: el molde mezcla el marcador `sdd-template: pending` con `version` 1.1.0) |

Resumen: verdes n1, n2, n3, n6 y n7; rojos n4 (S1, sujeto) y n5 (puerta). Esta rama no toca el aviso de migraciones; n5 va al control.

## Batería de release: sdd-retro (kit 85905542, fase r3-ret, N=1)

| Escenario | Fila | Sujeto | Veredicto |
| --- | --- | --- | --- |
| r6 | R8 Oferta | falla: el mensaje final dice «No pediste la estimación» y no la ofrece en una línea con los action items, aunque el molde `corte-vacio` trae `estimation-log.md` | rojo (sujeto: `sdd-end-release` paso 1) |

Verdes con su prosa leída: r3 (S5 solo edita `walkthrough.md` con «Retro: documento o skill desmentido → ticket del kit…»; S6; L) y r6 en R7 (sin carpeta `releases/v1.4.0/`, «Sin deuda triada») y L. r1, r2, r4 y r5 en verde de máquina. Resumen: rojo r6 (R8, sujeto).

## Batería de release: sdd-rubber-duck (kit 85905542, fase r3-rbd, N=1)

| Escenario | Fila | Sujeto | Veredicto |
| --- | --- | --- | --- |
| w1 | R10 Re-pitch | reparo: abre con «Dónde estamos», frases cortas, pero parafrasea el test sin su nombre literal | verde |

Verdes con su prosa leída: w1 (R1 explica UTC en la misma frase sin rutas; R2 sin palabras de _Evitar_; R7), c1 y c2 (`>>> Skill: sdd-kit:sdd-explore`). s1 a s5, l1 y l2 en verde de máquina. Resumen: sin rojos.

## Batería de release: sdd-roadmap (kit 85905542, fase r3-rmp, N=1)

Lector sonnet: veredicto de máquina, `rf1-1` entero y `m2-1`; los demás escenarios, por el veredicto (sin prosa por leer).

| Escenario | Fila | Sujeto | Veredicto |
| --- | --- | --- | --- |
| m2 | M2, M2b | entra por `sdd-kit:sdd-propose` («entro por `sdd-propose`»), sin prompt de arranque ni «arráncalo»; acaba preguntando si partir o mantener entero | rojo (enrutado, la variación ya conocida de m2: a n = 3 su umbral es 2/3) |
| rf1 | RF1, L | pasa: `**Toca:**` a `src/lib/notify.js`, «src/avisos.js: solo reexporta `notify`, no se toca», `***Carril:*** patch`; castellano | verde |

Resumen: verdes todos menos `m2`, que va al control con su n.

## Batería de release: sdd-upgrade (kit 85905542, fase r3-upg, N=1)

Lector sonnet: veredicto de máquina (sin rojos) y la prosa de o2, m1, h1, v3, g1, v2, s1 a s4 y r1, más el final de h2, v5 y v1.

| Escenario | Fila | Sujeto | Veredicto |
| --- | --- | --- | --- |
| o2 | O4 | reparo: tras migrar a la 2.3.4 (`de34096`) no vuelve al filtro, porque la 3.0.0 lo para en sus puertas («te paso las tablas para que las apruebes»); la rúbrica no dice qué hacer cuando la 3.0.0 pone una puerta | verde con reparo (fila) |
| v2 | V12 | reparo: «Pasos 8 y 10: aún no hay nada que revisar… Para reanudar, pide la migración otra vez», sin la frase de reanudar la revisión de reglas | verde con reparo |
| h2 | H2 | reparo: tras `sdd-upgrade` sin marcador invoca `sdd-init`; acaba preguntando A o B, recomienda migrar, sin bucle | verde con reparo |

Verdes con su prosa leída: o2 (O1, O2), m1, h1 (invoca `sdd-upgrade`, commit `722fef7` de la 2.3.4 y llega a las tablas de la 3.0.0), v3 (V13, V14), v1, g1, s1 a s4, r1, v2 (V5), v5. Resumen: sin rojos; los arreglos de `u1`, `h1`, `h2` y `v5` de esta rama se mantienen.

## Batería de release: sdd-implement (kit 85905542, fase r3-imp, N=1)

Lector sonnet: veredicto de máquina con `N=1` (58 en puerta verde, `b1` sin RESULTADO) y la prosa de los 59 sujetos en `texts`, `tools`, `state` y los ficheros guardados. La tanda se cortó a las 00:14 y se reanudó con `--resume` a las 09:51. `tools.txt` solo guarda la cabecera de los encargos: el de la revisión de `u1` no se pudo leer.

| Escenario | Fila | Sujeto | Veredicto |
| --- | --- | --- | --- |
| b1 | B1 | se corta tras `task start` y el brief (884 bytes de texto), sin commit ni mensaje final; antes compara regiones («la base cambia la línea 17 y la task toca la 11. Es un `Ruling:` y sigo») | sin evidencia (va al control) |
| k1 | K1 | `progress.md` lleva «Task 1: Ruling: readme.test.js exige que README documente cada entrada de `commands`…» y commitea `4f0b4cb` sin parar | rojo (fila o molde: el THEN solo lista `libres`, `reservar`, `cancelar` y `anular`, y dejar `ayuda` fuera de `commands` esquiva el choque sin tocar el «No entra») |
| k3 | K3 | deja el AND en `spec.md` y la enmienda `sin aprobar`, pero no commitea ni abre ✋: retiene el commit hasta ver el humo verde, y el `claude` del PATH es un stub | rojo (sujeto, con el stub del montaje de fondo) |
| a3 | A3 | decide bien (`Ruling:` «h0 da 3/3 limpios», commit `9898647`) y para solo porque no puede lanzar el humo `h1` GREEN | rojo por la letra (montaje: el stub de `claude`) |
| cp1 | Cp1 | reparo: `Copia: 9172473 feat(skills): …` literal de `git log -1`, pero antes del 🦆 y no como primera línea del ✋ | verde con reparo |
| sp1 | Sp1 | reparo: O2 «no cumple tal como se definió» y O4 «cumple», donde la fila pide «no medido»; el sujeto sí los midió (63,8 MB frente a 62,6 MB; 1.000 reservas) | verde con reparo (fila: asume que el sujeto no mide) |
| r3 | F | reparo: 9/9 antes y después, sin RED falso; la fila dice 5/5 | verde con reparo (fila desactualizada: el molde 3.0.0 trae 9 tests) |
| p4 | P4b | reparo: «no escribí nada, como pediste» y nombra el test que prevé el plan, sin nombrar la constitution; sin commit y con la Task 1 abierta | verde por poco |
| g1, o2, w4 | G1, O2, Wc | reparos de forma: sin enmienda porque recomienda escribir el test; plantilla de la ruta en la línea entera; apertura y gate en llamadas separadas | verde |
| u1 | U1r | despacha `sdd-kit:effort-medium` `model=sonnet` y su ✋ trae los hallazgos; el encargo no se puede leer | verde con reserva |
| h2, r4, u1, u2, sp1, t6 | L | inglés en informes de subagentes, en dos narraciones del implementador («My escape got eaten by the heredoc…», «RED confirmed. Now the rewrite.») y en dos encabezados del mensaje final («## Rulings I made», «## Deferred minors») | verde con reparo |

Verdes con su prosa leída: sp2, sp3, r1, r1b, r2, r5, h1 y h2 (A, N, S; W: `Workspace del plan` sin «retomo», correcto en un arranque limpio), r4, u1 (U1, U2), u2, t1a a t6, p1, p2, p4o, cs1 (CS1, CS3), ml1 (ML7: RED antes de tocar `src/`), w1 a w4, k2, g1a, g2, d1, a1, k4, k4r, a2, a4, b2, b3, fr1, n1, e1, o1, pt1, pt1b, pt2, pt3, rt1, f2; P4a y P4c en p4 y p4o.

Resumen: 52 verdes de 59. Rojos: `k1` (fila o molde), `k3` (sujeto), `a3` (montaje); `b1` sin evidencia. U1, U1r, ML7, CS1 y la fila W, que salieron rojas en tandas anteriores de esta rama, salen bien.

## Control de los rojos de la batería de release (kit de develop 6418f13e y repeticiones con el de la rama)

Moldes y filas de la rama en los dos kits: el control con `develop` dice si el rojo ya estaba antes de la 0152. Lo sin RESULTADO y los rojos de N = 1 con n mayor se repiten con el kit de la rama (85905542), con la n de su batería.

| Escenario | Rama | Control | Lectura |
| --- | --- | --- | --- |
| `sdd-propose:x1` | 1/2 (x1-2 entra por `sdd-roadmap`) | develop 2/2 | la tabla de `using-sdd` manda a `sdd-roadmap` lo que el criterio de partir partiría, y `sdd-propose` propone partir: las dos entradas caben; la rama no cambia ninguna descripción. Ruido sobre una contradicción previa |
| `sdd-grilling:u1` | 0/1 | develop 0/1 | previo: «pensemos…» no está en la fila de `sdd-explore` de las puertas |
| `sdd-archive:pk1` | PK2 1/2 | develop PK2 1/2 | previo (sujeto: parafrasea la línea fija) |
| `sdd-verify:c1`, `c2` | prosa 1/2 y 0/2 | develop: máquina verde; c1-2 para sin re-revisión, y en c2 ningún ✋ lleva `sin revisar: <sha> — …` | previo; la rama no toca `closing-the-review.md` ni `final-review-check.md` |
| `sdd-init:n5` | 0/1 y 0/1 (ofrece migrar antes de la init) | develop 1/1 y 1/3 | previo: el aviso de arranque ofrece migrar antes de la primera petición, y el molde `template` declara `version` 1.1.0 sin clave `init`; la rama solo quita del aviso la frase de `unattended`, y el molde no fija perfil |
| `sdd-propose:k6` | 0/2 (k6-2 sin RESULTADO) | rama 2/2: las dos líneas `Gate:` nombran cada tarea, y `rooms:test` sale una sola vez, como corrida | ruido |
| `sdd-archive:v1b` | sin RESULTADO | rama 1/1 | ruido |
| `sdd-implement:b1` | sin RESULTADO | rama 2/2 | ruido |
| `sdd-roadmap:m2` | 0/1 | rama 2/3 (umbral 2/3; m2-1 entra por `sdd-propose`) | verde en su umbral |

`sdd-explore:e3` no va al control: el lector lo da por escenario contradictorio con la tabla de puertas y con la nota de su propia batería. `sdd-verify:rm3` tampoco: RM3, la conducta, pasa 2/2, y RM3h falla por su regex.

Resultado: ningún rojo de la batería de release es regresión de la rama. El único rojo que causó la rama fue la fila K8 de `sdd-archive`, que medía mal y se quitó.
