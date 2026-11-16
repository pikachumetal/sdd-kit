---
id: 20261106-115012-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar una reserva
mode: full
profile: delegate
status: approved
created: 2026-11-06
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-06
---

# Spec — Motivo al cancelar una reserva

🦆 Hoy `cancelar Norte lun` cancela y no deja rastro del porqué. Con este cambio hay que decir el motivo, uno de tres: `cambio-de-planes`, `sala-ocupada` u `otro`. Por ejemplo, `cancelar Norte lun --motivo sala-ocupada` responde `cancelada Norte lun (sala ocupada)`, y un comando nuevo, `canceladas`, lista `Norte lun · sala ocupada`. Sin motivo, o con uno que no está en la lista, no se cancela nada y se avisa. Por dentro, la reserva guarda el motivo junto a su estado.

Validación: dev-lead — es un comando que usa una persona desde la terminal.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo y listar las canceladas con él.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva · tamaño: ~45 líneas en 4 ficheros (`src/app.js`, `test/cancel.test.js`, `test/canceladas.test.js`, la capacidad)
- Dominio y técnica (sonnet): si los textos de aviso y el formato de `canceladas` de esta spec no contradicen el vocabulario de `PRODUCT.md` (Cancelación frente a Anulación), y si el THEN de «motivo ausente» cubre también el caso de reserva inexistente (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar los escenarios de borde del delta; el orden «primero el motivo, luego la reserva» (decisión 5) lo cubre la Task 1, que actualiza `cancel.test.js` con su test RED

1. **Enfoque**: el motivo viaja como opción `--motivo <valor>`, igual que `--cada-semana` es una opción de `reservar`; se guarda en el campo `reason` de la reserva y `canceladas` lo lee de ahí. Descartado: un tercer argumento posicional (`cancelar Norte lun sala-ocupada`), porque se confunde con otros argumentos futuros; y preguntarlo de forma interactiva, porque el comando hoy es de una sola línea y no lee de la entrada.
2. **El motivo es obligatorio.** Tu petición dice «al cancelar se elige un motivo», y un motivo opcional deja canceladas sin motivo que el listado no sabría enseñar. Consecuencia: `cancelar Norte lun` sin motivo deja de cancelar, y el test existente `cancelar una reserva activa` cambia.
3. **Valores de la lista**, con un nombre sin espacios para la línea de comandos y su texto legible: `cambio-de-planes` → «cambio de planes», `sala-ocupada` → «sala ocupada», `otro` → «otro». `otro` no lleva texto libre: lo que pides es una lista.
4. **Textos**: motivo ausente o fuera de la lista → `motivo no válido: elige cambio-de-planes, sala-ocupada u otro` (el mismo texto para los dos casos). Cancelación correcta → `cancelada Norte lun (cambio de planes)`.
5. **Orden de las comprobaciones**: primero el motivo, luego si hay reserva. Cancelar una reserva que no existe, con un motivo válido, sigue respondiendo `sin reserva Sur mar`; sin motivo responde el aviso del motivo.
6. **Nuevo comando `canceladas`**. La fila 0010 del roadmap dice «el listado de canceladas lo enseña» y hoy no existe ese listado. Una línea por reserva cancelada, `<sala> <día> · <texto del motivo>`, en el orden en que están las reservas (no se guarda el momento de cancelar, y no hace falta para una lista de este tamaño); sin ninguna, `sin canceladas`. No entran las anuladas (`voided`, las que deja `anular`, que ya existe en el código), que son de la fila 0011.
7. **Capacidad nueva** `booking-cancellation` (inglés kebab-case). `capabilities/` está vacío y `cancelar` ya existe desde la 0.3.0, así que la capacidad nace con el comportamiento ya entregado (cancelar una reserva activa, `sin reserva`) como requisito base, ya con el cambio de esta feature, y como `ADDED` porque no hay base que sustituir. La regla «antes de 24 h» de la definición de Cancelación en `PRODUCT.md` no está en el código y esta feature no la toca.
8. **Textos de la entrega**: el aviso va sin «Aviso:» delante, como los demás textos de `run()` (`sin reserva Sur mar`), y sin tildes en los valores de la lista para escribirlos en la terminal.
9. **Detalles de la lista**: los valores se comparan exactos, con minúsculas (`Sala-Ocupada` no vale); con `--motivo` repetido manda la primera aparición; `--motivo` sin valor al final es motivo ausente. Cancelar una reserva ya cancelada responde `sin reserva …` y no cambia su motivo, porque `cancelar` solo encuentra reservas activas. Las reservas semanales (`reservar --cada-semana`) no entran: el código no guarda ninguna reserva al crearlas.
10. **`PRODUCT.md`**: el término «Motivo de cancelación» se añade a su Terminology en el cierre, no en una task.
11. **Repaso de coherencia**: `git grep` de `cancelad`, `cancelar` y `0010` fuera de `specs/` solo da `src/app.js`, `test/cancel.test.js`, el changelog (historia, sin cambio) y la fila 0010 del roadmap. La fusión del delta en una copia de `.docs/sdd` sale bien con los dos requisitos y las cinco reglas; el `capabilities/` del repo no cambia.
### Hallazgos de la review

- **Aceptado** — Crítico: `ADDED` que en realidad cambia el contrato de un `cancelar` ya entregado → decisión 7: la capacidad nace con el comportamiento entregado como base, y se dice que la regla de 24 h no está en el código ni se toca.
- **Aceptado** — Crítico: «en el orden en que se cancelaron» sin dato que lo sostenga → decisión 6: orden de las reservas, sin guardar el momento de cancelar, y un escenario con dos canceladas.
- **Aceptado** — Importante: escenarios encadenados con AND → cada caso tiene su propio GIVEN/WHEN/THEN; la anulada se prepara con `anular Norte lun`.
- **Aceptado** — Importante: faltaban reserva inexistente sin motivo, `--motivo` sin valor y reserva ya cancelada → tres escenarios nuevos y decisión 9.
- **Aceptado** — Importante: «motivo ausente» y «fuera de lista» juntos → dos escenarios.
- **Aceptado** — Importante: números de línea en la tabla → se sostiene con ficheros y símbolos donde se puede; la decisión 11 solo da el resultado de la comprobación, no líneas.
- **Aceptado** — Importante: el bloque de review se contradecía → el mínimo razonable ya no suena a otra review y la Task 1 cubre el orden de las comprobaciones.
- **Aceptado** — Menor: `PRODUCT.md` y la regla de idioma y límites → decisión 10 y las reglas de la capacidad.
- **Aceptado** (segunda ronda) — Importante: el mapeo de `cambio-de-planes` y `otro` al texto, la comparación exacta y el `--motivo` repetido no tenían escenario, y faltaban los AND de «sigue activa» → escenarios añadidos; `anular` ya existe en el código y se dice en la decisión 6.
- **Rechazado** (segunda ronda) — Menor: sacar la política de modelos de «Decisiones» → la plantilla la exige ahí, en `delegate`.
- **Aceptado** — Menor: Scope sin `reason`, tests ni reservas semanales → Scope y decisión 9.

- Política de modelos: un revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, sin eje Arquitectura (no añade módulo ni dependencia) · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`, que aquí no se usa

### Decisiones tomadas con el dev-lead

- La spec se aprueba por delegación y la sesión para al tener el commit de la Task 1 — «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» (2026-11-06)
- Motivos de la lista: cambio de planes, sala ocupada, otro — «de una lista: cambio de planes, sala ocupada, otro»

## Intent

Hoy una reserva cancelada no dice por qué se canceló. El motivo se elige de una lista cerrada al cancelar y se ve en el listado de canceladas. Éxito: toda reserva cancelada tiene un motivo de la lista, y `canceladas` los enseña. Fracaso aunque funcione: que `cancelar` siga cancelando sin motivo, o que acepte uno fuera de la lista.

## Scope

- Entra: `cancelar <sala> <día> --motivo <valor>` con la lista cerrada y sus avisos; el campo `reason` de la reserva; el comando `canceladas`; la actualización de `test/cancel.test.js` y los tests nuevos de ambos; la capacidad `booking-cancellation`.
- No entra: texto libre en `otro`; las reservas semanales; la regla de las 24 h; anular reservas de otros (0011); avisos por correo (1); validar el formato de la franja.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js:30` (`run`), `test/cancel.test.js:5-7` | Scope y decisión 2: la Task 1 cambia el test para pasar `--motivo` |
| Respuesta `cancelada <sala> <día>` → `cancelada <sala> <día> (<motivo>)` | `src/app.js:17`, `test/cancel.test.js:6` | decisión 4: la Task 1 |
| `cancelar` sin reserva responde `sin reserva …` solo con motivo válido | `test/cancel.test.js:9-10` | decisión 5: la Task 1 pasa `--motivo` en ese test |
| Entrada del changelog «Cancelar una reserva propia» (0.3.0) y «La cancelación ya no borra…» | `.docs/sdd/changelog.md:14` y la sección 0.3.0 | Sin cambio: son historia de lo entregado; la entrada de esta feature la escribe el cierre |

- Filas que implementa: 0010 → `.docs/sdd/roadmap.md:7` es su fila, y no hay otro fichero que la nombre; comprobado con `git grep -n 0010 -- . ':!.docs/sdd/specs'`.

## Approach

Ver decisión 1 de «✋ Decisiones que he tomado yo»: `--motivo` como opción, campo `reason` en la reserva, lista cerrada en una constante de `src/app.js`, y `canceladas` que filtra por `status === 'cancelled'`.

## Dónde se prueba

- Cancelar con motivo válido, ausente o inválido, y cancelar sin reserva: por `run('cancelar', …)`, como los tests actuales de `test/cancel.test.js`.
- `canceladas`: por `run('canceladas', [])`, en un fichero nuevo `test/canceladas.test.js`, con el mismo patrón.

## Términos y ADR

- Términos resueltos: Motivo de cancelación — la razón de la lista cerrada (cambio de planes, sala ocupada, otro) que da quien cancela; se evita «razón». Es solo de la Cancelación; una Anulación no lo lleva.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar exige un motivo de la lista

- GIVEN la reserva `Norte lun` activa
- WHEN `cancelar Norte lun --motivo sala-ocupada`
- THEN responde `cancelada Norte lun (sala ocupada)`
- AND la reserva queda cancelada con ese motivo

- GIVEN la reserva `Norte lun` activa
- WHEN `cancelar Norte lun --motivo cambio-de-planes`
- THEN responde `cancelada Norte lun (cambio de planes)`

- GIVEN la reserva `Norte lun` activa
- WHEN `cancelar Norte lun --motivo otro`
- THEN responde `cancelada Norte lun (otro)`

- GIVEN la reserva `Norte lun` activa
- WHEN `cancelar Norte lun` (sin motivo)
- THEN responde `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`
- AND la reserva sigue activa

- GIVEN la reserva `Norte lun` activa
- WHEN `cancelar Norte lun --motivo aburrimiento`
- THEN responde `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`
- AND la reserva sigue activa

- GIVEN la reserva `Norte lun` activa
- WHEN `cancelar Norte lun --motivo` (sin valor)
- THEN responde `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`
- AND la reserva sigue activa

- GIVEN la reserva `Norte lun` activa
- WHEN `cancelar Norte lun --motivo Sala-Ocupada`
- THEN responde `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`
- AND la reserva sigue activa

- GIVEN la reserva `Norte lun` activa
- WHEN `cancelar Norte lun --motivo otro --motivo sala-ocupada`
- THEN responde `cancelada Norte lun (otro)`

- GIVEN no hay reserva `Sur mar`
- WHEN `cancelar Sur mar --motivo otro`
- THEN responde `sin reserva Sur mar`

- GIVEN no hay reserva `Sur mar`
- WHEN `cancelar Sur mar` (sin motivo)
- THEN responde `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`
- AND `canceladas` responde `sin canceladas`

- GIVEN `Norte lun` ya cancelada con `cambio-de-planes`
- WHEN `cancelar Norte lun --motivo otro`
- THEN responde `sin reserva Norte lun`
- AND su motivo sigue siendo `cambio-de-planes`

#### ADDED — El listado de canceladas enseña el motivo

- GIVEN `Norte lun` cancelada con `cambio-de-planes`
- WHEN `canceladas`
- THEN responde `Norte lun · cambio de planes`

- GIVEN `Norte lun` cancelada con `cambio-de-planes` y `Sur mar` cancelada con `otro`, en ese orden de reservas
- WHEN `canceladas`
- THEN responde dos líneas, `Norte lun · cambio de planes` y `Sur mar · otro`

- GIVEN `Norte lun` anulada con `anular Norte lun`
- WHEN `canceladas`
- THEN responde `sin canceladas`

- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN responde `sin canceladas`

#### Reglas de la capacidad — booking-cancellation

- **Dónde viven los datos**: en memoria, en el campo `reason` de la reserva, con su estado (`src/app.js`)
- **Idioma de los nombres**: valores de la lista y textos en castellano; los textos de aviso y respuesta llevan tildes, los valores no y van con guiones (`cambio-de-planes`); `reason`, `status` y el nombre de la capacidad van en inglés por el código
- **Límites**: lista cerrada de tres motivos, comparación exacta con minúsculas; sin texto libre
- **Avisos**: `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`, ante un motivo ausente o fuera de la lista
- **Regla ante conflicto**: sin motivo válido no se cancela, aunque la reserva exista

### Estimación y esfuerzo

No aplica: es modo full, la estimación va en `plan.md`.

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-06 | aprobada por delegación: «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» |
