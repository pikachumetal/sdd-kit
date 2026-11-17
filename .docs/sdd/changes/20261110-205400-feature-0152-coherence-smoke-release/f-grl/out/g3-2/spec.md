---
id: 20261112-134229-feature-0010-lista-espera
feature: 0010
title: Lista de espera para una sala ocupada
mode: full
profile: delegate
status: draft
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Lista de espera para una sala ocupada

🦆 Cuando la sala que quieres está ocupada, te apuntas con `esperar Norte lun 10:00-12:00` y dejas de mirar `libres` a mano. Cuando cancelas esa reserva (`cancelar lun 10:00`), el propio comando te dice «se ha cancelado la reserva de Norte del lun 10:00-12:00 que esperabas; te quito de la espera». Con `esperas` ves lo que tienes apuntado y con `salir-de-espera` te quitas. Las esperas se guardan en un fichero, porque cada comando es un proceso nuevo y la memoria no sobrevive entre uno y otro. Ojo: hoy `cancelar` solo imprime un texto y no libera la sala de verdad, y esta feature no lo cambia, así que `libres` seguirá viendo la sala ocupada.

Validación: dev-lead — es lo que usa una persona desde la terminal y el texto de los avisos lo juzga quien lo lee.

## Capacidades

- Nuevas: `room-waitlist` — apuntarse, ver y quitarse de la espera de una sala ocupada, y el aviso cuando se cancela su reserva.
- Modificadas: ninguna.
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`room-waitlist`), datos persistentes nuevos (`esperas.json`), regla de flujo (a quién se avisa y cuándo se le quita de la espera) · tamaño: ~90 líneas en 4 ficheros (`src/app.js`, `test/app.test.js`, `README.md`, `.gitignore`; la capacidad la crea el cierre)
- Dominio (opus): si «avisar y quitar de la espera al cancelar» deja huecos con varias esperas el mismo día o con `cancelar` sin sala, y si los textos del THEN bastan para que no te quedes esperando algo que ya no vendrá (señal: regla de flujo)
- Técnica (sonnet): si `esperas.json` sobrevive entre procesos, qué pasa con el fichero ausente o corrupto, y si `cancelar lun 10:00` casa de verdad con la franja `10:00-12:00` (señal: datos nuevos)
- Mínimo razonable: un solo revisor técnico — deja sin mirar si el aviso al cancelar cubre dos esperas el mismo día, el hueco que más duele a quien espera

1. Capacidad nueva `room-waitlist` (slug en inglés kebab-case, contenido en castellano) — el comportamiento no cabe en ninguna capacidad existente: no hay `capabilities/`. El fichero lo crea el cierre al fusionar el delta, no se escribe a mano.
2. Comandos `esperar <sala> <día> <franja>`, `esperas`, `salir-de-espera <sala> <día> <franja>` — nadie los nombró; siguen el estilo de `libres`, `reservar` y `cancelar`.
3. Persistencia en un fichero JSON, `esperas.json` en el directorio de trabajo, o la ruta de la variable `SALAS_ESPERAS`, que se lee en cada llamada a `run` (así cada test apunta a un fichero temporal) — decisión mía que corrige mi propuesta anterior de este chat («en memoria»): cada comando es un proceso nuevo, así que una espera en memoria desaparecería antes del `cancelar` y no serviría para lo que pides. El contenido es una lista JSON de `{"room","day","slot"}`; claves y slug en inglés como identificadores internos, textos y comandos en castellano.
4. «Ocupada» = existe una reserva con esa sala, ese día y **esa franja exacta**. Una franja parcial (`10:00-11:00` con la reserva de `10:00-12:00`) cuenta como sin reserva: se dice que reserves directamente. Límite declarado, no una omisión: no hay solape de franjas.
5. Sala que no existe → `no existe la sala Este`, tanto en `esperar` como en `salir-de-espera`.
6. Una sola entrada por sala, día y franja: repetir `esperar` dice `ya estás en la espera de Norte lun 10:00-12:00` y no duplica.
7. **El aviso sale de la reserva cancelada, no de la espera** — corrige un hueco que vieron los dos revisores: `cancelar <día> <hora>` busca las reservas de `bookings` de ese día cuya franja empieza a esa hora (la sala sale de la reserva, no hace falta que la pases), y solo avisa de las esperas de esas mismas sala, día y franja. Sin reserva que case, `cancelar` devuelve su texto de hoy y no toca ninguna espera: no hay aviso falso.
8. ⚠ **Valor reducido — valida esta la primera.** Hoy `cancelar` solo imprime un texto: no quita la reserva de `bookings` (una constante en memoria) y `libres` seguirá viéndola ocupada. Como eres el único usuario y el aviso sale al teclear tú `cancelar`, esta feature **no entrega del todo tu motivo** («no volver a mirar `libres`»): solo te recuerda, al cancelar, que esperabas esa sala. Entregarlo de verdad exige que `cancelar` libere la sala y que las reservas se guarden en disco, que es otra feature y la dejo fuera de Scope. Tú decides: aprobar con este valor reducido, o pedirme que esa otra feature vaya antes.
   Texto del aviso: `se ha cancelado la reserva de Norte del lun 10:00-12:00 que esperabas; te quito de la espera`. No dice «ha quedado libre» porque `libres` puede seguir mostrándola ocupada: afirma solo lo que la herramienta sabe.
9. Tras avisar, la espera se borra: eres el único usuario y el aviso ya lo has leído; dejarla te avisaría otra vez en la siguiente cancelación. El texto dice que te quita.
10. El día es el de la semana (`lun`) y la espera es recurrente por diseño: dura hasta el aviso o hasta `salir-de-espera`, no caduca el lunes. No valido formatos de día ni de franja (`xyz`, `12:00-10:00`): ya está en la deuda («Sin validación del formato de franja horaria») y no entra aquí.
11. El aviso solo existe cuando cancelas con el comando: si la reserva se libera por otro camino, no te avisa. No hay vigilancia ni correo (el correo es la 0008).
12. Al cancelarse, solo se avisa; no se reserva sola — decisión mía: es la opción que te recomendé y tu «sí, adelante» no eligió otra expresamente; valídala.
13. Fichero ausente = lista vacía y nunca se crea al leer ni al cancelar sin aviso; fichero corrupto, o un JSON válido que no es una lista = `esperas.json no es un JSON válido: bórralo o arréglalo` devuelto como texto (no se lanza), sin tocar el fichero. `cancelar` solo lee el fichero si hay una reserva que casa: sin ella devuelve su texto de hoy y no lo lee; con ella y fichero corrupto, ese texto va como segunda línea tras `cancelada …`.
14. `esperas` con varias entradas: una por línea, en el orden en que se apuntaron. Con una sola reserva en `bookings`, un `cancelar` avisa como mucho de una espera: no declaro orden de avisos múltiples.
18. Orden de las comprobaciones en `esperar` y `salir-de-espera`: primero que la sala exista, luego leer el fichero, luego si está ocupada. Sin validación de argumentos ausentes (`esperar Norte`) — como la de formatos, queda fuera.
19. `esperas.json` va a un `.gitignore` nuevo: es estado de uso, no del repositorio.
15. Los textos literales de los THEN son míos: nadie los dijo.
16. Enfoque: A (fichero JSON + aviso en `cancelar`), frente a B (`esperar` se queda bloqueado comprobando hasta que se libera) y C (solo en memoria). Ver Approach.
17. Repaso de coherencia hecho tras la segunda ronda: `sdd capability merge` sobre una copia sale con 0 y crea `room-waitlist.md`; `git grep -n cancelar -- src test README.md ROADMAP.md` solo da `src/app.js:12` y `test/app.test.js:13-14`.
- Política de modelos: revisores de la spec — dominio opus, técnica sonnet, segunda ronda un revisor sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario.

### Hallazgos de la review

- **Aceptado** — Crítico (dominio): `cancelar` sin sala avisa y borra las esperas de dos salas a la misma hora → el aviso sale de las reservas que casan, solo de sus sala/día/franja (✋ 7); escenario con Norte y Sur el mismo lunes.
- **Aceptado** — Crítico (dominio): el aviso decía «ha quedado libre» y `libres` lo contradice → texto sin ese claim, límite declarado en la 🦆, el Scope y ✋ 8.
- **Aceptado** — Crítico (dominio): `cancelar` sin reserva avisaría en falso → sin reserva que case, ni aviso ni cambio (✋ 7, escenario nuevo).
- **Aceptado** — Crítico (técnica): casado de `cancelar` solo con el caso feliz → escenarios negativos (`cancelar lun 10:30`, `cancelar mar 10:00`) y la regla del prefijo `<hora>-`.
- **Aceptado** — Crítico (técnica): fichero corrupto o ausente sin escenario → dos escenarios, con texto devuelto y no lanzado (✋ 13).
- **Aceptado** — Importante (técnica): formato del fichero y «ocupada» con día → el AND fija el JSON; escenario `esperar Norte mar 10:00-12:00`.
- **Aceptado** — Importante (técnica): ruta leída en cada `run`, tests con directorio temporal, `cancelar` pasa a tener efectos de disco, y un test entre procesos de verdad con `node src/app.js` → ✋ 3, tabla de cambios de forma y «Dónde se prueba».
- **Aceptado** — Importante (dominio): franjas parciales, esperas recurrentes y formatos → ✋ 4 y 10.
- **Aceptado** — Menor: orden de `esperas`, `salir-de-espera` con sala inexistente, idioma de claves, el fichero de la capacidad no se escribe a mano, no crear el fichero al leer → ✋ 1, 5, 13 y 14 y reglas.
- **Aceptado** — Crítico (2.ª ronda): la feature no entrega del todo el motivo del dev-lead → declarado como «Valor reducido» en ✋ 8 para que lo valide primero; no cambia el Scope sin su decisión.
- **Aceptado** — Crítico (2.ª ronda): atribuciones al dev-lead que no constan → ✋ 3 y 12 reescritas como decisiones mías.
- **Aceptado** — Importante (2.ª ronda): aviso múltiple imposible con una reserva, `cancelar` sin reserva y fichero corrupto, orden de comprobaciones, argumentos ausentes, `.gitignore`, test del efecto de disco → ✋ 13, 14, 18, 19, escenarios y «Dónde se prueba».
- **Aceptado** — Menor (2.ª ronda): cuenta de ficheros, Límites y Avisos completos, repaso con `README.md` → ✋ 17 y reglas.
- **Rechazado** — Importante (dominio): «avisar a las esperas que se solapan» → no hay solape: se declara como límite (✋ 4); con un único usuario y una sala de dos franjas, el coste de implementarlo supera lo que da.

### Decisiones tomadas con el dev-lead

- Carril feature, modo full, perfil delegate — «sí, adelante: feature full con delegate»
- Motivo: no volver a mirar `libres` a mano cuando Norte está ocupada — «cuando Norte está ocupada tengo que volver a mirar libres a mano cada rato»

## Intent

Hoy `libres 10:00-12:00` dice qué salas están libres en una franja y, si la que quieres está ocupada, la única forma de enterarte de que se libera es volver a mirar. Se quiere dejar apuntada la espera una vez y que la herramienta avise cuando esa reserva se cancele. Éxito: tras `esperar Norte lun 10:00-12:00`, un `cancelar lun 10:00` posterior (otro proceso) dice que se ha cancelado la reserva de Norte de ese día y esa franja. Fracaso aunque funcione: que la espera desaparezca entre comandos, o que avise de una sala que no era la tuya o de una cancelación que no existió.

## Scope

- Entra: los tres comandos `esperar`, `esperas` y `salir-de-espera`; el fichero `esperas.json`; el aviso en la salida de `cancelar`, que pasa a leer las reservas y el fichero; la capacidad `room-waitlist`; una línea en `README.md` con los comandos; un `.gitignore` con `esperas.json`.
- No entra: validar argumentos ausentes; que `cancelar` quite de verdad la reserva de la lista `bookings` (hoy solo devuelve un texto y `libres` sigue viendo la reserva); reservar solo al liberarse; avisos fuera del comando `cancelar` (vigilancia, correo — 0008); esperar «cualquier sala»; solape de franjas; validar formatos de día y franja.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Salida de `cancelar <día> <hora>` cuando hay una reserva que casa y una espera | `src/app.js:12`, `test/app.test.js:13-14` («cancelar respeta el día») | Scope y delta: sin reserva o sin espera que casen la salida es la de hoy, `cancelada mar 10:00`; el test actual se queda igual y corre con `SALAS_ESPERAS` temporal |
| `cancelar` deja de ser puro: lee `bookings` y el fichero | `src/app.js:12` | Scope: sin reserva que case, `cancelar` no lee el fichero; con ella, lo lee, y solo lo escribe si hay una espera que avisar; nunca lo crea si no existe |

- Filas que implementa: nada: comprobado con `git grep -niE "espera|waitlist" -- ROADMAP.md src test` (sin hits; solo la tabla «En espera» de `debt.md`, que es otra cosa); el id 0010 no tiene fila en `ROADMAP.md`.

## Approach

- A. Fichero JSON + aviso dentro de `cancelar` — ramas nuevas en `run` y dos funciones pequeñas para leer y escribir `esperas.json`; se prueba con `run(...)` como los tests actuales.
- B. `esperar` queda bloqueado repitiendo la comprobación hasta que la sala se libere — responde mejor a «no volver a mirar», pero las reservas están en una constante en memoria que nadie cambia desde fuera: nunca vería la sala libre, y deja una terminal ocupada.
- C. Esperas solo en memoria — no sobreviven al proceso, así que `cancelar` nunca las vería.
- Elegido: A — es la única que entrega el aviso con el diseño actual de la herramienta (un proceso por comando).

Las esperas son una lista de `{ room, day, slot }`. `cancelar <día> <hora>` busca las reservas de ese `day` cuyo `slot` empieza por `<hora>-`; por cada una busca las esperas con su misma sala, día y franja, las avisa y las borra. La ruta del fichero se resuelve dentro de `run` en cada llamada.

## Dónde se prueba

- Apuntarse, ver, salir y avisar: con `run(cmd, params)` como los tests actuales de `test/app.test.js`; cada test crea un directorio temporal, apunta `SALAS_ESPERAS` a un fichero suyo y lo borra al terminar. Ningún test usa la ruta por defecto. «Sin fichero no se crea» se comprueba en ese directorio temporal con `SALAS_ESPERAS` apuntando a una ruta que no existe, y después se verifica que sigue sin existir.
- «Entre procesos»: un test que lanza `node src/app.js esperar Norte lun 10:00-12:00` y luego `node src/app.js cancelar lun 10:00` con `execFileSync` y `SALAS_ESPERAS` en el `env`, y comprueba la salida del segundo: no comparte memoria con el primero.

## Términos y ADR

- Términos resueltos: espera — apunte de querer una sala, día y franja con reserva; ocupada — con reserva en esa sala, día y franja exacta.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-waitlist`

#### ADDED — Apuntarse a la espera de una sala ocupada

- GIVEN Norte reservada el lun 10:00-12:00 y `esperas.json` vacío
- WHEN `esperar Norte lun 10:00-12:00`
- THEN responde `te apunto en la espera de Norte lun 10:00-12:00`
- AND `esperas.json` es, tal cual al leerlo con `JSON.parse`, `[{"room":"Norte","day":"lun","slot":"10:00-12:00"}]`

#### ADDED — Esperar una sala sin reserva o inexistente

- GIVEN Sur sin reserva el lun 10:00-12:00 y Norte reservada solo el lun 10:00-12:00
- WHEN `esperar Sur lun 10:00-12:00`
- THEN responde `Sur está libre el lun 10:00-12:00: reserva directamente` y no apunta nada
- AND `esperar Norte mar 10:00-12:00` responde `Norte está libre el mar 10:00-12:00: reserva directamente`
- AND `esperar Norte lun 10:00-11:00` responde `Norte está libre el lun 10:00-11:00: reserva directamente`
- AND `esperar Este lun 10:00-12:00` responde `no existe la sala Este`

#### ADDED — No duplicar la espera

- GIVEN `Norte lun 10:00-12:00` ya en la espera
- WHEN `esperar Norte lun 10:00-12:00`
- THEN responde `ya estás en la espera de Norte lun 10:00-12:00` y el fichero sigue con una sola entrada

#### ADDED — Ver las esperas

- GIVEN las esperas `Norte lun 10:00-12:00` y después `Sur mar 14:00-16:00`
- WHEN `esperas`
- THEN responde dos líneas, `Norte lun 10:00-12:00` y `Sur mar 14:00-16:00`, en ese orden
- AND sin ninguna espera, o con `esperas.json` ausente, responde `sin esperas` y no crea el fichero

#### ADDED — Salir de la espera

- GIVEN la espera `Norte lun 10:00-12:00`
- WHEN `salir-de-espera Norte lun 10:00-12:00`
- THEN responde `te quito de la espera de Norte lun 10:00-12:00` y el fichero queda sin esa entrada
- AND repetirlo responde `no estabas en la espera de Norte lun 10:00-12:00`
- AND `salir-de-espera Este lun 10:00-12:00` responde `no existe la sala Este`

#### ADDED — Avisar al cancelar una reserva esperada

- GIVEN la reserva de Norte del lun 10:00-12:00 y las esperas `Norte lun 10:00-12:00`, `Sur lun 10:00-12:00` y `Sur mar 10:00-12:00` (las de Sur se siembran escribiendo el fichero a mano, porque `esperar` no las crearía: Sur está sin reserva)
- WHEN `cancelar lun 10:00`
- THEN responde `cancelada lun 10:00` y una segunda línea `se ha cancelado la reserva de Norte del lun 10:00-12:00 que esperabas; te quito de la espera`
- AND la espera de Norte se borra del fichero y las dos de Sur siguen

#### ADDED — Cancelar sin aviso cuando nada coincide

- GIVEN la reserva de Norte del lun 10:00-12:00 y la espera `Norte lun 10:00-12:00`
- WHEN `cancelar lun 10:30`, o `cancelar mar 10:00`
- THEN responde solo `cancelada lun 10:30` (o `cancelada mar 10:00`)
- AND la espera sigue en el fichero
- AND sin ninguna espera y sin `esperas.json`, `cancelar lun 10:00` responde solo `cancelada lun 10:00` y no crea el fichero

#### ADDED — Fichero de esperas corrupto

- GIVEN `esperas.json` con el contenido `{no`
- WHEN `esperas`, `esperar Norte lun 10:00-12:00` o `salir-de-espera Norte lun 10:00-12:00`
- THEN responde `esperas.json no es un JSON válido: bórralo o arréglalo` y el fichero queda como estaba
- AND `cancelar lun 10:00` responde `cancelada lun 10:00` y una segunda línea con ese mismo texto
- AND con el mismo fichero, `cancelar mar 10:00` responde solo `cancelada mar 10:00`
- AND con el contenido `{}` (JSON válido que no es una lista) responde lo mismo que con `{no`

#### Reglas de la capacidad — room-waitlist

- **Dónde viven los datos**: `esperas.json` en el directorio de trabajo, o la ruta de `SALAS_ESPERAS`, leída en cada llamada
- **Idioma de los nombres**: castellano en los textos y en los comandos; slug de la capacidad y claves del JSON en inglés, como identificadores internos
- **Límites**: una entrada por sala, día y franja; «ocupada» exige la franja exacta de una reserva; la espera dura hasta el aviso o hasta `salir-de-espera`; sin validación de formatos de día ni de franja ni de argumentos ausentes; solo `cancelar` avisa, y el aviso no afirma que la sala esté libre
- **Avisos**: los textos de los escenarios de arriba, todos literales; ninguno dice que la sala está libre tras cancelar
- **Regla ante conflicto**: apuntarse dos veces no duplica; cancelar avisa solo de las esperas con la misma sala, día y franja que una reserva cancelada; en `esperar` y `salir-de-espera` se comprueba primero la sala, luego el fichero, luego la ocupación

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
