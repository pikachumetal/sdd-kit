---
id: 20261119-160411-feature-0012-retire-void
feature: 0012
title: Retirar el comando anular
mode: full
status: draft
created: 2026-11-19
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Retirar el comando anular

🦆 Hoy `salas anular Norte lun` anula la reserva de otra persona y responde `anulada Norte lun`. Con este cambio el comando deja de existir: escribirlo responde `salas`, igual que cualquier comando que la herramienta no conoce, y la reserva sigue activa. El requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva», y la guía deja de mencionar `anular`. Por dentro se borran la función `voidBooking`, su línea en `run` y el estado `voided`.

Validación: dev-lead — el comando lo usa una persona desde la terminal y conviene que quien lo usa confirme lo que ve (la respuesta `salas` y la guía).

## Capacidades

- Modificadas: `bookings` — se retira «Anular una reserva», «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva» y se añade «Comando retirado: anular» (qué ve quien lo escribe).

## ✋ Decisiones que he tomado yo — valida estas

1. Enfoque: borrar `voidBooking` y su línea de `run`, frente a B (dejar `anular` con un aviso «comando retirado») y C (dejar la función sin exponerla); ver Approach.
2. Tras el cambio, `anular Norte lun` responde `salas` (la respuesta actual de `run` para cualquier comando desconocido), sin aviso propio: se pidió que el comando desaparezca, y un aviso sería un comportamiento nuevo que nadie pidió.
3. El estado `voided` desaparece del código; ninguna otra parte lo lee (`src/app.js:20-25`, comprobado con `grep -rn "void"`).
4. El requisito se renombra con `REMOVED` del título viejo + `ADDED` del nuevo (regla de renombrado del delta). Quitar «propia» no cambia lo que hace `cancelar` (el código nunca comprobó de quién es la reserva: `src/app.js:13-18`), pero sí lo que el requisito promete: desaparece la condición de titularidad. Lo dejo escrito en el nuevo requisito («cualquier persona puede cancelarla») — es lo que implica el nombre que decidió el dev-lead; recházalo si querías otra cosa.
4 bis. Nuevo requisito `ADDED` «Comando retirado: anular» (`anular` ya no existe y responde `salas`; solo cubre ese comando, no fija un contrato general de comandos desconocidos): sin él, el test de «Dónde se prueba» no tendría requisito detrás. Es comportamiento que hoy no estaba escrito en `capabilities/`, aunque ya existía en el código (`run` devuelve `salas` por defecto, sea cual sea el argumento).
5. La línea de Propósito de `bookings` («Reservar, cancelar y anular salas…») pasa a «Reservar y cancelar salas desde la línea de comandos»: el delta no fusiona el Propósito, así que se edita a mano en el cierre.
6. `README.md:5` («Comandos: `cancelar` y `anular`») pasa a «Comandos: `cancelar`»: nombra un comando que deja de existir, aunque el dev-lead solo citó la guía.
7. `docs/guia.md`: se borra la línea de `anular` (incluida «lo retira la 0012») y `cancelar` pasa de «cancela tu reserva» a «cancela una reserva», para casar con el nuevo nombre del requisito.
8. `PRODUCT.md:14`: se borra el término «Anulación», que deja de existir. No toco «Cancelación» (`PRODUCT.md:13`, «el propio cliente antes de 24 h»): su definición no la tocó el dev-lead y puede quedar desfasada respecto a «Cancelar una reserva» ; si prefieres redefinirla (quitar «propio» y «24 h», y el verbo «anula»), dilo en el gate y entra en esta feature.
9. `CHANGELOG.md:20` («Cancelar una reserva propia.», entrada de 0.3.0 ya publicada) no se toca: es historia; la baja de `anular` la escribe el corte de `sdd-end-release`.
10. **Aviso, sin tocar**: la fila 0011 del roadmap («Anular reservas de otros: solo el responsable de cada sala anula…») pide justo lo que esta feature retira: al aprobar la 0012, la 0011 queda por replantear. No edito la fila: es otra feature y otra decisión; la fila 0012 la marca `sdd-archive` al cerrar.
11. La carpeta va en `.docs/sdd/changes/` (como pide el kit) aunque las specs anteriores del proyecto viven en `.docs/sdd/specs/`; el id 0012 sale de la fila del roadmap y no he podido ejecutar `sdd id claim` (la CLI `sdd` no está en el PATH; el merge de la decisión 12 lo ejecuté con la ruta absoluta del `sdd.js` del kit).
12. Delta probado en una copia de `.docs/sdd` con `sdd capability merge`: «quitado «Cancelar una reserva propia» · añadido «Cancelar una reserva» · añadido «Comando retirado: anular» · quitado «Anular una reserva»», sin rechazos; el Propósito queda intacto (de ahí la decisión 5). `git grep` de `anul|void|propia|0012` fuera de `changes/`: todos los sitios están en la tabla de «Lo que se retira».
13. `PRODUCT.md` describe un único usuario, mientras que `anular` suponía un «responsable de sala»; la retirada la decidió el dev-lead y no depende de eso, pero el rol «responsable» queda sin permisos propios (ver Términos). No reescribo el propósito del producto.
14. El test nuevo va en un fichero propio, `test/retired.test.js`: dentro de un fichero los tests comparten la memoria y `test/cancel.test.js` ya cancela Norte lun en su primer test; en un fichero aparte el resultado no depende del orden de los de cancelar.
15. Id 0012 comprobado a mano: ninguna otra fila ni carpeta usa el 0012 (`git grep 0012` solo da la fila de la propia feature y la línea de la guía).
- Política de modelos (solo en `delegate`): revisores de la spec según dimensione `sdd-spec-review` · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- Se retira el comando `anular` — «se retira el comando anular»
- El requisito pasa a llamarse «Cancelar una reserva» — «el requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva»»
- La guía se actualiza — «la guía docs/guia.md se actualiza»
- Perfil delegate — «Perfil delegate»

### Hallazgos de la review

Dos revisores (dominio, opus; técnica, sonnet).

- **Aceptado** — Crítico: quitar «propia» cambia lo que promete el requisito → decisión 4 y AND explícito de titularidad.
- **Aceptado** — Crítico: `anular` sin escenario → `ADDED` «Comando desconocido» (decisión 4 bis).
- **Aceptado** — Crítico: el test compartiría estado con `cancel.test.js` → fichero propio (decisión 14) y orden de asserts.
- **Aceptado** — grep más amplio, rol «responsable» sin permisos propios, 0011 por replantear (Scope y decisión 10), id comprobado (decisión 15), «Cancelación» abierta al gate (decisión 8).
- **Aceptado (2.ª ronda)** — Crítico: grep imposible de dar vacío y éxito que contradecía el requisito nuevo → grep acotado e Intent reformulado; título del requisito acotado a `anular`; export `voidBooking` en Scope; línea del código corregida; fila de `PRODUCT.md:13` en la tabla.
- **Rechazado** — la respuesta `salas` sin escenario: `run` la da por defecto sea cual sea el argumento (`src/app.js:32`) y ahora lleva escenario.
- **Rechazado (2.ª ronda)** — quitar el AND de titularidad: es lo que implica el nombre decidido por el dev-lead y está marcado para que lo rechaces; la redefinición de «Cancelación» queda como pregunta del gate.
- **Rechazado** — poner el aprobador en el frontmatter: lo rellena la aprobación.
- **Rechazado** — alinear el Intent con el usuario único de `PRODUCT.md`: la retirada es decisión del dev-lead; queda dicho en la decisión 13.

## Intent

Hoy el comando `anular` deja anular la reserva de otra persona, y el requisito de cancelar se llama «propia» aunque el comando no comprueba de quién es la reserva. El dev-lead decidió retirar `anular`. Éxito: `anular` no existe en el código ni en la guía y ningún requisito vivo lo promete (solo aparece como el comando retirado que responde `salas`), y `cancelar` sigue funcionando igual (el código no cambia; el requisito deja de prometer «propia», ver decisión 4). Fracaso aunque «funcione»: dejar la guía o el README anunciando un comando que ya no responde, o romper `cancelar`.

## Scope

- Entra: borrar `voidBooking` (un `export` del módulo; ningún otro fichero lo importa, ver decisión 3), su línea en `run` y el estado `voided`; retirar el requisito «Anular una reserva» y renombrar el de cancelar; actualizar `docs/guia.md`, `README.md`, el Propósito de `bookings` y el término de `PRODUCT.md`; un test de que `anular` ya no hace nada.
- No entra: comprobar de quién es la reserva al cancelar; un aviso «comando retirado»; cambiar cómo funciona `cancelar`; la regla de quién puede anular (fila 0011, que queda por replantear tras esta feature); tocar `CHANGELOG.md` ni `ROADMAP.md`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Comando `anular`, `voidBooking`, estado `voided` | `src/app.js:20-25`, `src/app.js:31` | Scope · decisión 3 |
| Requisito «Anular una reserva» | `.docs/sdd/capabilities/bookings.md:16-20` | delta, `REMOVED` |
| Requisito «Cancelar una reserva propia» (título) | `.docs/sdd/capabilities/bookings.md:9`; `CHANGELOG.md:20` | delta, `REMOVED` + `ADDED`; el CHANGELOG no se toca (decisión 9) |
| Propósito «…cancelar y anular salas…» | `.docs/sdd/capabilities/bookings.md:5` | decisión 5 |
| `anular` y «cancela tu reserva» | `docs/guia.md:7-8` | Scope · decisión 7 |
| `anular` en la lista de comandos | `README.md:5` | decisión 6 |
| Término «Anulación» | `PRODUCT.md:14` | decisión 8 |
| Término «Cancelación» («el propio cliente», «anula») | `PRODUCT.md:13` | decisión 8: no se toca salvo que el dev-lead lo pida en el gate |
| Fila «Anular reservas de otros» | `ROADMAP.md:8` | decisión 10: no se toca |

- Filas que implementa: 0012 → `docs/guia.md:8` («lo retira la 0012») se borra con su línea.

## Approach

- A, borrar el comando — `src/app.js` pierde unas 8 líneas; `anular` cae en la rama por defecto de `run` (`salas`). Sin código muerto.
- B, dejar `anular` con un aviso «comando retirado» — añade un comportamiento y un texto que nadie pidió, y habría que retirarlo otra vez después.
- C, dejar `voidBooking` sin exponerla — código muerto que nadie llama; contradice «retirar».
- Elegido: A — es lo que pide «se retira el comando»; las otras añaden comportamiento o dejan código muerto.

`cancelBooking` y `findBooking` no cambian. Las reservas siguen en memoria en `src/app.js`.

## Dónde se prueba

- Comando retirado: `anular` ya no hace nada: en un fichero nuevo `test/retired.test.js` (ver decisión 14), como los tests de cancelar: primero `run('anular', ['Norte','lun'])` da `salas`, después `run('cancelar', ['Norte','lun'])` da `cancelada Norte lun` (la reserva siguió activa). El implementador lo ve fallar antes de borrar `voidBooking` (hoy el primer assert da `anulada Norte lun`).
- `cancelar` sigue igual: los dos tests existentes de `test/cancel.test.js`.
- Guía, README, PRODUCT y capacidad: sin test; el plan lo trae como paso de comprobación: `grep -rniE "anulada|voidBooking|voided|anular" src docs README.md` sin resultados (el test y el requisito «Comando retirado: anular» sí nombran `anular`, a propósito; «Anulación» en `PRODUCT.md` se comprueba aparte: ya no está).

## Términos y ADR

- Términos resueltos: «Anulación» deja de existir — se retira de `PRODUCT.md`; el rol «responsable de sala» no tiene ya permisos propios.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### REMOVED — Cancelar una reserva propia

- motivo: el requisito pasa a llamarse «Cancelar una reserva» (renombrado: `REMOVED` del título viejo + `ADDED` del nuevo); desaparece la condición de titularidad que decía «propia».

#### ADDED — Cancelar una reserva

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `cancelar Norte lun`
- THEN la reserva queda cancelada y responde `cancelada Norte lun`
- AND sin reserva ese día responde `sin reserva Norte lun`
- AND cualquier persona puede cancelarla: el comando no comprueba de quién es la reserva

#### ADDED — Comando retirado: anular

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `anular Norte lun`
- THEN responde `salas`
- AND la reserva sigue activa: `cancelar Norte lun` responde `cancelada Norte lun`

#### REMOVED — Anular una reserva

- motivo: el dev-lead retira el comando `anular`; con él, el rol «responsable» deja de tener permisos propios; `anular Norte lun` pasa a ser un comando desconocido (ver «Comando retirado: anular»).

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
