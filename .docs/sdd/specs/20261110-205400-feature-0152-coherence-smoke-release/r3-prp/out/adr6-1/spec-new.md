---
id: 20261111-191322-feature-0012-reservas-persistentes
feature: 0012
title: Las reservas sobreviven a cerrar la terminal
mode: full
status: draft
created: 2026-11-11
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Las reservas sobreviven a cerrar la terminal

🦆 Hoy cada `node src/app.js …` arranca con las reservas de fábrica y las olvida al terminar: si cancelas `Norte lun` y en otro comando preguntas `libres 10:00-12:00`, sigue saliendo `Sur`, como si no hubieras cancelado. Con el cambio, las reservas se guardan en un fichero de tu carpeta personal cada vez que cancelas o anulas de verdad, y el siguiente arranque las lee: ese mismo `libres 10:00-12:00` saldrá `Norte, Sur`. Si el fichero está roto, o no se puede guardar, `salas` lo dice por el canal de errores, sale con código 1 y no pisa lo que había. Ojo: `reservar` hoy no crea ninguna reserva (solo contesta un texto), así que lo que sobrevive son las cancelaciones y anulaciones de las reservas existentes; hacer que `reservar` cree de verdad queda fuera.

Validación: dev-lead — es una herramienta que usa una persona desde la terminal; lo que importa es cerrarla y abrirla de verdad.

## Capacidades

- Nuevas: `booking-persistence` — dónde se guardan las reservas, cuándo se escriben y qué pasa si el fichero falta, no se puede leer o no se puede guardar.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: full, dos revisores — señales: capacidad nueva · datos persistentes nuevos · formato de fichero que el programa lee en cada arranque · tamaño: ~130 líneas en 8 ficheros (`store.js`, `app.js`, tests, dos ADR, `operations.md`, `architecture.md` y la capacidad)
- Dominio (sonnet): si los escenarios de «Sin fichero», «ilegible» y «guardado fallido» y sus textos cubren lo que alguien que usa `salas` espera ver, y si «gana la última escritura» es aceptable con dos terminales (señal: capacidad nueva + datos)
- Técnica (sonnet): si `SALAS_FILE`, la escritura atómica y el campo `version` bastan para migrar el fichero sin romper `src/app.js` ni las pruebas actuales que importan `run` (señal: formato de fichero)
- Mínimo razonable: solo técnica — deja sin mirar si el comportamiento ante un fichero roto es el que esperaría quien lo usa

1. **Cerrar la terminal = acabar cada comando.** `salas` no tiene sesión: cada `node src/app.js <comando>` es un proceso nuevo, así que «sobrevivir a cerrar la terminal» exige guardar tras cada comando que cambia reservas, no al salir. — es lo que el código hace hoy; la ADR 0004 hablaba de «reserva y la cierra» pero el programa nunca tuvo sesión.
2. **Fichero y ruta**: `<os.homedir()>/.salas/reservas.json`; la variable de entorno `SALAS_FILE` lo sustituye, y vacía cuenta como no definida. Al guardar se crea la carpeta si no existe. — carpeta personal porque funciona desde cualquier directorio, sin tocar el repo ni pedir configuración; `SALAS_FILE` la usan los tests.
3. **ADR nueva, no editar la vieja.** La ADR 0004 (en memoria) se sustituye por la 0007 `persisted-state` y la 0004 pasa a `superseded by 0007`. Se escribe, junto con el `superseded by 0007` de la 0004, **en la misma primera task, antes de crear `store.js`** (antes de que `src/` importe `node:fs`), y no en el cierre: la «Confirmación» de la 0004 (`src/` no importa `node:fs`) dejaría de ser verdad en cuanto entre el código. La «Confirmación» de la 0007 es un test que comprueba que solo `src/store.js` importa `node:fs`. — la plantilla las deja al cierre; aquí esperar contradeciría una ADR aceptada durante toda la implementación.
4. **Formato**: `{"version": 1, "bookings": [{"room","day","slot","status"}]}`, mismos campos y estados (`active`, `cancelled`, `voided`) que en memoria. Las claves `room` y `booking(s)` son técnicas del fichero: no cambian la terminología del producto (`PRODUCT.md`: «Sala», «Reserva»). — el `version` deja la puerta a migrar sin decidirlo ahora.
5. **Solo se guarda si algo cambió**: `cancelar` y `anular` guardan solo cuando de verdad cambian el estado de una reserva; `cancelar Sur lun` y `anular Sur lun` (que contestan `sin reserva Sur lun`), `libres`, `reservar` y un comando desconocido no escriben ni crean fichero. El cambio se detecta comparando `JSON.stringify(bookings)` antes y después de `run`, sin tocar `run`. — evita ficheros por consultar o por intentos sin efecto.
6. **Sin fichero = estado inicial de hoy** (una reserva `Norte lun 10:00-12:00` activa), y el fichero nace en el primer cambio. Borrar el fichero devuelve a ese estado: las reservas de fábrica «resucitan». — mantiene las pruebas y el comportamiento actuales; que esa reserva de ejemplo exista es lo que hay hoy, no lo toco.
7. **«Ilegible»** significa cualquiera de: no es JSON; no es un objeto con `version` igual a `1` y `bookings` como lista (un `version` distinto, p. ej. `2`, es ilegible, no se interpreta); una entrada sin `room`, `day` o `slot` como texto o con un `status` que no es `active`, `cancelled` ni `voided`; la ruta es un directorio o no se puede leer (con **una excepción**: `ENOENT` y `ENOTDIR` al leer significan «no existe» y dan el estado inicial; si la ruta cuelga de un fichero, falla después al guardar, decisión 8). Aplica a **cualquier comando**, `libres` incluido, porque el fichero se lee antes de ejecutarlo. Salida **literal por el canal de errores** `no puedo leer las reservas de <ruta>: arréglalo o bórralo`, código de salida 1, y el fichero queda intacto. — nunca perder datos por pisar un fichero que no entiendo.
8. **Guardado fallido**: si no se puede escribir (carpeta sin permisos, la ruta cuelga de un fichero, disco lleno), por el canal de errores `no puedo guardar las reservas en <ruta>: <motivo>`, código de salida 1, con `<motivo>` **en castellano** (la ADR 0002 prohíbe mensajes en inglés en `src/`, así que no se pasa el texto de Node tal cual): `sin permiso` (`EACCES`, `EPERM`), `la ruta cuelga de algo que no es una carpeta` (`ENOTDIR`, `EEXIST`), `disco lleno` (`ENOSPC`) y `error de escritura (<código>)` para cualquier otro, **y no se imprime** `cancelada …` ni `anulada …`: se guarda antes de imprimir el resultado, para no decir algo que no ocurrió. — la persona debe poder fiarse de lo que lee.
9. **Dos terminales a la vez: gana la última escritura**, sin bloqueo ni relectura antes de guardar. Ejemplo de lo que se acepta: la terminal A lee, la B cancela `Norte lun` y guarda, la A anula `Sur mar` y guarda con su lista vieja: la cancelación de la B se pierde. — nadie lo ha pedido y es el caso que la ADR 0004 citaba como coste; se anota en la ADR 0007 como consecuencia.
10. **Escritura atómica**: se escribe en `<ruta>.<pid>.tmp` y se renombra; si falla, se borra el temporal. — barato, evita un JSON a medias por un corte y que dos terminales pisen el mismo temporal.
11. **`reservar` no cambia.** Sigue devolviendo `reserva semanal creada` sin crear nada. — crear reservas de verdad es otra feature; **dime si prefieres que entre aquí** (sería una task más y un escenario nuevo).
12. **Capacidad nueva `booking-persistence`** (slug en inglés, contenido en castellano); el proyecto aún no tiene `capabilities/` y esta sería la primera. — el slug lo aprueba el dev-lead, con esta spec.
13. **`architecture.md` se edita**: se anota `src/store.js` como el único módulo que toca disco, junto a `src/app.js`, para que «un solo fichero de entrada» siga siendo cierto (la entrada sigue siendo `app.js`). — si no, el documento queda contradicho en cuanto exista el módulo.
14. **`operations.md:14` se reescribe** («Motor de producción»: un fichero JSON, `SALAS_FILE`, por defecto `~/.salas/reservas.json`). — la línea dice «en memoria» y dejaría de ser cierta.
15. **Enfoque: A, frente a B y C (ver Approach).**
16. **Repaso de coherencia**: el delta probado sobre una copia de `.docs/sdd` con `sdd capability merge` → exit 0, 8 requisitos y 5 reglas añadidos en `booking-persistence.md`, `capability check` válido y sin avisos de longitud; `git grep` de `0012`, `store.js`, `SALAS_FILE` y `reservas.json` fuera de esta carpeta → sin resultados; `scripts/lint.mjs` solo busca tabuladores en `src/app.js`, no cambia. Sin medir: que `sdd decision check` acepte la ADR 0007 (aún no existe).
- Política de modelos: revisores de la spec: dominio sonnet y técnica sonnet, en paralelo, más un revisor sonnet en segunda ronda · revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario

### Hallazgos de la review

Ronda 1 (dominio y técnica; los hallazgos repetidos se cuentan una vez):

- **Aceptado** (Crítico) — directorio `~/.salas` inexistente en el primer guardado → decisión 2 (se crea) y escenario «Sin fichero…».
- **Aceptado** (Crítico) — «ilegible» solo cubría «no es JSON» → decisión 7 (versión, entradas, directorio) y un escenario por tipo.
- **Aceptado** (Crítico) — cómo entra `load` sin que `app.test.js` y `cancel.test.js` lean el fichero real → Approach (solo bajo `if (command)`, sustituye `bookings` en su sitio) y un test que importa `app.js` sin crear nada.
- **Aceptado** — escenario único que mezclaba cancelar, anular y repetir → tres escenarios separados, cada uno con `SALAS_FILE` en su GIVEN.
- **Aceptado** — `libres` con fichero roto → decisión 7 (aplica a cualquier comando) y escenario.
- **Aceptado** — fallo al guardar sin mensaje ni orden → decisión 8, escenario nuevo y regla «Avisos».
- **Aceptado** — `cancelar Sur lun` guardaba sin cambio → decisión 5 y escenario.
- **Aceptado** — ruta por defecto sin escenario y `os.homedir()` → decisión 2 y escenario de la ruta por defecto.
- **Aceptado** — borrar el fichero resucita la reserva de fábrica → decisión 6 y regla «Dónde viven los datos».
- **Aceptado** — pérdida con dos terminales sin ejemplo → decisión 9.
- **Aceptado** — `architecture.md` fuera del Scope → decisión 13 y Scope.
- **Aceptado** — `<ruta>.tmp` fijo y `.tmp` huérfano → decisión 10.
- **Aceptado** — Confirmación de la ADR 0007 sin test → decisión 3.
- **Aceptado** — claves en inglés vs. terminología → decisión 4 y regla «Idioma de los nombres».
- **Aceptado** — literales de salida y códigos sin listar → decisiones 7 y 8.
- **Aceptado** — la 0004 citada sin comprobar → comprobada: existe y sus líneas 16, 21, 25 y 29 dicen lo que la tabla afirma.

Ronda 2 (un revisor sonnet, porque se aceptaron Críticos):

- **Aceptado** (Crítico) — `<fichero>/reservas.json` hacía que la lectura fallara como «ilegible» y no como guardado → decisión 7 (`ENOENT` y `ENOTDIR` al leer = no existe) y decisión 8.
- **Aceptado** — el motivo del sistema salía en inglés contra la ADR 0002 → decisión 8 con motivos en castellano y reglas «Avisos» e «Idioma».
- **Aceptado** — `.tmp` sin escenario que lo ejercite → test unitario de `store.save` en «Dónde se prueba»; el AND se quita del escenario.
- **Aceptado** — `anular` sin efecto, `reservar` y comando desconocido sin escenario → decisión 5 y AND de `anular Sur lun`.
- **Aceptado** — cómo se detecta el cambio → decisión 5 y Approach (`JSON.stringify` antes y después).
- **Aceptado** — `SALAS_FILE` vacía sin caso → AND en «Sin SALAS_FILE…».
- **Aceptado** — faltaban casos de forma (sin `room`, `[]`, `null`) → ANDs añadidos.
- **Aceptado** — `operations.md` sin decisión y recuento de ficheros → decisión 14 y «8 ficheros».
- **Aceptado** — la 0007 y el `superseded` en la misma task, antes de `store.js` → decisión 3.

### Decisiones tomadas con el dev-lead

- Que las reservas sobrevivan a cerrar y volver a abrir la terminal; perfil `delegate` — «que las reservas sobrevivan a cerrar y volver a abrir la terminal. Perfil delegate.»

## Intent

Hoy `salas` no recuerda nada entre comandos: cada arranque empieza con las reservas de fábrica y lo cancelado o anulado vuelve a estar activo. La persona que la usa (la única) pierde el estado en cuanto el comando termina. Queremos que lo cancelado o anulado siga así en el siguiente arranque, sin configurar nada. Éxito: `cancelar Norte lun` seguido, en otro proceso, de `libres 10:00-12:00` da `Norte, Sur`. Fracaso aunque funcione: un fichero roto que se sobrescribe y borra las reservas sin avisar, un «cancelada» impreso sin que se haya guardado, o que las pruebas actuales empiecen a leer o escribir el fichero real de quien las ejecuta.

## Scope

- Entra: guardar y leer las reservas en un fichero JSON (decisiones 2 y 4); guardar tras `cancelar` y `anular` cuando cambian algo (5); arrancar del estado inicial sin fichero (6); avisar y no pisar un fichero ilegible (7); avisar si no se puede guardar (8); ADR 0007 y `superseded by 0007` en la 0004; reescribir la línea «Motor de producción» de `operations.md`; anotar `src/store.js` en `architecture.md` (13).
- No entra: que `reservar` cree reservas; bloqueo, relectura o fusión entre dos terminales; migración de formatos (solo el campo `version`); exportar (`.ics`, fila 0004 del roadmap); cambiar la sala o la lista de salas (ADR 0005).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «En memoria del proceso» / «cerrar la terminal pierde las reservas» | `.docs/sdd/decisions/0004-single-process-state.md:16,21,25` | decisión 3: la sustituye la ADR 0007; la 0004 pasa a `superseded by 0007` |
| `src/` no importa `node:fs` | `.docs/sdd/decisions/0004-single-process-state.md:29` | decisión 3: la ADR 0007 fija que solo `src/store.js` lo importa, con un test; `scripts/lint.mjs` está fuera de `src/` y no cambia |
| «las reservas viven en memoria» | `.docs/sdd/steering/operations.md:14` | Scope: se reescribe a «un fichero JSON (`SALAS_FILE`, por defecto `~/.salas/reservas.json`)» |
| «Un solo fichero de entrada: `src/app.js`» | `.docs/sdd/steering/architecture.md:5` | decisión 13: se completa con `src/store.js` como único módulo que toca disco |
| Cada arranque empieza con `bookings` de fábrica | `src/app.js:3` | decisión 6: se mantiene como estado inicial cuando no hay fichero |

- Filas que implementa: ninguna (la 0012 se reservó con `sdd id next --reserve`, sin fila en `ROADMAP.md`) → nada: comprobado con `git grep -n "0012"`.

## Approach

- **A. Un módulo `src/store.js` (cargar, guardar, ruta) y el cableado solo en la entrada de `app.js`** — `run` y las funciones puras no cambian, así que las pruebas actuales (`run('libres', …)`) no tocan el fichero real; cuesta un fichero nuevo y una anotación en `architecture.md`.
- B. Guardar dentro de `app.js` en cada función que cambia estado — evita el fichero nuevo, pero `cancelBooking` y `voidBooking` (que las pruebas llaman directamente) escribirían en la carpeta personal de quien ejecuta los tests.
- C. SQLite con `node:sqlite` — robusto ante dos terminales, pero es módulo experimental en Node 22 y la ADR 0004 ya descartó la base de datos por desproporcionada para una persona.
- Elegido: A — aísla la escritura en un sitio, deja `run` determinista y es lo más barato que cumple el éxito.

Partes del cómo que fija A: `store.load()` devuelve la lista o el estado inicial, o lanza el error de «ilegible»; `store.save(bookings)` escribe a `<ruta>.<pid>.tmp`, renombra y, si falla, borra el temporal y lanza el error de «guardado fallido». El cableado vive **solo dentro de `if (command)`** de `app.js`: carga y sustituye el contenido de `bookings` en su sitio (el `const` se queda), ejecuta `run`, y si `JSON.stringify(bookings)` cambió guarda **antes** de imprimir el resultado; los errores de `load` y `save` salen por el canal de errores con código 1. Importar `app.js` desde un test no carga ni guarda nada.

## Dónde se prueba

- Las reservas sobreviven entre arranques, `libres`/`cancelar Sur lun` sin escribir y el guardado fallido: arrancando `node src/app.js` como procesos distintos con `SALAS_FILE` en una carpeta temporal — es la única costura que ve «cerrar y abrir» y el canal de errores y el código de salida; los tests actuales llaman a `run` en el mismo proceso y no la ven.
- Ficheros ilegibles (los casos de la decisión 7: no es JSON, no es objeto, `bookings` no lista, `version` distinta, entrada sin campo o con `status` desconocido, carpeta) y carpeta inexistente: por proceso, con `SALAS_FILE` temporal.
- El borrado del `.tmp` si falla el guardado: test unitario de `store.save` con un rename que falla (destino que es una carpeta), porque por proceso la ruta que no se puede crear nunca llega a crear el temporal.
- Los motivos de la decisión 8: test unitario de la función que traduce `EACCES`, `ENOTDIR`, `ENOSPC` y un código desconocido.
- Ruta por defecto: por proceso, con `HOME` y `USERPROFILE` apuntando a una carpeta temporal y sin `SALAS_FILE`; `SALAS_FILE` vacía cuenta como no definida.
- Las pruebas actuales (`app.test.js`, `cancel.test.js`) siguen en verde sin tocar, y un test nuevo importa `app.js` con `HOME`/`USERPROFILE`/`SALAS_FILE` en una carpeta temporal y comprueba que no se crea nada.
- ADR 0007: un test comprueba que, bajo `src/`, solo `store.js` importa `node:fs`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: «El estado de las reservas vive en un fichero JSON de la carpeta personal» — alternativa descartada: en memoria (ADR 0004) y SQLite; se escribe en la primera task (decisión 3), no en el cierre.

## Delta de comportamiento

### Capacidad: `booking-persistence`

#### ADDED — Una cancelación sobrevive al arranque siguiente

- GIVEN `SALAS_FILE` apunta a un fichero temporal con `{"version":1,"bookings":[{"room":"Norte","day":"lun","slot":"10:00-12:00","status":"active"}]}`
- WHEN se ejecuta `cancelar Norte lun` y después, en un proceso nuevo, `libres 10:00-12:00`
- THEN el primero imprime `cancelada Norte lun` y el segundo imprime `Norte, Sur`
- AND en un tercer proceso, `cancelar Norte lun` imprime `sin reserva Norte lun`

#### ADDED — Una anulación sobrevive al arranque siguiente

- GIVEN el mismo fichero temporal con la reserva `Norte lun 10:00-12:00` activa
- WHEN se ejecuta `anular Norte lun` y después, en un proceso nuevo, `libres 10:00-12:00`
- THEN el primero imprime `anulada Norte lun` y el segundo imprime `Norte, Sur`

#### ADDED — Sin fichero se parte del estado inicial y solo se escribe al cambiar algo

- GIVEN `SALAS_FILE` apunta a una ruta que no existe, dentro de una carpeta que tampoco existe
- WHEN se ejecuta `libres 10:00-12:00`
- THEN imprime `Sur` (la reserva inicial `Norte lun 10:00-12:00` está activa) y ni el fichero ni la carpeta existen
- AND `cancelar Sur lun` y `anular Sur lun` imprimen `sin reserva Sur lun` y tampoco crean el fichero
- AND `cancelar Norte lun` crea la carpeta y el fichero, y este contiene `Norte` `lun` con `status` `cancelled`

#### ADDED — Sin SALAS_FILE se usa la carpeta personal

- GIVEN `SALAS_FILE` no está definida y `HOME` y `USERPROFILE` apuntan a una carpeta temporal `T`
- WHEN se ejecuta `cancelar Norte lun`
- THEN imprime `cancelada Norte lun` y existe `T/.salas/reservas.json` con `Norte` `lun` en `cancelled`
- AND con `SALAS_FILE=""` (vacía) ocurre lo mismo

#### ADDED — Un fichero que no es JSON no se sobrescribe

- GIVEN `SALAS_FILE` apunta a un fichero que contiene `{no es json`
- WHEN se ejecuta `cancelar Norte lun`
- THEN nada sale por la salida normal; por el canal de errores sale `no puedo leer las reservas de <ruta>: arréglalo o bórralo` y el proceso termina con código 1
- AND el fichero sigue conteniendo `{no es json`
- AND `libres 10:00-12:00` hace lo mismo: el fichero se lee antes de cualquier comando

#### ADDED — Un fichero con otra forma o versión es ilegible

- GIVEN `SALAS_FILE` apunta a un fichero con `{"version":1,"bookings":"x"}`
- WHEN se ejecuta `libres 10:00-12:00`
- THEN sale el mismo error de ilegible, con código 1, y el fichero queda intacto
- AND lo mismo con `{"version":2,"bookings":[]}`, con `[]` y con `null`
- AND lo mismo si `SALAS_FILE` es una carpeta

#### ADDED — Una entrada mal formada hace ilegible el fichero

- GIVEN `SALAS_FILE` apunta a un fichero con una entrada de `status` `x`: `{"version":1,"bookings":[{"room":"Norte","day":"lun","slot":"10:00-12:00","status":"x"}]}`
- WHEN se ejecuta `libres 10:00-12:00`
- THEN sale el mismo error de ilegible, con código 1, y el fichero queda intacto
- AND lo mismo con una entrada sin `room`: `{"version":1,"bookings":[{"day":"lun","slot":"10:00-12:00","status":"active"}]}`

#### ADDED — Un guardado fallido no se da por hecho

- GIVEN `SALAS_FILE` apunta a `<fichero existente>/reservas.json` (la carpeta padre es un fichero normal, así que no se puede crear)
- WHEN se ejecuta `cancelar Norte lun`
- THEN no se imprime `cancelada Norte lun`; por el canal de errores sale `no puedo guardar las reservas en <ruta>: la ruta cuelga de algo que no es una carpeta` y el proceso termina con código 1

#### Reglas de la capacidad — booking-persistence

- **Dónde viven los datos**: `<os.homedir()>/.salas/reservas.json`, o la ruta de `SALAS_FILE` si está definida y no vacía; formato `{"version":1,"bookings":[…]}` con los campos `room`, `day`, `slot` y `status`. Sin fichero, o con el fichero borrado, el estado es el inicial: una reserva `Norte lun 10:00-12:00` activa.
- **Idioma de los nombres**: las claves del fichero en inglés (como en memoria) y técnicas: no cambian la terminología del producto; los mensajes al usuario, también el motivo de un fallo de guardado, en castellano (ADR 0002).
- **Límites**: sin tope de reservas; solo se acepta `version` igual a `1`.
- **Avisos**: por el canal de errores y con código 1, solo dos: `no puedo leer las reservas de <ruta>: arréglalo o bórralo` y `no puedo guardar las reservas en <ruta>: <motivo>`, con el motivo en castellano: `sin permiso`, `la ruta cuelga de algo que no es una carpeta`, `disco lleno` o `error de escritura (<código>)`.
- **Regla ante conflicto**: con dos terminales a la vez gana la última escritura; no hay bloqueo ni relectura antes de guardar, y puede perderse un cambio de la otra terminal.

## Enmiendas

- ninguna

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
