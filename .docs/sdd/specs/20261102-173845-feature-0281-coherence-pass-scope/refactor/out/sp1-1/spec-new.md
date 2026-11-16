---
id: 20261102-171033-feature-0012-retire-void
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

🦆 Hoy `anular Norte lun` anula la reserva de Norte del lunes; tras este cambio ese comando ya no existe y `anular Norte lun` responde `salas`, como cualquier orden que la herramienta no conoce. `cancelar Norte lun` sigue igual: cancela y responde `cancelada Norte lun`. La guía, el README y el glosario dejan de hablar de «anular» y de «anulación». Por dentro se borra la función que anulaba y su rama en el despachador de comandos.

Validación: dev-lead — es un comando que usa una persona: debe ver que `cancelar` sigue igual y que `anular` ya no hace nada.

## Capacidades

- Nuevas: ninguna
- Modificadas: `bookings` — se retira «Anular una reserva» y «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva»; el propósito deja de nombrar «anular»
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `MODIFIED`/`REMOVED` (1 de 8) · tamaño: ~25 líneas en 6 ficheros. Con 0–3 señales la rúbrica no propone review; yo he hecho el repaso de coherencia.

1. Tras retirarlo, `anular Norte lun` responde `salas`, igual que cualquier comando desconocido (hoy el despachador devuelve `salas` por defecto); no invento un mensaje de «comando retirado», porque nadie pidió texto nuevo y el comportamiento sale de quitar la rama. Si prefieres un mensaje propio, es otra decisión.
2. El renombrado del requisito se expresa como `REMOVED` del título viejo + `ADDED` del nuevo, con los mismos GIVEN/WHEN/THEN, porque el título es la clave de fusión y un cambio de nombre no cambia el comportamiento.
3. El propósito de `capabilities/bookings.md` pasa de «Reservar, cancelar y anular salas desde la línea de comandos.» a «Reservar y cancelar salas desde la línea de comandos.»: consecuencia directa de retirar el comando. La fusión del delta no toca el propósito (comprobado con `sdd capability merge` en una copia: quita y añade los requisitos y deja el propósito como estaba), así que es una edición a mano dentro de la task.
4. `PRODUCT.md`: se borra la entrada «Anulación» del glosario (el término deja de existir). **No toco «Cancelación»** («la reserva que anula el propio cliente antes de 24 h»): dice «propio cliente», que ya no casa con el nuevo nombre «Cancelar una reserva». La dejo fuera de alcance porque su redacción incluye la regla de 24 h, que no está en ninguna capacidad; si quieres que la reescriba, dime el texto.
5. `README.md`: «Comandos: `cancelar` y `anular`;» pasa a «Comando: `cancelar`;». Sigue sin listar el resto de comandos, como hoy.
6. `docs/guia.md`: se borra la línea de `anular`, con su coletilla «lo retira la 0012». Baja de 42 a ~28 palabras, bajo el tope de 60 de `test/words.test.js`; el tope no cambia.
7. El historial no se reescribe: «Cancelar una reserva propia» sigue en el roadmap (v0.3.0) y en `changelog.md` porque describe lo que se entregó entonces. La entrada del changelog de esta feature la escribe el cierre.
8. Prueba nueva: un test de que `run('anular', ['Norte', 'lun'])` responde `salas`, junto a los tests de cancelar (`test/cancel.test.js`), por el mismo `run` que ellos. Es el único RED posible; el resto es borrar.
9. Solape con la fila 0011 («Anular reservas de otros: solo el responsable de cada sala anula…»): esa fila presupone que `anular` existe y esta lo retira. No la toco, porque es planificación y es tuya, pero conviene decidir si la 0011 se descarta o se reformula antes de empezarla.
10. Plan de una sola task (borrar código y documentos + 1 test); no propongo partir. Ejecución Native, de `sdd-kit.json`.

- Política de modelos: ningún revisor de spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- Se retira el comando `anular` — «se retira el comando anular»
- El requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva» — «el requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva»»
- Se actualiza `docs/guia.md` — «la guía docs/guia.md se actualiza»
- Perfil `delegate` — «Perfil delegate»

## Intent

Hoy la herramienta ofrece `cancelar` y `anular`, dos formas casi iguales de dejar sin efecto una reserva. El dev-lead decide que solo quede `cancelar`. Éxito: `anular` desaparece del código, de la capacidad y de los documentos del usuario, `cancelar` no cambia y toda la suite más el lint siguen en verde. Fracaso aunque «funcione»: quitar el comando y dejar la guía, el README o el glosario diciendo que existe.

## Scope

- Entra: borrar `voidBooking` y la rama `anular` de `src/app.js`; el test de `anular` desconocido; el delta de `bookings` más la edición a mano de su propósito; las ediciones de `docs/guia.md`, `README.md` y `PRODUCT.md` de la tabla de abajo.
- No entra: tocar `cancelar`; el historial (roadmap v0.3.0, changelog); la entrada «Cancelación» de `PRODUCT.md`; la fila 0011 del roadmap; un mensaje propio para el comando retirado.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Comando `anular` y `voidBooking` (estado `voided`) | `src/app.js:20-26` y `:31` | Scope (se borra) |
| Requisito «Anular una reserva» | `.docs/sdd/capabilities/bookings.md:16-20` | delta, `REMOVED` |
| Título «Cancelar una reserva propia» | `.docs/sdd/capabilities/bookings.md:9` | delta, `REMOVED` + `ADDED` (decisión 2) |
| Propósito «…cancelar y anular salas…» | `.docs/sdd/capabilities/bookings.md:5` | decisión 3 |
| Línea de `anular` y «lo retira la 0012» | `docs/guia.md:8` | Scope; decisión 6 |
| «Comandos: `cancelar` y `anular`» | `README.md:5` | Scope; decisión 5 |
| Término «Anulación» | `PRODUCT.md:10` | Scope; decisión 4 |
| Término «Cancelación» («propio cliente») | `PRODUCT.md:9` | se queda, decisión 4 |
| «Cancelar una reserva propia» (entrega v0.3.0) | `.docs/sdd/roadmap.md:34`, `.docs/sdd/changelog.md:20` | se queda, decisión 7 |
| Fila 0011 «Anular reservas de otros» | `.docs/sdd/roadmap.md:8` | se queda, decisión 9 |

- Filas que implementa: 0012 → la nombran `docs/guia.md:8` (se borra con la línea) y `.docs/sdd/roadmap.md:9` (su propia fila, que cierra el archivo); en `test/`, `scripts/` y `package.json` no aparece, comprobado con `grep -rn -i "anul\|void\|0012"`.

## Approach

Borrar la función y la rama del despachador; no queda estado `voided`, y como las reservas viven en memoria no hay datos que migrar. El resto son ediciones de texto. El comportamiento de un comando desconocido ya existe y no se toca.

## Dónde se prueba

- `anular` ya no existe: por `run`, como los tests de `cancelar` actuales, en `test/cancel.test.js`.
- `cancelar` sigue igual: con los dos tests existentes, sin cambios.
- Guía y README: el tope de palabras de `test/words.test.js` y una lectura del dev-lead en la validación.

## Términos y ADR

- Términos resueltos: «Anulación» deja de ser término del producto.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### REMOVED — Anular una reserva

- motivo: el dev-lead retira el comando `anular` (feature 0012).

#### REMOVED — Cancelar una reserva propia

- motivo: renombrado a «Cancelar una reserva»; mismo comportamiento.

#### ADDED — Cancelar una reserva

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `cancelar Norte lun`
- THEN la reserva queda cancelada y responde `cancelada Norte lun`
- AND sin reserva ese día responde `sin reserva Norte lun`

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/guia.md` | 42 / 60 | 18 | sin cambio (la edición lo acorta) |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
