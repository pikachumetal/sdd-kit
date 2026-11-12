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

- Nuevas: `room-managers` — quién es responsable de cada sala.
- Nuevas: `bookings` — reservas de salas (primer fichero de la capacidad: hoy su comportamiento solo vive en el código).

## 🦆 En corto

Hoy cualquiera escribe `anular Norte lun` y la reserva desaparece. Con esto, `anular` exige `--como NOMBRE` y solo deja pasar a quien figura como responsable de esa sala en `data/managers.json`: `anular Norte lun --como Luis` se rechaza («solo Ana anula reservas de Norte») y `--como Ana` anula. Cambio incompatible: `anular Norte lun` a secas deja de funcionar. Es una comprobación por nombre, sin contraseña: ordena quién anula, no impide que alguien escriba el nombre de otro. Y `cancelar` sigue dejando quitar cualquier reserva: eso queda fuera (decisión 5).

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`room-managers`, `bookings`), contrato público (opción `--como` y formato de `data/managers.json`), datos (fichero persistente nuevo), reglas de permiso (quién no puede anular) · tamaño: ~45 líneas en 6 ficheros
- Dominio (opus): qué NO puede hacer quien no es responsable, y si «anular» exige ser responsable también sobre la reserva propia (señal: reglas de permiso)
- Técnica (sonnet): formato de `data/managers.json` y qué pasa si falta o está mal formado; `--como` como contrato de `anular` (señal: contrato público + datos)
- Mínimo razonable: solo dominio — deja sin mirar el formato del fichero y su ausencia, el hueco que rompe `anular` en una instalación sin `data/`

Política de modelos: revisores de la spec: dominio opus, técnica sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar.

1. **Conflicto con la 0009 (decide tú).** La 0009 «Responsables de sala» está pendiente y `docs/config.md` dice que ella define quién es cada responsable y su fichero. Esta spec define `room-managers` y `data/managers.json` por su cuenta. Recomiendo poner la 0011 «Tras» la 0009 y que esta spec consuma lo que la 0009 defina (entonces `room-managers` sale de esta spec); si prefieres que la 0011 lo absorba, la 0009 queda vacía y se cierra. Hasta que decidas, la spec lleva el contrato como propuesta. Si hay conflicto sobre el fichero, manda lo que defina la 0009.
2. **`PRODUCT.md` dice «la uso yo, no hay más usuarios».** Esta feature supone responsables distintos de quien reserva. No toco `PRODUCT.md`; dime si la feature se justifica así (un solo usuario que hace de varios roles) o si hay que actualizar el propósito.
3. Capacidad nueva `room-managers`, un responsable por sala, en `data/managers.json`. Los nombres de capacidad (`room-managers`, `bookings`) van en inglés kebab-case porque son nombre de fichero; el contenido va en castellano.
4. Capacidad nueva `bookings`: el requisito «Anular una reserva» va como `ADDED` porque no hay `capabilities/bookings.md` que modificar. Es en realidad un **cambio incompatible**: antes `anular SALA DÍA` anulaba sin comprobar; ahora exige `--como` y ser responsable.
5. **Hueco aceptado: `cancelar`.** `cancelar` sigue igual y no se guarda quién reservó, así que cualquiera puede seguir quitando una reserva ajena con `cancelar`. Queda fuera de esta feature; propongo una fila nueva en el roadmap para comprobar el dueño al cancelar. Mientras tanto, «solo el responsable anula» es una regla del comando `anular`, no del producto entero.
6. Quien ejecuta se identifica con `--como NOMBRE`, declarativo, sin autenticación. `anular` exige ser el responsable de la sala, sea de quien sea la reserva. Parseo: `--como` va tras los argumentos de sala y día, su valor es el argumento siguiente; sin valor, vacío o ausente → «falta --como NOMBRE»; repetido, vale el primero; un valor que empieza por `--` cuenta como ausente. La lista de salas es `rooms` de `src/app.js` y manda sobre el fichero: una sala que no está en `rooms` «no existe» aunque figure en `data/managers.json`. Los tests del valor vacío llaman a `run`, no al shell.
7. Nombre y sala se comparan exactos, distinguiendo mayúsculas y sin normalizar espacios ni tildes (`ana` no es `Ana`, `norte` no es `Norte`).
8. **Orden de las comprobaciones** (el permiso va antes que mirar si hay reserva, para que un no responsable no averigüe qué reservas existen): 1) falta `--como`; 2) la sala no existe; 3) no hay responsables configurados; 4) la sala no tiene responsable; 5) el nombre no es el responsable; 6) no hay reserva ese día; 7) anula.
9. Mensajes (castellano, constitución art. 4), y el proceso sale siempre con código 0 como hoy (la CLI solo imprime): `falta --como NOMBRE` · `SALA no existe` · `no hay responsables configurados (falta o no se lee data/managers.json)` · `SALA no tiene responsable` · `solo RESPONSABLE anula reservas de SALA` · `sin reserva SALA DÍA` · `anulada SALA DÍA`. Mostrar el nombre del responsable en el rechazo es deliberado.
10. Fichero ausente, ilegible, vacío, JSON inválido o que no es un objeto (`[]`, `null`) → «no hay responsables configurados»; un valor que no es texto, vacío o de solo espacios en una sola sala se trata como esa sala sin responsable. Claves duplicadas: el comportamiento de `JSON.parse` (gana la última). Una persona puede ser responsable de varias salas.
11. Lectura de responsables: función `managerOf(sala)` exportada de `src/app.js`, que devuelve el nombre o `undefined`. Ruta del fichero: `data/managers.json` relativo a la raíz del repo (desde `src/app.js`), sustituible con la variable de entorno `SALAS_DATA` (directorio) para que los tests usen su propio fichero.
12. **Datos iniciales (decide tú los nombres).** La feature crea `data/managers.json` con `{}`: nadie anula hasta que pongas los nombres reales de cada sala (`Ana` y `Luis` son solo ejemplos de la spec, no datos que se envíen). Los tests usan su fixture propio, nunca el fichero real, para que cambiar un responsable no rompa el gate.
13. Reglas de la capacidad (la constitución no tiene «Reglas de producto»; los valores son propuesta mía): datos en `data/managers.json` · nombres de sala como en `rooms` (`Norte`, `Sur`) · límite: un responsable por sala (una persona puede serlo de varias; sin otro límite de longitud de nombre ni de tamaño de fichero) · avisos: los del punto 9 · conflicto: el fichero manda; si llega la 0009, manda su definición.
14. Enfoque: A (`anular` lee el fichero en cada llamada), frente a B (cargarlo una vez al arrancar) y C (responsables dentro de `src/app.js`, como `rooms`). B no aporta nada en una CLI que arranca por comando; C obliga a tocar código para cambiar de responsable y deja la 0009 sin sentido.
15. Resultado de la fusión del delta en copia de `.docs/sdd`: `room-managers.md: añadido «Cada sala tiene un responsable»` · `bookings.md: añadido «Anular una reserva»`; el `capabilities/` del repo no cambia `bookings.md: añadido «Una sala sin responsable no se anula»` · `«Sin responsables configurados no se anula»` · `«Un valor mal formado afecta solo a su sala»` · `«La lista de salas manda sobre el fichero»` (repetida tras la segunda ronda, exit 0). `docs/config.md` es solo documentación, sin requisito en el delta.

### Hallazgos de la review

Segunda ronda (un revisor sonnet; sin tercera ronda):

- **Aceptado** — Crítico: sala inexistente con fichero ausente sin escenario, y lista de salas sin fuente → escenarios de «La lista de salas manda sobre el fichero» y decisión 6.
- **Aceptado** — Importante: `--como ""`, repetido y valor que empieza por `--` → decisión 6 y dos escenarios; el test del vacío llama a `run`. Rechazada la parte de `--como` antes de sala y día: la decisión 6 ya fija que va después.
- **Aceptado** — Importante: casos de fichero juntos y cadena vacía o de espacios → un test por caso, `null` e ilegible añadidos, decisión 10 y escenario.
- **Aceptado** — Importante: fichero inicial con nombres de marcador, que dejarían anular a «Ana» → ahora `{}` (decisión 12).
- **Aceptado** — Importante: fila de `PRODUCT.md` que daba por resuelta la pregunta → reescrita con enlace a la decisión 2.
- **Aceptado parcial** — Importante: la decisión 1 bloquea la aprobación → es tu decisión en este gate, la primera de la lista.
- **Aceptado** — Menor: límite por sala o por persona; fusión sin repetir; `docs/config.md` sin requisito → decisiones 13 y 15.

Primera ronda (dominio opus, técnica sonnet):

- **Aceptado** — Crítico (dominio): `cancelar` salta la regla → declarado como hueco aceptado y fuera de alcance, con fila de roadmap propuesta (decisión 5), también en 🦆 e Intent.
- **Aceptado** — Crítico (dominio): `ADDED` esconde un cambio de comportamiento → marcado como cambio incompatible con el «Antes» en el requisito (decisión 4, 🦆, tabla de cambios).
- **Aceptado** — Crítico (técnica): ficheros ilegibles sin escenario → escenarios de JSON inválido y de estructura inesperada (decisión 10).
- **Aceptado** — Crítico (técnica): orden de comprobaciones y mensaje «sin reserva» sin decisión → decisiones 8 y 9 y escenarios del orden.
- **Aceptado** — Importante (dominio): sala inexistente frente a sin responsable → mensajes distintos (decisiones 8-9), escenarios con `Oeste` (no existe) y `Sur` sin responsable.
- **Aceptado** — Importante (dominio): permiso antes que existencia → decisión 8 y escenario.
- **Aceptado** — Importante (dominio): reglas sin fuente y conflicto mal formulado → decisión 13.
- **Aceptado** — Importante (dominio): `ROADMAP.md` en Scope y Scope condicionado a la decisión 1 → Scope.
- **Aceptado** — Importante (dominio y técnica): nombres de ejemplo convertidos en datos reales; el test depende del fichero real → decisión 12, fixture propio.
- **Aceptado** — Importante (técnica): sintaxis de `--como`, interfaz de lectura, ruta del fichero y su inyección en tests, mayúsculas, código de salida → decisiones 6, 7, 9 y 11 y escenarios.
- **Aceptado** — Menor (dominio): fichero ausente con mensaje propio y nombre del responsable deliberado → decisión 9.
- **Aceptado** — Menor (técnica): regla «gana el fichero» sin escenario → reformulada (decisión 13).
- **Rechazado** — Importante (dominio): renombrar capacidades a `reservas` y `responsables-de-sala` → el nombre de capacidad es un nombre de fichero y el kit lo pide en inglés kebab-case; el contenido sí va en castellano (decisión 3).
- **Aceptado parcial** — Importante (dominio): `PRODUCT.md` dice un solo usuario → no lo cambio yo; queda como pregunta tuya (decisión 2).

## Intent

Hoy cualquiera anula cualquier reserva (`voidBooking` no comprueba nada). Solo el responsable de cada sala debe poder anular reservas con `anular`. Éxito: quien no es responsable recibe el rechazo y la reserva sigue activa; fallo: que se anule sin comprobar, o que una instalación sin fichero deje a todos anular. No promete cerrar `cancelar` (decisión 5).

## Scope

- Entra: `anular SALA DÍA --como NOMBRE` (`voidBooking`, `managerOf` y el despacho en `run`, `src/app.js`); `data/managers.json`; `test/void.test.js` con fixture propio; `docs/config.md`; `ROADMAP.md` (fila de `cancelar` y, si se acepta la decisión 1, 0011 «Tras» 0009).
- No entra: `cancelar`, sin cambios; guardar quién reservó; autenticación; gestión de responsables (alta, baja, cambio), de la 0009; `PRODUCT.md`.
- Si la decisión 1 va a «Tras 0009», `room-managers` y `data/managers.json` salen de esta spec.

### Lo que se retira o cambia de forma

| Hit | Destino |
| --- | --- |
| `src/app.js:21-26` `voidBooking(room, day)` | cambia: recibe quién anula |
| `src/app.js:31` despacho `anular` | cambia: pasa `--como`; sin él, ya no anula |
| `docs/config.md:3-4` «aún no hay» | cambia: describe `data/managers.json` |
| `PRODUCT.md:14` «Anulación» | queda; su encaje con «un solo usuario» es la decisión 2 |
| `ROADMAP.md` 0009 / 0011 | la 0011 pasa a «Tras 0009» si se acepta la decisión 1 |
| tests de `anular` | ninguno hoy: se crean |

## Approach

`anular` lee `data/managers.json` en cada llamada con `managerOf` y rechaza según el orden de la decisión 8 (decisión 14).

## Delta de comportamiento

### Capacidad: `room-managers`

**ADDED — Cada sala tiene un responsable**
- GIVEN `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN se llama `managerOf("Norte")`
- THEN devuelve `"Ana"`
- AND `managerOf("Oeste")` devuelve `undefined`

### Capacidad: `bookings`

**ADDED — Anular una reserva** (cambio incompatible: antes `anular SALA DÍA` anulaba sin comprobar nada)
- GIVEN la reserva de Norte del lunes y `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN `anular Norte lun --como Luis`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa
- AND `anular Norte lun --como Ana` responde «anulada Norte lun»
- AND `anular Norte lun --como ana` responde «solo Ana anula reservas de Norte»
- AND `anular Norte lun`, `anular Norte lun --como` y `anular Norte lun --como ""` responden «falta --como NOMBRE» y la reserva sigue activa
- AND `anular Oeste lun --como Ana` responde «Oeste no existe»
- AND `anular Norte mar --como Luis`, sin reserva ese día, responde «solo Ana anula reservas de Norte» (el permiso va antes)
- AND `anular Norte mar --como Ana` responde «sin reserva Norte mar»
- AND `anular Norte lun --como Ana --como Luis` responde «anulada Norte lun» (vale el primero)
- AND `anular Norte lun --como --x` responde «falta --como NOMBRE»

**ADDED — Una sala sin responsable no se anula**
- GIVEN `data/managers.json` con `{"Norte": "Ana"}`
- WHEN `anular Sur lun --como Ana`
- THEN responde «Sur no tiene responsable»

**ADDED — Sin responsables configurados no se anula**
- GIVEN `data/managers.json` ausente, vacío, con JSON inválido, con `[]`, con `null` o ilegible (es un directorio), y la reserva de Norte del lunes; un test por caso
- WHEN `anular Norte lun --como Ana`
- THEN responde «no hay responsables configurados (falta o no se lee data/managers.json)» y la reserva sigue activa

**ADDED — Un valor mal formado afecta solo a su sala**
- GIVEN `data/managers.json` con `{"Norte": 5, "Sur": "Luis"}`
- WHEN `anular Norte lun --como Ana`
- THEN responde «Norte no tiene responsable»
- AND `anular Sur lun --como Luis` sigue funcionando
- AND con `{"Norte": " ", "Sur": "Luis"}` y con `{"Norte": "", "Sur": "Luis"}`, `anular Norte lun --como Ana` también responde «Norte no tiene responsable»

**ADDED — La lista de salas manda sobre el fichero**
- GIVEN `data/managers.json` con `{"Oeste": "Ana"}`
- WHEN `anular Oeste lun --como Ana`
- THEN responde «Oeste no existe»
- AND con el fichero ausente, `anular Oeste lun --como Ana` también responde «Oeste no existe»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
