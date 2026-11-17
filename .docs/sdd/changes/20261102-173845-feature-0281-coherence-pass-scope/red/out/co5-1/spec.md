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

🦆 Hoy conserjería cuenta a mano la ocupación sala por sala para repartir la limpieza. Con este cambio cada sala tiene una planta (Norte y Sur en la 0, Este en la 1) y el informe sale agrupado: `planta 0: 2` y `planta 1: 1`. Además, quien reserva puede pedir `libres 10:00-12:00 --planta 1` y ver solo las salas libres de esa planta. Por dentro, la planta va en la lista de salas de `src/app.js` y el informe y el filtro la leen de ahí.

Validación: dev-lead — lo usa una persona desde la terminal y quiere ver la salida del informe y de `libres --planta`.

## Capacidades

- Modificadas: `rooms` — cada sala tiene planta (requisito nuevo).
- Modificadas: `reports` — el informe de ocupación se agrupa por planta.
- Modificadas: `cli` — `libres` acepta la opción `--planta <n>`.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `MODIFIED` (dos requisitos: `reports` y `cli`), tres capacidades · tamaño: ~40 líneas en 5 ficheros
- Mínimo razonable: ninguna — 2 señales de 8; deja sin mirar la coherencia de `libres --planta` con el resto de `cli`, que la pasada de coherencia ya recorrió.

1. Las plantas son números enteros, y la planta baja es la 0.
2. El informe ordena las plantas de menor a mayor, y lo fija el THEN del informe.
3. `Este` entra en la lista de salas del código, en la planta 1: la capacidad `rooms` ya dice que existe, pero `src/app.js` solo tiene Norte y Sur. Por eso `libres 10:00-12:00` sin opción pasa a responder `Sur, Este` y el test actual de `libres` se actualiza.
4. `libres <franja> --planta <n>` con una planta sin salas responde vacío, igual que una franja sin salas libres. No valido que `<n>` sea un entero (la deuda técnica ya anota que no hay validación de formato).
5. `libres` acepta `--planta <n>` y nada más: el requisito vigente de `cli` decía que no aceptaba otras opciones, y lo modifico (ver delta).
6. Hoy `src/app.js` no tiene un comando del informe de ocupación y la spec no fija cómo se pide. **Pregunta para ti**: ¿lo crea esta feature con un nombre de comando que elijas (p. ej. `informe`), o el informe ya se genera por otra vía que no veo en el código? Si no contestas, lo dejo al plan sin cambiar `cli` y lo anoto como enmienda.
7. Añado el término «Planta» a `PRODUCT.md` al cerrar (en «Términos resueltos»).
8. El filtro `--planta` va más allá de la fila 0029 del roadmap («Las salas tienen planta»): lo pide el Intent. Al archivar, la fila se cierra con las tres partes.
- Política de modelos: ninguno (sin revisores de la spec) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
- Prueba del delta (`sdd capability merge` sobre una copia de `.docs/sdd` fuera del repo): salió bien (exit 0): `rooms.md: añadido «Cada sala tiene planta»` · `reports.md: sustituido «El informe cuenta las reservas activas»` · `cli.md: sustituido «Consultar las salas libres»`. El `capabilities/` del repo no cambia.

### Decisiones tomadas con el dev-lead

- (ninguna todavía: el dev-lead aún no ha respondido a nada de esta spec)

## Intent

Conserjería reparte la limpieza por plantas y hoy saca la ocupación a mano, sala por sala. Quiere el informe agrupado por planta, y de paso quien reserva quiere ver solo lo que tiene cerca. Éxito: con dos reservas en Norte y una en Este, el informe dice `planta 0: 2` y `planta 1: 1`, y `libres 10:00-12:00 --planta 1` responde `Este`.

## Scope

- Entra: la lista de salas de `src/app.js` guarda la planta de cada una e incluye `Este` (planta 1).
- Entra: el informe de ocupación agrupa por planta, con el total de reservas activas de cada una, de menor a mayor planta (`reports`).
- Entra: `libres <franja> --planta <n>` lista solo las salas libres de esa planta; el filtro y su lectura de argumentos viven en `src/app.js` (`cli`).
- Entra: `README.md` explica cómo leer el informe.
- Entra: `test/app.test.js` cubre la agrupación y el filtro, y actualiza el test de `libres` porque `Este` entra en la lista.
- Entra: `PRODUCT.md` recoge el término «Planta» al cerrar.
- No entra: reservar por planta; exportar el informe; validar el valor de `--planta`.
- No entra: `test/cancel.test.js`, `scripts/lint.mjs` y `package.json`: no leen salas ni plantas.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «`libres` no acepta más argumentos ni opciones que la franja» | `capabilities/cli.md:20` | delta `cli`, `MODIFIED` |
| «cuenta dos» como salida del informe (pasa a `planta N: M`) | `capabilities/reports.md:9-13` | delta `reports`, `MODIFIED` |
| `libres` devuelve `Sur` con la franja reservada | `test/app.test.js:5-7` | Scope y decisión 3 |
| `Sala: … (Norte, Sur)` en la terminología | `PRODUCT.md:8` | Scope: se actualiza con Este y el término «Planta» al cerrar |

- Filas que implementa: 0029 → `roadmap.md:9` (se cierra al archivar, decisión 8); ningún otro fichero la nombra: comprobado con `grep -rn 0029 . --exclude-dir=.git`

## Approach

La planta va en la lista de salas, junto al nombre. Norte y Sur están en la 0 y Este en la 1. El informe recorre la lista y acumula por planta; `libres` filtra la lista por la planta pedida antes de quitar las ocupadas.

## Dónde se prueba

- planta de una sala y agrupación del informe: por el comando, como `test/app.test.js`.
- `libres --planta`: por el comando, como el test actual de `libres` en `test/app.test.js`.

## Términos y ADR

- Términos resueltos: Planta — nivel del edificio de una sala; entero, la baja es la 0 (se escribe en `PRODUCT.md` al cerrar)
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — Cada sala tiene planta

- GIVEN las salas Norte y Sur en la planta 0 y Este en la 1
- WHEN se consulta la planta de Este
- THEN es la 1
- AND la de Norte y la de Sur es la 0

### Capacidad: `reports`

#### MODIFIED — El informe cuenta las reservas activas

- GIVEN dos reservas activas en Norte, una en Este y una cancelada en Sur
- WHEN se pide el informe de ocupación
- THEN sale `planta 0: 2` y después `planta 1: 1`
- AND la reserva cancelada no cuenta

### Capacidad: `cli`

#### MODIFIED — Consultar las salas libres

- GIVEN una franja válida
- WHEN la persona ejecuta `libres <franja>`
- THEN lista las salas libres, separadas por comas
- REMOVED AND `libres` no acepta más argumentos ni opciones que la franja
- AND `libres` acepta, además de la franja, solo la opción `--planta <n>`
- AND con `--planta <n>` lista solo las salas libres de esa planta: con Norte reservada de 10:00-12:00, `libres 10:00-12:00 --planta 1` responde `Este` y `--planta 0` responde `Sur`

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
