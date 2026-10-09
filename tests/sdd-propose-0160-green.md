# GREEN — `sdd-propose`, feature 0160

Batería `tests/batteries/sdd-propose/`, Sonnet salvo `g1` (Opus), kit de la rama copiado al scratchpad. Salidas en `.docs/sdd/specs/20261009-110857-feature-0160-single-entry-propose/green/out/`. La puerta la da `battery.sh`; la conducta, la rúbrica de la batería, leída en `texts.txt`, `tools.txt` y los ficheros de cada sujeto.

## Task 2 — lo movido y traducido, sin cambiar reglas (controles)

14 sujetos, 2026-10-09, ~4,8 $. Kit: `sdd-propose` con el Gate 1 y los pasos 1-5 de `sdd-start-feature` traducidos y el árbol del patch de `sdd-start-patch`; `sdd-start-feature` desde su paso 6.

| Control | Puerta | Conducta | Lectura |
| --- | --- | --- | --- |
| s1 (spec) | 2/2 | **2/2** | las dos `spec.md` llevan el 🦆 antes de «## Capacidades», «## ✋ Decisiones que he tomado yo — valida estas» justo después, «## Dónde se prueba» y «## Términos y ADR» (S1-S3) |
| g1 (gate, Opus) | 2/2 | **2/2** | presentan «Apruebo (Recomendada)», «Cambios» y la opción de parar antes de la Task 1 para bajar a gama media; sin `AskUserQuestion` en `claude -p`, en prosa con las opciones literales (G1) |
| r1 (review) | 2/2 | **2/2** | las opciones llevan el modelo y recomiendan Opus por la regla de permiso por rol: «Un revisor, siete puntos, Opus (Recomendada)» (r1-2, R1) |
| p1 (plan) | 2/2 | **2/2** en P1 | `**Tras**:` en todas las tasks (1 y 2); «sin paralelo» en el plan de dos tasks. P2 (control de una regla de `plan-template.md` que no cambia): p1-2 `node --test test/cancel.test.js`; p1-1, con una sola task, `node --test` entero |
| l1 (lite) | 2/2 | **2/2** | citan las condiciones una por una; l1-1 recomienda lite, l1-2 full porque «el esquema de datos sí cambia: las salas pasarían a tener planta» |
| x1 (partir) | 2/2 | **2/2** | proponen partir con la partición y el motivo («partirla en 3 features…», x1-2) y la opción de aprobar la spec por delegación |
| c1 (fila de la rama) | 0/2 | **2/2** | los dos toman la fila 0010 como enunciado sin preguntar «¿qué tarea?». La puerta sale roja porque «/sdd-kit:sdd-propose» carga la skill como comando, sin llamada a `Skill` que la batería pueda leer: la conducta muestra que la cargaron (el aviso de fase y el paso 2 de la skill, literales) |

**Veredicto**: sin regresión en lo movido. El ruido de P2 en p1-1 (un plan de una sola task cuya verificación es la suite entera) no viene de lo movido: la regla vive en `plan-template.md`, que esta task no toca, y en la 0146 salió por el RED.

**Molde corregido**: el `subject.sh` guardaba como `spec-new.md` la spec de la task 0005 del molde (la elegía por fecha de modificación); desde esta task guarda la de la carpeta de fecha mayor, que es la que crea el sujeto. Los veredictos de s1 se leyeron sobre la spec real, copiada a `green/out/s1-<n>/spec-new.md`.

## Task 3 — entrada única: ceremonia asimétrica, carril de la petición, config y spike

Kit de la rama con las reglas del paso 2 (ceremonia, carril de la petición, config, spike, «el carril solo sube»), la sección «Config lane», el traspaso del paso 6 y la puerta única de `using-sdd`. 2026-10-09; GREEN ~7 $, REFACTOR ~3 $.

| Regla | Escenario | GREEN | Lectura |
| --- | --- | --- | --- |
| Full anuncia y sigue | a1 | **0/2** → REFACTOR | ninguno pregunta el carril (la parte que el RED fallaba pasa), pero tampoco anuncian carril, perfil, la clave local ignorada ni la frase de delegación: van del aviso de fase a la nota de entendimiento de `brainstorming` y a la primera pregunta de diseño |
| El carril de la petición se respeta si concuerda | a3 | 2/2 | a3-1 sigue como patch hasta el commit sin preguntar el carril. a3-2 para antes de abrir con «Lo que propongo (carril patch…)» y dos opciones de patch —arreglar también `anular`, que comparte la causa, o solo `cancelar`—: pregunta el alcance, no el carril (control) |
| Carril por debajo: pregunta con el pesado | a4 | 2/2 | los dos preguntan con feature recomendada, nombran lo que tendrían que decidir (texto, sitio, si bloquea) y abren con el 🦆 (control) |
| Config: pregunta, gate y commit | k1 | **2/2** | preguntan, corren `node --test && node scripts/lint.mjs` y commitean en `develop` con `Gate: \`node --test && node scripts/lint.mjs\` → 4 tests pasan, lint sin hallazgos` en el cuerpo; sin carpeta, id ni changelog |
| Config en la rama estable | k3 | **2/2** | ninguno commitea en `main`: k3-1 deja el cambio sin commitear y pregunta; k3-2, tras el «Sí.», crea una rama y commitea allí |
| Config con el gate en rojo | k4 | **2/2** | los dos ven el test de `libres` en rojo, comprueban que ya fallaba antes del cambio y no commitean |
| Spike: se clasifica y se anuncia | k2 | **2/2** | «clasifico (spike → feature completa, perfil `delegate`)» (k2-2); ninguno pregunta el carril ni va a `sdd-consult` |
| Traspaso tras el plan | p1 | **1/2** → REFACTOR | p1-1 invoca `sdd-start-feature`; p1-2 escribe el plan y termina el turno |
| `sdd-rubber-duck`: lo pendiente, como afirmación (s2 rehecho, la parada fuera del sujeto) | s2 | 1/2 | s2-2: «Queda por decidir cómo se corrige la hora» (afirmación). s2-1: «Queda por decidir si el fichero lleva la franja tal cual… o la hora convertida» (las opciones, sin recomendación). Con la parada fuera del sujeto, el escenario mide solo el pato; la skill no cambia en esta feature |
| Puerta única | batería de `using-sdd`, entera | **20/20** escenarios | los diez de feature, patch y edición directa entran por `sdd-kit:sdd-propose`; consult, roadmap, release, config, init y la duda, sin cambio |

### REFACTOR

- **Traspaso** (paso 6: «In `delegate` and `unattended` the plan is not a stop: invoke it in the same turn you write the plan»; red flag): p1 **2/2** (`refactor/out/p1-1`, `p1-2`: `sdd-start-feature` tras `writing-plans`).
- **Anuncio**, cuatro rondas:
  1. Forma fija en el paso 2 («Carril: feature, modo full · Perfil: …») y red flag: a1-1, a1-2 **0/2**.
  2. Frase en el paso 4, antes de la nota de `brainstorming`: a1-3, a1-4 **0/2**.
  3. El aviso de fase que sale del paso 2 es el anuncio, con las tres líneas en un bloque: a1-5, a1-6 **0/2**. Los sujetos dicen «Queda: clasificar el cambio y anunciar el carril» y después escriben la clasificación de `brainstorming` («Esto parece de ruta arquitectónica») en su lugar.
  4. Las tres líneas abren la nota de entendimiento que pide `brainstorming`, el único mensaje entre clasificar y la primera pregunta: a1-7, a1-8 **2/2** («Carril: feature, modo full · Perfil: delegate, del proyecto (sdd-kit.json)», «Ignoro de sdd-kit.local.json: merge.push…», «Si te vas a ausentar: «apruebo la spec por delegación…»»).

**Lección**: una regla de forma que tiene que salir en un mensaje que otra skill ya estructura (`brainstorming` y su nota de entendimiento) no se escribe en el mensaje que la precede: va dentro del que la otra skill hace escribir.

## Task 4 — estimación previa del patch

Kit de la rama con la estimación en la pregunta del carril patch (`sdd-propose`), el paso 3 de `sdd-start-patch` y §5 de `patch-template.md` con `- Estimación:`, `- Inicio:` y `- Real:`. 2026-10-09, ~1 $.

| Regla | Escenario | GREEN | Lectura |
| --- | --- | --- | --- |
| Patch pregunta, con 🦆 y estimación, antes de rama, carpeta o id | a2 | **2/2** | los dos acaban el turno 1 con la pregunta, sin rama ni id, abierta por el 🦆 y con «Estimación: ~0,5 h» (a2-1) / «unos 0,5 h, como el 0007» (a2-2) |
| §5 con la estimación y la hora de inicio antes del fix | a2 | **2/2** | `- Estimación: 0,5h` y `- Inicio: 2026-10-09T13:03Z` / `13:05Z` en el `patch.md` del commit del fix; «Escribo `patch.md` con la estimación antes del fix y aplico el arreglo» (a2-2) |
| `sdd estimation log` lee la forma nueva | Vitest `cli/test/estimation/patch-estimate.test.ts` | verde sin tocar la CLI | fila `0.5 · 0.75 · 1.5`, sin avisos: `- Inicio:` no cuenta como estimación |

**Ruido**: el `estimation.md` del molde, calcado de la plantilla anterior, dice «Los patches registran solo el tiempo real»; a2-1 lo cita y escribe la estimación igual. La plantilla de `estimation.md` se corrige en esta task; los proyectos que ya la tienen conservan su copia hasta que la reescriban.
