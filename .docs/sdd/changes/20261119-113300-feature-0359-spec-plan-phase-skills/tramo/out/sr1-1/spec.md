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

- Nuevas: `bookings` — anular reservas según el rol (`--como`) y listar las anuladas con quién las anuló.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores (+ una segunda ronda) — señales: reglas de visibilidad o permiso, datos (quién anuló), contrato público (la salida de `anular` y el comando `anuladas`), capacidad nueva · tamaño: ~90 líneas en 3 ficheros
- Dominio (sonnet, por frase del dev-lead): que el cliente no pueda anular ni ver quién anuló (señal: permiso)
- Técnica (sonnet): que `anuladas` y el valor por defecto de `--como` no rompan nada existente (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios ni autenticación, así que el rol es **autodeclarado** y el permiso es una regla de uso, no un control de seguridad. Acepto esa limitación; cualquiera puede escribir `--como responsable`.
2. `bookings` es capacidad **nueva**: el repo no tiene `capabilities/`, así que no hay requisito vigente que modificar. Cubre solo `anular` y `anuladas`; `cancelar` y `libres` quedan fuera.
3. Sin `--como`, el rol es `cliente` (cierra el permiso). Es un **cambio de contrato**: hoy `anular` sin rol anula. Lo asumo porque una búsqueda en `src/`, `test/`, `README.md` y `ROADMAP.md` solo encuentra la propia función (`src/app.js`): ningún test ni llamador. No he mirado fuera del repo.
4. `anuladas` **es un comando nuevo** (hoy no existe), y solo lo ve el responsable: el cliente no ve quién anuló ni el listado.
5. Las reservas viven en memoria y no tienen dueño: no hay datos previos que migrar ni «reservas de otros» que distinguir; el responsable anula cualquiera. El fixture de las pruebas es la reserva sembrada de `src/app.js` (Norte, lun, 10:00-12:00); cada prueba parte de estado limpio y el plan decide cómo.
6. `anuladas` guarda y muestra el **rol** que anuló (lo que dice `--como`), no una persona. Hoy solo puede ser `responsable`; se guarda porque tu petición es que quede quién anuló.
7. Textos de respuesta en castellano (constitución 4), literales en el delta. Sin códigos de salida: `run` devuelve texto y no cambia.
8. Orden de validación: primero el rol, luego la existencia de la reserva. `--como` solo admite `cliente` y `responsable` en minúsculas; otro valor, mayúsculas o `--como` sin valor es «rol desconocido». Si `--como` se repite, no aplica: se toma el primero.

Política de modelos: revisores de la spec en Sonnet (el de dominio por tu frase, el técnico y la segunda ronda por la rúbrica); la implementación va en Native, en la sesión, sin subagentes de código.

### Hallazgos de la review

Ronda 1, dominio:
- **Aceptado** — `bookings` sin fichero en `capabilities/`, el MODIFIED no tiene base (Crítico) → capacidad nueva con ADDED; decisión 2.
- **Aceptado** — falta el complemento del rol (Crítico) → escenario «El cliente no ve las anuladas»; decisión 4.
- **Aceptado** — `--como` lo declara cualquiera (Crítico) → decisión 1 lo declara; el mensaje de rechazo se mantiene porque el Intent es que solo el responsable anule.
- **Aceptado** — faltan las cinco reglas por nombre → sección «Reglas de la capacidad».
- **Aceptado** — anuladas previas sin «quién anuló» → no aplica: memoria, sin histórico (decisión 5).
- **Aceptado** — `anuladas` imprime «responsable», redundante hoy → decisión 6.
- **Aceptado** — Scope sin el cambio de datos → Scope lo lista; Intent dice el motivo.
- **Aceptado** — «de cualquiera» sin probar → no hay dueño de reserva (decisión 5); el responsable anula la sembrada.
- **Aceptado** — formato actual de `anuladas` → no existe (decisión 4).

Ronda 1, técnica:
- **Aceptado** — un escenario mezclaba tres comportamientos (Crítico) → un escenario por comportamiento.
- **Aceptado** — `--como` ausente o desconocido sin escenario (Crítico) → escenarios nuevos; decisiones 3 y 8.
- **Aceptado** — rechazo del cliente sin comprobar el estado (Crítico) → comprobación por `anuladas` y un segundo `anular`; sin códigos de salida (decisión 7).
- **Aceptado** — `anuladas` sin describir → decisión 4.
- **Aceptado** — dónde se guarda «quién anuló» → Reglas de la capacidad.
- **Aceptado** — límite de `--como` sin declarar y textos sin listar → decisiones 1, 7 y 8.
- **Aceptado** — tests y llamadores de `anular` → decisión 3.
- **Aceptado** — batería sin filas → tabla en «Dónde se prueba».
- **Aceptado** — `cancelar` sin aclarar → «No entra».

Ronda 2:
- **Aceptado** — «deja de estar activa» sin prueba observable (Crítico) → el escenario lo comprueba con `anuladas`.
- **Aceptado** — la batería usaba `libres`, fuera de la capacidad (Crítico) → se usan `anuladas` y un segundo `anular`.
- **Aceptado** — reserva sembrada sin fixture reproducible (Crítico) → decisión 5.
- **Aceptado** — escenarios con varios WHEN (Crítico) → uno por comportamiento, una fila de batería cada uno.
- **Aceptado** — el valor por defecto cambia el contrato sin declararlo → decisión 3 y riesgo en Scope.
- **Rechazado** — `voidedBy` guarda siempre `responsable` (YAGNI) → el dev-lead pidió que quede quién anuló (decisión 6); el valor sale de `--como`, no de un literal.
- **Aceptado** — choque de terminología con «Cancelación» → «No entra» dice que `cancelar` y su regla de 24 h no cambian.
- **Aceptado** — límites de `--como` y orden de validación → decisión 8; escenarios nuevos, incluido `anuladas --como otro`.
- **Aceptado** — idioma de los identificadores → Reglas de la capacidad.
- **Aceptado** — citas del dev-lead sin literal → solo consta como suyo lo de «Decisiones tomadas con el dev-lead»; las decisiones 1 a 8 son mías y están pendientes de tu validación.

## Decisiones tomadas con el dev-lead

- Review con dos revisores, el de dominio en Sonnet — «he aceptado la review de dos revisores, el de dominio en Sonnet» (2026-11-19).

## Intent

Hoy cualquiera anula cualquier reserva. El responsable de sala debe poder anular cualquiera y ver quién anuló cada una; el cliente no puede ninguna de las dos cosas.

## Scope

- Entra: `anular` con `--como` (`src/app.js`), guardar el rol que anuló en la reserva, y el comando nuevo `anuladas`.
- No entra: `cancelar` y su regla de 24 h (el cliente sigue pudiendo cancelar como hoy), `libres`, autenticación, persistencia en disco.
- Riesgo: sin `--como`, `anular` pasa a rechazar (decisión 3); cualquier llamador externo que no pase rol dejará de anular.

## Dónde se prueba

- Por `run(…)`, en `test/anular.test.js` (fichero nuevo, como `test/cancel.test.js`). Fixture: la reserva sembrada Norte lun 10:00-12:00; estado limpio en cada prueba.

| Escenario | Prueba |
| --- | --- |
| El responsable anula | `anular Norte lun --como responsable` y luego `anuladas --como responsable` |
| El cliente no puede anular | `anular Norte lun --como cliente`, `anuladas --como responsable` y de nuevo `anular Norte lun --como responsable` |
| Sin `--como` | `anular Norte lun` y `anuladas --como responsable` |
| Rol desconocido | `anular Norte lun --como otro`, con `--como Responsable` y con `--como` sin valor |
| Reserva inexistente | `anular Sur mar --como responsable` |
| Reserva ya anulada | `anular Norte lun --como responsable` dos veces |
| El rol se valida antes que la reserva | `anular Sur mar --como cliente` |
| Listado vacío | `anuladas --como responsable` sin anular nada |
| El cliente no ve las anuladas | `anuladas --como cliente` y `anuladas` |
| Rol desconocido al listar | `anuladas --como otro` |

## Reglas de la capacidad

- Dónde vive el dato: campo `voidedBy` de la reserva, en memoria; sin histórico previo, no aplica migración.
- Idioma de los nombres: castellano en los textos de respuesta y en los valores de `--como`; los identificadores internos (`voidedBy`, `bookings`) no son texto de interfaz.
- Límites: `--como` admite solo `cliente` o `responsable`, en minúsculas; repetido, se toma el primero.
- Avisos: `solo el responsable de sala puede anular`, `solo el responsable de sala puede ver las anuladas`, `rol desconocido: usa cliente o responsable`.
- Conflicto: anular una reserva ya anulada responde como una inexistente (`sin reserva <sala> <día>`); el rol se valida antes que la existencia.

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — El responsable anula una reserva

- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun`
- AND `anuladas --como responsable` responde `Norte lun — anulada por responsable`

#### ADDED — El cliente no puede anular

- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como cliente`
- THEN responde `solo el responsable de sala puede anular`
- AND `anuladas --como responsable` responde `sin anuladas`
- AND `anular Norte lun --como responsable` responde `anulada Norte lun`

#### ADDED — Anular sin rol

- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun` sin `--como`
- THEN responde `solo el responsable de sala puede anular`
- AND `anuladas --como responsable` responde `sin anuladas`

#### ADDED — Anular con un rol desconocido

- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como otro`, `--como Responsable` o `--como` sin valor
- THEN responde `rol desconocido: usa cliente o responsable`
- AND `anuladas --como responsable` responde `sin anuladas`

#### ADDED — Anular una reserva inexistente

- GIVEN ninguna reserva de Sur del mar
- WHEN `anular Sur mar --como responsable`
- THEN responde `sin reserva Sur mar`

#### ADDED — Anular una reserva ya anulada

- GIVEN la reserva de Norte del lun ya anulada con `--como responsable`
- WHEN `anular Norte lun --como responsable`
- THEN responde `sin reserva Norte lun`

#### ADDED — El rol se valida antes que la reserva

- GIVEN ninguna reserva de Sur del mar
- WHEN `anular Sur mar --como cliente`
- THEN responde `solo el responsable de sala puede anular`

#### ADDED — Listado sin anuladas

- GIVEN ninguna reserva anulada
- WHEN `anuladas --como responsable`
- THEN responde `sin anuladas`

#### ADDED — El cliente no ve las anuladas

- GIVEN la reserva de Norte del lun anulada con `--como responsable`
- WHEN `anuladas --como cliente`, o `anuladas` sin `--como`
- THEN responde `solo el responsable de sala puede ver las anuladas`

#### ADDED — Listar con un rol desconocido

- GIVEN la reserva de Norte del lun anulada con `--como responsable`
- WHEN `anuladas --como otro`
- THEN responde `rol desconocido: usa cliente o responsable`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
