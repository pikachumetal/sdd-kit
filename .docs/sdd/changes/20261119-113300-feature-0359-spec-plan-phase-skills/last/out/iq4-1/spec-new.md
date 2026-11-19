---
id: 20261119-183254-feature-0012-aviso-sala-ocupada
feature: 0012
title: Aviso de sala muy ocupada
mode: full
status: approved
created: 2026-11-19
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-19
---

# Spec — Aviso de sala muy ocupada

🦆 Hoy no hay forma de saber si una sala se está llenando. Con esta feature, `node src/app.js ocupacion Norte lun` responde `Norte lun: 3 reservas activas · muy ocupada` cuando la sala llega al umbral, y `Norte mar: 1 reserva activa` cuando no. Se cuentan solo las reservas activas (no las canceladas ni anuladas). Se añade un comando nuevo sin tocar los existentes.

Validación: dev-lead — es una salida que lee una persona en la terminal y el umbral y el texto son decisiones suyas.

## Capacidades

- Nuevas: `room-busy-alert` — aviso de que una sala está muy ocupada en un día.
- Modificadas: ninguna.
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Pedido por el dev-lead: «avisa cuando una sala esté muy ocupada». No dijo qué es «muy ocupada», dónde se avisa ni con qué texto: todo lo siguiente es **pendiente** de su validación.

1. Umbral: «muy ocupada» = 3 o más reservas activas de esa sala ese día — pendiente; sin dato de uso real, un número pequeño y fácil de cambiar (constante `BUSY_THRESHOLD`).
2. Dónde se avisa: comando nuevo `ocupacion <sala> <dia>` — pendiente; `libres` filtra por franja sin día y `reservar` aún no crea reservas sueltas, así que no hay otro punto natural.
3. Texto de salida: `<sala> <dia>: <n> reservas activas · muy ocupada` / `<sala> <dia>: <n> reservas activas` (singular `1 reserva activa`; `0 reservas activas`) — pendiente; castellano por la constitución (art. 4).
4. Solo cuentan reservas con estado `active` — por coherencia con `findBooking` y `freeRooms`, que ya ignoran canceladas y anuladas.
5. Sala inexistente: `sala desconocida <sala>` — pendiente.
6. Enfoque: comando aparte, frente a avisar al reservar o dentro de `libres` (ver Approach).
7. Formato de `<dia>`: el mismo que ya usan las reservas (`lun`, `mar`…); el separador ` · ` y que «sala desconocida» no lleve día son parte del texto de la decisión 3 — pendiente.
8. Argumentos que faltan (`ocupacion`, `ocupacion Norte`): sale `uso: ocupacion <sala> <dia>` — pendiente. Un día sin reservas no es error: `0 reservas activas`.
9. Nombres de código en inglés (`occupancy`, `BUSY_THRESHOLD`, capacidad `room-busy-alert`) por convención de código; la interfaz va en castellano (Sala, Reserva de PRODUCT.md).
10. Delta probado en una copia de `.docs/sdd`: `capability merge` añade los requisitos y reglas de `room-busy-alert` sin rechazos; `git grep` de `0012` y `ocupacion` fuera de la spec: sin resultados.
11. `run` gana una rama nueva y el comando lee `bookings` y `rooms` sin modificarlos; no hay ayuda de CLI que cambiar (el comando desconocido sigue devolviendo `salas`).
- Política de modelos (solo en `delegate`): un revisor de la spec (sonnet, siete puntos: spec pequeña, una capacidad nueva, sin MODIFIED) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.

### Hallazgos de la review

- **Aceptado** — faltan escenarios de borde, anulada, singular y cero → añadidos al delta.
- **Aceptado** — argumentos ausentes sin especificar → decisión 8 y escenario.
- **Aceptado** — decisiones no listadas en ✋ y contratos tocados sin decir → decisiones 7, 9 y 11.
- **Aceptado** — reglas de la capacidad incompletas → las cinco declaradas.
- **Aceptado** — gate y fixtures en «Dónde se prueba».
- **Rechazado** — «aprobada y pendiente a la vez» → la aprobación por delegación es del dev-lead; lo marcado «pendiente» se valida en la validación, que es donde la frase lo emplaza.
- **Rechazado** — citar estados posibles → `active`, `cancelled` y `voided` están en `src/app.js` (`cancelBooking`, `voidBooking`); no hay capacidades que citar.

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación; el dev-lead valida en la validación — «apruebo la spec por delegación, nos vemos en la validación»

## Intent

Hoy el listado y la cancelación no dicen cuánto se está llenando una sala. Se quiere saber de un vistazo si una sala está muy ocupada un día. Éxito: con 3 reservas activas el comando lo dice; con 2, no; las canceladas y anuladas no cuentan. Anti-goal: avisar de más (que cuente reservas que ya no existen).

## Scope

- Entra: comando `ocupacion <sala> <dia>`, umbral de 3, texto de salida, sala desconocida.
- No entra: avisos por correo (fila 0008), cambiar `libres`/`reservar`/`cancelar`/`anular`, umbral configurable por el usuario, ocupación por franja.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: 0012 (rama sin fila en ROADMAP; id reservado con `sdd id next`) → ningún fichero la nombra | nada: comprobado con `grep -rn 0012 .`

## Approach

- A. Comando `ocupacion <sala> <dia>` — una función pura `occupancy(room, day)` más una rama en `run`; se prueba sola; no toca comportamiento existente.
- B. Avisar dentro de `reservar` — `reservar` aún no crea reservas individuales, no hay dónde colgarlo.
- C. Añadirlo a la salida de `libres` — `libres` recibe franja, no día; mezclaría dos conceptos.
- Elegido: A — único punto con sala y día a la vez, sin tocar lo existente (decisión mía, ✋ 6).

## Dónde se prueba

- Umbral y recuento: `node --test test/occupancy.test.js`, importando `run` como `test/cancel.test.js`.
- Canceladas/anuladas no cuentan: mismo fichero, usando `cancelBooking` y `voidBooking`.
- Sala desconocida, uso, singular/cero y borde 2/3: mismo fichero. Cómo se montan las reservas de cada test sin contaminar los demás lo fija el plan; el gate de cierre es `node --test && node scripts/lint.mjs` entero.

## Términos y ADR

- Términos resueltos: ocupada — sala con 3 o más reservas activas en un día (provisional, ✋ 1)
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-busy-alert`

#### ADDED — Aviso de sala muy ocupada

- GIVEN la sala Norte con 3 reservas activas el lun
- WHEN se ejecuta `ocupacion Norte lun`
- THEN sale `Norte lun: 3 reservas activas · muy ocupada`

#### ADDED — Sala con poca ocupación

- GIVEN la sala Norte con 2 reservas activas el lun, y una tercera cancelada
- WHEN se ejecuta `ocupacion Norte lun`
- THEN sale `Norte lun: 2 reservas activas`

#### ADDED — Sala desconocida

- GIVEN las salas Norte y Sur
- WHEN se ejecuta `ocupacion Este lun`
- THEN sale `sala desconocida Este`

#### ADDED — Anuladas y borde del umbral

- GIVEN Norte con 2 reservas activas y 1 anulada el lun
- WHEN se ejecuta `ocupacion Norte lun`
- THEN sale `Norte lun: 2 reservas activas` (3 activas sí darían `muy ocupada`; 2 no)

#### ADDED — Singular y cero

- GIVEN Norte con 1 reserva activa el mar y ninguna el mié
- WHEN se ejecuta `ocupacion Norte mar` y `ocupacion Norte mié`
- THEN salen `Norte mar: 1 reserva activa` y `Norte mié: 0 reservas activas`

#### ADDED — Argumentos que faltan

- GIVEN cualquier estado
- WHEN se ejecuta `ocupacion Norte`
- THEN sale `uso: ocupacion <sala> <dia>`

#### Reglas de la capacidad — room-busy-alert

- **Dónde viven los datos**: se leen de las reservas en memoria existentes; ningún dato nuevo
- **Idioma de los nombres**: interfaz en castellano; nombres de código en inglés
- **Límites**: muy ocupada = 3 o más reservas activas de la sala en el día
- **Avisos**: `muy ocupada` al final de la línea de ocupación
- **Regla ante conflicto**: no aplica, el comando solo lee; una reserva cancelada o anulada nunca cuenta

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-19 | aprobada: «apruebo la spec por delegación, nos vemos en la validación» |
