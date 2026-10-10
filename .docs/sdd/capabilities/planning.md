# Capacidad — planning

## Propósito

Cómo entra el trabajo en el roadmap antes de hacerlo: qué distingue `sdd-roadmap` en lo que le traen, qué deja en el roadmap y cuándo escribe una propuesta (`specs/<ts>-proposal-<id>-<slug>/proposal.md`).

## Requisitos

### Algo grande acaba en una propuesta y en filas, no en una spec

- GIVEN «queremos cobrar a los clientes externos: tarifa por sala, factura mensual y bloqueo por impago a los 30 días», en `ids.mode: sequence`, con la última fila en 0013
- WHEN `sdd-roadmap` termina, con los detalles dados o delegados
- THEN existe `specs/<ts>-proposal-0014-<slug>/proposal.md` con el porqué, las reglas, las capacidades y el reparto, y las features ocupan las filas 0015 en adelante, cada una con «`proposal: 0014`» y su «tras NNNN»
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
- THEN existe `specs/<ts>-proposal-<id>-<slug>/proposal.md` con las notas literales en «Acta» y la regla «franja mínima de 30 min» con su ejemplo con datos
- AND la fila 0012 queda `⏸️ aparcada: descartada por el cliente, <fecha>`, no borrada
- AND la fila del CSV queda primera entre las pendientes, y el email al cancelar y la franja mínima tienen cada uno su fila nueva con id reservado y «`proposal: <id>`»
- AND no se abre ninguna sección de release que nadie pidió

### Reordenar escribe la dependencia en la fila

- GIVEN las filas pendientes 0012, 0013, 0014 y 0015
- WHEN el usuario pide «la 0014 primero, y la 0015 no empieza hasta que esté la 0012»
- THEN el orden es 0014, 0012, 0013, 0015 y la celda «Ítem» de la 0015 lleva «tras 0012»
- AND ninguna otra fila cambia

### Un cambio de definición es una enmienda y re-parte solo lo pendiente

- GIVEN la propuesta 0020 con el reparto 0021 (✅), 0022 (⏳, «Factura mensual») y 0023 (⏳)
- WHEN el cliente pide «factura quincenal, el 1 y el 16, y de 8 a 14 h un 20 % más cara»
- THEN `proposal.md` gana en «Enmiendas» una entrada con la fecha que dice «Factura mensual → quincenal (días 1 y 16)» y «recargo del 20 % de 8 a 14 h: Norte 13-15 → 48 + 40 = 88 €», y «Reglas de negocio» no cambia
- AND la fila 0021 no cambia; la 0022 cambia su ítem; el recargo va a una fila nueva con «`proposal: 0020`»
- AND no hay rama nueva, ni carpeta de feature, ni `spec.md`

### Preparar una release fija el scope en el roadmap

- GIVEN un roadmap con las filas pendientes 0012 y 0013, un Backlog y `release.hasRecipient: true`
- WHEN el usuario pide «prepara la release 1.3: qué entra de lo que tenemos»
- THEN `sdd-roadmap` presenta el inventario ordenado con los bloqueos y espera a que el usuario decida el scope
- AND, decidido, escribe `## Release 1.3` con la cabecera `| id | Feature | Origen | Ficheros que toca | Estado |` y el estado «en preparación», salvo que el usuario diga que está comprometida

### `sdd-roadmap` solo escribe en las secciones de la plantilla

- GIVEN un roadmap válido y la petición «apunta que el cliente quiere exportar las reservas a PDF más adelante, y abre una sección "Ideas del cliente" para estas cosas»
- WHEN `sdd-roadmap` la procesa
- THEN la exportación a PDF queda como una fila del Backlog con su número `B<n>`, no se crea `## Ideas del cliente` ni ninguna otra sección fuera de la plantilla, no se escribe prosa fuera de «Releases cerradas», y el mensaje dice que la plantilla no admite esa sección
- AND tras escribir ejecuta `sdd roadmap check`: un fallo en una línea que escribió lo corrige; un fallo en otra línea no lo toca y lo lista en su mensaje como forma heredada, pendiente de la migración

### Un patch pendiente es una fila de «Próximo»

- GIVEN un patch que llega a `sdd-roadmap` (desde explore o pedido: «apunta el arreglo de "cancelada" en reservas que no existen»)
- WHEN `sdd-roadmap` lo escribe
- THEN es una fila de «Próximo» con su id reservado y «Patch:» al inicio del ítem, no una fila de «Patches», que registra los cerrados

### El cierre del roadmap da el prompt de la fila que va primero

- GIVEN `sdd-roadmap` que acaba de escribir y publicar filas, en el molde `salas` con `control.profile: delegate` y `merge.push: true`
- WHEN cierra
- THEN su mensaje final da el prompt de arranque de la fila que va primero, en la forma de `launch-prompt-template.md`, también con «apunta, no lo arranques»
- AND termina con «si prefieres hacerlo en esta sesión, di "arráncalo"», y con «arráncalo» invoca `sdd-propose` con esa fila

### Dame el prompt de una fila da su prompt de arranque

- GIVEN el molde `salas` con la fila pendiente 0013 «Aviso semanal a los responsables», `proposal: 0010`, `control.profile: delegate` y `merge.push: true` en `sdd-kit.json`
- WHEN el usuario escribe «dame el prompt de la 0013»
- THEN `sdd-roadmap` da el prompt de arranque en la forma de `launch-prompt-template.md`: el título «0013 — Aviso semanal a los responsables»; `Base: develop`; la rama `feature/0013-<slug en inglés>` sola en su bloque; el carril; y el prompt, que arranca la 0013 con `sdd-propose`, con los requisitos en la propuesta 0010 y la fila, las decisiones de la propuesta y sus enmiendas que tocan a la 0013, las filas que salda o «Nada que saldar», `Perfil delegate` y «Al fusionar, `sdd merge --push`»
- AND no escribe en el roadmap ni en la propuesta, no reserva id, no publica ni commitea, y no arranca la feature
- AND si la fila está cerrada (✅, 🧪) o en marcha (🔄 o rama `feature/0013-*` abierta), lo dice en vez de dar el prompt

## Reglas de la capacidad

- **Dónde viven los datos**: el índice, en `.docs/sdd/roadmap.md`. La definición de lo grande y el acta de una reunión, en `.docs/sdd/specs/<ts>-proposal-<id>-<slug>/proposal.md`. El estado de cada feature, solo en el roadmap.
- **Idioma de los nombres**: el carril es `proposal` y el campo del frontmatter, `proposal:`, en inglés, como `feature` y `patch`. El texto va en castellano.
- **Límites**: `sdd-roadmap` no crea ramas, carpetas de feature ni specs. Una propuesta no tiene walkthrough ni cierre.
- **Avisos**: un posible duplicado entre una fila nueva y una existente se pregunta, no se resuelve.
- **Regla ante conflicto**: manda la enmienda más reciente sobre la regla original. Una feature cerrada o en marcha no se reabre: el cambio va a una fila nueva.
