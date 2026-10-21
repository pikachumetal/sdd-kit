---
id: 20261021-133607-feature-0180-e2e-core-flows
feature: 0180
title: E2E — flujos core, presupuesto y cómo se escribe un E2E
mode: full
profile: delegate
status: approved
created: 2026-10-21
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-21
---

# Spec — E2E: flujos core, presupuesto y cómo se escribe un E2E

🦆 Hoy, cuando un agente escribe un E2E con el kit, copia lo que ve en el proyecto: espera a que el API tenga la copia antes de abrir el menú de «Pegar», teclea nada más pulsar Enter y sube el timeout hasta que el test pasa. Un usuario no espera al API, y por eso un fallo de ~3 s tras copiar vivió tres releases sin que ningún test lo viera. Con este cambio, el proyecto declara en `operations.md` sus flujos core, cada uno con su test, junto con el presupuesto de la suite, los retries y timeouts, cómo se levanta el entorno y cómo crea y borra cada test sus datos. Quien escribe un E2E sigue una referencia nueva: entre dos acciones del usuario solo espera a lo que el usuario ve, por ejemplo al editor de la celda con el foco antes de teclear «4321».

## Capacidades

- Modificadas: `onboarding` — `operations.md` §Testing gana los campos de los E2E, y la init los propone desde el código
- Modificadas: `feature-flow` — un E2E se escribe con la referencia de E2E; un test inestable no se tapa con retries ni timeouts

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: MODIFIED (`operations.md` dice cómo se ejecuta y se verifica el proyecto), contrato público (`operations.md` §Testing lo leen las skills y la 0207) · tamaño: ~170 líneas en 10 ficheros
- Mínimo razonable: ninguna — deja sin segunda lectura los nombres de los campos nuevos, que la 0207 leerá por su nombre

1. **RED previo, 4 sujetos Sonnet, 1,17 $** (molde `hojas` en `red/`, una app React con una rejilla, un API y un E2E por feature):
   - **r1, escribir el E2E de pegar desde el menú** (`sdd-tdd`): **falla 2 de 2**. Los dos esperan al portapapeles del API entre Ctrl+C y el clic derecho (`expect.poll(() => copiedRange(request))`), el fallo del patch 0158. `r1-2` además teclea con `typeInCell` (Enter y teclear sin esperar al editor), el fallo de la 0223, y sube esa espera a `timeout: 10_000`. Su motivo escrito, «sin esperarlo, «Pegar» no tendría nada», es justo el fallo del producto que la espera tapa. `r1-1` esperó bien al editor, pero el molde se lo chivaba en un comentario de `Grid.tsx`, que quité antes de `r1-2`. `waitForTimeout`: 0 de 2.
   - **r2, «Dónde se prueba» de una feature de la lista de facturas** (`sdd-propose`): **limpio 2 de 2**. Los dos bajan al test de componente y no piden E2E. `r2-1` se apoyó en una fila de deuda del molde («la suite E2E tarda ~14 min»); `r2-2` no.
2. **Por r2, «Dónde se prueba» de la spec no cambia** (pieza (b)). Lo decidiste tú, pero el Art. I no deja escribir una regla cuyo baseline no falla. La regla «un E2E nuevo nombra un flujo core; lo demás baja de capa» sigue en tres sitios: la ayuda del campo «Flujos core» de `operations.md`, la primera regla de la referencia de E2E y la comprobación del eje Código de la 0207. El GREEN repite r2 como control. Puede ser un falso negativo, porque el molde tenía un test de componente a mano: si un ticket trae una spec que pidió un E2E fuera de los flujos core, el hueco en la plantilla vuelve con ese caso.
3. **`waitForTimeout` entra como contraejemplo de la regla de esperar a un estado visible, no como regla propia**: salió 0 de 2, pero en campo es el arreglo que sale al primer fallo por tiempo (0223), y el Art. II pide que cada regla lleve el motivo que no vale.
4. **Campos nuevos en `operations-template.md` §Testing**, solo si el proyecto tiene E2E. Los nombres son míos:
   - **Flujos core**: uno por línea, el flujo en palabras del usuario y su test, p. ej. «emitir una factura · `e2e/invoice.spec.ts` › emite y descarga el PDF». Ayuda: «Un E2E nuevo nombra uno de estos flujos; lo demás se prueba en una capa más baja.»
   - **Presupuesto E2E**: los minutos que puede tardar la suite E2E del gate, p. ej. `10 min`. Lo lee el cierre en la 0207.
   - **Retries**: `0` en local; en CI, `0`, `1` o `2`. Recomendado, `0` y `2`.
   - **Timeouts**: `por defecto` (los del runner: en Playwright, 30 s por test y 5 s por `expect`), o el valor subido con su motivo escrito.
   - **Entorno de la suite**: el comando que levanta todo lo que la suite necesita (contenedores, API, web) y cómo se comprueba que responde, p. ej. `moon run env:up` · `curl -f http://localhost:5000/health`.
   - **Datos**: cómo crea y borra cada test sus datos, p. ej. «la fixture `invoice` la crea y la borra al acabar», con la frase fija «un test que solo pasa con el entorno recién vaciado depende de otro».
   - **Acceso a la aplicación** (el campo que ya existe) gana «el usuario del agente, distinto del de la persona que valida».
5. **La init los propone desde el código**: los flujos desde los E2E que encuentra (el dev-lead dice cuáles son core), y retries y timeouts desde la config del runner, con el valor real. Un timeout subido sin motivo se escribe tal cual, con «sin motivo escrito»: la init no lo corrige ni abre deuda. El presupuesto, `pendiente` salvo que el dev-lead lo diga, como las duraciones.
6. **La migración v3.0.0 añade esos campos a un proyecto con E2E**, propuestos como en la init: la fila «Testing» de su tabla pasa de «tal cual» a «tal cual, y con E2E, los campos E2E de la plantilla, propuestos como en la init». Una sola fuente (Art. V): la lista de campos vive en la plantilla.
7. **La referencia va en `skills/sdd-tdd/references/writing-e2e.md`**, junto a `writing-good-tests.md`, en inglés (Art. III), y `sdd-tdd` la nombra en el paso que manda leer `writing-good-tests.md`: «si el test es un E2E, lee también `writing-e2e.md`». No va en `sdd-start-feature`, que retira la 0206. Contenido:
   - el E2E nombra un flujo core;
   - el comportamiento visible, con localizadores por rol y texto y aserciones que reintentan solas (las *best practices* de Playwright);
   - entre dos acciones del usuario, solo se espera a lo que el usuario ve: una espera a un estado interno lleva su motivo en un comentario, y «sin esperarlo, la app no tendría el dato» no es un motivo, sino el fallo que el test tiene que ver (r1, patch 0158);
   - tras un cambio de foco o de celda, se espera a un estado visible antes de teclear, con el ejemplo de `typeInCell` de la 0223 («Concepto» llega «oncepto»); `waitForTimeout` no es una espera;
   - cada test crea y borra sus datos, con el usuario del agente;
   - retries y timeouts, los de `operations.md`;
   - el triaje de un test inestable: repetir solo ese test (`--repeat-each`), clasificar la causa (carrera del test, carrera de la app, entorno, datos compartidos) y arreglarla; si no se puede ahora, `test.fixme()` con el enlace a su issue; nunca subir retries ni timeouts;
   - una tabla de racionalizaciones con las frases de r1.
8. **Los datos de Playwright (30 s y 5 s por defecto, `test.fixme`, `--repeat-each`) los compruebo en la fuente de Playwright en la Task 2**, no en un resumen: Context7 solo devolvió la config de ejemplo del sitio, con `timeout: 30 * 1000` y `expect: { timeout: 5000 }`.
9. **Scripts de verificación desechables** (pieza (c)): **recortada por enmienda** (2026-10-21). Su RED salió limpio 2 de 2 (`r4`): ningún sujeto dejó el script en `e2e/` ni lo commiteó. `sdd-implement` y `frontend-verification.md` no cambian.
10. **El RED de los dos frentes que no medí antes, va en su task**: el triaje del test inestable (Task 2) y el script de verificación que acaba en `e2e/` (Task 3), 2 sujetos cada uno. Si sale limpio, se recorta con una enmienda, como en la decisión 2.
11. **Previsión de coste de la campaña** (Art. I), las tres fases: **22 sujetos y 20 $** de techo, con un 20 % de reserva para lo que destape la revisión final. Van gastados 4 sujetos y 1,17 $. Quedan: Task 1, un humo de la init (1 sujeto); Task 2, RED del triaje (2) y GREEN de r1, del triaje y el control de r2 (6); Task 3, RED y GREEN del script (4). Cada paso nuevo o cambiado y su escenario:

    | Paso | Escenario |
    | --- | --- |
    | `operations-template.md` §Testing, campos E2E | `AnchorTemplates.Tests.ps1`, «§Testing pide …» (estructural) |
    | `sdd-init`, fila «How it is tested» | humo `i1`: init con código sobre `hojas` con `playwright.config.ts` |
    | `migrations/v3.0.0.md`, fila «Testing» | no se mide: repite la lista de la plantilla y la fila de la init; la batería de `sdd-upgrade` corre antes de la release (0152) |
    | `sdd-tdd`, puntero a `writing-e2e.md` | r1, GREEN |
    | `writing-e2e.md` | r1 (esperas y tecleo) y `r3` (triaje), GREEN; r2 como control |
    | `sdd-implement`, «Visual check» | `r4`, solo RED: limpio, la regla se recortó (enmienda) |
    | `frontend-verification.md`, la frase del script | no cambia (enmienda) |

12. **Una pieza entra, otra sale**: no entran el hueco de «Dónde se prueba» (decisión 2) ni la regla de los scripts (decisión 9). No sale nada, porque lo que entra es un elemento omitido (Art. II): campos que faltaban en la plantilla y una referencia que el implementador no tenía.
- `sdd capability merge` sobre una copia de `.docs/sdd`: «sustituido «`operations.md` dice cómo se ejecuta y se verifica el proyecto»» y tres «añadido», sin rechazos (tras la enmienda de la pieza (c)); `sdd capability check`: «Capacidades válidas: 20»
- Política de modelos: sin revisores de spec · revisión final: Spec opus+high, Código sonnet+high, Arquitectura no · sujetos Sonnet, de 2 en 2 · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- Partir la 0180 en tres: 0180, 0207 (`parent: 0180`: (d), (e), (h) e (i)) y 0208 (`parent: 0180`, tras 0207: (f), el antiguo B14, `startEnvironment` y la redacción de la 0060) — «Si al arrancarla pasa del umbral de partir, se parte (es grande)»
- Sin skill propia: las piezas van a `operations.md` §Testing, a «Dónde se prueba», a `sdd-implement`, a `sdd-verify`, a `sdd-archive` y a una referencia — prompt de arranque, 2026-10-21
- Un E2E nuevo nombra un flujo core de `operations.md`; el resto baja de capa — prompt de arranque
- Retries: 0 en local, como mucho 2 en CI; timeouts por defecto salvo motivo escrito; nunca subirlos para tapar un test inestable: se clasifica la causa y va a `test.fixme` con su issue — prompt de arranque
- `operations.md` declara cómo se levanta todo, y cada test crea y borra sus propios datos — prompt de arranque
- La referencia incluye no teclear tras un cambio de foco o de celda sin esperar a un estado visible, y que `waitForTimeout` no es una espera, con el ejemplo de `typeInCell` de la 0223 — prompt de arranque
- RED previo a la spec, 4 sujetos Sonnet con un techo de 12 $ — «Sí, 4 sujetos, techo 12 $ (Recomendada)»
- El triaje de un test inestable se escribe aunque su RED salió limpio 4 de 4 (`r3` ×2, `r3b` ×2): excepción al Art. I por decisión del dev-lead, con la propuesta de recorte rechazada el 2026-10-21 — «No, mantenlo»

## Intent

Hoy el kit no dice qué merece un E2E ni cómo se escribe. En document-manager acabó con 15 ficheros y ~70 tests, uno por feature; diez de ellos esperan al API entre dos acciones del usuario, y los timeouts están subidos a 60 y 120 s. Así, un fallo de ~3 s tras copiar vivió tres releases (patch 0158), y en la 0223 la suite perdió la primera tecla tras cambiar de celda, sin que nadie lo viera hasta que una traza más rápida lo destapó. El dev-lead: «no probaban lo que deberían probar los test e2e, flujos de usuario!! los flujos core de la app … es crítico».

El éxito: un proyecto declara sus flujos core y la política de su suite en `operations.md`, y un E2E escrito con el kit espera solo a lo que el usuario ve. Se mide con r1: en el GREEN, 0 de 2 esperas a un estado interno entre dos acciones, 0 de 2 teclean sin esperar al editor y 0 de 2 suben un timeout. Fracasaría si la referencia hiciera que el agente escribiera un E2E para un comportamiento que no es de un flujo core (r2 sale del control).

## Scope

- Entra:
  - `skills/sdd-templates/templates/operations-template.md` §Testing: los campos de la decisión 4.
  - `skills/sdd-init/SKILL.md`, fila «How it is tested», y `skills/sdd-init/references/generation.md` si su línea de `operations.md` necesita nombrarlos (decisión 5).
  - `skills/sdd-upgrade/references/migrations/v3.0.0.md`, fila «Testing» (decisión 6).
  - `skills/sdd-tdd/references/writing-e2e.md`, nueva, y su puntero en `skills/sdd-tdd/SKILL.md` (decisión 7).
  - Nada en `skills/sdd-implement/` ni en `frontend-verification.md` (decisión 9, recortada).
  - `tests/AnchorTemplates.Tests.ps1`: los campos nuevos de §Testing.
  - `tests/WordBudget.Tests.ps1`: los topes de la tabla de abajo.
  - Las campañas en `red/` y `green/` de esta carpeta, y su evidencia en `tests/e2e-writing-red.md` y `tests/e2e-writing-green.md`.
  - El roadmap: la 0180 cerrada y las filas de deuda que salda en parte, con lo que queda para la 0207 y la 0208.
- No entra:
  - «Dónde se prueba» de la spec (decisión 2).
  - El eje Código de `sdd-verify`, el presupuesto y las tandas del cierre, el gate sin interruptores y el entorno levantado por la sesión: la 0207.
  - La validación del dev, el antiguo B14, `validation.startEnvironment` y la redacción de la 0060: la 0208.
  - Mover `frontend-verification.md` fuera de `sdd-start-feature`: la 0206.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «Para verificar no escribes una suite de specs E2E nueva: basta un script de capturas o el MCP» | `skills/sdd-start-feature/references/frontend-verification.md:51` | no cambia: la decisión 9 se recortó por enmienda |
| «Testing: tal cual» en la tabla de la migración | `skills/sdd-upgrade/references/migrations/v3.0.0.md:41` | decisión 6; `capabilities/migration.md` no la cita (buscado «tal cual») |
| `## Testing` de `operations-template.md` gana campos | `operations-template.md:10-19`; `capabilities/onboarding.md`, «`operations.md` dice cómo se ejecuta y se verifica el proyecto»; `tests/AnchorTemplates.Tests.ps1:81` | delta `MODIFIED`; el test, en el Scope |

- Filas que implementa: la 0180 → `roadmap.md` (su fila y los «tras» de la 0198 y la 0152, que ya nombran la 0207 y la 0208). Salda en parte, y quedan abiertas con lo que les falta: «Los E2E de la suite del cierre tienen carreras…» (pieza (k); queda (h), 0207), «La suite del cierre corre sobre servidores que no arrancó la sesión…» (pieza (j); queda (i), 0207), «Los E2E del agente esperan al estado interno antes de actuar…» (la regla de la referencia; queda la comprobación de la 0207 y el guion de la 0208) y «La validación del dev no tiene guion…» (el usuario del agente; queda la 0208). Ninguna aparece en `capabilities/` ni en `skills/` (buscados sus títulos).

## Approach

- Los campos E2E van como un bloque de `## Testing`, con su ayuda «solo si el proyecto tiene E2E»: no se crea una sección nueva, y la cabecera de `operations.md` que comprueba `AnchorTemplates.Tests.ps1` no cambia.
- La referencia sigue la forma de `writing-good-tests.md`: cuándo se carga, las reglas con un ejemplo cada una y la tabla de racionalizaciones. Es una disciplina (el agente sabe esperar bien y no lo hace bajo presión), así que lleva prohibición y racionalizaciones (Art. II).

## Dónde se prueba

- Los campos de §Testing: `AnchorTemplates.Tests.ps1`, como «§Testing pide <_>».
- La init que los propone: humo `i1` con Sonnet sobre el molde `hojas` con `playwright.config.ts` (`retries: process.env.CI ? 2 : 0`, `timeout: 60_000`), como los humos de `sdd-init`.
- La referencia y su puntero: r1 ×2 y `r3` ×2 (un E2E que falla 1 de cada 5 pasadas: se le pide dejar la suite en verde), RED y GREEN; r2 ×2 como control, en el GREEN.
- El script desechable: `r4` ×2, solo RED (limpio 2 de 2; la regla se recortó).

## Términos y ADR

- Términos resueltos: **flujo core** — un recorrido de punta a punta que el usuario hace para lo que el producto existe («emitir una factura»), declarado en `operations.md` con su test; se evita «flujo crítico» y «happy path». **Usuario del agente** — el usuario de test con el que corren los E2E y las sondas del agente, distinto del de la persona que valida.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `onboarding`

**MODIFIED — `operations.md` dice cómo se ejecuta y se verifica el proyecto**
- GIVEN `operations-template.md`
- WHEN se lee
- THEN tiene `## Comandos`, `## Testing`, `## Frontend` y `## Entornos`, y no tiene tabla de versiones ni «Decisiones abiertas»
- AND `## Testing` pide cada suite con su comando y su duración, el comando de lo afectado, el gate de cierre y el de merge, cómo entra el agente en la aplicación y si los tests usan el motor de producción
- AND `## Frontend` tiene los campos URL, Detector, Viewports, Runner E2E, Acceso, Temas, Pantalla de referencia y Skills de apoyo
- AND `## Testing`, solo si el proyecto tiene E2E, pide los flujos core con su test, el presupuesto de la suite E2E, los retries, los timeouts, el entorno de la suite y cómo crea y borra cada test sus datos; y cómo entra el agente nombra el usuario del agente, distinto del de la persona que valida

**ADDED — La init propone los campos E2E desde el código**
- GIVEN una init con código de un repo con `playwright.config.ts` (`retries: process.env.CI ? 2 : 0`, `timeout: 60_000`) y `e2e/` con `0012-sum-row.spec.ts`, `0015-export-pdf.spec.ts` y `0018-invoice-status.spec.ts`
- WHEN la entrevista llega a cómo se prueba
- THEN propone como candidatos a flujo core los de esos tres ficheros, y pregunta cuáles lo son
- AND `operations.md` sale con `Retries: 0 en local; 2 en CI`, `Timeouts: 60 s por test, sin motivo escrito` y `Presupuesto E2E: pendiente`
- AND en un proyecto sin E2E no pregunta nada de esto y §Testing no lleva esos campos

### Capacidad: `feature-flow`

**ADDED — Un E2E espera solo a lo que el usuario ve**
- GIVEN una task que escribe el E2E de «copiar A1 con Ctrl+C, clic derecho en B1, «Pegar», B1 muestra 4321», en una app que guarda la copia en el servidor y monta el editor de celda unos cientos de ms después de Enter
- WHEN el implementador escribe el test
- THEN entre Ctrl+C y el clic derecho no hay ninguna espera al API ni a un estado interno
- AND tras Enter espera a que el editor tenga el foco antes de teclear «4321»
- AND no usa `waitForTimeout` ni cambia retries o timeouts
- AND una espera a un estado interno entre dos acciones lleva su motivo en un comentario, y «sin esperarlo, la app no tendría el dato» no cuenta como motivo

**ADDED — Un E2E inestable no se tapa con retries ni timeouts**
- GIVEN un E2E que falla 1 de cada 5 pasadas con `Timeout 5000ms exceeded` en un `toHaveText`, y la petición de dejar la suite en verde
- WHEN el agente lo arregla
- THEN repite solo ese test con `--repeat-each`, dice qué causa encontró (carrera del test, carrera de la app, entorno o datos compartidos) y la arregla
- AND si no la arregla, lo marca con `test.fixme()` y el enlace a su issue
- AND no sube `retries` ni ningún timeout, ni en el test ni en `playwright.config.ts`

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-tdd`, `SKILL.md` | 1700 / 1700 | 0 | 1750 (puntero de ~25 palabras) |
| `sdd-tdd`, total | 3011 / 3100 | 89 | 4000 (`writing-e2e.md`, ~900 palabras) |
| `sdd-implement`, `SKILL.md` | 9483 / 9483 | 0 | sin cambio (decisión 9, recortada) |
| `sdd-implement`, total | 13249 / 13249 | 0 | sin cambio |
| `sdd-templates`, total | 15300 / 15300 | 0 | 15560 (~220 palabras en `operations-template.md`) |
| `sdd-init`, `SKILL.md` | 2365 / 2400 | 35 | 2460 (~80 palabras en la fila) |
| `sdd-init`, total | 2961 / 3000 | 39 | 3060 |
| `sdd-start-feature`, total | 11436 / 11464 | 28 | sin cambio |
| Kit entero | 88024 / 88100 | 76 | 89500 |

## Enmiendas

- 2026-10-21 — Sale el requisito «Los scripts de verificación no entran en el repo» y la decisión 9 (pieza (c)): ni `sdd-implement` ni `frontend-verification.md` cambian, y no se lanza el GREEN de `r4` — RED limpio 2 de 2: los dos sujetos de `r4` escribieron su script fuera del repo (`%TEMP%`) y no lo commitearon (Task 3) — aprobada: «Recorta (Recomendada)»

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-21 | aprobada (opción «Apruebo») |
