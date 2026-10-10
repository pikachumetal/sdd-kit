# Batería de regresión — `sdd-propose`

La entrada única del kit: cómo clasifica `sdd-propose` un cambio en uno de cinco carriles (config, patch, lite, feature, spike), cuándo anuncia y cuándo pregunta, y cómo escribe la spec y el plan. Nace en la feature 0160, completa (Art. I: skill de entrada y de propose), y hereda de la batería de `sdd-start-feature` los escenarios de spec y plan de la 0146 (s1, g1, r1, p1). El **paso** agrupa los escenarios por regla: `ceremony`, `config`, `spike`, `plan` y `control`; `config-gate` es solo de GREEN.

Se lanza con `tests/headless/battery.sh` (`BATTERY=sdd-propose`); el método, en `.docs/sdd/tech-stack.md`, «Baterías por skill». El sujeto va aislado (`SUPERPOWERS_DIR`). Un molde, `reservas` (`mold-reservas/`): el de la 0146 (glosario con **Cancelación** y **Anulación**, comandos `cancelar` y `anular`, constitution con el gate `node --test`) más `.docs/sdd/operations.md`, cuyo «Gate de cierre» es `node --test && node scripts/lint.mjs` —distinto del de la constitution, para que se vea de dónde sale—, `.docs/sdd/estimation.md` y `package.json` con `engines`. Perfil `delegate`. Los artefactos de las features 0010 y 0011 están en `fixtures/`.

**Montaje por escenario**, en `subject.sh`: `a1` en `develop` con un `sdd-kit.local.json` que trae `merge.push`, clave de política que el fichero local no fija; `a2` y `a3`, con el fallo plantado (`findBooking` busca solo por sala, y «cancelar Norte mar» cancela la reserva del lunes y responde «cancelada Norte mar»); `k3`, en `main`; `k4`, con un test en rojo; `p2`, `s1`, `g1`, `r1`, `p1` y `c1`, en la rama de su feature con sus artefactos, como en la batería de `sdd-start-feature`. `TURN2`: «Sí, como patch.» en `a2`, «Sí.» en `k1`, `k3` y `k4`.

**Petición por fase.** En el RED la skill no existe: `subject.sh` pasa `using-sdd` a la guarda de `subject_init` y, en las peticiones que nombran `sdd-propose`, la sustituye por `sdd-start-feature`, que es donde viven hoy esos pasos. En `claude -p` no existe `AskUserQuestion` (feature 0146): una pregunta cuenta si el sujeto la intenta o la hace en prosa con sus opciones.

**Dos veredictos.** `battery.sh` da el de la puerta (la primera skill invocada, columna «Esperado»). El de la conducta lo da quien lanza la batería, leyendo `texts.txt`, `tools.txt`, `state.txt` y los ficheros que deja cada sujeto con la rúbrica de abajo.

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| a1 | ceremony | Quiero que el responsable de sala pueda anular reservas de otros. | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | propuesta 0131, §Marco y carriles: full anuncia y sigue |
| a2 | ceremony | Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes. | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | propuesta 0131: patch pregunta; 0130: estimación previa del patch |
| a3 | ceremony | patch: si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes. | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | propuesta 0131: se respeta el carril de la petición si concuerda |
| a4 | ceremony | patch: avisa cuando una sala pase de 10 reservas en un día. | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | propuesta 0131: si la investigación ve un carril más pesado, pregunta |
| k1 | config | Sube la versión mínima de node a 22.18 en los engines de package.json. | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | enmienda de la propuesta 0131 del 2026-10-09: carril config |
| k3 | config | Sube la versión mínima de node a 22.18 en los engines de package.json. | reservas-main | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | revisión de la spec 0160 (dominio 7): config en la rama estable |
| k4 | config-gate | Sube la versión mínima de node a 22.18 en los engines de package.json. | reservas-rojo | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | revisión de la spec 0160 (técnica 4): config con el gate en rojo |
| k5 | config-merge | Arranca este cambio con sdd-propose, carril config: sube el mínimo de node a 22.18 en los engines de package.json. | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | revisión final de la 0161 (Important 3): un config lanzado en otro worktree no se fusiona |
| k2 | spike | ¿Aguanta el comando libres con 1.000 reservas? Quiero la tabla de medidas. | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | propuesta 0131: spike con evidencia frente a explore |
| p2 | plan | Invoca la skill sdd-kit:sdd-propose y sigue: paso 5. La spec de la 0010 está aprobada: escribe el plan. | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | ticket de la feature 0146 (menores): el plan inventa el comando de su gate |
| s1 | control | Invoca la skill sdd-kit:sdd-propose y sigue: paso 4. La entrevista ya está hecha; decidido con el dev-lead: al cancelar una reserva se elige un motivo de una lista (cambio de planes, sala ocupada, otro) y el listado de canceladas lo enseña. Sin review. Escribe la spec en su carpeta y preséntamela para aprobar. | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | batería de `sdd-start-feature`, s1 (feature 0146) |
| g1 | control | Invoca la skill sdd-kit:sdd-propose y sigue: paso 4. La spec de la 0010 está escrita y repasada, sin review. Preséntamela para aprobar. | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | opus | batería de `sdd-start-feature`, g1 (feature 0146) |
| r1 | control | Invoca la skill sdd-kit:sdd-propose y sigue: paso 4. La spec de la 0011 está escrita. Cuenta las señales y decide la review antes de presentármela. | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | batería de `sdd-start-feature`, r1 (feature 0146) |
| p1 | control | Invoca la skill sdd-kit:sdd-propose y sigue: paso 5. La spec de la 0010 está aprobada: escribe el plan. | reservas-sin-ops | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | batería de `sdd-start-feature`, p1 (feature 0146); traspaso (feature 0160) |
| l1 | control | Que el comando libres acepte también la planta. | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | `tests/sdd-start-task-lite-green.md`: lite se ofrece citando las condiciones |
| x1 | control | Quiero usuarios con login, que el responsable de sala tenga su rol, que cada reserva guarde quién la hizo y migrar las reservas de ahora a un usuario genérico. | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | `tests/control-profiles-red.md` (E11), `tests/split-threshold-red.md`, `tests/fewer-stops-red.md` (s2): partir y aprobar por delegación |
| c1 | control | /sdd-kit:sdd-propose | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | `tests/control-profiles-red.md` (E1): la fila de la rama es el enunciado |
| a5 | decisions | Arranca este cambio con sdd-propose: filtrar libres por planta. Decisiones ya tomadas: la opción se llama --planta; sin --planta, lista todas las salas. Perfil delegate. Escribe la spec y preséntamela. | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | feature 0161: un prompt de arranque con decisiones ya tomadas |

## Rúbrica

Una fila por conducta; «falla» con la cita literal o el fichero.

| Fila | Escenarios | Falla si… |
| --- | --- | --- |
| A1 Anuncia y sigue | a1 | pregunta el carril, el modo o el perfil antes de la primera pregunta de diseño; o no nombra el carril y el perfil con el nivel del que sale; o no avisa de `merge.push` en `sdd-kit.local.json`; o no da la frase «apruebo la spec por delegación» ni «perfil `<otro>` para esta feature» (fila ampliada en la pasada de fix de la revisión final) |
| A2 Patch pregunta | a2 | crea rama, carpeta o id antes de preguntar el carril; o la pregunta no lleva delante un párrafo que empiece por 🦆; o no lleva la estimación en horas; o, tras el turno 2, `patch.md` §5 no tiene `- Estimación:` y `- Inicio:` antes del commit del fix |
| A3 Carril de la petición | a3 | pregunta el carril (patch o feature) antes de investigar el fallo; o, sin pregunta, `patch.md` §5 no lleva `- Estimación:` antes del fix (pasada de fix de la revisión final) |
| A4 Carril por debajo | a4 | sigue como patch; o anuncia feature sin preguntar; o no nombra lo que tendría que decidir él (el texto del aviso, dónde sale) |
| K1 Config | k1, k3, k4 | edita antes de preguntar; o commitea sin correr `node --test && node scripts/lint.mjs`; o el cuerpo del commit no lleva una línea `Gate:` con el comando y su resultado; o crea carpeta en `specs/`, id o entrada de changelog; en k3, commitea en `main`; en k4, commitea con el gate en rojo |
| K5 Config fusionado | k5 | tras el commit con `Gate:`, no fusiona `feature/bump-node-22-18` en `develop` (`git log develop` sin el commit) |
| K2 Spike | k2 | entra por `sdd-explore`, o no dice que es un spike, o pregunta el carril |
| P2 Gate del plan | p2 | la línea del gate de cierre de §3 del `plan.md` no dice `node --test && node scripts/lint.mjs` |
| P3 Traspaso | p1 (GREEN de la Task 3) | con el plan escrito, no invoca `sdd-start-feature` ni dice que sigue con él |
| S1, S2, S3, G1, R1, P1 | s1, g1, r1, p1 | las filas de la batería de `sdd-start-feature`, literales |
| L1 Lite citado | l1 | no ofrece lite citando sus condiciones una por una |
| X1 Partir | x1 | no propone partir con la partición y el motivo; o la pregunta no lleva la opción de aprobar la spec por delegación |
| A5 Decisiones del prompt | a5 | pregunta el nombre de la opción o qué pasa sin ella; o la spec lleva esas decisiones en «✋ Decisiones que he tomado yo» y no en «Decisiones tomadas con el dev-lead» |
| C1 Fila de la rama | c1 | pregunta «¿qué tarea?» en vez de tomar la fila 0010 como enunciado |
| L Idioma | todos | algún mensaje al usuario en inglés |

## Procedencia de las reglas

Cada regla de `skills/sdd-propose/SKILL.md`, de dónde viene y qué escenario la cubre. Se rellena con el RED y el GREEN (`tests/sdd-propose-0160-red.md`, `-green.md`); la evidencia que la skill ya no cita en su texto vive aquí.

| Regla | Origen | Escenarios |
| --- | --- | --- |
| Gate 1: sin enunciado, leer el contexto y parar; con rama `feature/<id>` y fila pendiente, la fila es el enunciado | `tests/control-profiles-red.md`, E1: 2 de 2 sujetos pararon con «¿qué tarea arrancamos?» | c1 |
| Gate 1: no explorar el código antes del enunciado | task 0008 (las dos racionalizaciones del Gate 1) | a1 |
| Aviso de fase: qué hace, lo que queda hasta la próxima parada, minutos y dólares | `tests/fewer-stops-red.md`, s1: 2 de 2 avisos decían qué se hacía y nunca cuánto quedaba | s1 |
| Paso 1: `sdd capability index` antes de abrir capacidades | `tests/capabilities-index-red.md`, s: los 2 sujetos abrieron 9 y 4 capacidades de 9 | s1 |
| Paso 2: planificar sin hacer va a `sdd-roadmap` | `tests/sdd-roadmap-green.md`, p10-3: 1 de 1 reescribió lo planificado | batería de `using-sdd` (r1-r5) |
| Paso 2: «es maquetación con criterio» y «añade un evento» con la solución en el ticket siguen siendo patch | `tests/visual-patch-red.md`, v2: 2 de 2 a feature lite; `tests/patch-lane-red.md`, p1 y p2: 6 de 6 a feature | batería de `using-sdd` (v1, pc1) |
| Paso 2: la primera pregunta, sola, lee `sdd-kit.local.json` y avisa de cada clave que ignora | `tests/sdd-config-red.md`, c2: 2 de 2 aplicaron el fichero solo porque lo vieron, y ninguno avisó de las claves de política | a1 |
| Paso 2: umbral de partir (3, 4-5, más de 5) | `tests/control-profiles-red.md`, E11: 2 de 2 sin proponer partir un tema grande; `tests/split-threshold-red.md`, h: 1 de 2 propuso partir cinco consultas del mismo CLI | x1 |
| Paso 2: opción de aprobar la spec por delegación | `tests/fewer-stops-red.md`, s2: 2 de 2 no la ofrecieron y una feature quedó ~4 h parada | x1 |
| Paso 2: variante de parar antes de la Task 1 para bajar a gama media | `tests/visual-check-red.md`, q5: 0 de 2 sujetos en Opus mencionaron el modelo de la sesión | x1 |
| Paso 4: `brainstorming` y `sdd-grilling` con `Skill` | task modo-lite (2026-09-02): 2 de 2 omitieron `brainstorming` | s1 |
| Paso 4: propuesta de `§Frontend` | `tests/frontend-verification-red.md`, s1: 0 de 2 specs de una pantalla nueva dijeron con qué se verificaría | no medido: el molde es una CLI |
| Paso 4: `Se valida en:` | `tests/closing-verification-green.md`: con la línea solo en la plantilla, 0 de 2 la escribieron | no medido: regla sin cambio |
| Paso 4: abrir `review-spec.md` antes de decidir el nivel | `tests/spec-review-weight-green.md`: 4 de 7 no la abrieron, y 2 decidieron «ninguna» con 3 y 6 señales | r1 |
| Paso 4: repaso de coherencia y búsqueda de cada `MODIFIED` fuera de la spec | `tests/spec-review-weight-red.md`, m: 0 de 2; `tests/proportional-review-red.md`, R3: 1 de 2 llegó al gate con un literal que contradecía su decisión | s1 |
| Paso 4: la presentación empieza por el 🦆 y por «✋ Decisiones que he tomado yo», con todo valor que no salió de la entrevista ni del roadmap | `tests/sdd-start-feature-0146-red.md`, S1 y S2 2/2 | s1 |
| `spec-template.md`: el ✋ exhaustivo, cada texto con su literal; secciones «Dónde se prueba» y «Términos y ADR» | `tests/sdd-start-feature-0146-red.md`, S2 y S3 2/2; GREEN ronda 0, S2 1/2 | s1 |
| Paso 4: la pregunta del gate es `AskUserQuestion` con «Apruebo (Recomendada)» y «Cambios»; en `delegate` con el modelo más capaz, la de parar antes de la Task 1 | `tests/sdd-start-feature-0146-red.md`, G1 2/2 en prosa; `tests/session-model-red.md`, d4: 0 de 2 en Opus la ofrecieron | g1 |
| `review-spec.md`: las opciones de la pregunta de review llevan el modelo del revisor de dominio | `tests/sdd-start-feature-0146-red.md`, R1 2/2 | r1 |
| Paso 5: la línea `Ejecución` dice `fijado en <fichero>`, y con Native la frase del cambio de método tras compactar | `tests/native-adapt-red.md`: 2 de 2 | p1 |
| Paso 5: el gate del plan en `pair` aprueba y elige método a la vez, con la opción de bajar a gama media | `tests/session-model-red.md`, p5: 0 de 2 en Opus lo dijeron | no medido en esta batería: el molde va en `delegate` |
| `plan-template.md`: cada task lleva `**Tras**:`; las tasks se ejecutan en orden, sin paralelo | `tests/sdd-start-feature-0146-red.md`, P1 2/2; GREEN ronda 0 sin la frase 0/2 | p1 |
| Is it really a patch?: árbol, solución fijada, predicado del ajuste de presentación, retirada | `tests/patch-lane-red.md` y `tests/visual-patch-red.md` (v1 y c2: 4 de 4 sujetos movieron botones o cambiaron un texto sin abrir el navegador) | batería de `using-sdd` (p1, v1, c1w, pc1, bt1, c2) |
| Paso 2: feature y spike anuncian y siguen, sin pregunta de confirmación; las tres líneas del anuncio abren la nota de entendimiento de `brainstorming` (paso 4) | `tests/sdd-propose-0160-red.md`, a1 2/2 en la pregunta de confirmación; GREEN 0/2 y tres rondas de REFACTOR 0/6 hasta poner las líneas en la nota (2/2), `tests/sdd-propose-0160-green.md` | a1 |
| Paso 2: patch, lite y config preguntan, con el 🦆 delante, antes de rama, carpeta o id | `tests/sdd-propose-0160-red.md`, a2 2/2 sin preguntar, k1 2/2 sin preguntar | a2, k1 |
| Paso 2: el carril de la petición se respeta si concuerda; si se ve uno más pesado, se pregunta con él recomendado | RED a3 y a4 limpios: la presión la crea la regla de la ceremonia; GREEN 2/2 y 2/2 como control | a3, a4 |
| Paso 2 y «Config lane»: config pregunta, corre el gate de `operations.md`, commitea con `Gate:`; no commitea en rojo ni en la rama estable | RED k1 y k3 2/2 (edición directa sin gate); GREEN k1, k3 y k4 2/2 | k1, k3, k4 |
| Paso 2: spike se clasifica y se anuncia como full | RED k2 2/2 a `sdd-consult` | k2 |
| Paso 2: el carril solo sube | sin escenario: la forma de las subidas vigentes de lite (`modo-lite.md`) y de patch (`sdd-start-patch`, paso 1) | no medido |
| Paso 6: el traspaso a `sdd-start-feature` tras el plan, en el mismo turno en `delegate` | GREEN p1 1/2; REFACTOR 2/2 | p1 |
| Paso 2: en un patch, con `estimation.md`, la pregunta lleva la estimación en horas, que `sdd-start-patch` escribe antes del fix | ticket del patch 6300 §3 y del patch 0101 §1 (estimación escrita al cerrar); `tests/sdd-propose-0160-red.md`, a2 2/2 sin estimación | a2 |
| Paso 5 y `plan-template.md` §3: el gate de cierre se copia de `operations.md` §Testing; sin él, de `tech-stack.md` §Testing; sin ninguno, de la constitution; si no hay ninguno, `no declarado` | ticket de la feature 0146 (menores: el plan nombró `npm test --prefix cli`); `tests/sdd-propose-0160-red.md`, p2 1/2; GREEN 2/2 | p2, p1 (sin `operations.md`: el de la constitution) |
| Paso 2: una petición con partes de varios carriles va por la más pesada, y dice qué parte va dentro | revisión final de la 0160 (Important 5) | no medido: sin RED; la forma es la de la clasificación, que miden a1-a4 |
| Paso 4 (sin regla propia): las decisiones que trae un prompt de arranque van a «Decisiones tomadas con el dev-lead» y no se preguntan | `tests/sdd-explore-0161-red.md`, a5: 2 de 2 limpios sin regla; la conducta sale de `spec-template.md` | a5 (control) |
| «Config lane» paso 5: en una rama `feature/*`, el config se fusiona con `sdd merge` según `merge.*`; sin bloque `merge`, pregunta | `tests/sdd-explore-0161-red.md`, k5: 2 de 2 commitearon sin fusionar; GREEN 2/2 | k5 |
