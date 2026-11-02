---
id: 20261008-140000-feature-0029-room-floors
feature: 0029
title: Ocupación por planta
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — Ocupación por planta

🦆 Conserjería reparte la limpieza por plantas y hoy cuenta la ocupación sala por sala. Con esto, cada sala tiene una planta (Norte y Sur en la 0, Este en la 1) y el informe sale agrupado: `planta 0: 2` y `planta 1: 1`. Quien reserva también puede pedir solo lo que tiene cerca: `libres 10:00-12:00 --planta 1` responde `Este`. Hay que dar de alta la sala Este, que la documentación ya da por existente y la herramienta todavía no tiene.

Validación: dev-lead — el informe y el filtro los usa una persona y lo que sale por pantalla lo juzga ella.

## Capacidades

- Modificadas: `rooms` — cada sala tiene planta.
- Modificadas: `reports` — el informe de ocupación se agrupa por planta.
- Modificadas: `cli` — `libres` acepta `--planta <n>`.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: MODIFIED (un requisito de `cli`) · tamaño: ~30 líneas en 4 ficheros
- Mínimo razonable: ninguna es el nivel recomendado; un revisor solo aportaría releer la compatibilidad de `libres`, que la prueba de fusión del delta ya comprueba.

1. Las plantas son números enteros, y la planta baja es la 0. — suposición mía, no salió de la entrevista.
2. El informe ordena las plantas de menor a mayor. — suposición mía.
3. La sala Este se da de alta en el catálogo de `src/app.js`, en la planta 1. — `rooms.md` ya dice que la herramienta conoce Norte, Sur y Este, pero el código solo tiene Norte y Sur, y los escenarios necesitan Este. Efecto visible: `libres 10:00-12:00` pasa de responder `Sur` a `Sur, Este`, y el test de `test/app.test.js` que espera `Sur` cambia con él.
4. El comando del informe se llama `informe` y escribe una línea por planta, `planta <n>: <reservas activas>`. — hoy el código no tiene comando de informe (cualquier comando desconocido responde `salas`); el nombre y el formato son míos, el formato sale del ejemplo `planta 0: 2`.
5. El informe sigue contando solo reservas activas (requisito vigente de `reports`, que no cambia) y no añade línea de total: el «subtotal por cada planta» del Scope es esa línea por planta. — suposición mía; si quieres un total general, dímelo.
6. `libres <franja> --planta <n>` con una planta sin salas libres responde vacío, como `libres` cuando no queda ninguna sala. — suposición mía, sin escenario.
7. La fila 0029 del roadmap dice solo «Las salas tienen planta»; el informe agrupado y el filtro de `libres` salen del Intent. Los he dejado dentro de esta feature (3 tareas previstas, sin partir). — decisión mía.
- Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- (ninguna)

## Intent

Conserjería reparte la limpieza por plantas y hoy saca la ocupación a mano, sala por sala. Quiere el informe agrupado por planta, y de paso quien reserva quiere ver solo lo que tiene cerca.

## Scope

- Entra: la lista de salas de `src/app.js` guarda la planta de cada una y se da de alta Este (decisión 3).
- Entra: el informe de ocupación agrupa por planta, con un subtotal por cada una (decisiones 4 y 5).
- Entra: `libres <franja> --planta <n>` lista solo las salas libres de esa planta; la rama `libres` de `run` en `src/app.js` es donde se aplica.
- Entra: `README.md` explica cómo leer el informe y cómo usar `--planta`.
- Entra: `test/app.test.js` cubre la agrupación, el filtro, y el `Sur` que pasa a `Sur, Este`.
- No entra: reservar por planta; exportar el informe.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «`libres` no acepta más argumentos ni opciones que la franja» | `.docs/sdd/capabilities/cli.md:20` | delta `MODIFIED` de `cli` |
| respuesta de `libres <franja>` (`Sur` → `Sur, Este`) | `test/app.test.js:6`; `.docs/sdd/changelog.md:10` (histórico, no cambia) | Scope; decisión 3 |
| la lista de salas `['Norte', 'Sur']` sin planta ni Este | `src/app.js:2`, `src/app.js:5-7`, `src/app.js:28` | Scope; decisión 3 |
| «conoce Norte, Sur y Este» (vigente, el código iba por detrás) | `.docs/sdd/capabilities/rooms.md:13` | sin cambio: lo cumple el Scope; decisión 3 |
| forma de salida del informe (recuento plano → por planta) | `.docs/sdd/capabilities/reports.md:9-13` | delta `ADDED` de `reports`; el vigente no cambia; decisiones 4 y 5 |

- Filas que implementa: 0029 → `.docs/sdd/roadmap.md:9` (título «Las salas tienen planta», más estrecho que esta spec; decisión 7); la mueve `sdd-archive` al cerrar. Sin más sitios: comprobado con `grep -rniE "0029|planta" . --exclude-dir=.git`

## Approach

La planta va en la lista de salas, junto al nombre. Norte y Sur están en la 0 y Este en la 1. El informe recorre la lista y acumula por planta.

## Dónde se prueba

- planta de una sala y agrupación del informe: por el comando, como `test/app.test.js` (`run('informe', [])`).
- filtro `--planta` y `libres` con Este: por el comando, como los tests de `libres` actuales.
- el catálogo con la planta de cada sala: se ve a través de los dos anteriores; sin test propio.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — Cada sala tiene planta

- GIVEN el catálogo de `src/app.js`
- WHEN la herramienta arranca
- THEN Norte y Sur están en la planta 0 y Este en la planta 1

### Capacidad: `reports`

#### ADDED — La ocupación se agrupa por planta

- GIVEN dos reservas activas en Norte (planta 0) y una en Este (planta 1)
- WHEN se pide el informe de ocupación con `informe`
- THEN sale `planta 0: 2` y `planta 1: 1`, una por línea
- AND las plantas salen de menor a mayor

### Capacidad: `cli`

#### MODIFIED — Consultar las salas libres

- GIVEN una franja válida
- WHEN la persona ejecuta `libres <franja>`
- THEN lista las salas libres, separadas por comas
- REMOVED AND `libres` no acepta más argumentos ni opciones que la franja
- AND `libres` no acepta más argumentos que la franja ni más opción que `--planta <n>`
- GIVEN Norte reservada en 10:00-12:00, Sur en la planta 0 y Este en la 1
- WHEN la persona ejecuta `libres 10:00-12:00 --planta 1`
- THEN responde `Este`

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
