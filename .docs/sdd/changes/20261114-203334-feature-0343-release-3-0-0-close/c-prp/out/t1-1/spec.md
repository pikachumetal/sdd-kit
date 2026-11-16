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

🦆 Hoy cualquiera puede anular cualquier reserva. Con esto, `anular Norte lun --como Luis` responde «solo Ana anula reservas de Norte» y la reserva sigue ahí; con `--como Ana`, responde «anulada Norte lun». Quién es responsable de cada sala se lee de un fichero `data/managers.json`; si falta o está roto, no se anula nada y se avisa. `cancelar` no cambia.

Validación: dev-lead — lo que cambia es un comando que usa una persona y lo que responde.

## Capacidades

- Nuevas: `room-managers` — quién es responsable de cada sala y qué pasa si no se sabe.
- Nuevas: `bookings` — anular una reserva exige ser responsable de la sala. Nace con este requisito: hoy no hay `capabilities/`, así que no hay nada vivo que modificar.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`room-managers`, `bookings`), contrato público (`anular` pasa a exigir `--como`), datos (`data/managers.json`), regla de permiso (quién anula) · tamaño: ~50 líneas en 6 ficheros
- Dominio (opus): si el complemento del permiso está dicho —qué NO puede hacer quien no es responsable, también sobre su propia reserva— y si la decisión 1 (adelantarse a la 0009) choca con su fila (señal: regla de permiso + capacidad nueva)
- Técnica (sonnet): si los rechazos de `anular` tienen THEN literal comprobable por `run` y si `data/managers.json` ausente o mal formado deja un comportamiento definido (señal: contrato público + datos)
- Mínimo razonable: solo dominio — deja sin mirar el caso del fichero ausente o corrupto, el hueco que sale en producción y no en los tests

1. **Solape con la 0009 (la más importante).** El roadmap tiene la 0009 «Responsables de sala» («quién responde de cada sala y qué puede hacer», pendiente, sin requisitos) y `docs/config.md` dice que ella define quién es cada responsable y su fichero. Esta spec crea ya la primera mitad: `data/managers.json` y su lectura, es decir la capacidad `room-managers`. La 0009 queda para «qué puede hacer» y parte de la capacidad viva (sus requisitos serán `MODIFIED`/`ADDED` sobre ella). Se reescribe su brief y pasa a `Tras: 0011` (Scope). Alternativa: poner `Tras: 0009` a la 0011 y esperar; elijo lo primero porque la 0009 no tiene nada definido. Si no te vale, es lo que hay que cambiar.
2. Capacidades nuevas, en inglés kebab-case porque el slug es un nombre de fichero: `room-managers` y `bookings` (`bookings` es nueva y no `MODIFIED` porque no existe fichero en `capabilities/`). El glosario de PRODUCT.md evita «booking» y «room» en el texto, no en los slugs.
3. Quien ejecuta se identifica con `--como NOMBRE`, tras SALA y DÍA (otras posiciones no se prometen). No es autenticación: cualquiera puede escribir `--como Ana`. Vale porque la herramienta es de un solo usuario y sin login (`operations.md`); no se promete seguridad.
4. **Amplío la fila 0011.** La fila dice «reservas de otras personas»; yo prohíbo anular a quien no es responsable, también su propia reserva. Motivo: PRODUCT.md define la Anulación como la del responsable de sala, y `cancelar` es la vía de quien quiere quitar la suya. Además hoy `src/app.js` no guarda a nombre de quién está cada reserva, así que distinguir «la propia» exigiría un dato nuevo. `cancelar` hoy no aplica el plazo de 24 h (`src/app.js`), así que nadie se queda sin vía.
5. Orden de comprobación y textos literales (la salida es el valor que devuelve `run`, sin prefijo ni salto de línea; el proceso no cambia su código de salida):
   1. sin `--como` o sin valor → «falta --como NOMBRE»;
   2. fichero ausente, ilegible o cuyo contenido no es un objeto JSON (`[]`, `null`, `"x"`) → «no hay responsables definidos»;
   3. sala sin responsable —no figura, exista o no (Oeste), o su valor no es una cadena (`{"Norte": 5}`)— → «Oeste no tiene responsable»;
   4. quien pide no es el responsable → «solo Ana anula reservas de Norte»;
   5. si no, el flujo de hoy: «anulada Norte lun» o «sin reserva Norte lun».
   El permiso va antes de mirar si hay reserva: quien no es responsable no averigua qué reservas existen. Ninguno de los rechazos toca la reserva.
6. Un responsable por sala como máximo (formato sala → nombre). Mayúsculas y minúsculas cuentan: `--como ana` no es Ana.
7. Ruta del fichero: `data/managers.json` junto a la raíz del proyecto, resuelta desde `src/app.js` y no desde el directorio de trabajo; la variable de entorno `MANAGERS_FILE` la sustituye (así los tests no tocan el fichero real). Si `MANAGERS_FILE` está vacía cuenta como no definida y vale la ruta por defecto. Se lee en cada ejecución. `data/` ya está reservada en `docs/config.md`.
8. El fichero real se entrega con `{"Norte": "Ana", "Sur": "Luis"}`, nombres de ejemplo: los cambias por los reales. Los tests usan un fichero propio aislado.
9. Enfoque: A, frente a B y C (ver Approach).
- Política de modelos: revisores de la spec: dominio opus y técnica sonnet, más un revisor sonnet en segunda ronda · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Solo el responsable de cada sala anula reservas de otras personas — fila 0011 del roadmap.

### Hallazgos de la review

- **Aceptado** — (técnica, Crítico) fichero malformado sin comportamiento → decisión 5.2 y escenario «Un fichero ilegible…».
- **Aceptado** — (técnica, Crítico) ruta del fichero indefinida y tests sin aislamiento → decisiones 7 y 8.
- **Aceptado** — (técnica) «se pregunta el responsable» no es observable por `run` → escenario reescrito con `anular Sur mar --como Luis`.
- **Aceptado** — (técnica) un escenario con dos comportamientos y «sigue activa» sin verificador → separados; «sigue activa» se comprueba con un `anular … --como Ana` posterior.
- **Aceptado** — (técnica y dominio) casos de borde y orden de rechazos → decisión 5 y escenarios de `--como` sin valor, `--como ana` y sin `--como` con fichero ausente.
- **Aceptado** — (técnica y dominio) «permiso antes que reserva» sin escenario → escenario «Quien no es responsable no averigua…».
- **Aceptado** — (técnica) salida de `run` y código de salida → decisión 5.
- **Aceptado** — (técnica) `data/` no respaldada → decisión 7 cita `docs/config.md`.
- **Aceptado** — (2.ª ronda, Crítico) contenido legible que no es objeto → decisión 5.2 y escenario «Un contenido que no es un objeto…».
- **Aceptado** — (2.ª ronda, Crítico) AND «ya con el fichero» no observable → reescrito con la creación explícita del fichero.
- **Aceptado** — (2.ª ronda) GIVEN sin fichero en los AND posteriores, valor no-cadena, `Tras` de la 0009 sin listar, fila 0011 sin reescribir, fichero real sin crear, `MANAGERS_FILE` vacía, posición de `--como`, regla Idioma y Límites sin motivo, responsable de otra sala → decisiones 3, 5.3 y 7, Scope, tabla de «Lo que se retira», reglas y escenarios.
- **Aceptado** — (dominio, Crítico) fila 0011 dice «otras personas» y la spec prohíbe también la propia → decisión 4, que declara la ampliación y su motivo; la premisa «PRODUCT guarda a nombre de quién» no se sostiene en el código.
- **Aceptado** — (dominio, Crítico) 0009 sin tocar → decisión 1 y Scope (brief y `Tras` de la 0009).
- **Aceptado** — (dominio) reglas de `bookings`, Avisos, Límites, mayúsculas → bloques de reglas de las dos capacidades y decisión 6.
- **Aceptado** — (dominio) fichero real con nombres de fixture → decisión 8.
- **Aceptado** — (dominio) «Oeste» ambiguo → decisión 5.3: exista o no, responde igual.
- **Aceptado** — (dominio) hueco de las 24 h → decisión 4.
- **Rechazado** — (dominio) renombrar los slugs a castellano → el slug es un nombre de fichero en inglés kebab-case (regla del kit); el glosario rige el texto.
- **Rechazado** — (técnica) escenario de «no responsable que es autor de la reserva» → no hay dato de autoría y el escenario de rechazo ya cubre a cualquiera que no sea Ana.
- **Rechazado** — (técnica) una persona responsable de dos salas → no cambia la lógica; sin escenario.

## Intent

Hoy `anular Norte lun` anula la reserva de quien sea, lo pida quien lo pida. Importa porque la anulación es una facultad del responsable de sala (PRODUCT.md) y hoy no se distingue. Éxito: `anular Norte lun --como Luis` no toca la reserva y dice quién sí puede; `--como Ana` la anula. Fracaso, aunque «funcione»: que `cancelar` cambie, que un rechazo deje la reserva anulada o que un fichero roto acabe en una excepción sin mensaje.

## Scope

- Entra: `anular SALA DÍA --como NOMBRE`; `data/managers.json` y su lectura en `src/app.js`; actualizar `docs/config.md` (hoy dice «aún no hay» y que lo define la 0009); en `ROADMAP.md`, el brief de la 0009 («parte de `room-managers`, que crea la 0011; queda “qué puede hacer”») y su `Tras: 0011`; el brief de la 0011 («solo el responsable de cada sala anula; también su propia reserva, quien no lo es la cancela»); crear y versionar `data/managers.json` con los nombres de ejemplo de la decisión 8.
- No entra: `cancelar` (sigue igual); autenticar de verdad; qué más puede hacer el responsable (0009); guardar a nombre de quién está cada reserva.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `anular SALA DÍA` sin `--como` deja de anular | `src/app.js:31` (`run`), `src/app.js:22` (`voidBooking`) | Delta de `bookings`; Scope |
| «Responsables de sala: aún no hay… los define la 0009» | `docs/config.md:4` | Scope; decisión 1 |
| Brief de la 0009 («quién responde de cada sala…») y su celda `Tras` (hoy `—`) | `ROADMAP.md:8` | Scope; decisión 1 |
| Brief de la 0011 («reservas de otras personas») | `ROADMAP.md:9` | Scope; decisión 4 |

- Filas que implementa: 0011 entera, y la 0009 en parte (la primera mitad) → la nombran `docs/config.md:4` y `ROADMAP.md:8`; destino: Scope. Comprobado con `git grep -niE "anular|0009|managers|--como"` fuera de `.docs/sdd/specs/`; no hay tests de `anular` hoy.

## Approach

- A. Fichero `data/managers.json` leído en cada ejecución — cuesta un fichero de datos nuevo y manejar que falte o venga roto; se edita sin tocar código y es lo que `docs/config.md` ya anuncia.
- B. Constante `{Norte: 'Ana', Sur: 'Luis'}` en `src/app.js` — lo más simple, pero cambiar un responsable es cambiar código y la 0009 lo rehará.
- C. Solo variable de entorno — cuesta serializar un mapa y no hay otras variables en el proyecto (aquí se usa solo para sustituir la ruta).
- Elegido: A — es el sitio que el proyecto ya reserva (`data/`).

`voidBooking(room, day, who)` aplica el orden de la decisión 5; `run` extrae el valor de `--como`. La ruta se resuelve con `import.meta.url`.

## Dónde se prueba

- Rechazos, anulación y fichero ausente o ilegible: por `run('anular', [...])`, como `test/cancel.test.js`, en `test/void.test.js`, con `MANAGERS_FILE` apuntando a un fichero de prueba.
- `cancelar` intacto: los tests de `test/cancel.test.js`.

## Términos y ADR

- Términos resueltos: Anulación — la hace el responsable de sala; Cancelación — el propio cliente (PRODUCT.md).
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-managers`

#### ADDED — Cada sala tiene un responsable

- GIVEN `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}` y una reserva de Sur el martes
- WHEN `anular Sur mar --como Luis`
- THEN responde «anulada Sur mar»

#### ADDED — Una sala sin responsable lo dice

- GIVEN `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN `anular Oeste lun --como Ana`
- THEN responde «Oeste no tiene responsable»

#### ADDED — Sin fichero de responsables no se anula

- GIVEN que no existe `data/managers.json` y la reserva activa de Norte del lunes
- WHEN `anular Norte lun --como Ana`
- THEN responde «no hay responsables definidos»
- AND si se crea el fichero con `{"Norte": "Ana"}` y se repite `anular Norte lun --como Ana`, responde «anulada Norte lun» (la reserva no se había tocado)

#### ADDED — Un fichero ilegible se trata como ausente

- GIVEN `data/managers.json` con el texto `[1, 2` y la reserva activa de Norte del lunes
- WHEN `anular Norte lun --como Ana`
- THEN responde «no hay responsables definidos»

#### ADDED — Un contenido que no es un objeto se trata como ausente

- GIVEN `data/managers.json` con el texto `[]` y la reserva activa de Norte del lunes
- WHEN `anular Norte lun --como Ana`
- THEN responde «no hay responsables definidos»

#### ADDED — Un responsable que no es un nombre cuenta como sin responsable

- GIVEN `data/managers.json` con `{"Norte": 5}`
- WHEN `anular Norte lun --como Ana`
- THEN responde «Norte no tiene responsable»

#### Reglas de la capacidad — room-managers

- **Dónde viven los datos**: `data/managers.json`, un objeto sala → nombre; la variable `MANAGERS_FILE` lo sustituye.
- **Idioma de los nombres**: avisos en castellano; salas y nombres tal cual se escriben, y mayúsculas y minúsculas cuentan.
- **Límites**: un responsable por sala como máximo.
- **Avisos**: «no hay responsables definidos» y «SALA no tiene responsable».
- **Regla ante conflicto**: gana el primer rechazo de este orden: falta `--como`; fichero ausente o ilegible; sala sin responsable; quien pide no es el responsable.

### Capacidad: `bookings`

#### ADDED — Solo el responsable anula una reserva

- GIVEN la reserva activa de Norte del lunes y `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN `anular Norte lun --como Luis`
- THEN responde «solo Ana anula reservas de Norte»
- AND un `anular Norte lun --como Ana` posterior responde «anulada Norte lun», porque la reserva seguía activa
- AND con una reserva de Sur el martes, `anular Sur mar --como Ana` responde «solo Luis anula reservas de Sur»

#### ADDED — Quien no es responsable no averigua qué reservas existen

- GIVEN `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}` y ninguna reserva de Norte el martes
- WHEN `anular Norte mar --como Luis`
- THEN responde «solo Ana anula reservas de Norte», y no «sin reserva Norte mar»

#### ADDED — Anular exige decir quién eres

- GIVEN la reserva activa de Norte del lunes y `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN `anular Norte lun`
- THEN responde «falta --como NOMBRE»
- AND `anular Norte lun --como` responde lo mismo
- AND un `anular Norte lun --como Ana` posterior responde «anulada Norte lun»

#### ADDED — El nombre distingue mayúsculas

- GIVEN la reserva activa de Norte del lunes y `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN `anular Norte lun --como ana`
- THEN responde «solo Ana anula reservas de Norte»

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: las reservas viven en memoria (`operations.md`); no se guarda a nombre de quién están.
- **Idioma de los nombres**: castellano (constitución, punto 4).
- **Límites**: no aplica, porque anular no pone tope a nada
- **Avisos**: «falta --como NOMBRE» y «solo RESPONSABLE anula reservas de SALA».
- **Regla ante conflicto**: gana el primer rechazo de este orden: falta `--como`; fichero ausente o ilegible; sala sin responsable; quien pide no es el responsable.

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
