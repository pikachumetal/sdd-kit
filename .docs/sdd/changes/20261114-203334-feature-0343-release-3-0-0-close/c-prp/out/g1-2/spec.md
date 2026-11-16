---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: null
---

# Spec — Motivo al cancelar

🦆 Al cancelar una reserva hay que decir por qué, eligiendo entre «cambio de planes», «sala ocupada» u «otro»: `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)». Sin motivo, o con uno que no está en la lista, no cancela y te enseña la lista. Un comando nuevo, `canceladas`, lista cada reserva cancelada con su sala, día, motivo y titular: «Norte lun — sala ocupada — Ana». Para eso la reserva pasa a guardar su titular. Las anulaciones del responsable de sala no salen en esa lista, y el plazo de 24 h queda para otra fila.

Validación: dev-lead — es la salida de un comando que usa una persona.

## Capacidades

- Nuevas: `reservas` — cancelar una reserva con motivo y listar las canceladas.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva (`reservas`), datos (motivo y titular en la reserva) · tamaño: ~50 líneas en 2 ficheros (`src/app.js`, `test/cancel.test.js`; `test/app.test.js` sin cambios)
- Dominio (opus): si la lista cerrada de motivos y el titular encajan con la definición de Cancelación y Reserva de PRODUCT.md, y qué NO sale en `canceladas` (anuladas, activas) (señal: capacidad nueva + datos)
- Mínimo razonable: un revisor — es el nivel elegido; quitarlo deja sin mirar si el cambio de respuesta de `cancelar` rompe algo más que el test que ya lo fija
```

1. **Capacidad nueva `reservas`**: no hay ninguna en `capabilities/` (`sdd capability index` → «Sin capacidades»). Va en castellano porque PRODUCT.md manda evitar «booking».
2. «Otro» se acepta sin texto libre, sabiendo que no explica nada: la lista acordada con el dev-lead (abajo) no pide más. El motivo se compara exacto, como está escrito en la lista: «Sala Ocupada» no vale. `--motivo` sin valor o vacío cuenta como falta de motivo. Los argumentos sobrantes se ignoran, como hoy, también en `canceladas`.
3. **`cancelar` sin `--motivo` deja de cancelar** y responde «falta el motivo: cambio de planes, sala ocupada, otro». Hoy `cancelar Norte lun` cancela, y el test `test/cancel.test.js:6` pasa a llevar motivo. La alternativa (motivo por defecto «otro») haría que el motivo pudiera no darse nunca.
4. **Un motivo fuera de la lista tampoco cancela**: responde «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa.
5. **Precedencia**: primero se busca una reserva activa. Si no hay ninguna (no existe, ya está cancelada o está anulada), responde «sin reserva <sala> <día>» como hoy, haya motivo o no. Solo con reserva activa se mira el motivo. Por eso una cancelada no se vuelve a cancelar ni se anula, y su motivo no cambia: `anular` sobre ella responde «sin reserva», como hoy. Si hubiera dos reservas activas de la misma sala y día, se cancela la primera guardada, como hace hoy `cancelar`. La semilla no tiene ningún caso así.
6. **La respuesta de cancelar cambia** de «cancelada Norte lun» a «cancelada Norte lun (sala ocupada)».
7. **La reserva guarda su titular**, como dice PRODUCT.md («a nombre de quien la pide»), y `canceladas` lo enseña. No hay identidad de quien ejecuta el comando: lo que distingue una Cancelación de una Anulación es el comando (`cancelar` frente a `anular`), no la persona. **Riesgo aceptado**: si el responsable de sala usa `cancelar` en vez de `anular`, sale como cancelación. El producto lo usa una sola persona (PRODUCT.md).
8. **`reservar` no se toca**: hoy es un esbozo que no crea ninguna reserva (solo responde «reserva semanal creada»). Toda reserva existente lleva titular. Que `reservar` lo pida queda para cuando `reservar` cree reservas de verdad.
9. **Plazo de 24 h fuera**: PRODUCT.md define la Cancelación «antes de 24 h», pero las reservas solo tienen día de la semana y franja, sin fecha ni reloj. Aplicar el plazo es otra fila del roadmap; esta feature no lo cambia ni lo empeora.
10. **Formato de `canceladas`**: una línea por reserva cancelada, «<sala> <día> — <motivo> — <titular>» con raya larga, en el orden en que están guardadas. Sin ninguna, «sin canceladas». Activas y anuladas no salen.
11. **Semilla de ejemplo**: la reserva de Norte del lunes, 10:00-12:00, pasa a ser de Ana. Se añade otra de Sur del martes, 16:00-18:00, de Luis. Va en otra franja porque `libres` no mira el día, y a las 10:00-12:00 rompería `test/app.test.js:6`. Efecto: `libres 16:00-18:00` deja de dar Sur (hoy da «Norte, Sur»; pasa a «Norte»), y ningún test usa esa franja. Los escenarios de anuladas usan el `anular` que ya existe (pasa la reserva a `voided`) como dato de partida, no como requisito: si la 0011 lo cambia, revisa estos escenarios.
12. **Nombres**: texto de la interfaz en castellano (constitution, art. 4). Los identificadores del código siguen la convención que ya hay (`room`, `day`, `status`), y los campos nuevos son `holder` y `reason`.
13. **El motivo llega como un solo argumento** tras `--motivo`; con espacios, entre comillas en la shell (`run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada'])`).
14. Nombres de comando y opción, `canceladas` y `--motivo`: salen de la fila del roadmap y de la spec anterior.
15. Enfoque: A (el motivo vive en la propia reserva), frente a B (un registro aparte de cancelaciones) — ver Approach.
16. ⚠️ **Sin persistencia entre comandos (pendiente de que lo valides)**: las reservas viven en memoria en `src/app.js` y cada `node src/app.js …` es un proceso nuevo. `canceladas` en la terminal no verá lo cancelado por un `cancelar` anterior; solo dentro de un mismo proceso, que es como lo prueban los tests (`run`). Ya pasa hoy con `cancelar` y `libres`: es la arquitectura actual, no algo que introduzca esta feature. Guardar en disco sería otra fila. Si quieres el Intent completo en la terminal, dímelo y entra aquí, con más tasks.
- Política de modelos: revisor de la spec opus (dominio, siete puntos) y segunda ronda sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

- **Aceptado** — Crítico: falta el plazo de 24 h de PRODUCT.md → decisión 9 y «No entra», con su motivo.
- **Aceptado** — Crítico: una reserva sin titular contradice «Reserva» → quitado el requisito «Una cancelada sin titular sale con raya»; decisiones 7 y 8.
- **Aceptado** — «quién canceló» supone un actor que no existe → el requisito y el Intent hablan de «titular»; riesgo aceptado en la decisión 7.
- **Aceptado** — sin escenario para cancelar una ya cancelada → requisito «Sin reserva activa gana a cualquier motivo», que la cubre.
- **Aceptado** — «Regla ante conflicto: no aplica» era falso → regla de precedencia declarada y con escenario.
- **Aceptado, en parte** — la anulada dependía de la 0011 → `anular` ya existe en el código (estado `voided`). El escenario la crea con `anular Sur mar` y no depende de la 0011.
- **Aceptado** — `bookings` va contra la terminología → capacidad `reservas`; decisión 12 para los identificadores.
- **Aceptado, en parte** — semilla y estado compartidos entre tests → la semilla está en el Scope y en la decisión 11. Cómo se aísla el estado entre tests es implementación y va al plan.
- **Aceptado** — faltaba un escenario con varias líneas y activas excluidas → requisito del listado con dos canceladas y su salida exacta, y el formato en la decisión 10.
- **Aceptado** — «otro» sin rastro y argumento de varias palabras → decisiones 2 y 13.
- Retirada la decisión anterior «Sin review de spec»: la rúbrica decide cuántos revisores, no si los hay. Al haber un Crítico aceptado, hubo segunda ronda (sonnet):
- **Aceptado** — sin persistencia entre comandos, `canceladas` no ve lo cancelado en la terminal → decisión 16, pendiente de que la valides.
- **Aceptado** — a la precedencia le faltaba el escenario de la anulada → AND en «Sin reserva activa gana a cualquier motivo».
- **Aceptado** — dependencia del `anular` actual sin declarar → decisión 11.
- **Aceptado** — la semilla cambia `libres 16:00-18:00` → decisión 11 y fila en «Lo que se retira o cambia de forma».
- **Aceptado** — entradas sin regla (mayúsculas, `--motivo` vacío, argumentos sobrantes, cancelar o anular una cancelada) → decisiones 2 y 5.
- **Aceptado** — dos reservas activas de la misma sala y día → decisión 5: la primera guardada, como hoy.
- **Aceptado** — cuentas que no cuadraban (requisitos y ficheros) → corregidas.
- **Aceptado** — decisiones que eran historial o verificación → movidas aquí.
- **Aceptado** — `canceladas` sin plazo frente a la definición de Cancelación → frase en «No entra».
- Delta probado en una copia: `sdd capability merge` → exit 0. Crea `reservas.md` con 5 requisitos y 5 reglas; el `capabilities/` del repo no cambia.

### Decisiones tomadas con el dev-lead

- Lista cerrada de motivos (cambio de planes, sala ocupada, otro) — en la entrevista.

## Intent

Hoy cancelar no deja rastro: nadie sabe por qué se liberó una sala. Se quiere el motivo de cada cancelación, y poder ver de un vistazo qué se canceló, por qué y de quién era. Fracasaría si se pudiera seguir cancelando sin motivo, o si en el listado se mezclaran las anulaciones del responsable de sala.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo>` con la lista cerrada; el titular y el motivo en la reserva; el comando `canceladas`; la semilla de ejemplo (decisión 11).
- No entra: anulaciones del responsable de sala (0011); que `reservar` registre el titular (decisión 8); el plazo de 24 h de la Cancelación (decisión 9): hasta que exista, `canceladas` incluye también las cancelaciones fuera de plazo; guardar las reservas entre comandos (decisión 16).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Respuesta de `cancelar`: «cancelada <sala> <día>» → «cancelada <sala> <día> (<motivo>)» | `src/app.js:17`, `test/cancel.test.js:6` | delta, ADDED «Cancelar pide un motivo de la lista» (no hay capacidad viva que modificar); el test se reescribe con motivo |
| `cancelar <sala> <día>` sin motivo ya no cancela | `src/app.js:30`, `test/cancel.test.js:6` | delta, ADDED «Cancelar sin motivo válido no cancela»; decisión 3 |
| La semilla gana titular y una reserva de Sur | `src/app.js:3` | Scope; decisión 11 (`test/app.test.js:6` sigue en «Sur») |
| `libres 16:00-18:00`: «Norte, Sur» → «Norte» | `src/app.js:5` (`libres` no mira el día); ningún test usa la franja | decisión 11 |

- Filas que implementa: 0010 → `ROADMAP.md:7` la nombra; se marca al cerrar (`sdd-archive`).

## Approach

- A — el motivo se guarda en la propia reserva al pasarla a cancelada, y `canceladas` filtra las reservas por estado. Cuesta dos campos en la reserva y una función de listado, y no hay nada nuevo que mantener sincronizado.
- B — un registro aparte de cancelaciones (sala, día, motivo, titular). Separa el historial, pero duplica datos de la reserva y abre la puerta a que los dos no cuadren.
- Elegido: A — el proyecto guarda todo en el array `bookings` de `src/app.js` y el estado ya vive en la reserva (`status`). B no compra nada que hoy haga falta.

`cancelBooking` recibe el motivo y busca primero la reserva activa. Sin ella responde «sin reserva <sala> <día>» como hoy (`test/cancel.test.js:10` no cambia). Con ella, valida el motivo contra la lista y, si es válido, guarda `status: 'cancelled'` y `reason`. `canceladas` recorre `bookings` con `status === 'cancelled'`.

## Dónde se prueba

- Motivo (válido, ausente, fuera de la lista) y precedencia: por `run('cancelar', …)`, como `test/cancel.test.js`.
- Listado: por `run('canceladas', [])`, en `test/cancel.test.js`.

## Términos y ADR

- Términos resueltos: ninguno nuevo (Reserva, Cancelación y Anulación ya están en PRODUCT.md).
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `reservas`

#### ADDED — Cancelar pide un motivo de la lista

- GIVEN la reserva activa de Norte del lunes, 10:00-12:00, de Ana
- WHEN `cancelar Norte lun --motivo "sala ocupada"`
- THEN responde «cancelada Norte lun (sala ocupada)»
- AND `canceladas` responde «Norte lun — sala ocupada — Ana»

#### ADDED — Cancelar sin motivo válido no cancela

- GIVEN la reserva activa de Norte del lunes, de Ana
- WHEN `cancelar Norte lun` sin `--motivo`
- THEN responde «falta el motivo: cambio de planes, sala ocupada, otro»
- AND WHEN `cancelar Norte lun --motivo "me aburro"` responde «motivo no válido: cambio de planes, sala ocupada, otro»
- AND en los dos casos la reserva sigue activa: `canceladas` responde «sin canceladas»

#### ADDED — Sin reserva activa gana a cualquier motivo

- GIVEN la reserva de Norte del lunes, de Ana, ya cancelada con «sala ocupada», y ninguna reserva de Sur el miércoles
- WHEN `cancelar Norte lun --motivo "otro"`
- THEN responde «sin reserva Norte lun»
- AND `canceladas` sigue respondiendo «Norte lun — sala ocupada — Ana»
- AND WHEN `cancelar Sur mié` sin `--motivo` responde «sin reserva Sur mié»
- AND GIVEN la reserva de Sur del martes, de Luis, anulada con `anular Sur mar` · WHEN `cancelar Sur mar --motivo "otro"` · THEN responde «sin reserva Sur mar» y `canceladas` no la enseña

#### ADDED — El listado de canceladas enseña el motivo y el titular

- GIVEN la reserva de Norte del lunes, de Ana, y la de Sur del martes, de Luis
- WHEN `cancelar Norte lun --motivo "sala ocupada"`, `cancelar Sur mar --motivo "cambio de planes"` y `canceladas`
- THEN `canceladas` responde exactamente dos líneas, en este orden: «Norte lun — sala ocupada — Ana» y «Sur mar — cambio de planes — Luis»

#### ADDED — El listado de canceladas no enseña activas ni anuladas

- GIVEN la reserva de Norte del lunes, de Ana, y la de Sur del martes, de Luis
- WHEN `anular Sur mar` y `canceladas`
- THEN `canceladas` responde «sin canceladas»
- AND WHEN después `cancelar Norte lun --motivo "otro"`, `canceladas` responde solo «Norte lun — otro — Ana»

#### Reglas de la capacidad — reservas

- **Dónde viven los datos**: en la propia reserva (titular, motivo y estado), en memoria en `src/app.js`, sin persistencia entre procesos.
- **Idioma de los nombres**: texto de la interfaz en castellano (constitution, art. 4); identificadores del código como los existentes.
- **Límites**: motivo de una lista cerrada de tres: cambio de planes, sala ocupada, otro.
- **Avisos**: «falta el motivo: cambio de planes, sala ocupada, otro» · «motivo no válido: cambio de planes, sala ocupada, otro» · «sin canceladas» · «sin reserva <sala> <día>» (el vigente).
- **Regla ante conflicto**: sin reserva activa, «sin reserva <sala> <día>» gana a un motivo ausente o inválido.

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
