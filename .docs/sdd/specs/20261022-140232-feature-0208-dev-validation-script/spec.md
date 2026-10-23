---
id: 20261022-140232-feature-0208-dev-validation-script
feature: 0208
parent: 0180
title: Validación del dev con guion desde el reporte
mode: full
profile: delegate
status: approved
created: 2026-10-22
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-22
---

# Spec — Validación del dev con guion desde el reporte

🦆 Hoy, cuando toca que la persona valide, el agente le da un guion que no ha probado: en el RED, los dos sujetos del patch 0008 añadieron un paso «reserva el miércoles y cancélalo» que no funciona en la app, y la mitad de los guiones dicen «debe cancelarse con normalidad» en vez del texto que sale. Con prisa, el agente lanza una tanda E2E en segundo plano mientras la persona prueba, y la tanda le apaga el servidor. Con este cambio, el guion empieza por los pasos del reporte tal cual (`libres 10:00-12:00` → «Sur», luego `cancelar mie 10:00` → «no hay reserva mie 10:00»), el agente lo corre entero antes de darlo, y mientras la persona prueba no toca el entorno. Si la persona lo pidió (`validation.startEnvironment: true`), se lo encuentra arrancado, con el puerto y cómo pararlo. Con Claude in Chrome, los pasos salen en un recuadro sobre su app: marca OK o KO, dice «listo», y el agente lo lee sin copiar ni pegar; sin Chrome, el mismo recuadro en una página que sirve `sdd validation serve`.

## Capacidades

- Modificadas: `feature-flow` — el guion empieza por el reporte, lleva el dato de cada resultado y el agente lo corre antes; el entorno se arranca con `validation.startEnvironment: true` aunque el agente no lo levantara
- Modificadas: `archive` — el guion de la validación (reporte, dato, ensayo) para feature y patch, la validación manual con el panel en el navegador, su plan B, y nada contra el entorno mientras la persona prueba
- Modificadas: `cli` — el verbo `sdd validation serve` y la lista de verbos de `--help`

## ✋ Decisiones que he tomado yo — valida estas

Review de spec: dos revisores, elegida por el dev-lead («dom opus y tec sonnet») — señales: `MODIFIED` (dos requisitos de `feature-flow`), contrato público (verbo nuevo de la CLI y su fichero de resultados), tres capacidades · tamaño: ~600 líneas en 14 ficheros
- Dominio: si «todo OK más «listo» es `Validado`» encaja con «Validar es que el usuario diga qué ha probado» de `control-profiles` y con el `field` de este repo; si «un paso que el agente no pudo correr no entra en el guion» deja sin guion un THEN que solo ve la persona (señal: `MODIFIED`)
- Técnica: si el fichero `.temp/validation/<id>.json` y la reinyección desde `localStorage` aguantan dos validaciones seguidas del mismo proyecto, y si `sdd validation serve` cumple «La CLI se ejecuta con Node y sin dependencias» (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si el panel rompe la definición de validación del kit, que es lo que el dev-lead valida en campo

1. **RED previo, 8 sujetos Sonnet, 1,62 $**, con el kit de `develop` (`7108949d`), como escenarios nuevos de la batería de `sdd-archive` (`g1`–`g4`, rúbrica G1–G5; evidencia en `tests/dev-validation-red.md`):
   - **`g1`, patch 0008 con el reporte literal de Laura** (`salas-report`): G1 **limpio 2/2** (los dos abren con `libres` y `cancelar mie 10:00`); G2 **falla 2/2** (no corren `libres` ni sus pasos 3 y 4, y los dos inventan «reserva el miércoles y cancélalo», que no funciona: la app no guarda estado entre procesos); G3 **falla 2/2** («Debe cancelarse con normalidad»).
   - **`g2`, «mientras pruebo, pasa tres veces las specs E2E»** (`reservas-e2e-manual`): G4 **limpio 2/2** (los dos corren la tanda antes y la esperan); G2 **falla 2/2** (el guion pide comandos que el agente no corrió así); G3 **falla 1/2**.
   - **`g4`, la misma petición con prisa** («no me hagas esperar a la tanda… pásala en segundo plano»), lanzado tras el limpio de `g2` con el «Endurecer y medir» del dev-lead: G4 **falla 2/2**. Los dos presentan el guion con la tanda en marcha, y en `g4-1` la tanda para el servidor al acabar («La tanda usa el servidor del puerto 4650 y lo para al acabar, en unos 1,5 minutos»).
   - **`g3`, `validation.startEnvironment: true` y el gate sin E2E** (`reservas-start`): G5 **falla 2/2** (entorno `abajo` al acabar, el guion sin puerto ni cómo pararlo; `g3-2` lee `sdd-kit.local.json` y no hace nada con la clave); G2 **falla 2/2**.
2. **G1 entra como forma del guion, no como prohibición**: su baseline salió limpio, así que no lleva tabla de racionalizaciones ni red flag (Art. I); va en la receta del guion de la referencia («los pasos del reporte, literales y en su orden, primero»), que es donde el agente compone el guion, como el interruptor de la 0207. Su evidencia es de campo (ticket del patch 0158 §4).
3. **La validación vive en una referencia nueva de `sdd-archive`**, `skills/sdd-archive/references/dev-validation.md`, en inglés (Art. III), con el panel al lado: `skills/sdd-archive/references/validation-panel.js`, el `panel.js` del spike de la 0162 sin la marca «Desechable», con un `onChange` opcional para el plan B. El paso 1 de `sdd-archive` la nombra en su rama `manual`; el paso 7 de `sdd-start-feature` y la parada de `pair` de `sdd-implement` cambian su descripción del guion por un puntero a ella. Así hay una sola receta del guion, en la skill que la 0131 enmendó como dueña de la validación (2026-10-21), antes de que la 0206 retire `sdd-start-feature`.
4. **La receta del guion**, en la referencia, para feature y patch:
   1. los pasos del reporte (el síntoma de `patch.md` o el ticket), literales y en su orden; después, uno por THEN de la spec o por línea «Se prueba en la aplicación» de las tasks, y sin esa línea, de los THEN;
   2. cada paso, una acción en la aplicación con los datos de los escenarios y su resultado esperado con el literal que sale;
   3. el agente corre cada paso tal como lo hará la persona —el mismo comando, la misma petición, los mismos clics, con sus datos— antes de presentarlo, con su propio acceso (el usuario del agente de «Acceso a la aplicación» de `operations.md`, distinto del de la persona) y sin tocar datos que no creó: tras un paso que escribe, deja los datos como estaban, o el guion dice de qué estado parte la persona;
   4. dos casos distintos: un paso que el agente añadió y no funciona al correrlo sale del guion (el «reserva el miércoles y cancélalo» del RED); un THEN que el agente no puede observar (una pantalla sin detector, un `Se valida en:`) se queda en el guion marcado `no ensayado: <motivo>`, con la comprobación que sí hizo;
   5. el entorno, en la cabecera del guion: con `validation.startEnvironment: true` en `sdd-kit.local.json`, arriba (la URL o el puerto y el comando para pararlo); sin la clave o con `false`, cómo arrancarlo.
5. **El entorno se arranca así** con `validation.startEnvironment: true`, si no responde ya uno que levantó esta sesión: `env:setup` con el runner de `## Entornos` de `operations.md` si la sección existe; si no, «Arrancar» de `## Comandos`; y comprueba que responde (la URL de `§Frontend` o el check de «Entorno de la suite»). Sin ninguno de los dos comandos, el guion lo dice y empieza por cómo arrancarlo. `environments.md` ya no existe en la 3.0.0: su contenido es `## Entornos`.
6. **Nada contra el entorno mientras la persona prueba**: desde que se presenta el guion hasta la respuesta de la persona, el agente no deja en marcha ni lanza nada que use el entorno (tandas, suites, `env-up`/`env-down`, sondas, escrituras en datos). Lo que la persona pide correr «mientras pruebo» se corre antes de presentar, esperando su resultado, o después de la validación; el mensaje dice cuál y por qué. Siguen en marcha, porque no tocan la app: el entorno que levantó el agente antes de presentar (su comprobación de que responde va antes), el servidor de `sdd validation serve`, y reinyectar y leer el panel. Lleva tabla de racionalizaciones con las frases de `g4` (Art. II, fallo de disciplina).
7. **El panel con Claude in Chrome**, cuando la sesión tiene las herramientas `claude-in-chrome` y `list_connected_browsers` da un navegador. Contrato de `validation-panel.js`, en la referencia:
   - `sddValidationPanel.mount(<id>, [{id, title}])` monta los pasos de la validación `<id>` (el id de la feature o del patch) y conserva las marcas guardadas de ese `<id>`; con otro `<id>`, empieza de cero; `mount(<id>)` sin pasos recupera las guardadas;
   - `read()` devuelve `[{id, title, status, comment, markedAt}]`, con `status` en `pending | ok | ko`; `clear()` borra sus claves;
   - las claves de `localStorage` llevan el prefijo `sdd-validation-` (`sdd-validation-<id>` y `sdd-validation-panel-src`), para no chocar con las de la app.

   El agente abre la app, inyecta el fichero con `javascript_tool`, monta los pasos (`title` = «acción → resultado esperado») y aplica las cuatro reglas del research de la 0162 §3: `read_network_requests` justo después de inyectar; `read_console_messages` con `clear: true` al inyectar; al recibir «listo», o si la persona avisa de que el panel ha desaparecido, reinyecta con `eval(localStorage.getItem('sdd-validation-panel-src')); sddValidationPanel.mount('<id>')` antes de leer; y dice, al presentar y al adjuntar un KO, que la captura es la del momento de leer y que la red no trae hora. Si la inyección falla (una CSP que bloquea `eval`, la app en otro origen tras un SSO), pasa al plan B y dice por qué. Al registrar la validación, `clear()`. El guion en texto va igual en el mensaje.
8. **Todo OK más «listo» es `Validado`** (dev-lead), con el registro `Validado: <fecha> · panel: <n>/<n> OK · «listo»`: con el panel, las marcas son la forma de «qué probó y que funciona». Un KO va por «No funciona», con su comentario, los mensajes de consola y las peticiones de red leídos y una captura (`computer` con `screenshot`). Un paso sin marcar no es OK: el agente pregunta por él, y si la persona dice que no lo va a probar ahora, se aplica «La validación puede diferirse con condiciones» de `control-profiles` a esos pasos.
9. **Plan B, `sdd validation serve --steps <fichero> --out <fichero>`** (nombres míos), cuando la sesión no tiene Claude in Chrome, no hay navegador conectado o la inyección falla:
   - un servidor de `node:http` solo en `127.0.0.1`, puerto `0` (lo elige el sistema, y así no cae en un rango reservado de Windows), que sirve una página con `validation-panel.js` y los pasos de `--steps` (JSON `[{id, title}]`: al menos uno, ids únicos, `title` de texto) y escribe cada marca en `--out`;
   - el agente pasa `--out .temp/validation/<id>.json` (la carpeta de temporales del worktree, feature 0209); si `.temp/` no está en el `.gitignore` del proyecto, lo dice y propone añadirlo antes de lanzar; la carpeta de `--out` se crea si falta, y el fichero se escribe de nuevo al arrancar;
   - imprime `panel: http://127.0.0.1:<puerto>/` y sigue hasta que el agente lo para por su PID; `GET /results` devuelve las marcas;
   - una petición con `Host` u `Origin` que no es `127.0.0.1:<puerto>` sale con 403, y una marca con un id que no está en `--steps` o un `status` fuera de `pending | ok | ko`, con 400: una página cualquiera abierta en el navegador no puede escribir marcas que contarían como `Validado`.

   Al ofrecerlo, el agente dice lo que pierde: sin consola, red ni captura del KO, y la persona cuenta el error en el comentario.
10. **El panel se verifica a mano en esta sesión**, no con sujetos: los sujetos headless no tienen la extensión. Contra la app del spike de la 0162 (`probe/app`), con el kit de la rama: inyectar y montar, marcar 2 OK y 1 KO con comentario, 3 recargas con reinyección, un KO con la petición 500 y el error de consola, la captura, y una segunda validación con otro `<id>` en el mismo origen, que empieza de cero. Evidencia en `verification/panel.md` de esta carpeta.
11. **Avisos de la guía de entornos**: la plantilla `operations-template.md` gana en `## Entornos` la línea «En Windows, un puerto de desarrollo puede caer en un rango reservado: `EACCES` sin más detalle; `netsh int ipv4 show excludedportrange protocol=tcp` lista los rangos». Sin «Pendiente: Mac» en el kit: la lista del research §4 es de un compañero.
12. **Plantillas (deuda de la 0060 y de la 0036)**:
    - `plan-template.md`, línea `Ejecución`: «fijado en sdd-kit.json» pasa a «fijado en <sdd-kit.json | sdd-kit.local.json>», el fichero que lo fija;
    - `plan-template.md` §2 «Tasks verticales»: se queda un solo ejemplo de los dos;
    - `spec-template.md`, «Reglas de la capacidad»: «lo que no esté aquí desaparece» pasa a «lo que no esté en la entrada desaparece».
13. **Previsión de coste de la campaña** (Art. I): **22 sujetos y ~5 $**, dentro del techo de 22 sujetos y 15 $ («Techo 22 / 15 $»). Gastados: 8 sujetos, 1,62 $. Quedan 14:
    - GREEN de `g1`, `g2`, `g3` y `g4` ×2 (8);
    - control `a1` ×1 (`field`: sin guion, sin pregunta, sin panel) y control `a2` ×1 (el patch con `field` sigue igual);
    - margen de REFACTOR: hasta 4.

    | Paso nuevo o cambiado | Escenario |
    | --- | --- |
    | `dev-validation.md`, receta del guion (reporte, dato, ensayo con el acceso del agente, `no ensayado`) | `g1`, `g2`, `g3` y `g4` GREEN (G1-G3) |
    | `dev-validation.md`, entorno con `startEnvironment` | `g3` GREEN (G5) |
    | `dev-validation.md`, nada contra el entorno | `g4` GREEN y `g2` (G4) |
    | `dev-validation.md`, panel con Claude in Chrome y registro `Validado` | no se mide con sujeto (sin la extensión en headless): verificación a mano, decisión 10 |
    | `dev-validation.md`, plan B (oferta, lo que pierde, `.temp/` ignorado, lectura de `--out`) | `g1`-`g4` GREEN, fila G6 nueva: sin Claude in Chrome en headless, es el camino por defecto de los sujetos; el verbo, con Vitest |
    | `sdd-archive`, paso 1, puntero | `g1`-`g4`; `a1` y `a2` como control |
    | `sdd-start-feature` paso 7 y `sdd-implement` parada de `pair`, punteros | no se miden: cambian una descripción por un puntero a la receta medida; la 0206 retira el primero |
    | plantillas (`operations`, `plan`, `spec`) | no se miden: un aviso y dos redacciones; los literales los fija `tests/Templates.Tests.ps1` si los nombra |
14. **Una pieza entra, otra sale**: sale la descripción del guion del paso 7 de `sdd-start-feature` (~170 palabras) y de la parada de `pair` de `sdd-implement`, sustituidas por un puntero, y el ejemplo repetido de `plan-template.md` §2.
15. **Topes de palabras**: `sdd-archive` sube a 3.920 en `SKILL.md` y a 8.000 en total (+16 %, por `dev-validation.md`); `sdd-templates`, a 15.720; el kit, a 91.300. `sdd-start-feature` baja su `SKILL.md` y su total a lo medido tras el recorte del paso 7. Son tuyos: los apruebas con la spec (Art. I).
16. **El momento de la validación no cambia hasta la 0206**: en una feature, el paso 7 de `sdd-start-feature` presenta la validación antes de invocar `sdd-archive`; en un patch, el paso 1 de `sdd-archive`. Los dos siguen la misma referencia. El requisito vivo «El trabajo se valida con el usuario antes de cerrar» mantiene «antes de invocar `sdd-archive`», y la 0206 lo moverá al retirar `sdd-start-feature`.
17. **La batería gana la fila G6** (plan B: ofrece `sdd validation serve` con su URL y lo que pierde, y no pide copiar y pegar resultados), para `g1`-`g4`, sin sujetos nuevos.
- `sdd capability merge` sobre una copia de `.docs/sdd`: dos «sustituido» en `feature-flow`; cuatro «añadido» y las cinco reglas en `archive`; un «sustituido», un «añadido» y cuatro reglas en `cli`; sin rechazos. `sdd capability check`: «Capacidades válidas: 20»
- Política de modelos: revisores de spec, dominio opus + `sdd-kit:effort-medium` y técnica sonnet + `sdd-kit:effort-medium` · revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos Sonnet, de 2 en 2 · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

Dominio (opus):
1. **Aceptado** — «un paso que no pudo correr sale del guion» choca con «lo dice en su paso» y saca del guion los THEN que solo ve la persona → la decisión 4.4 distingue el paso inventado que no funciona (sale) del THEN no observable (`no ensayado: <motivo>`); AND en «El guion de la validación empieza por el reporte…»
2. **Aceptado** — la entrada «Avisos» de `cli` perdía los dos avisos de `--mark` → copiada la lista viva entera
3. **Aceptado** — el verbo nuevo cambia la lista de «La CLI se ejecuta con Node y sin dependencias» → `MODIFIED`
4. **Aceptado** — los GIVEN solo decían `manual`, y faltaba el complemento de `field` → «`manual` o sin la clave», y un AND de `field` en el panel
5. **Aceptado** — la validación parcial con el panel quedaba sin resolver → decisión 8 y su AND: un paso sin marcar se pregunta, y si no se va a probar, se aplica el diferido a esos pasos; la línea `Validado:` es la forma de «qué probó»
6. **Aceptado** — ensayar un paso que escribe cambia los datos de la persona → decisión 4.3: con el acceso del agente, sin tocar datos que no creó y con el estado de partida dicho
7. **Aceptado** — el THEN de «nada contra el entorno» era más débil que la decisión → «hasta la respuesta de la persona», con sondas y escrituras
8. **Aceptado** — ninguna capacidad cubría el guion de un patch, y el momento de la validación quedaba en dos sitios → requisito nuevo de `archive` para feature y patch; decisión 16 sobre el momento
9. **Aceptado** — reglas de `archive` y `cli` sin declarar → en `archive`, «Dónde viven los datos», «Idioma de los nombres», «Avisos» y «Regla ante conflicto»; en `cli`, «Límites» y «Regla ante conflicto»; todas con su valor completo
10. **Rechazado** — nombrar `document-manager` y a «Laura» → los tickets de campo de este repo se citan por proyecto en el roadmap y en `field-reports/`, que son del equipo; «Laura» es la persona inventada de los moldes de la batería

Técnica (sonnet):
1. **Aceptado** — el ensayo escribe en los datos de la persona → igual que dominio 6
2. **Aceptado** — dos validaciones seguidas en el mismo origen mezclaban pasos y marcas → decisión 7: claves por `<id>`, `mount(<id>, pasos)` y `clear()` al registrar; la verificación a mano hace dos validaciones
3. **Aceptado** — la lista de verbos y `--help` → `MODIFIED` de la lista y THEN de `--help`
4. **Aceptado** — faltaban códigos de salida y casos de `--steps` y `--out` → THEN de opciones que faltan, ids repetidos y lista vacía; «Límites» de `cli` con `--out` creado y escrito de nuevo
5. **Aceptado** — otra web puede escribir marcas en `127.0.0.1` → 403 por `Host`/`Origin` y 400 por id o estado, con su THEN
6. **Aceptado** — el contrato del panel sin declarar, claves que chocan con las de la app y el fallo de la inyección → la decisión 7 da la API y el prefijo `sdd-validation-`; THEN de la inyección que falla
7. **Aceptado** — el plan B sin fila de rúbrica → G6 (decisión 17), medido en el GREEN de `g1`-`g4`
8. **Aceptado** — `.temp/` puede no estar ignorado en un proyecto inicializado antes de la 0209 → decisión 9: lo dice y propone añadirlo
9. **Aceptado** — el servidor de `serve` y el entorno arrancado chocaban con «nada contra el entorno» → decisión 6 y un AND con lo que sigue en marcha
10. **Aceptado** — subir los topes no estaba en ✋, y `sdd-start-feature` no bajaba → decisión 15

### Decisiones tomadas con el dev-lead

- La validación del dev la lleva `sdd-archive`, paso 1, como desde la 0149 — prompt de arranque (enmienda de la 0131 del 2026-10-21)
- El guion empieza por los pasos literales del reporte, el agente lo corre antes a ritmo de usuario, y no lanza nada contra el entorno mientras la persona prueba — prompt de arranque
- Las cuatro reglas del research de la 0162 §3, el aviso `EACCES` de la guía de entornos, el plan B servido por la CLI y el arranque del entorno con `validation.startEnvironment: true` — prompt de arranque
- La lista para Mac del research queda fuera, a cargo de un compañero — prompt de arranque
- La 0208 no se parte, aunque prevé ~6 tasks en dos superficies — «Entera»
- Techo de la campaña: 22 sujetos y 15 $, con RED previo — «Techo 22 / 15 $ (Recomendada)»
- Todo OK en el panel más «listo» cuenta como `Validado` — «Sí, cuenta (Recomendada)»
- G4 limpio en el RED: se endurece el escenario y se mide (`g4`) — «Endurecer y medir (Recomendada)»
- Secciones de diseño 2, 3 y 4 — «si», «ok», «si»
- Review de spec con dos revisores: dominio en Opus y técnica en Sonnet — «dom opus y tec sonnet»
- Sigue sin parar hasta el cierre, con la validación en campo de este repo — «nos vemos en la validacion» (2026-10-22, tras aprobar la spec)
- Al fusionar, `sdd merge --push` — prompt de arranque

## Intent

En la validación manual el kit pide un guion de pruebas, pero no dice de dónde salen sus pasos ni obliga al agente a haberlo corrido. En el patch 0158 de document-manager el guion se saltó el paso del reporte, el agente no lo había probado («MIRA QUE LO PODÍAS SACAR TÚ») y una tanda suya escribió en los datos del dev-lead mientras validaba («ahora ni pega»). Además, `validation.startEnvironment` se guarda y no la lee nadie: quien la pone a `true` no se encuentra el entorno arrancado. Y el resultado de cada paso se copia y pega en el chat.

El éxito, medido en el GREEN:
- `g1`: 2 de 2 guiones abren con los dos pasos del reporte, sin pasos que el agente no corrió, y con el literal de cada resultado.
- `g2` y `g4`: 2 de 2 no dejan nada en marcha contra el entorno al presentar el guion.
- `g3`: 2 de 2 dejan el entorno arriba, y el guion da su puerto y cómo pararlo.
- El panel, en la verificación a mano: estado recuperado tras 3 de 3 recargas y un KO con su consola y su red.

Fracasaría si con `validation.mode: field` el cierre empezara a dar guion, a abrir el navegador o a preguntar (`a1`), o si el agente diera por bueno un paso de un guion que no ha corrido.

## Scope

- Entra:
  - `skills/sdd-archive/references/dev-validation.md` y `validation-panel.js`, nuevos, y el puntero del paso 1 de `skills/sdd-archive/SKILL.md` (decisiones 3-9).
  - `skills/sdd-start-feature/SKILL.md`, paso 7, y `skills/sdd-implement/SKILL.md`, parada de `pair`: punteros (decisión 3).
  - `cli/src/validation/` y su registro en los verbos: `sdd validation serve`, con sus tests en `cli/test/validation/` y su `--help`.
  - Plantillas: `operations-template.md`, `plan-template.md` y `spec-template.md` (decisiones 11 y 12).
  - Batería de `sdd-archive`: escenarios `g1`-`g4`, moldes `salas-report`, `reservas-e2e-manual` y `reservas-start`, rúbrica G1-G5 (hecho en el RED).
  - Evidencia: `tests/dev-validation-red.md` y `tests/dev-validation-green.md`; salidas en `red/` y `green/`; `verification/panel.md`.
  - `tests/WordBudget.Tests.ps1` (topes de abajo).
  - El roadmap: la 0208 cerrada; las filas de deuda «La validación del dev no tiene guion…» (queda el aislamiento de las pruebas del agente, que dio la 0180), «`validation.startEnvironment` sin lector» y «Redacción del guion y de las plantillas de la 0060», saldadas; y la fila del backlog B14, si sigue, saldada.
- No entra:
  - La lista de comprobaciones para Mac del research de la 0162 §4 (un compañero).
  - Retirar `sdd-start-feature`: la 0206.
  - Grabar consola y red con hora o capturar en el momento del KO (la opción D del research, Playwright con navegador visible): fuera, por la recomendación de la 0162.
  - Cambiar `validation.mode: field` de este repo.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| La descripción del guion de pruebas («pasos numerados, cada uno con una acción… lo que no se puede probar…») en el paso 7 | `skills/sdd-start-feature/SKILL.md:24`; `capabilities/feature-flow.md`, «El trabajo se valida con el usuario antes de cerrar» | puntero a `dev-validation.md` (decisión 3); delta, `MODIFIED` |
| «la dejas arrancada… el guion dice en qué puerto está» (solo lo que arrancó el agente) | `skills/sdd-start-feature/SKILL.md:24`; `capabilities/feature-flow.md`, «El guion de pruebas empieza con el entorno parado…» | delta, `MODIFIED`; Scope |
| «shaped like step 7 of `sdd-start-feature`» | `skills/sdd-implement/SKILL.md:291`; `capabilities/feature-flow.md`, «En `pair`, cada task cerrada para con su guion de pruebas» («con la forma del guion de la validación») | puntero a `dev-validation.md`; el requisito no cambia, porque ya dice «la forma del guion de la validación» |
| «the **test script** (numbered steps, each an action in the app and its expected result)» | `skills/sdd-archive/SKILL.md:29` | puntero a `dev-validation.md` (decisión 3) |
| «fijado en sdd-kit.json» | `skills/sdd-templates/templates/plan-template.md:30` | decisión 12 |
| «lo que no esté aquí desaparece» | `skills/sdd-templates/templates/spec-template.md:118` | decisión 12 |
| El segundo ejemplo de «Tasks verticales» | `skills/sdd-templates/templates/plan-template.md:135` | decisión 12 |
| `environments.md` como fuente del arranque (lo dice la fila de deuda de la 0036) | fila de deuda del roadmap | decisión 5: `## Entornos` de `operations.md`, su forma en la 3.0.0 |

- Filas que implementa: la 0208 → `roadmap.md` (su fila; los «tras» de otras filas que la nombran no cambian). Las tres filas de deuda del Scope dicen «Actuar → 0208» y se saldan en el cierre. «0208» no aparece en `capabilities/` ni en `skills/` (buscado `0208` en las dos carpetas).

## Approach

- El guion se compone y se ensaya antes de presentarlo, en el mismo orden que lo hará la persona: lo que el agente no pudo correr no lo pide.
- El panel es el mismo fichero en Chrome y en el plan B, con el contrato de la decisión 7: la receta lo inyecta o la CLI lo sirve, y las marcas tienen la misma forma (`{id, title, status, comment, markedAt}`).
- La referencia sigue la forma de las de `sdd-archive` (`e2e-suite.md`): cuándo se carga, los pasos en orden y la tabla de racionalizaciones de lo que falló en el RED.

## Dónde se prueba

- El guion, el entorno y nada contra el entorno: `g1`-`g4` ×2 de la batería de `sdd-archive`, en RED (hecho) y GREEN, con la rúbrica G1-G5; `a1` y `a2` ×1 como control.
- El panel con Claude in Chrome: a mano, en esta sesión, contra `probe/app` de la 0162 (decisión 10).
- `sdd validation serve`: Vitest en `cli/test/validation/`, como los verbos actuales (`cli.test.ts`): sirve la página con los pasos, guarda una marca en `--out` y la devuelve en `/results`, solo escucha en `127.0.0.1`, y un `--steps` que no es JSON sale con 2.
- Las plantillas y los topes: `tests/Templates.Tests.ps1` si fija los literales, y `tests/WordBudget.Tests.ps1`.

## Términos y ADR

- Términos resueltos: **guion de pruebas** — los pasos que hará la persona al validar, con su resultado esperado; distinto del smoke, que es lo que ya hizo el agente. **Panel de validación** — el recuadro inyectado en la app (o servido por la CLI) donde la persona marca OK o KO cada paso.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `feature-flow`

**MODIFIED — El trabajo se valida con el usuario antes de cerrar** (antes: «con los datos de los escenarios de la spec»)
- GIVEN una feature con la implementación terminada y el cierre de la revisión final terminado (sin Critical abiertos ni Important sin adjudicar), en un proyecto con `validation.mode` `manual` o sin la clave
- WHEN el agente va a cerrar
- THEN antes de invocar `sdd-archive` presenta, empezando por un párrafo con 🦆 sobre lo que cambia para quien usa el producto y siguiendo con «✋ Me salí del plan en…», las decisiones sin el dev-lead, el guion de pruebas y el smoke que ejecutó, y espera la validación explícita (qué probó el usuario y que funciona; «cierra la tarea» no lo es)
- AND el guion de pruebas son pasos numerados, cada uno con una acción en la aplicación y su resultado esperado, compuestos y ensayados como dice «El guion de la validación empieza por el reporte y lo ha corrido el agente» de [`archive`](archive.md). Va separado del smoke.
- REMOVED AND el guion de pruebas son pasos numerados, cada uno con una acción en la aplicación y su resultado esperado, con los datos de los escenarios de la spec. Lo que no se puede probar en la aplicación lo dice en su paso, con la comprobación que sí se puede hacer. Va separado del smoke.
- AND el smoke da una fila por THEN de la spec con su evidencia, que es uno de tres valores: `suite`, `ejecución real` o `no probado`. Un THEN que se observa en una interfaz (pantalla, respuesta HTTP, salida de una CLI, fichero que produce el cambio) solo cuenta como verificado con `ejecución real`.
- AND un THEN de fallo (un error, un rechazo, un 400) se provoca de verdad con la entrada que falla: con la feature 0012, `curl -i localhost:<puerto>/api/bookings?status=Lost` → `400` con «Estado no válido: Lost», no «lo cubre el test de la task 3»
- AND el smoke dice cuánto tardó la suite completa
- AND un «sí» sin detalle a la pregunta de validación, que ya pedía el detalle, es validación: no se repregunta, y el walkthrough registra la frase literal y «no detalló qué probó»
- AND si el usuario no responde, la feature queda en espera con el smoke documentado; si difiere, se aplica «La validación puede diferirse con condiciones» de [`control-profiles`](control-profiles.md); en `unattended` se difiere al smoke de la release
- AND el walkthrough registra la validación separada de lo verificado por el agente, y las decisiones sin el dev-lead en su propia sección
- AND con `validation.mode: field` no presenta guion ni espera: el smoke por THEN y la suite se ejecutan igual, el mensaje con el que pasa al cierre empieza por el 🦆 y el ✋ de los rulings, y se aplica «Con `validation.mode: field`, la validación es en campo» de [`control-profiles`](control-profiles.md)

**MODIFIED — El guion de pruebas empieza con el entorno parado, salvo que la persona lo quiera arrancado** (antes: «la deja arrancada», solo lo que levantó el agente)
- GIVEN la validación del paso 7 de la feature 0012, con la web levantada por el agente en el puerto 4656
- WHEN el agente presenta el guion de pruebas sin `validation.startEnvironment` en `.docs/sdd/sdd-kit.local.json`, o con `false`
- THEN antes de presentarlo ha parado lo que arrancó, y el guion empieza por cómo arrancarla
- AND con `validation.startEnvironment: true`, la deja arrancada, y el guion dice en qué puerto está y cómo pararla
- AND con `validation.startEnvironment: true` y el entorno sin levantar (el gate de cierre `node --test test/` no lo arranca), lo levanta antes del guion con `env:setup` de `## Entornos` de `operations.md` si la sección existe, o si no con «Arrancar» (`node scripts/env-up.mjs`), comprueba que responde, y el guion abre con su puerto y cómo pararlo (`node scripts/env-down.mjs`)
- AND sin «Arrancar» ni `## Entornos` en `operations.md`, el guion dice que no hay comando de arranque declarado y empieza por cómo arrancarla

### Capacidad: `archive`

**ADDED — El guion de la validación empieza por el reporte y lo ha corrido el agente**
- GIVEN el patch 0008 listo para validar en `validation.mode` `manual` o sin la clave, con el reporte de su §1: «miro qué hay libre: `node src/app.js libres 10:00-12:00` me da «Sur»; como el miércoles no tengo nada, pruebo `node src/app.js cancelar mie 10:00` y me dice «cancelada mie 10:00»», y una app que no guarda reservas entre procesos
- WHEN el agente compone el guion de pruebas
- THEN sus dos primeros pasos son los del reporte, literales y en su orden: «1. `node src/app.js libres 10:00-12:00` → «Sur» · 2. `node src/app.js cancelar mie 10:00` → «no hay reserva mie 10:00»»
- AND cada resultado esperado da el literal que sale, no «funciona» ni «se cancela con normalidad»
- AND antes de presentarlo, el agente corre cada paso del guion tal como lo hará la persona, con el usuario del agente de «Acceso a la aplicación» si `operations.md` lo declara, y deja los datos como estaban tras un paso que escribe o dice de qué estado parte la persona
- AND un paso que añadió y no funciona al correrlo («reserva el miércoles y cancélalo», que la app no guarda) no entra en el guion
- AND un THEN que no puede observar (una pantalla sin detector declarado) va en el guion con `no ensayado: <motivo>` y la comprobación que sí hizo
- AND en una feature sin reporte, los pasos salen de la línea «Se prueba en la aplicación» de cada task, y sin ella, de los THEN de la spec

**ADDED — Mientras la persona prueba, el agente no lanza nada contra el entorno**
- GIVEN la 0010 lista para validar en `validation.mode` `manual` o sin la clave, con una suite E2E de ~50 s cuyo `env-up` reinicia el servidor
- WHEN el dev-lead pide «dame ya el guion y, mientras lo pruebo, pasa en segundo plano tres veces las specs E2E que toca la rama»
- THEN desde el mensaje que presenta el guion hasta la respuesta de la persona, no deja en marcha ni lanza ninguna tanda, suite, `env-up`, `env-down`, sonda ni escritura en datos
- AND la tanda corre antes de presentar el guion, esperando su resultado, o queda para después de la validación, y el mensaje dice cuál y por qué
- AND siguen en marcha el entorno que levantó antes de presentar, comprobado antes, y el servidor de `sdd validation serve`; reinyectar o leer el panel de validación no cuenta como lanzar algo contra el entorno

**ADDED — La persona valida con un panel en su navegador**
- GIVEN la 0010 lista para validar en `validation.mode` `manual` o sin la clave, una sesión con Claude in Chrome y un navegador conectado, y un guion de 3 pasos
- WHEN el agente presenta la validación
- THEN abre la app, inyecta `validation-panel.js` y monta la validación `0010` con los 3 pasos (cada uno «acción → resultado esperado»), llama a `read_network_requests` y a `read_console_messages` con `clear: true`, y dice que la captura será la del momento de leer y que la red no trae hora
- AND al recibir «listo», o el aviso de que el panel ha desaparecido, lo reinyecta desde `localStorage` y monta `0010` otra vez, con las marcas que tenía, antes de leerlo
- AND con 3 de 3 en OK y «listo», el walkthrough registra `Validado: <fecha> · panel: 3/3 OK · «listo»` y el agente borra las claves `sdd-validation-` del panel
- AND con el paso 2 en KO y el comentario «sale cancelada», sigue por «No funciona» con ese comentario, la consola y la red leídas y una captura, y borra las claves `sdd-validation-` del panel, para que la vuelta tras el arreglo empiece de cero
- AND con el paso 3 sin marcar, pregunta por él; si la persona dice que lo probará más tarde, se aplica «La validación puede diferirse con condiciones» de [`control-profiles`](control-profiles.md) a ese paso
- AND una validación posterior en el mismo origen con otro id (`0011`) empieza sin las marcas de la `0010`
- AND si la inyección falla (una CSP que bloquea `eval`), pasa a «Sin Claude in Chrome, el panel lo sirve la CLI» y dice por qué
- AND con `validation.mode: field` no abre el navegador, no lanza `sdd validation serve` ni arranca el entorno para validar

**ADDED — Sin Claude in Chrome, el panel lo sirve la CLI**
- GIVEN la 0010 lista para validar en `validation.mode` `manual` o sin la clave, y una sesión sin las herramientas de Claude in Chrome, o sin navegador conectado
- WHEN el agente presenta la validación
- THEN ofrece `sdd validation serve --steps <pasos> --out .temp/validation/0010.json`, da su URL `http://127.0.0.1:<puerto>/` y dice que esa página no ve la app: sin consola, red ni captura del KO, que la persona cuenta en el comentario
- AND si `.temp/` no está en el `.gitignore` del proyecto, lo dice y propone añadirlo antes de lanzarlo
- AND el mensaje de la validación lleva, antes del guion, una sola línea `Panel:`: `Panel: Chrome sobre <url de la app>` o `Panel: plan B en http://127.0.0.1:<puerto>/`; «sin panel» no es una opción, y solo si `sdd validation serve` falla la línea es `Panel: no arrancó: <su error>`
- AND al recibir «listo» lee las marcas de `.temp/validation/0010.json`, para el servidor por su PID y aplica las mismas reglas de `Validado`, KO y paso sin marcar que con el panel en Chrome

**Reglas de la capacidad**
- **Dónde viven los datos**: la skill en `skills/sdd-archive/`; la receta del merge en `skills/sdd-archive/references/merge-recipe.md`; la de la validación del dev en `skills/sdd-archive/references/dev-validation.md`, con su panel en `validation-panel.js`, que guarda las marcas en el `localStorage` del navegador (`sdd-validation-<id>`) o, en el plan B, en `.temp/validation/<id>.json` del worktree; las ADR en `.docs/sdd/decisions/`; la deuda en `.docs/sdd/steering/debt.md` (3.0.0) o en «Deuda técnica» de `roadmap.md` (2.x)
- **Idioma de los nombres**: skill y ficheros en inglés kebab-case; marcas de carril de la skill `Feature only:`, `Patch only:`, `Hotfix only:`; el panel, `sddValidationPanel`, con los estados `pending`, `ok` y `ko`; las líneas de registro, en castellano (`Validado:`, `no ensayado:`)
- **Límites**: tope de palabras de `sdd-archive`, `SKILL.md` 3.920 y total 8.000 (`tests/WordBudget.Tests.ps1`); la suite completa una vez por árbol (en la validación, y otra tras el merge de sincronización solo si la base trae cambios fuera de `.docs/` que no sean `*.md`); el informe de rojo lleva las últimas 20 líneas; una suite E2E que pasa de su «Presupuesto E2E», o sin presupuesto, una suite de más de 10 minutos, va a la deuda del proyecto; un sha citado es una cadena de 7 a 40 caracteres hexadecimales; los nombres `finishing-a-development-branch`, `sdd-end-feature` y `sdd-end-patch` solo aparecen en `skills/` dentro del `NOTICE` y el anexo de procedencia de `sdd-archive` y en las migraciones de versiones pasadas (v0.4.0, v2.0.0)
- **Avisos**: «Hay cambios sin commitear: `<ficheros>`. ¿Los commiteo en la rama, los descarto o paro?» · «Abiertas a la vez: `<rama>` (`<ruta>`). La que fusione segunda integra la base y repite sus gates.» · «¿Alguno de estos patches pide algo al proyecto (un fichero, una clave, un paso a mano)?» · el bloque del rojo (comando, código de salida, ruta del log, últimas 20 líneas, línea `base:`, «`<merge.into>` sin tocar en `<hash>`») · «`base: en rojo: el mismo comando también falla sin la rama`» (contraste a mano) · «Para acabar la `<madre>` falta: `<id>` — `<título de la fila>`[, …]. Recomiendo `<id>`, la primera del roadmap sin dependencias abiertas.» · «Ninguna se puede arrancar todavía: `<id>` espera a `<ids>`.» · «Para acabar la propuesta `<N>` falta: …» · «La `<madre>` ya no tiene piezas abiertas: su fila se puede cerrar.» · «`<documento>` no existía: creado desde la plantilla» · `ADR: <candidata> → decisions/NNNN-<slug>.md` · `Validado: <fecha> · panel: <n>/<n> OK · «listo»` · `no ensayado: <motivo>` · que la captura es la del momento de leer y la red no trae hora (panel en Chrome) · que la página del plan B no ve la app: sin consola, red ni captura del KO · `Panel: Chrome sobre <url de la app>` · `Panel: plan B en http://127.0.0.1:<puerto>/` · `Panel: no arrancó: <su error>`
- **Regla ante conflicto**: un conflicto al integrar la base o al fusionar que `sdd merge` no resuelve lo resuelve una persona; un rojo que también falla sin la rama lo decide el dev-lead tras la búsqueda en la deuda; el merge a la rama estable, el tag y su push solo con la frase del dev-lead; la fila de la madre de una familia la cierra el dev-lead, no el cierre; el panel en Chrome va antes que el plan B, que solo sale sin Claude in Chrome, sin navegador conectado o con la inyección fallida; si lo que la persona dice en el chat contradice una marca del panel, manda lo que dice, y el agente lo registra con su frase

### Capacidad: `cli`

**MODIFIED — La CLI se ejecuta con Node y sin dependencias** (antes: la lista de verbos sin `validation serve`)
- GIVEN el plugin instalado y Node 22.18.0 o posterior en el `PATH`, sin pnpm, moon ni proto
- WHEN se ejecuta `node "<raíz del plugin>/cli/bin/sdd.js" --help`
- THEN lista cada verbo (`capability index|check|merge`, `decision check|index`, `roadmap check|publish`, `id next|claim`, `merge`, `estimation log`, `init`, `upgrade`, `session tokens`, `watch subagent|command`, `hook session-start`, `task start|done|brief`, `review package`, `workspace`, `ledger rulings`, `validation serve`) con una línea de ayuda, y sale con 0
- REMOVED THEN lista cada verbo (`capability index|check|merge`, `decision check|index`, `roadmap check|publish`, `id next|claim`, `merge`, `estimation log`, `init`, `upgrade`, `session tokens`, `watch subagent|command`, `hook session-start`, `task start|done|brief`, `review package`, `workspace`, `ledger rulings`) con una línea de ayuda, y sale con 0
- AND `cli/package.json` no tiene `dependencies`, y el plugin no necesita `pnpm install` para ejecutar ningún verbo

**ADDED — `sdd validation serve` sirve el panel y guarda las marcas**
- GIVEN un `pasos.json` con `[{"id": "1", "title": "libres 10:00-12:00 → «Sur»"}, {"id": "2", "title": "cancelar mie 10:00 → «no hay reserva mie 10:00»"}]`
- WHEN se ejecuta `sdd validation serve --steps pasos.json --out .temp/validation/0008.json`, sin `.temp/validation/`
- THEN crea `.temp/validation/`, escucha solo en `127.0.0.1`, en un puerto que elige el sistema, e imprime `panel: http://127.0.0.1:<puerto>/`
- AND la página lista los dos pasos con OK, KO y un comentario
- AND al marcar el paso 1 en OK, `.temp/validation/0008.json` y `GET /results` dan `[{"id": "1", "title": "libres 10:00-12:00 → «Sur»", "status": "ok", "comment": "", "markedAt": "<ISO 8601>"}, {"id": "2", "title": "cancelar mie 10:00 → «no hay reserva mie 10:00»", "status": "pending", "comment": "", "markedAt": null}]`
- AND una marca enviada con `Origin: http://evil.example` o con un `Host` que no es `127.0.0.1:<puerto>` sale con 403, y una con el id `9` o el `status` `hecho`, con 400; en los dos casos `0008.json` no cambia
- AND con un `--steps` que no existe, no es JSON, es `[]`, repite un id o tiene un `title` que no es texto, escribe en stderr `<ruta>: no es una lista de pasos {id, title}` y el uso, sale con 2 y no escucha
- AND sin `--steps` o sin `--out`, escribe qué falta y el uso (`uso: sdd validation serve --steps <fichero> --out <fichero>`), sale con 2 y no escucha
- AND `sdd validation serve --help` enseña ese uso sin escuchar y sale con 0

**Reglas de la capacidad**
- **Dónde viven los datos**: `sdd init` escribe `.claude/settings.json`, `.gitignore` y `.docs/sdd/sdd-kit.json` del proyecto; la versión, de `.claude-plugin/plugin.json` del kit; el bloque de settings, de su constante en `cli/src/init/`. `sdd upgrade` lee las migraciones de `skills/sdd-upgrade/references/migrations/` del kit cargado y escribe solo `.docs/sdd/sdd-kit.json`. `sdd validation serve` lee los pasos de `--steps` y el panel de `skills/sdd-archive/references/validation-panel.js` del kit cargado, y escribe solo el fichero de `--out`.
- **Límites**: `--ignore` relativo a la raíz, sin vacío, absoluto, `..`, espacios al borde ni saltos de línea; una acción por llamada; `--mark`, solo una versión `X.Y.Z` numérica, con su `vX.Y.Z.md` en el kit y mayor que la del proyecto; `sdd validation serve` escucha solo en `127.0.0.1` y en un puerto que elige el sistema, acepta solo peticiones con `Host` y `Origin` de `127.0.0.1:<puerto>`, y `--steps` es una lista JSON de al menos un `{id, title}` con ids únicos y `title` de texto; `--out` es relativo al directorio de trabajo, su carpeta se crea si falta, y el fichero se escribe de nuevo al arrancar.
- **Avisos**: `<clave>: la fija sdd init, se ignora`; `<ruta con puntos>: se deja <valor JSON>`; `autoMemoryEnabled: se deja true; pregunta al usuario si lo cambia`; `<ruta> no es JSON válido: no se toca`; `<ruta> no se puede fusionar: <ruta con puntos> no es un objeto`; `el proyecto ya está al día con el kit <versión>`; `sin sdd-kit.json: se aplican todas`; `init en curso: sigue con sdd-init`; `--mark <versión>: el kit no trae esa migración`; `--mark <versión>: el proyecto ya está en <versión>`; `panel: http://127.0.0.1:<puerto>/`; `<ruta>: no es una lista de pasos {id, title}`.
- **Regla ante conflicto**: en `settings.json`, la hoja que ya existe manda sobre la de la init, salvo `autoMemoryEnabled` con `--memory-off`; en `sdd-kit.json`, `channel` y `updated` los fija la CLI, `version` la fija la CLI salvo que ya exista (la de un template), y en el resto gana el `--config`; con `sdd upgrade --mark`, `version` es la que se marca y el resto de claves se queda; con `sdd validation serve`, un `--out` que ya existe se escribe de nuevo con los pasos de `--steps` en `pending`: cada validación empieza de cero.

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-archive`, `SKILL.md` | 3839 / 3900 | 61 | 3920 (~60 palabras de puntero en el paso 1 y un aviso en «Excuse») |
| `sdd-archive`, total | 6878 / 6900 | 22 | 8000 (`dev-validation.md`, ~1.000 palabras) |
| `sdd-start-feature`, `SKILL.md` | 2030 / 2100 | 70 | lo medido tras el recorte (~1.860: el paso 7 adelgaza ~170 palabras) |
| `sdd-start-feature`, total | 11436 / 11464 | 28 | lo medido tras el recorte (~11.270) |
| `sdd-implement`, `SKILL.md` | 9483 / 9483 | 0 | sin cambio (el puntero sustituye una frase de la misma longitud) |
| `sdd-implement`, total | 13249 / 13249 | 0 | sin cambio |
| `sdd-templates`, total | 15682 / 15690 | 8 | 15720 (~35 palabras: el aviso `EACCES` menos el ejemplo repetido) |
| Kit entero | 90369 / 90400 | 31 | 91300 |

## Enmiendas

- 2026-10-23 — El techo de la campaña pasa de 22 a 26 sujetos, para una vuelta más de G6 (ofrecer el plan B sin Chrome: 1 de 12 en GREEN y REFACTOR) con la línea `Panel:` sin la salida «sin panel»; si vuelve a fallar, se cierra con lo medido y una fila de deuda — Task 2, REFACTOR — aprobada: «Una vuelta más (Recomendada)»
- 2026-10-23 — Resultado de la vuelta: G6 3 de 4 (`g3-1` no ofrece el panel cuando el entorno no arranca; `g1-2` lanza el servidor en primer plano). Se cierra con lo medido y una fila de deuda, como fijó la enmienda anterior — Task 2, REFACTOR — sin parada: lo decidió el dev-lead en la enmienda anterior
- 2026-10-23 — La línea `Panel:` de la enmienda del techo entra en el delta de `archive` (un AND de «Sin Claude in Chrome, el panel lo sirve la CLI» y tres «Avisos»), y un KO borra las claves del panel para que la vuelta tras el arreglo empiece de cero — revisión final, eje Spec — sin parada: la primera recoge una enmienda ya aprobada; la segunda es la regla que una persona espera y la spec no decía

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-22 | aprobada (opción «Apruebo») |
