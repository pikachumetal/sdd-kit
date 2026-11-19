---
id: 20261118-224613-feature-0012-reservas-sala
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

🦆 El responsable de sala escribe `reservas Norte` y ve su agenda, una reserva activa por línea: `lun 10:00-12:00`. Si la sala no tiene ninguna, ve `sin reservas Norte`. Las reservas canceladas y las anuladas no salen. Las líneas van en orden de semana (lunes primero) y, dentro del día, por hora. Por dentro es un comando nuevo que lee la lista de reservas que ya existe, sin tocar nada.

Validación: dev-lead — lo que el responsable de sala lee en la terminal lo tiene que ver una persona.

## Capacidades

- Nuevas: `room-bookings` — consultar las reservas de una sala.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor por ronda (sonnet, las dos lentes: dominio y técnica), con segunda ronda por dos Críticos aceptados — señales: capacidad nueva (`room-bookings`) · tamaño: ~40 líneas en 3 ficheros (`src/app.js`, `test/reservas.test.js`, la capacidad)
- Dominio+técnica (sonnet): si cada THEN de `room-bookings` se puede ejecutar con los datos que la semilla de `src/app.js` y la lista inyectada de `listBookings` dan de verdad, y si el orden de la decisión 3 está cubierto por un escenario con datos (señal: capacidad nueva)
- Mínimo razonable: el mismo, un solo revisor — deja sin mirar un segundo par de ojos sobre el orden y los bordes del argumento, que es donde la primera ronda encontró dos Críticos

### Hallazgos de la review

- **Aceptado** — Crítico: el escenario de listar no se puede ejecutar con la semilla (solo `lun 10:00-12:00` en Norte) → el escenario dice que las reservas vienen dadas (en los tests, lista inyectada en `listBookings`) y se añade otro, por `run` con la semilla.
- **Aceptado** — Crítico: el orden por franja no está cubierto → nuevo escenario «Orden dentro del día» con `lun 14:00-15:00` insertada antes que `lun 10:00-12:00`; la decisión 3 declara que las franjas se escriben `HH:MM` con cero a la izquierda (supuesto mío).
- **Aceptado** — sala sin reservas y sala inexistente compartían escenario → dos escenarios.
- **Aceptado** — argumento vacío o de más → decisión 5: solo cuenta el primer argumento y una cadena vacía es «falta la sala»; escenario añadido.
- **Aceptado** — `norte` en minúscula sin escenario → escenario `reservas norte` → `sin reservas norte`.
- **Aceptado** — día desconocido sin escenario → el escenario «Orden dentro del día y de la semana» incluye `xyz`; el empate se resolvió en la segunda ronda.
- **Aceptado** — «sin tope de líneas» no estaba en ✋ → decisión 9.
- **Aceptado** — nadie dijo quién puede ejecutarlo → decisión 10 (cualquiera con acceso a la terminal; los permisos son la fila 0011), no como sexta regla de la capacidad: las reglas son cinco fijas.
- **Rechazado** — identificadores `booking`/`room` en el código → son los del fichero actual (`bookings`, `room`); la interfaz solo dice «reserva» y «sala». No hace falta una decisión.
- **Aceptado** — Scope: la fecha concreta no entra → añadido a «No entra».

Segunda ronda (un revisor, sonnet):

- **Aceptado** — Crítico: el empate (mismo día y franja) no se distingue en la salida, porque las dos líneas salen idénticas → se quita el AND del escenario y la regla de conflicto pasa a «no aplica».
- **Aceptado** — la decisión 4 se atribuía a tu frase → reescrita como extensión mía.
- **Aceptado** — `active` sale de `src/app.js`, no de `PRODUCT.md`; las filas 0010 y 0011 se citan con lo que de verdad dicen → decisiones 7 y 10 reescritas.
- **Aceptado** — el WHEN del orden decía `reservas Norte` sin aclarar la lista inyectada → ahora es `listBookings('Norte', lista)`; los de semilla siguen por `run`.
- **Aceptado** — varios días desconocidos y franjas mal formadas → decisión 3: los desconocidos van al final en orden de inserción y la franja mal formada no se valida (deuda ya anotada en `debt.md`).
- **Aceptado** — argumento de solo espacios → decisión 5: se trata como un nombre de sala y no se prueba.
- **Aceptado** — `Este` y `norte` en un solo escenario → dos escenarios.
- **Aceptado** — lentes contradictorias entre el bloque y la política de modelos → unificadas.
- **Aceptado** — el grep de coherencia omitía `ROADMAP.md` y la 0012 no tiene fila → corregido en «Lo que se retira o cambia de forma».
- **Rechazado** — «cada mañana» como motivación inventada → la dijiste tú en tu petición («para revisar su agenda cada mañana»).

1. Capacidad nueva `room-bookings` (slug en inglés, contenido en castellano) — ningún requisito existente cubre consultar reservas, y no cabe en otra capacidad (no hay ninguna).
2. Enfoque: función pura `listBookings(room, source = bookings)` exportada, frente a filtrar dentro de `run` o a un módulo nuevo (ver Approach).
3. Orden de salida: por día de la semana (`lun mar mie jue vie sab dom`) y, dentro del día, por franja en orden de texto, con las horas escritas `HH:MM` con cero a la izquierda (`09:00-10:00` antes que `10:00-12:00`). Un día fuera de esa lista va al final, en orden de inserción entre ellos; una franja que no sea `HH:MM-HH:MM` no se valida (deuda ya anotada). — la agenda de la mañana se lee de arriba abajo. La grafía de miércoles y sábado sin tilde y el formato `HH:MM` son suposiciones mías: hoy solo hay datos de `lun` y `mar`, con horas de dos cifras.
4. Sala que no existe (`reservas Este`) → `sin reservas Este`, igual que una sala sin reservas. — tu frase solo cubre la sala sin reservas; esto lo extiendo yo, y no distinguir evita inventar un segundo mensaje.
5. Sin argumento (`reservas`) o con una cadena vacía (`reservas ""`) → `uso: reservas <sala>`; con argumentos de más (`reservas Norte Sur`) solo cuenta el primero; un argumento de solo espacios se trata como un nombre de sala más y no se prueba. — nadie dijo qué hacer; este texto y esta regla son míos.
6. El nombre de la sala se compara exacto, con mayúscula inicial (`Norte`, no `norte`), como ya hacen `cancelar` y `anular`. — coherencia con los comandos existentes.
7. «Activa» es el estado `active` de la reserva en `src/app.js`: canceladas (`cancelled`) y anuladas (`voided`) no salen y no se avisa de ellas. — `PRODUCT.md` define cancelación y anulación pero no «activa»; el listado de canceladas queda fuera, la fila 0010 solo lo menciona de pasada.
8. La línea es solo `<día> <franja>`: no lleva sala, ni quién reservó, ni la marca de reserva semanal. — es el formato que diste; la sala ya va en el comando.
9. Sin tope de líneas. — una sala tiene pocas reservas activas; un tope sería una regla que nadie pidió.
10. Cualquiera con acceso a la terminal puede ejecutar `reservas`; no hay control de rol. — es una consulta que no cambia nada; los permisos del responsable sobre reservas ajenas son la fila 0011.
- Delta probado sobre una copia de `.docs/sdd`: `sdd capability merge` añade 8 requisitos y 5 reglas a `room-bookings`; `sdd capability check` → «Capacidades válidas: 1», sin avisos.
- Política de modelos: revisor de la spec en sonnet (un revisor con las dos lentes; no hay reglas de rol ni de flujo que pidan opus) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Comando `reservas <sala>`, una reserva activa por línea como `lun 10:00-12:00` y `sin reservas <sala>` si no hay — «un comando `reservas <sala>` que lista las reservas activas de la sala, una por línea, como `lun 10:00-12:00`; sin reservas responde `sin reservas <sala>`»

## Intent

Hoy el responsable de sala no puede ver las reservas de su sala desde la terminal: `libres` solo dice qué salas quedan libres en una franja. Quiere revisar su agenda cada mañana con un comando. Éxito: `reservas Norte` imprime exactamente sus reservas activas, sin ruido, y `sin reservas Norte` cuando no hay. Fracaso aunque «funcione»: que salgan reservas canceladas o anuladas, y el responsable se presente a una reunión que ya no existe.

## Scope

- Entra: el comando `reservas <sala>` (lista, mensaje de sala sin reservas, mensaje de uso).
- No entra: filtrar por día, listar canceladas o anuladas (fila 0010), mostrar quién reservó o la fecha concreta (solo sale el día de la semana), crear o cambiar reservas, exportar a calendario (fila 0004), permisos del responsable sobre reservas ajenas (fila 0011).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada | — | — |

- Filas que implementa: nada: comprobado con `git grep -niE "reservas|0012|listar"` fuera de `.docs/sdd/specs` y `.docs/sdd/changes`; solo aparece la prosa de `PRODUCT.md`, `README.md`, `operations.md` y `CHANGELOG.md`, y las filas 0004, 0007 y 0011 de `ROADMAP.md`, sin ningún comando ni lista de comandos que haya que actualizar. La 0012 no tiene fila en `ROADMAP.md`: el id sale de `sdd id next --reserve`.

## Approach

- **A. Función pura `listBookings(room, source = bookings)` exportada desde `src/app.js`**, que `run` llama para `reservas`. Cuesta una función más; se prueba sola con una lista inyectada (hoy solo hay una reserva de semilla y no hay comando para crear otras).
- B. Filtrar dentro de `run`. Cuesta menos código, pero el orden y los estados solo se pueden probar con la semilla de una sola reserva.
- C. Módulo nuevo `src/bookings.js`. Rompe «un solo fichero de entrada» de `architecture.md` sin necesidad.
- Elegido: A — permite probar el orden y la exclusión de canceladas y anuladas con datos propios, y respeta la arquitectura de un solo fichero.

Partes del cómo: `listBookings` filtra por `room` y `status === 'active'`, ordena por (índice del día en `lun…dom`, franja) y devuelve las líneas `<día> <franja>` unidas por `\n`; sin resultados devuelve `sin reservas <sala>`. `run('reservas', [])` devuelve `uso: reservas <sala>`.

## Dónde se prueba

- Lista, orden y exclusión de canceladas y anuladas: unitarios de `listBookings` con lista inyectada, en `test/reservas.test.js`, como los demás tests de `node --test`.
- Comando por la entrada real: `run('reservas', ['Norte'])` con la semilla (`lun 10:00-12:00`) → `lun 10:00-12:00`, como `test/cancel.test.js`.
- `sin reservas`, sala desconocida (también en minúscula), uso, argumento vacío y argumentos de más: por `run`, mismo patrón.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-bookings`

#### ADDED — Listar las reservas activas de una sala

- GIVEN la sala Norte con las reservas activas `mar 09:00-10:00` y `lun 10:00-12:00`, una reserva `lun 14:00-15:00` cancelada, una `mie 09:00-10:00` anulada y una `lun 10:00-12:00` activa de la sala Sur
- WHEN se ejecuta `reservas Norte` (en los tests, con esa lista inyectada en `listBookings`: la semilla de la aplicación solo tiene una)
- THEN la salida son dos líneas, en este orden: `lun 10:00-12:00` y `mar 09:00-10:00`
- AND las reservas de otras salas no salen

#### ADDED — Reservas de la semilla

- GIVEN la semilla de la aplicación (Norte con `lun 10:00-12:00` activa)
- WHEN se ejecuta `reservas Norte`
- THEN la salida es `lun 10:00-12:00`

#### ADDED — Orden dentro del día y de la semana

- GIVEN la sala Norte con las reservas activas, insertadas en este orden: `mie 09:00-10:00`, `lun 14:00-15:00`, `lun 10:00-12:00`, `dom 08:00-09:00` y `xyz 07:00-08:00`
- WHEN se ejecuta `listBookings('Norte', lista)` con esa lista inyectada
- THEN la salida son cinco líneas, en este orden: `lun 10:00-12:00`, `lun 14:00-15:00`, `mie 09:00-10:00`, `dom 08:00-09:00`, `xyz 07:00-08:00`
- AND los días fuera de la semana (`xyz`) van al final, en orden de inserción entre ellos

#### ADDED — Sala sin reservas activas

- GIVEN la sala Sur sin reservas activas
- WHEN se ejecuta `reservas Sur`
- THEN la salida es `sin reservas Sur`

#### ADDED — Sala que no existe

- GIVEN las salas Norte y Sur (Este no existe)
- WHEN se ejecuta `reservas Este`
- THEN la salida es `sin reservas Este`

#### ADDED — La sala se escribe como se llama

- GIVEN la semilla de la aplicación (Norte con `lun 10:00-12:00` activa)
- WHEN se ejecuta `reservas norte` (minúscula)
- THEN la salida es `sin reservas norte`

#### ADDED — Falta la sala

- GIVEN cualquier estado de las reservas
- WHEN se ejecuta `reservas` sin sala, o `reservas ""`
- THEN la salida es `uso: reservas <sala>`

#### ADDED — Argumentos de más

- GIVEN la semilla de la aplicación
- WHEN se ejecuta `reservas Norte Sur`
- THEN la salida es `lun 10:00-12:00`, como con `reservas Norte`

#### Reglas de la capacidad — room-bookings

- **Dónde viven los datos**: en memoria, la lista de reservas de la aplicación (`operations.md`).
- **Idioma de los nombres**: castellano en los mensajes; el comando es `reservas`.
- **Límites**: sin tope de líneas; con argumentos de más solo cuenta el primero.
- **Avisos**: `sin reservas <sala>` si no hay ninguna activa; `uso: reservas <sala>` si falta la sala.
- **Regla ante conflicto**: no aplica.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
