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

🦆 Cada sala pasa a tener una planta (Norte y Sur en la 0, Este en la 1). Conserjería podrá pedir `informe` y ver `planta 0: 2` y `planta 1: 1` en vez de contar a mano, y quien reserva podrá pedir `libres 10:00-12:00 --planta 1` para ver solo lo que tiene cerca. De paso se añade Este, que la documentación ya daba por existente pero el código no tenía.

## Capacidades

- Modificadas: `rooms` — cada sala tiene planta (MODIFIED de «Las salas del edificio»).
- Modificadas: `reports` — el informe de ocupación se agrupa por planta (MODIFIED).
- Modificadas: `cli` — `libres` acepta `--planta <n>` (MODIFIED) y aparece el comando `informe` (ADDED).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: MODIFIED (tres requisitos), contrato público (la CLI), tres capacidades · tamaño: ~60 líneas en 5 ficheros
- Dominio (sonnet): si el MODIFIED de «El informe cuenta las reservas activas» conserva su caso original y si `rooms` y `cli` no se pisan (señal: MODIFIED)
- Técnica (sonnet): si los THEN de `informe` y de `libres --planta` fijan salidas literales y no pasan con cualquier texto (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si las capacidades se contradicen entre sí

Política de modelos: dos revisores de spec en Sonnet (dominio y técnica), sin reglas de rol ni de permisos que pidan Opus.

1. Las plantas son números enteros, y la planta baja es la 0. Se acepta cualquier entero seguro de JS, también negativo (sótanos): solo se admite la forma `-?[0-9]+` (sin `+`, sin decimales); `01` vale como 1. Lo que no cumple, o es mayor que un entero seguro, responde `planta no válida`.
2. El informe ordena las plantas de menor a mayor.
3. Enfoque: la planta va en la propia lista de salas, frente a una tabla aparte de plantas y a un fichero de configuración (ver Approach). El campo se llama `planta`, no `floor`, porque PRODUCT.md evita términos en inglés para el dominio.
4. Hoy `src/app.js` no tiene informe de ocupación ni comando que lo pida: lo llamo `informe`. Responde una línea `planta <n>: <reservas activas>` por cada planta del catálogo, en orden, también las que tienen 0. No hay total general; la cifra de cada planta es el recuento de reservas activas (todas, sin distinguir día ni franja). `informe` no acepta argumentos y, si recibe alguno, responde `informe no acepta argumentos`.
5. `src/app.js` solo lista Norte y Sur, aunque `rooms` ya dice que existe Este: es una deriva entre la capacidad y el código, y la corrijo añadiendo Este. La planta 1 de Este es decisión mía, a validar. Efecto observable: `libres <franja>` sin `--planta` pasa a listar también Este, y el test existente de `libres` (que espera `Sur`) cambia a `Sur, Este`; el separador es `, ` como hoy.
6. `libres --planta <n>` con una planta sin salas responde vacío, igual que `libres` sin salas libres hoy. La opción puede ir antes o después de la franja. «Vacío» es la cadena vacía (una línea en blanco por consola). Si falta el valor o no es un entero válido (decisión 1), responde `planta no válida`. Se valida la franja antes que la planta; `--planta` repetida o un argumento sobrante responden `libres: argumentos no válidos`.
7. `reports` cambia como `MODIFIED`: el requisito conserva su caso original (dos activas y una cancelada: cuenta dos) y ahora lo muestra por planta; las canceladas siguen sin contar. La agrupación entre varias plantas es un escenario aparte (ADDED).
8. Reglas de producto de lo nuevo: el dato vive en la lista de salas de `src/app.js`; nombres e interfaz en castellano (constitución, regla 4); límites: ninguno (decisión 1); advertencias: ninguna; conflicto: no aplica, cada sala tiene una sola planta.
9. «Planta» entra como término nuevo, y el ejemplo de «Sala» pasa a (Norte, Sur, Este). Ambos se escriben en `PRODUCT.md` en la tarea de documentación del plan, no antes («Planta: nivel del edificio, entero, con la baja en 0. _Evitar_: floor, piso»).
10. `sdd capability merge` sobre una copia de `.docs/sdd`, ejecutado tras la última edición: sin rechazos (`rooms` sustituido 1; `reports` sustituido 1 y añadidos 2; `cli` sustituido 1 y añadidos 4).

### Hallazgos de la review

- **Aceptado** (técnica, Crítico) — el MODIFIED de `reports` no probaba la agrupación ni la planta vacía → escenario con salida literal de plantas 0 y 1 y escenario de planta sin reservas; decisión 4 fija que salen todas las plantas.
- **Aceptado** (dominio, Crítico) — decisiones 4 y 7 se contradecían sobre el total → no hay total general; el MODIFIED conserva el caso «dos activas y una cancelada».
- **Aceptado** (técnica, Crítico) — THEN de `informe` genérico → GIVEN con valores y THEN con líneas literales, más el caso sin reservas y el de argumentos.
- **Aceptado** (ambos, Importante) — decisión 6 sin escenarios → escenarios de planta vacía, opción antes de la franja y `planta no válida`.
- **Aceptado** (ambos, Importante) — `rooms` ADDED pisaba «Las salas del edificio» y no se observaba → pasa a MODIFIED y se observa con `libres --planta`.
- **Aceptado** (técnica, Importante) — efecto de añadir Este sobre `libres` → escenario de regresión y test existente anotado (decisión 5).
- **Aceptado** (técnica) — «subtotal» sin total → se dice «cifra por planta»; alcance del conteo y política de argumentos de `informe` a ✋ (decisión 4).
- **Aceptado** (ambos, Menor) — término «planta» y `git grep` sin `informe` ni `Este` → decisión 9 y búsqueda ampliada.
- **Aceptado** (ambos, Menor) — merge afirmado sin evidencia → se ejecutó de nuevo tras editar.
- **Aceptado** (2.ª ronda, Crítico) — el GIVEN con «reservada de 10:00-12:00» no se podía construir con `reservar` → las reservas las siembra el fixture `bookings` del test, como hoy; `reservar` no cambia (Dónde se prueba).
- **Aceptado** (2.ª ronda, Importante) — sin escenario de regresión de `libres` ni de argumentos sobrantes, `-1`, `1.5`, desbordes, `--planta` repetida y salida vacía → escenarios literales y decisiones 1, 5 y 6; precedencia: franja antes que planta.
- **Aceptado** (2.ª ronda, Importante) — formato del informe duplicado entre `reports` y `cli`, y casos de día/franja y cancelada en planta 1 → el formato vive solo en `reports` (`cli` remite a él) y el escenario agrupado los cubre.
- **Aceptado** (2.ª ronda, Menor) — `PRODUCT.md` con «Sala (Norte, Sur)», Este como deriva con planta a validar, rango de enteros → Scope y decisiones 1, 5 y 9.
- **Rechazado** (2.ª ronda, Menor) — dos revisores frente al mínimo de una: la rúbrica exige dos con MODIFIED y contrato público; la línea del mínimo es solo el registro de lo que se dejaría sin mirar.
- **Rechazado** (dominio, Menor) — «Conserjería» como actor ajeno a PRODUCT.md → lo dijo el dev-lead en el Intent y `reports.md` ya lo nombra.

## Intent

Conserjería reparte la limpieza por plantas y hoy saca la ocupación a mano, sala por sala. Quiere el informe agrupado por planta, y de paso quien reserva quiere ver solo lo que tiene cerca.

## Scope

- Entra: la lista de salas de `src/app.js` guarda la planta de cada una y suma Este (planta 1).
- Entra: el comando `informe` en `src/app.js` muestra la ocupación por planta, con una cifra por cada una.
- Entra: `libres <franja> --planta <n>` lista solo las salas libres de esa planta.
- Entra: `README.md` explica cómo leer el informe.
- Entra: `PRODUCT.md` recoge el término «planta» y suma Este al ejemplo de «Sala».
- Entra: `test/app.test.js` cubre la agrupación, el filtro y el cambio de `libres` por Este.
- No entra: reservar por planta; exportar el informe.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «`libres` no acepta más argumentos ni opciones que la franja» | `capabilities/cli.md` | sustituido por el MODIFIED de `cli` |
| `libres` sin `--planta` listaba `Sur` | `test/app.test.js` | pasa a `Sur, Este` (decisión 5) |

- Filas que implementa: 0029 → nada que retirar: `git grep` de `0029`, `planta`, `--planta`, `informe` y `Este` fuera de las carpetas de evidencia solo da la propia fila de `ROADMAP.md` y los textos de `capabilities/` ya citados.

## Approach

**Enfoque elegido: la planta va en la propia lista de salas**, junto al nombre. Norte y Sur están en la 0 y Este en la 1. El informe recorre la lista y acumula por planta.

- A (elegido): campo `planta` en cada sala de la lista. Cambio mínimo y una sola fuente de verdad; no escala a edificios grandes, que hoy no hay.
- B: tabla aparte planta → salas. Duplica el catálogo y puede desincronizarse.
- C: fichero de configuración de plantas. Añade un fichero y una carga para tres salas.

## Dónde se prueba

- planta de una sala, filtro de `libres` y agrupación del informe: por el comando (`run`), como `test/app.test.js`. Las reservas de los GIVEN las siembra el fixture `bookings` del test, como hace hoy el test de `libres`; `reservar` no cambia en esta feature.

## Términos y ADR

- Términos resueltos: «planta» (decisión 9)
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `rooms`

#### MODIFIED — Las salas del edificio

- GIVEN el catálogo de `src/app.js`
- WHEN la herramienta arranca
- THEN conoce Norte, Sur y Este, y cada sala tiene una planta: Norte y Sur en la 0, Este en la 1
- AND la planta se observa con `libres <franja> --planta <n>`

### Capacidad: `reports`

#### MODIFIED — El informe cuenta las reservas activas

- GIVEN dos reservas activas y una cancelada, las tres en Norte
- WHEN se pide el informe de ocupación con `informe`
- THEN cuenta dos, en la línea `planta 0: 2`, y la cancelada no cuenta

#### ADDED — La ocupación se agrupa por planta

- GIVEN dos reservas activas en Norte, en días y franjas distintos, una activa en Este y una cancelada en Este
- WHEN se pide el informe con `informe`
- THEN sale `planta 0: 2` y después `planta 1: 1`: se cuentan todas las activas sin distinguir día ni franja, y la cancelada de la planta 1 no cuenta

#### ADDED — Una planta sin reservas sale con cero

- GIVEN una reserva activa en Norte y ninguna en Este
- WHEN se pide el informe con `informe`
- THEN sale `planta 0: 1` y después `planta 1: 0`

### Capacidad: `cli`

#### MODIFIED — Consultar las salas libres

- GIVEN una franja válida
- WHEN la persona ejecuta `libres <franja>`
- THEN lista las salas libres, separadas por comas, de todas las plantas
- AND `libres` acepta además `--planta <n>` y entonces lista solo las salas libres de esa planta
- AND `libres` no acepta más argumentos ni opciones que la franja y `--planta`

#### ADDED — Salas libres de todas las plantas

- GIVEN Norte reservada de 10:00-12:00
- WHEN la persona ejecuta `libres 10:00-12:00`
- THEN responde `Sur, Este`, en el orden del catálogo

#### ADDED — Salas libres de una planta

- GIVEN Norte y Sur en la planta 0, Este en la 1, y Norte reservada de 10:00-12:00
- WHEN la persona ejecuta `libres 10:00-12:00 --planta 1`
- THEN responde `Este`
- AND con `libres --planta 0 10:00-12:00` responde `Sur`

#### ADDED — Planta sin salas o inválida

- GIVEN el catálogo anterior
- WHEN la persona ejecuta `libres 10:00-12:00 --planta 7`
- THEN responde vacío (cadena vacía)
- AND con `--planta` sin valor, con `--planta x`, con `--planta 1.5` o con `--planta 99999999999999999999` responde `planta no válida`
- AND con `--planta -1` no es inválida: responde vacío
- AND con `--planta 1 --planta 0` o con un argumento sobrante, como `libres 10:00-12:00 --planta 1 x`, responde `libres: argumentos no válidos`

#### ADDED — El informe se pide por comando

- GIVEN una reserva activa en Este y otra en Norte, sembradas en ese orden
- WHEN la persona ejecuta `informe`
- THEN responde las dos líneas del informe de `reports` (`planta 0: 1`, `planta 1: 1`), la 0 primero; el formato vive solo en `reports`
- AND `informe x` responde `informe no acepta argumentos`

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
