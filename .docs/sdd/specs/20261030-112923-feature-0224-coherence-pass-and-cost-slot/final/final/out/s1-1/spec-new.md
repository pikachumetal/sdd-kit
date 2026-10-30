---
id: 20261030-125548-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar
mode: full
status: draft
created: 2026-10-30
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Motivo al cancelar

🦆 Hoy `cancelar Norte lun` cancela sin preguntar por qué. Después de este cambio hay que decir el motivo, uno de tres (`cambio de planes`, `sala ocupada`, `otro`): `cancelar Norte lun sala ocupada` responde `cancelada Norte lun: sala ocupada`. Sin motivo, o con uno que no está en la lista, no cancela y te enseña los tres válidos. Un comando nuevo, `canceladas`, lista las reservas canceladas con su motivo: `Norte lun 10:00-12:00 · sala ocupada`.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con un motivo de una lista cerrada y listar las canceladas con su motivo.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (`booking-cancellation`) · tamaño: ~25 líneas en 3 ficheros (`src/app.js`, `test/cancel.test.js`, `PRODUCT.md`). Una señal de ocho, por debajo del umbral. El dev-lead ya dijo «sin review».

1. **Capacidad nueva `booking-cancellation`**: `capabilities/` está vacío, así que no hay requisito vigente que modificar; todo el delta es `ADDED`.
2. **El motivo es obligatorio**: «se elige un motivo de una lista» lo pide al cancelar; sin motivo no se cancela. Efecto: `cancelar Norte lun` a secas deja de funcionar (hoy responde `cancelada Norte lun`) y su test cambia.
3. **Sintaxis**: `cancelar <sala> <día> <motivo>`, con el motivo escrito tal cual (`cambio de planes`, `sala ocupada`, `otro`) y sin comillas: todo lo que va después del día se une con espacios. Nadie dijo cómo se escribe.
4. **Literales de la lista**: `cambio de planes`, `sala ocupada`, `otro` (los tres que dijo el dev-lead, en minúsculas y sin tildes que añadir). Comparación exacta, sin distinguir mayúsculas.
5. **Respuesta al cancelar**: `cancelada Norte lun: sala ocupada`.
6. **Respuesta sin motivo o con motivo no válido**: `indica un motivo: cambio de planes, sala ocupada, otro`. La reserva queda activa.
7. **Orden de comprobaciones**: si no hay reserva, responde `sin reserva <sala> <día>` aunque falte el motivo; el motivo se valida solo cuando hay algo que cancelar. Conserva el mensaje que ya existe.
8. **El listado es un comando nuevo, `canceladas`**: hoy no existe ningún listado de canceladas, y «el listado de canceladas lo enseña» lo exige. Formato `<sala> <día> <franja> · <motivo>`, una línea por reserva, en el orden en que se cancelaron; sin ninguna, `sin canceladas`.
9. **Las anuladas no salen en `canceladas`**: según `PRODUCT.md`, anulación y cancelación son cosas distintas, y las anulaciones son de la 0011. No se tocan.
10. **Datos**: el motivo vive en memoria junto a la reserva, como el resto (`operations.md`: sin base de datos). No hay migración.
11. **Sin tope ni aviso nuevos**: la lista es de tres motivos fijos en el código; añadir uno es cambiar la spec.
12. **Gate de cierre**: `node --test && node scripts/lint.mjs`, copiado de `operations.md`.
13. **Comprobación del delta**: `sdd capability merge` sobre una copia temporal de `.docs/sdd` salió con código 0: 5 requisitos añadidos y 5 reglas añadidas a `booking-cancellation.md`; el `capabilities/` del repo no cambia hasta el cierre.
- Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- Motivo de una lista (cambio de planes, sala ocupada, otro) al cancelar, y el listado de canceladas lo enseña — «al cancelar una reserva se elige un motivo de una lista (cambio de planes, sala ocupada, otro) y el listado de canceladas lo enseña»
- Sin review de la spec — «Sin review»

## Intent

Hoy se cancela una reserva sin dejar rastro de por qué, y no hay forma de ver las canceladas. Para saber por qué se liberan las salas hace falta el motivo, y que se vea. Éxito: toda cancelación nueva lleva uno de los tres motivos y `canceladas` lo muestra. Fracaso aunque funcione: que `cancelar` siga aceptando cancelaciones sin motivo.

## Scope

- Entra: motivo obligatorio y validado en `cancelar`; guardarlo en la reserva; comando `canceladas`; los tests de ambos; `PRODUCT.md` (término «Motivo»).
- No entra: anulaciones (0011) y su motivo; motivos de texto libre; editar el motivo después; el plazo de 24 h de `PRODUCT.md`, que el código no aplica hoy; cancelar reservas semanales; filtrar `canceladas` por sala o día.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar; la respuesta `cancelada Norte lun` pasa a `cancelada Norte lun: <motivo>` | `src/app.js:14-19` y `:30`; `test/cancel.test.js:5-7` | Scope y decisiones 2, 5 y 6; el test se reescribe con motivo y gana uno sin motivo |
| «Cancelar una reserva propia» (v0.3.0) | `.docs/sdd/changelog.md:20`, `.docs/sdd/roadmap.md:33` | historial de una release cerrada: no cambia; la entrada de esta feature la añade el cierre |
| La cancelación de `PRODUCT.md` | `PRODUCT.md:9` | Scope: se añade el término «Motivo»; la definición de cancelación no cambia |

- Filas que implementa: 0010 → `.docs/sdd/roadmap.md:7` la nombra; el cierre la pasa a hecha y no hay más sitios | comprobado con `grep -rn "0010" --exclude-dir=.git .`

## Approach

Una función de cancelar que valida el motivo contra la lista cerrada y lo guarda en la reserva, y una de listar. `run` enruta `canceladas`. Todo en `src/app.js`, el único fichero de entrada, sin dependencias.

## Dónde se prueba

- Cancelar con motivo, sin motivo y con motivo no válido: por `run('cancelar', …)`, como los tests actuales de `test/cancel.test.js`.
- Sin reserva: por `run('cancelar', …)`, el test existente.
- Listar canceladas (con y sin ninguna, y que no salgan las anuladas): por `run('canceladas', [])`, en `test/cancel.test.js`.

## Términos y ADR

- Términos resueltos: **Motivo** — la razón de una cancelación, una de `cambio de planes`, `sala ocupada` u `otro`.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar con motivo

- GIVEN una reserva activa de la sala Norte el lunes
- WHEN se ejecuta `cancelar Norte lun sala ocupada`
- THEN responde `cancelada Norte lun: sala ocupada`
- AND la reserva deja de estar activa y guarda el motivo `sala ocupada`

#### ADDED — El motivo es obligatorio y de la lista

- GIVEN una reserva activa de la sala Norte el lunes
- WHEN se ejecuta `cancelar Norte lun` sin motivo, o `cancelar Norte lun porque sí`
- THEN responde `indica un motivo: cambio de planes, sala ocupada, otro`
- AND la reserva sigue activa

#### ADDED — Cancelar lo que no existe

- GIVEN no hay reserva activa de la sala Sur el martes
- WHEN se ejecuta `cancelar Sur mar otro`, o `cancelar Sur mar` sin motivo
- THEN responde `sin reserva Sur mar`

#### ADDED — Listado de canceladas

- GIVEN la reserva de Norte el lunes de 10:00-12:00 cancelada con `sala ocupada`, y la de Sur el martes de 14:00-16:00 cancelada con `cambio de planes`
- WHEN se ejecuta `canceladas`
- THEN responde dos líneas, en el orden en que se cancelaron: `Norte lun 10:00-12:00 · sala ocupada` y `Sur mar 14:00-16:00 · cambio de planes`

#### ADDED — Listado sin canceladas ni anuladas

- GIVEN ninguna reserva cancelada, y una reserva de Norte el lunes anulada por el responsable
- WHEN se ejecuta `canceladas`
- THEN responde `sin canceladas`

#### Reglas de la capacidad — booking-cancellation

- **Dónde viven los datos**: en memoria, junto a la reserva; no hay base de datos.
- **Idioma de los nombres**: castellano.
- **Límites**: tres motivos fijos: `cambio de planes`, `sala ocupada`, `otro`.
- **Avisos**: `indica un motivo: cambio de planes, sala ocupada, otro`.
- **Regla ante conflicto**: no aplica.

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
