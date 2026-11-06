---
id: 20261105-211150-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar
mode: full
status: draft
created: 2026-11-05
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Motivo al cancelar

🦆 Hoy `cancelar Norte lun` cancela y no queda por qué. Con esto, cancelar pide un motivo de una lista fija —`cambio-de-planes`, `sala-ocupada` u `otro`—: `cancelar Norte lun --motivo sala-ocupada` responde `cancelada Norte lun (sala ocupada)`. Un comando nuevo, `canceladas`, lista las canceladas con su motivo: `Norte lun 10:00-12:00 · sala ocupada`. Sin motivo, o con uno que no está en la lista, no se cancela nada y se dice cuáles valen. Por dentro, la reserva cancelada guarda su motivo en `src/app.js`.

Validación: dev-lead — es lo que ve quien teclea los comandos: el formato de las respuestas y del listado.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo y listar las canceladas.
- Modificadas: ninguna (hoy no hay capacidades en `capabilities/`; la cancelación vigente, de la 0007, entra en la nueva).
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — la descarta el dev-lead («Sin review»).
- Mínimo razonable que se omite: un revisor con los siete puntos; deja sin cubrir la compatibilidad del cambio de salida de `cancelar` con quien ya lo use.

1. **Enfoque (decisión central): flag `--motivo <id>` en `cancelar`.** Alternativas descartadas: un tercer argumento posicional (`cancelar Norte lun sala-ocupada`: menos legible y se confunde con otro dato) y preguntar por consola (`run` es síncrono y los tests lo llaman directo; añadiría E/S interactiva a un solo fichero sin dependencias).
2. **Capacidad nueva `booking-cancellation`** (inglés kebab-case): no hay capacidades; la cancelación existente (0007) y la nueva se documentan juntas.
3. **Identificadores de la lista**: `cambio-de-planes`, `sala-ocupada`, `otro`; se muestran con espacios («cambio de planes», «sala ocupada», «otro»). Los tres textos son del dev-lead; el kebab-case es mío (para teclearlos sin comillas).
4. **El motivo es obligatorio.** El dev-lead dijo «se elige un motivo»; lo leo como obligatorio. Sin él: `falta el motivo: usa --motivo cambio-de-planes | sala-ocupada | otro`, y no se cancela. Esto cambia el `cancelar Norte lun` de hoy.
5. **Motivo no válido** (`--motivo x`): `motivo no válido: x; usa cambio-de-planes | sala-ocupada | otro`; la reserva sigue activa.
6. **Orden de comprobación**: primero el motivo, luego la reserva (`cancelar Sur mar` sin motivo da «falta el motivo», no «sin reserva»).
7. **Respuesta al cancelar**: `cancelada Norte lun (cambio de planes)`, la actual más el motivo entre paréntesis. `sin reserva Sur mar` no cambia.
8. **Comando `canceladas`**: una línea por reserva, `<sala> <día> <franja> · <motivo>` (p. ej. `Norte lun 10:00-12:00 · sala ocupada`), en el orden en que se cancelaron; sin ninguna: `sin canceladas`. El nombre del comando es mío.
9. **`canceladas` no incluye las anuladas** (`anular`, estado `voided`): son otro caso (anula el responsable, ítem 0011).
10. **Sin `§Frontend`**: es una CLI sin pantalla.
11. **`PRODUCT.md` solo gana el término «Motivo»** (lo escribe el cierre).
- Delta probado en una copia de `.docs/sdd` con `sdd capability merge`: crea `booking-cancellation.md` con 7 requisitos añadidos, sin rechazos.
- Política de modelos: sin revisores de spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.

### Decisiones tomadas con el dev-lead

- Al cancelar se elige un motivo de una lista: cambio de planes, sala ocupada, otro — «al cancelar una reserva se elige un motivo de una lista (cambio de planes, sala ocupada, otro)»
- El listado de canceladas enseña el motivo — «el listado de canceladas lo enseña»
- Sin review de la spec — «Sin review»

## Intent

Hoy cancelar una reserva (`cancelar <sala> <día>`) la deja cancelada sin pista de por qué, y no hay forma de ver las canceladas. Se quiere saber por qué se cancela y verlo después. Éxito: toda reserva cancelada tiene uno de los tres motivos y `canceladas` los enseña. Sería un fracaso poder cancelar sin motivo o con uno fuera de la lista.

## Scope

- Entra: `cancelar` con `--motivo` obligatorio y de la lista; guardar el motivo; comando `canceladas`; adaptar los tests de `test/cancel.test.js` a la nueva salida.
- No entra: texto libre en el motivo; cambiar la lista por configuración; motivo en `anular` (ítem 0011); persistencia entre ejecuciones (las reservas siguen en memoria).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js:30`, `test/cancel.test.js:5-7` | delta `ADDED` «Cancelar exige motivo»; el test existente pasa a usar `--motivo` |
| Respuesta `cancelada Norte lun` pasa a `cancelada Norte lun (cambio de planes)` | `src/app.js:17`, `test/cancel.test.js:6` | delta `ADDED` «Cancelar con motivo»; decisión 7 |

- Filas que implementa: 0010 → `roadmap.md:7` (la fila; el cierre la salda); nada más la nombra, comprobado con `git grep -n 0010` fuera de `specs/`.
- `README.md` y `PRODUCT.md` no describen la sintaxis de `cancelar`: comprobado con `git grep -niE "cancelar|canceladas"`.

## Approach

`cancelar` acepta `--motivo <id>`; los tres ids válidos viven en una lista fija. La reserva cancelada guarda su motivo y `canceladas` lee las reservas en estado cancelado (decisión 1).

## Dónde se prueba

- Cancelar con motivo, sin motivo, con motivo no válido y sin reserva: por `run('cancelar', …)`, como los tests actuales de `test/cancel.test.js`.
- Listado de canceladas (con ninguna, con varias y sin anuladas): por `run('canceladas', [])`, en el mismo fichero. Una sola costura, la de `run`.

## Términos y ADR

- Términos resueltos: Motivo — la razón, de una lista fija, por la que se cancela una reserva.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar con motivo

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun --motivo sala-ocupada`
- THEN responde `cancelada Norte lun (sala ocupada)` y la reserva queda cancelada con ese motivo
- AND los motivos válidos son `cambio-de-planes` («cambio de planes»), `sala-ocupada` («sala ocupada») y `otro` («otro»)

#### ADDED — Cancelar exige motivo

- GIVEN reserva activa Norte lun
- WHEN `cancelar Norte lun` sin `--motivo`
- THEN responde `falta el motivo: usa --motivo cambio-de-planes | sala-ocupada | otro` y la reserva sigue activa

#### ADDED — Motivo fuera de la lista

- GIVEN reserva activa Norte lun
- WHEN `cancelar Norte lun --motivo aburrimiento`
- THEN responde `motivo no válido: aburrimiento; usa cambio-de-planes | sala-ocupada | otro` y la reserva sigue activa

#### ADDED — Cancelar sin reserva

- GIVEN no hay reserva activa Sur mar
- WHEN `cancelar Sur mar --motivo otro`
- THEN responde `sin reserva Sur mar`
- AND con motivo ausente o no válido, el aviso del motivo va antes que este

#### ADDED — Listar canceladas

- GIVEN Norte lun 10:00-12:00 cancelada por `sala-ocupada` y Sur mar 09:00-10:00 cancelada por `otro`
- WHEN `canceladas`
- THEN responde dos líneas, en orden de cancelación: `Norte lun 10:00-12:00 · sala ocupada` y `Sur mar 09:00-10:00 · otro`

#### ADDED — Listar canceladas sin ninguna

- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN responde `sin canceladas`

#### ADDED — Las anuladas no son canceladas

- GIVEN Norte lun anulada con `anular Norte lun`
- WHEN `canceladas`
- THEN responde `sin canceladas`

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
