---
id: 20261106-094640-feature-0010-motivo-cancelar
feature: 0010
title: Motivo al cancelar una reserva
mode: full
status: approved
created: 2026-11-06
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-06
---

# Spec — Motivo al cancelar una reserva

🦆 Hoy `cancelar Norte lun` cancela y no deja rastro de por qué. Con esto, cancelar exige un motivo de la lista (cambio de planes, sala ocupada, otro): `cancelar Norte lun --motivo sala-ocupada` responde `cancelada Norte lun · sala ocupada`, y un comando nuevo, `canceladas`, lista las canceladas con su motivo: `Norte lun · sala ocupada`. Sin motivo, o con uno que no está en la lista, no se cancela nada y se avisa. Por dentro, la reserva guarda el motivo al pasar a `cancelled`.

Validación: dev-lead — es comportamiento que usa una persona en la terminal: textos de respuesta y de aviso nuevos.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo de una lista y listar las canceladas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-cancellation`), cambio de la salida de `cancelar` (ahora exige `--motivo`) · tamaño: ~65 líneas en 3 ficheros (`src/app.js` y dos de tests)
- Dominio (sonnet): si «Motivo obligatorio y de la lista» y «Listado de canceladas» cubren lo que pide la fila 0010 sin inventar reglas, y si `canceladas` debe excluir las anuladas por el responsable (señal: capacidad nueva)
- Técnica (sonnet): si los THEN de «Cancelar con motivo» y «Motivo obligatorio y de la lista» se pueden observar por `run()` como los tests de `cancel.test.js` actuales, y el orden de comprobación motivo→reserva (señal: cambio de salida de `cancelar`)
- Mínimo razonable: solo técnica — deja sin mirar si el listado de canceladas es lo que quería la fila 0010

1. **Forma del comando**: `cancelar <sala> <día> --motivo <clave>`, con las claves `cambio-de-planes`, `sala-ocupada` y `otro` — la fila dice «se elige de una lista» y la CLI no tiene menús; una opción con claves sin espacios ni tildes es lo más simple en la línea de comandos. Descartado: tercer argumento posicional (menos legible) y menú interactivo (la CLI no lee de la entrada estándar).
2. **El motivo es obligatorio**: sin `--motivo`, o con una clave fuera de la lista, no se cancela y responde `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`. Descartado: motivo por defecto `otro` (ocultaría el olvido y ensuciaría el listado). Consecuencia: `cancelar Norte lun` a secas ya no cancela (cambio de comportamiento aceptado).
3. **Orden de comprobación**: primero el motivo, después la reserva; con motivo inválido y sin reserva, responde el aviso del motivo.
4. **Respuesta al cancelar**: `cancelada <sala> <día> · <motivo con espacios>` (p. ej. `cancelada Norte lun · cambio de planes`); sin reserva sigue `sin reserva <sala> <día>`.
5. **Listado de canceladas**: la fila 0010 lo pide («el listado de canceladas lo enseña») y hoy no existe, así que lo creo como comando `canceladas`: una línea por reserva cancelada, `<sala> <día> · <motivo>`, en el orden del almacén (decisión 12); sin ninguna, `sin canceladas`. No incluye las anuladas por el responsable (`voided`): PRODUCT.md las distingue de las cancelaciones.
6. **`otro` sin texto libre**: la lista es cerrada; el motivo `otro` no lleva descripción.
7. **Capacidad nueva `booking-cancellation`** (slug en inglés): no hay capacidades todavía; la crea esta spec con los requisitos de cancelar y listar, incluido el comportamiento previo de `sin reserva`, que hoy solo está en tests.
8. **Tests**: los dos de `cancel.test.js` pasan a usar `--motivo` (el de `sin reserva` también: sin motivo daría el aviso de la decisión 2). `node --test` corre cada fichero en su propio proceso, así que el estado en memoria queda aislado por fichero: los de `canceladas` van en `test/canceladas.test.js` y el de `sin canceladas`, en `test/canceladas-vacio.test.js`. No hay reset exportado. Hoy la única reserva alcanzable es la semilla `Norte lun` (`reservar` no crea reservas), y los escenarios se escriben sobre ella.
10. **Parseo de `--motivo`**: solo vale en la forma `cancelar <sala> <día> --motivo <clave>`, con exactamente esos cuatro argumentos y la clave en minúsculas, exacta. Cualquier otra forma (opción antes de sala y día, `--motivo=otro`, opción sin valor, repetida o con argumentos sobrantes, clave en mayúsculas) da el aviso de la decisión 2.
11. **Reserva ya cancelada**: no cuenta como reserva activa; `cancelar` sobre ella responde `sin reserva <sala> <día>` y no cambia su motivo ni el listado.
12. **Orden del listado**: el del almacén (orden de alta de las reservas), sin guardar un orden de cancelación. Con la semilla sola no se puede observar con dos líneas por `run()`; queda sin test (aviso aquí, antes de ejecutar). Corrige la decisión 5, que decía «en el orden en que se cancelaron».
9. **Enfoque** (central): guardar el motivo en la propia reserva (`reason`) al pasar a `cancelled` y filtrar por `status === 'cancelled'` para el listado, que es lo que ya hace `findBooking` con `status`. Descartado: un registro aparte de cancelaciones (dos fuentes de verdad para lo mismo en un programa de una sola lista en memoria) y guardar el texto en vez de la clave (acopla el dato a la presentación).
- Repaso de coherencia: delta probado sobre una copia de `.docs/sdd` con `sdd capability merge` (4 requisitos y 5 reglas añadidos, salida 0) y `sdd capability check` (`Capacidades válidas: 1`); `git grep` de `cancelada`, `cancelar` y `0010` fuera de `specs/`: solo `src/app.js`, `test/cancel.test.js`, `roadmap.md` y la línea histórica de `changelog.md` (v0.3.0, no se toca).
### Hallazgos de la review

- **Aceptado** — Dominio 1: `MODIFIED` encubierto sin línea base → la capacidad nace con la regla «motivo obligatorio»; la fila de `sin reserva` de la tabla de cambios se marca como comportamiento previo que no cambia de texto.
- **Aceptado** — Dominio 2 y Técnica 6: el escenario de anuladas depende de `anular` → `anular` ya existe en `src/app.js` (fila 0007/0006 previa); el escenario cita su invocación `anular Norte lun`.
- **Aceptado** — Dominio 3, 4, 5 y 6: reglas incompletas → «Reglas de la capacidad» declara la clave guardada, el mapa clave→texto, `otro` sin texto, sin tope, avisos y respuestas, y el conflicto motivo inválido sin reserva.
- **Aceptado** — Dominio 7 y 8, Técnica 8: reserva ya cancelada → decisión 11 y escenario.
- **Aceptado** — Técnica 1, 2 y 7: GIVEN no preparables y escenarios mezclados → escenarios separados, uno por caso, con `run()` literal y las tres claves cubiertas; el AND «Norte vuelve a figurar libre» se observa con `libres 10:00-12:00`.
- **Aceptado** — Técnica 3: parseo → decisión 10.
- **Aceptado** — Técnica 4 y Dominio 7: orden → decisión 12 (almacén, sin test con dos líneas).
- **Aceptado** — Técnica 5: estado compartido → decisión 8 (un fichero de test por estado).
- **Aceptado** — Técnica 10: tabla → el test de `sin reserva` también se reescribe.
- **Rechazado** — Técnica 9: la línea «Política de modelos» es la que el kit pide en ✋ para `delegate`; no se mueve.
- **Rechazado** — Dominio 9: sin hallazgo.

- Política de modelos: dos revisores de la spec, ambos sonnet (la spec no toca roles ni reglas de flujo) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no (sin módulo ni dependencia nueva) · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación, y parada tras el commit de la Task 1 — «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» (2026-11-06)

## Intent

Hoy cancelar una reserva no dice por qué se cancela y no hay forma de ver las canceladas. Se quiere que cancelar pida un motivo de una lista cerrada y que se pueda consultar qué se canceló y por qué. Éxito: cada cancelación lleva uno de los tres motivos y `canceladas` los muestra. Fracaso, aunque funcione: que una cancelación se haga sin motivo, o que `canceladas` mezcle las anulaciones del responsable.

## Scope

- Entra: `--motivo` en `cancelar` con las tres claves; el aviso de motivo no válido; el comando `canceladas`; los tests; la capacidad `booking-cancellation`.
- No entra: texto libre en `otro`; cambiar `anular` (fila 0011); estadísticas de motivos; persistencia (las reservas siguen en memoria).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Salida `cancelada <sala> <día>` (pasa a llevar ` · <motivo>`) | `src/app.js:17`, `test/cancel.test.js:6` | Decisión 4 y requisito «Cancelar con motivo» |
| `cancelar` sin motivo ya no cancela | `src/app.js:30`, `test/cancel.test.js:5-6` | Decisión 2 y requisito «Motivo obligatorio y de la lista» |
| `sin reserva <sala> <día>`: mismo texto; el test pasa a usar `--motivo` | `src/app.js:14`, `test/cancel.test.js:9-10` | Requisito «Cancelar sin reserva» (ADDED: la capacidad es nueva); decisión 8 |

- Filas que implementa: 0010 → `.docs/sdd/roadmap.md:7` (se marca al cerrar); `git grep -n 0010` fuera de `specs/` no encuentra más ficheros que la nombren.

## Approach

Decisión 9 de ✋. La lista de motivos es una constante de `src/app.js` con la clave y el texto mostrado de cada uno.

## Dónde se prueba

- Cancelar con motivo, motivo no válido, sin reserva y `libres` tras cancelar: por `run()` en `test/cancel.test.js`, como los tests actuales.
- `canceladas` con una cancelada y con una anulada: por `run()` en `test/canceladas.test.js`; `sin canceladas`, en `test/canceladas-vacio.test.js` (estado aislado por fichero).

## Términos y ADR

- Términos resueltos: motivo — una de las tres claves de la lista cerrada que acompaña a una cancelación | ninguno más
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar con motivo

- GIVEN reserva activa de Norte el lun (la semilla) en la franja 10:00-12:00
- WHEN `cancelar Norte lun --motivo cambio-de-planes`
- THEN responde `cancelada Norte lun · cambio de planes`
- AND `libres 10:00-12:00` responde `Norte, Sur`

#### ADDED — Textos de las tres claves

- GIVEN reserva activa de Norte el lun
- WHEN `cancelar Norte lun --motivo sala-ocupada`
- THEN responde `cancelada Norte lun · sala ocupada`
- AND con `--motivo otro` responde `cancelada Norte lun · otro`

#### ADDED — Motivo obligatorio y de la lista

- GIVEN reserva activa de Norte el lun
- WHEN `cancelar Norte lun` sin `--motivo`
- THEN responde `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`
- AND la reserva sigue activa
- AND con `--motivo aburrimiento`, con `--motivo` sin valor, con `--motivo=otro` o con `--motivo OTRO` responde lo mismo

#### ADDED — Motivo inválido sin reserva

- GIVEN no hay reserva activa de Sur el mar
- WHEN `cancelar Sur mar --motivo aburrimiento`
- THEN responde `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`

#### ADDED — Cancelar sin reserva

- GIVEN no hay reserva activa de Sur el mar
- WHEN `cancelar Sur mar --motivo otro`
- THEN responde `sin reserva Sur mar`
- AND con Norte lun ya cancelada, `cancelar Norte lun --motivo otro` responde `sin reserva Norte lun` y no cambia su motivo

#### ADDED — Listado de canceladas

- GIVEN Norte lun cancelada con `--motivo sala-ocupada`
- WHEN `canceladas`
- THEN responde `Norte lun · sala ocupada`
- AND sin ninguna cancelada responde `sin canceladas`
- AND con Norte lun anulada con `anular Norte lun`, responde `sin canceladas`

#### Reglas de la capacidad — booking-cancellation

- **Dónde viven los datos**: en memoria, en la propia reserva (`reason`), que guarda la clave del motivo y no su texto
- **Idioma de los nombres**: mensajes en castellano; claves en kebab-case sin tildes, con este texto mostrado: `cambio-de-planes` → «cambio de planes», `sala-ocupada` → «sala ocupada», `otro` → «otro»
- **Límites**: tres motivos, lista cerrada, `otro` sin texto libre; el listado no tiene tope
- **Avisos**: `motivo no válido: usa cambio-de-planes, sala-ocupada u otro` cuando falta, no está en la lista o la forma del comando no es `cancelar <sala> <día> --motivo <clave>` con exactamente esos cuatro argumentos; respuestas `sin reserva <sala> <día>` y `sin canceladas`
- **Regla ante conflicto**: con motivo no válido y sin reserva, gana el aviso del motivo

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-06 | aprobada por delegación: «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» |
