---
id: 20261102-171634-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar
mode: full
profile: delegate
status: draft
created: 2026-11-02
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Motivo al cancelar

🦆 Hoy `cancelar Norte lun` cancela y no queda por qué. Con esta feature hay que decir el motivo, de una lista de tres: `cancelar Norte lun cambio-de-planes` responde `cancelada Norte lun (cambio-de-planes)`, y un comando nuevo, `canceladas`, enseña las canceladas con su motivo: `Norte lun 10:00-12:00 · cambio-de-planes`. Sin motivo, o con uno que no está en la lista, no cancela y te dice cuáles hay. Por dentro, la cancelación guarda el motivo en la reserva y el listado filtra las de estado cancelada.

Validación: dev-lead — es un comando que usa una persona y los textos de respuesta los tiene que leer ella.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo de una lista y listar las canceladas con su motivo.
- Modificadas: ninguna (`capability index` dice «Sin capacidades»: no hay requisito vigente que modificar).
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (1 de 8) · tamaño: ~30 líneas en 3 ficheros (`src/app.js` y los dos tests). El dev-lead dijo «sin review».
- Mínimo razonable: ninguna — deja sin mirar que el repaso de coherencia lo hago yo sola.

1. **Capacidad nueva `booking-cancellation`**: no existía ninguna; el comportamiento previo de cancelar (patch 0007, v0.3.0) no está escrito en `capabilities/`, así que se escribe todo como `ADDED` y no hay `MODIFIED`.
2. **Sintaxis**: `cancelar <sala> <día> <motivo>` y comando nuevo `canceladas` (sin argumentos). Nadie dijo cómo se llaman.
3. **Los tres motivos se escriben como un solo token**: `cambio-de-planes`, `sala-ocupada`, `otro` (la lista que dijo el dev-lead, en kebab-case porque la línea de comandos separa por espacios).
4. **Motivo obligatorio**: sin él no se cancela. Respuesta: `falta el motivo: cambio-de-planes, sala-ocupada u otro`.
5. **Motivo fuera de la lista**: no se cancela. Respuesta: `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`.
6. **Orden de las comprobaciones**: primero que haya reserva (`sin reserva Sur mar`, igual que hoy, aunque falte el motivo) y después el motivo. Así el test actual de «sin reserva» sigue valiendo.
7. **Respuesta al cancelar**: `cancelada Norte lun (cambio-de-planes)`; lo que ya devolvía, más el motivo entre paréntesis.
8. **Formato del listado**: una línea por cancelada, `<sala> <día> <franja> · <motivo>`, en el orden en que se cancelaron; sin ninguna, `sin canceladas`. Solo canceladas: las anuladas por el responsable (`anular`, fila 0011) no salen.
9. **`otro` sin texto libre**: solo se guarda el token. Un texto libre no entra.
10. **Reservas ya canceladas antes**: viven en memoria y se pierden al reiniciar (`operations.md`), así que no hay migración ni «sin motivo» que mostrar.
11. **Repaso de coherencia y prueba del delta** (copia temporal de `.docs/sdd`, `capability merge`, rc=0): `booking-cancellation.md: añadido «Cancelar con motivo» · «El motivo es obligatorio y de la lista» · «Listado de canceladas» · 5 reglas añadidas`. Corregido por mí: «Términos» decía que la fila 0011 tenía motivo, y no es cierto; ahora dice «si lo hay».
- Política de modelos: revisores de la spec: ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Al cancelar se elige un motivo de una lista cerrada: cambio de planes, sala ocupada, otro — «al cancelar una reserva se elige un motivo de una lista (cambio de planes, sala ocupada, otro)»
- El listado de canceladas enseña el motivo — «el listado de canceladas lo enseña»
- Sin review de la spec — «Sin review»

## Intent

Hoy `cancelar` pierde la razón: de una reserva cancelada solo queda el estado. El dev-lead quiere saber por qué se cancela, con una lista cerrada para poder contarlas. Éxito: toda cancelada nueva lleva uno de los tres motivos y `canceladas` los enseña. Fracasa, aunque funcione, si se puede cancelar sin motivo o si el listado mezcla las anuladas.

## Scope

- Entra: motivo obligatorio y de la lista en `cancelar`; comando `canceladas` con el motivo; ajustar los tests de `cancelar` de `test/cancel.test.js` al comando nuevo.
- No entra: `anular` y su motivo (fila 0011); texto libre en `otro`; contar o agrupar motivos; cambiar `libres`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js` `cancelBooking`; `test/cancel.test.js:5-7`; `.docs/sdd/changelog.md:20` («Cancelar una reserva propia», histórico de v0.3.0) | Scope y decisión 4; el test se reescribe con motivo; el changelog es historia y no se toca |
| Respuesta `cancelada <sala> <día>` pasa a llevar `(<motivo>)` | `src/app.js` `cancelBooking`; `test/cancel.test.js:6` | decisión 7 |

- Filas que implementa: 0010 → `roadmap.md:7` (pasa a hecha al cerrar, lo hace `sdd-archive`) | `capabilities/` vacío; `PRODUCT.md:9-10` solo define Cancelación y Anulación como términos: sin cambio, comprobado con `grep -rniE "cancel|0010|motivo"` sobre los `.md`.

## Approach

El motivo se guarda en la reserva al cancelarla. `cancelar` valida primero que haya reserva y luego el motivo contra la lista. `canceladas` recorre las reservas en estado `cancelled` y las imprime. Los detalles de código van al plan.

## Dónde se prueba

- Cancelar con motivo, sin motivo, motivo inválido, sin reserva y `canceladas`: por `run(cmd, params)`, como los tests de `test/cancel.test.js` actuales.

## Términos y ADR

- Términos resueltos: **Cancelación** (`PRODUCT.md`) es la que lleva motivo; **Anulación** (la del responsable) queda fuera y su motivo, si lo hay, es la fila 0011.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar con motivo

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun cambio-de-planes`
- THEN responde `cancelada Norte lun (cambio-de-planes)`
- AND la reserva deja de bloquear la franja: `libres 10:00-12:00` incluye Norte

#### ADDED — El motivo es obligatorio y de la lista

- GIVEN reserva activa Norte lun
- WHEN `cancelar Norte lun`
- THEN responde `falta el motivo: cambio-de-planes, sala-ocupada u otro` y la reserva sigue activa
- AND con `cancelar Norte lun lluvia` responde `motivo no válido: usa cambio-de-planes, sala-ocupada u otro` y la reserva sigue activa
- AND con `cancelar Sur mar` (sin reserva) responde `sin reserva Sur mar`, sin comprobar el motivo

#### ADDED — Listado de canceladas

- GIVEN Norte lun cancelada por `cambio-de-planes` y Norte mar (10:00-12:00) por `sala-ocupada`, en ese orden, y una reserva Sur lun anulada con `anular`
- WHEN `canceladas`
- THEN responde dos líneas: `Norte lun 10:00-12:00 · cambio-de-planes` y `Norte mar 10:00-12:00 · sala-ocupada`
- AND sin ninguna cancelada responde `sin canceladas`

#### Reglas de la capacidad — booking-cancellation

- **Dónde viven los datos**: en memoria, junto a las reservas
- **Idioma de los nombres**: castellano, motivos en kebab-case
- **Límites**: lista cerrada de tres motivos; sin texto libre
- **Avisos**: `falta el motivo: …` y `motivo no válido: …` (literales arriba)
- **Regla ante conflicto**: no aplica

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
