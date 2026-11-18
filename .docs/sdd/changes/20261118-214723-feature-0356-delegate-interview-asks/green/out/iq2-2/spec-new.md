---
id: 20261118-224954-feature-0012-reservas-sala
feature: 0012
title: Listar las reservas activas de una sala
mode: full
status: draft
created: 2026-11-18
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Listar las reservas activas de una sala

🦆 Hoy no hay forma de ver qué tiene reservado una sala. Con esta feature, `reservas Norte` imprime una línea por cada reserva activa de Norte, por ejemplo `lun 10:00-12:00`, y si no tiene ninguna imprime `sin reservas Norte`. Así el responsable de sala repasa su agenda cada mañana sin preguntar franja por franja. Por dentro es un comando más en `src/app.js`, con la misma forma que `cancelar` y `anular`.

Validación: dev-lead — es un comando que usa una persona y lo que imprime lo tiene que ver ella.

## Capacidades

- Nuevas: `bookings` — qué reservas tiene una sala y cómo se listan.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos (sonnet), más una segunda ronda por dos Críticos aceptados — señales: capacidad nueva · tamaño: ~40 líneas en 3 ficheros (`src/app.js`, un test, esta spec)
- Revisor único (sonnet): si los escenarios se pueden probar con `src/app.js`, donde `bookings` no se exporta, y si el orden y el texto de «sin reservas» contradicen algo de `PRODUCT.md` (señal: capacidad nueva)
- Mínimo razonable: un solo revisor — deja sin cubrir una segunda mirada técnica separada

1. **Sin filtrar por día**: `reservas <sala>` lista las activas de todos los días, con el día en cada línea; no hay «solo hoy». Tu ejemplo lleva el día y el comando solo recibe la sala.
2. **Orden**: por día de la semana (`lun`, `mar`, `mié`, `jue`, `vie`, `sáb`, `dom`) y, dentro del día, por hora de inicio; con el mismo día y la misma hora, en el orden en que se reservó. Un día fuera de esa lista va al final, también en el orden en que se reservó. Es una agenda: se lee de arriba abajo.
3. **«Activa»**: solo cuentan las reservas con estado `active`; las canceladas y las anuladas no salen.
4. **Sala sin reservas o que no existe**: la misma respuesta, `sin reservas <sala>`, con la sala tal como la escribió quien lo pide. Se distingue mayúscula, como en `cancelar`: `reservas norte` imprime `sin reservas norte`. No se consulta `rooms`. Tu texto no cubre la sala inexistente; no la trato como error.
5. **Sin sala** (`reservas` a secas, o con la sala vacía): imprime `uso: reservas <sala>`. Texto inventado por mí. Los argumentos sobrantes (`reservas Norte extra`) se ignoran. Una sala de solo espacios no se recorta: se trata como una sala que no existe.
6. **Cada línea** es `<día> <franja>` tal como están guardados, sin nombre de quien reserva ni de la sala. Los datos no guardan el nombre, y la sala ya va en el comando. `PRODUCT.md` define la reserva «a nombre de quien la pide»; mostrar ese nombre queda fuera hasta que los datos lo guarden.
7. **Capacidad nueva `bookings`**: el slug va en inglés porque lo pide la regla 1 de `capability-template.md`, aunque `PRODUCT.md` marque «booking» como término a evitar en el texto de producto. El contenido de la capacidad va en castellano. Es la primera capacidad del proyecto; las reglas existentes (cancelar, anular, libres) no se vuelcan aquí.
8. **Reglas de la capacidad**: la constitución no tiene «Reglas de producto»; los valores salen de esta spec y están en el delta.
9. **Enfoque**: A (`listBookings` exportada junto a `cancelBooking` y `voidBooking`), frente a B (módulo nuevo) y C (filtrar dentro de `run`). Ver Approach.
10. **Carpeta** `changes/`, como dice el kit, aunque las specs anteriores del proyecto estén en `specs/`; las herramientas leen las dos.
11. **Reserva semanal**: `reservar --cada-semana` hoy solo imprime un mensaje y no guarda nada, así que no sale en el listado. No lo toco.
12. **Datos de los tests**: `src/app.js` exporta el array `bookings` (queda como API del módulo, con su estado mutable) para que los tests siembren reservas; cada test lo vacía (`length = 0`, sin reasignar) y lo vuelve a sembrar. Hoy solo trae `Norte lun 10:00-12:00` y no hay comando que cree más. Sin esa exportación, el orden y la exclusión de otras salas no se pueden probar. Entra en el Scope.
13. **Sin control de rol**: `reservas <sala>` lo puede ejecutar cualquiera, como `cancelar` y `anular` hoy. «Responsable de sala» es quien lo pidió, no un rol del sistema (`PRODUCT.md`: no hay más usuarios).
14. **Delta probado en una copia** de `.docs/sdd` con `sdd capability merge`: sale bien; el `capabilities/` del repo no cambia.
- Política de modelos: revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — Crítico: los escenarios de orden y cancelada partían de datos que no existen y `bookings` no se exporta → decisión 12 y Scope: se exporta `bookings` para sembrar; la cancelada se parte de `cancelar Norte lun`.
- **Aceptado** — Crítico: la anulada iba en un `AND` sin GIVEN propio → escenarios separados de cancelada y de anulada, cada uno desde un estado alcanzable.
- **Aceptado** — slug `bookings` frente a «Evitar: booking» y nombre de quien reserva omitido → decisiones 6 y 7.
- **Aceptado** — sin prueba del día fuera de lista ni del empate → escenario de orden con `mié` y un día desconocido; el empate queda en la decisión 2 y en ese escenario.
- **Aceptado** — sala inexistente y mayúscula dentro de un `AND` → escenarios propios.
- **Aceptado** — `reservas ""` y argumentos sobrantes → decisión 5 y escenario.
- **Aceptado** — separador sin fijar → el THEN lleva la cadena exacta con `\n`.
- **Aceptado** — «no aplica» sin motivo → motivo escrito en las reglas.
- **Aceptado** (2.ª ronda) — el empate y los días desconocidos se probaban con datos ya ordenados → escenario de orden sembrado al revés, con dos días desconocidos.
- **Aceptado** (2.ª ronda) — `reservas Norte extra` iba en un `AND` → escenario propio con su salida exacta.
- **Aceptado** (2.ª ronda) — reinicio de `bookings` entre tests sin fijar → «Dónde se prueba» y decisión 12 lo fijan; exportar el estado reconocido como coste de A en Approach y en Scope.
- **Aceptado** (2.ª ronda) — sala de espacios, rol y review incoherente → decisiones 5 y 13 y bloque de review corregido.
- **Rechazado** (2.ª ronda) — «sala que no existe» redundante con «sin reservas» → se queda: es la prueba de que no se consulta `rooms`, decisión 4.
- **Rechazado** (2.ª ronda) — rama `feature/0012-reservas-sala` frente a la regla 3 → la regla pide `feature/<id>` y la convención del kit añade el slug.
- **Aceptado** — ✋ mezcla decisiones de producto y de proceso, y «siete puntos» → «siete puntos» corregido; 9, 10 y 13 se quedan en la lista porque la plantilla pide que sea exhaustiva.
- **Aceptado** — ninguna prueba siembra una reserva de otra sala → `Sur` sembrada en el primer escenario.

### Decisiones tomadas con el dev-lead

- Comando `reservas <sala>`, una reserva activa por línea como `lun 10:00-12:00`, y `sin reservas <sala>` si no hay — «un comando `reservas <sala>` que lista las reservas activas de la sala, una por línea, como `lun 10:00-12:00`; sin reservas responde `sin reservas <sala>`»
- Para qué: el responsable de sala revisa su agenda cada mañana — «lo quiere el responsable de sala para revisar su agenda cada mañana»

## Intent

Hoy el responsable de sala no tiene cómo ver qué tiene reservado su sala: `libres` dice qué salas quedan libres en una franja, pero no lista lo ocupado. Quiere revisar su agenda cada mañana. Éxito: `reservas Norte` imprime todas sus reservas activas, una por línea y en orden de agenda, y `reservas Sur`, sin reservas, imprime `sin reservas Sur`. Fracaso, aunque funcione: que salgan canceladas o anuladas, o que se mezclen reservas de otra sala.

## Scope

- Entra: el comando `reservas <sala>` en `src/app.js`, su texto de uso, la exportación de `bookings` para los tests (pasa a ser API del módulo) y los tests.
- No entra: filtrar por día o por persona, mostrar quién reserva, un comando para crear reservas, avisos por correo (0008), exportar a calendario (0004), cambiar `cancelar`, `anular`, `libres` o `reservar`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | `git grep -n -i "reservas\b"` fuera de `.docs/sdd/specs`: solo texto de producto (`PRODUCT.md:3`, `README.md:3`, `operations.md:14`) y roadmap; ninguna ocurrencia de un comando `reservas` | no aplica |

- Filas que implementa: nada: comprobado con `git grep -n "0012"` (solo aparece como id reservado; ningún fichero lo nombra).

## Approach

- A. `listBookings(room)` exportada en `src/app.js` y una rama `reservas` en `run` — igual que `cancelBooking`/`voidBooking`; se prueba sola. Cuesta una función más en un fichero ya único, y exportar `bookings` para los tests, que expone su estado.
- B. Módulo nuevo `src/bookings.js` — separa la lógica, pero rompe el fichero único de `architecture.md` y habría que mover o compartir `bookings`.
- C. Filtrar y ordenar dentro de `run` — no añade función, pero mezcla el despacho con la regla y no se prueba sin pasar por `run`.
- Elegido: A — sigue el patrón de `cancelar` y `anular` y respeta el fichero único de `architecture.md`.

`listBookings` filtra por sala y estado `active`, ordena por día y hora de inicio y devuelve las líneas unidas con `\n`; si no hay ninguna devuelve `sin reservas <sala>`. La rama `reservas` de `run` va antes del `return 'salas'` final.

## Dónde se prueba

- Listado, orden, otras salas, no activas, sala sin reservas, sala inexistente, mayúscula y falta de sala: `node --test test/reservas.test.js`, por `run('reservas', [sala])` como `test/cancel.test.js`, comparando la cadena exacta. Cada test vacía el `bookings` exportado y lo siembra de nuevo (decisión 12).
- Cancelada y anulada: se llega con `run('cancelar', ['Norte', 'lun'])` o `run('anular', ['Norte', 'lun'])` y después `run('reservas', ['Norte'])`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Listado de las reservas activas de una sala

- GIVEN las reservas activas `Norte mar 09:00-10:00`, `Norte lun 14:00-15:00`, `Norte lun 10:00-12:00` y `Sur lun 08:00-09:00`
- WHEN se ejecuta `reservas Norte`
- THEN imprime exactamente `lun 10:00-12:00\nlun 14:00-15:00\nmar 09:00-10:00`, una reserva por línea
- AND la reserva de `Sur` no sale

#### ADDED — Orden de la agenda

- GIVEN las reservas activas de `Norte`: `xyz 08:00-09:00`, `abc 07:00-08:00`, `mié 09:00-10:00`, `lun 15:00-17:00` y `lun 15:00-16:00`, en ese orden de reserva
- WHEN se ejecuta `reservas Norte`
- THEN imprime exactamente `lun 15:00-17:00\nlun 15:00-16:00\nmié 09:00-10:00\nxyz 08:00-09:00\nabc 07:00-08:00`
- AND con el mismo día y la misma hora de inicio, manda el orden en que se reservó, y los días fuera de la lista van al final, entre ellos también en el orden en que se reservó

#### ADDED — Una reserva cancelada no se lista

- GIVEN `Norte` con las reservas activas `lun 10:00-12:00` y `mar 09:00-10:00`
- WHEN se ejecuta `cancelar Norte lun` y después `reservas Norte`
- THEN imprime exactamente `mar 09:00-10:00`

#### ADDED — Una reserva anulada no se lista

- GIVEN `Norte` con las reservas activas `lun 10:00-12:00` y `mar 09:00-10:00`
- WHEN se ejecuta `anular Norte lun` y después `reservas Norte`
- THEN imprime exactamente `mar 09:00-10:00`

#### ADDED — Sala sin reservas

- GIVEN `Sur` sin reservas activas
- WHEN se ejecuta `reservas Sur`
- THEN imprime exactamente `sin reservas Sur`

#### ADDED — Sala que no existe

- GIVEN que no hay ninguna sala `Oeste`
- WHEN se ejecuta `reservas Oeste`
- THEN imprime exactamente `sin reservas Oeste`, sin error

#### ADDED — La sala se distingue por mayúscula

- GIVEN `Norte` con la reserva activa `lun 10:00-12:00`
- WHEN se ejecuta `reservas norte`
- THEN imprime exactamente `sin reservas norte`

#### ADDED — El comando exige la sala

- GIVEN cualquier estado de reservas
- WHEN se ejecuta `reservas` sin sala, o con la sala vacía (`reservas ""`)
- THEN imprime exactamente `uso: reservas <sala>`

#### ADDED — Los argumentos sobrantes se ignoran

- GIVEN `Norte` con la reserva activa `lun 10:00-12:00`
- WHEN se ejecuta `reservas Norte extra`
- THEN imprime exactamente `lun 10:00-12:00`

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: en memoria, en `src/app.js` (`operations.md`: sin base de datos)
- **Idioma de los nombres**: castellano; los días se escriben `lun`, `mar`, `mié`, `jue`, `vie`, `sáb`, `dom`
- **Límites**: no aplica: el listado es de solo lectura y no recorta; las reservas duplicadas salen cada una en su línea
- **Avisos**: `sin reservas <sala>` si no hay reservas activas; `uso: reservas <sala>` si falta la sala
- **Regla ante conflicto**: no aplica: el listado no impide ni resuelve solapes, enseña lo guardado

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
