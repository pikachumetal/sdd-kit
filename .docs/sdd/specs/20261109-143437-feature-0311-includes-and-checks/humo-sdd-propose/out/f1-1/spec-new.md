---
id: 20261109-162249-feature-0010-motivo-cancelar
feature: 0010
title: Motivo al cancelar una reserva
mode: full
profile: delegate
status: approved
created: 2026-11-09
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-09
---

# Spec — Motivo al cancelar una reserva

🦆 Al cancelar una reserva hay que decir por qué, eligiendo de una lista: `cancelar Norte lun sala-ocupada` responde `cancelada Norte lun (sala ocupada)`. Sin motivo, o con uno fuera de la lista, no cancela y dice cuáles valen. Un comando nuevo, `canceladas`, lista las reservas canceladas con su motivo: `Norte lun 10:00-12:00 · sala ocupada`. Por dentro, la reserva guarda el motivo al pasar a cancelada.

Validación: dev-lead — es lo que usa una persona desde la terminal.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo y listar las canceladas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva · tamaño: ~60 líneas en 4 ficheros
- Técnica+dominio (sonnet, siete puntos): que los THEN cubran motivo ausente, motivo inválido y sin reserva, y que el comando `canceladas` no deje huecos con las anuladas (señal: capacidad nueva)
- Mínimo razonable: un revisor — deja sin mirar un segundo ojo sobre el formato de salida de `canceladas`

1. Enfoque: motivo como tercer argumento posicional de `cancelar`, frente a una opción `--motivo` o a preguntarlo de forma interactiva (ver Approach).
2. Los motivos se escriben con guiones, `cambio-de-planes`, `sala-ocupada`, `otro`, porque los argumentos se separan por espacios; en las respuestas salen con espacios («cambio de planes»). Los nombres salen de tu lista.
3. El motivo es obligatorio: `cancelar Norte lun` sin motivo ya no cancela. Es el único modo de que todas las canceladas tengan motivo.
4. Texto de error, para motivo ausente o fuera de la lista: «motivo no válido: usa cambio-de-planes, sala-ocupada u otro». Se comprueba antes de buscar la reserva y no cambia nada.
5. Respuesta al cancelar: `cancelada <sala> <día> (<motivo con espacios>)`.
6. El listado de canceladas es un comando nuevo, `canceladas` (la fila 0010 pide «el listado de canceladas» y hoy no existe ninguno): una línea por reserva, `<sala> <día> <franja> · <motivo con espacios>`, sin ninguna, «sin canceladas». Las anuladas (`anular`) no salen: son otro estado y su motivo lo trata la 0011.
7. Capacidad nueva, `booking-cancellation` (inglés, kebab-case): hoy `capabilities/` está vacío, así que el delta es solo `ADDED`.
8. La lista de motivos vive en una sola constante de `src/app.js`, que usan la validación, el mensaje de error y el listado. La comparación es exacta (distingue mayúsculas) y un argumento sobrante tras el motivo se ignora.
9. Las reservas viven en memoria, así que no hay canceladas anteriores sin motivo. `anular` no guarda motivo y no cambia.
10. La regla «antes de 24 h» de PRODUCT.md no la aplica hoy el código y queda fuera: no entra en el orden de comprobaciones.
- Delta probado en una copia de `.docs/sdd`: `sdd capability merge` añadió los requisitos a `booking-cancellation`, exit 0.
- Política de modelos: un revisor de spec en sonnet · revisión final: Spec opus+high, Código sonnet+high, Arquitectura no aplica (sin módulo ni dependencia) · sin otros despachos en paralelo.

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación — «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.»
- Parada tras el commit de la Task 1 — «cuando tengas el commit de la Task 1, para.»
- Motivos: cambio de planes, sala ocupada, otro — «un motivo al cancelar una reserva, de una lista: cambio de planes, sala ocupada, otro».

## Intent

Hoy `cancelar` anula la reserva sin dejar rastro de por qué. Se quiere que cada cancelación lleve un motivo de una lista cerrada y que se pueda consultar. Éxito: ninguna reserva cancelada sin motivo y `canceladas` lo enseña; fracaso aunque funcione: que se pueda cancelar sin motivo o con uno inventado.

## Scope

- Entra: motivo obligatorio en `cancelar`; guardarlo en la reserva; comando `canceladas`; actualizar `test/cancel.test.js`.
- No entra: motivo en `anular` (fila 0011); texto libre en «otro»; persistencia (las reservas viven en memoria); la regla de «antes de 24 h» (el código no la aplica).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js:13-18,30`; `test/cancel.test.js:5-7,9-11` | delta `ADDED` de `booking-cancellation` y decisión 3; el test se reescribe en la Task 1 |
| Respuesta `cancelada <sala> <día>` pasa a llevar `(<motivo>)` | `src/app.js:17`; `test/cancel.test.js:6` | decisión 5; test reescrito en la Task 1 |

- El comportamiento anterior de `cancelar` no estaba especificado en ninguna capacidad: esta spec lo especifica ya con el motivo.
- Filas que implementa: 0010 → `.docs/sdd/roadmap.md:7` (la salda el cierre) · changelog sin entrada previa | comprobado con `git grep -n -iE "cancel|0010|motivo"`: PRODUCT.md define Cancelación sin tocar su texto.

## Approach

- Tercer argumento posicional — encaja con `cancelar <sala> <día>` y `run(cmd, params)`; sin parser nuevo.
- `--motivo <valor>` — más legible, pero obliga a un parser de opciones que hoy solo existe de forma suelta (`--cada-semana`).
- Preguntar de forma interactiva — la app es de una sola línea de comando y los tests llaman a `run`: no encaja.
- Elegido: tercer argumento posicional, el más simple y el que respeta el patrón del fichero.

`cancelBooking(room, day, reason)` valida `reason` contra la lista antes de buscar la reserva y guarda `reason` en la reserva. Una función `canceledList()` arma las líneas de `canceladas`.

## Dónde se prueba

- Cancelar con motivo, sin motivo, con motivo inválido, sin reserva: por `run('cancelar', …)`, como `test/cancel.test.js`.
- Cada caso necesita una reserva Norte lun activa: cada test importa `../src/app.js?<caso>` para tener un módulo con las reservas recién sembradas, sin tocar el código para reiniciarlas.
- Listado `canceladas`: por `run('canceladas', [])` tras cancelar, en el mismo fichero de test.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar exige un motivo de la lista

- GIVEN la reserva de Norte el lun a 10:00-12:00, activa
- WHEN se cancela con `cancelar Norte lun sala-ocupada`
- THEN responde `cancelada Norte lun (sala ocupada)`
- AND `canceladas` muestra `Norte lun 10:00-12:00 · sala ocupada`
- AND con `cambio-de-planes` responde `cancelada Norte lun (cambio de planes)` y con `otro`, `cancelada Norte lun (otro)`, cada caso sobre una reserva de Norte lun activa recién sembrada

#### ADDED — Un motivo fuera de la lista no cancela

- GIVEN la reserva de Norte el lun, activa
- WHEN se pide `cancelar Norte lun aburrimiento`
- THEN responde `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`
- AND la reserva sigue activa

#### ADDED — Cancelar sin motivo no cancela

- GIVEN la reserva de Norte el lun, activa
- WHEN se pide `cancelar Norte lun`
- THEN responde `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`
- AND la reserva sigue activa
- AND con Sur el mar, que no tiene reserva, `cancelar Sur mar` responde lo mismo, no `sin reserva Sur mar`

#### ADDED — Solo cuenta el tercer argumento, exacto

- GIVEN la reserva de Norte el lun, activa
- WHEN se pide `cancelar Norte lun OTRO` o `cancelar Norte lun sala ocupada`
- THEN responde `motivo no válido: usa cambio-de-planes, sala-ocupada u otro` y la reserva sigue activa
- AND `cancelar Norte lun otro extra` cancela con el motivo «otro» e ignora `extra`

#### ADDED — Cancelar sin reserva lo dice

- GIVEN que Sur no tiene reserva el mar
- WHEN se pide `cancelar Sur mar otro`
- THEN responde `sin reserva Sur mar`
- AND una reserva ya cancelada cuenta como sin reserva: tras cancelar Norte lun, `cancelar Norte lun otro` responde `sin reserva Norte lun` y no cambia el motivo guardado

#### ADDED — El listado de canceladas enseña el motivo

- GIVEN la reserva de Norte el lun a 10:00-12:00, cancelada con `sala-ocupada`
- WHEN se pide `canceladas`
- THEN responde `Norte lun 10:00-12:00 · sala ocupada`
- AND sin ninguna cancelada responde `sin canceladas`
- AND con Norte lun anulada con `anular Norte lun` responde `sin canceladas`

### Hallazgos de la review

- **Rechazado** — 1 (Crítico: ADDED que oculta un MODIFIED) → no existe capacidad viva que modificar y `MODIFIED` sobre un requisito inexistente lo rechaza la fusión; la ruptura (cancelar sin motivo deja de funcionar) está declarada en «Lo que se retira» y en la decisión 3.
- **Aceptado** — 2 (Crítico) → separado en dos escenarios (motivo fuera de lista; sin motivo) y fijado que el motivo se valida antes que la reserva.
- **Aceptado** — 3 → escenario de reserva ya cancelada.
- **Aceptado** — 4 → la regla de 24 h no existe en el código; queda fuera y dicho en Scope y decisión 10.
- **Aceptado** — 5 → quitado el orden del listado (solo hay una reserva sembrada) y añadido el caso de anulada.
- **Aceptado** — 6 → decisión 8.
- **Aceptado** — 7 → decisión 9.
- **Rechazado** — 8 → la 0011 es otra fila; las anuladas quedan fuera del listado y el escenario lo fija.
- **Rechazado** — 9 → PRODUCT.md define Cancelación sin mencionar el motivo; no hay contradicción.
- **Aceptado** — 2.ª ronda 2, 3, 4, 5, 8 y 9 → THEN observable por `canceladas`, cada motivo en su reserva sembrada, escenario del tercer argumento exacto, línea del comportamiento previo y cómo se siembra.
- **Rechazado** — 2.ª ronda 1 (motivo vacío: no hay forma de pasarlo por la línea de comandos), 6 (hay una sola reserva sembrada; el comando nuevo ya está marcado en la decisión 6) y 7 (el dev-lead delega y queda en la frase literal).
- **Rechazado** — 10 → la parada es una instrucción de ejecución del dev-lead, registrada como tal; no es un criterio de aprobación. Pasa también al plan.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-09 | aprobada: «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» |
