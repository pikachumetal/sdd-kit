---
id: 20261106-114213-feature-0010-motivo-cancelacion
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

🦆 Hasta ahora `cancelar Norte lun` cancela y ya. Con esto, quien cancela tiene que decir por qué, eligiendo de una lista fija: `cancelar Norte lun --motivo sala-ocupada` responde `cancelada Norte lun (sala ocupada)`. Si falta el motivo o no es de la lista, no cancela y dice cuáles valen. Un comando nuevo, `canceladas`, lista las canceladas con su motivo: `Norte lun 10:00-12:00 · sala ocupada`. Las reservas viven en memoria, así que `canceladas` solo ve lo cancelado en esa misma ejecución. Por dentro, la reserva guarda el motivo al cancelarse y `canceladas` filtra las de estado `cancelled`.

Validación: dev-lead — lo que cambia es lo que ve quien usa la herramienta en la terminal.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo y listar las canceladas. Es la primera capacidad del proyecto: la cancelación de hoy no está descrita en ninguna, así que todo su delta es `ADDED`.
- Modificadas: ninguna.
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-cancellation`), contrato público (el comando `cancelar` y el nuevo `canceladas` son la interfaz de la herramienta), cambio de un comportamiento vigente (`cancelar` sin motivo deja de cancelar) · tamaño: ~40 líneas en 3 ficheros
- Dominio (sonnet): si «Cancelar exige un motivo de la lista» deja claro qué pasa con `cancelar` sin motivo, con motivo fuera de la lista y sin reserva, y si `canceladas` no mezcla anuladas con canceladas (señal: cambio de comportamiento vigente)
- Técnica (sonnet): si el análisis de `--motivo <valor>` en `run(cmd, params)` convive con `--cada-semana` y con los parámetros posicionales de `cancelar` (señal: contrato público)
- Segunda ronda (sonnet, siete puntos): una vez, tras aceptar tres Críticos de la primera.
- Mínimo razonable: solo dominio — deja sin mirar la convivencia del flag con el análisis de parámetros de `src/app.js`

### Hallazgos de la review

Primera ronda (dominio y técnica):

- **Aceptado** — Crítico técnica: sin escenario para `--motivo` sin valor ni con el flag antes de los posicionales → escenarios añadidos y decisión 13.
- **Aceptado** — Crítico técnica: sin escenario para la convivencia con `--cada-semana` → escenario añadido y decisión 13.
- **Aceptado** — Crítico dominio: sin escenario `cancelar Sur mar` sin motivo (orden de validación) → escenario añadido a «Cancelar una reserva que no existe». Coincide con el Importante de técnica.
- **Rechazado** — Crítico dominio: `ADDED` sería un `MODIFIED` sin declarar → no existe ninguna capacidad escrita que describa la cancelación de hoy, así que no hay requisito vivo que sustituir: el delta crea la capacidad. Lo dejo dicho en «Capacidades».
- **Aceptado** — Importante: el Intent prometía más de lo que entrega sin persistencia → Intent y Scope acotados a una ejecución.
- **Aceptado** — Importante: `anular` y su estado `voided` no estaban comprobados → decisión 8 cita `voidBooking` en `src/app.js:21-26`, que pone `voided`; `anular` no cambia.
- **Aceptado** — Importante: cancelar dos veces y la interacción con `libres`, `reservar` y `anular` → escenario «cancelar dos veces» y decisión 14 (`libres` y `anular` solo ven activas, como hoy; `reservar` no crea reservas hoy).
- **Aceptado** — Importante: faltaban las cinco reglas por nombre → bloque «Reglas de la capacidad».
- **Aceptado** — Importante: decisiones sin listar (modelo de datos, registro del comando) → decisiones 13, 15 y 16.
- **Aceptado, cambia la decisión 7** — Importante: escenario con orden de varias canceladas → con una sola reserva sembrada y `reservar` sin crear reservas no hay forma de tener dos canceladas; la decisión 7 ya no promete un orden.
- **Aceptado** — Importante: aislamiento de estado entre tests → un fichero de test por estado de partida; `node --test` aísla cada fichero (decisión 17). No se exporta ningún reset.
- **Aceptado** — Menor: `--motivo "sala ocupada"` con espacios → decisión 13 y escenario.
- **Aceptado** — Menor: decisión 12 daba más confianza de la que sostiene → reformulada.
- **Rechazado** — Menor dominio: sacar «parar tras la Task 1» de las decisiones con el dev-lead → es su frase literal y la regla manda registrarla ahí; no es una decisión de dominio, pero tampoco molesta.
- **Aceptado** — Menor técnica: estado `draft` frente a aprobación → la spec pasa a `approved` al cerrar la review y la segunda ronda.

1. Enfoque elegido: motivo como flag `--motivo <valor>`, igual que `--cada-semana` en `reservar`. Descartado: tercer parámetro posicional (`cancelar Norte lun sala-ocupada`), porque un motivo omitido por descuido se confundiría con el día; descartado: preguntar en interactivo, porque la herramienta no lee de la entrada estándar.
2. Valores de la lista, como se escriben en la línea de comandos: `cambio-de-planes`, `sala-ocupada`, `otro`. Se muestran con espacios: «cambio de planes», «sala ocupada», «otro». Nadie dijo el nombre del flag ni la forma con guiones.
3. El motivo es obligatorio: sin él o con uno fuera de la lista, `cancelar` no cancela y responde `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`. El roadmap dice «se elige un motivo de una lista»; que sea obligatorio y no opcional lo decido yo.
4. Respuesta al cancelar: `cancelada Norte lun (sala ocupada)`, el texto de hoy más el motivo entre paréntesis.
5. El motivo se valida antes de buscar la reserva: `cancelar Sur mar` sin motivo responde `motivo no válido…`, no `sin reserva Sur mar`.
6. «Otro» no pide texto libre.
7. El listado es un comando nuevo, `canceladas`: una línea por reserva cancelada, `<sala> <día> <franja> · <motivo>` (`Norte lun 10:00-12:00 · cambio de planes`); sin ninguna, `sin canceladas`. No prometo un orden: hoy solo hay una reserva sembrada y `reservar` no crea reservas. Nadie dijo el nombre del comando ni el formato.
8. Las anuladas (`voided`, las que pone `anular` en `voidBooking`, `src/app.js:21-26`) no salen en `canceladas`: PRODUCT.md las define como otra cosa. `anular` no cambia.
9. Las reservas viven en memoria y cada ejecución de `node src/app.js` empieza de cero: desde la terminal, `canceladas` solo ve lo cancelado en esa misma ejecución. Persistirlas es otra feature y no entra.
10. Capacidad nueva `booking-cancellation` (inglés kebab-case): el proyecto no tiene capacidades y la cancelación es lo que esta feature describe.
11. Los tests de `test/cancel.test.js` que llaman a `cancelar` sin motivo cambian: son el comportamiento vigente que esta feature reemplaza (decisión 3).
12. Pasada de coherencia: `sdd capability merge` sobre una copia de `.docs/sdd` admite los tres requisitos de `booking-cancellation` sin rechazar nada (salida: «añadido» ×3: «Cancelar exige un motivo de la lista», «Cancelar una reserva que no existe», «Listado de canceladas»). Sin capacidades previas no hay contradicción posible que comprobar; la prueba solo dice que el delta tiene forma válida. El repo no cambia.
13. Lectura de parámetros: la sala y el día son los dos primeros parámetros de `cancelar`; `--motivo <valor>` se busca solo a partir del tercero, en cualquier orden respecto a otros flags. El orden es: separar sala y día, leer el motivo, buscar la reserva; con `cancelar --motivo otro Norte lun` la sala sería `--motivo`, el motivo cuenta como ausente y no se busca ninguna reserva. El valor es el token siguiente tal cual; si empieza por `--` cuenta como sin valor. Si `--motivo` no está, no tiene valor detrás o está antes de la sala (`cancelar --motivo otro Norte lun`), cuenta como motivo ausente. Si aparece dos veces, vale el primero. El valor se compara tal cual, en minúsculas y con guiones: `Sala-Ocupada` y `"sala ocupada"` no son válidos. Un `--cada-semana` en `cancelar` se ignora.
14. `libres` y `anular` no se tocan ni se prueban aquí; hoy solo consideran reservas activas.
15. Modelo de datos: la reserva cancelada pasa a `status: 'cancelled'` y guarda `reason` con la forma de pantalla («sala ocupada»), no la clave con guiones.
16. `canceladas` se añade al despacho de `run` junto a `cancelar` y `anular`; no hay ayuda ni lista de comandos que actualizar, y un comando desconocido sigue respondiendo `salas`.
17. Aislamiento de los tests: las reservas son un array del módulo que no se reinicia. Cada estado de partida distinto del listado va en su propio fichero de test, porque `node --test` ejecuta cada fichero en un proceso aparte; no se exporta ningún reset.
- Política de modelos: revisores de la spec: dos, sonnet (dominio y técnica), más uno de segunda ronda, sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura solo si el plan lo pide · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación el 2026-11-06 — «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.»
- Parar al tener el commit de la Task 1 — «cuando tengas el commit de la Task 1, para»
- Motivos de la lista: cambio de planes, sala ocupada, otro — «de una lista: cambio de planes, sala ocupada, otro»
- El listado de canceladas enseña el motivo — fila 0010 del roadmap: «y el listado de canceladas lo enseña»

## Intent

Hoy `cancelar <sala> <día>` cancela una reserva activa sin dejar rastro de por qué. El dueño de la herramienta quiere saber por qué se cancela. Éxito: no se puede cancelar sin elegir uno de los tres motivos, y `canceladas` los enseña dentro de la misma ejecución, que es lo que permite hoy la memoria. Fracasaría, aunque funcione, si una cancelación sin motivo válido llegara a cancelar la reserva, o si `canceladas` incluyera reservas anuladas.

## Scope

- Entra: el flag `--motivo` en `cancelar`, con la lista cambio de planes · sala ocupada · otro; el mensaje de error; el motivo en la respuesta; el comando `canceladas`; los tests.
- No entra: persistir reservas entre ejecuciones (hasta entonces `canceladas` solo es útil dentro de una ejecución); texto libre en «otro»; motivo en `anular`; filtros ni orden del listado; cambiar `libres`, `reservar` ni `anular`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js:13-18` (`cancelBooking`), `src/app.js:30` (`run`) | Delta, requisito «Cancelar exige un motivo de la lista»; decisión 3 |
| Respuesta `cancelada <sala> <día>` | `src/app.js:17`, `test/cancel.test.js:6` | Delta, mismo requisito; decisión 4 |
| `cancelar` sin reserva responde sin pedir motivo | `test/cancel.test.js:9-11` | Test actualizado con motivo; delta, «Cancelar una reserva que no existe»; decisión 5 |

- Filas que implementa: 0010 → `.docs/sdd/roadmap.md:7` (la define la fila; la cierra `sdd-archive`) | comprobado con `git grep -nE "0010|cancel" -- . ':!.docs/sdd/specs'`: solo la fila del roadmap, `src/app.js`, `test/cancel.test.js` y el changelog (que cita el patch 0007, no cambia).

## Approach

Decidido con el dev-lead: motivo elegido de la lista cambio de planes, sala ocupada, otro, y listado de canceladas con el motivo. El resto del cómo está en las decisiones ✋ 1 a 17.

## Dónde se prueba

- Cancelar con motivo, sin motivo, con motivo fuera de la lista, cancelar dos veces y sin reserva: por `run('cancelar', [...])`, en `test/cancel.test.js`, con las pruebas que no cancelan antes que la que cancela y «ya cancelada» después.
- Listado de canceladas: por `run('canceladas', [])`, un fichero por estado de partida (decisión 17): `test/canceladas-vacia.test.js` (nada cancelado), `test/canceladas-con-motivo.test.js` (tras cancelar con `cambio-de-planes`) y `test/canceladas-anulada.test.js` (tras `anular Norte lun`).
- Lo que ve quien lo usa en la terminal: una ejecución real de `node src/app.js cancelar Norte lun --motivo sala-ocupada` en la validación.

## Términos y ADR

- Términos resueltos: motivo — la razón elegida de la lista al cancelar, ninguna otra.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar exige un motivo de la lista

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun --motivo sala-ocupada`
- THEN responde `cancelada Norte lun (sala ocupada)`
- AND la reserva deja de estar activa y guarda el motivo «sala ocupada»

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun` sin `--motivo`
- THEN responde `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`
- AND la reserva sigue activa

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun --motivo vacaciones`
- THEN responde `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`
- AND la reserva sigue activa

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun --motivo` (sin valor) o `cancelar --motivo otro Norte lun` (flag antes de la sala)
- THEN responde `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`
- AND la reserva sigue activa

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun --motivo --cada-semana` (el valor empieza por `--`: cuenta como sin valor)
- THEN responde `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`
- AND la reserva sigue activa

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `run('cancelar', ['Norte','lun','--motivo','sala ocupada'])` (un solo token con espacio, lo que llega con `--motivo "sala ocupada"`) o `cancelar Norte lun --motivo Sala-Ocupada`
- THEN responde `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`
- AND la reserva sigue activa

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun --cada-semana --motivo otro`
- THEN responde `cancelada Norte lun (otro)`

#### ADDED — Cancelar una reserva que no existe

- GIVEN no hay reserva activa en Sur mar
- WHEN `cancelar Sur mar --motivo otro`
- THEN responde `sin reserva Sur mar`

- GIVEN no hay reserva activa en Sur mar
- WHEN `cancelar Sur mar` sin motivo
- THEN responde `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`

- GIVEN tras `cancelar Norte lun --motivo otro`
- WHEN `cancelar Norte lun --motivo otro`
- THEN responde `sin reserva Norte lun`

#### ADDED — Listado de canceladas

- GIVEN tras `cancelar Norte lun --motivo cambio-de-planes`
- WHEN `canceladas`
- THEN responde `Norte lun 10:00-12:00 · cambio de planes`

- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN responde `sin canceladas`

- GIVEN Norte lun 10:00-12:00 anulada con `anular Norte lun`
- WHEN `canceladas`
- THEN responde `sin canceladas`

#### Reglas de la capacidad — booking-cancellation

- **Dónde viven los datos**: en memoria, en la reserva (`status`, `reason`); se pierden al terminar la ejecución.
- **Idioma de los nombres**: valores del flag en castellano con guiones (`sala-ocupada`); texto mostrado en castellano con espacios; los nombres internos del código (`status`, `reason`, `cancelled`) en inglés, como el resto de `src/app.js`.
- **Límites**: la lista tiene tres valores, exactos en minúsculas y con guiones; sin texto libre.
- **Avisos**: `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`.
- **Regla ante conflicto**: el motivo se valida antes que la reserva; con `--motivo` repetido vale el primero.

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-06 | aprobada por delegación: «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» |
