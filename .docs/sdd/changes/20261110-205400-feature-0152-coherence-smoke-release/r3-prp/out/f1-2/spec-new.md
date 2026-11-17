---
id: 20261111-201731-feature-0010-motivo-cancelar
feature: 0010
title: Motivo al cancelar una reserva
mode: full
status: approved
created: 2026-11-11
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-11
---

# Spec — Motivo al cancelar una reserva

🦆 Hasta ahora `cancelar Norte lun` cancela la reserva sin más. Después: `cancelar Norte lun --motivo sala-ocupada` la cancela y responde `cancelada Norte lun (motivo: sala ocupada)`; sin motivo, o con uno que no está en la lista, no cancela nada y dice cuáles valen. Además, un comando nuevo `canceladas` enseña cada cancelación con su motivo: `Norte lun 10:00-12:00 · sala ocupada`. Por dentro, la reserva guarda la clave del motivo y el listado la traduce a su texto.

Validación: dev-lead — es una salida de terminal que usa una persona: el texto exacto de los mensajes lo ve ella.

## Capacidades

- Nuevas: `reservation-cancellation` — cancelar una reserva con motivo y listar las canceladas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: contrato público (cambia la firma del comando `cancelar`: ahora exige `--motivo`), capacidad nueva (`reservation-cancellation`) · tamaño: ~40 líneas de código y ~80 de tests en 3 ficheros
- Dominio (sonnet): si la lista cerrada (`cambio-de-planes`, `sala-ocupada`, `otro`) y la regla «sin motivo no se cancela» respetan los términos de `PRODUCT.md` (cancelación ≠ anulación) y si el listado deja fuera las anuladas (señal: capacidad nueva)
- Técnica (sonnet): si validar el motivo antes de buscar la reserva deja la reserva activa ante un error, y si `canceladas` se puede probar con `run()` sin depender del orden de los tests (señal: contrato público)
- Mínimo razonable: un solo revisor técnico — deja sin mirar si el vocabulario del listado contradice la terminología del producto

1. **Enfoque: A frente a B y C (ver Approach).**
2. **Capacidad nueva `reservation-cancellation`** (slug en inglés kebab-case): el proyecto no tiene `capabilities/` todavía; esta spec abre la primera, con el comportamiento de cancelar y de listar canceladas.
3. **Sintaxis: `cancelar <sala> <día> --motivo <clave>`**, con las claves `cambio-de-planes`, `sala-ocupada`, `otro`. Claves sin espacios para no depender de las comillas del terminal.
4. **El motivo es obligatorio.** El roadmap dice «se elige un motivo de una lista»; interpreto que no se puede cancelar sin elegir. Consecuencia: `cancelar Norte lun` a secas, que hoy funciona, deja de funcionar (los dos tests de `cancelar` cambian).
5. **Un único mensaje de error** para motivo ausente, sin valor o fuera de lista: `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`. La reserva no se toca.
6. **Orden de validación: primero el motivo, luego la reserva.** `cancelar Sur mar` sin motivo da el error del motivo, no `sin reserva Sur mar`.
7. **Texto de éxito**: `cancelada Norte lun (motivo: sala ocupada)` — el texto legible de la clave, con espacios, entre paréntesis. Textos: `cambio de planes`, `sala ocupada`, `otro`.
8. **El roadmap habla de «el listado de canceladas», pero no existe ningún listado en el código.** Añado el comando `canceladas` (sin argumentos; los que sobren se ignoran) para poder cumplirlo. Una línea por cancelación: `<sala> <día> <franja> · <texto del motivo>`; sin ninguna, `sin canceladas`. Si prefieres que el motivo salga en otro sitio, es la decisión a cambiar.
9. **Las anuladas (`anular`) no llevan motivo ni salen en `canceladas`**: son otro término del producto (Anulación). Hoy `anular` marca la reserva `voided` y `cancelar` la marca `cancelled`; ese reparto de estados no cambia.
10. **Dónde viven los datos**: el motivo se guarda como clave en la propia reserva (campo `reason`), en memoria, como el resto.
11. **Lectura de `--motivo`**: se toma el valor que sigue al primer `--motivo` de los parámetros; si se repite, vale el primero; las claves son exactas, solo minúsculas (`Otro` no vale); `--motivo` al final, sin valor, es motivo no válido.
12. **El límite de 24 h de la Cancelación** (`PRODUCT.md`) **no se implementa aquí**: no lo está hoy y no entra. La capacidad se llama «cancelación» pero ni impone ese límite ni distingue quién cancela, como pide la definición de `PRODUCT.md`: es una divergencia conocida y una deuda explícita, sin fila de roadmap hasta que lo decidas.
13. **Orden de `canceladas` sin observar**: sale en el orden interno de las reservas. Hoy solo hay una reserva sembrada y `reservar` no crea ninguna, así que ningún test puede fijar un orden con dos canceladas; lo declaro en vez de inventar una prueba.
14. **`README.md` y `operations.md` no se tocan**: no documentan comandos.
Comprobación del repaso de coherencia (no es una decisión): `sdd capability merge` sobre una copia de `.docs/sdd` sin errores, y `git grep` de `cancelBooking`, `cancelada`, `cancelar` y `0010` fuera de la carpeta de la feature solo da `src/app.js`, `test/cancel.test.js` y la fila de `ROADMAP.md`.
- Política de modelos: revisores de la spec: dominio y técnico, ambos `sonnet` (`sdd-kit:effort-medium`), más una segunda ronda de un revisor `sonnet` · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no (ver plan) · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` (3).

### Hallazgos de la review

- **Aceptado** — Crítico (dominio): el Intent hablaba de «quien gestiona las salas», que en `PRODUCT.md` anula, no cancela → Intent reescrito: cancela el cliente, el responsable lee el listado; añadida la decisión 12 sobre las 24 h.
- **Aceptado** — Crítico (técnica): los escenarios de `libres` presuponían un estado inicial sin declarar → el delta abre con el estado inicial completo y cada GIVEN lo cita.
- **Aceptado** — `--motivo` sin valor, repetido, mayúsculas → decisión 11, escenario y regla «Límites».
- **Aceptado** — cancelar dos veces → escenario nuevo (`sin reserva Norte lun`).
- **Aceptado** — traducción de `cambio-de-planes` y `otro` sin cubrir → dos escenarios nuevos de éxito y uno de listado.
- **Aceptado** — estado de `anular` no declarado → decisión 9 (`voided` frente a `cancelled`) y «anular sigue igual» en el Scope.
- **Aceptado** — avisos, idioma de identificadores, franja en el GIVEN de la anulada, fila de ayuda/README, recuento de 3 requisitos → reglas y tabla corregidas.
- **Aceptado** — «Regla ante conflicto: no aplica» → regla escrita (`anular` y `cancelar` no se pisan; cancelar una no activa da `sin reserva`).
- **Aceptado** (2.ª ronda) — slug con «booking», término a evitar → capacidad renombrada `reservation-cancellation`.
- **Aceptado** (2.ª ronda) — reglas sin escenario (`--motivo` repetido, `Otro`, error de motivo antes de `sin reserva`, argumentos de sobra en `canceladas`), `cancelar` sobre una anulada → escenarios nuevos; regla de conflicto recortada a lo que se prueba.
- **Aceptado** (2.ª ronda) — Intent atribuía roles que la CLI no distingue; decisión 14 mezclaba verificación; «dónde se prueba» sin `anular` ni cómo se prepara cada GIVEN; test de la decisión 4 → corregidos.
- **Rechazado** (2.ª ronda) — «la aprobación es solo una parada»: la frase del dev-lead es «Apruebo la spec por delegación», que aprueba el contenido; se registra tras plegar las dos rondas.
- **Rechazado** — escenario de orden con dos canceladas y una activa → no se puede sembrar (decisión 13); la exclusión de activas queda cubierta por el escenario de `canceladas` sin cancelaciones.

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación — «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» (2026-11-11)
- Parar tras el commit de la Task 1 — «cuando tengas el commit de la Task 1, para.»
- Motivos de la lista — «de una lista: cambio de planes, sala ocupada, otro».

## Intent

Hoy `cancelar` no deja rastro de por qué se canceló. Quien cancela una reserva elige un motivo —cambio de planes, sala ocupada u otro— y `canceladas` lo enseña después. El comando no distingue quién cancela ni quién lista: cualquiera puede. Éxito: toda cancelación nueva lleva uno de los tres motivos y `canceladas` lo muestra; fracaso, aunque «funcione»: que se pueda cancelar sin motivo, o que un error de motivo deje la reserva cancelada.

## Scope

- Entra: `cancelar <sala> <día> --motivo <clave>` con validación; guardar el motivo en la reserva; comando `canceladas`.
- No entra: distinguir roles (cliente o responsable) al cancelar o listar; motivo en `anular`, que sigue igual; el límite de 24 h de la cancelación (no está implementado hoy); un texto libre para «otro»; persistencia más allá de la memoria; ordenar o filtrar `canceladas`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js` (`cancelBooking`, `run`), `test/cancel.test.js` (los dos tests) | Decisión 4 · delta `ADDED` de `reservation-cancellation` (no hay capacidad vigente que modificar) · Task 1 reescribe ambos tests con `--motivo` |
| Salida `cancelada <sala> <día>` | `src/app.js` (`cancelBooking`), `test/cancel.test.js` | Decisión 7 · delta · Task 1 |
| Comando nuevo `canceladas` en el despachador `run` | `src/app.js` (`run`) | Decisión 8 · delta · Task 2 |
| Ayuda o documentación de comandos | ninguna: `README.md` solo tiene el título y `operations.md` solo `node src/app.js <comando> <argumentos>` | decisión 14: sin cambio |

- Filas que implementa: 0010 → ficheros que la nombran: ninguno fuera de `ROADMAP.md` (su estado pasa a 🔄 al abrir y a ✅ al cerrar) | comprobado con `git grep -n "0010"`.

## Approach

- **A. Motivo como argumento `--motivo <clave>` con lista cerrada y validación en `cancelBooking`** — cambio mínimo en la función existente; un comando nuevo `canceladas`. Cuesta: rompe `cancelar` sin motivo.
- B. Motivo como tercer argumento posicional (`cancelar Norte lun sala-ocupada`) — más corto, pero una clave mal escrita se confunde con otros argumentos y no es autoexplicativo.
- C. Preguntar el motivo de forma interactiva — no se puede probar con `run()` y el proyecto no tiene entrada interactiva.
- Elegido: A — es lo más pequeño que cumple «de una lista», se prueba por `run()` como los tests actuales y el nombre del parámetro documenta el uso.

Parte del cómo que fija A: `src/app.js` define la tabla de motivos `{ 'cambio-de-planes': 'cambio de planes', 'sala-ocupada': 'sala ocupada', otro: 'otro' }`; `cancelBooking(room, day, reasonKey)` valida la clave antes de buscar la reserva y guarda `reason` en ella; `run` extrae el valor tras `--motivo` de `params` (decisión 11); `listCancelled()` devuelve las reservas con `status === 'cancelled'`.

## Dónde se prueba

- Cancelar con motivo, sin motivo, motivo fuera de lista, motivo sin valor y sin reserva: por `run('cancelar', …)`, como `test/cancel.test.js`; que la reserva sigue activa o queda cancelada, con `run('libres', ['10:00-12:00'])`.
- Listado `canceladas`: por `run('canceladas', [])`, en un fichero de tests propio (`test/canceladas.test.js`); su GIVEN «anulada» se prepara con `run('anular', …)` en el mismo test.
- `cancelar` sobre una reserva ya cancelada o anulada: en `test/cancel.test.js`; el GIVEN se prepara con dos llamadas a `run` en el mismo test, sobre su importación limpia.
- Como las reservas viven en memoria y solo hay una sembrada, cada test que cancela la reserva sembrada importa `src/app.js` con una cadena de consulta distinta (`import('../src/app.js?t1')`) para tener el estado inicial limpio; `node --test` ya corre cada fichero en su proceso.

## Términos y ADR

- Términos resueltos: ninguno nuevo (se usa «cancelación», no «baja»; las anulaciones quedan fuera).
- ADR candidatas: ninguna.

## Delta de comportamiento

Estado inicial de la aplicación en todos los escenarios: salas Norte y Sur, y una sola reserva, activa: Norte lun 10:00-12:00 (`libres 10:00-12:00` responde `Sur`).

### Capacidad: `reservation-cancellation`

#### ADDED — La cancelación exige un motivo de la lista

- GIVEN el estado inicial
- WHEN `cancelar Norte lun --motivo sala-ocupada`
- THEN responde `cancelada Norte lun (motivo: sala ocupada)`
- AND `libres 10:00-12:00` responde `Norte, Sur`

- GIVEN el estado inicial
- WHEN `cancelar Norte lun --motivo cambio-de-planes`
- THEN responde `cancelada Norte lun (motivo: cambio de planes)`

- GIVEN el estado inicial
- WHEN `cancelar Norte lun --motivo otro`
- THEN responde `cancelada Norte lun (motivo: otro)`

- GIVEN el estado inicial
- WHEN `cancelar Norte lun` (sin motivo)
- THEN responde `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`
- AND `libres 10:00-12:00` responde `Sur` (la reserva sigue activa)

- GIVEN el estado inicial
- WHEN `cancelar Norte lun --motivo aburrimiento`
- THEN responde `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`
- AND `libres 10:00-12:00` responde `Sur`

- GIVEN el estado inicial
- WHEN `cancelar Norte lun --motivo` (sin valor)
- THEN responde `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`
- AND `libres 10:00-12:00` responde `Sur`

- GIVEN el estado inicial
- WHEN `cancelar Norte lun --motivo otro --motivo sala-ocupada`
- THEN responde `cancelada Norte lun (motivo: otro)`

- GIVEN el estado inicial
- WHEN `cancelar Norte lun --motivo Otro`
- THEN responde `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`
- AND `libres 10:00-12:00` responde `Sur`

- GIVEN el estado inicial (Sur martes no tiene reserva)
- WHEN `cancelar Sur mar` (sin motivo)
- THEN responde `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`

#### ADDED — Cancelar una reserva que no está activa

- GIVEN el estado inicial (Sur martes no tiene reserva)
- WHEN `cancelar Sur mar --motivo otro`
- THEN responde `sin reserva Sur mar`

- GIVEN Norte lun ya cancelada con `--motivo otro`
- WHEN `cancelar Norte lun --motivo sala-ocupada`
- THEN responde `sin reserva Norte lun`

- GIVEN Norte lun anulada con `anular Norte lun`
- WHEN `cancelar Norte lun --motivo otro`
- THEN responde `sin reserva Norte lun`

#### ADDED — El listado de canceladas enseña el motivo

- GIVEN Norte lun cancelada con `--motivo sala-ocupada`
- WHEN `canceladas`
- THEN responde `Norte lun 10:00-12:00 · sala ocupada`

- GIVEN Norte lun cancelada con `--motivo otro`
- WHEN `canceladas`
- THEN responde `Norte lun 10:00-12:00 · otro`

- GIVEN Norte lun cancelada con `--motivo otro`
- WHEN `canceladas ignorado`
- THEN responde `Norte lun 10:00-12:00 · otro`

- GIVEN el estado inicial (ninguna cancelada; Norte lun sigue activa)
- WHEN `canceladas`
- THEN responde `sin canceladas`

- GIVEN Norte lun anulada con `anular Norte lun`
- WHEN `canceladas`
- THEN responde `sin canceladas`

#### Reglas de la capacidad — reservation-cancellation

- **Dónde viven los datos**: en memoria, en la propia reserva (`reason`, la clave del motivo; `status` vale `cancelled` tras `cancelar` y `voided` tras `anular`: contexto, no normativo)
- **Idioma de los nombres**: lo visible va en castellano (mensajes, textos de los motivos); las claves de motivo, en kebab-case sin espacios; los identificadores internos (`reason`, `status`), en inglés, como el código actual
- **Límites**: lista cerrada de tres motivos: `cambio-de-planes`, `sala-ocupada`, `otro`, exactos y en minúsculas; con `--motivo` repetido vale el primero; esta capacidad no impone el límite de 24 h de la Cancelación de `PRODUCT.md`
- **Avisos**: `motivo no válido: elige cambio-de-planes, sala-ocupada u otro` · `sin reserva <sala> <día>` · `sin canceladas` · éxito `cancelada <sala> <día> (motivo: <texto>)`
- **Regla ante conflicto**: `cancelar` solo actúa sobre reservas activas, así que no pisa una anulada ni una ya cancelada (da `sin reserva …`)

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-11 | aprobada por delegación: «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» |
