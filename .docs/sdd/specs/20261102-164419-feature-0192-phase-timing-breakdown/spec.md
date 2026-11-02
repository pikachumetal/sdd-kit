---
id: 20261102-164419-feature-0192-phase-timing-breakdown
feature: 0192
title: Desglose de tiempos por fase — agente, ejecución, espera y % de ceremonia
mode: full
profile: delegate
status: approved
created: 2026-11-02
author: Claude (Opus 5.5)
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-02
---

# Spec — Desglose de tiempos por fase

🦆 Hoy el cierre de una tarea dice «1,40 h de esfuerzo» y nada más. Con esta feature, ese mismo cierre deja un `timing.json` y el log enseña dónde se fue el tiempo: en la 0271, por ejemplo, la implementación se llevó 0,67 h, 0,60 de ellas en ejecución, y la revisión 0,40 h, 0,36 en ejecución. Las fronteras salen solas de lo que el kit ya hace (qué skill se invocó, `sdd task start`), así que nadie marca nada a mano, y una fase sin eventos dice «sin eventos» en vez de una cifra. Esta feature solo mide: recortar lo que señale va en su propia fila.

Validación: agente — `validation.mode: field` en `sdd-kit.json`: lo que se usa es un fichero y una tabla generados, que se comprueban ejecutándolos sobre una feature real.

## Capacidades

- Modificadas: `estimation` — el cierre guarda el desglose por fase de la sesión y el log lo suma, con el % de ceremonia y cada fase frente a su estimado.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec: un revisor con los siete puntos, Sonnet effort medium, decidida por mí (perfil `delegate`: método) — señales: contrato público (`timing.json`, que leerán la 0195 y la 0196) y datos (fichero persistente nuevo) · tamaño: ~450 líneas en ~14 ficheros. La rúbrica daría dos revisores: bajo a uno para no paralelizar sin tu confirmación.
- Dominio: si «ceremonia» (decisión 4) y el reparto del tiempo de una fase sin eventos (decisión 3) miden lo que el Intent promete (señal: dato nuevo).
- Técnica: si el esquema de `timing.json` aguanta a la 0195 y la 0196 y si el fixture público queda limpio (señal: contrato público + datos).
- Mínimo razonable: un revisor — deja sin una segunda lectura independiente el contrato de `timing.json`, que se corrige barato antes de la 0195.

1. **Cuatro fases, y las tasks dentro de la implementación.** `apertura`, `implementacion` (con `tasks[]` si hay eventos), `revision` y `cierre`. Son cuatro porque cada una tiene un evento que la abre; la spec y el plan van juntos en `apertura` porque ningún evento del kit los separa y el plan ya los estima juntos («Esfuerzo spec + plan»). Medido en la 0287 y la 0271: la 0287 no invocó `sdd task start`, así que una fase obligatoria por task no existiría; por eso las tasks son detalle, no fases.
2. **Qué abre cada fase** (gana el evento más temprano): `apertura`, la primera entrada de la sesión. `implementacion`, la invocación de `sdd-implement`, el commit de apertura (el primero de la rama sobre `merge.into`) o el primer `sdd task start`. Las fases no retroceden: `cierre` abre con la primera invocación de `sdd-archive` o de `sdd-retro`, o con el commit de cierre (el último no-merge de la rama, solo con la rama ya fusionada, porque antes aún no existe); `revision`, con la última invocación de `sdd-verify` anterior a `cierre` sin ningún `sdd task start` detrás. Un `sdd-verify` posterior a `cierre` no reabre nada, y el `sdd-verify` que cierra la última task abre `revision` si no hay otro después. **Lo que cubre el fichero**: el cierre lo escribe una vez, en el paso de tiempo real, antes del commit de cierre; así que `cierre` llega hasta ese momento, como el `Esfuerzo real` que se pega en ese mismo paso, y el merge y el ticket no cuentan. El commit de cierre solo entra si alguien lo regenera a mano tras fusionar. Una task va de su `sdd task start` al siguiente `sdd task start` o al inicio de `revision`; `sdd task done` marca `done: true`, sin cortar: el commit de la task y su registro son de esa task. Sin eventos de task y con tantos commits entre apertura y cierre como tasks tiene el plan, cada commit cierra una task (lo dice `source: "commits"`); si no coinciden, no hay `tasks[]`.
3. **Fase sin eventos**: `measured: false`, tiempos `null` y `reason: "sin eventos: su tiempo queda en <fase anterior>"`. El tiempo no se pierde ni se reparte: se queda en la fase anterior, para que la suma cuadre; como eso sesgaría el % de ceremonia, una tarea con una fase de ceremonia sin medir sale de esa línea (decisión 12). Es tu «una tarea sin eventos de una fase» y lo leo como **«no inventa cifra»**: tu frase decía «inventar cifra», sin el «no»; si querías otra cosa, dilo. Medido: la 0271 no invocó `sdd-archive` (entró por `sdd-retro`), y por eso el `cierre` también abre con `sdd-retro`.
4. **Ceremonia = `apertura`, `revision` y `cierre`**; `implementacion` no. Nadie lo había definido. El % es de trabajo (agente + ejecución), sin esperas: lo que tarda el dev-lead en contestar no es ceremonia del kit. Es la decisión que más mueve el número: el gate cuenta en la fase donde corre, así que el del cierre es ceremonia y una línea base de `sdd-worktrees` cuenta como implementación, porque va tras `sdd-implement`; la columna `Gate (h)` lo deja ver aparte. El desglose guarda los segundos crudos, así que cambiar la definición no pide volver a medir.
5. **Agente, ejecución y espera, sobre los intervalos entre entradas del transcript, con las reglas de `clock.ts`**: espera, lo que el reloj ya cuenta como espera. Ejecución, con una herramienta en curso (un subagente en primer plano incluido) o con el turno cerrado hasta una notificación de tarea en segundo plano. Hueco, lo que el reloj ya descuenta (0211, sin rehacer). Agente, el resto. Un solo clasificador: `clock.ts` calcula de ahí sus totales, y sus tests actuales son la guarda de que el reloj no cambia. Prototipado sobre dos transcripts reales: 0287 reloj 1,31 h = 0,22 agente + 0,34 ejecución + 0,75 espera; 0271 reloj 2,36 h = 0,27 + 1,13 + 0,96, y agente + ejecución da el `Esfuerzo real` medido (0,56 h y 1,40 h).
   - Límites que quedan, sin arreglar aquí: un permiso pendiente cuenta como ejecución; y en la 0287 la revisión en segundo plano siguió tras invocar `sdd-archive`, así que esos minutos salen en `cierre`. Se dicen en el método, en `estimation.md`.
6. **Los tres tiempos suman el reloj menos los huecos**, porque el hueco de la 0211 no es ni trabajo ni espera y va en su propio campo. **Margen**: `|agente + ejecución + espera + hueco − reloj| ≤ máx(60 s, 1 % del reloj)`. Sobre una rama normal la diferencia es de redondeo; el margen cubre la medición por ventana, donde el reloj es de pared y dos transcripts pueden solaparse. Fuera del margen, el fichero se escribe igual con `withinMargin: false` y la CLI avisa por stderr, sin cambiar el código de salida.
7. **Sin verbo nuevo: `sdd session tokens --artifact <carpeta>`** escribe `<carpeta>/timing.json`. El cierre ya ejecuta ese comando, así que no gana paso; la 0192 se añade a un paso cargado (tu decisión), y un verbo aparte pedía otra línea. Sin la opción no escribe nada, y `capabilities/cli.md` no cambia su lista de verbos. Sin transcripts escribe `{ "version": 1, "measured": false, "reason": … }`.
8. **Forma de `timing.json`**, en segundos enteros: `{ version: 1, branch, measured, clockSeconds, withinMargin, totals: { agentSeconds, execSeconds, waitSeconds, idleSeconds, gateSeconds }, gateCommand, phases: [{ name, ceremony, measured, reason?, agentSeconds, execSeconds, waitSeconds, idleSeconds, gateSeconds, estimateHours, tasks?: [{ task, source, done, agentSeconds, execSeconds, waitSeconds }] }] }`. Sin marca de tiempo de generación: regenerar sin cambios no ensucia el diff.
9. **Atribución del gate**: `gateCommand` es el literal del «Gate de cierre» de `operations.md` §Testing y, sin él, de `tech-stack.md` §Testing, con la forma `- **Gate de cierre**: `<comando>``. Una llamada es del gate si alguno de sus segmentos (separados por `&&`, `;` o `|`) empieza por la primera palabra del literal y contiene todas sus palabras, quitadas las opciones y sus valores (`moon`, `run`, `kit:test-headless`, `cli:typecheck`, `cli:test`; `--base develop` no cuenta), así que un `echo` que las cite no es el gate; su ejecución suma en `gateSeconds` de su fase, **dentro** de `execSeconds`, no aparte. Una pasada parcial (`moon run cli:test`) o un `vitest` de task no son el gate: cuentan solo como ejecución. Sin gate declarado, `gateCommand: null` y `gateSeconds: null`.
10. **Estimado de cada fase**, leído del `plan.md` de la carpeta al escribir el fichero, de donde también sale cuántas tasks hay (sus encabezados `### Task`, para `source: "commits"`): `apertura` de «Esfuerzo spec + plan»; `implementacion` de «Estimación de implementación»; en lite, sin plan, las dos del `spec.md` («Esfuerzo spec» y «Estimación de implementación»); `revision` y `cierre` de dos líneas nuevas de `plan-template.md`, `- Estimación de revisión: <Zh>` y `- Estimación de cierre: <Zh>`. Sin la línea, `estimateHours: null`; un lite no estima revisión ni cierre, y un patch queda sin estimado por fase: el suyo es del total. Es lo que pides con «cada fase se compara con su estimado»: sin las dos líneas, media tabla saldría vacía.
11. **La tabla principal del log y su ratio no cambian.** Aquí te rebato el ticket de la 0188 §4, que pedía que el ratio de la fila sume spec + plan: cambiarlo rompería la serie de calibración con ~250 filas de otra población, y el p80 se usa para comprometer fechas. El estimado frente al real va por fase, en la tabla nueva, y la fila sigue como está.
12. **Tabla nueva del log**, sección `## Tiempos por fase`, con las carpetas que tienen `timing.json` medido: `| Fase | n | Agente (h) | Ejecución (h) | Espera (h) | Gate (h) | % del trabajo | Ceremonia | Est (h) | Real (h) | Ratio |`, al final del log, tras la calibración, y debajo `Ceremonia: <X> % del trabajo (<n> tareas, <m> fuera por una fase sin eventos).`. En el log las fases llevan tilde (`implementación`, `revisión`). Las fases «sin eventos» no suman en esa fila ni en su `n`. `Ratio` es la suma de reales entre la suma de estimados de las filas con estimado (agente + ejecución), `—` si ninguna lo tiene. Sin ningún `timing.json`: `Sin datos: ninguna tarea tiene timing.json.`. Una tarea con `withinMargin: false` no entra, y el log avisa por stderr con su carpeta. Las tareas ya cerradas no se recalculan.
13. **Causa de la desviación (ticket de la 0211 §4), condicionada al RED**: la propuesta del ticket no está medida, así que es el frente condicionado de la spec. Si el RED la exhibe, `session tokens` imprime, la última y también tras `Medición`, una línea `- Esperas y huecos: 14:59Z 45 min; …`, solo si hay alguno, y nunca con «no medido» ni en `--json`, y el paso 2 de `sdd-archive` y §2 del walkthrough piden citarla o escribir «sin medir». Si sale limpio con n = 3, el frente sale entero, línea incluida, sin parar, y la fila de deuda se queda como está.
14. **Fixture**: `cli/test/session/fixtures/feature-0271/`, reducido del transcript real de la 0271 (2,36 h, con tasks, revisión y `sdd-retro`). Se conservan solo `type`, `timestamp`, `gitBranch`, `isMeta`, `isCompactSummary`, `message.stop_reason`, los `id`, `tool_use_id` y `name` de los bloques, `input.skill` y, en los comandos, solo las palabras del kit y del gate; el texto tecleado se sustituye por `…` manteniendo los prefijos del harness. Pasa por `extract.mjs clean`, y un test falla si el fixture contiene una ruta `Users` o `/home/` o algo con forma de email: patrones fijos, porque buscar el `user.name` de la máquina que corre la suite no comprueba nada en CI. El script que lo reduce no se versiona: el fixture no se regenera.
15. **Saldo de palabras**: se cuenta contra el tope nominal de `word-budget.test.ts`, sin el margen del 25 %, en la tabla de abajo. `sdd-archive` y `sdd-templates` ya están por encima de su nominal (por la 0279 y anteriores, dentro del margen). Tu regla la leo como saldo ≤ 0 de esta feature, no como obligación de bajar hasta el nominal: eso sería otra feature. El walkthrough da la cifra antes y después.
16. **Una pieza entra, otra sale (Art. I)**: en `sdd-archive` paso 2 salen «`Esfuerzo real` counts from the start of the session that opened the work, without waits» y «outside Claude Code the lines say «no medido»», que ya dice §2 del walkthrough (−22 palabras), para `--artifact <carpeta>`, «`timing.json` goes in the closing commit» y, con el frente condicionado, la cita de la causa (+16 como mucho). En `walkthrough-template.md` salen «(la línea abre con el total sumado: el log lee esa primera cifra, no la lista)» y «(«sin precio» si falta la tabla…: el script no inventa precios)», porque esas líneas las imprime la CLI y se pegan (−35), para las dos líneas de `plan-template.md` (+10) y la cita (+12 como mucho). Son texto de plantilla sobre una línea pegada: no quitan una instrucción que el agente ejecute. `sdd session tokens` no retira líneas.
17. **`estimation.md`** gana un párrafo con qué es cada fase y sus límites (decisión 5), y `architecture.md`, una fila de `timing.json` en la tabla de documentos, recortando lo equivalente en ese fichero. `plan-template.md` no pide nada al que migra: un plan viejo da `estimateHours: null`. `skills/sdd-upgrade/references/migrations/v3.0.0.md` no cambia.
18. **La deuda del patch 0245** («`Esfuerzo real` de un trabajo abierto a mitad de sesión», sin `--since`) sigue en **Esperar 2.º ticket**: la fila dice que la 0192 es su sitio cuando llegue, y no ha llegado. Las fases no la arreglan: el total sigue contando lo anterior a abrir el trabajo, dentro de `apertura`.
19. **Se prevén 3 tasks**, sin partir: T1 el reloj por fases, `--artifact` y el fixture; T2 la tabla del log; T3 skills y plantillas con su RED/GREEN, cuyo RED del frente condicionado corre antes de T1 porque decide si existe la línea de la decisión 13.

- Política de modelos: revisor de la spec Sonnet effort medium, uno · ejes de la revisión final: Spec opus+high, Código sonnet+high · sujetos en Sonnet, por tandas · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — `revision` podía quedar tras `cierre` → decisión 2: las fases no retroceden.
- **Aceptado** — el commit de cierre no existe al escribir el fichero, y regenerarlo lo cambia → decisión 2 dice qué cubre `cierre`; el AND de «regenerar» incluye la rama.
- **Aceptado** — faltaban «Idioma de los nombres» y «Regla ante conflicto», y la precedencia del gate → añadidas; el log lleva tildes y el contrato no.
- **Aceptado en parte** — la línea `Esperas y huecos` como `MODIFIED` → fijo su orden, `--json` y «no medido», y quito la desviación del GIVEN; **rechazo el `MODIFIED`**: las cuatro líneas y la quinta siguen siendo ciertas, solo se añade una detrás.
- **Aceptado** — una fase de ceremonia sin medir sesga el % → esa tarea sale de la línea, y el escenario pasa de 11 % a 20 %; el gate cuenta donde corre.
- **Aceptado** — lite sin plan → estimado de `spec.md`; declarada la lectura de `### Task`.
- **Aceptado** — matcher del gate → segmentos, sin opciones ni sus valores; el parseo, al Scope.
- **Aceptado** — fixture con datos de la máquina y requisito que no es de la capacidad → patrones fijos, y sale del delta a «Dónde se prueba».
- **Aceptado** — la pieza que sale, la frase del commit en el saldo y los minutos → decisión 16 con cifras; Scope y previsión.
- **Aceptado** — valores de las columnas, sitio de la sección → en el escenario y la decisión 12. **Rechazado**: declarar `timing.json` de otro tipo: es parte del artefacto de cierre y lo acota su carpeta.
- Comprobado por mí, por lo que el revisor no leyó: `capabilities/cli.md` lista verbos, no opciones de `session tokens`; las líneas citadas salen de las búsquedas de esta sesión. El ejemplo de la 0287 del hallazgo 1 no es exacto (su `sdd-verify` va antes de `sdd-archive`), pero la regla hacía falta.

### Decisiones tomadas con el dev-lead

- El fixture no sale de `timing-report`, sino de transcripts reales de este repo, reducidos y sin datos personales — «no hace falta (dev-lead, 2026-11-01). El fixture sale de transcripts reales de este repo, reducidos y sin datos personales, porque el repo es público; pasa por `tests/headless/extract.mjs` o una comprobación equivalente antes de versionarlo.»
- El descuento de huecos no se rehace — «El descuento de los huecos sin eventos ya lo hizo el patch 0211: no se rehace.»
- Saldo de palabras — «el saldo de palabras de cada skill editada queda igual o baja, medido contra el tope nominal, y contado antes de presentar la spec.»
- RED limpio — «Un RED limpio de un frente con caso de campo se mide con n = 3, sin que la petición del molde traiga la orden. El frente se saca solo si la spec lo marcó condicionado; si no, es un desvío y paras.»
- Sin marcas a mano ni hook por herramienta; `sdd status --html` y el mod, en la 0195 y la 0196; recortar fases, fuera — del prompt de arranque.
- Perfil y merge — «Perfil delegate. Al fusionar, `sdd merge --push`.»

## Intent

El equipo sigue preocupado por la velocidad del kit y el cierre solo da un total por tarea: no se sabe qué fase se lleva el tiempo, y sin eso cada recorte de ceremonia es una opinión (Principio 5). Éxito: sobre el transcript de una feature real, la CLI escribe `timing.json` con cada fase y sus tres tiempos, que suman el total del reloj dentro del margen de la decisión 6; el log da la tabla de ceremonia por fase; y una tarea sin eventos de una fase no inventa cifra. Fracaso aunque funcione: que el cierre pese más para medirse, o que una cifra parezca medida cuando era un reparto.

## Scope

- Entra:
  - CLI `session` (`cli/src/session/clock.ts`, `measure.ts`, `verbs.ts`, un `phases.ts` nuevo): el clasificador único, las fases, el gate y `--artifact`.
  - CLI `estimation` (`cli/src/estimation/log.ts`, un `phases.ts` nuevo): la sección `## Tiempos por fase`.
  - Fixture y tests en `cli/test/session/` y `cli/test/estimation/`.
  - Lectura del «Gate de cierre» de `operations.md` y `tech-stack.md` (decisión 9).
  - `skills/sdd-archive/SKILL.md` paso 2: `--artifact` en el comando y `timing.json` en el commit de cierre, con saldo ≤ 0.
  - `skills/sdd-templates/templates/plan-template.md`: las dos líneas de estimación; `walkthrough-template.md`: los recortes de la decisión 16. Saldo ≤ 0 en la skill.
  - Docs: `.docs/sdd/estimation.md`, `architecture.md`, `capabilities/estimation.md` (fusión del delta), roadmap, changelog.
- Entra, si el RED lo exhibe:
  - La línea `Esperas y huecos`, la cita en `sdd-archive` paso 2 y en §2 de `walkthrough-template.md`, y saldar la fila de deuda de `roadmap.md` «Los diagnósticos de esperas…» (decisión 13).
- No entra:
  - `sdd status --html` y el mod con status line (0195, 0196).
  - Recortar fases: lo que señalen los datos va a su propia fila.
  - Un hook por llamada a herramienta, y marcas a mano.
  - Rehacer el descuento de huecos (0211).
  - Recalcular tareas ya cerradas, y cambiar la tabla principal del log (decisión 11).
  - `--since` (decisión 18).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Frase «`Esfuerzo real` counts from the start of the session…» | `skills/sdd-archive/SKILL.md:37`; la misma regla sigue en `walkthrough-template.md:26` y `.docs/sdd/estimation.md:21` | decisión 16: sale de la skill, se queda en la plantilla y el método |
| Comando del cierre: gana `--artifact <carpeta>` | `skills/sdd-archive/SKILL.md:37`; `capabilities/estimation.md`, «El cierre rellena los tokens…» | Scope y delta, `MODIFIED` |
| «Esfuerzo spec + plan» sigue igual; dos líneas nuevas debajo | `plan-template.md:179-180`; `spec-template.md:134` (lite) no cambia: lite no estima revisión ni cierre y da `estimateHours: null` | decisión 10 |
| `clock.ts` calcula sus totales desde el clasificador | `cli/src/session/clock.ts`; sin cambio de salida, lo guardan `clock.test.ts` y `clock.slow.test.ts` | decisión 5 |

- Filas que implementa: 0192 → `roadmap.md:125` (se marca al cerrar), `:137` y `:138` (0195 y 0196 la citan como fuente: siguen válidas), `:135` y `:136` (la listan como previa: siguen válidas); deuda `roadmap.md:581` → decisión 13, solo si el RED lo exhibe; deuda `:640` → decisión 18, se queda.

## Approach

Lo decidido por el dev-lead, tal cual: las fronteras salen de los eventos del kit, sin marcas; por fase, agente, ejecución y espera con el reloj de `clock.ts`; el gate por el comando del «Gate de cierre»; el cierre guarda `timing.json` en la carpeta del artefacto; `estimation-log.md` lo suma con la tabla de ceremonia y cada fase frente a su estimado. El resto es de ✋.

## Dónde se prueba

- Fases, tres tiempos y margen sobre una feature real: Vitest en `cli/test/session/`, sobre el fixture de la 0271, y una ejecución real de `sdd session tokens --artifact` sobre el worktree de esta feature.
- Reglas de cada frontera, fase sin eventos, gate: Vitest con transcripts mínimos, como `clock.test.ts`.
- El reloj no cambia: `clock.test.ts` y `clock.slow.test.ts`, sin tocarlos.
- Tabla del log: Vitest en `cli/test/estimation/`, como `post-hoc.test.ts`.
- Fixture limpio (propiedad del repo, no de la capacidad: no va al delta): test en `cli/test/session/` con los patrones fijos de la decisión 14, y que el fixture da las cuatro fases con `withinMargin: true`.
- El cierre escribe el fichero: sujeto `f1`; la causa con evidencia: sujetos `c1`, en `tests/phase-timing-red.md` y `-green.md`. El escenario siembra el transcript con `seedTranscript`, porque sin él la CLI da 0,00 h (`tech-stack.md`, «Fixtures y baselines»).

## Términos y ADR

- Términos resueltos: fase — tramo de la sesión que abre un evento del kit · ceremonia — `apertura`, `revision` y `cierre` · ejecución — tiempo en que el agente está parado por una herramienta o una tarea en segundo plano
- ADR candidatas: ninguna (el esquema lleva `version` y la definición de ceremonia se recalcula sin volver a medir)

## Delta de comportamiento

### Capacidad: `estimation`

#### ADDED — El cierre guarda el desglose por fase de la sesión

- GIVEN el transcript de una feature con `sdd-propose` a las 13:48, el commit de apertura a las 14:54, `sdd-implement` a las 14:54, `sdd task start` de la task 1 a las 14:57, `sdd-verify` a las 15:35 y `sdd-retro` a las 15:59
- WHEN se ejecuta `sdd session tokens --path <worktree> --branch <rama> --artifact <carpeta>`
- THEN `<carpeta>/timing.json` lleva `version: 1` y las fases `apertura`, `implementacion`, `revision` y `cierre`, en ese orden, cada una con `agentSeconds`, `execSeconds`, `waitSeconds`, `idleSeconds` y `ceremony` (`true` salvo en `implementacion`)
- AND `implementacion` lleva `tasks` con la task 1, `source: "events"`
- AND `|agente + ejecución + espera + hueco − reloj|`, sumado en todas las fases, es de 60 s o menos, o del 1 % del reloj si es mayor, y `withinMargin` es `true`
- AND agente + ejecución de todas las fases da el `Esfuerzo real` de la cuarta línea, con la misma salida en las cuatro líneas que sin `--artifact`
- AND fuera del margen, el fichero lleva `withinMargin: false`, la CLI avisa por stderr con las dos cifras y sale con 0
- AND sin `--artifact` no escribe ningún fichero
- AND regenerarlo sin cambios en los transcripts ni en la rama deja el fichero idéntico
- AND las claves del fichero van en inglés y los nombres de fase, sin tilde: es un contrato que leen otros verbos

#### ADDED — Una fase sin eventos no da cifra

- GIVEN el transcript de una feature sin ninguna invocación de `sdd-archive` ni de `sdd-retro`, con la rama sin fusionar
- WHEN se ejecuta `sdd session tokens --artifact <carpeta>`
- THEN la fase `cierre` lleva `measured: false`, sus tiempos son `null` y `reason` es `sin eventos: su tiempo queda en revision`
- AND la suma sigue dentro del margen: ese tiempo está en `revision`
- AND un transcript sin `sdd task start` y con los commits de la rama distintos de las tasks del plan da `implementacion` sin `tasks`
- AND con tantos commits entre apertura y cierre como tasks tiene el plan, y sin `sdd task start`, `tasks` sale con `source: "commits"`
- AND sin transcripts, `timing.json` es `{ "version": 1, "measured": false, "reason": "sin transcripts de Claude Code para <ruta>" }`

#### ADDED — El gate se atribuye por el comando del «Gate de cierre»

- GIVEN un `tech-stack.md` con `- **Gate de cierre**: \`moon run kit:test-headless cli:typecheck cli:test --affected --base develop\``, y en la fase `cierre` una llamada `moon run kit:test-headless cli:typecheck cli:test --affected --base develop 2>&1 | tail -5` de 240 s y otra `npx vitest run test/session/` de 30 s
- WHEN se escribe `timing.json`
- THEN `cierre` lleva `gateSeconds: 240`, y `execSeconds` incluye los 270 s
- AND `gateCommand` es el literal del gate
- AND una llamada `moon run cli:test` no suma en `gateSeconds`
- AND sin «Gate de cierre» declarado, `gateCommand` y `gateSeconds` son `null`

#### ADDED — Cada fase lleva su estimado

- GIVEN un `plan.md` con `- Esfuerzo spec + plan: 0,5h`, `- Estimación de implementación: 1h`, `- Estimación de revisión: 0,25h` y `- Estimación de cierre: 0,25h`
- WHEN se escribe `timing.json` en su carpeta
- THEN `estimateHours` es 0.5, 1, 0.25 y 0.25 en las fases, por ese orden
- AND un `plan.md` sin las dos últimas líneas da `estimateHours: null` en `revision` y `cierre`
- AND una carpeta lite, sin `plan.md`, con `- Esfuerzo spec: 0,5h` y `- Estimación de implementación: 1h` en `spec.md`, da 0.5 y 1, y `null` en `revision` y `cierre`
- AND una carpeta sin `plan.md` ni esas líneas da `estimateHours: null` en todas

#### ADDED — El log suma los tiempos por fase y el % de ceremonia

- GIVEN dos carpetas con `timing.json` medido: la A con `apertura` 600 s de agente y 300 de ejecución, estimado 0,5 h, e `implementacion` 900 de agente y 2.700 de ejecución, estimado 1 h; la B igual en `implementacion` y con `apertura` `measured: false`
- WHEN se ejecuta `sdd estimation log`
- THEN el log lleva `## Tiempos por fase` con la cabecera `| Fase | n | Agente (h) | Ejecución (h) | Espera (h) | Gate (h) | % del trabajo | Ceremonia | Est (h) | Real (h) | Ratio |`
- AND la fila `apertura` tiene n 1, agente 0.17, ejecución 0.08, espera 0, gate 0, 11 % del trabajo, estimado 0.5, real 0.25 y ratio 0.5, con `sí` en Ceremonia
- AND la fila `implementación` tiene n 2, 89 % del trabajo, `no` en Ceremonia, estimado 2, real 2 y ratio 1
- AND bajo la tabla, `Ceremonia: 20 % del trabajo (1 tareas, 1 fuera por una fase sin eventos).`: solo cuenta la A, 900 s de 4.500 s de trabajo
- AND la tabla principal del log y su ratio son los mismos que sin `timing.json`
- AND una carpeta con `withinMargin: false` no entra, y el log avisa por stderr con su nombre
- AND sin ningún `timing.json` medido, la sección dice `Sin datos: ninguna tarea tiene timing.json.`

#### MODIFIED — El cierre rellena los tokens y el coste de la sesión (antes: "`sdd session tokens --path <worktree> --branch <rama>`, ejecutado desde el kit")

- GIVEN una feature o un patch en Claude Code que llega al paso de tiempo real de `sdd-archive`, en un proyecto con `.docs/sdd/estimation.md`
- WHEN se rellena la sección 2 del walkthrough o la §5 de `patch.md`
- THEN `Esfuerzo real` (en los dos) y `Tokens del hilo`, `Tokens de subagentes` y `Coste de la sesión` (en el walkthrough) son las líneas que imprimió `sdd session tokens --path <worktree> --branch <rama> --artifact <carpeta del artefacto>`, ejecutado desde el kit
- AND `timing.json` queda en la carpeta del artefacto, y entra en el commit de cierre
- AND en otro harness, las cuatro dicen «no medido», con el motivo, y el esfuerzo real se aproxima con las marcas de los commits y se dice

#### Reglas de la capacidad — estimation

- **Dónde viven los datos**: los bloques de tiempo de `walkthrough.md` (§2) y de `patch.md` (§5) de cada carpeta de artefactos, con la estimación previa del patch y su hora de inicio en §5, escritas antes del fix, y la marca `post hoc` si la estimación llega en el commit de cierre; el desglose por fase, en `timing.json` de cada carpeta de artefactos, y el estimado de cada fase, en su `plan.md`; el esfuerzo real y las esperas, de los transcripts de Claude Code; para una rama sin transcripts propios, de los transcripts de los demás worktrees del repo, entre la creación de la rama (su reflog) y su último merge en `merge.into`; el log, generado, en la carpeta de `estimation.md`.
- **Idioma de los nombres**: columnas, etiquetas y avisos del log en castellano, como las plantillas que lee; las claves de `timing.json` en inglés y sus nombres de fase sin tilde, como contrato que leen otros verbos.
- **Límites**: la ventana de una rama sin transcripts propios va de la primera entrada de su reflog hasta su último merge en `merge.into`, la creación de otra rama local sin transcripts propios o ahora, lo que llegue antes. Un hueco sin actividad pasa de 60 min. Las fases suman el reloj con un margen de 60 s o del 1 % del reloj, lo que sea mayor.
- **Avisos**: por stderr y sin cambiar el código de salida: un bloque de tiempo sin esfuerzo real legible (la fila se excluye), un log mantenido a mano que se sobrescribe, un documento presente en sus dos rutas, y un `timing.json` fuera del margen (al escribirlo y, con la tarea fuera de la tabla, al generar el log). La línea `- Medición: por ventana …` no es un aviso: es parte de la salida, por stdout.
- **Regla ante conflicto**: con un documento en su ruta 3.0.0 y en la 2.x a la vez (`steering/estimation.md` y `estimation.md`, `CHANGELOG.md` y `<docs>/changelog.md`), manda la 3.0.0 y el verbo avisa por stderr del otro. Las carpetas de artefactos (`changes/` y `specs/`) se leen las dos. El «Gate de cierre» de `operations.md` manda sobre el de `tech-stack.md`.

## Topes de palabras

Medido con el conteo de `word-budget.test.ts`, el 2026-11-02, contra el **tope nominal** (sin el margen del 25 %, que el test aplica hasta la limpieza de la v3).

| Fichero | Medido / tope nominal | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-archive` `SKILL.md` | 4846 / 3920 | −926 | sin cambio; saldo ≤ 0 |
| `sdd-archive`, skill entera | 9915 / 8000 | −1915 | sin cambio; saldo ≤ 0 |
| `sdd-templates`, skill entera | 16796 / 15720 | −1076 | sin cambio; saldo ≤ 0 |
| Kit entero | 102448 / 89328 | −13120 | sin cambio; saldo ≤ 0 |
| `architecture.md` | 2036 / 1900 | −136 | sin cambio; saldo ≤ 0 |

`estimation.md` no tiene tope. Con el margen del test, `sdd-archive` `SKILL.md` llega a 4900: le quedan 54 palabras, que esta feature no usa.

## Previsión de coste

Precio: 0,75 $ por sujeto de un turno (`estimation.md`, 0,6–0,9 $; `p2` de la 0188 midió 0,19 $ con un molde igual, así que es techo). Pasos que cambian y su escenario: `sdd-archive` paso 2, `--artifact` → `f1`; `sdd-archive` paso 2 y `walkthrough-template.md` §2, la causa → `c1`; `plan-template.md`, las dos líneas → estructural, sin sujetos: las lee la CLI y las fija un test de frase. `sdd-archive` tiene batería, con `tests/batteries/sdd-archive/`: el paso 2 entra por `f1`, su tramo. Reloj: ~35 min, con los sujetos en paralelo y por tandas.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED `c1`, n = 3 (frente con caso de campo); `f1` sin sujetos: hoy el fichero no existe, es RED leído | 3 | 2,25 |
| GREEN `c1` 3 y `f1` 1 | 4 | 3,00 |
| Una tanda de REFACTOR | 3 | 2,25 |
| Controles: ninguno; `f1` y `c1` comparten molde y no hay duda A/B | 0 | 0 |
| Medición tras la revisión final, solo si la pasada de fix toca la skill: `f1` | 1 | 0,75 |
| Suma | 11 | 8,25 |

## Enmiendas

- 2026-11-02 — sale el frente condicionado de la decisión 13: el requisito «La causa de una desviación cita las esperas medidas», la línea `Esperas y huecos` y la cita en `sdd-archive` y en el walkthrough; la fila de deuda se queda — RED de `tc1` limpio con n = 3 (`tests/phase-timing-red.md`) — aplica la decisión del dev-lead: «El frente se saca solo si la spec lo marcó condicionado» — Task 1

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-02 | aprobada (opción «Apruebo») |
