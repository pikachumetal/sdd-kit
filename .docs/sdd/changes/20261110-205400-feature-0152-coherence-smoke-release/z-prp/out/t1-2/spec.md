---
id: 20261008-110000-feature-0011-void-others
feature: 0011
title: Anular reservas de otros
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

# Spec — Anular reservas de otros

Validación: dev-lead — es un comando que usa una persona y los textos de rechazo los lee quien lo ejecuta.

## Capacidades

- Nuevas: `room-managers` — quién es responsable de cada sala.
- Nuevas: `bookings` — reservas de salas; esta feature solo recoge cómo se anulan (hoy no hay capacidades escritas, ver ✋ 3).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`room-managers`, `bookings`), contrato público (`--como`, formato de `data/managers.json`), datos (fichero nuevo), regla de permisos (quién anula) · tamaño: ~90 líneas en 8 ficheros
- Dominio (opus): qué NO puede hacer quien no es responsable (omitir `--como`, sala sin responsable, el dueño de la reserva) y el solape con la 0009 (señal: permisos)
- Técnica (sonnet): lectura de `data/managers.json` y su fallo, orden de comprobación y que cada AND de `bookings` tenga test que falle sin el cambio (señal: contrato público + datos)
- Mínimo razonable: solo técnica — deja sin mirar el complemento de permisos, el hueco que no se ve hasta que alguien anula lo que no debía

Delta probado en una copia de `.docs/sdd`: `sdd capability merge` → `room-managers.md` y `bookings.md`, sin rechazos (repetido tras cada ronda de review).

### Hallazgos de la review

- **Aceptado** — técnica 1: el escenario de `room-managers` se cumplía a ojo → ahora se observa por `anular` con un fichero de datos distinto (Marta) y la sala ausente tiene su escenario.
- **Aceptado** — técnica 2 y 3: ruta del fichero sin definir → ✋ 10: relativa al módulo y sustituible en test por parámetro.
- **Aceptado** — técnica 4: fallo de lectura engañoso → ✋ 11 y dos escenarios (fichero ausente, fichero no válido).
- **Aceptado** — técnica 5: contrato de `--como` → ✋ 12 y escenarios (sin valor, mayúsculas).
- **Aceptado** — técnica 6 y dominio 4, 5: orden de comprobación y sala sin responsable → escenarios nuevos con la reserva que sigue activa.
- **Aceptado** — técnica 7: el efecto de anular se comprueba con una segunda llamada.
- **Aceptado** — técnica 8: ✋ 13 (un responsable por sala; `cancelar` no cambia).
- **Aceptado** — técnica 9: el esquema mínimo y la regla para la 0009 van en ✋ 1.
- **Aceptado** — técnica 10 y dominio 10: los tests usan `test/fixtures/managers.json`; el fichero real lleva valores de ejemplo que el dev-lead sustituye en la validación (✋ 9).
- **Aceptado** — dominio 2: el hueco del dueño pasado el plazo de 24 h, declarado en ✋ 5.
- **Aceptado** — dominio 3: el control es de buena fe, declarado en Intent y ✋ 4.
- **Aceptado** — dominio 6: bloque «Reglas de la capacidad — bookings».
- **Aceptado** — dominio 7: aviso escrito como regla y límite precisado.
- **Aceptado** — dominio 8 y 9: regla ante conflicto con la 0009 y formato heredado, en ✋ 1.
- **Rechazado** — dominio 1 y ronda 2 (2): los slugs `bookings` y `room-managers` van en inglés porque son un nombre de fichero (regla de `spec-writing.md`), una excepción consciente al glosario de `PRODUCT.md`, que rige para lo que ve el usuario; el contenido sigue en castellano.

Segunda ronda (sin Críticos, sin tercera ronda):

- **Aceptado** — 1: cada escenario siembra su reserva y «sigue activa» se comprueba con una segunda llamada autorizada que responde «anulada…».
- **Aceptado** — 3 y 4: posición de `--como` con escenario, `--como=` y valor repetido en ✋ 12; «válido» definido y sala heredada (`constructor`) con escenario, en ✋ 11.
- **Aceptado** — 5 y 6: fixtures listadas en Scope; el contrato `run(cmd, params, dataDir?)` entra en la tabla de lo que cambia de forma.
- **Aceptado** — 7: acción sobre la fila 0009 en Scope y ✋ 1.
- **Aceptado** — 8: avisos completos y literales con plantilla `SALA`.
- **Aceptado** — 9: quitado el AND de Pedro (no se observa); el orden se prueba con una reserva viva.
- **Aceptado** — 10: sustituir `Ana` y `Luis` es un punto explícito de la validación (✋ 9).

1. **Solape con la 0009 (decide tú).** La 0009 «Responsables de sala» está ⏳ y `docs/config.md` dice que su fichero lo define ella; esta spec define `data/managers.json`. Propongo que la 0011 lo cree con lo mínimo y la 0009 lo amplíe, sin `Tras`; al archivar, la fila 0009 del roadmap lleva la nota «esquema mínimo de `data/managers.json` ya hecho por la 0011». Esquema mínimo: objeto plano sala → nombre (cadena). Si la 0009 necesita más campos o varios responsables, su spec modifica `room-managers` y migra el formato; manda siempre la última spec aprobada. Alternativa: `Tras: 0009` y esta feature solo consume el fichero (queda bloqueada hasta que se diseñe). Si eliges la alternativa, reescribo la spec.
2. Capacidad nueva `room-managers`, con los responsables en `data/managers.json` (`{"Norte": "Ana", "Sur": "Luis"}`).
3. Capacidad nueva `bookings` (no hay `capabilities/`: un `MODIFIED` no tiene qué modificar). Solo trae el requisito de anular; el resto de reservas queda sin documentar.
4. Quien ejecuta el comando se identifica con `--como NOMBRE`. Es de buena fe: nadie lo autentica, quien escriba `--como Ana` pasa por Ana. Encaja con una herramienta de un solo usuario (`PRODUCT.md`); la regla evita errores, no ataques.
5. `anular` solo lo hace el responsable de la sala, también sobre una reserva propia: quien reservó y no es responsable usa `cancelar`, que `PRODUCT.md` limita a antes de 24 h. Pasado ese plazo, el dueño no tiene salida: lo acepto como hueco de esta feature.
6. Textos, literales: «solo RESPONSABLE anula reservas de SALA» · «falta --como NOMBRE» · «SALA no tiene responsable» · «anulada Norte lun» · «sin reserva Norte mar» (este último, el de hoy); SALA, RESPONSABLE y NOMBRE son huecos que se rellenan con el dato.
7. Orden de comprobación: `--como`, lectura del fichero, responsable de la sala, quién es, y solo después si hay reserva, para no decir a un no autorizado qué reservas existen.
8. Enfoque: A (leer `data/managers.json` en cada llamada), frente a B (constante en `src/app.js`) y C (variable de entorno); ver Approach.
9. Valores de ejemplo `Ana` y `Luis` en `data/managers.json`: inventados; los reales son tuyos y sustituirlos es un punto explícito de la validación: hasta entonces, quien escriba `--como Ana` anula en Norte. Los tests no los usan: llevan su fixture.
10. Ruta del fichero: relativa a `src/app.js`, no al directorio de trabajo; `run(cmd, params, dataDir)` admite un tercer parámetro opcional con la carpeta de datos, que los tests usan para su fixture.
11. Fallo de lectura: fichero ausente → «falta data/managers.json»; no válido → «data/managers.json no es válido»; nadie anula en ninguno de los dos casos. Válido es un objeto plano con valores cadena no vacíos (un array, `null`, `{"Norte": ["Ana"]}` o un valor vacío no lo son); una sala solo existe si es clave propia del objeto (`constructor` no tiene responsable).
12. `--como`: puede ir en cualquier posición y el valor es el argumento siguiente; se compara tal cual (`ana` no es `Ana`); sin valor o vacío cuenta como ausente; `--como=Ana` no se reconoce (ausente); si se repite, vale el primero.
13. Un responsable por sala; una persona puede serlo de varias. `cancelar` no cambia.
- Política de modelos: revisores de la spec, dominio opus y técnica sonnet, más una segunda ronda sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · hasta `control.maxParallelAgents`.

### Decisiones tomadas con el dev-lead

- Solo el responsable de cada sala anula reservas de otras personas — viene de la fila 0011 del roadmap («solo el responsable de cada sala anula reservas de otras personas»).

## Intent

Hoy `anular SALA DÍA` anula cualquier reserva, la pida quien la pida. Solo el responsable de cada sala debe poder anular. Éxito: `anular Norte lun --como Luis` no toca la reserva y dice quién sí puede; con `--como Ana` la anula. Fracaso, aunque funcione: que anule alguien que no es responsable por omitir `--como`, por una sala sin responsable o porque el fichero falte. El control es de buena fe (✋ 4).

## Scope

- Entra: `anular SALA DÍA --como NOMBRE` en `src/app.js` (`voidBooking` y `run`); `data/managers.json`; `test/void.test.js` y sus fixtures (`test/fixtures/managers.json` con Marta, una carpeta sin fichero y una con JSON roto o de forma errónea); la nota en la fila 0009 de `ROADMAP.md` al archivar; las líneas de `docs/config.md` sobre `data/` y responsables.
- No entra: `cancelar`, que sigue igual; alta o cambio de responsables por comando; guardar quién reservó.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `anular SALA DÍA` sin `--como` deja de anular | `src/app.js:20`, `src/app.js:31` | `bookings`, ADDED «Anular una reserva» y Scope |
| «Responsables de sala: aún no hay; … los define la 0009» | `docs/config.md:4` | Scope: se reescribe con `data/managers.json`; ✋ 1 |
| «`data/`: … Hoy no hay ninguno» | `docs/config.md:3` | Scope: pasa a nombrar `managers.json` |
| `run(cmd, params)` pasa a `run(cmd, params, dataDir?)` | `src/app.js:27`, `test/app.test.js`, `test/cancel.test.js` | ✋ 10; el valor por defecto no cambia `libres`, `reservar` ni `cancelar`, y sus tests no se tocan |

- Filas que implementa: 0011 → `ROADMAP.md:9` (su fila, que se cierra al archivar); además `docs/config.md:4` nombra la 0009 → ✋ 1.

## Approach

- A, leer `data/managers.json` en cada llamada — un fichero que se edita sin tocar código; un poco de E/S por comando, irrelevante en una CLI.
- B, constante en `src/app.js` — lo más simple, pero cambiar un responsable es cambiar código y choca con el espíritu de la 0009.
- C, variable de entorno — nadie la pidió y es peor de mantener.
- Elegido: A, por ser lo que pide la decisión 2 y dejar el dato fuera del código.

`anular` busca `--como NOMBRE` en los parámetros, lee el fichero de `dataDir` (✋ 10) y compara; los fallos de lectura se dicen (✋ 11).

## Dónde se prueba

- anular con y sin permiso: por `run('anular', [...], fixtureDir)`, como `test/cancel.test.js`; la reserva sembrada de Norte lun es la fixture de reservas y `test/fixtures/managers.json`, la de responsables.
- fichero ausente, JSON roto o de forma errónea y sala `constructor`: una carpeta de fixture por caso, sin pantalla. Cada escenario que anula parte de la reserva sembrada activa: cómo se reinicia el estado en memoria entre tests lo fija el plan.

## Términos y ADR

- Términos resueltos: Anulación — la hace el responsable de sala (ya en `PRODUCT.md`).
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `room-managers`

#### ADDED — Cada sala tiene un responsable

- GIVEN un fichero de responsables `{"Norte": "Marta"}` y reservas activas de Norte y de Sur el lunes
- WHEN `anular Norte lun --como Ana`
- THEN responde «solo Marta anula reservas de Norte» y la reserva sigue activa: `anular Norte lun --como Marta` responde después «anulada Norte lun»
- AND `anular Sur lun --como Marta` responde «Sur no tiene responsable» y la reserva de Sur sigue activa

#### ADDED — Sin fichero válido nadie anula

- GIVEN la reserva activa de Norte el lunes y la carpeta de datos sin `managers.json`
- WHEN `anular Norte lun --como Ana`
- THEN responde «falta data/managers.json» y la reserva sigue activa
- AND con un `managers.json` que no es JSON, o que es un array o `{"Norte": ["Ana"]}`, responde «data/managers.json no es válido» y la reserva sigue activa
- AND con un `managers.json` válido `{"Norte": "Ana"}`, `anular constructor lun --como Ana` responde «constructor no tiene responsable»

#### Reglas de la capacidad — room-managers

- **Dónde viven los datos**: `data/managers.json`, objeto plano sala → nombre.
- **Idioma de los nombres**: castellano, salas con su nombre propio (Norte, Sur).
- **Límites**: un responsable por sala; una persona puede serlo de varias.
- **Avisos**: «SALA no tiene responsable» si la sala no está en el fichero; «solo RESPONSABLE anula reservas de SALA» · «falta --como NOMBRE» · «falta data/managers.json» · «data/managers.json no es válido».
- **Regla ante conflicto**: si la 0009 redefine el fichero, su spec modifica esta capacidad y manda la última aprobada.

### Capacidad: `bookings`

#### ADDED — Anular una reserva

- GIVEN la reserva activa de Norte el lunes, y Ana responsable de Norte
- WHEN `anular Norte lun --como Luis`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa
- AND `anular Norte lun --como Ana` responde «anulada Norte lun» y una segunda llamada igual responde «sin reserva Norte lun»
- AND `anular --como Ana Norte lun` (con `--como` al principio) responde «anulada Norte lun»
- AND `anular Norte lun` y `anular Norte lun --como` responden «falta --como NOMBRE» y la reserva sigue activa
- AND `anular Norte lun --como ana` responde «solo Ana anula reservas de Norte»
- AND `anular Norte lun --como=Ana` responde «falta --como NOMBRE»
- AND `anular Norte mar --como Luis`, sin reserva ese día, responde «solo Ana anula reservas de Norte»
- AND `anular Norte mar --como Ana` responde «sin reserva Norte mar»
- AND `anular Este lun` responde «falta --como NOMBRE», y con `--como Ana` responde «Este no tiene responsable»

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: las reservas viven en memoria (`operations.md`).
- **Idioma de los nombres**: castellano (constitución, punto 4).
- **Límites**: no aplica.
- **Avisos**: «solo RESPONSABLE anula reservas de SALA», «falta --como NOMBRE», «SALA no tiene responsable», «sin reserva SALA DÍA», «falta data/managers.json», «data/managers.json no es válido».
- **Regla ante conflicto**: no aplica.

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
