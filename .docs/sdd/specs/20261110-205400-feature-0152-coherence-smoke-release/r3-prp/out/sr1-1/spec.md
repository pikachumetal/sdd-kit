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

- Nuevas: `bookings` — nace con esta feature (el proyecto no tiene `capabilities/`) y recoge dos requisitos: `anular`, que solo puede usar el responsable de sala y guarda quién anuló, y `anuladas`, el listado nuevo de las reservas anuladas. `anular` ya existe en `src/app.js` sin pedir rol: su requisito base es ese comportamiento del código, y esta feature lo cambia (`ADDED` porque no hay requisito escrito que modificar).

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: reglas de visibilidad o permiso, datos (quién anula), contrato público (la salida de `anular`), capacidad nueva (`bookings`) · tamaño: ~110 líneas en 3 ficheros
- Dominio (sonnet): que el cliente no pueda anular ni ver quién anuló, y que la spec no contradiga las definiciones de Cancelación y Anulación de PRODUCT.md (señal: permiso)
- Técnica (sonnet): que cada comportamiento de `anular` y `anuladas` tenga su escenario y que los datos de «quién anuló» tengan sitio (señal: contrato público + datos)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios. Es una bandera declarada, sin autenticación: simula el rol y cualquiera puede escribir `--como responsable`, así que el permiso es una regla de la interfaz, no seguridad. `PRODUCT.md` no cambia (la usa solo su autor).
2. `anular` sin `--como`, o con un valor que no es `cliente` ni `responsable`, no anula y responde con un error. Hoy `anular` no pide rol: es un cambio de contrato declarado, no una ampliación.
3. El permiso se comprueba antes de buscar la reserva: `anular Sur mar --como cliente` responde el error de permiso, no `sin reserva`.
4. «Quién anuló» vive en la propia reserva, en memoria como el resto de datos (campo `voidedBy`, el rol). No hay anulaciones previas con datos guardados: no hay migración ni valor por defecto.
5. Las reservas no tienen dueño y esta feature no lo añade: «de otros» significa que el responsable anula cualquier reserva, sin distinguir de quién es.
6. `anuladas` es un comando nuevo (hoy no existe) y solo lo usa el responsable: el cliente no ve quién anuló. Una línea por reserva anulada, en el orden en que se anularon.
7. Una reserva que ya no está activa —anulada o cancelada— no se anula ni se cancela: `anular` y `cancelar` la tratan como inexistente (`sin reserva …`), como hace hoy el código, y no se reescribe `voidedBy`.
8. `cancelar` no cambia ni recibe `--como`: el cliente conserva la cancelación de reservas, que `PRODUCT.md` le da.
9. `bookings` se declara capacidad nueva y sus dos requisitos van como `ADDED`: sin `capabilities/` no hay requisito base que modificar.

### Decisiones tomadas con el dev-lead

- 2026-11-11 — Laura, dev-lead: «he aceptado la review de dos revisores, el de dominio en Sonnet» (la rúbrica habría puesto Opus por tocar roles; se aplica lo que dijo el dev-lead).

### Hallazgos de la review

Dominio:
- **Aceptado** — Crítico · Intent contradice `PRODUCT.md` sin declararlo → el Intent se reescribe como hacer cumplir la Anulación que `PRODUCT.md` ya define.
- **Aceptado** — Crítico · roles `cliente`/`responsable` chocan con «no hay más usuarios» → decisión 1: bandera declarada, sin autenticación, `PRODUCT.md` no cambia.
- **Aceptado** — Crítico · frontera con `cancelar` sin explicar → decisión 8, Scope y escenario de no regresión.
- **Aceptado** — Importante · dónde vive «quién anuló» y anulaciones previas → decisión 4.
- **Aceptado** — Importante · límites y avisos de `--como` → decisión 2 y escenarios de `--como` ausente y desconocido.
- **Aceptado** — Importante · regla de conflicto → decisión 7 y escenario.
- **Aceptado** — Importante · el complemento del cliente → decisión 6 y escenario de `anuladas` con `--como cliente`.
- **Aceptado** — Menor · idioma de los nombres → el texto de la interfaz va en castellano (constitución 4) y el campo interno sigue el inglés del código (`status`, `voided`).
- **Aceptado** — Menor · el ejemplo «de Ana» → se quita: las reservas no tienen dueño (decisión 5).
- **Aceptado** — Menor · `bookings` sin `capabilities/` → decisión 9.

Técnica:
- **Aceptado** — Crítico · tres comportamientos en un solo escenario → tres escenarios con su GIVEN/WHEN/THEN, y uno que fija que `anuladas` sale del dato guardado.
- **Aceptado** — Crítico · «anular otros» sin verificar → decisión 5: no hay dueño; el escenario es que el responsable anula, y se retira de la spec lo de «otros» como condición verificable.
- **Aceptado** — Importante · `--como` ausente o inválido → decisión 2 y escenarios.
- **Aceptado** — Importante · errores (inexistente, ya anulada, rol y reserva inexistente) → decisiones 3 y 7 y escenarios.
- **Aceptado** — Importante · decisiones del cuerpo fuera del ✋ → decisiones 2 a 9.
- **Aceptado** — Importante · formato actual de `anuladas` → no existe: es comando nuevo (decisión 6), no hay tests de `anuladas` que se rompan.
- **Aceptado** — Crítico · dónde se persiste y anulaciones antiguas → decisión 4.
- **Aceptado** — Menor · dónde se prueba `anuladas` y tests actuales de `anular` → `Dónde se prueba` lo recoge; no hay tests de `anular` hoy.
- **Aceptado** — Menor · origen de `bookings` → decisión 9.
- **Aceptado** — Menor · `cancelar` sin `--como` y no regresión → decisión 8 y escenario.

### Hallazgos de la segunda ronda

Un revisor, sin Críticos:
- **Aceptado** — Importante · `ADDED` que encubre un `MODIFIED` de `anular` → «Capacidades» dice que el requisito base es el comportamiento del código y por qué sigue siendo `ADDED`; el escenario de rol ausente fija que `anular` sin `--como` deja de anular.
- **Aceptado** — Importante · el escenario de anular no fija `voidedBy` → el escenario lo exige.
- **Aceptado** — Importante · «conserva a quien anuló primero» no se puede probar con un solo rol → se quita de la decisión 7; queda que no se reescribe `voidedBy`.
- **Aceptado** — Importante · `anuladas` fuera del Intent → el Intent lo recoge con su restricción.
- **Aceptado** — Importante · el permiso por bandera es decorativo → decisión 1 lo dice: regla de interfaz, no seguridad.
- **Aceptado** — Importante · `anuladas` sin `--como` o con rol desconocido, y orden del listado → dos escenarios nuevos.
- **Aceptado** — Menor · `--como cliente` sobre una reserva ya anulada → el escenario de «ya anulada» lo recoge.
- **Aceptado** — Menor · conflicto cancelada/anulada → decisión 7 y escenario.
- **Aceptado** — Menor · ficheros tocados y las cinco reglas por nombre → Scope y «Reglas de la capacidad».
- **Aceptado** — Menor · la excepción del modelo sin rastro → la línea cita a Laura.

## Intent

`PRODUCT.md` define la Anulación como la reserva que anula el responsable de sala, pero hoy `anular` no mira quién lo pide: cualquiera anula cualquier reserva. Esta feature lo hace cumplir: solo el responsable de sala anula, anula la de cualquiera, y queda guardado quién anuló. Para poder ver ese dato entra el comando nuevo `anuladas`, que lista las anuladas y solo lo usa el responsable.

## Scope

- Entra: `anular` con `--como`, el campo `voidedBy` en la reserva y el comando nuevo `anuladas`, en `src/app.js`, con sus pruebas en `test/anular.test.js`.
- No entra: `cancelar` (no cambia ni recibe `--como`), un dueño de la reserva, autenticación, persistencia en disco.

## Reglas de la capacidad

- Dónde vive el dato: `voidedBy` en la reserva, en memoria (decisión 4).
- Idioma de los nombres: castellano en la interfaz (constitución 4); el campo interno sigue el inglés del código.
- Límites: `--como` solo admite `cliente` y `responsable`; no aplica ningún otro límite (longitud, número de anuladas).
- Avisos: los mensajes de los escenarios, literales.
- Conflicto: una reserva no activa se trata como inexistente (decisión 7).

## Dónde se prueba

- Anular y anuladas: por `run('anular', …)` y `run('anuladas', …)`, en `test/anular.test.js`, como `test/cancel.test.js`. Hoy no hay tests de `anular` que pasen a llevar `--como`.
- No regresión de `cancelar`: los tests de `test/cancel.test.js`, sin tocar.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Anular una reserva**

Escenario: el responsable anula
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva queda anulada
- AND la reserva guarda `voidedBy = responsable`

Escenario: el cliente no anula
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como cliente`
- THEN responde `solo el responsable de sala puede anular` y la reserva sigue activa

Escenario: rol ausente o desconocido
- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun` (sin `--como`)
- THEN responde `falta --como <cliente|responsable>` y la reserva sigue activa
- AND con `--como admin` responde `rol desconocido: admin` y la reserva sigue activa

Escenario: el permiso va antes que la búsqueda
- GIVEN que no hay reserva de Sur del mar
- WHEN `anular Sur mar --como cliente`
- THEN responde `solo el responsable de sala puede anular`
- AND con `--como responsable` responde `sin reserva Sur mar`

Escenario: una reserva ya anulada no se vuelve a anular
- GIVEN la reserva de Norte del lun, ya anulada por el responsable
- WHEN `anular Norte lun --como responsable`
- THEN responde `sin reserva Norte lun`
- AND `anuladas --como responsable` sigue listando `Norte lun — anulada por responsable`, una sola vez
- AND con `--como cliente` responde `solo el responsable de sala puede anular`

Escenario: una reserva cancelada no se anula, ni una anulada se cancela
- GIVEN la reserva de Norte del lun, cancelada con `cancelar Norte lun`
- WHEN `anular Norte lun --como responsable`
- THEN responde `sin reserva Norte lun`, y `anuladas --como responsable` no la lista
- AND con la reserva anulada, `cancelar Norte lun` responde `sin reserva Norte lun`

**ADDED — Listar las anuladas**

Escenario: el responsable ve quién anuló
- GIVEN la reserva de Norte del lun, anulada con `--como responsable`
- WHEN `anuladas --como responsable`
- THEN responde `Norte lun — anulada por responsable`
- AND el rol sale del dato guardado en la reserva, no de una cadena fija: es el valor de `voidedBy`

Escenario: el listado sigue el orden de anulación
- GIVEN dos reservas activas, Norte del lun y Sur del mar
- WHEN el responsable anula primero Sur del mar y luego Norte del lun, y se pide `anuladas --como responsable`
- THEN responde dos líneas, `Sur mar — anulada por responsable` y después `Norte lun — anulada por responsable`

Escenario: `anuladas` sin rol o con rol desconocido
- GIVEN cualquier estado
- WHEN `anuladas` (sin `--como`)
- THEN responde `falta --como <cliente|responsable>`
- AND con `--como admin` responde `rol desconocido: admin`

Escenario: sin anuladas
- GIVEN que ninguna reserva está anulada
- WHEN `anuladas --como responsable`
- THEN responde `sin anuladas`

Escenario: el cliente no lo ve
- GIVEN la reserva de Norte del lun, anulada por el responsable
- WHEN `anuladas --como cliente`
- THEN responde `solo el responsable de sala puede ver las anuladas`

**Sin cambio — `cancelar`**
- GIVEN la reserva activa de Norte del lun
- WHEN `cancelar Norte lun` (sin `--como`)
- THEN responde `cancelada Norte lun`, como hoy

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
