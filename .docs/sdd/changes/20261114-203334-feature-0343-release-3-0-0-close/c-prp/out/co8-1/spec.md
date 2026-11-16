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

🦆 Hoy, si en conserjería escriben `libres 10:00-10:00`, la herramienta contesta `Norte, Sur` como si hubiera dos salas libres en una franja de cero minutos. Con este cambio contestará «franja no válida: el final va después del inicio», igual que con `libres 12:00-10:00`. `libres 10:00-12:00` sigue contestando `Sur`. Por dentro, `run('libres', …)` comprueba antes de buscar salas que el final de la franja sea posterior al inicio.

Validación: dev-lead — es una respuesta que lee una persona de conserjería; el agente no la mediría con otro criterio que el suyo.

## Capacidades

- Nuevas: `rooms` — cómo se consultan las salas libres por franja (hoy sin capacidad en `capabilities/`).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva (`rooms`) · tamaño: ~10 líneas en 2 ficheros
- Dominio y técnica (sonnet, un revisor con los siete puntos): si los THEN de `12:00-10:00` y `10:00-10:00` cierran el caso de conserjería, si «Ver las salas libres» como ADDED recoge lo que la 0006 ya promete y si el trato de franjas mal formadas (decisión 4) tiene escenario (señal: capacidad nueva)
- Mínimo razonable: sin revisor — deja sin leer si los escenarios de `10:00-10:00` y `9:00-10:00` bastan para el criterio de la decisión 3

### Hallazgos de la review

- **Rechazado** — Crítico: el escenario `9:00-10:00` pasa sin el comportamiento → con el enfoque A (comparar cadenas) `"9:00" > "10:00"` lo rechazaría, así que sí discrimina; queda como guarda.
- **Aceptado** — Crítico: «dos escenarios de hoy y dos nuevos» no cuadraba → decisión 5 reescrita: uno heredado (`10:00-12:00`) y cuatro nuevos.
- **Aceptado** — franja mal formada sin cubrir → decisión 4 ampliada (regla literal, sin parámetro, fuera de rango) y test de guarda para `abc`.
- **Aceptado** — texto exacto y «ninguna sala» vago → «exactamente» y «no contiene `Norte` ni `Sur`».
- **Aceptado** — nombre `slotError` y horas fuera de rango → quitado el nombre del Approach; fuera de rango en la decisión 4.
- **Aceptado** — escenario→test → «Dónde se prueba» marca los rojos y las guardas.
- **Aceptado** — canal y salida de la respuesta de error → decisión 7.
- **Rechazado** — Menor: «Laura» y «conserjería» frente a PRODUCT.md → son datos que dio el dev-lead (aprobador y origen del reporte); se señala al presentar la spec.
- **Rechazado** — Menor: `rooms` frente a «Evitar: room» → el kit exige slug inglés para el fichero de capacidad (decisión 5); el texto de la spec usa «sala».
- **Rechazado** — Menor: mover la decisión 1 al Intent → la decisión 1 delimita qué caso cierra la spec; se queda en ✋.

Segunda ronda (sin Críticos, no hay tercera):

- **Aceptado** — Importante: `abc` fija en `rooms.md` un comportamiento transitorio → sale del delta y queda como test de guarda (decisión 4).
- **Rechazado** — Importante: falta un escenario de solape parcial (`12:00-13:00`) → `freeRooms` compara la franja entera y no cambia; los solapes no son de esta feature (decisión 5).
- **Aceptado** — Importante: horas fuera de rango sin cubrir → decisión 4: sin garantía ni test.
- **Aceptado** — Importante: «bien formada» sin definir → regex literal en la decisión 4, con `10:00-11:00-12:00` como caso mal formado.
- **Aceptado** — Menor: helper sin ubicar → Scope: helper interno de `src/app.js`, sin exportar.
- **Aceptado** — Menor: test existente → «Dónde se prueba»: intacto, y los nuevos aparte.
- **Aceptado** — Menor: consumidores sin medir → decisión 7 cita `git grep -n "libres"`.
- **Rechazado** — Menor: Laura frente a «dev-lead» → el aprobador viene dado en el frontmatter por el dev-lead; se señala en el gate.

Delta probado sobre una copia de `.docs/sdd`: `sdd capability merge` → «rooms.md: añadido «Ver las salas libres»» (el `capabilities/` del repo no cambia).

1. El caso que reportó conserjería, `libres 10:00-10:00` (`src/app.js:5`, `freeRooms`), lista Norte y Sur como libres en una franja de cero minutos: es el caso que esta spec cierra, con su propio escenario.
2. El texto de la respuesta: «franja no válida: el final va después del inicio».
3. Criterio: una franja es válida si su final es estrictamente posterior a su inicio; igual o anterior, se rechaza.
4. Una franja está bien formada si cumple `^\d{1,2}:\d{2}-\d{1,2}:\d{2}$`. Una que no (`abc`, `10:00`, `10:00-11:00-12:00`, sin parámetro) **no se rechaza con este texto**: sigue como hoy (`Norte, Sur`, sin fallar); eso es un comportamiento transitorio, así que **no va al delta** (no queda en `rooms.md`) y solo se fija con un test de guarda que la deuda reescribirá. Una hora con forma correcta pero fuera de rango (`25:00-26:00`, `10:75-11:00`) se compara en minutos como cualquier otra, sin garantía ni test; que sea imposible lo cubre la fila de deuda «Sin validación del formato de franja horaria», que no entra aquí.
5. Capacidad nueva `rooms` (inglés, kebab-case, como pide el kit para el nombre de fichero): `capabilities/` está vacía, así que el requisito «Ver las salas libres», que la 0006 ya implementó, entra como `ADDED`. De los cuatro escenarios, el de `10:00-12:00` → `Sur` es el heredado de la 0006 (ya tiene test); los otros tres son nuevos. Los solapes parciales no se tocan: `freeRooms` compara la franja entera y no cambia.
6. Enfoque: B (comprobar en `run('libres', …)` con las horas pasadas a minutos), frente a A (comparar las cadenas) y C (poner la comprobación dentro de `freeRooms`); ver Approach.
7. Canal de la respuesta de error: como las demás respuestas de `run` (`sin reserva Norte lun`), es un texto que la CLI imprime por stdout con salida 0. El único consumidor de `run('libres', …)` es la línea final de `src/app.js` (CLI): `git grep -n "libres"` fuera de las specs solo da `src/app.js:28`, su test, `CHANGELOG.md:10` y la fila de deuda; el README no la documenta.
- Política de modelos: un revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

## Intent

Hoy `libres` acepta cualquier franja y responde con salas libres aunque la franja no tenga sentido (`10:00-10:00`, `12:00-10:00`): una persona de conserjería puede dar por buena una respuesta que no responde a nada. Debe rechazarla con un texto que diga qué falla. Éxito: las franjas cuyo final no es posterior a su inicio devuelven el aviso y ninguna sala; las demás se comportan como hoy. Anti-objetivo: que el cambio rechace o altere la respuesta de una franja válida como `10:00-12:00`, o que empiece a validar el formato de la hora (eso es otra fila).

## Scope

- Entra: `run('libres', …)` en `src/app.js` (la comprobación va antes de llamar a `freeRooms`, con un helper interno del mismo fichero, sin exportar) y su test en `test/app.test.js`.
- No entra: `freeRooms`, que no cambia; el formato `HH:MM`, que es la fila de deuda «Sin validación del formato de franja horaria»; `CHANGELOG.md`, que se escribe al cerrar la release.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `git grep -n "0021" -- . ':!.docs/sdd/specs' ':!.docs/sdd/changes'` (sin resultados). La fila de deuda «Sin validación del formato de franja horaria» (`.docs/sdd/steering/debt.md:7`) queda como está: decisión 4.

## Approach

- A. Comparar las cadenas `fin <= inicio` — barato, pero `9:00-10:00` daría «no válida» porque `"9:00" > "10:00"` como texto: rechazaría una franja que tiene sentido.
- B. Pasar inicio y final a minutos en `run('libres', …)` y comparar — un par de líneas, una función pura pequeña, no toca `freeRooms`; una franja mal formada no se evalúa y queda como hoy (decisión 4).
- C. Meter la comprobación en `freeRooms` — mezcla la validación con la búsqueda y obliga a que devuelva a veces un texto y a veces una lista.
- Elegido: B — es el único que acierta con `9:00-10:00` sin tocar el formato, y deja `freeRooms` como está.

## Dónde se prueba

- La franja: por `run('libres', …)`, en `test/app.test.js`, como el test existente «libres excluye la sala reservada en la franja», que ya cubre el escenario de `10:00-12:00` y se queda intacto, sin renombrar; los demás van en tests aparte.
- Rojos antes del cambio: `12:00-10:00` y `10:00-10:00`. Ya pasan hoy y quedan como guarda: `9:00-10:00` (falla con el enfoque A) y `abc` (test de guarda, fuera del delta: decisión 4).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — Ver las salas libres

- GIVEN la reserva de Norte del lunes de 10:00 a 12:00
- WHEN `libres 10:00-12:00`
- THEN responde `Sur`

- GIVEN la reserva de Norte del lunes de 10:00 a 12:00
- WHEN `libres 12:00-10:00`
- THEN responde exactamente `franja no válida: el final va después del inicio`
- AND la respuesta no contiene `Norte` ni `Sur`

- GIVEN la reserva de Norte del lunes de 10:00 a 12:00
- WHEN `libres 10:00-10:00`
- THEN responde exactamente `franja no válida: el final va después del inicio`
- AND la respuesta no contiene `Norte` ni `Sur`

- GIVEN la reserva de Norte del lunes de 10:00 a 12:00
- WHEN `libres 9:00-10:00`
- THEN responde `Norte, Sur`

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
