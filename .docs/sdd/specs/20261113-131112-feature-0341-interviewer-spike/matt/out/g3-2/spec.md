---
id: 20261113-144756-feature-0010-lista-espera
feature: 0010
title: Lista de espera para una sala ocupada
mode: full
profile: delegate
status: draft
created: 2026-11-13
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Lista de espera para una sala ocupada

🦆 Hoy, si Norte está ocupada el lunes de 10:00 a 12:00, tienes que volver a mirar `libres` cada rato hasta que esa reserva se cancele. Con esta feature, `reservar Norte lun 10:00-12:00` te apunta en una lista de espera si la sala está ocupada, y cuando se haga `cancelar lun 10:00` la sala pasa a ser tuya sin que hagas nada más. Para que funcione entre comandos, las reservas y la lista se guardan en un fichero `salas.json`, porque hoy viven en memoria y se pierden al acabar cada comando. `espera` te enseña en qué listas estás. Ojo: la herramienta solo conoce las reservas de su propio fichero, así que solo se entera de una cancelación hecha con `cancelar` (ver ✋ 12).

Validación: dev-lead — es una herramienta que usa una persona y lo que importa (que la sala pase a ser suya al cancelar, entre comandos distintos) lo juzga quien la usa.

## Capacidades

- Nuevas: `bookings` — reservar una sala libre y cancelar una reserva, con el estado guardado en `salas.json`.
- Nuevas: `waitlist` — apuntarse a una sala ocupada y que se reserve sola al cancelarse la reserva que la ocupa.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidades nuevas (`bookings`, `waitlist`), datos (fichero de estado nuevo, `salas.json`) · tamaño: ~120 líneas en 2 ficheros (`src/app.js`, `test/app.test.js`)
- Dominio (opus): si «al cancelar, la sala pasa a la lista» cubre el borde de dos reservas liberadas a la vez y el de apuntarse dos veces a la misma sala y franja (señal: capacidad nueva)
- Técnica (sonnet): si pasar el estado de memoria a fichero deja verdes los tres tests actuales y si un `salas.json` ilegible o ausente tiene respuesta definida (señal: datos)
- Mínimo razonable: solo técnica — deja sin mirar las reglas de orden y de conflicto de la lista, que son las que hacen que «se reserva sola» sea correcto

1. **Las reservas y la lista viven en `salas.json`**, en la carpeta desde la que se ejecuta el comando (`process.cwd()`), y no en memoria — cada comando es un proceso nuevo: con la lista en memoria se perdería antes de que nadie cancele, y el objetivo (dejar de mirar `libres` a mano) no se cumpliría aunque los tests pasaran. Pasan al fichero también las reservas, porque la reserva automática tiene que sobrevivir al comando que la hace. Si no existe, se trata como el estado de serie (Norte, lun, 10:00-12:00) y solo se crea al guardar un cambio: `libres`, `espera` y los comandos que no cambian nada no escriben.
2. **«Ocupada» es misma sala, mismo día y misma franja exacta** (como `libres`, que compara la franja entera). Una franja que solo se solapa (`11:00-13:00` frente a `10:00-12:00`) cuenta como libre: validar solapes queda fuera. Se comparan los nombres tal cual, con mayúsculas: `norte` es `sala desconocida: norte`.
3. **Se apunta una entrada por sala, día y franja**; apuntarse dos veces a la misma no duplica. Eres el único usuario, así que la lista no guarda quién espera y no hay orden entre dos entradas iguales.
4. **Textos**: `reservada Norte lun 10:00-12:00` · `Norte ocupada lun 10:00-12:00: apuntado en la lista de espera` · `ya estás en la lista de espera de Norte lun 10:00-12:00` · `sala desconocida: Oeste` · `lista de espera vacía` · en `cancelar`, tras `cancelada <día> <hora>`, una línea `Norte lun 10:00-12:00 reservada desde la lista de espera` por cada reserva promovida · `salas.json ilegible: <motivo>`.
5. **`reservar <sala> <día> <franja>`** es la forma nueva; `reservar <sala> --cada-semana` sigue como está, sin tocar el fichero y sin ocupar la sala para la lista. Con `--cada-semana` en cualquier posición gana la rama semanal; sin él, con menos de tres argumentos sigue respondiendo `salas` como hoy y con más de tres usa los tres primeros. `cancelar` con menos de dos argumentos queda como hoy (fuera). Hoy `reservar` sin `--cada-semana` no hace nada, así que reservar de verdad una franja suelta entra en esta feature porque sin ello no hay «ocupada» que esperar.
6. **`cancelar <día> <hora>` pasa a quitar de verdad** las reservas de ese día cuya franja empieza a esa hora (hoy solo devuelve el texto): sin quitar la reserva no hay nada que liberar. Primero se quitan todas y después se promueve; una reserva recién promovida no la toca el mismo `cancelar`. `cancelar` nunca borra entradas de la lista de espera. La primera línea de su salida no cambia (`cancelada mar 10:00`).
7. **`espera`** (comando nuevo) lista una línea por entrada, `Norte lun 10:00-12:00`, en el orden en que te apuntaste.
8. **Sin comando para salirte de la lista** en esta feature: la entrada se queda hasta que se promueva; se borra editando `salas.json`.
9. **`libres` lee el estado de `salas.json`** en vez de la memoria, con la misma salida de hoy; sigue sin mirar el día (solo la franja), limitación que ya tiene y queda fuera.
10. **`salas.json` ilegible** (JSON roto, vacío, con `bookings` o `waiting` que no sean listas, o con entradas sin `room`, `day` y `slot` de texto) al ejecutar un comando que carga el estado — `libres`, `reservar <sala> <día> <franja>`, `cancelar` y `espera`; `salas`, `reservar --cada-semana` y un comando desconocido no lo leen —: `load()` lanza `Error('salas.json ilegible: <motivo>')`, el punto de entrada lo escribe en stderr y sale con código 1; no se toca el fichero, para no perder reservas por sobrescribir.
11. **Enfoque**: A (estado completo en `salas.json`) frente a B (todo en memoria) y C (solo la lista en fichero, reservas en memoria); ver Approach. `run(cmd, params, store)` cambia de firma con un almacén por defecto de fichero; los tres tests actuales se editan para pasar uno en memoria. Forma del almacén: `fileStore(dir)` para el fichero, `memoryStore(state)` para los tests (con un contador `saves` de las llamadas a `save`) y `initialState` exportado con la reserva de serie. Se escribe directo, sin bloqueo ni fichero temporal: si dos terminales escriben a la vez, gana la última (límite asumido para un solo usuario).
12. **⚠ Asunción que necesito que confirmes:** `salas` solo conoce las reservas de su propio fichero. La lista de espera se resuelve cuando se ejecuta `cancelar` aquí; si la reserva que ocupa Norte la cancela otra persona en el coworking, esta herramienta no se entera y tu entrada seguirá esperando. Asumo que las reservas ajenas las registras tú con `reservar` y las quitas con `cancelar`. Si no es así, falta un modo de importar o sincronizar reservas, y eso es otra feature.
13. **Claves del fichero en inglés** (`bookings`, `waiting`, `room`, `day`, `slot`) y capacidades `bookings` y `waitlist` (slug en inglés, kebab-case): son nombres internos como los del código actual (`rooms`, `bookings`); lo que ve el usuario (comandos y mensajes) va en castellano, la constitución solo exige castellano en la interfaz y los documentos, así que los nombres en inglés son decisión mía y no tienen su respaldo.
14. **Delta probado sobre una copia de `.docs/sdd`**: `sdd capability merge` crea `bookings.md` (8 requisitos) y `waitlist.md` (8 requisitos), cada uno con sus 5 reglas, sin rechazos; `sdd capability check` da «Capacidades válidas: 2». `capabilities/` del repositorio no cambia.
- Política de modelos: dominio en opus y técnica en sonnet, en paralelo (2) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo previstos · al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario

### Hallazgos de la review

- **Aceptado** — Crítico (técnica): «ilegible» sin contrato → decisión 10: `load()` lanza, el punto de entrada sale con código 1; escenario con vacío y forma inválida.
- **Aceptado** — Crítico (técnica): los THEN de cancelar pasan por casualidad de datos o sin promoción → los THEN comprueban el estado (una sola reserva de Norte, lista vacía), y hay un escenario de otro día que no se toca.
- **Aceptado** — Crítico (dominio): con un solo usuario, ¿quién cancela? → decisión 12 y Intent: solo se resuelve con `cancelar` de esta herramienta; lo dejo para que lo confirmes.
- **Aceptado** — Crítico (dominio): ocupada con solapes → decisión 2: franja exacta, solapes fuera.
- **Aceptado** — Importante (dominio): `libres` pasa a leer `salas.json` → decisión 9, Scope y tabla de cambios.
- **Aceptado** — Importante (dominio): reservar libre y cancelar no son lista de espera → capacidad nueva `bookings`.
- **Aceptado** — Importante (ambos): dos reservas liberadas a la vez, cancelar sin coincidencias, día distinto, argumentos incompletos → escenarios nuevos y decisiones 5 y 6 (borrar primero, promover después, una línea por promoción).
- **Aceptado** — Importante (técnica): decisiones del cuerpo fuera de ✋ (firma de `run`, cwd, lecturas sin escribir, mayúsculas, sin bloqueo) → decisiones 1, 2 y 11.
- **Aceptado** — Importante (dominio): idioma de las claves → decisión 13.
- **Aceptado** — Menor: lista completa de avisos (decisión 4 y Reglas); «primera entrada» sobraba con una entrada por clave.
- **Aceptado** — Importante (ronda 2): faltaba probar que reservas y promoción sobreviven entre comandos, y un requisito para `libres` → escenarios «Las reservas y la promoción se conservan entre comandos» y «Libres lee el estado guardado».
- **Aceptado** — Importante (ronda 2): el orden de promoción con dos liberadas no salía de ninguna regla → sigue el orden de `bookings` (el de registro), con las dos líneas literales en el escenario.
- **Aceptado** — Importante (ronda 2): forma del almacén y comandos que cargan el estado → decisiones 11 y 10; forma inválida ampliada.
- **Aceptado** — Menor (ronda 2): contador `saves` para «no se escribe»; argumentos de más o de menos (decisión 5); Scope «Entra» con tests, firma y manejo de errores; decisión 13 sin citar la constitución como respaldo; la limitación del día de `libres`, fijada por escrito en un escenario.
- **Rechazado** — Menor (técnica): normalizar mayúsculas → motivo: se compara tal cual, como `libres` hoy; añadir normalización es otra decisión que nadie pidió (decisión 2).

### Decisiones tomadas con el dev-lead

- Cuando la sala se libera, se reserva sola para quien está apuntado — «sí, adelante» (a la opción 1 recomendada) y «cuando Norte está ocupada tengo que volver a mirar libres a mano cada rato».
- Carril feature, modo full, perfil delegate — «sí, adelante: feature full con delegate».

## Intent

Hoy, si la sala que quieres está ocupada, solo puedes volver a ejecutar `libres` cada rato hasta que se cancele la reserva. Cuesta tiempo y se te puede escapar el hueco. Queremos que apuntarte a una sala ocupada baste: cuando se ejecute `cancelar` sobre la reserva que la ocupa, la sala pasa a ser tuya sin que hagas nada. El éxito es que, tras `reservar Norte lun 10:00-12:00` con la sala ocupada y un `cancelar lun 10:00` posterior (en otro comando), `libres 10:00-12:00` ya no muestra Norte porque es tuya. Fracasaría, aunque los tests pasaran, si la lista no sobreviviera entre comandos.

## Scope

- Entra: guardar reservas y lista en `salas.json` · `reservar <sala> <día> <franja>` (reserva si libre, apunta si ocupada) · `espera` · `cancelar` que quita de verdad y reserva a quien espera · `libres` leyendo el fichero · sustituir el estado en memoria de `src/app.js` por el almacén · cambio de firma de `run` y edición de los tres tests actuales · en el punto de entrada, error de estado ilegible a stderr con código 1.
- No entra: salir de la lista con un comando · varios usuarios o propietario de la entrada · avisos por correo (la 0008 es otra feature) · que `libres` mire el día · solapes de franjas · normalizar mayúsculas · bloqueo ante escrituras simultáneas · importar reservas hechas fuera de la herramienta · validar el formato de la franja (ya está en la deuda «Por triar») · cambiar `reservar --cada-semana`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Estado en memoria (`bookings`) | `src/app.js:3` | Scope y decisión 1: pasa a `salas.json` |
| `libres` leyendo el estado en memoria | `src/app.js:5-7` | decisión 9: lee el almacén, misma salida |
| Salida de `cancelar` | `src/app.js:12`, `test/app.test.js:13` | decisión 6: la primera línea no cambia; solo se añaden líneas cuando hay promoción |
| `reservar` sin `--cada-semana` (cae en `salas`) | `src/app.js:11` | decisión 5: con tres argumentos reserva o apunta; con menos, sigue en `salas` |
| Firma `run(cmd, params)` | `test/app.test.js:5,9,13` | decisión 11: los tres tests pasan un almacén en memoria |

- Filas que implementa: nada: comprobado con `git grep -n 0010 -- ROADMAP.md .docs/sdd/steering` (sin resultados; la 0010 no tiene fila)

## Approach

- A. Estado completo (reservas + lista) en `salas.json` — un fichero JSON leído y escrito por comando; sin dependencias, como pide `operations.md` (Node 22, sin externas).
- B. Todo en memoria — descartada: cada comando es un proceso nuevo y la lista moriría antes de que se cancele nada.
- C. Solo la lista en fichero, reservas en memoria — descartada: la reserva automática no persistiría y la lista apuntaría a una reserva que desaparece.
- Elegido: A — es la única que cumple el Intent con los comandos tal como se usan.

`run(cmd, params, store)` recibe un almacén con `load()` y `save(state)`; por defecto el del fichero; los tests, incluidos los tres actuales (cambio de firma, no de comportamiento), pasan uno en memoria y ninguno escribe `salas.json` en el repositorio. El estado es `{ bookings: [{room, day, slot}], waiting: [{room, day, slot}] }`. Al cancelar (en el orden de `bookings`): se quitan las reservas del día y hora; después, por cada una quitada, si hay una entrada de `waiting` con su sala, día y franja, pasa a `bookings` y se quita de la lista. Solo se guarda si el estado cambió.

## Dónde se prueba

- Reservar libre, ocupada, repetida y de otro día (el «no se escribe» de cancelar sin coincidencia, con el contador `saves` del almacén en memoria); `espera`; cancelar con y sin lista, con dos liberadas y sin coincidencias: por `run(...)` con almacén en memoria, como los tests actuales, comprobando también el estado (`bookings`, `waiting`).
- Que el estado sobrevive entre comandos y el ilegible: un test con `salas.json` en una carpeta temporal, dos llamadas a `run` con el almacén de fichero; el código de salida 1, con el humo real.
- Humo real: `node src/app.js` varias veces seguidas en una carpeta temporal (reservar ocupada, cancelar, `libres`), y tras `node --test`, `git status` sin `salas.json`.

## Términos y ADR

- Términos resueltos: lista de espera — apuntarse a una sala, día y franja ocupados para que se reserve sola al cancelarse la reserva que la ocupa.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Reservar la sala si está libre

- GIVEN Norte tiene una reserva el lun de 10:00-12:00 y Sur no
- WHEN `reservar Sur lun 10:00-12:00`
- THEN responde `reservada Sur lun 10:00-12:00`
- AND `libres 10:00-12:00` ya no incluye Sur
- AND la lista de espera no cambia

#### ADDED — Reservar otro día de una sala ocupada otro día

- GIVEN Norte tiene una reserva el lun de 10:00-12:00
- WHEN `reservar Norte mar 10:00-12:00`
- THEN responde `reservada Norte mar 10:00-12:00`
- AND no se apunta ninguna entrada en la lista de espera

#### ADDED — Sala desconocida

- GIVEN las salas son Norte y Sur
- WHEN `reservar Oeste lun 10:00-12:00`
- THEN responde `sala desconocida: Oeste`
- AND no cambian ni las reservas ni la lista

#### ADDED — Reservar con argumentos incompletos

- GIVEN cualquier estado
- WHEN `reservar Norte` (sin día, franja ni `--cada-semana`)
- THEN responde `salas`
- AND no cambia el estado

#### ADDED — Cancelar quita la reserva de ese día y hora

- GIVEN Norte con reserva lun 10:00-12:00 y mar 10:00-12:00, y la lista vacía
- WHEN `cancelar lun 10:00`
- THEN responde solo `cancelada lun 10:00`
- AND `bookings` ya no tiene Norte lun 10:00-12:00 y conserva Norte mar 10:00-12:00

#### ADDED — Libres lee el estado guardado

- GIVEN `reservar Sur mar 14:00-16:00` ejecutado en un comando que ya terminó
- WHEN `libres 14:00-16:00` en un comando nuevo
- THEN responde `Norte`
- AND `libres` solo mira la franja y no el día: con Norte reservada el lun 10:00-12:00, `libres 10:00-12:00` responde `Sur`, como hoy

#### ADDED — Cancelar sin reserva que coincida

- GIVEN Norte con reserva lun 10:00-12:00
- WHEN `cancelar mar 10:00`
- THEN responde `cancelada mar 10:00`
- AND el estado no cambia y no se escribe `salas.json`

#### ADDED — Fichero de estado ilegible

- GIVEN `salas.json` vacío, o con `{`, o con un JSON sin `bookings` o sin `waiting`
- WHEN cualquier comando que lee el estado
- THEN termina con código 1 y escribe `salas.json ilegible: <motivo>` en stderr
- AND el fichero queda tal cual estaba

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: `bookings` de `salas.json`, en la carpeta desde la que se ejecuta el comando; sin fichero, el estado de serie (Norte, lun, 10:00-12:00), que solo se escribe al guardar un cambio.
- **Idioma de los nombres**: comandos y mensajes en castellano (constitución, regla 4); claves internas del fichero en inglés (`bookings`, `waiting`, `room`, `day`, `slot`), como los nombres del código.
- **Límites**: ocupada = misma sala, día y franja exactas; nombres de sala con mayúsculas tal cual; salas Norte y Sur.
- **Avisos**: `reservada <sala> <día> <franja>`, `sala desconocida: <sala>`, `cancelada <día> <hora>`, `salas.json ilegible: <motivo>`.
- **Regla ante conflicto**: `libres` compara solo la franja; sin bloqueo de escritura: con dos escrituras a la vez gana la última.

### Capacidad: `waitlist`

#### ADDED — Apuntarse a la lista de espera si la sala está ocupada

- GIVEN Norte tiene una reserva el lun de 10:00-12:00 y la lista de espera está vacía
- WHEN `reservar Norte lun 10:00-12:00`
- THEN responde `Norte ocupada lun 10:00-12:00: apuntado en la lista de espera`
- AND `espera` muestra `Norte lun 10:00-12:00`
- AND la reserva existente no cambia

#### ADDED — No se duplica la entrada de la lista

- GIVEN Norte ocupada el lun 10:00-12:00 y `Norte lun 10:00-12:00` ya en la lista
- WHEN `reservar Norte lun 10:00-12:00`
- THEN responde `ya estás en la lista de espera de Norte lun 10:00-12:00`
- AND `espera` sigue mostrando una sola línea

#### ADDED — La sala se reserva sola al cancelarse la reserva

- GIVEN Norte ocupada el lun 10:00-12:00 y `Norte lun 10:00-12:00` en la lista
- WHEN `cancelar lun 10:00`
- THEN responde `cancelada lun 10:00` y, en otra línea, `Norte lun 10:00-12:00 reservada desde la lista de espera`
- AND `bookings` tiene exactamente una reserva de Norte lun 10:00-12:00 y la lista queda vacía
- AND `libres 10:00-12:00` no incluye Norte

#### ADDED — Dos reservas liberadas a la vez

- GIVEN `bookings` con Norte y después Sur, ambas el lun 10:00-12:00, con `Norte lun 10:00-12:00` y `Sur lun 10:00-12:00` en la lista
- WHEN `cancelar lun 10:00`
- THEN responde `cancelada lun 10:00` y después, en este orden, `Norte lun 10:00-12:00 reservada desde la lista de espera` y `Sur lun 10:00-12:00 reservada desde la lista de espera`
- AND la lista queda vacía y ni Norte ni Sur salen en `libres 10:00-12:00`

#### ADDED — Una entrada de otra franja no se promueve

- GIVEN Norte ocupada el lun 10:00-12:00 y `Norte lun 11:00-13:00` en la lista
- WHEN `cancelar lun 10:00`
- THEN responde solo `cancelada lun 10:00`
- AND `Norte lun 11:00-13:00` sigue en la lista

#### ADDED — La lista se conserva entre comandos

- GIVEN `reservar Norte lun 10:00-12:00` ejecutado con Norte ocupada, en un comando que ya terminó
- WHEN se ejecuta `espera` en un comando nuevo
- THEN responde `Norte lun 10:00-12:00`

#### ADDED — Las reservas y la promoción se conservan entre comandos

- GIVEN Norte ocupada el lun 10:00-12:00 y `Norte lun 10:00-12:00` en la lista, todo guardado por comandos que ya terminaron
- WHEN `cancelar lun 10:00` en un comando y, después, `libres 10:00-12:00` y `espera` en comandos nuevos
- THEN `libres 10:00-12:00` responde `Sur` y `espera` responde `lista de espera vacía`

#### ADDED — Ver la lista de espera vacía

- GIVEN la lista de espera vacía
- WHEN `espera`
- THEN responde `lista de espera vacía`

#### Reglas de la capacidad — waitlist

- **Dónde viven los datos**: `waiting` de `salas.json` (ver `bookings`).
- **Idioma de los nombres**: comando `espera` y mensajes en castellano; claves internas del fichero en inglés (`bookings`, `waiting`, `room`, `day`, `slot`), como los nombres del código.
- **Límites**: una entrada por sala, día y franja exactas; sin comando para salir de la lista; `cancelar` no borra entradas.
- **Avisos**: `<sala> ocupada <día> <franja>: apuntado en la lista de espera` al apuntarse; `ya estás en la lista de espera de <sala> <día> <franja>` al repetir; `<sala> <día> <franja> reservada desde la lista de espera` por cada promoción; `lista de espera vacía`.
- **Regla ante conflicto**: al cancelar se quitan primero todas las reservas y después se promueve, una por reserva quitada, en el orden de `bookings`, y solo la entrada de su misma sala, día y franja; una reserva promovida no la toca el `cancelar` que la creó.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
