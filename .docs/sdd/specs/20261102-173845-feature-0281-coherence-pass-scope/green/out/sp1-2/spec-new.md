---
id: 20261102-170646-feature-0012-retire-void
feature: 0012
title: Retirar el comando anular
mode: full
status: draft
created: 2026-11-02
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Retirar el comando anular

🦆 Hoy `anular Norte lun` anula la reserva de otra persona y responde `anulada Norte lun`. Tras este cambio ese comando deja de existir: `anular Norte lun` responde `salas`, como cualquier comando desconocido. `cancelar Norte lun` sigue igual (`cancelada Norte lun` o `sin reserva Norte lun`). El requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva», y la guía y el README dejan de nombrar `anular`.

Validación: dev-lead — es un comando que usa una persona: se prueba ejecutándolo.

## Capacidades

- Modificadas: `bookings` — se retira el requisito «Anular una reserva» y «Cancelar una reserva propia» pasa a «Cancelar una reserva»

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED/REMOVED (se quita un requisito y se renombra otro) · tamaño: ~15 líneas en 6 ficheros
- Mínimo razonable: ninguna — deja sin mirar solo el barrido de `anular` fuera de la spec, que ya hizo el repaso de coherencia
```

1. `anular` no tiene mensaje propio de «comando retirado»: cae en la respuesta de cualquier comando desconocido (`salas`) — es lo que hace hoy `run` y no añade comportamiento nuevo.
2. El renombrado es solo del título: los escenarios de `cancelar` no cambian (ni el comportamiento ni sus literales).
3. En la guía solo se quita la línea de `anular`; la de `cancelar` se queda como está («cancela tu reserva»), aunque el requisito ya no diga «propia».
4. Se quita del `PRODUCT.md` el término **Anulación**; **Cancelación** no se toca.
5. El README pasa a «Comandos: `cancelar`; guía en docs/guia.md».
6. Se borra `voidBooking` y el estado `voided`: no hay datos persistentes (las reservas viven en memoria), así que no hay migración.
7. **Conflicto con la fila 0011** («Anular reservas de otros», solo el responsable): su enunciado presupone un `anular` que esta feature retira. No toco la fila (es planificación, de `sdd-roadmap`); te lo señalo para que decidas qué pasa con la 0011.
8. El historial (`changelog.md`, «Releases cerradas» del roadmap) mantiene «Cancelar una reserva propia»: es lo que se entregó en v0.3.0.
- Fusión de prueba (copia en carpeta temporal): `bookings.md: quitado «Cancelar una reserva propia» · añadido «Cancelar una reserva» · quitado «Anular una reserva»`; el Propósito no lo toca la fusión y lo ajusta el cierre.
- Política de modelos: sin revisores de spec · revisión final: Spec opus+high, Código sonnet+high · sin otros despachos en paralelo.

### Decisiones tomadas con el dev-lead

- Se retira el comando `anular` — «se retira el comando anular»
- El requisito pasa a llamarse «Cancelar una reserva» — «el requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva»»
- Se actualiza `docs/guia.md` — «la guía docs/guia.md se actualiza»
- Perfil `delegate` — «Perfil delegate»

## Intent

Hoy el comando `anular` existe en el código, la guía, el README y la capacidad `bookings`. El roadmap decidió retirarlo (fila 0012). Éxito: `anular` no aparece como comando en ningún sitio, `cancelar` se comporta igual y el gate sigue verde.

## Scope

- Entra: quitar `voidBooking` y la rama `anular` de `src/app.js`; un test que fije que `anular` ya no existe; actualizar `docs/guia.md`, `README.md` y `PRODUCT.md`; el delta de `bookings` (retirar «Anular una reserva», renombrar «Cancelar una reserva propia», ajustar el propósito).
- No entra: la fila 0011 y cualquier otro cambio en `cancelar`; quién puede cancelar; el historial (`changelog.md`, «Releases cerradas»).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Comando `anular` y `voidBooking` / estado `voided` | `src/app.js:23-28`, `src/app.js:35` | Scope (código) |
| Requisito «Anular una reserva» | `.docs/sdd/capabilities/bookings.md:17` | delta, `REMOVED` |
| Requisito «Cancelar una reserva propia» | `.docs/sdd/capabilities/bookings.md:9` | delta, `REMOVED` + `ADDED` «Cancelar una reserva» (decisión del dev-lead) |
| Propósito «Reservar, cancelar y anular salas…» | `.docs/sdd/capabilities/bookings.md:5` | Scope: lo ajusta el cierre a «Reservar y cancelar salas desde la línea de comandos» |
| Línea de `anular` | `docs/guia.md:8` | Scope (guía); el tope de 60 palabras de `test/` se cumple al acortar |
| «`cancelar` y `anular`» | `README.md:5` | Scope, decisión 5 |
| Término **Anulación** | `PRODUCT.md:10` | Scope, decisión 4 |
| «Cancelar una reserva propia» | `.docs/sdd/changelog.md:20`, roadmap «Releases cerradas» | se queda: historial, decisión 8 |
| «Anular reservas de otros» (usa `anular`) | `.docs/sdd/roadmap.md`, fila 0011 | decisión 7: lo decide el dev-lead |

- Filas que implementa: 0012 → la nombran `docs/guia.md:8` («lo retira la 0012», que desaparece con la línea) y `roadmap.md`, fila 0012 (la cierra el archivo) | comprobado con `grep -rn 0012` fuera de `specs/`

## Approach

Se borra la función y la rama del comando; `run` ya devuelve `salas` para lo desconocido. Se escribe antes el test que falla hoy (`anular` ≠ `salas`). La guía y los demás documentos se editan como dice la tabla.

## Dónde se prueba

- `anular` ya no existe: `run('anular', ['Norte','lun'])` → `salas`, en `test/`, como los tests de `cancelar` actuales.
- `cancelar` no cambia: los tests de `test/cancel.test.js` actuales.
- La guía no nombra `anular` y cabe en su tope: el test de palabras de `test/` existente.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/guia.md` | 42 / 60 | 18 | sin cambio (la edición lo acorta) |

## Delta de comportamiento

### Capacidad: `bookings`

#### REMOVED — Cancelar una reserva propia

- motivo: pasa a llamarse «Cancelar una reserva»

#### ADDED — Cancelar una reserva

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `cancelar Norte lun`
- THEN la reserva queda cancelada y responde `cancelada Norte lun`
- AND sin reserva ese día responde `sin reserva Norte lun`

#### REMOVED — Anular una reserva

- motivo: se retira el comando `anular` (fila 0012)

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
