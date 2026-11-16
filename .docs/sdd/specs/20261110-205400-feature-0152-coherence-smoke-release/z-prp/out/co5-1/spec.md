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
- Modificadas: `cli` — `libres` admite `--planta <n>` y hay un comando `informe`.
- Modificadas: `reports` — el informe de ocupación se agrupa por planta.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: contrato público (la línea de comandos: `libres --planta` e `informe`), MODIFIED (tres requisitos: «Las salas del edificio», «Consultar las salas libres» y «El informe cuenta las reservas activas»), tres capacidades · tamaño: ~40 líneas en 5 ficheros
- Dominio (opus): si el cambio de `libres` respeta lo que la capacidad `cli` fija hoy y si «el informe agrupa por planta» cambia lo que cuenta `reports` (señal: MODIFIED)
- Técnica (sonnet): si `informe` y `--planta` caben en `src/app.js` sin romper `libres <franja>` ni el comando desconocido (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si el nuevo `informe` contradice lo que hoy promete `reports`

Política de modelos: dominio en Opus (toca reglas de producto), técnica en Sonnet; ronda 2, un revisor en Sonnet.

1. Las plantas son números enteros mayores o iguales que 0; la planta baja es la 0 (sin sótanos).
2. El informe ordena las plantas de menor a mayor.
3. Enfoque: la planta va en la lista de salas, frente a un mapa aparte sala→planta o a deducirla del nombre (ver Approach).
4. El informe es un comando nuevo, `informe`: hoy no existe como comando en `src/app.js` (cae en la respuesta por defecto, `salas`) y `reports` solo dice lo que cuenta. Nombre elegido por mí, en castellano como `libres` y `reservar`. Ignora los argumentos que se le pasen.
5. `informe` saca una línea por planta, `planta <n>: <reservas activas>`, sin línea de total, y omite las plantas sin reservas. Sin ninguna reserva activa responde vacío. El subtotal de cada planta es esa cifra.
6. No cuentan las reservas canceladas **ni las anuladas**. `reports` hoy solo excluye las canceladas: lo de las anuladas es regla nueva mía, porque una anulación también libera la sala, y cambia la cifra que ve conserjería. «Activa» es la reserva que no está cancelada ni anulada; el informe no filtra por día ni franja.
7. La opción es `--planta <n>`, tras la franja: `libres 10:00-12:00 --planta 1`. Sin la opción, `libres <franja>` responde igual que hoy. Una planta sin salas libres responde vacío. Un valor que no es entero ≥ 0, o la opción sin valor, responde `planta no válida`. «Entero» son solo dígitos decimales, sin signo ni decimales (`0`, `1`, `12`; no `+1`, `1.5`, `-0`). `--planta` solo va tras la franja: antes de ella o repetida responde también `planta no válida`.
8. Este no está en `src/app.js` (la lista tiene Norte y Sur) aunque `rooms` ya dice que existe: lo añado, en la planta 1; es parte de esta feature, no un patch aparte, y no hay reservas previas en Este. Efecto: `libres` empieza a listarlo, y el test actual `libres excluye la sala reservada en la franja` (espera `Sur`) pasa a esperar `Sur, Este`; ese test se actualiza en esta feature.
9. La fila del roadmap se llama `Las salas tienen planta` y no menciona `libres --planta`; lo incluyo porque el Intent lo pide («de paso»), con su escenario. El título de la spec pasa a ser «Ocupación por planta».
10. `PRODUCT.md`: la lista de salas del término Sala pasa a Norte, Sur, Este y se añade el término **Planta**.
11. Reglas de `rooms`: el dato vive en la lista de `src/app.js`; nombres en castellano (constitución 4); límite: entero ≥ 0; aviso `planta no válida`; conflicto: no aplica (la lista es fija, no hay altas).

### Hallazgos de la review

- **Aceptado** (Crítico, dominio) — `reports` ADDED cambiaba el requisito vivo «El informe cuenta las reservas activas» → ahora es `MODIFIED` con el texto completo, y fila en la tabla.
- **Aceptado** (Crítico, dominio) — faltaban las reglas de la capacidad → decisión 11 y bloque `Reglas de la capacidad — rooms`.
- **Aceptado** (Importante, dominio) — «anuladas no cuentan» se presentaba como vigente → decisión 6 lo dice como regla nueva y el escenario lleva una anulada.
- **Aceptado** (Importante, dominio y técnica) — `REMOVED AND` dentro del MODIFIED de `libres` → quitado; el requisito queda con un solo texto.
- **Aceptado** (Importante, dominio) — Este altera `libres` y el test existente → decisión 8 y escenario.
- **Aceptado** (Importante, ambas) — valores inválidos de `--planta`, planta sin salas, informe vacío, orden y omisión sin escenario → decisiones 5 y 7 y escenarios nuevos.
- **Aceptado** (Importante, técnica) — escenario `informe` de `cli` sin valor literal → ahora con reservas y salida literal.
- **Aceptado** (Menor, dominio y técnica) — `informe` dejaba de ser comando desconocido; `PRODUCT.md`; señal del encabezado → filas en la tabla, decisión 10 y encabezado corregido.
- **Aceptado** (Menor, técnica) — Este sin forma de probarse → `libres 10:00-12:00` lo cubre en el escenario de `cli`.
- **Aceptado** (Crítico, ronda 2) — ADDED de `libres` mezclaba cuatro cosas → partido en escenarios separados (filtro, planta sin salas, valor inválido, posición).
- **Aceptado** (Crítico, ronda 2) — `cli` y `reports` duplicaban el informe → `cli` fija solo el contrato del comando (formato literal, sin total, ignora argumentos) y `reports` lo que cuenta.
- **Aceptado** (Importante, ronda 2) — escenarios que pasaban sin el comportamiento (planta sin reservas, canceladas/anuladas) → casos donde contarlas cambia la cifra, y escenario aparte de planta vacía.
- **Aceptado** (Importante, ronda 2) — anuladas, «activa», forma de «entero», posición y repetición de `--planta`, Este y reservas previas → decisiones 1, 6, 7 y 8.
- **Aceptado** (Menor, ronda 2) — fila del roadmap con otro nombre → el Scope anota que el cierre la renombra.
- **Rechazado** (Menor, ronda 2) — sacar el bloque de la review de las decisiones: la rúbrica del kit lo pide ahí, abriendo el bloque.
- **Rechazado** (Importante, técnica) — escenario de `libres` ante argumentos desconocidos distintos de `--planta`: `cli` hoy no define qué responde ante ellos y esta feature no lo cambia; quedaría fuera.
- **Rechazado** (Importante, técnica) — regresión de «Un comando desconocido»: su escenario vigente no cambia y `informe` ya no es el desconocido; basta la fila de la tabla.
- **Rechazado** (Menor, técnica) — mover el bloque de la review fuera de las decisiones: la rúbrica del kit lo pide ahí, abriendo el bloque.

- Delta probado en una copia de `.docs/sdd` con `sdd capability merge`: sustituye 3 requisitos, añade 5 y 5 reglas de `rooms`; sin rechazos (tras la ronda 2).

## Decisiones tomadas con el dev-lead

- Perfil `delegate`, del proyecto (`sdd-kit.json`). Sin frase de delegación de la spec: la aprueba Laura.

## Intent

Conserjería reparte la limpieza por plantas y hoy saca la ocupación a mano, sala por sala. Quiere el informe agrupado por planta, y de paso quien reserva quiere ver solo lo que tiene cerca.

Éxito: con dos reservas en Norte y una en Este, `informe` responde `planta 0: 2` y `planta 1: 1`, y `libres 10:00-12:00 --planta 1` lista solo `Este`.

## Scope

- Entra: la lista de salas de `src/app.js` guarda la planta de cada una y añade Este (decisión 8).
- Entra: el comando `informe` agrupa por planta, con un subtotal por cada una.
- Entra: `libres <franja> --planta <n>` lista solo las salas libres de esa planta.
- Entra: `README.md` explica cómo leer el informe.
- Entra: `PRODUCT.md`, la lista de salas y el término Planta (decisión 10).
- Entra: `test/app.test.js` cubre la planta, el filtro y la agrupación, y actualiza el test de `libres` (decisión 8).
- Entra: `CHANGELOG.md` y la fila 0029 de `ROADMAP.md` (el cierre la renombra a «Ocupación por planta»), solo lo que anote el cierre de la feature.
- No entra: reservar por planta; exportar el informe; total general del informe.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «`libres` no acepta más argumentos ni opciones que la franja» | `.docs/sdd/capabilities/cli.md` (requisito «Consultar las salas libres») | delta `cli`, `MODIFIED` |
| «conoce Norte, Sur y Este» (sin planta; Este falta en el código) | `.docs/sdd/capabilities/rooms.md`; `src/app.js:2` | delta `rooms`, `MODIFIED`; Scope |
| «cuenta dos» (una sola cifra, sin planta) | `.docs/sdd/capabilities/reports.md` (requisito «El informe cuenta las reservas activas») | delta `reports`, `MODIFIED` |
| `informe` deja de ser un comando desconocido | `src/app.js:32` (cae en `salas`) | delta `cli`, `ADDED` |
| `libres 10:00-12:00` responde `Sur` | `test/app.test.js:6` | Scope; decisión 8 |
| Sala: «(Norte, Sur)» | `PRODUCT.md:12` | Scope; decisión 10 |

- Filas que implementa: 0029 → nada más la nombra: comprobado con `git grep -n 0029 -- . ':!.docs/sdd/specs'` (solo `ROADMAP.md:9`, que se cierra con la feature)

## Approach

- Planta en la lista de salas, junto al nombre (`{ name, floor }`) — un solo sitio que mantener; `freeRooms` y el filtro la leen ahí. Elegido.
- Mapa aparte sala→planta — dos sitios que se desincronizan al añadir una sala.
- Deducir la planta del nombre — las salas se llaman Norte, Sur, Este: no lleva planta.

Norte y Sur están en la 0 y Este en la 1. `informe` recorre las reservas activas y acumula por la planta de su sala; `libres` filtra por `--planta` si viene.

## Dónde se prueba

- planta de una sala, filtro, agrupación, orden y valores inválidos: por el comando (`run`), como `test/app.test.js`.
- regresión: `libres <franja>` sin la opción.

## Términos y ADR

- Términos resueltos: Planta (a `PRODUCT.md`, decisión 10)
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `rooms`

#### MODIFIED — Las salas del edificio

- GIVEN el catálogo de `src/app.js`
- WHEN la herramienta arranca
- THEN conoce Norte, Sur y Este
- AND Norte y Sur están en la planta 0 y Este en la 1

#### Reglas de la capacidad — rooms

- **Dónde viven los datos**: la lista de salas de `src/app.js`, con nombre y planta
- **Idioma de los nombres**: castellano (constitución 4)
- **Límites**: la planta es un entero ≥ 0, solo dígitos decimales
- **Avisos**: `planta no válida`, que emite `libres` ante una planta que no es entero ≥ 0, ante `--planta` sin valor o mal colocada
- **Regla ante conflicto**: no aplica

### Capacidad: `cli`

#### MODIFIED — Consultar las salas libres

- GIVEN una franja válida
- WHEN la persona ejecuta `libres <franja>`
- THEN lista las salas libres, separadas por comas
- AND `libres` no acepta más argumentos ni opciones que la franja y `--planta <n>`

#### ADDED — Salas libres de una planta

- GIVEN las salas Norte y Sur en la planta 0 y Este en la 1, y Norte reservada en la franja
- WHEN la persona ejecuta `libres 10:00-12:00 --planta 0`
- THEN responde `Sur`
- AND con `--planta 1` responde `Este`
- AND sin la opción, `libres 10:00-12:00` responde `Sur, Este`

#### ADDED — Una planta sin salas libres

- GIVEN las salas Norte y Sur en la planta 0 y Este en la 1
- WHEN la persona ejecuta `libres 10:00-12:00 --planta 5`
- THEN responde vacío

#### ADDED — Una planta no válida

- GIVEN cualquier estado
- WHEN la persona ejecuta `libres 10:00-12:00 --planta x`, `libres 10:00-12:00 --planta`, `libres 10:00-12:00 --planta 1.5` o `libres --planta 1 10:00-12:00`
- THEN responde `planta no válida`

#### ADDED — El informe de ocupación

- GIVEN dos reservas activas en Norte y una en Este
- WHEN la persona ejecuta `informe`
- THEN responde una línea por planta con la forma `planta <n>: <reservas activas>`: `planta 0: 2` y `planta 1: 1`
- AND no hay línea de total
- AND `informe foo` responde lo mismo

### Capacidad: `reports`

#### MODIFIED — El informe cuenta las reservas activas

- GIVEN dos reservas activas en Norte y una cancelada en Norte, una activa en Este y una anulada en Este
- WHEN se pide el informe de ocupación
- THEN sale `planta 0: 2` y `planta 1: 1`, de menor a mayor planta
- AND las canceladas y las anuladas no cuentan

#### ADDED — Una planta sin reservas activas no sale

- GIVEN una reserva activa en Norte y una cancelada y una anulada en Este
- WHEN se pide el informe de ocupación
- THEN sale solo `planta 0: 1`

#### ADDED — El informe sin reservas activas

- GIVEN ninguna reserva activa
- WHEN se pide el informe de ocupación
- THEN sale vacío

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
