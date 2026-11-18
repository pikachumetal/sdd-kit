---
id: 20261118-224552-feature-0012-aviso-sala-ocupada
feature: 0012
title: Aviso de sala muy ocupada
mode: full
profile: delegate
status: approved
created: 2026-11-18
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-18
---

# Spec — Aviso de sala muy ocupada

🦆 Hoy no hay forma de saber de un vistazo qué sala está saturada un día. Con esta feature, `node src/app.js ocupacion lun` responde `aviso: Norte muy ocupada el lun (4 reservas)` para cada sala con 4 reservas activas o más ese día, y `ninguna sala muy ocupada el lun` si no hay ninguna. El resto de comandos no cambia. Por dentro, una función pura cuenta las reservas activas por sala y día y el comando solo da formato al resultado.

Validación: dev-lead — el aviso lo lee una persona en la terminal y el umbral y el texto son decisiones suyas.

## Capacidades

- Nuevas: `room-occupancy` — cuándo una sala cuenta como muy ocupada un día y cómo se avisa.
- Modificadas: ninguna.
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva (`room-occupancy`) · tamaño: ~45 líneas en 5 ficheros (`src/app.js`, un test, la capacidad, `README.md`, `ROADMAP.md`)
- Dominio (sonnet, los siete puntos): si los escenarios con datos de «Las reservas canceladas o anuladas no cuentan» y del umbral de 4 pasarían sin el comportamiento (señal: capacidad nueva)
- Mínimo razonable: ninguna revisión — deja sin mirar si los escenarios con datos pasarían sin el comportamiento

1. **Umbral: pendiente.** «Muy ocupada» = 4 o más reservas activas de la sala en un mismo día. El 4 lo he puesto yo; nadie lo dijo. Es lo primero que debes validar. Con 1 reserva en los datos de ejemplo y dos salas, cualquier número entre 2 y 5 es defendible.
2. **Qué se cuenta: pendiente.** Reservas activas por sala y día; las canceladas y las anuladas no cuentan. No mido horas ocupadas porque la franja es texto libre (`10:00-12:00`) y la deuda técnica ya anota que no se valida (`debt.md`, «Sin validación del formato de franja horaria»).
3. **Dónde sale el aviso: pendiente.** Un comando nuevo, `ocupacion <día>`. No toco `libres` ni `reservar`. Descartado: avisar al reservar, porque `reservar` hoy no crea reservas (solo contesta `reserva semanal creada` con `--cada-semana`), así que no hay momento real en que avisar.
4. **Textos literales:** `aviso: <sala> muy ocupada el <día> (<n> reservas)` por cada sala sobre el umbral, en el orden de `rooms` (Norte, Sur); `ninguna sala muy ocupada el <día>` si no hay ninguna; `uso: ocupacion <día>` si falta el día. «Reservas» siempre en plural, también con n = 4 o más, que es el único caso en que sale.
5. **Capacidad nueva `room-occupancy`**, en inglés kebab-case. La crea esta spec; la fusión la escribe al cerrar.
6. **Enfoque: A, frente a B y C (ver Approach).**
7. **`§Frontend`: no aplica**, es una terminal.
8. **Día desconocido: fuera de alcance.** `ocupacion xyz` responde `ninguna sala muy ocupada el xyz`, como `cancelar Sur mar` ya acepta cualquier día sin validarlo. Validar el día es decisión tuya: pendiente.
9. **Plural:** «reservas» vale mientras el umbral sea 2 o más; con el umbral en 4 siempre es plural.
10. **Estados de reserva:** `active`, `cancelled` y `voided`, los que ya escriben `cancelBooking` y `voidBooking` en `src/app.js`; no se inventa ninguno.
11. **`ROADMAP.md`:** añado la fila 0012 al arrancar la implementación; entra en el Scope.
12. **Sin plan ni división:** prevé 2 tasks sobre la misma superficie, sin migración; no se parte.
- Política de modelos: un revisor de la spec en sonnet · revisión final con los ejes que fije el plan (Spec opus+high, Código sonnet+high) · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- Aprobación de la spec por delegación, con la revisión decidida por el agente sin preguntar — «apruebo la spec por delegación, nos vemos en la validación» (2026-11-18)
- Perfil `delegate` — del proyecto (`sdd-kit.json`); sin `sdd-kit.local.json`.

### Hallazgos de la review

Pasada de coherencia: delta probado en una copia de `.docs/sdd` con `sdd capability merge`: 4 requisitos y las 5 reglas de `room-occupancy` añadidos, sin rechazos.

- **Aceptado** — Crítico: el escenario de canceladas/anuladas pasaba contando un solo estado → dos escenarios, 3 activas + 1 cancelada y 3 activas + 1 anulada.
- **Aceptado** — sala sin reservas → AND en el primer escenario: Sur con 0 reservas no genera línea.
- **Aceptado** — día desconocido → decisión 8 y «No entra».
- **Aceptado** — estados de reserva sin citar → decisión 10.
- **Aceptado** — plural atado al umbral → decisión 9.
- **Aceptado** — `ROADMAP.md` fuera del Scope → decisión 11 y Scope.
- **Aceptado** — retorno de `busyRooms` sin declarar → devuelve `[{ room, count }]`, en Scope y Approach.
- **Rechazado** — «pendiente» contradice `approved`: con la spec aprobada por delegación, lo del dev-lead va a ✋ marcado «pendiente» por regla; el estado `approved` es la aprobación delegada, no la validación de esos valores.
- **Rechazado** — la revisión ya decidida y los hallazgos ya rellenos: este bloque los recoge.
- **Segunda ronda** (un revisor, sonnet; sin tercera): **Aceptado** — filtro por día en ambos sentidos, argumentos de más, orden de `rooms` como regla ante conflicto, `run` con lista inyectable para probar el `aviso:` de extremo a extremo, cuenta de ficheros (5). **Rechazado** — el umbral reabre la spec: ya está dicho que es pendiente, y cambiarlo es una enmienda; el día desconocido sin escenario: es la decisión 8, no un comportamiento que quiera fijar; renombrar por términos: los identificadores siguen el código existente.
- **Rechazado** — nombres en inglés: el slug de capacidad va en inglés por regla del kit y los identificadores siguen el código existente (`freeRooms`, `cancelBooking`).

## Intent

Hoy, para saber si una sala está saturada un día hay que contar a mano las reservas. Quiero un aviso que lo diga. Éxito: dado un día, un comando dice qué salas pasan del umbral y cuántas reservas tienen, sin tocar nada más. Anti-objetivos (lo que lo haría fracasar aunque funcione): que cuente reservas canceladas o anuladas y avise de una sala que en realidad tiene hueco; que cambie la salida de `libres`, `cancelar` o `anular`.

## Scope

- Entra: función pura `busyRooms(day, list)` en `src/app.js` que devuelve `[{ room, count }]` de las salas con 4 o más reservas activas ese día; comando `ocupacion <día>`; tests; la capacidad `room-occupancy`; una línea en `README.md` con el comando nuevo; la fila 0012 en `ROADMAP.md`.
- No entra: validar el día; umbral configurable; avisar al reservar; contar horas o franjas; avisos por correo (fila 0008); cambiar `libres`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada se retira ni cambia de forma | `git grep -niE "ocupad\|ocupaci"` fuera de `specs/`: sin resultados | no aplica |

- Filas que implementa: 0012 (no tiene fila en `ROADMAP.md`; se añade al arrancar la implementación, ver Scope) → ningún fichero la nombra | comprobado con `git grep -n "0012"`.

## Approach

- A. Función pura `busyRooms(day, list = bookings)` + comando `ocupacion <día>` — una función que se prueba sola con listas de reservas inventadas, sin tocar el estado global; el comando es una línea de formato. Cuesta un comando más en la interfaz.
- B. Añadir el aviso a la salida de `libres` — no añade comando, pero cambia una salida que hoy es `Sur`, y `libres` recibe una franja, no un día: mezclaría dos preguntas distintas.
- C. Avisar al reservar — es lo que sugiere «avisa», pero `reservar` no crea reservas hoy: no hay estado que contar ni momento que avisar.
- Elegido: A — es lo único que se puede probar con datos y no toca salidas que ya existen.

Partes del cómo: `busyRooms` devuelve `[{ room, count }]`; el comando da formato a ese resultado. El umbral es una constante `MAX_RESERVAS_DIA = 4` en `src/app.js`. `busyRooms` recorre `rooms` y cuenta `status === 'active'` por sala y día, en el orden de `rooms`. Sin dependencias nuevas (`architecture.md`).

## Dónde se prueba

- Umbral y estados: `busyRooms` con listas inventadas, en `test/ocupacion.test.js`, con el mismo patrón que `test/cancel.test.js` (`node --test`).
- Textos del comando: `run('ocupacion', ['lun'], list)` en el mismo fichero: `run` recibe la lista de reservas como tercer parámetro opcional (por defecto, la del módulo), así el aviso se prueba de extremo a extremo con 4 reservas inventadas; con los datos del módulo (1 reserva activa de Norte el lun) responde `ninguna sala muy ocupada el lun`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-occupancy`

#### ADDED — Una sala con 4 reservas activas o más en un día está muy ocupada

- GIVEN Norte con 4 reservas activas el lun y Sur con 1
- WHEN `ocupacion lun`
- THEN sale `aviso: Norte muy ocupada el lun (4 reservas)` y ninguna línea de Sur
- AND Sur, con 0 reservas ese día, no genera línea
- AND con Norte con 3 reservas activas el lun sale `ninguna sala muy ocupada el lun`
- AND con Norte y Sur con 5 y 4 reservas activas el lun salen dos líneas, `aviso: Norte muy ocupada el lun (5 reservas)` y `aviso: Sur muy ocupada el lun (4 reservas)`, en ese orden

#### ADDED — Las reservas canceladas o anuladas no cuentan

- GIVEN Norte con 3 reservas activas y 1 cancelada el lun
- WHEN `ocupacion lun`
- THEN sale `ninguna sala muy ocupada el lun`
- AND con 3 reservas activas y 1 anulada el lun sale lo mismo

#### ADDED — Cada día se cuenta por separado

- GIVEN Norte con 2 reservas activas el lun y 2 el mar
- WHEN `ocupacion lun`
- THEN sale `ninguna sala muy ocupada el lun`
- AND `ocupacion mar` da `ninguna sala muy ocupada el mar`
- AND con Norte con 4 reservas activas el mar y 0 el lun, `ocupacion mar` avisa y `ocupacion lun` no

#### ADDED — Sin día no hay respuesta

- GIVEN cualquier estado
- WHEN `ocupacion` sin día
- THEN sale `uso: ocupacion <día>`
- AND los argumentos de más se ignoran: `ocupacion lun mar` responde como `ocupacion lun`

#### Reglas de la capacidad — room-occupancy

- **Dónde viven los datos**: en memoria, con las reservas de `src/app.js` (`operations.md`: sin base de datos)
- **Idioma de los nombres**: castellano en los textos y en el comando; `busyRooms` y `MAX_RESERVAS_DIA` son nombres internos
- **Límites**: muy ocupada = 4 reservas activas o más de la sala en el día
- **Avisos**: `aviso: <sala> muy ocupada el <día> (<n> reservas)` · `ninguna sala muy ocupada el <día>` · `uso: ocupacion <día>`
- **Regla ante conflicto**: con varias salas sobre el umbral, una línea por sala en el orden de `rooms` (Norte, Sur)

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-18 | aprobada por delegación: «apruebo la spec por delegación, nos vemos en la validación» |
