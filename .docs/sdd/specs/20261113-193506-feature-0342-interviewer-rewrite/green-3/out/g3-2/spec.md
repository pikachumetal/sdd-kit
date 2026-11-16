---
id: 20261114-160510-feature-0010-lista-espera
feature: 0010
title: Lista de espera para una sala ocupada
mode: full
profile: delegate
status: draft
created: 2026-11-14
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Lista de espera para una sala ocupada

🦆 Hoy, si Norte está ocupada el lunes de 10:00 a 12:00, tienes que volver a ejecutar `libres` cada rato para ver si se ha liberado. Con esto, `reservar Norte lun 10:00-12:00` te responde `Norte ocupada; en espera` y lo apunta; cuando cancelas esa reserva con `cancelar lun 10:00`, la sala pasa a ser tuya al instante: `cancelada lun 10:00; Norte lun 10:00-12:00 reservada desde la espera`. Para que la espera sobreviva entre comandos, las reservas y las esperas se guardan en un fichero `salas-datos.json`.

Validación: dev-lead — es una herramienta que usa una persona por línea de comandos; lo que escribe y lo que lee solo lo puede juzgar quien la usa.

## Capacidades

- Nuevas: `waitlist` — reservar una sala, entrar en espera si está ocupada y pasar a reserva cuando se cancela la que la ocupaba.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`waitlist`), datos persistentes nuevos (`salas-datos.json`) · tamaño: ~110 líneas en 4 ficheros (`src/app.js`, `test/app.test.js`, `.gitignore`, `CHANGELOG.md`)
- Dominio (opus): si «Cancelar una reserva promueve la espera» y «Cancelar otro día no promueve» dejan claro qué reserva se cancela y qué espera sube (señal: capacidad nueva, regla de flujo)
- Técnica (sonnet): si pasar `state` como tercer parámetro de `run` deja intactos los tres tests actuales y si el fichero se lee y escribe sin perder reservas (señal: datos persistentes)
- Mínimo razonable: solo dominio — deja sin mirar la costura del fichero y el tercer parámetro de `run`

1. **Alcance de «ocupada»**: una sala está ocupada si tiene reserva en la misma sala, día y franja, con la franja escrita igual. `reservar <sala> <día> <franja>` es el comando de entrada (`reservar Norte lun 10:00-12:00`); hoy `reservar` solo existe con `--cada-semana` y no hay forma de reservar una franja suelta, y sin ella no hay «ocupada» que detectar. — es lo mínimo para que exista el caso que pides.
2. **Franjas que se solapan sin ser iguales** (`10:00-11:00` frente a `10:00-12:00`) no cuentan como ocupada: se reserva. — el formato de franja no se valida (está en `debt.md`, «Por triar») y calcular solapes obligaría a interpretarlo; queda en «No entra».
3. **Reservar una sala libre** responde `reservada Norte mar 14:00-16:00` y la guarda. Una sala que no existe (`reservar Oeste lun 10:00-12:00`) responde `sala desconocida: Oeste` y no guarda nada. Con otro número de parámetros, o con `--cada-semana`, `reservar` se comporta como hoy: la rama semanal se evalúa primero.
4. **Sin posición en la cola**: la respuesta es `Norte ocupada; en espera`, sin «(1.º)». — el producto lo usas solo tú, no hay otra persona delante.
5. **Una espera por sala, día y franja**: repetir la petición responde `Norte ya en espera lun 10:00-12:00` y no duplica. — misma razón que la 4.
6. **Promoción automática** al cancelar (opción 1️⃣ de la pregunta; ver abajo). Sin reserva que cancelar o sin espera, `cancelar` responde igual que hoy (`cancelada mar 10:00`).
7. **`cancelar <día> <hora>` ahora quita las reservas de verdad**: hoy solo imprime el texto y no toca ninguna reserva (`src/app.js:12`; el CHANGELOG da la 0007 por arreglada, pero el código del repo no quita nada). Coincide una reserva con ese día exacto y una franja que empieza en esa hora (`10:00` coincide con `10:00-12:00`). Si coinciden varias (en salas distintas, o en la misma sala con franjas que empiezan igual, como `10:00-11:00` y `10:00-12:00`), se quitan todas y se promueve cada espera cuya sala, día y franja sea la de una quitada, con una cláusula por cada una, en el orden de `bookings`: `cancelada lun 10:00; Norte lun 10:00-12:00 reservada desde la espera; Sur lun 10:00-12:00 reservada desde la espera`.
8. **Guardado en `salas-datos.json`** en la carpeta desde la que se ejecuta, con `{"bookings": [...], "waiting": [...]}` (mismas claves `room`, `day`, `slot` que hoy); si no existe, nace con la reserva de ejemplo de hoy (Norte, lun, 10:00-12:00) —sin ella `libres` dejaría de dar `Sur`—. Se crea `.gitignore` con ese nombre (no existe). Cada comando de `salas` es un proceso nuevo: sin fichero, la espera moriría al terminar el comando. Se guarda solo si el comando cambió `bookings` o `waiting`; `libres`, `reservar` o `cancelar` que no cambian nada no escriben ni crean el fichero. Un fichero ilegible, o un JSON sin `bookings` o sin `waiting` como listas, se trata como ilegible, también para `libres`: escribe `salas-datos.json ilegible` por el error estándar, sale con código 1 y deja el fichero intacto (texto en castellano, artículo 4). `reservar` y `cancelar` con parámetros incompletos responden como hoy y no guardan nada.
9. **Límites aceptados del fichero**: sin escritura atómica ni control de concurrencia (una persona, un proceso a la vez); la ruta depende de la carpeta de trabajo, así que ejecutar `salas` desde otra carpeta empieza con otro estado.
10. **Sin forma de quitar una espera** antes de que se promueva. Si no la quieres, `cancelar` de nuevo la reserva promovida. — «cancelar una espera» queda en «No entra».
11. **`run(cmd, params, state = estadoInicial())`**: `estadoInicial()` devuelve un objeto nuevo en cada llamada; `run` lo muta; `libres` pasa a leer `state.bookings` en lugar de la constante de módulo. Los tests actuales no cambian y los nuevos no tocan el disco, salvo los cuatro del CLI (nace, sobrevive, ilegible, `libres` no escribe), cada uno en su carpeta temporal, que ejecutan el CLI con `spawnSync(process.execPath, [ruta absoluta de src/app.js, …], { cwd: <carpeta temporal> })`.
12. **Todo dentro de `src/app.js`** (`operations.md` fija un solo fichero de entrada); la carga y el guardado solo se ejecutan dentro del `if (command)`, no al importar el módulo.
13. **Capacidad nueva `waitlist`** (slug en inglés, kebab-case; el contenido va en castellano). `reservar --cada-semana` queda fuera de ella.
14. **Enfoque**: B (ver Approach), frente a A y C.
15. **Repaso de coherencia**: delta probado sobre una copia de `.docs/sdd`: `sdd capability merge` → requisitos y reglas añadidos a `waitlist.md`, rc=0; `sdd capability check` → «Capacidades válidas: 1». `git grep` de espera/waitlist/0010 fuera de `changes/`: solo `debt.md` «En espera» (otra cosa). Se vuelve a probar tras integrar la review.
16. **Pendiente — de quién es la reserva que ocupa la sala**: la promoción solo ocurre cuando cancelas con esta herramienta la reserva que ocupa la sala. He supuesto que esa reserva está registrada aquí y que la cancelas tú (por ejemplo, la reserva de otra persona que tú gestionas, o que se cancela por esta vía). Si la sala la ocupa alguien que cancela fuera de esta herramienta, la feature no te quita el mirar `libres` y habría que replantear el Intent. No lo sé: lo decides al aprobar la spec.
- Política de modelos: revisores de la spec — dominio opus, técnica sonnet · segunda ronda: un revisor sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — `cancelar` sin sala puede quitar varias reservas y no decía cuál espera sube (dominio, Crítico) → decisión 7 y escenario con dos salas.
- **Aceptado** — el solape de franjas no estaba tratado (dominio, Crítico) → decisión 2, escenario y regla ante conflicto: solo cuenta la franja igual.
- **Aceptado, pendiente del dev-lead** — la premisa de un solo usuario hace dudoso de quién es la reserva que se libera (dominio, Crítico) → decisión 16, sin resolver.
- **Aceptado** — el criterio de éxito era cierto también sin la feature (dominio 4; técnica 1 y 2) → como `cancelar` ahora quita de verdad, `libres 10:00-12:00` pasa a distinguir (`Norte, Sur` sin promoción, `Sur` con ella); los THEN se aseguran también sobre el estado (`bookings` y `waiting`).
- **Aceptado** — sin forma de quitar una espera (dominio 5) → decisión 10 y «No entra».
- **Aceptado** — `cancelar` libera de verdad sin ningún escenario, y cancelar algo inexistente (dominio 6; técnica 3) → escenarios nuevos «Cancelar sin espera libera la sala» y «Cancelar lo que no existe».
- **Aceptado** — ruta del fichero y semilla (dominio 7; técnica 9) → decisiones 8 y 9, límites aceptados.
- **Aceptado** — avisos incompletos (dominio 8) → Reglas, Avisos, completo.
- **Aceptado** — referencia falsa a la 0007 y regla de coincidencia día+hora (técnica 4) → decisión 7.
- **Aceptado** — escenarios que faltaban: fichero inexistente, fichero ilegible, `run` sin tercer parámetro (técnica 5) → tres escenarios nuevos.
- **Aceptado** — quién muta `state`, `estadoInicial()`, `libres` y cuándo se guarda (técnica 6) → decisiones 8 y 11.
- **Aceptado** — un solo fichero y `.gitignore` inexistente (técnica 7) → decisiones 8 y 12.
- **Aceptado** — sala inexistente, parámetros, rama semanal (técnica 8) → decisión 3.
- **Aceptado** — separar carga y guardado del import y cómo se lanza el test del CLI (técnica 10) → decisiones 11 y 12.
- **Rechazado** — slug `waitlist` frente al artículo 4 (dominio 9, Menor) → el nombre del fichero va en inglés por la regla 1 de `capability-template.md`; el contenido sí va en castellano.
- **Rechazado** — nacer vacío en lugar de con la reserva de ejemplo (dominio 7, parte) → sin ella `libres` dejaría de dar `Sur` y rompe el test actual; decisión 8.

Segunda ronda (un revisor sonnet):

- **Aceptado** — `run` sin estado: el escenario pasaba sin la feature (1) → ahora comprueba que una llamada no contamina la siguiente.
- **Aceptado** — misma sala con dos franjas que empiezan a la misma hora (3) → decisión 7 y escenario nuevo.
- **Aceptado** — contradicción «salvo uno» frente a tres ejecuciones del CLI (4) → decisión 11: cuatro, cada uno en su carpeta.
- **Aceptado** — error del fichero ilegible en inglés (5) → aviso en castellano, error estándar y código 1; decisión 8, Avisos y escenario.
- **Aceptado** — `libres` no escribe, sin escenario (6) → escenario nuevo; `libres` ilegible falla igual.
- **Aceptado** — parámetros incompletos, JSON de otra forma, `cancelar` que no cambia nada (7, 8) → decisión 8 (se guarda solo si hubo cambio) y escenario de `reservar Norte lun`.
- **Aceptado** — orden de las cláusulas y Scope (9, 10) → «el orden de `bookings`» y `libres` y el código de salida en «Entra».
- **Rechazado como cambio de la spec, sigue pendiente** — la premisa de un solo usuario (2, decisión 16) → es un hecho que solo conoces tú (de quién es la reserva que se libera); no lo invento. Se te pregunta al aprobar. Sin tercera ronda.

### Decisiones tomadas con el dev-lead

- Carril y perfil: feature, modo full, perfil `delegate` — «sí, adelante: feature full con delegate».
- Para qué: la lista existe porque «cuando Norte está ocupada tengo que volver a mirar libres a mano cada rato».
- Qué pasa al liberarse: promoción automática, opción 1️⃣ de «¿Qué pasa cuando la sala se libera?» — «sí, adelante» (respuesta a la pregunta con 1️⃣ recomendada; si no era esa tu intención, la 6 cambia).

## Intent

Hoy, cuando una sala está ocupada en la franja que quieres, no hay forma de «guardar tu turno»: tienes que repetir `libres` hasta que aparezca. Se quiere que pedir una sala ocupada deje una espera y que, al cancelarse con esta herramienta la reserva que la ocupaba, la espera pase a reserva sin que tengas que mirar. Éxito: con Norte reservada el lun 10:00-12:00 y una espera de Norte para esa franja, `cancelar lun 10:00` deja la espera vacía y `libres 10:00-12:00` responde `Sur` (sin la promoción respondería `Norte, Sur`). Fracaso aunque funcione: que la espera se pierda entre dos comandos, o que cancelar otro día promueva una espera que no era. Supuesto sin confirmar: decisión 16.

## Scope

- Entra: `reservar <sala> <día> <franja>` (libre → reservada; ocupada → en espera; sala inexistente → aviso), `cancelar` que quita reservas y promueve esperas, `libres` que lee el estado (y falla con código 1 si el fichero es ilegible), el fichero `salas-datos.json` dentro de `src/app.js`, el tercer parámetro opcional de `run`, el `.gitignore` nuevo y la línea del `CHANGELOG.md`.
- No entra: avisos por correo (es la 0008), cancelar una espera, listar las esperas, caducidad de la espera, solape de franjas distintas, que `libres` mire el día (hoy solo filtra por franja), varios usuarios y la reserva semanal.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar` solo imprime y no quita reservas | `src/app.js:12` | decisión 7 |
| Reservas fijas en una constante de módulo | `src/app.js:3` (y `freeRooms`, `src/app.js:6`) | decisiones 8 y 11: pasan a `state` |

- Filas que implementa: nada: comprobado con `git grep -n -i -E "espera|waitlist|0010" -- . ':!.docs/sdd/changes'` (solo `debt.md` «En espera», que es otra cosa); `ROADMAP.md` no tiene fila 0010.

## Approach

- A. Estado solo en memoria — no cuesta código, pero cada `node src/app.js …` es un proceso nuevo: la espera no sobrevive al comando y la promoción no llega a ocurrir nunca.
- B. Un fichero JSON con reservas y esperas, dentro de `app.js` — carga y guardado de unas pocas líneas y `run(cmd, params, state)`; cuesta tocar `cancelar`, que hoy no hace nada.
- C. Solo las esperas en fichero y las reservas en memoria — la promoción crea una reserva que se pierde al terminar el proceso, así que no cumple lo que se quiere.
- Elegido: B — es la única donde el caso «cancelo y la sala queda mía» funciona entre comandos.

`run` muta `state` y devuelve el texto como hoy; el punto de entrada, solo con un comando, carga `salas-datos.json` (o lo crea con la reserva de ejemplo), llama a `run` y guarda tras `reservar` y `cancelar`.

## Dónde se prueba

- Reservar libre, ocupada, repetida, sala inexistente y franja solapada: por `run(...)` con un estado propio, como los tres tests actuales, aseverando el texto y el estado (`bookings`, `waiting`).
- Promoción, cancelar sin espera, cancelar otro día, cancelar lo que no existe y cancelar con dos salas: por `run(...)`, con un estado con reservas y esperas.
- Fichero (nace con la reserva de ejemplo, sobrevive entre comandos, ilegible): ejecutando `node src/app.js` en una carpeta temporal.
- `run` sin tercer parámetro: los tres tests actuales, sin tocar.

## Términos y ADR

- Términos resueltos: espera — petición de una sala ocupada que pasa a reserva si se cancela la reserva que la ocupaba.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `waitlist`

#### ADDED — Reservar una sala libre la reserva

- GIVEN Norte sin reserva el mar de 14:00-16:00
- WHEN `reservar Norte mar 14:00-16:00`
- THEN responde `reservada Norte mar 14:00-16:00`
- AND `bookings` contiene Norte, mar, 14:00-16:00 y `libres 14:00-16:00` responde `Sur`

#### ADDED — Reservar una sala que no existe avisa

- GIVEN las salas Norte y Sur
- WHEN `reservar Oeste lun 10:00-12:00`
- THEN responde `sala desconocida: Oeste`
- AND no cambia ni `bookings` ni `waiting`

#### ADDED — Reservar una sala ocupada entra en espera

- GIVEN Norte reservada el lun de 10:00-12:00
- WHEN `reservar Norte lun 10:00-12:00`
- THEN responde `Norte ocupada; en espera`
- AND `bookings` no cambia y `waiting` contiene Norte, lun, 10:00-12:00

#### ADDED — Una franja distinta no está ocupada

- GIVEN Norte reservada el lun de 10:00-12:00
- WHEN `reservar Norte lun 10:00-11:00`
- THEN responde `reservada Norte lun 10:00-11:00`
- AND `waiting` sigue vacía

#### ADDED — La espera no se duplica

- GIVEN Norte reservada el lun de 10:00-12:00 y Norte en espera para ese lun 10:00-12:00
- WHEN `reservar Norte lun 10:00-12:00`
- THEN responde `Norte ya en espera lun 10:00-12:00`
- AND `waiting` contiene una sola entrada

#### ADDED — Cancelar una reserva promueve la espera

- GIVEN Norte reservada el lun de 10:00-12:00 y Norte en espera para ese lun 10:00-12:00
- WHEN `cancelar lun 10:00`
- THEN responde `cancelada lun 10:00; Norte lun 10:00-12:00 reservada desde la espera`
- AND `waiting` queda vacía, `bookings` contiene Norte, lun, 10:00-12:00 y `libres 10:00-12:00` responde `Sur`

#### ADDED — Cancelar sin espera libera la sala

- GIVEN Norte reservada el lun de 10:00-12:00 y ninguna espera
- WHEN `cancelar lun 10:00`
- THEN responde `cancelada lun 10:00`
- AND `libres 10:00-12:00` responde `Norte, Sur`

#### ADDED — Cancelar otro día no promueve

- GIVEN Norte reservada el lun y el mar de 10:00-12:00, y Norte en espera para el mar 10:00-12:00
- WHEN `cancelar lun 10:00`
- THEN responde `cancelada lun 10:00`
- AND `bookings` conserva Norte, mar, 10:00-12:00 y `waiting` conserva la espera del mar

#### ADDED — Cancelar lo que no existe responde como hoy

- GIVEN ninguna reserva el mar a las 10:00
- WHEN `cancelar mar 10:00`
- THEN responde `cancelada mar 10:00`
- AND no cambia ni `bookings` ni `waiting`

#### ADDED — Cancelar varias reservas a la misma hora promueve cada espera

- GIVEN Norte y Sur reservadas el lun de 10:00-12:00, y esperas de Norte y de Sur para esa franja
- WHEN `cancelar lun 10:00`
- THEN responde `cancelada lun 10:00; Norte lun 10:00-12:00 reservada desde la espera; Sur lun 10:00-12:00 reservada desde la espera`
- AND `waiting` queda vacía y `bookings` contiene las dos reservas

#### ADDED — Los datos nacen con la reserva de ejemplo

- GIVEN una carpeta sin `salas-datos.json`
- WHEN se ejecuta `node src/app.js reservar Norte lun 10:00-12:00` en ella
- THEN responde `Norte ocupada; en espera`
- AND `salas-datos.json` existe y contiene la reserva de Norte, lun, 10:00-12:00 y la espera

#### ADDED — La espera sobrevive entre comandos

- GIVEN `node src/app.js reservar Norte lun 10:00-12:00` ejecutado en una carpeta sin fichero, que dejó la espera, en un proceso que ya terminó
- WHEN se ejecuta `node src/app.js cancelar lun 10:00` en otro proceso, en la misma carpeta
- THEN responde `cancelada lun 10:00; Norte lun 10:00-12:00 reservada desde la espera`

#### ADDED — Un fichero ilegible no se sobrescribe

- GIVEN un `salas-datos.json` con el texto `no es json`
- WHEN se ejecuta `node src/app.js reservar Norte lun 10:00-12:00` en esa carpeta
- THEN el proceso escribe `salas-datos.json ilegible` por el error estándar y sale con código 1
- AND `salas-datos.json` conserva exactamente `no es json`

#### ADDED — Consultar las salas libres no escribe el fichero

- GIVEN una carpeta sin `salas-datos.json`
- WHEN se ejecuta `node src/app.js libres 10:00-12:00` en ella
- THEN responde `Sur`
- AND `salas-datos.json` no existe

#### ADDED — `run` sin estado empieza siempre de la reserva de ejemplo

- GIVEN dos llamadas seguidas a `run` sin tercer parámetro
- WHEN la primera es `run('reservar', ['Norte', 'mar', '14:00-16:00'])` y la segunda `run('libres', ['14:00-16:00'])`
- THEN la segunda responde `Norte, Sur`

#### ADDED — Cancelar varias reservas de la misma sala que empiezan a la misma hora

- GIVEN Norte reservada el lun de 10:00-11:00 y de 10:00-12:00, y Norte en espera para el lun 10:00-12:00
- WHEN `cancelar lun 10:00`
- THEN responde `cancelada lun 10:00; Norte lun 10:00-12:00 reservada desde la espera`
- AND `bookings` contiene solo Norte, lun, 10:00-12:00

#### ADDED — `reservar` con parámetros incompletos responde como hoy

- GIVEN una carpeta sin `salas-datos.json`
- WHEN se ejecuta `node src/app.js reservar Norte lun` en ella
- THEN responde `salas`
- AND `salas-datos.json` no existe

#### Reglas de la capacidad — waitlist

- **Dónde viven los datos**: `salas-datos.json`, en la carpeta desde la que se ejecuta, con `{"bookings": [...], "waiting": [...]}`; sin escritura atómica.
- **Idioma de los nombres**: castellano (comandos, días `lun`, `mar`… y mensajes), según el artículo 4 de la constitution; las claves del fichero (`room`, `day`, `slot`) siguen las que ya usa el código.
- **Límites**: una espera por sala, día y franja; sin tope de esperas ni caducidad; una persona y un proceso a la vez.
- **Avisos**: `reservada Norte mar 14:00-16:00` · `Norte ocupada; en espera` · `Norte ya en espera lun 10:00-12:00` · `sala desconocida: Oeste` · `cancelada lun 10:00` · `cancelada lun 10:00; Norte lun 10:00-12:00 reservada desde la espera` (una cláusula `; <sala> <día> <franja> reservada desde la espera` por cada espera promovida, en el orden de `bookings`) · `salas-datos.json ilegible` (error estándar, código 1).
- **Regla ante conflicto**: manda la reserva existente; solo cuenta como ocupada la misma sala, día y franja escrita igual; la espera solo pasa a reserva al cancelarse la reserva que ocupaba esa sala, día y franja.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
