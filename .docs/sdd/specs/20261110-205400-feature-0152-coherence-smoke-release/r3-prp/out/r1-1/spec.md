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

- Nuevas: `room-managers` — quién es responsable de cada sala.
- Nuevas: `bookings` — quién puede anular una reserva (hoy el proyecto no tiene `capabilities/`).

## Decisiones que he tomado yo — valida estas

1. Capacidad nueva `room-managers`, con los responsables en `data/managers.json` (`{"Norte": "Ana", "Sur": "Luis"}`).
2. Quien ejecuta el comando se identifica con `--como <nombre>`.
3. `bookings` también es capacidad nueva: `capabilities/` no existe y la herramienta de merge rechaza un `MODIFIED` sobre una capacidad sin fichero. Por eso el requisito de anular va como `ADDED`, aunque `anular` ya existe en `src/app.js` y hoy deja anular a cualquiera.
4. Sin `--como`, `anular` responde «indica quién eres con --como» y no anula. Una sala sin responsable en `managers.json` no se puede anular a otros: «sala sin responsable».
5. El titular de la reserva se guarda: `reservar <sala> <día> --como <nombre>` lo apunta en la reserva (campo `person`). Hoy `src/app.js` no lo guarda y sin él no se distingue una reserva propia de una ajena.
6. **Para ti, Laura:** el titular de una reserva puede anularla con `anular` aunque no sea responsable de la sala, y eso amplía el término Anulación de PRODUCT.md («la que anula el responsable»). Propongo ese cambio de término al aprobar. Alternativa: que el titular use `cancelar` (solo antes de 24 h) y se quite el escenario «El titular anula la suya». `cancelar` no cambia en ninguno de los dos casos.
7. Reglas de la capacidad (ver «Reglas de la capacidad»): un responsable por sala; nombres de personas y salas comparados exactamente, con mayúsculas; `--como` es una declaración que no se comprueba (herramienta personal); la Anulación no tiene límite de 24 h (PRODUCT.md: «por cualquier motivo»); los rechazos imprimen el mensaje y el proceso sale como hoy, sin código nuevo.
8. Contradicción que dejo a tu validación: el Product Purpose de PRODUCT.md dice «no hay más usuarios», y esta feature supone varias personas. No lo cambio aquí; decide si se actualiza al aprobar.
9. `reservar` sin `--como` responde «indica quién eres con --como» y no reserva. Las reservas que ya existan sin `person` solo las anula el responsable de su sala.
10. Orden de comprobación de `anular`: sin `--como` se rechaza; si quien anula es el titular, se anula; si no, decide el responsable de la sala; sin responsable, se rechaza.
11. Las reservas, con el campo `person`, siguen en memoria en `src/app.js` como hoy: no hay fichero de reservas ni migración.

### Hallazgos de la review

Primera ronda, dominio (opus) y técnica (sonnet):

- **Aceptado** — Crítico: el titular no se guarda → decisión 5, `reservar` en Scope y escenarios de reserva propia y ajena.
- **Aceptado** — Crítico: Pedro no podría deshacer su reserva → decisión 6 y escenario «El titular anula la suya».
- **Aceptado** — Crítico técnico: `room-managers` sin interfaz observable → el escenario usa `managerOf(sala)`, exportada, y se añade la sala sin responsable.
- **Aceptado** — escenarios que faltaban, el estado que se comprueba (`status` de la reserva) y las cinco reglas por nombre.
- **Aceptado** — `--como` sin verificación y sin límite de 24 h → decisión 7; la contradicción con PRODUCT.md → decisión 8.
- **Aceptado en parte** — `ADDED` en vez de `MODIFIED`: el «retira el comportamiento de hoy» va al Intent, en lugar de crear antes un `bookings.md` base.
- **Rechazado** — renombrar las capacidades a castellano: la regla de capacidades exige slug en inglés y kebab-case; el contenido va en castellano.
- **Rechazado** — fijar códigos de salida y varios responsables por sala: no hay código de salida hoy y la regla es un responsable por sala.

Segunda ronda (sonnet, un revisor, por haber aceptado Críticos):

- **Aceptado** — Crítico: el titular que anula choca con el término Anulación → decisión 6, a tu validación y con su alternativa.
- **Aceptado** — Crítico: escenario con rechazo y éxito mezclados y sin `status` → partido en dos, y el del titular comprueba `status` `voided`.
- **Aceptado** — titular en sala sin responsable, orden de comprobación (decisión 10), fichero ausente o JSON inválido con su escenario, `reservar` sin `--como` y reservas sin `person` (decisión 9), campo `person` en Scope y en memoria (decisión 11).
- **Aceptado** — se retira la afirmación sobre `findBooking`; los mensajes quedan como plantillas en «Reglas de la capacidad»; Approach ampliado; las trazas pasan a «Trazabilidad».

## Intent

Hoy cualquiera anula cualquier reserva. Solo el responsable de cada sala debe poder anular las reservas de otras personas; esto retira el comportamiento de hoy. El titular sigue pudiendo anular la suya.

## Scope

- Entra: `anular <sala> <día> --como <nombre>` (`voidBooking` y su rama en `run`, `src/app.js`); `reservar <sala> <día> --como <nombre>` guarda el titular (campo `person`, en memoria, sin migración; las reservas anteriores sin `person` solo las anula el responsable); `managerOf(sala)`, exportada; `data/managers.json`; sus tests.
- Cambia de contrato: `anular` y `reservar` exigen `--como`; `anular` deja de permitirse a cualquiera.
- No entra: `cancelar`, que sigue igual; autenticar a quien dice ser Ana; editar responsables desde la CLI.

## Approach

`anular` comprueba, en este orden: que venga `--como`; si quien anula es el titular de la reserva, anula; si no, lee `data/managers.json` y solo anula el responsable de la sala; sin responsable o sin fichero legible, rechaza. `reservar` guarda `person` desde `--como`. Enfoque único: el fichero de responsables es lo que pide el Intent y el proyecto no tiene otro lugar de datos.

## Delta de comportamiento

### Capacidad: `room-managers`

**ADDED — Cada sala tiene un responsable**
- GIVEN `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN se llama a `managerOf('Norte')`
- THEN devuelve «Ana»

**ADDED — Una sala sin responsable no tiene a nadie**
- GIVEN `data/managers.json` sin la sala `Este`
- WHEN se llama a `managerOf('Este')`
- THEN devuelve `undefined`

### Capacidad: `bookings`

**ADDED — Solo el responsable anula una reserva ajena**
- GIVEN la reserva activa de Norte del lunes, de Pedro
- WHEN `anular Norte lun --como Luis`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue con `status` `active`

**ADDED — El responsable anula una reserva ajena**
- GIVEN la reserva activa de Norte del lunes, de Pedro
- WHEN `anular Norte lun --como Ana`
- THEN responde «anulada Norte lun» y la reserva queda con `status` `voided`

**ADDED — El titular anula la suya**
- GIVEN la reserva activa de Norte del lunes, de Pedro
- WHEN `anular Norte lun --como Pedro`
- THEN responde «anulada Norte lun» y la reserva queda con `status` `voided`

**ADDED — Anular exige decir quién eres**
- GIVEN la reserva activa de Norte del lunes, de Pedro
- WHEN `anular Norte lun`
- THEN responde «indica quién eres con --como» y la reserva sigue con `status` `active`

**ADDED — Una sala sin responsable no se anula a otros**
- GIVEN la reserva activa de Este del lunes, de Pedro, y `Este` sin responsable
- WHEN `anular Este lun --como Luis`
- THEN responde «sala sin responsable» y la reserva sigue con `status` `active`

**ADDED — El titular anula la suya en una sala sin responsable**
- GIVEN la reserva activa de Este del lunes, de Pedro, y `Este` sin responsable
- WHEN `anular Este lun --como Pedro`
- THEN responde «anulada Este lun» y la reserva queda con `status` `voided`

**ADDED — Sin fichero legible no se anula a otros**
- GIVEN la reserva activa de Norte del lunes, de Pedro, y `data/managers.json` ausente o con JSON inválido
- WHEN `anular Norte lun --como Luis`
- THEN responde «no se pueden leer los responsables», la reserva sigue con `status` `active` y `managerOf('Norte')` devuelve `undefined`

**ADDED — Reservar guarda el titular**
- GIVEN la sala Norte libre el lunes
- WHEN `reservar Norte lun --como Pedro`
- THEN la reserva queda a nombre de Pedro (`person` «Pedro»)

**ADDED — Reservar exige decir quién eres**
- GIVEN la sala Norte libre el lunes
- WHEN `reservar Norte lun`
- THEN responde «indica quién eres con --como» y no hay reserva

### Reglas de la capacidad

- Dónde viven los datos: `data/managers.json`, resuelto desde la raíz del módulo, versionado en el repo.
- Idioma de los nombres: nombres propios tal cual; se comparan exactos, con mayúsculas.
- Límites: un responsable por sala; una persona puede serlo de varias salas.
- Avisos: plantillas literales, en minúscula inicial: `solo {responsable} anula reservas de {sala}`, `anulada {sala} {día}`, `sala sin responsable`, `no se pueden leer los responsables`, `indica quién eres con --como`.
- Conflicto: una sala que `managers.json` no nombra no tiene responsable; un fichero ausente o con JSON inválido hace que `managerOf` devuelva `undefined` y `anular` responda `no se pueden leer los responsables`, salvo que quien anula sea el titular. Orden de comprobación: decisión 10.

## Trazabilidad

Review de spec propuesta: dos revisores — señales: capacidad nueva (`room-managers`, `bookings`), contrato público (flag `--como` y formato de `data/managers.json`), `MODIFIED` en origen (hoy `anular` deja anular a cualquiera), datos (`data/managers.json`), reglas de permiso (quién anula) · tamaño: ~60 líneas en 5 ficheros
- Dominio (opus): qué NO puede hacer Luis en Sur ni nadie sin `--como`, y si «solo Ana anula reservas de Norte» encaja con la Anulación de PRODUCT.md (señal: reglas de permiso)
- Técnica (sonnet): si `--como` y el formato de `managers.json` son un contrato estable, y de dónde sale el dueño de una reserva que `src/app.js` no guarda (señal: contrato público + datos)
- Mínimo razonable: solo dominio — deja sin mirar el contrato de `--como` y el dueño de la reserva, el hueco que rompe el plan a mitad de la Task 1

- Coherence pass: el merge en copia rechazó un `MODIFIED` sobre `bookings` (sin fichero); pasó a `ADDED` con `bookings` en «Nuevas». Merge en copia tras la segunda ronda: `room-managers.md` +2 requisitos, `bookings.md` +9. `git grep` de `anular`, `voidBooking` y `anulada`: solo `src/app.js` (líneas 20-31), sin tests ni docs.
- Segunda ronda: un revisor en sonnet con los siete puntos, por haber aceptado Críticos.
- Política de modelos: revisores de la spec, dominio en opus y técnica en sonnet, en paralelo hasta `control.maxParallelAgents`.

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
