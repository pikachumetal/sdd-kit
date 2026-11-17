---
id: 20261106-100832-feature-0012-persistent-bookings
feature: 0012
title: Las reservas sobreviven al cierre de la terminal
mode: full
status: draft
created: 2026-11-06
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Las reservas sobreviven al cierre de la terminal

🦆 Hoy, si cancelas la reserva de Norte el lunes y vuelves a abrir la terminal, la reserva está otra vez activa: salas olvida todo al cerrarse. Con este cambio, cada cancelación o anulación se guarda en un fichero de tu carpeta personal, y la siguiente vez que arranques `cancelar Norte lun` te dirá «sin reserva Norte lun». Si el fichero se estropea, salas se niega a arrancar y te dice dónde está, en lugar de empezar de cero y pisarlo. Lo que no cambia: `reservar` sigue sin crear reservas, así que de momento lo único que sobrevive es lo que se cancela o se anula.

Validación: dev-lead — es lo que una persona hace al usar la herramienta (cerrar la terminal y volver), y solo ella lo ve de verdad.

## Capacidades

- Nuevas: `reservations` — persistencia de las reservas entre arranques (hoy no hay ninguna capacidad en `capabilities/`; lo que ya hacen `cancelar`, `anular` y `libres` queda sin ancla en ella, decisión 11).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`reservations`), datos nuevos persistentes (el fichero de reservas), formato de fichero que otro arranque lee · tamaño: ~110 líneas en 6 ficheros
- Dominio (sonnet): si los escenarios cubren lo que el dev-lead quiere de «sobrevivir» y si «No entra» deja fuera algo que el Intent promete (señal: capacidad nueva)
- Técnica (sonnet): si leer el fichero en cada `run` y escribirlo tras cancelar/anular encaja con los tests actuales, que comparten estado en proceso, y si la escritura atómica y el aviso de fichero ilegible se pueden probar (señal: datos persistentes)
- Mínimo razonable: solo técnica — deja sin mirar si el Intent promete más de lo que el Scope entrega (p. ej. que `reservar` no crea reservas)

1. **Enfoque central: un fichero JSON con todas las reservas, leído en cada arranque y reescrito entero tras cada cambio.** Alternativas descartadas: SQLite (`node:sqlite` es experimental y `engines` admite Node 20; además el proyecto no usa motores ni dependencias); un registro de eventos que se va añadiendo (más piezas para una lista de unas pocas reservas); guardar solo al salir (se pierde todo si el proceso muere).
2. **Dónde vive el fichero: `~/.salas/reservas.json`** (la carpeta personal sale de `os.homedir()`, calculada en cada arranque), y la variable de entorno `SALAS_DATOS` lo sustituye por otra ruta (vacía cuenta como no definida; una ruta relativa se resuelve desde la carpeta actual). No uso la carpeta actual: cambiaría según desde dónde abras la terminal y «perdería» las reservas. `SALAS_DATOS` existe sobre todo para que los tests no toquen tu carpeta personal.
3. **Primer arranque sin fichero**: se parte de la reserva de ejemplo de hoy (Norte, lun, 10:00-12:00, activa), porque los tests actuales y `libres` dependen de ella. El fichero se crea con el primer cambio, no al arrancar.
4. **Qué comandos guardan**: `cancelar` y `anular`, los únicos que cambian el estado hoy, y solo cuando de verdad cambian algo (un `sin reserva …` no escribe). **`reservar` no crea ninguna reserva hoy** (solo responde `reserva semanal creada`), así que no hay nada que guardar de él. Hacer que `reservar` cree reservas de verdad **queda fuera**: es otra feature y, sin ella, lo único que sobrevive entre arranques son las cancelaciones y anulaciones. Dime si lo quieres dentro.
5. **Fichero ilegible**: salas no ejecuta el comando, escribe en error estándar `reservas ilegibles: <ruta> — no se ha tocado el fichero` y sale con código 1. No parte de cero ni lo sobrescribe, para no destruir lo que haya. El texto es mío. «Ilegible» es: no se puede leer (por ejemplo, la ruta es una carpeta; los permisos denegados cuentan también, pero no se prueban porque no son comprobables en Windows), no es JSON, o no tiene la forma del formato (decisión 12).
6. **Dos terminales a la vez**: gana la última escritura y no se avisa. Leer el fichero en cada arranque reduce la ventana, pero no la cierra. No añado bloqueos: con una sola persona usando la herramienta (misión) es un riesgo aceptado, no una promesa de la capacidad.
7. **Escritura atómica**: se escribe en un fichero temporal de la misma carpeta y se renombra, para que un corte a mitad no deje un JSON truncado. El temporal se llama `reservas.json.<pid>.tmp` (nombre del fichero destino más el pid del proceso). La carpeta (`~/.salas/` o la del destino) se crea solo al guardar, no al arrancar; si el renombrado falla, el temporal se borra con `rmSync` (ese borrado no se prueba: no hay forma portable de forzar el fallo del renombrado).
8. **El código sigue en `src/app.js`** (tech-stack: «un solo fichero de entrada»). `src/` pasará a importar `node:fs`, `node:os` y `node:path`, sin ningún paquete externo, y solo `mkdirSync`, `readFileSync`, `writeFileSync`, `renameSync` y `rmSync`, que existen en Node 20 y 22. No reconcilio `engines` (≥20) con tech-stack (22): no es de esta feature.
9. **Los tests actuales cambian de aislamiento, no de contenido**: hoy comparten el estado del proceso; con persistencia, `cancelar Norte lun` en un test dejaría el fichero cancelado para el siguiente. Cada test usará un `SALAS_DATOS` temporal propio, y sus aserciones no cambian: `node --test` entero en verde con ellas es condición del cierre. Es una tarea del plan, no una enmienda.
10. **ADR 0004 se sustituye.** Es una decisión aceptada que este cambio contradice (su «Cerrar la terminal pierde las reservas» y su confirmación «`src/` no importa `node:fs`»). Propongo una ADR 0007 «Las reservas se guardan en un fichero JSON»; el cierre la escribe y cambia el `status` de la 0004 a `superseded by 0007` (esta spec no lo hace ni lo verifica un test). Las líneas 21, 25 y 29 de la 0004 que cita la tabla están comprobadas hoy. El motivo de 0004 («nadie lo ha pedido») ya no vale: ahora alguien lo ha pedido.
11. **Capacidad nueva `reservations`** (slug en inglés, como pide la plantilla; el término «booking» está en _Evitar_ de `PRODUCT.md`, por eso no uso `bookings`). La capacidad recoge solo la persistencia: lo que hoy hacen `cancelar`, `anular` y `libres` sigue descrito en las specs anteriores y no se traslada aquí; hacerlo sería otra tarea.
12. **Formato del fichero**: `{"bookings": [{"room", "day", "slot", "status"}]}`, con los mismos nombres y valores que ya usa el código (`status`: `active`, `cancelled`, `voided`; `room`, `day` y `slot` son cadenas). Son identificadores del código, no texto de interfaz, así que no van en castellano. Sin número de versión: si cambia el formato será otra feature con su migración. Es válido solo un objeto con `bookings` como array (puede estar vacío) de objetos que tienen `room`, `day` y `slot` como cadenas y `status` igual a `active`, `cancelled` o `voided`; las claves de más se ignoran. Cualquier otra forma (incluido `null`, una clave ausente o un `status` distinto) cuenta como ilegible (decisión 5).
13. **`run` carga y valida el fichero en cada llamada, sea cual sea el comando** (también `libres`, `reservar` y uno desconocido, que hoy responde `salas`), y no guarda copia en memoria entre llamadas, para que cada test y cada arranque vean el disco. Que `reservar` o un comando desconocido fallen con un fichero roto es intencionado: una sola regla, sin excepciones. `run` sigue exportado y el arranque `node src/app.js <comando> <argumentos>` sigue imprimiendo su respuesta en la salida estándar con salto de línea y saliendo con código 0.
14. **Dónde se corta**: `run` lanza un error con el texto del aviso; el arranque por línea de comandos lo captura, lo escribe en error estándar con salto de línea y sale con código 1. Lo hace igual con el fallo de escritura (decisión 15).
15. **Fallo al guardar** (carpeta sin permisos, disco lleno, `renameSync` rechazado en Windows): el comando no imprime su respuesta, escribe `no se han podido guardar las reservas: <ruta>` en error estándar, sale con código 1 y borra el temporal. Texto mío.
- Repaso de coherencia: el delta probado sobre una copia de `.docs/sdd` en una carpeta temporal con `sdd capability merge`: sin rechazos; `capabilities/` del repo intacta. `git grep` de lo que se retira: 4 sitios, todos en la tabla.
- Política de modelos: revisores de la spec en sonnet (dominio y técnica) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — Dominio 1 (Crítico): faltaban tres de las cinco reglas → «Reglas de la capacidad» declara las cinco: datos, idioma de los nombres, límites (no aplica), avisos y conflicto (no aplica).
- **Aceptado** — Dominio 2 (Crítico): el fichero mezclaba `reservas` con `room`/`status` → la clave pasa a `bookings` y la decisión 12 dice que son identificadores del código.
- **Rechazado** — Dominio 3: trasladar `cancelar`, `anular` y `libres` como requisitos base → no es de esta feature; está en la decisión 11 y la capacidad nace solo con persistencia.
- **Aceptado** — Dominio 4: el Intent prometía más de lo que entrega → Intent y 🦆 acotados a lo cancelado o anulado, con `reservar` explícito.
- **Aceptado** — Dominio 5: faltaba la reserva de ejemplo en el Scope y la forma inválida → ambas entran al Scope; escenario nuevo de forma errónea.
- **Aceptado** — Dominio 6 y Técnica 10: la regla de conflicto sin escenario → sale de las reglas («no aplica, decisión 6») y queda como riesgo aceptado.
- **Aceptado** — Dominio 7 y 8, Técnica 1 y 3: ruta, ejemplo y aviso poco concretos → escenarios con `HOME`/`USERPROFILE`, ruta de ejemplo, texto exacto, salida estándar vacía y código; «ilegible» definido en la decisión 5.
- **Aceptado** — Técnica 2: el AND de «sigue sin existir» no era verificable → reescrito con la comprobación tras terminar el proceso.
- **Aceptado** — Técnica 4: «ilegible» sin definir → decisiones 5 y 12, y escenarios de forma errónea y de carpeta en la ruta.
- **Aceptado** — Técnica 5: contrato del arranque → decisión 13 (el arranque ya existe; solo se fija su salida).
- **Aceptado** — Técnica 6: decisiones fuera de la lista → decisiones 12, 13 y 4 (guarda solo si cambia algo).
- **Aceptado** — Técnica 7: fallo al guardar y `renameSync` en Windows → decisión 15 y escenario nuevo.
- **Aceptado** — Técnica 8: aislamiento de los tests → decisiones 9 y 13.
- **Aceptado** — Técnica 9: APIs y Node → decisión 8 (sin reconciliar `engines`: fuera de esta feature).

Segunda ronda (un revisor, sonnet; las decisiones 12 a 15 ya estaban escritas y pasaron por ella):

- **Aceptado** — 1 (Crítico): la carpeta se crea solo al guardar → decisión 7 y escenario nuevo «Guardar crea la carpeta».
- **Aceptado** — 2 (Crítico): «permisos» y «carpeta» sin escenario → escenario de carpeta en la ruta; permisos declarados no probados (decisión 5).
- **Aceptado** — 3: validación del formato → decisión 12 enumera las reglas; escenario de `status` inválido.
- **Aceptado** — 4: el escenario de fallo al guardar pasaba trivialmente → el GIVEN dice que el test crea el fichero; el borrado del temporal tras renombrado fallido no se prueba (decisión 7).
- **Aceptado** — 5: orden de lectura y validación → decisión 13: todo comando carga y valida, intencionado.
- **Aceptado** — 6: `SALAS_DATOS` vacía o relativa → decisión 2.
- **Aceptado** — 7: nombre del temporal y texto de `operations.md` → decisión 7 y Scope: «Motor de producción: sin base de datos; las reservas viven en un fichero JSON (`~/.salas/reservas.json`, o la ruta de `SALAS_DATOS`)».
- **Aceptado** — 8: quién cambia el `status` de la 0004 → decisión 10 (lo hace el cierre).
- **Aceptado** — 9: descripción de la capacidad → «Capacidades» y decisión 11.
- **Rechazado** — 10: separar las líneas de política y repaso de las decisiones → la plantilla las pone dentro de este bloque; la numeración ya las distingue.
- Sin tercera ronda: solo hay dos Críticos aceptados y ya están plegados.

## Intent

Hoy el estado de salas vive solo en memoria (ADR 0004): al cerrar la terminal, las cancelaciones y anulaciones se pierden y la reserva de ejemplo vuelve a estar activa. Importa porque cada uso de la herramienta es un proceso nuevo: nada de lo cancelado o anulado en un uso se ve en el siguiente. Éxito: cancelar `Norte lun`, cerrar la terminal, abrirla y volver a cancelar `Norte lun` responde `sin reserva Norte lun`; y `libres 10:00-12:00` responde `Norte, Sur`. Sería un fracaso, aunque «funcione», que un fichero corrupto se trague las reservas en silencio. `reservar` sigue sin crear reservas (decisión 4).

## Scope

- Entra: guardar el estado (las reservas con su estado `active`, `cancelled`, `voided`) en un fichero JSON y leerlo en cada arranque.
- Entra: partir de la reserva de ejemplo cuando no hay fichero (decisión 3).
- Entra: `SALAS_DATOS` para cambiar la ruta; aviso y salida con código 1 si el fichero es ilegible (incluida una forma inválida) o no se puede guardar.
- Entra: aislar los tests actuales con un fichero temporal; reescribir la línea del motor de producción de `operations.md` como «sin base de datos; las reservas viven en un fichero JSON (`~/.salas/reservas.json`, o la ruta de `SALAS_DATOS`)».
- No entra: que `reservar` cree reservas (decisión 4); bloqueo entre terminales (6); versionado o migración del formato (12); base de datos o dependencias externas (1); recuperar reservas de un fichero ilegible (5); trasladar a la capacidad lo que ya hacen `cancelar`, `anular` y `libres` (11).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «Cerrar la terminal pierde las reservas» (consecuencia de la ADR 0004) | `.docs/sdd/decisions/0004-single-process-state.md:25` | decisión 10: la ADR 0007 la sustituye; la escribe el cierre |
| «`src/` no importa `node:fs`» (confirmación de la ADR 0004) | `.docs/sdd/decisions/0004-single-process-state.md:29` | decisiones 8 y 10: queda sustituida por 0007 |
| «En memoria: cada arranque empieza vacío» (la decisión misma) | `.docs/sdd/decisions/0004-single-process-state.md:21` | decisión 10: la ADR es inmutable, solo cambia su `status` |
| «Motor de producción: sin base de datos; las reservas viven en memoria» | `.docs/sdd/operations.md:14` | Scope: se reescribe en esta feature |

- Filas que implementa: nada: el roadmap no tiene fila para esto; comprobado con `git grep -niE "memoria|pierde|node:fs|persist|0012" -- . ':!.docs/sdd/specs'`. El id 0012 sale de `sdd id next --reserve`.

## Approach

Fichero JSON único con todas las reservas, leído al empezar cada `run` y reescrito entero (de forma atómica) tras un `cancelar` o `anular` que cambie algo (decisiones 1, 2, 4, 7, 13). Ruta por defecto en la carpeta personal, sustituible con `SALAS_DATOS` (2). Sin fichero se parte de la reserva de ejemplo (3). Con fichero ilegible o fallo al guardar se corta sin tocar nada (5, 14, 15). Todo en `src/app.js` (8).

## Dónde se prueba

- Sobrevivir entre arranques y primer arranque: arrancando `node src/app.js` varias veces como procesos (`spawnSync`, salida en UTF-8), con `SALAS_DATOS` temporal. Es la costura real («cerrar y volver a abrir») y está más alta que `run`.
- Ruta por defecto: el mismo arranque con `HOME` y `USERPROFILE` apuntando a una carpeta temporal y sin `SALAS_DATOS`.
- Fichero ilegible (`{roto`, forma errónea, carpeta en la ruta) y fallo al guardar (la carpeta padre de `SALAS_DATOS` es un fichero normal): arranque como proceso; se comprueban código de salida, error estándar, salida estándar y que el fichero no cambia.
- Tests existentes de `libres`, `reservar` y `cancelar`: siguen llamando a `run`, ahora con `SALAS_DATOS` temporal por test (decisión 9).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: «Las reservas se guardan en un fichero JSON» — alternativa descartada: seguir en memoria, ADR 0004 (la sustituye)

## Delta de comportamiento

### Capacidad: `reservations`

#### ADDED — Las cancelaciones sobreviven al cierre de la terminal

- GIVEN la reserva activa Norte lun 10:00-12:00 y `SALAS_DATOS` apuntando a `/tmp/salas-a/reservas.json`, que no existe
- WHEN se ejecuta `cancelar Norte lun` y, en un proceso nuevo, `libres 10:00-12:00`
- THEN el primero responde `cancelada Norte lun` y el segundo responde `Norte, Sur`
- AND en un tercer proceso, `cancelar Norte lun` responde `sin reserva Norte lun`

#### ADDED — Las anulaciones también sobreviven

- GIVEN la reserva activa Norte lun 10:00-12:00 y `SALAS_DATOS` apuntando a `/tmp/salas-b/reservas.json`, que no existe
- WHEN se ejecuta `anular Norte lun` y, en un proceso nuevo, `anular Norte lun`
- THEN el primero responde `anulada Norte lun` y el segundo responde `sin reserva Norte lun`

#### ADDED — El primer arranque parte de la reserva de ejemplo

- GIVEN `SALAS_DATOS` apuntando a `/tmp/salas-c/reservas.json`, que no existe, y cuya carpeta `/tmp/salas-c` tampoco
- WHEN se ejecuta `libres 10:00-12:00`
- THEN responde `Sur`
- AND, al terminar el proceso, ni `/tmp/salas-c/reservas.json` ni `/tmp/salas-c` existen

#### ADDED — La ruta por defecto es la carpeta personal

- GIVEN `SALAS_DATOS` sin definir, y `HOME` y `USERPROFILE` apuntando a una carpeta temporal vacía
- WHEN se ejecuta `cancelar Norte lun`
- THEN responde `cancelada Norte lun`
- AND existe `.salas/reservas.json` dentro de esa carpeta temporal

#### ADDED — Un fichero ilegible no se pisa

- GIVEN `SALAS_DATOS` apuntando a `/tmp/salas-d/reservas.json`, con el contenido `{roto`
- WHEN se ejecuta `libres 10:00-12:00`
- THEN sale con código 1
- AND la salida de error es exactamente `reservas ilegibles: /tmp/salas-d/reservas.json — no se ha tocado el fichero` seguida de un salto de línea
- AND la salida estándar está vacía
- AND el fichero sigue conteniendo `{roto`

#### ADDED — Un fichero con otra forma también es ilegible

- GIVEN `SALAS_DATOS` apuntando a `/tmp/salas-e/reservas.json`, con el contenido `{"bookings": 3}`
- WHEN se ejecuta `cancelar Norte lun`
- THEN sale con código 1 y la salida de error es `reservas ilegibles: /tmp/salas-e/reservas.json — no se ha tocado el fichero` seguida de un salto de línea
- AND el fichero sigue conteniendo `{"bookings": 3}`

#### ADDED — Guardar crea la carpeta que falte

- GIVEN `SALAS_DATOS` apuntando a `/tmp/salas-g/a/b/reservas.json`, y `/tmp/salas-g` no existe
- WHEN se ejecuta `cancelar Norte lun`
- THEN responde `cancelada Norte lun`
- AND existe `/tmp/salas-g/a/b/reservas.json`

#### ADDED — Una carpeta en la ruta es un fichero ilegible

- GIVEN `SALAS_DATOS` apuntando a `/tmp/salas-h`, que es una carpeta
- WHEN se ejecuta `libres 10:00-12:00`
- THEN sale con código 1 y la salida de error es `reservas ilegibles: /tmp/salas-h — no se ha tocado el fichero` seguida de un salto de línea
- AND la salida estándar está vacía

#### ADDED — Un estado desconocido es un fichero ilegible

- GIVEN `SALAS_DATOS` apuntando a `/tmp/salas-i/reservas.json`, con `{"bookings": [{"room": "Norte", "day": "lun", "slot": "10:00-12:00", "status": "pending"}]}`
- WHEN se ejecuta `libres 10:00-12:00`
- THEN sale con código 1 y la salida de error es `reservas ilegibles: /tmp/salas-i/reservas.json — no se ha tocado el fichero` seguida de un salto de línea
- AND el fichero conserva su contenido

#### ADDED — Si no se puede guardar, no se responde como si se hubiera guardado

- GIVEN `SALAS_DATOS` apuntando a `/tmp/salas-f/x/reservas.json`, donde `/tmp/salas-f/x` es un fichero normal creado por el test, no una carpeta
- WHEN se ejecuta `cancelar Norte lun`
- THEN sale con código 1
- AND la salida de error es `no se han podido guardar las reservas: /tmp/salas-f/x/reservas.json` seguida de un salto de línea
- AND la salida estándar está vacía
- AND no queda ningún fichero temporal en `/tmp/salas-f`

#### Reglas de la capacidad — reservations

- **Dónde viven los datos**: un fichero JSON `{"bookings": [{"room", "day", "slot", "status"}]}` en `~/.salas/reservas.json`, o en la ruta de `SALAS_DATOS`
- **Idioma de los nombres**: los del código (`bookings`, `room`, `day`, `slot`, `status`, `active`, `cancelled`, `voided`); los textos de aviso, en castellano (constitución, punto 4)
- **Límites**: no aplica
- **Avisos**: `reservas ilegibles: <ruta> — no se ha tocado el fichero` y `no se han podido guardar las reservas: <ruta>`, ambos por la salida de error y con código de salida 1
- **Regla ante conflicto**: no aplica (con dos terminales a la vez gana la última escritura: riesgo aceptado, sin promesa)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
