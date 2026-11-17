---
id: 20261008-140000-feature-0029-room-floors
feature: 0029
title: Las salas tienen planta
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — Las salas tienen planta

🦆 Hoy `libres 10:00-12:00` responde `Sur` y no dice en qué planta está cada sala. Con el cambio, cada sala tiene planta (Norte y Sur en la 0, Este en la 1) y `libres 10:00-12:00 --planta 1` responde solo `Este`. Quien reserva ve así las salas de su planta sin recorrer el edificio. La planta se guarda en el catálogo de salas, junto al nombre, y el comando filtra por ella.

Validación: dev-lead — lo usa una persona desde la terminal y la respuesta de `libres` se ve.

## Capacidades

- Modificadas: `cli` — `libres` acepta la opción `--planta <n>`.
- Modificadas: `rooms` — cada sala tiene planta.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `MODIFIED` (un requisito de `cli`) · tamaño: ~25 líneas en 3 ficheros
- Mínimo razonable: ninguna revisión es el nivel por defecto con 1 señal; no deja nada sin cubrir salvo la relectura de un segundo revisor.

1. Las plantas son números enteros, y la planta baja es la 0.
2. Norte y Sur están en la planta 0 y Este en la 1: la spec original ya lo daba y no consta que viniera de la entrevista; valídalo.
3. El catálogo de `src/app.js` hoy solo tiene Norte y Sur, aunque `rooms` ya dice que conoce Este: la feature añade Este, en la planta 1.
4. La opción se llama `--planta <n>`, y va detrás de la franja: `libres 10:00-12:00 --planta 1`.
5. Una planta sin salas libres (o sin salas) responde una línea vacía, como responde hoy `libres` cuando no queda ninguna sala libre.
6. El requisito `Consultar las salas libres` de `cli` cambia: su línea «no acepta más argumentos ni opciones que la franja» pasa a admitir `--planta <n>`. Lo declaro `MODIFIED` en `cli`, que la spec original no listaba.
7. `PRODUCT.md` lista las salas como «(Norte, Sur)»: se actualiza a «(Norte, Sur, Este)».
- Política de modelos: ninguno (sin revisores de la spec) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
- Pase de coherencia: `sdd capability merge` sobre una copia temporal de `.docs/sdd` — `cli.md: sustituido «Consultar las salas libres»` · `cli.md: añadido «Consultar las salas libres de una planta»` · `rooms.md: añadido «Cada sala tiene planta»`, sin rechazos; el repo no se tocó

### Decisiones tomadas con el dev-lead

- Ninguna: la spec no se ha aprobado por delegación.

## Intent

Hoy nadie sabe desde la herramienta en qué planta está una sala, y quien reserva acaba en la otra punta del edificio. Quien reserva quiere ver solo las salas de su planta. Éxito: `libres <franja> --planta <n>` lista únicamente las salas libres de esa planta. Fracaso aunque funcione: que `libres <franja>` sin la opción cambie su respuesta.

## Scope

- Entra: la lista de salas de `src/app.js` guarda la planta de cada una, y añade Este (decisión 3).
- Entra: `libres <franja> --planta <n>` lista solo las salas libres de esa planta; es la rama `libres` de `run` en `src/app.js`, que hoy solo lee la franja (`params[0]`), y `freeRooms`.
- Entra: `test/app.test.js` con las pruebas nuevas; `test/cancel.test.js` no se toca: solo prueba cancelar.
- Entra: `PRODUCT.md`, la lista de salas del término «Sala» (decisión 7).
- No entra: reservar por planta.
- No entra: validar el valor de `--planta` (por ejemplo `--planta x`): como la franja, hoy no se valida (deuda del roadmap).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| línea «`libres` no acepta más argumentos ni opciones que la franja» | `.docs/sdd/capabilities/cli.md:20` | delta, `MODIFIED` de `cli` |
| lista de salas «(Norte, Sur)» | `PRODUCT.md:7` | Scope y decisión 7 |
| catálogo `['Norte', 'Sur']` | `src/app.js:2` | Scope y decisión 3 |
| entrada «salas libres por franja» | `.docs/sdd/changelog.md:10` | se queda: es historia de la task 0006, no se reescribe |

- Filas que implementa: 0029 → `.docs/sdd/roadmap.md:9` (fila «Las salas tienen planta»), que el cierre mueve de «Próximo» a la release; ningún otro fichero la nombra: comprobado con `grep -rn 0029 . --exclude-dir=.git` y `grep -rni "planta\|floor" . --exclude-dir=.git`.

## Approach

La planta va en la lista de salas, junto al nombre. Norte y Sur están en la 0 y Este en la 1.

## Dónde se prueba

- planta de una sala y `libres --planta`: por el comando (`run`), como los tests de `test/app.test.js`.
- `libres <franja>` sin la opción: se queda como el test existente de `test/app.test.js`.

## Términos y ADR

- Términos resueltos: planta — el piso del edificio donde está una sala; la baja es la 0
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `cli`

#### MODIFIED — Consultar las salas libres (antes: "no acepta más argumentos ni opciones que la franja")

- GIVEN una franja válida
- WHEN la persona ejecuta `libres <franja>`
- THEN lista las salas libres, separadas por comas
- REMOVED AND `libres` no acepta más argumentos ni opciones que la franja
- AND `libres` no acepta más argumentos que la franja ni más opciones que `--planta <n>`

#### ADDED — Consultar las salas libres de una planta

- GIVEN Norte y Sur en la planta 0 y Este en la 1, con Norte reservada en la franja `10:00-12:00`
- WHEN la persona ejecuta `libres 10:00-12:00 --planta 1`
- THEN responde `Este`
- AND `libres 10:00-12:00 --planta 0` responde `Sur`
- AND `libres 10:00-12:00 --planta 2` responde una línea vacía

### Capacidad: `rooms`

#### ADDED — Cada sala tiene planta

- GIVEN las salas Norte y Sur en la planta 0 y Este en la 1
- WHEN se consulta la planta de cada sala
- THEN Norte y Sur están en la 0 y Este en la 1

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
