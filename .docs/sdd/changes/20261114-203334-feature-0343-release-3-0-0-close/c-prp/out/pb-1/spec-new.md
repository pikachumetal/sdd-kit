---
id: 20261115-192038-feature-0012-informes
feature: 0012
title: Informes de uso de las salas
mode: full
status: draft
created: 2026-11-15
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Informes de uso de las salas

🦆 Hoy no hay forma de ver cómo se usan las salas. El comando nuevo de informes saca cuatro cuadros de texto: reservas por sala, reservas por día de la semana, las tres franjas más reservadas y las salas que nadie ha reservado; con Norte con 2 reservas el lunes y Sur con 1 el martes, Norte sale con 2, Sur con 1, y el lunes con 2. Con la opción de sala, los cuatro cuadros miran solo esa sala. Solo cuentan las reservas vigentes: las cancelaciones y las anulaciones no. Si no hay ninguna reserva vigente, cada cuadro dice «sin reservas» y nada más.

Validación: dev-lead (el dueño del producto, que según `PRODUCT.md` es quien lo desarrolla y lo usa) — lo que sale por pantalla lo lee una persona y el formato de los cuadros es decisión suya.

## Capacidades

- Nuevas: `reports` — informes de uso de las salas: ocupación por sala, por día y por franja, salas sin reservas y filtro por sala.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`reports`), contrato público (el texto que imprime `informes` lo lee una persona y puede acabar en un script) · tamaño: ~150 líneas en 2 ficheros (`src/app.js`, `test/informes.test.js`)
- Dominio (sonnet): si «sin reservas», «todas las salas tienen reservas» y el orden de cada cuadro dan el resultado esperado con datos concretos, y si el criterio «solo reservas vigentes» deja algún caso sin cubrir (señal: capacidad nueva)
- Técnica (sonnet): si `informes(rooms, bookings, sala)` como función pura encaja en `src/app.js` y en `run`, y si el formato de la tabla es determinista (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si las reglas de conteo (qué reserva cuenta, empates) coinciden con lo que el dev-lead entiende por ocupación

### Hallazgos de la review

- **Aceptado** — Crítico (dominio): el anti-objetivo del Intent y la decisión 9 chocaban con «sin reservas» (decisión 10) → se mantiene la frase del dev-lead («cada vista dice «sin reservas»») y se corrigen el Intent y la decisión 9: una sala sin reservas sale con 0 y en «Salas sin reservas» solo cuando hay alguna reserva vigente en el ámbito; sin ninguna, los cuatro cuadros dicen solo «sin reservas». **Es lo primero que debes validar: decisión 10.**
- **Aceptado** — Crítico (dominio): el escenario «Sin reservas» no traía las líneas `sin reservas` ni los blancos → el escenario da ahora la salida completa; se añade el de `--sala Este` con texto literal.
- **Aceptado** — Crítico (técnica): ningún escenario fijaba el texto completo → decisión 4 fija `\n` entre líneas, `\n\n` entre bloques y sin salto final; hay un escenario con la salida completa.
- **Aceptado** — Crítico (técnica): 5 tasks «una por vista» no quedan en verde por separado → Approach y «Dónde se prueba»: `informes` emite solo los bloques ya hechos y los tests comprueban cada bloque; la task 1 trae el esqueleto con la vista de salas, las tasks 2 a 4 añaden un bloque y la 5 el filtro, con la salida completa y los dos de punta a punta en la última.
- **Aceptado** — Importante (técnica): `voided` sin escenario → el ejemplo base lleva Sur mie anulada.
- **Aceptado** — Importante (técnica): cabeceras de la decisión 5 con espaciado distinto del de los escenarios → decisión 5 reescrita sin relleno; el espaciado sale de la 4.
- **Aceptado** — Importante (técnica): contratos sin declarar → nueva decisión 17 y sección «Contratos que toca».
- **Aceptado** — Importante (técnica): tests de punta a punta sin salida esperada → escenario «Datos del módulo» con los textos literales.
- **Aceptado** — Importante/Menor (técnica y dominio): error de `--sala` sin canal ni mayúsculas, día fuera de lista sin escenario, estados desconocidos y salas no listadas → decisiones 12, 7 y 18, y escenarios nuevos (`--sala norte`, día `xyz`).
- **Aceptado** — Menor (dominio): el ejemplo base no distinguía «orden de la lista» de «orden por conteo» → escenario nuevo «Orden de la lista», con la lista Este, Norte, Sur, donde el orden de la lista y el del conteo difieren.
- **Aceptado** — Menor (dominio): slug `reports` sin apoyo → decisión 14 cita la regla 1 de las capacidades.
- **Aceptado** — Menor (dominio): el texto «todas las salas tienen reservas» es mío → ya estaba en la decisión 11; queda marcado para que lo valides.

Segunda ronda (un revisor sonnet, sin Críticos; no hay tercera):
- **Aceptado** — Importante: escenario de días que pasaba con un orden alfabético → ahora jue/mie/lun/mar con orden de semana distinto del alfabético y del conteo.
- **Aceptado** — Importante: GIVEN sin lista de salas (días, franjas, salas sin reservas) → nombran las salas.
- **Aceptado** — Importante: «todas las salas tienen reservas» sin cabecera → decisión 11 y escenario fijan título más esa línea.
- **Aceptado** — Importante: decisiones 12 y 18 sin escenario → requisito nuevo «Entradas anómalas».
- **Aceptado** — Importante: valores de `status` → decisión 1 y GIVEN base con `cancelled` y `voided`.
- **Aceptado** — Importante: forma de los datos del módulo → comprobada en `src/app.js` (`{ room, day, slot, status }`, textos, `active`); decisión 17.
- **Aceptado** — Menor: líneas vacías, cifra de tamaño, `--sala` repetido, validador y términos heredados → corregidos.

1. **Qué cuenta como reserva**: solo las de estado `active` (los otros valores del módulo son `cancelled` y `voided`); las canceladas, las anuladas y cualquier otro estado no cuentan en ningún cuadro — son las que el propio dato marca como ya no vigentes.
2. **«Ocupación» = número de reservas**, no porcentaje: el producto no tiene horario de apertura ni franjas posibles por día, así que no hay base para un porcentaje.
3. **Nombre del comando**: `informes` (`node src/app.js informes [--sala <nombre>]`), en castellano como el resto (`libres`, `cancelar`).
4. **Forma de la salida**: cuatro bloques en este orden —Ocupación por sala, Ocupación por día de la semana, Franjas más reservadas, Salas sin reservas—. Cada bloque: una línea de título, una línea de cabecera y una fila por elemento; las columnas van alineadas, rellenadas con espacios hasta el ancho de la celda más larga y separadas por dos espacios (la última no se rellena). Las líneas se unen con `\n`, los bloques con `\n\n`, sin salto de línea final: `informes` devuelve ese texto y el programa lo imprime con `console.log`.
5. **Cabeceras** (celdas, sin relleno): `Sala` y `Reservas`; `Día` y `Reservas`; `Franja` y `Reservas`; `Sala`. Los títulos son los de la decisión 4, sin adornos.
6. **Ocupación por sala**: una fila por sala, en el orden de la lista de salas (no por número de reservas), con 0 si no tiene reservas. En el ejemplo base el orden de la lista y el del conteo coinciden; el escenario «Orden de la lista» añade un caso donde difieren.
7. **Ocupación por día**: solo los días con alguna reserva, en orden de semana `lun mar mie jue vie sab dom` (los valores del dato, sin tilde, como los de hoy `lun`, `mar`); un día fuera de esa lista va al final por orden alfabético.
8. **Franjas más reservadas**: las 3 primeras por número de reservas, descendente; los empates, por franja en orden ascendente (de texto). Se suman las reservas de todos los días y salas del ámbito; dos franjas son la misma si el texto es idéntico. El tope de 3 es mío.
9. **Salas sin reservas** = salas con 0 reservas vigentes, una por fila, en el orden de la lista de salas, cuando hay alguna reserva vigente en el ámbito. «Nadie ha reservado» lo leo como «sin ninguna reserva vigente», no «sin ninguna reserva en la historia»: una sala cuya única reserva se canceló aparece si otra sala tiene reservas.
10. **«sin reservas»**: cuando no hay ninguna reserva vigente en el ámbito (todas las salas, o la sala filtrada), cada uno de los cuatro bloques lleva su título y debajo solo la línea `sin reservas`, sin cabecera ni filas. Es lo que dijo el dev-lead («cada vista dice «sin reservas»»), aplicado a los cuatro; su coste es que, sin ninguna reserva, ni «Ocupación por sala» ni «Salas sin reservas» listan las salas con 0.
11. **«todas las salas tienen reservas»** es el texto del bloque Salas sin reservas cuando hay reservas vigentes pero ninguna sala del ámbito está sin ellas: el título y debajo solo esa línea, sin cabecera — nadie lo dijo.
12. **`--sala <nombre>`**: el nombre se compara tal cual, con mayúsculas (`Norte`, no `norte`); el filtro limita las cuatro vistas a las reservas de esa sala, y los bloques por sala y de salas sin reservas a esa sola sala. Una sala que no está en la lista responde `sala desconocida: <nombre>`; `--sala` sin nombre, o seguido de otra opción (empieza por `--`), responde `falta el nombre de la sala`; en ambos la salida es solo ese texto, por la salida estándar y con código de salida 0, como los avisos actuales de `cancelar`. Los demás parámetros se ignoran; si `--sala` aparece más de una vez, vale la primera. Los textos y estas reglas son míos.
13. **Enfoque**: A, frente a B y C (ver Approach).
14. **Capacidad nueva `reports`** — la crea esta spec; el slug va en inglés y kebab-case porque lo pide la regla 1 de la plantilla de capacidades; no toca `libres`, `reservar` ni `cancelar`.
15. **No hay cambio de datos**: las reservas siguen en memoria, el informe solo las lee.
16. **Delta probado sobre una copia** de `.docs/sdd` con `sdd capability merge`: añade 9 requisitos a `reports.md` y no rechaza nada. Los ejemplos de salida van como líneas `AND` porque la fusión solo admite líneas con viñeta.
17. **Contratos que toca**: `src/app.js` pasa a exportar también `informes`; `informes(rooms, bookings, sala)` recibe `rooms` (lista de nombres), `bookings` (lista de `{ room, day, slot, status }`, todos textos —`slot` como `10:00-12:00`, `status` como `active`, `cancelled` o `voided`—; es la forma que `src/app.js` ya usa hoy; `rooms` y `bookings` son identificadores heredados del código, no texto de interfaz) y `sala` (nombre o `undefined`) y devuelve un texto; `run('informes', params)` devuelve ese texto igual que los demás comandos; no se cambia el `run` de los otros comandos.
18. **Entradas anómalas**: una reserva de una sala que no está en la lista no cuenta en ningún bloque; un estado distinto de `active` no es vigente (decisión 1).
- Política de modelos: revisores de la spec: dominio sonnet y técnica sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Un comando `informes` con cuatro vistas — «un comando informes con cuatro vistas (ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado)»
- Una opción `--sala` que filtra las cuatro — «una opción --sala que filtra las cuatro»
- La salida es una tabla de texto — «la salida es una tabla de texto»
- Sin reservas, cada vista dice «sin reservas» — «sin reservas, cada vista dice «sin reservas»»
- El plan sale en 5 tasks, una por vista y otra para `--sala` — «el plan sale en 5 tasks, una por vista y otra para --sala»
- Perfil delegate — «Perfil delegate»

## Intent

Hoy quien usa el producto ve las reservas una a una y no sabe qué salas, días o franjas se usan más ni qué sala no se usa. El éxito: con un solo comando ve esas cuatro cosas, y con `--sala` las ve de una sala concreta. Anti-objetivos: que el informe cuente reservas canceladas o anuladas como uso, y que, habiendo reservas, una sala sin ellas desaparezca de los cuadros en lugar de salir con 0.

## Scope

- Entra: el comando `informes` con las cuatro vistas; la opción `--sala <nombre>`; los textos «sin reservas», «todas las salas tienen reservas», «sala desconocida: <nombre>» y «falta el nombre de la sala»; exportar `informes` desde `src/app.js`.
- No entra: porcentajes de ocupación, rango de fechas, salida en CSV o JSON, color, persistencia de reservas, cambios en `libres`, `reservar`, `cancelar` y `anular`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `git grep -niE "informe|report"` (sin resultados fuera de esta spec); el roadmap no tiene fila para esta feature, la id 0012 se reservó con `sdd id next`.

## Approach

- A — una función pura `informes(rooms, bookings, sala)` exportada desde `src/app.js` que devuelve el texto; `run('informes', params)` la llama con las salas y las reservas reales — una función pequeña por vista más una de formato de tabla; se prueba con datos de ejemplo sin tocar el estado del módulo.
- B — calcular dentro de `run` con las constantes del módulo — la única reserva de ejemplo del módulo impide probar días, franjas o salas sin reservas con datos distintos.
- C — un módulo nuevo `src/informes.js` — separa el código, pero el proyecto tiene un solo fichero de entrada (`architecture.md`) y para ~150 líneas no compensa.
- Elegido: A — es la costura más alta que permite probar cada bloque con datos concretos; no cambia la estructura del proyecto.

Las partes del cómo que fija A: el ámbito se calcula una vez (reservas vigentes de las salas del filtro) y las vistas lo reciben; la función de tabla es una sola y compartida. Para que cada task quede en verde por separado, `informes` emite solo los bloques ya implementados, siempre en el orden de la decisión 4: la task 1 trae el esqueleto (tabla, ámbito, `informes`, cableado en `run`, «sin reservas») con el bloque de salas; las tasks 2 a 4 añaden un bloque cada una (días, franjas, salas sin reservas); la 5 añade `--sala`. Hasta la task 4 los tests comprueban el bloque de su vista (el texto partido por `\n\n`); la comparación de la salida completa y los dos tests de punta a punta entran en la task 5.

## Dónde se prueba

- Cada bloque, `--sala` y los textos de error: por `informes(rooms, bookings, sala)` con datos de ejemplo, en `test/informes.test.js`, como los tests actuales de `run` (`node:test`, comparación exacta del texto).
- El comando de punta a punta: `run('informes', [])` y `run('informes', ['--sala', 'Sur'])` sobre los datos reales del módulo (escenario «Datos del módulo»), un test cada uno.

## Términos y ADR

- Términos resueltos: ocupación — número de reservas vigentes (no porcentaje).
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `reports`

#### ADDED — Ocupación por sala

- GIVEN lista de salas Norte, Sur, Este; reservas Norte lun 10:00-12:00 vigente, Norte lun 14:00-16:00 vigente, Sur mar 10:00-12:00 vigente, Norte mie 10:00-12:00 con estado `cancelled` y Sur mie 10:00-12:00 con estado `voided`
- WHEN se pide el informe
- THEN el bloque sale en estas líneas, con la cancelada y la anulada sin contar y Este con 0: `Ocupación por sala`
- AND `Sala   Reservas`
- AND `Norte  2`
- AND `Sur    1`
- AND `Este   0`

#### ADDED — Orden de la lista

- GIVEN lista de salas Este, Norte, Sur; Norte con 2 reservas vigentes, Sur con 1 y Este con 0
- WHEN se pide el informe
- THEN las filas del bloque «Ocupación por sala» salen en el orden de la lista: `Este   0`, `Norte  2`, `Sur    1`.

#### ADDED — Ocupación por día de la semana

- GIVEN las mismas salas y reservas que en «Ocupación por sala»
- WHEN se pide el informe
- THEN el bloque sale en estas líneas, solo con los días con reservas vigentes: `Ocupación por día de la semana`
- AND `Día  Reservas`
- AND `lun  2`
- AND `mar  1`
- GIVEN salas Norte y Sur; reservas vigentes: Norte jue, Norte mie, Sur lun, Sur lun y Sur mar
- WHEN se pide el informe
- THEN los días salen en el orden de semana, no alfabético ni por número de reservas: `lun  2`, `mar  1`, `mie  1`, `jue  1`.
- GIVEN salas Norte y Sur; reservas vigentes de Norte en los días xyz, abc y lun
- WHEN se pide el informe
- THEN los días salen en el orden lun, abc, xyz.

#### ADDED — Franjas más reservadas

- GIVEN las mismas salas y reservas que en «Ocupación por sala»
- WHEN se pide el informe
- THEN el bloque sale en estas líneas, 10:00-12:00 primero por tener 2 reservas vigentes (Norte lun y Sur mar): `Franjas más reservadas`
- AND `Franja       Reservas`
- AND `10:00-12:00  2`
- AND `14:00-16:00  1`
- GIVEN salas Norte y Sur; reservas vigentes de Norte o de Sur: 10:00-12:00 ×3, 14:00-16:00 ×2, 08:00-10:00 ×1 y 16:00-18:00 ×1
- WHEN se pide el informe
- THEN salen solo 3 filas: 10:00-12:00 con 3, 14:00-16:00 con 2 y 08:00-10:00 con 1 (empata con 16:00-18:00 y gana la franja menor).

#### ADDED — Salas sin reservas

- GIVEN las mismas salas y reservas que en «Ocupación por sala»
- WHEN se pide el informe
- THEN el bloque sale en estas líneas: `Salas sin reservas`
- AND `Sala`
- AND `Este`
- GIVEN salas Norte y Sur, con Sur con una sola reserva, cancelada, y Norte con una vigente
- WHEN se pide el informe
- THEN el bloque lista Sur.
- GIVEN salas Norte y Sur, cada una con una reserva vigente
- WHEN se pide el informe
- THEN el bloque son dos líneas, sin cabecera: `Salas sin reservas` y `todas las salas tienen reservas`.

#### ADDED — Filtro por sala

- GIVEN las mismas salas y reservas que en «Ocupación por sala»
- WHEN se pide `informes --sala Norte`
- THEN el bloque por sala tiene solo la fila `Norte  2`, el de días solo `lun  2`, el de franjas `10:00-12:00  1` y `14:00-16:00  1`, y el de salas sin reservas dice `todas las salas tienen reservas`.
- GIVEN las mismas salas y reservas
- WHEN se pide `informes --sala Este`
- THEN la salida son cuatro bloques con una línea vacía entre ellos (`\n\n`), sin salto final: `Ocupación por sala`
- AND `sin reservas`
- AND `Ocupación por día de la semana`
- AND `sin reservas`
- AND `Franjas más reservadas`
- AND `sin reservas`
- AND `Salas sin reservas`
- AND `sin reservas`
- GIVEN las mismas salas y reservas
- WHEN se pide `informes --sala Oeste`
- THEN la salida es solo `sala desconocida: Oeste`.
- GIVEN las mismas salas y reservas
- WHEN se pide `informes --sala norte`
- THEN la salida es solo `sala desconocida: norte`.
- GIVEN las mismas salas y reservas
- WHEN se pide `informes --sala` sin nombre
- THEN la salida es solo `falta el nombre de la sala`.

#### ADDED — Entradas anómalas

- GIVEN salas Norte y Sur; reservas: Norte lun 10:00-12:00 vigente, Oeste lun 10:00-12:00 vigente (sala no listada) y Sur mar 10:00-12:00 con estado `xyz`
- WHEN se pide el informe
- THEN solo cuenta la de Norte: `Norte  1`, `Sur    0` en el bloque por sala, y `lun  1` en el de días.
- GIVEN las mismas salas y reservas que en «Ocupación por sala»
- WHEN se pide `informes --sala --x`
- THEN la salida es solo `falta el nombre de la sala`.
- GIVEN las mismas salas y reservas que en «Ocupación por sala»
- WHEN se pide `informes --sala Norte --verbose`
- THEN la salida es la misma que con `informes --sala Norte`.
- GIVEN las mismas salas y reservas que en «Ocupación por sala»
- WHEN se pide `informes --sala Norte --sala Sur`
- THEN vale la primera: la salida es la de `informes --sala Norte`.

#### ADDED — Sin reservas

- GIVEN salas Norte y Sur, y ninguna reserva vigente (la única reserva, Norte lun 10:00-12:00, está cancelada)
- WHEN se pide el informe
- THEN la salida son cuatro bloques separados por una línea vacía (`\n\n`), cada uno con su título y debajo solo `sin reservas`: `Ocupación por sala`
- AND `sin reservas`
- AND `Ocupación por día de la semana`
- AND `sin reservas`
- AND `Franjas más reservadas`
- AND `sin reservas`
- AND `Salas sin reservas`
- AND `sin reservas`

#### ADDED — Datos del módulo

- GIVEN los datos reales del módulo: salas Norte y Sur, y una sola reserva vigente, Norte lun 10:00-12:00
- WHEN se ejecuta `informes`
- THEN la salida son los cuatro bloques en su orden, separados por una línea vacía (`\n\n`) y sin salto final: `Ocupación por sala`
- AND `Sala   Reservas`
- AND `Norte  1`
- AND `Sur    0`
- AND `Ocupación por día de la semana`
- AND `Día  Reservas`
- AND `lun  1`
- AND `Franjas más reservadas`
- AND `Franja       Reservas`
- AND `10:00-12:00  1`
- AND `Salas sin reservas`
- AND `Sala`
- AND `Sur`
- GIVEN los datos reales del módulo
- WHEN se ejecuta `informes --sala Sur`
- THEN los cuatro bloques dicen `sin reservas` bajo su título.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
