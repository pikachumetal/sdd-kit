---
id: 20261112-162748-feature-0012-retire-void
feature: 0012
title: Retirar el comando anular
mode: full
profile: delegate
status: draft
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Retirar el comando anular

🦆 Hoy `salas anular Norte lun` anula la reserva de Norte del lunes y responde `anulada Norte lun`. Tras este cambio el comando `anular` no existe: se comporta como cualquier comando desconocido y la reserva sigue activa (después, `cancelar Norte lun` responde `cancelada Norte lun`). El requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva», sin cambiar su comportamiento. Se quita la función `voidBooking` y su rama en `run`, y se actualizan la guía, el README y la capacidad `bookings`.

Validación: dev-lead — es un comando de terminal que usa una persona (el autor, que es el dev-lead): debe comprobar que `anular` ya no hace nada y que `cancelar` sigue igual.

## Capacidades

- Modificadas: `bookings` — se retira «Anular una reserva», «Cancelar una reserva propia» pasa a «Cancelar una reserva» y se añade «El comando anular no está disponible»; su propósito se edita a mano en el cierre (decisión 4).

## ✋ Decisiones que he tomado yo — valida estas

1. Enfoque: borrado directo de `voidBooking` y de la rama `anular` de `run`, frente a dejar el comando como alias de `cancelar` o con un aviso «retirado» (ver Approach).
2. `anular` pasa a responder lo mismo que cualquier comando desconocido, sin mensaje de «comando retirado»: medido hoy, `run('zzz', [])` → `salas`. `sin medir` con `anular Norte lun` y argumentos: se mide en la Task del RED, tras quitar la rama (con argumentos un manejador de desconocidos podría responder otra cosa). Lo fija el requisito nuevo «El comando anular no está disponible» y su test.
3. El renombrado del requisito va como `REMOVED` del título viejo + `ADDED` del nuevo (regla de la plantilla): el escenario es idéntico, solo cambia el título; con ello la capacidad deja de decir «propia» (el código nunca comprobó la propiedad; `PRODUCT.md` define «Cancelación» y no se toca).
4. El propósito de `bookings` pasa de «Reservar, cancelar y anular salas…» a «Reservar y cancelar salas desde la línea de comandos.»: el delta solo fusiona escenarios, así que se edita a mano en el cierre, con comprobación: el mismo `git grep` de «Dónde se prueba» (capabilities incluida; `PRODUCT.md` y `ROADMAP.md` quedan fuera a propósito).
5. En `PRODUCT.md` se mantiene el término «Anulación» sin tocarlo: está reservado para la 0011 (anular reservas de otros, fila ya en `ROADMAP.md`) y no es funcionalidad vigente.
6. `docs/guia.md`: se borra la línea de `anular` entera, incluido «lo retira la 0012»; el README pasa a «Comandos: `cancelar`…» sin `anular`.
7. Sin versión ni tag por este cambio: el tag `vX.Y.Z` lo pone el cierre de la release; la retirada de `anular` entra en el CHANGELOG cuando `sdd-end-release` lo corte. Los tests se ubican en `test/retired.test.js` (nuevo), para no mezclar un comando retirado con `cancelar`.
8. El estado `voided` desaparece del código con `voidBooking`; no hay datos persistentes (las reservas viven en memoria), no hace falta migración.
9. Delta probado en una copia de `.docs/sdd`: `sdd capability merge` → «quitado «Anular una reserva» · quitado «Cancelar una reserva propia» · añadido «Cancelar una reserva»», sin rechazos (el propósito no lo toca, decisión 4; el escenario nuevo se añadió después y se vuelve a probar abajo). Medida: `node --test` hoy 5/5 en verde; no existe ningún test de `anular` ni de `voidBooking`, y `voided`/`voidBooking` solo aparecen en `src/app.js`; tras el cambio serán 6 tests.
10. Política de modelos: dos revisores de la spec (dominio: sonnet; técnica: sonnet) · ejes de la revisión final según el plan · los dos revisores de la spec en paralelo, hasta `control.maxParallelAgents`; sin otros despachos.

Review de spec propuesta: dos revisores — señales: `MODIFIED`/`REMOVED` (se retira un requisito y se renombra otro), contrato público (el comando `anular` de la terminal) · tamaño: ~25 líneas en 6 ficheros
- Dominio (sonnet): que retirar «Anular una reserva» no deje huérfana la regla de PRODUCT.md ni choque con la 0011 (señal: REMOVED)
- Técnica (sonnet): que el borrado de `voidBooking` no deje referencias y que el renombrado fusione sin perder el escenario (señal: MODIFIED)
- Mínimo razonable: solo técnica — deja sin mirar la interacción con la 0011 y el glosario

### Hallazgos de la review

- **Aceptado** — (técnica, Crítico) el comportamiento nuevo no tiene escenario → requisito `ADDED` «El comando anular no está disponible» con datos, y decisión 2 reescrita.
- **Aceptado** — (dominio, Crítico) el Intent decía «cualquiera puede anular» pero el requisito vigente dice «el responsable» → Intent y motivo del `REMOVED` corregidos: el código nunca comprobó el rol.
- **Aceptado** — (técnica) medir `salas`, setup del test, `-i` en el grep, tests existentes, versión/tag, fichero del test, ROADMAP en Scope, propósito comprobado → decisiones 2, 4, 7, 8, Scope y «Dónde se prueba».
- **Aceptado** — (dominio) glosa de «Anulación» como reservada; criterio del Intent acotado; relato «solo el autor» unificado.
- **Rechazado** — (dominio) quitar «propia» cambia el alcance → lo decidió el dev-lead («pasa a llamarse «Cancelar una reserva»»); el código nunca comprobó la propiedad y `PRODUCT.md` («Cancelación») no se toca.
- **Rechazado** — (dominio) escenario de cancelar la reserva de otra persona → sería comportamiento nuevo, fuera de alcance (va, si acaso, con la 0011).
- **Aceptado** — (2.ª ronda, sin Críticos) título del requisito acotado a `anular`, test con orden y estado limpio, medida con argumentos a la Task del RED, redacción única de la fila 0012, política de modelos sin contradicción, 0011 citada como «prevista».
- **Rechazado** — (2.ª ronda) ownership de «propia» como MODIFIED encubierto → decidido por el dev-lead; queda dicho en la decisión 3 que la capacidad deja de decir «propia» (el código nunca lo comprobó). Dividir la decisión 9 y nombrar aprobador: se aprueba en el gate de `delegate`, sin cambio.
- **Rechazado** — (técnica) `PRODUCT.md` no existe en `steering/` → vive en la raíz, como dice la plantilla; no hay error.

### Decisiones tomadas con el dev-lead

- Se retira el comando `anular` — «se retira el comando anular»
- El requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva» — «pasa a llamarse «Cancelar una reserva»»
- La guía `docs/guia.md` se actualiza — «la guía docs/guia.md se actualiza»
- Perfil delegate — «Perfil delegate»

## Intent

Hoy `salas` ofrece `anular`: la capacidad dice que lo ejecuta «el responsable», pero el código no comprueba ningún rol y cualquiera puede anular. El roadmap prevé (fila 0011) reintroducir la anulación solo para el responsable de cada sala; hasta entonces el comando no debe existir. Éxito: `anular` no hace nada, `cancelar` se comporta igual, y ningún documento vivo presenta `anular` como comando vigente (solo quedan el glosario reservado a la 0011, el requisito «El comando anular no está disponible», su test y el roadmap). Fracaso aunque funcione: borrar `anular` y romper `cancelar`, o dejar la guía diciendo que existe.

## Scope

- Entra: quitar `voidBooking` y la rama `anular` de `src/app.js`; delta en `bookings`; `docs/guia.md`; `README.md`; propósito de `bookings`; `test/retired.test.js` (nuevo); marcar la fila 0012 en `ROADMAP.md` al cierre.
- No entra: el término «Anulación» de `PRODUCT.md` (decisión 5); la función de responsable de la 0011; mensajes de «comando retirado».

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| comando `anular` y `voidBooking` / estado `voided` | `src/app.js:20-24`, `src/app.js:31` | Scope: se borran |
| requisito «Anular una reserva» | `.docs/sdd/capabilities/bookings.md:16` | delta, `REMOVED` |
| requisito «Cancelar una reserva propia» | `.docs/sdd/capabilities/bookings.md:8` | delta, `REMOVED` + `ADDED` «Cancelar una reserva» |
| propósito «…cancelar y anular salas…» | `.docs/sdd/capabilities/bookings.md:5` | decisión 4: edición manual en el cierre |
| línea `anular` de la guía | `docs/guia.md:8` | Scope: se borra (decisión 6) |
| «`cancelar` y `anular`» | `README.md:5` | Scope: pasa a solo `cancelar` |
| término «Anulación» | `PRODUCT.md:14` | decisión 5: se mantiene, lo usa la 0011 |
| filas 0011 y 0012 | `ROADMAP.md:8-9` | Scope: la fila 0011 no cambia; la 0012 pasa a ✅ al cierre |

- Filas que implementa: 0012 → `docs/guia.md:8` («lo retira la 0012») se borra con la línea; el roadmap marca la fila al cierre. Comprobado con `git grep -n "0012"` y `git grep -niE "anular|void"` fuera de `.docs/sdd/specs/`.

## Approach

- Borrado directo — se quitan función y rama: el menor código, el comando pasa a ser desconocido; no hay otros usuarios que migrar (`PRODUCT.md`: lo usa solo su autor).
- Alias de `anular` a `cancelar` — mantiene compatibilidad pero cambia el significado del comando y contradice «el comando desaparece».
- Aviso «comando retirado» — más amable, pero es comportamiento nuevo que nadie pidió.
- Elegido: borrado directo — es lo que dice la fila 0012 («el comando anular desaparece») y lo decidido con el dev-lead.

## Dónde se prueba

- `anular` ya no hace nada: en `test/retired.test.js`, con setup explícito (la reserva activa de Norte el lunes de los datos de ejemplo), `run('anular', ['Norte','lun'])` responde `salas`, no `anulada Norte lun`, y después `run('cancelar', ['Norte','lun'])` → `cancelada Norte lun`; un único test, con estado limpio (la reserva se crea o se restablece al empezar el test) y en este orden: `anular`, luego `cancelar`; mismo patrón de `run(...)` que `test/cancel.test.js`.
- `cancelar` sin cambios: los tests actuales de `test/cancel.test.js` siguen en verde.
- Documentos: en el cierre, `git grep -niE "anular|anulad|void" -- docs README.md src .docs/sdd/capabilities` sin resultados fuera del escenario nuevo.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### REMOVED — Anular una reserva

- motivo: el comando `anular` se retira (en el código nunca comprobó el rol); el roadmap (fila 0011) prevé reintroducirla solo para el responsable de sala; cuando la 0011 reintroduzca `anular`, retirará el requisito «El comando anular no está disponible».

#### REMOVED — Cancelar una reserva propia

- motivo: renombrado a «Cancelar una reserva»; el comportamiento no cambia.

#### ADDED — Cancelar una reserva

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `cancelar Norte lun`
- THEN la reserva queda cancelada y responde `cancelada Norte lun`
- AND sin reserva ese día responde `sin reserva Norte lun`

#### ADDED — El comando anular no está disponible

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `anular Norte lun`
- THEN responde `salas`, como cualquier comando desconocido
- AND la reserva sigue activa: `cancelar Norte lun` responde `cancelada Norte lun`

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
