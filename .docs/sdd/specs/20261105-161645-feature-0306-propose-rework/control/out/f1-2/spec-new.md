---
id: 20261106-102216-feature-0010-motivo-cancelar
feature: 0010
title: Motivo al cancelar una reserva
mode: full
status: approved
created: 2026-11-06
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-06
---

# Spec — Motivo al cancelar una reserva

🦆 Hoy `cancelar Norte lun` cancela la reserva sin preguntar por qué. Con este cambio hay que decir el motivo —cambio de planes, sala ocupada u otro—: `cancelar Norte lun --motivo sala-ocupada` responde «cancelada Norte lun (sala ocupada)», y sin motivo, o con uno que no está en la lista, la reserva sigue activa y se explica cómo pedirlo. Además aparece `canceladas`, que lista cada cancelación con su motivo: «Norte lun 10:00-12:00 · sala ocupada». Por dentro, el motivo se guarda junto a la reserva y el listado solo enseña las canceladas, no las anuladas por el responsable.

Validación: dev-lead — es un comando que usa una persona desde la terminal; la frase de delegación no nombra al agente.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo y listar las canceladas. No hay `capabilities/` previa: todo va como `ADDED`.
- Modificadas: ninguna.
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: contrato público (cambia la firma de `cancelar` y nace `canceladas`, que una persona consume desde la terminal), capacidad nueva (`booking-cancellation`) · tamaño: ~40 líneas en 2 ficheros de código (más tests)
- Dominio (sonnet): si los THEN de «Cancelar exige un motivo de la lista» y «El listado de canceladas enseña cada motivo» cubren el orden de comprobación (motivo antes que reserva) y dejan fuera las anuladas (señal: capacidad nueva)
- Técnica (sonnet): si el cambio de firma de `cancelar` sin motivo deja rotos los tests actuales y si el estado en memoria permite probar el listado sin depender del orden (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si la regla «sin motivo no se cancela» contradice la intención del roadmap («se elige un motivo»)

1. **Enfoque: flag obligatorio `--motivo <valor>`** — alternativas descartadas: un tercer argumento posicional (el flag es autoexplicativo y casa con `--cada-semana`, el único flag que ya existe) y preguntar por el motivo de forma interactiva (rompe el uso en scripts y las pruebas, que llaman a `run()` sin terminal).
2. **El motivo es obligatorio**, no opcional con valor por defecto: el roadmap dice «se elige un motivo». Consecuencia: `cancelar Norte lun` a secas deja de cancelar; los dos tests actuales de `test/cancel.test.js` pasan a llevar `--motivo`. Alternativa descartada: «otro» por defecto, que mantendría el uso actual pero llenaría el listado de «otro» sin que nadie elija.
3. **Valores del flag**: `cambio-de-planes`, `sala-ocupada`, `otro` (kebab-case para no tener espacios en la terminal); el texto que se enseña es «cambio de planes», «sala ocupada», «otro».
4. **Textos**: cancelación correcta `cancelada Norte lun (cambio de planes)`; sin motivo `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`; motivo fuera de la lista `motivo no válido «vacaciones»: elige cambio-de-planes, sala-ocupada u otro`; sin reserva se mantiene `sin reserva Sur mar`.
5. **Orden de comprobación**: primero el motivo, después la reserva. Así `cancelar Sur mar` sin motivo pide el motivo aunque no haya reserva.
6. **Listado de canceladas: comando `canceladas`**, sin argumentos, una línea por reserva cancelada con el formato `Norte lun 10:00-12:00 · cambio de planes`, en el orden en que se cancelaron; sin ninguna, `sin canceladas`. No existe hoy ningún listado, así que lo creo aquí porque el roadmap dice que «el listado de canceladas lo enseña».
7. **Las anuladas no salen en `canceladas`**: según `PRODUCT.md`, la cancelación es del cliente y la anulación del responsable de sala (0011 trata esa).
8. **«Otro» sin texto libre**: no se pide ni se guarda detalle; un texto libre sería otra feature.
9. **Capacidad nueva `booking-cancellation`**, porque el comportamiento de cancelar no está hoy en `capabilities/` (no hay carpeta). Todos los requisitos van como `ADDED`: no hay `MODIFIED`, aunque `cancelar` sin motivo cambia respecto al código de hoy.
10. **Sin `§Frontend`**: la interfaz es la terminal, sin pantallas que capturar.
11. **Fusión probada sobre una copia de `.docs/sdd`**: `node sdd.js capability merge --path <copia> --artifact spec.md` añadió los 4 requisitos iniciales a `booking-cancellation.md` sin rechazos; se repite tras la reescritura de la review.
12. **Pruebas aisladas con `resetBookings()`**: `src/app.js` exporta `resetBookings()`, que devuelve las reservas a la semilla actual (Norte lun 10:00-12:00 activa); los tests la llaman antes de cada caso. Alternativa descartada: depender del orden de los tests o de un fichero por caso.
13. **Parseo de `--motivo`**: el flag puede ir en cualquier posición; sala y día son los dos primeros argumentos que no empiezan por `--` ni son el valor del flag. Solo vale la forma `--motivo <valor>`; `--motivo` sin valor, seguido de otro flag, o `--motivo=otro` cuentan como «falta el motivo».
14. **Precedencia**: motivo (falta → no válido) antes que reserva, también con motivo no válido y sin reserva.
15. **Una cancelada no se vuelve a cancelar**: responde `sin reserva Norte lun`, como hoy.
16. **El orden del listado no se promete**: con una sola reserva semilla no hay forma de probarlo; sale en el orden de las reservas. Retirada la promesa «en el orden en que se cancelaron».
17. **No aplica**: el plazo de 24 h de `PRODUCT.md` no se comprueba hoy ni en esta feature; no hay dueño de la reserva (cualquiera cancela cualquier reserva), así que no se dice «propia». Datos: viven en memoria (`operations.md`), en la reserva, como `reason` (valor del flag) junto a `status: 'cancelled'`; identificadores de código en inglés, textos de interfaz en castellano.
18. **`libres` y `anular` son preexistentes y no cambian**: los escenarios solo los usan para comprobar o preparar estado. El cambio cumple el gate completo (`node --test && node scripts/lint.mjs`, `scripts/lint.mjs` existe).
19. **Casos de parseo cerrados**: el valor del motivo distingue mayúsculas (`Otro` → «motivo no válido «Otro»…»); `--motivo ""` cuenta como «falta el motivo»; sala o día ausentes quedan como hoy (fuera de alcance). Solo se prueba el rechazo con `vacaciones`.
20. **`resetBookings()`** muta `bookings` en sitio, devuelve la semilla y deja las reservas sin `reason`; `app.test.js` no depende de ella.
21. **`canceladas` ignora los argumentos extra.**
22. **Límite de prueba declarado**: con una sola reserva semilla, el filtro del listado se prueba con cancelada vs. anulada sobre la misma reserva en casos distintos; «una activa junto a una cancelada» queda sin verificar.
- Política de modelos: dos revisores de la spec en sonnet (dominio y técnica), en paralelo · revisión final: no aplica en esta entrega, que para tras el commit de la Task 1 · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` (sin fijar en `sdd-kit.json`) — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario

### Hallazgos de la review

Dominio (10) y técnica (10), en sonnet:
- **Aceptado (Crítico, técnica 1 y 2)** — estado compartido en memoria hace los escenarios no ejecutables → decisión 12, `resetBookings()`, y «Dónde se prueba».
- **Aceptado** — `--motivo` sin decidir (técnica 5) → decisión 13 y escenarios de parseo.
- **Aceptado** — conflicto motivo/reserva (dominio 1) → decisión 14, escenario con motivo no válido y sin reserva.
- **Aceptado** — `anular`/`libres` sin declarar (dominio 2 y 8, técnica 3 y 8) → decisión 18; el AND de `libres` lleva `Norte, Sur`.
- **Aceptado** — orden del listado sin escenario (dominio 10, técnica 4) → decisión 16, promesa retirada.
- **Aceptado** — cancelar dos veces (técnica 6) → decisión 15 y escenario.
- **Aceptado** — requisito que mezcla tres casos y falta `otro` (dominio 9, técnica 7) → requisitos separados y escenario con `otro`.
- **Aceptado** — «propia», 24 h, datos e idioma (dominio 4, 5, 6, 7) → decisión 17 y capacidad sin «propia».
- **Aceptado** — criterio «todo ADDED» (dominio 3) → decisión 9 ya lo dice; repetido en Capacidades.
- **Aceptado** — gate y evidencia del merge (técnica 9 y 10) → decisiones 18 y 11.

Segunda ronda (1 revisor, sonnet, sin Críticos): 
- **Aceptado** — escenarios encadenados sobre la misma reserva (1 y 2) → un GIVEN con reposición por caso; los rechazos comprueban `libres`.
- **Aceptado** — parseo, `resetBookings()`, argumentos extra, filtro con una sola semilla (3, 5, 6, 7, 8, 9) → decisiones 19 a 22 y Términos.
- **Aceptado** — evidencia del merge y estado de la cabecera (4) → merge repetido sobre copia con 6 requisitos sin rechazos; cabecera `approved`.
- **Rechazado** — la rama sale de `main` (10) → la rama salió de `develop`, la integración del proyecto.

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación (2026-11-06) — «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.»
- Parada: al tener el commit de la Task 1, se para y no se sigue con la Task 2 — «cuando tengas el commit de la Task 1, para.»
- Motivos de la lista: cambio de planes, sala ocupada, otro — «de una lista: cambio de planes, sala ocupada, otro»

## Intent

Hoy una reserva se cancela sin dejar rastro de por qué y no hay forma de ver las canceladas. Se quiere que cancelar pida un motivo de una lista cerrada (cambio de planes, sala ocupada, otro) y que un listado de canceladas lo enseñe. Éxito: tras `cancelar Norte lun --motivo sala-ocupada`, `canceladas` devuelve `Norte lun 10:00-12:00 · sala ocupada`. Fracaso, aunque funcione: que una reserva se cancele sin motivo, o con uno que no está en la lista.

## Scope

- Entra: `resetBookings()` exportada para las pruebas; `cancelar <sala> <día> --motivo <valor>` con los tres valores de la lista y sus rechazos; guardar el motivo en la reserva cancelada; comando `canceladas`; adaptar los dos tests actuales de `cancelar`.
- No entra: texto libre para «otro»; cancelar con un motivo por defecto; anulaciones del responsable y su listado (0011); filtros o rangos de fechas en `canceladas`; persistencia más allá de la memoria (la tiene `operations.md`: «las reservas viven en memoria»).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js:30`, `test/cancel.test.js:6` y `:10` | decisión 2, con su motivo; los tests pasan a llevar `--motivo` |
| Respuesta `cancelada <sala> <día>` pasa a `cancelada <sala> <día> (<motivo>)` | `src/app.js:17`, `test/cancel.test.js:6` | decisión 4 |

- Filas que implementa: 0010 → `.docs/sdd/roadmap.md:7` (el cierre la marca) | nada más: comprobado con `git grep -nE "cancelar|cancelada|0010" -- . ':!.docs/sdd/specs'`

## Approach

`cancelar` lee `--motivo <valor>` de los argumentos, lo valida contra la lista antes de buscar la reserva y, si cancela, guarda `reason` en la reserva (`resetBookings()` exportada para las pruebas) junto a `status: 'cancelled'`. `canceladas` recorre las reservas con `status: 'cancelled'` y las formatea. Una única fuente de verdad para la lista de motivos (valor → texto) sirve a la validación, a la respuesta y al listado.

## Dónde se prueba

- Cancelar con motivo, sin motivo y con motivo no válido: por `run('cancelar', …)`, como los tests actuales de `test/cancel.test.js`.
- Listado de canceladas: por `run('canceladas', [])`, en `test/cancelled.test.js`. Cada caso llama antes a `resetBookings()` (decisión 12): no hay orden entre casos ni entre ficheros. `test/app.test.js` sigue esperando `Sur`.

## Términos y ADR

- Términos resueltos: motivo de cancelación — una de «cambio de planes» (`cambio-de-planes`), «sala ocupada» (`sala-ocupada`), «otro» (`otro`; su prueba es el escenario con `otro`, sin texto libre)
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar exige un motivo de la lista

- GIVEN reserva activa de la sala Norte el lunes, franja 10:00-12:00
- WHEN `cancelar Norte lun --motivo sala-ocupada`
- THEN la respuesta es `cancelada Norte lun (sala ocupada)`
- AND la reserva queda cancelada y `libres 10:00-12:00` responde `Norte, Sur`

- GIVEN reserva activa de la sala Norte el lunes (estado repuesto con `resetBookings()`)
- WHEN `cancelar --motivo otro Norte lun`
- THEN la respuesta es `cancelada Norte lun (otro)`
- GIVEN reserva activa de la sala Norte el lunes (estado repuesto)
- WHEN `cancelar Norte lun --motivo cambio-de-planes`
- THEN la respuesta es `cancelada Norte lun (cambio de planes)`

#### ADDED — Cancelar sin motivo se rechaza

- GIVEN reserva activa de la sala Norte el lunes
- WHEN `cancelar Norte lun`
- THEN la respuesta es `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`
- AND la reserva sigue activa
- GIVEN reserva activa de la sala Norte el lunes (estado repuesto)
- WHEN `cancelar Norte lun --motivo`
- THEN la respuesta es la misma y `libres 10:00-12:00` responde `Sur`
- GIVEN reserva activa de la sala Norte el lunes (estado repuesto)
- WHEN `cancelar Norte lun --motivo=otro`
- THEN la respuesta es la misma y `libres 10:00-12:00` responde `Sur`

#### ADDED — Cancelar con un motivo fuera de la lista se rechaza

- GIVEN reserva activa de la sala Norte el lunes
- WHEN `cancelar Norte lun --motivo vacaciones`
- THEN la respuesta es `motivo no válido «vacaciones»: elige cambio-de-planes, sala-ocupada u otro`
- AND la reserva sigue activa

#### ADDED — El motivo se comprueba antes que la reserva

- GIVEN ninguna reserva activa de la sala Sur el martes
- WHEN `cancelar Sur mar`
- THEN la respuesta es `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`
- GIVEN ninguna reserva activa de la sala Sur el martes
- WHEN `cancelar Sur mar --motivo vacaciones`
- THEN la respuesta es `motivo no válido «vacaciones»: elige cambio-de-planes, sala-ocupada u otro`

#### ADDED — Cancelar una reserva que no existe o ya cancelada lo dice

- GIVEN ninguna reserva activa de la sala Sur el martes
- WHEN `cancelar Sur mar --motivo otro`
- THEN la respuesta es `sin reserva Sur mar`
- GIVEN la reserva de Norte el lunes ya cancelada
- WHEN `cancelar Norte lun --motivo otro`
- THEN la respuesta es `sin reserva Norte lun`

#### ADDED — El listado de canceladas enseña cada motivo

- GIVEN la reserva de Norte el lunes, 10:00-12:00, cancelada con `--motivo cambio-de-planes`
- WHEN `canceladas`
- THEN la respuesta es `Norte lun 10:00-12:00 · cambio de planes`
- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN la respuesta es `sin canceladas`
- GIVEN la reserva de Norte el lunes anulada con `anular Norte lun`
- WHEN `canceladas`
- THEN la respuesta es `sin canceladas`

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-06 | aprobada por delegación: «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» |
