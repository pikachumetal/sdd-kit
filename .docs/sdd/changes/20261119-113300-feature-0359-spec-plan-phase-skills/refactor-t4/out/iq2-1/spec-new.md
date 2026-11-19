---
id: 20261119-145650-feature-0012-reservas-sala
feature: 0012
title: Comando reservas <sala>
mode: full
profile: delegate
status: draft
created: 2026-11-19
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Comando reservas <sala>

🦆 El responsable de sala escribe `reservas Norte` y ve su agenda: una línea por reserva activa, como `lun 10:00-12:00`, ordenadas de lunes a domingo y, dentro de cada día, por hora. Si la sala no tiene reservas, responde `sin reservas Norte`. Por dentro es una función nueva en `src/app.js` que filtra las reservas activas de la sala y las ordena con una lista fija de días, no alfabéticamente.

Validación: dev-lead — lo usa una persona y lo que ve es el texto de la respuesta; el dev-lead comprueba que la agenda se lee bien.

## Capacidades

- Nuevas: `room-bookings` — consulta de las reservas activas de una sala.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva (`room-bookings`) · tamaño: ~25 líneas en 2 ficheros (`src/app.js`, `test/reservas.test.js`)
- Dominio+técnica (sonnet): si el orden `lun…dom` y las franjas `HH:MM-HH:MM` de «Agenda de una sala» cubren los datos reales de `bookings`, y si «Solo reservas activas» deja fuera `voided` igual que `cancelled` (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar el caso de un día no listado (`mié` con tilde) que descolocaría la agenda
```

1. Capacidad nueva `room-bookings` (slug en inglés kebab-case) — no hay `capabilities/` y el comportamiento observable de la consulta debe vivir en una.
2. Enfoque: función pura `listBookings(room)` exportada, como `cancelBooking` (ver Approach), frente a ordenar con `sort()` alfabético y a un filtro genérico por campos.
3. Orden de días por lista fija `lun, mar, mie, jue, vie, sab, dom`, sin tildes — los datos actuales usan `lun`/`mar` sin tilde y no hay otro día en el código. `mié` y `sáb` con tilde quedan descartados hasta que alguien las escriba al reservar. Una reserva con un día que no está en la lista sale al final de la agenda, en el orden en que se guardó, en vez de perderse.
4. Dentro del día, orden por hora de inicio (la franja `HH:MM-HH:MM` con cero a la izquierda ordena bien como texto); dos con la misma hora de inicio conservan el orden en que se guardaron — se deduce de «por hora dentro del día».
5. Sala que no existe (`reservas Oeste`) responde igual que una sala sin reservas: `sin reservas Oeste` — el texto pedido es para «sin reservas» y `cancelar` tampoco distingue la sala inexistente.
6. Sin argumento (`reservas`) responde `falta la sala: reservas <sala>` — nadie dijo qué hacer, y sin ello saldría `sin reservas undefined`.
7. El nombre de la sala se compara exacto, con mayúsculas (`Norte`) — igual que `cancelar` y `anular`.
8. Solo cuentan las reservas con estado `active`; canceladas y anuladas no salen — «reservas activas» lo dijo el dev-lead, y es el criterio de `libres` y `cancelar`.
9. Las líneas van separadas por salto de línea en una sola respuesta de `run` — una por línea, como se pidió.

- Reglas de la capacidad (5 bis): datos en memoria, en el array `bookings` de `src/app.js` con los campos que ya usan `cancelar` y `anular` (`room`, `day`, `slot`, `status`), sin contrato nuevo; nombres de salas y días en castellano, de la interfaz; sin límites; avisos `sin reservas <sala>` y `falta la sala: reservas <sala>`; ante conflicto, el orden de guardado. Todo ello sin sección propia en el delta: no cambia ningún dato vigente.
10. Sin control de acceso: cualquiera puede ejecutar `reservas`, como `libres`; «responsable de sala» es quien lo usa, no un rol que el comando compruebe — `PRODUCT.md` no define permisos de lectura.
11. Nombres en inglés (`room-bookings`, `listBookings`): el slug lo exige la plantilla y `listBookings` sigue a `cancelBooking` y `voidBooking`; el glosario de `PRODUCT.md` evita «booking» en el texto al usuario, y ahí todo va en castellano.
- Fusión del delta probada en una copia de `.docs/sdd`: `room-bookings.md: añadido` ×4 (Agenda de una sala, Solo reservas activas, Sala sin reservas, Falta la sala), sin rechazos; `capabilities/` del repo intacto. `git grep` de `reservas <sala>`, `listBookings` y `falta la sala` fuera de la carpeta del cambio: sin coincidencias, no hay nada que retirar.
- Política de modelos: revisores de la spec según el nivel que fije la review · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar.

### Hallazgos de la review

1. **Aceptado** — sala inexistente mezclada con sala vacía y sin escenario → escenario propio «Sala que no existe o con otro nombre» (incluye `reservas norte`); el «No entra» dice que no hay error distinto.
2. **Aceptado** — el escenario de orden pasaba con un orden alfabético → el GIVEN trae `dom` y `jue`, guardados desordenados, y dos reservas en `lun`.
3. **Aceptado** — solo se probaba `cancelled` → el GIVEN añade una `voided`.
4. **Aceptado** — mayúsculas y desempate sin cubrir → escenario de `norte` y decisión 4 (misma hora conserva el orden guardado).
5. **Aceptado** — día no listado sin comportamiento → decisión 3: al final, en orden de guardado; ya no queda pendiente.
6. **Aceptado** — datos y campos sin declarar → línea de reglas 5 bis en ✋: `bookings` de `src/app.js`, campos existentes.
7. **Aceptado** — las cinco reglas sin declarar → misma línea; sin sección propia, porque no cambia ningún dato vigente.
8. **Aceptado** — nombres en inglés frente al glosario → decisión 11 y nota en Términos.
9. **Rechazado** — «dev-lead» y «responsable de sala» no son roles del producto → el kit llama dev-lead a quien aprueba y valida; añadida la decisión 10: sin control de acceso.
10. **Aceptado** — aclarar el bloque de review y el `grep` del ROADMAP → el mínimo razonable dice «sin review» como alternativa, no como lo hecho; el `grep` solo comprueba que ninguna fila nombra el comando.
- Sin segunda ronda: ningún Crítico, y la decisión central (función con orden por lista fija) no cambia.

### Decisiones tomadas con el dev-lead

- Comando, formato de línea, orden lunes-domingo y por hora, y texto de sin reservas — «un comando `reservas <sala>` que lista las reservas activas de la sala, una por línea, como `lun 10:00-12:00`, de lunes a domingo y por hora dentro del día; sin reservas responde `sin reservas <sala>`»
- Motivo — «lo quiere el responsable de sala para revisar su agenda cada mañana»
- Perfil delegate — «Perfil delegate»

## Intent

Hoy no hay forma de ver las reservas de una sala: `libres` solo dice qué salas están libres en una franja. El responsable de sala necesita revisar su agenda cada mañana sin preguntar franja a franja. Éxito: `reservas <sala>` enseña todas las reservas activas de esa sala, completas y en orden de agenda. Anti-goal: que el orden salga alfabético (`jue` antes de `lun`) o que se cuelen reservas canceladas o anuladas.

## Scope

- Entra: comando `reservas <sala>`; filtro por reservas activas; orden por día de la semana y hora; texto `sin reservas <sala>`; respuesta a la falta de argumento.
- No entra: filtrar por día o rango, reservar o cancelar desde este comando, mostrar quién reservó, listar canceladas o anuladas, un error distinto para una sala que no existe (responde como sin reservas), control de acceso.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada | — | — |

- Filas que implementa: nada: comprobado con `grep -n reservas ROADMAP.md` (la feature no tiene fila previa; solo nombra reservas en otras filas)

## Approach

- A. `listBookings(room)` exportada, con una lista fija de días para ordenar — una función pura, se prueba sola, mismo patrón que `cancelBooking`/`voidBooking`.
- B. Ordenar con `sort()` sobre el texto del día — descartado: pone `jue` antes de `lun`, rompe el orden pedido.
- C. Un buscador genérico de reservas por campos que `reservas` y `libres` compartan — descartado: amplía el alcance sin que nadie lo pida.
- Elegido: A — la más corta que cumple el orden pedido sin tocar `libres`.

`run('reservas', [sala])` llama a `listBookings`; si no hay sala devuelve el aviso, si no hay reservas activas devuelve `sin reservas <sala>`, y si las hay las une con `\n`.

## Dónde se prueba

- Agenda ordenada, sin reservas, estados no activos, sin argumento: `test/reservas.test.js`, por `run('reservas', …)`, como `test/cancel.test.js`.

## Términos y ADR

- Términos resueltos: ninguno (los nombres de código en inglés siguen al resto de `src/app.js`; ver decisión 11)
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-bookings`

#### ADDED — Agenda de una sala

- GIVEN la sala Norte con reservas activas guardadas en este orden: `dom 09:00-10:00`, `jue 09:00-10:00`, `lun 14:00-15:00`, `mar 09:00-10:00`, `lun 10:00-12:00`
- WHEN se ejecuta `reservas Norte`
- THEN responde cinco líneas, en este orden: `lun 10:00-12:00`, `lun 14:00-15:00`, `mar 09:00-10:00`, `jue 09:00-10:00`, `dom 09:00-10:00`
- AND el orden es el de la semana, no alfabético: un orden alfabético pondría `dom` y `jue` antes de `lun`

#### ADDED — Solo reservas activas

- GIVEN Norte con `lun 10:00-12:00` activa, `mar 09:00-10:00` cancelada y `mie 09:00-10:00` anulada
- WHEN se ejecuta `reservas Norte`
- THEN responde solo `lun 10:00-12:00`

#### ADDED — Sala sin reservas

- GIVEN Sur sin reservas activas
- WHEN se ejecuta `reservas Sur`
- THEN responde `sin reservas Sur`

#### ADDED — Sala que no existe o con otro nombre

- GIVEN solo existen las salas Norte y Sur
- WHEN se ejecuta `reservas Oeste` o `reservas norte`
- THEN responde `sin reservas Oeste` o `sin reservas norte`, igual que una sala sin reservas: el nombre se compara exacto

#### ADDED — Falta la sala

- GIVEN cualquier estado de las reservas
- WHEN se ejecuta `reservas` sin sala
- THEN responde `falta la sala: reservas <sala>`

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
