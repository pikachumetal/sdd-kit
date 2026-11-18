---
id: 20261118-231556-feature-0012-reservas-sala
feature: 0012
title: Listar las reservas de una sala
mode: full
profile: delegate
status: draft
created: 2026-11-19
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Listar las reservas de una sala

🦆 Hoy el responsable de sala no puede ver qué tiene reservado una sala sin probar franja a franja con `libres`. Con este cambio escribe `reservas Norte` y ve su agenda: una línea por reserva activa, como `lun 10:00-12:00`; si no hay ninguna, `sin reservas Norte`. Por dentro, un comando nuevo que filtra las reservas activas de la sala y las ordena por día y hora.

Validación: dev-lead — lo usa una persona en la terminal cada mañana; conviene que lo vea con sus propias salas.

## Capacidades

- Nuevas: `room-bookings` — consulta de las reservas activas de una sala

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva · tamaño: ~30 líneas en 2 ficheros
- Dominio (sonnet): si «activa» excluye de verdad canceladas y anuladas (los dos estados que hoy existen en `src/app.js`) y si los THEN cubren sala sin reservas y sala desconocida (señal: capacidad nueva)
- Técnica: no se despacha; la cubre el mismo revisor con los siete puntos
- Mínimo razonable: sin review — deja sin mirar si el orden y el texto de «sala desconocida» contradicen lo que ya hace el resto de comandos

1. Capacidad nueva `room-bookings` (kebab-case en inglés: es nombre de fichero) — no existe ninguna en `capabilities/` y el comando abre un comportamiento propio.
2. Activa = estado `active`; las canceladas (`cancelled`) y anuladas (`voided`) no salen — el glosario las distingue de la reserva viva y a quien revisa su agenda le estorban.
3. Orden: por día de la semana (`lun`, `mar`, `mie`, `jue`, `vie`, `sab`, `dom`) y, dentro del día, por hora de inicio — nadie lo dijo; es el orden en que se lee una agenda.
4. Se listan todas las reservas activas de la sala, no solo las de hoy — la petición dice «las reservas activas de la sala», y las reservas guardan el día de la semana, no una fecha.
5. Una sala que no existe responde igual que una sin reservas: `sin reservas Oeste` — `cancelar` tampoco distingue salas desconocidas (`sin reserva Sur mar`). **Pendiente de tu visto bueno**: oculta un error de tecleo; la alternativa es un mensaje propio como `sala desconocida Oeste`.
6. `reservas` sin sala responde `uso: reservas <sala>` — texto mío, literal; **pendiente de tu visto bueno**.
7. La sala se compara tal cual se escribe (`Norte`, con mayúscula), como hacen `cancelar` y `libres`: `reservas norte` responde `sin reservas norte` (escenario propio) — **pendiente de tu visto bueno**, mismo riesgo que la 5.
8. Enfoque: función pura `formatAgenda(room, bookings)` exportada, frente a filtrar dentro de `run` y frente a un módulo nuevo (ver Approach).
9. Separador de líneas: salto de línea (`\n`) — una reserva por línea, como pide la petición.
- Repaso de coherencia: el delta probado sobre una copia de `.docs/sdd` (`sdd capability merge`, salida 0: cinco requisitos añadidos a `room-bookings.md`); `git grep reservas` solo da filas del roadmap que usan la palabra (0011, 0007, 0004), ninguna nombra este comando.

### Hallazgos de la review

- **Aceptado** — Importante: el escenario de anuladas/canceladas solo probaba una anulada → el GIVEN lleva una anulada y una cancelada.
- **Aceptado** — Importante: orden de días sin cubrir fines de semana, y hora sin formato fijo → escenario `vie`/`sab`/`dom` nuevo y `HH:MM` fijado en las reglas.
- **Aceptado** — Importante: faltaba «Reglas de la capacidad» → añadida con las cinco reglas.
- **Aceptado** — Importante: sala desconocida oculta un error de tecleo → sigue como decidí, pero marcada «pendiente de tu visto bueno» (5) con la alternativa.
- **Aceptado** — Importante: mayúsculas daban un silencio engañoso → escenario propio `reservas norte` y marca «pendiente» (7).
- **Aceptado** — Menor: `uso: reservas <sala>` seguía cerrado en el delta → se mantiene «pendiente» en la 6.
- **Aceptado** — Menor: sala desconocida solo era un AND → ADDED propio.
- **Rechazado** — Menor: pasar «reserva activa» al glosario de `PRODUCT.md` → lo escribe el cierre (Términos resueltos); los estados `active`/`cancelled`/`voided` los verifiqué en `src/app.js`.
- **Aceptado** — Menor: el Intent prometía «cada mañana» sin fecha → dice «agenda semanal de la sala».
- **Aceptado** — Menor: la reserva semilla no estaba fijada → fijada en «Dónde se prueba».
- Delta repetido sobre una copia: ver resultado en la línea de coherencia de arriba.
- Política de modelos: revisores de la spec: uno, sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Carril feature, perfil delegate — «carril feature: … Perfil delegate»
- Formato de salida y respuesta vacía — «una por línea, como `lun 10:00-12:00`; sin reservas responde `sin reservas <sala>`»

## Intent

Hoy no hay forma de ver la agenda de una sala: `libres <franja>` solo dice qué salas están libres en una franja concreta. El responsable de sala quiere revisar su agenda cada mañana de un vistazo; como las reservas guardan el día de la semana y no una fecha, lo que ve es la agenda semanal de la sala. El éxito es que `reservas Norte` devuelva exactamente sus reservas activas, una por línea y en orden de lectura, y que una sala sin reservas lo diga en vez de quedarse en silencio. Fracasaría si mostrara reservas canceladas o anuladas como vivas: el responsable prepararía la sala para una reserva que ya no existe.

## Scope

- Entra: comando `reservas <sala>` con la lista de reservas activas, el mensaje `sin reservas <sala>` y el uso sin sala.
- No entra: filtrar por día o por fecha, mostrar quién reservó, listar canceladas o anuladas, reservas de varias salas a la vez, tolerar mayúsculas.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | comprobado: es un comando nuevo; `run` mantiene su respuesta por defecto `salas` para comandos desconocidos |

- Filas que implementa: nada: comprobado con `git grep -n "reservas" -- ROADMAP.md PRODUCT.md README.md src` (ninguna fila del roadmap lo nombra)

## Approach

- Función pura `formatAgenda(room, bookings)` exportada de `src/app.js` — se prueba con datos propios (varios días, estados mezclados), que el estado en memoria no permite montar; `run` solo la llama con `bookings`.
- Filtrar dentro de `run` — menos código, pero el orden y los estados solo se podrían probar con la única reserva semilla.
- Módulo nuevo `src/agenda.js` — rompe «un solo fichero de entrada» de `architecture.md` por una función de diez líneas.
- Elegido: función pura en `src/app.js` — probable con datos y respeta la arquitectura de un solo fichero.

`formatAgenda` filtra por sala y `status === 'active'`, ordena por día (lun…dom) y luego por inicio de franja, y une con `\n`; sin resultados devuelve `sin reservas <sala>`. `run('reservas', params)` sin `params[0]` devuelve `uso: reservas <sala>`.

## Dónde se prueba

- Lista con datos, orden y exclusión de canceladas/anuladas: unitario de `formatAgenda` en `test/app.test.js`, con reservas propias.
- Sala sin reservas y sala desconocida: unitario de `formatAgenda`.
- Comando completo: `run('reservas', ['Norte'])` → `lun 10:00-12:00` y `run('reservas', ['Sur'])` → `sin reservas Sur`, con la reserva semilla (Norte, lun, 10:00-12:00, activa), como los tests actuales de `run`.
- Sin sala: `run('reservas', [])`.

## Términos y ADR

- Términos resueltos: reserva activa — la que no está cancelada ni anulada
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-bookings`

#### ADDED — Las reservas activas de una sala se listan una por línea

- GIVEN la sala Norte con reservas activas `mar 09:00-10:00` y `lun 10:00-12:00`, y una cancelada `lun 08:00-09:00`
- WHEN se ejecuta `reservas Norte`
- THEN responde dos líneas, `lun 10:00-12:00` y `mar 09:00-10:00`, en ese orden

#### ADDED — Dentro de un día se ordena por hora de inicio

- GIVEN la sala Sur con reservas activas `mie 14:00-15:00` y `mie 09:00-10:00`
- WHEN se ejecuta `reservas Sur`
- THEN responde `mie 09:00-10:00` y después `mie 14:00-15:00`

#### ADDED — Los fines de semana se ordenan tras los laborables

- GIVEN la sala Norte con reservas activas `dom 10:00-11:00`, `sab 09:00-10:00` y `vie 16:00-17:00`
- WHEN se ejecuta `reservas Norte`
- THEN responde `vie 16:00-17:00`, `sab 09:00-10:00` y `dom 10:00-11:00`, en ese orden

#### ADDED — Las anuladas y canceladas no se listan

- GIVEN la sala Norte con una reserva anulada `lun 10:00-12:00`, una cancelada `mar 09:00-10:00` y ninguna activa
- WHEN se ejecuta `reservas Norte`
- THEN responde `sin reservas Norte`

#### ADDED — Una sala sin reservas lo dice

- GIVEN la sala Sur sin reservas
- WHEN se ejecuta `reservas Sur`
- THEN responde `sin reservas Sur`

#### ADDED — Una sala desconocida responde como una sin reservas

- GIVEN que no existe ninguna sala `Oeste`
- WHEN se ejecuta `reservas Oeste`
- THEN responde `sin reservas Oeste`

#### ADDED — La sala se distingue por mayúsculas

- GIVEN la sala Norte con una reserva activa `lun 10:00-12:00`
- WHEN se ejecuta `reservas norte`
- THEN responde `sin reservas norte`

#### ADDED — Sin sala indica el uso

- GIVEN cualquier estado
- WHEN se ejecuta `reservas` sin argumentos
- THEN responde `uso: reservas <sala>`

#### Reglas de la capacidad — room-bookings

- **Dónde viven los datos**: en memoria, en `src/app.js` (las reservas no se persisten)
- **Idioma de los nombres**: castellano en los textos de salida; el nombre de la capacidad, en inglés
- **Límites**: sin tope de líneas; la hora va como `HH:MM` con cero a la izquierda, tal como se guarda la franja
- **Avisos**: `sin reservas <sala>` y `uso: reservas <sala>`
- **Regla ante conflicto**: una sala desconocida equivale a una sala sin reservas

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
