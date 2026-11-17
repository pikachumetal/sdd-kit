---
id: 20261111-195048-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar
mode: full
status: draft
created: 2026-11-11
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Motivo al cancelar

🦆 Hoy `cancelar Norte lun` cancela la reserva sin más. Con esta feature hay que decir por qué: `cancelar Norte lun sala-ocupada` cancela y guarda el motivo. Los motivos son tres: cambio de planes, sala ocupada y otro. Sin motivo, o con uno que no está en la lista, no se cancela nada y se avisa. Además hay un comando nuevo, `canceladas`, que lista las canceladas con su motivo: `Norte lun · sala ocupada`.

Validación: dev-lead — es texto de terminal que lee una persona, y la forma de la salida la decide quien usa la herramienta.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo y listar las canceladas.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna, la pidió el dev-lead — señales: capacidad nueva · tamaño: ~60 líneas en 4 ficheros (`src/app.js`, `test/cancel.test.js`, `CHANGELOG.md`, la capacidad)
- Mínimo razonable: el dev-lead eligió no revisar — queda sin mirar si el cambio de salida de `cancelar` rompe a quien ya la use en scripts (hoy solo la usa el propio dev-lead)

1. Enfoque: motivo como tercer argumento posicional de `cancelar`, frente a una opción `--motivo` y a un menú interactivo (ver Approach).
2. Capacidad nueva `booking-cancellation` (slug en inglés, kebab-case): no existe ninguna en `capabilities/` y el comportamiento de cancelar no estaba documentado.
3. Los motivos se escriben en el comando como `cambio-de-planes`, `sala-ocupada` y `otro` (sin espacios, para que sean un solo argumento) y se enseñan en el listado como «cambio de planes», «sala ocupada» y «otro».
4. El motivo es obligatorio: sin él no se cancela. Alternativa descartada: motivo opcional con `otro` por defecto, porque el listado perdería sentido.
5. Textos de aviso, literales: sin motivo, `falta el motivo: usa cambio-de-planes, sala-ocupada u otro`; con motivo fuera de la lista, `motivo no válido «<lo escrito>»: usa cambio-de-planes, sala-ocupada u otro`. En ambos la reserva queda activa.
6. El motivo se valida antes de buscar la reserva: `cancelar Sur mar` sin motivo avisa del motivo, no de que falta la reserva.
7. El listado de canceladas no existe hoy (el roadmap lo da por existente): se crea el comando `canceladas`, sin argumentos. Una línea por reserva: `<sala> <día> · <motivo>`; en el orden en que se cancelaron; sin ninguna, `sin canceladas`.
8. Las anuladas por el responsable (`anular`, términos de PRODUCT.md) no salen en `canceladas` y `anular` no pide motivo: es la 0011.
9. La salida de éxito de `cancelar` no cambia: `cancelada Norte lun`.
10. No propongo `§Frontend`: no hay pantalla, es texto de terminal y se prueba con `node --test`.
- Política de modelos: revisores de la spec ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
- Delta probado en copia: ver «Pasada de coherencia».

### Decisiones tomadas con el dev-lead

- Se elige un motivo de una lista: cambio de planes, sala ocupada, otro — «al cancelar una reserva se elige un motivo de una lista (cambio de planes, sala ocupada, otro)»
- El listado de canceladas enseña el motivo — «el listado de canceladas lo enseña»
- Sin review de la spec — «Sin review»

## Intent

Hoy cancelar una reserva no deja rastro del porqué. Se quiere saber, de cada cancelada, si fue por un cambio de planes, porque la sala estaba ocupada o por otra razón. Éxito: toda cancelada nueva tiene uno de los tres motivos y el listado `canceladas` lo muestra. Fracaso, aunque funcione: que se pueda cancelar sin motivo o con uno inventado.

## Scope

- Entra: `cancelar <sala> <día> <motivo>` con los tres motivos y sus avisos; comando `canceladas`; tests; línea en `CHANGELOG.md`.
- No entra: motivo en `anular` (0011); motivos editables o con texto libre; motivo en reservas ya canceladas antes de esta feature (viven en memoria, no hay histórico); la regla de las 24 h de la Cancelación (no está implementada hoy y no la toca).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Forma `cancelar <sala> <día>` (sin motivo) | `src/app.js:30`; `test/cancel.test.js:6` y `:10` | Scope; decisión 4; los dos tests se actualizan a la forma nueva |
| «Cancelar una reserva propia» (0.3.0) | `CHANGELOG.md` | histórico de una release cerrada: no se toca |
| Cancelación (término) | `PRODUCT.md:13` | sin cambio: el término vale igual |

- Filas que implementa: 0010 → `ROADMAP.md` (su propia fila, la pasa a hecha el cierre) | no se nombra en otro fichero: comprobado con `git grep -nE "0010|motivo|canceladas"` fuera de las carpetas de specs

## Approach

- A. Tercer argumento posicional: `cancelar Norte lun sala-ocupada`. Cuesta: nada nuevo en el parser; el motivo es obligatorio, como sala y día.
- B. Opción `--motivo sala-ocupada`, como `--cada-semana` de `reservar`. Cuesta: una opción que en la práctica no es opcional, y un parser de opciones que hoy no existe (`reservar` solo comprueba si la opción está).
- C. Menú interactivo que pregunta el motivo. Cuesta: la herramienta no es interactiva y `run()` se prueba sin terminal.
- Elegido: A — es lo más pequeño y coherente con los argumentos que `cancelar` ya recibe.

Partes del cómo: la lista de motivos (clave → texto) vive en un solo sitio de `src/app.js`; `cancelBooking` valida el motivo, antes de buscar la reserva, y lo guarda en la reserva; `canceladas` filtra por estado `cancelled`.

## Dónde se prueba

- Cancelar con motivo, sin motivo y con motivo inválido: por `run('cancelar', …)`, como los tests actuales de `test/cancel.test.js`.
- Listado de canceladas: por `run('canceladas', [])`, en el mismo fichero.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar exige un motivo de la lista

- GIVEN reserva activa Norte lun
- WHEN `cancelar Norte lun sala-ocupada`
- THEN responde `cancelada Norte lun` y la reserva queda cancelada con el motivo «sala ocupada»

- GIVEN reserva activa Norte lun
- WHEN `cancelar Norte lun`
- THEN responde `falta el motivo: usa cambio-de-planes, sala-ocupada u otro` y la reserva sigue activa

- GIVEN reserva activa Norte lun
- WHEN `cancelar Norte lun vacaciones`
- THEN responde `motivo no válido «vacaciones»: usa cambio-de-planes, sala-ocupada u otro` y la reserva sigue activa

- GIVEN ninguna reserva activa Sur mar
- WHEN `cancelar Sur mar otro`
- THEN responde `sin reserva Sur mar`

- GIVEN ninguna reserva activa Sur mar
- WHEN `cancelar Sur mar`
- THEN responde `falta el motivo: usa cambio-de-planes, sala-ocupada u otro`

#### ADDED — El listado de canceladas enseña el motivo

- GIVEN canceladas Norte lun por `sala-ocupada` y Sur mar por `cambio-de-planes`, en ese orden
- WHEN `canceladas`
- THEN responde dos líneas: `Norte lun · sala ocupada` y `Sur mar · cambio de planes`

- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN responde `sin canceladas`

- GIVEN Norte lun anulada por el responsable, sin cancelar
- WHEN `canceladas`
- THEN responde `sin canceladas`

#### Reglas de la capacidad — booking-cancellation

- **Dónde viven los datos**: en memoria, en la propia reserva (campo del motivo)
- **Idioma de los nombres**: castellano en los mensajes; las claves de motivo en castellano con guiones
- **Límites**: solo tres motivos: `cambio-de-planes`, `sala-ocupada`, `otro`
- **Avisos**: `falta el motivo: usa cambio-de-planes, sala-ocupada u otro` · `motivo no válido «<lo escrito>»: usa cambio-de-planes, sala-ocupada u otro`
- **Regla ante conflicto**: no aplica

## Pasada de coherencia

- Literales: los dos avisos y la lista de tres claves son idénticos en decisiones 3 y 5, escenarios y reglas.
- `MODIFIED`: ninguno; el comportamiento previo de `cancelar` no estaba en ninguna capacidad.
- Delta en copia: `sdd capability merge` sale con código 0: crea `booking-cancellation.md` con 2 requisitos añadidos y las 5 reglas.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
