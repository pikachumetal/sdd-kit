---
kit_version: 3.0.3
lane: feature
id: 20261119-185254-feature-0359-spec-plan-phase-skills
task: 0359
mode: full
date: 2026-11-19
---

# Ticket para el kit — feature 0359: la spec y el plan en skills de fase

## Contexto

- Carril y modo: feature full, perfil `delegate`, validación en campo
- Skills del kit usadas: `sdd-propose`, `sdd-grilling`, `sdd-parallel-agents`, `sdd-implement`, `sdd-implement-native`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-archive`, `sdd-retro`, `sdd-feedback`; las cuatro skills de fase nuevas, medidas en baterías
- Proyecto: el propio kit (skills en Markdown, CLI en TypeScript, baterías headless), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 (revisor de dominio, ejes Spec y Arquitectura, re-revisión) y Sonnet 5.5 (revisores de las enmiendas, eje Código, lector de prosa, 118 sujetos)
- Coste en reloj: 3,34 h frente a 6 h estimadas, sin 251 min de espera al dev-lead (22 esperas)
- Coste en tokens: sesión 67,31 $ (hilo 52,67 $ + subagentes 14,63 $); sujetos 64,58 $ en 118

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Los topes «sin medir» de una skill nueva se quedaron cortos los cuatro, y uno obligó a partir la fase

- **Qué pasó**: la spec aprobada fijaba `sdd-spec-writing` en ~18.500 bytes y 3.300 palabras, `sdd-spec-review` en 1.250 / 1.680 y `sdd-plan-writing` en 1.800, todos `sin medir`. Medidos: el borrador de `sdd-spec-writing` con todo lo asignado ocupaba ~23.300 bytes y conservaba el 48 % de `brainstorming` (`kit:copies` pide 50); `sdd-spec-review` 1.429 / 1.819; `sdd-plan-writing` 2.174. La fase de la spec se partió en dos skills (enmienda 29) y cada tope se subió con un ruling.
- **Fuente**: `.docs/sdd/changes/20261119-113300-feature-0359-spec-plan-phase-skills/spec.md` decisiones 20 y 29, «Topes de palabras» y «Enmiendas»; `tasks.md` § Rulings (Task 2, 3 y 4).
- **Dónde en el kit**: `skills/sdd-spec-approval/SKILL.md` §1 («What is retired or changes form»: «one that can't run before the gate goes to ✋ as `sin medir`»); `skills/sdd-templates/templates/spec-template.md`, «Topes de palabras».
- **Por qué el kit no lo evitó**: el repaso admite `sin medir` para un recuento que no se puede correr antes del gate, y el de una skill nueva sí se puede correr sobre un borrador en el scratchpad (`kit:skill-size` y `keptShare` de `tests/copies/annotated.ts` miden un fichero suelto).
- **Coste**: una parada del dev-lead con revisor (enmienda 29), cuatro rulings de tope y el saldo de palabras de +1.900 aprobado a +~2.900 medido (spec, decisión 19).
- **Propuesta**: en el repaso, una spec que crea una skill o una copia anotada mide sus bytes, sus palabras y su porcentaje sobre un borrador antes del gate; `sin medir` queda solo para lo que no admite borrador.
- **Verificada**: sí — el borrador de la Task 4 midió 23,3 KB y 48 % con `node --experimental-strip-types` sobre `keptShare` de `tests/copies/annotated.ts`, antes de escribir la skill en `skills/`.
- **Criterio de aceptación**: GIVEN una spec que crea una copia anotada de 15 KB con ~13 KB de bloques del kit, WHEN el repaso de coherencia, THEN la spec lleva sus bytes y su porcentaje medidos sobre un borrador y para antes del gate si pasan de 20.000 o bajan del 50 %.

### 2. Tres reglas movidas a otra skill se perdieron y solo las cazó una lectura de prosa

- **Qué pasó**: al partir `sdd-propose` en fases, tres reglas quedaron donde la sesión ya no las lee: el bloque del anuncio (`a1` sin anuncio 0/3; dos frases de guía no lo arreglaron, el bloque con su forma en el primer mensaje de `sdd-spec-writing` sí: 2/2), «prevé <n> tasks» en la tercera opción del gate (`g1`), y la plantilla de `sdd-templates` (`sp1` sin tabla de topes). La puerta automática de las 43 filas del tramo salió verde en 41; las tres salieron al leer las filas de prosa con un agente.
- **Fuente**: `tests/sdd-propose-0359-phase-skills-green.md`, secciones «Task 5» y «Pasada de fix»; `walkthrough.md` §5.
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` (la tabla «regla que se mueve → dónde vive ahora» la pide la spec, no un test); `skills/sdd-agent-writing/SKILL.md` (mover reglas medidas).
- **Por qué el kit no lo evitó**: la regla «las reglas que se mueven van literales» está en la spec y en `debt.md` («reescribir o mover una regla medida la pierde»), pero nada la comprueba: `kit:own` vigila que no se repitan, no que lleguen.
- **Coste**: tres tandas de arreglo y dos paradas del dev-lead (techo de sujetos), ~6 $ en sujetos (`green.md`); la regresión de `a1` costó cuatro medidas.
- **Propuesta**: un test de `cli/test/kit/` que lea la tabla «regla que se mueve» de la spec abierta y busque cada literal en el `dist/` de su destino; o, sin test, que el lector de filas de prosa del tramo sea un paso del plan cuando la feature mueve reglas.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: RED: con el bloque del anuncio solo en `sdd-propose` y la fila «el anuncio abre el primer mensaje de `sdd-spec-writing`» en la tabla, el test falla nombrando el literal y la skill de destino.

### 3. Un traspaso en `delegate` se saltaba con una fila de racionalización y se cumplía con un tope ⛔

- **Qué pasó**: con la spec aprobada por delegación, `iq4` paraba a presentar la spec o escribía el plan sin invocar `sdd-spec-approval` ni `sdd-plan-writing`: 0/1 en el tramo, 1/3 con una fila de racionalización, 1/2 con la petición cambiada. Con «⛔ Approved … the turn doesn't end before that invocation» en `sdd-spec-approval` §4 y en el traspaso de `sdd-spec-writing`: 3/3. El mismo tope (⛔ sin `spec.md` hasta que sale el mensaje de los montones) llevó `iq2` de 1/2 a 3/3.
- **Fuente**: `tests/sdd-propose-0359-phase-skills-green.md`, «Tandas de REFACTOR», «Pasada de fix» y «Última ronda».
- **Dónde en el kit**: `skills/sdd-spec-approval/SKILL.md` §4; `skills/sdd-spec-writing/SKILL.md`, «Your First Message».
- **Por qué el kit no lo evitó**: el traspaso estaba en prosa; la tabla de racionalizaciones no cambió la conducta, que el Art. II asigna a «fallo de disciplina».
- **Coste**: dos tandas y una fila añadida y quitada (Art. IX), ~4 $.
- **Propuesta**: en los traspasos obligatorios de las fases, el tope ⛔ en el paso; que `sdd-agent-writing` lo nombre como la forma que funcionó para «la sesión acaba el turno antes de invocar la siguiente fase».
- **Verificada**: sí — `iq4` 3/3 y `iq2` 3/3 con el tope.
- **Criterio de aceptación**: GIVEN `iq4` con la petición «Escribe la spec y el plan» y la spec aprobada por delegación, WHEN el sujeto aprueba, THEN `tools.txt` lleva `sdd-spec-approval` y `sdd-plan-writing` en ese orden en 3 de 3.

### 4. Ni los revisores de la spec ni el repaso vieron que partir el paso rompía retomar

- **Qué pasó**: la spec rechazó el `MODIFIED` de «Retomar» («retomar una spec sin aprobar sigue entrando por `sdd-propose`»), y nadie comprobó que `sdd-propose` siguiera sabiendo retomar en el gate. Lo vieron los ejes Spec y Arquitectura de la revisión final: una spec escrita y sin aprobar volvía a entrevistar o duplicaba la carpeta. Enmienda 31, `MODIFIED` de «Retomar» y escenario `rs1` (1/1).
- **Fuente**: `spec.md` decisión 31, «Hallazgos de la review»; `tasks.md` «Revisión final».
- **Dónde en el kit**: `skills/sdd-spec-review/references/reviewer-brief.md` punto (3) («hidden scope»); `skills/sdd-spec-approval/SKILL.md` §1 («Each `MODIFIED`»).
- **Por qué el kit no lo evitó**: el brief busca lo que la Intent promete y el Scope no lista, no los caminos de entrada que una partición deja huérfanos.
- **Coste**: una parada del dev-lead, un revisor de la enmienda (con un Crítico) y un escenario nuevo.
- **Propuesta**: en el brief, un punto para cuando la spec parte o mueve un paso: cada entrada que hoy llega a ese paso (una petición nueva, retomar, una subida de carril) tiene su destino nuevo.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una spec que parte el paso 4 de una skill en dos skills, WHEN el revisor de dominio la lee, THEN un hallazgo nombra el caso «retomar con el artefacto del paso a medias».

### 5. Un AND fija una primera pregunta que el GIVEN del propio escenario contradice

- **Qué pasó**: el AND de `ss1` pedía que la primera pregunta citara un punto de «Abierto», y el mismo GIVEN sembraba un efecto visible que cambia más; los tres sujetos preguntaron primero ese efecto, como pide `sdd-grilling`. La petición de `iq2` («prompt completo») dejaba abierto el orden de las líneas y los sujetos lo preguntaron. Enmienda 30.
- **Fuente**: `spec.md` decisión 30 y «Enmiendas».
- **Dónde en el kit**: `skills/sdd-spec-review/references/reviewer-brief.md` punto (2).
- **Por qué el kit no lo evitó**: el punto (2) busca la fila que pasa sin la conducta, no la que falla con la conducta correcta.
- **Coste**: una parada del dev-lead con revisor.
- **Propuesta**: en el punto (2), «o un escenario cuyo GIVEN siembra otra decisión de más peso que la que el THEN fija como primera».
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN la spec original de la 0359 con el AND de `ss1`, WHEN el revisor de dominio la lee, THEN señala que el `sort()` sembrado compite con «Abierto» por la primera pregunta.

### 6. Un test del repo contradecía la decisión «las ADR no se tocan» y ningún revisor lo vio

- **Qué pasó**: la spec decía que las ADR con rutas a ficheros movidos no se editan; `decision-routes.test.ts` exige que cada ruta de una ADR vigente exista y dio rojo al borrar `review-spec.md`. Se resolvió con ADR nuevas que sustituyen (0039 a 0042).
- **Fuente**: `spec.md` decisión 14 y la enmienda de la Task 2.
- **Dónde en el kit**: `skills/sdd-spec-approval/SKILL.md` §1, «What is retired or changes form».
- **Por qué el kit no lo evitó**: el repaso busca el literal retirado con `git grep` fuera de la evidencia, pero no corre los tests que lo vigilan sobre una copia con el fichero borrado.
- **Coste**: una parada del dev-lead.
- **Propuesta**: al retirar un fichero, correr sobre una copia con el borrado los tests que leen rutas (en este repo, `cli/test/kit/`) antes del gate.
- **Verificada**: sí — `pnpm exec vitest run test/kit` en Git Bash, con `review-spec.md` borrado → `FAIL test/kit/decision-routes.test.ts > … 0024-spec-review-always-on.md: cada glob casa con algún fichero`.
- **Criterio de aceptación**: GIVEN una spec que borra un fichero nombrado en las `rutas` de una ADR vigente, WHEN el repaso, THEN la spec lo lleva al Scope con la ADR que lo sustituye.

## Lo que hice por iniciativa propia

- Un agente Sonnet leyó las filas de prosa de 59 sujetos (tramo y entrevistador) contra la rúbrica, y devolvió solo los fallos y las dudas. Encontró las tres regresiones del hallazgo 2, que la puerta automática daba en verde. Coste: ~2 $.
- Un comprobador local de copias anotadas (`keptShare` y `checkCopy` de `tests/copies/annotated.ts`, sin abreviar los mensajes) sobre el borrador en el scratchpad: dejó ajustar diez citas `sustituye` sin pasar por el pre-commit.

## Funcionó, no tocar

- El tope ⛔ antes de `spec.md` (`iq2` 3/3) y en los traspasos (`iq4` 3/3).
- Un hueco con su forma (el bloque `text` del anuncio) donde se escribe el output: `a1` de 0/3 a 2/2.
- El revisor de cada enmienda que cambia el delta: encontró un Crítico en dos de las tres.

## Menores

- `battery.mjs run` falló dos veces seguidas: primero por `BATTERY` y luego por `COST_CAP`, sin definir. El encabezado de `battery.md` nombra `BATTERY`, pero no `COST_CAP`. — `tests/headless/battery.mjs`.
- `npx vitest` en Git Bash da `Cannot find module …\vitest\vitest.mjs`. Ya lo dice `operations.md`, y aun así lo repetí una vez. — no localizado en el kit.
- Copié `.docs/sdd` a `/tmp/x`, fuera del scratchpad, para probar el delta. Lo borré enseguida. — `skills/sdd-spec-approval/SKILL.md` §1 dice «a temp folder outside the repo» sin nombrar el scratchpad.
- Cómo termina un bloque del kit y qué cita una marca `sustituye` solo se lee en `tests/copies/annotated.ts`. — no localizado en el kit.
- Rojos de un caso, sin línea base de prosa:
  - `pb-p`: la fila PB-P quedó vieja frente a la decisión 8.
  - `c10`: C10r no despacha el revisor de la enmienda; la 3.0.0 sí lo hacía.
  - `sp1`: sale sin tabla de topes.
  - `t1`: puntero a otra fila.
  - `rc1`: un aviso de fase en inglés.
  - E3 de `p3-1` y E7 de `pe-2` del entrevistador.
  - `iq2`: el camino del montón vacío queda sin observar.

  Todos en `tests/sdd-propose-0359-phase-skills-green.md`.
