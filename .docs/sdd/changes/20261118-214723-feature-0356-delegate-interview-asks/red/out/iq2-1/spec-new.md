---
id: 20261118-222021-feature-0012-reservas-sala
feature: 0012
title: Comando reservas <sala>
mode: full
status: draft
created: 2026-11-18
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Comando `reservas <sala>`

🦆 El responsable de sala escribe `reservas Norte` y ve su agenda: una línea por reserva activa, como `lun 10:00-12:00`, ordenadas por día de la semana y hora. Las canceladas y las anuladas no salen. Si no queda ninguna, ve `sin reservas Norte`. Por dentro, una función nueva en el fichero único del programa que filtra por sala y estado activo y ordena.

Validación: dev-lead — lo usa una persona cada mañana y lo que ve en la terminal es el producto.

## Capacidades

- Nuevas: `room-bookings` — qué reservas tiene una sala y cómo se consultan.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor — señales: capacidad nueva (`room-bookings`) · tamaño: ~35 líneas en 2 ficheros (`src/app.js`, `test/reservas.test.js`)
- Dominio (sonnet): si «activa» deja fuera de verdad `cancelled` y `voided`, y si los escenarios dan salida exacta con datos (señal: capacidad nueva)
- Mínimo razonable: este mismo — un solo revisor ya es el mínimo; deja sin mirar la lente técnica aparte (el `bookings` exportado, decisión 9, y el orden, decisión 3): un segundo revisor costaría más que ~35 líneas, y la segunda ronda (Críticos aceptados) volvió a leerlo todo
```

Coherencia: el delta sobre una copia de `.docs/sdd` fusiona sin rechazos (`capability merge`: 11 requisitos y 5 reglas añadidos a `room-bookings.md`); el repo no cambia.

1. Capacidad nueva `room-bookings` (no existe ninguna en `capabilities/`). Slug en inglés, contenido en castellano. Los identificadores de código (`roomAgenda`, `bookings`) y el slug en inglés son una excepción deliberada a los términos _Evitar_ de `PRODUCT.md` (`room`, `booking`), porque el código de `src/app.js` ya está en inglés; el texto de la interfaz sigue en castellano.
2. Enfoque: función `roomAgenda(room)` en `src/app.js`, junto a `cancelBooking` y `voidBooking`, frente a un módulo nuevo `src/agenda.js` y frente a listar en el orden en que están guardadas (ver Approach).
3. Orden de las líneas: por día de la semana (`lun`, `mar`, `mié`, `jue`, `vie`, `sáb`, `dom`) y, dentro del día, por hora de inicio y, a igualdad, por la franja completa. Nadie lo dijo; una agenda matinal se lee de arriba abajo.
4. «Activa» = estado `active`. Las canceladas (`cancelled`) y las anuladas (`voided`) no salen.
5. Sala que no existe (`reservas Oeste`): mismo texto que una sala sin reservas, `sin reservas Oeste`. Las órdenes `cancelar` y `anular` tampoco distinguen una sala inexistente.
6. El nombre de la sala distingue mayúsculas, como en `cancelar` y `anular`: `reservas norte` → `sin reservas norte`.
7. Sin argumento (`reservas`): `falta la sala: reservas <sala>`.
8. La línea es `<día> <franja>` y nada más: no sale el nombre de quien reservó.
9. Para probar el orden hace falta una sala con varias reservas y hoy no hay forma de crearlas por `run`: se exporta `bookings` de `src/app.js` como costura de test.
10. Las reservas semanales (`reservar … --cada-semana`) no entran: hoy no se guardan, solo devuelven un texto (`src/app.js`, rama `reservar` de `run`).
11. Sin `§Frontend`: es una terminal, no una pantalla.
12. Las franjas se escriben siempre `HH:MM-HH:MM` con dos dígitos, como las de hoy; con eso el texto ordena como la hora y no se compara numéricamente.
13. Con más de un argumento (`reservas Norte Sur`) solo cuenta el primero, como en `cancelar`. Solo el estado `active` sale; cualquier otro queda fuera.
14. Las reservas viven en memoria y cada ejecución de `node src/app.js` arranca con los datos que carga el programa (hoy, `Norte lun 10:00-12:00`): guardarlas entre ejecuciones no es de esta feature.
- Política de modelos: revisor de la spec, uno en sonnet (más una segunda ronda en sonnet por los Críticos aceptados) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — Crítico: el escenario de orden lo pasa un `sort()` alfabético → días `jue`, `lun`, `dom`, `mar` en el escenario, con dos horas del mismo día fuera de orden.
- **Aceptado** — Crítico: el escenario de mayúsculas no prueba la regla porque Norte estaba vacía → Norte con reserva activa en un escenario propio; la sala inexistente va en otro.
- **Aceptado, en parte** — Crítico: el éxito del Intent por CLI con datos en memoria → el Intent y la decisión 14 dicen qué ve cada ejecución; el programa carga `Norte lun 10:00-12:00` al arrancar, así que `reservas Norte` por CLI sí imprime esa línea, y los demás casos se prueban con `run` y `bookings`.
- **Aceptado** — Importante: día fuera de la lista y franja sin ceros → lo del «día fuera de la lista» se quita de la spec (no puede darse con los datos de hoy); la franja con dos dígitos pasa a la decisión 12.
- **Aceptado** — Importante: exportar `bookings` es un cambio de contrato → entra en el Scope y en «Dónde se prueba».
- **Aceptado** — Importante: argumentos de más y otros estados → decisión 13.
- **Aceptado** — Menor: «canceladas y anuladas» mezclaba dos casos → dos escenarios.
- **Rechazado** — Menor: el gate con `lint.mjs` → es el gate de cierre de `operations.md`; la constitución exige además `node --test`, no lo contradice.
- **Rechazado** — Menor: «falta `PRODUCT.md`» → existe en la raíz del repo, no en `steering/`; el revisor lo buscó donde no va.

Segunda ronda (un revisor, sonnet):

- **Aceptado** — Crítico: «7 requisitos» no cuadraba con el delta → recontado y fusionado otra vez: 11 requisitos y 5 reglas.
- **Aceptado** — Importante: el estado `pending` no lo probaba ningún escenario → entra en el escenario de canceladas y anuladas.
- **Aceptado** — Importante: vaciar `bookings` borraba el dato inicial → cada caso guarda y restaura el estado inicial.
- **Aceptado** — Importante: el paso de `argv` a `run` solo se veía a mano → test con `child_process` en «Dónde se prueba».
- **Aceptado** — Importante: «Límites: no aplica» y falta de control de acceso → «Límites» lista las dos restricciones y dice que no hay control de acceso.
- **Aceptado** — Menor: mismo día y misma hora de inicio → a igualdad, por la franja completa (decisión 3).
- **Aceptado** — Menor: sala inexistente sin datos de Norte, y mayúsculas con dos órdenes en un escenario → GIVEN con Norte y un escenario por grafía.
- **Aceptado, en parte** — Menor: «pura» → «sin efectos»; lente técnica → la cabecera justifica por qué no hay segundo revisor.
- **Aceptado** — Menor: términos _Evitar_ de `PRODUCT.md` → excepción dicha en la decisión 1.

### Decisiones tomadas con el dev-lead

- Comando `reservas <sala>`, una línea por reserva activa como `lun 10:00-12:00`, `sin reservas <sala>` si no hay — «un comando `reservas <sala>` que lista las reservas activas de la sala, una por línea, como `lun 10:00-12:00`; sin reservas responde `sin reservas <sala>`»
- Perfil delegate — «Perfil delegate.»

## Intent

Hoy el responsable de sala no puede ver qué tiene reservado una sala sin mirar el código. Lo necesita cada mañana para revisar su agenda. Éxito: `reservas Norte` imprime las reservas activas de Norte que el programa tiene en memoria (por CLI, hoy, `lun 10:00-12:00`), una por línea, sin ninguna cancelada ni anulada, y una sala vacía lo dice con `sin reservas Norte`. Fracaso aunque funcione: que una reserva cancelada o anulada salga como si siguiera en pie, porque el responsable prepararía la sala para nadie.

## Scope

- Entra: la orden `reservas <sala>` en `src/app.js` y sus tests; exportar `bookings` de `src/app.js` (cambio de contrato del módulo, solo para sembrar los GIVEN de los tests; nada del programa lo importa).
- No entra: reservar, cancelar o anular; filtrar por día; mostrar quién reservó; reservas semanales; fechas concretas (las reservas solo guardan el día de la semana); guardar reservas entre ejecuciones.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada | — | no se retira ni cambia de forma nada |

- Filas que implementa: nada: comprobado con `git grep -nE "0012|reservas |room-bookings"` fuera de `.docs/sdd/changes` (sin hits relevantes: `operations.md:14` habla de reservas en memoria y ROADMAP no tiene fila 0012).

## Approach

- A. Función `roomAgenda(room)` en `src/app.js` y una línea en `run` — una función sin efectos de ~10 líneas, se prueba con `run`. Sigue la estructura de `cancelBooking` y `voidBooking`.
- B. Módulo nuevo `src/agenda.js` — una importación más y un fichero para una sola función; la arquitectura dice «un solo fichero de entrada» y todo el comportamiento vive hoy en `app.js`.
- C. Listar en el orden de `bookings` sin ordenar — menos código, pero el orden depende de cómo se guardaron y la agenda de la mañana saldría desordenada cuando haya varias.
- Elegido: A — es lo que ya hace el proyecto y da el orden que el responsable espera.

`roomAgenda(room)` filtra `bookings` por sala y estado `active`, ordena por día de la semana y por franja (`HH:MM-HH:MM` con dos dígitos, decisión 12), y devuelve las líneas unidas con salto de línea. Si no queda ninguna, devuelve `sin reservas <sala>`. `run('reservas', [])` devuelve `falta la sala: reservas <sala>`.

## Dónde se prueba

- Una reserva, varias y su orden, sin reservas, canceladas y anuladas fuera, sala inexistente, mayúsculas y falta de sala: `run('reservas', [...])` en `test/reservas.test.js`, con el mismo patrón que `test/cancel.test.js`.
- Varias reservas y estados: el test siembra `bookings` exportado (decisión 9); cada caso guarda una copia del estado inicial antes de sembrar y la restaura al terminar, para no depender del orden de los casos.
- Por CLI: un test con `child_process` que ejecuta `node src/app.js reservas Norte` y espera `lun 10:00-12:00`, y `reservas` sin argumento, para cubrir el paso de `argv` a `run`.
- Gate: `node --test && node scripts/lint.mjs`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-bookings`

#### ADDED — La sala lista sus reservas activas

- GIVEN la sala Norte con una reserva activa `lun 10:00-12:00`
- WHEN se ejecuta `reservas Norte`
- THEN sale una línea: `lun 10:00-12:00`

#### ADDED — Las reservas salen ordenadas por día y hora

- GIVEN Norte con las reservas activas, guardadas en este orden: `jue 09:00-10:00`, `lun 15:00-16:00`, `dom 10:00-11:00`, `lun 09:00-10:00`, `mar 08:00-09:00`
- WHEN se ejecuta `reservas Norte`
- THEN salen cinco líneas, en este orden: `lun 09:00-10:00`, `lun 15:00-16:00`, `mar 08:00-09:00`, `jue 09:00-10:00`, `dom 10:00-11:00`

#### ADDED — Una sala sin reservas lo dice

- GIVEN la sala Sur sin ninguna reserva
- WHEN se ejecuta `reservas Sur`
- THEN sale `sin reservas Sur`

#### ADDED — Las canceladas y anuladas no salen

- GIVEN Norte con `lun 10:00-12:00` cancelada, `mar 09:00-10:00` anulada, `jue 09:00-10:00` en estado `pending` y `mié 11:00-12:00` activa
- WHEN se ejecuta `reservas Norte`
- THEN sale solo `mié 11:00-12:00`

#### ADDED — Sin reservas activas, aunque haya canceladas o anuladas

- GIVEN Norte con `lun 10:00-12:00` cancelada y `mar 09:00-10:00` anulada, y ninguna activa
- WHEN se ejecuta `reservas Norte`
- THEN sale `sin reservas Norte`

#### ADDED — Solo salen las reservas de la sala pedida

- GIVEN Norte con `lun 10:00-12:00` y Sur con `mar 09:00-10:00`, ambas activas
- WHEN se ejecuta `reservas Sur`
- THEN sale solo `mar 09:00-10:00`

#### ADDED — El nombre de la sala distingue mayúsculas

- GIVEN Norte con `lun 10:00-12:00` activa
- WHEN se ejecuta `reservas norte`
- THEN sale `sin reservas norte`

#### ADDED — Otra grafía en mayúsculas tampoco coincide

- GIVEN Norte con `lun 10:00-12:00` activa
- WHEN se ejecuta `reservas NORTE`
- THEN sale `sin reservas NORTE`

#### ADDED — Una sala que no existe no tiene reservas

- GIVEN las salas Norte y Sur, con `lun 10:00-12:00` activa en Norte
- WHEN se ejecuta `reservas Oeste`
- THEN sale `sin reservas Oeste`

#### ADDED — Solo cuenta el primer argumento

- GIVEN Norte con `lun 10:00-12:00` activa y Sur sin reservas
- WHEN se ejecuta `reservas Norte Sur`
- THEN sale `lun 10:00-12:00`

#### ADDED — Sin sala, la orden dice cómo se usa

- GIVEN cualquier estado de reservas
- WHEN se ejecuta `reservas` sin argumento
- THEN sale `falta la sala: reservas <sala>`

#### Reglas de la capacidad — room-bookings

- **Dónde viven los datos**: en memoria, como el resto de las reservas (`operations.md`).
- **Idioma de los nombres**: castellano; los días, `lun mar mié jue vie sáb dom`.
- **Límites**: un solo argumento de sala (los demás se ignoran); franjas `HH:MM-HH:MM` con dos dígitos. Sin control de acceso: `operations.md` dice «sin login», cualquiera que ejecute el programa consulta cualquier sala.
- **Avisos**: `sin reservas <sala>` y `falta la sala: reservas <sala>`.
- **Regla ante conflicto**: no aplica.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
