# Capacidad — planning

## Propósito

Cómo entra el trabajo en el roadmap antes de hacerlo: qué distingue `sdd-roadmap` en lo que le traen, qué deja en el roadmap y cuándo escribe una propuesta (`changes/<ts>-proposal-<id>-<slug>/proposal.md`).

## Requisitos

### Algo grande acaba en una propuesta y en filas, no en una spec

- GIVEN «queremos cobrar a los clientes externos: tarifa por sala, factura mensual y bloqueo por impago a los 30 días», en `ids.mode: sequence`, con la última fila en 0013
- WHEN `sdd-roadmap` termina, con los detalles dados o delegados
- THEN existe `changes/<ts>-proposal-0014-<slug>/proposal.md` con el porqué, las reglas, las capacidades y el reparto, y las features ocupan las filas 0015 en adelante de `ROADMAP.md`, cada una con la ruta de esa propuesta en el `**Requisitos:**` de su brief y la dependencia en «Tras»
- AND cada regla lleva un ejemplo con datos: «Acme, 3 h en Norte (40 €/h) y 2 h en Sur (25 €/h) en agosto → factura del 1 de septiembre por 170 €»
- AND no hay rama nueva, ni carpeta de feature, ni `spec.md`

### Algo concreto es una fila, sin propuesta

- GIVEN «apunta en el roadmap: exportar las reservas a CSV. No la arranques»
- WHEN `sdd-roadmap` termina
- THEN el roadmap tiene una fila más con ese ítem, y no hay carpeta `-proposal-` ni `spec.md`

### Los items del gestor entran con su id y no pisan filas

- GIVEN `ids.mode: tracker`, un roadmap con la fila 0013 «Aforo de cada sala en `salas libres`» y los items 4512 (CSV), 4513 (facturación: tarifas, factura, avisos, bloqueo y portal) y 4514 (aforo en `salas libres`)
- WHEN `sdd-roadmap` los mete en el roadmap
- THEN 4512, 4513 y 4514 van con esos ids, sin reservar ninguno con el script
- AND la fila 0013 sigue ahí: el posible duplicado con 4514 se pregunta, no se resuelve borrando
- AND la respuesta propone ya la partición de 4513 en hijos para que el PM los cree en el gestor, y el roadmap no lleva ids inventados para ellos

### Una reunión deja su acta en una propuesta y sus cambios en el roadmap

- GIVEN las notas «1) la 0012 ya no la quieren; 2) exportar a CSV, lo primero; 3) email al cancelar; 4) franja mínima de 30 minutos»
- WHEN `sdd-roadmap` las refleja
- THEN existe `changes/<ts>-proposal-<id>-<slug>/proposal.md` con las notas literales en «Acta» y la regla «franja mínima de 30 min» con su ejemplo con datos
- AND la fila 0012 queda `⏸️ aparcada: descartada por el cliente, <fecha>`, no borrada
- AND la fila del CSV queda primera entre las pendientes, y el email al cancelar y la franja mínima tienen cada uno su fila nueva con id reservado y la ruta de la propuesta en el `**Requisitos:**` de su brief
- AND no se abre ninguna sección de release que nadie pidió, ni el título de Now gana una versión que nadie pidió

### Reordenar escribe la dependencia en la fila

- GIVEN las filas pendientes 0012, 0013, 0014 y 0015
- WHEN el usuario pide «la 0014 primero, y la 0015 no empieza hasta que esté la 0012»
- THEN el orden es 0014, 0012, 0013, 0015, y la 0015 lleva `0012` en su columna «Tras»
- AND ninguna otra fila cambia

### Un cambio de definición es una enmienda y re-parte solo lo pendiente

- GIVEN la propuesta 0020 con el reparto 0021 (✅), 0022 (⏳, «Factura mensual») y 0023 (⏳)
- WHEN el cliente pide «factura quincenal, el 1 y el 16, y de 8 a 14 h un 20 % más cara»
- THEN `proposal.md` gana en «Enmiendas» una entrada con la fecha que dice «Factura mensual → quincenal (días 1 y 16)» y «recargo del 20 % de 8 a 14 h: Norte 13-15 → 48 + 40 = 88 €», y «Reglas de negocio» no cambia
- AND la fila 0021 no cambia; la 0022 cambia su «Tarea» y su brief; el recargo va a una fila nueva con la propuesta 0020 en el `**Requisitos:**` de su brief
- AND no hay rama nueva, ni carpeta de feature, ni `spec.md`

### Preparar una release fija el scope en el roadmap

- GIVEN un roadmap con las filas pendientes 0012 y 0013, lo no decidido en Later y `release.hasRecipient: true`
- WHEN el usuario pide «prepara la release 1.3: qué entra de lo que tenemos»
- THEN `sdd-roadmap` presenta el inventario ordenado con los bloqueos y espera a que el usuario decida el scope
- AND, decidido, en `ROADMAP.md` titula la sección `## Now — 1.3 · en preparación`, salvo que el usuario diga que está comprometida (`## Now — 1.3 · comprometida`), deja en Now las filas del scope en el orden decidido, con el «Toca:» de cada brief, y pasa a Next lo pendiente que no entra

### `sdd-roadmap` solo escribe en las secciones de la plantilla

- GIVEN un roadmap válido y la petición «apunta que el cliente quiere exportar las reservas a PDF más adelante, y abre una sección "Ideas del cliente" para estas cosas»
- WHEN `sdd-roadmap` la procesa
- THEN la exportación a PDF queda como una fila de Later con un id de la reserva (en `tracker`, el del ticket o `0000`), nunca un `B<n>`; no se crea `## Ideas del cliente` ni ninguna otra sección fuera de la plantilla, no se escribe prosa fuera de las tablas, y el mensaje dice que la plantilla no admite esa sección
- AND tras escribir ejecuta `sdd roadmap check`: un fallo en una línea que escribió lo corrige; un fallo en otra línea no lo toca y lo lista en su mensaje como forma heredada, pendiente de la migración

### El cierre del roadmap da el prompt de la fila que va primero

- GIVEN `sdd-roadmap` que acaba de escribir y publicar filas, en el molde `salas` con `control.profile: delegate` y `merge.push: true`
- WHEN cierra
- THEN su mensaje final da el prompt de arranque de la fila que va primero, en la forma de `launch-prompt-template.md`, también con «apunta, no lo arranques»
- AND termina con «si prefieres hacerlo en esta sesión, di "arráncalo"», y con «arráncalo» invoca `sdd-propose` con esa fila

### Dame el prompt de una fila da su prompt de arranque

- GIVEN el molde `salas` con la fila pendiente 0013 «Aviso semanal a los responsables», `proposal: 0010`, `control.profile: delegate` y `merge.push: true` en `sdd-kit.json`
- WHEN el usuario escribe «dame el prompt de la 0013»
- THEN `sdd-roadmap` da el prompt de arranque en la forma de `launch-prompt-template.md`: el título en `###` y cursiva con el emoji del carril, «0013 — Aviso semanal a los responsables»; `***Nombre:***` con `feature/0013-<slug en inglés>`, `***Base:***` con `develop` y `***Carril:***`, en líneas seguidas y con el valor en código en línea; `***Prompt***`; y un bloque de código sin lenguaje, que arranca la 0013 con `sdd-propose`, con alcance, fuera de alcance, las lecturas con la propuesta 0010 y la fila, las decisiones de la propuesta y sus enmiendas que tocan a la 0013, las filas que salda o «Nada que saldar», el criterio de hecho, `Perfil delegate` y «Al fusionar, `sdd merge --push`»
- AND no escribe en el roadmap ni en la propuesta, no reserva id, no publica ni commitea, y no arranca la feature
- AND si la fila está cerrada (✅, 🧪) o en marcha (🔄 o rama `feature/0013-*` abierta), lo dice en vez de dar el prompt

### Con `ROADMAP.md`, una fila nueva lleva título, one-liner, brief y tamaño

- GIVEN el molde `salas-3`, con `ROADMAP.md`, `ids.mode: sequence` y la última fila en 0013
- WHEN el usuario pide «Apunta en el roadmap: exportar las reservas a CSV. No la arranques.»
- THEN `ROADMAP.md` tiene en Next la fila `0014`, con `**Exportar las reservas a CSV**`, su one-liner, su brief con `**Carril:**`, `**Requisitos:**`, `**Decisiones ya tomadas:**`, `**Salda:**` y `**Toca:**`, estado `⏳` y tamaño `S`, y `sdd roadmap check` escribe `Roadmap válido`
- AND lo que aún no se ha decidido hacer va a Later con un id de la misma reserva, con el brief opcional
- AND subir una fila de Later a Next conserva su id y le escribe el brief y el tamaño; con «dame el prompt de la 0015», si la 0015 está en Later, `sdd-roadmap` no da prompt: dice que está en Later y que subirla a Next le escribe su brief

### El triaje propone el estado de cada ítem de la deuda

- GIVEN el molde `salas-3`, con `ROADMAP.md`; un `CHANGELOG.md` con `## [1.4.1] - 2026-10-05` y `## [1.4.0] - 2026-09-01`; en «Por triar» de `debt.md`, dos filas del informe de QA `docs/qa/2026-10-12-informe.md`: «La exportación a CSV pierde las tildes desde la 1.4.2» y «`salas libres --planta 2` lista también salas de la planta 1»; y en «En espera», «Las reservas de más de 8 h no avisan al responsable», del 2026-07-01, con «Falta» `2.º caso`, con `## [1.3.0] - 2026-07-20` también en el changelog. En el molde, la exportación conserva las tildes y `node src/app.js libres --planta 2` devuelve `Norte (planta 1)`
- WHEN el usuario pide «Tria lo que hay por triar en la deuda.»
- THEN `sdd-roadmap` no propone la fila del CSV en «Lista»: como no se reproduce, la propone en «En espera» con «Falta» `reproducirlo` y «Causa» `sin determinar`
- AND propone la fila de la planta en «Lista», con «Causa» `defecto del producto`, «Evidencia» `node src/app.js libres --planta 2` → `Norte (planta 1)` y un «Destino» no vacío: el id de una fila de Now o Next, nueva o existente, o `sin fila`
- AND propone descartar la fila de las 8 h, que `roadmap check` avisa que caduca, con el motivo `caducada`: una fila descartada sale de `debt.md`, con su motivo en el cuerpo del commit
- AND en `pair` y `delegate` no escribe en `debt.md` ni en `ROADMAP.md` hasta que el usuario decide, como en el resto de entradas; con la decisión, o con «decide tú», mueve cada fila que cambia de estado a la tabla de ese estado, con la «Fecha» del día, y deja lo decidido en el cuerpo del commit; una fila que sigue en su estado conserva su «Fecha»
- AND en `unattended`, lo que no puede decidir se queda en «Por triar»
- AND el 2.º caso de una fila descartada, cuyo primer caso solo está en su ticket, entra en «Por triar» como fila nueva, con los dos orígenes; y el `**Salda:**` de un brief solo nombra filas de «Lista»
- AND con `ROADMAP.md` y sin `debt.md`, el triaje crea `debt.md` calcando `debt-template.md`

### Una fila con dos o más tests de comportamiento nuevo no es un patch

- GIVEN el molde `salas` y «apunta en una sola fila estos tres arreglos: `libres 25:00-26:00` debe responder «franja no válida: usa HH:MM-HH:MM»; `cancelar Norte`, «indica un día»; `reservar`, «indica una sala»»
- WHEN `sdd-roadmap` escribe la fila y da su prompt
- THEN la fila no lleva `**Carril:** patch` en su brief
- AND el prompt lleva `***Carril:***` lite o feature y `***Nombre:***` `feature/<id>-<slug>`

### Una fila nacida de otro cambio enlaza su artefacto

- GIVEN el patch 0007 cerrado, cuyo gate midió 40 min, con las medidas por fichero solo en `.temp/gate-times.log`, sin versionar
- WHEN el agente apunta la fila para bajar el gate
- THEN la fila enlaza el `patch.md` de la 0007 con la sección de las medidas
- AND ese `patch.md` lleva las cifras que cita la fila (`test/store.test.js` 31 min 40 s), en una adenda fechada

### El segundo caso se busca por causa

- GIVEN el molde `salas-3-cause`: en «En espera», «Las salidas de `DRY_RUN=1` no aparecen en `out/`», con «Falta» `2.º caso`, cuyo ticket mide una ruta de 152 caracteres descartada en silencio por `out_path` y se resuelve con un `RUNS_DIR` en `D:\r`; en «Por triar», «Copiar el molde de una campaña falla con `ENOENT` en una carpeta que existe», cuyo ticket mide una ruta de más de 260 y se resuelve igual; «`/tmp` no existe en la sesión de Git Bash…», que se resuelve con `mkdir -p /tmp`; y dos filas que se resuelven con `relanza`: un `pnpm install` con la red caída y un test que agota su tiempo con la máquina cargada
- WHEN el usuario pide «Tria lo que hay por triar en la deuda.»
- THEN `sdd-roadmap` propone una sola fila en «Lista» que junta las dos primeras, con «Causa» `entorno de la máquina`, los dos tickets en «Origen» y en «Evidencia», el `RUNS_DIR` corto en «Remedio temporal» (no `ninguno`) y «Arreglo» `comprobación automática`, porque el lanzador puede medir la ruta al arrancar; no `línea nueva`
- AND la fila del `/tmp` no cuenta como 2.º caso, aunque comparte la causa: otro cambio y otro remedio son otro problema; se propone aparte, en «En espera» con «Causa» `entorno de la máquina`, o para descartar
- AND las dos filas de `relanza` no se juntan: un remedio de reintento no es criterio
- AND el 2.º caso se busca en toda la deuda, también entre las filas de la tanda que se tría, y un hallazgo con el mismo mecanismo y otra categoría se reclasifica y cuenta

### Preparar una release lee las propuestas de la última retro

- GIVEN `releases/v1.3.0/retro.md` con una fila de «Propuestas» para `regla lejos de su paso` y un action item `[A1]`
- WHEN el usuario pide «prepara la release 1.4: qué entra de lo que tenemos»
- THEN `sdd-roadmap` presenta en su inventario esa propuesta y ese action item, y el dev-lead decide si entran
- AND lee la retro de la última carpeta `vX.Y.Z` que tenga `retro.md`; una `feedback.md` de una release anterior no se lee
- AND sin `retro.md` el inventario sigue sin ella

### «Qué sigue» propone primero las piezas abiertas de una familia a medias

- GIVEN el molde `salas-3-family`, con `ROADMAP.md`: en Now, 0020 y 0021 ⏳ sin familia, y 0012 ✅ de la propuesta 0010; en Next, 0022 ⏳ sin familia, y de la propuesta 0010, 0014 ⏳ con la rama `feature/0014-room-ranking` abierta, 0015 ⏳ tras 0014 y 0013 ⏳ tras 0012
- WHEN el usuario escribe «qué sigue» o «dame la siguiente»
- THEN `sdd-roadmap` propone primero la 0013, por delante de 0020 y 0021, y da su prompt de arranque en la forma de `launch-prompt-template.md`
- AND dice que la 0014 no se ofrece porque tiene rama abierta, y la 0015 porque espera a la 0014
- AND no escribe, no reserva, no publica ni commitea, y no arranca nada

### Sin familia a medias, «qué sigue» sigue el orden de Now

- GIVEN el molde `salas-3-nofamily`: en Now, 0019 ⏳ con la rama `feature/0019-favorite-rooms` abierta, 0020 y 0021 ⏳; en Next, 0012 y 0013 ⏳ de la propuesta 0010, sin ninguna pieza empezada
- WHEN el usuario escribe «qué sigue»
- THEN `sdd-roadmap` propone primero la 0020 y da su prompt
- AND dice que la 0019 no se ofrece porque tiene rama abierta
- AND con Now sin nada que ofrecer, sigue por Next; una fila de Later no se ofrece; sin nada que ofrecer, lo dice

### El triaje solo fija una solución probada con el caso real

- GIVEN el molde `salas-3-fix`: `salas-3` cuyo informe de QA propone, para «`salas libres --planta 2` lista también salas de la planta 1», «en `roomsOnFloor` de `src/app.js`, cambiar `<=` por `<`»
- WHEN el usuario pide «Tria lo que hay por triar en la deuda. Decide tú.»
- THEN ninguna fila que escriba el triaje —la de la deuda ni la de Now o Next, también con «Destino» `sin fila`— fija «cambiar `<=` por `<`»: con ese cambio, `node src/app.js libres --planta 2` sigue dando `Norte (planta 1)`
- AND la solución que fijan es una que `sdd-roadmap` corrió en una copia con `node src/app.js libres --planta 2` y no da `Norte (planta 1)`, o dicen «solución por confirmar»
- AND al acabar, `git status` no da cambios fuera de `ROADMAP.md` y `debt.md`
- AND GIVEN además `docs/ayuda.md` con «`libres --planta <n>` lista las salas de la planta <n>; sin número, responde «indica una planta».», y el informe proponiendo cambiar solo «`libres --planta <n>` lista las salas de la planta <n>» por un texto que ya dice qué da sin número, THEN la fila que fija esa sustitución cita la frase entera que sale, con «sin número, responde «indica una planta»», y la frase entera que entra

### Un patch pendiente es una fila de Now

- GIVEN un patch que llega a `sdd-roadmap` (desde explore o pedido: «apunta el arreglo de "cancelada" en reservas que no existen»)
- WHEN `sdd-roadmap` lo escribe
- THEN en `ROADMAP.md` es una fila de Now con su id reservado y `**Carril:** patch` en su brief

### Con la forma 2.x, `sdd-roadmap` manda a migrar

- GIVEN el molde `salas`, con `.docs/sdd/roadmap.md` 2.x y sin `ROADMAP.md`
- WHEN el usuario pide «Tria el informe de QA de docs/qa/2026-10-12-informe.md. Decide tú.»
- THEN `sdd-roadmap` no escribe nada: dice que necesita la forma 3.0.0 y ofrece `sdd-upgrade`
- AND no crea `ROADMAP.md` ni `debt.md`

## Reglas de la capacidad

- **Dónde viven los datos**: el índice, en `ROADMAP.md` de la raíz; la deuda, en `.docs/sdd/steering/debt.md`. La definición de lo grande y el acta de una reunión, en `.docs/sdd/changes/<ts>-proposal-<id>-<slug>/proposal.md`. El estado de cada feature, solo en el roadmap. Lo que necesita el prompt de arranque de una fila, en su brief.
- **Idioma de los nombres**: el carril es `proposal` y el campo del frontmatter, `proposal:`, en inglés, como `feature` y `patch`; las secciones `Now`, `Next` y `Later`, en inglés, como en `roadmap`. El texto va en castellano, y también las etiquetas del brief (`**Carril:**`, `**Requisitos:**`, `**Decisiones ya tomadas:**`, `**Salda:**`, `**Toca:**`), los estados de la deuda, las causas, los tipos de arreglo y los literales del triaje (`reproducirlo`, `2.º caso`, `caducada`, `sin fila`, `ninguno`, `solución por confirmar`).
- **Límites**: `sdd-roadmap` no crea ramas, carpetas de feature ni specs, ni cambia el código: una solución se prueba en una copia. Una propuesta no tiene walkthrough ni cierre. Ningún ítem de la deuda pasa a «Lista» sin reproducirse o sin un 2.º caso. Con la forma 2.x no escribe nada: manda a migrar.
- **Avisos**: un posible duplicado entre una fila nueva y una existente se pregunta, no se resuelve.
- **Regla ante conflicto**: manda la enmienda más reciente sobre la regla original. Una feature cerrada o en marcha no se reabre: el cambio va a una fila nueva. Entre la solución que trae un ticket y la que se probó con el caso real, manda la probada.
