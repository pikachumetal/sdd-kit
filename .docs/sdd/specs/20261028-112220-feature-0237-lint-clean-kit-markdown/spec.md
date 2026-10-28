---
id: 20261028-112220-feature-0237-lint-clean-kit-markdown
feature: 0237
proposal: 0234
title: El markdown del kit pasa markdownlint
mode: full
profile: delegate
status: approved
created: 2026-10-28
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-28
---

# Spec — El markdown del kit pasa markdownlint

🦆 Hoy una spec calcada de la plantilla escribe cada requisito del delta como `**ADDED — Cancelar una reserva**`, y markdownlint lo marca como «énfasis usado como encabezado»: en OdySIF son 167 fallos. Con esta feature, la plantilla lo escribe como encabezado, `#### ADDED — Cancelar una reserva`, con una línea en blanco debajo, y `sdd capability merge` y `check` leen las dos formas, así que las specs ya cerradas no se tocan. Además, la fusión de un delta deja una línea en blanco antes y después de cada tabla, la traiga o no el delta, para que una capacidad fusionada no falle por una tabla pegada a la línea de arriba (si el fallo no se reproduce, el walkthrough lo dice y ese código no cambia).

## Capacidades

- Modificadas: `capabilities` — cambia «El delta declara el comportamiento por capacidad» y «El validador de capacidades»; añade «La fusión lee las dos formas de marca del delta» y «La fusión deja una línea en blanco alrededor de cada tabla»

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: contrato público (la forma del delta la leen la CLI y los proyectos), MODIFIED (dos requisitos de `capabilities`) · tamaño: ~120 líneas en 7 ficheros
- Técnica: si el parser de encabezados separa el título de su «(antes: …)» y si el validador rechaza las dos formas en una capacidad (señal: contrato público)
- Mínimo razonable: ninguna — lo cubren los tests en rojo de cada requisito y la revisión final
```

Review hecha a petición del dev-lead («has hehco dom opus / tec sonnet», 2026-10-28): dos revisores, dominio en Opus y técnica en Sonnet, effort medium.

1. Alcance de «pasa markdownlint con sus reglas por defecto»: un delta calcado de las plantillas y la capacidad fusionada pasan todas las reglas por defecto salvo MD013 (líneas de más de 80 caracteres) y MD033 (HTML en línea, que da cada hueco `<…>` sin rellenar). Por defecto MD013 rechaza cualquier párrafo de una spec y ningún proyecto puede cumplirlo; los huecos se rellenan al calcar. Te rebato la letra de la propuesta aquí: tal cual, no se puede cumplir. Medido con `markdownlint-cli2` 0.18.1 (markdownlint 0.38.0) sobre una muestra con la forma nueva: solo dan MD024 (dos `#### Reglas de la capacidad` en una spec con dos capacidades) y MD058 (tabla pegada); MD001 no sale porque la marca cuelga de `### Capacidad:` también en `patch-template.md`, y MD026 solo saldría con un título que acabe en `.`, `,`, `;`, `:` o `!`, que ningún requisito del kit usa.
2. `**Reglas de la capacidad**` del delta pasa a `#### Reglas de la capacidad — <nombre de la capacidad>`: suelto en su línea es el mismo MD036, y sin el nombre dos capacidades dan MD024. El parser acepta las dos formas, como las marcas.
3. Bajo cada encabezado `#### …` del delta, una línea en blanco antes del primer `- GIVEN` (MD022 y MD032); sin ella, la fusión lee el delta igual.
4. En el encabezado, el `(antes: …)` sigue al título en la misma línea: `#### MODIFIED — Reservar una franja (antes: «la reserva queda guardada»)`; el título es lo que va entre la raya y ` (antes:`, sin los `#` de cierre ni los espacios finales de un encabezado cerrado (`#### ADDED — Cancelar una reserva ##`). Un `(antes: …)` partido en dos líneas se une como en la forma en negrita.
5. Mensajes nuevos del validador ante un resto de delta en encabezado: `bookings.md: resto de delta «#### MODIFIED —» en la línea 14` (igual con `ADDED` y `REMOVED`) y `bookings.md: resto de delta «#### Reglas de la capacidad» en la línea 14: sus entradas van en «## Reglas de la capacidad»`, en paralelo a los de la negrita, que no cambian.
6. El mensaje de `merge` ante un título ilegible cita la marca tal como está escrita y propone la forma nueva: `spec.md: no leo el título de «#### ADDED - Cancelar una reserva»: escríbelo como «#### ADDED — <título>», con raya`, y con la negrita, `spec.md: no leo el título de «**ADDED - Cancelar una reserva**»: escríbelo como «#### ADDED — <título>», con raya`.
7. Los tests van en `cli/test/capability/`, la carpeta que existe (el prompt decía `capabilities/`).
8. Previsión de coste del Art. I: 0 sujetos, 0 $. Editar `spec-template.md` y `patch-template.md` es editar `sdd-templates`, pero el cambio es la forma de un literal que lee la CLI, no una instrucción al agente: lo prueba Vitest leyendo la plantilla (`merge.test.ts` ya fusiona un delta calcado de `spec-template.md`), sin batería ni humo.
9. Una pieza entra, otra sale: sale la forma en negrita de las dos plantillas; no entra texto nuevo en ninguna `SKILL.md`. El tope de palabras de `sdd-templates` no cambia (ver «Topes de palabras»).
10. Prueba del delta en una copia de `.docs/sdd`, con las marcas pasadas a negrita porque la CLI de hoy aún no lee `####`: `sdd capability merge` → 2 sustituidos y 2 añadidos en `capabilities.md`; `sdd capability check --artifact` → `Capacidades válidas: 20`. El repaso de coherencia corrigió un `<nombre>` entre comillas invertidas anidadas que la fusión tomaba por hueco de la plantilla.
11. Sin migración, y la compatibilidad va en un solo sentido: la CLI nueva lee las specs y `patch.md` viejos, y una spec con `####` necesita la CLI de esta release, que viaja en el mismo plugin que la plantilla que la escribe. Lo que la 3.0.0 escriba en su `migrations/` sobre esto es de la release.
12. Esta spec ya usa `####`: el soporte de la CLI va en la primera task, antes de cualquier `sdd capability check --artifact` o `merge` sobre ella.
- Política de modelos: revisores de la spec, dominio opus y técnica sonnet, effort medium (hechos) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin sujetos · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — (téc. 1, dom. 3) la decisión 1 afirmaba sin medir que la forma solo da cuatro reglas, y la nueva da MD024 → medido con markdownlint 0.38.0; el encabezado de reglas lleva el nombre de la capacidad (decisión 2) y la pasada manual corre todas las reglas salvo MD013 y MD033.
- **Aceptado** — (téc. 2) el escenario de la tabla solo probaba un delta que ya traía las líneas en blanco → el requisito pasa a «deja», con un caso de tabla pegada arriba y abajo.
- **Aceptado** — (téc. 3, dom. 8) el AND de las tablas en «La fusión del delta es un script» duplicaba el ADDED → ese `MODIFIED` sale del delta; la regla vive solo en el ADDED, que es cierto se reproduzca o no el rojo.
- **Aceptado** — (téc. 4, dom. 5) «el título cuenta entero aunque el encabezado ocupe varias líneas» no vale para un `####` → la cláusula se ciñe a la negrita y un AND nuevo dice que un `(antes: …)` partido en encabezado se une igual.
- **Aceptado** — (téc. 5, dom. 4) el inventario solo buscaba `0237` → fila nueva con `git grep -nE '\*\*(ADDED|MODIFIED|REMOVED) —|\*\*Reglas de la capacidad'` sobre `cli/src skills .docs/workflow cli/test/kit`: fuera de las plantillas, `check.ts` y `migrations/v2.0.0.md`, nadie la nombra.
- **Aceptado** — (téc. 6) el mensaje del título ilegible en negrita no estaba fijado → decisión 6 y un AND.
- **Aceptado** — (téc. 7, dom. 6) faltaban `#### ADDED/REMOVED` en una capacidad y el «no coincide» con `####` → el mensaje cubre las tres marcas y un AND añade el «no coincide».
- **Aceptado** — (dom. 7) no se decía qué pasa sin línea en blanco bajo el `####` → decisión 3 y un AND: se fusiona igual.
- **Aceptado** — (dom. 2) el Intent prometía la spec entera y el Scope solo toca el delta → el Intent se ciñe al delta calcado y a la capacidad fusionada.
- **Aceptado** — (dom. 9) esta spec usa `####` antes de que la CLI lo lea → decisión 12.
- **Aceptado** — (dom. 10) encabezado cerrado y espacios finales → decisión 4 y un AND.
- **Aceptado** — (téc. 10) la compatibilidad es de un solo sentido → decisión 11.
- **Rechazado** — (dom. 1) declarar «Avisos» en «Reglas de la capacidad» → la entrada vigente fija la forma `<fichero>: <qué falla>` y «una línea por fallo» sin enumerar cada mensaje; los mensajes nuevos caben en ella y no la cambian.
- **Rechazado** — (téc. 8) probar una tabla sin sangría en un requisito → el validador ya la rechaza como línea suelta; dentro de un requisito la tabla va sangrada bajo su `- THEN`, y el caso medido con markdownlint es ese.
- **Rechazado** — (téc. 9) fijar qué hacen los `####` que no son marca y las marcas en bloques de código → no cambia: hoy un `#### Notas` en el delta ya es una línea del cuerpo de la entrada, y solo una línea que empieza por la marca abre entrada, en las dos formas.

### Decisiones tomadas con el dev-lead

- Las marcas pasan de `**ADDED — <título>**` a `#### ADDED — <título>`, debajo de `### Capacidad: <nombre>`; igual MODIFIED y REMOVED — prompt de arranque, 2026-10-28
- El parser acepta las dos formas, para no migrar las specs cerradas — prompt de arranque, 2026-10-28
- Lo de las líneas en blanco se reproduce primero con un test en rojo; si no se reproduce en la 3.0.0, el walkthrough lo dice y no se cambia el código — prompt de arranque, 2026-10-28
- Perfil `delegate`; al fusionar, `sdd merge --push` — prompt de arranque, 2026-10-28
- Review de la spec con dos revisores, dominio en Opus y técnica en Sonnet — «has hehco dom opus / tec sonnet», 2026-10-28

## Intent

En OdySIF (kit 2.3.4), `lint:md` da 167 MD036 que salen de las marcas en negrita del delta de `spec-template.md` y `patch-template.md`, y la fusión de la 6465 dejó tablas sin línea en blanco (MD058) en `people.md` y `authorization.md` (`b04e532`), que obligaron a commits solo de `.md` tras el gate. El éxito: el delta de una spec o de un `patch.md` calcados de la plantilla y una capacidad recién fusionada pasan markdownlint con las reglas por defecto salvo MD013 y MD033, y ninguna spec cerrada hay que tocarla. Fracasa si una spec vieja deja de fusionarse o si el validador deja pasar una marca de delta en una capacidad.

## Scope

- Entra: las marcas del delta de `spec-template.md` y `patch-template.md` como encabezados `####`; `cli/src/capabilities/sections.ts` (lee las dos formas), `check.ts` (rechaza las dos en una capacidad), `merge.ts` (mensaje del título ilegible) y `document.ts` (líneas en blanco alrededor de una tabla, si el rojo lo reproduce); sus tests en `cli/test/capability/`; los dos requisitos MODIFIED y los dos ADDED de `capabilities`.
- No entra: migrar specs, `patch.md` o fixtures de tests con la forma en negrita; MD013 y MD033; el resto de cada plantilla fuera del delta; añadir markdownlint como dependencia o al gate (lo lleva la 0236); el resto de plantillas del kit.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `**ADDED — <título estable>**`, `**MODIFIED — …**`, `**REMOVED — …**` | `skills/sdd-templates/templates/spec-template.md:100,107,115`; `patch-template.md:86` | Scope: pasan a `#### …`; delta, `MODIFIED` de «El delta declara el comportamiento por capacidad» |
| `**Reglas de la capacidad** *(…)*` | `spec-template.md:118` | Scope: pasa a `#### Reglas de la capacidad — <nombre> *(…)*`; decisión 2 |
| Ejemplos `**ADDED — …**` en la capacidad | `capabilities/capabilities.md:98,104,132,143,173` | 98 y 104 cambian en el `MODIFIED` de «El validador de capacidades»; 132, 143 y 173 se quedan: la forma en negrita sigue siendo válida y sus escenarios la prueban |
| Mensaje «escríbelo como «**ADDED — <título>**»» | `cli/src/capabilities/merge.ts:65`, `cli/test/capability/merge.test.ts:218` | Scope; decisión 6 |
| Lectores de la negrita | `cli/src/capabilities/check.ts:85,88`; `skills/sdd-upgrade/references/migrations/v2.0.0.md:74` | `check.ts`: Scope, lee también `####`; la migración 2.0.0 se queda: describe lo que dejaba un kit 1.x, y es inmutable. Buscado con `git grep -nE '\*\*(ADDED\|MODIFIED\|REMOVED) —\|\*\*Reglas de la capacidad' -- cli/src skills .docs/workflow cli/test/kit` |
| Forma en negrita en fixtures y baterías | `tests/batteries/**/fixtures/*.md`, `tests/batteries/sdd-archive/subject.sh:203`, `cli/test/capability/*.test.ts` | Se quedan: prueban la forma vieja, que se sigue leyendo |
| `- motivo:` del `REMOVED` y `capability-template.md:29` («`MODIFIED — <título>`») | `spec-template.md:116`; `capability-template.md:29` | No cambian: no son marcas en negrita |

- Filas que implementa: 0237 → `roadmap.md` (fila 0237) y la propuesta 0234 (§Reparto); las cierra `sdd-archive`. Nada en `skills/` ni `capabilities/`: comprobado con `git grep -n 0237 -- skills .docs/sdd/capabilities`.

## Approach

Las plantillas cambian de forma y la CLI lee las dos: la marca en negrita y el encabezado `####` dan la misma entrada de delta (tipo, título, líneas). El soporte de `####` va primero, porque esta spec ya lo usa. El validador trata las dos formas como resto de delta dentro de una capacidad. Lo de las tablas empieza por un test en rojo de `sdd capability merge` con una tabla en el delta; solo si falla se cambia la fusión.

## Dónde se prueba

- Las dos formas se fusionan igual: `merge.test.ts`, como los casos actuales de ADDED/MODIFIED/REMOVED con `runSdd`.
- La plantilla escribe encabezados y fusiona: `merge.test.ts`, como el caso que ya calca `spec-template.md`, más uno que calca `patch-template.md`.
- El validador rechaza `#### …` en una capacidad y lee el delta en encabezado con `--artifact`: `check.test.ts`, como el caso de `**MODIFIED —` de la línea 133.
- Las líneas en blanco alrededor de una tabla: `merge.test.ts`, test en rojo primero.
- markdownlint sobre un delta calcado de cada plantilla y sobre la capacidad fusionada: una pasada manual de `npx markdownlint-cli2@0.18.1` en el scratchpad, con las reglas por defecto salvo MD013 y MD033, apuntada en el walkthrough; no entra como dependencia.

## Términos y ADR

- Términos resueltos: marca de delta — la línea que abre una entrada del delta (`#### ADDED — <título>`, o `**ADDED — <título>**` en las specs anteriores)
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `capabilities`

#### MODIFIED — El delta declara el comportamiento por capacidad

- GIVEN una spec que cambia comportamiento observable
- WHEN se escribe su sección de delta
- THEN cada requisito va bajo una capacidad nombrada, marcado `ADDED`, `MODIFIED` o `REMOVED (motivo)`, con al menos un escenario `GIVEN / WHEN / THEN`
- AND cada marca es un encabezado bajo la subsección `### Capacidad:` de su capacidad, `#### ADDED — <título>`, `#### MODIFIED — <título>` o `#### REMOVED — <título>`, con una línea en blanco antes de su primer escenario, y las reglas van bajo `#### Reglas de la capacidad — <nombre de la capacidad>`, para que markdownlint no dé MD036, MD022, MD032 ni MD024; la forma en negrita de las specs anteriores (`**ADDED — <título>**`) se sigue leyendo
- AND un escenario de una regla de negocio lleva datos concretos de entrada y de salida («bolsa FR, IT, PT; oferta en DE → no cubre»), no una frase abstracta («una oferta fuera de la bolsa no cubre»)
- AND un THEN o un AND no cita las decisiones de la spec por número (`- THEN se rechaza, por la decisión 10`): la capacidad no tiene esas decisiones, y `sdd capability merge` lo rechaza
- AND un `MODIFIED` copia el bloque entero del requisito con los cambios; `(antes: …)` es opcional y señala la cláusula que cambia
- AND una línea del vivo que el `MODIFIED` quita va en el bloque como `- REMOVED <línea>` (`- REMOVED AND el aviso sale por correo`), y un requisito renombrado es un `REMOVED` del título viejo más un `ADDED` del nuevo, porque el título es la clave de fusión
- AND si la capacidad no existe en `capabilities/`, su creación aparece en "Decisiones a validar"
- AND si un requisito introduce datos, nombres, topes, avisos o una condición de conflicto nuevos, la capacidad lleva su subsección «Reglas de la capacidad» con solo las entradas que cambian (dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto), cada una con su valor completo: con **Avisos**: A y B vigentes y una feature que añade C, la entrada dice A, B y C, porque el cierre de `sdd-archive` sustituye o añade cada entrada entera por su nombre
- AND la lente dominio reclama las entradas que falten y marca como Crítico una regla que contradiga la constitution

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
- AND con `--artifact <spec.md|patch.md>`, que se ejecuta después de fusionar el delta, falla si falta el bloque `## Capacidades`, si sus nombres no coinciden con las subsecciones `### Capacidad:` del delta, si no nombra ninguna capacidad ni dice «Ninguna, porque…» (`<a>: el bloque «Capacidades» está vacío: declara las capacidades o «Ninguna, porque <motivo>»`), si dice «Ninguna» y hay delta, si una capacidad del bloque no tiene fichero en `capabilities/`, o si un `patch.md` declara `- Nuevas:`
- AND con `--artifact`, un `**ADDED — Cancelar una reserva**` del delta de `bookings` sin fusionar falla con `spec.md: «Cancelar una reserva» del delta no está en capabilities/bookings.md`, y un `**MODIFIED — Reservar una franja**` cuyas líneas `- GIVEN`, `- WHEN`, `- THEN` y `- AND` no son, en orden, las de ese requisito en la capacidad, con `spec.md: «Reservar una franja» del delta no coincide con capabilities/bookings.md`; el título cuenta entero aunque el encabezado en negrita, con su `(antes: «…»)`, ocupe varias líneas
- AND con `--artifact`, `#### ADDED — Cancelar una reserva` sin fusionar y `#### MODIFIED — Reservar una franja` con otras líneas de escenario fallan con los mismos dos mensajes
- AND con `--artifact` de una spec cuyo delta solo toca `bookings`, ya fusionado, y `rooms.md` sin `## Requisitos`, escribe `Capacidades válidas: 1`, después `Ajenos al artefacto, no cambian el código de salida: 1` y `  rooms.md: falta la sección «Requisitos»`, y sale con 0
- AND con `--artifact` y un fallo en `bookings.md` o en el propio artefacto, escribe sus líneas, después el bloque de ajenos, y sale con 1; un artefacto con «Ninguna, porque…» no toca ninguna capacidad, y todos los fallos de `capabilities/` salen como ajenos
- AND con `--artifact --json` escribe `{ "validCount": <n>, "errors": [<fallos propios>], "foreign": [<ajenos>] }`; sin `--artifact`, el JSON no lleva `foreign` y todos los fallos cuentan
- AND sin fallos escribe `Capacidades válidas: <n>` y sale con 0; sin carpeta `capabilities/`, o con la carpeta vacía, y sin `--artifact`, escribe `Sin capacidades que validar` y sale con 0

#### ADDED — La fusión lee las dos formas de marca del delta

- GIVEN `capabilities/bookings.md` con el requisito «Reservar una franja», y dos specs con el mismo bloque de escenario: una con `#### MODIFIED — Reservar una franja (antes: «la reserva queda guardada»)` y otra con `**MODIFIED — Reservar una franja**`
- WHEN se ejecuta `sdd capability merge --path .docs/sdd --artifact <spec.md>` con cada una, sobre dos copias de `.docs/sdd`
- THEN las dos escriben `bookings.md: sustituido «Reservar una franja»`, salen con 0 y dejan `bookings.md` con el mismo contenido
- AND con `#### ADDED — Cancelar una reserva` y `#### REMOVED — Consultar salas libres` escribe `bookings.md: añadido «Cancelar una reserva»` y `bookings.md: quitado «Consultar salas libres»`, y con `#### Reglas de la capacidad — bookings` seguido de `- **Avisos**: aviso si la reserva pisa un festivo o dura más de 4 h`, `bookings.md: regla «Avisos» sustituida`
- AND un `#### ADDED — Cancelar una reserva` seguido directamente de `- GIVEN`, sin línea en blanco, se fusiona igual; un `#### ADDED — Cancelar una reserva ##` cerrado añade «Cancelar una reserva»; y un `#### MODIFIED — Reservar una franja (antes: «la reserva queda` con `guardada»)` en la línea siguiente sustituye «Reservar una franja» sin que ninguna línea del «(antes: …)» llegue a la capacidad
- AND un delta calcado de `spec-template.md` o de `patch-template.md`, con los huecos rellenos, no tiene ninguna línea que empiece por `**ADDED`, `**MODIFIED`, `**REMOVED` ni `**Reglas de la capacidad`, cada `#### …` va seguido de una línea en blanco, y se fusiona con código 0
- AND un `#### ADDED - Cancelar una reserva`, con guion en vez de raya, falla con `spec.md: no leo el título de «#### ADDED - Cancelar una reserva»: escríbelo como «#### ADDED — <título>», con raya`, y un `**ADDED - Cancelar una reserva**` con `spec.md: no leo el título de «**ADDED - Cancelar una reserva**»: escríbelo como «#### ADDED — <título>», con raya`; los dos salen con 1 y no escriben

#### ADDED — La fusión deja una línea en blanco alrededor de cada tabla

- GIVEN `capabilities/bookings.md` y una spec con `#### ADDED — Consultar las tarifas` cuyo escenario dice `- THEN responde:`, la tabla `| Sala | Tarifa |`, `| --- | --- |`, `| Norte | 20 € |`, sangrada con dos espacios y pegada a esa línea, sin línea en blanco, y justo debajo `- AND sin sala responde las de todas`
- WHEN se ejecuta `sdd capability merge --path .docs/sdd --artifact <spec.md>`
- THEN en `bookings.md` hay una línea en blanco justo antes de la fila `| Sala | Tarifa |` y otra justo después de `| Norte | 20 € |`, ninguna dentro de la tabla y ninguna doble
- AND con el mismo escenario y la tabla ya rodeada de líneas en blanco en el delta, `bookings.md` queda igual
- AND `sdd capability check --path .docs/sdd --artifact <spec.md>` escribe `Capacidades válidas: 1` y sale con 0

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `skills/sdd-templates/` (total) | 15 752 / 19 650 (15 720 × 1,25) | 3 898 | sin cambio: la feature suma ~10 palabras |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-28 | aprobada (opción «Apruebo») |
