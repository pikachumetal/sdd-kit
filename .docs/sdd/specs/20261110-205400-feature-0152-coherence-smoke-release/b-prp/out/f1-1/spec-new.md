---
id: 20261111-085359-feature-0010-motivo-cancelar
feature: 0010
title: Motivo al cancelar una reserva
mode: full
profile: delegate
status: approved
created: 2026-11-11
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-11
---

# Spec — Motivo al cancelar una reserva

🦆 Hoy `cancelar Norte lun` cancela y ya. Con esto, quien cancela dice por qué, eligiendo de una lista: `cancelar Norte lun sala ocupada` responde `cancelada Norte lun (motivo: sala ocupada)`. Sin motivo, o con uno que no está en la lista, no cancela y recuerda las tres opciones. Un comando nuevo, `canceladas`, lista las reservas canceladas con su motivo: `Norte lun · sala ocupada`. Por dentro, la reserva cancelada guarda su motivo en `src/app.js`.

Validación: dev-lead — es un comando que usa una persona y lo que ve en la terminal.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo de una lista y listar las canceladas con su motivo.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva · tamaño: ~40 líneas en 2 ficheros
- Único (sonnet): si cada THEN de `Cancelar exige un motivo de la lista` y de `La lista de canceladas enseña el motivo` se observa con una salida literal, y si algún literal del Approach falta aquí (señal: capacidad nueva)
- Mínimo razonable: el mismo revisor, sin segunda ronda; no hay segunda lente porque no hay contrato público, `MODIFIED` ni reglas de visibilidad

Delta probado en una copia de `.docs/sdd` antes de la review: `booking-cancellation.md: añadido «Cancelar exige un motivo de la lista»` y `añadido «La lista de canceladas enseña el motivo»`; se repite tras los cambios de la segunda ronda, con el requisito nuevo de `sin reserva`.

1. Enfoque: A (motivo como argumento posicional, lista cerrada en una constante), frente a B (preguntarlo en interactivo) y C (flag `--motivo`) — ver Approach.
2. El motivo es **obligatorio**: «añade un motivo al cancelar» no admite cancelar sin él; el `cancelar <sala> <día>` de hoy deja de cancelar. Los dos tests de `test/cancel.test.js` se reescriben con motivo.
3. Los tres motivos, literal, en minúsculas y con espacios: `cambio de planes`, `sala ocupada`, `otro`. Se escriben sin comillas: lo que sigue a `<sala> <día>` se une con espacios.
4. Mensajes literales: éxito `cancelada Norte lun (motivo: sala ocupada)`; sin motivo `falta el motivo: elige cambio de planes, sala ocupada u otro`; motivo fuera de la lista `motivo no válido: elige cambio de planes, sala ocupada u otro`.
5. El motivo se valida **antes** de buscar la reserva: `cancelar Sur mar` responde que falta el motivo aunque Sur mar no exista; con motivo válido y sin reserva, sigue `sin reserva Sur mar`.
6. La mayúscula cuenta: `Sala ocupada` no es válido.
7. El «listado de canceladas» de la fila 0010 no existe hoy: lo crea esta feature como comando `canceladas` (nombre mío), una línea por reserva `<sala> <día> · <motivo>`, y `sin canceladas` si no hay ninguna. Solo salen las de estado cancelado: las anuladas (`anular`, fila 0011) quedan fuera, sin escenario propio porque hoy solo existe una reserva; por la misma razón no se promete orden entre varias.
8. Capacidad nueva `booking-cancellation` (inglés kebab-case): hoy no hay ninguna capacidad en `capabilities/`. Documenta la cancelación con motivo, incluido `sin reserva`, que ya existía y se recoge como parte de la capacidad nueva.
9. Cancelar una reserva que ya está cancelada responde `sin reserva Norte lun` y conserva el primer motivo (es lo que hace hoy la búsqueda de reservas activas).
12. Sin cambios en `PRODUCT.md`: el término «Cancelación» no cambia.
10. Canal y código de salida: como hoy, todo por stdout y código 0, también los errores de motivo; el cambio de salida de `cancelar` es un cambio de contrato de la herramienta, sin más consumidores que su dueño (mission.md).
11. Casos que quedan fuera, con la salida que da el código sin tocarlos: `cancelar Norte` (falta el día) y argumentos extra en `canceladas` no se tratan; un motivo de solo espacios cuenta como vacío (`falta el motivo`); los espacios sobrantes entre palabras del motivo no se normalizan (`sala  ocupada` es no válido).
- Política de modelos (no es una decisión de producto): un revisor de la spec en `sdd-kit:effort-medium` + `sonnet`, más una segunda ronda con otro por aceptar Críticos · ejes de la revisión final: Spec `opus`+high, Código `sonnet`+high, Arquitectura según el plan · sin otros despachos en paralelo.

### Hallazgos de la review

- **Aceptado** — Crítico: «sigue activa» no se observaba → los THEN de `sin motivo` y `motivo no válido` añaden `AND canceladas responde sin canceladas`.
- **Aceptado** — Crítico: el AND de `Sala ocupada` colgaba sin WHEN ni THEN → escenario propio.
- **Aceptado** — `cancelar Sur mar` sin motivo no tenía escenario → añadido.
- **Aceptado** — orden y exclusión de `canceladas` → se retira la promesa de orden (decisión 7) y el escenario vacío lleva una reserva activa que no sale.
- **Aceptado** — motivo de varias palabras sin escenario → escenario con `cambio de planes`.
- **Aceptado** — cancelar una ya cancelada → decisión 9 y escenario.
- **Aceptado** — qué dice cada test reescrito → filas de «Lo que se retira o cambia de forma».
- **Aceptado** — `sin reserva` presentado como nuevo → decisión 8.
- **Aceptado** — política de modelos mezclada con decisiones de producto → marcada como no de producto.
- **Aceptado** — reservas en memoria sin migración → «No entra».

Segunda ronda:

- **Aceptado** — estado compartido entre escenarios: una sola reserva en memoria → «Dónde se prueba» asigna cada escenario a un fichero de test (proceso propio) y fija el orden; no se toca `src/app.js` para reiniciar estado.
- **Rechazado** — reinicio/siembra como alcance oculto → no hay reinicio: se resuelve con ficheros de test, sin código de producción.
- **Aceptado** — `Sala ocupada` y `cambio de planes` sin comprobar el estado → ANDs con `canceladas`.
- **Rechazado** — `sin reserva` con argumentos sobrantes pasa sin implementar nada → es comportamiento previo que la feature debe conservar (regresión); cubierto por su requisito propio.
- **Aceptado** — casos sin recoger (día ausente, espacios, motivo vacío, argumentos extra) → decisión 11.
- **Aceptado** — canal y código de salida → decisión 10.
- **Aceptado** — forma del dato y criterio del filtro → Approach.
- **Aceptado** — frases de review contradictorias → corregidas.
- **Aceptado** — `sin reserva` bajo un título que no lo describe → requisito propio.
- **Aceptado** — números de línea → la tabla cita por nombre de función o de test.

### Decisiones tomadas con el dev-lead

- Apruebo la spec por delegación — «Apruebo la spec por delegación» (2026-11-11)
- Se para en el commit de la Task 1 — «cuando tengas el commit de la Task 1, para»

## Intent

Hoy se cancela una reserva sin dejar rastro de por qué. Quien cancela debe elegir un motivo de una lista corta y ese motivo debe verse al listar las canceladas. Éxito: ninguna reserva queda cancelada sin motivo, y `canceladas` muestra el de cada una. Fracaso aunque funcione: aceptar un motivo escrito a mano que no esté en la lista, o cancelar a pesar de un motivo inválido.

## Scope

- Entra: motivo obligatorio y de lista cerrada al cancelar; comando `canceladas` con el motivo.
- No entra: pedir motivo al anular (fila 0011); guardar quién o cuándo canceló; motivos configurables; persistencia y migración (las reservas viven en memoria, no hay canceladas anteriores).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Forma `cancelar <sala> <día>` (pasa a `cancelar <sala> <día> <motivo>`) | `src/app.js`: `cancelBooking` y la rama `cancelar` de `run` | Scope, decisión 2 |
| Salida `cancelada <sala> <día>` | `src/app.js`: `cancelBooking`; test `cancelar una reserva activa` (el test pasa a esperar `cancelada Norte lun (motivo: …)`) | delta `ADDED`, decisión 4 |
| `sin reserva <sala> <día>` sin motivo | test `cancelar sin reserva lo dice` (el test pasa a `cancelar Sur mar otro`) | decisión 5 |

- Filas que implementa: 0010 → fila 0010 de `roadmap.md` (la fila pasa a hecha al cerrar; ningún otro fichero la nombra) · comprobado con `git grep -nE "0010|motivo"`

## Approach

- A. Motivo como tercer argumento posicional, lista cerrada en una constante de `src/app.js` — cuesta cambiar la forma del comando; es lo que ya hace `run` con `sala` y `día`.
- B. Preguntarlo en interactivo — descartado: la herramienta es de un solo disparo (`node src/app.js <comando> …`) y no lee la entrada estándar.
- C. Flag `--motivo` — descartado: es un argumento obligatorio, no una opción, y `run` solo usa flags para `--cada-semana`.
- Elegido: A, por ser lo más pequeño que encaja con el patrón de `run`.

Una reserva cancelada guarda `reason`; la activa no lo tiene. `cancelledBookings()` filtra por `status === 'cancelled'`, no por tener motivo.

`cancelBooking(room, day, reason)`: valida `reason` contra `CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro']`, guarda `booking.reason`. Nueva `cancelledBookings()` y rama `canceladas` en `run`.

## Dónde se prueba

- Cancelar con motivo, sin motivo y con motivo inválido: por `run('cancelar', [...])`, como `test/cancel.test.js` actual.
- Listar canceladas: por `run('canceladas', [])`, en un fichero de test propio.
- Hay una sola reserva en memoria (`Norte lun`) y cancelarla con éxito es irreversible dentro de un proceso: cada fichero de test es un proceso, los escenarios que la dejan activa van antes del que la cancela, y los de `sala ocupada` y `cambio de planes` van en ficheros distintos.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar exige un motivo de la lista

- GIVEN la reserva `Norte lun` está activa
- WHEN se ejecuta `cancelar Norte lun sala ocupada`
- THEN responde `cancelada Norte lun (motivo: sala ocupada)` y la reserva queda cancelada con ese motivo

- GIVEN la reserva `Norte lun` está activa
- WHEN se ejecuta `cancelar Norte lun cambio de planes`
- THEN responde `cancelada Norte lun (motivo: cambio de planes)`
- AND `canceladas` responde `Norte lun · cambio de planes`

- GIVEN la reserva `Norte lun` está activa
- WHEN se ejecuta `cancelar Norte lun`
- THEN responde `falta el motivo: elige cambio de planes, sala ocupada u otro`
- AND `canceladas` responde `sin canceladas`

- GIVEN la reserva `Norte lun` está activa
- WHEN se ejecuta `cancelar Norte lun porque sí`
- THEN responde `motivo no válido: elige cambio de planes, sala ocupada u otro`
- AND `canceladas` responde `sin canceladas`

- GIVEN la reserva `Norte lun` está activa
- WHEN se ejecuta `cancelar Norte lun Sala ocupada`
- THEN responde `motivo no válido: elige cambio de planes, sala ocupada u otro`
- AND `canceladas` responde `sin canceladas`

- GIVEN no existe reserva `Sur mar`
- WHEN se ejecuta `cancelar Sur mar`
- THEN responde `falta el motivo: elige cambio de planes, sala ocupada u otro`

#### ADDED — Cancelar una reserva inexistente o ya cancelada responde sin reserva

- GIVEN no existe reserva `Sur mar`
- WHEN se ejecuta `cancelar Sur mar otro`
- THEN responde `sin reserva Sur mar`

- GIVEN `Norte lun` cancelada con `sala ocupada`
- WHEN se ejecuta `cancelar Norte lun otro`
- THEN responde `sin reserva Norte lun`
- AND `canceladas` sigue mostrando `Norte lun · sala ocupada`

#### ADDED — La lista de canceladas enseña el motivo

- GIVEN `Norte lun` cancelada con `sala ocupada`
- WHEN se ejecuta `canceladas`
- THEN responde `Norte lun · sala ocupada`

- GIVEN `Norte lun` activa y ninguna reserva cancelada
- WHEN se ejecuta `canceladas`
- THEN responde `sin canceladas`

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-11 | aprobada: «Apruebo la spec por delegación» |
