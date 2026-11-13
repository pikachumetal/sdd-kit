---
id: 20261112-155748-feature-0012-persistent-bookings
feature: 0012
title: Las reservas sobreviven al cierre de la terminal
mode: full
status: draft
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Las reservas sobreviven al cierre de la terminal

🦆 Hoy, si cancelas `Norte lun` y cierras la terminal, al volver a abrirla la reserva sigue ahí como si nada: `salas` olvida todo al salir. Con este cambio cada cancelación o anulación se guarda en un fichero, y `salas libres 10:00-12:00` en la terminal nueva enseña `Norte, Sur`. Si el fichero está estropeado o no se puede escribir, `salas` lo dice y no toca lo que haya dentro, para no perder reservas sin avisar. Dos terminales a la vez pueden pisarse un cambio (lo acepto con un solo usuario, y te lo pido confirmado). Para hacerlo hay que revocar la decisión de la ADR 0004 («el estado vive en memoria»): una ADR nueva la sustituye.

Validación: dev-lead — es lo que usa una persona: cerrar la terminal, abrirla y comprobar con sus propios ojos que la reserva sigue como la dejó.

## Capacidades

- Nuevas: `bookings` — qué hace `salas` con las reservas entre un arranque y el siguiente (hoy, solo su persistencia).
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`bookings`), datos persistentes nuevos con formato de fichero, contrato público (el fichero y su variable de entorno) · tamaño: ~70 líneas de código en 8 ficheros (2 de `src/`, 2 de tests, 3 de documentos y la ADR)
- Dominio (sonnet): si los escenarios cubren lo que ve quien cancela y reabre (`libres` tras reiniciar) y si «Un fichero ilegible no se pisa» no pierde reservas en silencio (señal: datos nuevos)
- Técnica (sonnet): si leer-modificar-escribir en cada orden y la escritura por fichero temporal + renombrado aguantan un corte a medias, y si el formato `version: 1` deja migrar (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si el comportamiento de cara a la persona cuenta todos los casos de «reabro la terminal»

1. **Revoco la ADR 0004** («el estado vive en un solo proceso»): lo pides tú, y su propia consecuencia («cerrar la terminal pierde las reservas») es justo lo que quieres quitar. Una ADR nueva (0007) la sustituye al cerrar y 0004 pasa a `superseded by 0007`. Su «Confirmación» (`src/` no importa `node:fs`) deja de valer; la nueva dice: solo `src/store.js` importa `node:fs`. No es un detalle de implementación: confírmalo expresamente al aprobar.
2. Enfoque: A (fichero JSON leído y escrito en cada orden), frente a B (cargar al arrancar y guardar al salir) y C (SQLite) (ver Approach).
3. **Qué se guarda**: la lista de reservas (`room`, `day`, `slot`, `status`) tal como existe hoy en memoria, y nada más. Las salas siguen en el código (ADR 0005). Los `status` válidos son los de hoy: `active`, `cancelled`, `voided`.
4. **Dónde**: `<carpeta personal>/.salas/reservas.json` (la carpeta personal es `os.homedir()`), o la ruta de la variable de entorno `SALAS_DATOS` si está definida y no vacía (vacía cuenta como no definida). Los dos valores son nuevos —no vienen de la constitución ni de ninguna capacidad— y su origen es la ADR 0007. La carpeta se crea si no existe, con el modo por defecto del sistema. No va en el directorio actual, porque entonces abrir la terminal en otra carpeta «perdería» las reservas.
5. **Primer arranque**: sin fichero, el estado parte de la reserva semilla de hoy (`Norte lun 10:00-12:00` activa) y no se crea nada hasta que una orden cambie algo. Consecuencia: si borras el fichero, la semilla vuelve. Las órdenes que no cambian nada (`libres`, un `cancelar` sin reserva, `reservar`) nunca escriben ni tocan un fichero existente.
6. **Formato**: UTF-8, JSON con sangría de 2 espacios y salto de línea final: `{ "version": 1, "bookings": [ … ] }`. Una versión distinta de 1 se trata como fichero ilegible: no se adivina un formato que aún no existe (así la migración futura es una decisión explícita). Se desarrolla con Node 22 (`architecture.md`) y el mínimo declarado es Node 20 (`engines`); las APIs que usa (`readFileSync`, `renameSync`, `mkdirSync` con `recursive`, `os.homedir`) existen en 20.
7. **Fichero ilegible** = JSON roto, fichero vacío (0 bytes), ruta que es un directorio o sin permiso de lectura, versión distinta de 1, o forma inesperada (`bookings` que no es lista, o una reserva sin `room`, `day`, `slot` o `status` como texto, o con un `status` fuera de los tres). Leer un fichero que no existe, o cuya carpeta padre no existe o no es una carpeta (`ENOENT`, `ENOTDIR`), cuenta como «sin fichero» (decisión 5); cualquier otro error de lectura (una carpeta, sin permiso de lectura) es ilegible. «Sin permiso de lectura» no tiene escenario: no es portable a Windows. Texto literal `datos ilegibles en <ruta>: revisa o borra el fichero`, código de salida 1, el fichero sin tocar. Frente a «empezar de cero en silencio», que perdería reservas sin avisar. El fichero vacío cuenta como ilegible porque con la escritura atómica (8) no debería ocurrir nunca, y si ocurre es que alguien lo tocó.
8. **Escritura**: a `<ruta>.tmp` en la misma carpeta y luego renombrado sobre el fichero, para que un corte a mitad no deje el fichero a medias; un `.tmp` residual nunca se lee y se sobrescribe en la siguiente escritura. Si no se puede crear la carpeta, escribir o renombrar (también en Windows, si el fichero está en uso), la orden no dice que tuvo éxito: texto literal `no se pudo guardar en <ruta>: <motivo del sistema>`, código de salida 1, el fichero anterior intacto y sin `.tmp` nuevo. Los avisos de 7 y 8 salen por la salida de errores (stderr), no por la salida normal; en el fallo de guardar, `cancelada…` no sale por ninguna de las dos.
9. **Dos terminales a la vez**: sin bloqueo; cada orden lee, cambia y escribe. Es peor que «gana la última escritura»: si dos órdenes leen a la vez, se pierde el cambio de una aunque no se contradigan (por ejemplo, cancelar `Norte lun` en una terminal y anular `Sur mar` en otra a la vez). Limitación aceptada: con un solo usuario y órdenes de una fracción de segundo, no compensa un bloqueo. La ADR 0004 lo dejaba como pregunta abierta. Confírmala al aprobar.
10. **Capacidad nueva `bookings`** (nombre en inglés kebab-case, ver `capability-template.md`): declarada aquí.
11. **Los tests existentes cambian**: ahora tocarían un fichero real y, como `node --test` ejecuta cada fichero de test en su proceso, podrían pisarse entre ellos. Cada test fija `SALAS_DATOS` a una carpeta temporal propia.
12. **No entra `reservar` real**: hoy `reservar` no crea ninguna reserva (solo contesta `reserva semanal creada` con `--cada-semana`, y `salas` si no). Lo que sobrevive son las reservas que existen —la semilla y sus cambios de estado—; hacer que `reservar` cree y guarde reservas es otro cambio, y sin él lo que «sobrevive» es poco. Si lo querías dentro, dímelo y entra aquí.
13. Sin fila en `ROADMAP.md` para esta feature: el id 0012 salió de `sdd id next --reserve`. Si quieres la fila, la añado al abrir.
14. Repaso de coherencia: el delta corregido tras las dos rondas de review, fusionado sobre una copia de `.docs/sdd`, se acepta (`bookings.md`: 6 requisitos añadidos y 5 reglas, sin errores); `git grep` de «memoria», «node:fs» y «0004» fuera de las specs solo encuentra los sitios de la tabla de arriba (`scripts/lint.mjs` importa `node:fs` pero está fuera de `src/`, no le afecta la nueva confirmación). Sin `sin medir`.
15. **Cualquier orden con fichero ilegible se niega**, también las que no lo necesitan (`reservar`) y una orden desconocida: es lo más simple (cargar siempre antes de la orden) y evita ejecutar nada sobre un estado dudoso. `salas` sin orden no carga nada ni imprime nada, como hoy.
16. **`bookings` y `room` en el fichero**: son identificadores técnicos del fichero, no texto de interfaz; mantienen los nombres de los campos actuales del código. PRODUCT.md pide evitar «booking» y «room» en lo que lee una persona (los mensajes siguen en castellano: «reserva», «sala»).
- Política de modelos: revisores de la spec, dominio sonnet y técnica sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

Dominio:
- **Aceptado** — ruta y `SALAS_DATOS` son valores nuevos sin origen → decisión 4 y regla «Dónde viven los datos» dicen que son nuevos y que su origen es la ADR 0007.
- **Aceptado** — «Avisos» no cubría «forma inesperada», directorio ni permisos → decisión 7 y regla «Avisos» alineadas; escenarios nuevos de forma inesperada, vacío y directorio.
- **Rechazado en parte** — claves en inglés chocan con PRODUCT.md → se mantienen (son los campos actuales del código, no texto de interfaz); se declara en la decisión 16 y en «Idioma de los nombres».
- **Aceptado** — carpeta personal sin definir → `os.homedir()` (decisión 4).
- **Aceptado** — falta `anular` + `libres` tras reiniciar → escenario añadido, con `voided` en el fichero.
- **Aceptado** — fallo de escritura sin escenario → decisión 8 y escenario con `no se pudo guardar en <ruta>: <motivo del sistema>`.
- **Aceptado** — «Límites: no aplica» contradice el diseño → declarado: sin tope con dos salas, y el tratamiento del `.tmp` residual.
- **Aceptado** — `reservar` no guarda nada es alcance oculto → está en «No entra» y hay escenario que fija que `reservar` no escribe.
- **Aceptado** — «gana la última escritura» puede perder cambios en silencio → decisión 9 reescrita como limitación aceptada, para que la confirmes.
- **Rechazado** — variar con `Sur` activa → no hay reserva de `Sur` en la semilla y crear otra exige un `reservar` real, que no entra (decisión 12).

Técnica:
- **Aceptado** — sin escenario de forma inesperada → escenarios con `{"version":1}`, `bookings` que no es lista y una reserva sin `room`.
- **Aceptado** — la atomicidad no se prueba → escenarios: tras escribir no queda `.tmp`, y un `.tmp` residual no rompe la orden ni se lee.
- **Aceptado** — «leer no escribe» solo con fichero inexistente → escenario con fichero existente: mismo contenido y mismo mtime tras `libres` y tras un `cancelar` sin efecto.
- **Aceptado** — falta `anular` con ilegible, fichero vacío y directorio → decisión 7 y escenarios.
- **Aceptado** — `SALAS_DATOS` vacía y precedencia → decisión 4 y escenario de precedencia.
- **Aceptado** — falta `voided` en el fichero y `cancelar` seguido de `anular` → AND con `voided` y escenario: tras `cancelar`, `anular` responde `sin reserva Norte lun` (como hoy: solo se cambia lo activo).
- **Aceptado** — decisiones tomadas en el cuerpo (semilla que vuelve, ilegible bloquea todo, `.tmp`) → decisiones 5, 15 y 8.
- **Aceptado** — contratos sin decir (codificación, formato, modo de carpeta, fallo del renombrado en Windows) → decisiones 6, 4 y 8.
- **Aceptado** — pérdida de un cambio sin conflicto → decisión 9.
- **Aceptado** — `architecture.md` («un solo fichero de entrada») cambia → fila nueva en la tabla; mínimo Node 20 en la decisión 6.

Segunda ronda (un revisor, sonnet):
- **Aceptado** — con el padre de `SALAS_DATOS` siendo un fichero, `load()` fallaría con `ENOTDIR` y el escenario de «no se pudo guardar» no podría cumplirse → decisión 7: `ENOENT` y `ENOTDIR` al leer cuentan como «sin fichero».
- **Aceptado** — falta anular → cancelar → escenario añadido.
- **Aceptado** — la decisión 14 estaba obsoleta → reescrita con el delta corregido (6 requisitos, 5 reglas).
- **Rechazado** — contradicción Node 22 (`architecture.md`) y 20 (`engines`) → no la introduce este cambio; la decisión 6 aclara que se desarrolla en 22 y el mínimo declarado es 20.
- **Aceptado** — casos de la decisión 7 sin escenario → escenarios de `status` inválido y de `day` no textual; «sin permiso de lectura» se declara sin escenario (no portable a Windows).
- **Aceptado** — canal del aviso sin fijar → stderr (decisión 8 y regla «Avisos»).
- **Aceptado** — «fichero anterior intacto» sin escenario → escenario con fichero previo y `<ruta>.tmp` que es una carpeta.
- **Aceptado** — escenario mezclado de `SALAS_DATOS` no definida y vacía → separados.
- **Aceptado** — órdenes sin argumento o desconocidas con fichero ilegible → decisión 15 y escenarios.
- **Aceptado** — recuento de ficheros y confusión del «0004» → corregidos.

### Decisiones tomadas con el dev-lead

- Que las reservas sobrevivan a cerrar y volver a abrir la terminal — «que las reservas sobrevivan a cerrar y volver a abrir la terminal»
- Perfil `delegate` para esta feature — «Perfil delegate»
- La spec se escribe y se presenta, sin pasos intermedios — «Escribe la spec y preséntamela»

## Intent

Hoy `salas` guarda las reservas en memoria (ADR 0004): al cerrar la terminal se pierden y cada arranque vuelve a la reserva semilla. Eso obliga a rehacer a mano cualquier cancelación o anulación, y deja la herramienta inútil como registro. Éxito: cancelar o anular, cerrar, abrir otra terminal y que `salas libres <franja>` enseñe lo mismo que antes de cerrar. Fracaso, aunque «funcione»: un fichero estropeado que se pisa en silencio y borra las reservas, un cambio que se da por guardado y no lo está, o una orden que no cambia nada y escribe en disco. Excepción aceptada: dos terminales a la vez pueden pisarse un cambio (decisión 9).

## Scope

- Entra: guardar y leer la lista de reservas en un fichero (`src/store.js`), con `SALAS_DATOS` para cambiar la ruta.
- Entra: que `cancelar` y `anular` guarden su cambio; que `libres` lea el estado guardado.
- Entra: los avisos `datos ilegibles…` y `no se pudo guardar…` y su código de salida.
- Entra: adaptar los tests existentes (`test/app.test.js`, `test/cancel.test.js`) para aislar el fichero.
- Entra: `operations.md` (la línea «las reservas viven en memoria»), `architecture.md` («un solo fichero de entrada») y la ADR que sustituye a la 0004, al cerrar.
- No entra: que `reservar` cree o guarde reservas (decisión 12); bloqueo entre procesos (9); migración de formatos futuros (6); copia de seguridad o exportación (la fila de la hoja de ruta sobre `.ics`); más salas (ADR 0005).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «El estado vive en memoria» (ADR 0004) | `.docs/sdd/decisions/0004-single-process-state.md` (todo) | decisión 1: la sustituye la ADR 0007 al cerrar |
| «`src/` no importa `node:fs`» (Confirmación de 0004) | `.docs/sdd/decisions/0004-single-process-state.md:29` | decisión 1: 0007 confirma «solo `src/store.js` importa `node:fs`» |
| «las reservas viven en memoria» | `.docs/sdd/steering/operations.md:14` | Scope: se reescribe al cerrar |
| «Un solo fichero de entrada: `src/app.js`» | `.docs/sdd/steering/architecture.md:5` | Scope: pasa a `src/app.js` (entrada) y `src/store.js` (disco), al cerrar |
| `bookings` como constante del módulo (estado solo en memoria) | `src/app.js:3` | Scope: pasa a leerse por orden desde `src/store.js` |
| Tests que dependen del estado en memoria | `test/app.test.js:5-7`, `test/cancel.test.js:5-11` | decisión 11: se aíslan con `SALAS_DATOS` |

- Filas que implementa: nada: comprobado con `git grep -n "0012" -- ROADMAP.md .docs/sdd/steering` (sin resultados).

## Approach

- **A. Un fichero JSON, leído y escrito en cada orden** — un módulo `src/store.js` con `load()` y `save()`, sin estado propio. Cuesta: leer y escribir un fichero por orden (insignificante) y la pérdida de un cambio con dos terminales a la vez (decisión 9).
- **B. Cargar al arrancar y guardar al salir** — menos escrituras. Cuesta: un corte (Ctrl+C, cierre de la terminal) pierde justo lo que queremos conservar; `salas` ya es de órdenes sueltas, no de sesión larga.
- **C. SQLite** — `node:sqlite` no está en Node 20 (`engines: >=20`) y un paquete rompe «sin dependencias externas» (architecture.md). Desproporcionado para dos salas.
- Elegido: **A** — es la única que sobrevive a un corte, no añade dependencias y es lo más corto; el coste lo asumimos en la decisión 9.

Partes del cómo que fija A: `load()` devuelve la lista (o la semilla si no hay fichero) y lanza un error tipado si el fichero es ilegible; `save(lista)` escribe a `<ruta>.tmp` y renombra, y lanza otro error tipado si falla; `run()` carga antes de cada orden y guarda solo si la orden cambió algo; la entrada (`src/app.js`) captura ambos errores, imprime el aviso que toque y fija `process.exitCode = 1`.

## Dónde se prueba

- Reservas que sobreviven a reabrir, y todos los avisos con código de salida: dos ejecuciones reales de `node src/app.js` con `child_process.execFileSync` (o `spawnSync`) y el mismo `SALAS_DATOS` (la costura más alta que prueba un reinicio de verdad; `run()` en el mismo proceso no lo demuestra).
- Fichero ilegible, vacío, directorio, forma inesperada, `.tmp`, mtime y «leer no escribe»: con ficheros temporales por test, por esa misma costura.
- Fallo de escritura: `SALAS_DATOS` bajo una ruta cuyo padre es un fichero normal (no se puede crear la carpeta), portable a Windows y a POSIX.
- Ruta por defecto: fijando `HOME` y `USERPROFILE` a una carpeta temporal.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: «Las reservas se guardan en un fichero JSON, leído y escrito por orden» — descartadas: seguir en memoria (0004) y SQLite. Sustituye a la 0004 (decisión 1).

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Las reservas sobreviven al cierre de la terminal

- GIVEN `SALAS_DATOS` apunta a un fichero que no existe, y la reserva semilla `Norte lun 10:00-12:00` activa
- WHEN se ejecuta `salas cancelar Norte lun` y, ya en otro proceso, `salas libres 10:00-12:00`
- THEN la primera responde `cancelada Norte lun` y la segunda responde `Norte, Sur`
- AND el fichero existe y contiene la reserva `Norte lun 10:00-12:00` con estado `cancelled`

- GIVEN la misma situación
- WHEN se ejecuta `salas anular Norte lun` y, en otro proceso, `salas libres 10:00-12:00`
- THEN la primera responde `anulada Norte lun` y la segunda responde `Norte, Sur`
- AND el fichero contiene la reserva `Norte lun 10:00-12:00` con estado `voided`

- GIVEN la misma situación
- WHEN se ejecuta `salas cancelar Norte lun` y, en otro proceso, `salas anular Norte lun`
- THEN la primera responde `cancelada Norte lun` y la segunda `sin reserva Norte lun`
- AND el fichero sigue con el estado `cancelled`

- GIVEN la misma situación
- WHEN se ejecuta `salas anular Norte lun` y, en otro proceso, `salas cancelar Norte lun`
- THEN la primera responde `anulada Norte lun` y la segunda `sin reserva Norte lun`
- AND el fichero sigue con el estado `voided`

#### ADDED — Las órdenes que no cambian nada no escriben

- GIVEN `SALAS_DATOS` apunta a un fichero que no existe
- WHEN se ejecuta `salas libres 10:00-12:00`
- THEN responde `Sur` y el fichero sigue sin existir

- GIVEN `SALAS_DATOS` apunta a un fichero que no existe
- WHEN se ejecuta `salas cancelar Sur mar` (sin reserva)
- THEN responde `sin reserva Sur mar` y el fichero sigue sin existir

- GIVEN `SALAS_DATOS` apunta a un fichero ya guardado, con `Norte lun 10:00-12:00` en estado `cancelled`
- WHEN se ejecuta `salas libres 10:00-12:00`, y después `salas cancelar Sur mar`
- THEN el contenido y la fecha de modificación del fichero son los mismos que antes

- GIVEN `SALAS_DATOS` apunta a un fichero que no existe
- WHEN se ejecuta `salas reservar Norte --cada-semana`
- THEN responde `reserva semanal creada` y el fichero sigue sin existir

#### ADDED — Un fichero ilegible no se pisa

- GIVEN `SALAS_DATOS` apunta a un fichero con el texto `{no es json`
- WHEN se ejecuta `salas cancelar Norte lun`
- THEN la salida es `datos ilegibles en <ruta>: revisa o borra el fichero`, el código de salida es 1 y el fichero conserva `{no es json`

- GIVEN `SALAS_DATOS` apunta a un fichero con `{"version": 2, "bookings": []}`
- WHEN se ejecuta `salas libres 10:00-12:00`
- THEN la salida es `datos ilegibles en <ruta>: revisa o borra el fichero`, el código de salida es 1 y el fichero queda igual

- GIVEN `SALAS_DATOS` apunta a un fichero con `{"version": 1}`, o con `{"version": 1, "bookings": "x"}`, o con `{"version": 1, "bookings": [{"day": "lun", "slot": "10:00-12:00", "status": "active"}]}` (sin `room`)
- WHEN se ejecuta `salas anular Norte lun`
- THEN la salida es `datos ilegibles en <ruta>: revisa o borra el fichero`, el código de salida es 1 y el fichero queda igual

- GIVEN `SALAS_DATOS` apunta a un fichero con una reserva con `status` `borrada`, o con `day` que es el número 3 en vez de texto
- WHEN se ejecuta `salas libres 10:00-12:00`
- THEN la salida es `datos ilegibles en <ruta>: revisa o borra el fichero` y el código de salida es 1

- GIVEN `SALAS_DATOS` apunta a un fichero vacío (0 bytes), o a una carpeta
- WHEN se ejecuta `salas libres 10:00-12:00`
- THEN la salida es `datos ilegibles en <ruta>: revisa o borra el fichero` y el código de salida es 1

- GIVEN `SALAS_DATOS` apunta a un fichero con el texto `{no es json`
- WHEN se ejecuta `salas reservar Norte --cada-semana`, o una orden desconocida como `salas hola`
- THEN la salida es `datos ilegibles en <ruta>: revisa o borra el fichero` y el código de salida es 1

- GIVEN `SALAS_DATOS` apunta a un fichero con el texto `{no es json`
- WHEN se ejecuta `salas` sin orden
- THEN no imprime nada, el código de salida es 0 y el fichero queda igual

- Los avisos salen por stderr (la salida normal queda vacía).

#### ADDED — Un cambio que no se puede guardar no se da por hecho

- GIVEN `SALAS_DATOS` apunta a una ruta cuya carpeta padre es un fichero normal (no se puede crear la carpeta)
- WHEN se ejecuta `salas cancelar Norte lun`
- THEN la salida de errores empieza por `no se pudo guardar en <ruta>:`, el código de salida es 1 y `cancelada Norte lun` no sale por ninguna de las dos salidas

- GIVEN `SALAS_DATOS` apunta a un fichero con `{"version": 1, "bookings": [{"room": "Sur", "day": "mar", "slot": "10:00-12:00", "status": "active"}]}` y `<ruta>.tmp` es una carpeta
- WHEN se ejecuta `salas cancelar Sur mar`
- THEN la salida de errores empieza por `no se pudo guardar en <ruta>:`, el código de salida es 1, el fichero conserva su contenido (reserva `active`) y `<ruta>.tmp` sigue siendo la misma carpeta

#### ADDED — La escritura no deja el fichero a medias

- GIVEN `SALAS_DATOS` apunta a un fichero que no existe
- WHEN se ejecuta `salas cancelar Norte lun`
- THEN existe el fichero y no existe `<ruta>.tmp`

- GIVEN `SALAS_DATOS` apunta a un fichero que no existe, y al lado hay un `<ruta>.tmp` residual con el texto `{corte`
- WHEN se ejecuta `salas libres 10:00-12:00`, y después `salas cancelar Norte lun`
- THEN la primera responde `Sur` (el `.tmp` no se lee como datos), la segunda responde `cancelada Norte lun`, y después no existe `<ruta>.tmp`

#### ADDED — Dónde se guardan las reservas

- GIVEN `SALAS_DATOS` vale `<temp>/nueva/carpeta/reservas.json` y la carpeta no existe
- WHEN se ejecuta `salas cancelar Norte lun`
- THEN el fichero `<temp>/nueva/carpeta/reservas.json` existe

- GIVEN `SALAS_DATOS` no está definida y la carpeta personal es `<temp>`
- WHEN se ejecuta `salas cancelar Norte lun`
- THEN el fichero `<temp>/.salas/reservas.json` existe

- GIVEN `SALAS_DATOS` vale la cadena vacía y la carpeta personal es `<temp>`
- WHEN se ejecuta `salas cancelar Norte lun`
- THEN el fichero `<temp>/.salas/reservas.json` existe

- GIVEN `SALAS_DATOS` vale `<temp>/otra/reservas.json` y la carpeta personal es `<temp>`
- WHEN se ejecuta `salas cancelar Norte lun`
- THEN existe `<temp>/otra/reservas.json` y no existe `<temp>/.salas/reservas.json`

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: fichero JSON UTF-8, con sangría de 2 espacios y salto de línea final, `{ "version": 1, "bookings": [...] }`, en `<os.homedir()>/.salas/reservas.json`, o en la ruta de `SALAS_DATOS` si está definida y no vacía. Valores nuevos; origen: ADR 0007
- **Idioma de los nombres**: mensajes en castellano; claves y estados del fichero en inglés (`room`, `day`, `slot`, `status`: `active`, `cancelled`, `voided`), identificadores técnicos que mantienen los campos actuales del código
- **Límites**: sin tope previsto (dos salas); un `<ruta>.tmp` residual nunca se lee y se sobrescribe en la siguiente escritura
- **Avisos**: `datos ilegibles en <ruta>: revisa o borra el fichero` cuando el fichero no se puede leer (salvo que no exista), está vacío, es una carpeta, su versión no es 1 o su forma es inesperada; `no se pudo guardar en <ruta>: <motivo del sistema>` cuando falla guardar (crear la carpeta, escribir o renombrar); en ambos, por stderr y con código de salida 1
- **Regla ante conflicto**: dos procesos a la vez, sin bloqueo: puede perderse el cambio de uno aunque no se contradigan; limitación aceptada

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
