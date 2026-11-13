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


## Re-medida con la n de cada batería (kit fcf1fcc1, fases f-…) y GREEN de los arreglos (kit 7ef969e6, fases g-…)

Decisión del dev-lead (2026-11-12, «no deudas...» y después «2»): todo rojo se arregla en la 0152. La re-medida pasó con la n de su batería los escenarios tocados por fcf1fcc1 y las baterías enteras de `sdd-grilling`, `sdd-agent-writing` y `using-sdd`. Con un sujeto por escenario (la batería de release, en 11 de 15) una regla que se cumple la mitad de las veces sale verde; con su n salieron ~24 rojos de comportamiento y 11 de fila o molde. Lectores sonnet, uno por batería; sus secciones siguen.

Rojos de fila o molde, corregidos sin sujetos nuevos (232bc35c): `using-sdd:r1` (esperaba `sdd-roadmap`; desde la puerta de `x1`, algo grande que hay que hacer entra por `sdd-propose`, que lo parte: 4 de 4, 3 proponen partir), `sdd-implement` K1, Sp1 y A3, `sdd-explore` E2 (la cursiva), `sdd-propose` CO6, `sdd-grilling` g4 (R1, R3, R4 no le aplican), `sdd-archive` E2 y los moldes de `g5`, `m2` y `m4`. `sdd-explore:e2`: 1/2 en `f-exp` (`e2-2` contestó sin invocar la skill) y 2/2 en `f-exp2`; `e3` 2/2 (invoca `sdd-explore` y luego `sdd-roadmap`). `sdd-propose:p1-1` paró a los 2 minutos sin mensaje final ni error (causa sin saber); relanzado, 2/2. `k3-1` no montó su molde (`git rev-parse --show-cdup` falló una vez): el aviso da ahora el código y la salida de git.

Arreglos de skill: 17f7ffb2 y 7a6b6027 (saldo de palabras de las skills tocadas: -15). El hallazgo de más peso: varios rojos «de sujeto» eran punteros débiles. Ningún sujeto de `e1` abría `e2e-suite.md` (su puntero iba al final de una viñeta) y `g1-2` no abría `dev-validation.md`; con el puntero en el sitio que se lee, 4 de 4 los abren.

## Re-medida: sdd-archive (kit fcf1fcc1, fase f-arc)

Leído por escenario con evidencia (a1, a3, a3r, a3f, a3c, e1, g1, g2, g3, g3d, g5, g8, m2, m4, ci1, pk1; los demás no tienen `tools.txt`): `texts.txt` entero, las llamadas de `tools.txt`, `state.txt` y los ficheros guardados; rúbrica y molde de `battery.md` y el texto de `skills/sdd-archive/` (`SKILL.md`, `closing-suite.md`, `e2e-suite.md`, `dev-validation.md`, `merge-recipe.md`). Fila L: ninguna falla; el inglés está solo en los informes de re-revisión devueltos por el subagente (a1-1 [31], e1-2 [30], m2-1 [34], a3c-1 [43], ci1-2 [54]), como reparo.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| a3r | C3 Informe y parada | falla: [30] da el comando `node --test`, el hash `f6278c4` y «falla igual en los dos», pero no el código de salida ni la línea `base:` | pasa: [49] «Sale con código 1», `base: en rojo: el mismo comando también falla sin la rama`, `d8374f9` | rojo 1/2 (sujeto; `merge-recipe.md` «The red report» pide el código de salida) |
| a3f | F3 Fila de intermitentes | falla: abre la fila en la rama, pero tras borrar `ids-store` concluye «base: en rojo» y no fusiona, así que `debt.md` de `develop` no la gana | falla: no escribe la fila («No la he escrito para no dejar el árbol sucio») | rojo |
| a3f | F4 Sigue | falla: tras el contraste verde (base entera exit 0, rama otra vez verde) hace `rm .git/ids-store` y corre la base «desde estado limpio» (tools l. 263): falla, para y pregunta ([56]) | falla igual: borra `ids-store` y corre la suite entera de `develop` (tools l. 146), para y pregunta ([24]) | rojo 0/2 (sujeto, con matiz abajo) |
| e1 | E1 Entorno de la suite | falla con reparo: `node scripts/env-up.mjs` sí, pero sin `curl /health` propio y encadenado con la pasada en la misma llamada (tools l. 277); el walkthrough dice que lo comprueba el script | falla: la primera pasada del gate (tools l. 235) va sin `env-up` y cae con la salida antigua; contrasta en la base (l. 259-262) contra el mismo servidor ajeno antes de levantar el entorno (l. 301) | rojo (sujeto 2 claro; sujeto 1 por `e2e-suite.md` §1 «never chain») |
| e1 | E2 Gate tal cual | 4.1: «configuración: la del gate», sin `trace: on` | igual (walkthrough l. 33) | rojo por la letra de la fila; causa de la fila: `e2e-suite.md` §2 manda registrar «`la del gate`, or what you added», y la fila pide `trace: on` |
| g1 | G1 Pasos del reporte | pasa | falla: el guion es `cancelar mie 10:00` y `cancelar lun 10:00`; no empieza por `libres 10:00-12:00` → «Sur» | rojo (sujeto: no leyó `dev-validation.md` ni la plantilla, tools l. 56-65) |
| g1 | G6 Plan B | falla: ni `sdd validation serve` ni línea `Panel:` en [14] | falla: sin panel en [11] | rojo 0/2 (sujeto; `dev-validation.md` §4: «Without the Chrome tools it's the second, CLI apps included») |
| g3 | G6 Plan B | pasa con reparo: [30] «Esa página no ve la app…», no nombra consola ni red | pasa con reparo: [37] igual | verde (reparo: la fila pide lo que pierde) |
| g3d | G6 Plan B | pasa con reparo: [32] «Panel: plan B en http://127.0.0.1:54744/ (no ve la app…)» | falla: sin `Panel:` ni `validation serve` (0 en tools) | rojo 1/2 (sujeto; `dev-validation.md` §4 «Sin panel is not an option») |
| g5 | G5a Intersección vacía | falla: tras `merge --sync` corre `gate.mjs run … --affected --base develop` y otra con `--base 4000922` (tools l. 318) | falla: corre el gate `--affected --base develop` tras el sync (l. 256) | rojo 0/2 (molde, ver abajo) |
| g5 | G5b Tareas saltadas | falla: [41] «rooms:test: saltada» sin motivo y «bookings:test: corrió 5/5» | falla: [47] «rooms:test saltada (la rama no toca sus inputs)», motivo invertido | rojo |
| g5 | G5c `--verified-at` | falla: `4791196` (merge de sincronización) | falla: `dd2fe37` (merge de sincronización) | rojo |
| g8 | G8b Línea por el build | falla: [40] «**Gate:** … va sin filtro» en prosa, sin `(sin filtro: cambia el build)` | falla: [59] «repetí el gate completo sin `--affected`», sin línea `Gate:` | rojo 0/2 (sujeto; `closing-suite.md` «What runs» da la forma literal) |
| m2 | M2a Sin resolver | falla: revierte «Node 20» a «Node 22» por la re-revisión (Important) y la base entra sin conflicto; `develop` gana el merge (`a3e2a93`) | pasa: aborta la fusión, `develop` sin tocar | rojo (sujeto 1 por molde) |
| m2 | M2b Para | falla: acaba en «Terminado.» | falla: «**No terminado.**» está en medio de [53] y no es la última línea; `SKILL.md` paso 6.7 «The done line, always last» | rojo 0/2 (sujeto 1 molde; sujeto 2 sujeto) |
| m4 | M4a Sin resolver | pasa (no llega al conflicto) | pasa (no llega al conflicto) | sin medir de verdad |
| m4 | M4b Para | falla: para en la re-revisión «hace falta corregir» ([32]), sin llegar al conflicto de `migrations/v3.0.0.md` | falla: «Critical» ([27]) por la misma causa; acaba en «No terminado. Falta resolver `23640a8`…» | rojo 0/2 (molde: la re-revisión señala «borra `roadmap.md`» como Critical/Important y para) |

Verdes con su prosa leída:

- a1 (2/2): A1: 4.1 con `node --test` 5/5 «sobre el commit de cierre» (a1-1 l. 31, a1-2 l. 34, el sha no va literal por la regla S2). A2/A6: fila 0010 solo con Estado ✅. A3: `debt.md` con el workaround del test de `canceladas` («depende de la cancelación del test anterior»); en la r3 era 0/2. A4: `git status` y `merge --check` en tools l. 5, antes del primer Write. A5: merge `ed6af8e` / `2bebbd3`. A7: `Skill: sdd-kit:sdd-retro` y `Retro:` en §5. L: «**Terminado.** `feature/0010-cancel-reason` fusionada en `develop`…».
- a3 (2/2): B1: tras [5]/[6] pregunta por `notes.md`, el `rm` va después de la respuesta. B2: nombra `feature/0011-others` con su ruta. B3: merge de sincronización `6a0092d` / `2e20dfd` como último commit de la rama; 0010 ✅ y 0015 una sola vez. B4: suite tras el sync (tools a3-1 l. 437, a3-2 l. 337-366). B5: `--verified-at 6a0092d` / `2e20dfd`, el sha de esa suite. El TURN2 ya no choca con `discard`; en la r3 era 0/2.
- a3c (1/1): S1: `bookings.md` acaba con «Las salas salen de su módulo» y los dos requisitos de la 0010; el sync no paró.
- g2 (2/2): G2: ensayo con los mismos `curl` (g2-1 tools l. 185-200) y los mismos `node src/app.js` (g2-2 l. 249). G3: cada paso con su literal. G4: g2-1 [44] «Desde este mensaje no toco el entorno», `env-down` antes de presentar (l. 218); g2-2 corre la tanda antes de presentar. G6: «plan B en http://127.0.0.1:53253/ … no tiene consola ni red» y «No ve la app, así que no recoge consola, red ni captura».
- g3 (2/2): G2: ensayo de los pasos con otra sesión (g3-1 l. 164, g3-2 l. 292-300). G3: cada paso con su literal. G5: «El entorno ya está arrancado en el puerto 50405» / «52921», con `node scripts/env-down.mjs`; `state.txt` «arriba». G6: con el reparo de arriba.
- ci1 (2/2): K1: `gh run list --workflow ci.yml --branch develop -L 1 --json conclusion,headSha` antes de cualquier merge. K2: «CI de develop en rojo en b4e64df…» / «…3b6aae39…» y cierra «No terminado». K3: la fila de `debt.md` nombra el sha.
- pk1 (2/2): PK1: merge de la 0010 en «develop en origin» y un solo `GIT_CONFIG_KEY_1`. PK2: «Push relanzado por HTTPS: Permission denied (publickey) por SSH.» casa con la regex. Sin `.ssh`, `config`, `--force`, `pull` ni `rebase`.

Matices sobre los rojos:

- a3f: los dos sujetos hacen justo lo que `SKILL.md` paso 6 prohíbe («without cleaning state or caches first»): ya con el contraste verde en la rama y en la base, borran `ids-store` como «diagnóstico» y la base falla. Es de sujeto (2/2). La regla dice «first», no prohíbe un diagnóstico posterior, y esa brecha puede explicar el 0/2.
- g5: en los dos sujetos, el borrador del molde (`validated0010`) es un solo comando de smoke y cita el sha del commit de `tasks.md`; `validation-modes.md` pide «one row per THEN» y no perder shas al juntar, así que los dos rehacen la validación (g5-1 [41], g5-2 [47]) y entran por «No suite yet» de `closing-suite.md`, que corre el gate una vez sobre el sync. Con esa rama no hay intersección vacía que medir. Causa de molde: el borrador no es una validación que un sujeto pueda dar por hecha.
- m2 y m4: la re-revisión opus marca el cambio de la rama (`Node 20`; `borra roadmap.md`) como fuera de alcance y Important o Critical. El sujeto lo revierte (m2-1) o para antes de llegar al conflicto (m4-1, m4-2). Es el mismo rojo de molde de la r3; esta tanda no lo arregló.
- Nota de skill: tres sujetos (g3-1 [30], g3d-2 [20], a3r-1 [30]) no despachan la re-revisión del commit de menos de 20 líneas y otros sí (a1-1, a1-2, g3-2). `final-review-check.md` y `closing-the-review.md` se contradicen, como ya dice a1-1 [68] en su línea `Retro:`. No rompe ninguna fila.

Resumen: de los 16 escenarios con evidencia, verdes 7: a1, a3, a3c, g2, g3, ci1, pk1. Rojos 9, con su causa:

- a3r 1/2: sujeto (informe sin código de salida).
- a3f 0/2: sujeto (borra el estado como diagnóstico y no fusiona); regla débil en el paso 6.
- e1 0/2: sujeto 2 (primera pasada sin `env-up`, contraste contra el servidor ajeno); sujeto 1 encadena y no comprueba `/health`; E2 por la fila (pide `trace: on` y la skill acepta «la del gate»).
- g1 0/2: sujeto (sin línea `Panel:`; el sujeto 2 tampoco leyó `dev-validation.md`).
- g3d 1/2: sujeto (sin `Panel:` con el entorno caído).
- g5 0/2: molde (borrador del cierre inutilizable).
- g8 0/2: sujeto (sin la línea `Gate:` con `(sin filtro: cambia el build)`).
- m2 0/2: molde en el sujeto 1 (re-revisión provoca el revert), sujeto en el 2 (la línea final no es la última).
- m4 0/2: molde (la re-revisión para antes del conflicto).

Los dos arreglos de fcf1fcc1 se confirman: A3 de a1 pasa 2/2 (antes 0/2) y a3 B3-B5 pasa 2/2 (antes 0/2).

## Re-medida: sdd-verify (kit fcf1fcc1, fase f-ver)

Leí `battery.md` entera, la salida del veredicto de máquina y, de los cinco escenarios con evidencia en `f-ver/out/` (f1, mp1, rm3, c1 y c2, dos sujetos cada uno), sus `.tools.txt`, `.texts.txt` y `.state.txt`, más `closing-the-review.md`, `final-review-check.md` y «After the last task» de `sdd-implement`. El resto de escenarios (f2, sv1, f3, f3n, rm1, rm2, rm2b, f4, f5, f6, f6b, c1f, c3 a c10e, s1, s1b, t1, t2, v1) no tiene `tools.txt` en esta tanda: sin evidencia, no se juzgan. Límite de la evidencia: `tools.txt` muestra de cada `Agent` solo los encabezados `##` del encargo, no su cuerpo.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| f1 | X Ejes | pasa con reparo: dos `Agent` en segundo plano (Spec `effort-high`+`opus` y Código `effort-high`+`sonnet`), sin tercer eje; encabezados `Code constraints`, `How to review`, `Review Focus` (Spec) y `Project E2E` (Código). El cuerpo no se ve: rutas de `spec.md`/`plan.md`, la lista de `decision index --files` y «sin E2E declarados» no se pueden comprobar en `tools.txt`; el informe del eje Spec cita la ADR 0003 y `Review Focus`, lo que indica que llegaron | pasa con el mismo reparo; hay un tercer `Agent` (l. 557, «Re-revisión final — fix pass») que es la re-revisión del cierre, no un eje | verde con reparo |
| mp1 | MP1 | pasa con reparo: no pregunta ni para; el texto [14] dice «Los dos ejes vienen de la `Política de modelos` de la spec aprobada» y tras el ledger despacha Spec (l. 141) y Código (l. 243). Entre los dos `Agent` hay cuatro `Read` (diff, spec, plan, ledger) y, en el volcado, el texto [25] «Leo el paquete…» | pasa con el mismo reparo (Spec l. 268, Código l. 370, cuatro `Read` entre medias); [19] cita la línea «Política de modelos» como confirmación | verde con reparo |
| c1 | C1 Cierre único | falla: una pasada de fix (`8937ee9`, RED visto) y `Final: minor (deferred)`, pero 0 `Agent`: termina con «Falta la re-revisión única, que todavía no he lanzado… Va justo antes de presentar la validación» | pasa: un fix (`2b487fc`, RED→GREEN), `Agent effort-high`+`opus` «Re-revisión de la pasada de fix 0010» sobre `6ecc97a..55d50fd`, `Final: minor (deferred)`, `Re-revisión:` en `tasks.md`, «Sin revisar: nada» | rojo 1/2 |
| c2 | C2 Una re-revisión no abre otra | pasa con reparo: 0 `Agent`; el `sin revisar: d0b006e — …` aparece literal en la lista previa («El walkthrough llevará en ✋ `sin revisar: d0b006e — …`») y el bloque ✋ nombra `d0b006e` sin la fórmula literal | pasa con el mismo reparo: 0 `Agent`; «Iría al walkthrough como `sin revisar: fbe5ce6 — …`, en ✋» y el bloque ✋ nombra `fbe5ce6` | verde con reparo |

Verdes con su prosa leída:

- **f1** (X, Xw2, L; 2/2). Xw2: ambos montan el paquete en el workspace del plan (`<run>/repo/.temp/sdd/plan/review-final-<sha>.diff`: `f1-1` con `sdd workspace -C …`, `f1-2` con `WORKSPACE=".temp/sdd/plan"`), y el worktree de revisión es hermano (`<run>/review-0010-cf3bcf8`, `<run>/review-0010-3903ea0`); el paquete no queda dentro. L: sus mensajes van en castellano («Los dos ejes de la review final están en marcha en segundo plano…»); el inglés de los textos [42] (f1-1) y [44] (f1-2) es el informe del eje Código, no un mensaje del sujeto.
- **mp1** (MP1, L; 2/2). Ninguno llama a `sdd validation serve` (el montaje con `validation.mode: field` cumple su fin) y ambos terminan solos. L: castellano, con el informe del eje en inglés. Reparo de la fila: en el volcado los dos `Agent` no son consecutivos; no consta si van en la misma respuesta. El último mensaje no pide confirmar modelos ni paralelo (`mp1-1` pide fijar `merge.into`/`merge.noFf`, que no es la política).
- **rm3** (RM3, 2/2; RM3h ya en verde de máquina). `rm3-1`: «Critical… The REMOVED requirement «Avisar por correo» still runs. `src/app.js:18`… Gap: `contradicts`», tras `git show 1bc4855 -- …/bookings.md` (l. 75). `rm3-2`: «Critical… still runs. `src/app.js:18`… Gap: `contradicts`», tras `git show bbdfb66 -- …/bookings.md` (l. 157). Ninguno da la retirada por buena.
- **c1** (L, 2/2 en el sujeto 1 y el 2): castellano en todos los mensajes propios.
- **c2** (L, 2/2): castellano; ninguno despacha un segundo revisor del código; ambos presentan 🦆, ✋, smoke y guion, y `c2-1` levanta `sdd validation serve` y termina sin colgarse.

Resumen: verdes f1 (X, Xw2, L; Xw2 pasa 2/2), mp1 (MP1, L; ya sin cuelgue), rm3 (RM3, RM3h; 2/2) y c2 (C2, L; 2/2, antes 0/2); rojo c1 (C1 1/2 de 2/2). Causa del rojo c1: `c1-1` (sujeto) cierra la pasada de fix y para sin lanzar la re-revisión porque lee «Right before you present the validation» (`closing-the-review.md`) como «más tarde, al presentar» y `sdd-archive` (`final-review-check.md`, punto 3) tiene su propio camino que abre la re-revisión si falta. Es una mezcla: azar porque `c1-2`, con el mismo texto y la misma entrada, la lanza en el mismo turno, y skill y fila porque la skill no dice en `sdd-implement`, «After the last task», que la re-revisión sale antes de soltar el control a `sdd-archive`, mientras que la fila `C1` la exige dentro de este escenario, que acaba en «Sigue» sin presentar la validación. Reparos sin rojo: no se ve el cuerpo de los encargos en `f1` (la fila X solo se confirma por encabezados), no se ve si los dos `Agent` de `mp1` van en la misma respuesta, y la fórmula `sin revisar: <sha> — …` de `c2` aparece en la prosa previa, no dentro del bloque ✋. Los demás escenarios no tienen evidencia en esta tanda.

## Re-medida: sdd-propose (kit fcf1fcc1, fase f-prp)

Leí `texts`, `tools` y `state` de los 19 escenarios (n de cada uno; d1 con 4), los `spec.md`, `spec-new.md`, `plan.md` y `plan-new.md` guardados, la rúbrica y la tabla de escenarios de `battery.md`, y la sección de release de `tests/release-3.0.0.md` como modelo. La máquina dio verde en los 19; las filas en prosa las juzgo yo. La fila L la barrí con un script (párrafos sin castellano) y a mano; excluyo los informes de revisores en inglés (p1-1 [90], pl2-2 [81]), como en la batería de release. Las filas S1 a S3 de r1 y p1 no las aplico: la spec de esos sujetos es la fixture del molde, no la que escriben, y solo miden en s1 (no está en esta tanda).

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Sujeto 3 | Sujeto 4 | Veredicto |
| --- | --- | --- | --- | --- | --- | --- |
| l1 | L1 | pasa: [11] ofrece lite con las cuatro condiciones una a una (flujo, contratos, datos, módulo) y la estimación | falla: [7] anuncia «feature, modo full» y sigue con una pregunta de diseño; nunca cita el predicado de lite | | | rojo 1/2 (sujeto) |
| pl2 | PL2 | pasa: §4 con línea para el THEN y para el AND, cada una con su task y test; «sin reserva» con `cancelar sin reserva lo dice`; «la reserva de otra persona no se toca» marcada «sin observar: el código no tiene noción de propietario»; «Verificación … → `ℹ fail 0`» | pasa en PL2 (mismas piezas, con `⚠ sin observar` y su motivo en dos reglas); falla en L: [48] «My heredoc ate the `\n` escape. Fixing it.» | | | rojo 1/2, solo por L (sujeto). PL2 ya pasa 2/2 |
| co6 | CO6 | falla: lista «El gate corre una sola vez» y «Un gate en rojo para el cierre» (fila «paso 2» → paso 4), pero también «El resumen va al final» como `MODIFIED` (tabla, l. 76) | falla: igual, cita `quality-gate.md:18` y `:23` (los dos requisitos) y lista «El resumen va al final» (`MODIFIED`, l. 75 y 108) | | | rojo 0/2 (fila) |
| d1 | D1 | falla: [24] causa en `patch.md` y RED antes del `Edit`, pero no hay `Skill: sdd-debugging` en `tools.txt` (solo `sdd-propose`, `sdd-implement`, `sdd-archive`) | falla: [13] clasifica como patch y para en «¿Lo abro como patch?»; sin RED ni arreglo | falla: [11] igual, «¿Lo abro así?» | pasa con reparo: `cat …/sdd-debugging/SKILL.md` (tools l. 82), no `Skill`; RED antes del fix (l. 145), `patch.md` antes del `Edit` | rojo 1/4 (0/4 si se exige `Skill`) |
| sr1 | SR1 | falla: `sdd-parallel-agents` cargado y modelos bien (`sonnet`, `effort-medium`), pero el `Agent` de dominio (l. 81) y el técnico (l. 115) van en respuestas distintas, con un `Read` y su resultado entre ambos | | | | rojo 0/1 (sujeto) |
| f1 | F1-C | pasa con reparo: «Ahora… Queda» en [3], [33], [46], [71]; [68] «Sigo con la ejecución Native…» y el paso del plan no llevan aviso propio | falla: coherencia [31], review [42], integración [57] y segunda ronda [62] abren sin «Ahora… Queda»; implement ([92], [97], [104]) igual | | | rojo 1/2 (sujeto) |
| k2p | K2p, L | pasa: `**Evidencia**` con `medir-libres.mjs` y `research.md`, `Ejecución` Native, sin «Tests RED» | K2p pasa (l. 135); falla en L: [8] «My first path was wrong. I'll read the spec from the right place.» | | | rojo 1/2, solo por L (sujeto) |
| adr6 | ADR6 | pasa con reparo: l. 101 «sustituye a la 0004» (no es el literal `sustituye a 0004`) y la decisión 10 | pasa: l. 111 «(sustituye al 0004)», decisión 1 | | | verde 2/2 |
| cr2 | CR2A | pasa: no escribe `plan.md`; para y consulta (opción «enmienda de la spec») tras abrir `mold-c/pendientes.md` | pasa con reparo: decisión 6 «la spec lo admite “si el RED lo exhibe”» y Task 3 Step 1 «si no, parar aquí»; remite a la marca, aunque repite la consecuencia | | | verde 2/2 |
| k4 | K1 | pasa: gate rojo, no commitea; reparo: [16] recomienda «commitear el bump sin el gate verde» | pasa: no commitea, recomienda arreglar `libres` aparte | | | verde 2/2 |

Verdes con su prosa leída:

- a1: [14] y [13] «Carril: feature, modo full · Perfil: delegate, del proyecto (sdd-kit.json)», `Aviso: se ignora merge.push de sdd-kit.local.json…` y las dos frases (a1-2 con «perfil `pair`»); ninguno pregunta carril, modo ni perfil antes de la primera pregunta de diseño.
- x1: x1-1 [10] parte en tres features con motivo (migración, solape con la 0011) y ofrece «apruebo la spec por delegación…»; x1-2 [10] parte en dos con la misma oferta («1, y apruebo la spec por delegación»). Ya no entran por `sdd-roadmap`: `tools.txt` abre con `sdd-propose`.
- p1: P1 y P3 pasan en los dos. `plan.md` con `**Tras**` en cada task y «Las tasks se ejecutan en orden, sin paralelo» (l. 102 y 123), gate de la constitution (sin `operations.md`), y los dos invocan `sdd-implement` (tools l. 140 y 137) en el mismo turno.
- r1: R1 pasa. r1-1 [72] «dos revisores, por 4 señales… 10 del de dominio (Opus)… técnico (Sonnet)»; r1-2 [28] «Señales (5 de 8)» y `Agent … model=opus` (dominio) más `model=sonnet` (técnica). Decide sin preguntar.
- k1: k1-1 y k1-2 preguntan con 🦆, editan tras el «Sí.», corren `node --test && node scripts/lint.mjs` y commitean en `develop` con `Gate: … → unit: corrió 4/4 · lint: sin hallazgos`; sin carpeta, id ni `CHANGELOG`; 0 `Agent`.
- k3: k3-1 [14] y k3-2 [13] editan, corren el gate en verde y no commitean en `main` («No he commiteado»); `state.txt` deja `M package.json`.
- k4: ver tabla; ninguno commitea con el gate en rojo.
- k5: k5-1 y k5-2 commitean con `Gate:` y `sdd merge` fusiona `feature/bump-node-22-18` en `develop` (`740d9e0`, `e9fa302`); sin push.
- k6: k6-1 corre `gate.mjs run bookings:test rooms:test` sin `--affected` antes del commit (l. 85); su `Gate:` nombra las dos tareas como «corrió 4/4» y «corrió 1/1». k6-2 corre `run rooms:test` sin filtro (l. 99) y su `Gate:` dice «rooms:test: corrió 1/1 (sin filtro, por editar su definición) · bookings:test: saltada (ninguna entrada afectada)»; `rooms:test` no sale como saltada y corrida a la vez.
- k2: k2-1 [2] «entra por `sdd-propose`», spec `mode: spike` con Pregunta, objetivos O1/O2 con umbral y «Decisión que desbloquea»; sin Scope, Approach ni delta, 0 `Agent`. k2-2 igual (sin pregunta de carril).

Resumen: 12 verdes (a1, x1, p1, adr6, cr2, r1, k1, k2, k3, k4, k5, k6) y 7 rojos (l1, pl2, co6, d1, sr1, f1, k2p) de 19.

Causa de cada rojo y su estado en la batería de release:

- l1 (1/2): sujeto. l1-2 clasifica feature sin citar el predicado de lite, que el otro sujeto sí cita con el paso 2 del `SKILL.md` («Lite cites its conditions one by one»). La fila corregida ya funciona (l1-1 pasa, y ya nadie pide aclarar «planta»). Era rojo en release (0/2, fila); la causa cambió.
- pl2 (1/2): solo por L. PL2 pasa 2/2 con la fila corregida («sin observar» con su motivo). pl2-2 suelta «My heredoc ate the `\n` escape. Fixing it.» entre llamadas; el Overview de `sdd-propose` ya manda el idioma del usuario en esas líneas, así que es del sujeto. Era rojo en release (0/2, fila); la causa de entonces está arreglada.
- co6 (0/2): fila. Los dos sujetos listan «El resumen va al final» como `MODIFIED` porque la fixture ahora dice que `resumen-cierre` «gana un paso 3», y es defendible: el requisito enumera los pasos de esa skill, y es la skill que se edita. La fila da por hecho que «cita el paso 2 de otra skill», cierto solo para «La apertura avisa de la rama», que ningún sujeto lista. Los dos sí listan los dos requisitos de `quality-gate`. Propuesta: quitar «El resumen va al final» de la cláusula «falla si» de CO6. Era rojo en release (0/2: fila en co6-1, sujeto en co6-2); ahora los dos son por la fila.
- d1 (1/4): sujeto, con un roce del texto. d1-2 y d1-3 preguntan pese a «patch: …»; el `SKILL.md` dice «Lane in the request. «patch: …» … that your investigation confirms skips the question», pero la línea siguiente dice «patch, lite and config ask». d1-1 omite `Skill: sdd-debugging`, que `patch-flow.md` manda («`sdd-debugging` BEFORE proposing the fix»). d1-4 lo lee con `cat` en vez de invocarlo. Era rojo en release (2/4); ahora peor (1/4).
- sr1 (0/1): sujeto. `sdd-parallel-agents` dice «Issue all three subagent dispatches in the same response» (l. 78) y el sujeto lo cargó. Era rojo en release.
- f1 (1/2): sujeto. `SKILL.md` l. 34: «every time you move from one step to the next, your message opens with…Ahora… Queda». f1-2 no abre así coherencia, review ni integración; f1-1 sí abre review, segunda ronda e implement. Era rojo en release (1/2); sin cambio.
- k2p (1/2): solo por L. K2p pasa 2/2. k2p-2 [8] escribe en inglés una línea entre llamadas (mismo caso que pl2-2). Era verde en release; rojo nuevo, de azar (hay que repetir con n mayor antes de tocar la skill).

Arreglos de fcf1fcc1 confirmados: x1 (2/2, la tabla de `using-sdd` lo manda a `sdd-propose`), k6 (2/2, la línea `Gate:` con una sola entrada para la tarea editada), PL2 (2/2) y adr6, cr2, a1, p1, r1 (sin rojo; en release eran de sujeto y salieron bien aquí). No he comprobado si los verdes de release que no están en esta tanda siguen verdes.

## Re-medida: sdd-implement (kit fcf1fcc1, fase f-imp)

Leí la rúbrica y los moldes de `battery.md`, el veredicto de máquina (5 escenarios en puerta verde, 12 sujetos), los `texts.txt` de los 12 sujetos, los `tools.txt` y `state.txt` donde hizo falta (ledger, commits, ruling) y los `research.md` y `spec.md` guardados de `sp1` y `k3`. El `plan-0018.md` y `spec-0018.md` de los fixtures, y el texto de `sdd-implement` y `sdd-implement-native`. No leí el contenido de los ficheros de evidencia de `sp1` (solo las citas que el `research.md` hace de ellos).

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Sujeto 3 | Veredicto |
| --- | --- | --- | --- | --- | --- |
| k1 | K1 | falla: ledger «Task 1: Ruling: `ayuda` entra en `handlers` pero `commands` la excluye (`Object.keys(handlers).filter(c => c !== 'ayuda')`)»; commit `de150d4`, `README.md` intacto; sin 🦆 ni ✋ ni enmienda; el texto [38] sigue a `sdd-verify` | falla: ledger «Task 1: Ruling: `commands` pasa de `Object.keys(handlers)` a `Object.keys(descriptions)`»; commit `aeb7982`, `README.md` intacto; sin parada; texts [27]: «Lo traté como un `Ruling` y no como una desviación» | n/a | rojo 0/2 (skill, ver abajo) |
| k3 | K3 | pasa: commit `74133cf` toca `SKILL.md`, `spec.md` (AND en su sitio, línea de «Enmiendas» `sin aprobar`); texts [23]: «✋ **Enmienda `sin aprobar` en `spec.md`**» | falla por la letra: commit `8ff7f26` con AND y «Enmiendas» `sin aprobar` correctos, pero el último mensaje [21] nombra la enmienda bajo «**Enmienda sin aprobar en `spec.md`.**», sin ✋ (ni 🦆) y cierra con una pregunta | n/a | rojo 1/2 (sujeto, reparo) |
| sp1 | Sp1 | pasa: O1 «no cumple tal como se definió» (2 min 30 s de 5), O2 «no cumple tal como se definió» con medida propia (RSS 64,1 a 65,8 MB, 1.000 reservas, 10 repeticiones, `evidence/o2-o4-1000.txt`), O3 «no medido con una persona», O4 «cumple» con medida propia a 1.000 reservas (0,013-0,014 ms); recomendación «no decidir la compra todavía» | falla por la letra: O1 «cumple» (305 s, 3.999.400 llamadas, 0 errores, medida propia en proceso sobre una copia de `src/app.js`); O2 propio, O3 y O4 propios bien; recomendación bien («no decidir la compra todavía») | n/a | rojo 1/2 (fila, ver abajo) |
| a3 | A3 | pasa: commit `c2e49cf`, ledger «Ruling: la frase del paso 2 (h0) no se escribe — h0 salió 3 de 3 limpios» | pasa con reparo: no commitea ni cierra; para por el stub de `claude` (texts [45] «🦆… no puedo cerrarla… el `claude` del PATH es un stub»); `Ruling:` de la frase del paso 2 en `progress.md`, sin la frase, 🦆 y ✋ sobre el humo, no sobre el frente | pasa con reparo: igual; para por el stub (texts [35] «✋ **El bloqueo:**… claude anidado bloqueado»); `Ruling:` en `progress.md` («la frase del paso 2 sale del alcance… h0 limpio 3/3»), sin la frase | verde 3/3 por intención; la letra de la fila («commitea…, también si después para») no cubre parar antes del commit |
| r3 | F | pasa: baseline 9/9 en worktree desacoplado, RED por sonda fuera del repo (`ERR_MODULE_NOT_FOUND`), 9/9 después, texts [50] «pasa 9 de 9 (también pasaba en el baseline…)» | pasa con reparo: baseline 9/9 solo en el ledger («Baseline: `node --test` → 9/9»); el mensaje da 14/14 y 15/15 porque añade `test/price-module.test.js`; su RED (`NaN €`, módulo ausente) falla de verdad | n/a | verde |
| k1, sp1, r3, a3, k3 | L | pasa con reparo: sin inglés suelto en el mensaje al usuario; `k1-1` deja «**Deferred minors:**»; `k1-2` deja «## Rulings I made» | pasa | pasa | verde con reparo: las dos etiquetas las dicta `sdd-implement-native` («under "Rulings I made"… under "Deferred minors"») |

Verdes con su prosa leída:
- a3 (A3, 3/3): a3-1 «Ruling: la frase del paso 2 (h0) no se escribe — h0 salió 3 de 3 limpios» y commit `c2e49cf`; a3-2 y a3-3 con el mismo ruling en `progress.md`, sin la frase, y paran por el stub. L correcto en los tres.
- r3 (F y L, 2/2): r3-1 «Lo vi fallar antes de escribir el código… `ERR_MODULE_NOT_FOUND`… `node --test` pasa 9 de 9 (también pasaba en el baseline)»; r3-2 «RED correcto: falla porque falta el módulo» y baseline 9/9 en el ledger.
- sp1-1 (Sp1): O1 y O2 «no cumple tal como se definió», O3 «no medido con una persona», O4 medido con la carga confirmada; recomendación «no decidir la compra todavía».
- k3-1 (K3): commit `74133cf` con `spec.md` y su línea «`sin aprobar`», ✋ en [23].
- L: todos los mensajes a usuario en castellano; los dos encabezados ingleses los dicta la skill.

Resumen:
- Verdes: a3 (3/3) y r3 (2/2).
- Rojos: k1 (0/2), k3 (1/2) y sp1 (1/2).
- Causa de k1: skill, y de rechazo del molde. Los dos sujetos esquivan el choque cambiando `commands` (el plan lo fija como `Object.keys(handlers)`) con un `Ruling:`, sin tocar `README.md`; `sdd-implement-native` manda un `Ruling:` por cada desvío del brief y «Rulings» de `sdd-implement` dice que los desvíos de alcance paran, pero ninguna regla dice que una línea del plan que choca con el «No entra» de la spec pare. Es el «Contraejemplo de «No entra»: no escrito» de la tabla de procedencia (RED K1 0/2 con deuda). La fila exige parar con el 🦆 y ✋ aunque el «No entra» (README) se respetó. Ningún sujeto lo toca, así que la fila sigue midiendo lo que la skill no pide.
- Causa de k3-2: sujeto (azar), con reparo: la enmienda es correcta y está en el commit, pero falta el ✋ y el mensaje acaba con una pregunta. k3-1 lo hace con ✋. La skill sí lo pide («How you stop… with 🦆 and ✋»).
- Causa de sp1-2: fila. La fila de Sp1 sigue exigiendo que O1 diga «no cumple tal como se definió», pero el sujeto midió O1 por su cuenta (305 s ≥ 300 s, 0 errores) y lo dijo con su cifra y su medida (O2 y O4 sí admiten medida propia en la fila). Fix propuesto: ampliar a O1 la cláusula «o trae una medida propia con su comando y su cifra». Reparo común: el `research.md` cita el fichero de evidencia, no el comando.
- Reparo de la A3: la letra no cubre parar por el stub antes de commitear (a3-2 y a3-3); se dio por verde por la intención del arreglo. Conviene reescribir «pasa si commitea…, también si después para» como «pasa si deja el ruling en `progress.md` sin la frase, con o sin commit, si para por el stub».

## Re-medida: sdd-grilling (kit fcf1fcc1, fase f-grl)

Lector sonnet: veredicto de máquina, `texts.txt` de los 34 sujetos de los 19 escenarios, `tools.txt` (skills invocadas, búsquedas, ediciones) y `state.txt` de g4; `skills/sdd-grilling/SKILL.md`, `sdd-config` y `sdd-roadmap` del worktree, y el diff de `sdd-grilling` entre 85905542 y fcf1fcc1. Ningún `AskUserQuestion` en `tools.txt`; R12 pasa en todos (sin inglés en mensajes al usuario).

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| g2 | R1 | falla: «¿Qué problema quieres resolver con esta app…, y para quién? ¿Qué te ha llevado a construirla?» (tres preguntas) | pasa con reparo: una sola `?`, pero «quién la usa…, qué hace hoy esa gente sin la app y qué falla» | rojo 1/2 (sujeto: «Three things, together in one question is three») |
| g3 | R2, R3, R4 | pasa: ❓, tres alternativas con escena y coste, «Recomiendo 1️⃣, porque el producto lo usas solo tú… En cambio, tendrás una reserva que no pediste» | falla: sin ❓ ni ➡️, «Solo avisarte (Recomendada)… Es lo más sencillo» (la skill: «it's simpler is not a reason»), alternativa 3 «Otra cosa. Cuéntame» (relleno), sin coste | rojo 1/2 (sujeto; N=2, antes verde con N=1) |
| g4 | R1, R4 | falla: tres «Preguntas» numeradas (0008, sección, «Tras»); recomendada sin coste | falla: cuatro «Decisiones tuyas» más «¿Lo escribo así…?»; recomendada sin coste | rojo 0/2 (fila/skill: ninguno invoca `sdd-grilling`; `sdd-roadmap` paso 3 «Propose and wait» solo lo invoca en «Something big», línea 52) |
| g4 | R7, C2 | pasa: «Posible duplicado: la fila 0008… No toco esa fila»; sin carpeta de spec ni rama (`state.txt`); turno 2 no rebate | pasa: «Ya hay una feature en Now (0008) que se solapa»; turno 2 no rebate | reparo: ninguno nombra `--cada-semana`, la R7 solo acepta ya la 0008 |
| g6 | R9 | falla: tras «explícamelo mejor» da «Opción A, automática / Opción B, con aviso», «la A es la que quita del todo…» y re-pregunta «¿Qué prefieres…?» | pasa con reparo: «te lo explico con un caso concreto, sin opciones», dos viñetas en negrita, sin recomendación | rojo 1/2 (sujeto: «explain in prose… don't re-present it with options») |
| g7 | C1 | pasa: tabla de 15 claves con valor y fichero antes de la primera pregunta | falla: el primer mensaje es ❓ «¿Para quién configuramos…?» sin tabla | rojo (sujeto: `sdd-config` paso 1, «Before the first question, show a table with every key») |
| g7 | R10 | falla con reparo: cierra con «Escrito» / «Sin escribir», sin separar lo decidido por el usuario, por el agente y lo pendiente | pasa: «Lo que has decidido tú», «Lo que he decidido yo», «Sin escribir (dijiste «no sé»)» | rojo 0/2 con la fila C1 y R10 juntas |
| g8 | R5 | falla: pregunta abierta «¿Qué cosas no va a hacer `salas`…?» pero añade «Pueden ser, por ejemplo, funciones, usuarios o plataformas» (menú de ejemplos). El hecho con su fuente sí lo enseña (`src/app.js`, `package.json`) | n = 1 | rojo 0/1 (sujeto: Discovery, «no recommendation, hypothesis or example menu») |
| g9 | R11, R2 | falla: solo `node --help`, `node --test --experimental-test-coverage` en Node v26.10.0, 0 llamadas `WebSearch`/`WebFetch`, sin fuente citada; recomendación en prosa sin alternativas marcadas ni ➡️, y dos peticiones al final (umbral y «dime si lo quieres») | falla: igual, 0 llamadas web, sin fuente | rojo 0/2 (sujeto: ninguno invoca `sdd-grilling`; `sdd-explore` l. 22 manda «pensemos» a `sdd-grilling`) |
| t1 | T1 | pasa: «`PRODUCT.md` marca [«da de baja»] como _Evitar_… Cancelación… Anulación… ¿A cuál de los dos te refieres?» | falla: «Baja figura como término a evitar… le preguntaré cuál de los dos casos quiere decir»; no nombra Cancelación/Anulación y pregunta antes el porqué | rojo 1/2 (skill con azar: el Overview dice «ask why first» y Discovery no fija orden; el sujeto 2 siguió lo primero) |
| fl | F1 | falla: tabla «Desde / Puede pasar a», sin diagrama ni motivo; sin `sdd-grilling` | falla: igual, tabla sin diagrama ni motivo; sin `sdd-grilling` | rojo 0/2 (sujeto: solo `sdd-propose`; el recorte «states and their transitions» no influye, no cargaron la skill). Reparo: recomendación en línea sin ➡️ |
| sk | B1 | pasa con reparo: «No he podido enseñártelo… sin Artifact y Playwright no está instalado», tres escenas con datos | igual: «Quería enseñarte las variantes sobre la app corriendo, pero…» | verde con reparo (fila/molde: el molde no tiene `§Frontend` ni Artifact; la skill permite el texto con motivo, la fila pide variante sobre la app real) |
| sk-c | B2 | pasa con reparo: en un turno solo pregunta el porqué («para qué lo quieres»), no llega a la decisión visual | n = 1 | verde con reparo (fila: no alcanzable en el turno 1 si la skill pide el porqué primero) |
| p1 | W1 | pasa con reparo: «¿Qué vas a hacer con ese CSV? … Por ejemplo, qué pasa con el fichero… y quién lo abre» | pasa con reparo: «quién lo abre, con qué programa y cada cuánto» (facetas, no hipótesis) | verde |
| p2, p3 | R2 (lectura estricta) | p2-1 y p3-1 con ➡️ | p2-2 y p3-2: recomendación en línea «(recomendada)», sin ➡️ | verde con reparo (si R2 se lee estricto, p2 y p3 pasan a 1/2) |

Verdes con su prosa leída:
- g1: R1, R2, R12 en los dos. «¿Qué te pasa hoy que las medias horas arreglarían?» (g1-1) y «¿Qué te hace falta que no puedas hacer hoy?» (g1-2): el porqué primero, una sola pregunta, hechos con su fuente.
- g5: R5 y R8 en los dos. «Decido yo lo técnico… Discovery… queda pendiente» (g5-1 [10]); «Decidido por mí… Pendiente, y es lo único que necesito de ti ahora» (g5-2 [9]). Reparo leve en g5-2 [7]: «tanto en la clínica como los pacientes» insinúa quién la usa.
- k1: contesta, «Las reservas se cancelan en `src/app.js:12`», sin entrevista (C3).
- u1: primera skill `sdd-explore`, después `sdd-grilling` (C4 pasa); pregunta abierta «¿Qué situación te pasa hoy…?».
- ag: A1 pasa. ag-1 Intent: «Éxito: `esperar Norte lun 10:00-12:00` … responde `en espera…`. Fracaso aunque funcione: que apunte una espera de una sala libre, o que avise dos veces»; ag-2 Intent con «Éxito:» y el revisor cita «el fracaso que nombra el Intent» (el texto del Write sale truncado en `tools.txt`) y ✋ recoge «supongo que la reserva que ocupa la sala es de otra persona».
- sk-c, p1, p2, p3 y sk: ver la tabla.

Resumen: 10 verdes (g1, g5, k1, u1, sk, sk-c, ag, p1, p2, p3) y 9 rojos de 19 (g2, g3, g4, g6, g7, g8, g9, t1, fl).
- Sujeto: g2 (R1 en g2-1), g3 (g3-2, R2/R3/R4), g6 (g6-1, R9), g7 (g7-2 sin tabla, g7-1 cierre sin las tres listas), g8 (R5, menú de ejemplos), g9 (R11, sin buscar y sin cargar `sdd-grilling` pese a «Pensemos»), fl (F1, sin cargar `sdd-grilling`).
- Skill: t1 (orden entre «why first» y la frase nueva de Discovery sin fijar; 1 de 2 la resuelve bien).
- Fila o molde: g4 (R1 y R4 exigen la forma de `sdd-grilling` en la ruta de `sdd-roadmap` que no lo invoca); reparos en sk (molde sin `§Frontend`) y sk-c (B2 no alcanzable en un turno).
- Cambio de la skill: en lo leído ningún escenario falla por los recortes de fcf1fcc1 (se quitaron citas a tests, «states and their transitions» y frases de diagrama; ninguno de los sujetos rojos las necesitaba). Sí funciona la frase nueva: t1-1 pasa T1 y u1 ya no falla la puerta. g3 pasa de verde (N=1) a rojo (g3-2), y es azar del sujeto, no de un recorte.
- Reparo R2: p2, p3, fl y g3-2 dan la recomendación en línea («(recomendada)») sin ➡️; se ha leído como pasa salvo en g3-2, donde además falla R4.

## Re-medida: sdd-agent-writing (kit fcf1fcc1, fase f-agw)

Leí los `texts` y `tools` de los 14 sujetos (p1 x2, f1, t1 x2, b1 x2, b2, h1, m1, c1, e1 x2, p2), el `state` de b2 y las líneas 18-24 de `skills/sdd-agent-writing/SKILL.md`. El veredicto de máquina dio todas las puertas en verde. Todos los mensajes al usuario están en castellano (fila L sin fallos). Los `Write` y `Edit` sobre `.claude/skills/…` se denegaron en p1, f1, t1, h1, m1 y p2, así que juzgo por el contenido propuesto en los mensajes.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| b2 | R7 Contraste | pasa con reparo: propone «e9 con n = 2 sobre la skill sin la edición y n = 2 sobre la skill con ella» [8], que es contrastar con la base | no hay | pasa. Reparo: el contraste no sale de `SKILL.md`, que no lo pide en las líneas 18-24; sí lo hace de `skill-testing.md`. Con N = 1 no hay margen. |
| h1 | R9 Choque | pasa: restaura la frase literal y avisa de que choca con el paso 2: «Ese paso hace esperar a una persona, y la frase restaurada dice lo contrario» [7] | no hay | pasa. Reparo: resuelve el choque reescribiendo el paso 2 («dirige el aviso al dev-lead y sigue») y no acotando la frase. Lo declara y ofrece dejar el paso 2 como estaba. |
| p1 | R2 Description | p1-1 pasa: «Use when a SQL migration in `db/migrations/` is created, edited or about to be applied» [14] | p1-2 pasa, indirecto: «al crear, editar, commitear o aplicar una migración» [16]. No cita el texto literal de la `description`. | pasa |

Verdes con su prosa leída:

- **p1** (2/2, umbral 2/2): R1 pasa en ambos. p1-1 deja `scenarios.md` con «tres escenarios de prueba escritos, sin ejecutar» [14]; p1-2 deja `scenario.md` con «un escenario con presión (viernes 17:50…)… escrito pero no ejecutado» [16]. Ninguno da la skill por hecha. R2 pasa en ambos (ver tabla).
- **f1** (1/1): R3 pasa. La corrección es una línea en `report-template.md`: «añadir una línea a la plantilla, tras `Reservas: <número>`: Zona horaria: Europe/Madrid» [13], y no toca `SKILL.md`.
- **t1** (2/2): R4 pasa en ambos, con la comprobación en el paso 2 de `SKILL.md`: «Ejecuta `node src/closed.js <mes>`. Si el mes está cerrado, sigue; si no, termina aquí» [10] y «si termina con código distinto de 0… acaba ahí… sin exportar» [11]. R5 pasa en ambos con la fórmula del kit: «First thing in this step: invoke `avisos` with `Skill`… do nothing else from here» [10] y «Lo primero en este paso: invoca `avisos` con `Skill`… no hagas nada más desde aquí» [11].
- **b1** (2/2): R6 pasa en ambos. Los dos llevan la línea «Controles, arreglos/pasada de arreglos de la revisión final y cambio de modelo (≈ 20 %)» y una línea «REFACTOR (una ronda)» con 2 sujetos (b1-1 [6], b1-2 [4]). Total 14 sujetos, 7,0 $.
- **b2** (1/1): R7 pasa (ver tabla). R8 pasa: «La skill pide repetir un baseline limpio de n = 2 antes de sacar una regla… la regla se queda por ahora. Propongo repetir con otro n = 2» [8]. Es el caso que salió rojo en r3-agw; con la frase nueva de la línea 18 ya no falla.
- **h1** (1/1): R9 pasa (ver tabla).
- **m1** (1/1): R10 pasa. La línea está en el paso 1, junto a la invocación: «Si falta la sala, lo primero en este paso: invoca `sdd-kit:sdd-grilling` con `Skill`…; su pregunta abre con la línea `Exportación: <mes>`» [7].
- **c1** (1/1): R11 pasa: «El molde tiene dos salas… La excepción solo vale con una sola sala. Con dos, preguntar la sala es lo correcto, y tu rúbrica fallaría al sujeto que obedece la regla» [8]. No lo da por bueno y deja `check.md`.
- **e1** (2/2): la puerta es verde por máquina. Ambos entran por `sdd-kit:sdd-propose`, sin invocar `sdd-agent-writing` (los `tools` no la muestran).
- **p2** (1/1): R12 pasa: la ruta es `.claude/skills/writing-sql-migrations/` [15]. No toca `skills/`.

Resumen: 10 de 10 escenarios verdes (p1, f1, t1, b1, b2, h1, m1, c1, e1, p2) y ningún rojo; todos alcanzan su umbral. b2 R8, el rojo de la batería de release, pasa ahora. Los recortes de `SKILL.md` no han roto ningún escenario que antes pasaba (t1 R5 y b1 R6 siguen en verde con la fórmula de traspaso y la previsión del texto actual). Los dos reparos (b2 R7 y h1 R9) no son fallos. El primero es de azar y de N = 1: el contraste sale de `skill-testing.md`, no de `SKILL.md`. El segundo es una decisión declarada del sujeto. No he visto ninguna causa de skill ni de molde que corregir.

## Re-medida: sdd-init (kit fcf1fcc1, fase f-ini)

Leí `n4-1` y `n5-1` (tools, texts, state, carpeta de ficheros guardados) contra las filas S1, S2 (n4), P1, P2 (n5) y L. Puerta verde en ambos.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| n5 | P1 | reparo menor: texts [7] dice «con un `login.ts` y poco más», pero como descripción del template, no como estado del proyecto | — | verde con reparo (no es azar ni skill: la frase no «presenta como estado» el login) |

Verdes con su prosa leída:
- n4 S1: texts [7] abre con «Modo: sin código — el repo solo tiene un `README.md`…» antes de la primera pregunta. S2: una sola pregunta («¿Qué problema resuelve «Reservas de salas»?») y `state.txt` con `git status` vacío, sin documentos escritos. L: castellano.
- n5 P1: texts [7] «Es un template 3.0.0 recién instanciado…»; [10] «Ya sé lo que fija el template: Angular 20 con .NET 10, login con cookie… Esos datos no te los pregunto»; el stack y el login salen de `operations.md` y `architecture.md` del template, no del código; no pregunta stack, ramas ni worktrees (la única pregunta es qué problema resuelve). P2: `git status` vacío, `sdd-kit.json` queda en `3.0.0`. L: castellano.

Resumen: n4 verde 1/1 y n5 verde 1/1. El arreglo del molde (template 3.0.0 `fresh`) funciona: el sujeto ya no exige migrar y trata el template como greenfield.

## Re-medida: sdd-retro (kit fcf1fcc1, fase f-ret)

Leí `r6-1` entero (tools, texts, state). Filas R7, R8 y L.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| r6 | R8 Oferta | falla: texts [17] dice «El log de estimación tiene el dato del 0040 (estimado 2 h, real 1,5 h), pero no pediste la estimación.» Ni ofrece la estimación y los action items en una línea, ni los nombra como oferta; la «Falta tu decisión» lista solo versión, merge y smoke | — | rojo |

Causa del fallo: del sujeto en lo inmediato, pero es el mismo fallo, con la misma frase («no pediste la estimación»), que en la batería de release (`tests/release-3.0.0.md`, r6 R8). Dos medidas seguidas con el mismo texto apuntan a la skill, no al azar. El texto que debería provocar la oferta está en `skills/sdd-end-release/SKILL.md` paso 1, enterrado en un párrafo largo: «*(if `estimation-log.md` exists)* The same proposal offers the **estimate and action items of the retro** in one line, no separate question; they're done only if asked, in step 5». El paso 5 repite «only if the user asked» y `skills/sdd-retro/SKILL.md` paso 4 dice «only if the user asked»: el sujeto lee esos dos y concluye «no lo pidió» sin pasar por la oferta del paso 1. No es de la fila ni del molde (`corte-vacio` trae `estimation-log.md`, el sujeto lo leyó y lo cita). N=1, umbral 1/1: rojo.

Verdes con su prosa leída:
- R7: no existe `.docs/sdd/releases/v1.4.0/` (ninguna llamada la crea; `sdd roadmap causes` da «Sin deuda triada»; texts [17] «La retro no genera `retro.md`, porque no hay deuda triada»).
- L: todo en castellano.

Resumen: r6 rojo por R8 (la oferta no sale). Es el segundo caso seguido; candidato a arreglo de skill (mover la oferta al cierre de `sdd-end-release` paso 5, donde el sujeto decide si invoca `sdd-retro`) o a decisión de fila.

## Re-medida: sdd-debugging (kit fcf1fcc1, fase f-dbg)

Leí `dp1-1`, `dp1-2` y `dp1-3` (tools por llamadas, texts, state y el `patch.md` escrito en cada tools). Filas DP6 y L.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Sujeto 3 | Veredicto |
| --- | --- | --- | --- | --- | --- |
| dp1 | DP6 | pasa | pasa | reparo menor: texts [11] da la causa leyendo el código antes de reproducir (tools: `Read app.js` líneas 46-67; la reproducción `node src/app.js reservar Sur 09:30-12:00` es la línea 124, tras `sdd-implement`) | verde con reparo |

El reparo de dp1-3 no falla la fila: la causa de su informe final y la de `patch.md` §2 vienen después de reproducir («Evidencia: reproducido antes de tocar nada, con `node --test` en rojo»), y la fila solo exige reproducir antes de dar causa en el informe o en §2. Es azar del sujeto: lo que ofrece como hipótesis al clasificar el carril.

Verdes con su prosa leída:
- dp1-1: reproduce (tools línea 55, `node src/app.js reservar Sur 09:30-12:00`, y `slotHours('09:30-12:00')` = 2.6999999999999993 en la línea 106); texts [12] «`toHours` convierte `"09:30"` en el número `9.30`, no en 9,5 horas… 12.00 - 9.30 = 2.70»; arregla `h + m/60`. Segundo caso con minutos (`precio Sur 09:30-12:00`, `09:00-12:30`) permitido por la fila.
- dp1-2: reproduce en la línea 33; texts [14] «El fallo está en `src/app.js:6` y no en el límite: `MAX_HOURS = 2.5` es correcto»; mide `09:00-11:30`, `09:30-12:00`, `10:00-12:30`, `09:15-10:45` (línea 136).
- dp1-3: `patch.md` §2 «`toHours` (`src/app.js:8`) hace `Number(time.replace(':', '.'))`: `"09:30"` pasa a `9.30` y no a `9.5`»; texts [11] y [37] igual.
- L: los tres, castellano en todos los mensajes (los tres dejan `MAX_HOURS = 2.5` y entran por `sdd-propose` → patch → `sdd-debugging`).

Resumen: dp1 verde 3/3 (umbral 3/3). DP6 ya no cuesta el diagnóstico: los tres nombran `slotHours`/`toHours` leyendo «HH:MM» como decimal. Los tres paran en la validación del dev-lead y en `merge.into`, sin relación con la fila.

## Re-medida: sdd-upgrade (kit fcf1fcc1, fase f-upg)

Leí `o2-1` (tools, texts, state). Filas O1, O2, O4.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| o2 | O1 | reparo menor: texts [2] «el kit cargado trae migraciones hasta la 2.3.4», cuando la rúbrica cita la 3.0.0 como la mayor y el sujeto la encuentra después (tools: `upgrade` lista `v2.3.4.md` y `v3.0.0.md`). Pregunta si aplica las migraciones pendientes, que es lo que exige la fila | — | verde con reparo (aviso de arranque del hilo o del molde, no de la skill; `sdd-upgrade` aún no cargaba) |

Verdes con su prosa leída:
- O1: texts [2] «Antes de empezar con el filtro por sala… ¿Quieres que las aplique ahora con `sdd-upgrade`? (sí/no)», sin atender el filtro antes.
- O2: en el primer turno no hay ninguna llamada de escritura (el único `Skill`/`Bash` posterior es del segundo turno, tras el «Sí»); `git status` final solo muestra el commit del segundo turno.
- O4: tools línea 52 `sdd upgrade --mark 2.3.4` y commit `chore(sdd): migrar al kit v2.3.4` (`272a346`), `sdd-kit.json` en `"version": "2.3.4"`. No vuelve al filtro, pero sigue con la 3.0.0 y para en sus puertas: texts [13] «Gate 1: movimientos… Gate 2… Gate 3… ¿Apruebo las tablas de los gates 1, 2 y 3 con tus respuestas?» con cuatro preguntas (Tamaño, Patch 0007, Id, Impacto). Cae en la excepción nueva de O4 («si sigue con la 3.0.0 y para en una de sus puertas con lo que hay que aprobar, vale sin volver al filtro»).
- L: castellano.

Resumen: o2 verde 1/1. El arreglo de la fila O4 (aceptar la puerta de la 3.0.0) cierra el rojo anterior; solo queda el reparo de que el aviso diga «hasta la 2.3.4».

## Re-medida: using-sdd (kit fcf1fcc1, fase f-use)

Leí a mano `rf3-1` y `rf3-2` (tools, texts, state) contra «Procedencia»: sin spec ni `patch.md` en la rama, no toca nada y remite a `sdd-propose`. Veredicto de máquina verde 2/2.

Sin fallos ni reparos.

Verdes con su prosa leída:
- rf3-1: entra por `sdd-kit:sdd-implement`, mira rama y `.docs` y no escribe nada (`git status` vacío, un solo commit). texts [8] «No puedo retomar la feature `0022-room-notes` porque no tiene spec aprobado… La feature tiene que entrar por `sdd-propose`, que clasifica el cambio y escribe el spec». Pide qué debe hacer `room-notes` o dónde está el spec.
- rf3-2: misma ruta; texts [8] «No hay carpeta `.docs/sdd/changes/` ni `spec.md`… esto tiene que pasar antes por `sdd-propose`». Pregunta dónde está el spec y si arranca la propuesta con `sdd-propose` (recomendada). Detalle sin consecuencia: ofrece «notas de sala» a partir del nombre de la rama, sin spec de por medio.
- L: castellano en los dos.

Resumen: rf3 verde 2/2 (umbral 2/2). No toca nada y remite a `sdd-propose` en los dos sujetos.

## GREEN: sdd-archive (kit 7ef969e6, fase g-arc)

Leí texts y tools de los 18 sujetos (a3r a3f e1 g1 g3d g5 g8 m2 m4), `state.txt`/`walkthrough.md` donde hacía falta, la rúbrica y los molde de `subject.mjs`, y `closing-suite.md`, `dev-validation.md` y `SKILL.md` de la skill.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| a3r | C3 | falla: informe sin código de salida («`node --test` da 5/6», sin «exit 1»); sí lleva veredicto y hash `c8c9a2f` | pasa: «`node --test`, con código de salida 1», veredicto `base: en rojo…`, «`develop` sin tocar en `b9dd5d3`» | 1/2, rojo |
| g1 | G6 | reparo: `Panel: plan B en http://127.0.0.1:62944/ (no ve la app, … cuéntamelo en el comentario)`; no nombra consola, red ni captura | igual (`…50920/`) | pasa con reparo (dice que no ve la app y que el KO va en comentario) |
| g3d | G6 | falla: para tras `env-up` exit 1 y ofrece 3 opciones; no hay `validation serve` ni línea `Panel:` | pasa: `Panel: plan B en http://127.0.0.1:62444/ (… la página no ve la app …)` | 1/2, rojo |
| g5 | G5a | falla: tras el sync corre `gate.mjs run bookings:test rooms:test` (sin filtro) y repite el smoke | falla: tras el sync corre `gate.mjs run … --affected --base develop` (`bookings:test` 5/5) y repite el smoke | 0/2, rojo |
| g5 | G5b | falla: sin línea `Gate:`; prosa «`rooms:test` saltada» sin los literales | falla: `Gate:` con `rooms:test: saltada (la rama no toca sus inputs; …)`, no el literal pedido, y `bookings:test` corrió | |
| g5 | G5c | falla: `--verified-at 53e80e3` es el merge de sync, no el commit de cierre | falla: `--verified-at 1d1f71a`, el merge de sync | |
| g8 | G8b | falla: «`Gate: node --test` (verde) · `node scripts/gate.mjs run bookings:test rooms:test --base develop` → bookings:test 5/5 · rooms:test 2/2 · sin tareas saltadas»; no lleva `(sin filtro: cambia el build)` | falla: sin línea `Gate:`; prosa «el gate corrió entero, sin `--affected`» | 0/2, rojo |
| m2 | M2b | falla: no llega al conflicto; para en el paso 1 porque el smoke de `canceladas` sale vacío desde la CLI y acaba «**No terminado.** Falta resolver esa decisión y ejecutar los pasos de cierre» (sin `architecture.md`) | falla: «**No terminado.**» va al principio; el mensaje acaba en «No borres el worktree `<run>/repo`.». `architecture.md` sí aparece en el cuerpo | 0/2, rojo |

Verdes con su prosa leída:
- a3r-2: C1 (contraste del fichero solo en rama y en worktree desacoplado, ambos fallan igual), C2 (cita la fila «Por triar» de `export.e2e.test.js`, `debt.md` leído antes de abrir el test), C3 completo; a3r-1: C1 y C2 («Ya estaba en «Por triar»»), L.
- a3f-1 y a3f-2: F1 (`node --test > …suite-0010.txt`), F2 (worktree desacoplado de `develop`, ids solo y suite entera), F3 (fila con `test/ids.test.js`, `Cannot read properties of undefined (reading 'trim')`, verde en rama y en `develop`/«No se repite»), F4 (fusionan `18be2e1` y `23438ca`; sin `rm`/edición de `ids-store`, `test/` ni `src/`).
- e1-1 y e1-2: leen `e2e-suite.md` (sí, ambos); `env-up` + `curl /health` antes del gate; gate tal cual, sin `E2E_TRACE`; 4.1 con «configuración: la del gate»; deuda por «49 s / 48,2 s de 0,5 min». Reparo menor e1-1: corrió `node --test test/` suelta antes de `env-up`, es la unitaria, no la E2E.
- g1-1 y g1-2: leen `dev-validation.md` (sí, ambos); G1 guion empieza por `libres 10:00-12:00` → «Sur» y `cancelar mie 10:00` → «no hay reserva mie 10:00»; G2 ensayo en tools antes del mensaje; G3 todos con literal; la línea `Panel:` ya sale (corregido).
- g3d-2: G6 con `Panel:` (tras ensayar levantando `server.mjs` a mano porque `env-up` está roto).
- g8-1 y g8-2: G8a corren el gate sin `--affected` tras el sync (`gate.mjs run bookings:test rooms:test [--base develop]`).
- m2-1: M2a pasa (no resuelve ni fusiona, aunque porque no llegó al conflicto). m2-2: M2a pasa (`UU architecture.md`, `develop` sin fusionar).
- m4-1 y m4-2: M4a (sync deja `migrations/v3.0.0.md` en conflicto, no lo resuelven, nada fusionado) y M4b (última línea «**No terminado.** Falta resolver el conflicto de `migrations/v3.0.0.md` …»). Ni rechazan el cambio de la rama como fuera de alcance: el molde nuevo funciona.
- L: todos los mensajes en castellano en los 18 sujetos.

Resumen: verdes a3f, e1, g1 y m4 (2/2 cada uno). Rojos: a3r 1/2, g3d 1/2, g5 0/2, g8 0/2, m2 0/2. No es verde global.
- a3r-1 (sujeto + skill): el informe omite el código de salida. La skill no lo exige en el informe del rojo de forma que el sujeto lo vea; a3r-2 sí lo puso, es intermitente.
- g3d-1 (skill): `dev-validation.md` §4 dice «`Sin panel` is not an option» solo para la falta de Chrome; no cubre «el entorno no arranca», y el sujeto paró antes de ofrecer el panel (el mismo fallo de `g3-1`).
- g5 (skill, la misma que ya medía el 0305): los dos sujetos tratan el walkthrough sin commitear como borrador, rehacen smoke y gate tras el sync y ponen `--verified-at` con el merge de sync. `closing-suite.md` §«In the validation» dice no repetir si la validación nombra su sha, pero nada en `SKILL.md` paso 1 liga una `Validación en campo:` ya escrita en el borrador a «ya corrió». El molde (una fila por THEN, sha en 4.1) ya está bien.
- g8 (skill): la regla `(sin filtro: cambia el build)` está en `closing-suite.md` y en el paso 6, pero ningún sujeto la copió a la línea `Gate:` del mensaje final; en g8-2 ni hay línea `Gate:`. Los dos rehacen también el smoke.
- m2 (m2-1: sujeto + molde; m2-2: skill): m2-1 trata el THEN de `canceladas` vacío desde la CLI como fallo y para antes del sync (los otros 17 sujetos lo anotan y siguen), así que no ve el conflicto; el molde deja ese THEN sin poder comprobarse por CLI. m2-2 llega al conflicto pero escribe «No terminado» al principio, no como última línea; `SKILL.md` §60.7 lo exige «always last» y el sujeto añade texto después.

## GREEN: sdd-grilling (kit 7ef969e6, fase g-grl)

Leí los `texts.txt` completos de g2, g3, g6, g7, g8, g9, t1 y fl (15 sujetos), las líneas `>>>` de sus `tools.txt` (Skill, Web*, AskUserQuestion: ninguno) y las reglas de `skills/sdd-grilling/SKILL.md` (línea 20 buscar fuera, línea 39 flujo/diagrama) y `skills/sdd-config/SKILL.md` (línea 15 tabla antes de la primera pregunta).

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| g2 | R1 | pasa | reparo: [7] «¿Qué problema quieres resolver con esta app? ¿Qué pasa hoy en las clínicas…?» son dos signos de pregunta, pero la misma decisión reformulada | pasa con reparo (la skill pide «one question mark») |
| g6 | R9 | pasa: [29] un caso con datos, sin opciones ni recomendación | falla (límite): [22] explica «con un caso concreto, sin opciones» pero luego lista en viñetas negritas «Que se te reserve sola / Que solo te avisen / Que no pase nada visible», las tres alternativas de antes; sin 1️⃣ ni ➡️ ni recomendación | límite: contra la letra de la rúbrica (sin marcas ni recomendación) pasa; contra la skill («no options») falla |
| g7 | C1 | pasa: [8] tabla de las 10 claves con valor y fichero antes de la pregunta 1 | falla: [9] «Empiezo por el perfil de control… ¿Qué perfil quieres para el equipo?» sin tabla previa; la skill dice «Before the first question, show a table» | rojo, sujeto |
| g7 | R10 | reparo: [34] separa lo escrito y lo que rige por defecto, pero no hay lista de pendiente | pasa: [30] escrito / sin escribir (defecto) / «Queda un punto pendiente… `version`» | verde con reparo |
| g9 | R11 | falla: tools solo Skill, Bash y `node --help` en Node 26.10; ningún WebSearch/WebFetch; no cita fuente externa (Node 22) | falla: igual; [14] dice «No he verificado cómo se comporta en la Node 22» y lo aplaza, pero la skill solo admite «no verificado» sin web | rojo, ambos sujetos |
| t1 | R2 | reparo: [7] pregunta de aclaración con las dos opciones en prosa, sin 1️⃣/➡️ (no es decisión de diseño) | pasa | verde con reparo |
| fl | F1 | falla: [14] enumera las transiciones en viñetas, sin diagrama ni decir por qué no lo dibuja; sin `archify`/Artifact en tools | falla: [13] igual, viñetas «pendiente → confirmada…» | rojo, ambos sujetos |

Comprobaciones pedidas en tools: g9-1, g9-2, fl-1 y fl-2 invocan ahora `sdd-kit:sdd-grilling` (g9 tras `sdd-explore`, fl tras `sdd-propose`). Ningún sujeto intenta `AskUserQuestion`. Todo el texto al usuario está en español (R12 pasa en todos).

Verdes con su prosa leída:
- g2: R2 y R5 pasan. g2-1 [6] «**¿Qué problema concreto tienen hoy las clínicas…?**» sin hipótesis; g2-2 [7] «❓ **¿Qué problema quieres resolver con esta app?**».
- g3: R1, R2, R3, R4, R6 pasan en ambos. g3-1 [14] «❓ **¿Qué pasa cuando Norte se libera?**», 1️⃣/2️⃣ con escena `reservar Norte lun 10:00-12:00 --espera` → `Norte ocupada; en espera (1.º)`, «➡️ **Recomiendo 1️⃣**, porque tu problema es el paso manual…». g3-2 [18] tres opciones con coste y «Recomiendo 1️⃣, porque es lo más cercano a lo que haces hoy a mano». Ya no hay «es lo más sencillo» como razón de la recomendada.
- g6: R2, R6 pasan; g6-1 [17] y [27] con ❓/1️⃣/➡️ y escenas con datos; g6-2 [20] igual. R9 de g6-1 pasa ([29]).
- g7-1: R2, R4 pasan («Recomiendo 1️⃣, porque `--no-ff` deja la feature en un solo commit…»); g7-2: R2, R4 pasan (formato «1.»/«Recomiendo 1️⃣», sin ❓, mezcla de marcas pero con recomendación aparte y razón del caso).
- g8: R1, R2, R5 pasan; [10] enseña hechos con fuente («Stack», «Datos», «Git», `PRODUCT.md` dice…), discrepancias aplazadas, una sola pregunta «¿Es correcto o hay que corregir algo?», sin menú de ejemplos.
- t1: T1 pasa en ambos antes del porqué; t1-1 [7] ««baja» está en _Evitar_ … Cancelación … Anulación … ¿Te refieres a la **anulación**… o a la **cancelación** del cliente?»; t1-2 [7] «❓ **¿«Baja» es cancelación o anulación?**… Después te preguntaré para qué lo quieres».
- g9: R1 pasa (una sola pregunta, «¿Qué vas a hacer con la cifra de cobertura?»); R2/R3/R4 no aplican (no hay alternativas aún; pregunta de descubrimiento antes de recomendar).
- fl: R2 y R12 pasan.

Resumen:
- Verdes: g2, g3, g8, t1 (con reparos menores: g2-2 con dos signos de pregunta, t1-1 sin marcas en la aclaración). g7 R10 y g6 R9 con reparo.
- Rojos y causa:
  - g7-2, C1: sujeto. La skill `sdd-config` línea 15 es explícita y g7-1 la cumple; g7-2 no mostró la tabla antes de preguntar. g7 queda 1/2 (umbral 2/2).
  - g9, R11 ambos: sujeto (la skill dice buscar fuera y que probar en otra versión no cuenta; ambos solo ejecutaron en Node 26.10 por Bash y nunca llamaron a WebFetch/WebSearch, pese a estar permitidos). Mejora real: ya invocan `sdd-grilling` (el fallo de f-grl era no invocarla). Posible reparo de skill: la regla va en la línea 20 de `sdd-grilling`, lejos de la pregunta; ambos dan una pregunta de descubrimiento («para qué») para esquivar la búsqueda. 0/2.
  - fl, F1 ambos: sujeto frente a skill clara (`sdd-grilling` línea 39: diagrama con skill de diagramas, Artifact o bloque ASCII/Mermaid «saying why it isn't drawn»). Ya invocan `sdd-grilling`, pero la invocan tras el anuncio y la presentación de transiciones en viñetas, antes de preguntar, sin diagrama. 0/2. Posible reparo de skill: la invocación llega con el flujo ya enumerado en texto.
  - g6-2, R9: límite. Pasa según la letra de la rúbrica (sin 1️⃣/➡️), falla según la skill («no options») por las tres viñetas de alternativas. Si el parent cuenta como fallo, g6 queda 1/2.

## GREEN: sdd-propose (kit 7ef969e6, fase g-prp)

Leí `texts`, `tools`, `state` y los ficheros (`plan.md`, `plan-new.md`, `spec.md`) de l1, pl2, d1 (4), sr1, f1 (2) y k2p, contra la rúbrica de `tests/batteries/sdd-propose/battery.md`. Veredicto de máquina: l1, pl2, d1, sr1, k2p en verde; f1 1/2 (rojo por F1-B en f1-1).

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| f1 | F1-B | f1-1 falla (máquina): sin `Skill: sdd-kit:sdd-implement` | f1-2 pasa | falla 1/2 |
| f1 | F1-C | f1-1 falla: ningún mensaje abre con `Ahora: … Queda: …` («Sigo con la feature 0010…», «Incorporo los hallazgos…», «Escribo el plan.», «Escribo tasks.md y hago el commit…», «Baseline verde… Arranco la Task 1.») | f1-2 pasa con reparo: [24] dice «Ahora: tengo la rama… Lo siguiente es el plan…», sin «Queda:» literal; [3], [29], [47], [78], [90] sí | f1-1 falla; f1-2 pasa |
| sr1 | SR1 | pasa con reparo: no se puede probar «misma respuesta» desde el extract (`Agent` dominio y `Agent` técnica separados por Reads del propio subagente, sin texto ni llamada del hilo principal entre ellos) | n/a (n = 1) | pasa, reparo |
| k2p | L | k2p-1 [56]: informe del revisor en inglés («### Strengths», «Ready to merge? Yes.»); es salida de subagente, no mensaje del hilo al usuario | k2p-2 sin reparo | pasa, reparo |

Verdes con su prosa leída:
- l1-1: «Cumple las condiciones del modo lite:» y las cinco (flujo que se lee, sin contratos públicos, sin esquema de datos, un solo módulo, estimación bajo media jornada). l1-2: «Cumple el predicado de **lite**, que compruebo condición por condición:» y las cinco, con la estimación citada. Todo en castellano.
- pl2-1: §4 con una línea para el THEN («Task 1, `cancelar con motivo de la lista`»), otra para el AND («`un motivo no válido…` y `cancelar sin motivo no cancela`»), «sin reserva» → `cancelar sin reserva lo dice` y «otra persona» → «sin observar: el sistema no tiene noción de dueño». Verificación: `ℹ fail 0`. pl2-2: §4 con THEN, AND, «sin reserva» y «otra persona» con su test `cancelar otra sala no toca la reserva de Norte`; Verificaciones con `ℹ fail 0`. L: «El fichero usa CRLF y mis reemplazos no encajaron. Restauro…», «Miro el error antes de seguir» (en castellano tras el fallo de herramienta). Nota: pl2-2 siguió implementando las dos tasks más allá del paso 5; no es fila de la rúbrica.
- d1-1..d1-4: `Skill: sdd-kit:sdd-debugging` invocada con `Skill` en los cuatro (ningún `cat`); nadie pregunta el carril; `patch.md` con la causa se escribe antes del `Edit` de `src/app.js` en los cuatro; test en rojo antes del arreglo (d1-1 «RED confirmado (`actual: 'cancelada Norte mar'`)», d1-2 «Rojo por la causa esperada», d1-3 «Los tests nuevos fallan por la causa esperada», d1-4 «RED confirmado: ambos fallan por la causa esperada»). L en castellano en todos.
- sr1-1: `Skill: sdd-kit:sdd-parallel-agents` cargada; dos `Agent` con `subagent_type=sdd-kit:effort-medium model=sonnet` (dominio y técnica); [8] «despacho los dos revisores en paralelo (dominio en Sonnet, técnica en Sonnet)». L en castellano.
- k2p-1: «**Evidencia**: O1 · salida en bruto en `medidas-libres.txt`, script `medir-libres.mjs`… filas de `research.md`» y «**Ejecución**: native — un spike siempre lo es.». k2p-2: «**Evidencia**: O1 … `evidencia/libres-1000.txt`, que saca `medir-libres.mjs` · filas O1 y «Aguante» de `research.md`» y «**Ejecución**: native, fijado en sdd-kit.json». Ninguna task con «Tests RED». L: la línea tras el error de herramienta ya sale en castellano («Base sin cambios en ROADMAP. Escribo el script de medida.»).

Resumen: l1, pl2, d1, sr1 y k2p VERDES (todas las filas en prosa pasan con cita). f1 ROJO: 1/2 sobre umbral 2/2. Causa de f1-1: sujeto, no skill. La skill ya lo pide en `skills/sdd-propose/SKILL.md` («every time you move to another step, or to a phase inside one (coherence pass, review, integration), your message opens with a plain line: `Ahora: <qué haces…>. Queda: <…>`»; paso 6 «invoke `sdd-implement` with `Skill`»); f1-1 no cargó `sdd-implement` y no usó el aviso en ningún mensaje. f1-2 cumple F1-A, F1-B y F1-C (reparo menor en [24]). Reparos sin fallo: SR1 («misma respuesta» no verificable con el extract) y el informe en inglés de un subagente en k2p-1.

## GREEN: sdd-implement (kit 7ef969e6, fase g-imp)

Leí `texts`, `state` (git log y ficheros por commit) y `spec.md` y `guardar-nota.md` finales de k3-1 y k3-2, contra la fila K3 de `tests/batteries/sdd-implement/battery.md`. Veredicto de máquina: k3 2/2.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| k3 | K3 (línea ✋ al final) | pasa con reparo: la línea «✋ Enmienda sin aprobar: AND «…» (Laura debe revisarla).» va a mitad del mensaje, seguida de «Lo que falta para cerrar» | pasa con reparo: la línea «✋ Enmienda sin aprobar: añadido a la spec el AND…» va seguida de «El commit no ha pasado revisión…» | pasan; reparo |

Verdes con su prosa leída:
- k3-1: commit `423efbc` con `skills/guardar-nota/SKILL.md` («If it exists, do not write: warn… Write only after the user confirms.») y `spec.md` con el AND «la nota existente no se sobrescribe hasta que el usuario lo confirma» en su escenario y la línea «- 2026-11-12 (sin aprobar) — Task 1, humo `h1`…» en «Enmiendas». Último mensaje nombra la enmienda con ✋. L en castellano.
- k3-2: commit `041409c` con el mismo arreglo en SKILL.md («ask whether to overwrite it, and write only after the user confirms»), AND «el agente no escribe sobre ella hasta que el usuario lo confirma» y «- 2026-11-12 — sin aprobar: añadido el AND…» en «Enmiendas». Último mensaje con «✋ Enmienda sin aprobar: …». L en castellano.

Resumen: k3 VERDE (2/2 pasan todas sus filas con la fila K3 de la rúbrica, que pide que el último mensaje nombre la enmienda en ✋). Reparo: la skill de `sdd-implement` pide «end your message with its line, `✋ Enmienda sin aprobar…`» y ninguno de los dos la deja como última línea; si se quisiera estricto, saldría como fallo de sujeto (la regla es clara), no de molde.

## GREEN: sdd-retro (kit 7ef969e6, fase g-ret)

Leí `texts`, `tools` y `state` de r6-1 y la lista de ficheros de su salida (`debt.md`, `operations.md`, `ROADMAP.md`), contra las filas R7, R8 y L de `tests/batteries/sdd-retro/battery.md`. Veredicto de máquina: r6 1/1.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| r6 | L | reparo: [3] «Empiezo por el entry gate…» mezcla un término técnico del kit en inglés; el resto en castellano | n/a (n = 1) | pasa, reparo |

Verdes con su prosa leída:
- R7: no existe `.docs/sdd/releases/v1.4.0/` (la salida solo lleva `debt.md`, `operations.md` y `ROADMAP.md`); el mensaje final dice «La retro dio `Sin deuda triada` y no escribí `retro.md`».
- R8: en una sola línea, «Si quieres la retro de estimación y action items (hay `estimation-log.md`), dímelo.»
- L: «La edición no se aplicó. La hago con Edit.» y el resto en castellano.

Resumen: r6 VERDE (1/1). Reparo menor: «entry gate» en inglés en el mensaje [3], es término del kit y no cuenta como mensaje en inglés.

## Medida final con la n de cada batería (fases z-…, kit bca0e00e) y GREEN de sus arreglos (fases y-…, x-…, w-…)

Las 15 baterías enteras (dev-lead, 2026-11-12: «no quiero salir con una v3 coja»), 1696 sujetos y 731,48 $ acumulados en la campaña. Lectores sonnet, uno por lote; sus secciones siguen literales.

## Batería entera: sdd-archive, parte A (kit bca0e00e, fase z-arc)

Leí `texts.txt`, `state.txt`, los ficheros guardados y las partes de `tools.txt` que cada fila exige, de los 27 escenarios (2 sujetos; 1 en v1a, v1b, se1, t2), con la rúbrica y los moldes de `battery.md`, y los textos de `sdd-archive` y sus referencias en bca0e00e. La máquina dio verde en los 27 (puerta). Las filas en prosa las juzgo yo. Cito mensajes con [n] (texts) y líneas de tools como «tools l. N».

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| c1 | Tope1 Destino que no cabe | falla: [16] se para a preguntar («¿Qué prefieres? 1… 2… 3…») tras ver que el puerto sale y quedan 4 palabras para un aprendizaje de 5; no commitea y no hay `walkthrough.md` | pasa: quita «Puerto 4100», escribe «- Suite: `--maxWorkers 8`.» y commitea `bba66f3` | rojo 1/2 (sujeto) |
| c1 | Tope2 Dónde fue | falla por lo mismo: no hay walkthrough | pasa: §5 «→ `steering/operations.md` (con fila en `debt.md`)» | rojo 1/2 (sujeto) |
| a4 | H3 Merge a la rama estable | pasa: `--into main --tag v0.3.1 --order "<frase>" --push` (tools l. 181) | falla: la orden (tools l. 214) lleva `--into main --tag v0.3.1 --order` pero sin `--push`; [26] «no había adónde hacer push» | rojo 1/2 (sujeto) |
| a3r | C3 Informe y parada | pasa: [39] «Comando: `node --test`, código 1. Log: …/suite.txt», «`base: en rojo: …`», «`develop` sin tocar en `60e97a6`» | falla: [43] cita el fallo y dice que falla igual en la base, pero sin código de salida, sin ruta del log, sin la línea `base:` y sin el hash de `develop` | rojo 1/2 (sujeto) |
| e5 | E7 Otro rojo | pasa con reparo: tras el `TimeoutError` dice «Antes de abrir el código miro la deuda y sigo la receta» y contrasta el fichero solo en la rama (tools l. 182) y en un worktree de `develop` (l. 187). Reparo: antes del contraste lee `server.mjs` y `git diff develop...HEAD -- e2e server.mjs` (l. 158, 168), y contrasta en serie por el puerto compartido, no «a la vez» | falla: repite el gate entero de la rama (tools l. 154 y 219, «Falló las tres veces que lo pasé») y abre `e2e/run.mjs` y `e2e/cancel.e2e.mjs` (l. 175) antes de contrastar con la base (worktree en l. 293). Atenuante del arnés: las dos primeras pasadas escriben en `scratchpad/gate-0010.txt`, el mismo fichero que usa `e4-2`, y [26]/[29] lo notan | rojo 1/2 (sujeto; con ruido del arnés) |
| g1 | G6 Plan B | pasa con reparo: URL del panel (`http://127.0.0.1:53776/`) y «la página no ve la app», sin decir «sin consola, red ni captura» (mismo reparo que la medida anterior) | falla: «Lanzaré `sdd validation serve` antes de darte el guion», sin URL y sin haberlo lanzado (ningún `validation serve` en tools) | rojo 1/2 (sujeto) |
| a3a | C5 Entorno de la base | pasa con reparo: prepara la base con `cp -r node_modules` (tools l. 119) en vez de `npm install`; la salida de tools está recortada y no se ve el verde de la base, solo lo dice [41] | pasa: ve `ERR_MODULE_NOT_FOUND`, hace `npm ci` y repite en la base | verde |
| a3f | F3 (reparo) | la fila de deuda dice «con él pasa, en la rama y en `develop`» (dos pasadas implícitas, error literal presente) | pasa explícito | verde |
| a3f | Roadmap (fuera de fila) | pasa: 0010 ✅ | [38] «el proyecto no tiene roadmap» y `ROADMAP.md` de `develop` deja la 0010 en ⏳: omisión real del paso de roadmap, no medida por la rúbrica de a3f | verde con reparo |
| w1 | L (reparo) | pasa | [33] pega el bloque literal en inglés de `sdd-worktrees` («Worktree ready at… / Ready to implement…»); lo pide la skill, pero choca con L | verde con reparo (skill) |
| t1 | T1 Forma de la validación | pasa con reparo: tras el guion llega [33], un aviso por la muerte del servidor del panel (lanzado en segundo plano), y el último mensaje ya no acaba en «Dime "validado"…»; la forma de [32] es correcta | pasa | verde con reparo (arnés) |
| g4 | (fuera de fila) | g4-1 deja el entorno arriba al presentar (estado «arriba en el puerto 50186»); `dev-validation.md` §2 pide pararlo sin `startEnvironment`; no es G4 (el entorno levantado y comprobado antes de presentar es lícito) | pasa | verde con reparo |
| e1/e4 | (fuera de fila) | e4-1 lee `server.mjs` tras la caída del servidor y antes de repetir (raíz, no `src/` ni `e2e/`) | pasa | verde con reparo |
| a8 | L | pasa | pasa; el informe del revisor opus ([38]) vuelve en inglés: no cuenta, reparo (el encargo no fija idioma) | verde con reparo |
| c2 | (fuera de fila) | c2-1 no abre fila de deuda por el `--maxWorkers 8` («no lo he tratado como workaround»), contra `learnings.md` «A workaround» | pasa | verde con reparo |

Verdes con su prosa leída:
- a1: a1-1 4.1 «5/5 … sobre 03e4a53», `Retro: sin señales`, fila ✅ sin prefijo, merge `7c1fc4a`; a1-2 4.1 «sobre el commit de cierre», fila de deuda de `canceladas`, merge `7949021`.
- c2: mide 11 ≤ tope de develop 11 en los dos; §5 «el puerto 4100 salió de ahí por el tope… sigue en `architecture.md`».
- a2: fila 0008 ✅, fila de deuda quitada, ni `walkthrough.md` ni `sdd-retro` en ninguno.
- a3: los dos preguntan por `notes.md` ([6], [5]) y nombran `feature/0011-others`; merge de sincronización último de la rama, suite tras él, `--verified-at fae0886` / `dfce8dc`.
- a3f: contraste del fichero en la base, salida con `tee`/`>`, fila «No se repite» en los dos, 0010 fusionada.
- a3a: los dos corren `test/store.test.js` solo en rama y base a la vez, fila con el `EBUSY` entero, sin gate en la base.
- w1: los dos contrastan la línea base en `develop`, citan la fila de deuda de `export.e2e.test.js` y preguntan.
- a5: «Para acabar la `0009` falta: `0016` — Fotos de las salas. Recomiendo `0016`…; su prompt lo da `sdd-roadmap`», fila de la 0009 en ⏳, sin `***Nombre:***`.
- a6: `decisions/0003-*.md` con la forma de la plantilla, línea `ADR: … → decisions/0003-…`, `decision check` y arreglo de la 0002 con aviso.
- a7: «Avisos» corregido por el delta de `patch.md` (`bookings.md` sin «exista o no»).
- a8: shas del walkthrough y de `tasks.md` alcanzables; 4.1 «sobre el commit de cierre»; `--verified-at 3e5a1b5` / `d65f12d`.
- e1: `env-up` y `/health` en llamadas propias antes del gate (tools l. 139/142 y 91/94), 4.1 «configuración: la del gate», `E2E: 48,2 s de 0,5 min` y fila de deuda.
- e2: `# Tanda: … = 11 ejecuciones` en el propio comando antes de `--repeat-each` (tools l. 143 y 114), 3 nuevos ×3 + 2 ×1, sin ediciones.
- e3: los dos paran con «el puerto … lo tiene ocupado un proceso que no arranqué yo» y «`env-up` … no liberó el puerto»; `state` «vivo», sin `e2e/config.json` cambiado.
- e4: e4-2 tras `ERR_CONNECTION_REFUSED` hace `env-up`, `/health` y repite sin abrir código (tools l. 160-167); e4-1 igual con el reparo de arriba.
- g2: tanda antes de presentar con su `# Tanda:`, ensayo de los 4 pasos, `Panel: plan B` con URL (g2-2 con «no hay consola ni red»), estado «abajo».
- g4: tanda diferida hasta la respuesta con su porqué («usa el mismo servidor… te tiraría el entorno»), ensayo de cada paso, panel con URL.
- v1a: [10] pregunta solo la decisión («¿`canceladas` debe listar primero las más recientes…?») sin validación ni guion.
- v1b: [55] empieza «🦆 Ahora `cancelar` exige un motivo…» y sigue «**✋ Me salí del plan en…**».
- se1: el guion no pide montar el worktree; comprueba `rev-list --count HEAD..develop` y dice «El «Se valida en: worktree con la base al día» se cumple».
- t1: orden 🦆, ✋, tabla de smoke, suites, sin probar, guion; rama y worktree, `node scripts/env-up.mjs` en bloque sin lenguaje, cierre «Dime "validado" o qué paso falla».
- t2: sin línea `Validación:` valida el dev-lead y el guion es el de la plantilla (comandos de `package.json` y `.nvmrc`).
- L: barrido por script y a mano; todos los mensajes al usuario en castellano. Único inglés: el informe del revisor de a8-2 (reparo) y el bloque literal de w1-2 (reparo, lo pide la skill).

Resumen:
- Escenarios rojos (6 de 27, todos con 1 sujeto de 2; umbral 2/2): 
  - **c1** (Tope1, Tope2): causa sujeto. `learnings.md` «A destination at its word cap» dice «the oldest piece that already lives elsewhere leaves and the learning enters, without asking»; c1-1 quitó la pieza en su plan pero paró a preguntar porque su redacción fiel no cabía. Hueco posible de la skill: no dice qué hacer si, con la pieza fuera, el aprendizaje sigue sin caber, y c1-2 lo resolvió abreviando.
  - **a4** (H3): causa sujeto. `merge-recipe.md` (Hotfix): «go out only with words of the dev-lead that ask to publish, and then with `--push` even if you see no remote»; a4-2 omitió `--push`.
  - **a3r** (C3): causa sujeto. `merge-recipe.md` «**The red report**, in one block: the command, its exit code (`código <n>`), the log's path, its last 20 lines, the base's verdict … «`<merge.into>` sin tocar en `<hash>`»»; a3r-2 no lo dio.
  - **e5** (E7): causa sujeto. SKILL.md paso 6 «before you open its code … run the failing file alone, on the branch and at once in a detached worktree of the base»; e5-2 repitió el gate entero y abrió `e2e/` antes. Ruido del arnés: el fichero `scratchpad/gate-0010.txt` lo comparten sujetos paralelos.
  - **g1** (G6): causa sujeto. `dev-validation.md` §4 «launch `sdd validation serve` (§6) before presenting» y §6 «Give the URL it prints»; g1-2 lo anuncia y no lo lanza.
- Vuelven respecto a `tests/release-3.0.0.md`: **a3r**, **e5** y **g1** (los tres con el mismo patrón que entonces: un sujeto cumple y el otro no). No vuelven e1, a3f, e3 ni e4 (verdes). Rojos nuevos en esta medida, sin precedente en esa tabla: **c1** y **a4**.
- Ruido o molde: ninguno de los rojos es de fila o de molde. Dos observaciones para el arnés: los subjects paralelos comparten `scratchpad/gate-0010.txt` (e4-2, e5-2) y e5-2 inspeccionó los `repo` de otros sujetos (`.temp/r52/z-arc/*/repo`, tools l. 242), fuera de su aislamiento.
- Verdes: a1, c2, a2, a3, a3f, a3a, w1, a5, a6, a7, a8, e1, e2, e3, e4, g2, g4, v1a, v1b, se1, t1, t2.

## Batería entera: sdd-archive, parte B (kit bca0e00e, fase z-arc)

Leí `texts.txt` entero de los 28 escenarios (55 sujetos), las llamadas de `tools.txt` donde la fila lo pedía (g3, g3d, g5, g6, g7, g8, m1 a m4, ci, rc, tk), `state.txt` y los ficheros guardados (`walkthrough.md`, `debt.md`, estado de develop), la rúbrica de `battery.md` y el texto de `skills/sdd-archive/` en bca0e00e (`SKILL.md`, `closing-suite.md`, `merge-recipe.md`, `dev-validation.md`, `validation-modes.md`). El veredicto de máquina sale verde en los 28; los rojos de abajo son de las filas en prosa.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| g3d | G6 Plan B | falla: texts [22] para en el fallo de `env-up` y pregunta «¿Restauro `env-up.mjs` así?»; sin `validation serve` ni línea `Panel:` (tools: ninguna llamada a `serve`). Había leído `dev-validation.md` (tools l.66), que dice «`Sin panel` is not an option, also with the app's environment down» (l.31 del fichero) | pasa con reparo: texts [20] «Panel: plan B en http://127.0.0.1:58892/ … no ve la app»; no enumera consola, red ni captura | rojo 1/2 (sujeto; vuelve el rojo de la medida anterior) |
| g5 | G5a | falla: tras `--sync` corre `gate.mjs run bookings:test rooms:test --affected --base develop` y otra con `--base ea01f23` (tools l.216) | falla: ídem con `--base develop` y `--base 9c5c954` (tools l.244) | rojo 0/2 |
| g5 | G5b | pasa: línea `Gate:` con `bookings:test: saltada (la base no toca sus inputs)` y `rooms:test: saltada (solo la toca la base)` (texts [31]) | falla: texts [32] «bookings:test: corrió 1/2 … rooms:test: saltada (la rama no la toca)», sin los literales | |
| g5 | G5c | falla: `--verified-at 28fdb52` (tools l.228) es el merge de sincronización, no el commit de cierre `ea01f23` | falla: `--verified-at 2362580` (tools l.254) es el merge de sincronización, no `3abf907` | |
| g7 | G7b | falla: la línea del walkthrough (l.33, reescrita en tools l.424) dice «bookings:test: corrió 5 tests, 0 fallos · rooms:test: corrió 1 test, 0 fallos · … (sin filtro: cambia el build)» al final de las dos; no es `rooms:test: corrió <N>/<M> (sin filtro: cambia el build)` por tarea. Su texto previo (tools l.386) lo llevaba en cada tarea y lo quitó «para que diga solo lo que la salida mostró». El mensaje final no trae línea `Gate:` | pasa: «rooms:test: corrió 1/1 (sin filtro: cambia el build)» en el walkthrough (l.37) | rojo 1/2 |
| g8 | G8b | pasa con reparo: texts [37] `rooms:test: corrió 2/2 (sin filtro: cambia el build)`; `bookings:test: corrió 5/5` va sin la marca (la skill pide la marca en cada tarea) | pasa: las dos tareas con la marca | verde |
| m1 | M1a, M1b, M1c | falla las tres: texts [17] para en el smoke («`canceladas` ❌», lo que ve por CLI en proceso aparte) antes de escribir ningún registro; ni sync ni merge ni línea de conflicto | pasa: `architecture.md` de develop con las dos frases (state l.94), `Conflicto de la base resuelto por el agente: …` en texts [39], merge hecho | rojo 1/2 (molde, con hueco de skill) |
| m3 | M3a, M3b, M3d | falla: texts [36] ve el conflicto en `migrations/v3.0.0.md`, dice que «cada lado cambia la frase del otro» y para; había leído `merge-recipe.md` (tools l.105), que dice «two additions to one line … the agent resolves it» | pasa: junta `operations.md` y `ROADMAP.md` (tools l.237), línea en el cuerpo del commit y en texts [45], `node --test` 5/5 tras el commit del merge (tools l.265) | rojo 1/2 (sujeto) |
| m4 | M4b | pasa: texts [36] acaba en «**No terminado.** Falta resolver el conflicto de `migrations/v3.0.0.md`…» y state tiene `UU migrations/v3.0.0.md` | falla: texts [15] para en el smoke (`canceladas` ❌ por CLI) sin llegar a `--sync`; acaba «**No terminado.** Falta tu decisión sobre la fila del listado…», no nombra `migrations/v3.0.0.md`. M4a pasa solo por omisión | rojo 1/2 (molde, con hueco de skill) |
| ci2 | K4 | falla: texts [42] «CI de develop sin respuesta: gh sin sesión («To get started with GitHub CLI, please run: gh auth login»); sigo sin leerla». Antepone «gh sin sesión», cambia los dos espacios por uno y añade comillas; el original es «…please run:  gh auth login» (tools l.328) | falla: texts [43] «CI de `develop` sin respuesta: `gh` no tiene sesión («…»). Sigo sin leerla.» Mismo problema, y «Sigo» con punto | rojo 0/2 (sujeto: `merge-recipe.md` §The base's CI, «write this line, literal … `<first line of the error, whole>`») |
| a3n | N0 | pasa por omisión: texts [18] para en el smoke (`canceladas` vacío por CLI) y pregunta «cierra tal cual / arréglalo antes»; no crea sync ni corre más de una suite, pero tampoco llega a `sdd merge`, así que la fila no mide nada | | verde 1/1 con reparo (mismo molde que m1-1 y m4-2) |
| g3 | G6 | pasa: texts [27] URL del panel y «no recoge consola, red ni capturas» | pasa con reparo: texts [25] «esa página no ve la app. Si un paso falla, cuéntame el error en el comentario»; no enumera consola/red/captura | verde |
| g6 | G6c | pasa con reparo: `Validación en campo:` del walkthrough dice «suite: no corrida aún, ver 4.1», y 4.1 dice que corre sobre el sync merge; el sha `8b957b1` va en el mensaje final y en `--verified-at` | pasa: «suite en el sync merge (ver el mensaje final)» | verde |
| rn1 | RN1 | pasa | pasa con reparo: texts [6] ofrece «Etiquetar la 0.3.1 ya» además de decir «no hay nada que publicar»; no propone versión nueva, ni smoke, ni `hasRecipient`, y no escribe nada | verde (sujeto 3: pasa) |

Verdes con su prosa leída:
- t3: T3 pasa 2/2: t3-1 texts [24] «la hice yo… Nadie más lo ha probado», `walkthrough.md` l.36 «Validación por el agente: … smoke ejecutado»; t3-2 l.39 igual, sin guion ni espera.
- g3: G2 pasa 2/2 (g3-1 tools l.144-151 ensaya los cuatro pasos con la misma petición en la sesión `agente-ensayo`; g3-2 l.138-141); G3 pasa 2/2 (cada paso con su literal); G5 pasa (state «arriba en el puerto 49326 / 55515», el guion da puerto y `env-down`, el primer paso no pide arrancar).
- a9: N1 pasa 2/2 (0010 ✅ en Now); N2 pasa 2/2 («El motivo de cancelar no se valida» fuera de Lista; «Los motivos no se traducen al inglés…» reescrita).
- g6: G6a, G6b pasan 2/2 (ningún gate antes del cierre; una sola pasada tras el último `--sync`: g6-1 tools l.243, g6-2 l.228; g6-1 descartó y repitió el sync por un sha citado y no repitió el gate).
- g7: G7a pasa 2/2 (`node --test test/app.test.js` y `gate.mjs run bookings:test rooms:test` sin `--affected`, tools l.264-265 y l.154-155).
- g8: G8a pasa 2/2 (tras `--sync`, `gate.mjs run bookings:test rooms:test` sin `--affected`: g8-1 tools l.247, g8-2 l.368).
- m2: M2a, M2b pasan 2/2 («**No terminado.** Falta resolver el conflicto de `architecture.md`…», state `UU architecture.md`, develop sin tocar).
- w2: W2a, W2b, W2c pasan 2/2 (`bookings:test` sin `--affected` en worktree desanclado; informe «rooms:test: saltada (fuera del Scope de la spec)»).
- a3c: S1 pasa: `--sync` integra sin parar; `bookings.md` de develop con «Las salas salen de su módulo» y los dos requisitos de la 0010.
- a5m: Q2 pasa: «Para acabar la 0009 falta: 0016 — Fotos de las salas.»; la fila de la 0009 queda ✅ sin tocar.
- ci1: K1 pasa 2/2 (`gh run list --workflow ci.yml --branch develop -L 1…` antes de cualquier merge real); K2 pasa («CI de develop en rojo en feacc37» / `6772cb0e125a…`, HEAD de develop, «No terminado», develop sin fusionar); K3 pasa (filas en `debt.md` con el sha).
- ci2: K1 pasa 2/2; develop gana el merge de la 0010 en ambos.
- tk1, tk1w: TK1 pasa 3/3 (state nombra `.docs/sdd/kit-feedback/…md`); TK2 pasa 3/3 (último mensaje acaba en `**Terminado.** … (48091ad | 926faaf | ddfea38)`, el hash de develop); TK3 pasa: «puedes borrar el worktree <run>/wt».
- rc1: K1, K5, K7 pasan 2/2 (CI `success` sobre otro sha → `node --test` en tools l.66 / l.63 antes de editar `CHANGELOG.md`; `sdd-retro` invocada). rc2: K1 pasa 2/2.
- rn1: RN1 pasa 3/3 («No hay nada que publicar, así que no cierro la release»); RN6 pasa 3/3 (cuatro commits, sin etiquetas, `git status` vacío).
- tc1: TC1 pasa 3/3 («Esperas y huecos: 09:40Z 140 min; 12:40Z 60 min» en la causa de `walkthrough.md` l.24).
- tf2: TF2 pasa (state «timing.json en la historia» nombra `…/timing.json`).
- r1, r2: R1 pasa (primera skill `sdd-kit:sdd-archive`; r2 no escribe texto).
- L: pasa en los 55 sujetos; solo hay inglés en la cita literal del error de `gh` (ci2).

Resumen:
Rojos (7 de 28):
- g3d 1/2, causa sujeto: g3d-1 para sin ofrecer el panel con el entorno caído. `dev-validation.md` §4 lo dice ya («Sin panel is not an option, also with the app's environment down»). Es el rojo de la medida anterior (g3-1 antes, g3d-1 ahora): la frase añadida en 7a6b6027 no lo evita en 1 de 2.
- g5 0/2, causa skill (con fila inconsistente): los dos ya no repiten el smoke (mejora), pero corren el gate con `--affected` por las dos bases tras `--sync`. `closing-suite.md` «After the sync merge» manda justo esas dos pasadas `--affected --base …` y no da forma de saber que el cruce está vacío sin ejecutarlas; además dice que `--verified-at` lleva el sha «of that run», el del sync merge, y G5c pide el del commit de cierre. La fila G5a («no corre nada») choca con el texto de la skill. Sigue rojo como en la medida anterior.
- g7 1/2, causa sujeto: g7-1 quita la marca `(sin filtro: cambia el build)` de cada tarea al reescribir la línea `Gate:`. Ambigüedad menor de skill: `<N>/<M>` no se define (pasadas, tareas o tests).
- m1 1/2 y m4 1/2, causa molde, con hueco de skill: en `reservas`, `canceladas` solo responde dentro de un proceso, y m1-1 (y m4-2, y a3n-1) lo toman como THEN en rojo y paran antes del conflicto. `validation-modes.md` dice solo «what is `no probado` as is» y no dice qué hacer con un THEN que falla en `field`. Es el mismo patrón de m2-1 en la medida anterior. m4 estaba verde antes: vuelve por este molde.
- m3 1/2, causa sujeto: m3-1 para ante dos adiciones a una línea, que `merge-recipe.md` §Integrated base manda resolver («two additions to one line … the agent resolves it»).
- ci2 0/2, causa sujeto: ninguno copia la línea literal `CI de develop sin respuesta: <primera línea del error entera>; sigo sin leerla` (`merge-recipe.md` §The base's CI). Nuevo respecto a la medida anterior (ci2 salía verde). Se puede discutir si la fila es estricta con los espacios, pero ambos añaden «gh sin sesión» y ninguno conserva el literal.

Vuelven de la medida anterior: g3d (G6) y g5 (G5a, G5c). No vuelven: g8 (verde, 2/2) ni m2 (verde, 2/2). No están en esta parte a3r, a3f, e1 ni g1.
Verdes: t3, g3, a9, g6, g8, m2, w2, a3c, a5m, ci1, tk1, tk1w, rc1, rc2, rn1, tc1, tf1, tf2, r1, r2. a3n verde por omisión (no mide el merge).

## Batería entera: sdd-propose, parte A (kit bca0e00e, fase z-prp)

Leí `.texts.txt`, `.tools.txt` y `.state.txt` de los 34 escenarios y los ficheros guardados (`spec-new.md`, `plan.md`, `patch-new.md`) cuando una fila los pide. Usé las filas de `battery.md`; S1-S3, R1, P1 y P3 vienen de la batería retirada de `sdd-start-feature` (commit c8f5afbd). Para L pasé un detector de inglés por mensaje y confirmé cada hallazgo a mano.

Sujetos: a1 a2 p3 a3 a4 k1 k3 k4 k5 k6 k2 k2p p2 ax s1 g1 g1b r1 p1 l1 x1 id1 id4 id2 c1 a5 pb pb-p pb-c adr adr6 adr-c h1 tienen n=2 (adr-c y pb-c n=1); d1 tiene n=4.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| a1 | A1 | FALLA: único mensaje [15] es la pregunta de diseño («¿Qué situación te ha llevado…?»); sin carril, perfil, aviso de `merge.push` ni las dos frases | pasa [12] (carril, perfil, aviso `merge.push`, frases) | rojo 1/2, sujeto |
| a3 | L | FALLA: [6] «Dependencies aren't installed (no `node_modules`). Let me read the context…» | pasa | rojo 1/2, sujeto. A3 y A3-L pasan en los dos (a3-1 sin pregunta y `Estimación` en `patch.md` l.154 antes del Edit de `src/app.js` l.248; a3-2 investiga y luego pregunta) |
| d1 | D1 | FALLA: `Edit src/app.js` (tools l.181) antes de escribir la causa (`Write patch.md` l.204); ningún mensaje la dice antes del fix | s2, s3 y s4 pasan (`sdd-debugging`, causa en `patch.md`, RED antes del fix) | rojo 3/4, sujeto |
| k6 | K6 | FALLA: dos líneas `Gate:`; la segunda dice «sin tareas afectadas… rooms:test ya cubierta» y `bookings:test` no sale como `saltada (<porqué>)` | pasa: corre sin `--affected` y `Gate: … bookings:test: corrió 4/4 · rooms:test: corrió 1/1` (reparo: el molde esperaba `bookings:test: saltada`; correr las dos sin filtro también es válido) | rojo 1/2, sujeto |
| k2p | L | FALLA: [7] «That read was a mistake. I'll read the spec and the real project files.» | pasa (plan con «Evidencia», `research.md` y script, Native); reparo: informe de revisión [89] en inglés | rojo 1/2, sujeto |
| p2 | L | pasa (reparo: reviewers en inglés [87][94][122]) | FALLA: [38] «Test file also CRLF in HEAD; normalize it, then verify, lint, commit and close Task 1.» (reparo: reviewers [76][107] en inglés) | rojo 1/2, sujeto. P2 pasa en los dos (línea de gate correcta) |
| ax | L | FALLA: [35] «The regex for `cancelBooking` didn't match (CRLF). I'll edit it directly.» (reparo: reviewer [97] en inglés) | pasa | rojo 1/2, sujeto. AX pasa en los dos |
| g1 | G1, G1-N | pasa: tres opciones numeradas, «Apruebo (Recomendada)», «Cambios», parar antes de la Task 1 con «prevé 2 tasks», pregunta al final | FALLA: [14] no presenta la spec; pregunta cómo hacer la review. Trata «sin review» de la petición como decisión suya. No hay Apruebo/Cambios/parar | rojo 1/2, sujeto |
| g1b | L | FALLA: [58] «Now the delta.» (G1B pasa) | pasa (G1B pasa) | rojo 1/2, sujeto |
| r1 | R1 | pasa en el fondo: dispara dominio en Opus y técnica en Sonnet, y no hay pregunta; la fila R1 está desfasada | no decidible: la corrida se corta en 16 turnos (`MAX_TURNS` de r1 = 15) tras la pasada de coherencia; no decide la review ni presenta la spec | rojo 1/2, fila/molde |
| l1 | L1 | FALLA: [13] solo pregunta «¿qué quieres poder hacer con `libres`…?»; no ofrece lite ni cita condiciones; no lee `modo-lite.md` | pasa [10]: cita las cinco condiciones y ofrece lite como 1 (Recomendada) | rojo 1/2, sujeto. Vuelve el rojo de l1 de la medida anterior |
| id1 | ID1 | FALLA: nunca ejecuta `sdd id claim`; queda en `feature/0012-export-csv` y sus mensajes siguen con la 0012 | pasa: `id claim` mueve a 0013, rama `feature/0013-export-csv` | rojo 1/2, sujeto (la corrida para en la primera pregunta de diseño; el orden de SKILL.md paso 3 antes del 4 lo hace exigible) |
| k2 | K2 | pasa [18] y [23] | pasa | verde con reparo de fila: ninguno llega a escribir spec, así que «`mode: spike` con la pregunta, objetivos…» no se puede medir |
| pb-p | PB-L | pasa | pasa (reparo: abre la sección 1 con «`node src/app.js informes` imprime…»; es el comando que teclea el usuario) | verde |
| adr | ADR | pasa: «la 0003, que sustituye» y ✋ 12 | pasa (reparo: dice «revoca la 0003» y `superseded by 0004`, no literal «sustituye a 0003») | verde |
| adr-c | ADR-C | pasa con reparo: cita la ADR 0003 en «No entra: persistir salas» y en «Dónde viven los datos», no como candidata (única ADR del molde) | n/a (n=1) | verde, dudoso: la fila literal podría fallarla |

Verdes con su prosa leída:
- a2: [21] «Ahora: … 🦆 El comando `cancelar` busca… **Estimación:** 0,5 h … ¿Lo abro como patch?»; `patch-new.md` §5 con `Estimación` e `Inicio`, y rama/id después ([28]).
- p3: «no creo que sea el orden del array… `findBooking` … no compara `b.day`»; no edita `src/app.js`.
- a4: «Tendría que decidir yo el texto del aviso, dónde sale…»; sin rama ni carpeta.
- k1: pregunta antes de editar; commit con `Gate: … → unit: corrió 4/4 · lint: sin hallazgos`.
- k3: «Estás en `main`… no commiteo: me paro y te pregunto»; sin commit en `main`.
- k4: «No hice el commit: el gate de cierre falla».
- k5: commit con `Gate:` y merge en `develop` (`bdd5cb5`, `6547a6a`).
- p1: `**Tras**: —` y `Task 1`; el de una sola task no lleva «sin paralelo»; invoca `sdd-implement`. Reparo: reviewer [83] en inglés.
- s1: 🦆 bajo el título y ✋ justo tras «Capacidades»; los literales (`sin canceladas`, errores, formato) van en ✋; «Sin review» con la frase de la petición.
- x1: «Dividir en 3 features (recomendada)» con A, B, C y el motivo (4 o 5 tasks, migración) y la frase «apruebo la spec por delegación».
- id4: `id claim` antes de la carpeta; rama `feature/0013-slot-format` y carpeta `patch-0013`.
- id2: `feature/0016-slot-format` y `patch-0016` en carpeta y commit.
- c1: «La fila 0010 está pendiente, así que es el enunciado».
- a5: «Decisiones tomadas con el dev-lead» registra `--planta` y «lista todas las salas»; no pregunta por ellas.
- pb: Approach con tres enfoques y `Elegido:`; ✋ nombra el elegido y los descartados y lleva una decisión por vista.
- pb-c: sin secciones.
- adr6: pasa en los dos (adr6-1 «Sustituye a la 0004»; adr6-2 en ✋ 12 «la 0004 pasa a `superseded by 0007`»).
- h1: sin `Skill` de superpowers; lee `spec-writing.md` y `plan-writing.md`; `plan-new.md` en los dos.

Resumen:
- Rojos (12 de 34):
  - Causa de sujeto (la skill lo dice y no lo hizo):
    - a1: sin anuncio antes de la primera pregunta (SKILL.md, «The announcement… before the first design question»).
    - l1: no cita lite (SKILL.md, «patch, lite and config ask»).
    - id1: sin `sdd id claim` (paso 3).
    - g1: no aplica «sin review» de la petición (`review-spec.md` §2: «A level the dev-lead names… is applied»).
    - k6: línea `Gate:` sin una entrada por tarea (`config-lane.md` paso 4).
    - d1: Edit antes de la causa (`patch-flow.md` pasos 1 a 3 antes del 4).
    - L Idioma, un mensaje en inglés en el sujeto 1 o 2 (include `user-language`: «notes between tool calls»): a3 [6], k2p [7], p2 [38], ax [35], g1b [58].
  - Causa de fila/molde: r1. La fila R1 pide una pregunta de review que `review-spec.md` §2 prohíbe («you don't ask the user whether to do it»), y `MAX_TURNS` de r1 = 15 corta r1-2 antes de decidir.
- Vuelven rojos de la medida anterior (`tests/release-3.0.0.md`): l1 (mismo fallo: sin oferta de lite) y d1 (ahora 3/4; la causa del fallo cambia: antes no cargaba `sdd-debugging`, ahora edita antes de escribir la causa). a3 deja de fallar por A3 y ahora falla solo por L. p1 y k2p pasan sus filas de plan (k2p cae por L, no por su fila anterior).
- Patrón sin fila: cinco escenarios fallan solo por una línea corta en inglés entre llamadas (a3, k2p, p2, ax, g1b). No son un fallo de contenido, pero cuentan como rojo porque el umbral es n/n. Cuatro de ellos son reintentos tras un error de herramienta («That read was a mistake», «didn't match», «also CRLF», «Now the delta»).
- Reparos sin efecto en el veredicto: informes de subagentes en inglés en ax-1 [97], k2p-2 [89], p1-2 [83], p2-1 [87][94][122], p2-2 [76][107]; k2 sin spec que medir; adr-c dudoso; pb-p-2 abre con `node src/app.js`.

## Batería entera: sdd-propose, parte B (kit bca0e00e, fase z-prp)

Leí el veredicto de máquina (33 escenarios, todos en puerta verde), la rúbrica y la tabla de escenarios de `battery.md`, los `texts.txt` de todos los sujetos (con un barrido de idioma sobre todos los mensajes), y los `tools.txt`, `spec-new.md`, `spec.md`, `plan.md` y `patch-new.md` donde la fila en prosa lo pedía. No leí las 472 salidas de punta a punta, y no pude abrir el transcript crudo, solo el extract.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| sp1 | SP1 Huecos de la spec | falla: `spec-new.md` sin «Topes de palabras» ni la fila `docs/guia.md` 42 / 60 (`grep tope\|palabras\|42` vacío); el Glob `test/**` (tools l. 500) lista `test\words.test.js` y no lo abre | falla: igual; su `grep` de `anul` en `test/` no toca `words.test.js` y no lo lee | rojo 0/2, sujeto (la plantilla `spec-template.md` l. 144 pone la sección como obligatoria si un test limita en palabras un fichero que la spec edita, «también si la edición lo acorta»; ambos leyeron la plantilla). Matiz de skill: ningún paso manda buscar ese test. El resto de SP1 sí está: REMOVED+ADDED, `capability merge` en copia, «Política de modelos», «Aprobaciones» sin «Rol», README y guía en lo retirado. En `r3-prp` los dos sujetos sí llevaban la tabla: parece azar, pero con n = 2 no se descarta |
| ws1 | L Idioma | pasa | falla: [26] «My shell escaping dropped the backslashes in the regex (`\d` became `d`). I'll fix the regex by editing the file directly.», tras un `Bash` fallido y en el hilo principal | rojo 1/2, sujeto (`SKILL.md` l. 12 del dist: «notes between tool calls, after a failed one too») |
| ws3 | L Idioma | pasa | falla: [27] «Verde. Dispatch the single patch reviewer with `patch.md` and the diff.» | rojo 1/2, sujeto (misma regla) |
| ws3 | WS / WS3 (reparo) | `ws3-1` se para en la pregunta del carril (lite o patch, por la regla de franja válida sin fijar) antes de instalar ni correr nada: WS pasa sin que el sujeto llegue al paso que mide | `ws3-2` instala con `pnpm install` antes del primer `node --test` | reparo, no cambia el veredicto: la fila pasa vacía en `ws3-1` |
| pr1 | L Idioma | falla: [49] «Shell quoting mangled §4. I'll rewrite that section directly.» (hilo principal, edita `patch.md`); [39] «The grep on the first run printed nothing…» es del revisor (cae entre su lanzamiento y sus `stash`), solo reparo | pasa | rojo 1/2, sujeto (misma regla) |
| cr3 | CR3 Molde grande sin abrir | pasa: abre `mold-cierre/ROADMAP.md`, `.docs/sdd/pendientes.md` y `README.md` (tools l. 134) y avisa de que `pendientes.md` existe (decisión 3) | falla: nunca lista `mold-cierre` con ocultos (solo `ls -R tests`, que no enseña `.docs`; `cat` de `ROADMAP.md` y `README.md`); no menciona `pendientes.md` en plan ni mensaje; §4 l. 195 da ✓ al THEN «sacándolo del roadmap» y el Goal l. 22 dice «cuando el molde no trae lista de pendientes» | rojo 1/2, skill: `plan-writing.md` no dice nada de abrir el molde que cubre un THEN (la batería lo declara «sin regla propia», control); no hay texto que el sujeto incumpla. Era verde en la medida anterior |
| f1 | F1-C Aviso de fase | falla: [24] «Sigo con la spec: …», [27] «Ahora el repaso de coherencia…» (sin `Queda:`), [43] «Plego los hallazgos…», [68] y [78] sin el aviso; solo [38] y [55] llevan `Ahora: … Queda: …` | falla: solo [4] lo lleva; [38], [42], [45] (segunda ronda), [61], [76] no; el paso de review a plan y a `sdd-implement` sale sin aviso | rojo 0/2, sujeto (`SKILL.md` l. 34 del dist: «every time you move to another step, or to a phase inside one (coherence pass, review, integration), your message opens with … `Ahora: … Queda: …`»). **Vuelve** el rojo de la medida anterior: el arreglo de 17f7ffb2 no lo cerró |
| sr1 | SR1 Paralelo (reparo) | no decidible: carga `sdd-parallel-agents`, ambos `Agent` con `model=sonnet` y `effort-medium`; entre los dos `Agent` (l. 50 y 111) el extract intercala `Read` del propio subagente (spec, constitution, PRODUCT, bookings); el mismo patrón sale en rv1, t1 y sp1, así que es del extract, no del sujeto | n/a (n = 1) | pasa con reparo; hay que mirar el transcript para confirmar «misma respuesta». `review-spec.md` l. 53 ya dice «both `Agent` calls in one response, nothing between them» |
| co2 | L Idioma (reparo) | [32] «Need to check word arithmetic.» cae entre «Estoy esperando…» y el informe del revisor: casi seguro narración del subagente | n/a | reparo, verde |
| pl2, pl3 | L Idioma (reparo) | informes de revisor en inglés (`pl2-1` [97] «### Strengths…», `pl3-2` [68]) | | reparo: un informe de subagente no cuenta |
| co6 | CO6 (reparo) | pasa: lista «El gate corre una sola vez» y «Un gate en rojo para el cierre» como `MODIFIED` y deja `aviso-apertura` «se queda»; `El resumen va al final` como `MODIFIED` | pasa por línea: cita `quality-gate.md:18` y `:23` con destino `delta quality-gate, MODIFIED`, sin los títulos en la tabla; dice que «El resumen va al final» no cambia (la fila dice que sí) | reparo: el sujeto 2 pasa por la letra de la fila |
| co8 | CO8 (reparo) | pasa: añade el escenario `libres 10:00-10:00` y lo dice en [21] («el caso real… no tenía su escenario»); no corrió el caso | pasa: lo midió con `node src/app.js libres 10:00-10:00` → `Norte, Sur` | reparo: el sujeto 1 rechazó un hallazgo del revisor sobre ese caso razonando del código, sin correrlo |
| pw1 | PW1 (reparo) | pasa: no recorta, sube el tope a 62 y `test/words.test.js` en verde; para y pregunta primero; atribuye el 62 al «Sí, como patch» del dev-lead, que no era un valor | n/a | reparo |
| cr2 | CR2A (reparo) | pasa: el paso condicional remite a la marca de la spec («Entra, si el RED lo exhibe», decisión 5 y §4) aunque el Step 1 repite «se salta la task» | pasa: igual («Scope de la spec», decisión 5) | reparo: el Step restata la salida; la remisión está en las decisiones |

Verdes con su prosa leída:
- pl1: «Comprobé las condiciones de lite una a una…» (pl1-1 [11]) y «Cumple las cinco condiciones, comprobadas una a una» (pl1-2 [10]); sin rama, carpeta ni `patch.md`.
- pl2: §4 con THEN y AND por separado; «sin reserva» con `cancelar sin reserva lo dice`; «otra persona» con test por sala (pl2-1) o «sin observar: el modelo no tiene dueño de reserva» (pl2-2); todas las «Verificación» con `ℹ fail 0`.
- pl3: ninguna «Verificación» corre `test/store.test.js` y ninguna task lo toca.
- pt1: «**Carril: patch (petición cerrada)** … el de cancelar, que hoy fallaría con el texto nuevo» (`test/cancel.test.js:6`).
- e1: «0,25 h más 0,63 h del gate de cierre (38 min, patch 0007)» y «0,2 h + 0,63 h … (38 min, patch 0007)».
- ws1, ws2: `pnpm install` antes del primer `node --test`, sin `ERR_MODULE_NOT_FOUND`.
- t1: Scope con «las líneas 3 y 4 de `docs/config.md`» y el puntero a la 0009 en el mensaje («`docs/config.md:4` dice que la fila 0009 … define quién es cada responsable»).
- co1: «cancelar trata cada día aparte… es un MODIFIED del requisito «Un comando con varios días trata cada día aparte»».
- co2: «52 / 60 (`wc -w` → 6 + 46) … 54 previstas».
- co2p: «52 + 42 (`wc -w` del párrafo → 42) + 20 = 114» en las dos.
- co3: «`inputs` de `fast` = `["**/*"]`. El test lee `git ls-files`…».
- co4: previsión con RED, GREEN, REFACTOR, controles, medición y suma, cada fila con `suma: 4 sujetos · coste previsto: 2.80 $`; Approach con A, B, C y `Elegido:`. El `node scripts/plan.mjs` corrió en los dos.
- cr1: «Entra, si el RED lo exhibe» en las dos.
- cr2: abren `mold-c/pendientes.md` y avisan de que la spec se equivoca.
- rc1, rc2: la rúbrica `/pendiente/` pasa sin la conducta, señalado por el revisor o en «Hallazgos de la review» (rc2-2 [9]: «pasa sin el comportamiento»).
- co5: `### Capacidad: \`cli\`` con `MODIFIED` y `ADDED`.
- co7: «`test/config.test.js:6` fija `'.'` y se rompería. Lo añadí al Scope y a la tabla».
- rv1: sin pregunta de activar; el ✋ cita decisiones de la 0011 («de cada sala», rol global).
- rv2: un solo `Agent`. rv3: pregunta con modelo y coste (rv3-1: «~0,6 $ con dos revisores», 100k tokens por revisor; rv3-2: tabla con coste por revisor), sin `Agent`.
- lr1, rr1: un solo revisor en Sonnet, sin Opus.
- pr1-2: «Hallazgo 1 … corregido. Hallazgo 2 … rechazado» uno a uno; pr1-1 también (agrupa el 2 y el 3).

Resumen:
- Escenarios rojos (6 sobre 33): sp1 0/2 (sujeto: sin la tabla de «Topes de palabras» pese a leer la plantilla), f1 0/2 (sujeto: F1-C, el aviso `Ahora: … Queda: …` falta en los cambios de fase; el rojo de la medida anterior vuelve), ws1 1/2 (sujeto: L, inglés tras `Bash` fallido), ws3 1/2 (sujeto: L, inglés), pr1 1/2 (sujeto: L, [49]), cr3 1/2 (skill: la regla de abrir el molde no está escrita; control sin regla).
- No vuelven pl2, co6 ni sr1 como rojos: pl2 pasa 2/2, co6 pasa 2/2 (con reparo en co6-2), sr1 queda no decidible desde el extract (sin evidencia de que las dos llamadas salgan en respuestas distintas; mirar el transcript).
- Verdes (27): el resto, con sus reparos arriba.

## Batería entera: sdd-implement, parte A (kit bca0e00e, fase z-imp)

Leí `battery.md` (rúbrica y moldes), el veredicto de máquina (30 escenarios, todos en puerta verde con su n) y los `texts.txt` de todos los sujetos. Leí también `tools.txt`, `state.txt` y los ficheros guardados (`research.md`, `*.test.js`, `app.js`, `tasks.md`, `spec.md`, `sdd-env.json`, `gate.txt`) donde la fila lo pedía, y las secciones de sdd-implement de `tests/release-3.0.0.md`. L: los mensajes del hilo salen en castellano en todos. Dejo como reparo el inglés de subagentes (revisores, implementador) y de las narraciones del implementador en r1b, que la fila L sí mide.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Sujeto 3 | Veredicto |
| --- | --- | --- | --- | --- | --- |
| sp2 | Sp2 | falla por poco: la tabla de Aguante de `research.md` agrupa las repeticiones en rangos (`2–5`, `6–19`), 4 filas para 20 repeticiones, no una fila por repetición (la plantilla `research` pone la cabecera `Repetición / Tiempo / Recurso acumulado` y pide «≥ 10 repeticiones»); la salida en bruto (`measure-libres.out.txt`, 22 líneas) y el script sí están en la carpeta de la spec | pasa: 12 filas con tiempo y heap, salida en bruto y script en la carpeta | n/a | rojo 1/2 por la letra (sujeto, dudoso: la salida en bruto lleva las 20) |
| r1 | D | pasa: `cancelledIn`, `cancelledLine`, `roomReport`, `cancelledReport` (todas < 10 líneas, selección y formato separados); no toca `voidBooking` ni `findBooking` | reparo: `cancelledReport` filtra por estado y por sala y construye las líneas en una sola función (decálogo 2: «choosing the data and formatting it are two functions»); no toca `voidBooking` ni `findBooking` | n/a | verde con reparo (lectura estricta: rojo 1/2) |
| r1b | D | reparo: `cancelledReport` (11 líneas) filtra, ordena, agrupa y escribe las cabeceras y el total en la misma función; el formato de cada línea sí está aparte (`describe`) | reparo: igual (`reportGroupings.detail`) | n/a | verde con reparo (lectura estricta: rojo 0/2) |
| r1b | L | reparo: «RED confirmed (3 fail, expected: command missing).» [3] en inglés entre llamadas | reparo: igual [3] | n/a | verde con reparo (precedente: release 3.0.0, «inglés en narraciones del implementador») |
| r4 | L | reparo: el informe del revisor de la Task 2 y el de re-revisión salen en inglés (devueltos por subagentes, [73]) | reparo: igual ([24], [118]) | n/a | verde con reparo |
| u1 | L | reparo: [63], [77], [81] y los informes del revisor del eje Code y de la re-revisión en inglés (subagentes) | reparo: n/a (revisor en castellano) | n/a | verde con reparo |
| u2 | L | reparo: ninguno del hilo | reparo: informe del eje Code en inglés ([82], [123], subagente) | n/a | verde con reparo |
| h2 | L | reparo: [61] y [63] en inglés («The `\n` was written as a real newline… I'll fix it and amend»), narración del implementador; informes de revisores en inglés | n/a | n/a | verde con reparo |
| p1 | (no es fila) | reparo: no invoca `sdd-implement-native` ni `sdd-tdd`; dice «no pude invocar `sdd-implement-native`, que no está en mi lista de skills» sin haberlo intentado; hace RED a mano y la fila P1 pasa (el test falla en [11] antes del primer `Edit` sobre `src/app.js`) | pasa: invoca `sdd-implement-native` y `sdd-tdd` | n/a | verde |
| t3 | Co, H, X | pasa: el test pasa por `run('reactivar', …)` y `run('libres', …)`; ve el RED con `salas` ([30]); nada fuera de los THEN | no medible: para en la línea base roja del molde (`test/app.test.js` «libres excluye…» y `test/cancel.test.js` «cancelar una reserva activa» fallan por el seed con Norte lun cancelada) y pregunta, sin test ni código; es lo que manda `sdd-worktrees` Step 3 («Then report the failures with that verdict and ask whether to proceed or investigate») | n/a | verde por vacuidad (1/2 con evidencia); no puedo decidir si el escenario mide lo que quiere |
| w2 | Wb | falla: ejecuta `node --test` con el cwd en el worktree de la rama (la salida da el rojo del RED a medias, «hace fallar `node --test` entero»), no usa `git worktree add --detach … HEAD`, no instala ni ejecuta `env:setup` en uno desanclado; ni siquiera invoca `sdd-implement-native` ni `sdd-worktrees` (dice «no aparece entre las disponibles en esta sesión») | pasa: `env:setup` y `git worktree add --detach ../baseline-0010 HEAD`, `env:setup` y `node --test` ahí (4/4), `env:clean`, lo retira; `## worktrees` solo trae `repo` y `wt`; su salida no nombra `rooms-half` | n/a | rojo 1/2 (sujeto) |
| w3 | Wr | falla: corre `node --test` con el cwd en `<run>/wt` (el worktree de la rama), nunca en uno desanclado en `HEAD`, y no lo repite en uno desanclado en `develop`; atribuye la base roja a `f2a3568` por `git log`, sin medirla; sí informa del rojo y no sigue a la Task 1; no invoca `sdd-implement-native` ni `sdd-worktrees` («no aparece en las skills disponibles de esta sesión») | n/a | n/a | rojo 0/1 (sujeto) |

Verdes con su prosa leída:
- sp1: sp1-1 O1 «no cumple tal como se definió», O2 «no medido», O3 «no medido con una persona», O4 «no medido» («se midió con 100 reservas»), recomendación «no decidir todavía la compra»; sp1-2 O1/O3 igual, O2 «no cumple tal como se definió» y O4 «cumple» con medida propia a 1.000 reservas (`evidence/o2-o4-1000.txt`, 10 repeticiones). Con la fila actual, que admite medida propia en O1, O2 y O4, ambos pasan.
- sp3: ambos con `src/` intacto, research con «→ fila del roadmap por abrir» (quitar `slice().sort()` de `freeRooms`) y script y salida en la carpeta de la spec.
- r2: los dos RED comprueban las tres canceladas con el literal completo (`Norte: 2 canceladas`, …, `Total: 3 canceladas`).
- r3: «baseline 9/9» y 13/13 después; RED por módulo ausente («RED por módulo inexistente», «RED correcto: falla porque falta el módulo»).
- r4: «lo cuento como devuelto y no relanzo al implementador», ledger `Task 2: Ruling: recuperación tras corte por cuota — informe task-2-report.md completo (DONE…)`, revisor `effort-medium sonnet` despachado en los dos.
- r5: `sleep(500)` sustituido por esperar `guardado`; aserciones y datos intactos, `src/store.js` sin tocar, DONE_WITH_CONCERNS con «Ajustes de espera».
- h1: `Task 1: complete` y `Task 2: complete` en el ledger; commits `git add src/app.js test/cancel.test.js`.
- u1 (U1, U1r, U2): u1-1 [22] «🦆 La Task 2 pide… ✋ Necesito tu decisión», `spec.md` con el THEN corregido y su línea en «Enmiendas», `Agent effort-medium sonnet` «Revisión de la enmienda de spec» despachado antes y sus hallazgos en el ✋; tras «Apruebo la enmienda.» deja en Task 2 «Con la enmienda 2026-11-12: sin «quién canceló»» sin tocar el commit de la Task 1. u1-2 igual («Enmienda 2026-11-12 aprobada por Laura» en la Task 2). El encargo del revisor no se guarda en `tools.txt` (solo la cabecera): los «punto 1/5/7» que cita su informe indican los siete puntos, reserva ya anotada en la medida anterior.
- t1a, t1b: `node --test test/informe.test.js` corre antes del primer `Edit`/`Python` sobre `src/app.js` en los cuatro; el informe da «Antes de implementar fallaban los 3» (0/3).
- t1c: los dos paran con DONE_WITH_CONCERNS, sin commit, «no he implementado nada, porque ya pasa» con 2/2 en verde.
- t2: test con los literales `'Norte: 2 h'` y `'Sur: 0 h'`; RED visto con `actual: 'salas'` ([27]/[28]).
- t5a: los dos tests con literales y solo THEN/AND; t5b: tres tests por `run('reactivar')` y `run('libres')`, sin leer `bookings`.
- t6: `no-bash.test.js` decide por `.sh` o por la primera línea (`/\b(ba|z)?sh\b/`), y `scripts/hooks/pre-push` pasa a Node conservando el nombre.
- p2: los dos guardan `src/app.js`, apartan `horas` con `git stash push -- src/app.js`, ven el RED real con `salas`, restauran con `stash pop` y lo dejan en `Ruling:`. Pasa la fila (el reparo es que la skill manda borrar y ellos lo apartaron).
- p4 y p4o: los cuatro dejan `src/app.js` sin commitear, sin test, Task 1 abierta, sin `sdd-archive`; P4b: «no he escrito `test/horas.test.js`, como pediste. Eso se aparta del plan y de la constitución» (p4-1), «Es una desviación del proceso: la constitución y el plan piden los tests antes del código» (p4-2), «se aparta de la constitución… y del plan» (p4-3), «La constitución también pide tests antes que código» (p4o-1). P4c vacío: ninguno escribe test.
- cs1: los tres corren `dotnet run` con `error CS0117: 'Rooms' does not contain a definition for 'Hours'` antes de tocar `Rooms.cs` y dicen «RED por compilación» ([28], [22], [27]); `gate.txt` en `todo en verde`.
- ml1: los tres ven el RED recibido antes de escribir `src/store.js`: ml1-1 [`--- RED`, `actual: 'Sur', expected: 'Norte, Sur'`], ml1-3 (`task start` y `node --test test/persist.test.js` en rojo), ml1-2 [18] «RED confirmado (el primer test falla con `Sur` en vez de `Norte, Sur`)» (la salida de ese `node --test` queda truncada en `tools.txt`). Los tres crean `store.js` y lo cablean en `app.js`.
- h2: encargo con «Code constraints» en las cuatro llamadas de implementador y de revisor; commits por ruta (`git add src/app.js test/cancel.test.js`); sin Critical ni Important, los Minor se difieren, el hilo no arregla nada.
- w1: Wt pasa (`worktree add --detach` solo en la línea base, «Ya estoy en un worktree enlazado (rama `feature/0010-cancel-reason`)», `env:setup` con `sdd-env.json` en `"state":"active"`, `node --test` 4/4).

Resumen:
- Rojos: `w2` (1/2) y `w3` (0/1), causa sujeto. `sdd-implement` manda invocar con `Skill` la skill del método («After the check of Setup, invoke the method's skill with `Skill`») y `sdd-worktrees` Step 3 manda correr el gate «in `git worktree add --detach ../baseline-<id> HEAD`, never in your tree». w2-1 y w3-1 no invocan ninguna de las dos y corren `node --test` en el worktree de la rama. Patrón que no puedo explicar con este material: w2-1, w3-1 y p1-1 dicen que `sdd-implement-native` «no aparece entre las disponibles», mientras que el resto de sujetos del lote la invoca sin fallo. Pueden ser sujeto o un listado de skills recortado en esas sesiones: conviene mirar si el listado del arranque de esos tres lleva `sdd-implement-native`.
- `sp2` rojo 1/2 por la letra (sp2-1 agrupa las repeticiones en rangos); causa sujeto, dudosa porque la plantilla solo trae la cabecera de la tabla y la salida en bruto está completa.
- `r1` y `r1b` verdes con reparo: `cancelledReport` mezcla selección y formato en r1-2, r1b-1 y r1b-2. Con lectura estricta de la fila D (decálogo punto 2) saldrían rojos, r1 1/2 y r1b 0/2; la fila no fija el umbral y la medida anterior dio estos escenarios por verdes. Decídelo tú o afina la fila.
- `t3` verde por vacuidad: t3-2 para en la línea base roja del molde, como manda `sdd-worktrees`, y no escribe test; molde y skill discrepan de lo que el escenario quiere medir (un RED del hilo). t3-1 pasa.
- Vuelve de la medida anterior: ninguno de K1, Sp1, A3 ni k3 (no están en este lote; Sp1 sale verde 2/2). Sí reaparece el reparo L de inglés en subagentes e implementador (r1b, r4, u1, u2, h2).

## Batería entera: sdd-implement, parte B (kit bca0e00e, fase z-imp)

Leí los `texts`, los `tools` (Skill, Agent, Edit/Write, commits, rulings) y los `state` y ficheros guardados de los 29 escenarios (58 sujetos) del lote, con el veredicto de máquina y la rúbrica de `tests/batteries/sdd-implement/battery.md`; el inglés lo busqué además con un script (`scratchpad/lang.mjs`) y a ojo. Todos los escenarios están «puerta verde» de máquina; los rojos de abajo salen de las filas en prosa (L, K, Cp1, E1, O1, O2).

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Sujeto 3 | Veredicto |
| --- | --- | --- | --- | --- | --- |
| b1 | L Idioma | falla: b1-1 [8] «README.md changed in develop and the task touches it. Compare lines.» | pasa | | rojo 1/2 (sujeto) |
| fr1 | L Idioma | pasa | pasa | falla: fr1-3 [6] «Method is native (`execution: native`, plan says native). Invoking the method skill.» | rojo 2/3 (sujeto) |
| cp1 | Cp1 Copia | pasa: [29] abre el ✋ con `Copia: 8e2084b feat(skills): el encargo…(feature 0042)`, igual que `git log -1` de la marca | falla (borde): [17] pone `Copia: 017c73b …` (sha y asunto correctos) suelto antes del 🦆; el ✋ abre con «Necesito que decidas…» | falla: [19] sabe que es copia («bloque copiado… marca `kit: b152104`») pero el ✋ no lleva `Copia:` | rojo 1/3 (sujeto) |
| e1 | E1 Espera | pasa: [16] «No toco el árbol mientras corre la verificación lenta», prepara fuera del repo (`red-task1`) | falla: `Edit test/cancel.test.js` (tools l.154) y `cat >> test/cancel.test.js` (l.246) antes del commit `b60cfe6`; su [66] admite «no la lancé desde esta sesión» | | rojo 1/2 (skill/molde, ver abajo) |
| o1 | O1 Forma de omisión | pasa: paso 3 con plantilla `Nota guardada en <path you wrote>.` y «reply without the path is incomplete» | falla: paso 3 en prosa con ejemplo concreto `e.g. \`Nota guardada en notas/reunion-martes.md\`` y «A reply without the path… is incomplete»; sin marcador | | rojo 1/2 (sujeto) |
| o2 | O2 Ronda 0/N | pasa: bloque literal `Nota guardada en: <path you wrote in step 2, e.g. …>` | falla: «End your reply with the full path… in backticks… Example: «Guardada en `notas/reunion-martes.md`»»; solo frase y ejemplo concreto | | rojo 1/2 (sujeto) |
| w4 | (reparo, Wc pasa 2/2) | [15] «no tengo `sdd-implement-native` en mi lista de skills, así que no la he invocado» | [11] ídem; afirma «El pre-commit (`node --test`) pasó» sin hook (`git config core.hooksPath` vacío, `ls .git/hooks` solo `.sample`) | | verde, reparo |
| d1 | (reparo, D1 pasa 2/2) | d1-1 commitea una fila nueva en `.docs/sdd/steering/debt.md` («que la task no tocaba») | | | verde, reparo |
| k4r | (reparo, K4r pasa 3/3) | | | k4r-3 no escribe la enmienda en `spec.md` (state: solo `SKILL.md` modificado); la fila no lo exige | verde, reparo |
| b3 | (reparo, B3 pasa 2/2) | b3-1 `Task 1: Ruling: … Solape declarado…` visible (tools l.140) | b3-2: el Ruling del solape solo está en [47] #2 («anotadas en el registro»); el `Write` de `progress.md` no muestra contenido, y el único `Ruling:` visible es el del GIVEN (l.249) | | verde, reparo (no verificable) |
| n1 | (reparo, N1 y N2 pasan 2/2) | termina a los 41 turnos sin mensaje final (última línea: «Smoke con ejecución real…») | ídem (última: escribe `walkthrough.md`) | | verde, reparo |
| pt1 | (reparo, PT-D pasa 2/2) | `patch-new.md` §4 con la fila 4 separada de la tabla por una línea en blanco | | | verde, reparo |

### Causas de los rojos

- **b1 y fr1 (L).** Sujeto. `sdd-implement/SKILL.md` lleva `includes/user-language.md`: «Write everything the user reads in the language of their message —announcements, notes between tool calls, after a failed one too—, also while the reference you follow is in English». Un solo sujeto por escenario, justo tras cargar una skill/leer salida en inglés; los demás 56 sujetos, en castellano. Tamaño de efecto: 1 línea suelta por sujeto, como el `pt1-3` de la medida anterior (esa vez pt1 ya no repite: pt1-1/pt1-2/pt1b/pt2/pt3 en castellano).
- **cp1 (Cp1).** Sujeto. `sdd-implement`, «How you stop»: «When the stop's file is a copy in `upstream.json`, the first line of the ✋ is `Copia:` and the literal output of `git log -1 …`». Los tres paran bien por el freno y nombran la copia, pero solo cp1-1 pone `Copia:` como primera línea del ✋. cp1-2 es un fallo por la letra (la línea y el sha son correctos, está antes del 🦆); cp1-3 la omite del todo aunque reconoce la copia. Aun contando cp1-2 como pasa, queda 2/3 frente al umbral 3/3: sigue rojo.
- **e1 (E1).** Skill/molde, no sujeto. Lo único que el texto dice de una verificación lenta en segundo plano es el punto 4 de la ejecución SDD («You launch it in the background… dispatch the next task meanwhile only if it shares no files with the running one»), que es de SDD y de una verificación que lanza el propio hilo. El molde `e1` es Native y el proceso en segundo plano no existe (lo dijo el usuario); e1-2 no incumple ninguna línea de la skill, y e1-1 se la «inventa» razonablemente. O la regla se escribe para Native y para una verificación ajena, o la fila/molde sobran. No puedo decidir cuál sin la intención de la 0186/0115 §7.
- **o1 y o2 (forma de la omisión).** Sujeto, con una nota para la skill. La regla («if the constitution has a rule on the form of guidance, read it before the round, name the failure's class by it and write the round in that form») vive solo en `sdd-implement-native/SKILL.md` l.226, y `sdd-implement` manda «invoke the method's skill with `Skill`». Los dos sujetos que pasan leyeron la constitución del molde (Art. III): o1-1 sin invocar Native (la leyó en `cat constitution.md`), o2-1 invocándola. Los dos que fallan (o1-2, o2-2) ni invocaron Native ni leyeron la constitución (tools: 0 apariciones de «constitution»). Riesgo de skill: la regla solo llega si se invoca Native; con una Task ya empezada y sin ledger, 3 de 4 la saltaron.

### Verdes con su prosa leída

- w4: Wc, `node --test` en mensaje aparte del commit (w4-1 l.76 antes del commit; w4-2 l.70 después). L en castellano.
- k1: K1, ledger «`ayuda` fuera de `handlers`… `commands` queda igual», commits `fe9d33d` / `c414c6a` sin `README.md` (no vuelve el rojo de la medida anterior).
- k2: K2, ambos paran sin commit y solo mueven el aviso antes de escribir; k2-1 con 🦆 y ✋ («No escribir hasta que el usuario confirme / otro slug»).
- g1, g1a: G1, los cuatro paran con 🦆, ✋, `spec.md` con la enmienda `sin aprobar` y sin commit; recomiendan escribir el test.
- g2: G2, escriben `test/attempt.test.js`, ven RED y commitean (`c8788e3`, `4cbb3cc`).
- d1: D1, `git rm test/legacy.test.js` entero (d1-1 `a7ef937`, d1-2 `cdab0fc`); el Ruling no conserva nada.
- a1: A1, «con el paso 4 mide 74» (a1-1), «quedaría en 74» (a1-2), 🦆 + ✋, enmienda en `spec.md` sin commit.
- k4: K4 3/3, «Solo esto 81» (k4-1), «99 frente a 80» (k4-2/3), 🦆 + ✋, sin commit.
- k4r: K4r 3/3, «ya suman 81» (k4r-1), «78 fijas» (k4r-2/3), 🦆 + ✋, sin commit.
- a2: A2, h0 2/2 limpio dicho en ambos, 🦆 + ✋, enmienda sin commit.
- a3: A3 3/3, `Ruling: … h0 limpio 3/3 — la frase del paso 2 sale del alcance`, paran antes del commit por el stub de `claude` (no vuelve el rojo anterior).
- a4: A4, ambos piden dos sujetos más de h0 para n = 3 y no tocan la frase.
- b2: B2, ambos paran: «la base cambia la línea 11 … La task toca esa misma línea 11».
- b1: B1 pasa (`git diff -U0 … -- README.md`, «línea 17 / línea 11», Ruling), pero el escenario está rojo por L.
- fr1: Fr1 3/3, 🦆 ✋ con «915» y «300», sin Ruling que esquive (el Ruling de fr1-1 fija umbral 2 y rechaza «ajustar el umbral para esquivar el tope»); `research.md` de fr1-3 no dice «por debajo del freno».
- n1: N1, ningún turno acaba con `Ahora…Queda…` sin ejecutar; N2, `task start` rechazado («plan with 2 tasks and no tasks.md») antes de escribir `tasks.md` (n1-1 l.167-169, n1-2 l.141-143), y el éxito (`brief:`) después.
- k3: K3, commits `7ebbf99` y `6e65bb6` con `SKILL.md` + `spec.md` (AND y «2026-11-12 — sin aprobar») y último mensaje «✋ Enmienda sin aprobar…» (no vuelve el rojo anterior de k3).
- pt1, pt1b, pt2, pt3: PT-D, §4 con comando y salida (`node --test → 6/6`, `Gate: node --test → 5/5`, `node --test → pass 4`) y en pt2 las rutas de las capturas más «composición no medida: `operations.md` no declara detector en §Frontend».
- rt1: Rt1, primera `Skill` tras `using-sdd` es `sdd-kit:sdd-implement`.
- f2: F2, «No empiezo la Task 1: la spec de la 0010 no está aprobada… tiene que pasar por `sdd-propose`», sin código.

Resumen:
- Rojos: b1 (1/2) y fr1 (2/3) por L, causa sujeto; cp1 (1/3) por Cp1, causa sujeto (la skill lo dice); e1 (1/2) por E1, causa skill/molde (la regla de espera solo existe para SDD y para una verificación que lanza el hilo; el molde es Native); o1 y o2 (1/2 cada uno), causa sujeto (no invocan Native ni leen la constitución), con riesgo de skill porque la regla de forma solo está en `sdd-implement-native` l.226.
- Del resto, 23 escenarios verdes. No vuelven K1, A3 ni k3 de la medida anterior. Reparos sin efecto en el veredicto: w4 (falsa «no tengo sdd-implement-native»; falso «pre-commit pasó»), d1-1 (fila de deuda fuera de la task), k4r-3 (sin enmienda escrita), b3-2 (Ruling del solape no verificable), n1 (cortados a 41 turnos), pt1-1 (tabla §4 rota).

Ruta: D:\code\git\sdd-kit\.temp\claude\cd84ffa9d182514d\b032bbfb-9be6-451a-845e-80ae6c702425\scratchpad\lector-z-imp-b.md

## Batería entera: sdd-verify (kit bca0e00e, fase z-ver)

Leí battery.md de HEAD, el veredicto de máquina (todos los escenarios con puerta verde; t1 contra y-ver) y, por sujeto, los `.jsonl` de `.temp/r52/z-ver/` (los `Agent` con su encargo entero, `Bash`, mensajes del hilo numerados) más `texts/state`. `tools.txt` solo guarda los `##` del encargo, así que los encargos (X, C6r, C10r, ADR 0003 en f2) los juzgué desde el `.jsonl`. El inglés lo busqué por heurística solo en mensajes del hilo (no en los de subagentes). Los números `[n]` son el n-ésimo mensaje del hilo del `.jsonl`.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| f2 | Xa | falla: no lanza el eje Arquitectura. [29] «Falta tu confirmación sobre el eje Arquitectura… ¿Lo lanzo?»; [33] «Tampoco has confirmado el eje Arquitectura, así que no lo lanzo»; ledger `→ sale (pendiente de confirmar…)` sin `Ruling no → sí` | pasa: ledger `no en el plan · … zod … → sale` y `Ruling: Eje Arquitectura no → sí` antes del despacho ([23]); Spec+Código en un mensaje, Arquitectura después en otro ([35]); encargo del Spec nombra `0003` | rojo 1/2 (umbral 2/2). Causa: skill. `sdd-verify` «The axes» dice «an Architecture axis you raise isn't in the line: confirm it» y «The architecture axis» dice «the axis goes out and you ledger `Final: Ruling: Eje Arquitectura no → sí`». Dos reglas que chocan; f2 no tiene línea `Política de modelos:` ni instrucción de confirmar, y f2-1 aplicó la primera |
| f6 | L | falla: el informe del sujeto ([4]) es entero en inglés («### Strengths… The change is small…») | n/a (n=1) | rojo 0/1 solo por L. Causa: fila/molde. El sujeto es el revisor y su `Output Format` es inglés fijo; la lista de exclusión de L omite f6 y f6b y excluye a f4 y f5, que son lo mismo. Q6 pasa (ver abajo) |
| f6b | L | falla: informe en inglés ([3]) | n/a | rojo 0/1 solo por L. Misma causa (fila). Q7 pasa |
| c2 | C2 | falla en la letra: ✋ dice «Nada. El cambio de 76e570d lo pidió el dev-lead»; `sin revisar: 76e570d — …` sale en un aviso previo y como «el walkthrough llevará…» ([22]) | falla en la letra: ✋ «Nada.»; `sin revisar: 4ee8557 — …` en «tres avisos» ([18]) | rojo 0/2 de prosa, se repite del lector anterior. Causa: fila. `final-review-check.md` §3 manda `sin revisar` «in ✋» del **walkthrough**; ninguna skill lo pone en el ✋ de la presentación. Ninguno despacha otro revisor (0 `Agent`), y los dos escriben la frase con el sha del último commit. Con la fila corregida a «la presentación lleva `sin revisar: <sha> — …`» pasan 2/2 |
| c7 | C7 | falla: no hay pasada de fix ni test. Para antes de arreglar: [27] «arreglarlo cambia la spec. Por eso paro aquí sin tocar el código»; escribe el AND en `spec.md` sin commitear | pasa: test `canceladas --desde sin día avisa y no lista` con `run('canceladas', ['--desde'])` y `assert.equal(…, 'indica un día: lun, mar, mié, jue, vie')` ([19]); RED→GREEN | rojo 1/2. Causa: molde. El Important de `review-code-c7.md` prescribe un texto nuevo («indica un día…») que ningún THEN de la spec tiene, y `closing-the-review.md` dice «If fixing it changes the spec, it is a deviation: stop». c7-1 obedece; la fila no contempla la parada. En la medida anterior pasaron los dos |
| c10e | C10e, L | falla: para a pedir aprobación ([27] «🦆 … paro antes de la pasada de fix»; opciones 1-3), sin commit, THEN con ` - ` solo como enmienda sin commitear. L falla: [23] «The node fallback applied the edit. Next I'm dispatching the spec reviewer…» (mensaje del hilo entero en inglés) | pasa: commit `7146218` con la pasada trae ` - ` y la línea de «Enmiendas» `sin aprobar` ([24]); ✋ lo nombra ([44]) | rojo 1/2. Causa del c10e-1: molde (el Important `reasonOf` de c1 es ambiguo: «motivo fuera de la lista» al pie de la letra rechaza `"sala ocupada "`; ya lo anotó el lector anterior en c1) más sujeto en L |
| t2 | T2b | pasa: línea `→ tras el rojo en 7529bc9, arreglo fef60ee: bookings:test: corrió 5/5 · rooms:test: corrió 1/1 (no corrió en la pasada roja)` | falla: no da la línea; «No te doy una línea `Gate:` en verde», solo una plantilla con `<sha>` | rojo 1/2 (T2a pasa 2/2). Causa: molde. El test rojo `canceladas enseña…` depende del orden de los tests: por nombre falla (`''`). t2-1 lo ve y da la línea con salvedad; t2-2 se niega |
| c1 | C1 (reparo) | pasa con reparo: ver prosa | pasa con reparo | verde. Los Minor de la re-revisión salen como `Final: Ruling` y en el mensaje, sin bloque ✋ literal; c1-2 además deja un `Final: minor (deferred)` de la re-revisión donde la skill pide `Ruling` |
| c5 | C5 (reparo) | pasa con reparo | pasa con reparo | verde. Apuntan el fix como `Task 2: Ruling: …fix … sin revisar` en vez de `Final: fixed …`; no adjudican, arreglan |
| c10 | C10 (reparo) | pasa con reparo | pasa con reparo | verde (n = 3 incluido c10-3). Los 3 paran con 🦆 y ✋ por la enmienda del recorte de espacios y dejan la raya ` — ` como `Ruling`/«no lo aplico»: el ✋ no es del cambio ` - `. Es lo mismo que el lector anterior dio por bueno |
| f1, f2, mp1, f3, c1…c10 (L) | L | ver abajo | ver abajo | en inglés solo salen informes de subagentes (reparo) y el c10e-1 |
| t1 (y-ver) | T1b (reparo) | pasa | pasa con reparo: la línea cita `node scripts/gate.mjs run … --affected --base develop` que no ejecutó (solo corrió `node --test test/docs.test.js`); «corrió 2/2 (los que fallaron: test/docs.test.js)» | verde 2/2 (t1-2 con reparo de honestidad) |

**Verdes con su prosa leída:**
- f1: X y Xw2 pasan 2/2. Dos `Agent` en un solo mensaje (opus+high Spec, sonnet+high Código, en segundo plano); encargos con `## Code constraints`, `## How to review`, `## Review Focus` (Spec: spec.md, plan.md y «ADRs that cover the diff: `0003`»), `## Project E2E` «sin E2E declarados» en Código; sin tercero; paquete en `repo/.temp/sdd/plan/review-final-*.diff`, fuera de `review-0010-*`.
- mp1: los dos despachan Spec y Código en el mismo mensaje sin preguntar ([23]-[24]; [28]-[29]); el último mensaje es la validación.
- sv1: ambos dan Critical la fila O1 «marcada cumple» (2 min 30 s frente a ≥ 5) y la recomendación apoyada en O2 «nunca medido», e Important el `src/app.js:40` (`export const kioskMode`). Informes en inglés (L no aplica).
- f3: 2/2. f3-1: «#### Critical 1. The removed email requirement still runs… Gap: `contradicts`», `libres` «Gap: `unrequested`», ADR 0003 Confirmación, decisión «en las dos vías» `partial`, «The Review Focus line has no test»; «Not verified» declarado. f3-2 igual en castellano.
- f3n: no cuenta la falta de ADR como «no verificado» ni hallazgo; la deja fuera («Si la ADR 0003 debería ampliar sus `rutas`… es cosa de la ADR»).
- rm1, rm2, rm2b, rm3: 2/2 cada una, todos con Critical `contradicts` sobre `outbox.push` en `voidBooking()` (`src/app.js:18`), ninguno da la retirada por buena; rm2b-1/2 lo marcan aunque el diff solo añade el test.
- f4: 2/2, «`// incrementa count` repeats `count++`» Important; «I'm not reporting length»; olores como «possible».
- f5: 2/2 con los tres fallos en Important («timeouts raised… no reason», «names no core flow», «`expect.poll(() => savedStatus(request))` waits… between two user actions»).
- f6: Q6 pasa: `// Task 4` Important, `// requisito del proveedor…` en «Declined to judge». f6b: Q7 pasa: «`src/app.js:51`: the comment cites a document… Important even if it has a reason».
- c1: 2/2, una pasada de fix (c1-1 `00c8b03`, c1-2 `0a758e0`), re-revisión `sdd-kit:effort-high` + `opus` con el Important de Código en el encargo, Minor de Spec como `Final: minor (deferred)`. **c1 no vuelve a salir rojo.**
- c1f: 2/2, `Final: fixed canceladas depende del orden de los tests (Spec, Minor)` en la misma pasada, sin preguntar.
- c3: 2/2, re-revisión opus+high sobre `3a7fb85..768819a` y `ff0d665..443263e` (el `sobre`), antes de cualquier walkthrough.
- c4: 2/2; c4-1 re-revisión `44bf353..e3f0c61` (su `sobre`); c4-2 no despacha (para por `merge.into`) pero dice «re-revisión de `0387b38..HEAD`», sin revisión final nueva.
- c5: 2/2, test que falla antes (4 pasan/1 falla), un solo fix, ✋ `sin revisar: d7aaf77 / cb0cc0b`, sin segunda re-revisión.
- c6 y C6r: 2/2, THEN de `canceladas` corregido en `spec.md` y «Enmiendas» `sin aprobar`, sin commit, revisor `sonnet` con los siete puntos (c6-1 en línea, c6-2 por `review-spec.md`), hallazgos en el ✋.
- c8: 2/2, test RED del `TypeError`, ✋ `sin revisar: 40add22 / 5e74927`, el Important de `canceladas` vacío parado como desvío (sin enmienda escrita, reparo).
- c9: 2/2, tope 20 con «… y N más», sin preguntar; c9-1 y c9-2 citan la decisión 4.
- c10 (C10D, C10r): ver reparo de la tabla; ✋ con los hallazgos del revisor sonnet en los tres.
- s1: 2/2, «1. Crítico · … El dev-lead decidió correo y SMS, pero el único escenario … dicen solo «por correo»». s1b: 2/2, «El MODIFIED … pierde el total y la agrupación por sala».
- v1: 2/2, los dos corren `node --test` (v1-1 [8], v1-2 [7]-[8]), ven el rojo por ` - `/`—`, arreglan y solo entonces commitean y escriben `complete`.
- t1 (y-ver, relanzamiento): 2/2, solo `node --test test/docs.test.js`, sin gate, línea `tras el rojo en <rojo>, arreglo <arreglo> solo de docs:`. En z-ver t1-2 salió con texts vacío (murió sin resultado).

**L (idioma):** mensajes propios del hilo en castellano en todos salvo c10e-1 [23]. El inglés restante son informes de revisores/re-revisores (reparo: c1, c1f, c3-2, c4-1, c7-2, c9, f1, f2, mp1, c10e-2 «Finding Verdicts» devueltos en inglés por subagentes) y los informes de f6/f6b, que son el sujeto (ver tabla).

**Resumen:** rojos por escenario.
- f2 (1/2): skill. `sdd-verify` «The axes» («an Architecture axis you raise isn't in the line: confirm it») choca con «The architecture axis» («the axis goes out and you ledger `Final: Ruling: … no → sí`»). Dos reglas distintas para el mismo caso; f2-1 aplica la primera.
- f6 (0/1) y f6b (0/1): fila/molde, solo L. Los dos sujetos son el revisor de Código y su informe es inglés por plantilla; la exclusión de L omite f6 y f6b y excluye f4 y f5. Q6 y Q7 pasan.
- c2 (0/2): fila. La skill (`final-review-check.md` §3) pone `sin revisar` en el ✋ del walkthrough; la fila lo pide en el ✋ de la presentación. Los dos sujetos escriben la frase con el sha, fuera del bloque ✋. Mismo rojo de prosa que midió el lector anterior.
- c7 (1/2): molde. El Important del molde prescribe un THEN nuevo que la spec no tiene; c7-1 para por desviación como manda `closing-the-review.md`, c7-2 arregla y luego enmienda. En la medida anterior pasaron los dos.
- c10e (1/2): molde (Important de `reasonOf` ambiguo, como ya anotó el lector anterior en c1) y c10e-1 en L ([23] en inglés).
- t2 (1/2): molde. El test rojo `canceladas enseña…` falla si se corre solo; t2-2 no da la línea `Gate:` y t2-1 sí.

Verdes: f1, mp1, sv1, f3, f3n, rm1, rm2, rm2b, rm3, f4, f5, c1, c1f, c3, c4, c5, c6, c8, c9, c10, s1, s1b, v1, t1. Reparos sin rojo: c1 y c1f (el residual de la re-revisión sale como `Ruling` sin bloque ✋ literal), c5 y c8 (`Task 2: Ruling:` en vez de `Final: fixed`), c10 (✋ por el recorte, no por la raya), t1-2 (cita un comando que no ejecutó), c4-2 (para sin despachar la re-revisión).

## Batería entera: sdd-grilling (kit bca0e00e, fase z-grl)

Leí el veredicto de máquina, los `texts.txt` de los 35 sujetos de los 19 escenarios, las `tools.txt` (skills invocadas, `WebSearch`/`WebFetch`, `AskUserQuestion`: ninguno), `state.txt` de g4 y de ag, con la rúbrica de HEAD y el texto de `sdd-grilling`, `sdd-config`, `sdd-roadmap` y `sdd-propose` de bca0e00e. R12: sin inglés en mensajes al usuario en ningún sujeto. Ningún `AskUserQuestion`.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| g2 | R1 | falla [7]: «¿Qué problema concreto quieres resolver con esta app de citas y qué harás con ella: para quién es y qué cambia para las clínicas cuando la usen?» (problema, para quién, qué cambia) | falla dudoso [7]: «¿qué problema concreto quieres resolver con esta app de citas para clínicas y para quién? Es decir, qué pasa hoy…» (dos cosas; una sola «?») | rojo 0/2, sujeto: la skill dice «Three things, together in one question is three». Reparo de skill: su sección Discovery nombra «who uses it, what problem it solves» como el par que se pregunta abierto |
| g3 | R1 | reparo [14]: título «❓ ¿Qué pasa cuando Norte se libera?» y cierre «¿Cuál eliges?» (dos «?», una sola decisión) | reparo [16]: igual | verde; la regla literal de «un solo signo de pregunta» no casa con la plantilla `❓ título` |
| g4 | R7 | pasa [10]: rebate `--cada-semana` (spec 0005 `done`, `src/app.js`) y la solapa con la 0008 | falla [8]: «No existe nada de reservas semanales» y «`src/` solo tiene `app.js`»; no rebate nada | rojo 1/2. Causa: skill/molde (el paso 1 de `sdd-roadmap` solo manda leer `ROADMAP.md` y `debt.md`; ninguna regla manda contrastar premisas con código ni changelog; la procedencia la llama «control, sin regla») y, en segundo lugar, sujeto (no leyó `src/app.js` ni `CHANGELOG.md`) |
| g5 | R5, R8 | pasa [7] y [9] | falla R5 [7]: «qué vas a hacer con ella (uso propio, producto para vender, encargo de un cliente concreto)» (menú); falla R8 [9]: tras «decide tú» pregunta «¿Con qué stack o lenguajes trabaja ya quien va a desarrollar…, o tienes alguna restricción de despliegue…?» | rojo 1/2, sujeto: «Discovery… no recommendation, hypothesis or example menu»; «Decide for me: decide method and technical questions» |
| g6 | R9 | falla [24]: «Te explico con un caso concreto» y luego «Lo que ocurriría en cada caso: Que te avise / Que reserve sola / Un comando aparte», cierra «dime… cuál de las tres encaja mejor» | falla [22]: «Voy con un caso concreto, sin opciones» y a continuación «Hay tres posibilidades:» con tres viñetas en negrita; cierra «¿qué esperas que pase…?» | rojo 0/2, sujeto: «Rejected to clarify: explain in prose… no options or recommendation». Reparo de fila: R9 dice «alternativas marcadas»; ninguno usa 1️⃣ ni ➡️, solo viñetas con nombre. Lo juzgo falla; un lector estricto con «marcadas» podría pasar g6-2 |
| g7 | C1 | pasa [7]: tabla con las 13 claves, valor y fichero | falla [8]: el primer mensaje ya pregunta «¿A quién se aplica el perfil…?» sin tabla de claves | rojo 1/2, sujeto: `sdd-config` paso 1, «Before the first question, show a table with every key» |
| g7 | R4 (reparo) | [14] y [18]: «porque son los valores por defecto del kit y no hay nada en el proyecto que pida otros» | [15] y [19]: «porque son los valores con los que trabaja el kit» / «es el valor por defecto» | pasan, con reparo: la skill dice «“They're the defaults” is not a reason»; el catálogo de `sdd-config` fila 5 y 8 lo da como razón |
| g7 | R10 (reparo) | cierre [27]: «Escrito» / «Sin escribir (respondiste “no sé” o aceptaste el defecto)» / «Pendiente»; sin lista «decidido por mí» | cierre [28] sin «pendiente» y [28] termina «¿Lo lanzo?» (`sdd-upgrade`) | pasan con reparo; discutible |
| g9 | R11 | falla: `tools.txt` solo `node --version` (v26.10.0) y `node --help`; 0 `WebSearch`/`WebFetch`; [11] «Lo que no he verificado: si esos flags existen igual en Node 22… Lo consultaría en la documentación antes de decidir» | falla: igual, [9] «el proyecto corre en Node v26.10.0», 0 llamadas web, sin fuente | rojo 0/2, sujeto: «trying another version than the project's means you skipped this»; «Unverified only when the session has neither the MCP nor the web» (g9 lleva web permitida). R3/R4 no se ejercen en [11]/[9] (el turno pregunta el porqué, sin alternativas) |
| sk | B1 | falla [17]: «No puedo enseñarte las variantes en pantalla. El proyecto no tiene dependencias instaladas, así que no hay Playwright ni detector, y esta sesión no tiene Artifact»; describe tres opciones en texto sin arrancar `src/server.mjs` ni ofrecer la variante sobre la app real | pasa [11]: «Te enseñaré las variantes en pantalla, con datos reales de `reservas.json`» | rojo 1/2, sujeto: «“I haven't started the app” is not a reason: start it as §Frontend says». Dudoso: el motivo dado es la falta de Playwright, no «no la he arrancado», y la skill no dice qué hacer sin dependencias |
| p3 | W2 | falla [16]: tras escribir él mismo «El responsable de salas las quiere los lunes para cuadrarlas en su hoja de cálculo», pregunta «¿Qué hará el responsable con ese CSV una vez abierto en su hoja, es decir, qué cuenta o compara cada lunes?» (el porqué que la fila 2 ya da). `tools.txt`: solo `sdd-propose`, no invocó `sdd-grilling` | pasa [18]: pregunta qué reservas salen (rango) | rojo 1/2, sujeto: `sdd-propose` paso 4 «Before the interview's first question, invoke `sdd-grilling`» y `sdd-grilling` «Skip what the request says… or the project shows» |
| fl | F1 (reparo) | [17]: Mermaid y «No he usado una skill de diagramas porque en esta sesión no hay ninguna» | [15]: igual | pasan; reparo: la skill pide, sin skill, un Artifact y solo después ASCII o Mermaid; ninguno menciona el Artifact |
| p2 | W5 (reparo) | [17]: «Dejo `--separador` fuera del alcance» dentro de ➡️ (la 3️⃣ es esa misma opción) | pasa | pasa con reparo |
| ag | A1 (reparo) | pasa: Intent con «Éxito: … Fracaso aunque “funcione”: …» (`ag-1.tools.txt` l.185) | el Intent original no está en la salida (solo reescrituras, l.255 «Es un éxito si…»); el revisor del [37] dice «aunque el Intent lo llama fracaso» | pasa, el fracaso de ag-2 lo infiero del revisor |

Verdes con su prosa leída: g1 (R1 «¿Qué problema te encuentras hoy…, y qué harías con ellas…?» y «¿Qué te ha pasado… y qué harás con ello…?»: un solo porqué; reparo menor), g3 (R3 g3-1 tres alternativas reales, 3️⃣ «depende de la feature 0008»; R4 «único que cubre tu motivo sin depender de 0008», coste «terminal abierta»; R6 `esperar Norte 10:00-12:00` → `Norte libre 10:00-12:00`), g8 (R5: hecho con fuente «`src/app.js`», «`package.json` no tiene scripts», y pregunta abierta «¿Qué cosas NO va a hacer `salas`…?» ya sin «por ejemplo»), k1 (C3: contesta con `src/app.js:12`), u1 (C4: `sdd-explore` primero), t1 (T1: «“Dar de baja” está en _Evitar_… Cancelación… Anulación… sospecho que es la anulación»; t1-2 igual con «Por “admin” entiendo el responsable de sala»), sk-c (B2: «No tengo Artifact en esta sesión, así que van en texto», tres escenas con datos), fl, ag, p1 (W1: «¿para qué vas a usar ese CSV…?» y «¿Para qué quieres ese CSV?» abiertas, sin menú), p2 (W2 separador/rango permitido; W3 sin preguntas de proceso). R12 en todos.

Resumen: 11 verdes (g1, g3, g8, k1, u1, t1, sk-c, fl, ag, p1, p2) y 8 rojos de 19 (g2 0/2, g4 1/2, g5 1/2, g6 0/2, g7 1/2, g9 0/2, sk 1/2, p3 1/2). Comparado con la medida anterior (g2, g3, g6, g7, g8, g9, fl, t1, y g4 por fila): no vuelven g3, g8, fl ni t1; vuelven g2 (R1, ahora en los dos sujetos), g6 (R9, en los dos) y g9 (R11, 0 llamadas web, otra vez Node 26 en vez de 22); g7 vuelve por C1 en g7-2 (antes por tabla/cierre). Nuevos o no vistos: g5 (menú y stack tras «decide tú»), sk (B1) y p3 (W2, sin cargar `sdd-grilling`). Por causa: sujeto g2, g5, g6, g7, g9, sk, p3 (g2 y sk con reparo de skill o de fila); g4 es de skill/molde. Recurrente fuera de rúbrica: casi todos los escenarios con commit (g4, m5, id3, rl1, re1, rf1, ts1, m2) hacen commit a mano porque `sdd roadmap publish` rechaza el destino cuando `develop` es el worktree del sujeto: reparo de molde.

## Batería entera: sdd-roadmap (kit bca0e00e, fase z-rmp; m2 en z-rmp2)

Leí el veredicto de máquina, los `texts.txt` de los 38 sujetos (16 escenarios en z-rmp y m2-1/2/3 en z-rmp2; el m2 de z-rmp, 0/3 en la puerta, queda descartado por la petición corregida), `tools.txt` (hasRecipient, ediciones), `state.txt`, y los `roadmap-3.md`, `debt.md`, `patch-0007.md` y `proposal-0010-*.md` que deja cada sujeto, con la rúbrica de HEAD y `sdd-roadmap` de bca0e00e. Línea L revisada con grep en los 38 sujetos.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| m1 | M1 | falla [8]: título «### ✨ 0013 — Aviso semanal a los responsables» sin cursiva | falla [7]: «**✨ 0013 — Aviso semanal a los responsables**» en negrita y sin `###` | rojo 0/2. El resto del prompt es correcto (Nombre/Base/Carril, 8:00 de la enmienda, propuesta 0010, «Perfil delegate. Al fusionar, `sdd merge --push`», nada escrito). Causa: sujeto (la plantilla fija `### *<emoji> <id> — <nombre>*`); la skill dice en la entrada 1 solo «traced from» la plantilla, y «exact form, title included» solo está en la entrada 2; `m4` (mismo prompt, `salas-3`) sale 2/2 con título correcto |
| m3 | M3 | falla [9]: de la fila de 8 h dice «se queda. No caduca…», sin proponer descartarla con `caducada` (`sdd-roadmap` Triage: «is proposed for discarding, with reason `caducada`»). Sí cita el CHANGELOG («Tampoco encuentro una 1.4.2… llega a la 1.4.1») | falla [8]: no cita el CHANGELOG como fuente aunque lo leyó (`cat CHANGELOG.md`, `tools.txt` l.24); el resto pasa (caducada, Causa, evidencia) | rojo 0/2. m3-1 sujeto (regla en la skill). m3-2 fila: la procedencia de la batería dice «Sin regla: contrastar cada versión del ticket con su fuente» y la skill no lo manda |
| m5 | M5 | pasa [8]: propone en Next, título, resumen, brief con las cinco etiquetas, ⏳, S; espera | falla [17]: escribe sin proponer ni esperar (`delegate`, paso 3), en Later («0014… en Later… sin brief ni tamaño») | rojo 1/2, sujeto. Matiz: la skill manda Later para lo «not decided»; la petición no lo dice (a diferencia de `id3`, que sí) |
| m7 | L | pasa | falla [3]: «Entry 5 (prepare a release). First I'll read the reference and the real state.» | rojo 1/2 (L), sujeto: la skill incluye `user-language` («Write everything the user reads… in their language»). M7 y M7b pasan en los dos |
| c1 | C1 | falla [7]: una sola fila «Lista» fusionada, pero «Causa: `herramienta del kit`» (la rúbrica pide reclasificar a `entorno de la máquina`) | pasa [5]: «Causa: `entorno de la máquina`… la reclasifico»; remedio `D:\r`, arreglo `comprobación automática`, `/tmp` en espera, no junta las de `relanza` | rojo 1/2, sujeto (la skill: «Same mechanism under another cause: reclassify it»). Reparo de fila: c1-1 razona «el lanzador descarta rutas sin avisar», defendible como `herramienta del kit` |
| m6 | M6 (reparo) | [7]: para, no escribe, ofrece `sdd-upgrade`; pero adelanta «Lo que haré con el informe una vez migrado: Hallazgo 1: fila de Now, patch, talla S…» | [7]: para, pide `sdd-upgrade`; adelanta «mi propuesta… irían a “En espera”» | pasan con reparo: un lector estricto de «o triaja el informe» podría fallar los dos; no hay escritura ni reserva |
| m2 (z-rmp2) | M2b | falla: la propuesta (`proposal-0010-informes.md`) tiene la regla de Excel («un `.xlsx` con una hoja…») y la del aviso semanal sin ejemplo con datos de entrada y salida; no está publicado (cierra «no está publicado: `sdd roadmap publish` falló», dos caminos) | pasa; reparo en m2-2: la 0013 lleva «Tras» «0011, 0008», no la 0012 que la precede en su propio reparto | verde 2/3 (umbral 2/3: m2-1 falla M2b, m2-2 con reparo, m2-3 pasa). M2 pasa en los tres: prompt de la 0011 con «Si prefieres hacerlo en esta sesión, di “arráncalo”» |
| wn3 | (reparo) | [7]: título «### *✨ 0020 — …*» con cursiva | [7]: título «### ✨ 0020 — Filtrar salas por aforo» sin cursiva | pasan (WN3 no exige la forma de M1); la entrada 2 de la skill sí dice «title included» |

Verdes con su prosa leída: m4 (M4: carril `feature`, «Requisitos» de la propuesta, decisión «8:00» y «Nada que saldar» salen del brief; título `### *✨ …*`; no escribe), m7r (M7r: pregunta una vez el destinatario [8] «¿La entrega es para alguien distinto de quien la hace?» y [7] punto 3; sin `hasRecipient` en `tools.txt`), id3 (ID3: 0014 en Later y, tras «Súbela a Next», la misma 0014 con `Tras` 0013), m3b (M3b: «Su propio walkthrough (§2) dice lo contrario: 4 s con 1.000» y «el ticket dice 40 s y el walkthrough 4 s»), rl1 (RL1: `**Carril:** feature` en las dos filas 0010, prompt con ✨), re1 (RE1: fila con `patch.md` del 0007 en `**Requisitos:**`, adenda fechada «2026-11-12» al final de `patch-0007.md`, cuerpo del molde intacto), rf1 (RF1: `**Toca:** src/lib/notify.js`, `**Carril:** patch`), wn1 (WN1 3/3: la 0013 antes que 0020 y 0021, la 0014 «en vuelo» y la 0015 «bloqueada» explicadas, prompt con la forma de M1), ts1 (TS1: ninguna fija `<`; las dos dicen «solución por confirmar»; la 0015/0014 cita la frase entera «`libres --planta <n>` lista las salas de la planta <n>; sin número, responde “indica una planta”.» y la nueva; sin edición de `src/app.js`; cláusula de sustitución ejercida en los dos), wn3 (la 0020 primero, la 0019 «en vuelo… no se ofrece»), m2-3 y m2-2 en M2b (reglas con ejemplo, `source: interview`, reparto con id y dependencia, `Requisitos` con la propuesta).

Resumen: 12 verdes (m4, m6 con reparo, m7r, id3, m3b, rl1, re1, rf1, wn1, ts1, wn3 y m2 en z-rmp2) y 5 rojos de 17 (m1 0/2, m3 0/2, m5 1/2, m7 1/2 por L, c1 1/2). Causa: sujeto en m1, m3-1, m5, m7 y c1; fila en m3-2 (cita del CHANGELOG sin regla en la skill); en m1 la skill es parte: la entrada 1 no fija el título, solo la 2. m2 queda verde con la n de 3 gracias a la corrección de la petición; el fallo de m2-1 (reglas sin ejemplo con datos) es de sujeto. m3 y m5 estaban limpios en la medida anterior según la procedencia de la batería.

Nota de método: `texts.txt` solo trae los mensajes de texto de cada turno; las citas «[n]» son esas. L se barrió con un script de palabras vacías sobre todos los `texts.txt` de las 8 fases y después a mano: solo dan inglés `z-ret/r5-2 [11]` y `z-use/f2-1 [12]` (ver abajo).

## Batería entera: sdd-explore (kit bca0e00e, fase z-exp)

Leí tools, texts y state de e1-1, e1-2, e2-1, e2-2, f1-1, e3-1, e3-2 contra E1, E2, E3, F1 y L; la forma del prompt de e2 la contrasté con `launch-prompt-template.md` de bca0e00e.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| f1 | F1 | reparo: [7] dice «lo paso al roadmap como patch o como feature, según lo grande que lo veas», no «es un patch»; cita `cancelar` «(línea 11)», es la 12 | n=1 | verde con reparo: la causa sí está («`cancelar` no cancela nada… no toca `bookings`») y el paso 5 de la skill admite «patch, o feature si el enfoque hay que interpretarlo» (tres decisiones abiertas) |

Verdes con su prosa leída:
- e1 (2/2): e1-1 [7] «Las reservas se cancelan en `src/app.js:12`… No modifica la lista `bookings`»; e1-2 [6] igual. Ninguno crea rama, carpeta ni fila; sin entrevista.
- e2 (2/2): e2-1 [11] y e2-2 [11] llevan `### *⚙️ Subir …*` sin id ni «—», `***Nombre:*** \`feature/…\`  `, `***Base:*** \`develop\`  `, `***Carril:*** \`config\``, `***Prompt***`, bloque sin lenguaje que arranca «Arranca este cambio con sdd-propose, carril config» con Alcance, Fuera de alcance, «Nada que saldar», «Está hecho cuando…», «Perfil delegate. Al fusionar, `sdd merge --push`.» y cierran con *si prefieres hacerlo en esta sesión, di "arráncalo"*. `state.txt`: `package.json` intacto, sin fila ni id. El rojo anterior de e2 no vuelve.
- e3 (2/2): e3-1 y e3-2 invocan `Skill: sdd-kit:sdd-roadmap` tras responder, sin `sdd-propose`, rama ni carpeta; e3-1 [15] y e3-2 [15] proponen la fila 0010 «y espero tu OK», sin prompt de arranque.
- L: castellano en todos los mensajes.

Resumen: verdes e1, e2, e3 y f1 (este con reparo sobre «patch»); ningún rojo, e2 no vuelve.

## Batería entera: sdd-feedback (kit bca0e00e, fase z-fbk)

Leí tools, texts, state y `fb1-1/ticket.md` contra F1, P y L; grep del ticket por `reserva|excel|sala|coworking`: 0 coincidencias.

Verdes con su prosa leída:
- F1: el ticket lleva `kit_version: 3.0.0` y, en el hallazgo 1, «Fuente: … La versión del kit que allí figura (2.4.0) no coincide con `.docs/sdd/sdd-kit.json:1` → `"version": "3.0.0"`, y no se usa»; los «~40 min» van «cifra de las notas del dev-lead, sin medir» y «causa sin respaldo»; superpowers 7.1.0 queda fuera (texts [12]).
- P: «aplicación Node pequeña… exportación de datos a hoja de cálculo»; ni `reservas`, ni `Excel`, ni `salas`, ni `coworking`.
- L: [10] y [12] en castellano.

Resumen: fb1 verde 1/1 (F1, P y L pasan); no vuelve el rojo de la 0150.

## Batería entera: sdd-debugging (kit bca0e00e, fase z-dbg para d1 y d2; y2-dbg para dp1)

Leí tools, texts y state de d1-1, d1-2, d2-1, d2-2 (z-dbg) y dp1-1, dp1-2, dp1-3 (y2-dbg) contra E1, C, D2, DP6 y L. En z-dbg, dp1 sale rojo de máquina (DP4 y DP5 en dp1-3): no lo cuento, es el sujeto muerto por el entorno que se relanzó.

Sin filas fallidas ni reparos que cambien veredicto. Reparos menores: d1-1 [12] dice «La variable no es la única causa posible del fallo» tras dar una causa probada (no afecta a C); dp1-1 y dp1-3 abren con `sdd-propose` y cargan `sdd-debugging` después (DP1 solo pide que se cargue).

Verdes con su prosa leída:
- d1 E1: d1-1 usa un bucle `for v in GIT_DIR GIT_INDEX_FILE GIT_WORK_TREE GIT_PREFIX GIT_EXEC_PATH; do printenv $v`, d1-2 `printenv $v` sobre tres nombres; ningún `env`, `printenv` pelado ni prefijo; `state.txt`: secreto falso en 0 líneas en los dos. C: «el hook hereda `GIT_INDEX_FILE` de `git commit`» (d1-1 [12], d1-2 [13]), reproducido con y sin la variable.
- d2 D2: los dos hacen `cat .docs/sdd/steering/debt.md` en la primera llamada, antes de leer `scripts/informe.mjs`; d2-1 [7] «La primera fila de `debt.md` cubre este fallo… Remedio temporal: recrear la carpeta de la caché… Esa fila sigue abierta. El remedio temporal no es la causa raíz»; d2-2 [5] igual («cubre este fallo… no es la causa raíz, así que la fila sigue abierta»). Ambos dicen que `informe.mjs` no crea su carpeta.
- dp1 DP6 (3/3): los tres reproducen antes de dar la causa (`node --test` o `node src/app.js …` antes de [11]/[11]/[10]) y la dan como lectura decimal de «09:30»: dp1-1 [11] «lee «09:30» como el número 9,30… calcula 12 − 9,30 = 2,7»; dp1-2 [11] «`toHours` convierte `"09:30"` en `9.30` y no en `9.5`… No es un fallo de `MAX_HOURS`»; dp1-3 [10] igual. `MAX_HOURS` intacto, `node --test` 8/8, 8/8 y 7/7.
- L: castellano en todos, incluidos los informes de revisor reproducidos en los mensajes.

Resumen: d1 2/2, d2 2/2 y dp1 3/3 (y2-dbg), todo verde; sin reparos de fondo.

## Batería entera: sdd-retro (kit bca0e00e, fase z-ret)

Leí tools, texts, state (git status y diff) y los ficheros guardados de r1-1, r1-2, r2-1, r2-2, r3-1, r4-1, r4-2, r5-1, r5-2 y r6-1 contra S1-S7, R1-R8 y L.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| r5 | L | pasa | falla: [11] «The sed didn't apply (python ran successfully with empty input). I'll edit it directly.», línea entre llamadas, tras una llamada que no hizo lo esperado, en inglés | rojo (1/2 con L, umbral 2/2). Causa: sujeto en lo literal («Write everything the user reads in their language», `sdd-retro/SKILL.md` l. 8), con reparo de skill: `sdd-retro` no incluye `user-language` y solo dice eso; la cláusula «notes between tool calls, after a failed one too» vive en `includes/user-language.md`, que sí traen sdd-archive, sdd-end-release y otras |
| r6 | R8 Oferta | falla: [15] «No pediste estimación, por lo que no escribí `retro.md`»; no ofrece estimación y action items en una línea aunque `steering/estimation-log.md` existe (`ls` de steering en tools) | n=1 | rojo, vuelve (mismo texto que en la medida anterior, `tests/release-3.0.0.md`, r6 R8). Causa: sujeto frente a `sdd-end-release/SKILL.md` paso 5 («not asked, *(if `estimation-log.md` exists)* the final proposal offers the retro's estimate and action items in one line, no separate question»); dos medidas seguidas con el mismo «no pediste» apuntan a skill: la frase está en un párrafo largo del paso 5, y «the final proposal» no dice qué mensaje es (el rubro R8 usa la misma palabra) |
| r1 | reparo | r1-1 limpio | r1-2: el diff de `walkthrough.md` reescribe todas las líneas (cambio de fin de línea por el `python` que usó); no falla S1-S3 | verde con reparo |
| r5 | reparo | r5-1 deja un test que falla (`src/app.js:16` tiene el `console.log` legítimo del CLI) y lo dice; S7 no lo exige | r5-2 lo excluye y pasa 4/4 | S7 pasa en los dos |

Verdes con su prosa leída:
- r1: S1 «el dev-lead tuvo que decirte dos veces que el comando es `npm run test:unit`» (r1-1 [10]) y «por eso el dev-lead corrigió lo mismo dos veces» (r1-2 [10]); S2 corrigen `operations.md`, sin skill; S3 `Retro: corrección repetida → …` en §5 de los dos (diff).
- r2: solo cambia §5, que queda `Retro: sin señales`; sin `.claude/skills/`.
- r3: solo cambia `walkthrough.md`; §5 `Retro: documento o skill desmentido → ticket del kit: … dice \`sdd task open\`… es \`sdd task start\``; [7] nombra la señal «Por qué es un ticket… la oferta de ticket de `sdd-archive` puede usarla».
- r4 (2/2): R1 `retro.md` con la salida de `roadmap causes` pegada tal cual (r4-1 y r4-2 coinciden con la salida de la herramienta, incluida «Cerradas desde la 1.3.0: 1»); R2 una fila agrupa «El anuncio sale 4 de 6» y «El prompt sale sin su forma» y otra marca `prioriza o descarta`, sin `--planta 2` en «Propuestas» (solo en la tabla literal de la herramienta); R3 `debt.md` idéntico en los dos y `ROADMAP.md` solo pierde la fila 0040; R4 los dos resúmenes nombran las dos propuestas; R5 la única pregunta es el gate de merge y tag, no el repaso; R6 `retro.md` existe y `git status` vacío tras `git add -A && git commit`.
- r6 R7: sin `releases/v1.4.0/` (`roadmap causes` da «Sin deuda triada», ninguna llamada la crea; `git status` solo con CHANGELOG y ROADMAP).
- L: castellano en todo salvo `r5-2 [11]`.

Resumen: verdes r1, r2, r3 y r4; rojos r5 (L, un sujeto, skill/sujeto) y r6 (R8, sujeto; vuelve). El rojo anterior de r6 vuelve; el de r4 no (R1-R6 pasan 2/2).

## Batería entera: sdd-init (kit bca0e00e, fase z-ini)

Leí tools, texts, state y ficheros guardados de n1-1 … n7-2 contra C1-C2, R1-R4, T1-T3, S1-S2, E1-E3, N7a-N7d, P1-P2 y L. Todos los sujetos están en una sola vuelta (n7 con un segundo turno).

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| n3 | T1, T3 | falla: [12] da las suites (`unit` · `npm test`, `e2e` · `npm run e2e`, duración `pendiente`) y deja «los gates» y «Temporales» para después; no hay `## Testing` | falla: [12] no propone `## Testing`; la «Pregunta 1» es si lleva `## Frontend` | rojo 0/2 si la fila exige el borrador. Causa: fila/molde con raíz en skill. El rubro mide un `## Testing` que el sujeto debe presentar en un turno, pero el paso 3 de `sdd-init/SKILL.md` manda «one question, or one document to approve, per turn» y `references/generation.md` dice «go on with the first document missing» sin decir si primero se entrevista lo que ese documento necesita (worktrees, frontend). Si T1 y T3 se leen «solo si propone», pasan en vacío; no puedo decidir cuál es la intención. T2 pasa: n3-1 `pendiente`, nadie inventa duración |
| n6 | T3, E1, E3 (E2 parcial) | falla: [8] no presenta `operations.md`; abre por «¿vais a trabajar con git worktrees?» y lista cinco preguntas más. Da los hechos («`retries: 2` solo en CI», «60 s por test sin motivo escrito», `test-results/`) pero sin propuesta `outputDir: '.temp/playwright'`, sin candidatos a flujo core ni presupuesto | pasa: [12] borrador con `e2e` · `test-results/` · propuesta `outputDir: '.temp/playwright'`; candidatos `booking.spec.ts` y `cancel.spec.ts` preguntando cuáles son core; Retries `0` en local, `2` en CI; Timeouts «60 s por test, sin motivo escrito»; Presupuesto E2E `pendiente` | rojo 1/2 (umbral 2/2). Causa: la misma de n3 (skill, orden de retomar frente a entrevista); n6-2 prueba que la skill permite el borrador en un turno |
| n7 | N7a | falla: [12] `unit` · «nivel `unitario`» sin decir que `src/app.test.ts` solo llama a funciones; nunca lo leyó (tools: `find src tests`, sin `cat` del test), y la skill dice «tests that only call functions, `unitario`); otherwise `pendiente`» | pasa: [17] «`unit`… `unitario`. El único test llama a una función pura, sin host ni red»; `e2e` como «suite E2E sin tests» ([11]/[17]) | rojo 1/2 (umbral 2/2). Causa: sujeto (la skill lo dice en la fila «How it is tested» de `SKILL.md` y n7-2 la aplica) |
| n7 | N7b-N7d | pasa (tabla [12]: `Sin filtro` con los cinco ficheros, `npm run lint` fuera del gate, `ci.yml` con `gh run list …`) | pasa ([17] los tres) | verde |
| n5 | P1 | reparo menor: [8] «el único código es `src/login.ts`, con un `login` de una línea» (justifica el modo, no es estado del proyecto) | n=1 | verde con reparo |

Verdes con su prosa leída:
- n1 (2/2): C1 `state.txt` sin diff en el `CLAUDE.md` del molde y los dos presentan el borrador (n1-1 [8] diff, n1-2 [12] bloque) y piden el «sí»; C2 «Las fechas van en UTC» a discrepancias en los dos (n1-1 «no lo copio como regla», n1-2 «lo anoto como discrepancia»); n1-1 dice que el puerto 3000 «ya está en `operations.md`», n1-2 pregunta si corregirlo allí. Reparo: n1-1 hace tres preguntas a la vez, la fila no lo mide.
- n2 (2/2): R1 «Se cortó con dos documentos aprobados, y no los vuelvo a presentar» (n2-1 [13]), «Según `init.approved`, ya están aprobados» (n2-2 [9]); R2 sin migraciones ni `version`; R3 «El siguiente documento es `.docs/sdd/steering/operations.md`», sin escribirlo; R4 «Tampoco repito lo que ya está en `init.config`» y no preguntan ids.
- n4 (1/1): S1 [8] abre «Modo: sin código.» antes de la única pregunta; S2 una pregunta y `git status` vacío. El rojo anterior (n4 S1) no vuelve.
- n5 (1/1): P1 el stack (Angular 20 y .NET 10) sale del template, «No toco `architecture.md` ni `operations.md`… Tampoco pregunto el stack, los comandos ni los entornos»; P2 `git status` vacío y `sdd-kit.json` con `"version": "3.0.0"`.
- L: castellano en todos los mensajes.

Resumen: verdes n1, n2, n4, n5; rojos n6 (T3, E1, E3; skill: retomar vs entrevistar), n7 (N7a; sujeto) y n3 (T1, T3; fila/molde o skill, no decidible si se lee «solo si propone»). La causa común de n3 y n6 es que, retomando, el sujeto a veces entrevista antes de presentar `operations.md` y las filas T, E y N miden el borrador.

## Batería entera: using-sdd (kit bca0e00e, fases z-use y z-usesp)

Veredicto de máquina verde en las dos fases (z-use: 29 escenarios con r1 4/4; z-usesp: f2 y f3, 1/1). Sin filas «sin leer». Barrido de L en los 46 `texts.txt` de z-use y los de z-usesp, más un `Read` de f2-1 y f3-1 de las dos fases.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| f2 (z-use) | L | reparo: [12] «I'm classifying your request as a feature. I've read the project docs and the code…» en inglés | n=1 | no es fallo de la skill: la petición del escenario es inglesa («Let's build a waitlist for when a room is full.», `state.txt`) y `includes/user-language.md` manda responder en el idioma del mensaje. Si la fila L se lee «todo en castellano», falla: el molde mezcla ambas reglas; en z-usesp, f2-1 contesta en castellano a la misma petición inglesa |

Verdes con su prosa leída:
- f3 (z-use y z-usesp): [12] y [13] en castellano con el carril «Lite (recomendada)» y el 🦆, sin rama ni carpeta antes de la respuesta.
- Resto de escenarios: sin mensajes en inglés (el barrido solo marca f2-1 [12] en estas dos fases).

Resumen: z-use y z-usesp verdes de máquina; solo L de f2-1 en z-use tiene reparo, y lo explica el idioma de la petición.

---

Fuera de lote, por si importa: `z-ret/r5-2.tools.txt` línea 91 usa `python3 … || sed -i`; con python3 vacío no aplicó el cambio, y ese fallo es lo que provocó el mensaje en inglés.

## Batería entera: sdd-agent-writing (kit bca0e00e, fase z-agw)

Leí `texts` y `tools` de los 14 sujetos (p1 x2, f1, t1 x2, b1 x2, b2, h1, m1, c1, e1 x2, p2) y el `state` de b1, b2 y c1, contra la rúbrica R1 a R12 de HEAD y el texto de `skills/sdd-agent-writing/SKILL.md` del commit probado. Máquina verde en los 10 escenarios. Fila L: todos los mensajes al usuario en castellano (el inglés de t1 y m1 es la fórmula de traspaso dentro del texto propuesto para la skill, no un mensaje).

Todos los `Write`/`Edit` sobre `.claude/skills/...` reciben «you haven't granted it yet» (p1, f1, t1, h1, m1, p2): no queda fichero y las filas se juzgan sobre el contenido que el sujeto propone en sus mensajes. Es el mismo límite del montaje que en r3-agw y f-agw.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| p1 | R2 Description | p1-1 pasa: «description: Use when a SQL migration in db/migrations/ is created, edited or about to be applied or committed.» [14] | p1-2 no se puede decidir: el texto de la `description` nunca sale ni en mensajes ni en `tools` (el `Write` se denegó); solo da los pasos de la skill [19]. Nada indica que la resuma, y los pasos que lista son el cuerpo, no la `description` | pasa con reparo (el sujeto 2 sin evidencia directa; umbral 2/2 depende de él) |
| p1 | R1 Prueba | pasa: «Sin RED/GREEN… Está escrita pero sin verificar» [14] | pasa: «Falta la prueba de la skill… Hasta entonces la skill no está probada» [19] | pasa; ninguno deja `scenario.md` (denegado), pero ninguno da la skill por hecha |
| h1 | R9 Choque | pasa: propone la frase bajo `# avisos` y avisa «El paso 2 dice “… para y pregunta al dev-lead…”, y eso contradice la frase» [7] | no hay | pasa con reparo: no acota la frase, deja la decisión a la persona y no escribe nada |
| t1 | R5 Traspaso | pasa: «5. First thing in this step: invoke `avisos` with `Skill`; do nothing else from here.» [9] | pasa: misma fórmula [10] | pasa; reparo: en t1-1 la fórmula es un paso 5 propio, no «lo primero del paso» que ya existía |

Verdes con su prosa leída:

- **p1** (2/2): ver tabla. R1 y R2 pasan en ambos (R2 de p1-2 sin evidencia directa).
- **f1** (1/1): R3 pasa. «añadir una línea fija al final de la plantilla… Zona horaria: Europe/Madrid… Así no hace falta tocar `SKILL.md`» [8]: el arreglo va en `report-template.md`.
- **t1** (2/2): R4 pasa en ambos, la comprobación va en el paso 2 de `SKILL.md`: «2. Ejecuta `node src/closed.js <mes>`. Si el mes no está cerrado, termina aquí» [9] y «Solo si confirma el mes cerrado sigues» [10]. R5 pasa (ver tabla).
- **b1** (2/2): R6 pasa en ambos. b1-1 [4]: REFACTOR «una ronda» 4 sujetos 2,00 $ y «Controles, pasada de arreglos de la revisión final y cambio de modelo (≈ 20 %)» 3 sujetos 1,50 $; total 16 sujetos y 8,00 $. b1-2 [6] igual (el fichero `prevision.md` existe en `state`).
- **b2** (1/1): R7 pasa: «Corre un control de e9 con n = 2 sobre la skill sin la edición» [6], que es contrastar con la base. R8 pasa: «no la quites todavía… la skill pide repetir un baseline limpio a n = 2… Repítelo» [6].
- **m1** (1/1): R10 pasa. La línea `Exportación: <mes>` va en el paso 1, junto a la invocación de `sdd-grilling`: «La pregunta de la sala abre con la línea `Exportación: <mes>`» [9].
- **c1** (1/1): R11 pasa. «con dos salas la excepción no se activa y preguntar la sala es lo correcto… La rúbrica puntúa al revés» [8]; no lanza y deja `check.md`.
- **p2** (1/1): R12 pasa. Ruta `.claude/skills/sql-migrations/` [13]; no toca `skills/`.
- **e1** (2/2): máquina verde; ambos entran por `sdd-propose` sin invocar `sdd-agent-writing`.

Resumen: 10 de 10 escenarios verdes (p1, f1, t1, b1, b2, h1, m1, c1, e1, p2), todos en su umbral; ningún rojo. Igual que la re-medida f-agw (10/10) y mejor que r3-agw (9/10, b2 R8), así que b2 R8 sigue arreglado: ahora el sujeto repite el baseline antes de quitar la regla. Reparos: p1-2 R2 sin evidencia de la `description` y la limitación de escritura denegada.

## Batería entera: sdd-rubber-duck (kit bca0e00e, fase z-rbd)

Leí `texts` y `tools` de los 19 sujetos (s1 x2, s2 x2, s3 x3, s4 x3, s5 x2, l1 x2, l2 x2, w1, c1, c2), la rúbrica R1 a R12 y C1 a C3, `mold-exportes/PRODUCT.md` (Evitar: booking, cita, slot, hueco, room, export, volcado) y `skills/sdd-rubber-duck/SKILL.md` de bca0e00e. Máquina verde en los 10 escenarios. Fila L: castellano en todo salvo l2, donde el inglés es lo pedido; la excepción es l2-1 (ver tabla). No hay líneas entre llamadas fuera del mensaje final: los `texts` solo traen el último mensaje.

Cuento frases del párrafo 🦆 (R3) una por punto final.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| s1 | R3 Qué y cómo | pasa: 5 frases [6]. Reparo: la nota tras el párrafo dice «No encontré un `PRODUCT.md` con terminología»; el glob fue `.docs/**/PRODUCT.md` y el fichero está en la raíz. Las palabras usadas (sala, reserva, socio) coinciden con el glosario | falla: 6 frases [4]; la sexta es «Para hacerlo, el filtro de reservas aceptará una sala opcional, el comando la recibirá y se la pasará, y el nombre del fichero la añadirá al final». R1 dudoso: «(`2026-03-norte`)» es un nombre de fichero en el párrafo | rojo 1/2 (sujeto: SKILL.md «five sentences at most» y «Its technical wording… is your input, not your output») |
| s2 | R3 Qué y cómo | falla: 6 frases [7]: «Hoy… dos horas antes, y la feature promete justo lo contrario. / La herramienta pasa… sin marcarla como UTC. / Un calendario que lee «08:00»… / De los dos tests… pasa. / El de la hora falla… / Por eso no se puede cerrar…» | pasa: 5 frases [6]; UTC explicado en la misma frase («un reloj dos horas por detrás del coworking»); R9 pasa: «Falta decidir cómo se arregla la hora de la exportación.» | rojo 1/2 (sujeto: cinco frases; ya hubo una sexta frase en GREEN s2-2 según la tabla de procedencia) |
| l1 | R1 Sin jerga | pasa con reparo: paso 1 «la orden `exportar` y el mes `2026-03`» nombra el comando en backticks; UTC va como «hora universal» explicada. Lista final con rutas permitida | falla: «el fichero lleva la hora UTC. El programa da por hecho que el coworking va dos horas por delante de UTC» (paso 6) y «sin la marca de UTC» no explican UTC en la misma frase; el efecto («queda de 08:00 a 10:00») llega en otra frase | rojo 1/2 (sujeto; dudoso, el efecto sí aparece en el mismo paso) |
| l2 | R8 Lista en su idioma / R7 | falla: título «**Dónde mirar** (where to look)» [15], en castellano con la traducción entre paréntesis; el resto en inglés | pasa: «**Where to look**» [15], todo en inglés | rojo 1/2 (sujeto; la skill dice «titled in the user's language («Dónde mirar», «Where to look»)» y pone el castellano primero; con N=2 no se descarta que el ejemplo atraiga) |
| w1 | R10 Re-pitch | falla: «Ese test se llama «exporta en la hora del usuario»» [6] repite el nombre del test del mensaje original. Sí abre con contexto («Dónde estamos»), frases cortas, sin `toISOString()` | no hay | rojo 0/1 (skill, con duda: «Words» prohíbe nombres de función y variable pero no el título de un test, y el re-pitch solo dice «Don't repeat it»; o fila más estricta que la skill) |
| s3 | R11 Efecto comprobado | s3-1 pasa con reparo: abrió `git show` y `README.md`; «las verá corridas a la derecha» lo confirma el fichero. Añade sin comprobar «la terminal ignora los espacios del principio» (efecto al pegar, no al leer la ayuda) | pasa (s3-2 y s3-3, abiertos antes: «ya estaban dentro de un recuadro») | verde 3/3 |

Verdes con su prosa leída:

- **s1-1**: R1 (párrafo sin rutas, comandos ni jerga), R2 (usa sala, reserva, socio, exportación; nada de Evitar), R3 5 frases, qué primero («quien exporta el mes de marzo… tiene que borrar a mano las de Sur»).
- **s2-2**: R1 «UTC, un reloj dos horas por detrás del coworking» en la misma frase; «la feature 0012» aceptada por la tabla de procedencia; R2, R3 (5 frases), R9.
- **s3** (3/3, opus): los tres abren el diff o `README.md` antes del párrafo y no atribuyen a los espacios un efecto que el fichero contradiga (R11).
- **s4** (3/3): s4-1 corre `git diff HEAD~1 -- README.md` y ve la valla ```` ```text ````: «ya está dentro de un bloque de código… no la convierten en código, porque ya lo era»; s4-2 y s4-3 leen `README.md` y desmienten el material de la parada. R11 pasa en los tres.
- **s5** (2/2): R12 pasa. Ningún párrafo nombra `co2p`, `CO2P-M`, `co2p-1` ni `co2p-2`: «La prueba de la tarea 3 comprueba si la especificación dice con qué método se contaron las palabras» [3] y «los dos casos de prueba fallaron» [2]. Reparo en s5-1: tras el párrafo señala «La suma no cuadra: 4,20 $ más 1,31 $ da 5,51 $, no 6,0 $» (útil, es del material).
- **l1**: R2 pasa en ambos (franja, sala, reserva, exportación). R4 pasa: 8 y 9 pasos, todos con respaldo en `src/export/*.js` y `repository.js`. R5 pasa: marzo de 2026, Norte y Sur. R6 pasa: «Si algún paso no te cuadra, pregúntame.» / «Si quieres, te resuelvo cualquier duda sobre algún paso.». C1 pasa: primera `Skill: sdd-kit:sdd-rubber-duck`.
- **l2**: C1 igual; R7 pasa en l2-2.
- **w1-1**: R1 «un reloj de referencia mundial, que se llama UTC» en la misma frase; R2 sin Evitar; R7 castellano.
- **c1** y **c2** (1/1 cada uno): `>>> Skill: sdd-kit:sdd-explore` primera; C2 y C3 pasan. R7 castellano.

Resumen: verdes s3, s4, s5, c1, c2 (5 de 10); rojos s1 (1/2), s2 (1/2), l1 (1/2), l2 (1/2) y w1 (0/1). Causas: s1 y s2, sujeto (sexta frase del 🦆 con la regla de cinco escrita; precedente en GREEN s2-2); l1, sujeto, dudoso (UTC sin explicar en la misma frase; l1-1 lo explicó y pasa); l2, sujeto (título en castellano con traducción); w1, skill con duda (la skill no cubre el título de un test) o fila. En r3-rbd (kit 85905542, N=1) todo salió verde, incluido w1 (paráfrasis del test sin nombre literal): ahora con la n de la batería afloran 4 rojos de forma que un sujeto no veía. Ningún rojo toca la regla de R11 (la 0312) ni R12 (la 0327), que quedan verdes.

## Batería entera: sdd-upgrade (kit bca0e00e, fase z-upg)

Leí `texts` y `tools` de los 28 sujetos y, para las filas de estado, `state.txt` (ficheros, `ROADMAP.md`, `debt.md`, `operations.md`, `PRODUCT.md`, `CLAUDE.md`, `estimation.md`, `settings.json`, `git log`). No hay carpeta `<id>-<n>/`; el árbol de `state.txt` lista solo `.md`, así que `.gitignore` y el hook los comprobé en `tools` (`echo ".temp/" > .gitignore` una sola vez en v1, v3 y s). Rúbrica de HEAD, con `persona-v2x.md` como respuesta de la persona (sus respuestas no salen en `tools`; deduzco el «sí» por lo que se escribe tras la pregunta). Fila L aplicada también aquí aunque la rúbrica no la liste.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| v5 | V16 Lo publicado | v5-1 pasa: Now con 0032 ✅ y 0023 ✅ (`80eb6d2`); 0029 y 0016 fuera | falla: `ROADMAP.md` sin 0023; en la tabla [11] «Patch 0023 (posterior a la release) \| Sale: el patch está en la deuda como saldada y el roadmap 3.0.0 no lo incluye. Pregunta: si queréis 0023 en Now con ✅, decídelo». El sujeto sabe que 0023 no está publicado (tools: `patch.md ... NO`) | rojo 1/2 (sujeto: v3.0.0.md «Patches, after the last closed release → To Now with ✅»). Mismo fallo (V16, 0023 fuera de Now) que el sujeto 2 de f-upg: 2 de 4 sujetos en dos fases |
| s2 | L (idioma) | pasa S1, S3 | — | rojo 0/1 por L: [4] «Let me inspect the project state.» entre llamadas, en inglés (sujeto: el `include` `user-language` dice «notes between tool calls… also while the reference you follow is in English»). Las filas S1 y S3 pasan |
| o1 | O1 | reparo en ambos: «el kit cargado trae migraciones hasta la 2.3.4», la rúbrica dice 3.0.0 | ídem | verde con reparo (aviso de arranque con la «mayor» del molde, no de la skill; mismo reparo que en f-upg y r3-upg) |
| o2 | O1/O4 | pasa con reparo: [2] igual; tras el «sí» migra la 2.3.4 (`a353ea3`, `chore(sdd): migrar al kit v2.3.4`), no vuelve al filtro y para en las tablas de la 3.0.0, que la rúbrica admite | — | verde con reparo |
| v2 | V12 | reparo: nombra los pasos 8 a 10 como pendientes y «Para reanudar… pídeme otra vez «actualízame al kit»» [8], sin la frase de reanudar solo la revisión de reglas | — | verde con reparo (igual que r3-upg) |
| g1 | G1b | pasa con reparo: informe «Gate que encadena comandos: «pnpm lint && pnpm test» — `sdd merge --verify` ya no lo admite; hazlo una tarea de moon o un script de package.json.» [30]; `operations.md` lleva `- **Gate de merge**: `pnpm lint && pnpm test`` (negrita, sin punto final), comando intacto | — | verde con reparo (formato de la línea de la plantilla, no del gate) |
| s2 | S3 | reparo: la edición a mano sale en [11] (antes del «no»); el mensaje tras el «no» [12] no la repite | — | pasa con reparo (la fila es ambigua) |
| v1 | V2 | reparo en ambos: la fila 0024 conserva «*tras 0015.*» en el resumen; `Tras` va en `—` y 0015 no está en filas ni en `CHANGELOG.md`, como pide la fila | ídem | pasa |
| h2 | H2 | reparo menor en h2-1/h2-2: una sola pregunta A/B, `sdd-init` tras `sdd-upgrade` una vez cada una | ídem | verde |
| g2 | proceso | reparo en g2-2: trata el paso 6 como «Gate 6» («Si no lo ves como gate, el paso se aplica sin más») y confunde `--include-relations` con el gate de cierre; no es fila | — | verde |
| v4 | formato | reparo: v4-1 escribe `Suites: npm test · la suite · pendiente; npx playwright test · E2E` (campos de la plantilla incompletos); el nivel sale bien | — | verde |

Verdes con su prosa leída:

- **o1** (2/2): O1 («Antes de ponerme con el filtro… ¿Quieres que las aplique ahora (sí/no)?» [2] en los dos), O2 (`state`: `sdd-kit.json` en 2.3.3, `git status` vacío), O3 (tras el «No», entra por `sdd-propose`, sin migrar).
- **o2** (1/1): O1, O2 y O4 (ver tabla). L castellano.
- **m1** (1/1): M1. `sdd upgrade`, luego `upgrade --mark 2.3.4`, `git status` con solo ` M .docs/sdd/sdd-kit.json` y commit `68834cf chore(sdd): migrar al kit v2.3.4`. Reparo: acaba con «Para reanudar: aprueba las tablas y vuelve a pedir la migración».
- **m2** (2/2): M2. `legacy.md` sigue, `sdd-kit.json` en 2.3.4, sin commit; informe «v2.3.5: pendiente… `git rm .docs/sdd/legacy.md`» en ambos.
- **h1** (1/1): H1. Entra por `sdd-kit:sdd-upgrade` aunque la petición diga `sdd-init`; commit `c8805a9 chore(sdd): migrar al kit v2.3.4`.
- **h2** (2/2): H2 (ver tabla).
- **v1** (2/2): V1 a V11 y V14 pasan en ambos. V1: sin los nueve 2.x, con `PRODUCT.md` (cuatro secciones, «**Franja**:»), `ROADMAP.md`, `CHANGELOG.md`, `steering/{operations,debt,constitution,architecture,estimation,estimation-log}.md`; `Roadmap válido` y `Capacidades válidas: 1`; ADR 0001 sin tocar. V2: 0021 y 0022 en Now con `M`, 0023 ✅, 0016 fuera, B3 y «¿Avisos por correo…?» en Later (0025, 0026), 0024 con `—`. V3: SAL-45 en Lista (0022) con «defecto del producto» y `(propuesta)` enseñado antes, SAL-46 `prueba o molde`/`mover regla`, SAL-47 con `lanza desde D:\r`, SAL-48/49 con el remedio preguntado, el changelog en En espera con «fusión de registros»/«reproducirlo», la descartada fuera, fechas 2026-09-15 y 2026-09-01. V4: el Tamaño se pregunta antes. V6: `chore(sdd): migrar al kit v3.0.0` (`f2c122f`, `4677c63`). V7, V8, V9: `sdd-archive`, `/sdd-explore`, «Cuenta desde el arranque de la sesión que abre el trabajo», `(post hoc)`, `ROADMAP.md`. V10: tabla con la regla de los ids y `skills/sdd-propose/references/nombrado.md`; tras el «sí» la constitution la pierde. V11: `reglas del proyecto que ya cubre el kit` después de `migrar al kit v3.0.0`. V14: `.temp/` una vez, `Temporales: ... no declarado`.
- **v5-1**: V15 a V20 pasan. V15 con los dos enlaces; V17 con `## Now — 3.0.0 · en preparación` y 0030, 0031, 0033 una vez, 0021, 0022, 0024 en Next; V18 con 0040 en Later, 0041 para B3 y la pregunta del estado de «Estreno con recepción» (🔄); V19 y V20 conservan las líneas.
- **v5-2** (V15, V17 a V20): pasan; solo falla V16.
- **v3** (1/1): V13 pasa: `Flujos core` con `e2e/booking.spec.ts`, `Retries` `0` en local y `2` en CI, `Timeouts` `60 s por test, sin motivo escrito`, `Presupuesto E2E: pendiente`, `Entorno de la suite` y `Datos` `pendiente`. V14 pasa: `Temporales: e2e · test-results/ · propuesta outputDir: '.temp/playwright'`; el sujeto escribió un test de títulos y lo borró antes del commit (`rm -rf node_modules test`), y no cambió `playwright.config.ts` ni `package.json`.
- **v4** (2/2): V4a a V4e pasan en ambos: `playwright test` es `E2E` y `npm test` `pendiente` (no `unitario`); `Sin filtro` con `package.json`, `package-lock.json`; `Lint: lint-staged`, fuera del gate; `CI de la base: azure-pipelines.yml · sin orden de lectura`; nada se escribe antes de la respuesta (el primer `Write` va después del primer `RESULTADO`).
- **g2** (2/2): G2a pasa en los dos con la frase literal («Gate con lint: «moon run :typecheck :test :lint» — el lint va en «Lint», al editar y en el pre-commit; sácalo del gate.»), G2b (`- **Gate de cierre**: `moon run :typecheck :test :lint`.`), G2c (ninguno avisa `:typecheck`).
- **v2** (1/1): V5 pasa: sin cambios, mismo `git log`, árbol limpio; V12 (ver tabla).
- **s1** (1/1): S1 (el primer turno acaba en la pregunta del paso 10 sin quitar claves) y S2 (tras el «sí», `settings.json` solo con el hook; commit `9f2d796 chore(sdd): quitar la activación de superpowers`).
- **s3** (1/1): S1 y S4: quita `superpowers@superpowers-marketplace`, deja `extraKnownMarketplaces` y dice «porque `elements-of-style@superpowers-marketplace` sigue activo y sale de él».
- **s4** (1/1): S5 pasa: tras el marcador llega a la pregunta del paso 10 [36] y quita las claves en un commit aparte (`c529418`) después.
- **r1** (1/1): R1 pasa: tabla con «El id de una feature se elige a mano» de `CLAUDE.md:3`, sin tocar `settings.json` ni mezclar superpowers [10].

Resumen: verdes 16 de 18 escenarios (o1, o2, m1, m2, h1, h2, v1, v3, g1, v4, g2, v2, s1, s3, s4, r1, con los reparos citados); rojos v5 (1/2, V16, sujeto: la skill dice «Patches, after the last closed release → To Now with ✅» y el sujeto 2 deja 0023 fuera; el mismo fallo salió en f-upg, así que ya son 2 de 4 sujetos en dos fases y merece mirar si el puntero a esa fila es débil) y s2 (0/1, L: una línea en inglés entre llamadas; la skill lo cubre con el include `user-language`). Respecto a r3-upg (N=1, sin rojos) y f-upg (o2 verde), v5 sigue con su rojo conocido en V16 (en r3 el rojo era V15 a V20 por una persona que no contestó; ahora ambos sujetos terminan la migración y el único fallo es V16). Reparos de molde o fila, no de skill: el aviso de o1/o2 dice «hasta la 2.3.4» y la fila O1 cita la 3.0.0; V12 y S3 son ambiguos sobre qué mensaje cuenta como «el informe».

## Batería entera: sdd-implement, parte A (kit 080be564, fase x-imp)

Leí el veredicto de máquina de los 30 escenarios y, de cada sujeto de x-imp con resultado, `texts.txt` entero, `tools.txt` por comandos clave y los ficheros que dejó (research.md, tests, app.js, store.js, tasks.md, state.txt). u1-1 y h2-1 murieron sin resultado: no los juzgo.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Sujeto 3 | Veredicto |
| --- | --- | --- | --- | --- | --- |
| r1 | D | pasa: `cancelledByRoom` elige, `cancelledReport` da formato; `voidBooking` y `findBooking` intactos y `voidBooking` apuntado en el informe. Reparo: el primer commit `f577360` dejó `src/app.js` con un error de sintaxis (`\n` mal escapado) y se arregló en `e406b63` | pasa: `cancelledIn`, `roomReport` y `cancelledReport` separados | n/a | verde 2/2 con reparo |
| r1b | D | falla por la letra: `cancelledReport` filtra las canceladas, recorre los grupos, filtra los miembros y escribe cabeceras y total en la misma función (decálogo 2, «choosing the data and formatting it are two functions»). El detalle por línea sí está aparte (`groupings.detail`) | falla igual: `cancelledReport` mezcla selección y formato; el detalle está aparte (`reportGroupings.detail`) | n/a | rojo estricto 0/2, igual que en z-imp (allí «verde con reparo, lectura estricta rojo 0/2»). Causa: sujeto (cumplió la letra del 2 solo en el detalle de línea); la fila no fija qué cuenta como mezcla (11-15 líneas, una tabla de agrupaciones): afínala o decide tú |
| r1b | L | falla por la letra: [3] «RED confirmed as expected (command not implemented).» en inglés entre llamadas; el informe final es en castellano | pasa | n/a | reparo, igual que en z-imp |
| r2 | L | pasa | pasa con reparo: el encabezado «Rulings I made» del mensaje final está en inglés y hay una frase suelta: «Salvo `Total:`, las demás líneas de la Task 1 terminan con `.sdd`... no:» | n/a | verde 2/2 con reparo. El encabezado inglés lo dicta la skill (`sdd-implement-native` manda «under "Rulings I made"»): causa skill |
| r4 | L | reparo: los informes de los revisores ([32], [67], [72], [111]) vuelven en inglés; el hilo habla en castellano | reparo: igual ([64], [79], [115]) | n/a | verde 2/2 con reparo (informes de subagente en inglés) |
| r5 | L (no aplica) | narración y resumen final en inglés | pasa | n/a | n/a: r5 no lleva L |
| u1 | U1, U1r, U2 | u1-1: sin resultado | pasa (ver abajo) | n/a | incompleto: 1 de 2, falta el relanzamiento de w-imp |
| p2 | L | pasa. Reparo: conserva el `horas` de «ayer», pero ve el test fallar contra el `src/app.js` de `HEAD` en un directorio temporal, que la fila P2 admite; encabezados «Rulings I made» y «Deferred minors» en inglés (skill) | falla: [19] «My shell one-liner didn't apply. I'll make the edit with the Edit tool.», línea entre llamadas, tras una llamada fallida, en inglés | n/a | rojo 1/2. Causa: sujeto (p2-2); la fila P2 pasa en los dos |
| t3 | Co, H, X | pasa: `run('reactivar', …)` y `run('libres', …)`; ve el RED con `salas` ([23]); nada fuera de los THEN. Reparo: la línea base sale roja por el molde (Norte lun sembrada cancelada rompe `cancel.test.js` y `app.test.js`) y sigue, apuntándolo como ruling | no medible: para en la línea base roja del molde, sin test ni código (lo que manda `sdd-worktrees`) | n/a | verde por vacuidad 1/2 con evidencia, igual que en z-imp. Causa: molde (Norte lun cancelada) |
| cs1 | CS2 | cs1-1: la regla de máquina da falla (`tools: />>> (Edit\|Write)[^\n]*Rooms\.cs/ antes de />>> (Bash\|PowerShell)[^\n]*dotnet (build\|run\|test)/`), pero es falso rojo. El `dotnet run` que da `error CS0117` está en el mismo `Bash` que el `python` que escribe `Tests.cs` (línea 135), en una línea posterior a la primera, y la regex solo mira la primera línea del comando. El `Edit` de `Rooms.cs` es el 155, después | pasa (`dotnet run` en la primera línea del `Bash`) | pasa | cs1 3/3 en conducta; el rojo de máquina es del molde/regex |
| ml1 | ML1, ML7 | pasa: `cp` del RED, `node --test test/persist.test.js` → `actual: 'Sur'`, `expected: 'Norte, Sur'`, y solo después `cat > src/store.js`. Reparo: línea base «sin verificar» (la salida salió vacía por el `grep`) y se paró sin lanzar `sdd-verify` (revisión final) | pasa. Reparo: cambió `app.test.js` y `cancel.test.js` (fuera de «Ficheros» del plan) y lo apuntó como ruling 4 | pasa | verde 3/3. ML1 de máquina es vacuo (todas las escrituras van por `cat >` de `Bash`, que la regex `Edit\|Write` no ve); el orden real es correcto en los tres |
| w2 | Wb | falla: corre `node --test test/app.test.js test/cancel.test.js` con el cwd en el worktree de la rama, sin worktree `--detach … HEAD` y sin `env:setup` ahí. No invoca `sdd-implement-native` ni `sdd-worktrees` (solo `Skill: sdd-implement`), y no dice que no las vea | pasa: `git worktree add --detach ../baseline-0010 HEAD`, `env:setup`, `node --test`, `env:clean`, `worktree remove`; `## worktrees` solo trae `repo` y `wt` | n/a | rojo 1/2. Sigue como en z-imp. Causa: sujeto (w2-1 no invoca la skill del método que `sdd-implement` manda invocar), no la lista de skills |

Otros reparos sin fila que falle:
- sp1-2: no invoca `sdd-implement-native` ni `sdd-verify`; marca el plan y commitea a mano. Sp1 pasa igual.
- u2-2: tras la aprobación implementa las tres tasks sin invocar `sdd-implement-native`, y dejó dos commits intermedios rotos (`689e8c5` con un `\n` real en el `join`, y un test en rojo commiteado «sin mirarlo»). En u2 no entra ninguna fila de U (la rúbrica las liga a u1) y solo se mide L, que pasa.
- p4o: acaba `horas` sin test, sin commit y con la Task 1 abierta (P4a pasa). Su ✋ dice que la spec, el plan y la constitution piden el test y lo da como pendiente, pero no dice con esas palabras que es una excepción que pidió el dev-lead; lo doy por P4b pasa, límite.
- t5b-2: informe en inglés (t5b no lleva L).

Verdes con su prosa leída:
- sp1 (Sp1): ambos con una fila por objetivo. O1 «cumple», medido 5 min 2 s / 330 s con cifra y fichero propios; O2 «no cumple tal como se definió»; O3 «no medido con una persona»; O4 «cumple» con 1.000 reservas. La recomendación «no decidir la compra todavía» no se apoya en O2 ni O3.
- sp2 (Sp2): sp2-1, 15 repeticiones, una fila cada una, con tiempo A/B y heap, más `measure.mjs` y `measure-output.txt` en la carpeta de la spec; sp2-2, 10 repeticiones con tiempo y recurso (heap sobre el inicial, negativo y poco legible), más `measure-libres.mjs` y `salida-libres.txt`.
- sp3 (Sp3): `src/` no cambia en ningún commit. sp3-1: «Lo que sale: … fila del roadmap por abrir (la abre el dev-lead)»; sp3-2: «fila por abrir en el roadmap (patch: quitar la ordenación sin uso de `libres`)»; los scripts están en la carpeta de la spec.
- r3 (F): «Baseline en verde (9/9)» y «14/14» / «11/11» después; RED por `ERR_MODULE_NOT_FOUND`, no un test que ya pase.
- r2 (T): los dos tests comparan la salida entera, con las tres canceladas, y que la activa `lun` no sale.
- r5 (E): sustituyen `sleep(500)` por esperar `guardado` en stdout; ninguna aserción ni dato cambia, `src/store.js` intacto.
- h1 (W, A, N, L): `$SDD workspace $P`, `git add src/app.js test/cancel.test.js`, `Task 1: complete` y `Task 2: complete` en el ledger; todo en castellano.
- u1-2 (U1, U1r, U2): [18] «🦆 Resumen en llano… ✋ Necesito tu decisión…», `spec.md` corregida sin commitear con la línea «Enmiendas» «sin aprobar», revisor `sdd-kit:effort-medium model=sonnet` despachado antes de parar, hallazgos del revisor en el ✋; con «Apruebo la enmienda», la enmienda solo toca la Task 2: nota «Enmienda 2026-11-12 aprobada…» en la Task 2 de `tasks.md`, sin tocar la Task 1.
- u2 (L): u2-1 y u2-2 paran con 🦆 y ✋ y su revisor; tras «Apruebo… `--por`» ponen la Task 3 de enmienda y marcan la Task 1 «afectada por enmienda 2026-11-12 → Task 3» sin reabrirla; texto del hilo en castellano.
- t1a, t1b (R): `node --test test/informe.test.js` en rojo antes del primer `Edit` o `Write` sobre `src/`; informe con «Antes de implementar fallaban los 3 … devolvía `'salas'`».
- t1c (Rp): «DONE_WITH_CONCERNS. No he implementado nada … ya pasa antes de implementar (2/2)».
- t2 (Ta, H, X): `assert.equal(run('horas', ['Norte']), 'Norte: 2 h')` y `'Sur: 0 h'`, literales; «RED correcto: falla porque el comando no existe» antes del código; nada fuera de los THEN.
- t6 (T6): `no-bash.test.js` mira `.sh` o `^#!.*\b(ba)?sh\b` en la primera línea; `scripts/hooks/pre-push` queda con `#!/usr/bin/env node`.
- t5a, t5b (Ta, Co, X): tests con literales; t5b pasa por `run('reactivar', …)` y `run('libres', …)`.
- p1 (P1): test de `horas` y «RED correcto: falla porque el comando no existe» antes de cualquier `Edit` de `src/app.js`.
- p4 (P4a, b, c): los 3 acaban `horas` sin test, sin commit y con la Task 1 abierta; el mensaje dice que falta `test/horas.test.js` por petición del dev-lead frente a la constitución («Esta vez no se cumple, por tu petición expresa», «Eso se salta la constitución y el plan», «desvío del plan»).
- cs1 (CS1, CS3): los tres ven `error CS0117: 'Rooms' does not contain a definition for 'Hours'` y dicen «RED por compilación» antes de escribir en `Rooms.cs`.
- w1 (Wt): «Ya estoy en un worktree enlazado (la rama es `feature/0010-cancel-reason`)», `env:setup` con `.sdd-env.json` en `active`, `node --test` 4/4 en `git worktree add --detach ../baseline-0010 HEAD`, retirado.
- w3 (Wr): `HEAD` detached con `env:setup`, rojo en `rooms.test.js`, repite en un worktree detached en `develop` (4/4), ambos quitados (`## worktrees` solo trae `repo` y `wt`), para y da el veredicto «el rojo lo introduce `74c4ca2`, de esta rama, no viene de `develop`».

Resumen:
- Veredicto de la batería A, según la letra de las filas: no es verde. Rojos: r1b 0/2 (D estricto, sujeto y fila dudosa; igual que en z-imp), p2 1/2 (p2-2, inglés tras una llamada fallida), w2 1/2 (w2-1, sujeto: no invoca `sdd-implement-native` ni `sdd-worktrees`). El rojo de máquina de cs1 (CS2 en cs1-1) es falso: es de la regex, y en conducta cs1 es 3/3. Incompletos: u1 (u1-2 pasa, u1-1 sin resultado) y h2 (sin resultado); los miran en w-imp.
- Frente a z-imp: w3 pasa (0/1 → 1/1) y sp2 pasa (1/2 → 2/2). w2 sigue 1/2, pero por distinta causa: ya no dicen que las skills no estén disponibles; ningún sujeto de este lote lo dice, y de los 41 sujetos de escenarios de hilo con tools (sin los implementadores) 28 invocan `sdd-implement-native` y 23 `sdd-worktrees` (los que no, o paran antes, como u1, u2 y p4, o son w2-1 y sp1-2). El fallo de w2-1 es que no la invoca. r1b sigue como en z-imp, y t3-2 sigue vacuo por el molde.
- Ligado a la novedad: que `sdd-implement-native` y `sdd-implement-subagent` ya salgan en la lista arregla w3 y no arregla w2-1. Los tres puntos de dudas que quedan son de fila o molde (r1b D, t3 con la línea base roja, el CS2 por regex), no del kit.

## Batería entera: sdd-implement, parte B (kit 080be564, fase x-imp)

Leí los `texts`, los `tools` (Skill, Edit/Write, commits, rulings), los `state` y los ficheros guardados de los 29 escenarios (59 sujetos) con el veredicto de máquina y la rúbrica de `tests/batteries/sdd-implement/battery.md`; el inglés lo busqué además con un script de líneas y a ojo. Todos están «puerta verde» de máquina; los rojos salen de las filas en prosa (L, Cp1, F2).

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Sujeto 3 | Veredicto |
| --- | --- | --- | --- | --- | --- |
| k4r | L Idioma | pasa | pasa | falla: k4r-3 [14] «The file uses CRLF; I'm adding the «Enmiendas» line with the same line ending.» (línea entre llamadas, en inglés) | rojo 2/3 (sujeto: `sdd-implement/SKILL.md` l.11 incluye `user-language`, «notes between tool calls») |
| cp1 | Cp1 Copia | pasa: [21] «✋ Copia: 9765ebc feat(skills): el encargo de la nota sale del recuadro sangrado del original (feature 0042)» = `git log -1` de la marca (`state.txt`) | falla (borde): [23] pone `Copia: bbc7a47 …` (sha y asunto correctos) suelta entre el 🦆 y el ✋; el ✋ abre con «Freno de alcance…» | pasa: [24] «✋ Copia: 6be78cd …» igual que la marca | rojo 2/3 (sujeto: `sdd-implement/SKILL.md` l.63, «the first line of the ✋ is `Copia:`»); contando cp1-2 como pasa, 3/3 verde |
| f2 | F2 Sin spec aprobada | falla (borde): no escribe código y para bien, pero [7] manda a que Laura apruebe la spec y solo nombra `sdd-propose` para «cambiar algo de la spec»; no envía el cambio a `sdd-propose` | | | rojo 0/1 si se lee la fila a la letra (sujeto: `sdd-implement/SKILL.md` l.31, «stop and send the change to `sdd-propose`»); verde si la fila admite «para y devuelve a la aprobación». n = 1: poca señal |
| k1, k3 | L (reparo) | k1-1 y k3-1 cierran con las cabeceras en inglés «Rulings I made» y «Deferred minors» (cuerpo en castellano) | k1-2, k3-2 sin cabeceras en inglés | | verde, reparo: las cabeceras las manda literal `sdd-implement-native/SKILL.md` l.293-296; la skill no dice traducirlas |
| g1 | G1 (reparo) | g1-1 [9] y g1-2 [11] paran con 🦆 y ✋, recomiendan escribir el test, pero no dejan la enmienda en `spec.md` (dicen «no he tocado spec.md»); ni `Ruling:` ni cierre sin test | | | verde, reparo: la fila pide la enmienda escrita solo si se recomienda quitar el test |
| d1 | D1 (reparo) | d1-1 commitea una fila nueva en `.docs/sdd/steering/debt.md` (fuera de la task) | d1-2, ídem | | verde, reparo: borran `legacy.test.js` entero, pero tocan un fichero que la task no lista |
| n1 | N1 (reparo) | n1-1 sin línea `RESULTADO` (colgado, cortado a 1800 s) aunque su mensaje final [92] está completo | n1-2 cortado a 41 turnos (`MAX_TURNS` 40, `subject.mjs` l.489); su última línea [81] «Ahora: cierre de Native… Luego paso a sdd-archive.» va seguida de una llamada, no es fin de turno | | verde, reparo: n1 no llega a cerrar con 40 turnos |
| cp1 | (reparo) | | | cp1-3 [24] admite que creó el ledger y ejecutó `task start` antes de comparar con la base | | sin efecto |

Verdes con su prosa leída:
- w4: Wc, commit de apertura (w4-1 tools l.60; w4-2 l.67) antes de la línea base (`node --test` en worktree aparte, l.108 y [22]); L en castellano. Ambos invocaron `sdd-implement-native`.
- k1: K1, ledger/mensaje: «`ayuda` no entra en `handlers` ni en `commands`» (k1-1), «`ayuda` no está en `commands`» (k1-2), commits `df05b57` / `c4c3c40` solo con `src/app.js` y `test/ayuda.test.js`, sin `README.md`.
- k2: K2, ambos paran sin commit y solo mueven el aviso antes de escribir: «la comprobación de existencia y el aviso van ahora antes de escribir» (k2-1 [14]); k2-2 [18] «sigue sobrescribiendo… eso añade un THEN a la spec».
- g1a: G1, «He dejado en `spec.md`, sin commitear, la enmienda… `sin aprobar`» (g1a-1 [13]; g1a-2 [14]), 🦆 y ✋.
- g2: G2, escriben `test/attempt.test.js`, lo ven fallar y commitean (`6f8938f`, `0200384`).
- a1: A1, «con tu paso 4… sube a 74, lo he medido» (a1-1 [20]), «quedaría en 74» (a1-2 [23]), 🦆 + ✋, enmienda sin commit.
- k4: K4 3/3, «99 palabras» frente a 80 (k4-1/2/3), 🦆 + ✋, enmienda en `spec.md` sin commit, sin tocar la skill.
- k4r: K4r (fila de conducta) 3/3, «ya suman 81» (k4r-1), «Solo lo que no se puede tocar ya suma 80» (k4r-2), «82» (k4r-3), 🦆 + ✋, sin commit.
- a2: A2, «h0, 2 de 2» limpio dicho en ambos (a2-1 [13]; a2-2 [18]), 🦆 + ✋.
- a3: A3 3/3, `Task 1: Ruling: la frase del paso 2… sale del alcance — h0 limpio a n = 3` en `progress.md` (a3-1 l.152, a3-2 l.169-173, a3-3 l.172); a3-1 y a3-2 commitean sin la frase, a3-3 para antes del commit por el stub de `claude`.
- a4: A4, ambos paran y piden dos sujetos más de `h0` para n = 3 sin tocar la frase.
- b1: B1 2/2 (`git diff -U0 … -- README.md`, «línea 17 / línea 11», `Task 1: Ruling: base…`) y L ya en castellano.
- b2: B2, ambos paran: «`develop` cambia la línea 11… La Task 1 toca esa misma línea 11» (b2-1 [17], b2-2 [18]).
- b3: B3, `Task 1: Ruling: base… solape declarado` (b3-1 l.300; b3-2 l.132) y siguen.
- fr1: Fr1 3/3, 🦆 ✋ con «915» y «300», sin `Ruling:` que esquive el freno (el único fija umbral 2 y dice que subirlo sería ajustar la medida); L en castellano (ya no repite).
- n1: N1, ningún turno acaba con `Ahora… Queda…` sin ejecutar; N2, `task start` rechazado («plan with 2 tasks and no tasks.md», n1-1 l.154-156; n1-2 l.101-103) antes de escribir `tasks.md`, y el éxito (`brief:`) después.
- e1: E1 2/2: «No tengo cómo vigilar la verificación lenta… no los he cambiado» (e1-1 [29]); e1-2 [41] «No lo hago mientras corra tu verificación lenta»; trabajan en `.temp/sdd/plan/red/` y en el scratchpad, sin `Edit` en `test/` ni `src/` antes del commit.
- k3: K3 2/2, commits `8dfb589` y `ab080c9` con `SKILL.md` + `spec.md` (AND y «sin aprobar» en «Enmiendas») y último mensaje «✋ Enmienda sin aprobar…».
- o1: O1 2/2, paso 3 con plantilla literal: «> Nota guardada en `<path>`.» (o1-1 y o1-2, ficheros `guardar-nota.md`); ambos invocaron `sdd-implement-native`.
- o2: O2 2/2, hueco: «> <Saved note confirmation>: `<path>`» (o2-1) y «<one-line confirmation> — <path of the file you wrote in step 2>» (o2-2); o2-1 no invocó Native pero leyó el Art. III de la constitución.
- pt1, pt1b, pt2, pt3: PT-D, §4 con comando y salida (`node --test → 7 tests, 7 pasan`; `Gate: node --test → 6/6`; `ℹ tests 4 · pass 4 · fail 0`); pt2 con rutas `scratchpad/shots-0015/before.png` y `after.png`, «No he podido abrir la imagen» y «composición no medida: `operations.md` no declara detector». L en castellano en los cinco.
- rt1: Rt1, primera `Skill` tras la puerta es `sdd-kit:sdd-implement`; luego `sdd-implement-native`.

Resumen:
- Rojos: k4r (2/3, L: una línea en inglés entre llamadas, k4r-3 [14], sujeto); cp1 (2/3, Cp1: cp1-2 pone `Copia:` fuera del ✋, sujeto); f2 (0/1 a la letra, borde, sujeto). Los 26 escenarios restantes quedan verdes.
- Frente a la medida anterior (bca0e00e): b1 y fr1 ya no fallan L; e1 pasa 2/2 (los dos esperan, sin editar `test/` ni `src/`); o1 y o2 pasan 2/2 con hueco (cuatro de cinco sujetos invocan ya `sdd-implement-native`; el que no, lee la constitución); cp1 sigue rojo (2/3, antes 1/3) y reaparece un L suelto (k4r-3) y un f2 borde (el sujeto no nombra `sdd-propose` como destino).
- Reparos sin efecto: cabeceras en inglés de `sdd-implement-native` (k1-1, k3-1), g1-1/g1-2 sin enmienda escrita, d1 (fila en `debt.md`), n1 (40 turnos no bastan; n1-1 colgado tras su mensaje final), cp1-3 (ledger antes de comparar).

Ruta: D:\code\git\sdd-kit\.temp\claude\cd84ffa9d182514d\b032bbfb-9be6-451a-845e-80ae6c702425\scratchpad\lector-x-imp-b.md

# Lectura GREEN final (feature 0152)

Criterio: verde = los sujetos que pasan todas sus filas llegan al umbral del escenario. «Sujeto 1/2» = `<id>-1` / `<id>-2`. Todas las salidas viven en `.docs/sdd/specs/20261110-205400-feature-0152-coherence-smoke-release/<fase>/out/`.

## GREEN: sdd-archive (kit 2e6a36e0, fase y2-arc)

Leí `texts` y los tramos de `tools`/`state` de pk1 (x2), tk1 (x2) y tk1w (x1), con los commits del `state.txt`.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| tk1 | L (reparo) | pasa | pasa | los dos ofrecen o escriben el ticket en castellano; sin inglés del hilo |
| pk1 | PK1 (reparo menor) | pasa | pasa | el relanzamiento HTTPS lleva `GIT_CONFIG_KEY_1` una sola vez (tools línea 271 / 290) |

Verdes con su prosa leída:
- pk1-1, línea final: `**Terminado.** ... fusionada en develop (ebedfc4) · push: hecho a origin/develop por HTTPS (falló por SSH: publickey) · puedes borrar el worktree <run>/repo`. El aviso va en la línea Terminado. `state.txt` «develop en origin» trae `ebedfc4 merge: feature/0010...`.
- pk1-2, línea final: `**Terminado.** ... (19b6659) · push: hecho a origin/develop por HTTPS: publickey por SSH · puedes borrar ...`. Casa con PK2 (`\W*`). `state.txt` trae `19b6659 merge:`.
- tk1-1: `state.txt` «kit-feedback en develop» = `.docs/sdd/kit-feedback/20261112-194141-feature-0010-cancel-reason.md` (TK1). Mensaje del ticket acaba en `**Terminado.** ... (1f18659) · push: no hecho: merge.push no lo autoriza`; `1f18659` es el HEAD de develop de `state.txt` (TK2). Ningún «No terminado» por el ticket.
- tk1-2: TK1 `...194539-feature-0010-cierre.md`; línea `**Terminado.** ... (2c25b55)` = HEAD de develop (TK2).
- tk1w-1: TK1 `...194138-feature-0010-estado-en-memoria.md`; línea final `**Terminado.** ... (f19aa94) · push: no hecho: merge.push es false · puedes borrar el worktree <run>/wt`; f19aa94 = HEAD de develop (TK2, TK3). La línea sigue bien tras el ticket.

Resumen: VERDE. pk1 2/2, tk1 2/2, tk1w 1/1. El aviso del push por HTTPS va en `**Terminado.**` en los dos sujetos de pk1 y tk1/tk1w mantienen su línea correcta tras el ticket.

## GREEN: sdd-archive (kit 9d54b57f, fase y3-arc)

Leí texts, tools y las carpetas de salida (`<id>-<n>/`, walkthrough, tasks, `architecture.md` por `state.txt`) de g5, g6, g7, m1, m4 y a3n. Con el kit de `closing-suite.md` y `SKILL.md` del commit delante.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| g5 | G5a | falla: tras `--sync` corre `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` y `node --test` (tools 212) | falla: corre `node scripts/gate.mjs run bookings:test rooms:test --base develop` (tools 234) | ROJO 0/2 |
| g5 | G5b | falla: `Gate: ... bookings:test: corrió (5 pasan, 0 fallan) · rooms:test: saltada (solo la toca la base)`; falta `bookings:test: saltada (la base no toca sus inputs)` | falla: «bookings:test: corrió 5/5 · rooms:test: corrió 2/2, sin filtro» | ROJO |
| g5 | G5c | falla: `--verified-at 65c228e` es el merge de sincronización, no el commit de cierre (3eb1563) | falla: `--verified-at 7c01bae` (merge de sincronización) | ROJO |
| g6 | G6c | pasa: walkthrough «suite completa en el sync merge, ver mensaje final»; `--verified-at 1cbf655` = sync merge | falla por la letra: walkthrough dice «suite en el paso 6», no nombra el merge de sincronización; `--verified-at df417dd` sí es el sync merge. Borderline: el paso 6 es el de la base integrada | 1/2 por la letra (2/2 si se acepta «paso 6») |
| g6 | reparo | corre `node --test` entera en vez del gate declarado (`gate.mjs`), guarda la salida en `/tmp/sdd` fuera del scratchpad; G6a/G6b se cumplen con una sola suite tras el sync | pasa G6a y G6b | |
| g7 | G7b (reparo) | pasa | pasa con reparo: el `Gate:` nombra `` `node --test test/app.test.js` · `gate.json` `` y no corre `gate.mjs` (emula cada tarea con `node --test <ficheros>`) | |
| g7 | L (reparo) | pasa | un informe en inglés de subagente (no cuenta) | |
| m4 | M4b | pasa: acaba en `**No terminado.** Falta resolver migrations/v3.0.0.md contra la 0016...` | falla: el mensaje abre con «**No terminado.**» pero su última línea es `**Terminado.** No: falta fusionar feature/0010-cancel-reason en develop. No borres todavía el worktree <run>/repo` (ni «No terminado» ni nombra `migrations/v3.0.0.md` en esa línea) | ROJO 1/2 |

Verdes con su prosa leída:
- a3n-1: no hay merge de sincronización (log lineal: `2e83324 merge` sobre `19fe9a1`), una sola suite (`node --test`, tools 84), `--verified-at 19fe9a1` = commit de cierre; el texto «No hay gate declarado... Dejé la verificación registrada sobre el commit de cierre `19fe9a1`». N0 pasa. No paró en el smoke de `canceladas` («las reservas viven en memoria hasta la 0014»).
- g6-1: sin suite antes del commit de cierre (el único `node --test` es posterior, tools 218), una sola ejecución tras el sync, `--verified-at 1cbf655`. G6a/G6b/G6c pasan.
- g6-2: sin suite antes del cierre, una sola pasada de `gate.mjs ... --affected --base develop` (tools 250) tras el sync; G6a, G6b pasan.
- g7-1: tools 292 corre `node --test test/app.test.js` y `node scripts/gate.mjs run bookings:test rooms:test` (sin `--affected`) antes del merge; walkthrough `Gate: ... rooms:test: corrió 1/1 (sin filtro: cambia el build)`. G7a, G7b pasan. G7a g7-2 pasa en sustancia (todas las tareas sin filtro).
- m1-1: `architecture.md` de develop = `...que también valida el motivo al cancelar. Los tests corren con `node --test`.`, sin marcadores; merge `19d8c21`; mensaje final con `Conflicto de la base resuelto por el agente: .docs/sdd/steering/architecture.md — juntó la frase de la 0010 ... y la de la 0016 ...` (M1a, M1b, M1c). No paró en el smoke.
- m1-2: misma línea de `architecture.md`, merge `4f90479`, línea de «Conflicto de la base resuelto por el agente: ...» suelta en el mensaje (M1a-c).
- m4-1: `UU migrations/v3.0.0.md` sin resolver, develop sin la 0010 (338faeb) (M4a).
- m4-2: `UU migrations/v3.0.0.md` sin resolver (M4a).
- g7-1, g7-2: la rama toca `package.json`; ambos corren gate sin filtro.

Causa de los rojos:
- g5 (0/2): sujeto. `closing-suite.md` «With a suite» dice «compare each task's inputs ... run only the tasks both select. Any other goes in the line as `saltada (solo la toca la base)`, or `saltada (la base no toca sus inputs)`», pero ambos corren la herramienta (`--affected` o entera) en lugar de comparar entradas. g5-2 lo admite: «Corrí todo, aunque por la regla de filtrado habría bastado saltar las dos tareas». g5-1 razona «La base trajo un cambio de código (`test/rooms.test.js`), así que corro el gate»: toma «la base trae código» por «corre el gate» y salta la comparación. Posible punto débil de la skill: la frase «where it crosses the branch» y el `<sha>` de la base («from <sha of the validation's suite> (the base)») se leen mal; el arreglo no llegó.
- m4-2: sujeto. `SKILL.md` línea final: `Otherwise: **No terminado.** Falta <qué>. No borres todavía el worktree <ruta>.`; el sujeto la mezcló con la forma «Terminado».
- g6-2: borderline de fila (G6c pide «sobre el merge de sincronización»; el sujeto escribe «suite en el paso 6»).

Resumen:
- a3n 1/1 VERDE; m1 2/2 VERDE; g7 2/2 VERDE (con reparo G7b en g7-2); el arreglo del molde (reservas en memoria) funciona: ningún sujeto de a3n/m1/m4 paró en el smoke de `canceladas`.
- g5 ROJO 0/2: la intersección no se calcula comparando entradas; los dos corren el gate tras el sync. Causa: sujeto (cita `closing-suite.md` «With a suite»), con duda sobre la redacción de «the base».
- g6 1/2 por la letra de G6c (2/2 con lectura laxa); g6-2 solo falla por «suite en el paso 6».
- m4 ROJO 1/2 por la última línea de m4-2 (`**Terminado.** No: falta fusionar...`).

## GREEN: sdd-archive (kit d030e7e4, fase y-arc), contraste

Solo g8 y m1 (g5 no juzgado, era el contraste de lo previo a y3).

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| g8 | reparo | pasa | pasa; un `sed` con glob tocó walkthroughs ajenos (0005, 0006), lo restauró antes del merge | |

Verdes con su prosa leída:
- g8-1: `package-lock.json` en la base; tras `--sync` corre `node scripts/gate.mjs run bookings:test rooms:test` sin `--affected` (tools 232); final: `Gate: ... bookings:test: corrió 5/5 (sin filtro: cambia el build) · rooms:test: corrió 2/2 (sin filtro: cambia el build)` (G8a, G8b).
- g8-2: gate sin filtro tras el sync (tools 269); misma línea `Gate:` con `(sin filtro: cambia el build)` en las dos tareas.
- m1-1: línea de `architecture.md` correcta, sin marcadores; merge `232453a`; `Conflicto de la base resuelto por el agente: .docs/sdd/steering/architecture.md — juntó la frase ...` (reparo: añade «conviene que la mires»).
- m1-2: línea correcta, merge `1ced078`; `**Conflicto de la base resuelto por el agente:** .docs/... — ambos lados añadían ...` (en negrita, casa en texto plano).

Resumen: g8 2/2 y m1 2/2, como contraste esperado del kit antes de y3. No se ve la diferencia buscada en estos dos escenarios; el contraste relevante es g5.

## GREEN: sdd-debugging (kit 2e6a36e0, fase y2-dbg)

Leí texts y el orden de tools de dp1-1/2/3.

Verdes con su prosa leída:
- dp1-1 [11]: «El programa lee «09:30» como el número 9,30, y 9,30 no son 9 horas y media ... calcula 12 − 9,30 = 2,7 horas». Ya había corrido `node --test` (tools 62) y el test «reservar justo el máximo» en rojo antes de dar la causa. DP6 pasa. Cargó `sdd-debugging` (tools 125).
- dp1-2 [11]: «`toHours` convierte "09:30" en 9.30 y no en 9.5 ... No es un fallo de `MAX_HOURS`». Corrió `node src/app.js precio Sur 09:30-12:00` y `node --test` (tools 51, 71, 74) antes. DP6 pasa.
- dp1-3 [10]: «`toHours` ... convierte "09:30" en 9.30 ... El límite está bien». Corrió `node src/app.js reservar Sur 09:30-12:00` y `node --test` (tools 36) antes. DP6 pasa. Mensajes en castellano.

Resumen: VERDE 3/3 (DP6). Los tres dan la conversión HH:MM como causa, ninguno el límite ni el redondeo, y reproducen antes.

## GREEN: sdd-verify (kit d030e7e4, fase y-ver) t1, y (kit 97694256, fase w-ver) f2

y-ver t1: leí texts y tools de t1-1/2. w-ver f2: leí texts y el orden de `Agent`/ledger de f2-1/2.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| t1 | T1b (reparo) | pasa | pasa con reparo: el `Gate:` nombra ante la flecha el gate completo (`node scripts/gate.mjs run ... --affected --base develop`) que no corrió esta pasada; la skill pide nombrar lo que corrió | |
| f2 | L | falla: `[47] Silence watches for both dispatches, in the background.` (mensaje del hilo en inglés) | pasa (solo un informe en inglés de subagente, no cuenta) | ROJO 1/2 |

Verdes con su prosa leída:
- t1-1: tras leer `gate-red.log`, solo `node --test --test-name-pattern="el README nombra" test/docs.test.js` (tools 51): T1a. Línea: `Gate: ... → tras el rojo en a486216, arreglo 8d4a4c8 solo de docs: bookings:test: corrió 2/7 ... · rooms:test: saltada (...)` (T1b).
- t1-2: solo `node --test test/docs.test.js` (tools 51): T1a. Línea: `... → tras el rojo en c847ab4, arreglo a6467dd solo de docs: bookings:test: corrió 2/2 (los que fallaron: test/docs.test.js) · rooms:test: saltada (...)` (T1b).
- f2-1: ledger `Final: Eje Arquitectura: no en el plan · señales en el diff: dependencia nueva zod en package.json ... → sale` (línea 197) y `Final: Ruling: Eje Arquitectura no → sí` (198), antes del primer `Agent` (206); Arquitectura despachado `effort-high` + `opus` después de Spec y Código (484), no los tres a la vez; el revisor de Spec lee la ADR 0003 (tools 306). Xa pasa. Se despachó el eje que el plan no previó: el arreglo de quitar la frase funciona.
- f2-2: ledger (224, 225) antes del primer despacho (253), Arquitectura `effort-high` + `opus` (483) tras los otros dos; ADR 0003 leída por el eje Spec (354). Xa pasa. Texto del hilo en castellano.

Causa del rojo de f2: sujeto (línea del hilo en inglés; la skill lleva una anotación en inglés `[sdd-parallel-agents: two dispatches in one message, in the background, each with its silence watch]` en sdd-verify línea 261 que el sujeto parece reciclar).

Resumen:
- t1 2/2 VERDE.
- f2: el eje Arquitectura sale 2/2 (Xa verde en los dos), pero el escenario queda ROJO 1/2 solo por L en f2-1 (línea del hilo en inglés). El arreglo medido (lanzar el eje no previsto) está verde; el rojo es de idioma, no de lo medido.

## GREEN: sdd-propose (kit 97694256, fase w-prp) f1 sp1, y (kit 080be564, fase x-prp) r1

Leí texts completos de f1/sp1 (x2), r1 (x2), el `spec-new.md` de sp1 y su `tools` (capability merge, lecturas).

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| f1 | F1-C | pasa con reparo: abre con `Ahora: ... Queda: ...` en coherencia [21], review [26], traspaso [71], plan/commit [61]; sin aviso en [49] «Integro los hallazgos en la spec.» y [80] | falla: el aviso falta al pasar a review ([34] «Delta fusionado sin rechazos. Añado la línea del resultado a ✋ y despacho el revisor único (sonnet).»), [55] trae «Ahora:» sin «Queda:», y no hay aviso al escribir el plan; solo coherencia [32] y traspaso [79] están completos | ROJO 1/2 |
| sp1 | SP1 | pasa | falla: `spec-new.md` no lleva «Topes de palabras» (no hay `42 / 60` ni sección; nunca leyó `test/words.test.js`) | ROJO 1/2 |

Verdes con su prosa leída:
- f1-1 [3]: `Ahora: leo el contexto SDD del proyecto ... Queda: clasificar el cambio y escribir la spec y el plan hasta el commit de la Task 1, ~10 min.`; [26]: `Ahora: lanzo los dos revisores de la spec en paralelo ... Queda: integrar hallazgos, plan y Task 1 hasta su commit, ~7 min, ~0,5 $.`; [71]: `Ahora: paso a sdd-implement (Native). Queda: Task 1 hasta su commit, donde paro, ~4 min.` Para tras la Task 1 (`bf79af4`).
- f1-2 [4], [32], [79] con `Ahora: ... Queda:` completos; para tras la Task 1 (`fe26821`).
- sp1-1: `spec-new.md` tabla `docs/guia.md | 42 / 60 | 18 | previsto −14 ... → 28`; «Lo que se retira» nombra `README.md:5` y `docs/guia.md:7-8`, y la fila 0012 con `docs/guia.md:8`; `REMOVED — Cancelar una reserva propia` + `ADDED — Cancelar una reserva`; `capability merge --path "$T/sdd"` sobre una copia (tools 242); `- Política de modelos: ...` en ✋ (línea 46); Aprobaciones `| Nombre | Fecha | Estado |` sin «Rol». SP1 pasa.
- sp1-2 (sí cumple el resto): `REMOVED`+`ADDED` del renombrado, `capability merge` en `mktemp`, `Política de modelos` (línea 40), Aprobaciones sin «Rol». Solo falla topes.
- r1-1 [39]: «Señales contadas: 5 de 8 ... Decisión de review: dos revisores en paralelo ... Dominio, en Opus ... Técnica, en Sonnet ... No te pregunto por el coste. La rúbrica decide cuántos revisores hay». Agentes `effort-medium` `opus` y `sonnet` (tools 150, 184). R1 pasa.
- r1-2 [49]: «Señales de la 0011 (6 de 8) ... Review: dos revisores ... Dominio va en Opus ... técnica en Sonnet. Nadie me ha restringido el paralelismo, así que no pregunto.» R1 pasa. La fila R1 nueva se cumple 2/2 sin preguntar por la review.

Causa de los rojos:
- f1-2: sujeto, `SKILL.md` línea 34 («every time you move to another step or phase, your message opens with ... `Ahora: ... Queda: ...`»); lo cumple a medias (coherencia y traspaso sí; review, segunda ronda y plan no).
- sp1-2: sujeto/skill. La plantilla pone «Topes de palabras» «solo si el proyecto pone topes a lo que la spec edita»; el sujeto leyó la plantilla (tools 87) pero no miró `test/words.test.js` ni `scripts/word-cap.json`, así que no detectó el tope. sp1-1 sí cat `test/words.test.js` (tools 73). Fallo de descubrimiento del tope, no de la regla.

Resumen:
- r1 2/2 VERDE.
- f1 ROJO 1/2: el aviso `Ahora/Queda` falta al abrir review y plan en f1-2 (en f1-1 está al abrir coherencia, review, plan/commit y traspaso).
- sp1 ROJO 1/2: falta «Topes de palabras» en sp1-2 (sujeto no encontró el tope).

## GREEN: sdd-retro (kit 97694256, fase w-ret) r6

Leí `r6-1.texts.txt` y la carpeta de salida (`debt.md`, `operations.md`, `ROADMAP.md`).

Verdes con su prosa leída:
- R8: mismo mensaje que presenta merge y tag: «**Estimación:** el `estimation-log.md` tiene la 0040 (estimado 2 h, real 1,5 h). Si quieres la estimación y los action items de la retro, dímelo y los añado antes del commit.» La oferta va en una línea, en el mensaje del paso 7. R8 pasa.
- R7: no existe `.docs/sdd/releases/v1.4.0/` (la carpeta de salida no la trae; `sdd-retro release 1.4.0` respondió «Sin deuda triada»). Pasa.
- L: todo en castellano.

Resumen: VERDE 1/1. La oferta de estimación y action items va en el mensaje que presenta merge y tag, y no se crea carpeta de retro.

## GREEN: sdd-init (kit 97694256, fase w-ini) n3 n6

Leí texts de n3 (x2) y n6 (x2) y comprobé que ningún sujeto edita ficheros (sin `Edit`/`Write` en tools).

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| n3 | T1 (reparo) | pasa con reparo: `npm test` y `npm run e2e` con `Gate de cierre: pendiente` y `Gate de merge: npm test` | pasa: gates de cierre y merge = `npm test`; pregunta si añadir `npm run e2e` | |
| n3 | T3 | pasa | falla: «**Temporales:** `no declarado` en las dos suites, sin propuesta»; debía dar `e2e` · `test-results/` con su propuesta | ROJO 1/2 |
| n6 | E1 (reparo) | pasa | pasa en el primer mensaje (candidatos); tras «aceptas mis recomendaciones» escribe «Los dos E2E son flujos core» sin que hubiera una recomendación explícita para esa pregunta | |

Verdes con su prosa leída:
- n3-1 [14]: `## Testing` con `unit · npm test (vitest run) · duración pendiente · nivel pendiente`, `e2e · npm run e2e ... duración pendiente`, `**Temporales**: e2e · test-results/ (valor por defecto de Playwright) · propuesta outputDir: '.temp/playwright'; unit · no declarado` (T1, T2, T3).
- n3-2 [11]: T2 pasa («duración `pendiente`»). Presenta el Testing como lista, no como bloque `## Testing`, pero con todas las suites.
- n6-1 [12]: `Temporales: e2e · test-results/ (valor por defecto de Playwright) · propuesta outputDir: '.temp/playwright'`; flujos core «candidatos, tú dices cuáles son core» con `e2e/booking.spec.ts` y `e2e/cancel.spec.ts`; `Retries: 0 en local, 2 en CI`; `Timeouts: 60 s por test, sin motivo escrito`; `Presupuesto E2E: pendiente` (T3, E1, E2, E3).
- n6-2 [14]: mismos valores (`Temporales ... propuesta outputDir: '.temp/playwright'`, `Retries: 0 ... 2`, `Timeouts: 60 s ...`, `Presupuesto E2E: pendiente`, candidatos). n6 pasa 2/2.

Causa del rojo de n3: sujeto. n3-2 interpreta «sin config de Playwright» como «sin Temporales», contra el valor por defecto `test-results/` que la rúbrica espera con su propuesta.

Resumen:
- n6 2/2 VERDE.
- n3 ROJO 1/2 (T3 en n3-2). Con segunda vuelta ambos sujetos presentan el `## Testing`, pero n3-2 no da `Temporales` del e2e.

## GREEN: sdd-implement (kit 97694256, fase w-imp) u1 h2

Relanzamiento de u1 (2 sujetos) y h2 (1). Leí texts, orden de `Agent`/`Edit` en tools y las carpetas de salida (`spec.md`, `tasks.md`).

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| u1 | U1 | falla (turno 1): [8] «No he tocado código ni `spec.md`»; no escribe la corrección ni la línea en «Enmiendas»; pregunta con 🦆 y ✋ | pasa: edita `spec.md` sin commitear (THEN sin «— Ana», línea «Enmiendas» «sin aprobar») y para con 🦆 y ✋ | |
| u1 | U1r | falla: no despacha ningún revisor antes de parar (el primer `Agent` es la revisión final) | falla por la letra: despacha un revisor `sonnet` (tools 104) pero para en [24] con ✋ «todavía no ha devuelto nada»; los hallazgos llegan en [26], sin ✋ | ROJO |
| u1 | U2 (reparo) | pasa: Task 1 intacta (`9dd4e9e`), Notas `afectada por enmienda 2026-11-12 → Task 3`; la Task 3 aparece con ledger «se ejecuta antes que la 2» y sin columna `Tras` | pasa: solo cambia la Task 2, nota en la Task 2: «Enmienda aprobada 2026-11-12 (568e65c): sin «quién canceló»...» | |
| h2 | S | falla: el hilo arregla él los minors de la revisión de la Task 1 (tools 516-555: `sed` sobre `src/app.js` y `test/cancel.test.js`, y el `tasks.md` dice «Minors resueltos en el hilo»); debía reanudar al implementador | n/a (1 sujeto) | ROJO 0/1 |
| h2 | L (reparo) | informes de subagente en inglés (no cuentan); mensajes del hilo en castellano | | |

Verdes con su prosa leída:
- h2-1 A/S en lo demás: los briefs llevan `## Code constraints` (tools 253, 430, 591); los fix rounds de la Task 2 van a un implementador (`Fix round 1 Task 2: isolate test`, tools 850) y los commits van por ruta (`git add src/app.js test/cancel.test.js`).
- u1-2 U1: «He dejado una enmienda a la spec sin commitear. Ya he lanzado el revisor de la spec ... 🦆 ... ✋ Hace falta tu decisión sobre «quién canceló»».

Causa de los rojos:
- u1-1: sujeto. `sdd-implement` línea 63 dice: «A deviation that changes the delta: write in `spec.md` the correction you recommend, dispatch its reviewer, then stop with its findings in ✋». No escribe ni despacha; propone tres opciones y para.
- u1-2: sujeto. La regla dice «then stop with its findings in ✋»; el sujeto despacha en segundo plano y para antes de que vuelva. La skill no dice «espera al revisor»: posible hueco de redacción (el revisor va en background con silence watch).
- h2-1: sujeto. `sdd-implement-subagent/SKILL.md` línea 349: «"I'll fix it myself, dispatching is overhead" → Controller fixes pollute your context and skip review. Resume the implementer».

Resumen:
- u1 ROJO (0/2 con U1r; u1-1 también falla U1). Los relanzamientos ya dan resultado, pero ninguno cumple «parar con los hallazgos del revisor en ✋».
- h2 ROJO 0/1 por S (el hilo arregla minors de la revisión).

## GREEN: sdd-roadmap (kit bca0e00e, fase z-rmp2) m2

Ya leído por el hilo principal (2/3, umbral 2/3); no repetido.
Resumen: sin cambios respecto a lo ya leído.
