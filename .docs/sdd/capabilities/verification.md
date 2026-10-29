# Capacidad — verification

## Propósito

la revisión final de rama y la evidencia antes de afirmar: los ejes y lo que recibe cada uno, el cierre único, el paquete, el worktree aislado, la línea `Revisión final:` y la Confirmación de las ADR.

## Requisitos

### No se afirma un estado sin la evidencia de esta sesión

- GIVEN la Task 2 de un plan Native, con su «Verificación» `npm test -- cancel`, y el hilo a punto de escribir su línea `complete`
- WHEN el hilo dice que la task pasa
- THEN antes ha ejecutado `npm test -- cancel` en esta sesión y ha leído su salida («8/8 pass»), y la línea la escribe `sdd task done` con ese resultado
- AND «debería pasar», «parece correcto» o el informe de un subagente sin su diff comprobado no cuentan como evidencia

### El kit no invoca las skills de superpowers que sustituye `sdd-verify`

- GIVEN los ficheros de `skills/` de la rama
- WHEN se buscan `superpowers:verification-before-completion`, `superpowers:requesting-code-review` y `code-reviewer.md` de superpowers
- THEN ninguno aparece: el contrato de cierre de `sdd-implement` y la comprobación de la revisión final de `sdd-archive` invocan `sdd-verify`
- AND los nombres de las fuentes solo aparecen en el `NOTICE` de `sdd-verify` y en su anexo de procedencia

### La revisión final sale en ejes, en paralelo

- GIVEN un plan con `Ejecución: native`, todas sus tasks completas en el ledger, `Eje Arquitectura: no — solo texto de skills` y el commit `a1b2c3d` de su última task
- WHEN el hilo despacha la revisión final
- THEN con `sdd-parallel-agents` y en segundo plano salen dos revisores sobre `a1b2c3d`: el eje Spec con `sdd-kit:effort-high` + `opus` y el eje Código con `sdd-kit:effort-high` + `sonnet`, cada uno con su vigía de silencio
- AND el encargo de cada eje lleva la cabecera de `encargo-revision.md` («Restricciones de código»), su sección «Cómo revisar» y el encargo de su eje de `sdd-verify`
- AND el eje Spec recibe además las rutas de `spec.md` y `plan.md`, la sección `## Review Focus` del plan literal, la lista de ADR `accepted` de `sdd decision index --files <ficheros del diff>`, la salida de `sdd capability index` y el puntero a las líneas `Ruling:` y `minor (deferred)` del ledger; el eje Código, el paquete y «Flujos core», «Retries» y «Timeouts» de `operations.md` §Testing, literales, o `sin E2E declarados`; el eje Arquitectura, el paquete y `architecture.md`
- AND con `Eje Arquitectura: sí — <frontera>` sale además el eje Arquitectura, con `sdd-kit:effort-high` + `opus`
- AND con `control.maxParallelAgents: 2` y tres ejes, salen dos y el tercero cuando vuelve uno
- AND los ejes trabajan en el mismo worktree desanclado `review-<id>-a1b2c3d`
- AND un eje colgado se relanza solo, una vez, como dice «Vigía de silencio», y los demás siguen
- AND el hilo recibe los informes por eje y no fusiona ni reordena hallazgos de un eje con los de otro
- AND en `delegate`, si la spec aprobada lleva la línea `Política de modelos:` con esos ejes y las instrucciones del usuario piden confirmar antes de paralelizar, los despacha sin preguntar; un eje que la línea no nombra (el Arquitectura que sube el hilo) se confirma

### El eje Arquitectura lo declara el plan y el hilo solo lo sube

- GIVEN un plan con `Eje Arquitectura: no — sin módulos nuevos` y un diff que añade `"zod"` a `dependencies` de `package.json`
- WHEN el hilo va a despachar la revisión final
- THEN despacha también el eje Arquitectura y registra en el ledger `Final: Ruling: Eje Arquitectura no → sí — dependencia nueva zod en package.json — <coste si se equivoca>`
- AND `tasks.md` lo escribe `Arquitectura opus+high, <veredicto> (subido: dependencia nueva zod)`
- AND con `Eje Arquitectura: sí` nunca lo quita
- AND sin la línea —en lite, sin plan, o con un plan anterior al kit nuevo—, el hilo lo decide al despachar con las señales de `plan-writing.md` (módulo nuevo, dependencia nueva en un manifest, contrato entre módulos, datos) y lo registra en el ledger como ruling

### El eje Spec contrasta el diff con el delta de capacidades

- GIVEN una spec cuyo delta trae `REMOVED — Las anulaciones se avisan por correo` en `bookings`, y un diff que deja `sendCancellationMail()` llamado desde `annul()` en `src/annul.js`
- WHEN revisa el eje Spec
- THEN marca Critical «REMOVED sigue implementado: Las anulaciones se avisan por correo», con `src/annul.js:<línea>` y el tipo de hueco `contradicts`
- AND un `ADDED` o `MODIFIED` sin implementación es `missing` o `partial`, con el THEN del que sale
- AND un THEN cuya verificación nombrada en «Dónde se prueba» (un test, un escenario de batería, una captura) no está en el diff es un hallazgo; si el paquete no deja verlo, es «no verificado»
- AND con el mismo diff cambiando además la respuesta de `facturar` en `src/invoices.js`, de la capacidad `invoicing` que lista `sdd capability index`, y un delta sin subsección `invoicing`, marca Important `unrequested` «invoicing cambia sin delta: la respuesta de facturar»

### El eje Spec comprueba que cada decisión del dev-lead tiene una regla que la cubre entera

- GIVEN «Decisiones tomadas con el dev-lead» con «artifacts cubre el visual companion entero», y un diff cuya regla solo cubre pantallas
- WHEN revisa el eje Spec
- THEN marca Important «decisión del dev-lead cubierta a medias: el visual companion — la regla cubre pantallas, no flujos ni diagramas»

### La revisión final comprueba la Confirmación de las ADR que cubren el diff

- GIVEN `0013-fork-keeps-source-text.md` (`accepted`, `rutas: skills/**`) con una `### Confirmación` que pide marcar como Important cada pieza de la fuente quitada sin motivo ni A/B, y un diff que quita de `skills/sdd-verify/SKILL.md` la tabla «Rationalization Prevention» de la fuente sin fila en el anexo
- WHEN el hilo despacha el eje Spec
- THEN su encargo lleva la lista que imprime `sdd decision index --files <ficheros del diff>`, con la 0013
- AND el eje Spec marca Important «ADR 0013, Confirmación: pieza de la fuente quitada sin motivo ni A/B — Rationalization Prevention»
- AND una ADR `proposed` de la lista sale solo como aviso («ADR propuesta, no se exige: 0016»), y entre dos ADR `accepted` que se contradicen manda la más reciente

### Una comprobación no verificada no cuenta como limpia

- GIVEN un eje Spec que no puede comprobar la verificación de un THEN porque «Dónde se prueba» nombra `test/e2e/booking.spec.ts` y el paquete no trae ese fichero
- WHEN informa
- THEN escribe esa comprobación como «no verificado: el paquete no trae `test/e2e/booking.spec.ts`», y no la cuenta como superada
- AND el hilo escribe `Revisión final: Spec opus+high, limpia, 1 sin verificar · …`, y antes de la validación la verifica él mismo o la adjudica con `Final: Ruling:`

### El eje Código revisa con los cinco libros, bajo el estándar del proyecto

- GIVEN el bloque «De código» del proyecto con «funciones ≤ 30 líneas», y un diff con una función de 26 líneas y el comentario `// incrementa i` sobre `i++`
- WHEN revisa el eje Código
- THEN marca Important el comentario que repite el código
- AND no marca la función de 26 líneas, aunque el «Quick Diagnostic» de *Clean Code* pregunte «Are all functions under 20 lines?»: manda el estándar del proyecto
- AND cada hallazgo que sale de una tabla «Quick Diagnostic» se escribe como juicio («posible Feature Envy»), no como infracción

### La revisión se cierra una vez

- GIVEN la revisión final sobre `a1b2c3d`, con 1 Important del eje Código y 1 Minor del eje Spec
- WHEN el hilo la procesa, con cualquier método
- THEN el Important entra en una sola pasada de fix (en Native, el hilo con TDD; en SDD, un subagente con todos los hallazgos de todos los ejes), y el Minor, sin `review.minors` en `sdd-kit.json` o con `defer`, va al ledger como `Final: minor (deferred): <una línea>`
- AND con `"review": {"minors": "fix"}` en `sdd-kit.json`, el Minor entra en esa misma pasada sin preguntar, y el ledger lo apunta como `Final: fixed <hallazgo> — <test> RED→GREEN, suite <N>/<N>` (si ningún test lo reproduce, `Final: fixed <hallazgo> — suite <N>/<N>`), nunca como `minor (deferred)`
- AND justo antes de presentar la validación (con `validation.mode: field`, antes de pasar al cierre), despacha una sola re-revisión con `sdd-kit:effort-high` + `opus`, con la cabecera de `encargo-revision.md` y `re-review-prompt.md`, los hallazgos abiertos de todos los ejes y el «What to Check» de los ejes que salieron, sobre el paquete `sdd review package <plan> a1b2c3d HEAD`; apunta `Re-revisión: a1b2c3d..<head>, sdd-kit:effort-high + opus, <veredicto>`
- AND en SDD la fix wave no lleva otra re-revisión: es esta
- AND un Important que la re-revisión deja abierto, el hilo lo adjudica con `Final: Ruling:` y llega a ✋ en la presentación y en el walkthrough, sin otra pasada de fix ni otra re-revisión
- AND si desde `a1b2c3d` solo hay commits que se revisan en el hilo, no despacha re-revisión

### Un Critical que deja la re-revisión no se adjudica

- GIVEN un proyecto con `validation.mode: field` y una re-revisión que vuelve con 1 Critical abierto: «`cancelar` sin `--motivo` borra la reserva»
- WHEN el hilo procesa la re-revisión
- THEN no lo adjudica con un ruling: escribe el test que lo reproduce, lo ve fallar, lo arregla, corre la suite y lleva a ✋ `sin revisar: <sha> — arregla el Critical «cancelar sin --motivo borra la reserva»`
- AND no despacha otra re-revisión
- AND si arreglarlo cambia la spec, para como un desvío (en `unattended`, la opción más conservadora y aparca si bloquea)

### Una re-revisión nunca abre otra

- GIVEN `Re-revisión: a1b2c3d..c7d8e9f, sdd-kit:effort-high + opus, limpia` en `tasks.md`, y después un commit `f0a1b2c` que cambia `src/cancel.js`
- WHEN el hilo va a cerrar, en cualquier perfil y con cualquier `validation.mode`
- THEN no despacha revisor, y la presentación (o el mensaje con el que pasa al cierre, en campo) y el walkthrough llevan en ✋ `sin revisar: f0a1b2c — <qué cambia>`
- AND si el commit es documentación de menos de 20 líneas, lo anota como `revisado en el hilo: <sha> · <ficheros> · <n> líneas`
- AND si la revisión final volvió limpia y no hubo re-revisión, ese commit abre la única, sobre `a1b2c3d..HEAD`
- AND mientras quede un `sin revisar` o un «no verificado» sin resolver, ni la línea `Validación en campo:` ni el walkthrough dicen que la revisión quedó limpia: dicen cuántos quedan («…, 1 sin revisar»)

### `tasks.md` registra cada eje

- GIVEN la revisión final de una feature con los ejes Spec y Código, y el plan con `Eje Arquitectura: no`
- WHEN vuelve
- THEN `tasks.md` lleva `Revisión final: Spec opus+high, limpia · Código sonnet+high, 1 Important · Arquitectura no (plan), sobre a1b2c3d`
- AND como mucho una línea `Re-revisión:`
- AND sin `tasks.md`, la misma línea va en la presentación de la validación

### El revisor final revisa el paquete sin ejecutar la suite

- GIVEN el despacho de los ejes con el paquete de review de la rama
- WHEN cada eje revisa
- THEN lee el paquete y no ejecuta la suite, el build ni el lint del proyecto
- AND si cree que hace falta una verificación pesada, la recomienda en su informe

### El revisor final sale en segundo plano con el commit de la última task

- GIVEN una feature Native con una task que cambia la UI, cuyo commit `a1b2c3d` acaba de hacerse, y su «Verificación visual» pendiente
- WHEN el hilo cierra esa task
- THEN el siguiente despacho son los ejes en segundo plano sobre `a1b2c3d`, antes de arrancar la aplicación para la verificación visual
- AND mientras los ejes trabajan, el hilo hace la verificación visual y escribe los borradores de cierre: `walkthrough.md` sin la verificación ni el tiempo, el delta fusionado en `capabilities/` y la entrada del changelog, todos sin commitear
- AND la validación se presenta cuando el cierre de la revisión ha terminado (la pasada de fix y la re-revisión, si las hay), con lo residual en ✋, no antes
- AND en SDD el disparador es el commit juntado de la última task, tras su revisión limpia

### El revisor final trabaja aislado en el sha que revisa

- GIVEN los ejes despachados sobre `a1b2c3d`, y el hilo que commitea después `e4f5a6b` (un fix de la verificación visual)
- WHEN los ejes leen el código y el historial
- THEN trabajan en un worktree desanclado `review-0096-a1b2c3d`, creado con `git worktree add --detach` en `a1b2c3d`, con el paquete construido allí, y su encargo les dice que no miren ramas ni commits posteriores
- AND ningún informe cita `e4f5a6b`
- AND la re-revisión se ancla igual, en el último sha de su tramo
- AND el hilo retira el worktree con `git worktree remove` cuando han vuelto todos los ejes

### El paquete del revisor final sale del merge-base actual y sin evidencia

- GIVEN una feature lite, sin `plan.md`, que tras su primer commit integró `develop` con un merge que trae los commits de otra feature (`skills/otra/SKILL.md`), y con `.docs/sdd/specs/<carpeta>/red/out.jsonl` en su rama
- WHEN el hilo prepara el paquete del revisor final
- THEN la sección de diff del paquete no contiene `skills/otra/SKILL.md` ni ningún fichero bajo `red/` o `green/`
- AND la sección de commits lista solo los de la feature y el merge
- AND el paquete se genera a la primera, con `spec.md` como plan

### El paquete del revisor final deja fuera los borrados y la carpeta de la feature

- GIVEN una rama que borra `docs/legacy-visual-spec.md` (500 líneas) y cinco fixtures, y trae `spec.md` y `plan.md` en su carpeta de `.docs/sdd/specs/`
- WHEN el hilo prepara el paquete del revisor final
- THEN el paquete no contiene el cuerpo de los ficheros borrados ni ningún fichero de la carpeta de la feature
- AND lista los borrados por nombre en su sección «Ficheros borrados»
- AND cada eje lo lee en tramos de 400 líneas con `offset` y `limit`, y ningún `Read` devuelve `exceeds maximum allowed tokens (25000)`

### El plan escribe la revisión final con sus ejes

- GIVEN una spec aprobada en `delegate` y un plan Native de una sola task pequeña
- WHEN el agente escribe `plan.md`
- THEN la revisión final aparece con sus ejes —Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet` y Arquitectura según `Eje Arquitectura:`—, o no aparece
- AND la cabecera del plan lleva `Eje Arquitectura: sí — <frontera>` o `no — <motivo>`

### El cierre no repite la revisión final

- GIVEN una feature cuya línea `Revisión final:` de `tasks.md` registra la revisión `sobre a1b2c3d`, y después de ese commit solo hay commits que se revisan en el hilo
- WHEN se entra en `sdd-archive`
- THEN no lanza otra revisión: comprueba que hubo revisión final y con qué ejes y modelos
- AND si después del último revisado hay un commit `e4f5a6b` que cambia `src/slots.js` y `tasks.md` no tiene `Re-revisión:`, antes de escribir el walkthrough despacha la única re-revisión del tramo `<último revisado>..HEAD` (`sdd-kit:effort-high` + `opus`) y apunta `Re-revisión: <último revisado>..e4f5a6b, sdd-kit:effort-high + opus, <veredicto>`
- AND si `tasks.md` ya tiene `Re-revisión:`, no despacha: el walkthrough lleva `sin revisar: e4f5a6b — <qué cambia>` en ✋
- AND el último revisado es el segundo sha de la `Re-revisión:`; si no hay, el `sobre` de `Revisión final:`; y si la línea dice «juntada en el cierre», el commit de cierre
- AND una línea en el formato 2.x (`Revisión final: sdd-kit:effort-high + opus, limpia, sobre a1b2c3d`, sin ejes) cuenta como revisión final, y el tramo de la única re-revisión empieza en su `sobre`, con la pasada de fix dentro, como en el cierre único
- AND solo sin la línea `Revisión final:` (ni, sin `tasks.md`, el informe de los ejes en esta sesión) invoca `sdd-verify` para la revisión final

### El eje Código marca los E2E que no siguen la política del proyecto

- GIVEN `operations.md` §Testing con tres flujos core (`0012-sum-row`, `0015-export-pdf` y `0018-invoice-status`), `Timeouts: por defecto` y `Retries: 0` en local
- AND un diff que añade `e2e/0024-remember-filter.spec.ts`, con un test que elige «cobrada» en «Estado», espera con `expect.poll(() => savedStatus(request))` y después sale de la pantalla, y otro que cuenta las cuatro opciones del desplegable, y sube `playwright.config.ts` a `timeout: 90_000` y `expect: { timeout: 20_000 }` sin motivo
- WHEN revisa el eje Código
- THEN marca Important que los dos tests no nombran ninguno de los flujos core
- AND marca Important los dos timeouts subidos sin motivo escrito en `operations.md`
- AND marca Important la espera a `savedStatus` entre elegir el estado y salir de la pantalla, sin motivo en un comentario
- AND con `sin E2E declarados` en el encargo no marca ninguno de los tres

### La línea `Gate:` nombra cada tarea, corrida o saltada

- GIVEN un cambio en carril config que edita la definición de `app:test` en `moon.yml`, con el gate `moon run app:test api:test --affected --base develop`, que sale con 0 y `Tasks: 0 completed, 2 skipped`
- WHEN el agente va a declarar el gate y commitear
- THEN corre `moon run app:test` sin `--affected`, porque cambia su definición, antes de commitear
- AND la línea del commit es `` Gate: `moon run app:test api:test --affected --base develop` → app:test: corrió 98/98 (sin filtro: cambia su definición) · api:test: saltada (ningún fichero cambiado casa con sus inputs: `moon task api:test`) ``
- AND nunca escribe `→ verde` ni da el gate por bueno solo por su código de salida
- AND la misma forma, una entrada por tarea del gate, vale en el 4.1 del walkthrough, en el §4 de `patch.md` y en el informe de la baseline de `sdd-worktrees`
- AND las órdenes que corrieron (las suites unitarias y el gate) van antes de la flecha, cada una entre backticks y separadas por ` · `
- AND una tarea que corre sin filtro porque la rama o la base tocan un fichero de «Sin filtro» de `operations.md` lleva `(sin filtro: cambia el build)`; una que no corrió en la pasada roja, `(no corrió en la pasada roja)`; tras una pasada roja, la línea empieza por `tras el rojo en <sha>, arreglo <sha>:`, y con un arreglo solo de docs, por `tras el rojo en <sha>, arreglo <sha> solo de docs:`

## Reglas de la capacidad

- **Dónde viven los datos**: las líneas `Revisión final:`, `Pasada de fix:` y `Re-revisión:` en `tasks.md` (sin él, en la presentación de la validación); los hallazgos, rulings y minors en el ledger del workspace del plan (en lite, el de `spec.md`), hasta que «Finish» los cosecha.
- **Idioma de los nombres**: los encargos de los ejes en inglés, como sus fuentes; los nombres de skill y de fichero en inglés kebab-case.
- **Límites**:
  - dos o tres ejes por revisión final, dentro de `control.maxParallelAgents`;
  - una pasada de fix;
  - como mucho una re-revisión de la revisión final por feature;
  - cada eje lee el paquete en tramos de 400 líneas.
- **Avisos**:
  - un commit sin revisor, `sin revisar: <sha> — <qué cambia>` en ✋;
  - una comprobación que un eje no pudo hacer, `no verificado: <motivo>`;
  - una ADR propuesta, `ADR propuesta, no se exige: <número>`.
- **Regla ante conflicto**:
  - el bloque «De código» del proyecto manda sobre los «Quick Diagnostic»;
  - la spec manda sobre el plan;
  - entre dos ADR `accepted` que se contradicen, manda la más reciente;
  - un eje no reordena ni anula los hallazgos de otro.
  - En las demás capacidades, «el revisor final» es cada eje de la revisión final, y «la revisión final limpia» es su cierre terminado, sin Critical abiertos ni Important sin adjudicar.
