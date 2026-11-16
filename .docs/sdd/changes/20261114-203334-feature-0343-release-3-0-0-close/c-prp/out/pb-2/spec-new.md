---
id: 20261116-111312-feature-0012-informes
feature: 0012
title: Comando informes con cuatro vistas
mode: full
status: draft
created: 2026-11-16
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Comando informes con cuatro vistas

🦆 Hoy no hay forma de ver cómo se usan las salas. Con `informes` sacas cuatro tablas de texto: reservas por sala, por día de la semana, franjas más pedidas y salas sin reservas; por ejemplo, con Norte reservada lun y mié y Sur solo mié, la primera tabla dice `Norte | 2` y `Sur   | 1`. `informes --sala Sur` hace lo mismo pero solo con las reservas de Sur. Si no hay reservas, cada vista dice «sin reservas». Por dentro son funciones pequeñas en `src/app.js`: un ayudante que dibuja la tabla, una por vista y el filtro.

Validación: dev-lead — lo que sale por pantalla lo valora una persona, no solo un test.

## Capacidades

- Nuevas: `reports` — qué dicen los informes de uso de salas: las cuatro vistas, el filtro por sala y el caso sin reservas.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`reports`), contrato público (la salida del comando la lee una persona y fija el formato) · tamaño: ~140 líneas en 2 ficheros (`src/app.js`, `test/informes.test.js`)
- Dominio (sonnet): si las cuatro definiciones (solo reservas activas, días lun…dom con ceros, franjas ordenadas) y los casos «sin reservas» no se contradicen entre sí ni con el `--sala` (señal: capacidad nueva)
- Técnica (sonnet): si cada THEN se puede comprobar con `run('informes', …)` sobre el estado en memoria, y si el formato de tabla fijado es inequívoco (señal: contrato público)
- Mínimo razonable: un solo revisor con los siete puntos — deja sin mirar a fondo la coherencia de definiciones frente a la verificación de formato, que son lo que más se contradice

1. **Capacidad nueva `reports`** (slug en inglés, contenido en castellano) — el informe es un sustantivo del dominio que no existe aún en `capabilities/`.
2. **Ocupación = número de reservas activas.** No hay aforo ni horario de apertura en los datos, así que un porcentaje no se puede calcular; las canceladas y anuladas no cuentan (`status` ≠ `active`).
3. **Orden y forma de las vistas**: salen en el orden sala, día, franjas, salas sin reservas, separadas por una línea en blanco; cada una, con su título en una línea y debajo la tabla. La salida es un único texto con líneas separadas por `\n`, sin `\n` final (el `console.log` del CLI lo añade).
4. **Formato de tabla**: primera fila con los encabezados, columnas separadas por ` | `, cada celda rellena con espacios hasta el ancho de la más larga de su columna (encabezado incluido) salvo la última; sin línea de separación y sin espacios al final. Encabezados: `Sala | Reservas`, `Día | Reservas`, `Franja | Reservas`, `Sala`.
5. **Títulos**: `Ocupación por sala`, `Ocupación por día de la semana`, `Franjas más reservadas`, `Salas sin reservas`.
6. **Ocupación por sala** lista todas las salas (Norte, Sur), también con 0, en el orden de la lista de salas (salvo el caso «sin reservas» de la decisión 11).
7. **Ocupación por día** lista los siete días en orden `lun`, `mar`, `mié`, `jue`, `vie`, `sáb`, `dom`, también con 0 (salvo el caso «sin reservas» de la decisión 11). Una reserva con un día fuera de esa lista queda fuera del alcance (hoy no hay forma de crearla).
8. **Franjas más reservadas** lista solo las franjas con alguna reserva, de más a menos reservas y, en empate, por franja en orden alfabético (que solo coincide con el cronológico con franjas bien formadas `HH:MM-HH:MM`; validarlas está en la deuda «por triar»).
9. **Salas sin reservas** lista las salas sin ninguna reserva activa, en el orden de la lista de salas; si todas tienen alguna, bajo el título va solo `ninguna`, sin encabezado (salvo el caso «sin reservas» de la decisión 11).
10. **Argumentos**: `run('informes', params)` recibe `params` como array. Solo valen `[]` y `['--sala', <nombre>]`; cualquier otra cosa (`--sala` sin nombre, `--foo`, argumentos de más, nombre vacío) devuelve `uso: informes [--sala <nombre>]`. El nombre distingue mayúsculas: `--sala sur` devuelve `sala desconocida: sur`. Los errores se devuelven como texto, no se lanzan. Nadie dijo nada de esto.
11. **«sin reservas»** — «en blanco» significa cero reservas activas tras aplicar el filtro. Entonces cada vista mantiene su título y debajo dice `sin reservas`, en lugar de la tabla de ceros. Es la lectura literal de la decisión del dev-lead y se aplica también a «Salas sin reservas»: sin ninguna reserva activa esa vista dice `sin reservas` en vez de listar todas las salas. **Pendiente de validar**: es contraintuitivo que «salas que nadie ha reservado» no liste Norte y Sur cuando nadie ha reservado nada.
12. **`--sala <nombre>` filtra las cuatro vistas** a las reservas de esa sala; «Ocupación por sala» muestra solo esa sala; «Salas sin reservas» queda reducida a `ninguna` si la sala tiene reservas, y si no tiene, las cuatro dicen `sin reservas`. **Pendiente de validar**: con filtro, «Salas sin reservas» pierde su sentido (con `--sala Norte` dice `ninguna` aunque Sur no tenga reservas); es la consecuencia literal de «filtra las cuatro».
13. **Precedencia**: `uso` > `sala desconocida` > `sin reservas` > resto de vistas. La sala se comprueba contra la lista de salas, no contra las reservas.
14. **Enfoque**: funciones puras en `src/app.js` frente a un módulo nuevo y a un agrupador genérico (ver Approach).
15. **Datos de los tests**: una reserva es `{ room, day, slot, status }` con `status: 'active'`; el arranque tiene una sola, Norte·lun·10:00-12:00 activa. Los tests siembran con `bookings.length = 0` y `push`, sin reasignar `bookings`, que se exporta desde `src/app.js` junto con `cancelBooking` (ya exportada); la lista de salas es la `rooms` que ya existe (`['Norte', 'Sur']`, comprobado en `src/app.js`). Importar `src/app.js` no ejecuta el CLI porque no hay comando en `process.argv` (los tests actuales ya lo importan así y pasan). Cada fichero de test corre en su propio proceso, así que no se contaminan.
16. **Gate**: `operations.md` fija `node --test && node scripts/lint.mjs`; el lint, leído, solo rechaza tabuladores en `src/app.js`.
17. **Reparto en tasks**: la Task 1 (ocupación por sala) trae también el registro del comando en `run`, el ayudante de tabla, el ensamblado con líneas en blanco, el parseo de argumentos y el caso «sin reservas»; el requisito «Salida completa de los informes» solo se cierra con la última task. El plan lo concreta.
18. **Repaso de coherencia hecho**: sin `MODIFIED` ni retiradas (`git grep -niE "informes?"` fuera de esta carpeta: sin resultados); el delta, probado sobre una copia de `.docs/sdd`: `sdd capability merge` añade los requisitos y las cinco reglas de `reports`, y `sdd capability check` da «Capacidades válidas: 1». `capabilities/` del repo no se ha tocado.
- Política de modelos: revisores de la spec Sonnet (dominio y técnica, más una segunda ronda en Sonnet) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

Primera ronda:
- **Aceptado** — Técnica 1 (Crítico): con `--sala Sur` la primera columna mide 4, no 5 → el THEN lleva la tabla literal `Sala | Reservas` / `Sur  | 1`.
- **Aceptado** — Técnica 2 (Crítico): ningún escenario fijaba el texto completo → nuevo requisito «Salida completa de los informes» con el texto íntegro, y la decisión 3 fija el `\n` final (no hay).
- **Aceptado** — Técnica 3: el empate pasaba sin ordenar → el escenario siembra `16:00-17:00` antes que `09:00-10:00`.
- **Aceptado** — Técnica 4 y Dominio 2: «en blanco» y la precedencia con los ceros → decisiones 6, 7, 11 y 13, y escenario de una sala con solo canceladas.
- **Aceptado** — Técnica 5 y Dominio 4: parseo de argumentos → decisión 10 y escenarios de `--foo`, argumentos de más y mayúsculas.
- **Aceptado** — Técnica 6 y 7, Dominio 8: exportaciones, forma de la reserva, semilla y lista de salas → decisión 15 y Scope.
- **Aceptado** — Técnica 8: recuentos del 🦆 y ayudante de tabla → 🦆 reescrito; el ayudante va en la Task 1 (se fija en el plan).
- **Aceptado** — Técnica 9: `ninguna` sin encabezado → decisión 9.
- **Aceptado** — Técnica 10: lint y orden alfabético → decisiones 8 y 16.
- **Aceptado** — Dominio 5: regla ante conflicto → declarada en las Reglas de la capacidad y en la decisión 13.
- **Aceptado** — Dominio 6: ejemplo del 🦆 alineado con el formato real.
- **Aceptado** — Dominio 7: la regla del día fuera de lista se retira de los requisitos y queda fuera del alcance (No entra).
- **Aceptado** — Dominio 9: Scope completo con `ninguna`, exportaciones y lint.
- **Aceptado** — Dominio 10: una reserva anulada entra en el GIVEN base.
- **Rechazado en parte** — Dominio 1 y 3 (Importante): cambiar «Salas sin reservas» a listar todas las salas cuando no hay reservas, o calcularla contra la lista completa con `--sala`, contradice la decisión literal del dev-lead («sin reservas, cada vista dice «sin reservas»»; «--sala filtra las cuatro»). Se mantiene y queda marcada como «Pendiente de validar» en las decisiones 11 y 12.

Segunda ronda (un revisor Sonnet; sin Críticos, no hay tercera):
- **Aceptado** — 1: escenario «Salas y días sin reservas aparecen con 0».
- **Aceptado** — 2: «Informes sin reservas» lleva el texto literal íntegro.
- **Aceptado** — 3 y 5: escenarios de `--sala ""`, `informes Sur`, `--sala Este Sur` y de sala desconocida con `bookings` vacío.
- **Aceptado** — 4: salvedad en la decisión 9.
- **Aceptado** — 6: reparto en tasks en la decisión 17.
- **Aceptado** — 7: «Argumentos no válidos de informes» sale como requisito aparte.
- **Aceptado** — 8: la siembra con `bookings.length = 0` y `push`, y lo comprobado de `rooms` y la importación, en la decisión 15.
- **Aceptado** — 9: el lint se cita de `operations.md` y de su lectura.
- **Rechazado en parte** — 10: `PRODUCT.md` está en la raíz del proyecto (no en `steering/`), allí se contrastó el Intent. Las decisiones 11 y 12 siguen «Pendiente de validar», y la pregunta de aprobación las nombra.

### Decisiones tomadas con el dev-lead

- Un comando `informes` con cuatro vistas: ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado — «decidido con el dev-lead: un comando informes con cuatro vistas (ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado)»
- Una opción `--sala` filtra las cuatro — «una opción --sala que filtra las cuatro»
- La salida es una tabla de texto — «la salida es una tabla de texto»
- Sin reservas, cada vista dice «sin reservas» — «sin reservas, cada vista dice «sin reservas»»
- El plan sale en 5 tasks, una por vista y otra para `--sala` — «el plan sale en 5 tasks, una por vista y otra para --sala»
- Perfil delegate — «Perfil delegate»

## Intent

Hoy solo se puede reservar, cancelar y anular; no hay manera de saber qué salas se usan, qué días ni a qué horas. Importa porque quien lleva el coworking decide con eso qué salas ofrecer. Con `informes` se ve el uso de un vistazo en la terminal. Éxito: cada una de las cuatro vistas da los números correctos para el estado de reservas del momento. Fracaso, aunque funcione: contar como ocupada una reserva cancelada o anulada.

## Scope

- Entra: el comando `informes` con sus cuatro vistas, la opción `--sala`, los textos `sin reservas`, `ninguna`, `sala desconocida: <nombre>` y `uso: informes [--sala <nombre>]`; exportar `bookings` desde `src/app.js` para que los tests siembren datos; pasar `node scripts/lint.mjs` en el cierre.
- No entra: porcentajes de ocupación, rangos de fechas, exportar a fichero o a otro formato, crear reservas desde el comando, reservas con un día fuera de `lun`…`dom`, validar el formato de franja (ya está en la deuda «por triar»).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada se retira ni cambia de forma | — | — |

- Filas que implementa: 0012 → nada: comprobado con `git grep -niE "informes?"` en todo el repo (sin resultados) | la fila no existe en `ROADMAP.md`, el id sale de `sdd id next --reserve`

## Approach

- **A. Funciones puras en `src/app.js`, una por vista y un ayudante de tabla** — coste: el fichero único crece unas 50 líneas, pero es la estructura de `architecture.md` (un solo fichero de entrada) y cada vista se prueba sola.
- **B. Módulo nuevo `src/informes.js`** — coste: rompe «un solo fichero de entrada» de `architecture.md` por 50 líneas.
- **C. Un agrupador genérico (`groupBy` por clave) con las cuatro vistas como configuración** — coste: abstracción para cuatro vistas, con la cuarta (salas sin reservas) que no es una agrupación sino una resta.
- Elegido: A — respeta la arquitectura, y las cinco tasks (una por vista y otra para `--sala`) caen en funciones separadas; el ayudante de tabla nace en la primera.

Las vistas leen `bookings` filtrando `status === 'active'`; el filtro `--sala` se aplica sobre esa lista antes de calcular cada vista. `run('informes', params)` devuelve el texto completo, como el resto de comandos.

## Dónde se prueba

- Las cuatro vistas, el filtro y los errores de argumentos: por `run('informes', …)` sobre `bookings` sembrado, como los tests actuales de `run` (`test/app.test.js`, `test/cancel.test.js`), en `test/informes.test.js`, con `assert.equal` sobre el texto literal.
- Sin reservas: vaciando `bookings` o cancelando la reserva de arranque con `cancelBooking('Norte', 'lun')`, en el mismo fichero.
- Gate: `node --test && node scripts/lint.mjs`.
- Salida por terminal: una ejecución real de `node src/app.js informes` en la validación.

## Términos y ADR

- Términos resueltos: ocupación — número de reservas activas (no un porcentaje) | franja — el texto `HH:MM-HH:MM` de la reserva
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `reports`

Estado base de los escenarios, salvo que se diga otro: reservas activas Norte·lun·10:00-12:00, Norte·mié·10:00-12:00 y Sur·mié·16:00-17:00; una cancelada Norte·vie·10:00-12:00 y una anulada Sur·jue·09:00-10:00.

#### ADDED — Ocupación por sala

- GIVEN el estado base
- WHEN `informes`
- THEN la vista `Ocupación por sala` es la tabla `Sala  | Reservas` con las filas `Norte | 2` y `Sur   | 1` (la cancelada y la anulada no cuentan)

#### ADDED — Salas y días sin reservas aparecen con 0

- GIVEN solo la reserva activa Norte·lun·10:00-12:00
- WHEN `informes`
- THEN `Ocupación por sala` tiene `Norte | 1` y `Sur   | 0`, y `Ocupación por día de la semana` tiene `lun | 1` y los otros seis días a 0

#### ADDED — Ocupación por día de la semana

- GIVEN el estado base
- WHEN `informes`
- THEN la vista `Ocupación por día de la semana` tiene siete filas en orden lun a dom: `lun | 1`, `mar | 0`, `mié | 2`, `jue | 0`, `vie | 0`, `sáb | 0`, `dom | 0` (la cancelada del viernes y la anulada del jueves no cuentan)

#### ADDED — Franjas más reservadas

- GIVEN el estado base
- WHEN `informes`
- THEN la vista `Franjas más reservadas` tiene dos filas: `10:00-12:00 | 2` y `16:00-17:00 | 1`
- AND con solo dos reservas activas, sembradas en este orden, Norte·lun·16:00-17:00 y Sur·mar·09:00-10:00 (empate a 1), sale primero `09:00-10:00`

#### ADDED — Salas sin reservas

- GIVEN solo la reserva activa Norte·lun·10:00-12:00
- WHEN `informes`
- THEN la vista `Salas sin reservas` es el título y, debajo, `Sala` y `Sur`
- AND con el estado base, bajo el título va solo `ninguna`

#### ADDED — Filtrar los informes por sala

- GIVEN el estado base
- WHEN `informes --sala Sur`
- THEN `Ocupación por sala` es `Sala | Reservas` y `Sur  | 1`, `Ocupación por día de la semana` tiene `mié | 1` y los demás días a 0, `Franjas más reservadas` tiene solo `16:00-17:00 | 1` y `Salas sin reservas` dice `ninguna`
- AND con `informes --sala Sur` y Sur con solo reservas canceladas, las cuatro vistas dicen `sin reservas`

#### ADDED — Argumentos no válidos de informes

- GIVEN el estado base
- WHEN `informes --sala Este` o `informes --sala sur`
- THEN el comando responde `sala desconocida: Este` o `sala desconocida: sur`, sin vistas
- AND con `informes --sala`, `--sala ""`, `Sur`, `--foo`, `--sala Sur Norte` o `--sala Este Sur` responde `uso: informes [--sala <nombre>]` (el uso gana a la sala desconocida)
- AND con ninguna reserva activa, `informes --sala Este` responde `sala desconocida: Este` y no `sin reservas`

#### ADDED — Informes sin reservas

- GIVEN ninguna reserva activa
- WHEN `informes`
- THEN la respuesta es exactamente el texto `Ocupación por sala\nsin reservas\n\nOcupación por día de la semana\nsin reservas\n\nFranjas más reservadas\nsin reservas\n\nSalas sin reservas\nsin reservas`, sin salto de línea al final

#### ADDED — Salida completa de los informes

- GIVEN el estado base
- WHEN `informes`
- THEN la respuesta es exactamente el texto `Ocupación por sala\nSala  | Reservas\nNorte | 2\nSur   | 1\n\nOcupación por día de la semana\nDía | Reservas\nlun | 1\nmar | 0\nmié | 2\njue | 0\nvie | 0\nsáb | 0\ndom | 0\n\nFranjas más reservadas\nFranja      | Reservas\n10:00-12:00 | 2\n16:00-17:00 | 1\n\nSalas sin reservas\nninguna`, donde `\n` es un salto de línea, y sin salto de línea al final

#### Reglas de la capacidad — reports

- **Dónde viven los datos**: en memoria, en la lista de reservas de `src/app.js` (según `operations.md`, sin base de datos)
- **Idioma de los nombres**: castellano (comando `informes`, opción `--sala`, títulos y mensajes)
- **Límites**: no aplica
- **Avisos**: `sin reservas`; `ninguna`; `sala desconocida: <nombre>`; `uso: informes [--sala <nombre>]`
- **Regla ante conflicto**: `uso` gana a `sala desconocida`, y esta a `sin reservas`, que a su vez sustituye a las tablas de ceros

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
