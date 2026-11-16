---
id: 20261116-112547-feature-0012-retire-void
feature: 0012
title: Retirar el comando anular
mode: full
status: draft
created: 2026-11-16
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Retirar el comando anular

🦆 Hoy `anular Norte lun` anula la reserva de otra persona y responde `anulada Norte lun`. Tras el cambio, `anular` deja de existir: se comporta como cualquier palabra que el programa no conoce y responde `salas`, y la reserva de Norte el lunes sigue activa. `cancelar Norte lun` no cambia (`cancelada Norte lun`). La guía deja de nombrar `anular`, el requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva» y se borra la función que anulaba.

Validación: dev-lead — es un comando que una persona usa en la terminal y quita una respuesta visible.

## Capacidades

- Modificadas: `bookings` — el requisito «Cancelar una reserva propia» pasa a «Cancelar una reserva» (mismo escenario) y el requisito «Anular una reserva» se retira y se añade «Un comando desconocido no cambia ninguna reserva».

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: contrato público (el comando `anular` lo usa quien teclea), MODIFIED/REMOVED (dos requisitos de `bookings`), regla de rol (el responsable pierde su comando) · tamaño: ~25 líneas en 5 ficheros
- Dominio (opus): si quitar `anular` deja huecos con la fila 0011 «Anular reservas de otros» y con la definición de «Anulación» de `PRODUCT.md` (señal: rol)
- Técnica (sonnet): si el THEN de `anular` → `salas` y la reserva activa lo ejercita el test, y si el tope de `docs/guia.md` sigue cumpliéndose (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar el choque con la fila 0011, que decide si el rol del responsable queda sin comando

1. Enfoque: borrar el comando y su función, frente a dejar `anular` como alias de `cancelar` o a responder un aviso «comando retirado» (ver Approach).
2. Tras el cambio `anular Norte lun` responde `salas`, la respuesta de cualquier comando desconocido: nadie dijo qué debía contestar; no invento un texto nuevo.
3. La guía deja la línea de `anular` entera (incluido «lo retira la 0012»), sin sustituirla por una nota de retirada: la guía lista lo que existe.
4. `README.md` también nombra `anular` («Comandos: `cancelar` y `anular`»): pasa a «Comandos: `cancelar`»; no lo dijo nadie y es un sitio que el comando retirado dejaría mentiroso.
5. El purpose de `capabilities/bookings.md` («Reservar, cancelar y anular salas…») pasa a «Reservar y cancelar salas…»: la fusión de deltas no toca el purpose, se edita a mano en el cierre.
6. `PRODUCT.md` (término «Anulación») no se toca: la fila 0011 puede volver a necesitar el término, y decidirlo es de esa fila. Queda dicho aquí para que no sorprenda.
7. `CHANGELOG.md` no se toca en esta feature: su entrada «Removed» la escribe el corte de la release.
8. Con el comando se borra el estado interno `voided`: las reservas viven en memoria, no hay datos que migrar.
9. Tope de `docs/guia.md`: sin cambio (60). Medido 42 palabras hoy, previsto 28.
10. Política de modelos (delegate): revisores de la spec: dominio opus, técnica sonnet · ejes de la revisión final: los que ponga el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`.
11. Choque a vigilar, sin resolver: la fila 0011 «Anular reservas de otros» pide justo anular reservas ajenas, y esta feature retira ese comando. Va tras esta o redefine el comando; no lo decido yo (pendiente del dev-lead).
12. Delta probado sobre una copia de `.docs/sdd`: `capability merge` → «quitado Cancelar una reserva propia · añadido Cancelar una reserva · quitado Anular una reserva · añadido Un comando desconocido no cambia ninguna reserva» (repetido tras la review), `capability check` → «Capacidades válidas: 1». El merge deja el purpose como está: el cambio de la decisión 5 se hace a mano en el cierre.
13. Quitar «propia» del título no cambia el comportamiento: ni el escenario ni el código comprueban de quién es la reserva (el producto tiene un solo usuario, `PRODUCT.md`). Lo que `cancelar` deba permitir sobre reservas ajenas no se toca aquí y queda para la 0011.
14. Requisito nuevo «Un comando desconocido no cambia ninguna reserva» (`anular Norte lun` → `salas`, la reserva sigue activa): es la forma de que la retirada quede en la verdad viva de `bookings`; el título y el texto son míos.
15. Reglas de la capacidad: sin cambio. El delta no introduce datos, nombres, topes, avisos ni conflictos nuevos; los datos siguen en memoria en `src/app.js`, sin el estado `voided`.

### Hallazgos de la review

- **Rechazado** — Crítico (dominio): el choque con la fila 0011 está sin resolver → no lo decido yo ni cambia esta spec: el dev-lead pidió retirar `anular`. Queda como pendiente explícito (decisión 11) y te lo pregunto en el gate.
- **Aceptado** — Importante (dominio y técnica): el comportamiento nuevo solo estaba en el motivo de un REMOVED → requisito ADDED «Un comando desconocido no cambia ninguna reserva» (decisión 14).
- **Aceptado** — Importante (dominio): quitar «propia» parecía un MODIFIED encubierto, y faltaba el complemento del rol → decisión 13: no cambia el comportamiento; lo ajeno queda para la 0011.
- **Rechazado** — Importante (dominio): faltan las cinco reglas → el delta no introduce ninguna nueva; decisión 15.
- **Aceptado** — Importante (dominio y técnica): el Intent prometía más de lo que cubre el Scope → Intent acotado a guía, README y capacidad.
- **Aceptado** — Importante (técnica): nada fijaba la ausencia de `anular` en docs y purpose, ni el RED previo → comprobación `git grep` y RED visto, en «Dónde se prueba».
- **Aceptado** — Importante (técnica): «previsto 28» sin cálculo y gate de cierre → tabla de topes y «Dónde se prueba».
- **Aceptado** — Menor: la decisión 12 contradecía la 5, y el Approach razonaba con dos roles que el producto no tiene → corregidos.
- **Rechazado** — Menor (técnica): usar MODIFIED para el renombre → el kit fija que un renombre es REMOVED + ADDED; el merge lo hizo bien.

### Decisiones tomadas con el dev-lead

- Se retira el comando `anular` — «decidido con el dev-lead: se retira el comando anular».
- El requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva» — «el requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva»».
- La guía `docs/guia.md` se actualiza — «la guía docs/guia.md se actualiza».
- Perfil delegate — «Perfil delegate».

## Intent

Hoy el comando `anular` convive con `cancelar` y la guía ya anuncia que la 0012 lo retira. El éxito es que quien teclee `anular` no anule nada, que `cancelar` siga igual y que ni la guía, ni el README, ni la capacidad nombren un comando que ya no existe. Anti-objetivo: que `anular` siga haciendo algo a escondidas (un alias) o que quede un hueco entre código, guía, README y capacidad. `PRODUCT.md` (término «Anulación») y la fila 0011 quedan fuera a propósito (decisiones 6 y 11).

## Scope

- Entra: quitar `anular` de `run` y borrar `voidBooking` en `src/app.js`; un test que lo fija en `test/`; la línea de `anular` en `docs/guia.md`; la mención en `README.md`; el delta en `capabilities/bookings.md` y su purpose.
- No entra: `PRODUCT.md`, `CHANGELOG.md`, la fila 0011, cualquier permiso por rol, el motivo al cancelar (0010).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| comando `anular` y respuesta `anulada <sala> <día>` | `src/app.js:31`, `src/app.js:24` | Scope · decisión 1 |
| función `voidBooking` y estado `voided` | `src/app.js:20-25` | Scope · decisión 8 |
| línea de `anular` (y «lo retira la 0012») | `docs/guia.md:8` | Scope · decisión 3 |
| «`cancelar` y `anular`» | `README.md:5` | Scope · decisión 4 |
| requisito «Anular una reserva» | `capabilities/bookings.md:16` | delta, `REMOVED` |
| requisito «Cancelar una reserva propia» (renombre) | `capabilities/bookings.md:7` | delta, `REMOVED` + `ADDED` |
| purpose «…cancelar y anular salas…» | `capabilities/bookings.md:5` | Scope · decisión 5 |
| término «Anulación» | `PRODUCT.md:14` | fuera: decisión 6 |
| «Anular reservas de otros» | `ROADMAP.md:8` | fuera: decisión 11 |

- Filas que implementa: 0012 → `docs/guia.md:8` («lo retira la 0012») y su destino arriba | `ROADMAP.md` la cierra el cierre de la feature.

## Approach

- Borrar el comando y su función — el cambio más pequeño y el único que cumple «el comando desaparece»; `anular` cae en la respuesta por defecto.
- Alias de `cancelar` — mantiene a quien ya teclea `anular`, pero el comando no desaparece, que es lo que se pidió.
- Aviso «comando retirado» — informa, pero inventa un texto nuevo y un caso especial para un comando que no existe.
- Elegido: borrar el comando y su función — lo dijo el dev-lead: «se retira el comando anular».

## Dónde se prueba

- `anular` ya no hace nada: por `run`, como `test/cancel.test.js`; `run('anular', ['Norte','lun'])` da lo mismo que un comando cualquiera desconocido, `salas`, y un `cancelar Norte lun` posterior sigue dando `cancelada Norte lun`. El RED se ve fallar antes de borrar (hoy responde `anulada Norte lun`).
- Nada nombra ya `anular`: `git grep -n anular -- src README.md docs .docs/sdd/capabilities` vacío (comprobación de la Task de documentos, incluido el purpose).
- Gate de cierre: `node --test && node scripts/lint.mjs` enteros; la fila 0012 de `ROADMAP.md` la cierra el cierre de la feature.
- `cancelar` sigue igual: los tests de `test/cancel.test.js` actuales.
- Guía dentro de su tope: `test/words.test.js`, sin cambios.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### REMOVED — Cancelar una reserva propia

- motivo: renombrado a «Cancelar una reserva»; el escenario no cambia.

#### ADDED — Cancelar una reserva

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `cancelar Norte lun`
- THEN la reserva queda cancelada y responde `cancelada Norte lun`
- AND sin reserva ese día responde `sin reserva Norte lun`

#### REMOVED — Anular una reserva

- motivo: se retira el comando `anular` (decisión del dev-lead).

#### ADDED — Un comando desconocido no cambia ninguna reserva

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `anular Norte lun`
- THEN responde `salas`
- AND la reserva de Norte el lunes sigue activa

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/guia.md` | 42 / 60 (`wc -w` → 42) | 18 | sin cambio; previsto 28 (42 menos la línea de `anular`, medido sobre la guía ya sin ella). `test/words.test.js` solo mide este fichero |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
