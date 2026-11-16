---
id: 20261106-093404-feature-0012-retire-void
feature: 0012
title: Retirar el comando anular
mode: full
status: draft
created: 2026-11-06
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Retirar el comando anular

🦆 Hoy `salas anular Norte lun` anula la reserva de Norte del lunes y responde `anulada Norte lun`. Tras el cambio el comando `anular` deja de existir: se comporta como cualquier palabra que la herramienta no conoce y responde `salas`, y la reserva sigue activa (`cancelar Norte lun` la cancela como siempre). La capacidad `bookings` pierde el requisito «Anular una reserva», «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva», y README, guía y vocabulario dejan de mencionar `anular`. Por dentro se borran `voidBooking`, la rama `anular` de `run` y el estado `voided`.

Validación: dev-lead — retira un comando que la persona usa en la terminal; solo ella confirma que `anular` ya no responde.

## Capacidades

- Modificadas: `bookings` — se retira «Anular una reserva», «Cancelar una reserva propia» pasa a «Cancelar una reserva» y el propósito deja de nombrar anular.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: contrato público (el comando `anular` de la CLI), MODIFIED/REMOVED (tres requisitos entre `REMOVED` y `ADDED`), regla de visibilidad (se retira lo que hacía solo el responsable de sala) · tamaño: ~40 líneas en 6 ficheros
- Dominio (opus): si quitar «propia» del título y el rol «responsable» que sale con `anular` dejan abierto de quién es la reserva que se cancela (señal: REMOVED + rol que desaparece)
- Técnica (sonnet): si `REMOVED` + `ADDED` fusiona como renombrado y si la respuesta `salas` y el tope de la guía tienen dónde comprobarse (señal: contrato público)
- Mínimo razonable: solo dominio — deja sin mirar la fusión del renombrado y el tope de palabras de la guía

### Hallazgos de la review

- **Aceptado** (dominio 1) — quitar «propia» podría ampliar la regla → decisión 3 y Intent dicen que el cuerpo del requisito nunca restringió de quién es la reserva (el código de `cancelBooking` no lo comprueba): no hay ampliación de comportamiento.
- **Rechazado** (dominio 2) — falta el complemento de rol → la misión dice que lo usa una sola persona y los roles son de la 0011 y la 0010; añadir aquí «no hay dueño ni roles» crearía una regla nueva que nadie pidió.
- **Aceptado** (dominio 3) — el rol «responsable» queda huérfano → el Intent dice que sale de `bookings`; su único término, «Anulación», se retira (decisión 7).
- **Aceptado** (dominio 4, técnica 10) — el criterio de éxito choca con la fila 0011 → el Intent excluye la fila 0011 y el historial; la 0011 la reordena el dev-lead y no bloquea esta feature (decisión 8).
- **Aceptado** (dominio 5, técnica 8) — la decisión 7 quedaba abierta → pasa a decisión firme; la aprobación de la spec la confirma.
- **Aceptado** (dominio 6, técnica 3) — el Propósito se edita a mano sin traza → va al Scope, a la decisión 4 y a «Dónde se prueba» con `git grep -n -i anul .docs/sdd/capabilities` sin resultados.
- **Aceptado** (dominio 7, técnica 6 en parte) — faltan las cinco reglas → decisión 11: no cambian; los datos viven en memoria, así que retirar `voided` no migra nada.
- **Aceptado** (dominio 8) — el motivo del `REMOVED` afirmaba un comportamiento → el motivo queda en «se retira el comando `anular` (0012)».
- **Rechazado** (técnica 1) — falta un requisito de comando desconocido → decisión 2: no hay requisito de eso hoy y no se crea; la respuesta `salas` se fija en un test con nombre trazable.
- **Rechazado** (técnica 2) — el AND del `ADDED` sin su propio escenario → es el AND literal del requisito vigente y la regla del renombrado es copiar el cuerpo sin tocarlo; el merge sobre la copia lo fusionó bien.
- **Aceptado** (técnica 4) — el fichero de la prueba nueva era ambiguo, y los `git grep` y la constitución → la prueba va en `test/retired.test.js` (nuevo) y la decisión 12 declara que README, `PRODUCT.md` y la capacidad se comprueban con `git grep` y no con un test.
- **Rechazado** (técnica 5) — el lint no está en el gate → está: el gate de cierre de `operations.md` es `node --test && node scripts/lint.mjs`; el Intent lo cita así.
- **Aceptado** (técnica 7) — el conteo de la guía era una estimación → medido: 42 hoy, 28 después (14 palabras la línea de `anular`; el cambio de «tu» a «una» no cambia la cuenta).
- **Aceptado** (técnica 9) — changelog y versión sin dueño → el changelog lo escribe el cierre (`add-to-changelog`); la versión es asunto de la release.

1. **Enfoque (central)**: se borra el comando y su código —`voidBooking`, la rama `anular` de `run`, el estado `voided`— y `anular` cae en la respuesta por defecto de `run`, `salas`, como cualquier comando desconocido. Descartados: responder un aviso «anular está retirado» (el roadmap dice «el comando anular desaparece»; un aviso sería un comando que sigue existiendo) y dejar `voidBooking` sin cablear (código muerto).
2. **Qué responde `anular` tras retirarlo**: `salas`, la respuesta por defecto actual de un comando desconocido; nadie dijo otra cosa. Va a la prueba, no a un requisito: no hay requisito de «comando desconocido» y no lo creo.
3. **El renombrado conserva el cuerpo**: «Cancelar una reserva» copia GIVEN/WHEN/THEN de «Cancelar una reserva propia» sin tocar una palabra; el renombrado es `REMOVED` del título viejo + `ADDED` del nuevo (clave de fusión). Que el título no diga «propia» no amplía nada: el cuerpo nunca restringió de quién es la reserva y `cancelBooking` no lo comprueba, así que el comportamiento de `cancelar` es el mismo. No añado reglas de dueño o de roles (la misión: una sola persona; los roles son asunto de la 0011).
4. **Propósito de la capacidad**: «Reservar, cancelar y anular salas desde la línea de comandos.» pasa a «Reservar y cancelar salas desde la línea de comandos.» El merge del delta no toca el Propósito (lo comprobé en la copia), así que esa línea se edita a mano en `capabilities/bookings.md` junto con el resto del cambio.
5. **README**: `Comandos: cancelar y anular` pasa a `Comandos: cancelar`; dejarlo sería documentar un comando que no existe.
6. **Guía** (el dev-lead pidió actualizarla; el texto es mío): se borra la línea de `anular` y `cancelar` pasa de «cancela tu reserva» a «cancela una reserva», para casar con el requisito renombrado. Cabe en su tope de 60 palabras (42 hoy, 28 después, medido con el conteo de `test/words.test.js`).
7. **`PRODUCT.md`**: se borra la entrada de Terminología «Anulación» (queda sin comando ni requisito que la use, y con ella el rol «responsable de sala» sale de los documentos) y no toco «Cancelación». Es decisión firme; aprobar la spec la confirma.
8. **Conflicto con el roadmap, sin resolver aquí**: la fila 0011 («Anular reservas de otros: solo el responsable de cada sala anula…») se lista antes que la 0012 y presupone el comando que esta feature borra. No toco la 0011 y no bloquea esta feature; antes de implementarla hay que reordenarla o descartarla (lo decide el dev-lead, vía `sdd-roadmap`).
9. **Historial que no se toca**: `changelog.md` (entrada 0.3.0 «Cancelar una reserva propia»), «Releases cerradas» del roadmap y la carpeta del patch 0007 describen lo entregado con el nombre que tenía.
10. **Sin `§Frontend`**: es una herramienta de terminal sin pantalla y nada visual cambia; sin `Se valida en:`, todo se ve desde la rama.
11. **Las cinco reglas de `bookings` no cambian**: datos en memoria (retirar `voided` no migra nada, no hay datos persistidos), nombres en castellano, sin límites, avisos ni regla ante conflicto nuevos.
12. **Cómo se comprueba cada parte**: la prueba nueva va en `test/retired.test.js` (fichero nuevo; `test/cancel.test.js` no se toca); README, `PRODUCT.md` y la capacidad se comprueban con `git grep`, no con un test, porque no hay comportamiento que ejecutar. Changelog y versión no entran: el cierre escribe la entrada con `add-to-changelog` y la versión es asunto de la release.
- Política de modelos: revisores de la spec — dominio Opus, técnica Sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, sin eje de arquitectura (no hay `architecture.md`) · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar.
- Resultado del delta sobre una copia de `.docs/sdd` (`sdd capability merge`, salida 0): «quitado «Cancelar una reserva propia»», «añadido «Cancelar una reserva»», «quitado «Anular una reserva»»; `bookings.md` queda con un solo requisito y el Propósito sin cambiar (decisión 4).

### Decisiones tomadas con el dev-lead

- Se retira el comando anular — «se retira el comando anular»
- El requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva» — «el requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva»»
- La guía `docs/guia.md` se actualiza — «la guía docs/guia.md se actualiza»
- Perfil delegate — «Perfil delegate» (coincide con `control.profile` de `sdd-kit.json`)

## Intent

Hoy `anular` es un segundo camino para quitar una reserva, solo para el responsable de sala, y convive con `cancelar`. El dev-lead decide que desaparezca. Con él sale de `bookings` el rol «responsable de sala», que solo existía en ese requisito. Éxito: `salas anular Norte lun` responde `salas` y deja la reserva activa; ningún documento vigente (README, guía, capacidad, vocabulario) nombra ya `anular` como comando; el gate de cierre de `operations.md` (`node --test && node scripts/lint.mjs`) sigue en verde. Quedan fuera de ese criterio la fila 0011 del roadmap y el historial (decisiones 8 y 9). Fracaso aunque funcione: que la herramienta responda algo distinto de lo que dice un documento, o que `cancelar` cambie de comportamiento.

## Scope

- Entra: borrar `voidBooking`, la rama `anular` de `run` y el estado `voided` en `src/app.js`; la prueba de que `anular` ya no existe; el delta de `bookings` y la edición a mano de su Propósito; las ediciones de `README.md`, `docs/guia.md` y `PRODUCT.md` de las decisiones 5–7.
- No entra: la fila 0011 y su reordenación; `cancelar` (comportamiento, motivo de la 0010); `changelog.md`, «Releases cerradas» y specs antiguas; la entrada de `PRODUCT.md` «Cancelación».

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Comando `anular`, `voidBooking` y estado `voided` | `src/app.js:20-25` (función), `src/app.js:31` (rama de `run`) | Scope: se borran; decisión 1 |
| Respuesta `anulada Norte lun` | `bookings.md:20` | delta `REMOVED` de «Anular una reserva» |
| Requisito «Anular una reserva» | `bookings.md:16` | delta `REMOVED` |
| Título «Cancelar una reserva propia» | `bookings.md:9`; `changelog.md:20` y `roadmap.md:34` (historial de la 0.3.0) | delta `REMOVED` + `ADDED` del título nuevo; historial intacto (decisión 9) |
| Propósito «cancelar y anular salas» | `bookings.md:5` | decisión 4 |
| `anular` en los comandos | `README.md:5` | Scope; decisión 5 |
| Línea de `anular` y «cancela tu reserva» | `docs/guia.md:7-8` | Scope; decisión 6 |
| Término «Anulación» | `PRODUCT.md:10` | Scope; decisión 7 |
| Fila 0011 «Anular reservas de otros» | `roadmap.md:8` | No entra; decisión 8 |

- Filas que implementa: 0012 → `docs/guia.md:8` («lo retira la 0012») desaparece con la línea; `roadmap.md:9` es su propia fila y la cierra `sdd-archive`. Comprobado con `git grep -n -i -E "anul|voided|voidBooking|0012"` fuera de `.docs/sdd/specs/`.

## Approach

Decidido con el dev-lead: el comando `anular` desaparece y el requisito pasa a llamarse «Cancelar una reserva». El cómo —borrar el código y dejar que `anular` caiga en la respuesta por defecto— está en la decisión 1.

## Dónde se prueba

- `anular` retirado: en `test/retired.test.js` (nuevo), por `run('anular', ['Norte', 'lun'])` con el mismo patrón que `test/cancel.test.js`; el test se llama «anular ya no existe»: responde `salas` y un `cancelar Norte lun` posterior sigue respondiendo `cancelada Norte lun`.
- `cancelar` sin cambios: los dos tests actuales de `test/cancel.test.js`, que no se tocan.
- README, guía y `PRODUCT.md`: sin test nuevo; `git grep -n -i "anular"` fuera de `.docs/sdd/specs/`, `changelog.md`, «Releases cerradas» y la fila 0011 no debe dar nada vigente. El tope de la guía lo cubre `test/words.test.js`.
- Propósito de `bookings`: `git grep -n -i anul .docs/sdd/capabilities` no da resultados tras editar el Propósito.

## Términos y ADR

- Términos resueltos: «Anulación» se retira del vocabulario; «Cancelación» queda como único término.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `bookings`

#### REMOVED — Cancelar una reserva propia

- motivo: el requisito se renombra a «Cancelar una reserva»; el título es la clave de fusión.

#### ADDED — Cancelar una reserva

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `cancelar Norte lun`
- THEN la reserva queda cancelada y responde `cancelada Norte lun`
- AND sin reserva ese día responde `sin reserva Norte lun`

#### REMOVED — Anular una reserva

- motivo: se retira el comando `anular` (0012).

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/guia.md` | 42 / 60 | 18 | sin cambio (la edición lo acorta a 28) |

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
