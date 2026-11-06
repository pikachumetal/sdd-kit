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

## Capacidades

- Modificadas: `rooms` — cada sala tiene planta.
- Modificadas: `reports` — el informe de ocupación se agrupa por planta.
- Modificadas: `cli` — `libres` admite `--planta <n>` y hay un comando `informe`.

## Decisiones que he tomado yo — valida estas

1. Las plantas son números enteros, y la planta baja es la 0.
2. El informe ordena las plantas de menor a mayor.
3. **`libres` deja de ser «solo la franja»**: la capacidad `cli` dice hoy que `libres` no acepta más opciones que la franja. Añadir `--planta <n>` cambia ese requisito (`MODIFIED`, no `ADDED`). Lo he declarado en el delta de `cli`.
4. **La sala Este no existe en el código**: `src/app.js` solo tiene Norte y Sur, aunque `rooms` ya dice que el catálogo conoce Norte, Sur y Este. Esta feature añade Este (planta 1) a la lista; si no la quieres aún, hay que cambiar el ejemplo del delta.
5. **No hay comando de informe**: el informe de ocupación existe en `reports` pero `src/app.js` no tiene comando para pedirlo. Propongo `informe`, sin argumentos (con argumentos de más no lo defino). Es un nombre inventado por mí: valida o cambia.
6. **Lo que el pedido dice y la fila no**: la fila 0029 del roadmap dice solo «Las salas tienen planta». El informe agrupado y el filtro de `libres` salen del Intent; si prefieres la fila estricta, quedan fuera de la feature.
7. **Valor inválido de `--planta`** (`--planta abc`, sin valor, una planta que no existe): no lo defino; queda fuera (ver «No entra»). Cualquier entero que no deje salas libres (incluida una planta que no existe, como `--planta 7`) responde vacío, como hoy responde `libres` cuando no queda ninguna.
8. **Formato del informe**: una línea `planta <n>: <reservas activas>` por cada planta que tiene salas, de menor a mayor, y una última línea `total: <suma>`. Una planta con salas y sin reservas activas sale con 0. Las canceladas no cuentan (como ya exige `reports`). El total conserva el caso del requisito vigente: dos activas y una cancelada dan `total: 2`.
9. Planta de cada sala: Norte 0, Sur 0, Este 1 (el ejemplo del Approach, tomado del enunciado de la feature).
10. **Efecto de añadir Este**: `libres <franja>` sin filtro pasa a listar también Este, y el test existente de `libres` (hoy `Sur`) pasa a `Sur, Este`. Con Este en el catálogo también se podrá reservar, pero no lo verifico ni lo prometo (ver «No entra»). Nada de eso cambia otra regla.
11. **Reglas de la capacidad (los cinco puntos)**: dónde vive el dato: la lista de salas de `src/app.js` · idioma de los nombres: castellano (`planta`, `informe`, `--planta`), como pide la constitución · límites: planta entera ≥ 0, sin sótanos (no definido para negativos) · avisos: no aplica · conflicto: no aplica (la lista es código y cada entrada lleva su planta; no hay forma de crear una sala sin ella desde la CLI).
12. **Intent y misión**: el Intent habla de conserjería y de quien reserva; `mission.md` dice que el único usuario eres tú. Mantengo el texto del dev-lead; si prefieres reescribirlo en términos tuyos, dímelo.

Aproximaciones: (a) **planta como dato en la lista de salas** (elegida: es lo que ya hace el código con `rooms`, un solo fichero, sin dependencias); (b) un mapa aparte `planta → salas`, descartado porque duplica la lista y puede desincronizarse; (c) derivar la planta del nombre, descartado porque Norte/Sur/Este no la dicen.

Política de modelos: revisores de la spec — dominio sonnet y técnica sonnet (la spec no toca roles ni reglas de negocio de permisos) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · en paralelo hasta `control.maxParallelAgents`.

Delta probado sobre una copia de `.docs/sdd`: resultado en «Prueba del delta» más abajo.

Review de spec propuesta: dos revisores — señales: contrato público (`libres` y el nuevo `informe` son la interfaz de la CLI), MODIFIED (`reports` y `cli`), datos (planta como dato persistente de cada sala), tres capacidades (`rooms`, `reports`, `cli`) · tamaño: ~40 líneas en 4 ficheros
- Dominio (sonnet): si el MODIFIED de `reports` mantiene «las canceladas no cuentan» y si el filtro `--planta` del ejemplo no contradice el requisito vigente de `libres` (señal: MODIFIED + tres capacidades)
- Técnica (sonnet): si `informe` como comando nuevo y `--planta <n>` quedan definidos sin ambigüedad para el parser de `src/app.js` y si la sala Este rompe el test existente de `libres` (señal: contrato público)
- Mínimo razonable: un solo revisor con los siete puntos — deja sin mirar a fondo el cruce entre las tres capacidades y el contrato de la CLI

### Hallazgos de la review

Primera ronda (dominio y técnica):

- **Aceptado** — Crítico: `rooms` añadía las plantas como `ADDED` junto a «Las salas del edificio» → ahora es un `MODIFIED` de ese requisito, con fila en «Lo que se retira».
- **Aceptado** — Crítico: el `MODIFIED` de `reports` perdía el total y el formato no estaba definido → formato, orden, planta vacía y total en la decisión 8 y en el escenario.
- **Aceptado** — Crítico: `informe` no tenía requisito en `cli` → `ADDED` «Pedir el informe de ocupación».
- **Aceptado** — `--planta` mal formado o inexistente sin definir → declarado fuera en «No entra» y en la decisión 7; el `AND` de `libres` se acota a «no acepta más opciones que `--planta <n>`»; escenario de planta sin salas libres.
- **Aceptado** — reglas de los cinco puntos → decisión 11; efecto de añadir Este en `libres` y su test → decisión 10 y Scope.
- **Aceptado** — orden y plantas vacías no estaban en la lista → decisión 8.
- **Rechazado** — repetir el catálogo en el GIVEN de `cli` (Menor) → cada escenario debe poder leerse solo; si cambian las plantas se revisa en la misma feature.
- **Rechazado** — README sin requisito (Menor) → es documentación, no comportamiento; el formato que explica ya está definido.
- **Aceptado, sin cambiar el texto** — Intent frente a `mission.md` (Menor) → decisión 12, para que decidas tú.
- **Aceptado** — la prueba del delta citaba el resultado sin la salida → pegada abajo, repetida tras los cambios.

Segunda ronda (un revisor, sonnet):

- **Aceptado** — Crítico: el escenario de `reports` daba `total: 3` y no conservaba el caso vigente → ahora son una activa en Norte, una en Este y una cancelada: `total: 2`, el mismo total que «cuenta dos».
- **Aceptado** — `informe x` sin definir, `reservar Este` sin escenario, `--planta 7` ambiguo, `libres` sin GIVEN concreto, AND de opciones no verificable, regla de conflicto sin escenario → cada uno en «No entra», en las decisiones 7, 10 y 11 o en el escenario de `libres` (ahora `Sur, Este`).
- **Rechazado** — partir el MODIFIED de `reports` en un escenario por regla (Importante) → la planta vacía ya tiene su escenario en `cli` (`planta 1: 0`); el orden con más de dos plantas no se puede dar: el catálogo solo tiene dos.
- **Rechazado** — «Laura» no existe en la misión (Menor) → es la aprobadora que puso el dev-lead; el Intent frente a la misión sigue en la decisión 12.
- **Aceptado** — repetir el merge tras los cambios → hecho, abajo.

No hay tercera ronda.

## Intent

Conserjería reparte la limpieza por plantas y hoy saca la ocupación a mano, sala por sala. Quiere el informe agrupado por planta, y de paso quien reserva quiere ver solo lo que tiene cerca.

## Scope

- Entra: la lista de salas de `src/app.js` guarda la planta de cada una y añade la sala Este (planta 1); `libres` sin filtro pasa a listarla.
- Entra: un comando `informe` que agrupa la ocupación por planta, con un subtotal por planta y un total (formato en la decisión 8).
- Entra: `libres <franja> --planta <n>` lista solo las salas libres de esa planta.
- Entra: `README.md` explica cómo leer el informe (el formato de la decisión 8), sin requisito propio: es documentación.
- Entra: `test/app.test.js` cubre la agrupación, el filtro y `libres` con Este.
- No entra: reservar por planta; exportar el informe; validar el valor de `--planta` (mal formado o planta inexistente); `informe` con argumentos de más (queda sin definir, también si responde el informe o `comando desconocido`); `reservar Este` (no se verifica); otras opciones de `libres` además de `--planta`; plantas negativas.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «`libres` no acepta más argumentos ni opciones que la franja» | `.docs/sdd/capabilities/cli.md` (Consultar las salas libres) | `MODIFIED` en el delta de `cli` |
| `THEN cuenta dos` del informe | `.docs/sdd/capabilities/reports.md` | `MODIFIED` en el delta de `reports` (el total se conserva) |
| Catálogo «Norte, Sur» en el código (la capacidad ya dice «y Este») | `src/app.js`, `.docs/sdd/capabilities/rooms.md`, `test/app.test.js` (`libres` espera `Sur`) | `MODIFIED` en el delta de `rooms`; el test pasa a `Sur, Este` |

- Filas que implementa: 0029 → nada más: comprobado con `grep -rn 0029 .docs README.md` (solo la fila del roadmap).

## Approach

La planta va en la lista de salas, junto al nombre. Norte y Sur están en la 0 y Este en la 1. El informe recorre la lista y acumula por planta. `libres` filtra la lista por planta cuando recibe `--planta`.

## Dónde se prueba

- planta de una sala, agrupación (con una planta sin reservas y con una cancelada) y filtro (con una planta sin salas libres): por el comando, como `test/app.test.js`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `rooms`

#### MODIFIED — Las salas del edificio

- GIVEN el catálogo de `src/app.js`
- WHEN la herramienta arranca
- THEN conoce Norte, Sur y Este
- AND Norte y Sur están en la planta 0 y Este en la 1

### Capacidad: `reports`

#### MODIFIED — El informe cuenta las reservas activas

- GIVEN una reserva activa en Norte, una activa en Este y una cancelada en Sur
- WHEN se pide el informe de ocupación
- THEN sale `planta 0: 1`, `planta 1: 1` y `total: 2`, en ese orden
- AND las canceladas no cuentan
- AND una planta con salas y sin reservas activas sale con 0

### Capacidad: `cli`

#### MODIFIED — Consultar las salas libres

- GIVEN una franja válida con Norte reservada y Sur y Este libres
- WHEN la persona ejecuta `libres <franja>`
- THEN lista las salas libres, separadas por comas: `Sur, Este`
- AND la única opción admitida es `--planta <n>`; cualquier otra no está definida

#### ADDED — Consultar las salas libres de una planta

- GIVEN Norte y Sur en la planta 0, Este en la 1, y todas libres en la franja
- WHEN la persona ejecuta `libres <franja> --planta 1`
- THEN responde `Este`
- AND con Este reservada en esa franja responde vacío

#### ADDED — Pedir el informe de ocupación

- GIVEN una reserva activa en Norte y ninguna en Este
- WHEN la persona ejecuta `informe`
- THEN responde `planta 0: 1`, `planta 1: 0` y `total: 1`, una línea cada uno

## Prueba del delta

`sdd capability merge --path <copia> --artifact spec.md` sobre una copia de `.docs/sdd` (el repo no cambia), tras la segunda ronda, salida literal y exit 0:

```text
rooms.md: sustituido «Las salas del edificio»
reports.md: sustituido «El informe cuenta las reservas activas»
cli.md: sustituido «Consultar las salas libres»
cli.md: añadido «Consultar las salas libres de una planta»
cli.md: añadido «Pedir el informe de ocupación»
```

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
