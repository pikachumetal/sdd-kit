---
id: 20261112-133448-feature-0010-lista-espera
feature: 0010
title: Lista de espera para una sala ocupada
mode: full
status: draft
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Lista de espera para una sala ocupada

🦆 Hoy, si Norte está ocupada el lunes de 10:00 a 12:00 por una reserva de otra persona, tienes que volver a ejecutar `libres` cada rato para ver si se ha soltado. Con esto, `salas reservar Norte lun 10:00-12:00` te responde `Norte ocupada; en espera` y te apunta. Cuando se anote la cancelación de esa reserva (`salas cancelar lun 10:00`), la sala pasa a ser tuya: `cancelada lun 10:00; Norte pasa a tu reserva`. Para que la espera sobreviva entre ejecuciones, el programa pasa a guardar reservas y esperas en un fichero `salas.json`.

Validación: dev-lead — es una orden de la línea de comandos que usa una persona; solo ella ve si la respuesta tiene sentido.

## Capacidades

- Nuevas: `waitlist` — reservar una sala ocupada te apunta a la espera, y al cancelarse su reserva pasa a ser tuya.
- Modificadas: ninguna (no hay `capabilities/` todavía: el comportamiento actual de `reservar`, `cancelar` y `libres` no está documentado como capacidad).
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`waitlist`), contrato público (salida de `reservar` y `cancelar` en la línea de comandos), datos nuevos persistentes (`salas.json`) · tamaño: ~110 líneas en 4 ficheros (`src/app.js`, `src/store.js` nuevo, `test/app.test.js`, `.gitignore` nuevo)
- Dominio (opus): si «la sala pasa a tu reserva al cancelar» deja huecos con varias salas o franjas a la vez, y si `cancelar` sin sala (decisión 7) puede cancelar más de lo que quieres (señal: capacidad nueva + regla de flujo)
- Técnica (sonnet): si pasar el estado en memoria a `salas.json` mantiene verdes los tres tests actuales (`libres`, `reservar --cada-semana`, `cancelar`) y qué pasa si el fichero no existe o está corrupto (señal: datos + contrato público)
- Mínimo razonable: solo técnica — deja sin mirar el complemento de flujo (varias salas y franjas a la vez)

1. **Enfoque**: guardar reservas y esperas en un fichero y promover la espera dentro de `cancelar`, frente a mantener el estado en memoria (inútil: cada ejecución parte de cero) y a un proceso que vigile y avise (el programa es una orden que termina; costaría un servicio siempre en marcha) — ver Approach.
2. **El único hecho que libera una sala en la herramienta es `cancelar`**: por eso la promoción ocurre ahí, no hay sondeo ni avisos. `cancelar` es donde anotas que el coworking ha soltado una reserva.
3. **Tu respuesta «sí, adelante» a la pregunta de qué pasa al quedar libre la tomo como la opción 1** (la sala se reserva sola), que era la recomendada. Si querías otra, dímelo antes de aprobar.
4. **Persistencia en `salas.json`** en la raíz del proyecto, resuelta desde el módulo (no desde la carpeta donde ejecutes); la variable `SALAS_DATOS` cambia la ruta y se lee en cada llamada, para que cada test use su fichero. Sin fichero se parte del estado de hoy: Norte reservada el lunes de 10:00 a 12:00, ahora marcada como ajena (la mantengo para que `libres` siga igual y por compatibilidad con los tests actuales). No se versiona: `.gitignore` nuevo con `salas.json`.
5. **Titular de cada reserva**: cada reserva guarda si es `ajena` (la del coworking, como la inicial) o `propia` (la que haces tú con `reservar` o la que te llega de la espera). Solo se puede esperar una reserva ajena; sobre una propia, `reservar` responde `Norte ya es tuya lun 10:00-12:00`. Es lo que evita que esperes tu propia reserva.
6. **«Ocupada» es misma sala, mismo día y misma franja exacta**; la espera solo se cumple al cancelar una reserva con esa franja exacta, y `cancelar` compara su hora con el inicio de la franja (`10:00` casa con `10:00-12:00`). Las franjas que se solapan sin ser iguales no entran: `reservar` puede dejarte dos salas solapadas y la promoción tampoco lo comprueba; queda fuera, dicho aquí.
7. **`cancelar <día> <hora>` pasa a borrar de verdad** (hoy solo devuelve el texto y no toca ninguna reserva): borra, y guarda, todas las reservas de ese día y hora de inicio, sean ajenas o propias, aunque tengan franjas distintas (`10:00-11:00` y `10:00-12:00`), y promueve la espera de cada una cuya franja coincida exacta. No lleva sala (como hoy). Con Norte (con espera) y Sur reservadas el lunes a las 10:00 responde `cancelada lun 10:00; Norte pasa a tu reserva` y Sur queda libre; con dos promociones, una cláusula por sala en el orden del fichero, separadas por `; `. Cancelar una reserva propia la deja libre: es cómo sueltas una sala que te llegó y ya no quieres.
8. **Textos** (plantilla, `<sala>`, `<día>`, `<franja>`, `<hora>`): `reservada <sala> <día> <franja>` · `<sala> ocupada; en espera` (sin día ni franja: acabas de escribirlos) · `<sala> ya en espera <día> <franja>` · `<sala> ya es tuya <día> <franja>` · `cancelada <día> <hora>; <sala> pasa a tu reserva`. El de `cancelada <día> <hora>` sin espera no cambia. Fichero ilegible: `salas.json ilegible: revísalo o bórralo` y no se escribe nada.
9. **Sin posición en la cola**: solo hay un usuario, así que una sala+día+franja admite como máximo una espera; repetir la petición no duplica. Las claves de `salas.json` van en castellano.
10. **No entra** ver la lista de espera ni salirte de ella, hacer que `libres` mire el día (sigue comparando solo la franja: `reservar Sur mar 10:00-12:00` responde `reservada` pero `libres 10:00-12:00` también lo oculta el lunes; límite conocido, hoy ya pasa), validar la sala (`reservar Oeste lun 10:00-12:00` o `norte` en minúsculas se tratan como una sala más) y los parámetros de `reservar` incompletos (caen al texto `salas` de hoy), la concurrencia (dos ejecuciones a la vez: un solo usuario) y que la reserva `--cada-semana` se guarde. Sí entra que `libres` lea `salas.json`, sin cambiar su semántica.
11. **`reservar <sala> --cada-semana` no cambia**: sigue devolviendo `reserva semanal creada` sin leer ni tocar el fichero, esté como esté.
12. **Fichero ilegible** es JSON roto, vacío o con forma distinta del esquema; `reservar` (con día y franja), `cancelar` y `libres` responden `salas.json ilegible: revísalo o bórralo` y no escriben.
13. **Esquema de `salas.json`** (lo fijo yo porque los tests y el gate lo escriben a mano): `{"reservas":[{"sala":"Norte","dia":"lun","franja":"10:00-12:00","titular":"ajena"}],"esperas":[{"sala":"Norte","dia":"lun","franja":"10:00-12:00"}]}`; `titular` es `ajena` o `propia`.
14. **Repaso de coherencia** (repetido tras la review): la fusión del delta sobre una copia de `.docs/sdd` terminó sin rechazos (7+ escenarios y 5 reglas añadidos en `waitlist.md`); `git grep` de `0010` fuera de `.docs`: sin resultados; los literales de los textos coinciden en decisiones, escenarios y reglas.
- Política de modelos: revisores de la spec: dominio opus, técnica sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — Dominio 1 (esperar tu propia reserva no tiene sentido) → decisión 5 (titular ajena/propia), escenario «Una reserva propia no admite espera», 🦆 e Intent reescritos.
- **Aceptado** — Dominio 2 («ocupada» no definida) → decisión 6 y regla ante conflicto.
- **Aceptado** — Dominio 3 (varias salas a la vez) → decisión 7 y escenario «Cancelar con varias salas».
- **Aceptado** — Dominio 4 (promoción solapada) → declarada fuera de Scope en la decisión 6.
- **Aceptado** — Dominio 5 (semanal no persiste) → «No entra» en la decisión 10 y Scope; criterio de fracaso del Intent suavizado.
- **Aceptado** — Dominio 6 (`reservar` ya existe) → fila nueva en la tabla de cambios de forma.
- **Rechazado** — Dominio 7 (renombrar `waitlist` a `lista-espera`) → el slug de una capacidad es un nombre de fichero y el kit lo fija en kebab-case inglés; el contenido sí va en castellano.
- **Aceptado** — Dominio 8 (avisos como plantillas) → decisión 8 y regla «Avisos».
- **Rechazado** — Dominio 9 (partir de estado vacío) → se mantiene Norte reservada porque `libres` y su test actual dependen de ello; ahora marcada como ajena (decisión 4).
- **Aceptado** — Dominio 10 (esperar sobre reserva propia) → decisión 5 y su escenario.
- **Aceptado** — Técnica 1 (Crítico: GIVEN de sala libre sin fijar) → el escenario parte de Sur, libre en el estado inicial.
- **Aceptado** — Técnica 2 (Crítico: `10:00` frente a `10:00-12:00`) → decisión 6, regla «Límites» y escenario con franja distinta.
- **Aceptado** — Técnica 3 (Crítico: `SALAS_DATOS` al importar) → decisión 4 y «Dónde se prueba».
- **Aceptado** — Técnica 4 («entre ejecuciones» con memoria compartida) → «Dónde se prueba»: dos procesos `node src/app.js`.
- **Aceptado** — Técnica 5 y 6 (escenarios que ya pasan hoy) → marcados «no regresión» y el RED es el AND; salida literal `Norte, Sur`.
- **Aceptado** — Técnica 7 (ruta al cwd o al módulo) → decisión 4.
- **Aceptado** — Técnica 8 (fichero corrupto, concurrencia) → decisión 8, escenario «Fichero ilegible» y decisión 10.
- **Aceptado** — Técnica 9 (`.gitignore` y `store.js` nuevos) → tabla de cambios de forma y Scope.
- **Aceptado** — Técnica 10 (textos con y sin día) → decisión 8, declarado.

### Hallazgos de la segunda ronda (un revisor, sonnet)

- **Aceptado** — 1 (Crítico: `cancelar` hoy no borra) → decisión 7 reescrita, Scope y escenario de cancelar propia.
- **Aceptado** — 2 (Crítico: esquema de `salas.json` sin fijar) → decisión 13 y reglas.
- **Aceptado** — 3 → Scope: se editan los tres tests existentes para fijar `SALAS_DATOS`.
- **Aceptado** — 4 → Scope: `libres` lee del fichero sin cambiar su semántica; decisión 10.
- **Aceptado** — 5 → límite conocido de `libres` sin día, declarado en la decisión 10.
- **Aceptado** — 6 → decisión 12, escenario «Fichero ilegible» ampliado a `cancelar` y `libres`, semanal acotado.
- **Aceptado** — 7 → decisión 10 (sala desconocida, mayúsculas, parámetros incompletos) y orden de cláusulas en la 7.
- **Aceptado** — 8 → decisión 7 y escenario «Cancelar una reserva propia».
- **Aceptado** — 9 → observable añadido al escenario de varias salas.
- **Aceptado** — 10 → repaso repetido (decisión 14); no hay `store.test.js`, los tests van en `test/app.test.js`.

### Decisiones tomadas con el dev-lead

- Carril feature, modo full, perfil delegate — «sí, adelante: feature full con delegate»
- El motivo: no tener que volver a mirar `libres` a mano cuando Norte está ocupada — «cuando Norte está ocupada tengo que volver a mirar libres a mano cada rato»

## Intent

Hoy, con la sala que quieres ocupada por una reserva de otra persona, la única forma de enterarte de que se libera es ejecutar `libres` una y otra vez. Éxito: pides la sala una vez, el programa lo recuerda, y en el momento en que anotas la cancelación de esa reserva la sala queda reservada para ti, sin que tengas que volver a mirar. Fracaso aunque funcione: la espera se pierde al cerrar el programa (cada ejecución parte de cero), o `libres` sigue listando como libre una sala que te acaba de llegar.

## Scope

- Entra: `reservar <sala> <día> <franja>` (sala libre → reservada y propia; ajena ocupada → en espera; propia → aviso); `cancelar <día> <hora>` que pasa a borrar de verdad y promociona la espera; `libres` que lee de `salas.json`; guardar reservas (con su titular) y esperas en `salas.json`; `src/store.js` y `.gitignore` nuevos; tests, editando los tres actuales para fijar `SALAS_DATOS`.
- No entra: ver o quitar esperas; avisos por correo (es la 0008); `libres` con día; validar sala y parámetros; franjas solapadas; la reserva semanal persistente; concurrencia; validar el formato de la franja (deuda ya anotada).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Estado de reservas fijo en memoria (`bookings`) | `src/app.js:3`, `src/app.js:6` | Scope: pasa a leerse de `salas.json`, con el estado actual como valor inicial y marcado `ajena` (decisiones 4 y 5) |
| `reservar <sala> <día> <franja>` hoy cae al texto por defecto `salas` | `src/app.js:10`, `src/app.js:13` | Delta: ADDED «Reservar una sala libre» y «Apuntarse a la espera…»; el texto de `--cada-semana` no cambia (decisión 11) |
| `cancelar` que solo devuelve texto y no borra nada | `src/app.js:12`, `test/app.test.js:13` | Delta: ADDED; ahora borra y guarda (decisión 7); el texto sin espera no cambia (decisión 8) |
| Un solo fichero de código | `.docs/sdd/steering/operations.md` («Un solo fichero de entrada: `src/app.js`») | Scope: `src/app.js` sigue siendo la entrada; `src/store.js` es un módulo suyo, `operations.md` no cambia |

- Filas que implementa: 0010 (sin fila en `ROADMAP.md`; id reservado con `sdd id next`) → ningún fichero la nombra | nada: comprobado con `git grep -n 0010 -- . ':!.docs'`

## Approach

- Estado en memoria y promoción en la misma ejecución — no sirve: `reservar` y `cancelar` son ejecuciones distintas y la espera se perdería.
- Un proceso que vigile y avise — convierte una orden que termina en un servicio siempre en marcha, para un solo usuario.
- Elegido: fichero `salas.json` con reservas y esperas, y promoción dentro de `cancelar` — es lo mínimo que hace que la espera exista entre ejecuciones y no añade nada que ejecutar de fondo.

Partes que fija el enfoque: `src/store.js` lee y escribe `salas.json` con la ruta resuelta desde `import.meta.url`, y resuelve `SALAS_DATOS` en cada llamada; `run(cmd, params)` sigue siendo la costura.

## Dónde se prueba

- Reservar, esperar y promover: por `run()`, como los tests actuales de `test/app.test.js`; cada test fija `SALAS_DATOS` a un fichero temporal propio antes de llamar.
- Que la espera sobrevive entre ejecuciones: dos procesos `node src/app.js …` con el mismo `SALAS_DATOS` (con `child_process`), para que ningún estado en memoria pase por casualidad.
- La respuesta tal como la ve quien teclea: la misma ejecución real de `node src/app.js reservar Norte lun 10:00-12:00`.
- Los escenarios «Cancelar sin espera queda como hoy» (en su respuesta) y «La reserva semanal no cambia» son de no regresión: ya pasan hoy y no son el RED; el RED de aquel es el `libres` posterior.

## Términos y ADR

- Términos resueltos: espera — petición de una sala ocupada por una reserva ajena que se cumple sola al cancelarse esa reserva.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `waitlist`

#### ADDED — Reservar una sala libre

- GIVEN Sur sin reserva el lunes de 10:00 a 12:00 (estado inicial)
- WHEN `reservar Sur lun 10:00-12:00`
- THEN responde `reservada Sur lun 10:00-12:00`
- AND `libres 10:00-12:00` no lista Sur

#### ADDED — Apuntarse a la espera de una sala ocupada

- GIVEN Norte con reserva ajena el lunes de 10:00 a 12:00 y sin espera
- WHEN `reservar Norte lun 10:00-12:00`
- THEN responde `Norte ocupada; en espera`
- AND la reserva ajena no cambia

#### ADDED — Repetir la petición no duplica la espera

- GIVEN Norte con reserva ajena el lunes de 10:00 a 12:00 y ya en espera
- WHEN `reservar Norte lun 10:00-12:00`
- THEN responde `Norte ya en espera lun 10:00-12:00`
- AND sigue habiendo una sola espera

#### ADDED — Una reserva propia no admite espera

- GIVEN Sur reservada por ti el lunes de 10:00 a 12:00
- WHEN `reservar Sur lun 10:00-12:00`
- THEN responde `Sur ya es tuya lun 10:00-12:00`
- AND no se crea ninguna espera

#### ADDED — Al cancelar, la sala pasa a quien espera

- GIVEN Norte con reserva ajena el lunes de 10:00 a 12:00 y en espera de ella
- WHEN `cancelar lun 10:00`
- THEN responde `cancelada lun 10:00; Norte pasa a tu reserva`
- AND `libres 10:00-12:00` no lista Norte
- AND la reserva de Norte es ahora propia y la espera desaparece: un segundo `cancelar lun 10:00` responde `cancelada lun 10:00` y `libres 10:00-12:00` lista `Norte, Sur`

#### ADDED — Cancelar con varias salas

- GIVEN Norte (con espera) y Sur reservadas, ambas ajenas, el lunes de 10:00 a 12:00
- WHEN `cancelar lun 10:00`
- THEN responde `cancelada lun 10:00; Norte pasa a tu reserva`
- AND `libres 10:00-12:00` lista Sur
- AND un `reservar Norte lun 10:00-12:00` posterior responde `Norte ya es tuya lun 10:00-12:00`

#### ADDED — Cancelar una reserva propia

- GIVEN Sur reservada por ti el lunes de 10:00 a 12:00
- WHEN `cancelar lun 10:00`
- THEN responde `cancelada lun 10:00`
- AND `libres 10:00-12:00` lista Sur

#### ADDED — Cancelar sin espera queda como hoy

- GIVEN Norte con reserva ajena el lunes de 10:00 a 12:00 y sin espera
- WHEN `cancelar lun 10:00`
- THEN responde `cancelada lun 10:00`
- AND `libres 10:00-12:00` lista `Norte, Sur`

#### ADDED — La espera sobrevive entre ejecuciones

- GIVEN en un proceso `reservar Norte lun 10:00-12:00` respondió `Norte ocupada; en espera`
- WHEN en otro proceso distinto `cancelar lun 10:00`
- THEN responde `cancelada lun 10:00; Norte pasa a tu reserva`

#### ADDED — Fichero ilegible

- GIVEN `salas.json` con un JSON roto (o vacío, o con forma distinta del esquema)
- WHEN `reservar Norte lun 10:00-12:00`, o `cancelar lun 10:00`, o `libres 10:00-12:00`
- THEN cada una responde `salas.json ilegible: revísalo o bórralo`
- AND el fichero queda tal cual

#### ADDED — La reserva semanal no cambia

- GIVEN un `salas.json` cualquiera, también ilegible (esta orden no lo lee)
- WHEN `reservar Norte --cada-semana`
- THEN responde `reserva semanal creada`
- AND `salas.json` queda con los mismos bytes

#### Reglas de la capacidad — waitlist

- **Dónde viven los datos**: `salas.json` en la raíz del proyecto, resuelto desde el módulo; `SALAS_DATOS` cambia la ruta y se lee en cada llamada; sin fichero se parte de Norte con reserva ajena el lunes de 10:00 a 12:00. Esquema y claves en castellano: `{"reservas":[{"sala","dia","franja","titular"}],"esperas":[{"sala","dia","franja"}]}`, con `titular` igual a `ajena` o `propia`; ilegible es JSON roto, vacío o con otra forma.
- **Idioma de los nombres**: castellano (`lun`, `reservada`, `en espera`, `ajena`, `propia`).
- **Límites**: una espera como máximo por sala+día+franja; solo se espera una reserva ajena.
- **Avisos**: `reservada <sala> <día> <franja>` · `<sala> ocupada; en espera` · `<sala> ya en espera <día> <franja>` · `<sala> ya es tuya <día> <franja>` · `cancelada <día> <hora>; <sala> pasa a tu reserva` (una cláusula por sala promovida) · `salas.json ilegible: revísalo o bórralo`.
- **Regla ante conflicto**: «ocupada» es misma sala, día y franja exacta; pedir una sala ocupada por una reserva ajena te apunta a la espera; al cancelarse esa reserva (`cancelar` compara su hora con el inicio de la franja), la espera se convierte en reserva propia y desaparece.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
