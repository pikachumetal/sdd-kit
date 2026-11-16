---
id: 20261008-190000-feature-0021-slot-check
feature: 0021
title: Franja no válida en libres
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — Franja no válida en libres

🦆 Hoy `libres 10:00-10:00` responde «Norte, Sur» como si una franja de cero minutos tuviera salas libres, y `libres 12:00-10:00` hace lo mismo con una franja al revés. Con este cambio las dos responden «franja no válida: el final va después del inicio», y `libres 10:00-12:00` sigue respondiendo «Sur». Una franja que no tiene la forma `HH:MM-HH:MM` no se toca: sigue como hoy.

Validación: dev-lead — es lo que ve quien escribe el comando en la terminal.

## Capacidades

- Nuevas: `rooms` — qué responde `libres` para una franja; nace con el comportamiento que `libres` ya tenía (excluir la sala reservada) y con el nuevo (rechazar la franja no válida).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva (`rooms`) · tamaño: ~15 líneas en 2 ficheros
- Única lente (sonnet, siete puntos): si el requisito «Ver las salas libres» que se crea cubre el caso de conserjería (`10:00-10:00`) y el comportamiento que hoy ya tiene `libres 10:00-12:00`, y si el literal del mensaje es el mismo en Intent, ✋ y THEN (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar que `rooms` nazca con un requisito que contradiga lo que `libres` hace hoy

1. El caso que reportó conserjería, `libres 10:00-10:00` (`run` en `src/app.js`), lista Norte y Sur como libres en una franja de cero minutos (medido hoy con `node src/app.js libres 10:00-10:00` → `Norte, Sur`): es el caso que esta spec cierra, con su propio escenario.
2. El texto de la respuesta: «franja no válida: el final va después del inicio».
3. Una franja es no válida cuando el final no es posterior al inicio: la franja vacía (`10:00-10:00`) también se rechaza.
4. Una franja que no tiene la forma `HH:MM-HH:MM` (p. ej. `9:00-10:00` o sin guion) queda como hoy, sin validar: comparar `9:00` con `10:00` como texto rechazaría una franja buena. Tampoco se comprueba el rango de las horas (`99:99-99:98` casa con la forma y se rechaza por orden); todo ello es la fila de deuda «Sin validación del formato de franja horaria».
5. Capacidad nueva `rooms` (no existe `capabilities/`): sus dos requisitos, «Ver las salas libres» y «Rechazar la franja no válida», recogen también el comportamiento que `libres` ya tenía y cubre el test existente (franja igual a la reservada excluye la sala), para que la capacidad nazca completa; los bordes de solape parcial no se tocan en esta feature. Reglas de la capacidad: no aplica (comprobación de entrada, sin datos, topes ni avisos nuevos). El slug `rooms` va en inglés por la regla de nombres de capacidades, aunque PRODUCT.md prefiera «sala» en el texto.
6. Enfoque: validar en `run('libres', …)` antes de llamar a `freeRooms`, frente a validar dentro de `freeRooms` (ver Approach). La comparación es de texto, el mensaje es fijo (sin repetir la franja) y sale por la misma vía que las demás respuestas: `console.log` a stdout, código de salida 0 (una decisión mía: es lo que hacen hoy `sin reserva …` y demás respuestas, y cambiarlo sería otro contrato); `git grep` no encuentra más consumidores de `run('libres', …)` que la llamada final de `src/app.js` y el test.
7. Una franja que cruza la medianoche (`23:00-01:00`) se rechaza por diseño: el final no va después del inicio, y una reserva no cruza días.
8. Delta probado en una copia de `.docs/sdd`: `sdd capability merge` → «rooms.md: añadido «Ver las salas libres»» y «añadido «Rechazar la franja no válida»»; el `capabilities/` del repo no cambia. Medido hoy: `libres 9:00-10:00` → `Norte, Sur`.

### Hallazgos de la review

- **Aceptado** — Crítico: el escenario `9:00-10:00` pasa sin el cambio → sale del delta; queda como test en «Dónde se prueba» y en la decisión 4.
- **Rechazado** — bordes de solape parcial sin escenario → el requisito recoge lo que cubre el test existente; el solape parcial no existe hoy (la comparación es de igualdad) y no es de esta feature (decisión 5).
- **Aceptado** — GIVEN de reserva irrelevante en los escenarios de franja no válida → «cualquier conjunto de reservas».
- **Aceptado** — Capacidades no dice que `rooms` nace con comportamiento previo → dicho en la línea de Capacidades.
- **Aceptado** — rango de horas sin declarar → decisión 4.
- **Aceptado** — comparación textual, canal y consumidores sin declarar → decisión 6.
- **Aceptado** — Intent más amplio que el Scope → acotado a la forma `HH:MM-HH:MM`.
- **Rechazado** — mediciones en ✋ → la ✋ debe ser exhaustiva y las cifras sostienen las decisiones 1 y 7.
- **Rechazado** — «conserjería» y «Laura» → conserjería es un rol, no un cliente con nombre; el aprobador lo fija el dev-lead, no esta spec.

### Hallazgos de la segunda ronda

- **Rechazado** — `rooms` en inglés → el slug va en inglés por la regla 1 de la plantilla de capacidades.
- **Rechazado** — el escenario 1 pasa sin el cambio → está dicho: es comportamiento previo que la capacidad recoge.
- **Aceptado** — falta franja válida que atrape `>=` y la medianoche → escenario `09:00-10:00` y decisión 7.
- **Aceptado** — dos reglas bajo un requisito → separados en «Ver las salas libres» y «Rechazar la franja no válida».
- **Aceptado** — código de salida 0 sin razonar → razonado en la decisión 6.
- **Rechazado** — aprobador/validador y «conserjería» → Laura aprueba, el dev-lead valida; conserjería es un rol, no un cliente.
- **Aceptado** — números de línea frágiles → citados por función.
- **Aceptado** — reglas de la capacidad sin declarar → «no aplica» en la decisión 5.

- Política de modelos: revisor de la spec en sonnet (más una segunda ronda en sonnet por el Crítico aceptado) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`

## Intent

Hoy `libres` acepta cualquier franja y responde con salas libres aunque la franja no tenga sentido (`10:00-10:00` o `12:00-10:00`). Debe rechazarla con un mensaje claro. Éxito: ninguna franja con forma `HH:MM-HH:MM` y el final igual o anterior al inicio devuelve salas, y `libres 10:00-12:00` sigue dando `Sur`.

## Scope

- Entra: `run('libres', …)` en `src/app.js`; `freeRooms` no cambia.
- No entra: el formato `HH:MM`, que es la fila de deuda «Sin validación del formato de franja horaria».

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira: `libres` con franja válida responde igual | `run` y el test de `libres` existente | Scope: se mantiene y lo cubre el escenario 1 |

- Filas que implementa: nada: comprobado con `git grep -n "0021" -- . ':!.docs/sdd/specs'` (sin resultados). `CHANGELOG.md` (entrada de la 0006) cita `libres` y no cambia: su entrada es de la 0006.

## Approach

- Validar dentro de `freeRooms` — mezcla en una función pura de filtrado un mensaje de error, y `freeRooms` devolvería a veces una lista y a veces un texto.
- Validar en `run('libres', …)` — una comprobación antes de `freeRooms`, que sigue devolviendo solo salas; el mensaje se queda en la capa que ya devuelve textos.
- Elegido: validar en `run` — es donde ya viven los textos de respuesta (`sin reserva …`, `cancelada …`).

La comprobación: si la franja casa con `^\d\d:\d\d-\d\d:\d\d$` y el final, comparado como texto, no es mayor que el inicio, `run` devuelve el mensaje; en cualquier otro caso sigue como hoy.

## Dónde se prueba

- La franja: por `run('libres', …)`, en `test/app.test.js`, como el test existente de `libres`. Que `libres 9:00-10:00` sigue respondiendo `Norte, Sur` (la franja sin forma no se toca) lleva su test, pero no es un requisito de la capacidad: es la deuda de formato.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — Ver las salas libres

- GIVEN la reserva de Norte del lunes de 10:00 a 12:00
- WHEN `libres 10:00-12:00`
- THEN responde `Sur` (comportamiento que ya tenía `libres`)

- GIVEN la misma reserva
- WHEN `libres 09:00-10:00`
- THEN responde `Norte, Sur`

#### ADDED — Rechazar la franja no válida

- GIVEN cualquier conjunto de reservas
- WHEN `libres 12:00-10:00`
- THEN responde «franja no válida: el final va después del inicio»

- GIVEN cualquier conjunto de reservas
- WHEN `libres 10:00-10:00`
- THEN responde «franja no válida: el final va después del inicio»

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
