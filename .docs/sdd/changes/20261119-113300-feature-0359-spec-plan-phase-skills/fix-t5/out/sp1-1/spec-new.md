---
id: 20261119-170246-feature-0012-retire-void
feature: 0012
title: Retirar el comando anular
mode: lite
profile: delegate
status: draft
created: 2026-11-19
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Retirar el comando anular

🦆 El comando `anular` desaparece: quien escriba `anular Norte lun` ya no anula nada y recibe la respuesta de cualquier comando desconocido (`salas`), y la reserva de Norte el lunes sigue activa. `cancelar Norte lun` sigue igual; solo cambia que el requisito se llama «Cancelar una reserva» (ya no «propia»). La guía deja de mencionar `anular`. Por dentro se borra `voidBooking`, su línea de despacho y el estado `voided`.

Validación: dev-lead — lo que usa una persona son los comandos de la terminal; conviene que el dev-lead confirme que `anular` ya no responde.

## Capacidades

- Modificadas: `bookings` — se retira el requisito «Anular una reserva» y «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva».

## ✋ Decisiones que he tomado yo — valida estas

1. Modo `lite`: son ~3 tareas (código y test, documentos, spec de capacidad) y no hay nada que planificar aparte — sin `plan.md`.
2. Respuesta tras retirar: `anular Norte lun` responde `salas`, el texto de cualquier comando desconocido (`src/app.js`, rama final de `run`); no se añade un mensaje del tipo «anular ya no existe» — nadie lo pidió y habría que mantener un texto nuevo. Si lo quieres, es un cambio de un THEN.
3. El renombrado va como `REMOVED` del título viejo + `ADDED` del nuevo (la clave de fusión es el título), con los mismos GIVEN/WHEN/THEN: el comportamiento de `cancelar` no cambia. Quitar «propia» no cambia quién puede cancelar: el código no comprueba quién ejecuta `cancelar` (`src/app.js`, `cancelBooking`) y el dev-lead pidió el renombrado.
4. La línea de propósito de `bookings.md` («Reservar, cancelar y anular salas…») pasa a «Reservar y cancelar salas desde la línea de comandos»: no es un requisito, la edita la implementación, no el delta; la fusión de prueba (11) conserva el propósito tal cual.
5. `PRODUCT.md:13-14` (términos **Cancelación** y **Anulación**): no los toco en esta feature — **pendiente**, decisión del dev-lead. Motivo: la fila 0011 («Anular reservas de otros») sigue en el roadmap y puede reintroducir «anulación»; «Cancelación» además dice «el propio cliente», que choca con el nuevo título sin «propia».
6. Fila 0011 del roadmap: no la toco. Retirar `anular` (0012) y «solo el responsable anula reservas de otros» (0011) se contradicen si se ejecutan en este orden — **pendiente**, decisión del dev-lead (reordenar, reformular o descartar la 0011).
7. `CHANGELOG.md` no se edita a mano: la entrada «Removed: comando `anular`» la escribe el corte de `sdd-end-release`. `README.md:5` sí se actualiza (ver «Lo que se retira o cambia de forma»), con la misma frase sin `anular`.
8. Se borra también el estado `voided` (solo lo escribía `voidBooking`); las reservas ya anuladas no existen: los datos viven en memoria (regla «Dónde viven los datos» de `bookings`) y no se persisten.
9. Test nuevo en `test/cancel.test.js`: `run('anular', ['Norte','lun'])` responde `salas` y `libres 10:00-12:00` sigue devolviendo `Sur` (la reserva sigue activa). Nivel unitario: es el que ve la respuesta.
10. Enfoque: borrar `anular` frente a dejarlo como alias deprecado de `cancelar` o con un aviso de retirada (ver Approach).
11. Delta probado con `sdd capability merge` sobre una copia de `.docs/sdd`: «quitado Anular una reserva · quitado Cancelar una reserva propia · añadido Cancelar una reserva · añadido El comando anular ya no existe». Un requisito nuevo en vez de solo borrar «Anular»: es la única forma de que el retiro quede como comportamiento comprobable en la capacidad.
- Dónde viven los datos, idioma, límites, avisos y regla ante conflicto: la spec no introduce datos, textos nuevos ni topes (`salas` es el texto vigente), así que no hay «Reglas de la capacidad» en el delta.
- Política de modelos (solo en `delegate`): sin revisores de la spec salvo lo que fije `sdd-spec-review` · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan (no hay plan) · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

Review de spec (lite): un revisor, sonnet, siete puntos — señales: `REMOVED` (dos requisitos de `bookings`) · tamaño: ~40 líneas en 6 ficheros. Mínimo razonable: ninguno por debajo de un revisor.

- **Rechazado** — el requisito «El comando anular ya no existe» describe un comando desconocido genérico y fija `salas` → es el único modo de dejar el retiro como comportamiento comprobable en la capacidad; el literal ya está declarado en la decisión 2.
- **Aceptado** — «quitar *propia*» parece un cambio de alcance encubierto → decisión 3 aclara que no cambia quién puede cancelar (el código no lo comprueba).
- **Aceptado** — el escenario de `anular` pasa aunque no haga nada → se añade un THEN con `libres 10:00-12:00` → `Sur` en el delta; el estado `voided` se comprueba al borrarse `voidBooking` (decisión 8).
- **Rechazado** — decisiones 5 y 6 abiertas antes de aprobar → son del dev-lead y están marcadas «pendiente»; el Intent se corrige para no prometer más (ver abajo).
- **Aceptado** — propósito de `bookings.md` editado fuera del delta → decisión 4: la fusión de prueba lo conserva.
- **Aceptado** — `README.md` no figura en el Intent → añadido.
- **Rechazado** — decisiones 9 y 11 son detalle de implementación → ✋ debe ser exhaustiva; los valores van aquí aunque también estén en «Dónde se prueba».
- **Aceptado** — «en memoria» sin fuente → decisión 8 cita la regla de `bookings`.
- **Rechazado** — faltan las cinco reglas por nombre → el delta no introduce datos ni textos nuevos; línea añadida en ✋ que lo dice.
- **Aceptado** — el gate no está en la constitución → el gate `node --test && node scripts/lint.mjs` sale de `operations.md`; Intent corregido.

### Decisiones tomadas con el dev-lead

- Se retira el comando `anular` — «se retira el comando anular»
- El requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva» — «el requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva»»
- Se actualiza la guía `docs/guia.md` — «la guía docs/guia.md se actualiza»

## Intent

Hoy `anular <sala> <día>` anula la reserva de otra persona, pero el código no comprueba quién la ejecuta y hace lo mismo que `cancelar` salvo el estado final (`voided` frente a `cancelled`). La fila 0012 del roadmap pide que el comando desaparezca; la decisión es del dev-lead. Éxito: `anular` no existe en el código, la guía, el README ni la spec de la capacidad, `cancelar` se comporta igual que antes y el gate de cierre de `operations.md` (`node --test && node scripts/lint.mjs`) pasa. Los términos de `PRODUCT.md` y la fila 0011 quedan fuera (decisiones 5 y 6). Anti-meta: que `anular` siga haciendo algo (o dejando reservas en estado `voided`) aunque ya no esté documentado.

## Scope

- Entra: borrar `voidBooking` y la rama `anular` de `run` en `src/app.js`; test de que `anular` ya no actúa; delta de `bookings` (retirar «Anular una reserva», renombrar el requisito de cancelar); actualizar `docs/guia.md` y `README.md:5`; ajustar el propósito de `bookings.md`.
- No entra: el motivo al cancelar (0010); anular reservas de otros por el responsable (0011); términos de `PRODUCT.md`; la fila 0011; `CHANGELOG.md` (lo escribe el corte de release).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Comando `anular` y `voidBooking` | `src/app.js:23-28`, `src/app.js:31` | Scope (código) |
| Requisito «Anular una reserva» | `.docs/sdd/capabilities/bookings.md:16-19` | delta, `REMOVED` |
| Título «Cancelar una reserva propia» | `.docs/sdd/capabilities/bookings.md:9` | delta, `REMOVED` + `ADDED` «Cancelar una reserva» (decisión 3) |
| Propósito «…cancelar y anular salas…» | `.docs/sdd/capabilities/bookings.md:5` | decisión 4 |
| Línea `anular` de la guía | `docs/guia.md:8` | Scope |
| «Comandos: `cancelar` y `anular`» | `README.md:5` | Scope, decisión 7 |
| Términos «Cancelación» y «Anulación» | `PRODUCT.md:13-14` | decisión 5, pendiente |
| «Cancelar una reserva propia» (0.3.0) | `CHANGELOG.md:20` | historia: no se reescribe |
| «Anular reservas de otros» | `ROADMAP.md:8` | decisión 6, pendiente |

- Filas que implementa: 0012 → `docs/guia.md:8` («lo retira la 0012») se borra con la línea; ningún otro fichero nombra la 0012.

## Approach

- Borrar `anular` — quita `voidBooking`, la rama de `run` y el estado `voided`; una función menos, comportamiento más simple. Un comando que alguien teclee responde `salas`.
- Alias deprecado — `anular` ejecuta `cancelar` unos días: contradice «el comando desaparece» de la fila 0012 y mantiene la ambigüedad que se quiere cerrar.
- Mensaje de retirada — `anular` responde un texto fijo nuevo: texto y test que mantener para un comando que nadie ha pedido conservar.
- Elegido: borrar `anular` — es lo que dice la fila 0012 («el comando anular desaparece») y lo decidido con el dev-lead; los otros añaden código para un comando retirado.

## Dónde se prueba

- `anular` ya no actúa: unitario en `test/cancel.test.js`, como los tests de `cancelar` actuales (`run('anular', …)` → `salas`).
- `cancelar` sin cambios: los dos tests existentes de `test/cancel.test.js`.
- Guía y README: lectura; el gate `node --test && node scripts/lint.mjs`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### REMOVED — Anular una reserva

- motivo: se retira el comando `anular` (fila 0012).

#### REMOVED — Cancelar una reserva propia

- motivo: renombrado a «Cancelar una reserva» (el título es la clave de fusión).

#### ADDED — Cancelar una reserva

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `cancelar Norte lun`
- THEN la reserva queda cancelada y responde `cancelada Norte lun`
- AND sin reserva ese día responde `sin reserva Norte lun`

#### ADDED — El comando anular ya no existe

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `anular Norte lun`
- THEN responde `salas`, como cualquier comando desconocido
- AND la reserva de Norte el lunes sigue activa: `libres 10:00-12:00` responde `Sur`

### Estimación y esfuerzo

- Tipo: chore
- Esfuerzo spec: 0,5h
- Estimación de implementación: 0,75h
- Base de la estimación: borrar una función y una rama, un test, cuatro líneas de documentos; sin incertidumbre
- Confianza: alta

## Enmiendas

- ninguna

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
