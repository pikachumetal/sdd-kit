---
id: 20261119-175050-feature-0012-informes
feature: 0012
title: Comando informes con cuatro vistas de uso de las salas
mode: full
profile: delegate
status: draft
created: 2026-11-19
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Comando informes con cuatro vistas de uso de las salas

🦆 Hoy no hay forma de ver cómo se usan las salas. Con esta feature, `node src/app.js informes` imprime cuatro tablas de texto: reservas por sala, por día de la semana, por franja y las salas que nadie ha reservado. Con la única reserva actual (Norte, lun, 10:00-12:00), la primera tabla dice `Norte  1` y `Sur  0`. `--sala Norte` limita las cuatro tablas a esa sala. Si no hay reservas, cada tabla dice «sin reservas».

Validación: dev-lead — lo que sale por la terminal lo lee una persona, y el formato de las tablas y el orden de los días son decisiones de lectura.

## Capacidades

- Nuevas: `booking-reports` — las cuatro vistas del comando `informes` y su filtro `--sala`.
- Modificadas: ninguna.
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva (`booking-reports`) · tamaño: ~90 líneas en 2 ficheros (`src/app.js`, `test/informes.test.js`); sin contrato público, sin `MODIFIED`, sin datos persistentes
- Sonnet, siete puntos: si los THEN con datos de «Ocupación por día de la semana» y «Franjas más reservadas» coinciden con las decisiones 3 y 4, si el «Filtro por sala» y «Sin reservas» no se contradicen con las decisiones 5 y 6, y si algún valor del cuerpo (los títulos de las vistas, `sala desconocida: <nombre>`) falta en ✋ (señal: capacidad nueva)
- Mínimo razonable: sin revisor — deja sin cubrir los cruces entre el filtro `--sala` y el mensaje «sin reservas», justo donde ya corregí una contradicción en la pasada de coherencia
```

1. «Ocupación» = número de reservas activas, no porcentaje — las franjas son texto libre (`10:00-12:00`) y no hay capacidad ni horario de apertura que sirva de denominador; un porcentaje inventaría uno.
2. Solo cuentan las reservas con estado `active`; `cancelled` y `voided` no — una reserva cancelada o anulada ya no ocupa la sala. Contarlas inflaría la ocupación.
3. Los días salen siempre en orden `lun, mar, mié, jue, vie, sáb, dom`, con los días sin reservas a 0, no en orden alfabético — `sort()` pondría `jue` antes de `lun`. Las abreviaturas son las del escenario (`lun, mar, mié, jue, vie, sáb, dom`); hoy el código solo usa `lun`, así que `mar`…`dom` las doy yo por analogía.
4. «Franjas más reservadas» ordena por número de reservas descendente y, a igual número, por franja ascendente; lista solo las franjas con al menos una reserva — lo más reservado arriba es el sentido de «más reservadas»; el desempate es mío para que la salida sea determinista. Las franjas se comparan como texto: vale porque el formato es `HH:MM-HH:MM` con ceros (`09:00-10:00` va antes que `10:00-12:00`); una franja sin cero inicial (`9:00-10:00`) ordenaría mal y queda fuera.
5. «Salas que nadie ha reservado» cuenta todas las reservas activas actuales. Con `--sala X`, si X tiene reservas la vista dice `ninguna` («esa sala sí está reservada»); si X no tiene ninguna, aplica la 6 y dice `sin reservas`. Con `--sala` y una sala que no existe (`--sala Este`), el comando responde `sala desconocida: Este` y no imprime tablas; las salas válidas son las de `rooms` (Norte y Sur).
6. «Sin reservas»: si no hay ninguna reserva activa (en el ámbito del filtro), las cuatro vistas dicen `sin reservas`, también la de salas sin reservar, que en ese caso no lista las salas — lo pediste literal («cada vista dice sin reservas»). Coste: con cero reservas, esa vista no enumera las salas vacías.
7. Formato de salida: las vistas de recuento (sala, día, franja) son un título, una fila de cabecera y filas con columnas alineadas y separadas por al menos dos espacios; «Salas sin reservas» es un título y una línea por sala, sin cabecera; `sin reservas` y `ninguna` son una sola línea bajo el título, sin cabecera. Las filas de «Ocupación por sala» van en el orden de `rooms` (Norte, Sur) y llevan también las salas a 0; las cuatro vistas se separan con una línea en blanco y van siempre en el orden del brief (sala, día, franja, salas sin reservar). Los títulos son `Ocupación por sala`, `Ocupación por día`, `Franjas más reservadas` y `Salas sin reservas`, y la cabecera de las columnas de números es `reservas` — nadie dijo los literales.
8. El comando se llama `informes` y la opción `--sala <nombre>`; se engancha en `run` como `libres`, `cancelar` y `anular`, en `src/app.js` — el proyecto tiene un solo fichero de entrada (`architecture.md`).
9. `--sala` distingue mayúsculas tal como está en `rooms` (`Norte`, no `norte`) — igual que `cancelar` y `reservar`, que comparan el nombre tal cual; `--sala norte` responde `sala desconocida: norte`.
10. Capacidad nueva `booking-reports` — el slug en inglés kebab-case; el proyecto aún no tiene `capabilities/`, así que se crea con esta feature.
11. `§Frontend` no aplica: la feature solo imprime texto por terminal y `operations.md` ya declara `Acceso: sin login` y no hay interfaz gráfica.
12. El porqué de la feature está **pendiente**: no se contestó qué quieres decidir o ver con los informes («sigue con el que recomiendas»). Si el motivo cambia lo que cuenta como «ocupación» (decisión 1) o qué reservas entran (decisión 2), esas dos decisiones se reabren.
13. Enfoque: una función por vista sobre las reservas ya filtradas, frente a un agregado único o a un módulo nuevo (ver Approach); el spec lo aprueba al pasar el gate. En delegate, no hay mensaje aparte de enfoques ni secciones de repaso: esta lista es lo que habría ido ahí.
14. Pasada de coherencia: corregí una contradicción entre las decisiones 5 y 6 (la vista de salas sin reservar con `--sala` sin reservas) y la regla de las abreviaturas de los días (3); `git grep -i "informes|booking-reports"` fuera de la spec: sin coincidencias, nada que retirar. Fusión del delta sobre una copia de `.docs/sdd`: `sdd capability merge` aceptó los 7 requisitos de `booking-reports` (7 añadidos, sin rechazos); `capabilities/` del repo sin tocar.
15. Reglas de la capacidad `booking-reports` (las cinco, por nombre): datos — las reservas en memoria de `bookings` y las salas de `rooms`, sin datos nuevos; nombres — en castellano (títulos, mensajes, días); límites — no aplica, son cuatro tablas de un puñado de filas; avisos — `sin reservas`, `ninguna` y `sala desconocida: <nombre>`, que salen por la salida normal (`console.log` de `run`, como los demás comandos) y no cambian el código de salida; conflicto — `--sala` sin valor responde `falta la sala: usa --sala <nombre>`, y `--sala` repetida queda fuera (ver «No entra»).
16. Nombres internos, a tu aprobación: `roomReport`, `dayReport`, `slotReport` y `unbookedRooms`, en inglés como `cancelBooking` y `voidBooking`; el texto que ve el usuario va en castellano.
17. Reparto de las 5 tasks (tu frase fija «una por vista y otra para --sala»): 1 `roomReport` y el comando `informes` que une las vistas · 2 `dayReport` · 3 `slotReport` · 4 `unbookedRooms` · 5 `--sala`, con su validación, el error y el filtrado. El «sin reservas» de cada vista va en la task de esa vista.
18. Las vistas son funciones puras que reciben la lista de reservas activas; los tests les pasan listas inventadas. Solo `run('informes')` lee el `bookings` en memoria (hoy, Norte lun 10:00-12:00), así que los escenarios con más datos se prueban por las funciones y no por `run`.
19. Con `--sala Sur` donde Sur no tiene reservas pero Norte sí, las cuatro vistas dicen `sin reservas` (decisión 6): sigo tu frase literal aunque la vista de salas sin reservar «sabría» que Sur está libre. Es la decisión de esta spec que más te conviene validar.

- Política de modelos (solo en `delegate`): revisor de la spec: uno, con modelo medio · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto (las 5 tasks van una tras otra) · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — la vista «Salas sin reservas» no tenía cabecera y la decisión 7 no lo decía → decisión 7 corregida y literales del delta alineados.
- **Rechazado** — «`--sala Sur` sin reservas de Sur debería listar Sur, no decir `sin reservas`» → el dev-lead dijo que cada vista dice «sin reservas» cuando no hay reservas; lo aplico literal y lo marco en la decisión 19 para que lo valides (no es Crítico).
- **Aceptado** — el orden de las salas y la sala a 0 no tenían escenario → decisión 7 y escenario nuevo con `Sur  0`.
- **Aceptado** — el desempate de franjas no se ejercitaba y no se decía cómo se comparan → decisión 4 y escenario con empate.
- **Aceptado** — «Las cuatro vistas juntas» no tenía literal → salida completa en el delta.
- **Aceptado** — faltaban las cinco reglas → decisión 15.
- **Aceptado** — `voided` no se ejercitaba → el GIVEN de «Ocupación por sala» lleva una reserva anulada.
- **Aceptado** — faltaban `--sala norte`, `--sala` sin valor, y el canal de salida → decisiones 9 y 15 y escenarios del filtro; `--sala` repetida pasa a «No entra».
- **Aceptado** — nombres internos y dueño de `sin reservas` y del error en las tasks → decisiones 16 y 17.
- **Aceptado** — la spec no decía de dónde salen `run` y las reservas → decisión 18 y «Dónde se prueba».
- Sin Críticos, así que no hay segunda ronda.

### Decisiones tomadas con el dev-lead

- Un comando `informes` con cuatro vistas: ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado — «un comando informes con cuatro vistas (ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado)»
- Opción `--sala` que filtra las cuatro vistas — «una opción --sala que filtra las cuatro»
- Salida en tabla de texto — «la salida es una tabla de texto»
- Sin reservas, cada vista dice «sin reservas» — «sin reservas, cada vista dice «sin reservas»»
- 5 tasks, una por vista y otra para `--sala` — «el plan sale en 5 tasks, una por vista y otra para --sala»
- Las decisiones 1 a 6 de arriba las tomo yo con tu «Sigue con el que recomiendas» — «Sigue con el que recomiendas.» (la pregunta anterior era abierta y no ofrecía opciones; lo leo como «decide por mí en lo técnico y lo menor», y por eso están marcadas arriba para que las rechaces)

## Intent

Hoy el único listado que existe es `libres <franja>`, que dice qué salas están libres a una hora. No hay forma de ver cómo se usan las salas en conjunto: qué sala se reserva más, qué días y a qué horas, o si alguna sala nunca se usa. El éxito es que `informes` conteste esas cuatro preguntas con una salida que se lea de un vistazo, con los mismos números que se obtendrían contando las reservas activas a mano. El porqué concreto (qué decisión se apoya en ellos) está pendiente (✋ 12).

Anti-goals: que una reserva cancelada o anulada engorde la ocupación; que el orden de los días sea el alfabético; que `--sala` filtre unas vistas y otras no.

## Scope

- Entra: el comando `informes`; las cuatro vistas; la opción `--sala <nombre>` sobre las cuatro; el mensaje `sin reservas`; el error `sala desconocida: <nombre>`; las pruebas de cada vista y del filtro.
- Entra, si el RED lo exhibe: nada.
- No entra: persistencia de las reservas (siguen en memoria); filtros por día o por franja; porcentajes; exportación a fichero o a `.ics` (es la 0004); `--sala` repetida (comportamiento sin definir); cualquier cambio en `reservar`, `cancelar`, `anular` o `libres`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | Scope: `run` solo gana una rama nueva para `informes`; la respuesta por defecto `salas` no cambia |

- Filas que implementa: nada: comprobado con `grep -n -i informes ROADMAP.md CHANGELOG.md PRODUCT.md`, sin coincidencias.

## Approach

- A. Una función por vista (`roomReport`, `dayReport`, `slotReport`, `unbookedRooms`) que recibe las reservas activas ya filtradas por `--sala` y devuelve el texto de su tabla; `run` las concatena. Coste: el filtrado y el «sin reservas» se repiten en la llamada, pero cada vista se prueba sola y encaja con las 5 tasks.
- B. Un agregado único que recorre las reservas una vez y calcula las cuatro tablas, y un renderizador aparte. Coste: menos pasadas, pero una task no cierra una vista sola y el agregado crece con cada una.
- C. Un módulo nuevo `src/informes.js`. Coste: separa el código, pero rompe el «un solo fichero de entrada» de `architecture.md` por cuatro funciones pequeñas.
- Elegido: A — cada vista es una función pura que se prueba sin tocar las demás, y el reparto en tasks sale solo; B y C no ganan nada con cuatro tablas de un puñado de líneas.

Partes del cómo que fija A:

- El filtro `--sala` se aplica una vez, antes de las vistas: se calcula la lista de reservas activas de esa sala (o de todas).
- Una función de formato compartida arma las tablas (título, cabecera, filas con dos espacios entre columnas).
- Las funciones nuevas se exportan junto a `run`, como `cancelBooking` y `voidBooking`, para probarlas directamente.

## Dónde se prueba

- Cada vista: unitario sobre su función exportada, a la que el test pasa una lista de reservas inventada (✋ 18), y `run('informes')` solo para el caso de la reserva en memoria, en `test/informes.test.js`, con el estilo de `test/app.test.js` y `test/cancel.test.js` (`assert.equal` sobre el texto).
- `--sala`: unitario sobre `run('informes', ['--sala', 'Norte'])` en el mismo fichero, una prueba por vista; el filtrado se prueba pasando la lista completa a la función de filtro.
- `sin reservas` y `sala desconocida`: unitarios sobre `run`, marcando las reservas como `cancelled`/`voided` para dejar el estado sin reservas activas.
- No hay pantalla: no se requiere captura.

## Términos y ADR

- Términos resueltos: Reserva — la de `PRODUCT.md`; en los informes cuentan solo las activas (✋ 2). Sala — la de `PRODUCT.md`.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `booking-reports`

#### ADDED — Ocupación por sala

- GIVEN las reservas activas: Norte lun 10:00-12:00 · Norte mar 10:00-12:00 · Sur lun 14:00-16:00, y dos reservas que no cuentan: una `cancelled` (Sur mié 10:00-12:00) y una `voided` (Norte jue 10:00-12:00)
- WHEN `informes`
- THEN la vista dice:
  ```text
  Ocupación por sala
  sala   reservas
  Norte  2
  Sur    1
  ```
- AND con solo Norte lun 10:00-12:00 activa, `Sur    0` aparece en la tabla, tras `Norte  1`

#### ADDED — Ocupación por día de la semana

- GIVEN las mismas reservas
- WHEN `informes`
- THEN la vista dice, con los días en orden de calendario y los días sin reservas a 0:
  ```text
  Ocupación por día
  día  reservas
  lun  2
  mar  1
  mié  0
  jue  0
  vie  0
  sáb  0
  dom  0
  ```

#### ADDED — Franjas más reservadas

- GIVEN las mismas reservas
- WHEN `informes`
- THEN la vista dice, con la franja de más reservas arriba y a igualdad por franja ascendente:
  ```text
  Franjas más reservadas
  franja       reservas
  10:00-12:00  2
  14:00-16:00  1
  ```
- AND con las reservas activas Norte lun 10:00-12:00 · Sur mar 14:00-16:00 · Sur mié 09:00-10:00, hay empate a 1 y salen en orden de franja: `09:00-10:00  1`, `10:00-12:00  1`, `14:00-16:00  1`

#### ADDED — Salas que nadie ha reservado

- GIVEN reservas activas solo de Norte (Norte lun 10:00-12:00)
- WHEN `informes`
- THEN la vista dice:
  ```text
  Salas sin reservas
  Sur
  ```
- AND con reservas activas de Norte y de Sur, la vista dice `ninguna` bajo el título

#### ADDED — Las cuatro vistas juntas

- GIVEN las reservas activas del primer escenario (con las dos que no cuentan)
- WHEN `informes`
- THEN sale el texto entero, con las cuatro vistas en el orden sala, día, franja, salas sin reservar y una línea en blanco entre ellas:
  ```text
  Ocupación por sala
  sala   reservas
  Norte  2
  Sur    1

  Ocupación por día
  día  reservas
  lun  2
  mar  1
  mié  0
  jue  0
  vie  0
  sáb  0
  dom  0

  Franjas más reservadas
  franja       reservas
  10:00-12:00  2
  14:00-16:00  1

  Salas sin reservas
  ninguna
  ```

#### ADDED — Filtro por sala

- GIVEN las reservas activas Norte lun 10:00-12:00 · Norte mar 10:00-12:00 · Sur lun 14:00-16:00
- WHEN `informes --sala Norte`
- THEN las cuatro vistas cuentan solo las reservas de Norte: `Ocupación por sala` lista solo `Norte  2`, `Ocupación por día` da `lun  1`, `mar  1` y el resto a 0, `Franjas más reservadas` da `10:00-12:00  2`, y `Salas sin reservas` dice `ninguna`
- AND con `informes --sala Este` el comando responde `sala desconocida: Este` y no imprime tablas, y con `informes --sala norte`, `sala desconocida: norte`
- AND con `informes --sala` sin nombre responde `falta la sala: usa --sala <nombre>` y no imprime tablas
- AND con `informes --sala Sur` y ninguna reserva activa de Sur, las cuatro vistas dicen `sin reservas`

#### ADDED — Sin reservas

- GIVEN ninguna reserva activa (o ninguna de la sala filtrada)
- WHEN `informes`
- THEN cada una de las cuatro vistas dice `sin reservas` bajo su título, incluida la de salas sin reservar

#### Reglas de la capacidad — booking-reports

- **Dónde viven los datos**: las reservas en memoria (`bookings`) y las salas (`rooms`) de `src/app.js`; la capacidad no guarda datos propios.
- **Idioma de los nombres**: castellano en todo lo que ve el usuario (títulos, mensajes, días); inglés en los nombres internos del código.
- **Límites**: no aplica: cuatro tablas de un puñado de filas.
- **Avisos**: `sin reservas`, `ninguna`, `sala desconocida: <nombre>` y `falta la sala: usa --sala <nombre>`, por la salida normal y sin cambiar el código de salida.
- **Regla ante conflicto**: `--sala` repetida queda fuera de la capacidad (comportamiento sin definir).
