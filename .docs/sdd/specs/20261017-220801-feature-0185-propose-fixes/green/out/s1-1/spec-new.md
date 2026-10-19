---
id: 20261018-103004-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar
mode: full
profile: delegate
status: draft
created: 2026-10-18
author: <git-user>
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Motivo al cancelar

🦆 Al cancelar una reserva hay que decir por qué, eligiendo entre «cambio de planes», «sala ocupada» y «otro»: `cancelar Norte lun sala-ocupada` cancela la reserva de Norte del lunes con ese motivo. Sin motivo, o con uno que no está en la lista, no se cancela nada y se dice qué motivos hay. Un listado nuevo de canceladas enseña cada reserva con su motivo: «Norte lun 10:00-12:00 — sala ocupada». Las anuladas por el responsable de sala no salen en ese listado.

## Capacidades

- Nuevas: `cancellation` — cancelar una reserva propia con motivo y listar las canceladas.
- Modificadas: ninguna (hoy no hay capacidades en `capabilities/`).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec: ninguna (pedido por el dev-lead; 1 señal contada: capacidad nueva · tamaño: ~30 líneas en 3 ficheros).

1. **No existe ningún listado de canceladas** en la aplicación; el roadmap lo da por hecho. Lo creo en esta feature: comando `canceladas`.
2. Capacidad nueva `cancellation` (en `capabilities/`, nombre en inglés). Recoge el comportamiento de cancelar —que hoy no está escrito en ninguna capacidad— junto con el motivo.
3. El motivo es un tercer argumento de `cancelar`: `cancelar <sala> <día> <motivo>`.
4. Los tres valores que se escriben: `cambio-de-planes`, `sala-ocupada`, `otro`. Se enseñan con espacios: «cambio de planes», «sala ocupada», «otro».
5. El motivo es obligatorio. Sin motivo o con uno desconocido no se cancela y la reserva sigue activa; respuesta literal: `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`.
6. Respuesta al cancelar con éxito: `cancelada Norte lun: sala ocupada` (antes: `cancelada Norte lun`).
7. El motivo se valida antes que la existencia de la reserva: `cancelar Sur mar` (sin reserva, sin motivo) responde el error de motivo, no `sin reserva Sur mar`.
8. Formato de cada línea del listado: `<sala> <día> <franja> — <motivo>`, en el orden en que se cancelaron; sin canceladas responde `sin canceladas`.
9. El listado solo incluye canceladas por el cliente; las anuladas (`anular`) no salen, porque la anulación no lleva motivo elegido (el 0011 decide su forma).
10. «Otro» no admite texto libre: es un valor más de la lista.
11. Corrección del repaso de coherencia: el `README.md` no documenta `cancelar`, así que no se toca.
12. No se parte en dos features: 2–3 tasks sobre una sola superficie (CLI).
- Prueba del delta (`sdd capability merge` sobre una copia en temp): añade `cancellation` con 4 requisitos y 5 reglas, sin rechazos.
- Política de modelos: sin revisores de spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.

### Decisiones tomadas con el dev-lead

- Al cancelar se elige un motivo de una lista (cambio de planes, sala ocupada, otro) y el listado de canceladas lo enseña — entrevista previa con el dev-lead; sin review.

## Intent

Hoy cancelar no deja rastro de por qué. Se quiere saber, al mirar las canceladas, el motivo de cada una. Éxito: toda reserva cancelada desde esta feature aparece en el listado con uno de los tres motivos, y no se puede cancelar sin elegirlo. Fracaso aunque funcione: que una cancelación sin motivo pase en silencio.

## Scope

- Entra: motivo obligatorio en `cancelar`; comando `canceladas`; capacidad `cancellation`; tests de ambos.
- No entra: texto libre en «otro»; motivo en `anular` (0011); cambiar o ampliar la lista de motivos; persistencia (las reservas viven en memoria); ordenar o filtrar el listado.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Respuesta `cancelada Norte lun` (sin motivo) | `src/app.js` (`cancelBooking`); `test/cancel.test.js` («cancelar una reserva activa») | Decisión 6; el test se reescribe en la task |
| `cancelar` sin tercer argumento válido | `test/cancel.test.js` («cancelar sin reserva lo dice», `cancelar Sur mar`) | Decisión 7; el test pasa a llevar motivo |
| Comando `cancelar <sala> <día>` | `README.md`: no lo nombra (comprobado con `grep cancelar README.md`) | nada que cambiar |

- Filas que implementa: 0010 → `roadmap.md` (fila ⏳; la cierra el archivo, no esta spec) | no hay otras: capacidades vacías, sin `skills/`; comprobado con `grep -r 0010`.

## Approach

El motivo es un valor de una lista cerrada de tres, validado al cancelar. La reserva cancelada lo guarda y el comando `canceladas` lo lee para listar. Nada más cambia en `anular` ni en `libres`.

## Dónde se prueba

- Cancelar con motivo y motivo no válido: por `run('cancelar', …)`, como los tests actuales de `test/cancel.test.js`.
- Listado `canceladas`: por `run('canceladas', [])`, en el mismo fichero.

## Términos y ADR

- Términos resueltos: **Motivo** — la razón de una cancelación, una de tres: cambio de planes, sala ocupada, otro.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `cancellation`

**ADDED — Cancelar con motivo**
- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun sala-ocupada`
- THEN responde `cancelada Norte lun: sala ocupada`
- AND la reserva deja de estar activa y `libres 10:00-12:00` vuelve a incluir Norte

**ADDED — El motivo es obligatorio y de la lista**
- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun` o `cancelar Norte lun aburrimiento`
- THEN responde `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`
- AND la reserva sigue activa

**ADDED — Cancelar sin reserva**
- GIVEN no hay reserva activa de Sur el mar
- WHEN `cancelar Sur mar otro`
- THEN responde `sin reserva Sur mar`

**ADDED — Listado de canceladas**
- GIVEN Norte lun 10:00-12:00 cancelada por `sala-ocupada` y Sur mar 14:00-15:00 cancelada por `otro`
- WHEN `canceladas`
- THEN responde dos líneas, `Norte lun 10:00-12:00 — sala ocupada` y `Sur mar 14:00-15:00 — otro`, en ese orden
- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN responde `sin canceladas`
- GIVEN una reserva anulada con `anular`
- WHEN `canceladas`
- THEN no sale en el listado

**Reglas de la capacidad**
- **Dónde viven los datos**: en memoria, como el resto de reservas.
- **Idioma de los nombres**: castellano; los valores del motivo van con guiones al escribirlos y con espacios al mostrarlos.
- **Límites**: tres motivos; no hay texto libre.
- **Avisos**: `motivo no válido: elige cambio-de-planes, sala-ocupada u otro`.
- **Regla ante conflicto**: no aplica.

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
