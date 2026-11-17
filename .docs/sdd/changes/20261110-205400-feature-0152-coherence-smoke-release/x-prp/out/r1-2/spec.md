---
id: 20261008-110000-feature-0011-void-others
feature: 0011
title: Anular reservas de otros
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: null
---

# Spec — Anular reservas de otros

## Capacidades

- Nuevas: `responsables-de-sala`, `reservas` — quién es responsable de cada sala, y que anular una reserva exige serlo.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`responsables-de-sala` y `reservas`), contrato público (`anular` gana `--como`; `data/managers.json` es un formato nuevo), datos (`data/managers.json`), zona sin explorar (solo he leído `src/app.js`), reglas de visibilidad/permiso (quién NO puede anular) · tamaño: ~40 líneas de spec, ~20 de código en 2 ficheros
- Dominio (opus): qué NO puede hacer quien no es responsable —¿puede Pedro anular su propia reserva con `--como Pedro`?— y qué pasa si falta `--como` o la sala no tiene responsable (señal: permisos)
- Técnica (sonnet): si `data/managers.json` y `--como` son un contrato estable, y que `bookings` en `src/app.js` no guarda quién reservó, de modo que el escenario «reserva de Pedro» no tiene dato donde apoyarse (señal: contrato público + datos)
- Mínimo razonable: solo dominio — deja sin mirar el formato del fichero y el dato del titular de la reserva

1. Responsables de sala en `data/managers.json` (`{"Norte": "Ana", "Sur": "Luis"}`), un responsable por sala; se consulta con `responsableDe(sala)`, exportada de `src/app.js`.
2. Quien ejecuta `anular` se identifica con `--como <nombre>`, obligatorio, con mayúsculas exactas.
3. Las capacidades llevan nombre en castellano (`responsables-de-sala`, `reservas`) por la constitución (punto 4). `reservas` nace con este único requisito; los de reservar quedan fuera por ahora. No existe `capabilities/reservas.md`: por eso es «Nueva» y su requisito `ADDED`.
4. Quien no es responsable no anula **ninguna** reserva, tampoco la suya: para eso está `cancelar`, que no cambia (y su regla de 24 h tampoco).
5. Cada reserva guarda su titular (`owner`). `reservar` hoy no crea reservas (devuelve un texto fijo), así que no se toca; el titular entra en el dato de partida de `src/app.js` (la reserva de Norte del lunes, de Pedro).
6. El rechazo no nombra al responsable: «solo el responsable de la sala anula reservas».
7. `--como` es una identidad declarada, no autenticación: cualquiera puede escribir `--como Ana`. Es coherente con PRODUCT.md (una sola persona usa y despliega la herramienta); lo digo para que no se lea como control de acceso.
8. La spec alinea el código con la «Anulación» que PRODUCT.md ya define (la hace el responsable de sala); PRODUCT.md no cambia.
9. `anular` identifica la reserva por sala y día, como hoy; sin reserva activa, responde «sin reserva <sala> <día>» antes de mirar quién pregunta.
10. Mensajes literales: «anular necesita --como y un nombre» (falta `--como` o va vacío), «solo el responsable de la sala anula reservas» (no es el responsable, o la sala no tiene), «no se puede leer data/managers.json» (ausente, no es JSON, o un valor que no es un nombre).
11. Hoy ninguna reserva real lleva `owner`: el comando que las cree llegará en otra feature; esta spec la prueba con reservas preparadas en el test, con distinto `owner` y distinto responsable, sin depender de la semilla de `src/app.js`.

### Hallazgos de la review

- **Aceptado** (Crítico, ambas) — el GIVEN «reserva de Pedro» no tiene dato de titular → decisión 5 y Scope: el registro lleva `owner`.
- **Aceptado** (Crítico, dominio) — `anular` sin `--como` y la propia reserva quedaban sin definir → decisiones 2 y 4, y escenarios nuevos.
- **Aceptado** (Crítico, técnica) — un literal fijo pasaba con solo Norte→Ana → decisión 6 (mensaje sin nombre) y escenario con Sur→Luis, que depende del dato.
- **Aceptado** (Importante) — sala sin responsable, fichero ausente o mal formado, nombre desconocido → escenarios; `--como` sin autenticación → decisión 7; interfaz de consulta → decisión 1 y escenarios; capacidades en castellano → decisión 3; «Reglas de la capacidad» → añadidas; contrato de `managers.json` → Scope.
- **Aceptado** (Menor) — franja → decisión 9; `bookings` parcial → decisión 3; términos de PRODUCT.md y 24 h → decisiones 4 y 8.
- Segunda ronda (Sonnet, 10 hallazgos, 2 Críticos):
  - **Aceptado** (Crítico) — el GIVEN dependía de una semilla del propio agente → decisión 11: reservas preparadas en el test.
  - **Aceptado** (Crítico) — la sala sin responsable no estaba fijada → Este, con reserva de Pedro y `--como Ana`.
  - **Aceptado** (Importante/Menor) — estado observable (`voided`/`active`), `--como ana`, `--como ""`, reserva inexistente, anular dos veces, valores no-nombre del JSON, ausente y mal formado en escenarios separados, mensajes en decisión 10, reglas de `reservas`, no hay reservas reales con `owner` aún.
  - **Rechazado** (Menor) — mover a un registro aparte el bloque de proceso del ✋: la rúbrica lo exige como apertura del ✋ y es lo que valida Laura.
- **Rechazado** (Importante, dominio) — «declarar la actualización de PRODUCT.md por varios usuarios»: los nombres son quienes reservan en el coworking, la herramienta la sigue usando una sola persona; no cambia el propósito.
- **Rechazado** (Importante, técnica) — listar `reservar` en el Scope: no crea reservas hoy, así que no se toca (decisión 5).

Pasada de coherencia: `sdd capability merge` sobre una copia de `.docs/sdd`: la primera versión se rechazaba (`MODIFIED` de una capacidad sin fichero); con esta, exit 0 («responsables-de-sala.md: añadido… y sus 5 reglas», «reservas.md: añadido…»). `git grep` de `anular`, `managers`, `--como` y `0011` fuera de las specs: solo `src/app.js:31` (despacho de `anular`) y la fila 0011 del ROADMAP; nada se retira.

### Sin medir

- Si algún test existente (`test/app.test.js`, `test/cancel.test.js`) construye reservas sin `owner`: no lo he leído; la task de código lo comprueba con `node --test`.

## Intent

Hoy cualquiera anula cualquier reserva. Solo el responsable de cada sala debe poder anular las reservas de otras personas, como ya define la «Anulación» de PRODUCT.md.

## Scope

- Entra: `anular <sala> <día> --como <nombre>` (flag nuevo y obligatorio); `data/managers.json` (objeto `sala → nombre`, un nombre por sala, claves y nombres con mayúsculas exactas); `responsableDe(sala)` en `src/app.js`; campo `owner` en las reservas.
- No entra: `cancelar` y su regla de 24 h, `reservar`, autenticar a quien ejecuta, cambiar PRODUCT.md.

## Approach

`anular` lee `data/managers.json`, compara `--como` con el responsable de la sala y, si no coincide, rechaza sin tocar la reserva.

## Delta de comportamiento

### Capacidad: `responsables-de-sala`

**ADDED — Cada sala tiene un responsable**
- GIVEN `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN `responsableDe("Sur")`
- THEN devuelve «Luis»
- AND `responsableDe("Este")` devuelve `undefined`

#### Reglas de la capacidad — responsables-de-sala

- **Dónde viven los datos**: `data/managers.json`.
- **Idioma de los nombres**: castellano para capacidades y mensajes; las salas y las personas llevan el nombre que tengan.
- **Límites**: un responsable por sala.
- **Avisos**: no aplica.
- **Regla ante conflicto**: una sala que no está en el fichero no tiene responsable, y nadie anula sus reservas.

### Capacidad: `reservas`

**ADDED — Anular una reserva exige ser responsable de la sala**
- GIVEN la reserva de Norte del lunes, de Pedro, y `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN `anular Norte lun --como Luis`
- THEN responde «solo el responsable de la sala anula reservas» y la reserva sigue activa
- AND `anular Norte lun --como Pedro` responde lo mismo y la reserva sigue activa
- AND `anular Norte lun --como Ana` responde «anulada Norte lun»
- AND `anular Norte lun` responde «anular necesita --como y un nombre» y la reserva sigue activa
- AND `anular Norte lun --como ana` responde lo mismo y la reserva sigue activa (las mayúsculas cuentan)
- AND `anular Norte lun --como ""` responde «anular necesita --como y un nombre» y la reserva sigue activa
- AND con la reserva de Sur del lunes, de Pedro, `anular Sur lun --como Luis` responde «anulada Sur lun»
- AND con la reserva de Este del lunes, de Pedro, y Este ausente de `data/managers.json`, `anular Este lun --como Ana` responde «solo el responsable de la sala anula reservas» y la reserva sigue activa
- AND `anular Norte mar --como Ana`, sin reserva ese día, responde «sin reserva Norte mar»
- AND tras `anular Norte lun --como Ana`, repetir el mismo comando responde «sin reserva Norte lun»
- AND con `data/managers.json` ausente, `anular Norte lun --como Ana` responde «no se puede leer data/managers.json» y la reserva sigue activa
- AND con `data/managers.json` que no es JSON, o con un valor que no es un nombre (`{"Norte": ["Ana", "Luis"]}` o `{"Norte": ""}`), `anular Norte lun --como Ana` responde «no se puede leer data/managers.json» y la reserva sigue activa
- AND cada «anulada» comprueba que la reserva queda con estado `voided`, y cada «sigue activa», con estado `active`

#### Reglas de la capacidad — reservas

- **Dónde viven los datos**: las reservas, con su `owner`, en la memoria de `src/app.js`; no aplica persistencia nueva.
- **Idioma de los nombres**: castellano para los mensajes.
- **Límites**: no aplica.
- **Avisos**: no aplica.
- **Regla ante conflicto**: la reserva que se anula no existe, o `anular` no puede decidir quién es responsable, y no se toca nada.

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
