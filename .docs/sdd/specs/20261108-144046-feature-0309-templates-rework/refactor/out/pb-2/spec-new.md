---
id: 20261109-090038-feature-0012-informes
feature: 0012
title: Informes de uso de las salas
mode: full
profile: delegate
status: draft
created: 2026-11-09
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Informes de uso de las salas

🦆 Hoy se pueden reservar, cancelar y anular salas, pero no ver cómo se usan. Con `informes` sale una tabla de texto con cuatro vistas: reservas por sala, reservas por día de la semana, franjas más reservadas y salas que nadie ha reservado; por ejemplo, con Norte reservada 3 veces y Sur otras 3, la primera vista dice `Norte  3` y `Sur    3`. `informes --sala Sur` enseña las mismas cuatro vistas solo con las reservas de Sur. Las canceladas y las anuladas no cuentan, y si no hay reservas cada vista dice «sin reservas». Se calcula al momento sobre las reservas que hay en memoria.

Validación: dev-lead — la salida es una tabla que lee una persona, y el formato y los textos los tiene que ver quien la usa.

## Capacidades

- Nuevas: `reports` — informes de uso de las salas: cuatro vistas y su filtro por sala

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`reports`) · tamaño: ~110 líneas entre `src/app.js` y `test/informes.test.js`
- Dominio (sonnet): si «sin reservas» y `ninguna` se aplican igual en las cuatro vistas con y sin `--sala`, y si «solo cuentan las activas» es coherente con «Salas sin reservas» (señal: capacidad nueva)
- Técnica (sonnet): si los THEN de las tablas (anchos, separación, línea en blanco) son comprobables carácter a carácter y si la función pura recibe los datos que hacen falta para el filtro (señal: capacidad nueva)
- Mínimo razonable: solo dominio — deja sin mirar la comprobabilidad exacta de los formatos de tabla

1. **Qué reservas cuentan**: solo las activas. Las canceladas y las anuladas no cuentan en ninguna vista, tampoco en «Salas sin reservas» (una sala cuyas reservas están todas canceladas sale como sin reservas) — la herramienta ya trata `active` como «la reserva vigente» y así las cuatro vistas dicen lo mismo.
2. **Ocupación = número de reservas activas**, no porcentaje — el proyecto no define cuántas franjas tiene una sala al día ni a la semana, así que un porcentaje sería inventado.
3. **Ocupación por sala**: salen todas las salas, también con 0, salvo que no haya ninguna reserva que cuente (entonces manda la decisión 8 y sale solo `sin reservas`) o que haya `--sala` (entonces sale solo la sala pedida); orden de más a menos reservas y, en empate, por nombre.
4. **Ocupación por día**: salen solo los días con reservas, en orden de semana `lun mar mie jue vie sab dom` (sin tildes, como el dato `lun` que ya guarda la herramienta); un día fuera de esa lista va después de `dom` — la herramienta no valida el día y no quiero que un día mal escrito rompa el informe.
5. **Franjas más reservadas**: salen todas las franjas con reservas, de más a menos reservas y, en empate, por franja; sin tope de filas (un coworking tiene pocas franjas distintas, la lista es corta).
6. **Salas sin reservas**: si todas las salas tienen alguna, la vista dice `ninguna`.
7. **Forma de la tabla**: título del informe, fila de cabecera en minúsculas y una fila por dato; columnas alineadas a la izquierda, anchas como su celda más larga y separadas por dos espacios, sin espacios al final de la línea; las cuatro vistas, siempre en este orden —sala, día, franjas, sin reservas—, separadas por una línea en blanco, y sin salto de línea al final de la cadena. Una vista que dice `sin reservas` o `ninguna` lleva su título y debajo solo ese texto, sin cabecera. Títulos: `Ocupación por sala`, `Ocupación por día de la semana`, `Franjas más reservadas`, `Salas sin reservas`. Cabeceras, antes de alinear: `sala` + `reservas`, `día` + `reservas`, `franja` + `reservas`, y solo `sala`.
8. **«sin reservas»**: si no hay ninguna reserva que cuente (con el filtro aplicado), cada vista pone su título y debajo `sin reservas`, también «Salas sin reservas». Consecuencia: con `--sala` sobre una sala sin reservas, las cuatro dicen `sin reservas`, y con `--sala` sobre una sala con reservas, «Salas sin reservas» dice `ninguna`; esa vista aporta poco con el filtro, pero el dev-lead pidió las cuatro vistas.
9. **`--sala`**: el nombre se compara exacto, como en `cancelar` (`Norte`, no `norte`). Una sala que no existe: `sala desconocida: Oeste`, sin tablas. `--sala` sin nombre: `falta la sala tras --sala`. Cualquier otro argumento tras `informes` se ignora, como hacen hoy los demás comandos.
10. **Capacidad nueva `reports`** (slug en inglés kebab-case) con sus «Reglas de la capacidad».
11. **Enfoque**: una función pura con el filtro y un ayudante que dibuja la tabla, los dos en `src/app.js`, frente a un módulo aparte y a escribir cada vista a mano (ver Approach).
12. **Dónde se prueba**: dos costuras: las vistas con datos de varias reservas, llamando a la función pura con datos de prueba, y una prueba por `run` con los datos que trae la herramienta — por `run` solo no se pueden preparar varias reservas sin tocar el estado compartido.
13. **Validación del cierre**: `dev-lead`; no concedo `agente` porque la frase que delega no lo nombra.
14. **Orden y comparación**: «por nombre» y «por franja» comparan los textos tal cual, letra a letra (distingue mayúsculas; `10:00-11:00` va antes que `9:00-10:00`, porque la herramienta no valida la franja); varios días fuera de la lista van entre sí en ese mismo orden.
15. **Reservas de una sala que no está en la lista de salas**: no cuentan en ninguna vista — la herramienta no puede crearlas hoy.
16. **`--sala` seguido de otra opción, o repetido**: esa opción se toma como el nombre (`informes --sala --x` → `sala desconocida: --x`); no la trato como «sin nombre». Si `--sala` aparece dos veces, manda la primera.
17. **Dónde vive la lógica**: `informes(reservas, salas, parámetros)` recibe como `parámetros` la lista de argumentos que siguen a `informes`, tal como llega a `run`, valida `--sala` y devuelve siempre una cadena, también para los dos avisos; `run` solo la llama con los datos en memoria. Se exporta de `src/app.js` (hoy se exportan `run`, `cancelBooking` y `voidBooking`). Las reservas de prueba tienen la forma de las de la herramienta: `room`, `day`, `slot` y `status`.
- Política de modelos: revisores de la spec: dominio sonnet y técnica sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto (Native, una task tras otra) · en paralelo hasta `control.maxParallelAgents` (sin fijar en `sdd-kit.json`: el tope por defecto del kit) — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
- Repaso de coherencia: literales de títulos, cabeceras y textos cotejados entre decisiones y escenarios; nada que se retire; `git grep -niE "informes?"` sin resultados fuera de `specs/`; delta probado en una copia de `.docs/sdd` con `sdd capability merge`: crea `reports.md` con los requisitos añadidos y las 5 reglas, sin rechazos (se repite tras la review).

### Hallazgos de la review

Dominio (sonnet):
- **Aceptado** — la decisión 3 contradice la 8 → la 3 dice ahora cuándo sale `sin reservas` y cuándo solo la sala pedida
- **Aceptado** — con `--sala` la cuarta vista no decía contra qué sala compara → el Approach lo dice
- **Rechazado** — «Salas sin reservas» dice `sin reservas` en vez de listar salas cuando no hay reservas → es la decisión literal del dev-lead («sin reservas, cada vista dice «sin reservas»»); queda dicho en la decisión 8
- **Aceptado** — el Intent hablaba de «la semana» → «con las reservas que hay»
- **Aceptado** — la sala desconocida usaba salas distintas de las de `run` → el GIVEN usa Norte y Sur
- **Aceptado** — «una oficina» no encaja con la misión → «un coworking»
- **Aceptado** — comportamientos fijados fuera del Scope y de las reglas → entran en el Scope y en «Límites»
- **Aceptado** — «Límites» mezclaba un filtro con el tope → «solo activas» queda en la decisión 1; la regla ante conflicto dice por qué no aplica

Técnica (sonnet):
- **Aceptado (Crítico)** — fila `Sur  3` mal alineada con `--sala Sur` → `Sur   3`, y cada escenario de tablas da ahora la salida exacta de su vista
- **Aceptado** — sin salida completa ni salto final → salida exacta por vista, escenario completo con los datos de la herramienta y decisión 7 (sin salto final)
- **Aceptado** — los AND de «sin reservas» y «ninguna» heredaban un GIVEN con reservas → escenarios con su propio GIVEN
- **Aceptado** — reglas sin escenario (empates, día fuera de la lista, `norte`, argumento sobrante) → escenarios y ANDs nuevos
- **Aceptado** — con `--sala` la vista 1 lista solo esa sala, sin declarar → decisión 3
- **Aceptado** — el estado inicial por `run` no estaba dicho → «Dónde se prueba» dice de dónde sale y por qué no lo cambian otros tests
- **Aceptado** — comparadores y salas fuera de la lista → decisiones 14 y 15
- **Aceptado** — dónde se valida `--sala` y `--sala --x` → decisiones 16 y 17
- **Aceptado** — exportar la función → decisión 17 y Approach
- **Rechazado** — escenario de que un comando desconocido sigue devolviendo `salas` → no es comportamiento de `reports`; no hay texto de ayuda que cambiar y `run` no toca ese camino

Segunda ronda (sonnet, sin Críticos):
- **Aceptado** — la spec decía «cadena completa» sin darla → «Dónde se prueba» dice «la salida exacta que cita»
- **Aceptado** — decisiones 14 y 15 sin escenario → escenario «Orden por texto y sala fuera de la lista»
- **Aceptado** — las reglas de negocio (solo activas, número y no porcentaje, sala fuera de la lista) no estaban en las 5 reglas → «Límites»
- **Aceptado** — forma de `parámetros` y valor devuelto → decisión 17
- **Aceptado** — «dos ficheros de test» → `test/informes.test.js`
- **Aceptado** — el AND de `--sala Este` → dice qué equivale a qué
- **Aceptado** — la cuarta vista sin reservas no lista salas → Intent
- **Aceptado** — `--sala` repetido → decisión 16; «la pediste» → «el dev-lead pidió»
- **Rechazado** — en qué task entran el ayudante de tabla, el cableado y los avisos → es del plan (Task 1: ayudante, cableado y exportación; Task 5: filtro y avisos), no del comportamiento observable

### Decisiones tomadas con el dev-lead

- Un comando `informes` con cuatro vistas: ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado — «decidido con el dev-lead: un comando informes con cuatro vistas»
- Opción `--sala` que filtra las cuatro — «una opción --sala que filtra las cuatro»
- Salida: tabla de texto — «la salida es una tabla de texto»
- Sin reservas, cada vista dice «sin reservas» — «sin reservas, cada vista dice «sin reservas»»
- El plan sale en 5 tasks, una por vista y otra para `--sala` — «el plan sale en 5 tasks, una por vista y otra para --sala»
- Perfil delegate — «Perfil delegate»

## Intent

Hoy la herramienta reserva, cancela y anula, pero no deja ver cómo se usan las salas del coworking: para saber qué sala se llena, qué día y a qué hora, hay que contar a mano. Se quiere un comando `informes` que lo diga en una tabla de texto. Es un éxito si las cuatro vistas salen correctas con las reservas que hay. Sin reservas que cuenten, la cuarta vista no lista salas: dice `sin reservas`, como las otras tres. Sería un fracaso, aunque «funcione», que contara las canceladas como ocupación o que una vista sin datos saliera en blanco en vez de decir «sin reservas».

## Scope

- Entra: el comando `informes` con las cuatro vistas; la opción `--sala <nombre>` que las filtra, con el nombre exacto y los argumentos sobrantes ignorados; un día fuera de `lun…dom` va después de `dom`; los textos `sin reservas`, `ninguna`, `sala desconocida: <sala>` y `falta la sala tras --sala`; la exportación de `informes` desde `src/app.js`; los tests; la entrada del changelog al cerrar.
- No entra: porcentajes de ocupación; rangos de fechas (el informe es de todas las reservas que hay); exportar a fichero o a calendario (`B1` del backlog); otros formatos de salida; validar el día o la franja de las reservas (deuda ya anotada en el roadmap).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | `git grep -niE "informes?"` sin resultados fuera de `.docs/sdd/specs/`; `run` ya devuelve `salas` para un comando que no conoce y `informes` pasa a conocerse sin tocar a los demás | — |

- Filas que implementa: nada: comprobado con `git grep -niE "0012" -- .docs/sdd/roadmap.md` (la 0012 no tiene fila en el roadmap; el id viene de `sdd id next --reserve`)

## Approach

- **A. Una función pura y un ayudante de tabla, en `src/app.js`**: `informes(reservas, salas, parámetros)` calcula las cuatro vistas con las reservas activas (filtradas por sala si hay `--sala`) y un ayudante dibuja cada tabla. `run('informes', …)` la llama con los datos en memoria; se exporta para probarla con datos de prueba. Cuesta: `src/app.js` crece (~60 líneas) pero sigue siendo el único fichero de la herramienta; la función se prueba sola, sin tocar el estado compartido.
- B. Un módulo nuevo `src/informes.js` — separa mejor, pero el stack dice «un solo fichero de entrada» y para cuatro vistas pequeñas es más estructura que lógica.
- C. Cada vista construye su texto a mano — cuatro copias del formato de tabla (anchos, separación, `sin reservas`) que tienen que seguir iguales; el cambio de una se olvidaría en las otras.
- Elegido: **A** — comparte el formato de las cuatro vistas en un único sitio y deja probar los cálculos con datos de prueba; el plan lo reparte en las 5 tasks del dev-lead (una por vista y la del filtro).

Partes del cómo que fija el enfoque: las vistas reciben las reservas ya filtradas (el filtro por sala se aplica una sola vez, antes de calcular), la vista «Salas sin reservas» compara las salas con las reservas que quedan (con `--sala`, solo la sala pedida con sus reservas), y `--sala` se lee de los parámetros de `run` como `--cada-semana` en `reservar`.

## Dónde se prueba

- Las cuatro vistas, `sin reservas`, `ninguna`, el orden, el día fuera de la lista y `--sala`: llamando a `informes` con datos de prueba (varias reservas, una cancelada y una anulada), en `test/informes.test.js`, con el patrón de `test/app.test.js`; cada THEN se compara con la salida exacta que cita, y el orden y la separación de las cuatro vistas, con el escenario de los datos que trae la herramienta.
- El comando completo con los datos que trae la herramienta, y sala desconocida o sin nombre: por `run('informes', …)`, como los tests de `app.test.js`. Los datos que trae son los de `src/app.js` (salas Norte y Sur, una reserva activa Norte lun 10:00-12:00); `node --test` corre cada fichero en su propio proceso, así que lo que `cancel.test.js` cancela no afecta a `informes.test.js`.

## Términos y ADR

- Términos resueltos: ocupación — número de reservas activas, no porcentaje; reserva — una activa (la cancelada y la anulada no cuentan en los informes)
- ADR candidatas: ninguna

## Delta de comportamiento

Datos de prueba de los escenarios, salvo donde se diga otra cosa: salas Norte, Sur y Este; reservas activas: Norte lun 10:00-12:00, Norte lun 12:00-14:00, Norte mar 10:00-12:00, Sur lun 10:00-12:00, Sur mie 10:00-12:00, Sur mie 12:00-14:00; Este jue 10:00-12:00 cancelada y Este vie 14:00-16:00 anulada. La salida de cada escenario es la cadena completa, sin salto de línea al final.

### Capacidad: `reports`

#### ADDED — Ocupación por sala

- GIVEN los datos de prueba
- WHEN se pide `informes`
- THEN la primera vista es, cada una en su línea: `Ocupación por sala` / `sala   reservas` / `Norte  3` / `Sur    3` / `Este   0`
- AND las reservas cancelada y anulada de Este no cuentan

#### ADDED — Ocupación por día de la semana

- GIVEN los datos de prueba
- WHEN se pide `informes`
- THEN la segunda vista es: `Ocupación por día de la semana` / `día  reservas` / `lun  3` / `mar  1` / `mie  2`
- AND los días salen en orden de semana, no de más a menos reservas

#### ADDED — Franjas más reservadas

- GIVEN los datos de prueba
- WHEN se pide `informes`
- THEN la tercera vista es: `Franjas más reservadas` / `franja       reservas` / `10:00-12:00  4` / `12:00-14:00  2`

#### ADDED — Salas sin reservas

- GIVEN los datos de prueba
- WHEN se pide `informes`
- THEN la cuarta vista es: `Salas sin reservas` / `sala` / `Este`, porque las dos reservas de Este no están activas

#### ADDED — Orden de las filas en empate

- GIVEN las salas Norte y Sur, y las reservas activas, en este orden: Sur lun 12:00-14:00, Norte lun 10:00-12:00, Sur mar 10:00-12:00, Norte mar 12:00-14:00
- WHEN se pide `informes`
- THEN la primera vista pone `Norte  2` antes de `Sur    2`, y la tercera pone `10:00-12:00  2` antes de `12:00-14:00  2`

#### ADDED — Día fuera de la lista

- GIVEN la sala Norte y las reservas activas Norte xyz 10:00-12:00, Norte lun 10:00-12:00 y Norte abc 12:00-14:00
- WHEN se pide `informes`
- THEN la segunda vista tiene las filas `lun  1`, `abc  1` y `xyz  1`, en ese orden

#### ADDED — Sin reservas

- GIVEN las salas Norte, Sur y Este, y como única reserva Este jue 10:00-12:00 cancelada
- WHEN se pide `informes`
- THEN la salida es, cada una en su línea: `Ocupación por sala` / `sin reservas` / (línea en blanco) / `Ocupación por día de la semana` / `sin reservas` / (línea en blanco) / `Franjas más reservadas` / `sin reservas` / (línea en blanco) / `Salas sin reservas` / `sin reservas`

#### ADDED — Orden por texto y sala fuera de la lista

- GIVEN las salas Norte y Sur, y las reservas activas Norte lun 9:00-10:00, Norte lun 10:00-11:00 y Oeste lun 10:00-11:00
- WHEN se pide `informes`
- THEN la tercera vista tiene las filas `10:00-11:00  1` y `9:00-10:00  1`, en ese orden, y la primera vista dice `Norte  2` y `Sur    0`: la reserva de Oeste, que no es una sala de la lista, no cuenta

#### ADDED — Todas las salas tienen reservas

- GIVEN las salas Norte y Sur, y las reservas activas Norte lun 10:00-12:00 y Sur mar 10:00-12:00
- WHEN se pide `informes`
- THEN la cuarta vista es `Salas sin reservas` y, en la línea siguiente, `ninguna`

#### ADDED — Filtrar los informes por sala

- GIVEN los datos de prueba
- WHEN se pide `informes --sala Sur`
- THEN las cuatro vistas cuentan solo Sur: `sala  reservas` / `Sur   3`; `lun  1` / `mie  2`; `10:00-12:00  2` / `12:00-14:00  1`; y `Salas sin reservas` / `ninguna`
- AND con `informes x --sala Sur`, el argumento sobrante se ignora y la salida es la misma
- AND con `informes --sala Este`, que no tiene reservas activas, las cuatro vistas dicen lo mismo que en «Sin reservas»

#### ADDED — Sala desconocida o sin nombre

- GIVEN las salas que trae la herramienta, Norte y Sur
- WHEN se pide `informes --sala Oeste`
- THEN sale solo `sala desconocida: Oeste`, sin tablas
- AND con `informes --sala norte` sale `sala desconocida: norte` y con `informes --sala --x` sale `sala desconocida: --x`
- AND con `informes --sala` sin nombre sale solo `falta la sala tras --sala`

#### ADDED — Informes con los datos que trae la herramienta

- GIVEN las salas Norte y Sur, y una única reserva activa: Norte lun 10:00-12:00
- WHEN se pide `informes`
- THEN las cuatro vistas salen en ese orden, con una línea en blanco entre ellas y sin salto final: `Ocupación por sala` / `sala   reservas` / `Norte  1` / `Sur    0` / ∅ / `Ocupación por día de la semana` / `día  reservas` / `lun  1` / ∅ / `Franjas más reservadas` / `franja       reservas` / `10:00-12:00  1` / ∅ / `Salas sin reservas` / `sala` / `Sur` (∅ = línea en blanco)

#### Reglas de la capacidad — reports

- **Dónde viven los datos**: en memoria, las reservas de la herramienta; el informe no guarda nada
- **Idioma de los nombres**: castellano en títulos, cabeceras y avisos; los días como los guarda la herramienta (`lun mar mie jue vie sab dom`)
- **Límites**: solo cuentan las reservas activas de las salas de la lista; la ocupación es un número de reservas, no un porcentaje; sin tope de filas; un día fuera de `lun…dom` va después de `dom`; `--sala` compara el nombre exacto y los argumentos sobrantes se ignoran
- **Avisos**: `sin reservas` en cada vista sin reservas que cuenten · `ninguna` en «Salas sin reservas» si todas tienen reservas · `sala desconocida: <sala>` · `falta la sala tras --sala`
- **Regla ante conflicto**: no aplica: el informe solo lee las reservas, no escribe nada

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
