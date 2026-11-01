---
id: 20261101-175419-feature-0163-spike-lane
feature: 0163
parent: 0160
proposal: 0131
title: Carril spike — spec corta, tasks con «Evidencia» y research con la tabla de objetivos
mode: full
profile: delegate
status: approved
created: 2026-11-01
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-01
---

# Spec — Carril spike

🦆 Hoy, «¿aguanta `libres` 1.000 reservas? quiero la tabla de medidas» se trata como una feature entera y el agente improvisa cómo contar el resultado: en dos casos reales dio por cumplido un objetivo medido a la mitad de su umbral. Con esto, esa petición produce una spec de una pregunta, sus objetivos y la decisión que desbloquea, y un `research.md` con una fila por objetivo: 2,5 min frente a ≥ 5 sale «no cumple tal como se definió», y la recomendación no puede apoyarse en ello. La revisión final comprueba cada fila contra su evidencia. Lo que el spike descubra que hay que arreglar va a su propia fila del roadmap, nunca a código en la rama.

Validación: agente — en campo (`validation.mode: field`); son skills y plantillas que se miden con sujetos.

## Capacidades

- Modificadas: `routing` — el spike deja de ir como full; `feature-flow` — forma del spike y la cláusula de las secciones; `verification` — el eje Spec contrasta el research; `archive` — el smoke de un spike va por objetivo.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `MODIFIED`, cuatro capacidades, con `archive` por enmienda (2 de 4) · tamaño: ~60 líneas en 11 ficheros
- Mínimo razonable: ninguna — deja sin cubrir solo lo que mira el repaso de coherencia, que ya he hecho

1. **El saldo de `sdd-templates` no llega a cero: sube ~96 palabras, contra lo que pediste.** La plantilla es justo donde pediste poner la regla: suma +213 palabras (research +130, spec +62, plan +21). Sin quitar instrucciones solo encuentro −117 de procedencia e historia (lista en «Topes de palabras»); bajar más exige quitar instrucciones de otras plantillas, cada una con su RED, o recortar el research que pides. Recomiendo aceptar esta excepción: el tope lo aguanta (16.419 de 19.650) y las otras cuatro skills sí quedan igual o bajan. Si no la aceptas, dímelo en «Cambios» y recorto «Descartadas» y «Sin medir» del research (−20) y busco el resto con RED.
2. Marca del carril: `mode: spike` en el frontmatter de `spec.md`, leído por `sdd-implement`, `sdd-verify` y `sdd-archive`. La carpeta sigue siendo `feature-<id>-<slug>`: cambiar el naming es cambio mayor (Art. IV). Lo que no diga `mode: spike` sigue como hoy; `brief.ts` solo mira `lite`, y no cambia.
3. `research-template.md` se reescribe entera y deja de ser «documento opcional previo a una spec»: ninguna skill la usa fuera del spike (búsqueda hecha). Se van «Opciones evaluadas», «Spike (si se hizo)» y «Referencias»; las opciones pasan a una línea «Descartadas» de la recomendación.
4. Los literales de la plantilla, además de los que trae la petición: `no medido con una persona` para lo simulado; sin fichero de evidencia, `no medido`; «No seguir» es una recomendación válida (lo trae Spec Kit: matar una idea es un resultado).
5. La tabla de aguante lleva el aviso «Un umbral cumplido con el recurso creciendo se dice»: la guía de soak de Grafana separa la deriva del umbral, y el ticket 0093 degradó a 160 s en la décima repetición.
6. La peor carga la fija la spec: `confirmada: «<frase del dev-lead>»`, o `sin confirmar` y va a ✋, de modo que aprobar la spec la confirma.
7. Un spike siempre corre en Native, aunque `execution` diga otra cosa: mide el hilo; el implementador de SDD pide tests RED que aquí no existen.
8. En la revisión final de un spike sale solo el eje Spec, que recibe además la ruta de `research.md` (la receta del paquete excluye esa carpeta: ticket 0091 §2). El eje Código revisaría scripts desechables, y Arquitectura no tiene nada que mirar. La re-revisión se queda.
9. «Sin código de producción» se comprueba en el eje Spec: un fichero del diff fuera de `.docs/` es Important o más. No añado verbo a la CLI (YAGNI, hasta un segundo caso). Los scripts de medida viven en la carpeta de la spec, como `probe/` en la 0162.
10. El smoke de `sdd-archive` va por objetivo en vez de por THEN (3 palabras); el resto del cierre no cambia: un spike sigue las ramas `Feature only:`.
11. En `unattended`, el spike sigue con su forma, sin pregunta: cambia «lite y spike van como full» por «lite va como full».
12. Se mantiene `plan.md` con la plantilla de siempre y su task con «Evidencia»: `sdd task start` lo necesita.
13. Se descarta la forma de spike de superpowers (sin tests, sin plan y sin revisión) porque aquí el entregable es la evidencia; sí coincide en que quedarse con lo que salió es una petición nueva.
- Política de modelos: revisores de la spec, ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos sonnet, salvo el revisor `sv1`, opus; por tandas · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

Repaso de coherencia: placeholders, contradicciones, alcance y ambigüedad, sin hallazgos que cambien la spec; corregí el recuento de la tabla de topes contra los borradores. `sdd capability merge` sobre una copia: acepta el delta, con 4 requisitos sustituidos y 4 añadidos en `routing`, `feature-flow`, `verification` y `archive`.

### Decisiones tomadas con el dev-lead

- Spec corta, tasks con «Evidencia» y research con la tabla — «spec corta… Tasks con "Evidencia" en vez de RED… `research-template.md` con la tabla»
- La regla, en la plantilla — «La regla escrita en la plantilla, y no en prosa de la skill, porque un agente se la salta menos (ADR 0014)»
- Frente limpio y n = 3 — «Un frente limpio sale de lo que se arregla y sigue como control en el GREEN. Un RED limpio de un frente con caso de campo se mide con n = 3 antes de sacarlo, sin que la petición del molde traiga la orden»
- Saldo — «El saldo de palabras de cada skill editada queda igual o baja, contado antes de presentar la spec» (ver la decisión 1)
- Excepción de saldo en `sdd-templates`, +96 palabras (decisión 1) — aprobada con la spec, opción «Apruebo»
- Mirar fuera — «busca en internet si alguien hace algo pareceido, y el upostream» (anexo)

## Intent

Un spike es una investigación que debe dejar evidencia medida y hoy se trata como una feature entera, con la forma improvisada. Tres tickets de campo (0091, 0093 y 0162) lo pagaron con objetivos dados por cumplidos sin medir, un revisor gastado en estados y un límite descubierto ya en la feature. Éxito: con «¿aguanta `libres` 1.000 reservas? quiero la tabla de medidas», un sujeto escribe la spec corta y `research.md` con la tabla; un objetivo bajo el umbral sale «no cumple» y la recomendación no lo disimula; el eje Spec marca una recomendación que cita algo no medido; y el spike cierra sin código de producción. Fracaso aunque funcione: una tabla que luce rigurosa y un estado que su evidencia no sostiene.

## Scope

- Entra: `skills/sdd-templates/templates/research-template.md`, `spec-template.md`, `plan-template.md` y `skills/sdd-templates/SKILL.md` (su línea de `research`); `skills/sdd-propose/SKILL.md`, `references/spec-writing.md`, `references/plan-writing.md` (spike, Native) y `references/control-profiles.md`; `skills/sdd-implement/SKILL.md`; `skills/sdd-verify/SKILL.md` y `references/spec-reviewer-prompt.md`, este con el hueco de la ruta de `research.md`, con recortes en `references/encargo-revision.md`; `skills/sdd-archive/SKILL.md`; las baterías de `sdd-propose`, `sdd-implement` y `sdd-verify`, y su evidencia en `tests/`.
- No entra: otros carriles ni la clasificación de patch, lite y feature; B15; un verbo de CLI; `sdd-tdd`, que ya dice que el spike lleva «Evidencia»; `implementer-prompt.md`, que el spike no usa.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «Until its own shape exists, it runs as a full feature» | `skills/sdd-propose/SKILL.md:44` | Scope |
| «(also while it runs as a full feature)» | `references/spec-writing.md:26` | Scope |
| «spike go as full» / «spike van como full» | `skills/sdd-propose/SKILL.md:56`, `references/control-profiles.md:48` | Scope, decisión 11 |
| «sigue como feature full hasta que la 0163 le dé su forma» | `capabilities/routing.md:192` | delta, `MODIFIED` |
| «lite va en full y spike va como full» | `capabilities/routing.md:171` | delta, `MODIFIED` |
| «(también mientras el spike corra como full)» | `capabilities/feature-flow.md:561` | delta, `MODIFIED` |
| «Optional: prior research with a timebox» | `skills/sdd-templates/SKILL.md:24` | Scope |
| Secciones de `research-template.md` | solo la plantilla; el research de la 0162 es histórico y no se toca | decisión 3 |
| `mode: full | lite` | `spec-template.md:7` | Scope |

- Filas que implementa: 0163 y las tres de deuda del roadmap (ticket de la 0162, de la 0091 y de la 0093) → `roadmap.md:92`, `:277`, `:290`, `:292` y `routing.md:192`; las marca `sdd-archive`.

## Approach

La regla vive en el hueco de lo que el agente calca: tabla y estados en `research-template.md`, el bloque de spike en `spec-template.md`, «Evidencia» en `plan-template.md`. Las skills solo dicen cuándo se calca y qué cambia. Una task del plan por superficie: (1) plantillas y `sdd-propose`; (2) `sdd-implement`; (3) `sdd-verify` y `sdd-archive`.

## Dónde se prueba

- Spec corta y plan con «Evidencia»: batería `sdd-propose`, `k2` para la spec y `k2p`, nuevo, para el plan: `k2` para en el gate.
- Research con la tabla, «no cumple» y lo simulado: `sp1`, nuevo, batería `sdd-implement`: spec aprobada y medidas ya en disco (2,5 min frente a ≥ 5; un objetivo sin medir; uno simulado por el agente).
- Tabla de aguante: `sp2`, nuevo, batería `sdd-implement`: el molde `reservas`, sin que la petición nombre la tabla ni las repeticiones.
- Sin código de producción: `sp3`, nuevo, batería `sdd-implement`: la medida deja a la vista un arreglo de una línea en `src/`.
- Eje Spec: `sv1`, nuevo, batería `sdd-verify`: un research con una recomendación que cita una fila `no medido`, y un fichero de `src/` en el diff.
- Saldo: `cli/test/kit/word-budget.test.ts`, y la cuenta de cada skill en el walkthrough.

Un frente con RED limpio se mide con n = 3 si tiene caso de campo (todos lo tienen salvo `sp3`, sale con n = 2) y sale de lo que se arregla, como control en el GREEN. La petición del molde no trae la orden.

## Términos y ADR

- Términos resueltos: spike — ya en `mission.md`; «no cumple tal como se definió» — medido por debajo del umbral, aunque funcione.
- ADR candidatas: ninguna: la ADR 0014 ya cubre la forma.

## Delta de comportamiento

### Capacidad: `routing`

#### MODIFIED — Full y spike anuncian y siguen; patch, lite y config preguntan (antes: "lite va en full y spike va como full")

- GIVEN el molde `reservas` en `delegate`
- WHEN el usuario pide «que el responsable de sala pueda anular reservas de otros», que es feature full
- THEN `sdd-propose` anuncia el carril, el perfil y de qué nivel sale, y la frase para aprobar la spec por delegación, y sigue con la entrevista en el mismo mensaje, sin pregunta de confirmación
- AND con «si cancelo una reserva que no existe me dice "cancelada" igual», que es patch, pregunta en prosa antes de abrir rama, carpeta o id, con el 🦆 de lo que hará y, si existe `estimation.md`, la estimación en horas
- AND con un cambio que cumple el predicado de lite, la pregunta ofrece lite citando sus condiciones una por una
- AND si la feature prevé más de 5 tasks, la pregunta de partir sustituye al anuncio y lleva la opción de aprobar la spec por delegación
- AND en `unattended` no pregunta: patch, config y spike siguen, y lite va en full
- REMOVED AND en `unattended` no pregunta: patch y config siguen, lite va en full y spike va como full

#### MODIFIED — Una investigación con evidencia entra por el carril spike (antes: "sigue como feature full hasta que la 0163 le dé su forma")

- GIVEN el molde `reservas`
- WHEN el usuario escribe «¿aguanta `libres` con 1.000 reservas? quiero la tabla de medidas»
- THEN `sdd-propose` lo clasifica como spike y lo anuncia, sin pregunta de confirmación, y escribe la spec con `mode: spike`
- AND «¿se puede filtrar `libres` por planta?», sin pedir evidencia, entra por `sdd-explore`
- REMOVED THEN `sdd-propose` lo clasifica como spike y lo anuncia como un full, sin pregunta de confirmación, y sigue como feature full hasta que la 0163 le dé su forma

### Capacidad: `feature-flow`

#### MODIFIED — Una feature grande devuelve el diseño por secciones antes de la spec (antes: "también mientras el spike corra como full")

- GIVEN la feature 0012 en `delegate`, con 5 tasks previstas en el recuento del paso 2 y la entrevista cerrada
- WHEN el agente va a escribir `spec.md`
- THEN antes presenta el diseño por secciones, una por mensaje, y pregunta «¿va bien?» tras cada una
- AND lo que el usuario corrige en una sección entra en la spec antes de escribirla
- AND el recuento es el de la feature que se especifica, hecho al entrar en el paso de spec: un lite o un patch que suben a full cuentan ahí, y tras partir cuenta la pieza
- AND con 2 tasks previstas, en lite o en spike, escribe la spec sin secciones y la presenta en el gate
- REMOVED AND con 2 tasks previstas, en lite o en spike (también mientras el spike corra como full), escribe la spec sin secciones y la presenta en el gate
- AND con la spec aprobada por delegación o en `unattended` no presenta secciones: lo que habría preguntado va a «✋ Decisiones que he tomado yo»; si el usuario pide empezar ya, tampoco
- AND las secciones son turnos de la entrevista dentro de la parada de la spec, no una parada nueva del perfil: valen en `pair` y en `delegate`
- AND cada sección abre con lo que cambia para quien usa el producto, con un ejemplo con datos («`informes --sala Norte` enseña las cuatro vistas solo de Norte»), y la pregunta es sobre eso; un nombre de código (`active`, `rooms`, `src/app.js`) no abre ninguna sección y, si hace falta, va detrás

#### ADDED — Un spike tiene spec corta

- GIVEN el molde `reservas`
- WHEN el usuario escribe «¿aguanta `libres` con 1.000 reservas? quiero la tabla de medidas»
- THEN `spec.md` lleva `mode: spike`, «Capacidades: Ninguna, porque investigación», y en vez de Intent, Scope, Approach, «Dónde se prueba» y delta, la pregunta, los objetivos con su umbral numérico y la decisión que desbloquea
- AND un objetivo de rendimiento lleva la peor carga, con la frase del dev-lead que la confirma o `sin confirmar` en ✋
- AND el plan se escribe con «Evidencia» en cada task en vez de «Tests RED»

#### ADDED — Un spike deja su evidencia en `research.md`

- GIVEN un spike con el objetivo «≥ 5 min» medido en 2,5 min, un objetivo sin medir y uno que el agente simuló en vez de una persona
- WHEN el agente escribe `research.md`, calcado de `research-template.md`
- THEN hay una fila por objetivo, con Objetivo, Estado, Detalle y Evidencia, y la primera dice `no cumple tal como se definió`
- AND el segundo dice `no medido` y el tercero `no medido con una persona`; ninguna fila dice «cumple en parte»
- AND la recomendación no cita ninguno de los tres como apoyo
- AND con un objetivo de rendimiento, hay una tabla de aguante de ≥ 10 repeticiones con la peor carga, tiempo y recurso acumulado por repetición

#### ADDED — Un spike cierra sin código de producción

- GIVEN un spike cuya medida deja a la vista un arreglo de una línea en `src/`
- WHEN el agente termina las tasks
- THEN el arreglo no está en la rama, y `research.md` §5 lo nombra con su fila del roadmap
- AND los scripts de medida y las salidas en bruto quedan en la carpeta de la spec
- AND cada task corre en Native, con su salida en bruto como evidencia y sin tests RED

### Capacidad: `verification`

#### ADDED — El eje Spec contrasta el research de un spike

- GIVEN un spike con una recomendación que cita un objetivo `no medido` como apoyo, y un fichero de `src/` en el diff
- WHEN `sdd-verify` despacha la revisión final
- THEN sale solo el eje Spec, que recibe la ruta de `research.md`
- AND marca como Important o más la recomendación, una fila cuyo estado su evidencia no sostiene y el fichero de `src/`

### Capacidad: `archive`

#### MODIFIED — El walkthrough dice de dónde sale cada THEN y cuánto tarda la suite (antes: "una fila por THEN con su evidencia")

- GIVEN una feature cerrada con `sdd-archive`
- WHEN se escribe «4. Verificación» del walkthrough
- THEN «4.1 Builds» lleva la línea `Gate:` del gate de cierre, con las suites unitarias, su duración, su configuración (la del gate, o lo que se añadió) y el sha de la validación; si se repitió tras el merge de sincronización, el mensaje final da su resultado y su sha
- AND si el sha de la validación cae en el tramo que el cierre junta (una pasada de fix o un borrador tras la última task), «4.1 Builds» dice «sobre el commit de cierre» en lugar del sha, y `--verified-at` y el mensaje final llevan el sha del commit de cierre; nunca el de la última task
- AND con E2E, «4.1 Builds» lleva el comando de «Entorno de la suite» con su comprobación, levantado en esa sesión, y la duración de la suite E2E frente a «Presupuesto E2E»
- AND «4.2 Smoke / tests» tiene una fila por THEN, o por objetivo en un spike, con su evidencia (`suite` · `ejecución real` · `no probado`)
- AND si la suite E2E pasó de su presupuesto, o, sin presupuesto, la suite pasó de 10 minutos, «4.3 Residuales» lo apunta como deuda del proyecto con su duración
- REMOVED AND «4.2 Smoke / tests» tiene una fila por THEN con su evidencia (`suite` · `ejecución real` · `no probado`)

## Topes de palabras

Cuenta de `word-budget.test.ts` sobre el borrador de cada texto, antes de presentar. Saldo por skill, total con `references/` y plantillas:

| Skill | Medido / tope (×1,25) | Suma | Resta, sin quitar instrucción | Saldo |
| --- | --- | --- | --- | --- |
| `sdd-templates` | 16.419 / 19.650 | +213 | −117: frases «Recibido de la spec ligera…» de `plan-template.md` (−34), «Sin ella en la plantilla…» (−29), «Medido con superpowers 6.4.2…» hasta «paginación» (−26), «(medido en `tests/proportional-review-red.md`)» y su motivo (−28) | **+106** (decisión 1 y enmienda) |
| `sdd-propose` | 13.928 / 17.750 | +13 | −8 en `spec-writing.md`; −5 o más: la racionalización «It's only a version bump», que `using-sdd` y «Config lane» ya dicen | ≤ 0 |
| `sdd-implement` | 17.505 / 22.175 | +50 | −46 o más: dos red flags que repiten su tabla y su párrafo: «stop a process by its name» y «mark a UI task done because…» | ≤ 0 |
| `sdd-verify` | 9.635 / 11.400 | +60 | −60: párrafos de procedencia de `encargo-revision.md` («Es lo que pedía…», «Por qué: la plantilla…») | ≤ 0 |
| `sdd-archive` | 9.924 / 10.000 | +3 | −3 en la misma frase | 0 |

Ningún tope sube. Ningún test fija las frases que se recortan (búsqueda en `cli/test` y `tests/batteries`). Lo que queda de ellas vive en `tests/*.md`, donde se midió.

## Previsión de coste

Precio: ~0,5 $ por sujeto de spec o de research, ~1 $ si mide de verdad (0,28 $ el sujeto corto en `tests/sdd-propose-0160-red.md`); `sv1`, ~0,75 $ (revisor de la 0162, medido). Pasos nuevos: `sdd-propose` paso 2 → `k2`; `spec-template` → `k2`; `plan-template` y `plan-writing` → `k2`; `research-template` → `sp1` y `sp2`; `sdd-implement` → `sp2` y `sp3`; `spec-reviewer-prompt` y tabla de ejes → `sv1`; `sdd-archive` smoke por objetivo → sin medir: 3 palabras, lo cubre `Art. I` en el humo de release; `control-profiles` y `unattended` → sin medir: el texto solo deja de excluir.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `k2`, `sp1` × 2 (1 $ cada par), `sp2`, `sp3` × 2 (2 $ cada par), `sv1` × 2 (1,5 $) | 7,5 |
| Un RED limpio con caso de campo, a n = 3 | 1 sujeto más, en el peor caso en 2 frentes | 2 |
| GREEN | los mismos | 7,5 |
| Una tanda de REFACTOR | la mitad | 4 |
| Controles | tramos `spike` y `plan` de `sdd-propose`, y `f1` de `sdd-verify` × 2 | 3 |
| Medición tras la revisión final | `k2`, `sv1` | 2 |
| Suma | | 26 |

## Anexo — Qué hacen otros

Nadie junta tabla, vocabulario fijo y contraste en la revisión; la idea no está repetida.

| Fuente | Qué hace | Qué me quedo |
| --- | --- | --- |
| Spec Kit, `extensions/assess` (upstream, 2026-10-13) | `research.md` previo a la spec: «every claim must carry a citation or be flagged as an assumption», sección obligatoria «Evidence Against the Idea»; matar una idea es un resultado | «No seguir» es válido. Es de descubrimiento, sin medidas ni umbrales |
| superpowers 7.0.0, `brainstorming` | Spike desechable: sin tests, sin plan y sin revisión; quedarse lo que salió es una petición nueva | Lo segundo. Lo primero, no: aquí se entrega evidencia |
| mattpocock, `prototype` | Código desechable que responde a una pregunta, en rama aparte; se guarda la respuesta | Scripts marcados como desechables. El prototipo no mide |
| OpenSpec, `openspec-explore` | Solo sugiere «a spike task» | Nada |
| awesome-copilot, `create-technical-spike` | Una pregunta por spike, timebox, checklist de criterios, recomendación (leído en resúmenes del buscador; la página dio 404) | Coincide en «una pregunta». Sin umbrales ni estados medidos |
| Grafana, k6 soak | Separa el umbral de la deriva: una deriva lenta deja pasar el umbral durante horas | Decisión 5 |

Fuentes: [Spec Kit](https://github.com/github/spec-kit) · [superpowers](https://github.com/obra/superpowers) · [mattpocock/skills](https://github.com/mattpocock/skills) · [OpenSpec](https://github.com/Fission-AI/OpenSpec) · [create-technical-spike](https://mcpservers.org/pt-BR/agent-skills/github/create-technical-spike) · [Grafana, documentar resultados de soak](https://grafana.com/docs/learning-paths/k6-soak-testing/document-soak-results/)

## Enmiendas

- 2026-11-01 — El párrafo de `sdd-implement` queda en una frase y «production code never» no se escribe: `sp3` limpio en `src/`, y `sp1` y `sp2` en verde solo con la plantilla — Task 2 — aprobada (opción «Apruebo»)
- 2026-11-01 — `spec-reviewer-prompt.md` solo gana el hueco de la ruta, sin el bloque del contraste: `sv1` RED limpio 3/3 — Task 3 — aprobada (opción «Apruebo»)
- 2026-11-01 — «Dónde se prueba» gana `k2p` — Task 1 — aprobada (opción «Apruebo»)
- 2026-11-01 — Delta nuevo en `archive`, y «Important, `contradicts`» pasa a «Important o más»: en `sv1`, O1 y la recomendación salen Critical — revisión final — aprobada (opción «Apruebo»)
- 2026-11-01 — «Sale solo el eje Spec» queda sin sujeto de despacho, y el THEN de §5 nombra la fila por abrir: ninguno de los sujetos de `sp3` la abrió, como se presentó en la parada — revisión final — aprobada (opción «Apruebo»)
- 2026-11-01 — El tope de `sdd-templates` pasa de +96 a lo que mide tras la pasada de fix: los huecos que pidió la revisión final — revisión final — aprobada (opción «Apruebo»)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-01 | aprobada (opción «Apruebo») |
