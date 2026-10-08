---
id: 20261008-193241-feature-0146-propose-spec-and-plan
feature: 0146
proposal: 0131
title: Spec y plan de propose — 🦆 ✋, «Dónde se prueba», acción update, tasks con dependencias y contraste de lenguaje
mode: full
profile: delegate
status: approved
created: 2026-10-08
author: Claude (Opus 5.5) con el dev-lead
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-08
---

# Spec — Spec y plan de propose: 🦆 ✋, «Dónde se prueba», acción update, tasks con dependencias y contraste de lenguaje

🦆 Cuando arranques una feature, la spec que te enseño para aprobar empezará con un párrafo como este y después con la lista de todo lo que decidí yo sin ti: si fijo que una exportación enseña 50 filas y nadie lo dijo, sale en esa lista. La spec dirá también dónde se comprueba cada cosa (la cancelación de una reserva, contra el servicio como las pruebas actuales; la pantalla, con una captura), y el plan dirá qué tarea va detrás de cuál. Si a mitad de trabajo hay que cambiar algo aprobado, paro igual que hoy, pero corrijo la spec en su sitio y el trabajo nuevo va a una tarea aparte. La pregunta para aprobar será siempre de opciones, con la de bajar de modelo antes de implementar, y la entrevista te avisará si usas una palabra con otro sentido que el del glosario. Todo se monta sobre el arranque actual: la entrada única y los demás carriles llegan en la 0160 y la 0161.

## Capacidades

- Modificadas: `feature-flow` — la spec abre con 🦆 y ✋ y dice dónde se prueba; el plan declara de qué task depende cada una y de dónde sale su verificación; el gate de la spec pregunta con opciones fijas; el modelo del revisor de dominio se elige al preguntar la review; la validación abre con 🦆 y ✋.
- Modificadas: `control-profiles` — un cambio a la spec aprobada se resuelve con la acción update: la spec se corrige en su sitio y el trabajo afectado va a una task nueva; el bloque de rulings pasa a ✋.
- Modificadas: `interviewing` — la entrevista contrasta el lenguaje con el glosario y con el código, y devuelve términos resueltos y candidatas a ADR.
- Modificadas: `explaining` — lo pendiente tras el 🦆 de una parada va como afirmación, y la lista de ficheros de la explicación larga se titula en el idioma del usuario.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec: dos revisores, dominio en Opus y técnica en Sonnet (elegida por el dev-lead) — señales: contrato (la forma de spec, plan y tasks la leen otras skills y los tests Pester), MODIFIED en cuatro capacidades, tres o más capacidades, área no explorada (paso 7 de `sdd-start-feature`) · tamaño: ~300 líneas en ~15 ficheros
- Dominio (Opus): si la acción update, el ✋ exhaustivo y el gate con opciones fijas encajan con «Un cambio a la spec aprobada es un desvío» y con `delegate` sin crear paradas nuevas
- Técnica (Sonnet): si los encabezados nuevos rompen `CapabilityRules.Tests.ps1`, `PlanReviewFocus.Tests.ps1` o el molde de `sdd-rubber-duck`, y si la previsión de coste cubre cada regla nueva
- Mínimo razonable: un revisor con los siete puntos — deja más superficial el encaje del update con los gates
```

1. **Se edita en su sitio, no nace todavía la skill de propose.** Los cambios van a `sdd-start-feature` (pasos 4, 5 y 7), sus referencias, las plantillas, `sdd-grilling` y `sdd-rubber-duck`. La skill de propose nace en la 0160, que absorbe el arranque de feature y de patch y mueve estas reglas con la tabla de reglas retiradas del Art. I. Crearla ahora obligaría a mover dos veces lo que la 0160 va a mover, con su batería.
2. **Las pruebas son humo con RED** (Art. I): `sdd-start-feature` es una skill de la 2.3.x sin batería, así que su edición lleva humo, y como cada regla es guía nueva, cada una lleva antes su RED. Los escenarios nacen en una batería nueva, `tests/batteries/sdd-start-feature/`, que la 0160 heredará para la skill de propose. `sdd-grilling` y `sdd-rubber-duck` tienen batería: su edición lanza el tramo de su paso más un escenario del fallo.
3. **El ✋ es el bloque que ya existe, con otro nombre y otra regla.** En la spec, el encabezado pasa a `## ✋ Decisiones que he tomado yo — valida estas`; lo nuevo es que es **exhaustivo**: cada decisión de la spec sale de la entrevista, del roadmap o del agente, y las del agente están todas ahí. `CapabilityRules.Tests.ps1` (línea 58) busca `## Decisiones que he tomado yo` y dejaría de encontrarlo: el test pasa a buscar `Decisiones que he tomado yo` sin el prefijo. El encargo del revisor ya marca hoy «decisiones tomadas en el cuerpo que no están en "Decisiones a validar"» (punto 4); `review-spec.md` pasa a citar el nombre nuevo, sin regla nueva. **El plan conserva su bloque como está** (`## Decisiones que he tomado yo — valida estas`, sin ✋): el ✋ es de lo que lee el dev-lead en una parada, y en `delegate` el plan no tiene parada. Así `PlanReviewFocus.Tests.ps1` no cambia.
4. **El 🦆 va justo debajo del título** de la spec, antes de «Capacidades». Lo escribe `sdd-rubber-duck` en modo corto al presentar la spec, y el gate lo enseña primero, seguido del ✋. Una spec aprobada por delegación lo lleva igual, porque es la explicación que leerá quien la abra.
5. **«Dónde se prueba» es una sección de la spec**, después de «Approach»: una línea por comportamiento con la superficie donde se prueba y el patrón que sigue. Cambiarla durante la implementación es un desvío, y el requisito del desvío la nombra.
6. **La parte de la 0097 que salda esta feature**: la «Verificación» de cada task sale de «Dónde se prueba» y del comando de lo afectado de §Testing (`operations.md` desde la 3.0.0, `tech-stack.md` antes). Sin §Testing, la task declara el comando de su superficie que dice «Dónde se prueba», o `no probado` con su motivo; el gate de la constitution va solo a la validación final, una vez, como hoy. Sin ninguna forma de verificar una superficie, la pregunta va dentro de la entrevista, nunca como turno propio; con la spec aprobada por delegación o en `unattended`, el agente elige la opción más conservadora (la verificación más cercana que falle sin el cambio) y la apunta en ✋. La pasada de fix y el gate de merge, que la 0097 también nombra, son de la 0148 y la 0149.
7. **Las tasks declaran su dependencia con una línea `**Tras**:`** (`Task 1`, o `—` si no depende de ninguna), y el plan dice que se ejecutan en orden, sin paralelo. `Tras` es la única referencia a otra task que admite la regla «la task viaja sola» de la plantilla, porque `sdd task brief` la copia literal y no necesita el texto de la otra. Quitar el paralelo de la ejecución (la misión dice «un máximo de tres en paralelo») es de la 0147, que reescribe implement; aquí solo deja de proponerlo el plan.
8. **La pregunta del gate de la spec, en `pair` y `delegate`, es siempre `AskUserQuestion` con opciones fijas**: «Apruebo (Recomendada)» y «Cambios». En `delegate`, con la sesión en el modelo más capaz, se añade «Apruebo; escribe el plan y, si sale Native, para antes de la Task 1 para que baje la sesión a gama media». En `pair` esa opción no va aquí, porque `pair` ya la ofrece en su gate del plan. Sale del paso 4 la prosa que describía cómo formular la pregunta. Salda la fila de deuda del gate en `delegate` (ticket de la feature 0060 del template, §3). No reproduzco el fallo antes de la spec: el ticket lo verificó contra el paso 4, y el RED de la batería lo mide antes de escribir la regla.
9. **El modelo del revisor de dominio se elige en la pregunta de review que ya existe**, sin ronda nueva. Sus opciones llevan el modelo, con recomendación: Opus si la spec toca reglas de negocio, roles o reglas del flujo; Sonnet si no. Vale para la lente de dominio de dos revisores y para el revisor único de siete puntos, que la incluye. Si la petición o el prompt de arranque nombran el modelo, no se pregunta. Si no hay pregunta (spec aprobada por delegación o `unattended`), Sonnet. La lente técnica, siempre Sonnet. Cambian dos requisitos vigentes: «El revisor de spec se despacha con su effort» (hoy, siempre `sonnet`) y «La spec propone su propio nivel de review por complejidad» (la pregunta lleva el modelo).
10. **La acción update.** Ante un cambio a la spec aprobada, el agente para (la parada se queda) con el 🦆 del cambio y su ✋. Deja escrita, sin commitear, la corrección en su sitio de la spec (el requisito o el THEN corregido) más su línea en «Enmiendas». Con la aprobación, commitea la spec y añade al plan una task nueva con el trabajo de la enmienda (`Task N — enmienda <fecha>: <qué>`, con su `Tras`). En `tasks.md`, cada task afectada lleva la nota `afectada por enmienda <fecha> → Task N`. Las tasks cerradas no se reabren ni se reescribe su commit: la historia sigue con un commit por task (Art. IV), el ledger cuenta la task nueva como cualquier otra, y su commit entra en la revisión que toque. La task nueva no se da por hecha sin su verificación ni su `sdd task done`. Sin aprobación no sigue. La misma acción vale cuando la respuesta a un freno de alcance (salida observable, tercer fix, fila o ficheros cambiados en la base) cambia el texto de la spec; si la respuesta no lo cambia, se apunta en «Enmiendas» como hoy. En `unattended`, la opción más conservadora se aplica igual en su sitio, con su línea marcada `sin aprobar`.
11. **Corregir la spec en su sitio no choca con el Art. XI.** La tabla de `architecture.md` acota la carpeta de una feature como artefacto de evento que «no se edita tras el cierre, salvo adendas fechadas». Hasta el cierre es el contrato vivo de la feature, y «Enmiendas» es su historial. Rechazo así el hallazgo de la revisión que pedía enmendar el Art. XI. Tampoco la propongo como ADR: es fácil de deshacer.
12. **La validación abre con 🦆 y ✋**: el bloque «Me salí del plan en…» pasa a `✋ Me salí del plan en…`, con los rulings de la ejecución, y va tras el 🦆 de lo hecho. Con `validation.mode: field` no hay parada: los dos van en el mensaje con el que el paso 7 pasa al cierre. Cambian «El trabajo se valida con el usuario antes de cerrar» y «Salir del plan es un ruling visible», que nombran el bloque.
13. **El contraste de lenguaje de `sdd-grilling`**: si `PRODUCT.md` tiene «Terminology», contrasta cada término del usuario con su definición y con el código; sin glosario, solo con el código. Ante una discrepancia, la dice y pregunta el término canónico; sin usuario, la deja como pendiente. Devuelve a quien la invoca, además de sus tres listas, los **términos resueltos** y las **candidatas a ADR** (difícil de deshacer, sorprende sin contexto y hubo una alternativa real). La spec los recoge en una sección nueva, «Términos y ADR», y las ADR las escribe el cierre de la 0149.
14. **Los ajustes de `sdd-rubber-duck`** que dejó la revisión final de la 0145: el ejemplo «decide cómo se escribe la hora» pasa a afirmación sin pregunta, y la lista final de la explicación larga se titula en el idioma del usuario. El tercer ajuste (el escenario c2 de enrutado frente a «¿cómo funciona…?») va a la 0161, que rehace la entrada de explore.
15. **Una pieza entra, otra sale**: sale del paso 4 la prosa de cómo formular la pregunta del gate, que sustituyen las opciones fijas; sale el párrafo largo de «Tasks verticales» de `plan-template.md`, que pasa a dos frases con `Tras`. El `CLAUDE.md` del repo **no** pierde «explicando antes los términos que das por sabidos»: el 🦆 solo sale en la spec, el desvío y la validación, y las demás decisiones del dev-lead siguen necesitándolo.
16. **Topes de palabras, decisión tuya** (Art. I). `sdd-grilling` está en su tope, 650 de 650, y el contraste añade ~90: propongo 750. A `sdd-start-feature` le quedan 237 palabras en su total (20.018 de 20.255), y la spec añade reglas en los pasos 4, 5 y 7, en `control-profiles.md` y en `review-spec.md`. El plan compensa con los recortes de la decisión 15, y si el saldo no cabe, propongo subir el total a 20.600 y dejar `SKILL.md` en sus 8.430. Si no apruebas una subida, recorto otra regla de esa skill con su A/B.
17. **Previsión de coste** (Art. I), con Sonnet salvo `g1`, que mide la variante del modelo más capaz y va en Opus:

    | Paso nuevo o cambiado | Escenario | RED | GREEN |
    | --- | --- | --- | --- |
    | Paso 4 y plantilla: 🦆 arriba, ✋ exhaustivo, «Dónde se prueba», «Términos y ADR» | `s1` (entrevista hecha; el agente tiene que fijar un tope que nadie dijo) | 2 | 2 |
    | Paso 4: gate con `AskUserQuestion` y opciones fijas, `delegate` | `g1` (Opus) | 2 | 2 |
    | `review-spec.md`: modelo del revisor de dominio en la pregunta de review | `r1` | 2 | 2 |
    | Paso 5 y plantilla: `Tras`, «Verificación» desde §Testing y sin §Testing | `p1` | 2 | 2 |
    | `control-profiles.md`: acción update, task nueva y nota en las afectadas | `u1` | 2 | 2 |
    | Paso 7: 🦆 y ✋ en la validación con parada | `v1a` | 2 | 2 |
    | Paso 7: 🦆 y ✋ en el mensaje de `validation.mode: field` | `v1b` | 2 | 2 |
    | `sdd-grilling`: contraste de lenguaje | `t1` y el tramo de su batería | 2 | 2 + 2 |
    | `sdd-rubber-duck`: lo pendiente como afirmación; lista final en el idioma del usuario | `s2` de su batería y `l2` nuevo (la explicación larga pedida en inglés) | 1 | 2 + 2 |

    Son 17 sujetos de RED y 22 de GREEN: ~38 $ (Sonnet ~0,8 $ por sujeto con una spec que escribir; Opus ~2,5 $) y ~3,5 h de campaña. Techo: 46 $, con el ~20 % de reserva para lo que destape la revisión final. La regla del solape con el roadmap que repite el requisito del desvío es la vigente, sin cambios, y no se mide. Si un RED no exhibe el fallo, la regla y su THEN salen y te vuelvo a pedir la aprobación.
18. **Repaso de coherencia**: «sin §Testing» decía «el plan usa el gate de la constitution», que contradecía «El gate de cierre se ejecuta una vez»: lo corregí en la decisión 6 y en el THEN. El encabezado del ✋ es el mismo en la decisión 3, el Scope y el delta.

### Hallazgos de la review

Dominio (Opus):

1. **Rechazado** — La acción update reescribe un artefacto de evento (Art. XI) → la tabla de `architecture.md` solo prohíbe editar la carpeta tras el cierre; decisión 11.
2. **Aceptado** — El modelo del revisor de dominio cambia dos requisitos vigentes sin declararlo, y falta el caso de un solo revisor → dos `MODIFIED` en el delta y decisión 9.
3. **Aceptado** — La validación con ✋ cambia dos requisitos vigentes → dos `MODIFIED` («El trabajo se valida…» y «Salir del plan es un ruling visible»).
4. **Aceptado** — El gate amplía el GIVEN a `pair` sin acotar el «sigue sin parar» → partido en dos: un `ADDED` con las opciones fijas para `pair` y `delegate`, y el vigente, que sigue siendo solo de `delegate`.
5. **Aceptado** — Sin §Testing, el gate de la constitution en cada task contradice el gate único, y la pregunta creaba una parada → decisión 6 y THEN corregidos.
6. **Aceptado, con otra forma** — Falta el complemento de la task reabierta (ledger, commits, re-revisión) → no se reabre ninguna task: el trabajo de la enmienda va a una task nueva (decisión 10).
7. **Aceptado** — El update solo cubría el desvío y el THEN no llevaba ✋ → los frenos de alcance que cambian la spec usan la misma acción, y el THEN lleva el 🦆 y el ✋.
8. **Aceptado** — «Sin usuario, no pregunta» cambia sin declararlo, y faltan las reglas de las capacidades → `MODIFIED` y «Reglas de la capacidad» en `interviewing` y `explaining`.
9. **Aceptado** — La decisión 6 decía «su ✋» del plan sin cambiar el bloque del plan → el plan conserva su bloque (decisión 3).
10. **Aceptado** — Quitar «explicando antes los términos» del `CLAUDE.md` deja sin explicación las paradas sin 🦆 → la frase se queda (decisión 15).

Técnica (Sonnet):

1. **Aceptado** — `CapabilityRules.Tests.ps1` busca `## Decisiones que he tomado yo` → entra en el Scope y busca sin el prefijo (decisión 3).
2. **Aceptado** — No se decía si el plan cambia de encabezado, y `review-spec.md` cita el nombre viejo → el plan no cambia, y `review-spec.md` entra en el Scope.
3. **Aceptado** — Solo se vigilaba el tope de `SKILL.md`, y el total de `sdd-start-feature` tiene 237 palabras de margen → decisión 16.
4. **Aceptado** — `l2` necesita `subject.sh`, la rúbrica (R2, R7) y la procedencia → entran en el Scope.
5. **Aceptado** — Cambiar «Dónde se prueba» como desvío no estaba en el requisito → el THEN del desvío la nombra.
6. **Aceptado** — «El resto cabe en una pantalla» no se puede medir → sale; el THEN fija el orden de las secciones.
7. **Aceptado en parte** — La regla del solape ya está vigente y no cambia (decisión 17); que la spec recoja «Términos y ADR» pasa a la rúbrica de `s1`.
8. **Aceptado** — El perfil de la opción de bajar de modelo no estaba unificado → solo en `delegate` (decisión 8).
9. **Aceptado** — `v1` no podía cubrir los dos modos → `v1a` y `v1b`.
10. **Aceptado** — El estado `reabierta` quedaba fuera del ciclo, y `Tras` contradecía «la task viaja sola» → ninguna task se reabre (decisión 10), y `Tras` es la excepción escrita (decisión 7).

### Decisiones tomadas con el dev-lead

- Partir la 0146 en tres features en cadena: 0146 (spec y plan de propose), 0160 (entrada única con cinco carriles y spike) y 0161 (explore y prompt de arranque) — opción «Partir en tres (Recomendada)» de la primera pregunta (2026-10-08).
- Feature full con perfil `delegate`, parando en la spec — opción «Paro en la spec (Recomendada)» (2026-10-08).
- Review de spec con dos revisores, dominio en Opus y técnica en Sonnet — opción «Dos: dominio Opus, técnica Sonnet (Recomendada)» (2026-10-08).
- Spec aprobada, con los topes de palabras (decisión 16) y el techo de coste de 46 $ (decisión 17) — «si apruebo» (2026-10-08).
- Decisiones del lienzo 0131 que esta feature aplica tal cual: la spec empieza por 🦆 y ✋ sin crear paradas; lleva «Dónde se prueba»; plan con tasks verticales y dependencias, sin paralelo; `sdd-grilling` contrasta el lenguaje con el glosario y el código; revisor de dominio Opus o Sonnet a elegir con recomendación, Sonnet sin entrevista, técnica siempre Sonnet; la acción update corrige la spec en su sitio con una línea en «Enmiendas» y conserva la parada del desvío; el gate de la spec en `delegate`, siempre con `AskUserQuestion` y opciones fijas — petición de arranque de la feature (2026-10-08).

## Intent

La spec y el plan de hoy se leen mal y se cambian mal. No hay una explicación llana de qué se va a hacer, y las decisiones del agente se mezclan con el cuerpo, así que el dev-lead aprueba sin saber qué decidió nadie. La spec no dice dónde se prueba cada cosa, y la verificación de cada task se improvisa. Un cambio a la spec durante la ejecución se apunta en «Enmiendas», pero el cuerpo se queda con el texto viejo. Y la pregunta del gate, en prosa, perdió en campo la opción de bajar de modelo. Esta feature da a la spec y al plan la forma de la 3.0.0 sobre las skills actuales.

## Scope

- Entra: `spec-template.md` (🦆, encabezado ✋, «Dónde se prueba», «Términos y ADR», ayuda de «Enmiendas» con la acción update).
- Entra: `plan-template.md` (`Tras` por task, sin paralelo, «Verificación» desde «Dónde se prueba» y §Testing, párrafo de tasks verticales acortado) y `tasks-template.md` (nota `afectada por enmienda <fecha> → Task N`).
- Entra: `sdd-start-feature/SKILL.md` pasos 4, 5 y 7; `references/control-profiles.md` (Desvío, frenos de alcance, tabla de gates, «✋ Me salí del plan en…»); `references/review-spec.md` (modelo del revisor de dominio y nombre del bloque ✋).
- Entra: `sdd-grilling/SKILL.md` (contraste de lenguaje y lo que devuelve) y `sdd-rubber-duck/SKILL.md` (los dos ajustes).
- Entra: baterías — nueva `tests/batteries/sdd-start-feature/`; `t1` en la de `sdd-grilling`; `l2` en la de `sdd-rubber-duck` con su `subject.sh`, las filas R2 y R7 de la rúbrica y la tabla de procedencia.
- Entra: `tests/CapabilityRules.Tests.ps1` (busca el bloque sin el prefijo `## `) y `tests/WordBudget.Tests.ps1` (los topes de la decisión 16, si los apruebas).
- No entra: la skill de propose, la entrada única, los carriles y el spike (0160); explore y el prompt de arranque (0161); quitar el paralelo de la ejecución y el resto de implement (0147); la pasada de fix y el gate de merge de la 0097 (0148, 0149); escribir las ADR que lista la spec (0149); el 🦆 en las paradas de patch (0160); el bloque de decisiones del plan, que no cambia; el `CLAUDE.md` del repo.

## Approach

Cada regla nueva entra donde ya vive su vecina: la forma de los artefactos, en las plantillas; cuándo y cómo se presenta, en los pasos de `sdd-start-feature` y en `control-profiles.md`; cómo se pregunta y cómo se explica, en `sdd-grilling` y `sdd-rubber-duck`. El 🦆 lo pide la parada a `sdd-rubber-duck`, que ya existe, y el gate pasa de describir la pregunta a fijar sus opciones. Cada regla se escribe solo después de su RED, en una batería que heredará la skill de propose.

## Dónde se prueba

- 🦆, ✋ exhaustivo, «Dónde se prueba» y «Términos y ADR» en la spec: la `spec.md` que escribe el sujeto de `s1`, en la batería de `sdd-start-feature`.
- Gate con opciones fijas y modelo del revisor de dominio: el `stream-json` del sujeto (`g1`, `r1`), buscando la llamada a `AskUserQuestion` y sus opciones.
- `Tras` y «Verificación» del plan: el `plan.md` del sujeto (`p1`).
- Acción update: la `spec.md`, el `plan.md`, el `tasks.md` y el último mensaje del sujeto (`u1`).
- Validación con 🦆 y ✋: el último mensaje del sujeto, con parada (`v1a`) y en campo (`v1b`).
- Contraste de lenguaje: el texto del sujeto en la batería de `sdd-grilling` (`t1`).
- Ajustes del 🦆: la batería de `sdd-rubber-duck` (`s2` y `l2`).
- Forma de las plantillas y topes: la suite Pester (`CapabilityRules.Tests.ps1`, `PlanReviewFocus.Tests.ps1`, `WordBudget.Tests.ps1`).

## Términos y ADR

- Términos resueltos: **acción update** — corregir la spec aprobada en su sitio, tras la parada del desvío, y llevar el trabajo afectado a una task nueva. No es un carril ni una skill.
- ADR candidatas: ninguna. Ninguna decisión es difícil de deshacer: todas viven en texto de skills y plantillas que la 0160 vuelve a mover.

## Delta de comportamiento

### Capacidad: `feature-flow`

**MODIFIED — La spec presenta primero las decisiones tomadas sin el usuario** (antes: el primer bloque era «Decisiones que he tomado yo», y el resto debía caber en una pantalla)

- GIVEN una feature en modo full o lite, con una entrevista que fijó el filtro por sala y en la que nadie habló de cuántas filas enseña la exportación
- WHEN el agente presenta la spec en el gate
- THEN lo primero que lee el dev-lead es un párrafo que empieza por 🦆, escrito por `sdd-rubber-duck` en modo corto, y después «✋ Decisiones que he tomado yo — valida estas», con una línea por decisión
- AND en la `spec.md`, el 🦆 va bajo el título, antes de «Capacidades», y el ✋ va justo después de «Capacidades»
- AND si la spec fija un tope de 50 filas, ese tope está en ✋, porque no salió de la entrevista ni del roadmap
- AND la spec lleva la sección «Términos y ADR» con lo que devolvió la entrevista, o «ninguno» y «ninguna»

**ADDED — La spec dice dónde se prueba cada comportamiento**

- GIVEN una feature que añade cancelar una reserva por el endpoint y por la pantalla, en un proyecto cuyos tests de reservas van contra el endpoint
- WHEN el agente escribe la spec
- THEN la sección «Dónde se prueba» dice «cancelar reserva: por el endpoint, como los tests de reservas actuales; la pantalla, con una captura»
- AND la «Verificación» de cada task del plan sale de esa línea y del comando de lo afectado de §Testing
- AND sin §Testing, la task declara el comando de su superficie que da «Dónde se prueba», o `no probado` con su motivo; el gate de la constitution corre solo en la validación final
- AND si una superficie no tiene con qué verificarse, la pregunta va dentro de la entrevista; con la spec aprobada por delegación o en `unattended`, el agente elige la verificación más cercana que falle sin el cambio y la apunta en ✋

**MODIFIED — Cada task de producto acaba en algo que se prueba en la aplicación** (antes: sin dependencias declaradas)

- GIVEN un plan para las salas favoritas, que tocan la migración `favorite_rooms`, la API y la estrella de la pantalla de salas
- WHEN se parte en tasks
- THEN la task «Marcar Sur como favorita» atraviesa migración, API y estrella, y su línea «Se prueba en la aplicación» dice «Ana pulsa la estrella de Sur y la ve llena tras recargar». No sale una task «BD y API» seguida de otra «web».
- AND una task que no deja nada que se pueda probar (una migración de datos previa, un refactor) lleva en esa línea «no, porque <motivo>»
- AND cada task lleva `**Tras**:` con la task de la que depende, o `—`: «Quitar Sur de favoritas» lleva `Tras: Task 1`
- AND el plan dice que las tasks se ejecutan en orden, sin paralelo
- AND el plan no fija un tamaño en horas por task

**ADDED — La pregunta del gate de la spec lleva opciones fijas**

- GIVEN una feature en `pair` o `delegate`, con la spec lista para el gate
- WHEN el agente presenta la spec
- THEN la pregunta del gate es una llamada a `AskUserQuestion` con, al menos, «Apruebo (Recomendada)» y «Cambios»
- AND no es una pregunta en prosa al final del mensaje

**MODIFIED — El gate de la spec en `delegate` ofrece parar tras el plan para bajar la sesión a gama media** (antes: la opción podía ir en una pregunta en prosa)

- GIVEN una feature en `delegate`, una sesión con Opus 5.5 y la spec lista para el gate
- WHEN el agente presenta la spec
- THEN entre las opciones de `AskUserQuestion` está «Apruebo; escribe el plan y, si sale Native, para antes de la Task 1 para que baje la sesión a gama media», que no es la recomendada, con el mismo motivo
- AND si el usuario aprueba sin esa opción, el agente sigue sin parar hasta la validación, como hoy

**MODIFIED — La spec propone su propio nivel de review por complejidad** (antes: la pregunta no llevaba el modelo del revisor)

- GIVEN una spec en modo full recién redactada
- WHEN el agente cuenta las señales de la rúbrica
- THEN por defecto no hay review; con 4 señales o más, o contrato público + datos, el agente la recomienda **antes** de presentar la spec, en una sola pregunta con el nivel, las señales, el tamaño, qué comprobaría cada lente en esta spec, la opción mínima con lo que deja sin cubrir y el modelo del revisor de dominio
- AND si el Scope cambia menos de ~50 líneas (texto y código), el nivel baja de dos revisores a uno con los siete puntos, nunca a ninguno: con contrato público + datos y dos líneas en `db/002-site.sql` y `src/api.js`, un revisor
- AND si el nivel sería dos revisores, la spec va aprobada por delegación (la opción «apruebo la spec por delegación» de la primera pregunta) y las instrucciones del usuario piden confirmar antes de paralelizar, el agente despacha un revisor con los siete puntos sin preguntar, y la segunda lente queda en la línea del mínimo; con un nivel de «ninguna» no despacha ninguno
- AND con 4 señales o más y un delta grande (seis ficheros, uno de ellos una migración), sin esa restricción, siguen siendo dos revisores
- AND ninguna de esas líneas es genérica: cita un requisito, una sección o un valor de esta spec
- AND en `unattended` el agente decide y lo registra; en modo lite no se propone

**MODIFIED — El revisor de spec se despacha con su effort** (antes: siempre `model: sonnet`)

- GIVEN una spec de permisos por rol del gestor de cobros, con review de uno o dos revisores
- WHEN el agente pregunta la review
- THEN las opciones llevan el modelo del revisor de dominio, y la recomendada es Opus porque la spec toca roles; para «renombrar una columna del listado», la recomendada es Sonnet
- AND con un solo revisor de siete puntos, su modelo se elige igual, porque incluye la lente de dominio
- AND si la petición o el prompt de arranque dicen «revisor de dominio en Opus», no lo pregunta y lo aplica
- AND sin esa pregunta (spec aprobada por delegación, `unattended`), el revisor de dominio va en Sonnet
- AND cada despacho lleva `subagent_type: sdd-kit:effort-medium` y el modelo elegido; el revisor técnico, siempre `model: sonnet`

**MODIFIED — El trabajo se valida con el usuario antes de cerrar** (antes: la presentación empezaba por «Me salí del plan en…»)

- GIVEN una feature con la implementación terminada y la revisión final limpia, en un proyecto con `validation.mode` `manual` o sin la clave
- WHEN el agente va a cerrar
- THEN antes de invocar `sdd-end-feature` presenta, empezando por un párrafo con 🦆 sobre lo que cambia para quien usa el producto y siguiendo con «✋ Me salí del plan en…», las decisiones sin el dev-lead, el guion de pruebas y el smoke que ejecutó, y espera la validación explícita (qué probó el usuario y que funciona; «cierra la tarea» no lo es)
- AND el guion de pruebas son pasos numerados, cada uno con una acción en la aplicación y su resultado esperado, con los datos de los escenarios de la spec. Lo que no se puede probar en la aplicación lo dice en su paso, con la comprobación que sí se puede hacer. Va separado del smoke.
- AND el smoke da una fila por THEN de la spec con su evidencia, que es uno de tres valores: `suite`, `ejecución real` o `no probado`. Un THEN que se observa en una interfaz (pantalla, respuesta HTTP, salida de una CLI, fichero que produce el cambio) solo cuenta como verificado con `ejecución real`.
- AND un THEN de fallo (un error, un rechazo, un 400) se provoca de verdad con la entrada que falla: con la feature 0012, `curl -i localhost:<puerto>/api/bookings?status=Lost` → `400` con «Estado no válido: Lost», no «lo cubre el test de la task 3»
- AND el smoke dice cuánto tardó la suite completa
- AND un «sí» sin detalle a la pregunta de validación, que ya pedía el detalle, es validación: no se repregunta, y el walkthrough registra la frase literal y «no detalló qué probó»
- AND si el usuario no responde, la feature queda en espera con el smoke documentado; si difiere, se aplica «La validación puede diferirse con condiciones» de [`control-profiles`](control-profiles.md); en `unattended` se difiere al smoke de la release
- AND el walkthrough registra la validación separada de lo verificado por el agente, y las decisiones sin el dev-lead en su propia sección
- AND con `validation.mode: field` no presenta guion ni espera: el smoke por THEN y la suite se ejecutan igual, el mensaje con el que pasa al cierre empieza por el 🦆 y el ✋ de los rulings, y se aplica «Con `validation.mode: field`, la validación es en campo» de [`control-profiles`](control-profiles.md)

### Capacidad: `control-profiles`

**MODIFIED — Un cambio a la spec aprobada es un desvío** (antes: la enmienda se apuntaba en «Enmiendas» sin corregir el cuerpo de la spec)

- GIVEN la spec aprobada de cancelar reservas, con la Task 1 cerrada y la Task 2 en curso, que descubre que la spec pide guardar el motivo de la cancelación y la tabla de reservas no tiene ese campo
- WHEN el trabajo exige cambiar un requisito, un THEN, el Scope, un «No entra» o «Dónde se prueba»
- THEN en `pair` y `delegate` el agente para con el 🦆 del cambio y su ✋, deja escrito sin commitear el THEN corregido en su sitio de la spec y la línea en `## Enmiendas`, y espera la aprobación
- AND con la aprobación, commitea la spec, añade al plan `Task 3 — enmienda <fecha>: guardar el motivo de la cancelación` con su `Tras`, anota en `tasks.md` la Task 1 y la Task 2 como `afectada por enmienda <fecha> → Task 3`, y sigue implementando
- AND la Task 1 no se reabre ni se reescribe su commit; la Task 3 no se da por hecha sin su verificación ni su `sdd task done`
- AND sin aprobación no sigue con la enmienda
- AND la misma acción se aplica cuando la respuesta a un freno de alcance cambia el texto de la spec; si no lo cambia, la respuesta se apunta en «Enmiendas» sin corregir nada
- AND en `unattended` elige la opción más conservadora, la aplica igual en su sitio con su línea de «Enmiendas» marcada `sin aprobar` y, si no hay opción que no bloquee, aparca la feature (`⏸️ aparcada: <motivo>`)
- AND si la enmienda añade ficheros, la entrada nombra, antes de pedir la aprobación, las features abiertas del roadmap (⏳, 🔄, ⏸️, 🧪) que declaran alguno en «Ficheros que toca», o dice «solape no comprobable» si el roadmap no declara ficheros; con la aprobación, la fila de la feature añade esos ficheros

**MODIFIED — Salir del plan es un ruling visible** (antes: el bloque se llamaba «Me salí del plan en…»)

- GIVEN una ejecución que se aparta del plan sin cambiar la spec (un fichero de «NO se tocan», un orden distinto, un fix del hilo principal) y sin caer en un freno de alcance
- WHEN el agente decide
- THEN no para: registra el ruling, y todo commit del hilo principal entra en el alcance de la revisión de la task en curso; si no queda ninguna, de la revisión final de rama; y si la revisión final ya volvió, de la re-revisión del tramo `<revisión final>..HEAD`
- AND un commit del hilo que cambia menos de 20 líneas (añadidas más borradas, `git diff --numstat`; en un merge, las de `git show --remerge-diff`) y en el que todo lo que cambia es documentación o comentarios —ficheros bajo `.docs/`, `*.md` de cualquier ruta y líneas de comentario del código— no despacha revisor: el hilo lee el diff y lo anota en «✋ Me salí del plan en…» como `revisado en el hilo: <sha> · <ficheros> · <n> líneas`
- AND un `.md` que un agente o un programa lee como instrucciones o como plantilla, un comentario que una herramienta interpreta (`eslint-disable`) y cualquier otra línea, también un diccionario del corrector, despachan revisor
- AND la pasada de fix de la propia revisión final tampoco entra en la re-revisión del tramo: en Native la verifica su TDD, y en SDD su re-revisión acotada. Un commit posterior a la pasada sí entra
- AND la presentación de la validación abre con el 🦆 y el bloque «✋ Me salí del plan en…», separado del resto de decisiones

### Capacidad: `interviewing`

**ADDED — La entrevista contrasta el lenguaje con el glosario y con el código**

- GIVEN un `PRODUCT.md` cuya «Terminology» dice «**Cancelación**: la reserva que anula el cliente antes de 24 h. _Evitar_: baja», y un código con `cancelBooking` y `voidBooking`
- WHEN el usuario dice en la entrevista «cuando el admin da de baja una reserva, se libera la sala»
- THEN el agente dice la discrepancia antes de seguir: el glosario define cancelación como la que anula el cliente, y lo que describe la anula el admin; y pregunta si es una cancelación u otra cosa con nombre propio
- AND sin `PRODUCT.md`, contrasta solo con el código
- AND al terminar devuelve, con lo demás, los términos resueltos y las candidatas a ADR (difícil de deshacer, sorprende sin contexto y hubo una alternativa real)

**MODIFIED — Cuándo para la entrevista** (antes: devolvía dos listas más lo pendiente)

- GIVEN una entrevista en la que no queda ninguna decisión por preguntar
- WHEN el agente termina
- THEN devuelve a la skill que la invocó lo que decidió el usuario, lo que decidió el agente (con su motivo), lo pendiente, los términos resueltos y las candidatas a ADR
- AND si la skill que invoca tiene gate (spec, documento de la init, propuesta), la confirmación es ese gate: no pide una confirmación propia antes
- AND invocada desde `sdd-consult`, que no tiene gate, confirma con una sola pregunta
- AND no pregunta lo que la petición ya dice o delega, ni lo que puede averiguar leyendo el proyecto

**MODIFIED — Sin usuario, no pregunta** (antes: devolvía dos listas y lo pendiente, sin contraste de lenguaje)

- GIVEN una entrevista sin usuario presente (perfil `unattended`, o la skill que invoca dice que no hay nadie)
- WHEN `sdd-grilling` llega a una decisión
- THEN no la pregunta: decide las de método con su motivo, deja las demás como pendientes y devuelve a quien la invocó lo mismo que «Cuándo para la entrevista»
- AND una discrepancia de lenguaje con el glosario o el código queda como pendiente, con las dos lecturas
- AND las paradas de cada perfil siguen siendo las de `control-profiles`: `sdd-grilling` no añade ni quita ninguna

**Reglas de la capacidad**

- **Dónde viven los datos**: `sdd-grilling` no escribe ficheros; lee la sección «Terminology» de `PRODUCT.md` y el código para el contraste, y lo que devuelve lo escribe quien la invoca, en sus documentos de siempre (los términos resueltos y las candidatas a ADR, en «Términos y ADR» de la spec).
- **Idioma de los nombres**: el texto que ve el usuario (preguntas, listas «decidido por ti», «decidido por mí», «pendiente», «términos resueltos», «candidatas a ADR») va en su idioma; la skill, en inglés.
- **Límites**: una decisión por turno; sin tope de preguntas por entrevista (para con la frontera vacía); rebatir, una vez por respuesta.
- **Avisos**: no aplica.
- **Regla ante conflicto**: si el usuario pide rondas en la sesión, gana su petición en esa sesión; las paradas de `control-profiles` mandan sobre la entrevista; ante un término del usuario que contradice el glosario, gana el que el usuario confirme, y el glosario no se edita desde la entrevista.

### Capacidad: `explaining`

**MODIFIED — El 🦆 de un bloqueo lo cuenta en palabras del producto** (antes: sin regla para lo que queda por decidir)

- GIVEN el molde `exportes` con el test `exporta en la hora del usuario` en rojo, porque el formateador escribe la hora en UTC, y la feature 0012 sin poder cerrarse por ese test
- WHEN una skill invoca `sdd-rubber-duck` en modo corto para explicar al dev-lead por qué para
- THEN el párrafo, con 🦆, dice qué le pasa a quien exporta («una reserva de 10:00 sale en su calendario a las 08:00») antes que la causa técnica
- AND un término técnico que necesita, como UTC, se explica en la misma frase por su efecto
- AND lo que queda por decidir va después del párrafo como afirmación («falta decidir en qué hora se escribe»), sin pregunta

**MODIFIED — Una explicación larga sigue el camino real, paso a paso** (antes: la lista final se titulaba «Dónde mirar» en cualquier idioma)

- GIVEN el molde `exportes`
- WHEN el dev-lead pide «Explícame cómo viaja una exportación de punta a punta, desde que la pido hasta que tengo el fichero»
- THEN la respuesta son de 3 a 9 pasos numerados, cada uno respaldado por un fichero del molde, que siguen una exportación concreta (marzo, sala Norte) desde la orden hasta el fichero `.ics`
- AND usa las palabras del glosario («franja», «reserva»), no las del código (`slot`, `booking`)
- AND las rutas de fichero van solo en una lista final, titulada en el idioma del usuario: «Dónde mirar» si escribe en castellano, «Where to look» si escribe en inglés
- AND termina ofreciendo resolver dudas

**Reglas de la capacidad**

- **Dónde viven los datos**: no aplica; `sdd-rubber-duck` no escribe ficheros, y el párrafo 🦆 lo coloca la skill que lo pidió.
- **Idioma de los nombres**: todo lo que lee el usuario, el título de la lista final incluido, va en su idioma; los términos, los del glosario de `PRODUCT.md`; la skill, en inglés.
- **Límites**: el 🦆, un párrafo de cinco frases como máximo; la explicación larga, sin tope de pasos escrito en la skill.
- **Avisos**: no aplica.
- **Regla ante conflicto**: si el código usa una palabra de _Evitar_ del glosario, gana el glosario en la explicación.

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-08 | aprobada: «si apruebo» |
