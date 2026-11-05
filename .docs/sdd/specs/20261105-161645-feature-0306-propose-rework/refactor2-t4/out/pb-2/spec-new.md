---
id: 20261105-175140-feature-0012-informes
feature: 0012
title: Comando informes con cuatro vistas de ocupación
mode: full
profile: delegate
status: draft
created: 2026-11-05
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Comando informes con cuatro vistas de ocupación

🦆 Hoy no puedes saber cómo se usan las salas sin contar reservas a mano. Con `informes` verás de una vez cuatro tablas: reservas por sala, por día de la semana, las franjas más pedidas y las salas que nadie ha reservado; por ejemplo, `informes --sala Norte` enseña esas cuatro vistas solo con las reservas de Norte. Por dentro, una función pura calcula las vistas a partir de la lista de reservas y `run` la llama con los datos en memoria.

Validación: dev-lead — es una salida de texto que lee una persona; el formato de las tablas hay que verlo.

## Capacidades

- Nuevas: `reporting` — el comando `informes`: las cuatro vistas, el filtro `--sala` y el caso sin reservas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`reporting`) · tamaño: ~170 líneas en 3 ficheros (código ~70, tests ~100)
- Dominio (sonnet): si los THEN de las cuatro vistas y del filtro dan la misma respuesta para el mismo dato, sobre todo `sin reservas` frente a `ninguna` en la vista de salas sin reservar (señal: capacidad nueva)
- Técnica (sonnet): si la función pura sobre `reservas` y `salas` alcanza para probar cada vista sin tocar el estado global que usan `cancelar` y `anular` (señal: capacidad nueva)
- Mínimo razonable: solo técnica — deja sin mirar si los escenarios dicen lo mismo entre sí, que es donde se rompe una tabla de cuatro vistas

1. Capacidad nueva `reporting` (slug en inglés, contenido en castellano) — el delta necesita un sitio y `capabilities/` está vacío.
2. El comando se llama `informes` y el filtro `--sala <nombre>` — nadie dio los nombres; siguen el estilo de `libres`, `cancelar` y `--cada-semana`.
3. Solo cuentan las reservas con `status === 'active'`; las canceladas (`cancelled`) y las anuladas (`voided`) no cuentan en ninguna vista — es lo que ya hace `libres`.
4. «Ocupación» es el número de reservas, no un porcentaje — el código no guarda cuántas horas tiene una sala ni un horario de apertura.
5. Tabla de texto: título de la vista, fila de cabeceras, una fila por dato, columnas alineadas con espacios y separadas por ` | `, sin espacios al final de línea; las cuatro vistas, una tras otra, con una línea en blanco entre ellas. Sin tabuladores, porque `scripts/lint.mjs` los rechaza. Ejemplo literal de una vista:
   ```
   Ocupación por sala
   sala  | reservas
   Norte | 2
   Sur   | 0
   ```
   Cabeceras: `sala | reservas`, `día | reservas`, `franja | reservas`; la vista de salas sin reservar lleva el título y debajo una sala por línea, o `ninguna`. Los THEN de abajo escriben las filas sin alinear (`Norte | 2`): los tests comparan las celdas, no los espacios de relleno.
6. Orden de cada vista: por sala, el de la lista de salas (Norte, Sur), con las salas a 0; por día, de `lun` a `dom` (`lun mar mie jue vie sab dom`, sin tildes como los `lun` y `mar` de hoy), los siete días, también a 0; franjas, de más a menos reservas y, a igualdad, por franja ascendente, solo las que tienen alguna reserva y sin tope. Todo esto rige salvo que no haya ninguna reserva activa (decisión 8). Una franja es el texto exacto (`10:00-12:00`): no se fusionan franjas que se solapan.
7. «Salas que nadie ha reservado» lista las salas con 0 reservas activas; si todas tienen alguna, dice `ninguna`.
8. `sin reservas` sale en las cuatro vistas, en lugar de la tabla, cuando no queda ninguna reserva activa en lo que se está mirando (todo, o la sala de `--sala`). Eso incluye la vista de salas sin reservar, que no lista entonces las salas: así las cuatro vistas dicen lo mismo con los mismos datos. Es lo que el dev-lead pidió («cada vista dice «sin reservas»») llevado hasta esa vista.
9. `--sala` compara el nombre exacto, con mayúsculas como en `cancelar`. Con una sala que no existe responde `sala desconocida: <nombre>` y nada más; sin nombre detrás (o si lo que sigue empieza por `--`), `falta el nombre de la sala` y nada más. Los dos avisos salen por la salida normal, como los demás comandos, y el programa no cambia su código de salida. Cualquier otro parámetro sobrante se ignora.
10. `--sala` filtra las cuatro vistas, también la de salas sin reservar, y con ella las vistas por sala y por día solo cuentan lo de esa sala (por sala, solo su fila; por día, siguen los siete días): con `--sala Sur` y Sur sin reservas activas, las cuatro dicen `sin reservas`; con `--sala Norte` y Norte con reservas, la de salas sin reservar dice `ninguna`.
11. Cada reserva guardada cuenta una vez: `reservar --cada-semana` hoy no guarda nada, así que las reservas semanales no entran en los informes. Una reserva con un día que no es uno de los siete se cuenta en sala y en franja y no sale en la vista por día.
12. Enfoque: función pura `informes(reservas, salas, sala)` exportada desde `src/app.js` (sigue siendo un solo fichero); `sala` ausente (`undefined`) es «sin filtro» y la función devuelve `sala desconocida: <nombre>` si no existe. `run('informes', params)` extrae el valor que sigue a `--sala`, devuelve `falta el nombre de la sala` si falta, y llama a la función con los datos en memoria. Es la costura de `run` que ya usan los tests, y con ella cada vista se prueba con datos propios.
13. Repaso de coherencia: el delta probado en una copia de `.docs/sdd` con `sdd capability merge` fusiona sin rechazos (`reporting.md`: siete requisitos y cinco reglas añadidos); antes de implementar, `git grep informes` fuera de las specs no daba resultados.
- Política de modelos: revisores de la spec en sonnet (dominio y técnica, sin roles ni reglas de flujo) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto (las tasks van una tras otra) · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — Dominio 1: faltan las reglas de la capacidad → sección «Reglas de la capacidad — reporting» en el delta
- **Aceptado** — Dominio 2: 6 y 7 chocan con 8 → 6 dice «salvo que no haya ninguna reserva activa (decisión 8)»; el escenario «Sin reservas» fija que la vista de salas sin reservar dice `sin reservas`
- **Aceptado** — Dominio 3: pregunta abierta en la decisión 8 → cerrada y justificada con la frase del dev-lead
- **Aceptado** — Dominio 4: casos de conflicto de `--sala` y dónde salen los avisos → decisión 9 y escenario «Filtro por sala»
- **Aceptado** — Dominio 5: reservas semanales → decisión 11
- **Aceptado** — Dominio 6: qué es una franja → decisión 6
- **Aceptado** — Dominio 7 y Técnica 1: formato literal → decisión 5 con ejemplo
- **Aceptado** — Dominio 8: `--sala` quita las demás filas → decisión 10
- **Aceptado** — Dominio 9: estructura interna en el Approach → quitada; el Approach solo fija el contrato
- **Rechazado** — Dominio 10: «con `--sala Norte` y reservas solo en Sur» → es el caso de Norte sin reservas activas, que ya cubre `--sala Sur` sin reservas en el escenario del filtro
- **Aceptado** — Técnica 2: espacios al final → decisión 5 («sin espacios al final de línea»); `lint.mjs` solo mira tabuladores
- **Aceptado** — Técnica 3: estado global → «Dónde se prueba»: el test de `run` va en su propio fichero, que `node --test` ejecuta en un proceso aparte, con el estado inicial
- **Aceptado** — Técnica 4 y 5: contrato de `--sala` → decisiones 9 y 12
- **Aceptado** — Técnica 6: criterio de `git grep` → decisión 13
- **Aceptado** — Técnica 7, 8 y 9: GIVEN con datos completos, un escenario por caso y `voided` → escenarios reescritos
- **Aceptado** — Técnica 10: días con `--sala` y día no reconocido → decisiones 10 y 11 y THEN del filtro

### Decisiones tomadas con el dev-lead

- Un comando `informes` con cuatro vistas: ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado — «un comando informes con cuatro vistas»
- Una opción `--sala` que filtra las cuatro — «una opción --sala que filtra las cuatro»
- La salida es una tabla de texto — «la salida es una tabla de texto»
- Sin reservas, cada vista dice «sin reservas» — «sin reservas, cada vista dice «sin reservas»»
- El plan sale en 5 tasks, una por vista y otra para `--sala` — «el plan sale en 5 tasks, una por vista y otra para --sala»
- Perfil `delegate` — «Perfil delegate»

## Intent

Hoy el comando `salas` no cuenta nada, y para saber qué sala se usa menos o qué franja se pide más hay que repasar las reservas a ojo. Con `informes` se ve de un vistazo la ocupación en cuatro cortes. Es éxito si cada vista da el mismo número que un recuento a mano de las reservas activas, y si con una sala filtrada ninguna vista cuenta reservas de otra. Fracasaría, aunque funcionara, una tabla que cuente canceladas o que diga una cosa en una vista y otra en otra con las mismas reservas.

## Scope

- Entra: el comando `informes` con las cuatro vistas, `--sala`, el literal `sin reservas` y los dos avisos de `--sala`; la función pura exportada.
- No entra: porcentajes, rangos de fechas, salida en CSV o JSON, ordenar o limitar con opciones, reservas semanales recurrentes, y cambios en `libres`, `cancelar`, `anular` o `reservar`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `git grep -n informes` en todo el repo, fuera de esta spec (sin resultados) y sin fila en el roadmap; el id 0012 sale del contador.

## Approach

Función pura `informes(reservas, salas, sala)` en `src/app.js`, exportada; `run('informes', params)` extrae el valor que sigue a `--sala` y la llama con las reservas y salas en memoria. La estructura interna (funciones auxiliares, ayudas de formato) la decide el plan.

## Dónde se prueba

- Cada vista y `--sala` (también `sala desconocida`): llamando a `informes` con reservas de prueba, como los tests actuales llaman a `run`; así hay datos para franjas, días y salas. En un fichero nuevo, `test/informes.test.js`.
- `falta el nombre de la sala` y el comando entero: por `run('informes', …)` en ese mismo fichero. `node --test` ejecuta cada fichero en su proceso, así que `run` ve el estado inicial (una reserva activa, Norte lun 10:00-12:00) y el resultado no depende de `cancelar` ni `anular` de otros ficheros.
- El aspecto de la tabla: lo ve el dev-lead en la validación, ejecutando `node src/app.js informes`.

## Términos y ADR

- Términos resueltos: reserva activa — la de `status === 'active'`, la única que cuenta en los informes.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `reporting`

#### ADDED — Ocupación por sala

- GIVEN salas Norte y Sur, y reservas activas Norte lun 10:00-12:00 y Norte mar 10:00-12:00
- WHEN se ejecuta `informes`
- THEN la vista «Ocupación por sala» tiene una fila `Norte | 2` y otra `Sur | 0`, en ese orden

#### ADDED — Ocupación por día de la semana

- GIVEN salas Norte y Sur, y reservas activas Norte lun 10:00-12:00, Norte mar 10:00-12:00 y Sur lun 14:00-16:00
- WHEN se ejecuta `informes`
- THEN la vista «Ocupación por día de la semana» tiene siete filas, de `lun` a `dom`: `lun | 2`, `mar | 1` y el resto a `0`

#### ADDED — Franjas más reservadas

- GIVEN reservas activas Norte lun 10:00-12:00, Sur lun 10:00-12:00, Norte mar 14:00-16:00 y Sur mar 09:00-10:00, y una reserva cancelada Sur mie 14:00-16:00 y otra anulada Norte jue 14:00-16:00
- WHEN se ejecuta `informes`
- THEN la vista «Franjas más reservadas» lista `10:00-12:00 | 2`, `09:00-10:00 | 1` y `14:00-16:00 | 1`, y no lista franjas sin reservas
- AND la cancelada y la anulada no suman a `14:00-16:00`

#### ADDED — Salas que nadie ha reservado

- GIVEN salas Norte y Sur, y una reserva activa en Norte
- WHEN se ejecuta `informes`
- THEN la vista «Salas que nadie ha reservado» lista `Sur`

#### ADDED — Todas las salas tienen reservas

- GIVEN salas Norte y Sur, y una reserva activa en cada una
- WHEN se ejecuta `informes`
- THEN la vista «Salas que nadie ha reservado» dice `ninguna`

#### ADDED — Sin reservas

- GIVEN ninguna reserva activa (no hay reservas, o las que hay están canceladas o anuladas)
- WHEN se ejecuta `informes`
- THEN cada una de las cuatro vistas muestra su título y debajo `sin reservas`, en lugar de la tabla
- AND la vista «Salas que nadie ha reservado» dice `sin reservas`, no `Norte` y `Sur`

#### ADDED — Filtro por sala

- GIVEN salas Norte y Sur, con reservas activas Norte lun 10:00-12:00 y Sur mar 14:00-16:00
- WHEN se ejecuta `informes --sala Norte`
- THEN «Ocupación por sala» tiene solo `Norte | 1`, «Franjas más reservadas» solo `10:00-12:00 | 1`, «Ocupación por día de la semana» tiene los siete días con `lun | 1` y el resto a `0`, y «Salas que nadie ha reservado» dice `ninguna`
- AND con la reserva de Sur cancelada, `informes --sala Sur` muestra `sin reservas` en las cuatro vistas
- AND `informes --sala Oeste` responde `sala desconocida: Oeste` y nada más
- AND `informes --sala` responde `falta el nombre de la sala` y nada más

#### Reglas de la capacidad — reporting

- **Dónde viven los datos**: las reservas y las salas en memoria de `src/app.js`; `informes` solo lee, no guarda nada.
- **Idioma de los nombres**: castellano; el comando `informes`, la opción `--sala`, los literales `sin reservas`, `ninguna`, `sala desconocida` y `falta el nombre de la sala`, y los días `lun mar mie jue vie sab dom` sin tildes.
- **Límites**: ninguno; las franjas no tienen tope y los días son siete fijos.
- **Avisos**: `sala desconocida: <nombre>` y `falta el nombre de la sala`, por la salida normal.
- **Regla ante conflicto**: solo cuentan las reservas `active`; una reserva con un día desconocido se cuenta en sala y franja y no en día.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
