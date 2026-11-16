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

🦆 Hoy, si alguien pide las salas libres en una franja de cero minutos, como de 10:00 a 10:00, la herramienta responde «Norte, Sur» como si la franja fuera normal. Con este cambio, una franja cuyo final no va después del inicio, como de 12:00 a 10:00 o de 10:00 a 10:00, recibe «franja no válida: el final va después del inicio». Las horas se comparan como horas, no como texto: de 9:00 a 10:00 sigue siendo una franja válida y responde como hoy. Si lo que se escribe no tiene forma de hora («abc», o nada), no se comprueba nada y sigue como hoy: el formato es otra fila de deuda. Una franja válida como 10:00-12:00 sigue respondiendo «Sur», porque Norte tiene su reserva del lunes.

Validación: dev-lead — cambia el texto que ve quien usa la herramienta.

## Capacidades

- Nuevas: `rooms` — lo que se ve al consultar las salas; hoy solo el listado de libres por franja.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (sonnet, los siete puntos) — señales: capacidad nueva (`rooms`) · tamaño: ~15 líneas en 2 ficheros (`src/app.js`, `test/app.test.js`)
- Revisor único (sonnet): si los escenarios de `10:00-10:00` (el caso de conserjería), `12:00-10:00` y `10:00-9:00` cubren la regla «final estrictamente después del inicio, en minutos» y si `rooms` como capacidad nueva con `capabilities/` vacío es coherente (señal: capacidad nueva)
- Mínimo razonable: sin revisor, solo el repaso de coherencia — deja sin mirar que un valor de franja que nadie pensó rompa el comando sin que ningún escenario lo diga

1. Capacidad nueva `rooms` (inglés, kebab-case: el identificador es un nombre de fichero), porque `capabilities/` está vacío y el fusionador rechaza un `MODIFIED` sobre una capacidad que no existe. Los requisitos entran como `ADDED` con lo que ya hace la herramienta (`libres 10:00-12:00` → `Sur`, el test `libres excluye la sala reservada en la franja`) más el rechazo; solo se fija lo que mide un escenario.
2. El caso que reportó conserjería, `libres 10:00-10:00` (hoy responde «Norte, Sur», comprobado), es el que esta spec cierra; tiene su escenario. La regla: el final debe ir **estrictamente después** del inicio; cero minutos también se rechaza.
3. El texto de la respuesta: «franja no válida: el final va después del inicio».
4. «Después» se decide leyendo cada extremo como `H:MM` o `HH:MM` y comparando en minutos: así `9:00-10:00` sigue siendo válida (comparar como texto la rechazaría) y `10:00-9:00` se rechaza. Si un extremo no tiene esa forma, o no hay franja, la comprobación no se aplica y `libres` sigue como hoy (lista las salas sin la franja o con ella tal cual): validar el formato es la fila de deuda «Sin validación del formato de franja horaria» y no entra. Comprobado contra el código de hoy: `libres`, `libres abc`, `libres 12:00-abc`, `libres 10:00-10:30` y `libres 9:00-10:00` responden todos «Norte, Sur». «Forma de hora» es solo la forma `H:MM`/`HH:MM`, sin comprobar el rango: `25:00-10:00` tiene forma de hora y se rechaza porque 25:00 va después de 10:00.
5. La 0021 no tiene fila en `ROADMAP.md`; el id sale de la rama (`sdd id claim`: «sin remoto: la 0021 vale (contador local)»). No añado la fila: lo decide quien planifica.
6. Enfoque: A, frente a B y C (ver Approach).
7. Fusión probada en una copia de `.docs/sdd` (`sdd capability merge`): «rooms.md: añadido «Ver las salas libres»» y «rooms.md: añadido «Rechazar una franja no válida»», salida 0; repetida con la versión final tras las dos rondas de review (2 requisitos y las 5 reglas añadidos, salida 0).
- Política de modelos: revisor de la spec uno, sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — Crítico: comparar como texto rechaza `9:00-10:00`, una franja válida → decisión 4 reescrita (comparar en minutos), escenarios de `9:00-10:00` y `10:00-9:00`, 🦆 corregido.
- **Aceptado** — `10:00-12:00` → `Sur` pasa con un «Sur» fijo → escenario `14:00-15:00` → `Norte, Sur` en «Ver las salas libres».
- **Aceptado** — sin «Reglas de la capacidad» → añadida la sección con las cinco por nombre.
- **Aceptado** — `libres` sin franja puede lanzar una excepción → decisión 4 (no se aplica la comprobación) y su escenario.
- **Aceptado** — el escenario de rechazo agrupa dos casos y repite el `AND` → un escenario por caso.
- **Aceptado, en parte** — el comportamiento vivo está poco descrito → el requisito se limita a lo que miden los escenarios (decisión 1); el separador de la lista y el caso de cero salas libres no se fijan.
- **Segunda ronda — Aceptado** — los minutos no se medían → escenarios `10:30-10:15` (rechaza) y `10:00-10:30` (válida).
- **Segunda ronda — Aceptado** — la rama «sin forma de hora» no tenía escenario → escenario `libres abc`; la salida de hoy de `libres`, `abc`, `12:00-abc` está comprobada (decisión 4).
- **Segunda ronda — Aceptado** — el GIVEN «del lunes» era ambiguo, `libres` no recibe día → GIVEN reescrito.
- **Segunda ronda — Aceptado** — el Scope prometía `freeRooms` y el enfoque A no lo toca → Scope corregido.
- **Segunda ronda — Aceptado** — Intent más amplio que la regla → «con forma de hora», y `25:00` queda decidido (decisión 4); excepción de `rooms` anotada en «Idioma de los nombres».
- **Segunda ronda — Rechazado** — separar «hechos» de «decisiones» → la plantilla tiene un solo bloque exhaustivo y el id sin fila de roadmap lo valida quien planifica.
- **Rechazado** — mover la fusión y el contador del id fuera de las decisiones → la línea con el resultado de la fusión en la copia va en ✋ por regla del repaso de coherencia, y el id sin fila es una decisión que valida quien planifica.
- **Rechazado** — renombrar `rooms` a `salas` → el identificador de capacidad es un nombre de fichero en inglés por regla de la spec; el texto que ve quien usa la herramienta está en castellano.
- **Rechazado** — citar funciones en vez de líneas → el repaso de coherencia pide el fichero:línea de cada caso real; se citan ambos (función y línea).

## Intent

Hoy `libres` acepta cualquier franja y responde con salas libres aunque la franja no tenga sentido: `libres 10:00-10:00` responde «Norte, Sur». Debe rechazarla con un texto claro. Éxito: ninguna franja con forma de hora y con el final igual o anterior al inicio devuelve salas; y toda franja válida de hoy (`10:00-12:00`, `9:00-10:00`) responde igual que antes. Fracaso aunque funcione: que la comprobación rechace una franja válida.

## Scope

- Entra: `run('libres', …)` y una función pura nueva que compara los extremos, en `src/app.js`; sus tests en `test/app.test.js`. `freeRooms` no cambia.
- No entra: el formato `HH:MM`, que es la fila de deuda «Sin validación del formato de franja horaria»; el nombre del comando (`CHANGELOG.md:10` dice `salas libres`; es el texto de una release ya cerrada y no se toca).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Que `libres` conteste con salas a una franja con el final igual o anterior al inicio | `freeRooms` (`src/app.js:5`), `run` (`src/app.js:28`) | Scope + requisito «Rechazar una franja no válida» |
| El test que fija el comportamiento válido de hoy | `test/app.test.js:5` | se conserva tal cual: es el primer escenario de «Ver las salas libres» |

- Filas que implementa: 0021 → nada: comprobado con `git grep -n 0021 -- . ':!.docs/sdd/specs'` (0 aciertos; no tiene fila en `ROADMAP.md`).

## Approach

- A — comprobar en `run('libres', …)` antes de llamar a `freeRooms`: una función pura pequeña que lee cada extremo (`H:MM` o `HH:MM`) y compara en minutos; si algún extremo no se lee, no rechaza. El mensaje es texto de salida y `freeRooms` sigue devolviendo solo salas. Coste: la regla queda en el punto de entrada, no en `freeRooms`.
- B — comprobar dentro de `freeRooms` y devolver el mensaje desde ahí: mezcla dos tipos de resultado (lista de salas / texto) en una función.
- C — módulo nuevo `slot.js` para validar franjas: sobra con un solo fichero de entrada (`architecture.md`: «Un solo fichero de entrada: `src/app.js`»).
- Elegido: A — respeta que `freeRooms` devuelva solo salas y no añade ficheros.

## Dónde se prueba

- La franja: por `run('libres', …)`, en `test/app.test.js`, como el test existente de `libres`.

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — Ver las salas libres

- GIVEN la reserva de Norte de 10:00 a 12:00 (`libres` no pregunta por día: la reserva cuenta siempre)
- WHEN `libres 10:00-12:00`
- THEN responde `Sur`

- GIVEN la misma reserva
- WHEN `libres 14:00-15:00`
- THEN responde `Norte, Sur`

- GIVEN la misma reserva
- WHEN `libres` sin franja
- THEN responde `Norte, Sur`

- GIVEN la misma reserva
- WHEN `libres abc`
- THEN responde `Norte, Sur` (sin forma de hora no se comprueba la franja)

#### ADDED — Rechazar una franja no válida

- GIVEN la reserva de Norte del lunes de 10:00 a 12:00
- WHEN `libres 12:00-10:00`
- THEN responde «franja no válida: el final va después del inicio»

- GIVEN la misma reserva
- WHEN `libres 10:00-10:00`
- THEN responde «franja no válida: el final va después del inicio»

- GIVEN la misma reserva
- WHEN `libres 10:00-9:00`
- THEN responde «franja no válida: el final va después del inicio»

- GIVEN la misma reserva
- WHEN `libres 10:30-10:15`
- THEN responde «franja no válida: el final va después del inicio»

- GIVEN la misma reserva
- WHEN `libres 9:00-10:00`
- THEN responde `Norte, Sur`

- GIVEN la misma reserva
- WHEN `libres 10:00-10:30`
- THEN responde `Norte, Sur`

#### Reglas de la capacidad — rooms

- **Dónde viven los datos**: no aplica (las reservas ya viven en `src/app.js`; esta spec no añade datos).
- **Idioma de los nombres**: castellano, el texto de la respuesta («franja no válida: el final va después del inicio»); el identificador `rooms` es la excepción, por ser un nombre de fichero.
- **Límites**: el final de la franja va estrictamente después del inicio, en minutos.
- **Avisos**: «franja no válida: el final va después del inicio».
- **Regla ante conflicto**: no aplica (no hay escritura; la franja no válida se rechaza antes de mirar las reservas).

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
