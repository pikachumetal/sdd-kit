---
id: 20261101-115344-feature-0206-retire-start-skills
feature: 0206
proposal: 0131
title: Retirar sdd-start-feature y sdd-start-patch y repartir lo que hacen entre las cinco acciones
mode: full
profile: delegate
status: approved
created: 2026-11-01
author: agente con el dev-lead
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-01
---

# Spec — Retirar `sdd-start-feature` y `sdd-start-patch`

🦆 Hoy un cambio da un rodeo: se propone, pasa por una skill intermedia y solo entonces se implementa. Tras esta feature, pedir «añade un filtro» va de la propuesta a la implementación y de ahí al cierre, sin paso intermedio; y un arreglo pequeño, como «cancelar Norte el martes me quita la del lunes», encuentra la causa, escribe su `patch.md`, comprueba el test en verde y se cierra sin revisores. Quien trabaja con el kit no nota otra diferencia, salvo que `retoma la feature` se queda sin puerta hasta la 0116. Un proyecto que nombre las skills viejas en su `CLAUDE.md` las ve sustituidas al migrar.

Validación: agente — son skills, tests y documentos: un humano no observaría nada que las baterías no midan, y este repo valida en campo (`validation.mode: field`).

## Capacidades

- Modificadas: `feature-flow` — propose entrega a implement, e implement a archive
- Modificadas: `routing` — el patch sigue en `sdd-implement`
- Modificadas: `capabilities` — deja de nombrar el paso 7
- Modificadas: `control-profiles` — deja de nombrar el paso 7; cambia la ruta de su propósito (decisión 9)
- Modificadas: `feature-ids` — deja de nombrar las skills retiradas
- Modificadas: `migration` — el paso 5 de la v3.0.0 sustituye sus nombres

`commit-history` solo cambia la ruta de su propósito, sin delta (decisión 9).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `MODIFIED`, tres o más capacidades, contrato público (el nombre de una skill en el `CLAUDE.md` de un proyecto) · tamaño: ~60 ficheros y unas 2.500 líneas, estimado: casi todo traslados y enlaces
- Mínimo razonable: ninguna — deja sin mirar si la tabla de reglas se dejó una; lo cubre el eje Spec de la revisión final, con la tabla delante.

1. **Partida**: esta 0206 queda con la retirada (4 tasks) y el inglés de `using-sdd` y `sdd-templates` pasa a la 0272, tras ella. Entera serían 6 tasks. Coste de partir: la batería de `using-sdd` corre dos veces, ~12 $ más.
2. El flujo del patch va a `skills/sdd-implement/references/patch-flow.md`, no al `SKILL.md`, con una sección de ~110 palabras al principio de `sdd-implement` que manda leerlo y excluye el resto de la skill. Motivos: aplica solo a los patches y se necesita tras decidir (`architecture.md`, regla de `references/`); y un `SKILL.md` de 11.466 palabras dejaría sin margen la limpieza de los topes de la v3. Riesgo: una regla solo en una referencia no se lee (feature 0146); por eso el traspaso es «lo primero» (feature 0147) y lo mide la batería.
3. Las órdenes de la CLI del patch van por verbo (`sdd id claim`): Claude Code solo sustituye `${CLAUDE_PLUGIN_ROOT}` en un `SKILL.md`. La sección de `sdd-implement` da la ruta.
4. Reparto de referencias, por quién las usa: `control-profiles.md`, `nombrado.md`, `modo-lite.md` y `review-spec.md` a `sdd-propose`; `commit-milestones.md` y `frontend-verification.md` a `sdd-implement`. Con `git mv`, sin traducirlas en esta feature (Art. III permite convivir). `control-profiles.md` podría ir a `sdd-config`, que la llama su contrato; la dejo en `sdd-propose` porque es quien decide con ella en cada cambio.
5. `overrides-superpowers.md` se retira: nadie la enlaza fuera de la skill, y su «se hace directamente» contradice a `using-sdd` y al carril config. Ver la tabla.
6. El paso 7 de `sdd-start-feature` tiene reglas que `sdd-archive` no recoge. El encargo daba la validación por resuelta y solo lo está en parte: lo que falta va a `sdd-implement` y al paso 1 de `sdd-archive` (filas P7 de la tabla). Sin esto se perderían en silencio.
7. El patch usa la «Gate Function» de `sdd-verify` por enlace, sin invocar la skill: invocarla son 3.500 palabras y su `description` empuja hacia la revisión final. Si el GREEN sale rojo, se invoca.
8. El test de un patch sigue `sdd-tdd`, como pide el ejemplo de la enmienda del 2026-10-21. La misma enmienda escribe el `patch.md` en `sdd-propose`, y el encargo y la fila lo llevan a `sdd-implement`: sigo el encargo, que es posterior y evita abrir carpeta antes de reproducir el fallo.
9. Las líneas de propósito de `commit-history` y `control-profiles` no las cubre un `MODIFIED`: se corrigen a mano en el cierre, y `sdd capability check` lo comprueba.
10. `tests/batteries/sdd-start-feature/` se retira: `v1a` y `v1b` pasan a la batería de `sdd-archive`, `a1` a la de `sdd-propose`, y el molde `mold-reservas`, que usa la batería de `sdd-grilling`, a esta última. La evidencia `tests/*-red.md` y `*-green.md` es historia y no se toca.
11. Los documentos de estado que explican cómo se trabaja se actualizan (`README.md`, `constitution.md` Art. IV, `architecture.md`, `tech-stack.md`:88, `.docs/workflow/`); las líneas de `tech-stack.md` que cuentan lo que pasó en una feature se quedan. Las skills retiradas tampoco se tocan en `cli/test/fixtures/` ni en las migraciones anteriores: son historia.
12. Migración: `sdd-start-feature` y `sdd-start-patch` entran en la tabla del paso 5 de `v3.0.0.md`, y su `git grep`, en su Verificación. Un proyecto necesita ese paso: su `CLAUDE.md` puede decir «arranca con `sdd-start-feature`» y la frase dejaría de funcionar. Sin paso nuevo ni gate. Destino `sdd-propose` para las dos, y `/sdd-propose` para los comandos. Ruta del ejemplo de la línea 147, a `skills/sdd-propose/references/nombrado.md`.
13. Sin presentación por secciones, aunque hay 4 tasks o más: el encargo pide proponer al presentar la spec, y la regla 3 de `CLAUDE.md` no admite paradas intermedias. El choque va al ticket.
14. Sin bump de versión ni entrada de migración nueva: la 3.0.0 aún no se ha cortado y `v3.0.0.md` es la suya.
15. `sdd capability merge` sobre una copia de `.docs/sdd`: 14 requisitos, 3 añadidos y 11 sustituidos, y `sdd capability check` con el artefacto: `Capacidades válidas: 20`.
- Política de modelos: spec sin revisores · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no (sin módulo ni dependencia nuevos; se comprueba con las señales de `sdd-verify`) · sujetos por tandas, Sonnet, en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar que pide tu `CLAUDE.md`; lo que no nombra se confirma aparte.

### Decisiones tomadas con el dev-lead

- Las dos skills se retiran, sin puntero — «si todo lo que hemos hecho nos llevaba a eliminarlas porque se integran en explore <-> propose <-> implement <-> verify <-> archive» (2026-10-21).
- El patch, sin revisión final — «Solo la verificación» (2026-10-21).
- Partirla, con el inglés en la 0272 — opción «Apruebo y se parte: la 0206 con la retirada, y el inglés en fila propia tras ella» (2026-11-01).
- Perfil delegate y `sdd merge --push` al fusionar — encargo de arranque de la feature, 2026-11-01.

## Intent

Un cambio pasa hoy por `sdd-start-feature` o `sdd-start-patch` entre propose e implement, y el kit ya tiene las cinco acciones que hacen ese trabajo. Las dos skills suman dos `description` a cada sesión y un salto que se puede saltar. El éxito: las dos carpetas no existen, un sujeto recorre una feature y otro un patch sin invocarlas, y ninguna regla se pierde sin decirlo. Sería un fracaso, aunque funcione, que una regla de disciplina desaparezca sin fila en la tabla, o que un patch dispare los revisores finales.

## Scope

- Entra:
  - `sdd-propose`: paso 6 y demás menciones entregan a `sdd-implement`; enlaces.
  - `sdd-implement`: `description`, sección del patch, `references/patch-flow.md`, comprobación de la spec aprobada, aviso de fase propio, borradores de cierre durante la revisión y salida a `sdd-archive`.
  - `sdd-archive`: paso 1 con la evidencia por THEN, el THEN `Se valida en:` y la decisión en turno aparte; enlaces y `dev-validation.md`.
  - Enlaces en `sdd-verify` (`SKILL.md`, `encargo-revision.md`), `sdd-config`, `sdd-debugging`, `sdd-parallel-agents`, `plan-writing.md`, `sdd-templates/SKILL.md` (tres menciones, en castellano) y las plantillas `plan`, `spec` y `validation`.
  - `skills/sdd-upgrade/references/migrations/v3.0.0.md`, paso 5, Verificación y línea 147.
  - `CLAUDE.md` regla 3; `README.md`, `constitution.md`, `architecture.md`, `tech-stack.md`:88, `.docs/workflow/{usage-guide,greenfield,brownfield}.md`.
  - `cli/test/kit/word-budget.test.ts` y `cli/test/kit/headless/battery.test.ts`.
  - Baterías `sdd-propose`, `sdd-implement`, `sdd-archive`, `sdd-verify`, `sdd-grilling`, `using-sdd` y moldes `mold-*/.docs/sdd/constitution.md`.
  - Borrar `skills/sdd-start-feature/` y `skills/sdd-start-patch/`.
- No entra:
  - Retomar una feature o un patch: es la 0116. **Sin puerta hasta entonces**: «sigue con la Task 3», «retoma la feature» y retomar un patch con su `patch.md`, que hoy recogen las `description` retiradas. Invocar `sdd-implement` por su nombre sigue funcionando, con su ledger; `using-sdd` no gana fila. Las dos filas son de la 3.0.0, así que ninguna release sale con el hueco.
  - La validación del dev como paso: ya es el paso 1 de `sdd-archive` (0149). Aquí solo llegan las reglas que el paso 7 tenía y aquel no.
  - Migrar este repo: es la 0198.
  - El resto de cada plantilla de `sdd-templates/templates/`.
  - El inglés de `using-sdd` y `sdd-templates`: es la 0272 (decisión 1).

## Tabla de reglas: de dónde a dónde

Art. I. Ninguna de las dos skills es fork: no están en `THIRD_PARTY_NOTICES.md` ni llevan `NOTICE`, así que la ADR 0013 no aplica a ninguna fila.

### `sdd-start-feature`

| # | Regla | Dónde vive ahora | Por qué se descarta |
| --- | --- | --- | --- |
| F1 | Overview: la spec es la fuente de verdad; superpowers como proceso | `sdd-propose`, Overview (ya está) | |
| F2 | Regla de oro: artefactos solo en la carpeta de la tarea | `sdd-propose`, Overview (ya está) | |
| F3 | «Violar la letra de los gates…» | `sdd-propose`, Overview (ya está) | |
| F4 | Aviso de fase | `sdd-propose` (ya está) y `sdd-implement`, Overview, con su forma (hoy lo cita de esta skill) | |
| F5 | Sin spec aprobada en la rama, para y manda a `sdd-propose` | `sdd-implement`, Setup, nuevo paso previo | |
| F6 | Paso 6: invocar `sdd-implement` lo primero | `sdd-propose`, paso 6 | |
| P7a | `field`: no para; re-revisión, smoke y suite igual | `sdd-archive`, paso 1 y 0.6 (ya está) | |
| P7b | La suite la corre una sola vez el paso 6 con otra rama abierta o base por delante | `sdd-archive`, paso 1, «The suite» (ya está) | |
| P7c | La validación se presenta con el cierre de la revisión hecho | `sdd-archive`, 0.6, y `sdd-verify`, «Closing the review» (ya está) | |
| P7d | Borradores de cierre sin commitear mientras revisa, sin adelantar el roadmap | `sdd-implement`, «After the last task», **nuevo**; `sdd-archive`, línea que los recoge, cambia su origen | |
| P7e | Re-revisión única del tramo; una con `Re-revisión:` ya hecha no abre otra; `sin revisar` | `sdd-archive`, 0.6, y `sdd-implement`, «Every commit of yours» (ya está) | |
| P7f | Una decisión de la revisión final se pregunta sola, en su turno, y la validación en el siguiente | `sdd-archive`, paso 1, **nuevo** | |
| P7g | Calcar `validation-template.md`, guion el último, esperar; `Validación: agente` | `sdd-archive`, paso 1 (ya está) | |
| P7h | Smoke: una fila por THEN con `suite`, `ejecución real` o `no probado`; un THEN de interfaz solo cuenta con ejecución real, y uno de fallo se provoca | `sdd-archive`, paso 1, **nuevo**: la plantilla solo trae las columnas | |
| P7i | Un THEN con `Se valida en:` prepara ese entorno y el guion lo usa | `sdd-archive`, paso 1, **nuevo**; `sdd-propose` paso 4 cambia su enlace | |
| P7j | Con «Verificación visual»: criterio, detector, medidas, capturas antes del guion | `validation-template.md` (ya está) y `dev-validation.md` | |
| P7k | Validar es decir qué se probó; «validado» vale; «cierra» no; diferir con tres condiciones; `unattended` difiere | `sdd-archive`, paso 1 (ya está) | |
| F8 | Paso 8: cierre solo vía `sdd-archive`, nada ✅ sin smoke | `sdd-implement`, «Finish», y `sdd-archive` (ya está) | |
| F9 | Índice de referencias | | Lo sustituyen los enlaces en su punto de uso |
| F10 | Trabajo fuera de scope: ruling o freno; si cambia la spec, con el usuario y opciones; `unattended`, lo conservador | `sdd-implement`, «Deviations and rulings» (ya está), y `control-profiles.md` | |
| F11 | Antes de un fix, `sdd-debugging` | `sdd-implement`, Native loop, paso 2 (ya está) | |
| RF1 | Red flag: seguir una task sin haber invocado `sdd-implement` | | Sin skill intermedia no hay nada desde donde saltársela |
| RF2 | Red flag: ✅ sin smoke | `sdd-archive`, paso 1 (ya está) | |
| RF3 | Red flag: `sdd-archive` sin validación | `sdd-archive`, paso 1 (ya está): ahora es su propio paso | |
| RF4 | Red flag: `field` y parar porque «el kit no define ese valor» | `sdd-archive`, paso 1 (ya está, literal) | |
| RF5 | Red flag: tiempo en blanco | `sdd-archive`, paso 2 (ya está) | |
| RZ1 | «Ya sé qué hace el paso 6» | | Como RF1 |
| RZ2 | «Dejo el tiempo en blanco» | `sdd-archive`, paso 2 (ya está) | |
| RZ3 | «✅ pendiente de smoke» | `sdd-archive`, paso 1 (ya está) | |
| RZ4 | «La revisión está limpia: cierro» | `sdd-archive`, paso 1 (ya está) | |
| RZ5 | «Me han pedido cerrar: eso es validar» | `sdd-archive`, paso 1 (ya está) | |
| D1 | `description`: al retomar | | 0116 |
| R1 | `references/overrides-superpowers.md`, filas de rutas y plantillas | `sdd-propose`, Overview, y `sdd-templates` (ya está) | |
| R2 | `references/overrides-superpowers.md`, «Cuándo NO aplicar SDD… se hace directamente» | | Contradice a `using-sdd` («no hay edición directa») y al carril config (0160) |
| R3 | Las otras seis referencias | Decisión 4, sin cambiar el texto | |

### `sdd-start-patch`

Todo lo que dice «`patch-flow.md`» es el mismo texto, traducido y sin cambiar su sentido.

| # | Regla | Dónde vive ahora | Por qué se descarta |
| --- | --- | --- | --- |
| A1 | Overview: qué es un patch; lo decide quién fijó la solución | `sdd-propose`, paso 2 (ya está) | |
| A2 | El nombre del carril no es el tipo de rama | `patch-flow.md` | |
| A3 | Puntero a «Is it really a patch?» | | Se llega con el carril decidido; `patch-flow.md` lo enlaza donde sube |
| P1 | Causa raíz obligatoria con `sdd-debugging`; si exige interpretar requisitos, sube | `patch-flow.md` | |
| P1b | Sin reproducir: para sin abrir nada; la fila queda re-medida; un fallo distinto sigue con el medido | `patch-flow.md` | |
| P1c | Variante visual: intención en una frase; sube si cae el predicado | `patch-flow.md` | |
| P1d | Variante cerrada: solución fijada; comprueba lo que da por existente; RED antes | `patch-flow.md` | |
| P2 | Carpeta, ids, `id claim`, sin `.docs/sdd/patches/`, renombrar la rama sin id | `patch-flow.md`, por verbo | |
| P3 | `patch.md`: secciones, `solution:`, autores, estimación e inicio antes del fix | `patch-flow.md` | |
| P4 | Fix mínimo; numstat con 10 ficheros o 300 líneas pregunta | `patch-flow.md` | |
| P4b | Retirada: cada símbolo sin otros usos | `patch-flow.md` | |
| P4c | Visual: capturas antes y después, detector o aviso, fuera de git, ruta en §4, parar por PID | `patch-flow.md` | |
| P4d | Subida a feature a medias: borra carpeta, id consumido | `patch-flow.md` | |
| **N1** | **Evidencia antes de decir hecho, sin revisión final** | `patch-flow.md`, **nuevo**, con la «Gate Function» de `sdd-verify` | |
| **N2** | **El test sigue `sdd-tdd`** | `patch-flow.md`, **nuevo** | |
| P5 | Commit único; tipo según la clase; la fila la cierra `sdd-archive` | `patch-flow.md` | |
| P6 | Cierre: `sdd-archive` | `patch-flow.md` | |
| RF-a | Red flag: implementar la hipótesis sin confirmar | `patch-flow.md` y `sdd-propose` (racionalización) | |
| RF-b | Red flag: documento fuera de `specs/` o sin prefijo | `patch-flow.md` y `sdd-propose` (ya está) | |
| RF-c | Red flag: decidir algo que el usuario ve | `patch-flow.md` y `sdd-archive`, cláusula de escalado (ya está) | |
| RF-d | Red flag: abrir como patch por «es pequeño» | `sdd-propose`, red flags (ya está, literal) | |
| RF-e | Red flag: `patch.md` sin `solution:`, causa o tiempo | `patch-flow.md` | |
| RF-f | Red flag: commitear captura, o cerrar sin rutas ni detector | `patch-flow.md` | |
| RF-g | Red flag: abrir sin reproducir | `patch-flow.md` | |
| RZ-a | «Operaciones ya sabe la causa» | `sdd-propose`, racionalizaciones (ya está, literal) | |
| RZ-b | «Es una línea, sin documento» | `patch-flow.md` | |
| RZ-c | «No quiero abrir una tarea entera» | `patch-flow.md` | |
| RZ-d | «En `.docs/sdd/patches/`» | `patch-flow.md` | |
| RZ-e | «Me han pedido un patch» | `sdd-propose`, racionalizaciones (ya está, literal) | |
| RZ-f | «El ticket propone el arreglo» | `sdd-propose`, racionalizaciones (ya está, literal) | |
| RZ-g | «Dejo el patch como cobertura» | `patch-flow.md` | |
| D2 | `description`: al retomar un patch | | 0116 |
| D3 | `description`: excluye lo que no es patch (feature 0117: fue lo que enrutó) | `sdd-propose`, `description` (ya está); se re-mide con la batería de `using-sdd` | |

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `sdd-start-feature`, `sdd-start-patch` en requisitos | `feature-flow` ×5, `routing` ×4, `feature-ids`, `capabilities`, `control-profiles`, `migration`:291 | delta, `MODIFIED` |
| Rutas en el propósito | `commit-history.md`:5, `control-profiles.md`:5 | decisión 9 |
| `sdd-start-feature` en `migration.md`:142 | migración a la v2.0.0 | se queda: historia |
| Enlaces a `sdd-start-feature/references/` | `skills/`: `sdd-archive`, `sdd-config`, `sdd-debugging`, `sdd-implement`, `sdd-parallel-agents`, `sdd-propose`, `sdd-verify`, `plan-template`, `spec-template` | Scope |
| Menciones de paso 6 y paso 7 | `sdd-implement` (dos diagramas y sus ejemplos), `sdd-propose`, `sdd-archive`, `dev-validation.md`, `validation-template.md`, `sdd-templates/SKILL.md` | Scope |
| Regla 3 de `CLAUDE.md` | `CLAUDE.md`:32 | Scope |
| `commit-milestones.md` en Art. IV | `constitution.md`:50 | Scope |
| Topes | `word-budget.test.ts`:32-33 | «Topes de palabras» |
| Nombres en los tests de la CLI | `battery.test.ts`:22, 44, 53, 78 | Scope; son datos de juguete |
| Peticiones `Invoca … sdd-start-feature y sigue` | baterías `sdd-implement` ×13, `sdd-archive` ×1, `sdd-verify` ×2, `sdd-grilling` ×5 | Scope |
| Sustitución `sdd-propose` → `sdd-start-feature` en el RED | `tests/batteries/sdd-propose/subject.mjs`:19 | Scope: se quita |
| Fixture `roadmap-0fc231e-parent.md`, `migrations/v0.4.0.md` y `v2.0.0.md`, `tests/*.md`, `.docs/sdd/specs/`, `field-reports/`, `changelog.md`, ADR | historia | se quedan |

- Filas que implementa: 0206 → `roadmap.md`, filas 0263, 0198, 0152 y 0116 la citan como orden: sin cambio; la fila de deuda del patch 0232, (b) «mirar en la 0206»: mirado, lo cerró el patch 0248 en el paso 2 de `sdd-propose`, y se anota en el cierre.

## Approach

`sdd-implement` abre con una sección del patch: lo primero, leer `references/patch-flow.md` y seguirlo; Setup, los dos bucles y «After the last task» no aplican a un patch. Sale a `sdd-archive`. La feature y la lite siguen como hoy hasta el final de la revisión, y salen a `sdd-archive`, donde ya empieza la validación. Se implementa en cuatro tasks: mover referencias y enlaces, sin cambio de conducta; camino de la feature; camino del patch; y retirada con migración, documentos y baterías.

## Dónde se prueba

- Feature de propose a implement: batería `sdd-propose`, fila nueva `f1`, un sujeto real con varios turnos; `tools:` sin `sdd-start-`, con `sdd-kit:sdd-implement`.
- Patch de propose a implement: batería `sdd-implement`, filas nuevas `pt1` (fallo), `pt2` (visual) y `pt3` (petición cerrada); `tools:` sin `sdd-start-`, sin despachos a los ejes, y el `Gate Function` con la salida del test en §4.
- Reglas P7: `v1a`, `v1b`, `g6` y `c2`, reescritas para entrar por `sdd-archive`.
- Enrutado tras la retirada: batería `using-sdd` entera (Art. I y `tech-stack.md`: se mide en la task de la retirada).
- Enlaces, nombres y topes: `cli/test/kit/skills.test.ts`, que ya rechaza un enlace roto y una skill inexistente, y `word-budget.test.ts`.
- Criterio de hecho: `git grep -E "sdd-start-(feature|patch)" -- skills hooks cli CLAUDE.md`, solo con las migraciones y la fixture citadas.

## Términos y ADR

- Términos resueltos: ninguno.
- ADR candidatas: ninguna; la retirada ya es enmienda de la propuesta 0131.

## Delta de comportamiento

### Capacidad: `feature-flow`

#### ADDED — Un patch sigue en `sdd-implement`, con verificación y sin revisión final

- GIVEN el patch 0031, confirmado en `sdd-propose`: si cancelo Norte el martes, que no tengo reservado, me quita la del lunes
- WHEN `sdd-propose` lo entrega
- THEN invoca `sdd-implement`, que lee lo primero `references/patch-flow.md` y sigue su flujo: causa raíz, `patch.md`, fix mínimo y commit; ni el Setup ni los bucles de tasks aplican
- AND antes de decir que está arreglado, §4 de `patch.md` lleva el comando del test y su salida leída en esta sesión, como dice la «Gate Function» de `sdd-verify`
- AND no se despacha ningún eje de la revisión final, y sigue en `sdd-archive`

#### ADDED — Ninguna skill intermedia entre propose e implement

- GIVEN la feature 0010 con la spec aprobada y el plan escrito
- WHEN el hilo pasa de `sdd-propose` a implementar y, al acabar, a cerrar
- THEN las únicas skills de flujo que invoca son `sdd-implement`, `sdd-verify` y `sdd-archive`
- AND mientras trabaja el revisor final, `sdd-implement` escribe sin commitear el borrador de `walkthrough.md` y el delta fusionado, sin adelantar el roadmap, y `sdd-archive` los completa

#### MODIFIED — Cada cambio de paso lleva un aviso en llano

- GIVEN una feature en curso con `sdd-propose` o `sdd-implement`
- WHEN el agente pasa de un paso del flujo al siguiente
- THEN su mensaje dice, en lenguaje llano, qué hace ahora, lo que queda hasta la próxima parada del usuario y cuánto tardará, y cuánto costará cuando el paso lanza subagentes o sujetos
- AND un contador («van 7 de 15») o un número de paso sin esa frase no cuentan como aviso

#### MODIFIED — `sdd-propose` entrega el cambio a la skill que lo sigue

- GIVEN la feature 0010 en `delegate`, con la spec aprobada y el plan escrito por `sdd-propose`
- WHEN `sdd-propose` termina el plan
- THEN invoca `sdd-implement`, que sigue desde la implementación leyendo `mode` y `profile` del frontmatter de `spec.md`, la línea `Ejecución` del plan y la rama
- AND en lite, la invoca con la spec aprobada; en patch, invoca `sdd-implement` con la clase del patch y la estimación de la pregunta
- AND si se invoca `sdd-implement` sin una `spec.md` aprobada en la rama, manda a `sdd-propose`

#### MODIFIED — La implementación la lleva `sdd-implement`

- GIVEN la feature 0042 en modo full, con la spec aprobada y el plan con `Ejecución: native, porque 2 tasks encadenadas por la interfaz de Ledger, …`
- WHEN `sdd-propose` entrega la feature
- THEN invoca `sdd-implement`, que ejecuta las dos tasks en Native y, con la revisión final de vuelta y su pasada de fix hecha, invoca `sdd-archive`, que abre con la validación
- AND ningún fichero de `skills/` invoca `superpowers:executing-plans` ni `superpowers:subagent-driven-development`
- AND en modo lite, sin plan, el método es el de `execution` si está fijado y Native con `auto`, con `spec.md` en el lugar del plan

### Capacidad: `migration`

#### ADDED — La migración a v3.0.0 sustituye los nombres de las skills de arranque retiradas

- GIVEN un proyecto cuyo `CLAUDE.md` dice «arranca el trabajo con `sdd-start-feature`» y cuyo `.claude/commands/fix.md` cita `/sdd-start-patch`
- WHEN se aplica el paso 5 de la v3.0.0
- THEN `CLAUDE.md` dice «arranca el trabajo con `sdd-propose`» y el comando cita `/sdd-propose`, sin gate
- AND la verificación del paso no devuelve ninguno de los dos nombres

#### MODIFIED — La migración a v3.0.0 cierra con el marcador y después revisa las reglas del proyecto

- GIVEN un proyecto que migra a v3.0.0 con el dev-lead presente, cuya `steering/constitution.md` dice «**Ids**: el id de una feature se elige a mano, el siguiente libre del roadmap.»
- WHEN se aplican y aprueban los pasos de la v3.0.0
- THEN `sdd-kit.json` queda con `version` `3.0.0`, escrito con `sdd upgrade --mark 3.0.0`, y hay un commit `chore(sdd): migrar al kit v3.0.0`
- AND después el agente presenta una tabla con cada regla de `CLAUDE.md`, `AGENTS.md`, `PRODUCT.md` y `steering/` que repite o contradice el kit instalado, con su fichero y línea, la ruta del kit que la cubre y su propuesta; la regla de los ids sale con la ruta de `skills/sdd-propose/references/nombrado.md`
- AND solo cambia lo que el dev-lead aprueba, en un commit `chore(sdd): reglas del proyecto que ya cubre el kit`
- AND una regla sin una ruta del kit que la cubra no sale en la tabla; sin ninguna, el paso se salta y lo dice
- AND sin el dev-lead, la tabla va al informe como pendiente, con cómo reanudarla, y ni la constitution ni el marcador dependen de ella

### Capacidad: `capabilities`

#### MODIFIED — El cierre fusiona el delta en la verdad viva

- GIVEN una feature cerrándose con `sdd-archive` con un delta en su spec
- WHEN se ejecuta el paso de fusión
- THEN el agente ejecuta `sdd capability merge --path .docs/sdd --artifact <spec.md>`, que añade cada `ADDED` a `capabilities/<capability>.md`, sustituye entero con cada `MODIFIED` el requisito con ese título, quita cada `REMOVED` y sustituye o añade por su nombre cada entrada de «Reglas de la capacidad»; el walkthrough referencia los escenarios del delta como casos del smoke
- AND si el script falla, el agente corrige lo que dice su mensaje (el delta de la spec, o la línea «Nuevas» del bloque) y lo vuelve a ejecutar; no fusiona a mano
- AND el borrador del delta fusionado que `sdd-implement` escribe mientras trabaja el revisor final sale del mismo script
- AND la capacidad no gana ninguna línea de historial
- AND tras fusionar y antes del commit de cierre, `sdd capability check --path .docs/sdd --artifact <spec.md>` pasa; si falla en lo fusionado o en el bloque, se corrige eso, no el validador
- AND un fallo en una capacidad que el delta no toca (`rooms.md` con un requisito sin THEN, mientras la 0020 fusiona en `bookings`) no bloquea el cierre: `rooms.md` no se edita y el informe final lo lista como pendiente del dev-lead
- AND `sdd-archive` no crea ningún fichero de capacidad que la spec no haya declarado

### Capacidad: `control-profiles`

#### MODIFIED — Con `validation.mode: field`, la validación es en campo

- GIVEN un proyecto con `"validation":{"mode":"field"}` en `.docs/sdd/sdd-kit.json` y la feature 0030 con el cierre de su revisión final terminado, su smoke por THEN y la suite en verde, en cualquier perfil
- WHEN el agente llega a la validación (el paso de validación de `sdd-archive`), o cierra el patch 0031 con `sdd-archive`
- THEN no pregunta qué ha probado el usuario ni ofrece diferir, y sigue con el cierre sin parar
- AND el walkthrough (en un patch, `patch.md` §4, debajo de la tabla) registra `Validación en campo: <fecha> · <verificación del agente>`, con la evidencia que ejecutó (p. ej. `suite 412/412 en 96 s · smoke 5/5 THEN con ejecución real · revisión final Spec y Código sobre a1b2c3d, re-revisión limpia`)
- AND con un `sin revisar` o un «no verificado» sin resolver, esa línea no dice «limpia»: dice cuántos quedan (`…, re-revisión limpia, 1 sin revisar`)
- AND la fila de la 0030 en el roadmap queda ✅, y la del patch 0031 en «Patches» no lleva el prefijo 🧪 ni tiene fila en la tabla de la release abierta
- AND sin la clave, o con `"mode":"manual"`, la validación es la de hoy: para en `pair` y `delegate` y se difiere al smoke de la release en `unattended`

### Capacidad: `feature-ids`

#### MODIFIED — En modo gestor el id es el del ticket

- GIVEN un proyecto en modo `tracker` y una skill que necesita un id (`sdd-propose`, `sdd-implement`, `sdd-roadmap`, `sdd-explore`)
- WHEN el trabajo tiene ticket en el gestor
- THEN el id es el del ticket, y `0000` cuando el trabajo no tiene ticket

### Capacidad: `routing`

#### MODIFIED — Un bug pequeño y determinista entra por el carril patch

- GIVEN un proyecto con `.docs/sdd/` y superpowers instalado
- WHEN el usuario reporta un bug acotado y pide arreglarlo
- THEN la primera skill que se invoca es `sdd-kit:sdd-propose`, que lo clasifica como patch y, con la confirmación, sigue con `sdd-implement`
- AND `patch.md` lleva `solution: causa raíz`, la causa con su evidencia en §2, la entrada del changelog en `Fixed` y el commit del fix con el tipo `fix`

#### MODIFIED — Un patch visual se verifica con una captura y se registra como `Changed`

- GIVEN un patch abierto para un ajuste solo de presentación o una retirada
- WHEN el agente lo recorre con `sdd-implement` y lo cierra con `sdd-archive`
- THEN §2 de `patch.md` lleva la intención en una frase, en lugar de la causa raíz, y no se invoca `sdd-debugging`
- AND §4 lleva la ruta de una captura en navegador real de cada pantalla tocada antes y después del cambio, guardadas fuera de git, y la salida del detector en los dos viewports con cada hallazgo resuelto o justificado, con los mismos contraejemplos que una task full
- AND sin detector declarado, el aviso «composición no medida», y con el detector declarado sin ejecutar, «no probado» con el error concreto
- AND con «sube el badge de estado a 14px», la verificación visual (capturas y detector) dura menos de 5 minutos, sin build dedicado ni suite de specs nueva
- AND la validación del cierre de `sdd-archive` enseña las capturas y la salida del detector al usuario, y propone `§Frontend` si `tech-stack.md` no la tiene
- AND la entrada del changelog va en `Changed`, no en `Fixed`; en una retirada, en `Removed`
- AND en una retirada, §4 lleva además la búsqueda de cada símbolo retirado, sin otros usos
- AND un bug determinista sigue con la causa raíz de `sdd-debugging` y cierra en `Fixed`

#### MODIFIED — El patch registra quién fijó la solución y quién decidió cada cosa

- GIVEN un patch abierto con `sdd-implement`
- WHEN el agente escribe `patch.md`
- THEN el frontmatter lleva `solution: ticket | dev-lead | causa raíz`, y §3 una lista `Decisiones` con el autor en cada línea: `ticket`, `dev-lead` o `sin el dev-lead`
- AND una decisión sobre lo que el usuario ve o puede hacer con autor `sin el dev-lead` hace que el agente pare el patch y lo suba a feature por el paso de la spec de `sdd-propose`, y se lo diga al usuario
- AND el mensaje final del cierre de `sdd-archive` lista las decisiones con autor `sin el dev-lead` leídas de esa lista

#### MODIFIED — Los carriles patch y config preparan el entorno antes del primer test

- GIVEN un worktree recién creado por un prompt de lanzamiento, sin `node_modules`, en un proyecto cuyas dependencias se instalan con `pnpm install`
- WHEN el carril patch va a correr su primer test, o el carril config su gate
- THEN antes corre el paso 2 de `sdd-worktrees` («Project Setup»), con el gestor de paquetes del proyecto, y el test no falla por un módulo que falta
- AND la clasificación de `sdd-propose` también: al reproducir un fallo, ningún `node --test` ni `node src/…` va antes de `pnpm install`
- AND el paso 2 de `sdd-propose` nombra ese paso, sin copiar sus órdenes, y `sdd-implement` y el carril config no lo repiten

## Topes de palabras

El `SKILL.md` de `sdd-implement`, `sdd-propose` y `sdd-archive` supera ya su tope nominal, dentro del margen del 25 % que vive hasta la limpieza de la v3: no los subo, porque caben. Solo suben los totales, y solo por lo que se traslada.

Lo que lo paga: salen `sdd-start-feature/SKILL.md` (1.952), `overrides-superpowers.md` (92) y ~440 palabras repetidas de `sdd-start-patch`; entran ~355 en `sdd-implement` y `sdd-archive`. **Saldo del kit: unas −2.100 palabras.**

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-implement` `SKILL.md` | 9.575 / 9.483 (11.854 con margen) | 2.279 con margen | sin cambio; ~9.800 previstas |
| `sdd-implement` total | 13.341 / 13.249 | 3.220 con margen | 17.740: 13.341 + 4.047 (`patch-flow.md` ~1.450, las dos referencias, `SKILL.md` +225) + 2 % |
| `sdd-propose` `SKILL.md` | 5.333 / 5.250 (6.562 con margen) | 1.229 con margen | sin cambio; saldo ~0 |
| `sdd-propose` total | 6.877 / 6.800 | 1.623 con margen | 14.200: 6.877 + 7.050 (las cuatro referencias) + 2 % |
| `sdd-archive` `SKILL.md` | 4.588 / 3.920 (4.900 con margen) | 312 con margen | sin cambio; ~4.720 previstas |
| `sdd-archive` total | 9.724 / 8.000 (10.000 con margen) | 276 con margen | sin cambio; ~9.855 previstas |
| `sdd-start-feature` | 11.322 de tope | — | fila fuera |
| `sdd-start-patch` | 2.300 de tope | — | fila fuera |
| Kit entero | tope 91.328 | — | 89.328: baja por el saldo |
| `constitution.md`, `architecture.md`, `tech-stack.md` | sin crecer: se cambian rutas | — | sin cambio |

## Previsión de coste

Precio por sujeto: lo medido en la 0186, 0,93 $ en Opus; en Sonnet, 1 $ como techo por uno de un paso, 2 $ por un recorrido de varios turnos y 0,35 $ por uno de enrutado.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED: `f1`, `pt1`, n = 1, sobre el kit actual | 2 (`sdd-propose`, `sdd-implement`) | 4 |
| GREEN: `f1`, `pt1` n = 2; `pt2`, `pt3` n = 1 | 6 (`sdd-propose`, `sdd-implement`) | 12 |
| GREEN: reglas P7, `v1a`, `v1b`, `g6`, `c2`, `c1` y la nueva `se1`; F5, la nueva `f2`; n = 1 | 7 (`sdd-archive`, `sdd-verify`, `sdd-implement`) | 7 |
| Una tanda de REFACTOR | 5 | 8 |
| Controles: `h1`, `h2`, `w1` de `sdd-implement`, `p1` de `sdd-propose` n = 2 | 5 | 6 |
| Enrutado: `using-sdd` entera | 34 | 12 |
| Medición tras la revisión final | 2 | 3 |
| Suma | 61 | 52 |

Cada paso nuevo o cambiado y su escenario: sección del patch, N1, N2 → `pt1`-`pt3`; P7d → `c1`; P7f → `v1a`; P7h → `v1b`; P7i → `se1`, nueva en `sdd-archive`; la suite una sola vez → `g6`; una re-revisión no abre otra → `c2`; F5 → `f2`, nueva en `sdd-implement`, sin spec aprobada; F4 → `f1`; migración, paso 5 → sin sujeto: el guion del paso no cambia de forma, y lo mide la 0198, su primera prueba real. La fila del inglés, aparte: ~13 $ (`using-sdd` entera y un humo de `sdd-templates`). Si la prueba pasa de **52 $**, paro y decides.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-01 | aprobada (opción «Apruebo y se parte: la 0206 con la retirada, y el inglés en fila propia tras ella») |
