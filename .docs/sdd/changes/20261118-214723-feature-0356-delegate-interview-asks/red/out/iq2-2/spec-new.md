---
id: 20261118-222532-feature-0012-reservas-sala
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

🦆 El responsable de sala podrá escribir `reservas Norte` cada mañana y ver sus reservas en pie, una por línea y en orden de semana: `lun 10:00-12:00`, `mar 09:00-10:00`. Las canceladas y las anuladas no salen, y una sala sin reservas responde `sin reservas Norte`. Una sala mal escrita también responde `sin reservas`, así que una errata parece una sala libre. Se añade una función de listado junto a las de cancelar y anular, sin tocar nada más. Falta que valides las decisiones de abajo, sobre todo el orden y las respuestas que he escrito yo.

Validación: dev-lead — es un comando que el responsable de sala usa y lee; un humano ve su salida.

## Capacidades

- Nuevas: `room-bookings` — qué reservas de una sala se listan y con qué formato.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor y una segunda ronda con otro (hubo Críticos aceptados) — señales: capacidad nueva (`room-bookings`) · tamaño: ~15 líneas en 2 ficheros (`src/app.js` y un test nuevo)
- Dominio+técnica (sonnet, despachada): si los THEN fijan el orden, la sala desconocida y la falta de argumento, y si «activa» coincide con el estado `active` que ya usan `cancelar` y `anular` (señal: capacidad nueva)
- Mínimo razonable: un revisor ya es el mínimo defendible; dos lentes no se justifican con ~15 líneas y ningún `MODIFIED`. Deja sin lente aparte la técnica (la costura de test de la decisión 1)

1. Enfoque: una función `listBookings(room, store)` en `src/app.js` junto a `cancelBooking` y `voidBooking`, frente a un módulo aparte y a pintar la lista dentro de `run` (ver Approach). `store` es el almacén de reservas, por defecto el de la aplicación: así un test le pasa sus propias reservas.
2. Capacidad nueva `room-bookings`: el proyecto no tiene capacidades y este es el primer comportamiento que se documenta.
3. **Orden de las líneas**: por día de la semana (`lun`, `mar`, `mié`, `jue`, `vie`, `sáb`, `dom`) y, dentro del día, por hora de inicio. El responsable repasa su agenda de arriba abajo, como se lee una semana.
4. **Sala que no existe** (`reservas Este`): responde `sin reservas Este`: una sala desconocida es, para este comando, una sala sin reservas, y no se comprueba contra la lista de salas. No invento un mensaje de error nuevo; `cancelar` tampoco distingue.
5. **Sin argumento** (`reservas`): responde `uso: reservas <sala>`. Texto mío; la petición no lo cubre. Un argumento vacío (`reservas ""`) cuenta como sin argumento. Con argumentos de más (`reservas Norte extra`) se usa solo el primero y el resto se ignora, como hacen `cancelar` y `anular`.
6. **Solo cuentan las reservas activas**: las canceladas y las anuladas no salen (términos de `PRODUCT.md`). Hoy el código las guarda con los estados `active`, `cancelled` y `voided`; el listado solo deja pasar `active`. No hay forma de verlas con este comando.
7. **Sin filtro de día ni de semana**: salen todas las activas de la sala, cada una con su día. Un «solo hoy» no está pedido; va a No entra.
8. **Nombre de la sala sensible a mayúsculas** (`reservas norte` responde `sin reservas norte`), igual que `cancelar` y `anular`. El responsable verá «sin reservas» y no un error; lo acepto por no inventar un aviso.
9. **Formato de la línea**: `<día> <franja>`, tal como se guarda hoy (`lun 10:00-12:00`), sin quién reservó, aunque `PRODUCT.md` define la reserva «a nombre de quien la pide»: la petición da ese ejemplo y no pide el nombre, y el almacén de hoy no guarda a nadie.
10. **Horas y días**: las franjas se ordenan como texto `HH:MM` de inicio (válido con ceros a la izquierda, como `09:00`); una franja o un día mal formado no está cubierto (deuda: «Sin validación del formato de franja horaria»); solo garantizo que el listado no lanza error con ellos.
11. **Sin control de quién ejecuta el comando**: el producto no tiene roles ni login (`operations.md`: «sin login»); cualquiera que lo ejecute ve la agenda. Lo digo porque `anular` está pensado para el responsable y este no.
12. **Cambios de contrato del fichero de entrada**: `src/app.js` exporta una función nueva, `listBookings(room, store)`, con `store` solo para los tests; ningún otro comando cambia. Ni la ayuda ni el `CHANGELOG.md` se tocan (el changelog lo escribe el corte de la release).
13. **Riesgo aceptado**: una errata o una mayúscula mal puesta (`reservas norte`) responde «sin reservas» y el responsable podría creer que la sala está libre; lo acepto por no inventar un aviso (decisiones 4 y 8).
14. **El «responsable de sala» y el dev-lead son la misma persona** (`PRODUCT.md`: un solo usuario); la validación es suya.
- Política de modelos: revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
- Delta probado en una copia de `.docs/sdd` con `sdd capability merge`: crea `room-bookings.md` con 10 requisitos y 5 reglas, sin rechazos (repetido tras los cambios de la review)

### Hallazgos de la review

Primera ronda (un revisor, sonnet):

1. **Aceptado** — Crítico, sala inexistente indistinguible de sala sin reservas → «existe» se define como estar entre las salas del código (decisión 4); la salida igual es a propósito y el GIVEN ya no dice «no existe ninguna sala».
2. **Aceptado** — Crítico, ningún escenario aísla el filtrado por sala → escenario «Solo salen las reservas de la sala pedida» con Norte y Sur.
3. **Aceptado** — Importante, orden: tildes, horas y día desconocido → escenario con `mié` y `sáb`, decisión 10 (texto `HH:MM`); la regla del día desconocido se retira del Approach (queda como deuda).
4. **Aceptado** — Importante, escenario 4 con AND condicional → se parte en dos escenarios.
5. **Aceptado** — Importante, estados no verificados → decisión 6 cita `active`, `cancelled` y `voided`, leídos en el código.
6. **Aceptado** — Importante, mayúsculas sin escenario → escenario `reservas norte`.
7. **Aceptado en parte** — Importante, roles y argumentos de más → decisión 11 (sin roles, sin login) y argumentos sobrantes ignorados (decisión 5); no hay escenario de roles porque no existen.
8. **Aceptado** — Menor, razón de «no aplica» en Límites y Conflicto.
9. **Aceptado en parte** — Menor → decisión 9 justifica no mostrar el nombre; el recuento de reglas era correcto (5, con 2 «no aplica»).
10. **Rechazado en lo del rol** — Menor → «responsable de sala» y dev-lead son la misma persona (decisión 12); el 🦆 y el estado de aprobación pendientes son del gate.

Segunda ronda (un revisor sonnet relee la spec corregida; sin tercera ronda):

1. **Aceptado** — Importante, la comprobación de que la sala existe no cambia nada observable → se retira del Approach y de la decisión 4: sala desconocida = sala sin reservas.
2. **Aceptado** — Importante, argumentos de más sin escenario → escenario «Los argumentos de más se ignoran».
3. **Aceptado** — Importante, la exportación nueva no estaba declarada → decisión 12, Scope y tabla de cambios de forma.
4. **Aceptado** — Importante, regla de idioma mal citada → «Idioma de los nombres» distingue textos (castellano) e identificadores (como el código).
5. **Aceptado en parte** — Importante, día mal formado → decisión 10 garantiza que no lanza error; su orden sale a «No entra».
6. **Aceptado** — Importante, ayuda y changelog → «No entra» y decisión 12.
7. **Aceptado** — Menor, errata devuelve «sin reservas» → decisión 13 e Intent como riesgo aceptado.
8. **Aceptado** — Menor, segunda ronda por cerrar y actor de los escenarios → cerrada aquí; el actor «el responsable» se mantiene (decisión 14).
9. **Aceptado** — Menor, Scope citaba «decisiones 3 a 9» → «3 a 11» y la 12.
10. **Aceptado** — Menor, GIVEN vacío y argumento vacío → GIVEN concreto; el argumento vacío cuenta como sin argumento (decisión 5).

### Decisiones tomadas con el dev-lead

- Comando `reservas <sala>`, una reserva activa por línea como `lun 10:00-12:00`; sin reservas, `sin reservas <sala>` — «un comando `reservas <sala>` que lista las reservas activas de la sala, una por línea, como `lun 10:00-12:00`; sin reservas responde `sin reservas <sala>`»
- Perfil delegate — «Perfil delegate.»

## Intent

Hoy el responsable de sala no puede ver qué tiene reservado su sala: `libres` solo dice qué salas están libres en una franja. Cada mañana quiere revisar su agenda, y para eso necesita ver de una mirada las reservas activas de su sala. Éxito: `reservas Norte` muestra exactamente las reservas que siguen en pie, sin una cancelada o anulada de más ni una activa de menos. Fracaso, aunque funcione: que una reserva anulada aparezca como viva y el responsable prepare una sala para nadie. Riesgo aceptado: una errata en la sala responde «sin reservas» (decisión 13).

## Scope

- Entra: el comando `reservas <sala>` con el formato, el orden y las respuestas de las decisiones 3 a 11, y la exportación de `listBookings(room, store)` de la decisión 12.
- No entra: filtrar por día o por semana · mostrar quién reservó · listar canceladas o anuladas · validar el formato de la franja (está en la deuda) · tocar `libres`, `cancelar`, `anular` o `reservar` · cambiar la ayuda o el `CHANGELOG.md` · definir qué hace el orden con un día mal formado, más allá de no lanzar error.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada se retira ni cambia de forma; `src/app.js` gana una exportación (decisión 12) | `git grep -n reservas` fuera de esta spec: solo prosa (`operations.md:14`, `CHANGELOG.md:14`, `ROADMAP.md`); ningún comando `reservas` existe | no aplica |

- Filas que implementa: nada: comprobado con `git grep -n 0012 -- ROADMAP.md` (sin resultado: no hay fila, la feature sale de la petición del dev-lead; la 0011 «Anular reservas de otros» es otra cosa)

## Approach

- A. Función `listBookings(room, store)` en `src/app.js` junto a `cancelBooking` y `voidBooking`, y una línea en `run` — cuesta lo mínimo y sigue el patrón y el almacén en memoria de los demás comandos.
- B. Módulo aparte `src/bookings.js` — la arquitectura dice «un solo fichero de entrada»; para ~10 líneas solo añade un fichero.
- C. Pintar la lista dentro de `run` sin función — el orden y el filtrado no se podrían probar sin pasar por `run`.
- Elegido: A — es el patrón del proyecto y no cuesta nada más.

El filtrado usa el mismo estado `active` que `findBooking`. El orden de días es la lista fija `lun, mar, mié, jue, vie, sáb, dom`; las horas se comparan como texto.

## Dónde se prueba

- Listado, orden, sin reservas, canceladas y anuladas ausentes, sala desconocida y sin argumento: por `run('reservas', [...])` y por `listBookings(sala, almacén)` (el almacén de prueba trae reservas de dos salas y de los tres estados), como los tests de `test/cancel.test.js`, en `test/reservas.test.js`. Con `run` se prueba el texto; con `listBookings` y un almacén de prueba, el orden y el filtrado de varias reservas.

## Términos y ADR

- Términos resueltos: ninguno — se usan reserva, sala, cancelación y anulación como en `PRODUCT.md`
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-bookings`

#### ADDED — Listar las reservas activas de una sala

- GIVEN la sala Norte con reservas activas `lun 10:00-12:00` y `mar 09:00-10:00`
- WHEN el responsable ejecuta `reservas Norte`
- THEN responde dos líneas, `lun 10:00-12:00` y `mar 09:00-10:00`, en ese orden

#### ADDED — Solo salen las reservas de la sala pedida

- GIVEN la sala Norte con una reserva activa `lun 10:00-12:00` y la sala Sur con una reserva activa `mar 09:00-10:00`
- WHEN el responsable ejecuta `reservas Sur`
- THEN responde solo `mar 09:00-10:00`

#### ADDED — Las líneas salen por día de la semana y por hora

- GIVEN la sala Sur con reservas activas `sáb 08:00-09:00`, `mar 15:00-16:00`, `lun 11:00-12:00`, `mié 10:00-11:00` y `mar 09:00-10:00`
- WHEN el responsable ejecuta `reservas Sur`
- THEN responde `lun 11:00-12:00`, `mar 09:00-10:00`, `mar 15:00-16:00`, `mié 10:00-11:00` y `sáb 08:00-09:00`, en ese orden

#### ADDED — Una sala sin reservas lo dice

- GIVEN la sala Sur sin ninguna reserva
- WHEN el responsable ejecuta `reservas Sur`
- THEN responde `sin reservas Sur`

#### ADDED — Las reservas canceladas o anuladas no salen

- GIVEN la sala Norte con una reserva `lun 10:00-12:00` cancelada, otra `mar 09:00-10:00` anulada y otra `mié 09:00-10:00` activa
- WHEN el responsable ejecuta `reservas Norte`
- THEN responde solo `mié 09:00-10:00`

#### ADDED — Una sala con todas las reservas canceladas o anuladas responde sin reservas

- GIVEN la sala Norte con una reserva `lun 10:00-12:00` cancelada y otra `mar 09:00-10:00` anulada
- WHEN el responsable ejecuta `reservas Norte`
- THEN responde `sin reservas Norte`

#### ADDED — Una sala que no existe responde como una sin reservas

- GIVEN que ninguna reserva es de la sala Este
- WHEN el responsable ejecuta `reservas Este`
- THEN responde `sin reservas Este`

#### ADDED — El nombre de la sala distingue mayúsculas

- GIVEN la sala Norte con una reserva activa `lun 10:00-12:00`
- WHEN el responsable ejecuta `reservas norte`
- THEN responde `sin reservas norte`

#### ADDED — Sin sala, el comando explica su uso

- GIVEN la sala Norte con una reserva activa `lun 10:00-12:00`
- WHEN el responsable ejecuta `reservas` sin argumento, o con el argumento vacío
- THEN responde `uso: reservas <sala>`

#### ADDED — Los argumentos de más se ignoran

- GIVEN la sala Norte con una reserva activa `lun 10:00-12:00`
- WHEN el responsable ejecuta `reservas Norte extra`
- THEN responde `lun 10:00-12:00`

#### Reglas de la capacidad — room-bookings

- **Dónde viven los datos**: en memoria, como el resto de las reservas (`operations.md`: sin base de datos).
- **Idioma de los nombres**: textos de la interfaz y de los documentos en castellano (constitución, regla 4); los días, `lun`…`dom`; los identificadores del código, como los existentes (`cancelBooking`).
- **Límites**: no aplica: la lista no se pagina, salen todas las activas
- **Avisos**: `sin reservas <sala>` · `uso: reservas <sala>`
- **Regla ante conflicto**: no aplica: el comando es solo de lectura

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
