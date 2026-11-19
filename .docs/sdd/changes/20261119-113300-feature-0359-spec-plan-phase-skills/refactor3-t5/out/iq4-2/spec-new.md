---
id: 20261119-165435-feature-0012-aviso-sala-ocupada
feature: 0012
title: Aviso cuando una sala está muy ocupada
mode: full
profile: delegate
status: approved
created: 2026-11-19
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Aviso cuando una sala está muy ocupada

🦆 Hoy no hay forma de saber de un vistazo si una sala está saturada un día. Con esto, `node src/app.js ocupacion Norte lun` dice cuántas reservas activas tiene Norte el lunes y, si llegan a 3, añade `⚠ Norte muy ocupada el lun`. Por dentro: una función que cuenta las reservas activas de una sala y un día, y un comando nuevo que la usa.

Validación: dev-lead — es salida de la terminal que lee una persona, y el tope y el texto del aviso son suyos.

## Capacidades

- Nuevas: `room-occupancy` — cuántas reservas activas tiene una sala un día y cuándo se considera «muy ocupada».

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (sonnet) — señales: capacidad nueva (`room-occupancy`) · tamaño: ~50 líneas en 2 ficheros (`src/app.js`, un test)
- Revisor único (sonnet): si el aviso con el tope exacto (3) y con 4 se distingue de contar sin filtrar por sala o día, y si cada valor decidido por mí está en este apartado (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar que los escenarios pasen sin el comportamiento (p. ej. contar todas las activas sin filtrar)

Delta probado sobre una copia de `.docs/sdd`: `capability merge` sale con 0 (6 requisitos añadidos y 5 reglas); `capabilities/` del repo sin tocar.

1. Enfoque: comando nuevo `ocupacion`, a demanda, frente a avisar al reservar o dentro de `libres` (ver Approach) — pendiente de que lo confirmes.
2. «Muy ocupada» = **3 o más** reservas activas de la sala ese día — pendiente: nadie dio el tope; las franjas son texto libre (`10:00-12:00`) y no hay horario de la sala, así que no se puede medir en horas ni en porcentaje.
3. Solo cuentan las reservas con estado `active`; las canceladas y las anuladas no — pendiente: coherente con `libres` y `findBooking`, que ya las ignoran.
4. Sintaxis: `ocupacion <sala> <día>` — pendiente: calcado de `cancelar <sala> <día>` y `anular <sala> <día>`.
5. Textos, pendientes: `Norte lun: 2 reservas` (con 1: `1 reserva`; con 0: `0 reservas`); con el aviso, una segunda línea `⚠ Norte muy ocupada el lun`.
6. Sala que no existe: `sala desconocida: Oeste` — pendiente: el código hoy no valida salas en `cancelar`; lo propongo solo aquí porque un 0 para una sala inventada engañaría.
7. Nombre de la capacidad: `room-occupancy` (kebab-case en inglés, por regla; el contenido va en castellano).
8. Política de modelos: sin revisores de la spec propios del producto aparte de los del kit · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`.
9. Carpeta en `.docs/sdd/changes/` (convención del kit 3.0.0); el proyecto aún conserva sus carpetas antiguas en `.docs/sdd/specs/`, que no se tocan.
10. Detalles técnicos que fijo yo: función exportada `occupancy(room, day)` que devuelve el número; constante `BUSY_THRESHOLD = 3`; tests en `test/occupancy.test.js`; toda la salida por stdout con código de salida 0, también en «sala desconocida» y «uso» (como `cancelar` con «sin reserva»).
11. Uso incorrecto: `uso: ocupacion <sala> <día>`; sala con otra capitalización = desconocida; día inexistente = 0 reservas, sin validar — pendiente, por coherencia con `cancelar`.
12. El carácter `⚠` va literal en el aviso; si tu terminal no lo pinta, dilo y lo cambiamos por `AVISO:` — pendiente.
13. `ocupacion` no comparte la tolerancia de `cancelar` ante salas inventadas (valida la sala); asumo esa diferencia y no toco `cancelar` (candidata a deuda).

### Hallazgos de la review

Un revisor (sonnet, ambas lentes: alcance pequeño, sin contrato público ni `MODIFIED`; mínimo razonable: el mismo).

- **Aceptado** — falta regla ante conflicto → añadida a Reglas (solo activas de esa sala y día, comparación literal).
- **Aceptado** — los escenarios pasaban sin filtrar por sala ni día → el escenario 1 incluye Sur lun y Norte mar.
- **Aceptado** — pluralización decidida pero sin requisito → escenario «Singular y cero».
- **Aceptado** — solo se probaba 3 exacto → el aviso incluye el caso de 4.
- **Aceptado** — lista de salas sin dueño → reutiliza `rooms`; declarado en Reglas.
- **Aceptado** — entradas inválidas sin definir → requisito «Uso incorrecto» y decisión 11.
- **Aceptado** — decisiones técnicas fuera del ✋ → decisión 10.
- **Aceptado** — idiomas sin declarar → regla «Idioma de los nombres» reescrita.
- **Aceptado** — `⚠` y asimetría con `cancelar` → decisiones 12 y 13.
- **Rechazado** — «dev-lead» no existe en un proyecto de una sola persona → en este kit «dev-lead» es el rol del propio usuario; los pendientes los valida él en la validación, que la spec ya fija.

### Decisiones tomadas con el dev-lead

- La spec se aprueba por delegación — «apruebo la spec por delegación, nos vemos en la validación»
- Perfil `delegate` — «Perfil delegate»
- Los puntos «pendiente» se validan en la validación, no antes — «nos vemos en la validación»

## Intent

Hoy, para saber si una sala está saturada un día hay que mirar las reservas una a una; `libres` solo dice qué salas quedan libres en una franja. Interesa saberlo a tiempo para repartir reuniones entre Norte y Sur. Éxito: `ocupacion Norte lun` da el recuento y el aviso con el tope exacto (con 2 reservas no avisa, con 3 sí). Anti-goal: un aviso que salte por reservas ya canceladas o anuladas, o que no salte con el tope cumplido.

## Scope

- Entra: comando `ocupacion <sala> <día>` con recuento, aviso, validación de sala (contra `rooms`) y mensaje de uso; función exportada para contarlo.
- No entra: avisar al reservar (`reservar` es hoy un esbozo semanal); avisos por correo (roadmap 0008); cambiar `libres`; tope configurable; medir por horas.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada | — | — |

- Filas que implementa: 0012 no tiene fila en el roadmap → nada que actualizar: comprobado con `grep -rniE "ocupad|ocupaci" ROADMAP.md PRODUCT.md README.md .docs src test` (sin resultados).

## Approach

- A. Comando nuevo `ocupacion <sala> <día>`, a demanda — una función pura `occupancy(room, day)` en `src/app.js` y una rama en `run`; se prueba sola. Cuesta que hay que preguntar.
- B. Avisar al reservar — es donde más «avisa» se siente, pero `reservar` es hoy un esbozo que no crea reservas: habría que construirlo antes.
- C. Añadirlo a la salida de `libres` — `libres` recibe solo la franja, sin día: no se puede contar por día sin cambiar su forma.
- Elegido: A — es el único que se apoya en lo que ya existe sin rehacerlo; B queda para cuando `reservar` sea real (candidata a fila propia).

Cómo: `occupancy(room, day)` cuenta `bookings` con `room`, `day` y `status === 'active'`; `run('ocupacion', [sala, día])` formatea. El tope es una constante `BUSY_THRESHOLD = 3`.

## Dónde se prueba

- Recuento solo con activas y aviso en el tope: unitario en `test/occupancy.test.js`, por `run`, como `test/cancel.test.js`.
- Sala desconocida y pluralización: mismo fichero.

## Términos y ADR

- Términos resueltos: ninguno (en el glosario de `PRODUCT.md` no hay «ocupación»; «sala» y «reserva» se usan como ahí)
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-occupancy`

#### ADDED — Recuento de reservas activas por sala y día

- GIVEN Norte tiene 2 reservas activas el lun y 1 cancelada; Sur tiene 1 activa el lun; Norte tiene 1 activa el mar
- WHEN se ejecuta `ocupacion Norte lun`
- THEN la salida es `Norte lun: 2 reservas` (no cuentan Sur ni el mar)
- AND no hay línea de aviso

#### ADDED — Singular y cero

- GIVEN Sur tiene 1 reserva activa el mar y Norte ninguna el mié
- WHEN se ejecuta `ocupacion Sur mar` y `ocupacion Norte mié`
- THEN las salidas son `Sur mar: 1 reserva` y `Norte mié: 0 reservas`

#### ADDED — Aviso de sala muy ocupada

- GIVEN Norte tiene 3 reservas activas el lun
- WHEN se ejecuta `ocupacion Norte lun`
- THEN la salida es `Norte lun: 3 reservas` y, en la línea siguiente, `⚠ Norte muy ocupada el lun`
- AND con 4 reservas activas avisa igual: `Norte lun: 4 reservas` y `⚠ Norte muy ocupada el lun`

#### ADDED — Las reservas anuladas y canceladas no cuentan

- GIVEN Norte tiene 2 activas, 1 cancelada y 1 anulada el lun
- WHEN se ejecuta `ocupacion Norte lun`
- THEN la salida es `Norte lun: 2 reservas` sin aviso

#### ADDED — Sala desconocida

- GIVEN las salas son Norte y Sur
- WHEN se ejecuta `ocupacion Oeste lun`
- THEN la salida es `sala desconocida: Oeste`
- AND `ocupacion norte lun` (otra capitalización) también es `sala desconocida: norte`

#### ADDED — Uso incorrecto

- GIVEN cualquier estado
- WHEN se ejecuta `ocupacion Norte` (falta el día) o `ocupacion` sin argumentos
- THEN la salida es `uso: ocupacion <sala> <día>`

#### Reglas de la capacidad — room-occupancy

- **Límites**: muy ocupada = 3 o más reservas activas de la sala en el día
- **Avisos**: `⚠ <sala> muy ocupada el <día>`
- **Dónde viven los datos**: las reservas, en memoria (`bookings`), y la lista de salas en la constante `rooms` que ya existe en `src/app.js`; no se crea ninguna lista nueva
- **Idioma de los nombres**: la interfaz y el comando, en castellano y sin tilde en el comando (como `cancelar`, `anular`); los identificadores del código, en inglés, como los actuales (`rooms`, `bookings`)
- **Regla ante conflicto**: solo cuentan las reservas `active` de esa sala y ese día; sala y día se comparan tal cual, sin normalizar mayúsculas ni formas (`lunes` ≠ `lun`); un día que no existe no se valida y da 0 reservas, igual que `cancelar`

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture (por delegación) | 2026-11-19 | aprobada: «apruebo la spec por delegación, nos vemos en la validación» |
