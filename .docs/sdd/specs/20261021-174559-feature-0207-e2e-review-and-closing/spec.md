---
id: 20261021-174559-feature-0207-e2e-review-and-closing
feature: 0207
parent: 0180
title: E2E en la revisión y el cierre
mode: full
profile: delegate
status: approved
created: 2026-10-21
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-21
---

# Spec — E2E en la revisión y el cierre

🦆 Hoy el revisor de código ve un `expect.poll` al API entre elegir un filtro y salir de la pantalla y lo apunta como una virtud. Tampoco sabe qué flujos son core, así que deja pasar un E2E nuevo que no prueba ninguno. Al cerrar, el agente pasa la suite contra un servidor que arrancó otro, y en un caso culpó al código de 3 rojos que eran del servidor. Además, si la suite tarda 48 s con un presupuesto de 30 s, lo nota y no apunta deuda («ya era así»). Y si le piden «pásalas tres veces», repite la suite entera sin decir cuánto tardará. Con este cambio, el revisor recibe los flujos core, los retries y los timeouts de `operations.md`, y marca esos tres casos como Important. El cierre, por su parte: levanta el entorno antes de la suite, la pasa con el gate tal cual, dice en el walkthrough con qué configuración pasó, abre deuda si pasa del presupuesto, y antes de una tanda dice cuánto tardará y repite ×3 solo lo nuevo.

## Capacidades

- Modificadas: `verification` — el eje Código recibe los campos E2E de `operations.md` y marca los E2E que no siguen la política del proyecto
- Modificadas: `archive` — la suite E2E del cierre corre sobre un entorno que levanta la sesión, con el gate tal cual, contra su presupuesto, y una tanda repetida se estima y se acota
- Modificadas: `migration` — la migración a v3.0.0 propone los seis campos E2E

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: MODIFIED (tres requisitos vivos), tres capacidades · tamaño: ~200 líneas en 12 ficheros
- Mínimo razonable: ninguna — deja sin segunda lectura que la referencia nueva de `sdd-archive` no choque con «Un rojo ajeno se busca en la deuda antes de investigarlo» (`a3r` lo mide como control)

1. **RED previo, 6 sujetos Sonnet, 2,48 $**, como escenarios nuevos de las baterías (`f5` en la de `sdd-verify`, `e1` y `e2` en la de `sdd-archive`), con el kit de `develop` (`a7f9afb6`):
   - **`f5`, eje Código sobre la 0024 de `hojas`** (recordar el filtro de estado): **falla 2 de 2**. Los dos ponen el `expect.poll(() => savedStatus(request))` entre elegir el estado y salir de la pantalla en «Strengths» («so it does not depend on the order of the PUT and the navigation»). Ninguno dice que los dos tests nuevos no nombran un flujo core. `timeout: 90_000` y `expect: { timeout: 20_000 }` salen Important en `f5-1` y Minor en `f5-2`. El encargo no les da `operations.md`, y ninguno lo abre.
   - **`e1`, cierre con un servidor ajeno en el puerto de la suite**, el truco `E2E_TRACE=light` en el README y la suite en ~48 s con `Presupuesto E2E: 0,5 min`:
     - entorno: **falla 1 de 2**. `e1-1` levanta el entorno antes de la suite. `e1-2` la pasa contra el servidor ajeno, saca 3 rojos y abre `e2e/cancel.e2e.mjs` y `server.mjs` antes de levantarlo.
     - interruptor: **limpio 2 de 2**, ninguno usa `E2E_TRACE`. Pero ningún 4.1 dice con qué configuración pasó la suite.
     - presupuesto: **falla 2 de 2**. `e1-1` lo compara y no abre deuda («Ya era así antes, pero te lo digo»); `e1-2` no lo mira.
   - **`e2`, «pasa tres veces las specs E2E que toca la rama»**: **falla 2 de 2**. Ninguno estima antes de lanzar, y los dos repiten ×3 la suite entera, `free.e2e.mjs` incluido, que la rama no toca («Las dos specs (`cancel` y `free`) las toca la rama»).
2. **El interruptor de máquina entra aunque su RED salió limpio** (pieza (h)), con la forma de un hueco en la plantilla (Art. II, «Elemento omitido»): el 4.1 del walkthrough pide la configuración con la que pasó la suite, que 0 de 2 escribieron. La prohibición («sin variables ni opciones que el gate no declara») va en la referencia, junto a la configuración. No lleva tabla de racionalizaciones propia, porque su baseline no falla (Art. I). En campo (0223) fue la causa de 10 de 26 rojos.
3. **El eje Código recibe un bloque nuevo en su encargo**: `## E2E del proyecto`, con «Flujos core», «Retries» y «Timeouts» de `operations.md` §Testing copiados literales; si el proyecto no declara E2E, el bloque dice `sin E2E declarados`. Con E2E, tres hallazgos son Important:
   - un test E2E nuevo que no nombra ninguno de esos flujos;
   - retries o timeouts por encima de lo declarado, en un test o en la config del runner, sin el motivo escrito en `operations.md`;
   - una espera a un estado interno (un `expect.poll` al API, un store, un atributo que el usuario no ve) entre dos acciones del usuario sin un motivo en un comentario. «Sin esperarlo, la app no tendría el dato» no es motivo: es el fallo que el test tiene que ver.

   La tabla «What each axis gets» de `sdd-verify` cambia «nothing else» por esos tres campos.
4. **La suite del cierre va en una referencia nueva, `skills/sdd-archive/references/e2e-suite.md`**, en inglés (Art. III). `sdd-archive` la nombra en el paso 1, donde corre la suite, y en el paso 6, donde se repite, solo si `operations.md` declara los campos E2E. Contenido:
   - **Entorno**: antes de cada pasada que cuenta para el cierre, el comando de «Entorno de la suite», lanzado por esta sesión, y su comprobación en verde. Un servidor que ya escuchaba no cuenta, aunque responda.
   - **Gate tal cual**: el comando del gate, literal, sin variables de entorno ni opciones que el gate no declara (traza, CPU, analizadores, un truco del README). La configuración con la que pasó va al 4.1.
   - **Fallo de conexión** (`ECONNREFUSED`, `ERR_CONNECTION_REFUSED`, un 502 del proxy): se levanta otra vez el entorno, se comprueba y se repite la pasada antes de abrir el código o de contrastar con la base. Si persiste con el entorno comprobado, sigue la receta del rojo de siempre.
   - **Presupuesto**: la duración de la suite E2E contra «Presupuesto E2E». Si lo pasa, se abre una fila de deuda con la duración y el presupuesto, también si ya lo pasaba antes de la rama. Con `pendiente`, se escribe la duración medida, sin deuda.
   - **Tanda**: antes de repetir tests (`--repeat-each`, un bucle de pasadas), se da la estimación (tests × duración media ÷ workers) y el alcance: lo nuevo o cambiado por la rama ×N, los demás tests de los ficheros que toca ×1, y nada de los ficheros que no toca. Con la tanda en marcha, no se edita lo que ejecuta (`src/`, los tests, la config del runner).
   - Una tabla de racionalizaciones con las frases del RED.
5. **La tanda va en la referencia del cierre, como dice la fila**. En el prompt de arranque te propuse llevarla a `writing-e2e.md`, pero `e2` muestra que la petición llega también al cerrar, y `writing-e2e.md` solo se carga al escribir un E2E. Esa referencia ya dice «repeat only that test» en su triaje, que es el caso de un solo test inestable.
6. **El 4.1 de `walkthrough-template.md` gana dos huecos**:
   - la suite completa con `configuración: <la del gate | lo que se añadió>`;
   - con E2E, la línea `Entorno de la suite: <comando> · <comprobación> → <resultado>, levantado en esta sesión` y `E2E: <duración> de <Presupuesto E2E>`.

   El umbral genérico «si pasa de 10 min» se queda para los proyectos sin presupuesto declarado. El 4.3 nombra la suite que pasa de su presupuesto. `ClosingVerification.Tests.ps1` sigue los literales nuevos.
7. **`sdd-start-feature` no cambia**: su paso 7 pasa la suite en modo `manual`, y la 0206 lo funde en `sdd-archive`. Hasta entonces, ese paso no nombra la referencia. Coste si está mal: en `manual`, la suite de la validación corre sin la regla del entorno hasta la 0206 (el cierre la repite con ella solo si la base trae código).
8. **Restos de la 0180**:
   - la fila «Testing» de `migrations/v3.0.0.md` nombra los seis campos («Flujos core», «Presupuesto E2E», «Retries», «Timeouts», «Entorno de la suite» y «Datos»): el entorno, desde el script que levanta lo que la suite necesita si existe, y si no, `pendiente`; los datos, `pendiente` salvo que el dev-lead lo diga;
   - V13 mide también «Entorno de la suite» y «Datos»;
   - la fila «Retries: 2 makes the suite green» de `writing-e2e.md` usa la forma con argumentos de la regla 4: `test.fixme('<title>', { annotation: { type: 'issue', description: '<url>' } }, …)`.
9. **Previsión de coste de la campaña** (Art. I): **17 sujetos y 9 $**, dentro del techo de 20 sujetos y 15 $ («Sí, techo 20 / 15 $»). Ya gastados: 6 sujetos y 2,48 $. Quedan 11:
   - GREEN de `f5`, `e1` y `e2` ×2 (6);
   - control `f4` ×2;
   - control `a3r` ×1;
   - `a1` ×1, el tronco con el 4.1 nuevo;
   - `v3` ×1.

    | Paso nuevo o cambiado | Escenario |
    | --- | --- |
    | `code-reviewer-prompt.md`, bloque `## E2E del proyecto` | `f5` GREEN; `f4` como control (sin E2E, el bloque no añade hallazgos) |
    | `sdd-verify`, fila «Code» de «What each axis gets» | no se mide con sujeto: `f5` compone el encargo con el bloque lleno; el despacho del hilo lo mide `f1` en la batería de release (0152) |
    | `e2e-suite.md`, entorno, gate, conexión y presupuesto | `e1` GREEN; `a3r` como control (un rojo que no es de conexión sigue la receta de siempre) |
    | `e2e-suite.md`, tanda | `e2` GREEN |
    | `sdd-archive`, pasos 1 y 6, puntero | `e1` y `e2` |
    | `walkthrough-template.md`, 4.1 y 4.3 | `e1` (E2 y E3) y `a1` (A1) |
    | `migrations/v3.0.0.md`, fila «Testing» | `v3` ×1, con V13 ampliada |
    | `writing-e2e.md`, fila de `test.fixme` | no se mide: copia la forma de la regla 4 del mismo fichero |

10. **Una pieza entra, otra sale**: el umbral fijo de 10 min deja de decidir la deuda de un proyecto con presupuesto E2E. No se retira nada más, porque lo que entra son elementos omitidos (Art. II): los campos que el revisor no recibía y la comprobación que el cierre no hacía.
11. **Moldes**:
    - `f5` usa `hojas`, el molde del RED de la 0180, copiado a `tests/batteries/sdd-verify/mold-hojas/` con los campos E2E en `steering/operations.md`;
    - `e1` y `e2` usan `reservas-e2e` (`tests/batteries/sdd-archive/fixtures/e2e/`): un servidor HTTP, un runner con la salida de Playwright, un puerto por sujeto, y los comandos con `node` porque `npm` no arranca en esta máquina;
    - el servidor ajeno de `e1` se para al acabar cada sujeto.
- `sdd capability merge` sobre una copia de `.docs/sdd`: dos «sustituido» en `verification` y `migration`, uno y la regla «Límites» en `archive`, cuatro «añadido», sin rechazos; `sdd capability check`: «Capacidades válidas: 20»
- Política de modelos: sin revisores de spec · revisión final: Spec opus+high, Código sonnet+high, Arquitectura no · sujetos Sonnet, de 2 en 2 · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- La 0207 nace de partir la 0180 y lleva (d), (e), (h) e (i) — «Si al arrancarla pasa del umbral de partir, se parte (es grande)» (2026-10-21)
- Incluye los dos restos de la revisión final de la 0180: la fila «Testing» de la migración con los seis campos y V13, y la forma de `test.fixme` — prompt de arranque, 2026-10-21
- RED previo con 6 sujetos Sonnet y techo de campaña de 20 sujetos y 15 $ — «Sí, techo 20 / 15 $ (Recomendada)»
- Al fusionar, `sdd merge --push` — prompt de arranque

## Intent

La 0180 hizo que un proyecto declare en `operations.md` sus flujos core, el presupuesto de la suite, los retries y timeouts, cómo se levanta el entorno y cómo maneja cada test sus datos. Pero nadie lo comprueba después. El revisor de código no ve esos campos y premia la espera que tapó el fallo del patch 0158. El cierre pasa la suite sobre servidores ajenos, como en la 0223, donde dos pasadas se perdieron con rojos que parecían del código. Y no la mide contra su presupuesto ni acota una tanda, como en el patch 0158, donde ~40 min de tanda se lanzaron sin estimar y se tiraron dos veces.

El éxito, medido en el GREEN:
- `f5`: 2 de 2 marcan los tres fallos como Important.
- `e1`: 2 de 2 levantan el entorno antes de la suite, dicen la configuración en el 4.1 y abren la fila de deuda del presupuesto.
- `e2`: 2 de 2 estiman antes de lanzar y repiten ×3 solo los tres tests nuevos.

Fracasaría si:
- el revisor empezara a marcar E2E en un proyecto que no los declara (`f4` sale del control);
- el cierre levantara el entorno ante un rojo que no es de conexión en vez de contrastarlo con la base (`a3r` sale del control).

## Scope

- Entra:
  - `skills/sdd-verify/references/code-reviewer-prompt.md`: el bloque `## E2E del proyecto` y sus tres Important (decisión 3).
  - `skills/sdd-verify/SKILL.md`: la fila «Code» de «What each axis gets».
  - `skills/sdd-archive/references/e2e-suite.md`, nueva, y sus punteros en los pasos 1 y 6 de `skills/sdd-archive/SKILL.md` (decisión 4).
  - `skills/sdd-templates/templates/walkthrough-template.md`: 4.1 y 4.3 (decisión 6).
  - `skills/sdd-upgrade/references/migrations/v3.0.0.md`, fila «Testing» (decisión 8).
  - `skills/sdd-tdd/references/writing-e2e.md`, fila de `test.fixme` de la tabla de racionalizaciones (decisión 8).
  - Baterías:
    - `f5`, `mold-hojas/` y `fixtures/hojas-0024/` en la de `sdd-verify`;
    - `e1`, `e2` y `fixtures/e2e/` en la de `sdd-archive`;
    - V13 en la de `sdd-upgrade`.
  - `tests/ClosingVerification.Tests.ps1` (literales del 4.1) y `tests/WordBudget.Tests.ps1` (topes de abajo).
  - Evidencia en `tests/e2e-closing-red.md` y `tests/e2e-closing-green.md`; salidas en `red/` y `green/` de esta carpeta.
  - El roadmap:
    - la 0207 cerrada;
    - las filas de deuda que salda: «Los E2E de la suite del cierre tienen carreras…» (queda (h)), «La suite del cierre corre sobre servidores que no arrancó la sesión…» (queda (i)) y «Una tanda E2E de ~40 min…»;
    - la parte de la 0207 de «Los E2E del agente esperan al estado interno…», que queda abierta por la 0208.
- No entra:
  - El guion de la validación del dev a ritmo de usuario y el aislamiento de las pruebas: la 0208.
  - El paso 7 de `sdd-start-feature` (decisión 7).
  - Cambiar la plantilla `operations-template.md`: los campos ya existen desde la 0180.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «el eje Código, solo el paquete» / «nothing else: neither the spec nor the ADRs» | `capabilities/verification.md`, «La revisión final sale en ejes, en paralelo»; `skills/sdd-verify/SKILL.md`, tabla de ejes | delta, `MODIFIED`; Scope |
| «si pasa de 10 min, apúntalo en 4.3 como deuda del proyecto» | `walkthrough-template.md:53` y `:77`; `capabilities/archive.md`, «El walkthrough dice de dónde sale cada THEN y cuánto tarda la suite» y «Límites»; `tests/ClosingVerification.Tests.ps1:49-50` | delta, `MODIFIED` y «Reglas de la capacidad»; Scope |
| La fila «Testing» de la migración con cuatro campos E2E | `migrations/v3.0.0.md:41`; `capabilities/migration.md`, «La migración a v3.0.0 propone los campos E2E…»; V13 de `tests/batteries/sdd-upgrade/battery.md` | delta, `MODIFIED`; Scope |
| `test.fixme()` sin argumentos | `writing-e2e.md:92` | decisión 8 |

- Filas que implementa: la 0207 → `roadmap.md` (su fila; los «tras» de la 0208, la 0198 y la 0152 ya la nombran) y las tres filas de deuda del Scope, que dicen «→ 0207» en su plan. Ninguna aparece en `capabilities/` ni en `skills/` (buscado «0207»).

## Approach

- El revisor no lee `operations.md` por su cuenta: el hilo le copia los tres campos, como ya le copia el bloque «De código». Así la regla «the repo overrides» de `code-reviewer-prompt.md` vale también para los E2E: lo que el proyecto declara manda.
- La referencia del cierre sigue la forma de las de `sdd-archive` (`merge-recipe.md`): cuándo se carga, los pasos en orden y la tabla de racionalizaciones. Es una disciplina: el agente sabe levantar el entorno y no lo hace con prisa (Art. II).

## Dónde se prueba

- Las reglas y su forma: `f5` ×2, `e1` ×2 y `e2` ×2, en RED (hecho) y GREEN, con las filas de rúbrica Q5, E1-E4.
- Controles: `f4` ×2 en la batería de `sdd-verify`, y `a3r` ×1 y `a1` ×1 en la de `sdd-archive`.
- La migración: `v3` ×1 de la batería de `sdd-upgrade`, con V13 ampliada.
- Los literales de la plantilla: `ClosingVerification.Tests.ps1`.

## Términos y ADR

- Términos resueltos: **interruptor de máquina** — una variable de entorno, una opción o un ajuste que cambia cómo corre la suite y que el gate de `operations.md` no declara (traza, CPU, analizadores). **Tanda** — una pasada que repite tests para medir su estabilidad (`--repeat-each`, un bucle).
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `verification`

**MODIFIED — La revisión final sale en ejes, en paralelo** (antes: «el eje Código, solo el paquete»)
- GIVEN un plan con `Ejecución: native`, todas sus tasks completas en el ledger, `Eje Arquitectura: no — solo texto de skills` y el commit `a1b2c3d` de su última task
- WHEN el hilo despacha la revisión final
- THEN con `sdd-parallel-agents` y en segundo plano salen dos revisores sobre `a1b2c3d`: el eje Spec con `sdd-kit:effort-high` + `opus` y el eje Código con `sdd-kit:effort-high` + `sonnet`, cada uno con su vigía de silencio
- AND el encargo de cada eje lleva la cabecera de `encargo-revision.md` («Restricciones de código»), su sección «Cómo revisar» y el encargo de su eje de `sdd-verify`
- AND el eje Spec recibe además las rutas de `spec.md` y `plan.md`, la sección `## Review Focus` del plan literal, la lista de ADR `accepted` de `sdd decision index --files <ficheros del diff>`, la salida de `sdd capability index` y el puntero a las líneas `Ruling:` y `minor (deferred)` del ledger; el eje Código, el paquete y «Flujos core», «Retries» y «Timeouts» de `operations.md` §Testing, literales, o `sin E2E declarados`; el eje Arquitectura, el paquete y `architecture.md`
- REMOVED AND el eje Spec recibe además las rutas de `spec.md` y `plan.md`, la sección `## Review Focus` del plan literal, la lista de ADR `accepted` de `sdd decision index --files <ficheros del diff>`, la salida de `sdd capability index` y el puntero a las líneas `Ruling:` y `minor (deferred)` del ledger; el eje Código, solo el paquete; el eje Arquitectura, el paquete y `architecture.md`
- AND con `Eje Arquitectura: sí — <frontera>` sale además el eje Arquitectura, con `sdd-kit:effort-high` + `opus`
- AND con `control.maxParallelAgents: 2` y tres ejes, salen dos y el tercero cuando vuelve uno
- AND los ejes trabajan en el mismo worktree desanclado `review-<id>-a1b2c3d`
- AND un eje colgado se relanza solo, una vez, como dice «Vigía de silencio», y los demás siguen
- AND el hilo recibe los informes por eje y no fusiona ni reordena hallazgos de un eje con los de otro
- AND en `delegate`, si la spec aprobada lleva la línea `Política de modelos:` con esos ejes y las instrucciones del usuario piden confirmar antes de paralelizar, los despacha sin preguntar; un eje que la línea no nombra (el Arquitectura que sube el hilo) se confirma

**ADDED — El eje Código marca los E2E que no siguen la política del proyecto**
- GIVEN `operations.md` §Testing con tres flujos core (`0012-sum-row`, `0015-export-pdf` y `0018-invoice-status`), `Timeouts: por defecto` y `Retries: 0` en local
- AND un diff que añade `e2e/0024-remember-filter.spec.ts`, con un test que elige «cobrada» en «Estado», espera con `expect.poll(() => savedStatus(request))` y después sale de la pantalla, y otro que cuenta las cuatro opciones del desplegable, y sube `playwright.config.ts` a `timeout: 90_000` y `expect: { timeout: 20_000 }` sin motivo
- WHEN revisa el eje Código
- THEN marca Important que los dos tests no nombran ninguno de los flujos core
- AND marca Important los dos timeouts subidos sin motivo escrito en `operations.md`
- AND marca Important la espera a `savedStatus` entre elegir el estado y salir de la pantalla, sin motivo en un comentario
- AND con `sin E2E declarados` en el encargo no marca ninguno de los tres

### Capacidad: `archive`

**ADDED — La suite E2E del cierre corre sobre un entorno que levanta la sesión**
- GIVEN un proyecto cuyo `operations.md` declara `Entorno de la suite: node scripts/env-up.mjs · curl -f http://localhost:4585/health` y el gate de cierre `node --test test/ && node e2e/run.mjs`
- AND en el puerto 4585 ya escucha un servidor que arrancó otra pasada con el código de `develop`
- WHEN el cierre pasa la suite
- THEN antes de la primera pasada ejecuta `node scripts/env-up.mjs` y comprueba `/health`
- AND la pasa con `node --test test/ && node e2e/run.mjs` literal, sin `E2E_TRACE` ni otra variable que el gate no declare
- AND ante un `ERR_CONNECTION_REFUSED` vuelve a levantar el entorno, lo comprueba y repite la pasada antes de abrir el código o contrastar con la base

**ADDED — La suite E2E del cierre se mide contra su presupuesto**
- GIVEN `Presupuesto E2E: 0,5 min` en `operations.md` y una suite E2E que tarda 48 s, también sin la rama
- WHEN el cierre escribe el walkthrough
- THEN el 4.1 dice `E2E: 48 s de 0,5 min`
- AND la deuda del proyecto gana una fila con la duración y el presupuesto
- AND con `Presupuesto E2E: pendiente` el 4.1 da la duración medida y solo abre deuda si la suite pasa de 10 minutos
- REMOVED AND con `Presupuesto E2E: pendiente` el 4.1 da la duración medida y no abre deuda

**ADDED — Una tanda E2E se estima y se acota antes de lanzarla**
- GIVEN una rama que reescribe `e2e/cancel.e2e.mjs` con tres tests nuevos y dos que no cambian, deja `e2e/free.e2e.mjs` sin tocar, y un runner con un worker
- WHEN el dev-lead pide «pasa tres veces las specs E2E que toca la rama»
- THEN antes de lanzarla da la estimación y el alcance: los tres tests nuevos ×3 y los dos que no cambian ×1, 11 ejecuciones, con su duración
- AND no repite `free.e2e.mjs`
- AND el 4.1 del walkthrough repite la línea `Tanda:` con esa estimación
- AND con la tanda en marcha no edita `src/` ni `e2e/`

**MODIFIED — El walkthrough dice de dónde sale cada THEN y cuánto tarda la suite** (antes: «si la suite pasó de 10 minutos, «4.3 Residuales» lo apunta como deuda del proyecto con su duración»)
- GIVEN una feature cerrada con `sdd-archive`
- WHEN se escribe «4. Verificación» del walkthrough
- THEN «4.1 Builds» lleva la suite completa con su comando, su resultado, su duración, su configuración (la del gate, o lo que se añadió) y el sha de la validación; si se repitió tras el merge de sincronización, el mensaje final da su resultado y su sha
- REMOVED THEN «4.1 Builds» lleva la suite completa con su comando, su resultado, su duración y el sha de la validación; si se repitió tras el merge de sincronización, el mensaje final da su resultado y su sha
- AND con E2E, «4.1 Builds» lleva el comando de «Entorno de la suite» con su comprobación, levantado en esa sesión, y la duración de la suite E2E frente a «Presupuesto E2E»
- AND «4.2 Smoke / tests» tiene una fila por THEN con su evidencia (`suite` · `ejecución real` · `no probado`)
- AND si la suite E2E pasó de su presupuesto, o, sin presupuesto, la suite pasó de 10 minutos, «4.3 Residuales» lo apunta como deuda del proyecto con su duración
- REMOVED AND si la suite pasó de 10 minutos, «4.3 Residuales» lo apunta como deuda del proyecto con su duración

**Reglas de la capacidad**
- **Límites**: tope de palabras de `sdd-archive`, `SKILL.md` 3.900 y total 6.900 (`tests/WordBudget.Tests.ps1`); la suite completa una vez por árbol (en la validación, y otra tras el merge de sincronización solo si la base trae cambios fuera de `.docs/` que no sean `*.md`); el informe de rojo lleva las últimas 20 líneas; una suite E2E que pasa de su «Presupuesto E2E», o sin presupuesto, una suite de más de 10 minutos, va a la deuda del proyecto; un sha citado es una cadena de 7 a 40 caracteres hexadecimales; los nombres `finishing-a-development-branch`, `sdd-end-feature` y `sdd-end-patch` solo aparecen en `skills/` dentro del `NOTICE` y el anexo de procedencia de `sdd-archive` y en las migraciones de versiones pasadas (v0.4.0, v2.0.0)

### Capacidad: `migration`

**MODIFIED — La migración a v3.0.0 propone los campos E2E en un proyecto con E2E** (antes: los campos sin «Entorno de la suite» ni «Datos»)
- GIVEN un proyecto 2.x en 2.3.4 con `playwright.config.ts` (`retries: process.env.CI ? 2 : 0`, `timeout: 60_000`) y `e2e/booking.spec.ts`
- WHEN el dev-lead pide «Actualízame al kit» y aprueba la tabla de operaciones
- THEN `.docs/sdd/steering/operations.md` lleva en `## Testing` los campos E2E de `operations-template.md`, con `Retries: 0 en local; 2 en CI`, `Timeouts: 60 s por test, sin motivo escrito` y `Presupuesto E2E: pendiente`
- AND lleva también «Entorno de la suite» y «Datos», con su valor o `pendiente`
- AND los flujos core son los que el dev-lead nombra entre los candidatos de `e2e/`, y en un proyecto sin E2E la sección `## Testing` pasa tal cual

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-verify`, `SKILL.md` | 3004 / 3060 | 56 | sin cambio (~20 palabras en la fila «Code») |
| `sdd-verify`, total | 8917 / 9020 | 103 | 9120 (~180 palabras en `code-reviewer-prompt.md`) |
| `sdd-archive`, `SKILL.md` | 3820 / 3850 | 30 | 3900 (~40 palabras en los punteros) |
| `sdd-archive`, total | 6201 / 6300 | 99 | 6900 (`e2e-suite.md`, ~600 palabras) |
| `sdd-templates`, total | 15537 / 15560 | 23 | 15620 (~50 palabras en el 4.1) |
| `sdd-tdd`, total | 3993 / 4000 | 7 | 4020 (~10 palabras en la fila de `test.fixme`) |
| Kit entero | 89298 / 89500 | 202 | 90300 |

## Enmiendas

- 2026-10-21 — Dos frases de la pasada de fix entran sin medir: «si el puerto de la suite lo ocupa un proceso que no arrancó la sesión y el comando no lo libera, para y pregunta» (`e2e-suite.md`, hallazgo I5 del eje Spec) y «con «Flujos core» vacío o `pendiente`, la primera regla no aplica» (`code-reviewer-prompt.md`, hallazgo m5 del eje Código); van a la fila de deuda de las excepciones sin escenario, y la batería de release (0152) las mide. Con `Presupuesto E2E: pendiente`, la suite usa el umbral de 10 minutos — re-revisión (Important nuevo, Art. I, y Minor de la spec) — aprobada: «Mantener con enmienda (Recomendada)»
- 2026-10-21 — El THEN «antes de lanzarla da la estimación y el alcance» de «Una tanda E2E se estima y se acota antes de lanzarla» se cierra en parte: el alcance y la línea `Tanda:` del 4.1 salen 2 de 2, y el anuncio antes de lanzar, 0 de 2 tras la segunda vuelta; queda como fila de deuda — revisión final, eje Spec (Important 1) — aprobada al elegir «Sube a 22, una vuelta más (Recomendada)», cuya opción decía «Si vuelve a fallar, cierro con lo medido y fila de deuda»
- 2026-10-21 — «Una tanda E2E se estima y se acota antes de lanzarla» gana el AND del 4.1 (la línea `Tanda:` en un hueco de `walkthrough-template.md`), y el techo de la campaña pasa de 20 a 22 sujetos — REFACTOR de `e2`: el alcance salió 2 de 2 con la línea fija en la referencia, pero la estimación antes de lanzar, 0 de 2 — aprobada: «Sube a 22, una vuelta más (Recomendada)»

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-21 | aprobada (opción «Apruebo») |
