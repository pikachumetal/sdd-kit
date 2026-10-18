---
id: 20261017-220801-feature-0185-propose-fixes
feature: 0185
title: propose-fixes — margen de palabras, repaso de lo que se retira, delta probado, política de modelos, plan por cláusula y patch con su test
mode: full
profile: delegate
status: approved
created: 2026-10-18
author: Claude (Opus 5.5)
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-18
---

# Spec — propose-fixes: diez arreglos de `sdd-propose` y de las plantillas de spec y plan

🦆 Cuando apruebes una spec, ya vendrá con lo que hoy sale en el cierre: cuánto margen de palabras le queda a cada skill que edita y qué tope propone, cada sitio que nombra lo que retira, el delta pasado por `sdd capability merge` y qué modelos revisan. Al aprobarla das también la confirmación de los revisores en paralelo, así que la revisión final no vuelve a pararte. En el plan, cada trozo de un THEN apunta a la task que lo comprueba, y cada «Verificación» acaba en una línea de resumen. Al clasificar, un patch tiene que ser algo que un solo test reproduce: «un comando `reservas <sala>` con su formato, su mensaje vacío y un cambio en `libres`» deja de entrar como patch y se ofrece como lite. Y cada sección del diseño abre con lo que cambia para quien usa el producto, sin nombres de código.

## Capacidades

- Modificadas: `feature-flow` — el repaso de coherencia busca lo que la spec retira o cambia de forma y los ids de las filas que implementa, y prueba el delta; las secciones del diseño abren en llano; nacen el margen de palabras, la política de modelos de la spec, el self-review por cláusula, la línea de resumen de la «Verificación» y la fila de «Aprobaciones» sin rol
- Modificadas: `capabilities` — un `MODIFIED` quita una línea con `- REMOVED <línea>` y un renombrado es REMOVED + ADDED
- Modificadas: `routing` — un patch es lo que un solo test reproduce

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED (3 requisitos), tres o más capacidades (3) · tamaño: ~150 líneas en 8 ficheros de skills y plantillas
- Mínimo razonable: ninguna — deja sin segunda lectura que los MODIFIED copien enteros sus requisitos; lo comprueba `sdd capability merge` sobre una copia antes del gate (decisión 4)
```

1. **Topes de palabras** (medido el 2026-10-18 con el conteo de `WordBudget.Tests.ps1`): `sdd-propose` sube a `SkillMd = 5200; Total = 6700` (hoy 4.908 / 5.000 y 6.324 / 6.325) y `sdd-parallel-agents` a `SkillMd = 1150; Total = 1150` (hoy 1.083 / 1.100). Cada tope es lo medido más lo previsto (~+180 en `SKILL.md` y ~+75 en referencias de `sdd-propose`; ~+45 en `sdd-parallel-agents`) más un 2 % para la pasada de fix. `sdd-templates` sigue con el tope suspendido. Detalle en «Previsión de la prueba».
2. **El margen va en la plantilla de la spec, no en la constitution**: un bloque condicional `## Topes de palabras` *(solo si el proyecto pone topes a lo que la spec edita)*, con la tabla «Fichero · medido / tope · margen · tope propuesto». Su ayuda lleva las tres reglas que diste: margen para la pasada de fix (lo previsto + 2 %, mínimo 20 palabras); el tope de una skill que funde otras parte de la suma medida de las fuentes, menos lo común, más margen; y lo que se recorte para caber es una edición de skill con su RED. Motivo: Art. II, elemento omitido → hueco en la plantilla que se rellena. En la 0175 no había sitio para lo medido frente a lo previsto.
3. **Lo que se retira o cambia de forma** va en un hueco obligatorio de la plantilla, `## Lo que se retira o cambia de forma`, tras «Scope». Es una tabla «Qué · dónde aparece (`capabilities/`, `skills/`, docs) · destino (delta, Scope o decisión con motivo)», con una fila «Filas que implementa: <id> → <ficheros que la nombran>», o «nada: comprobado con `<búsqueda>`». La fila se queda aunque se borren los bloques de ayuda. El «Coherence pass» del paso 4 la rellena buscando cada nombre o literal (una etiqueta, un encabezado, una línea fija de plantilla) y cada id de fila en `capabilities/` y `skills/`. Sustituye a la frase «For each `MODIFIED`… search outside the spec…», que pasa a ser un caso de la fila.
4. **El delta se prueba antes del gate**: el «Coherence pass» copia `.docs/sdd` a una carpeta temporal fuera del repo y ejecuta allí `sdd capability merge --path <copia> --artifact <spec.md>`. Un rechazo se corrige en la spec antes de presentarla, y la línea del resultado (`sdd capability merge sobre una copia → <n> sustituidos, 0 errores`) va en este bloque de decisiones. En esta spec: `sdd capability merge sobre una copia → 3 sustituidos, 6 añadidos, 1 regla, 0 errores` (2026-10-18).
5. **Política de modelos** (solo en `delegate`): una línea obligatoria en el ✋ de la plantilla, `Política de modelos: revisores de la spec <modelo o ninguno> · ejes de la revisión final <Spec opus+high, Código sonnet+high, Arquitectura según el plan> · en paralelo hasta control.maxParallelAgents`. La regla de que «aprobar la spec cuenta como la confirmación de paralelizar que pidan las instrucciones del usuario» vive en `sdd-parallel-agents`, por donde pasan los dos despachos en paralelo (revisores de spec y ejes). No va en `sdd-verify`, que está en 2.885 de 2.900. La de esta feature: `Política de modelos: revisores de la spec ninguno · ejes de la revisión final Spec opus+high, Código sonnet+high, Arquitectura no (solo texto de skills y plantillas) · sujetos de la campaña Sonnet (mp1 en Opus), por tandas de hasta 5 de tests/headless/battery.sh · en paralelo hasta control.maxParallelAgents (3)`. Al aprobar la spec, confirmas esos despachos en paralelo.
6. **«Aprobaciones»**: la tabla pasa a `| Nombre | Fecha | Estado |`, y el frontmatter `approvers` pierde `role:`, que tampoco lee nadie. Con una opción elegida, el Estado es `aprobada (opción «Apruebo»)`, la etiqueta sin el sufijo «(Recomendada)». La frase literal va solo cuando el usuario la escribe: `aprobada: «sí, adelante»`. Las fixtures de las baterías no cambian: son artefactos de su fecha, y `subject.sh` las edita con su forma.
7. **Self-review del plan por cláusula**: §4 de `plan-template.md` cambia `<requisito de la spec> → Task <n>` por una línea por cláusula (`<THEN o AND> → Task <n>, <test o fila de medición que la observa>`). Si nada la observa, la línea dice `sin observar: <motivo>` y el plan lo avisa antes de ejecutar. El punto 1 del self-review de `plan-writing.md` dice lo mismo.
8. **Regla retirada → tests**: si la spec trae la tabla «regla retirada → dónde vive ahora», §4 lleva una línea por fila con su task y el test que busca la regla en su destino. El hueco va en la plantilla, junto a las líneas del Review Focus.
9. **«Verificación»** de una task: el placeholder pide un comando cuya última línea es el resumen (con Vitest, `Tests  12 passed (12)`), sin códigos de color (`--reporter=dot`, `-CI`, `NO_COLOR=1`), y que sale con un código distinto de 0 si algo falla.
10. **Patch = un test lo reproduce**: en el paso 2 y en «Is it really a patch?» de `sdd-propose`, un patch nombra **el** test que hoy sale en rojo y el arreglo pone en verde; en un ajuste o una retirada de presentación, la captura del estado actual. Si hacen falta dos o más tests de comportamientos nuevos, no es patch: se ofrece lite si cumple su predicado y, si no, feature. La pregunta del carril de un patch lleva el nombre del test. No se quita la clase «petición cerrada» (lo hablamos en la sección 3).
11. **Secciones en llano**: «Design by sections» de `spec-writing.md` dice que cada sección abre con lo que cambia para quien usa el producto, con un ejemplo con datos, y que la pregunta es sobre eso; los nombres de código, ficheros y flags internos van detrás, si hacen falta. Es la forma del modo corto de `sdd-rubber-duck`.
12. **Ejecución prevista**: Native, en 5 tasks (decisiones 1-6 · 5 · 7-9 · 10 · 11). Lo decide el plan.
13. **Lo que entra, lo que sale** (Art. I): salen la columna «Rol», el `role:` del frontmatter, la frase «lo que no esté aquí desaparece» del `MODIFIED` y la frase suelta del «Coherence pass» sobre cada `MODIFIED`, que se funde en la fila de la decisión 3.
14. **Fuera**: el minor de la 0113 (una fila del Review Focus por línea, descartado en el roadmap) solo entra si el GREEN del plan lo saca.

### Decisiones tomadas con el dev-lead

- La previsión mide el margen de palabras de cada skill o documento que edita y deja sitio para la pasada de fix; el tope de una skill que funde otras parte de la suma medida de las fuentes, menos lo común, más margen; lo que se recorta para caber se trata como edición de skill, con su RED — prompt de arranque, 2026-10-18
- La ayuda del `MODIFIED` dice que lo que se quita va con `- REMOVED <línea>` y que un renombrado es REMOVED + ADDED; el gate de la spec prueba el delta con `sdd capability merge` sobre una copia — prompt de arranque, 2026-10-18
- En `delegate`, la política de modelos es una decisión de la spec y cubre los ejes de la revisión final — prompt de arranque, 2026-10-18
- La tabla «Aprobaciones» pierde la columna «Rol» — prompt de arranque, 2026-10-18
- Diseño por secciones: spec y gate (sección 1), plan (sección 2), carriles y preguntas (sección 3), con el patch acotado a lo que fija un solo test y sin quitar la clase «petición cerrada» — «si», «si», «si», 2026-10-18

## Intent

Siete features pasaron su tope de palabras en el cierre y recortaron texto ajeno, una vez sin RED. Tres specs no vieron un sitio que nombraba lo que retiraban. La 0156 descubrió en el cierre que su delta no fusionaba. Cinco proyectos pararon en `delegate` para confirmar modelos fuera de las paradas del perfil. Un plan dio por cubierto un THEN del que solo miraba la mitad. Y el dev-lead vio entrar como patch features sin spec («estamos yendo mucho a patch para hacer lites») y contestó a un diseño que no entendía. El éxito es que todo eso salga antes del gate de la spec y no después: cero recortes sin RED en el cierre, cero rechazos de `capability merge` en el cierre, ninguna parada para confirmar paralelos con la spec aprobada, y en el RED de `pl1` y `pb`, 2 de 2 en verde donde hoy 0 de 2.

## Scope

- Entra: `skills/sdd-templates/templates/spec-template.md` (topes, lo que se retira, política de modelos, ayuda del `MODIFIED`, «Aprobaciones» y frontmatter), `skills/sdd-templates/templates/plan-template.md` (§4 por cláusula y regla retirada, «Verificación»), `skills/sdd-propose/SKILL.md` (paso 2, «Is it really a patch?», «Coherence pass» y prueba del delta en el paso 4), `skills/sdd-propose/references/spec-writing.md` («Design by sections»), `skills/sdd-propose/references/plan-writing.md` (self-review, punto 1), `skills/sdd-parallel-agents/SKILL.md` (la aprobación de la spec como confirmación), `tests/WordBudget.Tests.ps1` (topes de la decisión 1), las baterías de `sdd-propose` (`pl1`, `sp1`, `pl2`) y de `sdd-verify` (`mp1`), y los Pester de frases que fijen lo nuevo.
- No entra: quitar la clase «petición cerrada» (`routing`, `sdd-start-patch`, `patch-template.md`, `PatchLane.Tests.ps1`), `review-spec.md` (su regla de un revisor sin preguntar sigue y es compatible), la constitution (decisión 2), y las fixtures de las baterías con «Rol» (decisión 6).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Cabecera `\| Rol \| Nombre \| Fecha \| Estado \|` de «Aprobaciones» | `spec-template.md:131`; fixtures de `tests/batteries/*/fixtures/spec-*.md` | plantilla: cambia; fixtures: decisión 6. `control-profiles.md:42` y `:233` y la capacidad `control-profiles` (líneas 31 y 286) nombran la fila por fecha y Estado: compatibles |
| `role: dev-lead` en `approvers` | `spec-template.md:13`; las mismas fixtures | plantilla: sale; fixtures: decisión 6 |
| «lo que no esté aquí desaparece» (ayuda del `MODIFIED`) | `spec-template.md:99`; la misma frase en `spec-template.md:108` es de «Reglas de la capacidad» y es cierta allí | `:99` cambia; `:108` se queda |
| `<requisito de la spec> → Task <n>` (§4) | `plan-template.md:195`; `PlanReviewFocus.Tests.ps1` lee §4 por su encabezado | plantilla: cambia; el test lee el encabezado, que no cambia |
| Placeholder de «Verificación» | `plan-template.md:148`; capacidad `feature-flow` (líneas 330, 461 y 507) usa el campo, no su placeholder | plantilla: cambia |
| Frase «For each `MODIFIED`… search outside the spec» | `sdd-propose/SKILL.md:62`; batería de `sdd-propose`, procedencia | se funde en la fila de la decisión 3; la procedencia se actualiza |
| Filas que implementa: 0185 | solo `roadmap.md` (fila 0185 y la de la 0152, que la nombra entre sus previas) | ninguna que actualizar en `skills/` ni `capabilities/` |

## Approach

Cada frente lleva su RED antes de la spec. Los de conducta se midieron con sujetos: `pl1` 0 de 2, porque los dos abrieron un patch de tres tests; `pb` 0 de 2, porque las dos primeras secciones abren con `active`, `rooms` y `src/app.js`. Los estructurales se verificaron leyendo fichero y línea:

- `spec-template.md:99` contra `cli/src/capabilities/merge.ts:117`.
- `spec-template.md:13` y `:131`.
- `plan-template.md:148` y `:195`.
- `plan-writing.md:23`.
- `sdd-propose/SKILL.md:62`: el repaso parte solo de los `MODIFIED`, y el gate no ejecuta `capability merge`.
- `sdd-parallel-agents/SKILL.md`, «The project's cap»: sin regla de confirmación; la única equivalente está en `review-spec.md:23`, para la review de la spec.
- La plantilla de la spec no tiene sitio para topes, retiradas ni política de modelos.

El GREEN mide cada hueco con un sujeto que escribe la spec o el plan, y la conducta con `pl1`, `pb` y `mp1`. El tramo de la batería de `sdd-propose` corre como control.

## Dónde se prueba

- Huecos de la spec (topes, lo que se retira, política de modelos, «Aprobaciones», prueba del delta): batería de `sdd-propose`, escenario `sp1` en un molde con tope de palabras, una fila que la spec implementa y un requisito que se renombra; Pester de frases sobre la plantilla.
- Plan por cláusula, regla retirada y «Verificación»: batería de `sdd-propose`, escenario `pl2` sobre una spec con un THEN de dos cláusulas y la tabla «regla retirada»; Pester sobre `plan-template.md`.
- Patch con su test: `pl1` (sube a lite) y `a3` como control (un fallo sigue como patch).
- Secciones en llano: `pb` y `pb-c` como control.
- Aprobar cuenta como confirmación: batería de `sdd-verify`, escenario `mp1`, con un `CLAUDE.md` del molde que pide confirmar antes de paralelizar.
- Topes: `tests/WordBudget.Tests.ps1`.

## Términos y ADR

- Términos resueltos: **margen de palabras** — tope menos lo medido de una skill o documento con tope; **política de modelos de la spec** — la línea del ✋ que dice qué modelos revisan y si van en paralelo
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `feature-flow`

**MODIFIED — La spec se repasa antes del gate** (antes: «para cada `MODIFIED` busca en el código…»)

- GIVEN una spec redactada en la que un mismo literal (una expresión, un fichero, un umbral) aparece en una decisión y en un escenario que se contradicen
- WHEN el agente termina el paso 4, con o sin review de spec
- THEN corrige la contradicción, o la señala, antes de pedir la aprobación
- AND para cada `MODIFIED` busca en el código dónde se implementa lo que cambia y lista en el Scope cada fichero que lo implementa, o dice por qué queda fuera: con «Búsqueda por cliente» en `src/search.js` y en `src/phone.js` y un Scope que solo nombra el primero, el Scope pasa a nombrar los dos
- AND lo que cambió aparece en «Decisiones que he tomado yo»
- AND si la spec retira algo o cambia la forma o el sitio de un documento (un literal de plantilla incluido: una etiqueta, un encabezado, una línea fija), busca su nombre en `capabilities/` y `skills/` y escribe cada resultado en «Lo que se retira o cambia de forma», con su destino: el delta, el Scope o una decisión con su motivo; con la etiqueta `- Real:` pasada a `- Esfuerzo real:` en `patch-template.md` y dos requisitos de `estimation` que la nombran, los dos van al delta como `MODIFIED`
- AND la misma sección lleva cada id de fila que la spec implementa con los ficheros que la nombran («la define la 0009» en `docs/config.md` → Scope), o «nada: comprobado con <búsqueda>», y no se borra con los bloques de ayuda
- AND antes del gate ejecuta `sdd capability merge --path <copia> --artifact <spec.md>` sobre una copia de `.docs/sdd` fuera del repo, corrige en la spec lo que rechace y escribe la línea del resultado en «Decisiones que he tomado yo»; la `capabilities/` del repo no cambia

**MODIFIED — Una feature grande devuelve el diseño por secciones antes de la spec** (antes: sin la apertura en llano)

- GIVEN la feature 0012 en `delegate`, con 5 tasks previstas en el recuento del paso 2 y la entrevista cerrada
- WHEN el agente va a escribir `spec.md`
- THEN antes presenta el diseño por secciones, una por mensaje, y pregunta «¿va bien?» tras cada una
- AND lo que el usuario corrige en una sección entra en la spec antes de escribirla
- AND el recuento es el de la feature que se especifica, hecho al entrar en el paso de spec: un lite o un patch que suben a full cuentan ahí, y tras partir cuenta la pieza
- AND con 2 tasks previstas, en lite o en spike (también mientras el spike corra como full), escribe la spec sin secciones y la presenta en el gate
- AND con la spec aprobada por delegación o en `unattended` no presenta secciones: lo que habría preguntado va a «✋ Decisiones que he tomado yo»; si el usuario pide empezar ya, tampoco
- AND las secciones son turnos de la entrevista dentro de la parada de la spec, no una parada nueva del perfil: valen en `pair` y en `delegate`
- AND cada sección abre con lo que cambia para quien usa el producto, con un ejemplo con datos («`informes --sala Norte` enseña las cuatro vistas solo de Norte»), y la pregunta es sobre eso; un nombre de código (`active`, `rooms`, `src/app.js`) no abre ninguna sección y, si hace falta, va detrás

**ADDED — La spec mide el margen de palabras de lo que edita**

- GIVEN un proyecto con topes de palabras (`tests/WordBudget.Tests.ps1` con `'sdd-propose' = @{ SkillMd = 5000; Total = 6325 }`) y una spec que edita `sdd-propose`, medido en 4.908 y 6.324
- WHEN el agente escribe la spec
- THEN la sección «Topes de palabras» lleva una fila por skill o documento con tope que la spec edita, con lo medido, el tope, el margen y el tope propuesto: `sdd-propose · 4.908 / 5.000 y 6.324 / 6.325 · 92 y 1 · 5.200 / 6.700`
- AND el tope propuesto es lo medido más lo previsto más un 2 % (mínimo 20 palabras) para la pasada de fix, y el gate lo aprueba como decisión del dev-lead
- AND el de una skill que funde otras parte de la suma medida de las fuentes, menos lo común, más margen
- AND si durante la feature se recorta texto para caber, el recorte es una edición de skill: si quita una instrucción, lleva su RED
- AND sin topes en el proyecto, la sección no se escribe

**ADDED — La política de modelos de la spec vale como confirmación de paralelizar**

- GIVEN una feature en `delegate`, con la spec aprobada y la línea `Política de modelos: revisores de la spec ninguno · ejes de la revisión final Spec opus+high, Código sonnet+high · en paralelo hasta control.maxParallelAgents`, y unas instrucciones del usuario que piden confirmar antes de paralelizar
- WHEN el hilo va a despachar los ejes de la revisión final con `sdd-parallel-agents`
- THEN los despacha en la misma respuesta sin preguntar, porque la aprobación de la spec fue esa confirmación
- AND lo mismo con los dos revisores de una review de spec que la línea nombra
- AND un modelo o un despacho que la línea no nombra se confirma como piden las instrucciones
- AND en `delegate` la spec sin esa línea no pasa el repaso de coherencia

**ADDED — El self-review del plan asigna cada cláusula de un THEN a lo que la observa**

- GIVEN una spec con «THEN el agente ha preguntado el umbral · AND la sección lleva la respuesta», y una task cuyo test solo mide lo escrito
- WHEN el agente escribe §4 del plan
- THEN §4 lleva una línea por cláusula, cada una con su task y el test o la fila de medición que la observa: `THEN ha preguntado → Task 2, escenario n1 (turno 1)` y `AND la sección lleva la respuesta → Task 2, n1 (spec-new.md)`
- AND una cláusula que nada observa dice `sin observar: <motivo>`, y el plan lo avisa en sus decisiones antes de ejecutar
- AND si la spec trae la tabla «regla retirada → dónde vive ahora», §4 lleva una línea por fila con su task y el test que busca la regla en su destino

**ADDED — La verificación de una task acaba en una línea de resumen**

- GIVEN una task con superficie tooling en un proyecto con Vitest
- WHEN el agente escribe su «Verificación»
- THEN es un comando cuya última línea es el resumen (`Tests  12 passed (12)`), sin códigos de color (`NO_COLOR=1`, `--reporter=dot`, `-CI` en Pester), que sale con un código distinto de 0 si algo falla

**ADDED — La fila de «Aprobaciones» dice quién y cómo aprobó**

- GIVEN una spec calcada de `spec-template.md` y aprobada por Ana con la opción «Apruebo (Recomendada)» de `AskUserQuestion` el 2026-10-18
- WHEN el agente registra la aprobación
- THEN la tabla «Aprobaciones» tiene las columnas `Nombre | Fecha | Estado`, sin «Rol», y la fila dice `Ana | 2026-10-18 | aprobada (opción «Apruebo»)`
- AND si Ana escribe «sí, adelante», el Estado es `aprobada: «sí, adelante»`
- AND el frontmatter `approvers` lleva `name` y `approved_at`, sin `role`

**Reglas de la capacidad**
- **Límites**: detector en dos viewports (por defecto `1280x800` y `390x844`), sin tope de rondas; como máximo 3 rondas de arreglo de composición; la sesión se rehace una vez por ejecución; el diseño por secciones, desde 4 tasks previstas, con secciones de unas frases a ~250 palabras; el tope de palabras propuesto en una spec es lo medido más lo previsto más un 2 %, con un mínimo de 20 palabras.

### Capacidad: `capabilities`

**MODIFIED — El delta declara el comportamiento por capacidad** (antes: «un `MODIFIED` copia el bloque entero del requisito con los cambios…»)

- GIVEN una spec que cambia comportamiento observable
- WHEN se escribe su sección de delta
- THEN cada requisito va bajo una capacidad nombrada, marcado `ADDED`, `MODIFIED` o `REMOVED (motivo)`, con al menos un escenario `GIVEN / WHEN / THEN`
- AND un escenario de una regla de negocio lleva datos concretos de entrada y de salida («bolsa FR, IT, PT; oferta en DE → no cubre»), no una frase abstracta («una oferta fuera de la bolsa no cubre»)
- AND un THEN o un AND no cita las decisiones de la spec por número (`- THEN se rechaza, por la decisión 10`): la capacidad no tiene esas decisiones, y `sdd capability merge` lo rechaza
- AND un `MODIFIED` copia el bloque entero del requisito con los cambios; `(antes: …)` es opcional y señala la cláusula que cambia
- AND una línea del vivo que el `MODIFIED` quita va en el bloque como `- REMOVED <línea>` (`- REMOVED AND el aviso sale por correo`), y un requisito renombrado es un `REMOVED` del título viejo más un `ADDED` del nuevo, porque el título es la clave de fusión
- AND si la capacidad no existe en `capabilities/`, su creación aparece en "Decisiones a validar"
- AND si un requisito introduce datos, nombres, topes, avisos o una condición de conflicto nuevos, la capacidad lleva su subsección «Reglas de la capacidad» con solo las entradas que cambian (dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto), cada una con su valor completo: con **Avisos**: A y B vigentes y una feature que añade C, la entrada dice A, B y C, porque el cierre de `sdd-archive` sustituye o añade cada entrada entera por su nombre
- AND la lente dominio reclama las entradas que falten y marca como Crítico una regla que contradiga la constitution

### Capacidad: `routing`

**ADDED — Un patch es lo que un solo test reproduce**

- GIVEN el molde `reservas`
- WHEN el usuario escribe «patch, la solución está decidida: un comando `reservas <sala>` que lista las reservas activas de la sala, una por línea, con el formato `lun 10:00-12:00`; sin reservas responde `sin reservas <sala>`; y `libres` sin franja responde `indica una franja`»
- THEN `sdd-propose` no lo abre como patch: son tres comportamientos nuevos y ningún test de hoy los reproduce; pregunta con lite recomendado, citando sus condiciones, y feature como alternativa
- AND con «si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes» sigue siendo patch, y la pregunta del carril nombra el test que hoy sale en rojo (`cancelar Norte mar no toca la reserva de lun`)
- AND un ajuste o una retirada de presentación nombra la captura del estado actual en lugar del test

## Previsión de la prueba (Art. I)

Sonnet como sujeto, salvo `mp1` (Opus: el fallo de campo de la 0187 vino de Opus). RED con el kit de `HEAD` antes de la feature, GREEN con la rama.

| Paso nuevo o cambiado | Escenario | Sujetos | Motivo si no se mide |
| --- | --- | --- | --- |
| Paso 2 e «Is it really a patch?»: patch = un test | `pl1` (RED hecho, 0/2) · `a3` control | 2 + 2 + 1 | — |
| «Design by sections» en llano | `pb` (RED hecho, 0/2) · `pb-c` control | 2 + 2 + 1 | — |
| Plantilla de spec: topes, lo que se retira, política, «Aprobaciones», prueba del delta en el paso 4 | `sp1` | 2 | RED estructural, leído con fichero y línea |
| Plantilla de plan: §4 por cláusula, regla retirada, «Verificación»; `plan-writing.md` | `pl2` | 2 | RED estructural |
| `sdd-parallel-agents`: aprobar cuenta como confirmación | `mp1` (batería de `sdd-verify`) | 2 | RED estructural y cinco casos de campo |
| Ayuda del `MODIFIED` | — | 0 | Texto de ayuda; lo cubre `sp1`, que renombra un requisito, y Pester |
| Tramo de control de `sdd-propose` | `a1`, `a2`, `a4`, `l1`, `p2`, `s1`, `t1` | 7 | — |

Total: 4 sujetos de RED (1,29 $, hechos) + ~23 de GREEN y control + ~6 de una tanda de REFACTOR: ~33 sujetos, ~3 h y ~25 $. Techo: 40 sujetos o 30 $; si se supera, para y decides tú.

**Topes de palabras** (medido el 2026-10-18, palabras / tope):

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-propose` | 4.908 / 5.000 · 6.324 / 6.325 | 92 · 1 | 5.200 / 6.700 |
| `sdd-parallel-agents` | 1.083 / 1.100 | 17 | 1.150 / 1.150 |
| `sdd-templates` | 14.580 / 11.990 | suspendido | sin cambio (suspendido) |
| `tech-stack.md` (lo escribe el cierre) | 18.797 / 18.800 | 3 | sin cambio: lo aprendido sustituye o condensa |

## Enmiendas

- 2026-10-18 — La regla «la política de modelos aprobada es la confirmación de paralelizar» va también en «The axes» de `sdd-verify`, que sale de «No entra»; tope de `sdd-verify` a `SkillMd = 2990; Total = 9020` (hoy 2.885 / 2.900 y 8.799 / 8.800) — GREEN `mp1` 0/2: los dos sujetos deciden parar en «The axes» y no llegan a cargar `sdd-parallel-agents` — aprobada (opción «Apruebo la enmienda»)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-18 | aprobada (opción «Apruebo») |
