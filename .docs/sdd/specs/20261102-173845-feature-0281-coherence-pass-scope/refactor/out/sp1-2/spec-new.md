---
id: 20261102-171337-feature-0012-retire-void
feature: 0012
title: Retirar el comando anular
mode: full
profile: delegate
status: draft
created: 2026-11-02
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Retirar el comando anular

🦆 Hoy `salas anular Norte lun` anula la reserva de Norte del lunes y responde `anulada Norte lun`. Tras este cambio, ese comando ya no existe: se responde como a cualquier comando desconocido (`salas`) y la reserva sigue activa. `cancelar Norte lun` no cambia (`cancelada Norte lun`); solo el requisito que lo describe pasa a llamarse «Cancelar una reserva». Por dentro se borra `voidBooking`, la rama `anular` de `run` y el estado `voided`, y se quitan las menciones de `anular` en la guía, el README y `PRODUCT.md`.

Validación: dev-lead — es un comando que usa una persona; se comprueba a mano que `anular` ya no hace nada y que `cancelar` sigue igual.

## Capacidades

- Modificadas: `bookings` — se retira el requisito «Anular una reserva» y «Cancelar una reserva propia» pasa a «Cancelar una reserva»

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `MODIFIED`/`REMOVED` (retira un requisito y renombra otro) · tamaño: ~25 líneas en 6 ficheros
- Mínimo razonable: ninguna revisión; 1 señal de 8, un requisito retirado y uno renombrado. Sin revisor, el repaso de coherencia lo he hecho yo.

1. **`anular` queda como cualquier comando desconocido**: `salas anular Norte lun` responde `salas` (lo que ya responde un comando que no existe) y no toca la reserva. No añado un mensaje tipo «comando retirado» porque nadie lo pidió.
2. **El renombrado va como `REMOVED` del título viejo + `ADDED` del nuevo**, porque el título es la clave de fusión y `MODIFIED` no puede cambiarla. El contenido del requisito se mantiene tal cual.
3. **«Propia» desaparece del título y `cancelar` no cambia de comportamiento**: el código nunca comprobó de quién era la reserva. Hasta que se haga la 0011, ninguna regla separa «mías» de «de otros».
4. **Propósito de `bookings`**: de «Reservar, cancelar y anular salas desde la línea de comandos» a «Reservar y cancelar salas desde la línea de comandos». Lo edita el cierre, porque la fusión del delta no toca el Propósito.
5. **`PRODUCT.md`**: se borra la línea del término **Anulación**. La de **Cancelación** («la reserva que anula el propio cliente antes de 24 h») no la toco, aunque «propio cliente» ya no cuadra con el renombrado: su «24 h» tampoco está en la capacidad y no es de esta fila.
6. **`docs/guia.md` y `README.md`**: de la guía se borra la línea de `anular`, con su «lo retira la 0012»; el README pasa a «Comando: `cancelar`; guía en [docs/guia.md](docs/guia.md).»
7. **La fila 0011 («Anular reservas de otros») no la toco**: pide que el responsable anule reservas ajenas, y es el comando que esta feature retira. Queda para replantearla con `sdd-roadmap`; esta spec no decide nada sobre ella.
8. **Histórico intacto**: «Cancelar una reserva propia» en `changelog.md:20` y `roadmap.md:34` (v0.3.0) no cambia, es lo que se entregó. El cierre añade en `[Unreleased]` una entrada `Removed`.
- Fusión de prueba del delta en una copia de `.docs/sdd` (`sdd capability merge`): `quitado «Anular una reserva»`, `quitado «Cancelar una reserva propia»`, `añadido «Cancelar una reserva»`; sin rechazos.
- Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- Se retira el comando `anular` — «se retira el comando anular»
- El requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva» — «pasa a llamarse «Cancelar una reserva»»
- Se actualiza la guía `docs/guia.md` — «la guía docs/guia.md se actualiza»

## Intent

Hoy se puede anular una reserva con `anular`, un comando aparte de `cancelar`. Se retira. Éxito: `anular` no hace nada (responde `salas` y la reserva sigue activa), `cancelar` se comporta igual que antes, y ningún documento del proyecto promete ya el comando. Sería un fracaso que el comando dejase de existir pero la guía, el README o la capacidad siguieran anunciándolo.

## Scope

- Entra: quitar `voidBooking`, la rama `anular` de `run` y el estado `voided` de `src/app.js`; el delta de `bookings`; el Propósito de `bookings` (decisión 4, lo edita el cierre); `docs/guia.md`, `README.md` y `PRODUCT.md` (decisión 5); un test.
- No entra: la fila 0011 (decisión 7); la definición de **Cancelación** de `PRODUCT.md`; un mensaje de «comando retirado»; la fila 0010 (motivo al cancelar).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Comando `anular`, `voidBooking`, estado `voided` | `src/app.js:20-25`, `src/app.js:31` | Scope (task 1) |
| Requisito «Anular una reserva» | `capabilities/bookings.md:16-19` | delta, `REMOVED` |
| Requisito «Cancelar una reserva propia» (título) | `capabilities/bookings.md:9` | delta, `REMOVED` + `ADDED` (decisión 2) |
| Propósito «…cancelar y anular salas…» | `capabilities/bookings.md:5` | decisión 4 |
| Línea de `anular` y «lo retira la 0012» | `docs/guia.md:8` | Scope (task 1) |
| «Comandos: `cancelar` y `anular`» | `README.md:5` | Scope (task 1), decisión 6 |
| Término **Anulación** | `PRODUCT.md:10` | Scope, decisión 5 |
| Definición de **Cancelación** («propio cliente») | `PRODUCT.md:9` | No entra, decisión 5 |
| Fila 0011 «Anular reservas de otros» | `roadmap.md:8` | No entra, decisión 7 |
| Fila 0012 | `roadmap.md:9` | la marca el cierre |
| «Cancelar una reserva propia» de v0.3.0 | `roadmap.md:34`, `changelog.md:20` | sin cambio, decisión 8 |

- Filas que implementa: 0012 → `docs/guia.md:8` la nombra («lo retira la 0012») y se borra con su línea; `roadmap.md:9` la marca el cierre. Búsqueda hecha: `grep -rniE "anular|anulad|void|0012|propia"` en el repo sin `.git`; ni `test/` ni `scripts/` nombran el comando.

## Approach

Se borra `voidBooking`, la rama `anular` de `run` y el estado `voided` en `src/app.js`; no queda estado ni dato que migrar (las reservas viven en memoria). Se actualizan guía, README y `PRODUCT.md`. El texto de la capacidad cambia con el delta de abajo.

## Dónde se prueba

- `anular` ya no existe: `run('anular', ['Norte','lun'])` devuelve `salas`; se añade a `test/cancel.test.js`, que ya prueba `run('cancelar', …)` por la misma costura.
- `anular` no toca la reserva: en el mismo test, tras llamarlo, `run('cancelar', ['Norte','lun'])` aún responde `cancelada Norte lun`.
- `cancelar` no cambia: los dos tests ya existentes de `test/cancel.test.js`.
- Guía y README: sin test propio salvo `test/words.test.js` (tope de la guía); se comprueba leyéndolos.

## Términos y ADR

- Términos resueltos: **Anulación** deja de ser término del dominio (decisión 5)
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### REMOVED — Anular una reserva

- motivo: se retira el comando `anular` (feature 0012)

#### REMOVED — Cancelar una reserva propia

- motivo: el requisito pasa a llamarse «Cancelar una reserva»; su contenido no cambia

#### ADDED — Cancelar una reserva

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `cancelar Norte lun`
- THEN la reserva queda cancelada y responde `cancelada Norte lun`
- AND sin reserva ese día responde `sin reserva Norte lun`

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/guia.md` | 42 / 60 | 18 | sin cambio (la edición lo acorta) |

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
