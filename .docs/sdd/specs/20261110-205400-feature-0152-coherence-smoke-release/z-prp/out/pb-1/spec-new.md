---
id: 20261112-155549-feature-0012-informes
feature: 0012
title: Informes de ocupación de salas
mode: full
status: draft
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Informes de ocupación de salas

🦆 Hasta ahora no hay forma de saber cuánto se usan las salas. Con `informes` verás, de un vistazo y en una tabla de texto, cuántas reservas tiene cada sala, qué días de la semana se llenan más, qué franjas se piden más y qué salas no ha reservado nadie: por ejemplo, con tres reservas en Norte y ninguna en Sur, la primera tabla pone Norte con 3 y Sur con 0, y la última lista «Sur». Con `--sala Norte` las cuatro vistas se limitan a esa sala; si esa sala no tiene reservas, las cuatro dicen «sin reservas», sin listar la sala como libre. Por dentro, `informes` cuenta las reservas activas que ya guarda la aplicación.

Validación: dev-lead — es una salida de texto que una persona lee y juzga.

## Capacidades

- Nuevas: `reports` — comando `informes`: cuatro vistas de ocupación en tabla de texto y filtro `--sala`.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`reports`) · tamaño: ~120 líneas en 2 ficheros (`src/app.js` y `test/informes.test.js`)
- Dominio (sonnet): si los THEN de las cuatro vistas dan la misma salida con el mismo dato, y si el vacío de `--sala` (decisión 8) es coherente con «sin reservas» (señal: capacidad nueva)
- Técnica (sonnet): si exportar `bookings` para los tests (Approach) rompe los tests existentes de `libres` y `cancelar`, y si el formato de tabla (decisión 2) se puede producir sin dependencias (señal: capacidad nueva)
- Mínimo razonable (alternativa descartada, se lanzaron los dos): solo técnica — deja sin mirar si las cuatro vistas dicen lo mismo ante los mismos datos

1. Nombre de la capacidad nueva: `reports` (kebab-case en inglés), con el comando en castellano `informes` como los demás (`libres`, `cancelar`) — el comando lo dijo el dev-lead; el slug es solo un nombre de fichero.
2. Formato exacto de la tabla: línea de título, línea de cabecera, una fila por dato. Columnas separadas por dos espacios; cada columna menos la última se rellena con espacios hasta la anchura de su celda más ancha, la cabecera incluida y el título no; la última no se rellena, así que ninguna línea acaba en espacio. `run` devuelve las cuatro vistas unidas por una línea en blanco (`\n\n`), sin salto de línea final. Títulos y cabeceras: `Ocupación por sala` / `Sala  Reservas`, `Ocupación por día de la semana` / `Día  Reservas`, `Franjas más reservadas` / `Franja  Reservas`, `Salas que nadie ha reservado` / `Sala` (los dos espacios son el separador; con el relleno, `Sala   Reservas` si la sala más larga es `Norte`). Una vista vacía (`sin reservas` o `ninguna`) lleva solo el título y esa línea, sin cabecera — «tabla de texto» lo dijo el dev-lead; el resto es mío.
3. Solo cuentan las reservas activas (`status === 'active'`): una cancelada o anulada no cuenta, como ya hace `libres`.
4. Ocupación por sala: una fila por sala del alcance, en el orden de `rooms` (Norte, Sur), con las de 0 reservas incluidas. Sin filtro el alcance son las dos salas; con `--sala X`, solo X.
5. Ocupación por día: solo los días con alguna reserva, en orden de semana `lun, mar, mie, jue, vie, sab, dom` (sin tildes, como el `lun` que ya hay en los datos); un día fuera de esa lista va al final, por orden alfabético.
6. Franjas más reservadas: todas las franjas con alguna reserva, de más a menos reservas; a igualdad, por franja de menor a mayor (texto). Sin tope «top N».
7. Salas que nadie ha reservado: las salas del alcance sin ninguna reserva activa, en orden de `rooms`. Si todas tienen alguna, la vista dice `ninguna` (sin cabecera).
8. «sin reservas»: cuando no hay ninguna reserva activa en el alcance del informe (con `bookings` vacío, o con todas canceladas o anuladas), cada una de las cuatro vistas conserva su título y debajo pone `sin reservas`, también la de salas sin reservar (aunque entonces todas lo estén). Con `--sala X`, el alcance son las reservas de X: si X no tiene, las cuatro dicen `sin reservas` y la vista 4 no lista a X. Consecuencia no evidente: con el filtro, la vista 1 dice `sin reservas` en vez de `Sur  0` y la vista 4 nunca enseña «X no tiene reservas»; dilo si prefieres que sí lo enseñen.
9. `--sala <nombre>`: el nombre es el parámetro que sigue a `--sala`, exacto y con mayúscula inicial como en `rooms`; cualquier otro parámetro de `informes` se ignora (`informes extra --sala Sur` vale como `informes --sala Sur`); si `--sala` se repite, vale el primero. Si la sala no existe, incluida `norte` en minúscula: `sala desconocida: <nombre>` y no se imprime ninguna vista. Si tras `--sala` no hay nada o viene otro parámetro que empieza por `--`: `falta el nombre de la sala`. Si la sala es desconocida, ese mensaje gana al «sin reservas».
10. Enfoque: una función por vista dentro de `src/app.js` (frente a un módulo aparte y frente a una función genérica de agrupar; ver Approach); se prueba por `run('informes', …)` con `bookings` exportado, lo que añade una exportación nueva a la superficie de `app.js`.
11. Idioma de los nombres: la interfaz en castellano (títulos, cabeceras, mensajes); los identificadores internos siguen los del código actual (`bookings`, `rooms`). Límites: ninguno (sin tope de filas, almacén en memoria). Datos: en memoria, como dice `operations.md`.
12. Repaso de coherencia: `git grep -n informes -- . ':!.docs/sdd/changes' ':!.docs/sdd/specs'` sin resultados; el delta sobre una copia de `.docs/sdd` (`sdd capability merge`) añade los requisitos de `reports` sin errores (comprobado de nuevo tras la review).
- Política de modelos (delegate): revisores de la spec, dominio y técnica, ambos sonnet, y una segunda ronda con un revisor sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar

### Hallazgos de la review

- **Aceptado** — Crítico: «Franjas más reservadas» pasaba sin implementar el orden por reservas → fixtures con orden por reservas distinto del orden por texto y un empate (A: `15:00-16:00` ×2 frente a `10:00-12:00` ×1; B: empate 2-2).
- **Aceptado** — Crítico: «Ocupación por día» pasaba sin implementar el orden de semana → fixture A con `jue` insertado antes que `lun` (el orden de inserción y el alfabético dan `jue, lun`; el de semana, `lun, jue`, que es el que exige el THEN); fixture B con un día fuera de lista (`fes`).
- **Aceptado** — Crítico: el filtro no restringía las salas de las vistas 1 y 4 → decisiones 4, 7 y 8 declaran que `--sala X` restringe también las salas del alcance.
- **Aceptado** — Importante: anchura y relleno de la tabla ambiguos, y el separador entre vistas → decisión 2 exacta (la cabecera cuenta, la última columna no se rellena, `\n\n`, sin salto final) y un escenario con la salida completa.
- **Aceptado** — Importante: una `voided` no se probaba → el fixture A incluye una anulada.
- **Aceptado** — Importante: `--sala` repetido, en minúscula, con otro parámetro, o seguido de `--x` → decisión 9 y escenarios.
- **Aceptado** — Importante: «sin reservas» solo con una sala cancelada → decisión 8 (vacío, todas canceladas o anuladas) y escenario con `bookings` vacío.
- **Aceptado** — Importante: el filtro no se diferenciaba de la vista sin filtrar → escenario `--sala Sur` sobre el fixture B.
- **Aceptado** — Importante: el éxito del Intent «Norte 3 · Sur 0» no coincidía con ningún THEN → Intent y 🦆 en términos de las filas de la tabla.
- **Aceptado** — Importante/Menor: tamaño «3 ficheros» frente al Scope → 2 ficheros; el export de `bookings` como cambio de superficie → decisión 10 y «Lo que se retira o cambia de forma».
- **Aceptado** — Menor: reglas de la capacidad (idioma, límites, datos) sin declarar → decisión 11 y «Reglas de la capacidad».
- **Aceptado** — Menor: `git grep` con criterios distintos y la spec sin trackear → decisión 12 unificada con exclusión de `changes/`.
- **Aceptado** — Menor: aislamiento de estado entre tests → cada test restaura `bookings` con `try/finally`; `node --test` corre cada fichero en su proceso.
- **Rechazado** — Menor: «como ya hace `libres`» sin respaldo → se comprobó en `src/app.js` (`b.status === 'active'`); se queda.
- **Rechazado** — Importante (dominio 1, parte): la vista 4 con `--sala Sur` no lista Sur → es la regla del dev-lead («sin reservas» en cada vista sin reservas); queda dicho como consecuencia en la decisión 8 y el dev-lead puede cambiarla al aprobar.

- **Aceptado** — segunda ronda: Crítico `Sur  2` mal rellenado (la cabecera fija la anchura) → `Sur   2`; vistas vacías sin cabecera (decisiones 2 y 7); salida literal de «Sin reservas»; escenario de `--sala` repetido; el 🦆 avisa de la consecuencia del filtro; Approach dice cómo se muta `bookings`.
- **Rechazado** — segunda ronda, Menor: nombrar en la spec dónde cae `renderTable` en las 5 tasks → es cosa del plan.

### Decisiones tomadas con el dev-lead

- Un comando `informes` con cuatro vistas: ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado — «un comando informes con cuatro vistas»
- Opción `--sala` que filtra las cuatro — «una opción --sala que filtra las cuatro»
- Salida: tabla de texto — «la salida es una tabla de texto»
- Sin reservas, cada vista dice «sin reservas» — «sin reservas, cada vista dice «sin reservas»»
- Plan de 5 tasks, una por vista y otra para `--sala` — «el plan sale en 5 tasks, una por vista y otra para --sala»
- Perfil delegate — «Perfil delegate»

## Intent

Hoy el coworking no tiene forma de ver cuánto se usan las salas: `libres` solo dice qué hay libre en una franja. Se quiere un comando `informes` que responda, en una tabla de texto, a cuatro preguntas: cuánto se usa cada sala, qué días se llena, qué franjas se piden más y qué salas nadie ha reservado, y poder limitarlo a una sala. Éxito: con tres reservas activas en Norte y ninguna en Sur, la primera tabla tiene las filas `Norte  3` y `Sur    0` y las demás vistas cuadran con ella. Fracaso aunque funcione: que una cancelada o una anulada cuente como ocupación, o que `--sala` filtre unas vistas y otras no.

## Scope

- Entra: comando `informes` en `src/app.js` con las cuatro vistas y `--sala`; la exportación de `bookings` para probar; tests en `test/informes.test.js`; capacidad nueva `reports`.
- No entra: reservar con día y franja (el `reservar` de hoy es un stub); informes por rango de fechas; salida en CSV o JSON; persistencia de reservas.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `bookings` pasa a exportarse (superficie nueva del módulo; nada se retira) | `src/app.js:3` | decisión 10 y Approach |

- Filas que implementa: nada: comprobado con `git grep -n informes -- . ':!.docs/sdd/changes' ':!.docs/sdd/specs'` (sin resultados).

## Approach

- Una función por vista en `src/app.js`, compuestas por `informes` — el proyecto es un solo fichero (architecture.md); cada vista se prueba sola por `run`, y la task de cada vista no toca las otras.
- Un módulo `src/informes.js` — contradice «un solo fichero de entrada» de architecture.md; cuesta una decisión de arquitectura por un comando.
- Una función genérica «agrupar y contar» con parámetros — la ordenación y el vacío difieren por vista (decisiones 4–7); la abstracción esconde esas diferencias y cuesta más que cuatro funciones cortas.
- Elegido: la primera — respeta el fichero único y deja una task por vista.

Para probar con datos variados, `app.js` exporta `bookings`; cada test guarda una copia de `bookings`, muta el array (`length = 0` y `push`, porque es `const`) y restaura la copia al terminar con `try/finally`. `node --test` corre cada fichero de test en su propio proceso, así que `test/app.test.js` y `test/cancel.test.js` no comparten estado con `test/informes.test.js`. Un helper `renderTable(title, header, rows)` da el formato de la decisión 2. `informes` calcula el alcance (salas y reservas activas, filtradas por `--sala`) una vez y lo pasa a las cuatro vistas.

## Dónde se prueba

- Las cuatro vistas, el vacío y `--sala`: por `run('informes', params)` en `test/informes.test.js`, como los tests actuales de `cancelar`, con `bookings` preparado en cada test.
- La salida real por terminal: `node src/app.js informes` y `node src/app.js informes --sala Norte`, a ojo en la validación.

## Términos y ADR

- Términos resueltos: ocupación — número de reservas activas; franja — la cadena `10:00-12:00` de la reserva.
- ADR candidatas: ninguna

## Delta de comportamiento

Datos de los escenarios. **Fixture A**: activas, en este orden, Norte jue 10:00-12:00, Norte jue 15:00-16:00 y Norte lun 15:00-16:00; cancelada Sur lun 10:00-12:00; anulada Sur mar 10:00-12:00. **Fixture B**: activas Norte lun 10:00-12:00, Sur lun 10:00-12:00, Norte vie 15:00-16:00 y Sur fes 15:00-16:00.

### Capacidad: `reports`

#### ADDED — Ocupación por sala

- GIVEN el fixture A
- WHEN `informes`
- THEN la primera vista es: título `Ocupación por sala`, cabecera `Sala   Reservas`, filas `Norte  3` y `Sur    0` (la cancelada y la anulada no cuentan)

#### ADDED — Ocupación por día de la semana

- GIVEN el fixture A
- WHEN `informes`
- THEN la segunda vista es: título `Ocupación por día de la semana`, cabecera `Día  Reservas`, filas `lun  1` y `jue  2` (orden de semana, solo días con reservas)
- GIVEN el fixture B
- WHEN `informes`
- THEN las filas de la segunda vista son `lun  2`, `vie  1` y `fes  1` (el día fuera de la lista va al final)

#### ADDED — Franjas más reservadas

- GIVEN el fixture A
- WHEN `informes`
- THEN la tercera vista es: título `Franjas más reservadas`, cabecera `Franja       Reservas`, filas `15:00-16:00  2` y `10:00-12:00  1` (de más a menos reservas)
- GIVEN el fixture B
- WHEN `informes`
- THEN las filas de la tercera vista son `10:00-12:00  2` y `15:00-16:00  2` (empate: por franja de menor a mayor)

#### ADDED — Salas que nadie ha reservado

- GIVEN el fixture A
- WHEN `informes`
- THEN la cuarta vista es: título `Salas que nadie ha reservado`, cabecera `Sala`, fila `Sur`
- GIVEN el fixture B
- WHEN `informes`
- THEN la cuarta vista tiene el título y debajo `ninguna`

#### ADDED — Salida completa del informe

- GIVEN el fixture A
- WHEN `informes`
- THEN `run` devuelve las cuatro vistas, en ese orden, separadas por una línea en blanco y sin salto de línea final: la primera ocupa las líneas `Ocupación por sala`, `Sala   Reservas`, `Norte  3`, `Sur    0`; la segunda `Ocupación por día de la semana`, `Día  Reservas`, `lun  1`, `jue  2`; la tercera `Franjas más reservadas`, `Franja       Reservas`, `15:00-16:00  2`, `10:00-12:00  1`; la cuarta `Salas que nadie ha reservado`, `Sala`, `Sur`

#### ADDED — Sin reservas

- GIVEN ninguna reserva activa: `bookings` vacío, o con solo canceladas y anuladas
- WHEN `informes`
- THEN `run` devuelve, unidos por una línea en blanco y sin salto final: `Ocupación por sala` + línea `sin reservas`, `Ocupación por día de la semana` + `sin reservas`, `Franjas más reservadas` + `sin reservas` y `Salas que nadie ha reservado` + `sin reservas` (cada título y su `sin reservas` en líneas consecutivas, sin cabecera)

#### ADDED — Filtro por sala

- GIVEN el fixture A
- WHEN `informes --sala Norte`
- THEN la primera vista tiene solo la fila `Norte  3`, la segunda y la tercera salen como sin filtro, y la cuarta dice `ninguna`
- GIVEN el fixture B
- WHEN `informes --sala Sur`
- THEN la primera vista tiene solo la fila `Sur   2` (la cabecera `Sala` fija la anchura en 4), la segunda las filas `lun  1` y `fes  1`, la tercera `10:00-12:00  1` y `15:00-16:00  1`, y la cuarta dice `ninguna`

#### ADDED — Filtro por una sala sin reservas

- GIVEN el fixture A
- WHEN `informes --sala Sur`
- THEN las cuatro vistas dicen `sin reservas`
- GIVEN el fixture B
- WHEN `informes extra --sala Sur`
- THEN sale igual que con `informes --sala Sur`
- GIVEN el fixture B
- WHEN `informes --sala Sur --sala Norte`
- THEN sale igual que con `informes --sala Sur` (vale el primero)

#### ADDED — Sala del filtro no válida

- GIVEN el fixture A
- WHEN `informes --sala Oeste` o `informes --sala norte`
- THEN sale `sala desconocida: Oeste` (o `sala desconocida: norte`) y ninguna vista
- GIVEN el fixture A
- WHEN `informes --sala` o `informes --sala --otra`
- THEN sale `falta el nombre de la sala` y ninguna vista

#### Reglas de la capacidad — reports

- **Dónde viven los datos**: en memoria, las reservas activas de `bookings`
- **Idioma de los nombres**: interfaz en castellano; identificadores internos como en el código actual
- **Límites**: ninguno
- **Avisos**: `sin reservas`, `ninguna`, `sala desconocida: <nombre>`, `falta el nombre de la sala`
- **Regla ante conflicto**: una sala desconocida gana al vacío; el primer `--sala` gana al repetido

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
