---
id: 20261112-211650-feature-0012-retirar-anular
feature: 0012
title: Retirar el comando anular
mode: full
status: draft
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Retirar el comando anular

🦆 Hoy, si escribes `anular Norte lun`, el responsable de sala anula la reserva y la herramienta responde `anulada Norte lun`. Con este cambio ese comando deja de existir: `anular Norte lun` responde `salas`, como cualquier comando que la herramienta no conoce, y la reserva sigue ahí. `cancelar Norte lun` no cambia y responde `cancelada Norte lun`; solo cambia el nombre del requisito que lo describe, que deja de decir «propia». La guía y el README dejan de nombrar `anular`. Por dentro se borra su función y el estado «anulada», que nada más usa.

Validación: dev-lead — es un comando que una persona usa: hay que ver que `anular` ya no responde y que `cancelar` sigue igual.

## Capacidades

- Modificadas: `bookings` — se retira el requisito «Anular una reserva», «Cancelar una reserva propia» pasa a «Cancelar una reserva» y entra el escenario de que `anular` ya no se reconoce.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: `MODIFIED`/`REMOVED` (tres requisitos de `bookings`), contrato público (`anular` es un comando de la interfaz de la herramienta) · tamaño: ~40 líneas en 7 ficheros
- Dominio (opus): si retirar «Anular una reserva» deja a alguien sin poder hacer lo que el rol de responsable de sala hacía, y si el renombrado a «Cancelar una reserva» mantiene los dos escenarios (`cancelada Norte lun`, `sin reserva Norte lun`) sin dejar la regla de «propia» a medias en PRODUCT.md (señal: `MODIFIED`/`REMOVED`)
- Técnica (sonnet): si borrar `voidBooking` y el estado `voided` de `src/app.js` rompe algo más y si el test de `anular → salas` prueba lo que dice sin depender del estado compartido en memoria (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si el comando retirado choca con la regla de negocio del responsable de sala

1. **⚠ La fila 0011 del roadmap («Anular reservas de otros: solo el responsable de cada sala anula reservas de otras personas») pide justo lo que esta feature retira.** No la toco (cambiar la planificación es de `sdd-roadmap`); el dev-lead decide su destino antes de arrancarla (descartarla, o reabrir un comando con otro nombre); esta feature no la bloquea ni el cierre toca `ROADMAP.md:8`. — la spec no puede resolver una contradicción entre dos filas.
2. Enfoque: A (borrar la función y la línea que la despacha) frente a B (dejar la función sin despachar, código muerto) y C (responder un mensaje «comando retirado») — ver Approach.
3. `anular Norte lun` responde `salas`, la respuesta que hoy da cualquier comando desconocido (`src/app.js`, último `return`); no escribo un mensaje propio. Va como requisito ADDED «Anular ya no se reconoce» para que la retirada tenga su escenario.
4. El renombrado va como `REMOVED` del título viejo + `ADDED` del nuevo (el título es la clave de fusión), con el mismo escenario y los mismos literales.
5. Al quitar «propia», la guía pasa de «cancela tu reserva» a «cancela la reserva»: el requisito lo dijo el dev-lead; el cambio de la frase de la guía es mío.
6. Se borra el estado `voided` junto a `voidBooking`: las reservas viven en memoria, no hay datos anulados que conservar.
7. `PRODUCT.md`: se elimina el término **Anulación** (concepto retirado). **No toco Cancelación** («la que anula el propio cliente antes de 24 h»): habla del cliente y de 24 h, que ni el requisito ni el código aplican hoy. Dime si quieres reescribirla.
8. Propósito de `bookings`: «Reservar y cancelar salas desde la línea de comandos.» (sin «anular»); no es un requisito y la fusión del delta no lo toca, por eso va aparte (decisión 15).
9. README: «Comandos: `cancelar` y `anular`» → «Comando: `cancelar`»; se queda tan incompleto como está (no nombra `libres` ni `reservar`), no lo amplío.
10. `CHANGELOG.md` no se toca: lo escribe el corte de `sdd-end-release` (entrada `Removed`). El «Cancelar una reserva propia.» de la 0.3.0 es historia publicada y se queda.
11. Fichero de test propio para el escenario de `anular`: las reservas viven en memoria y cada fichero de test es un proceso, así que `cancelar` después de `anular` prueba que la reserva sigue activa sin pisar `test/cancel.test.js`.
12. Reglas de la capacidad: sin cambios y el delta no lleva ese bloque; siguen las vigentes (datos en memoria, en `src/app.js` · comandos en castellano · límites, avisos y regla ante conflicto: no aplica).
14. Quitar «propia» del título no cambia quién puede cancelar: ni los escenarios ni el código (`cancelar` no comprueba dueño) distinguen de quién es la reserva; el título pasa a decir lo que ya hacía. Con `anular` fuera, el responsable de sala pierde su única acción propia y `PRODUCT.md` no define ese rol más allá del término Anulación, que sale.
15. El `Propósito` de `bookings` lo edita la última task del plan, no el cierre; se comprueba con `git grep -niwE "anular|anulada|anulación" -- README.md docs PRODUCT.md .docs/sdd/capabilities`, que debe salir vacío.
13. Delta probado en una copia de `.docs/sdd` fuera del repo: `sdd capability merge` sale con código 0 y dice «quitado «Anular una reserva»», «quitado «Cancelar una reserva propia»», «añadido «Cancelar una reserva»», «añadido «Anular ya no se reconoce»»; el `Propósito` no cambia con la fusión (de ahí la decisión 8). Medido: `docs/guia.md` 42 palabras, la línea de `anular` 14 → 28.
- Política de modelos: dominio opus y técnica sonnet en la review de esta spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — técnica 2 y dominio 8: el título genérico prometía más de lo probado → renombrado a «Anular ya no se reconoce».
- **Aceptado** — técnica 3: el GIVEN del test no estaba preparado → «Dónde se prueba» dice que la reserva `Norte lun` viene sembrada en `src/app.js` y que el fichero de test es propio, sin cancelaciones previas.
- **Aceptado** — técnica 8: texto verificable solo a ojo → comprobación con `git grep` en «Dónde se prueba» y en la decisión 15.
- **Aceptado** — técnica 9 y dominio 9: `Propósito` sin dueño → lo edita la última task del plan (decisión 15).
- **Aceptado** — técnica 4: nadie decidía la 0011 → decisión 1 dice que la decide el dev-lead y que no bloquea esta feature.
- **Aceptado** — técnica 10: el criterio de fracaso del estado sin listar no tenía prueba → se enlaza al `git grep` de `voided`.
- **Aceptado** — dominio 1: el Intent prometía que ningún término nombra `anular` y Cancelación usa el verbo «anula» → el Intent se limita al comando y a los sustantivos.
- **Aceptado** — dominio 2 y 4: faltaba decir que quitar «propia» no cambia quién cancela y qué pierde el responsable → decisión 14.
- **Aceptado** — dominio 6: las cinco reglas sin nombrar → decisión 12 las enumera con sus valores vigentes.
- **Rechazado** — técnica 1 (dos escenarios en «Cancelar una reserva»): es el texto vigente del requisito, que el dev-lead renombra y no reescribe; separarlo cambia más que el nombre.
- **Rechazado** — técnica 6 (otro código que lea el estado): `src/app.js` solo compara `status === 'active'` (líneas 5 y 9); nada lee `voided`, y la comprobación final cubre el resto.
- **Rechazado** — técnica 7 (método de conteo): 42 y 14 salen de la misma expresión que `test/words.test.js`.
- **Rechazado** — dominio 3 y 5 (reescribir Cancelación ya; la 0011 como bloqueo): la regla de «24 h» es del dueño del producto y no la borro por mi cuenta; sigue en la decisión 7 para que la decidas al aprobar. La 0011 está ⏳ y es independiente: aprobar esta spec no consolida nada que ella no pueda cambiar después.
- **Rechazado** — dominio 7 (regla ante conflicto): el estado es en memoria y el segundo `cancelar` sobre la misma reserva responde `sin reserva`; no hay conflicto que resolver.
- **Rechazado** — dominio 10 (nombres en inglés y roles): `voidBooking` y `voided` son identificadores existentes que se borran, no términos nuevos; «dev-lead» es el rol del kit, no del producto.
- Sin Críticos y sin decisión central reescrita: no hay segunda ronda.

### Decisiones tomadas con el dev-lead

- Se retira el comando `anular` — «se retira el comando anular»
- El requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva» — «el requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva»»
- La guía `docs/guia.md` se actualiza — «la guía docs/guia.md se actualiza»
- Perfil delegate — «Perfil delegate»

## Intent

Hoy la herramienta tiene dos formas de dar de baja una reserva, `cancelar` y `anular`, y la 0012 del roadmap decide que solo quede `cancelar`. Éxito: `anular Norte lun` ya no hace nada (responde `salas`, la reserva sigue activa), `cancelar Norte lun` responde lo mismo que antes, y ni la capacidad, ni la guía, ni el README, ni los términos del producto nombran ya el comando `anular` ni el término Anulación (el verbo «anula» de la definición de Cancelación queda para la decisión 7). Fracaso aunque funcione: que quede código o texto que prometa un comando que no existe, o un estado `voided` en el código (`git grep -n voided -- src` vacío). Quien era responsable de sala pierde su única acción propia (decisión 14).

## Scope

- Entra: borrar `voidBooking` y la línea que despacha `anular` en `src/app.js`; el test del escenario retirado; el delta de `bookings` (retirar, renombrar, añadir el escenario); `docs/guia.md` (línea de `anular` fuera, «cancela la reserva»); `README.md` (línea de comandos); `PRODUCT.md` (término Anulación fuera); `Propósito` de `bookings`.
- No entra: la fila 0011 del roadmap; la definición de Cancelación en `PRODUCT.md`; `CHANGELOG.md` (lo escribe el corte de la release); un mensaje propio para comandos desconocidos; cualquier cambio de `cancelar`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| comando `anular` y `voidBooking` | `src/app.js:20-24`, `src/app.js:31` | Scope; borrar; el escenario ADDED lo prueba |
| estado `voided` | `src/app.js:23` (único sitio) | decisión 6 |
| requisito «Anular una reserva» | `.docs/sdd/capabilities/bookings.md:16-20` | delta, `REMOVED` |
| requisito «Cancelar una reserva propia» | `.docs/sdd/capabilities/bookings.md:9-14`; `CHANGELOG.md:21` («Cancelar una reserva propia.», 0.3.0) | delta, `REMOVED` + `ADDED` «Cancelar una reserva»; el CHANGELOG es historia publicada, no se toca (decisión 10) |
| «anular» en el Propósito | `.docs/sdd/capabilities/bookings.md:5` | decisión 8, Scope |
| `anular` en la guía y «cancela tu reserva» | `docs/guia.md:8`, `docs/guia.md:7` | Scope, decisión 5 |
| `anular` en el README | `README.md:5` | Scope, decisión 9 |
| término Anulación | `PRODUCT.md:14` | Scope, decisión 7 |
| definición de Cancelación («el propio cliente») | `PRODUCT.md:13` | No entra, decisión 7 |
| fila 0011 «Anular reservas de otros» | `ROADMAP.md:8` | No entra, decisión 1 |

- Filas que implementa: 0012 → `docs/guia.md:8` («lo retira la 0012») sale con su línea; `ROADMAP.md:9` es su propia fila | nada más: comprobado con `git grep -niE "0012|anul|void" -- . ':!.docs/sdd/specs'`

## Approach

- A. Borrar `voidBooking` y su línea en `run` — dos cambios pequeños en `src/app.js`; el comando cae en el `return 'salas'` de siempre y no queda código muerto.
- B. Dejar `voidBooking` sin despachar — el cambio visible es el mismo, pero queda una función exportada que nadie llama y un estado que nadie lista.
- C. Responder un mensaje propio («anular ya no existe») — es una respuesta nueva que nadie pidió, y obliga a decidir su texto y a mantenerlo.
- Elegido: A — es lo que pide «el comando anular desaparece» y no añade comportamiento nuevo.

Un comando que no se reconoce responde `salas`, como hoy.

## Dónde se prueba

- `anular` ya no existe: por `run('anular', ['Norte', 'lun'])`, como los tests de `test/cancel.test.js` y `test/app.test.js`, en fichero propio (decisión 11), con la reserva `Norte lun` que `src/app.js` trae sembrada y sin cancelaciones previas en ese proceso: el orden es `anular`, y después `cancelar`; la reserva sigue activa porque `run('cancelar', ['Norte', 'lun'])` después responde `cancelada Norte lun`.
- Cancelar una reserva (renombrado): los dos tests actuales de `test/cancel.test.js` siguen siendo su prueba, sin cambio.
- Guía: `test/words.test.js` (tope de 60 palabras) sigue en verde.
- Textos (README, guía, PRODUCT, `Propósito`): `git grep -niwE "anular|anulada|anulación" -- README.md docs PRODUCT.md .docs/sdd/capabilities` sale vacío; `git grep -n voided -- src`, también; y los lee el dev-lead en la validación.

## Términos y ADR

- Términos resueltos: Anulación — retirado del producto (decisión 7).
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### REMOVED — Anular una reserva

- motivo: el comando `anular` se retira (roadmap 0012).

#### REMOVED — Cancelar una reserva propia

- motivo: renombrado a «Cancelar una reserva»; el requisito sigue vigente con el título nuevo.

#### ADDED — Cancelar una reserva

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `cancelar Norte lun`
- THEN la reserva queda cancelada y responde `cancelada Norte lun`
- AND sin reserva ese día responde `sin reserva Norte lun`

#### ADDED — Anular ya no se reconoce

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `anular Norte lun`
- THEN responde `salas`
- AND la reserva sigue activa: `cancelar Norte lun` responde después `cancelada Norte lun`

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/guia.md` | 42 / 60 | 18 | previsto −14 (línea de `anular`; «tu»→«la» no cambia el conteo) → 28 + 2 % · sin cambio (60) |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
