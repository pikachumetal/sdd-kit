---
id: 20261111-085915-feature-0010-cancel-reason
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

🦆 Hoy `salas cancelar Norte lun` cancela y no deja rastro de por qué. Con esto, al cancelar hay que elegir un motivo de una lista —`cambio-de-planes`, `sala-ocupada` u `otro`—: `salas cancelar Norte lun sala-ocupada` responde `cancelada Norte lun (sala ocupada)`. Un comando nuevo, `salas canceladas`, lista las canceladas con su motivo: `Norte lun · sala ocupada`. Sin motivo, o con uno fuera de la lista, no cancela y avisa de los válidos.

Validación: dev-lead — es lo que usa una persona desde la terminal: texto de respuesta y forma del comando.

## Capacidades

- Nuevas: `cancellation` — cancelar una reserva con motivo y listar las canceladas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva (`cancellation`) · tamaño: ~40 líneas en 3 ficheros
- Único (sonnet): las siete comprobaciones sobre «Cancelar exige un motivo de la lista» y su choque con los tests actuales de `cancelar` (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar si el orden «motivo antes que reserva» contradice algún test existente
- Aplicado: el revisor único (Sonnet); resultado en «Hallazgos de la review».

1. Enfoque: A (motivo como tercer argumento posicional y listado como comando `canceladas`), frente a B y C (ver Approach).
2. El motivo es **obligatorio**: sin él `cancelar` no cancela. Es lo que dice «se elige un motivo»; rompe el uso actual `cancelar <sala> <día>`, cuyos dos tests se actualizan.
3. Los tres motivos se escriben en la línea de comandos como `cambio-de-planes`, `sala-ocupada`, `otro` (sin espacios, para no depender de comillas) y se guardan y enseñan como `cambio de planes`, `sala ocupada`, `otro`.
4. Respuesta de `cancelar` con éxito: `cancelada <sala> <día> (<motivo>)`, p. ej. `cancelada Norte lun (sala ocupada)`.
5. Aviso con motivo ausente o fuera de lista: `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`.
6. Orden de comprobación: primero el motivo, después la reserva. `cancelar Sur mar aburrimiento` da el aviso del motivo; `cancelar Sur mar otro` da `sin reserva Sur mar` (sin cambio).
7. El listado es el comando `canceladas`, una línea por reserva `<sala> <día> · <motivo>`, sin orden prometido; sin ninguna, `sin canceladas`. Ignora cualquier parámetro.
8. `canceladas` lista solo cancelaciones (`status: cancelled`): las anulaciones (`voided`) del responsable de sala no entran, ni llevan motivo (es la fila 0011).
9. Capacidad nueva `cancellation` (nombre en inglés, kebab-case): hoy no hay capacidades y el comportamiento de cancelar no estaba escrito; esta spec escribe el requisito entero, no un `MODIFIED`.
10. Comparación de motivos exacta, en minúsculas (`Otro` no vale); los argumentos sobrantes de `cancelar` se ignoran; en la reserva se guarda la etiqueta legible (`reason: 'sala ocupada'`).
11. Reglas de la capacidad (tres motivos cerrados, motivo inválido gana a reserva inexistente) y nombre `cancellation` en inglés: no salen de la constitución, son mías; la constitución solo fija el castellano en la interfaz.
12. Seam de pruebas: `src/app.js` exporta `resetBookings()`, que devuelve las reservas a la sembrada (`Norte lun` activa); cada test lo llama al empezar. Sin él, el estado en memoria hace que los escenarios dependan del orden.
13. Términos: «Motivo» entra en `PRODUCT.md` § Terminology al cerrar. Los cambios de `README` y changelog los hace el cierre.
- Política de modelos: un revisor de spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo

### Hallazgos de la review

- **Aceptado** — estado compartido entre escenarios (Crítico) → decisión 12, `resetBookings()` y «Dónde se prueba».
- **Aceptado** — el AND de `anular` contradecía el GIVEN → escenario propio.
- **Aceptado** — «sigue activa» no observable → se observa con `canceladas`.
- **Aceptado** — `cambio-de-planes` y `otro` sin escenario → un AND por motivo con estado reiniciado.
- **Aceptado** — el orden del listado no se probaba y no es el de cancelación → se quita el requisito (decisión 7).
- **Aceptado** — reglas y nombre en inglés no salen de la constitución → decisión 11.
- **Aceptado** — decisiones ocultas (mayúsculas, argumentos sobrantes, etiqueta guardada) → decisión 10.
- **Aceptado** — línea mal citada → `src/app.js:17`.
- **Aceptado** — `anular` como dependencia → Scope.
- **Aceptado** — opción aplicada sin decir → línea «Aplicado». La parada tras la Task 1 queda como decisión del dev-lead, separada de la aprobación.
- Resultado de `sdd capability merge` sobre una copia de `.docs/sdd`: añade los requisitos y las cinco reglas de `cancellation`, sin errores.

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación — «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» (2026-11-11)
- Parada tras el commit de la Task 1 — «cuando tengas el commit de la Task 1, para.»
- Motivos de la lista — «cambio de planes, sala ocupada, otro»

## Intent

Hoy cancelar una reserva no deja constancia del porqué. Se quiere que cada cancelación lleve uno de tres motivos y que se pueda consultar el listado de canceladas con ellos. Éxito: toda reserva cancelada tiene motivo (no se puede cancelar sin él) y `canceladas` lo enseña tal cual. Fracaso aunque «funcione»: aceptar un motivo inventado, o dejar cancelar sin motivo.

## Scope

- Entra: motivo obligatorio en `cancelar`; guardarlo en la reserva; comando `canceladas`; `resetBookings()` exportado para los tests (decisión 12); actualizar los dos tests actuales de `cancelar`.
- No entra: anulaciones y su motivo (fila 0011; `anular` se usa solo para comprobar que no aparece en `canceladas` y no se toca); motivo libre o texto adicional en `otro`; persistencia (las reservas viven en memoria); cambiar `reservar` o `libres`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js:30`, `test/cancel.test.js:5-6` | decisión 2; el test pasa a pedir motivo |
| Respuesta `cancelada <sala> <día>` | `src/app.js:17`, `test/cancel.test.js:6` | decisión 4: gana el sufijo `(<motivo>)` |

- Filas que implementa: 0010 → solo la nombra `roadmap.md:7`, que el cierre actualiza | comprobado con `git grep -n 0010`

## Approach

- A — tercer argumento posicional con el motivo en kebab y comando `canceladas`; el motivo se guarda en la reserva (`reason`). Cambio mínimo, un solo punto de entrada (`run`), se prueba con las costuras actuales.
- B — opción `--motivo "sala ocupada"`. Coherente con `--cada-semana`, pero obliga a comillas con espacios y a un parser de opciones que hoy no existe.
- C — listar las canceladas con una opción de otro comando (`libres --canceladas`). Mezcla dos preguntas distintas y confunde `libres`.
- Elegido: A — es lo más simple que cumple lo pedido y no introduce un parser nuevo.

`cancelBooking(room, day, reason)` valida `reason` contra `['cambio-de-planes', 'sala-ocupada', 'otro']` antes de buscar la reserva y guarda su etiqueta legible. `cancelledBookings()` devuelve las líneas del listado. `resetBookings()` restablece el estado inicial.

## Dónde se prueba

- `cancelar` con motivo, sin motivo, con motivo inválido, sin reserva: por `run('cancelar', [...])`, como los tests actuales de `test/cancel.test.js`.
- `canceladas`: por `run('canceladas', [])`, en el mismo fichero de tests.
- Cada test empieza con `resetBookings()` para no depender del orden. Que una reserva sigue activa tras un motivo inválido se observa con `canceladas` (`sin canceladas`).

## Términos y ADR

- Términos resueltos: Motivo — la razón, de una lista cerrada, por la que se cancela una reserva.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `cancellation`

#### ADDED — Cancelar exige un motivo de la lista

- GIVEN reserva activa `Norte lun`
- WHEN `cancelar Norte lun sala-ocupada`
- THEN responde `cancelada Norte lun (sala ocupada)`
- AND la reserva deja de estar activa y `canceladas` la lista con `sala ocupada`
- AND, con el estado reiniciado, `cancelar Norte lun cambio-de-planes` responde `cancelada Norte lun (cambio de planes)`
- AND, con el estado reiniciado, `cancelar Norte lun otro` responde `cancelada Norte lun (otro)`

#### ADDED — Un motivo ausente o fuera de la lista no cancela

- GIVEN reserva activa `Norte lun`
- WHEN `cancelar Norte lun` (sin motivo) o `cancelar Norte lun aburrimiento`
- THEN responde `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`
- AND la reserva sigue activa: `canceladas` responde `sin canceladas`

#### ADDED — El motivo se comprueba antes que la reserva

- GIVEN no hay reserva `Sur mar`
- WHEN `cancelar Sur mar otro`
- THEN responde `sin reserva Sur mar`
- AND con `cancelar Sur mar aburrimiento` responde `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`

#### ADDED — Listado de canceladas con su motivo

- GIVEN `Norte lun` cancelada por `sala-ocupada`
- WHEN `canceladas`
- THEN responde `Norte lun · sala ocupada`
- AND sin ninguna cancelada (estado reiniciado) responde `sin canceladas`

#### ADDED — Las anulaciones no salen en el listado de canceladas

- GIVEN reserva activa `Norte lun`
- WHEN `anular Norte lun` y después `canceladas`
- THEN `canceladas` responde `sin canceladas`

#### Reglas de la capacidad — cancellation

- **Dónde viven los datos**: en memoria, en la propia reserva (`reason`).
- **Idioma de los nombres**: castellano en la interfaz, motivos en kebab-case de castellano.
- **Límites**: tres motivos cerrados.
- **Avisos**: `motivo no válido: usa cambio-de-planes, sala-ocupada u otro` · `sin canceladas` · `sin reserva <sala> <día>`.
- **Regla ante conflicto**: motivo inválido gana a reserva inexistente.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-11 | aprobada por delegación: «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» |
