---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: feature
id: 20261030-112923-feature-0224-coherence-pass-and-cost-slot
task: 0224
mode: full
date: 2026-10-30
---

# Ticket para el kit — feature 0224: la regla del entorno en la clasificación y el hueco «Previsión de coste»

## Contexto

- Carril y modo: feature full, perfil `delegate`, validación en campo, Native
- Skills del kit usadas: `sdd-propose`, `sdd-start-feature`, `sdd-implement`, `sdd-worktrees`, `sdd-verify`, `sdd-parallel-agents`, `sdd-archive`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit, una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 (eje Spec y re-revisión), Sonnet 5.5 (eje Código y 22 sujetos)
- Coste en reloj: 0,96 h frente a 0,8 h estimadas
- Coste en tokens: 12,93 $ de sesión (hilo 9,09 $, subagentes 3,84 $) más 7,21 $ de sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Tres frentes con casos de campo salieron limpios con un sujeto en un molde pequeño, y no se sabe si eran falsos negativos

- **Qué pasó**: el prompt pedía un sujeto RED por frente antes de la spec y sacar el que saliera limpio. `co1` (`ADDED` contra un vivo, dos casos), `co2` (topes en el repaso, tres casos) y `co3` (test movido a una tarea con caché, un caso) salieron limpios con n = 1. Sus filas de deuda no se saldaron y la fila perdió tres de sus arreglos. Los moldes tienen una capacidad de 7 requisitos y un solo test de topes; los casos de campo salieron con capacidades de cientos de líneas.
- **Fuente**: `spec.md` de la 0224, decisiones 1 y 2; `tests/batteries/sdd-propose/battery.md`, filas `co1`-`co3`; `.docs/sdd/capabilities/feature-flow.md`, más de 600 líneas
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Un baseline limpio no reproduce los fallos de sesiones largas» y «Un RED limpio con n=2 puede ser suerte»
- **Por qué el kit no lo evitó**: la regla de reproducir antes de la spec no dice cuánta muestra pide un frente con varios casos de campo, ni qué tamaño de molde
- **Coste**: 1,04 $ de sujetos y tres filas de deuda abiertas a la espera de otro caso; sin coste de parada
- **Propuesta**: al triar, un frente que el RED saque con molde pequeño se reabre con su siguiente caso de campo, sin otra ronda de RED; sin frase nueva en ninguna skill
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una spec con `ADDED` contra un requisito vivo en una capacidad de más de 300 líneas WHEN un sujeto hace el repaso de coherencia THEN nombra el requisito; si falla, la frase «For each `ADDED` or `MODIFIED`» entra

### 2. El veredicto de `battery.mjs` no sirvió en ninguna tanda: salió verde con un fallo de conducta y rojo con la conducta correcta

- **Qué pasó**: `ws3 · 2/2 · verde` en la primera ronda con `ws3-2` corriendo `node --test` antes de instalar (`ERR_MODULE_NOT_FOUND`). `co2 · 0/1 · rojo` y `co4 · 0/2 · rojo` con la conducta correcta, porque el lanzador imprimió `no se guarda co3-1.tools.txt: el stream sigue en …` y no dejó `tools.txt` ni `spec-new.md`. Hubo que escribir cuatro scripts para leer los streams, y esos scripts ya no existen.
- **Fuente**: salida de `node tests/headless/battery.mjs run` en las tandas `red`, `green`, `green2` y `final` de la 0224; `green2/green2/out/` de su carpeta
- **Dónde en el kit**: `tests/headless/battery.mjs` y lo que escribe `.leak` en `tests/headless/lib.mjs`; causa del `no se guarda` no localizada
- **Por qué el kit no lo evitó**: el veredicto de la puerta no mira la conducta, y la columna `Falla si…` con `tools:` solo existe en las filas que la escriben
- **Coste**: ~15 min del hilo, y la evidencia de `co2`, `co3` y `co4` sin versionar
- **Propuesta**: que `WS` lleve una fila `tools:` con el orden, y que `battery.mjs` diga la causa del `no se guarda`
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN `ws3` con `node --test` antes de `pnpm install` WHEN `battery.mjs verdict` lo califica THEN sale rojo; y un sujeto sin `tools.txt` sale «sin evidencia», no rojo

### 3. `AskUserQuestion` tapa el último mensaje, y el dev-lead no pudo leer lo que le preguntaba

- **Qué pasó**: el gate de la spec salió con `AskUserQuestion`, como pide el paso 4. El dev-lead lo rechazó para aclarar y dijo: «lo de askuser tapa el ultimo mensaje». Quitó la regla de su `CLAUDE.md` global, y el gate se repitió en prosa. Las skills siguen pidiendo esa herramienta.
- **Fuente**: esta sesión; `skills/sdd-propose/SKILL.md` paso 4 («The gate question is an `AskUserQuestion` call, not prose»)
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` pasos 2 y 4; `skills/sdd-grilling/SKILL.md`
- **Por qué el kit no lo evitó**: la forma se midió sobre sujetos (`tests/sdd-start-feature-0146-red.md`, G1), que no ven el diálogo; nadie miró qué tapa
- **Coste**: una parada del dev-lead
- **Propuesta**: decidirlo en `sdd-config`, sin alargar el paso: con un valor local, el gate va en prosa con las mismas opciones numeradas
- **Verificada**: sí — el gate en prosa, con tres opciones numeradas, se contestó con «Apruebo»
- **Criterio de aceptación**: GIVEN el dev-lead con la preferencia en `sdd-kit.local.json` WHEN `sdd-propose` llega al gate THEN pregunta en prosa con las opciones y no llama a `AskUserQuestion`

### 4. El saldo de palabras obligó a recortes que la spec aprobada no nombraba

- **Qué pasó**: la decisión 10 nombraba lo que pagaba el hueco, con una previsión a ojo. Al medir, `spec-template.md` subía 51 palabras y hubo que quitar tres ayudas más y una frase, más dos incisos en `sdd-propose`. Los ejes Spec y Código lo marcaron como Important, y la spec recibió una enmienda sin aprobar.
- **Fuente**: `spec.md` de la 0224, decisión 10 y «Enmiendas»; `tasks.md`, «Rulings»
- **Dónde en el kit**: `skills/sdd-templates/templates/spec-template.md`, «Topes de palabras»: la tabla mide el tope, no el saldo que pide la regla 6 de `CLAUDE.md`
- **Por qué el kit no lo evitó**: nada pide escribir el texto nuevo y contarlo antes de presentar la spec
- **Coste**: 2 Important de la revisión final, una enmienda y una medición final de 1,16 $, compartida con el hallazgo 5
- **Propuesta**: en un arreglo de ticket, «Lo que se retira» lista el recorte que paga cada línea nueva, contado sobre el texto propuesto
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una spec que añade una sección a una plantilla con saldo igual WHEN se presenta THEN «Lo que se retira» suma al menos las palabras nuevas

### 5. Una regla de orden en prosa falló dos rondas, y la medición quedó sobre un texto anterior

- **Qué pasó**: «before running the code… prepare the environment» y «the first command that runs… goes after Step 2» dejaron a `ws3-2` en rojo. Pasó con «check first, in a command of its own, whether dependencies are installed». El eje Spec señaló que `ws1` y `ws2` solo habían corrido con la primera frase, y hubo que medir otra vez; el techo de 4 sujetos cortó esa medición a n = 1.
- **Fuente**: `green/`, `green2/`, `green3/` y `final/` de la carpeta de la 0224; `tasks.md`, «Rulings»
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Work the steps», y `.docs/sdd/constitution.md`, Art. II
- **Por qué el kit no lo evitó**: la regla existía (comportamiento condicional → predicado observable) y escribí primero la frase del plan; el aviso de `tech-stack.md` de lanzar control tras editar la guía tampoco lo apliqué
- **Coste**: 2,81 $ de las dos rondas de REFACTOR, una más de lo previsto
- **Propuesta**: una regla sobre el primer comando se mide con una ronda de REFACTOR de todos los escenarios que la alcanzan, no solo del que falló
- **Verificada**: sí — `ws3` 2/2 limpio en `green3`, `tools.txt`
- **Criterio de aceptación**: GIVEN una regla reescrita en el REFACTOR WHEN cierra su ronda THEN cada escenario de su fila de la rúbrica corrió con el texto final

### 6. El hueco de coste admite una fila a cero, y deja pasar lo que motivó el hueco

- **Qué pasó**: `co4-1` y `co4-2` rellenan las cinco filas con «Controles 0» y «Medición 0», con motivo. Esta misma feature necesitó controles y medición tras la revisión final.
- **Fuente**: `co4-1` de la tanda `final`, leído del stream; `walkthrough.md`, §2
- **Dónde en el kit**: `skills/sdd-templates/templates/spec-template.md`, «Previsión de coste»
- **Por qué el kit no lo evitó**: el hueco pide la fila, no un suelo
- **Coste**: ninguno aún; una parada por dinero si se repite
- **Propuesta**: que la fila de medición parta de un sujeto por escenario que la revisión pueda cambiar, si otra spec lo vuelve a dejar a cero
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una spec de una skill con batería WHEN escribe la previsión THEN la medición lleva al menos un sujeto

## Lo que hice por iniciativa propia

- La 0255 tomó su RED de los streams de la 0253, a coste cero, en vez de lanzar sujetos.
- `s1` pasó a un paso propio, `control-spec`, para poder lanzarlo solo: el paso `control` lanzaba siete escenarios.
- Los GREEN corrieron sobre una copia congelada del kit, y seguí editando el árbol mientras tanto.

## Funcionó, no tocar

- Los ejes Spec y Código encontraron cosas distintas: el Spec, que la medición era de un texto anterior; el Código, un comentario que citaba un fichero.
- La línea `Política de modelos:` confirmó el paralelo sin otra pregunta.
- El RED antes de la spec ahorró escribir tres reglas sin fallo reproducido.

## Menores

- El hook del dev-lead bloqueó un `git push --force-with-lease`: publiqué el cierre antes de ver que faltaban changelog y estimation-log, y quedó un commit de cierre más — `skills/sdd-archive/SKILL.md` paso 5.
- Un `\r\n` escrito desde un heredoc rompió un script: `tech-stack.md:44` ya lo avisa, la regla existía y no la apliqué — `.docs/sdd/tech-stack.md`.
- El aviso de versión salió en sujetos del molde: «esta sesión carga el kit 2.3.4 y el proyecto pide el 3.0.0», ruido en `co1`, `co2` y `co4` — `putKitMarker` en `tests/headless/lib.mjs`.
- `SPEC_DIR` con `/red` da `red/red/out`, porque `battery.mjs` añade la fase — `tests/headless/battery.mjs`.
- La medición final usó `SUBJECT_CAP=4` sobre escenarios con n = 2, y cortó sin elegir cuáles — `tests/headless/campaign.mjs`.
