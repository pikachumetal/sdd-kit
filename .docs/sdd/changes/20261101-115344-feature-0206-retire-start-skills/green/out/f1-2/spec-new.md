---
id: 20261101-122824-feature-0010-motivo-cancelar
feature: 0010
title: Motivo al cancelar una reserva
mode: full
status: approved
created: 2026-11-01
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-01
---

# Spec — Motivo al cancelar una reserva

🦆 Al cancelar una reserva tendrás que decir por qué, eligiendo de una lista: cambio de planes, sala ocupada u otro. Por ejemplo, `cancelar Norte lun --motivo sala-ocupada` responde `cancelada Norte lun (sala ocupada)`. Un comando nuevo, `canceladas`, enseña las reservas canceladas con su motivo: `Norte lun 10:00-12:00 · sala ocupada`. Sin motivo, o con uno que no está en la lista, `cancelar` no cancela nada y te dice cuáles hay.

Validación: dev-lead — es un comando que usa una persona; lo que responde se ve en la terminal.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo y listar las canceladas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (`booking-cancellation`) · tamaño: ~30 líneas en 2 ficheros
- Mínimo razonable: ninguna — el delta es pequeño y no toca contratos, datos persistentes ni permisos.

1. **Capacidad nueva `booking-cancellation`**: `capabilities/` está vacío; el comportamiento de cancelar no estaba documentado. Declaro también el de la cancelación que ya existe (sin motivo) para que el requisito quede entero.
2. **Cómo se elige el motivo**: opción `--motivo <código>` tras la sala y el día, con tres códigos: `cambio-de-planes`, `sala-ocupada`, `otro`. Es una terminal sin menús, y un código evita comillas.
3. **El motivo es obligatorio**: «se elige un motivo» (roadmap) lo leo como que no se cancela sin él. Cambia el comportamiento actual (`cancelar Norte lun` hoy cancela), lo que obliga a actualizar los tests de `cancelar`.
4. **Textos**: motivo ausente o no válido → `indica un motivo: cambio-de-planes, sala-ocupada u otro` (el mismo texto en los dos casos, y no cancela nada); éxito → `cancelada Norte lun (cambio de planes)`, con el motivo escrito con espacios.
5. **El motivo se valida antes de buscar la reserva**: `cancelar Sur mar` sin motivo responde con el aviso del motivo, no con `sin reserva Sur mar`.
6. **El listado es un comando nuevo `canceladas`** (hoy no hay listado de canceladas). Una línea por reserva cancelada, `<sala> <día> <franja> · <motivo>` en el orden en que se cancelaron; sin ninguna, `sin canceladas`.
7. **`canceladas` solo enseña las canceladas**, no las anuladas (`anular`, 0011).
8. **Dónde viven los datos**: el motivo se guarda en la propia reserva, en memoria, como el resto (sin base de datos, `operations.md`).
9. **Prueba de la fusión** en una copia de `.docs/sdd`: `sdd capability merge` añade los 4 requisitos a `booking-cancellation.md` sin rechazos.
- Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación, con parada tras el commit de la Task 1 — «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» (2026-11-01)
- Lista de motivos — «cambio de planes, sala ocupada, otro»

## Intent

Hoy `cancelar` borra la reserva sin dejar rastro de por qué. Quien gestiona las salas quiere saber por qué se cancela. Éxito: toda cancelación nueva guarda uno de los tres motivos y `canceladas` los enseña. Sería un fracaso que se pudiera cancelar sin motivo o que un motivo inventado se guardara.

## Scope

- Entra: motivo obligatorio en `cancelar`; comando `canceladas`; actualizar los tests de `cancelar` al nuevo comportamiento.
- No entra: motivo en `anular` (lo trata 0011); texto libre del motivo «otro»; persistencia en disco; filtros del listado.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js` (`cancelBooking`), `test/cancel.test.js` (2 tests) | decisión 3; Scope |

- Filas que implementa: 0010 → `roadmap.md` (su fila pasa a ✅ al cerrar) | `capabilities/` está vacío y `PRODUCT.md`/`README.md` no nombran la 0010: comprobado con `grep -rn "0010\|cancelar" PRODUCT.md README.md .docs/sdd`.

## Approach

`cancelBooking` recibe también el motivo, lo valida contra la lista y lo guarda en la reserva. `canceladas` recorre las reservas con estado `cancelled`.

## Dónde se prueba

- cancelar con motivo, sin motivo y con motivo no válido: por `run('cancelar', …)`, como `test/cancel.test.js` actual.
- listado `canceladas`: por `run('canceladas', [])`, en el mismo fichero.

## Términos y ADR

- Términos resueltos: motivo — una de `cambio-de-planes`, `sala-ocupada`, `otro`
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar una reserva con motivo

- GIVEN una reserva activa de Norte el lun
- WHEN `cancelar Norte lun --motivo sala-ocupada`
- THEN responde `cancelada Norte lun (sala ocupada)` y la reserva queda cancelada con ese motivo

#### ADDED — El motivo es obligatorio y de la lista

- GIVEN una reserva activa de Norte el lun
- WHEN `cancelar Norte lun` sin motivo, o `cancelar Norte lun --motivo aburrimiento`
- THEN responde `indica un motivo: cambio-de-planes, sala-ocupada u otro`
- AND la reserva sigue activa
- AND con motivo ausente y sin reserva (`cancelar Sur mar`) responde lo mismo, no `sin reserva Sur mar`

#### ADDED — Cancelar sin reserva

- GIVEN no hay reserva activa de Sur el mar
- WHEN `cancelar Sur mar --motivo otro`
- THEN responde `sin reserva Sur mar`

#### ADDED — Listado de canceladas

- GIVEN Norte lun cancelada con `sala-ocupada` (franja 10:00-12:00)
- WHEN `canceladas`
- THEN responde `Norte lun 10:00-12:00 · sala ocupada`
- AND sin ninguna cancelada responde `sin canceladas`
- AND una reserva anulada no aparece

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-01 | aprobada: «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» |
