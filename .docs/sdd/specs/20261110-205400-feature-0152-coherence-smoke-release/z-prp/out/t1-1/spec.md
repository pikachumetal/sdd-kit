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

🦆 Hoy cualquiera puede anular cualquier reserva con `anular Norte lun`. Con este cambio, anular exige decir quién eres (`--como Luis`) y solo el responsable de la sala puede anular: si Luis intenta anular la reserva de Pedro en Norte, ve «solo Ana anula reservas de Norte» y la reserva sigue ahí; si lo hace Ana, ve «anulada Norte lun». Los responsables salen de un fichero nuevo, `data/managers.json`. Ojo: nadie comprueba que `--como Ana` lo escriba Ana; es una herramienta personal sin login.

Validación: dev-lead — es un comando que usa una persona y cambia lo que ve al anular.

## Capacidades

- Nuevas: `room-managers` — quién es responsable de cada sala.
- Nuevas: `bookings` — de momento solo anular una reserva; el resto del comportamiento de las reservas sigue sin capacidad escrita.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`room-managers`, `bookings`), contrato público (el comando `anular` cambia de forma), datos nuevos (`data/managers.json`, el dueño `by`), reglas de permiso (responsable de sala) · tamaño: ~60 líneas en 5 ficheros
- Dominio (opus): si el rechazo cubre lo que el responsable NO deja hacer a los demás, y si el Intent promete lo mismo que el delta (señal: regla de permiso)
- Técnica (sonnet): si cada THEN de «Anular una reserva» pasa sin el comportamiento (el texto `anulada…` lo escribe cualquiera) y si el dueño `by` está declarado (señal: datos nuevos + contrato)
- Mínimo razonable: solo técnica — deja sin mirar el complemento del rol de responsable, el hueco que no se ve hasta que alguien anula lo que no debía

1. Capacidad nueva `room-managers`, con los responsables en `data/managers.json` (`{"Norte": "Ana", "Sur": "Luis"}`). **Choca con la 0009** (ver 7).
2. Quien ejecuta el comando se identifica con `--como <nombre>`. La identidad es declarada y no se verifica: la herramienta es personal y `operations.md` dice «sin login».
3. `bookings` se declara capacidad nueva y el requisito «Anular una reserva» entra como `ADDED`, no `MODIFIED`: no hay `capabilities/` y la fusión rechaza modificar lo que no existe. Es la primera capacidad de reservas; el resto del comportamiento no se documenta aquí. Los slugs van en inglés aunque PRODUCT.md evite «booking» y «room» en el texto (regla del slug).
4. La reserva guarda quién la hizo (`by`), y la reserva sembrada en el código (Norte, lunes, 10:00-12:00) pasa a ser de Pedro. Hoy no tiene dueño y sin dueño no hay «reserva de otra persona».
5. Textos: «solo <responsable> anula reservas de <sala>» al rechazar; «<sala> no tiene responsable» si la sala no está en el fichero; «indica quién eres: `--como <nombre>`» si falta `--como`. «anulada <sala> <día>» no cambia.
6. Quien no es responsable recibe el rechazo aunque la reserva sea suya: anular es del responsable (PRODUCT.md, «Anulación») y lo propio es cancelar, que no cambia.
7. **La 0009 («Responsables de sala», pendiente, sin `Tras`) es la fila que `docs/config.md:4` dice que define quién es cada responsable y su fichero.** Esta spec lo decide aquí. Dos salidas: (a) la 0011 va `Tras` la 0009 y esta spec deja de crear `room-managers` y el fichero, y solo lee lo que la 0009 defina (recomendada si la 0009 se va a hacer); (b) se queda como está y la 0009 se redefine para no repetirlo. Tal como está escrita sigue (b).
8. Nombre con otra mayúscula (`ana` frente a `Ana`): se compara tal cual, así que se rechaza. Una sala que no esté en el fichero: se rechaza con el texto de 5. Reserva sin `by`: hoy solo existe la sembrada; qué pasa con una creada sin dueño queda para la fila que cree reservas con dueño.
9. Reglas de `room-managers` y de `bookings` (la constitution no tiene «Reglas de producto»): datos en `data/managers.json` y `by` en la reserva; nombres de sala como en PRODUCT.md; sin topes; avisos los textos de 5; conflicto: sala sin responsable → rechazo de 5.
10. Los nombres Ana, Luis y Pedro son inventados. Los tests usan su propio fichero de prueba, no `data/managers.json`: el del producto se entrega con Ana y Luis como marcadores y los sustituyes por los nombres reales.
11. Enfoque: A (`anular` lee el fichero), frente a B (esperar a la 0009 y usar lo que defina) y C (responsables fijos en `src/app.js`). Ver Approach.
12. Delta probado en una copia: `sdd capability merge` → `room-managers`: 2 requisitos + 5 reglas · `bookings`: 5 requisitos + 5 reglas, salida 0 (comprueba la forma del texto, no el comportamiento). Con `MODIFIED` sobre `bookings` lo rechazaba («no tiene fichero en capabilities/»).
13. Orden de comprobación de `anular`: primero `--como` (si falta, su aviso), luego que la sala tenga responsable, luego que quien pide sea ese responsable, y al final que exista la reserva («sin reserva <sala> <día>», como hoy). Por eso `anular Sur mar --como Ana` se rechaza aunque no haya reserva.
- Política de modelos: revisores de la spec — dominio opus, técnica sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — Crítico: el escenario de `room-managers` no tenía acción observable → ahora es `anular Norte lun --como Luis` con el fichero de prueba, y rechaza nombrando a Ana.
- **Aceptado** — Crítico: el GIVEN «reserva de Pedro» no se podía cumplir → Scope: la reserva sembrada lleva `by: Pedro`; decisiones 4 y 8.
- **Aceptado** — el caso del dueño que anula la suya es un escenario propio, y `cancelar` sigue cubierto por `test/cancel.test.js` (sin cambios).
- **Aceptado** — «anulada» no probaba que se anulara → el escenario pide además que repetir `anular` diga «sin reserva Norte lun».
- **Aceptado** — huecos de la decisión 8 (sala sin responsable, mayúsculas) → decididos por mí en 5, 8 y con escenarios.
- **Aceptado** — `anular` sin `--como` es una ruptura → fila nueva en la tabla; `git grep -n anular` fuera de las specs solo da `src/app.js` y el término de `PRODUCT.md`.
- **Aceptado** — faltaban las reglas de `bookings`, la línea 3 de `docs/config.md` en Scope, la identidad declarada (Intent y «No entra») y el Intent más corto que el delta → corregidos.
- **Aceptado** — la fixture era dato de producto → decisión 10.
- **Aceptado** — el merge de la copia solo valida la forma → dicho en 12.
- **Rechazado** — renombrar las capacidades a castellano → el slug es nombre de fichero en inglés kebab-case por regla del kit (decisión 3).
- **Rechazado** — quitar el nombre del aprobador (Laura) → viene de la spec que me dieron y no lo cambio sin que lo digas.
### Hallazgos de la segunda ronda

- **Aceptado** — Crítico: el orden de comprobaciones no estaba dicho → decisión 13.
- **Aceptado** — Crítico: tres reglas en un solo requisito → un requisito por regla (responsable de otra sala, dueño, mayúsculas, sin `--como`).
- **Aceptado** — el escenario de `room-managers` pasaba con responsables en el código → escenario con `Marta`.
- **Aceptado** — Ana en Sur, la fila de `by` en la tabla, el Intent sobre `cancelar`, el conflicto repetido en dos capacidades y los marcadores del fichero → corregidos.
- **Abierto** — cerrar la 0009 antes de aprobar (lo repite esta ronda): sigue como pregunta del gate, no la decido yo.

### Primera ronda (continuación)

- **Abierto** — cerrar la 0009 (decisión 7) antes de aprobar: lo planteo en el gate, no lo decido yo.

### Decisiones tomadas con el dev-lead

- Solo el responsable de cada sala anula reservas de otras personas — roadmap, fila 0011.

## Intent

Hoy cualquiera anula cualquier reserva: `anular` no mira quién lo pide. Solo el responsable de la sala debe poder anular, también la reserva de quien la hizo (lo propio es cancelar, que esta spec no toca). Falla si Luis anula la de Pedro en Norte, o si Ana no puede anularla.

## Scope

- Entra: `anular <sala> <día> --como <nombre>` en `src/app.js`; `data/managers.json`; el dueño (`by: Pedro`) de la reserva sembrada; `test/void.test.js` con su fichero de responsables de prueba; las líneas 3 y 4 de `docs/config.md`.
- No entra: cancelar la propia reserva (sigue igual); avisos por correo (0008); cómo se crean reservas con dueño; comprobar que quien escribe `--como` es quien dice ser; redefinir la fila 0009 (si sigue (b) de la decisión 7, se hace aparte).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `anular <sala> <día>` sin `--como` deja de funcionar (ruptura) | `src/app.js:20` (`voidBooking`), `src/app.js:31` (`run`) | Scope + escenario «sin `--como`» |
| «Responsables de sala: aún no hay… los define la 0009» | `docs/config.md:4` | Scope + decisión 7 |
| `data/`: «Hoy no hay ninguno» | `docs/config.md:3` | Scope: pasa a listar `managers.json` |
| La reserva gana el campo `by` | `src/app.js:3` (reserva sembrada); la leen `anular` y nadie más: `cancelar` y `libres` lo ignoran | Scope + decisión 4 |
| «Anulación» (término) | `PRODUCT.md:14` | sin cambio: la spec lo aplica |

- Filas que implementa: 0011 → nada más la nombra (`git grep -n 0011` fuera de las specs y del roadmap: vacío). Toca lo que la 0009 nombra en `docs/config.md:4` → decisión 7.

## Approach

- A: `anular` lee `data/managers.json` y rechaza a quien no es responsable de la sala — un fichero y una función, se prueba con `run`; choca con la 0009 si ella define el fichero.
- B: esperar a la 0009 y leer lo que defina — sin solape; la 0011 no avanza hasta entonces.
- C: responsables fijos en `src/app.js`, junto a `rooms` — nada nuevo que leer; cambiar un responsable exige tocar código y no cubre «Responsables de sala».
- Elegido: A — el fichero lo pidió el dev-lead al escribir la spec; la salida (a) de la decisión 7 la convierte en B.

## Dónde se prueba

- Rechazo, anulación y huecos: `run('anular', [...])` con un fichero de responsables de prueba, como `test/cancel.test.js`.
- `cancelar`: sin cambios; lo cubre `test/cancel.test.js`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-managers`

#### ADDED — El responsable sale del fichero

- GIVEN el fichero de responsables con `{"Norte": "Ana", "Sur": "Luis"}` y la reserva de Norte del lunes, de Pedro
- WHEN `anular Norte lun --como Luis`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa

#### ADDED — El responsable se lee del fichero, no del código

- GIVEN el fichero de responsables con `{"Norte": "Marta"}` y la reserva de Norte del lunes, de Pedro
- WHEN `anular Norte lun --como Ana`
- THEN responde «solo Marta anula reservas de Norte» y la reserva sigue activa

#### Reglas de la capacidad — room-managers

- **Dónde viven los datos**: `data/managers.json`
- **Idioma de los nombres**: las salas, como en PRODUCT.md (Norte, Sur)
- **Límites**: no aplica: un nombre por sala, lo fuerza el formato `{"sala": "nombre"}`
- **Avisos**: no aplica
- **Regla ante conflicto**: sala que no está en el fichero → «<sala> no tiene responsable» y no se anula

### Capacidad: `bookings`

#### ADDED — Anular una reserva

- GIVEN la reserva de Norte del lunes, de Pedro, y Ana responsable de Norte
- WHEN `anular Norte lun --como Ana`
- THEN responde «anulada Norte lun»
- AND repetir `anular Norte lun --como Ana` responde «sin reserva Norte lun»

#### ADDED — Quien no es responsable de la sala no anula

- GIVEN Ana responsable de Norte y Luis de Sur, y sin reserva en Sur el martes
- WHEN `anular Sur mar --como Ana`
- THEN responde «solo Luis anula reservas de Sur»

#### ADDED — El dueño de la reserva no la anula

- GIVEN la reserva de Norte del lunes, de Pedro, y Ana responsable de Norte
- WHEN `anular Norte lun --como Pedro`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa

#### ADDED — El nombre se compara tal cual

- GIVEN la reserva de Norte del lunes, de Pedro, y Ana responsable de Norte
- WHEN `anular Norte lun --como ana`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa

#### ADDED — Anular exige decir quién eres

- GIVEN la reserva de Norte del lunes, de Pedro
- WHEN `anular Norte lun`
- THEN responde «indica quién eres: `--como <nombre>`» y la reserva sigue activa

#### ADDED — Sala sin responsable

- GIVEN una reserva en una sala que no está en el fichero de responsables
- WHEN `anular <sala> <día> --como Ana`
- THEN responde «<sala> no tiene responsable» y la reserva sigue activa

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: en memoria, con el dueño en `by`
- **Idioma de los nombres**: castellano en los textos
- **Límites**: no aplica
- **Avisos**: «solo <responsable> anula reservas de <sala>», «<sala> no tiene responsable», «indica quién eres: `--como <nombre>`»
- **Regla ante conflicto**: la de `room-managers` (sala sin responsable); `anular` comprueba primero `--como`, luego que la sala tenga responsable, luego que quien pide sea ese responsable y al final que exista la reserva

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
