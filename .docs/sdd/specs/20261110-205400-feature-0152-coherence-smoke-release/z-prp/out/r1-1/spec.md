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
- Nuevas: `reservas` — quién puede anular una reserva.

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores, más una segunda ronda de uno (Crítico aceptado y decisión central reescrita) — señales: capacidad nueva, contrato público (`anular … --como`, formato de `data/managers.json`), MODIFIED en sustancia (hoy `anular` deja anular a cualquiera), datos (`data/managers.json`), permisos (quién no puede anular) · tamaño: ~70 líneas en ~5 ficheros
- Dominio (opus): qué NO puede hacer quien no es responsable y los casos sin `--como` o sin responsable (señal: permisos + MODIFIED)
- Técnica (sonnet): si los escenarios se pueden ejecutar con reservas en memoria y de dónde se lee `data/managers.json` (señal: contrato público + datos)
- Mínimo razonable: solo técnica — deja sin cubrir el complemento del rol de responsable
```

1. Capacidad nueva `responsables-de-sala`, con los responsables en `data/managers.json`: un objeto sala → nombre (un solo responsable por sala, cadena). El fichero se entrega en el repo con `{"Norte": "Ana", "Sur": "Luis"}`, que son valores de ejemplo que el dueño sustituye.
2. Quien ejecuta el comando se identifica con `--como <nombre>`, obligatorio; vacío cuenta como ausente. La identidad **no se verifica** (el producto no tiene login): cualquiera puede escribir `--como Ana`. Límite aceptado; el Intent promete la regla, no la autenticación. La comparación es exacta y distingue mayúsculas, también en el nombre de la sala (`norte` no es `Norte`).
3. `reservas` también es capacidad nueva: el repo no tiene `capabilities/`, no hay verdad viva que modificar (la fusión de prueba rechazó el `MODIFIED`). **Es un cambio de contrato en sustancia**: hoy `anular <sala> <día>` anula sin comprobar a nadie; tras esta feature, `anular` sin `--como` se rechaza y rompe a quien lo llame así. Los nombres de las capacidades van en castellano (regla 4 de la constitución).
4. **`anular` es solo del responsable de la sala, sea de quien sea la reserva.** Quien reservó y quiere quitar la suya usa `cancelar`, que ya existe y no cambia. Así no hace falta guardar el nombre de quien reserva. Esto afina el título del roadmap («reservas de otros»): el dueño no responsable tampoco anula la suya. Valida esta decisión.
5. El sistema falla cerrado: la reserva solo se anula si se sabe quién es el responsable y coincide. Los fallos se comprueban **antes** de mirar si hay reserva, en este orden, y gana el primero que se dé: (1) fichero ausente o mal formado (JSON inválido, o un valor que no es cadena); (2) sin `--como`; (3) sala ausente del fichero; (4) quien ejecuta no es el responsable. En todos la reserva sigue activa y el mensaje va en castellano.
6. El rechazo dice quién es el responsable («solo Ana anula…») a propósito: es una oficina pequeña y quien no puede debe saber a quién pedírselo. Efecto aceptado: con identidad sin verificar, el mensaje también da el nombre exacto con el que suplantar.
7. Los tests leen los responsables de una ruta que se puede cambiar con la variable de entorno `SALAS_MANAGERS` (por defecto `data/managers.json` junto a `src/`); usan un fichero temporal, salvo un escenario que lee el entregado. La operación observable es la función exportada `managerOf(sala)`: devuelve el nombre, `undefined` si la sala no está, y lanza error si el fichero no se puede leer. Lee el fichero en cada llamada, sin caché.
8. Canal y código de salida como hoy: el texto va a stdout y el código es 0, también en los rechazos (el producto no distingue). Que la reserva «sigue activa» o «deja de estarlo» se comprueba con `libres` de su franja. El texto del éxito es «anulada <sala> <día>», el que ya devuelve `anular`.
9. La regla de 24 h de la «Cancelación» de PRODUCT.md no está implementada y esta feature no la toca. Sugiero apuntarla como fila en Later del roadmap (no lo he hecho yo). Tampoco toco el Product Purpose de PRODUCT.md («no hay más usuarios»), aunque ya habla de un responsable de sala.

### Reglas de la capacidad (las cinco)

- Dónde viven los datos: `data/managers.json`; las reservas, en memoria como hoy.
- Idioma de los nombres: castellano (capacidades y mensajes).
- Límites: un responsable por sala; una persona puede serlo de varias salas; nombres sin normalizar (decisión 2).
- Avisos: el rechazo nombra al responsable (decisión 6).
- Conflicto: sala sin responsable o fichero ilegible → se rechaza, no se anula (decisión 5).

### Hallazgos de la review

Primera ronda, técnica (sonnet):
- **Aceptado** — T1 el escenario no dice cómo se crea la reserva → el GIVEN usa la reserva de Norte del lunes que ya existe en el almacén en memoria, en un solo proceso, como los tests de `cancelar`.
- **Aceptado** — T2 la ruta de `managers.json` no es sustituible → decisión 7.
- **Aceptado** — T3 faltan los casos de fallo → decisión 5 y escenarios.
- **Aceptado** — T4 falta el dueño anulando la suya → escenario, con la decisión 4.
- **Aceptado** — T5 canal, código de salida y «sigue activa» → decisión 8.
- **Aceptado** — T6 guardar el nombre de quien reserva → desaparece del Scope por la decisión 4.
- **Aceptado** — T7 autoidentificación sin autenticación → decisión 2.
- **Aceptado** — T8 esquema de `managers.json` → decisión 1.
- **Aceptado** — T9 cambio de firma de `anular` → decisiones 2 y 3.

Primera ronda, dominio (opus):
- **Aceptado** — D1 (Crítico) `anular` es del responsable aunque la reserva sea propia → decisión 4.
- **Rechazado** — D2 PRODUCT.md dice que no hay más usuarios → PRODUCT.md ya define «responsable de sala» y «Anulación»; los nombres son de ejemplo. No se toca el Product Purpose; decisión 9.
- **Aceptado** — D3 reservas sin nombre → ya no se guarda el nombre (decisión 4).
- **Aceptado** — D4 la cancelación propia → `cancelar` existe en `src/app.js` y sigue igual; corrijo mi nota de coherencia, que decía lo contrario. La regla de 24 h, decisión 9.
- **Aceptado** — D5 casos del rol → decisión 5 y escenarios.
- **Rechazado** — D6 (franja y formato del día) `anular <sala> <día>` identifica la reserva como `cancelar` y como hoy; fuera de esta feature.
- **Aceptado** — D7 identidad no verificada → decisión 2.
- **Aceptado** — D8 nombres en castellano y las cinco reglas → decisión 3 y el bloque de reglas.
- **Aceptado** — D9 el mensaje nombra al responsable → decisión 6.
- **Rechazado** — D10 el aprobador «Laura» → el nombre venía en el frontmatter de la spec y no lo he tocado; dejo al dev-lead que lo confirme al aprobar.

Segunda ronda (sonnet):
- **Aceptado** — R1 (Crítico) el escenario «hecha por Pedro» contradice la decisión 4 → reescrito sin dueño: cualquier `--como` que no sea el responsable.
- **Aceptado** — R2 (Crítico) el éxito va tras un estado que ya era «sigue activa» → separado en dos escenarios con su GIVEN y con `libres`; texto del éxito en la decisión 8.
- **Aceptado** — R3 (Crítico) tres fallos en un solo escenario y «mal formado» sin definir → un escenario por fallo; definición en la decisión 5.
- **Aceptado** — R4 la comprobación va antes de mirar si hay reserva y nada lo prueba → escenario de sala sin reserva; orden de los mensajes en la decisión 5.
- **Aceptado** — R5 regla de 24 h frente a PRODUCT.md → decisión 9 (la fila del roadmap la dejo como sugerencia).
- **Aceptado** — R6 `reservas` es un MODIFIED en sustancia → decisión 3.
- **Aceptado** — R7 `managerOf` sin definir en los fallos ni la lectura → decisión 7 y escenarios.
- **Aceptado** — R8 el fichero entregado no se prueba → escenario sin `SALAS_MANAGERS`; ejemplo declarado en la decisión 1.
- **Aceptado** — R9 comparación exacta, `--como` vacío y sala en minúsculas → decisión 2 y escenario.
- **Aceptado** — R10 el mensaje facilita la suplantación → decisión 6. El nombre del aprobador: ver D10.

### Coherencia

- Buscados `anular`, `cancelar`, `responsable` en todo el repo: `anular` existe en `src/app.js` (`voidBooking`) sin comprobar quién lo ejecuta; `cancelar` también (`cancelBooking`) y no cambia; PRODUCT.md ya define «Anulación» como cosa del responsable. Nada que retirar.
- Fusión de prueba sobre copia de `.docs/sdd`: tras la segunda ronda añade 4 requisitos a `responsables-de-sala.md` y 6 a `reservas.md`, sin rechazos. El `capabilities/` del repo no cambia.
- Política de modelos: dos revisores de la spec (dominio opus, técnica sonnet) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

## Intent

Hoy cualquiera anula cualquier reserva. Solo el responsable de cada sala debe poder anularlas. Quien no lo es y quiere quitar la suya, la cancela.

## Scope

- Entra: `anular <sala> <día> --como <nombre>`; `data/managers.json`; `managerOf(sala)`; la variable `SALAS_MANAGERS`.
- No entra: `cancelar` (sigue igual), la regla de 24 h de la cancelación, guardar quién reservó, verificar identidades, la franja en `anular`.

## Approach

`anular` lee los responsables (`SALAS_MANAGERS` o `data/managers.json`) y, antes de buscar la reserva, rechaza a quien no es el responsable de la sala o si no puede saberlo.

## Delta de comportamiento

### Capacidad: `responsables-de-sala`

**ADDED — Cada sala tiene un responsable**
- GIVEN un fichero de responsables con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN se llama a `managerOf('Norte')`
- THEN devuelve «Ana»

**ADDED — Una sala sin responsable no da nombre**
- GIVEN el mismo fichero
- WHEN se llama a `managerOf('Oeste')`
- THEN devuelve `undefined`

**ADDED — Un fichero ilegible no se ignora**
- GIVEN un fichero que no es JSON, o cuyo valor para Norte no es una cadena
- WHEN se llama a `managerOf('Norte')`
- THEN lanza un error

**ADDED — Sin variable, se lee el fichero entregado**
- GIVEN `SALAS_MANAGERS` sin definir
- WHEN se llama a `managerOf('Norte')`
- THEN devuelve el responsable de Norte de `data/managers.json`

### Capacidad: `reservas`

**ADDED — El responsable anula**
- GIVEN la reserva de Norte del lunes y los responsables `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN `anular Norte lun --como Ana`
- THEN responde «anulada Norte lun» y `libres 10:00-12:00` devuelve Norte

**ADDED — Quien no es responsable no anula**
- GIVEN la reserva de Norte del lunes y los mismos responsables
- WHEN `anular Norte lun --como Luis`, o `--como Pedro`, o `--como ana`
- THEN responde «solo Ana anula reservas de Norte» y `libres 10:00-12:00` no devuelve Norte
- AND `cancelar Norte lun` la cancela como hoy

**ADDED — La comprobación va antes que la búsqueda**
- GIVEN los mismos responsables y ninguna reserva de Sur el martes
- WHEN `anular Sur mar --como Ana`
- THEN responde «solo Luis anula reservas de Sur» y no «sin reserva Sur mar»

**ADDED — Sin `--como` no se anula**
- GIVEN la reserva de Norte del lunes y los mismos responsables
- WHEN `anular Norte lun`, o con `--como` vacío
- THEN responde «indica quién anula con --como» y la reserva sigue activa

**ADDED — Una sala sin responsable no se anula**
- GIVEN la reserva de Norte del lunes y un fichero de responsables sin Norte
- WHEN `anular Norte lun --como Ana`
- THEN responde «Norte no tiene responsable» y la reserva sigue activa

**ADDED — Sin lista de responsables no se anula**
- GIVEN la reserva de Norte del lunes y un fichero ausente o mal formado
- WHEN `anular Norte lun --como Ana`
- THEN responde «no se puede leer la lista de responsables» y la reserva sigue activa

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
