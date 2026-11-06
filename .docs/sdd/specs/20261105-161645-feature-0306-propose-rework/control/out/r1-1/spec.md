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

## Capacidades

- Nuevas: `responsables-de-sala` — quién es responsable de cada sala.
- Nuevas: `reservas` — anular una reserva (el proyecto no tiene `capabilities/`: nace parcial, solo con `anular` y la regla del responsable; reservar, listar y cancelar no entran).

## Decisiones que he tomado yo — valida estas

1. Capacidad nueva `responsables-de-sala`, con los responsables en `data/managers.json` (`{"Norte": "Ana", "Sur": "Luis"}` en el fichero inicial: nombres inventados que Laura sustituye por los reales; los tests usan su propio fichero en `test/`).
2. Quien ejecuta el comando se identifica con `--como <nombre>`.
3. `reservas` nace como capacidad nueva en esta feature, porque `capabilities/` no existe y el merge rechaza un `MODIFIED` sobre una capacidad sin fichero. Su requisito va como `ADDED`, pero cambia lo que hace hoy `anular` (hoy anula cualquiera).
4. Solo el responsable anula, sea de quien sea la reserva (PRODUCT.md: «Anulación: la reserva que anula el responsable de sala»); quien reservó usa `cancelar`, que no cambia. La reserva no guarda quién la hizo y esta feature no lo añade: la regla no lo necesita.
5. `--como` se acepta en cualquier posición y su valor es el primer argumento que le sigue; si no hay, está vacío o empieza por `--`, cuenta como no indicado; repetido, vale el primero. Los argumentos sobrantes o mal escritos se tratan como hoy. Los nombres de persona y de sala se comparan exactos, distinguiendo mayúsculas (`ana` no es `Ana`).
6. Precedencia al anular: primero «sin reserva» (mensaje actual); luego `--como`; luego el responsable de la sala: sala sin responsable o fichero ausente → «<sala> no tiene responsable»; fichero que no es JSON, que no es un objeto o cuyo valor para la sala no es un texto no vacío → «el fichero de responsables no es válido» (sin ruta, porque los tests usan otro fichero); luego si quien pide es el responsable. En todo rechazo la reserva sigue activa.
7. `--como` no autentica: es una convención de confianza, no una barrera. La misión (un solo usuario) y PRODUCT.md (equipos de una oficina) no coinciden; la spec no lo resuelve.
8. El mensaje de rechazo nombra al responsable, a propósito.
9. `data/managers.json` se resuelve desde `src/app.js`, no desde el directorio de trabajo.
10. El rechazo es un texto de salida, como el resto de respuestas de `run`; no cambia ningún código de salida.
11. Las reservas viven en memoria: los escenarios de reservas se preparan en el test, no por CLI entre procesos.
12. Los nombres de capacidad van en castellano; las funciones del código (`voidBooking`, `managerOf`) conservan su nombre en inglés, como el resto de `src/app.js`.

Review de spec propuesta: dos revisores — señales: capacidad nueva (`responsables-de-sala`, `reservas`), contrato público (`--como` y el formato de `data/managers.json`), MODIFIED en sustancia (`anular` deja de anular a cualquiera), datos (`data/managers.json`), reglas de permiso (quién no puede anular) · tamaño: ~80 líneas en ~6 ficheros
- Dominio (opus): si «solo el responsable anula» deja claro qué NO puede hacer quien reservó ni el responsable de otra sala, y si la decisión 5 (sin `--como` o sin responsable → rechaza) contradice el Intent (señal: reglas de permiso)
- Técnica (sonnet): si `--como` sin autenticación y el formato de `data/managers.json` (ruta, fichero ausente o malformado) son verificables con los THEN dados (señal: contrato público + datos)
- Mínimo razonable: solo técnica — deja sin cubrir el complemento de permisos (quién no puede anular), el hueco que no se ve hasta que alguien anula lo que no debía

Pasada de coherencia: la delta de `reservas` como `MODIFIED` fallaba en el merge sobre una copia (no existía fichero de capacidad); pasa a `ADDED` con `reservas` en «Nuevas» (decisión 3). `git grep` de `anular`/`0011`/`managers` en el repo: solo `src/app.js` (`voidBooking`, rama `anular`) y la fila 0011 del roadmap; los tests de `test/` no cubren `anular`. Política de modelos: dominio en Opus (roles), técnica en Sonnet.

### Hallazgos de la review

Dominio (Opus):
- **Aceptado** (Crítico) — nombres de capacidad en inglés contra PRODUCT.md y la constitución → renombradas a `responsables-de-sala` y `reservas`; el código conserva `voidBooking` (decisión 12).
- **Aceptado** — el `ADDED` oculta una ruptura → el Intent dice «Antes / Ahora» y lo marca como cambio incompatible de `anular`.
- **Aceptado** — Intent y regla no casan (¿el responsable o quien reservó anulan lo propio?) → el Intent pasa a «solo el responsable anula, sea de quien sea la reserva»; escenario con `--como Pedro`.
- **Aceptado, fuera de esta feature** — `cancelar` hoy no comprueba de quién es la reserva ni las 24 h, y podría saltarse la regla → hueco conocido declarado en «No entra»; propongo anotarlo en la deuda técnica del roadmap (no lo he tocado).
- **Aceptado** — `--como` no autentica y la misión («no hay más usuarios») choca con PRODUCT.md («equipos de una oficina») → decisión 7; el conflicto entre documentos lo dejo señalado, no lo resuelvo aquí.
- **Aceptado** — faltan las cinco reglas → bloque «Reglas de la capacidad» y escenario de mayúsculas.
- **Aceptado** — `responsables-de-sala` no era observable ni decía quién mantiene el fichero → se verifica con `managerOf` y por el mensaje de rechazo; el fichero se edita a mano (No entra).
- **Aceptado** — el rechazo nombra al responsable → decisión 8, a propósito.
- **Aceptado** — fixture mezclado con el dato real → los tests llevan su propio fichero de prueba; el `data/managers.json` inicial usa nombres inventados que Laura sustituye (decisión 1).

Técnica (Sonnet):
- **Aceptado** (Crítico) — ruta de `data/managers.json` sin definir → decisión 9: se resuelve desde `src/app.js`; `managerOf(room, file)` admite una ruta para los tests.
- **Aceptado** (Crítico) — fichero malformado sin escenario → escenario y decisión 6.
- **Aceptado** — sin interfaz observable en `responsables-de-sala` → ver arriba (`managerOf`).
- **Aceptado** — posición y valor de `--como` → decisión 5.
- **Aceptado** — `--como` sin autenticar → decisión 7.
- **Aceptado** — comparación de nombres → decisión 5, escenario con `ana`.
- **Aceptado** — orden de validaciones → decisión 6 fija la precedencia; escenario de reserva inexistente.
- **Aceptado** — nada fija lo que se conserva → la salida de éxito «anulada Norte lun» se conserva y `cancelar` no cambia (Scope).
- **Aceptado** — reservas en memoria → los GIVEN de reservas se preparan en el test llamando a la función, no por CLI entre procesos.
- **Aceptado** — la sección mezclaba decisiones y registro → registro separado en esta subsección; el código de salida no cambia (decisión 10).

Segunda ronda (Sonnet, una sola):
- **Aceptado** (Crítico) — `reservas` nace parcial y el escenario de `cancelar` no era suyo → declarado parcial; `cancelar` sale de la delta y queda en el Scope como «sigue igual».
- **Aceptado** (Crítico) — un escenario mezclaba seis THEN con un GIVEN que dejaba de valer → siete escenarios, cada uno con su GIVEN.
- **Aceptado** — «sin reserva» como AND de otro escenario → escenario propio.
- **Aceptado** — casos mezclados y sin mensaje → un escenario por caso, con valores no válidos (`{"Norte": 3}`, `""`) y decisión 6 con los dos mensajes.
- **Aceptado** — el mensaje llevaba una ruta falsa en los tests → mensaje sin ruta.
- **Aceptado** — valor de `--como` → decisión 5 (primer argumento siguiente; vacío o `--x` cuenta como no indicado; repetido vale el primero).
- **Aceptado** — cita falsa del plazo y «no aplica» sin justificar → reglas reescritas.
- **Aceptado** — «quien reservó» no existe en el modelo → sale de los THEN; `Pedro` es un nombre más (decisión 4).
- **Aceptado** — `scripts/lint.mjs` y `managerOf` exportada → en el Scope.
- **Aceptado en parte** — la lista de decisiones pasa delante del registro; **rechazado** confirmar a Laura: es la aprobadora que ya figura en el frontmatter, no la cambio.

## Intent

Antes: cualquiera anulaba cualquier reserva, sin identificarse. Ahora: solo el responsable de cada sala anula reservas, sea de quien sea la reserva, y `anular` exige `--como`. Es un cambio incompatible del contrato de `anular`: una llamada válida hasta hoy (`anular Norte lun`) pasa a rechazarse.

## Scope

- Entra: `anular <sala> <día> --como <nombre>` en `src/app.js` (`voidBooking` y la rama `anular` de `run`) y la lectura de `data/managers.json` (`managerOf`, función exportada nueva); `data/managers.json` inicial; tests en `test/`; las capacidades `responsables-de-sala` y `reservas`.
- No entra: `cancelar`, que sigue igual. Hueco conocido: hoy `cancelar` no comprueba de quién es la reserva ni el plazo de 24 h, y podría usarse para saltarse esta regla; es otra feature. Los ficheros nuevos y modificados pasan `scripts/lint.mjs` (gate de cierre de operations.md). Tampoco entra una gestión de responsables: `data/managers.json` se edita a mano.

## Approach

`anular` lee `data/managers.json` con `managerOf` y rechaza a quien no es responsable de la sala, con la precedencia de la decisión 6.

## Reglas de la capacidad

- Dónde viven los datos: `data/managers.json`, un objeto sala → nombre (decisión 9).
- Idioma de los nombres: castellano (constitución, punto 4; PRODUCT.md).
- Límites: un responsable por sala; esta feature no añade plazo a la anulación (PRODUCT.md solo dice «por cualquier motivo»).
- Avisos: no aplica; no hay canal de avisos (los avisos por correo son la fila 1 del roadmap) y la reserva no guarda a quién avisar.
- Conflicto: sala sin responsable, fichero ausente o inválido → se rechaza (decisión 6).

## Delta de comportamiento

### Capacidad: `responsables-de-sala`

**ADDED — Cada sala tiene un responsable**
- GIVEN un fichero de responsables con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN se pide `managerOf('Norte', <fichero>)`
- THEN es Ana
- AND `managerOf('Este', <fichero>)` no devuelve responsable

### Capacidad: `reservas`

**ADDED — Anular una reserva exige ser responsable de la sala**
- GIVEN la reserva activa de Norte del lunes y un fichero de responsables con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN `anular Norte lun --como Ana`
- THEN responde «anulada Norte lun» y la reserva queda anulada

**ADDED — Quien no es el responsable no anula**
- GIVEN la reserva activa de Norte del lunes y el mismo fichero de responsables
- WHEN `anular Norte lun --como Luis`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa
- AND con `--como Pedro` responde lo mismo
- AND con `--como ana` responde lo mismo

**ADDED — `--como` va en cualquier posición**
- GIVEN la reserva activa de Norte del lunes y el mismo fichero de responsables
- WHEN `anular --como Ana Norte lun`, o `anular Norte --como Ana lun`
- THEN responde «anulada Norte lun»

**ADDED — Sin identificarse no se anula**
- GIVEN la reserva activa de Norte del lunes
- WHEN `anular Norte lun` (sin `--como`, con `--como` al final sin valor, o con `--como --otra`)
- THEN responde «indica quién anula con --como» y la reserva sigue activa

**ADDED — Sala sin responsable no se anula**
- GIVEN la reserva activa de Norte del lunes y un fichero de responsables sin Norte
- WHEN `anular Norte lun --como Ana`
- THEN responde «Norte no tiene responsable» y la reserva sigue activa
- AND con el fichero ausente responde lo mismo

**ADDED — Fichero de responsables inválido no se anula**
- GIVEN la reserva activa de Norte del lunes y un fichero de responsables que no es JSON
- WHEN `anular Norte lun --como Ana`
- THEN responde «el fichero de responsables no es válido» y la reserva sigue activa
- AND con un fichero que no es un objeto, o con `{"Norte": 3}` o `{"Norte": ""}`, responde lo mismo

**ADDED — Sin reserva se dice antes que nada**
- GIVEN que no hay reserva activa de Norte el martes
- WHEN `anular Norte mar` (con o sin `--como`)
- THEN responde «sin reserva Norte mar»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
