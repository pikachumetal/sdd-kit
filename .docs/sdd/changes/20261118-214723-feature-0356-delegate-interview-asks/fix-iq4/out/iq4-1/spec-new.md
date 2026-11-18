---
id: 20261118-232245-feature-0012-aviso-sala-ocupada
feature: 0012
title: Aviso de sala muy ocupada, por consulta
mode: full
status: approved
created: 2026-11-19
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-19
---

# Spec — Aviso de sala muy ocupada, por consulta

🦆 Hoy no hay forma de saber que una sala está casi llena antes de intentar reservarla. Con esta feature, `salas ocupadas lun` responde `aviso: Norte muy ocupada el lun (3 reservas)` para cada sala con 3 o más reservas activas ese día, y `sin salas muy ocupadas el lun` si ninguna llega. Cuenta solo reservas activas (las canceladas y anuladas no suman). Por dentro, una función pura cuenta por sala y día, y un comando nuevo la enseña.

Validación: dev-lead — es un comando que una persona usa en la terminal; el dev-lead comprueba el texto del aviso y que el umbral le parece razonable.

## Capacidades

- Nuevas: `room-occupancy` — cuándo una sala cuenta como muy ocupada un día y cómo se consulta el aviso (por comando; no se envía solo).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (siete puntos, sonnet) — señales: capacidad nueva · tamaño: ~40 líneas en 3 ficheros (`src/app.js`, un test nuevo y la capacidad)
- Revisor único (sonnet): si el umbral y los THEN son coherentes (3 reservas activas, ni canceladas ni anuladas) y si falta un borde en los escenarios (señal: capacidad nueva)
- Mínimo razonable: sin revisión — deja sin mirar la coherencia entre el umbral, el literal del aviso y los escenarios

1. **Umbral: «muy ocupada» = 3 o más reservas activas de la sala en un día** — pendiente: nadie lo dijo y el modelo no tiene un catálogo de franjas del que sacar un porcentaje; 3 es mi valor. Con 3 como mínimo, el literal `(<n> reservas)` nunca lleva n = 1; si el umbral baja, hay que revisar el plural.
2. **Qué cuenta: solo reservas con estado `active`**; `cancelled` y `voided` no suman — porque una reserva anulada libera la sala (`findBooking` ya las ignora).
3. **Cómo avisa: comando nuevo `salas ocupadas <día>`, que enseña el aviso al consultarlo** — pendiente: «avisa» no dice cuándo ni dónde. Hoy `reservar` no guarda nada (devuelve un texto fijo) y la app no tiene proceso en marcha, así que un aviso «al reservar» o por iniciativa propia no es posible sin otra feature. **Esto reduce lo pedido** (una consulta, no un empujón): lo valida el dev-lead aquí; propongo apuntar «avisar al reservar» como fila del roadmap cuando `reservar` guarde reservas (no la escribo yo: es de `sdd-roadmap`).
4. **Literal del aviso: `aviso: <sala> muy ocupada el <día> (<n> reservas)`**, una línea por sala, en el orden de `rooms` (Norte, Sur); y `sin salas muy ocupadas el <día>` si ninguna llega — pendiente, texto mío (castellano por constitution art. 4).
5. **Capacidad nueva `room-occupancy`** (slug en inglés kebab-case).
6. **Enfoque: función pura `busyRooms(day)` + comando `ocupadas`, frente a avisar al reservar y frente a ampliar `libres`** (ver Approach).
7. **Carpeta de la feature en `.docs/sdd/changes/`**, aunque las anteriores del proyecto estén en `specs/` — así lo fija la convención del kit (`sdd-propose`, regla de oro).
8. **Día ausente o desconocido**: sin día, `falta el día` (pendiente, texto mío); un día sin reservas no es error y da `sin salas muy ocupadas el <día>`. El día se compara literal, como hace `findBooking`: `Lun` y `lun` son días distintos; argumentos de más se ignoran. No se valida el formato del día (ya está en la deuda «Sin validación del formato de franja horaria» como hermano).
9. **Los tests siembran reservas con la lista `bookings` de `src/app.js`, que pasa a exportarse** (hoy es local) — es lo mínimo para probar sin tocar `reservar`; cada test la deja como estaba vaciándola y rellenándola en su sitio (`splice`/`length = 0`), sin reasignarla.
10. **Delta probado sobre una copia** (evidencia, no decisión): ver «Hallazgos», último punto.
- Política de modelos: revisor de la spec en sonnet (uno) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

1. **Aceptado** (Crítico) — el modelo de reservas no estaba declarado → Approach describe `bookings`, `rooms` y `findBooking`; decisión 9 y Scope: `bookings` se exporta para sembrar los tests.
2. **Aceptado en parte** (Crítico) — la evidencia del merge no es una decisión → decisión 10 la marca como evidencia (la plantilla pide su línea en ✋); `findBooking` solo considera `active`, así que canceladas y anuladas quedan fuera (comprobado en `src/app.js`).
3. **Aceptado** — el escenario de canceladas/anuladas pasaba sin el comportamiento → ahora son cuatro reservas (2 activas + 1 cancelada + 1 anulada), que cruzan el umbral si se cuentan mal.
4. **Aceptado** — sin escenario con n distinto de 3 → «El aviso cuenta las reservas que hay» (4).
5. **Aceptado** — sin aislamiento por día ni día ausente → dos escenarios nuevos y decisión 8.
6. **Aceptado** — `operations.md` sí existe (leído al empezar); «no aplica» ahora lleva su motivo.
7. **Aceptado** — se reconoce en decisión 3 e Intent que se entrega una consulta, menos que lo pedido; la fila de roadmap queda propuesta, no escrita.
8. **Aceptado** — decisión 7 vieja (repetía el Scope) eliminada; la convención de carpeta se cita.
9. **Aceptado** — orden de líneas fijado en el THEN; `rooms` definido.
10. **Aceptado** — «Idioma de los nombres» se refiere al texto visible; los identificadores siguen en inglés como el resto de `src/app.js`.

#### Segunda ronda

1. **Aceptado** (Crítico) — la aprobación por delegación no constaba en frontmatter ni tabla → registrada en `approvers` y «Aprobaciones», sobre esta versión (con los escenarios de la review).
2. **Aceptado** (Crítico) — día desconocido sin escenario, mayúsculas sin decidir → escenario «Un día sin reservas no es error» y decisión 8 (comparación literal).
3. **Aceptado** — el título y la capacidad prometían un aviso espontáneo → título «…, por consulta», `Capacidades` y `Avisos` dicen que se muestra al consultar.
4. **Aceptado** — exportar `bookings` no constaba en «Lo que se retira o cambia de forma» → fila añadida; los tests no reasignan la lista.
5. **Aceptado** — «Regla ante conflicto» y «Límites» → motivo preciso (síncrono, un hilo) y límite con unidad.
6. **Aceptado** — plural fijado por el umbral → dicho en la decisión 1.
7. **Aceptado** — cifras del merge desfasadas → rehecho sobre la copia: ver punto siguiente.
8. **Aceptado** — «no dice nada de Sur» → «la salida es solo la línea de Norte».
9. **Rechazado** — fusionar decisiones 5 y 6 en las secciones → la plantilla exige que la capacidad nueva y el enfoque elegido consten en ✋.
10. **Aceptado** — el lint entra en «Dónde se prueba».

**Evidencia del delta** (copia de `.docs/sdd`, no el repo): `sdd capability merge` → `room-occupancy.md`: 8 requisitos y 5 reglas añadidos, `rc=0`; `sdd capability check` → `Capacidades válidas: 1`.

### Decisiones tomadas con el dev-lead

- Perfil `delegate` y spec aprobada por delegación — «apruebo la spec por delegación, nos vemos en la validación»
- Quiere que el sistema avise cuando una sala esté muy ocupada — «avisa cuando una sala esté muy ocupada»

## Intent

Hoy se descubre que una sala está llena al intentar reservarla. Se quiere poder preguntar de antemano qué salas están muy ocupadas un día. Se entrega como consulta (decisión 3), que es menos que un aviso espontáneo. Éxito: `salas ocupadas lun` con tres reservas activas de Norte dice que Norte está muy ocupada con `3 reservas`, y la salida es solo la línea de Norte. Anti-objetivo: que cuente reservas canceladas o anuladas y avise de una sala que en realidad está libre.

## Scope

- Entra: función `busyRooms(day)` en `src/app.js`, comando `ocupadas <día>`, exportar `bookings` para sembrarlas en los tests, tests en `test/occupancy.test.js`, la capacidad `room-occupancy`.
- No entra: avisar al reservar, notificaciones por correo (fila 0008), umbral configurable, ocupación por franja u horas, validar el formato del día, cambios en `libres`/`reservar`/`cancelar`/`anular`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `bookings` pasa de local a exportado en `src/app.js` | `src/app.js:3` | Scope y decisión 9: solo para sembrar tests; no cambia ningún comando |

- Nada se retira: ni comandos ni literales existentes cambian.
- Filas que implementa: nada: comprobado con `git grep -niE "ocupad|busy|0012" -- . ':!.docs/sdd/changes'` (sin resultados)

## Approach

- A. Función pura `busyRooms(day)` y comando `ocupadas <día>` — un cambio pequeño en `src/app.js`; se prueba sola; el aviso es una consulta, no un empujón.
- B. Avisar al reservar — no encaja hoy: `reservar` no guarda reservas (devuelve `reserva semanal creada`), habría que hacer real la reserva, que es otra feature.
- C. Añadir el aviso a la salida de `libres` — `libres` recibe una franja, no un día, y mezclaría dos respuestas en una.
- Elegido: A — es lo único que da el aviso con el modelo actual sin tocar comandos existentes.

Modelo de datos que usa (ya existe, no cambia): `bookings` es una lista en memoria de `{ room, day, slot, status }` con `status` `active`, `cancelled` o `voided`; `rooms` es la lista ordenada `['Norte', 'Sur']`; `findBooking` solo considera `active`. Lo único que cambia es que `bookings` se exporta.

Parte del cómo que fija A: una constante `BUSY_THRESHOLD = 3` y `busyRooms(day)` devuelve las salas (de `rooms`, en orden) con `n >= BUSY_THRESHOLD` reservas `active` ese día, con su `n`; `run('ocupadas', [day])` formatea las líneas.

## Dónde se prueba

- Umbral, estados y literal del aviso: unitario en `test/occupancy.test.js`, por `run('ocupadas', [día])`, como los de `test/cancel.test.js`.
- Comandos existentes sin cambio: `node --test` entero, y el gate de cierre completo, `node --test && node scripts/lint.mjs`: el cambio en `src/app.js` no debe meter tabuladores.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-occupancy`

#### ADDED — Una sala con tres reservas activas en un día está muy ocupada

- GIVEN Norte con tres reservas activas el lun y Sur con una
- WHEN se ejecuta `salas ocupadas lun`
- THEN la salida es `aviso: Norte muy ocupada el lun (3 reservas)`

#### ADDED — Las reservas canceladas y anuladas no cuentan

- GIVEN Norte con dos reservas activas, una cancelada y una anulada el lun (cuatro en total)
- WHEN se ejecuta `salas ocupadas lun`
- THEN la salida es `sin salas muy ocupadas el lun`

#### ADDED — Sin salas muy ocupadas se dice

- GIVEN Norte con dos reservas activas el lun
- WHEN se ejecuta `salas ocupadas lun`
- THEN la salida es `sin salas muy ocupadas el lun`

#### ADDED — El aviso cuenta las reservas que hay

- GIVEN Norte con cuatro reservas activas el lun
- WHEN se ejecuta `salas ocupadas lun`
- THEN la salida es `aviso: Norte muy ocupada el lun (4 reservas)`

#### ADDED — Solo cuentan las reservas del día consultado

- GIVEN Sur con tres reservas activas el mar y ninguna el lun
- WHEN se ejecuta `salas ocupadas lun`
- THEN la salida es `sin salas muy ocupadas el lun`

#### ADDED — Un día sin reservas no es error

- GIVEN ninguna reserva el dom
- WHEN se ejecuta `salas ocupadas dom`
- THEN la salida es `sin salas muy ocupadas el dom`

#### ADDED — Sin día se pide

- GIVEN cualquier estado de reservas
- WHEN se ejecuta `salas ocupadas` sin día
- THEN la salida es `falta el día`

#### ADDED — Cada sala muy ocupada tiene su línea

- GIVEN Norte y Sur con tres reservas activas cada una el mar
- WHEN se ejecuta `salas ocupadas mar`
- THEN la salida son dos líneas, primero Norte y luego Sur: `aviso: Norte muy ocupada el mar (3 reservas)` y `aviso: Sur muy ocupada el mar (3 reservas)`

#### Reglas de la capacidad — room-occupancy

- **Dónde viven los datos**: en memoria, con las reservas (`operations.md`)
- **Idioma de los nombres**: castellano en el texto que ve el usuario (constitution, art. 4); los identificadores del código siguen los del fichero (inglés)
- **Límites**: 3 reservas activas por sala y día (muy ocupada = 3 o más)
- **Avisos**: `aviso: <sala> muy ocupada el <día> (<n> reservas)` · `sin salas muy ocupadas el <día>` · `falta el día` — se muestran al consultar; nada se envía solo
- **Regla ante conflicto**: no aplica — la consulta es de solo lectura y síncrona, en un proceso de un solo hilo: no hay escritura intercalada

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-19 | aprobada por delegación: «apruebo la spec por delegación, nos vemos en la validación» (versión con los hallazgos de las dos rondas) |
