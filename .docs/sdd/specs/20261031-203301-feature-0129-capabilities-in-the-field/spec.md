---
id: 20261031-203301-feature-0129-capabilities-in-the-field
feature: 0129
parent: 0124
title: Capacidades en campo
mode: full
profile: delegate
status: approved
created: 2026-10-31
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-31
---

# Spec — Capacidades en campo

🦆 Un proyecto con un documento viejo en `capabilities/` podrá decir «esto no es una capacidad» con una línea, y ni el validador, ni el índice, ni la migración lo tocarán. Un requisito de 501 caracteres dará un aviso y seguirá en verde. Si quitas el último requisito de `bookings`, la fusión para sin tocar nada, salvo que el cambio declare `- Retiradas: \`bookings\` — <motivo>`: entonces borra el fichero. La línea en blanco tras el título no da problema hoy, así que solo queda un test que lo vigila.

Validación: agente — `validation.mode: field`: tests, RED/GREEN y uso real en los proyectos vía `sdd-feedback`.

## Capacidades

- Modificadas: `capabilities` — el índice omite lo marcado, aviso de 500 caracteres, `Retiradas`, control de la línea en blanco
- Modificadas: `migration` — la migración respeta y propone la marca

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: contrato público (línea «Retiradas» del bloque y `warnings` en el JSON), MODIFIED (tres requisitos de capabilities), migración (texto de v2.0.0 y v3.0.0) · tamaño: ~150 líneas en 10 ficheros
- Mínimo razonable: ninguna — deja sin segunda lectura la forma de «Retiradas», que cubre la pasada de coherencia y la revisión final
```

1. **Qué mide el aviso de 500: el bloque entero del requisito** (todas sus líneas sin título, unidas con un espacio). Los requisitos del kit no tienen descripción: `looseLineProblems` prohíbe la prosa suelta, así que medir «la descripción» de OpenSpec no avisaría nunca. **Consecuencia que debes ver: hoy avisan 291 de los 503 requisitos de este repo (58 %)**, 91 pasan de 1.000 y el máximo es 4.423. La alternativa, avisar por línea (14 requisitos), no habría visto el caso de la 0150: su AND tenía 377 caracteres. Recomiendo el bloque y tu cifra de 500, porque es lo que pediste y lo que caza el fallo, pero es ruidoso: si prefieres menos avisos, la palanca es subir el umbral (1.000 da 91).
2. **Con `--artifact`, solo avisan los requisitos de las capacidades del delta**: un cierre no recibe los 291. Sin `--artifact`, avisan todos.
3. **El marcador de retirada es una línea del bloque «Capacidades»**, `- Retiradas: \`<nombre>\` — <motivo>`, al lado de «Nuevas» y «Modificadas»; OpenSpec usa `retire_capabilities: true` en su propio metadato. Vale en spec y en patch.
4. **Literales nuevos**: el aviso, `Aviso: bookings.md: «Reservar una franja» tiene 501 caracteres; el máximo aconsejado es 500: si ya existe, no lo partas ni lo recortes; si es nuevo, un comportamiento por requisito`; y los de la fusión y el validador, en los THEN del delta.
5. **La línea en blanco no lleva cambio ni normalización**: `check.ts` no la exige y 503 de 503 requisitos la tienen, porque `saveDocument` la escribe (la cifra «261 sin la línea» del 2026-10-01 ya no vale). Es frente limpio: un test de control, y el ticket 0030 §3 no pide nada más. Propongo no exigirla.
6. **El índice omite lo marcado en silencio**, sin nombrarlo: el índice sirve para elegir qué leer. Lo nombra ya `check`. Un puntero sin marca se sigue listando, como dice su requisito.
7. **Migración, cambio en `v2.0.0.md` paso 7 y `v3.0.0.md` «Verificación», sin paso nuevo**: el paso 7 salta un fichero marcado (ahí nació el ticket 6298 §6), y la verificación de la 3.0.0 propone la marca en el informe para un fichero sin `## Requisitos` ni escenarios, sin escribirla: que un documento no es una capacidad lo decide el dev-lead. Normalización, ninguna (decisión 5).
8. **El aviso no sale para un puntero**, porque el requisito vive en su destino, ni para un documento marcado.
9. **Una fusión contra un fichero marcado no se bloquea**: `check` ya la rechaza después con «marcado y con escenarios». No entra para no crecer.
10. **Filas «Actuar → 0129»**, revisadas. **Entra**: «Un documento funcional heredado…» (se salda; los punteros ya los resolvió `check.ts`). **Se salda sin código**: «Las reglas del delta llevan marca… o texto completo», porque la opción del texto completo ya es la regla y `setRule` la aplica. **No entran, pasan a «Esperar 2.º ticket»**, con un solo caso y sin coste medido: «El delta no sabe expresar un renombrado» (toca plantilla y cierres: es su propia feature), «La guía del índice no dice qué hacer con `(sin propósito)`», «El validador no rechaza un párrafo libre» (daría un rojo nuevo en proyectos). **Ocho menores de la 0070**: (2) ya está resuelto por `reportMissingArtifact`, (3) cayó con los tests de PowerShell, (5) y (8) eran del corte de la 2.0.0; (1), (4), (6) y (7) sin comprobar aún: la Task 3 los comprueba, y lo vivo pasa a «Esperar 2.º ticket».
11. **Saldo de palabras**: lo que entra en cada plantilla sale de esa misma plantilla, sobre todo de las reglas 2 y 4 de `capability-template.md` y de la ayuda de «Capacidades» de `spec-template.md`; también en las dos migraciones.
- Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos en sonnet, por tandas · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

Resultado de probar el delta en una copia: sdd capability merge: 9 cambios, salida 0; sdd capability check --artifact: Capacidades válidas: 20, salida 0.

### Decisiones tomadas con el dev-lead

- El aviso es aviso, no error — «es aviso, no error, porque hay requisitos largos ya aprobados que no se pueden recortar»
- `REMOVED` sin marcador para antes de escribir — «para antes de escribir nada, como OpenSpec»
- Un frente limpio queda como control, con Vitest y sin sujetos; sujeto solo para la migración y la plantilla — «Un frente limpio sale de lo que se arregla y sigue como control en el GREEN»

## Intent

Las capacidades fallan en proyectos reales de cuatro formas: un documento heredado o un puntero deja el validador en rojo o ensucia el índice y la migración, sin forma documentada de decir que no es una capacidad (la marca existe desde el patch 0137, pero ninguna skill la nombra); se temía que el validador exigiera una línea en blanco; un requisito largo esconde un AND que el repaso no ve (0150 §2); y un `REMOVED` deja un fichero sin requisitos sin avisar. El éxito: un `capabilities/` con un documento marcado pasa `check` e `index`; un requisito de 501 caracteres da aviso y código 0; un `REMOVED` que vaciaría una capacidad sin marcador para sin cambiar ningún fichero, y con él la borra. Fracasaría si el aviso empujara a recortar requisitos aprobados.

## Scope

- Entra: `cli/src/capabilities/` (`index.ts`, `check.ts`, `merge.ts`, `sections.ts`, `verbs.ts`) y sus tests; `capability-template.md`, `spec-template.md`, `patch-template.md`; `migrations/v2.0.0.md` paso 7 y `migrations/v3.0.0.md` «Verificación»; las filas de deuda de la decisión 10.
- No entra: normalizar a mano las capacidades de este repo (0198); la coherencia general de documentos (0152); las filas que la decisión 10 deja fuera; recortar requisitos que hoy avisan.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `sdd capability merge` deja un fichero sin requisitos | `merge.ts` (`removeRequirement`); `capabilities.md`, «La fusión del delta es un script» no lo cubre | delta, `ADDED` |
| Una capacidad del bloque sin fichero siempre falla | `check.ts` (`blockAgainstDeltaProblems`); `capabilities.md`, «El validador» | delta, `MODIFIED` |
| `Test-Capabilities.ps1`, `Get-CapabilityIndex.ps1`, `Merge-CapabilityDelta.ps1` en la fila | `roadmap.md`, fila 0129 y deuda | histórico: la fila sale al cerrar |
| Paso 7 selecciona todo fichero sin `## Propósito` | `migrations/v2.0.0.md:44` | Scope, delta de `migration` |

- Filas que implementa: 0129 → `roadmap.md` (su fila, y «tras 0129» de la 0198, que se cumple); deuda de la decisión 10 → `roadmap.md`; comprobado con `git grep 0129 -- .docs/sdd/capabilities skills`: sin resultados: nada que cambiar ahí.

## Approach

Tres tasks: marca (índice, migración, plantilla, control de la línea en blanco), aviso (`check`, plantilla) y retirada (`merge`, `check`, plantillas, filas de deuda). La medida del aviso se hace en `check.ts` y la marca se reutiliza con `isNotCapability`, movida a `sections.ts` para que la lea `index.ts`.

## Dónde se prueba

- Marca en el índice, aviso, retirada y control de la línea en blanco: Vitest por CLI, como `cli/test/capability/`, con RED antes salvo el control, que ya pasa.
- Paso 7 y «Verificación»: un sujeto sobre un molde con un documento heredado.
- Requisito de un solo comportamiento y `MODIFIED` sin recortar: un sujeto que escribe un requisito con la plantilla.
- Saldo de palabras: conteo antes y después de cada fichero editado, con la función de `word-budget.test.ts`.

## Términos y ADR

- Términos resueltos: retirar una capacidad — borrar su fichero porque el delta la deja sin requisitos
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `capabilities`

#### ADDED — El validador no exige la línea en blanco tras el título de un requisito

- GIVEN `bookings.md` con `### Reservar una franja` seguido directamente de `- GIVEN`
- WHEN se ejecuta `sdd capability check --path .docs/sdd`
- THEN escribe `Capacidades válidas: 1` y sale con 0

#### ADDED — Un requisito de más de 500 caracteres da un aviso

- GIVEN `bookings.md` con «Reservar una franja», cuyas líneas, sin el título y unidas con un espacio, suman 501 caracteres, y «Cancelar una reserva», con 500
- WHEN se ejecuta `sdd capability check --path .docs/sdd`
- THEN escribe `Capacidades válidas: 1`, después `Aviso: bookings.md: «Reservar una franja» tiene 501 caracteres; el máximo aconsejado es 500: si ya existe, no lo partas ni lo recortes; si es nuevo, un comportamiento por requisito`, ningún aviso de «Cancelar una reserva», y sale con 0
- AND con un fallo además, escribe el fallo, después el aviso, y sale con 1
- AND con `--artifact` de una spec cuyo delta solo toca `rooms`, no avisa de `bookings.md`
- AND un documento marcado «No es una capacidad.» y un puntero no avisan
- AND `capability-template.md` pide un comportamiento por requisito, con los ejemplos y los bordes en escenarios, y dice que bajo `MODIFIED` el bloque existente no se parte ni se recorta para cumplir

#### ADDED — Un `REMOVED` que vacía una capacidad exige declararla en «Retiradas»

- GIVEN `bookings.md` con un solo requisito, «Reservar una franja», y una spec con `#### REMOVED — Reservar una franja` en `bookings`, sin `- Retiradas:`
- WHEN se ejecuta `sdd capability merge --path .docs/sdd --artifact <spec.md>`
- THEN escribe `spec.md: «bookings» se quedaría sin requisitos: declárala en una línea «- Retiradas:» del bloque «Capacidades» para borrar el fichero, o deja algún requisito`, sale con 1 y no cambia ningún fichero de `capabilities/`, tampoco los de otras capacidades del delta
- AND con `- Retiradas: \`bookings\` — las reservas pasan a otro sistema` en el bloque, borra `bookings.md`, escribe `bookings.md: quitado «Reservar una franja»` y `bookings.md: borrado, está en «Retiradas»`, y sale con 0
- AND justo después, `sdd capability check --path .docs/sdd --artifact <spec.md>` no falla por `bookings`
- AND con esa línea y `bookings.md` con otro requisito que el delta no quita, escribe `spec.md: «bookings» está en «Retiradas» y le quedan requisitos: «Cancelar una reserva»`, sale con 1 y no escribe
- AND ejecutada otra vez con `bookings.md` ya borrado, escribe `bookings.md: ya estaba borrado` y sale con 0
- AND un `REMOVED` cuyo título ya no está, en una capacidad que ya no tenía requisitos, no la vacía esta fusión: escribe `ya no estaba` y no para
- AND la línea `- Retiradas:` lleva el nombre y el motivo, vale en una spec y en un `patch.md`, y su capacidad lleva su subsección en el delta como las demás

#### MODIFIED — El validador de capacidades

- GIVEN `.docs/sdd/capabilities/bookings.md` cuyo requisito `### Consultar salas libres` tiene GIVEN y WHEN pero no `- THEN`
- WHEN se ejecuta `sdd capability check --path .docs/sdd`
- THEN sale con código 1 y escribe `bookings.md: «Consultar salas libres» no tiene escenario completo (falta - THEN)`
- AND también falla, nombrando fichero y, si aplica, requisito, ante: un título que no es `# Capacidad — <nombre del fichero sin .md>`; una sección `##` distinta de `## Propósito`, `## Requisitos` y `## Reglas de la capacidad` (una `## Historial` incluida); una marca de delta en la capacidad, en negrita (`**ADDED —`, `**MODIFIED —`, `**REMOVED —`) o en encabezado (`#### ADDED —`, `#### MODIFIED —`, `#### REMOVED —`); un bloque `**Reglas de la capacidad**` en negrita o `#### Reglas de la capacidad`, que son la forma del delta; una sección de reglas a la que falte alguna de sus cinco entradas por nombre
- AND ante `#### MODIFIED — Consultar salas libres` en la línea 14 de la capacidad escribe `bookings.md: resto de delta «#### MODIFIED —» en la línea 14`, igual con `#### ADDED —` y `#### REMOVED —`, y ante `#### Reglas de la capacidad — bookings`, `bookings.md: resto de delta «#### Reglas de la capacidad» en la línea 14: sus entradas van en «## Reglas de la capacidad»`
- AND ante una línea suelta bajo un requisito —ni `- …`, ni `>`, ni sangrada, ni en blanco—, como la segunda línea de un «(antes: …)» partido, escribe `bookings.md: línea suelta en «Reservar una franja» (línea 14): «guardada»)»`
- AND ante una línea `- Se valida en:` en la capacidad escribe `bookings.md: resto de delta «Se valida en:» en la línea 15`
- AND ante `## Historial` el mensaje es `bookings.md: sección «Historial», resto del kit 1.x: lo quita la migración a 2.0.0`
- AND sin `## Propósito` escribe `bookings.md: falta la sección «Propósito»`; con la sección vacía, o solo con la ayuda `>` y el hueco `<…>` de la plantilla, `bookings.md: «Propósito» está vacío: escribe en una o dos frases qué cubre la capacidad`; con un propósito de 412 caracteres, medidos sobre el propósito en una sola línea como lo escribe el índice, `bookings.md: «Propósito» tiene 412 caracteres; el máximo es 300 (una o dos frases)`; y con `## Propósito` detrás de otra sección, `bookings.md: «Propósito» debe ser la primera sección`
- AND con `--artifact <spec.md|patch.md>`, que se ejecuta después de fusionar el delta, falla si falta el bloque `## Capacidades`, si sus nombres no coinciden con las subsecciones `### Capacidad:` del delta, si no nombra ninguna capacidad ni dice «Ninguna, porque…» (`<a>: el bloque «Capacidades» está vacío: declara las capacidades o «Ninguna, porque <motivo>»`), si dice «Ninguna» y hay delta, si una capacidad de «Nuevas» o «Modificadas» no tiene fichero en `capabilities/`, si una de `- Retiradas:` sigue en `capabilities/` (`spec.md: «bookings» está en «Retiradas» y sigue en capabilities/`), o si un `patch.md` declara `- Nuevas:`
- AND con `--artifact`, un `**ADDED — Cancelar una reserva**` del delta de `bookings` sin fusionar falla con `spec.md: «Cancelar una reserva» del delta no está en capabilities/bookings.md`, y un `**MODIFIED — Reservar una franja**` cuyas líneas `- GIVEN`, `- WHEN`, `- THEN` y `- AND` no son, en orden, las de ese requisito en la capacidad, con `spec.md: «Reservar una franja» del delta no coincide con capabilities/bookings.md`; el título cuenta entero aunque el encabezado en negrita, con su `(antes: «…»)`, ocupe varias líneas
- AND con `--artifact`, `#### ADDED — Cancelar una reserva` sin fusionar y `#### MODIFIED — Reservar una franja` con otras líneas de escenario fallan con los mismos dos mensajes
- AND con `--artifact` de una spec cuyo delta solo toca `bookings`, ya fusionado, y `rooms.md` sin `## Requisitos`, escribe `Capacidades válidas: 1`, después `Ajenos al artefacto, no cambian el código de salida: 1` y `  rooms.md: falta la sección «Requisitos»`, y sale con 0
- AND con `--artifact` y un fallo en `bookings.md` o en el propio artefacto, escribe sus líneas, después el bloque de ajenos, y sale con 1; un artefacto con «Ninguna, porque…» no toca ninguna capacidad, y todos los fallos de `capabilities/` salen como ajenos
- AND con `--artifact --json` escribe `{ "validCount": <n>, "errors": [<fallos propios>], "foreign": [<ajenos>], "warnings": [<avisos>] }`; sin `--artifact`, el JSON no lleva `foreign` y todos los fallos cuentan
- AND sin fallos escribe `Capacidades válidas: <n>` y sale con 0; sin carpeta `capabilities/`, o con la carpeta vacía, y sin `--artifact`, escribe `Sin capacidades que validar` y sale con 0

#### MODIFIED — La fusión del delta falla sin escribir nada

- GIVEN la spec del requisito anterior con un `**MODIFIED — Anular una reserva**` más, que no está en `bookings.md`
- WHEN se ejecuta `sdd capability merge`
- THEN escribe `spec.md: «Anular una reserva» del MODIFIED no está en capabilities/bookings.md`, sale con 1 y no cambia ningún fichero de `capabilities/`, tampoco por el ADDED y el REMOVED que sí podía aplicar
- AND con un `- THEN se rechaza, por la decisión 10` en «Cancelar una reserva», escribe `spec.md: «Cancelar una reserva» cita la spec («decisión 10»): reescríbelo en el delta sin la referencia y vuelve a ejecutar`, sale con 1 y no escribe
- AND la misma frase entre comillas invertidas (`` `por la decisión 10` ``), como ejemplo, no cuenta como cita
- AND un `ADDED` que ya está en la capacidad con las mismas líneas no se duplica ni falla; con otras líneas falla con `spec.md: «Cancelar una reserva» del ADDED ya está en capabilities/bookings.md con otro texto: usa MODIFIED`
- AND un `REMOVED` cuyo título ya no está escribe `bookings.md: «Consultar salas libres» ya no estaba` y no falla
- AND una capacidad del delta sin fichero se crea solo si el bloque «Capacidades» de una spec la declara con `- Nuevas: \`rooms\` — Salas, su aforo y su mantenimiento`: `# Capacidad — rooms`, `## Propósito` con «Salas, su aforo y su mantenimiento», y sus requisitos; sin esa línea, salvo una capacidad en `- Retiradas:` cuyo delta solo trae `REMOVED`, o desde un `patch.md`, falla con `spec.md: «rooms» no tiene fichero en capabilities/ y el bloque no la declara en «Nuevas»`
- AND un `MODIFIED` con menos líneas `- THEN` y `- AND` que el requisito vivo falla con `spec.md: «Reservar una franja» del MODIFIED perdería «- AND <texto>» de capabilities/bookings.md: cópiala en el delta o retírala con «- REMOVED AND <texto>»`, una línea por cada una del vivo que no copió, y no escribe; con la retirada `- REMOVED AND <texto literal>` en el bloque, la quita y no la copia a la capacidad, y una retirada que no casa con ninguna línea del vivo no cuenta

#### MODIFIED — Un documento marcado «No es una capacidad.» no se valida

- GIVEN `capabilities/funcional.md`, un documento funcional heredado o un puntero, cuya primera línea no vacía tras el título empieza por `> **No es una capacidad.**`
- WHEN se ejecuta `sdd capability check --path .docs/sdd`
- THEN no informa errores de ese fichero, sí de las capacidades reales, y la línea de éxito lo cuenta fuera y lo nombra: `Capacidades válidas: 1 · omitidas por «No es una capacidad.»: funcional.md`
- AND si el fichero marcado tiene líneas de escenario, falla con `funcional.md: marcado «No es una capacidad.» y con escenarios: quita la marca o los escenarios`
- AND `sdd capability index` no lo lista: con `funcional.md` marcado y `bookings.md`, escribe solo la línea de `bookings`, y con solo `funcional.md`, `Sin capacidades`

#### Reglas de la capacidad — capabilities

- **Límites**: el propósito de una capacidad, una o dos frases de 300 caracteres como máximo; un requisito, 500 caracteres aconsejados: por encima, aviso.
- **Avisos**: `sdd capability check` escribe una línea por fallo, `<fichero>: <qué falla>`, en castellano, y sale con 1; sin fallos, `Capacidades válidas: <n>`, seguida de `· omitidas por «No es una capacidad.»: <ficheros>` si omitió alguno. Con `--artifact`, el código de salida y la cabecera solo los deciden los fallos del artefacto y de las capacidades de su delta, y los demás salen después bajo `Ajenos al artefacto, no cambian el código de salida: <n>`, sangrados con dos espacios. Un fallo del destino de un puntero sale como `<puntero> → <ruta del enlace>: <qué falla>`. `sdd capability merge` escribe una línea por cambio, `<fichero>: añadido|sustituido|quitado «<requisito>»` o `<fichero>: regla «<nombre>» sustituida|añadida`, y sale con 0; con fallos, una línea por fallo, sale con 1 y no escribe ningún fichero; `<fichero>: borrado, está en «Retiradas»` al borrar una capacidad. `sdd capability check` añade `Aviso: <fichero>: «<requisito>» tiene <n> caracteres; …` por cada requisito de más de 500, sin cambiar el código de salida. `sdd capability index` marca con `(sin propósito)` la capacidad que no lo tiene, y sale con 0.

### Capacidad: `migration`

#### ADDED — La migración respeta un documento marcado y propone la marca

- GIVEN `capabilities/funcional.md`, sin `## Propósito`, cuya primera línea tras el título es `> **No es una capacidad.** Documento funcional anterior al troceo.`
- WHEN se aplica el paso 7 de `v2.0.0.md`
- THEN `funcional.md` no cambia y el informe no lo lista entre las capacidades a las que se ha escrito el propósito
- AND con `capabilities/legacy.md` sin marca, sin `## Requisitos` y sin escenarios, la verificación de `v3.0.0.md` lista su fallo como pendiente del dev-lead y propone la línea `> **No es una capacidad.**` tras el título, sin escribirla ni frenar el marcador

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-templates` (total, sin migraciones) | 16467 / 19650 (15720 × 1,25) | 3183 | sin cambio: el saldo queda igual o baja |

## Previsión de coste

Por sujeto, 0,5 $ (`tech-stack.md`, §Lanzamiento: 0,3–2,5 $; estos son de un solo documento, en sonnet).

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 2: migración con heredado; plantilla | 1 |
| GREEN | 2: los mismos | 1 |
| Una tanda de REFACTOR | 2 | 1 |
| Controles | 0: los frentes limpios son Vitest | 0 |
| Medición tras la revisión final | 0, salvo que la revisión toque esos textos | 0 |
| Suma | 6 | 3 |

Pasos que el agente sigue y su prueba: paso 7 de `v2.0.0.md` y «Verificación» de `v3.0.0.md`, sujeto de migración; ayuda de requisito en `capability-template.md`, sujeto de plantilla; línea «Retiradas» de `spec-template.md` y `patch-template.md`, sin sujeto: la dicta el mensaje de `sdd capability merge`, que cubre Vitest.

## Enmiendas

- 2026-10-31 — Scope: entra `migrations/v1.0.0.md` paso 1, cuya nota de `legacy.md` no es la marca y va antes del título — es de donde nacen los documentos heredados; Task 1 — sin aprobar (aplica literal «respeten la migración», del dev-lead)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-31 | aprobada (opción «Apruebo») |
