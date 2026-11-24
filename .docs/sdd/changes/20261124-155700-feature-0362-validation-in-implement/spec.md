---
id: 20261124-155700-feature-0362-validation-in-implement
feature: 0362
title: La validación vuelve al final de sdd-implement
mode: full
profile: delegate
status: approved
created: 2026-11-24
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-24
---

# Spec — La validación vuelve al final de `sdd-implement`

🦆 Hoy, cuando el agente acaba las tasks, pasa a `sdd-archive`, y es ahí, ya en el cierre, donde corre el gate, recorre el guion de pruebas y se lo presenta al dev-lead. Lo que el guion destapa se arregla después de la revisión final y se fusiona sin revisar (en 17 sesiones de un proyecto consumidor, 10,8 ediciones de código por sesión; en la 0760, 80). Después de esta feature, el trabajo pasa a una skill nueva, `sdd-validate`, y no sale de ella hasta que el dev-lead lo valida: primero el gate, luego el agente recorre el guion entero y arregla lo que falle, luego la revisión final sobre código ya probado, y solo entonces el dev-lead. Si el dev-lead dice «el paso 3 falla: `cancelar Norte lun` dice «cancelada lun» y me quita también la del martes», el arreglo vuelve a `sdd-implement` como una task con su test y corre solo lo que ese arreglo toca: ese test, el gate desde el último verde y el paso 3 del guion; `sdd-archive` solo cierra.

Validación: dev-lead — el cambio es el orden de las paradas que ve el dev-lead; en este repo `validation.mode` es `field`, así que la cierra el uso real de los proyectos a través de los tickets de `sdd-feedback`.

## Capacidades

- Modificadas: `verification` — la revisión final sale tras el gate y el guion recorrido; una vuelta del bucle posterior a la revisión final se revisa una vez sobre su diff; el cierre devuelve a `sdd-implement` lo que no está revisado
- Nuevas: `validation` — la fase entre las tasks y el cierre: el gate, el guion recorrido, la revisión final y la validación del dev-lead, y el bucle de vuelta a `sdd-implement`
- Modificadas: `implementation` — `sdd-implement` pasa a `sdd-validate` al acabar la última task; el gate una sola vez; el final de un patch
- Modificadas: `feature-flow` — la validación se presenta al final de la implementación, tras la revisión, y antes de invocar `sdd-archive`
- Modificadas: `archive` — el cierre arranca con la validación registrada y no edita código; dónde viven las referencias y el límite del gate
- Modificadas: `closing-suite` — el gate corre al acabar las tasks; tras el merge de sincronización solo corren las tareas que cruzan la rama y la base
- Modificadas: `control-profiles` — con `validation.mode: field` el agente cierra su verificación en `sdd-validate` y pasa a `sdd-archive`
- Modificadas: `closing-merge` — el bloque `merge` no autoriza la validación, y el gate ya corrió al acabar las tasks
- Modificadas: `frontend-verification` — las capturas y el detector se enseñan en la validación de `sdd-validate`
- Modificadas: `routing` — la validación visual de un patch se presenta antes de `sdd-archive`

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: `MODIFIED` (13 requisitos) y tres o más capacidades (8) · tamaño: ~230 líneas de delta en 8 capacidades y ~25 ficheros de skills, referencias y baterías
- Dominio (opus): si el orden gate → guion → revisión → dev-lead y el bucle de vuelta (decisión 11) dejan algún caso sin dueño: una vuelta que toca un fichero de «Sin filtro», un fallo de la revisión tras la última vuelta del guion, `Validación: agente` y `validation.mode: field` (señal: `MODIFIED` de «El trabajo se valida con el usuario antes de cerrar» y «Con `validation.mode: field`, la validación es en campo»)
- Técnica (sonnet): si cada `MODIFIED` copia entera la cláusula vigente y no pierde ninguna línea, y si el reparto de referencias de la «Decisión 6» deja algún enlace roto en `skills/`, `tests/` o la plantilla `validation-template.md` (señal: ocho capacidades y trece `MODIFIED`)
- Mínimo razonable: solo la técnica — deja sin mirar si el bucle cubre los casos de borde del dominio, que es donde está el riesgo de esta spec

1. **Enfoque**: C, una skill nueva `sdd-validate` entre `sdd-implement` y `sdd-archive`, frente a A (la validación dentro de `sdd-implement`) y B (dejarla en `sdd-archive`) — ver Approach. Lo pidió el dev-lead al ver que las baterías crecían: «separar en un paso, si no valida devuelve el control a implement».
2. **Los patches validan igual, en `sdd-validate`** — el criterio de hecho pide que `sdd-archive` no tenga ningún paso que edite código, y su paso 1 sirve a los tres carriles; si el patch siguiera validando en el cierre, quedaría una rama del paso 1 con el mismo defecto. Un patch no lleva revisión final: su orden es gate, guion recorrido, dev-lead. El patch que sube a feature (cláusula de escalada) sigue el orden de la feature.
3. **El registro de la validación vive en el borrador del walkthrough (en un patch, §4 de `patch.md`) y `sdd-archive` lo lee de ahí** — su paso 0 ya parte de ese borrador, y su paso 1 actual ya acepta una línea `Validación en campo:` ya escrita en él; el cambio generaliza lo que ya existe. Las cuatro líneas son las vigentes: `Validado:`, `Validación diferida:`, `Validación en campo:` y `Validación por el agente:`.
4. **Un rojo del gate tras el merge de sincronización que no viene de la base devuelve el trabajo a `sdd-implement`**, y su arreglo es una task con su test; el cierre no lo arregla. Es la consecuencia de «`sdd-archive` no tiene ningún paso que edite código». Borrar los tests de feature de «Camino crítico» y juntar el commit de cierre no son arreglos de código y siguen en el cierre.
5. **«Camino crítico» se queda en `sdd-archive`**, con su suite sobre el árbol ya borrado (es otro árbol que el del gate del final de las tasks, y «una vez por árbol» se cumple), sin la frase «In `manual`, 1-2 run before the script» (el guion ya pasó antes del cierre). No añado política de tests al kit: ni «Camino crítico» obligatorio ni «Lo afectado» obligatorio.
6. **Los ficheros `validation-modes.md` y `dev-validation.md` pasan de `skills/sdd-archive/references/` a `skills/sdd-validate/references/`**; `closing-suite.md` se queda en `sdd-archive` (el merge de sincronización y «Camino crítico» son del cierre) y `sdd-validate` lo enlaza para «What runs» y la línea `Gate:`. `validation-template.md` y `sdd-verify` («Running a gate», punto 1, «In the validation and the close») cambian solo el nombre del sitio.
7. **En el kit no hay «sonda»**: es el nombre de la fila. El kit dice «el agente recorre el guion antes de entregarlo» (ya lo dice `dev-validation.md` §1: «Run every step yourself before presenting it») y el proyecto pone el cómo (un proyecto puede tener una skill propia con Playwright). No añado a la skill ningún nombre de herramienta ni de skill de proyecto.
8. **Los requisitos del guion se quedan en la capacidad `archive`** («El guion de la validación empieza por el reporte y lo ha corrido el agente», «Mientras la persona prueba, el agente no lanza nada contra el entorno»): su texto no nombra `sdd-archive` y moverlos de capacidad no cambia ningún comportamiento; solo cambia dónde viven las referencias, en «Reglas de la capacidad».
9. **Topes de palabras**: `sdd-archive` baja, `sdd-implement` casi no cambia y `sdd-validate` entra con tope propio; el saldo conjunto es de +~310 palabras. Pido en el gate el tope de la skill nueva y bajar el de `sdd-archive` (tabla «Topes de palabras»).
10. **Previsión de coste: ~86 $ en ~118 sujetos**, con 9 escenarios nuevos (`vf1`…`vf7` en la batería nueva de `sdd-validate`, `av1` y `av2` en `sdd-archive`), 10 que se mueven de la batería de `sdd-archive` a la de `sdd-validate` con el mismo id y una fila de humo por cada skill editada que no tiene escenario propio (tabla «Previsión de coste»). Es una previsión sin medir en las filas de escenarios nuevos; si la prueba la supera, paro y decide el dev-lead. Pongo la calidad por delante del coste, como pidió el dev-lead.
11. **El bucle de vuelta** — cada vuelta (un fallo del agente al recorrer el guion, de la revisión final o del dev-lead) es una task con su test y corre solo lo que toca el arreglo: los tests que fallaron o nacen, el gate con `--base <sha del último verde>`, los pasos del guion que toca y, solo si la vuelta es posterior a la revisión final, la revisión de su diff. No hay tope de vueltas: cada una cuesta menos que la anterior y el dev-lead decide cuándo parar. Es la forma que pide la fila 0362 y la ampliación de «Una re-revisión nunca abre otra» de la decisión 12.
12. **Una vuelta posterior a la revisión final se revisa una vez, sobre su diff, con un revisor `sdd-kit:effort-high` + `sonnet`** — la fila pide «la revisión de su diff» en cada vuelta; las vueltas anteriores a la revisión final (gate o guion del agente) no llevan revisión propia, porque las cubre la revisión final, para no revisar dos veces el mismo código (dev-lead, al pedir menos revisiones). La regla viva dice que una re-revisión nunca abre otra. Elijo declarar el `MODIFIED` de esa regla: la revisión de una vuelta es una revisión nueva de un diff nuevo, no una re-revisión de la revisión final; un hallazgo suyo entra en la misma vuelta y, si queda abierto, va a ✋ como `sin revisar: <sha>`, sin otra revisión. Descarto «dejar los arreglos de la vuelta sin revisar» porque es el defecto que mide la fila. El modelo es mío (el dev-lead no lo nombró): lo cambia en el gate.
13. **La revisión final sale tras el gate y el guion recorrido, no justo tras el commit de la última task** — cambia el disparador de «El revisor final sale en segundo plano con el commit de la última task» (`verification`); sigue en segundo plano mientras el hilo escribe los borradores de cierre. La ADR nueva sustituye en ese punto a la 0040 (la 0015 y la 0028 ya están sustituidas).
14. **Con validación diferida, o sin respuesta del dev-lead, `sdd-validate` registra `Validación diferida:` y pasa a `sdd-archive`; sin respuesta, la feature queda en espera en `sdd-validate`** — son las condiciones vivas de «La validación puede diferirse con condiciones» y «El trabajo se valida con el usuario antes de cerrar», que no cambian; solo cambia dónde ocurren. En `unattended` se difiere al smoke de la release, como hoy.
15. **El rojo tras el commit de cierre** (decisión 4) vuelve a `sdd-implement` y de ahí a `sdd-validate`: el arreglo es una task con su test y la vuelta corre solo lo que toca; la validación ya dada sigue valiendo y el cambio se registra como «Lo cambiado tras la validación se separa de lo validado» (`feature-flow`, sin cambio); `sdd-archive` reentra rehaciendo el commit de cierre con el arreglo dentro (`commit-history`) y repite el merge de sincronización desde su paso 6, con el `--verified-at` del nuevo gate. Un cambio que el dev-lead pide después de validar sigue esa misma regla.
16. **Los moldes de la batería de `sdd-archive` llevan un borrador de walkthrough con `Validado:`** — con el paso 1 nuevo, un molde sin esa línea devuelve el trabajo a `sdd-implement`; los escenarios existentes de cierre (`a1`…`a8`, `c*`, `cpt*`, `e*`, `g5`…, `ci*`, `tk*`) siguen midiendo lo que miden. Solo `av1` usa un molde sin la línea. Los moldes cambiados cuyos escenarios no corren aquí (`a1`, `a2`, `a4`…`a8`, `c*`, `cpt*`, `e*`, `g5`…, `ci*`, `tk*`) corren con la batería completa de `sdd-archive` antes de la release (Art. I), fuera de esta previsión.
18. **Una skill nueva, `sdd-validate`, y una capacidad nueva, `validation`** — la fase entre las tasks y el cierre (decisión 1). El nombre se parece a `sdd-verify`: su descripción dice que es la validación del dev-lead y la revisión de ejes, y la de `sdd-verify` sigue siendo la evidencia antes de afirmar y la revisión final. El orden y el bucle del dev-lead («gate → guion → revisión → dev-lead», «un fallo vuelve a una task») viven en la capacidad `validation`, no en `implementation`. Es el tope de la skill nueva lo que pido en el gate (decisión 9).
17. **Hotfix y spike quedan fuera de este cambio: su validación no se mueve** — `sdd-archive` conserva para ellos la rama del paso 1 de hoy (smoke y mensaje de `validation-modes.md`, sin bucle), porque no pasan por `sdd-validate`; la lite sí lo recorre como una feature, con su borrador de walkthrough. Es mi decisión mientras el dev-lead no diga otra cosa: si quiere que el hotfix también valide antes de `sdd-archive`, es otro cambio.
- Repaso de coherencia: el delta probado en una copia de `.docs/sdd` con `capability merge` fusiona sin rechazos (9 capacidades, 22 requisitos sustituidos o añadidos, 2 quitados, 3 reglas de `archive` sustituidas) y su diff contra el texto vivo solo muestra las ediciones previstas; `capability check` sobre la spec solo da los avisos de longitud de requisitos de `routing.md` que ya existen en la base; la tabla de «Lo que se retira» recoge cada sitio hallado con `git grep`; `.docs/sdd/steering/operations.md:115` y `PRODUCT.md:57` (que ya dice «antes de `sdd-archive`») no cambian.
- Política de modelos (solo en `delegate`): revisores de la spec, dominio en `opus` y técnica en `sonnet` (arriba) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de las baterías, en `sonnet` y por tandas · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar que piden las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

Dominio (opus):
- **Aceptado** — Crítico: el orden contradice `verification` («El revisor final sale en segundo plano con el commit de la última task», «La revisión se cierra una vez») y `verification` no estaba en Capacidades → `verification` entra en Capacidades con tres `MODIFIED` y la decisión 13.
- **Aceptado** — Crítico: la revisión del diff de cada vuelta choca con «Una re-revisión nunca abre otra» → decisión 12 y `MODIFIED` de esa regla, con revisor, modelo, una sola pasada y su salida a ✋.
- **Aceptado** — Crítico: «ningún paso del cierre arregla código» contradice «Un rojo ajeno se busca en la deuda…» (`archive`) y «El cierre no repite la revisión final» (`verification`) → los dos entran como `MODIFIED`, y `final-review-check.md` entra en el Scope.
- **Aceptado** — Importante: «La implementación la lleva `sdd-implement`» dice «invoca `sdd-archive`, que abre con la validación» → `MODIFIED`. «Lo cambiado tras la validación» no cambia y la decisión 15 dice cómo encaja.
- **Aceptado** — Importante: la validación diferida y la que no se responde bloqueaban el pase a `sdd-archive` → decisión 14 y un AND en el requisito de `sdd-validate`.
- **Aceptado** — Importante: el rojo tras el commit de cierre no decía qué pasa con la validación, el commit de cierre ni el merge de sincronización → decisión 15 y un escenario en el delta de `archive`.
- **Aceptado** — Importante: el bucle de un patch no decía quién revisa el diff → el revisor Sonnet de §4 de `patch.md`, en el `MODIFIED` del patch, y el escenario `vf5`.
- **Rechazado** — Importante: declarar las cinco «Reglas de la capacidad» de `archive` → la plantilla pide solo las entradas que cambian; sí añado «Avisos» (el aviso nuevo) y dejo `Límites` en `archive`, porque lo que dice sigue siendo del cierre salvo la frase que cambia.
- **Aceptado** — Importante: la métrica del Intent no la mide ninguna batería, y faltan los bordes del bucle (un fichero de «Sin filtro», un fallo de la revisión) → la métrica pasa a «de campo» y entran `vf6` y `vf7`.
- **Aceptado** — Menor: el ejemplo `cancelar Norte el martes` enseñaba a arreglar el código para un resultado esperado equivocado, y el texto nombraba un proyecto real → el ejemplo es `cancelar Norte lun` y el texto dice «un proyecto consumidor».

Técnica (sonnet):
- **Aceptado** — Crítico: los ids `a9`, `f2`, `g1`, `g2`, `t2` y `t3` ya existen en las baterías → ids nuevos (`vf1`…`vf7`, `av1`, y `vg1`, `vg2`, `vg3`, `vg4`, `vv1a`, `vv1b`, `vse1`, `vt1`, `vt2`, `vt3` para los que se mueven).
- **Aceptado** — Crítico: los demás escenarios de `sdd-archive` piden «Ciérrala» sin validación registrada y pasarían a devolverse → decisión 16 (los moldes llevan `Validado:`), `g3` entra entre los que se mueven, y el esperado de `a3r` cambia.
- **Aceptado** — Importante: `MODIFIED` que faltaba en «Un rojo ajeno…» → entra (con el de `verification`).
- **Aceptado** — Importante: la tabla de «Lo que se retira» no recogía `closing-suite.md:7,31-33,37`, `commit-milestones.md:11`, `sdd-templates/SKILL.md:24`, `control-profiles.md:86` ni `validation-template.md:11` → añadidos con su destino.
- **Aceptado** — Importante: el ancla `closing-suite.md#in-the-validation` muere y `tests/dev-validation-green.md` enlaza la ruta vieja → «Lo que se retira» dice a dónde se reapuntan y `tests/dev-validation-green.md` entra en Scope.
- **Aceptado** — Importante: sujetos y coste no cuadraban → tabla rehecha, con 105 sujetos y ~80 $.
- **Aceptado** — Importante: el bucle no estaba en ✋ → decisión 11, y las 12 a 16.
- **Aceptado** — Menor: aritmética de topes (8221 y 2781) y el de `sdd-archive` `SKILL.md` → corregidos, y `sdd-archive` `SKILL.md` baja a lo previsto + 2 %.
- **Aceptado** — Menor: el último AND de «La verificación del merge es el gate de merge» → reescrito en el `MODIFIED`.
- **Aceptado** — Menor: los `MODIFIED` de solo redacción no tenían escenario ni se decía → «Dónde se prueba» los declara como tales y añade un test de que `sdd-implement` no nombra ninguna herramienta de proyecto.

Segunda ronda (sonnet, siete puntos):
- **Aceptado** — Crítico: «La revisión se cierra una vez» seguía vigente y chocaba con el bucle → `MODIFIED` (tras la pasada de fix corren el gate con `--base` y los pasos del guion que toca) y el bucle declara que un fallo de la revisión final sigue ese mecanismo, no el de la vuelta.
- **Aceptado** — Crítico: «Con camino crítico…» decía «en el paso de validación corre Tests de feature» → `MODIFIED`, y la decisión 5 dice que su suite corre sobre el árbol ya borrado, que es otro árbol que el del gate del final de las tasks.
- **Aceptado, en parte** — Importante: requisitos de `control-profiles` y `closing-suite` con «el cierre»/«la validación» → el Scope los recoge para alinearse con una enmienda en la task de capacidades; no se declaran aquí porque el verbo «cierra» de «La validación puede diferirse…» y «La spec dice quién valida» nombra el trabajo entero y sigue siendo cierto.
- **Aceptado** — Importante: hotfix, spike y lite sin carril claro → decisión 17, con la pregunta pendiente del dev-lead.
- **Aceptado** — Importante: la reentrada no tenía escenario → `av2`.
- **Aceptado** — Importante: moldes cambiados sin ejecutar y skills editadas sin humo → decisión 16 y la fila de humo del coste.
- **Aceptado** — Importante: tabla y decisión 10 no alineadas con `g3` → alineadas (10 escenarios movidos).
- **Aceptado** — Importante: `kit:own`, `kit:copies` y la frase de `verification.md` sobre `sdd-verify` → Scope y `MODIFIED`.
- **Aceptado** — Menor: «cuánto tardó la suite completa» → «el gate de cierre».
- **Aceptado** — Menor: el GIVEN del bucle y el criterio «edite código» → ejemplo `cancelar Norte lun` y «arregle código».

Enmienda al enfoque C (sonnet, siete puntos):
- **Aceptado** — Crítico: hotfix y spike quedaban sin carril → el paso 1 de `sdd-archive` conserva su rama de hoy para ellos (decisión 17 y un AND del requisito).
- **Aceptado** — Importante: la aprobación seguía siendo la del enfoque A → `status: in-review` y una fila de aprobación pendiente.
- **Aceptado** — Importante: restos del renombrado (tres sitios) → corregidos a `sdd-validate`.
- **Aceptado** — Importante: la capacidad `validation` no tenía sus reglas → bloque «Reglas de la capacidad — validation».
- **Aceptado** — Importante: el disparador de los ejes en SDD → los despacha `sdd-validate` en los dos métodos.
- **Aceptado, en parte** — Importante: lo que cuesta una skill nueva → el recuento y las `description` de `sdd-archive`, `sdd-verify` y `sdd-implement` entran en el plan; `using-sdd`, `architecture.md` y los tests no listan skills que no son de entrada, comprobado con `git grep`.
- **Aceptado** — Importante: topes de palabras → `sdd-validate` 1735 y 655, `sdd-implement` baja.
- **Aceptado** — Importante: el plan nombraba `sdd-implement` donde era `sdd-validate`, y `av1`/`av2` en la batería equivocada → corregido.
- **Aceptado** — Menor: conteos, `document-manager` en el test de neutralidad y por dónde reentra el rojo posterior al cierre → corregidos (decisión 15).

### Decisiones tomadas con el dev-lead

- La revisión de la vuelta solo va tras la revisión final; las vueltas anteriores las cubre esa revisión — «sí, déjalo así y apruebo» (dev-lead, 2026-11-24, a la pregunta de si la revisión de la vuelta va solo después de la revisión final, por su preocupación de «hacer demasiadas revisiones»)
- Aprobación de la spec, con las decisiones 1 a 17 de ✋, los topes de palabras y la previsión de coste de las pruebas — «sí, déjalo así y apruebo» (dev-lead, 2026-11-24); la decisión 17 (hotfix y spike) queda pendiente del dev-lead
- Dos revisores en paralelo para la review de esta spec, con Opus para el dominio y Sonnet para la técnica — «1» (dev-lead, 2026-11-24, a la pregunta de la review)

- La validación es parte de la implementación y sus arreglos no son del cierre — «si encontramos fallos en la validacion no es parte del cierrre, la validacione s parte de la implementracion» (dev-lead, 2026-11-24)
- No se pasa a `sdd-archive` hasta que el dev-lead valida — «no tienes que pasar a sdd-archive hasta que yo haya validado la tarea» (dev-lead, 2026-11-24)
- El guion que recibe el dev-lead ya lo ha recorrido el agente — «la prueba final mia tiene que ser el 90% de las veces que esta bien» (dev-lead, 2026-11-24)
- El gate no corre entero: filtrado por lo afectado si el proyecto lo declara, y entero solo con un fichero de «Sin filtro» — «El gate completo nucna se debe correr en el fondo» (dev-lead, 2026-11-24)
- El kit fija el orden y que el agente recorra el guion; el cómo es del proyecto — «el kit no puede hacer lo que debe hacer el repo» (dev-lead, 2026-11-24, por la sesión «sdd-kit develop»)
- La calidad por delante de los tokens: no se recorta ningún paso para ahorrar — «si trada lo mismo gasta mas tokens y sale mejor codigo me sirve… lo principal es la calidad de la solucion» (dev-lead, 2026-11-24, por la sesión «sdd-kit develop»)
- El agente recorre el guion antes de la revisión final, y la revisión va sobre lo ya validado — «la repsuesta es 1» (dev-lead, 2026-11-24, a la pregunta de si la revisión final va después de que el agente recorra el guion)
- Una skill propia para la validación, para que las baterías sean más pequeñas y la frontera clara: «separar en un paso, si no valida devuelve el control a implement», y que el cambio sea «quirúrgico» (dev-lead, 2026-11-24)
- Se escribe una ADR nueva y las baterías de `sdd-archive` y de `sdd-implement` que miden la validación se actualizan (fila 0362 del roadmap, `Toca:`)

## Intent

Hoy el final de `sdd-implement` pasa a `sdd-archive`, cuyo paso 1 es la validación: gate completo, guion recorrido por el agente y dev-lead. Los arreglos que la validación provoca llegan por tanto después de la revisión final, sin revisar, y se fusionan: en los transcripts de 17 sesiones de feature v3 de un proyecto consumidor (2026-11-17 a 2026-11-24), 10,8 ediciones de código por sesión en el cierre (0760: 80; 0759: 29; 0695: 21), frente a 6,8 de la pasada de arreglos de la revisión final. La regla viva ya dice lo contrario (`feature-flow`, «antes de invocar `sdd-archive`… espera la validación explícita»); las skills se desviaron desde la decisión 5 de la 0149 y `64a86577c`.

El éxito: en la batería, un sujeto de feature corre el gate filtrado, recorre el guion, hace la revisión y presenta la validación antes de invocar `sdd-archive`; un fallo en la validación vuelve a una task con su test y la vuelta corre solo lo que toca el arreglo; y `sdd-archive` no tiene ningún paso que arregle código (borrar los tests de feature de «Camino crítico» y juntar el commit de cierre no son arreglos). La métrica de campo es «ediciones de código tras la revisión final por sesión» (hoy 10,8): no la mide la batería sino los transcripts de los proyectos tras la release, a través de los tickets de `sdd-feedback`.

Anti-goals: que el kit nombre una herramienta o una skill de proyecto para recorrer el guion; que añada política de tests (camino crítico u «Lo afectado» obligatorios); que se recorte un paso para ahorrar tokens.

## Scope

- Entra: la skill nueva `sdd-validate` con el orden gate → guion recorrido → revisión final → validación del dev-lead y el bucle de vuelta a `sdd-implement`; `sdd-implement` y sus dos métodos, Native y SDD, que la invocan al acabar la última task; `sdd-archive` que comprueba que la validación está registrada y no arregla código; las referencias de validación en `sdd-validate`; las capacidades y la ADR; las baterías.
- Entra: los patches, sin revisión final (decisión 2).
- Entra, además: el recuento de skills (28 → 29) y la lista de PRODUCT.md en `README.md:3`, `PRODUCT.md:16` y `CLAUDE.md:22`; las marcas `<!-- kit: incluye … -->` de los ficheros que se mueven y las reglas de `kit:own` y `kit:copies`, que comprueba el gate del repo; la frase de `verification.md` «la comprobación de la revisión final de `sdd-archive` invoca `sdd-verify`» (delta); y la redacción de los requisitos de `closing-suite` («El walkthrough dice de dónde sale cada THEN», «La suite E2E del cierre…») y de `control-profiles` que dicen «el cierre» o «la validación» para el gate o el cierre, que se alinean en la task de capacidades con una enmienda a esta spec.
- Entra, además de lo de la lista siguiente: `skills/sdd-archive/references/final-review-check.md` (si falta una re-revisión, el cierre devuelve a `sdd-validate` en vez de despacharla), `skills/sdd-implement/references/commit-milestones.md`, `skills/sdd-templates/SKILL.md`, `tests/dev-validation-green.md` (el enlace roto) y un test de `cli/test/kit/` que comprueba que ni `skills/sdd-validate/` ni sus referencias nombran Playwright, `validation-script` ni un proyecto concreto.
- Entra, los ficheros que implementan los `MODIFIED`: `skills/sdd-implement/SKILL.md`, `skills/sdd-implement/references/patch-flow.md` y `frontend-verification.md`, `skills/sdd-implement-native/SKILL.md`, `skills/sdd-implement-subagent/SKILL.md`, `skills/sdd-archive/SKILL.md`, `skills/sdd-archive/references/closing-suite.md`, `merge-recipe.md`, `validation-modes.md` y `dev-validation.md` (estos dos, movidos), `skills/sdd-verify/SKILL.md`, `skills/sdd-propose/references/control-profiles.md`, `skills/sdd-templates/templates/validation-template.md` y `patch-template.md`, `cli/test/kit/word-budget.test.ts` (los topes), las ocho capacidades, `.docs/workflow/`, la ADR y las dos baterías.
- No entra: cómo se recorre el guion (es del proyecto); el contenido del guion y del mensaje de validación (`validation-template.md` cambia solo el nombre del sitio); el modo `field` y `Validación: agente` (siguen igual, en su sitio nuevo); la migración de los proyectos (el cambio no pide nada al proyecto: sin pasos propios, solo el marcador de la release); el merge de sincronización y el merge (siguen como hoy).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Paso 1 «Validation» de `sdd-archive` (los tres modos y «The suite») | `skills/sdd-archive/SKILL.md` paso 1, y sus referencias en pasos 6 y 7 («The suite on the sync merge», «A red suite») | Decisiones 3, 4 y 6: el paso 1 comprueba el registro de la validación; la validación vive en `sdd-validate` |
| `validation-modes.md` y `dev-validation.md` en `sdd-archive/references/` | `skills/sdd-archive/references/`, `skills/sdd-implement/SKILL.md:54`, `skills/sdd-templates/templates/validation-template.md` (cabecera), `archive.md` «Dónde viven los datos» | Decisión 6: pasan a `sdd-validate/references/`; el delta modifica «Reglas de la capacidad — archive» |
| «In the validation» y la frase «In `manual`, 1-2 run before the script» | `skills/sdd-archive/references/closing-suite.md` («In the validation», «With "Camino crítico"» punto 5) | Decisión 5 y delta de `closing-suite`: el gate corre al acabar las tasks |
| «el gate… una sola vez, en la validación final» | `skills/sdd-implement/SKILL.md:58`, `implementation.md` «El gate de cierre se ejecuta una vez» | Delta de `implementation`, `MODIFIED` |
| «su primer paso es la validación» | `skills/sdd-implement-native/SKILL.md:303`, diagrama de `skills/sdd-implement-subagent/SKILL.md:75,101` | El pase a `sdd-archive` va tras la validación registrada: edición de las dos skills |
| «In the validation and the close» | `skills/sdd-verify/SKILL.md` «Running a gate», punto 1 | Decisión 6: cambia el nombre del sitio, sin cambio de regla |
| El patch valida en `sdd-archive` | `implementation.md` «Un patch sigue en `sdd-implement`…», `routing.md` «Un patch visual…», `skills/sdd-implement/references/patch-flow.md` | Decisión 2, delta de `implementation` y `routing` |
| «El trabajo se valida con el usuario antes de cerrar» (orden: revisión → validación) | `feature-flow.md:41-53`, `feature-flow.md:89-95`, `feature-flow.md:131-138`, `feature-flow.md:140-145` | Delta de `feature-flow`, `MODIFIED` |
| «Con otra rama abierta o la base por delante, la suite corre una sola vez, tras el merge de sincronización» | `closing-suite.md:58-66`, `archive.md` «Límites» | Delta de `closing-suite`, `REMOVED`, y «Reglas de la capacidad — archive» |
| Validación «del cierre de `sdd-archive`» en el bloque `merge`, el gate y las capturas | `closing-merge.md:15,103`, `frontend-verification.md:24`, `control-profiles.md:119-125` | Delta de `closing-merge`, `frontend-verification` y `control-profiles`, `MODIFIED` |
| «the validation's suite», «the validation (step 1 of `sdd-archive`)», «validation of `sdd-archive`» | `skills/sdd-archive/references/merge-recipe.md:9`, `skills/sdd-implement/references/frontend-verification.md:38`, `skills/sdd-propose/references/control-profiles.md:150`, `skills/sdd-implement-native/SKILL.md:99,124,290`, `skills/sdd-templates/templates/patch-template.md:63`, `skills/sdd-templates/templates/validation-template.md:3` | Decisión 6: solo cambia el nombre del sitio (el gate de «al acabar las tasks», la validación de «`sdd-validate`»); edición de cada fichero en la task de textos |
| «No suite yet (step 1 left it for here)», «the validation's suite», «the validation's sha», «the validation's run» | `skills/sdd-archive/references/closing-suite.md:7,31,32,33,37` | «No suite yet» desaparece porque el gate siempre corre al acabar las tasks; «the validation's suite/sha» pasa a «el gate de cierre del final de las tasks» y su sha |
| Ancla `closing-suite.md#in-the-validation` | `skills/sdd-archive/references/validation-modes.md:7` | La sección «In the validation» se reescribe y el enlace reapunta a `../../sdd-archive/references/closing-suite.md#what-runs`; los demás enlaces relativos de los dos ficheros movidos conservan su profundidad |
| «fixes… of the validation» en el commit de cierre | `skills/sdd-implement/references/commit-milestones.md:11` | Se mantiene el juntado, pero los arreglos de la validación ya existen al llegar al cierre: se reescribe la frase |
| «Presented by `sdd-archive`» | `skills/sdd-templates/SKILL.md:24`, `skills/sdd-templates/templates/validation-template.md:3,11` | Decisión 6: pasa a `sdd-validate` |
| «the message the closing is invoked with» | `skills/sdd-propose/references/control-profiles.md:86` | Pasa a «the message `sdd-archive` is invoked with, after the validation» |
| Enlace a `skills/sdd-archive/references/dev-validation.md` | `tests/dev-validation-green.md:3` | Evidencia histórica: se reapunta a la ruta nueva |
| «Un rojo ajeno se busca en la deuda…»: «vuelve a ella, arregla con un test que falla primero y vuelve al gate» | `.docs/sdd/capabilities/archive.md:27-40`, rúbrica de `a3r` en `tests/batteries/sdd-archive/battery.md:158` | Delta de `archive`, `MODIFIED` (el rojo de la rama devuelve a `sdd-implement`); cambia el esperado de `a3r` |
| «El cierre no repite la revisión final» (despacha la única re-revisión) | `.docs/sdd/capabilities/verification.md:170-179`, `skills/sdd-archive/references/final-review-check.md` | Delta de `verification`, `MODIFIED` (el cierre devuelve a `sdd-implement` lo que falta por revisar) |
| «El revisor final sale en segundo plano con el commit de la última task», «La revisión se cierra una vez», «Una re-revisión nunca abre otra» | `.docs/sdd/capabilities/verification.md:85,104,128` y las ADR 0040 y anteriores | Delta de `verification`, `MODIFIED`; la ADR nueva sustituye a la 0040 en ese punto |
| «invoca `sdd-archive`, que abre con la validación» | `.docs/sdd/capabilities/implementation.md:166-172` | Delta de `implementation`, `MODIFIED` |
| Fila «Validation (closing of feature and patch)» de la tabla de paradas | `skills/sdd-propose/references/control-profiles.md:60` | Se renombra a «Validation (end of implementation of feature and patch)»; las celdas no cambian |
| La validación «antes de cerrar» descrita en el flujo para el dev | `.docs/workflow/greenfield.md:75`, `.docs/workflow/usage-guide.md:159,182,197` | Doc del flujo del repo: se relee al subir de versión (`workflow-docs.test.ts`); se actualiza en la task de textos con el marcador «Última revisión» |
| «Gate:» en el «paso 1 de `sdd-archive`» como ejemplo histórico | `.docs/sdd/steering/operations.md:115` | Se queda: es el registro de una feature pasada (0236), no una instrucción |
| Escenarios que miden la validación en la batería de `sdd-archive`: `g1`, `g2`, `g3`, `g4`, `v1a`, `v1b`, `se1`, `t1`, `t2`, `t3` | `tests/batteries/sdd-archive/battery.md:90-99` | Se mueven a `tests/batteries/sdd-validate/battery.md` con su procedencia; los moldes de los demás llevan `Validado:` (decisión 16) |

- Filas que implementa: 0362 → ficheros que la nombran: `ROADMAP.md` (la fila, que `sdd-archive` marca) y `.docs/sdd/steering/estimation-log.md` (lo genera el script) | nada más: comprobado con `grep -rn "0362" --include="*.md" . --exclude-dir=dist --exclude-dir=.git`

## Approach

- **A. La validación es el final de `sdd-implement`** — mover el paso 1 de `sdd-archive` y sus dos referencias a `sdd-implement`. Cuesta: un `SKILL.md` de `sdd-implement` más largo y las baterías de `sdd-implement` y de `sdd-archive` más grandes: los escenarios de la validación necesitan los moldes de «la 0010 con las tasks acabadas», que hoy solo están en `subject.mjs` de `sdd-archive`.
- **B. La validación sigue en `sdd-archive` y un fallo devuelve el trabajo a `sdd-implement`** — el cambio mínimo en texto. Cuesta: `sdd-archive` sigue teniendo una parada con el dev-lead y un paso que puede editar, y el criterio de hecho («sin ningún paso que arregle código») no se cumple.
- **C. Una skill nueva entre las dos (`sdd-validate`)** — la fase entre las tasks y el cierre, con su propia batería. Cuesta: una skill más (28 → 29) con su entrada medida (Art. I), los moldes de la validación copiados a su batería, un nombre que se parece a `sdd-verify` (la descripción de cada una dice cuál es la validación del dev-lead y cuál la revisión del agente) y un pase más entre skills.
- Elegido: **C** — lo pidió el dev-lead al ver que las baterías crecían: «separar en un paso, si no valida devuelve el control a implement». Gana frente a A porque la validación tiene su contrato, su batería y su bucle, y `sdd-implement` no engorda; frente a B, porque `sdd-archive` deja de tener un paso que edita. El OpenSpec que usa el kit como fuente separa igual `apply`, `verify` y `archive`.

Las partes del cómo que fija C:

**El orden de `sdd-validate`** (decisión del dev-lead: «la repsuesta es 1»). `sdd-implement` la invoca al acabar la última task. En una feature:

1. El gate de cierre, una vez: el de `operations.md` §Testing, filtrado por lo afectado si el proyecto lo declara, y entero solo si la rama toca un fichero de «Sin filtro» (`closing-suite.md`, «What runs»).
2. El agente recorre el guion entero, tal como lo hará el dev-lead.
3. La revisión final de ejes (`sdd-verify`), sobre lo ya validado.
4. La validación del dev-lead, con el mensaje de `validation-template.md`: guion con sus pasos ya recorridos.
5. Registro de la validación en el borrador del walkthrough y pase a `sdd-archive`.

Con `validation.mode: field` o `Validación: agente`, el paso 4 es la verificación del agente, sin parada, y el 5 igual. En un patch el orden es 1, 2, 4, 5 (sin revisión final).

**El bucle de vuelta.** Un fallo del agente al recorrer el guion, de la revisión final o del dev-lead devuelve el control a `sdd-implement`, que lo hace como una task nueva al final del plan con su test (RED → GREEN), y vuelve a `sdd-validate`. Cada vuelta corre solo lo que toca el arreglo: el test nuevo y los que fallaron, el gate con `--base <sha del último verde>` («Running a gate», punto 3, de `sdd-verify`), los pasos del guion que toca el arreglo y, si la vuelta es posterior a la revisión final, la revisión de su diff. Un arreglo que toca un fichero de «Sin filtro» corre el gate sin filtro. La revisión de una vuelta posterior a la revisión final la hace un revisor `sdd-kit:effort-high` + `sonnet`, una sola vez (en un patch, el revisor Sonnet de §4 de `patch.md`); las vueltas anteriores a la revisión final no llevan revisión propia, porque las cubre; un hallazgo suyo entra en la misma vuelta y, si queda abierto, va a ✋ como `sin revisar: <sha>`. Tras la vuelta, la validación sigue desde donde se paró. Un cambio que el dev-lead pide después de validar sigue «Lo cambiado tras la validación se separa de lo validado» y no vuelve a pedir la validación.

**La revisión final** sale en segundo plano cuando acaban el gate y el guion recorrido, y el hilo escribe los borradores de cierre mientras trabaja (como hoy, pero con otro disparador). Con la validación diferida, o sin respuesta del dev-lead, `sdd-validate` registra `Validación diferida:` o espera, como dicen «La validación puede diferirse con condiciones» y «El trabajo se valida con el usuario antes de cerrar».

**Qué hace `sdd-archive` con la validación.** Su paso 1 comprueba que el borrador del walkthrough (en un patch, `patch.md` §4) lleva una de las cuatro líneas de registro; sin ella, no valida ni presenta guion: devuelve el trabajo a `sdd-validate`. Los pasos que vienen después (registros, commit de cierre, merge de sincronización, merge) quedan como hoy. Tras el merge de sincronización, solo corren las tareas que cruzan la rama y la base. Un rojo ahí que no viene de la base vuelve a `sdd-implement` (decisiones 4 y 15). Si la comprobación de la revisión final (`final-review-check.md`) encuentra un commit sin revisar, tampoco despacha la re-revisión: devuelve el trabajo a `sdd-validate`.

**Qué hace cada skill.** `sdd-validate` lleva el orden, el bucle y las referencias de validación (`validation-modes.md`, `dev-validation.md`); `sdd-implement` acaba invocándola con `Skill` y sus dos métodos, Native y SDD, solo cambian dónde acaban: tras la última task, siguen en `sdd-validate`, que con la validación registrada invoca `sdd-archive`. El borrador de cierre que `sdd-implement` ya escribe mientras los ejes revisan (el «Closing drafts») es donde queda el registro, y pasa a escribirlo `sdd-validate`.

## Dónde se prueba

La batería nueva `tests/batteries/sdd-validate/` (con su `subject.mjs`) lleva los escenarios nuevos `vf1`…`vf7` y los 11 que se mueven desde `sdd-archive` (los diez de la validación y `g7`, el gate entero si la rama toca el build, que ya no corre en el cierre; `g6`, la suite única tras la base, se retira porque mide un requisito que la spec quita) (`g1`, `g2`, `g3`, `g4`, `v1a`, `v1b`, `se1`, `t1`, `t2`, `t3`), que conservan su id y su procedencia; en la batería de `sdd-archive` entran `av1` y `av2`. Ningún id nuevo choca con los de su batería.

- El orden de `sdd-validate` (gate, guion, revisión, dev-lead, `sdd-archive`): `vf1`, un sujeto de feature con `validation.mode: manual` que acaba las tasks y llega al mensaje de validación; se mide por la secuencia de sus comandos.
- El bucle de vuelta tras un fallo del dev-lead: `vf2`, con «el paso 3 falla» tras la presentación; se mide que devuelve el control a `sdd-implement`, que la vuelta es una task con su test y que corre el test, el gate con `--base <sha del último verde>`, el paso tocado y la revisión del diff, y no el gate entero.
- El agente que arregla un paso del guion al recorrerlo, antes de la revisión: `vf3`, con un paso que falla al recorrerlo; se mide que la vuelta no lleva revisión propia, porque la cubre la revisión final.
- La validación diferida y la que no se responde: `vf4`, con «lo pruebo mañana en la primera exportación, a cargo del dev-lead»: registra `Validación diferida:` y pasa a `sdd-archive`.
- El final de un patch (gate, guion y dev-lead; sin ejes) y su vuelta: `vf5`, sobre el molde `salas-patch`, con un fallo del dev-lead que pasa por el revisor Sonnet de §4.
- La vuelta que toca un fichero de «Sin filtro»: `vf6`, con un arreglo en `package.json`; corre el gate sin filtro.
- El fallo que sale de la revisión final: `vf7`; se mide que sigue la pasada de fix de la revisión, que después corre el gate con `--base` y los pasos del guion que toca, y que no lleva revisión de vuelta.
- `validation.mode: field` y `Validación: agente`: los movidos `v1b` y `t3`.
- El paso de `sdd-implement` a `sdd-validate` al acabar la última task: los humos `h1` y `h2` de la batería de `sdd-implement` (su rúbrica cambia: la invocación siguiente es `sdd-validate`).
- `sdd-archive` sin validación registrada, que la devuelve a `sdd-validate`: `av1`, con un molde sin `Validado:`. Con validación registrada, los escenarios existentes de cierre (`a1`…`a8`, `c*`, `cpt*`, `e*`…) miden lo suyo con moldes que llevan `Validado:` (decisión 16).
- La reentrada tras un rojo posterior al commit de cierre: `av2`, con un rojo de la rama tras `sdd merge --sync`; se mide que devuelve el trabajo a `sdd-implement` sin arreglarlo, y que al volver rehace el commit de cierre y repite el sync.
- Los `MODIFIED` que solo cambian el nombre del sitio (`feature-flow`: «decisión sola», «entorno parado», «base al día»; `frontend-verification`; `routing`; `control-profiles`, fila de la tabla de paradas) son de redacción: no llevan escenario, y el cambio lo comprueba la lectura del texto y el test de que `sdd-validate` no nombra ninguna herramienta de proyecto.
- Los `MODIFIED` de `closing-suite` y `closing-merge` los miden `a3`, `a3r`, `a3a` y `a5` ya existentes, que corren como controles.
- `kit:copies`, `kit:skill-size`, `kit:own` y el test `word-budget.test.ts`: por el gate del repo.

## Términos y ADR

- Términos resueltos: **sonda** — nombre de la fila 0362 para «el agente recorre el guion antes de entregarlo»; en el kit no se usa, y el proyecto la llama como quiera.
- ADR candidatas: **La validación es parte de la implementación** — alternativa descartada: validar en el paso 1 de `sdd-archive` (la decisión 5 de la 0149), que dejaba los arreglos de la validación fuera de la revisión final; sustituye a la ADR 0040 en el disparador de la revisión final (decisión 13)

## Delta de comportamiento

### Capacidad: `implementation`

#### MODIFIED — El gate de cierre se ejecuta una vez

- GIVEN una constitution que pide el gate completo en verde al cerrar cada task
- WHEN se escribe el plan y se despacha una task de solo frontend
- THEN el gate de cierre aparece una sola vez, al acabar las tasks, en `sdd-validate`, y lo ejecuta el hilo principal
- AND no aparece en «De código» ni en la verificación de esa task, y el encargo de su implementador le dice que ejecute su verificación y no la suite completa
- AND corre el que declara `operations.md` §Testing, filtrado por lo afectado si el proyecto lo declara, y entero solo si la rama toca un fichero de «Sin filtro»
- AND tras su merge de sincronización, el cierre de `sdd-archive` repite solo lo que afecta lo que trajo la base: las tareas que cruzan la rama y la base

#### MODIFIED — Un patch sigue en `sdd-implement`, con verificación y sin revisión final

- GIVEN el patch 0031, confirmado en `sdd-propose`: si cancelo Norte el martes, que no tengo reservado, me quita la del lunes
- WHEN `sdd-propose` lo entrega
- THEN invoca `sdd-implement`, que lee lo primero `references/patch-flow.md` y sigue su flujo: causa raíz, `patch.md`, fix mínimo y commit; ni el Setup ni los bucles de tasks aplican
- AND antes de decir que está arreglado, §4 de `patch.md` lleva el comando del test y su salida leída en esta sesión, como dice la «Gate Function» de `sdd-verify`
- AND antes del commit del fix, un revisor en Sonnet lee `patch.md` y el diff —la causa raíz, el arreglo y su test— y §4 responde cada hallazgo: arreglado, o rechazado con su motivo
- AND no se despacha ningún eje de la revisión final; tras el commit del fix invoca `sdd-validate`, que corre el gate, recorre el guion y presenta la validación, como en una feature, y solo con la validación registrada sigue en `sdd-archive`; una vuelta tras un fallo del dev-lead pasa por ese mismo revisor Sonnet de §4 antes de volver a presentar

#### MODIFIED — La implementación la lleva `sdd-implement`

- GIVEN la feature 0042 en modo full, con la spec aprobada y el plan con `Ejecución: native, porque 2 tasks encadenadas por la interfaz de Ledger, …`
- WHEN `sdd-propose` entrega la feature
- THEN invoca `sdd-implement`, que invoca `sdd-implement-native` con `Skill`; esta ejecuta las dos tasks en Native y, con la última hecha, invoca `sdd-validate`, que corre el gate, recorre el guion, hace la revisión final y presenta la validación, y con la validación registrada invoca `sdd-archive`, que abre comprobando esa validación
- AND con `Ejecución: subagent`, `sdd-implement` invoca `sdd-implement-subagent`
- AND ningún texto que carga el agente (`skills/` sin las marcas `<!-- kit: … -->`) invoca `superpowers:executing-plans` ni `superpowers:subagent-driven-development`
- AND en modo lite, sin plan, el método es el de `execution` si está fijado y Native con `auto`, con `spec.md` en el lugar del plan

### Capacidad: `validation`

#### ADDED — `sdd-validate` valida antes de pasar al cierre

- GIVEN la 0012 en `validation.mode: manual`, con sus tres tasks acabadas y commiteadas
- WHEN `sdd-implement` acaba la Task 3 e invoca `sdd-validate`
- THEN corre el gate de cierre una vez, después recorre el guion de pruebas entero tal como lo recorrerá el dev-lead, después despacha la revisión final sobre lo ya validado y por último presenta el mensaje de validación
- AND no invoca `sdd-archive` hasta que el dev-lead valida; con `validation.mode: field` o `Validación: agente` no para, y lo invoca cuando ha registrado su verificación
- AND con la validación diferida (`Diferir: lo pruebo en la primera exportación, a cargo del dev-lead`) o en `unattended`, registra `Validación diferida:` con su disparador y pasa a `sdd-archive`; si el dev-lead no responde, la feature queda en espera en `sdd-validate` con el smoke documentado
- AND un paso del guion que falla al recorrerlo, `cancelar Norte lun → «cancelada lun»` que, con la reserva del lunes creada, devuelve «no hay reserva lun», se arregla en una task con su test, antes de la revisión final
- AND el kit fija ese orden y que el agente recorra el guion; con qué herramienta lo recorre lo declara el proyecto, y la skill no nombra ninguna
- AND la validación se registra en el borrador del walkthrough (en un patch, §4 de `patch.md`) con una de `Validado:`, `Validación diferida:`, `Validación en campo:` o `Validación por el agente:`

#### ADDED — Un fallo de la validación vuelve a una task y la vuelta corre solo lo que toca el arreglo

- GIVEN la 0012 con el gate en verde en `a1b2c3d`, la revisión final hecha y el dev-lead que responde «el paso 3 falla: `cancelar Norte lun` dice «cancelada lun» y me quita también la del martes»
- WHEN `sdd-validate` lo devuelve a `sdd-implement` y el agente lo arregla
- THEN el arreglo es una task con su test, que falla antes y pasa después
- AND corre el test nuevo y los que fallaron, el gate con `--base a1b2c3d`, los pasos del guion que toca el arreglo y, al ser posterior a la revisión final, la revisión de su diff
- AND no corre el gate entero, el guion entero ni la revisión final entera
- AND si el arreglo toca un fichero de «Sin filtro», corre el gate sin filtro
- AND lo mismo con un fallo del agente al recorrer el guion; un fallo de la revisión final sigue «La revisión se cierra una vez» (una sola pasada de fix) y después corre el gate con `--base` y los pasos del guion que toca
- AND la revisión de su diff la hace un revisor `sdd-kit:effort-high` + `sonnet`, una sola vez, y un hallazgo suyo que queda abierto va a ✋ como `sin revisar: <sha>`
- AND una vuelta anterior a la revisión final (un fallo del gate o del guion del agente) no lleva revisión propia: la cubre la revisión final, que sale después
- AND tras la vuelta la validación sigue desde el paso que falló, y no pasa a `sdd-archive` hasta que el dev-lead valida; un cambio que el dev-lead pide después de validar sigue «Lo cambiado tras la validación se separa de lo validado» y no repite la validación

#### Reglas de la capacidad — validation

- **Dónde viven los datos**: la skill en `skills/sdd-validate/`; qué corre, envía y registra cada modo de validación, en `skills/sdd-validate/references/validation-modes.md`; cómo se compone y se ensaya el guion y el entorno, en `skills/sdd-validate/references/dev-validation.md`; la forma del mensaje, en `validation-template.md` de `sdd-templates`; la batería, en `tests/batteries/sdd-validate/`
- **Idioma de los nombres**: skill y ficheros en inglés kebab-case; las líneas de registro, en castellano (`Validado:`, `Validación diferida:`, `Validación en campo:`, `Validación por el agente:`, `no ensayado:`)
- **Límites**: tope de palabras de `sdd-validate`, el de `cli/test/kit/word-budget.test.ts`; el gate de cierre corre una vez al acabar las tasks; cada vuelta corre solo lo que toca el arreglo y no hay tope de vueltas; una vuelta posterior a la revisión final lleva una sola revisión de su diff
- **Avisos**: `no ensayado: <motivo>` y `sin revisar: <sha> — <qué cambia>`
- **Regla ante conflicto**: un hallazgo del dev-lead que cambia la spec es un desvío y para como dice `sdd-implement`; una vuelta nunca abre otra revisión final

### Capacidad: `feature-flow`

#### MODIFIED — El trabajo se valida con el usuario antes de cerrar

- GIVEN una feature con las tasks acabadas, el gate en verde, el guion recorrido por el agente y el cierre de la revisión final terminado (sin Critical abiertos ni Important sin adjudicar), en un proyecto con `validation.mode` `manual` o sin la clave, y una spec sin `Validación: agente`
- WHEN el agente va a cerrar
- THEN antes de invocar `sdd-archive` presenta el mensaje de `validation-template.md`, empezando por un párrafo con 🦆 sobre lo que cambia para quien usa el producto y siguiendo con «✋ Me salí del plan en…», las decisiones sin el dev-lead, el smoke que ejecutó y el guion de pruebas, el último, y espera la validación explícita (qué probó el usuario y que funciona; «cierra la tarea» no lo es)
- AND el guion de pruebas son pasos numerados, cada uno con una acción en la aplicación y su resultado esperado, compuestos y ensayados como dice «El guion de la validación empieza por el reporte y lo ha corrido el agente» de [`archive`](archive.md). Va separado del smoke.
- AND el smoke da una fila por THEN de la spec con su evidencia, que es uno de tres valores: `suite`, `ejecución real` o `no probado`. Un THEN que se observa en una interfaz (pantalla, respuesta HTTP, salida de una CLI, fichero que produce el cambio) solo cuenta como verificado con `ejecución real`.
- AND un THEN de fallo (un error, un rechazo, un 400) se provoca de verdad con la entrada que falla: con la feature 0012, `curl -i localhost:<puerto>/api/bookings?status=Lost` → `400` con «Estado no válido: Lost», no «lo cubre el test de la task 3»
- AND el smoke dice cuánto tardó el gate de cierre
- AND «validado» o un «sí» sin detalle a la pregunta de validación es validación: no se repregunta, y el walkthrough registra la frase literal y «no detalló qué probó»
- AND si el usuario no responde, la feature queda en espera con el smoke documentado; si difiere, se aplica «La validación puede diferirse con condiciones» de [`control-profiles`](control-profiles.md); en `unattended` se difiere al smoke de la release
- AND el walkthrough registra la validación separada de lo verificado por el agente, y las decisiones sin el dev-lead en su propia sección
- AND con `validation.mode: field` no presenta guion ni espera: el smoke por THEN, el gate y el guion recorrido por el agente se ejecutan igual, el mensaje con el que pasa al cierre empieza por el 🦆 y el ✋ de los rulings, y se aplica «Con `validation.mode: field`, la validación es en campo» de [`control-profiles`](control-profiles.md)

#### MODIFIED — Una decisión del dev-lead que sale de la revisión final se pregunta sola

- GIVEN la revisión final de rama con un hallazgo cuya resolución es del dev-lead
- WHEN el agente llega a la validación de `sdd-validate`
- THEN pregunta esa decisión sola, en su propio turno, y presenta la validación después de la respuesta
- AND no la resuelve por defecto ni la mete en el mensaje de la validación

#### MODIFIED — El guion de pruebas empieza con el entorno parado, salvo que la persona lo quiera arrancado

- GIVEN la validación de `sdd-validate` de la feature 0012, con la web levantada por el agente en el puerto 4656
- WHEN el agente presenta el guion de pruebas sin `validation.startEnvironment` en `.docs/sdd/sdd-kit.local.json`, o con `false`
- THEN antes de presentarlo ha parado lo que arrancó, y el guion empieza por cómo arrancarla
- AND con `validation.startEnvironment: true`, la deja arrancada, y el guion dice en qué puerto está y cómo pararla
- AND con `validation.startEnvironment: true` y el entorno sin levantar (el gate de cierre `node --test test/` no lo arranca), lo levanta antes del guion con `env:setup` de `## Entornos` de `operations.md` si la sección existe, o si no con «Arrancar» (`node scripts/env-up.mjs`), comprueba que responde, y el guion abre con su puerto y cómo pararlo (`node scripts/env-down.mjs`)
- AND sin «Arrancar» ni `## Entornos` en `operations.md`, el guion dice que no hay comando de arranque declarado y empieza por cómo arrancarla

#### MODIFIED — Un THEN que solo se observa con la base al día declara cómo se valida

- GIVEN la fila 0012 «`npm run check:changed` … si la rama no cambia ninguno, escribe «Nada que comprobar» y sale con 0», cuyo THEN negativo no se puede observar desde `feature/0012`, porque la rama siempre cambia `scripts/check-changed.mjs`
- WHEN el agente escribe la spec
- THEN bajo ese escenario escribe `Se valida en: worktree con la base al día` (o `validación post-merge con fecha`)
- AND en la validación de `sdd-validate` prepara ese entorno y lo da en el guion, en vez de pedir al usuario que se lo monte

### Capacidad: `archive`

#### ADDED — El cierre arranca con la validación registrada y no edita código

- GIVEN la 0010 con las tasks acabadas y la revisión final limpia, y sin ninguna línea de validación en el borrador del walkthrough
- WHEN se invoca `sdd-archive`
- THEN no valida: no presenta el guion, no corre el gate de la validación y dice «falta la validación de la 0010»; devuelve el trabajo a `sdd-validate` sin escribir nada
- AND con `Validado: 2026-11-24 · «probé reservar y cancelar y funciona»` en el borrador, sigue por los pre-checks, los registros, el commit de cierre, el merge de sincronización y el merge
- AND con `Validación en campo:` o `Validación por el agente:` registrada, sigue igual, sin presentar guion
- AND ningún paso del cierre arregla código: un rojo del gate tras el merge de sincronización que no viene de la base devuelve el trabajo a `sdd-implement`, y su arreglo es una task con su test
- AND borrar los tests de feature de «Camino crítico» y juntar el commit de cierre siguen en el cierre
- AND un hotfix o un spike, que no pasan por `sdd-validate`, validan en el paso 1 como hoy, sin devolverse

#### ADDED — Un rojo tras el commit de cierre devuelve el trabajo a `sdd-implement` y el cierre reentra

- GIVEN la 0081 con `Validado:` en su walkthrough, el commit de cierre hecho y, tras `sdd merge --sync`, un rojo del gate en `tests/slots.test.ts` que no viene de la base
- WHEN `sdd-archive` lo contrasta y es de la rama
- THEN no arregla: devuelve el trabajo a `sdd-implement`, cuyo arreglo es una task con su test que corre solo lo que toca el arreglo
- AND la validación ya dada sigue valiendo y el cambio se registra como dice «Lo cambiado tras la validación se separa de lo validado», sin pedir otra
- AND `sdd-archive` reentra: rehace el commit de cierre con el arreglo dentro, repite `sdd merge --sync` y el gate de las tareas que cruzan la rama y la base, y el merge lleva el `--verified-at` del nuevo gate

#### MODIFIED — Un rojo ajeno se busca en la deuda antes de investigarlo

- GIVEN el cierre de la 0081 cuya suite falla sobre la rama con la base integrada con `TimeoutError: tests/e2e/export.spec.ts:12`
- WHEN el cierre recibe ese rojo
- THEN la salida de cada pasada de la suite ya está entera en un fichero del scratchpad de la sesión, guardada antes de filtrarla
- AND crea un worktree temporal desanclado de `origin/develop`, prepara su entorno como el Step 2 de `sdd-worktrees` (dependencias y, con `## Entornos` en `steering/operations.md`, `env:setup`) y lo retira al acabar; no fusiona hasta que acaba el contraste
- AND corre primero el fichero que falla, `tests/e2e/export.spec.ts`, con el runner del proyecto, en la rama y en ese worktree a la vez, sin limpiar estado ni cachés
- AND si también falla, escribe `base: en rojo: el mismo comando también falla sin la rama` y busca `export.spec.ts` y `TimeoutError` en la deuda del proyecto antes de abrir el test; si una fila lo nombra, la cita en el informe; si no, abre una fila en «Por triar» de `debt.md` con la evidencia
- AND para con un bloque que lleva el comando, el código de salida, la ruta del log, las últimas 20 líneas, la línea `base:` y «`develop` sin tocar en `<hash>`», con el hash de `git rev-parse develop`, y pregunta si fusiona igual
- AND si pasa sin la rama y falla en la rama, el rojo es de la rama: devuelve el trabajo a `sdd-implement`, cuyo arreglo es una task con un test que falla primero y vuelve al gate como dice «Tras un rojo, el gate repite los tests que fallaron y lo afectado por el arreglo»
- AND si en la rama también pasa, «No se repite»: abre una fila de intermitentes en la deuda, donde abriría la del rojo que también falla sin la rama, con el test, su línea de error copiada entera de la salida guardada, sin «…», y las dos pasadas en verde, y sigue con el cierre en cualquier perfil
- AND si el fichero pasa en los dos y su línea de error no es un tiempo agotado ni un recurso de la máquina (puerto ocupado, fichero bloqueado, disco lleno, objetos temporales de git), antes de «No se repite» corre la tarea roja entera en los dos, con las mismas salidas
- AND GIVEN un gate `moon run cli:test --affected --base develop` con 1 rojo en `test/x.slow.test.ts` y un worktree de la base recién creado, THEN corre `test/x.slow.test.ts` sin la rama y en la rama antes que la tarea, con las dependencias instaladas, y llega a un veredicto sin esperar el cerrojo de otra rama; si tiene que correr la tarea, la nombra sin `--affected`
- AND con el rojo del `--verify` de `sdd merge`, la línea `base:` es la que da el script, y el cierre sigue igual

#### Reglas de la capacidad — archive

- **Dónde viven los datos**: la skill en `skills/sdd-archive/`; la receta del merge en `skills/sdd-archive/references/merge-recipe.md`; cuándo corre la suite del cierre y qué corre tras el merge de sincronización, en `skills/sdd-archive/references/closing-suite.md`; la comprobación de la revisión final, en `skills/sdd-archive/references/final-review-check.md`; qué corre, envía y registra cada modo de validación, en `skills/sdd-validate/references/validation-modes.md`; adónde va cada aprendizaje, en `skills/sdd-archive/references/learnings.md`; la de la validación del dev en `skills/sdd-validate/references/dev-validation.md`; las ADR en `.docs/sdd/decisions/`; la deuda en `.docs/sdd/steering/debt.md`; la lista del camino crítico del proyecto en `.docs/sdd/steering/critical-path.md`, y su check y su alcance en «Camino crítico» y «Tests de feature» de `operations.md` §Testing
- **Límites**: tope de palabras de `sdd-archive`, el de `cli/test/kit/word-budget.test.ts`; el gate de cierre corre una vez por árbol, al acabar las tasks; con «Camino crítico», «Tests de feature» corre una vez por cierre, antes del borrado, y el árbol de la suite del cierre es el ya borrado; corre enteras las suites unitarias y `pendiente` de «Suites», y el gate por lo afectado, o entero si la rama toca un fichero de «Sin filtro»; tras un rojo corren los tests que fallaron, los que no llegaron a correr y el gate con `--base <sha rojo>`, y con un arreglo solo de docs, solo los tests que fallaron; tras el merge de sincronización se repiten solo las tareas que tocan la rama y la base a la vez: con un gate filtrado, las que selecciona contra `<merge.into>` y también contra el sha de la última suite en verde; sin filtro, el gate entero si la base trae cambios fuera de `.docs/` que no sean `*.md`; si la base trae un fichero de «Sin filtro», el gate entero; el informe de rojo lleva las últimas 20 líneas; el aviso de `ya-en-base:` nombra hasta diez tests; una suite E2E que pasa de su «Presupuesto E2E», o sin presupuesto, una suite de más de 10 minutos, va a la deuda del proyecto; un sha citado es una cadena de 7 a 40 caracteres hexadecimales; los nombres `finishing-a-development-branch`, `sdd-end-feature` y `sdd-end-patch` solo aparecen en `skills/` en la línea de procedencia de `skills/sdd-archive/SKILL.md` y en las migraciones de versiones pasadas (v0.4.0, v2.0.0, v3.0.0)
- **Avisos**: «Hay cambios sin commitear: `<ficheros>`. ¿Los commiteo en la rama, los descarto o paro?» · «Abiertas a la vez: `<rama>` (`<ruta>`). La que fusione segunda integra la base y repite sus gates.» · «¿Alguno de estos patches pide algo al proyecto (un fichero, una clave, un paso a mano)?» · el bloque del rojo (comando, código de salida, ruta del log, últimas 20 líneas, línea `base:`, «`<merge.into>` sin tocar en `<hash>`») · «`base: en rojo: el mismo comando también falla sin la rama`» (contraste a mano) · «Para acabar la `<madre>` falta: `<id>` — `<título de la fila>`[, …]. Recomiendo `<id>`, la primera del roadmap sin dependencias abiertas; su prompt lo da `sdd-roadmap`: «dame el prompt de la `<id>`».» · «Ninguna se puede arrancar todavía: `<id>` espera a `<ids>`.» · «Para acabar la propuesta `<N>` falta: …» · «La `<madre>` ya no tiene piezas abiertas: su fila se puede cerrar.» · «`<documento>` no existía: creado desde la plantilla» · `ADR: <candidata> → decisions/NNNN-<slug>.md` · `no ensayado: <motivo>` · `Conflicto de la base resuelto por el agente: <fichero> — <qué juntó de cada lado>` · «¿Pegas en `critical-path.md` la fila `<fila>`? Si no, el cierre borra `<test>`.» · «La base trae `<cuántos>` tests fuera de la lista (`ya-en-base:`): `<test>`[, …]. Recomiendo un patch que los borre; decide el dev-lead.» · «`Camino crítico` declarado sin `critical-path.md`: no borro nada.» · «Falta la validación de la `<id>`: el trabajo vuelve a `sdd-implement`.»

### Capacidad: `closing-suite`

#### REMOVED — Con otra rama abierta o la base por delante, la suite corre una sola vez, tras el merge de sincronización

- motivo: el gate de cierre corre una vez, al acabar las tasks, en `sdd-validate`; tras el merge de sincronización solo corren las tareas que cruzan la rama y la base («El cierre integra la base tras su commit y repite solo lo que afecta lo que trae la base»)

#### MODIFIED — El cierre integra la base tras su commit y repite solo lo que afecta lo que trae la base

- GIVEN la 0081, que toca `src/app/` y `src/api/`, con la suite en verde en `a1b2c3d` al acabar las tasks, un gate de cierre `moon run app:test api:test launcher:test --affected --base develop`, y `origin/develop` que avanzó con el merge de la 0080, que cambia `src/api/rooms.js` (input de `api:test`) y `scripts/launcher/run.sh` (input de `launcher:test`, que la 0081 no toca)
- WHEN el cierre ha hecho su commit de cierre
- THEN hace `git fetch` y `sdd merge --sync --project-root <worktree>`, que integra `origin/develop` en la rama como último commit, y corre sobre el resultado solo las tareas que tocan la rama y la base a la vez: `api:test`; no corre `app:test` (la base no toca sus inputs) ni `launcher:test` (solo la toca la base, y la verificó el cierre de la 0080)
- AND el mensaje final lleva `` Gate: `moon run app:test api:test launcher:test --affected --base develop` → api:test: corrió 212/212 · app:test: saltada (la base no toca sus inputs: `moon task app:test`) · launcher:test: saltada (solo la toca la base) ``, y el 4.1 del walkthrough, la línea `Gate:` de la validación
- AND el merge final lleva `--verified-at <sha del merge de sincronización>`
- AND si la 0080 solo hubiera cambiado `.docs/sdd/roadmap.md`, no corre nada y el merge lleva `--verified-at a1b2c3d`
- AND con un gate sin filtro de base (`node --test`), corre el gate entero (E2E incluidos si el proyecto los declara) si la base trae cambios fuera de `.docs/` que no sean `*.md`
- AND con conflicto en `roadmap.md`, `changelog.md` o un add/add de dos requisitos al final de una capacidad, `--sync` lo resuelve y el cierre sigue; con `base: conflicto en src/slots.js`, el cierre queda «No terminado» para una persona
- AND si la 0080 trae también `pnpm-lock.yaml`, que está en «Sin filtro», el gate corre entero sobre el merge de sincronización, con `(sin filtro: cambia el build)` en cada tarea
- AND con una suite unitaria en «Suites», corre entera sobre el merge de sincronización si la base trae cambios fuera de `.docs/` que no sean `*.md`

#### MODIFIED — El gate corre entero si la rama toca el build, la configuración, las dependencias o los helpers de los tests

- GIVEN un `operations.md` con «Suites» `` `unit` · `npm run test:unit` · ~15 s · unitario `` y `` `integration` · `moon run :integration` · ~4 min · integración ``, «Gate de cierre» `moon run :integration --affected --base develop --include-relations`, «Sin filtro» `**/package.json`, `pnpm-lock.yaml`, `**/*.csproj`, `tests/helpers/**`, y la rama 0081 que cambia `apps/api/Api.csproj` y `apps/api/People/Save.cs`
- WHEN el hilo corre el gate de cierre, al acabar las tasks o en una vuelta de la validación
- THEN corre `npm run test:unit` entera y después el gate sin `--affected`
- AND la línea es `` Gate: `npm run test:unit` · `moon run :integration --affected --base develop --include-relations` → unit: corrió 510/510 · api:integration: corrió 61/61 (sin filtro: cambia el build) · app:integration: corrió 12/12 (sin filtro: cambia el build) ``
- AND si la rama solo toca `apps/app/src/people/list.ts`, corre `npm run test:unit` entera y el gate con `--affected`, y `api:integration` sale como `saltada`; si solo toca `README.md` y `.docs/sdd/roadmap.md`, no corre ninguna orden
- AND una suite con nivel `pendiente`, o sin nivel, corre entera, como una unitaria
- AND con «Suites» `` `unit` · `npm test` · pendiente `` y «Gate de cierre» `npm test`, `npm test` corre una sola vez: una suite cuya orden es la del gate, o que el gate ya corre sin filtro, no corre aparte
- AND sin «Sin filtro» en `operations.md`, cuentan como build, a cualquier profundidad, `package.json`, `*.csproj`, `*.sln`, `pom.xml`, `build.gradle*`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `composer.json`, `Gemfile`, `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, `packages.lock.json`, `poetry.lock`, `uv.lock`, `go.sum`, `Cargo.lock`, `composer.lock`, `Gemfile.lock`, `.moon/**`, `tsconfig*.json`, `Directory.Build.*`, `Directory.Packages.props`, `global.json`, `.prototools`, `vitest.config.*`, `jest.config.*` y `playwright.config.*`, y `Api.csproj` también hace correr todo
- AND editar el `moon.yml` de `apps/app` no es «cambia el build»: corre sin filtro solo las tareas que define, con `(sin filtro: cambia su definición)`

#### MODIFIED — Tras un rojo, el gate repite los tests que fallaron y lo afectado por el arreglo

- GIVEN una pasada roja en `a1b2c3d` del gate `moon run :integration --affected --base develop --include-relations`, con `PeopleTests.Zero_is_saved` y `PeopleTests.Empty_name_is_rejected` en rojo en `api:integration`, y `app:integration` sin correr porque moon la saltó por depender de la roja
- WHEN el arreglo `e4f5a6b` toca `apps/api/People/Save.cs` y el hilo vuelve al gate
- THEN corre `PeopleTests.Zero_is_saved` y `PeopleTests.Empty_name_is_rejected` con el runner del proyecto, la suite unitaria entera, el gate con `--base a1b2c3d` y `app:integration`
- AND la línea es `` Gate: `npm run test:unit` · `moon run :integration --affected --base develop --include-relations` → tras el rojo en `a1b2c3d`, arreglo `e4f5a6b`: PeopleTests.Zero_is_saved: corrió 1/1 · PeopleTests.Empty_name_is_rejected: corrió 1/1 · unit: corrió 510/510 · api:integration: corrió 61/61 · app:integration: corrió 12/12 (no corrió en la pasada roja) ``
- AND si el runner paró en el primer rojo (bail) y no dice qué tests quedaron sin correr, corre `api:integration` entera
- AND si el arreglo solo toca `.docs/sdd/changes/<carpeta>/walkthrough.md` y `README.md`, corre solo los dos tests que fallaron, y la línea es `` Gate: `moon run :integration --affected --base develop --include-relations` → tras el rojo en `a1b2c3d`, arreglo `e4f5a6b` solo de docs: PeopleTests.Zero_is_saved: corrió 1/1 · PeopleTests.Empty_name_is_rejected: corrió 1/1 ``
- AND si el rojo fue de `api:typecheck`, no de un test, repite `api:typecheck` entera
- AND si el arreglo toca un fichero de «Sin filtro», corre todo sin filtro
- AND un rojo de lint (markdownlint en `README.md`) no repite el gate: se arregla el fichero, lo comprueba el pre-commit y no corre ningún test

#### MODIFIED — Con camino crítico, el cierre pasa una vez los tests de feature, pregunta las filas propuestas y borra lo que añadió la rama

- GIVEN `operations.md` con «Camino crítico: `node scripts/critical-path.mjs` · cubre `e2e`, `unit`», `e2e` de nivel E2E y `unit` de nivel unitario en «Suites», y «Tests de feature: `node scripts/critical-path.mjs --extras --run`»
- AND una rama que añadió `e2e/export-pdf.spec.ts`, `e2e/share-pdf.spec.ts` y un test nuevo `exporta en A4` dentro de `e2e/print.spec.ts`, que ya tenía otros, y modificó `e2e/login.spec.ts`, que ya estaba en la base fuera de la lista; la spec propone fila para `share-pdf.spec.ts › comparte el PDF`
- WHEN el agente cierra la feature
- THEN en el cierre, antes de la suite, corre «Tests de feature» una vez y guarda su salida, y después el check
- AND pregunta sola «¿Pegas en `critical-path.md` la fila `<fila>`? Si no, el cierre borra `e2e/share-pdf.spec.ts › comparte el PDF`.», y sin respuesta no borra ese test
- AND «Tests de feature» pasa los tres tests añadidos y no `e2e/login.spec.ts`
- AND borra `e2e/export-pdf.spec.ts` y, de `e2e/print.spec.ts`, solo `exporta en A4`; no borra `e2e/login.spec.ts` ni ningún test de `unit`; el borrado va en el commit de cierre, y el 4.1 del walkthrough lista lo borrado con el resultado de esa pasada
- AND la suite del cierre corre sobre el árbol ya borrado, con el check en la gate, y un código distinto de 0 es rojo; es el árbol del cierre, distinto del que validó el gate de cierre del final de las tasks
- AND la sesión no escribe en `critical-path.md`
- AND con «Camino crítico» y `critical-path.md` ausente o sin filas, o con una línea `sin-base:` antes del borrado, para sin borrar nada y lo dice
- AND en un patch con el mismo proyecto, igual, con la fila propuesta de `patch.md` §4 y el borrado en su commit de cierre

### Capacidad: `verification`

#### REMOVED — El revisor final sale en segundo plano con el commit de la última task

- motivo: el disparador cambia: los ejes salen cuando acaban el gate y el guion recorrido, no justo tras el commit de la última task; lo recoge «El revisor final sale en segundo plano al acabar el gate y el guion recorrido»

#### ADDED — El revisor final sale en segundo plano al acabar el gate y el guion recorrido

- GIVEN una feature Native con una task que cambia la UI, cuyo commit `a1b2c3d` acaba de hacerse y cuya «Verificación visual» ya se hizo
- WHEN el hilo acaba la última task
- THEN corre el gate de cierre y recorre el guion de pruebas, y con los dos en verde sobre `a1b2c3d` despacha los ejes en segundo plano sobre ese sha
- AND mientras los ejes trabajan, el hilo escribe los borradores de cierre: `walkthrough.md` sin la verificación ni el tiempo, el delta fusionado en `capabilities/` y la entrada del changelog, todos sin commitear
- AND la validación se presenta cuando el cierre de la revisión ha terminado (la pasada de fix y la re-revisión, si las hay), con lo residual en ✋, no antes
- AND en los dos métodos, Native y SDD, los ejes los despacha `sdd-validate` con `sdd-verify`, con el gate y el guion en verde
- AND un arreglo del guion que cambia el código después de `a1b2c3d` da otro sha: los ejes salen sobre el último

#### MODIFIED — Una re-revisión nunca abre otra

- GIVEN `Re-revisión: a1b2c3d..c7d8e9f, sdd-kit:effort-high + opus, limpia` en `tasks.md`, y después un commit `f0a1b2c` que cambia `src/cancel.js`
- WHEN el hilo va a cerrar, en cualquier perfil y con cualquier `validation.mode`
- THEN no despacha revisor, y la presentación (o el mensaje con el que pasa al cierre, en campo) y el walkthrough llevan en ✋ `sin revisar: f0a1b2c — <qué cambia>`
- AND si el commit es documentación de menos de 20 líneas, lo anota como `revisado en el hilo: <sha> · <ficheros> · <n> líneas`
- AND si la revisión final volvió limpia y no hubo re-revisión, ese commit abre la única, sobre `a1b2c3d..HEAD`
- AND mientras quede un `sin revisar` o un «no verificado» sin resolver, ni la línea `Validación en campo:` ni el walkthrough dicen que la revisión quedó limpia: dicen cuántos quedan («…, 1 sin revisar»)
- AND una vuelta del bucle de la validación posterior a la revisión final (un arreglo tras un fallo del dev-lead o tras la re-revisión) no es un commit suelto: se revisa una vez sobre su diff con `sdd-kit:effort-high` + `sonnet`, apunta `Revisión de vuelta: <sha>..<sha>, sdd-kit:effort-high + sonnet, <veredicto>` y un hallazgo suyo que queda abierto va a ✋ como `sin revisar: <sha>`, sin otra revisión

#### MODIFIED — El cierre no repite la revisión final

- GIVEN una feature cuya línea `Revisión final:` de `tasks.md` registra la revisión `sobre a1b2c3d`, y después de ese commit solo hay commits que se revisan en el hilo
- WHEN se entra en `sdd-archive`
- THEN no lanza otra revisión: comprueba que hubo revisión final y con qué ejes y modelos
- AND si después del último revisado hay un commit `e4f5a6b` que cambia `src/slots.js` y `tasks.md` no tiene `Re-revisión:`, no despacha nada: devuelve el trabajo a `sdd-validate`, que lo revisa antes de la validación
- AND si `tasks.md` ya tiene `Re-revisión:`, no despacha: el walkthrough lleva `sin revisar: e4f5a6b — <qué cambia>` en ✋
- AND el último revisado es el segundo sha de la `Re-revisión:`; si no hay, el `sobre` de `Revisión final:`; y si la línea dice «juntada en el cierre», el commit de cierre
- AND una línea en el formato 2.x (`Revisión final: sdd-kit:effort-high + opus, limpia, sobre a1b2c3d`, sin ejes) cuenta como revisión final, y el tramo de la única re-revisión empieza en su `sobre`, con la pasada de fix dentro, como en el cierre único
- AND sin la línea `Revisión final:` (ni, sin `tasks.md`, el informe de los ejes en esta sesión) no invoca `sdd-verify`: devuelve el trabajo a `sdd-validate`, porque la revisión final no es del cierre

#### MODIFIED — El kit no invoca las skills de superpowers que sustituye `sdd-verify`

- GIVEN los ficheros de `skills/` de la rama
- WHEN se buscan `superpowers:verification-before-completion`, `superpowers:requesting-code-review` y `code-reviewer.md` de superpowers
- THEN ninguno aparece: el contrato de cierre de `sdd-implement` y la revisión final de `sdd-validate` invocan `sdd-verify`
- AND los nombres de las fuentes solo aparecen en el `NOTICE` de `sdd-verify` y en su anexo de procedencia

#### MODIFIED — La revisión se cierra una vez

- GIVEN la revisión final sobre `a1b2c3d`, con 1 Important del eje Código y 1 Minor del eje Spec
- WHEN el hilo la procesa, con cualquier método
- THEN el Important entra en una sola pasada de fix (en Native, el hilo con TDD; en SDD, un subagente con todos los hallazgos de todos los ejes), y el Minor, sin `review.minors` en `sdd-kit.json` o con `defer`, va al ledger como `Final: minor (deferred): <una línea>`
- AND con `"review": {"minors": "fix"}` en `sdd-kit.json`, el Minor entra en esa misma pasada sin preguntar, y el ledger lo apunta como `Final: fixed <hallazgo> — <test> RED→GREEN, suite <N>/<N>` (si ningún test lo reproduce, `Final: fixed <hallazgo> — suite <N>/<N>`), nunca como `minor (deferred)`
- AND justo antes de presentar la validación (con `validation.mode: field`, antes de pasar al cierre), despacha una sola re-revisión con `sdd-kit:effort-high` + `opus`, con la cabecera de `encargo-revision.md` y `re-review-prompt.md`, los hallazgos abiertos de todos los ejes y el «What to Check» de los ejes que salieron, sobre el paquete `sdd review package <plan> a1b2c3d HEAD`; apunta `Re-revisión: a1b2c3d..<head>, sdd-kit:effort-high + opus, <veredicto>`
- AND en SDD la fix wave no lleva otra re-revisión: es esta
- AND un Important que la re-revisión deja abierto en código que ya vio la revisión final, el hilo lo adjudica con `Final: Ruling:` y llega a ✋ en la presentación y en el walkthrough, sin otra pasada de fix ni otra re-revisión; uno que mete la propia pasada de fix no se adjudica («Un Important que mete la pasada de fix no se adjudica»)
- AND si desde `a1b2c3d` solo hay commits que se revisan en el hilo, no despacha re-revisión
- AND tras la pasada de fix corren el gate de cierre con `--base <sha del último verde>` y los pasos del guion que toca el arreglo, como en cualquier vuelta de la validación

### Capacidad: `control-profiles`

#### MODIFIED — Con `validation.mode: field`, la validación es en campo

- GIVEN un proyecto con `"validation":{"mode":"field"}` en `.docs/sdd/sdd-kit.json` y la feature 0030 con las tasks acabadas, el gate en verde, el guion recorrido por el agente, su smoke por THEN y el cierre de su revisión final terminado, en cualquier perfil
- WHEN el agente llega a la validación (`sdd-validate`), o termina el patch 0031 en `sdd-implement`
- THEN no pregunta qué ha probado el usuario ni ofrece diferir, y pasa a `sdd-archive` sin parar
- AND el walkthrough (en un patch, `patch.md` §4, debajo de la tabla) registra `Validación en campo: <fecha> · <verificación del agente>`, con la evidencia que ejecutó (p. ej. `suite 412/412 en 96 s · smoke 5/5 THEN con ejecución real · revisión final Spec y Código sobre a1b2c3d, re-revisión limpia`)
- AND con un `sin revisar` o un «no verificado» sin resolver, esa línea no dice «limpia»: dice cuántos quedan (`…, re-revisión limpia, 1 sin revisar`)
- AND la fila de la 0030 en el roadmap queda ✅, y la del patch 0031 en «Patches» no lleva el prefijo 🧪 ni tiene fila en la tabla de la release abierta
- AND sin la clave, o con `"mode":"manual"`, la validación es la de hoy: para en `pair` y `delegate` y se difiere al smoke de la release en `unattended`

### Capacidad: `closing-merge`

#### MODIFIED — El merge a develop sigue la política declarada

- GIVEN una feature o un patch validados (o diferidos) y un bloque `merge` completo (`into`, `noFf`, `removeWorktree`) en `sdd-kit.json`
- WHEN el agente llega al paso del merge de `sdd-archive`
- THEN en `delegate` y `unattended` aplica la política sin preguntar: fusiona en `merge.into`, con `--no-ff` si `merge.noFf` es `true`; en `pair` la presenta y espera
- AND con el bloque ausente o incompleto pregunta como hoy; nunca fusiona a `main` ni etiqueta salvo en un hotfix con la frase del dev-lead en `--order`
- AND el bloque autoriza el merge, no la validación: `sdd-archive` no arranca sin la validación registrada, y en `pair` y `delegate` `sdd-validate` para con el smoke y la pregunta de validación antes de invocarlo
- AND en cualquier perfil, con la CI de la base en `failure` no fusiona («Antes del merge, el cierre lee la CI de la base y no fusiona sobre un rojo», en `archive`)

#### MODIFIED — La verificación del merge es el gate de merge, no la suite completa

- GIVEN un proyecto cuyo `steering/operations.md` §Testing separa un conjunto rápido de la suite completa
- WHEN el cierre fusiona con `sdd merge`
- THEN `--verify` es el conjunto rápido, que corre sobre la rama del cambio integrada con la base, antes del merge y del push; con una sola suite, es esa
- AND el gate de cierre ya corrió antes del script: al acabar las tasks y, si la base trajo cambios que cruzan la rama, tras el merge de sincronización del cierre; el mensaje final da su resultado y su sha
- AND si un hook `pre-merge-commit` del repo ya ejecuta el gate, `--verify` se omite; el gate de cierre no se omite nunca
- AND `--verify` no lleva las suites unitarias ni lee «Sin filtro»: los aplicó el gate de cierre

### Capacidad: `frontend-verification`

#### MODIFIED — La verificación visual se enseña con medidas y capturas

- GIVEN la feature 0012 con el selector de estado, cuya «Verificación visual» declara `/` y `/?theme=dark`, el criterio «el selector filtra la lista por estado» y contraste del texto ≥ 4,5:1
- WHEN el agente para tras la task en `pair`, o presenta la validación de `sdd-validate` en `delegate`
- THEN antes del guion de pruebas enseña el criterio, la salida del detector por viewport con cada hallazgo resuelto o justificado («390x844 · `cramped-padding` en `select` · arreglado: padding-right 12 px») y la ruta de cada captura
- AND cada medida en estilos computados, solo porque el criterio fija un valor, con su valor y el esperado («texto del selector, oscuro · contraste · 7,9:1 · ≥ 4,5:1»)
- AND sin detector declarado, el aviso literal «composición no medida: `operations.md` no declara detector en §Frontend»
- AND si la composición sigue mal tras la tercera ronda, lo dice ahí, para que decida el dev-lead
- AND una task que quedó «no probado» lo dice en ese sitio, con su motivo

### Capacidad: `routing`

#### MODIFIED — Un patch visual se verifica con una captura y se registra como `Changed`

- GIVEN un patch abierto para un ajuste solo de presentación o una retirada
- WHEN el agente lo recorre con `sdd-implement` y lo cierra con `sdd-archive`
- THEN §2 de `patch.md` lleva la intención en una frase, en lugar de la causa raíz, y no se invoca `sdd-debugging`
- AND §4 lleva la ruta de una captura en navegador real de cada pantalla tocada antes y después del cambio, guardadas fuera de git, y la salida del detector en los dos viewports con cada hallazgo resuelto o justificado, con los mismos contraejemplos que una task full
- AND sin detector declarado, el aviso «composición no medida», y con el detector declarado sin ejecutar, «no probado» con el error concreto
- AND con «sube el badge de estado a 14px», la verificación visual (capturas y detector) dura menos de 5 minutos, sin build dedicado ni suite de specs nueva
- AND la validación de `sdd-validate` enseña las capturas y la salida del detector al usuario, y propone `§Frontend` si `steering/operations.md` no la tiene
- AND la entrada del changelog va en `Changed`, no en `Fixed`; en una retirada, en `Removed`
- AND en una retirada, §4 lleva además la búsqueda de cada símbolo retirado, sin otros usos
- AND un bug determinista sigue con la causa raíz de `sdd-debugging` y cierra en `Fixed`

## Topes de palabras

Medido sobre `dist/skills/` en `b25a8c27d`, con el conteo de `cli/test/kit/word-budget.test.ts` (palabras separadas por espacios, sin migraciones). Lo previsto va sin medir y al ✋: se mide al escribir cada skill y la tabla se corrige en la task.

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-validate` (total) | — (skill nueva) | — | +1054 (las dos referencias movidas) +~640 (orden, bucle, registro, «Closing drafts», vigilancia de silencio y «When the axes return», que salen de `sdd-implement`) = ~1700 + 2 % → **1735** (previsto, sin medir, al ✋) |
| `sdd-validate` (`SKILL.md`) | — (skill nueva) | — | ~640 + 2 % → **655** (previsto, sin medir, al ✋) |
| `sdd-archive` (total) | 9487 / 9904 | 417 | −1054 (dos referencias movidas) −~250 (paso 1 y «In the validation») +~100 (la comprobación del registro) = ~8280 + 2 % → **8450** (previsto, sin medir, al ✋) |
| `sdd-archive` (`SKILL.md`) | 2921 / 2932 | 11 | −~350 (el paso 1 baja de ~480 a ~130 palabras) = ~2570 + 2 % → **2625** (previsto, sin medir, al ✋) |
| `sdd-implement` (total) | 6556 / 6626 | 70 | −~190 (pasan a `sdd-validate`) +~40 (la invocación y la línea del gate) = ~6400; el tope baja a lo medido + 2 % en la task de topes |
| `sdd-implement` (`SKILL.md`) | 2577 / 2633 | 56 | −~150 = ~2430; el tope baja a lo medido + 2 % en la task de topes |
| `sdd-implement-native` | 2965 / 3038 | 73 | sin cambio (una frase sustituida) |
| `sdd-implement-subagent` (total) | 8426 / 8462 | 36 | sin cambio (una etiqueta del diagrama) |

Pieza que entra y pieza que sale: sale el paso 1 de `sdd-archive` con sus tres modos y «The suite» (de ~480 a ~130 palabras), «In the validation» de `closing-suite.md` y la frase «In `manual`, 1-2 run before the script»; entra `sdd-validate` con su orden y su bucle. El saldo conjunto es de +~310 palabras (decisión 9).

## Previsión de coste

Cada fila cita la línea `suma:` del comando de previsión cuando existe. Las filas con escenarios nuevos (`vf1`…`vf7`, `av1`, `av2`) no tienen su fila en la batería hasta que se escriban: su coste sale de ~0,83 $ por sujeto de `sdd-implement` (`SCENARIOS="h1 h2 g1 a1" N=2` → `suma: 8 sujetos · coste previsto: 6.67 $`) y ~0,29 $ por sujeto de `sdd-archive` (`SCENARIOS="a1 a2 g1 g2 v1a v1b se1 t1 t2 t3" N=1` → `suma: 10 sujetos · coste previsto: 2.86 $`), y se corrige con el comando cuando existan.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="vf1 vf2 vf3 vf4 vf5 vf6 vf7" N=2` (14 sujetos × ~0,83 $) y `SCENARIOS="av1 av2" N=2` (4 sujetos × ~0,29 $), sin medir: escenarios nuevos | 12,8 |
| GREEN | los 9 nuevos (18 sujetos, ~12,8 $) y los 10 que se mueven a `sdd-validate`, `N=1` (10 sujetos × ~0,83 $) | 21,1 |
| Una tanda de REFACTOR | la mitad de RED y GREEN (23 sujetos) | 16,9 |
| Controles | `SCENARIOS="h1 h2 g1 a1" N=2 node tests/headless/battery.mjs plan tests/batteries/sdd-implement/battery.md` → `suma: 8 sujetos · coste previsto: 6.67 $` y `SCENARIOS="a3 a3r a3a a5" N=2 node tests/headless/battery.mjs plan tests/batteries/sdd-archive/battery.md` → `suma: 8 sujetos · coste previsto: 3.23 $` | 9,9 |
| Humo de las skills editadas (Art. I) | un escenario, `N=1`, por `sdd-verify`, `sdd-implement-native`, `sdd-implement-subagent`, `sdd-propose` y `sdd-templates`, elegido de su batería al escribir la task: 5 sujetos × ~0,6 $, sin medir | 3,0 |
| Medición tras la revisión final | GREEN completo, 28 sujetos | 21,1 |
| Suma | 118 sujetos | ~85,9 |

## Enmiendas

- 2026-11-24 — `a3r` no cambia su esperado: ya mide un rojo que también falla sin la rama y para a preguntar, que sigue siendo cierto; el rojo de la rama lo mide `av2` — corrige una frase de «Dónde se prueba» que no se aplica; no cambia lo que se mide — sin aprobar, avisado en el mensaje de cierre de la task
- 2026-11-24 — `g7` pasa también a la batería de `sdd-validate` y `g6` se retira de la de `sdd-archive`: el gate ya no corre en el cierre y la suite única tras la base es el requisito que la spec quita; la batería nueva lleva 11 escenarios movidos y la previsión sube ~3 $ (~89 $) — encontrado al empezar la Task 2, al leer qué miden `g6` y `g7` — aprobada: «1» (dev-lead, 2026-11-24)
- 2026-11-24 — el enfoque pasa de A (dentro de `sdd-implement`) a C (una skill nueva `sdd-validate`) y la capacidad `validation` nace del delta; el resto de la spec cambia solo el nombre del sitio — «sí, pero entonces esto necesita ser quirúrgico» (dev-lead, 2026-11-24) — aprobada: «Apruebo, commitea y sigue con la Task 1» (dev-lead, 2026-11-24)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-24 | aprobada, enfoque A (anterior a la enmienda): «sí, déjalo así y apruebo» |
| Àngel Delgado | 2026-11-24 | aprobada, enmienda al enfoque C (`sdd-validate`): «Apruebo, commitea y sigue con la Task 1» |
